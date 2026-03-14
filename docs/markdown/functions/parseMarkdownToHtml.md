[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / parseMarkdownToHtml

# Function: parseMarkdownToHtml()

> **parseMarkdownToHtml**(`md`): `Promise`\<[`ParseResult`](../type-aliases/ParseResult.md)\>

Convert markdown string to HTML and extract a table-of-contents list.
Preserves frontmatter metadata.

## Parameters

### md

`string`

markdown source string to convert

## Returns

`Promise`\<[`ParseResult`](../type-aliases/ParseResult.md)\>

- Promise resolving to the parsed HTML, metadata, and table-of-contents.
