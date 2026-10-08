# Lighthouse Benchmarks

This folder contains performance benchmarks for nimbiCMS using [Lighthouse](https://developer.chrome.com/docs/lighthouse/).

## What gets measured

The benchmark script runs Lighthouse against two targets:

- **Dev** — the local development server
- **Deployed** — the live site at `https://abelvm.github.io/nimbiCMS/`

For each target, it measures both **desktop** and **mobile** performance, in **cold** (no cache) and **warm** (cached) conditions.

## Reports

Raw reports are saved to `benchmarks/reports/`:

- `dev_desktop.json` / `dev_desktop.html` — dev, desktop (canonical cold run)
- `dev_desktop_cold.json` / `dev_desktop_cold.html`
- `dev_desktop_warm.json` / `dev_desktop_warm.html`
- `dev_mobile.json` / `dev_mobile.html` — dev, mobile (canonical cold run)
- `dev_mobile_cold.json` / `dev_mobile_cold.html`
- `dev_mobile_warm.json` / `dev_mobile_warm.html`
- `deployed_desktop.json` / `deployed_desktop.html` — deployed, desktop (canonical cold run)
- `deployed_desktop_cold.json` / `deployed_desktop_cold.html`
- `deployed_desktop_warm.json` / `deployed_desktop_warm.html`
- `deployed_mobile.json` / `deployed_mobile.html` — deployed, mobile (canonical cold run)
- `deployed_mobile_cold.json` / `deployed_mobile_cold.html`
- `deployed_mobile_warm.json` / `deployed_mobile_warm.html`
- `results.md` — human-readable comparison table

## How to run

### Prerequisites

- Node.js 22+
- Chrome or Chromium installed and available in your PATH

### Run

```bash
npm run benchmark:lighthouse
```

Measure indexing across 100, 1,000, and 10,000 generated Markdown pages with:

```bash
npm run benchmark:content
```

Check generated JavaScript bundle budgets with:

```bash
npm run build && npm run check:bundle
```

The script will:

1. Start a local server on a random free port
2. Run Lighthouse (cold and warm) for desktop and mobile on both dev and deployed URLs
3. Save reports to `benchmarks/reports/`
4. Generate `benchmarks/reports/results.md` with a comparison table

### Output

After the run completes, open `benchmarks/reports/results.md` to see a side-by-side comparison of performance metrics.

## Notes

- The script uses `lighthouse` and `serve` via `npx` (they are devDependencies).
- Chrome profiles are persisted under `benchmarks/profiles/` to allow warm runs to reuse cache.
- The script retries Lighthouse runs up to 4 times with backoff to handle flakiness.
- For deployed warm runs, the script pre-warms the Chrome profile via Puppeteer to populate cache before measuring.
