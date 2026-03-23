/**
 * Shared DOMParser helper.
 * Reuse a single DOMParser instance to avoid allocations in tight loops.
 */
let SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

/**
 * Return the shared DOMParser instance.
 * @returns {DOMParser|null} Shared DOMParser or null when unavailable.
 */
export function getSharedParser() {
  if (SHARED_DOM_PARSER) return SHARED_DOM_PARSER
  if (typeof DOMParser !== 'undefined') {
    SHARED_DOM_PARSER = new DOMParser()
    return SHARED_DOM_PARSER
  }
  return null
}

/**
 * Replace the shared DOMParser instance. Intended for tests or polyfills.
 * @param {DOMParser|null} parser - New DOMParser instance or null to clear.
 * @returns {void}
 */
export function setSharedParser(parser) {
  SHARED_DOM_PARSER = parser
}

/**
 * Reset the shared DOMParser to a fresh instance (or null if unavailable).
 * @returns {void}
 */
export function resetSharedParser() {
  SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null
}
