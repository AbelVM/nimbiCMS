import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * Every type exported by the generated `src/index.d.ts` must be documented.
 *
 * A JSDoc de-duplication pass during this audit collapsed stacked doc blocks
 * and kept only the last one, which silently dropped the `@typedef`
 * declarations living in the first block. `InitOptions` and
 * `ParsedInitOptions` lost their TypeDoc pages as a result, while still
 * appearing in the generated `.d.ts` — so every type-level gate stayed green.
 *
 * This suite cross-checks the two artifacts so that class of loss fails here.
 */

/** Recursively collect `.js` files under `src/`. */
function collectSourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (entry.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

const ROOT = process.cwd();
const dts = readFileSync(resolve(ROOT, "src/index.d.ts"), "utf8");
const sourceFiles = collectSourceFiles(resolve(ROOT, "src"));
const allSource = sourceFiles
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

/** Types the `.d.ts` exports as interfaces or type aliases. */
function exportedTypeNames(text) {
  const names = new Set();
  const re = /^export (?:interface|type) (\w+)/gm;
  let m;
  while ((m = re.exec(text)) !== null) names.add(m[1]);
  return names;
}

describe("generated .d.ts types are documented", () => {
  const exported = exportedTypeNames(dts);

  it("found exported types to check", () => {
    // Guards against the regex silently matching nothing.
    expect(exported.size).toBeGreaterThan(5);
  });

  it("every exported type is declared in source JSDoc", () => {
    // Each type must appear in a `@typedef` somewhere in `src/`, otherwise it
    // is a phantom that only exists in the generated output.
    //
    // Four types are synthesized by the declaration generator and have no
    // source declaration. They are pre-existing (identical on the parent
    // commit) and out of scope here, so they are allowlisted rather than
    // fixed. Removing an entry from this list without adding a `@typedef`
    // would mean the type became a phantom.
    const GENERATOR_SYNTHESIZED = new Set([
      "NavItem",
      "ThemeStyle",
      "PageContext",
      "WorkerManager",
    ]);
    const missing = [];
    for (const name of exported) {
      if (GENERATOR_SYNTHESIZED.has(name)) continue;
      const declared = new RegExp(`@typedef[^*]*\\b${name}\\b`).test(allSource);
      if (!declared) missing.push(name);
    }
    expect(missing).toEqual([]);
  });

  it("InitOptions and ParsedInitOptions are still declared", () => {
    // The specific regression this suite was written for.
    expect(allSource).toMatch(/@typedef[^*]*\bInitOptions\b/);
    expect(allSource).toMatch(/@typedef[^*]*\bParsedInitOptions\b/);
  });

  it("no source file has a doc block that only contains @property tags", () => {
    // A `@property` block with no owning `@typedef` means the typedef was
    // stripped out of that block — the exact shape of the Q2 regression.
    const orphans = [];
    for (const file of sourceFiles) {
      const text = readFileSync(file, "utf8");
      const blocks = text.match(/\/\*\*(?:[^*]|\*(?!\/))*\*\//g) || [];
      for (const block of blocks) {
        if (block.includes("@property") && !block.includes("@typedef")) {
          orphans.push(file.replace(`${ROOT}/`, ""));
          break;
        }
      }
    }
    expect(orphans).toEqual([]);
  });
});
