// Runtime debug helpers for nimbi-cms
// Logs only when `globalThis.__nimbiCMSDebug` is truthy.
export function debugLog(...args) {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.__nimbiCMSDebug) {
      console.log(...args)
    }
  } catch (e) {}
}

export function debugWarn(...args) {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.__nimbiCMSDebug) {
      console.warn(...args)
    }
  } catch (e) {}
}

export function shouldDebug() {
  try { return typeof globalThis !== 'undefined' && !!globalThis.__nimbiCMSDebug } catch (e) { return false }
}
