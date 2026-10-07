var zl = Object.create, Ri = Object.defineProperty, $l = Object.getOwnPropertyDescriptor, Dl = Object.getOwnPropertyNames, Bl = Object.getPrototypeOf, bo = Object.prototype.hasOwnProperty, wo = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), Fi = (e, t) => {
  let n = {};
  for (var r in e)
    Ri(n, r, {
      get: e[r],
      enumerable: !0
    });
  return t || Ri(n, Symbol.toStringTag, { value: "Module" }), n;
}, Ul = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (var i = Dl(t), a = 0, o = i.length, s; a < o; a++)
      s = i[a], !bo.call(e, s) && s !== n && Ri(e, s, {
        get: ((l) => t[l]).bind(null, s),
        enumerable: !(r = $l(t, s)) || r.enumerable
      });
  return e;
}, ko = (e, t, n) => (n = e != null ? zl(Bl(e)) : {}, Ul(t || !e || !e.__esModule || !bo.call(e, "default") ? Ri(n, "default", {
  value: e,
  enumerable: !0
}) : n, e)), cs = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] }) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Calling `require` for "' + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
function jl(e, t = "ERR_ITEM") {
  return !e || typeof e != "object" ? {
    error: !0,
    code: t,
    message: e ? String(e) : void 0,
    stack: void 0
  } : {
    error: !0,
    code: e.code || t,
    message: e.message,
    stack: e.stack
  };
}
function us(e) {
  return !e || !e.error ? String(e) : `${e.code || "ERR"}: ${e.message || ""}`;
}
var Li = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
  const e = Number(process.hrtime.bigint() / 1000000n);
  Li = Date.now() - e;
} catch {
  Li = null;
}
var $e = () => {
  const e = Date.now();
  if (typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number") try {
    const t = performance.timeOrigin + performance.now();
    return Math.abs(t - e) < 1e3 ? t : e;
  } catch {
  }
  if (Li != null) try {
    const t = Number(process.hrtime.bigint() / 1000000n) + Li;
    return Math.abs(t - e) < 1e3 ? t : e;
  } catch {
    return e;
  }
  return e;
}, Zn = Object.freeze({
  error: "error",
  warn: "warn",
  info: "info",
  log: "log",
  debug: "debug",
  table: "table"
}), Wl = () => typeof globalThis < "u" && globalThis?.console ? globalThis.console : typeof self < "u" && self?.console ? self.console : typeof window < "u" && window?.console ? window.console : typeof global < "u" && global?.console ? global.console : null, qt = Wl();
function Fl(e) {
  try {
    return JSON.stringify(e);
  } catch {
    try {
      const n = typeof WeakSet == "function" ? /* @__PURE__ */ new WeakSet() : /* @__PURE__ */ new Set();
      return JSON.stringify(e, function(r, i) {
        if (i && typeof i == "object") {
          if (n.has(i)) return "[Circular]";
          n.add(i);
        }
        return typeof i == "function" ? `[Function: ${i.name || "anonymous"}]` : typeof i == "symbol" ? String(i) : typeof i == "bigint" ? i.toString() + "n" : i;
      });
    } catch {
      try {
        return String(e);
      } catch {
        return "[Unserializable]";
      }
    }
  }
}
var xo = class {
  constructor(e = 0, t = {}) {
    this._debugLevel = 0, this._counters = /* @__PURE__ */ Object.create(null), this._format = t?.format || "text", this.name = t?.name || null, this._formatter = typeof t?.formatter == "function" ? t.formatter : null, this._output = typeof t?.output == "function" ? t.output : null, this.setDebugLevel(e);
  }
  setDebugLevel(e) {
    let t = NaN;
    typeof e == "number" ? t = e : typeof e == "string" || typeof e == "boolean" ? t = Number(e) : (e instanceof Number || e instanceof String || e instanceof Boolean) && (t = Number(e.valueOf())), this._debugLevel = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  }
  getDebugLevel() {
    return this._debugLevel;
  }
  isDebugLevel(e = 1) {
    return Number(this._debugLevel) >= Number(e || 1);
  }
  isDebug() {
    return this.isDebugLevel(1);
  }
  _resolveLogArgs(e) {
    return e.map((t) => {
      if (typeof t == "function") try {
        return t();
      } catch (n) {
        return n;
      }
      return t;
    });
  }
  _emit(e, t, n, r, i = {}) {
    if (!this.isDebugLevel(e)) return;
    const a = this._resolveLogArgs(r);
    let o = {
      level: n,
      msg: i.msgArray ? a : a.length === 1 ? a[0] : a,
      ts: $e(),
      format: this._format
    };
    if (this.name && (o.name = this.name), this._formatter) try {
      const s = this._formatter(o);
      if (s != null) {
        if (typeof s == "string") {
          if (this._output) {
            try {
              this._output(s);
            } catch {
            }
            return;
          }
          typeof qt?.[t] == "function" && qt[t](s);
          return;
        }
        o = s;
      }
    } catch {
    }
    if (this._output) {
      try {
        this._output(o);
      } catch {
      }
      return;
    }
    if (typeof qt?.[t] == "function")
      if (this._format === "json") try {
        const s = typeof o == "string" ? o : Fl(o);
        qt[t](s);
      } catch {
        try {
          qt[t](...Array.isArray(a) ? a : [a]);
        } catch {
        }
      }
      else qt[t](...a);
  }
  error(...e) {
    const t = e.map((n) => {
      try {
        if (n?.error) return us(n);
        if (n instanceof Error || n && typeof n == "object") return us(jl(n));
      } catch {
      }
      return n;
    });
    this._emit(1, "error", Zn.error, t);
  }
  warn(...e) {
    this._emit(2, "warn", Zn.warn, e);
  }
  info(...e) {
    this._emit(3, "info", Zn.info, e);
  }
  log(...e) {
    this._emit(3, "log", Zn.log, e);
  }
  debug(...e) {
    this._emit(3, "debug", Zn.debug, e);
  }
  table(...e) {
    if (!this.isDebugLevel(3) || !qt) return;
    if (this._format === "json") {
      this._emit(3, "log", Zn.table, e, { msgArray: !0 });
      return;
    }
    const t = this._resolveLogArgs(e);
    typeof qt.table == "function" ? qt.table(...t) : typeof qt.log == "function" && qt.log(...t);
  }
  incrementCounter(e) {
    if (!this.isDebug()) return;
    const t = String(e || "");
    t && (this._counters[t] = (this._counters[t] || 0) + 1);
  }
  getDebugCounters() {
    return Object.assign({}, this._counters);
  }
  resetDebugCounters() {
    this._counters = /* @__PURE__ */ Object.create(null);
  }
}, Rn = new xo(0);
function ql(e) {
  Rn.setDebugLevel(e);
}
function So(e = 1) {
  return Rn.isDebugLevel(e);
}
function vo() {
  return Rn.isDebug();
}
function Lr(...e) {
  Rn.error(...e);
}
function x(...e) {
  Rn.warn(...e);
}
function bn(...e) {
  Rn.info(...e);
}
function de(...e) {
  Rn.log(...e);
}
function Ao(e) {
  Rn.incrementCounter(e);
}
var Ur = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Ga(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Ur, e)) throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function") throw new TypeError("hook callback must be a function");
  Ur[e].push(t);
}
function ed(e) {
  Ga("onPageLoad", e);
}
function td(e) {
  Ga("onNavBuild", e);
}
function nd(e) {
  Ga("transformHtml", e);
}
async function hs(e, t) {
  const n = Ur[e] || [];
  for (const r of n) try {
    await r(t);
  } catch (i) {
    try {
      x("[nimbi-cms] runHooks callback failed", i);
    } catch {
    }
  }
}
function rd() {
  Object.keys(Ur).forEach((e) => {
    Ur[e].length = 0;
  });
}
var Hl = /* @__PURE__ */ wo(((e, t) => {
  function n(S) {
    return S instanceof Map ? S.clear = S.delete = S.set = function() {
      throw new Error("map is read-only");
    } : S instanceof Set && (S.add = S.clear = S.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(S), Object.getOwnPropertyNames(S).forEach((X) => {
      const fe = S[X], Re = typeof fe;
      (Re === "object" || Re === "function") && !Object.isFrozen(fe) && n(fe);
    }), S;
  }
  var r = class {
    constructor(S) {
      S.data === void 0 && (S.data = {}), this.data = S.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  };
  function i(S) {
    return S.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function a(S, ...X) {
    const fe = /* @__PURE__ */ Object.create(null);
    for (const Re in S) fe[Re] = S[Re];
    return X.forEach(function(Re) {
      for (const We in Re) fe[We] = Re[We];
    }), fe;
  }
  var o = "</span>", s = (S) => !!S.scope, l = (S, { prefix: X }) => {
    if (S.startsWith("language:")) return S.replace("language:", "language-");
    if (S.includes(".")) {
      const fe = S.split(".");
      return [`${X}${fe.shift()}`, ...fe.map((Re, We) => `${Re}${"_".repeat(We + 1)}`)].join(" ");
    }
    return `${X}${S}`;
  }, c = class {
    constructor(S, X) {
      this.buffer = "", this.classPrefix = X.classPrefix, S.walk(this);
    }
    addText(S) {
      this.buffer += i(S);
    }
    openNode(S) {
      if (!s(S)) return;
      const X = l(S.scope, { prefix: this.classPrefix });
      this.span(X);
    }
    closeNode(S) {
      s(S) && (this.buffer += o);
    }
    value() {
      return this.buffer;
    }
    span(S) {
      this.buffer += `<span class="${S}">`;
    }
  }, f = (S = {}) => {
    const X = { children: [] };
    return Object.assign(X, S), X;
  }, d = class Eo {
    constructor() {
      this.rootNode = f(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    add(X) {
      this.top.children.push(X);
    }
    openNode(X) {
      const fe = f({ scope: X });
      this.add(fe), this.stack.push(fe);
    }
    closeNode() {
      if (this.stack.length > 1) return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    walk(X) {
      return this.constructor._walk(X, this.rootNode);
    }
    static _walk(X, fe) {
      return typeof fe == "string" ? X.addText(fe) : fe.children && (X.openNode(fe), fe.children.forEach((Re) => this._walk(X, Re)), X.closeNode(fe)), X;
    }
    static _collapse(X) {
      typeof X != "string" && X.children && (X.children.every((fe) => typeof fe == "string") ? X.children = [X.children.join("")] : X.children.forEach((fe) => {
        Eo._collapse(fe);
      }));
    }
  }, u = class extends d {
    constructor(S) {
      super(), this.options = S;
    }
    addText(S) {
      S !== "" && this.add(S);
    }
    startScope(S) {
      this.openNode(S);
    }
    endScope() {
      this.closeNode();
    }
    __addSublanguage(S, X) {
      const fe = S.root;
      X && (fe.scope = `language:${X}`), this.add(fe);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  };
  function p(S) {
    return S ? typeof S == "string" ? S : S.source : null;
  }
  function m(S) {
    return h("(?=", S, ")");
  }
  function g(S) {
    return h("(?:", S, ")*");
  }
  function y(S) {
    return h("(?:", S, ")?");
  }
  function h(...S) {
    return S.map((X) => p(X)).join("");
  }
  function b(S) {
    const X = S[S.length - 1];
    return typeof X == "object" && X.constructor === Object ? (S.splice(S.length - 1, 1), X) : {};
  }
  function _(...S) {
    return "(" + (b(S).capture ? "" : "?:") + S.map((X) => p(X)).join("|") + ")";
  }
  function w(S) {
    return new RegExp(S.toString() + "|").exec("").length - 1;
  }
  function A(S, X) {
    const fe = S && S.exec(X);
    return fe && fe.index === 0;
  }
  var z = new RegExp(_(/\[(?:[^\\\]]|\\.)*\]/, /\(\?<(?![=!])[^>]+>/, /\(\?'[^']+'/, /\(\??/, /\\([1-9][0-9]*)/, /\\./));
  function j(S, { joinWith: X }) {
    let fe = 0;
    return S.map((Re) => {
      fe += 1;
      const We = fe;
      let Ge = p(Re), ye = "";
      for (; Ge.length > 0; ) {
        const pe = z.exec(Ge);
        if (!pe) {
          ye += Ge;
          break;
        }
        ye += Ge.substring(0, pe.index), Ge = Ge.substring(pe.index + pe[0].length), pe[0][0] === "\\" && pe[1] ? ye += "\\" + String(Number(pe[1]) + We) : (ye += pe[0], (pe[0] === "(" || /^\(\?[<']/.test(pe[0])) && fe++);
      }
      return ye;
    }).map((Re) => `(${Re})`).join(X);
  }
  var W = /\b\B/, Q = "[a-zA-Z]\\w*", ae = "[a-zA-Z_]\\w*", ue = "\\b\\d+(\\.\\d+)?", ne = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", C = "\\b(0b[01]+)", N = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", L = (S = {}) => {
    const X = /^#![ ]*\//;
    return S.binary && (S.begin = h(X, /.*\b/, S.binary, /\b.*/)), a({
      scope: "meta",
      begin: X,
      end: /$/,
      relevance: 0,
      "on:begin": (fe, Re) => {
        fe.index !== 0 && Re.ignoreMatch();
      }
    }, S);
  }, E = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, I = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [E]
  }, Z = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [E]
  }, $ = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, re = function(S, X, fe = {}) {
    const Re = a({
      scope: "comment",
      begin: S,
      end: X,
      contains: []
    }, fe);
    Re.contains.push({
      scope: "doctag",
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const We = _("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
    return Re.contains.push({ begin: h(/[ ]+/, "(", We, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), Re;
  }, oe = re("//", "$"), me = re("/\\*", "\\*/"), he = re("#", "$"), Se = {
    scope: "number",
    begin: ue,
    relevance: 0
  }, De = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, le = {
    scope: "number",
    begin: C,
    relevance: 0
  }, Be = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [E, {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [E]
    }]
  }, Je = {
    scope: "title",
    begin: Q,
    relevance: 0
  }, st = {
    scope: "title",
    begin: ae,
    relevance: 0
  }, v = {
    begin: "\\.\\s*[a-zA-Z_]\\w*",
    relevance: 0
  }, M = function(S) {
    return Object.assign(S, {
      "on:begin": (X, fe) => {
        fe.data._beginMatch = X[1];
      },
      "on:end": (X, fe) => {
        fe.data._beginMatch !== X[1] && fe.ignoreMatch();
      }
    });
  }, q = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: I,
    BACKSLASH_ESCAPE: E,
    BINARY_NUMBER_MODE: le,
    BINARY_NUMBER_RE: C,
    COMMENT: re,
    C_BLOCK_COMMENT_MODE: me,
    C_LINE_COMMENT_MODE: oe,
    C_NUMBER_MODE: De,
    C_NUMBER_RE: ne,
    END_SAME_AS_BEGIN: M,
    HASH_COMMENT_MODE: he,
    IDENT_RE: Q,
    MATCH_NOTHING_RE: W,
    METHOD_GUARD: v,
    NUMBER_MODE: Se,
    NUMBER_RE: ue,
    PHRASAL_WORDS_MODE: $,
    QUOTE_STRING_MODE: Z,
    REGEXP_MODE: Be,
    RE_STARTERS_RE: N,
    SHEBANG: L,
    TITLE_MODE: Je,
    UNDERSCORE_IDENT_RE: ae,
    UNDERSCORE_TITLE_MODE: st
  });
  function D(S, X) {
    S.input[S.index - 1] === "." && X.ignoreMatch();
  }
  function R(S, X) {
    S.className !== void 0 && (S.scope = S.className, delete S.className);
  }
  function B(S, X) {
    X && S.beginKeywords && (S.begin = "\\b(" + S.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", S.__beforeBegin = D, S.keywords = S.keywords || S.beginKeywords, delete S.beginKeywords, S.relevance === void 0 && (S.relevance = 0));
  }
  function O(S, X) {
    Array.isArray(S.illegal) && (S.illegal = _(...S.illegal));
  }
  function K(S, X) {
    if (S.match) {
      if (S.begin || S.end) throw new Error("begin & end are not supported with match");
      S.begin = S.match, delete S.match;
    }
  }
  function U(S, X) {
    S.relevance === void 0 && (S.relevance = 1);
  }
  var H = (S, X) => {
    if (!S.beforeMatch) return;
    if (S.starts) throw new Error("beforeMatch cannot be used with starts");
    const fe = Object.assign({}, S);
    Object.keys(S).forEach((Re) => {
      delete S[Re];
    }), S.keywords = fe.keywords, S.begin = h(fe.beforeMatch, m(fe.begin)), S.starts = {
      relevance: 0,
      contains: [Object.assign(fe, { endsParent: !0 })]
    }, S.relevance = 0, delete fe.beforeMatch;
  }, G = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    "list",
    "value"
  ], ie = "keyword";
  function ge(S, X, fe = ie) {
    const Re = /* @__PURE__ */ Object.create(null);
    return typeof S == "string" ? We(fe, S.split(" ")) : Array.isArray(S) ? We(fe, S) : Object.keys(S).forEach(function(Ge) {
      Object.assign(Re, ge(S[Ge], X, Ge));
    }), Re;
    function We(Ge, ye) {
      X && (ye = ye.map((pe) => pe.toLowerCase())), ye.forEach(function(pe) {
        const Ee = pe.split("|");
        Re[Ee[0]] = [Ge, Pe(Ee[0], Ee[1])];
      });
    }
  }
  function Pe(S, X) {
    return X ? Number(X) : Ce(S) ? 0 : 1;
  }
  function Ce(S) {
    return G.includes(S.toLowerCase());
  }
  var Ie = {}, ve = (S) => {
    console.error(S);
  }, qe = (S, ...X) => {
    console.log(`WARN: ${S}`, ...X);
  }, Ue = (S, X) => {
    Ie[`${S}/${X}`] || (console.log(`Deprecated as of ${S}. ${X}`), Ie[`${S}/${X}`] = !0);
  }, Wt = /* @__PURE__ */ new Error();
  function Ln(S, X, { key: fe }) {
    let Re = 0;
    const We = S[fe], Ge = {}, ye = {};
    for (let pe = 1; pe <= X.length; pe++)
      ye[pe + Re] = We[pe], Ge[pe + Re] = !0, Re += w(X[pe - 1]);
    S[fe] = ye, S[fe]._emit = Ge, S[fe]._multi = !0;
  }
  function qn(S) {
    if (Array.isArray(S.begin)) {
      if (S.skip || S.excludeBegin || S.returnBegin)
        throw ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Wt;
      if (typeof S.beginScope != "object" || S.beginScope === null)
        throw ve("beginScope must be object"), Wt;
      Ln(S, S.begin, { key: "beginScope" }), S.begin = j(S.begin, { joinWith: "" });
    }
  }
  function sr(S) {
    if (Array.isArray(S.end)) {
      if (S.skip || S.excludeEnd || S.returnEnd)
        throw ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Wt;
      if (typeof S.endScope != "object" || S.endScope === null)
        throw ve("endScope must be object"), Wt;
      Ln(S, S.end, { key: "endScope" }), S.end = j(S.end, { joinWith: "" });
    }
  }
  function on(S) {
    S.scope && typeof S.scope == "object" && S.scope !== null && (S.beginScope = S.scope, delete S.scope);
  }
  function Hn(S) {
    on(S), typeof S.beginScope == "string" && (S.beginScope = { _wrap: S.beginScope }), typeof S.endScope == "string" && (S.endScope = { _wrap: S.endScope }), qn(S), sr(S);
  }
  function Gn(S) {
    function X(ye, pe) {
      return new RegExp(p(ye), "m" + (S.case_insensitive ? "i" : "") + (S.unicodeRegex ? "u" : "") + (pe ? "g" : ""));
    }
    class fe {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      addRule(pe, Ee) {
        Ee.position = this.position++, this.matchIndexes[this.matchAt] = Ee, this.regexes.push([Ee, pe]), this.matchAt += w(pe) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const pe = this.regexes.map((Ee) => Ee[1]);
        this.matcherRe = X(j(pe, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      exec(pe) {
        this.matcherRe.lastIndex = this.lastIndex;
        const Ee = this.matcherRe.exec(pe);
        if (!Ee) return null;
        const at = Ee.findIndex((ln, Mn) => Mn > 0 && ln !== void 0), Ke = this.matchIndexes[at];
        return Ee.splice(0, at), Object.assign(Ee, Ke);
      }
    }
    class Re {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      getMatcher(pe) {
        if (this.multiRegexes[pe]) return this.multiRegexes[pe];
        const Ee = new fe();
        return this.rules.slice(pe).forEach(([at, Ke]) => Ee.addRule(at, Ke)), Ee.compile(), this.multiRegexes[pe] = Ee, Ee;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      addRule(pe, Ee) {
        this.rules.push([pe, Ee]), Ee.type === "begin" && this.count++;
      }
      exec(pe) {
        const Ee = this.getMatcher(this.regexIndex);
        Ee.lastIndex = this.lastIndex;
        let at = Ee.exec(pe);
        if (this.resumingScanAtSamePosition() && !(at && at.index === this.lastIndex)) {
          const Ke = this.getMatcher(0);
          Ke.lastIndex = this.lastIndex + 1, at = Ke.exec(pe);
        }
        return at && (this.regexIndex += at.position + 1, this.regexIndex === this.count && this.considerAll()), at;
      }
    }
    function We(ye) {
      const pe = new Re();
      return ye.contains.forEach((Ee) => pe.addRule(Ee.begin, {
        rule: Ee,
        type: "begin"
      })), ye.terminatorEnd && pe.addRule(ye.terminatorEnd, { type: "end" }), ye.illegal && pe.addRule(ye.illegal, { type: "illegal" }), pe;
    }
    function Ge(ye, pe) {
      const Ee = ye;
      if (ye.isCompiled) return Ee;
      [
        R,
        K,
        Hn,
        H
      ].forEach((Ke) => Ke(ye, pe)), S.compilerExtensions.forEach((Ke) => Ke(ye, pe)), ye.__beforeBegin = null, [
        B,
        O,
        U
      ].forEach((Ke) => Ke(ye, pe)), ye.isCompiled = !0;
      let at = null;
      return typeof ye.keywords == "object" && ye.keywords.$pattern && (ye.keywords = Object.assign({}, ye.keywords), at = ye.keywords.$pattern, delete ye.keywords.$pattern), at = at || /\w+/, ye.keywords && (ye.keywords = ge(ye.keywords, S.case_insensitive)), Ee.keywordPatternRe = X(at, !0), pe && (ye.begin || (ye.begin = /\B|\b/), Ee.beginRe = X(Ee.begin), !ye.end && !ye.endsWithParent && (ye.end = /\B|\b/), ye.end && (Ee.endRe = X(Ee.end)), Ee.terminatorEnd = p(Ee.end) || "", ye.endsWithParent && pe.terminatorEnd && (Ee.terminatorEnd += (ye.end ? "|" : "") + pe.terminatorEnd)), ye.illegal && (Ee.illegalRe = X(ye.illegal)), ye.contains || (ye.contains = []), ye.contains = [].concat(...ye.contains.map(function(Ke) {
        return ti(Ke === "self" ? ye : Ke);
      })), ye.contains.forEach(function(Ke) {
        Ge(Ke, Ee);
      }), ye.starts && Ge(ye.starts, pe), Ee.matcher = We(Ee), Ee;
    }
    if (S.compilerExtensions || (S.compilerExtensions = []), S.contains && S.contains.includes("self")) throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return S.classNameAliases = a(S.classNameAliases || {}), Ge(S);
  }
  function or(S) {
    return S ? S.endsWithParent || or(S.starts) : !1;
  }
  function ti(S) {
    return S.variants && !S.cachedVariants && (S.cachedVariants = S.variants.map(function(X) {
      return a(S, { variants: null }, X);
    })), S.cachedVariants ? S.cachedVariants : or(S) ? a(S, { starts: S.starts ? a(S.starts) : null }) : Object.isFrozen(S) ? a(S) : S;
  }
  var ni = "11.12.0", lr = class extends Error {
    constructor(S, X) {
      super(S), this.name = "HTMLInjectionError", this.html = X;
    }
  }, Cn = i, Jt = a, en = /* @__PURE__ */ Symbol("nomatch"), ri = 7, cr = function(S) {
    const X = /* @__PURE__ */ Object.create(null), fe = /* @__PURE__ */ Object.create(null), Re = [];
    let We = !0;
    const Ge = "Could not find the language '{}', did you forget to load/include a language module?", ye = {
      disableAutodetect: !0,
      name: "Plain text",
      contains: []
    };
    let pe = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      __emitter: u
    };
    function Ee(J) {
      return pe.noHighlightRe.test(J);
    }
    function at(J) {
      let ke = J.className + " ";
      ke += J.parentNode ? J.parentNode.className : "";
      const Ne = pe.languageDetectRe.exec(ke);
      if (Ne) {
        const Ve = Vt(Ne[1]);
        return Ve || (qe(Ge.replace("{}", Ne[1])), qe("Falling back to no-highlight mode for this block.", J)), Ve ? Ne[1] : "no-highlight";
      }
      return ke.split(/\s+/).find((Ve) => Ee(Ve) || Vt(Ve));
    }
    function Ke(J, ke, Ne) {
      let Ve = "", tt = "";
      typeof ke == "object" ? (Ve = J, Ne = ke.ignoreIllegals, tt = ke.language) : (Ue("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ue("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), tt = J, Ve = ke), Ne === void 0 && (Ne = !0);
      const Tt = {
        code: Ve,
        language: tt
      };
      nn("before:highlight", Tt);
      const At = Tt.result ? Tt.result : ln(Tt.language, Tt.code, Ne);
      return At.code = Tt.code, nn("after:highlight", At), At;
    }
    function ln(J, ke, Ne, Ve) {
      const tt = /* @__PURE__ */ Object.create(null);
      function Tt(P, F) {
        return P.keywords[F];
      }
      function At() {
        if (!Te.keywords) {
          nt.addText(He);
          return;
        }
        let P = 0;
        Te.keywordPatternRe.lastIndex = 0;
        let F = Te.keywordPatternRe.exec(He), ce = "";
        for (; F; ) {
          ce += He.substring(P, F.index);
          const be = Bt.case_insensitive ? F[0].toLowerCase() : F[0], Me = Tt(Te, be);
          if (Me) {
            const [rt, xt] = Me;
            if (nt.addText(ce), ce = "", tt[be] = (tt[be] || 0) + 1, tt[be] <= ri && (Y += xt), rt.startsWith("_")) ce += F[0];
            else {
              const fn = Bt.classNameAliases[rt] || rt;
              Ft(F[0], fn);
            }
          } else ce += F[0];
          P = Te.keywordPatternRe.lastIndex, F = Te.keywordPatternRe.exec(He);
        }
        ce += He.substring(P), nt.addText(ce);
      }
      function Rt() {
        if (He === "") return;
        let P = null;
        if (typeof Te.subLanguage == "string") {
          if (!X[Te.subLanguage]) {
            nt.addText(He);
            return;
          }
          P = ln(Te.subLanguage, He, !0, gr[Te.subLanguage]), gr[Te.subLanguage] = P._top;
        } else P = ur(He, Te.subLanguage.length ? Te.subLanguage : null);
        Te.relevance > 0 && (Y += P.relevance), nt.__addSublanguage(P._emitter, P.language);
      }
      function _t() {
        Te.subLanguage != null ? Rt() : At(), He = "";
      }
      function Ft(P, F) {
        P !== "" && (nt.startScope(F), nt.addText(P), nt.endScope());
      }
      function un(P, F) {
        let ce = 1;
        const be = F.length - 1;
        for (; ce <= be; ) {
          if (!P._emit[ce]) {
            ce++;
            continue;
          }
          const Me = Bt.classNameAliases[P[ce]] || P[ce], rt = F[ce];
          Me ? Ft(rt, Me) : (He = rt, At(), He = ""), ce++;
        }
      }
      function Lt(P, F) {
        return P.scope && typeof P.scope == "string" && nt.openNode(Bt.classNameAliases[P.scope] || P.scope), P.beginScope && (P.beginScope._wrap ? (Ft(He, Bt.classNameAliases[P.beginScope._wrap] || P.beginScope._wrap), He = "") : P.beginScope._multi && (un(P.beginScope, F), He = "")), Te = Object.create(P, { parent: { value: Te } }), Te;
      }
      function ui(P, F, ce) {
        let be = A(P.endRe, ce);
        if (be) {
          if (P["on:end"]) {
            const Me = new r(P);
            P["on:end"](F, Me), Me.isMatchIgnored && (be = !1);
          }
          if (be) {
            for (; P.endsParent && P.parent; ) P = P.parent;
            return P;
          }
        }
        if (P.endsWithParent) return ui(P.parent, F, ce);
      }
      function Vn(P) {
        return Te.matcher.regexIndex === 0 ? (He += P[0], 1) : (V = !0, 0);
      }
      function Ji(P) {
        const F = P[0], ce = P.rule, be = new r(ce), Me = [ce.__beforeBegin, ce["on:begin"]];
        for (const rt of Me)
          if (rt && (rt(P, be), be.isMatchIgnored))
            return Vn(F);
        return ce.skip ? He += F : (ce.excludeBegin && (He += F), _t(), !ce.returnBegin && !ce.excludeBegin && (He = F)), Lt(ce, P), ce.returnBegin ? 0 : F.length;
      }
      function hi(P) {
        const F = P[0], ce = ke.substring(P.index), be = ui(Te, P, ce);
        if (!be) return en;
        const Me = Te;
        Te.endScope && Te.endScope._wrap ? (_t(), Ft(F, Te.endScope._wrap)) : Te.endScope && Te.endScope._multi ? (_t(), un(Te.endScope, P)) : Me.skip ? He += F : (Me.returnEnd || Me.excludeEnd || (He += F), _t(), Me.excludeEnd && (He = F));
        do
          Te.scope && nt.closeNode(), !Te.skip && !Te.subLanguage && (Y += Te.relevance), Te = Te.parent;
        while (Te !== be.parent);
        return be.starts && Lt(be.starts, P), Me.returnEnd ? 0 : F.length;
      }
      function hn() {
        const P = [];
        for (let F = Te; F !== Bt; F = F.parent) F.scope && P.unshift(F.scope);
        P.forEach((F) => nt.openNode(F));
      }
      let In = {};
      function dr(P, F) {
        const ce = F && F[0];
        if (He += P, ce == null)
          return _t(), 0;
        if (In.type === "begin" && F.type === "end" && In.index === F.index && ce === "") {
          if (He += ke.slice(F.index, F.index + 1), !We) {
            const be = /* @__PURE__ */ new Error(`0 width match regex (${J})`);
            throw be.languageName = J, be.badRule = In.rule, be;
          }
          return 1;
        }
        if (In = F, F.type === "begin") return Ji(F);
        if (F.type === "illegal" && !Ne) {
          const be = /* @__PURE__ */ new Error('Illegal lexeme "' + ce + '" for mode "' + (Te.scope || "<unnamed>") + '"');
          throw be.mode = Te, be;
        } else if (F.type === "end") {
          const be = hi(F);
          if (be !== en) return be;
        }
        if (F.type === "illegal" && ce === "")
          return F.index === ke.length || (He += `
`), 1;
        if (T > 1e5 && T > F.index * 3) throw /* @__PURE__ */ new Error("potential infinite loop, way more iterations than matches");
        return He += ce, ce.length;
      }
      const Bt = Vt(J);
      if (!Bt)
        throw ve(Ge.replace("{}", J)), new Error('Unknown language: "' + J + '"');
      const fi = Gn(Bt);
      let pr = "", Te = Ve || fi;
      const gr = {}, nt = new pe.__emitter(pe);
      hn();
      let He = "", Y = 0, k = 0, T = 0, V = !1;
      try {
        if (Bt.__emitTokens)
          Bt.__emitTokens(ke, nt);
        else {
          for (Te.matcher.considerAll(); ; ) {
            T++, V ? V = !1 : Te.matcher.considerAll(), Te.matcher.lastIndex = k;
            const P = Te.matcher.exec(ke);
            if (!P) break;
            const F = dr(ke.substring(k, P.index), P);
            k = P.index + F;
          }
          dr(ke.substring(k));
        }
        return nt.finalize(), pr = nt.toHTML(), {
          language: J,
          value: pr,
          relevance: Y,
          illegal: !1,
          _emitter: nt,
          _top: Te
        };
      } catch (P) {
        if (P.message && P.message.includes("Illegal")) return {
          language: J,
          value: Cn(ke),
          illegal: !0,
          relevance: 0,
          _illegalBy: {
            message: P.message,
            index: k,
            context: ke.slice(k - 100, k + 100),
            mode: P.mode,
            resultSoFar: pr
          },
          _emitter: nt
        };
        if (We) return {
          language: J,
          value: Cn(ke),
          illegal: !1,
          relevance: 0,
          errorRaised: P,
          _emitter: nt,
          _top: Te
        };
        throw P;
      }
    }
    function Mn(J) {
      const ke = {
        value: Cn(J),
        illegal: !1,
        relevance: 0,
        _top: ye,
        _emitter: new pe.__emitter(pe)
      };
      return ke._emitter.addText(J), ke;
    }
    function ur(J, ke) {
      ke = ke || pe.languages || Object.keys(X);
      const Ne = Mn(J), Ve = ke.filter(Vt).filter(li).map((Rt) => ln(Rt, J, !1));
      Ve.unshift(Ne);
      const [tt, Tt] = Ve.sort((Rt, _t) => {
        if (Rt.relevance !== _t.relevance) return _t.relevance - Rt.relevance;
        if (Rt.language && _t.language) {
          if (Vt(Rt.language).supersetOf === _t.language) return 1;
          if (Vt(_t.language).supersetOf === Rt.language) return -1;
        }
        return 0;
      }), At = tt;
      return At.secondBest = Tt, At;
    }
    function Pn(J, ke, Ne) {
      const Ve = ke && fe[ke] || Ne;
      J.classList.add("hljs"), J.classList.add(`language-${Ve}`);
    }
    function hr(J) {
      let ke = null;
      const Ne = at(J);
      if (Ee(Ne)) return;
      if (nn("before:highlightElement", {
        el: J,
        language: Ne
      }), J.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", J);
        return;
      }
      if (J.children.length > 0 && (pe.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(J)), pe.throwUnescapedHTML))
        throw new lr("One of your code blocks includes unescaped HTML.", J.innerHTML);
      ke = J;
      const Ve = ke.textContent, tt = Ne ? Ke(Ve, {
        language: Ne,
        ignoreIllegals: !0
      }) : ur(Ve);
      J.innerHTML = tt.value, J.dataset.highlighted = "yes", Pn(J, Ne, tt.language), J.result = {
        language: tt.language,
        re: tt.relevance,
        relevance: tt.relevance
      }, tt.secondBest && (J.secondBest = {
        language: tt.secondBest.language,
        relevance: tt.secondBest.relevance
      }), nn("after:highlightElement", {
        el: J,
        result: tt,
        text: Ve
      });
    }
    function Qi(J) {
      pe = Jt(pe, J);
    }
    const et = () => {
      Nn(), Ue("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function cn() {
      Nn(), Ue("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ii = !1;
    function Nn() {
      function J() {
        Nn();
      }
      if (document.readyState === "loading") {
        ii || window.addEventListener("DOMContentLoaded", J, !1), ii = !0;
        return;
      }
      document.querySelectorAll(pe.cssSelector).forEach(hr);
    }
    function fr(J, ke) {
      let Ne = null;
      try {
        Ne = ke(S);
      } catch (Ve) {
        if (ve("Language definition for '{}' could not be registered.".replace("{}", J)), We) ve(Ve);
        else throw Ve;
        Ne = ye;
      }
      Ne.name || (Ne.name = J), X[J] = Ne, Ne.rawDefinition = ke.bind(null, S), Ne.aliases && oi(Ne.aliases, { languageName: J });
    }
    function ai(J) {
      delete X[J];
      for (const ke of Object.keys(fe)) fe[ke] === J && delete fe[ke];
    }
    function si() {
      return Object.keys(X);
    }
    function Vt(J) {
      return J = (J || "").toLowerCase(), X[J] || X[fe[J]];
    }
    function oi(J, { languageName: ke }) {
      typeof J == "string" && (J = [J]), J.forEach((Ne) => {
        fe[Ne.toLowerCase()] = ke;
      });
    }
    function li(J) {
      const ke = Vt(J);
      return ke && !ke.disableAutodetect;
    }
    function Ki(J) {
      J["before:highlightBlock"] && !J["before:highlightElement"] && (J["before:highlightElement"] = (ke) => {
        J["before:highlightBlock"](Object.assign({ block: ke.el }, ke));
      }), J["after:highlightBlock"] && !J["after:highlightElement"] && (J["after:highlightElement"] = (ke) => {
        J["after:highlightBlock"](Object.assign({ block: ke.el }, ke));
      });
    }
    function Zt(J) {
      Ki(J), Re.push(J);
    }
    function ci(J) {
      const ke = Re.indexOf(J);
      ke !== -1 && Re.splice(ke, 1);
    }
    function nn(J, ke) {
      const Ne = J;
      Re.forEach(function(Ve) {
        Ve[Ne] && Ve[Ne](ke);
      });
    }
    function rn(J) {
      return Ue("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ue("10.7.0", "Please use highlightElement now."), hr(J);
    }
    Object.assign(S, {
      highlight: Ke,
      highlightAuto: ur,
      highlightAll: Nn,
      highlightElement: hr,
      highlightBlock: rn,
      configure: Qi,
      initHighlighting: et,
      initHighlightingOnLoad: cn,
      registerLanguage: fr,
      unregisterLanguage: ai,
      listLanguages: si,
      getLanguage: Vt,
      registerAliases: oi,
      autoDetection: li,
      inherit: Jt,
      addPlugin: Zt,
      removePlugin: ci
    }), S.debugMode = function() {
      We = !1;
    }, S.safeMode = function() {
      We = !0;
    }, S.versionString = ni, S.regex = {
      concat: h,
      lookahead: m,
      either: _,
      optional: y,
      anyNumberOfTimes: g
    };
    for (const J in q) typeof q[J] == "object" && n(q[J]);
    return Object.assign(S, q), S;
  }, tn = cr({});
  tn.newInstance = () => cr({}), t.exports = tn, tn.HighlightJS = tn, tn.default = tn;
})), Gl = /* @__PURE__ */ ko(Hl()), Xe = Gl.default, qi = 1e3, Vl = 60 * qi, ka = 30 * qi, Zl = 1e4, fs = 1e3;
var Xl = 60 * qi, Yl = 1e3, ds = Vl, Ql = 1e3, Kl = 5e3, Zr = class {
  constructor({ maxEntries: e = 1 / 0, maxWeight: t = 1 / 0, weightFn: n = () => 1, defaultTTL: r = ds, maxPoolSize: i = Yl, rejectOversized: a = !1, onEvict: o = null, onExpire: s = null, initialPoolSize: l = 0, maxCleanupPerTick: c = 100, eagerCleanupOnRead: f = !1, defaultAsyncTimeout: d = ka } = {}) {
    if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
    this.maxEntries = e, this.maxWeight = t, this.weightFn = n, this.defaultTTL = r, this.maxPoolSize = i, this.rejectOversized = !!a, this.onEvict = typeof o == "function" ? o : null, this.onExpire = typeof s == "function" ? s : null, this.maxCleanupPerTick = Number.isFinite(+c) ? Math.max(1, +c) : 100, this.eagerCleanupOnRead = !!f, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
    for (let u = 0; u < Math.min(l || 0, this.maxPoolSize); u++) this._pool.push({
      key: null,
      value: null,
      weight: 0,
      expiresAt: 0,
      prev: null,
      next: null
    });
    this._currentWeight = 0, this._hits = 0, this._misses = 0, this._evictions = 0, this._rejected = 0, this._expirations = 0, Object.defineProperty(this, "map", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._map;
      },
      set(u) {
        this._map = u;
      }
    }), Object.defineProperty(this, "head", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._head;
      },
      set(u) {
        this._head = u;
      }
    }), Object.defineProperty(this, "tail", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._tail;
      },
      set(u) {
        this._tail = u;
      }
    }), Object.defineProperty(this, "pool", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._pool;
      },
      set(u) {
        this._pool = u;
      }
    }), Object.defineProperty(this, "currentWeight", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._currentWeight;
      },
      set(u) {
        this._currentWeight = u;
      }
    }), Object.defineProperty(this, "hits", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._hits;
      },
      set(u) {
        this._hits = u;
      }
    }), Object.defineProperty(this, "misses", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._misses;
      },
      set(u) {
        this._misses = u;
      }
    }), Object.defineProperty(this, "evictions", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._evictions;
      },
      set(u) {
        this._evictions = u;
      }
    }), Object.defineProperty(this, "rejected", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._rejected;
      },
      set(u) {
        this._rejected = u;
      }
    }), Object.defineProperty(this, "expirations", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._expirations;
      },
      set(u) {
        this._expirations = u;
      }
    }), this._cleanupTimer = null, this._cleanupRunning = !1, this._cleanupParams = null, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._inflightPromises = /* @__PURE__ */ new Map(), this._defaultAsyncTimeout = Number.isFinite(Number(d)) ? Math.max(0, Math.floor(Number(d))) : 3e4;
  }
  _allocNode(e, t, n, r) {
    const i = this._pool.pop() || {
      key: null,
      value: null,
      weight: 0,
      expiresAt: 0,
      prev: null,
      next: null
    };
    return i.key = e, i.value = t, i.weight = n || 0, i.expiresAt = r || 0, i.prev = null, i.next = null, i;
  }
  _computeWeight(e, t) {
    if (t != null) {
      const n = +t;
      return Number.isFinite(n) ? Math.max(0, n) : 0;
    }
    try {
      const n = +this.weightFn(e);
      return Number.isFinite(n) ? Math.max(0, n) : 0;
    } catch {
      return 0;
    }
  }
  _freeNode(e) {
    e.key = null, e.value = null, e.weight = 0, e.expiresAt = 0, e.prev = null, e.next = null, this._pool.length < this.maxPoolSize && this._pool.push(e);
  }
  _removeExpiredNode(e, t) {
    if (!e.expiresAt || e.expiresAt > t) return !1;
    const n = e.key, r = e.value, i = e.next;
    this._map.delete(n), this._currentWeight -= e.weight || 0, this._cleanupCursor === e && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(e);
    try {
      this.onExpire && this.onExpire(n, r);
    } catch (a) {
      try {
        typeof this._logger?.error == "function" ? this._logger.error(a, "PowerCache onExpire callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onExpire callback threw", a);
      } catch {
      }
    }
    return this._freeNode(e), this._expirations++, !0;
  }
  _fetchValidNode(e, { ignoreExpiry: t = !1, countMiss: n = !1, allowExpired: r = !1 } = {}) {
    const i = this._map.get(e);
    if (!i)
      return n && this._misses++, null;
    const a = !t && i.expiresAt ? $e() : 0;
    return a && i.expiresAt <= a ? r ? i : (this._removeExpiredNode(i, a), n && this._misses++, null) : i;
  }
  _refreshStaleEntry(e, t, { ttl: n = void 0, weight: r = void 0 } = {}) {
    if (this._inflightPromises.has(e)) return;
    let i;
    try {
      i = Promise.resolve().then(() => t());
    } catch {
      return;
    }
    const a = i.then((o) => {
      try {
        this.set(e, o, {
          ttl: n,
          weight: r
        });
      } catch {
      }
      return o;
    }).catch(() => {
    }).finally(() => {
      this._inflightPromises.delete(e);
    });
    this._inflightPromises.set(e, a);
  }
  _append(e) {
    if (!this._tail) {
      this._head = this._tail = e, this._evictionCandidate = this._head;
      return;
    }
    e.prev = this._tail, e.next = null, this._tail.next = e, this._tail = e;
  }
  _remove(e) {
    const t = e.prev, n = e.next;
    t ? t.next = n : this._head = n, t || (this._evictionCandidate = this._head), n ? n.prev = t : this._tail = t, e.prev = e.next = null;
  }
  _moveToTail(e) {
    this._tail !== e && (this._remove(e), this._append(e));
  }
  _evictIfNeeded() {
    for (; this._map.size > this.maxEntries || this._currentWeight > this.maxWeight; ) {
      const e = this._evictionCandidate || this._head;
      if (!e) break;
      const t = e.next, n = e.key, r = e.value;
      this._cleanupCursor === e && (this._cleanupCursor = t), this._cleanupCursorValid = !!this._cleanupCursor, this._evictionCandidate = t, this._remove(e), this._map.delete(n), this._currentWeight -= e.weight || 0, this._evictions++;
      try {
        this.onEvict && this.onEvict(n, r, "evicted");
      } catch (i) {
        try {
          typeof this._logger?.error == "function" ? this._logger.error(i, "PowerCache onEvict callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onEvict callback threw", i);
        } catch {
        }
      }
      this._freeNode(e);
    }
    this._evictionCandidate || (this._evictionCandidate = this._head);
  }
  set(e, t, { ttl: n = this.defaultTTL, weight: r = null } = {}) {
    const i = $e(), a = n == null || n === 1 / 0 ? 0 : i + n, o = this._computeWeight(t, r);
    if (this.rejectOversized && Number.isFinite(this.maxWeight) && o > this.maxWeight) {
      this._rejected++;
      try {
        this.onEvict && this.onEvict(e, t, "rejected-oversized");
      } catch {
      }
      return !1;
    }
    if (this._map.has(e)) {
      const s = this._map.get(e);
      this._currentWeight -= s.weight || 0, s.value = t, s.weight = o, s.expiresAt = a, this._currentWeight += s.weight || 0, this._moveToTail(s);
    } else {
      const s = this._allocNode(e, t, o, a);
      this._map.set(e, s), this._append(s), this._currentWeight += s.weight || 0;
    }
    return this._evictIfNeeded(), this;
  }
  get(e) {
    const t = this._fetchValidNode(e, { countMiss: !0 });
    if (t)
      return this._moveToTail(t), this._hits++, t.value;
  }
  peek(e) {
    const t = this._fetchValidNode(e);
    return t ? t.value : void 0;
  }
  has(e, { ignoreExpiry: t = !1 } = {}) {
    return !!this._fetchValidNode(e, { ignoreExpiry: t });
  }
  getOrSet(e, t, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1 } = {}) {
    const a = $e(), o = this._fetchValidNode(e, {
      countMiss: !1,
      allowExpired: i
    });
    if (o)
      if (o.expiresAt && o.expiresAt <= a) {
        if (typeof t == "function")
          return this._moveToTail(o), this._hits++, this._refreshStaleEntry(e, t, {
            ttl: n,
            weight: r
          }), o.value;
        this._removeExpiredNode(o, a), this._misses++;
      } else
        return this._moveToTail(o), this._hits++, o.value;
    else this._misses++;
    if (typeof t == "function") {
      const s = t();
      return typeof s?.then == "function" ? s.then((l) => {
        try {
          this.set(e, l, {
            ttl: n,
            weight: r
          });
        } catch {
        }
        return l;
      }) : (this.set(e, s, {
        ttl: n,
        weight: r
      }), s);
    }
    return this.set(e, t, {
      ttl: n,
      weight: r
    }), t;
  }
  setMany(e, { ttl: t = void 0, weight: n = void 0 } = {}) {
    const r = $e(), i = t == null || t === 1 / 0 ? 0 : r + t;
    for (const a of e) {
      if (!a) continue;
      const [o, s] = a, l = this._computeWeight(s, n);
      if (this._map.has(o)) {
        const c = this._map.get(o);
        this._currentWeight -= c.weight || 0, c.value = s, c.weight = l, c.expiresAt = i, this._currentWeight += c.weight || 0, this._moveToTail(c);
      } else {
        const c = this._allocNode(o, s, l, i);
        this._map.set(o, c), this._append(c), this._currentWeight += c.weight || 0;
      }
    }
    return this._evictIfNeeded(), this;
  }
  getMany(e, { ignoreExpiry: t = !1 } = {}) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e) {
      const i = this._fetchValidNode(r, {
        ignoreExpiry: t,
        countMiss: !0
      });
      i && (this._moveToTail(i), this._hits++, n.set(r, i.value));
    }
    return n;
  }
  touch(e, t = void 0) {
    const n = this._fetchValidNode(e);
    if (!n) return !1;
    const r = $e();
    return t !== void 0 && (n.expiresAt = t == null || t === 1 / 0 ? 0 : r + t), this._moveToTail(n), !0;
  }
  getOrSetAsync(e, t, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1, timeout: a = void 0 } = {}) {
    if (typeof t != "function") return Promise.resolve(this.getOrSet(e, t, {
      ttl: n,
      weight: r
    }));
    const o = $e(), s = this._map.get(e);
    if (s)
      if (s.expiresAt && s.expiresAt <= o) {
        if (i)
          return this._moveToTail(s), this._hits++, this._refreshStaleEntry(e, t, {
            ttl: n,
            weight: r
          }), Promise.resolve(s.value);
        this._removeExpiredNode(s, o);
      } else
        return this._moveToTail(s), this._hits++, Promise.resolve(s.value);
    if (this._inflightPromises.has(e)) return this._inflightPromises.get(e);
    this._misses++;
    let l;
    try {
      l = Promise.resolve().then(() => t());
    } catch (u) {
      return Promise.reject(u);
    }
    const c = Number.isFinite(Number(a)) ? Math.max(0, Math.floor(Number(a))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
    let f = l;
    if (Number.isFinite(c) && c > 0) {
      let u = null;
      f = new Promise((p, m) => {
        u = setTimeout(() => {
          try {
            m(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
          } catch {
          }
        }, c), l.then((g) => {
          try {
            clearTimeout(u);
          } catch {
          }
          p(g);
        }, (g) => {
          try {
            clearTimeout(u);
          } catch {
          }
          m(g);
        });
      });
    }
    const d = f.then((u) => {
      try {
        this.set(e, u, {
          ttl: n,
          weight: r
        });
      } catch {
      }
      return u;
    }).finally(() => {
      this._inflightPromises.delete(e);
    });
    return this._inflightPromises.set(e, d), d;
  }
  hasEqual(e, t, { ignoreExpiry: n = !1, seen: r = void 0 } = {}) {
    const i = this._fetchValidNode(e, { ignoreExpiry: n });
    if (!i) return !1;
    const a = i.value;
    return a === t ? !0 : typeof a != "object" || a === null || typeof t != "object" || t === null ? a === t : Yn(a, t, r);
  }
  hasEqualWithSeen(e, t, n, { ignoreExpiry: r = !1 } = {}) {
    return this.hasEqual(e, t, {
      ignoreExpiry: r,
      seen: n
    });
  }
  delete(e) {
    const t = this._map.get(e);
    if (!t) return !1;
    const n = t.next;
    this._map.delete(e), this._currentWeight -= t.weight || 0, this._cleanupCursor === t && (this._cleanupCursor = n), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(t);
    try {
      this.onEvict && this.onEvict(t.key, t.value, "deleted");
    } catch {
    }
    return this._freeNode(t), !0;
  }
  clear() {
    for (let e = this._head; e; ) {
      const t = e.next;
      this._freeNode(e), e = t;
    }
    this._head = this._tail = null, this._map.clear(), this._currentWeight = 0, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null;
  }
  cleanupExpired() {
    return this.cleanupExpiredUpTo();
  }
  cleanupExpiredUpTo(e = 1 / 0) {
    const t = $e();
    let n = 0, r = this._cleanupCursor && this._cleanupCursorValid ? this._cleanupCursor : this._head;
    for (; r && n < e; ) {
      const i = r.next;
      if (r.expiresAt && r.expiresAt <= t) {
        const a = r.key, o = r.value;
        this._map.delete(a), this._currentWeight -= r.weight || 0, this._cleanupCursor === r && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(r);
        try {
          this.onExpire && this.onExpire(a, o);
        } catch {
        }
        this._freeNode(r), this._expirations++;
      }
      r = i, n++;
    }
    return this._cleanupCursor = r || this._head, this._cleanupCursorValid = !!this._cleanupCursor, n;
  }
  startCleanup(e = {}) {
    let t, n;
    typeof e == "number" ? (t = e, n = this.maxCleanupPerTick) : (t = Number.isFinite(+e.interval) ? +e.interval : Math.max(qi, Math.min(this.defaultTTL || 6e4, ds)), n = Number.isFinite(+e.maxCleanupPerTick) ? Math.max(1, +e.maxCleanupPerTick) : this.maxCleanupPerTick), this.stopCleanup(), this._cleanupParams = {
      interval: t,
      maxCleanupPerTick: n
    }, this._cleanupTimer = setTimeout(() => this._cleanupTick(), t);
  }
  stopCleanup() {
    this._cleanupTimer && (clearTimeout(this._cleanupTimer), this._cleanupTimer = null), this._cleanupRunning = !1, this._cleanupParams = null;
  }
  [Symbol.dispose]() {
    try {
      this.stopCleanup();
    } catch {
    }
    try {
      this.clear();
    } catch {
    }
  }
  async [Symbol.asyncDispose]() {
    try {
      this.stopCleanup();
    } catch {
    }
    try {
      this.clear();
    } catch {
    }
  }
  _cleanupTick() {
    if (this._cleanupTimer != null) {
      if (this._cleanupRunning) {
        this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
        return;
      }
      this._cleanupRunning = !0;
      try {
        this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick);
      } finally {
        this._cleanupRunning = !1;
      }
      this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
    }
  }
  get size() {
    return this._map.size;
  }
  get hitRate() {
    const e = (this._hits || 0) + (this._misses || 0);
    return e ? this._hits / e : 0;
  }
  stats() {
    return {
      size: this.size,
      weight: this._currentWeight,
      hits: this._hits,
      misses: this._misses,
      evictions: this._evictions,
      expirations: this._expirations,
      rejected: this._rejected,
      poolSize: this._pool.length
    };
  }
  resize({ maxEntries: e, maxWeight: t } = {}) {
    Number.isFinite(+e) && (this.maxEntries = Math.max(0, +e)), Number.isFinite(+t) && (this.maxWeight = Math.max(0, +t)), this._evictIfNeeded(), this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = this.head;
  }
  *entries(e = "MRU") {
    if (e === "MRU") for (let t = this._tail; t; t = t.prev) yield [t.key, t.value];
    else for (let t = this._head; t; t = t.next) yield [t.key, t.value];
  }
  [Symbol.iterator]() {
    return this.entries("MRU");
  }
  *keys(e = "MRU") {
    for (const [t] of this.entries(e)) yield t;
  }
  *values(e = "MRU") {
    for (const [, t] of this.entries(e)) yield t;
  }
};
function Yn(e, t, n = void 0, r = 0) {
  if (r > 100) return e === t;
  if (e === t) return !0;
  if (e == null || t == null || typeof e != "object" || typeof t != "object") return e === t;
  n || (n = /* @__PURE__ */ new WeakMap());
  let i = n.get(e);
  if (i?.has(t)) return !0;
  if (i || (i = /* @__PURE__ */ new WeakSet(), n.set(e, i)), i.add(t), Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)) return !1;
  if (typeof Uint8Array < "u" && e instanceof Uint8Array) {
    if (!(t instanceof Uint8Array) || e.length !== t.length) return !1;
    for (let s = 0; s < e.length; s++) if (e[s] !== t[s]) return !1;
    return !0;
  }
  if (Array.isArray(e)) {
    if (!Array.isArray(t) || e.length !== t.length) return !1;
    for (let s = 0; s < e.length; s++) if (!Yn(e[s], t[s], n, r + 1)) return !1;
    return !0;
  }
  if (ArrayBuffer.isView(e)) {
    if (!ArrayBuffer.isView(t) || e.byteLength !== t.byteLength) return !1;
    const s = new Uint8Array(e.buffer, e.byteOffset || 0, e.byteLength), l = new Uint8Array(t.buffer, t.byteOffset || 0, t.byteLength);
    for (let c = 0; c < s.length; c++) if (s[c] !== l[c]) return !1;
    return !0;
  }
  if (e instanceof ArrayBuffer) {
    if (!(t instanceof ArrayBuffer) || e.byteLength !== t.byteLength) return !1;
    const s = new Uint8Array(e), l = new Uint8Array(t);
    for (let c = 0; c < s.length; c++) if (s[c] !== l[c]) return !1;
    return !0;
  }
  if (e instanceof Date)
    return t instanceof Date ? e.getTime() === t.getTime() : !1;
  if (e instanceof RegExp)
    return t instanceof RegExp ? e.toString() === t.toString() : !1;
  if (e instanceof Map) {
    if (!(t instanceof Map) || e.size !== t.size) return !1;
    for (const [s, l] of e)
      if (!t.has(s) || !Yn(l, t.get(s), n, r + 1)) return !1;
    return !0;
  }
  if (e instanceof Set) {
    if (!(t instanceof Set) || e.size !== t.size) return !1;
    let s = !0;
    for (const m of e) if (m !== null && typeof m == "object") {
      s = !1;
      break;
    }
    if (s) {
      for (const m of e) if (!t.has(m)) return !1;
      return !0;
    }
    const l = Array.from(t), c = new Array(l.length).fill(!1), f = /* @__PURE__ */ new Map();
    for (let m = 0; m < l.length; m++) f.set(l[m], m);
    const d = (m) => {
      try {
        return JSON.stringify(m, (g, y) => y instanceof Date ? {
          __type: "Date",
          v: y.getTime()
        } : y instanceof RegExp ? {
          __type: "RegExp",
          v: y.toString()
        } : typeof ArrayBuffer < "u" && ArrayBuffer.isView(y) ? {
          __type: "TypedArray",
          v: Array.from(new Uint8Array(y.buffer, y.byteOffset || 0, y.byteLength))
        } : typeof ArrayBuffer < "u" && y instanceof ArrayBuffer ? {
          __type: "ArrayBuffer",
          v: Array.from(new Uint8Array(y))
        } : y);
      } catch {
        return null;
      }
    }, u = /* @__PURE__ */ new Map(), p = [];
    for (let m = 0; m < l.length; m++) {
      const g = d(l[m]);
      if (g == null) p.push(m);
      else {
        const y = u.get(g);
        y ? y.push(m) : u.set(g, [m]);
      }
    }
    for (const m of e) {
      const g = f.get(m);
      if (g !== void 0 && !c[g]) {
        c[g] = !0;
        continue;
      }
      const y = d(m);
      let h = !1;
      if (y != null) {
        const b = u.get(y) || [];
        for (const _ of b)
          if (!c[_] && Yn(m, l[_], n, r + 1)) {
            c[_] = !0, h = !0;
            break;
          }
        if (h) continue;
      }
      for (let b = 0; b < l.length; b++)
        if (!c[b] && Yn(m, l[b], n, r + 1)) {
          c[b] = !0, h = !0;
          break;
        }
      if (!h) return !1;
    }
    return !0;
  }
  const a = Object.keys(e), o = Object.keys(t);
  if (a.length !== o.length) return !1;
  for (let s = 0; s < a.length; s++) {
    const l = a[s];
    if (!Object.prototype.hasOwnProperty.call(t, l) || !Yn(e[l], t[l], n, r + 1)) return !1;
  }
  return !0;
}
var ir = class xa {
  constructor(t, n = {}) {
    const { keyResolver: r = (...s) => JSON.stringify(s), cacheOptions: i = {}, ttl: a, weight: o } = n;
    if (this.keyResolver = typeof r == "function" ? r : (...s) => JSON.stringify(s), this.cache = new Zr(i), this._inflight = /* @__PURE__ */ new Map(), this._defaultMemoizeOptions = {}, a !== void 0 && (this._defaultMemoizeOptions.ttl = a), o !== void 0 && (this._defaultMemoizeOptions.weight = o), this.run = () => {
      throw new TypeError("No function supplied to PowerMemoizer; call memoize(fn) to create a memoized wrapper.");
    }, this._originalFn = null, typeof t == "function") {
      this._originalFn = t;
      try {
        this._fnWrapper = this.memoize(t), this.run = (...s) => this._fnWrapper(...s);
      } catch {
      }
    }
  }
  _memoize(t, { ttl: n, weight: r } = {}) {
    if (typeof t != "function") throw new TypeError("fn must be a function");
    const i = this;
    return function(...o) {
      const s = i.keyResolver(...o);
      if (i.cache.has(s)) return i.cache.get(s);
      if (i._inflight.has(s)) return i._inflight.get(s);
      const l = t(...o);
      if (typeof l?.then == "function") {
        const c = (async () => {
          try {
            const f = await l;
            try {
              i.cache.set(s, f, {
                ttl: n,
                weight: r
              });
            } catch {
            }
            return f;
          } finally {
            i._inflight.delete(s);
          }
        })();
        return i._inflight.set(s, c), c;
      }
      return i.cache.set(s, l, {
        ttl: n,
        weight: r
      }), l;
    };
  }
  memoize(t, n = {}) {
    if (typeof t != "function") throw new TypeError("fn must be a function");
    const r = n && (Object.prototype.hasOwnProperty.call(n, "ttl") || Object.prototype.hasOwnProperty.call(n, "weight")) ? n : this._defaultMemoizeOptions, i = this._memoize(t, r);
    i.get = (...a) => this.get(...a), i.has = (...a) => this.has(...a), i.delete = (...a) => this.delete(...a), i.clear = () => this.clear(), i.stats = () => this.stats(), i.cache = this.cache, i.original = t;
    try {
      Object.setPrototypeOf(i, xa.prototype), i.constructor = xa;
    } catch {
    }
    return i;
  }
  get(...t) {
    return this.cache.get(this.keyResolver(...t));
  }
  has(...t) {
    return this.cache.has(this.keyResolver(...t));
  }
  delete(...t) {
    const n = this.keyResolver(...t);
    return this._inflight.has(n) && this._inflight.delete(n), this.cache.delete(n);
  }
  clear() {
    this._inflight.clear(), this.cache.clear();
  }
  stats() {
    return this.cache.stats();
  }
}, Jl = class {
  constructor(e = 0, t = {}) {
    e != null && typeof e == "object" && (t = e, e = 0), this._defaultTTL = Number(t?.defaultTTL ?? e) || 0, this._onExpire = typeof t?.onExpire == "function" ? t.onExpire : null, this._map = /* @__PURE__ */ new Map(), this._expirations = /* @__PURE__ */ new Map(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
  }
  _resolveTtl(e, t) {
    return e != null && typeof e == "object" && (e = e.ttl), e == null ? t : Number(e) || 0;
  }
  set(e, t, n) {
    const r = this._resolveTtl(n, this._defaultTTL), i = r > 0 ? $e() + r + 1 : 0, a = this._expirations.get(e) || 0;
    return this._map.set(e, {
      value: t,
      expiresAt: i
    }), i ? this._expirations.set(e, i) : this._expirations.delete(e), this._updateNextExpiryOnWrite(a, i), this;
  }
  _expireKey(e, t) {
    if (!t) return;
    const n = t.expiresAt || this._expirations.get(e) || 0;
    try {
      const r = t.value;
      if (this._map.delete(e), this._expirations.delete(e), n && this._nextExpiryAt === n && (this._nextExpiryDirty = !0), typeof this._onExpire == "function") try {
        this._onExpire(e, r);
      } catch {
      }
    } catch {
    }
  }
  _checkExpire(e, t) {
    return t ? t.expiresAt && $e() > t.expiresAt ? (this._expireKey(e, t), !0) : !1 : !0;
  }
  get(e) {
    const t = this._map.get(e);
    if (!this._checkExpire(e, t))
      return t.value;
  }
  has(e) {
    const t = this._map.get(e);
    return !this._checkExpire(e, t);
  }
  delete(e) {
    const t = this._expirations.get(e) || 0;
    return this._expirations.delete(e), t && this._nextExpiryAt === t && (this._nextExpiryDirty = !0), this._map.delete(e);
  }
  clear() {
    this._map.clear(), this._expirations.clear(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
  }
  touch(e, t) {
    const n = this._map.get(e);
    if (!n) return !1;
    if (n.expiresAt && $e() > n.expiresAt)
      return this._expireKey(e, n), !1;
    const r = n.expiresAt || 0, i = this._resolveTtl(t, this._defaultTTL);
    return n.expiresAt = i > 0 ? $e() + i + 1 : 0, n.expiresAt ? this._expirations.set(e, n.expiresAt) : this._expirations.delete(e), this._updateNextExpiryOnWrite(r, n.expiresAt), !0;
  }
  get size() {
    if (!this._map.size) return 0;
    if (!this._expirations.size) return this._map.size;
    const e = $e();
    return !this._nextExpiryDirty && this._nextExpiryAt && e <= this._nextExpiryAt ? this._map.size : (this._sweepExpirations(e), this._map.size);
  }
  _updateNextExpiryOnWrite(e, t) {
    e && this._nextExpiryAt === e && e !== t && (this._nextExpiryDirty = !0), t && (!this._nextExpiryAt || t < this._nextExpiryAt) && (this._nextExpiryAt = t);
  }
  _sweepExpirations(e) {
    let t = 0;
    for (const [n, r] of this._expirations) {
      if (r && e > r) {
        const i = this._map.get(n);
        this._expireKey(n, i);
        continue;
      }
      r && (!t || r < t) && (t = r);
    }
    this._nextExpiryAt = t, this._nextExpiryDirty = !1;
  }
  *entries() {
    const e = $e();
    for (const [t, n] of this._map) {
      if (n.expiresAt && e > n.expiresAt) {
        this._expireKey(t, n);
        continue;
      }
      yield [t, n.value];
    }
  }
  *keys() {
    for (const [e] of this.entries()) yield e;
  }
  *values() {
    for (const [, e] of this.entries()) yield e;
  }
  forEach(e, t) {
    for (const [n, r] of this.entries()) e.call(t, r, n, this);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}, ec = new Zr({ maxEntries: 500 }), di = new Jl(0), ta = 3e5;
async function tc(e, t) {
  try {
    if (!e || ta > 0 && di.has(e)) return null;
    try {
      const n = await ec.getOrSetAsync(e, async () => {
        const r = await t();
        if (r == null) throw new Error("importCache: loader returned null");
        return r;
      });
      return di.delete(e), n;
    } catch {
      return ta > 0 ? di.set(e, 1, ta) : di.delete(e), null;
    }
  } catch {
    return null;
  }
}
var Bn = "11.12.0", ze = /* @__PURE__ */ new Map(), nc = `https://raw.githubusercontent.com/highlightjs/highlight.js/${Bn}/SUPPORTED_LANGUAGES.md`, Kt = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Kt.html = "xml";
Kt.xhtml = "xml";
Kt.markup = "xml";
var To = /* @__PURE__ */ new Set(["magic", "undefined"]), xn = null, rc = 3, ic = 3e5, jr = /* @__PURE__ */ new Map();
function ps(e) {
  try {
    const t = jr.get(e);
    return t ? t.openUntil && Date.now() < t.openUntil ? !0 : (t.openUntil && Date.now() >= t.openUntil && jr.delete(e), !1) : !1;
  } catch {
    return !1;
  }
}
function gs(e) {
  if (e)
    try {
      const t = jr.get(e) || {
        failures: 0,
        openUntil: 0,
        warned: !1
      };
      if (t.failures = (t.failures || 0) + 1, t.failures >= rc && (t.openUntil = Date.now() + ic, !t.warned)) {
        try {
          x("[codeblocksManager] CDN circuit opened for " + e + "; skipping CDN imports temporarily");
        } catch {
        }
        t.warned = !0;
      }
      jr.set(e, t);
    } catch {
    }
}
function ms(e) {
  try {
    e && jr.delete(e);
  } catch {
  }
}
var ys = null;
async function Ro(e = nc) {
  if (e)
    return xn || (xn = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const n = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let l = 0; l < n.length; l++) if (/\|\s*Language\s*\|/i.test(n[l])) {
          r = l;
          break;
        }
        if (r === -1) return;
        const i = n[r].replace(/^\||\|$/g, "").split("|").map((l) => l.trim().toLowerCase());
        let a = i.findIndex((l) => /alias|aliases|equivalent|alt|alternates?/i.test(l));
        a === -1 && (a = 1);
        let o = i.findIndex((l) => /file|filename|module|module name|module-name|short|slug/i.test(l));
        if (o === -1) {
          const l = i.findIndex((c) => /language/i.test(c));
          o = l !== -1 ? l : 0;
        }
        let s = [];
        for (let l = r + 1; l < n.length; l++) {
          const c = n[l].trim();
          if (!c || !c.startsWith("|")) break;
          const f = c.replace(/^\||\|$/g, "").split("|").map((m) => m.trim());
          if (f.every((m) => /^-+$/.test(m))) continue;
          const d = f;
          if (!d.length) continue;
          const u = (d[o] || d[0] || "").toString().trim().toLowerCase();
          if (!u || /^-+$/.test(u)) continue;
          ze.set(u, u);
          const p = d[a] || "";
          if (p) {
            const m = String(p).split(",").map((g) => g.replace(/`/g, "").trim()).filter(Boolean);
            if (m.length) {
              const g = m[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/gi, "");
              g && /[a-z0-9]/i.test(g) && (ze.set(g, g), s.push(g));
            }
          }
        }
        try {
          const l = [];
          for (const c of s) {
            const f = String(c ?? "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/gi, "");
            f && /[a-z0-9]/i.test(f) ? l.push(f) : ze.delete(c);
          }
          s = l;
        } catch (l) {
          x("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const c of Array.from(ze.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              ze.delete(c), l++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const f = c.replace(/^[:]+/, "");
              if (f && /[a-z0-9]/i.test(f)) {
                const d = ze.get(c);
                ze.delete(c), ze.set(f, d);
              } else
                ze.delete(c), l++;
            }
          }
          for (const [c, f] of Array.from(ze.entries())) (!f || /^-+$/.test(f) || !/[a-z0-9]/i.test(f)) && (ze.delete(c), l++);
          try {
            const c = ":---------------------";
            ze.has(c) && (ze.delete(c), l++);
          } catch (c) {
            x("[codeblocksManager] remove sep key failed", c);
          }
          try {
            Array.from(ze.keys()).sort();
          } catch (c) {
            x("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (l) {
          x("[codeblocksManager] ignored error", l);
        }
      } catch (t) {
        x("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), xn);
}
var na = /* @__PURE__ */ new Set(), _s = /* @__PURE__ */ new Set();
function ra(e, t, n) {
  const r = String(e || "").toLowerCase();
  if (!(!r || _s.has(r))) {
    _s.add(r);
    try {
      x("[codeblocksManager] language import failed; using plaintext/highlightElement fallback", {
        language: e,
        candidates: Array.isArray(t) ? t : [],
        error: n ? String(n?.message || n) : "unknown"
      });
    } catch {
    }
  }
}
async function Wr(e, t) {
  if (xn || (async () => {
    try {
      await Ro();
    } catch (i) {
      x("[codeblocksManager] loadSupportedLanguages (IIFE) failed", i);
    }
  })(), xn) try {
    await xn;
  } catch {
  }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (To.has(n)) return !1;
  if (ze.size && !ze.has(n)) {
    const i = Kt;
    if (!i[n] && !i[e]) return !1;
  }
  if (na.has(e)) return !0;
  const r = Kt;
  try {
    const i = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (r[e] || e || "").toString(), o = (r[i] || i || "").toString();
    let s = Array.from(new Set([
      a,
      o,
      i,
      e,
      r[i],
      r[e]
    ].filter(Boolean))).map((f) => String(f).toLowerCase()).filter((f) => f && f !== "undefined");
    ze.size && (s = s.filter((f) => {
      if (ze.has(f)) return !0;
      const d = Kt[f];
      return !!(d && ze.has(d));
    }));
    let l = null, c = null;
    for (const f of s) try {
      if (l = await tc(f, async () => {
        try {
          if (typeof ys == "function") try {
            return await ys(f);
          } catch {
            return null;
          }
          try {
            try {
              return await import(
                /* @vite-ignore */
                `highlight.js/lib/languages/${f}.js`
              );
            } catch {
              return await import(
                /* @vite-ignore */
                `highlight.js/lib/languages/${f}`
              );
            }
          } catch {
          }
          if (!Bn) return null;
          try {
            const d = `https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/es/languages/${f}.js`;
            let u = null;
            try {
              u = new URL(d).host;
            } catch {
              u = null;
            }
            if (!ps(u))
              try {
                const p = await import(d);
                return ms(u), p;
              } catch {
                gs(u);
              }
            try {
              const p = `https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/lib/languages/${f}.js`;
              let m = null;
              try {
                m = new URL(p).host;
              } catch {
                m = null;
              }
              if (!ps(m))
                try {
                  const g = await import(p);
                  return ms(m), g;
                } catch {
                  return gs(m), null;
                }
            } catch {
              return null;
            }
          } catch {
            try {
              return await import(`https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/lib/languages/${f}.js`);
            } catch {
              return null;
            }
          }
        } catch {
          return null;
        }
      }), l) {
        const d = l.default || l;
        try {
          const u = ze.size && ze.get(e) || f || e;
          return Xe.registerLanguage(u, d), na.add(u), u !== e && (Xe.registerLanguage(e, d), na.add(e)), !0;
        } catch (u) {
          c = u;
        }
      }
    } catch (d) {
      c = d;
    }
    return c ? (ra(e, s, c), !1) : (s.length && ra(e, s, null), !1);
  } catch (i) {
    return ra(e, [], i), !1;
  }
}
var ia = null;
function ac(e) {
  const t = e?.querySelector ? e : typeof document < "u" ? document : null;
  xn || (async () => {
    try {
      await Ro();
    } catch (a) {
      x("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const n = Kt;
  typeof IntersectionObserver < "u" && !ia && (ia = new IntersectionObserver((a, o) => {
    a.forEach((s) => {
      if (!s.isIntersecting) return;
      const l = s.target;
      try {
        o.unobserve(l);
      } catch (c) {
        x("[codeblocksManager] observer unobserve failed", c);
      }
      (async () => {
        try {
          const c = l.getAttribute && l.getAttribute("class") || l.className || "", f = c.match(/language-([a-zA-Z0-9_+-]+)/) || c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (f && f[1]) {
            const d = (f[1] || "").toLowerCase(), u = n[d] || d, p = ze.size && (ze.get(u) || ze.get(String(u).toLowerCase())) || u;
            try {
              await Wr(p);
            } catch (m) {
              x("[codeblocksManager] registerLanguage failed", m);
            }
            try {
              try {
                const m = l.textContent || l.innerText || "";
                m != null && (l.textContent = m);
              } catch {
              }
              try {
                l?.dataset?.highlighted && delete l.dataset.highlighted;
              } catch {
              }
              Xe.highlightElement(l);
            } catch (m) {
              x("[codeblocksManager] hljs.highlightElement failed", m);
            }
          } else try {
            const d = l.textContent || "";
            try {
              if (Xe && typeof Xe.getLanguage == "function" && Xe.getLanguage("plaintext")) {
                const u = Xe.highlight(d, { language: "plaintext" });
                if (u && u.value) try {
                  if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                    const p = document.createRange().createContextualFragment(u.value);
                    if (typeof l.replaceChildren == "function") l.replaceChildren(...Array.from(p.childNodes));
                    else {
                      for (; l.firstChild; ) l.removeChild(l.firstChild);
                      l.appendChild(p);
                    }
                  } else l.innerHTML = u.value;
                } catch {
                  try {
                    l.innerHTML = u.value;
                  } catch {
                  }
                }
              }
            } catch {
              try {
                Xe.highlightElement(l);
              } catch (p) {
                x("[codeblocksManager] fallback highlightElement failed", p);
              }
            }
          } catch (d) {
            x("[codeblocksManager] auto-detect plaintext failed", d);
          }
        } catch (c) {
          x("[codeblocksManager] observer entry processing failed", c);
        }
      })();
    });
  }, {
    root: null,
    rootMargin: "300px",
    threshold: 0.1
  }));
  const r = ia, i = t?.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!r) {
    i.forEach(async (a) => {
      try {
        const o = a.getAttribute && a.getAttribute("class") || a.className || "", s = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (s && s[1]) {
          const l = (s[1] || "").toLowerCase(), c = n[l] || l, f = ze.size && (ze.get(c) || ze.get(String(c).toLowerCase())) || c;
          try {
            await Wr(f);
          } catch (d) {
            x("[codeblocksManager] registerLanguage failed (no observer)", d);
          }
        }
        try {
          try {
            const l = a.textContent || a.innerText || "";
            l != null && (a.textContent = l);
          } catch {
          }
          try {
            a && a.dataset && a.dataset.highlighted && delete a.dataset.highlighted;
          } catch {
          }
          Xe.highlightElement(a);
        } catch (l) {
          x("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
        }
      } catch (o) {
        x("[codeblocksManager] loadSupportedLanguages fallback ignored error", o);
      }
    });
    return;
  }
  i.forEach((a) => {
    try {
      r.observe(a);
    } catch (o) {
      x("[codeblocksManager] observe failed", o);
    }
  });
}
function id(e, { useCdn: t = !0 } = {}) {
  const n = typeof document < "u" && document.head && document.head.querySelector ? document.head.querySelector("link[data-hl-theme]") : typeof document < "u" ? document.querySelector("link[data-hl-theme]") : null, r = n?.getAttribute ? n.getAttribute("data-hl-theme") : null, i = e == null ? "default" : String(e), a = i && String(i).toLowerCase() || "";
  if (a === "default" || a === "monokai") {
    try {
      n?.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
    return;
  }
  if (r && r.toLowerCase() === a) return;
  if (!t) {
    try {
      x("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  if (!Bn) {
    try {
      x("Cannot load highlight.js theme from CDN: HIGHLIGHT_JS_VERSION is not defined");
    } catch {
    }
    return;
  }
  const o = a, s = `https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/styles/${o}.css`, l = document.createElement("link");
  l.rel = "stylesheet", l.href = s, l.setAttribute("data-hl-theme", o), l.addEventListener("load", () => {
    try {
      n?.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(l);
}
var Xr = (e) => e === void 0 ? "__undefined" : String(e), sc = new ir(function(e) {
  return String(e ?? "").replace(/^[.\/]+/, "");
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), oc = new ir(function(e) {
  return String(e ?? "").replace(/\/+$/, "");
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), lc = new ir(function(e) {
  return jn(String(e ?? "")) + "/";
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), ad = new ir(function(e) {
  try {
    const t = String(e ?? "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return x("[helpers] encodeURL failed", t), String(e ?? "");
  }
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), cc = new ir(function(e) {
  try {
    if (!e && e !== 0) return "";
    const t = String(e), n = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      nbsp: " "
    };
    return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (r, i) => {
      if (!i) return r;
      if (i[0] === "#") try {
        return i[1] === "x" || i[1] === "X" ? String.fromCharCode(parseInt(i.slice(2), 16)) : String.fromCharCode(parseInt(i.slice(1), 10));
      } catch {
        return r;
      }
      return n[i] !== void 0 ? n[i] : r;
    });
  } catch {
    return String(e ?? "");
  }
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
});
function Ci(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
var te = (e) => sc.run(e), jn = (e) => oc.run(e), Tn = (e) => lc.run(e);
function uc(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const t = document.createElement("link");
    t.rel = "preload", t.as = "image", t.href = e, document.head.appendChild(t);
  } catch (t) {
    x("[helpers] preloadImage failed", t);
  }
}
var hc = ["https://cdn.jsdelivr.net", "https://unpkg.com"];
function fc() {
  try {
    if (typeof document > "u" || !document.head) return;
    for (const e of hc) try {
      if (document.querySelector(`link[rel="preconnect"][href="${e}"]`)) continue;
      const t = document.createElement("link");
      t.rel = "preconnect", t.href = e, t.crossOrigin = "anonymous", document.head.appendChild(t);
    } catch {
    }
  } catch {
  }
}
function dc(e, t = "monokai") {
  try {
    if (typeof document > "u" || !document.head || !e) return;
    const n = `https://cdn.jsdelivr.net/npm/highlight.js@${e}/styles/${t}.css`;
    try {
      if (document.querySelector(`link[rel="preload"][href="${n}"]`)) return;
      const r = document.createElement("link");
      r.rel = "preload", r.as = "style", r.href = n, r.crossOrigin = "anonymous", r.fetchPriority = "high", document.head.appendChild(r);
    } catch {
    }
  } catch {
  }
}
var Sa = null;
function pc(e) {
  Sa = typeof e == "string" ? e : null;
}
function Va(e) {
  if (Sa && e && typeof e.setAttribute == "function") try {
    e.setAttribute("nonce", Sa);
  } catch {
  }
}
function aa(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const r = Array.from(e.querySelectorAll("img"));
    if (!r.length) return;
    const i = e, a = i?.getBoundingClientRect ? i.getBoundingClientRect() : null, o = 0, s = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = a ? Math.max(o, a.top) : o, c = (a ? Math.min(s, a.bottom) : s) + Number(t || 0);
    let f = 0;
    i && (f = i.clientHeight || (a ? a.height : 0)), f || (f = s - o);
    let d = 0.6;
    try {
      const g = i && window.getComputedStyle ? window.getComputedStyle(i) : null, y = g?.getPropertyValue ? g.getPropertyValue("--nimbi-image-max-height-ratio") : null, h = y ? parseFloat(y) : NaN;
      !Number.isNaN(h) && h > 0 && h <= 1 && (d = h);
    } catch (g) {
      x("[helpers] read CSS ratio failed", g);
    }
    const u = Math.max(200, Math.floor(f * d));
    let p = null, m = !1;
    if (r.forEach((g) => {
      try {
        const y = g.getAttribute?.("loading"), h = y === "eager", b = g?.getBoundingClientRect ? g.getBoundingClientRect() : null, _ = g.src || g.getAttribute?.("src"), w = b?.height > 1 ? b.height : u, A = b ? b.top : 0, z = A + w;
        b && w > 0 && A <= c && z >= l && !m ? (g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), uc(_), m = !0) : !h && g.setAttribute && g.setAttribute("loading", "lazy"), !p && b?.top <= c && (p = {
          img: g,
          src: _,
          rect: b,
          beforeLoading: y,
          explicitEager: h
        });
      } catch (y) {
        x("[helpers] setEagerForAboveFoldImages per-image failed", y);
      }
    }), !m && p) {
      const { img: g, src: y, explicitEager: h } = p;
      if (!h) try {
        g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), m = !0;
      } catch (b) {
        x("[helpers] setEagerForAboveFoldImages fallback failed", b);
      }
    }
  } catch (r) {
    x("[helpers] setEagerForAboveFoldImages failed", r);
  }
}
function Fe(e, t = null, n) {
  try {
    const r = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", i = new URLSearchParams(r.startsWith("?") ? r.slice(1) : r), a = String(e ?? "");
    i.delete("page");
    const o = new URLSearchParams();
    o.set("page", a);
    for (const [c, f] of i.entries()) o.append(c, f);
    const s = o.toString();
    let l = s ? `?${s}` : "";
    return t && (l += `#${encodeURIComponent(t)}`), l || `?page=${encodeURIComponent(a)}`;
  } catch {
    const i = `?page=${encodeURIComponent(String(e ?? ""))}`;
    return t ? `${i}#${encodeURIComponent(t)}` : i;
  }
}
function Mi(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      x("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    x("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Mi);
} catch (e) {
  x("[helpers] global attach failed", e);
}
var gc = (e) => cc.run(e), Lo = () => typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, $n = "light";
function mc(e, t = {}) {
  if (document.querySelector(`link[href="${e}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = e, Object.entries(t).forEach(([r, i]) => n.setAttribute(r, i)), document.head.appendChild(n), t["data-bulmaswatch-theme"]) try {
    if (n.getAttribute("data-bulmaswatch-observer")) return;
    let r = Number(n.getAttribute("data-bulmaswatch-move-count") || 0), i = !1, a = null;
    try {
      const l = n.getAttribute("data-bulmaswatch-observer");
      l && (a = document.querySelector(`[data-bulmaswatch-observer="${l}"]`));
    } catch {
      a = null;
    }
    const o = () => {
      try {
        if (i) return;
        const l = n.parentNode;
        if (!l || l.lastElementChild === n) return;
        const c = Number(n.getAttribute("data-bulmaswatch-move-count") || 0);
        if (c >= 1e3) {
          if (n.setAttribute("data-bulmaswatch-move-stopped", "1"), a) try {
            a.disconnect();
          } catch {
          }
          return;
        }
        i = !0;
        try {
          l.appendChild(n);
        } catch {
        }
        const f = c + 1;
        n.setAttribute("data-bulmaswatch-move-count", String(f)), i = !1;
      } catch {
      }
    };
    a || (a = new MutationObserver(o));
    try {
      a.observe(document.head, { childList: !0 }), n.setAttribute("data-bulmaswatch-observer", "1"), n.setAttribute("data-bulmaswatch-move-count", String(r));
    } catch {
    }
    const s = document.head;
    s?.lastElementChild !== n && s?.appendChild(n);
  } catch {
  }
}
function sa() {
  try {
    const e = typeof document < "u" && document?.head ? document.head : document, t = Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));
    for (const n of t) n?.parentNode?.removeChild(n);
  } catch {
  }
  try {
    const e = typeof document < "u" && document?.head ? document.head : document, t = Array.from(e.querySelectorAll("style[data-bulma-override]"));
    for (const n of t) n?.parentNode?.removeChild(n);
  } catch {
  }
}
async function yc(e = "none", t = "/") {
  try {
    de("[bulmaManager] ensureBulma called", {
      bulmaCustomize: e,
      pageDir: t
    });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      sa();
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], r = Array.from(new Set(n));
  if (e === "local") {
    if (sa(), document.querySelector("style[data-bulma-override]")) return;
    for (const i of r) try {
      const a = await fetch(i, { method: "GET" });
      if (a.ok) {
        const o = await a.text(), s = document.createElement("style");
        s.setAttribute("data-bulma-override", i), Va(s), s.appendChild(document.createTextNode(`
/* bulma override: ${i} */
` + o)), document.head.appendChild(s);
        return;
      }
    } catch (a) {
      x("[bulmaManager] fetch local bulma candidate failed", a);
    }
    return;
  }
  try {
    const i = String(e).trim();
    if (!i) return;
    sa(), mc(`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`, { "data-bulmaswatch-theme": i });
  } catch (i) {
    x("[bulmaManager] ensureBulma failed", i);
  }
}
function _c(e) {
  $n = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0) for (const n of t) $n === "dark" ? n.setAttribute("data-theme", "dark") : $n === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      $n === "dark" ? n.setAttribute("data-theme", "dark") : $n === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function sd(e) {
  const t = document.documentElement;
  for (const [n, r] of Object.entries(e || {})) try {
    t.style.setProperty(`--${n}`, r);
  } catch (i) {
    x("[bulmaManager] setThemeVars failed for", n, i);
  }
}
function Co(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest?.(".nimbi-mount") || null;
  try {
    t && ($n === "dark" ? t.setAttribute("data-theme", "dark") : $n === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
var Mo = {
  en: {
    navigation: "Navigation",
    onThisPage: "On this page",
    home: "Home",
    scrollToTop: "Scroll to top",
    readingTime: "{minutes} min read",
    searchPlaceholder: "Search…",
    searchNoResults: "No results",
    imagePreviewTitle: "Image preview",
    imagePreviewFit: "Fit to screen",
    imagePreviewOriginal: "Original size",
    imagePreviewZoomOut: "Zoom out",
    imagePreviewZoomIn: "Zoom in",
    imagePreviewClose: "Close"
  },
  es: {
    navigation: "Navegación",
    onThisPage: "En esta página",
    home: "Inicio",
    scrollToTop: "Ir arriba",
    readingTime: "{minutes} min de lectura",
    searchPlaceholder: "Buscar…",
    searchNoResults: "Sin resultados",
    imagePreviewTitle: "Previsualización de imagen",
    imagePreviewFit: "Ajustar a la pantalla",
    imagePreviewOriginal: "Tamaño original",
    imagePreviewZoomOut: "Alejar",
    imagePreviewZoomIn: "Acercar",
    imagePreviewClose: "Cerrar"
  },
  de: {
    navigation: "Navigation",
    onThisPage: "Auf dieser Seite",
    home: "Startseite",
    scrollToTop: "Nach oben",
    readingTime: "{minutes} min Lesezeit",
    searchPlaceholder: "Suchen…",
    searchNoResults: "Keine Ergebnisse",
    imagePreviewTitle: "Bildvorschau",
    imagePreviewFit: "An Bildschirm anpassen",
    imagePreviewOriginal: "Originalgröße",
    imagePreviewZoomOut: "Verkleinern",
    imagePreviewZoomIn: "Vergrößern",
    imagePreviewClose: "Schließen"
  },
  fr: {
    navigation: "Navigation",
    onThisPage: "Sur cette page",
    home: "Accueil",
    scrollToTop: "Aller en haut",
    readingTime: "{minutes} min de lecture",
    searchPlaceholder: "Rechercher…",
    searchNoResults: "Aucun résultat",
    imagePreviewTitle: "Aperçu de l’image",
    imagePreviewFit: "Ajuster à l’écran",
    imagePreviewOriginal: "Taille originale",
    imagePreviewZoomOut: "Dézoomer",
    imagePreviewZoomIn: "Zoomer",
    imagePreviewClose: "Fermer"
  },
  pt: {
    navigation: "Navegação",
    onThisPage: "Nesta página",
    home: "Início",
    scrollToTop: "Ir para o topo",
    readingTime: "{minutes} min de leitura",
    searchPlaceholder: "Procurar…",
    searchNoResults: "Sem resultados",
    imagePreviewTitle: "Visualização da imagem",
    imagePreviewFit: "Ajustar à tela",
    imagePreviewOriginal: "Tamanho original",
    imagePreviewZoomOut: "Diminuir",
    imagePreviewZoomIn: "Aumentar",
    imagePreviewClose: "Fechar"
  }
}, va = class {
  constructor(e = {}) {
    this._options = e || {};
  }
  static async run(e, t = {}) {
    if (typeof e != "function") throw new TypeError("fn must be a function");
    const { maxAttempts: n = 3, backoff: r = "exponential", baseDelay: i = 100, maxDelay: a = Zl, jitter: o = !0, attemptTimeout: s, retryIf: l = () => !0, onRetry: c } = t, f = Number(n);
    if (!Number.isFinite(f) || f <= 0) throw new TypeError("maxAttempts must be a positive finite number");
    const d = Math.floor(f), u = (m) => {
      let g;
      return r === "linear" ? g = i * m : r === "fixed" ? g = i : g = i * Math.pow(2, m - 1), g > a && (g = a), o && (g = Math.round(g * (0.5 + Math.random() * 0.5))), g;
    };
    let p;
    for (let m = 1; m <= d; m++) {
      let g = null, y;
      typeof s == "number" && s > 0 && typeof AbortController < "u" && (g = new AbortController(), y = g.signal);
      try {
        const h = (async () => e(y))();
        if (g) {
          let b, _ = !1;
          try {
            return await Promise.race([h, new Promise((w, A) => {
              b = setTimeout(() => {
                _ = !0;
                const z = /* @__PURE__ */ new Error("Attempt timed out");
                z.code = "ETIMEOUT", z.attempts = m, z.attemptTimeout = s, A(z);
              }, s);
            })]);
          } finally {
            if (b && clearTimeout(b), _ && g) try {
              g.abort();
            } catch {
            }
          }
        }
        return await h;
      } catch (h) {
        if (p = h, !(typeof l == "function" ? l(h) : l) || m === d) break;
        const b = u(m);
        try {
          typeof c == "function" && c(m, h, b);
        } catch {
        }
        await new Promise((_) => setTimeout(_, b));
      }
    }
    throw p;
  }
  async run(e, t = {}) {
    const n = Object.assign({}, this._options || {}, t || {});
    return this.constructor.run(e, n);
  }
}, Cr = class {
  static async run(e, t = {}) {
    if (typeof e != "function") throw new TypeError("fn must be a function");
    const { maxAttempts: n = 1, attemptTimeout: r = null, totalTimeout: i = null, retryDelay: a = 0, retryIf: o = () => !0, signal: s = null, onRetry: l, backoff: c, baseDelay: f, maxDelay: d, jitter: u } = t || {}, p = Math.max(1, Math.floor(Number(n) || 1)), m = Number(r) > 0 ? Number(r) : null, g = Number(i) > 0 ? Number(i) : null, y = Math.max(0, Number(a) || 0), h = typeof o == "function" ? o : () => !!o, b = $e(), _ = g !== null ? b + g : null, w = _ !== null && typeof AbortController < "u" ? new AbortController() : null, A = () => {
      if (!s) return null;
      if (s.aborted) return {
        promise: Promise.reject(bs(s.reason, b, g)),
        cleanup: null
      };
      let ae = null;
      return {
        promise: new Promise((ue, ne) => {
          const C = () => {
            ne(bs(s.reason, b, g));
          };
          s.addEventListener("abort", C, { once: !0 }), ae = () => s.removeEventListener("abort", C);
        }),
        cleanup: ae
      };
    }, z = async (ae, ue) => {
      const ne = $e();
      if (_ !== null && ne >= _) {
        const I = /* @__PURE__ */ new Error("Deadline exceeded");
        throw I.code = "EDEADLINE", I.attempts = ae, I.elapsedMs = $e() - b, I;
      }
      const C = ws(s, ws(ue, w ? w.signal : null)), N = A(), L = [Promise.resolve().then(() => e(C))], E = [];
      if (_ !== null) {
        const I = _ - $e();
        let Z;
        const $ = new Promise((re, oe) => {
          const me = setTimeout(() => {
            if (w) try {
              w.abort();
            } catch {
            }
            const he = /* @__PURE__ */ new Error("Deadline exceeded");
            he.code = "EDEADLINE", he.attempts = ae, he.elapsedMs = $e() - b, oe(he);
          }, I);
          Z = () => clearTimeout(me);
        });
        L.push($), E.push(Z);
      }
      N && (L.push(N.promise), typeof N.cleanup == "function" && E.push(N.cleanup));
      try {
        return await Promise.race(L);
      } catch (I) {
        throw I && typeof I == "object" && (I.attempts = ae, I.attemptTimeout = m, I.totalTimeout = g), I;
      } finally {
        for (const I of E) typeof I == "function" && I();
      }
    }, j = {
      maxAttempts: p,
      attemptTimeout: m,
      retryIf: (ae) => ae && (ae.code === "EABORT" || ae.code === "EDEADLINE") ? !1 : h(ae),
      onRetry: l
    };
    typeof c < "u" && (j.backoff = c), typeof f < "u" && (j.baseDelay = f), typeof d < "u" && (j.maxDelay = d), typeof u < "u" && (j.jitter = u), y > 0 && typeof j.backoff > "u" && (j.backoff = "fixed", j.baseDelay = y, j.maxDelay = y, j.jitter = !1);
    let W = 0;
    const Q = async (ae) => (W += 1, z(W, ae));
    return va.run(Q, j);
  }
  constructor(e = {}) {
    this._options = e || {};
  }
  async run(e, t = {}) {
    return this.constructor.run(e, Object.assign({}, this._options, t));
  }
}, bs = (e, t, n) => {
  const r = /* @__PURE__ */ new Error("Aborted");
  return r.code = "EABORT", r.reason = e, r.attempts = 0, r.elapsedMs = $e() - t, r.totalTimeout = n, r;
}, ws = (e, t) => {
  if (!e && !t) return;
  if (!e) return t;
  if (!t || typeof AbortController > "u") return e;
  const n = new AbortController(), r = () => {
    try {
      n.abort();
    } catch {
    }
  };
  return typeof e.addEventListener == "function" && e.addEventListener("abort", r, { once: !0 }), typeof t.addEventListener == "function" && t.addEventListener("abort", r, { once: !0 }), n.signal;
}, bc = /* @__PURE__ */ Fi({
  currentLang: () => $t,
  formatDate: () => kc,
  formatNumber: () => xc,
  loadL10nFile: () => Po,
  setLang: () => No,
  t: () => Kn,
  tPlural: () => wc
}), Yt = structuredClone(Mo), Pi = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages?.[0] || "en";
  Pi = String(e).split("-")[0].toLowerCase();
}
Mo[Pi] || (Pi = "en");
var $t = Pi;
function Kn(e, t = {}) {
  let n = (Yt[$t] || Yt.en)?.[e] || Yt.en[e] || "";
  for (const r of Object.keys(t)) {
    const i = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    n = n.replace(new RegExp(`\\{${i}\\}`, "g"), String(t[r]));
  }
  return n;
}
async function Po(e, t) {
  if (!e) return;
  let n = e;
  const r = async (i) => {
    if (Cr && typeof Cr.run == "function") return await Cr.run(() => fetch(i), {
      attemptTimeout: 1e4,
      maxAttempts: 1
    });
    let a = null;
    try {
      typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" && (a = AbortSignal.timeout(1e4));
    } catch {
    }
    return await fetch(i, a ? { signal: a } : void 0);
  };
  try {
    /^https?:\/\//.test(e) || (/^file:\/\//i.test(e) ? n = e : n = new URL(e, location.origin + t).toString());
    const i = await r(n);
    if (!i.ok) return;
    const a = await i.json();
    for (const o of Object.keys(a || {})) Yt[o] = Object.assign({}, Yt[o] || {}, a[o]);
  } catch {
  }
}
function wc(e, t, n = {}) {
  try {
    const r = Yt[$t] || Yt.en, i = new Intl.PluralRules($t).select(t), a = `${e}.${i}`;
    let o = r?.[a] || "";
    if (!o) {
      const l = r?.[e];
      l && typeof l == "object" ? o = l[i] || "" : typeof l == "string" && (o = l);
    }
    if (o || (o = Yt.en[a] || ""), !o) {
      const l = Yt.en[e];
      l && typeof l == "object" ? o = l[i] || "" : typeof l == "string" && (o = l);
    }
    const s = {
      count: String(t),
      ...n
    };
    for (const l of Object.keys(s)) {
      const c = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      o = o.replace(new RegExp(`\\{${c}\\}`, "g"), String(s[l]));
    }
    return o;
  } catch {
    return Kn(e, n);
  }
}
function kc(e, t = {}) {
  try {
    const n = e instanceof Date ? e : new Date(e);
    return isNaN(n.getTime()) ? String(e) : new Intl.DateTimeFormat($t, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...t
    }).format(n);
  } catch {
    return String(e);
  }
}
function xc(e, t = {}) {
  try {
    return new Intl.NumberFormat($t, t).format(e);
  } catch {
    return String(e);
  }
}
function No(e) {
  const t = String(e ?? "").split("-")[0].toLowerCase();
  $t = Yt[t] ? t : "en";
  try {
    if (typeof document < "u" && document.documentElement) {
      document.documentElement.setAttribute("lang", t);
      try {
        const n = new Intl.Locale(t || "en"), r = n.textInfo && n.textInfo.direction === "rtl" || [
          "ar",
          "he",
          "fa",
          "ur",
          "ps",
          "sd",
          "ug",
          "ku",
          "dv",
          "yi"
        ].includes(t);
        document.documentElement.setAttribute("dir", r ? "rtl" : "ltr");
      } catch {
      }
    }
  } catch {
  }
  try {
    typeof window < "u" && window.__nimbiUI && typeof window.__nimbiUI.renderByQuery == "function" && window.__nimbiUI.renderByQuery().catch(() => {
    });
  } catch {
  }
}
var ee = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), ut = [], Ye = /* @__PURE__ */ new Set();
function Sc(e) {
  ut = e;
}
var kt = /* @__PURE__ */ new Set(), Ni = !1;
function wi() {
  return Ni;
}
function Jn(e) {
  if (vc(), kt.clear(), Array.isArray(ut) && ut.length)
    for (const t of ut) t && kt.add(t);
  else for (const t of Ye) t && kt.add(t);
  ks(ee), ks(_e), Ni = !0;
}
try {
  Object.defineProperty(Jn, "_refreshed", {
    get() {
      return Ni;
    },
    set(e) {
      Ni = !!e;
    },
    configurable: !0
  });
} catch {
}
function ks(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values()) t && kt.add(t);
}
function xs(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, r) {
    return r && typeof r == "string" ? kt.add(r) : r?.default && kt.add(r.default), t.call(this, n, r);
  };
}
var Ss = !1;
function vc() {
  Ss || (xs(ee), xs(_e), Ss = !0);
}
function Ac(e) {
  try {
    return String(e ?? "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e ?? "");
  }
}
function vs(e, t = null, n = void 0) {
  let r = "#/" + Ac(String(e ?? ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let i = "";
    if (typeof n == "string") i = n;
    else if (typeof location < "u" && location?.search) i = location.search;
    else if (typeof location < "u" && location?.hash) try {
      const a = mt(location.href);
      a?.params && (i = a.params);
    } catch {
    }
    if (i) {
      const a = typeof i == "string" && i.startsWith("?") ? i.slice(1) : i;
      try {
        const o = new URLSearchParams(a);
        o.delete("page");
        const s = o.toString();
        s && (r += "?" + s);
      } catch {
        const s = String(a ?? "").replace(/^page=[^&]*&?/, "");
        s && (r += "?" + s);
      }
    }
  } catch {
  }
  return r;
}
function mt(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let i = null, a = "";
      if (t.hash) {
        const l = t.hash.replace(/^#/, "");
        if (l.includes("&")) {
          const c = l.split("&");
          i = c.shift() || null, a = c.join("&");
        } else i = l || null;
      }
      const o = new URLSearchParams(t.search);
      o.delete("page");
      const s = [o.toString(), a].filter(Boolean).join("&");
      return {
        type: "canonical",
        page: decodeURIComponent(n),
        anchor: i,
        params: s
      };
    }
    const r = t.hash ? decodeURIComponent(t.hash.replace(/^#/, "")) : "";
    if (r && r.startsWith("/")) {
      let i = r, a = "";
      if (i.indexOf("?") !== -1) {
        const l = i.split("?");
        i = l.shift() || "", a = l.join("?") || "";
      }
      let o = i, s = null;
      if (o.indexOf("#") !== -1) {
        const l = o.split("#");
        o = l.shift() || "", s = l.join("#") || null;
      }
      return {
        type: "cosmetic",
        page: o.replace(/^\/+/, "") || null,
        anchor: s,
        params: a
      };
    }
    return {
      type: "path",
      page: (t.pathname || "").replace(/^\//, "") || null,
      anchor: t.hash ? t.hash.replace(/^#/, "") : null,
      params: t.search ? t.search.replace(/^\?/, "") : ""
    };
  } catch {
    return {
      type: "unknown",
      page: e,
      anchor: null,
      params: ""
    };
  }
}
var pi = typeof DOMParser < "u" ? new DOMParser() : null;
function it() {
  return pi || (typeof DOMParser < "u" ? (pi = new DOMParser(), pi) : null);
}
function er(e) {
  if (e.startsWith("---")) {
    const t = e.indexOf(`
---`, 3);
    if (t !== -1) {
      const n = e.slice(3, t + 0).trim(), r = e.slice(t + 4).trimStart(), i = {};
      return n.split(/\r?\n/).forEach((a) => {
        const o = a.match(/^([^:]+):\s*(.*)$/);
        o && (i[o[1].trim()] = o[2].trim());
      }), {
        content: r,
        data: i
      };
    }
  }
  return {
    content: e,
    data: {}
  };
}
var Io = `let y, w;
function N() {
	return y !== void 0 ? y === !1 ? null : y : typeof TextEncoder < "u" ? (y = new TextEncoder(), y) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (y = { encode: (t) => new Uint8Array(Buffer.from(t)) }, y) : (y = !1, null);
}
function k() {
	return w !== void 0 ? w === !1 ? null : w : typeof TextDecoder < "u" ? (w = new TextDecoder(), w) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (w = { decode: (t) => Buffer.from(t).toString("utf8") }, w) : (w = !1, null);
}
const L = (t, e) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const n = e ?? JSON.stringify(t), i = N();
	if (typeof i?.encode == "function") return i.encode(n);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, z = (t) => {
	let e;
	if (t instanceof Uint8Array) e = t;
	else if (ArrayBuffer.isView(t)) e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) e = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) e = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const n = k();
	if (typeof n?.decode == "function") return JSON.parse(n.decode(e));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(e));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
function O(t) {
	if (t.startsWith("---")) {
		const e = t.indexOf(\`
---\`, 3);
		if (e !== -1) {
			const n = t.slice(3, e + 0).trim(), i = t.slice(e + 4).trimStart(), o = {};
			return n.split(/\\r?\\n/).forEach((a) => {
				const c = a.match(/^([^:]+):\\s*(.*)$/);
				c && (o[c[1].trim()] = c[2].trim());
			}), {
				content: i,
				data: o
			};
		}
	}
	return {
		content: t,
		data: {}
	};
}
let U = null, T = [];
const B = 1e3, C = 4;
function E(t) {
	let e = String(t ?? "").toLowerCase().replace(/[^a-z0-9\\- ]/g, "").replace(/ /g, "-");
	return e = e.replace(/(?:-?)(?:md|html)$/g, ""), e = e.replace(/-+/g, "-"), e = e.replace(/^-|-$/g, ""), e.length > 80 && (e = e.slice(0, 80).replace(/-+$/g, "")), e;
}
function S(t) {
	return String(t ?? "").replace(/^[./]+/, "");
}
function b(t) {
	return String(t ?? "").replace(/\\/+$/, "");
}
function $(t) {
	return b(t) + "/";
}
function I(t, e) {
	if (!t || typeof t != "string") return !1;
	if (t.startsWith("//")) return !0;
	if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
		if (e && typeof e == "string") try {
			const n = new URL(t), i = new URL(e);
			if (n.origin === i.origin) return !n.pathname.startsWith(i.pathname);
		} catch {}
		return !0;
	}
	return !1;
}
function D(t) {
	const e = typeof location < "u" && location.origin ? location.origin : "http://localhost", n = String(t ?? "");
	return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? $(n) : n.startsWith("/") ? e + $(n) : e + "/" + $(n) : e + "/";
}
async function M(t, e) {
	const n = D(e), i = new URL(String(t ?? "").replace(/^\\//, ""), n).toString(), o = await fetch(i);
	return !o || !o.ok ? null : await o.text();
}
async function F(t, e, n = C) {
	const i = Array.isArray(t) ? t.slice() : [], o = Math.max(1, Number(n) || 1), a = [];
	for (let c = 0; c < Math.min(o, i.length); c++) a.push((async () => {
		for (; i.length;) {
			const f = i.shift();
			f != null && await e(f);
		}
	})());
	await Promise.all(a);
}
async function W(t, e = B, n = void 0) {
	const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), a = [""];
	if (Array.isArray(n)) for (const u of n) try {
		const l = S(u);
		l && a.push(l);
	} catch {}
	const c = D(t), f = $(new URL(c).pathname);
	for (; a.length && a.length <= e;) {
		const u = a.shift();
		if (u == null || i.has(u)) continue;
		i.add(u);
		const l = new URL(String(u ?? ""), c).toString();
		let p = null;
		try {
			const h = await fetch(l);
			if (!h || !h.ok) continue;
			p = await h.text();
		} catch {
			continue;
		}
		if (!p) continue;
		const A = [], x = /<a\\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, R = /(?:^|[^!])\\[[^\\]]+\\]\\(([^)]+)\\)/g;
		let g = null;
		for (; g = x.exec(p);) try {
			g?.[1] && A.push(g[1]);
		} catch {}
		for (; g = R.exec(p);) try {
			g?.[1] && A.push(g[1]);
		} catch {}
		for (const h of A) {
			if (!h || I(h, c) || h.startsWith("..") || h.includes("/../")) continue;
			if (h.endsWith("/")) {
				try {
					const r = new URL(h, l);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = $(S(s)), i.has(s) || a.push(s);
				} catch {}
				continue;
			}
			if (/\\.(md|html?)($|[?#])/i.test(h)) {
				try {
					const r = new URL(h, l);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = S(s).split(/[?#]/)[0], s && (o.add(s), i.has(s) || a.push(s));
				} catch {}
				try {
					const r = new URL(h, c);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = S(s).split(/[?#]/)[0], s && !o.has(s) && (o.add(s), i.has(s) || a.push(s));
				} catch {}
				continue;
			}
			let m = h.split(/[?#]/)[0].replace(/\\/+$/, ""), d = null;
			try {
				const r = new URL(h, c);
				d = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
			} catch {}
			try {
				const r = new URL(h, l);
				m = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
			} catch {}
			m = S(m).split(/[?#]/)[0].replace(/\\/+$/, ""), d && (d = S(d).split(/[?#]/)[0].replace(/\\/+$/, ""));
			const _ = String(m).split("/").pop() || "";
			if (!/\\.[^./]+$/i.test(_)) {
				if (m) {
					const r = [
						\`\${m}.md\`,
						\`\${m}.html\`,
						\`\${m}/README.md\`,
						\`\${m}/README.html\`
					];
					for (const s of r) o.add(s), i.has(s) || a.push(s);
				}
				if (d && d !== m) {
					const r = [
						\`\${d}.md\`,
						\`\${d}.html\`,
						\`\${d}/README.md\`,
						\`\${d}/README.html\`
					];
					for (const s of r) o.has(s) || (o.add(s), i.has(s) || a.push(s));
				}
			}
		}
	}
	return Array.from(o);
}
function P(t, e) {
	const n = String(t ?? "");
	if (e) return {
		title: ((n.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i) || [])[1] || (n.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim(),
		excerpt: ((n.match(/<p[^>]*>([\\s\\S]*?)<\\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim()
	};
	const i = ((n.match(/^#\\s+(.+)$/m) || [])[1] || "").trim(), o = n.split(/\\r?\\n\\s*\\r?\\n/);
	let a = "";
	for (let c = 1; c < o.length; c++) {
		const f = o[c].trim();
		if (f && !/^#/.test(f)) {
			a = f.replace(/\\r?\\n/g, " ");
			break;
		}
	}
	return {
		title: i,
		excerpt: a
	};
}
async function v(t, e = 1, n = void 0, i = void 0) {
	if (U) return U;
	U = (async () => {
		const o = Array.isArray(n) ? new Set(n.map((l) => S(l))) : /* @__PURE__ */ new Set(), a = Array.isArray(i) ? i.map((l) => S(l)).filter(Boolean) : [], c = await W(t, B, a), f = Array.from(new Set(c.concat(a))).filter((l) => /\\.(md|html?)$/i.test(l)).filter((l) => !Array.from(o).some((p) => p && (l === p || l.startsWith(p + "/")))), u = [];
		return await F(f, async (l) => {
			const p = await M(l, t);
			if (!p) return;
			const A = /\\.html?$/i.test(l), { title: x, excerpt: R } = P(p, A), g = E(x || l);
			let h = null, m = null;
			try {
				if (!A) {
					const { data: d } = O(p), _ = d.dateModified || d.date || d.lastmod;
					if (_) {
						const s = new Date(_);
						isNaN(s.getTime()) || (h = s.toISOString().split("T")[0]);
					}
					const r = d.image || d.og_image || d.cover || d.featured_image;
					r && String(r).trim() && (m = String(r).trim());
				}
			} catch {}
			if (u.push({
				slug: g,
				title: x,
				excerpt: R,
				path: l,
				lastmod: h,
				image: m
			}), Number(e) >= 2) {
				const d = A ? /<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi : /^##\\s+(.+)$/gm;
				let _ = null;
				for (; _ = d.exec(p);) {
					const r = String(_[1] ?? "").replace(/<[^>]+>/g, "").trim();
					r && u.push({
						slug: \`\${g}::\${E(r)}\`,
						title: r,
						excerpt: "",
						path: l,
						parentTitle: x || "",
						lastmod: h
					});
				}
			}
		}), T = u, T;
	})();
	try {
		return await U;
	} finally {
		U = null;
	}
}
async function J(t, e, n) {
	const i = E(t);
	if (!i) return null;
	const o = await v(e), a = (Array.isArray(o) ? o : []).find((u) => {
		try {
			return String(u?.slug ?? "").split("::")[0] === i;
		} catch {
			return !1;
		}
	});
	if (a?.path) return a.path;
	const c = [\`\${i}.html\`, \`\${i}.md\`];
	for (const u of c) try {
		if (await M(u, e)) return u;
	} catch {}
	const f = await W(e, n || B);
	for (const u of f) if (E(String(u ?? "").replace(/^.*\\//, "").replace(/\\.(md|html?)$/i, "")) === i) return u;
	return null;
}
function q(t) {
	try {
		return z(t);
	} catch {
		return t || {};
	}
}
onmessage = async (t) => {
	const e = q(t.data), { correlationId: n } = e, i = (a) => {
		if (n != null) {
			const c = L({
				correlationId: n,
				response: a
			});
			postMessage(c, [c.buffer]);
		} else postMessage({
			id: e.id,
			result: a
		});
	}, o = (a) => {
		if (n != null) {
			const c = L({
				correlationId: n,
				response: { error: String(a) }
			});
			postMessage(c, [c.buffer]);
		} else postMessage({
			id: e.id,
			error: String(a)
		});
	};
	try {
		if (e.type === "buildSearchIndex") {
			const { contentBase: a, indexDepth: c, noIndexing: f, seedPaths: u } = e;
			try {
				i(await v(a, c, f, u));
			} catch (l) {
				o(l);
			}
			return;
		}
		if (e.type === "crawlForSlug") {
			const { slug: a, base: c, maxQueue: f } = e;
			try {
				const u = await J(a, c, f);
				i(u === void 0 ? null : u);
			} catch (u) {
				o(u);
			}
			return;
		}
	} catch (a) {
		o(a);
	}
};
`, As = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Io], { type: "text/javascript;charset=utf-8" });
function Ec(e) {
  let t;
  try {
    if (t = As && (self.URL || self.webkitURL).createObjectURL(As), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Io), {
      type: "module",
      name: e?.name
    });
  }
}
var dn, pn;
function Tc() {
  return dn !== void 0 ? dn === !1 ? null : dn : typeof TextEncoder < "u" ? (dn = new TextEncoder(), dn) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (dn = { encode: (e) => new Uint8Array(Buffer.from(e)) }, dn) : (dn = !1, null);
}
function Rc() {
  return pn !== void 0 ? pn === !1 ? null : pn : typeof TextDecoder < "u" ? (pn = new TextDecoder(), pn) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (pn = { decode: (e) => Buffer.from(e).toString("utf8") }, pn) : (pn = !1, null);
}
var oa = (e, t) => {
  if (e instanceof Uint8Array) return e;
  if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  const n = t ?? JSON.stringify(e), r = Tc();
  if (typeof r?.encode == "function") return r.encode(n);
  throw new Error("No TextEncoder or Buffer available to encode object");
}, Lc = (e) => {
  let t;
  if (e instanceof Uint8Array) t = e;
  else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  else if (e instanceof ArrayBuffer) t = new Uint8Array(e);
  else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
  else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
  const n = Rc();
  if (typeof n?.decode == "function") return JSON.parse(n.decode(t));
  if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(t));
  throw new Error("No TextDecoder or Buffer available to decode object");
}, Cc = null;
function Mc() {
  const e = Cc || (typeof cs < "u" ? cs : null);
  if (e) return e("worker_threads").Worker;
  throw new Error("WorkerAgnostic: Node worker_threads is not available synchronously in pure ESM. Call `await WorkerAgnostic.preloadNode()` once before constructing a string-source worker, set globalThis.Worker, or pass a factory function instead of a path string.");
}
function Es() {
  return typeof window < "u" && typeof window.document < "u" ? "browser" : typeof self < "u" && typeof self.importScripts == "function" ? "webworker" : typeof process < "u" && process.versions?.node ? "node" : "unknown";
}
var Ts = [
  "message",
  "error",
  "messageerror"
];
function Rs(e, t, n) {
  const r = typeof globalThis < "u" && globalThis.Worker || (typeof Worker < "u" ? Worker : void 0);
  if (typeof r == "function" && typeof e == "string") return new r(e, t);
  if (n === "node" || n === "browser" || n === "webworker") {
    const i = n === "node" ? Mc() : void 0;
    if (typeof e == "function") return Ls(e, i, t, n);
    if (typeof e == "string") return n === "node" ? new i(e, t) : Oo(e, t);
    throw new Error("Invalid workerSource: expected Worker factory or path string");
  }
  if (typeof e == "function") return Ls(e, void 0, t, "unknown");
  throw new Error("Unsupported environment for WorkerAgnostic: cannot resolve a string workerSource without a global Worker or a known runtime");
}
function Ls(e, t, n, r) {
  if (typeof e.prototype > "u") return Cs(e(), t, n, r);
  try {
    return new e();
  } catch (i) {
    if (i instanceof TypeError && /not a constructor|cannot be invoked without\s*'new'|Class constructor|not constructable/i.test(String(i?.message))) return Cs(e(), t, n, r);
    throw i;
  }
}
function Cs(e, t, n, r) {
  return e && typeof e == "object" && typeof e.postMessage == "function" ? e : typeof e == "string" ? r === "node" ? new t(e, n) : Oo(e, n) : e && typeof e == "object" ? e : {};
}
function Oo(e, t) {
  let n;
  try {
    n = new Function("try { return import.meta?.url } catch (e) { return undefined }")();
  } catch {
    n = void 0;
  }
  if (!n && typeof document < "u") {
    const r = document.currentScript;
    r?.src && (n = r.src);
  }
  !n && typeof location < "u" && location.href && (n = location.href);
  try {
    if (n) return new Worker(new URL(e, n), t);
  } catch {
  }
  return new Worker(e, t);
}
function Pc(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object" && Array.isArray(e.transfer)) return e.transfer;
}
var Nc = class {
  constructor(e, t = {}) {
    this.env = Es(), this.options = t && typeof t == "object" ? t : {}, this._listeners = /* @__PURE__ */ new Map(), this.worker = Rs(e, this.options, this.env), this._wireEvents();
  }
  static create(e, t) {
    return Rs(e, t || {}, Es());
  }
  _wireEvents() {
    const e = this.worker;
    if (e)
      if (typeof e.addEventListener == "function") {
        this._nativeModel = "listener";
        for (const t of Ts) e.addEventListener(t, (...n) => this._dispatch(t, ...n));
      } else if (typeof e.on == "function") {
        this._nativeModel = "emitter";
        for (const t of Ts) e.on(t, (...n) => this._dispatch(t, ...n));
      } else
        this._nativeModel = "property", e.onmessage = (...t) => this._dispatch("message", ...t), e.onerror = (...t) => this._dispatch("error", ...t), e.onmessageerror = (...t) => this._dispatch("messageerror", ...t);
  }
  _dispatch(e, ...t) {
    const n = this._listeners.get(e);
    if (!n || !n.size) return;
    let r;
    if (e === "message") {
      const i = t[0];
      r = [{
        data: this._nativeModel === "emitter" ? i : i && typeof i == "object" && "data" in i ? i.data : i,
        originalEvent: i
      }];
    } else r = t;
    for (const i of n) try {
      i(...r);
    } catch {
    }
  }
  addEventListener(e, t) {
    return typeof t != "function" ? this : (this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(t), this);
  }
  removeEventListener(e, t) {
    const n = this._listeners.get(e);
    return n && (n.delete(t), n.size === 0 && this._listeners.delete(e)), this;
  }
  on(e, t) {
    return this.addEventListener(e, t);
  }
  off(e, t) {
    return this.removeEventListener(e, t);
  }
  postMessage(e, t) {
    const n = this.worker;
    if (!n || typeof n.postMessage != "function") throw new Error("Underlying worker does not implement postMessage");
    const r = Pc(t);
    return r && r.length ? n.postMessage(e, r) : n.postMessage(e);
  }
  terminate() {
    const e = this.worker;
    if (!e || typeof e.terminate != "function") return Promise.resolve();
    try {
      const t = e.terminate();
      return t && typeof t.then == "function" ? t : Promise.resolve(t);
    } catch (t) {
      return Promise.reject(t);
    }
  }
}, ki = class {
  constructor(e = 16) {
    const t = Math.max(2, Number(e) || 16);
    for (this._capacity = 1; this._capacity < t; ) this._capacity <<= 1;
    this._mask = this._capacity - 1, this._buffer = new Array(this._capacity), this._head = 0, this._tail = 0, this._size = 0;
  }
  push(e) {
    return this._size === this._capacity && this._grow(), this._buffer[this._tail] = e, this._tail = this._tail + 1 & this._mask, this._size++, this._size;
  }
  shift() {
    if (this._size === 0) return;
    const e = this._buffer[this._head];
    return this._buffer[this._head] = void 0, this._head = this._head + 1 & this._mask, this._size--, e;
  }
  peek() {
    return this._size === 0 ? void 0 : this._buffer[this._head];
  }
  clear() {
    if (this._size === 0) return;
    let e = this._head;
    for (let t = 0; t < this._size; t++)
      this._buffer[e] = void 0, e = e + 1 & this._mask;
    this._head = this._tail = 0, this._size = 0;
  }
  get capacity() {
    return this._capacity;
  }
  get isEmpty() {
    return this._size === 0;
  }
  *[Symbol.iterator]() {
    let e = this._head;
    for (let t = 0; t < this._size; t++) yield this._buffer[e + t & this._mask];
  }
  values() {
    return this[Symbol.iterator]();
  }
  *keys() {
    for (let e = 0; e < this._size; e++) yield e;
  }
  *entries() {
    for (let e = 0; e < this._size; e++) yield [e, this._buffer[this._head + e & this._mask]];
  }
  *drain() {
    for (; this._size > 0; ) yield this.shift();
  }
  toArray() {
    const e = new Array(this._size);
    for (let t = 0; t < this._size; t++) e[t] = this._buffer[this._head + t & this._mask];
    return e;
  }
  _grow() {
    const e = this._buffer, t = this._capacity << 1, n = new Array(t);
    for (let r = 0; r < this._size; r++) n[r] = e[this._head + r & this._mask];
    this._buffer = n, this._capacity = t, this._mask = t - 1, this._head = 0, this._tail = this._size & this._mask;
  }
  pushMany(e) {
    if (!Array.isArray(e) || e.length === 0) return this._size;
    const t = this._size + e.length;
    for (; this._capacity < t; ) this._grow();
    const n = Math.min(e.length, this._capacity - this._tail);
    for (let i = 0; i < n; i++) this._buffer[this._tail + i] = e[i];
    this._tail = this._tail + n & this._mask;
    let r = n;
    for (; r < e.length; ) {
      const i = Math.min(e.length - r, this._capacity - this._tail);
      for (let a = 0; a < i; a++) this._buffer[this._tail + a] = e[r + a];
      this._tail = this._tail + i & this._mask, r += i;
    }
    return this._size = t, this._size;
  }
  get length() {
    return this._size;
  }
  unshiftMany(e) {
    if (!Array.isArray(e) || e.length === 0) return this._size;
    const t = this._size + e.length;
    for (; this._capacity < t; ) this._grow();
    let n = this._head - e.length & this._mask;
    for (let r = 0; r < e.length; r++) this._buffer[n + r & this._mask] = e[r];
    return this._head = n, this._size = t, this._size;
  }
}, Ic = /* @__PURE__ */ Symbol("PowerSubscriberSet.original"), On = class {
  constructor(e = {}) {
    const { weak: t = !1, maxListeners: n = 0 } = e || {};
    this._weak = !!t, this._maxListeners = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0, this._listeners = /* @__PURE__ */ new Set(), this._onceMap = /* @__PURE__ */ new WeakMap(), this._finalization = null, this._weak && typeof WeakRef < "u" && typeof FinalizationRegistry < "u" && (this._finalization = new FinalizationRegistry((r) => {
      this._listeners.delete(r.ref);
    }));
  }
  get size() {
    return this._cleanup(), this._listeners.size;
  }
  add(e) {
    if (typeof e != "function") {
      if (!this._weak || !e || typeof e.deref != "function") throw new TypeError("listener must be a function");
      if (this._maxListeners > 0 && this.size + 1 > this._maxListeners) throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);
      return this._listeners.add(e), () => this.delete(e);
    }
    if (this._maxListeners > 0 && this.size + 1 > this._maxListeners) throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);
    const t = this._makeEntry(e);
    return this._listeners.add(t), () => this.delete(e);
  }
  addOnce(e) {
    if (typeof e != "function") throw new TypeError("listener must be a function");
    const t = (...r) => {
      try {
        e(...r);
      } finally {
        this.delete(e);
      }
    };
    try {
      t[Ic] = e;
    } catch {
    }
    if (this._maxListeners > 0 && this.size + 1 > this._maxListeners) throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);
    this._onceMap.set(e, t);
    const n = this._makeEntry(t);
    return this._listeners.add(n), () => this.delete(e);
  }
  delete(e) {
    let t = e;
    const n = this._onceMap.get(e);
    n && (t = n, this._onceMap.delete(e));
    for (const r of this._listeners) {
      if (r === t)
        return this._listeners.delete(r), this._finalization && typeof r.deref == "function" && this._finalization.unregister(r), !0;
      const i = this._deref(r);
      if (!i) {
        this._listeners.delete(r);
        continue;
      }
      if (i === t)
        return this._listeners.delete(r), this._finalization && typeof r.deref == "function" && this._finalization.unregister(r), !0;
    }
    return !1;
  }
  forEach(e) {
    for (const t of this._listeners) {
      const n = this._deref(t);
      if (!n) {
        this._listeners.delete(t);
        continue;
      }
      e(n);
    }
  }
  clear() {
    this._listeners.clear(), this._onceMap = /* @__PURE__ */ new WeakMap();
  }
  values() {
    this._cleanup();
    const e = [];
    for (const t of this._listeners) {
      const n = this._deref(t);
      n && e.push(n);
    }
    return e;
  }
  *[Symbol.iterator]() {
    for (const e of this._listeners) {
      const t = this._deref(e);
      if (!t) {
        this._listeners.delete(e);
        continue;
      }
      yield t;
    }
  }
  _cleanup() {
    if (!(!this._weak || typeof WeakRef > "u"))
      for (const e of this._listeners) typeof e?.deref == "function" && !e.deref() && this._listeners.delete(e);
  }
  _makeEntry(e) {
    if (this._weak && typeof WeakRef < "u") {
      const t = new WeakRef(e);
      if (this._finalization) try {
        this._finalization.register(e, { ref: t }, t);
      } catch {
      }
      return t;
    }
    return e;
  }
  _deref(e) {
    return typeof e?.deref == "function" ? e.deref() : e;
  }
};
function Ms(e) {
  if (e) {
    if (typeof e.cleanup == "function") {
      try {
        e.cleanup();
      } catch {
      }
      return;
    }
    if (typeof e._cleanup == "function") {
      try {
        e._cleanup();
      } catch {
      }
      return;
    }
    if (typeof e[Symbol.iterator] == "function" && typeof e.delete == "function")
      for (const t of e) (typeof t?.deref == "function" ? t.deref() : t) || e.delete(t);
  }
}
var Oc = class {
  constructor(e = {}) {
    this._listeners = /* @__PURE__ */ new Map(), this._maxListeners = Number.isFinite(Number(e.maxListeners)) ? Math.max(0, Number(e.maxListeners)) : 0, this._weak = !!e.weak, this._fr = null, this._finalizationRefs = /* @__PURE__ */ new WeakMap(), this._eventFinalizationRefs = /* @__PURE__ */ new Map();
  }
  _ensureFinalizationRegistry() {
    return !this._weak || typeof FinalizationRegistry > "u" ? null : this._fr ? this._fr : (this._fr = new FinalizationRegistry((e) => {
      try {
        const { event: t, ref: n } = e, r = this._listeners.get(t), i = this._eventFinalizationRefs.get(t);
        if (i && n && (i.delete(n), i.size === 0 && this._eventFinalizationRefs.delete(t)), !r) return;
        Ms(r), r.size === 0 && (this._listeners.delete(t), this._eventFinalizationRefs.delete(t));
      } catch {
      }
    }), this._fr);
  }
  cleanup() {
    if (this._weak)
      for (const [e, t] of this._listeners)
        Ms(t), t.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e));
  }
  on(e, t) {
    if (typeof t != "function") throw new TypeError("listener must be a function");
    let n = this._getBucket(e);
    n || (n = new On({
      maxListeners: this._maxListeners,
      weak: this._weak
    }), this._listeners.set(e, n));
    const r = n.add(t);
    return this._registerWeakListener(t, e) ? () => {
      r(), this._unregisterWeakListener(t, e);
    } : r;
  }
  _getBucket(e) {
    let t = this._listeners.get(e);
    if (!t) return null;
    if (t instanceof On) return t;
    if (typeof t?.[Symbol.iterator] == "function") {
      const n = new On({
        maxListeners: this._maxListeners,
        weak: this._weak
      });
      for (const r of t) {
        const i = typeof r?.deref == "function" ? r.deref() : r;
        i && n.add(i);
      }
      return this._listeners.set(e, n), n;
    }
    return null;
  }
  _registerWeakListener(e, t) {
    const n = this._ensureFinalizationRegistry();
    if (!n || typeof WeakRef > "u") return null;
    const r = new WeakRef(e);
    try {
      n.register(e, {
        event: t,
        ref: r
      }, r);
      let i = this._finalizationRefs.get(e);
      i || (i = /* @__PURE__ */ new Map(), this._finalizationRefs.set(e, i));
      let a = i.get(t);
      a || (a = /* @__PURE__ */ new Set(), i.set(t, a)), a.add(r);
      let o = this._eventFinalizationRefs.get(t);
      o || (o = /* @__PURE__ */ new Set(), this._eventFinalizationRefs.set(t, o)), o.add(r);
    } catch {
      return null;
    }
    return r;
  }
  _unregisterWeakListener(e, t) {
    if (!this._fr || !this._finalizationRefs.has(e)) return;
    const n = this._finalizationRefs.get(e);
    if (!n || n.size === 0) {
      this._finalizationRefs.delete(e);
      return;
    }
    const r = t !== void 0 ? [t] : Array.from(n.keys());
    for (const i of r) {
      const a = n.get(i);
      if (!a || a.size === 0) {
        n.delete(i);
        continue;
      }
      for (const o of a) {
        try {
          this._fr.unregister(o);
        } catch {
        }
        const s = this._eventFinalizationRefs.get(i);
        s && (s.delete(o), s.size === 0 && this._eventFinalizationRefs.delete(i));
      }
      n.delete(i);
    }
    n.size === 0 && this._finalizationRefs.delete(e);
  }
  _clearWeakListenerEvent(e) {
    if (!this._fr) return;
    const t = this._eventFinalizationRefs.get(e);
    if (t) {
      for (const n of t) try {
        this._fr.unregister(n);
      } catch {
      }
      this._eventFinalizationRefs.delete(e);
    }
  }
  once(e, t) {
    if (typeof t != "function") throw new TypeError("listener must be a function");
    let n = this._getBucket(e);
    n || (n = new On({
      maxListeners: this._maxListeners,
      weak: this._weak
    }), this._listeners.set(e, n));
    const r = n.addOnce(t);
    return this._registerWeakListener(t, e) ? () => {
      r(), this._unregisterWeakListener(t, e);
    } : r;
  }
  off(e, t) {
    const n = this._getBucket(e);
    n && (n.delete(t), this._unregisterWeakListener(t, e), n.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e)));
  }
  emit(e, t) {
    const n = this._listeners.get(e);
    if (!n || n.size === 0) return !1;
    if (n instanceof On) {
      let i = !1;
      return n.forEach((a) => {
        i = !0;
        try {
          a(t);
        } catch {
        }
      }), n.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e)), i;
    }
    const r = n.size > 0;
    for (const i of n) {
      const a = typeof i?.deref == "function" ? i.deref() : i;
      if (!a) {
        n.delete(i);
        continue;
      }
      try {
        a(t);
      } catch {
      }
    }
    return n.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e)), r;
  }
  *_iterBucketListeners(e) {
    if (e instanceof On) {
      yield* e;
      return;
    }
    for (const t of e) {
      const n = typeof t?.deref == "function" ? t.deref() : t;
      if (!n) {
        e.delete(t);
        continue;
      }
      yield n;
    }
  }
  async emitAsync(e, t, { concurrency: n = 1 / 0 } = {}) {
    const r = this._listeners.get(e);
    if (!r || r.size === 0) return !1;
    const i = Number.isFinite(+n) && +n > 0 ? Math.max(1, Math.floor(+n)) : 1 / 0, a = async (l) => {
      try {
        await l(t);
      } catch {
      }
    }, o = /* @__PURE__ */ new Set();
    let s = !1;
    for (const l of this._iterBucketListeners(r)) {
      if (!l) continue;
      s = !0;
      const c = Promise.resolve().then(() => a(l)).finally(() => {
        o.delete(c);
      });
      o.add(c), Number.isFinite(i) && o.size >= i && await Promise.race(o);
    }
    return o.size && await Promise.all(o), r.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e)), s;
  }
  listeners(e) {
    const t = this._listeners.get(e);
    return t ? t instanceof On ? t.values() : Array.from(t).map((n) => typeof n?.deref == "function" ? n.deref() : n).filter(Boolean) : [];
  }
  clear(e) {
    if (e === void 0) {
      for (const t of this._eventFinalizationRefs.keys()) this._clearWeakListenerEvent(t);
      this._eventFinalizationRefs.clear(), this._finalizationRefs = /* @__PURE__ */ new WeakMap(), this._listeners.clear();
      return;
    }
    this._clearWeakListenerEvent(e), this._listeners.delete(e);
  }
}, zc = class {
  constructor(e, t, n) {
    this._underlying = e, this._logger = t, this._pool = n, this.onmessage = null, this.onerror = null, this.onmessageerror = null;
  }
  postMessage(e, t) {
    let n = e, r = t;
    if (n instanceof Uint8Array || ArrayBuffer.isView(n) || n instanceof ArrayBuffer) {
      if (Array.isArray(r)) try {
        r.length ? this._underlying.postMessage(n, r) : this._underlying.postMessage(n);
        return;
      } catch (i) {
        throw this._logger.error(i, "Failed to postMessage to underlying worker"), i;
      }
      if (!r) {
        const i = n instanceof ArrayBuffer ? n : n.buffer;
        i?.byteLength > 0 && (r = [i]);
      }
      try {
        r?.length ? this._underlying.postMessage(n, r) : this._underlying.postMessage(n);
      } catch (i) {
        throw this._logger.error(i, "Failed to postMessage to underlying worker"), i;
      }
      return;
    }
    if (n !== null && typeof n == "object" && !ArrayBuffer.isView(n) && !(n instanceof ArrayBuffer)) try {
      const i = this._pool._encodeForTransfer(e).slice();
      if (!r) r = [i.buffer];
      else if (Array.isArray(r))
        r.includes(i.buffer) || r.push(i.buffer);
      else {
        const a = Array.from(r);
        a.includes(i.buffer) || a.push(i.buffer), r = a;
      }
      n = i;
    } catch {
      r = t, n = e;
    }
    try {
      r?.length ? this._underlying.postMessage(n, r) : this._underlying.postMessage(n);
    } catch (i) {
      throw this._logger.error(i, "Failed to postMessage to underlying worker"), i;
    }
  }
  addEventListener(...e) {
    return this._underlying.addEventListener(...e);
  }
  removeEventListener(...e) {
    return this._underlying.removeEventListener(...e);
  }
  terminate() {
    typeof this._underlying.terminate == "function" && this._underlying.terminate();
  }
}, $c = class extends Error {
  constructor(e = "PowerPool has been shut down") {
    super(e), this.name = "PowerPoolShutdownError";
  }
}, Za = class {
  constructor(e, t = {}) {
    const n = typeof navigator < "u" && navigator.hardwareConcurrency || 2, { size: r = Math.min(n, 2), minSize: i = 2, maxSize: a = Math.max(r, n), workerOptions: o = {}, maxTasksPerWorker: s, idleTimeout: l = Xl, taskQueue: c = !0, queuePolicy: f = "enqueue", lazy: d = !0, awaitResponseTimeout: u = ka, slowTaskThreshold: p = 1 / 0, autoScale: m = !1 } = t, g = s === void 0 && m ? 1 : s ?? 1 / 0;
    if (typeof e != "function" && typeof e != "string") throw new TypeError("PowerPool workerSource must be a function or string");
    this._workerSource = e, this._workerOptions = o, this._maxTasksPerWorker = g, this.minSize = Math.max(0, i), this.maxSize = Math.max(this.minSize, a), this.idleTimeout = Math.max(0, l), this.taskQueueEnabled = !!c, this._queuePolicy = [
      "enqueue",
      "drop-oldest",
      "drop-newest",
      "reject"
    ].includes(f) ? f : "enqueue", this._createdAt = $e(), this._totalWorkersCreated = 0, this._totalTasksCompleted = 0, this._taskDurationsWelfordCount = 0, this._taskDurationsWelfordMean = 0, this._taskDurationsWelfordM2 = 0, this._taskDurationsMin = Number.POSITIVE_INFINITY, this._taskDurationsMax = Number.NEGATIVE_INFINITY, this._slowTaskThreshold = Number.isFinite(p) ? Number(p) : 1 / 0, this._slowTaskCount = 0, this._ewmaLatency = null, this._autoScale = null, this._autoScaleInterval = null, this._lastAutoScaleAt = 0, this._terminatedWorkerTaskCountsTotal = 0, this._terminatedWorkerTaskCountsCount = 0, this.workers = [], this.queue = new ki();
    const y = {
      maxListeners: t?.listenerMaxListeners ?? t?.maxListeners,
      weak: !!t?.weakListeners
    };
    this._bus = new Oc(y), this._queueHighThreshold = Number.isFinite(Number(t?.queueHighThreshold)) ? Math.max(0, Math.floor(Number(t?.queueHighThreshold))) : 1 / 0, this._queueHighCrossed = !1, this._onmessage = null, this._onerror = null, this._onidle = null, this._onresize = null, this._nextIndex = 0, this._nextWorkerId = 0, this._correlationCounter = 0, this._activeTasks = 0, this._isIdle = !0, this._queuePaused = !1;
    const h = typeof t?.debugLevel == "number" ? t.debugLevel : 1;
    if (this._logger = new xo(h, { name: "powerPool" }), arguments.length > 1 && arguments[1] != null && typeof arguments[1] != "object") throw new TypeError("PowerPool options must be an object");
    this._pendingResponses = /* @__PURE__ */ new Map(), this._underlyingToWorkerObj = /* @__PURE__ */ new Map(), this._defaultAwaitResponseTimeout = Number.isFinite(Number(u)) ? Math.max(0, Math.floor(Number(u))) : ka;
    const b = d ? Math.min(this.minSize, this.maxSize) : Math.min(Math.max(r, this.minSize), this.maxSize);
    for (let _ = 0; _ < b; _++) try {
      this._addWorkerInstance();
    } catch (w) {
      try {
        if ((w?.message ? String(w.message) : "").includes("Invalid workerSource")) throw w;
      } catch (A) {
        throw A;
      }
      try {
        this._logger.error(w, "Initial worker creation failed");
      } catch (A) {
        this._debugLog?.(A, "Initial worker creation: logger error");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "init",
          error: w
        });
      } catch (A) {
        this._debugLog?.(A, "Initial worker creation: bus.emit failed");
      }
      break;
    }
    if (this._reaperInterval = setInterval(() => this._reapIdleWorkers(), Math.max(fs, Math.floor(this.idleTimeout / 2))), this._encodeCache = /* @__PURE__ */ new Map(), this._encodeCacheLimit = Math.max(16, t?.encodeCacheLimit ? t.encodeCacheLimit : 64), this._encodeCacheByteLimit = Number.isFinite(Number(t?.encodeCacheByteLimit)) ? Math.max(0, Number(t?.encodeCacheByteLimit)) : 1 / 0, this._encodeCacheBytes = 0, t?.autoScale) {
      const _ = typeof t.autoScale == "object" ? t.autoScale : {}, w = Number.isFinite(Number(_.intervalMs)) ? Math.max(100, Math.floor(_.intervalMs)) : Ql, A = Number.isFinite(Number(_.targetMs)) ? Math.max(1, Number(_.targetMs)) : 50, z = Number.isFinite(Number(_.alpha)) ? Math.max(0, Math.min(1, Number(_.alpha))) : 0.2, j = Number.isFinite(Number(_.cooldownMs)) ? Math.max(0, Math.floor(_.cooldownMs)) : Kl, W = Number.isFinite(Number(_.hysteresis)) ? Math.max(0, Math.min(1, Number(_.hysteresis))) : 0.2, Q = Number.isFinite(Number(_.stepUp)) ? Math.max(1, Math.floor(Number(_.stepUp))) : 1, ae = Number.isFinite(Number(_.stepDown)) ? Math.max(1, Math.floor(Number(_.stepDown))) : 1, ue = Number.isFinite(Number(_.backoffFactor)) ? Math.max(1, Number(_.backoffFactor)) : 1, ne = Number.isFinite(Number(_.backoffMaxMultiplier)) ? Math.max(1, Number(_.backoffMaxMultiplier)) : 8, C = Number.isFinite(Number(_.backoffResetMs)) ? Math.max(0, Math.floor(Number(_.backoffResetMs))) : j * 4;
      this._autoScale = {
        enabled: !0,
        intervalMs: w,
        targetMs: A,
        alpha: z,
        cooldownMs: j,
        hysteresis: W,
        stepUp: Q,
        stepDown: ae,
        backoffFactor: ue,
        backoffMaxMultiplier: ne,
        backoffResetMs: C
      }, this._autoScaleBackoffMultiplier = 1;
      try {
        this._autoScaleInterval = setInterval(() => this._autoScaleTick(), w);
      } catch (N) {
        this._debugLog?.(N, "autoScale: interval setup failed");
      }
    }
  }
  _debugLog(e, t) {
    try {
      typeof this._logger?.debug == "function" && (e ? this._logger.debug(e, t || "swallowed error") : this._logger.debug(t || "swallowed error"));
    } catch (n) {
      try {
        typeof console < "u" && typeof console.debug == "function" && console.debug(n, t || "swallowed error");
      } catch {
      }
    }
  }
  _ensureReaper() {
    try {
      this._reaperInterval || (this._reaperInterval = setInterval(() => this._reapIdleWorkers(), Math.max(fs, Math.floor(this.idleTimeout / 2))));
    } catch (e) {
      this._debugLog?.(e, "_ensureReaper: setInterval failed");
    }
  }
  _createPendingResponsePromise(e, t) {
    const n = e != null ? String(e) : e;
    let r = null;
    return {
      pendingPromise: new Promise((i, a) => {
        r = {
          resolve: i,
          reject: a,
          timer: null
        };
        const o = Number.isFinite(Number(t?.timeout)) ? Math.max(0, Math.floor(Number(t?.timeout))) : Number.isFinite(Number(this._defaultAwaitResponseTimeout)) ? this._defaultAwaitResponseTimeout : void 0;
        Number.isFinite(o) && o > 0 && (r.timer = setTimeout(() => {
          try {
            this._cleanupPendingResponse(n, { rejectWith: /* @__PURE__ */ new Error("postMessage response timeout") });
          } catch {
            try {
              a(/* @__PURE__ */ new Error("postMessage response timeout"));
            } catch (l) {
              this._debugLog?.(l, "createPendingResponsePromise: reject fallback failed");
            }
          }
        }, o)), this._pendingResponses.set(n, r);
      }),
      correlationKey: n
    };
  }
  _postToWorkerObj(e, t, n, r, i, a) {
    if (t && t.message && typeof t.message == "object" && t.message !== null && !ArrayBuffer.isView(t.message) && !(t.message instanceof ArrayBuffer) && Array.isArray(t.transfer) && t.transfer.length > 0 && e?.worker?._underlying?.postMessage) try {
      return e.worker._underlying.postMessage(t.message, t.transfer), typeof e._startTimes?.push == "function" && e._startTimes.push(n), e.tasks++, this._activeTasks++, e.lastActive = n, this._isIdle && this._updateIdleState(), r ? a : !0;
    } catch {
    }
    try {
      return t.transfer?.length ? e.worker.postMessage(t.message, t.transfer) : e.worker.postMessage(t.message), typeof e._startTimes?.push == "function" && e._startTimes.push(n), e.tasks++, this._activeTasks++, e.lastActive = n, this._isIdle && this._updateIdleState(), r ? a : !0;
    } catch (o) {
      if (r && i) {
        try {
          this._cleanupPendingResponse(i, { rejectWith: o });
        } catch (s) {
          this._debugLog?.(s, "postToWorkerObj: cleanupPendingResponse failed");
        }
        try {
          this._logger.error(o, "Failed to postMessage to worker");
        } catch (s) {
          this._debugLog?.(s, "postToWorkerObj: logger.error failed");
        }
        return a;
      }
      try {
        this._logger.error(o, "Failed to postMessage to worker");
      } catch (s) {
        this._debugLog?.(s, "postToWorkerObj: logger.error failed");
      }
      return !1;
    }
  }
  _tryGrowPool(e, t, n, r, i, a, o) {
    let s;
    try {
      s = this._addWorkerInstance();
    } catch (c) {
      try {
        this._logger.error(c, "Failed to grow pool");
      } catch (f) {
        this._debugLog?.(f, "tryGrowPool: logger.error failed");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "grow",
          error: c
        });
      } catch (f) {
        this._debugLog?.(f, "tryGrowPool: bus.emit failed");
      }
      if (i && a) {
        try {
          this._cleanupPendingResponse(a, { rejectWith: c });
        } catch (f) {
          this._debugLog?.(f, "tryGrowPool: cleanupPendingResponse failed");
        }
        return o;
      }
      return !1;
    }
    if (!s) {
      if (i && a) {
        try {
          this._cleanupPendingResponse(a, { rejectWith: /* @__PURE__ */ new Error("failed to add worker") });
        } catch (c) {
          this._debugLog?.(c, "tryGrowPool: cleanupPendingResponse failed");
        }
        return o;
      }
      return !1;
    }
    const l = this._prepareForTransfer(e, t, n);
    return this._postToWorkerObj(s, l, r, i, a, o);
  }
  _enqueueOrReject(e, t, n, r) {
    const i = this._queuePolicy;
    if (i === "reject")
      return t && n ? (this._cleanupPendingResponse(n, { rejectWith: /* @__PURE__ */ new Error("postMessage rejected by queue policy") }), r) : !1;
    if (i === "drop-newest" && this.queue.length > 0)
      return t && n ? (this._cleanupPendingResponse(n, { rejectWith: /* @__PURE__ */ new Error("postMessage rejected by queue policy") }), r) : !1;
    if (i === "drop-oldest" && this.queue.length > 0) {
      const o = this.queue.shift();
      o?.correlationId != null && this._cleanupPendingResponse(o.correlationId, { rejectWith: /* @__PURE__ */ new Error("postMessage queued task dropped by policy") });
    }
    const a = {
      message: e.message,
      transfer: e.transfer
    };
    t && n && (a.correlationId = n), this.queue.push(a);
    try {
      Number.isFinite(this._queueHighThreshold) && this.queue.length > this._queueHighThreshold && !this._queueHighCrossed && (this._queueHighCrossed = !0, this._bus.emit("pool:queue:high", {
        length: this.queue.length,
        threshold: this._queueHighThreshold
      }));
    } catch (o) {
      this._debugLog?.(o, "enqueueOrReject: bus.emit failed");
    }
    return this._updateIdleState(), t ? r : !0;
  }
  _clearLifecycleIntervals() {
    try {
      this._reaperInterval && (clearInterval(this._reaperInterval), this._reaperInterval = null);
    } catch (e) {
      this._debugLog?.(e, "clearLifecycleIntervals: clearInterval(reaper) failed");
    }
    try {
      this._autoScaleInterval && (clearInterval(this._autoScaleInterval), this._autoScaleInterval = null);
    } catch (e) {
      this._debugLog?.(e, "clearLifecycleIntervals: clearInterval(autoScale) failed");
    }
  }
  shutdown() {
    this._clearLifecycleIntervals();
    try {
      for (const [t] of this._pendingResponses) try {
        this._cleanupPendingResponse(t, { rejectWith: new $c("pool:shutdown") });
      } catch (n) {
        this._debugLog?.(n, "shutdown: cleanup pending response");
      }
      try {
        typeof this._pendingResponses?.clear == "function" && this._pendingResponses.clear();
      } catch (t) {
        this._debugLog?.(t, "shutdown: pendingResponses.clear failed");
      }
    } catch (t) {
      this._debugLog?.(t, "shutdown: iterate pending responses");
    }
    try {
      for (const t of this.workers) try {
        t.worker.terminate();
      } catch (n) {
        this._debugLog?.(n, "shutdown: terminate worker");
      }
    } catch (t) {
      this._debugLog?.(t, "shutdown: terminate workers loop");
    }
    try {
      this._underlyingToWorkerObj && this._underlyingToWorkerObj.clear();
    } catch (t) {
      this._debugLog?.(t, "shutdown: underlyingToWorkerObj.clear failed");
    }
    const e = this.workers.map((t) => t?.id).filter((t) => t != null);
    e?.length && this._bus.emit("pool:scale", {
      action: "remove",
      terminated: e,
      count: e.length
    }), this.workers = [], this.queue = new ki(), this._queueHighCrossed = !1, this._activeTasks = 0, this._updateIdleState();
  }
  _encodeForTransfer(e) {
    try {
      const t = JSON.stringify(e);
      if (typeof t == "string" && t.length > 2048) return oa(e);
      const n = this._encodeCache.get(t);
      if (n) {
        try {
          this._encodeCache.delete(t), this._encodeCache.set(t, n);
        } catch {
        }
        return n;
      }
      const r = oa(e, t), i = r?.byteLength || 0, a = () => this._encodeCache.size >= this._encodeCacheLimit || this._encodeCacheByteLimit !== 1 / 0 && this._encodeCacheBytes + i > this._encodeCacheByteLimit;
      for (; a(); ) {
        const o = [], s = this._encodeCache.keys(), l = 10;
        for (; a() && o.length < l; ) {
          const c = s.next();
          if (c.done) break;
          o.push(c.value);
        }
        if (!o.length) break;
        for (const c of o) {
          try {
            const f = this._encodeCache.get(c), d = typeof f?.byteLength == "number" ? f.byteLength : 0;
            this._encodeCacheBytes = Math.max(0, this._encodeCacheBytes - d);
          } catch {
          }
          this._encodeCache.delete(c);
        }
      }
      return this._encodeCache.set(t, r), r?.byteLength && (this._encodeCacheBytes += r.byteLength), r;
    } catch {
      return oa(e);
    }
  }
  prepareBuffers(e, t = {}) {
    if (!Array.isArray(e)) throw new Error("prepareBuffers expects an array");
    const { clone: n = !0, zeroCopy: r = !1 } = t, i = new Array(e.length);
    for (let a = 0; a < e.length; a++) {
      const o = e[a] && typeof e[a] == "object" && "message" in e[a] ? e[a] : { message: e[a] }, s = o.message, l = o.transfer;
      if (l) {
        i[a] = {
          message: s,
          transfer: l
        };
        continue;
      }
      if (s !== null && typeof s == "object" && !ArrayBuffer.isView(s) && !(s instanceof ArrayBuffer)) {
        if (r) {
          i[a] = {
            message: s,
            transfer: void 0
          };
          continue;
        }
        try {
          const c = this._encodeForTransfer(s), f = n ? c.slice() : c;
          i[a] = {
            message: f,
            transfer: n ? [f.buffer] : void 0
          };
          continue;
        } catch {
          i[a] = {
            message: s,
            transfer: void 0
          };
          continue;
        }
      }
      if (s instanceof ArrayBuffer || ArrayBuffer.isView(s)) {
        const c = s instanceof ArrayBuffer ? s : s.buffer;
        i[a] = {
          message: s,
          transfer: [c]
        };
        continue;
      }
      i[a] = {
        message: s,
        transfer: void 0
      };
    }
    return i;
  }
  _prepareForTransfer(e, t, n) {
    const r = !!n?.zeroCopy;
    if (e instanceof Uint8Array || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) {
      const i = e instanceof ArrayBuffer ? e : e.buffer;
      if (!t) {
        if (i?.byteLength === 0) try {
          const s = e instanceof ArrayBuffer ? e.slice(0) : new Uint8Array(e);
          return {
            message: s,
            transfer: [s.buffer]
          };
        } catch {
          return {
            message: e,
            transfer: void 0
          };
        }
        return {
          message: e,
          transfer: [i]
        };
      }
      if (Array.isArray(t)) return {
        message: e,
        transfer: t
      };
      if (t.length === 0) return {
        message: e,
        transfer: [i]
      };
      const a = [];
      let o = !1;
      for (const s of t)
        a.push(s), s === i && (o = !0);
      return o || a.push(i), {
        message: e,
        transfer: a
      };
    }
    if (e !== null && typeof e == "object" && !ArrayBuffer.isView(e) && !(e instanceof ArrayBuffer)) {
      if (r) return {
        message: e,
        transfer: t
      };
      try {
        const i = this._encodeForTransfer(e).slice();
        let a = t;
        if (!a || Array.isArray(a) && a.length === 0) a = [i.buffer];
        else if (Array.isArray(a)) {
          let o = !1;
          for (const s of a) if (s === i.buffer) {
            o = !0;
            break;
          }
          o || (a = [...a, i.buffer]);
        } else if (a.length === 0) a = [i.buffer];
        else {
          const o = [];
          let s = !1;
          for (const l of a)
            o.push(l), l === i.buffer && (s = !0);
          s || o.push(i.buffer), a = o;
        }
        return {
          message: i,
          transfer: a
        };
      } catch {
        return {
          message: e,
          transfer: t
        };
      }
    }
    return {
      message: e,
      transfer: t
    };
  }
  _decrementActiveTasks(e = 1) {
    try {
      const t = Number.isFinite(Number(e)) ? Math.max(0, Math.floor(Number(e))) : 1;
      this._activeTasks = Math.max(0, this._activeTasks - t);
    } catch {
      this._activeTasks = 0;
    }
  }
  resize(e) {
    let t = this.minSize, n = this.maxSize;
    if (e != null && typeof e == "object")
      Number.isFinite(e.minSize) && (t = Math.max(0, Math.floor(e.minSize))), Number.isFinite(e.maxSize) && (n = Math.max(t, Math.floor(e.maxSize)));
    else {
      const a = Number(e);
      if (!Number.isFinite(a)) return;
      n = Math.max(t, Math.floor(a));
    }
    this.minSize = Math.max(0, t), this.maxSize = Math.max(this.minSize, n);
    let r = 0;
    for (; this.workers.length < this.minSize && this.workers.length < this.maxSize; ) try {
      const a = this.workers.length;
      if (this._addWorkerInstance(), this.workers.length === a) break;
      r++;
    } catch (a) {
      try {
        this._logger.error(a, "resize: add worker failed");
      } catch (o) {
        this._debugLog?.(o, "resize: logger.error failed");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "resize",
          error: a
        });
      } catch (o) {
        this._debugLog?.(o, "resize: bus.emit failed");
      }
      break;
    }
    const i = [];
    for (; this.workers.length > this.maxSize; ) {
      const a = this.workers.pop();
      if (a) {
        this._decrementActiveTasks(a.tasks || 0);
        try {
          a.worker.terminate();
        } catch (o) {
          this._debugLog?.(o, "resize: worker.terminate failed");
        }
        this._deleteWorkerUnderlyingMapping(a), this._terminatedWorkerTaskCountsTotal += a.completedTasks || 0, this._terminatedWorkerTaskCountsCount += 1, i.push(a.id);
      }
    }
    if (i.length || r) {
      const a = { data: {
        type: "pool:resize",
        terminated: i,
        added: r
      } };
      if (this._onresize) try {
        this._onresize(a);
      } catch (o) {
        this._logger.error(o, "Pool onresize handler error");
      }
      this._bus.emit("resize", a), this._bus.emit("pool:scale", {
        added: r,
        terminated: i,
        minSize: this.minSize,
        maxSize: this.maxSize
      });
    }
    this._updateIdleState();
  }
  _createWorkerInstance() {
    return Nc.create(this._workerSource, this._workerOptions);
  }
  _deleteWorkerUnderlyingMapping(e) {
    try {
      const t = e?.worker?._underlying;
      t && this._underlyingToWorkerObj && this._underlyingToWorkerObj.delete(t);
    } catch (t) {
      this._debugLog?.(t, "_deleteWorkerUnderlyingMapping failed");
    }
  }
  _addWorkerInstance(e) {
    e == null && (e = this._nextWorkerId++);
    const t = this._createWorkerInstance(), n = new zc(t, this._logger, this), r = {
      id: e,
      worker: n,
      tasks: 0,
      lastActive: $e(),
      latencyEwma: null,
      _startTimes: new ki()
    };
    r.completedTasks = 0, this.workers.push(r), this._totalWorkersCreated++, this._bus.emit("pool:scale", {
      action: "add",
      id: r.id,
      minSize: this.minSize,
      maxSize: this.maxSize
    });
    try {
      this._underlyingToWorkerObj.set(t, r);
    } catch {
    }
    n.onmessage = (s) => {
      const l = $e();
      r.tasks = Math.max(0, r.tasks - 1), this._decrementActiveTasks(1), r.lastActive = l;
      try {
        const c = s?.data;
        if (c && typeof c == "object" && c.correlationId != null) {
          const f = String(c.correlationId), d = Object.prototype.hasOwnProperty.call(c, "response") ? c.response : c;
          this._cleanupPendingResponse(f, { resolveWith: d });
        }
      } catch (c) {
        this._debugLog?.(c, "worker.onmessage: resolve pending response");
      }
      try {
        const c = r._startTimes?.length ? r._startTimes.shift() : null;
        let f = null;
        try {
          const d = s?.data;
          if (typeof d?.duration == "number" && Number.isFinite(d.duration) ? f = Math.max(0, Number(d.duration)) : c != null && (f = Math.max(0, l - c)), f != null) {
            const u = this._autoScale?.alpha || 0.2;
            r.latencyEwma == null ? r.latencyEwma = f : r.latencyEwma = u * f + (1 - u) * r.latencyEwma, this._ewmaLatency == null ? this._ewmaLatency = f : this._ewmaLatency = u * f + (1 - u) * this._ewmaLatency, this._totalTasksCompleted = (this._totalTasksCompleted || 0) + 1, r.completedTasks = (r.completedTasks || 0) + 1;
            const p = 1, m = this._taskDurationsWelfordCount;
            this._taskDurationsWelfordCount = m + p;
            const g = f - this._taskDurationsWelfordMean;
            this._taskDurationsWelfordMean += g * p / this._taskDurationsWelfordCount;
            const y = f - this._taskDurationsWelfordMean;
            this._taskDurationsWelfordM2 += g * y, f < this._taskDurationsMin && (this._taskDurationsMin = f), f > this._taskDurationsMax && (this._taskDurationsMax = f), Number.isFinite(this._slowTaskThreshold) && f > this._slowTaskThreshold && (this._slowTaskCount = (this._slowTaskCount || 0) + 1);
          }
        } catch (d) {
          this._debugLog?.(d, "worker.onmessage: latency tracking inner");
        }
      } catch (c) {
        this._debugLog?.(c, "worker.onmessage: latency tracking outer");
      }
      if (!this._queuePaused && this.queue.length > 0 && r.tasks < this._maxTasksPerWorker) {
        const c = this.queue.shift();
        try {
          c.transfer ? n.postMessage(c.message, c.transfer) : n.postMessage(c.message), r._startTimes.push(l), r.tasks++, this._activeTasks++;
        } catch (f) {
          this._debugLog?.(f, "dispatch queued message to worker failed"), this._logger.error(f, "Failed to dispatch queued message to worker");
        }
        this._queueHighCrossed && this.queue.length <= this._queueHighThreshold && (this._queueHighCrossed = !1);
      }
      if (this._onmessage) try {
        this._onmessage(s);
      } catch (c) {
        this._logger.error(c, "Pool onmessage handler error");
      }
      this._bus.emit("message", s), this._updateIdleState();
    };
    const i = (s) => {
      let l = s?.data !== void 0 ? s.data : s, c = l;
      if (l && (l instanceof ArrayBuffer || ArrayBuffer.isView(l))) try {
        c = Lc(l);
      } catch (d) {
        try {
          o(d);
        } catch (u) {
          this._debugLog?.(u, "_handleMessage: _handleMessageError failed");
        }
        c = l;
      }
      const f = s?.data !== void 0 && c === l ? s : {
        data: c,
        originalEvent: s
      };
      if (typeof n.onmessage == "function") try {
        n.onmessage(f);
      } catch (d) {
        this._logger.error(d, "worker wrapper onmessage error");
      }
    }, a = (s) => {
      if (typeof n.onerror == "function") try {
        n.onerror(s);
      } catch (l) {
        this._logger.error(l, "worker wrapper onerror error");
      }
      this._bus.emit("error", s);
    }, o = (s) => {
      if (typeof n.onmessageerror == "function") try {
        n.onmessageerror(s);
      } catch (l) {
        this._logger.error(l, "worker wrapper onmessageerror error");
      }
      this._bus.emit("messageerror", s);
    };
    if (typeof t.addEventListener == "function") {
      try {
        t.addEventListener("message", i);
      } catch (s) {
        this._debugLog?.(s, "attach addEventListener message");
      }
      try {
        t.addEventListener("error", a);
      } catch (s) {
        this._debugLog?.(s, "attach addEventListener error");
      }
      try {
        t.addEventListener("messageerror", o);
      } catch (s) {
        this._debugLog?.(s, "attach addEventListener messageerror");
      }
    } else if (typeof t.on == "function") {
      try {
        t.on("message", i);
      } catch (s) {
        this._debugLog?.(s, "attach underlying.on message");
      }
      try {
        t.on("error", a);
      } catch (s) {
        this._debugLog?.(s, "attach underlying.on error");
      }
      try {
        t.on("messageerror", o);
      } catch (s) {
        this._debugLog?.(s, "attach underlying.on messageerror");
      }
    } else {
      try {
        t.onmessage = i;
      } catch (s) {
        this._debugLog?.(s, "assign underlying.onmessage");
      }
      try {
        t.onerror = a;
      } catch (s) {
        this._debugLog?.(s, "assign underlying.onerror");
      }
      try {
        t.onmessageerror = o;
      } catch (s) {
        this._debugLog?.(s, "assign underlying.onmessageerror");
      }
    }
    return r;
  }
  _findLeastLoadedWorker() {
    if (!this.workers.length) return null;
    let e = null, t = 1 / 0, n = Number.POSITIVE_INFINITY;
    for (let r = 0; r < this.workers.length; r++) {
      const i = this.workers[r], a = i.latencyEwma != null ? i.latencyEwma : Number.POSITIVE_INFINITY;
      (i.tasks < t || i.tasks === t && a < n) && (e = i, t = i.tasks, n = a);
    }
    return e;
  }
  postMessage(e, t, n) {
    n = n || void 0;
    const r = $e(), i = n?.workerId != null ? n.workerId : null, a = i == null && this.workers.length === 1 && this._maxTasksPerWorker === 1 / 0, o = i != null ? this.workers.find((u) => u.id === i) : a ? this.workers[0] : this._findLeastLoadedWorker(), s = !!(n?.awaitResponse || n?.correlationId != null);
    let l, c;
    if (s) {
      if (l = n.correlationId != null ? String(n.correlationId) : this._generateCorrelationId(), !(e !== null && typeof e == "object" && !ArrayBuffer.isView(e) && !(e instanceof ArrayBuffer))) throw new Error("postMessage awaitResponse requires a plain-object message");
      e = Object.assign({}, e, { correlationId: l });
      const u = this._createPendingResponsePromise(l, n);
      c = u.pendingPromise, l = u.correlationKey;
    }
    if (o?.tasks < this._maxTasksPerWorker) try {
      const u = r, p = this._prepareForTransfer(e, t, n);
      return this._postToWorkerObj(o, p, u, s, l, c);
    } catch (u) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: u });
        } catch (p) {
          this._debugLog?.(p, "postMessage: cleanupPendingResponse failed");
        }
        try {
          this._logger.error(u, "Failed to postMessage to worker");
        } catch (p) {
          this._debugLog?.(p, "postMessage: logger.error failed");
        }
        return c;
      }
      try {
        this._logger.error(u, "Failed to postMessage to worker");
      } catch (p) {
        this._debugLog?.(p, "postMessage: logger.error failed");
      }
      return !1;
    }
    if (i != null && (!o || o.tasks >= this._maxTasksPerWorker)) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: /* @__PURE__ */ new Error("targeted worker unavailable") });
        } catch (u) {
          this._debugLog?.(u, "postMessage: cleanupPendingResponse failed");
        }
        return c;
      }
      return !1;
    }
    if (i == null && this.workers.length < this.maxSize) {
      const u = r;
      return this._tryGrowPool(e, t, n, u, s, l, c);
    }
    if (this.taskQueueEnabled) {
      const u = this._prepareForTransfer(e, t, n);
      return this._enqueueOrReject(u, s, l, c);
    }
    if (!this.workers.length) return s ? c : !1;
    const f = this._nextIndex % this.workers.length;
    this._nextIndex = (this._nextIndex + 1) % this.workers.length;
    const d = this.workers[f];
    try {
      const u = r, p = this._prepareForTransfer(e, t, n);
      return this._postToWorkerObj(d, p, u, s, l, c);
    } catch (u) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: u });
        } catch (p) {
          this._debugLog?.(p, "postMessage: cleanupPendingResponse failed");
        }
        try {
          this._logger.error(u, "Failed to postMessage to fallback worker");
        } catch (p) {
          this._debugLog?.(p, "postMessage: logger.error failed");
        }
        return c;
      }
      try {
        this._logger.error(u, "Failed to postMessage to fallback worker");
      } catch (p) {
        this._debugLog?.(p, "postMessage: logger.error failed");
      }
      return !1;
    }
  }
  _generateCorrelationId() {
    try {
      const t = typeof globalThis < "u" ? globalThis.crypto : void 0;
      if (typeof t?.randomUUID == "function") return `${t.randomUUID()}-${this._correlationCounter++}`;
    } catch {
    }
    try {
      const t = typeof globalThis < "u" ? globalThis.crypto : void 0;
      if (typeof t?.getRandomValues == "function") {
        const n = /* @__PURE__ */ new Uint8Array(16);
        return t.getRandomValues(n), `${Array.from(n).map((i) => i.toString(16).padStart(2, "0")).join("")}-${this._correlationCounter++}`;
      }
    } catch {
    }
    const e = Math.floor(Math.random() * 4294967295).toString(16);
    return `cid-${Math.floor($e()).toString(36)}-${e}-${this._correlationCounter++}`;
  }
  _cleanupPendingResponse(e, t = {}) {
    const n = e != null ? String(e) : e, r = this._pendingResponses.get(n);
    if (!r) return !1;
    try {
      if (r.timer) try {
        clearTimeout(r.timer);
      } catch (i) {
        this._debugLog?.(i, "_cleanupPendingResponse: clearTimeout failed");
      }
    } catch (i) {
      this._debugLog?.(i, "_cleanupPendingResponse: timer check failed");
    }
    try {
      Object.prototype.hasOwnProperty.call(t, "resolveWith") ? r.resolve(t.resolveWith) : Object.prototype.hasOwnProperty.call(t, "rejectWith") && r.reject(t.rejectWith);
    } catch (i) {
      this._debugLog?.(i, "_cleanupPendingResponse: resolve/reject failed");
    } finally {
      try {
        this._pendingResponses.delete(n);
      } catch (i) {
        this._debugLog?.(i, "_cleanupPendingResponse: delete failed");
      }
    }
    return !0;
  }
  broadcast(e, t) {
    const n = $e();
    let r = null;
    const i = e !== null && typeof e == "object" && !ArrayBuffer.isView(e) && !(e instanceof ArrayBuffer);
    for (const a of this.workers) try {
      let o = e, s = t;
      if (!s && i) try {
        r == null && (r = this._encodeForTransfer(e));
        const l = r.slice();
        o = l, s = [l.buffer];
      } catch {
        o = e, s = void 0;
      }
      s?.length ? a.worker.postMessage(o, s) : a.worker.postMessage(o), typeof a._startTimes?.push == "function" && a._startTimes.push(n), a.tasks++, this._activeTasks++, a.lastActive = n;
    } catch (o) {
      this._logger.error(o, "broadcast error");
    }
    this._updateIdleState();
  }
  _normalizeStopThePressOptions(e) {
    const t = typeof e?.recreateWorkers < "u" ? !!e.recreateWorkers : !0, n = typeof e == "object" ? Object.assign({}, e) : void 0;
    return n && delete n.recreateWorkers, {
      recreate: t,
      fwdOptions: n
    };
  }
  _resetPoolForStopThePress({ recreate: e, scope: t }) {
    try {
      typeof this.queue?.clear == "function" && this.queue.clear();
    } catch (a) {
      this._logger.error(a, `${t}: failed to clear queue`);
    }
    try {
      this._queueHighCrossed = !1;
    } catch (a) {
      this._debugLog?.(a, "_resetPoolForStopThePress: queueHighCrossed reset failed");
    }
    try {
      for (const [a] of this._pendingResponses) try {
        this._cleanupPendingResponse(a, { rejectWith: /* @__PURE__ */ new Error(`${t}: cancelled pending response`) });
      } catch (o) {
        this._debugLog?.(o, "_resetPoolForStopThePress: cleanupPendingResponse failed");
      }
    } catch (a) {
      this._logger.error(a, `${t}: failed to cancel pending responses`);
    }
    let n = 0, r = [];
    try {
      const a = this.workers;
      if (n = Number(a?.length) || 0, Array.isArray(a)) r = a.slice();
      else {
        r = new Array(n);
        for (let o = 0; o < n; o++) r[o] = a[o];
      }
    } catch (a) {
      this._logger.error(a, `${t}: failed to snapshot workers`), n = 0, r = [];
    }
    const i = r.map((a) => a?.id).filter((a) => a != null);
    try {
      for (let a = r.length - 1; a >= 0; a--) {
        const o = r[a];
        this._terminatedWorkerTaskCountsTotal += o.completedTasks || 0, this._terminatedWorkerTaskCountsCount += 1;
        try {
          o.worker.terminate();
        } catch (s) {
          this._debugLog?.(s, "_resetPoolForStopThePress: worker.terminate failed");
        }
        this._deleteWorkerUnderlyingMapping(o);
      }
      this.workers.length = 0, this._activeTasks = 0;
    } catch (a) {
      this._logger.error(a, `${t}: failed while terminating workers`);
    }
    if (e || this._clearLifecycleIntervals(), e) {
      const a = Math.max(this.minSize, Math.min(n, this.maxSize));
      for (let o = 0; o < a; o++) try {
        const s = this.workers.length;
        if (this._addWorkerInstance(), this.workers.length === s) break;
      } catch (s) {
        try {
          this._logger.error(s, "recreate: add worker failed");
        } catch (l) {
          this._debugLog?.(l, "recreate: logger.error failed");
        }
        try {
          this._bus.emit("pool:error", {
            phase: "recreate",
            error: s
          });
        } catch (l) {
          this._debugLog?.(l, "recreate: bus.emit failed");
        }
        break;
      }
      try {
        this._ensureReaper();
      } catch (o) {
        this._debugLog?.(o, "recreate: ensureReaper failed");
      }
    }
    return this._updateIdleState(), {
      currentCount: n,
      terminatedIds: i
    };
  }
  stopThePress(e, t, n) {
    const { recreate: r, fwdOptions: i } = this._normalizeStopThePressOptions(n), { currentCount: a, terminatedIds: o } = this._resetPoolForStopThePress({
      recreate: r,
      scope: "stopThePress"
    });
    try {
      o?.length && this._bus.emit("pool:scale", {
        action: "remove",
        terminated: o,
        count: a
      });
    } catch (s) {
      this._logger.error(s, "pool scale stopThePress listener error");
    }
    return this.postMessage(e, t, i);
  }
  postMessageBatch(e, t) {
    if (!Array.isArray(e)) throw new Error("postMessageBatch expects an array of {message, transfer?}");
    const n = !!(t?.awaitResponse || t?.correlationId != null), r = typeof t?.correlationIdFactory == "function" ? t.correlationIdFactory : null;
    if (n) {
      if (t?.correlationId != null && e.length > 1 && !r) throw new Error("postMessageBatch cannot use a fixed correlationId for multiple items; provide options.correlationIdFactory or omit correlationId");
      const d = new Array(e.length);
      for (let u = 0; u < e.length; u++) {
        const p = e[u] || {}, m = Object.assign({}, t);
        r && (m.correlationId = String(r(u, p))), d[u] = this.postMessage(p.message, p.transfer, m);
      }
      return d;
    }
    const i = new Array(e.length), a = [], o = t?.workerId != null ? t.workerId : null, s = this.prepareBuffers(e, {
      clone: !0,
      zeroCopy: !!t?.zeroCopy
    });
    if (o == null && this.workers.length === 1 && this._maxTasksPerWorker === 1 / 0) {
      const d = this.workers[0];
      let u = !1;
      for (let p = 0; p < e.length; p++) {
        const m = s[p] || {
          message: e[p]?.message,
          transfer: e[p]?.transfer
        };
        try {
          const g = $e();
          m.transfer?.length ? d.worker.postMessage(m.message, m.transfer) : d.worker.postMessage(m.message), typeof d._startTimes?.push == "function" && d._startTimes.push(g), d.tasks++, this._activeTasks++, d.lastActive = g, u = !0, i[p] = !0;
        } catch {
          i[p] = !1;
        }
      }
      return u && this._updateIdleState(), i;
    }
    const l = o != null;
    let c = null;
    if (l) {
      if (c = this.workers.find((d) => d.id === o), !c) return e.map(() => !1);
    } else c = this._findLeastLoadedWorker();
    let f = !1;
    for (let d = 0; d < e.length; d++) {
      const u = e[d] || {}, p = s[d] || {
        message: u.message,
        transfer: u.transfer
      };
      let m = !1;
      c?.tasks >= this._maxTasksPerWorker && (c = null);
      let g = c;
      if (!g && !l && (g = this._findLeastLoadedWorker()), g?.tasks < this._maxTasksPerWorker) try {
        const y = $e();
        p.transfer?.length ? g.worker.postMessage(p.message, p.transfer) : g.worker.postMessage(p.message), typeof g._startTimes?.push == "function" && g._startTimes.push(y), g.tasks++, this._activeTasks++, g.lastActive = y, f = !0, i[d] = !0, m = !0, c = g.tasks < this._maxTasksPerWorker ? g : null;
      } catch {
        i[d] = !1, m = !0;
      }
      if (!m && o == null && this.workers.length < this.maxSize)
        try {
          const y = this._addWorkerInstance();
          if (!y)
            i[d] = !1, m = !0;
          else {
            const h = $e();
            p.transfer?.length ? y.worker.postMessage(p.message, p.transfer) : y.worker.postMessage(p.message), typeof y._startTimes?.push == "function" && y._startTimes.push(h), y.tasks++, this._activeTasks++, y.lastActive = h, f = !0, i[d] = !0, m = !0, c = y.tasks < this._maxTasksPerWorker ? y : null;
          }
        } catch (y) {
          try {
            this._logger.error(y, "postMessageBatch: add worker failed");
          } catch {
          }
          try {
            this._bus.emit("pool:error", {
              phase: "postMessageBatch",
              error: y
            });
          } catch {
          }
          i[d] = !1, m = !0;
        }
      if (!m) {
        if (o != null) {
          i[d] = !1;
          continue;
        }
        if (this.taskQueueEnabled) {
          const y = this._queuePolicy;
          if (y === "reject" || y === "drop-newest" && this.queue.length > 0) i[d] = !1;
          else {
            if (y === "drop-oldest" && this.queue.length > 0) {
              const h = this.queue.shift();
              h?.correlationId != null && this._cleanupPendingResponse(h.correlationId, { rejectWith: /* @__PURE__ */ new Error("postMessage queued task dropped by policy") });
            }
            a.push({
              message: p.message,
              transfer: p.transfer
            }), i[d] = !0;
          }
        } else if (!this.workers.length) i[d] = !1;
        else {
          const y = this._nextIndex % this.workers.length;
          this._nextIndex = (this._nextIndex + 1) % this.workers.length;
          const h = this.workers[y];
          try {
            const b = $e();
            p.transfer?.length ? h.worker.postMessage(p.message, p.transfer) : h.worker.postMessage(p.message), typeof h._startTimes?.push == "function" && h._startTimes.push(b), h.tasks++, this._activeTasks++, h.lastActive = b, f = !0, i[d] = !0;
          } catch (b) {
            i[d] = !1, this._logger.error(b, "Failed to postMessage to fallback worker");
          }
        }
      }
    }
    if (a.length) try {
      this.queue.pushMany(a), f = !0;
      try {
        Number.isFinite(this._queueHighThreshold) && this.queue.length > this._queueHighThreshold && !this._queueHighCrossed && (this._queueHighCrossed = !0, this._bus.emit("pool:queue:high", {
          length: this.queue.length,
          threshold: this._queueHighThreshold
        }));
      } catch (d) {
        this._debugLog?.(d, "postMessageBatch: bus.emit pool:queue:high failed");
      }
    } catch (d) {
      this._logger.error(d, "postMessageBatch: failed to enqueue prepared items");
    }
    return f && this._updateIdleState(), i;
  }
  stopThePressBatch(e, t) {
    const { recreate: n, fwdOptions: r } = this._normalizeStopThePressOptions(t);
    this._resetPoolForStopThePress({
      recreate: n,
      scope: "stopThePressBatch"
    });
    try {
      return this.postMessageBatch(e, r);
    } catch (i) {
      try {
        this._logger.error(i, "stopThePressBatch: postMessageBatch failed");
      } catch (a) {
        this._debugLog?.(a, "stopThePressBatch: logger.error failed");
      }
      try {
        return new Array(e ? e.length : 0).fill(!1);
      } catch {
        return [];
      }
    }
  }
  addWorker() {
    try {
      return this._addWorkerInstance();
    } catch (e) {
      try {
        this._logger.error(e, "addWorker: failed");
      } catch (t) {
        this._debugLog?.(t, "addWorker: logger.error failed");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "addWorker",
          error: e
        });
      } catch (t) {
        this._debugLog?.(t, "addWorker: bus.emit failed");
      }
      return null;
    }
  }
  removeWorker() {
    const e = this.workers.pop();
    if (e) {
      this._decrementActiveTasks(e.tasks || 0);
      try {
        e.worker.terminate();
      } catch (t) {
        this._debugLog?.(t, "removeWorker: worker.terminate failed");
      }
      this._deleteWorkerUnderlyingMapping(e), this._terminatedWorkerTaskCountsTotal += e.completedTasks || 0, this._terminatedWorkerTaskCountsCount += 1;
    }
  }
  _reapIdleWorkers() {
    if (this.idleTimeout <= 0) return;
    const e = $e();
    for (let t = this.workers.length - 1; t >= 0; t--) {
      const n = this.workers[t];
      if (this.workers.length <= this.minSize) break;
      if (n.tasks === 0 && e - (n.lastActive || 0) > this.idleTimeout) {
        try {
          n.worker.terminate();
        } catch (i) {
          this._debugLog?.(i, "_reapIdleWorkers: worker.terminate failed");
        }
        try {
          const i = n.worker?._underlying;
          i && this._underlyingToWorkerObj && this._underlyingToWorkerObj.delete(i);
        } catch (i) {
          this._debugLog?.(i, "_reapIdleWorkers: underlyingToWorkerObj.delete failed");
        }
        const r = this.workers.length - 1;
        t === r ? this.workers.pop() : this.workers[t] = this.workers.pop();
      }
    }
    this._updateIdleState();
  }
  _autoScaleTick() {
    try {
      if (!this._autoScale || !this._autoScale.enabled) return;
      const e = $e(), t = this._autoScale;
      this._lastAutoScaleAt && t.backoffResetMs && e - this._lastAutoScaleAt > t.backoffResetMs && (this._autoScaleBackoffMultiplier = 1);
      const n = Math.floor((t.cooldownMs || 0) * (this._autoScaleBackoffMultiplier || 1));
      if (this._lastAutoScaleAt && e - this._lastAutoScaleAt < n) return;
      const r = t.targetMs, i = t.hysteresis || 0.2, a = this._ewmaLatency, o = this.workers.length, s = r * (1 + i), l = a != null ? a > s : !1, c = this.queue.length > Math.ceil(o * (1 + i));
      if (l || c) {
        if (o < this.maxSize) try {
          const d = Math.min(this.maxSize - o, t.stepUp || 1);
          for (let u = 0; u < d; u++) try {
            const p = this.workers.length;
            if (this._addWorkerInstance(), this.workers.length === p) break;
          } catch (p) {
            this._debugLog?.(p, "autoScale: addWorker failed");
            try {
              this._bus.emit("pool:error", {
                phase: "autoScale:add",
                error: p
              });
            } catch (m) {
              this._debugLog?.(m, "autoScale: bus.emit failed");
            }
            break;
          }
          this._lastAutoScaleAt = e, this._autoScaleBackoffMultiplier = Math.min((this._autoScaleBackoffMultiplier || 1) * (t.backoffFactor || 1), t.backoffMaxMultiplier || 8);
        } catch (d) {
          this._debugLog?.(d, "autoScale: addWorker failed outer");
        }
        return;
      }
      const f = r * Math.max(0, 1 - i);
      if (a != null && a < f && this.queue.length === 0 && o > this.minSize)
        try {
          const d = Math.min(o - this.minSize, t.stepDown || 1);
          let u = 0;
          for (let p = this.workers.length - 1; p >= 0 && u < d; p--) {
            const m = this.workers[p];
            if (!m || m.tasks > 0) continue;
            try {
              m.worker.terminate();
            } catch (y) {
              this._debugLog?.(y, "autoScale: terminate worker");
            }
            this._deleteWorkerUnderlyingMapping(m), this._terminatedWorkerTaskCountsTotal += m.completedTasks || 0, this._terminatedWorkerTaskCountsCount += 1;
            const g = this.workers.length - 1;
            p === g ? this.workers.pop() : this.workers[p] = this.workers.pop(), u++;
          }
          u > 0 && (this._lastAutoScaleAt = e, this._autoScaleBackoffMultiplier = Math.min((this._autoScaleBackoffMultiplier || 1) * (t.backoffFactor || 1), t.backoffMaxMultiplier || 8));
        } catch (d) {
          this._debugLog?.(d, "autoScale: remove worker failed");
        }
    } catch (e) {
      this._debugLog?.(e, "autoScaleTick outer");
    }
  }
  _buildIdleEvent() {
    const e = this;
    let t, n = !1;
    return { data: {
      type: "pool:idle",
      get stats() {
        return n || (t = e.getStats(), n = !0), t;
      }
    } };
  }
  _emitIdle() {
    const e = this._buildIdleEvent();
    if (this._isIdle = !0, this._onmessage) try {
      this._onmessage(e);
    } catch (t) {
      this._logger.error(t, "Pool onmessage handler error");
    }
    if (this._onidle) try {
      this._onidle(e);
    } catch (t) {
      this._logger.error(t, "Pool onidle handler error");
    }
    try {
      this._bus.emit("message", e);
    } catch (t) {
      this._logger.error(t, "pool listener error");
    }
    try {
      this._bus.emit("idle", e);
    } catch (t) {
      this._logger.error(t, "pool idle listener error");
    }
  }
  _updateIdleState() {
    const e = this.queue.length === 0, t = this._activeTasks === 0 && e;
    t && !this._isIdle ? this._emitIdle() : !t && this._isIdle && (this._isIdle = !1);
  }
  terminate() {
    try {
      this.shutdown();
    } catch {
    }
  }
  [Symbol.dispose]() {
    this.shutdown();
  }
  async [Symbol.asyncDispose]() {
    try {
      await this.drain();
    } catch {
    }
    this.terminate();
  }
  getStats() {
    const e = this.workers.map((y) => ({
      id: y.id,
      tasks: y.tasks,
      lastActive: y.lastActive
    })), t = $e(), n = this._createdAt != null ? Math.max(0, t - this._createdAt) : 0, r = this._totalWorkersCreated || this.workers.length, i = this._totalTasksCompleted || 0, a = this._terminatedWorkerTaskCountsCount || 0, o = this._terminatedWorkerTaskCountsTotal || 0;
    let s = 0;
    for (const y of this.workers) s += y.completedTasks || 0;
    const l = a + (this.workers.length || 0), c = l > 0 ? (o + s) / l : 0;
    let f = 0, d = 0, u = 0, p = 0, m = 0;
    const g = this._taskDurationsWelfordCount || 0;
    if (g > 0) {
      f = this._taskDurationsMin === Number.POSITIVE_INFINITY ? 0 : this._taskDurationsMin, d = this._taskDurationsMax === Number.NEGATIVE_INFINITY ? 0 : this._taskDurationsMax, u = this._taskDurationsWelfordMean;
      const y = g > 1 ? this._taskDurationsWelfordM2 / g : 0;
      p = Math.sqrt(y), m = g > 0 ? (this._slowTaskCount || 0) / g * 100 : 0;
    }
    return {
      status: e,
      performance: {
        poolLiveDuration: n,
        totalWorkersCreated: r,
        totalTasksPerformed: i,
        averageTasksPerWorkerUntilTermination: c,
        timePerTask: {
          max: d,
          min: f,
          average: u,
          stddev: p
        },
        percentSlowTasks: m
      },
      queueLength: this.queue.length,
      activeTasks: this._activeTasks,
      workerCount: this.workers.length,
      minSize: this.minSize,
      maxSize: this.maxSize,
      isIdle: this._activeTasks === 0 && this.queue.length === 0
    };
  }
  drain() {
    const e = this.queue.length === 0;
    return this._activeTasks === 0 && e ? Promise.resolve(this.getStats()) : new Promise((t) => {
      const n = () => {
        try {
          this.removeEventListener("idle", n);
        } catch (r) {
          this._debugLog?.(r, "drain: removeEventListener failed");
        }
        t(this.getStats());
      };
      this.addEventListener("idle", n);
    });
  }
  addEventListener(e, t) {
    if (typeof t == "function" && (this._bus.on(e, t), e === "idle")) {
      const n = this.queue.length === 0;
      if (this._activeTasks === 0 && n) {
        const r = this._buildIdleEvent();
        try {
          t(r);
        } catch (i) {
          this._logger.error(i, "pool idle listener error");
        }
      }
    }
  }
  removeEventListener(e, t) {
    !t || typeof t != "function" || this._bus.off(e, t);
  }
  get onresize() {
    return this._onresize;
  }
  set onresize(e) {
    this._onresize = e;
  }
  get onmessage() {
    return this._onmessage;
  }
  set onmessage(e) {
    this._onmessage = e;
  }
  get onerror() {
    return this._onerror;
  }
  set onerror(e) {
    this._onerror = e;
  }
  get onidle() {
    return this._onidle;
  }
  set onidle(e) {
    if (this._onidle = e, typeof e == "function") {
      const t = this.queue.length === 0;
      if (this._activeTasks === 0 && t) {
        const n = this._buildIdleEvent();
        try {
          e(n);
        } catch (r) {
          this._logger.error(r, "Pool onidle handler error");
        }
      }
    }
  }
  pauseQueue() {
    this._queuePaused = !0;
  }
  resumeQueue() {
    this._queuePaused && (this._queuePaused = !1, this._dispatchQueuedTasks());
  }
  pause() {
    return this.pauseQueue();
  }
  resume() {
    return this.resumeQueue();
  }
  get queuePaused() {
    return this._queuePaused;
  }
  _dispatchQueuedTasks() {
    if (this._queuePaused || !this.taskQueueEnabled || this.queue.length === 0) return;
    const e = this.queue, t = this._maxTasksPerWorker, n = $e();
    let r = !1;
    for (const i of this.workers) {
      let a = t - i.tasks;
      for (; a > 0 && e.length > 0; ) {
        const o = e.shift();
        try {
          o.transfer?.length ? i.worker.postMessage(o.message, o.transfer) : i.worker.postMessage(o.message), typeof i._startTimes?.push == "function" && i._startTimes.push(n), i.tasks++, a--, this._activeTasks++, i.lastActive = n, r = !0;
        } catch (s) {
          this._debugLog?.(s, "dispatch queued message to worker failed"), this._logger.error(s, "Failed to dispatch queued message to worker");
          break;
        }
      }
    }
    this._queueHighCrossed && this.queue.length <= this._queueHighThreshold && (this._queueHighCrossed = !1), r && this._updateIdleState();
  }
}, Dc = class {
  constructor(e = {}) {
    const { capacity: t = 1, queueCapacity: n = 1 / 0, initialTokens: r } = e || {};
    this._capacity = Math.max(1, Math.floor(Number(t) || 1)), this._queueCapacity = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 1 / 0, this._available = Number.isFinite(r) ? Math.min(this._capacity, Math.max(0, Math.floor(Number(r)))) : this._capacity, this._waiters = new ki(16);
  }
  get capacity() {
    return this._capacity;
  }
  get available() {
    return this._available;
  }
  get pending() {
    return this._waiters.length;
  }
  get queueCapacity() {
    return this._queueCapacity;
  }
  get isFull() {
    return this._waiters.length >= this._queueCapacity;
  }
  get active() {
    return this._capacity - this._available;
  }
  acquire() {
    return this._available > 0 ? Promise.resolve(this._grant()) : this.isFull ? Promise.reject(/* @__PURE__ */ new Error("PowerPermitGate queue is full")) : new Promise((e, t) => {
      this._waiters.push({
        resolve: e,
        reject: t
      });
    });
  }
  tryAcquire() {
    return this._available > 0 ? this._grant() : null;
  }
  release(e = 1) {
    let t = Math.max(0, Math.floor(Number(e) || 1));
    for (; t > 0 && this._waiters.length > 0; ) {
      const n = this._waiters.shift();
      typeof n?.resolve == "function" && (n.resolve(this._makeRelease()), t -= 1);
    }
    t > 0 && (this._available = Math.min(this._capacity, this._available + t));
  }
  reset(e = {}) {
    const { available: t = this._capacity, reason: n = /* @__PURE__ */ new Error("PowerPermitGate reset") } = e;
    for (this._available = Math.min(this._capacity, Math.max(0, Math.floor(Number(t) || 0))); this._waiters.length > 0; ) {
      const r = this._waiters.shift();
      typeof r?.reject == "function" && r.reject(n);
    }
  }
  _makeRelease() {
    let e = !1;
    return () => {
      e || (e = !0, this.release(1));
    };
  }
  _grant() {
    return this._available -= 1, this._makeRelease();
  }
}, zo = class {
  constructor(e = 1) {
    this._gate = new Dc({
      capacity: e,
      initialTokens: e
    });
  }
  get limit() {
    return this._gate.capacity;
  }
  get active() {
    return this._gate.active;
  }
  get pending() {
    return this._gate.pending;
  }
  get available() {
    return this._gate.available;
  }
  get isLocked() {
    return this._gate.available === 0;
  }
  acquire() {
    return this._gate.acquire();
  }
  tryAcquire() {
    return this._gate.tryAcquire();
  }
  async run(e) {
    const t = await this.acquire();
    try {
      return await e();
    } finally {
      t();
    }
  }
  reset() {
    this._gate.reset({ available: this._gate.capacity });
  }
};
function Bc() {
  return typeof requestIdleCallback == "function" ? new Promise((e) => {
    try {
      requestIdleCallback(e, { timeout: 50 });
    } catch {
      setTimeout(e, 0);
    }
  }) : new Promise((e) => setTimeout(e, 0));
}
async function wn(e, t = 50) {
  try {
    if (!e || !t) return;
    e % t === 0 && await Bc();
  } catch {
  }
}
var Uc = /* @__PURE__ */ Fi({
  CRAWL_MAX_QUEUE: () => Xo,
  HOME_SLUG: () => Qt,
  _setAllMd: () => Ho,
  _setSearchIndex: () => Pr,
  _storeSlugMapping: () => wt,
  addSlugResolver: () => Gc,
  allMarkdownPaths: () => ut,
  allMarkdownPathsSet: () => Ye,
  availableLanguages: () => dt,
  awaitSearchIndex: () => Ra,
  buildSearchIndex: () => Un,
  buildSearchIndexWorker: () => Aa,
  clearFetchCache: () => Kc,
  clearListCaches: () => Zc,
  crawlAllMarkdown: () => el,
  crawlCache: () => vi,
  crawlForSlug: () => Jo,
  crawlForSlugWorker: () => Hc,
  defaultCrawlMaxQueue: () => Qr,
  ensureSlug: () => tl,
  fetchCache: () => zt,
  fetchMarkdown: () => Qe,
  getFetchConcurrency: () => Ir,
  getLanguages: () => Ya,
  getSearchIndex: () => iu,
  homePage: () => vt,
  initSlugWorker: () => Gi,
  isExternalLink: () => Qc,
  isExternalLinkWithBase: () => Yr,
  listPathsFetched: () => Oi,
  listSlugCache: () => Nr,
  mdToSlug: () => _e,
  negativeFetchCache: () => An,
  notFoundPage: () => xe,
  removeSlugResolver: () => Vc,
  resolveSlugPath: () => nr,
  searchIndex: () => se,
  setContentBase: () => Qa,
  setDefaultCrawlMaxQueue: () => Yo,
  setFetchCacheMaxSize: () => Jc,
  setFetchCacheTTL: () => eu,
  setFetchConcurrency: () => Zo,
  setFetchMarkdown: () => nu,
  setFetchNegativeCacheTTL: () => Vo,
  setHomePage: () => qo,
  setLanguages: () => Bo,
  setNegativeFetchCacheMaxSize: () => tu,
  setNotFoundPage: () => Fo,
  setSkipRootReadme: () => Do,
  skipRootReadme: () => Xa,
  slugResolvers: () => Vi,
  slugToMd: () => ee,
  slugify: () => we,
  storeSlugMapping: () => ht,
  teardownSlugWorkerPool: () => Fc,
  unescapeMarkdown: () => Si,
  uniqueSlug: () => vn,
  watchForColdHashRoute: () => xi,
  whenSearchIndexReady: () => Sn
}), Ps = 0, Ii = /* @__PURE__ */ new Map();
function xi(e) {
  try {
    if (!e) return;
    let t = Qt, n = "";
    if (e.type === "cosmetic") {
      const i = e.page != null && String(e.page).trim() !== "";
      t = i ? String(e.page) : Qt, n = "#/" + (i ? String(e.page) : ""), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
    } else if (e.type === "path") {
      const i = e.page != null && String(e.page).trim() !== "";
      t = i ? String(e.page) : Qt, n = "/" + (i ? String(e.page) : ""), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
    } else if (e.type === "canonical")
      if (e.page)
        t = e.page, n = "?page=" + encodeURIComponent(e.page), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
      else {
        t = Qt;
        try {
          n = typeof location < "u" && location?.pathname ? String(location.pathname) : "/", typeof location < "u" && location?.search && (n += String(location.search)), typeof location < "u" && location?.hash && (n += String(location.hash));
        } catch {
          n = "/";
        }
      }
    else return;
    const r = Ii.get(t) || [];
    r.push(n), Ii.set(t, r);
  } catch {
  }
}
function $o(e, t) {
  try {
    const n = String(e ?? ""), r = Ii.get(n);
    if (!r || !r.length) return;
    try {
      const i = typeof globalThis < "u" ? globalThis : null;
      if (i) {
        try {
          i.__nimbiColdRouteResolved || (i.__nimbiColdRouteResolved = []);
        } catch {
        }
        for (const a of r) try {
          const o = {
            slug: n,
            token: a,
            rel: String(t ?? "")
          };
          try {
            i.__nimbiColdRouteResolved.push(o);
          } catch {
          }
          try {
            i?.dispatchEvent?.(new CustomEvent("nimbi.coldRouteResolved", { detail: o }));
          } catch {
          }
          try {
            i?.__nimbiUI?.renderByQuery?.().catch(() => {
            });
          } catch {
          }
        } catch {
        }
      }
    } catch {
    }
    Ii.delete(n);
  } catch {
  }
}
try {
  ee.set = function(e, t) {
    const n = Map.prototype.has.call(this, e), r = Map.prototype.set.call(this, e, t);
    try {
      n || $o(e, typeof t == "string" ? t : t?.default ?? Object.values(t?.langs ?? {})[0] ?? "");
    } catch {
    }
    return r;
  };
} catch {
}
var dt = [], Xa = !1;
function Do(e) {
  Xa = !!e;
}
function Bo(e) {
  dt = Array.isArray(e) ? e.slice() : [];
}
function Ya() {
  return dt;
}
async function Uo(e, t, n = 4, r) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new zo(Math.max(1, Number(n) || 1));
  return Promise.all(e.map((a, o) => i.run(() => t(a, o), { signal: r })));
}
var Hi = Lo(), jc = {
  intervalMs: 750,
  targetMs: 120,
  hysteresis: 0.3,
  cooldownMs: 1e3,
  stepUp: 1,
  stepDown: 1
}, Mr = null;
function Wc() {
  const e = {
    size: Hi,
    minSize: 2,
    autoScale: jc,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    e.debugLevel = 0;
  } catch {
  }
  try {
    return new Za(Ec, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("slug worker unavailable");
      }
    };
  }
}
function jo() {
  return Mr || (Mr = Wc()), Mr;
}
function Fc() {
  const e = Mr;
  if (Mr = null, !!e)
    try {
      typeof e.drain == "function" && e.drain().catch(() => {
      }), typeof e.terminate == "function" && e.terminate(), typeof e.dispose == "function" && e.dispose();
    } catch (t) {
      x("[slugManager] teardownSlugWorkerPool failed", t);
    }
}
function qc() {
  try {
    return vo();
  } catch {
    return !1;
  }
}
function Gi() {
  return jo().workers?.[0]?.worker?._underlying ?? null;
}
function Wo(e) {
  return Gi?.() ? jo().postMessage(e, void 0, {
    awaitResponse: !0,
    timeout: 5e3
  }).then((t) => {
    if (t?.error) throw new Error(t.error);
    return t;
  }).catch((t) => {
    throw (t?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : t;
  }) : Promise.reject(/* @__PURE__ */ new Error("slug worker required but unavailable"));
}
async function Aa(e, t = 1, n = void 0, r = void 0) {
  if (!Gi?.()) throw new Error("slug worker required but unavailable");
  return await Wo({
    type: "buildSearchIndex",
    contentBase: e,
    indexDepth: t,
    noIndexing: n,
    seedPaths: r
  });
}
async function Hc(e, t, n) {
  if (!Gi?.()) throw new Error("slug worker required but unavailable");
  return Wo({
    type: "crawlForSlug",
    slug: e,
    base: t,
    maxQueue: n
  });
}
function wt(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = te(typeof t == "string" ? t : String(t ?? ""));
  } catch {
    n = String(t ?? "");
  }
  if (n) {
    try {
      if (dt?.length) {
        const r = String(n).split("/")[0], i = Array.isArray(dt) ? dt.length > 8 ? (dt._set ||= new Set(dt)).has(r) : dt.includes(r) : !1;
        let a = ee.get(e);
        if (!a || typeof a == "string") a = {
          default: typeof a == "string" ? te(a) : void 0,
          langs: {}
        };
        else try {
          a.default && (a.default = te(a.default));
        } catch {
        }
        i ? a.langs[r] = n : a.default = n, ee.set(e, a);
      } else {
        const r = ee.has(e) ? ee.get(e) : void 0;
        if (!r) ee.set(e, n);
        else {
          let i = null;
          try {
            typeof r == "string" ? i = te(r) : r && typeof r == "object" && (i = r.default ? te(r.default) : null);
          } catch {
            i = null;
          }
          if (i === n) ee.set(e, n);
          else {
            let a = null, o = 2;
            for (; a = `${e}-${o}`, !!ee.has(a); ) {
              let s = ee.get(a), l = null;
              try {
                typeof s == "string" ? l = te(s) : s && typeof s == "object" && (l = s.default ? te(s.default) : null);
              } catch {
                l = null;
              }
              if (l === n) {
                e = a;
                break;
              }
              if (o += 1, o > 1e4) break;
            }
            try {
              if (!ee.has(a))
                ee.set(a, n), e = a;
              else if (ee.get(a) === n) e = a;
              else {
                const s = /* @__PURE__ */ new Set();
                for (const c of ee.keys()) s.add(c);
                const l = typeof vn == "function" ? vn(e, s) : `${e}-2`;
                ee.set(l, n), e = l;
              }
            } catch (s) {
              x("[slugManager] slug collision resolution failed", s);
            }
          }
        }
      }
    } catch {
    }
    try {
      if (n) {
        try {
          _e.set(n, e);
        } catch {
        }
        Ye && !Ye.has(n) && (Ye.add(n), Array.isArray(ut) && ut.push(n));
      }
    } catch {
    }
  }
}
function ht(e, t) {
  return wt(e, t);
}
var Vi = /* @__PURE__ */ new Set();
function Gc(e) {
  typeof e == "function" && Vi.add(e);
}
function Vc(e) {
  typeof e == "function" && Vi.delete(e);
}
var Ea = {}, xe = "_404.md", vt = null, Qt = "_home";
function Fo(e) {
  if (e == null) {
    xe = null;
    return;
  }
  xe = String(e ?? "");
}
function qo(e) {
  if (e == null) {
    vt = null;
    return;
  }
  vt = String(e ?? "");
  try {
    try {
      $o(Qt, vt);
    } catch {
    }
  } catch {
  }
}
function Ho(e) {
  Ea = e || {};
}
function Pr(e) {
  try {
    if (Array.isArray(se) || (se = []), !Array.isArray(e)) return;
    try {
      se.length = 0;
      for (const t of e) se.push(t);
      try {
        if (typeof window < "u") try {
          window.__nimbiLiveSearchIndex = se;
        } catch {
        }
      } catch {
      }
    } catch (t) {
      de("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        se = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
var Nr = /* @__PURE__ */ new Map(), Oi = /* @__PURE__ */ new Set();
function Zc() {
  Nr.clear(), Oi.clear();
}
function Xc(e) {
  if (!e || e.length === 0) return "";
  let t = e[0];
  for (let r = 1; r < e.length; r++) {
    const i = e[r];
    let a = 0;
    const o = Math.min(t.length, i.length);
    for (; a < o && t[a] === i[a]; ) a++;
    t = t.slice(0, a);
  }
  const n = t.lastIndexOf("/");
  return n === -1 ? t : t.slice(0, n + 1);
}
var Yc = new ir(function(e) {
  let n = String(e ?? "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, {
  keyResolver: (e) => e === void 0 ? "__undefined" : String(e),
  cacheOptions: { maxEntries: 2e3 }
}), we = (e) => Yc.run(e);
function Qa(e) {
  ee.clear(), _e.clear(), Sc([]);
  try {
    Ye.clear();
  } catch {
  }
  dt = dt || [];
  const t = !!dt?.length, n = /* @__PURE__ */ new Set(), r = Object.keys(Ea || {});
  if (!r.length) return;
  let i = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? i = new URL(String(e)).pathname : i = String(e ?? "");
      } catch (a) {
        i = String(e ?? ""), de("[slugManager] parse contentBase failed", a);
      }
      i = Tn(i);
    }
  } catch (a) {
    i = "", de("[slugManager] setContentBase prefix derivation failed", a);
  }
  i || (i = Xc(r));
  for (const a of r) {
    let o = a;
    i && a.startsWith(i) ? o = te(a.slice(i.length)) : o = te(a), ut.push(o);
    try {
      Ye.add(o);
    } catch {
    }
    const s = Ea[a];
    if (typeof s == "string") {
      const l = (s || "").match(/^#\s+(.+)$/m);
      if (l && l[1]) {
        const c = we(l[1].trim());
        if (c) try {
          let f = c;
          if (t || (f = vn(f, n)), t) {
            const d = o.split("/")[0], u = Array.isArray(dt) ? dt.length > 8 ? (dt._set ||= new Set(dt)).has(d) : dt.includes(d) : !1;
            let p = ee.get(f);
            (!p || typeof p == "string") && (p = {
              default: typeof p == "string" ? p : void 0,
              langs: {}
            }), u ? p.langs[d] = o : p.default = o, ee.set(f, p);
          } else
            ee.set(f, o), n.add(f);
          _e.set(o, f);
        } catch (f) {
          de("[slugManager] set slug mapping failed", f);
        }
      }
    }
  }
  try {
    Jn();
  } catch (a) {
    de("[slugManager] refreshIndexPaths failed", a);
  }
}
try {
  Qa();
} catch (e) {
  de("[slugManager] initial setContentBase failed", e);
}
function vn(e, t) {
  if (!t.has(e)) return e;
  let n = 2, r = `${e}-${n}`;
  for (; t.has(r); )
    n += 1, r = `${e}-${n}`;
  return r;
}
function Qc(e) {
  return Yr(e, void 0);
}
function Yr(e, t) {
  if (!e) return !1;
  if (e.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(e)) {
    if (t && typeof t == "string") try {
      const n = new URL(e), r = new URL(t);
      return n.origin !== r.origin ? !0 : !n.pathname.startsWith(r.pathname);
    } catch {
      return !0;
    }
    return !0;
  }
  if (e.startsWith("/") && t && typeof t == "string") try {
    const n = new URL(e, t), r = new URL(t);
    return n.origin !== r.origin ? !0 : !n.pathname.startsWith(r.pathname);
  } catch {
    return !0;
  }
  return !1;
}
function Si(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function nr(e) {
  if (!e || !ee.has(e)) return null;
  const t = ee.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (dt?.length && $t && t.langs && t.langs[$t])
    return t.langs[$t];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
var zt = new Zr({ maxEntries: 2e3 });
function Kc() {
  zt.clear(), An.clear();
}
var An = new Zr({ maxEntries: 2e3 }), Go = 6e4;
function Vo(e) {
  Go = Number(e) || 0;
}
function Jc(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    zt && typeof zt.maxEntries < "u" && (zt.maxEntries = t);
  } catch {
  }
}
function eu(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    zt && typeof zt.defaultTTL < "u" && (zt.defaultTTL = t);
  } catch {
  }
}
function tu(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    An && typeof An.maxEntries < "u" && (An.maxEntries = t);
  } catch {
  }
}
var Ta = Math.max(1, Math.min(Hi, 5));
function Zo(e) {
  try {
    Ta = Math.max(1, Number(e) || 1);
  } catch {
    Ta = 1;
  }
}
function Ir() {
  return Ta;
}
var Qe = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1)) try {
      const f = mt(e);
      f?.page && (e = f.page);
    } catch {
    }
  } catch {
  }
  try {
    const f = (String(e ?? "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1], d = typeof e == "string" && String(e).indexOf("/") === -1;
    if (f && d && ee.has(f)) {
      const u = nr(f) || ee.get(f);
      u && u !== e && (e = u);
    }
  } catch (f) {
    de("[slugManager] slug mapping normalization failed", f);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const f = String(e).split("::", 1)[0];
      if (f) try {
        if (ee.has(f)) {
          const d = nr(f) || ee.get(f);
          d ? e = d : e = f;
        } else e = f;
      } catch {
        e = f;
      }
    }
  } catch (f) {
    de("[slugManager] path sanitize failed", f);
  }
  try {
    if (t) try {
      let f = (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? new URL(String(t)) : new URL(String(t), typeof location < "u" ? location.origin : "http://localhost")).pathname || "";
      if (f = f.replace(/^\/+|\/+$/g, ""), f) try {
        const d = String(e ?? "");
        if (!/^[a-z][a-z0-9+.-]*:/i.test(d)) {
          let u = d.replace(/^\/+/, "");
          u === f ? e = "" : u.startsWith(f + "/") ? e = u.slice(f.length + 1) : e = u;
        }
      } catch {
      }
    } catch {
    }
  } catch {
  }
  if (!(n?.force === !0 || typeof xe == "string" && xe || ee?.size || Ye?.size || vo())) throw new Error("failed to fetch md");
  const r = t == null ? "" : jn(String(t));
  let i = "";
  try {
    const f = typeof location < "u" && location?.origin ? location.origin : "http://localhost";
    let d = f.replace(/\/$/, "") + "/";
    r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? d = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? d = f.replace(/\/$/, "") + r.replace(/\/$/, "") + "/" : d = f.replace(/\/$/, "") + "/" + r.replace(/\/$/, "") + "/");
    try {
      i = new URL(e.replace(/^\//, ""), d).toString();
    } catch {
      i = f.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
    }
  } catch {
    i = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  const a = n?.signal, o = async (f) => {
    const d = n && typeof n.timeoutMs == "number" ? Math.max(0, Number(n.timeoutMs) || 0) : 1e4;
    try {
      if (typeof Cr == "function") {
        const p = new Cr({ timeout: d });
        let m = p.signal;
        try {
          if (a && typeof AbortSignal < "u" && typeof AbortSignal.any == "function" && p.signal instanceof AbortSignal) m = AbortSignal.any([a, p.signal]);
          else if (a && typeof AbortSignal < "u") {
            const g = new AbortController();
            try {
              a.addEventListener("abort", () => g.abort(), { once: !0 });
            } catch {
            }
            try {
              p.signal.addEventListener("abort", () => g.abort(), { once: !0 });
            } catch {
            }
            try {
              (a?.aborted || p.signal?.aborted) && g.abort();
            } catch {
            }
            m = g.signal;
          }
        } catch {
        }
        try {
          return await p.run(async () => {
            const y = async () => {
              if (m?.aborted) {
                const b = /* @__PURE__ */ new Error("aborted");
                throw b.name = "AbortError", b;
              }
              return await fetch(f, m ? {
                signal: m,
                referrerPolicy: "no-referrer"
              } : { referrerPolicy: "no-referrer" });
            };
            if (typeof va == "function") try {
              const b = new va({
                attempts: 3,
                factor: 2,
                minDelay: 50
              });
              if (typeof b.run == "function") return await b.run(async () => {
                const _ = await y();
                if (_ && typeof _.status == "number" && _.status >= 500) {
                  const w = /* @__PURE__ */ new Error("server error");
                  throw w.status = _.status, w;
                }
                return _;
              });
            } catch {
            }
            let h;
            for (let b = 0; b < 3; b++) {
              if (m?.aborted) {
                const _ = /* @__PURE__ */ new Error("aborted");
                throw _.name = "AbortError", _;
              }
              try {
                const _ = await y();
                if (_ && typeof _.status == "number" && _.status >= 500) {
                  if (h = /* @__PURE__ */ new Error("server error"), h.status = _.status, b < 2) {
                    const w = Math.pow(2, b) * 50;
                    await new Promise((A) => setTimeout(A, w));
                    continue;
                  }
                  throw h;
                }
                return _;
              } catch (_) {
                if (_ && _.name === "AbortError") throw _;
                if (h = _, b < 2) {
                  const w = Math.pow(2, b) * 50;
                  await new Promise((A) => setTimeout(A, w));
                  continue;
                }
                throw h;
              }
            }
          });
        } catch {
        }
      }
    } catch {
    }
    let u = a || null;
    try {
      !u && typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" ? u = AbortSignal.timeout(d) : u && typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" && typeof AbortSignal.any == "function" && (u = AbortSignal.any([u, AbortSignal.timeout(d)]));
    } catch {
    }
    return await fetch(f, u ? { signal: u } : void 0);
  };
  try {
    const f = An.get(i);
    if (f && f > Date.now()) return Promise.reject(/* @__PURE__ */ new Error("failed to fetch md"));
    f && An.delete(i);
  } catch {
  }
  if (zt.has(i)) return zt.get(i);
  const s = (async () => {
    let f;
    try {
      f = await o(i);
    } catch (g) {
      try {
        Lr("fetchMarkdown failed:", () => ({
          url: i,
          status: "fetch-error",
          error: g && g.message ? g.message : String(g)
        }));
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    if (!f || typeof f.ok != "boolean" || !f.ok) {
      if (f && f.status === 404 && typeof xe == "string" && xe)
        try {
          const y = `${r}/${xe}`, h = await o(y);
          if (h && typeof h.ok == "boolean" && h.ok) return {
            raw: await h.text(),
            status: 404
          };
        } catch (y) {
          de("[slugManager] fetching fallback 404 failed", y);
        }
      let g = "";
      try {
        f && typeof f.clone == "function" ? g = await f.clone().text() : f && typeof f.text == "function" ? g = await f.text() : g = "";
      } catch (y) {
        g = "", de("[slugManager] reading error body failed", y);
      }
      try {
        const y = f ? f.status : void 0;
        if (y === 404) try {
          x("fetchMarkdown failed (404):", () => ({
            url: i,
            status: y,
            statusText: f ? f.statusText : void 0,
            body: g.slice(0, 200)
          }));
        } catch {
        }
        else try {
          Lr("fetchMarkdown failed:", () => ({
            url: i,
            status: y,
            statusText: f ? f.statusText : void 0,
            body: g.slice(0, 200)
          }));
        } catch {
        }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const d = await f.text(), u = d.trim().slice(0, 128).toLowerCase(), p = /^(?:<!doctype|<html|<title|<h1)/.test(u), m = p || String(e ?? "").toLowerCase().endsWith(".html");
    if (p && String(e ?? "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof xe == "string" && xe) {
          const g = `${r}/${xe}`, y = await o(g);
          if (y.ok) return {
            raw: await y.text(),
            status: 404
          };
        }
      } catch (g) {
        de("[slugManager] fetching fallback 404 failed", g);
      }
      throw qc() && Lr("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return m ? {
      raw: d,
      isHtml: !0
    } : { raw: d };
  })();
  zt.set(i, s);
  let l = null, c = s;
  try {
    if (a && typeof a == "object") {
      const f = new Promise((d, u) => {
        try {
          if (a.aborted) {
            const p = /* @__PURE__ */ new Error("aborted");
            return p.name = "AbortError", u(p);
          }
        } catch {
        }
        l = () => {
          const p = /* @__PURE__ */ new Error("aborted");
          p.name = "AbortError";
          try {
            a.removeEventListener && a.removeEventListener("abort", l);
          } catch {
          }
          u(p);
        };
        try {
          a.addEventListener && a.addEventListener("abort", l);
        } catch {
        }
      });
      c = Promise.race([s, f]);
    }
  } catch {
  }
  return c.finally(() => {
    try {
      l && a && typeof a.removeEventListener == "function" && a.removeEventListener("abort", l);
    } catch {
    }
  }).catch((f) => {
    if (f && (f.name === "AbortError" || f.code === "EABORT" || f.code === "EDEADLINE")) {
      try {
        zt.delete(i);
      } catch {
      }
      throw f;
    }
    try {
      An.set(i, Date.now() + Go);
    } catch {
    }
    try {
      zt.delete(i);
    } catch {
    }
    throw f;
  });
};
function nu(e) {
  typeof e == "function" && (Qe = e);
}
var vi = /* @__PURE__ */ new Map();
function ru(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
var se = [];
function iu() {
  return se;
}
try {
  if (typeof window < "u") try {
    Object.defineProperty(window, "__nimbiSearchIndex", {
      get() {
        return se;
      },
      enumerable: !0,
      configurable: !0
    });
  } catch {
    try {
      window.__nimbiSearchIndex = se;
    } catch {
    }
  }
} catch {
}
try {
  if (typeof window < "u") try {
    Object.defineProperty(window, "__nimbiIndexReady", {
      get() {
        return Ra;
      },
      enumerable: !0,
      configurable: !0
    });
  } catch {
    try {
      window.__nimbiIndexReady = Ra;
    } catch {
    }
  }
} catch {
}
var kn = null;
async function Un(e, t = 1, n = void 0, r = void 0) {
  const i = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => te(String(a ?? ""))))) : [];
  try {
    const a = te(String(xe ?? ""));
    a && !i.includes(a) && i.push(a);
  } catch {
  }
  if (se && se.length && t === 1 && !se.some((a) => {
    try {
      return i.includes(te(String(a.path ?? "")));
    } catch {
      return !1;
    }
  }))
    return se;
  if (kn) return kn;
  kn = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((h) => te(String(h ?? ""))))) : [], o = new Set(a);
    try {
      const h = te(String(xe ?? ""));
      h && !o.has(h) && (o.add(h), a.push(h));
    } catch {
    }
    const s = (h) => {
      if (!o || o.size === 0) return !1;
      for (const b of o)
        if (b && (h === b || h.startsWith(b + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(r) && r.length) for (const h of r) try {
        const b = te(String(h ?? ""));
        b && l.push(b);
      } catch {
      }
    } catch {
    }
    if (Array.isArray(ut) && ut.length) {
      const h = new Set(l);
      for (const b of ut) h.has(b) || (l.push(b), h.add(b));
    }
    if (!l.length) {
      if (_e && typeof _e.size == "number" && _e.size) try {
        l = Array.from(_e.keys());
      } catch {
        l = [];
      }
      else for (const h of ee.values())
        if (h) {
          if (typeof h == "string") l.push(h);
          else if (h && typeof h == "object") {
            h.default && l.push(h.default);
            const b = h.langs || {};
            for (const _ of Object.keys(b || {})) try {
              b[_] && l.push(b[_]);
            } catch {
            }
          }
        }
    }
    try {
      const h = await el(e);
      h && h.length && (l = l.concat(h));
    } catch (h) {
      de("[slugManager] crawlAllMarkdown during buildSearchIndex failed", h);
    }
    try {
      const h = new Set(l), b = [...l], _ = Math.max(1, Math.min(Ir(), b.length || Ir()));
      let w = 0;
      const A = async () => {
        for (; !(h.size > Qr); ) {
          const j = b.shift();
          if (!j) break;
          try {
            const W = await Qe(j, e);
            if (W && W.raw) {
              if (W.status === 404) continue;
              let Q = W.raw;
              const ae = [], ue = String(j ?? "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(ue) && Xa && (!j || !j.includes("/")))
                continue;
              const ne = ru(Q), C = /\[[^\]]+\]\(([^)]+)\)/g;
              let N;
              for (; N = C.exec(ne); ) ae.push(N[1]);
              const L = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; N = L.exec(ne); ) ae.push(N[1]);
              const E = j && j.includes("/") ? j.substring(0, j.lastIndexOf("/") + 1) : "";
              for (let I of ae) try {
                if (Yr(I, e) || I.startsWith("..") || I.indexOf("/../") !== -1 || (E && !I.startsWith("./") && !I.startsWith("/") && !I.startsWith("../") && (I = E + I), I = te(I), !I || I.startsWith("#") || I.startsWith("?"))) continue;
                if (!/\.(md|html?)(?:$|[?#])/i.test(I)) {
                  const Z = I.split(/[?#]/)[0].replace(/\/+$/, ""), $ = String(Z).split("/").pop() || "";
                  if (/\.[^./]+$/i.test($)) continue;
                  const re = [
                    `${Z}.md`,
                    `${Z}.html`,
                    `${Z}/README.md`,
                    `${Z}/README.html`
                  ];
                  for (const oe of re)
                    !oe || s(oe) || h.has(oe) || (h.add(oe), b.push(oe), l.push(oe));
                  continue;
                }
                if (I = I.split(/[?#]/)[0], s(I)) continue;
                h.has(I) || (h.add(I), b.push(I), l.push(I));
              } catch (Z) {
                de("[slugManager] href processing failed", I, Z);
              }
            }
          } catch (W) {
            de("[slugManager] discovery fetch failed for", j, W);
          }
          try {
            w++, await wn(w, 32);
          } catch {
          }
        }
      }, z = [];
      for (let j = 0; j < _; j++) z.push(A());
      await Promise.all(z);
    } catch (h) {
      de("[slugManager] discovery loop failed", h);
    }
    const c = /* @__PURE__ */ new Set();
    l = l.filter((h) => !h || c.has(h) || s(h) ? !1 : (c.add(h), !0));
    const f = [], d = /* @__PURE__ */ new Map(), u = l.filter((h) => /\.(?:md|html?)(?:$|[?#])/i.test(h)), p = Math.max(1, Math.min(Ir(), u.length || 1)), m = u.slice(), g = [];
    for (let h = 0; h < p; h++) g.push((async () => {
      for (; m.length; ) {
        const b = m.shift();
        if (!b) break;
        try {
          const _ = await Qe(b, e);
          d.set(b, _);
        } catch (_) {
          de("[slugManager] buildSearchIndex: entry fetch failed", b, _), d.set(b, null);
        }
      }
    })());
    await Promise.all(g);
    let y = 0;
    for (const h of l) {
      try {
        y++, await wn(y, 16);
      } catch {
      }
      if (/\.(?:md|html?)(?:$|[?#])/i.test(h))
        try {
          const b = d.get(h);
          if (!b || !b.raw || b.status === 404) continue;
          let _ = "", w = "", A = null, z = null;
          if (b.isHtml) try {
            const W = it(), Q = W ? W.parseFromString(b.raw, "text/html") : null, ae = Q ? Q.querySelector("title") || Q.querySelector("h1") : null;
            ae && ae.textContent && (_ = ae.textContent.trim());
            const ue = Q ? Q.querySelector("p") : null;
            if (ue && ue.textContent && (w = ue.textContent.trim()), t >= 2) try {
              const ne = Q ? Q.querySelector("h1") : null, C = ne && ne.textContent ? ne.textContent.trim() : _ || "";
              try {
                const L = _e?.has?.(h) ? _e?.get?.(h) : null;
                if (L) A = L;
                else {
                  let E = we(_ || h);
                  const I = /* @__PURE__ */ new Set();
                  try {
                    for (const $ of ee.keys()) I.add($);
                  } catch {
                  }
                  try {
                    for (const $ of f) $ && $.slug && I.add(String($.slug).split("::")[0]);
                  } catch {
                  }
                  let Z = !1;
                  try {
                    if (ee.has(E)) {
                      const $ = ee.get(E);
                      if (typeof $ == "string")
                        $ === h && (Z = !0);
                      else if ($ && typeof $ == "object") {
                        $.default === h && (Z = !0);
                        for (const re of Object.keys($.langs || {})) if ($.langs[re] === h) {
                          Z = !0;
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                  !Z && I.has(E) && (E = vn(E, I)), A = E;
                  try {
                    _e?.has?.(h) || wt(A, h);
                  } catch {
                  }
                }
              } catch (L) {
                de("[slugManager] derive pageSlug failed", L);
              }
              const N = Array.from(Q.querySelectorAll("h2"));
              for (const L of N) try {
                const E = (L.textContent || "").trim();
                if (!E) continue;
                const I = L.id ? L.id : we(E), Z = A ? `${A}::${I}` : `${we(h)}::${I}`;
                let $ = "", re = L.nextElementSibling;
                for (; re && re.tagName && re.tagName.toLowerCase() === "script"; ) re = re.nextElementSibling;
                re && re.textContent && ($ = String(re.textContent).trim()), f.push({
                  slug: Z,
                  title: E,
                  excerpt: $,
                  path: h,
                  parentTitle: C
                });
              } catch (E) {
                de("[slugManager] indexing H2 failed", E);
              }
              if (t === 3) try {
                const L = Array.from(Q.querySelectorAll("h3"));
                for (const E of L) try {
                  const I = (E.textContent || "").trim();
                  if (!I) continue;
                  const Z = E.id ? E.id : we(I), $ = A ? `${A}::${Z}` : `${we(h)}::${Z}`;
                  let re = "", oe = E.nextElementSibling;
                  for (; oe && oe.tagName && oe.tagName.toLowerCase() === "script"; ) oe = oe.nextElementSibling;
                  oe && oe.textContent && (re = String(oe.textContent).trim()), f.push({
                    slug: $,
                    title: I,
                    excerpt: re,
                    path: h,
                    parentTitle: C
                  });
                } catch (I) {
                  de("[slugManager] indexing H3 failed", I);
                }
              } catch (L) {
                de("[slugManager] collect H3s failed", L);
              }
            } catch (ne) {
              de("[slugManager] collect H2s failed", ne);
            }
          } catch (W) {
            de("[slugManager] parsing HTML for index failed", W);
          }
          else {
            const W = b.raw, Q = W.match(/^#\s+(.+)$/m);
            _ = Q ? Q[1].trim() : "";
            try {
              _ = Si(_);
            } catch {
            }
            const ae = W.split(/\r?\n\s*\r?\n/);
            if (ae.length > 1) for (let ue = 1; ue < ae.length; ue++) {
              const ne = ae[ue].trim();
              if (ne && !/^#/.test(ne)) {
                w = ne.replace(/\r?\n/g, " ");
                break;
              }
            }
            try {
              const { data: ue } = er(W), ne = ue.image || ue.og_image || ue.cover || ue.featured_image;
              ne && String(ne).trim() && (z = String(ne).trim());
            } catch {
            }
            if (t >= 2) {
              let ue = "";
              try {
                const ne = (W.match(/^#\s+(.+)$/m) || [])[1];
                ue = ne ? ne.trim() : "";
                try {
                  const L = _e?.has?.(h) ? _e?.get?.(h) : null;
                  if (L) A = L;
                  else {
                    let E = we(_ || h);
                    const I = /* @__PURE__ */ new Set();
                    try {
                      for (const $ of ee.keys()) I.add($);
                    } catch {
                    }
                    try {
                      for (const $ of f) $ && $.slug && I.add(String($.slug).split("::")[0]);
                    } catch {
                    }
                    let Z = !1;
                    try {
                      if (ee.has(E)) {
                        const $ = ee.get(E);
                        if (typeof $ == "string")
                          $ === h && (Z = !0);
                        else if ($ && typeof $ == "object") {
                          $.default === h && (Z = !0);
                          for (const re of Object.keys($.langs || {})) if ($.langs[re] === h) {
                            Z = !0;
                            break;
                          }
                        }
                      }
                    } catch {
                    }
                    !Z && I.has(E) && (E = vn(E, I)), A = E;
                    try {
                      _e?.has?.(h) || wt(A, h);
                    } catch {
                    }
                  }
                } catch (L) {
                  de("[slugManager] derive pageSlug failed", L);
                }
                const C = /^##\s+(.+)$/gm;
                let N;
                for (; N = C.exec(W); ) try {
                  const L = (N[1] || "").trim(), E = Si(L);
                  if (!L) continue;
                  const I = we(L), Z = A ? `${A}::${I}` : `${we(h)}::${I}`, $ = W.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), re = $ && $[1] ? String($[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                  f.push({
                    slug: Z,
                    title: E,
                    excerpt: re,
                    path: h,
                    parentTitle: ue
                  });
                } catch (L) {
                  de("[slugManager] indexing markdown H2 failed", L);
                }
              } catch (ne) {
                de("[slugManager] collect markdown H2s failed", ne);
              }
              if (t === 3) try {
                const ne = /^###\s+(.+)$/gm;
                let C;
                for (; C = ne.exec(W); ) try {
                  const N = (C[1] || "").trim(), L = Si(N);
                  if (!N) continue;
                  const E = we(N), I = A ? `${A}::${E}` : `${we(h)}::${E}`, Z = W.slice(ne.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), $ = Z && Z[1] ? String(Z[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                  f.push({
                    slug: I,
                    title: L,
                    excerpt: $,
                    path: h,
                    parentTitle: ue
                  });
                } catch (N) {
                  de("[slugManager] indexing markdown H3 failed", N);
                }
              } catch (ne) {
                de("[slugManager] collect markdown H3s failed", ne);
              }
            }
          }
          let j = "";
          try {
            _e?.has?.(h) && (j = _e?.get?.(h));
          } catch (W) {
            de("[slugManager] mdToSlug access failed", W);
          }
          if (!j) {
            try {
              if (!A) {
                const W = _e?.has?.(h) ? _e?.get?.(h) : null;
                if (W) A = W;
                else {
                  let Q = we(_ || h);
                  const ae = /* @__PURE__ */ new Set();
                  try {
                    for (const ne of ee.keys()) ae.add(ne);
                  } catch {
                  }
                  try {
                    for (const ne of f) ne && ne.slug && ae.add(String(ne.slug).split("::")[0]);
                  } catch {
                  }
                  let ue = !1;
                  try {
                    if (ee.has(Q)) {
                      const ne = ee.get(Q);
                      if (typeof ne == "string")
                        ne === h && (ue = !0);
                      else if (ne && typeof ne == "object") {
                        ne.default === h && (ue = !0);
                        for (const C of Object.keys(ne.langs || {})) if (ne.langs[C] === h) {
                          ue = !0;
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                  !ue && ae.has(Q) && (Q = vn(Q, ae)), A = Q;
                  try {
                    _e?.has?.(h) || wt(A, h);
                  } catch {
                  }
                }
              }
            } catch (W) {
              de("[slugManager] derive pageSlug failed", W);
            }
            j = A || we(_ || h);
          }
          f.push({
            slug: j,
            title: _,
            excerpt: w,
            path: h,
            image: z
          });
        } catch (b) {
          de("[slugManager] buildSearchIndex: entry processing failed", b);
        }
    }
    try {
      const h = f.filter((b) => {
        try {
          return !s(String(b.path ?? ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(se) || (se = []), se.length = 0;
        for (const b of h) se.push(b);
      } catch {
        try {
          se = Array.from(h);
        } catch {
          se = h;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = se;
          } catch {
          }
          try {
            const b = [], _ = /* @__PURE__ */ new Set();
            for (const w of se) try {
              if (!w || !w.slug) continue;
              const A = String(w.slug).split("::")[0];
              if (_.has(A)) continue;
              _.add(A);
              const z = { slug: A };
              w.title ? z.title = String(w.title) : w.parentTitle && (z.title = String(w.parentTitle)), w.path && (z.path = String(w.path)), b.push(z);
            } catch {
            }
            try {
              window.__nimbiSitemapJson = {
                generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
                entries: b
              };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = b;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (h) {
      de("[slugManager] filtering index by excludes failed", h);
      try {
        Array.isArray(se) || (se = []), se.length = 0;
        for (const b of f) se.push(b);
      } catch {
        try {
          se = Array.from(f);
        } catch {
          se = f;
        }
      }
      try {
        if (typeof window < "u") try {
          window.__nimbiResolvedIndex = se;
        } catch {
        }
      } catch {
      }
    }
    return se;
  })();
  try {
    await kn;
  } catch (a) {
    de("[slugManager] awaiting _indexPromise failed", a);
  }
  return kn = null, se;
}
async function Sn(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, r = typeof e.indexDepth == "number" ? e.indexDepth : 1, i = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, o = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(se) && se.length && !kn && !o) return se;
    if (kn) {
      try {
        await kn;
      } catch {
      }
      return se;
    }
    if (o) {
      try {
        if (typeof Aa == "function") try {
          const l = await Aa(n, r, i, a);
          if (Array.isArray(l) && l.length) {
            try {
              Pr(l);
            } catch {
            }
            return se;
          }
        } catch {
        }
      } catch {
      }
      try {
        return await Un(n, r, i, a), se;
      } catch {
      }
    }
    const s = Date.now();
    for (; Date.now() - s < t; ) {
      if (Array.isArray(se) && se.length) return se;
      await new Promise((l) => setTimeout(l, 150));
    }
    return se;
  } catch {
    return se;
  }
}
async function Ra(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Sn(t);
    } catch {
      return se;
    }
  } catch {
    return se;
  }
}
var Xo = 1e3, Qr = Xo;
function Yo(e) {
  typeof e == "number" && e >= 0 && (Qr = e);
}
var Qo = it(), Ko = "a[href]", Jo = async function(e, t, n = Qr) {
  if (vi.has(e)) return vi.get(e);
  let r = null;
  const i = /* @__PURE__ */ new Set(), a = [""], o = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = o + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? s = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? s = o + String(t).replace(/\/$/, "") + "/" : s = o + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    s = o + "/";
  }
  const l = Math.max(1, Math.min(Hi, 6));
  for (; a.length && !r && !(a.length > n); )
    await Uo(a.splice(0, l), async (c) => {
      if (c == null || i.has(c)) return;
      i.add(c);
      let f = "";
      try {
        f = new URL(c || "", s).toString();
      } catch {
        f = (String(t ?? "") || o) + "/" + String(c ?? "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(f);
        } catch (y) {
          de("[slugManager] crawlForSlug: fetch failed", {
            url: f,
            error: y
          });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && de("[slugManager] crawlForSlug: directory fetch non-ok", {
            url: f,
            status: d.status
          });
          return;
        }
        const u = await d.text(), p = Qo.parseFromString(u, "text/html");
        let m = [];
        try {
          p && typeof p.getElementsByTagName == "function" ? m = p.getElementsByTagName("a") : p && typeof p.querySelectorAll == "function" ? m = p.querySelectorAll(Ko) : m = [];
        } catch {
          try {
            m = p.getElementsByTagName ? p.getElementsByTagName("a") : [];
          } catch {
            m = [];
          }
        }
        const g = f;
        for (const y of m) try {
          if (r) break;
          let h = y.getAttribute("href") || "";
          if (!h || Yr(h, t) || h.startsWith("..") || h.indexOf("/../") !== -1) continue;
          if (h.endsWith("/")) {
            try {
              const b = new URL(h, g), _ = new URL(s).pathname, w = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), A = Tn(te(w));
              i.has(A) || a.push(A);
            } catch {
              const _ = te(c + h);
              i.has(_) || a.push(_);
            }
            continue;
          }
          if (h.toLowerCase().endsWith(".md")) {
            let b = "";
            try {
              const _ = new URL(h, g), w = new URL(s).pathname;
              b = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, "");
            } catch {
              b = (c + h).replace(/^\//, "");
            }
            b = te(b);
            try {
              if (_e?.has?.(b)) continue;
              for (const _ of ee.values()) ;
            } catch (_) {
              de("[slugManager] slug map access failed", _);
            }
            try {
              const _ = await Qe(b, t);
              if (_ && _.raw) {
                const w = (_.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && we(w[1].trim()) === e) {
                  r = b;
                  break;
                }
              }
            } catch (_) {
              de("[slugManager] crawlForSlug: fetchMarkdown failed", _);
            }
          }
        } catch (h) {
          de("[slugManager] crawlForSlug: link iteration failed", h);
        }
      } catch (d) {
        de("[slugManager] crawlForSlug: directory fetch failed", d);
      }
    }, l);
  return vi.set(e, r), r;
};
async function el(e, t = Qr) {
  const n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let o = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? o = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? o = a + String(e).replace(/\/$/, "") + "/" : o = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    o = a + "/";
  }
  const s = Math.max(1, Math.min(Hi, 6));
  for (; i.length && !(i.length > t); )
    await Uo(i.splice(0, s), async (l) => {
      if (l == null || r.has(l)) return;
      r.add(l);
      let c = "";
      try {
        c = new URL(l || "", o).toString();
      } catch {
        c = (String(e ?? "") || a) + "/" + String(l ?? "").replace(/^\//, "");
      }
      try {
        let f;
        try {
          f = await globalThis.fetch(c);
        } catch (g) {
          de("[slugManager] crawlAllMarkdown: fetch failed", {
            url: c,
            error: g
          });
          return;
        }
        if (!f || !f.ok) {
          f && !f.ok && de("[slugManager] crawlAllMarkdown: directory fetch non-ok", {
            url: c,
            status: f.status
          });
          return;
        }
        const d = await f.text(), u = Qo.parseFromString(d, "text/html");
        let p = [];
        try {
          u && typeof u.getElementsByTagName == "function" ? p = u.getElementsByTagName("a") : u && typeof u.querySelectorAll == "function" ? p = u.querySelectorAll(Ko) : p = [];
        } catch {
          try {
            p = u.getElementsByTagName ? u.getElementsByTagName("a") : [];
          } catch {
            p = [];
          }
        }
        const m = c;
        for (const g of p) try {
          let y = g.getAttribute("href") || "";
          if (!y || Yr(y, e) || y.startsWith("..") || y.indexOf("/../") !== -1) continue;
          if (y.endsWith("/")) {
            try {
              const b = new URL(y, m), _ = new URL(o).pathname, w = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), A = Tn(te(w));
              r.has(A) || i.push(A);
            } catch {
              const _ = l + y;
              r.has(_) || i.push(_);
            }
            continue;
          }
          let h = "";
          try {
            const b = new URL(y, m), _ = new URL(o).pathname;
            h = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, "");
          } catch {
            h = (l + y).replace(/^\//, "");
          }
          if (h = te(h), /\.(md|html?)$/i.test(h)) n.add(h);
          else {
            const b = h.split(/[?#]/)[0].replace(/\/+$/, ""), _ = String(b).split("/").pop() || "";
            if (/\.[^./]+$/i.test(_)) continue;
            b && (n.add(`${b}.md`), n.add(`${b}.html`), n.add(`${b}/README.md`), n.add(`${b}/README.html`));
          }
        } catch (y) {
          de("[slugManager] crawlAllMarkdown: link iteration failed", y);
        }
      } catch (f) {
        de("[slugManager] crawlAllMarkdown: directory fetch failed", f);
      }
    }, s);
  return Array.from(n);
}
async function tl(e, t, n) {
  if (e && typeof e == "string" && (e = te(e), e = jn(e)), ee.has(e)) return nr(e) || ee.get(e);
  try {
    if (!(typeof xe == "string" && xe || ee.has(e) || Ye && Ye.size || wi() || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const i of Vi) try {
    const a = await i(e, t);
    if (a)
      return wt(e, a), a;
  } catch (a) {
    de("[slugManager] slug resolver failed", a);
  }
  if (Ye && Ye.size) {
    for (const i of ut) try {
      const a = String(i ?? "").replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
      if (a && we(a) === e)
        return wt(e, i), i;
    } catch (a) {
      de("[slugManager] filename fast-path match failed", a);
    }
    if (Nr.has(e)) {
      const i = Nr.get(e);
      return wt(e, i), i;
    }
    for (const i of ut)
      if (!Oi.has(i))
        try {
          const a = await Qe(i, t);
          if (a && a.raw) {
            const o = (a.raw || "").match(/^#\s+(.+)$/m);
            if (o && o[1]) {
              const s = we(o[1].trim());
              if (Oi.add(i), s && Nr.set(s, i), s === e)
                return wt(e, i), i;
            }
          }
        } catch (a) {
          de("[slugManager] manifest title fetch failed", a);
        }
    try {
      Ps++, await wn(Ps, 8);
    } catch {
    }
  }
  const r = [`${e}.html`, `${e}.md`];
  for (const i of r) try {
    const a = await Qe(i, t);
    if (a && a.raw)
      return wt(e, i), i;
  } catch (a) {
    de("[slugManager] candidate fetch failed", a);
  }
  try {
    const i = await Un(t);
    if (i && i.length) {
      const a = i.find((o) => o.slug === e);
      if (a)
        return wt(e, a.path), a.path;
    }
  } catch (i) {
    de("[slugManager] buildSearchIndex lookup failed", i);
  }
  try {
    const i = await Jo(e, t, n);
    if (i)
      return wt(e, i), i;
  } catch (i) {
    de("[slugManager] crawlForSlug lookup failed", i);
  }
  if (Ye && Ye.size) for (const i of ut) try {
    const a = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
    if (we(a) === e)
      return wt(e, i), i;
  } catch (a) {
    de("[slugManager] build-time filename match failed", a);
  }
  try {
    if (vt && typeof vt == "string" && vt.trim()) try {
      const i = await Qe(vt, t);
      if (i && i.raw) {
        const a = (i.raw || "").match(/^#\s+(.+)$/m);
        if (a && a[1] && we(a[1].trim()) === e)
          return wt(e, vt), vt;
      }
    } catch (i) {
      de("[slugManager] home page fetch failed", i);
    }
  } catch (i) {
    de("[slugManager] home page fetch failed", i);
  }
  return null;
}
var au = /* @__PURE__ */ wo(((e, t) => {
  function n(s, l) {
    return l.some(([c, f]) => c <= s && s <= f);
  }
  function r(s) {
    return typeof s != "string" ? !1 : n(s.charCodeAt(0), [
      [12352, 12447],
      [19968, 40959],
      [44032, 55203],
      [131072, 191456]
    ]);
  }
  function i(s) {
    return ` 
\r	`.includes(s);
  }
  function a(s) {
    return typeof s != "string" ? !1 : n(s.charCodeAt(0), [
      [33, 47],
      [58, 64],
      [91, 96],
      [123, 126],
      [12288, 12351],
      [65280, 65519]
    ]);
  }
  function o(s, l = {}) {
    let c = 0, f = 0, d = s.length - 1;
    const u = l.wordsPerMinute || 200, p = l.wordBound || i;
    for (; p(s[f]); ) f++;
    for (; p(s[d]); ) d--;
    const m = `${s}
`;
    for (let h = f; h <= d; h++)
      if ((r(m[h]) || !p(m[h]) && (p(m[h + 1]) || r(m[h + 1]))) && c++, r(m[h])) for (; h <= d && (a(m[h + 1]) || p(m[h + 1])); ) h++;
    const g = c / u, y = Math.round(g * 60 * 1e3);
    return {
      text: Math.ceil(g.toFixed(2)) + " min read",
      minutes: g,
      time: y,
      words: c
    };
  }
  t.exports = o;
})), su = /* @__PURE__ */ ko(au(), 1), vr = /* @__PURE__ */ new Map(), ou = 200;
function lu(e) {
  const t = String(e ?? "");
  let n = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t.charCodeAt(r);
    n = (n << 5) - n + i | 0;
  }
  return `${t.length}:${n}`;
}
function cu(e, t) {
  if (vr.set(e, new WeakRef(t)), vr.size > ou) {
    const n = vr.keys().next().value;
    n && vr.delete(n);
  }
}
function uu(e) {
  try {
    return e.deref();
  } catch {
    return;
  }
}
function hu(e) {
  return e ? String(e).trim().split(/\s+/).filter(Boolean).length : 0;
}
function fu(e) {
  const t = lu(e), n = uu(vr.get(t));
  if (n) return Object.assign({}, n);
  const r = (0, su.default)(e || ""), i = {
    readingTime: r,
    wordCount: typeof r.words == "number" ? r.words : hu(e)
  };
  return cu(t, i), Object.assign({}, i);
}
function Fr(e, t) {
  const n = typeof CSS < "u" && CSS.escape ? CSS.escape(String(e)) : String(e);
  let r = document.querySelector(`meta[name="${n}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", e), document.head.appendChild(r)), r.setAttribute("content", t);
}
function du() {
  try {
    if (typeof document > "u" || !document.head) return;
    try {
      if (!document.querySelector("meta[charset]")) {
        const e = document.createElement("meta");
        e.setAttribute("charset", "utf-8"), document.head.prepend(e);
      }
    } catch {
    }
    try {
      if (!document.querySelector('meta[name="viewport"]')) {
        const e = document.createElement("meta");
        e.setAttribute("name", "viewport"), e.setAttribute("content", "width=device-width, initial-scale=1"), document.head.appendChild(e);
      }
    } catch {
    }
  } catch {
  }
}
function gt(e, t, n) {
  let r = `meta[${e}="${typeof CSS < "u" && CSS.escape ? CSS.escape(String(t)) : String(t)}"]`, i = document.querySelector(r);
  i || (i = document.createElement("meta"), i.setAttribute(e, t), document.head.appendChild(i)), i.setAttribute("content", n);
}
function nl(e, t) {
  try {
    if (!e) return;
    const n = typeof CSS < "u" && CSS.escape ? CSS.escape(String(e)) : String(e);
    let r = document.querySelector(`link[rel="${n}"]`);
    r || (r = document.createElement("link"), r.setAttribute("rel", e), document.head.appendChild(r)), r.setAttribute("href", t);
  } catch (n) {
    x("[seoManager] upsertLinkRel failed", n);
  }
}
function rl(e) {
  try {
    if (typeof document > "u" || !document.head) return;
    const t = Ya();
    if (!Array.isArray(t) || t.length === 0) return;
    try {
      const n = typeof location < "u" && location?.origin ? location.origin + location.pathname.split("?")[0] : "";
      if (!n) return;
      const r = e || "", i = r ? `${n}?page=${encodeURIComponent(r)}` : n;
      try {
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((a) => a.remove());
      } catch {
      }
      for (const a of t) try {
        const o = `${i}&lang=${encodeURIComponent(String(a))}`, s = document.createElement("link");
        s.setAttribute("rel", "alternate"), s.setAttribute("hreflang", String(a)), s.setAttribute("href", o), document.head.appendChild(s);
      } catch {
      }
      try {
        const a = document.createElement("link");
        a.setAttribute("rel", "alternate"), a.setAttribute("hreflang", "x-default"), a.setAttribute("href", i), document.head.appendChild(a);
      } catch {
      }
    } catch (n) {
      x("[seoManager] setHreflangTags failed", n);
    }
  } catch (t) {
    x("[seoManager] setHreflangTags failed", t);
  }
}
function pu(e, t, n, r, i) {
  gt("property", "og:title", t && String(t).trim() ? t : e.title || document.title);
  const a = r && String(r).trim() ? r : e.description || "";
  a && String(a).trim() && gt("property", "og:description", a), a && String(a).trim() && gt("name", "twitter:description", a), gt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const o = n || e.image;
  o && (gt("property", "og:image", o), gt("name", "twitter:image", o), e.image_width && gt("property", "og:image:width", String(e.image_width)), e.image_height && gt("property", "og:image:height", String(e.image_height))), gt("property", "og:type", i || e.og_type || (e.type === "Article" ? "article" : "website"));
  try {
    const s = typeof navigator < "u" && (navigator.language || navigator.languages?.[0]) || "en";
    gt("property", "og:locale", String(s).replace("-", "_").toLowerCase());
    const l = Ya();
    if (Array.isArray(l) && l.length > 0) for (const c of l) try {
      gt("property", "og:locale:alternate", String(c).replace("-", "_").toLowerCase());
    } catch {
    }
  } catch {
  }
  if (e.date) try {
    const s = new Date(e.date);
    isNaN(s.getTime()) || gt("property", "article:published_time", s.toISOString());
  } catch {
  }
  if (e.dateModified) try {
    const s = new Date(e.dateModified);
    isNaN(s.getTime()) || gt("property", "article:modified_time", s.toISOString());
  } catch {
  }
  e.twitter_site && gt("name", "twitter:site", String(e.twitter_site)), e.twitter_creator && gt("name", "twitter:creator", String(e.twitter_creator));
}
function Ka(e, t, n, r, i = "") {
  const a = e.meta || {}, o = document?.querySelector && document.querySelector('meta[name="description"]')?.getAttribute("content") || "", s = r && String(r).trim() ? r : a.description && String(a.description).trim() ? a.description : o && String(o).trim() ? o : "";
  s && String(s).trim() && Fr("description", s), Fr("robots", a.robots || "index,follow"), pu(a, t, n, s, a.type), rl(e.slug || e.meta?.slug || "");
}
function il() {
  try {
    for (const e of [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]'
    ]) {
      const t = document.querySelector(e);
      if (t) {
        const n = t.getAttribute("content") || "";
        if (n?.trim()) return n.trim();
      }
    }
  } catch (e) {
    x("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Ja(e, t, n, r, i, a = "") {
  try {
    let f = function(y) {
      try {
        const h = te(y);
        try {
          return (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(h);
        } catch {
          return location.href.split("#")[0];
        }
      } catch {
        return location.href.split("#")[0];
      }
    }, u = function(y, h) {
      try {
        const b = String(h?.type || "").trim();
        if (b) return b;
        const _ = String(y || "").replace(/^\/+|\/+$/g, "").toLowerCase();
        if (!_ || _ === "index" || _ === "home") return "WebPage";
        const w = _.split("/"), A = w[0] || "", z = w[w.length - 1] || "", j = {
          about: "AboutPage",
          contact: "ContactPage",
          blog: "Blog",
          posts: "Blog",
          article: "Article",
          articles: "Article",
          news: "NewsArticle",
          product: "Product",
          products: "Product",
          event: "Event",
          events: "Event",
          person: "ProfilePage",
          people: "ProfilePage",
          author: "ProfilePage",
          authors: "ProfilePage",
          search: "SearchResultsPage",
          faq: "FAQPage",
          faqs: "FAQPage",
          help: "WebPage",
          support: "WebPage",
          docs: "TechArticle",
          documentation: "TechArticle",
          tutorial: "TechArticle",
          howto: "HowTo",
          "how-to": "HowTo",
          recipe: "Recipe",
          recipes: "Recipe",
          review: "Review",
          reviews: "Review",
          video: "VideoObject",
          videos: "VideoObject",
          audio: "AudioObject",
          podcast: "PodcastEpisode"
        };
        return w.length === 1 && j[A] ? j[A] : j[z] ? j[z] : "Article";
      } catch {
        return "Article";
      }
    };
    const o = e.meta || {}, s = n && String(n).trim() ? n : o.title || a || document.title, l = i && String(i).trim() ? i : o.description || document.querySelector('meta[name="description"]')?.getAttribute("content") || "", c = r || o.image || null, d = f(t);
    d && nl("canonical", d);
    try {
      gt("property", "og:url", d);
    } catch (y) {
      x("[seoManager] upsertMeta og:url failed", y);
    }
    const p = {
      "@context": "https://schema.org",
      "@type": u(t, o),
      headline: s || "",
      description: l || "",
      url: d || location.href.split("#")[0]
    };
    c && (p.image = String(c)), o.date && (p.datePublished = o.date), o.dateModified && (p.dateModified = o.dateModified), o.author && (p.author = {
      "@type": "Person",
      name: String(o.author)
    });
    try {
      let y = "";
      o.publisher && (y = typeof o.publisher == "string" ? String(o.publisher).trim() : o.publisher?.name ? String(o.publisher.name).trim() : ""), y || (y = il()), y && (p.publisher = {
        "@type": "Organization",
        name: y
      });
    } catch {
    }
    d && (p.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": d
    });
    const m = "nimbi-jsonld";
    let g = document.getElementById(m);
    g || (g = document.createElement("script"), g.type = "application/ld+json", g.id = m, Va(g), document.head.appendChild(g)), g.textContent = JSON.stringify(p, null, 2).replace(/<\/script>/gi, "<\\/script>");
  } catch (o) {
    x("[seoManager] setStructuredData failed", o);
  }
}
var zi = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function gu(e) {
  try {
    if (!e || typeof e != "object") {
      zi = {};
      return;
    }
    zi = Object.assign({}, e);
  } catch (t) {
    x("[seoManager] setSeoMap failed", t);
  }
}
function mu(e, t = "") {
  try {
    if (!e) return;
    const n = zi?.[e] ? zi[e] : typeof window < "u" && window.__SEO_MAP?.[e] ? window.__SEO_MAP[e] : null;
    try {
      const r = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e ?? ""));
      nl("canonical", r);
      try {
        gt("property", "og:url", r);
      } catch {
      }
    } catch {
    }
    if (!n) return;
    try {
      n.title && (document.title = String(n.title));
    } catch {
    }
    try {
      n.description && Fr("description", String(n.description));
    } catch {
    }
    try {
      try {
        Ka({
          meta: n,
          slug: e
        }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      rl(e);
    } catch {
    }
    try {
      Ja({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (r) {
      x("[seoManager] inject structured data failed", r);
    }
  } catch (n) {
    x("[seoManager] injectSeoForPage failed", n);
  }
}
function Ai(e = {}, t = "", n = void 0, r = void 0) {
  try {
    const i = e || {}, a = typeof n == "string" && n.trim() ? n : i.title || "Not Found", o = typeof r == "string" && r.trim() ? r : i.description || "";
    try {
      Fr("robots", "noindex,follow");
    } catch {
    }
    try {
      o && String(o).trim() && Fr("description", String(o));
    } catch {
    }
    try {
      Ka({ meta: Object.assign({}, i, { robots: "noindex,follow" }) }, a, i.image || void 0, o);
    } catch {
    }
    try {
      Ja({ meta: Object.assign({}, i, {
        title: a,
        description: o
      }) }, t || "", a, i.image || void 0, o);
    } catch {
    }
  } catch (i) {
    x("[seoManager] markNotFound failed", i);
  }
}
function yu(e, t, n, r, i, a, o, s, l, c, f) {
  try {
    if (r?.querySelector) {
      const d = r.querySelector(".menu-label");
      d && (d.textContent = s?.textContent || e("onThisPage"));
    }
  } catch (d) {
    x("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta?.title ? String(n.meta.title).trim() : "", u = i?.querySelector?.("img") || null, p = u && (u.getAttribute("src") || u.src) || null;
    let m = "";
    try {
      let h = "";
      try {
        const b = s || i?.querySelector?.("h1") || null;
        if (b) {
          let _ = b.nextElementSibling;
          const w = [];
          for (; _ && !(_.tagName && _.tagName.toLowerCase() === "h2"); ) {
            try {
              if (_.classList?.contains("nimbi-article-subtitle")) {
                _ = _.nextElementSibling;
                continue;
              }
            } catch {
            }
            const A = (_.textContent || "").trim();
            A && w.push(A), _ = _.nextElementSibling;
          }
          w.length && (h = w.join(" ").replace(/\s+/g, " ").trim()), !h && l && (h = String(l).trim());
        }
      } catch (b) {
        x("[seoManager] compute descOverride failed", b);
      }
      h && String(h).length > 160 && (h = String(h).slice(0, 157).trim() + "..."), m = h;
    } catch (h) {
      x("[seoManager] compute descOverride failed", h);
    }
    let g = "";
    try {
      d && (g = d);
    } catch {
    }
    if (!g) try {
      s?.textContent && (g = String(s.textContent).trim());
    } catch {
    }
    if (!g) try {
      const h = i.querySelector("h2");
      h?.textContent && (g = String(h.textContent).trim());
    } catch {
    }
    g || (g = a || "");
    try {
      Ka(n, g || void 0, p, m);
    } catch (h) {
      x("[seoManager] setMetaTags failed", h);
    }
    try {
      Ja(n, c, g || void 0, p, m, t);
    } catch (h) {
      x("[seoManager] setStructuredData failed", h);
    }
    const y = il();
    g ? y ? document.title = `${y} - ${g}` : document.title = `${t || "Site"} - ${g}` : d ? document.title = d : document.title = t || document.title;
  } catch (d) {
    x("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      i.querySelectorAll(".nimbi-reading-time")?.forEach((d) => d.remove());
    } catch {
    }
    if (l) {
      const d = fu(f?.raw || ""), u = d?.readingTime ? d.readingTime : null, p = typeof u?.minutes == "number" ? Math.ceil(u.minutes) : 0, m = p ? e("readingTime", { minutes: p }) : "";
      if (!m) return;
      const g = i.querySelector("h1");
      if (g) {
        const y = i.querySelector(".nimbi-article-subtitle");
        try {
          if (y) {
            const h = document.createElement("span");
            h.className = "nimbi-reading-time", h.textContent = m, y.appendChild(h);
          } else {
            const h = document.createElement("p");
            h.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = m, h.appendChild(b);
            try {
              g.parentElement.insertBefore(h, g.nextSibling);
            } catch {
              try {
                g.insertAdjacentElement("afterend", h);
              } catch {
              }
            }
          }
        } catch {
          try {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const _ = document.createElement("span");
            _.className = "nimbi-reading-time", _.textContent = m, b.appendChild(_), g.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    x("[seoManager] reading time update failed", d);
  }
}
var $i = 100;
function Ns(e) {
  $i = e, ol();
}
function Ct() {
  try {
    if (So(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
var Dt = 3e5, _u = 6e4, mr = null, yr = null;
function Pt(e, t, n) {
  try {
    if (typeof Qe == "function" && typeof Qe.length == "number" && Qe.length >= 3) return Qe(e, t, { signal: n });
  } catch {
  }
  return Qe(e, t);
}
function Is(e) {
  Dt = e;
  try {
    jt.defaultTTL = Dt > 0 ? Dt : 1 / 0;
  } catch {
  }
  al();
}
function al() {
  try {
    mr !== null && (clearInterval(mr), mr = null);
  } catch {
  }
  if (Dt > 0) try {
    mr = setInterval(ku, _u);
  } catch {
    mr = null;
  }
}
var jt = new Zr({
  maxEntries: $i,
  defaultTTL: Dt > 0 ? Dt : 1 / 0
});
al();
function sl(e) {
  return !!e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "value") && Object.prototype.hasOwnProperty.call(e, "ts");
}
function ol() {
  try {
    jt.maxEntries = $i;
  } catch {
  }
  for (; jt.size > $i; ) {
    const e = jt.keys("LRU").next().value;
    if (e === void 0) break;
    jt.delete(e);
  }
}
function bu(e) {
  const t = jt.get(e);
  if (t !== void 0) {
    if (sl(t)) {
      const n = Date.now();
      if (Dt > 0 && t.ts + Dt < n) {
        jt.delete(e);
        return;
      }
      return t.value;
    }
    return t;
  }
}
function wu(e, t) {
  jt.set(e, t, { ttl: Dt > 0 ? Dt : 1 / 0 }), ol();
}
function ku() {
  if (!Dt || Dt <= 0) return;
  const e = Date.now(), t = Array.from(jt.keys("LRU"));
  for (const n of t) {
    jt.has(n);
    const r = jt.peek(n);
    sl(r) && r.ts + Dt < e && jt.delete(n);
  }
}
async function xu(e, t, n) {
  const r = new Set(kt);
  let i = [];
  try {
    if (typeof document < "u" && document.getElementsByClassName) {
      const a = (o) => {
        const s = document.getElementsByClassName(o);
        for (let l = 0; l < s.length; l++) {
          const c = s[l].getElementsByTagName("a");
          for (let f = 0; f < c.length; f++) i.push(c[f]);
        }
      };
      a("nimbi-site-navbar"), a("navbar"), a("nimbi-nav");
    } else i = Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"));
  } catch {
    try {
      i = Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"));
    } catch {
      i = [];
    }
  }
  for (const a of Array.from(i || [])) {
    const o = a.getAttribute("href") || "";
    if (o)
      try {
        try {
          const u = mt(o);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const p = te(u.page);
              if (p) {
                r.add(p);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const p = u.page;
              if (ee.has(p)) {
                const m = ee.get(p);
                if (m) return m;
              }
              continue;
            }
          }
        } catch {
        }
        const s = new URL(o, location.href);
        if (s.origin !== location.origin) continue;
        const l = (s.hash || s.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (s.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (l) {
          let u = te(l[1]);
          u && r.add(u);
          continue;
        }
        const c = (a.textContent || "").trim(), f = (s.pathname || "").replace(/^.*\//, "");
        if (c && we(c) === e || f && we(f.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          r.add(u);
          continue;
        }
        const d = s.pathname || "";
        if (d) {
          const u = new URL(t), p = Tn(u.pathname);
          if (d.indexOf(p) !== -1) {
            let m = d.startsWith(p) ? d.slice(p.length) : d;
            m = te(m), m && r.add(m);
          }
        }
      } catch (s) {
        x("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const a of r) try {
    if (!a || !String(a).includes(".md")) continue;
    const o = await Pt(a, t, n);
    if (!o || !o.raw) continue;
    const s = (o.raw || "").match(/^#\s+(.+)$/m);
    if (s) {
      const l = (s[1] || "").trim();
      if (l && we(l) === e) return a;
    }
  } catch (o) {
    x("[router] fetchMarkdown during index discovery failed", o);
  }
  return null;
}
function Su(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else try {
    const n = decodeURIComponent(String(e ?? ""));
    if (ee.has(n)) {
      const r = nr(n) || ee.get(n);
      r && (/\.(md|html?)$/i.test(r) ? /index\.html$/i.test(r) || t.push(r) : (t.push(r), t.push(r + ".html")));
    } else {
      if (kt && kt.size) for (const r of kt) {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (we(i) === n && !/index\.html$/i.test(r)) {
          t.push(r);
          break;
        }
      }
      !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
    }
  } catch (n) {
    x("[router] buildPageCandidates failed during slug handling", n);
  }
  return t;
}
async function vu(e, t) {
  const n = e || "";
  try {
    try {
      Ao("fetchPageData");
    } catch {
    }
  } catch {
  }
  try {
    if (yr && typeof yr.abort == "function") try {
      yr.abort();
    } catch {
    }
  } catch {
  }
  yr = typeof AbortController < "u" ? new AbortController() : null;
  const r = yr;
  let i = null;
  try {
    const h = mt(typeof location < "u" ? location.href : "");
    h?.anchor && (i = h.anchor);
  } catch {
    try {
      i = location?.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    } catch {
      i = null;
    }
  }
  let a = e || "";
  try {
    (!a || String(a).trim() === "") && typeof vt == "string" && vt && (a = String(vt));
  } catch {
  }
  let o = null, s = null;
  const l = String(n ?? "").includes(".md") || String(n ?? "").includes(".html");
  if (a && String(a).includes("::")) {
    const h = String(a).split("::", 2);
    a = h[0], o = h[1] || null;
  }
  const c = `${e}|||${typeof bc < "u" && $t ? $t : ""}`, f = bu(c);
  if (f)
    a = f.resolved, o = f.anchor || o;
  else {
    if (!String(a).includes(".md") && !String(a).includes(".html")) {
      let h = decodeURIComponent(String(a ?? ""));
      if (h && typeof h == "string" && (h = te(h), h = jn(h)), ee.has(h)) a = nr(h) || ee.get(h);
      else {
        let b = await xu(h, t, r ? r.signal : void 0);
        if (b) a = b;
        else if (wi() && kt && kt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const _ = await tl(h, t);
          _ && (a = _);
        }
      }
    }
    wu(c, {
      resolved: a,
      anchor: o
    });
  }
  let d = !0;
  try {
    const h = String(a ?? "").includes(".md") || String(a ?? "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof xe == "string" && xe || ee.has(a) || kt && kt.size || wi() || l || h;
  } catch {
    d = !0;
  }
  !o && i && (o = i);
  try {
    if (d && a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"))) {
      const h = a.startsWith("/") ? new URL(a, location.origin).toString() : a;
      try {
        const b = await fetch(h, r ? { signal: r.signal } : void 0);
        if (b && b.ok) {
          const _ = await b.text(), w = typeof b?.headers?.get == "function" && b.headers.get("content-type") || "", A = (_ || "").toLowerCase();
          if (w && w.indexOf && w.indexOf("text/html") !== -1 || A.indexOf("<!doctype") !== -1 || A.indexOf("<html") !== -1) {
            if (!l) try {
              let z = h;
              try {
                z = new URL(h).pathname.replace(/^\//, "");
              } catch {
                z = String(h ?? "").replace(/^\//, "");
              }
              const j = z.replace(/\.html$/i, ".md");
              try {
                const W = await Pt(j, t, r ? r.signal : void 0);
                if (W?.raw) return {
                  data: W,
                  pagePath: j,
                  anchor: o
                };
              } catch {
              }
              if (typeof xe == "string" && xe) try {
                const W = await Pt(xe, t, r ? r.signal : void 0);
                if (W && W.raw) {
                  try {
                    Ai(W.meta || {}, xe);
                  } catch {
                  }
                  return {
                    data: W,
                    pagePath: xe,
                    anchor: o
                  };
                }
              } catch {
              }
              try {
                s = /* @__PURE__ */ new Error("site shell detected (absolute fetch)");
              } catch {
              }
            } catch {
            }
            if (A.indexOf('<div id="app"') !== -1 || A.indexOf("nimbi-cms") !== -1 || A.indexOf("nimbi-mount") !== -1 || A.indexOf("nimbi-") !== -1 || A.indexOf("initcms(") !== -1 || A.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(A)) try {
              let z = h;
              try {
                z = new URL(h).pathname.replace(/^\//, "");
              } catch {
                z = String(h ?? "").replace(/^\//, "");
              }
              const j = z.replace(/\.html$/i, ".md");
              try {
                const W = await Pt(j, t, r ? r.signal : void 0);
                if (W?.raw) return {
                  data: W,
                  pagePath: j,
                  anchor: o
                };
              } catch {
              }
              if (typeof xe == "string" && xe) try {
                const W = await Pt(xe, t, r ? r.signal : void 0);
                if (W && W.raw) {
                  try {
                    Ai(W.meta || {}, xe);
                  } catch {
                  }
                  return {
                    data: W,
                    pagePath: xe,
                    anchor: o
                  };
                }
              } catch {
              }
              try {
                s = /* @__PURE__ */ new Error("site shell detected (absolute fetch)");
              } catch {
              }
            } catch {
            }
          }
        }
      } catch {
      }
    }
  } catch {
  }
  const u = Su(a);
  try {
    if (Ct()) try {
      de("[router-debug] fetchPageData candidates", {
        originalRaw: n,
        resolved: a,
        pageCandidates: u
      });
    } catch {
    }
  } catch {
  }
  const p = String(n ?? "").includes(".md") || String(n ?? "").includes(".html");
  let m = null;
  if (!p) try {
    let h = decodeURIComponent(String(n ?? ""));
    h = te(h), h = jn(h), h && !/\.(md|html?)$/i.test(h) && (m = h);
  } catch {
    m = null;
  }
  if (p && u.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && u.push(a), u.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && u.push(a), u.length === 1 && /index\.html$/i.test(u[0]) && !p && !ee.has(a) && !ee.has(decodeURIComponent(String(a ?? ""))) && !String(a ?? "").includes("/")) throw new Error("Unknown slug: index.html fallback prevented");
  let g = null, y = null;
  try {
    const h = String(a ?? "").includes(".md") || String(a ?? "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof xe == "string" && xe || ee.has(a) || kt && kt.size || wi() || p || h;
  } catch {
    d = !0;
  }
  if (!d) s = /* @__PURE__ */ new Error("no page data");
  else for (const h of u)
    if (h)
      try {
        const b = te(h);
        if (g = await Pt(b, t, r ? r.signal : void 0), y = b, m && !ee.has(m)) try {
          let _ = "";
          if (g && g.isHtml) try {
            const w = it();
            if (w) {
              const A = w.parseFromString(g.raw || "", "text/html"), z = A.querySelector("h1") || A.querySelector("title");
              z && z.textContent && (_ = z.textContent.trim());
            }
          } catch {
          }
          else {
            const w = (g && g.raw || "").match(/^#\s+(.+)$/m);
            w && w[1] && (_ = w[1].trim());
          }
          if (_ && we(_) !== m)
            try {
              if (/\.html$/i.test(b)) {
                const w = b.replace(/\.html$/i, ".md");
                if (new Set(u).has(w)) try {
                  const A = await Pt(w, t, r ? r.signal : void 0);
                  if (A?.raw)
                    g = A, y = w;
                  else if (typeof xe == "string" && xe) try {
                    const z = await Pt(xe, t, r ? r.signal : void 0);
                    if (z && z.raw)
                      g = z, y = xe;
                    else {
                      g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                      continue;
                    }
                  } catch {
                    g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                  else {
                    g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  try {
                    const z = await Pt(xe, t, r ? r.signal : void 0);
                    if (z && z.raw)
                      g = z, y = xe;
                    else {
                      g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                      continue;
                    }
                  } catch {
                    g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                }
                else {
                  g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                  continue;
                }
              } else {
                g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                continue;
              }
            } catch {
              g = null, y = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
              continue;
            }
        } catch {
        }
        try {
          if (!p && /\.html$/i.test(b)) {
            const _ = b.replace(/\.html$/i, ".md");
            if (new Set(u).has(_)) try {
              const w = String(g && g.raw || "").trim().slice(0, 128).toLowerCase();
              if (g && g.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(w) || w.indexOf('<div id="app"') !== -1 || w.indexOf("nimbi-") !== -1 || w.indexOf("nimbi") !== -1 || w.indexOf("initcms(") !== -1) {
                let A = !1;
                try {
                  const z = await Pt(_, t, r ? r.signal : void 0);
                  if (z?.raw)
                    g = z, y = _, A = !0;
                  else if (typeof xe == "string" && xe) try {
                    const j = await Pt(xe, t, r ? r.signal : void 0);
                    j && j.raw && (g = j, y = xe, A = !0);
                  } catch {
                  }
                } catch {
                  try {
                    const j = await Pt(xe, t, r ? r.signal : void 0);
                    j && j.raw && (g = j, y = xe, A = !0);
                  } catch {
                  }
                }
                if (!A) {
                  g = null, y = null, s = /* @__PURE__ */ new Error("site shell detected (candidate HTML rejected)");
                  continue;
                }
              }
            } catch {
            }
          }
        } catch {
        }
        try {
          if (Ct()) try {
            de("[router-debug] fetchPageData accepted candidate", {
              candidate: b,
              pagePath: y,
              isHtml: g && g.isHtml,
              snippet: g && g.raw ? String(g.raw).slice(0, 160) : null
            });
          } catch {
          }
        } catch {
        }
        break;
      } catch (b) {
        s = b;
        try {
          Ct() && x("[router] candidate fetch failed", {
            candidate: h,
            contentBase: t,
            err: b && b.message || b
          });
        } catch {
        }
      }
  if (!g) {
    const h = s && (s.message || String(s)) || null, b = h && /failed to fetch md|site shell detected/i.test(h);
    try {
      if (Ct()) try {
        de("[router-debug] fetchPageData no data", {
          originalRaw: n,
          resolved: a,
          pageCandidates: u,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    if (b) try {
      if (Ct()) try {
        x("[router] fetchPageData: no page data (expected)", {
          originalRaw: n,
          resolved: a,
          pageCandidates: u,
          contentBase: t,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    else try {
      if (Ct()) try {
        Lr("[router] fetchPageData: no page data for", {
          originalRaw: n,
          resolved: a,
          pageCandidates: u,
          contentBase: t,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    if (typeof xe == "string" && xe) try {
      const _ = await Pt(xe, t, r ? r.signal : void 0);
      if (_ && _.raw) {
        try {
          Ai(_.meta || {}, xe);
        } catch {
        }
        return {
          data: _,
          pagePath: xe,
          anchor: o
        };
      }
    } catch {
    }
    try {
      if (p && String(n ?? "").toLowerCase().includes(".html")) try {
        const _ = new URL(String(n ?? ""), location.href).toString();
        Ct() && x("[router] attempting absolute HTML fetch fallback", _);
        const w = await fetch(_, r ? { signal: r.signal } : void 0);
        if (w && w.ok) {
          const A = await w.text(), z = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", j = (A || "").toLowerCase(), W = z && z.indexOf && z.indexOf("text/html") !== -1 || j.indexOf("<!doctype") !== -1 || j.indexOf("<html") !== -1;
          if (!W && Ct()) try {
            x("[router] absolute fetch returned non-HTML", () => ({
              abs: _,
              contentType: z,
              snippet: j.slice(0, 200)
            }));
          } catch {
          }
          if (W) {
            const Q = (A || "").toLowerCase();
            if (/<title>\s*index of\b/i.test(A) || /<h1>\s*index of\b/i.test(A) || Q.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(A) || /<h1>\s*directory listing/i.test(A)) try {
              Ct() && x("[router] absolute fetch returned directory listing; treating as not found", { abs: _ });
            } catch {
            }
            else try {
              const ae = _, ue = new URL(".", ae).toString();
              try {
                const C = it();
                if (C) {
                  const N = C.parseFromString(A || "", "text/html"), L = ($, re) => {
                    try {
                      const oe = re.getAttribute($) || "";
                      if (!oe || /^(https?:)?\/\//i.test(oe) || oe.startsWith("/") || oe.startsWith("#")) return;
                      try {
                        const me = new URL(oe, ae).toString();
                        re.setAttribute($, me);
                      } catch (me) {
                        x("[router] rewrite attribute failed", $, me);
                      }
                    } catch (oe) {
                      x("[router] rewrite helper failed", oe);
                    }
                  }, E = N.querySelectorAll("[src],[href],[srcset],[poster]"), I = [];
                  for (const $ of Array.from(E || [])) try {
                    const re = $.tagName ? $.tagName.toLowerCase() : "";
                    if (re === "a") continue;
                    if ($.hasAttribute("src")) {
                      const oe = $.getAttribute("src");
                      L("src", $);
                      const me = $.getAttribute("src");
                      oe !== me && I.push({
                        attr: "src",
                        tag: re,
                        before: oe,
                        after: me
                      });
                    }
                    if ($.hasAttribute("href") && re === "link") {
                      const oe = $.getAttribute("href");
                      L("href", $);
                      const me = $.getAttribute("href");
                      oe !== me && I.push({
                        attr: "href",
                        tag: re,
                        before: oe,
                        after: me
                      });
                    }
                    if ($.hasAttribute("href") && re !== "link") {
                      const oe = $.getAttribute("href");
                      L("href", $);
                      const me = $.getAttribute("href");
                      oe !== me && I.push({
                        attr: "href",
                        tag: re,
                        before: oe,
                        after: me
                      });
                    }
                    if ($.hasAttribute("xlink:href")) {
                      const oe = $.getAttribute("xlink:href");
                      L("xlink:href", $);
                      const me = $.getAttribute("xlink:href");
                      oe !== me && I.push({
                        attr: "xlink:href",
                        tag: re,
                        before: oe,
                        after: me
                      });
                    }
                    if ($.hasAttribute("poster")) {
                      const oe = $.getAttribute("poster");
                      L("poster", $);
                      const me = $.getAttribute("poster");
                      oe !== me && I.push({
                        attr: "poster",
                        tag: re,
                        before: oe,
                        after: me
                      });
                    }
                    if ($.hasAttribute("srcset")) {
                      const oe = ($.getAttribute("srcset") || "").split(",").map((me) => me.trim()).filter(Boolean).map((me) => {
                        const [he, Se] = me.split(/\s+/, 2);
                        if (!he || /^(https?:)?\/\//i.test(he) || he.startsWith("/")) return me;
                        try {
                          const De = new URL(he, ae).toString();
                          return Se ? `${De} ${Se}` : De;
                        } catch {
                          return me;
                        }
                      }).join(", ");
                      $.setAttribute("srcset", oe);
                    }
                  } catch {
                  }
                  const Z = N.documentElement && N.documentElement.outerHTML ? N.documentElement.outerHTML : A;
                  try {
                    Ct() && I && I.length && x("[router] rewritten asset refs", {
                      abs: _,
                      rewritten: I
                    });
                  } catch {
                  }
                  return {
                    data: {
                      raw: Z,
                      isHtml: !0
                    },
                    pagePath: String(n ?? ""),
                    anchor: o
                  };
                }
              } catch {
              }
              let ne = A;
              try {
                let C = String(A ?? "");
                C = C.replace(/srcset\s*=\s*"([^"]*)"/gi, (N, L) => `srcset="${String(L ?? "").split(",").map((E) => E.trim()).filter(Boolean).map((E) => {
                  const [I, Z] = E.split(/\s+/, 2);
                  if (!I || /^(https?:)?\/\//i.test(I) || I.startsWith("/") || I.startsWith("#")) return E;
                  try {
                    const $ = new URL(I, ae).toString();
                    return Z ? `${$} ${Z}` : $;
                  } catch {
                    return E;
                  }
                }).join(", ")}"`), C = C.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi, (N, L, E) => {
                  if (!E || /^(https?:)?\/\//i.test(E) || E.startsWith("/") || E.startsWith("#")) return N;
                  try {
                    const I = new URL(E, ae).toString();
                    return N.replace(`href="${E}"`, `href="${I}"`);
                  } catch {
                    return N;
                  }
                }), C = C.replace(/\bsrc\s*=\s*"([^"]*)"/gi, (N, L) => {
                  if (!L || /^(https?:)?\/\//i.test(L) || L.startsWith("/") || L.startsWith("#")) return N;
                  try {
                    return `src="${new URL(L, ae).toString()}"`;
                  } catch {
                    return N;
                  }
                }), C = C.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi, (N, L) => {
                  if (!L || /^(https?:)?\/\//i.test(L) || L.startsWith("/") || L.startsWith("#")) return N;
                  try {
                    return `xlink:href="${new URL(L, ae).toString()}"`;
                  } catch {
                    return N;
                  }
                }), C = C.replace(/\bposter\s*=\s*"([^"]*)"/gi, (N, L) => {
                  if (!L || /^(https?:)?\/\//i.test(L) || L.startsWith("/") || L.startsWith("#")) return N;
                  try {
                    return `poster="${new URL(L, ae).toString()}"`;
                  } catch {
                    return N;
                  }
                }), ne = C;
              } catch {
                ne = A;
              }
              return /<base\s+[^>]*>/i.test(ne) || (/<head[^>]*>/i.test(ne) ? ne = ne.replace(/(<head[^>]*>)/i, `$1<base href="${ue}">`) : ne = `<base href="${ue}">` + ne), {
                data: {
                  raw: ne,
                  isHtml: !0
                },
                pagePath: String(n ?? ""),
                anchor: o
              };
            } catch {
              return {
                data: {
                  raw: A,
                  isHtml: !0
                },
                pagePath: String(n ?? ""),
                anchor: o
              };
            }
          }
        }
      } catch (_) {
        Ct() && x("[router] absolute HTML fetch fallback failed", _);
      }
    } catch {
    }
    try {
      const _ = decodeURIComponent(String(a ?? ""));
      if (_ && !/\.(md|html?)$/i.test(_) && typeof xe == "string" && xe && Ct()) {
        const w = [`/assets/${_}.html`, `/assets/${_}/index.html`];
        for (const A of w) try {
          const z = await fetch(A, Object.assign({ method: "GET" }, r ? { signal: r.signal } : {}));
          if (z && z.ok) return {
            data: {
              raw: await z.text(),
              isHtml: !0
            },
            pagePath: A.replace(/^\//, ""),
            anchor: o
          };
        } catch {
        }
      }
    } catch (_) {
      Ct() && x("[router] assets fallback failed", _);
    }
    throw new Error("no page data");
  }
  return {
    data: g,
    pagePath: y,
    anchor: o
  };
}
function es() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var Fn = es();
function ll(e) {
  Fn = e;
}
var Dn = { exec: () => null };
function Xn(e) {
  let t = [];
  return (n) => {
    let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
    return i || (i = e(r), t[r] = i), i;
  };
}
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, r = {
    replace: (i, a) => {
      let o = typeof a == "string" ? a : a.source;
      return o = o.replace(yt.caret, "$1"), n = n.replace(i, o), r;
    },
    getRegex: () => new RegExp(n, t)
  };
  return r;
}
var Au = ((e = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + e);
  } catch {
    return !1;
  }
})(), yt = {
  codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  endingSpaceTabChar: /[ \t]$/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  leadingSpaceTab: /^[ \t]+/,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] +\S/,
  listReplaceTask: /^\[[ xX]\] +/,
  listTaskCheckbox: /\[[ xX]\]/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: Xn((e) => new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
  hrRegex: Xn((e) => new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),
  fencesBeginRegex: Xn((e) => new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
  headingBeginRegex: Xn((e) => new RegExp(`^ {0,${e}}#`)),
  htmlBeginRegex: Xn((e) => new RegExp(`^ {0,${e}}(?:</?(?:${Jr})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")),
  blockquoteBeginRegex: Xn((e) => new RegExp(`^ {0,${e}}>`))
}, Eu = /^(?:[ \t]*(?:\n|$))+/, Tu = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ru = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Kr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Lu = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ts = / {0,3}(?:[*+-]|\d{1,9}[.)])/, cl = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ul = Le(cl).replace(/bull/g, ts).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Cu = Le(cl).replace(/bull/g, ts).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ns = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Mu = /^[^\n]+/, rs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Pu = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", rs).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Nu = Le(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, ts).getRegex(), Jr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", is = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Iu = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", is).replace("tag", Jr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), hl = (e) => Le(ns).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex(), Ou = hl(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), zu = hl(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), as = {
  blockquote: Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zu).getRegex(),
  code: Tu,
  def: Pu,
  fences: Ru,
  heading: Lu,
  hr: Kr,
  html: Iu,
  lheading: ul,
  list: Nu,
  newline: Eu,
  paragraph: Ou,
  table: Dn,
  text: Mu
}, Os = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex(), $u = {
  ...as,
  lheading: Cu,
  table: Os,
  paragraph: Le(ns).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Os).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex()
}, Du = {
  ...as,
  html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", is).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Dn,
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Le(ns).replace("hr", Kr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ul).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Bu = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Uu = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, fl = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, ju = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, sn = /[\p{P}\p{S}]/u, ar = /[\s\p{P}\p{S}]/u, ei = /[^\s\p{P}\p{S}]/u, Wu = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ar).getRegex(), Fu = /[\p{Pi}\p{Ps}"']/u, dl = /(?!~)[\p{P}\p{S}]/u, qu = /(?!~)[\s\p{P}\p{S}]/u, Hu = /(?:[^\s\p{P}\p{S}]|~)/u, Gu = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Au ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), pl = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Vu = Le(pl, "u").replace(/punct/g, sn).getRegex(), Zu = Le(pl, "u").replace(/punct/g, dl).getRegex(), Xu = Le(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, Fu).replace(/punct/g, sn).getRegex(), gl = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Yu = Le(gl, "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, ar).replace(/punct/g, sn).getRegex(), Qu = Le(gl, "gu").replace(/notPunctSpace/g, Hu).replace(/punctSpace/g, qu).replace(/punct/g, dl).getRegex(), Ku = Le("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, ar).replace(/punct/g, sn).getRegex(), Ju = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, ar).replace(/punct/g, sn).getRegex(), eh = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, ar).replace(/punct/g, sn).getRegex(), th = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, sn).getRegex(), nh = Le("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, ar).replace(/punct/g, sn).getRegex(), rh = Le(/\\(punct)/, "gu").replace(/punct/g, sn).getRegex(), ih = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ah = Le(is).replace("(?:-->|$)", "-->").getRegex(), sh = Le("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ah).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ml = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Di = Le(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", ml).getRegex(), oh = Le(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label", Di).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), lh = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", Di).replace("ref", rs).getRegex(), ch = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", rs).getRegex(), zs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, uh = Le(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", ml).getRegex(), hh = Le("reflink|nolink(?!\\()", "g").replace("reflink", Le(/^!?\[(label)\]\[(ref)\]/).replace("label", uh).replace("ref", zs).getRegex()).replace("nolink", Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", zs).getRegex()).getRegex(), $s = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, fh = Le(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), ss = {
  _backpedal: Dn,
  anyPunctuation: rh,
  autolink: ih,
  blockSkip: Gu,
  br: fl,
  code: Uu,
  del: Dn,
  delLDelim: Dn,
  delRDelim: Dn,
  emStrongLDelim: Vu,
  emStrongRDelimAst: Yu,
  emStrongRDelimUnd: Ju,
  escape: Bu,
  link: oh,
  nolink: ch,
  punctuation: Wu,
  reflink: lh,
  reflinkSearch: hh,
  tag: sh,
  text: ju,
  url: Dn
}, dh = {
  ...ss,
  emStrongLDelim: Xu,
  emStrongRDelimAst: Ku,
  emStrongRDelimUnd: eh,
  link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", Di).getRegex(),
  reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Di).getRegex()
}, La = {
  ...ss,
  emStrongRDelimAst: Qu,
  emStrongLDelim: Zu,
  delLDelim: th,
  delRDelim: nh,
  url: Le(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", fh).replace("protocol", $s).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
  text: Le(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", $s).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, ph = {
  ...La,
  br: Le(fl).replace("{2,}", "*").getRegex(),
  text: Le(La.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, gi = {
  normal: as,
  gfm: $u,
  pedantic: Du
}, _r = {
  normal: ss,
  gfm: La,
  breaks: ph,
  pedantic: dh
}, gh = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ds = (e) => gh[e];
function Nt(e, t) {
  if (t) {
    if (yt.escapeTest.test(e)) return e.replace(yt.escapeReplace, Ds);
  } else if (yt.escapeTestNoEncode.test(e)) return e.replace(yt.escapeReplaceNoEncode, Ds);
  return e;
}
function mh(e) {
  return e.replace(yt.numericCharacterReference, (t, n, r) => {
    let i = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
    return i === 0 || i > 1114111 || i >= 55296 && i <= 57343 ? "�" : String.fromCodePoint(i);
  });
}
function Bs(e) {
  try {
    e = encodeURI(e).replace(yt.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Us(e, t) {
  let n = e.replace(yt.findPipe, (i, a, o) => {
    let s = !1, l = a;
    for (; --l >= 0 && o[l] === "\\"; ) s = !s;
    return s ? "|" : " |";
  }).split(yt.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
  else for (; n.length < t; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(yt.slashPipe, "|");
  return n;
}
function gn(e, t, n) {
  let r = e.length;
  if (r === 0) return "";
  let i = 0;
  for (; i < r; ) {
    let a = e.charAt(r - i - 1);
    if (a === t && !n) i++;
    else if (a !== t && n) i++;
    else break;
  }
  return e.slice(0, r - i);
}
function js(e) {
  let t = e.split(`
`), n = t.length - 1;
  for (; n >= 0 && yt.blankLine.test(t[n]); ) n--;
  return t.length - n <= 2 ? e : t.slice(0, n + 1).join(`
`);
}
function Bi(e) {
  return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Ws(e, t) {
  if (e.indexOf(t[0]) === -1 && e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
  else if (e[r] === t[0]) n++;
  else if (e[r] === t[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Fs(e, t = 0) {
  let n = t, r = "";
  for (let i of e) if (i === "	") {
    let a = 4 - n % 4;
    r += " ".repeat(a), n += a;
  } else r += i, n++;
  return r;
}
function qs(e, t, n, r, i) {
  let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), l = e[0].charAt(0) === "!";
  r.state.inLink = !0;
  let c = r.state.linkEmitted, f = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let d = r.inlineTokens(s), u = r.state.linkEmitted;
  if (r.state.linkEmitted = c, r.state.inLink = !1, !l) {
    if (u) {
      r.state.inRawBlock = f;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return {
    type: l ? "image" : "link",
    raw: n,
    href: a,
    title: o,
    text: s,
    tokens: d
  };
}
function yh(e, t, n) {
  let r = e.match(n.other.indentCodeCompensation);
  if (r === null) return t;
  let i = r[1];
  return t.split(`
`).map((a) => {
    let o = a.match(n.other.beginningSpace);
    if (o === null) return a;
    let [s] = o;
    return a.slice(Math.min(s.length, i.length));
  }).join(`
`);
}
function Hs(e, t, n, r) {
  if (!t.includes("<")) return !1;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === "\\") {
      i++;
      continue;
    }
    if (t[i] === "`") {
      let s = r.inline.code.exec(t.slice(i));
      if (s) {
        i += s[0].length - 1;
        continue;
      }
    }
    if (t[i] !== "<") continue;
    let a = e.slice(n + i), o = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
    if (o) {
      if (o[0].length > t.length - i) return !0;
      i += o[0].length - 1;
    }
  }
  return !1;
}
var Ui = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Fn;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return {
      type: "space",
      raw: t[0]
    };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = this.options.pedantic ? t[0] : js(t[0]);
      return {
        type: "code",
        raw: n,
        codeBlockStyle: "indented",
        text: n.replace(this.rules.other.codeRemoveIndent, "")
      };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], r = yh(n, t[3] || "", this.rules);
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: r
      };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = gn(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (n = r.trim());
      }
      return {
        type: "heading",
        raw: gn(t[0], `
`),
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return {
      type: "hr",
      raw: gn(t[0], `
`)
    };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = gn(t[0], `
`).split(`
`), r = "", i = "", a = [];
      for (; n.length > 0; ) {
        let o = !1, s = [], l = 0;
        for (; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) s.push(n[l]), o = !0;
        else if (!o) s.push(n[l]);
        else break;
        n = n.slice(l);
        let c = s.join(`
`), f = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, i = i ? `${i}
${f}` : f;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, a, !0), this.lexer.state.top = d, n.length === 0) break;
        let u = a.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let p = u, m = n.join(`
`), g = p.raw + `
` + m.replace(this.rules.other.blockquoteSetextReplace2, ""), y = this.blockquote(g);
          a[a.length - 1] = y;
          let h = g.substring(y.raw.length).replace(/^\n/, ""), b = h ? h.split(`
`).length : 0, _ = b ? n.slice(0, -b) : n;
          _.length > 0 && (r = `${r}
${_.join(`
`)}`), i = i.substring(0, i.length - p.text.length) + y.text;
          break;
        } else if (u?.type === "list") {
          let p = u, m = p.raw + `
` + n.join(`
`), g = this.list(m);
          a[a.length - 1] = g, r = r.substring(0, r.length - u.raw.length) + g.raw, i = i.substring(0, i.length - p.raw.length) + g.raw, n = m.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: a,
        text: i
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), r = n.length > 1, i = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let a = this.rules.other.listItemRegex(n), o = !1;
      for (; e; ) {
        let l = !1, c = "", f = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let d = t[2].split(`
`, 1)[0], u = t[1].length, p = this.options.pedantic ? Fs(d, u) : d.replace(this.rules.other.leadingSpaceTab, (h) => Fs(h, u)), m = e.split(`
`, 1)[0], g = !p.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, f = p.trimStart()) : g ? y = u + 1 : (y = p.search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, f = p.slice(y), y += u), g && this.rules.other.blankLine.test(m) && (c += m + `
`, e = e.substring(m.length + 1), l = !0), !l) {
          let h = this.rules.other.nextBulletRegex(y), b = this.rules.other.hrRegex(y), _ = this.rules.other.fencesBeginRegex(y), w = this.rules.other.headingBeginRegex(y), A = this.rules.other.htmlBeginRegex(y), z = this.rules.other.blockquoteBeginRegex(y);
          for (; e; ) {
            let j = e.split(`
`, 1)[0], W;
            if (m = j, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), W = m) : W = m.replace(this.rules.other.leadingSpaceTab, (Q) => Q.replace(this.rules.other.tabCharGlobal, "    ")), _.test(m) || w.test(m) || A.test(m) || z.test(m) || h.test(m) || b.test(m)) break;
            if (W.search(this.rules.other.nonSpaceChar) >= y || !m.trim()) f += `
` + W.slice(y);
            else {
              if (g || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || _.test(p) || w.test(p) || b.test(p)) break;
              f += `
` + m;
            }
            g = !m.trim(), c += j + `
`, e = e.substring(j.length + 1), p = W.slice(y);
          }
        }
        i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (o = !0)), i.items.push({
          type: "list_item",
          raw: c,
          task: !!this.options.gfm && this.rules.other.listIsTask.test(f),
          loose: !1,
          text: f,
          tokens: []
        }), i.raw += c;
      }
      let s = i.items.at(-1);
      if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let l of i.items) if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), !i.loose) {
        let c = l.tokens.filter((f) => f.type === "space");
        i.loose = c.length > 0 && c.some((f) => this.rules.other.anyLine.test(f.raw));
      }
      for (let l of i.items) {
        let c = l.tokens[0];
        if (l.task && (c?.type === "text" || c?.type === "paragraph")) {
          l.text = l.text.replace(this.rules.other.listReplaceTask, ""), c.raw = c.raw.replace(this.rules.other.listReplaceTask, ""), c.text = c.text.replace(this.rules.other.listReplaceTask, "");
          for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
            this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let f = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (f) {
            let d = {
              type: "checkbox",
              raw: f[0] + " ",
              checked: f[0] !== "[ ]"
            };
            l.checked = d.checked, i.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = d.raw + l.tokens[0].raw, l.tokens[0].text = d.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(d)) : l.tokens.unshift({
              type: "paragraph",
              raw: d.raw,
              text: d.raw,
              tokens: [d]
            }) : l.tokens.unshift(d);
          }
        } else l.task && (l.task = !1);
      }
      if (i.loose) for (let l of i.items) {
        l.loose = !0;
        for (let c of l.tokens) c.type === "text" && (c.type = "paragraph");
      }
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let n = js(t[0]);
      return {
        type: "html",
        block: !0,
        raw: n,
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: n
      };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      if (!this.rules.other.startAngleBracket.test(t[2]) && Ws(t[2], "()") !== -1) return;
      let n = Bi(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: gn(t[0], `
`),
        href: r,
        title: i
      };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = Us(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = {
      type: "table",
      raw: gn(t[0], `
`),
      header: [],
      align: [],
      rows: []
    };
    if (n.length === r.length) {
      for (let o of r) this.rules.other.tableAlignRight.test(o) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? a.align.push("left") : a.align.push(null);
      for (let o = 0; o < n.length; o++) a.header.push({
        text: n[o],
        tokens: this.lexer.inline(n[o]),
        header: !0,
        align: a.align[o]
      });
      for (let o of i) a.rows.push(Us(o, a.header.length).map((s, l) => ({
        text: s,
        tokens: this.lexer.inline(s),
        header: !1,
        align: a.align[l]
      })));
      return a;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return {
        type: "heading",
        raw: gn(t[0], `
`),
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return {
      type: "text",
      raw: t[0],
      text: t[0],
      tokens: this.lexer.inline(t[0])
    };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return {
      type: "escape",
      raw: t[0],
      text: t[1]
    };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
      type: "html",
      raw: t[0],
      inLink: this.lexer.state.inLink,
      inRawBlock: this.lexer.state.inRawBlock,
      block: !1,
      text: t[0]
    };
  }
  link(e) {
    if (this.lexer.state.linkParenPossible === !1) return;
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Hs(e, t[1], n, this.rules)) return;
      let r = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let o = gn(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = Ws(t[2], "()");
        if (o === -2) return;
        if (o > -1) {
          let s = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + o;
          t[2] = t[2].substring(0, o), t[0] = t[0].substring(0, s).trim(), t[3] = "";
        }
      }
      let i = t[2], a = "";
      if (this.options.pedantic) {
        let o = this.rules.other.pedanticHrefTitle.exec(i);
        o && (i = o[1], a = o[3]);
      } else a = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), qs(t, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: a && a.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = n[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Hs(e, n[1], r, this.rules)) return;
      let i = t[Bi((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
      if (!i) {
        let a = n[0].charAt(0);
        return {
          type: "text",
          raw: a,
          text: a
        };
      }
      return qs(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
      let i = [...r[0]].length - 1, a, o, s = i, l = 0, c = r[0][0], f = n === c, d = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = d.exec(t)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (o = [...a].length, r[3] || r[4]) {
          s += o;
          continue;
        } else if (r[5] || r[6]) {
          if (i % 3 && !((i + o) % 3)) {
            l += o;
            continue;
          }
          if (f) break;
        }
        if (s -= o, s > 0) continue;
        o = Math.min(o, o + s + l);
        let u = [...r[0]][0].length, p = e.slice(0, i + r.index + u + o);
        if (Math.min(i, o) % 2) {
          let g = p.slice(1, -1);
          return {
            type: "em",
            raw: p,
            text: g,
            tokens: this.lexer.inlineTokens(g)
          };
        }
        let m = p.slice(2, -2);
        return {
          type: "strong",
          raw: p,
          text: m,
          tokens: this.lexer.inlineTokens(m)
        };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && i && (n = n.substring(1, n.length - 1)), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return {
      type: "br",
      raw: t[0]
    };
  }
  del(e, t, n = "") {
    let r = this.rules.inline.delLDelim.exec(e);
    if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let i = [...r[0]].length - 1, a, o, s = i, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = l.exec(t)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (o = [...a].length, o !== i)) continue;
        if (r[3] || r[4]) {
          s += o;
          continue;
        }
        if (s -= o, s > 0) continue;
        o = Math.min(o, o + s);
        let c = [...r[0]][0].length, f = e.slice(0, i + r.index + c + o), d = f.slice(i, -i);
        return {
          type: "del",
          raw: f,
          text: d,
          tokens: this.lexer.inlineTokens(d)
        };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: r,
        autolink: !0,
        tokens: [{
          type: "text",
          raw: n,
          text: n
        }]
      };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, r;
      if (t[2] === "@") n = t[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: n,
        href: r,
        autolink: !0,
        tokens: [{
          type: "text",
          raw: n,
          text: n
        }]
      };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: t[0],
        text: n ? t[0] : mh(t[0]),
        escaped: n
      };
    }
  }
}, Ht = class Ca {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Fn, this.options.tokenizer = this.options.tokenizer || new Ui(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      linkEmitted: !1,
      linkParenPossible: !0,
      top: !0
    };
    let n = {
      other: yt,
      block: gi.normal,
      inline: _r.normal
    };
    this.options.pedantic ? (n.block = gi.pedantic, n.inline = _r.pedantic) : this.options.gfm && (n.block = gi.gfm, this.options.breaks ? n.inline = _r.breaks : n.inline = _r.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return {
      block: gi,
      inline: _r
    };
  }
  static lex(t, n) {
    return new Ca(n).lex(t);
  }
  static lexInline(t, n) {
    return new Ca(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(yt.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (t = t.replace(yt.tabCharGlobal, "    ").replace(yt.spaceLine, ""));
    let i = 1 / 0;
    for (; t; ) {
      if (t.length < i) i = t.length;
      else {
        this.infiniteLoopError(t.charCodeAt(0));
        break;
      }
      let a;
      if (this.options.extensions?.block?.some((s) => (a = s.call({ lexer: this }, t, n)) ? (t = t.substring(a.raw.length), n.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.space(t)) {
        t = t.substring(a.raw.length);
        let s = n.at(-1);
        a.raw.length === 1 && s !== void 0 ? s.raw += `
` : n.push(a);
        continue;
      }
      if (a = this.tokenizer.code(t)) {
        t = t.substring(a.raw.length);
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + a.raw, s.text += `
` + a.text, this.inlineQueue.at(-1).src = s.text) : n.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.list(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.html(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.def(t)) {
        t = t.substring(a.raw.length);
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + a.raw, s.text += `
` + a.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = {
          href: a.href,
          title: a.title
        }, n.push(a));
        continue;
      }
      if (a = this.tokenizer.table(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(t)) {
        t = t.substring(a.raw.length), n.push(a);
        continue;
      }
      let o = t;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, l = t.slice(1), c;
        this.options.extensions.startBlock.forEach((f) => {
          c = f.call({ lexer: this }, l), typeof c == "number" && c >= 0 && (s = Math.min(s, c));
        }), s < 1 / 0 && s >= 0 && (o = t.substring(0, s + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(o))) {
        let s = n.at(-1);
        r && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + a.raw, s.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(a), r = o.length !== t.length, t = t.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(t)) {
        t = t.substring(a.raw.length);
        let s = n.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + a.raw, s.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(a);
        continue;
      }
      if (t) {
        this.infiniteLoopError(t.charCodeAt(0));
        break;
      }
    }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({
      src: t,
      tokens: n
    }), n;
  }
  linkInText(t) {
    if (!t.includes("[")) return !1;
    let n = this.tokenizer.rules.inline.link;
    for (let r of t.matchAll(this.tokenizer.rules.inline.blockSkip)) if (n.test(r[0]) && t.charAt(r.index - 1) !== "!") return !0;
    for (let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let i = r[0], a = i.lastIndexOf("[");
      if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Bi(i.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(i.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(t, n = []) {
    this.tokenizer.lexer = this;
    let r = this.state.linkParenPossible;
    this.state.linkParenPossible = r && t.includes(")");
    try {
      return this.#e(t, n);
    } finally {
      this.state.linkParenPossible = r;
    }
  }
  #e(t, n) {
    let r = t;
    if (this.tokens.links && t.includes("[")) {
      let s = this.tokenizer.rules.inline.reflinkSearch, l = (c) => {
        let f = c.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Bi(c.slice(f + 1, -1)))) return c;
        if (f > 1 && c.charAt(0) !== "!") {
          let d = c.slice(1, f - 1);
          if (this.linkInText(d)) return "[" + d.replace(s, l) + "][" + "a".repeat(c.length - f - 2) + "]";
        }
        return "[" + "a".repeat(c.length - 2) + "]";
      };
      r = r.replace(s, l);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (s) => "+".repeat(s.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (s, l, c) => {
      let f = c ? c.length : 0;
      return s.slice(0, f) + "[" + "a".repeat(s.length - f - 2) + "]";
    }), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let i = !1, a = "", o = 1 / 0;
    for (; t; ) {
      if (t.length < o) o = t.length;
      else {
        this.infiniteLoopError(t.charCodeAt(0));
        break;
      }
      i || (a = ""), i = !1;
      let s;
      if (this.options.extensions?.inline?.some((c) => (s = c.call({ lexer: this }, t, n)) ? (t = t.substring(s.raw.length), n.push(s), !0) : !1)) continue;
      if (s = this.tokenizer.escape(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.tag(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.link(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(s.raw.length);
        let c = n.at(-1);
        s.type === "text" && c?.type === "text" ? (c.raw += s.raw, c.text += s.text) : n.push(s);
        continue;
      }
      if (s = this.tokenizer.emStrong(t, r, a)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.codespan(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.br(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.del(t, r, a)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.autolink(t)) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      if (!this.state.inLink && (s = this.tokenizer.url(t))) {
        t = t.substring(s.raw.length), n.push(s);
        continue;
      }
      let l = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, f = t.slice(1), d;
        this.options.extensions.startInline.forEach((u) => {
          d = u.call({ lexer: this }, f), typeof d == "number" && d >= 0 && (c = Math.min(c, d));
        }), c < 1 / 0 && c >= 0 && (l = t.substring(0, c + 1));
      }
      if (s = this.tokenizer.inlineText(l)) {
        t = t.substring(s.raw.length), s.raw.slice(-1) !== "_" && (a = s.raw.slice(-1)), i = !0;
        let c = n.at(-1);
        c?.type === "text" ? (c.raw += s.raw, c.text += s.text) : n.push(s);
        continue;
      }
      if (t) {
        this.infiniteLoopError(t.charCodeAt(0));
        break;
      }
    }
    return n;
  }
  infiniteLoopError(t) {
    let n = "Infinite loop on byte: " + t;
    if (this.options.silent) console.error(n);
    else throw new Error(n);
  }
}, ji = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Fn;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(yt.notSpaceStart)?.[0], i = e ? e.replace(yt.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + Nt(r) + '">' + (n ? i : Nt(i, !0)) + `</code></pre>
` : "<pre><code>" + (n ? i : Nt(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, r = "";
    for (let o = 0; o < e.items.length; o++) {
      let s = e.items[o];
      r += this.listitem(s);
    }
    let i = t ? "ol" : "ul", a = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + a + `>
` + r + "</" + i + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let i = 0; i < e.rows.length; i++) {
      let a = e.rows[i];
      n = "";
      for (let o = 0; o < a.length; o++) n += this.tablecell(a[o]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${Nt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
    let a = i ? Nt(n, !0) : this.parser.parseInline(r), o = Bs(e);
    if (o === null) return a;
    e = Nt(o, i);
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + Nt(t) + '"'), s += ">" + a + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = Bs(e);
    if (i === null) return Nt(n);
    e = i;
    let a = `<img src="${Nt(e)}" alt="${Nt(n)}"`;
    return t && (a += ` title="${Nt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Nt(e.text);
  }
}, os = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
}, Gt = class Ma {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || Fn, this.options.renderer = this.options.renderer || new ji(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new os();
  }
  static parse(t, n) {
    return new Ma(n).parse(t);
  }
  static parseInline(t, n) {
    return new Ma(n).parseInline(t);
  }
  parse(t) {
    this.renderer.parser = this;
    let n = "";
    for (let r = 0; r < t.length; r++) {
      let i = t[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, s = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (s !== !1 || ![
          "space",
          "hr",
          "heading",
          "code",
          "table",
          "blockquote",
          "list",
          "checkbox",
          "html",
          "def",
          "paragraph",
          "text"
        ].includes(o.type)) {
          n += s || "";
          continue;
        }
      }
      let a = i;
      switch (a.type) {
        case "space":
          n += this.renderer.space(a);
          break;
        case "hr":
          n += this.renderer.hr(a);
          break;
        case "heading":
          n += this.renderer.heading(a);
          break;
        case "code":
          n += this.renderer.code(a);
          break;
        case "table":
          n += this.renderer.table(a);
          break;
        case "blockquote":
          n += this.renderer.blockquote(a);
          break;
        case "list":
          n += this.renderer.list(a);
          break;
        case "checkbox":
          n += this.renderer.checkbox(a);
          break;
        case "html":
          n += this.renderer.html(a);
          break;
        case "def":
          n += this.renderer.def(a);
          break;
        case "paragraph":
          n += this.renderer.paragraph(a);
          break;
        case "text":
          n += this.renderer.text(a);
          break;
        default: {
          let o = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  parseInline(t, n = this.renderer) {
    this.renderer.parser = this;
    let r = "";
    for (let i = 0; i < t.length; i++) {
      let a = t[i];
      if (this.options.extensions?.renderers?.[a.type]) {
        let s = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (s !== !1 || ![
          "escape",
          "html",
          "link",
          "image",
          "checkbox",
          "strong",
          "em",
          "codespan",
          "br",
          "del",
          "text"
        ].includes(a.type)) {
          r += s || "";
          continue;
        }
      }
      let o = a;
      switch (o.type) {
        case "escape":
          r += n.text(o);
          break;
        case "html":
          r += n.html(o);
          break;
        case "link":
          r += n.link(o);
          break;
        case "image":
          r += n.image(o);
          break;
        case "checkbox":
          r += n.checkbox(o);
          break;
        case "strong":
          r += n.strong(o);
          break;
        case "em":
          r += n.em(o);
          break;
        case "codespan":
          r += n.codespan(o);
          break;
        case "br":
          r += n.br(o);
          break;
        case "del":
          r += n.del(o);
          break;
        case "text":
          r += n.text(o);
          break;
        default: {
          let s = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) return console.error(s), "";
          throw new Error(s);
        }
      }
    }
    return r;
  }
}, Ar = class {
  options;
  block;
  constructor(e) {
    this.options = e || Fn;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens",
    "emStrongMask"
  ]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? Ht.lex : Ht.lexInline;
  }
  provideParser(e = this.block) {
    return e ? Gt.parse : Gt.parseInline;
  }
}, _h = class {
  defaults = es();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Gt;
  Renderer = ji;
  TextRenderer = os;
  Lexer = Ht;
  Tokenizer = Ui;
  Hooks = Ar;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
      case "table": {
        let i = r;
        for (let a of i.header) n = n.concat(this.walkTokens(a.tokens, t));
        for (let a of i.rows) for (let o of a) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let i = r;
        n = n.concat(this.walkTokens(i.items, t));
        break;
      }
      default: {
        let i = r;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((a) => {
          let o = i[a].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || {
      renderers: {},
      childTokens: {}
    };
    return e.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let a = t.renderers[i.name];
          a ? t.renderers[i.name] = function(...o) {
            let s = i.renderer.apply(this, o);
            return s === !1 && (s = a.apply(this, o)), s;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = t[i.level];
          a ? a.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), r.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new ji(this.defaults);
        for (let a in n.renderer) {
          if (!(a in i)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let o = a, s = n.renderer[o], l = i[o];
          i[o] = (...c) => {
            let f = s.apply(i, c);
            return f === !1 && (f = l.apply(i, c)), f || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new Ui(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in i)) throw new Error(`tokenizer '${a}' does not exist`);
          if ([
            "options",
            "rules",
            "lexer"
          ].includes(a)) continue;
          let o = a, s = n.tokenizer[o], l = i[o];
          i[o] = (...c) => {
            let f = s.apply(i, c);
            return f === !1 && (f = l.apply(i, c)), f;
          };
        }
        r.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new Ar();
        for (let a in n.hooks) {
          if (!(a in i)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let o = a, s = n.hooks[o], l = i[o];
          Ar.passThroughHooks.has(a) ? i[o] = (c) => {
            if (this.defaults.async && Ar.passThroughHooksRespectAsync.has(a)) return (async () => {
              let d = await s.call(i, c);
              return l.call(i, d);
            })();
            let f = s.call(i, c);
            return l.call(i, f);
          } : i[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let d = await s.apply(i, c);
              return d === !1 && (d = await l.apply(i, c)), d;
            })();
            let f = s.apply(i, c);
            return f === !1 && (f = l.apply(i, c)), f;
          };
        }
        r.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, a = n.walkTokens;
        r.walkTokens = function(o) {
          let s = [];
          return s.push(a.call(this, o)), i && (s = s.concat(i.call(this, o))), s;
        };
      }
      this.defaults = {
        ...this.defaults,
        ...r
      };
    }), this;
  }
  setOptions(e) {
    return this.defaults = {
      ...this.defaults,
      ...e
    }, this;
  }
  lexer(e, t) {
    return Ht.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Gt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let r = { ...n }, i = {
        ...this.defaults,
        ...r
      }, a = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
        let o = i.hooks ? await i.hooks.preprocess(t) : t, s = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Ht.lex : Ht.lexInline)(o, i), l = i.hooks ? await i.hooks.processAllTokens(s) : s;
        i.walkTokens && await Promise.all(this.walkTokens(l, i.walkTokens));
        let c = await (i.hooks ? await i.hooks.provideParser(e) : e ? Gt.parse : Gt.parseInline)(l, i);
        return i.hooks ? await i.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        i.hooks && (t = i.hooks.preprocess(t));
        let o = (i.hooks ? i.hooks.provideLexer(e) : e ? Ht.lex : Ht.lexInline)(t, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let s = (i.hooks ? i.hooks.provideParser(e) : e ? Gt.parse : Gt.parseInline)(o, i);
        return i.hooks && (s = i.hooks.postprocess(s)), s;
      } catch (o) {
        return a(o);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let r = "<p>An error occurred:</p><pre>" + Nt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Wn = new _h();
function Oe(e, t) {
  return Wn.parse(e, t);
}
Oe.options = Oe.setOptions = function(e) {
  return Wn.setOptions(e), Oe.defaults = Wn.defaults, ll(Oe.defaults), Oe;
};
Oe.getDefaults = es;
Oe.defaults = Fn;
function bh(...e) {
  return Wn.use(...e), Oe.defaults = Wn.defaults, ll(Oe.defaults), Oe;
}
Oe.use = bh;
Oe.walkTokens = function(e, t) {
  return Wn.walkTokens(e, t);
};
Oe.parseInline = Wn.parseInline;
Oe.Parser = Gt;
Oe.parser = Gt.parse;
Oe.Renderer = ji;
Oe.TextRenderer = os;
Oe.Lexer = Ht;
Oe.lexer = Ht.lex;
Oe.Tokenizer = Ui;
Oe.Hooks = Ar;
Oe.parse = Oe;
var od = Oe.options, ld = Oe.setOptions, cd = Oe.walkTokens, ud = Oe.parseInline, hd = Gt.parse, fd = Ht.lex, yl = `var hi = Object.create, vn = Object.defineProperty, pi = Object.getOwnPropertyDescriptor, fi = Object.getOwnPropertyNames, gi = Object.getPrototypeOf, Gr = Object.prototype.hasOwnProperty, di = (t, e) => () => (e || (t((e = { exports: {} }).exports, e), t = null), e.exports), mi = (t, e) => {
	let n = {};
	for (var r in t) vn(n, r, {
		get: t[r],
		enumerable: !0
	});
	return e || vn(n, Symbol.toStringTag, { value: "Module" }), n;
}, _i = (t, e, n, r) => {
	if (e && typeof e == "object" || typeof e == "function") for (var i = fi(e), s = 0, c = i.length, a; s < c; s++) a = i[s], !Gr.call(t, a) && a !== n && vn(t, a, {
		get: ((p) => e[p]).bind(null, a),
		enumerable: !(r = pi(e, a)) || r.enumerable
	});
	return t;
}, bi = (t, e, n) => (n = t != null ? hi(gi(t)) : {}, _i(e || !t || !t.__esModule || !Gr.call(t, "default") ? vn(n, "default", {
	value: t,
	enumerable: !0
}) : n, t)), mr = /* @__PURE__ */ mi({
	Hooks: () => Ot,
	Lexer: () => Re,
	Marked: () => ti,
	Parser: () => Oe,
	Renderer: () => nn,
	TextRenderer: () => Nn,
	Tokenizer: () => tn,
	defaults: () => st,
	getDefaults: () => Pn,
	lexer: () => bs,
	marked: () => j,
	options: () => ps,
	parse: () => ms,
	parseInline: () => ds,
	parser: () => _s,
	setOptions: () => fs,
	use: () => ni,
	walkTokens: () => gs
});
function Pn() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var st = Pn();
function qr(t) {
	st = t;
}
var _t = { exec: () => null };
function St(t) {
	let e = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = e[r];
		return i || (i = t(r), e[r] = i), i;
	};
}
function L(t, e = "") {
	let n = typeof t == "string" ? t : t.source, r = {
		replace: (i, s) => {
			let c = typeof s == "string" ? s : s.source;
			return c = c.replace(oe.caret, "$1"), n = n.replace(i, c), r;
		},
		getRegex: () => new RegExp(n, e)
	};
	return r;
}
var xi = ((t = "") => {
	try {
		return !!new RegExp("(?<=1)(?<!1)" + t);
	} catch {
		return !1;
	}
})(), oe = {
	codeRemoveIndent: /^(?: {0,3}\\t| {1,4})/gm,
	outputLinkReplace: /\\\\([\\[\\]])/g,
	indentCodeCompensation: /^(\\s+)(?:\`\`\`)/,
	beginningSpace: /^\\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \\t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\\n/g,
	tabCharGlobal: /\\t/g,
	leadingSpaceTab: /^[ \\t]+/,
	multipleSpaceGlobal: /\\s+/g,
	blankLine: /^[ \\t]*$/,
	doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\\[[ xX]\\] +\\S/,
	listReplaceTask: /^\\[[ xX]\\] +/,
	listTaskCheckbox: /\\[[ xX]\\]/,
	anyLine: /\\n.*\\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\\||\\| *$/g,
	tableRowBlankLine: /\\n[ \\t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i,
	endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/,
	unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u,
	numericCharacterReference: /&#(?:(\\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g,
	caret: /(^|[^\\[])\\^/g,
	percentDecode: /%25/g,
	findPipe: /\\|/g,
	splitPipe: / \\|/,
	slashPipe: /\\\\\\|/g,
	carriageReturn: /\\r\\n|\\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\\S*/,
	endingNewline: /\\n$/,
	listItemRegex: (t) => new RegExp(\`^( {0,3}\${t})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`),
	nextBulletRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`)),
	hrRegex: St((t) => new RegExp(\`^ {0,\${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\\\*[ 	]*){3,})(?:\\\\n+|$)\`)),
	fencesBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:\\\`\\\`\\\`|~~~)\`)),
	headingBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}#\`)),
	htmlBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:</?(?:\${sn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))\`, "i")),
	blockquoteBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}>\`))
}, yi = /^(?:[ \\t]*(?:\\n|$))+/, ki = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, wi = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, rn = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ti = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, nr = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, Zr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |fences|blockquote|heading|hr|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, Vr = L(Zr).replace(/bull/g, nr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Ei = L(Zr).replace(/bull/g, nr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), rr = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \\t]+\\n)[^\\n]+)*)/, Ai = /^[^\\n]+/, ir = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Si = L(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", ir).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), vi = L(/^(bull)([ \\t][^\\n]*?)?(?:\\n|$)/).replace(/bull/g, nr).getRegex(), sn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", sr = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ri = L("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n*|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>[^\\\\n]*\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>[^\\\\n]*\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>[^\\\\n]*\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", sr).replace("tag", sn).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), Xr = (t) => L(rr).replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", t).replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), Oi = Xr(/ {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]/), Mi = Xr(/ {0,3}(?:[*+-]|\\d{1,9}[.)])(?:[ \\t]|\\n|$)/), or = {
	blockquote: L(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", Mi).getRegex(),
	code: ki,
	def: Si,
	fences: wi,
	heading: Ti,
	hr: rn,
	html: Ri,
	lheading: Vr,
	list: vi,
	newline: yi,
	paragraph: Oi,
	table: _t,
	text: Ai
}, _r = L("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), Pi = {
	...or,
	lheading: Ei,
	table: _r,
	paragraph: L(rr).replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", _r).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]+[^ \\\\t\\\\n]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex()
}, Ni = {
	...or,
	html: L(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", sr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(),
	def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\\n+|$)/,
	fences: _t,
	lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,
	paragraph: L(rr).replace("hr", rn).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", Vr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Li = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Ci = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, Yr = /^( {2,}|\\\\)\\n(?!\\s*$)[ \\t]*/, Ii = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, He = /[\\p{P}\\p{S}]/u, Pt = /[\\s\\p{P}\\p{S}]/u, on = /[^\\s\\p{P}\\p{S}]/u, Di = L(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Pt).getRegex(), zi = /[\\p{Pi}\\p{Ps}"']/u, Kr = /(?!~)[\\p{P}\\p{S}]/u, $i = /(?!~)[\\s\\p{P}\\p{S}]/u, Bi = /(?:[^\\s\\p{P}\\p{S}]|~)/u, Ui = L(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", xi ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Qr = /^(?:\\*+(?:((?!\\*)punct)|([^\\s*]))?)|^_+(?:((?!_)punct)|([^\\s_]))?/, ji = L(Qr, "u").replace(/punct/g, He).getRegex(), Fi = L(Qr, "u").replace(/punct/g, Kr).getRegex(), Hi = L(/^(?:\\*+(?:((?!\\*)(?!openQuote)punct)|([^\\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\\s_]))?/, "u").replace(/openQuote/g, zi).replace(/punct/g, He).getRegex(), Jr = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Wi = L(Jr, "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Gi = L(Jr, "gu").replace(/notPunctSpace/g, Bi).replace(/punctSpace/g, $i).replace(/punct/g, Kr).getRegex(), qi = L("^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)[\\\\s](\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|(?:(?!\\\\*)punct|notPunctSpace)(\\\\*+)(?!\\\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Zi = L("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Vi = L("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\\\s](_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Xi = L(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, He).getRegex(), Yi = L("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Ki = L(/\\\\(punct)/, "gu").replace(/punct/g, He).getRegex(), Qi = L(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ji = L(sr).replace("(?:-->|$)", "-->").getRegex(), es = L("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", Ji).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), ei = /\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]/, Rn = L(/(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\])|[^\\[\\]\\\\\`])*?/).replace("brackets", ei).getRegex(), ts = L(/^!?\\[(label)\\]\\([ \\t\\n]*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?[ \\t\\n]*\\)/).replace("label", Rn).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]+|(?=\\))/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), ns = L(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", Rn).replace("ref", ir).getRegex(), rs = L(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", ir).getRegex(), br = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\]){1,999}/, is = L(/(?:[^\\[\\]\\\\\`]*(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\]))){0,999}?[^\\[\\]\\\\\`]*?/).replace("brackets", ei).getRegex(), ss = L("reflink|nolink(?!\\\\()", "g").replace("reflink", L(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", is).replace("ref", br).getRegex()).replace("nolink", L(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", br).getRegex()).getRegex(), xr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, os = L(/(?:mailto:email|xmpp:email(?:\\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(), ar = {
	_backpedal: _t,
	anyPunctuation: Ki,
	autolink: Qi,
	blockSkip: Ui,
	br: Yr,
	code: Ci,
	del: _t,
	delLDelim: _t,
	delRDelim: _t,
	emStrongLDelim: ji,
	emStrongRDelimAst: Wi,
	emStrongRDelimUnd: Zi,
	escape: Li,
	link: ts,
	nolink: rs,
	punctuation: Di,
	reflink: ns,
	reflinkSearch: ss,
	tag: es,
	text: Ii,
	url: _t
}, as = {
	...ar,
	emStrongLDelim: Hi,
	emStrongRDelimAst: qi,
	emStrongRDelimUnd: Vi,
	link: L(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", Rn).getRegex(),
	reflink: L(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", Rn).getRegex()
}, Kn = {
	...ar,
	emStrongRDelimAst: Gi,
	emStrongLDelim: Fi,
	delLDelim: Xi,
	delRDelim: Yi,
	url: L(/^emailProtocol|^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("emailProtocol", os).replace("protocol", xr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/,
	text: L(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(\`+|~+|[^\`~])(?:(?=[\`~])|(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@))))/).replace("protocol", xr).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, ls = {
	...Kn,
	br: L(Yr).replace("{2,}", "*").getRegex(),
	text: L(Kn.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex()
}, Tn = {
	normal: or,
	gfm: Pi,
	pedantic: Ni
}, Xt = {
	normal: ar,
	gfm: Kn,
	breaks: ls,
	pedantic: as
}, cs = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\\"": "&quot;",
	"'": "&#39;"
}, yr = (t) => cs[t];
function we(t, e) {
	if (e) {
		if (oe.escapeTest.test(t)) return t.replace(oe.escapeReplace, yr);
	} else if (oe.escapeTestNoEncode.test(t)) return t.replace(oe.escapeReplaceNoEncode, yr);
	return t;
}
function us(t) {
	return t.replace(oe.numericCharacterReference, (e, n, r) => {
		let i = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
		return i === 0 || i > 1114111 || i >= 55296 && i <= 57343 ? "�" : String.fromCodePoint(i);
	});
}
function kr(t) {
	try {
		t = encodeURI(t).replace(oe.percentDecode, "%");
	} catch {
		return null;
	}
	return t;
}
function wr(t, e) {
	let n = t.replace(oe.findPipe, (i, s, c) => {
		let a = !1, p = s;
		for (; --p >= 0 && c[p] === "\\\\";) a = !a;
		return a ? "|" : " |";
	}).split(oe.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
	else for (; n.length < e;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(oe.slashPipe, "|");
	return n;
}
function et(t, e, n) {
	let r = t.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let s = t.charAt(r - i - 1);
		if (s === e && !n) i++;
		else if (s !== e && n) i++;
		else break;
	}
	return t.slice(0, r - i);
}
function Tr(t) {
	let e = t.split(\`
\`), n = e.length - 1;
	for (; n >= 0 && oe.blankLine.test(e[n]);) n--;
	return e.length - n <= 2 ? t : e.slice(0, n + 1).join(\`
\`);
}
function On(t) {
	return t.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Er(t, e) {
	if (t.indexOf(e[0]) === -1 && t.indexOf(e[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < t.length; r++) if (t[r] === "\\\\") r++;
	else if (t[r] === e[0]) n++;
	else if (t[r] === e[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Ar(t, e = 0) {
	let n = e, r = "";
	for (let i of t) if (i === "	") {
		let s = 4 - n % 4;
		r += " ".repeat(s), n += s;
	} else r += i, n++;
	return r;
}
function Sr(t, e, n, r, i) {
	let s = e.href, c = e.title || null, a = t[1].replace(i.other.outputLinkReplace, "$1"), p = t[0].charAt(0) === "!";
	r.state.inLink = !0;
	let f = r.state.linkEmitted, b = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let T = r.inlineTokens(a), S = r.state.linkEmitted;
	if (r.state.linkEmitted = f, r.state.inLink = !1, !p) {
		if (S) {
			r.state.inRawBlock = b;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: p ? "image" : "link",
		raw: n,
		href: s,
		title: c,
		text: a,
		tokens: T
	};
}
function hs(t, e, n) {
	let r = t.match(n.other.indentCodeCompensation);
	if (r === null) return e;
	let i = r[1];
	return e.split(\`
\`).map((s) => {
		let c = s.match(n.other.beginningSpace);
		if (c === null) return s;
		let [a] = c;
		return s.slice(Math.min(a.length, i.length));
	}).join(\`
\`);
}
function vr(t, e, n, r) {
	if (!e.includes("<")) return !1;
	for (let i = 0; i < e.length; i++) {
		if (e[i] === "\\\\") {
			i++;
			continue;
		}
		if (e[i] === "\`") {
			let a = r.inline.code.exec(e.slice(i));
			if (a) {
				i += a[0].length - 1;
				continue;
			}
		}
		if (e[i] !== "<") continue;
		let s = t.slice(n + i), c = r.inline.tag.exec(s) || r.inline.autolink.exec(s);
		if (c) {
			if (c[0].length > e.length - i) return !0;
			i += c[0].length - 1;
		}
	}
	return !1;
}
var tn = class {
	options;
	rules;
	lexer;
	constructor(t) {
		this.options = t || st;
	}
	space(t) {
		let e = this.rules.block.newline.exec(t);
		if (e && e[0].length > 0) return {
			type: "space",
			raw: e[0]
		};
	}
	code(t) {
		let e = this.rules.block.code.exec(t);
		if (e) {
			let n = this.options.pedantic ? e[0] : Tr(e[0]);
			return {
				type: "code",
				raw: n,
				codeBlockStyle: "indented",
				text: n.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(t) {
		let e = this.rules.block.fences.exec(t);
		if (e) {
			let n = e[0], r = hs(n, e[3] || "", this.rules);
			return {
				type: "code",
				raw: n,
				lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
				text: r
			};
		}
	}
	heading(t) {
		let e = this.rules.block.heading.exec(t);
		if (e) {
			let n = e[2].trim();
			if (this.rules.other.endingHash.test(n)) {
				let r = et(n, "#");
				(this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (n = r.trim());
			}
			return {
				type: "heading",
				raw: et(e[0], \`
\`),
				depth: e[1].length,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	hr(t) {
		let e = this.rules.block.hr.exec(t);
		if (e) return {
			type: "hr",
			raw: et(e[0], \`
\`)
		};
	}
	blockquote(t) {
		let e = this.rules.block.blockquote.exec(t);
		if (e) {
			let n = et(e[0], \`
\`).split(\`
\`), r = "", i = "", s = [];
			for (; n.length > 0;) {
				let c = !1, a = [], p = 0;
				for (; p < n.length; p++) if (this.rules.other.blockquoteStart.test(n[p])) a.push(n[p]), c = !0;
				else if (!c) a.push(n[p]);
				else break;
				n = n.slice(p);
				let f = a.join(\`
\`), b = f.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
				r = r ? \`\${r}
\${f}\` : f, i = i ? \`\${i}
\${b}\` : b;
				let T = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(b, s, !0), this.lexer.state.top = T, n.length === 0) break;
				let S = s.at(-1);
				if (S?.type === "code") break;
				if (S?.type === "blockquote") {
					let C = S, v = n.join(\`
\`), z = C.raw + \`
\` + v.replace(this.rules.other.blockquoteSetextReplace2, ""), O = this.blockquote(z);
					s[s.length - 1] = O;
					let W = z.substring(O.raw.length).replace(/^\\n/, ""), re = W ? W.split(\`
\`).length : 0, ie = re ? n.slice(0, -re) : n;
					ie.length > 0 && (r = \`\${r}
\${ie.join(\`
\`)}\`), i = i.substring(0, i.length - C.text.length) + O.text;
					break;
				} else if (S?.type === "list") {
					let C = S, v = C.raw + \`
\` + n.join(\`
\`), z = this.list(v);
					s[s.length - 1] = z, r = r.substring(0, r.length - S.raw.length) + z.raw, i = i.substring(0, i.length - C.raw.length) + z.raw, n = v.substring(s.at(-1).raw.length).split(\`
\`);
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: r,
				tokens: s,
				text: i
			};
		}
	}
	list(t) {
		let e = this.rules.block.list.exec(t);
		if (e) {
			let n = e[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? \`\\\\d{1,9}\\\\\${n.slice(-1)}\` : \`\\\\\${n}\`, this.options.pedantic && (n = r ? n : "[*+-]");
			let s = this.rules.other.listItemRegex(n), c = !1;
			for (; t;) {
				let p = !1, f = "", b = "";
				if (!(e = s.exec(t)) || this.rules.block.hr.test(t)) break;
				f = e[0], t = t.substring(f.length);
				let T = e[2].split(\`
\`, 1)[0], S = e[1].length, C = this.options.pedantic ? Ar(T, S) : T.replace(this.rules.other.leadingSpaceTab, (W) => Ar(W, S)), v = t.split(\`
\`, 1)[0], z = !C.trim(), O = 0;
				if (this.options.pedantic ? (O = 2, b = C.trimStart()) : z ? O = S + 1 : (O = C.search(this.rules.other.nonSpaceChar), O = O > 4 ? 1 : O, b = C.slice(O), O += S), z && this.rules.other.blankLine.test(v) && (f += v + \`
\`, t = t.substring(v.length + 1), p = !0), !p) {
					let W = this.rules.other.nextBulletRegex(O), re = this.rules.other.hrRegex(O), ie = this.rules.other.fencesBeginRegex(O), me = this.rules.other.headingBeginRegex(O), Ne = this.rules.other.htmlBeginRegex(O), We = this.rules.other.blockquoteBeginRegex(O);
					for (; t;) {
						let _e = t.split(\`
\`, 1)[0], Me;
						if (v = _e, this.options.pedantic ? (v = v.replace(this.rules.other.listReplaceNesting, "  "), Me = v) : Me = v.replace(this.rules.other.leadingSpaceTab, (te) => te.replace(this.rules.other.tabCharGlobal, "    ")), ie.test(v) || me.test(v) || Ne.test(v) || We.test(v) || W.test(v) || re.test(v)) break;
						if (Me.search(this.rules.other.nonSpaceChar) >= O || !v.trim()) b += \`
\` + Me.slice(O);
						else {
							if (z || C.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ie.test(C) || me.test(C) || re.test(C)) break;
							b += \`
\` + v;
						}
						z = !v.trim(), f += _e + \`
\`, t = t.substring(_e.length + 1), C = Me.slice(O);
					}
				}
				i.loose || (c ? i.loose = !0 : this.rules.other.doubleBlankLine.test(f) && (c = !0)), i.items.push({
					type: "list_item",
					raw: f,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(b),
					loose: !1,
					text: b,
					tokens: []
				}), i.raw += f;
			}
			let a = i.items.at(-1);
			if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let p of i.items) if (this.lexer.state.top = !1, p.tokens = this.lexer.blockTokens(p.text, []), !i.loose) {
				let f = p.tokens.filter((b) => b.type === "space");
				i.loose = f.length > 0 && f.some((b) => this.rules.other.anyLine.test(b.raw));
			}
			for (let p of i.items) {
				let f = p.tokens[0];
				if (p.task && (f?.type === "text" || f?.type === "paragraph")) {
					p.text = p.text.replace(this.rules.other.listReplaceTask, ""), f.raw = f.raw.replace(this.rules.other.listReplaceTask, ""), f.text = f.text.replace(this.rules.other.listReplaceTask, "");
					for (let T = this.lexer.inlineQueue.length - 1; T >= 0; T--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[T].src)) {
						this.lexer.inlineQueue[T].src = this.lexer.inlineQueue[T].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let b = this.rules.other.listTaskCheckbox.exec(p.raw);
					if (b) {
						let T = {
							type: "checkbox",
							raw: b[0] + " ",
							checked: b[0] !== "[ ]"
						};
						p.checked = T.checked, i.loose ? p.tokens[0] && ["paragraph", "text"].includes(p.tokens[0].type) && "tokens" in p.tokens[0] && p.tokens[0].tokens ? (p.tokens[0].raw = T.raw + p.tokens[0].raw, p.tokens[0].text = T.raw + p.tokens[0].text, p.tokens[0].tokens.unshift(T)) : p.tokens.unshift({
							type: "paragraph",
							raw: T.raw,
							text: T.raw,
							tokens: [T]
						}) : p.tokens.unshift(T);
					}
				} else p.task && (p.task = !1);
			}
			if (i.loose) for (let p of i.items) {
				p.loose = !0;
				for (let f of p.tokens) f.type === "text" && (f.type = "paragraph");
			}
			return i;
		}
	}
	html(t) {
		let e = this.rules.block.html.exec(t);
		if (e) {
			let n = Tr(e[0]);
			return {
				type: "html",
				block: !0,
				raw: n,
				pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
				text: n
			};
		}
	}
	def(t) {
		let e = this.rules.block.def.exec(t);
		if (e) {
			if (!this.rules.other.startAngleBracket.test(e[2]) && Er(e[2], "()") !== -1) return;
			let n = On(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
			return {
				type: "def",
				tag: n,
				raw: et(e[0], \`
\`),
				href: r,
				title: i
			};
		}
	}
	table(t) {
		let e = this.rules.block.table.exec(t);
		if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
		let n = wr(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], s = {
			type: "table",
			raw: et(e[0], \`
\`),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let c of r) this.rules.other.tableAlignRight.test(c) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? s.align.push("left") : s.align.push(null);
			for (let c = 0; c < n.length; c++) s.header.push({
				text: n[c],
				tokens: this.lexer.inline(n[c]),
				header: !0,
				align: s.align[c]
			});
			for (let c of i) s.rows.push(wr(c, s.header.length).map((a, p) => ({
				text: a,
				tokens: this.lexer.inline(a),
				header: !1,
				align: s.align[p]
			})));
			return s;
		}
	}
	lheading(t) {
		let e = this.rules.block.lheading.exec(t);
		if (e) {
			let n = e[1].trim();
			return {
				type: "heading",
				raw: et(e[0], \`
\`),
				depth: e[2].charAt(0) === "=" ? 1 : 2,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	paragraph(t) {
		let e = this.rules.block.paragraph.exec(t);
		if (e) {
			let n = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
			return {
				type: "paragraph",
				raw: e[0],
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	text(t) {
		let e = this.rules.block.text.exec(t);
		if (e) return {
			type: "text",
			raw: e[0],
			text: e[0],
			tokens: this.lexer.inline(e[0])
		};
	}
	escape(t) {
		let e = this.rules.inline.escape.exec(t);
		if (e) return {
			type: "escape",
			raw: e[0],
			text: e[1]
		};
	}
	tag(t) {
		let e = this.rules.inline.tag.exec(t);
		if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: e[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: e[0]
		};
	}
	link(t) {
		if (this.lexer.state.linkParenPossible === !1) return;
		let e = this.rules.inline.link.exec(t);
		if (e) {
			let n = e[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && vr(t, e[1], n, this.rules)) return;
			let r = e[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let c = et(r.slice(0, -1), "\\\\");
				if ((r.length - c.length) % 2 === 0) return;
			} else {
				let c = Er(e[2], "()");
				if (c === -2) return;
				if (c > -1) {
					let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + c;
					e[2] = e[2].substring(0, c), e[0] = e[0].substring(0, a).trim(), e[3] = "";
				}
			}
			let i = e[2], s = "";
			if (this.options.pedantic) {
				let c = this.rules.other.pedanticHrefTitle.exec(i);
				c && (i = c[1], s = c[3]);
			} else s = e[3] ? e[3].slice(1, -1) : "";
			return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Sr(e, {
				href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
				title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
			}, e[0], this.lexer, this.rules);
		}
	}
	reflink(t, e) {
		let n;
		if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && vr(t, n[1], r, this.rules)) return;
			let i = e[On((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
			if (!i) {
				let s = n[0].charAt(0);
				return {
					type: "text",
					raw: s,
					text: s
				};
			}
			return Sr(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(t, e, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(t);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, c, a = i, p = 0, f = r[0][0], b = n === f, T = f === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (T.lastIndex = 0, e = e.slice(-1 * t.length + i); (r = T.exec(e)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s) continue;
				if (c = [...s].length, r[3] || r[4]) {
					a += c;
					continue;
				} else if (r[5] || r[6]) {
					if (i % 3 && !((i + c) % 3)) {
						p += c;
						continue;
					}
					if (b) break;
				}
				if (a -= c, a > 0) continue;
				c = Math.min(c, c + a + p);
				let S = [...r[0]][0].length, C = t.slice(0, i + r.index + S + c);
				if (Math.min(i, c) % 2) {
					let z = C.slice(1, -1);
					return {
						type: "em",
						raw: C,
						text: z,
						tokens: this.lexer.inlineTokens(z)
					};
				}
				let v = C.slice(2, -2);
				return {
					type: "strong",
					raw: C,
					text: v,
					tokens: this.lexer.inlineTokens(v)
				};
			}
		}
	}
	codespan(t) {
		let e = this.rules.inline.code.exec(t);
		if (e) {
			let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
			return r && i && (n = n.substring(1, n.length - 1)), {
				type: "codespan",
				raw: e[0],
				text: n
			};
		}
	}
	br(t) {
		let e = this.rules.inline.br.exec(t);
		if (e) return {
			type: "br",
			raw: e[0]
		};
	}
	del(t, e, n = "") {
		let r = this.rules.inline.delLDelim.exec(t);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, c, a = i, p = this.rules.inline.delRDelim;
			for (p.lastIndex = 0, e = e.slice(-1 * t.length + i); (r = p.exec(e)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s || (c = [...s].length, c !== i)) continue;
				if (r[3] || r[4]) {
					a += c;
					continue;
				}
				if (a -= c, a > 0) continue;
				c = Math.min(c, c + a);
				let f = [...r[0]][0].length, b = t.slice(0, i + r.index + f + c), T = b.slice(i, -i);
				return {
					type: "del",
					raw: b,
					text: T,
					tokens: this.lexer.inlineTokens(T)
				};
			}
		}
	}
	autolink(t) {
		let e = this.rules.inline.autolink.exec(t);
		if (e) {
			let n, r;
			return e[2] === "@" ? (n = e[1], r = "mailto:" + n) : (n = e[1], r = n), {
				type: "link",
				raw: e[0],
				text: n,
				href: r,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	url(t) {
		let e;
		if (e = this.rules.inline.url.exec(t)) {
			let n, r;
			if (e[2] === "@") n = e[0], r = "mailto:" + n;
			else {
				let i;
				do
					i = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
				while (i !== e[0]);
				n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
			}
			return {
				type: "link",
				raw: e[0],
				text: n,
				href: r,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	inlineText(t) {
		let e = this.rules.inline.text.exec(t);
		if (e) {
			let n = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: e[0],
				text: n ? e[0] : us(e[0]),
				escaped: n
			};
		}
	}
}, Re = class Qn {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || st, this.options.tokenizer = this.options.tokenizer || new tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			linkParenPossible: !0,
			top: !0
		};
		let n = {
			other: oe,
			block: Tn.normal,
			inline: Xt.normal
		};
		this.options.pedantic ? (n.block = Tn.pedantic, n.inline = Xt.pedantic) : this.options.gfm && (n.block = Tn.gfm, this.options.breaks ? n.inline = Xt.breaks : n.inline = Xt.gfm), this.tokenizer.rules = n;
	}
	static get rules() {
		return {
			block: Tn,
			inline: Xt
		};
	}
	static lex(e, n) {
		return new Qn(n).lex(e);
	}
	static lexInline(e, n) {
		return new Qn(n).inlineTokens(e);
	}
	lex(e) {
		e = e.replace(oe.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
		for (let n = 0; n < this.inlineQueue.length; n++) {
			let r = this.inlineQueue[n];
			this.inlineTokens(r.src, r.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, n = [], r = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(oe.tabCharGlobal, "    ").replace(oe.spaceLine, ""));
		let i = 1 / 0;
		for (; e;) {
			if (e.length < i) i = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let s;
			if (this.options.extensions?.block?.some((a) => (s = a.call({ lexer: this }, e, n)) ? (e = e.substring(s.raw.length), n.push(s), !0) : !1)) continue;
			if (s = this.tokenizer.space(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				s.raw.length === 1 && a !== void 0 ? a.raw += \`
\` : n.push(s);
				continue;
			}
			if (s = this.tokenizer.code(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.at(-1).src = a.text) : n.push(s);
				continue;
			}
			if (s = this.tokenizer.fences(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.heading(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.hr(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.blockquote(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.list(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.html(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.def(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
					href: s.href,
					title: s.title
				}, n.push(s));
				continue;
			}
			if (s = this.tokenizer.table(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.lheading(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			let c = e;
			if (this.options.extensions?.startBlock) {
				let a = 1 / 0, p = e.slice(1), f;
				this.options.extensions.startBlock.forEach((b) => {
					f = b.call({ lexer: this }, p), typeof f == "number" && f >= 0 && (a = Math.min(a, f));
				}), a < 1 / 0 && a >= 0 && (c = e.substring(0, a + 1));
			}
			if (this.state.top && (s = this.tokenizer.paragraph(c))) {
				let a = n.at(-1);
				r && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(s), r = c.length !== e.length, e = e.substring(s.raw.length);
				continue;
			}
			if (s = this.tokenizer.text(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(s);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, n;
	}
	inline(e, n = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: n
		}), n;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let n = this.tokenizer.rules.inline.link;
		for (let r of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (n.test(r[0]) && e.charAt(r.index - 1) !== "!") return !0;
		for (let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let i = r[0], s = i.lastIndexOf("[");
			if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, On(i.slice(s + 1, -1)))) && !(s > 1 && this.linkInText(i.slice(1, s - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, n = []) {
		this.tokenizer.lexer = this;
		let r = this.state.linkParenPossible;
		this.state.linkParenPossible = r && e.includes(")");
		try {
			return this.#e(e, n);
		} finally {
			this.state.linkParenPossible = r;
		}
	}
	#e(e, n) {
		let r = e;
		if (this.tokens.links && e.includes("[")) {
			let a = this.tokenizer.rules.inline.reflinkSearch, p = (f) => {
				let b = f.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, On(f.slice(b + 1, -1)))) return f;
				if (b > 1 && f.charAt(0) !== "!") {
					let T = f.slice(1, b - 1);
					if (this.linkInText(T)) return "[" + T.replace(a, p) + "][" + "a".repeat(f.length - b - 2) + "]";
				}
				return "[" + "a".repeat(f.length - 2) + "]";
			};
			r = r.replace(a, p);
		}
		r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (a) => "+".repeat(a.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (a, p, f) => {
			let b = f ? f.length : 0;
			return a.slice(0, b) + "[" + "a".repeat(a.length - b - 2) + "]";
		}), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
		let i = !1, s = "", c = 1 / 0;
		for (; e;) {
			if (e.length < c) c = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			i || (s = ""), i = !1;
			let a;
			if (this.options.extensions?.inline?.some((f) => (a = f.call({ lexer: this }, e, n)) ? (e = e.substring(a.raw.length), n.push(a), !0) : !1)) continue;
			if (a = this.tokenizer.escape(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.tag(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.link(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(a.raw.length);
				let f = n.at(-1);
				a.type === "text" && f?.type === "text" ? (f.raw += a.raw, f.text += a.text) : n.push(a);
				continue;
			}
			if (a = this.tokenizer.emStrong(e, r, s)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.codespan(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.br(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.del(e, r, s)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.autolink(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (!this.state.inLink && (a = this.tokenizer.url(e))) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			let p = e;
			if (this.options.extensions?.startInline) {
				let f = 1 / 0, b = e.slice(1), T;
				this.options.extensions.startInline.forEach((S) => {
					T = S.call({ lexer: this }, b), typeof T == "number" && T >= 0 && (f = Math.min(f, T));
				}), f < 1 / 0 && f >= 0 && (p = e.substring(0, f + 1));
			}
			if (a = this.tokenizer.inlineText(p)) {
				e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (s = a.raw.slice(-1)), i = !0;
				let f = n.at(-1);
				f?.type === "text" ? (f.raw += a.raw, f.text += a.text) : n.push(a);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return n;
	}
	infiniteLoopError(e) {
		let n = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(n);
		else throw new Error(n);
	}
}, nn = class {
	options;
	parser;
	constructor(t) {
		this.options = t || st;
	}
	space(t) {
		return "";
	}
	code({ text: t, lang: e, escaped: n }) {
		let r = (e || "").match(oe.notSpaceStart)?.[0], i = t ? t.replace(oe.endingNewline, "") + \`
\` : "";
		return r ? "<pre><code class=\\"language-" + we(r) + "\\">" + (n ? i : we(i, !0)) + \`</code></pre>
\` : "<pre><code>" + (n ? i : we(i, !0)) + \`</code></pre>
\`;
	}
	blockquote({ tokens: t }) {
		return \`<blockquote>
\${this.parser.parse(t)}</blockquote>
\`;
	}
	html({ text: t }) {
		return t;
	}
	def(t) {
		return "";
	}
	heading({ tokens: t, depth: e }) {
		return \`<h\${e}>\${this.parser.parseInline(t)}</h\${e}>
\`;
	}
	hr(t) {
		return \`<hr>
\`;
	}
	list(t) {
		let e = t.ordered, n = t.start, r = "";
		for (let c = 0; c < t.items.length; c++) {
			let a = t.items[c];
			r += this.listitem(a);
		}
		let i = e ? "ol" : "ul", s = e && n !== 1 ? " start=\\"" + n + "\\"" : "";
		return "<" + i + s + \`>
\` + r + "</" + i + \`>
\`;
	}
	listitem(t) {
		return \`<li>\${this.parser.parse(t.tokens)}</li>
\`;
	}
	checkbox({ checked: t }) {
		return "<input " + (t ? "checked=\\"\\" " : "") + "disabled=\\"\\" type=\\"checkbox\\"> ";
	}
	paragraph({ tokens: t }) {
		return \`<p>\${this.parser.parseInline(t)}</p>
\`;
	}
	table(t) {
		let e = "", n = "";
		for (let i = 0; i < t.header.length; i++) n += this.tablecell(t.header[i]);
		e += this.tablerow({ text: n });
		let r = "";
		for (let i = 0; i < t.rows.length; i++) {
			let s = t.rows[i];
			n = "";
			for (let c = 0; c < s.length; c++) n += this.tablecell(s[c]);
			r += this.tablerow({ text: n });
		}
		return r && (r = \`<tbody>\${r}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + r + \`</table>
\`;
	}
	tablerow({ text: t }) {
		return \`<tr>
\${t}</tr>
\`;
	}
	tablecell(t) {
		let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
		return (t.align ? \`<\${n} align="\${t.align}">\` : \`<\${n}>\`) + e + \`</\${n}>
\`;
	}
	strong({ tokens: t }) {
		return \`<strong>\${this.parser.parseInline(t)}</strong>\`;
	}
	em({ tokens: t }) {
		return \`<em>\${this.parser.parseInline(t)}</em>\`;
	}
	codespan({ text: t }) {
		return \`<code>\${we(t, !0)}</code>\`;
	}
	br(t) {
		return "<br>";
	}
	del({ tokens: t }) {
		return \`<del>\${this.parser.parseInline(t)}</del>\`;
	}
	link({ href: t, title: e, text: n, tokens: r, autolink: i }) {
		let s = i ? we(n, !0) : this.parser.parseInline(r), c = kr(t);
		if (c === null) return s;
		t = we(c, i);
		let a = "<a href=\\"" + t + "\\"";
		return e && (a += " title=\\"" + we(e) + "\\""), a += ">" + s + "</a>", a;
	}
	image({ href: t, title: e, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = kr(t);
		if (i === null) return we(n);
		t = i;
		let s = \`<img src="\${we(t)}" alt="\${we(n)}"\`;
		return e && (s += \` title="\${we(e)}"\`), s += ">", s;
	}
	text(t) {
		return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : we(t.text);
	}
}, Nn = class {
	strong({ text: t }) {
		return t;
	}
	em({ text: t }) {
		return t;
	}
	codespan({ text: t }) {
		return t;
	}
	del({ text: t }) {
		return t;
	}
	html({ text: t }) {
		return t;
	}
	text({ text: t }) {
		return t;
	}
	link({ text: t }) {
		return "" + t;
	}
	image({ text: t }) {
		return "" + t;
	}
	br() {
		return "";
	}
	checkbox({ raw: t }) {
		return t;
	}
}, Oe = class Jn {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || st, this.options.renderer = this.options.renderer || new nn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Nn();
	}
	static parse(e, n) {
		return new Jn(n).parse(e);
	}
	static parseInline(e, n) {
		return new Jn(n).parseInline(e);
	}
	parse(e) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let c = i, a = this.options.extensions.renderers[c.type].call({ parser: this }, c);
				if (a !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(c.type)) {
					n += a || "";
					continue;
				}
			}
			let s = i;
			switch (s.type) {
				case "space":
					n += this.renderer.space(s);
					break;
				case "hr":
					n += this.renderer.hr(s);
					break;
				case "heading":
					n += this.renderer.heading(s);
					break;
				case "code":
					n += this.renderer.code(s);
					break;
				case "table":
					n += this.renderer.table(s);
					break;
				case "blockquote":
					n += this.renderer.blockquote(s);
					break;
				case "list":
					n += this.renderer.list(s);
					break;
				case "checkbox":
					n += this.renderer.checkbox(s);
					break;
				case "html":
					n += this.renderer.html(s);
					break;
				case "def":
					n += this.renderer.def(s);
					break;
				case "paragraph":
					n += this.renderer.paragraph(s);
					break;
				case "text":
					n += this.renderer.text(s);
					break;
				default: {
					let c = "Token with \\"" + s.type + "\\" type was not found.";
					if (this.options.silent) return console.error(c), "";
					throw new Error(c);
				}
			}
		}
		return n;
	}
	parseInline(e, n = this.renderer) {
		this.renderer.parser = this;
		let r = "";
		for (let i = 0; i < e.length; i++) {
			let s = e[i];
			if (this.options.extensions?.renderers?.[s.type]) {
				let a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
				if (a !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(s.type)) {
					r += a || "";
					continue;
				}
			}
			let c = s;
			switch (c.type) {
				case "escape":
					r += n.text(c);
					break;
				case "html":
					r += n.html(c);
					break;
				case "link":
					r += n.link(c);
					break;
				case "image":
					r += n.image(c);
					break;
				case "checkbox":
					r += n.checkbox(c);
					break;
				case "strong":
					r += n.strong(c);
					break;
				case "em":
					r += n.em(c);
					break;
				case "codespan":
					r += n.codespan(c);
					break;
				case "br":
					r += n.br(c);
					break;
				case "del":
					r += n.del(c);
					break;
				case "text":
					r += n.text(c);
					break;
				default: {
					let a = "Token with \\"" + c.type + "\\" type was not found.";
					if (this.options.silent) return console.error(a), "";
					throw new Error(a);
				}
			}
		}
		return r;
	}
}, Ot = class {
	options;
	block;
	constructor(t) {
		this.options = t || st;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(t) {
		return t;
	}
	postprocess(t) {
		return t;
	}
	processAllTokens(t) {
		return t;
	}
	emStrongMask(t) {
		return t;
	}
	provideLexer(t = this.block) {
		return t ? Re.lex : Re.lexInline;
	}
	provideParser(t = this.block) {
		return t ? Oe.parse : Oe.parseInline;
	}
}, ti = class {
	defaults = Pn();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Oe;
	Renderer = nn;
	TextRenderer = Nn;
	Lexer = Re;
	Tokenizer = tn;
	Hooks = Ot;
	constructor(...t) {
		this.use(...t);
	}
	walkTokens(t, e) {
		let n = [];
		for (let r of t) switch (n = n.concat(e.call(this, r)), r.type) {
			case "table": {
				let i = r;
				for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, e));
				for (let s of i.rows) for (let c of s) n = n.concat(this.walkTokens(c.tokens, e));
				break;
			}
			case "list": {
				let i = r;
				n = n.concat(this.walkTokens(i.items, e));
				break;
			}
			default: {
				let i = r;
				this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
					let c = i[s].flat(1 / 0);
					n = n.concat(this.walkTokens(c, e));
				}) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, e)));
			}
		}
		return n;
	}
	use(...t) {
		let e = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return t.forEach((n) => {
			let r = { ...n };
			if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i) => {
				if (!i.name) throw new Error("extension name required");
				if ("renderer" in i) {
					let s = e.renderers[i.name];
					s ? e.renderers[i.name] = function(...c) {
						let a = i.renderer.apply(this, c);
						return a === !1 && (a = s.apply(this, c)), a;
					} : e.renderers[i.name] = i.renderer;
				}
				if ("tokenizer" in i) {
					if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
					let s = e[i.level];
					s ? s.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
				}
				"childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
			}), r.extensions = e), n.renderer) {
				let i = this.defaults.renderer || new nn(this.defaults);
				for (let s in n.renderer) {
					if (!(s in i)) throw new Error(\`renderer '\${s}' does not exist\`);
					if (["options", "parser"].includes(s)) continue;
					let c = s, a = n.renderer[c], p = i[c];
					i[c] = (...f) => {
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b || "";
					};
				}
				r.renderer = i;
			}
			if (n.tokenizer) {
				let i = this.defaults.tokenizer || new tn(this.defaults);
				for (let s in n.tokenizer) {
					if (!(s in i)) throw new Error(\`tokenizer '\${s}' does not exist\`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(s)) continue;
					let c = s, a = n.tokenizer[c], p = i[c];
					i[c] = (...f) => {
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b;
					};
				}
				r.tokenizer = i;
			}
			if (n.hooks) {
				let i = this.defaults.hooks || new Ot();
				for (let s in n.hooks) {
					if (!(s in i)) throw new Error(\`hook '\${s}' does not exist\`);
					if (["options", "block"].includes(s)) continue;
					let c = s, a = n.hooks[c], p = i[c];
					Ot.passThroughHooks.has(s) ? i[c] = (f) => {
						if (this.defaults.async && Ot.passThroughHooksRespectAsync.has(s)) return (async () => {
							let T = await a.call(i, f);
							return p.call(i, T);
						})();
						let b = a.call(i, f);
						return p.call(i, b);
					} : i[c] = (...f) => {
						if (this.defaults.async) return (async () => {
							let T = await a.apply(i, f);
							return T === !1 && (T = await p.apply(i, f)), T;
						})();
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b;
					};
				}
				r.hooks = i;
			}
			if (n.walkTokens) {
				let i = this.defaults.walkTokens, s = n.walkTokens;
				r.walkTokens = function(c) {
					let a = [];
					return a.push(s.call(this, c)), i && (a = a.concat(i.call(this, c))), a;
				};
			}
			this.defaults = {
				...this.defaults,
				...r
			};
		}), this;
	}
	setOptions(t) {
		return this.defaults = {
			...this.defaults,
			...t
		}, this;
	}
	lexer(t, e) {
		return Re.lex(t, e ?? this.defaults);
	}
	parser(t, e) {
		return Oe.parse(t, e ?? this.defaults);
	}
	parseMarkdown(t) {
		return (e, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, s = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return s(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof e > "u" || e === null) return s(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof e != "string") return s(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = t), i.async) return (async () => {
				let c = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(t) : t ? Re.lex : Re.lexInline)(c, i), p = i.hooks ? await i.hooks.processAllTokens(a) : a;
				i.walkTokens && await Promise.all(this.walkTokens(p, i.walkTokens));
				let f = await (i.hooks ? await i.hooks.provideParser(t) : t ? Oe.parse : Oe.parseInline)(p, i);
				return i.hooks ? await i.hooks.postprocess(f) : f;
			})().catch(s);
			try {
				i.hooks && (e = i.hooks.preprocess(e));
				let c = (i.hooks ? i.hooks.provideLexer(t) : t ? Re.lex : Re.lexInline)(e, i);
				i.hooks && (c = i.hooks.processAllTokens(c)), i.walkTokens && this.walkTokens(c, i.walkTokens);
				let a = (i.hooks ? i.hooks.provideParser(t) : t ? Oe.parse : Oe.parseInline)(c, i);
				return i.hooks && (a = i.hooks.postprocess(a)), a;
			} catch (c) {
				return s(c);
			}
		};
	}
	onError(t, e) {
		return (n) => {
			if (n.message += \`
Please report this to https://github.com/markedjs/marked.\`, t) {
				let r = "<p>An error occurred:</p><pre>" + we(n.message + "", !0) + "</pre>";
				return e ? Promise.resolve(r) : r;
			}
			if (e) return Promise.reject(n);
			throw n;
		};
	}
}, bt = new ti();
function j(t, e) {
	return bt.parse(t, e);
}
j.options = j.setOptions = function(t) {
	return bt.setOptions(t), j.defaults = bt.defaults, qr(j.defaults), j;
};
j.getDefaults = Pn;
j.defaults = st;
function ni(...t) {
	return bt.use(...t), j.defaults = bt.defaults, qr(j.defaults), j;
}
j.use = ni;
j.walkTokens = function(t, e) {
	return bt.walkTokens(t, e);
};
j.parseInline = bt.parseInline;
j.Parser = Oe;
j.parser = Oe.parse;
j.Renderer = nn;
j.TextRenderer = Nn;
j.Lexer = Re;
j.lexer = Re.lex;
j.Tokenizer = tn;
j.Hooks = Ot;
j.parse = j;
var ps = j.options, fs = j.setOptions, gs = j.walkTokens, ds = j.parseInline, ms = j, _s = Oe.parse, bs = Re.lex;
function xs(t, e) {
	this.v = t, this.k = e;
}
function Rr(t, e) {
	(e == null || e > t.length) && (e = t.length);
	for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
	return r;
}
function ys(t) {
	if (Array.isArray(t)) return t;
}
function ks(t, e) {
	var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
	if (n != null) {
		var r, i, s, c, a = [], p = !0, f = !1;
		try {
			if (s = (n = n.call(t)).next, e === 0) {
				if (Object(n) !== n) return;
				p = !1;
			} else for (; !(p = (r = s.call(n)).done) && (a.push(r.value), a.length !== e); p = !0);
		} catch (b) {
			f = !0, i = b;
		} finally {
			try {
				if (!p && n.return != null && (c = n.return(), Object(c) !== c)) return;
			} finally {
				if (f) throw i;
			}
		}
		return a;
	}
}
function ws() {
	throw new TypeError(\`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.\`);
}
function Ts(t, e) {
	return ys(t) || ks(t, e) || Es(t, e) || ws();
}
function Es(t, e) {
	if (t) {
		if (typeof t == "string") return Rr(t, e);
		var n = {}.toString.call(t).slice(8, -1);
		return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Rr(t, e) : void 0;
	}
}
function En(t) {
	var e, n;
	function r(s, c) {
		try {
			var a = t[s](c), p = a.value, f = p instanceof xs;
			Promise.resolve(f ? p.v : p).then(function(b) {
				if (f) {
					var T = s === "return" && p.k ? s : "next";
					if (!p.k || b.done) return r(T, b);
					b = t[T](b).value;
				}
				i(!!a.done, b);
			}, function(b) {
				r("throw", b);
			});
		} catch (b) {
			i(2, b);
		}
	}
	function i(s, c) {
		s === 2 ? e.reject(c) : e.resolve({
			value: c,
			done: s
		}), (e = e.next) ? r(e.key, e.arg) : n = null;
	}
	this._invoke = function(s, c) {
		return new Promise(function(a, p) {
			var f = {
				key: s,
				arg: c,
				resolve: a,
				reject: p,
				next: null
			};
			n ? n = n.next = f : (e = n = f, r(s, c));
		});
	}, typeof t.return != "function" && (this.return = void 0);
}
En.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, En.prototype.next = function(t) {
	return this._invoke("next", t);
}, En.prototype.throw = function(t) {
	return this._invoke("throw", t);
}, En.prototype.return = function(t) {
	return this._invoke("return", t);
};
const ri = Object.entries, Or = Object.setPrototypeOf, As = Object.isFrozen, Ss = Object.getPrototypeOf, vs = Object.getOwnPropertyDescriptor;
let ne = Object.freeze, se = Object.seal, vt = Object.create, ii = typeof Reflect < "u" && Reflect, er = ii.apply, tr = ii.construct;
ne || (ne = function(e) {
	return e;
});
se || (se = function(e) {
	return e;
});
er || (er = function(e, n) {
	for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++) i[s - 2] = arguments[s];
	return e.apply(n, i);
});
tr || (tr = function(e) {
	for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
	return new e(...r);
});
const mt = ee(Array.prototype.forEach);
Array.prototype.indexOf;
const Rs = ee(Array.prototype.lastIndexOf), Mr = ee(Array.prototype.pop), Yt = ee(Array.prototype.push);
Array.prototype.slice;
const Os = ee(Array.prototype.splice), Mt = Array.isArray, Jt = ee(String.prototype.toLowerCase), Hn = ee(String.prototype.toString), Pr = ee(String.prototype.match), Kt = ee(String.prototype.replace), Nr = ee(String.prototype.indexOf), Ms = ee(String.prototype.trim), Ps = ee(Number.prototype.toString), Ns = ee(Boolean.prototype.toString), Lr = typeof BigInt > "u" ? null : ee(BigInt.prototype.toString), Cr = typeof Symbol > "u" ? null : ee(Symbol.prototype.toString), ge = ee(Object.prototype.hasOwnProperty), Qt = ee(Object.prototype.toString), ce = ee(RegExp.prototype.test), tt = Ls(TypeError);
function ee(t) {
	return function(e) {
		e instanceof RegExp && (e.lastIndex = 0);
		for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
		return er(t, e, r);
	};
}
function Ls(t) {
	return function() {
		for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
		return tr(t, n);
	};
}
function $(t, e) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Jt;
	if (Or && Or(t, null), !Mt(e)) return t;
	let r = e.length;
	for (; r--;) {
		let i = e[r];
		if (typeof i == "string") {
			const s = n(i);
			s !== i && (As(e) || (e[r] = s), i = s);
		}
		t[i] = !0;
	}
	return t;
}
function Cs(t) {
	for (let e = 0; e < t.length; e++) ge(t, e) || (t[e] = null);
	return t;
}
function Te(t) {
	const e = vt(null);
	for (const r of ri(t)) {
		var n = Ts(r, 2);
		const i = n[0], s = n[1];
		ge(t, i) && (Mt(s) ? e[i] = Cs(s) : s && typeof s == "object" && s.constructor === Object ? e[i] = Te(s) : e[i] = s);
	}
	return e;
}
function Is(t) {
	switch (typeof t) {
		case "string": return t;
		case "number": return Ps(t);
		case "boolean": return Ns(t);
		case "bigint": return Lr ? Lr(t) : "0";
		case "symbol": return Cr ? Cr(t) : "Symbol()";
		case "undefined": return Qt(t);
		case "function":
		case "object": {
			if (t === null) return Qt(t);
			const e = t, n = ve(e, "toString");
			if (typeof n == "function") {
				const r = n(e);
				return typeof r == "string" ? r : Qt(r);
			}
			return Qt(t);
		}
		default: return Qt(t);
	}
}
function ve(t, e) {
	for (; t !== null;) {
		const r = vs(t, e);
		if (r) {
			if (r.get) return ee(r.get);
			if (typeof r.value == "function") return ee(r.value);
		}
		t = Ss(t);
	}
	function n() {
		return null;
	}
	return n;
}
function Ds(t) {
	try {
		return ce(t, ""), !0;
	} catch {
		return !1;
	}
}
const Ir = ne([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]), Wn = ne([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]), Gn = ne([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), zs = ne([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), qn = ne([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]), $s = ne([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Dr = ne(["#text"]), zr = ne([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]), Zn = ne([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"pointer-events",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"vector-effect",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]), $r = ne([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]), An = ne([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Bs = se(/{{[\\w\\W]*|^[\\w\\W]*}}/g), Us = se(/<%[\\w\\W]*|^[\\w\\W]*%>/g), js = se(/\\\${[\\w\\W]*/g), Fs = se(/^data-[\\-\\w.\\u00B7-\\uFFFF]+$/), Hs = se(/^aria-[\\-\\w]+$/), Br = se(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\\-:]|$))/i), Ws = se(/^(?:\\w+script|data):/i), Gs = se(/[\\u0000-\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u2029\\u205F\\u3000]/g), qs = se(/^html$/i), Zs = se(/^[a-z][.\\w]*(-[.\\w]+)+$/i), Ur = se(/<[/\\w!]/g), jr = se(/<[/\\w]/g), Vs = se(/<\\/no(script|embed|frames)/i), Xs = se(/\\/>/i), ke = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, si = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], Ys = ne($({}, si)), Ks = (function() {
	const t = {};
	return mt(si, (e) => {
		t[e] = se(new RegExp("</" + e + "(?=[\\\\t\\\\n\\\\f\\\\r />])", "i"));
	}), ne(t);
})(), Qs = function() {
	return typeof window > "u" ? null : window;
}, Js = function(e, n) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let r = null;
	const i = "data-tt-policy-suffix";
	n && n.hasAttribute(i) && (r = n.getAttribute(i));
	const s = "dompurify" + (r ? "#" + r : "");
	try {
		return e.createPolicy(s, {
			createHTML(c) {
				return c;
			},
			createScriptURL(c) {
				return c;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + s + " could not be created."), null;
	}
}, Fr = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, nt = function(e, n, r, i) {
	return ge(e, n) && Mt(e[n]) ? $(i.base ? Te(i.base) : {}, e[n], i.transform) : r;
}, Vn = function(e, n, r) {
	const i = ge(e, n) ? e[n] : void 0;
	return i && typeof i == "object" ? Te(i) : r();
};
function oi() {
	let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Qs();
	const e = (_) => oi(_);
	if (e.version = "3.4.16", e.removed = [], !t || !t.document || t.document.nodeType !== ke.document || !t.Element) return e.isSupported = !1, e;
	let n = t.document;
	const r = n, i = r.currentScript;
	t.DocumentFragment;
	const s = t.HTMLTemplateElement, c = t.Node, a = t.Element, p = t.NodeFilter;
	t.NamedNodeMap === void 0 && (t.NamedNodeMap || t.MozNamedAttrMap), t.HTMLFormElement;
	const f = t.DOMParser, b = t.trustedTypes, T = a.prototype, S = ve(T, "cloneNode"), C = ve(T, "remove"), v = ve(T, "removeAttributeNode"), z = ve(T, "nextSibling"), O = ve(T, "childNodes"), W = ve(T, "parentNode"), re = ve(T, "shadowRoot"), ie = ve(T, "attributes"), me = c && c.prototype ? ve(c.prototype, "nodeType") : null, Ne = c && c.prototype ? ve(c.prototype, "nodeName") : null, We = c && c.prototype ? ve(c.prototype, "ownerDocument") : null, _e = function(o) {
		return me ? me(o) : o.nodeType;
	}, Me = function(o) {
		return Ne ? Ne(o) : o.nodeName;
	};
	if (typeof s == "function") {
		const _ = n.createElement("template");
		_.content && _.content.ownerDocument && (n = _.content.ownerDocument);
	}
	let te, Le = "", xt, Nt = !1, Ge = 0;
	const an = function() {
		if (Ge > 0) throw tt("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \\"DOMPurify and Trusted Types\\" section of the README.");
	}, qe = function(o) {
		an(), Ge++;
		try {
			return te.createHTML(o);
		} finally {
			Ge--;
		}
	}, ot = function(o) {
		an(), Ge++;
		try {
			return te.createScriptURL(o);
		} finally {
			Ge--;
		}
	}, Cn = function() {
		return Nt || (xt = Js(b, i), Nt = !0), xt;
	}, yt = n, Lt = yt.implementation, at = yt.createNodeIterator, In = yt.createDocumentFragment, Dn = yt.getElementsByTagName, zn = r.importNode;
	let Z = Fr();
	e.isSupported = typeof ri == "function" && typeof W == "function" && Lt && Lt.createHTMLDocument !== void 0;
	const cr = Bs, ur = Us, hr = js, pr = Fs, fr = Hs, gr = Ws, $n = Gs, kt = Zs;
	let ln = Br, G = null;
	const Ct = $({}, [
		...Ir,
		...Wn,
		...Gn,
		...qn,
		...Dr
	]);
	let q = null;
	const It = $({}, [
		...zr,
		...Zn,
		...$r,
		...An
	]);
	let Ae = Object.seal(vt(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), lt = null, cn = null;
	const Ce = Object.seal(vt(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	}));
	let Dt = !0, zt = !0, un = !1, $t = !0, ae = !1, Ie = !0, pe = !1, Ze = !1, ct = null, wt = null, Bt = !1, Ve = !1, Tt = !1, Et = !1, Ut = !0, hn = !1;
	const pn = "user-content-";
	let jt = !0, ut = !1, $e = {}, Be = null;
	const fn = $({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let Ft = null;
	const Ue = $({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let l = null;
	const m = $({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), k = "http://www.w3.org/1998/Math/MathML", N = "http://www.w3.org/2000/svg", B = "http://www.w3.org/1999/xhtml";
	let F = B, E = !1, w = null;
	const M = $({}, [
		k,
		N,
		B
	], Hn), J = ne([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let V = $({}, J);
	const Xe = ne(["annotation-xml"]);
	let ht = $({}, Xe);
	const Ht = $({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let pt = null;
	const Wt = ["application/xhtml+xml", "text/html"], Bn = "text/html";
	let X = null, Ye = null;
	const gn = n.createElement("form"), ft = function(o) {
		return o instanceof RegExp || o instanceof Function;
	}, Gt = function() {
		let o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (Ye && Ye === o) return;
		(!o || typeof o != "object") && (o = {}), o = Te(o), pt = Wt.indexOf(o.PARSER_MEDIA_TYPE) === -1 ? Bn : o.PARSER_MEDIA_TYPE, X = pt === "application/xhtml+xml" ? Hn : Jt, G = nt(o, "ALLOWED_TAGS", Ct, { transform: X }), q = nt(o, "ALLOWED_ATTR", It, { transform: X }), w = nt(o, "ALLOWED_NAMESPACES", M, { transform: Hn }), l = nt(o, "ADD_URI_SAFE_ATTR", m, {
			transform: X,
			base: m
		}), Ft = nt(o, "ADD_DATA_URI_TAGS", Ue, {
			transform: X,
			base: Ue
		}), Be = nt(o, "FORBID_CONTENTS", fn, { transform: X }), lt = nt(o, "FORBID_TAGS", Te({}), { transform: X }), cn = nt(o, "FORBID_ATTR", Te({}), { transform: X }), $e = ge(o, "USE_PROFILES") ? o.USE_PROFILES && typeof o.USE_PROFILES == "object" ? Te(o.USE_PROFILES) : o.USE_PROFILES : !1, Dt = o.ALLOW_ARIA_ATTR !== !1, zt = o.ALLOW_DATA_ATTR !== !1, un = o.ALLOW_UNKNOWN_PROTOCOLS || !1, $t = o.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ae = o.SAFE_FOR_TEMPLATES || !1, Ie = o.SAFE_FOR_XML !== !1, pe = o.WHOLE_DOCUMENT || !1, Ve = o.RETURN_DOM || !1, Tt = o.RETURN_DOM_FRAGMENT || !1, Et = o.RETURN_TRUSTED_TYPE || !1, Bt = o.FORCE_BODY || !1, Ut = o.SANITIZE_DOM !== !1, hn = o.SANITIZE_NAMED_PROPS || !1, jt = o.KEEP_CONTENT !== !1, ut = o.IN_PLACE || !1, ln = Ds(o.ALLOWED_URI_REGEXP) ? o.ALLOWED_URI_REGEXP : Br, F = typeof o.NAMESPACE == "string" ? o.NAMESPACE : B, V = Vn(o, "MATHML_TEXT_INTEGRATION_POINTS", () => $({}, J)), ht = Vn(o, "HTML_INTEGRATION_POINTS", () => $({}, Xe));
		const u = Vn(o, "CUSTOM_ELEMENT_HANDLING", () => vt(null));
		if (Ae = vt(null), ge(u, "tagNameCheck") && ft(u.tagNameCheck) && (Ae.tagNameCheck = u.tagNameCheck), ge(u, "attributeNameCheck") && ft(u.attributeNameCheck) && (Ae.attributeNameCheck = u.attributeNameCheck), ge(u, "allowCustomizedBuiltInElements") && typeof u.allowCustomizedBuiltInElements == "boolean" && (Ae.allowCustomizedBuiltInElements = u.allowCustomizedBuiltInElements), se(Ae), ae && (zt = !1), Tt && (Ve = !0), $e && (G = $({}, Dr), q = vt(null), $e.html === !0 && ($(G, Ir), $(q, zr)), $e.svg === !0 && ($(G, Wn), $(q, Zn), $(q, An)), $e.svgFilters === !0 && ($(G, Gn), $(q, Zn), $(q, An)), $e.mathMl === !0 && ($(G, qn), $(q, $r), $(q, An))), Ce.tagCheck = null, Ce.attributeCheck = null, ge(o, "ADD_TAGS") && (typeof o.ADD_TAGS == "function" ? Ce.tagCheck = o.ADD_TAGS : Mt(o.ADD_TAGS) && (G === Ct && (G = Te(G)), $(G, o.ADD_TAGS, X))), ge(o, "ADD_ATTR") && (typeof o.ADD_ATTR == "function" ? Ce.attributeCheck = o.ADD_ATTR : Mt(o.ADD_ATTR) && (q === It && (q = Te(q)), $(q, o.ADD_ATTR, X))), ge(o, "ADD_FORBID_CONTENTS") && Mt(o.ADD_FORBID_CONTENTS) && (Be === fn && (Be = Te(Be)), $(Be, o.ADD_FORBID_CONTENTS, X)), jt && (G["#text"] = !0), pe && $(G, [
			"html",
			"head",
			"body"
		]), G.table && ($(G, ["tbody"]), delete lt.tbody), o.TRUSTED_TYPES_POLICY) {
			if (typeof o.TRUSTED_TYPES_POLICY.createHTML != "function") throw tt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createHTML\\" hook.");
			if (typeof o.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw tt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createScriptURL\\" hook.");
			const d = te;
			te = o.TRUSTED_TYPES_POLICY;
			try {
				Le = qe("");
			} catch (h) {
				throw te = d, h;
			}
		} else o.TRUSTED_TYPES_POLICY === null ? (te = void 0, Le = "") : (te === void 0 && (te = Cn()), te && typeof Le == "string" && (Le = qe("")));
		ne && ne(o), Ye = o;
	}, dn = $({}, [
		...Wn,
		...Gn,
		...zs
	]), mn = $({}, [...qn, ...$s]), De = function(o, u, d) {
		return u.namespaceURI === B ? o === "svg" : u.namespaceURI === k ? o === "svg" && (d === "annotation-xml" || V[d]) : !!dn[o];
	}, _n = function(o, u, d) {
		return u.namespaceURI === B ? o === "math" : u.namespaceURI === N ? o === "math" && ht[d] : !!mn[o];
	}, bn = function(o, u, d) {
		return u.namespaceURI === N && !ht[d] || u.namespaceURI === k && !V[d] ? !1 : !mn[o] && (Ht[o] || !dn[o]);
	}, Un = function(o) {
		let u = W(o);
		(!u || !u.tagName) && (u = {
			namespaceURI: F,
			tagName: "template"
		});
		const d = Jt(o.tagName), h = Jt(u.tagName);
		return w[o.namespaceURI] ? o.namespaceURI === N ? De(d, u, h) : o.namespaceURI === k ? _n(d, u, h) : o.namespaceURI === B ? bn(d, u, h) : !!(pt === "application/xhtml+xml" && w[o.namespaceURI]) : !1;
	}, ze = function(o) {
		Yt(e.removed, { element: o });
		try {
			W(o).removeChild(o);
		} catch {
			if (C(o), !W(o)) throw tt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, xn = function(o, u, d) {
		try {
			v(o, u);
		} catch {
			try {
				o.removeAttribute(d);
			} catch {}
		}
	}, je = function(o) {
		R(o);
		const u = O(o);
		if (u) {
			const h = [];
			mt(u, (g) => {
				Yt(h, g);
			}), mt(h, (g) => {
				try {
					C(g);
				} catch {}
			});
		}
		const d = ie(o);
		if (d) for (let h = d.length - 1; h >= 0; --h) {
			const g = d[h], y = g && g.name;
			typeof y == "string" && xn(o, g, y);
		}
	}, Fe = function(o, u, d) {
		if (!d) try {
			d = u.getAttributeNode(o);
		} catch {
			d = null;
		}
		Yt(e.removed, {
			attribute: d || null,
			from: u
		});
		try {
			d ? v(u, d) : u.removeAttribute(o);
		} catch {
			try {
				u.removeAttribute(o);
			} catch {}
		}
		if (o === "is") if (Ve || Tt) try {
			ze(u);
		} catch {}
		else try {
			u.setAttribute(o, "");
		} catch {}
	}, x = function(o) {
		const u = ie(o);
		if (u) for (let d = u.length - 1; d >= 0; --d) {
			const h = u[d], g = h && h.name;
			typeof g != "string" || q[X(g)] || xn(o, h, g);
		}
	}, R = function(o) {
		const u = [o];
		for (; u.length > 0;) {
			const d = u.pop();
			_e(d) === ke.element && x(d);
			const h = O(d);
			if (h) for (let g = h.length - 1; g >= 0; --g) u.push(h[g]);
		}
	}, D = function(o, u) {
		return Ie ? o === "patchsrc" ? !0 : o === "for" && u !== "label" && u !== "output" : !1;
	}, H = function(o) {
		if (!Ie) return;
		const u = [o];
		for (; u.length > 0;) {
			const d = u.pop(), h = _e(d);
			if (h === ke.processingInstruction || h === ke.comment && ce(jr, d.data)) {
				try {
					C(d);
				} catch {}
				continue;
			}
			if (h === ke.element) {
				const y = d, A = X(Me(d));
				try {
					y.hasAttribute && y.hasAttribute("patchsrc") && y.removeAttribute("patchsrc"), y.hasAttribute && y.hasAttribute("for") && D("for", A) && y.removeAttribute("for");
				} catch {}
			}
			const g = O(d);
			if (g) for (let y = g.length - 1; y >= 0; --y) u.push(g[y]);
		}
	}, Y = function(o) {
		let u = null, d = null;
		if (Bt) o = "<remove></remove>" + o;
		else {
			const y = Pr(o, /^[\\r\\n\\t ]+/);
			d = y && y[0];
		}
		pt === "application/xhtml+xml" && F === B && (o = "<html xmlns=\\"http://www.w3.org/1999/xhtml\\"><head></head><body>" + o + "</body></html>");
		const h = te ? qe(o) : o;
		if (F === B) try {
			u = new f().parseFromString(h, pt);
		} catch {}
		if (!u || !u.documentElement) {
			u = Lt.createDocument(F, "template", null);
			try {
				u.documentElement.innerHTML = E ? Le : h;
			} catch {}
		}
		const g = u.body || u.documentElement;
		return o && d && g.insertBefore(n.createTextNode(d), g.childNodes[0] || null), F === B ? Dn.call(u, pe ? "html" : "body")[0] : pe ? u.documentElement : g;
	}, be = function(o) {
		const u = We ? We(o) : o.ownerDocument;
		return at.call(u || o, o, p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION, null);
	}, fe = function(o) {
		return o = Kt(o, cr, " "), o = Kt(o, ur, " "), o = Kt(o, hr, " "), o;
	}, xe = function(o) {
		var u;
		o.normalize();
		const d = We ? We(o) : o.ownerDocument, h = at.call(d || o, o, p.SHOW_TEXT | p.SHOW_COMMENT | p.SHOW_CDATA_SECTION | p.SHOW_PROCESSING_INSTRUCTION, null);
		let g = h.nextNode();
		for (; g;) g.data = fe(g.data), g = h.nextNode();
		const y = (u = o.querySelectorAll) === null || u === void 0 ? void 0 : u.call(o, "template");
		y && mt(y, (A) => {
			Pe(A.content) && xe(A.content);
		});
	}, le = function(o) {
		const u = Ne ? Ne(o) : null;
		return typeof u != "string" || X(u) !== "form" ? !1 : typeof o.nodeName != "string" || typeof o.textContent != "string" || typeof o.removeChild != "function" || o.attributes !== ie(o) || typeof o.removeAttribute != "function" || typeof o.removeAttributeNode != "function" || typeof o.getAttributeNode != "function" || typeof o.setAttribute != "function" || typeof o.namespaceURI != "string" || typeof o.insertBefore != "function" || typeof o.hasChildNodes != "function" || o.nodeType !== me(o) || o.childNodes !== O(o);
	}, Pe = function(o) {
		if (!me || typeof o != "object" || o === null) return !1;
		try {
			return me(o) === ke.documentFragment;
		} catch {
			return !1;
		}
	}, Ke = function(o) {
		if (!me || typeof o != "object" || o === null) return !1;
		try {
			return typeof me(o) == "number";
		} catch {
			return !1;
		}
	};
	function ye(_, o, u) {
		_.length !== 0 && mt(_, (d) => {
			d.call(e, o, u, Ye);
		});
	}
	const yn = function(o, u) {
		return !!(Ie && o.hasChildNodes() && !Ke(o.firstElementChild) && ce(Ur, o.textContent) && ce(Ur, o.innerHTML) || Ie && o.namespaceURI === B && Ys[u] && (Ke(o.firstElementChild) || typeof o.textContent == "string" && ce(Ks[u], o.textContent)) || o.nodeType === ke.processingInstruction || Ie && o.nodeType === ke.comment && ce(jr, o.data));
	}, At = function(o, u) {
		if (o instanceof RegExp) return ce(o, u);
		if (o instanceof Function) {
			for (var d = arguments.length, h = new Array(d > 2 ? d - 2 : 0), g = 2; g < d; g++) h[g - 2] = arguments[g];
			return !!o(u, ...h);
		}
		return !1;
	}, jn = function(o, u, d) {
		if (!lt[u] && wn(u) && At(Ae.tagNameCheck, u)) return !1;
		if (jt && !Be[u]) {
			const h = W(o), g = O(o);
			if (g && h) {
				const y = g.length;
				for (let A = y - 1; A >= 0; --A) {
					const I = o === d ? S(g[A], !0) : g[A];
					h.insertBefore(I, z(o));
				}
			}
		}
		return ze(o), !0;
	}, kn = function(o, u, d, h) {
		return o.length === 0 ? u : u === d || u === h ? Te(u) : u;
	}, Qe = function(o, u) {
		return o === u || W(o) !== null ? !1 : (ut && R(o), !0);
	}, gt = function(o, u) {
		if (ye(Z.beforeSanitizeElements, o, null), Qe(o, u)) return !0;
		if (le(o)) return ze(o), !0;
		const d = X(Me(o));
		if (G = kn(Z.uponSanitizeElement, G, Ct, ct), ye(Z.uponSanitizeElement, o, {
			tagName: d,
			allowedTags: G
		}), Qe(o, u)) return !0;
		if (yn(o, d)) return ze(o), !0;
		if (lt[d] || !(Ce.tagCheck instanceof Function && Ce.tagCheck(d)) && !G[d]) {
			const h = jn(o, d, u);
			return h === !1 && (ye(Z.afterSanitizeElements, o, null), Qe(o, u)) ? !0 : h;
		}
		if (_e(o) === ke.element && !Un(o) || (d === "noscript" || d === "noembed" || d === "noframes") && ce(Vs, o.innerHTML)) return ze(o), !0;
		if (ae && o.nodeType === ke.text) {
			const h = fe(o.textContent);
			o.textContent !== h && (Yt(e.removed, { element: o.cloneNode() }), o.textContent = h);
		}
		return ye(Z.afterSanitizeElements, o, null), Qe(o, u);
	}, qt = function(o, u, d) {
		if (cn[u] || D(u, o) || Ut && (u === "id" || u === "name") && (d in n || d in gn)) return !1;
		const h = q[u] || Ce.attributeCheck instanceof Function && Ce.attributeCheck(u, o);
		return zt && ce(pr, u) || Dt && ce(fr, u) ? !0 : h ? l[u] || ce(ln, Kt(d, $n, "")) || (u === "src" || u === "xlink:href" || u === "href") && o !== "script" && Nr(d, "data:") === 0 && Ft[o] || un && !ce(gr, Kt(d, $n, "")) ? !0 : !d : wn(o) && At(Ae.tagNameCheck, o) && At(Ae.attributeNameCheck, u, o) || u === "is" && Ae.allowCustomizedBuiltInElements && At(Ae.tagNameCheck, d);
	}, Se = $({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), wn = function(o) {
		return !Se[Jt(o)] && ce(kt, o);
	}, Zt = function(o, u, d, h) {
		if (te && typeof b == "object" && typeof b.getAttributeType == "function" && !d) switch (b.getAttributeType(o, u)) {
			case "TrustedHTML": return qe(h);
			case "TrustedScriptURL": return ot(h);
		}
		return h;
	}, P = function(o, u, d, h) {
		try {
			return d ? o.setAttributeNS(d, u, h) : o.setAttribute(u, h), le(o) ? (ze(o), !1) : !0;
		} catch {
			return Fe(u, o), !1;
		}
	}, Vt = function(o, u) {
		if (ye(Z.beforeSanitizeAttributes, o, null), Qe(o, u)) return;
		const d = o.attributes;
		if (!d || le(o)) return;
		q = kn(Z.uponSanitizeAttribute, q, It, wt);
		const h = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: q,
			forceKeepAttr: void 0
		};
		let g = d.length;
		const y = X(o.nodeName);
		for (; g--;) {
			const A = d[g], I = A.name, Q = A.namespaceURI, ue = A.value, Je = X(I), Fn = ue;
			let he = I === "value" ? Fn : Ms(Fn), dr = !1;
			if (h.attrName = Je, h.attrValue = he, h.keepAttr = !0, h.forceKeepAttr = void 0, ye(Z.uponSanitizeAttribute, o, h), he = h.attrValue, hn && (Je === "id" || Je === "name") && Nr(he, pn) !== 0 && (Fe(I, o, A), he = pn + he, dr = !0), Ie && ce(/((--!?|])>)|<\\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, he)) {
				Fe(I, o, A);
				continue;
			}
			if (Je === "attributename" && Pr(he, "href")) {
				Fe(I, o, A);
				continue;
			}
			if (!h.forceKeepAttr) {
				if (!h.keepAttr) {
					Fe(I, o, A);
					continue;
				}
				if (!$t && ce(Xs, he)) {
					Fe(I, o, A);
					continue;
				}
				if (ae && (he = fe(he)), !qt(y, Je, he)) {
					Fe(I, o, A);
					continue;
				}
				he = Zt(y, Je, Q, he), he !== Fn && P(o, I, Q, he) && dr && Mr(e.removed);
			}
		}
		ye(Z.afterSanitizeAttributes, o, null), Qe(o, u);
	}, K = function(o) {
		let u = null;
		const d = be(o);
		for (ye(Z.beforeSanitizeShadowDOM, o, null); u = d.nextNode();) if (ye(Z.uponSanitizeShadowNode, u, null), gt(u, o), Vt(u, o), Pe(u.content) && K(u.content), _e(u) === ke.element) {
			const h = re(u);
			Pe(h) && (U(h), K(h));
		}
		ye(Z.afterSanitizeShadowDOM, o, null);
	}, U = function(o) {
		const u = [{
			node: o,
			shadow: null
		}];
		for (; u.length > 0;) {
			const d = u.pop();
			if (d.shadow) {
				K(d.shadow);
				continue;
			}
			const h = d.node, g = _e(h) === ke.element, y = O(h);
			if (y) for (let A = y.length - 1; A >= 0; --A) u.push({
				node: y[A],
				shadow: null
			});
			if (g) {
				const A = Ne ? Ne(h) : null;
				if (typeof A == "string" && X(A) === "template") {
					const I = h.content;
					Pe(I) && u.push({
						node: I,
						shadow: null
					});
				}
			}
			if (g) {
				const A = re(h);
				Pe(A) && u.push({
					node: null,
					shadow: A
				}, {
					node: A,
					shadow: null
				});
			}
		}
	};
	return e.sanitize = function(_) {
		let o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, d = null, h = null, g = null;
		if (E = !_, E && (_ = "<!-->"), typeof _ != "string" && !Ke(_) && (_ = Is(_), typeof _ != "string")) throw tt("dirty is not a string, aborting");
		if (!e.isSupported) return _;
		Ze ? (G = ct, q = wt) : Gt(o), (Z.uponSanitizeElement.length > 0 || Z.uponSanitizeAttribute.length > 0) && (G = Te(G)), Z.uponSanitizeAttribute.length > 0 && (q = Te(q)), e.removed = [];
		const y = ut && typeof _ != "string" && Ke(_);
		if (y) {
			H(_);
			const Q = Me(_);
			if (typeof Q == "string") {
				const ue = X(Q);
				if (!G[ue] || lt[ue]) throw je(_), tt("root node is forbidden and cannot be sanitized in-place");
			}
			if (le(_)) throw je(_), tt("root node is clobbered and cannot be sanitized in-place");
			try {
				U(_);
			} catch (ue) {
				throw je(_), ue;
			}
		} else if (Ke(_)) u = Y("<!---->"), d = u.ownerDocument.importNode(_, !0), d.nodeType === ke.element && d.nodeName === "BODY" || d.nodeName === "HTML" ? u = d : u.appendChild(d), U(u);
		else {
			if (!Ve && !ae && !pe && _.indexOf("<") === -1) return te && Et ? qe(_) : _;
			if (u = Y(_), !u) return Ve ? null : Et ? Le : "";
		}
		u && Bt && ze(u.firstChild);
		const A = y ? _ : u;
		try {
			const Q = be(A);
			for (; h = Q.nextNode();) gt(h, A), Vt(h, A), Pe(h.content) && K(h.content);
		} catch (Q) {
			throw y && (je(_), mt(e.removed, (ue) => {
				ue.element && R(ue.element);
			})), Q;
		}
		if (y) {
			let Q = !1;
			if (mt(e.removed, (ue) => {
				ue.element && (ue.element === _ && (Q = !0), R(ue.element));
			}), Q) throw tt("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return ae && xe(_), _;
		}
		if (Ve) {
			if (ae && xe(u), Tt) for (g = In.call(u.ownerDocument); u.firstChild;) g.appendChild(u.firstChild);
			else g = u;
			return (q.shadowroot || q.shadowrootmode) && (g = zn.call(r, g, !0)), g;
		}
		let I = pe ? u.outerHTML : u.innerHTML;
		return pe && G["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && ce(qs, u.ownerDocument.doctype.name) && (I = "<!DOCTYPE " + u.ownerDocument.doctype.name + \`>
\` + I), ae && (I = fe(I)), te && Et ? qe(I) : I;
	}, e.setConfig = function() {
		let _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		Gt(_), Ze = !0, ct = G, wt = q;
	}, e.clearConfig = function() {
		Ye = null, Ze = !1, ct = null, wt = null, te = xt, Le = "";
	}, e.isValidAttribute = function(_, o, u) {
		Ye || Gt({});
		const d = X(_), h = X(o);
		return qt(d, h, u);
	}, e.addHook = function(_, o) {
		typeof o == "function" && ge(Z, _) && Yt(Z[_], o);
	}, e.removeHook = function(_, o) {
		if (ge(Z, _)) {
			if (o !== void 0) {
				const u = Rs(Z[_], o);
				return u === -1 ? void 0 : Os(Z[_], u, 1)[0];
			}
			return Mr(Z[_]);
		}
	}, e.removeHooks = function(_) {
		ge(Z, _) && (Z[_] = []);
	}, e.removeAllHooks = function() {
		Z = Fr();
	}, e;
}
var ai = oi();
function li(t) {
	if (t.startsWith("---")) {
		const e = t.indexOf(\`
---\`, 3);
		if (e !== -1) {
			const n = t.slice(3, e + 0).trim(), r = t.slice(e + 4).trimStart(), i = {};
			return n.split(/\\r?\\n/).forEach((s) => {
				const c = s.match(/^([^:]+):\\s*(.*)$/);
				c && (i[c[1].trim()] = c[2].trim());
			}), {
				content: r,
				data: i
			};
		}
	}
	return {
		content: t,
		data: {}
	};
}
let Mn = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
	const t = Number(process.hrtime.bigint() / 1000000n);
	Mn = Date.now() - t;
} catch {
	Mn = null;
}
const Ee = () => {
	const t = Date.now();
	if (typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number") try {
		const e = performance.timeOrigin + performance.now();
		return Math.abs(e - t) < 1e3 ? e : t;
	} catch {}
	if (Mn != null) try {
		const e = Number(process.hrtime.bigint() / 1000000n) + Mn;
		return Math.abs(e - t) < 1e3 ? e : t;
	} catch {
		return t;
	}
	return t;
}, Ln = 1e3, eo = 60 * Ln, to = 30 * Ln, no = 1e3, Hr = eo;
var ro = class {
	/**
	* Create a PowerCache.
	* @param {Object} [options]
	* @param {number} [options.maxEntries=Infinity] Maximum number of entries.
	* @param {number} [options.maxWeight=Infinity] Maximum total weight across entries.
	* @param {function(*):number} [options.weightFn] Function to compute weight for a value.
	* @param {number} [options.defaultTTL=60000] Default TTL (ms) for entries.
	* @param {number} [options.maxPoolSize=1000] Maximum node pool size for reuse.
	* @param {boolean} [options.rejectOversized=false] If true, inserting an item whose weight > \`maxWeight\` will be rejected.
	* @param {function(*, *, string):void} [options.onEvict] Callback invoked when an item is evicted/deleted/rejected. Called as \`(key, value, reason)\` where reason is \`'evicted'|'deleted'|'rejected-oversized'\`.
	* @param {function(*, *):void} [options.onExpire] Callback invoked when an item expires. Called as \`(key, value)\`.
	* @param {number} [options.initialPoolSize=0] Prefill the internal node pool with this many nodes (capped by \`maxPoolSize\`).
	* @param {number} [options.maxCleanupPerTick=100] Default max nodes scanned per cleanup tick when running \`startCleanup()\`.
	* @param {boolean} [options.eagerCleanupOnRead=false] If true, \`peek()\` and \`has()\` will eagerly remove expired nodes when observed.
	* @throws {TypeError} When a non-object is provided as the options argument.
	*/
	constructor({ maxEntries: t = 1 / 0, maxWeight: e = 1 / 0, weightFn: n = () => 1, defaultTTL: r = Hr, maxPoolSize: i = no, rejectOversized: s = !1, onEvict: c = null, onExpire: a = null, initialPoolSize: p = 0, maxCleanupPerTick: f = 100, eagerCleanupOnRead: b = !1, defaultAsyncTimeout: T = to } = {}) {
		if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
		this.maxEntries = t, this.maxWeight = e, this.weightFn = n, this.defaultTTL = r, this.maxPoolSize = i, this.rejectOversized = !!s, this.onEvict = typeof c == "function" ? c : null, this.onExpire = typeof a == "function" ? a : null, this.maxCleanupPerTick = Number.isFinite(+f) ? Math.max(1, +f) : 100, this.eagerCleanupOnRead = !!b, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
		for (let S = 0; S < Math.min(p || 0, this.maxPoolSize); S++) this._pool.push({
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null
		});
		this._currentWeight = 0, this._hits = 0, this._misses = 0, this._evictions = 0, this._rejected = 0, this._expirations = 0, Object.defineProperty(this, "map", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._map;
			},
			set(S) {
				this._map = S;
			}
		}), Object.defineProperty(this, "head", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._head;
			},
			set(S) {
				this._head = S;
			}
		}), Object.defineProperty(this, "tail", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._tail;
			},
			set(S) {
				this._tail = S;
			}
		}), Object.defineProperty(this, "pool", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._pool;
			},
			set(S) {
				this._pool = S;
			}
		}), Object.defineProperty(this, "currentWeight", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._currentWeight;
			},
			set(S) {
				this._currentWeight = S;
			}
		}), Object.defineProperty(this, "hits", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._hits;
			},
			set(S) {
				this._hits = S;
			}
		}), Object.defineProperty(this, "misses", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._misses;
			},
			set(S) {
				this._misses = S;
			}
		}), Object.defineProperty(this, "evictions", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._evictions;
			},
			set(S) {
				this._evictions = S;
			}
		}), Object.defineProperty(this, "rejected", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._rejected;
			},
			set(S) {
				this._rejected = S;
			}
		}), Object.defineProperty(this, "expirations", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._expirations;
			},
			set(S) {
				this._expirations = S;
			}
		}), this._cleanupTimer = null, this._cleanupRunning = !1, this._cleanupParams = null, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._inflightPromises = /* @__PURE__ */ new Map(), this._defaultAsyncTimeout = Number.isFinite(Number(T)) ? Math.max(0, Math.floor(Number(T))) : 3e4;
	}
	/**
	* Allocate a pool node or create a new one.
	*
	* This helper either reuses a node from the internal \`pool\` or creates a
	* fresh node object. The returned node is initialized with the provided
	* key/value/weight/expiresAt and has its \`prev\`/\`next\` pointers nulled.
	*
	* @private
	* @param {*} key
	* @param {*} value
	* @param {number} weight
	* @param {number} expiresAt
	* @returns {CacheNode}
	*/
	_allocNode(t, e, n, r) {
		const i = this._pool.pop() || {
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null
		};
		return i.key = t, i.value = e, i.weight = n || 0, i.expiresAt = r || 0, i.prev = null, i.next = null, i;
	}
	/**
	* Compute and validate a weight for a value.
	* If \`explicitWeight\` is provided it is normalized and returned.
	* Otherwise \`this.weightFn\` is invoked safely and any thrown error
	* or non-finite return value results in a weight of \`0\`.
	* @private
	* @param {*} value
	* @param {number|null|undefined} explicitWeight
	* @returns {number}
	*/
	_computeWeight(t, e) {
		if (e != null) {
			const n = +e;
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		}
		try {
			const n = +this.weightFn(t);
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		} catch {
			return 0;
		}
	}
	/**
	* Reset and return a node to the pool for reuse.
	*
	* This helper clears the node fields and returns it to the node pool when
	* the pool has capacity. It is called for evicted or deleted nodes to
	* reduce allocation churn.
	*
	* @private
	* @param {CacheNode} node
	* @returns {void}
	*/
	_freeNode(t) {
		t.key = null, t.value = null, t.weight = 0, t.expiresAt = 0, t.prev = null, t.next = null, this._pool.length < this.maxPoolSize && this._pool.push(t);
	}
	/**
	* Remove a node that has expired.
	*
	* Performs map deletion, linked-list unlink, invokes \`onExpire\`, returns the
	* node to the pool, and updates bookkeeping counters (\`misses\` and
	* \`expirations\`). This helper is called from several expiration paths and
	* centralizes the necessary cleanup steps.
	*
	* @private
	* @param {CacheNode} node
	* @param {number} now - Current timestamp (ms) used for comparisons
	* @remarks This helper does not modify the \`misses\` counter; callers should
	* increment \`this._misses\` when the removal corresponds to a user-facing
	* lookup (for example, \`get()\`/\`getMany()\`/\`getOrSet()\`).
	*/
	_removeExpiredNode(t, e) {
		if (!t.expiresAt || t.expiresAt > e) return !1;
		const n = t.key, r = t.value, i = t.next;
		this._map.delete(n), this._currentWeight -= t.weight || 0, this._cleanupCursor === t && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(t);
		try {
			this.onExpire && this.onExpire(n, r);
		} catch (s) {
			try {
				typeof this._logger?.error == "function" ? this._logger.error(s, "PowerCache onExpire callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onExpire callback threw", s);
			} catch {}
		}
		return this._freeNode(t), this._expirations++, !0;
	}
	/**
	* Fetch a node and validate expiry.
	* @private
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @param {boolean} [options.countMiss=false]
	* @returns {CacheNode|null}
	*/
	_fetchValidNode(t, { ignoreExpiry: e = !1, countMiss: n = !1, allowExpired: r = !1 } = {}) {
		const i = this._map.get(t);
		if (!i) return n && this._misses++, null;
		const s = !e && i.expiresAt ? Ee() : 0;
		return s && i.expiresAt <= s ? r ? i : (this._removeExpiredNode(i, s), n && this._misses++, null) : i;
	}
	/**
	* Start a background refresh for an expired entry.
	*
	* If a refresh is already in flight for the key, this helper does nothing.
	* The refreshed value is written back to cache when the factory resolves.
	* Errors are swallowed so the stale value remains available.
	*
	* @private
	* @param {*} key
	* @param {Function} factory
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @returns {void}
	*/
	_refreshStaleEntry(t, e, { ttl: n = void 0, weight: r = void 0 } = {}) {
		if (this._inflightPromises.has(t)) return;
		let i;
		try {
			i = Promise.resolve().then(() => e());
		} catch {
			return;
		}
		const s = i.then((c) => {
			try {
				this.set(t, c, {
					ttl: n,
					weight: r
				});
			} catch {}
			return c;
		}).catch(() => {}).finally(() => {
			this._inflightPromises.delete(t);
		});
		this._inflightPromises.set(t, s);
	}
	/**
	* Append a node to the tail (mark it most-recently used).
	* This updates the linked-list pointers appropriately and is used when
	* inserting new nodes or promoting a node to MRU.
	*
	* @private
	* @param {CacheNode} node - Node to append at the tail.
	* @returns {void}
	*/
	_append(t) {
		if (!this._tail) {
			this._head = this._tail = t, this._evictionCandidate = this._head;
			return;
		}
		t.prev = this._tail, t.next = null, this._tail.next = t, this._tail = t;
	}
	/**
	* Remove a node from the linked list without freeing it. The node's
	* \`prev\`/\`next\` references are updated on neighbors and the node's links
	* are nulled. Does not modify \`this.map\` or bookkeeping counters; callers
	* are responsible for those actions.
	*
	* @private
	* @param {CacheNode} node - Node to unlink from the list.
	* @returns {void}
	*/
	_remove(t) {
		const e = t.prev, n = t.next;
		e ? e.next = n : this._head = n, e || (this._evictionCandidate = this._head), n ? n.prev = e : this._tail = e, t.prev = t.next = null;
	}
	/**
	* Move an existing node to the tail (mark as most-recently used).
	* Implemented as an unlink followed by an append. No-op when node is
	* already the tail.
	*
	* @private
	* @param {CacheNode} node - Node to promote to MRU position.
	* @returns {void}
	*/
	_moveToTail(t) {
		this._tail !== t && (this._remove(t), this._append(t));
	}
	/**
	* Evict nodes from the head (least-recently used) until the cache
	* satisfies both \`maxEntries\` and \`maxWeight\` constraints. For each
	* evicted node \`onEvict\` is invoked if provided and the node is returned
	* to the node pool via \`_freeNode\`.
	*
	* @private
	* @returns {void}
	*/
	_evictIfNeeded() {
		for (; this._map.size > this.maxEntries || this._currentWeight > this.maxWeight;) {
			const t = this._evictionCandidate || this._head;
			if (!t) break;
			const e = t.next, n = t.key, r = t.value;
			this._cleanupCursor === t && (this._cleanupCursor = e), this._cleanupCursorValid = !!this._cleanupCursor, this._evictionCandidate = e, this._remove(t), this._map.delete(n), this._currentWeight -= t.weight || 0, this._evictions++;
			try {
				this.onEvict && this.onEvict(n, r, "evicted");
			} catch (i) {
				try {
					typeof this._logger?.error == "function" ? this._logger.error(i, "PowerCache onEvict callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onEvict callback threw", i);
				} catch {}
			}
			this._freeNode(t);
		}
		this._evictionCandidate || (this._evictionCandidate = this._head);
	}
	/**
	* Set a value in the cache (add or update).
	* Marks the entry as most-recently used.
	* If \`rejectOversized\` is enabled and the computed/explicit weight exceeds \`maxWeight\`,
	* the insertion will be rejected and \`set\` returns \`false\` (otherwise returns \`this\`).
	* @param {*} key - Cache key
	* @param {*} value - Value to store
	* @param {Object} [options]
	* @param {number} [options.ttl] - Time-to-live in ms. Use \`null\` or \`Infinity\` to disable expiration.
	* @param {number} [options.weight] - Optional explicit weight for the entry. If omitted, \`weightFn\` is used.
	* @returns {this|false} \`this\` on success, or \`false\` when insertion was rejected due to oversize.
	*/
	set(t, e, { ttl: n = this.defaultTTL, weight: r = null } = {}) {
		const i = Ee(), s = n == null || n === 1 / 0 ? 0 : i + n, c = this._computeWeight(e, r);
		if (this.rejectOversized && Number.isFinite(this.maxWeight) && c > this.maxWeight) {
			this._rejected++;
			try {
				this.onEvict && this.onEvict(t, e, "rejected-oversized");
			} catch {}
			return !1;
		}
		if (this._map.has(t)) {
			const a = this._map.get(t);
			this._currentWeight -= a.weight || 0, a.value = e, a.weight = c, a.expiresAt = s, this._currentWeight += a.weight || 0, this._moveToTail(a);
		} else {
			const a = this._allocNode(t, e, c, s);
			this._map.set(t, a), this._append(a), this._currentWeight += a.weight || 0;
		}
		return this._evictIfNeeded(), this;
	}
	/**
	* Retrieve a value and mark it as recently used.
	* @param {*} key
	* @returns {*|undefined} The stored value or \`undefined\` if missing/expired.
	*/
	get(t) {
		const e = this._fetchValidNode(t, { countMiss: !0 });
		if (e) return this._moveToTail(e), this._hits++, e.value;
	}
	/**
	* Get a value without updating recency.
	* Returns \`undefined\` for missing or expired entries.
	* @param {*} key
	* @returns {*|undefined}
	*/
	peek(t) {
		const e = this._fetchValidNode(t);
		return e ? e.value : void 0;
	}
	/**
	* Check membership without affecting recency.
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false] If true, consider expired entries as present.
	* @returns {boolean}
	*/
	has(t, { ignoreExpiry: e = !1 } = {}) {
		return !!this._fetchValidNode(t, { ignoreExpiry: e });
	}
	/**
	* Atomically read-or-compute a value for \`key\`.
	* If the key is present and not expired the stored value is returned.
	* Otherwise \`factory\` is invoked to produce the value which is stored
	* in the cache and returned. \`factory\` may be a value (in which case it
	* is stored directly) or a function. If the function returns a Promise,
	* the Promise is returned and the resolved value is stored when it settles.
	*
	* Note: this method does not deduplicate concurrent async factories —
	* for async factories prefer \`getOrSetAsync\` or use
	* \`PowerMemoizer\` for inflight deduplication.
	*
	* @param {*} key
	* @param {Function|*} factory - Function that produces the value or a direct value.
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @param {boolean} [options.staleWhileRevalidate=false] If true, return an expired value immediately and refresh the cache in the background.
	* @returns {*|Promise<*>}
	*/
	getOrSet(t, e, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1 } = {}) {
		const s = Ee(), c = this._fetchValidNode(t, {
			countMiss: !1,
			allowExpired: i
		});
		if (c) if (c.expiresAt && c.expiresAt <= s) {
			if (typeof e == "function") return this._moveToTail(c), this._hits++, this._refreshStaleEntry(t, e, {
				ttl: n,
				weight: r
			}), c.value;
			this._removeExpiredNode(c, s), this._misses++;
		} else return this._moveToTail(c), this._hits++, c.value;
		else this._misses++;
		if (typeof e == "function") {
			const a = e();
			return typeof a?.then == "function" ? a.then((p) => {
				try {
					this.set(t, p, {
						ttl: n,
						weight: r
					});
				} catch {}
				return p;
			}) : (this.set(t, a, {
				ttl: n,
				weight: r
			}), a);
		}
		return this.set(t, e, {
			ttl: n,
			weight: r
		}), e;
	}
	/**
	* Bulk set multiple entries. Accepts an iterable/array of [key, value] pairs.
	* Computes weight once per value and applies a single eviction pass at the end.
	* @param {Iterable<[*,*]>} entries
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @returns {this}
	*/
	setMany(t, { ttl: e = void 0, weight: n = void 0 } = {}) {
		const r = Ee(), i = e == null || e === 1 / 0 ? 0 : r + e;
		for (const s of t) {
			if (!s) continue;
			const [c, a] = s, p = this._computeWeight(a, n);
			if (this._map.has(c)) {
				const f = this._map.get(c);
				this._currentWeight -= f.weight || 0, f.value = a, f.weight = p, f.expiresAt = i, this._currentWeight += f.weight || 0, this._moveToTail(f);
			} else {
				const f = this._allocNode(c, a, p, i);
				this._map.set(c, f), this._append(f), this._currentWeight += f.weight || 0;
			}
		}
		return this._evictIfNeeded(), this;
	}
	/**
	* Bulk get multiple keys. Returns a Map of found entries.
	* @param {Iterable<*>} keys
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @returns {Map}
	*/
	getMany(t, { ignoreExpiry: e = !1 } = {}) {
		const n = /* @__PURE__ */ new Map();
		for (const r of t) {
			const i = this._fetchValidNode(r, {
				ignoreExpiry: e,
				countMiss: !0
			});
			i && (this._moveToTail(i), this._hits++, n.set(r, i.value));
		}
		return n;
	}
	/**
	* Touch an entry: update its recency and optionally refresh TTL without
	* reading or modifying the stored value.
	* @param {*} key
	* @param {number} [ttl] - Optional per-call TTL in ms. Use \`null\`/\`Infinity\` to disable expiry.
	* @returns {boolean} True if the entry existed (and was not expired), false otherwise.
	*/
	touch(t, e = void 0) {
		const n = this._fetchValidNode(t);
		if (!n) return !1;
		const r = Ee();
		return e !== void 0 && (n.expiresAt = e == null || e === 1 / 0 ? 0 : r + e), this._moveToTail(n), !0;
	}
	/**
	* Async read-or-compute with inflight deduplication.
	* If a factory is already running for \`key\`, returns the same Promise.
	* Otherwise invokes \`asyncFactory\` and stores the resolved value in cache.
	* @param {*} key
	* @param {Function} asyncFactory - Function returning a Promise or value.
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @param {boolean} [options.staleWhileRevalidate=false] If true, return an expired value immediately and refresh the cache in the background.
	* @returns {Promise<*>}
	*/
	getOrSetAsync(t, e, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1, timeout: s = void 0 } = {}) {
		if (typeof e != "function") return Promise.resolve(this.getOrSet(t, e, {
			ttl: n,
			weight: r
		}));
		const c = Ee(), a = this._map.get(t);
		if (a) if (a.expiresAt && a.expiresAt <= c) {
			if (i) return this._moveToTail(a), this._hits++, this._refreshStaleEntry(t, e, {
				ttl: n,
				weight: r
			}), Promise.resolve(a.value);
			this._removeExpiredNode(a, c);
		} else return this._moveToTail(a), this._hits++, Promise.resolve(a.value);
		if (this._inflightPromises.has(t)) return this._inflightPromises.get(t);
		this._misses++;
		let p;
		try {
			p = Promise.resolve().then(() => e());
		} catch (S) {
			return Promise.reject(S);
		}
		const f = Number.isFinite(Number(s)) ? Math.max(0, Math.floor(Number(s))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
		let b = p;
		if (Number.isFinite(f) && f > 0) {
			let S = null;
			b = new Promise((C, v) => {
				S = setTimeout(() => {
					try {
						v(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
					} catch {}
				}, f), p.then((z) => {
					try {
						clearTimeout(S);
					} catch {}
					C(z);
				}, (z) => {
					try {
						clearTimeout(S);
					} catch {}
					v(z);
				});
			});
		}
		const T = b.then((S) => {
			try {
				this.set(t, S, {
					ttl: n,
					weight: r
				});
			} catch {}
			return S;
		}).finally(() => {
			this._inflightPromises.delete(t);
		});
		return this._inflightPromises.set(t, T), T;
	}
	/**
	* Check membership without affecting recency and verify the stored value is deep-equal
	* to the provided \`value\`.
	*
	* Optimizations:
	* - Fast reference equality short-circuit
	* - Fast primitive checks
	* - Special-cases for Arrays, TypedArrays/ArrayBuffer, Date, RegExp, Map and Set
	* - WeakMap/WeakSet-based cycle detection
	*
	* @param {*} key
	* @param {*} value
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false] If true, consider expired entries as present.
	* @param {WeakMap} [options.seen] Optional reusable \`seen\` WeakMap for callers that
	*        perform many deep-equality checks and want to avoid per-call allocations.
	* @returns {boolean}
	*/
	hasEqual(t, e, { ignoreExpiry: n = !1, seen: r = void 0 } = {}) {
		const i = this._fetchValidNode(t, { ignoreExpiry: n });
		if (!i) return !1;
		const s = i.value;
		return s === e ? !0 : typeof s != "object" || s === null || typeof e != "object" || e === null ? s === e : Rt(s, e, r);
	}
	/**
	* Variant accepting an explicit \`seen\` WeakMap for reuse across many checks.
	* @param {*} key
	* @param {*} value
	* @param {WeakMap} seen
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @returns {boolean}
	*/
	hasEqualWithSeen(t, e, n, { ignoreExpiry: r = !1 } = {}) {
		return this.hasEqual(t, e, {
			ignoreExpiry: r,
			seen: n
		});
	}
	/**
	* Delete an entry from the cache.
	* @param {*} key
	* @returns {boolean} true if the key was removed.
	*/
	delete(t) {
		const e = this._map.get(t);
		if (!e) return !1;
		const n = e.next;
		this._map.delete(t), this._currentWeight -= e.weight || 0, this._cleanupCursor === e && (this._cleanupCursor = n), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(e);
		try {
			this.onEvict && this.onEvict(e.key, e.value, "deleted");
		} catch {}
		return this._freeNode(e), !0;
	}
	/**
	* Clear the cache and return nodes to the pool.
	* @returns {void}
	*/
	clear() {
		for (let t = this._head; t;) {
			const e = t.next;
			this._freeNode(t), t = e;
		}
		this._head = this._tail = null, this._map.clear(), this._currentWeight = 0, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null;
	}
	/**
	* Remove expired entries by scanning from least-recently used to most.
	* @returns {void}
	*/
	cleanupExpired() {
		return this.cleanupExpiredUpTo();
	}
	/**
	* Cleanup expired entries, scanning up to \`maxScan\` nodes.
	* Scanning resumes from an internal cursor so repeated small passes will cover the list
	* without repeatedly scanning the head of a very large cache. When the end is reached the
	* cursor wraps to the head.
	* @param {number} [maxScan=Infinity] Maximum nodes to scan in this pass.
	* @returns {number} Number of nodes scanned
	*/
	cleanupExpiredUpTo(t = 1 / 0) {
		const e = Ee();
		let n = 0, r = this._cleanupCursor && this._cleanupCursorValid ? this._cleanupCursor : this._head;
		for (; r && n < t;) {
			const i = r.next;
			if (r.expiresAt && r.expiresAt <= e) {
				const s = r.key, c = r.value;
				this._map.delete(s), this._currentWeight -= r.weight || 0, this._cleanupCursor === r && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(r);
				try {
					this.onExpire && this.onExpire(s, c);
				} catch {}
				this._freeNode(r), this._expirations++;
			}
			r = i, n++;
		}
		return this._cleanupCursor = r || this._head, this._cleanupCursorValid = !!this._cleanupCursor, n;
	}
	/**
	* Start periodic, non-blocking cleanup.
	* Accepts either a numeric interval (ms) or an options object \`{ interval, maxCleanupPerTick }\`.
	* The loop is implemented with \`setTimeout\` and scans up to \`maxCleanupPerTick\` nodes per pass
	* to avoid long event-loop stalls.
	* Note: call \`stopCleanup()\` to stop the periodic timer (for example, on application shutdown)
	* to ensure the internal timer is cleared and resources can be reclaimed.
	* @param {number|Object} [intervalOrOptions]
	* @param {number} [intervalOrOptions.interval] Interval between cleanup passes in ms.
	* @param {number} [intervalOrOptions.maxCleanupPerTick] Max nodes to scan per pass.
	* @returns {void}
	*/
	startCleanup(t = {}) {
		let e, n;
		typeof t == "number" ? (e = t, n = this.maxCleanupPerTick) : (e = Number.isFinite(+t.interval) ? +t.interval : Math.max(Ln, Math.min(this.defaultTTL || 6e4, Hr)), n = Number.isFinite(+t.maxCleanupPerTick) ? Math.max(1, +t.maxCleanupPerTick) : this.maxCleanupPerTick), this.stopCleanup(), this._cleanupParams = {
			interval: e,
			maxCleanupPerTick: n
		}, this._cleanupTimer = setTimeout(() => this._cleanupTick(), e);
	}
	/**
	* Stop periodic cleanup.
	* @returns {void}
	*/
	stopCleanup() {
		this._cleanupTimer && (clearTimeout(this._cleanupTimer), this._cleanupTimer = null), this._cleanupRunning = !1, this._cleanupParams = null;
	}
	/**
	* Synchronous disposal hook (TC39 Explicit Resource Management).
	* Stops any background cleanup and clears the cache.
	*/
	[Symbol.dispose]() {
		try {
			this.stopCleanup();
		} catch {}
		try {
			this.clear();
		} catch {}
	}
	/**
	* Asynchronous disposal hook. Provided for symmetry with \`using\`/\`await using\`.
	* Cache cleanup is synchronous so this simply performs the same actions and
	* returns a resolved Promise for await compatibility.
	*/
	async [Symbol.asyncDispose]() {
		try {
			this.stopCleanup();
		} catch {}
		try {
			this.clear();
		} catch {}
	}
	/**
	* Prototype tick used by the cleanup timer loop. Separated to avoid
	* allocating a per-call closure inside \`startCleanup()\`.
	* @private
	*/
	_cleanupTick() {
		if (this._cleanupTimer != null) {
			if (this._cleanupRunning) {
				this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
				return;
			}
			this._cleanupRunning = !0;
			try {
				this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick);
			} finally {
				this._cleanupRunning = !1;
			}
			this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
		}
	}
	/**
	* Current number of entries in cache.
	* @returns {number}
	*/
	get size() {
		return this._map.size;
	}
	/**
	* Hit rate as a fraction (hits / (hits + misses)).
	* @returns {number}
	*/
	get hitRate() {
		const t = (this._hits || 0) + (this._misses || 0);
		return t ? this._hits / t : 0;
	}
	/**
	* Return runtime statistics for the cache.
	* @returns {{size:number, weight:number, hits:number, misses:number, evictions:number, rejected:number, poolSize:number}}
	*/
	stats() {
		return {
			size: this.size,
			weight: this._currentWeight,
			hits: this._hits,
			misses: this._misses,
			evictions: this._evictions,
			expirations: this._expirations,
			rejected: this._rejected,
			poolSize: this._pool.length
		};
	}
	/**
	* Resize the cache limits and evict if necessary.
	* @param {Object} options
	* @param {number} [options.maxEntries]
	* @param {number} [options.maxWeight]
	*/
	resize({ maxEntries: t, maxWeight: e } = {}) {
		Number.isFinite(+t) && (this.maxEntries = Math.max(0, +t)), Number.isFinite(+e) && (this.maxWeight = Math.max(0, +e)), this._evictIfNeeded(), this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = this.head;
	}
	/**
	* Iterate entries in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	* @returns {IterableIterator<[*,*]>}
	*/
	*entries(t = "MRU") {
		if (t === "MRU") for (let e = this._tail; e; e = e.prev) yield [e.key, e.value];
		else for (let e = this._head; e; e = e.next) yield [e.key, e.value];
	}
	[Symbol.iterator]() {
		return this.entries("MRU");
	}
	/**
	* Iterate keys in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*keys(t = "MRU") {
		for (const [e] of this.entries(t)) yield e;
	}
	/**
	* Iterate values in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*values(t = "MRU") {
		for (const [, e] of this.entries(t)) yield e;
	}
};
function Rt(t, e, n = void 0, r = 0) {
	if (r > 100) return t === e;
	if (t === e) return !0;
	if (t == null || e == null || typeof t != "object" || typeof e != "object") return t === e;
	n || (n = /* @__PURE__ */ new WeakMap());
	let i = n.get(t);
	if (i?.has(e)) return !0;
	if (i || (i = /* @__PURE__ */ new WeakSet(), n.set(t, i)), i.add(e), Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return !1;
	if (typeof Uint8Array < "u" && t instanceof Uint8Array) {
		if (!(e instanceof Uint8Array) || t.length !== e.length) return !1;
		for (let a = 0; a < t.length; a++) if (t[a] !== e[a]) return !1;
		return !0;
	}
	if (Array.isArray(t)) {
		if (!Array.isArray(e) || t.length !== e.length) return !1;
		for (let a = 0; a < t.length; a++) if (!Rt(t[a], e[a], n, r + 1)) return !1;
		return !0;
	}
	if (ArrayBuffer.isView(t)) {
		if (!ArrayBuffer.isView(e) || t.byteLength !== e.byteLength) return !1;
		const a = new Uint8Array(t.buffer, t.byteOffset || 0, t.byteLength), p = new Uint8Array(e.buffer, e.byteOffset || 0, e.byteLength);
		for (let f = 0; f < a.length; f++) if (a[f] !== p[f]) return !1;
		return !0;
	}
	if (t instanceof ArrayBuffer) {
		if (!(e instanceof ArrayBuffer) || t.byteLength !== e.byteLength) return !1;
		const a = new Uint8Array(t), p = new Uint8Array(e);
		for (let f = 0; f < a.length; f++) if (a[f] !== p[f]) return !1;
		return !0;
	}
	if (t instanceof Date) return e instanceof Date ? t.getTime() === e.getTime() : !1;
	if (t instanceof RegExp) return e instanceof RegExp ? t.toString() === e.toString() : !1;
	if (t instanceof Map) {
		if (!(e instanceof Map) || t.size !== e.size) return !1;
		for (const [a, p] of t) if (!e.has(a) || !Rt(p, e.get(a), n, r + 1)) return !1;
		return !0;
	}
	if (t instanceof Set) {
		if (!(e instanceof Set) || t.size !== e.size) return !1;
		let a = !0;
		for (const v of t) if (v !== null && typeof v == "object") {
			a = !1;
			break;
		}
		if (a) {
			for (const v of t) if (!e.has(v)) return !1;
			return !0;
		}
		const p = Array.from(e), f = new Array(p.length).fill(!1), b = /* @__PURE__ */ new Map();
		for (let v = 0; v < p.length; v++) b.set(p[v], v);
		const T = (v) => {
			try {
				return JSON.stringify(v, (z, O) => O instanceof Date ? {
					__type: "Date",
					v: O.getTime()
				} : O instanceof RegExp ? {
					__type: "RegExp",
					v: O.toString()
				} : typeof ArrayBuffer < "u" && ArrayBuffer.isView(O) ? {
					__type: "TypedArray",
					v: Array.from(new Uint8Array(O.buffer, O.byteOffset || 0, O.byteLength))
				} : typeof ArrayBuffer < "u" && O instanceof ArrayBuffer ? {
					__type: "ArrayBuffer",
					v: Array.from(new Uint8Array(O))
				} : O);
			} catch {
				return null;
			}
		}, S = /* @__PURE__ */ new Map(), C = [];
		for (let v = 0; v < p.length; v++) {
			const z = T(p[v]);
			if (z == null) C.push(v);
			else {
				const O = S.get(z);
				O ? O.push(v) : S.set(z, [v]);
			}
		}
		for (const v of t) {
			const z = b.get(v);
			if (z !== void 0 && !f[z]) {
				f[z] = !0;
				continue;
			}
			const O = T(v);
			let W = !1;
			if (O != null) {
				const re = S.get(O) || [];
				for (const ie of re) if (!f[ie] && Rt(v, p[ie], n, r + 1)) {
					f[ie] = !0, W = !0;
					break;
				}
				if (W) continue;
			}
			for (let re = 0; re < p.length; re++) if (!f[re] && Rt(v, p[re], n, r + 1)) {
				f[re] = !0, W = !0;
				break;
			}
			if (!W) return !1;
		}
		return !0;
	}
	const s = Object.keys(t), c = Object.keys(e);
	if (s.length !== c.length) return !1;
	for (let a = 0; a < s.length; a++) {
		const p = s[a];
		if (!Object.prototype.hasOwnProperty.call(e, p) || !Rt(t[p], e[p], n, r + 1)) return !1;
	}
	return !0;
}
var io = class {
	/**
	* @param {number|PowerTTLMapOptions} [defaultTTL=0] Default TTL in milliseconds for keys set
	*   without explicit ttl (0 = no expiry). Accepts either a positional number or an options
	*   object \`{ defaultTTL, onExpire }\` for consistency with the other helpers.
	* @param {PowerTTLMapOptions} [options={}] Options object (used when the first arg is a number).
	*/
	/**
	* @typedef {import('./jsdoc-types.js').PowerTTLMapOptions} PowerTTLMapOptions
	*/
	constructor(t = 0, e = {}) {
		t != null && typeof t == "object" && (e = t, t = 0), this._defaultTTL = Number(e?.defaultTTL ?? t) || 0, this._onExpire = typeof e?.onExpire == "function" ? e.onExpire : null, this._map = /* @__PURE__ */ new Map(), this._expirations = /* @__PURE__ */ new Map(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
	}
	/**
	* Resolve a TTL argument that may be either a positional number or an
	* options object \`{ ttl }\` (matching the \`PowerCache.set\` convention).
	* @private
	* @param {number|{ttl?:number}|undefined} ttl
	* @param {number} fallback Default TTL when \`ttl\` is nullish.
	* @returns {number} Resolved TTL in ms (0 = no expiry).
	*/
	_resolveTtl(t, e) {
		return t != null && typeof t == "object" && (t = t.ttl), t == null ? e : Number(t) || 0;
	}
	/**
	* Set a key with optional TTL (ms).
	* @param {any} key
	* @param {any} value
	* @param {number|{ttl?:number}} [ttl] TTL in milliseconds for this key. Accepts either a
	*   positional number or an options object \`{ ttl }\` for consistency with \`PowerCache.set\`.
	* @returns {this}
	*/
	set(t, e, n) {
		const r = this._resolveTtl(n, this._defaultTTL), i = r > 0 ? Ee() + r + 1 : 0, s = this._expirations.get(t) || 0;
		return this._map.set(t, {
			value: e,
			expiresAt: i
		}), i ? this._expirations.set(t, i) : this._expirations.delete(t), this._updateNextExpiryOnWrite(s, i), this;
	}
	/**
	* Internal: remove entry if expired; returns true if removed or missing.
	*
	* This helper centralizes expiry checks for \`get\`, \`has\`, and iteration
	* paths. When an entry is expired it is removed from the underlying map.
	*
	* @private
	* @param {any} key - Map key to check
	* @param {{value:any,expiresAt:number}|undefined} entry - Stored entry or undefined
	* @returns {boolean} true when the entry is missing or expired (and removed)
	*/
	_expireKey(t, e) {
		if (!e) return;
		const n = e.expiresAt || this._expirations.get(t) || 0;
		try {
			const r = e.value;
			if (this._map.delete(t), this._expirations.delete(t), n && this._nextExpiryAt === n && (this._nextExpiryDirty = !0), typeof this._onExpire == "function") try {
				this._onExpire(t, r);
			} catch {}
		} catch {}
	}
	_checkExpire(t, e) {
		return e ? e.expiresAt && Ee() > e.expiresAt ? (this._expireKey(t, e), !0) : !1 : !0;
	}
	/**
	* Get a value, returning \`undefined\` when missing or expired.
	* @param {any} key
	* @returns {any|undefined}
	*/
	get(t) {
		const e = this._map.get(t);
		if (!this._checkExpire(t, e)) return e.value;
	}
	/**
	* Check whether a key exists and is not expired.
	* @param {any} key
	* @returns {boolean}
	*/
	has(t) {
		const e = this._map.get(t);
		return !this._checkExpire(t, e);
	}
	/**
	* Delete a key.
	* @param {any} key
	* @returns {boolean}
	*/
	delete(t) {
		const e = this._expirations.get(t) || 0;
		return this._expirations.delete(t), e && this._nextExpiryAt === e && (this._nextExpiryDirty = !0), this._map.delete(t);
	}
	/**
	* Remove all entries.
	* @returns {void}
	*/
	clear() {
		this._map.clear(), this._expirations.clear(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
	}
	/**
	* Refresh TTL for an existing key. No-op if missing/expired.
	* @param {any} key
	* @param {number|{ttl?:number}} [ttl]
	* @returns {boolean} True when TTL refreshed.
	*/
	touch(t, e) {
		const n = this._map.get(t);
		if (!n) return !1;
		if (n.expiresAt && Ee() > n.expiresAt) return this._expireKey(t, n), !1;
		const r = n.expiresAt || 0, i = this._resolveTtl(e, this._defaultTTL);
		return n.expiresAt = i > 0 ? Ee() + i + 1 : 0, n.expiresAt ? this._expirations.set(t, n.expiresAt) : this._expirations.delete(t), this._updateNextExpiryOnWrite(r, n.expiresAt), !0;
	}
	/**
	* Number of non-expired entries (purges expired entries lazily).
	* @returns {number}
	*/
	get size() {
		if (!this._map.size) return 0;
		if (!this._expirations.size) return this._map.size;
		const t = Ee();
		return !this._nextExpiryDirty && this._nextExpiryAt && t <= this._nextExpiryAt ? this._map.size : (this._sweepExpirations(t), this._map.size);
	}
	_updateNextExpiryOnWrite(t, e) {
		t && this._nextExpiryAt === t && t !== e && (this._nextExpiryDirty = !0), e && (!this._nextExpiryAt || e < this._nextExpiryAt) && (this._nextExpiryAt = e);
	}
	_sweepExpirations(t) {
		let e = 0;
		for (const [n, r] of this._expirations) {
			if (r && t > r) {
				const i = this._map.get(n);
				this._expireKey(n, i);
				continue;
			}
			r && (!e || r < e) && (e = r);
		}
		this._nextExpiryAt = e, this._nextExpiryDirty = !1;
	}
	/**
	* Iterate entries [key, value] skipping expired entries.
	* @returns {IterableIterator<[any, any]>}
	*/
	*entries() {
		const t = Ee();
		for (const [e, n] of this._map) {
			if (n.expiresAt && t > n.expiresAt) {
				this._expireKey(e, n);
				continue;
			}
			yield [e, n.value];
		}
	}
	/**
	* Iterate keys of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*keys() {
		for (const [t] of this.entries()) yield t;
	}
	/**
	* Iterate values of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*values() {
		for (const [, t] of this.entries()) yield t;
	}
	/**
	* Call \`cb\` for each non-expired entry.
	* @param {Function} cb
	* @param {any} [thisArg]
	*/
	forEach(t, e) {
		for (const [n, r] of this.entries()) t.call(e, r, n, this);
	}
	/**
	* Default iterator yielding \`[key, value]\` pairs for non-expired entries.
	*/
	[Symbol.iterator]() {
		return this.entries();
	}
};
const so = new ro({ maxEntries: 500 }), Sn = new io(0);
let Xn = 3e5;
async function oo(t, e) {
	try {
		if (!t || Sn.has(t)) return null;
		try {
			const n = await so.getOrSetAsync(t, async () => {
				const r = await e();
				if (r == null) throw new Error("importCache: loader returned null");
				return r;
			});
			return Sn.delete(t), n;
		} catch {
			return Sn.set(t, 1, Xn), null;
		}
	} catch {
		return null;
	}
}
async function ao(t) {
	return await oo(t, async () => {
		try {
			return await import(t);
		} catch {
			return null;
		}
	});
}
let rt, it;
function lo() {
	return rt !== void 0 ? rt === !1 ? null : rt : typeof TextEncoder < "u" ? (rt = new TextEncoder(), rt) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (rt = { encode: (t) => new Uint8Array(Buffer.from(t)) }, rt) : (rt = !1, null);
}
function co() {
	return it !== void 0 ? it === !1 ? null : it : typeof TextDecoder < "u" ? (it = new TextDecoder(), it) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (it = { decode: (t) => Buffer.from(t).toString("utf8") }, it) : (it = !1, null);
}
const Yn = (t, e) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const n = e ?? JSON.stringify(t), r = lo();
	if (typeof r?.encode == "function") return r.encode(n);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, uo = (t) => {
	let e;
	if (t instanceof Uint8Array) e = t;
	else if (ArrayBuffer.isView(t)) e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) e = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) e = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const n = co();
	if (typeof n?.decode == "function") return JSON.parse(n.decode(e));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(e));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
var fo = (/* @__PURE__ */ bi((/* @__PURE__ */ di(((t, e) => {
	function n(l) {
		return l instanceof Map ? l.clear = l.delete = l.set = function() {
			throw new Error("map is read-only");
		} : l instanceof Set && (l.add = l.clear = l.delete = function() {
			throw new Error("set is read-only");
		}), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((m) => {
			const k = l[m], N = typeof k;
			(N === "object" || N === "function") && !Object.isFrozen(k) && n(k);
		}), l;
	}
	var r = class {
		/**
		* @param {CompiledMode} mode
		*/
		constructor(l) {
			l.data === void 0 && (l.data = {}), this.data = l.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(l) {
		return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function s(l, ...m) {
		const k = /* @__PURE__ */ Object.create(null);
		for (const N in l) k[N] = l[N];
		return m.forEach(function(N) {
			for (const B in N) k[B] = N[B];
		}), k;
	}
	const c = "</span>", a = (l) => !!l.scope, p = (l, { prefix: m }) => {
		if (l.startsWith("language:")) return l.replace("language:", "language-");
		if (l.includes(".")) {
			const k = l.split(".");
			return [\`\${m}\${k.shift()}\`, ...k.map((N, B) => \`\${N}\${"_".repeat(B + 1)}\`)].join(" ");
		}
		return \`\${m}\${l}\`;
	};
	var f = class {
		/**
		* Creates a new HTMLRenderer
		*
		* @param {Tree} parseTree - the parse tree (must support \`walk\` API)
		* @param {{classPrefix: string}} options
		*/
		constructor(l, m) {
			this.buffer = "", this.classPrefix = m.classPrefix, l.walk(this);
		}
		/**
		* Adds texts to the output stream
		*
		* @param {string} text */
		addText(l) {
			this.buffer += i(l);
		}
		/**
		* Adds a node open to the output stream (if needed)
		*
		* @param {Node} node */
		openNode(l) {
			if (!a(l)) return;
			const m = p(l.scope, { prefix: this.classPrefix });
			this.span(m);
		}
		/**
		* Adds a node close to the output stream (if needed)
		*
		* @param {Node} node */
		closeNode(l) {
			a(l) && (this.buffer += c);
		}
		/**
		* returns the accumulated buffer
		*/
		value() {
			return this.buffer;
		}
		/**
		* Builds a span element
		*
		* @param {string} className */
		span(l) {
			this.buffer += \`<span class="\${l}">\`;
		}
	};
	const b = (l = {}) => {
		const m = { children: [] };
		return Object.assign(m, l), m;
	};
	var T = class ci {
		constructor() {
			this.rootNode = b(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		/** @param {Node} node */
		add(m) {
			this.top.children.push(m);
		}
		/** @param {string} scope */
		openNode(m) {
			const k = b({ scope: m });
			this.add(k), this.stack.push(k);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		/**
		* @typedef { import("./html_renderer").Renderer } Renderer
		* @param {Renderer} builder
		*/
		walk(m) {
			return this.constructor._walk(m, this.rootNode);
		}
		/**
		* @param {Renderer} builder
		* @param {Node} node
		*/
		static _walk(m, k) {
			return typeof k == "string" ? m.addText(k) : k.children && (m.openNode(k), k.children.forEach((N) => this._walk(m, N)), m.closeNode(k)), m;
		}
		/**
		* @param {Node} node
		*/
		static _collapse(m) {
			typeof m != "string" && m.children && (m.children.every((k) => typeof k == "string") ? m.children = [m.children.join("")] : m.children.forEach((k) => {
				ci._collapse(k);
			}));
		}
	}, S = class extends T {
		/**
		* @param {*} options
		*/
		constructor(l) {
			super(), this.options = l;
		}
		/**
		* @param {string} text
		*/
		addText(l) {
			l !== "" && this.add(l);
		}
		/** @param {string} scope */
		startScope(l) {
			this.openNode(l);
		}
		endScope() {
			this.closeNode();
		}
		/**
		* @param {Emitter & {root: DataNode}} emitter
		* @param {string} name
		*/
		__addSublanguage(l, m) {
			const k = l.root;
			m && (k.scope = \`language:\${m}\`), this.add(k);
		}
		toHTML() {
			return new f(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function C(l) {
		return l ? typeof l == "string" ? l : l.source : null;
	}
	function v(l) {
		return W("(?=", l, ")");
	}
	function z(l) {
		return W("(?:", l, ")*");
	}
	function O(l) {
		return W("(?:", l, ")?");
	}
	function W(...l) {
		return l.map((m) => C(m)).join("");
	}
	function re(l) {
		const m = l[l.length - 1];
		return typeof m == "object" && m.constructor === Object ? (l.splice(l.length - 1, 1), m) : {};
	}
	function ie(...l) {
		return "(" + (re(l).capture ? "" : "?:") + l.map((m) => C(m)).join("|") + ")";
	}
	function me(l) {
		return new RegExp(l.toString() + "|").exec("").length - 1;
	}
	function Ne(l, m) {
		const k = l && l.exec(m);
		return k && k.index === 0;
	}
	const We = new RegExp(ie(/\\[(?:[^\\\\\\]]|\\\\.)*\\]/, /\\(\\?<(?![=!])[^>]+>/, /\\(\\?'[^']+'/, /\\(\\??/, /\\\\([1-9][0-9]*)/, /\\\\./));
	function _e(l, { joinWith: m }) {
		let k = 0;
		return l.map((N) => {
			k += 1;
			const B = k;
			let F = C(N), E = "";
			for (; F.length > 0;) {
				const w = We.exec(F);
				if (!w) {
					E += F;
					break;
				}
				E += F.substring(0, w.index), F = F.substring(w.index + w[0].length), w[0][0] === "\\\\" && w[1] ? E += "\\\\" + String(Number(w[1]) + B) : (E += w[0], (w[0] === "(" || /^\\(\\?[<']/.test(w[0])) && k++);
			}
			return E;
		}).map((N) => \`(\${N})\`).join(m);
	}
	const Me = /\\b\\B/, te = "[a-zA-Z]\\\\w*", Le = "[a-zA-Z_]\\\\w*", xt = "\\\\b\\\\d+(\\\\.\\\\d+)?", Nt = "(-?)(\\\\b0[xX][a-fA-F0-9]+|(\\\\b\\\\d+(\\\\.\\\\d*)?|\\\\.\\\\d+)([eE][-+]?\\\\d+)?)", Ge = "\\\\b(0b[01]+)", an = "!|!=|!==|%|%=|&|&&|&=|\\\\*|\\\\*=|\\\\+|\\\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\\\?|\\\\[|\\\\{|\\\\(|\\\\^|\\\\^=|\\\\||\\\\|=|\\\\|\\\\||~", qe = (l = {}) => {
		const m = /^#![ ]*\\//;
		return l.binary && (l.begin = W(m, /.*\\b/, l.binary, /\\b.*/)), s({
			scope: "meta",
			begin: m,
			end: /$/,
			relevance: 0,
			/** @type {ModeCallback} */
			"on:begin": (k, N) => {
				k.index !== 0 && N.ignoreMatch();
			}
		}, l);
	}, ot = {
		begin: "\\\\\\\\[\\\\s\\\\S]",
		relevance: 0
	}, Cn = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\\\n",
		contains: [ot]
	}, yt = {
		scope: "string",
		begin: "\\"",
		end: "\\"",
		illegal: "\\\\n",
		contains: [ot]
	}, Lt = { begin: /\\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\\b/ }, at = function(l, m, k = {}) {
		const N = s({
			scope: "comment",
			begin: l,
			end: m,
			contains: []
		}, k);
		N.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		const B = ie("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return N.contains.push({ begin: W(/[ ]+/, "(", B, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), N;
	}, In = at("//", "$"), Dn = at("/\\\\*", "\\\\*/"), zn = at("#", "$");
	var kt = /* @__PURE__ */ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: Cn,
		BACKSLASH_ESCAPE: ot,
		BINARY_NUMBER_MODE: {
			scope: "number",
			begin: Ge,
			relevance: 0
		},
		BINARY_NUMBER_RE: Ge,
		COMMENT: at,
		C_BLOCK_COMMENT_MODE: Dn,
		C_LINE_COMMENT_MODE: In,
		C_NUMBER_MODE: {
			scope: "number",
			begin: Nt,
			relevance: 0
		},
		C_NUMBER_RE: Nt,
		END_SAME_AS_BEGIN: function(l) {
			return Object.assign(l, {
				/** @type {ModeCallback} */
				"on:begin": (m, k) => {
					k.data._beginMatch = m[1];
				},
				/** @type {ModeCallback} */
				"on:end": (m, k) => {
					k.data._beginMatch !== m[1] && k.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: zn,
		IDENT_RE: te,
		MATCH_NOTHING_RE: Me,
		METHOD_GUARD: {
			begin: "\\\\.\\\\s*[a-zA-Z_]\\\\w*",
			relevance: 0
		},
		NUMBER_MODE: {
			scope: "number",
			begin: xt,
			relevance: 0
		},
		NUMBER_RE: xt,
		PHRASAL_WORDS_MODE: Lt,
		QUOTE_STRING_MODE: yt,
		REGEXP_MODE: {
			scope: "regexp",
			begin: /\\/(?=[^/\\n]*\\/)/,
			end: /\\/[gimuy]*/,
			contains: [ot, {
				begin: /\\[/,
				end: /\\]/,
				relevance: 0,
				contains: [ot]
			}]
		},
		RE_STARTERS_RE: an,
		SHEBANG: qe,
		TITLE_MODE: {
			scope: "title",
			begin: te,
			relevance: 0
		},
		UNDERSCORE_IDENT_RE: Le,
		UNDERSCORE_TITLE_MODE: {
			scope: "title",
			begin: Le,
			relevance: 0
		}
	});
	function ln(l, m) {
		l.input[l.index - 1] === "." && m.ignoreMatch();
	}
	function G(l, m) {
		l.className !== void 0 && (l.scope = l.className, delete l.className);
	}
	function Ct(l, m) {
		m && l.beginKeywords && (l.begin = "\\\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\\\.)(?=\\\\b|\\\\s)", l.__beforeBegin = ln, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
	}
	function q(l, m) {
		Array.isArray(l.illegal) && (l.illegal = ie(...l.illegal));
	}
	function It(l, m) {
		if (l.match) {
			if (l.begin || l.end) throw new Error("begin & end are not supported with match");
			l.begin = l.match, delete l.match;
		}
	}
	function Ae(l, m) {
		l.relevance === void 0 && (l.relevance = 1);
	}
	const lt = (l, m) => {
		if (!l.beforeMatch) return;
		if (l.starts) throw new Error("beforeMatch cannot be used with starts");
		const k = Object.assign({}, l);
		Object.keys(l).forEach((N) => {
			delete l[N];
		}), l.keywords = k.keywords, l.begin = W(k.beforeMatch, v(k.begin)), l.starts = {
			relevance: 0,
			contains: [Object.assign(k, { endsParent: !0 })]
		}, l.relevance = 0, delete k.beforeMatch;
	}, cn = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	], Ce = "keyword";
	function Dt(l, m, k = Ce) {
		const N = /* @__PURE__ */ Object.create(null);
		return typeof l == "string" ? B(k, l.split(" ")) : Array.isArray(l) ? B(k, l) : Object.keys(l).forEach(function(F) {
			Object.assign(N, Dt(l[F], m, F));
		}), N;
		function B(F, E) {
			m && (E = E.map((w) => w.toLowerCase())), E.forEach(function(w) {
				const M = w.split("|");
				N[M[0]] = [F, zt(M[0], M[1])];
			});
		}
	}
	function zt(l, m) {
		return m ? Number(m) : un(l) ? 0 : 1;
	}
	function un(l) {
		return cn.includes(l.toLowerCase());
	}
	const $t = {}, ae = (l) => {
		console.error(l);
	}, Ie = (l, ...m) => {
		console.log(\`WARN: \${l}\`, ...m);
	}, pe = (l, m) => {
		$t[\`\${l}/\${m}\`] || (console.log(\`Deprecated as of \${l}. \${m}\`), $t[\`\${l}/\${m}\`] = !0);
	}, Ze = /* @__PURE__ */ new Error();
	function ct(l, m, { key: k }) {
		let N = 0;
		const B = l[k], F = {}, E = {};
		for (let w = 1; w <= m.length; w++) E[w + N] = B[w], F[w + N] = !0, N += me(m[w - 1]);
		l[k] = E, l[k]._emit = F, l[k]._multi = !0;
	}
	function wt(l) {
		if (Array.isArray(l.begin)) {
			if (l.skip || l.excludeBegin || l.returnBegin) throw ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ze;
			if (typeof l.beginScope != "object" || l.beginScope === null) throw ae("beginScope must be object"), Ze;
			ct(l, l.begin, { key: "beginScope" }), l.begin = _e(l.begin, { joinWith: "" });
		}
	}
	function Bt(l) {
		if (Array.isArray(l.end)) {
			if (l.skip || l.excludeEnd || l.returnEnd) throw ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ze;
			if (typeof l.endScope != "object" || l.endScope === null) throw ae("endScope must be object"), Ze;
			ct(l, l.end, { key: "endScope" }), l.end = _e(l.end, { joinWith: "" });
		}
	}
	function Ve(l) {
		l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
	}
	function Tt(l) {
		Ve(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), wt(l), Bt(l);
	}
	function Et(l) {
		function m(E, w) {
			return new RegExp(C(E), "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (w ? "g" : ""));
		}
		class k {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(w, M) {
				M.position = this.position++, this.matchIndexes[this.matchAt] = M, this.regexes.push([M, w]), this.matchAt += me(w) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				const w = this.regexes.map((M) => M[1]);
				this.matcherRe = m(_e(w, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			/** @param {string} s */
			exec(w) {
				this.matcherRe.lastIndex = this.lastIndex;
				const M = this.matcherRe.exec(w);
				if (!M) return null;
				const J = M.findIndex((Xe, ht) => ht > 0 && Xe !== void 0), V = this.matchIndexes[J];
				return M.splice(0, J), Object.assign(M, V);
			}
		}
		class N {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(w) {
				if (this.multiRegexes[w]) return this.multiRegexes[w];
				const M = new k();
				return this.rules.slice(w).forEach(([J, V]) => M.addRule(J, V)), M.compile(), this.multiRegexes[w] = M, M;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(w, M) {
				this.rules.push([w, M]), M.type === "begin" && this.count++;
			}
			/** @param {string} s */
			exec(w) {
				const M = this.getMatcher(this.regexIndex);
				M.lastIndex = this.lastIndex;
				let J = M.exec(w);
				if (this.resumingScanAtSamePosition() && !(J && J.index === this.lastIndex)) {
					const V = this.getMatcher(0);
					V.lastIndex = this.lastIndex + 1, J = V.exec(w);
				}
				return J && (this.regexIndex += J.position + 1, this.regexIndex === this.count && this.considerAll()), J;
			}
		}
		function B(E) {
			const w = new N();
			return E.contains.forEach((M) => w.addRule(M.begin, {
				rule: M,
				type: "begin"
			})), E.terminatorEnd && w.addRule(E.terminatorEnd, { type: "end" }), E.illegal && w.addRule(E.illegal, { type: "illegal" }), w;
		}
		function F(E, w) {
			const M = E;
			if (E.isCompiled) return M;
			[
				G,
				It,
				Tt,
				lt
			].forEach((V) => V(E, w)), l.compilerExtensions.forEach((V) => V(E, w)), E.__beforeBegin = null, [
				Ct,
				q,
				Ae
			].forEach((V) => V(E, w)), E.isCompiled = !0;
			let J = null;
			return typeof E.keywords == "object" && E.keywords.$pattern && (E.keywords = Object.assign({}, E.keywords), J = E.keywords.$pattern, delete E.keywords.$pattern), J = J || /\\w+/, E.keywords && (E.keywords = Dt(E.keywords, l.case_insensitive)), M.keywordPatternRe = m(J, !0), w && (E.begin || (E.begin = /\\B|\\b/), M.beginRe = m(M.begin), !E.end && !E.endsWithParent && (E.end = /\\B|\\b/), E.end && (M.endRe = m(M.end)), M.terminatorEnd = C(M.end) || "", E.endsWithParent && w.terminatorEnd && (M.terminatorEnd += (E.end ? "|" : "") + w.terminatorEnd)), E.illegal && (M.illegalRe = m(E.illegal)), E.contains || (E.contains = []), E.contains = [].concat(...E.contains.map(function(V) {
				return hn(V === "self" ? E : V);
			})), E.contains.forEach(function(V) {
				F(V, M);
			}), E.starts && F(E.starts, w), M.matcher = B(M), M;
		}
		if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self")) throw new Error("ERR: contains \`self\` is not supported at the top-level of a language.  See documentation.");
		return l.classNameAliases = s(l.classNameAliases || {}), F(l);
	}
	function Ut(l) {
		return l ? l.endsWithParent || Ut(l.starts) : !1;
	}
	function hn(l) {
		return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(m) {
			return s(l, { variants: null }, m);
		})), l.cachedVariants ? l.cachedVariants : Ut(l) ? s(l, { starts: l.starts ? s(l.starts) : null }) : Object.isFrozen(l) ? s(l) : l;
	}
	var pn = "11.12.0", jt = class extends Error {
		constructor(l, m) {
			super(l), this.name = "HTMLInjectionError", this.html = m;
		}
	};
	const ut = i, $e = s, Be = /* @__PURE__ */ Symbol("nomatch"), fn = 7, Ft = function(l) {
		const m = /* @__PURE__ */ Object.create(null), k = /* @__PURE__ */ Object.create(null), N = [];
		let B = !0;
		const F = "Could not find the language '{}', did you forget to load/include a language module?", E = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		};
		let w = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\\blang(?:uage)?-([\\w-]+)\\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: S
		};
		function M(x) {
			return w.noHighlightRe.test(x);
		}
		function J(x) {
			let R = x.className + " ";
			R += x.parentNode ? x.parentNode.className : "";
			const D = w.languageDetectRe.exec(R);
			if (D) {
				const H = De(D[1]);
				return H || (Ie(F.replace("{}", D[1])), Ie("Falling back to no-highlight mode for this block.", x)), H ? D[1] : "no-highlight";
			}
			return R.split(/\\s+/).find((H) => M(H) || De(H));
		}
		function V(x, R, D) {
			let H = "", Y = "";
			typeof R == "object" ? (H = x, D = R.ignoreIllegals, Y = R.language) : (pe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), pe("10.7.0", \`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277\`), Y = x, H = R), D === void 0 && (D = !0);
			const be = {
				code: H,
				language: Y
			};
			je("before:highlight", be);
			const fe = be.result ? be.result : Xe(be.language, be.code, D);
			return fe.code = be.code, je("after:highlight", fe), fe;
		}
		function Xe(x, R, D, H) {
			const Y = /* @__PURE__ */ Object.create(null);
			function be(h, g) {
				return h.keywords[g];
			}
			function fe() {
				if (!P.keywords) {
					K.addText(U);
					return;
				}
				let h = 0;
				P.keywordPatternRe.lastIndex = 0;
				let g = P.keywordPatternRe.exec(U), y = "";
				for (; g;) {
					y += U.substring(h, g.index);
					const A = Se.case_insensitive ? g[0].toLowerCase() : g[0], I = be(P, A);
					if (I) {
						const [Q, ue] = I;
						if (K.addText(y), y = "", Y[A] = (Y[A] || 0) + 1, Y[A] <= fn && (_ += ue), Q.startsWith("_")) y += g[0];
						else {
							const Je = Se.classNameAliases[Q] || Q;
							Pe(g[0], Je);
						}
					} else y += g[0];
					h = P.keywordPatternRe.lastIndex, g = P.keywordPatternRe.exec(U);
				}
				y += U.substring(h), K.addText(y);
			}
			function xe() {
				if (U === "") return;
				let h = null;
				if (typeof P.subLanguage == "string") {
					if (!m[P.subLanguage]) {
						K.addText(U);
						return;
					}
					h = Xe(P.subLanguage, U, !0, Vt[P.subLanguage]), Vt[P.subLanguage] = h._top;
				} else h = Ht(U, P.subLanguage.length ? P.subLanguage : null);
				P.relevance > 0 && (_ += h.relevance), K.__addSublanguage(h._emitter, h.language);
			}
			function le() {
				P.subLanguage != null ? xe() : fe(), U = "";
			}
			function Pe(h, g) {
				h !== "" && (K.startScope(g), K.addText(h), K.endScope());
			}
			function Ke(h, g) {
				let y = 1;
				const A = g.length - 1;
				for (; y <= A;) {
					if (!h._emit[y]) {
						y++;
						continue;
					}
					const I = Se.classNameAliases[h[y]] || h[y], Q = g[y];
					I ? Pe(Q, I) : (U = Q, fe(), U = ""), y++;
				}
			}
			function ye(h, g) {
				return h.scope && typeof h.scope == "string" && K.openNode(Se.classNameAliases[h.scope] || h.scope), h.beginScope && (h.beginScope._wrap ? (Pe(U, Se.classNameAliases[h.beginScope._wrap] || h.beginScope._wrap), U = "") : h.beginScope._multi && (Ke(h.beginScope, g), U = "")), P = Object.create(h, { parent: { value: P } }), P;
			}
			function yn(h, g, y) {
				let A = Ne(h.endRe, y);
				if (A) {
					if (h["on:end"]) {
						const I = new r(h);
						h["on:end"](g, I), I.isMatchIgnored && (A = !1);
					}
					if (A) {
						for (; h.endsParent && h.parent;) h = h.parent;
						return h;
					}
				}
				if (h.endsWithParent) return yn(h.parent, g, y);
			}
			function At(h) {
				return P.matcher.regexIndex === 0 ? (U += h[0], 1) : (d = !0, 0);
			}
			function jn(h) {
				const g = h[0], y = h.rule, A = new r(y), I = [y.__beforeBegin, y["on:begin"]];
				for (const Q of I) if (Q && (Q(h, A), A.isMatchIgnored)) return At(g);
				return y.skip ? U += g : (y.excludeBegin && (U += g), le(), !y.returnBegin && !y.excludeBegin && (U = g)), ye(y, h), y.returnBegin ? 0 : g.length;
			}
			function kn(h) {
				const g = h[0], y = R.substring(h.index), A = yn(P, h, y);
				if (!A) return Be;
				const I = P;
				P.endScope && P.endScope._wrap ? (le(), Pe(g, P.endScope._wrap)) : P.endScope && P.endScope._multi ? (le(), Ke(P.endScope, h)) : I.skip ? U += g : (I.returnEnd || I.excludeEnd || (U += g), le(), I.excludeEnd && (U = g));
				do
					P.scope && K.closeNode(), !P.skip && !P.subLanguage && (_ += P.relevance), P = P.parent;
				while (P !== A.parent);
				return A.starts && ye(A.starts, h), I.returnEnd ? 0 : g.length;
			}
			function Qe() {
				const h = [];
				for (let g = P; g !== Se; g = g.parent) g.scope && h.unshift(g.scope);
				h.forEach((g) => K.openNode(g));
			}
			let gt = {};
			function qt(h, g) {
				const y = g && g[0];
				if (U += h, y == null) return le(), 0;
				if (gt.type === "begin" && g.type === "end" && gt.index === g.index && y === "") {
					if (U += R.slice(g.index, g.index + 1), !B) {
						const A = /* @__PURE__ */ new Error(\`0 width match regex (\${x})\`);
						throw A.languageName = x, A.badRule = gt.rule, A;
					}
					return 1;
				}
				if (gt = g, g.type === "begin") return jn(g);
				if (g.type === "illegal" && !D) {
					const A = /* @__PURE__ */ new Error("Illegal lexeme \\"" + y + "\\" for mode \\"" + (P.scope || "<unnamed>") + "\\"");
					throw A.mode = P, A;
				} else if (g.type === "end") {
					const A = kn(g);
					if (A !== Be) return A;
				}
				if (g.type === "illegal" && y === "") return g.index === R.length || (U += \`
\`), 1;
				if (u > 1e5 && u > g.index * 3) throw /* @__PURE__ */ new Error("potential infinite loop, way more iterations than matches");
				return U += y, y.length;
			}
			const Se = De(x);
			if (!Se) throw ae(F.replace("{}", x)), /* @__PURE__ */ new Error("Unknown language: \\"" + x + "\\"");
			const wn = Et(Se);
			let Zt = "", P = H || wn;
			const Vt = {}, K = new w.__emitter(w);
			Qe();
			let U = "", _ = 0, o = 0, u = 0, d = !1;
			try {
				if (Se.__emitTokens) Se.__emitTokens(R, K);
				else {
					for (P.matcher.considerAll();;) {
						u++, d ? d = !1 : P.matcher.considerAll(), P.matcher.lastIndex = o;
						const h = P.matcher.exec(R);
						if (!h) break;
						const g = qt(R.substring(o, h.index), h);
						o = h.index + g;
					}
					qt(R.substring(o));
				}
				return K.finalize(), Zt = K.toHTML(), {
					language: x,
					value: Zt,
					relevance: _,
					illegal: !1,
					_emitter: K,
					_top: P
				};
			} catch (h) {
				if (h.message && h.message.includes("Illegal")) return {
					language: x,
					value: ut(R),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: h.message,
						index: o,
						context: R.slice(o - 100, o + 100),
						mode: h.mode,
						resultSoFar: Zt
					},
					_emitter: K
				};
				if (B) return {
					language: x,
					value: ut(R),
					illegal: !1,
					relevance: 0,
					errorRaised: h,
					_emitter: K,
					_top: P
				};
				throw h;
			}
		}
		function ht(x) {
			const R = {
				value: ut(x),
				illegal: !1,
				relevance: 0,
				_top: E,
				_emitter: new w.__emitter(w)
			};
			return R._emitter.addText(x), R;
		}
		function Ht(x, R) {
			R = R || w.languages || Object.keys(m);
			const D = ht(x), H = R.filter(De).filter(bn).map((xe) => Xe(xe, x, !1));
			H.unshift(D);
			const [Y, be] = H.sort((xe, le) => {
				if (xe.relevance !== le.relevance) return le.relevance - xe.relevance;
				if (xe.language && le.language) {
					if (De(xe.language).supersetOf === le.language) return 1;
					if (De(le.language).supersetOf === xe.language) return -1;
				}
				return 0;
			}), fe = Y;
			return fe.secondBest = be, fe;
		}
		function pt(x, R, D) {
			const H = R && k[R] || D;
			x.classList.add("hljs"), x.classList.add(\`language-\${H}\`);
		}
		function Wt(x) {
			let R = null;
			const D = J(x);
			if (M(D)) return;
			if (je("before:highlightElement", {
				el: x,
				language: D
			}), x.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset \`dataset.highlighted\`.", x);
				return;
			}
			if (x.children.length > 0 && (w.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(x)), w.throwUnescapedHTML)) throw new jt("One of your code blocks includes unescaped HTML.", x.innerHTML);
			R = x;
			const H = R.textContent, Y = D ? V(H, {
				language: D,
				ignoreIllegals: !0
			}) : Ht(H);
			x.innerHTML = Y.value, x.dataset.highlighted = "yes", pt(x, D, Y.language), x.result = {
				language: Y.language,
				re: Y.relevance,
				relevance: Y.relevance
			}, Y.secondBest && (x.secondBest = {
				language: Y.secondBest.language,
				relevance: Y.secondBest.relevance
			}), je("after:highlightElement", {
				el: x,
				result: Y,
				text: H
			});
		}
		function Bn(x) {
			w = $e(w, x);
		}
		const X = () => {
			ft(), pe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function Ye() {
			ft(), pe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let gn = !1;
		function ft() {
			function x() {
				ft();
			}
			if (document.readyState === "loading") {
				gn || window.addEventListener("DOMContentLoaded", x, !1), gn = !0;
				return;
			}
			document.querySelectorAll(w.cssSelector).forEach(Wt);
		}
		function Gt(x, R) {
			let D = null;
			try {
				D = R(l);
			} catch (H) {
				if (ae("Language definition for '{}' could not be registered.".replace("{}", x)), B) ae(H);
				else throw H;
				D = E;
			}
			D.name || (D.name = x), m[x] = D, D.rawDefinition = R.bind(null, l), D.aliases && _n(D.aliases, { languageName: x });
		}
		function dn(x) {
			delete m[x];
			for (const R of Object.keys(k)) k[R] === x && delete k[R];
		}
		function mn() {
			return Object.keys(m);
		}
		function De(x) {
			return x = (x || "").toLowerCase(), m[x] || m[k[x]];
		}
		function _n(x, { languageName: R }) {
			typeof x == "string" && (x = [x]), x.forEach((D) => {
				k[D.toLowerCase()] = R;
			});
		}
		function bn(x) {
			const R = De(x);
			return R && !R.disableAutodetect;
		}
		function Un(x) {
			x["before:highlightBlock"] && !x["before:highlightElement"] && (x["before:highlightElement"] = (R) => {
				x["before:highlightBlock"](Object.assign({ block: R.el }, R));
			}), x["after:highlightBlock"] && !x["after:highlightElement"] && (x["after:highlightElement"] = (R) => {
				x["after:highlightBlock"](Object.assign({ block: R.el }, R));
			});
		}
		function ze(x) {
			Un(x), N.push(x);
		}
		function xn(x) {
			const R = N.indexOf(x);
			R !== -1 && N.splice(R, 1);
		}
		function je(x, R) {
			const D = x;
			N.forEach(function(H) {
				H[D] && H[D](R);
			});
		}
		function Fe(x) {
			return pe("10.7.0", "highlightBlock will be removed entirely in v12.0"), pe("10.7.0", "Please use highlightElement now."), Wt(x);
		}
		Object.assign(l, {
			highlight: V,
			highlightAuto: Ht,
			highlightAll: ft,
			highlightElement: Wt,
			highlightBlock: Fe,
			configure: Bn,
			initHighlighting: X,
			initHighlightingOnLoad: Ye,
			registerLanguage: Gt,
			unregisterLanguage: dn,
			listLanguages: mn,
			getLanguage: De,
			registerAliases: _n,
			autoDetection: bn,
			inherit: $e,
			addPlugin: ze,
			removePlugin: xn
		}), l.debugMode = function() {
			B = !1;
		}, l.safeMode = function() {
			B = !0;
		}, l.versionString = pn, l.regex = {
			concat: W,
			lookahead: v,
			either: ie,
			optional: O,
			anyNumberOfTimes: z
		};
		for (const x in kt) typeof kt[x] == "object" && n(kt[x]);
		return Object.assign(l, kt), l;
	}, Ue = Ft({});
	Ue.newInstance = () => Ft({}), e.exports = Ue, Ue.HighlightJS = Ue, Ue.default = Ue;
})))())).default;
const en = mr && (j || mr) || void 0, Wr = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, go = /* @__PURE__ */ new Set([
	"bash",
	"sh",
	"zsh",
	"javascript",
	"js",
	"python",
	"py",
	"php",
	"java",
	"c",
	"cpp",
	"rust",
	"go",
	"ruby",
	"perl",
	"r",
	"scala",
	"swift",
	"kotlin",
	"cs",
	"csharp",
	"html",
	"css",
	"json",
	"xml",
	"yaml",
	"yml",
	"dockerfile",
	"docker"
]), mo = {
	1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
	2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
	3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
	4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
	5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
	6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
};
let de = null;
function _o(t) {
	try {
		if (!t && t !== 0) return "";
		const e = String(t), n = {
			amp: "&",
			lt: "<",
			gt: ">",
			quot: "\\"",
			apos: "'",
			nbsp: " "
		};
		return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (r, i) => {
			if (!i) return r;
			if (i[0] === "#") try {
				return i[1] === "x" || i[1] === "X" ? String.fromCharCode(parseInt(i.slice(2), 16)) : String.fromCharCode(parseInt(i.slice(1), 10));
			} catch {
				return r;
			}
			return n[i] !== void 0 ? n[i] : r;
		});
	} catch {
		return String(t ?? "");
	}
}
function bo(t, e) {
	const n = String(t ?? "");
	if (!n || n.length <= e) return [n];
	const r = /^#{1,6}\\s.*$/gm, i = [];
	let s;
	for (; (s = r.exec(n)) !== null;) i.push(s.index);
	if (!i.length || i.length < 2) {
		const f = [];
		for (let b = 0; b < n.length; b += e) f.push(n.slice(b, b + e));
		return f;
	}
	const c = [];
	i[0] > 0 && c.push(n.slice(0, i[0]));
	for (let f = 0; f < i.length; f++) {
		const b = i[f], T = f + 1 < i.length ? i[f + 1] : n.length;
		c.push(n.slice(b, T));
	}
	const a = [];
	let p = "";
	for (const f of c) {
		if (!p && f.length >= e) {
			a.push(f);
			continue;
		}
		p.length + f.length <= e ? p += f : (p && a.push(p), p = f);
	}
	return p && a.push(p), a;
}
function xo(t) {
	try {
		return String(t ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
	} catch {
		return "heading";
	}
}
async function yo(t) {
	return await ao(t);
}
async function lr() {
	if (de) return de;
	try {
		de = fo || null;
	} catch {
		de = null;
	}
	return de;
}
function ko(t) {
	return t <= 2 ? "has-text-weight-bold" : t <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
}
function ui(t, e = /* @__PURE__ */ new Map()) {
	const n = [];
	let r = String(t ?? "");
	return r = r.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (i, s, c, a) => {
		const p = Number(s);
		let f = a.replace(/<[^>]+>/g, "").trim();
		try {
			f = _o(f);
		} catch {}
		let b = null;
		const T = (c || "").match(/\\sid="([^"]+)"/);
		T && (b = T[1]);
		const S = b || xo(f) || "heading", C = (e.get(S) || 0) + 1;
		e.set(S, C);
		const v = C === 1 ? S : S + "-" + C;
		n.push({
			level: p,
			text: f,
			id: v
		});
		const z = \`\${mo[p]} \${ko(p)}\`.trim();
		return \`<h\${p} \${((c || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${z}"\`).trim()}>\${a}</h\${p}>\`;
	}), r = r.replace(/<img([^>]*)>/g, (i, s) => /\\bloading=/.test(s) ? \`<img\${s}>\` : /\\bdata-want-lazy=/.test(s) ? \`<img\${s}>\` : \`<img\${s} loading="lazy">\`), {
		html: r,
		toc: n
	};
}
async function wo(t, e) {
	try {
		if (!await lr()) return {
			type: "register-error",
			name: t,
			error: "hljs unavailable"
		};
		const n = await yo(e), r = n ? n.default || n : null;
		return r ? (de.registerLanguage(t, r), {
			type: "registered",
			name: t
		}) : {
			type: "register-error",
			name: t,
			error: "failed to import language module"
		};
	} catch (n) {
		return {
			type: "register-error",
			name: t,
			error: String(n)
		};
	}
}
function To(t, e, n) {
	const r = /* @__PURE__ */ new Set(), i = new RegExp(Wr.source, Wr.flags);
	let s;
	for (; s = i.exec(e || "");) {
		if (!s[1]) continue;
		const c = String(s[1]).toLowerCase();
		if (c && (c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(c) && r.add(c), go.has(c) && r.add(c), n?.length)) try {
			n.indexOf(c) !== -1 && r.add(c);
		} catch {}
	}
	return {
		id: t,
		result: Array.from(r)
	};
}
async function Eo(t, e = /* @__PURE__ */ new Map()) {
	const { content: n, data: r } = li(t || "");
	await lr().catch(() => {});
	const i = ui(ai.sanitize(en.parse(n)), e);
	return {
		html: i.html,
		meta: r || {},
		toc: i.toc
	};
}
async function Ao(t, e) {
	const n = t.id, r = Number(t.chunkSize) || 65536, { content: i, data: s } = li(t.md || "");
	await lr().catch(() => {});
	const c = bo(i, r), a = /* @__PURE__ */ new Map();
	for (let f = 0; f < c.length; f++) {
		const b = ui(ai.sanitize(en.parse(c[f])), a);
		e({
			id: n,
			type: "chunk",
			html: b.html,
			toc: b.toc,
			index: f,
			isLast: f === c.length - 1
		});
	}
	const p = {
		id: n,
		type: "done",
		meta: s || {}
	};
	return e(p), p;
}
function dt(t, e) {
	typeof postMessage == "function" && (e?.length ? postMessage(t, e) : postMessage(t));
}
function So(t = globalThis) {
	const e = async (n) => {
		let r;
		try {
			r = uo(n.data);
		} catch {}
		r = r || n.data || {};
		const { correlationId: i } = r, s = (a) => {
			if (i != null) {
				const p = Yn({
					correlationId: i,
					response: a
				});
				dt(p, [p.buffer]);
			} else dt({
				id: r.id,
				result: a
			});
		}, c = (a) => {
			if (i != null) {
				const p = Yn({
					correlationId: i,
					response: { error: String(a) }
				});
				dt(p, [p.buffer]);
			} else dt({
				id: r.id,
				error: String(a)
			});
		};
		try {
			if (r?.type === "register") {
				const a = await wo(r?.name, r?.url);
				if (i != null) s(a);
				else {
					const p = Yn(a);
					dt(p, [p.buffer]);
				}
				return;
			}
			if (r?.type === "detect") {
				dt(To(r?.id, r?.md || "", r?.supported || []));
				return;
			}
			if (r?.type === "stream") {
				await Ao(r, (a) => dt(a));
				return;
			}
			s(await Eo(r?.md || "", /* @__PURE__ */ new Map()));
		} catch (a) {
			c(a);
		}
	};
	return t && (t.onmessage = e), e;
}
en && typeof en.setOptions == "function" && en.setOptions({
	gfm: !0,
	headerIds: !0,
	mangle: !1,
	highlighted: (t, e) => {
		try {
			return de && e && typeof de.getLanguage == "function" && de.getLanguage(e) ? de.highlight(t, { language: e }).value : de && typeof de.getLanguage == "function" && de.getLanguage("plaintext") ? de.highlight(t, { language: "plaintext" }).value : t;
		} catch {
			return t;
		}
	}
});
So(globalThis);
`, Gs = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", yl], { type: "text/javascript;charset=utf-8" });
function wh(e) {
  let t;
  try {
    if (t = Gs && (self.URL || self.webkitURL).createObjectURL(Gs), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(yl), {
      type: "module",
      name: e?.name
    });
  }
}
var Er = {
  100: "💯",
  1234: "🔢",
  grinning: "😀",
  grimacing: "😬",
  grin: "😁",
  joy: "😂",
  rofl: "🤣",
  partying: "🥳",
  smiley: "😃",
  smile: "😄",
  sweat_smile: "😅",
  laughing: "😆",
  innocent: "😇",
  wink: "😉",
  blush: "😊",
  slightly_smiling_face: "🙂",
  upside_down_face: "🙃",
  relaxed: "☺️",
  yum: "😋",
  relieved: "😌",
  heart_eyes: "😍",
  smiling_face_with_three_hearts: "🥰",
  kissing_heart: "😘",
  kissing: "😗",
  kissing_smiling_eyes: "😙",
  kissing_closed_eyes: "😚",
  stuck_out_tongue_winking_eye: "😜",
  zany: "🤪",
  raised_eyebrow: "🤨",
  monocle: "🧐",
  stuck_out_tongue_closed_eyes: "😝",
  stuck_out_tongue: "😛",
  money_mouth_face: "🤑",
  nerd_face: "🤓",
  sunglasses: "😎",
  star_struck: "🤩",
  clown_face: "🤡",
  cowboy_hat_face: "🤠",
  hugs: "🤗",
  smirk: "😏",
  no_mouth: "😶",
  neutral_face: "😐",
  expressionless: "😑",
  unamused: "😒",
  roll_eyes: "🙄",
  thinking: "🤔",
  lying_face: "🤥",
  hand_over_mouth: "🤭",
  shushing: "🤫",
  symbols_over_mouth: "🤬",
  exploding_head: "🤯",
  flushed: "😳",
  disappointed: "😞",
  worried: "😟",
  angry: "😠",
  rage: "😡",
  pensive: "😔",
  confused: "😕",
  slightly_frowning_face: "🙁",
  frowning_face: "☹",
  persevere: "😣",
  confounded: "😖",
  tired_face: "😫",
  weary: "😩",
  pleading: "🥺",
  triumph: "😤",
  open_mouth: "😮",
  scream: "😱",
  fearful: "😨",
  cold_sweat: "😰",
  hushed: "😯",
  frowning: "😦",
  anguished: "😧",
  cry: "😢",
  disappointed_relieved: "😥",
  drooling_face: "🤤",
  sleepy: "😪",
  sweat: "😓",
  hot: "🥵",
  cold: "🥶",
  sob: "😭",
  dizzy_face: "😵",
  astonished: "😲",
  zipper_mouth_face: "🤐",
  nauseated_face: "🤢",
  sneezing_face: "🤧",
  vomiting: "🤮",
  mask: "😷",
  face_with_thermometer: "🤒",
  face_with_head_bandage: "🤕",
  woozy: "🥴",
  sleeping: "😴",
  zzz: "💤",
  poop: "💩",
  smiling_imp: "😈",
  imp: "👿",
  japanese_ogre: "👹",
  japanese_goblin: "👺",
  skull: "💀",
  ghost: "👻",
  alien: "👽",
  robot: "🤖",
  smiley_cat: "😺",
  smile_cat: "😸",
  joy_cat: "😹",
  heart_eyes_cat: "😻",
  smirk_cat: "😼",
  kissing_cat: "😽",
  scream_cat: "🙀",
  crying_cat_face: "😿",
  pouting_cat: "😾",
  palms_up: "🤲",
  raised_hands: "🙌",
  clap: "👏",
  wave: "👋",
  call_me_hand: "🤙",
  "+1": "👍",
  "-1": "👎",
  facepunch: "👊",
  fist: "✊",
  fist_left: "🤛",
  fist_right: "🤜",
  v: "✌",
  ok_hand: "👌",
  raised_hand: "✋",
  raised_back_of_hand: "🤚",
  open_hands: "👐",
  muscle: "💪",
  pray: "🙏",
  foot: "🦶",
  leg: "🦵",
  handshake: "🤝",
  point_up: "☝",
  point_up_2: "👆",
  point_down: "👇",
  point_left: "👈",
  point_right: "👉",
  fu: "🖕",
  raised_hand_with_fingers_splayed: "🖐",
  love_you: "🤟",
  metal: "🤘",
  crossed_fingers: "🤞",
  vulcan_salute: "🖖",
  writing_hand: "✍",
  selfie: "🤳",
  nail_care: "💅",
  lips: "👄",
  tooth: "🦷",
  tongue: "👅",
  ear: "👂",
  nose: "👃",
  eye: "👁",
  eyes: "👀",
  brain: "🧠",
  bust_in_silhouette: "👤",
  busts_in_silhouette: "👥",
  speaking_head: "🗣",
  baby: "👶",
  child: "🧒",
  boy: "👦",
  girl: "👧",
  adult: "🧑",
  man: "👨",
  woman: "👩",
  blonde_woman: "👱‍♀️",
  blonde_man: "👱",
  bearded_person: "🧔",
  older_adult: "🧓",
  older_man: "👴",
  older_woman: "👵",
  man_with_gua_pi_mao: "👲",
  woman_with_headscarf: "🧕",
  woman_with_turban: "👳‍♀️",
  man_with_turban: "👳",
  policewoman: "👮‍♀️",
  policeman: "👮",
  construction_worker_woman: "👷‍♀️",
  construction_worker_man: "👷",
  guardswoman: "💂‍♀️",
  guardsman: "💂",
  female_detective: "🕵️‍♀️",
  male_detective: "🕵",
  woman_health_worker: "👩‍⚕️",
  man_health_worker: "👨‍⚕️",
  woman_farmer: "👩‍🌾",
  man_farmer: "👨‍🌾",
  woman_cook: "👩‍🍳",
  man_cook: "👨‍🍳",
  woman_student: "👩‍🎓",
  man_student: "👨‍🎓",
  woman_singer: "👩‍🎤",
  man_singer: "👨‍🎤",
  woman_teacher: "👩‍🏫",
  man_teacher: "👨‍🏫",
  woman_factory_worker: "👩‍🏭",
  man_factory_worker: "👨‍🏭",
  woman_technologist: "👩‍💻",
  man_technologist: "👨‍💻",
  woman_office_worker: "👩‍💼",
  man_office_worker: "👨‍💼",
  woman_mechanic: "👩‍🔧",
  man_mechanic: "👨‍🔧",
  woman_scientist: "👩‍🔬",
  man_scientist: "👨‍🔬",
  woman_artist: "👩‍🎨",
  man_artist: "👨‍🎨",
  woman_firefighter: "👩‍🚒",
  man_firefighter: "👨‍🚒",
  woman_pilot: "👩‍✈️",
  man_pilot: "👨‍✈️",
  woman_astronaut: "👩‍🚀",
  man_astronaut: "👨‍🚀",
  woman_judge: "👩‍⚖️",
  man_judge: "👨‍⚖️",
  woman_superhero: "🦸‍♀️",
  man_superhero: "🦸‍♂️",
  woman_supervillain: "🦹‍♀️",
  man_supervillain: "🦹‍♂️",
  mrs_claus: "🤶",
  santa: "🎅",
  sorceress: "🧙‍♀️",
  wizard: "🧙‍♂️",
  woman_elf: "🧝‍♀️",
  man_elf: "🧝‍♂️",
  woman_vampire: "🧛‍♀️",
  man_vampire: "🧛‍♂️",
  woman_zombie: "🧟‍♀️",
  man_zombie: "🧟‍♂️",
  woman_genie: "🧞‍♀️",
  man_genie: "🧞‍♂️",
  mermaid: "🧜‍♀️",
  merman: "🧜‍♂️",
  woman_fairy: "🧚‍♀️",
  man_fairy: "🧚‍♂️",
  angel: "👼",
  pregnant_woman: "🤰",
  breastfeeding: "🤱",
  princess: "👸",
  prince: "🤴",
  bride_with_veil: "👰",
  man_in_tuxedo: "🤵",
  running_woman: "🏃‍♀️",
  running_man: "🏃",
  walking_woman: "🚶‍♀️",
  walking_man: "🚶",
  dancer: "💃",
  man_dancing: "🕺",
  dancing_women: "👯",
  dancing_men: "👯‍♂️",
  couple: "👫",
  two_men_holding_hands: "👬",
  two_women_holding_hands: "👭",
  bowing_woman: "🙇‍♀️",
  bowing_man: "🙇",
  man_facepalming: "🤦‍♂️",
  woman_facepalming: "🤦‍♀️",
  woman_shrugging: "🤷",
  man_shrugging: "🤷‍♂️",
  tipping_hand_woman: "💁",
  tipping_hand_man: "💁‍♂️",
  no_good_woman: "🙅",
  no_good_man: "🙅‍♂️",
  ok_woman: "🙆",
  ok_man: "🙆‍♂️",
  raising_hand_woman: "🙋",
  raising_hand_man: "🙋‍♂️",
  pouting_woman: "🙎",
  pouting_man: "🙎‍♂️",
  frowning_woman: "🙍",
  frowning_man: "🙍‍♂️",
  haircut_woman: "💇",
  haircut_man: "💇‍♂️",
  massage_woman: "💆",
  massage_man: "💆‍♂️",
  woman_in_steamy_room: "🧖‍♀️",
  man_in_steamy_room: "🧖‍♂️",
  couple_with_heart_woman_man: "💑",
  couple_with_heart_woman_woman: "👩‍❤️‍👩",
  couple_with_heart_man_man: "👨‍❤️‍👨",
  couplekiss_man_woman: "💏",
  couplekiss_woman_woman: "👩‍❤️‍💋‍👩",
  couplekiss_man_man: "👨‍❤️‍💋‍👨",
  family_man_woman_boy: "👪",
  family_man_woman_girl: "👨‍👩‍👧",
  family_man_woman_girl_boy: "👨‍👩‍👧‍👦",
  family_man_woman_boy_boy: "👨‍👩‍👦‍👦",
  family_man_woman_girl_girl: "👨‍👩‍👧‍👧",
  family_woman_woman_boy: "👩‍👩‍👦",
  family_woman_woman_girl: "👩‍👩‍👧",
  family_woman_woman_girl_boy: "👩‍👩‍👧‍👦",
  family_woman_woman_boy_boy: "👩‍👩‍👦‍👦",
  family_woman_woman_girl_girl: "👩‍👩‍👧‍👧",
  family_man_man_boy: "👨‍👨‍👦",
  family_man_man_girl: "👨‍👨‍👧",
  family_man_man_girl_boy: "👨‍👨‍👧‍👦",
  family_man_man_boy_boy: "👨‍👨‍👦‍👦",
  family_man_man_girl_girl: "👨‍👨‍👧‍👧",
  family_woman_boy: "👩‍👦",
  family_woman_girl: "👩‍👧",
  family_woman_girl_boy: "👩‍👧‍👦",
  family_woman_boy_boy: "👩‍👦‍👦",
  family_woman_girl_girl: "👩‍👧‍👧",
  family_man_boy: "👨‍👦",
  family_man_girl: "👨‍👧",
  family_man_girl_boy: "👨‍👧‍👦",
  family_man_boy_boy: "👨‍👦‍👦",
  family_man_girl_girl: "👨‍👧‍👧",
  yarn: "🧶",
  thread: "🧵",
  coat: "🧥",
  labcoat: "🥼",
  womans_clothes: "👚",
  tshirt: "👕",
  jeans: "👖",
  necktie: "👔",
  dress: "👗",
  bikini: "👙",
  kimono: "👘",
  lipstick: "💄",
  kiss: "💋",
  footprints: "👣",
  flat_shoe: "🥿",
  high_heel: "👠",
  sandal: "👡",
  boot: "👢",
  mans_shoe: "👞",
  athletic_shoe: "👟",
  hiking_boot: "🥾",
  socks: "🧦",
  gloves: "🧤",
  scarf: "🧣",
  womans_hat: "👒",
  tophat: "🎩",
  billed_hat: "🧢",
  rescue_worker_helmet: "⛑",
  mortar_board: "🎓",
  crown: "👑",
  school_satchel: "🎒",
  luggage: "🧳",
  pouch: "👝",
  purse: "👛",
  handbag: "👜",
  briefcase: "💼",
  eyeglasses: "👓",
  dark_sunglasses: "🕶",
  goggles: "🥽",
  ring: "💍",
  closed_umbrella: "🌂",
  dog: "🐶",
  cat: "🐱",
  mouse: "🐭",
  hamster: "🐹",
  rabbit: "🐰",
  fox_face: "🦊",
  bear: "🐻",
  panda_face: "🐼",
  koala: "🐨",
  tiger: "🐯",
  lion: "🦁",
  cow: "🐮",
  pig: "🐷",
  pig_nose: "🐽",
  frog: "🐸",
  squid: "🦑",
  octopus: "🐙",
  shrimp: "🦐",
  monkey_face: "🐵",
  gorilla: "🦍",
  see_no_evil: "🙈",
  hear_no_evil: "🙉",
  speak_no_evil: "🙊",
  monkey: "🐒",
  chicken: "🐔",
  penguin: "🐧",
  bird: "🐦",
  baby_chick: "🐤",
  hatching_chick: "🐣",
  hatched_chick: "🐥",
  duck: "🦆",
  eagle: "🦅",
  owl: "🦉",
  bat: "🦇",
  wolf: "🐺",
  boar: "🐗",
  horse: "🐴",
  unicorn: "🦄",
  honeybee: "🐝",
  bug: "🐛",
  butterfly: "🦋",
  snail: "🐌",
  beetle: "🐞",
  ant: "🐜",
  grasshopper: "🦗",
  spider: "🕷",
  scorpion: "🦂",
  crab: "🦀",
  snake: "🐍",
  lizard: "🦎",
  "t-rex": "🦖",
  sauropod: "🦕",
  turtle: "🐢",
  tropical_fish: "🐠",
  fish: "🐟",
  blowfish: "🐡",
  dolphin: "🐬",
  shark: "🦈",
  whale: "🐳",
  whale2: "🐋",
  crocodile: "🐊",
  leopard: "🐆",
  zebra: "🦓",
  tiger2: "🐅",
  water_buffalo: "🐃",
  ox: "🐂",
  cow2: "🐄",
  deer: "🦌",
  dromedary_camel: "🐪",
  camel: "🐫",
  giraffe: "🦒",
  elephant: "🐘",
  rhinoceros: "🦏",
  goat: "🐐",
  ram: "🐏",
  sheep: "🐑",
  racehorse: "🐎",
  pig2: "🐖",
  rat: "🐀",
  mouse2: "🐁",
  rooster: "🐓",
  turkey: "🦃",
  dove: "🕊",
  dog2: "🐕",
  poodle: "🐩",
  cat2: "🐈",
  rabbit2: "🐇",
  chipmunk: "🐿",
  hedgehog: "🦔",
  raccoon: "🦝",
  llama: "🦙",
  hippopotamus: "🦛",
  kangaroo: "🦘",
  badger: "🦡",
  swan: "🦢",
  peacock: "🦚",
  parrot: "🦜",
  lobster: "🦞",
  mosquito: "🦟",
  paw_prints: "🐾",
  dragon: "🐉",
  dragon_face: "🐲",
  cactus: "🌵",
  christmas_tree: "🎄",
  evergreen_tree: "🌲",
  deciduous_tree: "🌳",
  palm_tree: "🌴",
  seedling: "🌱",
  herb: "🌿",
  shamrock: "☘",
  four_leaf_clover: "🍀",
  bamboo: "🎍",
  tanabata_tree: "🎋",
  leaves: "🍃",
  fallen_leaf: "🍂",
  maple_leaf: "🍁",
  ear_of_rice: "🌾",
  hibiscus: "🌺",
  sunflower: "🌻",
  rose: "🌹",
  wilted_flower: "🥀",
  tulip: "🌷",
  blossom: "🌼",
  cherry_blossom: "🌸",
  bouquet: "💐",
  mushroom: "🍄",
  chestnut: "🌰",
  jack_o_lantern: "🎃",
  shell: "🐚",
  spider_web: "🕸",
  earth_americas: "🌎",
  earth_africa: "🌍",
  earth_asia: "🌏",
  full_moon: "🌕",
  waning_gibbous_moon: "🌖",
  last_quarter_moon: "🌗",
  waning_crescent_moon: "🌘",
  new_moon: "🌑",
  waxing_crescent_moon: "🌒",
  first_quarter_moon: "🌓",
  waxing_gibbous_moon: "🌔",
  new_moon_with_face: "🌚",
  full_moon_with_face: "🌝",
  first_quarter_moon_with_face: "🌛",
  last_quarter_moon_with_face: "🌜",
  sun_with_face: "🌞",
  crescent_moon: "🌙",
  star: "⭐",
  star2: "🌟",
  dizzy: "💫",
  sparkles: "✨",
  comet: "☄",
  sunny: "☀️",
  sun_behind_small_cloud: "🌤",
  partly_sunny: "⛅",
  sun_behind_large_cloud: "🌥",
  sun_behind_rain_cloud: "🌦",
  cloud: "☁️",
  cloud_with_rain: "🌧",
  cloud_with_lightning_and_rain: "⛈",
  cloud_with_lightning: "🌩",
  zap: "⚡",
  fire: "🔥",
  boom: "💥",
  snowflake: "❄️",
  cloud_with_snow: "🌨",
  snowman: "⛄",
  snowman_with_snow: "☃",
  wind_face: "🌬",
  dash: "💨",
  tornado: "🌪",
  fog: "🌫",
  open_umbrella: "☂",
  umbrella: "☔",
  droplet: "💧",
  sweat_drops: "💦",
  ocean: "🌊",
  green_apple: "🍏",
  apple: "🍎",
  pear: "🍐",
  tangerine: "🍊",
  lemon: "🍋",
  banana: "🍌",
  watermelon: "🍉",
  grapes: "🍇",
  strawberry: "🍓",
  melon: "🍈",
  cherries: "🍒",
  peach: "🍑",
  pineapple: "🍍",
  coconut: "🥥",
  kiwi_fruit: "🥝",
  mango: "🥭",
  avocado: "🥑",
  broccoli: "🥦",
  tomato: "🍅",
  eggplant: "🍆",
  cucumber: "🥒",
  carrot: "🥕",
  hot_pepper: "🌶",
  potato: "🥔",
  corn: "🌽",
  leafy_greens: "🥬",
  sweet_potato: "🍠",
  peanuts: "🥜",
  honey_pot: "🍯",
  croissant: "🥐",
  bread: "🍞",
  baguette_bread: "🥖",
  bagel: "🥯",
  pretzel: "🥨",
  cheese: "🧀",
  egg: "🥚",
  bacon: "🥓",
  steak: "🥩",
  pancakes: "🥞",
  poultry_leg: "🍗",
  meat_on_bone: "🍖",
  bone: "🦴",
  fried_shrimp: "🍤",
  fried_egg: "🍳",
  hamburger: "🍔",
  fries: "🍟",
  stuffed_flatbread: "🥙",
  hotdog: "🌭",
  pizza: "🍕",
  sandwich: "🥪",
  canned_food: "🥫",
  spaghetti: "🍝",
  taco: "🌮",
  burrito: "🌯",
  green_salad: "🥗",
  shallow_pan_of_food: "🥘",
  ramen: "🍜",
  stew: "🍲",
  fish_cake: "🍥",
  fortune_cookie: "🥠",
  sushi: "🍣",
  bento: "🍱",
  curry: "🍛",
  rice_ball: "🍙",
  rice: "🍚",
  rice_cracker: "🍘",
  oden: "🍢",
  dango: "🍡",
  shaved_ice: "🍧",
  ice_cream: "🍨",
  icecream: "🍦",
  pie: "🥧",
  cake: "🍰",
  cupcake: "🧁",
  moon_cake: "🥮",
  birthday: "🎂",
  custard: "🍮",
  candy: "🍬",
  lollipop: "🍭",
  chocolate_bar: "🍫",
  popcorn: "🍿",
  dumpling: "🥟",
  doughnut: "🍩",
  cookie: "🍪",
  milk_glass: "🥛",
  beer: "🍺",
  beers: "🍻",
  clinking_glasses: "🥂",
  wine_glass: "🍷",
  tumbler_glass: "🥃",
  cocktail: "🍸",
  tropical_drink: "🍹",
  champagne: "🍾",
  sake: "🍶",
  tea: "🍵",
  cup_with_straw: "🥤",
  coffee: "☕",
  baby_bottle: "🍼",
  salt: "🧂",
  spoon: "🥄",
  fork_and_knife: "🍴",
  plate_with_cutlery: "🍽",
  bowl_with_spoon: "🥣",
  takeout_box: "🥡",
  chopsticks: "🥢",
  soccer: "⚽",
  basketball: "🏀",
  football: "🏈",
  baseball: "⚾",
  softball: "🥎",
  tennis: "🎾",
  volleyball: "🏐",
  rugby_football: "🏉",
  flying_disc: "🥏",
  "8ball": "🎱",
  golf: "⛳",
  golfing_woman: "🏌️‍♀️",
  golfing_man: "🏌",
  ping_pong: "🏓",
  badminton: "🏸",
  goal_net: "🥅",
  ice_hockey: "🏒",
  field_hockey: "🏑",
  lacrosse: "🥍",
  cricket: "🏏",
  ski: "🎿",
  skier: "⛷",
  snowboarder: "🏂",
  person_fencing: "🤺",
  women_wrestling: "🤼‍♀️",
  men_wrestling: "🤼‍♂️",
  woman_cartwheeling: "🤸‍♀️",
  man_cartwheeling: "🤸‍♂️",
  woman_playing_handball: "🤾‍♀️",
  man_playing_handball: "🤾‍♂️",
  ice_skate: "⛸",
  curling_stone: "🥌",
  skateboard: "🛹",
  sled: "🛷",
  bow_and_arrow: "🏹",
  fishing_pole_and_fish: "🎣",
  boxing_glove: "🥊",
  martial_arts_uniform: "🥋",
  rowing_woman: "🚣‍♀️",
  rowing_man: "🚣",
  climbing_woman: "🧗‍♀️",
  climbing_man: "🧗‍♂️",
  swimming_woman: "🏊‍♀️",
  swimming_man: "🏊",
  woman_playing_water_polo: "🤽‍♀️",
  man_playing_water_polo: "🤽‍♂️",
  woman_in_lotus_position: "🧘‍♀️",
  man_in_lotus_position: "🧘‍♂️",
  surfing_woman: "🏄‍♀️",
  surfing_man: "🏄",
  bath: "🛀",
  basketball_woman: "⛹️‍♀️",
  basketball_man: "⛹",
  weight_lifting_woman: "🏋️‍♀️",
  weight_lifting_man: "🏋",
  biking_woman: "🚴‍♀️",
  biking_man: "🚴",
  mountain_biking_woman: "🚵‍♀️",
  mountain_biking_man: "🚵",
  horse_racing: "🏇",
  business_suit_levitating: "🕴",
  trophy: "🏆",
  running_shirt_with_sash: "🎽",
  medal_sports: "🏅",
  medal_military: "🎖",
  "1st_place_medal": "🥇",
  "2nd_place_medal": "🥈",
  "3rd_place_medal": "🥉",
  reminder_ribbon: "🎗",
  rosette: "🏵",
  ticket: "🎫",
  tickets: "🎟",
  performing_arts: "🎭",
  art: "🎨",
  circus_tent: "🎪",
  woman_juggling: "🤹‍♀️",
  man_juggling: "🤹‍♂️",
  microphone: "🎤",
  headphones: "🎧",
  musical_score: "🎼",
  musical_keyboard: "🎹",
  drum: "🥁",
  saxophone: "🎷",
  trumpet: "🎺",
  guitar: "🎸",
  violin: "🎻",
  clapper: "🎬",
  video_game: "🎮",
  space_invader: "👾",
  dart: "🎯",
  game_die: "🎲",
  chess_pawn: "♟",
  slot_machine: "🎰",
  jigsaw: "🧩",
  bowling: "🎳",
  red_car: "🚗",
  taxi: "🚕",
  blue_car: "🚙",
  bus: "🚌",
  trolleybus: "🚎",
  racing_car: "🏎",
  police_car: "🚓",
  ambulance: "🚑",
  fire_engine: "🚒",
  minibus: "🚐",
  truck: "🚚",
  articulated_lorry: "🚛",
  tractor: "🚜",
  kick_scooter: "🛴",
  motorcycle: "🏍",
  bike: "🚲",
  motor_scooter: "🛵",
  rotating_light: "🚨",
  oncoming_police_car: "🚔",
  oncoming_bus: "🚍",
  oncoming_automobile: "🚘",
  oncoming_taxi: "🚖",
  aerial_tramway: "🚡",
  mountain_cableway: "🚠",
  suspension_railway: "🚟",
  railway_car: "🚃",
  train: "🚋",
  monorail: "🚝",
  bullettrain_side: "🚄",
  bullettrain_front: "🚅",
  light_rail: "🚈",
  mountain_railway: "🚞",
  steam_locomotive: "🚂",
  train2: "🚆",
  metro: "🚇",
  tram: "🚊",
  station: "🚉",
  flying_saucer: "🛸",
  helicopter: "🚁",
  small_airplane: "🛩",
  airplane: "✈️",
  flight_departure: "🛫",
  flight_arrival: "🛬",
  sailboat: "⛵",
  motor_boat: "🛥",
  speedboat: "🚤",
  ferry: "⛴",
  passenger_ship: "🛳",
  rocket: "🚀",
  artificial_satellite: "🛰",
  seat: "💺",
  canoe: "🛶",
  anchor: "⚓",
  construction: "🚧",
  fuelpump: "⛽",
  busstop: "🚏",
  vertical_traffic_light: "🚦",
  traffic_light: "🚥",
  checkered_flag: "🏁",
  ship: "🚢",
  ferris_wheel: "🎡",
  roller_coaster: "🎢",
  carousel_horse: "🎠",
  building_construction: "🏗",
  foggy: "🌁",
  tokyo_tower: "🗼",
  factory: "🏭",
  fountain: "⛲",
  rice_scene: "🎑",
  mountain: "⛰",
  mountain_snow: "🏔",
  mount_fuji: "🗻",
  volcano: "🌋",
  japan: "🗾",
  camping: "🏕",
  tent: "⛺",
  national_park: "🏞",
  motorway: "🛣",
  railway_track: "🛤",
  sunrise: "🌅",
  sunrise_over_mountains: "🌄",
  desert: "🏜",
  beach_umbrella: "🏖",
  desert_island: "🏝",
  city_sunrise: "🌇",
  city_sunset: "🌆",
  cityscape: "🏙",
  night_with_stars: "🌃",
  bridge_at_night: "🌉",
  milky_way: "🌌",
  stars: "🌠",
  sparkler: "🎇",
  fireworks: "🎆",
  rainbow: "🌈",
  houses: "🏘",
  european_castle: "🏰",
  japanese_castle: "🏯",
  stadium: "🏟",
  statue_of_liberty: "🗽",
  house: "🏠",
  house_with_garden: "🏡",
  derelict_house: "🏚",
  office: "🏢",
  department_store: "🏬",
  post_office: "🏣",
  european_post_office: "🏤",
  hospital: "🏥",
  bank: "🏦",
  hotel: "🏨",
  convenience_store: "🏪",
  school: "🏫",
  love_hotel: "🏩",
  wedding: "💒",
  classical_building: "🏛",
  church: "⛪",
  mosque: "🕌",
  synagogue: "🕍",
  kaaba: "🕋",
  shinto_shrine: "⛩",
  watch: "⌚",
  iphone: "📱",
  calling: "📲",
  computer: "💻",
  keyboard: "⌨",
  desktop_computer: "🖥",
  printer: "🖨",
  computer_mouse: "🖱",
  trackball: "🖲",
  joystick: "🕹",
  clamp: "🗜",
  minidisc: "💽",
  floppy_disk: "💾",
  cd: "💿",
  dvd: "📀",
  vhs: "📼",
  camera: "📷",
  camera_flash: "📸",
  video_camera: "📹",
  movie_camera: "🎥",
  film_projector: "📽",
  film_strip: "🎞",
  telephone_receiver: "📞",
  phone: "☎️",
  pager: "📟",
  fax: "📠",
  tv: "📺",
  radio: "📻",
  studio_microphone: "🎙",
  level_slider: "🎚",
  control_knobs: "🎛",
  compass: "🧭",
  stopwatch: "⏱",
  timer_clock: "⏲",
  alarm_clock: "⏰",
  mantelpiece_clock: "🕰",
  hourglass_flowing_sand: "⏳",
  hourglass: "⌛",
  satellite: "📡",
  battery: "🔋",
  electric_plug: "🔌",
  bulb: "💡",
  flashlight: "🔦",
  candle: "🕯",
  fire_extinguisher: "🧯",
  wastebasket: "🗑",
  oil_drum: "🛢",
  money_with_wings: "💸",
  dollar: "💵",
  yen: "💴",
  euro: "💶",
  pound: "💷",
  moneybag: "💰",
  credit_card: "💳",
  gem: "💎",
  balance_scale: "⚖",
  toolbox: "🧰",
  wrench: "🔧",
  hammer: "🔨",
  hammer_and_pick: "⚒",
  hammer_and_wrench: "🛠",
  pick: "⛏",
  nut_and_bolt: "🔩",
  gear: "⚙",
  brick: "🧱",
  chains: "⛓",
  magnet: "🧲",
  gun: "🔫",
  bomb: "💣",
  firecracker: "🧨",
  hocho: "🔪",
  dagger: "🗡",
  crossed_swords: "⚔",
  shield: "🛡",
  smoking: "🚬",
  skull_and_crossbones: "☠",
  coffin: "⚰",
  funeral_urn: "⚱",
  amphora: "🏺",
  crystal_ball: "🔮",
  prayer_beads: "📿",
  nazar_amulet: "🧿",
  barber: "💈",
  alembic: "⚗",
  telescope: "🔭",
  microscope: "🔬",
  hole: "🕳",
  pill: "💊",
  syringe: "💉",
  dna: "🧬",
  microbe: "🦠",
  petri_dish: "🧫",
  test_tube: "🧪",
  thermometer: "🌡",
  broom: "🧹",
  basket: "🧺",
  toilet_paper: "🧻",
  label: "🏷",
  bookmark: "🔖",
  toilet: "🚽",
  shower: "🚿",
  bathtub: "🛁",
  soap: "🧼",
  sponge: "🧽",
  lotion_bottle: "🧴",
  key: "🔑",
  old_key: "🗝",
  couch_and_lamp: "🛋",
  sleeping_bed: "🛌",
  bed: "🛏",
  door: "🚪",
  bellhop_bell: "🛎",
  teddy_bear: "🧸",
  framed_picture: "🖼",
  world_map: "🗺",
  parasol_on_ground: "⛱",
  moyai: "🗿",
  shopping: "🛍",
  shopping_cart: "🛒",
  balloon: "🎈",
  flags: "🎏",
  ribbon: "🎀",
  gift: "🎁",
  confetti_ball: "🎊",
  tada: "🎉",
  dolls: "🎎",
  wind_chime: "🎐",
  crossed_flags: "🎌",
  izakaya_lantern: "🏮",
  red_envelope: "🧧",
  email: "✉️",
  envelope_with_arrow: "📩",
  incoming_envelope: "📨",
  "e-mail": "📧",
  love_letter: "💌",
  postbox: "📮",
  mailbox_closed: "📪",
  mailbox: "📫",
  mailbox_with_mail: "📬",
  mailbox_with_no_mail: "📭",
  package: "📦",
  postal_horn: "📯",
  inbox_tray: "📥",
  outbox_tray: "📤",
  scroll: "📜",
  page_with_curl: "📃",
  bookmark_tabs: "📑",
  receipt: "🧾",
  bar_chart: "📊",
  chart_with_upwards_trend: "📈",
  chart_with_downwards_trend: "📉",
  page_facing_up: "📄",
  date: "📅",
  calendar: "📆",
  spiral_calendar: "🗓",
  card_index: "📇",
  card_file_box: "🗃",
  ballot_box: "🗳",
  file_cabinet: "🗄",
  clipboard: "📋",
  spiral_notepad: "🗒",
  file_folder: "📁",
  open_file_folder: "📂",
  card_index_dividers: "🗂",
  newspaper_roll: "🗞",
  newspaper: "📰",
  notebook: "📓",
  closed_book: "📕",
  green_book: "📗",
  blue_book: "📘",
  orange_book: "📙",
  notebook_with_decorative_cover: "📔",
  ledger: "📒",
  books: "📚",
  open_book: "📖",
  safety_pin: "🧷",
  link: "🔗",
  paperclip: "📎",
  paperclips: "🖇",
  scissors: "✂️",
  triangular_ruler: "📐",
  straight_ruler: "📏",
  abacus: "🧮",
  pushpin: "📌",
  round_pushpin: "📍",
  triangular_flag_on_post: "🚩",
  white_flag: "🏳",
  black_flag: "🏴",
  rainbow_flag: "🏳️‍🌈",
  closed_lock_with_key: "🔐",
  lock: "🔒",
  unlock: "🔓",
  lock_with_ink_pen: "🔏",
  pen: "🖊",
  fountain_pen: "🖋",
  black_nib: "✒️",
  memo: "📝",
  pencil2: "✏️",
  crayon: "🖍",
  paintbrush: "🖌",
  mag: "🔍",
  mag_right: "🔎",
  heart: "❤️",
  orange_heart: "🧡",
  yellow_heart: "💛",
  green_heart: "💚",
  blue_heart: "💙",
  purple_heart: "💜",
  black_heart: "🖤",
  broken_heart: "💔",
  heavy_heart_exclamation: "❣",
  two_hearts: "💕",
  revolving_hearts: "💞",
  heartbeat: "💓",
  heartpulse: "💗",
  sparkling_heart: "💖",
  cupid: "💘",
  gift_heart: "💝",
  heart_decoration: "💟",
  peace_symbol: "☮",
  latin_cross: "✝",
  star_and_crescent: "☪",
  om: "🕉",
  wheel_of_dharma: "☸",
  star_of_david: "✡",
  six_pointed_star: "🔯",
  menorah: "🕎",
  yin_yang: "☯",
  orthodox_cross: "☦",
  place_of_worship: "🛐",
  ophiuchus: "⛎",
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpius: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
  id: "🆔",
  atom_symbol: "⚛",
  u7a7a: "🈳",
  u5272: "🈹",
  radioactive: "☢",
  biohazard: "☣",
  mobile_phone_off: "📴",
  vibration_mode: "📳",
  u6709: "🈶",
  u7121: "🈚",
  u7533: "🈸",
  u55b6: "🈺",
  u6708: "🈷️",
  eight_pointed_black_star: "✴️",
  vs: "🆚",
  accept: "🉑",
  white_flower: "💮",
  ideograph_advantage: "🉐",
  secret: "㊙️",
  congratulations: "㊗️",
  u5408: "🈴",
  u6e80: "🈵",
  u7981: "🈲",
  a: "🅰️",
  b: "🅱️",
  ab: "🆎",
  cl: "🆑",
  o2: "🅾️",
  sos: "🆘",
  no_entry: "⛔",
  name_badge: "📛",
  no_entry_sign: "🚫",
  x: "❌",
  o: "⭕",
  stop_sign: "🛑",
  anger: "💢",
  hotsprings: "♨️",
  no_pedestrians: "🚷",
  do_not_litter: "🚯",
  no_bicycles: "🚳",
  "non-potable_water": "🚱",
  underage: "🔞",
  no_mobile_phones: "📵",
  exclamation: "❗",
  grey_exclamation: "❕",
  question: "❓",
  grey_question: "❔",
  bangbang: "‼️",
  interrobang: "⁉️",
  low_brightness: "🔅",
  high_brightness: "🔆",
  trident: "🔱",
  fleur_de_lis: "⚜",
  part_alternation_mark: "〽️",
  warning: "⚠️",
  children_crossing: "🚸",
  beginner: "🔰",
  recycle: "♻️",
  u6307: "🈯",
  chart: "💹",
  sparkle: "❇️",
  eight_spoked_asterisk: "✳️",
  negative_squared_cross_mark: "❎",
  white_check_mark: "✅",
  diamond_shape_with_a_dot_inside: "💠",
  cyclone: "🌀",
  loop: "➿",
  globe_with_meridians: "🌐",
  m: "Ⓜ️",
  atm: "🏧",
  sa: "🈂️",
  passport_control: "🛂",
  customs: "🛃",
  baggage_claim: "🛄",
  left_luggage: "🛅",
  wheelchair: "♿",
  no_smoking: "🚭",
  wc: "🚾",
  parking: "🅿️",
  potable_water: "🚰",
  mens: "🚹",
  womens: "🚺",
  baby_symbol: "🚼",
  restroom: "🚻",
  put_litter_in_its_place: "🚮",
  cinema: "🎦",
  signal_strength: "📶",
  koko: "🈁",
  ng: "🆖",
  ok: "🆗",
  up: "🆙",
  cool: "🆒",
  new: "🆕",
  free: "🆓",
  zero: "0️⃣",
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
  six: "6️⃣",
  seven: "7️⃣",
  eight: "8️⃣",
  nine: "9️⃣",
  keycap_ten: "🔟",
  asterisk: "*⃣",
  eject_button: "⏏️",
  arrow_forward: "▶️",
  pause_button: "⏸",
  next_track_button: "⏭",
  stop_button: "⏹",
  record_button: "⏺",
  play_or_pause_button: "⏯",
  previous_track_button: "⏮",
  fast_forward: "⏩",
  rewind: "⏪",
  twisted_rightwards_arrows: "🔀",
  repeat: "🔁",
  repeat_one: "🔂",
  arrow_backward: "◀️",
  arrow_up_small: "🔼",
  arrow_down_small: "🔽",
  arrow_double_up: "⏫",
  arrow_double_down: "⏬",
  arrow_right: "➡️",
  arrow_left: "⬅️",
  arrow_up: "⬆️",
  arrow_down: "⬇️",
  arrow_upper_right: "↗️",
  arrow_lower_right: "↘️",
  arrow_lower_left: "↙️",
  arrow_upper_left: "↖️",
  arrow_up_down: "↕️",
  left_right_arrow: "↔️",
  arrows_counterclockwise: "🔄",
  arrow_right_hook: "↪️",
  leftwards_arrow_with_hook: "↩️",
  arrow_heading_up: "⤴️",
  arrow_heading_down: "⤵️",
  hash: "#️⃣",
  information_source: "ℹ️",
  abc: "🔤",
  abcd: "🔡",
  capital_abcd: "🔠",
  symbols: "🔣",
  musical_note: "🎵",
  notes: "🎶",
  wavy_dash: "〰️",
  curly_loop: "➰",
  heavy_check_mark: "✔️",
  arrows_clockwise: "🔃",
  heavy_plus_sign: "➕",
  heavy_minus_sign: "➖",
  heavy_division_sign: "➗",
  heavy_multiplication_x: "✖️",
  infinity: "♾",
  heavy_dollar_sign: "💲",
  currency_exchange: "💱",
  copyright: "©️",
  registered: "®️",
  tm: "™️",
  end: "🔚",
  back: "🔙",
  on: "🔛",
  top: "🔝",
  soon: "🔜",
  ballot_box_with_check: "☑️",
  radio_button: "🔘",
  white_circle: "⚪",
  black_circle: "⚫",
  red_circle: "🔴",
  large_blue_circle: "🔵",
  small_orange_diamond: "🔸",
  small_blue_diamond: "🔹",
  large_orange_diamond: "🔶",
  large_blue_diamond: "🔷",
  small_red_triangle: "🔺",
  black_small_square: "▪️",
  white_small_square: "▫️",
  black_large_square: "⬛",
  white_large_square: "⬜",
  small_red_triangle_down: "🔻",
  black_medium_square: "◼️",
  white_medium_square: "◻️",
  black_medium_small_square: "◾",
  white_medium_small_square: "◽",
  black_square_button: "🔲",
  white_square_button: "🔳",
  speaker: "🔈",
  sound: "🔉",
  loud_sound: "🔊",
  mute: "🔇",
  mega: "📣",
  loudspeaker: "📢",
  bell: "🔔",
  no_bell: "🔕",
  black_joker: "🃏",
  mahjong: "🀄",
  spades: "♠️",
  clubs: "♣️",
  hearts: "♥️",
  diamonds: "♦️",
  flower_playing_cards: "🎴",
  thought_balloon: "💭",
  right_anger_bubble: "🗯",
  speech_balloon: "💬",
  left_speech_bubble: "🗨",
  clock1: "🕐",
  clock2: "🕑",
  clock3: "🕒",
  clock4: "🕓",
  clock5: "🕔",
  clock6: "🕕",
  clock7: "🕖",
  clock8: "🕗",
  clock9: "🕘",
  clock10: "🕙",
  clock11: "🕚",
  clock12: "🕛",
  clock130: "🕜",
  clock230: "🕝",
  clock330: "🕞",
  clock430: "🕟",
  clock530: "🕠",
  clock630: "🕡",
  clock730: "🕢",
  clock830: "🕣",
  clock930: "🕤",
  clock1030: "🕥",
  clock1130: "🕦",
  clock1230: "🕧",
  afghanistan: "🇦🇫",
  aland_islands: "🇦🇽",
  albania: "🇦🇱",
  algeria: "🇩🇿",
  american_samoa: "🇦🇸",
  andorra: "🇦🇩",
  angola: "🇦🇴",
  anguilla: "🇦🇮",
  antarctica: "🇦🇶",
  antigua_barbuda: "🇦🇬",
  argentina: "🇦🇷",
  armenia: "🇦🇲",
  aruba: "🇦🇼",
  australia: "🇦🇺",
  austria: "🇦🇹",
  azerbaijan: "🇦🇿",
  bahamas: "🇧🇸",
  bahrain: "🇧🇭",
  bangladesh: "🇧🇩",
  barbados: "🇧🇧",
  belarus: "🇧🇾",
  belgium: "🇧🇪",
  belize: "🇧🇿",
  benin: "🇧🇯",
  bermuda: "🇧🇲",
  bhutan: "🇧🇹",
  bolivia: "🇧🇴",
  caribbean_netherlands: "🇧🇶",
  bosnia_herzegovina: "🇧🇦",
  botswana: "🇧🇼",
  brazil: "🇧🇷",
  british_indian_ocean_territory: "🇮🇴",
  british_virgin_islands: "🇻🇬",
  brunei: "🇧🇳",
  bulgaria: "🇧🇬",
  burkina_faso: "🇧🇫",
  burundi: "🇧🇮",
  cape_verde: "🇨🇻",
  cambodia: "🇰🇭",
  cameroon: "🇨🇲",
  canada: "🇨🇦",
  canary_islands: "🇮🇨",
  cayman_islands: "🇰🇾",
  central_african_republic: "🇨🇫",
  chad: "🇹🇩",
  chile: "🇨🇱",
  cn: "🇨🇳",
  christmas_island: "🇨🇽",
  cocos_islands: "🇨🇨",
  colombia: "🇨🇴",
  comoros: "🇰🇲",
  congo_brazzaville: "🇨🇬",
  congo_kinshasa: "🇨🇩",
  cook_islands: "🇨🇰",
  costa_rica: "🇨🇷",
  croatia: "🇭🇷",
  cuba: "🇨🇺",
  curacao: "🇨🇼",
  cyprus: "🇨🇾",
  czech_republic: "🇨🇿",
  denmark: "🇩🇰",
  djibouti: "🇩🇯",
  dominica: "🇩🇲",
  dominican_republic: "🇩🇴",
  ecuador: "🇪🇨",
  egypt: "🇪🇬",
  el_salvador: "🇸🇻",
  equatorial_guinea: "🇬🇶",
  eritrea: "🇪🇷",
  estonia: "🇪🇪",
  ethiopia: "🇪🇹",
  eu: "🇪🇺",
  falkland_islands: "🇫🇰",
  faroe_islands: "🇫🇴",
  fiji: "🇫🇯",
  finland: "🇫🇮",
  fr: "🇫🇷",
  french_guiana: "🇬🇫",
  french_polynesia: "🇵🇫",
  french_southern_territories: "🇹🇫",
  gabon: "🇬🇦",
  gambia: "🇬🇲",
  georgia: "🇬🇪",
  de: "🇩🇪",
  ghana: "🇬🇭",
  gibraltar: "🇬🇮",
  greece: "🇬🇷",
  greenland: "🇬🇱",
  grenada: "🇬🇩",
  guadeloupe: "🇬🇵",
  guam: "🇬🇺",
  guatemala: "🇬🇹",
  guernsey: "🇬🇬",
  guinea: "🇬🇳",
  guinea_bissau: "🇬🇼",
  guyana: "🇬🇾",
  haiti: "🇭🇹",
  honduras: "🇭🇳",
  hong_kong: "🇭🇰",
  hungary: "🇭🇺",
  iceland: "🇮🇸",
  india: "🇮🇳",
  indonesia: "🇮🇩",
  iran: "🇮🇷",
  iraq: "🇮🇶",
  ireland: "🇮🇪",
  isle_of_man: "🇮🇲",
  israel: "🇮🇱",
  it: "🇮🇹",
  cote_divoire: "🇨🇮",
  jamaica: "🇯🇲",
  jp: "🇯🇵",
  jersey: "🇯🇪",
  jordan: "🇯🇴",
  kazakhstan: "🇰🇿",
  kenya: "🇰🇪",
  kiribati: "🇰🇮",
  kosovo: "🇽🇰",
  kuwait: "🇰🇼",
  kyrgyzstan: "🇰🇬",
  laos: "🇱🇦",
  latvia: "🇱🇻",
  lebanon: "🇱🇧",
  lesotho: "🇱🇸",
  liberia: "🇱🇷",
  libya: "🇱🇾",
  liechtenstein: "🇱🇮",
  lithuania: "🇱🇹",
  luxembourg: "🇱🇺",
  macau: "🇲🇴",
  macedonia: "🇲🇰",
  madagascar: "🇲🇬",
  malawi: "🇲🇼",
  malaysia: "🇲🇾",
  maldives: "🇲🇻",
  mali: "🇲🇱",
  malta: "🇲🇹",
  marshall_islands: "🇲🇭",
  martinique: "🇲🇶",
  mauritania: "🇲🇷",
  mauritius: "🇲🇺",
  mayotte: "🇾🇹",
  mexico: "🇲🇽",
  micronesia: "🇫🇲",
  moldova: "🇲🇩",
  monaco: "🇲🇨",
  mongolia: "🇲🇳",
  montenegro: "🇲🇪",
  montserrat: "🇲🇸",
  morocco: "🇲🇦",
  mozambique: "🇲🇿",
  myanmar: "🇲🇲",
  namibia: "🇳🇦",
  nauru: "🇳🇷",
  nepal: "🇳🇵",
  netherlands: "🇳🇱",
  new_caledonia: "🇳🇨",
  new_zealand: "🇳🇿",
  nicaragua: "🇳🇮",
  niger: "🇳🇪",
  nigeria: "🇳🇬",
  niue: "🇳🇺",
  norfolk_island: "🇳🇫",
  northern_mariana_islands: "🇲🇵",
  north_korea: "🇰🇵",
  norway: "🇳🇴",
  oman: "🇴🇲",
  pakistan: "🇵🇰",
  palau: "🇵🇼",
  palestinian_territories: "🇵🇸",
  panama: "🇵🇦",
  papua_new_guinea: "🇵🇬",
  paraguay: "🇵🇾",
  peru: "🇵🇪",
  philippines: "🇵🇭",
  pitcairn_islands: "🇵🇳",
  poland: "🇵🇱",
  portugal: "🇵🇹",
  puerto_rico: "🇵🇷",
  qatar: "🇶🇦",
  reunion: "🇷🇪",
  romania: "🇷🇴",
  ru: "🇷🇺",
  rwanda: "🇷🇼",
  st_barthelemy: "🇧🇱",
  st_helena: "🇸🇭",
  st_kitts_nevis: "🇰🇳",
  st_lucia: "🇱🇨",
  st_pierre_miquelon: "🇵🇲",
  st_vincent_grenadines: "🇻🇨",
  samoa: "🇼🇸",
  san_marino: "🇸🇲",
  sao_tome_principe: "🇸🇹",
  saudi_arabia: "🇸🇦",
  senegal: "🇸🇳",
  serbia: "🇷🇸",
  seychelles: "🇸🇨",
  sierra_leone: "🇸🇱",
  singapore: "🇸🇬",
  sint_maarten: "🇸🇽",
  slovakia: "🇸🇰",
  slovenia: "🇸🇮",
  solomon_islands: "🇸🇧",
  somalia: "🇸🇴",
  south_africa: "🇿🇦",
  south_georgia_south_sandwich_islands: "🇬🇸",
  kr: "🇰🇷",
  south_sudan: "🇸🇸",
  es: "🇪🇸",
  sri_lanka: "🇱🇰",
  sudan: "🇸🇩",
  suriname: "🇸🇷",
  swaziland: "🇸🇿",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  syria: "🇸🇾",
  taiwan: "🇹🇼",
  tajikistan: "🇹🇯",
  tanzania: "🇹🇿",
  thailand: "🇹🇭",
  timor_leste: "🇹🇱",
  togo: "🇹🇬",
  tokelau: "🇹🇰",
  tonga: "🇹🇴",
  trinidad_tobago: "🇹🇹",
  tunisia: "🇹🇳",
  tr: "🇹🇷",
  turkmenistan: "🇹🇲",
  turks_caicos_islands: "🇹🇨",
  tuvalu: "🇹🇻",
  uganda: "🇺🇬",
  ukraine: "🇺🇦",
  united_arab_emirates: "🇦🇪",
  uk: "🇬🇧",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  us: "🇺🇸",
  us_virgin_islands: "🇻🇮",
  uruguay: "🇺🇾",
  uzbekistan: "🇺🇿",
  vanuatu: "🇻🇺",
  vatican_city: "🇻🇦",
  venezuela: "🇻🇪",
  vietnam: "🇻🇳",
  wallis_futuna: "🇼🇫",
  western_sahara: "🇪🇭",
  yemen: "🇾🇪",
  zambia: "🇿🇲",
  zimbabwe: "🇿🇼",
  united_nations: "🇺🇳",
  pirate_flag: "🏴‍☠️"
};
function kh(e, t) {
  this.v = e, this.k = t;
}
function Vs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function xh(e) {
  if (Array.isArray(e)) return e;
}
function Sh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, i, a, o, s = [], l = !0, c = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        l = !1;
      } else for (; !(l = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); l = !0) ;
    } catch (f) {
      c = !0, i = f;
    } finally {
      try {
        if (!l && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return s;
  }
}
function vh() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ah(e, t) {
  return xh(e) || Sh(e, t) || Eh(e, t) || vh();
}
function Eh(e, t) {
  if (e) {
    if (typeof e == "string") return Vs(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Vs(e, t) : void 0;
  }
}
function mi(e) {
  var t, n;
  function r(a, o) {
    try {
      var s = e[a](o), l = s.value, c = l instanceof kh;
      Promise.resolve(c ? l.v : l).then(function(f) {
        if (c) {
          var d = a === "return" && l.k ? a : "next";
          if (!l.k || f.done) return r(d, f);
          f = e[d](f).value;
        }
        i(!!s.done, f);
      }, function(f) {
        r("throw", f);
      });
    } catch (f) {
      i(2, f);
    }
  }
  function i(a, o) {
    a === 2 ? t.reject(o) : t.resolve({
      value: o,
      done: a
    }), (t = t.next) ? r(t.key, t.arg) : n = null;
  }
  this._invoke = function(a, o) {
    return new Promise(function(s, l) {
      var c = {
        key: a,
        arg: o,
        resolve: s,
        reject: l,
        next: null
      };
      n ? n = n.next = c : (t = n = c, r(a, o));
    });
  }, typeof e.return != "function" && (this.return = void 0);
}
mi.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
  return this;
}, mi.prototype.next = function(e) {
  return this._invoke("next", e);
}, mi.prototype.throw = function(e) {
  return this._invoke("throw", e);
}, mi.prototype.return = function(e) {
  return this._invoke("return", e);
};
var _l = Object.entries, Zs = Object.setPrototypeOf, Th = Object.isFrozen, Rh = Object.getPrototypeOf, Lh = Object.getOwnPropertyDescriptor, ft = Object.freeze, pt = Object.seal, Qn = Object.create, bl = typeof Reflect < "u" && Reflect, Pa = bl.apply, Na = bl.construct;
ft || (ft = function(t) {
  return t;
});
pt || (pt = function(t) {
  return t;
});
Pa || (Pa = function(t, n) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) i[a - 2] = arguments[a];
  return t.apply(n, i);
});
Na || (Na = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
  return new t(...r);
});
var zn = lt(Array.prototype.forEach);
Array.prototype.indexOf;
var Ch = lt(Array.prototype.lastIndexOf), Xs = lt(Array.prototype.pop), br = lt(Array.prototype.push);
Array.prototype.slice;
var Mh = lt(Array.prototype.splice), tr = Array.isArray, Tr = lt(String.prototype.toLowerCase), la = lt(String.prototype.toString), Ys = lt(String.prototype.match), wr = lt(String.prototype.replace), Qs = lt(String.prototype.indexOf), Ph = lt(String.prototype.trim), Nh = lt(Number.prototype.toString), Ih = lt(Boolean.prototype.toString), Ks = typeof BigInt > "u" ? null : lt(BigInt.prototype.toString), Js = typeof Symbol > "u" ? null : lt(Symbol.prototype.toString), Et = lt(Object.prototype.hasOwnProperty), kr = lt(Object.prototype.toString), bt = lt(RegExp.prototype.test), mn = Oh(TypeError);
function lt(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
    return Pa(e, t, r);
  };
}
function Oh(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];
    return Na(e, n);
  };
}
function je(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Tr;
  if (Zs && Zs(e, null), !tr(t)) return e;
  let r = t.length;
  for (; r--; ) {
    let i = t[r];
    if (typeof i == "string") {
      const a = n(i);
      a !== i && (Th(t) || (t[r] = a), i = a);
    }
    e[i] = !0;
  }
  return e;
}
function zh(e) {
  for (let t = 0; t < e.length; t++) Et(e, t) || (e[t] = null);
  return e;
}
function It(e) {
  const t = Qn(null);
  for (const r of _l(e)) {
    var n = Ah(r, 2);
    const i = n[0], a = n[1];
    Et(e, i) && (tr(a) ? t[i] = zh(a) : a && typeof a == "object" && a.constructor === Object ? t[i] = It(a) : t[i] = a);
  }
  return t;
}
function $h(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return Nh(e);
    case "boolean":
      return Ih(e);
    case "bigint":
      return Ks ? Ks(e) : "0";
    case "symbol":
      return Js ? Js(e) : "Symbol()";
    case "undefined":
      return kr(e);
    case "function":
    case "object": {
      if (e === null) return kr(e);
      const t = e, n = Ut(t, "toString");
      if (typeof n == "function") {
        const r = n(t);
        return typeof r == "string" ? r : kr(r);
      }
      return kr(e);
    }
    default:
      return kr(e);
  }
}
function Ut(e, t) {
  for (; e !== null; ) {
    const r = Lh(e, t);
    if (r) {
      if (r.get) return lt(r.get);
      if (typeof r.value == "function") return lt(r.value);
    }
    e = Rh(e);
  }
  function n() {
    return null;
  }
  return n;
}
function Dh(e) {
  try {
    return bt(e, ""), !0;
  } catch {
    return !1;
  }
}
var eo = ft([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), ca = ft([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), ua = ft([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), Bh = ft([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), ha = ft([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), Uh = ft([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), to = ft(["#text"]), no = ft([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), fa = ft([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), ro = ft([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), yi = ft([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), jh = pt(/{{[\w\W]*|^[\w\W]*}}/g), Wh = pt(/<%[\w\W]*|^[\w\W]*%>/g), Fh = pt(/\${[\w\W]*/g), qh = pt(/^data-[\-\w.\u00B7-\uFFFF]+$/), Hh = pt(/^aria-[\-\w]+$/), io = pt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Gh = pt(/^(?:\w+script|data):/i), Vh = pt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Zh = pt(/^html$/i), Xh = pt(/^[a-z][.\w]*(-[.\w]+)+$/i), ao = pt(/<[/\w!]/g), so = pt(/<[/\w]/g), Yh = pt(/<\/no(script|embed|frames)/i), Qh = pt(/\/>/i), Mt = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, wl = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], Kh = ft(je({}, wl)), Jh = (function() {
  const e = {};
  return zn(wl, (t) => {
    e[t] = pt(new RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ft(e);
})(), ef = function() {
  return typeof window > "u" ? null : window;
}, tf = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let r = null;
  const i = "data-tt-policy-suffix";
  n && n.hasAttribute(i) && (r = n.getAttribute(i));
  const a = "dompurify" + (r ? "#" + r : "");
  try {
    return t.createPolicy(a, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, oo = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, yn = function(t, n, r, i) {
  return Et(t, n) && tr(t[n]) ? je(i.base ? It(i.base) : {}, t[n], i.transform) : r;
}, da = function(t, n, r) {
  const i = Et(t, n) ? t[n] : void 0;
  return i && typeof i == "object" ? It(i) : r();
};
function kl() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ef();
  const t = (Y) => kl(Y);
  if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== Mt.document || !e.Element)
    return t.isSupported = !1, t;
  let n = e.document;
  const r = n, i = r.currentScript;
  e.DocumentFragment;
  const a = e.HTMLTemplateElement, o = e.Node, s = e.Element, l = e.NodeFilter;
  e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const c = e.DOMParser, f = e.trustedTypes, d = s.prototype, u = Ut(d, "cloneNode"), p = Ut(d, "remove"), m = Ut(d, "removeAttributeNode"), g = Ut(d, "nextSibling"), y = Ut(d, "childNodes"), h = Ut(d, "parentNode"), b = Ut(d, "shadowRoot"), _ = Ut(d, "attributes"), w = o && o.prototype ? Ut(o.prototype, "nodeType") : null, A = o && o.prototype ? Ut(o.prototype, "nodeName") : null, z = o && o.prototype ? Ut(o.prototype, "ownerDocument") : null, j = function(k) {
    return w ? w(k) : k.nodeType;
  }, W = function(k) {
    return A ? A(k) : k.nodeName;
  };
  if (typeof a == "function") {
    const Y = n.createElement("template");
    Y.content && Y.content.ownerDocument && (n = Y.content.ownerDocument);
  }
  let Q, ae = "", ue, ne = !1, C = 0;
  const N = function() {
    if (C > 0) throw mn('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, L = function(k) {
    N(), C++;
    try {
      return Q.createHTML(k);
    } finally {
      C--;
    }
  }, E = function(k) {
    N(), C++;
    try {
      return Q.createScriptURL(k);
    } finally {
      C--;
    }
  }, I = function() {
    return ne || (ue = tf(f, i), ne = !0), ue;
  }, Z = n, $ = Z.implementation, re = Z.createNodeIterator, oe = Z.createDocumentFragment, me = Z.getElementsByTagName, he = r.importNode;
  let Se = oo();
  t.isSupported = typeof _l == "function" && typeof h == "function" && $ && $.createHTMLDocument !== void 0;
  const De = jh, le = Wh, Be = Fh, Je = qh, st = Hh, v = Gh, M = Vh, q = Xh;
  let D = io, R = null;
  const B = je({}, [
    ...eo,
    ...ca,
    ...ua,
    ...ha,
    ...to
  ]);
  let O = null;
  const K = je({}, [
    ...no,
    ...fa,
    ...ro,
    ...yi
  ]);
  let U = Object.seal(Qn(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), H = null, G = null;
  const ie = Object.seal(Qn(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ge = !0, Pe = !0, Ce = !1, Ie = !0, ve = !1, qe = !0, Ue = !1, Wt = !1, Ln = null, qn = null, sr = !1, on = !1, Hn = !1, Gn = !1, or = !0, ti = !1;
  const ni = "user-content-";
  let lr = !0, Cn = !1, Jt = {}, en = null;
  const ri = je({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let cr = null;
  const tn = je({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let S = null;
  const X = je({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), fe = "http://www.w3.org/1998/Math/MathML", Re = "http://www.w3.org/2000/svg", We = "http://www.w3.org/1999/xhtml";
  let Ge = We, ye = !1, pe = null;
  const Ee = je({}, [
    fe,
    Re,
    We
  ], la), at = ft([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Ke = je({}, at);
  const ln = ft(["annotation-xml"]);
  let Mn = je({}, ln);
  const ur = je({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Pn = null;
  const hr = ["application/xhtml+xml", "text/html"], Qi = "text/html";
  let et = null, cn = null;
  const ii = n.createElement("form"), Nn = function(k) {
    return k instanceof RegExp || k instanceof Function;
  }, fr = function() {
    let k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (cn && cn === k) return;
    (!k || typeof k != "object") && (k = {}), k = It(k), Pn = hr.indexOf(k.PARSER_MEDIA_TYPE) === -1 ? Qi : k.PARSER_MEDIA_TYPE, et = Pn === "application/xhtml+xml" ? la : Tr, R = yn(k, "ALLOWED_TAGS", B, { transform: et }), O = yn(k, "ALLOWED_ATTR", K, { transform: et }), pe = yn(k, "ALLOWED_NAMESPACES", Ee, { transform: la }), S = yn(k, "ADD_URI_SAFE_ATTR", X, {
      transform: et,
      base: X
    }), cr = yn(k, "ADD_DATA_URI_TAGS", tn, {
      transform: et,
      base: tn
    }), en = yn(k, "FORBID_CONTENTS", ri, { transform: et }), H = yn(k, "FORBID_TAGS", It({}), { transform: et }), G = yn(k, "FORBID_ATTR", It({}), { transform: et }), Jt = Et(k, "USE_PROFILES") ? k.USE_PROFILES && typeof k.USE_PROFILES == "object" ? It(k.USE_PROFILES) : k.USE_PROFILES : !1, ge = k.ALLOW_ARIA_ATTR !== !1, Pe = k.ALLOW_DATA_ATTR !== !1, Ce = k.ALLOW_UNKNOWN_PROTOCOLS || !1, Ie = k.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ve = k.SAFE_FOR_TEMPLATES || !1, qe = k.SAFE_FOR_XML !== !1, Ue = k.WHOLE_DOCUMENT || !1, on = k.RETURN_DOM || !1, Hn = k.RETURN_DOM_FRAGMENT || !1, Gn = k.RETURN_TRUSTED_TYPE || !1, sr = k.FORCE_BODY || !1, or = k.SANITIZE_DOM !== !1, ti = k.SANITIZE_NAMED_PROPS || !1, lr = k.KEEP_CONTENT !== !1, Cn = k.IN_PLACE || !1, D = Dh(k.ALLOWED_URI_REGEXP) ? k.ALLOWED_URI_REGEXP : io, Ge = typeof k.NAMESPACE == "string" ? k.NAMESPACE : We, Ke = da(k, "MATHML_TEXT_INTEGRATION_POINTS", () => je({}, at)), Mn = da(k, "HTML_INTEGRATION_POINTS", () => je({}, ln));
    const T = da(k, "CUSTOM_ELEMENT_HANDLING", () => Qn(null));
    if (U = Qn(null), Et(T, "tagNameCheck") && Nn(T.tagNameCheck) && (U.tagNameCheck = T.tagNameCheck), Et(T, "attributeNameCheck") && Nn(T.attributeNameCheck) && (U.attributeNameCheck = T.attributeNameCheck), Et(T, "allowCustomizedBuiltInElements") && typeof T.allowCustomizedBuiltInElements == "boolean" && (U.allowCustomizedBuiltInElements = T.allowCustomizedBuiltInElements), pt(U), ve && (Pe = !1), Hn && (on = !0), Jt && (R = je({}, to), O = Qn(null), Jt.html === !0 && (je(R, eo), je(O, no)), Jt.svg === !0 && (je(R, ca), je(O, fa), je(O, yi)), Jt.svgFilters === !0 && (je(R, ua), je(O, fa), je(O, yi)), Jt.mathMl === !0 && (je(R, ha), je(O, ro), je(O, yi))), ie.tagCheck = null, ie.attributeCheck = null, Et(k, "ADD_TAGS") && (typeof k.ADD_TAGS == "function" ? ie.tagCheck = k.ADD_TAGS : tr(k.ADD_TAGS) && (R === B && (R = It(R)), je(R, k.ADD_TAGS, et))), Et(k, "ADD_ATTR") && (typeof k.ADD_ATTR == "function" ? ie.attributeCheck = k.ADD_ATTR : tr(k.ADD_ATTR) && (O === K && (O = It(O)), je(O, k.ADD_ATTR, et))), Et(k, "ADD_FORBID_CONTENTS") && tr(k.ADD_FORBID_CONTENTS) && (en === ri && (en = It(en)), je(en, k.ADD_FORBID_CONTENTS, et)), lr && (R["#text"] = !0), Ue && je(R, [
      "html",
      "head",
      "body"
    ]), R.table && (je(R, ["tbody"]), delete H.tbody), k.TRUSTED_TYPES_POLICY) {
      if (typeof k.TRUSTED_TYPES_POLICY.createHTML != "function") throw mn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof k.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw mn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const V = Q;
      Q = k.TRUSTED_TYPES_POLICY;
      try {
        ae = L("");
      } catch (P) {
        throw Q = V, P;
      }
    } else k.TRUSTED_TYPES_POLICY === null ? (Q = void 0, ae = "") : (Q === void 0 && (Q = I()), Q && typeof ae == "string" && (ae = L("")));
    ft && ft(k), cn = k;
  }, ai = je({}, [
    ...ca,
    ...ua,
    ...Bh
  ]), si = je({}, [...ha, ...Uh]), Vt = function(k, T, V) {
    return T.namespaceURI === We ? k === "svg" : T.namespaceURI === fe ? k === "svg" && (V === "annotation-xml" || Ke[V]) : !!ai[k];
  }, oi = function(k, T, V) {
    return T.namespaceURI === We ? k === "math" : T.namespaceURI === Re ? k === "math" && Mn[V] : !!si[k];
  }, li = function(k, T, V) {
    return T.namespaceURI === Re && !Mn[V] || T.namespaceURI === fe && !Ke[V] ? !1 : !si[k] && (ur[k] || !ai[k]);
  }, Ki = function(k) {
    let T = h(k);
    (!T || !T.tagName) && (T = {
      namespaceURI: Ge,
      tagName: "template"
    });
    const V = Tr(k.tagName), P = Tr(T.tagName);
    return pe[k.namespaceURI] ? k.namespaceURI === Re ? Vt(V, T, P) : k.namespaceURI === fe ? oi(V, T, P) : k.namespaceURI === We ? li(V, T, P) : !!(Pn === "application/xhtml+xml" && pe[k.namespaceURI]) : !1;
  }, Zt = function(k) {
    br(t.removed, { element: k });
    try {
      h(k).removeChild(k);
    } catch {
      if (p(k), !h(k)) throw mn("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, ci = function(k, T, V) {
    try {
      m(k, T);
    } catch {
      try {
        k.removeAttribute(V);
      } catch {
      }
    }
  }, nn = function(k) {
    ke(k);
    const T = y(k);
    if (T) {
      const P = [];
      zn(T, (F) => {
        br(P, F);
      }), zn(P, (F) => {
        try {
          p(F);
        } catch {
        }
      });
    }
    const V = _(k);
    if (V) for (let P = V.length - 1; P >= 0; --P) {
      const F = V[P], ce = F && F.name;
      typeof ce == "string" && ci(k, F, ce);
    }
  }, rn = function(k, T, V) {
    if (!V) try {
      V = T.getAttributeNode(k);
    } catch {
      V = null;
    }
    br(t.removed, {
      attribute: V || null,
      from: T
    });
    try {
      V ? m(T, V) : T.removeAttribute(k);
    } catch {
      try {
        T.removeAttribute(k);
      } catch {
      }
    }
    if (k === "is")
      if (on || Hn) try {
        Zt(T);
      } catch {
      }
      else try {
        T.setAttribute(k, "");
      } catch {
      }
  }, J = function(k) {
    const T = _(k);
    if (T)
      for (let V = T.length - 1; V >= 0; --V) {
        const P = T[V], F = P && P.name;
        typeof F != "string" || O[et(F)] || ci(k, P, F);
      }
  }, ke = function(k) {
    const T = [k];
    for (; T.length > 0; ) {
      const V = T.pop();
      j(V) === Mt.element && J(V);
      const P = y(V);
      if (P) for (let F = P.length - 1; F >= 0; --F) T.push(P[F]);
    }
  }, Ne = function(k, T) {
    return qe ? k === "patchsrc" ? !0 : k === "for" && T !== "label" && T !== "output" : !1;
  }, Ve = function(k) {
    if (!qe) return;
    const T = [k];
    for (; T.length > 0; ) {
      const V = T.pop(), P = j(V);
      if (P === Mt.processingInstruction || P === Mt.comment && bt(so, V.data)) {
        try {
          p(V);
        } catch {
        }
        continue;
      }
      if (P === Mt.element) {
        const ce = V, be = et(W(V));
        try {
          ce.hasAttribute && ce.hasAttribute("patchsrc") && ce.removeAttribute("patchsrc"), ce.hasAttribute && ce.hasAttribute("for") && Ne("for", be) && ce.removeAttribute("for");
        } catch {
        }
      }
      const F = y(V);
      if (F) for (let ce = F.length - 1; ce >= 0; --ce) T.push(F[ce]);
    }
  }, tt = function(k) {
    let T = null, V = null;
    if (sr) k = "<remove></remove>" + k;
    else {
      const ce = Ys(k, /^[\r\n\t ]+/);
      V = ce && ce[0];
    }
    Pn === "application/xhtml+xml" && Ge === We && (k = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + k + "</body></html>");
    const P = Q ? L(k) : k;
    if (Ge === We) try {
      T = new c().parseFromString(P, Pn);
    } catch {
    }
    if (!T || !T.documentElement) {
      T = $.createDocument(Ge, "template", null);
      try {
        T.documentElement.innerHTML = ye ? ae : P;
      } catch {
      }
    }
    const F = T.body || T.documentElement;
    return k && V && F.insertBefore(n.createTextNode(V), F.childNodes[0] || null), Ge === We ? me.call(T, Ue ? "html" : "body")[0] : Ue ? T.documentElement : F;
  }, Tt = function(k) {
    const T = z ? z(k) : k.ownerDocument;
    return re.call(T || k, k, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null);
  }, At = function(k) {
    return k = wr(k, De, " "), k = wr(k, le, " "), k = wr(k, Be, " "), k;
  }, Rt = function(k) {
    var T;
    k.normalize();
    const V = z ? z(k) : k.ownerDocument, P = re.call(V || k, k, l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION, null);
    let F = P.nextNode();
    for (; F; )
      F.data = At(F.data), F = P.nextNode();
    const ce = (T = k.querySelectorAll) === null || T === void 0 ? void 0 : T.call(k, "template");
    ce && zn(ce, (be) => {
      Ft(be.content) && Rt(be.content);
    });
  }, _t = function(k) {
    const T = A ? A(k) : null;
    return typeof T != "string" || et(T) !== "form" ? !1 : typeof k.nodeName != "string" || typeof k.textContent != "string" || typeof k.removeChild != "function" || k.attributes !== _(k) || typeof k.removeAttribute != "function" || typeof k.removeAttributeNode != "function" || typeof k.getAttributeNode != "function" || typeof k.setAttribute != "function" || typeof k.namespaceURI != "string" || typeof k.insertBefore != "function" || typeof k.hasChildNodes != "function" || k.nodeType !== w(k) || k.childNodes !== y(k);
  }, Ft = function(k) {
    if (!w || typeof k != "object" || k === null) return !1;
    try {
      return w(k) === Mt.documentFragment;
    } catch {
      return !1;
    }
  }, un = function(k) {
    if (!w || typeof k != "object" || k === null) return !1;
    try {
      return typeof w(k) == "number";
    } catch {
      return !1;
    }
  };
  function Lt(Y, k, T) {
    Y.length !== 0 && zn(Y, (V) => {
      V.call(t, k, T, cn);
    });
  }
  const ui = function(k, T) {
    return !!(qe && k.hasChildNodes() && !un(k.firstElementChild) && bt(ao, k.textContent) && bt(ao, k.innerHTML) || qe && k.namespaceURI === We && Kh[T] && (un(k.firstElementChild) || typeof k.textContent == "string" && bt(Jh[T], k.textContent)) || k.nodeType === Mt.processingInstruction || qe && k.nodeType === Mt.comment && bt(so, k.data));
  }, Vn = function(k, T) {
    if (k instanceof RegExp) return bt(k, T);
    if (k instanceof Function) {
      for (var V = arguments.length, P = new Array(V > 2 ? V - 2 : 0), F = 2; F < V; F++) P[F - 2] = arguments[F];
      return !!k(T, ...P);
    }
    return !1;
  }, Ji = function(k, T, V) {
    if (!H[T] && fi(T) && Vn(U.tagNameCheck, T)) return !1;
    if (lr && !en[T]) {
      const P = h(k), F = y(k);
      if (F && P) {
        const ce = F.length;
        for (let be = ce - 1; be >= 0; --be) {
          const Me = k === V ? u(F[be], !0) : F[be];
          P.insertBefore(Me, g(k));
        }
      }
    }
    return Zt(k), !0;
  }, hi = function(k, T, V, P) {
    return k.length === 0 ? T : T === V || T === P ? It(T) : T;
  }, hn = function(k, T) {
    return k === T || h(k) !== null ? !1 : (Cn && ke(k), !0);
  }, In = function(k, T) {
    if (Lt(Se.beforeSanitizeElements, k, null), hn(k, T)) return !0;
    if (_t(k))
      return Zt(k), !0;
    const V = et(W(k));
    if (R = hi(Se.uponSanitizeElement, R, B, Ln), Lt(Se.uponSanitizeElement, k, {
      tagName: V,
      allowedTags: R
    }), hn(k, T)) return !0;
    if (ui(k, V))
      return Zt(k), !0;
    if (H[V] || !(ie.tagCheck instanceof Function && ie.tagCheck(V)) && !R[V]) {
      const P = Ji(k, V, T);
      return P === !1 && (Lt(Se.afterSanitizeElements, k, null), hn(k, T)) ? !0 : P;
    }
    if (j(k) === Mt.element && !Ki(k) || (V === "noscript" || V === "noembed" || V === "noframes") && bt(Yh, k.innerHTML))
      return Zt(k), !0;
    if (ve && k.nodeType === Mt.text) {
      const P = At(k.textContent);
      k.textContent !== P && (br(t.removed, { element: k.cloneNode() }), k.textContent = P);
    }
    return Lt(Se.afterSanitizeElements, k, null), hn(k, T);
  }, dr = function(k, T, V) {
    if (G[T] || Ne(T, k) || or && (T === "id" || T === "name") && (V in n || V in ii)) return !1;
    const P = O[T] || ie.attributeCheck instanceof Function && ie.attributeCheck(T, k);
    return Pe && bt(Je, T) || ge && bt(st, T) ? !0 : P ? S[T] || bt(D, wr(V, M, "")) || (T === "src" || T === "xlink:href" || T === "href") && k !== "script" && Qs(V, "data:") === 0 && cr[k] || Ce && !bt(v, wr(V, M, "")) ? !0 : !V : fi(k) && Vn(U.tagNameCheck, k) && Vn(U.attributeNameCheck, T, k) || T === "is" && U.allowCustomizedBuiltInElements && Vn(U.tagNameCheck, V);
  }, Bt = je({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), fi = function(k) {
    return !Bt[Tr(k)] && bt(q, k);
  }, pr = function(k, T, V, P) {
    if (Q && typeof f == "object" && typeof f.getAttributeType == "function" && !V) switch (f.getAttributeType(k, T)) {
      case "TrustedHTML":
        return L(P);
      case "TrustedScriptURL":
        return E(P);
    }
    return P;
  }, Te = function(k, T, V, P) {
    try {
      return V ? k.setAttributeNS(V, T, P) : k.setAttribute(T, P), _t(k) ? (Zt(k), !1) : !0;
    } catch {
      return rn(T, k), !1;
    }
  }, gr = function(k, T) {
    if (Lt(Se.beforeSanitizeAttributes, k, null), hn(k, T)) return;
    const V = k.attributes;
    if (!V || _t(k)) return;
    O = hi(Se.uponSanitizeAttribute, O, K, qn);
    const P = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: O,
      forceKeepAttr: void 0
    };
    let F = V.length;
    const ce = et(k.nodeName);
    for (; F--; ) {
      const be = V[F], Me = be.name, rt = be.namespaceURI, xt = be.value, fn = et(Me), ea = xt;
      let St = Me === "value" ? ea : Ph(ea), ls = !1;
      if (P.attrName = fn, P.attrValue = St, P.keepAttr = !0, P.forceKeepAttr = void 0, Lt(Se.uponSanitizeAttribute, k, P), St = P.attrValue, ti && (fn === "id" || fn === "name") && Qs(St, ni) !== 0 && (rn(Me, k, be), St = ni + St, ls = !0), qe && bt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, St)) {
        rn(Me, k, be);
        continue;
      }
      if (fn === "attributename" && Ys(St, "href")) {
        rn(Me, k, be);
        continue;
      }
      if (!P.forceKeepAttr) {
        if (!P.keepAttr) {
          rn(Me, k, be);
          continue;
        }
        if (!Ie && bt(Qh, St)) {
          rn(Me, k, be);
          continue;
        }
        if (ve && (St = At(St)), !dr(ce, fn, St)) {
          rn(Me, k, be);
          continue;
        }
        St = pr(ce, fn, rt, St), St !== ea && Te(k, Me, rt, St) && ls && Xs(t.removed);
      }
    }
    Lt(Se.afterSanitizeAttributes, k, null), hn(k, T);
  }, nt = function(k) {
    let T = null;
    const V = Tt(k);
    for (Lt(Se.beforeSanitizeShadowDOM, k, null); T = V.nextNode(); )
      if (Lt(Se.uponSanitizeShadowNode, T, null), In(T, k), gr(T, k), Ft(T.content) && nt(T.content), j(T) === Mt.element) {
        const P = b(T);
        Ft(P) && (He(P), nt(P));
      }
    Lt(Se.afterSanitizeShadowDOM, k, null);
  }, He = function(k) {
    const T = [{
      node: k,
      shadow: null
    }];
    for (; T.length > 0; ) {
      const V = T.pop();
      if (V.shadow) {
        nt(V.shadow);
        continue;
      }
      const P = V.node, F = j(P) === Mt.element, ce = y(P);
      if (ce) for (let be = ce.length - 1; be >= 0; --be) T.push({
        node: ce[be],
        shadow: null
      });
      if (F) {
        const be = A ? A(P) : null;
        if (typeof be == "string" && et(be) === "template") {
          const Me = P.content;
          Ft(Me) && T.push({
            node: Me,
            shadow: null
          });
        }
      }
      if (F) {
        const be = b(P);
        Ft(be) && T.push({
          node: null,
          shadow: be
        }, {
          node: be,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(Y) {
    let k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, T = null, V = null, P = null, F = null;
    if (ye = !Y, ye && (Y = "<!-->"), typeof Y != "string" && !un(Y) && (Y = $h(Y), typeof Y != "string"))
      throw mn("dirty is not a string, aborting");
    if (!t.isSupported) return Y;
    Wt ? (R = Ln, O = qn) : fr(k), (Se.uponSanitizeElement.length > 0 || Se.uponSanitizeAttribute.length > 0) && (R = It(R)), Se.uponSanitizeAttribute.length > 0 && (O = It(O)), t.removed = [];
    const ce = Cn && typeof Y != "string" && un(Y);
    if (ce) {
      Ve(Y);
      const rt = W(Y);
      if (typeof rt == "string") {
        const xt = et(rt);
        if (!R[xt] || H[xt])
          throw nn(Y), mn("root node is forbidden and cannot be sanitized in-place");
      }
      if (_t(Y))
        throw nn(Y), mn("root node is clobbered and cannot be sanitized in-place");
      try {
        He(Y);
      } catch (xt) {
        throw nn(Y), xt;
      }
    } else if (un(Y))
      T = tt("<!---->"), V = T.ownerDocument.importNode(Y, !0), V.nodeType === Mt.element && V.nodeName === "BODY" || V.nodeName === "HTML" ? T = V : T.appendChild(V), He(T);
    else {
      if (!on && !ve && !Ue && Y.indexOf("<") === -1) return Q && Gn ? L(Y) : Y;
      if (T = tt(Y), !T) return on ? null : Gn ? ae : "";
    }
    T && sr && Zt(T.firstChild);
    const be = ce ? Y : T;
    try {
      const rt = Tt(be);
      for (; P = rt.nextNode(); )
        In(P, be), gr(P, be), Ft(P.content) && nt(P.content);
    } catch (rt) {
      throw ce && (nn(Y), zn(t.removed, (xt) => {
        xt.element && ke(xt.element);
      })), rt;
    }
    if (ce) {
      let rt = !1;
      if (zn(t.removed, (xt) => {
        xt.element && (xt.element === Y && (rt = !0), ke(xt.element));
      }), rt) throw mn("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return ve && Rt(Y), Y;
    }
    if (on) {
      if (ve && Rt(T), Hn)
        for (F = oe.call(T.ownerDocument); T.firstChild; ) F.appendChild(T.firstChild);
      else F = T;
      return (O.shadowroot || O.shadowrootmode) && (F = he.call(r, F, !0)), F;
    }
    let Me = Ue ? T.outerHTML : T.innerHTML;
    return Ue && R["!doctype"] && T.ownerDocument && T.ownerDocument.doctype && T.ownerDocument.doctype.name && bt(Zh, T.ownerDocument.doctype.name) && (Me = "<!DOCTYPE " + T.ownerDocument.doctype.name + `>
` + Me), ve && (Me = At(Me)), Q && Gn ? L(Me) : Me;
  }, t.setConfig = function() {
    let Y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    fr(Y), Wt = !0, Ln = R, qn = O;
  }, t.clearConfig = function() {
    cn = null, Wt = !1, Ln = null, qn = null, Q = ue, ae = "";
  }, t.isValidAttribute = function(Y, k, T) {
    cn || fr({});
    const V = et(Y), P = et(k);
    return dr(V, P, T);
  }, t.addHook = function(Y, k) {
    typeof k == "function" && Et(Se, Y) && br(Se[Y], k);
  }, t.removeHook = function(Y, k) {
    if (Et(Se, Y)) {
      if (k !== void 0) {
        const T = Ch(Se[Y], k);
        return T === -1 ? void 0 : Mh(Se[Y], T, 1)[0];
      }
      return Xs(Se[Y]);
    }
  }, t.removeHooks = function(Y) {
    Et(Se, Y) && (Se[Y] = []);
  }, t.removeAllHooks = function() {
    Se = oo();
  }, t;
}
var pa = kl(), nf = /* @__PURE__ */ Fi({
  _sendToRenderer: () => Sl,
  _slugifyLocal: () => Oa,
  _splitIntoSections: () => vl,
  addMarkdownExtension: () => Ia,
  detectFenceLanguages: () => Wi,
  detectFenceLanguagesAsync: () => $a,
  initRendererWorker: () => Zi,
  markdownPlugins: () => En,
  parseMarkdownToHtml: () => rr,
  setMarkdownExtensions: () => lf,
  slugify: () => we,
  streamParseMarkdown: () => za,
  teardownRendererWorkerPool: () => of
}), rf = Lo(), af = {
  intervalMs: 500,
  targetMs: 75,
  hysteresis: 0.25,
  cooldownMs: 500,
  stepUp: 1,
  stepDown: 1
}, Or = null;
function sf() {
  const e = {
    size: rf,
    minSize: 2,
    autoScale: af,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    typeof import.meta < "u" && (e.debugLevel = 0);
  } catch {
  }
  try {
    return new Za(wh, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("renderer worker unavailable");
      }
    };
  }
}
function xl() {
  return Or || (Or = sf()), Or;
}
function of() {
  const e = Or;
  if (Or = null, !!e)
    try {
      typeof e.drain == "function" && e.drain().catch(() => {
      }), typeof e.terminate == "function" && e.terminate(), typeof e.dispose == "function" && e.dispose();
    } catch (t) {
      x("[markdown] teardownRendererWorkerPool failed", t);
    }
}
var Zi = () => xl().workers?.[0]?.worker?._underlying ?? null, Sl = (e, t = 3e3) => Zi?.() ? xl().postMessage(e, void 0, {
  awaitResponse: !0,
  timeout: t
}).then((n) => {
  if (n?.error) throw new Error(n.error);
  return n;
}).catch((n) => {
  throw (n?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : n;
}) : Promise.reject(/* @__PURE__ */ new Error("renderer worker unavailable")), En = [];
function Ia(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    En.push(e);
    try {
      Oe.use(e);
    } catch (t) {
      x("[markdown] failed to apply plugin", t);
    }
  }
}
function lf(e) {
  En.length = 0, Array.isArray(e) && En.push(...e.filter((t) => t && typeof t == "object"));
  try {
    En.forEach((t) => Oe.use(t));
  } catch (t) {
    x("[markdown] failed to apply markdown extensions", t);
  }
}
function Oa(e) {
  return we(e);
}
function vl(e, t) {
  const n = String(e ?? "");
  if (!n || n.length <= t) return [n];
  const r = /^#{1,6}\s.*$/gm, i = [];
  let a;
  for (; (a = r.exec(n)) !== null; ) i.push(a.index);
  if (!i.length || i.length < 2) {
    const c = [];
    for (let f = 0; f < n.length; f += t) c.push(n.slice(f, f + t));
    return c;
  }
  const o = [];
  i[0] > 0 && o.push(n.slice(0, i[0]));
  for (let c = 0; c < i.length; c++) {
    const f = i[c], d = c + 1 < i.length ? i[c + 1] : n.length;
    o.push(n.slice(f, d));
  }
  const s = [];
  let l = "";
  for (const c of o) {
    if (!l && c.length >= t) {
      s.push(c);
      continue;
    }
    l.length + c.length <= t ? l += c : (l && s.push(l), l = c);
  }
  return l && s.push(l), s;
}
async function za(e, t, n = {}) {
  const r = n?.chunkSize ? Number(n.chunkSize) : 65536, i = typeof t == "function" ? t : () => {
  }, { content: a, data: o } = er(String(e ?? ""));
  let s = a;
  try {
    s = String(s ?? "").replace(/:([^:\s]+):/g, (d, u) => Er[u] || d);
  } catch {
  }
  Zi?.();
  const l = vl(s, r), c = it(), f = /* @__PURE__ */ new Map();
  for (let d = 0; d < l.length; d++) {
    const u = l[d], p = await rr(u);
    let m = String(p?.html || ""), g = [];
    if (c) try {
      const h = c.parseFromString(m, "text/html");
      h.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((b) => {
        try {
          const _ = Number(b.tagName.substring(1)), w = (b.textContent || "").trim(), A = Oa(w), z = (f.get(A) || 0) + 1;
          f.set(A, z);
          const j = z === 1 ? A : A + "-" + z;
          b.id = j, g.push({
            level: _,
            text: w,
            id: j
          });
        } catch {
        }
      });
      try {
        typeof XMLSerializer < "u" ? m = new XMLSerializer().serializeToString(h.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : m = Array.from(h.body.childNodes || []).map((b) => typeof b?.outerHTML == "string" ? b.outerHTML : typeof b?.textContent == "string" ? b.textContent : "").join("");
      } catch {
      }
    } catch {
    }
    else try {
      const h = [];
      m = m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (b, _, w, A) => {
        const z = Number(_), j = A.replace(/<[^>]+>/g, "").trim(), W = Oa(j), Q = (f.get(W) || 0) + 1;
        f.set(W, Q);
        const ae = Q === 1 ? W : W + "-" + Q;
        return h.push({
          level: z,
          text: j,
          id: ae
        }), `<h${z} ${(w || "").replace(/\s*(id|class)="[^"]*"/g, "")} id="${ae}">${A}</h${z}>`;
      }), g = h;
    } catch {
    }
    const y = {
      index: d,
      isLast: d === l.length - 1,
      meta: d === 0 ? o || {} : {},
      toc: g
    };
    try {
      i(m, y);
    } catch {
    }
  }
}
async function rr(e) {
  if (En?.length) {
    let { content: r, data: i } = er(e || "");
    try {
      r = String(r ?? "").replace(/:([^:\s]+):/g, (o, s) => Er[s] || o);
    } catch {
    }
    Oe.setOptions({ gfm: !0 });
    try {
      En.forEach((o) => Oe.use(o));
    } catch (o) {
      x("[markdown] apply plugins failed", o);
    }
    const a = pa.sanitize(Oe.parse(r));
    try {
      const o = it();
      if (o) {
        const s = o.parseFromString(a, "text/html"), l = s.querySelectorAll("h1,h2,h3,h4,h5,h6"), c = [], f = /* @__PURE__ */ new Set(), d = (u) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, m = u <= 2 ? "has-text-weight-bold" : u <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[u] + " " + m).trim();
        };
        l.forEach((u) => {
          try {
            const p = Number(u.tagName.substring(1)), m = (u.textContent || "").trim();
            let g = we(m) || "heading", y = g, h = 2;
            for (; f.has(y); )
              y = g + "-" + h, h += 1;
            f.add(y), u.id = y, u.className = d(p), c.push({
              level: p,
              text: m,
              id: y
            });
          } catch {
          }
        });
        try {
          (typeof s?.getElementsByTagName == "function" ? Array.from(s.getElementsByTagName("img")) : typeof s?.querySelectorAll == "function" ? Array.from(s.querySelectorAll("img")) : []).forEach((u) => {
            try {
              const p = u.getAttribute?.("loading"), m = u.getAttribute?.("data-want-lazy");
              !p && !m && u.setAttribute?.("loading", "lazy");
              try {
                const g = u.getAttribute?.("alt");
                if (!g || !String(g).trim()) {
                  const y = u.getAttribute?.("src") || "";
                  if (y) {
                    const h = String(y).split("/").pop().replace(/\.[^.]+$/, "");
                    h && u.setAttribute("alt", h.replace(/[-_]+/g, " "));
                  }
                }
              } catch {
              }
            } catch {
            }
          });
        } catch {
        }
        try {
          s.querySelectorAll("pre code, code[class]").forEach((u) => {
            try {
              const p = u.getAttribute?.("class") || u.className || "", m = String(p ?? "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (m) try {
                u.setAttribute?.("class", m);
              } catch {
                u.className = m;
              }
              else try {
                u.removeAttribute?.("class");
              } catch {
                u.className = "";
              }
            } catch {
            }
          });
        } catch {
        }
        try {
          let u = null;
          try {
            typeof XMLSerializer < "u" ? u = new XMLSerializer().serializeToString(s.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : u = Array.from(s.body.childNodes || []).map((p) => typeof p?.outerHTML == "string" ? p.outerHTML : typeof p?.textContent == "string" ? p.textContent : "").join("");
          } catch {
            try {
              u = s.body.innerHTML;
            } catch {
              u = "";
            }
          }
          return {
            html: u,
            meta: i || {},
            toc: c
          };
        } catch {
          return {
            html: "",
            meta: i || {},
            toc: c
          };
        }
      }
    } catch {
    }
    return {
      html: a,
      meta: i || {},
      toc: []
    };
  }
  try {
    e = String(e ?? "").replace(/:([^:\s]+):/g, (r, i) => Er[i] || r);
  } catch {
  }
  let t;
  t = Zi?.();
  try {
    if (Xe?.getLanguage?.("plaintext") && /```\s*\n/.test(String(e ?? ""))) {
      let { content: r, data: i } = er(e || "");
      try {
        r = String(r ?? "").replace(/:([^:\s]+):/g, (l, c) => Er[c] || l);
      } catch {
      }
      Oe.setOptions({
        gfm: !0,
        highlighted: (l, c) => {
          try {
            return c && Xe?.getLanguage?.(c) ? Xe.highlight(l, { language: c }).value : Xe?.getLanguage?.("plaintext") ? Xe.highlight(l, { language: "plaintext" }).value : l;
          } catch {
            return l;
          }
        }
      });
      let a = pa.sanitize(Oe.parse(r));
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (l, c) => {
          try {
            if (c && typeof Xe?.highlight == "function") try {
              const f = Xe.highlight(c, { language: "plaintext" });
              return `<pre><code>${f?.value ? f.value : f}</code></pre>`;
            } catch {
              try {
                if (typeof Xe?.highlightElement == "function") {
                  const d = { innerHTML: c };
                  return Xe.highlightElement(d), `<pre><code>${d.innerHTML}</code></pre>`;
                }
              } catch {
              }
            }
          } catch {
          }
          return l;
        });
      } catch {
      }
      const o = [], s = /* @__PURE__ */ new Set();
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, f, d) => {
        const u = Number(c), p = d.replace(/<[^>]+>/g, "").trim();
        let m = we(p) || "heading", g = m, y = 2;
        for (; s.has(g); )
          g = m + "-" + y, y += 1;
        s.add(g), o.push({
          level: u,
          text: p,
          id: g
        });
        const h = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, b = u <= 2 ? "has-text-weight-bold" : u <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", _ = (h[u] + " " + b).trim();
        return `<h${u} ${((f || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${g}" class="${_}"`).trim()}>${d}</h${u}>`;
      }), a = a.replace(/<img([^>]*)>/g, (l, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), {
        html: a,
        meta: i || {},
        toc: o
      };
    }
  } catch {
  }
  if (!t) try {
    let { content: r, data: i } = er(e || "");
    try {
      r = String(r ?? "").replace(/:([^:\s]+):/g, (a, o) => Er[o] || a);
    } catch {
    }
    return Oe.setOptions({
      gfm: !0,
      highlighted: (a, o) => {
        try {
          return o && Xe?.getLanguage?.(o) ? Xe.highlight(a, { language: o }).value : Xe?.getLanguage?.("plaintext") ? Xe.highlight(a, { language: "plaintext" }).value : a;
        } catch {
          return a;
        }
      }
    }), {
      html: pa.sanitize(Oe.parse(r)),
      meta: i || {}
    };
  } catch {
    throw new Error("renderer worker required but unavailable");
  }
  const n = await Sl({
    type: "render",
    md: e
  });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const r = /* @__PURE__ */ new Map(), i = [], a = (s) => {
      const l = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = s <= 2 ? "has-text-weight-bold" : s <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (l[s] + " " + c).trim();
    };
    let o = n.html;
    o = o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (s, l, c, f) => {
      const d = Number(l), u = f.replace(/<[^>]+>/g, "").trim(), p = (c || "").match(/\sid="([^"]+)"/), m = p ? p[1] : we(u) || "heading", g = (r.get(m) || 0) + 1;
      r.set(m, g);
      const y = g === 1 ? m : m + "-" + g;
      i.push({
        level: d,
        text: u,
        id: y
      });
      const h = a(d);
      return `<h${d} ${((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${h}"`).trim()}>${f}</h${d}>`;
    });
    try {
      const s = typeof document < "u" && document.documentElement?.getAttribute?.("data-nimbi-logo-moved") || "";
      if (s) {
        const l = it();
        if (l) {
          const c = l.parseFromString(o, "text/html");
          (typeof c?.getElementsByTagName == "function" ? Array.from(c.getElementsByTagName("img")) : typeof c?.querySelectorAll == "function" ? Array.from(c.querySelectorAll("img")) : []).forEach((f) => {
            try {
              const d = f?.getAttribute?.("src") || "";
              (d ? new URL(d, location.href).toString() : "") === s && f.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? o = new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : o = Array.from(c.body.childNodes || []).map((f) => typeof f?.outerHTML == "string" ? f.outerHTML : typeof f?.textContent == "string" ? f.textContent : "").join("");
          } catch {
            try {
              o = c.body.innerHTML;
            } catch {
            }
          }
        } else try {
          const c = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          o = o.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`, "g"), "");
        } catch {
        }
      }
    } catch {
    }
    return {
      html: o,
      meta: n.meta || {},
      toc: i
    };
  } catch {
    return {
      html: n.html,
      meta: n.meta || {},
      toc: n.toc || []
    };
  }
}
function Wi(e, t) {
  const n = /* @__PURE__ */ new Set(), r = /```\s*([a-zA-Z0-9_\-+]+)?/g, i = /* @__PURE__ */ new Set([
    "then",
    "now",
    "if",
    "once",
    "so",
    "and",
    "or",
    "but",
    "when",
    "the",
    "a",
    "an",
    "as",
    "let",
    "const",
    "var",
    "export",
    "import",
    "from",
    "true",
    "false",
    "null",
    "npm",
    "run",
    "echo",
    "sudo",
    "this",
    "that",
    "have",
    "using",
    "some",
    "return",
    "returns",
    "function",
    "console",
    "log",
    "error",
    "warn",
    "class",
    "new",
    "undefined",
    "with",
    "select",
    "from",
    "where",
    "join",
    "on",
    "group",
    "order",
    "by",
    "having",
    "as",
    "into",
    "values",
    "like",
    "limit",
    "offset",
    "create",
    "table",
    "index",
    "view",
    "insert",
    "update",
    "delete",
    "returning",
    "and",
    "or",
    "not",
    "all",
    "any",
    "exists",
    "case",
    "when",
    "then",
    "else",
    "end",
    "distance",
    "geometry",
    "you",
    "which",
    "would",
    "why",
    "cool",
    "other",
    "same",
    "everything",
    "check"
  ]), a = /* @__PURE__ */ new Set([
    "bash",
    "sh",
    "zsh",
    "javascript",
    "js",
    "python",
    "py",
    "php",
    "java",
    "c",
    "cpp",
    "rust",
    "go",
    "ruby",
    "perl",
    "r",
    "scala",
    "swift",
    "kotlin",
    "cs",
    "csharp",
    "html",
    "css",
    "json",
    "xml",
    "yaml",
    "yml",
    "dockerfile",
    "docker"
  ]);
  let o;
  for (; o = r.exec(e); ) if (o[1]) {
    const s = o[1].toLowerCase();
    if (To.has(s) || t?.size && s.length < 3 && !t.has(s) && !t.has(Kt?.[s])) continue;
    if (t?.size) {
      if (t.has(s)) {
        const l = t.get(s);
        l && n.add(l);
        continue;
      }
      if (Kt?.[s]) {
        const l = Kt[s];
        if (t.has(l)) {
          const c = t.get(l) || l;
          n.add(c);
          continue;
        }
      }
    }
    (a.has(s) || s.length >= 5 && s.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(s) && !i.has(s)) && n.add(s);
  }
  return n;
}
async function $a(e, t) {
  return En?.length, Wi(e || "", t);
}
function cf(e, t = 150, n = {}) {
  let r = null;
  const i = !!n.leading;
  return function(...o) {
    const s = this;
    if (r && clearTimeout(r), i && !r) try {
      e.apply(s, o);
    } catch {
    }
    r = setTimeout(() => {
      if (r = null, !i) try {
        e.apply(s, o);
      } catch {
      }
    }, t);
  };
}
function uf(e) {
  let t = !1, n = null, r = null;
  return function(...a) {
    if (n = a, r = this, t) return;
    t = !0;
    try {
      e.apply(this, a);
    } catch {
    }
    n = null, r = null;
    const o = () => {
      if (t = !1, !n) return;
      const s = n, l = r;
      n = null, r = null, t = !0;
      try {
        e.apply(l, s);
      } catch {
      }
      typeof requestAnimationFrame == "function" ? requestAnimationFrame(o) : setTimeout(o, 16);
    };
    typeof requestAnimationFrame == "function" ? requestAnimationFrame(o) : setTimeout(o, 16);
  };
}
function hf() {
  let e = [], t = !1;
  return function(r) {
    typeof r == "function" && (e.push(r), !t && (t = !0, typeof requestAnimationFrame == "function" ? requestAnimationFrame(() => {
      t = !1;
      const i = e.slice(0);
      e.length = 0;
      for (const a of i) try {
        a();
      } catch {
      }
    }) : setTimeout(() => {
      t = !1;
      const i = e.slice(0);
      e.length = 0;
      for (const a of i) try {
        a();
      } catch {
      }
    }, 0)));
  };
}
var Ei = hf(), Al = `let M = typeof DOMParser < "u" ? new DOMParser() : null;
function H() {
	return M || (typeof DOMParser < "u" ? (M = new DOMParser(), M) : null);
}
function b(t) {
	return String(t ?? "").replace(/^[./]+/, "");
}
function I(t) {
	return String(t ?? "").replace(/\\/+$/, "");
}
function k(t) {
	return I(t) + "/";
}
function F(t) {
	const n = String(t ?? "");
	return /^(https?:)?\\/\\//.test(n) || n.startsWith("mailto:") || n.startsWith("tel:");
}
function _(t, n = null) {
	const e = encodeURIComponent(String(t ?? ""));
	return n ? \`?page=\${e}#\${encodeURIComponent(String(n))}\` : \`?page=\${e}\`;
}
function B(t) {
	return String(t ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
}
function $(t, n) {
	try {
		if (!t) return t;
		const e = String(n ?? "").replace(/^\\/+|\\/+$/g, "");
		if (!e) return String(t ?? "");
		let i = String(t ?? "").replace(/^\\/+/, "");
		const s = e + "/";
		for (; i.startsWith(s);) i = i.slice(s.length);
		return i === e ? "" : i;
	} catch {
		return String(t ?? "");
	}
}
function N() {
	if (typeof DOMParser > "u") return null;
	const t = H();
	try {
		if (t?.constructor === DOMParser) return t;
	} catch {}
	return new DOMParser();
}
function S(t) {
	return String(t ?? "").replace(/^.*\\//, "");
}
function q(t) {
	const n = /* @__PURE__ */ new Map();
	try {
		if (!t || typeof t != "object") return n;
		for (const [e, i] of Object.entries(t || {})) try {
			if (!e || !i) continue;
			n.set(String(i), String(e));
		} catch {}
	} catch {}
	return n;
}
function z(t, n) {
	try {
		const e = String(t ?? "");
		return e ? e.includes("/") || /\\.(?:md|html?)$/i.test(e) ? e : q(n?.pathToSlug).get(e) || t : t;
	} catch {
		return t;
	}
}
function J(t, n = 2) {
	try {
		const e = String(t ?? "").split("/").filter(Boolean);
		return e.length ? e.slice(-Math.max(1, Math.min(n, e.length))).join("/") : "";
	} catch {
		return String(t ?? "");
	}
}
function V(t, n) {
	if (!t || !n) return null;
	try {
		if (n.has(t)) return n.get(t);
	} catch {}
	const e = S(t);
	try {
		if (e && n.has(e)) return n.get(e);
	} catch {}
	const i = J(t, 2);
	try {
		for (const [s, c] of n.entries()) if (!(!s || !c) && (s === t || s === e || String(s).endsWith(\`/\${i}\`))) return c;
	} catch {}
	return null;
}
function G(t) {
	return new Map(Object.entries(t?.pathToSlug || {}));
}
function y(t, n, e, i) {
	const s = String(e ?? ""), c = String(i ?? "");
	!s || !c || t.has(s) || (t.set(s, c), n.push({
		path: s,
		slug: c
	}));
}
async function v(t, n) {
	const e = new URL(String(t ?? ""), String(n || (typeof location < "u" ? location.href : "http://localhost/"))), i = await fetch(e.toString());
	return !i || !i.ok ? null : await i.text();
}
function E(t, n) {
	if (!t) return null;
	if (!n) {
		const e = String(t).match(/^#\\s+(.+)$/m);
		return e?.[1] ? B(e[1].trim()) : null;
	}
	try {
		const e = N();
		if (!e) return null;
		const i = e.parseFromString(String(t), "text/html"), s = i.querySelector("title")?.textContent?.trim(), c = i.querySelector("h1")?.textContent?.trim();
		return B(s || c || "") || null;
	} catch {
		return null;
	}
}
async function L(t, n, e) {
	const i = Array.from(t || []);
	if (!i.length) return;
	const s = Math.max(1, Number(n) || 1);
	let c = 0;
	const u = Array.from({ length: Math.min(s, i.length) }, async () => {
		for (; c < i.length;) {
			const a = i[c];
			c += 1, await e(a);
		}
	});
	await Promise.all(u);
}
async function K(t, n, e, i = {}) {
	const s = N();
	if (!s) return {
		html: String(t ?? ""),
		mappings: []
	};
	const c = s.parseFromString(String(t ?? ""), "text/html"), u = c.body.querySelectorAll("a");
	if (!u || !u.length) return {
		html: c.body.innerHTML,
		mappings: []
	};
	let a = "/";
	try {
		a = k(new URL(String(n ?? ""), typeof location < "u" ? location.href : "http://localhost/").pathname);
	} catch {}
	e = z(e, i);
	const f = G(i), h = [], O = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), W = [], T = [], C = String(i?.homeSlug || "_home");
	for (const o of Array.from(u)) try {
		try {
			if (o?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
		} catch {}
		const r = o.getAttribute("href") || "";
		if (!r || F(r)) continue;
		try {
			if ((r.startsWith("?") || r.includes("?")) && e) {
				const l = new URL(r, String(n || (typeof location < "u" ? location.href : "http://localhost/"))), g = l.searchParams.get("page");
				if (g && !g.includes("/")) {
					const A = e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "";
					if (A) {
						const w = b(A + g);
						o.setAttribute("href", _(w, l.hash ? l.hash.replace(/^#/, "") : null));
						continue;
					}
				}
			}
		} catch {}
		if (r.startsWith("/") && !r.endsWith(".md")) continue;
		const R = r.match(/^([^#?]+\\.md)(?:#(.+))?$/);
		if (R) {
			let l = R[1];
			const g = R[2];
			!l.startsWith("/") && e && (l = (e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "") + l);
			const A = new URL(l, String(n || (typeof location < "u" ? location.href : "http://localhost/"))).pathname;
			let w = A.startsWith(a) ? A.slice(a.length) : A;
			w = b($(w, a)), W.push({
				node: o,
				rel: w,
				frag: g
			}), f.has(w) || O.add(w);
			continue;
		}
		let D = r;
		!r.startsWith("/") && e && (r.startsWith("#") ? D = e + r : D = (e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "") + r);
		const x = new URL(D, String(n || (typeof location < "u" ? location.href : "http://localhost/"))).pathname || "";
		if (!x || !x.includes(a)) continue;
		let d = x.startsWith(a) ? x.slice(a.length) : x;
		if (d = b($(d, a)), d = I(d), d || (d = C), !d.endsWith(".md")) {
			const l = V(d, f);
			if (l) o.setAttribute("href", _(l));
			else {
				const g = /\\.[^/]+$/.test(d) ? d : \`\${d}.html\`;
				U.add(g), T.push({
					node: o,
					rel: g,
					fallbackRel: d
				});
			}
		}
	} catch {}
	if (i?.allowProbe) await L(O, 6, async (o) => {
		try {
			const r = E(await v(o, n), !1);
			if (!r) return;
			y(f, h, o, r), y(f, h, S(o), r);
		} catch {}
	}), await L(U, 5, async (o) => {
		try {
			const r = E(await v(o, n), !0);
			if (!r) return;
			y(f, h, o, r), y(f, h, S(o), r);
		} catch {}
	});
	else {
		for (const o of O) {
			const r = B(S(o).replace(/\\.md$/i, ""));
			r && (y(f, h, o, r), y(f, h, S(o), r));
		}
		for (const o of U) {
			const r = B(S(o).replace(/\\.html$/i, ""));
			r && (y(f, h, o, r), y(f, h, S(o), r));
		}
	}
	for (const o of W) {
		const r = f.get(o.rel);
		o.node.setAttribute("href", _(r || o.rel, o.frag || null));
	}
	for (const o of T) {
		const r = f.get(o.rel) || f.get(S(o.rel)) || f.get(o.fallbackRel);
		o.node.setAttribute("href", _(r || o.rel));
	}
	return {
		html: c.body.innerHTML,
		mappings: h
	};
}
let p, m;
function Q() {
	return p !== void 0 ? p === !1 ? null : p : typeof TextEncoder < "u" ? (p = new TextEncoder(), p) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (p = { encode: (t) => new Uint8Array(Buffer.from(t)) }, p) : (p = !1, null);
}
function X() {
	return m !== void 0 ? m === !1 ? null : m : typeof TextDecoder < "u" ? (m = new TextDecoder(), m) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (m = { decode: (t) => Buffer.from(t).toString("utf8") }, m) : (m = !1, null);
}
const P = (t, n) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const e = n ?? JSON.stringify(t), i = Q();
	if (typeof i?.encode == "function") return i.encode(e);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, Y = (t) => {
	let n;
	if (t instanceof Uint8Array) n = t;
	else if (ArrayBuffer.isView(t)) n = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) n = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) n = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const e = X();
	if (typeof e?.decode == "function") return JSON.parse(e.decode(n));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(n));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
onmessage = async (t) => {
	let n;
	try {
		n = Y(t.data);
	} catch {}
	n = n || t.data || {};
	const { correlationId: e } = n, i = (c) => {
		if (e != null) {
			const u = P({
				correlationId: e,
				response: c
			});
			postMessage(u, [u.buffer]);
		} else postMessage({
			id: n.id,
			result: c
		});
	}, s = (c) => {
		if (e != null) {
			const u = P({
				correlationId: e,
				response: { error: String(c) }
			});
			postMessage(u, [u.buffer]);
		} else postMessage({
			id: n.id,
			error: String(c)
		});
	};
	try {
		if (n.type === "rewriteAnchors") {
			const { html: c, contentBase: u, pagePath: a, snapshot: f } = n;
			try {
				i(await K(c, u, a, f));
			} catch (h) {
				s(h);
			}
			return;
		}
	} catch (c) {
		s(c);
	}
};
`, lo = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Al], { type: "text/javascript;charset=utf-8" });
function ff(e) {
  let t;
  try {
    if (t = lo && (self.URL || self.webkitURL).createObjectURL(lo), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Al), {
      type: "module",
      name: e?.name
    });
  }
}
function Ot(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + vs(e, t);
  } catch {
    return vs(e, t);
  }
}
async function Da(e, t, n = 4, r) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new zo(Math.max(1, Number(n) || 1));
  return Promise.all(e.map((a, o) => i.run(() => t(a, o), { signal: r })));
}
function df(...e) {
  try {
    x(...e);
  } catch {
  }
}
function qr(e) {
  try {
    if (So(3)) return !0;
  } catch {
  }
  try {
    if (typeof xe == "string" && xe) return !0;
  } catch {
  }
  try {
    if (ee?.size) return !0;
  } catch {
  }
  try {
    if (Ye?.size) return !0;
  } catch {
  }
  return !1;
}
function pf(e, t) {
  try {
    return new URL(e, t).pathname;
  } catch {
    try {
      return new URL(e, typeof location < "u" ? location.href : "http://localhost/").pathname;
    } catch {
      try {
        return (String(t ?? "").replace(/\/$/, "") + "/" + String(e ?? "").replace(/^\//, "")).replace(/\/\\+/g, "/");
      } catch {
        return String(e ?? "");
      }
    }
  }
}
function Hr(e) {
  try {
    const t = String(e ?? "");
    if (!t) return e;
    if (t.includes("/") || /\.(?:md|html?)$/i.test(t)) return t;
    if (ee?.has?.(t)) {
      const n = ee.get(t);
      if (typeof n == "string") return n;
      if (n && typeof n == "object") return n.default || t;
    }
  } catch {
  }
  return e;
}
function El(e, t = 2) {
  try {
    const n = String(e ?? "").split("/").filter(Boolean);
    return n.length ? n.slice(-Math.max(1, Math.min(t, n.length))).join("/") : "";
  } catch {
    return String(e ?? "");
  }
}
function Tl() {
  try {
    if (typeof window > "u") return null;
    let e = null;
    if (Array.isArray(window.__nimbiResolvedIndex) ? e = window.__nimbiResolvedIndex : Array.isArray(window.__nimbiSitemapFinal) ? e = window.__nimbiSitemapFinal : window.__nimbiSitemapJson && Array.isArray(window.__nimbiSitemapJson.entries) && (e = window.__nimbiSitemapJson.entries), !Array.isArray(e)) return null;
    const t = /* @__PURE__ */ new Map();
    for (const n of e) try {
      if (!n || typeof n != "object") continue;
      let r = null;
      if (typeof n.path == "string") r = n.path;
      else if (typeof n.sourcePath == "string") r = n.sourcePath;
      else if (typeof n.loc == "string") try {
        const o = new URL(n.loc, location.href);
        r = String(o.pathname).replace(/^\//, "");
      } catch {
        r = n.loc;
      }
      const i = typeof n.slug == "string" ? n.slug : null;
      if (!r || !i) continue;
      t.has(r) || t.set(r, i);
      const a = String(r).replace(/^.*\//, "");
      a && !t.has(a) && t.set(a, i);
    } catch {
      continue;
    }
    return t;
  } catch {
    return null;
  }
}
function ga(e) {
  if (!e) return null;
  try {
    if (_e?.has?.(e)) return _e.get(e);
  } catch {
  }
  const t = String(e ?? "").replace(/^.*\//, "");
  try {
    if (t && _e?.has?.(t)) return _e.get(t);
  } catch {
  }
  const n = Tl();
  try {
    if (n?.has?.(e)) return n.get(e);
    if (t && n?.has?.(t)) return n.get(t);
  } catch {
  }
  const r = El(e, 2);
  try {
    for (const [i, a] of ee || []) {
      let o = null;
      if (typeof a == "string" ? o = a : a && typeof a == "object" && (o = a.default || ""), !!o && (o === e || o === t || o.endsWith(`/${r}`)))
        return i;
    }
    if (n) {
      for (const [i, a] of n.entries())
        if (i === e || i === t || String(i).endsWith(`/${r}`)) return a;
    }
  } catch {
  }
  return null;
}
function Gr(e, t) {
  try {
    if (!e) return e;
    if (!t) return String(e ?? "");
    const n = String(t ?? "").replace(/^\/+|\/+$/g, "");
    if (!n) return String(e ?? "");
    let r = String(e ?? "");
    r = r.replace(/^\/+/, "");
    const i = n + "/";
    for (; r.startsWith(i); ) r = r.slice(i.length);
    return r === n ? "" : r;
  } catch {
    return String(e ?? "");
  }
}
function gf(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav", n.setAttribute("role", "navigation");
  try {
    n.setAttribute("aria-label", e("navigation"));
  } catch {
  }
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("navigation"), n.appendChild(r);
  const i = document.createElement("ul");
  i.className = "menu-list";
  try {
    const a = document.createDocumentFragment();
    t.forEach((o) => {
      const s = document.createElement("li"), l = document.createElement("a");
      try {
        const c = String(o.path ?? "");
        try {
          l.setAttribute("href", Fe(c));
        } catch {
          c?.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", Ot(c));
        }
      } catch {
        l.setAttribute("href", "#" + o.path);
      }
      if (l.textContent = o.name, s.appendChild(l), o.children?.length) {
        const c = document.createElement("ul");
        o.children.forEach((f) => {
          const d = document.createElement("li"), u = document.createElement("a");
          try {
            const p = String(f.path ?? "");
            try {
              u.setAttribute("href", Fe(p));
            } catch {
              p?.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(p)) : u.setAttribute("href", Ot(p));
            }
          } catch {
            u.setAttribute("href", "#" + f.path);
          }
          u.textContent = f.name, d.appendChild(u), c.appendChild(d);
        }), s.appendChild(c);
      }
      a.appendChild(s);
    }), i.appendChild(a);
  } catch {
    t.forEach((o) => {
      try {
        const s = document.createElement("li"), l = document.createElement("a");
        try {
          const c = String(o.path ?? "");
          try {
            l.setAttribute("href", Fe(c));
          } catch {
            c?.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", Ot(c));
          }
        } catch {
          l.setAttribute("href", "#" + o.path);
        }
        if (l.textContent = o.name, s.appendChild(l), o.children?.length) {
          const c = document.createElement("ul");
          o.children.forEach((f) => {
            const d = document.createElement("li"), u = document.createElement("a");
            try {
              const p = String(f.path ?? "");
              try {
                u.setAttribute("href", Fe(p));
              } catch {
                p?.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(p)) : u.setAttribute("href", Ot(p));
              }
            } catch {
              u.setAttribute("href", "#" + f.path);
            }
            u.textContent = f.name, d.appendChild(u), c.appendChild(d);
          }), s.appendChild(c);
        }
        i.appendChild(s);
      } catch (s) {
        x("[htmlBuilder] createNavTree item failed", s);
      }
    });
  }
  return n.appendChild(i), n;
}
function mf(e, t, n = "") {
  const r = document.createElement("aside");
  r.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("onThisPage"), r.appendChild(i);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const s = {};
    (t || []).forEach((l) => {
      try {
        if (!l || l.level === 1) return;
        const c = Number(l.level) >= 2 ? Number(l.level) : 2, f = document.createElement("li"), d = document.createElement("a"), u = gc(l.text || ""), p = l.id || we(u);
        d.textContent = u;
        try {
          const h = String(n ?? "").replace(/^[\.\/]+/, ""), b = h && _e?.has?.(h) ? _e.get(h) : h;
          b ? d.href = Fe(b, p) : d.href = `#${encodeURIComponent(p)}`;
        } catch (h) {
          x("[htmlBuilder] buildTocElement href normalization failed", h), d.href = `#${encodeURIComponent(p)}`;
        }
        if (f.appendChild(d), c === 2) {
          a.appendChild(f), s[2] = f, Object.keys(s).forEach((h) => {
            Number(h) > 2 && delete s[h];
          });
          return;
        }
        let m = c - 1;
        for (; m > 2 && !s[m]; ) m--;
        m < 2 && (m = 2);
        let g = s[m];
        if (!g) {
          a.appendChild(f), s[c] = f;
          return;
        }
        let y = g.querySelector("ul");
        y || (y = document.createElement("ul"), g.appendChild(y)), y.appendChild(f), s[c] = f;
      } catch (c) {
        x("[htmlBuilder] buildTocElement item failed", c, l);
      }
    });
  } catch (s) {
    x("[htmlBuilder] buildTocElement failed", s);
  }
  const o = document.createElement("nav");
  try {
    o.setAttribute("aria-label", e("onThisPage"));
  } catch {
  }
  return o.appendChild(a), r.appendChild(o), a.querySelectorAll("li").length <= 1 ? null : r;
}
function Rl(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((t) => {
    t.id || (t.id = we(t.textContent || ""));
  });
}
function yf(e, t, n) {
  try {
    const r = e.querySelectorAll?.("img") || [];
    if (r?.length) {
      const i = t?.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
      r.forEach((a) => {
        const o = a.getAttribute("src") || "";
        if (o && !(/^(https?:)?\/\//.test(o) || o.startsWith("/")))
          try {
            a.src = new URL(i + o, n).toString();
            try {
              a.getAttribute("loading") || a.setAttribute("data-want-lazy", "1");
            } catch (s) {
              x("[htmlBuilder] set image loading attribute failed", s);
            }
          } catch (s) {
            x("[htmlBuilder] resolve image src failed", s);
          }
      });
    }
  } catch (r) {
    x("[htmlBuilder] lazyLoadImages failed", r);
  }
}
function co(e, t, n) {
  try {
    t = Hr(t), t = Hr(t);
    const r = t?.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
    let i = null;
    try {
      const s = new URL(n, location.href);
      i = new URL(r || ".", s).toString();
    } catch {
      try {
        i = new URL(r || ".", location.href).toString();
      } catch {
        i = r || "./";
      }
    }
    let a = null;
    try {
      a = e.querySelectorAll("[src],[href],[srcset],[poster]");
    } catch {
      const l = [];
      try {
        l.push(...Array.from(e.getElementsByTagName("img") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("link") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("video") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("use") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.querySelectorAll("[srcset]") || []));
      } catch {
      }
      a = l;
    }
    let o = Array.from(a || []);
    try {
      const s = Array.from(e.getElementsByTagName("use") || []);
      for (const l of s) o.indexOf(l) === -1 && o.push(l);
    } catch {
    }
    for (const s of Array.from(o || [])) try {
      const l = s.tagName ? s.tagName.toLowerCase() : "", c = (f) => {
        try {
          const d = s.getAttribute(f) || "";
          if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/") || d.startsWith("#")) return;
          try {
            s.setAttribute(f, new URL(d, i).toString());
          } catch (u) {
            x("[htmlBuilder] rewrite asset attribute failed", f, d, u);
          }
        } catch (d) {
          x("[htmlBuilder] rewriteAttr failed", d);
        }
      };
      if (s.hasAttribute?.("src") && c("src"), s.hasAttribute?.("href") && l !== "a" && c("href"), s.hasAttribute?.("xlink:href") && c("xlink:href"), s.hasAttribute?.("poster") && c("poster"), s.hasAttribute?.("srcset")) {
        const f = (s.getAttribute("srcset") || "").split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
          const [u, p] = d.split(/\s+/, 2);
          if (!u || /^(https?:)?\/\//i.test(u) || u.startsWith("/")) return d;
          try {
            const m = new URL(u, i).toString();
            return p ? `${m} ${p}` : m;
          } catch {
            return d;
          }
        }).join(", ");
        s.setAttribute("srcset", f);
      }
    } catch (l) {
      x("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
    }
  } catch (r) {
    x("[htmlBuilder] rewriteRelativeAssets failed", r);
  }
}
var uo = "", ma = null, ho = "";
async function Ll(e, t, n, r = {}) {
  try {
    n = Hr(n), r = r || {}, r.canonical = r.canonical !== !1;
    const i = e.querySelectorAll?.("a") || [];
    if (!i.length) return;
    let a, o;
    if (t === uo && ma)
      a = ma, o = ho;
    else {
      try {
        a = new URL(t, location.href), o = Tn(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), o = Tn(a.pathname);
        } catch {
          a = null, o = "/";
        }
      }
      uo = t, ma = a, ho = o;
    }
    const s = /* @__PURE__ */ new Set(), l = [], c = /* @__PURE__ */ new Set(), f = [];
    for (const d of Array.from(i)) try {
      try {
        if (d?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
      } catch {
      }
      const u = d.getAttribute?.("href") || "";
      if (!u) continue;
      if (Ci(u)) {
        try {
          d.setAttribute("rel", "noopener noreferrer nofollow");
        } catch {
        }
        continue;
      }
      try {
        if (u.startsWith("?") || u.indexOf("?") !== -1) try {
          const m = new URL(u, t || location.href), g = m.searchParams.get("page");
          if (g && g.indexOf("/") === -1 && n) {
            const y = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
            if (y) {
              const h = te(y + g), b = r?.canonical ? Fe(h, m.hash ? m.hash.replace(/^#/, "") : null) : Ot(h, m.hash ? m.hash.replace(/^#/, "") : null);
              d.setAttribute("href", b);
              continue;
            }
          }
        } catch {
        }
      } catch {
      }
      if (u.startsWith("/") && !u.endsWith(".md")) continue;
      const p = u.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (p) {
        let m = p[1];
        const g = p[2];
        !m.startsWith("/") && n && (m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + m);
        try {
          const y = new URL(m, t).pathname;
          let h = y.startsWith(o) ? y.slice(o.length) : y;
          h = Gr(h, o), h = te(h), l.push({
            node: d,
            mdPathRaw: m,
            frag: g,
            rel: h
          }), _e?.has?.(h) || s.add(h);
        } catch (y) {
          x("[htmlBuilder] resolve mdPath failed", y);
        }
        continue;
      }
      try {
        let m = u;
        !u.startsWith("/") && n && (u.startsWith("#") ? m = n + u : m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + u);
        const g = new URL(m, t).pathname || "";
        if (g && g.indexOf(o) !== -1) {
          let y = g.startsWith(o) ? g.slice(o.length) : g;
          if (y = Gr(y, o), y = te(y), y = jn(y), y || (y = Qt), !y.endsWith(".md")) {
            const h = ga(y);
            if (h) {
              const b = r?.canonical ? Fe(h, null) : Ot(h);
              d.setAttribute("href", b);
            } else {
              let b = y;
              try {
                /\.[^\/]+$/.test(String(y ?? "")) || (b = String(y ?? "") + ".html");
              } catch {
                b = y;
              }
              c.add(b), f.push({
                node: d,
                rel: b
              });
            }
          }
        }
      } catch (m) {
        x("[htmlBuilder] resolving href to URL failed", m);
      }
    } catch (u) {
      x("[htmlBuilder] processing anchor failed", u);
    }
    if (s.size)
      if (!qr(t) || r?.allowProbe === !1) {
        try {
          x("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(s)) try {
          const u = String(d).match(/([^\/]+)\.md$/), p = u && u[1];
          if (p) {
            const m = we(p);
            if (m) try {
              ht(m, d);
            } catch (g) {
              x("[htmlBuilder] setting fallback slug mapping failed", g);
            }
          }
        } catch {
        }
      } else await Da(Array.from(s), async (d) => {
        try {
          try {
            const p = String(d).match(/([^\/]+)\.md$/), m = p && p[1];
            if (m && ee.has(m)) {
              try {
                const g = ee.get(m);
                if (g) try {
                  const y = typeof g == "string" ? g : g?.default ? g.default : null;
                  y && ht(m, y);
                } catch (y) {
                  x("[htmlBuilder] _storeSlugMapping failed", y);
                }
              } catch (g) {
                x("[htmlBuilder] reading slugToMd failed", g);
              }
              return;
            }
          } catch (p) {
            x("[htmlBuilder] basename slug lookup failed", p);
          }
          const u = await Qe(d, t);
          if (u?.raw) {
            const p = (u.raw || "").match(/^#\s+(.+)$/m);
            if (p && p[1]) {
              const m = we(p[1].trim());
              if (m) try {
                ht(m, d);
              } catch (g) {
                x("[htmlBuilder] setting slug mapping failed", g);
              }
            }
          }
        } catch (u) {
          x("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", u);
        }
      }, 6);
    if (c.size)
      if (!qr(t) || r?.allowProbe === !1) {
        try {
          x("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(c)) try {
          const u = String(d).match(/([^\/]+)\.html$/), p = u && u[1];
          if (p) {
            const m = we(p);
            if (m) try {
              ht(m, d);
            } catch (g) {
              x("[htmlBuilder] setting fallback html slug mapping failed", g);
            }
          }
        } catch {
        }
      } else await Da(Array.from(c), async (d) => {
        try {
          const u = await Qe(d, t);
          if (u && u.raw) try {
            const p = it(), m = p ? p.parseFromString(u.raw, "text/html") : null, g = m ? m.querySelector("title") : null, y = m ? m.querySelector("h1") : null, h = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : y && y.textContent ? y.textContent.trim() : null;
            if (h) {
              const b = we(h);
              if (b) try {
                ht(b, d);
              } catch (_) {
                x("[htmlBuilder] setting html slug mapping failed", _);
              }
            }
          } catch (p) {
            x("[htmlBuilder] parse fetched HTML failed", p);
          }
        } catch (u) {
          x("[htmlBuilder] fetchMarkdown for htmlPending failed", u);
        }
      }, 5);
    for (const d of l) {
      const { node: u, frag: p, rel: m } = d;
      let g = ga(m);
      if (g) {
        const y = r?.canonical ? Fe(g, p) : Ot(g, p);
        u.setAttribute("href", y);
      } else {
        const y = r?.canonical ? Fe(m, p) : Ot(m, p);
        u.setAttribute("href", y);
      }
    }
    for (const d of f) {
      const { node: u, rel: p } = d;
      let m = ga(p);
      if (!m) try {
        const g = String(p ?? "").replace(/^.*\//, "");
        _e?.has?.(g) && (m = _e?.get?.(g));
      } catch (g) {
        x("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
      }
      if (m) {
        const g = r?.canonical ? Fe(m, null) : Ot(m);
        u.setAttribute("href", g);
      } else {
        const g = r?.canonical ? Fe(p, null) : Ot(p);
        u.setAttribute("href", g);
      }
    }
  } catch (i) {
    x("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function _f(e, t, n, r) {
  const i = t.querySelector("h1"), a = i ? (i.textContent || "").trim() : "";
  let o = "";
  try {
    let s = "";
    try {
      e && e.meta && e.meta.title && (s = String(e.meta.title).trim());
    } catch {
    }
    if (!s && a && (s = a), !s) try {
      const l = t.querySelector("h2");
      l && l.textContent && (s = String(l.textContent).trim());
    } catch {
    }
    !s && n && (s = String(n)), s && (o = we(s)), o || (o = Qt);
    try {
      if (n) {
        try {
          ht(o, n);
        } catch (l) {
          x("[htmlBuilder] computeSlug set slug mapping failed", l);
        }
        try {
          const l = te(String(n ?? ""));
          if (_e?.has?.(l)) o = _e.get(l);
          else try {
            for (const [c, f] of ee || []) try {
              const d = typeof f == "string" ? f : f?.default ? f.default : null;
              if (d && te(String(d)) === l) {
                o = c;
                break;
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      }
    } catch (l) {
      x("[htmlBuilder] computeSlug set slug mapping failed", l);
    }
    try {
      let l = r || "";
      if (!l) try {
        const c = mt(typeof location < "u" ? location.href : "");
        c?.anchor && c?.page && String(c.page) === String(o) ? l = c.anchor : l = "";
      } catch {
        l = "";
      }
      try {
        history.replaceState({ page: o }, "", Ot(o, l));
      } catch (c) {
        x("[htmlBuilder] computeSlug history replace failed", c);
      }
    } catch (l) {
      x("[htmlBuilder] computeSlug inner failed", l);
    }
  } catch (s) {
    x("[htmlBuilder] computeSlug failed", s);
  }
  try {
    if (e?.meta?.title && i) {
      const s = String(e.meta.title).trim();
      if (s && s !== a) {
        try {
          o && (i.id = o);
        } catch {
        }
        try {
          if (Array.isArray(e.toc)) for (const l of e.toc) try {
            if (l && Number(l.level) === 1 && String(l.text).trim() === (a || "").trim()) {
              l.id = o;
              break;
            }
          } catch {
          }
        } catch {
        }
      }
    }
  } catch {
  }
  return {
    topH1: i,
    h1Text: a,
    slugKey: o
  };
}
async function bf(e, t, n = {}) {
  if (!e || !e.length) return;
  const r = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || [])) try {
    const s = o.getAttribute("href") || "";
    if (!s) continue;
    let l = te(s).split(/::|#/, 2)[0];
    try {
      const f = l.indexOf("?");
      f !== -1 && (l = l.slice(0, f));
    } catch {
    }
    if (!l || (l.includes(".") || (l = l + ".html"), !/\.html(?:$|[?#])/.test(l) && !l.toLowerCase().endsWith(".html"))) continue;
    const c = l;
    try {
      if (_e?.has?.(c)) continue;
    } catch (f) {
      x("[htmlBuilder] mdToSlug check failed", f);
    }
    try {
      let f = !1;
      for (const d of ee.values()) if (d === c) {
        f = !0;
        break;
      }
      if (f) continue;
    } catch (f) {
      x("[htmlBuilder] slugToMd iteration failed", f);
    }
    r.add(c);
  } catch (s) {
    x("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", s);
  }
  if (!r.size) return;
  if (!qr(t) || n?.allowProbe === !1) {
    try {
      x("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(r)) try {
      const s = String(o).match(/([^\/]+)\.html$/), l = s && s[1];
      if (l) {
        const c = we(l);
        if (c) try {
          ht(c, o);
        } catch (f) {
          x("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", f);
        }
      }
    } catch {
    }
    return;
  }
  const i = async (o) => {
    try {
      const s = await Qe(o, t);
      if (s && s.raw) try {
        const l = it().parseFromString(s.raw, "text/html"), c = l.querySelector("title"), f = l.querySelector("h1"), d = c?.textContent && c.textContent.trim() ? c.textContent.trim() : f?.textContent ? f.textContent.trim() : null;
        if (d) {
          const u = we(d);
          if (u) try {
            ht(u, o);
          } catch (p) {
            x("[htmlBuilder] set slugToMd/mdToSlug failed", p);
          }
        }
      } catch (l) {
        x("[htmlBuilder] parse HTML title failed", l);
      }
    } catch (s) {
      x("[htmlBuilder] fetchAndExtract failed", s);
    }
  }, a = Array.from(r);
  await Da(a, i, Math.max(1, Math.min(Ir(), a.length || 1)));
}
async function wf(e, t, n = {}) {
  if (!e || !e.length) return;
  const r = [], i = /* @__PURE__ */ new Set();
  let a = "";
  try {
    const o = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    a = Tn(o.pathname);
  } catch (o) {
    a = "", x("[htmlBuilder] preMapMdSlugs parse base failed", o);
  }
  for (const o of Array.from(e || [])) try {
    const s = o.getAttribute("href") || "";
    if (!s) continue;
    const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
    if (l) {
      let c = te(l[1]);
      try {
        let f;
        try {
          f = pf(c, t);
        } catch (u) {
          f = c, x("[htmlBuilder] resolve mdPath URL failed", u);
        }
        let d = f && a && f.startsWith(a) ? f.slice(a.length) : String(f ?? "").replace(/^\//, "");
        d = Gr(d, a), r.push({ rel: d }), _e?.has?.(d) || i.add(d);
      } catch (f) {
        x("[htmlBuilder] rewriteAnchors failed", f);
      }
      continue;
    }
  } catch (s) {
    x("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
  }
  if (i.size) {
    if (!qr(t) || n?.allowProbe === !1) {
      try {
        x("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
      for (const o of Array.from(i)) try {
        const s = String(o).match(/([^\/]+)\.md$/), l = s && s[1];
        if (l) {
          const c = we(l);
          if (c) try {
            ht(c, o);
          } catch (f) {
            x("[htmlBuilder] setting fallback preMapMdSlugs mapping failed", f);
          }
        }
      } catch {
      }
      return;
    }
    await Promise.all(Array.from(i).map(async (o) => {
      try {
        const s = String(o).match(/([^\/]+)\.md$/), l = s && s[1];
        if (l && ee.has(l)) {
          try {
            const c = ee.get(l);
            if (c) try {
              const f = typeof c == "string" ? c : c?.default ? c.default : null;
              f && ht(l, f);
            } catch (f) {
              x("[htmlBuilder] _storeSlugMapping failed", f);
            }
          } catch (c) {
            x("[htmlBuilder] preMapMdSlugs slug map access failed", c);
          }
          return;
        }
      } catch (s) {
        x("[htmlBuilder] preMapMdSlugs basename check failed", s);
      }
      try {
        const s = await Qe(o, t);
        if (s && s.raw) {
          const l = (s.raw || "").match(/^#\s+(.+)$/m);
          if (l && l[1]) {
            const c = we(l[1].trim());
            if (c) try {
              ht(c, o);
            } catch (f) {
              x("[htmlBuilder] preMapMdSlugs setting slug mapping failed", f);
            }
          }
        }
      } catch (s) {
        x("[htmlBuilder] preMapMdSlugs fetch failed", s);
      }
    }));
  }
}
function ya(e) {
  try {
    const t = it().parseFromString(e || "", "text/html");
    Rl(t);
    try {
      t.querySelectorAll("img").forEach((i) => {
        try {
          i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
        } catch (a) {
          x("[htmlBuilder] parseHtml set image loading attribute failed", a);
        }
      });
    } catch (i) {
      x("[htmlBuilder] parseHtml query images failed", i);
    }
    t.querySelectorAll("pre code, code[class]").forEach((i) => {
      try {
        const a = i.getAttribute?.("class") || i.className || "", o = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (o && o[1]) {
          const s = (o[1] || "").toLowerCase(), l = ze.size && (ze.get(s) || ze.get(String(s).toLowerCase())) || s;
          try {
            (async () => {
              try {
                await Wr(l);
              } catch (c) {
                x("[htmlBuilder] registerLanguage failed", c);
              }
            })();
          } catch (c) {
            x("[htmlBuilder] schedule registerLanguage failed", c);
          }
        } else try {
          if (Xe && typeof Xe.getLanguage == "function" && Xe.getLanguage("plaintext")) {
            const s = Xe.highlight ? Xe.highlight(i.textContent || "", { language: "plaintext" }) : null;
            if (s && s.value) try {
              if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                const l = document.createRange().createContextualFragment(s.value);
                if (typeof i.replaceChildren == "function") i.replaceChildren(...Array.from(l.childNodes));
                else {
                  for (; i.firstChild; ) i.removeChild(i.firstChild);
                  i.appendChild(l);
                }
              } else i.innerHTML = s.value;
            } catch {
              try {
                i.innerHTML = s.value;
              } catch {
              }
            }
          }
        } catch (s) {
          x("[htmlBuilder] plaintext highlight fallback failed", s);
        }
      } catch (a) {
        x("[htmlBuilder] code element processing failed", a);
      }
    });
    const n = [];
    t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((i) => {
      n.push({
        level: Number(i.tagName.substring(1)),
        text: (i.textContent || "").trim(),
        id: i.id
      });
    });
    const r = {};
    try {
      const i = t.querySelector("title");
      i?.textContent && String(i.textContent).trim() && (r.title = String(i.textContent).trim());
    } catch {
    }
    return {
      html: t.body.innerHTML,
      meta: r,
      toc: n
    };
  } catch (t) {
    return x("[htmlBuilder] parseHtml failed", t), {
      html: e || "",
      meta: {},
      toc: []
    };
  }
}
async function Cl(e) {
  const t = $a ? await $a(e || "", ze) : Wi(e || "", ze), n = new Set(t), r = [];
  for (const i of n) try {
    const a = ze.size && (ze.get(i) || ze.get(String(i).toLowerCase())) || i;
    try {
      r.push(Wr(a));
    } catch (o) {
      x("[htmlBuilder] ensureLanguages push canonical failed", o);
    }
    if (String(i) !== String(a)) try {
      r.push(Wr(i));
    } catch (o) {
      x("[htmlBuilder] ensureLanguages push alias failed", o);
    }
  } catch (a) {
    x("[htmlBuilder] ensureLanguages inner failed", a);
  }
  try {
    await Promise.all(r);
  } catch (i) {
    x("[htmlBuilder] ensureLanguages failed", i);
  }
}
async function kf(e) {
  if (await Cl(e), rr) {
    const t = await rr(e || "");
    return !t || typeof t != "object" ? {
      html: String(e ?? ""),
      meta: {},
      toc: []
    } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return {
    html: String(e ?? ""),
    meta: {},
    toc: []
  };
}
async function xf(e, t, n, r, i) {
  let a = null, o = null;
  if (t.isHtml) try {
    const u = it();
    if (u) {
      const p = u.parseFromString(t.raw || "", "text/html");
      try {
        co(p.body, n, i);
      } catch (m) {
        x("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", m);
      }
      a = ya(p.documentElement?.outerHTML ? p.documentElement.outerHTML : t?.raw || "");
    } else a = ya(t.raw || "");
  } catch {
    a = ya(t.raw || "");
  }
  else {
    const u = t.raw || "", p = 65536;
    if (u && u.length > p && za) {
      try {
        await Cl(u);
      } catch {
      }
      o = document.createElement("article"), o.id = "main", o.className = "nimbi-article content", o.setAttribute("itemscope", ""), o.setAttribute("itemtype", "https://schema.org/Article");
      const m = [];
      let g = {};
      try {
        await za(u, (y, h) => {
          try {
            h && h.meta && (g = Object.assign(g, h.meta));
          } catch {
          }
          try {
            h && Array.isArray(h.toc) && h.toc.length && m.push(...h.toc);
          } catch {
          }
          try {
            Ei(() => {
              try {
                const b = it();
                if (b) {
                  const _ = b.parseFromString(String(y ?? ""), "text/html"), w = Array.from(_.body.childNodes || []);
                  w.length ? o.append(...w) : o.insertAdjacentHTML("beforeend", y || "");
                } else {
                  const _ = document && typeof document.createRange == "function" ? document.createRange() : null;
                  if (_ && typeof _.createContextualFragment == "function") {
                    const w = _.createContextualFragment(String(y ?? ""));
                    o.append(...Array.from(w.childNodes));
                  } else o.insertAdjacentHTML("beforeend", y || "");
                }
              } catch {
                try {
                  o.insertAdjacentHTML("beforeend", y || "");
                } catch {
                }
              }
            });
          } catch {
          }
        }, { chunkSize: p });
      } catch (y) {
        x("[htmlBuilder] streamParseMarkdown failed, falling back", y);
      }
      a = {
        html: o.innerHTML,
        meta: g || {},
        toc: m
      };
    } else a = await kf(t.raw || "");
  }
  let s;
  if (o) s = o;
  else {
    s = document.createElement("article"), s.id = "main", s.className = "nimbi-article content", s.setAttribute("itemscope", ""), s.setAttribute("itemtype", "https://schema.org/Article");
    try {
      const u = it && it();
      if (u) {
        const p = u.parseFromString(String(a.html ?? ""), "text/html"), m = Array.from(p.body.childNodes || []);
        m.length ? s.replaceChildren(...m) : s.innerHTML = a.html;
      } else try {
        const p = document && typeof document.createRange == "function" ? document.createRange() : null;
        if (p && typeof p.createContextualFragment == "function") {
          const m = p.createContextualFragment(String(a.html ?? ""));
          s.replaceChildren(...Array.from(m.childNodes));
        } else s.innerHTML = a.html;
      } catch {
        s.innerHTML = a.html;
      }
    } catch {
      try {
        s.innerHTML = a.html;
      } catch (p) {
        x("[htmlBuilder] set article html failed", p);
      }
    }
  }
  try {
    co(s, n, i);
  } catch (u) {
    x("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    Rl(s);
  } catch (u) {
    x("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((u) => {
      try {
        const p = u.getAttribute?.("class") || u.className || "", m = String(p ?? "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (m) try {
          u.setAttribute?.("class", m);
        } catch (g) {
          u.className = m, x("[htmlBuilder] set element class failed", g);
        }
        else try {
          u.removeAttribute?.("class");
        } catch (g) {
          u.className = "", x("[htmlBuilder] remove element class failed", g);
        }
      } catch (p) {
        x("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (u) {
    x("[htmlBuilder] processing code elements failed", u);
  }
  yf(s, n, i);
  try {
    (s.querySelectorAll?.("img") || []).forEach((u) => {
      try {
        const p = u.parentElement;
        if (!p || p.tagName.toLowerCase() !== "p" || p.childNodes.length !== 1) return;
        const m = document.createElement("figure");
        m.className = "image", p.replaceWith(m), m.appendChild(u);
      } catch {
      }
    });
  } catch (u) {
    x("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll?.("table") || []).forEach((u) => {
      try {
        if (u.classList)
          u.classList.contains("table") || u.classList.add("table");
        else {
          const p = u.getAttribute?.("class") || "", m = String(p ?? "").split(/\s+/).filter(Boolean);
          m.indexOf("table") === -1 && m.push("table");
          try {
            u.setAttribute?.("class", m.join(" "));
          } catch {
            u.className = m.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    x("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: l, h1Text: c, slugKey: f } = _f(a, s, n, r);
  try {
    if (l && (a?.meta?.author || a?.meta?.date) && !l.parentElement?.querySelector?.(".nimbi-article-subtitle")) {
      const u = a.meta.author ? String(a.meta.author).trim() : "", p = a.meta.date ? String(a.meta.date).trim() : "";
      let m = "";
      try {
        const y = new Date(p);
        p && !isNaN(y.getTime()) ? m = y.toLocaleDateString() : m = p;
      } catch {
        m = p;
      }
      const g = [];
      if (u && g.push(u), m && g.push(m), g.length) {
        const y = document.createElement("p"), h = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", b = g.slice(1);
        if (y.className = "nimbi-article-subtitle is-6 has-text-grey-light", h) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-author", _.textContent = h, y.appendChild(_);
        }
        if (b.length) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-meta", _.textContent = b.join(" • "), y.appendChild(_);
        }
        try {
          l.parentElement.insertBefore(y, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", y);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    if (l && l.parentElement && l.parentElement.tagName !== "HEADER") {
      const u = l.parentElement, p = document.createElement("header");
      p.className = "nimbi-article-header", u.insertBefore(p, l), p.appendChild(l);
      const m = p.nextElementSibling;
      if (m && m.classList?.contains("nimbi-article-subtitle")) {
        const g = document.createElement("footer");
        g.className = "nimbi-article-footer", p.insertAdjacentElement("afterend", g), g.appendChild(m);
      }
    }
  } catch {
  }
  try {
    await Lf(s, i, n);
  } catch (u) {
    df("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await Ll(s, i, n);
  }
  const d = mf(e, a.toc, n);
  return {
    article: s,
    parsed: a,
    toc: d,
    topH1: l,
    h1Text: c,
    slugKey: f
  };
}
function Sf(e, t = !1) {
  if (!(!e || !e.querySelectorAll))
    try {
      const n = Array.from(e.querySelectorAll("script"));
      if (!t) {
        for (const r of n) try {
          r.parentNode?.removeChild(r);
        } catch {
        }
        return;
      }
      for (const r of n) try {
        const i = document.createElement("script"), a = /* @__PURE__ */ new Set([
          "src",
          "type",
          "async",
          "defer",
          "crossorigin",
          "integrity",
          "nomodule",
          "referrerpolicy",
          "id",
          "class",
          "nonce"
        ]);
        for (const s of r.attributes) try {
          a.has(s.name) && i.setAttribute(s.name, s.value);
        } catch {
        }
        if (i.hasAttribute("nonce") || Va(i), !r.src) {
          const s = r.textContent || "";
          let l = !1;
          try {
            new Function(s)(), l = !0;
          } catch {
            l = !1;
          }
          if (l) {
            r.parentNode?.removeChild(r);
            try {
              bn("[htmlBuilder] executed inline script via Function");
            } catch {
            }
            try {
              (document.head || document.body || document.documentElement).appendChild(i);
            } catch {
              try {
                try {
                  i.type = "text/javascript";
                } catch {
                }
                (document.head || document.body || document.documentElement).appendChild(i);
              } catch (f) {
                try {
                  x("[htmlBuilder] injected script append failed, skipping", {
                    src: o,
                    err: f
                  });
                } catch {
                }
              }
            }
            continue;
          }
          try {
            i.type = "module";
          } catch {
          }
          i.textContent = s;
        }
        if (r.src) try {
          if (document.querySelector?.(`script[src="${r.src}"]`)) {
            r.parentNode?.removeChild(r);
            continue;
          }
        } catch {
        }
        const o = r.src || "<inline>";
        i.addEventListener("error", (s) => {
          try {
            x("[htmlBuilder] injected script error", {
              src: o,
              ev: s
            });
          } catch {
          }
        }), i.addEventListener("load", () => {
          try {
            bn("[htmlBuilder] injected script loaded", {
              src: o,
              hasNimbi: !!(window && window.nimbiCMS)
            });
          } catch {
          }
        });
        try {
          (document.head || document.body || document.documentElement).appendChild(i);
        } catch {
          try {
            try {
              i.type = "text/javascript";
            } catch {
            }
            (document.head || document.body || document.documentElement).appendChild(i);
          } catch (l) {
            try {
              x("[htmlBuilder] injected script append failed, skipping", {
                src: o,
                err: l
              });
            } catch {
            }
          }
        }
        r.parentNode?.removeChild(r);
        try {
          bn("[htmlBuilder] executed injected script", o);
        } catch {
        }
      } catch (i) {
        x("[htmlBuilder] execute injected script failed", i);
      }
    } catch {
    }
}
function fo(e, t, n) {
  if (e) try {
    typeof e.replaceChildren == "function" ? e.replaceChildren() : e.innerHTML = "";
  } catch {
    try {
      e.innerHTML = "";
    } catch {
    }
  }
  const r = document.createElement("article");
  r.className = "nimbi-article content nimbi-not-found", r.setAttribute("aria-live", "polite");
  const i = document.createElement("h1");
  i.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n?.message ? String(n.message) : "Failed to resolve the requested page.", r.appendChild(i), r.appendChild(a), e && e.appendChild && e.appendChild(r);
  try {
    if (!xe) try {
      const o = document.createElement("p");
      o.textContent = (t && t("goHome") || "Go back to") + " ";
      const s = document.createElement("a");
      try {
        s.href = Fe(vt);
      } catch {
        s.href = Fe(vt || "");
      }
      s.textContent = t && t("home") || "Home", o.appendChild(s), e && e.appendChild && e.appendChild(o);
    } catch {
    }
  } catch {
  }
  try {
    try {
      Ai({
        title: t && t("notFound") || "Not Found",
        description: t && t("notFoundDescription") || ""
      }, xe, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
    } catch {
    }
  } catch {
  }
  try {
    try {
      const o = typeof window < "u" && window.__nimbiNotFoundRedirect ? String(window.__nimbiNotFoundRedirect).trim() : null;
      if (o) try {
        const s = new URL(o, location.origin).toString();
        if ((location.href || "").split("#")[0] !== s) try {
          location.replace(s);
        } catch {
          location.href = s;
        }
      } catch {
      }
    } catch {
    }
  } catch {
  }
}
var vf = {
  intervalMs: 500,
  targetMs: 80,
  hysteresis: 0.25,
  cooldownMs: 600,
  stepUp: 1,
  stepDown: 1
}, Ml = (() => {
  const e = {
    size: 2,
    minSize: 2,
    autoScale: vf,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    e.debugLevel = 0;
  } catch {
  }
  try {
    return new Za(ff, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("anchor worker unavailable");
      }
    };
  }
})();
function Af(e) {
  if (!e) return null;
  try {
    if (_e?.has?.(e)) return _e.get(e);
  } catch {
  }
  try {
    const r = String(e).replace(/^.*\//, "");
    if (r && _e?.has?.(r)) return _e.get(r);
  } catch {
  }
  const t = Tl();
  try {
    if (t?.has?.(e)) return t.get(e);
    const r = String(e).replace(/^.*\//, "");
    if (r && t?.has?.(r)) return t.get(r);
  } catch {
  }
  const n = El(e, 2);
  try {
    for (const [r, i] of ee || []) {
      if (i === e) return r;
      const a = String(e).replace(/^.*\//, "");
      if (i === a) return r;
      if (typeof i == "string") {
        if (i.endsWith(`/${n}`)) return r;
      } else if (i && typeof i == "object") {
        if (i.default === e || i.default === a || i.default && i.default.endsWith(`/${n}`)) return r;
        const o = i.langs && typeof i.langs == "object" ? Object.values(i.langs) : [];
        if (o.includes(e) || o.includes(a)) return r;
        for (const s of o) if (typeof s == "string" && s.endsWith(`/${n}`)) return r;
      }
    }
    if (t) for (const [r, i] of t.entries()) {
      const a = String(e).replace(/^.*\//, "");
      if (r === e || r === a || String(r).endsWith(`/${n}`)) return i;
    }
  } catch {
  }
  return null;
}
function Ef(e, t, n) {
  n = Hr(n);
  const r = /* @__PURE__ */ new Set();
  let i = "/";
  try {
    const o = new URL(t, location.href);
    i = Tn(o.pathname);
  } catch {
  }
  try {
    const o = Array.from(e?.querySelectorAll?.("a") || []);
    for (const s of o) try {
      try {
        if (s?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
      } catch {
      }
      const l = s.getAttribute?.("href") || "";
      if (!l || Ci(l) || l.startsWith("/") && !l.endsWith(".md")) continue;
      const c = l.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let p = c[1];
        !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
        const m = new URL(p, t).pathname;
        let g = m.startsWith(i) ? m.slice(i.length) : m;
        g = te(Gr(g, i)), r.add(g), r.add(String(g).replace(/^.*\//, ""));
        continue;
      }
      let f = l;
      !l.startsWith("/") && n && (l.startsWith("#") ? f = n + l : f = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + l);
      const d = new URL(f, t).pathname || "";
      if (!d || d.indexOf(i) === -1) continue;
      let u = d.startsWith(i) ? d.slice(i.length) : d;
      u = te(Gr(u, i)), u = jn(u), u || (u = Qt), r.add(u), r.add(String(u).replace(/^.*\//, "")), /\.[^/]+$/.test(String(u ?? "")) || (r.add(u + ".html"), r.add((u + ".html").replace(/^.*\//, "")));
    } catch {
    }
  } catch {
  }
  const a = {};
  for (const o of r) {
    const s = Af(o);
    s && (a[o] = s);
  }
  return {
    allowProbe: qr(t),
    homeSlug: Qt,
    pathToSlug: a
  };
}
function Tf() {
  return Ml.workers?.[0]?.worker?._underlying ?? null;
}
function Rf(e) {
  return Ml.postMessage(e, void 0, {
    awaitResponse: !0,
    timeout: 2e3
  }).then((t) => {
    if (t && typeof t == "object" && t.error) throw new Error(t.error);
    return t;
  }).catch((t) => {
    throw (t?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : t;
  });
}
async function Lf(e, t, n) {
  if (!Tf()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  n = Hr(n);
  const r = String(e.innerHTML), i = Ef(e, t, n), a = await Rf({
    type: "rewriteAnchors",
    html: r,
    contentBase: t,
    pagePath: n,
    snapshot: i
  }), o = a && typeof a == "object" && typeof a.html == "string" ? a.html : a;
  if (a && typeof a == "object" && Array.isArray(a.mappings)) for (const l of a.mappings) try {
    l && l.slug && l.path && ht(l.slug, l.path);
  } catch (c) {
    x("[htmlBuilder] storing worker anchor mapping failed", c);
  }
  let s = !1;
  if (typeof o == "string") try {
    const l = String(o ?? "").includes(".md");
    String(r ?? "").includes(".md") && l && (s = !0);
    const c = it && it();
    if (c) {
      const f = c.parseFromString(String(o ?? ""), "text/html"), d = Array.from(f.body.childNodes || []);
      d.length ? e.replaceChildren(...d) : e.innerHTML = o;
    } else try {
      const f = document && typeof document.createRange == "function" ? document.createRange() : null;
      if (f && typeof f.createContextualFragment == "function") {
        const d = f.createContextualFragment(String(o ?? ""));
        e.replaceChildren(...Array.from(d.childNodes));
      } else e.innerHTML = o;
    } catch {
      e.innerHTML = o;
    }
  } catch (l) {
    x("[htmlBuilder] applying rewritten anchors failed", l), s = !0;
  }
  if (s) try {
    await Ll(e, t, n);
  } catch (l) {
    x("[htmlBuilder] main-thread fallback after worker rewrite failed", l);
  }
}
function Cf(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target?.closest?.("a") || null;
      if (!n) return;
      const r = n.getAttribute?.("href") || "";
      try {
        const i = mt(r), a = i?.page ?? null, o = i?.anchor ?? null;
        if (!a && !o) return;
        t.preventDefault();
        let s = null;
        try {
          history?.state?.page && (s = history.state.page);
        } catch (l) {
          s = null, x("[htmlBuilder] access history.state failed", l);
        }
        try {
          s || (s = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          x("[htmlBuilder] parse current location failed", l);
        }
        if (!a && o || a && s && String(a) === String(s)) {
          try {
            if (!a && o) try {
              history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (o ? "#" + encodeURIComponent(o) : ""));
            } catch (l) {
              x("[htmlBuilder] history.replaceState failed", l);
            }
            else try {
              history.replaceState({ page: s || a }, "", Ot(s || a, o));
            } catch (l) {
              x("[htmlBuilder] history.replaceState failed", l);
            }
          } catch (l) {
            x("[htmlBuilder] update history for anchor failed", l);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (l) {
            x("[htmlBuilder] stopPropagation failed", l);
          }
          try {
            Ba(o);
          } catch (l) {
            x("[htmlBuilder] scrollToAnchorOrTop failed", l);
          }
          return;
        }
        history.pushState({ page: a }, "", Ot(a, o));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function") try {
            const l = window.renderByQuery();
            l && typeof l.catch == "function" && l.catch(() => {
            });
          } catch (l) {
            x("[htmlBuilder] window.renderByQuery failed", l);
          }
          else if (typeof window < "u") try {
            window.dispatchEvent(new PopStateEvent("popstate"));
          } catch (l) {
            x("[htmlBuilder] dispatch popstate failed", l);
          }
          else try {
            const l = renderByQuery();
            l && typeof l.catch == "function" && l.catch(() => {
            });
          } catch (l) {
            x("[htmlBuilder] renderByQuery failed", l);
          }
        } catch (l) {
          x("[htmlBuilder] SPA navigation invocation failed", l);
        }
      } catch (i) {
        x("[htmlBuilder] non-URL href in attachTocClickHandler", i);
      }
    });
  } catch (t) {
    x("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function Ba(e) {
  const t = document.querySelector(".nimbi-cms") || null;
  if (e) {
    const n = document.getElementById(e);
    if (n) try {
      const r = () => {
        try {
          if (t && t.scrollTo && t.contains(n)) {
            const i = n.getBoundingClientRect().top - t.getBoundingClientRect().top + t.scrollTop;
            t.scrollTo({
              top: i,
              behavior: "smooth"
            });
          } else try {
            n.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              x("[htmlBuilder] scrollIntoView failed", a);
            }
          }
        } catch {
          try {
            n.scrollIntoView();
          } catch (a) {
            x("[htmlBuilder] final scroll fallback failed", a);
          }
        }
      };
      try {
        requestAnimationFrame(() => setTimeout(r, 50));
      } catch (i) {
        x("[htmlBuilder] scheduling scroll failed", i), setTimeout(r, 50);
      }
    } catch (r) {
      try {
        n.scrollIntoView();
      } catch (i) {
        x("[htmlBuilder] final scroll fallback failed", i);
      }
      x("[htmlBuilder] doScroll failed", r);
    }
  } else try {
    t && t.scrollTo ? t.scrollTo({
      top: 0,
      behavior: "smooth"
    }) : window.scrollTo(0, 0);
  } catch (n) {
    try {
      window.scrollTo(0, 0);
    } catch (r) {
      x("[htmlBuilder] window.scrollTo failed", r);
    }
    x("[htmlBuilder] scroll to top failed", n);
  }
}
function Mf(e, t, { mountOverlay: n = null, container: r = null, mountEl: i = null, navWrap: a = null, t: o = null } = {}) {
  try {
    const s = typeof o == "function" ? o : () => {
    }, l = r || document.querySelector(".nimbi-cms"), c = i || document.querySelector(".nimbi-mount"), f = n || document.querySelector(".nimbi-overlay"), d = a || document.querySelector(".nimbi-nav-wrap");
    let u = document.querySelector(".nimbi-scroll-top");
    if (!u) {
      u = document.createElement("button"), u.className = "nimbi-scroll-top button is-primary is-rounded is-small", u.setAttribute("aria-label", s("scrollToTop") || "Scroll to top"), u.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        f && f.appendChild ? f.appendChild(u) : l && l.appendChild ? l.appendChild(u) : c && c.appendChild ? c.appendChild(u) : document.body.appendChild(u);
      } catch {
        try {
          document.body.appendChild(u);
        } catch (g) {
          x("[htmlBuilder] append scroll top button failed", g);
        }
      }
      try {
        try {
          Co(u);
        } catch {
        }
      } catch (m) {
        x("[htmlBuilder] set scroll-top button theme registration failed", m);
      }
      u.addEventListener("click", () => {
        try {
          r && r.scrollTo ? r.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          }) : i && i.scrollTo ? i.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          }) : window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        } catch {
          try {
            r && (r.scrollTop = 0);
          } catch (g) {
            x("[htmlBuilder] fallback container scrollTop failed", g);
          }
          try {
            i && (i.scrollTop = 0);
          } catch (g) {
            x("[htmlBuilder] fallback mountEl scrollTop failed", g);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (g) {
            x("[htmlBuilder] fallback document scrollTop failed", g);
          }
        }
      });
    }
    const p = d?.querySelector?.(".menu-label") || null;
    if (t) {
      if (!u._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const m = globalThis.IntersectionObserver, g = new m((y) => {
            for (const h of y) h.target instanceof Element && (h.isIntersecting ? (u.classList.remove("show"), p && p.classList.remove("show")) : (u.classList.add("show"), p && p.classList.add("show")));
          }, {
            root: r instanceof Element ? r : i instanceof Element ? i : null,
            threshold: 0
          });
          u._nimbiObserver = g;
        } else u._nimbiObserver = null;
      try {
        u._nimbiObserver && typeof u._nimbiObserver.disconnect == "function" && u._nimbiObserver.disconnect();
      } catch (m) {
        x("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        u._nimbiObserver && typeof u._nimbiObserver.observe == "function" && u._nimbiObserver.observe(t);
      } catch (m) {
        x("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const g = l instanceof Element ? l.getBoundingClientRect() : {
              top: 0,
              bottom: window.innerHeight
            }, y = t.getBoundingClientRect();
            y.bottom < g.top || y.top > g.bottom ? (u.classList.add("show"), p && p.classList.add("show")) : (u.classList.remove("show"), p && p.classList.remove("show"));
          } catch (g) {
            x("[htmlBuilder] checkIntersect failed", g);
          }
        };
        m(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(m, 100);
      } catch (m) {
        x("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      u.classList.remove("show"), p && p.classList.remove("show");
      const m = r instanceof Element ? r : i instanceof Element ? i : window, g = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (u.classList.add("show"), p && p.classList.add("show")) : (u.classList.remove("show"), p && p.classList.remove("show"));
        } catch (y) {
          x("[htmlBuilder] onScroll handler failed", y);
        }
      };
      Mi(() => m.addEventListener("scroll", uf(g))), g();
    }
  } catch (s) {
    x("[htmlBuilder] ensureScrollTopButton failed", s);
  }
}
var xr = null, po = [], Pl = 1e3, Pf = 4;
function go(e) {
  let t = String(e ?? "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return t = t.replace(/(?:-?)(?:md|html)$/g, ""), t = t.replace(/-+/g, "-"), t = t.replace(/^-|-$/g, ""), t.length > 80 && (t = t.slice(0, 80).replace(/-+$/g, "")), t;
}
function _n(e) {
  return String(e ?? "").replace(/^[./]+/, "");
}
function Nf(e) {
  return String(e ?? "").replace(/\/+$/, "");
}
function zr(e) {
  return Nf(e) + "/";
}
function If(e, t) {
  if (!e || typeof e != "string") return !1;
  if (e.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(e)) {
    if (t && typeof t == "string") try {
      const n = new URL(e), r = new URL(t);
      if (n.origin === r.origin) return !n.pathname.startsWith(r.pathname);
    } catch {
    }
    return !0;
  }
  return !1;
}
function Nl(e) {
  const t = typeof location < "u" && location.origin ? location.origin : "http://localhost", n = String(e ?? "");
  return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? zr(n) : n.startsWith("/") ? t + zr(n) : t + "/" + zr(n) : t + "/";
}
async function Of(e, t) {
  const n = Nl(t), r = new URL(String(e ?? "").replace(/^\//, ""), n).toString(), i = await fetch(r);
  return !i || !i.ok ? null : await i.text();
}
async function zf(e, t, n = Pf) {
  const r = Array.isArray(e) ? e.slice() : [], i = Math.max(1, Number(n) || 1), a = [];
  for (let o = 0; o < Math.min(i, r.length); o++) a.push((async () => {
    for (; r.length; ) {
      const s = r.shift();
      s != null && await t(s);
    }
  })());
  await Promise.all(a);
}
async function $f(e, t = Pl, n = void 0) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = [""];
  if (Array.isArray(n)) for (const l of n) try {
    const c = _n(l);
    c && a.push(c);
  } catch {
  }
  const o = Nl(e), s = zr(new URL(o).pathname);
  for (; a.length && a.length <= t; ) {
    const l = a.shift();
    if (l == null || r.has(l)) continue;
    r.add(l);
    const c = new URL(String(l ?? ""), o).toString();
    let f = null;
    try {
      const g = await fetch(c);
      if (!g || !g.ok) continue;
      f = await g.text();
    } catch {
      continue;
    }
    if (!f) continue;
    const d = [], u = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, p = /(?:^|[^!])\[[^\]]+\]\(([^)]+)\)/g;
    let m = null;
    for (; m = u.exec(f); ) try {
      m?.[1] && d.push(m[1]);
    } catch {
    }
    for (; m = p.exec(f); ) try {
      m?.[1] && d.push(m[1]);
    } catch {
    }
    for (const g of d) {
      if (!g || If(g, o) || g.startsWith("..") || g.includes("/../")) continue;
      if (g.endsWith("/")) {
        try {
          const _ = new URL(g, c);
          let w = _.pathname.startsWith(s) ? _.pathname.slice(s.length) : _.pathname.replace(/^\//, "");
          w = zr(_n(w)), r.has(w) || a.push(w);
        } catch {
        }
        continue;
      }
      if (/\.(md|html?)($|[?#])/i.test(g)) {
        try {
          const _ = new URL(g, c);
          let w = _.pathname.startsWith(s) ? _.pathname.slice(s.length) : _.pathname.replace(/^\//, "");
          w = _n(w).split(/[?#]/)[0], w && (i.add(w), r.has(w) || a.push(w));
        } catch {
        }
        try {
          const _ = new URL(g, o);
          let w = _.pathname.startsWith(s) ? _.pathname.slice(s.length) : _.pathname.replace(/^\//, "");
          w = _n(w).split(/[?#]/)[0], w && !i.has(w) && (i.add(w), r.has(w) || a.push(w));
        } catch {
        }
        continue;
      }
      let y = g.split(/[?#]/)[0].replace(/\/+$/, ""), h = null;
      try {
        const _ = new URL(g, o);
        h = _.pathname.startsWith(s) ? _.pathname.slice(s.length) : _.pathname.replace(/^\//, "");
      } catch {
      }
      try {
        const _ = new URL(g, c);
        y = _.pathname.startsWith(s) ? _.pathname.slice(s.length) : _.pathname.replace(/^\//, "");
      } catch {
      }
      y = _n(y).split(/[?#]/)[0].replace(/\/+$/, ""), h && (h = _n(h).split(/[?#]/)[0].replace(/\/+$/, ""));
      const b = String(y).split("/").pop() || "";
      if (!/\.[^./]+$/i.test(b)) {
        if (y) {
          const _ = [
            `${y}.md`,
            `${y}.html`,
            `${y}/README.md`,
            `${y}/README.html`
          ];
          for (const w of _)
            i.add(w), r.has(w) || a.push(w);
        }
        if (h && h !== y) {
          const _ = [
            `${h}.md`,
            `${h}.html`,
            `${h}/README.md`,
            `${h}/README.html`
          ];
          for (const w of _) i.has(w) || (i.add(w), r.has(w) || a.push(w));
        }
      }
    }
  }
  return Array.from(i);
}
function Df(e, t) {
  const n = String(e ?? "");
  if (t) return {
    title: ((n.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || (n.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim(),
    excerpt: ((n.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim()
  };
  const r = ((n.match(/^#\s+(.+)$/m) || [])[1] || "").trim(), i = n.split(/\r?\n\s*\r?\n/);
  let a = "";
  for (let o = 1; o < i.length; o++) {
    const s = i[o].trim();
    if (s && !/^#/.test(s)) {
      a = s.replace(/\r?\n/g, " ");
      break;
    }
  }
  return {
    title: r,
    excerpt: a
  };
}
async function Bf(e, t = 1, n = void 0, r = void 0) {
  if (xr) return xr;
  xr = (async () => {
    const i = Array.isArray(n) ? new Set(n.map((c) => _n(c))) : /* @__PURE__ */ new Set(), a = Array.isArray(r) ? r.map((c) => _n(c)).filter(Boolean) : [], o = await $f(e, Pl, a), s = Array.from(new Set(o.concat(a))).filter((c) => /\.(md|html?)$/i.test(c)).filter((c) => !Array.from(i).some((f) => f && (c === f || c.startsWith(f + "/")))), l = [];
    return await zf(s, async (c) => {
      const f = await Of(c, e);
      if (!f) return;
      const d = /\.html?$/i.test(c), { title: u, excerpt: p } = Df(f, d), m = go(u || c);
      let g = null, y = null;
      try {
        if (!d) {
          const { data: h } = er(f), b = h.dateModified || h.date || h.lastmod;
          if (b) {
            const w = new Date(b);
            isNaN(w.getTime()) || (g = w.toISOString().split("T")[0]);
          }
          const _ = h.image || h.og_image || h.cover || h.featured_image;
          _ && String(_).trim() && (y = String(_).trim());
        }
      } catch {
      }
      if (l.push({
        slug: m,
        title: u,
        excerpt: p,
        path: c,
        lastmod: g,
        image: y
      }), Number(t) >= 2) {
        const h = d ? /<h2[^>]*>([\s\S]*?)<\/h2>/gi : /^##\s+(.+)$/gm;
        let b = null;
        for (; b = h.exec(f); ) {
          const _ = String(b[1] ?? "").replace(/<[^>]+>/g, "").trim();
          _ && l.push({
            slug: `${m}::${go(_)}`,
            title: _,
            excerpt: "",
            path: c,
            parentTitle: u || "",
            lastmod: g
          });
        }
      }
    }), po = l, po;
  })();
  try {
    return await xr;
  } finally {
    xr = null;
  }
}
async function Il() {
  return Uc;
}
async function Uf(e, t = 1, n = void 0, r = void 0) {
  return (await Il()).buildSearchIndexWorker(e, t, n, r);
}
async function jf(e = {}) {
  return (await Il()).awaitSearchIndex(e);
}
var _a = /* @__PURE__ */ Fi({
  attachSitemapDownloadUI: () => qa,
  clearSitemapWriteTimer: () => Ol,
  exposeSitemapGlobals: () => Ha,
  generateAtomXml: () => Wa,
  generateLlmsTxt: () => Fa,
  generateRobotsTxt: () => qf,
  generateRssXml: () => ja,
  generateSitemapJson: () => Yi,
  generateSitemapXml: () => Ua,
  handleSitemapRequest: () => Vr
});
function Xi() {
  try {
    if (typeof location?.pathname == "string") return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function Ze(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function mo(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((t) => t ? t.charAt(0).toUpperCase() + t.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function Wf(e) {
  try {
    if (!e || typeof e != "string") return null;
    const t = e.trim();
    if (!t) return null;
    if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return t;
    if (t.startsWith("//")) return "https:" + t;
    try {
      if (typeof location < "u" && location.origin) return new URL(t, location.origin).href;
    } catch {
    }
    return t;
  } catch {
    return null;
  }
}
function Ff(e, t) {
  try {
    const n = t?.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = {
      loc: e + "?page=" + encodeURIComponent(n),
      slug: n
    };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = te(String(t.path))), t.image && (r.image = String(t.image)), r;
  } catch {
    return null;
  }
}
async function Yi(e = {}) {
  const { includeAllMarkdown: t = !0, index: n, homePage: r, navigationPage: i, notFoundPage: a } = e || {}, o = Xi().split("?")[0];
  let s = Array.isArray(se) && se.length ? se : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(se) && se.length) {
    const y = /* @__PURE__ */ new Map();
    try {
      for (const h of n) try {
        h?.slug && y.set(String(h.slug), h);
      } catch {
      }
      for (const h of se) try {
        h?.slug && y.set(String(h.slug), h);
      } catch {
      }
    } catch {
    }
    s = Array.from(y.values());
  }
  const l = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && l.add(te(String(a)));
  } catch {
  }
  try {
    typeof i == "string" && i.trim() && l.add(te(String(i)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const y = te(String(a));
      try {
        if (typeof _e?.has == "function" && _e.has(y)) try {
          c.add(_e.get(y));
        } catch {
        }
        else try {
          const h = await Qe(y, e?.contentBase ? e.contentBase : void 0);
          if (h?.raw) try {
            let b = null;
            if (h.isHtml) try {
              const _ = it();
              if (_) {
                const w = _.parseFromString(h.raw, "text/html"), A = w.querySelector("h1") || w.querySelector("title");
                A && A.textContent && (b = A.textContent.trim());
              } else {
                const w = (h.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                w && (b = (w[1] || w[2] || "").trim());
              }
            } catch {
            }
            else {
              const _ = (h.raw || "").match(/^#\s+(.+)$/m);
              _ && _[1] && (b = _[1].trim());
            }
            b && c.add(we(b));
          } catch {
          }
        } catch {
        }
      } catch {
      }
    }
  } catch {
  }
  const f = /* @__PURE__ */ new Set(), d = [], u = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = (y) => {
    try {
      if (!y || typeof y != "string") return !1;
      const h = te(String(y));
      try {
        if (typeof Ye?.has == "function" && Ye.has(h)) return !0;
      } catch {
      }
      try {
        if (typeof _e?.has == "function" && _e.has(h)) return !0;
      } catch {
      }
      try {
        if (p?.has(h)) return !0;
      } catch {
      }
      try {
        if (typeof _e?.keys == "function" && _e.size) for (const b of _e.keys()) try {
          if (te(String(b)) === h) return !0;
        } catch {
        }
        else for (const b of ee.values()) try {
          if (!b) continue;
          if (typeof b == "string") {
            if (te(String(b)) === h) return !0;
          } else if (b && typeof b == "object") {
            if (b.default && te(String(b.default)) === h) return !0;
            const _ = b.langs || {};
            for (const w of Object.keys(_ || {})) try {
              if (_[w] && te(String(_[w])) === h) return !0;
            } catch {
            }
          }
        } catch {
        }
      } catch {
      }
    } catch {
    }
    return !1;
  };
  if (Array.isArray(s) && s.length) {
    let y = 0;
    for (const h of s) {
      try {
        y++, await wn(y, 64);
      } catch {
      }
      try {
        if (!h?.slug) continue;
        const b = String(h.slug), _ = String(b).split("::")[0];
        if (c.has(_)) continue;
        const w = h.path ? te(String(h.path)) : null;
        if (w && l.has(w)) continue;
        const A = h.title ? String(h.title) : h.parentTitle ? String(h.parentTitle) : void 0;
        u.set(b, {
          title: A || void 0,
          excerpt: h.excerpt ? String(h.excerpt) : void 0,
          path: w,
          source: "index",
          image: h.image ? String(h.image) : void 0
        }), w && p.set(w, {
          title: A || void 0,
          excerpt: h.excerpt ? String(h.excerpt) : void 0,
          slug: b,
          image: h.image ? String(h.image) : void 0
        });
        const z = Ff(o, h);
        if (!z || !z.slug || f.has(z.slug)) continue;
        if (f.add(z.slug), u.has(z.slug)) {
          const j = u.get(z.slug);
          j?.title && (z.title = j.title, z._titleSource = "index"), j?.excerpt && (z.excerpt = j.excerpt), j?.image && (z.image = j.image);
        }
        d.push(z);
      } catch {
        continue;
      }
    }
  }
  if (t) try {
    let y = 0;
    for (const [h, b] of ee.entries()) {
      try {
        y++, await wn(y, 128);
      } catch {
      }
      try {
        if (!h) continue;
        const _ = String(h).split("::")[0];
        if (f.has(h) || c.has(_)) continue;
        let w = null;
        if (typeof b == "string" ? w = te(String(b)) : b && typeof b == "object" && (w = te(String(b.default ?? ""))), w && l.has(w)) continue;
        const A = {
          loc: o + "?page=" + encodeURIComponent(h),
          slug: h
        };
        if (u.has(h)) {
          const z = u.get(h);
          z?.title && (A.title = z.title, A._titleSource = "index"), z?.excerpt && (A.excerpt = z.excerpt), z?.image && (A.image = z.image);
        } else if (w) {
          const z = p.get(w);
          z?.title && (A.title = z.title, A._titleSource = "path", !A.excerpt && z?.excerpt && (A.excerpt = z.excerpt)), !A.image && z?.image && (A.image = z.image);
        }
        if (f.add(h), typeof h == "string") {
          const z = h.indexOf("/") !== -1 || /\.(md|html?)$/i.test(h), j = A.title && typeof A.title == "string" && (A.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(A.title));
          (!A.title || j || z) && (A.title = mo(h), A._titleSource = "humanize");
        }
        d.push(A);
      } catch {
      }
    }
    try {
      if (r && typeof r == "string") {
        const h = te(String(r));
        let b = null;
        try {
          typeof _e?.has == "function" && _e.has(h) && (b = _e.get(h));
        } catch {
        }
        b || (b = h);
        const _ = String(b).split("::")[0];
        if (!f.has(b) && !l.has(h) && !c.has(_)) {
          const w = {
            loc: o + "?page=" + encodeURIComponent(b),
            slug: b
          };
          if (u.has(b)) {
            const A = u.get(b);
            A?.title && (w.title = A.title, w._titleSource = "index"), A?.excerpt && (w.excerpt = A.excerpt), A?.image && (w.image = A.image);
          }
          f.add(b), d.push(w);
        }
      }
    } catch {
    }
  } catch {
  }
  try {
    const y = /* @__PURE__ */ new Set(), h = new Set(d.map((z) => String(z?.slug ?? ""))), b = /* @__PURE__ */ new Set();
    for (const z of d) try {
      z?.sourcePath && b.add(String(z.sourcePath));
    } catch {
    }
    const _ = 30;
    let w = 0, A = 0;
    for (const z of b) {
      try {
        A++, await wn(A, 8);
      } catch {
      }
      if (w >= _) break;
      try {
        if (!z || typeof z != "string" || !m(z)) continue;
        w += 1;
        const j = await Qe(z, e?.contentBase ? e.contentBase : void 0);
        if (!j || !j.raw || j && typeof j.status == "number" && j.status === 404) continue;
        const W = (function(C) {
          try {
            return String(C ?? "");
          } catch {
            return "";
          }
        })(j.raw), Q = [], ae = /\[[^\]]+\]\(([^)]+)\)/g;
        let ue;
        for (; ue = ae.exec(W); ) try {
          ue?.[1] && Q.push(ue[1]);
        } catch {
        }
        const ne = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; ue = ne.exec(W); ) try {
          ue?.[1] && Q.push(ue[1]);
        } catch {
        }
        for (const C of Q) try {
          if (!C) continue;
          if (C.indexOf("?") !== -1 || C.indexOf("=") !== -1) try {
            const L = new URL(C, o).searchParams.get("page");
            if (L) {
              const E = String(L);
              !h.has(E) && !y.has(E) && (y.add(E), d.push({
                loc: o + "?page=" + encodeURIComponent(E),
                slug: E
              }));
              continue;
            }
          } catch {
          }
          let N = String(C).split(/[?#]/)[0];
          if (N = N.replace(/^\.\//, "").replace(/^\//, ""), !N || !/\.(md|html?)$/i.test(N)) continue;
          try {
            const L = te(N);
            if (_e?.has?.(L)) {
              const E = _e?.get?.(L), I = String(E).split("::")[0];
              E && !h.has(E) && !y.has(E) && !c.has(I) && !l.has(L) && (y.add(E), d.push({
                loc: o + "?page=" + encodeURIComponent(E),
                slug: E,
                sourcePath: L
              }));
              continue;
            }
            try {
              if (!m(L)) continue;
              const E = await Qe(L, e?.contentBase ? e.contentBase : void 0);
              if (E && typeof E.status == "number" && E.status === 404) continue;
              if (E && E.raw) {
                const I = (E.raw || "").match(/^#\s+(.+)$/m), Z = I && I[1] ? I[1].trim() : "", $ = we(Z || L), re = String($).split("::")[0];
                $ && !h.has($) && !y.has($) && !c.has(re) && (y.add($), d.push({
                  loc: o + "?page=" + encodeURIComponent($),
                  slug: $,
                  sourcePath: L,
                  title: Z || void 0
                }));
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch {
      }
    }
  } catch {
  }
  try {
    const y = /* @__PURE__ */ new Map();
    let h = 0;
    for (const _ of d) {
      try {
        h++, await wn(h, 128);
      } catch {
      }
      try {
        if (!_ || !_.slug) continue;
        y.set(String(_.slug), _);
      } catch {
      }
    }
    const b = /* @__PURE__ */ new Set();
    for (const _ of d) try {
      if (!_ || !_.slug) continue;
      const w = String(_.slug), A = w.split("::")[0];
      if (!A) continue;
      w !== A && !y.has(A) && b.add(A);
    } catch {
    }
    for (const _ of b) try {
      let w = null;
      if (u.has(_)) {
        const A = u.get(_);
        w = {
          loc: o + "?page=" + encodeURIComponent(_),
          slug: _
        }, A?.title && (w.title = A.title, w._titleSource = "index"), A?.excerpt && (w.excerpt = A.excerpt), A?.path && (w.sourcePath = A.path), A?.lastmod && (w.lastmod = A.lastmod), A?.image && (w.image = A.image);
      } else if (p && ee?.has?.(_)) {
        const A = ee?.get?.(_);
        let z = null;
        if (typeof A == "string" ? z = te(String(A)) : A && typeof A == "object" && (z = te(String(A.default ?? ""))), w = {
          loc: o + "?page=" + encodeURIComponent(_),
          slug: _
        }, z && p.has(z)) {
          const j = p.get(z);
          j?.title && (w.title = j.title, w._titleSource = "path"), j?.excerpt && (w.excerpt = j.excerpt), w.sourcePath = z, j?.lastmod && (w.lastmod = j.lastmod), j?.image && (w.image = j.image);
        }
      }
      w || (w = {
        loc: o + "?page=" + encodeURIComponent(_),
        slug: _,
        title: mo(_)
      }, w._titleSource = "humanize"), y.has(_) || (d.push(w), y.set(_, w));
    } catch {
    }
  } catch {
  }
  const g = [];
  try {
    const y = /* @__PURE__ */ new Set();
    let h = 0;
    for (const b of d) {
      try {
        h++, await wn(h, 128);
      } catch {
      }
      try {
        if (!b || !b.slug) continue;
        const _ = String(b.slug), w = String(_).split("::")[0];
        if (c.has(w) || _.indexOf("::") !== -1 || y.has(_)) continue;
        y.add(_), g.push(b);
      } catch {
      }
    }
  } catch {
  }
  try {
    try {
      de(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(g.map((y) => ({
        slug: y.slug,
        title: y.title,
        titleSource: y._titleSource || null
      })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let h = 0;
    const b = g.length, _ = Array.from({ length: Math.min(4, b) }).map(async () => {
      for (; ; ) {
        const w = h++;
        if (w >= b) break;
        const A = g[w];
        try {
          if (!A || !A.slug) continue;
          const z = String(A.slug).split("::")[0];
          if (c.has(z) || A._titleSource === "index") continue;
          let j = null;
          try {
            if (ee?.has?.(A.slug)) {
              const W = ee?.get?.(A.slug);
              typeof W == "string" ? j = te(String(W)) : W && typeof W == "object" && (j = te(String(W.default ?? "")));
            }
            !j && A.sourcePath && (j = A.sourcePath);
          } catch {
            continue;
          }
          if (!j || l.has(j) || !m(j)) continue;
          try {
            const W = await Qe(j, e?.contentBase ? e.contentBase : void 0);
            if (!W || !W.raw || W && typeof W.status == "number" && W.status === 404) continue;
            if (W && W.raw) {
              const Q = (W.raw || "").match(/^#\s+(.+)$/m), ae = Q && Q[1] ? Q[1].trim() : "";
              ae && (A.title = ae, A._titleSource = "fetched");
            }
          } catch (W) {
            de("[runtimeSitemap] fetch title failed for", j, W);
          }
        } catch (z) {
          de("[runtimeSitemap] worker loop failure", z);
        }
      }
    });
    await Promise.all(_);
  } catch (y) {
    de("[runtimeSitemap] title enrichment failed", y);
  }
  return {
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    entries: g
  };
}
function Ua(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
  for (const r of t) try {
    if (n += `  <url>
`, n += `    <loc>${Ze(String(r.loc ?? ""))}</loc>
`, r.lastmod && (n += `    <lastmod>${Ze(String(r.lastmod))}</lastmod>
`), r.changefreq && (n += `    <changefreq>${Ze(String(r.changefreq))}</changefreq>
`), r.priority && (n += `    <priority>${Ze(String(r.priority))}</priority>
`), r.hreflang) {
      const i = Array.isArray(r.hreflang) ? r.hreflang : [r.hreflang];
      for (const a of i) n += `    <xhtml:link rel="alternate" hreflang="${Ze(String(a.lang))}" href="${Ze(String(a.href))}" />
`;
    }
    if (r.image) {
      const i = Wf(String(r.image));
      i && (n += `    <image:image>
`, n += `      <image:loc>${Ze(i)}</image:loc>
`, n += `    </image:image>
`);
    }
    n += `  </url>
`;
  } catch {
  }
  return n += `</urlset>
`, n;
}
function ja(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [], n = Xi().split("?")[0];
  let r = `<?xml version="1.0" encoding="UTF-8"?>
`;
  r += `<rss version="2.0">
`, r += `<channel>
`, r += `<title>${Ze("Sitemap RSS")}</title>
`, r += `<link>${Ze(n)}</link>
`, r += `<description>${Ze("RSS feed generated from site index")}</description>
`, r += `<lastBuildDate>${Ze(e?.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const i of t) try {
    const a = String(i.loc ?? "");
    r += `<item>
`, r += `<title>${Ze(String(i.title || i.slug || (i.loc ?? "")))}</title>
`, i.excerpt && (r += `<description>${Ze(String(i.excerpt))}</description>
`), r += `<link>${Ze(a)}</link>
`, r += `<guid>${Ze(a)}</guid>
`, r += `</item>
`;
  } catch {
  }
  return r += `</channel>
`, r += `</rss>
`, r;
}
function Wa(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [], n = Xi().split("?")[0], r = e?.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let i = `<?xml version="1.0" encoding="utf-8"?>
`;
  i += `<feed xmlns="http://www.w3.org/2005/Atom">
`, i += `<title>${Ze("Sitemap Atom")}</title>
`, i += `<link href="${Ze(n)}" />
`, i += `<updated>${Ze(r)}</updated>
`, i += `<id>${Ze(n)}</id>
`;
  for (const a of t) try {
    const o = String(a.loc ?? ""), s = a?.lastmod ? new Date(a.lastmod).toISOString() : r;
    i += `<entry>
`, i += `<title>${Ze(String(a.title || a.slug || (a.loc ?? "")))}</title>
`, a.excerpt && (i += `<summary>${Ze(String(a.excerpt))}</summary>
`), i += `<link href="${Ze(o)}" />
`, i += `<id>${Ze(o)}</id>
`, i += `<updated>${Ze(s)}</updated>
`, i += `</entry>
`;
  } catch {
  }
  return i += `</feed>
`, i;
}
function qf(e = {}) {
  const { sitemapUrl: t, disallow: n = [] } = e || {};
  let r = `User-agent: *
`;
  for (const i of n) r += `Disallow: ${String(i)}
`;
  return typeof t == "string" && t.trim() && (r += `Sitemap: ${String(t.trim())}
`), r;
}
function Fa(e, t = {}) {
  const n = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [], r = Xi().split("?")[0];
  let i = String(t?.name ?? "").trim();
  if (!i) try {
    i = typeof document < "u" && document.title ? String(document.title).split(/[|\-–—]/)[0].trim() : "";
  } catch {
  }
  i || (i = "Site");
  const a = String(t?.description ?? "").trim();
  let o = `# ${i}
`;
  a && (o += `
> ${a}
`), n.length && (o += `
`);
  for (const s of n) try {
    const l = String(s?.title || s?.slug || "").trim();
    if (!l) continue;
    const c = s?.slug ? String(s.slug) : null, f = String(s?.loc || (c ? `${r}?page=${encodeURIComponent(c)}` : r)), d = s?.excerpt ? `: ${String(s.excerpt).replace(/\s+/g, " ").trim()}` : "";
    o += `- [${l}](${f})${d}
`;
  } catch {
  }
  return o;
}
function Ol() {
  try {
    typeof window < "u" && window.__nimbiSitemapWriteTimer && (clearTimeout(window.__nimbiSitemapWriteTimer), window.__nimbiSitemapWriteTimer = null, window.__nimbiSitemapPendingWrite = null);
  } catch {
  }
}
function yo(e, t = "application/xml") {
  try {
    try {
      document.open(t, "replace");
    } catch {
      try {
        document.open();
      } catch {
      }
    }
    document.write(e), document.close();
    try {
      if (typeof Blob < "u" && typeof URL < "u" && URL.createObjectURL) {
        const n = new Blob([e], { type: t }), r = URL.createObjectURL(n);
        try {
          location.href = r;
        } catch {
          try {
            window.open(r, "_self");
          } catch {
          }
        }
        setTimeout(() => {
          try {
            URL.revokeObjectURL(r);
          } catch {
          }
        }, 5e3);
      }
    } catch {
    }
  } catch {
    try {
      try {
        const r = document.createElement("pre");
        try {
          r.textContent = Ze(e);
        } catch {
          try {
            r.textContent = String(e);
          } catch {
          }
        }
        if (document && document.body) try {
          if (typeof document.body.replaceChildren == "function") document.body.replaceChildren(r);
          else {
            for (; document.body.firstChild; ) document.body.removeChild(document.body.firstChild);
            document.body.appendChild(r);
          }
        } catch {
          try {
            document.body.innerHTML = "<pre>" + Ze(e) + "</pre>";
          } catch {
          }
        }
      } catch {
      }
    } catch {
    }
  }
}
function _o(e) {
  try {
    const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const r of t) try {
      n += `<li><a href="${Ze(String(r && r.loc ? r.loc : ""))}">${Ze(String(r && (r.title || r.slug) || r && r.loc || ""))}</a></li>`;
    } catch {
    }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Sr(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let r = null;
        t === "application/rss+xml" ? r = ja(e) : t === "application/atom+xml" ? r = Wa(e) : t === "text/html" ? r = _o(e) : t === "text/plain" ? r = Fa(e) : r = Ua(e), yo(r, t);
        try {
          typeof window < "u" && (window.__nimbiSitemapRenderedAt = Date.now(), window.__nimbiSitemapJson = e, window.__nimbiSitemapFinal = e.entries || []);
        } catch {
        }
      } catch {
      }
      return;
    }
    const n = Array.isArray(e?.entries) ? e.entries.length : 0;
    try {
      const r = window.__nimbiSitemapPendingWrite || null;
      (!r || typeof r.len == "number" && r.len < n) && (window.__nimbiSitemapPendingWrite = {
        finalJson: e,
        mimeType: t,
        len: n
      }), window.__nimbiSitemapWriteTimer && (clearTimeout(window.__nimbiSitemapWriteTimer), window.__nimbiSitemapWriteTimer = null), window.__nimbiSitemapWriteTimer = setTimeout(() => {
        try {
          if (typeof window > "u") return;
          const i = window.__nimbiSitemapPendingWrite;
          if (!i) return;
          let a = null;
          i.mimeType === "application/rss+xml" ? a = ja(i.finalJson) : i.mimeType === "application/atom+xml" ? a = Wa(i.finalJson) : i.mimeType === "text/html" ? a = _o(i.finalJson) : i.mimeType === "text/plain" ? a = Fa(i.finalJson) : a = Ua(i.finalJson);
          try {
            yo(a, i.mimeType);
          } catch {
          }
          try {
            window.__nimbiSitemapRenderedAt = Date.now(), window.__nimbiSitemapJson = i.finalJson, window.__nimbiSitemapFinal = i.finalJson.entries || [];
          } catch {
          }
        } catch {
        }
        try {
          typeof window < "u" && clearTimeout(window.__nimbiSitemapWriteTimer);
        } catch {
        }
        try {
          typeof window < "u" && (window.__nimbiSitemapWriteTimer = null, window.__nimbiSitemapPendingWrite = null);
        } catch {
        }
      }, 40);
    } catch {
    }
    try {
      window.__nimbiSitemapUnloadListenerAttached || (window.__nimbiSitemapUnloadListenerAttached = !0, window.addEventListener("beforeunload", Ol));
    } catch {
    }
  } catch {
  }
}
async function Vr(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, r = !1, i = !1, a = !1;
    try {
      const d = new URLSearchParams(location.search || "");
      if (d.has("sitemap")) {
        let u = !0;
        for (const p of d.keys()) p !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (d.has("rss")) {
        let u = !0;
        for (const p of d.keys()) p !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (d.has("atom")) {
        let u = !0;
        for (const p of d.keys()) p !== "atom" && (u = !1);
        u && (r = !0);
      }
      if (d.has("llms")) {
        let u = !0;
        for (const p of d.keys()) p !== "llms" && (u = !1);
        u && (a = !0);
      }
    } catch {
    }
    if (!t && !n && !r && !a) {
      const d = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!d || (t = /^(sitemap|sitemap\.xml)$/i.test(d), n = /^(rss|rss\.xml)$/i.test(d), r = /^(atom|atom\.xml)$/i.test(d), i = /^(sitemap|sitemap\.html)$/i.test(d), a = /^llms\.txt$/i.test(d), !t && !n && !r && !i && !a)) return !1;
    }
    let o = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof Sn == "function") try {
        const d = await Sn({
          timeoutMs: s,
          contentBase: e?.contentBase,
          indexDepth: e?.indexDepth,
          noIndexing: e?.noIndexing,
          startBuild: !0
        });
        if (Array.isArray(d) && d.length)
          if (Array.isArray(e.index) && e.index.length) {
            const u = /* @__PURE__ */ new Map();
            try {
              for (const p of e.index) try {
                p?.slug && u.set(String(p.slug), p);
              } catch {
              }
              for (const p of d) try {
                p?.slug && u.set(String(p.slug), p);
              } catch {
              }
            } catch {
            }
            o = Array.from(u.values());
          } else o = d;
        else o = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(se) && se.length ? se : [];
      } catch {
        o = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(se) && se.length ? se : [];
      }
      else o = Array.isArray(se) && se.length ? se : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      o = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(se) && se.length ? se : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length) try {
        const d = /* @__PURE__ */ new Map();
        for (const u of e.index) try {
          if (!u || !u.slug) continue;
          const p = String(u.slug).split("::")[0];
          if (!d.has(p)) d.set(p, u);
          else {
            const m = d.get(p);
            m && String(m.slug ?? "").indexOf("::") !== -1 && String(u.slug ?? "").indexOf("::") === -1 && d.set(p, u);
          }
        } catch {
        }
        try {
          de(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(d.values()), null, 2));
        } catch {
          de(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(d.size));
        }
      } catch (d) {
        x("[runtimeSitemap] logging provided index failed", d);
      }
    } catch {
    }
    if ((!Array.isArray(o) || !o.length) && typeof Un == "function") try {
      const d = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
      let u = null;
      try {
        typeof Sn == "function" && (u = await Sn({
          timeoutMs: d,
          contentBase: e?.contentBase,
          indexDepth: e?.indexDepth,
          noIndexing: e?.noIndexing,
          startBuild: !0
        }));
      } catch {
        u = null;
      }
      if (Array.isArray(u) && u.length) o = u;
      else {
        const p = typeof e.indexDepth == "number" ? e.indexDepth : 3, m = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, g = [];
        e?.homePage && g.push(e.homePage), e?.navigationPage && g.push(e.navigationPage), o = await Un(e?.contentBase, p, m, g.length ? g : void 0);
      }
    } catch (d) {
      x("[runtimeSitemap] rebuild index failed", d), o = Array.isArray(se) && se.length ? se : [];
    }
    try {
      const d = Array.isArray(o) ? o.length : 0;
      try {
        de(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(d));
      } catch {
      }
      try {
        de(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(o, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const d = [];
      e?.homePage && d.push(e.homePage), e?.navigationPage && d.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, p = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let m = null;
      try {
        const g = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof g == "function") try {
          m = await g(e?.contentBase, u, p);
        } catch {
          m = null;
        }
      } catch {
        m = null;
      }
      if ((!m || !m.length) && typeof Un == "function") try {
        m = await Un(e?.contentBase, u, p, d.length ? d : void 0);
      } catch {
        m = null;
      }
      if (Array.isArray(m) && m.length) {
        const g = /* @__PURE__ */ new Map();
        try {
          for (const y of o) try {
            y?.slug && g.set(String(y.slug), y);
          } catch {
          }
          for (const y of m) try {
            y?.slug && g.set(String(y.slug), y);
          } catch {
          }
        } catch {
        }
        o = Array.from(g.values());
      }
    } catch (d) {
      try {
        x("[runtimeSitemap] rebuild index call failed", d);
      } catch {
      }
    }
    try {
      const d = Array.isArray(o) ? o.length : 0;
      try {
        de(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(d));
      } catch {
      }
      try {
        de(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(o, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await Yi(Object.assign({}, e, { index: o }));
    let c = [];
    try {
      const d = /* @__PURE__ */ new Set(), u = Array.isArray(l?.entries) ? l.entries : [];
      for (const p of u) try {
        let m = null;
        if (p && p.slug) m = String(p.slug);
        else if (p && p.loc) try {
          m = new URL(String(p.loc)).searchParams.get("page");
        } catch {
        }
        if (!m) continue;
        const g = String(m).split("::")[0];
        if (!d.has(g)) {
          d.add(g);
          const y = Object.assign({}, p);
          y.baseSlug = g, c.push(y);
        }
      } catch {
      }
      try {
        de(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(c, null, 2));
      } catch {
        de(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(c.length));
      }
    } catch {
      try {
        c = Array.isArray(l?.entries) ? l.entries.slice(0) : [];
      } catch {
        c = [];
      }
    }
    const f = Object.assign({}, l || {}, { entries: Array.isArray(c) ? c : Array.isArray(l?.entries) ? l.entries : [] });
    try {
      if (typeof window < "u") try {
        window.__nimbiSitemapJson = f, window.__nimbiSitemapFinal = c;
      } catch {
      }
    } catch {
    }
    if (a)
      return Sr(f, "text/plain"), !0;
    if (n) {
      const d = Array.isArray(f?.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > d) {
        try {
          de("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, d);
        } catch {
        }
        return !0;
      }
      return Sr(f, "application/rss+xml"), !0;
    }
    if (r) {
      const d = Array.isArray(f?.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > d) {
        try {
          de("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, d);
        } catch {
        }
        return !0;
      }
      return Sr(f, "application/atom+xml"), !0;
    }
    if (t) {
      const d = Array.isArray(f?.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > d) {
        try {
          de("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, d);
        } catch {
        }
        return !0;
      }
      return Sr(f, "application/xml"), !0;
    }
    if (i) try {
      const d = (Array.isArray(f?.entries) ? f.entries : []).length;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > d) {
        try {
          de("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", u, d);
        } catch {
        }
        return !0;
      }
      return Sr(f, "text/html"), !0;
    } catch (d) {
      return x("[runtimeSitemap] render HTML failed", d), !1;
    }
    return !1;
  } catch (t) {
    return x("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
function qa(e, t = {}) {
  try {
    if (!e || typeof document > "u") return null;
    const n = document.createElement("button");
    return n.type = "button", n.className = "button is-small is-light", n.textContent = "Download sitemap", n.setAttribute("aria-label", "Download sitemap JSON"), n.addEventListener("click", async () => {
      try {
        const r = await Yi(), i = JSON.stringify(r, null, 2), a = new Blob([i], { type: "application/json" }), o = URL.createObjectURL(a);
        try {
          const s = document.createElement("a");
          s.href = o, s.download = String(t?.filename || "sitemap.json").replace(/\\/g, "_").replace(/[^A-Za-z0-9_.-]/g, "_").replace(/^_+/, "").replace(/_+$/, "") || "sitemap.json", s.className = "nimbi-sitemap-download", document.body.appendChild(s), s.click(), s.remove();
        } finally {
          setTimeout(() => {
            try {
              URL.revokeObjectURL(o);
            } catch {
            }
          }, 0);
        }
      } catch (r) {
        x("[runtimeSitemap] attachSitemapDownloadUI click failed", r);
      }
    }), e.appendChild(n), n;
  } catch (n) {
    return x("[runtimeSitemap] attachSitemapDownloadUI failed", n), null;
  }
}
async function Ha(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Sn == "function") try {
        const o = await Sn({
          timeoutMs: t,
          contentBase: e?.contentBase,
          indexDepth: e?.indexDepth,
          noIndexing: e?.noIndexing,
          startBuild: !0
        });
        Array.isArray(o) && o.length && (n = o);
      } catch {
      }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(se) && se.length && (n = se), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const r = await Yi(Object.assign({}, e, { index: n }));
    let i = [];
    try {
      const o = /* @__PURE__ */ new Set(), s = Array.isArray(r?.entries) ? r.entries : [];
      for (const l of s) try {
        let c = null;
        if (l && l.slug) c = String(l.slug);
        else if (l && l.loc) try {
          c = new URL(String(l.loc)).searchParams.get("page");
        } catch {
          c = null;
        }
        if (!c) continue;
        const f = String(c).split("::")[0];
        if (!o.has(f)) {
          o.add(f);
          const d = Object.assign({}, l);
          d.baseSlug = f, i.push(d);
        }
      } catch {
      }
    } catch {
      try {
        i = Array.isArray(r?.entries) ? r.entries.slice(0) : [];
      } catch {
        i = [];
      }
    }
    const a = Object.assign({}, r || {}, { entries: Array.isArray(i) ? i : Array.isArray(r?.entries) ? r.entries : [] });
    try {
      if (typeof window < "u") try {
        window.__nimbiSitemapJson = a, window.__nimbiSitemapFinal = i;
      } catch {
      }
    } catch {
    }
    return {
      json: a,
      deduped: i
    };
  } catch {
    return null;
  }
}
function Hf(e) {
  try {
    if (!Array.isArray(e)) return e;
    e.forEach((t) => {
      try {
        if (!t || typeof t != "object") return;
        let n = typeof t.slug == "string" ? String(t.slug) : "", r = null;
        if (n && n.indexOf("::") !== -1) {
          const s = n.split("::");
          n = s[0] || "", r = s.slice(1).join("::") || null;
        }
        const i = !!(n && (n.indexOf(".") !== -1 || n.indexOf("/") !== -1));
        let a = "";
        try {
          if (t.path && typeof t.path == "string") {
            const s = te(String(t.path ?? ""));
            if (a = findSlugForPath(s) || _e?.get(s) || "", !a)
              if (t.title && String(t.title).trim()) a = we(String(t.title).trim());
              else {
                const l = s.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = we(l || s);
              }
          } else if (i) {
            const s = String(n).replace(/\.(?:md|html?)$/i, ""), l = findSlugForPath(s) || _e?.get(s) || "";
            l ? a = l : t.title && String(t.title).trim() ? a = we(String(t.title).trim()) : a = we(s);
          } else !n && t.title && String(t.title).trim() ? a = we(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? we(String(t.title).trim()) : n ? we(n) : "";
          } catch {
            a = n;
          }
        }
        let o = a || "";
        r && (o = o ? `${o}::${r}` : `${we(r)}`), o && (t.slug = o);
        try {
          if (t.path && o) {
            const s = String(o).split("::")[0];
            try {
              ht(s, te(String(t.path ?? "")));
            } catch {
            }
          }
        } catch {
        }
      } catch {
      }
    });
  } catch {
  }
  return e;
}
async function Gf(e, t, n, r, i, a, o, s, l = "eager", c = 1, f = void 0, d = "favicon", u) {
  if (!e || !(e instanceof HTMLElement)) throw new TypeError("navbarWrap must be an HTMLElement");
  const p = it(), m = p ? p.parseFromString(n || "", "text/html") : null, g = m ? m.querySelectorAll("a") : [];
  await Mi(() => bf(g, r)), await Mi(() => wf(g, r));
  try {
    me(g, r);
  } catch {
  }
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let y = null, h = null, b = null, _ = null, w = null, A = null, z = null, j = !1, W = null;
  const Q = /* @__PURE__ */ new Map(), ae = (v, M, q, D) => {
    u ? v.addEventListener(M, q, {
      ...D,
      signal: u
    }) : v.addEventListener(M, q, D);
  };
  function ue() {
    try {
      const v = typeof L < "u" && L && L.querySelector ? L.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null, M = v?.dataset?.target ?? null, q = M ? typeof L < "u" && L && L.querySelector ? L.querySelector(`#${M}`) || document.getElementById(M) : e && e.querySelector ? e.querySelector(`#${M}`) : typeof document < "u" ? document.getElementById(M) : null : null;
      if (v?.classList?.contains("is-active")) {
        try {
          v.classList.remove("is-active");
        } catch {
        }
        try {
          v.setAttribute("aria-expanded", "false");
        } catch {
        }
        if (q?.classList) try {
          q.classList.remove("is-active");
        } catch {
        }
      }
    } catch (v) {
      x("[nimbi-cms] closeMobileMenu failed", v);
    }
  }
  async function ne() {
    const v = t && t instanceof HTMLElement ? t : typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      v && v.classList.add("is-inactive");
    } catch {
    }
    try {
      const M = o?.();
      M && typeof M.then == "function" && await M;
    } catch (M) {
      try {
        x("[nimbi-cms] renderByQuery failed", M);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function") requestAnimationFrame(() => {
          try {
            v && v.classList.remove("is-inactive");
          } catch {
          }
        });
        else try {
          v && v.classList.remove("is-inactive");
        } catch {
        }
      } catch {
        try {
          v && v.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function C(v) {
    try {
      let M = v && typeof v.slug == "string" ? String(v.slug) : "", q = null;
      try {
        M && M.indexOf("::") !== -1 && (q = M.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (v && v.path && typeof v.path == "string") {
          const D = te(String(v.path ?? "")), R = D.replace(/^.*\//, "");
          try {
            if (Q && Q.has(D)) return {
              page: Q.get(D),
              hash: q
            };
            if (Q && Q.has(R)) return {
              page: Q.get(R),
              hash: q
            };
          } catch {
          }
          try {
            if (_e?.has?.(D)) return {
              page: _e.get(D),
              hash: q
            };
          } catch {
          }
          try {
            const B = oe(D);
            if (B) return {
              page: B,
              hash: q
            };
          } catch {
          }
        }
      } catch {
      }
      if (M && M.indexOf("::") !== -1) {
        const D = M.split("::");
        M = D[0] || "", q = D.slice(1).join("::") || null;
      }
      if (M && (M.includes(".") || M.includes("/"))) {
        const D = te(v && v.path ? String(v.path) : M), R = D.replace(/^.*\//, "");
        try {
          if (Q && Q.has(D)) return {
            page: Q.get(D),
            hash: q
          };
          if (Q && Q.has(R)) return {
            page: Q.get(R),
            hash: q
          };
        } catch {
        }
        try {
          let B = oe(D);
          if (!B) try {
            const O = String(D ?? "").replace(/^\/+/, ""), K = O.replace(/^.*\//, "");
            for (const [U, H] of ee.entries()) try {
              let G = null;
              if (typeof H == "string" ? G = te(String(H ?? "")) : H && typeof H == "object" && (H.default ? G = te(String(H.default ?? "")) : G = null), !G) continue;
              if (G === O || G.endsWith("/" + O) || O.endsWith("/" + G) || G.endsWith(K) || O.endsWith(K)) {
                B = U;
                break;
              }
            } catch {
            }
          } catch {
          }
          if (B) M = B;
          else try {
            const O = String(M).replace(/\.(?:md|html?)$/i, "");
            M = we(O || D);
          } catch {
            M = we(D);
          }
        } catch {
          M = we(D);
        }
      }
      return !M && v && v.path && (M = we(te(String(v.path ?? "")))), {
        page: M,
        hash: q
      };
    } catch {
      return {
        page: v && v.slug || "",
        hash: null
      };
    }
  }
  const N = () => y || (y = (async () => {
    try {
      const v = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, M = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, q = typeof v == "function" ? v : Bf, D = typeof M == "function" ? M : Uf, R = [];
      try {
        i && R.push(i);
      } catch {
      }
      try {
        navigationPage && R.push(navigationPage);
      } catch {
      }
      if (l === "lazy" && typeof D == "function") try {
        const B = await D(r, c, f, R.length ? R : void 0);
        if (B && B.length) {
          try {
            try {
              Pr(B);
            } catch {
            }
          } catch {
          }
          return B;
        }
      } catch (B) {
        x("[nimbi-cms] worker builder threw", B);
      }
      return typeof q == "function" ? await q(r, c, f, R.length ? R : void 0) : [];
    } catch (v) {
      return x("[nimbi-cms] buildSearchIndex failed", v), y = null, [];
    } finally {
      if (h) {
        try {
          h.removeAttribute("disabled");
        } catch {
        }
        try {
          b && b.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), y.then((v) => {
    try {
      try {
        W = Array.isArray(v) ? v : null;
      } catch {
        W = null;
      }
      try {
        Hf(v);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                try {
                  try {
                    Pr(Array.isArray(v) ? v : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return Array.isArray(se) ? se : Array.isArray(W) ? W : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = Array.isArray(se) ? se : Array.isArray(W) ? W : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(se) ? se : Array.isArray(W) ? W : [];
                } catch {
                }
              }
            })();
          } catch {
          }
          try {
            window.__nimbi_contentBase = r;
          } catch {
          }
          try {
            window.__nimbi_indexDepth = c;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = f;
          } catch {
          }
        }
      } catch {
      }
      const M = String((h && h.value) ?? "").trim().toLowerCase();
      if (!M || !Array.isArray(v) || !v.length) return;
      const q = v.filter((R) => R.title && R.title.toLowerCase().includes(M) || R.excerpt && R.excerpt.toLowerCase().includes(M));
      if (!q || !q.length) return;
      const D = typeof w < "u" && w ? w : typeof document < "u" ? document.getElementById("nimbi-search-results") : null;
      if (!D) return;
      try {
        typeof D.replaceChildren == "function" ? D.replaceChildren() : D.innerHTML = "";
      } catch {
        try {
          D.innerHTML = "";
        } catch {
        }
      }
      try {
        const R = document.createElement("div");
        R.className = "panel nimbi-search-panel", q.slice(0, 10).forEach((B) => {
          try {
            if (B.parentTitle) {
              const H = document.createElement("p");
              H.className = "panel-heading nimbi-search-title nimbi-search-parent", H.textContent = B.parentTitle, R.appendChild(H);
            }
            const O = document.createElement("a");
            O.className = "panel-block nimbi-search-result";
            const K = C(B);
            O.href = Fe(K.page, K.hash), O.setAttribute("role", "button");
            try {
              if (B.path && typeof B.path == "string") try {
                ht(K.page, B.path);
              } catch {
              }
            } catch {
            }
            const U = document.createElement("div");
            U.className = "is-size-6 has-text-weight-semibold", U.textContent = B.title, O.appendChild(U), O.addEventListener("click", () => {
              try {
                D.classList.add("is-hidden");
              } catch {
              }
            }), R.appendChild(O);
          } catch {
          }
        }), Ei(() => {
          try {
            D.classList.remove("is-hidden"), D.appendChild(R);
          } catch {
          }
        });
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }).finally(() => {
    (async () => {
      try {
        if (j) return;
        j = !0;
        try {
          await Vr({
            homePage: i,
            contentBase: r,
            indexDepth: c,
            noIndexing: f,
            includeAllMarkdown: !0
          });
        } catch (v) {
          x("[nimbi-cms] sitemap trigger failed", v);
        }
      } catch (v) {
        try {
          x("[nimbi-cms] sitemap dynamic import failed", v);
        } catch {
        }
      }
    })();
  }), y), L = document.createElement("nav");
  L.className = "navbar", L.setAttribute("role", "navigation"), L.setAttribute("aria-label", "main navigation");
  const E = document.createElement("div");
  E.className = "navbar-brand";
  const I = g[0], Z = document.createElement("a");
  if (Z.className = "navbar-item", I) {
    const v = I?.getAttribute?.("href") || "#";
    try {
      const M = new URL(v, location.href).searchParams.get("page"), q = M ? decodeURIComponent(M) : i;
      let D = null;
      try {
        typeof q == "string" && (/(?:\.md|\.html?)$/i.test(q) || q.includes("/")) && (D = oe(q));
      } catch {
      }
      !D && typeof q == "string" && !String(q).includes(".") && (D = q), Z.href = Fe(D || q), (!Z.textContent || !String(Z.textContent).trim()) && (Z.textContent = a("home"));
    } catch {
      try {
        const q = typeof i == "string" && (/(?:\.md|\.html?)$/i.test(i) || i.includes("/")) ? oe(i) : typeof i == "string" && !i.includes(".") ? i : null;
        Z.href = Fe(q || i);
      } catch {
        Z.href = Fe(i);
      }
      Z.textContent = a("home");
    }
  } else
    Z.href = Fe(i), Z.textContent = a("home");
  async function $(v) {
    try {
      if (!v || v === "none") return null;
      if (v === "favicon") try {
        const M = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
        if (!M) return null;
        const q = M?.getAttribute?.("href") || "";
        return q && /\.png(?:\?|$)/i.test(q) ? new URL(q, location.href).toString() : null;
      } catch {
        return null;
      }
      if (v === "copy-first" || v === "move-first") try {
        const M = await Qe(i, r);
        if (!M || !M.raw) return null;
        const q = it(), D = q ? q.parseFromString(M.raw, "text/html") : null, R = D ? D.querySelector("img") : null;
        if (!R) return null;
        const B = R?.getAttribute?.("src") || "";
        if (!B) return null;
        const O = new URL(B, location.href).toString();
        if (v === "move-first") try {
          document.documentElement.setAttribute("data-nimbi-logo-moved", O);
        } catch {
        }
        return O;
      } catch {
        return null;
      }
      try {
        return new URL(v, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let re = null;
  try {
    re = await $(d);
  } catch {
    re = null;
  }
  if (re) try {
    const v = document.createElement("img");
    v.className = "nimbi-navbar-logo";
    const M = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
    v.alt = M, v.title = M, v.src = re;
    try {
      (!Z.textContent || !String(Z.textContent).trim()) && (Z.textContent = M);
    } catch {
    }
    try {
      Z.insertBefore(v, Z.firstChild);
    } catch {
      try {
        Z.appendChild(v);
      } catch {
      }
    }
  } catch {
  }
  E.appendChild(Z), Z.addEventListener("click", function(v) {
    const M = Z.getAttribute("href") || "";
    if (M.startsWith("?page=")) {
      v.preventDefault();
      const q = new URL(M, location.href), D = q.searchParams.get("page"), R = q.hash ? q.hash.replace(/^#/, "") : null;
      history.pushState({ page: D }, "", Fe(D, R)), ne();
      try {
        ue();
      } catch {
      }
    }
  });
  function oe(v) {
    try {
      if (!v) return null;
      const M = te(String(v ?? ""));
      try {
        if (_e?.has?.(M)) return _e.get(M);
      } catch {
      }
      const q = M.replace(/^.*\//, "");
      try {
        if (_e?.has?.(q)) return _e.get(q);
      } catch {
      }
      try {
        for (const [D, R] of ee.entries())
          if (R) {
            if (typeof R == "string") {
              if (te(R) === M) return D;
            } else if (R && typeof R == "object") {
              if (R.default && te(R.default) === M) return D;
              const B = R.langs || {};
              for (const O in B) if (B[O] && te(B[O]) === M) return D;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function me(v, M) {
    try {
      if (!v || !v.length) return;
      const q = [];
      for (let K = 0; K < v.length; K++) try {
        const U = v[K];
        if (!U || typeof U.getAttribute != "function") continue;
        const H = U.getAttribute("href") || "";
        if (!H || Ci(H)) continue;
        let G = null;
        try {
          const ve = mt(H);
          ve && ve.page && (G = ve.page);
        } catch {
        }
        if (!G) {
          const ve = String(H ?? "").split(/[?#]/, 1), qe = ve && ve[0] ? ve[0] : H;
          (/\.(?:md|html?)$/i.test(qe) || qe.indexOf("/") !== -1) && (G = te(String(qe ?? "")));
        }
        if (!G) continue;
        try {
          if (M && typeof M == "string") try {
            let ve = new URL(M, typeof location < "u" ? location.origin : "http://localhost").pathname || "";
            if (ve = ve.replace(/^\/+|\/+$/g, ""), ve) {
              let qe = String(G ?? "");
              qe = qe.replace(/^\/+/, ""), qe === ve ? G = "" : qe.startsWith(ve + "/") ? G = qe.slice(ve.length + 1) : G = qe;
            }
          } catch {
          }
        } catch {
        }
        const ie = te(String(G ?? "")), ge = ie.replace(/^.*\//, "");
        let Pe = null;
        try {
          Q && Q.has(ie) && (Pe = Q.get(ie));
        } catch {
        }
        try {
          !Pe && _e?.has?.(ie) && (Pe = _e.get(ie));
        } catch {
        }
        if (Pe) continue;
        let Ce = null;
        try {
          Ce = U.textContent && String(U.textContent).trim() ? String(U.textContent).trim() : null;
        } catch {
          Ce = null;
        }
        let Ie = null;
        if (Ce) Ie = we(Ce);
        else {
          const ve = ge.replace(/\.(?:md|html?)$/i, "");
          Ie = we(ve || ie);
        }
        if (Ie) try {
          q.push({
            path: ie,
            candidate: Ie
          });
        } catch {
        }
      } catch {
      }
      if (!q.length) return;
      const D = 3;
      let R = 0;
      const B = async () => {
        for (; R < q.length; ) {
          const K = q[R++];
          if (!(!K || !K.path))
            try {
              const U = await Qe(K.path, M);
              if (!U || !U.raw) continue;
              let H = null;
              if (U.isHtml) try {
                const G = it(), ie = G ? G.parseFromString(U.raw, "text/html") : null, ge = ie ? ie.querySelector("h1") || ie.querySelector("title") : null;
                ge && ge.textContent && (H = String(ge.textContent).trim());
              } catch {
              }
              else try {
                const G = U.raw.match(/^#\s+(.+)$/m);
                G && G[1] && (H = String(G[1]).trim());
              } catch {
              }
              if (H) {
                const G = we(H);
                if (G && G !== K.candidate) {
                  try {
                    ht(G, K.path);
                  } catch {
                  }
                  try {
                    Q.set(K.path, G);
                  } catch {
                  }
                  try {
                    Q.set(K.path.replace(/^.*\//, ""), G);
                  } catch {
                  }
                  try {
                    try {
                      if (Array.isArray(se)) {
                        let ie = !1;
                        for (const ge of se) try {
                          if (ge && ge.path === K.path && ge.slug) {
                            const Pe = String(ge.slug).split("::").slice(1).join("::");
                            ge.slug = Pe ? `${G}::${Pe}` : G, ie = !0;
                          }
                        } catch {
                        }
                        try {
                          ie && Pr(se);
                        } catch {
                        }
                      }
                    } catch {
                    }
                  } catch {
                  }
                }
              }
            } catch {
            }
        }
      }, O = [];
      for (let K = 0; K < D; K++) O.push(B());
      try {
        await Promise.all(O);
      } catch {
      }
    } catch {
    }
  }
  const he = document.createElement("a");
  he.className = "navbar-burger", he.setAttribute("role", "button"), he.setAttribute("aria-label", "menu"), he.setAttribute("aria-expanded", "false");
  const Se = "nimbi-navbar-menu";
  he.dataset.target = Se, he.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', E.appendChild(he);
  try {
    he.addEventListener("click", (v) => {
      try {
        const M = he.dataset && he.dataset.target ? he.dataset.target : null, q = M ? L && L.querySelector ? L.querySelector(`#${M}`) || (e && e.querySelector ? e.querySelector(`#${M}`) : document.getElementById(M)) : e && e.querySelector ? e.querySelector(`#${M}`) || document.getElementById(M) : typeof document < "u" ? document.getElementById(M) : null : null;
        he.classList.contains("is-active") ? (he.classList.remove("is-active"), he.setAttribute("aria-expanded", "false"), q && q.classList.remove("is-active")) : (he.classList.add("is-active"), he.setAttribute("aria-expanded", "true"), q && q.classList.add("is-active"));
      } catch (M) {
        x("[nimbi-cms] navbar burger toggle failed", M);
      }
    });
  } catch (v) {
    x("[nimbi-cms] burger event binding failed", v);
  }
  const De = document.createElement("div");
  De.className = "navbar-menu", De.id = Se;
  const le = document.createElement("div");
  le.className = "navbar-start";
  let Be = null, Je = null;
  if (!s)
    Be = null, h = null, _ = null, w = null, A = null;
  else {
    Be = document.createElement("div"), Be.className = "navbar-end", Je = document.createElement("div"), Je.className = "navbar-item", h = document.createElement("input"), h.className = "input", h.type = "search", h.placeholder = a("searchPlaceholder") || "", h.id = "nimbi-search";
    try {
      const D = (a && typeof a == "function" ? a("searchAria") : null) || h.placeholder || "Search";
      try {
        h.setAttribute("aria-label", D);
      } catch {
      }
      try {
        h.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        h.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        h.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    l === "eager" && (h.disabled = !0), b = document.createElement("div"), b.className = "control", l === "eager" && b.classList.add("is-loading"), b.setAttribute("aria-live", "polite"), b.appendChild(h), Je.appendChild(b), _ = document.createElement("div"), _.className = "dropdown is-right", _.id = "nimbi-search-dropdown";
    const v = document.createElement("div");
    v.className = "dropdown-trigger", v.setAttribute("aria-expanded", "false"), v.appendChild(Je);
    const M = document.createElement("div");
    M.className = "dropdown-menu", M.setAttribute("role", "menu"), w = document.createElement("div"), w.id = "nimbi-search-results", w.className = "dropdown-content nimbi-search-results", w.setAttribute("role", "listbox"), w.setAttribute("aria-hidden", "true"), w.setAttribute("aria-live", "polite"), w.setAttribute("aria-relevant", "all"), A = w, M.appendChild(w), _.appendChild(v), _.appendChild(M), Be.appendChild(_);
    const q = (D) => {
      if (!w) return;
      try {
        if (typeof w.replaceChildren == "function") w.replaceChildren();
        else for (; w.firstChild; ) w.removeChild(w.firstChild);
      } catch {
        try {
          w.innerHTML = "";
        } catch {
        }
      }
      let R = -1;
      function B(U) {
        try {
          const H = w.querySelector(".nimbi-search-result.is-selected");
          H && H.classList.remove("is-selected");
          const G = w.querySelectorAll(".nimbi-search-result");
          if (!G || !G.length) {
            R = -1;
            try {
              h && h.removeAttribute("aria-activedescendant");
            } catch {
            }
            return;
          }
          if (U < 0) {
            R = -1;
            try {
              h && h.removeAttribute("aria-activedescendant");
            } catch {
            }
            return;
          }
          U >= G.length && (U = G.length - 1);
          const ie = G[U];
          if (ie) {
            ie.classList.add("is-selected"), R = U;
            try {
              ie.scrollIntoView({ block: "nearest" });
            } catch {
            }
            try {
              h && ie.id && h.setAttribute("aria-activedescendant", ie.id);
            } catch {
            }
          }
        } catch {
        }
      }
      function O(U) {
        try {
          const H = U.key, G = w.querySelectorAll(".nimbi-search-result");
          if (!G || !G.length) return;
          if (H === "ArrowDown") {
            U.preventDefault(), B(R < 0 ? 0 : Math.min(G.length - 1, R + 1));
            return;
          }
          if (H === "ArrowUp") {
            U.preventDefault(), B(R <= 0 ? 0 : R - 1);
            return;
          }
          if (H === "Enter") {
            U.preventDefault();
            const ie = w.querySelector(".nimbi-search-result.is-selected") || w.querySelector(".nimbi-search-result");
            if (ie) try {
              ie.click();
            } catch {
            }
            return;
          }
          if (H === "Escape") {
            try {
              _.classList.remove("is-active");
              try {
                v.setAttribute("aria-expanded", "false");
              } catch {
              }
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              w.classList.add("is-hidden");
            } catch {
            }
            try {
              w.classList.remove("is-open");
            } catch {
            }
            try {
              w.removeAttribute("tabindex");
            } catch {
            }
            try {
              w.removeEventListener("keydown", O);
            } catch {
            }
            try {
              h && h.focus();
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", K);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function K(U) {
        try {
          if (U && U.key === "ArrowDown") {
            U.preventDefault();
            try {
              w.focus();
            } catch {
            }
            B(0);
          }
        } catch {
        }
      }
      try {
        const U = String((h && h.value) ?? "").trim();
        if (!D || !D.length) {
          if (!U) {
            try {
              _ && _.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              w && (w.classList.add("is-hidden"), w.classList.remove("is-open"), w.removeAttribute("tabindex"));
            } catch {
            }
            try {
              w && w.removeEventListener("keydown", O);
            } catch {
            }
            return;
          }
          try {
            const H = document.createElement("div");
            H.className = "panel nimbi-search-panel";
            const G = document.createElement("p");
            G.className = "panel-block nimbi-search-no-results", G.textContent = a && typeof a == "function" ? a("searchNoResults") : "No results", H.appendChild(G), Ei(() => {
              try {
                w.appendChild(H);
              } catch {
              }
            });
          } catch {
          }
          if (_) {
            _.classList.add("is-active");
            try {
              v.setAttribute("aria-expanded", "true");
            } catch {
            }
            try {
              document.documentElement.classList.add("nimbi-search-open");
            } catch {
            }
          }
          try {
            w.classList.remove("is-hidden");
          } catch {
          }
          try {
            w.classList.add("is-open");
          } catch {
          }
          try {
            w.setAttribute("aria-hidden", "false");
          } catch {
          }
          try {
            w.setAttribute("tabindex", "0");
          } catch {
          }
          return;
        }
      } catch {
      }
      try {
        const U = document.createElement("div");
        U.className = "panel nimbi-search-panel";
        const H = document.createDocumentFragment();
        D.forEach((G) => {
          if (G.parentTitle) {
            const Ce = document.createElement("p");
            Ce.textContent = G.parentTitle, Ce.className = "panel-heading nimbi-search-title nimbi-search-parent", H.appendChild(Ce);
          }
          const ie = document.createElement("a");
          ie.className = "panel-block nimbi-search-result";
          const ge = C(G);
          ie.href = Fe(ge.page, ge.hash), ie.setAttribute("role", "button");
          try {
            if (G.path && typeof G.path == "string") try {
              ht(ge.page, G.path);
            } catch {
            }
          } catch {
          }
          const Pe = document.createElement("div");
          Pe.className = "is-size-6 has-text-weight-semibold", Pe.textContent = G.title, ie.appendChild(Pe), ie.addEventListener("click", (Ce) => {
            try {
              try {
                Ce && Ce.preventDefault && Ce.preventDefault();
              } catch {
              }
              try {
                Ce && Ce.stopPropagation && Ce.stopPropagation();
              } catch {
              }
              if (_) {
                _.classList.remove("is-active");
                try {
                  document.documentElement.classList.remove("nimbi-search-open");
                } catch {
                }
              }
              try {
                w.classList.add("is-hidden");
                try {
                  w.setAttribute("aria-hidden", "true");
                } catch {
                }
              } catch {
              }
              try {
                w.classList.remove("is-open");
              } catch {
              }
              try {
                w.removeAttribute("tabindex");
              } catch {
              }
              try {
                w.removeEventListener("keydown", O);
              } catch {
              }
              try {
                h && h.removeEventListener("keydown", K);
              } catch {
              }
              try {
                const Ie = ie.getAttribute && ie.getAttribute("href") || "";
                let ve = null, qe = null;
                try {
                  const Ue = new URL(Ie, location.href);
                  ve = Ue.searchParams.get("page"), qe = Ue.hash ? Ue.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (ve) try {
                  history.pushState({ page: ve }, "", Fe(ve, qe));
                  try {
                    ne();
                  } catch {
                    try {
                      typeof window < "u" && typeof window.renderByQuery == "function" && window.renderByQuery();
                    } catch {
                    }
                  }
                  return;
                } catch {
                }
              } catch {
              }
              try {
                window.location.href = ie.href;
              } catch {
              }
            } catch {
            }
          }), H.appendChild(ie);
        }), U.appendChild(H), Ei(() => {
          try {
            w.appendChild(U);
          } catch {
          }
        });
      } catch {
      }
      if (_) {
        _.classList.add("is-active");
        try {
          document.documentElement.classList.add("nimbi-search-open");
        } catch {
        }
      }
      try {
        w.classList.remove("is-hidden");
      } catch {
      }
      try {
        w.classList.add("is-open");
      } catch {
      }
      try {
        w.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        w.addEventListener("keydown", O);
      } catch {
      }
      try {
        h && h.addEventListener("keydown", K);
      } catch {
      }
    };
    if (h) {
      const D = cf(async () => {
        const R = h || (typeof L < "u" && L && L.querySelector ? L.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null), B = String((R && R.value) ?? "").trim().toLowerCase();
        if (!B) {
          try {
            _ && _.classList.remove("is-active");
          } catch {
          }
          try {
            document.documentElement.classList.remove("nimbi-search-open");
          } catch {
          }
          try {
            w && (w.classList.add("is-hidden"), w.classList.remove("is-open"), w.removeAttribute("tabindex"));
          } catch {
          }
          return;
        }
        try {
          await N();
          let O = await y;
          (!Array.isArray(O) || !O.length) && (Array.isArray(window.__nimbiSearchIndex) && window.__nimbiSearchIndex.length ? O = window.__nimbiSearchIndex : Array.isArray(window.__nimbiResolvedIndex) && window.__nimbiResolvedIndex.length && (O = window.__nimbiResolvedIndex));
          const K = Array.isArray(O) ? O.filter((U) => U.title && U.title.toLowerCase().includes(B) || U.excerpt && U.excerpt.toLowerCase().includes(B)) : [];
          q(K.slice(0, 10));
        } catch (O) {
          y = null, x("[nimbi-cms] search input handler failed", O), q([]);
        }
      }, 50);
      try {
        h.addEventListener("input", D);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        y = N();
      } catch (D) {
        x("[nimbi-cms] eager search index init failed", D), y = Promise.resolve([]);
      }
      y.finally(() => {
        const D = h || (typeof L < "u" && L && L.querySelector ? L.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null);
        if (D) {
          try {
            D.removeAttribute("disabled");
          } catch {
          }
          try {
            b && b.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (j) return;
            j = !0;
            const R = await y.catch(() => []);
            try {
              await Vr({
                index: Array.isArray(R) ? R : void 0,
                homePage: i,
                contentBase: r,
                indexDepth: c,
                noIndexing: f,
                includeAllMarkdown: !0
              });
            } catch (B) {
              x("[nimbi-cms] sitemap trigger failed", B);
            }
          } catch (R) {
            try {
              x("[nimbi-cms] sitemap dynamic import failed", R);
            } catch {
            }
          }
        })();
      });
    }
    try {
      z = (D) => {
        try {
          const R = D && D.target;
          if (!A || !A.classList.contains("is-open") && A.style && !A.classList.contains("is-hidden") || R && (A.contains(R) || h && (R === h || h.contains && h.contains(R)))) return;
          if (_) {
            _.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            A.classList.add("is-hidden");
          } catch {
          }
          try {
            A.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      }, ae(document, "click", z, !0), ae(document, "touchstart", z, !0);
    } catch {
    }
  }
  const st = document.createDocumentFragment();
  for (let v = 0; v < g.length; v++) {
    const M = g[v];
    if (v === 0) continue;
    const q = M.getAttribute("href") || "#";
    let D = q;
    const R = document.createElement("a");
    R.className = "navbar-item";
    try {
      let B = null;
      try {
        B = mt(String(q ?? ""));
      } catch {
        B = null;
      }
      let O = null, K = null;
      if (B && (B.type === "canonical" && B.page || B.type === "cosmetic" && B.page) && (O = B.page, K = B.anchor), O && (/\.(?:md|html?)$/i.test(O) || O.includes("/") ? D = O : R.href = Fe(O, K)), /^[^#]*\.md(?:$|[#?])/.test(D) || D.endsWith(".md")) {
        const U = te(D).split(/::|#/, 2), H = U[0], G = U[1], ie = oe(H);
        ie ? R.href = Fe(ie, G) : R.href = Fe(H, G);
      } else if (/\.html(?:$|[#?])/.test(D) || D.endsWith(".html")) {
        const U = te(D).split(/::|#/, 2);
        let H = U[0];
        H && !H.toLowerCase().endsWith(".html") && (H = H + ".html");
        const G = U[1], ie = oe(H);
        if (ie) R.href = Fe(ie, G);
        else try {
          const ge = await Qe(H, r);
          if (ge && ge.raw) try {
            const Pe = it(), Ce = Pe ? Pe.parseFromString(ge.raw, "text/html") : null, Ie = Ce ? Ce.querySelector("title") : null, ve = Ce ? Ce.querySelector("h1") : null, qe = Ie && Ie.textContent && Ie.textContent.trim() ? Ie.textContent.trim() : ve && ve.textContent ? ve.textContent.trim() : null;
            if (qe) {
              const Ue = we(qe);
              if (Ue) {
                try {
                  ht(Ue, H);
                } catch (Wt) {
                  x("[nimbi-cms] slugToMd/mdToSlug set failed", Wt);
                }
                R.href = Fe(Ue, G);
              } else R.href = Fe(H, G);
            } else R.href = Fe(H, G);
          } catch {
            R.href = Fe(H, G);
          }
          else R.href = D;
        } catch {
          R.href = D;
        }
      } else R.href = D;
    } catch (B) {
      x("[nimbi-cms] nav item href parse failed", B), R.href = D;
    }
    try {
      const B = M.textContent && String(M.textContent).trim() ? String(M.textContent).trim() : null;
      if (B) try {
        const O = we(B);
        if (O) {
          const K = R.getAttribute("href") || "";
          let U = null;
          if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(K)) U = te(String(K ?? "").split(/[?#]/)[0]);
          else try {
            const H = mt(K);
            H && H.type === "canonical" && H.page && (U = te(H.page));
          } catch {
          }
          if (U) {
            let H = !1;
            try {
              if (/\.(?:html?)(?:$|[?#])/i.test(String(U ?? ""))) H = !0;
              else if (/\.(?:md)(?:$|[?#])/i.test(String(U ?? ""))) H = !1;
              else {
                const G = String(U ?? "").replace(/^\.\//, ""), ie = G.replace(/^.*\//, "");
                Ye && Ye.size && (Ye.has(G) || Ye.has(ie)) && (H = !0);
              }
            } catch {
              H = !1;
            }
            if (H) try {
              const G = te(String(U ?? "").split(/[?#]/)[0]);
              let ie = !1;
              try {
                oe && typeof oe == "function" && oe(G) && (ie = !0);
              } catch {
              }
              try {
                ht(O, U);
              } catch {
              }
              try {
                if (G) {
                  try {
                    Q.set(G, O);
                  } catch {
                  }
                  try {
                    const ge = G.replace(/^.*\//, "");
                    ge && Q.set(ge, O);
                  } catch {
                  }
                }
              } catch {
              }
              if (ie) try {
                R.href = Fe(O);
              } catch {
              }
            } catch {
            }
          }
        }
      } catch (O) {
        x("[nimbi-cms] nav slug mapping failed", O);
      }
    } catch (B) {
      x("[nimbi-cms] nav slug mapping failed", B);
    }
    R.textContent = M.textContent || D, st.appendChild(R);
  }
  try {
    le.appendChild(st);
  } catch {
  }
  De.appendChild(le), Be && De.appendChild(Be), L.appendChild(E), L.appendChild(De), e.appendChild(L);
  try {
    const v = (M) => {
      try {
        const q = typeof L < "u" && L && L.querySelector ? L.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null;
        if (!q || !q.classList.contains("is-active")) return;
        const D = q && q.closest ? q.closest(".navbar") : L;
        if (D && D.contains(M.target)) return;
        ue();
      } catch {
      }
    };
    ae(document, "click", v, !0), ae(document, "touchstart", v, !0);
  } catch {
  }
  try {
    De.addEventListener("click", (v) => {
      const M = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!M) return;
      const q = M.getAttribute("href") || "";
      try {
        const D = new URL(q, location.href), R = D.searchParams.get("page"), B = D.hash ? D.hash.replace(/^#/, "") : null;
        R && (v.preventDefault(), history.pushState({ page: R }, "", Fe(R, B)), ne());
      } catch (D) {
        x("[nimbi-cms] navbar click handler failed", D);
      }
      try {
        const D = typeof L < "u" && L && L.querySelector ? L.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : null, R = D && D.dataset ? D.dataset.target : null, B = R ? L && L.querySelector ? L.querySelector(`#${R}`) || (e && e.querySelector ? e.querySelector(`#${R}`) : document.getElementById(R)) : e && e.querySelector ? e.querySelector(`#${R}`) || document.getElementById(R) : typeof document < "u" ? document.getElementById(R) : null : null;
        D && D.classList.contains("is-active") && (D.classList.remove("is-active"), D.setAttribute("aria-expanded", "false"), B && B.classList.remove("is-active"));
      } catch (D) {
        x("[nimbi-cms] mobile menu close failed", D);
      }
    });
  } catch (v) {
    x("[nimbi-cms] attach content click handler failed", v);
  }
  try {
    t.addEventListener("click", (v) => {
      const M = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!M) return;
      const q = M.getAttribute("href") || "";
      if (q && !Ci(q))
        try {
          const D = new URL(q, location.href), R = D.searchParams.get("page"), B = D.hash ? D.hash.replace(/^#/, "") : null;
          R && (v.preventDefault(), history.pushState({ page: R }, "", Fe(R, B)), ne());
        } catch (D) {
          x("[nimbi-cms] container click URL parse failed", D);
        }
    });
  } catch (v) {
    x("[nimbi-cms] build navbar failed", v);
  }
  return {
    navbar: L,
    linkEls: g
  };
}
try {
  document.addEventListener("input", (e) => {
    try {
      if (e && e.target && e.target.id === "nimbi-search") {
        const t = document.getElementById("nimbi-search-results");
        if (t && e.target && e.target.value) try {
          t.classList.remove("is-hidden");
        } catch {
        }
      }
    } catch {
    }
  }, !0);
} catch {
}
var ot = null, Ae = null, ct = 1, Xt = (e, t) => t, $r = 0, Dr = 0, Ti = () => {
}, Rr = 0.25;
function Vf() {
  if (ot && document.contains(ot)) return ot;
  ot = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", Xt("imagePreviewTitle", "Image preview"));
  try {
    const E = document.createElement("div");
    E.className = "modal-background";
    const I = document.createElement("div");
    I.className = "modal-content";
    const Z = document.createElement("div");
    Z.className = "nimbi-image-preview__content box", Z.setAttribute("role", "document");
    const $ = document.createElement("button");
    $.className = "button is-small nimbi-image-preview__close", $.type = "button", $.setAttribute("data-nimbi-preview-close", ""), $.textContent = "✕", $.setAttribute("aria-hidden", "true");
    const re = document.createElement("div");
    re.className = "nimbi-image-preview__image-wrapper";
    const oe = document.createElement("img");
    oe.setAttribute("data-nimbi-preview-image", ""), oe.alt = "", re.appendChild(oe);
    const me = document.createElement("div");
    me.className = "nimbi-image-preview__controls";
    const he = document.createElement("div");
    he.className = "nimbi-image-preview__group";
    const Se = document.createElement("button");
    Se.className = "button is-small", Se.type = "button", Se.setAttribute("data-nimbi-preview-fit", ""), Se.textContent = "⤢", Se.setAttribute("aria-hidden", "true");
    const De = document.createElement("button");
    De.className = "button is-small", De.type = "button", De.setAttribute("data-nimbi-preview-original", ""), De.textContent = "1:1", De.setAttribute("aria-hidden", "true");
    const le = document.createElement("button");
    le.className = "button is-small", le.type = "button", le.setAttribute("data-nimbi-preview-reset", ""), le.textContent = "⟲", le.setAttribute("aria-hidden", "true"), he.appendChild(Se), he.appendChild(De), he.appendChild(le);
    const Be = document.createElement("div");
    Be.className = "nimbi-image-preview__group";
    const Je = document.createElement("button");
    Je.className = "button is-small", Je.type = "button", Je.setAttribute("data-nimbi-preview-zoom-out", ""), Je.textContent = "−", Je.setAttribute("aria-hidden", "true");
    const st = document.createElement("div");
    st.className = "nimbi-image-preview__zoom", st.setAttribute("data-nimbi-preview-zoom-label", ""), st.textContent = "100%";
    const v = document.createElement("button");
    v.className = "button is-small", v.type = "button", v.setAttribute("data-nimbi-preview-zoom-in", ""), v.textContent = "＋", v.setAttribute("aria-hidden", "true"), Be.appendChild(Je), Be.appendChild(st), Be.appendChild(v), me.appendChild(he), me.appendChild(Be), Z.appendChild($), Z.appendChild(re), Z.appendChild(me), I.appendChild(Z), e.appendChild(E), e.appendChild(I);
  } catch {
    e.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="nimbi-image-preview__content box" role="document">
          <button class="button is-small nimbi-image-preview__close" type="button" data-nimbi-preview-close aria-hidden="true">✕</button>
          <div class="nimbi-image-preview__image-wrapper">
            <img data-nimbi-preview-image alt="" />
          </div>
          <div class="nimbi-image-preview__controls">
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-fit aria-hidden="true">⤢</button>
              <button class="button is-small" type="button" data-nimbi-preview-original aria-hidden="true">1:1</button>
              <button class="button is-small" type="button" data-nimbi-preview-reset aria-hidden="true">⟲</button>
            </div>
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-zoom-out aria-hidden="true">−</button>
              <div class="nimbi-image-preview__zoom" data-nimbi-preview-zoom-label>100%</div>
              <button class="button is-small" type="button" data-nimbi-preview-zoom-in aria-hidden="true">＋</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  e.addEventListener("click", (E) => {
    E.target === e && ba();
  }), e.addEventListener("wheel", (E) => {
    if (!ae()) return;
    E.preventDefault();
    const I = E.deltaY < 0 ? Rr : -Rr;
    an(ct + I), c(), f();
  }, { passive: !1 }), e.addEventListener("keydown", (E) => {
    if (E.key === "Escape") {
      ba();
      return;
    }
    if (ct > 1) {
      const I = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!I) return;
      const Z = 40;
      switch (E.key) {
        case "ArrowUp":
          I.scrollTop -= Z, E.preventDefault();
          break;
        case "ArrowDown":
          I.scrollTop += Z, E.preventDefault();
          break;
        case "ArrowLeft":
          I.scrollLeft -= Z, E.preventDefault();
          break;
        case "ArrowRight":
          I.scrollLeft += Z, E.preventDefault();
      }
    }
  }), document.body.appendChild(e), ot = e, Ae = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), r = e.querySelector("[data-nimbi-preview-zoom-in]"), i = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), o = e.querySelector("[data-nimbi-preview-close]"), s = e.querySelector("[data-nimbi-preview-zoom-label]"), l = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function c() {
    s && (s.textContent = `${Math.round(ct * 100)}%`);
  }
  const f = () => {
    l && (l.textContent = `${Math.round(ct * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  Ti = c, r.addEventListener("click", () => {
    an(ct + Rr), c(), f();
  }), i.addEventListener("click", () => {
    an(ct - Rr), c(), f();
  }), t.addEventListener("click", () => {
    Br(), c(), f();
  }), n.addEventListener("click", () => {
    an(1), c(), f();
  }), a.addEventListener("click", () => {
    Br(), c(), f();
  }), o.addEventListener("click", ba), t.title = Xt("imagePreviewFit", "Fit to screen"), n.title = Xt("imagePreviewOriginal", "Original size"), i.title = Xt("imagePreviewZoomOut", "Zoom out"), r.title = Xt("imagePreviewZoomIn", "Zoom in"), o.title = Xt("imagePreviewClose", "Close"), o.setAttribute("aria-label", Xt("imagePreviewClose", "Close"));
  let d = !1, u = 0, p = 0, m = 0, g = 0;
  const y = /* @__PURE__ */ new Map();
  let h = 0, b = 1;
  const _ = (E, I) => {
    const Z = E.x - I.x, $ = E.y - I.y;
    return Math.hypot(Z, $);
  }, w = () => {
    d = !1, y.clear(), h = 0, Ae && (Ae.classList.add("is-panning"), Ae.classList.remove("is-grabbing"));
  };
  let A = 0, z = 0, j = 0;
  const W = (E) => {
    const I = Date.now(), Z = I - A, $ = E.clientX - z, re = E.clientY - j;
    A = I, z = E.clientX, j = E.clientY, Z < 300 && Math.hypot($, re) < 30 && (an(ct > 1 ? 1 : 2), c(), E.preventDefault());
  }, Q = (E) => {
    an(ct > 1 ? 1 : 2), c(), E.preventDefault();
  }, ae = () => ot ? typeof ot.open == "boolean" ? ot.open : ot.classList.contains("is-active") : !1, ue = (E, I, Z = 1) => {
    if (y.has(Z) && y.set(Z, {
      x: E,
      y: I
    }), y.size === 2) {
      const me = Array.from(y.values()), he = _(me[0], me[1]);
      if (h > 0) {
        const Se = he / h;
        an(b * Se);
      }
      return;
    }
    if (!d) return;
    const $ = Ae.closest(".nimbi-image-preview__image-wrapper");
    if (!$) return;
    const re = E - u, oe = I - p;
    $.scrollLeft = m - re, $.scrollTop = g - oe;
  }, ne = (E, I, Z = 1) => {
    if (!ae()) return;
    if (y.set(Z, {
      x: E,
      y: I
    }), y.size === 2) {
      const re = Array.from(y.values());
      h = _(re[0], re[1]), b = ct;
      return;
    }
    const $ = Ae.closest(".nimbi-image-preview__image-wrapper");
    $ && ($.scrollWidth > $.clientWidth || $.scrollHeight > $.clientHeight) && (d = !0, u = E, p = I, m = $.scrollLeft, g = $.scrollTop, Ae.classList.add("is-panning"), Ae.classList.remove("is-grabbing"), window.addEventListener("pointermove", C), window.addEventListener("pointerup", N), window.addEventListener("pointercancel", N));
  }, C = (E) => {
    d && (E.preventDefault(), ue(E.clientX, E.clientY, E.pointerId));
  }, N = () => {
    w(), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", N), window.removeEventListener("pointercancel", N);
  };
  Ae.addEventListener("pointerdown", (E) => {
    E.preventDefault(), ne(E.clientX, E.clientY, E.pointerId);
  }), Ae.addEventListener("pointermove", (E) => {
    (d || y.size === 2) && E.preventDefault(), ue(E.clientX, E.clientY, E.pointerId);
  }), Ae.addEventListener("pointerup", (E) => {
    E.preventDefault(), E.pointerType === "touch" && W(E), w();
  }), Ae.addEventListener("dblclick", Q), Ae.addEventListener("pointercancel", w), Ae.addEventListener("mousedown", (E) => {
    E.preventDefault(), ne(E.clientX, E.clientY, 1);
  }), Ae.addEventListener("mousemove", (E) => {
    d && E.preventDefault(), ue(E.clientX, E.clientY, 1);
  }), Ae.addEventListener("mouseup", (E) => {
    E.preventDefault(), w();
  });
  const L = e.querySelector(".nimbi-image-preview__image-wrapper");
  return L && (L.addEventListener("pointerdown", (E) => {
    if (ne(E.clientX, E.clientY, E.pointerId), E?.target?.tagName === "IMG") try {
      E.target.classList.add("is-grabbing");
    } catch {
    }
  }), L.addEventListener("pointermove", (E) => {
    ue(E.clientX, E.clientY, E.pointerId);
  }), L.addEventListener("pointerup", w), L.addEventListener("pointercancel", w), L.addEventListener("mousedown", (E) => {
    if (ne(E.clientX, E.clientY, 1), E?.target?.tagName === "IMG") try {
      E.target.classList.add("is-grabbing");
    } catch {
    }
  }), L.addEventListener("mousemove", (E) => {
    ue(E.clientX, E.clientY, 1);
  }), L.addEventListener("mouseup", w)), e;
}
function an(e) {
  if (!Ae) return;
  const t = Number(e);
  ct = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const n = Ae.getBoundingClientRect(), r = $r || Ae.naturalWidth || Ae.width || n.width || 0, i = Dr || Ae.naturalHeight || Ae.height || n.height || 0;
  if (r && i) {
    Ae.style.setProperty("--nimbi-preview-img-max-width", "none"), Ae.style.setProperty("--nimbi-preview-img-max-height", "none"), Ae.style.setProperty("--nimbi-preview-img-width", `${r * ct}px`), Ae.style.setProperty("--nimbi-preview-img-height", `${i * ct}px`), Ae.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      Ae.style.width = `${r * ct}px`, Ae.style.height = `${i * ct}px`, Ae.style.transform = "none";
    } catch {
    }
  } else {
    Ae.style.setProperty("--nimbi-preview-img-max-width", ""), Ae.style.setProperty("--nimbi-preview-img-max-height", ""), Ae.style.setProperty("--nimbi-preview-img-width", ""), Ae.style.setProperty("--nimbi-preview-img-height", ""), Ae.style.setProperty("--nimbi-preview-img-transform", `scale(${ct})`);
    try {
      Ae.style.transform = `scale(${ct})`;
    } catch {
    }
  }
  Ae && (Ae.classList.add("is-panning"), Ae.classList.remove("is-grabbing"));
}
function Br() {
  if (!Ae) return;
  const e = Ae.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = $r || Ae.naturalWidth || t.width, r = Dr || Ae.naturalHeight || t.height;
  if (!n || !r) return;
  const i = t.width / n, a = t.height / r, o = Math.min(i, a, 1);
  an(Number.isFinite(o) ? o : 1);
}
function Zf(e, t = "", n = 0, r = 0) {
  const i = Vf();
  ct = 1, $r = n || 0, Dr = r || 0, Ae.src = e;
  try {
    if (!t) try {
      const o = new URL(e, typeof location < "u" ? location.href : "").pathname || "", s = (o.substring(o.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      t = Xt("imagePreviewDefaultAlt", s || "Image");
    } catch {
      t = Xt("imagePreviewDefaultAlt", "Image");
    }
  } catch {
  }
  Ae.alt = t, Ae.style.transform = "scale(1)";
  const a = () => {
    $r = Ae.naturalWidth || Ae.width || 0, Dr = Ae.naturalHeight || Ae.height || 0;
  };
  if (a(), Br(), Ti(), requestAnimationFrame(() => {
    Br(), Ti();
  }), !$r || !Dr) {
    const o = () => {
      a(), requestAnimationFrame(() => {
        Br(), Ti();
      }), Ae.removeEventListener("load", o);
    };
    Ae.addEventListener("load", o);
  }
  typeof i.showModal == "function" && (i.open || i.showModal()), i.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  i.focus();
  try {
    const o = i.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (o.length) {
      const s = o[0], l = o[o.length - 1], c = (f) => {
        try {
          if (f.key !== "Tab") return;
          f.shiftKey ? document.activeElement === s && (f.preventDefault(), l.focus()) : document.activeElement === l && (f.preventDefault(), s.focus());
        } catch {
        }
      };
      i.addEventListener("keydown", c), i._focusTrapHandler = c;
    }
  } catch {
  }
}
function ba() {
  if (ot) {
    typeof ot.close == "function" && ot.open && ot.close(), ot.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
    try {
      ot._focusTrapHandler && (ot.removeEventListener("keydown", ot._focusTrapHandler), ot._focusTrapHandler = null);
    } catch {
    }
  }
}
function Xf(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  Xt = (p, m) => (typeof t == "function" ? t(p) : void 0) || m, Rr = n, e.addEventListener("click", (p) => {
    const m = p.target;
    if (!m || m.tagName !== "IMG") return;
    const g = m;
    g.src && (g.closest("a")?.getAttribute?.("href") || Zf(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0));
  });
  let r = !1, i = 0, a = 0, o = 0, s = 0;
  const l = /* @__PURE__ */ new Map();
  let c = 0, f = 1;
  const d = (p, m) => {
    const g = p.x - m.x, y = p.y - m.y;
    return Math.hypot(g, y);
  };
  e.addEventListener("pointerdown", (p) => {
    const m = p.target;
    if (!m || m.tagName !== "IMG") return;
    const g = m.closest("a");
    if (g && g.getAttribute("href") || !ot || !ot.open) return;
    if (l.set(p.pointerId, {
      x: p.clientX,
      y: p.clientY
    }), l.size === 2) {
      const h = Array.from(l.values());
      c = d(h[0], h[1]), f = ct;
      return;
    }
    const y = m.closest(".nimbi-image-preview__image-wrapper");
    if (y && !(ct <= 1)) {
      p.preventDefault(), r = !0, i = p.clientX, a = p.clientY, o = y.scrollLeft, s = y.scrollTop, m.setPointerCapture(p.pointerId);
      try {
        m.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (p) => {
    if (l.has(p.pointerId) && l.set(p.pointerId, {
      x: p.clientX,
      y: p.clientY
    }), l.size === 2) {
      p.preventDefault();
      const b = Array.from(l.values()), _ = d(b[0], b[1]);
      if (c > 0) {
        const w = _ / c;
        an(f * w);
      }
      return;
    }
    if (!r) return;
    p.preventDefault();
    const m = p.target;
    if (m?.closest?.("a")?.getAttribute?.("href")) return;
    const g = m.closest(".nimbi-image-preview__image-wrapper");
    if (!g) return;
    const y = p.clientX - i, h = p.clientY - a;
    g.scrollLeft = o - y, g.scrollTop = s - h;
  });
  const u = () => {
    r = !1, l.clear(), c = 0;
    try {
      const p = document.querySelector("[data-nimbi-preview-image]");
      p && (p.classList.add("is-panning"), p.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", u), e.addEventListener("pointercancel", u);
}
function Yf(e) {
  const { contentWrap: t, navWrap: n, container: r, mountOverlay: i = null, t: a, contentBase: o, homePage: s, initialDocumentTitle: l, runHooks: c, allowEmbeddedScripts: f = !1, signal: d } = e || {};
  if (!t || !(t instanceof HTMLElement)) throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const p = {}, m = gf(a, [{
    path: s,
    name: a("home"),
    isIndex: !0,
    children: []
  }]), g = /* @__PURE__ */ new Map(), y = 12;
  let h = !1, b = !1;
  function _(C) {
    try {
      if (!C) return;
      if (typeof C.replaceChildren == "function") return C.replaceChildren();
      for (; C.firstChild; ) C.removeChild(C.firstChild);
    } catch {
      try {
        C && (C.innerHTML = "");
      } catch {
      }
    }
  }
  function w(C) {
    try {
      const N = String(C?.raw || ""), L = N.length;
      return `${L}:${N.slice(0, 120)}:${N.slice(Math.max(0, L - 120))}`;
    } catch {
      return "0::";
    }
  }
  function A(C) {
    const N = g.get(C);
    return N ? (g.delete(C), g.set(C, N), N) : null;
  }
  function z(C, N) {
    try {
      for (g.has(C) && g.delete(C), g.set(C, N); g.size > y; ) {
        const L = g.keys().next().value;
        g.delete(L);
      }
    } catch {
    }
  }
  async function j(C, N) {
    let L, E, I;
    try {
      ({ data: L, pagePath: E, anchor: I } = await vu(C, o));
    } catch (le) {
      const Be = le?.message ? String(le.message) : "", Je = (!xe || typeof xe != "string" || !xe) && /no page data/i.test(Be);
      try {
        if (Je) try {
          x("[nimbi-cms] fetchPageData (expected missing)", le);
        } catch {
        }
        else try {
          Lr("[nimbi-cms] fetchPageData failed", le);
        } catch {
        }
      } catch {
      }
      try {
        !xe && n && _(n);
      } catch {
      }
      fo(t, a, le);
      return;
    }
    !I && N && (I = N);
    try {
      Ba(null);
    } catch (le) {
      x("[nimbi-cms] scrollToAnchorOrTop failed", le);
    }
    try {
      _(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const Z = `${String(E ?? "")}|||${w(L)}`, $ = A(Z);
    let re, oe, me, he, Se, De;
    $?.articleTemplate ? (re = $.articleTemplate.cloneNode(!0), me = $.tocTemplate ? $.tocTemplate.cloneNode(!0) : null, he = re.querySelector("h1"), Se = he ? (he.textContent || "").trim() : $.h1Text || "", De = $.slugKey || he && he.id || "", oe = { meta: Object.assign({}, $.meta || {}) }) : ({ article: re, parsed: oe, toc: me, topH1: he, h1Text: Se, slugKey: De } = await xf(a, L, E, I, o), z(Z, {
      articleTemplate: re.cloneNode(!0),
      tocTemplate: me ? me.cloneNode(!0) : null,
      meta: Object.assign({}, oe?.meta || {}),
      h1Text: Se || "",
      slugKey: De || ""
    })), yu(a, l, oe, me, re, E, I, he, Se, De, L);
    try {
      _(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    me && (n.appendChild(me), Cf(me));
    try {
      await c("transformHtml", {
        article: re,
        parsed: oe,
        toc: me,
        pagePath: E,
        anchor: I,
        topH1: he,
        h1Text: Se,
        slugKey: De,
        data: L
      });
    } catch (le) {
      x("[nimbi-cms] transformHtml hooks failed", le);
    }
    try {
      if (!document.querySelector(".nimbi-skip-link")) {
        const le = document.createElement("a");
        le.className = "nimbi-skip-link", le.href = "#main", le.textContent = "Skip to content", le.setAttribute("aria-label", "Skip to content");
        const Be = document.querySelector(".nimbi-mount") || document.querySelector(".nimbi-cms") || document.body;
        Be && Be.firstChild ? Be.insertBefore(le, Be.firstChild) : Be && Be.appendChild(le);
      }
    } catch {
    }
    try {
      let le = t.querySelector("main.nimbi-main");
      le || (le = document.createElement("main"), le.className = "nimbi-main", t.appendChild(le)), le.appendChild(re);
    } catch {
      t.appendChild(re);
    }
    try {
      ac(re);
    } catch (le) {
      x("[nimbi-cms] observeCodeBlocks failed", le);
    }
    try {
      Sf(re, f);
    } catch (le) {
      x("[nimbi-cms] executeEmbeddedScripts failed", le);
    }
    try {
      Xf(re, { t: a });
    } catch (le) {
      x("[nimbi-cms] attachImagePreview failed", le);
    }
    try {
      aa(r, 100, !1), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => aa(r, 100, !1));
    } catch (le) {
      x("[nimbi-cms] setEagerForAboveFoldImages failed", le);
    }
    Ba(I), Mf(re, he, {
      mountOverlay: i,
      container: r,
      navWrap: n,
      t: a
    });
    try {
      await c("onPageLoad", {
        data: L,
        pagePath: E,
        anchor: I,
        article: re,
        toc: me,
        topH1: he,
        h1Text: Se,
        slugKey: De,
        contentWrap: t,
        navWrap: n
      });
    } catch (le) {
      x("[nimbi-cms] onPageLoad hooks failed", le);
    }
    u = E;
  }
  async function W() {
    const C = typeof performance < "u" && typeof performance.now == "function" ? performance.now() : null;
    if (h) {
      b = !0;
      return;
    }
    h = !0;
    try {
      try {
        Ao("renderByQuery");
      } catch {
      }
      let N = mt(location.href);
      try {
        if (N?.type === "path" && N?.page && o) try {
          const I = typeof o == "string" ? new URL(o, location.href).pathname : "", Z = String(I ?? "").replace(/^\/+|\/+$/g, ""), $ = String(N.page ?? "").replace(/^\/+|\/+$/g, "");
          Z && $ === Z && (N.page = null);
        } catch {
        }
      } catch {
      }
      if (N?.type === "path" && N?.page) try {
        let I = "?page=" + encodeURIComponent(N.page || "");
        N.params && (I += (I.includes("?") ? "&" : "?") + N.params), N.anchor && (I += "#" + encodeURIComponent(N.anchor));
        try {
          history.replaceState(history.state, "", I);
        } catch {
          try {
            history.replaceState({}, "", I);
          } catch {
          }
        }
        N = mt(location.href);
      } catch {
      }
      const L = N?.page ? N.page : s, E = N?.anchor ? N.anchor : null;
      if (typeof document.startViewTransition == "function") try {
        await document.startViewTransition(async () => {
          await j(L, E);
        }).finished;
      } catch {
      }
      else await j(L, E);
    } catch (N) {
      x("[nimbi-cms] renderByQuery failed", N);
      try {
        !xe && n && _(n);
      } catch {
      }
      fo(t, a, N);
    } finally {
      if (C !== null) try {
        const N = performance.now() - C;
        typeof window < "u" && window.__nimbiRenderTimings && window.__nimbiRenderTimings.push(N);
      } catch {
      }
      if (h = !1, b) {
        b = !1;
        try {
          await W();
        } catch {
        }
      }
    }
  }
  const Q = (C, N, L, E) => {
    d ? C.addEventListener(N, L, {
      ...E,
      signal: d
    }) : C.addEventListener(N, L, E);
  };
  Q(window, "popstate", W), Q(window, "hashchange", W);
  const ae = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, ue = () => {
    try {
      const C = r || document.querySelector(".nimbi-cms");
      if (!C) return;
      const N = {
        top: C.scrollTop || 0,
        left: C.scrollLeft || 0
      };
      sessionStorage.setItem(ae(), JSON.stringify(N));
    } catch (C) {
      if (C && C.name === "QuotaExceededError") {
        try {
          p[ae()] = {
            top: (r || document.querySelector(".nimbi-cms"))?.scrollTop || 0,
            left: (r || document.querySelector(".nimbi-cms"))?.scrollLeft || 0
          };
        } catch {
        }
        return;
      }
      x("[nimbi-cms] save scroll position failed", C);
    }
  }, ne = () => {
    try {
      const C = r || document.querySelector(".nimbi-cms");
      if (!C) return;
      let N = null;
      try {
        const L = sessionStorage.getItem(ae());
        L && (N = JSON.parse(L));
      } catch {
      }
      !N && p[ae()] && (N = p[ae()]), N && typeof N?.top == "number" && C.scrollTo({
        top: N.top,
        left: N.left || 0,
        behavior: "auto"
      });
    } catch {
    }
  };
  return Q(window, "pageshow", (C) => {
    if (C.persisted) try {
      ne(), aa(r, 100, !1);
    } catch (N) {
      x("[nimbi-cms] bfcache restore failed", N);
    }
  }), Q(window, "pagehide", () => {
    try {
      ue();
    } catch (C) {
      x("[nimbi-cms] save scroll position failed", C);
    }
  }), {
    renderByQuery: W,
    siteNav: m,
    getCurrentPagePath: () => u
  };
}
function Qf(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location) try {
      const a = mt(window.location.href);
      a && a.params && (t = a.params.startsWith("?") ? a.params : "?" + a.params);
    } catch {
      t = "";
    }
    if (!t) return {};
    const n = new URLSearchParams(t.startsWith("?") ? t.slice(1) : t), r = {}, i = (a) => {
      if (a == null) return;
      const o = String(a).toLowerCase();
      if (o === "1" || o === "true" || o === "yes") return !0;
      if (o === "0" || o === "false" || o === "no") return !1;
    };
    if (n.has("contentPath") && (r.contentPath = n.get("contentPath")), n.has("searchIndex")) {
      const a = i(n.get("searchIndex"));
      typeof a == "boolean" && (r.searchIndex = a);
    }
    if (n.has("searchIndexMode")) {
      const a = n.get("searchIndexMode");
      (a === "eager" || a === "lazy") && (r.searchIndexMode = a);
    }
    if (n.has("defaultStyle")) {
      const a = n.get("defaultStyle");
      (a === "light" || a === "dark" || a === "system") && (r.defaultStyle = a);
    }
    if (n.has("bulmaCustomize") && (r.bulmaCustomize = n.get("bulmaCustomize")), n.has("lang") && (r.lang = n.get("lang")), n.has("l10nFile")) {
      const a = n.get("l10nFile");
      r.l10nFile = a === "null" ? null : a;
    }
    if (n.has("cacheTtlMinutes")) {
      const a = Number(n.get("cacheTtlMinutes"));
      Number.isFinite(a) && a >= 0 && (r.cacheTtlMinutes = a);
    }
    if (n.has("cacheMaxEntries")) {
      const a = Number(n.get("cacheMaxEntries"));
      Number.isInteger(a) && a >= 0 && (r.cacheMaxEntries = a);
    }
    if (n.has("homePage") && (r.homePage = n.get("homePage")), n.has("navigationPage") && (r.navigationPage = n.get("navigationPage")), n.has("notFoundPage")) {
      const a = n.get("notFoundPage");
      r.notFoundPage = a === "null" ? null : a;
    }
    if (n.has("availableLanguages") && (r.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("fetchConcurrency")) {
      const a = Number(n.get("fetchConcurrency"));
      Number.isInteger(a) && a >= 1 && (r.fetchConcurrency = a);
    }
    if (n.has("negativeFetchCacheTTL")) {
      const a = Number(n.get("negativeFetchCacheTTL"));
      Number.isFinite(a) && a >= 0 && (r.negativeFetchCacheTTL = a);
    }
    if (n.has("indexDepth")) {
      const a = Number(n.get("indexDepth"));
      Number.isInteger(a) && (a === 1 || a === 2 || a === 3) && (r.indexDepth = a);
    }
    if (n.has("noIndexing")) {
      const a = (n.get("noIndexing") || "").split(",").map((o) => o.trim()).filter(Boolean);
      a.length && (r.noIndexing = a);
    }
    return r;
  } catch {
    return {};
  }
}
function wa(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function Kf(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
var Jf = "monokai", _i = "", bi = null;
async function dd(e = {}) {
  if (!e || typeof e != "object") throw new TypeError("initCMS(options): options must be an object");
  const t = Qf();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0) try {
      x("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
    } catch {
    }
    else {
      try {
        x("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    Object.prototype.hasOwnProperty.call(n, "debugLevel") && ql(n.debugLevel);
  } catch {
  }
  try {
    bn("[nimbi-cms] initCMS called", () => ({ options: n }));
  } catch {
  }
  t && typeof t.bulmaCustomize == "string" && t.bulmaCustomize.trim() && (n.bulmaCustomize = t.bulmaCustomize);
  let { el: r, contentPath: i = "/content", crawlMaxQueue: a = 1e3, searchIndex: o = !0, searchIndexMode: s = "eager", indexDepth: l = 1, noIndexing: c = void 0, defaultStyle: f = "light", bulmaCustomize: d = "none", lang: u = void 0, l10nFile: p = null, cacheTtlMinutes: m = 5, cacheMaxEntries: g, markdownExtensions: y, availableLanguages: h, homePage: b = null, notFoundPage: _ = null, navigationPage: w = "_navigation.md", allowEmbeddedScripts: A = !1, exposeSitemap: z = !0, cspNonce: j = null } = n;
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof _ == "string" && _.startsWith("./") && (_ = _.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: W = "favicon" } = n, { skipRootReadme: Q = !1 } = n, ae = (C) => {
    try {
      const N = document.querySelector(r);
      if (N && N instanceof Element) try {
        const L = () => {
          const I = document.createElement("div");
          I.className = "nimbi-init-error";
          const Z = document.createElement("strong");
          Z.textContent = "NimbiCMS failed to initialize:", I.appendChild(Z);
          try {
            I.appendChild(document.createElement("br"));
          } catch {
          }
          const $ = document.createElement("pre");
          return $.textContent = String(C), I.appendChild($), I;
        }, E = L();
        try {
          if (typeof N.replaceChildren == "function") N.replaceChildren(E);
          else {
            for (; N.firstChild; ) N.removeChild(N.firstChild);
            N.appendChild(E);
          }
        } catch {
          try {
            for (; N.firstChild; ) N.removeChild(N.firstChild);
            N.appendChild(L());
          } catch {
          }
        }
      } catch {
      }
    } catch {
    }
  };
  if (n.contentPath != null && !Kf(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (b != null && !wa(b))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !wa(_))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (w != null && !wa(w))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r) throw new Error("el is required");
  let ue = r;
  if (typeof r == "string") {
    if (ue = document.querySelector(r), !ue) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element)) throw new TypeError("el must be a CSS selector string or a DOM element");
  try {
    if (ue && ue._nimbiCmsInitialized) throw new Error("initCMS already called on this element");
  } catch (C) {
    if (C instanceof Error && /already called/.test(C.message)) throw C;
  }
  if (typeof i != "string" || !i.trim()) throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof o != "boolean") throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (s != null && s !== "eager" && s !== "lazy") throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3) throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (f !== "light" && f !== "dark" && f !== "system") throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (d != null && typeof d != "string") throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (u != null && typeof u != "string") throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string") throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (m != null && (typeof m != "number" || !Number.isFinite(m) || m < 0)) throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (g != null && (typeof g != "number" || !Number.isInteger(g) || g < 0)) throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (y != null && (!Array.isArray(y) || y.some((C) => !C || typeof C != "object"))) throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (h != null && (!Array.isArray(h) || h.some((C) => typeof C != "string" || !C.trim()))) throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some((C) => typeof C != "string" || !C.trim()))) throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (c = Array.isArray(c) ? Array.from(new Set(c.map((C) => {
    try {
      return te(String(C ?? ""));
    } catch {
      return "";
    }
  }).filter(Boolean))) : void 0, Q != null && typeof Q != "boolean") throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (A != null && typeof A != "boolean") throw new TypeError('initCMS(options): "allowEmbeddedScripts" must be a boolean when provided');
  if (n.fetchConcurrency != null && (typeof n.fetchConcurrency != "number" || !Number.isInteger(n.fetchConcurrency) || n.fetchConcurrency < 1)) throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');
  if (n.negativeFetchCacheTTL != null && (typeof n.negativeFetchCacheTTL != "number" || !Number.isFinite(n.negativeFetchCacheTTL) || n.negativeFetchCacheTTL < 0)) throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b))) throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_))) throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ne = !!o;
  try {
    Do(!!Q);
  } catch (C) {
    x("[nimbi-cms] setSkipRootReadme failed", C);
  }
  try {
    try {
      n?.seoMap && typeof n.seoMap == "object" && gu(n.seoMap);
    } catch {
    }
    try {
      fc();
    } catch {
    }
    try {
      j && pc(j);
    } catch {
    }
    try {
      const C = "11.12.0";
      C && dc(C, Jf);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(C) {
        try {
          const N = {
            type: "error",
            message: C?.message ? String(C.message) : "",
            filename: C?.filename ? String(C.filename) : "",
            lineno: C?.lineno ? C.lineno : null,
            colno: C?.colno ? C.colno : null,
            stack: C?.error?.stack ? C.error.stack : null,
            time: Date.now()
          };
          try {
            x("[nimbi-cms] runtime error", N.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(N);
        } catch {
        }
      }, { signal: bi.signal }), window.addEventListener("unhandledrejection", function(C) {
        try {
          const N = {
            type: "unhandledrejection",
            reason: C?.reason ? String(C.reason) : "",
            time: Date.now()
          };
          try {
            x("[nimbi-cms] unhandledrejection", N.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(N);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const C = mt(typeof window < "u" ? window.location.href : ""), N = C?.page ? C.page : b || void 0;
      try {
        du();
      } catch {
      }
      try {
        N && mu(N, _i || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        ue.classList.add("nimbi-mount");
      } catch (v) {
        x("[nimbi-cms] mount element setup failed", v);
      }
      const C = document.createElement("section");
      C.className = "section";
      const N = document.createElement("div");
      N.className = "container nimbi-cms";
      const L = document.createElement("div");
      L.className = "columns";
      const E = document.createElement("div");
      E.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", E.setAttribute("role", "navigation");
      try {
        const v = typeof Kn == "function" ? Kn("navigation") : null;
        v && E.setAttribute("aria-label", v);
      } catch (v) {
        x("[nimbi-cms] set nav aria-label failed", v);
      }
      L.appendChild(E);
      const I = document.createElement("main");
      I.className = "column nimbi-content", I.setAttribute("role", "main"), L.appendChild(I), N.appendChild(L), C.appendChild(N);
      const Z = E, $ = I;
      ue.appendChild(C);
      let re = null;
      try {
        re = ue.querySelector(".nimbi-overlay"), re || (re = document.createElement("div"), re.className = "nimbi-overlay", ue.appendChild(re));
      } catch (v) {
        re = null, x("[nimbi-cms] mount overlay setup failed", v);
      }
      const oe = location.pathname || "/";
      let me;
      if (oe.endsWith("/")) me = oe;
      else {
        const v = oe.substring(oe.lastIndexOf("/") + 1);
        v && !v.includes(".") ? me = oe + "/" : me = oe.substring(0, oe.lastIndexOf("/") + 1);
      }
      try {
        _i = document.title || "";
      } catch (v) {
        _i = "", x("[nimbi-cms] read initial document title failed", v);
      }
      let he = i;
      Object.prototype.hasOwnProperty.call(n, "contentPath");
      const Se = typeof location < "u" && location?.origin ? location.origin : "http://localhost", De = new URL(me, Se).toString();
      (he === "." || he === "./") && (he = "");
      try {
        he = String(he ?? "").replace(/\\/g, "/");
      } catch {
        he = String(he ?? "");
      }
      he.startsWith("/") && (he = he.replace(/^\/+/, "")), he && !he.endsWith("/") && (he = he + "/");
      try {
        if (he && me && me !== "/") {
          const v = me.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          v && he.startsWith(v) && (he = he.slice(v.length));
        }
      } catch {
      }
      try {
        if (he) var le = new URL(he, De.endsWith("/") ? De : De + "/").toString();
        else var le = De;
      } catch {
        try {
          if (he) var le = new URL("/" + he, Se).toString();
          else var le = new URL(me, Se).toString();
        } catch {
          var le = Se;
        }
      }
      p && await Po(p, me), h && Array.isArray(h) && Bo(h), u && No(u);
      try {
        if (typeof document < "u" && document.documentElement) {
          const v = typeof u == "string" && u.trim() ? u.trim().split("-")[0] : $t;
          try {
            document.documentElement.setAttribute("lang", v);
          } catch {
          }
          try {
            const M = new Intl.Locale(v || "en"), q = M.textInfo && M.textInfo.direction === "rtl" || [
              "ar",
              "he",
              "fa",
              "ur",
              "ps",
              "sd",
              "ug",
              "ku",
              "dv",
              "yi"
            ].includes(String(v || "").split("-")[0].toLowerCase());
            document.documentElement.setAttribute("dir", q ? "rtl" : "ltr");
          } catch {
          }
        }
      } catch {
      }
      if (typeof m == "number" && m >= 0 && typeof Is == "function" && Is(m * 60 * 1e3), typeof g == "number" && g >= 0 && typeof Ns == "function" && Ns(g), y && Array.isArray(y) && y.length) try {
        y.forEach((v) => {
          typeof v == "object" && nf && typeof Ia == "function" && Ia(v);
        });
      } catch (v) {
        x("[nimbi-cms] applying markdownExtensions failed", v);
      }
      try {
        if (typeof a == "number") try {
          Yo(a);
        } catch (v) {
          x("[nimbi-cms] setDefaultCrawlMaxQueue failed", v);
        }
        if (typeof n.fetchConcurrency == "number") try {
          Zo(n.fetchConcurrency);
        } catch (v) {
          x("[nimbi-cms] setFetchConcurrency failed", v);
        }
        if (typeof n.negativeFetchCacheTTL == "number") try {
          Vo(n.negativeFetchCacheTTL);
        } catch (v) {
          x("[nimbi-cms] setFetchNegativeCacheTTL failed", v);
        }
      } catch (v) {
        x("[nimbi-cms] setDefaultCrawlMaxQueue failed", v);
      }
      try {
        try {
          const v = n?.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (v && typeof v == "object") try {
            Ho(v), bn?.("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(v).length }));
          } catch (M) {
            x?.("[nimbi-cms] applying content manifest failed", M);
          }
          try {
            try {
              const M = mt(typeof window < "u" ? window.location.href : "");
              if (M) try {
                if (M.type === "cosmetic") try {
                  xi(M);
                } catch {
                }
                else if (M.type === "canonical") try {
                  xi(M);
                } catch {
                }
                else if (M.type === "path") try {
                  const q = (typeof location < "u" && location?.pathname ? String(location.pathname) : "/").replace(/\/\/+$/, ""), D = (me || "").replace(/\/\/+$/, "");
                  let R = "";
                  try {
                    R = new URL(le).pathname.replace(/\/\/+$/, "");
                  } catch {
                    R = "";
                  }
                  if (q === D || q === R || q === "") try {
                    xi({
                      type: "path",
                      page: null,
                      anchor: M.anchor || null,
                      params: M.params || ""
                    });
                  } catch {
                  }
                } catch {
                }
              } catch {
              }
            } catch {
            }
            Qa(le);
          } catch (M) {
            x("[nimbi-cms] setContentBase failed", M);
          }
          try {
            try {
              bn("[nimbi-cms diagnostic] after setContentBase", () => ({
                manifestKeys: Object.keys(v ?? {}).length ?? 0,
                slugToMdSize: ee?.size ?? void 0,
                allMarkdownPathsLength: ut?.length ?? void 0,
                allMarkdownPathsSetSize: Ye?.size ?? void 0,
                searchIndexLength: searchIndex?.length ?? void 0
              }));
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (v) {
        x("[nimbi-cms] setContentBase failed", v);
      }
      try {
        Fo(_);
      } catch (v) {
        x("[nimbi-cms] setNotFoundPage failed", v);
      }
      try {
        if (typeof window < "u" && window.__nimbiAutoAttachSitemapUI) try {
          _a && typeof qa == "function" && qa(document.body, { filename: "sitemap.json" });
        } catch {
        }
      } catch {
      }
      let Be = null, Je = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && w) try {
          const M = [], q = [];
          try {
            w && q.push(String(w));
          } catch {
          }
          try {
            const R = String(w ?? "").replace(/^_/, "");
            R && R !== String(w) && q.push(R);
          } catch {
          }
          try {
            q.push("navigation.md");
          } catch {
          }
          try {
            q.push("assets/navigation.md");
          } catch {
          }
          const D = [];
          for (const R of q) try {
            if (!R) continue;
            const B = String(R);
            D.includes(B) || D.push(B);
          } catch {
          }
          for (const R of D) {
            M.push(R);
            try {
              if (Je = await Qe(R, le, { force: !0 }), Je && Je.raw) {
                try {
                  w = R;
                } catch {
                }
                try {
                  x("[nimbi-cms] fetched navigation candidate", R, "contentBase=", le);
                } catch {
                }
                Be = await rr(Je.raw || "");
                try {
                  const B = it();
                  if (B && Be && Be.html) {
                    const O = B.parseFromString(Be.html, "text/html").querySelector("a");
                    if (O) try {
                      const K = O?.getAttribute?.("href") || "", U = mt(K);
                      try {
                        x("[nimbi-cms] parsed nav first-link href", K, "->", U);
                      } catch {
                      }
                      if (U?.page && (U.type === "path" || U.type === "canonical") && (U.page.includes(".") || U.page.includes("/"))) {
                        b = U.page;
                        try {
                          x("[nimbi-cms] derived homePage from navigation", b);
                        } catch {
                        }
                        break;
                      }
                    } catch {
                    }
                  }
                } catch {
                }
              }
            } catch {
            }
          }
        } catch {
        }
        try {
          x("[nimbi-cms] final homePage before slugManager setHomePage", b);
        } catch {
        }
        try {
          qo(b);
        } catch (M) {
          x("[nimbi-cms] setHomePage failed", M);
        }
        let v = !0;
        try {
          const M = mt(typeof location < "u" ? location.href : "");
          M && M.type === "cosmetic" && (typeof _ > "u" || _ == null) && (v = !1);
        } catch {
        }
        if (v && b) try {
          await Qe(b, le, { force: !0 });
        } catch (M) {
          throw new Error(`Required ${b} not found at ${le}${b}: ${M && M.message ? M.message : String(M)}`);
        }
      } catch (v) {
        throw v;
      }
      _c(f), await yc(d, me), bi = typeof window < "u" ? new AbortController() : { signal: { abort: () => {
      } } };
      const st = Yf({
        contentWrap: $,
        navWrap: Z,
        container: N,
        mountOverlay: re,
        t: Kn,
        contentBase: le,
        homePage: b,
        initialDocumentTitle: _i,
        runHooks: hs,
        allowEmbeddedScripts: A,
        signal: bi.signal
      });
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiUI = st, window.__nimbiRenderTimings || (window.__nimbiRenderTimings = []);
          } catch {
          }
          window.addEventListener("nimbi.coldRouteResolved", function(v) {
            st?.renderByQuery?.().catch((M) => {
              x?.("[nimbi-cms] renderByQuery failed for cold-route event", M);
            });
          }), (Array.isArray(window.__nimbiColdRouteResolved) ? window.__nimbiColdRouteResolved.slice() : null)?.length && (st?.renderByQuery?.().catch(() => {
          }), window.__nimbiColdRouteResolved = []);
        }
      } catch {
      }
      try {
        const v = document.createElement("header");
        v.className = "nimbi-site-navbar", ue.insertBefore(v, C);
        let M = Je, q = Be;
        q || (M = await Qe(w, le, { force: !0 }), q = await rr(M.raw || ""));
        const { navbar: D, linkEls: R } = await Gf(v, N, q.html || "", le, b, Kn, st.renderByQuery, ne, s, l, c, W, bi.signal);
        try {
          await hs("onNavBuild", {
            navWrap: Z,
            navbar: D,
            linkEls: R,
            contentBase: le
          });
        } catch (B) {
          x("[nimbi-cms] onNavBuild hooks failed", B);
        }
        try {
          try {
            if (R && R.length) {
              for (const B of Array.from(R || [])) try {
                const O = B?.getAttribute?.("href") || "";
                if (!O) continue;
                let K = String(O ?? "").split(/::|#/, 1)[0];
                if (K = String(K ?? "").split("?")[0], !K) continue;
                /\.(?:md|html?)$/.test(K) || (K = K + ".html");
                let U = null;
                try {
                  U = te(String(K ?? ""));
                } catch {
                  U = String(K ?? "");
                }
                const H = String(U ?? "").replace(/^.*\//, "").replace(/\?.*$/, "");
                if (!H) continue;
                try {
                  let G = null;
                  try {
                    G = we(H.replace(/\.(?:md|html?)$/i, ""));
                  } catch {
                    G = String(H ?? "").replace(/\s+/g, "-").toLowerCase();
                  }
                  if (!G) continue;
                  let ie = G;
                  try {
                    if (ee && typeof ee.has == "function" && ee.has(G)) {
                      const ge = ee.get(G);
                      let Pe = !1;
                      try {
                        if (typeof ge == "string")
                          ge === K && (Pe = !0);
                        else if (ge && typeof ge == "object") {
                          ge.default === K && (Pe = !0);
                          for (const Ce of Object.keys(ge.langs || {})) if (ge.langs[Ce] === K) {
                            Pe = !0;
                            break;
                          }
                        }
                      } catch {
                      }
                      if (!Pe) try {
                        ie = vn(G, new Set(ee.keys()));
                      } catch {
                        ie = G;
                      }
                    }
                  } catch {
                  }
                  try {
                    try {
                      wt(ie, U);
                    } catch {
                    }
                    try {
                      _e?.set?.(U, ie);
                    } catch {
                    }
                    try {
                      if (!Ye?.has?.(U)) try {
                        Ye?.add?.(U), Array.isArray(ut) && ut.push(U);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              } catch {
              }
              try {
                Jn(le);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let B = !1;
          try {
            const O = new URLSearchParams(location.search || "");
            (O.has("sitemap") || O.has("rss") || O.has("atom")) && (B = !0);
          } catch {
          }
          try {
            const O = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            O && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(O) && (B = !0);
          } catch {
          }
          if (B) try {
            try {
              const O = [];
              b && O.push(b), w && O.push(w);
              try {
                await jf({
                  contentBase: le,
                  indexDepth: Math.max(l || 1, 3),
                  noIndexing: c,
                  seedPaths: O.length ? O : void 0,
                  startBuild: !0,
                  timeoutMs: 1 / 0
                });
              } catch {
              }
            } catch {
            }
            try {
              if (_a && typeof Vr == "function" && await Vr({
                includeAllMarkdown: !0,
                homePage: b,
                navigationPage: w,
                notFoundPage: _,
                contentBase: le,
                indexDepth: l,
                noIndexing: c
              }))
                return;
            } catch {
            }
          } catch {
          }
          else if (z === !0 || typeof window < "u" && window.__nimbiExposeSitemap) try {
            if (_a && typeof Ha == "function") try {
              Ha({
                includeAllMarkdown: !0,
                homePage: b,
                navigationPage: w,
                notFoundPage: _,
                contentBase: le,
                indexDepth: l,
                noIndexing: c
              }).catch(() => {
              });
            } catch {
            }
          } catch {
          }
        } catch {
        }
        try {
          try {
            if (typeof Jn == "function") try {
              Jn(le);
              try {
                try {
                  bn("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({
                    slugToMdSize: typeof ee?.size == "number" ? ee?.size : void 0,
                    allMarkdownPathsLength: Array.isArray(ut) ? ut.length : void 0,
                    allMarkdownPathsSetSize: typeof Ye?.size == "number" ? Ye?.size : void 0
                  }));
                } catch {
                }
              } catch {
              }
              try {
                const O = typeof ee?.size == "number" ? ee?.size : 0;
                let K = !1;
                try {
                  if (!manifest) {
                    O < 30 && (K = !0);
                    try {
                      const U = mt(typeof location < "u" ? location.href : "");
                      if (U) {
                        if (U.type === "cosmetic" && U.page) try {
                          ee.has(U.page) || (K = !0);
                        } catch {
                        }
                        else if ((U.type === "path" || U.type === "canonical") && U.page) try {
                          const H = te(U.page);
                          !_e?.has?.(H) && !Ye?.has?.(H) && (K = !0);
                        } catch {
                        }
                      }
                    } catch {
                    }
                  }
                } catch {
                }
                if (K) {
                  let U = null;
                  try {
                    U = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                  } catch {
                    U = null;
                  }
                  if (Array.isArray(U) && U.length) {
                    let H = 0;
                    for (const G of U) try {
                      if (!G || !G.slug) continue;
                      const ie = String(G.slug).split("::")[0];
                      if (ee.has(ie)) continue;
                      let ge = G.sourcePath || G.path || null;
                      if (!ge && Array.isArray(U)) {
                        const Ce = (U || []).find((Ie) => Ie && Ie.slug === G.slug);
                        Ce && Ce.path && (ge = Ce.path);
                      }
                      if (!ge) continue;
                      try {
                        ge = String(ge);
                      } catch {
                        continue;
                      }
                      let Pe = null;
                      try {
                        const Ce = le && typeof le == "string" ? le : typeof location < "u" && location.origin ? location.origin + "/" : "";
                        try {
                          const Ie = new URL(ge, Ce), ve = new URL(Ce);
                          if (Ie.origin === ve.origin) {
                            const qe = ve.pathname || "/";
                            let Ue = Ie.pathname || "";
                            Ue.startsWith(qe) && (Ue = Ue.slice(qe.length)), Ue.startsWith("/") && (Ue = Ue.slice(1)), Pe = te(Ue);
                          } else Pe = te(Ie.pathname || "");
                        } catch {
                          Pe = te(ge);
                        }
                      } catch {
                        Pe = te(ge);
                      }
                      if (!Pe) continue;
                      Pe = String(Pe).split(/[?#]/)[0], Pe = te(Pe);
                      try {
                        wt(ie, Pe);
                      } catch {
                      }
                      H++;
                    } catch {
                    }
                    if (H) {
                      try {
                        bn("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({
                          added: H,
                          total: typeof ee?.size == "number" ? ee?.size : void 0
                        }));
                      } catch {
                      }
                      try {
                        Jn(le);
                      } catch {
                      }
                      try {
                        typeof window < "u" && window.__nimbiUI && typeof window.__nimbiUI.renderByQuery == "function" && window.__nimbiUI.renderByQuery().catch(() => {
                        });
                      } catch {
                      }
                    }
                  }
                }
              } catch {
              }
            } catch (O) {
              x("[nimbi-cms] refreshIndexPaths after nav build failed", O);
            }
          } catch {
          }
          const B = () => {
            const O = v?.getBoundingClientRect && Math.round(v.getBoundingClientRect().height) || v?.offsetHeight || 0;
            if (O > 0) {
              try {
                ue.style.setProperty("--nimbi-site-navbar-height", `${O}px`);
              } catch (K) {
                x("[nimbi-cms] set CSS var failed", K);
              }
              try {
                N.style.paddingTop = "";
              } catch (K) {
                x("[nimbi-cms] set container paddingTop failed", K);
              }
              try {
                const K = ue?.getBoundingClientRect && Math.round(ue.getBoundingClientRect().height) || ue?.clientHeight || 0;
                if (K > 0) {
                  const U = Math.max(0, K - O);
                  try {
                    N.style.setProperty("--nimbi-cms-height", `${U}px`);
                  } catch (H) {
                    x("[nimbi-cms] set --nimbi-cms-height failed", H);
                  }
                } else try {
                  N.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                } catch (U) {
                  x("[nimbi-cms] set --nimbi-cms-height failed", U);
                }
              } catch (K) {
                x("[nimbi-cms] compute container height failed", K);
              }
              try {
                v.style.setProperty("--nimbi-site-navbar-height", `${O}px`);
              } catch (K) {
                x("[nimbi-cms] set navbar CSS var failed", K);
              }
            }
          };
          B();
          try {
            if (typeof ResizeObserver < "u") {
              const O = new ResizeObserver(() => B());
              try {
                O.observe(v);
              } catch (K) {
                x("[nimbi-cms] ResizeObserver.observe failed", K);
              }
            }
          } catch (O) {
            x("[nimbi-cms] ResizeObserver setup failed", O);
          }
        } catch (B) {
          x("[nimbi-cms] compute navbar height failed", B);
        }
      } catch (v) {
        x("[nimbi-cms] build navigation failed", v);
      }
      try {
        const v = "1.1.0", M = (B) => {
          const O = document.createElement("a");
          O.className = "nimbi-version-label tag is-small", O.textContent = `nimbiCMS v. ${v}`, O.href = B || "#", O.target = "_blank", O.rel = "noopener noreferrer nofollow", O.setAttribute("aria-label", `nimbiCMS version ${v}`), O.classList.add("is-hidden");
          try {
            Co(O);
          } catch {
          }
          try {
            ue.appendChild(O);
            const K = () => {
              try {
                O.classList.remove("is-hidden");
              } catch {
              }
            };
            try {
              setTimeout(K, 3e3);
            } catch {
              K();
            }
          } catch (K) {
            x("[nimbi-cms] append version label failed", K);
          }
        }, q = "https://abelvm.github.io/nimbiCMS/", D = (() => {
          try {
            return new URL(q).toString();
          } catch {
          }
          return "#";
        })(), R = () => {
          try {
            M(D);
          } catch (B) {
            x("[nimbi-cms] building version label failed", B);
          }
        };
        try {
          let B = !1;
          const O = () => {
            B || (B = !0, R());
          }, K = (U) => {
            try {
              window.addEventListener(U, O, {
                once: !0,
                passive: !0
              });
            } catch {
              try {
                window.addEventListener(U, O, { once: !0 });
              } catch {
              }
            }
          };
          K("pointerdown"), K("keydown"), K("touchstart"), K("wheel");
        } catch (B) {
          x("[nimbi-cms] version label defer failed", B), R();
        }
      } catch (v) {
        x("[nimbi-cms] version label setup failed", v);
      }
    })();
  } catch (C) {
    throw ae(C), C;
  }
}
async function pd() {
  try {
    if ("1.1.0".trim()) return "1.1.0";
  } catch {
  }
  return "0.0.0";
}
export {
  To as BAD_LANGUAGES,
  ze as SUPPORTED_HLJS_MAP,
  rd as _clearHooks,
  Ga as addHook,
  dd as default,
  yc as ensureBulma,
  pd as getVersion,
  dd as initCMS,
  Po as loadL10nFile,
  Ro as loadSupportedLanguages,
  ac as observeCodeBlocks,
  td as onNavBuild,
  ed as onPageLoad,
  Wr as registerLanguage,
  hs as runHooks,
  id as setHighlightTheme,
  No as setLang,
  _c as setStyle,
  sd as setThemeVars,
  Kn as t,
  nd as transformHtml
};
