[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [slugManager](../README.md) / crawlAllMarkdown

# Function: crawlAllMarkdown()

> **crawlAllMarkdown**(`contentBase`, `maxQueue?`): `Promise`\<`string`[]\>

Crawl the content directory collecting all markdown and HTML pages.

## Parameters

### contentBase

`string`

Base URL to crawl for markdown/html pages.

### maxQueue?

`number` = `defaultCrawlMaxQueue`

Optional maximum queue size for crawling.

## Returns

`Promise`\<`string`[]\>

- Promise resolving to an array of discovered markdown/html paths.
