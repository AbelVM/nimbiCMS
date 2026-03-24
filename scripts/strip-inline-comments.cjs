#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function stripComments(content) {
  const lines = content.split(/\r?\n/)
  const out = []
  let inBlock = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!inBlock) {
      const mStart = line.match(/^\s*\/\*(?!\*)/) // block comment start but not /**
      const mLineComment = line.match(/^\s*\/\//)
      if (mStart) {
        inBlock = true
        if (line.indexOf('*/') !== -1) {
          inBlock = false
        }
        continue
      } else if (mLineComment) {
        continue
      } else {
        out.push(line)
      }
    } else {
      if (line.indexOf('*/') !== -1) {
        inBlock = false
      }
      continue
    }
  }

  const collapsed = []
  let blankCount = 0
  for (const l of out) {
    if (/^\s*$/.test(l)) {
      blankCount += 1
      if (blankCount <= 2) collapsed.push(l)
    } else {
      blankCount = 0
      collapsed.push(l)
    }
  }
  return collapsed.join('\n') + '\n'
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: strip-inline-comments.cjs <input-file> <output-file>')
    process.exit(2)
  }
  const input = args[0]
  const output = args[1]
  try {
    const src = fs.readFileSync(input, 'utf8')
    const cleaned = stripComments(src)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.writeFileSync(output, cleaned, 'utf8')
    console.log('WROTE', output)
  } catch (e) {
    console.error('ERROR', e && e.message)
    process.exit(1)
  }
}

if (require.main === module) main()
