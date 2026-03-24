# Changelog

All notable changes to **nimbiCMS** will be documented in this file.

## Unreleased

- ...
- **[FEAT]** Added cosmetic URLs (`website/#/slug[#anchor][?params]`) on top of canonical URLs (`website/?page=slug[#anchor][?params]`)
- **[FEAT]** Improved SEO management
- **[FEAT]** Added a dynamic sitemap
- **[FEAT]** Added dynamic RSS 2.0 and ATOM 1.0 endpoints
- **[FEAT]** More flexible defaults for `homePage` and `notFoundPage`
- **[FEAT]** Centralized logging behavior
- **[FEAT]** Improved UI responsiveness for heavy indexing
- **[PERF]** Improved parallel indexing: 6x faster
- **[PERF]** Reuse DOMParser
- **[PERF]** Memoize expensive transforms and metrics
- **[PERF]** Use Sets/Maps for membership checks
- **[PERF]** Batch DOM updates
- **[PERF]** Gate expensive debug/log formatting
- **[PERF]** Fetch caching & dedupe
- **[PERF]** Negative cache for dynamic imports
- **[PERF]** Limit and tune concurrency
- **[PERF]** Hot-regex & allocations
- **[PERF]** Cache size / eviction policies
- **[PERF]**
- **[PERF]**
- **[PERF]**
- **[PERF]**
- **[CHORE]** Improved JSDoc coverage and quality
- **[CHORE]** Raised tests coverage

## v1.0.5

- **[FIX]** Nasty regression at `contentPath` management
- **[FIX]** Minor styling issues in system mode when system is dark
- **[FIX]** Minor fixes

## v1.0.4

- **[FIX]** Some weird corner case wih `contentPath` leads to wrong paths
- **[FIX]** If `homePage` is set to a non existent HTML file, it might produce a folder listing instead
- **[FIX]** Subtle CSS error in responsive view

## v1.0.3

- **[FIX]** HTML Character Entities were not properly rendered
- **[FEAT]** Smoother page transitions
- **[FEAT]** Added `navigationPage` option to enable custom navigation index
- **[FEAT]** Added support for markdown emojis :tada:
- **[PERF]** Parallel indexing, highly improved search box initial availability time
- **[PERF]** Workers pool for parallel processing
- **[PERF]** Enhanced workers life cycle management
- **[A11Y]** Keyboard navigation added to search results
- **[A11Y]** Enforced [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag) 2.0, 2.1, 2.2 on level A, AA and AAA as well as a number of best practices
- **[DOCS]** Add documentation to scripts
- **[CHORE]** Housecleaning: removed leftovers
- **[CHORE]** Improved JSDoc coverage and quality
- **[CHORE]** Improved tests coverage

## v1.0.2

- **[FIX]** Playground retrieval of highlight.js themes was failing.
- **[FEAT]** Bundle size optimizations, 50% bundled CSS size reduction.
- **[FEAT]** Playground improved.

## v1.0.1

- **[FIX]** Disabled image preview for images wrapped in links.
- **[FIX]** Use repo-relative contentPath to avoid root fetches.
- **[FIX]** Fixed gh-pages path.
- **[DOCS]** Document `.nojekyll` to serve underscore-markdown files in gh-pages.

## v1.0.0

- First release.
