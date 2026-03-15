import 'highlight.js/styles/monokai.css'

export { addHook, onPageLoad, onNavBuild, transformHtml, _clearHooks, runHooks } from './hookManager.js';

export { registerLanguage, loadSupportedLanguages, observeCodeBlocks, setHighlightTheme, SUPPORTED_HLJS_MAP, BAD_LANGUAGES } from './codeblocksManager.js'

export { ensureBulma, setStyle, setThemeVars } from './bulmaManager.js'

export { t, loadL10nFile, setLang } from './l10nManager.js'

// Export `initCMS` as a named export and keep it as the default for
// backwards compatibility. This ensures the UMD global `nimbiCMS.initCMS`
// is available instead of relying on `nimbiCMS.default`.
export { initCMS, initCMS as default } from './init.js'
export { getVersion } from './version.js'
