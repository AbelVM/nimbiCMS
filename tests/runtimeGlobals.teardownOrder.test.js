import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { initCMS, destroy } from "../src/init.js";
import { getGlobal, MANAGED_GLOBALS } from "../src/utils/runtimeGlobals.js";

/**
 * `destroy()` must leave no managed debug global populated.
 *
 * Two ordering bugs were found here during review:
 *   1. `setRecoveryState("idle")` ran *after* `clearAllGlobals()`,
 *      repopulating `__nimbiRecoveryState`.
 *   2. `releaseGeneration()` ran at the *end* of teardown, after the clear,
 *      leaving a window where the globals were null but the generation was
 *      still live — so an in-flight async write could repopulate them.
 *   3. A late write landing during the async worker teardown still got
 *      through, because the permissive guard variant deliberately allows
 *      host-driven calls that never claimed a generation.
 *
 * The fix releases the generation first and sweeps the globals again after
 * the async teardown completes.
 */
describe("destroy() leaves no managed global populated", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      text: async () => "# Title\n\nBody",
    });
  });

  afterEach(async () => {
    await destroy();
  });

  it("clears every writable managed global", async () => {
    await initCMS({ el: "#app", searchIndex: false });
    await destroy();

    // `__nimbiSearchIndex` and `__nimbiIndexReady` are installed by
    // `slugManager` as getter-only live views over module state. They cannot
    // be assigned or nulled and hold no retained data of their own, so they
    // are excluded — see task M1c.
    const LIVE_VIEWS = new Set(["__nimbiSearchIndex", "__nimbiIndexReady"]);
    const leaked = MANAGED_GLOBALS.filter(
      (key) => !LIVE_VIEWS.has(key) && getGlobal(key) !== null,
    );

    expect(leaked).toEqual([]);
  });

  it("is idempotent across repeated init/destroy cycles", async () => {
    const LIVE_VIEWS = new Set(["__nimbiSearchIndex", "__nimbiIndexReady"]);

    for (let i = 0; i < 3; i++) {
      document.body.innerHTML = '<div id="app"></div>';
      await initCMS({ el: "#app", searchIndex: false });
      await destroy();

      const leaked = MANAGED_GLOBALS.filter(
        (key) => !LIVE_VIEWS.has(key) && getGlobal(key) !== null,
      );
      expect(leaked).toEqual([]);
    }
  });

  it("does not repopulate __nimbiRecoveryState after teardown", async () => {
    await initCMS({ el: "#app", searchIndex: false });
    await destroy();
    // Writing an "idle" state after the clear would defeat the clear.
    expect(getGlobal("__nimbiRecoveryState")).toBe(null);
  });
});
