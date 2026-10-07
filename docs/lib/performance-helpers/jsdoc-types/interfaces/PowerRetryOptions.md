[**nimbi-cms**](../../../../README.md)

***

[nimbi-cms](../../../../README.md) / [lib/performance-helpers/jsdoc-types](../README.md) / PowerRetryOptions

# Interface: PowerRetryOptions

## Properties

### attemptTimeout?

> `optional` **attemptTimeout?**: `number`

***

### backoff?

> `optional` **backoff?**: `"exponential"` \| `"linear"` \| `"fixed"`

***

### baseDelay?

> `optional` **baseDelay?**: `number`

***

### jitter?

> `optional` **jitter?**: `boolean`

***

### maxAttempts?

> `optional` **maxAttempts?**: `number`

***

### maxDelay?

> `optional` **maxDelay?**: `number`

***

### onRetry?

> `optional` **onRetry?**: (`attempt`, `err`, `delay`) => `void`

#### Parameters

##### attempt

`number`

##### err

`any`

##### delay

`number`

#### Returns

`void`

***

### retryIf?

> `optional` **retryIf?**: (`err`) => `boolean`

#### Parameters

##### err

`any`

#### Returns

`boolean`
