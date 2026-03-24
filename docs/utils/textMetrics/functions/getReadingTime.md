[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/textMetrics](../README.md) / getReadingTime

# Function: getReadingTime()

> **getReadingTime**(`text`): [`ReadingTimeResult`](../interfaces/ReadingTimeResult.md)

Get the raw `reading-time` result for the supplied text, using the internal cache.

The returned object mirrors the `reading-time` package result and includes
`text`, `minutes`, `time` and (when available) `words`.

## Parameters

### text

`string`

Input text (markdown/HTML). May be empty.

## Returns

[`ReadingTimeResult`](../interfaces/ReadingTimeResult.md)

Estimated reading time metadata.
