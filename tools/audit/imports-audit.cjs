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

function stripQuery(spec) {
  const q = spec.indexOf('?')
  if (q === -1) return spec
  return spec.slice(0, q)
}

function resolveSpecifier(importer, spec) {
  if (!spec.startsWith('.')) return null
  spec = stripQuery(spec)
  const base = path.resolve(path.dirname(importer), spec)
  const candidates = [base, base + '.js', path.join(base, 'index.js')]
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.relative(ROOT, c)
  }
  // return best-effort relative path
  return path.relative(ROOT, base)
}

const files = walk(SRC)

const importMap = {} // file -> [{spec, clause, resolved}]
const exportMap = {} // file -> Set(exports)
const namespaceImport = {} // target -> true if any namespace import
const importedNamesByTarget = {} // target -> Set(names)

const importLineRegex = /import\s+([\s\S]*?)\s+from\s+['\"](.+?)['\"]/g
const dynamicImportRegex = /import\(\s*['\"](.+?)['\"]\s*\)/g
const requireRegex = /require\(\s*['\"](.+?)['\"]\s*\)/g
const exportFnRegex = /export\s+(?:async\s+)?function\s+([A-Za-z0-9_$]+)/g
const exportVarRegex = /export\s+(?:const|let|var)\s+([A-Za-z0-9_$]+)/g
const exportClassRegex = /export\s+class\s+([A-Za-z0-9_$]+)/g
const exportBraceRegex = /export\s*{\s*([^}]+)\s*}(?:\s*from\s*['\"](.+?)['\"])?/g
const exportDefaultRegex = /export\s+default\s+([A-Za-z0-9_$]+)/g
const exportAllFromRegex = /export\s+\*\s+from\s+['\"](.+?)['\"]/g

for (const f of files) {
  const rel = path.relative(ROOT, f)
  const src = fs.readFileSync(f, 'utf8')
  importMap[rel] = []
  exportMap[rel] = new Set()

  let m
  while ((m = importLineRegex.exec(src)) !== null) {
    const clause = m[1].trim()
    const spec = m[2]
    const resolved = resolveSpecifier(f, spec)
    importMap[rel].push({ clause, spec, resolved })
    if (resolved) {
      // parse clause
      if (clause.startsWith('{')) {
        const inner = clause.replace(/^\{/, '').replace(/\}$/, '')
        const parts = inner.split(',').map(s => s.trim()).filter(Boolean)
        for (const p of parts) {
          const name = p.split(/\s+as\s+/)[0].trim()
          importedNamesByTarget[resolved] = importedNamesByTarget[resolved] || new Set()
          importedNamesByTarget[resolved].add(name)
        }
      } else if (/\*\s+as\s+/.test(clause)) {
        namespaceImport[resolved] = true
      } else if (clause) {
        // default or named without braces (e.g., foo, Foo as Bar)
        const parts = clause.split(',').map(s => s.trim())
        for (const p of parts) {
          const name = p.split(/\s+as\s+/)[0].trim()
          importedNamesByTarget[resolved] = importedNamesByTarget[resolved] || new Set()
          importedNamesByTarget[resolved].add(name)
        }
      }
    }
  }

  while ((m = dynamicImportRegex.exec(src)) !== null) {
    const spec = m[1]
    const resolved = resolveSpecifier(f, spec)
    importMap[rel].push({ clause: 'dynamic', spec, resolved })
    if (resolved) namespaceImport[resolved] = true
  }

  while ((m = requireRegex.exec(src)) !== null) {
    const spec = m[1]
    const resolved = resolveSpecifier(f, spec)
    importMap[rel].push({ clause: 'require', spec, resolved })
    if (resolved) namespaceImport[resolved] = true
  }

  while ((m = exportFnRegex.exec(src)) !== null) exportMap[rel].add(m[1])
  while ((m = exportVarRegex.exec(src)) !== null) exportMap[rel].add(m[1])
  while ((m = exportClassRegex.exec(src)) !== null) exportMap[rel].add(m[1])
  while ((m = exportDefaultRegex.exec(src)) !== null) exportMap[rel].add('default')

  while ((m = exportBraceRegex.exec(src)) !== null) {
    const names = m[1]
    const fromSpec = m[2]
    const parts = names.split(',').map(s => s.trim())
    for (const p of parts) {
      const name = p.split(/\s+as\s+/)[0].trim()
      exportMap[rel].add(name)
    }
    if (fromSpec) {
      // re-export from another module: mark that target as having imported names
      const resolved = resolveSpecifier(f, fromSpec)
      if (resolved) {
        importedNamesByTarget[resolved] = importedNamesByTarget[resolved] || new Set()
        for (const p of parts) {
          const name = p.split(/\s+as\s+/)[0].trim()
          importedNamesByTarget[resolved].add(name)
        }
      }
    }
  }

  while ((m = exportAllFromRegex.exec(src)) !== null) {
    const spec = m[1]
    const resolved = resolveSpecifier(f, spec)
    if (resolved) {
      // mark as namespace usage
      namespaceImport[resolved] = true
    }
  }
}

// build adjacency
const adj = {}
for (const f of Object.keys(importMap)) {
  adj[f] = new Set()
  for (const im of importMap[f]) {
    if (im.resolved) adj[f].add(im.resolved)
  }
}

// detect cycles (simple DFS)
const cycles = []
const visited = new Set()
function dfs(node, stack, onstack) {
  if (onstack.has(node)) {
    const idx = stack.indexOf(node)
    cycles.push(stack.slice(idx).concat(node))
    return
  }
  if (visited.has(node)) return
  visited.add(node)
  stack.push(node)
  onstack.add(node)
  for (const nb of adj[node] || []) {
    if (adj[nb]) dfs(nb, stack, onstack)
  }
  stack.pop()
  onstack.delete(node)
}
for (const n of Object.keys(adj)) {
  if (!visited.has(n)) dfs(n, [], new Set())
}

// detect potentially unused exports
const potentialUnused = []
for (const f of Object.keys(exportMap)) {
  for (const e of exportMap[f]) {
    // if the module has any namespace import or imported name that matches e, consider used
    const importedSet = importedNamesByTarget[f]
    const isUsed = (importedSet && importedSet.has(e)) || namespaceImport[f]
    if (!isUsed) {
      // try a naive grep across files for direct references (word boundary)
      const re = new RegExp("\\b" + e.replace(/[$^\\.*+?()|[\]{}\\]/g, '\\$&') + "\\b")
      let found = false
      for (const other of files) {
        const relOther = path.relative(ROOT, other)
        if (relOther === f) continue
        const src = fs.readFileSync(other, 'utf8')
        if (re.test(src)) { found = true; break }
      }
      if (!found) {
        potentialUnused.push({ file: f, export: e })
      }
    }
  }
}

const report = {
  root: ROOT,
  scannedFiles: files.length,
  totalExports: Object.values(exportMap).reduce((s, set) => s + set.size, 0),
  totalImportStatements: Object.values(importMap).reduce((s, arr) => s + arr.length, 0),
  cycles,
  potentialUnused
}

console.log(JSON.stringify(report, null, 2))
