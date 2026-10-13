[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [l10nManager](../README.md) / tPlural

# Function: tPlural()

> **tPlural**(`key`, `count`, `replacements?`): `string`

Translate a key using the current language with pluralization support.
Uses `Intl.PluralRules` to select the correct plural form based on `count`.
Translation keys should be of the form `key.one`, `key.other`, etc.
Falls back to the base key or English if the plural form is not found.

## Parameters

### key

`string`

Translation key prefix (e.g. 'article').

### count

`number`

The count used to determine the plural form.

### replacements?

`Record`\<`string`, `string`\> = `{}`

Optional replacements for token interpolation.

## Returns

`string`

- The translated string with pluralization applied.
