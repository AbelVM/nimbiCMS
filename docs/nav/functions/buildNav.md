[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [nav](../README.md) / buildNav

# Function: buildNav()

> **buildNav**(`navbarWrap`, `container`, `navHtml`, `contentBase`, `homePage`, `t`, `renderByQuery`, `effectiveSearchEnabled`, `searchIndexMode?`, `indexDepth?`, `noIndexing?`, `logoOption?`): `Promise`\<[`NavBuildResult`](../type-aliases/NavBuildResult.md)\>

Build the main navigation bar DOM and wire up SPA navigation callbacks.
Previously this logic lived directly inside `initCMS` in nimbi-cms.js.

## Parameters

### navbarWrap

`HTMLElement`

element where the navbar header should be
  inserted (typically a <header> element).

### container

`HTMLElement`

main content container; clicks inside
  this element will also be intercepted for SPA navigation.

### navHtml

`string`

HTML representation of the navigation obtained
  by parsing `_navigation.md`.

### contentBase

`string`

base URL used when resolving slugs.

### homePage

`string`

default home page slug used for the brand link

### t

`Function`

translation helper from l10nManager.

### renderByQuery

`Function`

callback invoked when the user navigates
  via the navbar or content links.  This allows the UI layer to render the
  requested page without creating a circular dependency.

### effectiveSearchEnabled

`boolean`

whether search UI should be rendered

### searchIndexMode?

search index option
  forwarded from `initCMS`; only relevant if a search input is present.

`"eager"` | `"lazy"`

### indexDepth?

include H2 headings in the search index when 2; include H3 when 3

`1` | `2` | `3`

### noIndexing?

`undefined` = `undefined`

### logoOption?

`string` = `'favicon'`

## Returns

`Promise`\<[`NavBuildResult`](../type-aliases/NavBuildResult.md)\>

resolves with an object containing `navbar` and `linkEls`
