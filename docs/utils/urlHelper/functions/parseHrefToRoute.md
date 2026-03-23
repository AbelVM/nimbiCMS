[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/urlHelper](../README.md) / parseHrefToRoute

# Function: parseHrefToRoute()

> **parseHrefToRoute**(`href`): [`Route`](../interfaces/Route.md)

Parse a given href string (relative or absolute) and return a normalized
[Route](../interfaces/Route.md) describing whether it's `canonical` (?page=...), `cosmetic`
(hash route like `#/slug`), or a file/path.

## Parameters

### href

`string`

href to parse (relative or absolute)

## Returns

[`Route`](../interfaces/Route.md)
