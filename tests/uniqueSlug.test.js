import { it, expect } from 'vitest'
import { uniqueSlug } from '../src/slugManager.js'

it('returns a non-duplicated slug when base already exists', () => {
  const existing = new Set(['foo', 'foo-2', 'foo-3'])
  expect(uniqueSlug('foo', existing)).toBe('foo-4')
  // unchanged when base not present
  expect(uniqueSlug('bar', existing)).toBe('bar')
})
