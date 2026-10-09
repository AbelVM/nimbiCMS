import { describe, it, expect } from "vitest";
import { stripContentBasePrefix } from "../src/utils/stripContentBasePrefix.js";
import { decodeHtmlEntities } from "../src/utils/decodeHtmlEntities.js";
import { decodeHtmlEntities as fromHelpers } from "../src/utils/helpers.js";
import { decodeHtmlEntitiesLocal as fromWorker } from "../src/worker/renderer.js";

describe("utils/stripContentBasePrefix", () => {
  it("strips a leading content-base segment", () => {
    expect(stripContentBasePrefix("content/a.md", "content")).toBe("a.md");
    expect(stripContentBasePrefix("/content/a.md", "/content/")).toBe("a.md");
  });

  it("collapses repeated base segments", () => {
    expect(stripContentBasePrefix("content/content/a.md", "content")).toBe(
      "a.md",
    );
  });

  it("returns an empty string when the path is exactly the base", () => {
    expect(stripContentBasePrefix("content", "content")).toBe("");
    expect(stripContentBasePrefix("/content/", "/content/")).toBe("");
  });

  it("leaves unrelated paths untouched", () => {
    expect(stripContentBasePrefix("other/a.md", "content")).toBe("other/a.md");
  });

  it("passes through falsy input and empty bases", () => {
    expect(stripContentBasePrefix("", "content")).toBe("");
    expect(stripContentBasePrefix(null, "content")).toBe(null);
    expect(stripContentBasePrefix("a.md", "")).toBe("a.md");
    expect(stripContentBasePrefix("a.md", "/")).toBe("a.md");
  });
});

describe("utils/decodeHtmlEntities contract", () => {
  const cases = [
    "&amp;",
    "&lt;div&gt;",
    "&quot;q&quot;",
    "&apos;a&apos;",
    "a&nbsp;b",
    "&#65;",
    "&#x41;",
    "&#x1F600;",
    "&unknown;",
    "",
    "plain text",
    "&&amp;;",
  ];

  it("agrees across the main thread, helpers, and the worker", () => {
    for (const input of cases) {
      const canonical = decodeHtmlEntities(input);
      expect(fromHelpers(input)).toBe(canonical);
      expect(fromWorker(input)).toBe(canonical);
    }
  });

  it("decodes named entities", () => {
    expect(decodeHtmlEntities("&amp;")).toBe("&");
    expect(decodeHtmlEntities("&lt;div&gt;")).toBe("<div>");
    expect(decodeHtmlEntities("&quot;q&quot;")).toBe('"q"');
    expect(decodeHtmlEntities("&apos;a&apos;")).toBe("'a'");
    expect(decodeHtmlEntities("a&nbsp;b")).toBe("a b");
  });

  it("decodes decimal and hex numeric references", () => {
    expect(decodeHtmlEntities("&#65;")).toBe("A");
    expect(decodeHtmlEntities("&#x41;")).toBe("A");
    expect(decodeHtmlEntities("&#x1F600;")).toBe("\u{1F600}");
  });

  it("leaves unknown entities intact", () => {
    expect(decodeHtmlEntities("&unknown;")).toBe("&unknown;");
    expect(decodeHtmlEntities("&notanentity")).toBe("&notanentity");
  });

  it("handles empty and falsy input", () => {
    expect(decodeHtmlEntities("")).toBe("");
    expect(decodeHtmlEntities(null)).toBe("");
    expect(decodeHtmlEntities(undefined)).toBe("");
    expect(decodeHtmlEntities(0)).toBe("0");
  });

  it("is memoized across calls", () => {
    expect(decodeHtmlEntities("&amp;")).toBe(decodeHtmlEntities("&amp;"));
  });
});
