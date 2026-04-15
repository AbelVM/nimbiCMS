[**nimbi-cms**](../README.md)

***

[nimbi-cms](../README.md) / slugState

# slugState

Shared slug/markdown mapping state.

Extracted into a separate module to break the circular dependency between
slugManager and indexManager. Both modules import from here; neither imports
from the other for these state objects.

## Variables

- [allMarkdownPaths](variables/allMarkdownPaths.md)
- [allMarkdownPathsSet](variables/allMarkdownPathsSet.md)
- [mdToSlug](variables/mdToSlug.md)
- [slugToMd](variables/slugToMd.md)

## Functions

- [setAllMarkdownPaths](functions/setAllMarkdownPaths.md)
