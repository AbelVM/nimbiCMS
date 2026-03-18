#!/usr/bin/env node
// Detect circular imports among local relative imports in the project `src/` directory.
// Usage: node scripts/find-circular-imports.cjs

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const scanDir = path.join(root, 'src');
const exts = ['.js', '.mjs', '.cjs'];
const skipDirs = ['node_modules', '.git', 'coverage', 'dist', 'tmp'];

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (skipDirs.includes(ent.name)) continue;
      out.push(...walk(p));
    } else {
      if (exts.includes(path.extname(ent.name))) out.push(p);
    }
  }
  return out;
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return '' }
}

function resolveImport(fromFile, spec) {
  // only consider relative imports
  if (!spec.startsWith('./') && !spec.startsWith('../')) return null;
  const basedir = path.dirname(fromFile);
  let resolved = path.resolve(basedir, spec);
  // try with extensions and index
  const candidates = [];
  for (const ext of ['', ...exts]) candidates.push(resolved + ext);
  for (const ext of exts) candidates.push(path.join(resolved, 'index' + ext));
  for (const c of candidates) {
    if (fs.existsSync(c)) return path.relative(root, c);
  }
  return null; // unresolved local import (maybe built by bundler)
}

function extractImports(src) {
  const imports = new Set();
  // matches: import ... from '...'; import '...'; export ... from '...'
  const re = /(?:import|export)\s+(?:[^'"]*from\s+)?["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    imports.add(m[1]);
  }
  // also handle dynamic import('...')
  const re2 = /import\(\s*["']([^"']+)["']\s*\)/g;
  while ((m = re2.exec(src)) !== null) imports.add(m[1]);
  return Array.from(imports);
}

const files = walk(scanDir).map(f => path.relative(root, f));
const graph = Object.create(null);
for (const f of files) graph[f] = new Set();

for (const f of files) {
  const abs = path.join(root, f);
  const src = readFileSafe(abs);
  const imports = extractImports(src);
  for (const imp of imports) {
    const resolved = resolveImport(abs, imp);
    if (resolved && graph[resolved] !== undefined) {
      graph[f].add(resolved);
    }
  }
}

// detect cycles via DFS
const visited = new Set();
const stack = [];
const cycles = new Set();

function canonicalCycle(arr) {
  // rotate so smallest lexicographic element is first, stringify
  let best = null;
  for (let i = 0; i < arr.length; i++) {
    const rot = arr.slice(i).concat(arr.slice(0, i));
    const s = rot.join('->');
    if (best === null || s < best) best = s;
  }
  return best;
}

function dfs(node) {
  if (stack.includes(node)) {
    const idx = stack.indexOf(node);
    const cyc = stack.slice(idx).concat(node);
    cycles.add(canonicalCycle(cyc));
    return;
  }
  if (visited.has(node)) return;
  stack.push(node);
  visited.add(node);
  for (const to of graph[node]) dfs(to);
  stack.pop();
}

for (const n of Object.keys(graph)) dfs(n);

if (cycles.size === 0) {
  console.log('No circular imports detected in src/');
  process.exit(0);
}

console.log('Circular import cycles found:');
for (const c of Array.from(cycles).sort()) {
  console.log('- ', c.split('->').join(' -> '));
}
process.exit(0);
