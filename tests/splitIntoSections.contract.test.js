import { describe, it, expect } from "vitest";
import { splitIntoSections } from "../src/utils/splitIntoSections.js";
import { _splitIntoSections as fromMarkdown } from "../src/markdown.js";
import { _splitIntoSections as fromRenderer } from "../src/worker/renderer.js";

/**
 * The main-thread renderer and the renderer worker must agree on chunk
 * boundaries. If they diverge, streamed output differs from non-streamed
 * output for the same document, which is very hard to debug from the outside.
 */
describe("utils/splitIntoSections contract", () => {
  const docs = [
    "",
    "no headings at all, just prose",
    "# Only One Heading\n\nbody",
    "# A\n\nbody a\n\n## B\n\nbody b\n\n### C\n\nbody c",
    "intro before heading\n\n# A\n\nbody\n\n# B\n\nbody",
    "# A\n\n" + "x".repeat(200),
    "# A\n\nshort\n\n## B\n\nshort\n\n## C\n\nshort",
    "###### Deep\n\ntext\n\n# Shallow\n\ntext",
    "#NotAHeading\n\ntext",
    "# A\n\nbody\n\n#\n\nbody\n\n# B\n\nbody",
  ];

  it("produces identical boundaries on the main thread and in the worker", () => {
    for (const doc of docs) {
      for (const size of [10, 40, 64, 1024]) {
        const canonical = splitIntoSections(doc, size);
        expect(fromMarkdown(doc, size)).toEqual(canonical);
        expect(fromRenderer(doc, size)).toEqual(canonical);
      }
    }
  });

  it("returns a single section when the document fits the chunk size", () => {
    expect(splitIntoSections("short", 100)).toEqual(["short"]);
    expect(splitIntoSections("", 100)).toEqual([""]);
  });

  it("falls back to fixed-size slices with fewer than two headings", () => {
    const out = splitIntoSections("y".repeat(25), 10);
    expect(out).toEqual(["yyyyyyyyyy", "yyyyyyyyyy", "yyyyy"]);
  });

  it("keeps the leading intro as its own section", () => {
    // Chunk size must be below the document length, otherwise the
    // whole-document fast path returns a single section.
    const out = splitIntoSections("intro\n\n# A\n\nbody\n\n# B\n\nbody", 12);
    expect(out[0]).toBe("intro\n\n");
    expect(out.join("")).toBe("intro\n\n# A\n\nbody\n\n# B\n\nbody");
  });

  it("never emits an empty section for non-empty input", () => {
    for (const doc of docs) {
      if (!doc) continue; // empty input short-circuits to [""]
      for (const section of splitIntoSections(doc, 20)) {
        expect(section.length).toBeGreaterThan(0);
      }
    }
  });

  it("short-circuits empty input to a single empty section", () => {
    expect(splitIntoSections("", 20)).toEqual([""]);
  });

  it("reassembles to the original document", () => {
    for (const doc of docs) {
      expect(splitIntoSections(doc, 20).join("")).toBe(doc);
      expect(splitIntoSections(doc, 1000).join("")).toBe(doc);
    }
  });

  it("merges short neighbouring sections up to the chunk budget", () => {
    const out = splitIntoSections("# A\n\ns\n\n## B\n\ns\n\n## C\n\ns", 1000);
    // All three sections are far below the budget, so they collapse into one.
    expect(out).toHaveLength(1);
  });

  it("does not split on headings without a following space", () => {
    const out = splitIntoSections("#NotAHeading\n\ntext", 5);
    expect(out.join("")).toBe("#NotAHeading\n\ntext");
  });
});
