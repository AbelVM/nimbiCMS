[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [init](../README.md) / parseInitOptionsFromQuery

# Function: parseInitOptionsFromQuery()

> **parseInitOptionsFromQuery**(`queryString?`): `Object`

Parse well-known `initCMS` options from the current page URL's query
string. Values are converted to the expected types where possible.

Supported query params:
- `contentPath` (string)
- `searchIndex` (boolean: true|false|1|0)
- `searchIndexMode` ('eager'|'lazy')
- `defaultStyle` ('light'|'dark')
- `bulmaCustomize` (string)
- `lang` (string)
- `l10nFile` (string or 'null')
- `cacheTtlMinutes` (number)
- `cacheMaxEntries` (integer)
- `homePage` (string)
- `notFoundPage` (string)
- `availableLanguages` (comma-separated list)

The returned object contains only keys for params that were present and
successfully parsed.

## Parameters

### queryString?

`string`

optional query string (for tests); defaults to window.location.search

## Returns

`Object`

- Parsed options object containing any recognized and parsed query parameters.
