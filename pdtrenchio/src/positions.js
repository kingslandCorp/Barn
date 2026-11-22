// Your real trades. Every suggested trade (an OPEN alert, or a "Suggest a
// trade now" pick) gets an id. When you tap "I entered" and confirm the
// amount, entry price and leverage you actually used, it becomes a
// position: tracked every minute on 1-minute candles, and you get a CLOSE
// alert when it's time to exit. Suggestions you don't enter are never
// tracked and never send exit alerts.

import { exitPrice, exitReason, pnlAt, MAX_TRENCH_LEVERAGE } from "./logic.js";

export const ENTER_WINDOW_SEC = { signal: 30 * 60, quick: 10 * 60 }; // how long "I entered" stays available
export const QUICK_MINUTES = 5;

export function newId() {
  const a = crypto.getRandomValues(new Uint8Array(6));
  return [...a].map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
}

export function addSuggestion(state, plan, kind, nowSec) {
  state.suggestions ||= {};
  const id = newId();
  state.suggestions[id] = { plan, kind, created: nowSec };
  // keep the 20 most recent
  const ids = Object.keys(state.suggestions).sort((a, b) => state.suggestions[a].created - state.suggestions[b].created);
  for (const old of ids.slice(0, Math.max(0, ids.length - 20))) delete state.suggestions[old];
  return id;
}

export function suggestionStatus(state, id, nowSec) {
  const s = state.suggestions?.[id];
  if (!s) return { ok: false, why: "This trade has expired or doesn't exist." };
  if (s.entered) return { ok: false, why: "You've already confirmed this trade." };
  if (nowSec - s.created > ENTER_WINDOW_SEC[s.kind]) return { ok: false, why: "This suggestion is too old to enter now." };
  if (state.positions?.[s.plan.symbol]) return { ok: false, why: `You already have an open ${s.plan.symbol.split("/")[0]} trade. Close it first.` };
  return { ok: true, suggestion: s };
}

// Rebuild stop / target / liquidation around YOUR entry, stake and leverage,
// keeping the suggestion's stop distance and reward:risk.
export function buildPosition(plan, { stake, entry, leverage }, feePct, kind, nowSec) {
  const sign = plan.direction === "LONG" ? 1 : -1;
  const lev = Math.round(leverage);
  const pos = {
    symbol: plan.symbol, direction: plan.direction, entry, leverage: lev, stake,
    stop_pct: plan.stop_pct, reward_risk: plan.reward_risk,
    stop: entry * (1 - sign * plan.stop_pct),
    take_profit: entry * (1 + sign * plan.stop_pct * plan.reward_risk),
    liquidation: entry * (1 - sign / lev),
    risk_amount: stake * lev * (plan.stop_pct + feePct),
    confirmed: true, kind, entered_at: nowSec,
    opened_minute: Math.floor(nowSec / 60) * 60,
  };
  if (kind === "quick") pos.expires_at = nowSec + QUICK_MINUTES * 60;
  const warning = lev * plan.stop_pct >= 1
    ? `At x${lev} you'd be liquidated before the stop-loss. The suggestion was x${plan.leverage}.`
    : null;
  return { pos, warning };
}

export function enterPosition(state, id, input, feePct, nowSec) {
  const st = suggestionStatus(state, id, nowSec);
  if (!st.ok) return { error: st.why };
  const { plan, kind } = st.suggestion;
  const stake = Number(input.stake);
  const entry = input.entry === undefined || input.entry === "" ? plan.entry : Number(input.entry);
  const leverage = input.leverage === undefined || input.leverage === "" ? plan.leverage : Number(input.leverage);
  if (!(stake > 0 && stake <= 100000)) return { error: "Enter the amount you put in, e.g. 10." };
  if (!(leverage >= 1 && leverage <= MAX_TRENCH_LEVERAGE)) return { error: `Leverage must be between 1 and ${MAX_TRENCH_LEVERAGE}.` };
  if (!(entry > 0) || Math.abs(entry - plan.entry) / plan.entry > 0.05) {
    return { error: "That entry price is more than 5% away from the suggestion. Check the number." };
  }
  const { pos, warning } = buildPosition(plan, { stake, entry, leverage }, feePct, kind, nowSec);
  state.positions ||= {};
  state.positions[plan.symbol] = pos;
  st.suggestion.entered = true;
  return { position: pos, warning };
}

function closeAlert(pos, why, at, nowSec, feePct) {
  return {
    time: new Date(nowSec * 1000).toISOString(), event: "close", reason: why, symbol: pos.symbol, price: at,
    direction: pos.direction, leverage: pos.leverage, entry: pos.entry, stake: pos.stake,
    pnl: pnlAt(pos, at, feePct), confirmed: true, quick: pos.kind === "quick",
  };
}

// Every minute: stop / target / liquidation on 1m candles since you entered,
// then the 5-minute limit for quick trades.
export function checkPositionExit(state, symbol, c1, nowSec, feePct) {
  const pos = state.positions?.[symbol];
  if (!pos) return [];
  let why = null, at = null;
  for (const c of c1) {
    if (c.t <= pos.opened_minute) continue; // only candles that began after you entered
    const r = exitReason(pos, c.high, c.low);
    if (r) { why = r; at = exitPrice(pos, r); break; }
  }
  if (!why && pos.expires_at && nowSec >= pos.expires_at) { why = "TIME_LIMIT"; at = c1[c1.length - 1].close; }
  if (!why) return [];
  delete state.positions[symbol];
  return [closeAlert(pos, why, at, nowSec, feePct)];
}

// The 15m strategy flipped direction on a coin you hold: tell you to get out.
export function reversalExit(state, symbol, newDirection, price, nowSec, feePct) {
  const pos = state.positions?.[symbol];
  if (!pos || pos.kind === "quick" || pos.direction === newDirection) return [];
  delete state.positions[symbol];
  return [closeAlert(pos, "OPPOSITE_SIGNAL", price, nowSec, feePct)];
}

export function closeManually(state, symbol) {
  if (!state.positions?.[symbol]) return false;
  delete state.positions[symbol];
  return true;
}
