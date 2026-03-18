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

function extractLocalFns(src){
  const res = [];
  // function declarations
  const reFunc = /(^|\n)\s*function\s+([A-Za-z0-9_$]+)\s*\(/g;
  let m;
  while(m = reFunc.exec(src)) res.push({name:m[2],type:'function'});
  // const/let/var assigned to arrow or function
  const reVar = /(^|\n)\s*(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:\(?[\w\s,{}]*\)?\s*=>|function\s*\(|\()/g;
  while(m = reVar.exec(src)) res.push({name:m[2],type:'varfn'});
  return res;
}

const root = path.join(__dirname,'..','src');
const files = listFiles(root);
const candidates = [];
for(const file of files){
  const src = fs.readFileSync(file,'utf8');
  const exps = extractLocalFns(src);
  if(!exps.length) continue;
  for(const e of exps){
    // skip "private" names
    if(e.name.startsWith('_')) continue;
    // skip names that are exported in file (exported later)
    const exportRegex = new RegExp('export\\s+(?:function|const|let|var|\{[^}]*\\b'+e.name+'\\b[^}]*\})');
    if(exportRegex.test(src)) continue;
    // skip if mentioned in type file index.d.ts
    try{
      const dts = fs.readFileSync(path.join(__dirname,'..','src','index.d.ts'),'utf8');
      if(new RegExp('\\b'+e.name+'\\b').test(dts)) continue;
    }catch(e){ }
    candidates.push({file,e});
  }
}

function countUsage(name, defFile){
  const re = new RegExp('\\b'+name+'\\b','g');
  let count = 0;
  for(const f of files){
    if(path.resolve(f) === path.resolve(defFile)) continue;
    try{ const s = fs.readFileSync(f,'utf8'); if(re.test(s)) count++; }catch(e){}
  }
  return count;
}

const unused = [];
for(const c of candidates){
  const name = c.e.name;
  const usages = countUsage(name,c.file);
  if(usages === 0) unused.push({file:c.file,name,type:c.e.type});
}

if(!fs.existsSync(path.join(__dirname,'..','tmp'))) fs.mkdirSync(path.join(__dirname,'..','tmp'));
fs.writeFileSync(path.join(__dirname,'..','tmp','dead-code.json'),JSON.stringify(unused,null,2));
console.log('Found',unused.length,'dead-code candidates. Wrote tmp/dead-code.json');
if(unused.length) console.log(unused.slice(0,200));
