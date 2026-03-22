const fs = require('fs');
const path = require('path');
const root = path.join(__dirname,'..');
const triagePath = path.join(root,'tmp','dead-code-triage-summary.json');
const outDir = path.join(root,'tmp');
if (!fs.existsSync(triagePath)) { console.error('triage summary not found:', triagePath); process.exit(1); }
const tri = JSON.parse(fs.readFileSync(triagePath,'utf8'));
const targetRel = process.argv[2] || 'src/htmlBuilder.js';
const target = path.join(root, targetRel);
if (!fs.existsSync(target)) { console.error('target not found', target); process.exit(1); }
const fileEntry = (tri.files || []).find(f => f.file === target);
if (!fileEntry) { console.error('no triage entries for', targetRel); process.exit(1); }
const src = fs.readFileSync(target,'utf8');
const lines = src.split(/\n/);
let out = `# Triage report for ${targetRel}\n\n`;
out += `Status: ${fileEntry.count} flagged symbols\n\n`;
for (const item of fileEntry.names) {
  const name = item.name;
  const re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&') + '\\b','g');
  const m = re.exec(src);
  let snippet = '';
  if (m) {
    const idx = m.index;
    const before = src.slice(0, idx);
    const lineNum = before.split(/\n/).length; // 1-based
    const start = Math.max(1, lineNum - 6);
    const end = Math.min(lines.length, lineNum + 6);
    const excerpt = lines.slice(start-1, end).join('\n');
    snippet = `Lines ${start}-${end}:\n\n` + '```js\n' + excerpt + '\n```\n\n';
  } else {
    snippet = 'Definition not found via simple search.\n\n';
  }
  out += `## ${name}\n\n- status: ${item.status}\n- occurrencesInDef: ${item.occurrencesInDef}\n- usagesOutside: ${item.usagesOutside}\n\n${snippet}`;
}
const outPath = path.join(outDir, path.basename(targetRel).replace(/\.js$/, '') + '-triage.md');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath);
