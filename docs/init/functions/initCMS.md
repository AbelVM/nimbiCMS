[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [init](../README.md) / initCMS

# Function: initCMS()

> **initCMS**(`options?`): `Promise`\<`void`\>

Initialize the CMS in a host page.

Throws a `TypeError` when options are of the wrong type so configuration
mistakes are surfaced early (e.g. passing a number for `contentPath`).

## Parameters

### options?

`Record`\<`string`, `unknown`\> = `{}`

Initialization options provided by the caller.

## Returns

`Promise`\<`void`\>

resolves once the initial page has rendered
