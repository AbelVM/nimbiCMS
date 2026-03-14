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
 * @returns {string|number} - A string or number selected by the function.
 */
export function simpleUnion() {
  return Math.random() < 0.5 ? 'foo' : 42
}

/**
 * @returns {Record<string, number[]>} - A record mapping string keys to arrays of numbers.
 */
export function recordExample() {
  return { anyKey: [1, 2, 3] }
}

/**
 * @param {any} opts - Options object with numeric fields `a` and `b` used to compute the sum.
 * @returns {{sum:number}} - Object containing the computed sum.
 */
export function sum(opts) {
  return { sum: (opts && opts.a || 0) + (opts && opts.b || 0) }
}

/**
 * @param {function} cb - Callback to invoke.
 * @returns {void} - No return value.
 */
export function callIt(cb) {
  cb()
}
