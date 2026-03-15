import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'


export default ({ command }) => {
  if (command === 'build') {
    const shouldAnalyze = !!process.env.ANALYZE

    // Load package.json at build-time; Vite may not support JSON module imports
    // in all environments, so read & parse manually.
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    let highlightJsVersion = '11.11.1'
    try {
      const pkgPath = resolve(__dirname, 'package.json')
      const pkgText = fs.readFileSync(pkgPath, 'utf8')
      const pkg = JSON.parse(pkgText)
      const dep = pkg && pkg.dependencies && pkg.dependencies['highlight.js']
      if (dep) {
        const m = String(dep).match(/(\d+\.\d+\.\d+)/)
        if (m && m[1]) highlightJsVersion = m[1]
      }
    } catch (_e) {
      // fallback to default version if package.json is inaccessible
    }

    return defineConfig({
      define: {
        __HIGHLIGHT_JS_VERSION__: JSON.stringify(highlightJsVersion)
      },
      worker: { format: 'es', inline: true },
      plugins: [
        ViteRestart({
          restart: ['dist/nimbi-cms.js']
        })
      ],
      build: {
        // prevent small files (like the renderer worker) from being inlined
        // as data URIs; we rely on an actual URL so imports resolve correctly.
        assetsInlineLimit: 0,
        // Emit a single CSS file across multi-format library builds so we
        // don't produce duplicate identical CSS files for each format.
        cssCodeSplit: false,
        lib: {
          // Use the full library entry so helper exports (registerLanguage,
          // setStyle, etc.) are included in all bundle formats.
          entry: path.resolve(__dirname, 'src/nimbi-cms.js'),
          name: 'nimbiCMS',
          // Always emit ES, CJS and UMD builds. UMD will be the plain
          // `nimbi-cms.js` artifact (no .umd suffix); ES gets an explicit
          // suffix so consumers can reference it via `module` field.
          formats: ['es', 'cjs', 'umd'],
          fileName: (format) => {
            if (format === 'umd') return 'nimbi-cms.js'
            return `nimbi-cms.${format}.js`
          }
        },

        rollupOptions: {
          output: { exports: 'named', inlineDynamicImports: true },
          plugins: [
            // optionally generate a static HTML bundle analysis when
            // `ANALYZE=1` is set in the environment
            ...(shouldAnalyze ? [
              visualizer({
                filename: 'dist/bundle-analysis.html',
                // sunburst provides a compact overview useful for spotting large
                // modules; treemap is another option. We also include gzip and
                // brotli sizes to get accurate compressed metrics.
                template: 'sunburst',
                gzipSize: true,
                brotliSize: true,
                open: false,
                title: 'nimbi-cms bundle analysis'
              })
            ] : [])
          ]
        }
      }
    })
  }
  return defineConfig({
    server: { port: 5173 },
    worker: { format: 'es', inline: true },
    plugins: [
      ViteRestart({ restart: ['dist/nimbi-cms.js'] })
    ],
    build: {
      // also disable inlining during dev build so ?url returns a real path
      assetsInlineLimit: 0,
      // Keep CSS output consistent in dev build as well
      cssCodeSplit: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        format: {
          comments: false
        }
      }
    }
  })
}