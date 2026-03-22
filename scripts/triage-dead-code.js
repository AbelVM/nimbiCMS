const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const inPath = path.join(root, 'tmp', 'dead-code-aggressive.json');
const outPath = path.join(root, 'tmp', 'dead-code-triage.json');

if (!fs.existsSync(inPath)) {
  console.error('Input file not found:', inPath);
  process.exit(1);
}

const candidates = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const results = [];
for (const c of candidates) {
  const defFile = c.file;
  let src = '';
  try {
    src = fs.readFileSync(defFile, 'utf8');
  } catch (e) {
    results.push(Object.assign({}, c, { occurrencesInDef: null, status: 'file-read-error' }));
    continue;
  }
  const safeName = String(c.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('\\b' + safeName + '\\b', 'g');
  const occ = (src.match(re) || []).length;
  const usagesOut = (typeof c.usages === 'number') ? c.usages : 0;
  let status = 'unknown';
  // Heuristic classification
  if (usagesOut > 0) {
    status = 'used-elsewhere';
  } else if (occ > 1) {
    status = 'used-inside';
  } else if (occ === 1 && usagesOut === 0) {
    // appears only once in the defining file (likely only definition)
    status = 'likely-dead';
  } else if (occ === 0 && usagesOut === 0) {
    // definition doesn't appear? odd — e.g., var assigned via export list; mark for review
    status = 'suspicious-missing-def';
  } else {
    status = 'needs-review';
  }
  results.push(Object.assign({}, c, { occurrencesInDef: occ, usagesOutside: usagesOut, status }));
}

fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
const summary = results.reduce((acc, it) => { acc[it.status] = (acc[it.status]||0) + 1; return acc; }, {});
console.log('Wrote', outPath, '- status counts:', summary);
