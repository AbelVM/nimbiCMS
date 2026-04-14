import { test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { _setAllMd, setContentBase, setFetchMarkdown, buildSearchIndex, slugToMd, mdToSlug, _setSearchIndex } from '../src/slugManager.js'

function walkDir(dir) {
  const results = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const it of items) {
    const full = path.join(dir, it.name)
    if (it.isDirectory()) results.push(...walkDir(full))
    else if (it.isFile() && /\.md$/.test(it.name)) results.push(full)
  }
  return results
}

test('collect duplicate slug stats from docs', async () => {
  const root = path.resolve(process.cwd())
  const files = []
  // Walk entire workspace, excluding common bulky folders
  function walkAll(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const it of items) {
      if (it.name === 'node_modules' || it.name === '.git' || it.name === 'tmp' || it.name === 'tests') continue
      const full = path.join(dir, it.name)
      if (it.isDirectory()) walkAll(full)
      else if (it.isFile() && /\.md$/.test(it.name)) files.push(full)
    }
  }
  walkAll(root)

  const manifest = {}
  for (const f of files) {
    const rel = '/' + path.relative(root, f).replace(/\\\\/g, '/').replace(/^\/?/, '')
    manifest[rel] = fs.readFileSync(f, 'utf8')
  }

  _setAllMd(manifest)

  // Shim fetchMarkdown to resolve from manifest by matching trailing path
  setFetchMarkdown(async (p, base) => {
    const normalized = String(p ?? '').replace(/^\/+/, '')
    // Try exact matches
    const keys = Object.keys(manifest)
    for (const k of keys) {
      if (k.replace(/^\/+/, '') === normalized) return { raw: manifest[k] }
    }
    // Try suffix match
    for (const k of keys) {
      if (k.endsWith('/' + normalized) || k.endsWith(normalized)) return { raw: manifest[k] }
    }
    throw new Error('manifest missing: ' + p)
  })

  setContentBase()

  for (const depth of [1, 3]) {
    const idx = await buildSearchIndex(undefined, depth, undefined, undefined)
    const totalEntries = Array.isArray(idx) ? idx.length : 0
    const baseCounts = new Map()
    const uniquePaths = new Set()
    for (const it of idx || []) {
      if (!it || !it.slug) continue
      const base = String(it.slug).split('::')[0]
      baseCounts.set(base, (baseCounts.get(base) || 0) + 1)
      if (it.path) uniquePaths.add(it.path)
    }
    const uniqueBaseSlugs = Array.from(baseCounts.keys()).length
    const uniquePathsCount = uniquePaths.size
    const top = Array.from(baseCounts.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 40)
    console.log('indexDepth', depth)
    console.log('totalEntries', totalEntries)
    console.log('uniqueBaseSlugs', uniqueBaseSlugs)
    console.log('uniquePaths', uniquePathsCount)
    console.log('topDuplicates', JSON.stringify(top, null, 2))
    expect(totalEntries).toBeGreaterThan(0)
  }
}, 120000)
