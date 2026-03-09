export function parseFrontmatter(md) {
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3)
    if (end !== -1) {
      const raw = md.slice(3, end + 0).trim()
      const rest = md.slice(end + 4).trimStart()
      const data = {}
      raw.split(/\r?\n/).forEach(line => {
        const m = line.match(/^([^:]+):\s*(.*)$/)
        if (m) data[m[1].trim()] = m[2].trim()
      })
      return { content: rest, data }
    }
  }
  return { content: md, data: {} }
}
