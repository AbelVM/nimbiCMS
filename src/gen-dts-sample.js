/** helper module used by the declaration generator tests; exporting a handful of
  contrived functions that exercise JSDoc parsing, unions, generics, records, and callbacks. */

/**
 * @param {{a:number,b:string}} opts
 * @returns {Promise<Array<{foo:string}|{bar:number}>>}
 */
export function complexExample(opts) {
  return Promise.resolve([{foo:'x'}])
}

/**
 * @returns {string|number}
 */
export function simpleUnion() {
  return Math.random() < 0.5 ? 'foo' : 42
}

/**
 * @returns {Record<string, number[]>}
 */
export function recordExample() {
  return { anyKey: [1, 2, 3] }
}

/**
 * @param {any} opts
 * @returns {{sum:number}}
 */
export function sum(opts) {
  return { sum: (opts && opts.a || 0) + (opts && opts.b || 0) }
}

/**
 * @param {function} cb
 * @returns {void}
 */
export function callIt(cb) {
  cb()
}
