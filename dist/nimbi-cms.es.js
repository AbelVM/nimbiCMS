import { i as y, n as Fi, r as ls, t as _o } from "./rolldown-runtime-DpDu0lQI.js";
function Pl(e, t = "ERR_ITEM") {
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
function cs(e) {
  return !e || !e.error ? String(e) : `${e.code || "ERR"}: ${e.message || ""}`;
}
var Ri = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
  const e = Number(process.hrtime.bigint() / 1000000n);
  Ri = Date.now() - e;
} catch {
  Ri = null;
}
var $e = () => {
  const e = Date.now();
  if (typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number") try {
    const t = performance.timeOrigin + performance.now();
    return Math.abs(t - e) < 1e3 ? t : e;
  } catch {
  }
  if (Ri != null) try {
    const t = Number(process.hrtime.bigint() / 1000000n) + Ri;
    return Math.abs(t - e) < 1e3 ? t : e;
  } catch {
    return e;
  }
  return e;
}, Xn = Object.freeze({
  error: "error",
  warn: "warn",
  info: "info",
  log: "log",
  debug: "debug",
  table: "table"
}), Il = () => typeof globalThis < "u" && globalThis?.console ? globalThis.console : typeof self < "u" && self?.console ? self.console : typeof window < "u" && window?.console ? window.console : typeof global < "u" && global?.console ? global.console : null, Ht = Il();
function Nl(e) {
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
var bo = class {
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
          typeof Ht?.[t] == "function" && Ht[t](s);
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
    if (typeof Ht?.[t] == "function")
      if (this._format === "json") try {
        const s = typeof o == "string" ? o : Nl(o);
        Ht[t](s);
      } catch {
        try {
          Ht[t](...Array.isArray(a) ? a : [a]);
        } catch {
        }
      }
      else Ht[t](...a);
  }
  error(...e) {
    const t = e.map((n) => {
      try {
        if (n?.error) return cs(n);
        if (n instanceof Error || n && typeof n == "object") return cs(Pl(n));
      } catch {
      }
      return n;
    });
    this._emit(1, "error", Xn.error, t);
  }
  warn(...e) {
    this._emit(2, "warn", Xn.warn, e);
  }
  info(...e) {
    this._emit(3, "info", Xn.info, e);
  }
  log(...e) {
    this._emit(3, "log", Xn.log, e);
  }
  debug(...e) {
    this._emit(3, "debug", Xn.debug, e);
  }
  table(...e) {
    if (!this.isDebugLevel(3) || !Ht) return;
    if (this._format === "json") {
      this._emit(3, "log", Xn.table, e, { msgArray: !0 });
      return;
    }
    const t = this._resolveLogArgs(e);
    typeof Ht.table == "function" ? Ht.table(...t) : typeof Ht.log == "function" && Ht.log(...t);
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
}, Rn = new bo(0);
function Ol(e) {
  Rn.setDebugLevel(e);
}
function wo(e = 1) {
  return Rn.isDebugLevel(e);
}
function ko() {
  return Rn.isDebug();
}
function Rr(...e) {
  Rn.error(...e);
}
function S(...e) {
  Rn.warn(...e);
}
function wn(...e) {
  Rn.info(...e);
}
function pe(...e) {
  Rn.log(...e);
}
function xo(e) {
  Rn.incrementCounter(e);
}
var Br = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function qa(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Br, e)) throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function") throw new TypeError("hook callback must be a function");
  Br[e].push(t);
}
function Vf(e) {
  qa("onPageLoad", e);
}
function Zf(e) {
  qa("onNavBuild", e);
}
function Xf(e) {
  qa("transformHtml", e);
}
async function us(e, t) {
  const n = Br[e] || [];
  for (const r of n) try {
    await r(t);
  } catch (i) {
    try {
      S("[nimbi-cms] runHooks callback failed", i);
    } catch {
    }
  }
}
function Yf() {
  Object.keys(Br).forEach((e) => {
    Br[e].length = 0;
  });
}
var zl = /* @__PURE__ */ _o(((e, t) => {
  function n(v) {
    return v instanceof Map ? v.clear = v.delete = v.set = function() {
      throw new Error("map is read-only");
    } : v instanceof Set && (v.add = v.clear = v.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(v), Object.getOwnPropertyNames(v).forEach((X) => {
      const de = v[X], Re = typeof de;
      (Re === "object" || Re === "function") && !Object.isFrozen(de) && n(de);
    }), v;
  }
  var r = class {
    constructor(v) {
      v.data === void 0 && (v.data = {}), this.data = v.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  };
  function i(v) {
    return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function a(v, ...X) {
    const de = /* @__PURE__ */ Object.create(null);
    for (const Re in v) de[Re] = v[Re];
    return X.forEach(function(Re) {
      for (const Fe in Re) de[Fe] = Re[Fe];
    }), de;
  }
  var o = "</span>", s = (v) => !!v.scope, l = (v, { prefix: X }) => {
    if (v.startsWith("language:")) return v.replace("language:", "language-");
    if (v.includes(".")) {
      const de = v.split(".");
      return [`${X}${de.shift()}`, ...de.map((Re, Fe) => `${Re}${"_".repeat(Fe + 1)}`)].join(" ");
    }
    return `${X}${v}`;
  }, c = class {
    constructor(v, X) {
      this.buffer = "", this.classPrefix = X.classPrefix, v.walk(this);
    }
    addText(v) {
      this.buffer += i(v);
    }
    openNode(v) {
      if (!s(v)) return;
      const X = l(v.scope, { prefix: this.classPrefix });
      this.span(X);
    }
    closeNode(v) {
      s(v) && (this.buffer += o);
    }
    value() {
      return this.buffer;
    }
    span(v) {
      this.buffer += `<span class="${v}">`;
    }
  }, u = (v = {}) => {
    const X = { children: [] };
    return Object.assign(X, v), X;
  }, d = class So {
    constructor() {
      this.rootNode = u(), this.stack = [this.rootNode];
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
      const de = u({ scope: X });
      this.add(de), this.stack.push(de);
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
    static _walk(X, de) {
      return typeof de == "string" ? X.addText(de) : de.children && (X.openNode(de), de.children.forEach((Re) => this._walk(X, Re)), X.closeNode(de)), X;
    }
    static _collapse(X) {
      typeof X != "string" && X.children && (X.children.every((de) => typeof de == "string") ? X.children = [X.children.join("")] : X.children.forEach((de) => {
        So._collapse(de);
      }));
    }
  }, f = class extends d {
    constructor(v) {
      super(), this.options = v;
    }
    addText(v) {
      v !== "" && this.add(v);
    }
    startScope(v) {
      this.openNode(v);
    }
    endScope() {
      this.closeNode();
    }
    __addSublanguage(v, X) {
      const de = v.root;
      X && (de.scope = `language:${X}`), this.add(de);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  };
  function p(v) {
    return v ? typeof v == "string" ? v : v.source : null;
  }
  function m(v) {
    return h("(?=", v, ")");
  }
  function g(v) {
    return h("(?:", v, ")*");
  }
  function _(v) {
    return h("(?:", v, ")?");
  }
  function h(...v) {
    return v.map((X) => p(X)).join("");
  }
  function w(v) {
    const X = v[v.length - 1];
    return typeof X == "object" && X.constructor === Object ? (v.splice(v.length - 1, 1), X) : {};
  }
  function b(...v) {
    return "(" + (w(v).capture ? "" : "?:") + v.map((X) => p(X)).join("|") + ")";
  }
  function k(v) {
    return new RegExp(v.toString() + "|").exec("").length - 1;
  }
  function E(v, X) {
    const de = v && v.exec(X);
    return de && de.index === 0;
  }
  var z = new RegExp(b(/\[(?:[^\\\]]|\\.)*\]/, /\(\?<(?![=!])[^>]+>/, /\(\?'[^']+'/, /\(\??/, /\\([1-9][0-9]*)/, /\\./));
  function W(v, { joinWith: X }) {
    let de = 0;
    return v.map((Re) => {
      de += 1;
      const Fe = de;
      let Ve = p(Re), _e = "";
      for (; Ve.length > 0; ) {
        const ge = z.exec(Ve);
        if (!ge) {
          _e += Ve;
          break;
        }
        _e += Ve.substring(0, ge.index), Ve = Ve.substring(ge.index + ge[0].length), ge[0][0] === "\\" && ge[1] ? _e += "\\" + String(Number(ge[1]) + Fe) : (_e += ge[0], (ge[0] === "(" || /^\(\?[<']/.test(ge[0])) && de++);
      }
      return _e;
    }).map((Re) => `(${Re})`).join(X);
  }
  var F = /\b\B/, K = "[a-zA-Z]\\w*", se = "[a-zA-Z_]\\w*", he = "\\b\\d+(\\.\\d+)?", ie = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", C = "\\b(0b[01]+)", I = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", j = (v = {}) => {
    const X = /^#![ ]*\//;
    return v.binary && (v.begin = h(X, /.*\b/, v.binary, /\b.*/)), a({
      scope: "meta",
      begin: X,
      end: /$/,
      relevance: 0,
      "on:begin": (de, Re) => {
        de.index !== 0 && Re.ignoreMatch();
      }
    }, v);
  }, T = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, N = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, Y = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, $ = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, ne = function(v, X, de = {}) {
    const Re = a({
      scope: "comment",
      begin: v,
      end: X,
      contains: []
    }, de);
    Re.contains.push({
      scope: "doctag",
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Fe = b("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
    return Re.contains.push({ begin: h(/[ ]+/, "(", Fe, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), Re;
  }, le = ne("//", "$"), ye = ne("/\\*", "\\*/"), fe = ne("#", "$"), ve = {
    scope: "number",
    begin: he,
    relevance: 0
  }, De = {
    scope: "number",
    begin: ie,
    relevance: 0
  }, ce = {
    scope: "number",
    begin: C,
    relevance: 0
  }, Be = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [T, {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [T]
    }]
  }, et = {
    scope: "title",
    begin: K,
    relevance: 0
  }, ot = {
    scope: "title",
    begin: se,
    relevance: 0
  }, A = {
    begin: "\\.\\s*[a-zA-Z_]\\w*",
    relevance: 0
  }, M = function(v) {
    return Object.assign(v, {
      "on:begin": (X, de) => {
        de.data._beginMatch = X[1];
      },
      "on:end": (X, de) => {
        de.data._beginMatch !== X[1] && de.ignoreMatch();
      }
    });
  }, H = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: N,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: ce,
    BINARY_NUMBER_RE: C,
    COMMENT: ne,
    C_BLOCK_COMMENT_MODE: ye,
    C_LINE_COMMENT_MODE: le,
    C_NUMBER_MODE: De,
    C_NUMBER_RE: ie,
    END_SAME_AS_BEGIN: M,
    HASH_COMMENT_MODE: fe,
    IDENT_RE: K,
    MATCH_NOTHING_RE: F,
    METHOD_GUARD: A,
    NUMBER_MODE: ve,
    NUMBER_RE: he,
    PHRASAL_WORDS_MODE: $,
    QUOTE_STRING_MODE: Y,
    REGEXP_MODE: Be,
    RE_STARTERS_RE: I,
    SHEBANG: j,
    TITLE_MODE: et,
    UNDERSCORE_IDENT_RE: se,
    UNDERSCORE_TITLE_MODE: ot
  });
  function D(v, X) {
    v.input[v.index - 1] === "." && X.ignoreMatch();
  }
  function L(v, X) {
    v.className !== void 0 && (v.scope = v.className, delete v.className);
  }
  function B(v, X) {
    X && v.beginKeywords && (v.begin = "\\b(" + v.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", v.__beforeBegin = D, v.keywords = v.keywords || v.beginKeywords, delete v.beginKeywords, v.relevance === void 0 && (v.relevance = 0));
  }
  function O(v, X) {
    Array.isArray(v.illegal) && (v.illegal = b(...v.illegal));
  }
  function J(v, X) {
    if (v.match) {
      if (v.begin || v.end) throw new Error("begin & end are not supported with match");
      v.begin = v.match, delete v.match;
    }
  }
  function U(v, X) {
    v.relevance === void 0 && (v.relevance = 1);
  }
  var G = (v, X) => {
    if (!v.beforeMatch) return;
    if (v.starts) throw new Error("beforeMatch cannot be used with starts");
    const de = Object.assign({}, v);
    Object.keys(v).forEach((Re) => {
      delete v[Re];
    }), v.keywords = de.keywords, v.begin = h(de.beforeMatch, m(de.begin)), v.starts = {
      relevance: 0,
      contains: [Object.assign(de, { endsParent: !0 })]
    }, v.relevance = 0, delete de.beforeMatch;
  }, V = [
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
  ], ae = "keyword";
  function me(v, X, de = ae) {
    const Re = /* @__PURE__ */ Object.create(null);
    return typeof v == "string" ? Fe(de, v.split(" ")) : Array.isArray(v) ? Fe(de, v) : Object.keys(v).forEach(function(Ve) {
      Object.assign(Re, me(v[Ve], X, Ve));
    }), Re;
    function Fe(Ve, _e) {
      X && (_e = _e.map((ge) => ge.toLowerCase())), _e.forEach(function(ge) {
        const Te = ge.split("|");
        Re[Te[0]] = [Ve, Pe(Te[0], Te[1])];
      });
    }
  }
  function Pe(v, X) {
    return X ? Number(X) : Ce(v) ? 0 : 1;
  }
  function Ce(v) {
    return V.includes(v.toLowerCase());
  }
  var Ne = {}, Ae = (v) => {
    console.error(v);
  }, He = (v, ...X) => {
    console.log(`WARN: ${v}`, ...X);
  }, Ue = (v, X) => {
    Ne[`${v}/${X}`] || (console.log(`Deprecated as of ${v}. ${X}`), Ne[`${v}/${X}`] = !0);
  }, Ft = /* @__PURE__ */ new Error();
  function Ln(v, X, { key: de }) {
    let Re = 0;
    const Fe = v[de], Ve = {}, _e = {};
    for (let ge = 1; ge <= X.length; ge++)
      _e[ge + Re] = Fe[ge], Ve[ge + Re] = !0, Re += k(X[ge - 1]);
    v[de] = _e, v[de]._emit = Ve, v[de]._multi = !0;
  }
  function Hn(v) {
    if (Array.isArray(v.begin)) {
      if (v.skip || v.excludeBegin || v.returnBegin)
        throw Ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ft;
      if (typeof v.beginScope != "object" || v.beginScope === null)
        throw Ae("beginScope must be object"), Ft;
      Ln(v, v.begin, { key: "beginScope" }), v.begin = W(v.begin, { joinWith: "" });
    }
  }
  function or(v) {
    if (Array.isArray(v.end)) {
      if (v.skip || v.excludeEnd || v.returnEnd)
        throw Ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ft;
      if (typeof v.endScope != "object" || v.endScope === null)
        throw Ae("endScope must be object"), Ft;
      Ln(v, v.end, { key: "endScope" }), v.end = W(v.end, { joinWith: "" });
    }
  }
  function ln(v) {
    v.scope && typeof v.scope == "object" && v.scope !== null && (v.beginScope = v.scope, delete v.scope);
  }
  function Gn(v) {
    ln(v), typeof v.beginScope == "string" && (v.beginScope = { _wrap: v.beginScope }), typeof v.endScope == "string" && (v.endScope = { _wrap: v.endScope }), Hn(v), or(v);
  }
  function Vn(v) {
    function X(_e, ge) {
      return new RegExp(p(_e), "m" + (v.case_insensitive ? "i" : "") + (v.unicodeRegex ? "u" : "") + (ge ? "g" : ""));
    }
    class de {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      addRule(ge, Te) {
        Te.position = this.position++, this.matchIndexes[this.matchAt] = Te, this.regexes.push([Te, ge]), this.matchAt += k(ge) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ge = this.regexes.map((Te) => Te[1]);
        this.matcherRe = X(W(ge, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      exec(ge) {
        this.matcherRe.lastIndex = this.lastIndex;
        const Te = this.matcherRe.exec(ge);
        if (!Te) return null;
        const st = Te.findIndex((cn, Mn) => Mn > 0 && cn !== void 0), Je = this.matchIndexes[st];
        return Te.splice(0, st), Object.assign(Te, Je);
      }
    }
    class Re {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      getMatcher(ge) {
        if (this.multiRegexes[ge]) return this.multiRegexes[ge];
        const Te = new de();
        return this.rules.slice(ge).forEach(([st, Je]) => Te.addRule(st, Je)), Te.compile(), this.multiRegexes[ge] = Te, Te;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      addRule(ge, Te) {
        this.rules.push([ge, Te]), Te.type === "begin" && this.count++;
      }
      exec(ge) {
        const Te = this.getMatcher(this.regexIndex);
        Te.lastIndex = this.lastIndex;
        let st = Te.exec(ge);
        if (this.resumingScanAtSamePosition() && !(st && st.index === this.lastIndex)) {
          const Je = this.getMatcher(0);
          Je.lastIndex = this.lastIndex + 1, st = Je.exec(ge);
        }
        return st && (this.regexIndex += st.position + 1, this.regexIndex === this.count && this.considerAll()), st;
      }
    }
    function Fe(_e) {
      const ge = new Re();
      return _e.contains.forEach((Te) => ge.addRule(Te.begin, {
        rule: Te,
        type: "begin"
      })), _e.terminatorEnd && ge.addRule(_e.terminatorEnd, { type: "end" }), _e.illegal && ge.addRule(_e.illegal, { type: "illegal" }), ge;
    }
    function Ve(_e, ge) {
      const Te = _e;
      if (_e.isCompiled) return Te;
      [
        L,
        J,
        Gn,
        G
      ].forEach((Je) => Je(_e, ge)), v.compilerExtensions.forEach((Je) => Je(_e, ge)), _e.__beforeBegin = null, [
        B,
        O,
        U
      ].forEach((Je) => Je(_e, ge)), _e.isCompiled = !0;
      let st = null;
      return typeof _e.keywords == "object" && _e.keywords.$pattern && (_e.keywords = Object.assign({}, _e.keywords), st = _e.keywords.$pattern, delete _e.keywords.$pattern), st = st || /\w+/, _e.keywords && (_e.keywords = me(_e.keywords, v.case_insensitive)), Te.keywordPatternRe = X(st, !0), ge && (_e.begin || (_e.begin = /\B|\b/), Te.beginRe = X(Te.begin), !_e.end && !_e.endsWithParent && (_e.end = /\B|\b/), _e.end && (Te.endRe = X(Te.end)), Te.terminatorEnd = p(Te.end) || "", _e.endsWithParent && ge.terminatorEnd && (Te.terminatorEnd += (_e.end ? "|" : "") + ge.terminatorEnd)), _e.illegal && (Te.illegalRe = X(_e.illegal)), _e.contains || (_e.contains = []), _e.contains = [].concat(..._e.contains.map(function(Je) {
        return ti(Je === "self" ? _e : Je);
      })), _e.contains.forEach(function(Je) {
        Ve(Je, Te);
      }), _e.starts && Ve(_e.starts, ge), Te.matcher = Fe(Te), Te;
    }
    if (v.compilerExtensions || (v.compilerExtensions = []), v.contains && v.contains.includes("self")) throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return v.classNameAliases = a(v.classNameAliases || {}), Ve(v);
  }
  function lr(v) {
    return v ? v.endsWithParent || lr(v.starts) : !1;
  }
  function ti(v) {
    return v.variants && !v.cachedVariants && (v.cachedVariants = v.variants.map(function(X) {
      return a(v, { variants: null }, X);
    })), v.cachedVariants ? v.cachedVariants : lr(v) ? a(v, { starts: v.starts ? a(v.starts) : null }) : Object.isFrozen(v) ? a(v) : v;
  }
  var ni = "11.12.0", cr = class extends Error {
    constructor(v, X) {
      super(v), this.name = "HTMLInjectionError", this.html = X;
    }
  }, Cn = i, en = a, tn = /* @__PURE__ */ Symbol("nomatch"), ri = 7, ur = function(v) {
    const X = /* @__PURE__ */ Object.create(null), de = /* @__PURE__ */ Object.create(null), Re = [];
    let Fe = !0;
    const Ve = "Could not find the language '{}', did you forget to load/include a language module?", _e = {
      disableAutodetect: !0,
      name: "Plain text",
      contains: []
    };
    let ge = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      __emitter: f
    };
    function Te(ee) {
      return ge.noHighlightRe.test(ee);
    }
    function st(ee) {
      let xe = ee.className + " ";
      xe += ee.parentNode ? ee.parentNode.className : "";
      const Ie = ge.languageDetectRe.exec(xe);
      if (Ie) {
        const Ze = Zt(Ie[1]);
        return Ze || (He(Ve.replace("{}", Ie[1])), He("Falling back to no-highlight mode for this block.", ee)), Ze ? Ie[1] : "no-highlight";
      }
      return xe.split(/\s+/).find((Ze) => Te(Ze) || Zt(Ze));
    }
    function Je(ee, xe, Ie) {
      let Ze = "", nt = "";
      typeof xe == "object" ? (Ze = ee, Ie = xe.ignoreIllegals, nt = xe.language) : (Ue("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ue("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), nt = ee, Ze = xe), Ie === void 0 && (Ie = !0);
      const jt = {
        code: Ze,
        language: nt
      };
      rn("before:highlight", jt);
      const Et = jt.result ? jt.result : cn(jt.language, jt.code, Ie);
      return Et.code = jt.code, rn("after:highlight", Et), Et;
    }
    function cn(ee, xe, Ie, Ze) {
      const nt = /* @__PURE__ */ Object.create(null);
      function jt(P, q) {
        return P.keywords[q];
      }
      function Et() {
        if (!je.keywords) {
          rt.addText(Ge);
          return;
        }
        let P = 0;
        je.keywordPatternRe.lastIndex = 0;
        let q = je.keywordPatternRe.exec(Ge), ue = "";
        for (; q; ) {
          ue += Ge.substring(P, q.index);
          const we = Bt.case_insensitive ? q[0].toLowerCase() : q[0], Me = jt(je, we);
          if (Me) {
            const [it, St] = Me;
            if (rt.addText(ue), ue = "", nt[we] = (nt[we] || 0) + 1, nt[we] <= ri && (Q += St), it.startsWith("_")) ue += q[0];
            else {
              const dn = Bt.classNameAliases[it] || it;
              qt(q[0], dn);
            }
          } else ue += q[0];
          P = je.keywordPatternRe.lastIndex, q = je.keywordPatternRe.exec(Ge);
        }
        ue += Ge.substring(P), rt.addText(ue);
      }
      function Rt() {
        if (Ge === "") return;
        let P = null;
        if (typeof je.subLanguage == "string") {
          if (!X[je.subLanguage]) {
            rt.addText(Ge);
            return;
          }
          P = cn(je.subLanguage, Ge, !0, mr[je.subLanguage]), mr[je.subLanguage] = P._top;
        } else P = hr(Ge, je.subLanguage.length ? je.subLanguage : null);
        je.relevance > 0 && (Q += P.relevance), rt.__addSublanguage(P._emitter, P.language);
      }
      function bt() {
        je.subLanguage != null ? Rt() : Et(), Ge = "";
      }
      function qt(P, q) {
        P !== "" && (rt.startScope(q), rt.addText(P), rt.endScope());
      }
      function hn(P, q) {
        let ue = 1;
        const we = q.length - 1;
        for (; ue <= we; ) {
          if (!P._emit[ue]) {
            ue++;
            continue;
          }
          const Me = Bt.classNameAliases[P[ue]] || P[ue], it = q[ue];
          Me ? qt(it, Me) : (Ge = it, Et(), Ge = ""), ue++;
        }
      }
      function Lt(P, q) {
        return P.scope && typeof P.scope == "string" && rt.openNode(Bt.classNameAliases[P.scope] || P.scope), P.beginScope && (P.beginScope._wrap ? (qt(Ge, Bt.classNameAliases[P.beginScope._wrap] || P.beginScope._wrap), Ge = "") : P.beginScope._multi && (hn(P.beginScope, q), Ge = "")), je = Object.create(P, { parent: { value: je } }), je;
      }
      function ui(P, q, ue) {
        let we = E(P.endRe, ue);
        if (we) {
          if (P["on:end"]) {
            const Me = new r(P);
            P["on:end"](q, Me), Me.isMatchIgnored && (we = !1);
          }
          if (we) {
            for (; P.endsParent && P.parent; ) P = P.parent;
            return P;
          }
        }
        if (P.endsWithParent) return ui(P.parent, q, ue);
      }
      function Zn(P) {
        return je.matcher.regexIndex === 0 ? (Ge += P[0], 1) : (Z = !0, 0);
      }
      function Ki(P) {
        const q = P[0], ue = P.rule, we = new r(ue), Me = [ue.__beforeBegin, ue["on:begin"]];
        for (const it of Me)
          if (it && (it(P, we), we.isMatchIgnored))
            return Zn(q);
        return ue.skip ? Ge += q : (ue.excludeBegin && (Ge += q), bt(), !ue.returnBegin && !ue.excludeBegin && (Ge = q)), Lt(ue, P), ue.returnBegin ? 0 : q.length;
      }
      function hi(P) {
        const q = P[0], ue = xe.substring(P.index), we = ui(je, P, ue);
        if (!we) return tn;
        const Me = je;
        je.endScope && je.endScope._wrap ? (bt(), qt(q, je.endScope._wrap)) : je.endScope && je.endScope._multi ? (bt(), hn(je.endScope, P)) : Me.skip ? Ge += q : (Me.returnEnd || Me.excludeEnd || (Ge += q), bt(), Me.excludeEnd && (Ge = q));
        do
          je.scope && rt.closeNode(), !je.skip && !je.subLanguage && (Q += je.relevance), je = je.parent;
        while (je !== we.parent);
        return we.starts && Lt(we.starts, P), Me.returnEnd ? 0 : q.length;
      }
      function fn() {
        const P = [];
        for (let q = je; q !== Bt; q = q.parent) q.scope && P.unshift(q.scope);
        P.forEach((q) => rt.openNode(q));
      }
      let Nn = {};
      function pr(P, q) {
        const ue = q && q[0];
        if (Ge += P, ue == null)
          return bt(), 0;
        if (Nn.type === "begin" && q.type === "end" && Nn.index === q.index && ue === "") {
          if (Ge += xe.slice(q.index, q.index + 1), !Fe) {
            const we = /* @__PURE__ */ new Error(`0 width match regex (${ee})`);
            throw we.languageName = ee, we.badRule = Nn.rule, we;
          }
          return 1;
        }
        if (Nn = q, q.type === "begin") return Ki(q);
        if (q.type === "illegal" && !Ie) {
          const we = /* @__PURE__ */ new Error('Illegal lexeme "' + ue + '" for mode "' + (je.scope || "<unnamed>") + '"');
          throw we.mode = je, we;
        } else if (q.type === "end") {
          const we = hi(q);
          if (we !== tn) return we;
        }
        if (q.type === "illegal" && ue === "")
          return q.index === xe.length || (Ge += `
`), 1;
        if (R > 1e5 && R > q.index * 3) throw /* @__PURE__ */ new Error("potential infinite loop, way more iterations than matches");
        return Ge += ue, ue.length;
      }
      const Bt = Zt(ee);
      if (!Bt)
        throw Ae(Ve.replace("{}", ee)), new Error('Unknown language: "' + ee + '"');
      const fi = Vn(Bt);
      let gr = "", je = Ze || fi;
      const mr = {}, rt = new ge.__emitter(ge);
      fn();
      let Ge = "", Q = 0, x = 0, R = 0, Z = !1;
      try {
        if (Bt.__emitTokens)
          Bt.__emitTokens(xe, rt);
        else {
          for (je.matcher.considerAll(); ; ) {
            R++, Z ? Z = !1 : je.matcher.considerAll(), je.matcher.lastIndex = x;
            const P = je.matcher.exec(xe);
            if (!P) break;
            const q = pr(xe.substring(x, P.index), P);
            x = P.index + q;
          }
          pr(xe.substring(x));
        }
        return rt.finalize(), gr = rt.toHTML(), {
          language: ee,
          value: gr,
          relevance: Q,
          illegal: !1,
          _emitter: rt,
          _top: je
        };
      } catch (P) {
        if (P.message && P.message.includes("Illegal")) return {
          language: ee,
          value: Cn(xe),
          illegal: !0,
          relevance: 0,
          _illegalBy: {
            message: P.message,
            index: x,
            context: xe.slice(x - 100, x + 100),
            mode: P.mode,
            resultSoFar: gr
          },
          _emitter: rt
        };
        if (Fe) return {
          language: ee,
          value: Cn(xe),
          illegal: !1,
          relevance: 0,
          errorRaised: P,
          _emitter: rt,
          _top: je
        };
        throw P;
      }
    }
    function Mn(ee) {
      const xe = {
        value: Cn(ee),
        illegal: !1,
        relevance: 0,
        _top: _e,
        _emitter: new ge.__emitter(ge)
      };
      return xe._emitter.addText(ee), xe;
    }
    function hr(ee, xe) {
      xe = xe || ge.languages || Object.keys(X);
      const Ie = Mn(ee), Ze = xe.filter(Zt).filter(li).map((Rt) => cn(Rt, ee, !1));
      Ze.unshift(Ie);
      const [nt, jt] = Ze.sort((Rt, bt) => {
        if (Rt.relevance !== bt.relevance) return bt.relevance - Rt.relevance;
        if (Rt.language && bt.language) {
          if (Zt(Rt.language).supersetOf === bt.language) return 1;
          if (Zt(bt.language).supersetOf === Rt.language) return -1;
        }
        return 0;
      }), Et = nt;
      return Et.secondBest = jt, Et;
    }
    function Pn(ee, xe, Ie) {
      const Ze = xe && de[xe] || Ie;
      ee.classList.add("hljs"), ee.classList.add(`language-${Ze}`);
    }
    function fr(ee) {
      let xe = null;
      const Ie = st(ee);
      if (Te(Ie)) return;
      if (rn("before:highlightElement", {
        el: ee,
        language: Ie
      }), ee.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", ee);
        return;
      }
      if (ee.children.length > 0 && (ge.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(ee)), ge.throwUnescapedHTML))
        throw new cr("One of your code blocks includes unescaped HTML.", ee.innerHTML);
      xe = ee;
      const Ze = xe.textContent, nt = Ie ? Je(Ze, {
        language: Ie,
        ignoreIllegals: !0
      }) : hr(Ze);
      ee.innerHTML = nt.value, ee.dataset.highlighted = "yes", Pn(ee, Ie, nt.language), ee.result = {
        language: nt.language,
        re: nt.relevance,
        relevance: nt.relevance
      }, nt.secondBest && (ee.secondBest = {
        language: nt.secondBest.language,
        relevance: nt.secondBest.relevance
      }), rn("after:highlightElement", {
        el: ee,
        result: nt,
        text: Ze
      });
    }
    function Yi(ee) {
      ge = en(ge, ee);
    }
    const tt = () => {
      In(), Ue("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function un() {
      In(), Ue("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ii = !1;
    function In() {
      function ee() {
        In();
      }
      if (document.readyState === "loading") {
        ii || window.addEventListener("DOMContentLoaded", ee, !1), ii = !0;
        return;
      }
      document.querySelectorAll(ge.cssSelector).forEach(fr);
    }
    function dr(ee, xe) {
      let Ie = null;
      try {
        Ie = xe(v);
      } catch (Ze) {
        if (Ae("Language definition for '{}' could not be registered.".replace("{}", ee)), Fe) Ae(Ze);
        else throw Ze;
        Ie = _e;
      }
      Ie.name || (Ie.name = ee), X[ee] = Ie, Ie.rawDefinition = xe.bind(null, v), Ie.aliases && oi(Ie.aliases, { languageName: ee });
    }
    function ai(ee) {
      delete X[ee];
      for (const xe of Object.keys(de)) de[xe] === ee && delete de[xe];
    }
    function si() {
      return Object.keys(X);
    }
    function Zt(ee) {
      return ee = (ee || "").toLowerCase(), X[ee] || X[de[ee]];
    }
    function oi(ee, { languageName: xe }) {
      typeof ee == "string" && (ee = [ee]), ee.forEach((Ie) => {
        de[Ie.toLowerCase()] = xe;
      });
    }
    function li(ee) {
      const xe = Zt(ee);
      return xe && !xe.disableAutodetect;
    }
    function Qi(ee) {
      ee["before:highlightBlock"] && !ee["before:highlightElement"] && (ee["before:highlightElement"] = (xe) => {
        ee["before:highlightBlock"](Object.assign({ block: xe.el }, xe));
      }), ee["after:highlightBlock"] && !ee["after:highlightElement"] && (ee["after:highlightElement"] = (xe) => {
        ee["after:highlightBlock"](Object.assign({ block: xe.el }, xe));
      });
    }
    function Xt(ee) {
      Qi(ee), Re.push(ee);
    }
    function ci(ee) {
      const xe = Re.indexOf(ee);
      xe !== -1 && Re.splice(xe, 1);
    }
    function rn(ee, xe) {
      const Ie = ee;
      Re.forEach(function(Ze) {
        Ze[Ie] && Ze[Ie](xe);
      });
    }
    function an(ee) {
      return Ue("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ue("10.7.0", "Please use highlightElement now."), fr(ee);
    }
    Object.assign(v, {
      highlight: Je,
      highlightAuto: hr,
      highlightAll: In,
      highlightElement: fr,
      highlightBlock: an,
      configure: Yi,
      initHighlighting: tt,
      initHighlightingOnLoad: un,
      registerLanguage: dr,
      unregisterLanguage: ai,
      listLanguages: si,
      getLanguage: Zt,
      registerAliases: oi,
      autoDetection: li,
      inherit: en,
      addPlugin: Xt,
      removePlugin: ci
    }), v.debugMode = function() {
      Fe = !1;
    }, v.safeMode = function() {
      Fe = !0;
    }, v.versionString = ni, v.regex = {
      concat: h,
      lookahead: m,
      either: b,
      optional: _,
      anyNumberOfTimes: g
    };
    for (const ee in H) typeof H[ee] == "object" && n(H[ee]);
    return Object.assign(v, H), v;
  }, nn = ur({});
  nn.newInstance = () => ur({}), t.exports = nn, nn.HighlightJS = nn, nn.default = nn;
})), $l = /* @__PURE__ */ y(zl()), Ye = $l.default, qi = 1e3, Dl = 60 * qi, wa = 30 * qi, Bl = 1e4, hs = 1e3;
var Ul = 60 * qi, Wl = 1e3, fs = Dl, Fl = 1e3, ql = 5e3, Zr = class {
  constructor({ maxEntries: e = 1 / 0, maxWeight: t = 1 / 0, weightFn: n = () => 1, defaultTTL: r = fs, maxPoolSize: i = Wl, rejectOversized: a = !1, onEvict: o = null, onExpire: s = null, initialPoolSize: l = 0, maxCleanupPerTick: c = 100, eagerCleanupOnRead: u = !1, defaultAsyncTimeout: d = wa } = {}) {
    if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
    this.maxEntries = e, this.maxWeight = t, this.weightFn = n, this.defaultTTL = r, this.maxPoolSize = i, this.rejectOversized = !!a, this.onEvict = typeof o == "function" ? o : null, this.onExpire = typeof s == "function" ? s : null, this.maxCleanupPerTick = Number.isFinite(+c) ? Math.max(1, +c) : 100, this.eagerCleanupOnRead = !!u, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
    for (let f = 0; f < Math.min(l || 0, this.maxPoolSize); f++) this._pool.push({
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
      set(f) {
        this._map = f;
      }
    }), Object.defineProperty(this, "head", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._head;
      },
      set(f) {
        this._head = f;
      }
    }), Object.defineProperty(this, "tail", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._tail;
      },
      set(f) {
        this._tail = f;
      }
    }), Object.defineProperty(this, "pool", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._pool;
      },
      set(f) {
        this._pool = f;
      }
    }), Object.defineProperty(this, "currentWeight", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._currentWeight;
      },
      set(f) {
        this._currentWeight = f;
      }
    }), Object.defineProperty(this, "hits", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._hits;
      },
      set(f) {
        this._hits = f;
      }
    }), Object.defineProperty(this, "misses", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._misses;
      },
      set(f) {
        this._misses = f;
      }
    }), Object.defineProperty(this, "evictions", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._evictions;
      },
      set(f) {
        this._evictions = f;
      }
    }), Object.defineProperty(this, "rejected", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._rejected;
      },
      set(f) {
        this._rejected = f;
      }
    }), Object.defineProperty(this, "expirations", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this._expirations;
      },
      set(f) {
        this._expirations = f;
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
    } catch (f) {
      return Promise.reject(f);
    }
    const c = Number.isFinite(Number(a)) ? Math.max(0, Math.floor(Number(a))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
    let u = l;
    if (Number.isFinite(c) && c > 0) {
      let f = null;
      u = new Promise((p, m) => {
        f = setTimeout(() => {
          try {
            m(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
          } catch {
          }
        }, c), l.then((g) => {
          try {
            clearTimeout(f);
          } catch {
          }
          p(g);
        }, (g) => {
          try {
            clearTimeout(f);
          } catch {
          }
          m(g);
        });
      });
    }
    const d = u.then((f) => {
      try {
        this.set(e, f, {
          ttl: n,
          weight: r
        });
      } catch {
      }
      return f;
    }).finally(() => {
      this._inflightPromises.delete(e);
    });
    return this._inflightPromises.set(e, d), d;
  }
  hasEqual(e, t, { ignoreExpiry: n = !1, seen: r = void 0 } = {}) {
    const i = this._fetchValidNode(e, { ignoreExpiry: n });
    if (!i) return !1;
    const a = i.value;
    return a === t ? !0 : typeof a != "object" || a === null || typeof t != "object" || t === null ? a === t : Qn(a, t, r);
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
    typeof e == "number" ? (t = e, n = this.maxCleanupPerTick) : (t = Number.isFinite(+e.interval) ? +e.interval : Math.max(qi, Math.min(this.defaultTTL || 6e4, fs)), n = Number.isFinite(+e.maxCleanupPerTick) ? Math.max(1, +e.maxCleanupPerTick) : this.maxCleanupPerTick), this.stopCleanup(), this._cleanupParams = {
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
function Qn(e, t, n = void 0, r = 0) {
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
    for (let s = 0; s < e.length; s++) if (!Qn(e[s], t[s], n, r + 1)) return !1;
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
      if (!t.has(s) || !Qn(l, t.get(s), n, r + 1)) return !1;
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
    const l = Array.from(t), c = new Array(l.length).fill(!1), u = /* @__PURE__ */ new Map();
    for (let m = 0; m < l.length; m++) u.set(l[m], m);
    const d = (m) => {
      try {
        return JSON.stringify(m, (g, _) => _ instanceof Date ? {
          __type: "Date",
          v: _.getTime()
        } : _ instanceof RegExp ? {
          __type: "RegExp",
          v: _.toString()
        } : typeof ArrayBuffer < "u" && ArrayBuffer.isView(_) ? {
          __type: "TypedArray",
          v: Array.from(new Uint8Array(_.buffer, _.byteOffset || 0, _.byteLength))
        } : typeof ArrayBuffer < "u" && _ instanceof ArrayBuffer ? {
          __type: "ArrayBuffer",
          v: Array.from(new Uint8Array(_))
        } : _);
      } catch {
        return null;
      }
    }, f = /* @__PURE__ */ new Map(), p = [];
    for (let m = 0; m < l.length; m++) {
      const g = d(l[m]);
      if (g == null) p.push(m);
      else {
        const _ = f.get(g);
        _ ? _.push(m) : f.set(g, [m]);
      }
    }
    for (const m of e) {
      const g = u.get(m);
      if (g !== void 0 && !c[g]) {
        c[g] = !0;
        continue;
      }
      const _ = d(m);
      let h = !1;
      if (_ != null) {
        const w = f.get(_) || [];
        for (const b of w)
          if (!c[b] && Qn(m, l[b], n, r + 1)) {
            c[b] = !0, h = !0;
            break;
          }
        if (h) continue;
      }
      for (let w = 0; w < l.length; w++)
        if (!c[w] && Qn(m, l[w], n, r + 1)) {
          c[w] = !0, h = !0;
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
    if (!Object.prototype.hasOwnProperty.call(t, l) || !Qn(e[l], t[l], n, r + 1)) return !1;
  }
  return !0;
}
var ar = class ka {
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
            const u = await l;
            try {
              i.cache.set(s, u, {
                ttl: n,
                weight: r
              });
            } catch {
            }
            return u;
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
      Object.setPrototypeOf(i, ka.prototype), i.constructor = ka;
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
}, Hl = class {
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
}, Gl = new Zr({ maxEntries: 500 }), di = new Hl(0), ea = 3e5;
async function Vl(e, t) {
  try {
    if (!e || ea > 0 && di.has(e)) return null;
    try {
      const n = await Gl.getOrSetAsync(e, async () => {
        const r = await t();
        if (r == null) throw new Error("importCache: loader returned null");
        return r;
      });
      return di.delete(e), n;
    } catch {
      return ea > 0 ? di.set(e, 1, ea) : di.delete(e), null;
    }
  } catch {
    return null;
  }
}
var Zl = /* @__PURE__ */ Object.assign({
  "../node_modules/highlight.js/lib/languages/1c.js": () => import("./1c-DHZ8mxbM.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/1c.js.js": () => import("./1c.js-m-UGQDoR.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/abnf.js": () => import("./abnf-CBfUwBtd.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/abnf.js.js": () => import("./abnf.js-DN3YA4tV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/accesslog.js": () => import("./accesslog-CniRminZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/accesslog.js.js": () => import("./accesslog.js-DX__-uZC.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/actionscript.js": () => import("./actionscript-DnCnS5sO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/actionscript.js.js": () => import("./actionscript.js-kMWjYR6A.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ada.js": () => import("./ada-Q3yMmWml.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ada.js.js": () => import("./ada.js-C5V9x4zS.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/angelscript.js": () => import("./angelscript-B9CdXZMv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/angelscript.js.js": () => import("./angelscript.js-DiRzLhpr.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/apache.js": () => import("./apache-CvkytByt.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/apache.js.js": () => import("./apache.js-DTqwd1n9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/applescript.js": () => import("./applescript-Bx6PVc0U.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/applescript.js.js": () => import("./applescript.js-bCRCt29S.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/arcade.js": () => import("./arcade-BjUhOU2f.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/arcade.js.js": () => import("./arcade.js-D2rp01GE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/arduino.js": () => import("./arduino-DK6BLLqU.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/arduino.js.js": () => import("./arduino.js-Jmjb357w.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/armasm.js": () => import("./armasm-CAERsD9-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/armasm.js.js": () => import("./armasm.js-vcUsQrEs.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/asciidoc.js": () => import("./asciidoc-gEFw0TLJ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/asciidoc.js.js": () => import("./asciidoc.js-BVs1-SgL.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/aspectj.js": () => import("./aspectj-B9PyOYq5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/aspectj.js.js": () => import("./aspectj.js-Edyr6E_4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/autohotkey.js": () => import("./autohotkey-CYj6UfhT.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/autohotkey.js.js": () => import("./autohotkey.js-Dl1o3vD7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/autoit.js": () => import("./autoit-CuINXF0_.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/autoit.js.js": () => import("./autoit.js-BC1QsuMg.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/avrasm.js": () => import("./avrasm-BT_5Rs6R.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/avrasm.js.js": () => import("./avrasm.js-AlcoXoKE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/awk.js": () => import("./awk-Be2qUGd6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/awk.js.js": () => import("./awk.js-ufjnmfLn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/axapta.js": () => import("./axapta-BKhIQ8lT.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/axapta.js.js": () => import("./axapta.js-2jr_17Aa.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/bash.js": () => import("./bash-C5Zc3PFs.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/bash.js.js": () => import("./bash.js-DQX1e70G.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/basic.js": () => import("./basic-CfInFRXC.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/basic.js.js": () => import("./basic.js-uqvf-Dn6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/bnf.js": () => import("./bnf-CgC-Ajym.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/bnf.js.js": () => import("./bnf.js-D4gLMZ2a.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/brainfuck.js": () => import("./brainfuck-Bum8SKdS.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/brainfuck.js.js": () => import("./brainfuck.js-B9s_Wzh5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/c.js": () => import("./c-ByHpIObv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/c.js.js": () => import("./c.js-BYH0Nw6o.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cal.js": () => import("./cal-CkFbHQib.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cal.js.js": () => import("./cal.js-CSiNcb57.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/capnproto.js": () => import("./capnproto-FXE_e21j.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/capnproto.js.js": () => import("./capnproto.js-Dx9RVkr1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ceylon.js": () => import("./ceylon-CNfQWVRI.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ceylon.js.js": () => import("./ceylon.js-C31zuY1Z.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clean.js": () => import("./clean-Dv-3xA79.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clean.js.js": () => import("./clean.js-v_TU3PK1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clojure-repl.js": () => import("./clojure-repl-D_AP0jD-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clojure-repl.js.js": () => import("./clojure-repl.js-tiAC53aj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clojure.js": () => import("./clojure-FKlF2YhW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/clojure.js.js": () => import("./clojure.js-CCuMd2aZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cmake.js": () => import("./cmake-Bgt-ax8x.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cmake.js.js": () => import("./cmake.js-kcwy91Vp.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/coffeescript.js": () => import("./coffeescript-DfQkJoEW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/coffeescript.js.js": () => import("./coffeescript.js-Y9i6-f4C.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/coq.js": () => import("./coq-D3tW_elQ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/coq.js.js": () => import("./coq.js-BkeHa9co.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cos.js": () => import("./cos-C5n5TWK6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cos.js.js": () => import("./cos.js-DJ_gLbtw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cpp.js": () => import("./cpp-DtpmuK1i.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/cpp.js.js": () => import("./cpp.js-CLQC64rZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/crmsh.js": () => import("./crmsh-DdsDLOd_.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/crmsh.js.js": () => import("./crmsh.js-B1Faf3Z0.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/crystal.js": () => import("./crystal-CUR-K-HE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/crystal.js.js": () => import("./crystal.js-CKtR3f3T.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/csharp.js": () => import("./csharp-DvSOS1YY.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/csharp.js.js": () => import("./csharp.js-Dh5uoDVz.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/csp.js": () => import("./csp-RInor-7c.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/csp.js.js": () => import("./csp.js-Cl-qAQk6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/css.js": () => import("./css-DMjrza6L.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/css.js.js": () => import("./css.js-Bmb7onMP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/d.js": () => import("./d-BFC1FUsZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/d.js.js": () => import("./d.js-D1Dkxf4y.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dart.js": () => import("./dart-BWf27ASf.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dart.js.js": () => import("./dart.js-DX-KxdP3.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/delphi.js": () => import("./delphi-DiDrNibc.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/delphi.js.js": () => import("./delphi.js-CoQaPyTw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/diff.js": () => import("./diff-DhbkNvVj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/diff.js.js": () => import("./diff.js-9rQzA0V_.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/django.js": () => import("./django-BLM0IzCA.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/django.js.js": () => import("./django.js-CpJpf2yH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dns.js": () => import("./dns-BsoDq_R9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dns.js.js": () => import("./dns.js-CPdFXCj1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dockerfile.js": () => import("./dockerfile-CskypEKE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dockerfile.js.js": () => import("./dockerfile.js-B6hXOOLH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dos.js": () => import("./dos-YAUaSBWw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dos.js.js": () => import("./dos.js-dQn_jn6n.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dsconfig.js": () => import("./dsconfig-CXmDRQzq.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dsconfig.js.js": () => import("./dsconfig.js-CtsZ7FWd.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dts.js": () => import("./dts-DfuIv6_Z.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dts.js.js": () => import("./dts.js-CBQlA5Ag.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dust.js": () => import("./dust-Bw_KX5w-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/dust.js.js": () => import("./dust.js-dos9WtP4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ebnf.js": () => import("./ebnf-DImtYOY4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ebnf.js.js": () => import("./ebnf.js-Di6OcuG1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/elixir.js": () => import("./elixir-1nlLBByI.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/elixir.js.js": () => import("./elixir.js-CzAD-Fxj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/elm.js": () => import("./elm-Cr58bpTo.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/elm.js.js": () => import("./elm.js-GyiVk2rV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erb.js": () => import("./erb-DZpQ1qI9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erb.js.js": () => import("./erb.js-CmWgbNVi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erlang-repl.js": () => import("./erlang-repl--xKv_wMQ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erlang-repl.js.js": () => import("./erlang-repl.js-DiItSRV1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erlang.js": () => import("./erlang-Z1xZnh2q.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/erlang.js.js": () => import("./erlang.js-CB8whpoU.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/excel.js": () => import("./excel-BWpYI0b7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/excel.js.js": () => import("./excel.js-DIUTsJ5_.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fix.js": () => import("./fix-CIB6wxfn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fix.js.js": () => import("./fix.js-mI5W6Y43.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/flix.js": () => import("./flix-DBLybV71.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/flix.js.js": () => import("./flix.js-CDJO3IJJ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fortran.js": () => import("./fortran-_rSX6pGu.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fortran.js.js": () => import("./fortran.js-B6sH70ax.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/freedesktop.js": () => import("./freedesktop-BHSN-A89.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/freedesktop.js.js": () => import("./freedesktop.js-Dy338G68.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fsharp.js": () => import("./fsharp-232_CM5m.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/fsharp.js.js": () => import("./fsharp.js-U5v-ApuA.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gams.js": () => import("./gams-Dgs8ubR-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gams.js.js": () => import("./gams.js-BwVJKGJs.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gauss.js": () => import("./gauss-CWnkTQ96.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gauss.js.js": () => import("./gauss.js-BhBFD__F.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gcode.js": () => import("./gcode-CDvX5Oyy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gcode.js.js": () => import("./gcode.js-BnQlwMP3.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gherkin.js": () => import("./gherkin-eGmkOaiq.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gherkin.js.js": () => import("./gherkin.js-CKHqbNaa.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/glsl.js": () => import("./glsl-ByhNau3C.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/glsl.js.js": () => import("./glsl.js-Cmf721XV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gml.js": () => import("./gml-BcwGDi5o.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gml.js.js": () => import("./gml.js-Dkb9sAtW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/go.js": () => import("./go-BjKE8qPF.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/go.js.js": () => import("./go.js-xpPsoVkW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/golo.js": () => import("./golo-BGam9-KB.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/golo.js.js": () => import("./golo.js-Bckb4Epx.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gradle.js": () => import("./gradle-BJHhMJg7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/gradle.js.js": () => import("./gradle.js-BGZD9HWy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/graphql.js": () => import("./graphql-CLh1lcvF.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/graphql.js.js": () => import("./graphql.js-CPZVmfB-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/groovy.js": () => import("./groovy-Y2W46v-n.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/groovy.js.js": () => import("./groovy.js-CzLbXM0k.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haml.js": () => import("./haml-8arDXf9m.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haml.js.js": () => import("./haml.js-DtdYAtwe.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/handlebars.js": () => import("./handlebars-CurAWEHE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/handlebars.js.js": () => import("./handlebars.js-Dirgarax.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haskell.js": () => import("./haskell-wxlk8mmO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haskell.js.js": () => import("./haskell.js-scmneGW5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haxe.js": () => import("./haxe-e4v-vmA6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/haxe.js.js": () => import("./haxe.js-BAE7jKrY.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/hsp.js": () => import("./hsp-DNUQ-xbM.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/hsp.js.js": () => import("./hsp.js-Cv3de_5Y.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/http.js": () => import("./http-SXKoXe2E.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/http.js.js": () => import("./http.js-P1MBhDfl.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/hy.js": () => import("./hy-C6F0HZdO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/hy.js.js": () => import("./hy.js-TV0vGB7k.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/inform7.js": () => import("./inform7-CpD8OQV5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/inform7.js.js": () => import("./inform7.js-CgzcEh3C.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ini.js": () => import("./ini-B8Julgdp.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ini.js.js": () => import("./ini.js-BkauObW7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/irpf90.js": () => import("./irpf90-D9H3VKH2.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/irpf90.js.js": () => import("./irpf90.js-BgfXXPPW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/isbl.js": () => import("./isbl-zUb3LSpn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/isbl.js.js": () => import("./isbl.js-ZOgAmLMP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/java.js": () => import("./java-lVy0kEDE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/java.js.js": () => import("./java.js-3EKx91wy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/javascript.js": () => import("./javascript-Bz7qiNip.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/javascript.js.js": () => import("./javascript.js-B7vHSpq2.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/jboss-cli.js": () => import("./jboss-cli-D3BLx3Aw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/jboss-cli.js.js": () => import("./jboss-cli.js-BLxSBHUH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/json.js": () => import("./json-BAZKnoAy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/json.js.js": () => import("./json.js-Dtml99mO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/julia-repl.js": () => import("./julia-repl-SximRheh.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/julia-repl.js.js": () => import("./julia-repl.js-D_1iNNw5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/julia.js": () => import("./julia-BJFV3sAh.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/julia.js.js": () => import("./julia.js-BzPDhNoo.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/kotlin.js": () => import("./kotlin-B0SfaCBc.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/kotlin.js.js": () => import("./kotlin.js-DjyBYb86.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lasso.js": () => import("./lasso-BHCMlsOK.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lasso.js.js": () => import("./lasso.js-D6aQ5URc.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/latex.js": () => import("./latex-DdG8rXO3.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/latex.js.js": () => import("./latex.js-DXvSOZUO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ldif.js": () => import("./ldif-XkkmHxDx.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ldif.js.js": () => import("./ldif.js-DyFEC_v2.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/leaf.js": () => import("./leaf-COBb3SBP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/leaf.js.js": () => import("./leaf.js-DwxC_fXB.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/less.js": () => import("./less-BK4fqw1G.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/less.js.js": () => import("./less.js-BEW3N42g.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lisp.js": () => import("./lisp-CxPieAPq.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lisp.js.js": () => import("./lisp.js-Ca40Zbb9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/livecodeserver.js": () => import("./livecodeserver-COYLdmMD.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/livecodeserver.js.js": () => import("./livecodeserver.js-BJOfg8SG.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/livescript.js": () => import("./livescript-C9v4zjuL.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/livescript.js.js": () => import("./livescript.js-f4MwZvS6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/llvm.js": () => import("./llvm-C8l2ScBa.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/llvm.js.js": () => import("./llvm.js-D9wheUu-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lsl.js": () => import("./lsl-sJaIiChZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lsl.js.js": () => import("./lsl.js-BgGWgm6J.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lua.js": () => import("./lua-x4RKGE80.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/lua.js.js": () => import("./lua.js-CFowbTCU.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/makefile.js": () => import("./makefile-COz6eobD.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/makefile.js.js": () => import("./makefile.js-Bak7uQNv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/markdown.js": () => import("./markdown-D4LhGr1n.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/markdown.js.js": () => import("./markdown.js-DT6ITPug.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mathematica.js": () => import("./mathematica-Bk5hORaQ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mathematica.js.js": () => import("./mathematica.js-kmN2OYAh.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/matlab.js": () => import("./matlab-BjI1kq_v.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/matlab.js.js": () => import("./matlab.js-JczOmSO1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/maxima.js": () => import("./maxima-Cx5cRUiU.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/maxima.js.js": () => import("./maxima.js-Cm987E5D.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mel.js": () => import("./mel-CNLLBVuf.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mel.js.js": () => import("./mel.js-CWytWCwF.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mercury.js": () => import("./mercury-BuKDIuOu.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mercury.js.js": () => import("./mercury.js-BCne6B6r.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mipsasm.js": () => import("./mipsasm-DNMTdfie.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mipsasm.js.js": () => import("./mipsasm.js-CPmQhxKy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mizar.js": () => import("./mizar-DHlP2Uu1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mizar.js.js": () => import("./mizar.js-XwK2DLIG.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mojolicious.js": () => import("./mojolicious-pxAgSdz-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/mojolicious.js.js": () => import("./mojolicious.js-KpPXzUrj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/monkey.js": () => import("./monkey-DDUhgQFH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/monkey.js.js": () => import("./monkey.js-DNWEJudR.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/moonscript.js": () => import("./moonscript-w2omLKj0.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/moonscript.js.js": () => import("./moonscript.js-DQn8xVz7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/n1ql.js": () => import("./n1ql-BiQZhVfi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/n1ql.js.js": () => import("./n1ql.js-7YocXzOv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nestedtext.js": () => import("./nestedtext-Dof4Qb8n.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nestedtext.js.js": () => import("./nestedtext.js-OYn9ipYz.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nginx.js": () => import("./nginx-FQmtkAtZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nginx.js.js": () => import("./nginx.js-Dpynyq2f.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nim.js": () => import("./nim-CHlExcaU.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nim.js.js": () => import("./nim.js-tJx4oRG4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nix.js": () => import("./nix-Dq69qRyH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nix.js.js": () => import("./nix.js-BP41wVLK.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/node-repl.js": () => import("./node-repl-C4SMDKIb.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/node-repl.js.js": () => import("./node-repl.js-D2OlFrmO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nsis.js": () => import("./nsis-DTyoR7P7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/nsis.js.js": () => import("./nsis.js-DgugqKT1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/objectivec.js": () => import("./objectivec-BOpqmyQ9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/objectivec.js.js": () => import("./objectivec.js-B2Ex-xBY.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ocaml.js": () => import("./ocaml-Bio7uyov.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ocaml.js.js": () => import("./ocaml.js-HiHGZzJP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/openscad.js": () => import("./openscad-DHyEV6bF.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/openscad.js.js": () => import("./openscad.js-Csy-A8Xi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/oxygene.js": () => import("./oxygene-CD2eWiWF.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/oxygene.js.js": () => import("./oxygene.js-COf_x4uo.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/parser3.js": () => import("./parser3-BE914BoK.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/parser3.js.js": () => import("./parser3.js-DDLRIYpT.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/perl.js": () => import("./perl-DVHoy9Wy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/perl.js.js": () => import("./perl.js-D0wAnHNK.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pf.js": () => import("./pf-nEs-qz1K.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pf.js.js": () => import("./pf.js-CaInikJl.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pgsql.js": () => import("./pgsql-D8IriOIn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pgsql.js.js": () => import("./pgsql.js-dW18vlgJ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/php-template.js": () => import("./php-template-DUkMCg0Z.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/php-template.js.js": () => import("./php-template.js-D4vG5OT8.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/php.js": () => import("./php-BpxMDHTY.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/php.js.js": () => import("./php.js-C5x_SEth.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/plaintext.js": () => import("./plaintext-BmAsfLR5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/plaintext.js.js": () => import("./plaintext.js-C-tzT8Vz.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pony.js": () => import("./pony-DNw3TJxb.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/pony.js.js": () => import("./pony.js-cENy-xDT.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/powershell.js": () => import("./powershell-Bg2nhomi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/powershell.js.js": () => import("./powershell.js-BwrpmWX7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/processing.js": () => import("./processing-CYHQSpd3.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/processing.js.js": () => import("./processing.js-BdtF6hHX.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/profile.js": () => import("./profile-Bz5qz-uB.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/profile.js.js": () => import("./profile.js-Dt2vy-l2.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/prolog.js": () => import("./prolog-CVMN8Sox.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/prolog.js.js": () => import("./prolog.js-C12vPQvW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/properties.js": () => import("./properties-CEUzn0Nk.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/properties.js.js": () => import("./properties.js-nXMA-rCO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/protobuf.js": () => import("./protobuf-CQBzcljt.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/protobuf.js.js": () => import("./protobuf.js-KjUObGKv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/puppet.js": () => import("./puppet-BlPVkQvS.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/puppet.js.js": () => import("./puppet.js-CmlArYsO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/purebasic.js": () => import("./purebasic-Co0purFY.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/purebasic.js.js": () => import("./purebasic.js-Chbjp2lP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/python-repl.js": () => import("./python-repl-DpbVPMrN.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/python-repl.js.js": () => import("./python-repl.js-Dc4dIuOV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/python.js": () => import("./python-hSTwo90o.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/python.js.js": () => import("./python.js-Dt2HIMRk.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/q.js": () => import("./q-D3Cfw0BV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/q.js.js": () => import("./q.js-Dm5TnUEX.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/qml.js": () => import("./qml-DQCAGuI1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/qml.js.js": () => import("./qml.js-DsoWcWFI.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/r.js": () => import("./r-B3-9HjIQ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/r.js.js": () => import("./r.js-B_G2R7yx.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/reasonml.js": () => import("./reasonml-BA0waBEm.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/reasonml.js.js": () => import("./reasonml.js-CpteJV55.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rib.js": () => import("./rib-BWxeA8HC.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rib.js.js": () => import("./rib.js-CULLt5nc.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/roboconf.js": () => import("./roboconf-rXJOEoIC.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/roboconf.js.js": () => import("./roboconf.js-LmCZE1A5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/routeros.js": () => import("./routeros-Dyc5GBUA.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/routeros.js.js": () => import("./routeros.js-DkoNhxEE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rsl.js": () => import("./rsl-C5_8r3Dj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rsl.js.js": () => import("./rsl.js-CbXMdh_B.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ruby.js": () => import("./ruby-DmBvVQz9.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ruby.js.js": () => import("./ruby.js-XUgvgehA.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ruleslanguage.js": () => import("./ruleslanguage-CnO61et4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/ruleslanguage.js.js": () => import("./ruleslanguage.js-ppOV2Y55.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rust.js": () => import("./rust-CqCBNK5X.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/rust.js.js": () => import("./rust.js-Cpp8Bz7H.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sas.js": () => import("./sas-Aka2VP-z.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sas.js.js": () => import("./sas.js-Cx21gIwu.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scala.js": () => import("./scala-Crkvm04l.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scala.js.js": () => import("./scala.js-D80btxPg.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scheme.js": () => import("./scheme-38M1uNTX.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scheme.js.js": () => import("./scheme.js-Du4psnim.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scilab.js": () => import("./scilab-Capt-N7T.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scilab.js.js": () => import("./scilab.js-vWhsSNKX.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scss.js": () => import("./scss-CnHYLEa6.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/scss.js.js": () => import("./scss.js-Cc1_AJJP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/shell.js": () => import("./shell-DBR4JWF_.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/shell.js.js": () => import("./shell.js-CDDTKIR5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/smali.js": () => import("./smali-DpBGaC9z.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/smali.js.js": () => import("./smali.js-DeevfT6V.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/smalltalk.js": () => import("./smalltalk-D1UV_Cle.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/smalltalk.js.js": () => import("./smalltalk.js-C7suE42e.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sml.js": () => import("./sml-DcLTWrRV.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sml.js.js": () => import("./sml.js-ChIvxG4G.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sqf.js": () => import("./sqf-1r6gSmhj.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sqf.js.js": () => import("./sqf.js-CUeHLq4U.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sql.js": () => import("./sql-CTj1jNq4.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/sql.js.js": () => import("./sql.js-D_hf9UvP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stan.js": () => import("./stan-BCfVHqzl.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stan.js.js": () => import("./stan.js-DBwTZ8mw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stata.js": () => import("./stata-D1kQ2sLp.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stata.js.js": () => import("./stata.js-Bf_pFxFg.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/step21.js": () => import("./step21-CdfaB8nP.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/step21.js.js": () => import("./step21.js-L635CATi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stylus.js": () => import("./stylus-D62Dbkim.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/stylus.js.js": () => import("./stylus.js-CkkLqGIn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/subunit.js": () => import("./subunit-VCUFyCJL.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/subunit.js.js": () => import("./subunit.js-C-0RDbya.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/swift.js": () => import("./swift-C2zPsG6K.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/swift.js.js": () => import("./swift.js-BVRlJJQf.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/taggerscript.js": () => import("./taggerscript-DGTPdRYi.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/taggerscript.js.js": () => import("./taggerscript.js-wDAFhSwf.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tap.js": () => import("./tap-C3v68KHE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tap.js.js": () => import("./tap.js-Cp47vWcl.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tcl.js": () => import("./tcl-7Yzxh2At.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tcl.js.js": () => import("./tcl.js-DzK72Pln.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/thrift.js": () => import("./thrift-BbmVVWPe.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/thrift.js.js": () => import("./thrift.js-D_eiPBZv.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tp.js": () => import("./tp-ZZL5tUkO.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/tp.js.js": () => import("./tp.js-Bh4gRd32.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/twig.js": () => import("./twig-C7WV5Lnl.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/twig.js.js": () => import("./twig.js-BHqW9Uwq.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/typescript.js": () => import("./typescript-D8r8sO3q.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/typescript.js.js": () => import("./typescript.js-DlcnXCI1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vala.js": () => import("./vala-CRFBRw1F.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vala.js.js": () => import("./vala.js-BXKvrvAg.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbnet.js": () => import("./vbnet-C3iOo6ff.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbnet.js.js": () => import("./vbnet.js-Icngas7D.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbscript-html.js": () => import("./vbscript-html-BQsJtjDT.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbscript-html.js.js": () => import("./vbscript-html.js-CuMK2lSB.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbscript.js": () => import("./vbscript-BcoCoIxH.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vbscript.js.js": () => import("./vbscript.js-a_LQ9yFt.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/verilog.js": () => import("./verilog-Cv14bS_8.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/verilog.js.js": () => import("./verilog.js-CNNloJgw.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vhdl.js": () => import("./vhdl-Dj0y4xtD.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vhdl.js.js": () => import("./vhdl.js-Be2t2uFc.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vim.js": () => import("./vim-_b9xI5Hg.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/vim.js.js": () => import("./vim.js-BcLt7VJZ.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/wasm.js": () => import("./wasm-BjbS28z-.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/wasm.js.js": () => import("./wasm.js-C43mHK-1.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/wren.js": () => import("./wren-Bj8Afcjn.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/wren.js.js": () => import("./wren.js-Cfoswmm7.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/x86asm.js": () => import("./x86asm-CcudtTI5.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/x86asm.js.js": () => import("./x86asm.js-D9LSb5KW.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xl.js": () => import("./xl-C6QwZtuE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xl.js.js": () => import("./xl.js-CVbhJgGf.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xml.js": () => import("./xml-yO3kWgQE.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xml.js.js": () => import("./xml.js-D7W6PZ5r.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xquery.js": () => import("./xquery-B8CqcEqC.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/xquery.js.js": () => import("./xquery.js-K4z4gFRq.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/yaml.js": () => import("./yaml-5Jm9BPfy.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/yaml.js.js": () => import("./yaml.js-K0Ep0687.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/zephir.js": () => import("./zephir-DxI1soXS.js").then((e) => /* @__PURE__ */ y(e.default, 1)),
  "../node_modules/highlight.js/lib/languages/zephir.js.js": () => import("./zephir.js-DeaGN24W.js").then((e) => /* @__PURE__ */ y(e.default, 1))
}), Bn = "11.12.0", ze = /* @__PURE__ */ new Map(), Xl = `https://raw.githubusercontent.com/highlightjs/highlight.js/${Bn}/SUPPORTED_LANGUAGES.md`, Jt = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Jt.html = "xml";
Jt.xhtml = "xml";
Jt.markup = "xml";
var vo = /* @__PURE__ */ new Set(["magic", "undefined"]), Sn = null, Yl = 3, Ql = 3e5, Ur = /* @__PURE__ */ new Map();
function ds(e) {
  try {
    const t = Ur.get(e);
    return t ? t.openUntil && Date.now() < t.openUntil ? !0 : (t.openUntil && Date.now() >= t.openUntil && Ur.delete(e), !1) : !1;
  } catch {
    return !1;
  }
}
function ps(e) {
  if (e)
    try {
      const t = Ur.get(e) || {
        failures: 0,
        openUntil: 0,
        warned: !1
      };
      if (t.failures = (t.failures || 0) + 1, t.failures >= Yl && (t.openUntil = Date.now() + Ql, !t.warned)) {
        try {
          S("[codeblocksManager] CDN circuit opened for " + e + "; skipping CDN imports temporarily");
        } catch {
        }
        t.warned = !0;
      }
      Ur.set(e, t);
    } catch {
    }
}
function gs(e) {
  try {
    e && Ur.delete(e);
  } catch {
  }
}
var ms = null;
async function Ao(e = Xl) {
  if (e)
    return Sn || (Sn = (async () => {
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
          const u = c.replace(/^\||\|$/g, "").split("|").map((m) => m.trim());
          if (u.every((m) => /^-+$/.test(m))) continue;
          const d = u;
          if (!d.length) continue;
          const f = (d[o] || d[0] || "").toString().trim().toLowerCase();
          if (!f || /^-+$/.test(f)) continue;
          ze.set(f, f);
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
            const u = String(c ?? "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/gi, "");
            u && /[a-z0-9]/i.test(u) ? l.push(u) : ze.delete(c);
          }
          s = l;
        } catch (l) {
          S("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const c of Array.from(ze.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              ze.delete(c), l++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const d = ze.get(c);
                ze.delete(c), ze.set(u, d);
              } else
                ze.delete(c), l++;
            }
          }
          for (const [c, u] of Array.from(ze.entries())) (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (ze.delete(c), l++);
          try {
            const c = ":---------------------";
            ze.has(c) && (ze.delete(c), l++);
          } catch (c) {
            S("[codeblocksManager] remove sep key failed", c);
          }
          try {
            Array.from(ze.keys()).sort();
          } catch (c) {
            S("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (l) {
          S("[codeblocksManager] ignored error", l);
        }
      } catch (t) {
        S("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Sn);
}
var ta = /* @__PURE__ */ new Set(), ys = /* @__PURE__ */ new Set();
function na(e, t, n) {
  const r = String(e || "").toLowerCase();
  if (!(!r || ys.has(r))) {
    ys.add(r);
    try {
      S("[codeblocksManager] language import failed; using plaintext/highlightElement fallback", {
        language: e,
        candidates: Array.isArray(t) ? t : [],
        error: n ? String(n?.message || n) : "unknown"
      });
    } catch {
    }
  }
}
async function Wr(e, t) {
  if (Sn || (async () => {
    try {
      await Ao();
    } catch (i) {
      S("[codeblocksManager] loadSupportedLanguages (IIFE) failed", i);
    }
  })(), Sn) try {
    await Sn;
  } catch {
  }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (vo.has(n)) return !1;
  if (ze.size && !ze.has(n)) {
    const i = Jt;
    if (!i[n] && !i[e]) return !1;
  }
  if (ta.has(e)) return !0;
  const r = Jt;
  try {
    const i = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (r[e] || e || "").toString(), o = (r[i] || i || "").toString();
    let s = Array.from(new Set([
      a,
      o,
      i,
      e,
      r[i],
      r[e]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    ze.size && (s = s.filter((u) => {
      if (ze.has(u)) return !0;
      const d = Jt[u];
      return !!(d && ze.has(d));
    }));
    let l = null, c = null;
    for (const u of s) try {
      if (l = await Vl(u, async () => {
        try {
          if (typeof ms == "function") try {
            return await ms(u);
          } catch {
            return null;
          }
          const d = `highlight.js/lib/languages/${u}.js`, f = Zl[d];
          if (f && typeof f == "function") try {
            return await f();
          } catch {
          }
          try {
            try {
              return await import(`highlight.js/lib/languages/${u}.js`);
            } catch {
              return await import(`highlight.js/lib/languages/${u}`);
            }
          } catch {
          }
          if (!Bn) return null;
          try {
            const p = `https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/es/languages/${u}.js`;
            let m = null;
            try {
              m = new URL(p).host;
            } catch {
              m = null;
            }
            if (!ds(m))
              try {
                const g = await import(p);
                return gs(m), g;
              } catch {
                ps(m);
              }
            try {
              const g = `https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/lib/languages/${u}.js`;
              let _ = null;
              try {
                _ = new URL(g).host;
              } catch {
                _ = null;
              }
              if (!ds(_))
                try {
                  const h = await import(g);
                  return gs(_), h;
                } catch {
                  return ps(_), null;
                }
            } catch {
              return null;
            }
          } catch {
            try {
              return await import(`https://cdn.jsdelivr.net/npm/highlight.js@${Bn}/lib/languages/${u}.js`);
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
          const f = ze.size && ze.get(e) || u || e;
          return Ye.registerLanguage(f, d), ta.add(f), f !== e && (Ye.registerLanguage(e, d), ta.add(e)), !0;
        } catch (f) {
          c = f;
        }
      }
    } catch (d) {
      c = d;
    }
    return c ? (na(e, s, c), !1) : (s.length && na(e, s, null), !1);
  } catch (i) {
    return na(e, [], i), !1;
  }
}
var ra = null;
function Kl(e) {
  const t = e?.querySelector ? e : typeof document < "u" ? document : null;
  Sn || (async () => {
    try {
      await Ao();
    } catch (a) {
      S("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const n = Jt;
  typeof IntersectionObserver < "u" && !ra && (ra = new IntersectionObserver((a, o) => {
    a.forEach((s) => {
      if (!s.isIntersecting) return;
      const l = s.target;
      try {
        o.unobserve(l);
      } catch (c) {
        S("[codeblocksManager] observer unobserve failed", c);
      }
      (async () => {
        try {
          const c = l.getAttribute && l.getAttribute("class") || l.className || "", u = c.match(/language-([a-zA-Z0-9_+-]+)/) || c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (u && u[1]) {
            const d = (u[1] || "").toLowerCase(), f = n[d] || d, p = ze.size && (ze.get(f) || ze.get(String(f).toLowerCase())) || f;
            try {
              await Wr(p);
            } catch (m) {
              S("[codeblocksManager] registerLanguage failed", m);
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
              Ye.highlightElement(l);
            } catch (m) {
              S("[codeblocksManager] hljs.highlightElement failed", m);
            }
          } else try {
            const d = l.textContent || "";
            try {
              if (Ye && typeof Ye.getLanguage == "function" && Ye.getLanguage("plaintext")) {
                const f = Ye.highlight(d, { language: "plaintext" });
                if (f && f.value) try {
                  if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                    const p = document.createRange().createContextualFragment(f.value);
                    if (typeof l.replaceChildren == "function") l.replaceChildren(...Array.from(p.childNodes));
                    else {
                      for (; l.firstChild; ) l.removeChild(l.firstChild);
                      l.appendChild(p);
                    }
                  } else l.innerHTML = f.value;
                } catch {
                  try {
                    l.innerHTML = f.value;
                  } catch {
                  }
                }
              }
            } catch {
              try {
                Ye.highlightElement(l);
              } catch (p) {
                S("[codeblocksManager] fallback highlightElement failed", p);
              }
            }
          } catch (d) {
            S("[codeblocksManager] auto-detect plaintext failed", d);
          }
        } catch (c) {
          S("[codeblocksManager] observer entry processing failed", c);
        }
      })();
    });
  }, {
    root: null,
    rootMargin: "300px",
    threshold: 0.1
  }));
  const r = ra, i = t?.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!r) {
    i.forEach(async (a) => {
      try {
        const o = a.getAttribute && a.getAttribute("class") || a.className || "", s = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (s && s[1]) {
          const l = (s[1] || "").toLowerCase(), c = n[l] || l, u = ze.size && (ze.get(c) || ze.get(String(c).toLowerCase())) || c;
          try {
            await Wr(u);
          } catch (d) {
            S("[codeblocksManager] registerLanguage failed (no observer)", d);
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
          Ye.highlightElement(a);
        } catch (l) {
          S("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
        }
      } catch (o) {
        S("[codeblocksManager] loadSupportedLanguages fallback ignored error", o);
      }
    });
    return;
  }
  i.forEach((a) => {
    try {
      r.observe(a);
    } catch (o) {
      S("[codeblocksManager] observe failed", o);
    }
  });
}
function Qf(e, { useCdn: t = !0 } = {}) {
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
      S("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  if (!Bn) {
    try {
      S("Cannot load highlight.js theme from CDN: HIGHLIGHT_JS_VERSION is not defined");
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
var Xr = (e) => e === void 0 ? "__undefined" : String(e), Jl = new ar(function(e) {
  return String(e ?? "").replace(/^[.\/]+/, "");
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), ec = new ar(function(e) {
  return String(e ?? "").replace(/\/+$/, "");
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), tc = new ar(function(e) {
  return Wn(String(e ?? "")) + "/";
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), Kf = new ar(function(e) {
  try {
    const t = String(e ?? "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return S("[helpers] encodeURL failed", t), String(e ?? "");
  }
}, {
  keyResolver: Xr,
  cacheOptions: { maxEntries: 2e3 }
}), nc = new ar(function(e) {
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
function Li(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
var re = (e) => Jl.run(e), Wn = (e) => ec.run(e), jn = (e) => tc.run(e);
function rc(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const t = document.createElement("link");
    t.rel = "preload", t.as = "image", t.href = e, document.head.appendChild(t);
  } catch (t) {
    S("[helpers] preloadImage failed", t);
  }
}
var ic = ["https://cdn.jsdelivr.net", "https://unpkg.com"];
function ac() {
  try {
    if (typeof document > "u" || !document.head) return;
    for (const e of ic) try {
      if (document.querySelector(`link[rel="preconnect"][href="${e}"]`)) continue;
      const t = document.createElement("link");
      t.rel = "preconnect", t.href = e, t.crossOrigin = "anonymous", document.head.appendChild(t);
    } catch {
    }
  } catch {
  }
}
function sc(e, t = "monokai") {
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
var xa = null;
function oc(e) {
  xa = typeof e == "string" ? e : null;
}
function Ha(e) {
  if (xa && e && typeof e.setAttribute == "function") try {
    e.setAttribute("nonce", xa);
  } catch {
  }
}
function ia(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const r = Array.from(e.querySelectorAll("img"));
    if (!r.length) return;
    const i = e, a = i?.getBoundingClientRect ? i.getBoundingClientRect() : null, o = 0, s = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = a ? Math.max(o, a.top) : o, c = (a ? Math.min(s, a.bottom) : s) + Number(t || 0);
    let u = 0;
    i && (u = i.clientHeight || (a ? a.height : 0)), u || (u = s - o);
    let d = 0.6;
    try {
      const g = i && window.getComputedStyle ? window.getComputedStyle(i) : null, _ = g?.getPropertyValue ? g.getPropertyValue("--nimbi-image-max-height-ratio") : null, h = _ ? parseFloat(_) : NaN;
      !Number.isNaN(h) && h > 0 && h <= 1 && (d = h);
    } catch (g) {
      S("[helpers] read CSS ratio failed", g);
    }
    const f = Math.max(200, Math.floor(u * d));
    let p = null, m = !1;
    if (r.forEach((g) => {
      try {
        const _ = g.getAttribute?.("loading"), h = _ === "eager", w = g?.getBoundingClientRect ? g.getBoundingClientRect() : null, b = g.src || g.getAttribute?.("src"), k = w?.height > 1 ? w.height : f, E = w ? w.top : 0, z = E + k;
        w && k > 0 && E <= c && z >= l && !m ? (g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), rc(b), m = !0) : !h && g.setAttribute && g.setAttribute("loading", "lazy"), !p && w?.top <= c && (p = {
          img: g,
          src: b,
          rect: w,
          beforeLoading: _,
          explicitEager: h
        });
      } catch (_) {
        S("[helpers] setEagerForAboveFoldImages per-image failed", _);
      }
    }), !m && p) {
      const { img: g, src: _, explicitEager: h } = p;
      if (!h) try {
        g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), m = !0;
      } catch (w) {
        S("[helpers] setEagerForAboveFoldImages fallback failed", w);
      }
    }
  } catch (r) {
    S("[helpers] setEagerForAboveFoldImages failed", r);
  }
}
function qe(e, t = null, n) {
  try {
    const r = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", i = new URLSearchParams(r.startsWith("?") ? r.slice(1) : r), a = String(e ?? "");
    i.delete("page");
    const o = new URLSearchParams();
    o.set("page", a);
    for (const [c, u] of i.entries()) o.append(c, u);
    const s = o.toString();
    let l = s ? `?${s}` : "";
    return t && (l += `#${encodeURIComponent(t)}`), l || `?page=${encodeURIComponent(a)}`;
  } catch {
    const i = `?page=${encodeURIComponent(String(e ?? ""))}`;
    return t ? `${i}#${encodeURIComponent(t)}` : i;
  }
}
function Ci(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      S("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    S("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Ci);
} catch (e) {
  S("[helpers] global attach failed", e);
}
var lc = (e) => nc.run(e), Eo = () => typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, $n = "light";
function cc(e, t = {}) {
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
        const u = c + 1;
        n.setAttribute("data-bulmaswatch-move-count", String(u)), i = !1;
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
function aa() {
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
async function uc(e = "none", t = "/") {
  try {
    pe("[bulmaManager] ensureBulma called", {
      bulmaCustomize: e,
      pageDir: t
    });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      aa();
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], r = Array.from(new Set(n));
  if (e === "local") {
    if (aa(), document.querySelector("style[data-bulma-override]")) return;
    for (const i of r) try {
      const a = await fetch(i, { method: "GET" });
      if (a.ok) {
        const o = await a.text(), s = document.createElement("style");
        s.setAttribute("data-bulma-override", i), Ha(s), s.appendChild(document.createTextNode(`
/* bulma override: ${i} */
` + o)), document.head.appendChild(s);
        return;
      }
    } catch (a) {
      S("[bulmaManager] fetch local bulma candidate failed", a);
    }
    return;
  }
  try {
    const i = String(e).trim();
    if (!i) return;
    aa(), cc(`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`, { "data-bulmaswatch-theme": i });
  } catch (i) {
    S("[bulmaManager] ensureBulma failed", i);
  }
}
function hc(e) {
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
function Jf(e) {
  const t = document.documentElement;
  for (const [n, r] of Object.entries(e || {})) try {
    t.style.setProperty(`--${n}`, r);
  } catch (i) {
    S("[bulmaManager] setThemeVars failed for", n, i);
  }
}
function To(e) {
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
var jo = {
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
}, Sa = class {
  constructor(e = {}) {
    this._options = e || {};
  }
  static async run(e, t = {}) {
    if (typeof e != "function") throw new TypeError("fn must be a function");
    const { maxAttempts: n = 3, backoff: r = "exponential", baseDelay: i = 100, maxDelay: a = Bl, jitter: o = !0, attemptTimeout: s, retryIf: l = () => !0, onRetry: c } = t, u = Number(n);
    if (!Number.isFinite(u) || u <= 0) throw new TypeError("maxAttempts must be a positive finite number");
    const d = Math.floor(u), f = (m) => {
      let g;
      return r === "linear" ? g = i * m : r === "fixed" ? g = i : g = i * Math.pow(2, m - 1), g > a && (g = a), o && (g = Math.round(g * (0.5 + Math.random() * 0.5))), g;
    };
    let p;
    for (let m = 1; m <= d; m++) {
      let g = null, _;
      typeof s == "number" && s > 0 && typeof AbortController < "u" && (g = new AbortController(), _ = g.signal);
      try {
        const h = (async () => e(_))();
        if (g) {
          let w, b = !1;
          try {
            return await Promise.race([h, new Promise((k, E) => {
              w = setTimeout(() => {
                b = !0;
                const z = /* @__PURE__ */ new Error("Attempt timed out");
                z.code = "ETIMEOUT", z.attempts = m, z.attemptTimeout = s, E(z);
              }, s);
            })]);
          } finally {
            if (w && clearTimeout(w), b && g) try {
              g.abort();
            } catch {
            }
          }
        }
        return await h;
      } catch (h) {
        if (p = h, !(typeof l == "function" ? l(h) : l) || m === d) break;
        const w = f(m);
        try {
          typeof c == "function" && c(m, h, w);
        } catch {
        }
        await new Promise((b) => setTimeout(b, w));
      }
    }
    throw p;
  }
  async run(e, t = {}) {
    const n = Object.assign({}, this._options || {}, t || {});
    return this.constructor.run(e, n);
  }
}, Lr = class {
  static async run(e, t = {}) {
    if (typeof e != "function") throw new TypeError("fn must be a function");
    const { maxAttempts: n = 1, attemptTimeout: r = null, totalTimeout: i = null, retryDelay: a = 0, retryIf: o = () => !0, signal: s = null, onRetry: l, backoff: c, baseDelay: u, maxDelay: d, jitter: f } = t || {}, p = Math.max(1, Math.floor(Number(n) || 1)), m = Number(r) > 0 ? Number(r) : null, g = Number(i) > 0 ? Number(i) : null, _ = Math.max(0, Number(a) || 0), h = typeof o == "function" ? o : () => !!o, w = $e(), b = g !== null ? w + g : null, k = b !== null && typeof AbortController < "u" ? new AbortController() : null, E = () => {
      if (!s) return null;
      if (s.aborted) return {
        promise: Promise.reject(_s(s.reason, w, g)),
        cleanup: null
      };
      let se = null;
      return {
        promise: new Promise((he, ie) => {
          const C = () => {
            ie(_s(s.reason, w, g));
          };
          s.addEventListener("abort", C, { once: !0 }), se = () => s.removeEventListener("abort", C);
        }),
        cleanup: se
      };
    }, z = async (se, he) => {
      const ie = $e();
      if (b !== null && ie >= b) {
        const N = /* @__PURE__ */ new Error("Deadline exceeded");
        throw N.code = "EDEADLINE", N.attempts = se, N.elapsedMs = $e() - w, N;
      }
      const C = bs(s, bs(he, k ? k.signal : null)), I = E(), j = [Promise.resolve().then(() => e(C))], T = [];
      if (b !== null) {
        const N = b - $e();
        let Y;
        const $ = new Promise((ne, le) => {
          const ye = setTimeout(() => {
            if (k) try {
              k.abort();
            } catch {
            }
            const fe = /* @__PURE__ */ new Error("Deadline exceeded");
            fe.code = "EDEADLINE", fe.attempts = se, fe.elapsedMs = $e() - w, le(fe);
          }, N);
          Y = () => clearTimeout(ye);
        });
        j.push($), T.push(Y);
      }
      I && (j.push(I.promise), typeof I.cleanup == "function" && T.push(I.cleanup));
      try {
        return await Promise.race(j);
      } catch (N) {
        throw N && typeof N == "object" && (N.attempts = se, N.attemptTimeout = m, N.totalTimeout = g), N;
      } finally {
        for (const N of T) typeof N == "function" && N();
      }
    }, W = {
      maxAttempts: p,
      attemptTimeout: m,
      retryIf: (se) => se && (se.code === "EABORT" || se.code === "EDEADLINE") ? !1 : h(se),
      onRetry: l
    };
    typeof c < "u" && (W.backoff = c), typeof u < "u" && (W.baseDelay = u), typeof d < "u" && (W.maxDelay = d), typeof f < "u" && (W.jitter = f), _ > 0 && typeof W.backoff > "u" && (W.backoff = "fixed", W.baseDelay = _, W.maxDelay = _, W.jitter = !1);
    let F = 0;
    const K = async (se) => (F += 1, z(F, se));
    return Sa.run(K, W);
  }
  constructor(e = {}) {
    this._options = e || {};
  }
  async run(e, t = {}) {
    return this.constructor.run(e, Object.assign({}, this._options, t));
  }
}, _s = (e, t, n) => {
  const r = /* @__PURE__ */ new Error("Aborted");
  return r.code = "EABORT", r.reason = e, r.attempts = 0, r.elapsedMs = $e() - t, r.totalTimeout = n, r;
}, bs = (e, t) => {
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
}, fc = /* @__PURE__ */ Fi({
  currentLang: () => $t,
  formatDate: () => pc,
  formatNumber: () => gc,
  loadL10nFile: () => Ro,
  setLang: () => Lo,
  t: () => Jn,
  tPlural: () => dc
}), Qt = JSON.parse(JSON.stringify(jo)), Mi = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages?.[0] || "en";
  Mi = String(e).split("-")[0].toLowerCase();
}
jo[Mi] || (Mi = "en");
var $t = Mi;
function Jn(e, t = {}) {
  let n = (Qt[$t] || Qt.en)?.[e] || Qt.en[e] || "";
  for (const r of Object.keys(t)) {
    const i = r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    n = n.replace(new RegExp(`\\{${i}\\}`, "g"), String(t[r]));
  }
  return n;
}
async function Ro(e, t) {
  if (!e) return;
  let n = e;
  const r = async (i) => {
    if (Lr && typeof Lr.run == "function") return await Lr.run(() => fetch(i), {
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
    for (const o of Object.keys(a || {})) Qt[o] = Object.assign({}, Qt[o] || {}, a[o]);
  } catch {
  }
}
function dc(e, t, n = {}) {
  try {
    const r = Qt[$t] || Qt.en, i = new Intl.PluralRules($t).select(t), a = `${e}.${i}`;
    let o = r?.[a] || "";
    if (!o) {
      const l = r?.[e];
      l && typeof l == "object" ? o = l[i] || "" : typeof l == "string" && (o = l);
    }
    if (o || (o = Qt.en[a] || ""), !o) {
      const l = Qt.en[e];
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
    return Jn(e, n);
  }
}
function pc(e, t = {}) {
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
function gc(e, t = {}) {
  try {
    return new Intl.NumberFormat($t, t).format(e);
  } catch {
    return String(e);
  }
}
function Lo(e) {
  const t = String(e ?? "").split("-")[0].toLowerCase();
  $t = Qt[t] ? t : "en";
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
var te = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Map(), ht = [], Qe = /* @__PURE__ */ new Set();
function mc(e) {
  ht = e;
}
var xt = /* @__PURE__ */ new Set(), Pi = !1;
function ki() {
  return Pi;
}
function er(e) {
  if (yc(), xt.clear(), Array.isArray(ht) && ht.length)
    for (const t of ht) t && xt.add(t);
  else for (const t of Qe) t && xt.add(t);
  ws(te), ws(be), Pi = !0;
}
try {
  Object.defineProperty(er, "_refreshed", {
    get() {
      return Pi;
    },
    set(e) {
      Pi = !!e;
    },
    configurable: !0
  });
} catch {
}
function ws(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values()) t && xt.add(t);
}
function ks(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, r) {
    return r && typeof r == "string" ? xt.add(r) : r?.default && xt.add(r.default), t.call(this, n, r);
  };
}
var xs = !1;
function yc() {
  xs || (ks(te), ks(be), xs = !0);
}
function _c(e) {
  try {
    return String(e ?? "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e ?? "");
  }
}
function Ss(e, t = null, n = void 0) {
  let r = "#/" + _c(String(e ?? ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let i = "";
    if (typeof n == "string") i = n;
    else if (typeof location < "u" && location?.search) i = location.search;
    else if (typeof location < "u" && location?.hash) try {
      const a = yt(location.href);
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
function yt(e) {
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
function at() {
  return pi || (typeof DOMParser < "u" ? (pi = new DOMParser(), pi) : null);
}
function tr(e) {
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
var Co = `let y, w;
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
`, vs = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Co], { type: "text/javascript;charset=utf-8" });
function bc(e) {
  let t;
  try {
    if (t = vs && (self.URL || self.webkitURL).createObjectURL(vs), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Co), {
      type: "module",
      name: e?.name
    });
  }
}
var pn, gn;
function wc() {
  return pn !== void 0 ? pn === !1 ? null : pn : typeof TextEncoder < "u" ? (pn = new TextEncoder(), pn) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (pn = { encode: (e) => new Uint8Array(Buffer.from(e)) }, pn) : (pn = !1, null);
}
function kc() {
  return gn !== void 0 ? gn === !1 ? null : gn : typeof TextDecoder < "u" ? (gn = new TextDecoder(), gn) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (gn = { decode: (e) => Buffer.from(e).toString("utf8") }, gn) : (gn = !1, null);
}
var sa = (e, t) => {
  if (e instanceof Uint8Array) return e;
  if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  if (e instanceof ArrayBuffer) return new Uint8Array(e);
  const n = t ?? JSON.stringify(e), r = wc();
  if (typeof r?.encode == "function") return r.encode(n);
  throw new Error("No TextEncoder or Buffer available to encode object");
}, xc = (e) => {
  let t;
  if (e instanceof Uint8Array) t = e;
  else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  else if (e instanceof ArrayBuffer) t = new Uint8Array(e);
  else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
  else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
  const n = kc();
  if (typeof n?.decode == "function") return JSON.parse(n.decode(t));
  if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(t));
  throw new Error("No TextDecoder or Buffer available to decode object");
}, Sc = null;
function vc() {
  const e = Sc || (typeof ls < "u" ? ls : null);
  if (e) return e("worker_threads").Worker;
  throw new Error("WorkerAgnostic: Node worker_threads is not available synchronously in pure ESM. Call `await WorkerAgnostic.preloadNode()` once before constructing a string-source worker, set globalThis.Worker, or pass a factory function instead of a path string.");
}
function As() {
  return typeof window < "u" && typeof window.document < "u" ? "browser" : typeof self < "u" && typeof self.importScripts == "function" ? "webworker" : typeof process < "u" && process.versions?.node ? "node" : "unknown";
}
var Es = [
  "message",
  "error",
  "messageerror"
];
function Ts(e, t, n) {
  const r = typeof globalThis < "u" && globalThis.Worker || (typeof Worker < "u" ? Worker : void 0);
  if (typeof r == "function" && typeof e == "string") return new r(e, t);
  if (n === "node" || n === "browser" || n === "webworker") {
    const i = n === "node" ? vc() : void 0;
    if (typeof e == "function") return js(e, i, t, n);
    if (typeof e == "string") return n === "node" ? new i(e, t) : Mo(e, t);
    throw new Error("Invalid workerSource: expected Worker factory or path string");
  }
  if (typeof e == "function") return js(e, void 0, t, "unknown");
  throw new Error("Unsupported environment for WorkerAgnostic: cannot resolve a string workerSource without a global Worker or a known runtime");
}
function js(e, t, n, r) {
  if (typeof e.prototype > "u") return Rs(e(), t, n, r);
  try {
    return new e();
  } catch (i) {
    if (i instanceof TypeError && /not a constructor|cannot be invoked without\s*'new'|Class constructor|not constructable/i.test(String(i?.message))) return Rs(e(), t, n, r);
    throw i;
  }
}
function Rs(e, t, n, r) {
  return e && typeof e == "object" && typeof e.postMessage == "function" ? e : typeof e == "string" ? r === "node" ? new t(e, n) : Mo(e, n) : e && typeof e == "object" ? e : {};
}
function Mo(e, t) {
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
function Ac(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object" && Array.isArray(e.transfer)) return e.transfer;
}
var Ec = class {
  constructor(e, t = {}) {
    this.env = As(), this.options = t && typeof t == "object" ? t : {}, this._listeners = /* @__PURE__ */ new Map(), this.worker = Ts(e, this.options, this.env), this._wireEvents();
  }
  static create(e, t) {
    return Ts(e, t || {}, As());
  }
  _wireEvents() {
    const e = this.worker;
    if (e)
      if (typeof e.addEventListener == "function") {
        this._nativeModel = "listener";
        for (const t of Es) e.addEventListener(t, (...n) => this._dispatch(t, ...n));
      } else if (typeof e.on == "function") {
        this._nativeModel = "emitter";
        for (const t of Es) e.on(t, (...n) => this._dispatch(t, ...n));
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
    const r = Ac(t);
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
}, xi = class {
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
}, Tc = /* @__PURE__ */ Symbol("PowerSubscriberSet.original"), On = class {
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
      t[Tc] = e;
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
function Ls(e) {
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
var jc = class {
  constructor(e = {}) {
    this._listeners = /* @__PURE__ */ new Map(), this._maxListeners = Number.isFinite(Number(e.maxListeners)) ? Math.max(0, Number(e.maxListeners)) : 0, this._weak = !!e.weak, this._fr = null, this._finalizationRefs = /* @__PURE__ */ new WeakMap(), this._eventFinalizationRefs = /* @__PURE__ */ new Map();
  }
  _ensureFinalizationRegistry() {
    return !this._weak || typeof FinalizationRegistry > "u" ? null : this._fr ? this._fr : (this._fr = new FinalizationRegistry((e) => {
      try {
        const { event: t, ref: n } = e, r = this._listeners.get(t), i = this._eventFinalizationRefs.get(t);
        if (i && n && (i.delete(n), i.size === 0 && this._eventFinalizationRefs.delete(t)), !r) return;
        Ls(r), r.size === 0 && (this._listeners.delete(t), this._eventFinalizationRefs.delete(t));
      } catch {
      }
    }), this._fr);
  }
  cleanup() {
    if (this._weak)
      for (const [e, t] of this._listeners)
        Ls(t), t.size === 0 && (this._clearWeakListenerEvent(e), this._listeners.delete(e));
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
}, Rc = class {
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
}, Lc = class extends Error {
  constructor(e = "PowerPool has been shut down") {
    super(e), this.name = "PowerPoolShutdownError";
  }
}, Ga = class {
  constructor(e, t = {}) {
    const n = typeof navigator < "u" && navigator.hardwareConcurrency || 2, { size: r = Math.min(n, 2), minSize: i = 2, maxSize: a = Math.max(r, n), workerOptions: o = {}, maxTasksPerWorker: s, idleTimeout: l = Ul, taskQueue: c = !0, queuePolicy: u = "enqueue", lazy: d = !0, awaitResponseTimeout: f = wa, slowTaskThreshold: p = 1 / 0, autoScale: m = !1 } = t, g = s === void 0 && m ? 1 : s ?? 1 / 0;
    if (typeof e != "function" && typeof e != "string") throw new TypeError("PowerPool workerSource must be a function or string");
    this._workerSource = e, this._workerOptions = o, this._maxTasksPerWorker = g, this.minSize = Math.max(0, i), this.maxSize = Math.max(this.minSize, a), this.idleTimeout = Math.max(0, l), this.taskQueueEnabled = !!c, this._queuePolicy = [
      "enqueue",
      "drop-oldest",
      "drop-newest",
      "reject"
    ].includes(u) ? u : "enqueue", this._createdAt = $e(), this._totalWorkersCreated = 0, this._totalTasksCompleted = 0, this._taskDurationsWelfordCount = 0, this._taskDurationsWelfordMean = 0, this._taskDurationsWelfordM2 = 0, this._taskDurationsMin = Number.POSITIVE_INFINITY, this._taskDurationsMax = Number.NEGATIVE_INFINITY, this._slowTaskThreshold = Number.isFinite(p) ? Number(p) : 1 / 0, this._slowTaskCount = 0, this._ewmaLatency = null, this._autoScale = null, this._autoScaleInterval = null, this._lastAutoScaleAt = 0, this._terminatedWorkerTaskCountsTotal = 0, this._terminatedWorkerTaskCountsCount = 0, this.workers = [], this.queue = new xi();
    const _ = {
      maxListeners: t?.listenerMaxListeners ?? t?.maxListeners,
      weak: !!t?.weakListeners
    };
    this._bus = new jc(_), this._queueHighThreshold = Number.isFinite(Number(t?.queueHighThreshold)) ? Math.max(0, Math.floor(Number(t?.queueHighThreshold))) : 1 / 0, this._queueHighCrossed = !1, this._onmessage = null, this._onerror = null, this._onidle = null, this._onresize = null, this._nextIndex = 0, this._nextWorkerId = 0, this._correlationCounter = 0, this._activeTasks = 0, this._isIdle = !0, this._queuePaused = !1;
    const h = typeof t?.debugLevel == "number" ? t.debugLevel : 1;
    if (this._logger = new bo(h, { name: "powerPool" }), arguments.length > 1 && arguments[1] != null && typeof arguments[1] != "object") throw new TypeError("PowerPool options must be an object");
    this._pendingResponses = /* @__PURE__ */ new Map(), this._underlyingToWorkerObj = /* @__PURE__ */ new Map(), this._defaultAwaitResponseTimeout = Number.isFinite(Number(f)) ? Math.max(0, Math.floor(Number(f))) : wa;
    const w = d ? Math.min(this.minSize, this.maxSize) : Math.min(Math.max(r, this.minSize), this.maxSize);
    for (let b = 0; b < w; b++) try {
      this._addWorkerInstance();
    } catch (k) {
      try {
        if ((k?.message ? String(k.message) : "").includes("Invalid workerSource")) throw k;
      } catch (E) {
        throw E;
      }
      try {
        this._logger.error(k, "Initial worker creation failed");
      } catch (E) {
        this._debugLog?.(E, "Initial worker creation: logger error");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "init",
          error: k
        });
      } catch (E) {
        this._debugLog?.(E, "Initial worker creation: bus.emit failed");
      }
      break;
    }
    if (this._reaperInterval = setInterval(() => this._reapIdleWorkers(), Math.max(hs, Math.floor(this.idleTimeout / 2))), this._encodeCache = /* @__PURE__ */ new Map(), this._encodeCacheLimit = Math.max(16, t?.encodeCacheLimit ? t.encodeCacheLimit : 64), this._encodeCacheByteLimit = Number.isFinite(Number(t?.encodeCacheByteLimit)) ? Math.max(0, Number(t?.encodeCacheByteLimit)) : 1 / 0, this._encodeCacheBytes = 0, t?.autoScale) {
      const b = typeof t.autoScale == "object" ? t.autoScale : {}, k = Number.isFinite(Number(b.intervalMs)) ? Math.max(100, Math.floor(b.intervalMs)) : Fl, E = Number.isFinite(Number(b.targetMs)) ? Math.max(1, Number(b.targetMs)) : 50, z = Number.isFinite(Number(b.alpha)) ? Math.max(0, Math.min(1, Number(b.alpha))) : 0.2, W = Number.isFinite(Number(b.cooldownMs)) ? Math.max(0, Math.floor(b.cooldownMs)) : ql, F = Number.isFinite(Number(b.hysteresis)) ? Math.max(0, Math.min(1, Number(b.hysteresis))) : 0.2, K = Number.isFinite(Number(b.stepUp)) ? Math.max(1, Math.floor(Number(b.stepUp))) : 1, se = Number.isFinite(Number(b.stepDown)) ? Math.max(1, Math.floor(Number(b.stepDown))) : 1, he = Number.isFinite(Number(b.backoffFactor)) ? Math.max(1, Number(b.backoffFactor)) : 1, ie = Number.isFinite(Number(b.backoffMaxMultiplier)) ? Math.max(1, Number(b.backoffMaxMultiplier)) : 8, C = Number.isFinite(Number(b.backoffResetMs)) ? Math.max(0, Math.floor(Number(b.backoffResetMs))) : W * 4;
      this._autoScale = {
        enabled: !0,
        intervalMs: k,
        targetMs: E,
        alpha: z,
        cooldownMs: W,
        hysteresis: F,
        stepUp: K,
        stepDown: se,
        backoffFactor: he,
        backoffMaxMultiplier: ie,
        backoffResetMs: C
      }, this._autoScaleBackoffMultiplier = 1;
      try {
        this._autoScaleInterval = setInterval(() => this._autoScaleTick(), k);
      } catch (I) {
        this._debugLog?.(I, "autoScale: interval setup failed");
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
      this._reaperInterval || (this._reaperInterval = setInterval(() => this._reapIdleWorkers(), Math.max(hs, Math.floor(this.idleTimeout / 2))));
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
      } catch (u) {
        this._debugLog?.(u, "tryGrowPool: logger.error failed");
      }
      try {
        this._bus.emit("pool:error", {
          phase: "grow",
          error: c
        });
      } catch (u) {
        this._debugLog?.(u, "tryGrowPool: bus.emit failed");
      }
      if (i && a) {
        try {
          this._cleanupPendingResponse(a, { rejectWith: c });
        } catch (u) {
          this._debugLog?.(u, "tryGrowPool: cleanupPendingResponse failed");
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
        this._cleanupPendingResponse(t, { rejectWith: new Lc("pool:shutdown") });
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
    }), this.workers = [], this.queue = new xi(), this._queueHighCrossed = !1, this._activeTasks = 0, this._updateIdleState();
  }
  _encodeForTransfer(e) {
    try {
      const t = JSON.stringify(e);
      if (typeof t == "string" && t.length > 2048) return sa(e);
      const n = this._encodeCache.get(t);
      if (n) {
        try {
          this._encodeCache.delete(t), this._encodeCache.set(t, n);
        } catch {
        }
        return n;
      }
      const r = sa(e, t), i = r?.byteLength || 0, a = () => this._encodeCache.size >= this._encodeCacheLimit || this._encodeCacheByteLimit !== 1 / 0 && this._encodeCacheBytes + i > this._encodeCacheByteLimit;
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
            const u = this._encodeCache.get(c), d = typeof u?.byteLength == "number" ? u.byteLength : 0;
            this._encodeCacheBytes = Math.max(0, this._encodeCacheBytes - d);
          } catch {
          }
          this._encodeCache.delete(c);
        }
      }
      return this._encodeCache.set(t, r), r?.byteLength && (this._encodeCacheBytes += r.byteLength), r;
    } catch {
      return sa(e);
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
          const c = this._encodeForTransfer(s), u = n ? c.slice() : c;
          i[a] = {
            message: u,
            transfer: n ? [u.buffer] : void 0
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
    return Ec.create(this._workerSource, this._workerOptions);
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
    const t = this._createWorkerInstance(), n = new Rc(t, this._logger, this), r = {
      id: e,
      worker: n,
      tasks: 0,
      lastActive: $e(),
      latencyEwma: null,
      _startTimes: new xi()
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
          const u = String(c.correlationId), d = Object.prototype.hasOwnProperty.call(c, "response") ? c.response : c;
          this._cleanupPendingResponse(u, { resolveWith: d });
        }
      } catch (c) {
        this._debugLog?.(c, "worker.onmessage: resolve pending response");
      }
      try {
        const c = r._startTimes?.length ? r._startTimes.shift() : null;
        let u = null;
        try {
          const d = s?.data;
          if (typeof d?.duration == "number" && Number.isFinite(d.duration) ? u = Math.max(0, Number(d.duration)) : c != null && (u = Math.max(0, l - c)), u != null) {
            const f = this._autoScale?.alpha || 0.2;
            r.latencyEwma == null ? r.latencyEwma = u : r.latencyEwma = f * u + (1 - f) * r.latencyEwma, this._ewmaLatency == null ? this._ewmaLatency = u : this._ewmaLatency = f * u + (1 - f) * this._ewmaLatency, this._totalTasksCompleted = (this._totalTasksCompleted || 0) + 1, r.completedTasks = (r.completedTasks || 0) + 1;
            const p = 1, m = this._taskDurationsWelfordCount;
            this._taskDurationsWelfordCount = m + p;
            const g = u - this._taskDurationsWelfordMean;
            this._taskDurationsWelfordMean += g * p / this._taskDurationsWelfordCount;
            const _ = u - this._taskDurationsWelfordMean;
            this._taskDurationsWelfordM2 += g * _, u < this._taskDurationsMin && (this._taskDurationsMin = u), u > this._taskDurationsMax && (this._taskDurationsMax = u), Number.isFinite(this._slowTaskThreshold) && u > this._slowTaskThreshold && (this._slowTaskCount = (this._slowTaskCount || 0) + 1);
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
        } catch (u) {
          this._debugLog?.(u, "dispatch queued message to worker failed"), this._logger.error(u, "Failed to dispatch queued message to worker");
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
        c = xc(l);
      } catch (d) {
        try {
          o(d);
        } catch (f) {
          this._debugLog?.(f, "_handleMessage: _handleMessageError failed");
        }
        c = l;
      }
      const u = s?.data !== void 0 && c === l ? s : {
        data: c,
        originalEvent: s
      };
      if (typeof n.onmessage == "function") try {
        n.onmessage(u);
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
    const r = $e(), i = n?.workerId != null ? n.workerId : null, a = i == null && this.workers.length === 1 && this._maxTasksPerWorker === 1 / 0, o = i != null ? this.workers.find((f) => f.id === i) : a ? this.workers[0] : this._findLeastLoadedWorker(), s = !!(n?.awaitResponse || n?.correlationId != null);
    let l, c;
    if (s) {
      if (l = n.correlationId != null ? String(n.correlationId) : this._generateCorrelationId(), !(e !== null && typeof e == "object" && !ArrayBuffer.isView(e) && !(e instanceof ArrayBuffer))) throw new Error("postMessage awaitResponse requires a plain-object message");
      e = Object.assign({}, e, { correlationId: l });
      const f = this._createPendingResponsePromise(l, n);
      c = f.pendingPromise, l = f.correlationKey;
    }
    if (o?.tasks < this._maxTasksPerWorker) try {
      const f = r, p = this._prepareForTransfer(e, t, n);
      return this._postToWorkerObj(o, p, f, s, l, c);
    } catch (f) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: f });
        } catch (p) {
          this._debugLog?.(p, "postMessage: cleanupPendingResponse failed");
        }
        try {
          this._logger.error(f, "Failed to postMessage to worker");
        } catch (p) {
          this._debugLog?.(p, "postMessage: logger.error failed");
        }
        return c;
      }
      try {
        this._logger.error(f, "Failed to postMessage to worker");
      } catch (p) {
        this._debugLog?.(p, "postMessage: logger.error failed");
      }
      return !1;
    }
    if (i != null && (!o || o.tasks >= this._maxTasksPerWorker)) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: /* @__PURE__ */ new Error("targeted worker unavailable") });
        } catch (f) {
          this._debugLog?.(f, "postMessage: cleanupPendingResponse failed");
        }
        return c;
      }
      return !1;
    }
    if (i == null && this.workers.length < this.maxSize) {
      const f = r;
      return this._tryGrowPool(e, t, n, f, s, l, c);
    }
    if (this.taskQueueEnabled) {
      const f = this._prepareForTransfer(e, t, n);
      return this._enqueueOrReject(f, s, l, c);
    }
    if (!this.workers.length) return s ? c : !1;
    const u = this._nextIndex % this.workers.length;
    this._nextIndex = (this._nextIndex + 1) % this.workers.length;
    const d = this.workers[u];
    try {
      const f = r, p = this._prepareForTransfer(e, t, n);
      return this._postToWorkerObj(d, p, f, s, l, c);
    } catch (f) {
      if (s && l) {
        try {
          this._cleanupPendingResponse(l, { rejectWith: f });
        } catch (p) {
          this._debugLog?.(p, "postMessage: cleanupPendingResponse failed");
        }
        try {
          this._logger.error(f, "Failed to postMessage to fallback worker");
        } catch (p) {
          this._debugLog?.(p, "postMessage: logger.error failed");
        }
        return c;
      }
      try {
        this._logger.error(f, "Failed to postMessage to fallback worker");
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
      for (let f = 0; f < e.length; f++) {
        const p = e[f] || {}, m = Object.assign({}, t);
        r && (m.correlationId = String(r(f, p))), d[f] = this.postMessage(p.message, p.transfer, m);
      }
      return d;
    }
    const i = new Array(e.length), a = [], o = t?.workerId != null ? t.workerId : null, s = this.prepareBuffers(e, {
      clone: !0,
      zeroCopy: !!t?.zeroCopy
    });
    if (o == null && this.workers.length === 1 && this._maxTasksPerWorker === 1 / 0) {
      const d = this.workers[0];
      let f = !1;
      for (let p = 0; p < e.length; p++) {
        const m = s[p] || {
          message: e[p]?.message,
          transfer: e[p]?.transfer
        };
        try {
          const g = $e();
          m.transfer?.length ? d.worker.postMessage(m.message, m.transfer) : d.worker.postMessage(m.message), typeof d._startTimes?.push == "function" && d._startTimes.push(g), d.tasks++, this._activeTasks++, d.lastActive = g, f = !0, i[p] = !0;
        } catch {
          i[p] = !1;
        }
      }
      return f && this._updateIdleState(), i;
    }
    const l = o != null;
    let c = null;
    if (l) {
      if (c = this.workers.find((d) => d.id === o), !c) return e.map(() => !1);
    } else c = this._findLeastLoadedWorker();
    let u = !1;
    for (let d = 0; d < e.length; d++) {
      const f = e[d] || {}, p = s[d] || {
        message: f.message,
        transfer: f.transfer
      };
      let m = !1;
      c?.tasks >= this._maxTasksPerWorker && (c = null);
      let g = c;
      if (!g && !l && (g = this._findLeastLoadedWorker()), g?.tasks < this._maxTasksPerWorker) try {
        const _ = $e();
        p.transfer?.length ? g.worker.postMessage(p.message, p.transfer) : g.worker.postMessage(p.message), typeof g._startTimes?.push == "function" && g._startTimes.push(_), g.tasks++, this._activeTasks++, g.lastActive = _, u = !0, i[d] = !0, m = !0, c = g.tasks < this._maxTasksPerWorker ? g : null;
      } catch {
        i[d] = !1, m = !0;
      }
      if (!m && o == null && this.workers.length < this.maxSize)
        try {
          const _ = this._addWorkerInstance();
          if (!_)
            i[d] = !1, m = !0;
          else {
            const h = $e();
            p.transfer?.length ? _.worker.postMessage(p.message, p.transfer) : _.worker.postMessage(p.message), typeof _._startTimes?.push == "function" && _._startTimes.push(h), _.tasks++, this._activeTasks++, _.lastActive = h, u = !0, i[d] = !0, m = !0, c = _.tasks < this._maxTasksPerWorker ? _ : null;
          }
        } catch (_) {
          try {
            this._logger.error(_, "postMessageBatch: add worker failed");
          } catch {
          }
          try {
            this._bus.emit("pool:error", {
              phase: "postMessageBatch",
              error: _
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
          const _ = this._queuePolicy;
          if (_ === "reject" || _ === "drop-newest" && this.queue.length > 0) i[d] = !1;
          else {
            if (_ === "drop-oldest" && this.queue.length > 0) {
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
          const _ = this._nextIndex % this.workers.length;
          this._nextIndex = (this._nextIndex + 1) % this.workers.length;
          const h = this.workers[_];
          try {
            const w = $e();
            p.transfer?.length ? h.worker.postMessage(p.message, p.transfer) : h.worker.postMessage(p.message), typeof h._startTimes?.push == "function" && h._startTimes.push(w), h.tasks++, this._activeTasks++, h.lastActive = w, u = !0, i[d] = !0;
          } catch (w) {
            i[d] = !1, this._logger.error(w, "Failed to postMessage to fallback worker");
          }
        }
      }
    }
    if (a.length) try {
      this.queue.pushMany(a), u = !0;
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
    return u && this._updateIdleState(), i;
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
          for (let f = 0; f < d; f++) try {
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
      const u = r * Math.max(0, 1 - i);
      if (a != null && a < u && this.queue.length === 0 && o > this.minSize)
        try {
          const d = Math.min(o - this.minSize, t.stepDown || 1);
          let f = 0;
          for (let p = this.workers.length - 1; p >= 0 && f < d; p--) {
            const m = this.workers[p];
            if (!m || m.tasks > 0) continue;
            try {
              m.worker.terminate();
            } catch (_) {
              this._debugLog?.(_, "autoScale: terminate worker");
            }
            this._deleteWorkerUnderlyingMapping(m), this._terminatedWorkerTaskCountsTotal += m.completedTasks || 0, this._terminatedWorkerTaskCountsCount += 1;
            const g = this.workers.length - 1;
            p === g ? this.workers.pop() : this.workers[p] = this.workers.pop(), f++;
          }
          f > 0 && (this._lastAutoScaleAt = e, this._autoScaleBackoffMultiplier = Math.min((this._autoScaleBackoffMultiplier || 1) * (t.backoffFactor || 1), t.backoffMaxMultiplier || 8));
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
    const e = this.workers.map((_) => ({
      id: _.id,
      tasks: _.tasks,
      lastActive: _.lastActive
    })), t = $e(), n = this._createdAt != null ? Math.max(0, t - this._createdAt) : 0, r = this._totalWorkersCreated || this.workers.length, i = this._totalTasksCompleted || 0, a = this._terminatedWorkerTaskCountsCount || 0, o = this._terminatedWorkerTaskCountsTotal || 0;
    let s = 0;
    for (const _ of this.workers) s += _.completedTasks || 0;
    const l = a + (this.workers.length || 0), c = l > 0 ? (o + s) / l : 0;
    let u = 0, d = 0, f = 0, p = 0, m = 0;
    const g = this._taskDurationsWelfordCount || 0;
    if (g > 0) {
      u = this._taskDurationsMin === Number.POSITIVE_INFINITY ? 0 : this._taskDurationsMin, d = this._taskDurationsMax === Number.NEGATIVE_INFINITY ? 0 : this._taskDurationsMax, f = this._taskDurationsWelfordMean;
      const _ = g > 1 ? this._taskDurationsWelfordM2 / g : 0;
      p = Math.sqrt(_), m = g > 0 ? (this._slowTaskCount || 0) / g * 100 : 0;
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
          min: u,
          average: f,
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
}, Cc = class {
  constructor(e = {}) {
    const { capacity: t = 1, queueCapacity: n = 1 / 0, initialTokens: r } = e || {};
    this._capacity = Math.max(1, Math.floor(Number(t) || 1)), this._queueCapacity = Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 1 / 0, this._available = Number.isFinite(r) ? Math.min(this._capacity, Math.max(0, Math.floor(Number(r)))) : this._capacity, this._waiters = new xi(16);
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
}, Po = class {
  constructor(e = 1) {
    this._gate = new Cc({
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
function Mc() {
  return typeof requestIdleCallback == "function" ? new Promise((e) => {
    try {
      requestIdleCallback(e, { timeout: 50 });
    } catch {
      setTimeout(e, 0);
    }
  }) : new Promise((e) => setTimeout(e, 0));
}
async function kn(e, t = 50) {
  try {
    if (!e || !t) return;
    e % t === 0 && await Mc();
  } catch {
  }
}
var Pc = /* @__PURE__ */ Fi({
  CRAWL_MAX_QUEUE: () => Go,
  HOME_SLUG: () => Kt,
  _setAllMd: () => Wo,
  _setSearchIndex: () => Mr,
  _storeSlugMapping: () => kt,
  addSlugResolver: () => Dc,
  allMarkdownPaths: () => ht,
  allMarkdownPathsSet: () => Qe,
  availableLanguages: () => pt,
  awaitSearchIndex: () => Ta,
  buildSearchIndex: () => Un,
  buildSearchIndexWorker: () => va,
  clearFetchCache: () => Hc,
  clearListCaches: () => Uc,
  crawlAllMarkdown: () => Qo,
  crawlCache: () => Ai,
  crawlForSlug: () => Yo,
  crawlForSlugWorker: () => $c,
  defaultCrawlMaxQueue: () => Qr,
  ensureSlug: () => Ko,
  fetchCache: () => zt,
  fetchMarkdown: () => Ke,
  getFetchConcurrency: () => Ir,
  getLanguages: () => Za,
  getSearchIndex: () => Qc,
  homePage: () => At,
  initSlugWorker: () => Gi,
  isExternalLink: () => qc,
  isExternalLinkWithBase: () => Yr,
  listPathsFetched: () => Ni,
  listSlugCache: () => Pr,
  mdToSlug: () => be,
  negativeFetchCache: () => En,
  notFoundPage: () => Se,
  removeSlugResolver: () => Bc,
  resolveSlugPath: () => rr,
  searchIndex: () => oe,
  setContentBase: () => Xa,
  setDefaultCrawlMaxQueue: () => Vo,
  setFetchCacheMaxSize: () => Gc,
  setFetchCacheTTL: () => Vc,
  setFetchConcurrency: () => Ho,
  setFetchMarkdown: () => Xc,
  setFetchNegativeCacheTTL: () => qo,
  setHomePage: () => Uo,
  setLanguages: () => Oo,
  setNegativeFetchCacheMaxSize: () => Zc,
  setNotFoundPage: () => Bo,
  setSkipRootReadme: () => No,
  skipRootReadme: () => Va,
  slugResolvers: () => Vi,
  slugToMd: () => te,
  slugify: () => ke,
  storeSlugMapping: () => ft,
  teardownSlugWorkerPool: () => Oc,
  unescapeMarkdown: () => vi,
  uniqueSlug: () => An,
  watchForColdHashRoute: () => Si,
  whenSearchIndexReady: () => vn
}), Cs = 0, Ii = /* @__PURE__ */ new Map();
function Si(e) {
  try {
    if (!e) return;
    let t = Kt, n = "";
    if (e.type === "cosmetic") {
      const i = e.page != null && String(e.page).trim() !== "";
      t = i ? String(e.page) : Kt, n = "#/" + (i ? String(e.page) : ""), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
    } else if (e.type === "path") {
      const i = e.page != null && String(e.page).trim() !== "";
      t = i ? String(e.page) : Kt, n = "/" + (i ? String(e.page) : ""), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
    } else if (e.type === "canonical")
      if (e.page)
        t = e.page, n = "?page=" + encodeURIComponent(e.page), e.anchor && (n += "#" + String(e.anchor)), e.params && (n += "?" + String(e.params));
      else {
        t = Kt;
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
function Io(e, t) {
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
  te.set = function(e, t) {
    const n = Map.prototype.has.call(this, e), r = Map.prototype.set.call(this, e, t);
    try {
      n || Io(e, typeof t == "string" ? t : t?.default ?? Object.values(t?.langs ?? {})[0] ?? "");
    } catch {
    }
    return r;
  };
} catch {
}
var pt = [], Va = !1;
function No(e) {
  Va = !!e;
}
function Oo(e) {
  pt = Array.isArray(e) ? e.slice() : [];
}
function Za() {
  return pt;
}
async function zo(e, t, n = 4, r) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new Po(Math.max(1, Number(n) || 1));
  return Promise.all(e.map((a, o) => i.run(() => t(a, o), { signal: r })));
}
var Hi = Eo(), Ic = {
  intervalMs: 750,
  targetMs: 120,
  hysteresis: 0.3,
  cooldownMs: 1e3,
  stepUp: 1,
  stepDown: 1
}, Cr = null;
function Nc() {
  const e = {
    size: Hi,
    minSize: 2,
    autoScale: Ic,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    e.debugLevel = 0;
  } catch {
  }
  try {
    return new Ga(bc, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("slug worker unavailable");
      }
    };
  }
}
function $o() {
  return Cr || (Cr = Nc()), Cr;
}
function Oc() {
  const e = Cr;
  if (Cr = null, !!e)
    try {
      typeof e.drain == "function" && e.drain().catch(() => {
      }), typeof e.terminate == "function" && e.terminate(), typeof e.dispose == "function" && e.dispose();
    } catch (t) {
      S("[slugManager] teardownSlugWorkerPool failed", t);
    }
}
function zc() {
  try {
    return ko();
  } catch {
    return !1;
  }
}
function Gi() {
  return $o().workers?.[0]?.worker?._underlying ?? null;
}
function Do(e) {
  return Gi?.() ? $o().postMessage(e, void 0, {
    awaitResponse: !0,
    timeout: 5e3
  }).then((t) => {
    if (t?.error) throw new Error(t.error);
    return t;
  }).catch((t) => {
    throw (t?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : t;
  }) : Promise.reject(/* @__PURE__ */ new Error("slug worker required but unavailable"));
}
async function va(e, t = 1, n = void 0, r = void 0) {
  if (!Gi?.()) throw new Error("slug worker required but unavailable");
  return await Do({
    type: "buildSearchIndex",
    contentBase: e,
    indexDepth: t,
    noIndexing: n,
    seedPaths: r
  });
}
async function $c(e, t, n) {
  if (!Gi?.()) throw new Error("slug worker required but unavailable");
  return Do({
    type: "crawlForSlug",
    slug: e,
    base: t,
    maxQueue: n
  });
}
function kt(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = re(typeof t == "string" ? t : String(t ?? ""));
  } catch {
    n = String(t ?? "");
  }
  if (n) {
    try {
      if (pt?.length) {
        const r = String(n).split("/")[0], i = Array.isArray(pt) ? pt.length > 8 ? (pt._set ||= new Set(pt)).has(r) : pt.includes(r) : !1;
        let a = te.get(e);
        if (!a || typeof a == "string") a = {
          default: typeof a == "string" ? re(a) : void 0,
          langs: {}
        };
        else try {
          a.default && (a.default = re(a.default));
        } catch {
        }
        i ? a.langs[r] = n : a.default = n, te.set(e, a);
      } else {
        const r = te.has(e) ? te.get(e) : void 0;
        if (!r) te.set(e, n);
        else {
          let i = null;
          try {
            typeof r == "string" ? i = re(r) : r && typeof r == "object" && (i = r.default ? re(r.default) : null);
          } catch {
            i = null;
          }
          if (i === n) te.set(e, n);
          else {
            let a = null, o = 2;
            for (; a = `${e}-${o}`, !!te.has(a); ) {
              let s = te.get(a), l = null;
              try {
                typeof s == "string" ? l = re(s) : s && typeof s == "object" && (l = s.default ? re(s.default) : null);
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
              if (!te.has(a))
                te.set(a, n), e = a;
              else if (te.get(a) === n) e = a;
              else {
                const s = /* @__PURE__ */ new Set();
                for (const c of te.keys()) s.add(c);
                const l = typeof An == "function" ? An(e, s) : `${e}-2`;
                te.set(l, n), e = l;
              }
            } catch (s) {
              S("[slugManager] slug collision resolution failed", s);
            }
          }
        }
      }
    } catch {
    }
    try {
      if (n) {
        try {
          be.set(n, e);
        } catch {
        }
        Qe && !Qe.has(n) && (Qe.add(n), Array.isArray(ht) && ht.push(n));
      }
    } catch {
    }
  }
}
function ft(e, t) {
  return kt(e, t);
}
var Vi = /* @__PURE__ */ new Set();
function Dc(e) {
  typeof e == "function" && Vi.add(e);
}
function Bc(e) {
  typeof e == "function" && Vi.delete(e);
}
var Aa = {}, Se = "_404.md", At = null, Kt = "_home";
function Bo(e) {
  if (e == null) {
    Se = null;
    return;
  }
  Se = String(e ?? "");
}
function Uo(e) {
  if (e == null) {
    At = null;
    return;
  }
  At = String(e ?? "");
  try {
    try {
      Io(Kt, At);
    } catch {
    }
  } catch {
  }
}
function Wo(e) {
  Aa = e || {};
}
function Mr(e) {
  try {
    if (Array.isArray(oe) || (oe = []), !Array.isArray(e)) return;
    try {
      oe.length = 0;
      for (const t of e) oe.push(t);
      try {
        if (typeof window < "u") try {
          window.__nimbiLiveSearchIndex = oe;
        } catch {
        }
      } catch {
      }
    } catch (t) {
      pe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        oe = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
var Pr = /* @__PURE__ */ new Map(), Ni = /* @__PURE__ */ new Set();
function Uc() {
  Pr.clear(), Ni.clear();
}
function Wc(e) {
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
var Fc = new ar(function(e) {
  let n = String(e ?? "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, {
  keyResolver: (e) => e === void 0 ? "__undefined" : String(e),
  cacheOptions: { maxEntries: 2e3 }
}), ke = (e) => Fc.run(e);
function Xa(e) {
  te.clear(), be.clear(), mc([]);
  try {
    Qe.clear();
  } catch {
  }
  pt = pt || [];
  const t = !!pt?.length, n = /* @__PURE__ */ new Set(), r = Object.keys(Aa || {});
  if (!r.length) return;
  let i = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? i = new URL(String(e)).pathname : i = String(e ?? "");
      } catch (a) {
        i = String(e ?? ""), pe("[slugManager] parse contentBase failed", a);
      }
      i = jn(i);
    }
  } catch (a) {
    i = "", pe("[slugManager] setContentBase prefix derivation failed", a);
  }
  i || (i = Wc(r));
  for (const a of r) {
    let o = a;
    i && a.startsWith(i) ? o = re(a.slice(i.length)) : o = re(a), ht.push(o);
    try {
      Qe.add(o);
    } catch {
    }
    const s = Aa[a];
    if (typeof s == "string") {
      const l = (s || "").match(/^#\s+(.+)$/m);
      if (l && l[1]) {
        const c = ke(l[1].trim());
        if (c) try {
          let u = c;
          if (t || (u = An(u, n)), t) {
            const d = o.split("/")[0], f = Array.isArray(pt) ? pt.length > 8 ? (pt._set ||= new Set(pt)).has(d) : pt.includes(d) : !1;
            let p = te.get(u);
            (!p || typeof p == "string") && (p = {
              default: typeof p == "string" ? p : void 0,
              langs: {}
            }), f ? p.langs[d] = o : p.default = o, te.set(u, p);
          } else
            te.set(u, o), n.add(u);
          be.set(o, u);
        } catch (u) {
          pe("[slugManager] set slug mapping failed", u);
        }
      }
    }
  }
  try {
    er();
  } catch (a) {
    pe("[slugManager] refreshIndexPaths failed", a);
  }
}
try {
  Xa();
} catch (e) {
  pe("[slugManager] initial setContentBase failed", e);
}
function An(e, t) {
  if (!t.has(e)) return e;
  let n = 2, r = `${e}-${n}`;
  for (; t.has(r); )
    n += 1, r = `${e}-${n}`;
  return r;
}
function qc(e) {
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
function vi(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function rr(e) {
  if (!e || !te.has(e)) return null;
  const t = te.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (pt?.length && $t && t.langs && t.langs[$t])
    return t.langs[$t];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
var zt = new Zr({ maxEntries: 2e3 });
function Hc() {
  zt.clear(), En.clear();
}
var En = new Zr({ maxEntries: 2e3 }), Fo = 6e4;
function qo(e) {
  Fo = Number(e) || 0;
}
function Gc(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    zt && typeof zt.maxEntries < "u" && (zt.maxEntries = t);
  } catch {
  }
}
function Vc(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    zt && typeof zt.defaultTTL < "u" && (zt.defaultTTL = t);
  } catch {
  }
}
function Zc(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    En && typeof En.maxEntries < "u" && (En.maxEntries = t);
  } catch {
  }
}
var Ea = Math.max(1, Math.min(Hi, 5));
function Ho(e) {
  try {
    Ea = Math.max(1, Number(e) || 1);
  } catch {
    Ea = 1;
  }
}
function Ir() {
  return Ea;
}
var Ke = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1)) try {
      const u = yt(e);
      u?.page && (e = u.page);
    } catch {
    }
  } catch {
  }
  try {
    const u = (String(e ?? "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1], d = typeof e == "string" && String(e).indexOf("/") === -1;
    if (u && d && te.has(u)) {
      const f = rr(u) || te.get(u);
      f && f !== e && (e = f);
    }
  } catch (u) {
    pe("[slugManager] slug mapping normalization failed", u);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const u = String(e).split("::", 1)[0];
      if (u) try {
        if (te.has(u)) {
          const d = rr(u) || te.get(u);
          d ? e = d : e = u;
        } else e = u;
      } catch {
        e = u;
      }
    }
  } catch (u) {
    pe("[slugManager] path sanitize failed", u);
  }
  try {
    if (t) try {
      let u = (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? new URL(String(t)) : new URL(String(t), typeof location < "u" ? location.origin : "http://localhost")).pathname || "";
      if (u = u.replace(/^\/+|\/+$/g, ""), u) try {
        const d = String(e ?? "");
        if (!/^[a-z][a-z0-9+.-]*:/i.test(d)) {
          let f = d.replace(/^\/+/, "");
          f === u ? e = "" : f.startsWith(u + "/") ? e = f.slice(u.length + 1) : e = f;
        }
      } catch {
      }
    } catch {
    }
  } catch {
  }
  if (!(n?.force === !0 || typeof Se == "string" && Se || te?.size || Qe?.size || ko())) throw new Error("failed to fetch md");
  const r = t == null ? "" : Wn(String(t));
  let i = "";
  try {
    const u = typeof location < "u" && location?.origin ? location.origin : "http://localhost";
    let d = u.replace(/\/$/, "") + "/";
    r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? d = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? d = u.replace(/\/$/, "") + r.replace(/\/$/, "") + "/" : d = u.replace(/\/$/, "") + "/" + r.replace(/\/$/, "") + "/");
    try {
      i = new URL(e.replace(/^\//, ""), d).toString();
    } catch {
      i = u.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
    }
  } catch {
    i = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  const a = n?.signal, o = async (u) => {
    const d = n && typeof n.timeoutMs == "number" ? Math.max(0, Number(n.timeoutMs) || 0) : 1e4;
    try {
      if (typeof Lr == "function") {
        const p = new Lr({ timeout: d });
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
            const _ = async () => {
              if (m?.aborted) {
                const w = /* @__PURE__ */ new Error("aborted");
                throw w.name = "AbortError", w;
              }
              return await fetch(u, m ? {
                signal: m,
                referrerPolicy: "no-referrer"
              } : { referrerPolicy: "no-referrer" });
            };
            if (typeof Sa == "function") try {
              const w = new Sa({
                attempts: 3,
                factor: 2,
                minDelay: 50
              });
              if (typeof w.run == "function") return await w.run(async () => {
                const b = await _();
                if (b && typeof b.status == "number" && b.status >= 500) {
                  const k = /* @__PURE__ */ new Error("server error");
                  throw k.status = b.status, k;
                }
                return b;
              });
            } catch {
            }
            let h;
            for (let w = 0; w < 3; w++) {
              if (m?.aborted) {
                const b = /* @__PURE__ */ new Error("aborted");
                throw b.name = "AbortError", b;
              }
              try {
                const b = await _();
                if (b && typeof b.status == "number" && b.status >= 500) {
                  if (h = /* @__PURE__ */ new Error("server error"), h.status = b.status, w < 2) {
                    const k = Math.pow(2, w) * 50;
                    await new Promise((E) => setTimeout(E, k));
                    continue;
                  }
                  throw h;
                }
                return b;
              } catch (b) {
                if (b && b.name === "AbortError") throw b;
                if (h = b, w < 2) {
                  const k = Math.pow(2, w) * 50;
                  await new Promise((E) => setTimeout(E, k));
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
    let f = a || null;
    try {
      !f && typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" ? f = AbortSignal.timeout(d) : f && typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function" && typeof AbortSignal.any == "function" && (f = AbortSignal.any([f, AbortSignal.timeout(d)]));
    } catch {
    }
    return await fetch(u, f ? { signal: f } : void 0);
  };
  try {
    const u = En.get(i);
    if (u && u > Date.now()) return Promise.reject(/* @__PURE__ */ new Error("failed to fetch md"));
    u && En.delete(i);
  } catch {
  }
  if (zt.has(i)) return zt.get(i);
  const s = (async () => {
    let u;
    try {
      u = await o(i);
    } catch (g) {
      try {
        Rr("fetchMarkdown failed:", () => ({
          url: i,
          status: "fetch-error",
          error: g && g.message ? g.message : String(g)
        }));
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    if (!u || typeof u.ok != "boolean" || !u.ok) {
      if (u && u.status === 404 && typeof Se == "string" && Se)
        try {
          const _ = `${r}/${Se}`, h = await o(_);
          if (h && typeof h.ok == "boolean" && h.ok) return {
            raw: await h.text(),
            status: 404
          };
        } catch (_) {
          pe("[slugManager] fetching fallback 404 failed", _);
        }
      let g = "";
      try {
        u && typeof u.clone == "function" ? g = await u.clone().text() : u && typeof u.text == "function" ? g = await u.text() : g = "";
      } catch (_) {
        g = "", pe("[slugManager] reading error body failed", _);
      }
      try {
        const _ = u ? u.status : void 0;
        if (_ === 404) try {
          S("fetchMarkdown failed (404):", () => ({
            url: i,
            status: _,
            statusText: u ? u.statusText : void 0,
            body: g.slice(0, 200)
          }));
        } catch {
        }
        else try {
          Rr("fetchMarkdown failed:", () => ({
            url: i,
            status: _,
            statusText: u ? u.statusText : void 0,
            body: g.slice(0, 200)
          }));
        } catch {
        }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const d = await u.text(), f = d.trim().slice(0, 128).toLowerCase(), p = /^(?:<!doctype|<html|<title|<h1)/.test(f), m = p || String(e ?? "").toLowerCase().endsWith(".html");
    if (p && String(e ?? "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof Se == "string" && Se) {
          const g = `${r}/${Se}`, _ = await o(g);
          if (_.ok) return {
            raw: await _.text(),
            status: 404
          };
        }
      } catch (g) {
        pe("[slugManager] fetching fallback 404 failed", g);
      }
      throw zc() && Rr("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
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
      const u = new Promise((d, f) => {
        try {
          if (a.aborted) {
            const p = /* @__PURE__ */ new Error("aborted");
            return p.name = "AbortError", f(p);
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
          f(p);
        };
        try {
          a.addEventListener && a.addEventListener("abort", l);
        } catch {
        }
      });
      c = Promise.race([s, u]);
    }
  } catch {
  }
  return c.finally(() => {
    try {
      l && a && typeof a.removeEventListener == "function" && a.removeEventListener("abort", l);
    } catch {
    }
  }).catch((u) => {
    if (u && (u.name === "AbortError" || u.code === "EABORT" || u.code === "EDEADLINE")) {
      try {
        zt.delete(i);
      } catch {
      }
      throw u;
    }
    try {
      En.set(i, Date.now() + Fo);
    } catch {
    }
    try {
      zt.delete(i);
    } catch {
    }
    throw u;
  });
};
function Xc(e) {
  typeof e == "function" && (Ke = e);
}
var Ai = /* @__PURE__ */ new Map();
function Yc(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
var oe = [];
function Qc() {
  return oe;
}
try {
  if (typeof window < "u") try {
    Object.defineProperty(window, "__nimbiSearchIndex", {
      get() {
        return oe;
      },
      enumerable: !0,
      configurable: !0
    });
  } catch {
    try {
      window.__nimbiSearchIndex = oe;
    } catch {
    }
  }
} catch {
}
try {
  if (typeof window < "u") try {
    Object.defineProperty(window, "__nimbiIndexReady", {
      get() {
        return Ta;
      },
      enumerable: !0,
      configurable: !0
    });
  } catch {
    try {
      window.__nimbiIndexReady = Ta;
    } catch {
    }
  }
} catch {
}
var xn = null;
async function Un(e, t = 1, n = void 0, r = void 0) {
  const i = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => re(String(a ?? ""))))) : [];
  try {
    const a = re(String(Se ?? ""));
    a && !i.includes(a) && i.push(a);
  } catch {
  }
  if (oe && oe.length && t === 1 && !oe.some((a) => {
    try {
      return i.includes(re(String(a.path ?? "")));
    } catch {
      return !1;
    }
  }))
    return oe;
  if (xn) return xn;
  xn = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((h) => re(String(h ?? ""))))) : [], o = new Set(a);
    try {
      const h = re(String(Se ?? ""));
      h && !o.has(h) && (o.add(h), a.push(h));
    } catch {
    }
    const s = (h) => {
      if (!o || o.size === 0) return !1;
      for (const w of o)
        if (w && (h === w || h.startsWith(w + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(r) && r.length) for (const h of r) try {
        const w = re(String(h ?? ""));
        w && l.push(w);
      } catch {
      }
    } catch {
    }
    if (Array.isArray(ht) && ht.length) {
      const h = new Set(l);
      for (const w of ht) h.has(w) || (l.push(w), h.add(w));
    }
    if (!l.length) {
      if (be && typeof be.size == "number" && be.size) try {
        l = Array.from(be.keys());
      } catch {
        l = [];
      }
      else for (const h of te.values())
        if (h) {
          if (typeof h == "string") l.push(h);
          else if (h && typeof h == "object") {
            h.default && l.push(h.default);
            const w = h.langs || {};
            for (const b of Object.keys(w || {})) try {
              w[b] && l.push(w[b]);
            } catch {
            }
          }
        }
    }
    try {
      const h = await Qo(e);
      h && h.length && (l = l.concat(h));
    } catch (h) {
      pe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", h);
    }
    try {
      const h = new Set(l), w = [...l], b = Math.max(1, Math.min(Ir(), w.length || Ir()));
      let k = 0;
      const E = async () => {
        for (; !(h.size > Qr); ) {
          const W = w.shift();
          if (!W) break;
          try {
            const F = await Ke(W, e);
            if (F && F.raw) {
              if (F.status === 404) continue;
              let K = F.raw;
              const se = [], he = String(W ?? "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(he) && Va && (!W || !W.includes("/")))
                continue;
              const ie = Yc(K), C = /\[[^\]]+\]\(([^)]+)\)/g;
              let I;
              for (; I = C.exec(ie); ) se.push(I[1]);
              const j = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; I = j.exec(ie); ) se.push(I[1]);
              const T = W && W.includes("/") ? W.substring(0, W.lastIndexOf("/") + 1) : "";
              for (let N of se) try {
                if (Yr(N, e) || N.startsWith("..") || N.indexOf("/../") !== -1 || (T && !N.startsWith("./") && !N.startsWith("/") && !N.startsWith("../") && (N = T + N), N = re(N), !N || N.startsWith("#") || N.startsWith("?"))) continue;
                if (!/\.(md|html?)(?:$|[?#])/i.test(N)) {
                  const Y = N.split(/[?#]/)[0].replace(/\/+$/, ""), $ = String(Y).split("/").pop() || "";
                  if (/\.[^./]+$/i.test($)) continue;
                  const ne = [
                    `${Y}.md`,
                    `${Y}.html`,
                    `${Y}/README.md`,
                    `${Y}/README.html`
                  ];
                  for (const le of ne)
                    !le || s(le) || h.has(le) || (h.add(le), w.push(le), l.push(le));
                  continue;
                }
                if (N = N.split(/[?#]/)[0], s(N)) continue;
                h.has(N) || (h.add(N), w.push(N), l.push(N));
              } catch (Y) {
                pe("[slugManager] href processing failed", N, Y);
              }
            }
          } catch (F) {
            pe("[slugManager] discovery fetch failed for", W, F);
          }
          try {
            k++, await kn(k, 32);
          } catch {
          }
        }
      }, z = [];
      for (let W = 0; W < b; W++) z.push(E());
      await Promise.all(z);
    } catch (h) {
      pe("[slugManager] discovery loop failed", h);
    }
    const c = /* @__PURE__ */ new Set();
    l = l.filter((h) => !h || c.has(h) || s(h) ? !1 : (c.add(h), !0));
    const u = [], d = /* @__PURE__ */ new Map(), f = l.filter((h) => /\.(?:md|html?)(?:$|[?#])/i.test(h)), p = Math.max(1, Math.min(Ir(), f.length || 1)), m = f.slice(), g = [];
    for (let h = 0; h < p; h++) g.push((async () => {
      for (; m.length; ) {
        const w = m.shift();
        if (!w) break;
        try {
          const b = await Ke(w, e);
          d.set(w, b);
        } catch (b) {
          pe("[slugManager] buildSearchIndex: entry fetch failed", w, b), d.set(w, null);
        }
      }
    })());
    await Promise.all(g);
    let _ = 0;
    for (const h of l) {
      try {
        _++, await kn(_, 16);
      } catch {
      }
      if (/\.(?:md|html?)(?:$|[?#])/i.test(h))
        try {
          const w = d.get(h);
          if (!w || !w.raw || w.status === 404) continue;
          let b = "", k = "", E = null, z = null;
          if (w.isHtml) try {
            const F = at(), K = F ? F.parseFromString(w.raw, "text/html") : null, se = K ? K.querySelector("title") || K.querySelector("h1") : null;
            se && se.textContent && (b = se.textContent.trim());
            const he = K ? K.querySelector("p") : null;
            if (he && he.textContent && (k = he.textContent.trim()), t >= 2) try {
              const ie = K ? K.querySelector("h1") : null, C = ie && ie.textContent ? ie.textContent.trim() : b || "";
              try {
                const j = be?.has?.(h) ? be?.get?.(h) : null;
                if (j) E = j;
                else {
                  let T = ke(b || h);
                  const N = /* @__PURE__ */ new Set();
                  try {
                    for (const $ of te.keys()) N.add($);
                  } catch {
                  }
                  try {
                    for (const $ of u) $ && $.slug && N.add(String($.slug).split("::")[0]);
                  } catch {
                  }
                  let Y = !1;
                  try {
                    if (te.has(T)) {
                      const $ = te.get(T);
                      if (typeof $ == "string")
                        $ === h && (Y = !0);
                      else if ($ && typeof $ == "object") {
                        $.default === h && (Y = !0);
                        for (const ne of Object.keys($.langs || {})) if ($.langs[ne] === h) {
                          Y = !0;
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                  !Y && N.has(T) && (T = An(T, N)), E = T;
                  try {
                    be?.has?.(h) || kt(E, h);
                  } catch {
                  }
                }
              } catch (j) {
                pe("[slugManager] derive pageSlug failed", j);
              }
              const I = Array.from(K.querySelectorAll("h2"));
              for (const j of I) try {
                const T = (j.textContent || "").trim();
                if (!T) continue;
                const N = j.id ? j.id : ke(T), Y = E ? `${E}::${N}` : `${ke(h)}::${N}`;
                let $ = "", ne = j.nextElementSibling;
                for (; ne && ne.tagName && ne.tagName.toLowerCase() === "script"; ) ne = ne.nextElementSibling;
                ne && ne.textContent && ($ = String(ne.textContent).trim()), u.push({
                  slug: Y,
                  title: T,
                  excerpt: $,
                  path: h,
                  parentTitle: C
                });
              } catch (T) {
                pe("[slugManager] indexing H2 failed", T);
              }
              if (t === 3) try {
                const j = Array.from(K.querySelectorAll("h3"));
                for (const T of j) try {
                  const N = (T.textContent || "").trim();
                  if (!N) continue;
                  const Y = T.id ? T.id : ke(N), $ = E ? `${E}::${Y}` : `${ke(h)}::${Y}`;
                  let ne = "", le = T.nextElementSibling;
                  for (; le && le.tagName && le.tagName.toLowerCase() === "script"; ) le = le.nextElementSibling;
                  le && le.textContent && (ne = String(le.textContent).trim()), u.push({
                    slug: $,
                    title: N,
                    excerpt: ne,
                    path: h,
                    parentTitle: C
                  });
                } catch (N) {
                  pe("[slugManager] indexing H3 failed", N);
                }
              } catch (j) {
                pe("[slugManager] collect H3s failed", j);
              }
            } catch (ie) {
              pe("[slugManager] collect H2s failed", ie);
            }
          } catch (F) {
            pe("[slugManager] parsing HTML for index failed", F);
          }
          else {
            const F = w.raw, K = F.match(/^#\s+(.+)$/m);
            b = K ? K[1].trim() : "";
            try {
              b = vi(b);
            } catch {
            }
            const se = F.split(/\r?\n\s*\r?\n/);
            if (se.length > 1) for (let he = 1; he < se.length; he++) {
              const ie = se[he].trim();
              if (ie && !/^#/.test(ie)) {
                k = ie.replace(/\r?\n/g, " ");
                break;
              }
            }
            try {
              const { data: he } = tr(F), ie = he.image || he.og_image || he.cover || he.featured_image;
              ie && String(ie).trim() && (z = String(ie).trim());
            } catch {
            }
            if (t >= 2) {
              let he = "";
              try {
                const ie = (F.match(/^#\s+(.+)$/m) || [])[1];
                he = ie ? ie.trim() : "";
                try {
                  const j = be?.has?.(h) ? be?.get?.(h) : null;
                  if (j) E = j;
                  else {
                    let T = ke(b || h);
                    const N = /* @__PURE__ */ new Set();
                    try {
                      for (const $ of te.keys()) N.add($);
                    } catch {
                    }
                    try {
                      for (const $ of u) $ && $.slug && N.add(String($.slug).split("::")[0]);
                    } catch {
                    }
                    let Y = !1;
                    try {
                      if (te.has(T)) {
                        const $ = te.get(T);
                        if (typeof $ == "string")
                          $ === h && (Y = !0);
                        else if ($ && typeof $ == "object") {
                          $.default === h && (Y = !0);
                          for (const ne of Object.keys($.langs || {})) if ($.langs[ne] === h) {
                            Y = !0;
                            break;
                          }
                        }
                      }
                    } catch {
                    }
                    !Y && N.has(T) && (T = An(T, N)), E = T;
                    try {
                      be?.has?.(h) || kt(E, h);
                    } catch {
                    }
                  }
                } catch (j) {
                  pe("[slugManager] derive pageSlug failed", j);
                }
                const C = /^##\s+(.+)$/gm;
                let I;
                for (; I = C.exec(F); ) try {
                  const j = (I[1] || "").trim(), T = vi(j);
                  if (!j) continue;
                  const N = ke(j), Y = E ? `${E}::${N}` : `${ke(h)}::${N}`, $ = F.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), ne = $ && $[1] ? String($[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                  u.push({
                    slug: Y,
                    title: T,
                    excerpt: ne,
                    path: h,
                    parentTitle: he
                  });
                } catch (j) {
                  pe("[slugManager] indexing markdown H2 failed", j);
                }
              } catch (ie) {
                pe("[slugManager] collect markdown H2s failed", ie);
              }
              if (t === 3) try {
                const ie = /^###\s+(.+)$/gm;
                let C;
                for (; C = ie.exec(F); ) try {
                  const I = (C[1] || "").trim(), j = vi(I);
                  if (!I) continue;
                  const T = ke(I), N = E ? `${E}::${T}` : `${ke(h)}::${T}`, Y = F.slice(ie.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), $ = Y && Y[1] ? String(Y[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                  u.push({
                    slug: N,
                    title: j,
                    excerpt: $,
                    path: h,
                    parentTitle: he
                  });
                } catch (I) {
                  pe("[slugManager] indexing markdown H3 failed", I);
                }
              } catch (ie) {
                pe("[slugManager] collect markdown H3s failed", ie);
              }
            }
          }
          let W = "";
          try {
            be?.has?.(h) && (W = be?.get?.(h));
          } catch (F) {
            pe("[slugManager] mdToSlug access failed", F);
          }
          if (!W) {
            try {
              if (!E) {
                const F = be?.has?.(h) ? be?.get?.(h) : null;
                if (F) E = F;
                else {
                  let K = ke(b || h);
                  const se = /* @__PURE__ */ new Set();
                  try {
                    for (const ie of te.keys()) se.add(ie);
                  } catch {
                  }
                  try {
                    for (const ie of u) ie && ie.slug && se.add(String(ie.slug).split("::")[0]);
                  } catch {
                  }
                  let he = !1;
                  try {
                    if (te.has(K)) {
                      const ie = te.get(K);
                      if (typeof ie == "string")
                        ie === h && (he = !0);
                      else if (ie && typeof ie == "object") {
                        ie.default === h && (he = !0);
                        for (const C of Object.keys(ie.langs || {})) if (ie.langs[C] === h) {
                          he = !0;
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                  !he && se.has(K) && (K = An(K, se)), E = K;
                  try {
                    be?.has?.(h) || kt(E, h);
                  } catch {
                  }
                }
              }
            } catch (F) {
              pe("[slugManager] derive pageSlug failed", F);
            }
            W = E || ke(b || h);
          }
          u.push({
            slug: W,
            title: b,
            excerpt: k,
            path: h,
            image: z
          });
        } catch (w) {
          pe("[slugManager] buildSearchIndex: entry processing failed", w);
        }
    }
    try {
      const h = u.filter((w) => {
        try {
          return !s(String(w.path ?? ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(oe) || (oe = []), oe.length = 0;
        for (const w of h) oe.push(w);
      } catch {
        try {
          oe = Array.from(h);
        } catch {
          oe = h;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = oe;
          } catch {
          }
          try {
            const w = [], b = /* @__PURE__ */ new Set();
            for (const k of oe) try {
              if (!k || !k.slug) continue;
              const E = String(k.slug).split("::")[0];
              if (b.has(E)) continue;
              b.add(E);
              const z = { slug: E };
              k.title ? z.title = String(k.title) : k.parentTitle && (z.title = String(k.parentTitle)), k.path && (z.path = String(k.path)), w.push(z);
            } catch {
            }
            try {
              window.__nimbiSitemapJson = {
                generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
                entries: w
              };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = w;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (h) {
      pe("[slugManager] filtering index by excludes failed", h);
      try {
        Array.isArray(oe) || (oe = []), oe.length = 0;
        for (const w of u) oe.push(w);
      } catch {
        try {
          oe = Array.from(u);
        } catch {
          oe = u;
        }
      }
      try {
        if (typeof window < "u") try {
          window.__nimbiResolvedIndex = oe;
        } catch {
        }
      } catch {
      }
    }
    return oe;
  })();
  try {
    await xn;
  } catch (a) {
    pe("[slugManager] awaiting _indexPromise failed", a);
  }
  return xn = null, oe;
}
async function vn(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, r = typeof e.indexDepth == "number" ? e.indexDepth : 1, i = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, o = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(oe) && oe.length && !xn && !o) return oe;
    if (xn) {
      try {
        await xn;
      } catch {
      }
      return oe;
    }
    if (o) {
      try {
        if (typeof va == "function") try {
          const l = await va(n, r, i, a);
          if (Array.isArray(l) && l.length) {
            try {
              Mr(l);
            } catch {
            }
            return oe;
          }
        } catch {
        }
      } catch {
      }
      try {
        return await Un(n, r, i, a), oe;
      } catch {
      }
    }
    const s = Date.now();
    for (; Date.now() - s < t; ) {
      if (Array.isArray(oe) && oe.length) return oe;
      await new Promise((l) => setTimeout(l, 150));
    }
    return oe;
  } catch {
    return oe;
  }
}
async function Ta(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await vn(t);
    } catch {
      return oe;
    }
  } catch {
    return oe;
  }
}
var Go = 1e3, Qr = Go;
function Vo(e) {
  typeof e == "number" && e >= 0 && (Qr = e);
}
var Zo = at(), Xo = "a[href]", Yo = async function(e, t, n = Qr) {
  if (Ai.has(e)) return Ai.get(e);
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
    await zo(a.splice(0, l), async (c) => {
      if (c == null || i.has(c)) return;
      i.add(c);
      let u = "";
      try {
        u = new URL(c || "", s).toString();
      } catch {
        u = (String(t ?? "") || o) + "/" + String(c ?? "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(u);
        } catch (_) {
          pe("[slugManager] crawlForSlug: fetch failed", {
            url: u,
            error: _
          });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && pe("[slugManager] crawlForSlug: directory fetch non-ok", {
            url: u,
            status: d.status
          });
          return;
        }
        const f = await d.text(), p = Zo.parseFromString(f, "text/html");
        let m = [];
        try {
          p && typeof p.getElementsByTagName == "function" ? m = p.getElementsByTagName("a") : p && typeof p.querySelectorAll == "function" ? m = p.querySelectorAll(Xo) : m = [];
        } catch {
          try {
            m = p.getElementsByTagName ? p.getElementsByTagName("a") : [];
          } catch {
            m = [];
          }
        }
        const g = u;
        for (const _ of m) try {
          if (r) break;
          let h = _.getAttribute("href") || "";
          if (!h || Yr(h, t) || h.startsWith("..") || h.indexOf("/../") !== -1) continue;
          if (h.endsWith("/")) {
            try {
              const w = new URL(h, g), b = new URL(s).pathname, k = w.pathname.startsWith(b) ? w.pathname.slice(b.length) : w.pathname.replace(/^\//, ""), E = jn(re(k));
              i.has(E) || a.push(E);
            } catch {
              const b = re(c + h);
              i.has(b) || a.push(b);
            }
            continue;
          }
          if (h.toLowerCase().endsWith(".md")) {
            let w = "";
            try {
              const b = new URL(h, g), k = new URL(s).pathname;
              w = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, "");
            } catch {
              w = (c + h).replace(/^\//, "");
            }
            w = re(w);
            try {
              if (be?.has?.(w)) continue;
              for (const b of te.values()) ;
            } catch (b) {
              pe("[slugManager] slug map access failed", b);
            }
            try {
              const b = await Ke(w, t);
              if (b && b.raw) {
                const k = (b.raw || "").match(/^#\s+(.+)$/m);
                if (k && k[1] && ke(k[1].trim()) === e) {
                  r = w;
                  break;
                }
              }
            } catch (b) {
              pe("[slugManager] crawlForSlug: fetchMarkdown failed", b);
            }
          }
        } catch (h) {
          pe("[slugManager] crawlForSlug: link iteration failed", h);
        }
      } catch (d) {
        pe("[slugManager] crawlForSlug: directory fetch failed", d);
      }
    }, l);
  return Ai.set(e, r), r;
};
async function Qo(e, t = Qr) {
  const n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), i = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let o = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? o = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? o = a + String(e).replace(/\/$/, "") + "/" : o = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    o = a + "/";
  }
  const s = Math.max(1, Math.min(Hi, 6));
  for (; i.length && !(i.length > t); )
    await zo(i.splice(0, s), async (l) => {
      if (l == null || r.has(l)) return;
      r.add(l);
      let c = "";
      try {
        c = new URL(l || "", o).toString();
      } catch {
        c = (String(e ?? "") || a) + "/" + String(l ?? "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(c);
        } catch (g) {
          pe("[slugManager] crawlAllMarkdown: fetch failed", {
            url: c,
            error: g
          });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && pe("[slugManager] crawlAllMarkdown: directory fetch non-ok", {
            url: c,
            status: u.status
          });
          return;
        }
        const d = await u.text(), f = Zo.parseFromString(d, "text/html");
        let p = [];
        try {
          f && typeof f.getElementsByTagName == "function" ? p = f.getElementsByTagName("a") : f && typeof f.querySelectorAll == "function" ? p = f.querySelectorAll(Xo) : p = [];
        } catch {
          try {
            p = f.getElementsByTagName ? f.getElementsByTagName("a") : [];
          } catch {
            p = [];
          }
        }
        const m = c;
        for (const g of p) try {
          let _ = g.getAttribute("href") || "";
          if (!_ || Yr(_, e) || _.startsWith("..") || _.indexOf("/../") !== -1) continue;
          if (_.endsWith("/")) {
            try {
              const w = new URL(_, m), b = new URL(o).pathname, k = w.pathname.startsWith(b) ? w.pathname.slice(b.length) : w.pathname.replace(/^\//, ""), E = jn(re(k));
              r.has(E) || i.push(E);
            } catch {
              const b = l + _;
              r.has(b) || i.push(b);
            }
            continue;
          }
          let h = "";
          try {
            const w = new URL(_, m), b = new URL(o).pathname;
            h = w.pathname.startsWith(b) ? w.pathname.slice(b.length) : w.pathname.replace(/^\//, "");
          } catch {
            h = (l + _).replace(/^\//, "");
          }
          if (h = re(h), /\.(md|html?)$/i.test(h)) n.add(h);
          else {
            const w = h.split(/[?#]/)[0].replace(/\/+$/, ""), b = String(w).split("/").pop() || "";
            if (/\.[^./]+$/i.test(b)) continue;
            w && (n.add(`${w}.md`), n.add(`${w}.html`), n.add(`${w}/README.md`), n.add(`${w}/README.html`));
          }
        } catch (_) {
          pe("[slugManager] crawlAllMarkdown: link iteration failed", _);
        }
      } catch (u) {
        pe("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }, s);
  return Array.from(n);
}
async function Ko(e, t, n) {
  if (e && typeof e == "string" && (e = re(e), e = Wn(e)), te.has(e)) return rr(e) || te.get(e);
  try {
    if (!(typeof Se == "string" && Se || te.has(e) || Qe && Qe.size || ki() || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const i of Vi) try {
    const a = await i(e, t);
    if (a)
      return kt(e, a), a;
  } catch (a) {
    pe("[slugManager] slug resolver failed", a);
  }
  if (Qe && Qe.size) {
    for (const i of ht) try {
      const a = String(i ?? "").replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
      if (a && ke(a) === e)
        return kt(e, i), i;
    } catch (a) {
      pe("[slugManager] filename fast-path match failed", a);
    }
    if (Pr.has(e)) {
      const i = Pr.get(e);
      return kt(e, i), i;
    }
    for (const i of ht)
      if (!Ni.has(i))
        try {
          const a = await Ke(i, t);
          if (a && a.raw) {
            const o = (a.raw || "").match(/^#\s+(.+)$/m);
            if (o && o[1]) {
              const s = ke(o[1].trim());
              if (Ni.add(i), s && Pr.set(s, i), s === e)
                return kt(e, i), i;
            }
          }
        } catch (a) {
          pe("[slugManager] manifest title fetch failed", a);
        }
    try {
      Cs++, await kn(Cs, 8);
    } catch {
    }
  }
  const r = [`${e}.html`, `${e}.md`];
  for (const i of r) try {
    const a = await Ke(i, t);
    if (a && a.raw)
      return kt(e, i), i;
  } catch (a) {
    pe("[slugManager] candidate fetch failed", a);
  }
  try {
    const i = await Un(t);
    if (i && i.length) {
      const a = i.find((o) => o.slug === e);
      if (a)
        return kt(e, a.path), a.path;
    }
  } catch (i) {
    pe("[slugManager] buildSearchIndex lookup failed", i);
  }
  try {
    const i = await Yo(e, t, n);
    if (i)
      return kt(e, i), i;
  } catch (i) {
    pe("[slugManager] crawlForSlug lookup failed", i);
  }
  if (Qe && Qe.size) for (const i of ht) try {
    const a = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
    if (ke(a) === e)
      return kt(e, i), i;
  } catch (a) {
    pe("[slugManager] build-time filename match failed", a);
  }
  try {
    if (At && typeof At == "string" && At.trim()) try {
      const i = await Ke(At, t);
      if (i && i.raw) {
        const a = (i.raw || "").match(/^#\s+(.+)$/m);
        if (a && a[1] && ke(a[1].trim()) === e)
          return kt(e, At), At;
      }
    } catch (i) {
      pe("[slugManager] home page fetch failed", i);
    }
  } catch (i) {
    pe("[slugManager] home page fetch failed", i);
  }
  return null;
}
var Kc = /* @__PURE__ */ _o(((e, t) => {
  function n(s, l) {
    return l.some(([c, u]) => c <= s && s <= u);
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
    let c = 0, u = 0, d = s.length - 1;
    const f = l.wordsPerMinute || 200, p = l.wordBound || i;
    for (; p(s[u]); ) u++;
    for (; p(s[d]); ) d--;
    const m = `${s}
`;
    for (let h = u; h <= d; h++)
      if ((r(m[h]) || !p(m[h]) && (p(m[h + 1]) || r(m[h + 1]))) && c++, r(m[h])) for (; h <= d && (a(m[h + 1]) || p(m[h + 1])); ) h++;
    const g = c / f, _ = Math.round(g * 60 * 1e3);
    return {
      text: Math.ceil(g.toFixed(2)) + " min read",
      minutes: g,
      time: _,
      words: c
    };
  }
  t.exports = o;
})), Jc = /* @__PURE__ */ y(Kc(), 1), vr = /* @__PURE__ */ new Map(), eu = 200;
function tu(e) {
  const t = String(e ?? "");
  let n = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t.charCodeAt(r);
    n = (n << 5) - n + i | 0;
  }
  return `${t.length}:${n}`;
}
function nu(e, t) {
  if (vr.set(e, t), vr.size > eu) {
    const n = vr.keys().next().value;
    n && vr.delete(n);
  }
}
function ru(e) {
  return e ? String(e).trim().split(/\s+/).filter(Boolean).length : 0;
}
function iu(e) {
  const t = tu(e), n = vr.get(t);
  if (n) return Object.assign({}, n);
  const r = (0, Jc.default)(e || ""), i = {
    readingTime: r,
    wordCount: typeof r.words == "number" ? r.words : ru(e)
  };
  return nu(t, i), Object.assign({}, i);
}
function Fr(e, t) {
  const n = typeof CSS < "u" && CSS.escape ? CSS.escape(String(e)) : String(e);
  let r = document.querySelector(`meta[name="${n}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", e), document.head.appendChild(r)), r.setAttribute("content", t);
}
function au() {
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
function mt(e, t, n) {
  let r = `meta[${e}="${typeof CSS < "u" && CSS.escape ? CSS.escape(String(t)) : String(t)}"]`, i = document.querySelector(r);
  i || (i = document.createElement("meta"), i.setAttribute(e, t), document.head.appendChild(i)), i.setAttribute("content", n);
}
function Jo(e, t) {
  try {
    if (!e) return;
    const n = typeof CSS < "u" && CSS.escape ? CSS.escape(String(e)) : String(e);
    let r = document.querySelector(`link[rel="${n}"]`);
    r || (r = document.createElement("link"), r.setAttribute("rel", e), document.head.appendChild(r)), r.setAttribute("href", t);
  } catch (n) {
    S("[seoManager] upsertLinkRel failed", n);
  }
}
function el(e) {
  try {
    if (typeof document > "u" || !document.head) return;
    const t = Za();
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
      S("[seoManager] setHreflangTags failed", n);
    }
  } catch (t) {
    S("[seoManager] setHreflangTags failed", t);
  }
}
function su(e, t, n, r, i) {
  mt("property", "og:title", t && String(t).trim() ? t : e.title || document.title);
  const a = r && String(r).trim() ? r : e.description || "";
  a && String(a).trim() && mt("property", "og:description", a), a && String(a).trim() && mt("name", "twitter:description", a), mt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const o = n || e.image;
  o && (mt("property", "og:image", o), mt("name", "twitter:image", o), e.image_width && mt("property", "og:image:width", String(e.image_width)), e.image_height && mt("property", "og:image:height", String(e.image_height))), mt("property", "og:type", i || e.og_type || (e.type === "Article" ? "article" : "website"));
  try {
    const s = typeof navigator < "u" && (navigator.language || navigator.languages?.[0]) || "en";
    mt("property", "og:locale", String(s).replace("-", "_").toLowerCase());
    const l = Za();
    if (Array.isArray(l) && l.length > 0) for (const c of l) try {
      mt("property", "og:locale:alternate", String(c).replace("-", "_").toLowerCase());
    } catch {
    }
  } catch {
  }
  if (e.date) try {
    const s = new Date(e.date);
    isNaN(s.getTime()) || mt("property", "article:published_time", s.toISOString());
  } catch {
  }
  if (e.dateModified) try {
    const s = new Date(e.dateModified);
    isNaN(s.getTime()) || mt("property", "article:modified_time", s.toISOString());
  } catch {
  }
  e.twitter_site && mt("name", "twitter:site", String(e.twitter_site)), e.twitter_creator && mt("name", "twitter:creator", String(e.twitter_creator));
}
function Ya(e, t, n, r, i = "") {
  const a = e.meta || {}, o = document?.querySelector && document.querySelector('meta[name="description"]')?.getAttribute("content") || "", s = r && String(r).trim() ? r : a.description && String(a.description).trim() ? a.description : o && String(o).trim() ? o : "";
  s && String(s).trim() && Fr("description", s), Fr("robots", a.robots || "index,follow"), su(a, t, n, s, a.type), el(e.slug || e.meta?.slug || "");
}
function tl() {
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
    S("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Qa(e, t, n, r, i, a = "") {
  try {
    let u = function(_) {
      try {
        const h = re(_);
        try {
          return (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(h);
        } catch {
          return location.href.split("#")[0];
        }
      } catch {
        return location.href.split("#")[0];
      }
    }, f = function(_, h) {
      try {
        const w = String(h?.type || "").trim();
        if (w) return w;
        const b = String(_ || "").replace(/^\/+|\/+$/g, "").toLowerCase();
        if (!b || b === "index" || b === "home") return "WebPage";
        const k = b.split("/"), E = k[0] || "", z = k[k.length - 1] || "", W = {
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
        return k.length === 1 && W[E] ? W[E] : W[z] ? W[z] : "Article";
      } catch {
        return "Article";
      }
    };
    const o = e.meta || {}, s = n && String(n).trim() ? n : o.title || a || document.title, l = i && String(i).trim() ? i : o.description || document.querySelector('meta[name="description"]')?.getAttribute("content") || "", c = r || o.image || null, d = u(t);
    d && Jo("canonical", d);
    try {
      mt("property", "og:url", d);
    } catch (_) {
      S("[seoManager] upsertMeta og:url failed", _);
    }
    const p = {
      "@context": "https://schema.org",
      "@type": f(t, o),
      headline: s || "",
      description: l || "",
      url: d || location.href.split("#")[0]
    };
    c && (p.image = String(c)), o.date && (p.datePublished = o.date), o.dateModified && (p.dateModified = o.dateModified), o.author && (p.author = {
      "@type": "Person",
      name: String(o.author)
    });
    try {
      const _ = tl();
      _ && (p.publisher = {
        "@type": "Organization",
        name: _
      });
    } catch {
    }
    d && (p.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": d
    });
    const m = "nimbi-jsonld";
    let g = document.getElementById(m);
    g || (g = document.createElement("script"), g.type = "application/ld+json", g.id = m, Ha(g), document.head.appendChild(g)), g.textContent = JSON.stringify(p, null, 2).replace(/<\/script>/gi, "<\\/script>");
  } catch (o) {
    S("[seoManager] setStructuredData failed", o);
  }
}
var Oi = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function ou(e) {
  try {
    if (!e || typeof e != "object") {
      Oi = {};
      return;
    }
    Oi = Object.assign({}, e);
  } catch (t) {
    S("[seoManager] setSeoMap failed", t);
  }
}
function lu(e, t = "") {
  try {
    if (!e) return;
    const n = Oi?.[e] ? Oi[e] : typeof window < "u" && window.__SEO_MAP?.[e] ? window.__SEO_MAP[e] : null;
    try {
      const r = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e ?? ""));
      Jo("canonical", r);
      try {
        mt("property", "og:url", r);
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
        Ya({
          meta: n,
          slug: e
        }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      el(e);
    } catch {
    }
    try {
      Qa({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (r) {
      S("[seoManager] inject structured data failed", r);
    }
  } catch (n) {
    S("[seoManager] injectSeoForPage failed", n);
  }
}
function Ei(e = {}, t = "", n = void 0, r = void 0) {
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
      Ya({ meta: Object.assign({}, i, { robots: "noindex,follow" }) }, a, i.image || void 0, o);
    } catch {
    }
    try {
      Qa({ meta: Object.assign({}, i, {
        title: a,
        description: o
      }) }, t || "", a, i.image || void 0, o);
    } catch {
    }
  } catch (i) {
    S("[seoManager] markNotFound failed", i);
  }
}
function cu(e, t, n, r, i, a, o, s, l, c, u) {
  try {
    if (r?.querySelector) {
      const d = r.querySelector(".menu-label");
      d && (d.textContent = s?.textContent || e("onThisPage"));
    }
  } catch (d) {
    S("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta?.title ? String(n.meta.title).trim() : "", f = i?.querySelector?.("img") || null, p = f && (f.getAttribute("src") || f.src) || null;
    let m = "";
    try {
      let h = "";
      try {
        const w = s || i?.querySelector?.("h1") || null;
        if (w) {
          let b = w.nextElementSibling;
          const k = [];
          for (; b && !(b.tagName && b.tagName.toLowerCase() === "h2"); ) {
            try {
              if (b.classList?.contains("nimbi-article-subtitle")) {
                b = b.nextElementSibling;
                continue;
              }
            } catch {
            }
            const E = (b.textContent || "").trim();
            E && k.push(E), b = b.nextElementSibling;
          }
          k.length && (h = k.join(" ").replace(/\s+/g, " ").trim()), !h && l && (h = String(l).trim());
        }
      } catch (w) {
        S("[seoManager] compute descOverride failed", w);
      }
      h && String(h).length > 160 && (h = String(h).slice(0, 157).trim() + "..."), m = h;
    } catch (h) {
      S("[seoManager] compute descOverride failed", h);
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
      Ya(n, g || void 0, p, m);
    } catch (h) {
      S("[seoManager] setMetaTags failed", h);
    }
    try {
      Qa(n, c, g || void 0, p, m, t);
    } catch (h) {
      S("[seoManager] setStructuredData failed", h);
    }
    const _ = tl();
    g ? _ ? document.title = `${_} - ${g}` : document.title = `${t || "Site"} - ${g}` : d ? document.title = d : document.title = t || document.title;
  } catch (d) {
    S("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      i.querySelectorAll(".nimbi-reading-time")?.forEach((d) => d.remove());
    } catch {
    }
    if (l) {
      const d = iu(u?.raw || ""), f = d?.readingTime ? d.readingTime : null, p = typeof f?.minutes == "number" ? Math.ceil(f.minutes) : 0, m = p ? e("readingTime", { minutes: p }) : "";
      if (!m) return;
      const g = i.querySelector("h1");
      if (g) {
        const _ = i.querySelector(".nimbi-article-subtitle");
        try {
          if (_) {
            const h = document.createElement("span");
            h.className = "nimbi-reading-time", h.textContent = m, _.appendChild(h);
          } else {
            const h = document.createElement("p");
            h.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = m, h.appendChild(w);
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
            const w = document.createElement("p");
            w.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = m, w.appendChild(b), g.insertAdjacentElement("afterend", w);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    S("[seoManager] reading time update failed", d);
  }
}
var zi = 100;
function Ms(e) {
  zi = e, il();
}
function Ct() {
  try {
    if (wo(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
var Dt = 3e5, uu = 6e4, yr = null, _r = null;
function Pt(e, t, n) {
  try {
    if (typeof Ke == "function" && typeof Ke.length == "number" && Ke.length >= 3) return Ke(e, t, { signal: n });
  } catch {
  }
  return Ke(e, t);
}
function Ps(e) {
  Dt = e;
  try {
    Wt.defaultTTL = Dt > 0 ? Dt : 1 / 0;
  } catch {
  }
  nl();
}
function nl() {
  try {
    yr !== null && (clearInterval(yr), yr = null);
  } catch {
  }
  if (Dt > 0) try {
    yr = setInterval(du, uu);
  } catch {
    yr = null;
  }
}
var Wt = new Zr({
  maxEntries: zi,
  defaultTTL: Dt > 0 ? Dt : 1 / 0
});
nl();
function rl(e) {
  return !!e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "value") && Object.prototype.hasOwnProperty.call(e, "ts");
}
function il() {
  try {
    Wt.maxEntries = zi;
  } catch {
  }
  for (; Wt.size > zi; ) {
    const e = Wt.keys("LRU").next().value;
    if (e === void 0) break;
    Wt.delete(e);
  }
}
function hu(e) {
  const t = Wt.get(e);
  if (t !== void 0) {
    if (rl(t)) {
      const n = Date.now();
      if (Dt > 0 && t.ts + Dt < n) {
        Wt.delete(e);
        return;
      }
      return t.value;
    }
    return t;
  }
}
function fu(e, t) {
  Wt.set(e, t, { ttl: Dt > 0 ? Dt : 1 / 0 }), il();
}
function du() {
  if (!Dt || Dt <= 0) return;
  const e = Date.now(), t = Array.from(Wt.keys("LRU"));
  for (const n of t) {
    Wt.has(n);
    const r = Wt.peek(n);
    rl(r) && r.ts + Dt < e && Wt.delete(n);
  }
}
async function pu(e, t, n) {
  const r = new Set(xt);
  let i = [];
  try {
    if (typeof document < "u" && document.getElementsByClassName) {
      const a = (o) => {
        const s = document.getElementsByClassName(o);
        for (let l = 0; l < s.length; l++) {
          const c = s[l].getElementsByTagName("a");
          for (let u = 0; u < c.length; u++) i.push(c[u]);
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
          const f = yt(o);
          if (f) {
            if (f.type === "canonical" && f.page) {
              const p = re(f.page);
              if (p) {
                r.add(p);
                continue;
              }
            }
            if (f.type === "cosmetic" && f.page) {
              const p = f.page;
              if (te.has(p)) {
                const m = te.get(p);
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
          let f = re(l[1]);
          f && r.add(f);
          continue;
        }
        const c = (a.textContent || "").trim(), u = (s.pathname || "").replace(/^.*\//, "");
        if (c && ke(c) === e || u && ke(u.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let f = s.pathname.replace(/^\//, "");
          r.add(f);
          continue;
        }
        const d = s.pathname || "";
        if (d) {
          const f = new URL(t), p = jn(f.pathname);
          if (d.indexOf(p) !== -1) {
            let m = d.startsWith(p) ? d.slice(p.length) : d;
            m = re(m), m && r.add(m);
          }
        }
      } catch (s) {
        S("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const a of r) try {
    if (!a || !String(a).includes(".md")) continue;
    const o = await Pt(a, t, n);
    if (!o || !o.raw) continue;
    const s = (o.raw || "").match(/^#\s+(.+)$/m);
    if (s) {
      const l = (s[1] || "").trim();
      if (l && ke(l) === e) return a;
    }
  } catch (o) {
    S("[router] fetchMarkdown during index discovery failed", o);
  }
  return null;
}
function gu(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else try {
    const n = decodeURIComponent(String(e ?? ""));
    if (te.has(n)) {
      const r = rr(n) || te.get(n);
      r && (/\.(md|html?)$/i.test(r) ? /index\.html$/i.test(r) || t.push(r) : (t.push(r), t.push(r + ".html")));
    } else {
      if (xt && xt.size) for (const r of xt) {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ke(i) === n && !/index\.html$/i.test(r)) {
          t.push(r);
          break;
        }
      }
      !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
    }
  } catch (n) {
    S("[router] buildPageCandidates failed during slug handling", n);
  }
  return t;
}
async function mu(e, t) {
  const n = e || "";
  try {
    try {
      xo("fetchPageData");
    } catch {
    }
  } catch {
  }
  try {
    if (_r && typeof _r.abort == "function") try {
      _r.abort();
    } catch {
    }
  } catch {
  }
  _r = typeof AbortController < "u" ? new AbortController() : null;
  const r = _r;
  let i = null;
  try {
    const h = yt(typeof location < "u" ? location.href : "");
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
    (!a || String(a).trim() === "") && typeof At == "string" && At && (a = String(At));
  } catch {
  }
  let o = null, s = null;
  const l = String(n ?? "").includes(".md") || String(n ?? "").includes(".html");
  if (a && String(a).includes("::")) {
    const h = String(a).split("::", 2);
    a = h[0], o = h[1] || null;
  }
  const c = `${e}|||${typeof fc < "u" && $t ? $t : ""}`, u = hu(c);
  if (u)
    a = u.resolved, o = u.anchor || o;
  else {
    if (!String(a).includes(".md") && !String(a).includes(".html")) {
      let h = decodeURIComponent(String(a ?? ""));
      if (h && typeof h == "string" && (h = re(h), h = Wn(h)), te.has(h)) a = rr(h) || te.get(h);
      else {
        let w = await pu(h, t, r ? r.signal : void 0);
        if (w) a = w;
        else if (ki() && xt && xt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await Ko(h, t);
          b && (a = b);
        }
      }
    }
    fu(c, {
      resolved: a,
      anchor: o
    });
  }
  let d = !0;
  try {
    const h = String(a ?? "").includes(".md") || String(a ?? "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof Se == "string" && Se || te.has(a) || xt && xt.size || ki() || l || h;
  } catch {
    d = !0;
  }
  !o && i && (o = i);
  try {
    if (d && a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"))) {
      const h = a.startsWith("/") ? new URL(a, location.origin).toString() : a;
      try {
        const w = await fetch(h, r ? { signal: r.signal } : void 0);
        if (w && w.ok) {
          const b = await w.text(), k = typeof w?.headers?.get == "function" && w.headers.get("content-type") || "", E = (b || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || E.indexOf("<!doctype") !== -1 || E.indexOf("<html") !== -1) {
            if (!l) try {
              let z = h;
              try {
                z = new URL(h).pathname.replace(/^\//, "");
              } catch {
                z = String(h ?? "").replace(/^\//, "");
              }
              const W = z.replace(/\.html$/i, ".md");
              try {
                const F = await Pt(W, t, r ? r.signal : void 0);
                if (F?.raw) return {
                  data: F,
                  pagePath: W,
                  anchor: o
                };
              } catch {
              }
              if (typeof Se == "string" && Se) try {
                const F = await Pt(Se, t, r ? r.signal : void 0);
                if (F && F.raw) {
                  try {
                    Ei(F.meta || {}, Se);
                  } catch {
                  }
                  return {
                    data: F,
                    pagePath: Se,
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
            if (E.indexOf('<div id="app"') !== -1 || E.indexOf("nimbi-cms") !== -1 || E.indexOf("nimbi-mount") !== -1 || E.indexOf("nimbi-") !== -1 || E.indexOf("initcms(") !== -1 || E.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(E)) try {
              let z = h;
              try {
                z = new URL(h).pathname.replace(/^\//, "");
              } catch {
                z = String(h ?? "").replace(/^\//, "");
              }
              const W = z.replace(/\.html$/i, ".md");
              try {
                const F = await Pt(W, t, r ? r.signal : void 0);
                if (F?.raw) return {
                  data: F,
                  pagePath: W,
                  anchor: o
                };
              } catch {
              }
              if (typeof Se == "string" && Se) try {
                const F = await Pt(Se, t, r ? r.signal : void 0);
                if (F && F.raw) {
                  try {
                    Ei(F.meta || {}, Se);
                  } catch {
                  }
                  return {
                    data: F,
                    pagePath: Se,
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
  const f = gu(a);
  try {
    if (Ct()) try {
      pe("[router-debug] fetchPageData candidates", {
        originalRaw: n,
        resolved: a,
        pageCandidates: f
      });
    } catch {
    }
  } catch {
  }
  const p = String(n ?? "").includes(".md") || String(n ?? "").includes(".html");
  let m = null;
  if (!p) try {
    let h = decodeURIComponent(String(n ?? ""));
    h = re(h), h = Wn(h), h && !/\.(md|html?)$/i.test(h) && (m = h);
  } catch {
    m = null;
  }
  if (p && f.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && f.push(a), f.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && f.push(a), f.length === 1 && /index\.html$/i.test(f[0]) && !p && !te.has(a) && !te.has(decodeURIComponent(String(a ?? ""))) && !String(a ?? "").includes("/")) throw new Error("Unknown slug: index.html fallback prevented");
  let g = null, _ = null;
  try {
    const h = String(a ?? "").includes(".md") || String(a ?? "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof Se == "string" && Se || te.has(a) || xt && xt.size || ki() || p || h;
  } catch {
    d = !0;
  }
  if (!d) s = /* @__PURE__ */ new Error("no page data");
  else for (const h of f)
    if (h)
      try {
        const w = re(h);
        if (g = await Pt(w, t, r ? r.signal : void 0), _ = w, m && !te.has(m)) try {
          let b = "";
          if (g && g.isHtml) try {
            const k = at();
            if (k) {
              const E = k.parseFromString(g.raw || "", "text/html"), z = E.querySelector("h1") || E.querySelector("title");
              z && z.textContent && (b = z.textContent.trim());
            }
          } catch {
          }
          else {
            const k = (g && g.raw || "").match(/^#\s+(.+)$/m);
            k && k[1] && (b = k[1].trim());
          }
          if (b && ke(b) !== m)
            try {
              if (/\.html$/i.test(w)) {
                const k = w.replace(/\.html$/i, ".md");
                if (new Set(f).has(k)) try {
                  const E = await Pt(k, t, r ? r.signal : void 0);
                  if (E?.raw)
                    g = E, _ = k;
                  else if (typeof Se == "string" && Se) try {
                    const z = await Pt(Se, t, r ? r.signal : void 0);
                    if (z && z.raw)
                      g = z, _ = Se;
                    else {
                      g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                      continue;
                    }
                  } catch {
                    g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                  else {
                    g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  try {
                    const z = await Pt(Se, t, r ? r.signal : void 0);
                    if (z && z.raw)
                      g = z, _ = Se;
                    else {
                      g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                      continue;
                    }
                  } catch {
                    g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                    continue;
                  }
                }
                else {
                  g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                  continue;
                }
              } else {
                g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
                continue;
              }
            } catch {
              g = null, _ = null, s = /* @__PURE__ */ new Error("slug mismatch for candidate");
              continue;
            }
        } catch {
        }
        try {
          if (!p && /\.html$/i.test(w)) {
            const b = w.replace(/\.html$/i, ".md");
            if (new Set(f).has(b)) try {
              const k = String(g && g.raw || "").trim().slice(0, 128).toLowerCase();
              if (g && g.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(k) || k.indexOf('<div id="app"') !== -1 || k.indexOf("nimbi-") !== -1 || k.indexOf("nimbi") !== -1 || k.indexOf("initcms(") !== -1) {
                let E = !1;
                try {
                  const z = await Pt(b, t, r ? r.signal : void 0);
                  if (z?.raw)
                    g = z, _ = b, E = !0;
                  else if (typeof Se == "string" && Se) try {
                    const W = await Pt(Se, t, r ? r.signal : void 0);
                    W && W.raw && (g = W, _ = Se, E = !0);
                  } catch {
                  }
                } catch {
                  try {
                    const W = await Pt(Se, t, r ? r.signal : void 0);
                    W && W.raw && (g = W, _ = Se, E = !0);
                  } catch {
                  }
                }
                if (!E) {
                  g = null, _ = null, s = /* @__PURE__ */ new Error("site shell detected (candidate HTML rejected)");
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
            pe("[router-debug] fetchPageData accepted candidate", {
              candidate: w,
              pagePath: _,
              isHtml: g && g.isHtml,
              snippet: g && g.raw ? String(g.raw).slice(0, 160) : null
            });
          } catch {
          }
        } catch {
        }
        break;
      } catch (w) {
        s = w;
        try {
          Ct() && S("[router] candidate fetch failed", {
            candidate: h,
            contentBase: t,
            err: w && w.message || w
          });
        } catch {
        }
      }
  if (!g) {
    const h = s && (s.message || String(s)) || null, w = h && /failed to fetch md|site shell detected/i.test(h);
    try {
      if (Ct()) try {
        pe("[router-debug] fetchPageData no data", {
          originalRaw: n,
          resolved: a,
          pageCandidates: f,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    if (w) try {
      if (Ct()) try {
        S("[router] fetchPageData: no page data (expected)", {
          originalRaw: n,
          resolved: a,
          pageCandidates: f,
          contentBase: t,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    else try {
      if (Ct()) try {
        Rr("[router] fetchPageData: no page data for", {
          originalRaw: n,
          resolved: a,
          pageCandidates: f,
          contentBase: t,
          fetchError: h
        });
      } catch {
      }
    } catch {
    }
    if (typeof Se == "string" && Se) try {
      const b = await Pt(Se, t, r ? r.signal : void 0);
      if (b && b.raw) {
        try {
          Ei(b.meta || {}, Se);
        } catch {
        }
        return {
          data: b,
          pagePath: Se,
          anchor: o
        };
      }
    } catch {
    }
    try {
      if (p && String(n ?? "").toLowerCase().includes(".html")) try {
        const b = new URL(String(n ?? ""), location.href).toString();
        Ct() && S("[router] attempting absolute HTML fetch fallback", b);
        const k = await fetch(b, r ? { signal: r.signal } : void 0);
        if (k && k.ok) {
          const E = await k.text(), z = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", W = (E || "").toLowerCase(), F = z && z.indexOf && z.indexOf("text/html") !== -1 || W.indexOf("<!doctype") !== -1 || W.indexOf("<html") !== -1;
          if (!F && Ct()) try {
            S("[router] absolute fetch returned non-HTML", () => ({
              abs: b,
              contentType: z,
              snippet: W.slice(0, 200)
            }));
          } catch {
          }
          if (F) {
            const K = (E || "").toLowerCase();
            if (/<title>\s*index of\b/i.test(E) || /<h1>\s*index of\b/i.test(E) || K.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(E) || /<h1>\s*directory listing/i.test(E)) try {
              Ct() && S("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
            } catch {
            }
            else try {
              const se = b, he = new URL(".", se).toString();
              try {
                const C = at();
                if (C) {
                  const I = C.parseFromString(E || "", "text/html"), j = ($, ne) => {
                    try {
                      const le = ne.getAttribute($) || "";
                      if (!le || /^(https?:)?\/\//i.test(le) || le.startsWith("/") || le.startsWith("#")) return;
                      try {
                        const ye = new URL(le, se).toString();
                        ne.setAttribute($, ye);
                      } catch (ye) {
                        S("[router] rewrite attribute failed", $, ye);
                      }
                    } catch (le) {
                      S("[router] rewrite helper failed", le);
                    }
                  }, T = I.querySelectorAll("[src],[href],[srcset],[poster]"), N = [];
                  for (const $ of Array.from(T || [])) try {
                    const ne = $.tagName ? $.tagName.toLowerCase() : "";
                    if (ne === "a") continue;
                    if ($.hasAttribute("src")) {
                      const le = $.getAttribute("src");
                      j("src", $);
                      const ye = $.getAttribute("src");
                      le !== ye && N.push({
                        attr: "src",
                        tag: ne,
                        before: le,
                        after: ye
                      });
                    }
                    if ($.hasAttribute("href") && ne === "link") {
                      const le = $.getAttribute("href");
                      j("href", $);
                      const ye = $.getAttribute("href");
                      le !== ye && N.push({
                        attr: "href",
                        tag: ne,
                        before: le,
                        after: ye
                      });
                    }
                    if ($.hasAttribute("href") && ne !== "link") {
                      const le = $.getAttribute("href");
                      j("href", $);
                      const ye = $.getAttribute("href");
                      le !== ye && N.push({
                        attr: "href",
                        tag: ne,
                        before: le,
                        after: ye
                      });
                    }
                    if ($.hasAttribute("xlink:href")) {
                      const le = $.getAttribute("xlink:href");
                      j("xlink:href", $);
                      const ye = $.getAttribute("xlink:href");
                      le !== ye && N.push({
                        attr: "xlink:href",
                        tag: ne,
                        before: le,
                        after: ye
                      });
                    }
                    if ($.hasAttribute("poster")) {
                      const le = $.getAttribute("poster");
                      j("poster", $);
                      const ye = $.getAttribute("poster");
                      le !== ye && N.push({
                        attr: "poster",
                        tag: ne,
                        before: le,
                        after: ye
                      });
                    }
                    if ($.hasAttribute("srcset")) {
                      const le = ($.getAttribute("srcset") || "").split(",").map((ye) => ye.trim()).filter(Boolean).map((ye) => {
                        const [fe, ve] = ye.split(/\s+/, 2);
                        if (!fe || /^(https?:)?\/\//i.test(fe) || fe.startsWith("/")) return ye;
                        try {
                          const De = new URL(fe, se).toString();
                          return ve ? `${De} ${ve}` : De;
                        } catch {
                          return ye;
                        }
                      }).join(", ");
                      $.setAttribute("srcset", le);
                    }
                  } catch {
                  }
                  const Y = I.documentElement && I.documentElement.outerHTML ? I.documentElement.outerHTML : E;
                  try {
                    Ct() && N && N.length && S("[router] rewritten asset refs", {
                      abs: b,
                      rewritten: N
                    });
                  } catch {
                  }
                  return {
                    data: {
                      raw: Y,
                      isHtml: !0
                    },
                    pagePath: String(n ?? ""),
                    anchor: o
                  };
                }
              } catch {
              }
              let ie = E;
              try {
                let C = String(E ?? "");
                C = C.replace(/srcset\s*=\s*"([^"]*)"/gi, (I, j) => `srcset="${String(j ?? "").split(",").map((T) => T.trim()).filter(Boolean).map((T) => {
                  const [N, Y] = T.split(/\s+/, 2);
                  if (!N || /^(https?:)?\/\//i.test(N) || N.startsWith("/") || N.startsWith("#")) return T;
                  try {
                    const $ = new URL(N, se).toString();
                    return Y ? `${$} ${Y}` : $;
                  } catch {
                    return T;
                  }
                }).join(", ")}"`), C = C.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi, (I, j, T) => {
                  if (!T || /^(https?:)?\/\//i.test(T) || T.startsWith("/") || T.startsWith("#")) return I;
                  try {
                    const N = new URL(T, se).toString();
                    return I.replace(`href="${T}"`, `href="${N}"`);
                  } catch {
                    return I;
                  }
                }), C = C.replace(/\bsrc\s*=\s*"([^"]*)"/gi, (I, j) => {
                  if (!j || /^(https?:)?\/\//i.test(j) || j.startsWith("/") || j.startsWith("#")) return I;
                  try {
                    return `src="${new URL(j, se).toString()}"`;
                  } catch {
                    return I;
                  }
                }), C = C.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi, (I, j) => {
                  if (!j || /^(https?:)?\/\//i.test(j) || j.startsWith("/") || j.startsWith("#")) return I;
                  try {
                    return `xlink:href="${new URL(j, se).toString()}"`;
                  } catch {
                    return I;
                  }
                }), C = C.replace(/\bposter\s*=\s*"([^"]*)"/gi, (I, j) => {
                  if (!j || /^(https?:)?\/\//i.test(j) || j.startsWith("/") || j.startsWith("#")) return I;
                  try {
                    return `poster="${new URL(j, se).toString()}"`;
                  } catch {
                    return I;
                  }
                }), ie = C;
              } catch {
                ie = E;
              }
              return /<base\s+[^>]*>/i.test(ie) || (/<head[^>]*>/i.test(ie) ? ie = ie.replace(/(<head[^>]*>)/i, `$1<base href="${he}">`) : ie = `<base href="${he}">` + ie), {
                data: {
                  raw: ie,
                  isHtml: !0
                },
                pagePath: String(n ?? ""),
                anchor: o
              };
            } catch {
              return {
                data: {
                  raw: E,
                  isHtml: !0
                },
                pagePath: String(n ?? ""),
                anchor: o
              };
            }
          }
        }
      } catch (b) {
        Ct() && S("[router] absolute HTML fetch fallback failed", b);
      }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(a ?? ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof Se == "string" && Se && Ct()) {
        const k = [`/assets/${b}.html`, `/assets/${b}/index.html`];
        for (const E of k) try {
          const z = await fetch(E, Object.assign({ method: "GET" }, r ? { signal: r.signal } : {}));
          if (z && z.ok) return {
            data: {
              raw: await z.text(),
              isHtml: !0
            },
            pagePath: E.replace(/^\//, ""),
            anchor: o
          };
        } catch {
        }
      }
    } catch (b) {
      Ct() && S("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return {
    data: g,
    pagePath: _,
    anchor: o
  };
}
function Ka() {
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
var qn = Ka();
function al(e) {
  qn = e;
}
var Dn = { exec: () => null };
function Yn(e) {
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
      return o = o.replace(_t.caret, "$1"), n = n.replace(i, o), r;
    },
    getRegex: () => new RegExp(n, t)
  };
  return r;
}
var yu = ((e = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + e);
  } catch {
    return !1;
  }
})(), _t = {
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
  nextBulletRegex: Yn((e) => new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
  hrRegex: Yn((e) => new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),
  fencesBeginRegex: Yn((e) => new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
  headingBeginRegex: Yn((e) => new RegExp(`^ {0,${e}}#`)),
  htmlBeginRegex: Yn((e) => new RegExp(`^ {0,${e}}(?:</?(?:${Jr})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")),
  blockquoteBeginRegex: Yn((e) => new RegExp(`^ {0,${e}}>`))
}, _u = /^(?:[ \t]*(?:\n|$))+/, bu = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, wu = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Kr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ku = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ja = / {0,3}(?:[*+-]|\d{1,9}[.)])/, sl = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ol = Le(sl).replace(/bull/g, Ja).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), xu = Le(sl).replace(/bull/g, Ja).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), es = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Su = /^[^\n]+/, ts = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, vu = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ts).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Au = Le(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Ja).getRegex(), Jr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ns = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Eu = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ns).replace("tag", Jr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ll = (e) => Le(es).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex(), Tu = ll(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), ju = ll(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), rs = {
  blockquote: Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ju).getRegex(),
  code: bu,
  def: vu,
  fences: wu,
  heading: ku,
  hr: Kr,
  html: Eu,
  lheading: ol,
  list: Au,
  newline: _u,
  paragraph: Tu,
  table: Dn,
  text: Su
}, Is = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex(), Ru = {
  ...rs,
  lheading: xu,
  table: Is,
  paragraph: Le(es).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Is).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jr).getRegex()
}, Lu = {
  ...rs,
  html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ns).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Dn,
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Le(es).replace("hr", Kr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ol).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Cu = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Mu = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, cl = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Pu = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, on = /[\p{P}\p{S}]/u, sr = /[\s\p{P}\p{S}]/u, ei = /[^\s\p{P}\p{S}]/u, Iu = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, sr).getRegex(), Nu = /[\p{Pi}\p{Ps}"']/u, ul = /(?!~)[\p{P}\p{S}]/u, Ou = /(?!~)[\s\p{P}\p{S}]/u, zu = /(?:[^\s\p{P}\p{S}]|~)/u, $u = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", yu ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), hl = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Du = Le(hl, "u").replace(/punct/g, on).getRegex(), Bu = Le(hl, "u").replace(/punct/g, ul).getRegex(), Uu = Le(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, Nu).replace(/punct/g, on).getRegex(), fl = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Wu = Le(fl, "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, sr).replace(/punct/g, on).getRegex(), Fu = Le(fl, "gu").replace(/notPunctSpace/g, zu).replace(/punctSpace/g, Ou).replace(/punct/g, ul).getRegex(), qu = Le("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, sr).replace(/punct/g, on).getRegex(), Hu = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, sr).replace(/punct/g, on).getRegex(), Gu = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, sr).replace(/punct/g, on).getRegex(), Vu = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, on).getRegex(), Zu = Le("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, ei).replace(/punctSpace/g, sr).replace(/punct/g, on).getRegex(), Xu = Le(/\\(punct)/, "gu").replace(/punct/g, on).getRegex(), Yu = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Qu = Le(ns).replace("(?:-->|$)", "-->").getRegex(), Ku = Le("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qu).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), dl = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, $i = Le(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", dl).getRegex(), Ju = Le(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label", $i).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), eh = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", $i).replace("ref", ts).getRegex(), th = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", ts).getRegex(), Ns = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, nh = Le(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", dl).getRegex(), rh = Le("reflink|nolink(?!\\()", "g").replace("reflink", Le(/^!?\[(label)\]\[(ref)\]/).replace("label", nh).replace("ref", Ns).getRegex()).replace("nolink", Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ns).getRegex()).getRegex(), Os = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ih = Le(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), is = {
  _backpedal: Dn,
  anyPunctuation: Xu,
  autolink: Yu,
  blockSkip: $u,
  br: cl,
  code: Mu,
  del: Dn,
  delLDelim: Dn,
  delRDelim: Dn,
  emStrongLDelim: Du,
  emStrongRDelimAst: Wu,
  emStrongRDelimUnd: Hu,
  escape: Cu,
  link: Ju,
  nolink: th,
  punctuation: Iu,
  reflink: eh,
  reflinkSearch: rh,
  tag: Ku,
  text: Pu,
  url: Dn
}, ah = {
  ...is,
  emStrongLDelim: Uu,
  emStrongRDelimAst: qu,
  emStrongRDelimUnd: Gu,
  link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", $i).getRegex(),
  reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", $i).getRegex()
}, ja = {
  ...is,
  emStrongRDelimAst: Fu,
  emStrongLDelim: Bu,
  delLDelim: Vu,
  delRDelim: Zu,
  url: Le(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", ih).replace("protocol", Os).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
  text: Le(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Os).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, sh = {
  ...ja,
  br: Le(cl).replace("{2,}", "*").getRegex(),
  text: Le(ja.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, gi = {
  normal: rs,
  gfm: Ru,
  pedantic: Lu
}, br = {
  normal: is,
  gfm: ja,
  breaks: sh,
  pedantic: ah
}, oh = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, zs = (e) => oh[e];
function It(e, t) {
  if (t) {
    if (_t.escapeTest.test(e)) return e.replace(_t.escapeReplace, zs);
  } else if (_t.escapeTestNoEncode.test(e)) return e.replace(_t.escapeReplaceNoEncode, zs);
  return e;
}
function lh(e) {
  return e.replace(_t.numericCharacterReference, (t, n, r) => {
    let i = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
    return i === 0 || i > 1114111 || i >= 55296 && i <= 57343 ? "�" : String.fromCodePoint(i);
  });
}
function $s(e) {
  try {
    e = encodeURI(e).replace(_t.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ds(e, t) {
  let n = e.replace(_t.findPipe, (i, a, o) => {
    let s = !1, l = a;
    for (; --l >= 0 && o[l] === "\\"; ) s = !s;
    return s ? "|" : " |";
  }).split(_t.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
  else for (; n.length < t; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(_t.slashPipe, "|");
  return n;
}
function mn(e, t, n) {
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
function Bs(e) {
  let t = e.split(`
`), n = t.length - 1;
  for (; n >= 0 && _t.blankLine.test(t[n]); ) n--;
  return t.length - n <= 2 ? e : t.slice(0, n + 1).join(`
`);
}
function Di(e) {
  return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Us(e, t) {
  if (e.indexOf(t[0]) === -1 && e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
  else if (e[r] === t[0]) n++;
  else if (e[r] === t[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Ws(e, t = 0) {
  let n = t, r = "";
  for (let i of e) if (i === "	") {
    let a = 4 - n % 4;
    r += " ".repeat(a), n += a;
  } else r += i, n++;
  return r;
}
function Fs(e, t, n, r, i) {
  let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), l = e[0].charAt(0) === "!";
  r.state.inLink = !0;
  let c = r.state.linkEmitted, u = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let d = r.inlineTokens(s), f = r.state.linkEmitted;
  if (r.state.linkEmitted = c, r.state.inLink = !1, !l) {
    if (f) {
      r.state.inRawBlock = u;
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
function ch(e, t, n) {
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
function qs(e, t, n, r) {
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
var Bi = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || qn;
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
      let n = this.options.pedantic ? t[0] : Bs(t[0]);
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
      let n = t[0], r = ch(n, t[3] || "", this.rules);
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
        let r = mn(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (n = r.trim());
      }
      return {
        type: "heading",
        raw: mn(t[0], `
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
      raw: mn(t[0], `
`)
    };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = mn(t[0], `
`).split(`
`), r = "", i = "", a = [];
      for (; n.length > 0; ) {
        let o = !1, s = [], l = 0;
        for (; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) s.push(n[l]), o = !0;
        else if (!o) s.push(n[l]);
        else break;
        n = n.slice(l);
        let c = s.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, i = i ? `${i}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = d, n.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, m = n.join(`
`), g = p.raw + `
` + m.replace(this.rules.other.blockquoteSetextReplace2, ""), _ = this.blockquote(g);
          a[a.length - 1] = _;
          let h = g.substring(_.raw.length).replace(/^\n/, ""), w = h ? h.split(`
`).length : 0, b = w ? n.slice(0, -w) : n;
          b.length > 0 && (r = `${r}
${b.join(`
`)}`), i = i.substring(0, i.length - p.text.length) + _.text;
          break;
        } else if (f?.type === "list") {
          let p = f, m = p.raw + `
` + n.join(`
`), g = this.list(m);
          a[a.length - 1] = g, r = r.substring(0, r.length - f.raw.length) + g.raw, i = i.substring(0, i.length - p.raw.length) + g.raw, n = m.substring(a.at(-1).raw.length).split(`
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
        let l = !1, c = "", u = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let d = t[2].split(`
`, 1)[0], f = t[1].length, p = this.options.pedantic ? Ws(d, f) : d.replace(this.rules.other.leadingSpaceTab, (h) => Ws(h, f)), m = e.split(`
`, 1)[0], g = !p.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, u = p.trimStart()) : g ? _ = f + 1 : (_ = p.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, u = p.slice(_), _ += f), g && this.rules.other.blankLine.test(m) && (c += m + `
`, e = e.substring(m.length + 1), l = !0), !l) {
          let h = this.rules.other.nextBulletRegex(_), w = this.rules.other.hrRegex(_), b = this.rules.other.fencesBeginRegex(_), k = this.rules.other.headingBeginRegex(_), E = this.rules.other.htmlBeginRegex(_), z = this.rules.other.blockquoteBeginRegex(_);
          for (; e; ) {
            let W = e.split(`
`, 1)[0], F;
            if (m = W, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), F = m) : F = m.replace(this.rules.other.leadingSpaceTab, (K) => K.replace(this.rules.other.tabCharGlobal, "    ")), b.test(m) || k.test(m) || E.test(m) || z.test(m) || h.test(m) || w.test(m)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) u += `
` + F.slice(_);
            else {
              if (g || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(p) || k.test(p) || w.test(p)) break;
              u += `
` + m;
            }
            g = !m.trim(), c += W + `
`, e = e.substring(W.length + 1), p = F.slice(_);
          }
        }
        i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (o = !0)), i.items.push({
          type: "list_item",
          raw: c,
          task: !!this.options.gfm && this.rules.other.listIsTask.test(u),
          loose: !1,
          text: u,
          tokens: []
        }), i.raw += c;
      }
      let s = i.items.at(-1);
      if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let l of i.items) if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), !i.loose) {
        let c = l.tokens.filter((u) => u.type === "space");
        i.loose = c.length > 0 && c.some((u) => this.rules.other.anyLine.test(u.raw));
      }
      for (let l of i.items) {
        let c = l.tokens[0];
        if (l.task && (c?.type === "text" || c?.type === "paragraph")) {
          l.text = l.text.replace(this.rules.other.listReplaceTask, ""), c.raw = c.raw.replace(this.rules.other.listReplaceTask, ""), c.text = c.text.replace(this.rules.other.listReplaceTask, "");
          for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
            this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let u = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (u) {
            let d = {
              type: "checkbox",
              raw: u[0] + " ",
              checked: u[0] !== "[ ]"
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
      let n = Bs(t[0]);
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
      if (!this.rules.other.startAngleBracket.test(t[2]) && Us(t[2], "()") !== -1) return;
      let n = Di(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: mn(t[0], `
`),
        href: r,
        title: i
      };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = Ds(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = {
      type: "table",
      raw: mn(t[0], `
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
      for (let o of i) a.rows.push(Ds(o, a.header.length).map((s, l) => ({
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
        raw: mn(t[0], `
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
      if (!this.options.pedantic && qs(e, t[1], n, this.rules)) return;
      let r = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let o = mn(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = Us(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Fs(t, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: a && a.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = n[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && qs(e, n[1], r, this.rules)) return;
      let i = t[Di((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
      if (!i) {
        let a = n[0].charAt(0);
        return {
          type: "text",
          raw: a,
          text: a
        };
      }
      return Fs(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
      let i = [...r[0]].length - 1, a, o, s = i, l = 0, c = r[0][0], u = n === c, d = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
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
          if (u) break;
        }
        if (s -= o, s > 0) continue;
        o = Math.min(o, o + s + l);
        let f = [...r[0]][0].length, p = e.slice(0, i + r.index + f + o);
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
        let c = [...r[0]][0].length, u = e.slice(0, i + r.index + c + o), d = u.slice(i, -i);
        return {
          type: "del",
          raw: u,
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
        text: n ? t[0] : lh(t[0]),
        escaped: n
      };
    }
  }
}, Gt = class Ra {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || qn, this.options.tokenizer = this.options.tokenizer || new Bi(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      linkEmitted: !1,
      linkParenPossible: !0,
      top: !0
    };
    let n = {
      other: _t,
      block: gi.normal,
      inline: br.normal
    };
    this.options.pedantic ? (n.block = gi.pedantic, n.inline = br.pedantic) : this.options.gfm && (n.block = gi.gfm, this.options.breaks ? n.inline = br.breaks : n.inline = br.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return {
      block: gi,
      inline: br
    };
  }
  static lex(t, n) {
    return new Ra(n).lex(t);
  }
  static lexInline(t, n) {
    return new Ra(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(_t.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (t = t.replace(_t.tabCharGlobal, "    ").replace(_t.spaceLine, ""));
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
        this.options.extensions.startBlock.forEach((u) => {
          c = u.call({ lexer: this }, l), typeof c == "number" && c >= 0 && (s = Math.min(s, c));
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
      if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Di(i.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(i.slice(1, a - 1)))) return !0;
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
        let u = c.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Di(c.slice(u + 1, -1)))) return c;
        if (u > 1 && c.charAt(0) !== "!") {
          let d = c.slice(1, u - 1);
          if (this.linkInText(d)) return "[" + d.replace(s, l) + "][" + "a".repeat(c.length - u - 2) + "]";
        }
        return "[" + "a".repeat(c.length - 2) + "]";
      };
      r = r.replace(s, l);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (s) => "+".repeat(s.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (s, l, c) => {
      let u = c ? c.length : 0;
      return s.slice(0, u) + "[" + "a".repeat(s.length - u - 2) + "]";
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
        let c = 1 / 0, u = t.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (c = Math.min(c, d));
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
}, Ui = class {
  options;
  parser;
  constructor(e) {
    this.options = e || qn;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(_t.notSpaceStart)?.[0], i = e ? e.replace(_t.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + It(r) + '">' + (n ? i : It(i, !0)) + `</code></pre>
` : "<pre><code>" + (n ? i : It(i, !0)) + `</code></pre>
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
    return `<code>${It(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
    let a = i ? It(n, !0) : this.parser.parseInline(r), o = $s(e);
    if (o === null) return a;
    e = It(o, i);
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + It(t) + '"'), s += ">" + a + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = $s(e);
    if (i === null) return It(n);
    e = i;
    let a = `<img src="${It(e)}" alt="${It(n)}"`;
    return t && (a += ` title="${It(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : It(e.text);
  }
}, as = class {
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
}, Vt = class La {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || qn, this.options.renderer = this.options.renderer || new Ui(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new as();
  }
  static parse(t, n) {
    return new La(n).parse(t);
  }
  static parseInline(t, n) {
    return new La(n).parseInline(t);
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
    this.options = e || qn;
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
    return e ? Gt.lex : Gt.lexInline;
  }
  provideParser(e = this.block) {
    return e ? Vt.parse : Vt.parseInline;
  }
}, uh = class {
  defaults = Ka();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Vt;
  Renderer = Ui;
  TextRenderer = as;
  Lexer = Gt;
  Tokenizer = Bi;
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
        let i = this.defaults.renderer || new Ui(this.defaults);
        for (let a in n.renderer) {
          if (!(a in i)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let o = a, s = n.renderer[o], l = i[o];
          i[o] = (...c) => {
            let u = s.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new Bi(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in i)) throw new Error(`tokenizer '${a}' does not exist`);
          if ([
            "options",
            "rules",
            "lexer"
          ].includes(a)) continue;
          let o = a, s = n.tokenizer[o], l = i[o];
          i[o] = (...c) => {
            let u = s.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
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
            let u = s.call(i, c);
            return l.call(i, u);
          } : i[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let d = await s.apply(i, c);
              return d === !1 && (d = await l.apply(i, c)), d;
            })();
            let u = s.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
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
    return Gt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Vt.parse(e, t ?? this.defaults);
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
        let o = i.hooks ? await i.hooks.preprocess(t) : t, s = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Gt.lex : Gt.lexInline)(o, i), l = i.hooks ? await i.hooks.processAllTokens(s) : s;
        i.walkTokens && await Promise.all(this.walkTokens(l, i.walkTokens));
        let c = await (i.hooks ? await i.hooks.provideParser(e) : e ? Vt.parse : Vt.parseInline)(l, i);
        return i.hooks ? await i.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        i.hooks && (t = i.hooks.preprocess(t));
        let o = (i.hooks ? i.hooks.provideLexer(e) : e ? Gt.lex : Gt.lexInline)(t, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let s = (i.hooks ? i.hooks.provideParser(e) : e ? Vt.parse : Vt.parseInline)(o, i);
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
        let r = "<p>An error occurred:</p><pre>" + It(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Fn = new uh();
function Oe(e, t) {
  return Fn.parse(e, t);
}
Oe.options = Oe.setOptions = function(e) {
  return Fn.setOptions(e), Oe.defaults = Fn.defaults, al(Oe.defaults), Oe;
};
Oe.getDefaults = Ka;
Oe.defaults = qn;
function hh(...e) {
  return Fn.use(...e), Oe.defaults = Fn.defaults, al(Oe.defaults), Oe;
}
Oe.use = hh;
Oe.walkTokens = function(e, t) {
  return Fn.walkTokens(e, t);
};
Oe.parseInline = Fn.parseInline;
Oe.Parser = Vt;
Oe.parser = Vt.parse;
Oe.Renderer = Ui;
Oe.TextRenderer = as;
Oe.Lexer = Gt;
Oe.lexer = Gt.lex;
Oe.Tokenizer = Bi;
Oe.Hooks = Ar;
Oe.parse = Oe;
var ed = Oe.options, td = Oe.setOptions, nd = Oe.walkTokens, rd = Oe.parseInline, id = Vt.parse, ad = Gt.lex, pl = `var hi = Object.create, vn = Object.defineProperty, pi = Object.getOwnPropertyDescriptor, fi = Object.getOwnPropertyNames, gi = Object.getPrototypeOf, Gr = Object.prototype.hasOwnProperty, di = (t, e) => () => (e || (t((e = { exports: {} }).exports, e), t = null), e.exports), mi = (t, e) => {
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
`, Hs = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", pl], { type: "text/javascript;charset=utf-8" });
function fh(e) {
  let t;
  try {
    if (t = Hs && (self.URL || self.webkitURL).createObjectURL(Hs), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(pl), {
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
function dh(e, t) {
  this.v = e, this.k = t;
}
function Gs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ph(e) {
  if (Array.isArray(e)) return e;
}
function gh(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, i, a, o, s = [], l = !0, c = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        l = !1;
      } else for (; !(l = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); l = !0) ;
    } catch (u) {
      c = !0, i = u;
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
function mh() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yh(e, t) {
  return ph(e) || gh(e, t) || _h(e, t) || mh();
}
function _h(e, t) {
  if (e) {
    if (typeof e == "string") return Gs(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gs(e, t) : void 0;
  }
}
function mi(e) {
  var t, n;
  function r(a, o) {
    try {
      var s = e[a](o), l = s.value, c = l instanceof dh;
      Promise.resolve(c ? l.v : l).then(function(u) {
        if (c) {
          var d = a === "return" && l.k ? a : "next";
          if (!l.k || u.done) return r(d, u);
          u = e[d](u).value;
        }
        i(!!s.done, u);
      }, function(u) {
        r("throw", u);
      });
    } catch (u) {
      i(2, u);
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
var gl = Object.entries, Vs = Object.setPrototypeOf, bh = Object.isFrozen, wh = Object.getPrototypeOf, kh = Object.getOwnPropertyDescriptor, dt = Object.freeze, gt = Object.seal, Kn = Object.create, ml = typeof Reflect < "u" && Reflect, Ca = ml.apply, Ma = ml.construct;
dt || (dt = function(t) {
  return t;
});
gt || (gt = function(t) {
  return t;
});
Ca || (Ca = function(t, n) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) i[a - 2] = arguments[a];
  return t.apply(n, i);
});
Ma || (Ma = function(t) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
  return new t(...r);
});
var zn = ct(Array.prototype.forEach);
Array.prototype.indexOf;
var xh = ct(Array.prototype.lastIndexOf), Zs = ct(Array.prototype.pop), wr = ct(Array.prototype.push);
Array.prototype.slice;
var Sh = ct(Array.prototype.splice), nr = Array.isArray, Tr = ct(String.prototype.toLowerCase), oa = ct(String.prototype.toString), Xs = ct(String.prototype.match), kr = ct(String.prototype.replace), Ys = ct(String.prototype.indexOf), vh = ct(String.prototype.trim), Ah = ct(Number.prototype.toString), Eh = ct(Boolean.prototype.toString), Qs = typeof BigInt > "u" ? null : ct(BigInt.prototype.toString), Ks = typeof Symbol > "u" ? null : ct(Symbol.prototype.toString), Tt = ct(Object.prototype.hasOwnProperty), xr = ct(Object.prototype.toString), wt = ct(RegExp.prototype.test), yn = Th(TypeError);
function ct(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
    return Ca(e, t, r);
  };
}
function Th(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];
    return Ma(e, n);
  };
}
function We(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Tr;
  if (Vs && Vs(e, null), !nr(t)) return e;
  let r = t.length;
  for (; r--; ) {
    let i = t[r];
    if (typeof i == "string") {
      const a = n(i);
      a !== i && (bh(t) || (t[r] = a), i = a);
    }
    e[i] = !0;
  }
  return e;
}
function jh(e) {
  for (let t = 0; t < e.length; t++) Tt(e, t) || (e[t] = null);
  return e;
}
function Nt(e) {
  const t = Kn(null);
  for (const r of gl(e)) {
    var n = yh(r, 2);
    const i = n[0], a = n[1];
    Tt(e, i) && (nr(a) ? t[i] = jh(a) : a && typeof a == "object" && a.constructor === Object ? t[i] = Nt(a) : t[i] = a);
  }
  return t;
}
function Rh(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return Ah(e);
    case "boolean":
      return Eh(e);
    case "bigint":
      return Qs ? Qs(e) : "0";
    case "symbol":
      return Ks ? Ks(e) : "Symbol()";
    case "undefined":
      return xr(e);
    case "function":
    case "object": {
      if (e === null) return xr(e);
      const t = e, n = Ut(t, "toString");
      if (typeof n == "function") {
        const r = n(t);
        return typeof r == "string" ? r : xr(r);
      }
      return xr(e);
    }
    default:
      return xr(e);
  }
}
function Ut(e, t) {
  for (; e !== null; ) {
    const r = kh(e, t);
    if (r) {
      if (r.get) return ct(r.get);
      if (typeof r.value == "function") return ct(r.value);
    }
    e = wh(e);
  }
  function n() {
    return null;
  }
  return n;
}
function Lh(e) {
  try {
    return wt(e, ""), !0;
  } catch {
    return !1;
  }
}
var Js = dt([
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
]), la = dt([
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
]), ca = dt([
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
]), Ch = dt([
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
]), ua = dt([
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
]), Mh = dt([
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
]), eo = dt(["#text"]), to = dt([
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
]), ha = dt([
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
]), no = dt([
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
]), yi = dt([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ph = gt(/{{[\w\W]*|^[\w\W]*}}/g), Ih = gt(/<%[\w\W]*|^[\w\W]*%>/g), Nh = gt(/\${[\w\W]*/g), Oh = gt(/^data-[\-\w.\u00B7-\uFFFF]+$/), zh = gt(/^aria-[\-\w]+$/), ro = gt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), $h = gt(/^(?:\w+script|data):/i), Dh = gt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Bh = gt(/^html$/i), Uh = gt(/^[a-z][.\w]*(-[.\w]+)+$/i), io = gt(/<[/\w!]/g), ao = gt(/<[/\w]/g), Wh = gt(/<\/no(script|embed|frames)/i), Fh = gt(/\/>/i), Mt = {
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
}, yl = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], qh = dt(We({}, yl)), Hh = (function() {
  const e = {};
  return zn(yl, (t) => {
    e[t] = gt(new RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
  }), dt(e);
})(), Gh = function() {
  return typeof window > "u" ? null : window;
}, Vh = function(t, n) {
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
}, so = function() {
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
}, _n = function(t, n, r, i) {
  return Tt(t, n) && nr(t[n]) ? We(i.base ? Nt(i.base) : {}, t[n], i.transform) : r;
}, fa = function(t, n, r) {
  const i = Tt(t, n) ? t[n] : void 0;
  return i && typeof i == "object" ? Nt(i) : r();
};
function _l() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Gh();
  const t = (Q) => _l(Q);
  if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== Mt.document || !e.Element)
    return t.isSupported = !1, t;
  let n = e.document;
  const r = n, i = r.currentScript;
  e.DocumentFragment;
  const a = e.HTMLTemplateElement, o = e.Node, s = e.Element, l = e.NodeFilter;
  e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const c = e.DOMParser, u = e.trustedTypes, d = s.prototype, f = Ut(d, "cloneNode"), p = Ut(d, "remove"), m = Ut(d, "removeAttributeNode"), g = Ut(d, "nextSibling"), _ = Ut(d, "childNodes"), h = Ut(d, "parentNode"), w = Ut(d, "shadowRoot"), b = Ut(d, "attributes"), k = o && o.prototype ? Ut(o.prototype, "nodeType") : null, E = o && o.prototype ? Ut(o.prototype, "nodeName") : null, z = o && o.prototype ? Ut(o.prototype, "ownerDocument") : null, W = function(x) {
    return k ? k(x) : x.nodeType;
  }, F = function(x) {
    return E ? E(x) : x.nodeName;
  };
  if (typeof a == "function") {
    const Q = n.createElement("template");
    Q.content && Q.content.ownerDocument && (n = Q.content.ownerDocument);
  }
  let K, se = "", he, ie = !1, C = 0;
  const I = function() {
    if (C > 0) throw yn('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, j = function(x) {
    I(), C++;
    try {
      return K.createHTML(x);
    } finally {
      C--;
    }
  }, T = function(x) {
    I(), C++;
    try {
      return K.createScriptURL(x);
    } finally {
      C--;
    }
  }, N = function() {
    return ie || (he = Vh(u, i), ie = !0), he;
  }, Y = n, $ = Y.implementation, ne = Y.createNodeIterator, le = Y.createDocumentFragment, ye = Y.getElementsByTagName, fe = r.importNode;
  let ve = so();
  t.isSupported = typeof gl == "function" && typeof h == "function" && $ && $.createHTMLDocument !== void 0;
  const De = Ph, ce = Ih, Be = Nh, et = Oh, ot = zh, A = $h, M = Dh, H = Uh;
  let D = ro, L = null;
  const B = We({}, [
    ...Js,
    ...la,
    ...ca,
    ...ua,
    ...eo
  ]);
  let O = null;
  const J = We({}, [
    ...to,
    ...ha,
    ...no,
    ...yi
  ]);
  let U = Object.seal(Kn(null, {
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
  })), G = null, V = null;
  const ae = Object.seal(Kn(null, {
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
  let me = !0, Pe = !0, Ce = !1, Ne = !0, Ae = !1, He = !0, Ue = !1, Ft = !1, Ln = null, Hn = null, or = !1, ln = !1, Gn = !1, Vn = !1, lr = !0, ti = !1;
  const ni = "user-content-";
  let cr = !0, Cn = !1, en = {}, tn = null;
  const ri = We({}, [
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
  let ur = null;
  const nn = We({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let v = null;
  const X = We({}, [
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
  ]), de = "http://www.w3.org/1998/Math/MathML", Re = "http://www.w3.org/2000/svg", Fe = "http://www.w3.org/1999/xhtml";
  let Ve = Fe, _e = !1, ge = null;
  const Te = We({}, [
    de,
    Re,
    Fe
  ], oa), st = dt([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Je = We({}, st);
  const cn = dt(["annotation-xml"]);
  let Mn = We({}, cn);
  const hr = We({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Pn = null;
  const fr = ["application/xhtml+xml", "text/html"], Yi = "text/html";
  let tt = null, un = null;
  const ii = n.createElement("form"), In = function(x) {
    return x instanceof RegExp || x instanceof Function;
  }, dr = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (un && un === x) return;
    (!x || typeof x != "object") && (x = {}), x = Nt(x), Pn = fr.indexOf(x.PARSER_MEDIA_TYPE) === -1 ? Yi : x.PARSER_MEDIA_TYPE, tt = Pn === "application/xhtml+xml" ? oa : Tr, L = _n(x, "ALLOWED_TAGS", B, { transform: tt }), O = _n(x, "ALLOWED_ATTR", J, { transform: tt }), ge = _n(x, "ALLOWED_NAMESPACES", Te, { transform: oa }), v = _n(x, "ADD_URI_SAFE_ATTR", X, {
      transform: tt,
      base: X
    }), ur = _n(x, "ADD_DATA_URI_TAGS", nn, {
      transform: tt,
      base: nn
    }), tn = _n(x, "FORBID_CONTENTS", ri, { transform: tt }), G = _n(x, "FORBID_TAGS", Nt({}), { transform: tt }), V = _n(x, "FORBID_ATTR", Nt({}), { transform: tt }), en = Tt(x, "USE_PROFILES") ? x.USE_PROFILES && typeof x.USE_PROFILES == "object" ? Nt(x.USE_PROFILES) : x.USE_PROFILES : !1, me = x.ALLOW_ARIA_ATTR !== !1, Pe = x.ALLOW_DATA_ATTR !== !1, Ce = x.ALLOW_UNKNOWN_PROTOCOLS || !1, Ne = x.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ae = x.SAFE_FOR_TEMPLATES || !1, He = x.SAFE_FOR_XML !== !1, Ue = x.WHOLE_DOCUMENT || !1, ln = x.RETURN_DOM || !1, Gn = x.RETURN_DOM_FRAGMENT || !1, Vn = x.RETURN_TRUSTED_TYPE || !1, or = x.FORCE_BODY || !1, lr = x.SANITIZE_DOM !== !1, ti = x.SANITIZE_NAMED_PROPS || !1, cr = x.KEEP_CONTENT !== !1, Cn = x.IN_PLACE || !1, D = Lh(x.ALLOWED_URI_REGEXP) ? x.ALLOWED_URI_REGEXP : ro, Ve = typeof x.NAMESPACE == "string" ? x.NAMESPACE : Fe, Je = fa(x, "MATHML_TEXT_INTEGRATION_POINTS", () => We({}, st)), Mn = fa(x, "HTML_INTEGRATION_POINTS", () => We({}, cn));
    const R = fa(x, "CUSTOM_ELEMENT_HANDLING", () => Kn(null));
    if (U = Kn(null), Tt(R, "tagNameCheck") && In(R.tagNameCheck) && (U.tagNameCheck = R.tagNameCheck), Tt(R, "attributeNameCheck") && In(R.attributeNameCheck) && (U.attributeNameCheck = R.attributeNameCheck), Tt(R, "allowCustomizedBuiltInElements") && typeof R.allowCustomizedBuiltInElements == "boolean" && (U.allowCustomizedBuiltInElements = R.allowCustomizedBuiltInElements), gt(U), Ae && (Pe = !1), Gn && (ln = !0), en && (L = We({}, eo), O = Kn(null), en.html === !0 && (We(L, Js), We(O, to)), en.svg === !0 && (We(L, la), We(O, ha), We(O, yi)), en.svgFilters === !0 && (We(L, ca), We(O, ha), We(O, yi)), en.mathMl === !0 && (We(L, ua), We(O, no), We(O, yi))), ae.tagCheck = null, ae.attributeCheck = null, Tt(x, "ADD_TAGS") && (typeof x.ADD_TAGS == "function" ? ae.tagCheck = x.ADD_TAGS : nr(x.ADD_TAGS) && (L === B && (L = Nt(L)), We(L, x.ADD_TAGS, tt))), Tt(x, "ADD_ATTR") && (typeof x.ADD_ATTR == "function" ? ae.attributeCheck = x.ADD_ATTR : nr(x.ADD_ATTR) && (O === J && (O = Nt(O)), We(O, x.ADD_ATTR, tt))), Tt(x, "ADD_FORBID_CONTENTS") && nr(x.ADD_FORBID_CONTENTS) && (tn === ri && (tn = Nt(tn)), We(tn, x.ADD_FORBID_CONTENTS, tt)), cr && (L["#text"] = !0), Ue && We(L, [
      "html",
      "head",
      "body"
    ]), L.table && (We(L, ["tbody"]), delete G.tbody), x.TRUSTED_TYPES_POLICY) {
      if (typeof x.TRUSTED_TYPES_POLICY.createHTML != "function") throw yn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof x.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw yn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const Z = K;
      K = x.TRUSTED_TYPES_POLICY;
      try {
        se = j("");
      } catch (P) {
        throw K = Z, P;
      }
    } else x.TRUSTED_TYPES_POLICY === null ? (K = void 0, se = "") : (K === void 0 && (K = N()), K && typeof se == "string" && (se = j("")));
    dt && dt(x), un = x;
  }, ai = We({}, [
    ...la,
    ...ca,
    ...Ch
  ]), si = We({}, [...ua, ...Mh]), Zt = function(x, R, Z) {
    return R.namespaceURI === Fe ? x === "svg" : R.namespaceURI === de ? x === "svg" && (Z === "annotation-xml" || Je[Z]) : !!ai[x];
  }, oi = function(x, R, Z) {
    return R.namespaceURI === Fe ? x === "math" : R.namespaceURI === Re ? x === "math" && Mn[Z] : !!si[x];
  }, li = function(x, R, Z) {
    return R.namespaceURI === Re && !Mn[Z] || R.namespaceURI === de && !Je[Z] ? !1 : !si[x] && (hr[x] || !ai[x]);
  }, Qi = function(x) {
    let R = h(x);
    (!R || !R.tagName) && (R = {
      namespaceURI: Ve,
      tagName: "template"
    });
    const Z = Tr(x.tagName), P = Tr(R.tagName);
    return ge[x.namespaceURI] ? x.namespaceURI === Re ? Zt(Z, R, P) : x.namespaceURI === de ? oi(Z, R, P) : x.namespaceURI === Fe ? li(Z, R, P) : !!(Pn === "application/xhtml+xml" && ge[x.namespaceURI]) : !1;
  }, Xt = function(x) {
    wr(t.removed, { element: x });
    try {
      h(x).removeChild(x);
    } catch {
      if (p(x), !h(x)) throw yn("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, ci = function(x, R, Z) {
    try {
      m(x, R);
    } catch {
      try {
        x.removeAttribute(Z);
      } catch {
      }
    }
  }, rn = function(x) {
    xe(x);
    const R = _(x);
    if (R) {
      const P = [];
      zn(R, (q) => {
        wr(P, q);
      }), zn(P, (q) => {
        try {
          p(q);
        } catch {
        }
      });
    }
    const Z = b(x);
    if (Z) for (let P = Z.length - 1; P >= 0; --P) {
      const q = Z[P], ue = q && q.name;
      typeof ue == "string" && ci(x, q, ue);
    }
  }, an = function(x, R, Z) {
    if (!Z) try {
      Z = R.getAttributeNode(x);
    } catch {
      Z = null;
    }
    wr(t.removed, {
      attribute: Z || null,
      from: R
    });
    try {
      Z ? m(R, Z) : R.removeAttribute(x);
    } catch {
      try {
        R.removeAttribute(x);
      } catch {
      }
    }
    if (x === "is")
      if (ln || Gn) try {
        Xt(R);
      } catch {
      }
      else try {
        R.setAttribute(x, "");
      } catch {
      }
  }, ee = function(x) {
    const R = b(x);
    if (R)
      for (let Z = R.length - 1; Z >= 0; --Z) {
        const P = R[Z], q = P && P.name;
        typeof q != "string" || O[tt(q)] || ci(x, P, q);
      }
  }, xe = function(x) {
    const R = [x];
    for (; R.length > 0; ) {
      const Z = R.pop();
      W(Z) === Mt.element && ee(Z);
      const P = _(Z);
      if (P) for (let q = P.length - 1; q >= 0; --q) R.push(P[q]);
    }
  }, Ie = function(x, R) {
    return He ? x === "patchsrc" ? !0 : x === "for" && R !== "label" && R !== "output" : !1;
  }, Ze = function(x) {
    if (!He) return;
    const R = [x];
    for (; R.length > 0; ) {
      const Z = R.pop(), P = W(Z);
      if (P === Mt.processingInstruction || P === Mt.comment && wt(ao, Z.data)) {
        try {
          p(Z);
        } catch {
        }
        continue;
      }
      if (P === Mt.element) {
        const ue = Z, we = tt(F(Z));
        try {
          ue.hasAttribute && ue.hasAttribute("patchsrc") && ue.removeAttribute("patchsrc"), ue.hasAttribute && ue.hasAttribute("for") && Ie("for", we) && ue.removeAttribute("for");
        } catch {
        }
      }
      const q = _(Z);
      if (q) for (let ue = q.length - 1; ue >= 0; --ue) R.push(q[ue]);
    }
  }, nt = function(x) {
    let R = null, Z = null;
    if (or) x = "<remove></remove>" + x;
    else {
      const ue = Xs(x, /^[\r\n\t ]+/);
      Z = ue && ue[0];
    }
    Pn === "application/xhtml+xml" && Ve === Fe && (x = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + x + "</body></html>");
    const P = K ? j(x) : x;
    if (Ve === Fe) try {
      R = new c().parseFromString(P, Pn);
    } catch {
    }
    if (!R || !R.documentElement) {
      R = $.createDocument(Ve, "template", null);
      try {
        R.documentElement.innerHTML = _e ? se : P;
      } catch {
      }
    }
    const q = R.body || R.documentElement;
    return x && Z && q.insertBefore(n.createTextNode(Z), q.childNodes[0] || null), Ve === Fe ? ye.call(R, Ue ? "html" : "body")[0] : Ue ? R.documentElement : q;
  }, jt = function(x) {
    const R = z ? z(x) : x.ownerDocument;
    return ne.call(R || x, x, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null);
  }, Et = function(x) {
    return x = kr(x, De, " "), x = kr(x, ce, " "), x = kr(x, Be, " "), x;
  }, Rt = function(x) {
    var R;
    x.normalize();
    const Z = z ? z(x) : x.ownerDocument, P = ne.call(Z || x, x, l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION, null);
    let q = P.nextNode();
    for (; q; )
      q.data = Et(q.data), q = P.nextNode();
    const ue = (R = x.querySelectorAll) === null || R === void 0 ? void 0 : R.call(x, "template");
    ue && zn(ue, (we) => {
      qt(we.content) && Rt(we.content);
    });
  }, bt = function(x) {
    const R = E ? E(x) : null;
    return typeof R != "string" || tt(R) !== "form" ? !1 : typeof x.nodeName != "string" || typeof x.textContent != "string" || typeof x.removeChild != "function" || x.attributes !== b(x) || typeof x.removeAttribute != "function" || typeof x.removeAttributeNode != "function" || typeof x.getAttributeNode != "function" || typeof x.setAttribute != "function" || typeof x.namespaceURI != "string" || typeof x.insertBefore != "function" || typeof x.hasChildNodes != "function" || x.nodeType !== k(x) || x.childNodes !== _(x);
  }, qt = function(x) {
    if (!k || typeof x != "object" || x === null) return !1;
    try {
      return k(x) === Mt.documentFragment;
    } catch {
      return !1;
    }
  }, hn = function(x) {
    if (!k || typeof x != "object" || x === null) return !1;
    try {
      return typeof k(x) == "number";
    } catch {
      return !1;
    }
  };
  function Lt(Q, x, R) {
    Q.length !== 0 && zn(Q, (Z) => {
      Z.call(t, x, R, un);
    });
  }
  const ui = function(x, R) {
    return !!(He && x.hasChildNodes() && !hn(x.firstElementChild) && wt(io, x.textContent) && wt(io, x.innerHTML) || He && x.namespaceURI === Fe && qh[R] && (hn(x.firstElementChild) || typeof x.textContent == "string" && wt(Hh[R], x.textContent)) || x.nodeType === Mt.processingInstruction || He && x.nodeType === Mt.comment && wt(ao, x.data));
  }, Zn = function(x, R) {
    if (x instanceof RegExp) return wt(x, R);
    if (x instanceof Function) {
      for (var Z = arguments.length, P = new Array(Z > 2 ? Z - 2 : 0), q = 2; q < Z; q++) P[q - 2] = arguments[q];
      return !!x(R, ...P);
    }
    return !1;
  }, Ki = function(x, R, Z) {
    if (!G[R] && fi(R) && Zn(U.tagNameCheck, R)) return !1;
    if (cr && !tn[R]) {
      const P = h(x), q = _(x);
      if (q && P) {
        const ue = q.length;
        for (let we = ue - 1; we >= 0; --we) {
          const Me = x === Z ? f(q[we], !0) : q[we];
          P.insertBefore(Me, g(x));
        }
      }
    }
    return Xt(x), !0;
  }, hi = function(x, R, Z, P) {
    return x.length === 0 ? R : R === Z || R === P ? Nt(R) : R;
  }, fn = function(x, R) {
    return x === R || h(x) !== null ? !1 : (Cn && xe(x), !0);
  }, Nn = function(x, R) {
    if (Lt(ve.beforeSanitizeElements, x, null), fn(x, R)) return !0;
    if (bt(x))
      return Xt(x), !0;
    const Z = tt(F(x));
    if (L = hi(ve.uponSanitizeElement, L, B, Ln), Lt(ve.uponSanitizeElement, x, {
      tagName: Z,
      allowedTags: L
    }), fn(x, R)) return !0;
    if (ui(x, Z))
      return Xt(x), !0;
    if (G[Z] || !(ae.tagCheck instanceof Function && ae.tagCheck(Z)) && !L[Z]) {
      const P = Ki(x, Z, R);
      return P === !1 && (Lt(ve.afterSanitizeElements, x, null), fn(x, R)) ? !0 : P;
    }
    if (W(x) === Mt.element && !Qi(x) || (Z === "noscript" || Z === "noembed" || Z === "noframes") && wt(Wh, x.innerHTML))
      return Xt(x), !0;
    if (Ae && x.nodeType === Mt.text) {
      const P = Et(x.textContent);
      x.textContent !== P && (wr(t.removed, { element: x.cloneNode() }), x.textContent = P);
    }
    return Lt(ve.afterSanitizeElements, x, null), fn(x, R);
  }, pr = function(x, R, Z) {
    if (V[R] || Ie(R, x) || lr && (R === "id" || R === "name") && (Z in n || Z in ii)) return !1;
    const P = O[R] || ae.attributeCheck instanceof Function && ae.attributeCheck(R, x);
    return Pe && wt(et, R) || me && wt(ot, R) ? !0 : P ? v[R] || wt(D, kr(Z, M, "")) || (R === "src" || R === "xlink:href" || R === "href") && x !== "script" && Ys(Z, "data:") === 0 && ur[x] || Ce && !wt(A, kr(Z, M, "")) ? !0 : !Z : fi(x) && Zn(U.tagNameCheck, x) && Zn(U.attributeNameCheck, R, x) || R === "is" && U.allowCustomizedBuiltInElements && Zn(U.tagNameCheck, Z);
  }, Bt = We({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), fi = function(x) {
    return !Bt[Tr(x)] && wt(H, x);
  }, gr = function(x, R, Z, P) {
    if (K && typeof u == "object" && typeof u.getAttributeType == "function" && !Z) switch (u.getAttributeType(x, R)) {
      case "TrustedHTML":
        return j(P);
      case "TrustedScriptURL":
        return T(P);
    }
    return P;
  }, je = function(x, R, Z, P) {
    try {
      return Z ? x.setAttributeNS(Z, R, P) : x.setAttribute(R, P), bt(x) ? (Xt(x), !1) : !0;
    } catch {
      return an(R, x), !1;
    }
  }, mr = function(x, R) {
    if (Lt(ve.beforeSanitizeAttributes, x, null), fn(x, R)) return;
    const Z = x.attributes;
    if (!Z || bt(x)) return;
    O = hi(ve.uponSanitizeAttribute, O, J, Hn);
    const P = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: O,
      forceKeepAttr: void 0
    };
    let q = Z.length;
    const ue = tt(x.nodeName);
    for (; q--; ) {
      const we = Z[q], Me = we.name, it = we.namespaceURI, St = we.value, dn = tt(Me), Ji = St;
      let vt = Me === "value" ? Ji : vh(Ji), os = !1;
      if (P.attrName = dn, P.attrValue = vt, P.keepAttr = !0, P.forceKeepAttr = void 0, Lt(ve.uponSanitizeAttribute, x, P), vt = P.attrValue, ti && (dn === "id" || dn === "name") && Ys(vt, ni) !== 0 && (an(Me, x, we), vt = ni + vt, os = !0), He && wt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, vt)) {
        an(Me, x, we);
        continue;
      }
      if (dn === "attributename" && Xs(vt, "href")) {
        an(Me, x, we);
        continue;
      }
      if (!P.forceKeepAttr) {
        if (!P.keepAttr) {
          an(Me, x, we);
          continue;
        }
        if (!Ne && wt(Fh, vt)) {
          an(Me, x, we);
          continue;
        }
        if (Ae && (vt = Et(vt)), !pr(ue, dn, vt)) {
          an(Me, x, we);
          continue;
        }
        vt = gr(ue, dn, it, vt), vt !== Ji && je(x, Me, it, vt) && os && Zs(t.removed);
      }
    }
    Lt(ve.afterSanitizeAttributes, x, null), fn(x, R);
  }, rt = function(x) {
    let R = null;
    const Z = jt(x);
    for (Lt(ve.beforeSanitizeShadowDOM, x, null); R = Z.nextNode(); )
      if (Lt(ve.uponSanitizeShadowNode, R, null), Nn(R, x), mr(R, x), qt(R.content) && rt(R.content), W(R) === Mt.element) {
        const P = w(R);
        qt(P) && (Ge(P), rt(P));
      }
    Lt(ve.afterSanitizeShadowDOM, x, null);
  }, Ge = function(x) {
    const R = [{
      node: x,
      shadow: null
    }];
    for (; R.length > 0; ) {
      const Z = R.pop();
      if (Z.shadow) {
        rt(Z.shadow);
        continue;
      }
      const P = Z.node, q = W(P) === Mt.element, ue = _(P);
      if (ue) for (let we = ue.length - 1; we >= 0; --we) R.push({
        node: ue[we],
        shadow: null
      });
      if (q) {
        const we = E ? E(P) : null;
        if (typeof we == "string" && tt(we) === "template") {
          const Me = P.content;
          qt(Me) && R.push({
            node: Me,
            shadow: null
          });
        }
      }
      if (q) {
        const we = w(P);
        qt(we) && R.push({
          node: null,
          shadow: we
        }, {
          node: we,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(Q) {
    let x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, Z = null, P = null, q = null;
    if (_e = !Q, _e && (Q = "<!-->"), typeof Q != "string" && !hn(Q) && (Q = Rh(Q), typeof Q != "string"))
      throw yn("dirty is not a string, aborting");
    if (!t.isSupported) return Q;
    Ft ? (L = Ln, O = Hn) : dr(x), (ve.uponSanitizeElement.length > 0 || ve.uponSanitizeAttribute.length > 0) && (L = Nt(L)), ve.uponSanitizeAttribute.length > 0 && (O = Nt(O)), t.removed = [];
    const ue = Cn && typeof Q != "string" && hn(Q);
    if (ue) {
      Ze(Q);
      const it = F(Q);
      if (typeof it == "string") {
        const St = tt(it);
        if (!L[St] || G[St])
          throw rn(Q), yn("root node is forbidden and cannot be sanitized in-place");
      }
      if (bt(Q))
        throw rn(Q), yn("root node is clobbered and cannot be sanitized in-place");
      try {
        Ge(Q);
      } catch (St) {
        throw rn(Q), St;
      }
    } else if (hn(Q))
      R = nt("<!---->"), Z = R.ownerDocument.importNode(Q, !0), Z.nodeType === Mt.element && Z.nodeName === "BODY" || Z.nodeName === "HTML" ? R = Z : R.appendChild(Z), Ge(R);
    else {
      if (!ln && !Ae && !Ue && Q.indexOf("<") === -1) return K && Vn ? j(Q) : Q;
      if (R = nt(Q), !R) return ln ? null : Vn ? se : "";
    }
    R && or && Xt(R.firstChild);
    const we = ue ? Q : R;
    try {
      const it = jt(we);
      for (; P = it.nextNode(); )
        Nn(P, we), mr(P, we), qt(P.content) && rt(P.content);
    } catch (it) {
      throw ue && (rn(Q), zn(t.removed, (St) => {
        St.element && xe(St.element);
      })), it;
    }
    if (ue) {
      let it = !1;
      if (zn(t.removed, (St) => {
        St.element && (St.element === Q && (it = !0), xe(St.element));
      }), it) throw yn("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ae && Rt(Q), Q;
    }
    if (ln) {
      if (Ae && Rt(R), Gn)
        for (q = le.call(R.ownerDocument); R.firstChild; ) q.appendChild(R.firstChild);
      else q = R;
      return (O.shadowroot || O.shadowrootmode) && (q = fe.call(r, q, !0)), q;
    }
    let Me = Ue ? R.outerHTML : R.innerHTML;
    return Ue && L["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && wt(Bh, R.ownerDocument.doctype.name) && (Me = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + Me), Ae && (Me = Et(Me)), K && Vn ? j(Me) : Me;
  }, t.setConfig = function() {
    let Q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    dr(Q), Ft = !0, Ln = L, Hn = O;
  }, t.clearConfig = function() {
    un = null, Ft = !1, Ln = null, Hn = null, K = he, se = "";
  }, t.isValidAttribute = function(Q, x, R) {
    un || dr({});
    const Z = tt(Q), P = tt(x);
    return pr(Z, P, R);
  }, t.addHook = function(Q, x) {
    typeof x == "function" && Tt(ve, Q) && wr(ve[Q], x);
  }, t.removeHook = function(Q, x) {
    if (Tt(ve, Q)) {
      if (x !== void 0) {
        const R = xh(ve[Q], x);
        return R === -1 ? void 0 : Sh(ve[Q], R, 1)[0];
      }
      return Zs(ve[Q]);
    }
  }, t.removeHooks = function(Q) {
    Tt(ve, Q) && (ve[Q] = []);
  }, t.removeAllHooks = function() {
    ve = so();
  }, t;
}
var da = _l(), Zh = /* @__PURE__ */ Fi({
  _sendToRenderer: () => wl,
  _slugifyLocal: () => Ia,
  _splitIntoSections: () => kl,
  addMarkdownExtension: () => Pa,
  detectFenceLanguages: () => Wi,
  detectFenceLanguagesAsync: () => Oa,
  initRendererWorker: () => Zi,
  markdownPlugins: () => Tn,
  parseMarkdownToHtml: () => ir,
  setMarkdownExtensions: () => Jh,
  slugify: () => ke,
  streamParseMarkdown: () => Na,
  teardownRendererWorkerPool: () => Kh
}), Xh = Eo(), Yh = {
  intervalMs: 500,
  targetMs: 75,
  hysteresis: 0.25,
  cooldownMs: 500,
  stepUp: 1,
  stepDown: 1
}, Nr = null;
function Qh() {
  const e = {
    size: Xh,
    minSize: 2,
    autoScale: Yh,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    typeof import.meta < "u" && (e.debugLevel = 0);
  } catch {
  }
  try {
    return new Ga(fh, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("renderer worker unavailable");
      }
    };
  }
}
function bl() {
  return Nr || (Nr = Qh()), Nr;
}
function Kh() {
  const e = Nr;
  if (Nr = null, !!e)
    try {
      typeof e.drain == "function" && e.drain().catch(() => {
      }), typeof e.terminate == "function" && e.terminate(), typeof e.dispose == "function" && e.dispose();
    } catch (t) {
      S("[markdown] teardownRendererWorkerPool failed", t);
    }
}
var Zi = () => bl().workers?.[0]?.worker?._underlying ?? null, wl = (e, t = 3e3) => Zi?.() ? bl().postMessage(e, void 0, {
  awaitResponse: !0,
  timeout: t
}).then((n) => {
  if (n?.error) throw new Error(n.error);
  return n;
}).catch((n) => {
  throw (n?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : n;
}) : Promise.reject(/* @__PURE__ */ new Error("renderer worker unavailable")), Tn = [];
function Pa(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    Tn.push(e);
    try {
      Oe.use(e);
    } catch (t) {
      S("[markdown] failed to apply plugin", t);
    }
  }
}
function Jh(e) {
  Tn.length = 0, Array.isArray(e) && Tn.push(...e.filter((t) => t && typeof t == "object"));
  try {
    Tn.forEach((t) => Oe.use(t));
  } catch (t) {
    S("[markdown] failed to apply markdown extensions", t);
  }
}
function Ia(e) {
  return ke(e);
}
function kl(e, t) {
  const n = String(e ?? "");
  if (!n || n.length <= t) return [n];
  const r = /^#{1,6}\s.*$/gm, i = [];
  let a;
  for (; (a = r.exec(n)) !== null; ) i.push(a.index);
  if (!i.length || i.length < 2) {
    const c = [];
    for (let u = 0; u < n.length; u += t) c.push(n.slice(u, u + t));
    return c;
  }
  const o = [];
  i[0] > 0 && o.push(n.slice(0, i[0]));
  for (let c = 0; c < i.length; c++) {
    const u = i[c], d = c + 1 < i.length ? i[c + 1] : n.length;
    o.push(n.slice(u, d));
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
async function Na(e, t, n = {}) {
  const r = n?.chunkSize ? Number(n.chunkSize) : 65536, i = typeof t == "function" ? t : () => {
  }, { content: a, data: o } = tr(String(e ?? ""));
  let s = a;
  try {
    s = String(s ?? "").replace(/:([^:\s]+):/g, (d, f) => Er[f] || d);
  } catch {
  }
  Zi?.();
  const l = kl(s, r), c = at(), u = /* @__PURE__ */ new Map();
  for (let d = 0; d < l.length; d++) {
    const f = l[d], p = await ir(f);
    let m = String(p?.html || ""), g = [];
    if (c) try {
      const h = c.parseFromString(m, "text/html");
      h.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((w) => {
        try {
          const b = Number(w.tagName.substring(1)), k = (w.textContent || "").trim(), E = Ia(k), z = (u.get(E) || 0) + 1;
          u.set(E, z);
          const W = z === 1 ? E : E + "-" + z;
          w.id = W, g.push({
            level: b,
            text: k,
            id: W
          });
        } catch {
        }
      });
      try {
        typeof XMLSerializer < "u" ? m = new XMLSerializer().serializeToString(h.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : m = Array.from(h.body.childNodes || []).map((w) => typeof w?.outerHTML == "string" ? w.outerHTML : typeof w?.textContent == "string" ? w.textContent : "").join("");
      } catch {
      }
    } catch {
    }
    else try {
      const h = [];
      m = m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (w, b, k, E) => {
        const z = Number(b), W = E.replace(/<[^>]+>/g, "").trim(), F = Ia(W), K = (u.get(F) || 0) + 1;
        u.set(F, K);
        const se = K === 1 ? F : F + "-" + K;
        return h.push({
          level: z,
          text: W,
          id: se
        }), `<h${z} ${(k || "").replace(/\s*(id|class)="[^"]*"/g, "")} id="${se}">${E}</h${z}>`;
      }), g = h;
    } catch {
    }
    const _ = {
      index: d,
      isLast: d === l.length - 1,
      meta: d === 0 ? o || {} : {},
      toc: g
    };
    try {
      i(m, _);
    } catch {
    }
  }
}
async function ir(e) {
  if (Tn?.length) {
    let { content: r, data: i } = tr(e || "");
    try {
      r = String(r ?? "").replace(/:([^:\s]+):/g, (o, s) => Er[s] || o);
    } catch {
    }
    Oe.setOptions({ gfm: !0 });
    try {
      Tn.forEach((o) => Oe.use(o));
    } catch (o) {
      S("[markdown] apply plugins failed", o);
    }
    const a = da.sanitize(Oe.parse(r));
    try {
      const o = at();
      if (o) {
        const s = o.parseFromString(a, "text/html"), l = s.querySelectorAll("h1,h2,h3,h4,h5,h6"), c = [], u = /* @__PURE__ */ new Set(), d = (f) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, m = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[f] + " " + m).trim();
        };
        l.forEach((f) => {
          try {
            const p = Number(f.tagName.substring(1)), m = (f.textContent || "").trim();
            let g = ke(m) || "heading", _ = g, h = 2;
            for (; u.has(_); )
              _ = g + "-" + h, h += 1;
            u.add(_), f.id = _, f.className = d(p), c.push({
              level: p,
              text: m,
              id: _
            });
          } catch {
          }
        });
        try {
          (typeof s?.getElementsByTagName == "function" ? Array.from(s.getElementsByTagName("img")) : typeof s?.querySelectorAll == "function" ? Array.from(s.querySelectorAll("img")) : []).forEach((f) => {
            try {
              const p = f.getAttribute?.("loading"), m = f.getAttribute?.("data-want-lazy");
              !p && !m && f.setAttribute?.("loading", "lazy");
              try {
                const g = f.getAttribute?.("alt");
                if (!g || !String(g).trim()) {
                  const _ = f.getAttribute?.("src") || "";
                  if (_) {
                    const h = String(_).split("/").pop().replace(/\.[^.]+$/, "");
                    h && f.setAttribute("alt", h.replace(/[-_]+/g, " "));
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
          s.querySelectorAll("pre code, code[class]").forEach((f) => {
            try {
              const p = f.getAttribute?.("class") || f.className || "", m = String(p ?? "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (m) try {
                f.setAttribute?.("class", m);
              } catch {
                f.className = m;
              }
              else try {
                f.removeAttribute?.("class");
              } catch {
                f.className = "";
              }
            } catch {
            }
          });
        } catch {
        }
        try {
          let f = null;
          try {
            typeof XMLSerializer < "u" ? f = new XMLSerializer().serializeToString(s.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : f = Array.from(s.body.childNodes || []).map((p) => typeof p?.outerHTML == "string" ? p.outerHTML : typeof p?.textContent == "string" ? p.textContent : "").join("");
          } catch {
            try {
              f = s.body.innerHTML;
            } catch {
              f = "";
            }
          }
          return {
            html: f,
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
    if (Ye?.getLanguage?.("plaintext") && /```\s*\n/.test(String(e ?? ""))) {
      let { content: r, data: i } = tr(e || "");
      try {
        r = String(r ?? "").replace(/:([^:\s]+):/g, (l, c) => Er[c] || l);
      } catch {
      }
      Oe.setOptions({
        gfm: !0,
        highlighted: (l, c) => {
          try {
            return c && Ye?.getLanguage?.(c) ? Ye.highlight(l, { language: c }).value : Ye?.getLanguage?.("plaintext") ? Ye.highlight(l, { language: "plaintext" }).value : l;
          } catch {
            return l;
          }
        }
      });
      let a = da.sanitize(Oe.parse(r));
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (l, c) => {
          try {
            if (c && typeof Ye?.highlight == "function") try {
              const u = Ye.highlight(c, { language: "plaintext" });
              return `<pre><code>${u?.value ? u.value : u}</code></pre>`;
            } catch {
              try {
                if (typeof Ye?.highlightElement == "function") {
                  const d = { innerHTML: c };
                  return Ye.highlightElement(d), `<pre><code>${d.innerHTML}</code></pre>`;
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
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, u, d) => {
        const f = Number(c), p = d.replace(/<[^>]+>/g, "").trim();
        let m = ke(p) || "heading", g = m, _ = 2;
        for (; s.has(g); )
          g = m + "-" + _, _ += 1;
        s.add(g), o.push({
          level: f,
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
        }, w = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", b = (h[f] + " " + w).trim();
        return `<h${f} ${((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${g}" class="${b}"`).trim()}>${d}</h${f}>`;
      }), a = a.replace(/<img([^>]*)>/g, (l, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), {
        html: a,
        meta: i || {},
        toc: o
      };
    }
  } catch {
  }
  if (!t) try {
    let { content: r, data: i } = tr(e || "");
    try {
      r = String(r ?? "").replace(/:([^:\s]+):/g, (a, o) => Er[o] || a);
    } catch {
    }
    return Oe.setOptions({
      gfm: !0,
      highlighted: (a, o) => {
        try {
          return o && Ye?.getLanguage?.(o) ? Ye.highlight(a, { language: o }).value : Ye?.getLanguage?.("plaintext") ? Ye.highlight(a, { language: "plaintext" }).value : a;
        } catch {
          return a;
        }
      }
    }), {
      html: da.sanitize(Oe.parse(r)),
      meta: i || {}
    };
  } catch {
    throw new Error("renderer worker required but unavailable");
  }
  const n = await wl({
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
    o = o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (s, l, c, u) => {
      const d = Number(l), f = u.replace(/<[^>]+>/g, "").trim(), p = (c || "").match(/\sid="([^"]+)"/), m = p ? p[1] : ke(f) || "heading", g = (r.get(m) || 0) + 1;
      r.set(m, g);
      const _ = g === 1 ? m : m + "-" + g;
      i.push({
        level: d,
        text: f,
        id: _
      });
      const h = a(d);
      return `<h${d} ${((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${_}" class="${h}"`).trim()}>${u}</h${d}>`;
    });
    try {
      const s = typeof document < "u" && document.documentElement?.getAttribute?.("data-nimbi-logo-moved") || "";
      if (s) {
        const l = at();
        if (l) {
          const c = l.parseFromString(o, "text/html");
          (typeof c?.getElementsByTagName == "function" ? Array.from(c.getElementsByTagName("img")) : typeof c?.querySelectorAll == "function" ? Array.from(c.querySelectorAll("img")) : []).forEach((u) => {
            try {
              const d = u?.getAttribute?.("src") || "";
              (d ? new URL(d, location.href).toString() : "") === s && u.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? o = new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : o = Array.from(c.body.childNodes || []).map((u) => typeof u?.outerHTML == "string" ? u.outerHTML : typeof u?.textContent == "string" ? u.textContent : "").join("");
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
    if (vo.has(s) || t?.size && s.length < 3 && !t.has(s) && !t.has(Jt?.[s])) continue;
    if (t?.size) {
      if (t.has(s)) {
        const l = t.get(s);
        l && n.add(l);
        continue;
      }
      if (Jt?.[s]) {
        const l = Jt[s];
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
async function Oa(e, t) {
  return Tn?.length, Wi(e || "", t);
}
function ef(e, t = 150, n = {}) {
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
function tf(e) {
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
function nf() {
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
var Ti = nf(), xl = `let M = typeof DOMParser < "u" ? new DOMParser() : null;
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
`, oo = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", xl], { type: "text/javascript;charset=utf-8" });
function rf(e) {
  let t;
  try {
    if (t = oo && (self.URL || self.webkitURL).createObjectURL(oo), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(xl), {
      type: "module",
      name: e?.name
    });
  }
}
function Ot(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Ss(e, t);
  } catch {
    return Ss(e, t);
  }
}
async function za(e, t, n = 4, r) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new Po(Math.max(1, Number(n) || 1));
  return Promise.all(e.map((a, o) => i.run(() => t(a, o), { signal: r })));
}
function af(...e) {
  try {
    S(...e);
  } catch {
  }
}
function qr(e) {
  try {
    if (wo(3)) return !0;
  } catch {
  }
  try {
    if (typeof Se == "string" && Se) return !0;
  } catch {
  }
  try {
    if (te?.size) return !0;
  } catch {
  }
  try {
    if (Qe?.size) return !0;
  } catch {
  }
  return !1;
}
function sf(e, t) {
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
    if (te?.has?.(t)) {
      const n = te.get(t);
      if (typeof n == "string") return n;
      if (n && typeof n == "object") return n.default || t;
    }
  } catch {
  }
  return e;
}
function Sl(e, t = 2) {
  try {
    const n = String(e ?? "").split("/").filter(Boolean);
    return n.length ? n.slice(-Math.max(1, Math.min(t, n.length))).join("/") : "";
  } catch {
    return String(e ?? "");
  }
}
function vl() {
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
function pa(e) {
  if (!e) return null;
  try {
    if (be?.has?.(e)) return be.get(e);
  } catch {
  }
  const t = String(e ?? "").replace(/^.*\//, "");
  try {
    if (t && be?.has?.(t)) return be.get(t);
  } catch {
  }
  const n = vl();
  try {
    if (n?.has?.(e)) return n.get(e);
    if (t && n?.has?.(t)) return n.get(t);
  } catch {
  }
  const r = Sl(e, 2);
  try {
    for (const [i, a] of te || []) {
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
function of(e, t) {
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
          l.setAttribute("href", qe(c));
        } catch {
          c?.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", Ot(c));
        }
      } catch {
        l.setAttribute("href", "#" + o.path);
      }
      if (l.textContent = o.name, s.appendChild(l), o.children?.length) {
        const c = document.createElement("ul");
        o.children.forEach((u) => {
          const d = document.createElement("li"), f = document.createElement("a");
          try {
            const p = String(u.path ?? "");
            try {
              f.setAttribute("href", qe(p));
            } catch {
              p?.indexOf("/") === -1 ? f.setAttribute("href", "#" + encodeURIComponent(p)) : f.setAttribute("href", Ot(p));
            }
          } catch {
            f.setAttribute("href", "#" + u.path);
          }
          f.textContent = u.name, d.appendChild(f), c.appendChild(d);
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
            l.setAttribute("href", qe(c));
          } catch {
            c?.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", Ot(c));
          }
        } catch {
          l.setAttribute("href", "#" + o.path);
        }
        if (l.textContent = o.name, s.appendChild(l), o.children?.length) {
          const c = document.createElement("ul");
          o.children.forEach((u) => {
            const d = document.createElement("li"), f = document.createElement("a");
            try {
              const p = String(u.path ?? "");
              try {
                f.setAttribute("href", qe(p));
              } catch {
                p?.indexOf("/") === -1 ? f.setAttribute("href", "#" + encodeURIComponent(p)) : f.setAttribute("href", Ot(p));
              }
            } catch {
              f.setAttribute("href", "#" + u.path);
            }
            f.textContent = u.name, d.appendChild(f), c.appendChild(d);
          }), s.appendChild(c);
        }
        i.appendChild(s);
      } catch (s) {
        S("[htmlBuilder] createNavTree item failed", s);
      }
    });
  }
  return n.appendChild(i), n;
}
function lf(e, t, n = "") {
  const r = document.createElement("aside");
  r.className = "menu box nimbi-toc-inner is-hidden-mobile", r.setAttribute("role", "navigation");
  try {
    r.setAttribute("aria-label", e("onThisPage"));
  } catch {
  }
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("onThisPage"), r.appendChild(i);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const o = {};
    (t || []).forEach((s) => {
      try {
        if (!s || s.level === 1) return;
        const l = Number(s.level) >= 2 ? Number(s.level) : 2, c = document.createElement("li"), u = document.createElement("a"), d = lc(s.text || ""), f = s.id || ke(d);
        u.textContent = d;
        try {
          const _ = String(n ?? "").replace(/^[\.\/]+/, ""), h = _ && be?.has?.(_) ? be.get(_) : _;
          h ? u.href = qe(h, f) : u.href = `#${encodeURIComponent(f)}`;
        } catch (_) {
          S("[htmlBuilder] buildTocElement href normalization failed", _), u.href = `#${encodeURIComponent(f)}`;
        }
        if (c.appendChild(u), l === 2) {
          a.appendChild(c), o[2] = c, Object.keys(o).forEach((_) => {
            Number(_) > 2 && delete o[_];
          });
          return;
        }
        let p = l - 1;
        for (; p > 2 && !o[p]; ) p--;
        p < 2 && (p = 2);
        let m = o[p];
        if (!m) {
          a.appendChild(c), o[l] = c;
          return;
        }
        let g = m.querySelector("ul");
        g || (g = document.createElement("ul"), m.appendChild(g)), g.appendChild(c), o[l] = c;
      } catch (l) {
        S("[htmlBuilder] buildTocElement item failed", l, s);
      }
    });
  } catch (o) {
    S("[htmlBuilder] buildTocElement failed", o);
  }
  return r.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : r;
}
function Al(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((t) => {
    t.id || (t.id = ke(t.textContent || ""));
  });
}
function cf(e, t, n) {
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
              S("[htmlBuilder] set image loading attribute failed", s);
            }
          } catch (s) {
            S("[htmlBuilder] resolve image src failed", s);
          }
      });
    }
  } catch (r) {
    S("[htmlBuilder] lazyLoadImages failed", r);
  }
}
function lo(e, t, n) {
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
      const l = s.tagName ? s.tagName.toLowerCase() : "", c = (u) => {
        try {
          const d = s.getAttribute(u) || "";
          if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/") || d.startsWith("#")) return;
          try {
            s.setAttribute(u, new URL(d, i).toString());
          } catch (f) {
            S("[htmlBuilder] rewrite asset attribute failed", u, d, f);
          }
        } catch (d) {
          S("[htmlBuilder] rewriteAttr failed", d);
        }
      };
      if (s.hasAttribute?.("src") && c("src"), s.hasAttribute?.("href") && l !== "a" && c("href"), s.hasAttribute?.("xlink:href") && c("xlink:href"), s.hasAttribute?.("poster") && c("poster"), s.hasAttribute?.("srcset")) {
        const u = (s.getAttribute("srcset") || "").split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
          const [f, p] = d.split(/\s+/, 2);
          if (!f || /^(https?:)?\/\//i.test(f) || f.startsWith("/")) return d;
          try {
            const m = new URL(f, i).toString();
            return p ? `${m} ${p}` : m;
          } catch {
            return d;
          }
        }).join(", ");
        s.setAttribute("srcset", u);
      }
    } catch (l) {
      S("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
    }
  } catch (r) {
    S("[htmlBuilder] rewriteRelativeAssets failed", r);
  }
}
var co = "", ga = null, uo = "";
async function El(e, t, n, r = {}) {
  try {
    n = Hr(n), r = r || {}, r.canonical = r.canonical !== !1;
    const i = e.querySelectorAll?.("a") || [];
    if (!i.length) return;
    let a, o;
    if (t === co && ga)
      a = ga, o = uo;
    else {
      try {
        a = new URL(t, location.href), o = jn(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), o = jn(a.pathname);
        } catch {
          a = null, o = "/";
        }
      }
      co = t, ga = a, uo = o;
    }
    const s = /* @__PURE__ */ new Set(), l = [], c = /* @__PURE__ */ new Set(), u = [];
    for (const d of Array.from(i)) try {
      try {
        if (d?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
      } catch {
      }
      const f = d.getAttribute?.("href") || "";
      if (!f) continue;
      if (Li(f)) {
        try {
          d.setAttribute("rel", "noopener noreferrer nofollow");
        } catch {
        }
        continue;
      }
      try {
        if (f.startsWith("?") || f.indexOf("?") !== -1) try {
          const m = new URL(f, t || location.href), g = m.searchParams.get("page");
          if (g && g.indexOf("/") === -1 && n) {
            const _ = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
            if (_) {
              const h = re(_ + g), w = r?.canonical ? qe(h, m.hash ? m.hash.replace(/^#/, "") : null) : Ot(h, m.hash ? m.hash.replace(/^#/, "") : null);
              d.setAttribute("href", w);
              continue;
            }
          }
        } catch {
        }
      } catch {
      }
      if (f.startsWith("/") && !f.endsWith(".md")) continue;
      const p = f.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (p) {
        let m = p[1];
        const g = p[2];
        !m.startsWith("/") && n && (m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + m);
        try {
          const _ = new URL(m, t).pathname;
          let h = _.startsWith(o) ? _.slice(o.length) : _;
          h = Gr(h, o), h = re(h), l.push({
            node: d,
            mdPathRaw: m,
            frag: g,
            rel: h
          }), be?.has?.(h) || s.add(h);
        } catch (_) {
          S("[htmlBuilder] resolve mdPath failed", _);
        }
        continue;
      }
      try {
        let m = f;
        !f.startsWith("/") && n && (f.startsWith("#") ? m = n + f : m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + f);
        const g = new URL(m, t).pathname || "";
        if (g && g.indexOf(o) !== -1) {
          let _ = g.startsWith(o) ? g.slice(o.length) : g;
          if (_ = Gr(_, o), _ = re(_), _ = Wn(_), _ || (_ = Kt), !_.endsWith(".md")) {
            const h = pa(_);
            if (h) {
              const w = r?.canonical ? qe(h, null) : Ot(h);
              d.setAttribute("href", w);
            } else {
              let w = _;
              try {
                /\.[^\/]+$/.test(String(_ ?? "")) || (w = String(_ ?? "") + ".html");
              } catch {
                w = _;
              }
              c.add(w), u.push({
                node: d,
                rel: w
              });
            }
          }
        }
      } catch (m) {
        S("[htmlBuilder] resolving href to URL failed", m);
      }
    } catch (f) {
      S("[htmlBuilder] processing anchor failed", f);
    }
    if (s.size)
      if (!qr(t) || r?.allowProbe === !1) {
        try {
          S("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(s)) try {
          const f = String(d).match(/([^\/]+)\.md$/), p = f && f[1];
          if (p) {
            const m = ke(p);
            if (m) try {
              ft(m, d);
            } catch (g) {
              S("[htmlBuilder] setting fallback slug mapping failed", g);
            }
          }
        } catch {
        }
      } else await za(Array.from(s), async (d) => {
        try {
          try {
            const p = String(d).match(/([^\/]+)\.md$/), m = p && p[1];
            if (m && te.has(m)) {
              try {
                const g = te.get(m);
                if (g) try {
                  const _ = typeof g == "string" ? g : g?.default ? g.default : null;
                  _ && ft(m, _);
                } catch (_) {
                  S("[htmlBuilder] _storeSlugMapping failed", _);
                }
              } catch (g) {
                S("[htmlBuilder] reading slugToMd failed", g);
              }
              return;
            }
          } catch (p) {
            S("[htmlBuilder] basename slug lookup failed", p);
          }
          const f = await Ke(d, t);
          if (f?.raw) {
            const p = (f.raw || "").match(/^#\s+(.+)$/m);
            if (p && p[1]) {
              const m = ke(p[1].trim());
              if (m) try {
                ft(m, d);
              } catch (g) {
                S("[htmlBuilder] setting slug mapping failed", g);
              }
            }
          }
        } catch (f) {
          S("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", f);
        }
      }, 6);
    if (c.size)
      if (!qr(t) || r?.allowProbe === !1) {
        try {
          S("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(c)) try {
          const f = String(d).match(/([^\/]+)\.html$/), p = f && f[1];
          if (p) {
            const m = ke(p);
            if (m) try {
              ft(m, d);
            } catch (g) {
              S("[htmlBuilder] setting fallback html slug mapping failed", g);
            }
          }
        } catch {
        }
      } else await za(Array.from(c), async (d) => {
        try {
          const f = await Ke(d, t);
          if (f && f.raw) try {
            const p = at(), m = p ? p.parseFromString(f.raw, "text/html") : null, g = m ? m.querySelector("title") : null, _ = m ? m.querySelector("h1") : null, h = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : _ && _.textContent ? _.textContent.trim() : null;
            if (h) {
              const w = ke(h);
              if (w) try {
                ft(w, d);
              } catch (b) {
                S("[htmlBuilder] setting html slug mapping failed", b);
              }
            }
          } catch (p) {
            S("[htmlBuilder] parse fetched HTML failed", p);
          }
        } catch (f) {
          S("[htmlBuilder] fetchMarkdown for htmlPending failed", f);
        }
      }, 5);
    for (const d of l) {
      const { node: f, frag: p, rel: m } = d;
      let g = pa(m);
      if (g) {
        const _ = r?.canonical ? qe(g, p) : Ot(g, p);
        f.setAttribute("href", _);
      } else {
        const _ = r?.canonical ? qe(m, p) : Ot(m, p);
        f.setAttribute("href", _);
      }
    }
    for (const d of u) {
      const { node: f, rel: p } = d;
      let m = pa(p);
      if (!m) try {
        const g = String(p ?? "").replace(/^.*\//, "");
        be?.has?.(g) && (m = be?.get?.(g));
      } catch (g) {
        S("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
      }
      if (m) {
        const g = r?.canonical ? qe(m, null) : Ot(m);
        f.setAttribute("href", g);
      } else {
        const g = r?.canonical ? qe(p, null) : Ot(p);
        f.setAttribute("href", g);
      }
    }
  } catch (i) {
    S("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function uf(e, t, n, r) {
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
    !s && n && (s = String(n)), s && (o = ke(s)), o || (o = Kt);
    try {
      if (n) {
        try {
          ft(o, n);
        } catch (l) {
          S("[htmlBuilder] computeSlug set slug mapping failed", l);
        }
        try {
          const l = re(String(n ?? ""));
          if (be?.has?.(l)) o = be.get(l);
          else try {
            for (const [c, u] of te || []) try {
              const d = typeof u == "string" ? u : u?.default ? u.default : null;
              if (d && re(String(d)) === l) {
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
      S("[htmlBuilder] computeSlug set slug mapping failed", l);
    }
    try {
      let l = r || "";
      if (!l) try {
        const c = yt(typeof location < "u" ? location.href : "");
        c?.anchor && c?.page && String(c.page) === String(o) ? l = c.anchor : l = "";
      } catch {
        l = "";
      }
      try {
        history.replaceState({ page: o }, "", Ot(o, l));
      } catch (c) {
        S("[htmlBuilder] computeSlug history replace failed", c);
      }
    } catch (l) {
      S("[htmlBuilder] computeSlug inner failed", l);
    }
  } catch (s) {
    S("[htmlBuilder] computeSlug failed", s);
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
async function hf(e, t, n = {}) {
  if (!e || !e.length) return;
  const r = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || [])) try {
    const s = o.getAttribute("href") || "";
    if (!s) continue;
    let l = re(s).split(/::|#/, 2)[0];
    try {
      const u = l.indexOf("?");
      u !== -1 && (l = l.slice(0, u));
    } catch {
    }
    if (!l || (l.includes(".") || (l = l + ".html"), !/\.html(?:$|[?#])/.test(l) && !l.toLowerCase().endsWith(".html"))) continue;
    const c = l;
    try {
      if (be?.has?.(c)) continue;
    } catch (u) {
      S("[htmlBuilder] mdToSlug check failed", u);
    }
    try {
      let u = !1;
      for (const d of te.values()) if (d === c) {
        u = !0;
        break;
      }
      if (u) continue;
    } catch (u) {
      S("[htmlBuilder] slugToMd iteration failed", u);
    }
    r.add(c);
  } catch (s) {
    S("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", s);
  }
  if (!r.size) return;
  if (!qr(t) || n?.allowProbe === !1) {
    try {
      S("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(r)) try {
      const s = String(o).match(/([^\/]+)\.html$/), l = s && s[1];
      if (l) {
        const c = ke(l);
        if (c) try {
          ft(c, o);
        } catch (u) {
          S("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", u);
        }
      }
    } catch {
    }
    return;
  }
  const i = async (o) => {
    try {
      const s = await Ke(o, t);
      if (s && s.raw) try {
        const l = at().parseFromString(s.raw, "text/html"), c = l.querySelector("title"), u = l.querySelector("h1"), d = c?.textContent && c.textContent.trim() ? c.textContent.trim() : u?.textContent ? u.textContent.trim() : null;
        if (d) {
          const f = ke(d);
          if (f) try {
            ft(f, o);
          } catch (p) {
            S("[htmlBuilder] set slugToMd/mdToSlug failed", p);
          }
        }
      } catch (l) {
        S("[htmlBuilder] parse HTML title failed", l);
      }
    } catch (s) {
      S("[htmlBuilder] fetchAndExtract failed", s);
    }
  }, a = Array.from(r);
  await za(a, i, Math.max(1, Math.min(Ir(), a.length || 1)));
}
async function ff(e, t, n = {}) {
  if (!e || !e.length) return;
  const r = [], i = /* @__PURE__ */ new Set();
  let a = "";
  try {
    const o = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    a = jn(o.pathname);
  } catch (o) {
    a = "", S("[htmlBuilder] preMapMdSlugs parse base failed", o);
  }
  for (const o of Array.from(e || [])) try {
    const s = o.getAttribute("href") || "";
    if (!s) continue;
    const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
    if (l) {
      let c = re(l[1]);
      try {
        let u;
        try {
          u = sf(c, t);
        } catch (f) {
          u = c, S("[htmlBuilder] resolve mdPath URL failed", f);
        }
        let d = u && a && u.startsWith(a) ? u.slice(a.length) : String(u ?? "").replace(/^\//, "");
        d = Gr(d, a), r.push({ rel: d }), be?.has?.(d) || i.add(d);
      } catch (u) {
        S("[htmlBuilder] rewriteAnchors failed", u);
      }
      continue;
    }
  } catch (s) {
    S("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
  }
  if (i.size) {
    if (!qr(t) || n?.allowProbe === !1) {
      try {
        S("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
      for (const o of Array.from(i)) try {
        const s = String(o).match(/([^\/]+)\.md$/), l = s && s[1];
        if (l) {
          const c = ke(l);
          if (c) try {
            ft(c, o);
          } catch (u) {
            S("[htmlBuilder] setting fallback preMapMdSlugs mapping failed", u);
          }
        }
      } catch {
      }
      return;
    }
    await Promise.all(Array.from(i).map(async (o) => {
      try {
        const s = String(o).match(/([^\/]+)\.md$/), l = s && s[1];
        if (l && te.has(l)) {
          try {
            const c = te.get(l);
            if (c) try {
              const u = typeof c == "string" ? c : c?.default ? c.default : null;
              u && ft(l, u);
            } catch (u) {
              S("[htmlBuilder] _storeSlugMapping failed", u);
            }
          } catch (c) {
            S("[htmlBuilder] preMapMdSlugs slug map access failed", c);
          }
          return;
        }
      } catch (s) {
        S("[htmlBuilder] preMapMdSlugs basename check failed", s);
      }
      try {
        const s = await Ke(o, t);
        if (s && s.raw) {
          const l = (s.raw || "").match(/^#\s+(.+)$/m);
          if (l && l[1]) {
            const c = ke(l[1].trim());
            if (c) try {
              ft(c, o);
            } catch (u) {
              S("[htmlBuilder] preMapMdSlugs setting slug mapping failed", u);
            }
          }
        }
      } catch (s) {
        S("[htmlBuilder] preMapMdSlugs fetch failed", s);
      }
    }));
  }
}
function ma(e) {
  try {
    const t = at().parseFromString(e || "", "text/html");
    Al(t);
    try {
      t.querySelectorAll("img").forEach((i) => {
        try {
          i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
        } catch (a) {
          S("[htmlBuilder] parseHtml set image loading attribute failed", a);
        }
      });
    } catch (i) {
      S("[htmlBuilder] parseHtml query images failed", i);
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
                S("[htmlBuilder] registerLanguage failed", c);
              }
            })();
          } catch (c) {
            S("[htmlBuilder] schedule registerLanguage failed", c);
          }
        } else try {
          if (Ye && typeof Ye.getLanguage == "function" && Ye.getLanguage("plaintext")) {
            const s = Ye.highlight ? Ye.highlight(i.textContent || "", { language: "plaintext" }) : null;
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
          S("[htmlBuilder] plaintext highlight fallback failed", s);
        }
      } catch (a) {
        S("[htmlBuilder] code element processing failed", a);
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
    return S("[htmlBuilder] parseHtml failed", t), {
      html: e || "",
      meta: {},
      toc: []
    };
  }
}
async function Tl(e) {
  const t = Oa ? await Oa(e || "", ze) : Wi(e || "", ze), n = new Set(t), r = [];
  for (const i of n) try {
    const a = ze.size && (ze.get(i) || ze.get(String(i).toLowerCase())) || i;
    try {
      r.push(Wr(a));
    } catch (o) {
      S("[htmlBuilder] ensureLanguages push canonical failed", o);
    }
    if (String(i) !== String(a)) try {
      r.push(Wr(i));
    } catch (o) {
      S("[htmlBuilder] ensureLanguages push alias failed", o);
    }
  } catch (a) {
    S("[htmlBuilder] ensureLanguages inner failed", a);
  }
  try {
    await Promise.all(r);
  } catch (i) {
    S("[htmlBuilder] ensureLanguages failed", i);
  }
}
async function df(e) {
  if (await Tl(e), ir) {
    const t = await ir(e || "");
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
async function pf(e, t, n, r, i) {
  let a = null, o = null;
  if (t.isHtml) try {
    const f = at();
    if (f) {
      const p = f.parseFromString(t.raw || "", "text/html");
      try {
        lo(p.body, n, i);
      } catch (m) {
        S("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", m);
      }
      a = ma(p.documentElement?.outerHTML ? p.documentElement.outerHTML : t?.raw || "");
    } else a = ma(t.raw || "");
  } catch {
    a = ma(t.raw || "");
  }
  else {
    const f = t.raw || "", p = 65536;
    if (f && f.length > p && Na) {
      try {
        await Tl(f);
      } catch {
      }
      o = document.createElement("article"), o.id = "main", o.className = "nimbi-article content", o.setAttribute("itemscope", ""), o.setAttribute("itemtype", "https://schema.org/Article");
      const m = [];
      let g = {};
      try {
        await Na(f, (_, h) => {
          try {
            h && h.meta && (g = Object.assign(g, h.meta));
          } catch {
          }
          try {
            h && Array.isArray(h.toc) && h.toc.length && m.push(...h.toc);
          } catch {
          }
          try {
            Ti(() => {
              try {
                const w = at();
                if (w) {
                  const b = w.parseFromString(String(_ ?? ""), "text/html"), k = Array.from(b.body.childNodes || []);
                  k.length ? o.append(...k) : o.insertAdjacentHTML("beforeend", _ || "");
                } else {
                  const b = document && typeof document.createRange == "function" ? document.createRange() : null;
                  if (b && typeof b.createContextualFragment == "function") {
                    const k = b.createContextualFragment(String(_ ?? ""));
                    o.append(...Array.from(k.childNodes));
                  } else o.insertAdjacentHTML("beforeend", _ || "");
                }
              } catch {
                try {
                  o.insertAdjacentHTML("beforeend", _ || "");
                } catch {
                }
              }
            });
          } catch {
          }
        }, { chunkSize: p });
      } catch (_) {
        S("[htmlBuilder] streamParseMarkdown failed, falling back", _);
      }
      a = {
        html: o.innerHTML,
        meta: g || {},
        toc: m
      };
    } else a = await df(t.raw || "");
  }
  let s;
  if (o) s = o;
  else {
    s = document.createElement("article"), s.id = "main", s.className = "nimbi-article content", s.setAttribute("itemscope", ""), s.setAttribute("itemtype", "https://schema.org/Article");
    try {
      const f = at && at();
      if (f) {
        const p = f.parseFromString(String(a.html ?? ""), "text/html"), m = Array.from(p.body.childNodes || []);
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
        S("[htmlBuilder] set article html failed", p);
      }
    }
  }
  try {
    lo(s, n, i);
  } catch (f) {
    S("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", f);
  }
  try {
    Al(s);
  } catch (f) {
    S("[htmlBuilder] addHeadingIds failed", f);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((f) => {
      try {
        const p = f.getAttribute?.("class") || f.className || "", m = String(p ?? "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (m) try {
          f.setAttribute?.("class", m);
        } catch (g) {
          f.className = m, S("[htmlBuilder] set element class failed", g);
        }
        else try {
          f.removeAttribute?.("class");
        } catch (g) {
          f.className = "", S("[htmlBuilder] remove element class failed", g);
        }
      } catch (p) {
        S("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (f) {
    S("[htmlBuilder] processing code elements failed", f);
  }
  cf(s, n, i);
  try {
    (s.querySelectorAll?.("img") || []).forEach((f) => {
      try {
        const p = f.parentElement;
        if (!p || p.tagName.toLowerCase() !== "p" || p.childNodes.length !== 1) return;
        const m = document.createElement("figure");
        m.className = "image", p.replaceWith(m), m.appendChild(f);
      } catch {
      }
    });
  } catch (f) {
    S("[htmlBuilder] wrap images in Bulma image helper failed", f);
  }
  try {
    (s.querySelectorAll?.("table") || []).forEach((f) => {
      try {
        if (f.classList)
          f.classList.contains("table") || f.classList.add("table");
        else {
          const p = f.getAttribute?.("class") || "", m = String(p ?? "").split(/\s+/).filter(Boolean);
          m.indexOf("table") === -1 && m.push("table");
          try {
            f.setAttribute?.("class", m.join(" "));
          } catch {
            f.className = m.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (f) {
    S("[htmlBuilder] add Bulma table class failed", f);
  }
  const { topH1: l, h1Text: c, slugKey: u } = uf(a, s, n, r);
  try {
    if (l && (a?.meta?.author || a?.meta?.date) && !l.parentElement?.querySelector?.(".nimbi-article-subtitle")) {
      const f = a.meta.author ? String(a.meta.author).trim() : "", p = a.meta.date ? String(a.meta.date).trim() : "";
      let m = "";
      try {
        const _ = new Date(p);
        p && !isNaN(_.getTime()) ? m = _.toLocaleDateString() : m = p;
      } catch {
        m = p;
      }
      const g = [];
      if (f && g.push(f), m && g.push(m), g.length) {
        const _ = document.createElement("p"), h = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", w = g.slice(1);
        if (_.className = "nimbi-article-subtitle is-6 has-text-grey-light", h) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = h, _.appendChild(b);
        }
        if (w.length) {
          const b = document.createElement("span");
          b.className = "nimbi-article-meta", b.textContent = w.join(" • "), _.appendChild(b);
        }
        try {
          l.parentElement.insertBefore(_, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", _);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await kf(s, i, n);
  } catch (f) {
    af("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", f), await El(s, i, n);
  }
  const d = lf(e, a.toc, n);
  return {
    article: s,
    parsed: a,
    toc: d,
    topH1: l,
    h1Text: c,
    slugKey: u
  };
}
function gf(e, t = !1) {
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
        if (i.hasAttribute("nonce") || Ha(i), !r.src) {
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
              wn("[htmlBuilder] executed inline script via Function");
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
              } catch (u) {
                try {
                  S("[htmlBuilder] injected script append failed, skipping", {
                    src: o,
                    err: u
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
            S("[htmlBuilder] injected script error", {
              src: o,
              ev: s
            });
          } catch {
          }
        }), i.addEventListener("load", () => {
          try {
            wn("[htmlBuilder] injected script loaded", {
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
              S("[htmlBuilder] injected script append failed, skipping", {
                src: o,
                err: l
              });
            } catch {
            }
          }
        }
        r.parentNode?.removeChild(r);
        try {
          wn("[htmlBuilder] executed injected script", o);
        } catch {
        }
      } catch (i) {
        S("[htmlBuilder] execute injected script failed", i);
      }
    } catch {
    }
}
function ho(e, t, n) {
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
    if (!Se) try {
      const o = document.createElement("p");
      o.textContent = (t && t("goHome") || "Go back to") + " ";
      const s = document.createElement("a");
      try {
        s.href = qe(At);
      } catch {
        s.href = qe(At || "");
      }
      s.textContent = t && t("home") || "Home", o.appendChild(s), e && e.appendChild && e.appendChild(o);
    } catch {
    }
  } catch {
  }
  try {
    try {
      Ei({
        title: t && t("notFound") || "Not Found",
        description: t && t("notFoundDescription") || ""
      }, Se, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
var mf = {
  intervalMs: 500,
  targetMs: 80,
  hysteresis: 0.25,
  cooldownMs: 600,
  stepUp: 1,
  stepDown: 1
}, jl = (() => {
  const e = {
    size: 2,
    minSize: 2,
    autoScale: mf,
    messageCodec: "legacy",
    maxQueueLength: 100
  };
  try {
    e.debugLevel = 0;
  } catch {
  }
  try {
    return new Ga(rf, e);
  } catch {
    return {
      workers: [],
      postMessage: async () => {
        throw new Error("anchor worker unavailable");
      }
    };
  }
})();
function yf(e) {
  if (!e) return null;
  try {
    if (be?.has?.(e)) return be.get(e);
  } catch {
  }
  try {
    const r = String(e).replace(/^.*\//, "");
    if (r && be?.has?.(r)) return be.get(r);
  } catch {
  }
  const t = vl();
  try {
    if (t?.has?.(e)) return t.get(e);
    const r = String(e).replace(/^.*\//, "");
    if (r && t?.has?.(r)) return t.get(r);
  } catch {
  }
  const n = Sl(e, 2);
  try {
    for (const [r, i] of te || []) {
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
function _f(e, t, n) {
  n = Hr(n);
  const r = /* @__PURE__ */ new Set();
  let i = "/";
  try {
    const o = new URL(t, location.href);
    i = jn(o.pathname);
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
      if (!l || Li(l) || l.startsWith("/") && !l.endsWith(".md")) continue;
      const c = l.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let p = c[1];
        !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
        const m = new URL(p, t).pathname;
        let g = m.startsWith(i) ? m.slice(i.length) : m;
        g = re(Gr(g, i)), r.add(g), r.add(String(g).replace(/^.*\//, ""));
        continue;
      }
      let u = l;
      !l.startsWith("/") && n && (l.startsWith("#") ? u = n + l : u = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + l);
      const d = new URL(u, t).pathname || "";
      if (!d || d.indexOf(i) === -1) continue;
      let f = d.startsWith(i) ? d.slice(i.length) : d;
      f = re(Gr(f, i)), f = Wn(f), f || (f = Kt), r.add(f), r.add(String(f).replace(/^.*\//, "")), /\.[^/]+$/.test(String(f ?? "")) || (r.add(f + ".html"), r.add((f + ".html").replace(/^.*\//, "")));
    } catch {
    }
  } catch {
  }
  const a = {};
  for (const o of r) {
    const s = yf(o);
    s && (a[o] = s);
  }
  return {
    allowProbe: qr(t),
    homeSlug: Kt,
    pathToSlug: a
  };
}
function bf() {
  return jl.workers?.[0]?.worker?._underlying ?? null;
}
function wf(e) {
  return jl.postMessage(e, void 0, {
    awaitResponse: !0,
    timeout: 2e3
  }).then((t) => {
    if (t && typeof t == "object" && t.error) throw new Error(t.error);
    return t;
  }).catch((t) => {
    throw (t?.message || "").includes("postMessage response timeout") ? new Error("worker timeout") : t;
  });
}
async function kf(e, t, n) {
  if (!bf()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  n = Hr(n);
  const r = String(e.innerHTML), i = _f(e, t, n), a = await wf({
    type: "rewriteAnchors",
    html: r,
    contentBase: t,
    pagePath: n,
    snapshot: i
  }), o = a && typeof a == "object" && typeof a.html == "string" ? a.html : a;
  if (a && typeof a == "object" && Array.isArray(a.mappings)) for (const l of a.mappings) try {
    l && l.slug && l.path && ft(l.slug, l.path);
  } catch (c) {
    S("[htmlBuilder] storing worker anchor mapping failed", c);
  }
  let s = !1;
  if (typeof o == "string") try {
    const l = String(o ?? "").includes(".md");
    String(r ?? "").includes(".md") && l && (s = !0);
    const c = at && at();
    if (c) {
      const u = c.parseFromString(String(o ?? ""), "text/html"), d = Array.from(u.body.childNodes || []);
      d.length ? e.replaceChildren(...d) : e.innerHTML = o;
    } else try {
      const u = document && typeof document.createRange == "function" ? document.createRange() : null;
      if (u && typeof u.createContextualFragment == "function") {
        const d = u.createContextualFragment(String(o ?? ""));
        e.replaceChildren(...Array.from(d.childNodes));
      } else e.innerHTML = o;
    } catch {
      e.innerHTML = o;
    }
  } catch (l) {
    S("[htmlBuilder] applying rewritten anchors failed", l), s = !0;
  }
  if (s) try {
    await El(e, t, n);
  } catch (l) {
    S("[htmlBuilder] main-thread fallback after worker rewrite failed", l);
  }
}
function xf(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target?.closest?.("a") || null;
      if (!n) return;
      const r = n.getAttribute?.("href") || "";
      try {
        const i = yt(r), a = i?.page ?? null, o = i?.anchor ?? null;
        if (!a && !o) return;
        t.preventDefault();
        let s = null;
        try {
          history?.state?.page && (s = history.state.page);
        } catch (l) {
          s = null, S("[htmlBuilder] access history.state failed", l);
        }
        try {
          s || (s = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          S("[htmlBuilder] parse current location failed", l);
        }
        if (!a && o || a && s && String(a) === String(s)) {
          try {
            if (!a && o) try {
              history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (o ? "#" + encodeURIComponent(o) : ""));
            } catch (l) {
              S("[htmlBuilder] history.replaceState failed", l);
            }
            else try {
              history.replaceState({ page: s || a }, "", Ot(s || a, o));
            } catch (l) {
              S("[htmlBuilder] history.replaceState failed", l);
            }
          } catch (l) {
            S("[htmlBuilder] update history for anchor failed", l);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (l) {
            S("[htmlBuilder] stopPropagation failed", l);
          }
          try {
            $a(o);
          } catch (l) {
            S("[htmlBuilder] scrollToAnchorOrTop failed", l);
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
            S("[htmlBuilder] window.renderByQuery failed", l);
          }
          else if (typeof window < "u") try {
            window.dispatchEvent(new PopStateEvent("popstate"));
          } catch (l) {
            S("[htmlBuilder] dispatch popstate failed", l);
          }
          else try {
            const l = renderByQuery();
            l && typeof l.catch == "function" && l.catch(() => {
            });
          } catch (l) {
            S("[htmlBuilder] renderByQuery failed", l);
          }
        } catch (l) {
          S("[htmlBuilder] SPA navigation invocation failed", l);
        }
      } catch (i) {
        S("[htmlBuilder] non-URL href in attachTocClickHandler", i);
      }
    });
  } catch (t) {
    S("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function $a(e) {
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
              S("[htmlBuilder] scrollIntoView failed", a);
            }
          }
        } catch {
          try {
            n.scrollIntoView();
          } catch (a) {
            S("[htmlBuilder] final scroll fallback failed", a);
          }
        }
      };
      try {
        requestAnimationFrame(() => setTimeout(r, 50));
      } catch (i) {
        S("[htmlBuilder] scheduling scroll failed", i), setTimeout(r, 50);
      }
    } catch (r) {
      try {
        n.scrollIntoView();
      } catch (i) {
        S("[htmlBuilder] final scroll fallback failed", i);
      }
      S("[htmlBuilder] doScroll failed", r);
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
      S("[htmlBuilder] window.scrollTo failed", r);
    }
    S("[htmlBuilder] scroll to top failed", n);
  }
}
function Sf(e, t, { mountOverlay: n = null, container: r = null, mountEl: i = null, navWrap: a = null, t: o = null } = {}) {
  try {
    const s = typeof o == "function" ? o : () => {
    }, l = r || document.querySelector(".nimbi-cms"), c = i || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), d = a || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top button is-primary is-rounded is-small", f.setAttribute("aria-label", s("scrollToTop") || "Scroll to top"), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(f) : l && l.appendChild ? l.appendChild(f) : c && c.appendChild ? c.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (g) {
          S("[htmlBuilder] append scroll top button failed", g);
        }
      }
      try {
        try {
          To(f);
        } catch {
        }
      } catch (m) {
        S("[htmlBuilder] set scroll-top button theme registration failed", m);
      }
      f.addEventListener("click", () => {
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
            S("[htmlBuilder] fallback container scrollTop failed", g);
          }
          try {
            i && (i.scrollTop = 0);
          } catch (g) {
            S("[htmlBuilder] fallback mountEl scrollTop failed", g);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (g) {
            S("[htmlBuilder] fallback document scrollTop failed", g);
          }
        }
      });
    }
    const p = d?.querySelector?.(".menu-label") || null;
    if (t) {
      if (!f._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const m = globalThis.IntersectionObserver, g = new m((_) => {
            for (const h of _) h.target instanceof Element && (h.isIntersecting ? (f.classList.remove("show"), p && p.classList.remove("show")) : (f.classList.add("show"), p && p.classList.add("show")));
          }, {
            root: r instanceof Element ? r : i instanceof Element ? i : null,
            threshold: 0
          });
          f._nimbiObserver = g;
        } else f._nimbiObserver = null;
      try {
        f._nimbiObserver && typeof f._nimbiObserver.disconnect == "function" && f._nimbiObserver.disconnect();
      } catch (m) {
        S("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        f._nimbiObserver && typeof f._nimbiObserver.observe == "function" && f._nimbiObserver.observe(t);
      } catch (m) {
        S("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const g = l instanceof Element ? l.getBoundingClientRect() : {
              top: 0,
              bottom: window.innerHeight
            }, _ = t.getBoundingClientRect();
            _.bottom < g.top || _.top > g.bottom ? (f.classList.add("show"), p && p.classList.add("show")) : (f.classList.remove("show"), p && p.classList.remove("show"));
          } catch (g) {
            S("[htmlBuilder] checkIntersect failed", g);
          }
        };
        m(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(m, 100);
      } catch (m) {
        S("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      f.classList.remove("show"), p && p.classList.remove("show");
      const m = r instanceof Element ? r : i instanceof Element ? i : window, g = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (f.classList.add("show"), p && p.classList.add("show")) : (f.classList.remove("show"), p && p.classList.remove("show"));
        } catch (_) {
          S("[htmlBuilder] onScroll handler failed", _);
        }
      };
      Ci(() => m.addEventListener("scroll", tf(g))), g();
    }
  } catch (s) {
    S("[htmlBuilder] ensureScrollTopButton failed", s);
  }
}
var Sr = null, fo = [], Rl = 1e3, vf = 4;
function po(e) {
  let t = String(e ?? "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return t = t.replace(/(?:-?)(?:md|html)$/g, ""), t = t.replace(/-+/g, "-"), t = t.replace(/^-|-$/g, ""), t.length > 80 && (t = t.slice(0, 80).replace(/-+$/g, "")), t;
}
function bn(e) {
  return String(e ?? "").replace(/^[./]+/, "");
}
function Af(e) {
  return String(e ?? "").replace(/\/+$/, "");
}
function Or(e) {
  return Af(e) + "/";
}
function Ef(e, t) {
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
function Ll(e) {
  const t = typeof location < "u" && location.origin ? location.origin : "http://localhost", n = String(e ?? "");
  return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? Or(n) : n.startsWith("/") ? t + Or(n) : t + "/" + Or(n) : t + "/";
}
async function Tf(e, t) {
  const n = Ll(t), r = new URL(String(e ?? "").replace(/^\//, ""), n).toString(), i = await fetch(r);
  return !i || !i.ok ? null : await i.text();
}
async function jf(e, t, n = vf) {
  const r = Array.isArray(e) ? e.slice() : [], i = Math.max(1, Number(n) || 1), a = [];
  for (let o = 0; o < Math.min(i, r.length); o++) a.push((async () => {
    for (; r.length; ) {
      const s = r.shift();
      s != null && await t(s);
    }
  })());
  await Promise.all(a);
}
async function Rf(e, t = Rl, n = void 0) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = [""];
  if (Array.isArray(n)) for (const l of n) try {
    const c = bn(l);
    c && a.push(c);
  } catch {
  }
  const o = Ll(e), s = Or(new URL(o).pathname);
  for (; a.length && a.length <= t; ) {
    const l = a.shift();
    if (l == null || r.has(l)) continue;
    r.add(l);
    const c = new URL(String(l ?? ""), o).toString();
    let u = null;
    try {
      const g = await fetch(c);
      if (!g || !g.ok) continue;
      u = await g.text();
    } catch {
      continue;
    }
    if (!u) continue;
    const d = [], f = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, p = /(?:^|[^!])\[[^\]]+\]\(([^)]+)\)/g;
    let m = null;
    for (; m = f.exec(u); ) try {
      m?.[1] && d.push(m[1]);
    } catch {
    }
    for (; m = p.exec(u); ) try {
      m?.[1] && d.push(m[1]);
    } catch {
    }
    for (const g of d) {
      if (!g || Ef(g, o) || g.startsWith("..") || g.includes("/../")) continue;
      if (g.endsWith("/")) {
        try {
          const b = new URL(g, c);
          let k = b.pathname.startsWith(s) ? b.pathname.slice(s.length) : b.pathname.replace(/^\//, "");
          k = Or(bn(k)), r.has(k) || a.push(k);
        } catch {
        }
        continue;
      }
      if (/\.(md|html?)($|[?#])/i.test(g)) {
        try {
          const b = new URL(g, c);
          let k = b.pathname.startsWith(s) ? b.pathname.slice(s.length) : b.pathname.replace(/^\//, "");
          k = bn(k).split(/[?#]/)[0], k && (i.add(k), r.has(k) || a.push(k));
        } catch {
        }
        try {
          const b = new URL(g, o);
          let k = b.pathname.startsWith(s) ? b.pathname.slice(s.length) : b.pathname.replace(/^\//, "");
          k = bn(k).split(/[?#]/)[0], k && !i.has(k) && (i.add(k), r.has(k) || a.push(k));
        } catch {
        }
        continue;
      }
      let _ = g.split(/[?#]/)[0].replace(/\/+$/, ""), h = null;
      try {
        const b = new URL(g, o);
        h = b.pathname.startsWith(s) ? b.pathname.slice(s.length) : b.pathname.replace(/^\//, "");
      } catch {
      }
      try {
        const b = new URL(g, c);
        _ = b.pathname.startsWith(s) ? b.pathname.slice(s.length) : b.pathname.replace(/^\//, "");
      } catch {
      }
      _ = bn(_).split(/[?#]/)[0].replace(/\/+$/, ""), h && (h = bn(h).split(/[?#]/)[0].replace(/\/+$/, ""));
      const w = String(_).split("/").pop() || "";
      if (!/\.[^./]+$/i.test(w)) {
        if (_) {
          const b = [
            `${_}.md`,
            `${_}.html`,
            `${_}/README.md`,
            `${_}/README.html`
          ];
          for (const k of b)
            i.add(k), r.has(k) || a.push(k);
        }
        if (h && h !== _) {
          const b = [
            `${h}.md`,
            `${h}.html`,
            `${h}/README.md`,
            `${h}/README.html`
          ];
          for (const k of b) i.has(k) || (i.add(k), r.has(k) || a.push(k));
        }
      }
    }
  }
  return Array.from(i);
}
function Lf(e, t) {
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
async function Cf(e, t = 1, n = void 0, r = void 0) {
  if (Sr) return Sr;
  Sr = (async () => {
    const i = Array.isArray(n) ? new Set(n.map((c) => bn(c))) : /* @__PURE__ */ new Set(), a = Array.isArray(r) ? r.map((c) => bn(c)).filter(Boolean) : [], o = await Rf(e, Rl, a), s = Array.from(new Set(o.concat(a))).filter((c) => /\.(md|html?)$/i.test(c)).filter((c) => !Array.from(i).some((u) => u && (c === u || c.startsWith(u + "/")))), l = [];
    return await jf(s, async (c) => {
      const u = await Tf(c, e);
      if (!u) return;
      const d = /\.html?$/i.test(c), { title: f, excerpt: p } = Lf(u, d), m = po(f || c);
      let g = null, _ = null;
      try {
        if (!d) {
          const { data: h } = tr(u), w = h.dateModified || h.date || h.lastmod;
          if (w) {
            const k = new Date(w);
            isNaN(k.getTime()) || (g = k.toISOString().split("T")[0]);
          }
          const b = h.image || h.og_image || h.cover || h.featured_image;
          b && String(b).trim() && (_ = String(b).trim());
        }
      } catch {
      }
      if (l.push({
        slug: m,
        title: f,
        excerpt: p,
        path: c,
        lastmod: g,
        image: _
      }), Number(t) >= 2) {
        const h = d ? /<h2[^>]*>([\s\S]*?)<\/h2>/gi : /^##\s+(.+)$/gm;
        let w = null;
        for (; w = h.exec(u); ) {
          const b = String(w[1] ?? "").replace(/<[^>]+>/g, "").trim();
          b && l.push({
            slug: `${m}::${po(b)}`,
            title: b,
            excerpt: "",
            path: c,
            parentTitle: f || "",
            lastmod: g
          });
        }
      }
    }), fo = l, fo;
  })();
  try {
    return await Sr;
  } finally {
    Sr = null;
  }
}
async function Cl() {
  return Pc;
}
async function Mf(e, t = 1, n = void 0, r = void 0) {
  return (await Cl()).buildSearchIndexWorker(e, t, n, r);
}
async function Pf(e = {}) {
  return (await Cl()).awaitSearchIndex(e);
}
var ya = /* @__PURE__ */ Fi({
  attachSitemapDownloadUI: () => Wa,
  clearSitemapWriteTimer: () => Ml,
  exposeSitemapGlobals: () => Fa,
  generateAtomXml: () => Ua,
  generateRobotsTxt: () => Of,
  generateRssXml: () => Ba,
  generateSitemapJson: () => Xi,
  generateSitemapXml: () => Da,
  handleSitemapRequest: () => Vr
});
function ss() {
  try {
    if (typeof location?.pathname == "string") return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function Xe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function go(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((t) => t ? t.charAt(0).toUpperCase() + t.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function If(e) {
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
function Nf(e, t) {
  try {
    const n = t?.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = {
      loc: e + "?page=" + encodeURIComponent(n),
      slug: n
    };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = re(String(t.path))), t.image && (r.image = String(t.image)), r;
  } catch {
    return null;
  }
}
async function Xi(e = {}) {
  const { includeAllMarkdown: t = !0, index: n, homePage: r, navigationPage: i, notFoundPage: a } = e || {}, o = ss().split("?")[0];
  let s = Array.isArray(oe) && oe.length ? oe : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(oe) && oe.length) {
    const _ = /* @__PURE__ */ new Map();
    try {
      for (const h of n) try {
        h?.slug && _.set(String(h.slug), h);
      } catch {
      }
      for (const h of oe) try {
        h?.slug && _.set(String(h.slug), h);
      } catch {
      }
    } catch {
    }
    s = Array.from(_.values());
  }
  const l = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && l.add(re(String(a)));
  } catch {
  }
  try {
    typeof i == "string" && i.trim() && l.add(re(String(i)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const _ = re(String(a));
      try {
        if (typeof be?.has == "function" && be.has(_)) try {
          c.add(be.get(_));
        } catch {
        }
        else try {
          const h = await Ke(_, e?.contentBase ? e.contentBase : void 0);
          if (h?.raw) try {
            let w = null;
            if (h.isHtml) try {
              const b = at();
              if (b) {
                const k = b.parseFromString(h.raw, "text/html"), E = k.querySelector("h1") || k.querySelector("title");
                E && E.textContent && (w = E.textContent.trim());
              } else {
                const k = (h.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                k && (w = (k[1] || k[2] || "").trim());
              }
            } catch {
            }
            else {
              const b = (h.raw || "").match(/^#\s+(.+)$/m);
              b && b[1] && (w = b[1].trim());
            }
            w && c.add(ke(w));
          } catch {
          }
        } catch {
        }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), d = [], f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = (_) => {
    try {
      if (!_ || typeof _ != "string") return !1;
      const h = re(String(_));
      try {
        if (typeof Qe?.has == "function" && Qe.has(h)) return !0;
      } catch {
      }
      try {
        if (typeof be?.has == "function" && be.has(h)) return !0;
      } catch {
      }
      try {
        if (p?.has(h)) return !0;
      } catch {
      }
      try {
        if (typeof be?.keys == "function" && be.size) for (const w of be.keys()) try {
          if (re(String(w)) === h) return !0;
        } catch {
        }
        else for (const w of te.values()) try {
          if (!w) continue;
          if (typeof w == "string") {
            if (re(String(w)) === h) return !0;
          } else if (w && typeof w == "object") {
            if (w.default && re(String(w.default)) === h) return !0;
            const b = w.langs || {};
            for (const k of Object.keys(b || {})) try {
              if (b[k] && re(String(b[k])) === h) return !0;
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
    let _ = 0;
    for (const h of s) {
      try {
        _++, await kn(_, 64);
      } catch {
      }
      try {
        if (!h?.slug) continue;
        const w = String(h.slug), b = String(w).split("::")[0];
        if (c.has(b)) continue;
        const k = h.path ? re(String(h.path)) : null;
        if (k && l.has(k)) continue;
        const E = h.title ? String(h.title) : h.parentTitle ? String(h.parentTitle) : void 0;
        f.set(w, {
          title: E || void 0,
          excerpt: h.excerpt ? String(h.excerpt) : void 0,
          path: k,
          source: "index",
          image: h.image ? String(h.image) : void 0
        }), k && p.set(k, {
          title: E || void 0,
          excerpt: h.excerpt ? String(h.excerpt) : void 0,
          slug: w,
          image: h.image ? String(h.image) : void 0
        });
        const z = Nf(o, h);
        if (!z || !z.slug || u.has(z.slug)) continue;
        if (u.add(z.slug), f.has(z.slug)) {
          const W = f.get(z.slug);
          W?.title && (z.title = W.title, z._titleSource = "index"), W?.excerpt && (z.excerpt = W.excerpt), W?.image && (z.image = W.image);
        }
        d.push(z);
      } catch {
        continue;
      }
    }
  }
  if (t) try {
    let _ = 0;
    for (const [h, w] of te.entries()) {
      try {
        _++, await kn(_, 128);
      } catch {
      }
      try {
        if (!h) continue;
        const b = String(h).split("::")[0];
        if (u.has(h) || c.has(b)) continue;
        let k = null;
        if (typeof w == "string" ? k = re(String(w)) : w && typeof w == "object" && (k = re(String(w.default ?? ""))), k && l.has(k)) continue;
        const E = {
          loc: o + "?page=" + encodeURIComponent(h),
          slug: h
        };
        if (f.has(h)) {
          const z = f.get(h);
          z?.title && (E.title = z.title, E._titleSource = "index"), z?.excerpt && (E.excerpt = z.excerpt), z?.image && (E.image = z.image);
        } else if (k) {
          const z = p.get(k);
          z?.title && (E.title = z.title, E._titleSource = "path", !E.excerpt && z?.excerpt && (E.excerpt = z.excerpt)), !E.image && z?.image && (E.image = z.image);
        }
        if (u.add(h), typeof h == "string") {
          const z = h.indexOf("/") !== -1 || /\.(md|html?)$/i.test(h), W = E.title && typeof E.title == "string" && (E.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(E.title));
          (!E.title || W || z) && (E.title = go(h), E._titleSource = "humanize");
        }
        d.push(E);
      } catch {
      }
    }
    try {
      if (r && typeof r == "string") {
        const h = re(String(r));
        let w = null;
        try {
          typeof be?.has == "function" && be.has(h) && (w = be.get(h));
        } catch {
        }
        w || (w = h);
        const b = String(w).split("::")[0];
        if (!u.has(w) && !l.has(h) && !c.has(b)) {
          const k = {
            loc: o + "?page=" + encodeURIComponent(w),
            slug: w
          };
          if (f.has(w)) {
            const E = f.get(w);
            E?.title && (k.title = E.title, k._titleSource = "index"), E?.excerpt && (k.excerpt = E.excerpt), E?.image && (k.image = E.image);
          }
          u.add(w), d.push(k);
        }
      }
    } catch {
    }
  } catch {
  }
  try {
    const _ = /* @__PURE__ */ new Set(), h = new Set(d.map((z) => String(z?.slug ?? ""))), w = /* @__PURE__ */ new Set();
    for (const z of d) try {
      z?.sourcePath && w.add(String(z.sourcePath));
    } catch {
    }
    const b = 30;
    let k = 0, E = 0;
    for (const z of w) {
      try {
        E++, await kn(E, 8);
      } catch {
      }
      if (k >= b) break;
      try {
        if (!z || typeof z != "string" || !m(z)) continue;
        k += 1;
        const W = await Ke(z, e?.contentBase ? e.contentBase : void 0);
        if (!W || !W.raw || W && typeof W.status == "number" && W.status === 404) continue;
        const F = (function(C) {
          try {
            return String(C ?? "");
          } catch {
            return "";
          }
        })(W.raw), K = [], se = /\[[^\]]+\]\(([^)]+)\)/g;
        let he;
        for (; he = se.exec(F); ) try {
          he?.[1] && K.push(he[1]);
        } catch {
        }
        const ie = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; he = ie.exec(F); ) try {
          he?.[1] && K.push(he[1]);
        } catch {
        }
        for (const C of K) try {
          if (!C) continue;
          if (C.indexOf("?") !== -1 || C.indexOf("=") !== -1) try {
            const j = new URL(C, o).searchParams.get("page");
            if (j) {
              const T = String(j);
              !h.has(T) && !_.has(T) && (_.add(T), d.push({
                loc: o + "?page=" + encodeURIComponent(T),
                slug: T
              }));
              continue;
            }
          } catch {
          }
          let I = String(C).split(/[?#]/)[0];
          if (I = I.replace(/^\.\//, "").replace(/^\//, ""), !I || !/\.(md|html?)$/i.test(I)) continue;
          try {
            const j = re(I);
            if (be?.has?.(j)) {
              const T = be?.get?.(j), N = String(T).split("::")[0];
              T && !h.has(T) && !_.has(T) && !c.has(N) && !l.has(j) && (_.add(T), d.push({
                loc: o + "?page=" + encodeURIComponent(T),
                slug: T,
                sourcePath: j
              }));
              continue;
            }
            try {
              if (!m(j)) continue;
              const T = await Ke(j, e?.contentBase ? e.contentBase : void 0);
              if (T && typeof T.status == "number" && T.status === 404) continue;
              if (T && T.raw) {
                const N = (T.raw || "").match(/^#\s+(.+)$/m), Y = N && N[1] ? N[1].trim() : "", $ = ke(Y || j), ne = String($).split("::")[0];
                $ && !h.has($) && !_.has($) && !c.has(ne) && (_.add($), d.push({
                  loc: o + "?page=" + encodeURIComponent($),
                  slug: $,
                  sourcePath: j,
                  title: Y || void 0
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
    const _ = /* @__PURE__ */ new Map();
    let h = 0;
    for (const b of d) {
      try {
        h++, await kn(h, 128);
      } catch {
      }
      try {
        if (!b || !b.slug) continue;
        _.set(String(b.slug), b);
      } catch {
      }
    }
    const w = /* @__PURE__ */ new Set();
    for (const b of d) try {
      if (!b || !b.slug) continue;
      const k = String(b.slug), E = k.split("::")[0];
      if (!E) continue;
      k !== E && !_.has(E) && w.add(E);
    } catch {
    }
    for (const b of w) try {
      let k = null;
      if (f.has(b)) {
        const E = f.get(b);
        k = {
          loc: o + "?page=" + encodeURIComponent(b),
          slug: b
        }, E?.title && (k.title = E.title, k._titleSource = "index"), E?.excerpt && (k.excerpt = E.excerpt), E?.path && (k.sourcePath = E.path), E?.lastmod && (k.lastmod = E.lastmod), E?.image && (k.image = E.image);
      } else if (p && te?.has?.(b)) {
        const E = te?.get?.(b);
        let z = null;
        if (typeof E == "string" ? z = re(String(E)) : E && typeof E == "object" && (z = re(String(E.default ?? ""))), k = {
          loc: o + "?page=" + encodeURIComponent(b),
          slug: b
        }, z && p.has(z)) {
          const W = p.get(z);
          W?.title && (k.title = W.title, k._titleSource = "path"), W?.excerpt && (k.excerpt = W.excerpt), k.sourcePath = z, W?.lastmod && (k.lastmod = W.lastmod), W?.image && (k.image = W.image);
        }
      }
      k || (k = {
        loc: o + "?page=" + encodeURIComponent(b),
        slug: b,
        title: go(b)
      }, k._titleSource = "humanize"), _.has(b) || (d.push(k), _.set(b, k));
    } catch {
    }
  } catch {
  }
  const g = [];
  try {
    const _ = /* @__PURE__ */ new Set();
    let h = 0;
    for (const w of d) {
      try {
        h++, await kn(h, 128);
      } catch {
      }
      try {
        if (!w || !w.slug) continue;
        const b = String(w.slug), k = String(b).split("::")[0];
        if (c.has(k) || b.indexOf("::") !== -1 || _.has(b)) continue;
        _.add(b), g.push(w);
      } catch {
      }
    }
  } catch {
  }
  try {
    try {
      pe(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(g.map((_) => ({
        slug: _.slug,
        title: _.title,
        titleSource: _._titleSource || null
      })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let h = 0;
    const w = g.length, b = Array.from({ length: Math.min(4, w) }).map(async () => {
      for (; ; ) {
        const k = h++;
        if (k >= w) break;
        const E = g[k];
        try {
          if (!E || !E.slug) continue;
          const z = String(E.slug).split("::")[0];
          if (c.has(z) || E._titleSource === "index") continue;
          let W = null;
          try {
            if (te?.has?.(E.slug)) {
              const F = te?.get?.(E.slug);
              typeof F == "string" ? W = re(String(F)) : F && typeof F == "object" && (W = re(String(F.default ?? "")));
            }
            !W && E.sourcePath && (W = E.sourcePath);
          } catch {
            continue;
          }
          if (!W || l.has(W) || !m(W)) continue;
          try {
            const F = await Ke(W, e?.contentBase ? e.contentBase : void 0);
            if (!F || !F.raw || F && typeof F.status == "number" && F.status === 404) continue;
            if (F && F.raw) {
              const K = (F.raw || "").match(/^#\s+(.+)$/m), se = K && K[1] ? K[1].trim() : "";
              se && (E.title = se, E._titleSource = "fetched");
            }
          } catch (F) {
            pe("[runtimeSitemap] fetch title failed for", W, F);
          }
        } catch (z) {
          pe("[runtimeSitemap] worker loop failure", z);
        }
      }
    });
    await Promise.all(b);
  } catch (_) {
    pe("[runtimeSitemap] title enrichment failed", _);
  }
  return {
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    entries: g
  };
}
function Da(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
  for (const r of t) try {
    if (n += `  <url>
`, n += `    <loc>${Xe(String(r.loc ?? ""))}</loc>
`, r.lastmod && (n += `    <lastmod>${Xe(String(r.lastmod))}</lastmod>
`), r.changefreq && (n += `    <changefreq>${Xe(String(r.changefreq))}</changefreq>
`), r.priority && (n += `    <priority>${Xe(String(r.priority))}</priority>
`), r.hreflang) {
      const i = Array.isArray(r.hreflang) ? r.hreflang : [r.hreflang];
      for (const a of i) n += `    <xhtml:link rel="alternate" hreflang="${Xe(String(a.lang))}" href="${Xe(String(a.href))}" />
`;
    }
    if (r.image) {
      const i = If(String(r.image));
      i && (n += `    <image:image>
`, n += `      <image:loc>${Xe(i)}</image:loc>
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
function Ba(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [], n = ss().split("?")[0];
  let r = `<?xml version="1.0" encoding="UTF-8"?>
`;
  r += `<rss version="2.0">
`, r += `<channel>
`, r += `<title>${Xe("Sitemap RSS")}</title>
`, r += `<link>${Xe(n)}</link>
`, r += `<description>${Xe("RSS feed generated from site index")}</description>
`, r += `<lastBuildDate>${Xe(e?.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const i of t) try {
    const a = String(i.loc ?? "");
    r += `<item>
`, r += `<title>${Xe(String(i.title || i.slug || (i.loc ?? "")))}</title>
`, i.excerpt && (r += `<description>${Xe(String(i.excerpt))}</description>
`), r += `<link>${Xe(a)}</link>
`, r += `<guid>${Xe(a)}</guid>
`, r += `</item>
`;
  } catch {
  }
  return r += `</channel>
`, r += `</rss>
`, r;
}
function Ua(e) {
  const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [], n = ss().split("?")[0], r = e?.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let i = `<?xml version="1.0" encoding="utf-8"?>
`;
  i += `<feed xmlns="http://www.w3.org/2005/Atom">
`, i += `<title>${Xe("Sitemap Atom")}</title>
`, i += `<link href="${Xe(n)}" />
`, i += `<updated>${Xe(r)}</updated>
`, i += `<id>${Xe(n)}</id>
`;
  for (const a of t) try {
    const o = String(a.loc ?? ""), s = a?.lastmod ? new Date(a.lastmod).toISOString() : r;
    i += `<entry>
`, i += `<title>${Xe(String(a.title || a.slug || (a.loc ?? "")))}</title>
`, a.excerpt && (i += `<summary>${Xe(String(a.excerpt))}</summary>
`), i += `<link href="${Xe(o)}" />
`, i += `<id>${Xe(o)}</id>
`, i += `<updated>${Xe(s)}</updated>
`, i += `</entry>
`;
  } catch {
  }
  return i += `</feed>
`, i;
}
function Of(e = {}) {
  const { sitemapUrl: t, disallow: n = [] } = e || {};
  let r = `User-agent: *
`;
  for (const i of n) r += `Disallow: ${String(i)}
`;
  return typeof t == "string" && t.trim() && (r += `Sitemap: ${String(t.trim())}
`), r;
}
function Ml() {
  try {
    typeof window < "u" && window.__nimbiSitemapWriteTimer && (clearTimeout(window.__nimbiSitemapWriteTimer), window.__nimbiSitemapWriteTimer = null, window.__nimbiSitemapPendingWrite = null);
  } catch {
  }
}
function mo(e, t = "application/xml") {
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
          r.textContent = Xe(e);
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
            document.body.innerHTML = "<pre>" + Xe(e) + "</pre>";
          } catch {
          }
        }
      } catch {
      }
    } catch {
    }
  }
}
function yo(e) {
  try {
    const t = Array.isArray(e?.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const r of t) try {
      n += `<li><a href="${Xe(String(r && r.loc ? r.loc : ""))}">${Xe(String(r && (r.title || r.slug) || r && r.loc || ""))}</a></li>`;
    } catch {
    }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function _i(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let r = null;
        t === "application/rss+xml" ? r = Ba(e) : t === "application/atom+xml" ? r = Ua(e) : t === "text/html" ? r = yo(e) : r = Da(e), mo(r, t);
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
          i.mimeType === "application/rss+xml" ? a = Ba(i.finalJson) : i.mimeType === "application/atom+xml" ? a = Ua(i.finalJson) : i.mimeType === "text/html" ? a = yo(i.finalJson) : a = Da(i.finalJson);
          try {
            mo(a, i.mimeType);
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
      window.__nimbiSitemapUnloadListenerAttached || (window.__nimbiSitemapUnloadListenerAttached = !0, window.addEventListener("beforeunload", Ml));
    } catch {
    }
  } catch {
  }
}
async function Vr(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, r = !1, i = !1;
    try {
      const u = new URLSearchParams(location.search || "");
      if (u.has("sitemap")) {
        let d = !0;
        for (const f of u.keys()) f !== "sitemap" && (d = !1);
        d && (t = !0);
      }
      if (u.has("rss")) {
        let d = !0;
        for (const f of u.keys()) f !== "rss" && (d = !1);
        d && (n = !0);
      }
      if (u.has("atom")) {
        let d = !0;
        for (const f of u.keys()) f !== "atom" && (d = !1);
        d && (r = !0);
      }
    } catch {
    }
    if (!t && !n && !r) {
      const u = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!u || (t = /^(sitemap|sitemap\.xml)$/i.test(u), n = /^(rss|rss\.xml)$/i.test(u), r = /^(atom|atom\.xml)$/i.test(u), i = /^(sitemap|sitemap\.html)$/i.test(u), !t && !n && !r && !i)) return !1;
    }
    let a = [];
    const o = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof vn == "function") try {
        const u = await vn({
          timeoutMs: o,
          contentBase: e?.contentBase,
          indexDepth: e?.indexDepth,
          noIndexing: e?.noIndexing,
          startBuild: !0
        });
        if (Array.isArray(u) && u.length)
          if (Array.isArray(e.index) && e.index.length) {
            const d = /* @__PURE__ */ new Map();
            try {
              for (const f of e.index) try {
                f?.slug && d.set(String(f.slug), f);
              } catch {
              }
              for (const f of u) try {
                f?.slug && d.set(String(f.slug), f);
              } catch {
              }
            } catch {
            }
            a = Array.from(d.values());
          } else a = u;
        else a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(oe) && oe.length ? oe : [];
      } catch {
        a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(oe) && oe.length ? oe : [];
      }
      else a = Array.isArray(oe) && oe.length ? oe : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(oe) && oe.length ? oe : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length) try {
        const u = /* @__PURE__ */ new Map();
        for (const d of e.index) try {
          if (!d || !d.slug) continue;
          const f = String(d.slug).split("::")[0];
          if (!u.has(f)) u.set(f, d);
          else {
            const p = u.get(f);
            p && String(p.slug ?? "").indexOf("::") !== -1 && String(d.slug ?? "").indexOf("::") === -1 && u.set(f, d);
          }
        } catch {
        }
        try {
          pe(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(u.values()), null, 2));
        } catch {
          pe(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(u.size));
        }
      } catch (u) {
        S("[runtimeSitemap] logging provided index failed", u);
      }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Un == "function") try {
      const u = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
      let d = null;
      try {
        typeof vn == "function" && (d = await vn({
          timeoutMs: u,
          contentBase: e?.contentBase,
          indexDepth: e?.indexDepth,
          noIndexing: e?.noIndexing,
          startBuild: !0
        }));
      } catch {
        d = null;
      }
      if (Array.isArray(d) && d.length) a = d;
      else {
        const f = typeof e.indexDepth == "number" ? e.indexDepth : 3, p = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, m = [];
        e?.homePage && m.push(e.homePage), e?.navigationPage && m.push(e.navigationPage), a = await Un(e?.contentBase, f, p, m.length ? m : void 0);
      }
    } catch (u) {
      S("[runtimeSitemap] rebuild index failed", u), a = Array.isArray(oe) && oe.length ? oe : [];
    }
    try {
      const u = Array.isArray(a) ? a.length : 0;
      try {
        pe(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(u));
      } catch {
      }
      try {
        pe(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const u = [];
      e?.homePage && u.push(e.homePage), e?.navigationPage && u.push(e.navigationPage);
      const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let p = null;
      try {
        const m = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof m == "function") try {
          p = await m(e?.contentBase, d, f);
        } catch {
          p = null;
        }
      } catch {
        p = null;
      }
      if ((!p || !p.length) && typeof Un == "function") try {
        p = await Un(e?.contentBase, d, f, u.length ? u : void 0);
      } catch {
        p = null;
      }
      if (Array.isArray(p) && p.length) {
        const m = /* @__PURE__ */ new Map();
        try {
          for (const g of a) try {
            g?.slug && m.set(String(g.slug), g);
          } catch {
          }
          for (const g of p) try {
            g?.slug && m.set(String(g.slug), g);
          } catch {
          }
        } catch {
        }
        a = Array.from(m.values());
      }
    } catch (u) {
      try {
        S("[runtimeSitemap] rebuild index call failed", u);
      } catch {
      }
    }
    try {
      const u = Array.isArray(a) ? a.length : 0;
      try {
        pe(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(u));
      } catch {
      }
      try {
        pe(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const s = await Xi(Object.assign({}, e, { index: a }));
    let l = [];
    try {
      const u = /* @__PURE__ */ new Set(), d = Array.isArray(s?.entries) ? s.entries : [];
      for (const f of d) try {
        let p = null;
        if (f && f.slug) p = String(f.slug);
        else if (f && f.loc) try {
          p = new URL(String(f.loc)).searchParams.get("page");
        } catch {
        }
        if (!p) continue;
        const m = String(p).split("::")[0];
        if (!u.has(m)) {
          u.add(m);
          const g = Object.assign({}, f);
          g.baseSlug = m, l.push(g);
        }
      } catch {
      }
      try {
        pe(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(l, null, 2));
      } catch {
        pe(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(l.length));
      }
    } catch {
      try {
        l = Array.isArray(s?.entries) ? s.entries.slice(0) : [];
      } catch {
        l = [];
      }
    }
    const c = Object.assign({}, s || {}, { entries: Array.isArray(l) ? l : Array.isArray(s?.entries) ? s.entries : [] });
    try {
      if (typeof window < "u") try {
        window.__nimbiSitemapJson = c, window.__nimbiSitemapFinal = l;
      } catch {
      }
    } catch {
    }
    if (n) {
      const u = Array.isArray(c?.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          pe("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return _i(c, "application/rss+xml"), !0;
    }
    if (r) {
      const u = Array.isArray(c?.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          pe("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return _i(c, "application/atom+xml"), !0;
    }
    if (t) {
      const u = Array.isArray(c?.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          pe("[runtimeSitemap] skip XML write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return _i(c, "application/xml"), !0;
    }
    if (i) try {
      const u = (Array.isArray(c?.entries) ? c.entries : []).length;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          pe("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return _i(c, "text/html"), !0;
    } catch (u) {
      return S("[runtimeSitemap] render HTML failed", u), !1;
    }
    return !1;
  } catch (t) {
    return S("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
function Wa(e, t = {}) {
  try {
    if (!e || typeof document > "u") return null;
    const n = document.createElement("button");
    return n.type = "button", n.className = "button is-small is-light", n.textContent = "Download sitemap", n.setAttribute("aria-label", "Download sitemap JSON"), n.addEventListener("click", async () => {
      try {
        const r = await Xi(), i = JSON.stringify(r, null, 2), a = new Blob([i], { type: "application/json" }), o = URL.createObjectURL(a);
        try {
          const s = document.createElement("a");
          s.href = o, s.download = String(t?.filename || "sitemap.json").replace(/\\/g, "_").replace(/[^A-Za-z0-9_.-]/g, "_").replace(/^_+/, "").replace(/_+$/, "") || "sitemap.json", s.style.display = "none", document.body.appendChild(s), s.click(), s.remove();
        } finally {
          setTimeout(() => {
            try {
              URL.revokeObjectURL(o);
            } catch {
            }
          }, 0);
        }
      } catch (r) {
        S("[runtimeSitemap] attachSitemapDownloadUI click failed", r);
      }
    }), e.appendChild(n), n;
  } catch (n) {
    return S("[runtimeSitemap] attachSitemapDownloadUI failed", n), null;
  }
}
async function Fa(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof vn == "function") try {
        const o = await vn({
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
    (!Array.isArray(n) || !n.length) && Array.isArray(oe) && oe.length && (n = oe), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const r = await Xi(Object.assign({}, e, { index: n }));
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
        const u = String(c).split("::")[0];
        if (!o.has(u)) {
          o.add(u);
          const d = Object.assign({}, l);
          d.baseSlug = u, i.push(d);
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
function zf(e) {
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
            const s = re(String(t.path ?? ""));
            if (a = findSlugForPath(s) || be?.get(s) || "", !a)
              if (t.title && String(t.title).trim()) a = ke(String(t.title).trim());
              else {
                const l = s.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = ke(l || s);
              }
          } else if (i) {
            const s = String(n).replace(/\.(?:md|html?)$/i, ""), l = findSlugForPath(s) || be?.get(s) || "";
            l ? a = l : t.title && String(t.title).trim() ? a = ke(String(t.title).trim()) : a = ke(s);
          } else !n && t.title && String(t.title).trim() ? a = ke(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? ke(String(t.title).trim()) : n ? ke(n) : "";
          } catch {
            a = n;
          }
        }
        let o = a || "";
        r && (o = o ? `${o}::${r}` : `${ke(r)}`), o && (t.slug = o);
        try {
          if (t.path && o) {
            const s = String(o).split("::")[0];
            try {
              ft(s, re(String(t.path ?? "")));
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
async function $f(e, t, n, r, i, a, o, s, l = "eager", c = 1, u = void 0, d = "favicon", f) {
  if (!e || !(e instanceof HTMLElement)) throw new TypeError("navbarWrap must be an HTMLElement");
  const p = at(), m = p ? p.parseFromString(n || "", "text/html") : null, g = m ? m.querySelectorAll("a") : [];
  await Ci(() => hf(g, r)), await Ci(() => ff(g, r));
  try {
    ye(g, r);
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
  let _ = null, h = null, w = null, b = null, k = null, E = null, z = null, W = !1, F = null;
  const K = /* @__PURE__ */ new Map(), se = (A, M, H, D) => {
    f ? A.addEventListener(M, H, {
      ...D,
      signal: f
    }) : A.addEventListener(M, H, D);
  };
  function he() {
    try {
      const A = typeof j < "u" && j && j.querySelector ? j.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null, M = A?.dataset?.target ?? null, H = M ? typeof j < "u" && j && j.querySelector ? j.querySelector(`#${M}`) || document.getElementById(M) : e && e.querySelector ? e.querySelector(`#${M}`) : typeof document < "u" ? document.getElementById(M) : null : null;
      if (A?.classList?.contains("is-active")) {
        try {
          A.classList.remove("is-active");
        } catch {
        }
        try {
          A.setAttribute("aria-expanded", "false");
        } catch {
        }
        if (H?.classList) try {
          H.classList.remove("is-active");
        } catch {
        }
      }
    } catch (A) {
      S("[nimbi-cms] closeMobileMenu failed", A);
    }
  }
  async function ie() {
    const A = t && t instanceof HTMLElement ? t : typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      A && A.classList.add("is-inactive");
    } catch {
    }
    try {
      const M = o?.();
      M && typeof M.then == "function" && await M;
    } catch (M) {
      try {
        S("[nimbi-cms] renderByQuery failed", M);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function") requestAnimationFrame(() => {
          try {
            A && A.classList.remove("is-inactive");
          } catch {
          }
        });
        else try {
          A && A.classList.remove("is-inactive");
        } catch {
        }
      } catch {
        try {
          A && A.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function C(A) {
    try {
      let M = A && typeof A.slug == "string" ? String(A.slug) : "", H = null;
      try {
        M && M.indexOf("::") !== -1 && (H = M.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (A && A.path && typeof A.path == "string") {
          const D = re(String(A.path ?? "")), L = D.replace(/^.*\//, "");
          try {
            if (K && K.has(D)) return {
              page: K.get(D),
              hash: H
            };
            if (K && K.has(L)) return {
              page: K.get(L),
              hash: H
            };
          } catch {
          }
          try {
            if (be?.has?.(D)) return {
              page: be.get(D),
              hash: H
            };
          } catch {
          }
          try {
            const B = le(D);
            if (B) return {
              page: B,
              hash: H
            };
          } catch {
          }
        }
      } catch {
      }
      if (M && M.indexOf("::") !== -1) {
        const D = M.split("::");
        M = D[0] || "", H = D.slice(1).join("::") || null;
      }
      if (M && (M.includes(".") || M.includes("/"))) {
        const D = re(A && A.path ? String(A.path) : M), L = D.replace(/^.*\//, "");
        try {
          if (K && K.has(D)) return {
            page: K.get(D),
            hash: H
          };
          if (K && K.has(L)) return {
            page: K.get(L),
            hash: H
          };
        } catch {
        }
        try {
          let B = le(D);
          if (!B) try {
            const O = String(D ?? "").replace(/^\/+/, ""), J = O.replace(/^.*\//, "");
            for (const [U, G] of te.entries()) try {
              let V = null;
              if (typeof G == "string" ? V = re(String(G ?? "")) : G && typeof G == "object" && (G.default ? V = re(String(G.default ?? "")) : V = null), !V) continue;
              if (V === O || V.endsWith("/" + O) || O.endsWith("/" + V) || V.endsWith(J) || O.endsWith(J)) {
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
            M = ke(O || D);
          } catch {
            M = ke(D);
          }
        } catch {
          M = ke(D);
        }
      }
      return !M && A && A.path && (M = ke(re(String(A.path ?? "")))), {
        page: M,
        hash: H
      };
    } catch {
      return {
        page: A && A.slug || "",
        hash: null
      };
    }
  }
  const I = () => _ || (_ = (async () => {
    try {
      const A = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, M = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, H = typeof A == "function" ? A : Cf, D = typeof M == "function" ? M : Mf, L = [];
      try {
        i && L.push(i);
      } catch {
      }
      try {
        navigationPage && L.push(navigationPage);
      } catch {
      }
      if (l === "lazy" && typeof D == "function") try {
        const B = await D(r, c, u, L.length ? L : void 0);
        if (B && B.length) {
          try {
            try {
              Mr(B);
            } catch {
            }
          } catch {
          }
          return B;
        }
      } catch (B) {
        S("[nimbi-cms] worker builder threw", B);
      }
      return typeof H == "function" ? await H(r, c, u, L.length ? L : void 0) : [];
    } catch (A) {
      return S("[nimbi-cms] buildSearchIndex failed", A), _ = null, [];
    } finally {
      if (h) {
        try {
          h.removeAttribute("disabled");
        } catch {
        }
        try {
          w && w.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), _.then((A) => {
    try {
      try {
        F = Array.isArray(A) ? A : null;
      } catch {
        F = null;
      }
      try {
        zf(A);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                try {
                  try {
                    Mr(Array.isArray(A) ? A : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return Array.isArray(oe) ? oe : Array.isArray(F) ? F : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = Array.isArray(oe) ? oe : Array.isArray(F) ? F : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(oe) ? oe : Array.isArray(F) ? F : [];
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
            window.__nimbi_noIndexing = u;
          } catch {
          }
        }
      } catch {
      }
      const M = String((h && h.value) ?? "").trim().toLowerCase();
      if (!M || !Array.isArray(A) || !A.length) return;
      const H = A.filter((L) => L.title && L.title.toLowerCase().includes(M) || L.excerpt && L.excerpt.toLowerCase().includes(M));
      if (!H || !H.length) return;
      const D = typeof k < "u" && k ? k : typeof document < "u" ? document.getElementById("nimbi-search-results") : null;
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
        const L = document.createElement("div");
        L.className = "panel nimbi-search-panel", H.slice(0, 10).forEach((B) => {
          try {
            if (B.parentTitle) {
              const G = document.createElement("p");
              G.className = "panel-heading nimbi-search-title nimbi-search-parent", G.textContent = B.parentTitle, L.appendChild(G);
            }
            const O = document.createElement("a");
            O.className = "panel-block nimbi-search-result";
            const J = C(B);
            O.href = qe(J.page, J.hash), O.setAttribute("role", "button");
            try {
              if (B.path && typeof B.path == "string") try {
                ft(J.page, B.path);
              } catch {
              }
            } catch {
            }
            const U = document.createElement("div");
            U.className = "is-size-6 has-text-weight-semibold", U.textContent = B.title, O.appendChild(U), O.addEventListener("click", () => {
              try {
                D.style.display = "none";
              } catch {
              }
            }), L.appendChild(O);
          } catch {
          }
        }), Ti(() => {
          try {
            D.appendChild(L);
          } catch {
          }
        });
        try {
          D.style.display = "block";
        } catch {
        }
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }).finally(() => {
    (async () => {
      try {
        if (W) return;
        W = !0;
        try {
          await Vr({
            homePage: i,
            contentBase: r,
            indexDepth: c,
            noIndexing: u,
            includeAllMarkdown: !0
          });
        } catch (A) {
          S("[nimbi-cms] sitemap trigger failed", A);
        }
      } catch (A) {
        try {
          S("[nimbi-cms] sitemap dynamic import failed", A);
        } catch {
        }
      }
    })();
  }), _), j = document.createElement("nav");
  j.className = "navbar", j.setAttribute("role", "navigation"), j.setAttribute("aria-label", "main navigation");
  const T = document.createElement("div");
  T.className = "navbar-brand";
  const N = g[0], Y = document.createElement("a");
  if (Y.className = "navbar-item", N) {
    const A = N?.getAttribute?.("href") || "#";
    try {
      const M = new URL(A, location.href).searchParams.get("page"), H = M ? decodeURIComponent(M) : i;
      let D = null;
      try {
        typeof H == "string" && (/(?:\.md|\.html?)$/i.test(H) || H.includes("/")) && (D = le(H));
      } catch {
      }
      !D && typeof H == "string" && !String(H).includes(".") && (D = H), Y.href = qe(D || H), (!Y.textContent || !String(Y.textContent).trim()) && (Y.textContent = a("home"));
    } catch {
      try {
        const H = typeof i == "string" && (/(?:\.md|\.html?)$/i.test(i) || i.includes("/")) ? le(i) : typeof i == "string" && !i.includes(".") ? i : null;
        Y.href = qe(H || i);
      } catch {
        Y.href = qe(i);
      }
      Y.textContent = a("home");
    }
  } else
    Y.href = qe(i), Y.textContent = a("home");
  async function $(A) {
    try {
      if (!A || A === "none") return null;
      if (A === "favicon") try {
        const M = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
        if (!M) return null;
        const H = M?.getAttribute?.("href") || "";
        return H && /\.png(?:\?|$)/i.test(H) ? new URL(H, location.href).toString() : null;
      } catch {
        return null;
      }
      if (A === "copy-first" || A === "move-first") try {
        const M = await Ke(i, r);
        if (!M || !M.raw) return null;
        const H = at(), D = H ? H.parseFromString(M.raw, "text/html") : null, L = D ? D.querySelector("img") : null;
        if (!L) return null;
        const B = L?.getAttribute?.("src") || "";
        if (!B) return null;
        const O = new URL(B, location.href).toString();
        if (A === "move-first") try {
          document.documentElement.setAttribute("data-nimbi-logo-moved", O);
        } catch {
        }
        return O;
      } catch {
        return null;
      }
      try {
        return new URL(A, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let ne = null;
  try {
    ne = await $(d);
  } catch {
    ne = null;
  }
  if (ne) try {
    const A = document.createElement("img");
    A.className = "nimbi-navbar-logo";
    const M = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
    A.alt = M, A.title = M, A.src = ne;
    try {
      A.style.marginRight = "0.5em";
    } catch {
    }
    try {
      (!Y.textContent || !String(Y.textContent).trim()) && (Y.textContent = M);
    } catch {
    }
    try {
      Y.insertBefore(A, Y.firstChild);
    } catch {
      try {
        Y.appendChild(A);
      } catch {
      }
    }
  } catch {
  }
  T.appendChild(Y), Y.addEventListener("click", function(A) {
    const M = Y.getAttribute("href") || "";
    if (M.startsWith("?page=")) {
      A.preventDefault();
      const H = new URL(M, location.href), D = H.searchParams.get("page"), L = H.hash ? H.hash.replace(/^#/, "") : null;
      history.pushState({ page: D }, "", qe(D, L)), ie();
      try {
        he();
      } catch {
      }
    }
  });
  function le(A) {
    try {
      if (!A) return null;
      const M = re(String(A ?? ""));
      try {
        if (be?.has?.(M)) return be.get(M);
      } catch {
      }
      const H = M.replace(/^.*\//, "");
      try {
        if (be?.has?.(H)) return be.get(H);
      } catch {
      }
      try {
        for (const [D, L] of te.entries())
          if (L) {
            if (typeof L == "string") {
              if (re(L) === M) return D;
            } else if (L && typeof L == "object") {
              if (L.default && re(L.default) === M) return D;
              const B = L.langs || {};
              for (const O in B) if (B[O] && re(B[O]) === M) return D;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function ye(A, M) {
    try {
      if (!A || !A.length) return;
      const H = [];
      for (let J = 0; J < A.length; J++) try {
        const U = A[J];
        if (!U || typeof U.getAttribute != "function") continue;
        const G = U.getAttribute("href") || "";
        if (!G || Li(G)) continue;
        let V = null;
        try {
          const Ae = yt(G);
          Ae && Ae.page && (V = Ae.page);
        } catch {
        }
        if (!V) {
          const Ae = String(G ?? "").split(/[?#]/, 1), He = Ae && Ae[0] ? Ae[0] : G;
          (/\.(?:md|html?)$/i.test(He) || He.indexOf("/") !== -1) && (V = re(String(He ?? "")));
        }
        if (!V) continue;
        try {
          if (M && typeof M == "string") try {
            let Ae = new URL(M, typeof location < "u" ? location.origin : "http://localhost").pathname || "";
            if (Ae = Ae.replace(/^\/+|\/+$/g, ""), Ae) {
              let He = String(V ?? "");
              He = He.replace(/^\/+/, ""), He === Ae ? V = "" : He.startsWith(Ae + "/") ? V = He.slice(Ae.length + 1) : V = He;
            }
          } catch {
          }
        } catch {
        }
        const ae = re(String(V ?? "")), me = ae.replace(/^.*\//, "");
        let Pe = null;
        try {
          K && K.has(ae) && (Pe = K.get(ae));
        } catch {
        }
        try {
          !Pe && be?.has?.(ae) && (Pe = be.get(ae));
        } catch {
        }
        if (Pe) continue;
        let Ce = null;
        try {
          Ce = U.textContent && String(U.textContent).trim() ? String(U.textContent).trim() : null;
        } catch {
          Ce = null;
        }
        let Ne = null;
        if (Ce) Ne = ke(Ce);
        else {
          const Ae = me.replace(/\.(?:md|html?)$/i, "");
          Ne = ke(Ae || ae);
        }
        if (Ne) try {
          H.push({
            path: ae,
            candidate: Ne
          });
        } catch {
        }
      } catch {
      }
      if (!H.length) return;
      const D = 3;
      let L = 0;
      const B = async () => {
        for (; L < H.length; ) {
          const J = H[L++];
          if (!(!J || !J.path))
            try {
              const U = await Ke(J.path, M);
              if (!U || !U.raw) continue;
              let G = null;
              if (U.isHtml) try {
                const V = at(), ae = V ? V.parseFromString(U.raw, "text/html") : null, me = ae ? ae.querySelector("h1") || ae.querySelector("title") : null;
                me && me.textContent && (G = String(me.textContent).trim());
              } catch {
              }
              else try {
                const V = U.raw.match(/^#\s+(.+)$/m);
                V && V[1] && (G = String(V[1]).trim());
              } catch {
              }
              if (G) {
                const V = ke(G);
                if (V && V !== J.candidate) {
                  try {
                    ft(V, J.path);
                  } catch {
                  }
                  try {
                    K.set(J.path, V);
                  } catch {
                  }
                  try {
                    K.set(J.path.replace(/^.*\//, ""), V);
                  } catch {
                  }
                  try {
                    try {
                      if (Array.isArray(oe)) {
                        let ae = !1;
                        for (const me of oe) try {
                          if (me && me.path === J.path && me.slug) {
                            const Pe = String(me.slug).split("::").slice(1).join("::");
                            me.slug = Pe ? `${V}::${Pe}` : V, ae = !0;
                          }
                        } catch {
                        }
                        try {
                          ae && Mr(oe);
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
      for (let J = 0; J < D; J++) O.push(B());
      try {
        await Promise.all(O);
      } catch {
      }
    } catch {
    }
  }
  const fe = document.createElement("a");
  fe.className = "navbar-burger", fe.setAttribute("role", "button"), fe.setAttribute("aria-label", "menu"), fe.setAttribute("aria-expanded", "false");
  const ve = "nimbi-navbar-menu";
  fe.dataset.target = ve, fe.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', T.appendChild(fe);
  try {
    fe.addEventListener("click", (A) => {
      try {
        const M = fe.dataset && fe.dataset.target ? fe.dataset.target : null, H = M ? j && j.querySelector ? j.querySelector(`#${M}`) || (e && e.querySelector ? e.querySelector(`#${M}`) : document.getElementById(M)) : e && e.querySelector ? e.querySelector(`#${M}`) || document.getElementById(M) : typeof document < "u" ? document.getElementById(M) : null : null;
        fe.classList.contains("is-active") ? (fe.classList.remove("is-active"), fe.setAttribute("aria-expanded", "false"), H && H.classList.remove("is-active")) : (fe.classList.add("is-active"), fe.setAttribute("aria-expanded", "true"), H && H.classList.add("is-active"));
      } catch (M) {
        S("[nimbi-cms] navbar burger toggle failed", M);
      }
    });
  } catch (A) {
    S("[nimbi-cms] burger event binding failed", A);
  }
  const De = document.createElement("div");
  De.className = "navbar-menu", De.id = ve;
  const ce = document.createElement("div");
  ce.className = "navbar-start";
  let Be = null, et = null;
  if (!s)
    Be = null, h = null, b = null, k = null, E = null;
  else {
    Be = document.createElement("div"), Be.className = "navbar-end", et = document.createElement("div"), et.className = "navbar-item", h = document.createElement("input"), h.className = "input", h.type = "search", h.placeholder = a("searchPlaceholder") || "", h.id = "nimbi-search";
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
    l === "eager" && (h.disabled = !0), w = document.createElement("div"), w.className = "control", l === "eager" && w.classList.add("is-loading"), w.setAttribute("aria-live", "polite"), w.appendChild(h), et.appendChild(w), b = document.createElement("div"), b.className = "dropdown is-right", b.id = "nimbi-search-dropdown";
    const A = document.createElement("div");
    A.className = "dropdown-trigger", A.setAttribute("aria-expanded", "false"), A.appendChild(et);
    const M = document.createElement("div");
    M.className = "dropdown-menu", M.setAttribute("role", "menu"), k = document.createElement("div"), k.id = "nimbi-search-results", k.className = "dropdown-content nimbi-search-results", k.setAttribute("role", "listbox"), k.setAttribute("aria-hidden", "true"), k.setAttribute("aria-live", "polite"), k.setAttribute("aria-relevant", "all"), E = k, M.appendChild(k), b.appendChild(A), b.appendChild(M), Be.appendChild(b);
    const H = (D) => {
      if (!k) return;
      try {
        if (typeof k.replaceChildren == "function") k.replaceChildren();
        else for (; k.firstChild; ) k.removeChild(k.firstChild);
      } catch {
        try {
          k.innerHTML = "";
        } catch {
        }
      }
      let L = -1;
      function B(U) {
        try {
          const G = k.querySelector(".nimbi-search-result.is-selected");
          G && G.classList.remove("is-selected");
          const V = k.querySelectorAll(".nimbi-search-result");
          if (!V || !V.length) {
            L = -1;
            try {
              h && h.removeAttribute("aria-activedescendant");
            } catch {
            }
            return;
          }
          if (U < 0) {
            L = -1;
            try {
              h && h.removeAttribute("aria-activedescendant");
            } catch {
            }
            return;
          }
          U >= V.length && (U = V.length - 1);
          const ae = V[U];
          if (ae) {
            ae.classList.add("is-selected"), L = U;
            try {
              ae.scrollIntoView({ block: "nearest" });
            } catch {
            }
            try {
              h && ae.id && h.setAttribute("aria-activedescendant", ae.id);
            } catch {
            }
          }
        } catch {
        }
      }
      function O(U) {
        try {
          const G = U.key, V = k.querySelectorAll(".nimbi-search-result");
          if (!V || !V.length) return;
          if (G === "ArrowDown") {
            U.preventDefault(), B(L < 0 ? 0 : Math.min(V.length - 1, L + 1));
            return;
          }
          if (G === "ArrowUp") {
            U.preventDefault(), B(L <= 0 ? 0 : L - 1);
            return;
          }
          if (G === "Enter") {
            U.preventDefault();
            const ae = k.querySelector(".nimbi-search-result.is-selected") || k.querySelector(".nimbi-search-result");
            if (ae) try {
              ae.click();
            } catch {
            }
            return;
          }
          if (G === "Escape") {
            try {
              b.classList.remove("is-active");
              try {
                A.setAttribute("aria-expanded", "false");
              } catch {
              }
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              k.style.display = "none";
            } catch {
            }
            try {
              k.classList.remove("is-open");
            } catch {
            }
            try {
              k.removeAttribute("tabindex");
            } catch {
            }
            try {
              k.removeEventListener("keydown", O);
            } catch {
            }
            try {
              h && h.focus();
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", J);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function J(U) {
        try {
          if (U && U.key === "ArrowDown") {
            U.preventDefault();
            try {
              k.focus();
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
              b && b.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              k && (k.style.display = "none", k.classList.remove("is-open"), k.removeAttribute("tabindex"));
            } catch {
            }
            try {
              k && k.removeEventListener("keydown", O);
            } catch {
            }
            return;
          }
          try {
            const G = document.createElement("div");
            G.className = "panel nimbi-search-panel";
            const V = document.createElement("p");
            V.className = "panel-block nimbi-search-no-results", V.textContent = a && typeof a == "function" ? a("searchNoResults") : "No results", G.appendChild(V), Ti(() => {
              try {
                k.appendChild(G);
              } catch {
              }
            });
          } catch {
          }
          if (b) {
            b.classList.add("is-active");
            try {
              A.setAttribute("aria-expanded", "true");
            } catch {
            }
            try {
              document.documentElement.classList.add("nimbi-search-open");
            } catch {
            }
          }
          try {
            k.style.display = "block";
          } catch {
          }
          try {
            k.classList.add("is-open");
          } catch {
          }
          try {
            k.setAttribute("aria-hidden", "false");
          } catch {
          }
          try {
            k.setAttribute("tabindex", "0");
          } catch {
          }
          return;
        }
      } catch {
      }
      try {
        const U = document.createElement("div");
        U.className = "panel nimbi-search-panel";
        const G = document.createDocumentFragment();
        D.forEach((V) => {
          if (V.parentTitle) {
            const Ce = document.createElement("p");
            Ce.textContent = V.parentTitle, Ce.className = "panel-heading nimbi-search-title nimbi-search-parent", G.appendChild(Ce);
          }
          const ae = document.createElement("a");
          ae.className = "panel-block nimbi-search-result";
          const me = C(V);
          ae.href = qe(me.page, me.hash), ae.setAttribute("role", "button");
          try {
            if (V.path && typeof V.path == "string") try {
              ft(me.page, V.path);
            } catch {
            }
          } catch {
          }
          const Pe = document.createElement("div");
          Pe.className = "is-size-6 has-text-weight-semibold", Pe.textContent = V.title, ae.appendChild(Pe), ae.addEventListener("click", (Ce) => {
            try {
              try {
                Ce && Ce.preventDefault && Ce.preventDefault();
              } catch {
              }
              try {
                Ce && Ce.stopPropagation && Ce.stopPropagation();
              } catch {
              }
              if (b) {
                b.classList.remove("is-active");
                try {
                  document.documentElement.classList.remove("nimbi-search-open");
                } catch {
                }
              }
              try {
                k.style.display = "none";
                try {
                  k.setAttribute("aria-hidden", "true");
                } catch {
                }
              } catch {
              }
              try {
                k.classList.remove("is-open");
              } catch {
              }
              try {
                k.removeAttribute("tabindex");
              } catch {
              }
              try {
                k.removeEventListener("keydown", O);
              } catch {
              }
              try {
                h && h.removeEventListener("keydown", J);
              } catch {
              }
              try {
                const Ne = ae.getAttribute && ae.getAttribute("href") || "";
                let Ae = null, He = null;
                try {
                  const Ue = new URL(Ne, location.href);
                  Ae = Ue.searchParams.get("page"), He = Ue.hash ? Ue.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Ae) try {
                  history.pushState({ page: Ae }, "", qe(Ae, He));
                  try {
                    ie();
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
                window.location.href = ae.href;
              } catch {
              }
            } catch {
            }
          }), G.appendChild(ae);
        }), U.appendChild(G), Ti(() => {
          try {
            k.appendChild(U);
          } catch {
          }
        });
      } catch {
      }
      if (b) {
        b.classList.add("is-active");
        try {
          document.documentElement.classList.add("nimbi-search-open");
        } catch {
        }
      }
      try {
        k.style.display = "block";
      } catch {
      }
      try {
        k.classList.add("is-open");
      } catch {
      }
      try {
        k.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        k.addEventListener("keydown", O);
      } catch {
      }
      try {
        h && h.addEventListener("keydown", J);
      } catch {
      }
    };
    if (h) {
      const D = ef(async () => {
        const L = h || (typeof j < "u" && j && j.querySelector ? j.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null), B = String((L && L.value) ?? "").trim().toLowerCase();
        if (!B) {
          try {
            b && b.classList.remove("is-active");
          } catch {
          }
          try {
            document.documentElement.classList.remove("nimbi-search-open");
          } catch {
          }
          try {
            k && (k.style.display = "none", k.classList.remove("is-open"), k.removeAttribute("tabindex"));
          } catch {
          }
          return;
        }
        try {
          await I();
          let O = await _;
          (!Array.isArray(O) || !O.length) && (Array.isArray(window.__nimbiSearchIndex) && window.__nimbiSearchIndex.length ? O = window.__nimbiSearchIndex : Array.isArray(window.__nimbiResolvedIndex) && window.__nimbiResolvedIndex.length && (O = window.__nimbiResolvedIndex));
          const J = Array.isArray(O) ? O.filter((U) => U.title && U.title.toLowerCase().includes(B) || U.excerpt && U.excerpt.toLowerCase().includes(B)) : [];
          H(J.slice(0, 10));
        } catch (O) {
          _ = null, S("[nimbi-cms] search input handler failed", O), H([]);
        }
      }, 50);
      try {
        h.addEventListener("input", D);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        _ = I();
      } catch (D) {
        S("[nimbi-cms] eager search index init failed", D), _ = Promise.resolve([]);
      }
      _.finally(() => {
        const D = h || (typeof j < "u" && j && j.querySelector ? j.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null);
        if (D) {
          try {
            D.removeAttribute("disabled");
          } catch {
          }
          try {
            w && w.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (W) return;
            W = !0;
            const L = await _.catch(() => []);
            try {
              await Vr({
                index: Array.isArray(L) ? L : void 0,
                homePage: i,
                contentBase: r,
                indexDepth: c,
                noIndexing: u,
                includeAllMarkdown: !0
              });
            } catch (B) {
              S("[nimbi-cms] sitemap trigger failed", B);
            }
          } catch (L) {
            try {
              S("[nimbi-cms] sitemap dynamic import failed", L);
            } catch {
            }
          }
        })();
      });
    }
    try {
      z = (D) => {
        try {
          const L = D && D.target;
          if (!E || !E.classList.contains("is-open") && E.style && E.style.display !== "block" || L && (E.contains(L) || h && (L === h || h.contains && h.contains(L)))) return;
          if (b) {
            b.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            E.style.display = "none";
          } catch {
          }
          try {
            E.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      }, se(document, "click", z, !0), se(document, "touchstart", z, !0);
    } catch {
    }
  }
  const ot = document.createDocumentFragment();
  for (let A = 0; A < g.length; A++) {
    const M = g[A];
    if (A === 0) continue;
    const H = M.getAttribute("href") || "#";
    let D = H;
    const L = document.createElement("a");
    L.className = "navbar-item";
    try {
      let B = null;
      try {
        B = yt(String(H ?? ""));
      } catch {
        B = null;
      }
      let O = null, J = null;
      if (B && (B.type === "canonical" && B.page || B.type === "cosmetic" && B.page) && (O = B.page, J = B.anchor), O && (/\.(?:md|html?)$/i.test(O) || O.includes("/") ? D = O : L.href = qe(O, J)), /^[^#]*\.md(?:$|[#?])/.test(D) || D.endsWith(".md")) {
        const U = re(D).split(/::|#/, 2), G = U[0], V = U[1], ae = le(G);
        ae ? L.href = qe(ae, V) : L.href = qe(G, V);
      } else if (/\.html(?:$|[#?])/.test(D) || D.endsWith(".html")) {
        const U = re(D).split(/::|#/, 2);
        let G = U[0];
        G && !G.toLowerCase().endsWith(".html") && (G = G + ".html");
        const V = U[1], ae = le(G);
        if (ae) L.href = qe(ae, V);
        else try {
          const me = await Ke(G, r);
          if (me && me.raw) try {
            const Pe = at(), Ce = Pe ? Pe.parseFromString(me.raw, "text/html") : null, Ne = Ce ? Ce.querySelector("title") : null, Ae = Ce ? Ce.querySelector("h1") : null, He = Ne && Ne.textContent && Ne.textContent.trim() ? Ne.textContent.trim() : Ae && Ae.textContent ? Ae.textContent.trim() : null;
            if (He) {
              const Ue = ke(He);
              if (Ue) {
                try {
                  ft(Ue, G);
                } catch (Ft) {
                  S("[nimbi-cms] slugToMd/mdToSlug set failed", Ft);
                }
                L.href = qe(Ue, V);
              } else L.href = qe(G, V);
            } else L.href = qe(G, V);
          } catch {
            L.href = qe(G, V);
          }
          else L.href = D;
        } catch {
          L.href = D;
        }
      } else L.href = D;
    } catch (B) {
      S("[nimbi-cms] nav item href parse failed", B), L.href = D;
    }
    try {
      const B = M.textContent && String(M.textContent).trim() ? String(M.textContent).trim() : null;
      if (B) try {
        const O = ke(B);
        if (O) {
          const J = L.getAttribute("href") || "";
          let U = null;
          if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(J)) U = re(String(J ?? "").split(/[?#]/)[0]);
          else try {
            const G = yt(J);
            G && G.type === "canonical" && G.page && (U = re(G.page));
          } catch {
          }
          if (U) {
            let G = !1;
            try {
              if (/\.(?:html?)(?:$|[?#])/i.test(String(U ?? ""))) G = !0;
              else if (/\.(?:md)(?:$|[?#])/i.test(String(U ?? ""))) G = !1;
              else {
                const V = String(U ?? "").replace(/^\.\//, ""), ae = V.replace(/^.*\//, "");
                Qe && Qe.size && (Qe.has(V) || Qe.has(ae)) && (G = !0);
              }
            } catch {
              G = !1;
            }
            if (G) try {
              const V = re(String(U ?? "").split(/[?#]/)[0]);
              let ae = !1;
              try {
                le && typeof le == "function" && le(V) && (ae = !0);
              } catch {
              }
              try {
                ft(O, U);
              } catch {
              }
              try {
                if (V) {
                  try {
                    K.set(V, O);
                  } catch {
                  }
                  try {
                    const me = V.replace(/^.*\//, "");
                    me && K.set(me, O);
                  } catch {
                  }
                }
              } catch {
              }
              if (ae) try {
                L.href = qe(O);
              } catch {
              }
            } catch {
            }
          }
        }
      } catch (O) {
        S("[nimbi-cms] nav slug mapping failed", O);
      }
    } catch (B) {
      S("[nimbi-cms] nav slug mapping failed", B);
    }
    L.textContent = M.textContent || D, ot.appendChild(L);
  }
  try {
    ce.appendChild(ot);
  } catch {
  }
  De.appendChild(ce), Be && De.appendChild(Be), j.appendChild(T), j.appendChild(De), e.appendChild(j);
  try {
    const A = (M) => {
      try {
        const H = typeof j < "u" && j && j.querySelector ? j.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null;
        if (!H || !H.classList.contains("is-active")) return;
        const D = H && H.closest ? H.closest(".navbar") : j;
        if (D && D.contains(M.target)) return;
        he();
      } catch {
      }
    };
    se(document, "click", A, !0), se(document, "touchstart", A, !0);
  } catch {
  }
  try {
    De.addEventListener("click", (A) => {
      const M = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!M) return;
      const H = M.getAttribute("href") || "";
      try {
        const D = new URL(H, location.href), L = D.searchParams.get("page"), B = D.hash ? D.hash.replace(/^#/, "") : null;
        L && (A.preventDefault(), history.pushState({ page: L }, "", qe(L, B)), ie());
      } catch (D) {
        S("[nimbi-cms] navbar click handler failed", D);
      }
      try {
        const D = typeof j < "u" && j && j.querySelector ? j.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : null, L = D && D.dataset ? D.dataset.target : null, B = L ? j && j.querySelector ? j.querySelector(`#${L}`) || (e && e.querySelector ? e.querySelector(`#${L}`) : document.getElementById(L)) : e && e.querySelector ? e.querySelector(`#${L}`) || document.getElementById(L) : typeof document < "u" ? document.getElementById(L) : null : null;
        D && D.classList.contains("is-active") && (D.classList.remove("is-active"), D.setAttribute("aria-expanded", "false"), B && B.classList.remove("is-active"));
      } catch (D) {
        S("[nimbi-cms] mobile menu close failed", D);
      }
    });
  } catch (A) {
    S("[nimbi-cms] attach content click handler failed", A);
  }
  try {
    t.addEventListener("click", (A) => {
      const M = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!M) return;
      const H = M.getAttribute("href") || "";
      if (H && !Li(H))
        try {
          const D = new URL(H, location.href), L = D.searchParams.get("page"), B = D.hash ? D.hash.replace(/^#/, "") : null;
          L && (A.preventDefault(), history.pushState({ page: L }, "", qe(L, B)), ie());
        } catch (D) {
          S("[nimbi-cms] container click URL parse failed", D);
        }
    });
  } catch (A) {
    S("[nimbi-cms] build navbar failed", A);
  }
  return {
    navbar: j,
    linkEls: g
  };
}
try {
  document.addEventListener("input", (e) => {
    try {
      if (e && e.target && e.target.id === "nimbi-search") {
        const t = document.getElementById("nimbi-search-results");
        if (t && e.target && e.target.value) try {
          t.style.display = "block";
        } catch {
        }
      }
    } catch {
    }
  }, !0);
} catch {
}
var lt = null, Ee = null, ut = 1, Yt = (e, t) => t, zr = 0, $r = 0, ji = () => {
}, jr = 0.25;
function Df() {
  if (lt && document.contains(lt)) return lt;
  lt = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", Yt("imagePreviewTitle", "Image preview"));
  try {
    const T = document.createElement("div");
    T.className = "modal-background";
    const N = document.createElement("div");
    N.className = "modal-content";
    const Y = document.createElement("div");
    Y.className = "nimbi-image-preview__content box", Y.setAttribute("role", "document");
    const $ = document.createElement("button");
    $.className = "button is-small nimbi-image-preview__close", $.type = "button", $.setAttribute("data-nimbi-preview-close", ""), $.textContent = "✕", $.setAttribute("aria-hidden", "true");
    const ne = document.createElement("div");
    ne.className = "nimbi-image-preview__image-wrapper";
    const le = document.createElement("img");
    le.setAttribute("data-nimbi-preview-image", ""), le.alt = "", ne.appendChild(le);
    const ye = document.createElement("div");
    ye.className = "nimbi-image-preview__controls";
    const fe = document.createElement("div");
    fe.className = "nimbi-image-preview__group";
    const ve = document.createElement("button");
    ve.className = "button is-small", ve.type = "button", ve.setAttribute("data-nimbi-preview-fit", ""), ve.textContent = "⤢", ve.setAttribute("aria-hidden", "true");
    const De = document.createElement("button");
    De.className = "button is-small", De.type = "button", De.setAttribute("data-nimbi-preview-original", ""), De.textContent = "1:1", De.setAttribute("aria-hidden", "true");
    const ce = document.createElement("button");
    ce.className = "button is-small", ce.type = "button", ce.setAttribute("data-nimbi-preview-reset", ""), ce.textContent = "⟲", ce.setAttribute("aria-hidden", "true"), fe.appendChild(ve), fe.appendChild(De), fe.appendChild(ce);
    const Be = document.createElement("div");
    Be.className = "nimbi-image-preview__group";
    const et = document.createElement("button");
    et.className = "button is-small", et.type = "button", et.setAttribute("data-nimbi-preview-zoom-out", ""), et.textContent = "−", et.setAttribute("aria-hidden", "true");
    const ot = document.createElement("div");
    ot.className = "nimbi-image-preview__zoom", ot.setAttribute("data-nimbi-preview-zoom-label", ""), ot.textContent = "100%";
    const A = document.createElement("button");
    A.className = "button is-small", A.type = "button", A.setAttribute("data-nimbi-preview-zoom-in", ""), A.textContent = "＋", A.setAttribute("aria-hidden", "true"), Be.appendChild(et), Be.appendChild(ot), Be.appendChild(A), ye.appendChild(fe), ye.appendChild(Be), Y.appendChild($), Y.appendChild(ne), Y.appendChild(ye), N.appendChild(Y), e.appendChild(T), e.appendChild(N);
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
  e.addEventListener("click", (T) => {
    T.target === e && _a();
  }), e.addEventListener("wheel", (T) => {
    if (!se()) return;
    T.preventDefault();
    const N = T.deltaY < 0 ? jr : -jr;
    sn(ut + N), c(), u();
  }, { passive: !1 }), e.addEventListener("keydown", (T) => {
    if (T.key === "Escape") {
      _a();
      return;
    }
    if (ut > 1) {
      const N = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!N) return;
      const Y = 40;
      switch (T.key) {
        case "ArrowUp":
          N.scrollTop -= Y, T.preventDefault();
          break;
        case "ArrowDown":
          N.scrollTop += Y, T.preventDefault();
          break;
        case "ArrowLeft":
          N.scrollLeft -= Y, T.preventDefault();
          break;
        case "ArrowRight":
          N.scrollLeft += Y, T.preventDefault();
      }
    }
  }), document.body.appendChild(e), lt = e, Ee = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), r = e.querySelector("[data-nimbi-preview-zoom-in]"), i = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), o = e.querySelector("[data-nimbi-preview-close]"), s = e.querySelector("[data-nimbi-preview-zoom-label]"), l = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function c() {
    s && (s.textContent = `${Math.round(ut * 100)}%`);
  }
  const u = () => {
    l && (l.textContent = `${Math.round(ut * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  ji = c, r.addEventListener("click", () => {
    sn(ut + jr), c(), u();
  }), i.addEventListener("click", () => {
    sn(ut - jr), c(), u();
  }), t.addEventListener("click", () => {
    Dr(), c(), u();
  }), n.addEventListener("click", () => {
    sn(1), c(), u();
  }), a.addEventListener("click", () => {
    Dr(), c(), u();
  }), o.addEventListener("click", _a), t.title = Yt("imagePreviewFit", "Fit to screen"), n.title = Yt("imagePreviewOriginal", "Original size"), i.title = Yt("imagePreviewZoomOut", "Zoom out"), r.title = Yt("imagePreviewZoomIn", "Zoom in"), o.title = Yt("imagePreviewClose", "Close"), o.setAttribute("aria-label", Yt("imagePreviewClose", "Close"));
  let d = !1, f = 0, p = 0, m = 0, g = 0;
  const _ = /* @__PURE__ */ new Map();
  let h = 0, w = 1;
  const b = (T, N) => {
    const Y = T.x - N.x, $ = T.y - N.y;
    return Math.hypot(Y, $);
  }, k = () => {
    d = !1, _.clear(), h = 0, Ee && (Ee.classList.add("is-panning"), Ee.classList.remove("is-grabbing"));
  };
  let E = 0, z = 0, W = 0;
  const F = (T) => {
    const N = Date.now(), Y = N - E, $ = T.clientX - z, ne = T.clientY - W;
    E = N, z = T.clientX, W = T.clientY, Y < 300 && Math.hypot($, ne) < 30 && (sn(ut > 1 ? 1 : 2), c(), T.preventDefault());
  }, K = (T) => {
    sn(ut > 1 ? 1 : 2), c(), T.preventDefault();
  }, se = () => lt ? typeof lt.open == "boolean" ? lt.open : lt.classList.contains("is-active") : !1, he = (T, N, Y = 1) => {
    if (_.has(Y) && _.set(Y, {
      x: T,
      y: N
    }), _.size === 2) {
      const ye = Array.from(_.values()), fe = b(ye[0], ye[1]);
      if (h > 0) {
        const ve = fe / h;
        sn(w * ve);
      }
      return;
    }
    if (!d) return;
    const $ = Ee.closest(".nimbi-image-preview__image-wrapper");
    if (!$) return;
    const ne = T - f, le = N - p;
    $.scrollLeft = m - ne, $.scrollTop = g - le;
  }, ie = (T, N, Y = 1) => {
    if (!se()) return;
    if (_.set(Y, {
      x: T,
      y: N
    }), _.size === 2) {
      const ne = Array.from(_.values());
      h = b(ne[0], ne[1]), w = ut;
      return;
    }
    const $ = Ee.closest(".nimbi-image-preview__image-wrapper");
    $ && ($.scrollWidth > $.clientWidth || $.scrollHeight > $.clientHeight) && (d = !0, f = T, p = N, m = $.scrollLeft, g = $.scrollTop, Ee.classList.add("is-panning"), Ee.classList.remove("is-grabbing"), window.addEventListener("pointermove", C), window.addEventListener("pointerup", I), window.addEventListener("pointercancel", I));
  }, C = (T) => {
    d && (T.preventDefault(), he(T.clientX, T.clientY, T.pointerId));
  }, I = () => {
    k(), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", I), window.removeEventListener("pointercancel", I);
  };
  Ee.addEventListener("pointerdown", (T) => {
    T.preventDefault(), ie(T.clientX, T.clientY, T.pointerId);
  }), Ee.addEventListener("pointermove", (T) => {
    (d || _.size === 2) && T.preventDefault(), he(T.clientX, T.clientY, T.pointerId);
  }), Ee.addEventListener("pointerup", (T) => {
    T.preventDefault(), T.pointerType === "touch" && F(T), k();
  }), Ee.addEventListener("dblclick", K), Ee.addEventListener("pointercancel", k), Ee.addEventListener("mousedown", (T) => {
    T.preventDefault(), ie(T.clientX, T.clientY, 1);
  }), Ee.addEventListener("mousemove", (T) => {
    d && T.preventDefault(), he(T.clientX, T.clientY, 1);
  }), Ee.addEventListener("mouseup", (T) => {
    T.preventDefault(), k();
  });
  const j = e.querySelector(".nimbi-image-preview__image-wrapper");
  return j && (j.addEventListener("pointerdown", (T) => {
    if (ie(T.clientX, T.clientY, T.pointerId), T?.target?.tagName === "IMG") try {
      T.target.classList.add("is-grabbing");
    } catch {
    }
  }), j.addEventListener("pointermove", (T) => {
    he(T.clientX, T.clientY, T.pointerId);
  }), j.addEventListener("pointerup", k), j.addEventListener("pointercancel", k), j.addEventListener("mousedown", (T) => {
    if (ie(T.clientX, T.clientY, 1), T?.target?.tagName === "IMG") try {
      T.target.classList.add("is-grabbing");
    } catch {
    }
  }), j.addEventListener("mousemove", (T) => {
    he(T.clientX, T.clientY, 1);
  }), j.addEventListener("mouseup", k)), e;
}
function sn(e) {
  if (!Ee) return;
  const t = Number(e);
  ut = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const n = Ee.getBoundingClientRect(), r = zr || Ee.naturalWidth || Ee.width || n.width || 0, i = $r || Ee.naturalHeight || Ee.height || n.height || 0;
  if (r && i) {
    Ee.style.setProperty("--nimbi-preview-img-max-width", "none"), Ee.style.setProperty("--nimbi-preview-img-max-height", "none"), Ee.style.setProperty("--nimbi-preview-img-width", `${r * ut}px`), Ee.style.setProperty("--nimbi-preview-img-height", `${i * ut}px`), Ee.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      Ee.style.width = `${r * ut}px`, Ee.style.height = `${i * ut}px`, Ee.style.transform = "none";
    } catch {
    }
  } else {
    Ee.style.setProperty("--nimbi-preview-img-max-width", ""), Ee.style.setProperty("--nimbi-preview-img-max-height", ""), Ee.style.setProperty("--nimbi-preview-img-width", ""), Ee.style.setProperty("--nimbi-preview-img-height", ""), Ee.style.setProperty("--nimbi-preview-img-transform", `scale(${ut})`);
    try {
      Ee.style.transform = `scale(${ut})`;
    } catch {
    }
  }
  Ee && (Ee.classList.add("is-panning"), Ee.classList.remove("is-grabbing"));
}
function Dr() {
  if (!Ee) return;
  const e = Ee.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = zr || Ee.naturalWidth || t.width, r = $r || Ee.naturalHeight || t.height;
  if (!n || !r) return;
  const i = t.width / n, a = t.height / r, o = Math.min(i, a, 1);
  sn(Number.isFinite(o) ? o : 1);
}
function Bf(e, t = "", n = 0, r = 0) {
  const i = Df();
  ut = 1, zr = n || 0, $r = r || 0, Ee.src = e;
  try {
    if (!t) try {
      const o = new URL(e, typeof location < "u" ? location.href : "").pathname || "", s = (o.substring(o.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      t = Yt("imagePreviewDefaultAlt", s || "Image");
    } catch {
      t = Yt("imagePreviewDefaultAlt", "Image");
    }
  } catch {
  }
  Ee.alt = t, Ee.style.transform = "scale(1)";
  const a = () => {
    zr = Ee.naturalWidth || Ee.width || 0, $r = Ee.naturalHeight || Ee.height || 0;
  };
  if (a(), Dr(), ji(), requestAnimationFrame(() => {
    Dr(), ji();
  }), !zr || !$r) {
    const o = () => {
      a(), requestAnimationFrame(() => {
        Dr(), ji();
      }), Ee.removeEventListener("load", o);
    };
    Ee.addEventListener("load", o);
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
      const s = o[0], l = o[o.length - 1], c = (u) => {
        try {
          if (u.key !== "Tab") return;
          u.shiftKey ? document.activeElement === s && (u.preventDefault(), l.focus()) : document.activeElement === l && (u.preventDefault(), s.focus());
        } catch {
        }
      };
      i.addEventListener("keydown", c), i._focusTrapHandler = c;
    }
  } catch {
  }
}
function _a() {
  if (lt) {
    typeof lt.close == "function" && lt.open && lt.close(), lt.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
    try {
      lt._focusTrapHandler && (lt.removeEventListener("keydown", lt._focusTrapHandler), lt._focusTrapHandler = null);
    } catch {
    }
  }
}
function Uf(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  Yt = (p, m) => (typeof t == "function" ? t(p) : void 0) || m, jr = n, e.addEventListener("click", (p) => {
    const m = p.target;
    if (!m || m.tagName !== "IMG") return;
    const g = m;
    g.src && (g.closest("a")?.getAttribute?.("href") || Bf(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0));
  });
  let r = !1, i = 0, a = 0, o = 0, s = 0;
  const l = /* @__PURE__ */ new Map();
  let c = 0, u = 1;
  const d = (p, m) => {
    const g = p.x - m.x, _ = p.y - m.y;
    return Math.hypot(g, _);
  };
  e.addEventListener("pointerdown", (p) => {
    const m = p.target;
    if (!m || m.tagName !== "IMG") return;
    const g = m.closest("a");
    if (g && g.getAttribute("href") || !lt || !lt.open) return;
    if (l.set(p.pointerId, {
      x: p.clientX,
      y: p.clientY
    }), l.size === 2) {
      const h = Array.from(l.values());
      c = d(h[0], h[1]), u = ut;
      return;
    }
    const _ = m.closest(".nimbi-image-preview__image-wrapper");
    if (_ && !(ut <= 1)) {
      p.preventDefault(), r = !0, i = p.clientX, a = p.clientY, o = _.scrollLeft, s = _.scrollTop, m.setPointerCapture(p.pointerId);
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
      const w = Array.from(l.values()), b = d(w[0], w[1]);
      if (c > 0) {
        const k = b / c;
        sn(u * k);
      }
      return;
    }
    if (!r) return;
    p.preventDefault();
    const m = p.target;
    if (m?.closest?.("a")?.getAttribute?.("href")) return;
    const g = m.closest(".nimbi-image-preview__image-wrapper");
    if (!g) return;
    const _ = p.clientX - i, h = p.clientY - a;
    g.scrollLeft = o - _, g.scrollTop = s - h;
  });
  const f = () => {
    r = !1, l.clear(), c = 0;
    try {
      const p = document.querySelector("[data-nimbi-preview-image]");
      p && (p.classList.add("is-panning"), p.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", f), e.addEventListener("pointercancel", f);
}
function Wf(e) {
  const { contentWrap: t, navWrap: n, container: r, mountOverlay: i = null, t: a, contentBase: o, homePage: s, initialDocumentTitle: l, runHooks: c, allowEmbeddedScripts: u = !1, signal: d } = e || {};
  if (!t || !(t instanceof HTMLElement)) throw new TypeError("contentWrap must be an HTMLElement");
  let f = null;
  const p = {}, m = of(a, [{
    path: s,
    name: a("home"),
    isIndex: !0,
    children: []
  }]), g = /* @__PURE__ */ new Map(), _ = 12;
  let h = !1, w = !1;
  function b(C) {
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
  function k(C) {
    try {
      const I = String(C?.raw || ""), j = I.length;
      return `${j}:${I.slice(0, 120)}:${I.slice(Math.max(0, j - 120))}`;
    } catch {
      return "0::";
    }
  }
  function E(C) {
    const I = g.get(C);
    return I ? (g.delete(C), g.set(C, I), I) : null;
  }
  function z(C, I) {
    try {
      for (g.has(C) && g.delete(C), g.set(C, I); g.size > _; ) {
        const j = g.keys().next().value;
        g.delete(j);
      }
    } catch {
    }
  }
  async function W(C, I) {
    let j, T, N;
    try {
      ({ data: j, pagePath: T, anchor: N } = await mu(C, o));
    } catch (ce) {
      const Be = ce?.message ? String(ce.message) : "", et = (!Se || typeof Se != "string" || !Se) && /no page data/i.test(Be);
      try {
        if (et) try {
          S("[nimbi-cms] fetchPageData (expected missing)", ce);
        } catch {
        }
        else try {
          Rr("[nimbi-cms] fetchPageData failed", ce);
        } catch {
        }
      } catch {
      }
      try {
        !Se && n && b(n);
      } catch {
      }
      ho(t, a, ce);
      return;
    }
    !N && I && (N = I);
    try {
      $a(null);
    } catch (ce) {
      S("[nimbi-cms] scrollToAnchorOrTop failed", ce);
    }
    try {
      b(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const Y = `${String(T ?? "")}|||${k(j)}`, $ = E(Y);
    let ne, le, ye, fe, ve, De;
    $?.articleTemplate ? (ne = $.articleTemplate.cloneNode(!0), ye = $.tocTemplate ? $.tocTemplate.cloneNode(!0) : null, fe = ne.querySelector("h1"), ve = fe ? (fe.textContent || "").trim() : $.h1Text || "", De = $.slugKey || fe && fe.id || "", le = { meta: Object.assign({}, $.meta || {}) }) : ({ article: ne, parsed: le, toc: ye, topH1: fe, h1Text: ve, slugKey: De } = await pf(a, j, T, N, o), z(Y, {
      articleTemplate: ne.cloneNode(!0),
      tocTemplate: ye ? ye.cloneNode(!0) : null,
      meta: Object.assign({}, le?.meta || {}),
      h1Text: ve || "",
      slugKey: De || ""
    })), cu(a, l, le, ye, ne, T, N, fe, ve, De, j);
    try {
      b(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    ye && (n.appendChild(ye), xf(ye));
    try {
      await c("transformHtml", {
        article: ne,
        parsed: le,
        toc: ye,
        pagePath: T,
        anchor: N,
        topH1: fe,
        h1Text: ve,
        slugKey: De,
        data: j
      });
    } catch (ce) {
      S("[nimbi-cms] transformHtml hooks failed", ce);
    }
    try {
      if (!document.querySelector(".nimbi-skip-link")) {
        const ce = document.createElement("a");
        ce.className = "nimbi-skip-link", ce.href = "#main", ce.textContent = "Skip to content", ce.setAttribute("aria-label", "Skip to content");
        const Be = document.querySelector(".nimbi-mount") || document.querySelector(".nimbi-cms") || document.body;
        Be && Be.firstChild ? Be.insertBefore(ce, Be.firstChild) : Be && Be.appendChild(ce);
      }
    } catch {
    }
    try {
      let ce = t.querySelector("main.nimbi-main");
      ce || (ce = document.createElement("main"), ce.className = "nimbi-main", t.appendChild(ce)), ce.appendChild(ne);
    } catch {
      t.appendChild(ne);
    }
    try {
      Kl(ne);
    } catch (ce) {
      S("[nimbi-cms] observeCodeBlocks failed", ce);
    }
    try {
      gf(ne, u);
    } catch (ce) {
      S("[nimbi-cms] executeEmbeddedScripts failed", ce);
    }
    try {
      Uf(ne, { t: a });
    } catch (ce) {
      S("[nimbi-cms] attachImagePreview failed", ce);
    }
    try {
      ia(r, 100, !1), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => ia(r, 100, !1));
    } catch (ce) {
      S("[nimbi-cms] setEagerForAboveFoldImages failed", ce);
    }
    $a(N), Sf(ne, fe, {
      mountOverlay: i,
      container: r,
      navWrap: n,
      t: a
    });
    try {
      await c("onPageLoad", {
        data: j,
        pagePath: T,
        anchor: N,
        article: ne,
        toc: ye,
        topH1: fe,
        h1Text: ve,
        slugKey: De,
        contentWrap: t,
        navWrap: n
      });
    } catch (ce) {
      S("[nimbi-cms] onPageLoad hooks failed", ce);
    }
    f = T;
  }
  async function F() {
    const C = typeof performance < "u" && typeof performance.now == "function" ? performance.now() : null;
    if (h) {
      w = !0;
      return;
    }
    h = !0;
    try {
      try {
        xo("renderByQuery");
      } catch {
      }
      let I = yt(location.href);
      try {
        if (I?.type === "path" && I?.page && o) try {
          const j = typeof o == "string" ? new URL(o, location.href).pathname : "", T = String(j ?? "").replace(/^\/+|\/+$/g, ""), N = String(I.page ?? "").replace(/^\/+|\/+$/g, "");
          T && N === T && (I.page = null);
        } catch {
        }
      } catch {
      }
      if (I?.type === "path" && I?.page) try {
        let j = "?page=" + encodeURIComponent(I.page || "");
        I.params && (j += (j.includes("?") ? "&" : "?") + I.params), I.anchor && (j += "#" + encodeURIComponent(I.anchor));
        try {
          history.replaceState(history.state, "", j);
        } catch {
          try {
            history.replaceState({}, "", j);
          } catch {
          }
        }
        I = yt(location.href);
      } catch {
      }
      await W(I?.page ? I.page : s, I?.anchor ? I.anchor : null);
    } catch (I) {
      S("[nimbi-cms] renderByQuery failed", I);
      try {
        !Se && n && b(n);
      } catch {
      }
      ho(t, a, I);
    } finally {
      if (C !== null) try {
        const I = performance.now() - C;
        typeof window < "u" && window.__nimbiRenderTimings && window.__nimbiRenderTimings.push(I);
      } catch {
      }
      if (h = !1, w) {
        w = !1;
        try {
          await F();
        } catch {
        }
      }
    }
  }
  const K = (C, I, j, T) => {
    d ? C.addEventListener(I, j, {
      ...T,
      signal: d
    }) : C.addEventListener(I, j, T);
  };
  K(window, "popstate", F), K(window, "hashchange", F);
  const se = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, he = () => {
    try {
      const C = r || document.querySelector(".nimbi-cms");
      if (!C) return;
      const I = {
        top: C.scrollTop || 0,
        left: C.scrollLeft || 0
      };
      sessionStorage.setItem(se(), JSON.stringify(I));
    } catch (C) {
      if (C && C.name === "QuotaExceededError") {
        try {
          p[se()] = {
            top: (r || document.querySelector(".nimbi-cms"))?.scrollTop || 0,
            left: (r || document.querySelector(".nimbi-cms"))?.scrollLeft || 0
          };
        } catch {
        }
        return;
      }
      S("[nimbi-cms] save scroll position failed", C);
    }
  }, ie = () => {
    try {
      const C = r || document.querySelector(".nimbi-cms");
      if (!C) return;
      let I = null;
      try {
        const j = sessionStorage.getItem(se());
        j && (I = JSON.parse(j));
      } catch {
      }
      !I && p[se()] && (I = p[se()]), I && typeof I?.top == "number" && C.scrollTo({
        top: I.top,
        left: I.left || 0,
        behavior: "auto"
      });
    } catch {
    }
  };
  return K(window, "pageshow", (C) => {
    if (C.persisted) try {
      ie(), ia(r, 100, !1);
    } catch (I) {
      S("[nimbi-cms] bfcache restore failed", I);
    }
  }), K(window, "pagehide", () => {
    try {
      he();
    } catch (C) {
      S("[nimbi-cms] save scroll position failed", C);
    }
  }), {
    renderByQuery: F,
    siteNav: m,
    getCurrentPagePath: () => f
  };
}
function Ff(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location) try {
      const a = yt(window.location.href);
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
function ba(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function qf(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
var Hf = "monokai", bi = "", wi = null;
async function sd(e = {}) {
  if (!e || typeof e != "object") throw new TypeError("initCMS(options): options must be an object");
  const t = Ff();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0) try {
      S("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
    } catch {
    }
    else {
      try {
        S("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    Object.prototype.hasOwnProperty.call(n, "debugLevel") && Ol(n.debugLevel);
  } catch {
  }
  try {
    wn("[nimbi-cms] initCMS called", () => ({ options: n }));
  } catch {
  }
  t && typeof t.bulmaCustomize == "string" && t.bulmaCustomize.trim() && (n.bulmaCustomize = t.bulmaCustomize);
  let { el: r, contentPath: i = "/content", crawlMaxQueue: a = 1e3, searchIndex: o = !0, searchIndexMode: s = "eager", indexDepth: l = 1, noIndexing: c = void 0, defaultStyle: u = "light", bulmaCustomize: d = "none", lang: f = void 0, l10nFile: p = null, cacheTtlMinutes: m = 5, cacheMaxEntries: g, markdownExtensions: _, availableLanguages: h, homePage: w = null, notFoundPage: b = null, navigationPage: k = "_navigation.md", allowEmbeddedScripts: E = !1, exposeSitemap: z = !0, cspNonce: W = null } = n;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: F = "favicon" } = n, { skipRootReadme: K = !1 } = n, se = (C) => {
    try {
      const I = document.querySelector(r);
      if (I && I instanceof Element) try {
        const j = () => {
          const N = document.createElement("div");
          N.style.padding = "1rem";
          try {
            N.style.fontFamily = "system-ui, sans-serif";
          } catch {
          }
          N.style.color = "#b00", N.style.background = "#fee", N.style.border = "1px solid #b00";
          const Y = document.createElement("strong");
          Y.textContent = "NimbiCMS failed to initialize:", N.appendChild(Y);
          try {
            N.appendChild(document.createElement("br"));
          } catch {
          }
          const $ = document.createElement("pre");
          try {
            $.style.whiteSpace = "pre-wrap";
          } catch {
          }
          return $.textContent = String(C), N.appendChild($), N;
        }, T = j();
        try {
          if (typeof I.replaceChildren == "function") I.replaceChildren(T);
          else {
            for (; I.firstChild; ) I.removeChild(I.firstChild);
            I.appendChild(T);
          }
        } catch {
          try {
            for (; I.firstChild; ) I.removeChild(I.firstChild);
            I.appendChild(j());
          } catch {
          }
        }
      } catch {
      }
    } catch {
    }
  };
  if (n.contentPath != null && !qf(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !ba(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (b != null && !ba(b))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !ba(k))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r) throw new Error("el is required");
  let he = r;
  if (typeof r == "string") {
    if (he = document.querySelector(r), !he) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element)) throw new TypeError("el must be a CSS selector string or a DOM element");
  try {
    if (he && he._nimbiCmsInitialized) throw new Error("initCMS already called on this element");
  } catch (C) {
    if (C instanceof Error && /already called/.test(C.message)) throw C;
  }
  if (typeof i != "string" || !i.trim()) throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof o != "boolean") throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (s != null && s !== "eager" && s !== "lazy") throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3) throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (u !== "light" && u !== "dark" && u !== "system") throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (d != null && typeof d != "string") throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string") throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string") throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (m != null && (typeof m != "number" || !Number.isFinite(m) || m < 0)) throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (g != null && (typeof g != "number" || !Number.isInteger(g) || g < 0)) throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (_ != null && (!Array.isArray(_) || _.some((C) => !C || typeof C != "object"))) throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (h != null && (!Array.isArray(h) || h.some((C) => typeof C != "string" || !C.trim()))) throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some((C) => typeof C != "string" || !C.trim()))) throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (c = Array.isArray(c) ? Array.from(new Set(c.map((C) => {
    try {
      return re(String(C ?? ""));
    } catch {
      return "";
    }
  }).filter(Boolean))) : void 0, K != null && typeof K != "boolean") throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (E != null && typeof E != "boolean") throw new TypeError('initCMS(options): "allowEmbeddedScripts" must be a boolean when provided');
  if (n.fetchConcurrency != null && (typeof n.fetchConcurrency != "number" || !Number.isInteger(n.fetchConcurrency) || n.fetchConcurrency < 1)) throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');
  if (n.negativeFetchCacheTTL != null && (typeof n.negativeFetchCacheTTL != "number" || !Number.isFinite(n.negativeFetchCacheTTL) || n.negativeFetchCacheTTL < 0)) throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w))) throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b))) throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ie = !!o;
  try {
    No(!!K);
  } catch (C) {
    S("[nimbi-cms] setSkipRootReadme failed", C);
  }
  try {
    try {
      n?.seoMap && typeof n.seoMap == "object" && ou(n.seoMap);
    } catch {
    }
    try {
      ac();
    } catch {
    }
    try {
      W && oc(W);
    } catch {
    }
    try {
      const C = "11.12.0";
      C && sc(C, Hf);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(C) {
        try {
          const I = {
            type: "error",
            message: C?.message ? String(C.message) : "",
            filename: C?.filename ? String(C.filename) : "",
            lineno: C?.lineno ? C.lineno : null,
            colno: C?.colno ? C.colno : null,
            stack: C?.error?.stack ? C.error.stack : null,
            time: Date.now()
          };
          try {
            S("[nimbi-cms] runtime error", I.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(I);
        } catch {
        }
      }, { signal: wi.signal }), window.addEventListener("unhandledrejection", function(C) {
        try {
          const I = {
            type: "unhandledrejection",
            reason: C?.reason ? String(C.reason) : "",
            time: Date.now()
          };
          try {
            S("[nimbi-cms] unhandledrejection", I.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(I);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const C = yt(typeof window < "u" ? window.location.href : ""), I = C?.page ? C.page : w || void 0;
      try {
        au();
      } catch {
      }
      try {
        I && lu(I, bi || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        he.classList.add("nimbi-mount");
      } catch (A) {
        S("[nimbi-cms] mount element setup failed", A);
      }
      const C = document.createElement("section");
      C.className = "section";
      const I = document.createElement("div");
      I.className = "container nimbi-cms";
      const j = document.createElement("div");
      j.className = "columns";
      const T = document.createElement("div");
      T.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", T.setAttribute("role", "navigation");
      try {
        const A = typeof Jn == "function" ? Jn("navigation") : null;
        A && T.setAttribute("aria-label", A);
      } catch (A) {
        S("[nimbi-cms] set nav aria-label failed", A);
      }
      j.appendChild(T);
      const N = document.createElement("main");
      N.className = "column nimbi-content", N.setAttribute("role", "main"), j.appendChild(N), I.appendChild(j), C.appendChild(I);
      const Y = T, $ = N;
      he.appendChild(C);
      let ne = null;
      try {
        ne = he.querySelector(".nimbi-overlay"), ne || (ne = document.createElement("div"), ne.className = "nimbi-overlay", he.appendChild(ne));
      } catch (A) {
        ne = null, S("[nimbi-cms] mount overlay setup failed", A);
      }
      const le = location.pathname || "/";
      let ye;
      if (le.endsWith("/")) ye = le;
      else {
        const A = le.substring(le.lastIndexOf("/") + 1);
        A && !A.includes(".") ? ye = le + "/" : ye = le.substring(0, le.lastIndexOf("/") + 1);
      }
      try {
        bi = document.title || "";
      } catch (A) {
        bi = "", S("[nimbi-cms] read initial document title failed", A);
      }
      let fe = i;
      Object.prototype.hasOwnProperty.call(n, "contentPath");
      const ve = typeof location < "u" && location?.origin ? location.origin : "http://localhost", De = new URL(ye, ve).toString();
      (fe === "." || fe === "./") && (fe = "");
      try {
        fe = String(fe ?? "").replace(/\\/g, "/");
      } catch {
        fe = String(fe ?? "");
      }
      fe.startsWith("/") && (fe = fe.replace(/^\/+/, "")), fe && !fe.endsWith("/") && (fe = fe + "/");
      try {
        if (fe && ye && ye !== "/") {
          const A = ye.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          A && fe.startsWith(A) && (fe = fe.slice(A.length));
        }
      } catch {
      }
      try {
        if (fe) var ce = new URL(fe, De.endsWith("/") ? De : De + "/").toString();
        else var ce = De;
      } catch {
        try {
          if (fe) var ce = new URL("/" + fe, ve).toString();
          else var ce = new URL(ye, ve).toString();
        } catch {
          var ce = ve;
        }
      }
      p && await Ro(p, ye), h && Array.isArray(h) && Oo(h), f && Lo(f);
      try {
        if (typeof document < "u" && document.documentElement) {
          const A = typeof f == "string" && f.trim() ? f.trim().split("-")[0] : $t;
          try {
            document.documentElement.setAttribute("lang", A);
          } catch {
          }
          try {
            const M = new Intl.Locale(A || "en"), H = M.textInfo && M.textInfo.direction === "rtl" || [
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
            ].includes(String(A || "").split("-")[0].toLowerCase());
            document.documentElement.setAttribute("dir", H ? "rtl" : "ltr");
          } catch {
          }
        }
      } catch {
      }
      if (typeof m == "number" && m >= 0 && typeof Ps == "function" && Ps(m * 60 * 1e3), typeof g == "number" && g >= 0 && typeof Ms == "function" && Ms(g), _ && Array.isArray(_) && _.length) try {
        _.forEach((A) => {
          typeof A == "object" && Zh && typeof Pa == "function" && Pa(A);
        });
      } catch (A) {
        S("[nimbi-cms] applying markdownExtensions failed", A);
      }
      try {
        if (typeof a == "number") try {
          Vo(a);
        } catch (A) {
          S("[nimbi-cms] setDefaultCrawlMaxQueue failed", A);
        }
        if (typeof n.fetchConcurrency == "number") try {
          Ho(n.fetchConcurrency);
        } catch (A) {
          S("[nimbi-cms] setFetchConcurrency failed", A);
        }
        if (typeof n.negativeFetchCacheTTL == "number") try {
          qo(n.negativeFetchCacheTTL);
        } catch (A) {
          S("[nimbi-cms] setFetchNegativeCacheTTL failed", A);
        }
      } catch (A) {
        S("[nimbi-cms] setDefaultCrawlMaxQueue failed", A);
      }
      try {
        try {
          const A = n?.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (A && typeof A == "object") try {
            Wo(A), wn?.("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(A).length }));
          } catch (M) {
            S?.("[nimbi-cms] applying content manifest failed", M);
          }
          try {
            try {
              const M = yt(typeof window < "u" ? window.location.href : "");
              if (M) try {
                if (M.type === "cosmetic") try {
                  Si(M);
                } catch {
                }
                else if (M.type === "canonical") try {
                  Si(M);
                } catch {
                }
                else if (M.type === "path") try {
                  const H = (typeof location < "u" && location?.pathname ? String(location.pathname) : "/").replace(/\/\/+$/, ""), D = (ye || "").replace(/\/\/+$/, "");
                  let L = "";
                  try {
                    L = new URL(ce).pathname.replace(/\/\/+$/, "");
                  } catch {
                    L = "";
                  }
                  if (H === D || H === L || H === "") try {
                    Si({
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
            Xa(ce);
          } catch (M) {
            S("[nimbi-cms] setContentBase failed", M);
          }
          try {
            try {
              wn("[nimbi-cms diagnostic] after setContentBase", () => ({
                manifestKeys: Object.keys(A ?? {}).length ?? 0,
                slugToMdSize: te?.size ?? void 0,
                allMarkdownPathsLength: ht?.length ?? void 0,
                allMarkdownPathsSetSize: Qe?.size ?? void 0,
                searchIndexLength: searchIndex?.length ?? void 0
              }));
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (A) {
        S("[nimbi-cms] setContentBase failed", A);
      }
      try {
        Bo(b);
      } catch (A) {
        S("[nimbi-cms] setNotFoundPage failed", A);
      }
      try {
        if (typeof window < "u" && window.__nimbiAutoAttachSitemapUI) try {
          ya && typeof Wa == "function" && Wa(document.body, { filename: "sitemap.json" });
        } catch {
        }
      } catch {
      }
      let Be = null, et = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k) try {
          const M = [], H = [];
          try {
            k && H.push(String(k));
          } catch {
          }
          try {
            const L = String(k ?? "").replace(/^_/, "");
            L && L !== String(k) && H.push(L);
          } catch {
          }
          try {
            H.push("navigation.md");
          } catch {
          }
          try {
            H.push("assets/navigation.md");
          } catch {
          }
          const D = [];
          for (const L of H) try {
            if (!L) continue;
            const B = String(L);
            D.includes(B) || D.push(B);
          } catch {
          }
          for (const L of D) {
            M.push(L);
            try {
              if (et = await Ke(L, ce, { force: !0 }), et && et.raw) {
                try {
                  k = L;
                } catch {
                }
                try {
                  S("[nimbi-cms] fetched navigation candidate", L, "contentBase=", ce);
                } catch {
                }
                Be = await ir(et.raw || "");
                try {
                  const B = at();
                  if (B && Be && Be.html) {
                    const O = B.parseFromString(Be.html, "text/html").querySelector("a");
                    if (O) try {
                      const J = O?.getAttribute?.("href") || "", U = yt(J);
                      try {
                        S("[nimbi-cms] parsed nav first-link href", J, "->", U);
                      } catch {
                      }
                      if (U?.page && (U.type === "path" || U.type === "canonical") && (U.page.includes(".") || U.page.includes("/"))) {
                        w = U.page;
                        try {
                          S("[nimbi-cms] derived homePage from navigation", w);
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
          S("[nimbi-cms] final homePage before slugManager setHomePage", w);
        } catch {
        }
        try {
          Uo(w);
        } catch (M) {
          S("[nimbi-cms] setHomePage failed", M);
        }
        let A = !0;
        try {
          const M = yt(typeof location < "u" ? location.href : "");
          M && M.type === "cosmetic" && (typeof b > "u" || b == null) && (A = !1);
        } catch {
        }
        if (A && w) try {
          await Ke(w, ce, { force: !0 });
        } catch (M) {
          throw new Error(`Required ${w} not found at ${ce}${w}: ${M && M.message ? M.message : String(M)}`);
        }
      } catch (A) {
        throw A;
      }
      hc(u), await uc(d, ye), wi = typeof window < "u" ? new AbortController() : { signal: { abort: () => {
      } } };
      const ot = Wf({
        contentWrap: $,
        navWrap: Y,
        container: I,
        mountOverlay: ne,
        t: Jn,
        contentBase: ce,
        homePage: w,
        initialDocumentTitle: bi,
        runHooks: us,
        allowEmbeddedScripts: E,
        signal: wi.signal
      });
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiUI = ot, window.__nimbiRenderTimings || (window.__nimbiRenderTimings = []);
          } catch {
          }
          window.addEventListener("nimbi.coldRouteResolved", function(A) {
            ot?.renderByQuery?.().catch((M) => {
              S?.("[nimbi-cms] renderByQuery failed for cold-route event", M);
            });
          }), (Array.isArray(window.__nimbiColdRouteResolved) ? window.__nimbiColdRouteResolved.slice() : null)?.length && (ot?.renderByQuery?.().catch(() => {
          }), window.__nimbiColdRouteResolved = []);
        }
      } catch {
      }
      try {
        const A = document.createElement("header");
        A.className = "nimbi-site-navbar", he.insertBefore(A, C);
        let M = et, H = Be;
        H || (M = await Ke(k, ce, { force: !0 }), H = await ir(M.raw || ""));
        const { navbar: D, linkEls: L } = await $f(A, I, H.html || "", ce, w, Jn, ot.renderByQuery, ie, s, l, c, F, wi.signal);
        try {
          await us("onNavBuild", {
            navWrap: Y,
            navbar: D,
            linkEls: L,
            contentBase: ce
          });
        } catch (B) {
          S("[nimbi-cms] onNavBuild hooks failed", B);
        }
        try {
          try {
            if (L && L.length) {
              for (const B of Array.from(L || [])) try {
                const O = B?.getAttribute?.("href") || "";
                if (!O) continue;
                let J = String(O ?? "").split(/::|#/, 1)[0];
                if (J = String(J ?? "").split("?")[0], !J) continue;
                /\.(?:md|html?)$/.test(J) || (J = J + ".html");
                let U = null;
                try {
                  U = re(String(J ?? ""));
                } catch {
                  U = String(J ?? "");
                }
                const G = String(U ?? "").replace(/^.*\//, "").replace(/\?.*$/, "");
                if (!G) continue;
                try {
                  let V = null;
                  try {
                    V = ke(G.replace(/\.(?:md|html?)$/i, ""));
                  } catch {
                    V = String(G ?? "").replace(/\s+/g, "-").toLowerCase();
                  }
                  if (!V) continue;
                  let ae = V;
                  try {
                    if (te && typeof te.has == "function" && te.has(V)) {
                      const me = te.get(V);
                      let Pe = !1;
                      try {
                        if (typeof me == "string")
                          me === J && (Pe = !0);
                        else if (me && typeof me == "object") {
                          me.default === J && (Pe = !0);
                          for (const Ce of Object.keys(me.langs || {})) if (me.langs[Ce] === J) {
                            Pe = !0;
                            break;
                          }
                        }
                      } catch {
                      }
                      if (!Pe) try {
                        ae = An(V, new Set(te.keys()));
                      } catch {
                        ae = V;
                      }
                    }
                  } catch {
                  }
                  try {
                    try {
                      kt(ae, U);
                    } catch {
                    }
                    try {
                      be?.set?.(U, ae);
                    } catch {
                    }
                    try {
                      if (!Qe?.has?.(U)) try {
                        Qe?.add?.(U), Array.isArray(ht) && ht.push(U);
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
                er(ce);
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
              w && O.push(w), k && O.push(k);
              try {
                await Pf({
                  contentBase: ce,
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
              if (ya && typeof Vr == "function" && await Vr({
                includeAllMarkdown: !0,
                homePage: w,
                navigationPage: k,
                notFoundPage: b,
                contentBase: ce,
                indexDepth: l,
                noIndexing: c
              }))
                return;
            } catch {
            }
          } catch {
          }
          else if (z === !0 || typeof window < "u" && window.__nimbiExposeSitemap) try {
            if (ya && typeof Fa == "function") try {
              Fa({
                includeAllMarkdown: !0,
                homePage: w,
                navigationPage: k,
                notFoundPage: b,
                contentBase: ce,
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
            if (typeof er == "function") try {
              er(ce);
              try {
                try {
                  wn("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({
                    slugToMdSize: typeof te?.size == "number" ? te?.size : void 0,
                    allMarkdownPathsLength: Array.isArray(ht) ? ht.length : void 0,
                    allMarkdownPathsSetSize: typeof Qe?.size == "number" ? Qe?.size : void 0
                  }));
                } catch {
                }
              } catch {
              }
              try {
                const O = typeof te?.size == "number" ? te?.size : 0;
                let J = !1;
                try {
                  if (!manifest) {
                    O < 30 && (J = !0);
                    try {
                      const U = yt(typeof location < "u" ? location.href : "");
                      if (U) {
                        if (U.type === "cosmetic" && U.page) try {
                          te.has(U.page) || (J = !0);
                        } catch {
                        }
                        else if ((U.type === "path" || U.type === "canonical") && U.page) try {
                          const G = re(U.page);
                          !be?.has?.(G) && !Qe?.has?.(G) && (J = !0);
                        } catch {
                        }
                      }
                    } catch {
                    }
                  }
                } catch {
                }
                if (J) {
                  let U = null;
                  try {
                    U = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                  } catch {
                    U = null;
                  }
                  if (Array.isArray(U) && U.length) {
                    let G = 0;
                    for (const V of U) try {
                      if (!V || !V.slug) continue;
                      const ae = String(V.slug).split("::")[0];
                      if (te.has(ae)) continue;
                      let me = V.sourcePath || V.path || null;
                      if (!me && Array.isArray(U)) {
                        const Ce = (U || []).find((Ne) => Ne && Ne.slug === V.slug);
                        Ce && Ce.path && (me = Ce.path);
                      }
                      if (!me) continue;
                      try {
                        me = String(me);
                      } catch {
                        continue;
                      }
                      let Pe = null;
                      try {
                        const Ce = ce && typeof ce == "string" ? ce : typeof location < "u" && location.origin ? location.origin + "/" : "";
                        try {
                          const Ne = new URL(me, Ce), Ae = new URL(Ce);
                          if (Ne.origin === Ae.origin) {
                            const He = Ae.pathname || "/";
                            let Ue = Ne.pathname || "";
                            Ue.startsWith(He) && (Ue = Ue.slice(He.length)), Ue.startsWith("/") && (Ue = Ue.slice(1)), Pe = re(Ue);
                          } else Pe = re(Ne.pathname || "");
                        } catch {
                          Pe = re(me);
                        }
                      } catch {
                        Pe = re(me);
                      }
                      if (!Pe) continue;
                      Pe = String(Pe).split(/[?#]/)[0], Pe = re(Pe);
                      try {
                        kt(ae, Pe);
                      } catch {
                      }
                      G++;
                    } catch {
                    }
                    if (G) {
                      try {
                        wn("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({
                          added: G,
                          total: typeof te?.size == "number" ? te?.size : void 0
                        }));
                      } catch {
                      }
                      try {
                        er(ce);
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
              S("[nimbi-cms] refreshIndexPaths after nav build failed", O);
            }
          } catch {
          }
          const B = () => {
            const O = A?.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A?.offsetHeight || 0;
            if (O > 0) {
              try {
                he.style.setProperty("--nimbi-site-navbar-height", `${O}px`);
              } catch (J) {
                S("[nimbi-cms] set CSS var failed", J);
              }
              try {
                I.style.paddingTop = "";
              } catch (J) {
                S("[nimbi-cms] set container paddingTop failed", J);
              }
              try {
                const J = he?.getBoundingClientRect && Math.round(he.getBoundingClientRect().height) || he?.clientHeight || 0;
                if (J > 0) {
                  const U = Math.max(0, J - O);
                  try {
                    I.style.setProperty("--nimbi-cms-height", `${U}px`);
                  } catch (G) {
                    S("[nimbi-cms] set --nimbi-cms-height failed", G);
                  }
                } else try {
                  I.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                } catch (U) {
                  S("[nimbi-cms] set --nimbi-cms-height failed", U);
                }
              } catch (J) {
                S("[nimbi-cms] compute container height failed", J);
              }
              try {
                A.style.setProperty("--nimbi-site-navbar-height", `${O}px`);
              } catch (J) {
                S("[nimbi-cms] set navbar CSS var failed", J);
              }
            }
          };
          B();
          try {
            if (typeof ResizeObserver < "u") {
              const O = new ResizeObserver(() => B());
              try {
                O.observe(A);
              } catch (J) {
                S("[nimbi-cms] ResizeObserver.observe failed", J);
              }
            }
          } catch (O) {
            S("[nimbi-cms] ResizeObserver setup failed", O);
          }
        } catch (B) {
          S("[nimbi-cms] compute navbar height failed", B);
        }
      } catch (A) {
        S("[nimbi-cms] build navigation failed", A);
      }
      try {
        const A = "1.1.0", M = (B) => {
          const O = document.createElement("a");
          O.className = "nimbi-version-label tag is-small", O.textContent = `nimbiCMS v. ${A}`, O.href = B || "#", O.target = "_blank", O.rel = "noopener noreferrer nofollow", O.setAttribute("aria-label", `nimbiCMS version ${A}`), O.style.visibility = "hidden", O.style.opacity = "0", O.style.pointerEvents = "none";
          try {
            To(O);
          } catch {
          }
          try {
            he.appendChild(O);
            const J = () => {
              try {
                O.style.visibility = "", O.style.opacity = "", O.style.pointerEvents = "";
              } catch {
              }
            };
            try {
              setTimeout(J, 3e3);
            } catch {
              J();
            }
          } catch (J) {
            S("[nimbi-cms] append version label failed", J);
          }
        }, H = "https://abelvm.github.io/nimbiCMS/", D = (() => {
          try {
            return new URL(H).toString();
          } catch {
          }
          return "#";
        })(), L = () => {
          try {
            M(D);
          } catch (B) {
            S("[nimbi-cms] building version label failed", B);
          }
        };
        try {
          let B = !1;
          const O = () => {
            B || (B = !0, L());
          }, J = (U) => {
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
          J("pointerdown"), J("keydown"), J("touchstart"), J("wheel");
        } catch (B) {
          S("[nimbi-cms] version label defer failed", B), L();
        }
      } catch (A) {
        S("[nimbi-cms] version label setup failed", A);
      }
    })();
  } catch (C) {
    throw se(C), C;
  }
}
async function od() {
  try {
    if ("1.1.0".trim()) return "1.1.0";
  } catch {
  }
  return "0.0.0";
}
export {
  vo as BAD_LANGUAGES,
  ze as SUPPORTED_HLJS_MAP,
  Yf as _clearHooks,
  qa as addHook,
  sd as default,
  uc as ensureBulma,
  od as getVersion,
  sd as initCMS,
  Ro as loadL10nFile,
  Ao as loadSupportedLanguages,
  Kl as observeCodeBlocks,
  Zf as onNavBuild,
  Vf as onPageLoad,
  Wr as registerLanguage,
  us as runHooks,
  Qf as setHighlightTheme,
  Lo as setLang,
  hc as setStyle,
  Jf as setThemeVars,
  Jn as t,
  Xf as transformHtml
};
