[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / \_computeSlug

# Function: \_computeSlug()

> **\_computeSlug**(`parsed`, `article`, `pagePath?`, `anchor?`): `object`

Compute and replace the current history state slug for the article.
Returns the detected top H1, its text, and the chosen slug key.

## Parameters

### parsed

`Object`

parsed page metadata

### article

`HTMLElement`

### pagePath?

`string`

### anchor?

`string` | `null`

## Returns

`object`

### h1Text

> **h1Text**: `string` \| `null`

### slugKey

> **slugKey**: `string`

### topH1

> **topH1**: `HTMLElement` \| `null`
