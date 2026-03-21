const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

function walk(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    if (it.isDirectory()) {
      files.push(...walk(path.join(dir, it.name)));
    } else if (it.isFile() && it.name.endsWith('.js')) {
      files.push(path.join(dir, it.name));
    }
  }
  return files;
}

const jsFiles = walk(srcDir);
let issues = [];
for (const f of jsFiles) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('buildCosmeticUrl(')) {
      // search the next 12 lines for data-page-canonical set
      let found = false;
      for (let j = i; j < Math.min(i + 12, lines.length); j++) {
        if (lines[j].includes("data-page-canonical") || lines[j].includes("setAttribute('data-page-canonical'") || lines[j].includes('setAttribute("data-page-canonical"')) {
          found = true;
          break;
        }
      }
      if (!found) {
        issues.push({ file: f, line: i + 1, snippet: lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 10)).join('\n') });
      }
    }
  }
}

if (!issues.length) {
  console.log('OK: No obvious missing data-page-canonical near buildCosmeticUrl usages.');
  process.exit(0);
}

console.log('Potential missing data-page-canonical usages:');
for (const it of issues) {
  console.log('\nFile:', path.relative(root, it.file), 'Line:', it.line);
  console.log(it.snippet);
}
process.exit(1);
