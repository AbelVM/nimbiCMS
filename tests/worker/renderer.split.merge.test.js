import { describe, it, expect } from 'vitest'
import { handleWorkerMessageStream } from '../../src/worker/renderer.js'

describe('renderer split merging behavior', () => {
  it('merges small adjacent sections when combined length <= chunkSize', async () => {
    const chunks = []
    // three small sections that should be merged under chunkSize=80
    const md = '# A\n' + 'a'.repeat(20) + '\n# B\n' + 'b'.repeat(20) + '\n# C\n' + 'c'.repeat(20) + '\n'
    const out = await handleWorkerMessageStream({ type: 'stream', id: 'merge1', md, chunkSize: 80 }, (c) => chunks.push(c))
    const chunkMsgs = chunks.filter(c => c.type === 'chunk')
    // Expect merged result — fewer chunks than sections (3)
    expect(chunkMsgs.length).toBeLessThan(3)
    expect(out).toHaveProperty('type', 'done')
  })
})
