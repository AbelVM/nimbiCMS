#!/usr/bin/env node
/**
 * check-toc.cjs — verify README table-of-contents anchors match headings.
 *
 * Usage:
 *   node scripts/check-toc.cjs [README.md]
 */
const fs = require('fs');
const path = process.argv[2] || 'README.md';
const md = fs.readFileSync(path, 'utf8');

function slugify(text) {
  if (!text) return '';
  let s = String(text).trim().toLowerCase();
  s = s.replace(/[\u2000-\u206F\u2E00-\u2E7F\'"\!\$%\(\)\*\+,\./:;<>\=?@\[\\\]^`{|}~&—–]/g, '');
  s = s.replace(/\s+/g, '-');
  s = s.replace(/-+/g, '-');
  return s;
}

const tocAnchors = [];
const tocRe = /\[[^\]]+\]\(#([^\)]+)\)/g;
let m;
while ((m = tocRe.exec(md))) { tocAnchors.push(m[1].trim()); }

const headings = [];
const lines = md.split(/\r?\n/);
for (const line of lines) {
  const hm = line.match(/^(#{1,6})\s+(.+)$/);
  if (hm) {
    const text = hm[2].trim();
    headings.push({text, slug: slugify(text)});
  }
}

const headingSlugs = new Set(headings.map(h => h.slug));
const tocSet = new Set(tocAnchors.map(a => a.trim()));

const missing = [];
for (const a of tocSet) {
  if (!headingSlugs.has(a)) missing.push(a);
}

if (missing.length) {
  console.error('TOC anchor(s) missing matching headings:');
  for (const s of missing) console.error(' -', s);
  console.error('\nFound headings:');
  for (const h of headings) console.error(` - ${h.slug} -> ${h.text}`);
  process.exitCode = 2;
  process.exit(2);
} else {
  console.log('All TOC anchors match headings.');
  process.exit(0);
}
