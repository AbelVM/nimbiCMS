[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / slugToMd

# Variable: slugToMd

> `const` **slugToMd**: `Map`\<`string`, `string` \| \{ `default?`: `string`; `langs?`: \{ \}; \}\>

Mapping from a slug (generated from title/H1) to a markdown path or a
localized mapping object when `availableLanguages` is used. Values may be
a string (direct path) or an object with `{ default?: string, langs?: { [lang:string]: string } }`.
Populated during nav construction, anchor rewriting, or on demand via
crawling.
