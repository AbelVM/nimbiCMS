import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'
import path from 'path'


export default ({ command }) => {
  if (command === 'build') {
    return defineConfig({
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
        lib: {
          entry: path.resolve(__dirname, 'src/lib/index.js'),
          name: 'nimbiCMS',
          formats: ['es', 'cjs'],
          // emit a plain nimbi-cms.js for ES module (no .es suffix)
          fileName: (format) => format === 'es' ? 'nimbi-cms.js' : `nimbi-cms.${format}.js`
        },

        rollupOptions: {
          output: { exports: 'named', inlineDynamicImports: true }
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