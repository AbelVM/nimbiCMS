import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as runtimeSitemap from "../src/runtimeSitemap.js";
import * as slugManager from "../src/slugManager.js";

const INDEX = [{ slug: "home", title: "Home", path: "home.md" }];

function setLocation(value) {
  Object.defineProperty(globalThis, "location", {
    value: { href: "https://example.test/", ...value },
    configurable: true,
  });
}

describe("runtimeSitemap document-write isolation", () => {
  let origLocation;
  let origOpen;
  let origWrite;
  let origClose;
  let origCreateObjectURL;
  let origRevokeObjectURL;
  let calls;
  let writes;

  beforeEach(() => {
    origLocation = globalThis.location;
    calls = { open: 0, write: 0, close: 0 };
    writes = [];
    origOpen = document.open;
    origWrite = document.write;
    origClose = document.close;
    document.open = () => {
      calls.open++;
    };
    document.write = (s) => {
      calls.write++;
      writes.push(String(s ?? ""));
    };
    document.close = () => {
      calls.close++;
    };
    origCreateObjectURL = URL.createObjectURL;
    origRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => "blob:fake";
    URL.revokeObjectURL = () => {};
    setLocation({ origin: "https://example.test", pathname: "/sitemap.xml", search: "" });
    slugManager.slugToMd.clear();
    slugManager.slugToMd.set("home", "home.md");
  });

  afterEach(() => {
    document.open = origOpen;
    document.write = origWrite;
    document.close = origClose;
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;
    Object.defineProperty(globalThis, "location", {
      value: origLocation,
      configurable: true,
    });
    slugManager.slugToMd.clear();
    try {
      if (typeof window !== "undefined") {
        if (window.__nimbiSitemapWriteTimer) {
          clearTimeout(window.__nimbiSitemapWriteTimer);
          window.__nimbiSitemapWriteTimer = null;
        }
        window.__nimbiSitemapPendingWrite = null;
        window.__nimbiSitemapRenderedAt = undefined;
        window.__nimbiSitemapJson = undefined;
        window.__nimbiSitemapFinal = undefined;
      }
    } catch {}
  });

  it("returns the XML body without touching the document by default", async () => {
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const out = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(typeof out).toBe("string");
      expect(out).toContain("<?xml");
      expect(out).toContain("<urlset");
      expect(out).toContain("?page=" + encodeURIComponent("home"));
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });

  it("returns the RSS body without touching the document by default", async () => {
    setLocation({ origin: "https://example.test", pathname: "/", search: "?rss" });
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const out = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(typeof out).toBe("string");
      expect(out).toContain("<rss");
      expect(out).toContain("?page=" + encodeURIComponent("home"));
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });

  it("returns the Atom body without touching the document by default", async () => {
    setLocation({ origin: "https://example.test", pathname: "/", search: "?atom" });
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const out = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(typeof out).toBe("string");
      expect(out).toContain("<feed");
      expect(out).toContain("?page=" + encodeURIComponent("home"));
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });

  it("returns the HTML body without touching the document by default", async () => {
    setLocation({
      origin: "https://example.test",
      pathname: "/sitemap.html",
      search: "",
    });
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const out = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(typeof out).toBe("string");
      expect(out).toContain("<h1>Sitemap</h1>");
      expect(out).toContain("?page=" + encodeURIComponent("home"));
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });

  it("returns the llms.txt body without touching the document by default", async () => {
    setLocation({
      origin: "https://example.test",
      pathname: "/llms.txt",
      search: "",
    });
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const out = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(typeof out).toBe("string");
      expect(out.length).toBeGreaterThan(0);
      expect(out).toContain("home");
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });

  it("still replaces the document when writeToDocument is opted into", async () => {
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      const handled = await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
        writeToDocument: true,
      });
      expect(handled).toBe(true);
      // the write is scheduled on a short timer; flush it
      await new Promise((r) => setTimeout(r, 80));
      expect(calls.write).toBeGreaterThan(0);
      const written = writes.join("");
      expect(written).toContain("<?xml");
      expect(written).toContain("?page=" + encodeURIComponent("home"));
    } finally {
      spy.mockRestore();
    }
  });

  it("publishes sitemap diagnostics without writing the document", async () => {
    const spy = vi
      .spyOn(slugManager, "whenSearchIndexReady")
      .mockResolvedValue(INDEX);
    try {
      await runtimeSitemap.handleSitemapRequest({
        includeAllMarkdown: true,
        waitForIndexMs: 1000,
      });
      expect(Array.isArray(window.__nimbiSitemapFinal)).toBe(true);
      expect(window.__nimbiSitemapFinal.length).toBeGreaterThan(0);
      expect(window.__nimbiSitemapJson).toBeTruthy();
      expect(calls).toEqual({ open: 0, write: 0, close: 0 });
    } finally {
      spy.mockRestore();
    }
  });
});
