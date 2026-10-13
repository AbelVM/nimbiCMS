import { createUI } from "../src/ui.js";

test("createUI exposes online and offline connection state", () => {
  const contentWrap = document.createElement("main");
  const navWrap = document.createElement("nav");
  const container = document.createElement("div");
  const abortController = new AbortController();
  const events = [];
  document.addEventListener(
    "nimbi.connectionchange",
    (event) => events.push(event.detail.online),
    { signal: abortController.signal },
  );
  const ui = createUI({
    contentWrap,
    navWrap,
    container,
    t: () => "",
    homePage: "home.md",
    signal: abortController.signal,
  });
  expect(ui).toBeTruthy();
  window.dispatchEvent(new Event("offline"));
  window.dispatchEvent(new Event("online"));
  expect(document.documentElement.dataset.nimbiConnection).toBe("online");
  expect(events.slice(-2)).toEqual([false, true]);
  expect(document.documentElement.dataset.nimbiVisibility).toBe("visible");
  abortController.abort();
});