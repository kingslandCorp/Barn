// HTML for the pdtrenchio page. Same layout as trench_page.py, plus a
// password screen and a "send test alert" button.

const STYLE = `
  :root {
    --bg:#0f1519; --panel:#161e24; --fg:#e3eaef; --muted:#93a3af; --line:#2a353d;
    --accent:#5fb3d0; --long:#4cc38a; --short:#f07a70; --warn:#e0a83c; --chip:#1f2a31;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) {
    :root { --bg:#f3f5f7; --panel:#fff; --fg:#142029; --muted:#5b6b78; --line:#d9e0e6;
            --accent:#1f6f8b; --long:#127a4b; --short:#b4372f; --warn:#9a6400; --chip:#e8eef2;
            color-scheme: light; }
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg);
         font:15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .wrap { max-width:1100px; margin:0 auto; padding:24px max(16px, env(safe-area-inset-right)) 48px max(16px, env(safe-area-inset-left));
          display:flex; flex-direction:column; gap:24px; }
  h1 { margin:0; font-size:1.5rem; }
  h2 { margin:0 0 10px; font-size:1.05rem; }
  .sub { color:var(--muted); font-size:0.9rem; }
  .mono { font-family: ui-monospace, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; align-items:center; }
  .chip { background:var(--chip); border-radius:999px; padding:2px 10px; font-size:0.8rem; }
  .chip.on { color:var(--long); } .chip.off { color:var(--muted); text-decoration: line-through; }
  button { font:inherit; font-size:0.85rem; color:var(--fg); background:var(--chip); border:1px solid var(--line);
           border-radius:8px; padding:4px 12px; cursor:pointer; }
  button:focus-visible, input:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  .coins { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; }
  .coin { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:14px;
          display:flex; flex-direction:column; gap:6px; min-width:0; }
  .coin.LONG { border-left:4px solid var(--long); } .coin.SHORT { border-left:4px solid var(--short); }
  .coin .top { display:flex; justify-content:space-between; align-items:baseline; gap:8px; }
  .coin .name { font-weight:600; font-size:1.05rem; }
  .coin .price { font-size:1.05rem; }
  .tag { font-size:0.72rem; font-weight:600; letter-spacing:0.05em; padding:1px 8px; border-radius:999px; background:var(--chip); }
  .tag.LONG { color:var(--long); } .tag.SHORT { color:var(--short); } .tag.FLAT { color:var(--muted); }
  dl { display:grid; grid-template-columns:max-content 1fr; gap:1px 12px; margin:0; font-size:0.85rem; }
  dt { color:var(--muted); } dd { margin:0; text-align:right; }
  .pos { color:var(--long); } .neg { color:var(--short); } .warn { color:var(--warn); }
  .muted { color:var(--muted); font-size:0.85rem; }
  .tablebox { overflow-x:auto; background:var(--panel); border:1px solid var(--line); border-radius:10px; }
  table { width:100%; border-collapse:collapse; font-size:0.85rem; }
  th, td { padding:7px 12px; border-bottom:1px solid var(--line); text-align:left; white-space:nowrap; }
  th { color:var(--muted); font-weight:500; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; }
  tbody tr:last-child td { border-bottom:0; }
  #conn.bad { color:var(--short); }
  .pick { margin-top:12px; background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:14px;
          display:flex; flex-direction:column; gap:8px; max-width:520px; }
  .pick.LONG { border-left:4px solid var(--long); } .pick.SHORT { border-left:4px solid var(--short); }
  .pick.NONE { border-left:4px solid var(--muted); }
  .pick h3 { margin:0; font-size:1.1rem; }
  .why { margin:0; padding-left:1.1rem; font-size:0.85rem; color:var(--muted); }
  .pushbox { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:12px; }
  button.primary { background:var(--accent); color:var(--bg); border:0; font-weight:600; padding:8px 14px; font-size:0.95rem; }
  .login { max-width:360px; margin:12vh auto 0; background:var(--panel); border:1px solid var(--line); border-radius:12px;
           padding:24px; display:flex; flex-direction:column; gap:12px; }
  .login input { font:inherit; padding:10px 12px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--fg); }
  .login button { padding:10px; font-size:1rem; background:var(--accent); color:var(--bg); border:0; font-weight:600; }
`;

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const LOGIN_PAGE = (message = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PDtrenchio</title><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="PDtrenchio">
<meta name="theme-color" content="#0f1519"><style>${STYLE}</style></head>
<body><div class="wrap">
<form class="login" method="post" action="/login">
  <h1>PDtrenchio</h1>
  <div class="sub">Trench signal monitor. Enter your password to see prices, open trades and alerts.</div>
  ${message ? `<div class="neg">${escapeHtml(message)}</div>` : ""}
  <label for="password" class="sub">Password</label>
  <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
  <button type="submit">Sign in</button>
</form>
</div></body></html>`;

export const PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PDtrenchio</title><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="PDtrenchio">
<meta name="theme-color" content="#0f1519"><style>${STYLE}</style></head>
<body>
<div class="wrap">
  <header>
    <h1>PDtrenchio</h1>
    <div class="sub" id="sub">Loading...</div>
    <div class="sub">Alerts go to:
      <span class="chips"><span id="channels" class="chips"></span>
      <button id="test" type="button">Send test alert</button><span id="testmsg" class="muted"></span></span>
    </div>
    <div class="pushbox">
      <button id="pushon" type="button" class="primary">Turn on phone alerts</button>
      <span id="pushmsg" class="muted"></span>
    </div>
  </header>

  <section>
    <h2>Need a trade now?</h2>
    <div class="pushbox" style="margin-top:0">
      <button id="suggest" type="button" class="primary">Suggest a trade now</button>
      <span id="suggestmsg" class="muted"></span>
    </div>
    <div id="suggestion"></div>
  </section>

  <section>
    <h2>Coins</h2>
    <div class="coins" id="coins"></div>
  </section>

  <section>
    <h2>Recent alerts</h2>
    <div class="tablebox">
      <table>
        <thead><tr><th>Time (UTC)</th><th>Alert</th><th>Coin</th><th>Lev</th><th>Price</th><th>Stop</th><th>Target</th><th>Stake</th><th>P&amp;L</th></tr></thead>
        <tbody id="alerts"></tbody>
      </table>
    </div>
  </section>
  <div class="muted">Alerts only: nothing here places trades. Enter and close trades yourself in Trench.
    Prices are Kraken's and can differ slightly from Trench's. Checks run every minute; this page refreshes every 15 seconds.
    <a href="/logout" style="color:var(--accent)">Sign out</a>. <span id="conn"></span></div>
</div>
<script>
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function px(p) {
  if (p == null) return '—';
  if (p >= 1000) return p.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  if (p >= 1) return p.toFixed(4);
  return p.toFixed(6);
}
let CUR = '£';
const gbp = v => (v < 0 ? '-' : '') + CUR + Math.abs(v).toFixed(2);
const money = v => v == null ? '—' : (v >= 0 ? '+' : '') + gbp(v);
const cls = v => v == null ? '' : (v >= 0 ? 'pos' : 'neg');
const isoTime = t => (t || '').replace('T', ' ').slice(0, 16);
const unixTime = s => s ? new Date(s * 1000).toISOString().replace('T', ' ').slice(0, 16) : '';

function coinCard(c) {
  const p = c.plan;
  const side = p ? p.direction : 'FLAT';
  let body;
  if (p) {
    body = '<dl class="mono">' +
      '<dt>Leverage</dt><dd>x' + p.leverage + '</dd>' +
      '<dt>Entry</dt><dd>' + px(p.entry) + '</dd>' +
      '<dt>Stop</dt><dd class="neg">' + px(p.stop) + '</dd>' +
      '<dt>Target</dt><dd class="pos">' + px(p.take_profit) + '</dd>' +
      '<dt>Liquidation</dt><dd class="warn">~' + px(p.liquidation) + '</dd>' +
      '<dt>Stake</dt><dd>' + gbp(p.stake) + '</dd>' +
      '<dt>Live P&amp;L</dt><dd class="' + cls(c.pnl) + '">' + money(c.pnl) + '</dd>' +
      '<dt>To stop</dt><dd>' + (c.to_stop_pct == null ? '—' : c.to_stop_pct.toFixed(2) + '%') + '</dd>' +
      '</dl><div class="muted">Opened on the ' + esc(unixTime(c.opened_at)) + ' UTC candle</div>';
  } else {
    const ls = c.last_signal ? c.last_signal.direction + ' on the ' + unixTime(c.last_signal.candle) + ' UTC candle' +
      (c.last_signal.skipped ? ' (skipped: outside alert hours)' : '') : 'none yet';
    body = '<div class="muted">No open trade. Last signal: ' + esc(ls) + '</div>';
  }
  return '<div class="coin ' + side + '">' +
    '<div class="top"><span class="name">' + esc(c.symbol.split('/')[0]) + '</span><span class="tag ' + side + '">' + side + '</span></div>' +
    '<div class="price mono">' + px(c.price) + '</div>' + body +
    (c.error ? '<div class="neg muted">Last check failed: ' + esc(c.error) + '</div>' : '') +
    '</div>';
}

function alertRow(a) {
  const open = a.event === 'open';
  const coin = (a.symbol || '').split('/')[0];
  const label = open ? 'OPEN ' + a.direction : 'CLOSE ' + a.direction + ' (' + (a.reason || '').replace('_', ' ').toLowerCase() + ')';
  const labelCls = open ? (a.direction === 'LONG' ? 'pos' : 'neg') : '';
  return '<tr>' +
    '<td class="mono">' + esc(isoTime(a.time)) + '</td>' +
    '<td class="' + labelCls + '">' + esc(label) + '</td>' +
    '<td>' + esc(coin) + '</td>' +
    '<td class="mono">x' + a.leverage + '</td>' +
    '<td class="mono">' + px(open ? a.entry : a.price) + '</td>' +
    '<td class="mono">' + (open ? px(a.stop) : '') + '</td>' +
    '<td class="mono">' + (open ? px(a.take_profit) : '') + '</td>' +
    '<td class="mono">' + (open ? gbp(a.stake) : '') + '</td>' +
    '<td class="mono ' + (open ? '' : cls(a.pnl)) + '">' + (open ? '' : money(a.pnl)) + '</td>' +
    '</tr>';
}

async function refresh() {
  const conn = document.getElementById('conn');
  try {
    const res = await fetch('/status', {cache: 'no-store'});
    if (res.status === 401) { location.reload(); return; }
    const s = await res.json();
    CUR = s.currency || '£';
    const sizing = s.stake ? gbp(s.stake) + ' stake per trade' : 'risk ' + (s.risk_pct * 100).toFixed(1) + '% of ' + gbp(s.balance) + ' per trade';
    document.getElementById('sub').textContent =
      s.strategy + ' on ' + s.timeframe + ' candles · Kraken prices · max x' + s.max_leverage + ' · ' + sizing +
      ' · alerts ' + s.alert_hours + (s.awake ? '' : ' (quiet now' + (s.held ? ', ' + s.held + ' held for 8am' : '') + ')') +
      ' · last candle processed ' + (s.last_candle ? unixTime(s.last_candle) + ' UTC' : 'not yet');
    document.getElementById('channels').innerHTML = s.channels.map(ch =>
      '<span class="chip ' + (ch.on ? 'on' : 'off') + '" title="' + esc(ch.how) + '">' + esc(ch.name) + '</span>').join('');
    document.getElementById('coins').innerHTML = s.coins.map(coinCard).join('');
    document.getElementById('alerts').innerHTML = s.alerts.length
      ? s.alerts.map(alertRow).join('')
      : '<tr><td colspan="9" class="muted">No alerts yet. They appear here when a strategy signals on a closed candle.</td></tr>';
    conn.textContent = ''; conn.className = '';
  } catch (e) {
    conn.textContent = 'Could not reach the monitor. Retrying...'; conn.className = 'bad';
  }
}

document.getElementById('test').addEventListener('click', async () => {
  const msg = document.getElementById('testmsg');
  msg.textContent = 'Sending...';
  try {
    const r = await (await fetch('/test-alert', {method: 'POST'})).json();
    msg.textContent = r.message;
  } catch (e) { msg.textContent = 'Could not send the test alert.'; }
});

// ---- on-demand suggestion ----
let lastPick = null;
function planList(p) {
  return '<dl class="mono">' +
    '<dt>Entry</dt><dd>~' + px(p.entry) + '</dd>' +
    '<dt>Leverage</dt><dd>x' + p.leverage + '</dd>' +
    '<dt>Stake</dt><dd>' + gbp(p.stake) + '</dd>' +
    '<dt>Stop-loss</dt><dd class="neg">' + px(p.stop) + ' (lose ~' + gbp(p.risk_amount) + ')</dd>' +
    '<dt>Take-profit</dt><dd class="pos">' + px(p.take_profit) + ' (win ~' + gbp(p.risk_amount * p.reward_risk) + ')</dd>' +
    '<dt>Liquidation</dt><dd class="warn">~' + px(p.liquidation) + '</dd></dl>';
}
document.getElementById('suggest').addEventListener('click', async () => {
  const msg = document.getElementById('suggestmsg');
  const box = document.getElementById('suggestion');
  msg.textContent = 'Checking all five coins...';
  try {
    const r = await (await fetch('/suggest', {cache: 'no-store'})).json();
    CUR = r.currency || CUR;
    lastPick = r.pick;
    const why = '<ul class="why">' + r.coins.map(c =>
      '<li>' + esc(c.symbol.split('/')[0]) + ': ' + esc(c.ok ? 'OK, ' + c.reason : c.reason) + '</li>').join('') + '</ul>';
    if (r.pick) {
      const p = r.pick.plan;
      box.innerHTML = '<div class="pick ' + p.direction + '"><h3>' + p.direction + ' ' + esc(p.symbol.split('/')[0]) + ' x' + p.leverage + '</h3>' +
        '<div class="muted">' + esc(r.pick.reason) + '. Weaker than a fresh crossover alert. Set the stop-loss in Trench.</div>' +
        planList(p) +
        '<div><button id="track" type="button">Watch this trade for me</button> <span id="trackmsg" class="muted"></span></div>' +
        '<div class="muted">Why this coin, and the others:</div>' + why + '</div>';
      document.getElementById('track').addEventListener('click', async () => {
        const t = document.getElementById('trackmsg');
        const res = await fetch('/track', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(lastPick.plan)});
        const j = await res.json();
        t.textContent = res.ok ? 'Watching. You will get the CLOSE alert.' : (j.error || 'Could not watch it.');
        if (res.ok) refresh();
      });
    } else {
      box.innerHTML = '<div class="pick NONE"><h3>No trade right now</h3>' +
        '<div class="muted">None of the five coins has a clean setup. Sitting out is a position too.</div>' + why + '</div>';
    }
    msg.textContent = 'Checked at ' + new Date(r.time).toLocaleTimeString() + '. Prices move fast: act within a few minutes or check again.';
  } catch (e) {
    msg.textContent = 'Could not get a suggestion. Try again.';
  }
});

// ---- phone alerts (web push) ----
const pushBtn = document.getElementById('pushon');
const pushMsg = document.getElementById('pushmsg');
const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
const standalone = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
function keyBytes(b64) {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}
async function pushState() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    pushBtn.hidden = true;
    pushMsg.textContent = isIos && !standalone
      ? 'iPhone: tap Share, then Add to Home Screen. Open PDtrenchio from your home screen and tap Turn on phone alerts there.'
      : 'This browser cannot receive alerts. Try Chrome on Android or Safari on iPhone (from the home screen).';
    return;
  }
  const reg = await navigator.serviceWorker.register('/sw.js');
  const sub = await reg.pushManager.getSubscription();
  if (sub && Notification.permission === 'granted') {
    pushBtn.textContent = 'Phone alerts on ✓ (tap to refresh)';
  }
}
pushBtn.addEventListener('click', async () => {
  pushMsg.textContent = 'Turning on...';
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { pushMsg.textContent = 'Notifications are blocked. Allow them for this site in your phone settings, then tap again.'; return; }
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    const { key } = await (await fetch('/push-key')).json();
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(key) });
    const r = await fetch('/subscribe', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(sub) });
    if (!r.ok) throw new Error('server said ' + r.status);
    pushBtn.textContent = 'Phone alerts on ✓ (tap to refresh)';
    pushMsg.textContent = 'Done. Tap Send test alert to check.';
    refresh();
  } catch (e) {
    pushMsg.textContent = 'Could not turn on alerts: ' + e.message;
  }
});
pushState().catch(() => {});

refresh();
setInterval(refresh, 15000);
</script>
</body></html>`;

export const MANIFEST = JSON.stringify({
  name: "PDtrenchio",
  short_name: "PDtrenchio",
  start_url: "/",
  display: "standalone",
  background_color: "#0f1519",
  theme_color: "#0f1519",
  icons: [
    { src: "/icon-180.png", sizes: "180x180", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

// Shows each pushed alert as a notification; tapping it opens the page.
export const SERVICE_WORKER = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (event) => {
  let data = { title: 'PDtrenchio', body: 'New alert' };
  try { data = event.data.json(); } catch (e) {}
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: '/icon-180.png', badge: '/icon-180.png', tag: data.title, renotify: true,
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window' }).then((list) => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('/');
  }));
});
`;
