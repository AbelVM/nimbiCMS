[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / crawlForSlug

# Function: crawlForSlug()

> **crawlForSlug**(`decoded`, `contentBase`, `maxQueue?`): `Promise`\<`string` \| `null`\>

Crawl the content directory looking for a markdown whose H1 slug produces
the provided decoded value.  This uses directory listings (HTML) to
discover files; if the server does not expose listings the crawl will
simply fail gracefully.

This is exported as a `let` so that tests can override or spy on it; the
router and `ensureSlug` call the mutable binding instead of a fixed
function so mocks take effect.

## Parameters

### decoded

`string`

### contentBase

`string`

### maxQueue?

`number`

## Returns

`Promise`\<`string` \| `null`\>
