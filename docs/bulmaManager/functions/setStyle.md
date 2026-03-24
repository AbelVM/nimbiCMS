[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [bulmaManager](../README.md) / setStyle

# Function: setStyle()

> **setStyle**(`style`): `void`

Toggle theme styling by setting `data-theme` on each `.nimbi-mount`
container. There are three recognized theme values:
- `light`: explicitly apply light theme (sets `data-theme="light"`).
- `dark`: explicitly apply dark theme (sets `data-theme="dark"`).
- `system`: follow the system/OS preference; implementation removes any
  explicit `data-theme` attribute so user agent or CSS using
  `prefers-color-scheme` can take effect.

When no `.nimbi-mount` elements are present the same attribute is
applied to `document.documentElement` to support global/UMD usage.

## Parameters

### style

chosen theme mode.

`"light"` | `"dark"` | `"system"`

## Returns

`void`
