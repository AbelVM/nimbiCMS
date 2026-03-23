[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / handleSitemapRequest

# Function: handleSitemapRequest()

> **handleSitemapRequest**(`opts?`): `Promise`\<`boolean`\>

Handle runtime requests for sitemap/rss/atom/html. When run in a
browser context this may write the generated XML/HTML to the document.

## Parameters

### opts?

`Object` = `{}`

options forwarded from init (contentBase, indexDepth, noIndexing, index, etc.)

## Returns

`Promise`\<`boolean`\>

true when the request was handled (output written)
