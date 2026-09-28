# Easy Belly — Patient Summary Generator

A web app that converts physician encounter notes into patient-facing
Appointment Summary documents (PDF and PowerPoint), with an on-screen
Review & Edit step in between.

## How it works

- The page (`index.html`) is a static client-side app — no build step.
- Generation calls go through two small serverless functions in `api/`
  (`api/generate.js`, `api/verify-passcode.js`) instead of the browser
  calling Anthropic directly. The functions hold the Anthropic API key
  server-side, so no one using the tool needs their own key.
- Access is gated by a shared passcode, checked by `api/verify-passcode.js`.
  Once entered, the passcode is remembered in that browser (localStorage) so
  it isn't re-typed on every visit.
- Includes an offline-embedded ICD-10-CM reference dataset for diagnosis-code
  validation in the Review & Edit step — this is why `index.html` is a few MB.

## Deploying (Vercel)

This repo deploys to Vercel with no build step — the root `index.html` is
served as-is, and everything under `api/` is auto-detected as serverless
functions.

**Required environment variables** (Vercel project → Settings → Environment
Variables — set these yourself in the Vercel dashboard, never commit them to
this repo):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key. Used server-side only; the browser never sees it. |
| `ACCESS_PASSCODE` | The shared passcode staff enter once to unlock the tool. If unset, the gate is effectively open to anyone with the URL. |

After adding or changing these, redeploy (Vercel → Deployments → ⋯ →
Redeploy) so the functions pick up the new values — environment variable
changes don't apply to deployments that already ran.

## Local use

Serve the folder with any static file server (or open `index.html` directly
for everything except generation, since the API calls need `api/generate.js`
and `api/verify-passcode.js` running behind them — e.g. `vercel dev`).
