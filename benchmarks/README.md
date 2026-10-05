# Lighthouse Benchmark

This script runs Lighthouse (headful) against the local `dev` site and the deployed site (`https://abelvm.github.io/nimbiCMS/`) and produces HTML/JSON reports plus a `results.md` summary.

How to run

1. Ensure Chrome is installed and accessible in your PATH.
2. From the project root run:

```bash
npm run benchmark:lighthouse
```

What it does

- Starts a local server with `npx serve -L -p {port}` (random free port).
- Runs Lighthouse (cold and warm) for `desktop` and `mobile` on both `dev` (local) and `deployed` URLs.
- Saves reports to `benchmarks/reports/`:
  - `dev_desktop.json`, `dev_desktop.html` (canonical — cold)
  - `dev_desktop_cold.json`, `dev_desktop_cold.html`
  - `dev_desktop_warm.json`, `dev_desktop_warm.html`
  - same pattern for `dev_mobile`, `deployed_desktop`, `deployed_mobile`.
- Generates `benchmarks/reports/results.md` with a comparison table (desktop/mobile × cold/warm).

Notes

- The script uses the local `lighthouse` and `serve` available via `npx` (they are devDependencies).
- The script attempts to persist a Chrome profile under `benchmarks/profiles/` to allow warm runs to reuse cache.
