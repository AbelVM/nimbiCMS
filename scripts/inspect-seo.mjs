#!/usr/bin/env node

const required = ["title", "robots", "canonical", "hreflang", "structuredData"];

function first(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || null;
}

async function statusOf(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return {
      status: response.status,
      ok: response.ok,
      finalUrl: response.url || url,
      body: await response.text(),
    };
  } catch (_) {
    return { status: 0, ok: false, finalUrl: url, body: "" };
  }
}

export async function inspectSeo(target, options = {}) {
  const maxDeepLinks = Number.isInteger(options.maxDeepLinks) && options.maxDeepLinks > 0
    ? options.maxDeepLinks
    : 20;
  const maxReportedLinks = Number.isInteger(options.maxReportedLinks) && options.maxReportedLinks > 0
    ? options.maxReportedLinks
    : 100;
  const response = await fetch(target, { redirect: "follow" });
  const html = await response.text();
  const result = {
    url: target,
    finalUrl: response.url,
    status: response.status,
    title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    robots: first(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
    canonical: first(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    hreflang: [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']*)["'][^>]+href=["']([^"']*)["']/gi)].map((match) => ({ lang: match[1], href: match[2] })),
    structuredData: [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap((match) => {
      try { return [JSON.parse(match[1])]; } catch (_) { return []; }
    }),
  };
  const base = new URL(response.url || target);
  const manifestPath = first(html, /<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']*)["']/i);
  const internalLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => !/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(href))
    .map((href) => new URL(href, base).href);
  const [manifest, sitemap, robots] = await Promise.all([
    manifestPath ? statusOf(new URL(manifestPath, base)) : { status: 0, ok: false },
    statusOf(new URL("sitemap.xml", base)),
    statusOf(new URL("robots.txt", base)),
  ]);
  const sitemapUrl = new URL("sitemap.xml", base).href;
  const robotsDeclaresSitemap = robots.ok && new RegExp(
    `^\\s*Sitemap:\\s*${sitemapUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\s*$`,
    "im",
  ).test(robots.body);
  const deepLinks = await Promise.all(
    [...new Set(internalLinks)].slice(0, maxDeepLinks).map(async (href) => ({
      href,
      ...(await statusOf(href)),
    })),
  );
  result.crawlability = {
    manifest: manifestPath ? { href: new URL(manifestPath, base).href, ...manifest } : null,
    sitemap,
    robots: {
      href: new URL("robots.txt", base).href,
      status: robots.status,
      ok: robots.ok,
      sitemapDeclared: robotsDeclaresSitemap,
    },
    internalLinkCount: internalLinks.length,
    internalLinks: [...new Set(internalLinks)].slice(0, maxReportedLinks),
    deepLinksChecked: deepLinks.length,
    deepLinks,
    deepLinksOk: deepLinks.every((link) => link.ok),
  };
  result.ok = response.ok && required.every((key) => key === "hreflang" ? result[key].length > 0 : key === "structuredData" ? result[key].length > 0 : Boolean(result[key]));
  result.crawlabilityOk = Boolean(
    result.crawlability.manifest?.ok &&
    result.crawlability.sitemap.ok &&
    result.crawlability.robots.ok &&
    result.crawlability.robots.sitemapDeclared &&
    result.crawlability.internalLinkCount,
  );
  return result;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const target = process.argv[2] || "https://abelvm.github.io/nimbiCMS/";
  const maxLinksArg = process.argv.find((arg) => arg.startsWith("--max-links="));
  const maxDeepLinks = maxLinksArg ? Number(maxLinksArg.slice("--max-links=".length)) : undefined;
  const result = await inspectSeo(target, { maxDeepLinks });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok || !result.crawlabilityOk) process.exitCode = 1;
}
