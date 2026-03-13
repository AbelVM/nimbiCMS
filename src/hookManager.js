// hookManager.js
// Extracted from nimbi-cms.js to break circular dependency with init.js


/**
 * Built-in hook names and their callback lists.
 * External code can register handlers to be invoked at key events in the
 * CMS lifecycle. Each callback receives a `ctx` object and may be
 * synchronous or return a Promise.
 *
 * @type {{onPageLoad:Array<function(object):void|Promise<void>>,onNavBuild:Array<function(object):void|Promise<void>>,transformHtml:Array<function(object):void|Promise<void>>}}
 */
const hooks = {
  onPageLoad: [],      // called after a page has been rendered
  onNavBuild: [],      // called after the navigation DOM is constructed
  transformHtml: []    // allow modification of the article DOM before insertion
};

/**
 * Register a hook by name. Throws if the name is not recognised.
 * The callback receives a single `ctx` object and may be synchronous or
 * return a Promise.
 *
 * @param {string} name - hook name ("onPageLoad", "onNavBuild", "transformHtml")
 * @param {(ctx:object)=>void|Promise<void>} fn - callback invoked for the hook
 * @returns {void}
 */
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
 * @param {(ctx:object)=>void|Promise<void>} fn
 * @returns {void}
 */
export function onPageLoad(fn) { addHook('onPageLoad', fn); }

/**
 * Register a callback once the navigation DOM has been built.
 * @param {(ctx:object)=>void|Promise<void>} fn
 * @returns {void}
 */
export function onNavBuild(fn) { addHook('onNavBuild', fn); }

/**
 * Register a callback that can mutate the article element before it is
 * appended to the document. The callback receives the render context.
 * @param {(ctx:object)=>void|Promise<void>} fn
 * @returns {void}
 */
export function transformHtml(fn) { addHook('transformHtml', fn); }

/**
 * Invoke all registered hook callbacks for the given hook `name` with a
 * supplied context object. Errors from individual callbacks are swallowed.
 *
 * @param {string} name - hook name
 * @param {object} ctx - context passed to callbacks
 * @returns {Promise<void>}
 */
export async function runHooks(name, ctx) {
  const list = hooks[name] || [];
  for (const fn of list) {
    try {
      await fn(ctx);
    } catch (e) {
      console.warn('[nimbi-cms] runHooks callback failed', e);
    }
  }
}

/**
 * Clear all hooks registered via `addHook` (testing use only).
 * @returns {void}
 */
export function _clearHooks() {
  Object.keys(hooks).forEach(k => { hooks[k].length = 0 });
}
