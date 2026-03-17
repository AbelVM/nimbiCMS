/**
 * Return the package version string.
 *
 * This value is injected at build time via Vite's `define` configuration.
 * The runtime should not attempt to read `package.json` directly because the
 * file will not be available to end-users.
 *
 * @returns {Promise<string>} Resolves to the injected version or `'0.0.0'`.
 */
export async function getVersion() {
  try {
    if (typeof __NIMBI_CMS_VERSION__ === 'string' && __NIMBI_CMS_VERSION__.trim()) {
      return __NIMBI_CMS_VERSION__
    }
  } catch (e) {
  }
  return '0.0.0'
}
