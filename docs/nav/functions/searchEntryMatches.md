[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [nav](../README.md) / searchEntryMatches

# Function: searchEntryMatches()

> **searchEntryMatches**(`entry`, `q`): `boolean`

Does a search-index entry match the (already lowercased) query?

Uses the `_titleLc` / `_excerptLc` fields cached by
`normalizeSearchIndexEntriesMut` when present, falling back to computing
them for entries that were never normalized (for example a host-supplied
index that bypassed the normalizer).

## Parameters

### entry

#### _excerptLc?

`string`

#### _titleLc?

`string`

#### excerpt?

`string`

#### title?

`string`

### q

`string`

Lowercased query.

## Returns

`boolean`
