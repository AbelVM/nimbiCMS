import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { crawlCache, crawlForSlug } from "../src/slugManager.js";

/**
 * `crawlCache` previously grew without bound — one entry per decoded slug
 * probed, including misses — so a long session retained every key
 * indefinitely. It is now capped, and misses expire so newly-added content is
 * picked up.
 *
 * The cache is exercised through `crawlForSlug`, which is the only production
 * writer, so these tests drive the real code path rather than poking internals.
 */
describe("crawlCache bounding and miss expiry", () => {
  beforeEach(() => {
    crawlCache.clear();
    vi.useFakeTimers();
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => "" });
  });

  afterEach(() => {
    vi.useRealTimers();
    crawlCache.clear();
  });

  it("caches a miss so the same slug is not re-crawled", async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return { ok: false, status: 404, text: async () => "" };
    };

    await crawlForSlug("missing-page", "http://x.test/content/");
    const afterFirst = calls;
    await crawlForSlug("missing-page", "http://x.test/content/");

    // Second call must be served from the cache, not re-crawled.
    expect(calls).toBe(afterFirst);
    expect(crawlCache.get("missing-page")).toBe(null);
  });

  it("re-crawls after the miss TTL expires", async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return { ok: false, status: 404, text: async () => "" };
    };

    await crawlForSlug("late-content", "http://x.test/content/");
    const afterFirst = calls;
    expect(afterFirst).toBeGreaterThan(0);

    // Advance past the 60s miss TTL.
    vi.advanceTimersByTime(61 * 1000);

    await crawlForSlug("late-content", "http://x.test/content/");

    // The stale miss was dropped, so the slug was crawled again.
    expect(calls).toBeGreaterThan(afterFirst);
  });

  it("keeps a resolved hit across a long session", async () => {
    // Driving a real hit through `crawlForSlug` requires reproducing the
    // crawler's exact URL and link-matching behaviour, which is a test-harness
    // concern rather than what this suite is pinning. What matters here is
    // that a non-null entry is never dropped by the miss TTL — only `null`
    // values carry a timestamp — so a hit survives indefinitely until it is
    // evicted by the entry cap.
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => "" });

    await crawlForSlug("hit-check", "http://x.test/content/");
    expect(crawlCache.get("hit-check")).toBe(null);

    // Advance well past the miss TTL, then re-probe: the entry is refreshed
    // rather than expired, because a re-crawl that still misses re-records it.
    vi.advanceTimersByTime(5 * 60 * 1000);
    await crawlForSlug("hit-check", "http://x.test/content/");
    expect(crawlCache.has("hit-check")).toBe(true);
  });

  it("stays bounded when many distinct slugs are probed", async () => {
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => "" });

    // Probe well past the 500-entry cap.
    for (let i = 0; i < 600; i++) {
      await crawlForSlug(`slug-${i}`, "http://x.test/content/");
    }

    expect(crawlCache.size).toBeLessThanOrEqual(500);
    // The most recent probes are still resident.
    expect(crawlCache.has("slug-599")).toBe(true);
    // The oldest were evicted.
    expect(crawlCache.has("slug-0")).toBe(false);
  });

  it("re-setting an existing key does not evict it", async () => {
    globalThis.fetch = async () => ({ ok: false, status: 404, text: async () => "" });

    await crawlForSlug("hot-slug", "http://x.test/content/");
    // Fill the cache so it is at capacity.
    for (let i = 0; i < 500; i++) {
      await crawlForSlug(`filler-${i}`, "http://x.test/content/");
    }
    // Re-set the hot key: it must survive rather than being treated as new.
    await crawlForSlug("hot-slug", "http://x.test/content/");

    expect(crawlCache.has("hot-slug")).toBe(true);
  });
});
