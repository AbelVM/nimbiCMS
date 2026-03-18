[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / addSlugResolver

# Function: addSlugResolver()

> **addSlugResolver**(`fn`): `void`

Register a custom resolver function. The function should accept a slug
string and return a markdown path (or promise thereof) or `null` if not
resolved.

## Parameters

### fn

(`slug`, `contentBase?`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Resolver function to add.

## Returns

`void`

- No return value.
