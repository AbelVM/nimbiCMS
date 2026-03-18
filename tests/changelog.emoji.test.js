import { test, expect } from 'vitest'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { parseMarkdownToHtml } from '../src/markdown.js'
import emojimap from '../src/utils/emojiMap.js'

test('assets/github.md emoji shortcodes are replaced', async () => {
  const mdPath = join(process.cwd(), 'assets', 'github.md')
  const md = await readFile(mdPath, 'utf8')
  // Verify replacement at the raw markdown level using local map
  const replaced = md.replace(/:([^:\s]+):/g, (m, name) => emojimap[name] || m)
  expect(replaced).toContain('😅')

  // And through the markdown parser pipeline
  const res = await parseMarkdownToHtml(md)
  expect(res && res.html).toBeTruthy()
  expect(res.html).toContain('😅')
  expect(res.html).not.toContain(':sweat_smile:')
})
