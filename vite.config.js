import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const libraryEntry = path.resolve(__dirname, 'src/nimbi-cms.js')

function readPackageMetadata() {
  let pkg = null
  let highlightJsVersion = '11.11.1'
  try {
    const pkgPath = path.resolve(__dirname, 'package.json')
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const dep = pkg?.dependencies?.['highlight.js']
    if (dep) {
      const match = String(dep).match(/(\d+\.\d+\.\d+)/)
      if (match?.[1]) highlightJsVersion = match[1]
    }
  } catch (_) {
    pkg = null
  }
  return { pkg, highlightJsVersion }
}

function isCssSideEffect(id) {
  return /\.css($|\?)/.test(String(id ?? ''))
}

function createAnalyzePlugins(shouldAnalyze) {
  return shouldAnalyze
    ? [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          template: 'sunburst',
          gzipSize: true,
          brotliSize: true,
          open: false,
          title: 'nimbi-cms bundle analysis'
        })
      ]
    : []
}

function createBuildConfig({ mode, shouldAnalyze }) {
  const { pkg, highlightJsVersion } = readPackageMetadata()
  const isUmd = mode === 'umd'
  const defineValues = {
    __HIGHLIGHT_JS_VERSION__: JSON.stringify(highlightJsVersion),
    __NIMBI_CMS_VERSION__: JSON.stringify(pkg?.version || '0.0.0'),
    __NIMBI_CMS_HOMEPAGE__: JSON.stringify(
      pkg?.homepage ||
      (typeof pkg?.repository === 'string' ? pkg.repository : pkg?.repository?.url) ||
      ''
    ),
    'process.env.VITEST': 'false'
  }

  return defineConfig({
    define: defineValues,
    worker: isUmd
      ? {
          format: 'es',
          inline: true,
          rollupOptions: {
            output: {
              codeSplitting: false
            }
          }
        }
      : {
          format: 'es',
          inline: true,
          rollupOptions: {
            output: {
              codeSplitting: false
            }
          }
        },
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      // CSS minification is handled in postcss.config.cjs via cssnano.
      cssMinify: false,
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false
        }
      },
      emptyOutDir: !isUmd,
      lib: isUmd
        ? {
            entry: libraryEntry,
            name: 'nimbiCMS',
            formats: ['umd']
          }
        : {
            entry: libraryEntry,
            name: 'nimbiCMS'
          },
      rollupOptions: {
        treeshake: {
          moduleSideEffects: (id) => isCssSideEffect(id)
        },
        output: isUmd
          ? {
              format: 'umd',
              name: 'nimbiCMS',
              entryFileNames: 'nimbi-cms.js',
              exports: 'named',
              codeSplitting: false
            }
          : [
              {
                format: 'es',
                entryFileNames: 'nimbi-cms.es.js',
                exports: 'named',
                codeSplitting: false
              },
              {
                format: 'cjs',
                entryFileNames: 'nimbi-cms.cjs.js',
                exports: 'named',
                codeSplitting: false
              }
            ],
        plugins: createAnalyzePlugins(shouldAnalyze && !isUmd)
      }
    }
  })
}

export default defineConfig(({ command }) => {
  if (command !== 'build') {
    return {
      server: { port: 5173 },
      worker: { format: 'es', inline: true }
    }
  }

  const shouldAnalyze = !!process.env.ANALYZE
  const mode = process.env.BUILD_TARGET === 'umd' ? 'umd' : 'lib'

  return createBuildConfig({ mode, shouldAnalyze })
})