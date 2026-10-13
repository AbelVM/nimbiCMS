[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / [runtimeSitemap](../README.md) / attachSitemapDownloadUI

# Function: attachSitemapDownloadUI()

> **attachSitemapDownloadUI**(`mount`, `opts?`): `HTMLElement` \| `null`

Attach a small UI control that triggers a sitemap JSON download.
This is optional and only used when host code explicitly enables it.

## Parameters

### mount

`HTMLElement`

Container where the control should be appended.

### opts?

Optional UI options.

#### filename?

`string`

## Returns

`HTMLElement` \| `null`

The created button element, or null when not attached.
