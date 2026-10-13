/**
 * Markdown section splitting for incremental (streaming) rendering.
 *
 * Shared by the main-thread renderer and the renderer worker so both produce
 * byte-identical chunk boundaries. Divergent boundaries would make streamed
 * output differ from non-streamed output for the same document.
 *
 * @module utils/splitIntoSections
 */

/**
 * Split a markdown `content` string into logical sections suitable for
 * incremental parsing.
 *
 * Sections are cut at ATX heading boundaries so a chunk never starts in the
 * middle of a section. Adjacent short sections are merged up to `chunkSize`
 * to avoid emitting a flood of tiny chunks. When the document has fewer than
 * two headings there is nothing meaningful to align to, so it falls back to
 * fixed-size slices.
 *
 * @param {string} content - Markdown source.
 * @param {number} chunkSize - Target maximum section size in characters.
 * @returns {string[]} Sections in document order.
 */
export function splitIntoSections(content, chunkSize) {
  const txt = String(content ?? "");
  if (!txt || txt.length <= chunkSize) return [txt];

  const headingRe = /^#{1,6}\s.*$/gm;
  const positions = [];
  let match;
  while ((match = headingRe.exec(txt)) !== null) positions.push(match.index);

  // Fewer than two headings gives no useful alignment; slice by size.
  if (!positions.length || positions.length < 2) {
    const out = [];
    for (let i = 0; i < txt.length; i += chunkSize)
      out.push(txt.slice(i, i + chunkSize));
    return out;
  }

  const sections = [];
  // Leading intro before the first heading.
  if (positions[0] > 0) sections.push(txt.slice(0, positions[0]));
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : txt.length;
    sections.push(txt.slice(start, end));
  }

  // Merge neighbouring sections up to the chunk budget.
  const merged = [];
  let current = "";
  for (const section of sections) {
    if (!current && section.length >= chunkSize) {
      merged.push(section);
      continue;
    }
    if (current.length + section.length <= chunkSize) current += section;
    else {
      if (current) merged.push(current);
      current = section;
    }
  }
  if (current) merged.push(current);
  return merged;
}

export default splitIntoSections;
