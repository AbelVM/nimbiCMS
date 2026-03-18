const fs = require('fs');
const path = require('path');

function listFiles(dir){
  const res = [];
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir,f);
    const stat = fs.statSync(p);
    if(stat.isDirectory()) res.push(...listFiles(p));
    else if(/\.js$/.test(f) || /\.ts$/.test(f)) res.push(p);
  }
  return res;
}

function extractExports(src){
  const exports = [];
  const lines = src.split(/\r?\n/);
  for(const line of lines){
    let m;
    if(m = line.match(/export\s+function\s+([A-Za-z0-9_$]+)/)) exports.push(m[1]);
    else if(m = line.match(/export\s+(?:const|let|var)\s+([A-Za-z0-9_$]+)/)) exports.push(m[1]);
    else if(m = line.match(/export\s+\{\s*([^}]+)\}/)){
      const names = m[1].split(',').map(s=>s.split('as')[0].trim()).filter(Boolean);
      exports.push(...names);
    }
    else if(m = line.match(/export\s+default\s+function\s+([A-Za-z0-9_$]+)/)) exports.push(m[1]);
    else if(m = line.match(/export\s+default\s+([A-Za-z0-9_$]+)/)) exports.push('default');
  }
  return exports;
}

const root = path.join(__dirname,'..','src');
const files = listFiles(root);
const allExports = [];
for(const file of files){
  const src = fs.readFileSync(file,'utf8');
  const exps = extractExports(src);
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
  return count;
}

const unused = [];
for(const e of allExports){
  for(const name of e.exps){
    // skip generic exports like default and types
    if(name === 'default') continue;
    if(name.match(/^[A-Z][A-Za-z0-9_]+$/) && e.file.endsWith('.d.ts')) continue;
    const usages = countUsage(name,e.file);
    if(usages === 0) unused.push({file:e.file,name});
  }
}

fs.writeFileSync(path.join(__dirname,'..','tmp','unused-exports.json'),JSON.stringify(unused,null,2));
console.log('Found',unused.length,'unused export candidates. Wrote tmp/unused-exports.json');
if(unused.length>0) console.log(unused.slice(0,50));
else console.log('None');
