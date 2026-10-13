import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  injectLink,
  disconnectBulmaObservers,
} from "../src/bulmaManager.js";

/**
 * Bulmaswatch theme stylesheets are kept last in `<head>` by a
 * MutationObserver. Those observers previously survived teardown, watching
 * `document.head` for the lifetime of the page and retaining the link they
 * were moving.
 */
describe("bulmaManager head observers", () => {
  let observed;

  beforeEach(() => {
    document.head.innerHTML = "";
    observed = [];
    // Capture every observer constructed so the test can assert on teardown
    // without reaching into module internals.
    globalThis.MutationObserver = class {
      constructor(cb) {
        this.cb = cb;
        this.target = null;
        this.disconnected = false;
        observed.push(this);
      }
      observe(target) {
        this.target = target;
      }
      disconnect() {
        this.disconnected = true;
      }
    };
  });

  afterEach(() => {
    disconnectBulmaObservers();
    document.head.innerHTML = "";
    delete globalThis.MutationObserver;
  });

  it("creates an observer for a bulmaswatch theme link", () => {
    injectLink("http://cdn.test/theme.css", {
      "data-bulmaswatch-theme": "dark",
    });

    expect(observed.length).toBe(1);
    expect(observed[0].target).toBe(document.head);
  });

  it("does not create an observer for a plain link", () => {
    injectLink("http://cdn.test/plain.css", { rel: "stylesheet" });
    expect(observed.length).toBe(0);
  });

  it("disconnectBulmaObservers disconnects every observer", () => {
    injectLink("http://cdn.test/a.css", { "data-bulmaswatch-theme": "dark" });
    injectLink("http://cdn.test/b.css", { "data-bulmaswatch-theme": "light" });

    expect(observed.length).toBe(2);
    expect(observed.every((o) => !o.disconnected)).toBe(true);

    disconnectBulmaObservers();

    expect(observed.every((o) => o.disconnected)).toBe(true);
  });

  it("is idempotent", () => {
    injectLink("http://cdn.test/a.css", { "data-bulmaswatch-theme": "dark" });
    disconnectBulmaObservers();
    expect(() => disconnectBulmaObservers()).not.toThrow();
    expect(observed[0].disconnected).toBe(true);
  });

  it("stops observing once the stylesheet is removed", () => {
    injectLink("http://cdn.test/a.css", { "data-bulmaswatch-theme": "dark" });
    const observer = observed[0];
    const link = document.head.querySelector("link");

    // Detach the link, then fire the callback as a head mutation would.
    link.remove();
    observer.cb([], observer);

    expect(observer.disconnected).toBe(true);
  });

  it("does not throw when MutationObserver is unavailable", () => {
    delete globalThis.MutationObserver;
    expect(() =>
      injectLink("http://cdn.test/a.css", { "data-bulmaswatch-theme": "dark" }),
    ).not.toThrow();
  });
});
