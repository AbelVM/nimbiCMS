[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [codeblocksManager](../README.md) / languageImporter

# Variable: languageImporter

> **languageImporter**: (`candidate`) => `Promise`\<`unknown`\> \| `null` = `null`

Optional custom importer used for tests or bespoke loading strategies.
When set to a function `(candidate: string) => Promise<Module|null>` it
will be invoked instead of the internal import+CDN fallbacks. This
enables reliable unit tests and alternative loading strategies.
