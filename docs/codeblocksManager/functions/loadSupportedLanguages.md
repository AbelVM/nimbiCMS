[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [codeblocksManager](../README.md) / loadSupportedLanguages

# Function: loadSupportedLanguages()

> **loadSupportedLanguages**(`url?`): `Promise`\<`void`\>

Load the list of supported highlight.js languages from the canonical
GitHub markdown file and populate `SUPPORTED_HLJS_MAP`.  This is called
once at startup and caches the promise.

## Parameters

### url?

`string` = `DEFAULT_HLJS_SUPPORTED_URL`

URL to the supported-languages markdown file to fetch.

## Returns

`Promise`\<`void`\>

- Resolves once the supported languages map has been populated.
