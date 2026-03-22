#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')
const SRC = path.join(ROOT, 'src')

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue
      files.push(...walk(full))
    } else if (stat.isFile() && full.endsWith('.js')) {
      files.push(full)
    }
  }
  return files
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseImportClause(clause) {
  const names = []
  if (!clause || !clause.trim()) return names
  clause = clause.trim()
  // handle patterns like: default, { a as b, c }, * as ns
  // extract brace content
  const brace = clause.match(/\{([^}]+)\}/)
  if (brace) {
    const inner = brace[1]
    inner.split(',').forEach(p => {
      const part = p.trim()
      if (!part) return
      const asParts = part.split(/\s+as\s+/)
      const local = (asParts[1] || asParts[0]).trim()
      names.push(local)
    })
  }
  // default import before brace
  const beforeBrace = clause.split('{')[0].trim().replace(/,$/, '')
  if (beforeBrace) {
    // could be "default", or "default, * as ns", or "* as ns"
    const starAs = beforeBrace.match(/\*\s+as\s+([A-Za-z0-9_$]+)/)
    if (starAs) names.push(starAs[1])
    else {
      const parts = beforeBrace.split(',').map(s => s.trim()).filter(Boolean)
      for (const p of parts) {
        if (!p) continue
        if (p.startsWith('{')) continue
        const asParts = p.split(/\s+as\s+/)
        names.push((asParts[1] || asParts[0]).trim())
      }
    }
  }
  return names
}

const files = walk(SRC)

const importLineRe = /import\s+([\s\S]*?)\s+from\s+['"](.+?)['"]/g
const importSideEffectRe = /^\s*import\s+['"](.+?)['"];?\s*$/gm
const requireAssignRe = /(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*require\(\s*['"](.+?)['"]\s*\)/g
const requireDestructRe = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*require\(\s*['"](.+?)['"]\s*\)/g

const unusedReport = []

for (const file of files) {
  const rel = path.relative(ROOT, file)
  const src = fs.readFileSync(file, 'utf8')
  const imports = []

  // collect static imports
  for (const m of src.matchAll(importLineRe)) {
    const clause = m[1].trim()
    const spec = m[2]
    const locals = parseImportClause(clause)
    if (locals.length === 0) continue
    for (const local of locals) imports.push({ local, spec, type: 'import' })
  }

  // collect require destructures
  for (const m of src.matchAll(requireDestructRe)) {
    const inner = m[1]
    const spec = m[2]
    inner.split(',').map(s => s.trim()).filter(Boolean).forEach(p => {
      const asParts = p.split(/\s*:\s*/).map(s => s.trim())
      const local = (asParts[1] || asParts[0]).trim()
      if (local) imports.push({ local, spec, type: 'require' })
    })
  }

  // collect require assignments
  for (const m of src.matchAll(requireAssignRe)) {
    const local = m[1]
    const spec = m[2]
    imports.push({ local, spec, type: 'require' })
  }

  if (imports.length === 0) continue

  // remove import/require lines so we don't count the declaration themselves
  let srcNoDecls = src.replace(importLineRe, '')
  srcNoDecls = srcNoDecls.replace(importSideEffectRe, '')
  srcNoDecls = srcNoDecls.replace(requireDestructRe, '')
  srcNoDecls = srcNoDecls.replace(requireAssignRe, '')

  const unusedInFile = []
  for (const imp of imports) {
    const name = imp.local
    let used = false
    if (!name) { continue }
    // namespace-ish detection: check for name. or name[
    const nsDotRe = new RegExp('\\b' + escapeRe(name) + '\\s*\\.')
    const nsIndexRe = new RegExp('\\b' + escapeRe(name) + '\\s*\\[')
    const wordRe = new RegExp('\\b' + escapeRe(name) + '\\b')

    if (nsDotRe.test(srcNoDecls) || nsIndexRe.test(srcNoDecls)) used = true
    else if (wordRe.test(srcNoDecls)) used = true

    if (!used) unusedInFile.push(imp)
  }

  if (unusedInFile.length) {
    unusedReport.push({ file: rel, unused: unusedInFile })
  }
}

const report = { root: ROOT, scannedFiles: files.length, unusedImports: unusedReport }
console.log(JSON.stringify(report, null, 2))
