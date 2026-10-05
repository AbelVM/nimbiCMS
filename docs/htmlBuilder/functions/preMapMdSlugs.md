[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / preMapMdSlugs

# Function: preMapMdSlugs()

> **preMapMdSlugs**(`linkEls`, `contentBase`, `opts?`): `Promise`\<`void`\>

Map referenced markdown links to slugs by fetching titles where needed.

## Parameters

### linkEls

`NodeListOf`\<`HTMLAnchorElement`\> \| `HTMLAnchorElement`[]

Anchors to inspect for markdown links.

### contentBase

`string`

Base URL used when resolving relative markdown paths.

### opts?

## Returns

`Promise`\<`void`\>

- Resolves once mapping and any title fetches are complete.
