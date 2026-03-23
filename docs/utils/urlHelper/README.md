[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/urlHelper

# utils/urlHelper

Utilities for converting between the canonical `?page=slug` URL form and
the cosmetic hash form `#/slug#anchor?params` used for friendly links.

The helpers are intentionally conservative: they only parse the supported
schemas and return a small normalized `Route` object so callers can make
deterministic decisions about navigation and fetch logic.

## Interfaces

- [Route](interfaces/Route.md)

## Functions

- [buildCosmeticUrl](functions/buildCosmeticUrl.md)
- [parseHrefToRoute](functions/parseHrefToRoute.md)
- [toCanonicalHref](functions/toCanonicalHref.md)
