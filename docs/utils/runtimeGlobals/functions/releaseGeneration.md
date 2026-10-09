[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/runtimeGlobals](../README.md) / releaseGeneration

# Function: releaseGeneration()

> **releaseGeneration**(): `void`

Release the current generation. Called from `destroy()`.

After this, every guarded write is dropped until a new generation is
claimed, which is what prevents late promises from repopulating globals.

## Returns

`void`
