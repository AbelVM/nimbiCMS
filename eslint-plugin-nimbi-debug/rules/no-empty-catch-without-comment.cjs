/**
 * ESLint rule: no-empty-catch-without-comment (CJS)
 *
 * Disallows empty catch blocks that do not contain a comment explaining
 * why it is safe to swallow the error.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow empty catch blocks without an explanatory comment',
      category: 'Best Practices',
      recommended: false
    },
    schema: [],
    messages: {
      emptyCatch: 'Empty catch block must contain a comment explaining why the error is safe to ignore.'
    }
  },

  create(context) {
    return {
      CatchClause(node) {
        // Only check catch blocks with a single BlockStatement body
        if (!node.body || node.body.type !== 'BlockStatement') return;

        const body = node.body.body;
        if (body.length === 0) {
          context.report({ node, messageId: 'emptyCatch' });
          return;
        }

        // Check if the only statement is a comment-only block
        // (i.e., the block has no actual statements, only comments)
        if (body.length === 0) {
          context.report({ node, messageId: 'emptyCatch' });
          return;
        }

        // If there are statements, check if they are all empty
        // (e.g., just a comment or a no-op)
        // We allow catch blocks that have at least one comment
        const hasComment = node.body.comments && node.body.comments.length > 0;
        if (!hasComment) {
          // Check if the catch body has any non-empty statements
          const hasNonEmptyStatement = body.some((stmt) => {
            // Empty statement (just a semicolon) is not considered a comment
            if (stmt.type === 'EmptyStatement') return false;
            return true;
          });
          if (!hasNonEmptyStatement) {
            context.report({ node, messageId: 'emptyCatch' });
          }
        }
      }
    };
  }
};
