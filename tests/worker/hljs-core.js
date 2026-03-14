export default {
  registerLanguage(name, def) {
    // noop register for tests
    this._registered = this._registered || new Set()
    this._registered.add(name)
  },
  getLanguage(name) {
    return (this._registered && this._registered.has(name)) || name === 'plaintext'
  },
  highlight(code, { language } = {}) {
    return { value: `<em>${language||'plaintext'}</em>` }
  }
}
