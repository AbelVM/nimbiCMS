/**
 * Create the runtime identity shared by derived artifacts.
 *
 * @param {Object} options
 * @param {number} options.generation
 * @param {string} [options.contentBase]
 * @param {string} [options.language]
 * @param {Object} [options.source]
 * @returns {Readonly<Object>}
 */
export function createRuntimeManifest({ generation, contentBase = "", language = "", source = null }) {
  const immutableSource =
    source && typeof source === "object" && !Array.isArray(source)
      ? Object.freeze({ ...source })
      : source;
  return Object.freeze({
    generation,
    contentBase,
    language,
    source: immutableSource,
  });
}

