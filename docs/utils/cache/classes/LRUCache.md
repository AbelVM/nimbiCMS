[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/cache](../README.md) / LRUCache

# Class: LRUCache

Lightweight LRU cache with optional TTL and eviction callback.
Designed to be a drop-in replacement for simple Map-based caches where
bounded size or TTL-based eviction is desirable.

Methods: get, set, has, delete, clear and property `size`.

## Constructors

### Constructor

> **new LRUCache**(`opts?`): `LRUCache`

Create an LRU cache.

#### Parameters

##### opts?

###### maxSize?

`number`

###### onEvict?

`Function`

###### ttlMs?

`number`

#### Returns

`LRUCache`

## Properties

### \_map

> **\_map**: `Map`\<`any`, `any`\>

***

### \_maxSize

> **\_maxSize**: `number`

***

### \_onEvict

> **\_onEvict**: `Function` \| `null`

***

### \_ttlMs

> **\_ttlMs**: `number`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

##### Returns

`number`

## Methods

### \_evictKey()

> **\_evictKey**(`key`, `entry`): `void`

#### Parameters

##### key

`any`

##### entry

`any`

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Clear the cache and call eviction callback for each entry.

#### Returns

`void`

***

### delete()

> **delete**(`key`): `boolean`

Delete key from cache.

#### Parameters

##### key

`any`

#### Returns

`boolean`

***

### get()

> **get**(`key`): `any`

Get value for key or undefined if missing/expired.

#### Parameters

##### key

`any`

#### Returns

`any`

***

### has()

> **has**(`key`): `boolean`

Check if key exists and is not expired.

#### Parameters

##### key

`any`

#### Returns

`boolean`

***

### set()

> **set**(`key`, `value`): `LRUCache`

Set a key/value pair and enforce maxSize eviction.

#### Parameters

##### key

`any`

##### value

`any`

#### Returns

`LRUCache`
