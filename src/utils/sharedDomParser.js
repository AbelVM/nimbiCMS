/**
 * Shared DOMParser helper.
 * Reuse a single DOMParser instance to avoid allocations in tight loops.
 */
let SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null

export function getSharedParser() {
  if (SHARED_DOM_PARSER) return SHARED_DOM_PARSER
  if (typeof DOMParser !== 'undefined') {
    SHARED_DOM_PARSER = new DOMParser()
    return SHARED_DOM_PARSER
  }
  return null
}

export function setSharedParser(parser) {
  SHARED_DOM_PARSER = parser
}

export function resetSharedParser() {
  SHARED_DOM_PARSER = typeof DOMParser !== 'undefined' ? new DOMParser() : null
}
