[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [l10nManager](../README.md) / t

# Function: t()

> **t**(`key`, `replacements?`): `string`

Translate a key using the current language. Replacement tokens of the
form `{name}` are interpolated from the `replacements` object.

## Parameters

### key

`string`

Translation key to look up in the current locale.

### replacements?

`Record`\<`string`, `string`\> = `{}`

Optional replacements for token interpolation.

## Returns

`string`

- The translated string, or an empty string when not found.
