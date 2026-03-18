/**
 * fix-jsdoc.cjs — lightweight fixer for JSDoc param/returns descriptions.
 *
 * Usage:
 *   node scripts/fix-jsdoc.cjs
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
let changed = 0;
for (const file of files) {
  const p = path.join(srcDir, file);
  let s = fs.readFileSync(p, 'utf8');
  const orig = s;
  // Replace @param lines that have no hyphen/description after the name
  // Matches lines like: " * @param {Type} name" or " * @param {Type} [name]"
  s = s.replace(/(\n\s*\*\s*@param\s+\{[^}]+\}\s+)(\[?[-A-Za-z0-9_.$]+\]?)(\s*)(?=\n|$)/g, (m, prefix, name) => {
    // if the line already contains a hyphen somewhere after, skip
    if (/\-/.test(m)) return m;
    const cleanName = String(name).replace(/^[\[\]]+|[\[\]]+$/g, '');
    const desc = ` - ${cleanName} parameter`;
    return prefix + name + desc;
  });
  // Also fix @returns lines without description
  s = s.replace(/(\n\s*\*\s*@returns?\s+\{[^}]+\})(\s*)(?=\n|$)/g, (m, p1) => {
    if (/\-/.test(m)) return m;
    return p1 + ' - return value';
  });

  if (s !== orig) {
    fs.writeFileSync(p, s, 'utf8');
    changed++;
    console.log('fixed', file);
  }
}
console.log('files changed:', changed);
process.exit(0);
