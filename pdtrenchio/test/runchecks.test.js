import { test } from "node:test";
import assert from "node:assert/strict";
import { runChecks } from "../src/index.js";

// Fake KV + fake fetch (Kraken candles that produce one LONG signal, then hit the stop).
function kv() {
  const m = new Map();
  return { get: async (k, t) => (m.has(k) ? (t === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null),
           put: async (k, v) => { m.set(k, v); } };
}
function rows(closes, start = 1795000000) {
  return closes.map((c, i) => [start + i * 900, String(c), String(c * 1.002), String(c * 0.998), String(c), "0", "1", 1]);
}

test("only trades you entered get exit alerts; overnight exits wait for the 8am summary", async (t) => {
  const { enterPosition } = await import("../src/positions.js");
  const pushes = [];
  let candleRows, minuteRows = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const u = String(url);
    if (/interval=1$/.test(u)) return new Response(JSON.stringify({ error: [], result: { SOLUSD: minuteRows, last: 0 } }));
    if (/interval=5$/.test(u)) return new Response(JSON.stringify({ error: [], result: { SOLUSD: [], last: 0 } }));
    if (u.includes("api.kraken.com")) return new Response(JSON.stringify({ error: [], result: { SOLUSD: candleRows, last: 0 } }));
    pushes.push({ title: init.headers.Title, actions: init.headers.Actions || "" });
    return new Response("ok");
  });
  const env = { STATE: kv(), COINS: "SOL", NTFY_TOPIC: "pdtrenchio-testtopic1", STAKE: "10", SPIKE_HEADSUPS: "off",
    PUBLIC_ORIGIN: "https://pdtrenchio.example" };

  // Daytime: a crossover -> one OPEN push with an "I entered" button
  const closes = [...Array(40).fill(100), 100.5, 101, 101.5];
  for (let n = 30; n <= closes.length + 1; n++) {
    candleRows = rows([...closes, closes.at(-1)].slice(0, n));
    await runChecks(env, new Date("2026-11-20T12:00:00Z"));
  }
  assert.equal(pushes.length, 1);
  assert.match(pushes[0].title, /^OPEN LONG SOL x\d+$/);
  assert.match(pushes[0].actions, /^view, I entered, https:\/\/pdtrenchio\.example\/enter\?id=[a-z0-9]+, clear=true/);
  const id = pushes[0].actions.match(/id=([a-z0-9]+)/)[1];

  // You confirm: £10 at the suggested price and leverage
  let state = await env.STATE.get("state", "json");
  const nowSec = Math.floor(new Date("2026-11-20T12:01:00Z").getTime() / 1000);
  const res = enterPosition(state, id, { stake: "10", entry: "", leverage: "" }, 0.0005, nowSec);
  assert.ok(res.position, res.error);
  await env.STATE.put("state", JSON.stringify(state));

  // Night: price falls through the stop on the 1m chart -> no push, held
  const pos = state.positions["SOL/USD"];
  minuteRows = [[nowSec + 3600, "101", "101", String(pos.stop * 0.99), String(pos.stop * 0.99), "0", "1", 1], [nowSec + 3660, "100", "100", "100", "100", "0", "1", 1]];
  await runChecks(env, new Date("2026-11-20T23:00:00Z"));
  assert.equal(pushes.length, 1);
  state = await env.STATE.get("state", "json");
  assert.equal(state.held.length, 1);
  assert.equal(state.positions["SOL/USD"], undefined);

  // 08:01: one summary
  await runChecks(env, new Date("2026-11-21T08:01:00Z"));
  assert.equal(pushes.length, 2);
  assert.match(pushes[1].title, /^Overnight: 1 update$/);
});

test("spike heads-up: pushed in the day, recorded but not pushed at night, never held", async (t) => {
  const { runChecks } = await import("../src/index.js");
  const pushes = [];
  const T0 = 1795000000 - (1795000000 % 900);
  const calm = (n, step) => Array.from({ length: n }, (_, i) => [T0 + i * step, "100", "100.1", "99.9", "100", "0", "10", 1]);
  let c5;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const u = String(url);
    if (/interval=5$/.test(u)) return new Response(JSON.stringify({ error: [], result: { SOLUSD: c5, last: 0 } }));
    if (/interval=1$/.test(u)) return new Response(JSON.stringify({ error: [], result: { SOLUSD: calm(5, 60), last: 0 } }));
    if (u.includes("api.kraken.com")) {
      // 15m: steady uptrend so the spike is confirmed by the 15m trend straight away
      const up = Array.from({ length: 60 }, (_, i) => [T0 - 60 * 900 + i * 900, String(90 + i * 0.15), String(90.1 + i * 0.15), String(89.9 + i * 0.15), String(90 + i * 0.15), "0", "30", 1]);
      return new Response(JSON.stringify({ error: [], result: { SOLUSD: up, last: 0 } }));
    }
    pushes.push(init.headers.Title);
    return new Response("ok");
  });
  const spikeRow = (t0) => [t0, "100", "101.2", "99.95", "101.1", "0", "40", 1];
  const mk = (n) => [...calm(n, 300), spikeRow(T0 + n * 300), [T0 + (n + 1) * 300, "101.1", "101.2", "101", "101.15", "0", "5", 1]];

  const env = { STATE: (() => { const m = new Map(); return { get: async (k, ty) => (m.has(k) ? (ty === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v) }; })(), COINS: "SOL", NTFY_TOPIC: "pdtrenchio-testtopic1", STAKE: "10" };
  c5 = mk(40);
  await runChecks(env, new Date("2026-11-20T12:00:00Z"));
  assert.equal(pushes.filter((p) => p.startsWith("BIG MOVE UP: SOL")).length, 1);

  const env2 = { ...env, STATE: (() => { const m = new Map(); return { get: async (k, ty) => (m.has(k) ? (ty === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => m.set(k, v) }; })() };
  pushes.length = 0;
  await runChecks(env2, new Date("2026-11-20T23:30:00Z"));
  assert.equal(pushes.length, 0);
  const st = await env2.STATE.get("state", "json");
  assert.equal(st.alerts[0].event, "spike");
  assert.equal(st.alerts[0].sent, false);
  assert.equal(st.held.length, 0);
});
