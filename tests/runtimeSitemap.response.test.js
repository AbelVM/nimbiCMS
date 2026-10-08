import { handleSitemapRequest } from "../src/runtimeSitemap.js";

test("handleSitemapRequest can return a response without writing the document", async () => {
  const originalLocation = globalThis.location;
  const originalOpen = document.open;
  try {
    Object.defineProperty(globalThis, "location", {
      value: {
        origin: "https://example.test",
        pathname: "/sitemap.xml",
        search: "",
      },
      configurable: true,
    });
    document.open = () => {
      throw new Error("document writer should not run");
    };
    const output = await handleSitemapRequest({
      returnResponse: true,
      index: [{ slug: "home", title: "Home" }],
      includeAllMarkdown: false,
    });
    expect(output).toBeInstanceOf(Response);
    expect(output.headers.get("content-type")).toContain("application/xml");
    expect(output.headers.get("x-nimbi-generation")).toBeNull();
    expect(await output.text()).toContain("<urlset");
  } finally {
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      configurable: true,
    });
    document.open = originalOpen;
  }
});

test("host adapters can create a response without browser globals", async () => {
  const originalDocument = globalThis.document;
  const originalLocation = globalThis.location;
  try {
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(globalThis, "location", {
      value: undefined,
      configurable: true,
    });
    const output = await handleSitemapRequest({
      url: "https://example.test/sitemap.xml",
      returnResponse: true,
      index: [{ slug: "home", title: "Home" }],
      runtimeManifest: {
        generation: 7,
        language: "en",
        contentBase: "/content",
      },
    });
    expect(output).toBeInstanceOf(Response);
    expect(output.headers.get("x-nimbi-generation")).toBe("7");
    expect(output.headers.get("x-nimbi-language")).toBe("en");
    expect(output.headers.get("x-nimbi-content-base")).toBe("/content");
    expect(await output.text()).toContain("https://example.test/?page=home");
  } finally {
    Object.defineProperty(globalThis, "document", {
      value: originalDocument,
      configurable: true,
    });
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      configurable: true,
    });
  }
});