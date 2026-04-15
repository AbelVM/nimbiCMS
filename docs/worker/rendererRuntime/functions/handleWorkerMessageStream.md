[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [worker/rendererRuntime](../README.md) / handleWorkerMessageStream

# Function: handleWorkerMessageStream()

> **handleWorkerMessageStream**(`msg`, `onChunk`): `Promise`\<\{ `error`: `string`; `name`: `any`; `type`: `string`; \} \| \{ `error?`: `undefined`; `name`: `any`; `type`: `string`; \} \| \{ `id`: `any`; `result`: `any`[]; \} \| \{ `error?`: `undefined`; `id`: `any`; `result`: \{ `html`: `string`; `meta`: `Record`\<`string`, `string`\>; `toc`: `any`[]; \}; \} \| \{ `id`: `any`; `meta`: `Record`\<`string`, `string`\>; `type`: `string`; \} \| \{ `error`: `string`; `id`: `any`; \}\>

## Parameters

### msg

`any`

### onChunk

`any`

## Returns

`Promise`\<\{ `error`: `string`; `name`: `any`; `type`: `string`; \} \| \{ `error?`: `undefined`; `name`: `any`; `type`: `string`; \} \| \{ `id`: `any`; `result`: `any`[]; \} \| \{ `error?`: `undefined`; `id`: `any`; `result`: \{ `html`: `string`; `meta`: `Record`\<`string`, `string`\>; `toc`: `any`[]; \}; \} \| \{ `id`: `any`; `meta`: `Record`\<`string`, `string`\>; `type`: `string`; \} \| \{ `error`: `string`; `id`: `any`; \}\>
