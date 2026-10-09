import { describe, it, expect } from "vitest";
import { slugify, slugifyHeading, slugifyTitle, MAX_SLUG_LENGTH } from "../src/utils/slugify.js";
import { slugify as managerSlugify } from "../src/slugManager.js";
import { slugifyHeading as workerSlugifyHeading } from "../src/worker/rendererRuntime.js";
import { slugifyTitle as workerSlugifyTitle } from "../src/worker/anchorRuntime.js";

/**
 * The slug contract is shared across the main thread and every worker. If
 * these drift, links generated in a worker resolve against maps that do not
 * contain them, which surfaces as a 404 rather than a test failure. These
 * tests pin the cross-context agreement explicitly.
 */
describe("utils/slugify canonical contract", () => {
  const cases = [
    "Hello World",
    "Some File.md",
    "Example.HTML",
    "readme-md",
    "index-html",
    "Probe Html",
    "  Padded  Title  ",
    "Ünïcodé Tïtle",
    "Multiple   Spaces",
    "Trailing dash -",
    "-Leading dash",
    "a--b---c",
    "",
  ];

  it("produces identical output on the main thread and in both workers", () => {
    for (const input of cases) {
      const canonical = slugify(input);
      expect(managerSlugify(input)).toBe(canonical);
      expect(workerSlugifyTitle(input)).toBe(canonical);
      // slugifyHeading falls back to "heading" for empty results only.
      expect(workerSlugifyHeading(input)).toBe(canonical || "heading");
    }
  });

  it("strips a trailing md/html token unconditionally", () => {
    expect(slugify("Some File.md")).toBe("some-file");
    expect(slugify("Example.HTML")).toBe("example");
    expect(slugify("readme-md")).toBe("readme");
    expect(slugify("index-html")).toBe("index");
  });

  it("preserves md/html when it is not the trailing token", () => {
    expect(slugify("md-notes")).toBe("md-notes");
    expect(slugify("html-and-css")).toBe("html-and-css");
  });

  it("normalizes case, separators and padding", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  Padded  Title  ")).toBe("padded-title");
    expect(slugify("Multiple   Spaces")).toBe("multiple-spaces");
    expect(slugify("a--b---c")).toBe("a-b-c");
    expect(slugify("Trailing dash -")).toBe("trailing-dash");
    expect(slugify("-Leading dash")).toBe("leading-dash");
  });

  it("folds diacritics to their ASCII base letters", () => {
    // NFKD decomposition plus combining-mark removal, so accented Latin
    // letters keep their base character instead of being dropped entirely.
    expect(slugify("Über café")).toBe("uber-cafe");
    expect(slugify("Ünïcodé Tïtle")).toBe("unicode-title");
    expect(slugify("naïve résumé")).toBe("naive-resume");
  });

  it("transliterates Cyrillic to Latin", () => {
    expect(slugify("Привет мир")).toBe("privet-mir");
    expect(slugify("Ярославль")).toBe("yaroslavl");
  });

  it("falls back to a stable hash for scripts with no Latin mapping", () => {
    // CJK, Arabic, and Greek have no compact transliteration table. Without a
    // fallback every such page collapses to the same empty slug and
    // navigation, search, and deep links all break.
    const cjk = slugify("日本語のページ");
    expect(cjk).toMatch(/^[a-z0-9]+$/);
    expect(cjk.length).toBeGreaterThan(0);
    // Stable: the same input always produces the same slug.
    expect(slugify("日本語のページ")).toBe(cjk);
    // Distinct: different titles do not collide.
    expect(slugify("中文标题")).not.toBe(cjk);
    expect(slugify("Ελληνικά")).not.toBe(cjk);
  });

  it("does not hash punctuation-only input", () => {
    // Punctuation carries no identity, so it must stay empty rather than
    // becoming a stable slug that looks meaningful.
    expect(slugify("!!!")).toBe("");
    expect(slugify("---")).toBe("");
    expect(slugify("   ")).toBe("");
  });

  it("drops punctuation and symbols", () => {
    expect(slugify("C++ / C# & F#!")).toBe("c-c-f");
  });

  it("caps length at MAX_SLUG_LENGTH without a trailing dash", () => {
    const long = "word ".repeat(60);
    const out = slugify(long);
    expect(out.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
    expect(out.endsWith("-")).toBe(false);
  });

  it("returns an empty string for empty-ish input", () => {
    expect(slugify("")).toBe("");
    expect(slugify(null)).toBe("");
    expect(slugify(undefined)).toBe("");
    expect(slugify("!!!")).toBe("");
  });

  it("slugifyHeading falls back to 'heading' when nothing survives", () => {
    expect(slugifyHeading("")).toBe("heading");
    expect(slugifyHeading("!!!")).toBe("heading");
    expect(slugifyHeading("Real Heading")).toBe("real-heading");
  });

  it("is memoized: repeated calls return the same value", () => {
    const a = slugify("Memoized Title");
    const b = slugify("Memoized Title");
    expect(a).toBe(b);
    expect(a).toBe("memoized-title");
  });
});
