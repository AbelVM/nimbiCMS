/**
 * DOM / event utilities: debounce, rafThrottle, and a small RAF batcher
 * These helpers coalesce rapid events and batch DOM writes using requestAnimationFrame.
 */
export function debounce(fn, wait = 150, options = {}) {
  let timer = null;
  const leading = !!options.leading;
  function debounced(...args) {
    const ctx = this;
    if (timer) clearTimeout(timer);
    if (leading && !timer) {
      try {
        fn.apply(ctx, args);
      } catch (e) {}
    }
    timer = setTimeout(() => {
      timer = null;
      if (!leading) {
        try {
          fn.apply(ctx, args);
        } catch (e) {}
      }
    }, wait);
  }
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

export function rafThrottle(fn) {
  let scheduled = false;
  let pendingArgs = null;
  let pendingCtx = null;
  function throttled(...args) {
    pendingArgs = args;
    pendingCtx = this;
    if (scheduled) return;
    scheduled = true;
    try {
      fn.apply(this, args);
    } catch (e) {}
    pendingArgs = null;
    pendingCtx = null;
    const tick = () => {
      scheduled = false;
      if (!pendingArgs) return;
      const nextArgs = pendingArgs;
      const nextCtx = pendingCtx;
      pendingArgs = null;
      pendingCtx = null;
      scheduled = true;
      try {
        fn.apply(nextCtx, nextArgs);
      } catch (e) {}
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(tick);
      } else {
        setTimeout(tick, 16);
      }
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(tick);
    } else {
      setTimeout(tick, 16);
    }
  }
  throttled.cancel = () => {
    scheduled = false;
    pendingArgs = null;
    pendingCtx = null;
  };
  return throttled;
}

function createRafBatcher() {
  let queue = [];
  let scheduled = false;
  return function schedule(fn) {
    if (typeof fn !== "function") return;
    const entry = { fn, cancelled: false };
    queue.push(entry);
    if (scheduled) return;
    scheduled = true;
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        scheduled = false;
        const q = queue.slice(0);
        queue.length = 0;
        for (const entry of q) {
          try {
            if (!entry.cancelled) entry.fn();
          } catch (e) {}
        }
      });
    } else {
      setTimeout(() => {
        scheduled = false;
        const q = queue.slice(0);
        queue.length = 0;
        for (const entry of q) {
          try {
            if (!entry.cancelled) entry.fn();
          } catch (e) {}
        }
      }, 0);
    }
    return { cancel: () => { entry.cancelled = true; } };
  };
}

// Shared scheduler for batching DOM writes
export const scheduleDOMWrite = createRafBatcher();
