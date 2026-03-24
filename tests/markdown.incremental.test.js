import { it, expect } from 'vitest'
import * as md from '../src/markdown.js'
import { getSharedParser } from '../src/utils/sharedDomParser.js'

it('streamParseMarkdown produces combined content equivalent to full parse', async () => {
  // build a synthetic large markdown document with many headings
  const sections = Array.from({ length: 20 }).map((_, i) => `## Section ${i}\n\n${'Lorem ipsum dolor sit amet. '.repeat(80)}\n`)
  const longMd = '# Document Title\n\n' + sections.join('\n')

  const chunks = []
  await md.streamParseMarkdown(longMd, (htmlChunk, info) => {
    chunks.push({ html: htmlChunk, info })
  }, { chunkSize: 1024 })

  const combinedHtml = chunks.map(c => c.html).join('')
  const full = await md.parseMarkdownToHtml(longMd)

  const parser = getSharedParser()
  expect(parser).toBeTruthy()
  const docCombined = parser.parseFromString(combinedHtml, 'text/html')
  const docFull = parser.parseFromString(full.html, 'text/html')

  const norm = (n) => (n && n.textContent || '').replace(/\s+/g, ' ').trim()
  expect(norm(docCombined)).toBe(norm(docFull))
  // ensure multiple chunks were emitted
  expect(chunks.length).toBeGreaterThan(1)
})
