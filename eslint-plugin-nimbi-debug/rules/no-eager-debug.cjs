/**
 * ESLint rule: no-eager-debug (CJS)
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow eager evaluation of expensive debug payloads',
      category: 'Best Practices',
      recommended: false
    },
    schema: [
      {
        type: 'object',
        properties: {
          debugNames: {
            type: 'array',
            items: { type: 'string' }
          },
          guardNames: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      wrapInFunction: 'Wrap expensive expressions passed to `{{name}}` in a function (e.g. () => value) to defer evaluation when logging is disabled.'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const debugNames = options.debugNames || ['debugInfo', 'debugWarn', 'debugError', 'debugLog', '_debugLog'];
    const guardNames = options.guardNames || ['isDebugLevel', '_routerShouldLog'];

    function containsGuardCall(node) {
      if (!node) return false;
      let found = false;
      function visit(n) {
        if (found || !n || typeof n !== 'object') return;
        if (n.type === 'CallExpression' && n.callee) {
          if (n.callee.type === 'Identifier' && guardNames.includes(n.callee.name)) found = true;
          if (n.callee.type === 'MemberExpression' && n.callee.property && n.callee.property.type === 'Identifier' && guardNames.includes(n.callee.property.name)) found = true;
        }
        for (const k in n) {
          if (found) break;
          if (k === 'parent') continue;
          const v = n[k];
          if (v && typeof v === 'object') {
            if (Array.isArray(v)) v.forEach(visit); else visit(v);
          }
        }
      }
      visit(node);
      return found;
    }

    function containsExpensive(node) {
      if (!node) return false;
      let found = false;
      function visit(n) {
        if (found || !n || typeof n !== 'object') return;
        if (n.type === 'CallExpression') { found = true; return; }
        if (n.type === 'TemplateLiteral' && n.expressions && n.expressions.length) { found = true; return; }
        if (n.type === 'BinaryExpression' && n.operator === '+') { found = true; return; }
        if (n.type === 'NewExpression') { found = true; return; }
        for (const k in n) {
          if (found) break;
          if (k === 'parent') continue;
          const v = n[k];
          if (v && typeof v === 'object') {
            if (Array.isArray(v)) v.forEach(visit); else visit(v);
          }
        }
      }
      visit(node);
      return found;
    }

    function isAllowedArg(node) {
      if (!node) return true;
      const t = node.type;
      if (t === 'Identifier' || t === 'Literal' || t === 'ArrowFunctionExpression' || t === 'FunctionExpression') return true;
      if ((t === 'ObjectExpression' || t === 'ArrayExpression') && !containsExpensive(node)) return true;
      return false;
    }

    return {
      CallExpression(node) {
        const callee = node.callee;
        let calleeName = null;
        if (callee.type === 'Identifier') calleeName = callee.name;
        if (callee.type === 'MemberExpression' && callee.property && callee.property.type === 'Identifier') calleeName = callee.property.name;
        if (!calleeName || !debugNames.includes(calleeName)) return;

        let anc = node.parent;
        while (anc) {
          if ((anc.type === 'IfStatement' || anc.type === 'ConditionalExpression') && anc.test && containsGuardCall(anc.test)) return;
          anc = anc.parent;
        }

        for (const arg of node.arguments) {
          if (!isAllowedArg(arg)) {
            if (containsExpensive(arg)) {
              context.report({ node: arg, messageId: 'wrapInFunction', data: { name: calleeName } });
            }
          }
        }
      }
    };
  }
};
