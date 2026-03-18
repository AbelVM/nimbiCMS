[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/helpers](../README.md) / setEagerForAboveFoldImages

# Function: setEagerForAboveFoldImages()

> **setEagerForAboveFoldImages**(`container`, `marginPx?`, `debug?`): `void`

Mark images that are above the fold as eager and high priority.

This runs in a best-effort fashion: it scans all images within `container`,
determines which ones appear (or will appear) within the visible portion of
the container, and applies `loading="eager"` + `fetchpriority="high"`.

The function also defaults every image to `loading="lazy"` unless
otherwise marked eager.

## Parameters

### container

`HTMLElement`

Root element containing the images.

### marginPx?

`number` = `0`

Extra pixels past the visible bottom that should still be considered above-the-fold.

### debug?

`boolean` = `false`

If true, logs debug info for each image.

## Returns

`void`
