/**
 * A FIFO work queue with amortised-O(1) `shift()`.
 *
 * `Array.prototype.shift()` is O(n): it re-indexes every remaining element.
 * The crawl and fetch queues in this codebase are drained by several
 * concurrent workers and can hold up to `crawlMaxQueue` entries (1000+), so a
 * naive `shift()` makes queue draining O(n²) overall.
 *
 * This helper keeps a `head` cursor into the backing array and only compacts
 * once the consumed prefix reaches half the array, which makes each `shift()`
 * amortised O(1). Compaction also releases the references of consumed items,
 * so drained entries can be garbage-collected instead of being retained by
 * the array's tail.
 *
 * @module utils/workQueue
 */

/**
 * Create a FIFO work queue.
 *
 * @param {Iterable<any>} [items] - Initial contents, in order.
 * @returns {{push: Function, shift: Function, take: Function,
 *   clear: Function, length: number, size: number, isEmpty: boolean}}
 */
export function createWorkQueue(items) {
  let arr =
    items == null ? [] : Array.isArray(items) ? items.slice() : Array.from(items);
  let head = 0;

  /**
   * Drop the consumed prefix once it dominates the array.
   *
   * `splice` is itself O(n), but it only runs when `head` is at least half the
   * array, so the cost is amortised across the elements that were skipped.
   * @private
   */
  function compact() {
    if (head === 0) return;
    if (head < 32 && head * 2 < arr.length) return;
    arr = arr.slice(head);
    head = 0;
  }

  return {
    /**
     * Append an item.
     * @param {*} item
     * @returns {void}
     */
    push(item) {
      arr.push(item);
    },

    /**
     * Remove and return the oldest item, or `undefined` when empty.
     * @returns {*}
     */
    shift() {
      if (head >= arr.length) return undefined;
      const value = arr[head];
      // Release the reference so a drained entry is not retained by the
      // array's tail until the next compaction.
      arr[head] = undefined;
      head += 1;
      compact();
      return value;
    },

    /**
     * Remove and return up to `count` items, oldest first.
     *
     * Replaces the `queue.splice(0, n)` batch pattern used by the concurrent
     * crawl workers.
     * @param {number} count - Maximum items to take.
     * @returns {Array<*>} The removed items, possibly fewer than `count`.
     */
    take(count) {
      const n = Math.max(0, Math.floor(Number(count) || 0));
      if (n === 0 || head >= arr.length) return [];
      const end = Math.min(arr.length, head + n);
      const batch = arr.slice(head, end);
      // Release the references so taken entries are not retained.
      for (let i = head; i < end; i++) arr[i] = undefined;
      head = end;
      compact();
      return batch;
    },

    /**
     * Discard all pending items.
     * @returns {void}
     */
    clear() {
      arr = [];
      head = 0;
    },

    /** Number of items still pending. */
    get length() {
      return arr.length - head;
    },

    /** Alias for {@link length}, for call sites that read `size`. */
    get size() {
      return arr.length - head;
    },

    /** Whether no items are pending. */
    get isEmpty() {
      return head >= arr.length;
    },
  };
}

export default createWorkQueue;
