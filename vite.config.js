import { defineConfig } from 'vite'
import path from 'path'


export default ({ command }) => {
  if (command === 'build') {
    return defineConfig({
      worker: { format: 'es' },
      build: {
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
    worker: { format: 'es' },
    build: {
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