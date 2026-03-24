import { describe, it, expect, beforeEach } from 'vitest'
import * as SM from '../src/slugManager.js'

describe('repro duplicate slug', () => {
  beforeEach(() => {
    try { SM.slugToMd.clear() } catch (_) {}
    try { SM.mdToSlug.clear() } catch (_) {}
    try { SM.allMarkdownPaths.length = 0 } catch (_) {}
    try { SM.allMarkdownPathsSet.clear() } catch (_) {}
  })

  it('stores unique slugs for two readme pages', () => {
    const p1 = 'docs/readme.md'
    const p2 = 'docs/nimbi-cms/readme.md'
    const baseSlug = 'readme'

    // store first
    SM._storeSlugMapping(baseSlug, p1)
    // store second with same base
    SM._storeSlugMapping(baseSlug, p2)

    const s1 = SM.mdToSlug.get(p1)
    const s2 = SM.mdToSlug.get(p2)

    expect(s1).toBeDefined()
    expect(s2).toBeDefined()
    // They should not be the same slug for different paths
    expect(s1).not.toBe(s2)

    // And slugToMd should map back correctly
    expect(SM.slugToMd.get(s1)).toBe(p1)
    expect(SM.slugToMd.get(s2)).toBe(p2)
  })

  it('setContentBase generates unique slugs from _allMd with identical H1s', () => {
    const p1 = 'docs/readme.md'
    const p2 = 'docs/nimbi-cms/readme.md'
    // Provide a fake _allMd mapping as if produced by an indexer
    const mdMap = {}
    mdMap[p1] = '# Readme\n\nSome content'
    mdMap[p2] = '# Readme\n\nOther content'

    SM._setAllMd(mdMap)
    // Rebuild content base mappings
    SM.setContentBase('')

    // Debug output for investigation
    // eslint-disable-next-line no-console
    console.log('slugToMd entries:', Array.from(SM.slugToMd.entries()))
    // eslint-disable-next-line no-console
    console.log('mdToSlug entries:', Array.from(SM.mdToSlug.entries()))

    // The runtime normalizes stored relative paths based on a common
    // prefix derived from the keys in `_allMd`. For our inputs the
    // stored rel paths will be 'readme.md' and 'nimbi-cms/readme.md'.
    // Assert the slug map points to two distinct rel paths and that
    // both slugs are present.
    const entries = Array.from(SM.slugToMd.entries())
    const keys = entries.map(e => e[0])
    const vals = entries.map(e => e[1])
    // Expect two distinct slugs created for the identical H1s
    expect(keys.length).toBeGreaterThanOrEqual(2)
    expect(vals).toContain('readme.md')
    expect(vals).toContain('nimbi-cms/readme.md')
  })
})
