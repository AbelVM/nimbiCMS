import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  claimGeneration,
  releaseGeneration,
  activeGeneration,
  isCurrentGeneration,
  isGenerationLive,
  setIfCurrent,
  setIfLive,
  getGlobal,
  clearGlobal,
  clearAllGlobals,
  MANAGED_GLOBALS,
} from "../src/utils/runtimeGlobals.js";

/**
 * A promise that resolves after `destroy()` must not repopulate the
 * `window.__nimbi*` debug globals. These tests pin that guarantee.
 */
describe("utils/runtimeGlobals generation guard", () => {
  // `clearAllGlobals` only nulls the managed keys, so the unmanaged probe
  // key used below must be deleted explicitly to keep tests isolated.
  const PROBE = "__nimbiUnmanagedProbe";

  beforeEach(() => {
    releaseGeneration();
    clearAllGlobals();
    delete window[PROBE];
  });

  afterEach(() => {
    releaseGeneration();
    clearAllGlobals();
    delete window[PROBE];
  });

  it("claims monotonically increasing generations", () => {
    const a = claimGeneration();
    const b = claimGeneration();
    expect(b).toBeGreaterThan(a);
    expect(activeGeneration()).toBe(b);
  });

  it("writes while the generation is live", () => {
    const gen = claimGeneration();
    expect(setIfCurrent(gen, PROBE, 42)).toBe(true);
    expect(getGlobal(PROBE)).toBe(42);
  });

  it("drops writes from a released generation", () => {
    const gen = claimGeneration();
    releaseGeneration();
    expect(setIfCurrent(gen, PROBE, 42)).toBe(false);
    // The key was never written, so it is absent entirely.
    expect(getGlobal(PROBE, "absent")).toBe("absent");
  });

  it("drops writes from a superseded generation", () => {
    const stale = claimGeneration();
    const fresh = claimGeneration();

    expect(setIfCurrent(stale, PROBE, "stale")).toBe(false);
    expect(setIfCurrent(fresh, PROBE, "fresh")).toBe(true);
    expect(getGlobal(PROBE)).toBe("fresh");
  });

  it("models the real failure: a late promise after destroy()", async () => {
    const gen = claimGeneration();

    // Simulate an in-flight index build that resolves after teardown.
    const lateWrite = new Promise((resolve) => {
      setTimeout(() => {
        resolve(setIfCurrent(gen, "__nimbiResolvedIndex", [{ slug: "late" }]));
      }, 0);
    });

    releaseGeneration(); // destroy() runs first
    const wrote = await lateWrite;

    expect(wrote).toBe(false);
    // destroy() nulled the key; the late write did not repopulate it.
    expect(getGlobal("__nimbiResolvedIndex")).toBe(null);
  });

  it("reports generation liveness correctly", () => {
    const gen = claimGeneration();
    expect(isCurrentGeneration(gen)).toBe(true);
    expect(isCurrentGeneration(gen + 1)).toBe(false);
    expect(isCurrentGeneration(null)).toBe(false);
    releaseGeneration();
    expect(isCurrentGeneration(gen)).toBe(false);
  });

  it("clears every stored global", () => {
    const gen = claimGeneration();
    for (const key of MANAGED_GLOBALS) {
      setIfCurrent(gen, key, "value");
    }
    // `__nimbiSearchIndex` and `__nimbiIndexReady` are installed by
    // `slugManager` as getter-only live views over module state, so they
    // cannot be assigned and are excluded here. They are covered separately.
    const LIVE_VIEWS = new Set(["__nimbiSearchIndex", "__nimbiIndexReady"]);
    const stored = MANAGED_GLOBALS.filter((key) => !LIVE_VIEWS.has(key));
    const written = stored.filter((key) => getGlobal(key) === "value");
    expect(written.length).toBeGreaterThan(0);

    clearAllGlobals();

    for (const key of written) {
      expect(getGlobal(key)).toBe(null);
    }
  });

  it("leaves getter-only live views readable rather than throwing", () => {
    const gen = claimGeneration();
    // These are defined with a getter and no setter, so assignment fails
    // silently in sloppy mode. The guard must not turn that into a crash.
    expect(() =>
      setIfCurrent(gen, "__nimbiSearchIndex", "value"),
    ).not.toThrow();
    expect(() => clearGlobal("__nimbiSearchIndex")).not.toThrow();
    // Still readable as the live view it always was.
    expect(Array.isArray(getGlobal("__nimbiSearchIndex"))).toBe(true);
  });

  it("clears array-valued globals too", () => {
    const gen = claimGeneration();
    setIfCurrent(gen, "__nimbiRenderingErrors__", [{ message: "boom" }]);
    expect(Array.isArray(getGlobal("__nimbiRenderingErrors__"))).toBe(true);

    clearAllGlobals();

    expect(getGlobal("__nimbiRenderingErrors__")).toBe(null);
  });

  it("clearGlobal is safe when no runtime is live", () => {
    expect(() => clearGlobal("__nimbiAnything")).not.toThrow();
  });

  it("getGlobal returns the fallback for missing keys", () => {
    expect(getGlobal("__nimbiNeverSet", "fallback")).toBe("fallback");
    expect(getGlobal("__nimbiNeverSet")).toBe(null);
  });

  it("MANAGED_GLOBALS is frozen and non-empty", () => {
    expect(Object.isFrozen(MANAGED_GLOBALS)).toBe(true);
    expect(MANAGED_GLOBALS.length).toBeGreaterThan(10);
    expect(MANAGED_GLOBALS).toContain("__nimbiResolvedIndex");
    expect(MANAGED_GLOBALS).toContain("__nimbiRuntimeManifest");
  });
});

describe("utils/runtimeGlobals permissive guard", () => {
  beforeEach(() => {
    releaseGeneration();
    clearAllGlobals();
  });

  afterEach(() => {
    releaseGeneration();
    clearAllGlobals();
  });

  it("treats a null generation as live so host-driven callers work", () => {
    // Sitemap/feed generators are invoked directly by hosts and tests with
    // no `initCMS` runtime, so there is no generation to invalidate against.
    expect(isGenerationLive(null)).toBe(true);
    expect(setIfLive(null, "__nimbiProbeLive", "ok")).toBe(true);
    expect(getGlobal("__nimbiProbeLive")).toBe("ok");
    clearGlobal("__nimbiProbeLive");
  });

  it("treats a null generation as dead under the strict guard", () => {
    expect(isCurrentGeneration(null)).toBe(false);
    expect(setIfCurrent(null, "__nimbiProbeStrict", "ok")).toBe(false);
    expect(getGlobal("__nimbiProbeStrict", "absent")).toBe("absent");
  });

  it("still blocks a superseded generation", () => {
    const stale = claimGeneration();
    claimGeneration();

    expect(isGenerationLive(stale)).toBe(false);
    expect(setIfLive(stale, "__nimbiProbeStale", "ok")).toBe(false);
    expect(getGlobal("__nimbiProbeStale", "absent")).toBe("absent");
  });

  it("allows the live generation", () => {
    const gen = claimGeneration();
    expect(isGenerationLive(gen)).toBe(true);
    expect(setIfLive(gen, "__nimbiProbeCurrent", "ok")).toBe(true);
    expect(getGlobal("__nimbiProbeCurrent")).toBe("ok");
    clearGlobal("__nimbiProbeCurrent");
  });

  it("allows writes when no runtime has ever been claimed", () => {
    // Mirrors the sitemap test environment: nothing claimed a generation.
    const gen = activeGeneration();
    expect(gen).toBe(null);
    expect(setIfLive(gen, "__nimbiProbeNoRuntime", "ok")).toBe(true);
    expect(getGlobal("__nimbiProbeNoRuntime")).toBe("ok");
    clearGlobal("__nimbiProbeNoRuntime");
  });
});
