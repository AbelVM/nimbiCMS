import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import rule from "../eslint-plugin-nimbi-debug/rules/no-silent-catch.cjs";

/**
 * The `no-silent-catch` rule exists because two real bugs (a `null`
 * AbortController dereference and a missing import) were hidden by catch
 * blocks that discarded the error. These tests pin the rule's behaviour so it
 * cannot silently regress into either false positives or false negatives.
 */
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});

describe("eslint rule: no-silent-catch", () => {
  ruleTester.run("no-silent-catch", rule, {
    valid: [
      // Logs the error.
      {
        code: `try { risky(); } catch (e) { debugWarn("failed", e); }`,
      },
      // Optional-chained logger (the pattern used throughout init.js).
      {
        code: `try { risky(); } catch (e) { debugWarn?.("failed", e); }`,
      },
      // console.* is a logger.
      {
        code: `try { risky(); } catch (e) { console.warn(e); }`,
      },
      // Rethrows.
      {
        code: `try { risky(); } catch (e) { throw e; }`,
      },
      // Returns an explicit fallback.
      {
        code: `function f() { try { risky(); } catch (e) { return ""; } }`,
      },
      // Captures into a collection.
      {
        code: `try { risky(); } catch (e) { errors.push(e); }`,
      },
      // Assigns to an error-capture property.
      {
        code: `try { risky(); } catch (e) { state.lastError = e; }`,
      },
      // Nested try/catch counts as deliberate handling.
      {
        code: `try { risky(); } catch (e) { try { other(); } catch (_) {} }`,
      },
      // Logging behind a guard: `if (shouldLog()) debugWarn(...)`.
      {
        code: `try { risky(); } catch (e) { if (shouldLog()) debugWarn("x", e); }`,
      },
      // Guarded logging with a block body.
      {
        code: `try { risky(); } catch (e) { if (shouldLog()) { debugWarn("x", e); } }`,
      },
      // Teardown then reject: the failure reaches a caller that can act.
      {
        code: `try { risky(); } catch (e) { cleanup(); reject(e); }`,
      },
      // Worker error channel (no console available in a worker).
      {
        code: `try { risky(); } catch (e) { _replyErr(e); }`,
      },
      // `rendererRuntime.js` spells it without the leading underscore.
      {
        code: `try { risky(); } catch (e) { replyErr(e); }`,
      },
      {
        code: `try { risky(); } catch (e) { postError(e); }`,
      },
      // Aborting an in-flight operation propagates the failure.
      {
        code: `try { risky(); } catch (e) { controller.abort(); }`,
      },
      // Empty catch is a different rule's concern.
      {
        code: `try { risky(); } catch (e) {}`,
      },
      // Explanatory comment opts out.
      {
        code: `try { risky(); } catch (e) { /* safe: best-effort */ let x = 1; }`,
      },
      {
        code: `try { risky(); } catch (e) { // safe to ignore\n  let x = 1; }`,
      },
    ],

    invalid: [
      // Swallows with a bare assignment that is not a fallback.
      {
        code: `try { risky(); } catch (e) { let x = 1; }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // Swallows with a no-op expression.
      {
        code: `try { risky(); } catch (e) { void 0; }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // `return;` with no value is not a recovery.
      {
        code: `function f() { try { risky(); } catch (e) { return; } }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // A non-logger call is still silent.
      {
        code: `try { risky(); } catch (e) { doSomething(e); }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // Assignment to a non-capture property is still silent.
      {
        code: `try { risky(); } catch (e) { state.value = 1; }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // A guard whose body does not log is still silent.
      {
        code: `try { risky(); } catch (e) { if (ok) { doThing(); } }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // A non-handler bare call is still silent.
      {
        code: `try { risky(); } catch (e) { cleanup(); }`,
        errors: [{ messageId: "silentCatch" }],
      },
      // A similarly-named call that is not the error channel is still silent.
      {
        code: `try { risky(); } catch (e) { reply(e); }`,
        errors: [{ messageId: "silentCatch" }],
      },
    ],
  });

});
