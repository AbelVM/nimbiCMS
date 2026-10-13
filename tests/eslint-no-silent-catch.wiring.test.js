import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { RuleTester } from "eslint";

/**
 * The `no-silent-catch` rule is enforced globally as an ESLint error, but a
 * rule that silently stops running is invisible to every other signal: its
 * own unit tests import the rule file directly and would still pass, and
 * `npm run lint` would still report zero errors.
 *
 * That failure mode actually happened during this audit — the plugin
 * registration and the ESLint config were both reverted, so the rule was
 * inert for several sessions while every gate stayed green.
 *
 * These tests load the rule the way ESLint does, through the plugin entry
 * point, so a broken registration fails here.
 */
const require = createRequire(import.meta.url);

describe("no-silent-catch is wired into the plugin", () => {
  it("is registered on the plugin's rule map", () => {
    const plugin = require("../eslint-plugin-nimbi-debug/index.cjs");
    expect(Object.keys(plugin.rules)).toContain("no-silent-catch");
  });

  it("resolves to the same rule object as a direct import", () => {
    const plugin = require("../eslint-plugin-nimbi-debug/index.cjs");
    const direct = require("../eslint-plugin-nimbi-debug/rules/no-silent-catch.cjs");
    expect(plugin.rules["no-silent-catch"]).toBe(direct);
  });

  it("is enabled as an error in the ESLint config", () => {
    // The config cannot be imported here: requiring it executes
    // `eslint-plugin-unused-imports`, which needs a real filename. Assert on
    // the source instead, which is what would have caught the regression.
    // `import.meta.url` is an http URL under Vitest, so resolve from cwd.
    const src = readFileSync(resolve(process.cwd(), "eslint.config.cjs"), "utf8");
    expect(src).toContain("'nimbi-debug/no-silent-catch': 'error'");
  });

});

// `RuleTester.run` registers a suite, so it must be top-level.
const _rule = require("../eslint-plugin-nimbi-debug/rules/no-silent-catch.cjs");
const _tester = new RuleTester({
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});
_tester.run("no-silent-catch (smoke)", _rule, {
  valid: [],
  invalid: [
    {
      code: `try { risky(); } catch (e) { let x = 1; }`,
      errors: [{ messageId: "silentCatch" }],
    },
  ],
});
