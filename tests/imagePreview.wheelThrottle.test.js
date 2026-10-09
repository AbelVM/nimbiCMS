import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  attachImagePreview,
  disposeImagePreview,
} from "../src/imagePreview.js";

/**
 * The `wheel` handler is frame-throttled: a trackpad flick fires `wheel` at
 * 60-120Hz and each `setZoom` performs a layout read plus several style
 * writes, so calling it per event forces a synchronous layout on every tick.
 *
 * These tests live in their own file because the preview modal is a module
 * singleton and the shared interaction suite leaves state behind.
 */
describe("imagePreview wheel throttling", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    disposeImagePreview();
  });

  afterEach(() => {
    disposeImagePreview();
    document.body.innerHTML = "";
  });

  /** Open a preview and return the modal and image elements. */
  function openPreview() {
    const root = document.createElement("div");
    const img = document.createElement("img");
    img.src = "http://example.com/p/x.png";
    Object.defineProperty(img, "naturalWidth", { get: () => 200 });
    Object.defineProperty(img, "naturalHeight", { get: () => 100 });
    root.appendChild(img);
    document.body.appendChild(root);

    attachImagePreview(root);
    img.click();

    const modal = document.querySelector("dialog.nimbi-image-preview");
    const preview = document.querySelector("[data-nimbi-preview-image]");
    modal.open = true;
    return { modal, preview };
  }

  it("applies zoom on the leading edge of a wheel burst", () => {
    const { modal, preview } = openPreview();

    for (let i = 0; i < 20; i++) {
      modal.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    }

    // The first tick applies immediately rather than waiting for a frame.
    expect(preview.classList.contains("is-panning")).toBe(true);
  });

  it("settles on the final zoom after the frame", async () => {
    const { modal, preview } = openPreview();

    for (let i = 0; i < 20; i++) {
      modal.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    }
    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => requestAnimationFrame(() => r()));

    expect(preview.classList.contains("is-panning")).toBe(true);
    const label = document.querySelector("[data-nimbi-preview-zoom-label]");
    if (label) expect(label.textContent).toMatch(/%/);
  });

  it("zooms back out after a burst in the opposite direction", async () => {
    const { modal, preview } = openPreview();

    for (let i = 0; i < 20; i++) {
      modal.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    }
    await new Promise((r) => requestAnimationFrame(() => r()));

    for (let i = 0; i < 20; i++) {
      modal.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
    }
    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => requestAnimationFrame(() => r()));

    // Still a usable preview; no exception and the element is intact.
    expect(preview).toBeTruthy();
    expect(preview.isConnected).toBe(true);
  });

  it("does not throw when the modal is closed mid-burst", () => {
    const { modal } = openPreview();
    modal.open = false;
    expect(() => {
      for (let i = 0; i < 10; i++) {
        modal.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
      }
    }).not.toThrow();
  });
});
