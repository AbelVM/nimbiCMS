[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / generateLlmsTxt

# Function: generateLlmsTxt()

> **generateLlmsTxt**(`json`, `opts?`): `string`

Generate an llms.txt content string from the runtime search index.
llms.txt is an emerging convention (llmstxt.org) that exposes a
concise, LLM-friendly listing of a site's pages for answer engines.

## Parameters

### json

`any`[] \| [`SitemapJson`](../type-aliases/SitemapJson.md)

sitemap JSON (or entries array)

### opts?

#### description?

`string`

optional site description

#### name?

`string`

site name (defaults to the document title)

## Returns

`string`

llms.txt content
