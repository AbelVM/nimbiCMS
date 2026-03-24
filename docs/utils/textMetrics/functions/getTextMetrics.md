[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/textMetrics](../README.md) / getTextMetrics

# Function: getTextMetrics()

> **getTextMetrics**(`text`): [`TextMetrics`](../interfaces/TextMetrics.md)

Get consolidated text metrics for the provided text.

Returns an object with:
- `readingTime`: the `reading-time` result,
- `wordCount`: integer word count (falls back to a simple whitespace split
   if `reading-time` doesn't provide `words`).

The result is returned from an in-memory cache when available.

## Parameters

### text

`string`

Input text to analyze.

## Returns

[`TextMetrics`](../interfaces/TextMetrics.md)

Object containing `readingTime` and `wordCount`.
