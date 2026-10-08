const fs = require('fs')
const zlib = require('zlib')

const budgets = {
  'dist/nimbi-cms.es.js': { parsed: 1200000, gzip: 320000, brotli: 220000 },
  'dist/nimbi-cms.cjs.js': { parsed: 1100000, gzip: 320000, brotli: 220000 },
  'dist/nimbi-cms.js': { parsed: 1500000, gzip: 350000, brotli: 260000 },
}

let failed = false
for (const [file, limits] of Object.entries(budgets)) {
  if (!fs.existsSync(file)) {
    console.error(`Missing bundle: ${file}`)
    failed = true
    continue
  }
  const source = fs.readFileSync(file)
  const sizes = {
    parsed: source.length,
    gzip: zlib.gzipSync(source, { level: 9 }).length,
    brotli: zlib.brotliCompressSync(source).length,
  }
  console.log(`${file}: ${sizes.parsed} parsed, ${sizes.gzip} gzip, ${sizes.brotli} brotli`)
  for (const [kind, value] of Object.entries(sizes)) {
    if (value > limits[kind]) {
      console.error(`  ${kind} budget exceeded: ${value} > ${limits[kind]}`)
      failed = true
    }
  }
}

if (failed) process.exit(1)
