import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  yieldToEventLoop,
  yieldIfNeeded,
  createYieldGate,
} from "../src/utils/idle.js";

describe("utils/idle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("yieldToEventLoop", () => {
    it("prefers scheduler.yield when available", async () => {
      const yieldSpy = vi.fn(() => Promise.resolve());
      globalThis.scheduler = { yield: yieldSpy };

      await yieldToEventLoop();

      expect(yieldSpy).toHaveBeenCalled();
      delete globalThis.scheduler;
    });

    it("falls back to requestIdleCallback", async () => {
      delete globalThis.scheduler;
      const ric = vi.fn((cb) => cb());
      globalThis.requestIdleCallback = ric;

      await yieldToEventLoop();

      expect(ric).toHaveBeenCalled();
      delete globalThis.requestIdleCallback;
    });

    it("falls back to setTimeout when nothing else exists", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;

      const p = yieldToEventLoop();
      vi.runAllTimers();
      await expect(p).resolves.toBeUndefined();
    });
  });

  describe("yieldIfNeeded (count-based, legacy)", () => {
    it("yields on the threshold iteration", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;
      const spy = vi.spyOn(globalThis, "setTimeout");

      const p = yieldIfNeeded(50, 50);
      vi.runAllTimers();
      await p;

      expect(spy).toHaveBeenCalled();
    });

    it("does not yield off-threshold", async () => {
      const spy = vi.spyOn(globalThis, "setTimeout");
      await yieldIfNeeded(49, 50);
      expect(spy).not.toHaveBeenCalled();
    });

    it("ignores falsy arguments", async () => {
      await expect(yieldIfNeeded(0, 50)).resolves.toBeUndefined();
      await expect(yieldIfNeeded(10, 0)).resolves.toBeUndefined();
    });
  });

  describe("createYieldGate (time-based)", () => {
    it("does not yield before the budget elapses", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;
      const spy = vi.spyOn(globalThis, "setTimeout");

      const gate = createYieldGate(16);
      // Several rapid iterations within the budget must not yield.
      for (let i = 0; i < 10; i++) await gate();

      expect(spy).not.toHaveBeenCalled();
    });

    it("yields once the budget has elapsed", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;
      const spy = vi.spyOn(globalThis, "setTimeout");

      const gate = createYieldGate(16);
      // Advance past the budget, then call again.
      vi.advanceTimersByTime(20);
      const p = gate();
      vi.runAllTimers();
      await p;

      expect(spy).toHaveBeenCalled();
    });

    it("resets the budget after yielding", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;
      const spy = vi.spyOn(globalThis, "setTimeout");

      const gate = createYieldGate(16);
      vi.advanceTimersByTime(20);
      const first = gate();
      vi.runAllTimers();
      await first;
      expect(spy).toHaveBeenCalledTimes(1);

      // Immediately after a yield the budget is fresh, so no second yield.
      await gate();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("falls back to 16ms for an invalid budget", async () => {
      delete globalThis.scheduler;
      delete globalThis.requestIdleCallback;
      const spy = vi.spyOn(globalThis, "setTimeout");

      const gate = createYieldGate(-5);
      vi.advanceTimersByTime(20);
      const p = gate();
      vi.runAllTimers();
      await p;

      expect(spy).toHaveBeenCalled();
    });

    it("uses scheduler.yield when available", async () => {
      const yieldSpy = vi.fn(() => Promise.resolve());
      globalThis.scheduler = { yield: yieldSpy };

      const gate = createYieldGate(16);
      // Advance past the budget so the gate actually yields.
      vi.advanceTimersByTime(20);
      await gate();

      expect(yieldSpy).toHaveBeenCalled();
      delete globalThis.scheduler;
    });
  });
});
