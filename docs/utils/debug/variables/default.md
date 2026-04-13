[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/debug](../README.md) / default

# Variable: default

> **default**: `object`

## Type Declaration

### debugError()

> **debugError**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### debugInfo()

> **debugInfo**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### debugLog()

> **debugLog**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### debugWarn()

> **debugWarn**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### getDebugCounters()

> **getDebugCounters**: () => `Record`\<`string`, `number`\>

#### Returns

`Record`\<`string`, `number`\>

### getDebugLevel()

> **getDebugLevel**: () => `number`

#### Returns

`number`

### incrementCounter()

> **incrementCounter**: (`name`) => `void`

#### Parameters

##### name

`string`

#### Returns

`void`

### isDebug()

> **isDebug**: () => `boolean`

#### Returns

`boolean`

### isDebugLevel()

> **isDebugLevel**: (`level?`) => `boolean`

#### Parameters

##### level?

`number` = `1`

#### Returns

`boolean`

### resetDebugCounters()

> **resetDebugCounters**: () => `void`

Reset all counters.

#### Returns

`void`

### setDebugLevel()

> **setDebugLevel**: (`level`) => `void`

#### Parameters

##### level

`number`

#### Returns

`void`
