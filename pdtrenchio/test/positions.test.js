import { test } from "node:test";
import assert from "node:assert/strict";
import { addSuggestion, checkPositionExit, closeManually, enterPosition, reversalExit, suggestionStatus } from "../src/positions.js";
import { planTrade } from "../src/logic.js";

const NOW = 1795400000;
const plan = planTrade({ symbol: "SOL/USD", direction: "LONG", entry: 100, atr: 0.2, balance: 1000, fixedStake: 10, feePct: 0.0005 });

test("entering rebuilds stop/target around YOUR entry, stake and leverage", () => {
  const state = {};
  const id = addSuggestion(state, plan, "signal", NOW);
  const r = enterPosition(state, id, { stake: "25", entry: "100.5", leverage: "50" }, 0.0005, NOW + 60);
  assert.ok(r.position, r.error);
  const p = r.position;
  assert.equal(p.stake, 25); assert.equal(p.entry, 100.5); assert.equal(p.leverage, 50);
  assert.ok(Math.abs((p.entry - p.stop) / p.entry - plan.stop_pct) < 1e-12, "same stop distance as suggested");
  assert.ok(p.take_profit > p.entry && p.stop < p.entry && p.liquidation < p.stop);
  assert.equal(suggestionStatus(state, id, NOW + 61).ok, false, "can't confirm twice");
});

test("bad inputs are refused with a clear reason", () => {
  const state = {};
  const id = addSuggestion(state, plan, "signal", NOW);
  assert.match(enterPosition(state, id, { stake: "0" }, 0, NOW).error, /amount/);
  assert.match(enterPosition(state, id, { stake: "10", leverage: "500" }, 0, NOW).error, /between 1 and 200/);
  assert.match(enterPosition(state, id, { stake: "10", entry: "150" }, 0, NOW).error, /5% away/);
  assert.match(enterPosition(state, id, { stake: "10" }, 0, NOW + 3600).error, /too old/);
  assert.match(enterPosition(state, "nope", { stake: "10" }, 0, NOW).error, /expired/);
});

test("leverage high enough to liquidate before the stop gets a warning", () => {
  const state = {};
  const id = addSuggestion(state, plan, "signal", NOW);
  const r = enterPosition(state, id, { stake: "10", leverage: "200" }, 0, NOW);
  if (200 * plan.stop_pct >= 1) assert.match(r.warning, /liquidated before the stop/);
  else assert.equal(r.warning, null);
});

test("quick position: exits at target, or after 5 minutes", () => {
  const state = {};
  const id = addSuggestion(state, plan, "quick", NOW);
  const p = enterPosition(state, id, { stake: "10" }, 0, NOW).position;
  assert.equal(p.expires_at, NOW + 300);
  const m0 = Math.floor(NOW / 60) * 60;
  assert.deepEqual(checkPositionExit(state, "SOL/USD", [{ t: m0, high: 999, low: 0, close: 100 }], NOW + 30, 0), [], "entry minute ignored");
  const a = checkPositionExit(state, "SOL/USD", [{ t: m0 + 60, high: p.take_profit + 0.01, low: p.entry, close: p.entry }], NOW + 90, 0);
  assert.equal(a[0].reason, "TAKE_PROFIT"); assert.equal(a[0].confirmed, true); assert.equal(a[0].quick, true); assert.ok(a[0].pnl > 0);

  const s2 = {}; const id2 = addSuggestion(s2, plan, "quick", NOW);
  enterPosition(s2, id2, { stake: "10" }, 0, NOW);
  const b = checkPositionExit(s2, "SOL/USD", [{ t: m0 + 60, high: 100.01, low: 99.99, close: 100 }], NOW + 301, 0);
  assert.equal(b[0].reason, "TIME_LIMIT");
});

test("trend flip tells you to exit a signal trade; 'I closed it' stops tracking", () => {
  const state = {};
  const id = addSuggestion(state, plan, "signal", NOW);
  enterPosition(state, id, { stake: "10" }, 0, NOW);
  assert.deepEqual(reversalExit(state, "SOL/USD", "LONG", 101, NOW, 0), []);
  assert.equal(reversalExit(state, "SOL/USD", "SHORT", 101, NOW, 0)[0].reason, "OPPOSITE_SIGNAL");
  const s2 = {}; const id2 = addSuggestion(s2, plan, "signal", NOW);
  enterPosition(s2, id2, { stake: "10" }, 0, NOW);
  assert.equal(closeManually(s2, "SOL/USD"), true);
  assert.equal(s2.positions["SOL/USD"], undefined);
});
