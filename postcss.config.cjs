/* eslint-disable */
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    // modern CSS transforms
    require('postcss-preset-env')({ stage: 3 }),

    // run PurgeCSS on every build (not only production)
    purgecss({
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,html,md}',
        './example/**/*.{html,js}',
        './docs/**/*.{md,html}',
        './tests/**/*.{js,ts}'
      ],
            safelist: {
              standard: [
                /^is-/,
                /^has-/,
                /^is-hidden/,
                /^is-italic/,
                /^is-size-/,
                /^has-text-/,
                /^navbar-/,
                /^modal-/,
                /$svelte-/,
                // keep highlight.js and code block classes
                /^hljs/,
                /^language-/,
                /^token-/,
              ],
            },
      variables: true,
    }),

    // merge & dedupe rules
    require('postcss-merge-rules')(),
    require('postcss-discard-duplicates')(),

    // final minification
    require('cssnano')({
      preset: ['default', { discardComments: { removeAll: true } }],
    }),
  ],
}
