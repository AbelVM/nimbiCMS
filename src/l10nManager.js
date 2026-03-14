import { DEFAULT_L10N } from './utils/l10n-defaults.js'

const L10N = JSON.parse(JSON.stringify(DEFAULT_L10N))

/**
 * @typedef {Object.<string,string>} LocaleDict
 */

/**
 * @typedef {{[locale:string]: LocaleDict}} L10NMap
 */

let detectedLang = 'en'
if (typeof navigator !== 'undefined') {
  const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en'
  detectedLang = String(navLang).split('-')[0].toLowerCase()
}
if (!DEFAULT_L10N[detectedLang]) detectedLang = 'en'

export let currentLang = detectedLang

/**
 * Translate a key using the current language. Replacement tokens of the
 * form `{name}` are interpolated from the `replacements` object.
 *
 * @param {string} key - Translation key to look up in the current locale.
 * @param {Object} [replacements] - Optional replacements for token interpolation.
 * @returns {string} - The translated string, or an empty string when not found.
 */
export function t(key, replacements = {}) {
  const dict = L10N[currentLang] || L10N.en
  let s = dict && dict[key] ? dict[key] : (L10N.en[key] || '')
  for (const k of Object.keys(replacements)) {
    s = s.replace(new RegExp(`\{${k}\}`, 'g'), String(replacements[k]))
  }
  return s
}

/**
 * Load a JSON localization file and merge its contents into the runtime
 * dictionary.
 *
 * @param {string} path - URL or relative path to the JSON localization file.
 * @param {string} pageDir - Base page directory used to resolve relative paths.
 * @returns {Promise<void>} - Resolves when the file has been fetched and merged.
 */
export async function loadL10nFile(path, pageDir) {
  if (!path) return
  let resolved = path
  try {
    if (!/^https?:\/\//.test(path)) {
      resolved = new URL(path, location.origin + pageDir).toString()
    }
    const res = await fetch(resolved)
    if (!res.ok) return
    const json = await res.json()
    for (const lang of Object.keys(json || {})) {
      L10N[lang] = Object.assign({}, L10N[lang] || {}, json[lang])
    }
  } catch (e) {
  }
}

/**
 * Switch the current UI language. Falls back to English if the requested
 * language is not available.
 * @param {string} lang - Language code to switch to (e.g. 'en', 'es').
 * @returns {void} - No return value.
 */
export function setLang(lang) {
  const short = String(lang).split('-')[0].toLowerCase()
  currentLang = L10N[short] ? short : 'en'
}

function getLang() {
  return currentLang
}
