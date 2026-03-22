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

export { addHook, onPageLoad, onNavBuild, transformHtml, _clearHooks, runHooks } from './hookManager.js';

export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

export { ensureBulma, setStyle, setThemeVars } from './bulmaManager.js'

export { t, loadL10nFile, setLang } from './l10nManager.js'

export { initCMS, initCMS as default } from './init.js'
export { getVersion } from './version.js'
