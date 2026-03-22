const fs = require('fs');
const path = require('path');
const root = path.join(__dirname,'..');
const inPath = path.join(root,'tmp','dead-code-triage.json');
if (!fs.existsSync(inPath)) { console.error('Input not found', inPath); process.exit(1); }
const data = JSON.parse(fs.readFileSync(inPath,'utf8'));
const byFile = {};
const statusCounts = {};
for (const it of data) {
  byFile[it.file] = byFile[it.file] || [];
  byFile[it.file].push(it);
  statusCounts[it.status] = (statusCounts[it.status]||0) + 1;
}
const files = Object.keys(byFile).map(f => ({file:f,count:byFile[f].length, items: byFile[f]})).sort((a,b)=>b.count-a.count);
console.log('Status counts:', statusCounts);
console.log('Top files by flagged symbols:');
files.slice(0,12).forEach(f=>{
  console.log('-', f.file.replace(root+'/', ''), ':', f.count);
});
// write grouped summary
const out = {
  statusCounts,
  files: files.map(f => ({
    file: f.file,
    count: f.count,
    names: f.items.map(i => ({ name: i.name, status: i.status, occurrencesInDef: i.occurrencesInDef, usagesOutside: i.usagesOutside }))
  }))
};
fs.writeFileSync(path.join(root,'tmp','dead-code-triage-summary.json'), JSON.stringify(out, null, 2));
console.log('Wrote tmp/dead-code-triage-summary.json');
