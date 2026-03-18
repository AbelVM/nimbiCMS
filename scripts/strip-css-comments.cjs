#!/usr/bin/env node
/**
 * strip-css-comments.cjs — strip non-license CSS block comments from stylesheets.
 *
 * Usage:
 *   node scripts/strip-css-comments.cjs
 */
/* Strip CSS block comments except those starting with /*! (often licenses)
  Usage: node scripts/strip-css-comments.cjs
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = ['.css'];
const skipDirs = ['node_modules', '.git', 'coverage', 'dist', 'tmp'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    if (ent.isDirectory()) {
      if (skipDirs.includes(ent.name)) continue;
      files.push(...walk(path.join(dir, ent.name)));
    } else {
      if (exts.includes(path.extname(ent.name))) files.push(path.join(dir, ent.name));
    }
  }
  return files;
}

function stripComments(content) {
  // Remove /* ... */ except /*! ... */
  return content.replace(/\/\*([^!][\s\S]*?)\*\//g, '');
}

const files = walk(root);
let changed = 0;
for (const f of files) {
  try {
    const src = fs.readFileSync(f, 'utf8');
    const out = stripComments(src);
    if (out !== src) {
      fs.writeFileSync(f, out, 'utf8');
      console.log('Updated:', f.replace(root + path.sep, ''));
      changed++;
    }
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
console.log(`Done. Files modified: ${changed}`);
process.exit(0);
