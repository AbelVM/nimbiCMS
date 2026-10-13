/**
 * Worker utilities.
 *
 * @module worker-manager
 */

import { debugWarn, incrementCounter } from "./utils/debug.js";
import { PowerCache } from "performance-helpers/powerCache";

const workerDiagnostics = {
  created: 0,
  constructionFailures: 0,
  blobUrlsCreated: 0,
  blobUrlsRevoked: 0,
  blobCacheEvictions: 0,
};

export function getWorkerDiagnostics() {
  return { ...workerDiagnostics };
}

/**
 * Convenience helper that builds a `Blob` URL from a raw worker source string
 * and returns a newly constructed `Worker`. If the environment does not
 * support `Blob`/`URL.createObjectURL` this returns `null`.
 *
 * @param {string} code - JavaScript source code for the worker as a string.
 * @returns {(Worker|null)} A Worker instance configured with `type: 'module'`, or `null` if creation failed.
 */
export function createWorkerFromRaw(code) {
  if (typeof Blob !== "undefined" && typeof URL !== "undefined" && code) {
    try {
      if (!createWorkerFromRaw._blobUrlCache) {
        createWorkerFromRaw._blobUrls = new Set();
        createWorkerFromRaw._blobUrlCache = new PowerCache({
          maxEntries: 200,
          onEvict: (k, v) => {
            try {
              if (typeof URL !== "undefined" && v) {
                URL.revokeObjectURL(v);
                workerDiagnostics.blobUrlsRevoked += 1;
                workerDiagnostics.blobCacheEvictions += 1;
              }
            } catch (e) {}
            createWorkerFromRaw._blobUrls?.delete(v);
          },
        });
      }
      const cache = createWorkerFromRaw._blobUrlCache;
      let workerUrl = cache.get(code);
      if (!workerUrl) {
        const blob = new Blob([code], { type: "application/javascript" });
        workerUrl = URL.createObjectURL(blob);
        cache.set(code, workerUrl);
        createWorkerFromRaw._blobUrls.add(workerUrl);
        workerDiagnostics.blobUrlsCreated += 1;
      }
      let worker = null;
      try {
        worker = new Worker(workerUrl, { type: "module" });
      } catch (err) {
        try {
          debugWarn("[worker-manager] Worker construction failed", err);
        } catch (e) {}
        workerDiagnostics.constructionFailures += 1;
        incrementCounter("workerConstructionFailure");
        return null;
      }
      try {
        worker.addEventListener("error", (ev) => {
          try {
            debugWarn("[worker-manager] Worker error", ev);
          } catch (e) {}
        });
      } catch (e) {}
      workerDiagnostics.created += 1;
      incrementCounter("workerCreated");
      return worker;
    } catch (err) {
      try {
        debugWarn("[worker-manager] createWorkerFromRaw failed", err);
      } catch (e) {}
    }
  }
  return null;
}

/**
 * Revoke cached Blob URLs created for raw workers.
 * @returns {void}
 */
export function disposeWorkerBlobUrlCache() {
  const urls = createWorkerFromRaw._blobUrls;
  if (!urls) return;
  for (const url of urls) {
    try {
      if (typeof URL !== "undefined") URL.revokeObjectURL(url);
      workerDiagnostics.blobUrlsRevoked += 1;
    } catch (e) {}
  }
  urls.clear();
  createWorkerFromRaw._blobUrlCache?.clear?.();
  delete createWorkerFromRaw._blobUrlCache;
  delete createWorkerFromRaw._blobUrls;
}
