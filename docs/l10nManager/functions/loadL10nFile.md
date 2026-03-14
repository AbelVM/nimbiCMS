[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [l10nManager](../README.md) / loadL10nFile

# Function: loadL10nFile()

> **loadL10nFile**(`path`, `pageDir`): `Promise`\<`void`\>

Load a JSON localization file and merge its contents into the runtime
dictionary.

## Parameters

### path

`string`

URL or relative path to the JSON localization file.

### pageDir

`string`

Base page directory used to resolve relative paths.

## Returns

`Promise`\<`void`\>

- Resolves when the file has been fetched and merged.
