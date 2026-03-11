// legacy module maintained for backwards compatibility.  All slug-related
// and markdown-fetching logic now lives in `slugManager.js`.  We re-export
// the entirety of that module here so existing imports continue to work.

export * from './slugManager.js'
