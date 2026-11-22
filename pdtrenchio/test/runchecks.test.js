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

test("overnight: no new trades; closes held and sent as one 8am summary", async (t) => {
  const pushes = [];
  let candleRows;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const u = String(url);
    if (u.includes("api.kraken.com")) return new Response(JSON.stringify({ error: [], result: { SOLUSD: candleRows, last: 0 } }));
    pushes.push(init.headers.Title || init.headers.title);
    return new Response("ok");
  });
  const env = { STATE: kv(), COINS: "SOL", NTFY_TOPIC: "pdtrenchio-testtopic1", STAKE: "10" };

  // Daytime (12:00 UK): a crossover opens a trade -> one OPEN push
  const closes = [...Array(40).fill(100), 100.5, 101, 101.5];
  for (let n = 30; n <= closes.length + 1; n++) {
    candleRows = rows([...closes, closes.at(-1)].slice(0, n));
    await runChecks(env, new Date("2026-11-20T12:00:00Z"));
  }
  assert.deepEqual(pushes, ["OPEN LONG SOL x" + pushes[0].split("x")[1]]);
  const state = await env.STATE.get("state", "json");
  assert.equal(state.open["SOL/USD"].stake, 10);

  // Night (23:00 UK): price collapses through the stop -> no push, held
  const plan = state.open["SOL/USD"];
  const crash = [...closes, closes.at(-1), plan.stop * 0.99, plan.stop * 0.99];
  candleRows = rows(crash);
  await runChecks(env, new Date("2026-11-20T23:00:00Z"));
  assert.equal(pushes.length, 1);
  assert.equal((await env.STATE.get("state", "json")).held.length, 1);

  // 08:01 UK: one summary push, held cleared
  await runChecks(env, new Date("2026-11-21T08:01:00Z"));
  assert.equal(pushes.length, 2);
  assert.match(pushes[1], /^Overnight: 1 update$/);
  assert.equal((await env.STATE.get("state", "json")).held.length, 0);
});
