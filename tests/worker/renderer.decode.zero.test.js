import { describe, it, expect } from 'vitest'
import { decodeHtmlEntitiesLocal } from '../../src/worker/renderer.js'

describe('decodeHtmlEntitiesLocal edge cases', () => {
  it('returns "0" string when passed numeric 0', () => {
    expect(decodeHtmlEntitiesLocal(0)).toBe('0')
  })
})
