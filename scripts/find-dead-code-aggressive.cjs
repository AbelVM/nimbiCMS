const fs = require('fs');
const path = require('path');

function listFiles(dir){
  const out = [];
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const st = fs.statSync(p);
    if(st.isDirectory()) out.push(...listFiles(p));
    else if(/\.js$/.test(f) && !/\.d\.ts$/.test(f) && !/node_modules/.test(p)) out.push(p);
  }
  return out;
}

function extractSymbols(src){
  const syms = [];
  // exported names
  const reExportNames = /export\s*(?:const|let|var|function)?\s*(?:\{([^}]+)\}|default|(?:function\s+([A-Za-z0-9_$]+))|(?:const|let|var)\s+([A-Za-z0-9_$]+))/g;
  let m;
  while(m = reExportNames.exec(src)){
    if(m[1]){
      const parts = m[1].split(',').map(s=>s.split('as')[1]||s.split('as')[0]).map(s=>s.trim());
      parts.forEach(p => p && syms.push({name:p,exported:true}));
    } else if(m[2]) syms.push({name:m[2],exported:true});
    else if(m[3]) syms.push({name:m[3],exported:true});
  }
  // function declarations
  const reFunc = /(^|\n)\s*function\s+([A-Za-z0-9_$]+)\s*\(/g;
  while(m = reFunc.exec(src)) syms.push({name:m[2],type:'function'});
  // var/const arrow or function expressions
  const reVar = /(^|\n)\s*(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:\(?[\w\s,{}]*\)?\s*=>|function\s*\(|\()/g;
  while(m = reVar.exec(src)) syms.push({name:m[2],type:'varfn'});
  return syms;
}

const root = path.join(__dirname,'..','src');
const files = listFiles(root);
const all = [];
for(const file of files){
  const src = fs.readFileSync(file,'utf8');
  const syms = extractSymbols(src);
  if(syms.length) all.push({file,syms});
}

function countUsage(name, defFile){
  const re = new RegExp('\\b'+name+'\\b','g');
  let count = 0;
  for(const f of files){
    if(path.resolve(f) === path.resolve(defFile)) continue;
    try{ const s = fs.readFileSync(f,'utf8'); if(re.test(s)) count++; }catch(e){}
  }
  // also check tests for references
  try{
    const tests = listFiles(path.join(__dirname,'..','tests'))
    for(const t of tests){
      try{ const s = fs.readFileSync(t,'utf8'); if(re.test(s)) count++; }catch(e){}
    }
  }catch(e){}
  return count;
}

const candidates = [];
for(const f of all){
  for(const s of f.syms){
    if(!s.name) continue;
    if(s.name.startsWith('_')) continue; // likely private
    const usages = countUsage(s.name,f.file);
    if(usages === 0) candidates.push({file:f.file,name:s.name,exported:!!s.exported,type:s.type||null});
    else if(usages <= 1) candidates.push({file:f.file,name:s.name,exported:!!s.exported,type:s.type||null,usages});
  }
}

// Conservative filtering: keep only those that are non-exported or exported but only referenced in same file
const filtered = candidates.filter(c => {
  if(c.exported) return false; // don't remove exports aggressively
  return true;
});

if(!fs.existsSync(path.join(__dirname,'..','tmp'))) fs.mkdirSync(path.join(__dirname,'..','tmp'));
fs.writeFileSync(path.join(__dirname,'..','tmp','dead-code-aggressive.json'),JSON.stringify(filtered,null,2));
console.log('Found',filtered.length,'aggressive dead-code candidates. Wrote tmp/dead-code-aggressive.json');
if(filtered.length) console.log(filtered.slice(0,200));
