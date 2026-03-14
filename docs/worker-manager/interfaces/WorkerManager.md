[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [worker-manager](../README.md) / WorkerManager

# Interface: WorkerManager

## Properties

### get()

> **get**: () => `Worker` \| `null`

Return the Worker instance or null.

#### Returns

`Worker` \| `null`

***

### send()

> **send**: (`msg`, `timeout?`) => `Promise`\<`unknown`\>

Send a message to the worker and await a response.

#### Parameters

##### msg

`any`

##### timeout?

`number`

#### Returns

`Promise`\<`unknown`\>

***

### terminate()

> **terminate**: () => `void`

Terminate the worker and clear internal state.

#### Returns

`void`
