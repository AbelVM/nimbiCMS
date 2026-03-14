[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [codeblocksManager](../README.md) / registerLanguage

# Function: registerLanguage()

> **registerLanguage**(`name`, `modulePath?`): `Promise`\<`boolean`\>

Dynamically import and register a highlight.js language definition.
Safe to call multiple times; returns `true` if the language is loaded or
already registered.

## Parameters

### name

`string`

Language name or alias to register (e.g. 'javascript').

### modulePath?

`string`

Optional explicit module path to import for the language.

## Returns

`Promise`\<`boolean`\>

- Resolves to `true` when the language is registered.
