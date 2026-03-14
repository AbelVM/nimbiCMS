[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / addSlugResolver

# Function: addSlugResolver()

> **addSlugResolver**(`fn`): `void`

Register a custom slug resolver function. The function should accept a
slug (string) and return a markdown path (or promise thereof) or `null`.

## Parameters

### fn

(`slug`, `contentBase?`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

fn parameter

## Returns

`void`

- No return value.
