[**nimbi-cms**](../../README.md)

***

[nimbi-cms](../../README.md) / utils/splitIntoSections

# utils/splitIntoSections

Markdown section splitting for incremental (streaming) rendering.

Shared by the main-thread renderer and the renderer worker so both produce
byte-identical chunk boundaries. Divergent boundaries would make streamed
output differ from non-streamed output for the same document.

## Functions

- [splitIntoSections](functions/splitIntoSections.md)

## References

### default

Renames and re-exports [splitIntoSections](functions/splitIntoSections.md)
