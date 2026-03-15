/**
 * Return the package version string.
 *
 * This helper attempts to read the project's `package.json` at runtime so
 * consumers of the bundle can display the released version. The function
 * always resolves to a string and never throws — when JSON imports are not
 * available in the runtime or bundler, it falls back to the stable default
 * `'0.0.0'`.
 *
 * @returns {Promise<string>} Resolves to the package `version` value or `'0.0.0'`.
 */
export async function getVersion() {
  try {
    let mod = null
    // Try the JSON import with import assertions (preferred).
    try {
      // Note: some environments support import assertions; others don't.
      mod = await import('../package.json', { assert: { type: 'json' } })
    } catch (e) {
      // Fallback: try to fetch package.json via HTTP relative to the current
      // document location. This avoids a plain dynamic import without
      // assertions which can cause bundlers to report inconsistent import
      // attributes across modules.
      try {
        if (typeof fetch === 'function' && typeof location !== 'undefined') {
          const url = new URL('../package.json', location.href).toString()
          const res = await fetch(url)
          if (res && res.ok) {
            const json = await res.json()
            mod = { default: json }
          } else {
            mod = null
          }
        } else {
          mod = null
        }
      } catch (err) {
        mod = null
      }
    }

    // `mod` may expose the JSON as the default export or as the module itself
    // depending on bundler/loader behaviour. Normalize both shapes.
    const version = mod?.default?.version || mod?.version
    return typeof version === 'string' && version.trim() ? version : '0.0.0'
  } catch (err) {
    return '0.0.0'
  }
}
