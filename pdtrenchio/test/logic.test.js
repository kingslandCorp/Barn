import { test } from "node:test";
import assert from "node:assert/strict";
import {
  averageTrueRange, checkCoin, emptyState, exitReason, maCrossoverSignal, planTrade, pnlAt, MAX_TRENCH_LEVERAGE,
} from "../src/logic.js";
import { alertText } from "../src/index.js";

const close = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));

test("leverage never exceeds 200", () => {
  const p = planTrade({ symbol: "BTC/USD", direction: "LONG", entry: 100000, atr: 1, balance: 1000 });
  assert.equal(p.leverage, MAX_TRENCH_LEVERAGE);
  assert.throws(() => planTrade({ symbol: "X", direction: "LONG", entry: 100, atr: 1, balance: 1000, maxLeverage: 201 }));
});

test("volatility pulls leverage down (matches leverage.py: 33x)", () => {
  const p = planTrade({ symbol: "SOL/USD", direction: "LONG", entry: 100, atr: 1, balance: 1000 });
  assert.equal(p.leverage, 33);
  assert.ok(p.liquidation < p.stop && p.stop < p.entry && p.entry < p.take_profit);
});

test("stopped-out trade loses exactly risk pct including fees", () => {
  const p = planTrade({ symbol: "ADA/USD", direction: "LONG", entry: 1, atr: 0.004, balance: 1000, feePct: 0.0005 });
  assert.ok(close(pnlAt(p, p.stop, 0.0005), -10));
});

test("short levels mirrored and same-candle stop+target counts as stop", () => {
  const p = planTrade({ symbol: "XRP/USD", direction: "SHORT", entry: 2, atr: 0.01, balance: 1000 });
  assert.ok(p.take_profit < p.entry && p.entry < p.stop && p.stop < p.liquidation);
  assert.equal(exitReason(p, p.stop + 0.0001, p.take_profit - 1), "STOP");
});

test("ATR matches hand calculation", () => {
  const c = [[10, 9, 9.5], [12, 10, 11], [11, 10, 10.5], [13, 11, 12.5]].map(([high, low, cl], i) => ({ t: i, high, low, close: cl }));
  assert.ok(close(averageTrueRange(c, 3), 2.0));
});

function candles(closes) {
  return closes.map((c, i) => ({ t: 1700000000 + i * 900, open: c, high: c * 1.002, low: c * 0.998, close: c }));
}

test("MA crossover fires BUY on the crossing candle only", () => {
  const closes = [...Array(40).fill(100), 100.5, 101, 101.5];
  const signals = [];
  for (let n = 30; n <= closes.length; n++) signals.push(maCrossoverSignal(candles(closes.slice(0, n))));
  assert.equal(signals.filter((s) => s === "BUY").length, 1);
});

test("checkCoin opens once per candle, then closes on take-profit", () => {
  const closes = [...Array(40).fill(100), 100.5, 101, 101.5];
  const all = candles([...closes, closes.at(-1)]);
  const state = emptyState();
  const cfg = { strategy: "ma_crossover", balance: 1000, riskPct: 0.01, maxLeverage: 200, atrPeriod: 14,
    atrStopMult: 1.5, rewardRisk: 2, liqBuffer: 2, feePct: 0.0005, fastMa: 12, slowMa: 26 };
  const sent = [];
  for (let n = 30; n <= all.length; n++) sent.push(...checkCoin(state, "SOL/USD", all.slice(0, n), cfg));
  sent.push(...checkCoin(state, "SOL/USD", all, cfg));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].event, "open");
  assert.equal(sent[0].direction, "LONG");

  const plan = state.open["SOL/USD"];
  const last = all.at(-1);
  const tp = { ...last, t: last.t + 900, high: plan.take_profit * 1.001 };
  const after = checkCoin(state, "SOL/USD", [...all, tp, { ...tp, t: tp.t + 900 }], cfg);
  const closes2 = after.filter((a) => a.event === "close");
  assert.equal(closes2.length, 1);
  assert.equal(closes2[0].reason, "TAKE_PROFIT");
  assert.ok(closes2[0].pnl > 0);
  assert.equal(state.open["SOL/USD"], undefined);
  assert.match(alertText(sent[0]).title, /^OPEN LONG SOL x\d+$/);
  assert.match(alertText(closes2[0]).title, /^CLOSE LONG SOL \(take profit\)$/);
});

test("fixed £10 stake: stake is exactly 10 and the stop loss follows from leverage", () => {
  const p = planTrade({ symbol: "SOL/USD", direction: "LONG", entry: 100, atr: 0.25, balance: 1000, fixedStake: 10, feePct: 0.0005 });
  assert.equal(p.stake, 10);
  assert.ok(p.leverage <= 200);
  assert.ok(close(pnlAt(p, p.stop, 0.0005), -p.risk_amount));
  assert.ok(p.risk_amount < 10, "a stop-out loses less than the whole stake");
});

test("alert hours follow UK time including summer time", async () => {
  const { inAlertHours, localHour } = await import("../src/logic.js");
  // 07:30 UTC in January = 07:30 GMT (quiet); in July = 08:30 BST (awake)
  assert.equal(inAlertHours(new Date("2026-01-15T07:30:00Z"), "Europe/London"), false);
  assert.equal(inAlertHours(new Date("2026-07-15T07:30:00Z"), "Europe/London"), true);
  assert.equal(localHour(new Date("2026-07-15T21:05:00Z"), "Europe/London"), 22);
  assert.equal(inAlertHours(new Date("2026-07-15T21:05:00Z"), "Europe/London"), false);
  assert.equal(inAlertHours(new Date("2026-01-15T21:59:00Z"), "Europe/London"), true);
});

test("quiet hours: signal recorded but no trade opened", () => {
  const closes = [...Array(40).fill(100), 100.5, 101, 101.5];
  const all = candles([...closes, closes.at(-1)]);
  const state = emptyState();
  const cfg = { strategy: "ma_crossover", balance: 1000, riskPct: 0.01, maxLeverage: 200, atrPeriod: 14,
    atrStopMult: 1.5, rewardRisk: 2, liqBuffer: 2, feePct: 0.0005, fastMa: 12, slowMa: 26, allowOpen: false };
  const sent = [];
  for (let n = 30; n <= all.length; n++) sent.push(...checkCoin(state, "SOL/USD", all.slice(0, n), cfg));
  assert.equal(sent.length, 0);
  assert.equal(state.open["SOL/USD"], undefined);
  assert.equal(state.last_signal["SOL/USD"].skipped, true);
});
