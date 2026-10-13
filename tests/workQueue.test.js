import { describe, it, expect } from "vitest";
import { createWorkQueue } from "../src/utils/workQueue.js";

/**
 * `Array.prototype.shift()` is O(n) because it re-indexes every remaining
 * element. The crawl and fetch queues are drained by several concurrent
 * workers and can hold 1000+ entries, so a naive `shift()` makes draining
 * O(n²). This suite pins the queue's semantics; the amortised-O(1) claim is
 * covered by the benchmark in `benchmarks/benchmark-work-queue.mjs`.
 */
describe("utils/workQueue", () => {
  it("drains in FIFO order", () => {
    const q = createWorkQueue(["a", "b", "c"]);
    expect(q.shift()).toBe("a");
    expect(q.shift()).toBe("b");
    expect(q.shift()).toBe("c");
    expect(q.shift()).toBeUndefined();
  });

  it("reports remaining length, not backing-array length", () => {
    const q = createWorkQueue(["a", "b", "c"]);
    expect(q.length).toBe(3);
    q.shift();
    // The backing array still holds the consumed slot until compaction, so
    // `length` must subtract the head cursor.
    expect(q.length).toBe(2);
    expect(q.size).toBe(2);
    expect(q.isEmpty).toBe(false);
  });

  it("accepts pushes after construction and interleaves correctly", () => {
    const q = createWorkQueue(["a"]);
    q.push("b");
    q.push("c");
    expect(q.length).toBe(3);
    expect(q.shift()).toBe("a");
    q.push("d");
    expect(q.shift()).toBe("b");
    expect(q.shift()).toBe("c");
    expect(q.shift()).toBe("d");
    expect(q.isEmpty).toBe(true);
  });

  it("take() removes up to count items, oldest first", () => {
    const q = createWorkQueue(["a", "b", "c", "d"]);
    expect(q.take(2)).toEqual(["a", "b"]);
    expect(q.length).toBe(2);
    // Fewer remaining than requested returns only what is left.
    expect(q.take(10)).toEqual(["c", "d"]);
    expect(q.isEmpty).toBe(true);
  });

  it("take() with zero or negative count removes nothing", () => {
    const q = createWorkQueue(["a", "b"]);
    expect(q.take(0)).toEqual([]);
    expect(q.take(-1)).toEqual([]);
    expect(q.length).toBe(2);
  });

  it("compacts so the backing array does not grow without bound", () => {
    const q = createWorkQueue();
    for (let i = 0; i < 10000; i++) q.push(i);
    for (let i = 0; i < 9999; i++) q.shift();
    // After draining nearly everything, the consumed prefix must have been
    // released rather than retained as 9999 holes.
    expect(q.length).toBe(1);
    expect(q.shift()).toBe(9999);
  });

  it("releases references to consumed items", () => {
    const q = createWorkQueue([{ big: "payload" }]);
    const item = q.shift();
    expect(item).toEqual({ big: "payload" });
    // The slot is cleared, so the queue does not retain the object.
    expect(q.take(1)).toEqual([]);
  });

  it("clear() empties the queue and resets the cursor", () => {
    const q = createWorkQueue(["a", "b", "c"]);
    q.shift();
    q.clear();
    expect(q.length).toBe(0);
    expect(q.isEmpty).toBe(true);
    expect(q.shift()).toBeUndefined();
    // Usable again after clearing.
    q.push("z");
    expect(q.shift()).toBe("z");
  });

  it("accepts any iterable, not just arrays", () => {
    const q = createWorkQueue(new Set(["a", "b"]));
    expect(q.length).toBe(2);
    expect(q.shift()).toBe("a");
  });

  it("handles empty and nullish construction", () => {
    expect(createWorkQueue().length).toBe(0);
    expect(createWorkQueue(null).length).toBe(0);
    expect(createWorkQueue(undefined).shift()).toBeUndefined();
  });

  it("does not mutate the array it was constructed from", () => {
    const source = ["a", "b", "c"];
    const q = createWorkQueue(source);
    q.shift();
    q.push("d");
    expect(source).toEqual(["a", "b", "c"]);
  });

  it("survives interleaved shift/take/push under load", () => {
    const q = createWorkQueue();
    const expected = [];
    for (let i = 0; i < 500; i++) {
      q.push(i);
      expected.push(i);
    }
    const got = [];
    while (!q.isEmpty) {
      const batch = q.take(7);
      got.push(...batch);
      if (batch.length === 0) break;
    }
    expect(got).toEqual(expected);
  });
});
