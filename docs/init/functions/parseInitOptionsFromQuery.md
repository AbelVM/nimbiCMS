[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [init](../README.md) / parseInitOptionsFromQuery

# Function: parseInitOptionsFromQuery()

> **parseInitOptionsFromQuery**(`queryString?`): [`ParsedInitOptions`](../interfaces/ParsedInitOptions.md)

Parse URL query string into a normalized `initCMS` options object.
Conservative, descriptive helper used by `initCMS` and tests.

The `InitOptions` and `ParsedInitOptions` typedefs are declared in this same
block on purpose: the declaration generator associates a function with the
doc comment immediately preceding it, and splitting the typedefs into their
own blocks makes it fall back to `any` for the parameters.

## Parameters

### queryString?

`string`

optional query string (for tests); defaults to window.location.search

## Returns

[`ParsedInitOptions`](../interfaces/ParsedInitOptions.md)

- Parsed options object containing any recognized and parsed query parameters.
