import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { initCMS, destroy } from "../src/init.js";
import { teardownSlugWorkerPool } from "../src/slugManager.js";
import { teardownRendererWorkerPool } from "../src/markdown.js";
import { teardownAnchorWorkerPool } from "../src/htmlBuilder.js";

/**
 * Worker-pool teardown must not hang.
 *
 * `pool.drain()` accepts a `{ timeout }` option; without it a worker stuck
 * mid-task keeps the teardown promise pending forever and `destroy()` never
 * resolves. The timeout is passed by all three teardown functions; these
 * tests pin the observable contract — teardown is safe with no pool,
 * idempotent, and completes promptly through the real `destroy()` path.
 */
describe("worker pool teardown", () => {
  const teardowns = [
    teardownSlugWorkerPool,
    teardownRendererWorkerPool,
    teardownAnchorWorkerPool,
  ];

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      text: async () => "# Title\n\nBody",
    });
  });

  afterEach(async () => {
    await destroy();
  });

  it("resolves immediately when no pool exists", async () => {
    for (const teardown of teardowns) {
      await expect(teardown()).resolves.toBeUndefined();
    }
  });

  it("is idempotent across repeated calls", async () => {
    for (const teardown of teardowns) {
      await expect(teardown()).resolves.toBeUndefined();
      await expect(teardown()).resolves.toBeUndefined();
      await expect(teardown()).resolves.toBeUndefined();
    }
  });

  it("completes promptly through the real destroy() path", async () => {
    await initCMS({ el: "#app", searchIndex: false });

    // `destroy()` awaits all three pool teardowns. If any drain could hang,
    // this would never resolve.
    const started = Date.now();
    await destroy();
    const elapsed = Date.now() - started;

    // Generous bound: the point is that it terminates at all, not the exact
    // cost. A hung drain would blow far past this.
    expect(elapsed).toBeLessThan(10000);
  });

  it("leaves pools reusable after teardown", async () => {
    await initCMS({ el: "#app", searchIndex: false });
    await destroy();

    // A second init must be able to create fresh pools. `initCMS` resolves to
    // void, so assert only that it settles.
    document.body.innerHTML = '<div id="app"></div>';
    await expect(
      initCMS({ el: "#app", searchIndex: false }),
    ).resolves.toBeUndefined();
  });
});
