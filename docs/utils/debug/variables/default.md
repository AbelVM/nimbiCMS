[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/debug](../README.md) / default

# Variable: default

> **default**: `object`

## Type Declaration

### debugError()

> **debugError**: (...`args`) => `void`

Log an error-level message when debug level is >= 1.

#### Parameters

##### args

...`any`[]

Arguments forwarded to console.error

#### Returns

`void`

### debugInfo()

> **debugInfo**: (...`args`) => `void`

Log an info-level message when debug level is >= 3.

#### Parameters

##### args

...`any`[]

Arguments forwarded to console.info

#### Returns

`void`

### debugLog()

> **debugLog**: (...`args`) => `void`

Log a verbose message when debug level is >= 3.

#### Parameters

##### args

...`any`[]

Arguments forwarded to console.log

#### Returns

`void`

### debugWarn()

> **debugWarn**: (...`args`) => `void`

Log a warning-level message when debug level is >= 2.

#### Parameters

##### args

...`any`[]

Arguments forwarded to console.warn

#### Returns

`void`

### getDebugCounters()

> **getDebugCounters**: () => `Record`\<`string`, `number`\>

Read counters as a plain object snapshot.

#### Returns

`Record`\<`string`, `number`\>

### getDebugLevel()

> **getDebugLevel**: () => `number`

Get the current debug level.

#### Returns

`number`

### incrementCounter()

> **incrementCounter**: (`name`) => `void`

Increment a named debug counter (useful for tests). No-op when debug
level is 0 to avoid unnecessary work.

#### Parameters

##### name

`string`

#### Returns

`void`

### isDebug()

> **isDebug**: () => `boolean`

Convenience: whether any debug is enabled (level > 0).

#### Returns

`boolean`

### isDebugLevel()

> **isDebugLevel**: (`level?`) => `boolean`

Returns true when the configured debug level is >= `level`.

#### Parameters

##### level?

`number` = `1`

#### Returns

`boolean`

### resetDebugCounters()

> **resetDebugCounters**: () => `void`

Reset counters (test helper).

#### Returns

`void`

### setDebugLevel()

> **setDebugLevel**: (`level`) => `void`

Set the global debug level.

#### Parameters

##### level

`number`

0..3

#### Returns

`void`
