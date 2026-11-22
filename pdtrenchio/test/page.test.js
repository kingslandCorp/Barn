import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { PAGE, SERVICE_WORKER } from "../src/page.js";

// The page's inline script must at least parse: a syntax error blanks the whole page.
test("page script and service worker parse as JavaScript", () => {
  const scripts = [...PAGE.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.ok(scripts.length >= 1);
  for (const code of scripts) assert.doesNotThrow(() => new vm.Script(code), "page script has a syntax error");
  assert.doesNotThrow(() => new vm.Script(SERVICE_WORKER));
});
