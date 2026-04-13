/**
 * Bounded concurrency runner backed by PowerSemaphore from performance-helpers.
 * @module utils/concurrency
 */
import { PowerSemaphore } from 'performance-helpers/powerSemaphore'

/**
 * Run items through an async worker function with limited concurrency.
 * @template T,U
 * @param {T[]} items - Array of items to process
 * @param {(item:T, index:number)=>Promise<U>} worker - Async worker function
 * @param {number} [concurrency=4] - Max concurrent workers
 * @returns {Promise<Array<U>>}
 */
export async function runWithConcurrency(items, worker, concurrency = 4) {
  if (!Array.isArray(items) || items.length === 0) return []
  const sem = new PowerSemaphore(Math.max(1, Number(concurrency) || 1))
  return Promise.all(items.map((item, idx) => sem.run(() => worker(item, idx))))
}
