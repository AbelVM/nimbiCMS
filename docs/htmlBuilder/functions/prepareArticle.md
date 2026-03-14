[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [htmlBuilder](../README.md) / prepareArticle

# Function: prepareArticle()

> **prepareArticle**(`t`, `data`, `pagePath`, `anchor`, `contentBase`): `Promise`\<[`ArticleResult`](../type-aliases/ArticleResult.md)\>

Given a page's fetched data, produce an <article> element, a TOC,
and slug calculations.  Handles HTML vs Markdown transparently.

## Parameters

### t

`Function`

localization function

### data

data returned by fetchMarkdown

#### isHtml?

`boolean`

#### raw

`string`

### pagePath

`string`

normalized path of the page (for link rewriting)

### anchor

optional anchor to scroll to

`string` | `null`

### contentBase

`string`

base URL for resolving links and images

## Returns

`Promise`\<[`ArticleResult`](../type-aliases/ArticleResult.md)\>
