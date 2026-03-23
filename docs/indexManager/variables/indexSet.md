[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [indexManager](../README.md) / indexSet

# Variable: indexSet

> `const` **indexSet**: `Set`\<`string`\>

Runtime set of known markdown paths collected from the index and slug maps.
Values are normalized, content-base-relative paths (strings) suitable for
consumption by other runtime modules (slug lookups, indexing, sitemaps).
Populated by `refreshIndexPaths()` and by the tracking wrappers installed
via `_ensureMapsTracked()` when slug maps are mutated.
Other modules read this set to enumerate available pages.
