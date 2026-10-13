import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  claimGeneration,
  releaseGeneration,
  activeGeneration,
  setIfLive,
  setIfCurrent,
  isGenerationLive,
  getGlobal,
  clearGlobal,
  clearAllGlobals,
} from "../src/utils/runtimeGlobals.js";

/**
 * End-to-end check that the guard actually prevents the failure mode it was
 * built for: a runtime torn down while async work is still in flight.
 *
 * The unit tests in `runtimeGlobals.test.js` cover the primitives; this suite
 * models the real sequence of events.
 */
describe("runtimeGlobals teardown race", () => {
  const KEYS = [
    "__nimbiProbeIndex",
    "__nimbiProbeTimings",
    "__nimbiProbeSitemap",
  ];

  beforeEach(() => {
    releaseGeneration();
    clearAllGlobals();
    for (const k of KEYS) delete window[k];
  });

  afterEach(() => {
    releaseGeneration();
    clearAllGlobals();
    for (const k of KEYS) delete window[k];
  });

  it("drops every in-flight write once the runtime is released", async () => {
    const gen = claimGeneration();

    // Three async tasks that all resolve after teardown, mimicking an index
    // build, a render timing push, and a debounced sitemap write.
    const tasks = [
      new Promise((r) =>
        setTimeout(() => r(setIfLive(gen, KEYS[0], ["stale"])), 5),
      ),
      new Promise((r) =>
        setTimeout(() => r(setIfLive(gen, KEYS[1], [123])), 10),
      ),
      new Promise((r) =>
        setTimeout(() => r(setIfLive(gen, KEYS[2], { entries: [] })), 15),
      ),
    ];

    releaseGeneration(); // destroy() happens first
    const results = await Promise.all(tasks);

    expect(results).toEqual([false, false, false]);
    for (const k of KEYS) {
      expect(getGlobal(k, "absent")).toBe("absent");
    }
  });

  it("lets the same writes through when the runtime is still live", async () => {
    const gen = claimGeneration();

    const results = await Promise.all([
      new Promise((r) =>
        setTimeout(() => r(setIfLive(gen, KEYS[0], ["fresh"])), 5),
      ),
      new Promise((r) =>
        setTimeout(() => r(setIfLive(gen, KEYS[1], [123])), 10),
      ),
    ]);

    expect(results).toEqual([true, true]);
    expect(getGlobal(KEYS[0])).toEqual(["fresh"]);
    expect(getGlobal(KEYS[1])).toEqual([123]);
  });

  it("a new runtime is not polluted by the previous one's late writes", async () => {
    const first = claimGeneration();
    const lateWrite = new Promise((r) =>
      setTimeout(() => r(setIfLive(first, KEYS[0], "from-first")), 10),
    );

    releaseGeneration();
    const second = claimGeneration(); // re-init
    setIfLive(second, KEYS[0], "from-second");

    await lateWrite;

    // The late write from the first runtime must not overwrite the second.
    expect(getGlobal(KEYS[0])).toBe("from-second");
  });

  it("clearAllGlobals leaves nothing for the next runtime to inherit", () => {
    const gen = claimGeneration();
    // Use managed keys here: `clearAllGlobals` only nulls those, so probe
    // keys would survive and make this assertion meaningless.
    const managed = ["__nimbiSitemapJson", "__nimbiSitemapFinal"];
    for (const k of managed) setIfLive(gen, k, "value");
    for (const k of managed) expect(getGlobal(k)).toBe("value");

    clearAllGlobals();
    releaseGeneration();

    const next = claimGeneration();
    // `clearGlobal` assigns null rather than deleting, so the fallback does
    // not apply; null is the "cleared" state the rest of the code reads.
    for (const k of managed) expect(getGlobal(k)).toBe(null);
    expect(next).not.toBe(gen);
  });

  it("the strict guard still rejects a null generation", () => {
    // `setIfCurrent` is for initCMS-owned writes, which always have a
    // generation. Host-driven paths must use `setIfLive` instead.
    expect(setIfCurrent(null, KEYS[0], "x")).toBe(false);
    expect(setIfLive(null, KEYS[0], "x")).toBe(true);
    expect(getGlobal(KEYS[0])).toBe("x");
  });

  it("activeGeneration tracks claim and release", () => {
    expect(activeGeneration()).toBe(null);
    const gen = claimGeneration();
    expect(activeGeneration()).toBe(gen);
    expect(isGenerationLive(gen)).toBe(true);
    releaseGeneration();
    expect(activeGeneration()).toBe(null);
    expect(isGenerationLive(gen)).toBe(false);
  });
});
