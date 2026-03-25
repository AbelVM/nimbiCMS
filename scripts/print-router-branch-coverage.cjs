const fs = require('fs')
const path = 'coverage/coverage-final.json'
if (!fs.existsSync(path)) { console.error('coverage-final.json not found'); process.exit(1) }
const c = JSON.parse(fs.readFileSync(path,'utf8'))
const key = Object.keys(c).find(k => k.endsWith('/src/router.js') || k.endsWith('src/router.js') || k.endsWith('\\src\\router.js'))
if (!key) { console.error('router.js not found in coverage'); process.exit(1) }
const d = c[key]
const branchMap = d.branchMap || {}
const b = d.b || {}
let total = 0, covered = 0
Object.keys(branchMap).forEach(id => {
  const counts = b[id]
  const len = counts ? counts.length : (branchMap[id].locations ? branchMap[id].locations.length : 0)
  for (let i = 0; i < len; i++) {
    total++
    if (counts && counts[i] > 0) covered++
  }
})
if (total === 0) { console.log('no branch data for router.js') } else {
  console.log('router branch coverage:', (covered/total*100).toFixed(2)+'%','(',covered,'/',total,')')
}
