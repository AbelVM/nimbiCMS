import { describe, it, expect } from 'vitest'
import { slugify } from '../src/slugManager.js'

it('slugify from slugManager strips extensions and lowercases', () => {
  expect(slugify('Hello World')).toBe('hello-world')
  expect(slugify('SomePage.md')).toBe('somepage')
  expect(slugify('Another.HTML')).toBe('another')
  expect(slugify('Weird_chars!@#')).toBe('weirdchars')
})
