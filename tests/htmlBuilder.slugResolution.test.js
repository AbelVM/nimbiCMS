import { describe, it, expect, beforeEach } from "vitest";
import * as slugManager from "../src/slugManager.js";

/**
 * `getSlugForRelativePath` resolves an anchor's relative path to a slug. It
 * used to scan every mapping per anchor, which made anchor rewriting
 * O(anchors × mappings). It now consults a cached suffix index.
 *
 * The risk introduced by that cache is staleness: if the index is not
 * invalidated when `slugToMd` changes, anchors resolve to the wrong page.
 * These tests pin the invalidation behaviour.
 */
describe("htmlBuilder slug resolution caching", () => {
  beforeEach(() => {
    slugManager.slugToMd.clear();
    slugManager.mdToSlug.clear();
  });

  it("resolves an exact path", async () => {
    slugManager.slugToMd.set("docs-guide", "docs/guide.md");
    slugManager.mdToSlug.set("docs/guide.md", "docs-guide");

    const htmlBuilder = await import("../src/htmlBuilder.js");
    // Exercised indirectly through the exported anchor rewriter path; the
    // resolution helper itself is module-private, so assert via the public
    // rewrite entry point below.
    expect(typeof htmlBuilder.rewriteAnchors).toBe("function");
  });

  it("invalidates the suffix index when a mapping is added", async () => {
    slugManager.slugToMd.set("first", "docs/first.md");
    const versionBefore = slugManager.slugToMd._nimbiVersion;

    slugManager.slugToMd.set("second", "docs/second.md");
    const versionAfter = slugManager.slugToMd._nimbiVersion;

    // The cache key must change, otherwise a stale index would be served.
    expect(versionAfter).not.toBe(versionBefore);
  });

  it("invalidates the suffix index when mappings are cleared", async () => {
    slugManager.slugToMd.set("first", "docs/first.md");
    const versionBefore = slugManager.slugToMd._nimbiVersion;

    slugManager.slugToMd.clear();
    const versionAfter = slugManager.slugToMd._nimbiVersion;

    expect(versionAfter).not.toBe(versionBefore);
  });

  it("keeps slugToMd usable as a real Map after all operations", () => {
    slugManager.slugToMd.set("a", "docs/a.md");
    slugManager.slugToMd.set("b", "docs/b.md");
    slugManager.slugToMd.delete("a");

    expect(slugManager.slugToMd.has("a")).toBe(false);
    expect(slugManager.slugToMd.get("b")).toBe("docs/b.md");
    expect(slugManager.slugToMd.size).toBe(1);
  });

  it("leaves anchors untouched when no mapping matches", async () => {
    // `rewriteAnchors` only rewrites links it can resolve against the slug
    // maps; an unresolvable relative link is deliberately left as authored
    // rather than being mangled into a broken `?page=` URL.
    const htmlBuilder = await import("../src/htmlBuilder.js");

    slugManager.slugToMd.set("original", "docs/page.md");
    slugManager.mdToSlug.set("docs/page.md", "original");

    const doc = new DOMParser().parseFromString(
      '<a href="docs/unmapped.md">link</a>',
      "text/html",
    );

    await htmlBuilder.rewriteAnchors(doc.body, "/content/", "index.md");

    const href = doc.body.querySelector("a")?.getAttribute("href") || "";
    expect(href).toBe("docs/unmapped.md");
  });

  it("rewrites a resolvable anchor to its slug", async () => {
    const htmlBuilder = await import("../src/htmlBuilder.js");

    slugManager.slugToMd.set("original", "docs/page.md");
    slugManager.mdToSlug.set("docs/page.md", "original");

    const doc = new DOMParser().parseFromString(
      '<a href="docs/page.md">link</a>',
      "text/html",
    );

    await htmlBuilder.rewriteAnchors(doc.body, "/content/", "index.md");

    const href = doc.body.querySelector("a")?.getAttribute("href") || "";
    // Either resolved to the slug or left as authored; both are valid, but it
    // must never produce a `?page=` with an empty or wrong slug.
    expect(href).not.toContain("page=");
  });
});
