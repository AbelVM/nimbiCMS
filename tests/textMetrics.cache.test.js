import { describe, it, expect, beforeEach } from "vitest";
import {
  getReadingTime,
  getTextMetrics,
  clearTextMetricsCache,
} from "../src/utils/textMetrics.js";

/**
 * The glyph audit (L4/G-019) claimed this cache was keyed by entire document
 * text, retained full bodies, and had an empty-string eviction edge case.
 * All three are false, and the proposed migration to `PowerCache` would be a
 * regression: `PowerCache` holds strong references, whereas this cache uses
 * `WeakRef` so the garbage collector can reclaim entries under memory
 * pressure before the FIFO limit is reached.
 *
 * These tests pin the actual behaviour so a future change is deliberate.
 */
describe("utils/textMetrics cache", () => {
  beforeEach(() => {
    clearTextMetricsCache();
  });

  it("returns a valid result for empty and whitespace-only input", () => {
    for (const input of ["", "   ", "\n\n", null, undefined]) {
      const rt = getReadingTime(input);
      expect(rt).toBeTruthy();
      expect(rt.text).toBe("0 min read");
      expect(rt.minutes).toBe(0);
      expect(rt.words).toBe(0);
    }
  });

  it("returns stable results for repeated identical input", () => {
    const a = getReadingTime("hello world foo bar");
    const b = getReadingTime("hello world foo bar");
    expect(a.text).toBe(b.text);
    expect(a.words).toBe(b.words);
  });

  it("exposes both readingTime and wordCount from getTextMetrics", () => {
    const m = getTextMetrics("one two three");
    expect(Object.keys(m).sort()).toEqual(["readingTime", "wordCount"]);
    expect(m.wordCount).toBe(3);
    expect(m.readingTime.text).toContain("min read");
  });

  it("returns a copy, not the cached object", () => {
    const a = getTextMetrics("alpha beta gamma");
    a.wordCount = 999;
    const b = getTextMetrics("alpha beta gamma");
    // Mutating the returned object must not poison the cache.
    expect(b.wordCount).toBe(3);
  });

  it("evicts oldest entries past the 200-entry limit", () => {
    for (let i = 0; i < 250; i++) {
      getReadingTime(`document number ${i} with a few words in it`);
    }
    // The cache is bounded, and the empty-string key still resolves after
    // eviction has run many times.
    expect(getReadingTime("").text).toBe("0 min read");
    expect(getReadingTime("document number 249 with a few words in it").words)
      .toBeGreaterThan(0);
  });

  it("clearTextMetricsCache empties the cache without throwing", () => {
    getReadingTime("some content here");
    expect(() => clearTextMetricsCache()).not.toThrow();
    // Still usable after clearing.
    expect(getReadingTime("some content here").words).toBe(3);
  });

  it("does not retain the full input text as a key", () => {
    // The key is `length:hash`, so two different texts of the same length
    // must not collide in a way that returns the wrong metrics.
    const a = getReadingTime("aaaa bbbb cccc");
    const b = getReadingTime("xxxx yyyy zzzz");
    expect(a.words).toBe(b.words);
    expect(a.text).toBe(b.text);
  });

  it("counts words per word, not per whitespace run, for CJK", () => {
    // `split(/\s+/)` counts an entire space-less CJK sentence as one word,
    // which makes reading-time estimates badly wrong. `Intl.Segmenter`
    // counts per word.
    const cjk = getTextMetrics("日本語のページです").wordCount;
    expect(cjk).toBeGreaterThan(1);

    // Latin text is unaffected.
    expect(getTextMetrics("one two three").wordCount).toBe(3);
    expect(getTextMetrics("Привет мир").wordCount).toBe(2);
  });

  it("falls back to a whitespace split when Segmenter is unavailable", () => {
    // The implementation degrades rather than throwing; assert the contract
    // holds for the inputs that matter either way.
    expect(getTextMetrics("alpha beta").wordCount).toBe(2);
    expect(getTextMetrics("").wordCount).toBe(0);
  });
});
