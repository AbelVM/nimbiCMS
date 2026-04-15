[**nimbi-cms**](../README.md)

***

[nimbi-cms](../README.md) / markdown

# markdown

Markdown parsing and renderer helpers.

Provides utilities for converting Markdown to HTML, managing renderer
workers, and extracting table-of-contents data.

## Interfaces

- [MarkdownPlugin](interfaces/MarkdownPlugin.md)

## Type Aliases

- [Meta](type-aliases/Meta.md)
- [ParseResult](type-aliases/ParseResult.md)
- [RendererResult](type-aliases/RendererResult.md)
- [TocEntry](type-aliases/TocEntry.md)

## Variables

- [markdownPlugins](variables/markdownPlugins.md)

## Functions

- [\_sendToRenderer](functions/sendToRenderer.md)
- [\_slugifyLocal](functions/slugifyLocal.md)
- [\_splitIntoSections](functions/splitIntoSections.md)
- [addMarkdownExtension](functions/addMarkdownExtension.md)
- [detectFenceLanguages](functions/detectFenceLanguages.md)
- [detectFenceLanguagesAsync](functions/detectFenceLanguagesAsync.md)
- [initRendererWorker](functions/initRendererWorker.md)
- [parseMarkdownToHtml](functions/parseMarkdownToHtml.md)
- [setMarkdownExtensions](functions/setMarkdownExtensions.md)
- [streamParseMarkdown](functions/streamParseMarkdown.md)
- [teardownRendererWorkerPool](functions/teardownRendererWorkerPool.md)
