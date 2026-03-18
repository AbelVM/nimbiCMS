/**
 * find-unused-functions.cjs — heuristically detect unused local functions.
 *
 * Usage:
 *   node scripts/find-unused-functions.cjs > tmp/unused-fns.json
 */
const fs = require('fs')
const path = require('path')

function walk(dir){
  const res = []
  for(const e of fs.readdirSync(dir)){
    const full = path.join(dir,e)
    const st = fs.statSync(full)
    if(st.isDirectory()) res.push(...walk(full))
    else if(st.isFile() && full.endsWith('.js')) res.push(full)
  }
  return res
}

const src = path.join(__dirname,'..','src')
const files = walk(src)
const textByFile = {}
files.forEach(f=> textByFile[f]=fs.readFileSync(f,'utf8'))

const candidates = []

const funcPatterns = [
  /(^|\n)\s*function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g,
  /(^|\n)\s*(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*function\s*\(/g,
  /(^|\n)\s*(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*\(?.*?\)?\s*=>/g
]

for(const [file,txt] of Object.entries(textByFile)){
  for(const pat of funcPatterns){
    let m;
    while((m=pat.exec(txt))){
      const name = m[2]
      if(!name) continue
      // skip exported functions
      const before = txt.slice(Math.max(0,m.index-40), m.index)
      if(/export\s+$/.test(before) || /export\s+function/.test(txt)) {
        // crude: if file contains 'export function' treat exported
      }
      // crude detection: skip if 'export function NAME' or 'export const NAME'
      const exportRegex = new RegExp('export\\s+(?:function|const|let|var)\\s+'+name+'\\b')
      if(exportRegex.test(txt)) continue
      // record candidate
      candidates.push({file,name,index:m.index})
    }
  }
}

// Now check references
const results = []
for(const c of candidates){
  const name = c.name
  let count = 0
  for(const [file,txt] of Object.entries(textByFile)){
    const re = new RegExp('\\b'+name+'\\b','g')
    let m; while((m=re.exec(txt))){
      count++
      if(count>1) break
    }
    if(count>1) break
  }
  if(count<=1){
    results.push(c)
  }
}

if(results.length===0){
  console.log('No obvious unused non-exported functions found')
  process.exit(0)
}

console.log('Candidates (non-exported functions referenced only at definition):')
results.forEach(r=> console.log(r.file+': '+r.name))

// write to file for review
fs.writeFileSync(path.join(__dirname,'..','tmp','unused-functions.json'), JSON.stringify(results,null,2))
console.log('\nWrote tmp/unused-functions.json with details')
process.exit(0)
