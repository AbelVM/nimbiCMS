[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [bulmaManager](../README.md) / disconnectBulmaObservers

# Function: disconnectBulmaObservers()

> **disconnectBulmaObservers**(): `void`

Disconnect every Bulmaswatch head observer.

Called from `destroy()`. Without this, each observer keeps watching
`document.head` for the lifetime of the page and retains a reference to the
stylesheet link it was moving.

## Returns

`void`
