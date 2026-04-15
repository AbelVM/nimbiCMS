[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [nav](../README.md) / buildNav

# Function: buildNav()

> **buildNav**(`navbarWrap`, `container`, `navHtml`, `contentBase`, `homePage`, `t`, `renderByQuery`, `effectiveSearchEnabled`, `searchIndexMode?`, `indexDepth?`, `noIndexing?`, `logoOption?`): `Promise`\<[`NavBuildResult`](../type-aliases/NavBuildResult.md)\>

Build the site navigation DOM and wire SPA navigation handlers.

## Parameters

### navbarWrap

`HTMLElement`

Element where the navbar header should be inserted.

### container

`HTMLElement`

Main content container for click interception.

### navHtml

`string`

HTML representation of the navigation.

### contentBase

`string`

Base URL used when resolving slugs.

### homePage

`string`

Default home page slug used for the brand link.

### t

(`key`) => `string`

Translation helper from l10nManager.

### renderByQuery

() => `void` \| `Promise`\<`void`\>

Callback invoked when navigating to render a page; may return a Promise.

### effectiveSearchEnabled

`boolean`

Whether search UI should be rendered.

### searchIndexMode?

Search index mode forwarded from initCMS.

`"eager"` | `"lazy"`

### indexDepth?

`number` = `1`

Index depth (1|2|3).

### noIndexing?

`string`[] = `undefined`

Optional list of paths to exclude from indexing.

### logoOption?

`string` = `"favicon"`

Navbar logo option.

## Returns

`Promise`\<[`NavBuildResult`](../type-aliases/NavBuildResult.md)\>
