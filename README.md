# KeystoneID KYC demo

KeystoneID supports a local Mock provider and an optional Sumsub Sandbox provider. The UI remains a demo and must not be used to make production identity decisions.

## Mock mode

```env
KYC_PROVIDER=mock
```

The existing local wizard simulates OCR, document verification, liveness, and face match. No document or selfie is stored.

## Sumsub Sandbox mode

Copy `.env.example` to `.env.local` and set:

```env
KYC_PROVIDER=sumsub
SUMSUB_APP_TOKEN=
SUMSUB_SECRET_KEY=
SUMSUB_BASE_URL=https://api.sumsub.com
SUMSUB_LEVEL_NAME=
```

The server signs Sumsub API requests with the current request-signing scheme (`X-App-Token`, `X-App-Access-Ts`, and `X-App-Access-Sig`). The browser only receives a short-lived Web SDK access token; `SUMSUB_SECRET_KEY` is never exposed. The verification wizard uses the official `@sumsub/websdk-react` package with `testEnv`.

If Sumsub credentials are incomplete, the app shows **Sumsub Sandbox is not configured** and offers the local Mock flow.

## Local setup

```bash
npm install
npm run dev -- -p 8000
```

## Webhook

Configure a Sumsub User Verification webhook to:

```text
https://YOUR_DOMAIN/api/kyc/webhook
```

The endpoint validates `X-Payload-Digest` (and accepts the legacy `X-Signature` header), uses a timing-safe HMAC comparison, maps review events to internal statuses (`INIT`, `PENDING`, `IN_REVIEW`, `VERIFIED`, `REJECTED`, `RETRY_REQUIRED`), and ignores duplicate event IDs. The demo store is in-memory; use a durable database before production.

## Vercel

Set the same variables in the Vercel Project Environment Variables for Preview/Development. Keep `SUMSUB_SECRET_KEY` server-only; never create a `NEXT_PUBLIC_SUMSUB_SECRET_KEY`.

## Production migration notes

Replace the in-memory verification store with a durable database, add authenticated user/admin sessions, persist webhook idempotency keys, configure a production Sumsub environment and level, and review retention, consent, access control, and compliance requirements before any production use.
