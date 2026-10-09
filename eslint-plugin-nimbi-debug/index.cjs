module.exports = {
  rules: {
    'no-eager-debug': require('./rules/no-eager-debug.cjs'),
    'no-empty-catch-without-comment': require('./rules/no-empty-catch-without-comment.cjs'),
    'no-silent-catch': require('./rules/no-silent-catch.cjs')
  }
}
