// Quick trades (3-5 minutes) for the "Suggest a trade now" button.
//
// Setup (the one that held up in a two-week walk-forward test of 1-minute
// data; see research/README.md): trade a pullback inside a short-term trend.
//   Trend: the 100-minute EMA is rising (falling for shorts) and the 21-minute
//          EMA is above it (below for shorts) - roughly the 5-minute trend.
//   Pullback: the previous 1m candle dipped to the 21-minute EMA.
//   Bounce: the latest 1m candle closed back above the 9-minute EMA, as an up
//           candle (mirror image for shorts).
// Stop 1x the 1-minute ATR, target 2x the stop, and close after 5 minutes if
// neither is hit. Otherwise: no trade.

import { emaSeries } from "./spike.js";
import { planTrade } from "./logic.js";

export const QUICK = { slAtr: 1, rewardRisk: 2, maxMinutes: 5 };

function atr1m(c, period = 14) {
  let sum = 0;
  for (let i = c.length - period; i < c.length; i++) {
    sum += Math.max(c[i].high - c[i].low, Math.abs(c[i].high - c[i - 1].close), Math.abs(c[i].low - c[i - 1].close));
  }
  return sum / period;
}

// c1: 1m candles with the still-forming one last. livePrice: current price.
export function assessQuick(symbol, c1, livePrice, cfg, nowSec) {
  const c = c1.slice(0, -1);
  if (c.length < 130) return { symbol, ok: false, reason: "not enough recent price data" };
  const closes = c.map((x) => x.close);
  const e9 = emaSeries(closes, 9), e21 = emaSeries(closes, 21), e100 = emaSeries(closes, 100);
  const i = c.length - 1;
  const atr = atr1m(c);
  const up = e100[i] > e100[i - 10] && e21[i] > e100[i];
  const dn = e100[i] < e100[i - 10] && e21[i] < e100[i];
  const slope = Math.abs(e100[i] - e100[i - 10]) / atr;
  if (!up && !dn) return { symbol, ok: false, reason: "no clear short-term trend" };
  const dir = up ? "LONG" : "SHORT";
  const pulled = up ? c[i - 1].low <= e21[i - 1] : c[i - 1].high >= e21[i - 1];
  const bounced = up ? c[i].close > e9[i] && c[i].close > c[i].open : c[i].close < e9[i] && c[i].close < c[i].open;
  if (!pulled) return { symbol, ok: false, direction: dir, reason: `${dir === "LONG" ? "uptrend" : "downtrend"}, but no pullback to enter on` };
  if (!bounced) return { symbol, ok: false, direction: dir, reason: `pullback in ${dir === "LONG" ? "uptrend" : "downtrend"}, not bounced yet: check again in a minute` };
  const plan = planTrade({
    symbol, direction: dir, entry: livePrice, atr, balance: cfg.balance ?? 1000,
    maxLeverage: cfg.maxLeverage, atrStopMult: QUICK.slAtr, rewardRisk: QUICK.rewardRisk,
    liqBuffer: cfg.liqBuffer ?? 2, feePct: cfg.feePct, fixedStake: cfg.stake || 0,
  });
  if (!plan) return { symbol, ok: false, direction: dir, reason: "too volatile to size safely" };
  // Price must not already be past the stop or target from the bounce candle.
  const sign = dir === "LONG" ? 1 : -1;
  if (sign * (livePrice - c[i].close) > atr) return { symbol, ok: false, direction: dir, reason: "already ran since the bounce: chasing" };
  // Only worth it if the target pays at least the minimum win, after fees.
  const netWin = plan.stake * plan.leverage * ((sign * (plan.take_profit - plan.entry)) / plan.entry - (cfg.feePct ?? 0));
  const minWin = cfg.minQuickWin ?? 1;
  if (netWin < minWin) {
    return { symbol, ok: false, direction: dir, reason: `target would only win ${(cfg.currency ?? "£")}${netWin.toFixed(2)}: below your ${(cfg.currency ?? "£")}${minWin.toFixed(2)} minimum` };
  }
  return {
    symbol, ok: true, direction: dir, score: slope,
    reason: `${dir === "LONG" ? "dip-and-bounce in an uptrend" : "pop-and-drop in a downtrend"} on the 1-minute chart`,
    plan: { ...plan, quick: true, expires_at: nowSec + QUICK.maxMinutes * 60, net_win: netWin },
  };
}

// Exits for a tracked quick trade, checked every minute on 1m candles:
// stop / target / liquidation, else close when the 5 minutes are up.
export function checkQuickExit(state, symbol, c1, nowSec, exitReason, exitPrice, pnlAt, feePct) {
  const plan = state.open[symbol];
  if (!plan || !plan.quick) return [];
  const startMinute = state.opened_at[symbol];
  let why = null, at = null;
  for (const c of c1) {
    if (c.t <= startMinute) continue; // only candles that began after you entered
    const r = exitReason(plan, c.high, c.low);
    if (r) { why = r; at = exitPrice(plan, r); break; }
  }
  if (!why && nowSec >= plan.expires_at) { why = "TIME_LIMIT"; at = c1[c1.length - 1].close; }
  if (!why) return [];
  delete state.open[symbol];
  delete state.opened_at[symbol];
  return [{
    time: new Date(nowSec * 1000).toISOString(), event: "close", reason: why, symbol, price: at, quick: true,
    direction: plan.direction, leverage: plan.leverage, entry: plan.entry, pnl: pnlAt(plan, at, feePct),
  }];
}
