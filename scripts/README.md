# scripts/

This folder contains developer scripts used for repository maintenance, auditing, and developer tooling.

How to run
- Most scripts are plain Node.js files. Run them with:

```bash
node scripts/<script>.js
# or for CommonJS .cjs files
node scripts/<script>.cjs
```

- Some functionality is also exposed as `npm` scripts defined in `package.json` (e.g. `gen-dts`). Use `npm run <script>` when available.

Guidelines
- Scripts should be idempotent and safe to run locally.
- Prefer returning non-zero exit codes when failures occur so CI can detect problems.
- Add a short header comment to each script explaining purpose and typical usage.

Scripts (overview)
- `a11y-runner.js` — Accessibility checks / runner helper for automated a11y tests.
- `check-toc.cjs`, `check-toc.js` — Utilities to validate table-of-contents generation and structure.
- `find-circular-imports.cjs` — Detect circular imports across the codebase.
- `find-dead-code.cjs`, `find-dead-code-aggressive.cjs` — Find potentially dead/unused code with varying aggressiveness.
- `find-unused-exports.cjs`, `find-unused-exports.js`, `find-unused-exports2.cjs` — Detect exported symbols that are not used/imported.
- `find-unused-functions.cjs` — Seek unused/top-level functions in the codebase.
- `fix-jsdoc.cjs` — Apply automated JSDoc fixes or normalizations.
- `gen-dts.js` — Generate `src/index.d.ts` from JSDoc (also available via `npm run gen-dts`).
- `merge-jsdoc.cjs` — Merge JSDoc fragments or resolve duplicate docblocks.
- `scan-jsdoc.cjs`, `scan-jsdoc.js` — Scan source files for JSDoc coverage and report gaps.
- `select-dead-candidates.cjs` — Helper for selecting likely-dead code candidates for manual review.
- `strip-comments.cjs`, `strip-comments.js` — Remove JS comments (used by some analyses).
- `strip-css-comments.cjs` — Remove CSS comments from stylesheets.

Recommended next steps
- Add short usage examples to scripts that accept CLI args.
- Add a small test harness or CI job that runs the most-used scripts (e.g. `find-circular-imports`, `scan-jsdoc`).
- Consider centralizing common script utilities in `scripts/lib/` if several scripts share logic.

If you'd like, I can:
- Add a short usage example to each script header (PR-style edits),
- Add a CI workflow that runs key scripts, or
- Generate a table of script outputs and typical runtime for the most expensive scripts.
