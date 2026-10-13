import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buildNav } from "../src/nav.js";

/**
 * `runRenderWithTransition` prefers the native View Transitions API and falls
 * back to a CSS class transition when it is unavailable. Both paths must
 * render exactly once and must never leave the content element stuck in the
 * inactive state.
 */
const t = (k) => k;

/** Build a nav and return the render trigger plus the content element. */
async function setup({ withViewTransition }) {
  const navbarWrap = document.createElement("header");
  const container = document.createElement("main");
  container.className = "nimbi-content";
  const navHtml = '<a href="README.md">Home</a><a href="about.md">About</a>';
  const renderByQuery = vi.fn(() => Promise.resolve());

  if (withViewTransition) {
    document.startViewTransition = vi.fn((cb) => {
      const result = cb();
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(result),
        updateCallbackDone: Promise.resolve(result),
        skipTransition: vi.fn(),
      };
    });
  } else {
    delete document.startViewTransition;
  }

  await buildNav(
    navbarWrap,
    container,
    navHtml,
    "/content/",
    "README.md",
    t,
    renderByQuery,
    false,
    "eager",
    1,
  );
  document.body.appendChild(navbarWrap);
  return { navbarWrap, container, renderByQuery };
}

describe("runRenderWithTransition", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    delete document.startViewTransition;
    document.body.innerHTML = "";
  });

  it("uses document.startViewTransition when available", async () => {
    const { container, renderByQuery } = await setup({
      withViewTransition: true,
    });

    // Trigger a route change through the burger/nav click path is awkward
    // here, so drive the transition directly via a popstate-equivalent: the
    // nav wires `runRenderWithTransition` to link clicks.
    const link = container.ownerDocument.querySelector(".navbar-item");
    expect(link).toBeTruthy();

    // Simulate the navigation the navbar performs.
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(document.startViewTransition).toHaveBeenCalled();
    expect(renderByQuery).toHaveBeenCalled();
    // The class-based fallback must not have been used.
    expect(container.classList.contains("is-inactive")).toBe(false);
  });

  it("falls back to the is-inactive class when View Transitions is absent", async () => {
    const { container, renderByQuery } = await setup({
      withViewTransition: false,
    });
    expect(typeof document.startViewTransition).toBe("undefined");

    const link = container.ownerDocument.querySelector(".navbar-item");
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 30));

    expect(renderByQuery).toHaveBeenCalled();
    // The class is added then removed on the next frame; it must not stick.
    expect(container.classList.contains("is-inactive")).toBe(false);
  });

  it("does not throw when the transition promise rejects", async () => {
    // A skipped transition rejects `ready`/`finished`; that is normal (another
    // transition started, or the document was hidden) and must not surface.
    document.startViewTransition = vi.fn(() => ({
      ready: Promise.reject(new Error("ready failed")),
      finished: Promise.reject(new Error("transition skipped")),
      updateCallbackDone: Promise.reject(new Error("cb failed")),
      skipTransition: vi.fn(),
    }));

    const { container, renderByQuery } = await setup({ withViewTransition: true });
    // Replace with a mock that still runs the DOM-update callback (as the real
    // API does) but whose transition promises reject.
    document.startViewTransition = vi.fn((cb) => {
      const result = cb();
      return {
        ready: Promise.reject(new Error("ready failed")),
        finished: Promise.reject(new Error("transition skipped")),
        updateCallbackDone: Promise.reject(new Error("cb failed")),
        skipTransition: vi.fn(),
      };
    });

    const link = document.querySelector(".navbar-item");
    expect(link).toBeTruthy();
    expect(() =>
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      ),
    ).not.toThrow();
    await new Promise((r) => setTimeout(r, 30));

    expect(renderByQuery).toHaveBeenCalled();
    expect(container.classList.contains("is-inactive")).toBe(false);
  });

  it("renders exactly once per navigation", async () => {
    const { renderByQuery } = await setup({ withViewTransition: true });
    const link = document.querySelector(".navbar-item");
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 30));
    expect(renderByQuery).toHaveBeenCalledTimes(1);
  });
});
