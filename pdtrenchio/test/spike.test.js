import { test } from "node:test";
import assert from "node:assert/strict";
import { checkSpikes, detectSpike, to3m, HEADSUP } from "../src/spike.js";

const T0 = 1795000000 - (1795000000 % 900);
// calm 5m candles (range 0.2, volume 10), then optionally one spike
function c5series(n, spike) {
  const out = [];
  for (let i = 0; i < n; i++) out.push({ t: T0 + i * 300, open: 100, high: 100.1, low: 99.9, close: 100, volume: 10 });
  if (spike) out.push({ t: T0 + n * 300, ...spike });
  return out;
}

test("big up-spike with volume and a strong close is detected; small or weak ones are not", () => {
  const big = c5series(40, { open: 100, high: 101.2, low: 99.95, close: 101.1, volume: 40 });
  const sp = detectSpike(big, HEADSUP);
  assert.equal(sp.direction, "LONG");
  assert.ok(sp.rangeAtr >= 3 && sp.volMult >= 2);
  assert.equal(detectSpike(c5series(40, { open: 100, high: 100.3, low: 99.95, close: 100.28, volume: 40 }), HEADSUP), null, "too small");
  assert.equal(detectSpike(c5series(40, { open: 100, high: 101.2, low: 99.95, close: 101.1, volume: 12 }), HEADSUP), null, "no volume");
  assert.equal(detectSpike(c5series(40, { open: 100, high: 101.2, low: 99.95, close: 100.2, volume: 40 }), HEADSUP), null, "weak close");
});

test("1m candles roll up into complete 3m candles only", () => {
  const c1 = Array.from({ length: 7 }, (_, i) => ({ t: T0 + i * 60, open: i, high: i + 1, low: i - 1, close: i + 0.5, volume: 1 }));
  const c3 = to3m(c1);
  assert.equal(c3.length, 2);
  assert.deepEqual([c3[0].open, c3[0].close, c3[0].high, c3[0].low, c3[0].volume], [0, 2.5, 3, -1, 3]);
});

test("no 15m trend: waits for the 3m follow-through, then alerts once", () => {
  const spikeT = T0 + 40 * 300;
  const c5 = [...c5series(40, { open: 100, high: 101.2, low: 99.95, close: 101.1, volume: 40 }), { t: spikeT + 300, open: 101.1, high: 101.2, low: 101, close: 101.15, volume: 5 }];
  const c15 = Array.from({ length: 40 }, (_, i) => ({ t: T0 - 25 * 900 + i * 900, open: 100, high: 100.1, low: 99.9, close: 100, volume: 30 })); // flat: no trend
  const ones = (n, px) => Array.from({ length: n }, (_, i) => ({ t: spikeT + 300 + i * 60, open: px, high: px + 0.05, low: px - 0.05, close: px, volume: 1 }));
  const state = {};
  // spike just closed, no 3m candle after it yet -> pending, no alert
  assert.deepEqual(checkSpikes(state, "SOL/USD", c5, c15, ones(1, 101.1), spikeT + 330), []);
  assert.ok(state.spike_pending["SOL/USD"]);
  // first 3m candle after the spike closes above the breakout level -> one alert
  // 3m candles sit on clock boundaries: the first full one after a :05 close is :06-:09
  const a = checkSpikes(state, "SOL/USD", c5, c15, ones(8, 101.15), spikeT + 300 + 480);
  assert.equal(a.length, 1);
  assert.equal(a[0].event, "spike");
  assert.equal(a[0].by, "3m follow-through");
  assert.equal(state.spike_pending["SOL/USD"], undefined);
  assert.deepEqual(checkSpikes(state, "SOL/USD", c5, c15, ones(8, 101.15), spikeT + 300 + 540), [], "no repeat");
});

test("fake-out: 3m candle falls back inside -> no alert", () => {
  const spikeT = T0 + 40 * 300;
  const c5 = [...c5series(40, { open: 100, high: 101.2, low: 99.95, close: 101.1, volume: 40 }), { t: spikeT + 300, open: 101.1, high: 101.2, low: 99.9, close: 100, volume: 5 }];
  const c15 = Array.from({ length: 40 }, (_, i) => ({ t: T0 - 25 * 900 + i * 900, open: 100, high: 100.1, low: 99.9, close: 100, volume: 30 }));
  const state = {};
  checkSpikes(state, "SOL/USD", c5, c15, [{ t: spikeT + 300, open: 101, high: 101, low: 101, close: 101, volume: 1 }], spikeT + 330);
  const back = Array.from({ length: 8 }, (_, i) => ({ t: spikeT + 300 + i * 60, open: 100, high: 100.05, low: 99.95, close: 100, volume: 1 }));
  assert.deepEqual(checkSpikes(state, "SOL/USD", c5, c15, back, spikeT + 780), []);
  assert.equal(state.spike_pending["SOL/USD"], undefined);
});
