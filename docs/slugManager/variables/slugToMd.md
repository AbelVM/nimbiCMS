[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / slugToMd

# Variable: slugToMd

> `const` **slugToMd**: `Map`\<`string`, `string` \| [`SlugEntry`](../type-aliases/SlugEntry.md)\>

Mapping from a slug (generated from title/H1) to either a markdown path
(string) or a localized mapping object (`SlugEntry`) when
`availableLanguages` is used.
Populated during nav construction, anchor rewriting, or on demand via
crawling.
