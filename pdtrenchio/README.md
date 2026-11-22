# pdtrenchio

Deploy copy of the Trench signal monitor Worker. The source of truth is
`cloud/` in the private Cryptobot repository; this copy exists so it can
deploy with this repository's Cloudflare token
(`.github/workflows/deploy-pdtrenchio.yml`). It holds no secrets: the page
password and alert topic are stored in the Worker's KV, set via `POST /setup`.
