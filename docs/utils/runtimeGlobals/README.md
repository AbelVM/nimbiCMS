[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/runtimeGlobals

# utils/runtimeGlobals

Generation-guarded access to the `window.__nimbi*` debug globals.

Several modules publish runtime state on `window` so host pages and
debugging tools can inspect it. The problem is lifetime: a promise that
resolves *after* `destroy()` will happily repopulate those globals, so a
torn-down runtime leaves stale state behind and the next runtime inherits
it. That is indistinguishable from a leak when profiling.

This module centralizes the writes behind a generation check. Each runtime
claims a monotonically increasing id at init; a write is dropped unless it
belongs to the generation that is still current.

## Choosing a variant

There are two guards, and picking the wrong one is a real hazard:

| Use | When | Behaviour on `null` generation |
|---|---|---|
| `setIfCurrent` / `isCurrentGeneration` | Code driven by `initCMS`, where a generation always exists | **Rejects** |
| `setIfLive` / `isGenerationLive` | Public API that hosts and tests call directly, with no runtime | **Allows** |

The distinction matters because a large part of this library's surface
(`handleSitemapRequest`, `generateSitemapJson`, `setSearchIndex`,
`renderByQuery`) is invoked directly by host pages and by the test suite
without ever calling `initCMS`. Using the strict variant there silently
disables the feature; using the permissive variant on an init-owned path
lets a stale write through after teardown.

Rule of thumb: if the function is reachable from the public API without
`initCMS`, use the permissive variant. Otherwise use the strict one.

## Variables

- [MANAGED\_GLOBALS](variables/MANAGED_GLOBALS.md)

## Functions

- [activeGeneration](functions/activeGeneration.md)
- [claimGeneration](functions/claimGeneration.md)
- [clearAllGlobals](functions/clearAllGlobals.md)
- [clearGlobal](functions/clearGlobal.md)
- [getGlobal](functions/getGlobal.md)
- [isCurrentGeneration](functions/isCurrentGeneration.md)
- [isGenerationLive](functions/isGenerationLive.md)
- [releaseGeneration](functions/releaseGeneration.md)
- [setIfCurrent](functions/setIfCurrent.md)
- [setIfLive](functions/setIfLive.md)
