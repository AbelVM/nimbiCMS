/**
 * Shared DOMPurify factory.
 *
 * Provides a DOMPurify instance factory for both main thread and worker
 * to avoid dual bundling issues.
 *
 * @module utils/domPurify
 */
import DOMPurify from "dompurify";

/**
 * Get the global object for the current context.
 * @returns {Window | WorkerGlobalScope | object}
 */
function getGlobal() {
  // Main thread: window
  if (typeof window !== "undefined" && window.document) {
    return window;
  }
  // Worker: self
  if (typeof self !== "undefined") {
    return self;
  }
  // Fallback: create minimal object for DOMPurify initialization
  return {
    document: {
      nodeType: 9,
      createElement: () => ({}),
      createDocumentFragment: () => ({}),
      implementation: {
        createHTMLDocument: () => ({
          documentElement: {},
          body: {},
          createElement: () => ({}),
          createDocumentFragment: () => ({})
        })
      }
    },
    Element: class {},
    Node: class {},
    NodeFilter: { SHOW_ELEMENT: 1, SHOW_TEXT: 3 },
    DOMParser: class {},
    trustedTypes: undefined
  };
}

let _purify = null;

/**
 * Get the DOMPurify sanitize function, creating it on first call.
 *
 * DOMPurify v3 returns the sanitize function directly from `DOMPurify(window)`
 * in supported environments. In unsupported environments (e.g., test
 * environments without a real DOM), it may return the factory function itself
 * with a `.sanitize` method. This wrapper normalizes the return value so
 * callers can always use the result as a sanitize function.
 *
 * @returns {import("dompurify").SanitizeFunction}
 */
export function getDOMPurify() {
  if (!_purify) {
    if (typeof DOMPurify?.sanitize === "function") {
      _purify = DOMPurify.sanitize.bind(DOMPurify);
    } else {
      _purify = DOMPurify(getGlobal());
    }
    // In environments where DOMPurify cannot initialize (e.g., test
    // environments without a real Window), v3 returns the factory function
    // itself with a `.sanitize` method. Unwrap to expose the sanitize
    // function consistently.
    if (typeof _purify === "function" && typeof _purify.sanitize === "function") {
      _purify = _purify.sanitize.bind(_purify);
    } else if (typeof _purify === "function" && _purify.isSupported === false) {
      _purify = (value) => String(value ?? "");
    }
  }
  return _purify;
}

// Also export as default for convenience
export default getDOMPurify;