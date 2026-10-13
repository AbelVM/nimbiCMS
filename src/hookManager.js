/**
 * Hook registration and runner utilities.
 *
 * Exposes APIs to register and invoke lifecycle hooks used by the UI
 * and initialization code. Callers can register callbacks for
 * `onPageLoad`, `onNavBuild`, and `transformHtml`.
 *
 * @module hookManager
 */
import { debugWarn } from "./utils/debug.js";

const hooks = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: [],
};

/**
 * Hook callback signature.
 * @typedef {(ctx:Record<string,unknown>) => void|Promise<void>} HookCallback
 */

/**
 * The context object passed to hook callbacks. Hooks may read or
 * augment this object with runtime values for downstream consumers.
 * @typedef {Record<string,unknown>} HookContext
 */

/**
 * Known hook names accepted by the hook manager.
 * @typedef {'onPageLoad'|'onNavBuild'|'transformHtml'} HookName
 */

/**
 * Internal hooks registry typed for documentation.
 * @type {{onPageLoad:HookCallback[], onNavBuild:HookCallback[], transformHtml:HookCallback[]}}
 */
/* (the `hooks` object above holds arrays of HookCallback) */

/**
 * Register a hook callback for the given hook name.
 * @param {HookName} name - Hook name to register (e.g. 'onPageLoad').
 * @param {HookCallback} fn - Callback function to register.
 * @returns {void}
 */
export function addHook(name, fn) {
  if (!Object.prototype.hasOwnProperty.call(hooks, name)) {
    throw new Error('Unknown hook "' + name + '"');
  }
  if (typeof fn !== "function") {
    throw new TypeError("hook callback must be a function");
  }
  hooks[name].push(fn);
}

/**
 * Register a callback to be invoked after each page is rendered.
 * @param {HookCallback} fn - Callback invoked with the render context.
 * @returns {void}
 */
export function onPageLoad(fn) {
  addHook("onPageLoad", fn);
}

/**
 * Register a callback once the navigation DOM has been built.
 * @param {HookCallback} fn - Callback invoked with the navigation context.
 * @returns {void}
 */
export function onNavBuild(fn) {
  addHook("onNavBuild", fn);
}

/**
 * Register a callback that can mutate the article element before it is
 * appended to the document. The callback receives the render context.
 * @param {HookCallback} fn - Callback which can modify the render context or DOM.
 * @returns {void}
 */
export function transformHtml(fn) {
  addHook("transformHtml", fn);
}

/**
 * Invoke all registered hook callbacks for the given hook `name` with a
 * supplied context object. Errors from individual callbacks are swallowed.
 *
 * @param {HookName} name - Hook name to invoke (e.g. 'onPageLoad').
 * @param {HookContext} ctx - Context object passed to each callback.
 * @returns {Promise<void>} - Resolves once all registered callbacks have completed.
 */
export async function runHooks(name, ctx) {
  const list = hooks[name] || [];
  for (const fn of list) {
    try {
      await fn(ctx);
    } catch (e) {
      try {
        debugWarn("[nimbi-cms] runHooks callback failed", e);
      } catch (err) {}
    }
  }
}

/**
 * Clear all registered hooks for every hook type.
 * Useful in tests to reset hook state.
 * @returns {void}
 */
export function _clearHooks() {
  Object.keys(hooks).forEach((k) => {
    hooks[k].length = 0;
  });
}
