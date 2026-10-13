[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / ensureScrollTopButton

# Function: ensureScrollTopButton()

> **ensureScrollTopButton**(`article`, `topH1`, `opts?`): `void`

Create or update a scroll-to-top button and toggle TOC/menu label
visibility. Observes the supplied `topH1` element if present; on pages
without a top heading we fall back to a simple scroll-position listener.

## Parameters

### article

`HTMLElement`

The article element produced by `prepareArticle`.

### topH1

`HTMLElement` \| `null`

The top-level H1 element for the article, if present.

### opts?

`object` = `{}`

Options object controlling rendering behavior.

## Returns

`void`
