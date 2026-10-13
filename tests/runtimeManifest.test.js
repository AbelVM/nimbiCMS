import { describe, expect, it } from "vitest";
import { createRuntimeManifest } from "../src/utils/runtimeManifest.js";

describe("createRuntimeManifest", () => {
  it("snapshots and freezes the supplied source identity", () => {
    const source = { version: "one" };
    const manifest = createRuntimeManifest({ generation: 1, source });

    source.version = "two";

    expect(manifest.source).toEqual({ version: "one" });
    expect(Object.isFrozen(manifest)).toBe(true);
    expect(Object.isFrozen(manifest.source)).toBe(true);
  });
});