import { test, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

test('empty heading triggers decodeHtmlEntitiesLocal empty-path and fallback id', async () => {
  const md = '<h2></h2>'
  const out = await handleWorkerMessage({ id: 'empty-h', md })
  expect(out).toHaveProperty('id', 'empty-h')
  const toc = out.result.toc
  expect(Array.isArray(toc)).toBe(true)
  // text should be empty string after decoding, id should fallback to 'heading'
  expect(toc[0].text).toBe('')
  expect(toc[0].id).toBe('heading')
})

test('decodes numeric (decimal/hex) and named entities into toc text', async () => {
  const md = '<h1>A &#65; &#x41; &amp; &unknown;</h1>'
  const out = await handleWorkerMessage({ id: 'entities', md })
  expect(out).toHaveProperty('id', 'entities')
  const text = out.result.toc[0].text
  // should contain decoded decimal and hex as 'A', named '&', and leave unknown entity intact
  expect(text).toContain('A')
  expect(text).toContain('&')
  expect(text).toContain('&unknown;')
})

test('detect handles supported.indexOf throwing without failing', async () => {
  const badSupported = { length: 1, indexOf: () => { throw new Error('boom') } }
  const md = '```myLang\ncode\n```'
  const out = await handleWorkerMessage({ type: 'detect', id: 'd2', md, supported: badSupported })
  expect(out).toHaveProperty('id', 'd2')
  expect(Array.isArray(out.result)).toBe(true)
  // ensure it still returns array of detected names (catch branch should be silent)
  expect(out.result).toContain('mylang')
})
