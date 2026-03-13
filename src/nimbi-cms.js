import 'highlight.js/styles/monokai.css'

export { addHook, onPageLoad, onNavBuild, transformHtml, _clearHooks, runHooks } from './hookManager.js';

export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

export { setStyle, setThemeVars } from './bulmaManager.js'

export { t, loadL10nFile, setLang } from './l10nManager.js'

export { initCMS as default } from './init.js'
