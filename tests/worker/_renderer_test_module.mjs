/**
 * @module worker/renderer
 */
import { splitIntoSections as _splitIntoSections } from "../../src/utils/splitIntoSections.js";
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
} from "../../src/worker/rendererRuntime.js";

attachRendererWorker(globalThis);

export {
  _splitIntoSections,
  clearRendererImportCache,
  decodeHtmlEntitiesLocal,
  ensureHljs,
  handleWorkerMessage,
  handleWorkerMessageStream,
  importModuleWithCache,
  setRendererImportNegativeCacheTTL,
  slugifyHeading,
};
