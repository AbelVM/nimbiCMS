module.exports = [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Element: 'readonly',
        __NIMBI_CMS_VERSION__: 'readonly',
        __NIMBI_CMS_MANIFEST__: 'readonly',
        __NIMBI_CMS_HOMEPAGE__: 'readonly',
        __HIGHLIGHT_JS_VERSION__: 'readonly',
        onmessage: 'readonly',
        postMessage: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        Blob: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        CustomEvent: 'readonly',
        DOMParser: 'readonly',
        HTMLElement: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        PopStateEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        requestIdleCallback: 'readonly',
        ResizeObserver: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        URLSearchParams: 'readonly',
        Worker: 'readonly',
        XMLSerializer: 'readonly',
        CSS: 'readonly',
        process: 'readonly',
        renderByQuery: 'readonly',
        findSlugForPath: 'readonly',
        manifest: 'readonly',
        searchIndex: 'readonly',
        navigationPage: 'readonly'
      }
    },
    plugins: {
      'unused-imports': require('eslint-plugin-unused-imports'),
      'nimbi-debug': require('./eslint-plugin-nimbi-debug/index.cjs')
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error',
      'nimbi-debug/no-eager-debug': 'warn'
    }
  }
]
