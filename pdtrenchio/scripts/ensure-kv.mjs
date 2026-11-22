// Finds (or creates) the pdtrenchio-state KV namespace and writes its id
// into wrangler.jsonc, so a fresh Cloudflare account deploys with no manual
// step. Run from cloud/ before `wrangler deploy`.
import { execSync } from "node:child_process";
import fs from "node:fs";

const TITLE = "pdtrenchio-state";
const run = (cmd) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

function findId() {
  const out = run("npx wrangler kv namespace list");
  const list = JSON.parse(out.slice(out.indexOf("[")));
  return list.find((n) => n.title === TITLE)?.id;
}

let id = findId();
if (!id) {
  console.log(`Creating KV namespace ${TITLE}`);
  run(`npx wrangler kv namespace create ${TITLE}`);
  id = findId();
}
if (!id) throw new Error("could not find or create the KV namespace");

const cfg = fs.readFileSync("wrangler.jsonc", "utf8");
fs.writeFileSync("wrangler.jsonc", cfg.replace("KV_NAMESPACE_ID", id));
console.log(`Using KV namespace ${TITLE} (${id})`);
