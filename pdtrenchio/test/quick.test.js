import { test } from "node:test";
import assert from "node:assert/strict";
import { assessQuick, checkQuickExit } from "../src/quick.js";
import { exitPrice, exitReason, pnlAt } from "../src/logic.js";

const cfg = { stake: 10, maxLeverage: 200, liqBuffer: 2, feePct: 0.0005, balance: 1000 };
const T0 = 1795000000 - (1795000000 % 60);
const bar = (i, o, h, l, c) => ({ t: T0 + i * 60, open: o, high: h, low: l, close: c, volume: 1 });

function uptrendDipBounce() {
  const c = [];
  for (let i = 0; i < 150; i++) { const p = 100 + i * 0.02; c.push(bar(i, p, p + 0.03, p - 0.03, p + 0.01)); }
  const p = 100 + 150 * 0.02;
  c.push(bar(150, p, p + 0.01, p - 0.25, p - 0.2));   // dip to the 21-min average
  c.push(bar(151, p - 0.2, p + 0.06, p - 0.21, p + 0.05)); // bounce, closes above the 9-min average
  c.push(bar(152, p + 0.05, p + 0.06, p + 0.04, p + 0.05)); // forming
  return c;
}

test("dip-and-bounce in an uptrend -> quick LONG with a 5-minute limit", () => {
  const c = uptrendDipBounce();
  const a = assessQuick("SOL/USD", c, c.at(-1).close, cfg, T0 + 152 * 60);
  assert.ok(a.ok, a.reason);
  assert.equal(a.direction, "LONG");
  assert.equal(a.plan.stake, 10);
  assert.ok(a.plan.leverage <= 200);
  assert.equal(a.plan.expires_at, T0 + 152 * 60 + 300);
  assert.ok(a.plan.take_profit > a.plan.entry && a.plan.stop < a.plan.entry);
});

test("flat market -> no trade", () => {
  const c = Array.from({ length: 160 }, (_, i) => bar(i, 100, 100.02, 99.98, 100));
  const a = assessQuick("BTC/USD", c, 100, cfg, T0 + 160 * 60);
  assert.equal(a.ok, false);
  assert.match(a.reason, /no clear short-term trend/);
});

test("quick exit: target hit next minute; otherwise closes when 5 minutes are up", () => {
  const c = uptrendDipBounce();
  const plan = assessQuick("SOL/USD", c, c.at(-1).close, cfg, T0 + 152 * 60).plan;
  const state = { open: { "SOL/USD": plan }, opened_at: { "SOL/USD": T0 + 152 * 60 } };
  const hit = [bar(153, plan.entry, plan.take_profit * 1.0001, plan.entry, plan.entry)];
  const a = checkQuickExit(state, "SOL/USD", hit, T0 + 154 * 60, exitReason, exitPrice, pnlAt, 0.0005);
  assert.equal(a[0].reason, "TAKE_PROFIT");
  assert.ok(a[0].pnl > 0);
  assert.equal(state.open["SOL/USD"], undefined);

  const state2 = { open: { "SOL/USD": plan }, opened_at: { "SOL/USD": T0 + 152 * 60 } };
  const quiet = [bar(153, plan.entry, plan.entry, plan.entry, plan.entry)];
  assert.deepEqual(checkQuickExit(state2, "SOL/USD", quiet, T0 + 155 * 60, exitReason, exitPrice, pnlAt, 0.0005), []);
  const b = checkQuickExit(state2, "SOL/USD", quiet, plan.expires_at + 1, exitReason, exitPrice, pnlAt, 0.0005);
  assert.equal(b[0].reason, "TIME_LIMIT");
});

test("target below the minimum win -> no trade", () => {
  const c = uptrendDipBounce();
  const a = assessQuick("SOL/USD", c, c.at(-1).close, { ...cfg, minQuickWin: 1000 }, T0 + 152 * 60);
  assert.equal(a.ok, false);
  assert.match(a.reason, /below your £1000.00 minimum/);
  const b = assessQuick("SOL/USD", c, c.at(-1).close, cfg, T0 + 152 * 60);
  assert.ok(b.ok && b.plan.net_win >= 1);
});
