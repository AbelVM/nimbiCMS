import { describe, expect, it, vi } from "vitest";
import { inspectSeo } from "../scripts/inspect-seo.mjs";

describe("inspectSeo crawlability checks", () => {
  it("requires robots.txt to declare the inspected sitemap", async () => {
    const pages = new Map([
      ["https://example.test/", '<title>Home</title><meta name="robots" content="index"><link rel="canonical" href="https://example.test/"><link rel="alternate" hreflang="en" href="https://example.test/"><script type="application/ld+json">{"@type":"WebPage"}</script><link rel="manifest" href="manifest.json"><a href="?page=home">Home</a>'],
      ["https://example.test/manifest.json", "{}"],
      ["https://example.test/sitemap.xml", "<urlset></urlset>"],
      ["https://example.test/robots.txt", "User-agent: *\nSitemap: https://example.test/sitemap.xml\n"],
      ["https://example.test/?page=home", "<html></html>"],
    ]);
    vi.stubGlobal("fetch", vi.fn(async (url) => ({
      status: 200,
      ok: true,
      url: String(url),
      text: async () => pages.get(String(url)) || "",
    })));

    const result = await inspectSeo("https://example.test/");

    expect(result.crawlability.robots.sitemapDeclared).toBe(true);
    expect(result.crawlabilityOk).toBe(true);
    vi.unstubAllGlobals();
  });
});