import { describe, it, expect, vi } from 'vitest'

// Make parseFrontmatter throw to exercise stream error handling
vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: () => { throw new Error('boom stream') } }), { virtual: true })

import { handleWorkerMessageStream } from '../../src/worker/renderer.js'

describe('renderer stream error handling', () => {
  it('returns error object when parseFrontmatter throws in stream mode', async () => {
    const chunks = []
    const out = await handleWorkerMessageStream({ type: 'stream', id: 's-err', md: 'some md' }, (c) => chunks.push(c))
    // on error the returned object should contain `error`
    expect(out).toHaveProperty('error')
    expect(typeof out.error).toBe('string')
    // onChunk should have been called with an error object as well
    expect(chunks.some(c => c && c.error)).toBeTruthy()
  })
})
