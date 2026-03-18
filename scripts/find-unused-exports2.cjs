const fs = require('fs');
const path = require('path');

function listFiles(dir){
  const res = [];
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const stat = fs.statSync(p);
    if(stat.isDirectory()) res.push(...listFiles(p));
    else if(/\.js$/.test(f) || /\.ts$/.test(f) || /\.d\.ts$/.test(f)) res.push(p);
  }
  return res;
}

function extractExportedNames(src){
  const out = [];
  // export function name()
  let m;
  const reFunc = /export\s+function\s+([A-Za-z0-9_$]+)/g;
  while(m = reFunc.exec(src)) out.push(m[1]);
  const reVar = /export\s+(?:const|let|var)\s+([A-Za-z0-9_$]+)/g;
  while(m = reVar.exec(src)) out.push(m[1]);
  // export { a as b, c }
  const reBr = /export\s*\{([^}]+)\}/g;
  while(m = reBr.exec(src)){
    const parts = m[1].split(',').map(s=>s.trim()).filter(Boolean);
    for(const p of parts){
      const asm = p.match(/([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)/);
      if(asm) out.push(asm[2]); else out.push(p.replace(/\s*/g,''));
    }
  }
  // export default foo => exported as default (skip)
  return out;
}

const root = path.join(__dirname,'..','src');
const files = listFiles(root);
const publicFiles = [path.join(root,'index.d.ts'), path.join(root,'lib','index.js'), path.join(root,'nimbi-cms.js')];

const allExports = [];
for(const file of files){
  const src = fs.readFileSync(file,'utf8');
  const exps = extractExportedNames(src);
  if(exps.length) allExports.push({file,exps});
}

function countUsage(name, file){
  const re = new RegExp('\\b'+name+'\\b','g');
  let count = 0;
  for(const f of files){
    if(path.resolve(f) === path.resolve(file)) continue;
    const s = fs.readFileSync(f,'utf8');
    if(re.test(s)) count++;
  }
  // also check public typings and libs
  for(const pf of publicFiles){
    try{ const s = fs.readFileSync(pf,'utf8'); if(re.test(s)) count++; } catch(e){}
  }
  return count;
}

const unused = [];
for(const e of allExports){
  for(const name of e.exps){
    if(name === 'default') continue;
    const usages = countUsage(name,e.file);
    if(usages === 0) unused.push({file:e.file,name});
  }
}

if(!fs.existsSync(path.join(__dirname,'..','tmp'))) fs.mkdirSync(path.join(__dirname,'..','tmp'));
fs.writeFileSync(path.join(__dirname,'..','tmp','unused-exports-v2.json'),JSON.stringify(unused,null,2));
console.log('Found',unused.length,'unused export candidates (v2). Wrote tmp/unused-exports-v2.json');
if(unused.length>0) console.log(unused.slice(0,200));
else console.log('None');
