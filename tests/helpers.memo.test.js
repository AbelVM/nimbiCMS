import { describe, it, expect } from 'vitest'
import { normalizePath } from '../src/utils/helpers.js'

describe('helpers memoization', () => {
  it('normalizePath returns consistent normalized values', () => {
    const v1 = normalizePath('../some/path')
    const v2 = normalizePath('../some/path')
    expect(v1).toBe('some/path')
    expect(v2).toBe('some/path')
  })
})
