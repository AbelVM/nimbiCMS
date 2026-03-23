[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / allMarkdownPathsSet

# Variable: allMarkdownPathsSet

> `const` **allMarkdownPathsSet**: `Set`\<`string`\>

Derived Set for fast membership checks against `allMarkdownPaths`.
Consumers should prefer `allMarkdownPathsSet.has(path)` when checking
whether a path is known to avoid O(n) array scans.
