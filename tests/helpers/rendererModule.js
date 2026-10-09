/**
 * Shared helper for tests that need to load `src/worker/renderer.js` as a
 * plain ES module.
 *
 * `renderer.js` is written as a Web Worker entry point: it assigns
 * `onmessage` at module scope and imports its runtime through a relative
 * specifier that only resolves inside `src/worker/`. To exercise it from a
 * test in `tests/`, the source has to be rewritten on the way to a temp file.
 *
 * Five test files used to do this independently with slightly different
 * string replacements, which meant every new relative import added to
 * `renderer.js` silently broke all of them. This helper centralizes the
 * rewrite so there is one place to update.
 *
 * @module tests/helpers/rendererModule
 */
import fs from "node:fs";
import path from "node:path";

/**
 * Rewrite `src/worker/renderer.js` so it can be imported from a test.
 *
 * Two transformations are applied:
 * 1. `onmessage = ...` becomes `globalThis.onmessage = ...` so the assignment
 *    does not throw in a non-worker scope.
 * 2. Relative specifiers are re-rooted from `src/worker/` to the temp file's
 *    location, so `./rendererRuntime.js` and `../utils/*.js` resolve.
 *
 * @param {object} [options]
 * @param {string} [options.runtimeSpecifier] - Override the rewritten
 *   `rendererRuntime.js` specifier entirely.
 * @param {boolean} [options.cacheBust=false] - Append a unique query string
 *   to the runtime specifier so the module registry does not return a cached
 *   copy from a previous test in the same file.
 * @param {number} [options.depth=2] - Directory depth of the temp file
 *   relative to the repo root. `tests/worker/x.mjs` is depth 2;
 *   `tests/x.mjs` is depth 1. Controls how many `../` segments the rewritten
 *   specifiers need.
 * @returns {string} The rewritten module source.
 */
export function readRewrittenRendererSource(options = {}) {
  const { runtimeSpecifier, cacheBust = false, depth = 2 } = options;
  const src = fs.readFileSync(
    path.resolve("src/worker/renderer.js"),
    "utf8",
  );

  let rewritten = src.replace(
    /(^|\n)onmessage\s*=\s*/g,
    "$1globalThis.onmessage = ",
  );

  const up = "../".repeat(depth);
  const specifier =
    runtimeSpecifier ??
    (cacheBust
      ? `${up}src/worker/rendererRuntime.js?test=${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`
      : `${up}src/worker/rendererRuntime.js`);

  rewritten = rewritten.replace("./rendererRuntime.js", specifier);

  // Any `../utils/...` import must be re-rooted at src/ as well, otherwise it
  // resolves against the temp file's directory instead.
  rewritten = rewritten.replace(
    /"\.\.\/utils\//g,
    `"${up}src/utils/`,
  );

  return rewritten;
}

export default { readRewrittenRendererSource };
