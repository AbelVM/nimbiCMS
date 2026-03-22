const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const srcDir = path.join(root, 'src')
const outDir = path.join(root, 'tmp', 'inline-comments')
const outOrig = path.join(outDir, 'orig')
const outMod = path.join(outDir, 'modified')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
if (!fs.existsSync(outOrig)) fs.mkdirSync(outOrig, { recursive: true })
if (!fs.existsSync(outMod)) fs.mkdirSync(outMod, { recursive: true })

function isSkip(trimLower) {
  // keep lines that are likely tooling/license/annotation comments
  if (!trimLower) return false
  return (
    trimLower.includes('eslint') ||
    trimLower.includes('istanbul') ||
    trimLower.includes('global') ||
    trimLower.includes('@license') ||
    trimLower.includes('copyright') ||
    trimLower.includes('license') ||
    trimLower.includes('@preserve') ||
    trimLower.includes('jshint') ||
    trimLower.startsWith('// #')
  )
}

function processFile(absPath) {
  const rel = path.relative(root, absPath).replace(/\\\\/g, '/')
  const src = fs.readFileSync(absPath, 'utf8')
  const lines = src.split(/\n/)
  const outLines = []
  let removed = 0
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const m = line.match(/^(\s*)(.*)$/)
    const indent = m ? m[1] : ''
    const content = m ? m[2] : line
    const trimmed = content.trim()
    const lower = trimmed.toLowerCase()

    if (trimmed.startsWith('//')) {
      if (isSkip(lower)) {
        outLines.push(line)
      } else {
        removed++
        // drop this full-line comment
      }
      i++
      continue
    }

    if (trimmed.startsWith('/*') && !trimmed.startsWith('/**')) {
      if (isSkip(lower)) {
        outLines.push(line)
        i++
        continue
      }
      // remove a block comment that starts here until the closing */
      let j = i
      let found = false
      while (j < lines.length) {
        if (lines[j].includes('*/')) { found = true; break }
        j++
      }
      const removedLines = (j - i + (found ? 1 : 0))
      removed += removedLines
      i = j + 1
      continue
    }

    outLines.push(line)
    i++
  }

  const modified = outLines.join('\n')
  const changed = removed > 0 && modified !== src
  if (changed) {
    const safeRel = rel.replace(/\//g, '__')
    fs.writeFileSync(path.join(outOrig, safeRel), src, 'utf8')
    fs.writeFileSync(path.join(outMod, safeRel), modified, 'utf8')
  }
  return { file: absPath, rel, removed, changed }
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const abs = path.join(dir, e.name)
    if (e.isDirectory()) walk(abs, cb)
    else if (e.isFile() && e.name.endsWith('.js')) cb(abs)
  }
}

const results = []
walk(srcDir, (abs) => {
  try { results.push(processFile(abs)) } catch (err) { console.error('error', abs, err.message) }
})
const report = results.filter(r => r.changed).map(r => ({ file: r.file, rel: r.rel, removed: r.removed }))
fs.writeFileSync(path.join(outDir, 'inline-comments-report.json'), JSON.stringify(report, null, 2), 'utf8')
console.log('Scan complete. Files with removable comments:', report.length)
console.log('Report saved to tmp/inline-comments/inline-comments-report.json')
