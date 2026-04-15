[**nimbi-cms**](../README.md)

***

[nimbi-cms](../README.md) / slugManager

# slugManager

Slug and markdown mapping utilities.

Manage slug generation, mapping, and runtime discovery for markdown content.

## Type Aliases

- [FetchResult](type-aliases/FetchResult.md)
- [SlugEntry](type-aliases/SlugEntry.md)

## Variables

- [availableLanguages](variables/availableLanguages.md)
- [CRAWL\_MAX\_QUEUE](variables/CRAWL_MAX_QUEUE.md)
- [crawlCache](variables/crawlCache.md)
- [defaultCrawlMaxQueue](variables/defaultCrawlMaxQueue.md)
- [fetchCache](variables/fetchCache.md)
- [HOME\_SLUG](variables/HOME_SLUG.md)
- [homePage](variables/homePage.md)
- [listPathsFetched](variables/listPathsFetched.md)
- [listSlugCache](variables/listSlugCache.md)
- [negativeFetchCache](variables/negativeFetchCache.md)
- [notFoundPage](variables/notFoundPage.md)
- [searchIndex](variables/searchIndex.md)
- [skipRootReadme](variables/skipRootReadme.md)
- [slugResolvers](variables/slugResolvers.md)

## Functions

- [\_setAllMd](functions/setAllMd.md)
- [\_setSearchIndex](functions/setSearchIndex.md)
- [\_storeSlugMapping](functions/storeSlugMapping.md)
- [addSlugResolver](functions/addSlugResolver.md)
- [awaitSearchIndex](functions/awaitSearchIndex.md)
- [buildSearchIndex](functions/buildSearchIndex.md)
- [buildSearchIndexWorker](functions/buildSearchIndexWorker.md)
- [clearFetchCache](functions/clearFetchCache.md)
- [clearListCaches](functions/clearListCaches.md)
- [crawlAllMarkdown](functions/crawlAllMarkdown.md)
- [crawlForSlug](functions/crawlForSlug.md)
- [crawlForSlugWorker](functions/crawlForSlugWorker.md)
- [ensureSlug](functions/ensureSlug.md)
- [fetchMarkdown](functions/fetchMarkdown.md)
- [getFetchConcurrency](functions/getFetchConcurrency.md)
- [getLanguages](functions/getLanguages.md)
- [getSearchIndex](functions/getSearchIndex.md)
- [initSlugWorker](functions/initSlugWorker.md)
- [isExternalLink](functions/isExternalLink.md)
- [isExternalLinkWithBase](functions/isExternalLinkWithBase.md)
- [removeSlugResolver](functions/removeSlugResolver.md)
- [resolveSlugPath](functions/resolveSlugPath.md)
- [setContentBase](functions/setContentBase.md)
- [setDefaultCrawlMaxQueue](functions/setDefaultCrawlMaxQueue.md)
- [setFetchCacheMaxSize](functions/setFetchCacheMaxSize.md)
- [setFetchCacheTTL](functions/setFetchCacheTTL.md)
- [setFetchConcurrency](functions/setFetchConcurrency.md)
- [setFetchMarkdown](functions/setFetchMarkdown.md)
- [setFetchNegativeCacheTTL](functions/setFetchNegativeCacheTTL.md)
- [setHomePage](functions/setHomePage.md)
- [setLanguages](functions/setLanguages.md)
- [setNegativeFetchCacheMaxSize](functions/setNegativeFetchCacheMaxSize.md)
- [setNotFoundPage](functions/setNotFoundPage.md)
- [setSkipRootReadme](functions/setSkipRootReadme.md)
- [slugify](functions/slugify.md)
- [storeSlugMapping](functions/storeSlugMapping-1.md)
- [unescapeMarkdown](functions/unescapeMarkdown.md)
- [uniqueSlug](functions/uniqueSlug.md)
- [watchForColdHashRoute](functions/watchForColdHashRoute.md)
- [whenSearchIndexReady](functions/whenSearchIndexReady.md)

## References

### allMarkdownPaths

Re-exports [allMarkdownPaths](../slugState/variables/allMarkdownPaths.md)

***

### allMarkdownPathsSet

Re-exports [allMarkdownPathsSet](../slugState/variables/allMarkdownPathsSet.md)

***

### mdToSlug

Re-exports [mdToSlug](../slugState/variables/mdToSlug.md)

***

### slugToMd

Re-exports [slugToMd](../slugState/variables/slugToMd.md)
