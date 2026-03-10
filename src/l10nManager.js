import { DEFAULT_L10N } from './utils/l10n-defaults.js'

// start with a deep copy of defaults so runtime modifications don't affect
// the original object defined in utils.
const L10N = JSON.parse(JSON.stringify(DEFAULT_L10N))

let detectedLang = 'en'
if (typeof navigator !== 'undefined') {
  const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en'
  detectedLang = String(navLang).split('-')[0].toLowerCase()
}
if (!DEFAULT_L10N[detectedLang]) detectedLang = 'en'

export let currentLang = detectedLang

export function t(key, replacements = {}) {
  const dict = L10N[currentLang] || L10N.en
  let s = dict && dict[key] ? dict[key] : (L10N.en[key] || '')
  for (const k of Object.keys(replacements)) {
    s = s.replace(new RegExp(`\{${k}\}`, 'g'), String(replacements[k]))
  }
  return s
}

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
    // silently ignore load errors
  }
}

export function setLang(lang) {
  const short = String(lang).split('-')[0].toLowerCase()
  currentLang = L10N[short] ? short : 'en'
}

export function getLang() {
  return currentLang
}
