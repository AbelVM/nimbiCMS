import { describe, it, expect, beforeEach } from "vitest";
import * as indexManager from "../src/indexManager.js";
import * as slugManager from "../src/slugManager.js";

/**
 * `indexManager` instruments the slug maps so every inserted path lands in
 * `indexSet`. The `clear` path must be instrumented too, otherwise a
 * `slugToMd.clear()` leaves every previously-seen path in the set and the
 * runtime keeps serving entries for content that no longer exists.
 */
describe("indexManager map instrumentation", () => {
  beforeEach(() => {
    // `refreshIndexPaths` lazily installs the set/clear wrappers on the slug
    // maps; call it once so instrumentation is active for every test.
    indexManager.refreshIndexPaths("/content/");
    slugManager.slugToMd.clear();
    slugManager.mdToSlug.clear();
    indexManager.indexSet.clear();
  });

  it("populates indexSet when a slug mapping is inserted", () => {
    slugManager.slugToMd.set("alpha", "docs/alpha.md");
    expect(indexManager.indexSet.has("docs/alpha.md")).toBe(true);
  });

  it("drops stale paths when slugToMd is cleared", () => {
    slugManager.slugToMd.set("alpha", "docs/alpha.md");
    slugManager.slugToMd.set("beta", "docs/beta.md");
    expect(indexManager.indexSet.has("docs/alpha.md")).toBe(true);

    slugManager.slugToMd.clear();

    expect(indexManager.indexSet.has("docs/alpha.md")).toBe(false);
    expect(indexManager.indexSet.has("docs/beta.md")).toBe(false);
  });

  it("drops stale values when mdToSlug is cleared", () => {
    // `_trackMap` records map *values*. For `mdToSlug` the value is the slug,
    // so that is what lands in `indexSet`.
    slugManager.mdToSlug.set("docs/gamma.md", "gamma");
    expect(indexManager.indexSet.has("gamma")).toBe(true);

    slugManager.mdToSlug.clear();

    expect(indexManager.indexSet.has("gamma")).toBe(false);
  });

  it("still records paths inserted after a clear", () => {
    slugManager.slugToMd.set("alpha", "docs/alpha.md");
    slugManager.slugToMd.clear();
    slugManager.slugToMd.set("delta", "docs/delta.md");

    expect(indexManager.indexSet.has("docs/alpha.md")).toBe(false);
    expect(indexManager.indexSet.has("docs/delta.md")).toBe(true);
  });

  it("keeps slugToMd usable as a real Map after instrumentation", () => {
    slugManager.slugToMd.set("alpha", "docs/alpha.md");
    expect(slugManager.slugToMd instanceof Map).toBe(true);
    expect(slugManager.slugToMd.get("alpha")).toBe("docs/alpha.md");
    expect(slugManager.slugToMd.has("alpha")).toBe(true);
    expect(slugManager.slugToMd.size).toBe(1);
    expect(Array.from(slugManager.slugToMd.keys())).toEqual(["alpha"]);
  });
});
