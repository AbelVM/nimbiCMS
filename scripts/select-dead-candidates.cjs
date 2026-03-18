/**
 * select-dead-candidates.cjs — pick a small set of likely-dead-code candidates for manual review.
 *
 * Usage:
 *   node scripts/select-dead-candidates.cjs
 */
const fs = require('fs');
const path = require('path');
const candidates = JSON.parse(fs.readFileSync(path.join(__dirname,'..','tmp','dead-code-aggressive.json'),'utf8'))||[];
const safe = [];
for(const c of candidates){
  if(safe.length>=5) break;
  try{
    const src = fs.readFileSync(c.file,'utf8');
    const re = new RegExp('\\b'+c.name+'\\b','g');
    const matches = (src.match(re) || []).length;
    if(matches<=1) safe.push(c);
  }catch(e){}
}
if(!fs.existsSync(path.join(__dirname,'..','tmp'))) fs.mkdirSync(path.join(__dirname,'..','tmp'));
fs.writeFileSync(path.join(__dirname,'..','tmp','dead-safe.json'),JSON.stringify(safe,null,2));
console.log('Selected',safe.length,'safe candidates. Wrote tmp/dead-safe.json');
if(safe.length) console.log(safe);