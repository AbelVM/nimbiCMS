#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const covPath = path.resolve(process.cwd(), 'coverage', 'coverage-final.json');
if (!fs.existsSync(covPath)) {
  console.error('coverage-final.json not found at', covPath);
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(covPath, 'utf8'));

const rows = [];
for (const file in data) {
  if (!file.includes('/src/')) continue;
  const entry = data[file];
  const b = entry.b || {};
  let total = 0;
  let covered = 0;
  for (const k of Object.keys(b)) {
    const arr = b[k] || [];
    total += arr.length;
    for (const v of arr) {
      if (typeof v === 'number' && v > 0) covered++;
    }
  }
  const pct = total === 0 ? 100 : (covered / total) * 100;
  rows.push({ file, covered, total, pct });
}
rows.sort((a,b) => a.pct - b.pct);
// Print table
console.log('BRANCH COVERAGE (src/ files) — lower first');
console.log('file,covered,total,percent');
rows.forEach(r => {
  console.log([r.file, r.covered, r.total, r.pct.toFixed(1)+'%'].join(','));
});
// Write csv
const out = rows.map(r => `${r.file},${r.covered},${r.total},${r.pct.toFixed(1)}`).join('\n');
const outPath = path.resolve(process.cwd(), 'coverage', 'branch-coverage.csv');
fs.writeFileSync(outPath, 'file,covered,total,percent\n' + out);
console.log('\nWrote', outPath);
process.exit(0);
