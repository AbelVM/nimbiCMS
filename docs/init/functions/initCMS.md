[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [init](../README.md) / initCMS

# Function: initCMS()

> **initCMS**(`options?`): `Promise`\<`void`\>

Initialize the CMS in a host page.

Throws a `TypeError` when options are of the wrong type so configuration
mistakes are surfaced early (e.g. passing a number for `contentPath`).

## Parameters

### options?

options parameter

#### allowUrlPathOverrides?

`boolean`

advanced opt-in that
  allows `contentPath`, `homePage`, and `notFoundPage` to be overridden via
  URL query parameters. This is disabled by default for security; enabling
  it should only be done by trusted host pages.

#### bulmaCustomize?

`string`

Bulma customization flag

#### cacheMaxEntries?

`number`

maximum number of resolution cache entries (defaults to module constant)

#### cacheTtlMinutes?

`number`

resolution cache time‑to‑live in minutes

#### contentPath?

`string`

URL path to content

#### crawlMaxQueue?

`number`

maximum directory queue length for slug crawling (see docs)

#### defaultStyle?

`"light"` \| `"dark"`

initial light/dark mode

#### el

`string` \| `Element`

mount point selector or element

#### homePage?

`string`

Sets the site’s home page. Can be a `.md` or `.html` file. If not set, falls back to `'_home.md'`.

#### l10nFile?

`string` \| `null`

path to localization file

#### lang?

`string`

UI language code

#### markdownExtensions?

`object`[]

list of marked extensions to register on init

#### notFoundPage?

`string`

Sets the site's not-found page. Can be a `.md` or `.html` file. If not set, defaults to `'_404.md'`.

#### searchIndex?

`boolean`

build a client-side search index (adds search box to navbar)

#### searchIndexMode?

`"eager"` \| `"lazy"`

when to build the search index

#### skipRootReadme?

`boolean`

when true, the indexer will skip link discovery inside a repository-root `README.md`; set to `false` to treat the root README like other content pages.

## Returns

`Promise`\<`void`\>

resolves once the initial page has rendered
