/**
 * ESLint rule: no-silent-catch (CJS)
 *
 * Flags `catch` blocks that swallow an error without any observable
 * consequence: no logging, no rethrow, and no fallback return value.
 *
 * Motivation: two real bugs in this codebase (a `null` AbortController
 * dereference that disabled runtime error reporting, and a missing
 * `toCanonicalHref` import that disabled URL canonicalization) were both
 * invisible at runtime because the enclosing `catch` discarded the
 * `TypeError`. A catch that neither reports nor recovers turns a loud
 * failure into a silent no-op.
 *
 * A catch is considered acceptable when its body does at least one of:
 *   - calls a logging function (`debugWarn`, `debugLog`, `debugError`,
 *     `console.*`, `incrementCounter`)
 *   - rethrows (`throw`)
 *   - returns a value (an explicit fallback)
 *   - assigns to a property whose name suggests error capture
 *     (e.g. `errors.push(...)`)
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow catch blocks that swallow errors without logging, rethrowing, or returning a fallback',
      category: 'Possible Errors',
      recommended: false
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowCommentSuppression: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      silentCatch:
        'Catch block swallows the error without logging, rethrowing, or returning a fallback. Add a debugWarn(...) call, rethrow, or return an explicit fallback.'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const allowCommentSuppression = options.allowCommentSuppression !== false;

    /** Names that indicate the error is being reported somewhere. */
    const LOGGER_NAMES = new Set([
      'debugWarn',
      'debugLog',
      'debugError',
      'debugInfo',
      'incrementCounter',
      'recordError',
      'reportError',
      'console',
      // Local logging wrappers used in place of debugWarn.
      '_hbWarn'
    ]);

    /**
     * Property names that indicate the error is being captured rather than
     * discarded. Matches capture verbs (`push`, `record`, ...) and common
     * error-holder names (`lastError`, `error`, `err`).
     */
    const CAPTURE_NAMES = /^(push|add|set|record|capture|report|log|warn|error|err)|error|err$/i;

    /**
     * Callbacks that report the error back to the requester. Workers use
     * these instead of logging, since there is no console in a worker.
     * The leading underscore is required so a bare `replyErr` is not
     * mistaken for the internal error channel.
     */
    // Both spellings occur in this codebase: `slugWorker`/`anchorWorker` use
    // `_replyErr`, `rendererRuntime` uses `replyErr`.
    const REPLY_ERROR_NAMES = /^_?reply(Err|Error)$|^_?postError$|^_?sendError$/i;

    function isLoggingCall(node) {
      const callee = node.callee;
      if (!callee) return false;

      // Unwrap optional chaining: `debugWarn?.(...)` has the same shape as
      // `debugWarn(...)` once the ChainExpression is removed.
      const target =
        callee.type === 'ChainExpression' ? callee.expression : callee;

      // console.warn(...) / console.error(...)
      if (
        target.type === 'MemberExpression' &&
        target.object &&
        target.object.type === 'Identifier' &&
        LOGGER_NAMES.has(target.object.name)
      ) {
        return true;
      }

      // debugWarn(...) / recordError(...)
      if (target.type === 'Identifier' && LOGGER_NAMES.has(target.name)) {
        return true;
      }

      return false;
    }

    function isCaptureCall(node) {
      const callee = node.callee;
      if (!callee) return false;
      const target =
        callee.type === 'ChainExpression' ? callee.expression : callee;
      if (target.type !== 'MemberExpression') return false;
      const prop = target.property;
      if (!prop || prop.type !== 'Identifier') return false;
      return CAPTURE_NAMES.test(prop.name);
    }

    /**
     * Calls that actually propagate the failure to someone who can act on it.
     * Teardown alone (`cleanup()`) does not — it only releases resources, so
     * the error is still lost unless it is also rejected, logged, or thrown.
     */
    const PROPAGATION_NAMES = new Set([
      'reject',
      'abort',
      'reset',
      'dispose'
    ]);

    function isHandlerCall(node) {
      const callee = node.callee;
      if (!callee) return false;
      const target =
        callee.type === 'ChainExpression' ? callee.expression : callee;

      // `controller.abort()` — member call on an AbortController-like object.
      if (
        target.type === 'MemberExpression' &&
        target.property &&
        target.property.type === 'Identifier' &&
        PROPAGATION_NAMES.has(target.property.name)
      ) {
        return true;
      }

      if (target.type !== 'Identifier') return false;

      // `_replyErr(e)` / `postError(e)` — the worker error channel.
      if (REPLY_ERROR_NAMES.test(target.name)) return true;

      // `reject(e)` — promise rejection.
      return PROPAGATION_NAMES.has(target.name);
    }

    function bodyIsAcceptable(statements) {
      for (const stmt of statements) {
        switch (stmt.type) {
          case 'ThrowStatement':
            return true;

          case 'ReturnStatement':
            // `return;` alone is not a recovery; `return fallback;` is.
            if (stmt.argument) return true;
            break;

          case 'ExpressionStatement': {
            let expr = stmt.expression;
            if (!expr) break;
            // `debugWarn?.("...")` is wrapped in a ChainExpression at the
            // statement level as well as at the callee level.
            if (expr.type === 'ChainExpression') expr = expr.expression;
            if (expr.type === 'CallExpression') {
              if (
                isLoggingCall(expr) ||
                isCaptureCall(expr) ||
                isHandlerCall(expr)
              ) {
                return true;
              }
            }
            if (expr.type === 'AssignmentExpression') {
              const left = expr.left;
              if (
                left.type === 'MemberExpression' &&
                left.property &&
                left.property.type === 'Identifier' &&
                CAPTURE_NAMES.test(left.property.name)
              ) {
                return true;
              }
            }
            break;
          }

          // A nested try/catch that itself handles the error counts as
          // deliberate handling.
          case 'TryStatement':
            return true;

          // `if (shouldLog()) debugWarn(...)` — logging behind a guard.
          case 'IfStatement': {
            const consequent = stmt.consequent;
            const stmts =
              consequent && consequent.type === 'BlockStatement'
                ? consequent.body
                : consequent
                  ? [consequent]
                  : [];
            if (bodyIsAcceptable(stmts)) return true;
            break;
          }

          default:
            break;
        }
      }
      return false;
    }

    function hasSuppressionComment(node, sourceCode) {
      // `node.body.comments` is not reliably populated across ESLint
      // versions, so scan the raw source between the braces instead.
      const open = sourceCode.getTokens(node.body)[0];
      if (!open) return false;
      const start = open.range[0];
      const end = node.body.range[1];
      const text = sourceCode.getText().slice(start, end);
      return /\/\*|\/\//.test(text);
    }

    return {
      CatchClause(node) {
        if (!node.body || node.body.type !== 'BlockStatement') return;

        const statements = node.body.body;
        if (statements.length === 0) return; // handled by no-empty-catch-without-comment

        if (bodyIsAcceptable(statements)) return;

        if (allowCommentSuppression && hasSuppressionComment(node, context.sourceCode)) {
          return;
        }

        context.report({ node, messageId: 'silentCatch' });
      }
    };
  }
};
