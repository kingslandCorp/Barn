import { test } from "node:test";
import assert from "node:assert/strict";
import nodeCrypto from "node:crypto";
import { b64url, encryptPayload, fromB64url, generateVapidKeys, vapidAuthHeader } from "../src/webpush.js";

// Decrypts an aes128gcm Web Push body the way a browser does, using
// node:crypto (an implementation independent of the WebCrypto code under test).
function browserDecrypt(body, uaEcdh, authSecret) {
  const salt = body.subarray(0, 16);
  const idlen = body[20];
  const asPublic = body.subarray(21, 21 + idlen);
  const ciphertext = body.subarray(21 + idlen);
  const uaPublic = uaEcdh.getPublicKey();
  const ecdhSecret = uaEcdh.computeSecret(asPublic);
  const info = Buffer.concat([Buffer.from("WebPush: info\0"), uaPublic, asPublic]);
  const ikm = Buffer.from(nodeCrypto.hkdfSync("sha256", ecdhSecret, authSecret, info, 32));
  const cek = Buffer.from(nodeCrypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0"), 16));
  const nonce = Buffer.from(nodeCrypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0"), 12));
  const tag = ciphertext.subarray(ciphertext.length - 16);
  const decipher = nodeCrypto.createDecipheriv("aes-128-gcm", cek, nonce);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext.subarray(0, ciphertext.length - 16)), decipher.final()]);
  assert.equal(plain[plain.length - 1], 2, "last-record delimiter");
  return plain.subarray(0, plain.length - 1).toString();
}

test("encrypted push payload decrypts like a browser would", async () => {
  const ua = nodeCrypto.createECDH("prime256v1");
  ua.generateKeys();
  const auth = nodeCrypto.randomBytes(16);
  const sub = { endpoint: "https://fcm.googleapis.com/fcm/send/x", keys: { p256dh: b64url(ua.getPublicKey()), auth: b64url(auth) } };
  const msg = JSON.stringify({ title: "OPEN LONG SOL x62", body: "Entry ~142.31" });
  const body = await encryptPayload(sub, msg);
  assert.equal(browserDecrypt(Buffer.from(body), ua, auth), msg);
});

test("VAPID JWT is a valid ES256 signature over the right audience", async () => {
  const vapid = await generateVapidKeys();
  const header = await vapidAuthHeader("https://web.push.apple.com/abc", vapid, "https://pdtrenchio.example", 1_000_000);
  const m = header.match(/^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/);
  assert.ok(m);
  const claims = JSON.parse(Buffer.from(fromB64url(m[2])).toString());
  assert.equal(claims.aud, "https://web.push.apple.com");
  assert.equal(claims.exp, 1_000_000 + 12 * 3600);
  const pub = nodeCrypto.createPublicKey({ key: { kty: "EC", crv: "P-256", x: vapid.privateJwk.x, y: vapid.privateJwk.y }, format: "jwk" });
  const ok = nodeCrypto.verify("sha256", Buffer.from(`${m[1]}.${m[2]}`), { key: pub, dsaEncoding: "ieee-p1363" }, Buffer.from(fromB64url(m[3])));
  assert.ok(ok);
  assert.equal(m[4], vapid.publicKey);
  assert.equal(fromB64url(vapid.publicKey).length, 65);
});
