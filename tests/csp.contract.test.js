import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { applyCspNonce, setCspNonce } from '../src/utils/helpers.js'

describe('CSP contract', () => {
  it('documents required runtime directives and applies the host nonce', () => {
    const readme = fs.readFileSync(path.resolve('README.md'), 'utf8')
    expect(readme).toContain('connect-src')
    expect(readme).toContain('worker-src blob:')
    expect(readme).toContain('style-src')

    const element = document.createElement('style')
    setCspNonce('test-nonce')
    applyCspNonce(element)
    expect(element.getAttribute('nonce')).toBe('test-nonce')
    setCspNonce(null)
  })
})