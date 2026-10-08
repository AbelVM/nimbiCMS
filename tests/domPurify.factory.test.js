vi.mock("dompurify", () => {
  const factory = () => factory;
  factory.version = "3.4.16";
  factory.isSupported = false;
  return { default: factory };
});

import { getDOMPurify } from "../src/utils/domPurify.js";

describe("DOMPurify factory normalization", () => {
  it("does not expose an unsupported factory as the sanitizer", () => {
    const sanitize = getDOMPurify();

    expect(sanitize("<p>content</p>")).toBe("<p>content</p>");
    expect(String(sanitize)).not.toContain("=> factory");
  });
});
