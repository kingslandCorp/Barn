import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { addSuggestion } from "../src/positions.js";
import { planTrade } from "../src/logic.js";

function kv() { const m = new Map(); return { get: async (k, t) => (m.has(k) ? (t === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => { m.set(k, v); } }; }

test("phone flow: link -> sign in -> confirm -> tracked -> I closed it", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ error: [], result: { SOLUSD: { c: ["100.2"] }, last: 0 } })));
  const env = { STATE: kv(), PAGE_PASSWORD: "correct-horse-battery", COINS: "SOL", STAKE: "10" };
  const plan = planTrade({ symbol: "SOL/USD", direction: "LONG", entry: 100, atr: 0.2, balance: 1000, fixedStake: 10 });
  const state = { last_candle: {}, last_signal: {}, open: {}, opened_at: {}, alerts: [], held: [], errors: {} };
  const id = addSuggestion(state, plan, "signal", Math.floor(Date.now() / 1000));
  await env.STATE.put("state", JSON.stringify(state));
  const call = (path, init = {}) => worker.fetch(new Request(`https://x.example${path}`, init), env);

  // Notification link while signed out -> login page that returns to the form
  const loginPage = await (await call(`/enter?id=${id}`)).text();
  assert.match(loginPage, new RegExp(`name="next" value="/enter\\?id=${id}"`));
  const login = await call("/login", { method: "POST", body: new URLSearchParams({ password: "correct-horse-battery", next: `/enter?id=${id}` }) });
  assert.equal(login.status, 303);
  assert.equal(login.headers.get("Location"), `/enter?id=${id}`);
  const cookie = login.headers.get("Set-Cookie").split(";")[0];
  // open redirect refused
  const evil = await call("/login", { method: "POST", body: new URLSearchParams({ password: "correct-horse-battery", next: "//evil.example" }) });
  assert.equal(evil.headers.get("Location"), "/");

  const form = await (await call(`/enter?id=${id}`, { headers: { Cookie: cookie } })).text();
  assert.match(form, /I entered: LONG SOL/);
  assert.match(form, /name="stake"[^>]*value="10"/);

  const done = await call("/enter", { method: "POST", headers: { Cookie: cookie }, body: new URLSearchParams({ id, stake: "12.5", entry: "100.1", leverage: "60" }) });
  assert.equal(done.status, 200);
  assert.match(await done.text(), /Tracking your SOL trade/);

  const status = await (await call("/status", { headers: { Cookie: cookie } })).json();
  const sol = status.coins.find((c) => c.symbol === "SOL/USD");
  assert.equal(sol.plan.stake, 12.5);
  assert.equal(sol.plan.leverage, 60);
  assert.equal(status.alerts[0].event, "entered");

  const again = await call("/enter", { method: "POST", headers: { Cookie: cookie }, body: new URLSearchParams({ id, stake: "10" }) });
  assert.equal(again.status, 400);

  const exit = await call("/exit", { method: "POST", headers: { Cookie: cookie }, body: new URLSearchParams({ symbol: "SOL/USD" }) });
  assert.equal(exit.status, 303);
  const after = await (await call("/status", { headers: { Cookie: cookie } })).json();
  assert.equal(after.coins[0].plan, null);
});
