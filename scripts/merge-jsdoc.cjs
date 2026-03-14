const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
let totalChanged = 0;

function findJsDocBlocks(lines) {
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('/**')) {
      const start = i;
      let j = i;
      while (j < lines.length && !/\*\//.test(lines[j])) j++;
      if (j < lines.length) {
        const end = j;
        const content = lines.slice(start, end + 1).join('\n');
        blocks.push({ startLine: start + 1, endLine: end + 1, content });
        i = j + 1;
        continue;
      } else {
        break;
      }
    }
    i++;
  }
  return blocks;
}

function findExportFns(lines) {
  const exports = [];
  const re = /^\s*export function\s+([A-Za-z0-9_]+)/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m) exports.push({ name: m[1], line: i + 1 });
  }
  return exports;
}

for (const file of files) {
  const p = path.join(srcDir, file);
  let s = fs.readFileSync(p, 'utf8');
  const lines = s.split('\n');
  const blocks = findJsDocBlocks(lines);
  if (!blocks.length) continue;
  const exports = findExportFns(lines);
  if (!exports.length) continue;

  // Map blocks by whether they are adjacent to an export fn
  const toDeleteRanges = [];
  const toMove = [];

  for (const ex of exports) {
    const name = ex.name;
    const exportLine = ex.line;
    // Find any block that ends immediately before export (allow blank lines)
    let adjacent = null;
    for (const b of blocks) {
      if (b.endLine < exportLine) {
        // check lines between b.endLine+1 .. exportLine-1 are blank
        let ok = true;
        for (let ln = b.endLine + 1; ln < exportLine; ln++) {
          const t = (lines[ln - 1] || '').trim();
          if (t !== '') { ok = false; break }
        }
        if (ok) {
          if (!adjacent || b.endLine > adjacent.endLine) adjacent = b;
        }
      }
    }

    // find all blocks that mention the function name
    const nameRe = new RegExp('\\b' + name + '\\b');
    const mentioning = blocks.filter(b => nameRe.test(b.content));

    if (adjacent) {
      // keep adjacent; remove other mentioning blocks (except adjacent itself)
      for (const b of mentioning) {
        if (b.startLine === adjacent.startLine && b.endLine === adjacent.endLine) continue;
        toDeleteRanges.push([b.startLine, b.endLine]);
      }
    } else if (mentioning.length) {
      // No adjacent; pick the mentioning block closest to export (largest endLine less than exportLine if any, else last mentioning)
      let candidate = null;
      for (const b of mentioning) {
        if (b.endLine < exportLine) {
          if (!candidate || b.endLine > candidate.endLine) candidate = b;
        }
      }
      if (!candidate) candidate = mentioning[mentioning.length - 1];
      // If candidate already directly above export (with only blanks), no move
      let alreadyAdj = false;
      if (candidate.endLine === exportLine - 1) alreadyAdj = true;

      // Mark other mentioning blocks for deletion
      for (const b of mentioning) {
        if (b.startLine === candidate.startLine && b.endLine === candidate.endLine) continue;
        toDeleteRanges.push([b.startLine, b.endLine]);
      }

      if (!alreadyAdj) {
        // move candidate to just above export
        toMove.push({ fromStart: candidate.startLine, fromEnd: candidate.endLine, exportLine, content: candidate.content });
        // mark original candidate for deletion (it will be re-inserted)
        toDeleteRanges.push([candidate.startLine, candidate.endLine]);
      }
    }
  }

  if (!toDeleteRanges.length && !toMove.length) continue;

  // Normalize deletion ranges (merge and sort)
  toDeleteRanges.sort((a,b)=> a[0]-b[0]);
  const merged = [];
  for (const r of toDeleteRanges) {
    if (!merged.length) merged.push(r.slice());
    else {
      const last = merged[merged.length-1];
      if (r[0] <= last[1] + 1) { last[1] = Math.max(last[1], r[1]); }
      else merged.push(r.slice());
    }
  }

  // Delete ranges from bottom to top
  let newLines = lines.slice();
  for (let i = merged.length -1; i >= 0; i--) {
    const [sline, eline] = merged[i];
    newLines.splice(sline -1, eline - sline +1);
  }

  // For moves, compute insertion line after deletions
  // For each move, determine how many deleted lines were before the original export line
  for (const mv of toMove) {
    const originalExportLine = mv.exportLine;
    let deletedBefore = 0;
    for (const [sline, eline] of merged) if (sline < originalExportLine) deletedBefore += (Math.min(eline, originalExportLine-1) - sline +1);
    const insertAt = originalExportLine - deletedBefore -1; // insert before this 0-based index
    const contentLines = mv.content.split('\n');
    // ensure there's a blank line between existing content and JSDoc
    if (insertAt > 0 && newLines[insertAt-1].trim() !== '') contentLines.unshift('');
    newLines.splice(insertAt, 0, ...contentLines);
  }

  const out = newLines.join('\n');
  if (out !== s) {
    fs.writeFileSync(p, out, 'utf8');
    console.log('merged JSDoc in', file, '- removed', merged.length, 'ranges, moved', toMove.length);
    totalChanged++;
  }
}
console.log('files changed:', totalChanged);
