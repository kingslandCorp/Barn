// Pure trading logic for the cloud monitor: a line-for-line port of
// leverage.py and the two strategies in strategies/, so the cloud and the
// local Python monitor make the same calls. No network, no Cloudflare APIs:
// test/logic.test.js runs this directly under Node.

export const MAX_TRENCH_LEVERAGE = 200;

// ---------------------------------------------------------------- strategies
// candles: [{ t, open, high, low, close }], oldest first, all CLOSED.

function sma(values, period, endIndex) {
  let sum = 0;
  for (let i = endIndex - period + 1; i <= endIndex; i++) sum += values[i];
  return sum / period;
}

export function maCrossoverSignal(candles, fast = 12, slow = 26) {
  if (candles.length < slow + 1) return "HOLD";
  const closes = candles.map((c) => c.close);
  const n = closes.length - 1;
  const prevFast = sma(closes, fast, n - 1), currFast = sma(closes, fast, n);
  const prevSlow = sma(closes, slow, n - 1), currSlow = sma(closes, slow, n);
  if (prevFast <= prevSlow && currFast > currSlow) return "BUY";
  if (prevFast >= prevSlow && currFast < currSlow) return "SELL";
  return "HOLD";
}

export function fibonacciSignal(candles, lookback = 50) {
  if (candles.length < lookback + 1) return "HOLD";
  const ref = candles.slice(-(lookback + 1), -1);
  let highPos = 0, lowPos = 0;
  for (let i = 1; i < ref.length; i++) {
    if (ref[i].high > ref[highPos].high) highPos = i;
    if (ref[i].low < ref[lowPos].low) lowPos = i;
  }
  const swingHigh = ref[highPos].high, swingLow = ref[lowPos].low;
  if (swingHigh <= swingLow) return "HOLD";
  if (!(lowPos < highPos)) return "HOLD";
  const close = candles[candles.length - 1].close;
  if (close < swingLow) return "SELL";
  const level618 = swingHigh - (swingHigh - swingLow) * 0.618;
  const prevClose = candles[candles.length - 2].close;
  if (prevClose < level618 && level618 <= close) return "BUY";
  return "HOLD";
}

export function strategySignal(name, candles, opts = {}) {
  if (name === "fibonacci_retracement") return fibonacciSignal(candles, opts.fibLookback ?? 50);
  return maCrossoverSignal(candles, opts.fastMa ?? 12, opts.slowMa ?? 26);
}

export function minCandles(name, opts = {}) {
  const strat = name === "fibonacci_retracement" ? (opts.fibLookback ?? 50) + 1 : (opts.slowMa ?? 26) + 1;
  return Math.max(strat, (opts.atrPeriod ?? 14) + 1) + 1;
}

// ------------------------------------------------------------------ leverage

export function averageTrueRange(candles, period = 14) {
  if (candles.length < period + 1) throw new Error(`need at least ${period + 1} candles for ATR(${period})`);
  let sum = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const c = candles[i], prevClose = candles[i - 1].close;
    sum += Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  }
  return sum / period;
}

export function planTrade({
  symbol, direction, entry, atr, balance,
  riskPct = 0.01, maxLeverage = MAX_TRENCH_LEVERAGE, atrStopMult = 1.5,
  rewardRisk = 2.0, liqBuffer = 2.0, feePct = 0.0, fixedStake = 0,
}) {
  direction = direction.toUpperCase();
  if (direction !== "LONG" && direction !== "SHORT") throw new Error("direction must be LONG or SHORT");
  if (!(maxLeverage >= 1 && maxLeverage <= MAX_TRENCH_LEVERAGE)) {
    throw new Error(`maxLeverage must be between 1 and ${MAX_TRENCH_LEVERAGE}`);
  }
  if (!(entry > 0) || !(balance > 0) || !(atr > 0)) return null;
  if (liqBuffer < 1) throw new Error("liqBuffer must be >= 1");

  const stopPct = (atr * atrStopMult) / entry;
  const leverage = Math.floor(Math.min(1 / (stopPct * liqBuffer), maxLeverage));
  if (leverage < 1) return null;

  let riskAmount = balance * riskPct;
  let stake = riskAmount / (leverage * (stopPct + feePct));
  if (fixedStake > 0) {
    // Fixed stake per trade (e.g. £10): the loss at the stop follows from it.
    stake = fixedStake;
    riskAmount = stake * leverage * (stopPct + feePct);
  } else if (stake > balance) {
    stake = balance;
    riskAmount = stake * leverage * (stopPct + feePct);
  }
  const sign = direction === "LONG" ? 1 : -1;
  return {
    symbol, direction, entry,
    stop: entry * (1 - sign * stopPct),
    take_profit: entry * (1 + sign * stopPct * rewardRisk),
    liquidation: entry * (1 - sign / leverage),
    leverage, stake, risk_amount: riskAmount, stop_pct: stopPct, reward_risk: rewardRisk,
  };
}

export function exitReason(plan, high, low) {
  if (plan.direction === "LONG") {
    if (low <= plan.liquidation) return "LIQUIDATED";
    if (low <= plan.stop) return "STOP";
    if (high >= plan.take_profit) return "TAKE_PROFIT";
  } else {
    if (high >= plan.liquidation) return "LIQUIDATED";
    if (high >= plan.stop) return "STOP";
    if (low <= plan.take_profit) return "TAKE_PROFIT";
  }
  return null;
}

export function exitPrice(plan, why) {
  return { STOP: plan.stop, TAKE_PROFIT: plan.take_profit, LIQUIDATED: plan.liquidation }[why];
}

export function pnlAt(plan, price, feePct = 0.0) {
  const sign = plan.direction === "LONG" ? 1 : -1;
  const move = (sign * (price - plan.entry)) / plan.entry;
  return Math.max(plan.stake * plan.leverage * (move - feePct), -plan.stake);
}

// ------------------------------------------------------------- one check
// Runs the same steps as SignalMonitor.check() in trench_signals.py for one
// coin. Mutates `state` and returns the alerts to send. `candles` includes
// the still-forming candle as its last element.

export function checkCoin(state, symbol, candles, cfg) {
  const alerts = [];
  const now = new Date().toISOString();
  const price = candles[candles.length - 1].close;

  const close = (plan, why, at) => {
    delete state.open[symbol];
    delete state.opened_at[symbol];
    alerts.push({
      time: now, event: "close", reason: why, symbol, price: at,
      direction: plan.direction, leverage: plan.leverage, entry: plan.entry,
      pnl: pnlAt(plan, at, cfg.feePct),
    });
  };

  let plan = state.open[symbol] || null;
  if (plan) {
    const openedAt = state.opened_at[symbol];
    for (const c of candles) {
      if (c.t <= openedAt) continue;
      const why = exitReason(plan, c.high, c.low);
      if (why) { close(plan, why, exitPrice(plan, why)); plan = null; break; }
    }
  }

  const closed = candles.slice(0, -1);
  const candleTs = closed[closed.length - 1].t;
  if (state.last_candle[symbol] === candleTs) return alerts;
  state.last_candle[symbol] = candleTs;

  const signal = strategySignal(cfg.strategy, closed, cfg);
  const direction = { BUY: "LONG", SELL: "SHORT" }[signal];
  if (!direction) return alerts;
  const allowOpen = cfg.allowOpen !== false;
  state.last_signal[symbol] = { direction, candle: candleTs, skipped: !allowOpen };
  if (plan) {
    if (plan.direction === direction) return alerts;
    close(plan, "OPPOSITE_SIGNAL", price);
  }
  if (!allowOpen) return alerts; // quiet hours: no new trades you can't act on

  const next = planTrade({
    symbol, direction, entry: closed[closed.length - 1].close,
    atr: averageTrueRange(closed, cfg.atrPeriod), balance: cfg.balance,
    riskPct: cfg.riskPct, maxLeverage: cfg.maxLeverage, atrStopMult: cfg.atrStopMult,
    rewardRisk: cfg.rewardRisk, liqBuffer: cfg.liqBuffer, feePct: cfg.feePct,
    fixedStake: cfg.stake || 0,
  });
  if (!next) return alerts;
  state.open[symbol] = next;
  state.opened_at[symbol] = candleTs;
  alerts.push({ time: now, event: "open", ...next });
  return alerts;
}

export function emptyState() {
  return { last_candle: {}, last_signal: {}, open: {}, opened_at: {}, alerts: [], held: [], errors: {}, checked_at: null };
}

// Hour (0-23) in a time zone, e.g. Europe/London (handles GMT/BST).
export function localHour(date, timeZone) {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone }).format(date));
}

// True when alerts may be sent: from `start` (inclusive) to `end` (exclusive).
export function inAlertHours(date, timeZone, start = 8, end = 22) {
  const h = localHour(date, timeZone);
  return start <= end ? h >= start && h < end : h >= start || h < end;
}
