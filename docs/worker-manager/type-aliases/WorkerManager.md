[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / WorkerManager

# Type Alias: WorkerManager

> **WorkerManager**\<\> = `object`

## Type Parameters

## Type Declaration

### get()

> **get**: () => `Worker` \| `null`

#### Returns

`Worker` \| `null`

### send()

> **send**: (`msg`, `timeout?`) => `Promise`\<`unknown`\>

#### Parameters

##### msg

[`WorkerRequest`](WorkerRequest.md)

##### timeout?

`number`

#### Returns

`Promise`\<`unknown`\>

### terminate()

> **terminate**: () => `void`

#### Returns

`void`
