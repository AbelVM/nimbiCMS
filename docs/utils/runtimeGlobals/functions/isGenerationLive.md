[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/runtimeGlobals](../README.md) / isGenerationLive

# Function: isGenerationLive()

> **isGenerationLive**(`generation`): `boolean`

Whether `generation` is still allowed to act.

Stricter than [isCurrentGeneration](isCurrentGeneration.md): a `null` generation means the
caller never claimed one (host-driven sitemap/feed requests, tests, and
other runtimes invoking the generators directly), and those must keep
working. Only a *superseded* generation is blocked.

## Parameters

### generation

`number` \| `null`

## Returns

`boolean`
