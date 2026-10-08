import { setHreflangTags, setMetaTags } from "../src/seoManager.js";
import { setLanguages } from "../src/slugManager.js";

test("setHreflangTags uses a valid query separator for the home route", () => {
  const originalLocation = globalThis.location;
  try {
    setLanguages(["en", "fr"]);
    Object.defineProperty(globalThis, "location", {
      value: {
        origin: "https://example.test",
        pathname: "/docs/",
      },
      configurable: true,
    });
    setHreflangTags();
    const links = [...document.querySelectorAll('link[hreflang]')];
    expect(links.map((link) => link.href)).toEqual([
      "https://example.test/docs/?lang=en",
      "https://example.test/docs/?lang=fr",
      "https://example.test/docs/",
    ]);
  } finally {
    setLanguages([]);
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      configurable: true,
    });
    document.querySelectorAll('link[hreflang]').forEach((link) => link.remove());
  }
});

test("setMetaTags reconciles all alternate Open Graph locales", () => {
  setLanguages(["en", "fr", "pt-BR"]);
  setMetaTags({ meta: { title: "Home" } });

  expect(
    [...document.querySelectorAll('meta[property="og:locale:alternate"]')].map(
      (tag) => tag.getAttribute("content"),
    ),
  ).toEqual(["en", "fr", "pt_br"]);

  setLanguages(["de"]);
  setMetaTags({ meta: { title: "Home" } });
  expect(
    [...document.querySelectorAll('meta[property="og:locale:alternate"]')].map(
      (tag) => tag.getAttribute("content"),
    ),
  ).toEqual(["de"]);

  setLanguages([]);
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((tag) => tag.remove());
});

test("setHreflangTags removes tags when language configuration is cleared", () => {
  setLanguages(["en"]);
  setHreflangTags("home");
  expect(document.querySelector('link[hreflang="en"]')).toBeTruthy();

  setLanguages([]);
  setHreflangTags("home");
  expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(0);
});

test("setHreflangTags ignores invalid language tags", () => {
  setLanguages(["en", "not_a_language", "pt-BR", "en"]);
  setHreflangTags("home");

  expect([...document.querySelectorAll('link[hreflang]')].map((link) => link.getAttribute("hreflang"))).toEqual([
    "en",
    "pt-BR",
    "x-default",
  ]);

  setLanguages([]);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((tag) => tag.remove());
});