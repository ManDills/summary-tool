# Easy Belly — Patient Summary Generator

A single-file, client-side web app that converts physician encounter notes into
patient-facing Appointment Summary documents (PDF and PowerPoint), with an
on-screen Review & Edit step in between.

## How it works

- Everything runs in the browser — there is no backend and no server-side storage.
- Each user enters their own Anthropic API key directly in the tool (stored only
  in that browser session, never committed to this repo or sent anywhere but
  api.anthropic.com).
- PDF export via jsPDF, PowerPoint export via PptxGenJS (both loaded from CDN).
- Includes an offline-embedded ICD-10-CM reference dataset for diagnosis-code
  validation in the Review & Edit step — this is why `index.html` is a few MB.

## Deploying

This is a static site — a single `index.html` with no build step. It deploys
as-is to Vercel, Netlify, GitHub Pages, or any static host: just point the host
at the repo root (or `easybelly-summary-tool/` if nested) with no build command
and no output directory override needed.

## Local use

Just open `index.html` directly in a browser, or serve the folder with any
static file server.
