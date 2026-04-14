/**
 * @module worker/renderer
 */
import {
  _splitIntoSections,
  attachRendererWorker,
  clearRendererImportCache,
  decodeHtmlEntitiesLocal,
  ensureHljs,
  handleWorkerMessage,
  handleWorkerMessageStream,
  importModuleWithCache,
  setRendererImportNegativeCacheTTL,
  slugifyHeading,
} from '../../src/worker/rendererRuntime.js'

attachRendererWorker(globalThis)

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
}
