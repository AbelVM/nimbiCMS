[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/slugify

# utils/slugify

Canonical slug generation shared by the main thread and all workers.

Every slug producer in the runtime (page slugs, heading anchors, search
index keys, anchor rewriting) must agree on the exact same output for the
same input, otherwise links generated in a worker will not resolve against
maps built on the main thread. This module is the single source of truth.

The implementation is memoized because slug generation is called in hot
loops (once per heading, once per anchor, once per index entry) and the
same titles repeat constantly across a site.

## Variables

- [MAX\_SLUG\_LENGTH](variables/MAX_SLUG_LENGTH.md)

## Functions

- [clearSlugifyCache](functions/clearSlugifyCache.md)
- [slugify](functions/slugify.md)
- [slugifyHeading](functions/slugifyHeading.md)
- [slugifyTitle](functions/slugifyTitle.md)

## References

### default

Renames and re-exports [slugify](functions/slugify.md)
