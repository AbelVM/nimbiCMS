import { describe, it, expect, vi } from 'vitest'

// Mock frontmatter to throw so we exercise renderer error handling
vi.mock('../../src/utils/frontmatter.js', () => ({
  parseFrontmatter: () => { throw new Error('boom') }
}))

import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('renderer error handling', () => {
  it('returns error when parseFrontmatter throws', async () => {
    const res = await handleWorkerMessage({ id: 'err1', md: 'some md' })
    expect(res).toHaveProperty('id', 'err1')
    expect(res).toHaveProperty('error')
+    expect(typeof res.error).toBe('string')
  })
})
