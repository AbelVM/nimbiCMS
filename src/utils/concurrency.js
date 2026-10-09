/**
 * Bounded-concurrency map helper.
 *
 * Several modules need to run an async worker over a list of items while
 * capping how many are in flight at once (crawling, anchor rewriting, slug
 * probing). This is the single implementation; it is backed by
 * `PowerSemaphore` so the concurrency limit and abort handling behave
 * identically everywhere.
 *
 * @module utils/concurrency
 */
import { PowerSemaphore } from "performance-helpers/powerSemaphore";

/**
 * Run `worker` over every item with at most `concurrency` in flight.
 *
 * Results are returned in input order. An aborted `signal` rejects the
 * pending work rather than leaving promises dangling.
 *
 * @param {Iterable<any>} items - Items to process (Array, Set, or any iterable).
 * @param {(item: any, index: number) => Promise<any>|any} worker - Async worker.
 * @param {number} [concurrency=4] - Maximum simultaneous workers.
 * @param {AbortSignal} [signal] - Optional abort signal.
 * @returns {Promise<Array<any>>} Results in input order.
 */
export async function runWithConcurrency(
  items,
  worker,
  concurrency = 4,
  signal,
) {
  // Accept any iterable: callers pass Arrays and Sets interchangeably, and
  // silently returning [] for a Set would drop the work entirely.
  const values =
    items == null ? [] : Array.isArray(items) ? items : Array.from(items);
  if (values.length === 0) return [];
  const limit = Math.max(1, Number(concurrency) || 1);
  const sem = new PowerSemaphore(limit);
  return Promise.all(
    values.map((item, idx) => sem.run(() => worker(item, idx), { signal })),
  );
}

