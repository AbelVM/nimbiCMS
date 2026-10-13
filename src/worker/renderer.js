/**
 * @module worker/renderer
 */
import { splitIntoSections } from "../utils/splitIntoSections.js";
import {
  attachRendererWorker,
  clearRendererImportCache,
  decodeHtmlEntitiesLocal,
  ensureHljs,
  handleWorkerMessage,
  handleWorkerMessageStream,
  importModuleWithCache,
  setRendererImportNegativeCacheTTL,
  slugifyHeading,
} from "./rendererRuntime.js";

attachRendererWorker(globalThis);

export {
  // Retained under the historical name for existing consumers/tests.
  splitIntoSections as _splitIntoSections,
  clearRendererImportCache,
  decodeHtmlEntitiesLocal,
  ensureHljs,
  handleWorkerMessage,
  handleWorkerMessageStream,
  importModuleWithCache,
  setRendererImportNegativeCacheTTL,
  slugifyHeading,
};
