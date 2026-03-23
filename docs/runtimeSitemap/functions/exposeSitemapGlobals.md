[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / exposeSitemapGlobals

# Function: exposeSitemapGlobals()

> **exposeSitemapGlobals**(`opts?`): `Promise`\<\{ `deduped`: `any`[]; `json`: `Object`; \} \| `null`\>

Generate sitemap JSON and expose `window.__nimbiSitemapJson` and
`window.__nimbiSitemapFinal` for diagnostics. Does not write XML to the document.

## Parameters

### opts?

`Object` = `{}`

## Returns

`Promise`\<\{ `deduped`: `any`[]; `json`: `Object`; \} \| `null`\>

generated JSON and deduped entries
