/**
 * strip-comments.js — remove full-line `//` comments while preserving JSDoc blocks.
 *
 * Usage:
 *   node scripts/strip-comments.js
 */
const fs = require('fs')
const path = require('path')

function walk(dir) {
  const res = []
  for (const e of fs.readdirSync(dir)) {
    const full = path.join(dir, e)
    const st = fs.statSync(full)
    if (st.isDirectory()) res.push(...walk(full))
    else if (st.isFile() && full.endsWith('.js')) res.push(full)
  }
  return res
}

const src = path.join(__dirname, '..', 'src')
const files = walk(src)
let changed = 0
files.forEach(file => {
  const orig = fs.readFileSync(file, 'utf8')
  const lines = orig.split(/\r?\n/)
  const out = lines.filter(line => {
    // keep JSDoc blocks and non-full-line comments
    if (/^\s*\/\*/.test(line) || /^\s*\*\s*/.test(line)) return true
    // keep lines that are not full-line // comments
    if (!/^\s*\/\//.test(line)) return true
    // keep directive-like comments
    if (/^\s*\/\/\s*(eslint|global|istanbul|prettier|jshint)\b/i.test(line)) return true
    // keep comments that appear to be TODOs or FIXME (optional) — remove these per request
    // drop all other full-line // comments
    return false
  })
  const newText = out.join('\n')
  if (newText !== orig) {
    fs.writeFileSync(file, newText, 'utf8')
    changed++
    console.log('Updated', file)
  }
})
console.log('Files changed:', changed)
process.exit(0)
