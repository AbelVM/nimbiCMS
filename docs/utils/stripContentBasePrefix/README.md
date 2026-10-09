[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/stripContentBasePrefix

# utils/stripContentBasePrefix

Strip a content-base prefix from a relative path.

Shared by the main thread and the anchor worker so both resolve the same
relative path to the same content-relative path. Divergence here produces
anchors that point at the wrong file.

## Functions

- [stripContentBasePrefix](functions/stripContentBasePrefix.md)
