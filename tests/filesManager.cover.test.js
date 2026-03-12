import { describe, it, expect } from 'vitest'
import { slugify } from '../src/filesManager.js'

it('slugify from filesManager strips extensions and lowercases', () => {
  expect(slugify('Hello World')).toBe('hello-world')
  expect(slugify('SomePage.md')).toBe('somepage')
  expect(slugify('Another.HTML')).toBe('another')
  expect(slugify('Weird_chars!@#')).toBe('weirdchars')
})
import * as fm from '../src/filesManager.js'

describe('filesManager re-exports', () => {
  it('exports slugManager symbols', () => {
    // simple smoke test to ensure the re-export module is executed
    expect(typeof fm).toBe('object')
    // common symbol should exist
    expect(typeof fm.slugify).toBe('function')
  })
})
