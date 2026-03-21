import puppeteer from 'puppeteer';

(async () => {
  const url = process.argv[2] || 'http://localhost:5544/?rss';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    try {
      const args = msg.args();
      Promise.all(args.map(a => a.jsonValue())).then(vals => {
        console.log('PAGE LOG:', msg.type(), ...vals);
      }).catch(() => console.log('PAGE LOG:', msg.type(), msg.text()));
    } catch (e) {
      console.log('PAGE LOG (raw):', msg.text());
    }
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
  // give runtime some time to run indexing
  await new Promise(r => setTimeout(r, 2500));
  // Try to extract RSS/Atom entries from the rendered XML viewer DOM
  const entries = await page.evaluate(() => {
    try {
      const out = [];
      const items = Array.from(document.getElementsByTagName('item'));
      if (items && items.length) {
        for (const it of items) {
          try {
            const t = it.getElementsByTagName('title')[0];
            const l = it.getElementsByTagName('link')[0];
            out.push({ title: t ? t.textContent.trim() : '', link: l ? l.textContent.trim() : '' });
          } catch (e) {}
        }
        return out;
      }
      // Fallback: try to read the raw XML text node used by the viewer
      const raw = document.getElementById('webkit-xml-viewer-source-xml');
      if (raw && raw.textContent) {
        const s = raw.textContent;
        const matches = Array.from(s.matchAll(/<item>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<\/item>/gi));
        return matches.map(m => ({ title: (m[2]||'').trim(), link: (m[1]||'').trim() }));
      }
      return [];
    } catch (e) { return { error: String(e) } }
  });
  console.log('--- EXTRACTED ENTRIES ---');
  console.log(JSON.stringify(entries, null, 2));

  // Also extract the full runtime search index (deduped by slug without anchors)
  const fullIndex = await page.evaluate(async () => {
    try {
      // If the page exposes a readiness helper, await it so we observe the
      // final worker-populated index instance.
      try {
        if (typeof window !== 'undefined' && typeof window.__nimbiIndexReady === 'function') {
          try { await window.__nimbiIndexReady({ timeoutMs: 5000 }) } catch (e) { /* ignore */ }
        }
      } catch (e) {}

      // Try to import the slugManager module from the dev server
      let mod = null
      try {
        mod = await import('/src/slugManager.js')
      } catch (e) {
        try { mod = await import('./src/slugManager.js') } catch (e2) { mod = null }
      }

      const getIndexFromModule = (m) => {
        try {
          if (!m) return null
          if (Array.isArray(m.searchIndex) && m.searchIndex.length) return m.searchIndex
          if (m.default && Array.isArray(m.default.searchIndex) && m.default.searchIndex.length) return m.default.searchIndex
          return null
        } catch (e) { return null }
      }

      let idx = getIndexFromModule(mod)

      // If module index is empty, try any runtime-exposed index globals
      try {
        if ((!idx || !idx.length) && typeof window !== 'undefined') {
          if (Array.isArray(window.__nimbiLiveSearchIndex) && window.__nimbiLiveSearchIndex.length) idx = window.__nimbiLiveSearchIndex
          else if (Array.isArray(window.__nimbiResolvedIndex) && window.__nimbiResolvedIndex.length) idx = window.__nimbiResolvedIndex
          else if (Array.isArray(window.__nimbiSearchIndex) && window.__nimbiSearchIndex.length) idx = window.__nimbiSearchIndex
        }
      } catch (e) {}

      // As a last resort, try to build a fresh index using the module's buildSearchIndex
      if ((!idx || !idx.length) && mod && typeof mod.buildSearchIndex === 'function') {
        try {
          idx = await mod.buildSearchIndex(window.__nimbi_contentBase || undefined, window.__nimbi_indexDepth || 1, window.__nimbi_noIndexing || undefined, undefined)
        } catch (e) { /* ignore build errors */ }
      }

      if (!idx || !idx.length) return []

      // Deduplicate by slug base (strip anchors after '::') — prefer page-level entries
      const map = new Map()
      for (const it of idx) {
        try {
          if (!it || !it.slug) continue
          const slugStr = String(it.slug)
          const base = slugStr.split('::')[0]
          if (!map.has(base)) {
            map.set(base, it)
            continue
          }
          // prefer non-anchor (no '::') entries over anchor entries
          const prev = map.get(base)
          if (prev && String(prev.slug || '').indexOf('::') !== -1 && String(it.slug || '').indexOf('::') === -1) {
            map.set(base, it)
          }
        } catch (e) { /* ignore per-item errors */ }
      }

      return Array.from(map.values())
    } catch (e) {
      return { error: String(e) }
    }
  })

  console.log('--- FULL DEDUPED INDEX ---')
  try { console.log(JSON.stringify(fullIndex, null, 2)) } catch (e) { console.log('FULL INDEX ERROR', String(e)) }
  await browser.close();
})();
