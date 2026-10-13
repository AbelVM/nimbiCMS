import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as slugManager from "../src/slugManager.js";

/**
 * Markdown H2/H3 excerpt extraction previously copied the entire remainder of
 * the document once per heading (`raw.slice(re.lastIndex)`), making it O(n²)
 * in document length. It now uses a sticky regex that matches in place.
 *
 * These tests pin the *output*, because the whole point of the change is that
 * the excerpts are byte-identical to before — only the cost differs.
 */
describe("markdown excerpt extraction", () => {
  beforeEach(() => {
    slugManager.slugToMd.clear();
    slugManager.mdToSlug.clear();
    slugManager.clearFetchCache?.();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** Build a markdown document with `n` H2 sections. */
  function buildDoc(n) {
    let s = "# Title\n\nIntro paragraph.\n\n";
    for (let i = 0; i < n; i++) {
      s += `## Section ${i}\n\nBody text for section ${i}.\n\n`;
    }
    return s;
  }

  /**
   * Index a single markdown document.
   *
   * `buildSearchIndex` discovers pages by crawling, so the base URL must serve
   * a directory listing linking to the page, and the page itself must serve
   * the markdown. This mirrors the pattern used by the existing slugManager
   * suite.
   */
  async function indexMarkdown(md, depth = 2) {
    const base = "http://x.test/content/";
    slugManager.searchIndex.splice(0);
    slugManager.allMarkdownPaths.splice(0);
    slugManager.slugToMd.clear();
    slugManager.mdToSlug.clear();
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u === base)
        return {
          ok: true,
          status: 200,
          text: async () => '<a href="page.md"></a>',
        };
      if (u.endsWith("page.md"))
        return { ok: true, status: 200, text: async () => md };
      return { ok: false, status: 404, text: async () => "" };
    };
    return slugManager.buildSearchIndex(base, depth);
  }

  it("extracts the paragraph following each H2", async () => {
    const idx = await indexMarkdown(buildDoc(3));

    const h2s = idx.filter((e) => e.slug.includes("::"));
    expect(h2s.length).toBe(3);
    expect(h2s[0].excerpt).toBe("Body text for section 0.");
    expect(h2s[1].excerpt).toBe("Body text for section 1.");
    expect(h2s[2].excerpt).toBe("Body text for section 2.");
  });

  it("extracts the paragraph following each H3 at depth 3", async () => {
    const md =
      "# T\n\n## Parent\n\nParent body.\n\n### Child A\n\nChild A body.\n\n### Child B\n\nChild B body.\n";
    const idx = await indexMarkdown(md, 3);

    const h3s = idx.filter((e) => /child/.test(e.slug));
    expect(h3s.length).toBe(2);
    expect(h3s[0].excerpt).toBe("Child A body.");
    expect(h3s[1].excerpt).toBe("Child B body.");
  });

  it("captures a following heading when no paragraph intervenes", async () => {
    // Pre-existing behaviour, preserved verbatim by the sticky-regex change:
    // the paragraph pattern matches any non-empty line, so a heading that
    // immediately follows another heading is captured as its "excerpt".
    // Asserted here so a future change to the pattern is a deliberate
    // decision rather than an accident.
    const md = "# T\n\n## Lonely\n\n## Also Lonely\n\nBody here.\n";
    const idx = await indexMarkdown(md);

    const lonely = idx.find((e) => e.slug.includes("lonely"));
    expect(lonely.excerpt).toBe("## Also Lonely");

    const alsoLonely = idx.find((e) => e.slug.includes("also-lonely"));
    expect(alsoLonely.excerpt).toBe("Body here.");
  });

  it("handles a heading at the very end of the document", async () => {
    const md = "# T\n\nBody.\n\n## Trailing";
    const idx = await indexMarkdown(md);

    const trailing = idx.find((e) => e.slug.includes("trailing"));
    expect(trailing.excerpt).toBe("");
  });

  it("truncates long excerpts to 300 characters", async () => {
    const long = "x".repeat(500);
    const md = `# T\n\n## Long\n\n${long}\n`;
    const idx = await indexMarkdown(md);

    const entry = idx.find((e) => e.slug.includes("long"));
    expect(entry.excerpt.length).toBe(300);
  });

  it("joins multi-line paragraphs into a single line", async () => {
    const md = "# T\n\n## Multi\n\nLine one.\nLine two.\nLine three.\n";
    const idx = await indexMarkdown(md);

    const entry = idx.find((e) => e.slug.includes("multi"));
    expect(entry.excerpt).toBe("Line one. Line two. Line three.");
  });

  it("produces identical excerpts for a large document", async () => {
    // The regression this guards: a sticky-regex bug would silently change
    // which paragraph is captured once the document is long enough.
    const idx = await indexMarkdown(buildDoc(50));
    const h2s = idx.filter((e) => e.slug.includes("::"));

    expect(h2s.length).toBe(50);
    h2s.forEach((entry, i) => {
      expect(entry.excerpt).toBe(`Body text for section ${i}.`);
    });
  });

  it("skips blank lines between a heading and its paragraph", async () => {
    const md = "# T\n\n## Spaced\n\n\n\nActual body.\n";
    const idx = await indexMarkdown(md);

    const entry = idx.find((e) => e.slug.includes("spaced"));
    expect(entry.excerpt).toBe("Actual body.");
  });
});
