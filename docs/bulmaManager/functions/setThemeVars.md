[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [bulmaManager](../README.md) / setThemeVars

# Function: setThemeVars()

> **setThemeVars**(`vars`): `void`

Apply an object of CSS custom properties to the document root. This makes
it easy for consumers to theme colors/fonts/etc. without touching Bulma
directly. Property names should be provided without the leading `--`.

## Parameters

### vars

`Record`\<`string`, `string`\>

Map of CSS variable names (without `--`) to values.

## Returns

`void`
