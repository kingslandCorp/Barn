// Spike strategy: big 5-minute momentum candles, validated by the 15-minute
// trend OR a 3-minute follow-through. Built from common breakout advice:
//   - the candle's range is a multiple of normal volatility (ATR)
//   - volume is a multiple of its recent average (relative volume)
//   - it closes beyond the recent high/low (a real breakout, not a wick)
//   - it closes near its extreme (buyers/sellers in control at the close)
// Validation (either is enough):
//   - 15m: price above a rising 20-EMA for longs (below a falling one for shorts)
//   - 3m: the first 3-minute candle after the spike closes still beyond the
//     breakout level (no immediate fake-out)
// Pure functions: test/spike.test.js and the backtest run these directly.

export const SPIKE_DEFAULTS = {
  atrPeriod: 14,
  rangeAtr: 2.0,         // spike candle range >= this x ATR
  volMult: 2.0,          // spike volume >= this x average volume
  volPeriod: 20,
  breakoutLookback: 20,  // must close beyond the high/low of this many prior candles
  closeZone: 0.3,        // must close in the top (long) / bottom (short) 30% of its range
  emaPeriod: 20,         // 15m trend filter
  validation: "either",  // "15m", "3m", "either" or "both"
};

const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

function atrOf(candles, period) {
  let sum = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const c = candles[i], pc = candles[i - 1].close;
    sum += Math.max(c.high - c.low, Math.abs(c.high - pc), Math.abs(c.low - pc));
  }
  return sum / period;
}

export function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) out.push(values[i] * k + out[i - 1] * (1 - k));
  return out;
}

// c5: CLOSED 5m candles, oldest first; looks at the last one.
export function detectSpike(c5, p = SPIKE_DEFAULTS) {
  const need = Math.max(p.atrPeriod, p.volPeriod, p.breakoutLookback) + 2;
  if (c5.length < need) return null;
  const s = c5[c5.length - 1];
  const prior = c5.slice(0, -1); // judge the spike against what came BEFORE it
  const atr = atrOf(prior, p.atrPeriod);
  const range = s.high - s.low;
  if (!(atr > 0) || range < p.rangeAtr * atr) return null;
  const avgVol = avg(prior.slice(-p.volPeriod).map((c) => c.volume));
  if (!(avgVol > 0) || s.volume < p.volMult * avgVol) return null;
  const look = prior.slice(-p.breakoutLookback);
  const hi = Math.max(...look.map((c) => c.high));
  const lo = Math.min(...look.map((c) => c.low));
  const pos = (s.close - s.low) / range; // 0 = closed at low, 1 = at high
  let direction = null, level = null;
  if (s.close > hi && pos >= 1 - p.closeZone) { direction = "LONG"; level = hi; }
  else if (s.close < lo && pos <= p.closeZone) { direction = "SHORT"; level = lo; }
  if (!direction) return null;
  return {
    direction, level, t: s.t, open: s.open, close: s.close, high: s.high, low: s.low, atr,
    rangeAtr: range / atr, volMult: s.volume / avgVol,
  };
}

// c15: CLOSED 15m candles up to the spike's close.
export function trendAgrees15(c15, direction, p = SPIKE_DEFAULTS) {
  if (c15.length < p.emaPeriod + 2) return false;
  const e = emaSeries(c15.map((c) => c.close), p.emaPeriod);
  const last = c15[c15.length - 1].close, eNow = e[e.length - 1], ePrev = e[e.length - 2];
  return direction === "LONG" ? last > eNow && eNow > ePrev : last < eNow && eNow < ePrev;
}

// Build CLOSED 3m candles from 1m candles (only complete 3-minute groups).
export function to3m(c1) {
  const groups = new Map();
  for (const c of c1) {
    const k = Math.floor(c.t / 180) * 180;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }
  const out = [];
  for (const [t, g] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
    if (g.length !== 3) continue;
    out.push({ t, open: g[0].open, high: Math.max(...g.map((c) => c.high)), low: Math.min(...g.map((c) => c.low)),
      close: g[2].close, volume: g.reduce((a, c) => a + c.volume, 0) });
  }
  return out;
}

// First 3m candle that STARTS at or after the spike candle's close.
// Returns null (not closed yet), true (held beyond the level) or false (fell back).
export function followThrough3(c3closed, spike, nowSec) {
  const spikeEnd = spike.t + 300;
  const first = c3closed.find((c) => c.t >= spikeEnd);
  if (!first) return nowSec !== undefined && nowSec > spikeEnd + 600 ? false : null; // data gap: give up
  return spike.direction === "LONG" ? first.close > spike.level : first.close < spike.level;
}

// Decide whether a spike is validated. Returns { status: "confirmed"|"pending"|"rejected", by, at, price }.
export function validateSpike(spike, c15closed, c3closed, p = SPIKE_DEFAULTS) {
  const t15 = trendAgrees15(c15closed, spike.direction, p);
  const f3 = followThrough3(c3closed, spike);
  const spikeEnd = spike.t + 300;
  const first3 = c3closed.find((c) => c.t >= spikeEnd);
  const mode = p.validation;
  if (mode === "15m") return t15 ? { status: "confirmed", by: "15m trend", at: spikeEnd, price: spike.close } : { status: "rejected" };
  if (mode === "either" && t15) return { status: "confirmed", by: "15m trend", at: spikeEnd, price: spike.close };
  if (mode === "both" && !t15) return { status: "rejected" };
  if (f3 === null) return { status: "pending" };
  if (!f3) return { status: "rejected" };
  return { status: "confirmed", by: mode === "both" ? "15m trend + 3m follow-through" : "3m follow-through", at: first3.t + 180, price: first3.close };
}

// ------------------------------------------------------------ live check
// Heads-up settings: only the bigger spikes (tested: ~1 per coin per day).
export const HEADSUP = { ...SPIKE_DEFAULTS, rangeAtr: 3.0, volMult: 2.0, validation: "either" };

// One coin, one cron tick. c5/c15/c1 include their still-forming candle last.
// Mutates state.spike_last / state.spike_pending; returns heads-up alerts.
export function checkSpikes(state, symbol, c5, c15, c1, nowSec, p = HEADSUP) {
  state.spike_last ||= {};
  state.spike_pending ||= {};
  const out = [];
  const closed5 = c5.slice(0, -1);
  const closed15 = c15.slice(0, -1);
  const closed3 = to3m(c1.slice(0, -1));

  const confirm = (sp, v) => {
    out.push({
      time: new Date(nowSec * 1000).toISOString(), event: "spike", symbol, direction: sp.direction,
      price: v.price, move_pct: ((sp.close - sp.open) / sp.open) * 100, range_atr: sp.rangeAtr,
      vol_mult: sp.volMult, by: v.by, candle: sp.t,
    });
  };

  // A spike waiting for its 3m follow-through?
  const pending = state.spike_pending[symbol];
  if (pending) {
    const v = validateSpike(pending, closed15.filter((c) => c.t + 900 <= pending.t + 300), closed3, p);
    if (v.status === "confirmed") confirm(pending, v);
    if (v.status !== "pending" || nowSec > pending.t + 300 + 600) delete state.spike_pending[symbol];
  }

  // A newly closed 5m candle?
  const last = closed5[closed5.length - 1];
  if (!last || state.spike_last[symbol] === last.t) return out;
  state.spike_last[symbol] = last.t;
  const sp = detectSpike(closed5.slice(-60), p);
  if (!sp) return out;
  const v = validateSpike(sp, closed15.filter((c) => c.t + 900 <= sp.t + 300), closed3, p);
  if (v.status === "confirmed") confirm(sp, v);
  else if (v.status === "pending") state.spike_pending[symbol] = sp;
  return out;
}
