

/**
 * Hook registration and runner utilities.
 *
 * Exposes APIs to register and invoke lifecycle hooks used by the UI
 * and initialization code. Callers can register callbacks for
 * `onPageLoad`, `onNavBuild`, and `transformHtml`.
 *
 * @module hookManager
 */
import { debugWarn } from './utils/debug.js'

const hooks = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};

export function addHook(name, fn) {
  if (!Object.prototype.hasOwnProperty.call(hooks, name)) {
    throw new Error('Unknown hook "' + name + '"');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('hook callback must be a function');
  }
  hooks[name].push(fn);
}

/**
 * Register a callback to be invoked after each page is rendered.
 * @param {(ctx:Record<string,unknown>)=>void|Promise<void>} fn - Callback invoked with the render context.
 * @returns {void}
 */
export function onPageLoad(fn) { addHook('onPageLoad', fn); }

/**
 * Register a callback once the navigation DOM has been built.
 * @param {(ctx:Record<string,unknown>)=>void|Promise<void>} fn - Callback invoked with the navigation context.
 * @returns {void}
 */
export function onNavBuild(fn) { addHook('onNavBuild', fn); }

/**
 * Register a callback that can mutate the article element before it is
 * appended to the document. The callback receives the render context.
 * @param {(ctx:Record<string,unknown>)=>void|Promise<void>} fn - Callback which can modify the render context or DOM.
 * @returns {void}
 */
export function transformHtml(fn) { addHook('transformHtml', fn); }

/**
 * Invoke all registered hook callbacks for the given hook `name` with a
 * supplied context object. Errors from individual callbacks are swallowed.
 *
 * @param {string} name - Hook name to invoke (e.g. 'onPageLoad').
 * @param {Record<string,unknown>} ctx - Context object passed to each callback.
 * @returns {Promise<void>} - Resolves once all registered callbacks have completed.
 */
export async function runHooks(name, ctx) {
  const list = hooks[name] || [];
  for (const fn of list) {
    try {
      await fn(ctx);
    } catch (e) {
      try { debugWarn('[nimbi-cms] runHooks callback failed', e) } catch (err) {}
    }
  }
}

export function _clearHooks() {
  Object.keys(hooks).forEach(k => { hooks[k].length = 0 });
}
