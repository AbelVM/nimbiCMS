[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [markdown](../README.md) / streamParseMarkdown

# Function: streamParseMarkdown()

> **streamParseMarkdown**(`md`, `onChunk`, `opts?`): `Promise`\<`void`\>

Stream/parse markdown in chunks and call `onChunk` for each rendered
partial HTML piece. This is a low-risk incremental renderer that uses
the existing `parseMarkdownToHtml` logic per-chunk and normalizes
heading ids so they are unique across chunks.

## Parameters

### md

`string`

full markdown source

### onChunk

`Function`

called as `onChunk(htmlChunk, {index,isLast,meta,toc})`

### opts?

options

#### chunkSize?

`number`

## Returns

`Promise`\<`void`\>
