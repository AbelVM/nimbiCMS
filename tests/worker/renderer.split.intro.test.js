import { describe, it, expect } from 'vitest'
import { handleWorkerMessageStream } from '../../src/worker/renderer.js'

describe('renderer _splitIntoSections intro-before-heading behavior', () => {
  it('preserves intro text as first section when content starts before first heading', async () => {
    const chunks = []
    const md = 'Intro line here\n\n# First\n' + 'a'.repeat(60) + '\n# Second\n' + 'b'.repeat(60) + '\n'
    const out = await handleWorkerMessageStream({ type: 'stream', id: 's-intro', md, chunkSize: 50 }, (c) => chunks.push(c))
    const chunkMsgs = chunks.filter(c => c.type === 'chunk')
    expect(chunkMsgs.length).toBeGreaterThanOrEqual(2)
    // The first emitted chunk should contain the intro paragraph
    expect(chunkMsgs[0].html).toContain('Intro line here')
    expect(out).toHaveProperty('type', 'done')
  })
})
