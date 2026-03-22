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
- **[CHORE]** Improved JSDoc coverage and quality

## v1.0.5

- **[FIX]** Nasty regression at `contentPath` management
- **[FIX]** Minor styling issues in system mode when system is dark
- **[FIX]** Minor fixes

## v1.0.4

- **[FIX]** Some weird corner case wih `contentPath` leads to wrong paths
- **[FIX]** If `homePage` is set to a non existent HTML file, it might produce a folder listing instead
- **[FIX]** Subtle CSS error in responsive view

## v1.0.3

- **[FEAT]** Parallel indexing, highly improved search box initial availability time
- **[FEAT]** Workers pool for parallel processing
- **[FEAT]** Enhanced workers life cycle management
- **[FEAT]** Smoother page transitions
- **[FEAT]** Added `navigationPage` option to enable custom navigation index
- **[FEAT]** Added support for markdown emojis :tada:
- **[FIX]** HTML Character Entities were not properly rendered
- **[A11Y]** Keyboard navigation added to search results
- **[A11Y]** Enforced [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag) 2.0, 2.1, 2.2 on level A, AA and AAA as well as a number of best practices
- **[DOCS]** Add documentation to scripts
- **[CHORE]** Housecleaning: removed leftovers
- **[CHORE]** Improved JSDoc coverage and quality
- **[CHORE]** Improved tests coverage

## v1.0.2

- **[FEAT]** Bundle size optimizations, 50% bundled CSS size reduction.
- **[FEAT]** Playground improved.
- **[FIX]** Playground retrieval of highlight.js themes was failing.

## v1.0.1

- **[FIX]** Disabled image preview for for images wrapped in links.
- **[DOCS]** Document `.nojekyll` to serve underscore-markdown files in gh-pages.
- **[FIX]** Use repo-relative contentPath to avoid root fetches.
- **[FIX]** Fixed gh-pages path.

## v1.0.0

- First release.
