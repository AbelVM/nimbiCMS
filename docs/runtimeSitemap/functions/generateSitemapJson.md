[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / generateSitemapJson

# Function: generateSitemapJson()

> **generateSitemapJson**(`opts?`): `Promise`\<[`SitemapJson`](../type-aliases/SitemapJson.md)\>

Generate sitemap JSON from the runtime search index (or a provided snapshot).

## Parameters

### opts?

#### homePage?

`string`

#### includeAllMarkdown?

`boolean`

#### index?

`any`[]

optional snapshot array of index entries

#### navigationPage?

`string`

#### notFoundPage?

`string`

## Returns

`Promise`\<[`SitemapJson`](../type-aliases/SitemapJson.md)\>

sitemap JSON object
