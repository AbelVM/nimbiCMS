[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / preMapMdSlugs

# Function: preMapMdSlugs()

> **preMapMdSlugs**(`linkEls`, `contentBase`): `Promise`\<`void`\>

Map referenced markdown links to slugs by fetching titles where needed.

## Parameters

### linkEls

Anchors to inspect for markdown links.

`NodeListOf`\<`HTMLAnchorElement`\> | `HTMLAnchorElement`[]

### contentBase

`string`

Base URL used when resolving relative markdown paths.

## Returns

`Promise`\<`void`\>

- Resolves once mapping and any title fetches are complete.
