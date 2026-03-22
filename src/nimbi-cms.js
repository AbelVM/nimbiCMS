/**
 * Nimbi CMS public entrypoint.
 *
 * Re-exports primary runtime APIs and default `initCMS`.
 *
 * @module nimbi-cms
 */

import './styles/initial.css'
import 'bulma/css/bulma.min.css'
import 'highlight.js/styles/monokai.css'
import './styles/nimbi-cms-extra.css'

/**
 * Public hook APIs re-exported from `hookManager` for consumers.
 * These are thin re-exports intended to describe the public surface only.
 */
export { addHook, onPageLoad, onNavBuild, transformHtml, _clearHooks, runHooks } from './hookManager.js';

/**
 * Highlighting-related helpers re-exported for advanced usage and tests.
 */
export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

/**
 * Bulma theming helpers re-exported for host pages.
 */
export { ensureBulma, setStyle, setThemeVars } from './bulmaManager.js'

/**
 * Localization utilities re-exported from `l10nManager`.
 */
export { t, loadL10nFile, setLang } from './l10nManager.js'

/**
 * `initCMS` is the package default export and the primary initialization
 * entrypoint for host pages.
 */
export { initCMS, initCMS as default } from './init.js'
/** Re-export package version helper. */
export { getVersion } from './version.js'
