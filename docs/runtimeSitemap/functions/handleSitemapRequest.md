[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / handleSitemapRequest

# Function: handleSitemapRequest()

> **handleSitemapRequest**(`opts?`): `Promise`\<`string` \| `boolean` \| `Response`\>

Handle runtime requests for sitemap/rss/atom/html. When run in a
browser context this may write the generated XML/HTML to the document.

## Parameters

### opts?

options forwarded from init (contentBase, indexDepth, noIndexing, index, etc.)

#### returnResponse?

`boolean`

return a Response/string without writing to the document

#### runtimeManifest?

`Object`

runtime identity for host responses

#### url?

`string` \| `URL`

request URL for host adapters without browser location

#### writeToDocument?

`boolean`

opt in to replacing the live
  application document with the generated output. Disabled by default so
  programmatic callers can never destroy a mounted CMS; the browser
  `/?sitemap` endpoint opts in explicitly through `initCMS`.

## Returns

`Promise`\<`string` \| `boolean` \| `Response`\>

`true` when a document write was
  scheduled, a `Response` in `returnResponse` mode, or the generated body
  string in the default non-writing mode
