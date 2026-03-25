#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const covPath = path.resolve(__dirname, '..', 'coverage', 'coverage-final.json');
if (!fs.existsSync(covPath)) {
  console.error('coverage file not found at', covPath);
  process.exit(2);
}

let raw = fs.readFileSync(covPath, 'utf8');
let cov;
try {
  cov = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse coverage JSON:', err.message);
  process.exit(3);
}

const keys = Object.keys(cov);
const navKey = keys.find(k => k.endsWith('/src/nav.js') || k.endsWith('src/nav.js') || k.endsWith('\\src\\nav.js'));
if (!navKey) {
  console.error('Could not find a coverage entry for src/nav.js among keys:', keys.slice(0,20));
  process.exit(4);
}

const entry = cov[navKey];
const branchMap = entry.branchMap || {};
const branchCounts = entry.b || {};

const rows = [];
for (const bid of Object.keys(branchMap)) {
  const bm = branchMap[bid];
  const counts = branchCounts[bid] || [];
  const locations = (bm.locations || []).map(l => ({startLine: l.start.line, endLine: l.end.line}));
  const missingIndices = counts.map((c,i)=> ({c,i})).filter(x=>x.c===0).map(x=>x.i);
  if (missingIndices.length > 0) {
    const loc = bm.loc || {};
    const locStart = loc.start ? loc.start.line : (bm.line || null);
    const locEnd = loc.end ? loc.end.line : (bm.line || null);
    const maxHit = counts.length ? Math.max(...counts) : 0;
    const totalHit = counts.reduce((a,c)=> a + (typeof c === 'number' ? c : 0), 0);
    rows.push({
      branchId: bid,
      type: bm.type || null,
      locStartLine: locStart,
      locEndLine: locEnd,
      locations,
      counts,
      missingIndices,
      maxHit,
      totalHit
    });
  }
}

// Prioritize: branches where one side is covered (maxHit>0) and another missing; sort by maxHit desc
rows.sort((a,b)=> b.maxHit - a.maxHit || (b.totalHit - a.totalHit));

const out = { navKey, count: rows.length, rows };
const outPath = path.resolve(__dirname, '..', 'coverage', 'nav-branch-checklist.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('WROTE', outPath);
console.log(JSON.stringify({navKey, top: rows.slice(0,30)}, null, 2));
