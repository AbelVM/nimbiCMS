import { it, expect } from 'vitest'
import { slugify } from '../src/slugManager.js'

it('sanitizes text for slug generation (collapses dashes, removes unsafe chars)', () => {
  expect(slugify('Foo & Bar')).toBe('foo-bar')
  expect(slugify('Hello   World')).toBe('hello-world')
  expect(slugify('A < B > C')).toBe('a-b-c')
  expect(slugify('ends-with-')).toBe('ends-with')
  expect(slugify('--starts--with--')).toBe('starts-with')
})
