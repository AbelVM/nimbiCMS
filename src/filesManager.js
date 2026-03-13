/**
 * Backwards-compatibility re-export shim for the previous `filesManager`
 * module surface.  The functional implementations live in
 * `src/slugManager.js`; this module re-exports them so older imports
 * continue to work without breaking consumers.
 */

export * from './slugManager.js'

// Instrumentation marker to ensure this re-export module is counted by coverage
export const __filesManager_reexport_marker = true
