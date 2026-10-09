/**
 * Benchmark: `Array.shift()` vs the head-index work queue.
 *
 * `Array.prototype.shift()` is O(n) — it re-indexes every remaining element.
 * The crawl and fetch queues in this codebase are drained by several
 * concurrent workers and can hold up to `crawlMaxQueue` entries (1000+), so a
 * naive `shift()` makes queue draining O(n²) overall.
 *
 * Usage: node benchmarks/benchmark-work-queue.mjs
 */
import { performance } from "node:perf_hooks";
import { createWorkQueue } from "../src/utils/workQueue.js";

const SIZES = [100, 1000, 5000];

/**
 * Drain an array using `shift()`, the previous implementation.
 * @param {Array<number>} items
 * @returns {number}
 */
function drainWithShift(items) {
  const arr = items.slice();
  let sum = 0;
  while (arr.length) {
    const v = arr.shift();
    sum += v;
  }
  return sum;
}

/**
 * Drain using the head-index work queue.
 * @param {Array<number>} items
 * @returns {number}
 */
function drainWithWorkQueue(items) {
  const q = createWorkQueue(items);
  let sum = 0;
  while (!q.isEmpty) {
    const v = q.shift();
    sum += v;
  }
  return sum;
}

console.log("queue drain: Array.shift() vs head-index work queue\n");
console.log(
  "size".padStart(7),
  "shift_ms".padStart(11),
  "queue_ms".padStart(11),
  "speedup".padStart(9),
);

for (const n of SIZES) {
  const items = Array.from({ length: n }, (_, i) => i);

  let t0 = performance.now();
  const a = drainWithShift(items);
  const shiftMs = performance.now() - t0;

  t0 = performance.now();
  const b = drainWithWorkQueue(items);
  const queueMs = performance.now() - t0;

  // Both must produce the same total, otherwise the comparison is meaningless.
  if (a !== b) {
    console.error(`MISMATCH at n=${n}: ${a} vs ${b}`);
    process.exitCode = 1;
  }

  console.log(
    String(n).padStart(7),
    shiftMs.toFixed(2).padStart(11),
    queueMs.toFixed(2).padStart(11),
    `${(shiftMs / queueMs).toFixed(1)}x`.padStart(9),
  );
}

console.log("\nBoth implementations produce identical output; only cost differs.");
