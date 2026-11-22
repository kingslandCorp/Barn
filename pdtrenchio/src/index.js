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

import { assessCoin, checkCoin, emptyState, inAlertHours, minCandles, pnlAt, recommend, MAX_TRENCH_LEVERAGE } from "./logic.js";
import { LOGIN_PAGE, PAGE, MANIFEST, SERVICE_WORKER } from "./page.js";
import { ICON_180, ICON_512 } from "./icons.js";
import { generateVapidKeys, sendWebPush } from "./webpush.js";
import { checkSpikes } from "./spike.js";
import { assessQuick, checkQuickExit } from "./quick.js";
import { exitPrice, exitReason } from "./logic.js";

const STATE_KEY = "state";
const SETTINGS_KEY = "settings"; // { password_hash, ntfy_topic } set once via /setup
const VAPID_KEY = "vapid";       // web push key pair, generated on first use
const SUBS_KEY = "push_subs";    // browsers that turned on alerts (max 10)
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
    stake: num(env.STAKE, 0),             // fixed stake per trade; 0 = size from BALANCE x RISK_PCT
    currency: env.CURRENCY || "£",
    minQuickWin: num(env.MIN_QUICK_WIN, 1),  // quick trades: target must win at least this, after fees
    timeZone: env.TIMEZONE || "Europe/London",
    alertStart: num(env.ALERT_START_HOUR, 8),
    alertEnd: num(env.ALERT_END_HOUR, 22),
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
  return rows.map((r) => ({ t: r[0], open: +r[1], high: +r[2], low: +r[3], close: +r[4], volume: +r[6] }));
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

export function alertText(a, cur = "£") {
  const coin = a.symbol.split("/")[0];
  const m = (v) => `${v < 0 ? "-" : ""}${cur}${Math.abs(v).toFixed(2)}`;
  if (a.event === "spike") {
    const up = a.direction === "LONG";
    return {
      title: `BIG MOVE ${up ? "UP" : "DOWN"}: ${coin} ${a.move_pct >= 0 ? "+" : ""}${a.move_pct.toFixed(2)}% in 5 min`,
      body: [
        `5-min candle ${a.range_atr.toFixed(1)}x normal size on ${a.vol_mult.toFixed(1)}x normal volume.`,
        `Confirmed by ${a.by}. Price now ~${fmtPrice(a.price)}.`,
        `Heads-up only, not a trade signal: chasing spikes lost money in testing.`,
      ].join("\n"),
    };
  }
  if (a.event === "open") {
    return {
      title: `OPEN ${a.direction} ${coin} x${a.leverage}`,
      body: [
        `Entry ~${fmtPrice(a.entry)}  Leverage x${a.leverage}  Stake ${m(a.stake)}`,
        `Stop ${fmtPrice(a.stop)} (${(a.stop_pct * 100).toFixed(2)}% away, lose ~${m(a.risk_amount)})`,
        `Target ${fmtPrice(a.take_profit)} (win ~${m(a.risk_amount * a.reward_risk)})`,
        `Set the stop-loss in Trench when you open it.`,
        `Liquidation ~${fmtPrice(a.liquidation)}`,
        `Skip it if price is already past the stop or target.`,
      ].join("\n"),
    };
  }
  const why = a.reason === "TIME_LIMIT" ? "5 minutes up" : a.reason.replace("_", " ").toLowerCase();
  return {
    title: `CLOSE ${a.direction} ${coin} (${why})`,
    body: `Close your x${a.leverage} ${a.direction.toLowerCase()} on ${coin}.\n` +
      `Entry ${fmtPrice(a.entry)} -> now ~${fmtPrice(a.price)}\nApprox P&L ${a.pnl >= 0 ? "+" : ""}${m(a.pnl)}`,
  };
}

async function getVapid(env) {
  let vapid = await env.STATE.get(VAPID_KEY, "json");
  if (!vapid) {
    vapid = await generateVapidKeys();
    await env.STATE.put(VAPID_KEY, JSON.stringify(vapid));
  }
  return vapid;
}

async function pushSubs(env) {
  return (await env.STATE.get(SUBS_KEY, "json")) || [];
}

// Sends to every subscribed browser; forgets ones the browser has dropped.
async function webPush(env, title, body, origin) {
  const subs = await pushSubs(env);
  if (!subs.length) return [];
  const vapid = await getVapid(env);
  const payload = JSON.stringify({ title, body });
  const results = await Promise.allSettled(subs.map((sub) => sendWebPush(sub, payload, vapid, origin)));
  const problems = [];
  const keep = subs.filter((sub, i) => {
    const r = results[i];
    if (r.status === "rejected") { problems.push(`web push: ${String(r.reason).slice(0, 120)}`); return true; }
    if (r.value.gone) return false;
    if (!r.value.ok) problems.push(`web push HTTP ${r.value.status}: ${r.value.detail}`);
    return true;
  });
  if (keep.length !== subs.length) await env.STATE.put(SUBS_KEY, JSON.stringify(keep));
  return problems;
}

async function push(env, title, body) {
  const origin = env.PUBLIC_ORIGIN || "https://pdtrenchio.workers.dev";
  const webProblems = await webPush(env, title, body, origin);
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
  const problems = [];
  for (const r of results) {
    if (r.status === "rejected") problems.push(String(r.reason));
    else if (!r.value.ok) problems.push(`HTTP ${r.value.status}: ${(await r.value.text()).slice(0, 200)}`);
  }
  problems.push(...webProblems);
  if (problems.length) console.log("push failed", problems.join("; "));
  return problems;
}

function channels(env, set, subCount = 0) {
  return [
    { name: "this page", on: true, how: "Always on: the Recent alerts table" },
    { name: subCount ? `phone alerts (${subCount} device${subCount > 1 ? "s" : ""})` : "phone alerts", on: subCount > 0,
      how: "Tap 'Turn on phone alerts' on each phone" },
    { name: "ntfy app", on: !!set.ntfyTopic, how: "Subscribe to this monitor's topic in the ntfy app" },
    { name: "Telegram", on: !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID), how: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID secrets" },
  ];
}

// ------------------------------------------------------------------- cron

export async function runChecks(env, now = new Date()) {
  const cfg = config(env);
  const awake = inAlertHours(now, cfg.timeZone, cfg.alertStart, cfg.alertEnd);
  cfg.allowOpen = awake;
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

  // Spike heads-ups: big 5m moves validated by the 15m trend or 3m follow-through.
  // Information only (no trade plan); dropped outside alert hours, since a
  // spike is stale by morning.
  const spikeAlerts = [];
  const quickCloses = [];
  const nowSec = Math.floor(now.getTime() / 1000);
  const extra = await Promise.allSettled(cfg.coins.flatMap((c) => [fetchCandles(c, 5), fetchCandles(c, 1)]));
  cfg.coins.forEach((coin, i) => {
    const symbol = symbolOf(coin);
    const c5 = extra[2 * i], c1 = extra[2 * i + 1], c15 = fetched[i];
    // Quick trades you chose to watch: stop / target / 5-minute limit, on 1m candles.
    if (c1.status === "fulfilled") {
      quickCloses.push(...checkQuickExit(state, symbol, c1.value, nowSec, exitReason, exitPrice, pnlAt, cfg.feePct));
    }
    if (env.SPIKE_HEADSUPS === "off") return;
    if (c5.status !== "fulfilled" || c1.status !== "fulfilled" || c15.status !== "fulfilled") return;
    try {
      spikeAlerts.push(...checkSpikes(state, symbol, c5.value, c15.value, c1.value, nowSec));
    } catch (e) {
      state.errors[symbol] = `spike check: ${String(e).slice(0, 150)}`;
    }
  });
  const spikesToSend = awake ? spikeAlerts : [];
  newAlerts.push(...spikeAlerts.map((a) => ({ ...a, sent: awake })), ...quickCloses);

  if (newAlerts.length) state.alerts = [...newAlerts.slice().reverse(), ...state.alerts].slice(0, 50);

  // Quiet hours: hold alerts and send them as one summary when the day starts.
  let toSend = [];
  let summary = null;
  // Quick-trade closes always go out: you started that trade minutes ago.
  const tradeAlerts = newAlerts.filter((a) => a.event !== "spike" && !a.quick);
  if (!awake) {
    state.held = [...state.held, ...tradeAlerts];
  } else {
    if (state.held.length) {
      const lines = state.held.map((a) => {
        const t = alertText(a, cfg.currency);
        return `${t.title}${a.event === "close" ? ` (P&L ${a.pnl >= 0 ? "+" : "-"}${cfg.currency}${Math.abs(a.pnl).toFixed(2)})` : ""}`;
      });
      summary = { title: `Overnight: ${state.held.length} update${state.held.length > 1 ? "s" : ""}`, body: lines.join("\n") };
      state.held = [];
    }
    toSend = [...tradeAlerts, ...spikesToSend];
  }
  toSend.push(...quickCloses);

  if (comparable(state) !== before) {
    state.checked_at = new Date().toISOString();
    await env.STATE.put(STATE_KEY, JSON.stringify(state)); // save before pushing: never alert twice
  }
  if (summary) await push(env, summary.title, summary.body);
  for (const a of toSend) {
    const { title, body } = alertText(a, cfg.currency);
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
    stake: cfg.stake, currency: cfg.currency, alert_hours: `${cfg.alertStart}:00-${cfg.alertEnd}:00 ${cfg.timeZone}`,
    awake: inAlertHours(new Date(), cfg.timeZone, cfg.alertStart, cfg.alertEnd), held: state.held.length,
    channels: channels(env, set, (await pushSubs(env)).length), coins, alerts: state.alerts,
  };
}

// ------------------------------------------------------------------ worker

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runChecks(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // Public, non-sensitive files the browser needs for install and push.
    if (url.pathname === "/sw.js") {
      return new Response(SERVICE_WORKER, { headers: { "Content-Type": "text/javascript", "Cache-Control": "no-cache" } });
    }
    if (url.pathname === "/manifest.webmanifest") {
      return new Response(MANIFEST, { headers: { "Content-Type": "application/manifest+json" } });
    }
    if (url.pathname === "/icon-180.png" || url.pathname === "/icon-512.png") {
      const b64 = url.pathname === "/icon-180.png" ? ICON_180 : ICON_512;
      return new Response(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    }

    // One-time (or repeat) setup of the page password and ntfy topic, so
    // neither has to live in the repo. Locked by a claim code: only its
    // SHA-256 (CLAIM_HASH) is in the config, never the code itself.
    if (url.pathname === "/setup" && request.method === "POST") {
      if (!env.CLAIM_HASH) return json({ error: "setup disabled" }, 403);
      const body = await request.json().catch(() => ({}));
      if (!safeEqual(await sha256Hex(String(body.claim || "")), env.CLAIM_HASH)) return json({ error: "bad claim code" }, 403);
      const password = String(body.password || "");
      const topic = String(body.ntfy_topic || "");
      if (password.length < 10 || (topic && !/^[A-Za-z0-9_-]{12,64}$/.test(topic))) return json({ error: "weak password or bad topic" }, 400);
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

    if (url.pathname === "/push-key") return json({ key: (await getVapid(env)).publicKey });

    if (url.pathname === "/subscribe" && request.method === "POST") {
      const sub = await request.json().catch(() => null);
      if (!sub || typeof sub.endpoint !== "string" || !sub.endpoint.startsWith("https://") || !sub.keys?.p256dh || !sub.keys?.auth) {
        return json({ error: "bad subscription" }, 400);
      }
      const subs = (await pushSubs(env)).filter((s) => s.endpoint !== sub.endpoint);
      subs.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } });
      await env.STATE.put(SUBS_KEY, JSON.stringify(subs.slice(-10)));
      return json({ ok: true, devices: Math.min(subs.length, 10) });
    }

    // On-demand advice: best clean setup right now, or "no trade".
    if (url.pathname === "/suggest") {
      const cfg = config(env);
      const state = await loadState(env);
      const nowSec = Math.floor(Date.now() / 1000);
      const results = await Promise.allSettled(cfg.coins.map((c) => fetchCandles(c, 1)));
      const assessed = cfg.coins.map((coin, i) => {
        const symbol = symbolOf(coin);
        const r = results[i];
        if (r.status === "rejected") return { symbol, ok: false, reason: "price data unavailable" };
        const candles = r.value;
        const a = assessQuick(symbol, candles, candles[candles.length - 1].close, cfg, nowSec);
        if (a.ok && state.open[symbol]) return { ...a, ok: false, reason: "you already have an open trade on this coin" };
        return a;
      });
      return json({ ...recommend(assessed), currency: cfg.currency, fee_pct: cfg.feePct, time: new Date().toISOString() });
    }

    // "Watch this trade for me": track a suggested plan so a CLOSE alert follows.
    if (url.pathname === "/track" && request.method === "POST") {
      const plan = await request.json().catch(() => null);
      const cfg = config(env);
      if (!plan || !cfg.coins.map(symbolOf).includes(plan.symbol) || !["LONG", "SHORT"].includes(plan.direction) ||
          !(plan.leverage >= 1 && plan.leverage <= MAX_TRENCH_LEVERAGE)) {
        return json({ error: "bad trade" }, 400);
      }
      const state = await loadState(env);
      if (state.open[plan.symbol]) return json({ error: "already watching a trade on this coin" }, 409);
      const keys = ["symbol", "direction", "entry", "stop", "take_profit", "liquidation", "leverage", "stake", "risk_amount", "stop_pct", "reward_risk"];
      state.open[plan.symbol] = Object.fromEntries(keys.map((k) => [k, plan[k]]));
      if (plan.quick) {
        const nowSec = Math.floor(Date.now() / 1000);
        state.open[plan.symbol].quick = true;
        state.open[plan.symbol].expires_at = nowSec + 5 * 60; // set here, not trusted from the browser
        state.opened_at[plan.symbol] = Math.floor(nowSec / 60) * 60; // exits checked from the next minute on
      } else {
        const candles = await fetchCandles(plan.symbol.split("/")[0], cfg.timeframeMin);
        state.opened_at[plan.symbol] = candles[candles.length - 1].t; // exits checked from the next candle on
      }
      const alert = { time: new Date().toISOString(), event: "open", manual: true, ...state.open[plan.symbol] };
      state.alerts = [alert, ...state.alerts].slice(0, 50);
      state.checked_at = new Date().toISOString();
      await env.STATE.put(STATE_KEY, JSON.stringify(state));
      return json({ ok: true });
    }

    if (url.pathname === "/run-now" && request.method === "POST") {
      const alerts = await runChecks(env);
      const s = await loadState(env);
      return json({ alerts: alerts.length, last_candle: Math.max(0, ...Object.values(s.last_candle)) || null, errors: s.errors });
    }

    if (url.pathname === "/test-alert" && request.method === "POST") {
      const on = channels(env, set, (await pushSubs(env)).length).filter((c) => c.on && c.name !== "this page");
      if (!on.length) return json({ sent: false, message: "No phone channel is set up yet, so there's nowhere to send it." });
      const problems = await push(env, "PDtrenchio test alert", "If you can read this, alerts reach your phone.");
      if (problems.length) return json({ sent: false, message: `Sent, but some channels failed: ${problems.join("; ")}` });
      return json({ sent: true, message: `Test alert sent to ${on.map((c) => c.name).join(" and ")}.` });
    }

    if (url.pathname === "/logout") {
      return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0` } });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") return html(PAGE);
    return new Response("Not found", { status: 404 });
  },
};
