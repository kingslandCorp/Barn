// pdtrenchio: the Trench signal monitor running on Cloudflare Workers.
//
// Every minute (cron) it pulls 15-minute candles for each coin from
// Kraken's public API, runs the same strategy and leverage rules as
// trench_signals.py, and sends OPEN / CLOSE alerts to your phone (ntfy
// and/or Telegram). The page at "/" shows prices, open trades and recent
// alerts, behind a password. Alerts only: nothing here talks to Trench.
//
// State lives in one KV key and is written only when something changes
// (a new candle or an alert), which keeps well inside the free plan.

import { checkCoin, emptyState, minCandles, pnlAt, MAX_TRENCH_LEVERAGE } from "./logic.js";
import { LOGIN_PAGE, PAGE } from "./page.js";

const STATE_KEY = "state";
const SETTINGS_KEY = "settings"; // { password_hash, ntfy_topic } set once via /setup
const KRAKEN = "https://api.kraken.com/0/public";
const KRAKEN_PAIR = { BTC: "XBTUSD" }; // everything else is <COIN>USD
const COOKIE = "pdt_session";

function config(env) {
  const num = (v, d) => (v === undefined || v === "" ? d : Number(v));
  const cfg = {
    coins: (env.COINS || "SOL,BTC,HYPE,XRP,ADA").split(",").map((c) => c.trim().toUpperCase()).filter(Boolean),
    timeframeMin: num(env.TIMEFRAME_MIN, 15),
    strategy: env.STRATEGY || "ma_crossover",
    fastMa: num(env.FAST_MA, 12),
    slowMa: num(env.SLOW_MA, 26),
    fibLookback: num(env.FIB_LOOKBACK, 50),
    balance: num(env.BALANCE, 1000),
    riskPct: num(env.RISK_PCT, 0.01),
    maxLeverage: Math.min(num(env.MAX_LEVERAGE, MAX_TRENCH_LEVERAGE), MAX_TRENCH_LEVERAGE),
    atrPeriod: num(env.ATR_PERIOD, 14),
    atrStopMult: num(env.ATR_STOP_MULT, 1.5),
    rewardRisk: num(env.REWARD_RISK, 2.0),
    liqBuffer: num(env.LIQ_BUFFER, 2.0),
    feePct: num(env.FEE_PCT, 0.0005),
  };
  if (!(cfg.riskPct > 0 && cfg.riskPct <= 0.1)) cfg.riskPct = 0.01;
  if (!(cfg.maxLeverage >= 1)) cfg.maxLeverage = MAX_TRENCH_LEVERAGE;
  return cfg;
}

const symbolOf = (coin) => `${coin}/USD`;
const krakenPair = (coin) => KRAKEN_PAIR[coin] || `${coin}USD`;

async function krakenJson(path) {
  const res = await fetch(`${KRAKEN}/${path}`, { headers: { "User-Agent": "pdtrenchio-monitor" } });
  if (!res.ok) throw new Error(`Kraken HTTP ${res.status}`);
  const body = await res.json();
  if (body.error && body.error.length) throw new Error(`Kraken: ${body.error.join(", ")}`);
  const key = Object.keys(body.result).find((k) => k !== "last");
  return body.result[key];
}

async function fetchCandles(coin, intervalMin) {
  const rows = await krakenJson(`OHLC?pair=${krakenPair(coin)}&interval=${intervalMin}`);
  return rows.map((r) => ({ t: r[0], open: +r[1], high: +r[2], low: +r[3], close: +r[4] }));
}

async function fetchPrice(coin) {
  const t = await krakenJson(`Ticker?pair=${krakenPair(coin)}`);
  return +t.c[0];
}

// ------------------------------------------------------------------ state

async function loadState(env) {
  const s = await env.STATE.get(STATE_KEY, "json");
  return { ...emptyState(), ...(s || {}) };
}

const comparable = (s) => JSON.stringify({ ...s, checked_at: null });

// Password and ntfy topic can come from Worker secrets (PAGE_PASSWORD,
// NTFY_TOPIC) or from the KV settings written by POST /setup. Secrets win.
async function settings(env) {
  const kv = (await env.STATE.get(SETTINGS_KEY, "json")) || {};
  return {
    ntfyTopic: env.NTFY_TOPIC || kv.ntfy_topic || "",
    passwordHash: env.PAGE_PASSWORD ? await sha256Hex(env.PAGE_PASSWORD) : kv.password_hash || "",
  };
}

// ------------------------------------------------------------------ alerts

function fmtPrice(p) {
  if (p >= 1000) return p.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(4);
  return p.toFixed(6);
}

export function alertText(a) {
  const coin = a.symbol.split("/")[0];
  if (a.event === "open") {
    return {
      title: `OPEN ${a.direction} ${coin} x${a.leverage}`,
      body: [
        `Entry ~${fmtPrice(a.entry)}  Leverage x${a.leverage}  Stake ${a.stake.toFixed(2)}`,
        `Stop ${fmtPrice(a.stop)} (${(a.stop_pct * 100).toFixed(2)}% away, lose ~${a.risk_amount.toFixed(2)})`,
        `Target ${fmtPrice(a.take_profit)} (win ~${(a.risk_amount * a.reward_risk).toFixed(2)})`,
        `Liquidation ~${fmtPrice(a.liquidation)}`,
        `Skip it if price is already past the stop or target.`,
      ].join("\n"),
    };
  }
  const why = a.reason.replace("_", " ").toLowerCase();
  return {
    title: `CLOSE ${a.direction} ${coin} (${why})`,
    body: `Close your x${a.leverage} ${a.direction.toLowerCase()} on ${coin}.\n` +
      `Entry ${fmtPrice(a.entry)} -> now ~${fmtPrice(a.price)}\nApprox P&L ${a.pnl >= 0 ? "+" : ""}${a.pnl.toFixed(2)}`,
  };
}

async function push(env, title, body) {
  const sends = [];
  const { ntfyTopic } = await settings(env);
  if (ntfyTopic) {
    const server = (env.NTFY_SERVER || "https://ntfy.sh").replace(/\/$/, "");
    sends.push(fetch(`${server}/${encodeURIComponent(ntfyTopic)}`, {
      method: "POST", body, headers: { Title: title, Priority: "high" },
    }));
  }
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    sends.push(fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: `${title}\n\n${body}` }),
    }));
  }
  const results = await Promise.allSettled(sends);
  for (const r of results) {
    if (r.status === "rejected") console.log("push failed", String(r.reason));
    else if (!r.value.ok) console.log("push failed", r.value.status);
  }
}

function channels(env, set) {
  return [
    { name: "this page", on: true, how: "Always on: the Recent alerts table" },
    { name: "phone (ntfy)", on: !!set.ntfyTopic, how: "Subscribe to this monitor's topic in the ntfy app" },
    { name: "Telegram", on: !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID), how: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID secrets" },
  ];
}

// ------------------------------------------------------------------- cron

export async function runChecks(env) {
  const cfg = config(env);
  const state = await loadState(env);
  const before = comparable(state);
  const newAlerts = [];

  const fetched = await Promise.allSettled(cfg.coins.map((c) => fetchCandles(c, cfg.timeframeMin)));
  cfg.coins.forEach((coin, i) => {
    const symbol = symbolOf(coin);
    const r = fetched[i];
    if (r.status === "rejected") { state.errors[symbol] = String(r.reason).slice(0, 200); return; }
    if (r.value.length < minCandles(cfg.strategy, cfg)) { state.errors[symbol] = "not enough candle history"; return; }
    delete state.errors[symbol];
    try {
      newAlerts.push(...checkCoin(state, symbol, r.value, cfg));
    } catch (e) {
      state.errors[symbol] = String(e).slice(0, 200);
    }
  });

  if (newAlerts.length) state.alerts = [...newAlerts.slice().reverse(), ...state.alerts].slice(0, 50);
  if (comparable(state) !== before) {
    state.checked_at = new Date().toISOString();
    await env.STATE.put(STATE_KEY, JSON.stringify(state)); // save before pushing: never alert twice
  }
  for (const a of newAlerts) {
    const { title, body } = alertText(a);
    await push(env, title, body);
  }
  return newAlerts;
}

// ------------------------------------------------------------------- auth

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const sessionToken = (passwordHash) => sha256Hex(`pdtrenchio|${passwordHash}`);

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function isSignedIn(request, set) {
  if (!set.passwordHash) return false;
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`${COOKIE}=([a-f0-9]{64})`));
  return !!m && safeEqual(m[1], await sessionToken(set.passwordHash));
}

const html = (body, status = 200, headers = {}) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", ...headers } });
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// ----------------------------------------------------------------- status

async function status(env, set) {
  const cfg = config(env);
  const state = await loadState(env);
  const prices = await Promise.allSettled(cfg.coins.map(fetchPrice));
  const coins = cfg.coins.map((coin, i) => {
    const symbol = symbolOf(coin);
    const price = prices[i].status === "fulfilled" ? prices[i].value : null;
    const plan = state.open[symbol] || null;
    return {
      symbol, price, plan,
      opened_at: state.opened_at[symbol] || null,
      last_signal: state.last_signal[symbol] || null,
      error: state.errors[symbol] || null,
      pnl: plan && price ? pnlAt(plan, price, cfg.feePct) : null,
      to_stop_pct: plan && price ? (Math.abs(price - plan.stop) / price) * 100 : null,
    };
  });
  const lastCandle = Math.max(0, ...Object.values(state.last_candle));
  return {
    strategy: cfg.strategy, timeframe: `${cfg.timeframeMin}m`, max_leverage: cfg.maxLeverage,
    risk_pct: cfg.riskPct, balance: cfg.balance, last_candle: lastCandle || null,
    channels: channels(env, set), coins, alerts: state.alerts,
  };
}

// ------------------------------------------------------------------ worker

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runChecks(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // One-time (or repeat) setup of the page password and ntfy topic, so
    // neither has to live in the repo. Locked by a claim code: only its
    // SHA-256 (CLAIM_HASH) is in the config, never the code itself.
    if (url.pathname === "/setup" && request.method === "POST") {
      if (!env.CLAIM_HASH) return json({ error: "setup disabled" }, 403);
      const body = await request.json().catch(() => ({}));
      if (!safeEqual(await sha256Hex(String(body.claim || "")), env.CLAIM_HASH)) return json({ error: "bad claim code" }, 403);
      const password = String(body.password || "");
      const topic = String(body.ntfy_topic || "");
      if (password.length < 10 || !/^[A-Za-z0-9_-]{12,64}$/.test(topic)) return json({ error: "weak password or bad topic" }, 400);
      await env.STATE.put(SETTINGS_KEY, JSON.stringify({ password_hash: await sha256Hex(password), ntfy_topic: topic }));
      return json({ ok: true });
    }

    const set = await settings(env);

    if (url.pathname === "/login" && request.method === "POST") {
      if (!set.passwordHash) return html(LOGIN_PAGE("This page has no password set yet."), 503);
      const form = await request.formData();
      if (!safeEqual(await sha256Hex(String(form.get("password") || "")), set.passwordHash)) {
        return html(LOGIN_PAGE("That password didn't match. Try again."), 401);
      }
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE}=${await sessionToken(set.passwordHash)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
        },
      });
    }

    if (!(await isSignedIn(request, set))) {
      if (url.pathname === "/status") return json({ error: "sign in first" }, 401);
      return html(LOGIN_PAGE(set.passwordHash ? "" : "This page has no password set yet."), set.passwordHash ? 200 : 503);
    }

    if (url.pathname === "/status") return json(await status(env, set));

    if (url.pathname === "/test-alert" && request.method === "POST") {
      const on = channels(env, set).filter((c) => c.on && c.name !== "this page");
      if (!on.length) return json({ sent: false, message: "No phone channel is set up yet, so there's nowhere to send it." });
      await push(env, "pdtrenchio test alert", "If you can read this, alerts reach your phone.");
      return json({ sent: true, message: `Test alert sent to ${on.map((c) => c.name).join(" and ")}.` });
    }

    if (url.pathname === "/logout") {
      return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0` } });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") return html(PAGE);
    return new Response("Not found", { status: 404 });
  },
};
