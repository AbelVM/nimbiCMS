# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-16

### Changed

- Slug resolution no longer guesses filenames; unmapped slugs now return 404 unless matched by an explicit nav or discovered title slug.
- Improved caching and navigation handling (bfcache, scroll restore, and eager image marking heuristics) to reduce perceptible reloads and layout shifts.
- Search can now be built lazily (`searchIndexMode: 'lazy'`) and will fall back to a main-thread build if the worker is unavailable.
