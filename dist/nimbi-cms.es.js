let Er = 0;
const wi = /* @__PURE__ */ Object.create(null);
function _i(e) {
  try {
    const t = Number(e);
    Er = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    Er = 0;
  }
}
function Xt(e = 1) {
  try {
    return Number(Er) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function qr() {
  return Xt(1);
}
function Xn(...e) {
  try {
    if (!Xt(1) || !console || typeof console.error != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.error(...t);
  } catch {
  }
}
function _(...e) {
  try {
    if (!Xt(2) || !console || typeof console.warn != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.warn(...t);
  } catch {
  }
}
function Tt(...e) {
  try {
    if (!Xt(3) || !console || typeof console.info != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.info(...t);
  } catch {
  }
}
function It(...e) {
  try {
    if (!Xt(3) || !console || typeof console.log != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.log(...t);
  } catch {
  }
}
function Xi(e) {
  try {
    if (!qr()) return;
    const t = String(e || "");
    if (!t) return;
    wi[t] = (wi[t] || 0) + 1;
  } catch {
  }
}
function Qi(e) {
  try {
    if (typeof globalThis > "u" || !globalThis.__nimbiCMSDebug) return;
    const t = String(e || "");
    if (!t) return;
    try {
      globalThis.__nimbiCMSDebug[t] = (globalThis.__nimbiCMSDebug[t] || 0) + 1;
    } catch {
    }
  } catch {
  }
}
const Sn = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Fr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Sn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  Sn[e].push(t);
}
function Wl(e) {
  Fr("onPageLoad", e);
}
function Zl(e) {
  Fr("onNavBuild", e);
}
function Gl(e) {
  Fr("transformHtml", e);
}
async function ki(e, t) {
  const n = Sn[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      try {
        _("[nimbi-cms] runHooks callback failed", r);
      } catch {
      }
    }
}
function Xl() {
  Object.keys(Sn).forEach((e) => {
    Sn[e].length = 0;
  });
}
function Ki(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var yr, xi;
function fs() {
  if (xi) return yr;
  xi = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((I) => {
      const V = x[I], we = typeof V;
      (we === "object" || we === "function") && !Object.isFrozen(V) && e(V);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(I) {
      I.data === void 0 && (I.data = {}), this.data = I.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...I) {
    const V = /* @__PURE__ */ Object.create(null);
    for (const we in x)
      V[we] = x[we];
    return I.forEach(function(we) {
      for (const Ue in we)
        V[Ue] = we[Ue];
    }), /** @type {T} */
    V;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: I }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const V = x.split(".");
      return [
        `${I}${V.shift()}`,
        ...V.map((we, Ue) => `${we}${"_".repeat(Ue + 1)}`)
      ].join(" ");
    }
    return `${I}${x}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(I, V) {
      this.buffer = "", this.classPrefix = V.classPrefix, I.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(I) {
      this.buffer += n(I);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(I) {
      if (!a(I)) return;
      const V = s(
        I.scope,
        { prefix: this.classPrefix }
      );
      this.span(V);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(I) {
      a(I) && (this.buffer += r);
    }
    /**
     * returns the accumulated buffer
    */
    value() {
      return this.buffer;
    }
    // helpers
    /**
     * Builds a span element
     *
     * @param {string} className */
    span(I) {
      this.buffer += `<span class="${I}">`;
    }
  }
  const o = (x = {}) => {
    const I = { children: [] };
    return Object.assign(I, x), I;
  };
  class h {
    constructor() {
      this.rootNode = o(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(I) {
      this.top.children.push(I);
    }
    /** @param {string} scope */
    openNode(I) {
      const V = o({ scope: I });
      this.add(V), this.stack.push(V);
    }
    closeNode() {
      if (this.stack.length > 1)
        return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    /**
     * @typedef { import("./html_renderer").Renderer } Renderer
     * @param {Renderer} builder
     */
    walk(I) {
      return this.constructor._walk(I, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(I, V) {
      return typeof V == "string" ? I.addText(V) : V.children && (I.openNode(V), V.children.forEach((we) => this._walk(I, we)), I.closeNode(V)), I;
    }
    /**
     * @param {Node} node
     */
    static _collapse(I) {
      typeof I != "string" && I.children && (I.children.every((V) => typeof V == "string") ? I.children = [I.children.join("")] : I.children.forEach((V) => {
        h._collapse(V);
      }));
    }
  }
  class c extends h {
    /**
     * @param {*} options
     */
    constructor(I) {
      super(), this.options = I;
    }
    /**
     * @param {string} text
     */
    addText(I) {
      I !== "" && this.add(I);
    }
    /** @param {string} scope */
    startScope(I) {
      this.openNode(I);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(I, V) {
      const we = I.root;
      V && (we.scope = `language:${V}`), this.add(we);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function d(x) {
    return y("(?=", x, ")");
  }
  function f(x) {
    return y("(?:", x, ")*");
  }
  function p(x) {
    return y("(?:", x, ")?");
  }
  function y(...x) {
    return x.map((V) => u(V)).join("");
  }
  function g(x) {
    const I = x[x.length - 1];
    return typeof I == "object" && I.constructor === Object ? (x.splice(x.length - 1, 1), I) : {};
  }
  function m(...x) {
    return "(" + (g(x).capture ? "" : "?:") + x.map((we) => u(we)).join("|") + ")";
  }
  function b(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function w(x, I) {
    const V = x && x.exec(I);
    return V && V.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: I }) {
    let V = 0;
    return x.map((we) => {
      V += 1;
      const Ue = V;
      let We = u(we), se = "";
      for (; We.length > 0; ) {
        const ae = k.exec(We);
        if (!ae) {
          se += We;
          break;
        }
        se += We.substring(0, ae.index), We = We.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? se += "\\" + String(Number(ae[1]) + Ue) : (se += ae[0], ae[0] === "(" && V++);
      }
      return se;
    }).map((we) => `(${we})`).join(I);
  }
  const v = /\b\B/, E = "[a-zA-Z]\\w*", O = "[a-zA-Z_]\\w*", H = "\\b\\d+(\\.\\d+)?", U = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", P = "\\b(0b[01]+)", K = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Z = (x = {}) => {
    const I = /^#![ ]*\//;
    return x.binary && (x.begin = y(
      I,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: I,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (V, we) => {
        V.index !== 0 && we.ignoreMatch();
      }
    }, x);
  }, ie = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, q = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [ie]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [ie]
  }, F = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, D = function(x, I, V = {}) {
    const we = i(
      {
        scope: "comment",
        begin: x,
        end: I,
        contains: []
      },
      V
    );
    we.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Ue = m(
      // list of common 1 and 2 letter words in English
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      // note: this is not an exhaustive list of contractions, just popular ones
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      // contractions - can't we'd they're let's, etc
      /[A-Za-z]+[-][a-z]+/,
      // `no-way`, etc.
      /[A-Za-z][a-z]{2,}/
      // allow capitalized words at beginning of sentences
    );
    return we.contains.push(
      {
        // TODO: how to include ", (, ) without breaking grammars that use these for
        // comment delimiters?
        // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
        // ---
        // this tries to find sequences of 3 english words in a row (without any
        // "programming" type syntax) this gives us a strong signal that we've
        // TRULY found a comment - vs perhaps scanning with the wrong language.
        // It's possible to find something that LOOKS like the start of the
        // comment - but then if there is no readable text - good chance it is a
        // false match and not a comment.
        //
        // for a visual example please see:
        // https://github.com/highlightjs/highlight.js/issues/2827
        begin: y(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          Ue,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), we;
  }, le = D("//", "$"), te = D("/\\*", "\\*/"), ce = D("#", "$"), _e = {
    scope: "number",
    begin: H,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: U,
    relevance: 0
  }, He = {
    scope: "number",
    begin: P,
    relevance: 0
  }, xe = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      ie,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [ie]
      }
    ]
  }, De = {
    scope: "title",
    begin: E,
    relevance: 0
  }, T = {
    scope: "title",
    begin: O,
    relevance: 0
  }, N = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + O,
    relevance: 0
  };
  var C = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: q,
    BACKSLASH_ESCAPE: ie,
    BINARY_NUMBER_MODE: He,
    BINARY_NUMBER_RE: P,
    COMMENT: D,
    C_BLOCK_COMMENT_MODE: te,
    C_LINE_COMMENT_MODE: le,
    C_NUMBER_MODE: ve,
    C_NUMBER_RE: U,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (I, V) => {
            V.data._beginMatch = I[1];
          },
          /** @type {ModeCallback} */
          "on:end": (I, V) => {
            V.data._beginMatch !== I[1] && V.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ce,
    IDENT_RE: E,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: N,
    NUMBER_MODE: _e,
    NUMBER_RE: H,
    PHRASAL_WORDS_MODE: F,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: xe,
    RE_STARTERS_RE: K,
    SHEBANG: Z,
    TITLE_MODE: De,
    UNDERSCORE_IDENT_RE: O,
    UNDERSCORE_TITLE_MODE: T
  });
  function R(x, I) {
    x.input[x.index - 1] === "." && I.ignoreMatch();
  }
  function $(x, I) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function Q(x, I) {
    I && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = R, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function z(x, I) {
    Array.isArray(x.illegal) && (x.illegal = m(...x.illegal));
  }
  function j(x, I) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function M(x, I) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const B = (x, I) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const V = Object.assign({}, x);
    Object.keys(x).forEach((we) => {
      delete x[we];
    }), x.keywords = V.keywords, x.begin = y(V.beforeMatch, d(V.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(V, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete V.beforeMatch;
  }, Y = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    // common variable name
    "list",
    // common variable name
    "value"
    // common variable name
  ], G = "keyword";
  function me(x, I, V = G) {
    const we = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? Ue(V, x.split(" ")) : Array.isArray(x) ? Ue(V, x) : Object.keys(x).forEach(function(We) {
      Object.assign(
        we,
        me(x[We], I, We)
      );
    }), we;
    function Ue(We, se) {
      I && (se = se.map((ae) => ae.toLowerCase())), se.forEach(function(ae) {
        const be = ae.split("|");
        we[be[0]] = [We, Ce(be[0], be[1])];
      });
    }
  }
  function Ce(x, I) {
    return I ? Number(I) : ye(x) ? 0 : 1;
  }
  function ye(x) {
    return Y.includes(x.toLowerCase());
  }
  const ge = {}, Me = (x) => {
    console.error(x);
  }, Qe = (x, ...I) => {
    console.log(`WARN: ${x}`, ...I);
  }, je = (x, I) => {
    ge[`${x}/${I}`] || (console.log(`Deprecated as of ${x}. ${I}`), ge[`${x}/${I}`] = !0);
  }, yt = new Error();
  function rn(x, I, { key: V }) {
    let we = 0;
    const Ue = x[V], We = {}, se = {};
    for (let ae = 1; ae <= I.length; ae++)
      se[ae + we] = Ue[ae], We[ae + we] = !0, we += b(I[ae - 1]);
    x[V] = se, x[V]._emit = We, x[V]._multi = !0;
  }
  function vt(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Me("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), yt;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Me("beginScope must be object"), yt;
      rn(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function qa(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Me("skip, excludeEnd, returnEnd not compatible with endScope: {}"), yt;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Me("endScope must be object"), yt;
      rn(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Fa(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Da(x) {
    Fa(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), vt(x), qa(x);
  }
  function Ua(x) {
    function I(se, ae) {
      return new RegExp(
        u(se),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class V {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(ae, be) {
        be.position = this.position++, this.matchIndexes[this.matchAt] = be, this.regexes.push([be, ae]), this.matchAt += b(ae) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ae = this.regexes.map((be) => be[1]);
        this.matcherRe = I(S(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const be = this.matcherRe.exec(ae);
        if (!be)
          return null;
        const Ke = be.findIndex((an, hr) => hr > 0 && an !== void 0), Ze = this.matchIndexes[Ke];
        return be.splice(0, Ke), Object.assign(be, Ze);
      }
    }
    class we {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const be = new V();
        return this.rules.slice(ae).forEach(([Ke, Ze]) => be.addRule(Ke, Ze)), be.compile(), this.multiRegexes[ae] = be, be;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(ae, be) {
        this.rules.push([ae, be]), be.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(ae) {
        const be = this.getMatcher(this.regexIndex);
        be.lastIndex = this.lastIndex;
        let Ke = be.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ke && Ke.index === this.lastIndex)) {
          const Ze = this.getMatcher(0);
          Ze.lastIndex = this.lastIndex + 1, Ke = Ze.exec(ae);
        }
        return Ke && (this.regexIndex += Ke.position + 1, this.regexIndex === this.count && this.considerAll()), Ke;
      }
    }
    function Ue(se) {
      const ae = new we();
      return se.contains.forEach((be) => ae.addRule(be.begin, { rule: be, type: "begin" })), se.terminatorEnd && ae.addRule(se.terminatorEnd, { type: "end" }), se.illegal && ae.addRule(se.illegal, { type: "illegal" }), ae;
    }
    function We(se, ae) {
      const be = (
        /** @type CompiledMode */
        se
      );
      if (se.isCompiled) return be;
      [
        $,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        j,
        Da,
        B
      ].forEach((Ze) => Ze(se, ae)), x.compilerExtensions.forEach((Ze) => Ze(se, ae)), se.__beforeBegin = null, [
        Q,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        z,
        // default to 1 relevance if not specified
        M
      ].forEach((Ze) => Ze(se, ae)), se.isCompiled = !0;
      let Ke = null;
      return typeof se.keywords == "object" && se.keywords.$pattern && (se.keywords = Object.assign({}, se.keywords), Ke = se.keywords.$pattern, delete se.keywords.$pattern), Ke = Ke || /\w+/, se.keywords && (se.keywords = me(se.keywords, x.case_insensitive)), be.keywordPatternRe = I(Ke, !0), ae && (se.begin || (se.begin = /\B|\b/), be.beginRe = I(be.begin), !se.end && !se.endsWithParent && (se.end = /\B|\b/), se.end && (be.endRe = I(be.end)), be.terminatorEnd = u(be.end) || "", se.endsWithParent && ae.terminatorEnd && (be.terminatorEnd += (se.end ? "|" : "") + ae.terminatorEnd)), se.illegal && (be.illegalRe = I(
        /** @type {RegExp | string} */
        se.illegal
      )), se.contains || (se.contains = []), se.contains = [].concat(...se.contains.map(function(Ze) {
        return Wa(Ze === "self" ? se : Ze);
      })), se.contains.forEach(function(Ze) {
        We(
          /** @type Mode */
          Ze,
          be
        );
      }), se.starts && We(se.starts, ae), be.matcher = Ue(be), be;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), We(
      /** @type Mode */
      x
    );
  }
  function oi(x) {
    return x ? x.endsWithParent || oi(x.starts) : !1;
  }
  function Wa(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(I) {
      return i(x, { variants: null }, I);
    })), x.cachedVariants ? x.cachedVariants : oi(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var Za = "11.11.1";
  class Ga extends Error {
    constructor(I, V) {
      super(I), this.name = "HTMLInjectionError", this.html = V;
    }
  }
  const ur = n, li = i, ci = /* @__PURE__ */ Symbol("nomatch"), Xa = 7, ui = function(x) {
    const I = /* @__PURE__ */ Object.create(null), V = /* @__PURE__ */ Object.create(null), we = [];
    let Ue = !0;
    const We = "Could not find the language '{}', did you forget to load/include a language module?", se = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let ae = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: c
    };
    function be(X) {
      return ae.noHighlightRe.test(X);
    }
    function Ke(X) {
      let he = X.className + " ";
      he += X.parentNode ? X.parentNode.className : "";
      const Le = ae.languageDetectRe.exec(he);
      if (Le) {
        const Oe = Ct(Le[1]);
        return Oe || (Qe(We.replace("{}", Le[1])), Qe("Falling back to no-highlight mode for this block.", X)), Oe ? Le[1] : "no-highlight";
      }
      return he.split(/\s+/).find((Oe) => be(Oe) || Ct(Oe));
    }
    function Ze(X, he, Le) {
      let Oe = "", Ge = "";
      typeof he == "object" ? (Oe = X, Le = he.ignoreIllegals, Ge = he.language) : (je("10.7.0", "highlight(lang, code, ...args) has been deprecated."), je("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Ge = X, Oe = he), Le === void 0 && (Le = !0);
      const gt = {
        code: Oe,
        language: Ge
      };
      $n("before:highlight", gt);
      const Mt = gt.result ? gt.result : an(gt.language, gt.code, Le);
      return Mt.code = gt.code, $n("after:highlight", Mt), Mt;
    }
    function an(X, he, Le, Oe) {
      const Ge = /* @__PURE__ */ Object.create(null);
      function gt(ne, ue) {
        return ne.keywords[ue];
      }
      function Mt() {
        if (!ke.keywords) {
          Ve.addText(Be);
          return;
        }
        let ne = 0;
        ke.keywordPatternRe.lastIndex = 0;
        let ue = ke.keywordPatternRe.exec(Be), Se = "";
        for (; ue; ) {
          Se += Be.substring(ne, ue.index);
          const Ie = wt.case_insensitive ? ue[0].toLowerCase() : ue[0], Je = gt(ke, Ie);
          if (Je) {
            const [At, hs] = Je;
            if (Ve.addText(Se), Se = "", Ge[Ie] = (Ge[Ie] || 0) + 1, Ge[Ie] <= Xa && (On += hs), At.startsWith("_"))
              Se += ue[0];
            else {
              const ds = wt.classNameAliases[At] || At;
              bt(ue[0], ds);
            }
          } else
            Se += ue[0];
          ne = ke.keywordPatternRe.lastIndex, ue = ke.keywordPatternRe.exec(Be);
        }
        Se += Be.substring(ne), Ve.addText(Se);
      }
      function In() {
        if (Be === "") return;
        let ne = null;
        if (typeof ke.subLanguage == "string") {
          if (!I[ke.subLanguage]) {
            Ve.addText(Be);
            return;
          }
          ne = an(ke.subLanguage, Be, !0, bi[ke.subLanguage]), bi[ke.subLanguage] = /** @type {CompiledMode} */
          ne._top;
        } else
          ne = dr(Be, ke.subLanguage.length ? ke.subLanguage : null);
        ke.relevance > 0 && (On += ne.relevance), Ve.__addSublanguage(ne._emitter, ne.language);
      }
      function lt() {
        ke.subLanguage != null ? In() : Mt(), Be = "";
      }
      function bt(ne, ue) {
        ne !== "" && (Ve.startScope(ue), Ve.addText(ne), Ve.endScope());
      }
      function pi(ne, ue) {
        let Se = 1;
        const Ie = ue.length - 1;
        for (; Se <= Ie; ) {
          if (!ne._emit[Se]) {
            Se++;
            continue;
          }
          const Je = wt.classNameAliases[ne[Se]] || ne[Se], At = ue[Se];
          Je ? bt(At, Je) : (Be = At, Mt(), Be = ""), Se++;
        }
      }
      function gi(ne, ue) {
        return ne.scope && typeof ne.scope == "string" && Ve.openNode(wt.classNameAliases[ne.scope] || ne.scope), ne.beginScope && (ne.beginScope._wrap ? (bt(Be, wt.classNameAliases[ne.beginScope._wrap] || ne.beginScope._wrap), Be = "") : ne.beginScope._multi && (pi(ne.beginScope, ue), Be = "")), ke = Object.create(ne, { parent: { value: ke } }), ke;
      }
      function mi(ne, ue, Se) {
        let Ie = w(ne.endRe, Se);
        if (Ie) {
          if (ne["on:end"]) {
            const Je = new t(ne);
            ne["on:end"](ue, Je), Je.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; ne.endsParent && ne.parent; )
              ne = ne.parent;
            return ne;
          }
        }
        if (ne.endsWithParent)
          return mi(ne.parent, ue, Se);
      }
      function ss(ne) {
        return ke.matcher.regexIndex === 0 ? (Be += ne[0], 1) : (mr = !0, 0);
      }
      function os(ne) {
        const ue = ne[0], Se = ne.rule, Ie = new t(Se), Je = [Se.__beforeBegin, Se["on:begin"]];
        for (const At of Je)
          if (At && (At(ne, Ie), Ie.isMatchIgnored))
            return ss(ue);
        return Se.skip ? Be += ue : (Se.excludeBegin && (Be += ue), lt(), !Se.returnBegin && !Se.excludeBegin && (Be = ue)), gi(Se, ne), Se.returnBegin ? 0 : ue.length;
      }
      function ls(ne) {
        const ue = ne[0], Se = he.substring(ne.index), Ie = mi(ke, ne, Se);
        if (!Ie)
          return ci;
        const Je = ke;
        ke.endScope && ke.endScope._wrap ? (lt(), bt(ue, ke.endScope._wrap)) : ke.endScope && ke.endScope._multi ? (lt(), pi(ke.endScope, ne)) : Je.skip ? Be += ue : (Je.returnEnd || Je.excludeEnd || (Be += ue), lt(), Je.excludeEnd && (Be = ue));
        do
          ke.scope && Ve.closeNode(), !ke.skip && !ke.subLanguage && (On += ke.relevance), ke = ke.parent;
        while (ke !== Ie.parent);
        return Ie.starts && gi(Ie.starts, ne), Je.returnEnd ? 0 : ue.length;
      }
      function cs() {
        const ne = [];
        for (let ue = ke; ue !== wt; ue = ue.parent)
          ue.scope && ne.unshift(ue.scope);
        ne.forEach((ue) => Ve.openNode(ue));
      }
      let Nn = {};
      function yi(ne, ue) {
        const Se = ue && ue[0];
        if (Be += ne, Se == null)
          return lt(), 0;
        if (Nn.type === "begin" && ue.type === "end" && Nn.index === ue.index && Se === "") {
          if (Be += he.slice(ue.index, ue.index + 1), !Ue) {
            const Ie = new Error(`0 width match regex (${X})`);
            throw Ie.languageName = X, Ie.badRule = Nn.rule, Ie;
          }
          return 1;
        }
        if (Nn = ue, ue.type === "begin")
          return os(ue);
        if (ue.type === "illegal" && !Le) {
          const Ie = new Error('Illegal lexeme "' + Se + '" for mode "' + (ke.scope || "<unnamed>") + '"');
          throw Ie.mode = ke, Ie;
        } else if (ue.type === "end") {
          const Ie = ls(ue);
          if (Ie !== ci)
            return Ie;
        }
        if (ue.type === "illegal" && Se === "")
          return Be += `
`, 1;
        if (gr > 1e5 && gr > ue.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Be += Se, Se.length;
      }
      const wt = Ct(X);
      if (!wt)
        throw Me(We.replace("{}", X)), new Error('Unknown language: "' + X + '"');
      const us = Ua(wt);
      let pr = "", ke = Oe || us;
      const bi = {}, Ve = new ae.__emitter(ae);
      cs();
      let Be = "", On = 0, Bt = 0, gr = 0, mr = !1;
      try {
        if (wt.__emitTokens)
          wt.__emitTokens(he, Ve);
        else {
          for (ke.matcher.considerAll(); ; ) {
            gr++, mr ? mr = !1 : ke.matcher.considerAll(), ke.matcher.lastIndex = Bt;
            const ne = ke.matcher.exec(he);
            if (!ne) break;
            const ue = he.substring(Bt, ne.index), Se = yi(ue, ne);
            Bt = ne.index + Se;
          }
          yi(he.substring(Bt));
        }
        return Ve.finalize(), pr = Ve.toHTML(), {
          language: X,
          value: pr,
          relevance: On,
          illegal: !1,
          _emitter: Ve,
          _top: ke
        };
      } catch (ne) {
        if (ne.message && ne.message.includes("Illegal"))
          return {
            language: X,
            value: ur(he),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: ne.message,
              index: Bt,
              context: he.slice(Bt - 100, Bt + 100),
              mode: ne.mode,
              resultSoFar: pr
            },
            _emitter: Ve
          };
        if (Ue)
          return {
            language: X,
            value: ur(he),
            illegal: !1,
            relevance: 0,
            errorRaised: ne,
            _emitter: Ve,
            _top: ke
          };
        throw ne;
      }
    }
    function hr(X) {
      const he = {
        value: ur(X),
        illegal: !1,
        relevance: 0,
        _top: se,
        _emitter: new ae.__emitter(ae)
      };
      return he._emitter.addText(X), he;
    }
    function dr(X, he) {
      he = he || ae.languages || Object.keys(I);
      const Le = hr(X), Oe = he.filter(Ct).filter(fi).map(
        (lt) => an(lt, X, !1)
      );
      Oe.unshift(Le);
      const Ge = Oe.sort((lt, bt) => {
        if (lt.relevance !== bt.relevance) return bt.relevance - lt.relevance;
        if (lt.language && bt.language) {
          if (Ct(lt.language).supersetOf === bt.language)
            return 1;
          if (Ct(bt.language).supersetOf === lt.language)
            return -1;
        }
        return 0;
      }), [gt, Mt] = Ge, In = gt;
      return In.secondBest = Mt, In;
    }
    function Qa(X, he, Le) {
      const Oe = he && V[he] || Le;
      X.classList.add("hljs"), X.classList.add(`language-${Oe}`);
    }
    function fr(X) {
      let he = null;
      const Le = Ke(X);
      if (be(Le)) return;
      if ($n(
        "before:highlightElement",
        { el: X, language: Le }
      ), X.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", X);
        return;
      }
      if (X.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(X)), ae.throwUnescapedHTML))
        throw new Ga(
          "One of your code blocks includes unescaped HTML.",
          X.innerHTML
        );
      he = X;
      const Oe = he.textContent, Ge = Le ? Ze(Oe, { language: Le, ignoreIllegals: !0 }) : dr(Oe);
      X.innerHTML = Ge.value, X.dataset.highlighted = "yes", Qa(X, Le, Ge.language), X.result = {
        language: Ge.language,
        // TODO: remove with version 11.0
        re: Ge.relevance,
        relevance: Ge.relevance
      }, Ge.secondBest && (X.secondBest = {
        language: Ge.secondBest.language,
        relevance: Ge.secondBest.relevance
      }), $n("after:highlightElement", { el: X, result: Ge, text: Oe });
    }
    function Ka(X) {
      ae = li(ae, X);
    }
    const Ya = () => {
      Pn(), je("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Va() {
      Pn(), je("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let hi = !1;
    function Pn() {
      function X() {
        Pn();
      }
      if (document.readyState === "loading") {
        hi || window.addEventListener("DOMContentLoaded", X, !1), hi = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(fr);
    }
    function Ja(X, he) {
      let Le = null;
      try {
        Le = he(x);
      } catch (Oe) {
        if (Me("Language definition for '{}' could not be registered.".replace("{}", X)), Ue)
          Me(Oe);
        else
          throw Oe;
        Le = se;
      }
      Le.name || (Le.name = X), I[X] = Le, Le.rawDefinition = he.bind(null, x), Le.aliases && di(Le.aliases, { languageName: X });
    }
    function es(X) {
      delete I[X];
      for (const he of Object.keys(V))
        V[he] === X && delete V[he];
    }
    function ts() {
      return Object.keys(I);
    }
    function Ct(X) {
      return X = (X || "").toLowerCase(), I[X] || I[V[X]];
    }
    function di(X, { languageName: he }) {
      typeof X == "string" && (X = [X]), X.forEach((Le) => {
        V[Le.toLowerCase()] = he;
      });
    }
    function fi(X) {
      const he = Ct(X);
      return he && !he.disableAutodetect;
    }
    function ns(X) {
      X["before:highlightBlock"] && !X["before:highlightElement"] && (X["before:highlightElement"] = (he) => {
        X["before:highlightBlock"](
          Object.assign({ block: he.el }, he)
        );
      }), X["after:highlightBlock"] && !X["after:highlightElement"] && (X["after:highlightElement"] = (he) => {
        X["after:highlightBlock"](
          Object.assign({ block: he.el }, he)
        );
      });
    }
    function rs(X) {
      ns(X), we.push(X);
    }
    function is(X) {
      const he = we.indexOf(X);
      he !== -1 && we.splice(he, 1);
    }
    function $n(X, he) {
      const Le = X;
      we.forEach(function(Oe) {
        Oe[Le] && Oe[Le](he);
      });
    }
    function as(X) {
      return je("10.7.0", "highlightBlock will be removed entirely in v12.0"), je("10.7.0", "Please use highlightElement now."), fr(X);
    }
    Object.assign(x, {
      highlight: Ze,
      highlightAuto: dr,
      highlightAll: Pn,
      highlightElement: fr,
      // TODO: Remove with v12 API
      highlightBlock: as,
      configure: Ka,
      initHighlighting: Ya,
      initHighlightingOnLoad: Va,
      registerLanguage: Ja,
      unregisterLanguage: es,
      listLanguages: ts,
      getLanguage: Ct,
      registerAliases: di,
      autoDetection: fi,
      inherit: li,
      addPlugin: rs,
      removePlugin: is
    }), x.debugMode = function() {
      Ue = !1;
    }, x.safeMode = function() {
      Ue = !0;
    }, x.versionString = Za, x.regex = {
      concat: y,
      lookahead: d,
      either: m,
      optional: p,
      anyNumberOfTimes: f
    };
    for (const X in C)
      typeof C[X] == "object" && e(C[X]);
    return Object.assign(x, C), x;
  }, Qt = ui({});
  return Qt.newInstance = () => ui({}), yr = Qt, Qt.HighlightJS = Qt, Qt.default = Qt, yr;
}
var ps = /* @__PURE__ */ fs();
const ze = /* @__PURE__ */ Ki(ps);
class rr {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(t = {}) {
    const { maxSize: n = 0, ttlMs: i = 0, onEvict: r = null } = t || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(n) || 0), this._ttlMs = Math.max(0, Number(i) || 0), this._onEvict = typeof r == "function" ? r : null;
  }
  get size() {
    return this._map.size;
  }
  /**
   * Check if key exists and is not expired.
   * @param {*} key
   * @returns {boolean}
   */
  has(t) {
    const n = this._map.get(t);
    return n ? this._ttlMs && Date.now() - (n.ts || 0) >= this._ttlMs ? (this._evictKey(t, n), !1) : (this._map.delete(t), this._map.set(t, n), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(t) {
    const n = this._map.get(t);
    if (n) {
      if (this._ttlMs && Date.now() - (n.ts || 0) >= this._ttlMs) {
        this._evictKey(t, n);
        return;
      }
      return this._map.delete(t), this._map.set(t, n), n.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(t, n) {
    if (this._map.has(t) && this._map.delete(t), this._map.set(t, { value: n, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
      for (; this._map.size > this._maxSize; ) {
        const i = this._map.keys().next().value, r = this._map.get(i);
        if (this._map.delete(i), this._onEvict)
          try {
            this._onEvict(i, r && r.value);
          } catch {
          }
      }
    return this;
  }
  /**
   * Delete key from cache.
   * @param {*} key
   * @returns {boolean}
   */
  delete(t) {
    return this._map.delete(t);
  }
  /**
   * Clear the cache and call eviction callback for each entry.
   */
  clear() {
    if (this._onEvict)
      for (const [t, n] of this._map.entries())
        try {
          this._onEvict(t, n && n.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(t, n) {
    try {
      this._map.delete(t);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(t, n && n.value);
    } catch {
    }
  }
}
const br = new rr({ maxSize: 500 });
let gs = 300 * 1e3;
async function Dr(e, t) {
  try {
    if (!e) return null;
    const n = Date.now();
    let i = br.get(e);
    if (i && i.ok === !1 && n - (i.ts || 0) >= gs && (br.delete(e), i = void 0), i) {
      if (i.module) return i.module;
      if (i.promise)
        try {
          return await i.promise;
        } catch {
          return null;
        }
    }
    const r = { promise: null, module: null, ok: null, ts: Date.now() };
    br.set(e, r), r.promise = (async () => {
      try {
        return await t();
      } catch {
        return null;
      }
    })();
    try {
      const a = await r.promise;
      return r.module = a, r.ok = !!a, r.ts = Date.now(), a;
    } catch {
      return r.module = null, r.ok = !1, r.ts = Date.now(), null;
    }
  } catch {
    return null;
  }
}
async function ms(e) {
  return await Dr(e, async () => {
    try {
      return await import(e);
    } catch {
      return null;
    }
  });
}
const ys = "11.11.1", Ee = /* @__PURE__ */ new Map(), bs = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ut = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
ut.html = "xml";
ut.xhtml = "xml";
ut.markup = "xml";
const Yi = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Pt = null, ws = null;
async function Vi(e = bs) {
  if (e)
    return Pt || (Pt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let h = 0; h < i.length; h++)
          if (/\|\s*Language\s*\|/i.test(i[h])) {
            r = h;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((h) => h.trim().toLowerCase());
        let s = a.findIndex((h) => /alias|aliases|equivalent|alt|alternates?/i.test(h));
        s === -1 && (s = 1);
        let l = a.findIndex((h) => /file|filename|module|module name|module-name|short|slug/i.test(h));
        if (l === -1) {
          const h = a.findIndex((c) => /language/i.test(c));
          l = h !== -1 ? h : 0;
        }
        let o = [];
        for (let h = r + 1; h < i.length; h++) {
          const c = i[h].trim();
          if (!c || !c.startsWith("|")) break;
          const u = c.replace(/^\||\|$/g, "").split("|").map((g) => g.trim());
          if (u.every((g) => /^-+$/.test(g))) continue;
          const d = u;
          if (!d.length) continue;
          const p = (d[l] || d[0] || "").toString().trim().toLowerCase();
          if (!p || /^-+$/.test(p)) continue;
          Ee.set(p, p);
          const y = d[s] || "";
          if (y) {
            const g = String(y).split(",").map((m) => m.replace(/`/g, "").trim()).filter(Boolean);
            if (g.length) {
              const b = g[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              b && /[a-z0-9]/i.test(b) && (Ee.set(b, b), o.push(b));
            }
          }
        }
        try {
          const h = [];
          for (const c of o) {
            const u = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? h.push(u) : Ee.delete(c);
          }
          o = h;
        } catch (h) {
          _("[codeblocksManager] cleanup aliases failed", h);
        }
        try {
          let h = 0;
          for (const c of Array.from(Ee.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              Ee.delete(c), h++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const d = Ee.get(c);
                Ee.delete(c), Ee.set(u, d);
              } else
                Ee.delete(c), h++;
            }
          }
          for (const [c, u] of Array.from(Ee.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (Ee.delete(c), h++);
          try {
            const c = ":---------------------";
            Ee.has(c) && (Ee.delete(c), h++);
          } catch (c) {
            _("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(Ee.keys()).sort();
          } catch (c) {
            _("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (h) {
          _("[codeblocksManager] ignored error", h);
        }
      } catch (t) {
        _("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Pt);
}
const sn = /* @__PURE__ */ new Set();
async function vn(e, t) {
  if (Pt || (async () => {
    try {
      await Vi();
    } catch (r) {
      _("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Pt)
    try {
      await Pt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Yi.has(n)) return !1;
  if (Ee.size && !Ee.has(n)) {
    const r = ut;
    if (!r[n] && !r[e])
      return !1;
  }
  if (sn.has(e)) return !0;
  const i = ut;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let l = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    Ee.size && (l = l.filter((c) => {
      if (Ee.has(c)) return !0;
      const u = ut[c];
      return !!(u && Ee.has(u));
    }));
    let o = null, h = null;
    for (const c of l)
      try {
        if (o = await Dr(c, async () => {
          try {
            try {
              try {
                return await import(
                  /* @vite-ignore */
                  `highlight.js/lib/languages/${c}.js`
                );
              } catch {
                return await import(
                  /* @vite-ignore */
                  `highlight.js/lib/languages/${c}`
                );
              }
            } catch {
              try {
                return await import(`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`);
              } catch {
                try {
                  return await import(`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`);
                } catch {
                  return null;
                }
              }
            }
          } catch {
            return null;
          }
        }), o) {
          const u = o.default || o;
          try {
            const d = Ee.size && Ee.get(e) || c || e;
            return ze.registerLanguage(d, u), sn.add(d), d !== e && (ze.registerLanguage(e, u), sn.add(e)), !0;
          } catch (d) {
            h = d;
          }
        } else
          try {
            if (Ee.has(c) || Ee.has(e)) {
              const u = () => ({});
              try {
                ze.registerLanguage(c, u), sn.add(c);
              } catch {
              }
              try {
                c !== e && (ze.registerLanguage(e, u), sn.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        h = u;
      }
    if (h)
      throw h;
    return !1;
  } catch {
    return !1;
  }
}
let Bn = null;
function _s(e = document) {
  Pt || (async () => {
    try {
      await Vi();
    } catch (a) {
      _("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = ut, i = Bn || (typeof IntersectionObserver > "u" ? null : (Bn = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (h) {
        _("[codeblocksManager] observer unobserve failed", h);
      }
      (async () => {
        try {
          const h = o.getAttribute && o.getAttribute("class") || o.className || "", c = h.match(/language-([a-zA-Z0-9_+-]+)/) || h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const u = (c[1] || "").toLowerCase(), d = t[u] || u, f = Ee.size && (Ee.get(d) || Ee.get(String(d).toLowerCase())) || d;
            try {
              await vn(f);
            } catch (p) {
              _("[codeblocksManager] registerLanguage failed", p);
            }
            try {
              try {
                const p = o.textContent || o.innerText || "";
                p != null && (o.textContent = p);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              ze.highlightElement(o);
            } catch (p) {
              _("[codeblocksManager] hljs.highlightElement failed", p);
            }
          } else
            try {
              const u = o.textContent || "";
              try {
                if (ze && typeof ze.getLanguage == "function" && ze.getLanguage("plaintext")) {
                  const d = ze.highlight(u, { language: "plaintext" });
                  if (d && d.value)
                    try {
                      if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                        const f = document.createRange().createContextualFragment(d.value);
                        if (typeof o.replaceChildren == "function") o.replaceChildren(...Array.from(f.childNodes));
                        else {
                          for (; o.firstChild; ) o.removeChild(o.firstChild);
                          o.appendChild(f);
                        }
                      } else
                        o.innerHTML = d.value;
                    } catch {
                      try {
                        o.innerHTML = d.value;
                      } catch {
                      }
                    }
                }
              } catch {
                try {
                  ze.highlightElement(o);
                } catch (f) {
                  _("[codeblocksManager] fallback highlightElement failed", f);
                }
              }
            } catch (u) {
              _("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (h) {
          _("[codeblocksManager] observer entry processing failed", h);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Bn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), h = t[o] || o, c = Ee.size && (Ee.get(h) || Ee.get(String(h).toLowerCase())) || h;
          try {
            await vn(c);
          } catch (u) {
            _("[codeblocksManager] registerLanguage failed (no observer)", u);
          }
        }
        try {
          try {
            const o = a.textContent || a.innerText || "";
            o != null && (a.textContent = o);
          } catch {
          }
          try {
            a && a.dataset && a.dataset.highlighted && delete a.dataset.highlighted;
          } catch {
          }
          ze.highlightElement(a);
        } catch (o) {
          _("[codeblocksManager] hljs.highlightElement failed (no observer)", o);
        }
      } catch (s) {
        _("[codeblocksManager] loadSupportedLanguages fallback ignored error", s);
      }
    });
    return;
  }
  r.forEach((a) => {
    try {
      i.observe(a);
    } catch (s) {
      _("[codeblocksManager] observe failed", s);
    }
  });
}
function Ql(e, { useCdn: t = !0 } = {}) {
  const n = document.querySelector("link[data-hl-theme]"), i = n && n.getAttribute ? n.getAttribute("data-hl-theme") : null, r = e == null ? "default" : String(e), a = r && String(r).toLowerCase() || "";
  if (a === "default" || a === "monokai") {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
    return;
  }
  if (i && i.toLowerCase() === a) return;
  if (!t) {
    try {
      _("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${ys}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let jt = "light";
function ks(e, t = {}) {
  if (document.querySelector(`link[href="${e}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = e, Object.entries(t).forEach(([i, r]) => n.setAttribute(i, r)), document.head.appendChild(n), t["data-bulmaswatch-theme"])
    try {
      if (n.getAttribute("data-bulmaswatch-observer")) return;
      let i = Number(n.getAttribute("data-bulmaswatch-move-count") || 0), r = !1;
      const a = new MutationObserver(() => {
        try {
          if (r) return;
          const l = n.parentNode;
          if (!l || l.lastElementChild === n) return;
          if (i >= 1e3) {
            n.setAttribute("data-bulmaswatch-move-stopped", "1");
            return;
          }
          r = !0;
          try {
            l.appendChild(n);
          } catch {
          }
          i += 1, n.setAttribute("data-bulmaswatch-move-count", String(i)), r = !1;
        } catch {
        }
      });
      try {
        a.observe(document.head, { childList: !0 }), n.setAttribute("data-bulmaswatch-observer", "1"), n.setAttribute("data-bulmaswatch-move-count", String(i));
      } catch {
      }
      const s = document.head;
      s && s.lastElementChild !== n && s.appendChild(n);
    } catch {
    }
}
function Si() {
  try {
    const e = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
    for (const t of e) t && t.parentNode && t.parentNode.removeChild(t);
  } catch {
  }
  try {
    const e = Array.from(document.querySelectorAll("style[data-bulma-override]"));
    for (const t of e) t && t.parentNode && t.parentNode.removeChild(t);
  } catch {
  }
}
async function xs(e = "none", t = "/") {
  try {
    It("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      const r = [
        location && location.protocol && location.protocol === "file:" ? "https://unpkg.com/bulma/css/bulma.min.css" : "//unpkg.com/bulma/css/bulma.min.css",
        "https://unpkg.com/bulma/css/bulma.min.css"
      ];
      let a = !1;
      for (const s of r)
        try {
          if (document.querySelector(`link[href="${s}"]`)) {
            a = !0;
            break;
          }
        } catch {
        }
      if (!a) {
        const s = r[0], l = document.createElement("link");
        l.rel = "stylesheet", l.href = s, l.setAttribute("data-bulma-base", "1");
        const o = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        o && o.parentNode ? o.parentNode.insertBefore(l, o) : document.head.appendChild(l);
      }
    } catch {
    }
    try {
      const r = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
      for (const a of r)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    try {
      const r = Array.from(document.querySelectorAll("style[data-bulma-override]"));
      for (const a of r)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], i = Array.from(new Set(n));
  if (e === "local") {
    if (Si(), document.querySelector("style[data-bulma-override]")) return;
    for (const r of i)
      try {
        const a = await fetch(r, { method: "GET" });
        if (a.ok) {
          const s = await a.text(), l = document.createElement("style");
          l.setAttribute("data-bulma-override", r), l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + s)), document.head.appendChild(l);
          return;
        }
      } catch (a) {
        _("[bulmaManager] fetch local bulma candidate failed", a);
      }
    return;
  }
  try {
    const r = String(e).trim();
    if (!r) return;
    Si();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ks(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    _("[bulmaManager] ensureBulma failed", r);
  }
}
function Ss(e) {
  jt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        jt === "dark" ? n.setAttribute("data-theme", "dark") : jt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      jt === "dark" ? n.setAttribute("data-theme", "dark") : jt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Kl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      _("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Ji(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (jt === "dark" ? t.setAttribute("data-theme", "dark") : jt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const ea = {
  en: {
    navigation: "Navigation",
    onThisPage: "On this page",
    home: "Home",
    scrollToTop: "Scroll to top",
    readingTime: "{minutes} min read",
    searchPlaceholder: "Search…",
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
    imagePreviewTitle: "Visualização da imagem",
    imagePreviewFit: "Ajustar à tela",
    imagePreviewOriginal: "Tamanho original",
    imagePreviewZoomOut: "Diminuir",
    imagePreviewZoomIn: "Aumentar",
    imagePreviewClose: "Fechar"
  }
}, Jt = JSON.parse(JSON.stringify(ea));
let Qn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Qn = String(e).split("-")[0].toLowerCase();
}
ea[Qn] || (Qn = "en");
let Nt = Qn;
function un(e, t = {}) {
  const n = Jt[Nt] || Jt.en;
  let i = n && n[e] ? n[e] : Jt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function ta(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Jt[a] = Object.assign({}, Jt[a] || {}, r[a]);
  } catch {
  }
}
function na(e) {
  const t = String(e).split("-")[0].toLowerCase();
  Nt = Jt[t] ? t : "en";
}
const vs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Nt;
  },
  loadL10nFile: ta,
  setLang: na,
  t: un
}, Symbol.toStringTag, { value: "Module" }));
function As(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function vi(e, t = null, n = void 0) {
  let r = "#/" + As(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = it(location.href);
        s && s.params && (a = s.params);
      } catch {
      }
    if (a) {
      const s = typeof a == "string" && a.startsWith("?") ? a.slice(1) : a;
      try {
        const l = new URLSearchParams(s);
        l.delete("page");
        const o = l.toString();
        o && (r += "?" + o);
      } catch {
        const o = String(s || "").replace(/^page=[^&]*&?/, "");
        o && (r += "?" + o);
      }
    }
  } catch {
  }
  return r;
}
function it(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const h = t.hash.replace(/^#/, "");
        if (h.includes("&")) {
          const c = h.split("&");
          r = c.shift() || null, a = c.join("&");
        } else
          r = h || null;
      }
      const s = new URLSearchParams(t.search);
      s.delete("page");
      const o = [s.toString(), a].filter(Boolean).join("&");
      return { type: "canonical", page: decodeURIComponent(n), anchor: r, params: o };
    }
    const i = t.hash ? decodeURIComponent(t.hash.replace(/^#/, "")) : "";
    if (i && i.startsWith("/")) {
      let r = i, a = "";
      if (r.indexOf("?") !== -1) {
        const h = r.split("?");
        r = h.shift() || "", a = h.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const h = s.split("#");
        s = h.shift() || "", l = h.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
let jn = typeof DOMParser < "u" ? new DOMParser() : null;
function qe() {
  return jn || (typeof DOMParser < "u" ? (jn = new DOMParser(), jn) : null);
}
async function An(e, t, n = 4) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new Array(e.length);
  let r = 0;
  const a = [], s = Math.max(1, Number(n) || 1);
  async function l() {
    for (; ; ) {
      const o = r++;
      if (o >= e.length) return;
      try {
        i[o] = await t(e[o], o);
      } catch {
        i[o] = void 0;
      }
    }
  }
  for (let o = 0; o < Math.min(s, e.length); o++) a.push(l());
  return await Promise.all(a), i;
}
const Es = `/**
 * @module worker/slugWorker
 */
import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

/**
 * Worker entrypoint for slug-related background tasks.
 */

/**
 * Worker \`onmessage\` handler for slug-related background tasks.
 * @param {MessageEvent} ev - Message event; \`ev.data\` should be the request
 * (e.g. \`{ type: 'buildSearchIndex', id, contentBase }\` or \`{ type: 'crawlForSlug', id, slug, base?, maxQueue? }\`).
 * @returns {Promise<void>} Posts \`{id, result}\` or \`{id, error}\` back to the caller.
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'buildSearchIndex') {
      const { id, contentBase, indexDepth, noIndexing } = msg
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing)
        postMessage({ id, result: res })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
    if (msg.type === 'crawlForSlug') {
      const { id, slug, base, maxQueue } = msg
      try {
        const res = await crawlForSlug(slug, base, maxQueue)
        postMessage({ id, result: res === undefined ? null : res })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process slug-worker messages outside of a Worker.
 * @param {Object} msg - Message object for slug worker (see onmessage shapes above).
 * @returns {Promise<Object>} Response object matching worker posts (\`{id, result}\` or \`{id, error}\`).
 */
export async function handleSlugWorkerMessage(msg) {
  try {
    if (msg.type === 'buildSearchIndex') {
      const { id, contentBase, indexDepth, noIndexing } = msg
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing)
        return { id, result: res }
      } catch (e) { return { id, error: String(e) } }
    }
    if (msg.type === 'crawlForSlug') {
      const { id, slug, base, maxQueue } = msg
      try {
        const res = await crawlForSlug(slug, base, maxQueue)
        return { id, result: res === undefined ? null : res }
      } catch (e) { return { id, error: String(e) } }
    }
    return { id: msg && msg.id, error: 'unsupported message' }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`;
function Cs(e, t = "worker") {
  let n = null;
  function i(...o) {
    try {
      _(...o);
    } catch {
    }
  }
  function r() {
    if (!n)
      try {
        const o = e();
        n = o || null, o && o.addEventListener("error", () => {
          try {
            n === o && (n = null, o.terminate && o.terminate());
          } catch (h) {
            i("[" + t + "] worker termination failed", h);
          }
        });
      } catch (o) {
        n = null, i("[" + t + "] worker init failed", o);
      }
    return n;
  }
  function a() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (o) {
      i("[" + t + "] worker termination failed", o);
    }
  }
  function s(o, h = 1e4) {
    return new Promise((c, u) => {
      const d = r();
      if (!d) return u(new Error("worker unavailable"));
      const f = String(Math.random()), p = Object.assign({}, o, { id: f });
      let y = null;
      const g = () => {
        y && clearTimeout(y), d.removeEventListener("message", m), d.removeEventListener("error", b);
      }, m = (w) => {
        const k = w.data || {};
        k.id === f && (g(), k.error ? u(new Error(k.error)) : c(k.result));
      }, b = (w) => {
        g(), i("[" + t + "] worker error event", w);
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (k) {
          i("[" + t + "] worker termination failed", k);
        }
        u(new Error(w && w.message || "worker error"));
      };
      y = setTimeout(() => {
        g(), i("[" + t + "] worker timed out");
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (w) {
          i("[" + t + "] worker termination on timeout failed", w);
        }
        u(new Error("worker timeout"));
      }, h), d.addEventListener("message", m), d.addEventListener("error", b);
      try {
        d.postMessage(p);
      } catch (w) {
        g(), u(w);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function ra(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...p) {
    try {
      _(...p);
    } catch {
    }
  }
  function s(p) {
    if (!i[p])
      try {
        const y = e();
        i[p] = y || null, y && y.addEventListener("error", () => {
          try {
            i[p] === y && (i[p] = null, y.terminate && y.terminate());
          } catch (g) {
            a("[" + t + "] worker termination failed", g);
          }
        });
      } catch (y) {
        i[p] = null, a("[" + t + "] worker init failed", y);
      }
    return i[p];
  }
  const l = new Array(n).fill(0), o = new Array(n).fill(null), h = 30 * 1e3;
  function c(p) {
    try {
      l[p] = Date.now(), o[p] && (clearTimeout(o[p]), o[p] = null), o[p] = setTimeout(() => {
        try {
          i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
        } catch (y) {
          a("[" + t + "] idle termination failed", y);
        }
        o[p] = null;
      }, h);
    } catch {
    }
  }
  function u() {
    for (let p = 0; p < i.length; p++) {
      const y = s(p);
      if (y) return y;
    }
    return null;
  }
  function d() {
    for (let p = 0; p < i.length; p++)
      try {
        i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
      } catch (y) {
        a("[" + t + "] worker termination failed", y);
      }
  }
  function f(p, y = 1e4) {
    return new Promise((g, m) => {
      const b = r++ % i.length, w = (k) => {
        const S = (b + k) % i.length, v = s(S);
        if (!v)
          return k + 1 < i.length ? w(k + 1) : m(new Error("worker pool unavailable"));
        const E = String(Math.random()), O = Object.assign({}, p, { id: E });
        let H = null;
        const U = () => {
          H && clearTimeout(H), v.removeEventListener("message", P), v.removeEventListener("error", K);
        }, P = (Z) => {
          const ie = Z.data || {};
          ie.id === E && (U(), ie.error ? m(new Error(ie.error)) : g(ie.result));
        }, K = (Z) => {
          U(), a("[" + t + "] worker error event", Z);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (ie) {
            a("[" + t + "] worker termination failed", ie);
          }
          m(new Error(Z && Z.message || "worker error"));
        };
        H = setTimeout(() => {
          U(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (Z) {
            a("[" + t + "] worker termination on timeout failed", Z);
          }
          m(new Error("worker timeout"));
        }, y), v.addEventListener("message", P), v.addEventListener("error", K);
        try {
          c(S), v.postMessage(O);
        } catch (Z) {
          U(), m(Z);
        }
      };
      w(0);
    });
  }
  return { get: u, send: f, terminate: d };
}
function Ms(e, t, n = "worker") {
  return Cs(() => {
    try {
      const a = Dt(e);
      if (a)
        try {
          if (!(typeof process < "u" && process.env && process.env.VITEST)) return a;
        } catch {
          return a;
        }
    } catch {
    }
    if (typeof t != "function") return null;
    const r = { message: [], error: [] };
    return {
      addEventListener(a, s) {
        r[a] || (r[a] = []), r[a].push(s);
      },
      removeEventListener(a, s) {
        if (!r[a]) return;
        const l = r[a].indexOf(s);
        l !== -1 && r[a].splice(l, 1);
      },
      postMessage(a) {
        setTimeout(async () => {
          try {
            const l = { data: await t(a) };
            (r.message || []).forEach((o) => o(l));
          } catch (s) {
            const l = { data: { id: a && a.id, error: String(s) } };
            (r.message || []).forEach((o) => o(l));
          }
        }, 0);
      },
      terminate() {
        Object.keys(r).forEach((a) => r[a].length = 0);
      }
    };
  }, n);
}
function Dt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Dt._blobUrlCache || (Dt._blobUrlCache = new rr({ maxSize: 200, onEvict: (i, r) => {
          try {
            typeof URL < "u" && r && URL.revokeObjectURL(r);
          } catch {
          }
        } }));
        const t = Dt._blobUrlCache;
        let n = t.get(e);
        if (!n) {
          const i = new Blob([e], { type: "application/javascript" });
          n = URL.createObjectURL(i), t.set(e, n);
        }
        return new Worker(n, { type: "module" });
      } catch (t) {
        try {
          _("[worker-manager] createWorkerFromRaw failed", t);
        } catch {
        }
      }
  } catch (t) {
    try {
      _("[worker-manager] createWorkerFromRaw failed", t);
    } catch {
    }
  }
  return null;
}
function Ls() {
  return typeof requestIdleCallback == "function" ? new Promise((e) => {
    try {
      requestIdleCallback(e, { timeout: 50 });
    } catch {
      setTimeout(e, 0);
    }
  }) : new Promise((e) => setTimeout(e, 0));
}
async function Rt(e, t = 50) {
  try {
    if (!e || !t) return;
    e % t === 0 && await Ls();
  } catch {
  }
}
const rt = /* @__PURE__ */ new Set();
function Ut(e) {
  if (Ts(), rt.clear(), Array.isArray(Ne) && Ne.length)
    for (const t of Ne)
      t && rt.add(t);
  else
    for (const t of Pe)
      t && rt.add(t);
  Ai(ee), Ai(W), Ut._refreshed = !0;
}
function Ai(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && rt.add(t);
}
function Ei(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && rt.add(i), t.call(this, n, i);
  };
}
let Ci = !1;
function Ts() {
  Ci || (Ei(ee), Ei(W), Ci = !0);
}
const wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: rt,
  refreshIndexPaths: Ut
}, Symbol.toStringTag, { value: "Module" }));
function nn(e, t = 1e3) {
  const n = /* @__PURE__ */ new Map();
  function i(r) {
    const a = r === void 0 ? "__undefined" : String(r);
    if (n.has(a)) {
      const l = n.get(a);
      return n.delete(a), n.set(a, l), l;
    }
    const s = e(r);
    try {
      if (n.set(a, s), n.size > t) {
        const l = n.keys().next().value;
        n.delete(l);
      }
    } catch {
    }
    return s;
  }
  return i._cache = n, i._reset = () => n.clear(), i;
}
function Cr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const J = nn(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), en = nn(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Zt = nn(function(e) {
  return en(String(e || "")) + "/";
}, 2e3);
function Rs(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    _("[helpers] preloadImage failed", t);
  }
}
function Hn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = l - s);
    let d = 0.6;
    try {
      const g = r && window.getComputedStyle ? window.getComputedStyle(r) : null, m = g && g.getPropertyValue("--nimbi-image-max-height-ratio"), b = m ? parseFloat(m) : NaN;
      !Number.isNaN(b) && b > 0 && b <= 1 && (d = b);
    } catch (g) {
      _("[helpers] read CSS ratio failed", g);
    }
    const f = Math.max(200, Math.floor(u * d));
    let p = !1, y = null;
    if (i.forEach((g) => {
      try {
        const m = g.getAttribute ? g.getAttribute("loading") : void 0;
        m !== "eager" && g.setAttribute && g.setAttribute("loading", "lazy");
        const b = g.getBoundingClientRect ? g.getBoundingClientRect() : null, w = g.src || g.getAttribute && g.getAttribute("src"), k = b && b.height > 1 ? b.height : f, S = b ? b.top : 0, v = S + k;
        b && k > 0 && S <= c && v >= o && (g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), Rs(w), p = !0), !y && b && b.top <= c && (y = { img: g, src: w, rect: b, beforeLoading: m });
      } catch (m) {
        _("[helpers] setEagerForAboveFoldImages per-image failed", m);
      }
    }), !p && y) {
      const { img: g, src: m, rect: b, beforeLoading: w } = y;
      try {
        g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high");
      } catch (k) {
        _("[helpers] setEagerForAboveFoldImages fallback failed", k);
      }
    }
  } catch (i) {
    _("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function $e(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [h, c] of r.entries())
      s.append(h, c);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
nn(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return _("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Kn(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      _("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    _("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Kn);
} catch (e) {
  _("[helpers] global attach failed", e);
}
const zs = nn(function(e) {
  try {
    if (!e && e !== 0) return "";
    const t = String(e), n = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (i, r) => {
      if (!r) return i;
      if (r[0] === "#")
        try {
          return r[1] === "x" || r[1] === "X" ? String.fromCharCode(parseInt(r.slice(2), 16)) : String.fromCharCode(parseInt(r.slice(1), 10));
        } catch {
          return i;
        }
      return n[r] !== void 0 ? n[r] : i;
    });
  } catch {
    return String(e || "");
  }
}, 2e3), ee = /* @__PURE__ */ new Map();
let st = [], Ur = !1;
function Ps(e) {
  Ur = !!e;
}
function ia(e) {
  st = Array.isArray(e) ? e.slice() : [];
}
function $s() {
  return st;
}
const ir = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, aa = ra(() => Dt(Es), "slugManager", ir);
function Is() {
  try {
    if (qr()) return !0;
  } catch {
  }
  try {
    return !!(typeof oe == "string" && oe);
  } catch {
    return !1;
  }
}
function pe(...e) {
  try {
    It(...e);
  } catch {
  }
}
function Ns() {
  return aa.get();
}
function sa(e) {
  return aa.send(e, 5e3);
}
async function Mr(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await sa({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Os(e, t, n) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return sa({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function nt(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = J(typeof t == "string" ? t : String(t || ""));
  } catch {
    n = String(t || "");
  }
  if (n) {
    try {
      if (st && st.length) {
        const r = String(n).split("/")[0], a = st.includes(r);
        let s = ee.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? J(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = J(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, ee.set(e, s);
      } else {
        const i = ee.has(e) ? ee.get(e) : void 0;
        if (i) {
          let r = null;
          try {
            typeof i == "string" ? r = J(i) : i && typeof i == "object" && (r = i.default ? J(i.default) : null);
          } catch {
            r = null;
          }
          if (!r || r === n)
            ee.set(e, n);
          else
            try {
              const a = /* @__PURE__ */ new Set();
              for (const l of ee.keys()) a.add(l);
              const s = typeof Wt == "function" ? Wt(e, a) : `${e}-2`;
              ee.set(s, n), e = s;
            } catch {
            }
        } else
          ee.set(e, n);
      }
    } catch {
    }
    try {
      if (n) {
        try {
          W.set(n, e);
        } catch {
        }
        try {
          if (Pe && typeof Pe.has == "function") {
            if (!Pe.has(n)) {
              try {
                Pe.add(n);
              } catch {
              }
              try {
                Array.isArray(Ne) && !Ne.includes(n) && Ne.push(n);
              } catch {
              }
            }
          } else
            try {
              Array.isArray(Ne) && !Ne.includes(n) && Ne.push(n);
            } catch {
            }
        } catch {
        }
      }
    } catch {
    }
  }
}
const ar = /* @__PURE__ */ new Set();
function Bs(e) {
  typeof e == "function" && ar.add(e);
}
function js(e) {
  typeof e == "function" && ar.delete(e);
}
const W = /* @__PURE__ */ new Map();
let Lr = {}, Ne = [];
const Pe = /* @__PURE__ */ new Set();
let oe = "_404.md", mt = null;
const Wr = "_home";
function oa(e) {
  if (e == null) {
    oe = null;
    return;
  }
  oe = String(e || "");
}
function la(e) {
  if (e == null) {
    mt = null;
    return;
  }
  mt = String(e || "");
}
function Hs(e) {
  Lr = e || {};
}
function ca(e) {
  try {
    if (Array.isArray(re) || (re = []), !Array.isArray(e)) return;
    try {
      Array.isArray(re) || (re = []), re.length = 0;
      for (const t of e) re.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = re;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      pe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        re = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const dn = /* @__PURE__ */ new Map(), Yn = /* @__PURE__ */ new Set();
function qs() {
  dn.clear(), Yn.clear();
}
function Fs(e) {
  if (!e || e.length === 0) return "";
  let t = e[0];
  for (let i = 1; i < e.length; i++) {
    const r = e[i];
    let a = 0;
    const s = Math.min(t.length, r.length);
    for (; a < s && t[a] === r[a]; ) a++;
    t = t.slice(0, a);
  }
  const n = t.lastIndexOf("/");
  return n === -1 ? t : t.slice(0, n + 1);
}
const de = nn(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function Zr(e) {
  ee.clear(), W.clear(), Ne = [];
  try {
    Pe.clear();
  } catch {
  }
  st = st || [];
  const t = Object.keys(Lr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), pe("[slugManager] parse contentBase failed", i);
      }
      n = Zt(n);
    }
  } catch (i) {
    n = "", pe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Fs(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = J(i.slice(n.length)) : r = J(i), Ne.push(r);
    try {
      Pe.add(r);
    } catch {
    }
    try {
      Ut();
    } catch (s) {
      pe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Lr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = de(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!st || !st.length) && (o = Wt(o, new Set(ee.keys()))), st && st.length) {
              const c = r.split("/")[0], u = st.includes(c);
              let d = ee.get(o);
              (!d || typeof d == "string") && (d = { default: typeof d == "string" ? d : void 0, langs: {} }), u ? d.langs[c] = r : d.default = r, ee.set(o, d);
            } else
              ee.set(o, r);
            W.set(r, o);
          } catch (o) {
            pe("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Zr();
} catch (e) {
  pe("[slugManager] initial setContentBase failed", e);
}
function Wt(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Ds(e) {
  return Tn(e, void 0);
}
function Tn(e, t) {
  if (!e) return !1;
  if (e.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(e)) {
    if (t && typeof t == "string")
      try {
        const n = new URL(e), i = new URL(t);
        return n.origin !== i.origin ? !0 : !n.pathname.startsWith(i.pathname);
      } catch {
        return !0;
      }
    return !0;
  }
  if (e.startsWith("/") && t && typeof t == "string")
    try {
      const n = new URL(e, t), i = new URL(t);
      return n.origin !== i.origin ? !0 : !n.pathname.startsWith(i.pathname);
    } catch {
      return !0;
    }
  return !1;
}
function Un(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function tn(e) {
  if (!e || !ee.has(e)) return null;
  const t = ee.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (st && st.length && Nt && t.langs && t.langs[Nt])
    return t.langs[Nt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Yt = new rr({ maxSize: 2e3 });
function Us() {
  Yt.clear(), fn.clear();
}
const fn = new rr({ maxSize: 2e3 });
let ua = 60 * 1e3;
function Ws(e) {
  ua = Number(e) || 0;
}
let Tr = Math.max(1, Math.min(ir, 5));
function Zs(e) {
  try {
    Tr = Math.max(1, Number(e) || 1);
  } catch {
    Tr = 1;
  }
}
function pn() {
  return Tr;
}
let Te = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const o = it(e);
        o && o.page && (e = o.page);
      } catch {
      }
  } catch {
  }
  try {
    const o = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (o && ee.has(o)) {
      const h = tn(o) || ee.get(o);
      h && h !== e && (e = h);
    }
  } catch (o) {
    pe("[slugManager] slug mapping normalization failed", o);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const o = String(e).split("::", 1)[0];
      if (o)
        try {
          if (ee.has(o)) {
            const h = tn(o) || ee.get(o);
            h ? e = h : e = o;
          } else
            e = o;
        } catch {
          e = o;
        }
    }
  } catch (o) {
    pe("[slugManager] path sanitize failed", o);
  }
  if (!(n && n.force === !0 || typeof oe == "string" && oe || ee && ee.size || Pe && Pe.size || qr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : en(String(t));
  let a = "";
  try {
    const o = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (r && r.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(r)) {
      const h = r.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
      a = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + h;
    } else {
      let h = o + "/";
      r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? h = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? h = o + r.replace(/\/$/, "") + "/" : h = o + "/" + r.replace(/\/$/, "") + "/"), a = new URL(e.replace(/^\//, ""), h).toString();
    }
  } catch {
    a = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  try {
    const o = fn.get(a);
    if (o && o > Date.now())
      return Promise.reject(new Error("failed to fetch md"));
    o && fn.delete(a);
  } catch {
  }
  if (Yt.has(a))
    return Yt.get(a);
  const l = (async () => {
    const o = await fetch(a);
    if (!o || typeof o.ok != "boolean" || !o.ok) {
      if (o && o.status === 404 && typeof oe == "string" && oe)
        try {
          const p = `${r}/${oe}`, y = await globalThis.fetch(p);
          if (y && typeof y.ok == "boolean" && y.ok)
            return { raw: await y.text(), status: 404 };
        } catch (p) {
          pe("[slugManager] fetching fallback 404 failed", p);
        }
      let f = "";
      try {
        o && typeof o.clone == "function" ? f = await o.clone().text() : o && typeof o.text == "function" ? f = await o.text() : f = "";
      } catch (p) {
        f = "", pe("[slugManager] reading error body failed", p);
      }
      try {
        const p = o ? o.status : void 0;
        if (p === 404)
          try {
            _("fetchMarkdown failed (404):", () => ({ url: a, status: p, statusText: o ? o.statusText : void 0, body: f.slice(0, 200) }));
          } catch {
          }
        else
          try {
            Xn("fetchMarkdown failed:", () => ({ url: a, status: p, statusText: o ? o.statusText : void 0, body: f.slice(0, 200) }));
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const h = await o.text(), c = h.trim().slice(0, 128).toLowerCase(), u = /^(?:<!doctype|<html|<title|<h1)/.test(c), d = u || String(e || "").toLowerCase().endsWith(".html");
    if (u && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof oe == "string" && oe) {
          const f = `${r}/${oe}`, p = await globalThis.fetch(f);
          if (p.ok)
            return { raw: await p.text(), status: 404 };
        }
      } catch (f) {
        pe("[slugManager] fetching fallback 404 failed", f);
      }
      throw Is() && Xn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return d ? { raw: h, isHtml: !0 } : { raw: h };
  })().catch((o) => {
    try {
      fn.set(a, Date.now() + ua);
    } catch {
    }
    try {
      Yt.delete(a);
    } catch {
    }
    throw o;
  });
  return Yt.set(a, l), l;
};
function Gs(e) {
  typeof e == "function" && (Te = e);
}
const Wn = /* @__PURE__ */ new Map();
function Xs(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let re = [];
function Qs() {
  return re;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return re;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = re;
      } catch {
      }
    }
} catch {
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiIndexReady", {
        get() {
          return Rr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Rr;
      } catch {
      }
    }
} catch {
}
let zt = null;
async function qt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => J(String(a || ""))))) : [];
  try {
    const a = J(String(oe || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (re && re.length && t === 1 && !re.some((s) => {
    try {
      return r.includes(J(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return re;
  if (zt) return zt;
  zt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((g) => J(String(g || ""))))) : [];
    try {
      const g = J(String(oe || ""));
      g && !a.includes(g) && a.push(g);
    } catch {
    }
    const s = (g) => {
      if (!a || !a.length) return !1;
      for (const m of a)
        if (m && (g === m || g.startsWith(m + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const g of i)
          try {
            const m = J(String(g || ""));
            m && l.push(m);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Ne) && Ne.length && (l = Array.from(Ne)), !l.length) {
      if (W && typeof W.size == "number" && W.size)
        try {
          l = Array.from(W.keys());
        } catch {
          l = [];
        }
      else
        for (const g of ee.values())
          if (g) {
            if (typeof g == "string")
              l.push(g);
            else if (g && typeof g == "object") {
              g.default && l.push(g.default);
              const m = g.langs || {};
              for (const b of Object.keys(m || {}))
                try {
                  m[b] && l.push(m[b]);
                } catch {
                }
            }
          }
    }
    try {
      const g = await ga(e);
      g && g.length && (l = l.concat(g));
    } catch (g) {
      pe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", g);
    }
    try {
      const g = new Set(l), m = [...l], b = Math.max(1, Math.min(pn(), m.length || pn()));
      let w = 0;
      const k = async () => {
        for (; !(g.size > Rn); ) {
          const v = m.shift();
          if (!v) break;
          try {
            const E = await Te(v, e);
            if (E && E.raw) {
              if (E.status === 404) continue;
              let O = E.raw;
              const H = [], U = String(v || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(U) && Ur && (!v || !v.includes("/")))
                continue;
              const P = Xs(O), K = /\[[^\]]+\]\(([^)]+)\)/g;
              let Z;
              for (; Z = K.exec(P); )
                H.push(Z[1]);
              const ie = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; Z = ie.exec(P); )
                H.push(Z[1]);
              const q = v && v.includes("/") ? v.substring(0, v.lastIndexOf("/") + 1) : "";
              for (let L of H)
                try {
                  if (Tn(L, e) || L.startsWith("..") || L.indexOf("/../") !== -1 || (q && !L.startsWith("./") && !L.startsWith("/") && !L.startsWith("../") && (L = q + L), L = J(L), !/\.(md|html?)(?:$|[?#])/i.test(L)) || (L = L.split(/[?#]/)[0], s(L))) continue;
                  g.has(L) || (g.add(L), m.push(L), l.push(L));
                } catch (F) {
                  pe("[slugManager] href processing failed", L, F);
                }
            }
          } catch (E) {
            pe("[slugManager] discovery fetch failed for", v, E);
          }
          try {
            w++, await Rt(w, 32);
          } catch {
          }
        }
      }, S = [];
      for (let v = 0; v < b; v++) S.push(k());
      await Promise.all(S);
    } catch (g) {
      pe("[slugManager] discovery loop failed", g);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((g) => !g || o.has(g) || s(g) ? !1 : (o.add(g), !0));
    const h = [], c = /* @__PURE__ */ new Map(), u = l.filter((g) => /\.(?:md|html?)(?:$|[?#])/i.test(g)), d = Math.max(1, Math.min(pn(), u.length || 1)), f = u.slice(), p = [];
    for (let g = 0; g < d; g++)
      p.push((async () => {
        for (; f.length; ) {
          const m = f.shift();
          if (!m) break;
          try {
            const b = await Te(m, e);
            c.set(m, b);
          } catch (b) {
            pe("[slugManager] buildSearchIndex: entry fetch failed", m, b), c.set(m, null);
          }
        }
      })());
    await Promise.all(p);
    let y = 0;
    for (const g of l) {
      try {
        y++, await Rt(y, 16);
      } catch {
      }
      if (/\.(?:md|html?)(?:$|[?#])/i.test(g))
        try {
          const m = c.get(g);
          if (!m || !m.raw || m.status === 404) continue;
          let b = "", w = "", k = null;
          if (m.isHtml)
            try {
              const v = qe(), E = v ? v.parseFromString(m.raw, "text/html") : null, O = E ? E.querySelector("title") || E.querySelector("h1") : null;
              O && O.textContent && (b = O.textContent.trim());
              const H = E ? E.querySelector("p") : null;
              if (H && H.textContent && (w = H.textContent.trim()), t >= 2)
                try {
                  const U = E ? E.querySelector("h1") : null, P = U && U.textContent ? U.textContent.trim() : b || "";
                  try {
                    const Z = W && typeof W.has == "function" && W.has(g) ? W.get(g) : null;
                    if (Z)
                      k = Z;
                    else {
                      let ie = de(b || g);
                      const q = /* @__PURE__ */ new Set();
                      try {
                        for (const F of ee.keys()) q.add(F);
                      } catch {
                      }
                      try {
                        for (const F of h)
                          F && F.slug && q.add(String(F.slug).split("::")[0]);
                      } catch {
                      }
                      let L = !1;
                      try {
                        if (ee.has(ie)) {
                          const F = ee.get(ie);
                          if (typeof F == "string")
                            F === g && (L = !0);
                          else if (F && typeof F == "object") {
                            F.default === g && (L = !0);
                            for (const D of Object.keys(F.langs || {}))
                              if (F.langs[D] === g) {
                                L = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !L && q.has(ie) && (ie = Wt(ie, q)), k = ie;
                      try {
                        W.has(g) || nt(k, g);
                      } catch {
                      }
                    }
                  } catch (Z) {
                    pe("[slugManager] derive pageSlug failed", Z);
                  }
                  const K = Array.from(E.querySelectorAll("h2"));
                  for (const Z of K)
                    try {
                      const ie = (Z.textContent || "").trim();
                      if (!ie) continue;
                      const q = Z.id ? Z.id : de(ie), L = k ? `${k}::${q}` : `${de(g)}::${q}`;
                      let F = "", D = Z.nextElementSibling;
                      for (; D && D.tagName && D.tagName.toLowerCase() === "script"; ) D = D.nextElementSibling;
                      D && D.textContent && (F = String(D.textContent).trim()), h.push({ slug: L, title: ie, excerpt: F, path: g, parentTitle: P });
                    } catch (ie) {
                      pe("[slugManager] indexing H2 failed", ie);
                    }
                  if (t === 3)
                    try {
                      const Z = Array.from(E.querySelectorAll("h3"));
                      for (const ie of Z)
                        try {
                          const q = (ie.textContent || "").trim();
                          if (!q) continue;
                          const L = ie.id ? ie.id : de(q), F = k ? `${k}::${L}` : `${de(g)}::${L}`;
                          let D = "", le = ie.nextElementSibling;
                          for (; le && le.tagName && le.tagName.toLowerCase() === "script"; ) le = le.nextElementSibling;
                          le && le.textContent && (D = String(le.textContent).trim()), h.push({ slug: F, title: q, excerpt: D, path: g, parentTitle: P });
                        } catch (q) {
                          pe("[slugManager] indexing H3 failed", q);
                        }
                    } catch (Z) {
                      pe("[slugManager] collect H3s failed", Z);
                    }
                } catch (U) {
                  pe("[slugManager] collect H2s failed", U);
                }
            } catch (v) {
              pe("[slugManager] parsing HTML for index failed", v);
            }
          else {
            const v = m.raw, E = v.match(/^#\s+(.+)$/m);
            b = E ? E[1].trim() : "";
            try {
              b = Un(b);
            } catch {
            }
            const O = v.split(/\r?\n\s*\r?\n/);
            if (O.length > 1)
              for (let H = 1; H < O.length; H++) {
                const U = O[H].trim();
                if (U && !/^#/.test(U)) {
                  w = U.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let H = "";
              try {
                const U = (v.match(/^#\s+(.+)$/m) || [])[1];
                H = U ? U.trim() : "";
                try {
                  const Z = W && typeof W.has == "function" && W.has(g) ? W.get(g) : null;
                  if (Z)
                    k = Z;
                  else {
                    let ie = de(b || g);
                    const q = /* @__PURE__ */ new Set();
                    try {
                      for (const F of ee.keys()) q.add(F);
                    } catch {
                    }
                    try {
                      for (const F of h)
                        F && F.slug && q.add(String(F.slug).split("::")[0]);
                    } catch {
                    }
                    let L = !1;
                    try {
                      if (ee.has(ie)) {
                        const F = ee.get(ie);
                        if (typeof F == "string")
                          F === g && (L = !0);
                        else if (F && typeof F == "object") {
                          F.default === g && (L = !0);
                          for (const D of Object.keys(F.langs || {}))
                            if (F.langs[D] === g) {
                              L = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !L && q.has(ie) && (ie = Wt(ie, q)), k = ie;
                    try {
                      W.has(g) || nt(k, g);
                    } catch {
                    }
                  }
                } catch (Z) {
                  pe("[slugManager] derive pageSlug failed", Z);
                }
                const P = /^##\s+(.+)$/gm;
                let K;
                for (; K = P.exec(v); )
                  try {
                    const Z = (K[1] || "").trim(), ie = Un(Z);
                    if (!Z) continue;
                    const q = de(Z), L = k ? `${k}::${q}` : `${de(g)}::${q}`, D = v.slice(P.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), le = D && D[1] ? String(D[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    h.push({ slug: L, title: ie, excerpt: le, path: g, parentTitle: H });
                  } catch (Z) {
                    pe("[slugManager] indexing markdown H2 failed", Z);
                  }
              } catch (U) {
                pe("[slugManager] collect markdown H2s failed", U);
              }
              if (t === 3)
                try {
                  const U = /^###\s+(.+)$/gm;
                  let P;
                  for (; P = U.exec(v); )
                    try {
                      const K = (P[1] || "").trim(), Z = Un(K);
                      if (!K) continue;
                      const ie = de(K), q = k ? `${k}::${ie}` : `${de(g)}::${ie}`, F = v.slice(U.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), D = F && F[1] ? String(F[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      h.push({ slug: q, title: Z, excerpt: D, path: g, parentTitle: H });
                    } catch (K) {
                      pe("[slugManager] indexing markdown H3 failed", K);
                    }
                } catch (U) {
                  pe("[slugManager] collect markdown H3s failed", U);
                }
            }
          }
          let S = "";
          try {
            W.has(g) && (S = W.get(g));
          } catch (v) {
            pe("[slugManager] mdToSlug access failed", v);
          }
          if (!S) {
            try {
              if (!k) {
                const v = W && typeof W.has == "function" && W.has(g) ? W.get(g) : null;
                if (v)
                  k = v;
                else {
                  let E = de(b || g);
                  const O = /* @__PURE__ */ new Set();
                  try {
                    for (const U of ee.keys()) O.add(U);
                  } catch {
                  }
                  try {
                    for (const U of h)
                      U && U.slug && O.add(String(U.slug).split("::")[0]);
                  } catch {
                  }
                  let H = !1;
                  try {
                    if (ee.has(E)) {
                      const U = ee.get(E);
                      if (typeof U == "string")
                        U === g && (H = !0);
                      else if (U && typeof U == "object") {
                        U.default === g && (H = !0);
                        for (const P of Object.keys(U.langs || {}))
                          if (U.langs[P] === g) {
                            H = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !H && O.has(E) && (E = Wt(E, O)), k = E;
                  try {
                    W.has(g) || nt(k, g);
                  } catch {
                  }
                }
              }
            } catch (v) {
              pe("[slugManager] derive pageSlug failed", v);
            }
            S = k || de(b || g);
          }
          h.push({ slug: S, title: b, excerpt: w, path: g });
        } catch (m) {
          pe("[slugManager] buildSearchIndex: entry processing failed", m);
        }
    }
    try {
      const g = h.filter((m) => {
        try {
          return !s(String(m.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const m of g) re.push(m);
      } catch {
        try {
          re = Array.from(g);
        } catch {
          re = g;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = re;
          } catch {
          }
          try {
            const m = [], b = /* @__PURE__ */ new Set();
            for (const w of re)
              try {
                if (!w || !w.slug) continue;
                const k = String(w.slug).split("::")[0];
                if (b.has(k)) continue;
                b.add(k);
                const S = { slug: k };
                w.title ? S.title = String(w.title) : w.parentTitle && (S.title = String(w.parentTitle)), w.path && (S.path = String(w.path)), m.push(S);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: m };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = m;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (g) {
      pe("[slugManager] filtering index by excludes failed", g);
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const m of h) re.push(m);
      } catch {
        try {
          re = Array.from(h);
        } catch {
          re = h;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = re;
          } catch {
          }
      } catch {
      }
    }
    return re;
  })();
  try {
    await zt;
  } catch (a) {
    pe("[slugManager] awaiting _indexPromise failed", a);
  }
  return zt = null, re;
}
async function $t(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(re) && re.length && !zt && !s) return re;
    if (zt) {
      try {
        await zt;
      } catch {
      }
      return re;
    }
    if (s) {
      try {
        if (typeof Mr == "function")
          try {
            const o = await Mr(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                ca(o);
              } catch {
              }
              return re;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await qt(n, i, r, a), re;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(re) && re.length) return re;
      await new Promise((o) => setTimeout(o, 150));
    }
    return re;
  } catch {
    return re;
  }
}
async function Rr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await $t(t);
    } catch {
      return re;
    }
  } catch {
    return re;
  }
}
const ha = 1e3;
let Rn = ha;
function Ks(e) {
  typeof e == "number" && e >= 0 && (Rn = e);
}
const da = qe(), fa = "a[href]";
let pa = async function(e, t, n = Rn) {
  if (Wn.has(e)) return Wn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? l = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? l = s + String(t).replace(/\/$/, "") + "/" : l = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  const o = Math.max(1, Math.min(ir, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const h = a.splice(0, o);
    await An(h, async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let u = "";
      try {
        u = new URL(c || "", l).toString();
      } catch {
        u = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(u);
        } catch (m) {
          pe("[slugManager] crawlForSlug: fetch failed", { url: u, error: m });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && pe("[slugManager] crawlForSlug: directory fetch non-ok", { url: u, status: d.status });
          return;
        }
        const f = await d.text(), y = da.parseFromString(f, "text/html").querySelectorAll(fa), g = u;
        for (const m of y)
          try {
            if (i) break;
            let b = m.getAttribute("href") || "";
            if (!b || Tn(b, t) || b.startsWith("..") || b.indexOf("/../") !== -1) continue;
            if (b.endsWith("/")) {
              try {
                const w = new URL(b, g), k = new URL(l).pathname, S = w.pathname.startsWith(k) ? w.pathname.slice(k.length) : w.pathname.replace(/^\//, ""), v = Zt(J(S));
                r.has(v) || a.push(v);
              } catch {
                const k = J(c + b);
                r.has(k) || a.push(k);
              }
              continue;
            }
            if (b.toLowerCase().endsWith(".md")) {
              let w = "";
              try {
                const k = new URL(b, g), S = new URL(l).pathname;
                w = k.pathname.startsWith(S) ? k.pathname.slice(S.length) : k.pathname.replace(/^\//, "");
              } catch {
                w = (c + b).replace(/^\//, "");
              }
              w = J(w);
              try {
                if (W.has(w))
                  continue;
                for (const k of ee.values())
                  ;
              } catch (k) {
                pe("[slugManager] slug map access failed", k);
              }
              try {
                const k = await Te(w, t);
                if (k && k.raw) {
                  const S = (k.raw || "").match(/^#\s+(.+)$/m);
                  if (S && S[1] && de(S[1].trim()) === e) {
                    i = w;
                    break;
                  }
                }
              } catch (k) {
                pe("[slugManager] crawlForSlug: fetchMarkdown failed", k);
              }
            }
          } catch (b) {
            pe("[slugManager] crawlForSlug: link iteration failed", b);
          }
      } catch (d) {
        pe("[slugManager] crawlForSlug: directory fetch failed", d);
      }
    }, o);
  }
  return Wn.set(e, i), i;
};
async function ga(e, t = Rn) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const l = Math.max(1, Math.min(ir, 6));
  for (; r.length && !(r.length > t); ) {
    const o = r.splice(0, l);
    await An(o, async (h) => {
      if (h == null || i.has(h)) return;
      i.add(h);
      let c = "";
      try {
        c = new URL(h || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(h || "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(c);
        } catch (g) {
          pe("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: g });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && pe("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: u.status });
          return;
        }
        const d = await u.text(), p = da.parseFromString(d, "text/html").querySelectorAll(fa), y = c;
        for (const g of p)
          try {
            let m = g.getAttribute("href") || "";
            if (!m || Tn(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
            if (m.endsWith("/")) {
              try {
                const w = new URL(m, y), k = new URL(s).pathname, S = w.pathname.startsWith(k) ? w.pathname.slice(k.length) : w.pathname.replace(/^\//, ""), v = Zt(J(S));
                i.has(v) || r.push(v);
              } catch {
                const k = h + m;
                i.has(k) || r.push(k);
              }
              continue;
            }
            let b = "";
            try {
              const w = new URL(m, y), k = new URL(s).pathname;
              b = w.pathname.startsWith(k) ? w.pathname.slice(k.length) : w.pathname.replace(/^\//, "");
            } catch {
              b = (h + m).replace(/^\//, "");
            }
            b = J(b), /\.(md|html?)$/i.test(b) && n.add(b);
          } catch (m) {
            pe("[slugManager] crawlAllMarkdown: link iteration failed", m);
          }
      } catch (u) {
        pe("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }, l);
  }
  return Array.from(n);
}
async function ma(e, t, n) {
  if (e && typeof e == "string" && (e = J(e), e = en(e)), ee.has(e))
    return tn(e) || ee.get(e);
  try {
    if (!(typeof oe == "string" && oe || ee.has(e) || Pe && Pe.size || Ut._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of ar)
    try {
      const a = await r(e, t);
      if (a)
        return nt(e, a), a;
    } catch (a) {
      pe("[slugManager] slug resolver failed", a);
    }
  if (Pe && Pe.size) {
    if (dn.has(e)) {
      const r = dn.get(e);
      return nt(e, r), r;
    }
    for (const r of Ne)
      if (!Yn.has(r))
        try {
          const a = await Te(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = de(s[1].trim());
              if (Yn.add(r), l && dn.set(l, r), l === e)
                return nt(e, r), r;
            }
          }
        } catch (a) {
          pe("[slugManager] manifest title fetch failed", a);
        }
    try {
      crawlBatchYieldCount++, await Rt(crawlBatchYieldCount, 8);
    } catch {
    }
  }
  try {
    const r = await qt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return nt(e, a.path), a.path;
    }
  } catch (r) {
    pe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await pa(e, t, n);
    if (r)
      return nt(e, r), r;
  } catch (r) {
    pe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Te(r, t);
      if (a && a.raw)
        return nt(e, r), r;
    } catch (a) {
      pe("[slugManager] candidate fetch failed", a);
    }
  if (Pe && Pe.size)
    for (const r of Ne)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (de(a) === e)
          return nt(e, r), r;
      } catch (a) {
        pe("[slugManager] build-time filename match failed", a);
      }
  try {
    if (mt && typeof mt == "string" && mt.trim())
      try {
        const r = await Te(mt, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && de(a[1].trim()) === e)
            return nt(e, mt), mt;
        }
      } catch (r) {
        pe("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    pe("[slugManager] home page fetch failed", r);
  }
  return null;
}
const at = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ha,
  HOME_SLUG: Wr,
  _setAllMd: Hs,
  _setSearchIndex: ca,
  _storeSlugMapping: nt,
  addSlugResolver: Bs,
  get allMarkdownPaths() {
    return Ne;
  },
  allMarkdownPathsSet: Pe,
  get availableLanguages() {
    return st;
  },
  awaitSearchIndex: Rr,
  buildSearchIndex: qt,
  buildSearchIndexWorker: Mr,
  clearFetchCache: Us,
  clearListCaches: qs,
  crawlAllMarkdown: ga,
  crawlCache: Wn,
  crawlForSlug: pa,
  crawlForSlugWorker: Os,
  get defaultCrawlMaxQueue() {
    return Rn;
  },
  ensureSlug: ma,
  fetchCache: Yt,
  get fetchMarkdown() {
    return Te;
  },
  getFetchConcurrency: pn,
  getLanguages: $s,
  getSearchIndex: Qs,
  get homePage() {
    return mt;
  },
  initSlugWorker: Ns,
  isExternalLink: Ds,
  isExternalLinkWithBase: Tn,
  listPathsFetched: Yn,
  listSlugCache: dn,
  mdToSlug: W,
  negativeFetchCache: fn,
  get notFoundPage() {
    return oe;
  },
  removeSlugResolver: js,
  resolveSlugPath: tn,
  get searchIndex() {
    return re;
  },
  setContentBase: Zr,
  setDefaultCrawlMaxQueue: Ks,
  setFetchConcurrency: Zs,
  setFetchMarkdown: Gs,
  setFetchNegativeCacheTTL: Ws,
  setHomePage: la,
  setLanguages: ia,
  setNotFoundPage: oa,
  setSkipRootReadme: Ps,
  get skipRootReadme() {
    return Ur;
  },
  slugResolvers: ar,
  slugToMd: ee,
  slugify: de,
  unescapeMarkdown: Un,
  uniqueSlug: Wt,
  whenSearchIndexReady: $t
}, Symbol.toStringTag, { value: "Module" }));
var _r, Mi;
function Ys() {
  if (Mi) return _r;
  Mi = 1;
  function e(a, s) {
    return s.some(
      ([l, o]) => l <= a && a <= o
    );
  }
  function t(a) {
    if (typeof a != "string")
      return !1;
    const s = a.charCodeAt(0);
    return e(
      s,
      [
        // Hiragana (Katakana not included on purpose,
        // context: https://github.com/ngryman/reading-time/pull/35#issuecomment-853364526)
        // If you think Katakana should be included and have solid reasons, improvement is welcomed
        [12352, 12447],
        // CJK Unified ideographs
        [19968, 40959],
        // Hangul
        [44032, 55203],
        // CJK extensions
        [131072, 191456]
      ]
    );
  }
  function n(a) {
    return ` 
\r	`.includes(a);
  }
  function i(a) {
    if (typeof a != "string")
      return !1;
    const s = a.charCodeAt(0);
    return e(
      s,
      [
        [33, 47],
        [58, 64],
        [91, 96],
        [123, 126],
        // CJK Symbols and Punctuation
        [12288, 12351],
        // Full-width ASCII punctuation variants
        [65280, 65519]
      ]
    );
  }
  function r(a, s = {}) {
    let l = 0, o = 0, h = a.length - 1;
    const c = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[o]); ) o++;
    for (; u(a[h]); ) h--;
    const d = `${a}
`;
    for (let g = o; g <= h; g++)
      if ((t(d[g]) || !u(d[g]) && (u(d[g + 1]) || t(d[g + 1]))) && l++, t(d[g]))
        for (; g <= h && (i(d[g + 1]) || u(d[g + 1])); )
          g++;
    const f = l / c, p = Math.round(f * 60 * 1e3);
    return {
      text: Math.ceil(f.toFixed(2)) + " min read",
      minutes: f,
      time: p,
      words: l
    };
  }
  return _r = r, _r;
}
var Vs = Ys();
const Js = /* @__PURE__ */ Ki(Vs);
function En(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ya(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    _("[seoManager] upsertLinkRel failed", n);
  }
}
function eo(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Lt("property", "og:description", a), a && String(a).trim() && Lt("name", "twitter:description", a), Lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Lt("property", "og:image", s), Lt("name", "twitter:image", s));
}
function Gr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && En("description", l), En("robots", a.robots || "index,follow"), eo(a, t, n, l);
}
function to() {
  try {
    const e = [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]'
    ];
    for (const t of e) {
      const n = document.querySelector(t);
      if (n) {
        const i = n.getAttribute("content") || "";
        if (i && i.trim()) return i.trim();
      }
    }
  } catch (e) {
    _("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Xr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", h = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const p = J(t);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(p);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (p) {
      c = location.href.split("#")[0], _("[seoManager] compute canonical failed", p);
    }
    c && ya("canonical", c);
    try {
      Lt("property", "og:url", c);
    } catch (p) {
      _("[seoManager] upsertMeta og:url failed", p);
    }
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    h && (u.image = String(h)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const d = "nimbi-jsonld";
    let f = document.getElementById(d);
    f || (f = document.createElement("script"), f.type = "application/ld+json", f.id = d, document.head.appendChild(f)), f.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    _("[seoManager] setStructuredData failed", s);
  }
}
let gn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function no(e) {
  try {
    if (!e || typeof e != "object") {
      gn = {};
      return;
    }
    gn = Object.assign({}, e);
  } catch (t) {
    _("[seoManager] setSeoMap failed", t);
  }
}
function ro(e, t = "") {
  try {
    if (!e) return;
    const n = gn && gn[e] ? gn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ya("canonical", i);
      try {
        Lt("property", "og:url", i);
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
      n.description && En("description", String(n.description));
    } catch {
    }
    try {
      try {
        Gr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Xr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      _("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    _("[seoManager] injectSeoForPage failed", n);
  }
}
function Zn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      En("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && En("description", String(s));
    } catch {
    }
    try {
      Gr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Xr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    _("[seoManager] markNotFound failed", r);
  }
}
function io(e, t, n, i, r, a, s, l, o, h, c) {
  try {
    if (i && i.querySelector) {
      const u = i.querySelector(".menu-label");
      u && (u.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (u) {
    _("[seoManager] update toc label failed", u);
  }
  try {
    const u = n.meta && n.meta.title ? String(n.meta.title).trim() : "", d = r.querySelector("img"), f = d && (d.getAttribute("src") || d.src) || null;
    let p = "";
    try {
      let m = "";
      try {
        const b = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (b) {
          let w = b.nextElementSibling;
          const k = [];
          for (; w && !(w.tagName && w.tagName.toLowerCase() === "h2"); ) {
            try {
              if (w.classList && w.classList.contains("nimbi-article-subtitle")) {
                w = w.nextElementSibling;
                continue;
              }
            } catch {
            }
            const S = (w.textContent || "").trim();
            S && k.push(S), w = w.nextElementSibling;
          }
          k.length && (m = k.join(" ").replace(/\s+/g, " ").trim()), !m && o && (m = String(o).trim());
        }
      } catch (b) {
        _("[seoManager] compute descOverride failed", b);
      }
      m && String(m).length > 160 && (m = String(m).slice(0, 157).trim() + "..."), p = m;
    } catch (m) {
      _("[seoManager] compute descOverride failed", m);
    }
    let y = "";
    try {
      u && (y = u);
    } catch {
    }
    if (!y)
      try {
        l && l.textContent && (y = String(l.textContent).trim());
      } catch {
      }
    if (!y)
      try {
        const m = r.querySelector("h2");
        m && m.textContent && (y = String(m.textContent).trim());
      } catch {
      }
    y || (y = a || "");
    try {
      Gr(n, y || void 0, f, p);
    } catch (m) {
      _("[seoManager] setMetaTags failed", m);
    }
    try {
      Xr(n, h, y || void 0, f, p, t);
    } catch (m) {
      _("[seoManager] setStructuredData failed", m);
    }
    const g = to();
    y ? g ? document.title = `${g} - ${y}` : document.title = `${t || "Site"} - ${y}` : u ? document.title = u : document.title = t || document.title;
  } catch (u) {
    _("[seoManager] applyPageMeta failed", u);
  }
  try {
    try {
      const u = r.querySelectorAll(".nimbi-reading-time");
      u && u.forEach((d) => d.remove());
    } catch {
    }
    if (o) {
      const u = Js(c.raw || ""), d = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, f = d ? e("readingTime", { minutes: d }) : "";
      if (!f) return;
      const p = r.querySelector("h1");
      if (p) {
        const y = r.querySelector(".nimbi-article-subtitle");
        try {
          if (y) {
            const g = document.createElement("span");
            g.className = "nimbi-reading-time", g.textContent = f, y.appendChild(g);
          } else {
            const g = document.createElement("p");
            g.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = f, g.appendChild(m);
            try {
              p.parentElement.insertBefore(g, p.nextSibling);
            } catch {
              try {
                p.insertAdjacentElement("afterend", g);
              } catch {
              }
            }
          }
        } catch {
          try {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = f, m.appendChild(b), p.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    _("[seoManager] reading time update failed", u);
  }
}
let ba = 100;
function Li(e) {
  ba = e;
}
function ct() {
  try {
    if (Xt(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let mn = 300 * 1e3;
function Ti(e) {
  mn = e;
}
const pt = /* @__PURE__ */ new Map();
function ao(e) {
  if (!pt.has(e)) return;
  const t = pt.get(e), n = Date.now();
  if (t.ts + mn < n) {
    pt.delete(e);
    return;
  }
  return pt.delete(e), pt.set(e, t), t.value;
}
function so(e, t) {
  if (Ri(), Ri(), pt.delete(e), pt.set(e, { value: t, ts: Date.now() }), pt.size > ba) {
    const n = pt.keys().next().value;
    n !== void 0 && pt.delete(n);
  }
}
function Ri() {
  if (!mn || mn <= 0) return;
  const e = Date.now();
  for (const [t, n] of pt.entries())
    n.ts + mn < e && pt.delete(t);
}
async function oo(e, t) {
  const n = new Set(rt), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = it(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const d = J(u.page);
              if (d) {
                n.add(d);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const d = u.page;
              if (ee.has(d)) {
                const f = ee.get(d);
                if (f) return f;
              }
              continue;
            }
          }
        } catch {
        }
        const s = new URL(a, location.href);
        if (s.origin !== location.origin) continue;
        const l = (s.hash || s.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (s.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (l) {
          let u = J(l[1]);
          u && n.add(u);
          continue;
        }
        const o = (r.textContent || "").trim(), h = (s.pathname || "").replace(/^.*\//, "");
        if (o && de(o) === e || h && de(h.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const u = new URL(t), d = Zt(u.pathname);
          if (c.indexOf(d) !== -1) {
            let f = c.startsWith(d) ? c.slice(d.length) : c;
            f = J(f), f && n.add(f);
          }
        }
      } catch (s) {
        _("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Te(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && de(l) === e)
          return r;
      }
    } catch (a) {
      _("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function lo(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (ee.has(n)) {
        const i = tn(n) || ee.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (rt && rt.size)
          for (const i of rt) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (de(r) === n && !/index\.html$/i.test(i)) {
              t.push(i);
              break;
            }
          }
        !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
      }
    } catch (n) {
      _("[router] buildPageCandidates failed during slug handling", n);
    }
  return t;
}
async function co(e, t) {
  const n = e || "";
  try {
    try {
      Xi("fetchPageData");
    } catch {
    }
    try {
      Qi("fetchPageData");
    } catch {
    }
  } catch {
  }
  let i = null;
  try {
    const m = it(typeof location < "u" ? location.href : "");
    m && m.anchor && (i = m.anchor);
  } catch {
    try {
      i = location && location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    } catch {
      i = null;
    }
  }
  let r = e || "", a = null;
  const s = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (r && String(r).includes("::")) {
    const m = String(r).split("::", 2);
    r = m[0], a = m[1] || null;
  }
  const o = `${e}|||${typeof vs < "u" && Nt ? Nt : ""}`, h = ao(o);
  if (h)
    r = h.resolved, a = h.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let m = decodeURIComponent(String(r || ""));
      if (m && typeof m == "string" && (m = J(m), m = en(m)), ee.has(m))
        r = tn(m) || ee.get(m);
      else {
        let b = await oo(m, t);
        if (b)
          r = b;
        else if (Ut._refreshed && rt && rt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const w = await ma(m, t);
          w && (r = w);
        }
      }
    }
    so(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || ee.has(r) || rt && rt.size || Ut._refreshed || s || m;
  } catch {
    c = !0;
  }
  !a && i && (a = i);
  try {
    if (c && r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const m = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const b = await fetch(m);
        if (b && b.ok) {
          const w = await b.text(), k = b && b.headers && typeof b.headers.get == "function" && b.headers.get("content-type") || "", S = (w || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let O = m;
                try {
                  O = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  O = String(m || "").replace(/^\//, "");
                }
                const H = O.replace(/\.html$/i, ".md");
                try {
                  const U = await Te(H, t);
                  if (U && U.raw)
                    return { data: U, pagePath: H, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const U = await Te(oe, t);
                    if (U && U.raw) {
                      try {
                        Zn(U.meta || {}, oe);
                      } catch {
                      }
                      return { data: U, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  g = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let O = m;
                try {
                  O = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  O = String(m || "").replace(/^\//, "");
                }
                const H = O.replace(/\.html$/i, ".md");
                try {
                  const U = await Te(H, t);
                  if (U && U.raw)
                    return { data: U, pagePath: H, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const U = await Te(oe, t);
                    if (U && U.raw) {
                      try {
                        Zn(U.meta || {}, oe);
                      } catch {
                      }
                      return { data: U, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  g = new Error("site shell detected (absolute fetch)");
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
  const u = lo(r);
  try {
    if (ct())
      try {
        It("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
      } catch {
      }
  } catch {
  }
  const d = String(n || "").includes(".md") || String(n || "").includes(".html");
  let f = null;
  if (!d)
    try {
      let m = decodeURIComponent(String(n || ""));
      m = J(m), m = en(m), m && !/\.(md|html?)$/i.test(m) && (f = m);
    } catch {
      f = null;
    }
  if (d && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !d && !ee.has(r) && !ee.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let p = null, y = null, g = null;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || ee.has(r) || rt && rt.size || Ut._refreshed || d || m;
  } catch {
    c = !0;
  }
  if (!c)
    g = new Error("no page data");
  else
    for (const m of u)
      if (m)
        try {
          const b = J(m);
          if (p = await Te(b, t), y = b, f && !ee.has(f))
            try {
              let w = "";
              if (p && p.isHtml)
                try {
                  const k = qe();
                  if (k) {
                    const S = k.parseFromString(p.raw || "", "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (w = v.textContent.trim());
                  }
                } catch {
                }
              else {
                const k = (p && p.raw || "").match(/^#\s+(.+)$/m);
                k && k[1] && (w = k[1].trim());
              }
              if (w && de(w) !== f)
                try {
                  if (/\.html$/i.test(b)) {
                    const S = b.replace(/\.html$/i, ".md");
                    if (u.includes(S))
                      try {
                        const v = await Te(S, t);
                        if (v && v.raw)
                          p = v, y = S;
                        else if (typeof oe == "string" && oe)
                          try {
                            const E = await Te(oe, t);
                            if (E && E.raw)
                              p = E, y = oe;
                            else {
                              p = null, y = null, g = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            p = null, y = null, g = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          p = null, y = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const E = await Te(oe, t);
                          if (E && E.raw)
                            p = E, y = oe;
                          else {
                            p = null, y = null, g = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          p = null, y = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      p = null, y = null, g = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    p = null, y = null, g = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  p = null, y = null, g = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!d && /\.html$/i.test(b)) {
              const w = b.replace(/\.html$/i, ".md");
              if (u.includes(w))
                try {
                  const S = String(p && p.raw || "").trim().slice(0, 128).toLowerCase();
                  if (p && p.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let E = !1;
                    try {
                      const O = await Te(w, t);
                      if (O && O.raw)
                        p = O, y = w, E = !0;
                      else if (typeof oe == "string" && oe)
                        try {
                          const H = await Te(oe, t);
                          H && H.raw && (p = H, y = oe, E = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const H = await Te(oe, t);
                        H && H.raw && (p = H, y = oe, E = !0);
                      } catch {
                      }
                    }
                    if (!E) {
                      p = null, y = null, g = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (ct())
              try {
                It("[router-debug] fetchPageData accepted candidate", { candidate: b, pagePath: y, isHtml: p && p.isHtml, snippet: p && p.raw ? String(p.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (b) {
          g = b;
          try {
            ct() && _("[router] candidate fetch failed", { candidate: m, contentBase: t, err: b && b.message || b });
          } catch {
          }
        }
  if (!p) {
    const m = g && (g.message || String(g)) || null, b = m && /failed to fetch md|site shell detected/i.test(m);
    try {
      if (ct())
        try {
          It("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: m });
        } catch {
        }
    } catch {
    }
    if (b)
      try {
        if (ct())
          try {
            _("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (ct())
          try {
            Xn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    if (typeof oe == "string" && oe)
      try {
        const w = await Te(oe, t);
        if (w && w.raw) {
          try {
            Zn(w.meta || {}, oe);
          } catch {
          }
          return { data: w, pagePath: oe, anchor: a };
        }
      } catch {
      }
    try {
      if (d && String(n || "").toLowerCase().includes(".html"))
        try {
          const w = new URL(String(n || ""), location.href).toString();
          ct() && _("[router] attempting absolute HTML fetch fallback", w);
          const k = await fetch(w);
          if (k && k.ok) {
            const S = await k.text(), v = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", E = (S || "").toLowerCase(), O = v && v.indexOf && v.indexOf("text/html") !== -1 || E.indexOf("<!doctype") !== -1 || E.indexOf("<html") !== -1;
            if (!O && ct())
              try {
                _("[router] absolute fetch returned non-HTML", () => ({ abs: w, contentType: v, snippet: E.slice(0, 200) }));
              } catch {
              }
            if (O) {
              const H = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || H.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  ct() && _("[router] absolute fetch returned directory listing; treating as not found", { abs: w });
                } catch {
                }
              else
                try {
                  const P = w, K = new URL(".", P).toString();
                  try {
                    const ie = qe();
                    if (ie) {
                      const q = ie.parseFromString(S || "", "text/html"), L = (te, ce) => {
                        try {
                          const _e = ce.getAttribute(te) || "";
                          if (!_e || /^(https?:)?\/\//i.test(_e) || _e.startsWith("/") || _e.startsWith("#")) return;
                          try {
                            const ve = new URL(_e, P).toString();
                            ce.setAttribute(te, ve);
                          } catch (ve) {
                            _("[router] rewrite attribute failed", te, ve);
                          }
                        } catch (_e) {
                          _("[router] rewrite helper failed", _e);
                        }
                      }, F = q.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), D = [];
                      for (const te of Array.from(F || []))
                        try {
                          const ce = te.tagName ? te.tagName.toLowerCase() : "";
                          if (ce === "a") continue;
                          if (te.hasAttribute("src")) {
                            const _e = te.getAttribute("src");
                            L("src", te);
                            const ve = te.getAttribute("src");
                            _e !== ve && D.push({ attr: "src", tag: ce, before: _e, after: ve });
                          }
                          if (te.hasAttribute("href") && ce === "link") {
                            const _e = te.getAttribute("href");
                            L("href", te);
                            const ve = te.getAttribute("href");
                            _e !== ve && D.push({ attr: "href", tag: ce, before: _e, after: ve });
                          }
                          if (te.hasAttribute("href") && ce !== "link") {
                            const _e = te.getAttribute("href");
                            L("href", te);
                            const ve = te.getAttribute("href");
                            _e !== ve && D.push({ attr: "href", tag: ce, before: _e, after: ve });
                          }
                          if (te.hasAttribute("xlink:href")) {
                            const _e = te.getAttribute("xlink:href");
                            L("xlink:href", te);
                            const ve = te.getAttribute("xlink:href");
                            _e !== ve && D.push({ attr: "xlink:href", tag: ce, before: _e, after: ve });
                          }
                          if (te.hasAttribute("poster")) {
                            const _e = te.getAttribute("poster");
                            L("poster", te);
                            const ve = te.getAttribute("poster");
                            _e !== ve && D.push({ attr: "poster", tag: ce, before: _e, after: ve });
                          }
                          if (te.hasAttribute("srcset")) {
                            const He = (te.getAttribute("srcset") || "").split(",").map((xe) => xe.trim()).filter(Boolean).map((xe) => {
                              const [De, T] = xe.split(/\s+/, 2);
                              if (!De || /^(https?:)?\/\//i.test(De) || De.startsWith("/")) return xe;
                              try {
                                const N = new URL(De, P).toString();
                                return T ? `${N} ${T}` : N;
                              } catch {
                                return xe;
                              }
                            }).join(", ");
                            te.setAttribute("srcset", He);
                          }
                        } catch {
                        }
                      const le = q.documentElement && q.documentElement.outerHTML ? q.documentElement.outerHTML : S;
                      try {
                        ct() && D && D.length && _("[router] rewritten asset refs", { abs: w, rewritten: D });
                      } catch {
                      }
                      return { data: { raw: le, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let Z = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? Z = S.replace(/(<head[^>]*>)/i, `$1<base href="${K}">`) : Z = `<base href="${K}">` + S), { data: { raw: Z, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (w) {
          ct() && _("[router] absolute HTML fetch fallback failed", w);
        }
    } catch {
    }
    try {
      const w = decodeURIComponent(String(r || ""));
      if (w && !/\.(md|html?)$/i.test(w) && typeof oe == "string" && oe && ct()) {
        const S = [
          `/assets/${w}.html`,
          `/assets/${w}/index.html`
        ];
        for (const v of S)
          try {
            const E = await fetch(v, { method: "GET" });
            if (E && E.ok)
              return { data: { raw: await E.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (w) {
      ct() && _("[router] assets fallback failed", w);
    }
    throw new Error("no page data");
  }
  return { data: p, pagePath: y, anchor: a };
}
function sr() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Ot = sr();
function wa(e) {
  Ot = e;
}
var Ht = { exec: () => null };
function Re(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(ot.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var uo = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ot = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, ho = /^(?:[ \t]*(?:\n|$))+/, fo = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, po = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, zn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, go = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Qr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, _a = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ka = Re(_a).replace(/bull/g, Qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), mo = Re(_a).replace(/bull/g, Qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Kr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, yo = /^[^\n]+/, Yr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, bo = Re(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Yr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), wo = Re(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Qr).getRegex(), or = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Vr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, _o = Re("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Vr).replace("tag", or).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), xa = Re(Kr).replace("hr", zn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", or).getRegex(), ko = Re(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", xa).getRegex(), Jr = { blockquote: ko, code: fo, def: bo, fences: po, heading: go, hr: zn, html: _o, lheading: ka, list: wo, newline: ho, paragraph: xa, table: Ht, text: yo }, zi = Re("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", zn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", or).getRegex(), xo = { ...Jr, lheading: mo, table: zi, paragraph: Re(Kr).replace("hr", zn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", zi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", or).getRegex() }, So = { ...Jr, html: Re(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Vr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ht, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Re(Kr).replace("hr", zn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ka).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, vo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ao = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Sa = /^( {2,}|\\)\n(?!\s*$)/, Eo = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, lr = /[\p{P}\p{S}]/u, ei = /[\s\p{P}\p{S}]/u, va = /[^\s\p{P}\p{S}]/u, Co = Re(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ei).getRegex(), Aa = /(?!~)[\p{P}\p{S}]/u, Mo = /(?!~)[\s\p{P}\p{S}]/u, Lo = /(?:[^\s\p{P}\p{S}]|~)/u, Ea = /(?![*_])[\p{P}\p{S}]/u, To = /(?![*_])[\s\p{P}\p{S}]/u, Ro = /(?:[^\s\p{P}\p{S}]|[*_])/u, zo = Re(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", uo ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ca = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Po = Re(Ca, "u").replace(/punct/g, lr).getRegex(), $o = Re(Ca, "u").replace(/punct/g, Aa).getRegex(), Ma = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Io = Re(Ma, "gu").replace(/notPunctSpace/g, va).replace(/punctSpace/g, ei).replace(/punct/g, lr).getRegex(), No = Re(Ma, "gu").replace(/notPunctSpace/g, Lo).replace(/punctSpace/g, Mo).replace(/punct/g, Aa).getRegex(), Oo = Re("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, va).replace(/punctSpace/g, ei).replace(/punct/g, lr).getRegex(), Bo = Re(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ea).getRegex(), jo = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ho = Re(jo, "gu").replace(/notPunctSpace/g, Ro).replace(/punctSpace/g, To).replace(/punct/g, Ea).getRegex(), qo = Re(/\\(punct)/, "gu").replace(/punct/g, lr).getRegex(), Fo = Re(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Do = Re(Vr).replace("(?:-->|$)", "-->").getRegex(), Uo = Re("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Do).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Vn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Wo = Re(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Vn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), La = Re(/^!?\[(label)\]\[(ref)\]/).replace("label", Vn).replace("ref", Yr).getRegex(), Ta = Re(/^!?\[(ref)\](?:\[\])?/).replace("ref", Yr).getRegex(), Zo = Re("reflink|nolink(?!\\()", "g").replace("reflink", La).replace("nolink", Ta).getRegex(), Pi = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ti = { _backpedal: Ht, anyPunctuation: qo, autolink: Fo, blockSkip: zo, br: Sa, code: Ao, del: Ht, delLDelim: Ht, delRDelim: Ht, emStrongLDelim: Po, emStrongRDelimAst: Io, emStrongRDelimUnd: Oo, escape: vo, link: Wo, nolink: Ta, punctuation: Co, reflink: La, reflinkSearch: Zo, tag: Uo, text: Eo, url: Ht }, Go = { ...ti, link: Re(/^!?\[(label)\]\((.*?)\)/).replace("label", Vn).getRegex(), reflink: Re(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vn).getRegex() }, zr = { ...ti, emStrongRDelimAst: No, emStrongLDelim: $o, delLDelim: Bo, delRDelim: Ho, url: Re(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Pi).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Re(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Pi).getRegex() }, Xo = { ...zr, br: Re(Sa).replace("{2,}", "*").getRegex(), text: Re(zr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, qn = { normal: Jr, gfm: xo, pedantic: So }, on = { normal: ti, gfm: zr, breaks: Xo, pedantic: Go }, Qo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, $i = (e) => Qo[e];
function _t(e, t) {
  if (t) {
    if (ot.escapeTest.test(e)) return e.replace(ot.escapeReplace, $i);
  } else if (ot.escapeTestNoEncode.test(e)) return e.replace(ot.escapeReplaceNoEncode, $i);
  return e;
}
function Ii(e) {
  try {
    e = encodeURI(e).replace(ot.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ni(e, t) {
  let n = e.replace(ot.findPipe, (a, s, l) => {
    let o = !1, h = s;
    for (; --h >= 0 && l[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(ot.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(ot.slashPipe, "|");
  return i;
}
function ln(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function Ko(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Yo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Oi(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function Vo(e, t, n) {
  let i = e.match(n.other.indentCodeCompensation);
  if (i === null) return t;
  let r = i[1];
  return t.split(`
`).map((a) => {
    let s = a.match(n.other.beginningSpace);
    if (s === null) return a;
    let [l] = s;
    return l.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var Cn = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Ot;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : ln(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = Vo(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = ln(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: ln(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = ln(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), s = !0;
        else if (!s) l.push(n[o]);
        else break;
        n = n.slice(o);
        let h = l.join(`
`), c = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${h}` : h, r = r ? `${r}
${c}` : c;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = u, n.length === 0) break;
        let d = a.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let f = d, p = f.raw + `
` + n.join(`
`), y = this.blockquote(p);
          a[a.length - 1] = y, i = i.substring(0, i.length - f.raw.length) + y.raw, r = r.substring(0, r.length - f.text.length) + y.text;
          break;
        } else if (d?.type === "list") {
          let f = d, p = f.raw + `
` + n.join(`
`), y = this.list(p);
          a[a.length - 1] = y, i = i.substring(0, i.length - d.raw.length) + y.raw, r = r.substring(0, r.length - f.raw.length) + y.raw, n = p.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: a, text: r };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), i = n.length > 1, r = { type: "list", raw: "", ordered: i, start: i ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      let a = this.rules.other.listItemRegex(n), s = !1;
      for (; e; ) {
        let o = !1, h = "", c = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        h = t[0], e = e.substring(h.length);
        let u = Yo(t[2].split(`
`, 1)[0], t[1].length), d = e.split(`
`, 1)[0], f = !u.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, c = u.trimStart()) : f ? p = t[1].length + 1 : (p = u.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, c = u.slice(p), p += t[1].length), f && this.rules.other.blankLine.test(d) && (h += d + `
`, e = e.substring(d.length + 1), o = !0), !o) {
          let y = this.rules.other.nextBulletRegex(p), g = this.rules.other.hrRegex(p), m = this.rules.other.fencesBeginRegex(p), b = this.rules.other.headingBeginRegex(p), w = this.rules.other.htmlBeginRegex(p), k = this.rules.other.blockquoteBeginRegex(p);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (d = S, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), v = d) : v = d.replace(this.rules.other.tabCharGlobal, "    "), m.test(d) || b.test(d) || w.test(d) || k.test(d) || y.test(d) || g.test(d)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= p || !d.trim()) c += `
` + v.slice(p);
            else {
              if (f || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || m.test(u) || b.test(u) || g.test(u)) break;
              c += `
` + d;
            }
            f = !d.trim(), h += S + `
`, e = e.substring(S.length + 1), u = v.slice(p);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (s = !0)), r.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += h;
      }
      let l = r.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let o of r.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
              this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (h) {
            let c = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            o.checked = c.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = c.raw + o.tokens[0].raw, o.tokens[0].text = c.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(c)) : o.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : o.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let h = o.tokens.filter((u) => u.type === "space"), c = h.length > 0 && h.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let h of o.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return r;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) return { type: "html", block: !0, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: i, title: r };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = Ni(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Ni(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
      return a;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let a = ln(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = Ko(t[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let s = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + a;
          t[2] = t[2].substring(0, a), t[0] = t[0].substring(0, s).trim(), t[3] = "";
        }
      }
      let i = t[2], r = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(i);
        a && (i = a[1], r = a[3]);
      } else r = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Oi(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let i = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[i.toLowerCase()];
      if (!r) {
        let a = n[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return Oi(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, h = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = h.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (s = [...a].length, i[3] || i[4]) {
          l += s;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + s) % 3)) {
          o += s;
          continue;
        }
        if (l -= s, l > 0) continue;
        s = Math.min(s, s + l + o);
        let c = [...i[0]][0].length, u = e.slice(0, r + i.index + c + s);
        if (Math.min(r, s) % 2) {
          let f = u.slice(1, -1);
          return { type: "em", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let d = u.slice(2, -2);
        return { type: "strong", raw: u, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return i && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let i = this.rules.inline.delLDelim.exec(e);
    if (i && (!i[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = o.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          l += s;
          continue;
        }
        if (l -= s, l > 0) continue;
        s = Math.min(s, s + l);
        let h = [...i[0]][0].length, c = e.slice(0, r + i.index + h + s), u = c.slice(r, -r);
        return { type: "del", raw: c, text: u, tokens: this.lexer.inlineTokens(u) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, i;
      return t[2] === "@" ? (n = t[1], i = "mailto:" + n) : (n = t[1], i = n), { type: "link", raw: t[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, i;
      if (t[2] === "@") n = t[0], i = "mailto:" + n;
      else {
        let r;
        do
          r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (r !== t[0]);
        n = t[0], t[1] === "www." ? i = "http://" + t[0] : i = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
}, dt = class Pr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Ot, this.options.tokenizer = this.options.tokenizer || new Cn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: ot, block: qn.normal, inline: on.normal };
    this.options.pedantic ? (n.block = qn.pedantic, n.inline = on.pedantic) : this.options.gfm && (n.block = qn.gfm, this.options.breaks ? n.inline = on.breaks : n.inline = on.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: qn, inline: on };
  }
  static lex(t, n) {
    return new Pr(n).lex(t);
  }
  static lexInline(t, n) {
    return new Pr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(ot.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(ot.tabCharGlobal, "    ").replace(ot.spaceLine, "")); t; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, t, n)) ? (t = t.substring(r.raw.length), n.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(t)) {
        t = t.substring(r.raw.length);
        let s = n.at(-1);
        r.raw.length === 1 && s !== void 0 ? s.raw += `
` : n.push(r);
        continue;
      }
      if (r = this.tokenizer.code(t)) {
        t = t.substring(r.raw.length);
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : n.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.list(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.html(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.def(t)) {
        t = t.substring(r.raw.length);
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, n.push(r));
        continue;
      }
      if (r = this.tokenizer.table(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(t)) {
        t = t.substring(r.raw.length), n.push(r);
        continue;
      }
      let a = t;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, l = t.slice(1), o;
        this.options.extensions.startBlock.forEach((h) => {
          o = h.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
        }), s < 1 / 0 && s >= 0 && (a = t.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(a))) {
        let s = n.at(-1);
        i && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(r), i = a.length !== t.length, t = t.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(t)) {
        t = t.substring(r.raw.length);
        let s = n.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(r);
        continue;
      }
      if (t) {
        let s = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else throw new Error(s);
      }
    }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  inlineTokens(t, n = []) {
    let i = t, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, r.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let a;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) a = r[2] ? r[2].length : 0, i = i.slice(0, r.index + a) + "[" + "a".repeat(r[0].length - a - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let s = !1, l = "";
    for (; t; ) {
      s || (l = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((c) => (o = c.call({ lexer: this }, t, n)) ? (t = t.substring(o.raw.length), n.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.link(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(o.raw.length);
        let c = n.at(-1);
        o.type === "text" && c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(t, i, l)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.br(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.del(t, i, l)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(t)) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(t))) {
        t = t.substring(o.raw.length), n.push(o);
        continue;
      }
      let h = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, u = t.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (c = Math.min(c, d));
        }), c < 1 / 0 && c >= 0 && (h = t.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(h)) {
        t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (l = o.raw.slice(-1)), s = !0;
        let c = n.at(-1);
        c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
        continue;
      }
      if (t) {
        let c = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else throw new Error(c);
      }
    }
    return n;
  }
}, Mn = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Ot;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(ot.notSpaceStart)?.[0], r = e.replace(ot.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + _t(i) + '">' + (n ? r : _t(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : _t(r, !0)) + `</code></pre>
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
    let t = e.ordered, n = e.start, i = "";
    for (let s = 0; s < e.items.length; s++) {
      let l = e.items[s];
      i += this.listitem(l);
    }
    let r = t ? "ol" : "ul", a = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + a + `>
` + i + "</" + r + `>
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
    for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let i = "";
    for (let r = 0; r < e.rows.length; r++) {
      let a = e.rows[r];
      n = "";
      for (let s = 0; s < a.length; s++) n += this.tablecell(a[s]);
      i += this.tablerow({ text: n });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + i + `</table>
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
    return `<code>${_t(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Ii(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + _t(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Ii(e);
    if (r === null) return _t(n);
    e = r;
    let a = `<img src="${e}" alt="${_t(n)}"`;
    return t && (a += ` title="${_t(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : _t(e.text);
  }
}, cr = class {
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
}, ft = class $r {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || Ot, this.options.renderer = this.options.renderer || new Mn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new cr();
  }
  static parse(t, n) {
    return new $r(n).parse(t);
  }
  static parseInline(t, n) {
    return new $r(n).parseInline(t);
  }
  parse(t) {
    let n = "";
    for (let i = 0; i < t.length; i++) {
      let r = t[i];
      if (this.options.extensions?.renderers?.[r.type]) {
        let s = r, l = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
          n += l || "";
          continue;
        }
      }
      let a = r;
      switch (a.type) {
        case "space": {
          n += this.renderer.space(a);
          break;
        }
        case "hr": {
          n += this.renderer.hr(a);
          break;
        }
        case "heading": {
          n += this.renderer.heading(a);
          break;
        }
        case "code": {
          n += this.renderer.code(a);
          break;
        }
        case "table": {
          n += this.renderer.table(a);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(a);
          break;
        }
        case "list": {
          n += this.renderer.list(a);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(a);
          break;
        }
        case "html": {
          n += this.renderer.html(a);
          break;
        }
        case "def": {
          n += this.renderer.def(a);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(a);
          break;
        }
        case "text": {
          n += this.renderer.text(a);
          break;
        }
        default: {
          let s = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(s), "";
          throw new Error(s);
        }
      }
    }
    return n;
  }
  parseInline(t, n = this.renderer) {
    let i = "";
    for (let r = 0; r < t.length; r++) {
      let a = t[r];
      if (this.options.extensions?.renderers?.[a.type]) {
        let l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          i += l || "";
          continue;
        }
      }
      let s = a;
      switch (s.type) {
        case "escape": {
          i += n.text(s);
          break;
        }
        case "html": {
          i += n.html(s);
          break;
        }
        case "link": {
          i += n.link(s);
          break;
        }
        case "image": {
          i += n.image(s);
          break;
        }
        case "checkbox": {
          i += n.checkbox(s);
          break;
        }
        case "strong": {
          i += n.strong(s);
          break;
        }
        case "em": {
          i += n.em(s);
          break;
        }
        case "codespan": {
          i += n.codespan(s);
          break;
        }
        case "br": {
          i += n.br(s);
          break;
        }
        case "del": {
          i += n.del(s);
          break;
        }
        case "text": {
          i += n.text(s);
          break;
        }
        default: {
          let l = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return i;
  }
}, Vt = class {
  options;
  block;
  constructor(e) {
    this.options = e || Ot;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
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
  provideLexer() {
    return this.block ? dt.lex : dt.lexInline;
  }
  provideParser() {
    return this.block ? ft.parse : ft.parseInline;
  }
}, Ra = class {
  defaults = sr();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ft;
  Renderer = Mn;
  TextRenderer = cr;
  Lexer = dt;
  Tokenizer = Cn;
  Hooks = Vt;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let i of e) switch (n = n.concat(t.call(this, i)), i.type) {
      case "table": {
        let r = i;
        for (let a of r.header) n = n.concat(this.walkTokens(a.tokens, t));
        for (let a of r.rows) for (let s of a) n = n.concat(this.walkTokens(s.tokens, t));
        break;
      }
      case "list": {
        let r = i;
        n = n.concat(this.walkTokens(r.items, t));
        break;
      }
      default: {
        let r = i;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((a) => {
          let s = r[a].flat(1 / 0);
          n = n.concat(this.walkTokens(s, t));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let a = t.renderers[r.name];
          a ? t.renderers[r.name] = function(...s) {
            let l = r.renderer.apply(this, s);
            return l === !1 && (l = a.apply(this, s)), l;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = t[r.level];
          a ? a.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), i.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new Mn(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, l = n.renderer[s], o = r[s];
          r[s] = (...h) => {
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Cn(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, l = n.tokenizer[s], o = r[s];
          r[s] = (...h) => {
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Vt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          Vt.passThroughHooks.has(a) ? r[s] = (h) => {
            if (this.defaults.async && Vt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await l.call(r, h);
              return o.call(r, u);
            })();
            let c = l.call(r, h);
            return o.call(r, c);
          } : r[s] = (...h) => {
            if (this.defaults.async) return (async () => {
              let u = await l.apply(r, h);
              return u === !1 && (u = await o.apply(r, h)), u;
            })();
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, a = n.walkTokens;
        i.walkTokens = function(s) {
          let l = [];
          return l.push(a.call(this, s)), r && (l = l.concat(r.call(this, s))), l;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return dt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return ft.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, l = await (r.hooks ? await r.hooks.provideLexer() : e ? dt.lex : dt.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let h = await (r.hooks ? await r.hooks.provideParser() : e ? ft.parse : ft.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? dt.lex : dt.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : e ? ft.parse : ft.parseInline)(s, r);
        return r.hooks && (l = r.hooks.postprocess(l)), l;
      } catch (s) {
        return a(s);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let i = "<p>An error occurred:</p><pre>" + _t(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Gt = new Ra();
function Ae(e, t) {
  return Gt.parse(e, t);
}
Ae.options = Ae.setOptions = function(e) {
  return Gt.setOptions(e), Ae.defaults = Gt.defaults, wa(Ae.defaults), Ae;
};
Ae.getDefaults = sr;
Ae.defaults = Ot;
Ae.use = function(...e) {
  return Gt.use(...e), Ae.defaults = Gt.defaults, wa(Ae.defaults), Ae;
};
Ae.walkTokens = function(e, t) {
  return Gt.walkTokens(e, t);
};
Ae.parseInline = Gt.parseInline;
Ae.Parser = ft;
Ae.parser = ft.parse;
Ae.Renderer = Mn;
Ae.TextRenderer = cr;
Ae.Lexer = dt;
Ae.lexer = dt.lex;
Ae.Tokenizer = Cn;
Ae.Hooks = Vt;
Ae.parse = Ae;
var Jo = Ae.options, el = Ae.setOptions, tl = Ae.use, nl = Ae.walkTokens, rl = Ae.parseInline, il = Ae, al = ft.parse, sl = dt.lex;
const Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Vt,
  Lexer: dt,
  Marked: Ra,
  Parser: ft,
  Renderer: Mn,
  TextRenderer: cr,
  Tokenizer: Cn,
  get defaults() {
    return Ot;
  },
  getDefaults: sr,
  lexer: sl,
  marked: Ae,
  options: Jo,
  parse: il,
  parseInline: rl,
  parser: al,
  setOptions: el,
  use: tl,
  walkTokens: nl
}, Symbol.toStringTag, { value: "Module" })), ol = `/**
 * @module worker/renderer
 */
import * as _markedModule from 'marked'
import { parseFrontmatter } from '../utils/frontmatter.js'
import { importUrlWithCache, runImportWithCache, clearImportCache, setImportNegativeCacheTTL } from '../utils/importCache.js'

// Lightweight local HTML entity decoder to avoid importing utils in worker
function decodeHtmlEntitiesLocal(s) {
  try {
    if (!s && s !== 0) return ''
    const str = String(s)
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
      if (!g) return m
      if (g[0] === '#') {
        try {
          if (g[1] === 'x' || g[1] === 'X') return String.fromCharCode(parseInt(g.slice(2), 16))
          return String.fromCharCode(parseInt(g.slice(1), 10))
        } catch (e) {
          return m
        }
      }
      return (named[g] !== undefined) ? named[g] : m
    })
  } catch (err) {
    return String(s || '')
  }
}

const marked = (_markedModule && (_markedModule.marked || _markedModule)) || undefined

// Hoisted regex and helpers to avoid reallocation per-message
const FENCE_RE = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g
const FALLBACK_KNOWN = new Set(['bash','sh','zsh','javascript','js','python','py','php','java','c','cpp','rust','go','ruby','perl','r','scala','swift','kotlin','cs','csharp','html','css','json','xml','yaml','yml','dockerfile','docker'])
function slugifyHeading(s) { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, '').replace(/\\s+/g, '-') } catch (e) { return 'heading' } }

/**
 * Worker entrypoint for rendering markdown to HTML and registering
 * highlight.js languages on demand.
 *
 * Accepted messages:
 * - \`{ type: 'register', name: string, url: string }\` — dynamically import
 *   a highlight.js language module and register it. Replies with
 *   \`{ type: 'registered', name }\` or \`{ type: 'register-error', name, error }\`.
 * - \`{ id: string, md: string }\` — render \`md\` (which may contain frontmatter)
 *   and reply with \`{ id, result: { html: string, meta: Record<string,string>, toc: Array<{level:number,text:string}> } }\`.
 *
 * On error the worker posts \`{ id, error: string }\`.
 */

/**
 * Worker \`onmessage\` handler for renderer tasks is defined below. The worker
 * listens for messages like \`{ type: 'register', name, url }\`, \`{ type: 'detect', id, md, supported }\`,
 * or rendering requests \`{ id, md }\` and replies with \`{ id, result }\` or \`{ id, error }\`.
 *
 * The top-level \`onmessage\` assignment directly handles posting results; see function body below.
 */

let hljs = null
const HLJS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/highlight.js'

/** Clear renderer import cache (useful for tests). */
export function clearRendererImportCache() { clearImportCache(); hljs = null }

/** Adjust negative-cache TTL for renderer dynamic imports. */
export function setRendererImportNegativeCacheTTL(ms) { setImportNegativeCacheTTL(ms) }

/** Import a module URL using the shared import cache. */
async function importModuleWithCache(url) { return await importUrlWithCache(url) }

async function ensureHljs() {
  if (hljs) return hljs
    try {
      const url = HLJS_CDN_BASE + '/lib/core.js'
      // Try a static import for the known CDN core path so test mocks
      // (vitest \`vi.mock('https://cdn.jsdelivr.net/...')\`) can intercept it.
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
        if (mod) {
          hljs = mod.default || mod
          try { await runImportWithCache(url, async () => mod) } catch (_) {}
        } else {
          hljs = null
        }
      } catch (e) {
        const mod = await importModuleWithCache(url)
        if (mod) hljs = mod.default || mod
        else hljs = null
      }
    } catch (e) {
      hljs = null
    }
  return hljs
}

function extractToc(md) {
  const lines = md.split('\\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

if (marked && typeof marked.setOptions === 'function') {
  marked.setOptions({
  gfm: true,
  headerIds: true,
  mangle: false,
    highlighted: (code, lang) => {
    try {
      if (hljs && lang && typeof hljs.getLanguage === 'function' && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
      if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
        return hljs.highlight(code, { language: 'plaintext' }).value
      }
      return code
    } catch (e) {
      return code
    }
  }
  })
}

/**
 * Worker \`onmessage\` handler implementation for renderer (attached to global \`onmessage\`).
 * @param {MessageEvent} ev - Event carrying the request data in \`ev.data\`.
 * @returns {Promise<void>} Posts worker reply messages (\`{id, result}\` or \`{id, error}\`).
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) {
          postMessage({ type: 'register-error', name, error: 'hljs unavailable' })
          return
        }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) throw new Error('failed to import language module')
        hljs.registerLanguage(name, lang)
        postMessage({ type: 'registered', name })
      } catch (e) {
        postMessage({ type: 'register-error', name, error: String(e) })
      }
      return
    }

    if (msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      postMessage({ id: msg.id, result: Array.from(res) })
      return
    }

    const { id, md } = msg
    const { content, data } = parseFrontmatter(md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)
    
    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      heads.push({ level, text, id: candidate })
      const resp = {
        1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
        2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
        3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
        4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
        5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
        6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
      }
      const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
      const classes = (resp[level] + ' ' + weight).trim()
      const cleanAttrs = (attrs || '').replace(/\\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + \` id="\${candidate}" class="\${classes}"\`).trim()
      return \`<h\${level} \${newAttrs}>\${inner}</h\${level}>\`
    })

    html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
      if (/\\bloading=/.test(attrs)) return \`<img\${attrs}>\`
      if (/\\bdata-want-lazy=/.test(attrs)) return \`<img\${attrs}>\`
      return \`<img\${attrs} loading="lazy">\`
    })
    postMessage({ id, result: { html, meta: data || {}, toc: heads } })
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process renderer worker messages outside of a Worker.
 * @param {Object} msg - Message object sent to the renderer (see worker accepted messages above).
 * @returns {Promise<Object>} Response shaped like worker replies: \`{id, result}\` or \`{id, error}\`.
 */
export async function handleWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) return { type: 'register-error', name, error: 'hljs unavailable' }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) return { type: 'register-error', name, error: 'failed to import language module' }
        hljs.registerLanguage(name, lang)
        return { type: 'registered', name }
      } catch (e) {
        return { type: 'register-error', name, error: String(e) }
      }
    }

    if (msg && msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      return { id: msg.id, result: Array.from(res) }
    }

    const id = msg && msg.id
    const { content, data } = parseFrontmatter(msg && msg.md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)

    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      heads.push({ level, text, id: candidate })
      const resp = {
        1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
        2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
        3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
        4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
        5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
        6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
      }
      const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
      const classes = (resp[level] + ' ' + weight).trim()
      const cleanAttrs = (attrs || '').replace(/\\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + \` id="\${candidate}" class="\${classes}"\`).trim()
      return \`<h\${level} \${newAttrs}>\${inner}</h\${level}>\`
    })

    html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
      if (/\\bloading=/.test(attrs)) return \`<img\${attrs}>\`
      if (/\\bdata-want-lazy=/.test(attrs)) return \`<img\${attrs}>\`
      return \`<img\${attrs} loading="lazy">\`
    })

    return { id, result: { html, meta: data || {}, toc: heads } }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`, za = `function H() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = H();
function ue(s) {
  $ = s;
}
var z = { exec: () => null };
function f(s, e = "") {
  let r = typeof s == "string" ? s : s.source, n = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(m.caret, "$1"), r = r.replace(t, i), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Pe = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ee = /^(?:[ \\t]*(?:\\n|$))+/, Le = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Ce = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, q = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ie = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, K = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, ge = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, fe = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Me = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), U = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Be = /^[^\\n]+/, J = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, qe = f(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", J).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), De = f(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, K).getRegex(), N = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", V = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ze = f("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", V).replace("tag", N).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ke = f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), je = f(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ke).getRegex(), Y = { blockquote: je, code: Le, def: qe, fences: Ce, heading: Ie, hr: q, html: Ze, lheading: fe, list: De, newline: Ee, paragraph: ke, table: z, text: Be }, se = f("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), He = { ...Y, lheading: Me, table: se, paragraph: f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex() }, Ne = { ...Y, html: f(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", V).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: z, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: f(U).replace("hr", q).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", fe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Oe = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Qe = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, de = /^( {2,}|\\\\)\\n(?!\\s*$)/, Ge = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, O = /[\\p{P}\\p{S}]/u, ee = /[\\s\\p{P}\\p{S}]/u, xe = /[^\\s\\p{P}\\p{S}]/u, We = f(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ee).getRegex(), be = /(?!~)[\\p{P}\\p{S}]/u, Fe = /(?!~)[\\s\\p{P}\\p{S}]/u, Xe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, me = /(?![*_])[\\p{P}\\p{S}]/u, Ke = /(?![*_])[\\s\\p{P}\\p{S}]/u, Ue = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Je = f(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Pe ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), we = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Ve = f(we, "u").replace(/punct/g, O).getRegex(), Ye = f(we, "u").replace(/punct/g, be).getRegex(), ye = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", et = f(ye, "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), tt = f(ye, "gu").replace(/notPunctSpace/g, Xe).replace(/punctSpace/g, Fe).replace(/punct/g, be).getRegex(), rt = f("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), st = f(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, me).getRegex(), nt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", it = f(nt, "gu").replace(/notPunctSpace/g, Ue).replace(/punctSpace/g, Ke).replace(/punct/g, me).getRegex(), lt = f(/\\\\(punct)/, "gu").replace(/punct/g, O).getRegex(), at = f(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ot = f(V).replace("(?:-->|$)", "-->").getRegex(), ct = f("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", ot).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), j = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, ht = f(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", j).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), Se = f(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", j).replace("ref", J).getRegex(), $e = f(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", J).getRegex(), pt = f("reflink|nolink(?!\\\\()", "g").replace("reflink", Se).replace("nolink", $e).getRegex(), ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, te = { _backpedal: z, anyPunctuation: lt, autolink: at, blockSkip: Je, br: de, code: Qe, del: z, delLDelim: z, delRDelim: z, emStrongLDelim: Ve, emStrongRDelimAst: et, emStrongRDelimUnd: rt, escape: Oe, link: ht, nolink: $e, punctuation: We, reflink: Se, reflinkSearch: pt, tag: ct, text: Ge, url: z }, ut = { ...te, link: f(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", j).getRegex(), reflink: f(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", j).getRegex() }, W = { ...te, emStrongRDelimAst: tt, emStrongLDelim: Ye, delLDelim: st, delRDelim: it, url: f(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: f(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", ne).getRegex() }, gt = { ...W, br: f(de).replace("{2,}", "*").getRegex(), text: f(W.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, D = { normal: Y, gfm: He, pedantic: Ne }, C = { normal: te, gfm: W, breaks: gt, pedantic: ut }, ft = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ie = (s) => ft[s];
function S(s, e) {
  if (e) {
    if (m.escapeTest.test(s)) return s.replace(m.escapeReplace, ie);
  } else if (m.escapeTestNoEncode.test(s)) return s.replace(m.escapeReplaceNoEncode, ie);
  return s;
}
function le(s) {
  try {
    s = encodeURI(s).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function ae(s, e) {
  let r = s.replace(m.findPipe, (l, i, o) => {
    let a = !1, h = i;
    for (; --h >= 0 && o[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function I(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function kt(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function dt(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let l = 4 - r % 4;
    n += " ".repeat(l), r += l;
  } else n += t, r++;
  return n;
}
function oe(s, e, r, n, t) {
  let l = e.href, i = e.title || null, o = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: l, title: i, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = !1, a;
}
function xt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((l) => {
    let i = l.match(r.other.beginningSpace);
    if (i === null) return l;
    let [o] = i;
    return o.length >= t.length ? l.slice(t.length) : l;
  }).join(\`
\`);
}
var M = class {
  options;
  rules;
  lexer;
  constructor(s) {
    this.options = s || $;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : I(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = xt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = I(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: I(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = I(e[0], \`
\`).split(\`
\`), n = "", t = "", l = [];
      for (; r.length > 0; ) {
        let i = !1, o = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) o.push(r[a]), i = !0;
        else if (!i) o.push(r[a]);
        else break;
        r = r.slice(a);
        let h = o.join(\`
\`), c = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${c}\` : c;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, l, !0), this.lexer.state.top = p, r.length === 0) break;
        let u = l.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.blockquote(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - d.raw.length) + x.raw, t = t.substring(0, t.length - d.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.list(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - d.raw.length) + x.raw, r = g.substring(l.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: l, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = n ? r : "[*+-]");
      let l = this.rules.other.listItemRegex(r), i = !1;
      for (; s; ) {
        let a = !1, h = "", c = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = dt(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), A = this.rules.other.hrRegex(g), E = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), re = this.rules.other.htmlBeginRegex(g), L = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let v = s.split(\`
\`, 1)[0], _;
            if (u = v, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), _ = u) : _ = u.replace(this.rules.other.tabCharGlobal, "    "), E.test(u) || R.test(u) || re.test(u) || L.test(u) || x.test(u) || A.test(u)) break;
            if (_.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) c += \`
\` + _.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || E.test(p) || R.test(p) || A.test(p)) break;
              c += \`
\` + u;
            }
            d = !u.trim(), h += v + \`
\`, s = s.substring(v.length + 1), p = _.slice(g);
          }
        }
        t.loose || (i ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (i = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), t.raw += h;
      }
      let o = t.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let a of t.items) {
        if (this.lexer.state.top = !1, a.tokens = this.lexer.blockTokens(a.text, []), a.task) {
          if (a.text = a.text.replace(this.rules.other.listReplaceTask, ""), a.tokens[0]?.type === "text" || a.tokens[0]?.type === "paragraph") {
            a.tokens[0].raw = a.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), a.tokens[0].text = a.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
              this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (h) {
            let c = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            a.checked = c.checked, t.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = c.raw + a.tokens[0].raw, a.tokens[0].text = c.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(c)) : a.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : a.tokens.unshift(c);
          }
        }
        if (!t.loose) {
          let h = a.tokens.filter((p) => p.type === "space"), c = h.length > 0 && h.some((p) => this.rules.other.anyLine.test(p.raw));
          t.loose = c;
        }
      }
      if (t.loose) for (let a of t.items) {
        a.loose = !0;
        for (let h of a.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return t;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: n, title: t };
    }
  }
  table(s) {
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = ae(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < r.length; i++) l.header.push({ text: r[i], tokens: this.lexer.inline(r[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(ae(i, l.header.length).map((o, a) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[a] })));
      return l;
    }
  }
  lheading(s) {
    let e = this.rules.block.lheading.exec(s);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(s) {
    let e = this.rules.block.paragraph.exec(s);
    if (e) {
      let r = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(s) {
    let e = this.rules.block.text.exec(s);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(s) {
    let e = this.rules.inline.escape.exec(s);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(s) {
    let e = this.rules.inline.tag.exec(s);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(s) {
    let e = this.rules.inline.link.exec(s);
    if (e) {
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let l = I(r.slice(0, -1), "\\\\");
        if ((r.length - l.length) % 2 === 0) return;
      } else {
        let l = kt(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let i = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, i).trim(), e[3] = "";
        }
      }
      let n = e[2], t = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(n);
        l && (n = l[1], t = l[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), oe(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(s)) || (r = this.rules.inline.nolink.exec(s))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let l = r[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return oe(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, l, i, o = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (i = [...l].length, n[3] || n[4]) {
          o += i;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + i) % 3)) {
          a += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o + a);
        let c = [...n[0]][0].length, p = s.slice(0, t + n.index + c + i);
        if (Math.min(t, i) % 2) {
          let d = p.slice(1, -1);
          return { type: "em", raw: p, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let u = p.slice(2, -2);
        return { type: "strong", raw: p, text: u, tokens: this.lexer.inlineTokens(u) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(r), t = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return n && t && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s, e, r = "") {
    let n = this.rules.inline.delLDelim.exec(s);
    if (n && (!n[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, l, i, o = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l || (i = [...l].length, i !== t)) continue;
        if (n[3] || n[4]) {
          o += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o);
        let h = [...n[0]][0].length, c = s.slice(0, t + n.index + h + i), p = c.slice(t, -t);
        return { type: "del", raw: c, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let r, n;
      return e[2] === "@" ? (r = e[1], n = "mailto:" + r) : (r = e[1], n = r), { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(s) {
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let r, n;
      if (e[2] === "@") r = e[0], n = "mailto:" + r;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        r = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, w = class F {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new M(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: D.normal, inline: C.normal };
    this.options.pedantic ? (r.block = D.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = D.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: D, inline: C };
  }
  static lex(e, r) {
    return new F(r).lex(e);
  }
  static lexInline(e, r) {
    return new F(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let n = this.inlineQueue[r];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], n = !1) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
      let t;
      if (this.options.extensions?.block?.some((i) => (t = i.call({ lexer: this }, e, r)) ? (e = e.substring(t.raw.length), r.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        t.raw.length === 1 && i !== void 0 ? i.raw += \`
\` : r.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.at(-1).src = i.text) : r.push(t);
        continue;
      }
      if (t = this.tokenizer.fences(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.heading(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.hr(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.blockquote(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.list(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.html(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.def(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, r.push(t));
        continue;
      }
      if (t = this.tokenizer.table(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      if (t = this.tokenizer.lheading(e)) {
        e = e.substring(t.raw.length), r.push(t);
        continue;
      }
      let l = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (i = Math.min(i, a));
        }), i < 1 / 0 && i >= 0 && (l = e.substring(0, i + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(l))) {
        let i = r.at(-1);
        n && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t), n = l.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t);
        continue;
      }
      if (e) {
        let i = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(i);
          break;
        } else throw new Error(i);
      }
    }
    return this.state.top = !0, r;
  }
  inline(e, r = []) {
    return this.inlineQueue.push({ src: e, tokens: r }), r;
  }
  inlineTokens(e, r = []) {
    let n = e, t = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) a.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, t.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let l;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) l = t[2] ? t[2].length : 0, n = n.slice(0, t.index + l) + "[" + "a".repeat(t[0].length - l - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = !1, o = "";
    for (; e; ) {
      i || (o = ""), i = !1;
      let a;
      if (this.options.extensions?.inline?.some((c) => (a = c.call({ lexer: this }, e, r)) ? (e = e.substring(a.raw.length), r.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        let c = r.at(-1);
        a.type === "text" && c?.type === "text" ? (c.raw += a.raw, c.text += a.text) : r.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, o)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e, n, o)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      let h = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
        }), c < 1 / 0 && c >= 0 && (h = e.substring(0, c + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), i = !0;
        let c = r.at(-1);
        c?.type === "text" ? (c.raw += a.raw, c.text += a.text) : r.push(a);
        continue;
      }
      if (e) {
        let c = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else throw new Error(c);
      }
    }
    return r;
  }
}, B = class {
  options;
  parser;
  constructor(s) {
    this.options = s || $;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: r }) {
    let n = (e || "").match(m.notSpaceStart)?.[0], t = s.replace(m.endingNewline, "") + \`
\`;
    return n ? '<pre><code class="language-' + S(n) + '">' + (r ? t : S(t, !0)) + \`</code></pre>
\` : "<pre><code>" + (r ? t : S(t, !0)) + \`</code></pre>
\`;
  }
  blockquote({ tokens: s }) {
    return \`<blockquote>
\${this.parser.parse(s)}</blockquote>
\`;
  }
  html({ text: s }) {
    return s;
  }
  def(s) {
    return "";
  }
  heading({ tokens: s, depth: e }) {
    return \`<h\${e}>\${this.parser.parseInline(s)}</h\${e}>
\`;
  }
  hr(s) {
    return \`<hr>
\`;
  }
  list(s) {
    let e = s.ordered, r = s.start, n = "";
    for (let i = 0; i < s.items.length; i++) {
      let o = s.items[i];
      n += this.listitem(o);
    }
    let t = e ? "ol" : "ul", l = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + l + \`>
\` + n + "</" + t + \`>
\`;
  }
  listitem(s) {
    return \`<li>\${this.parser.parse(s.tokens)}</li>
\`;
  }
  checkbox({ checked: s }) {
    return "<input " + (s ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: s }) {
    return \`<p>\${this.parser.parseInline(s)}</p>
\`;
  }
  table(s) {
    let e = "", r = "";
    for (let t = 0; t < s.header.length; t++) r += this.tablecell(s.header[t]);
    e += this.tablerow({ text: r });
    let n = "";
    for (let t = 0; t < s.rows.length; t++) {
      let l = s.rows[t];
      r = "";
      for (let i = 0; i < l.length; i++) r += this.tablecell(l[i]);
      n += this.tablerow({ text: r });
    }
    return n && (n = \`<tbody>\${n}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + n + \`</table>
\`;
  }
  tablerow({ text: s }) {
    return \`<tr>
\${s}</tr>
\`;
  }
  tablecell(s) {
    let e = this.parser.parseInline(s.tokens), r = s.header ? "th" : "td";
    return (s.align ? \`<\${r} align="\${s.align}">\` : \`<\${r}>\`) + e + \`</\${r}>
\`;
  }
  strong({ tokens: s }) {
    return \`<strong>\${this.parser.parseInline(s)}</strong>\`;
  }
  em({ tokens: s }) {
    return \`<em>\${this.parser.parseInline(s)}</em>\`;
  }
  codespan({ text: s }) {
    return \`<code>\${S(s, !0)}</code>\`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return \`<del>\${this.parser.parseInline(s)}</del>\`;
  }
  link({ href: s, title: e, tokens: r }) {
    let n = this.parser.parseInline(r), t = le(s);
    if (t === null) return n;
    s = t;
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + S(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let t = le(s);
    if (t === null) return S(r);
    s = t;
    let l = \`<img src="\${s}" alt="\${S(r)}"\`;
    return e && (l += \` title="\${S(e)}"\`), l += ">", l;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : S(s.text);
  }
}, Q = class {
  strong({ text: s }) {
    return s;
  }
  em({ text: s }) {
    return s;
  }
  codespan({ text: s }) {
    return s;
  }
  del({ text: s }) {
    return s;
  }
  html({ text: s }) {
    return s;
  }
  text({ text: s }) {
    return s;
  }
  link({ text: s }) {
    return "" + s;
  }
  image({ text: s }) {
    return "" + s;
  }
  br() {
    return "";
  }
  checkbox({ raw: s }) {
    return s;
  }
}, y = class X {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new B(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new X(r).parse(e);
  }
  static parseInline(e, r) {
    return new X(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let i = t, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          r += o || "";
          continue;
        }
      }
      let l = t;
      switch (l.type) {
        case "space": {
          r += this.renderer.space(l);
          break;
        }
        case "hr": {
          r += this.renderer.hr(l);
          break;
        }
        case "heading": {
          r += this.renderer.heading(l);
          break;
        }
        case "code": {
          r += this.renderer.code(l);
          break;
        }
        case "table": {
          r += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          r += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          r += this.renderer.html(l);
          break;
        }
        case "def": {
          r += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          r += this.renderer.text(l);
          break;
        }
        default: {
          let i = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let l = e[t];
      if (this.options.extensions?.renderers?.[l.type]) {
        let o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          n += o || "";
          continue;
        }
      }
      let i = l;
      switch (i.type) {
        case "escape": {
          n += r.text(i);
          break;
        }
        case "html": {
          n += r.html(i);
          break;
        }
        case "link": {
          n += r.link(i);
          break;
        }
        case "image": {
          n += r.image(i);
          break;
        }
        case "checkbox": {
          n += r.checkbox(i);
          break;
        }
        case "strong": {
          n += r.strong(i);
          break;
        }
        case "em": {
          n += r.em(i);
          break;
        }
        case "codespan": {
          n += r.codespan(i);
          break;
        }
        case "br": {
          n += r.br(i);
          break;
        }
        case "del": {
          n += r.del(i);
          break;
        }
        case "text": {
          n += r.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, P = class {
  options;
  block;
  constructor(s) {
    this.options = s || $;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(s) {
    return s;
  }
  postprocess(s) {
    return s;
  }
  processAllTokens(s) {
    return s;
  }
  emStrongMask(s) {
    return s;
  }
  provideLexer() {
    return this.block ? w.lex : w.lexInline;
  }
  provideParser() {
    return this.block ? y.parse : y.parseInline;
  }
}, Re = class {
  defaults = H();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = B;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = M;
  Hooks = P;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let r = [];
    for (let n of s) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let l of t.header) r = r.concat(this.walkTokens(l.tokens, e));
        for (let l of t.rows) for (let i of l) r = r.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((l) => {
          let i = t[l].flat(1 / 0);
          r = r.concat(this.walkTokens(i, e));
        }) : t.tokens && (r = r.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return r;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((r) => {
      let n = { ...r };
      if (n.async = this.defaults.async || n.async || !1, r.extensions && (r.extensions.forEach((t) => {
        if (!t.name) throw new Error("extension name required");
        if ("renderer" in t) {
          let l = e.renderers[t.name];
          l ? e.renderers[t.name] = function(...i) {
            let o = t.renderer.apply(this, i);
            return o === !1 && (o = l.apply(this, i)), o;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[t.level];
          l ? l.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new B(this.defaults);
        for (let l in r.renderer) {
          if (!(l in t)) throw new Error(\`renderer '\${l}' does not exist\`);
          if (["options", "parser"].includes(l)) continue;
          let i = l, o = r.renderer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new M(this.defaults);
        for (let l in r.tokenizer) {
          if (!(l in t)) throw new Error(\`tokenizer '\${l}' does not exist\`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let i = l, o = r.tokenizer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new P();
        for (let l in r.hooks) {
          if (!(l in t)) throw new Error(\`hook '\${l}' does not exist\`);
          if (["options", "block"].includes(l)) continue;
          let i = l, o = r.hooks[i], a = t[i];
          P.passThroughHooks.has(l) ? t[i] = (h) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(l)) return (async () => {
              let p = await o.call(t, h);
              return a.call(t, p);
            })();
            let c = o.call(t, h);
            return a.call(t, c);
          } : t[i] = (...h) => {
            if (this.defaults.async) return (async () => {
              let p = await o.apply(t, h);
              return p === !1 && (p = await a.apply(t, h)), p;
            })();
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, l = r.walkTokens;
        n.walkTokens = function(i) {
          let o = [];
          return o.push(l.call(this, i)), t && (o = o.concat(t.call(this, i))), o;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(s) {
    return this.defaults = { ...this.defaults, ...s }, this;
  }
  lexer(s, e) {
    return w.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return y.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, r) => {
      let n = { ...r }, t = { ...this.defaults, ...n }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, o = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(i, t), a = t.hooks ? await t.hooks.processAllTokens(o) : o;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let o = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(i, t);
        return t.hooks && (o = t.hooks.postprocess(o)), o;
      } catch (i) {
        return l(i);
      }
    };
  }
  onError(s, e) {
    return (r) => {
      if (r.message += \`
Please report this to https://github.com/markedjs/marked.\`, s) {
        let n = "<p>An error occurred:</p><pre>" + S(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, T = new Re();
function k(s, e) {
  return T.parse(s, e);
}
k.options = k.setOptions = function(s) {
  return T.setOptions(s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.getDefaults = H;
k.defaults = $;
k.use = function(...s) {
  return T.use(...s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.walkTokens = function(s, e) {
  return T.walkTokens(s, e);
};
k.parseInline = T.parseInline;
k.Parser = y;
k.parser = y.parse;
k.Renderer = B;
k.TextRenderer = Q;
k.Lexer = w;
k.lexer = w.lex;
k.Tokenizer = M;
k.Hooks = P;
k.parse = k;
var bt = k.options, mt = k.setOptions, wt = k.use, yt = k.walkTokens, St = k.parseInline, $t = k, Rt = y.parse, _t = w.lex, ce = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: P,
  Lexer: w,
  Marked: Re,
  Parser: y,
  Renderer: B,
  TextRenderer: Q,
  Tokenizer: M,
  get defaults() {
    return $;
  },
  getDefaults: H,
  lexer: _t,
  marked: k,
  options: bt,
  parse: $t,
  parseInline: St,
  parser: Rt,
  setOptions: mt,
  use: wt,
  walkTokens: yt
});
function zt(s) {
  if (s.startsWith("---")) {
    const e = s.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = s.slice(3, e + 0).trim(), n = s.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((l) => {
        const i = l.match(/^([^:]+):\\s*(.*)$/);
        i && (t[i[1].trim()] = i[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: s, data: {} };
}
class Tt {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(e = {}) {
    const { maxSize: r = 0, ttlMs: n = 0, onEvict: t = null } = e || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(r) || 0), this._ttlMs = Math.max(0, Number(n) || 0), this._onEvict = typeof t == "function" ? t : null;
  }
  get size() {
    return this._map.size;
  }
  /**
   * Check if key exists and is not expired.
   * @param {*} key
   * @returns {boolean}
   */
  has(e) {
    const r = this._map.get(e);
    return r ? this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs ? (this._evictKey(e, r), !1) : (this._map.delete(e), this._map.set(e, r), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(e) {
    const r = this._map.get(e);
    if (r) {
      if (this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs) {
        this._evictKey(e, r);
        return;
      }
      return this._map.delete(e), this._map.set(e, r), r.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(e, r) {
    if (this._map.has(e) && this._map.delete(e), this._map.set(e, { value: r, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
      for (; this._map.size > this._maxSize; ) {
        const n = this._map.keys().next().value, t = this._map.get(n);
        if (this._map.delete(n), this._onEvict)
          try {
            this._onEvict(n, t && t.value);
          } catch {
          }
      }
    return this;
  }
  /**
   * Delete key from cache.
   * @param {*} key
   * @returns {boolean}
   */
  delete(e) {
    return this._map.delete(e);
  }
  /**
   * Clear the cache and call eviction callback for each entry.
   */
  clear() {
    if (this._onEvict)
      for (const [e, r] of this._map.entries())
        try {
          this._onEvict(e, r && r.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(e, r) {
    try {
      this._map.delete(e);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(e, r && r.value);
    } catch {
    }
  }
}
const G = new Tt({ maxSize: 500 });
let At = 300 * 1e3;
async function _e(s, e) {
  try {
    if (!s) return null;
    const r = Date.now();
    let n = G.get(s);
    if (n && n.ok === !1 && r - (n.ts || 0) >= At && (G.delete(s), n = void 0), n) {
      if (n.module) return n.module;
      if (n.promise)
        try {
          return await n.promise;
        } catch {
          return null;
        }
    }
    const t = { promise: null, module: null, ok: null, ts: Date.now() };
    G.set(s, t), t.promise = (async () => {
      try {
        return await e();
      } catch {
        return null;
      }
    })();
    try {
      const l = await t.promise;
      return t.module = l, t.ok = !!l, t.ts = Date.now(), l;
    } catch {
      return t.module = null, t.ok = !1, t.ts = Date.now(), null;
    }
  } catch {
    return null;
  }
}
async function vt(s) {
  return await _e(s, async () => {
    try {
      return await import(s);
    } catch {
      return null;
    }
  });
}
function Pt(s) {
  try {
    if (!s && s !== 0) return "";
    const e = String(s), r = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (n, t) => {
      if (!t) return n;
      if (t[0] === "#")
        try {
          return t[1] === "x" || t[1] === "X" ? String.fromCharCode(parseInt(t.slice(2), 16)) : String.fromCharCode(parseInt(t.slice(1), 10));
        } catch {
          return n;
        }
      return r[t] !== void 0 ? r[t] : n;
    });
  } catch {
    return String(s || "");
  }
}
const Z = ce && (k || ce) || void 0, he = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, Et = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function Lt(s) {
  try {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
  } catch {
    return "heading";
  }
}
let b = null;
const Ct = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ze(s) {
  return await vt(s);
}
async function pe() {
  if (b) return b;
  try {
    const s = Ct + "/lib/core.js";
    try {
      const e = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (e) {
        b = e.default || e;
        try {
          await _e(s, async () => e);
        } catch {
        }
      } else
        b = null;
    } catch {
      const r = await ze(s);
      r ? b = r.default || r : b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
Z && typeof Z.setOptions == "function" && Z.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (s, e) => {
    try {
      return b && e && typeof b.getLanguage == "function" && b.getLanguage(e) ? b.highlight(s, { language: e }).value : b && typeof b.getLanguage == "function" && b.getLanguage("plaintext") ? b.highlight(s, { language: "plaintext" }).value : s;
    } catch {
      return s;
    }
  }
});
onmessage = async (s) => {
  const e = s.data || {};
  try {
    if (e.type === "register") {
      const { name: c, url: p } = e;
      try {
        if (!await pe()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const d = await ze(p), g = d ? d.default || d : null;
        if (!g) throw new Error("failed to import language module");
        b.registerLanguage(c, g), postMessage({ type: "registered", name: c });
      } catch (u) {
        postMessage({ type: "register-error", name: c, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const c = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = new RegExp(he.source, he.flags);
      let g;
      for (; g = d.exec(c); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), Et.has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: l } = zt(n || "");
    await pe().catch(() => {
    });
    let i = Z.parse(t);
    const o = [], a = /* @__PURE__ */ new Map(), h = Lt;
    i = i.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (c, p, u, d) => {
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = Pt(x);
      } catch {
      }
      let A = null;
      const E = (u || "").match(/\\sid="([^"]+)"/);
      E && (A = E[1]);
      const R = A || h(x) || "heading", L = (a.get(R) || 0) + 1;
      a.set(R, L);
      const v = L === 1 ? R : R + "-" + L;
      o.push({ level: g, text: x, id: v });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, Te = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Ae = (_[g] + " " + Te).trim(), ve = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${Ae}"\`).trim();
      return \`<h\${g} \${ve}>\${d}</h\${g}>\`;
    }), i = i.replace(/<img([^>]*)>/g, (c, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: i, meta: l || {}, toc: o } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`, ji = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", za], { type: "text/javascript;charset=utf-8" });
function ll(e) {
  let t;
  try {
    if (t = ji && (self.URL || self.webkitURL).createObjectURL(ji), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(za),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Jn(e) {
  if (e.startsWith("---")) {
    const t = e.indexOf(`
---`, 3);
    if (t !== -1) {
      const n = e.slice(3, t + 0).trim(), i = e.slice(t + 4).trimStart(), r = {};
      return n.split(/\r?\n/).forEach((a) => {
        const s = a.match(/^([^:]+):\s*(.*)$/);
        s && (r[s[1].trim()] = s[2].trim());
      }), { content: i, data: r };
    }
  }
  return { content: e, data: {} };
}
function Pa(e) {
  try {
    if (!e && e !== 0) return "";
    const t = String(e), n = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (i, r) => {
      if (!r) return i;
      if (r[0] === "#")
        try {
          return r[1] === "x" || r[1] === "X" ? String.fromCharCode(parseInt(r.slice(2), 16)) : String.fromCharCode(parseInt(r.slice(1), 10));
        } catch {
          return i;
        }
      return n[r] !== void 0 ? n[r] : i;
    });
  } catch {
    return String(e || "");
  }
}
const yn = Bi && (Ae || Bi) || void 0, er = /```\s*([a-zA-Z0-9_\-+]+)?/g, $a = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function Ia(e) {
  try {
    return String(e || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
  } catch {
    return "heading";
  }
}
let Ye = null;
const cl = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ni(e) {
  return await ms(e);
}
async function tr() {
  if (Ye) return Ye;
  try {
    const e = cl + "/lib/core.js";
    try {
      const t = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (t) {
        Ye = t.default || t;
        try {
          await Dr(e, async () => t);
        } catch {
        }
      } else
        Ye = null;
    } catch {
      const n = await ni(e);
      n ? Ye = n.default || n : Ye = null;
    }
  } catch {
    Ye = null;
  }
  return Ye;
}
yn && typeof yn.setOptions == "function" && yn.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Ye && t && typeof Ye.getLanguage == "function" && Ye.getLanguage(t) ? Ye.highlight(e, { language: t }).value : Ye && typeof Ye.getLanguage == "function" && Ye.getLanguage("plaintext") ? Ye.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: c, url: u } = t;
      try {
        if (!await tr()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const f = await ni(u), p = f ? f.default || f : null;
        if (!p) throw new Error("failed to import language module");
        Ye.registerLanguage(c, p), postMessage({ type: "registered", name: c });
      } catch (d) {
        postMessage({ type: "register-error", name: c, error: String(d) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", u = t.supported || [], d = /* @__PURE__ */ new Set(), f = new RegExp(er.source, er.flags);
      let p;
      for (; p = f.exec(c); )
        if (p[1]) {
          const y = String(p[1]).toLowerCase();
          if (!y) continue;
          if (y.length >= 5 && y.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(y) && d.add(y), $a.has(y) && d.add(y), u && u.length)
            try {
              u.indexOf(y) !== -1 && d.add(y);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(d) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Jn(i || "");
    await tr().catch(() => {
    });
    let s = yn.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), h = Ia;
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, d, f) => {
      const p = Number(u);
      let y = f.replace(/<[^>]+>/g, "").trim();
      try {
        y = Pa(y);
      } catch {
      }
      let g = null;
      const m = (d || "").match(/\sid="([^"]+)"/);
      m && (g = m[1]);
      const b = g || h(y) || "heading", k = (o.get(b) || 0) + 1;
      o.set(b, k);
      const S = k === 1 ? b : b + "-" + k;
      l.push({ level: p, text: y, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, E = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", O = (v[p] + " " + E).trim(), U = ((d || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${O}"`).trim();
      return `<h${p} ${U}>${f}</h${p}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function ul(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: h } = e;
      try {
        if (!await tr()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const u = await ni(h), d = u ? u.default || u : null;
        return d ? (Ye.registerLanguage(o, d), { type: "registered", name: o }) : { type: "register-error", name: o, error: "failed to import language module" };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", h = e.supported || [], c = /* @__PURE__ */ new Set(), u = new RegExp(er.source, er.flags);
      let d;
      for (; d = u.exec(o); )
        if (d[1]) {
          const f = String(d[1]).toLowerCase();
          if (!f) continue;
          if (f.length >= 5 && f.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(f) && c.add(f), $a.has(f) && c.add(f), h && h.length)
            try {
              h.indexOf(f) !== -1 && c.add(f);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Jn(e && e.md || "");
    await tr().catch(() => {
    });
    let r = yn.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = Ia;
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, u) => {
      const d = Number(h);
      let f = u.replace(/<[^>]+>/g, "").trim();
      try {
        f = Pa(f);
      } catch {
      }
      let p = null;
      const y = (c || "").match(/\sid="([^"]+)"/);
      y && (p = y[1]);
      const g = p || l(f) || "heading", b = (s.get(g) || 0) + 1;
      s.set(g, b);
      const w = b === 1 ? g : g + "-" + b;
      a.push({ level: d, text: f, id: w });
      const k = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[d] + " " + S).trim(), O = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${v}"`).trim();
      return `<h${d} ${O}>${u}</h${d}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, h) => /\bloading=/.test(h) ? `<img${h}>` : /\bdata-want-lazy=/.test(h) ? `<img${h}>` : `<img${h} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const kr = {
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
}, hl = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Na = ra(() => {
  if (typeof Worker < "u")
    try {
      return new ll();
    } catch {
    }
  try {
    if (Dt) return Dt(ol);
  } catch {
  }
  const e = { message: [], error: [] };
  return {
    addEventListener(t, n) {
      e[t] || (e[t] = []), e[t].push(n);
    },
    removeEventListener(t, n) {
      if (!e[t]) return;
      const i = e[t].indexOf(n);
      i !== -1 && e[t].splice(i, 1);
    },
    postMessage(t) {
      setTimeout(async () => {
        try {
          const i = { data: await ul(t) };
          (e.message || []).forEach((r) => r(i));
        } catch (n) {
          const i = { data: { id: t && t.id, error: String(n) } };
          (e.message || []).forEach((r) => r(i));
        }
      }, 0);
    },
    terminate() {
      Object.keys(e).forEach((t) => e[t].length = 0);
    }
  };
}, "markdown", hl), Ft = () => Na.get(), ri = (e, t = 3e3) => Na.send(e, t), St = [];
function Ir(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    St.push(e);
    try {
      Ae.use(e);
    } catch (t) {
      _("[markdown] failed to apply plugin", t);
    }
  }
}
function dl(e) {
  St.length = 0, Array.isArray(e) && St.push(...e.filter((t) => t && typeof t == "object"));
  try {
    St.forEach((t) => Ae.use(t));
  } catch (t) {
    _("[markdown] failed to apply markdown extensions", t);
  }
}
async function Ln(e) {
  if (St && St.length) {
    let { content: i, data: r } = Jn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => kr[l] || s);
    } catch {
    }
    Ae.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      St.forEach((s) => Ae.use(s));
    } catch (s) {
      _("[markdown] apply plugins failed", s);
    }
    const a = Ae.parse(i);
    try {
      const s = qe();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), h = [], c = /* @__PURE__ */ new Set(), u = (f) => {
          try {
            return String(f || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, d = (f) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, y = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[f] + " " + y).trim();
        };
        o.forEach((f) => {
          try {
            const p = Number(f.tagName.substring(1)), y = (f.textContent || "").trim();
            let g = u(y) || "heading", m = g, b = 2;
            for (; c.has(m); )
              m = g + "-" + b, b += 1;
            c.add(m), f.id = m, f.className = d(p), h.push({ level: p, text: y, id: m });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((f) => {
            try {
              const p = f.getAttribute && f.getAttribute("loading"), y = f.getAttribute && f.getAttribute("data-want-lazy");
              !p && !y && f.setAttribute && f.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((f) => {
            try {
              const p = f.getAttribute && f.getAttribute("class") || f.className || "", y = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (y)
                try {
                  f.setAttribute && f.setAttribute("class", y);
                } catch {
                  f.className = y;
                }
              else
                try {
                  f.removeAttribute && f.removeAttribute("class");
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
            typeof XMLSerializer < "u" ? f = new XMLSerializer().serializeToString(l.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : f = Array.from(l.body.childNodes || []).map((y) => y && typeof y.outerHTML == "string" ? y.outerHTML : y && typeof y.textContent == "string" ? y.textContent : "").join("");
          } catch {
            try {
              f = l.body.innerHTML;
            } catch {
              f = "";
            }
          }
          return { html: f, meta: r || {}, toc: h };
        } catch {
          return { html: "", meta: r || {}, toc: h };
        }
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Oa);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Ft && Ft();
    }
  else
    t = Ft && Ft();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => kr[r] || i);
  } catch {
  }
  try {
    if (typeof ze < "u" && ze && typeof ze.getLanguage == "function" && ze.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Jn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (h, c) => kr[c] || h);
      } catch {
      }
      Ae.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (h, c) => {
        try {
          return c && ze.getLanguage && ze.getLanguage(c) ? ze.highlight(h, { language: c }).value : ze && typeof ze.getLanguage == "function" && ze.getLanguage("plaintext") ? ze.highlight(h, { language: "plaintext" }).value : h;
        } catch {
          return h;
        }
      } });
      let a = Ae.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (h, c) => {
          try {
            if (c && ze && typeof ze.highlight == "function")
              try {
                const u = ze.highlight(c, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (ze && typeof ze.highlightElement == "function") {
                    const d = { innerHTML: c };
                    return ze.highlightElement(d), `<pre><code>${d.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return h;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (h) => {
        try {
          return String(h || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (h, c, u, d) => {
        const f = Number(c), p = d.replace(/<[^>]+>/g, "").trim();
        let y = o(p) || "heading", g = y, m = 2;
        for (; l.has(g); )
          g = y + "-" + m, m += 1;
        l.add(g), s.push({ level: f, text: p, id: g });
        const b = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, w = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", k = (b[f] + " " + w).trim(), v = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${g}" class="${k}"`).trim();
        return `<h${f} ${v}>${d}</h${f}>`;
      }), a = a.replace(/<img([^>]*)>/g, (h, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await ri({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const h = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (h[o] + " " + c).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, u) => {
      const d = Number(h), f = u.replace(/<[^>]+>/g, "").trim(), p = (c || "").match(/\sid="([^"]+)"/), y = p ? p[1] : a(f) || "heading", m = (i.get(y) || 0) + 1;
      i.set(y, m);
      const b = m === 1 ? y : y + "-" + m;
      r.push({ level: d, text: f, id: b });
      const w = s(d), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${w}"`).trim();
      return `<h${d} ${S}>${u}</h${d}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const h = qe();
        if (h) {
          const c = h.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((d) => {
            try {
              const f = d.getAttribute("src") || "";
              (f ? new URL(f, location.href).toString() : "") === o && d.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? l = new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : l = Array.from(c.body.childNodes || []).map((f) => f && typeof f.outerHTML == "string" ? f.outerHTML : f && typeof f.textContent == "string" ? f.textContent : "").join("");
          } catch {
            try {
              l = c.body.innerHTML;
            } catch {
            }
          }
        } else
          try {
            const c = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            l = l.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`, "g"), "");
          } catch {
          }
      }
    } catch {
    }
    return { html: l, meta: n.meta || {}, toc: r };
  } catch {
    return { html: n.html, meta: n.meta || {}, toc: n.toc || [] };
  }
}
function bn(e, t) {
  const n = /* @__PURE__ */ new Set(), i = /```\s*([a-zA-Z0-9_\-+]+)?/g, r = /* @__PURE__ */ new Set([
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
  ]), a = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
  let s;
  for (; s = i.exec(e); )
    if (s[1]) {
      const l = s[1].toLowerCase();
      if (Yi.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(ut && ut[l] && t.has(ut[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const h = t.get(l);
          h && n.add(h);
          continue;
        }
        if (ut && ut[l]) {
          const h = ut[l];
          if (t.has(h)) {
            const c = t.get(h) || h;
            n.add(c);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function Nr(e, t) {
  if (St && St.length || typeof process < "u" && process.env && process.env.VITEST) return bn(e || "", t);
  if (Ft && Ft())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await ri({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      _("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return bn(e || "", t);
}
const Oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: ri,
  addMarkdownExtension: Ir,
  detectFenceLanguages: bn,
  detectFenceLanguagesAsync: Nr,
  initRendererWorker: Ft,
  markdownPlugins: St,
  parseMarkdownToHtml: Ln,
  setMarkdownExtensions: dl
}, Symbol.toStringTag, { value: "Module" })), fl = `/**
 * @module worker/anchorWorker
 */
import { _rewriteAnchors } from '../htmlBuilder.js'
import { getSharedParser } from '../utils/sharedDomParser.js'

/**
 * Worker entrypoint for rewriting anchor hrefs inside rendered HTML.
 *
 * Accepted messages:
 * - \`{ type: 'rewriteAnchors', id: string, html: string, contentBase?: string, pagePath?: string }\`
 *   -> posts \`{ id, result: string }\` where \`result\` is the rewritten HTML string.
 *
 * On error the worker posts \`{ id, error: string }\`.
 */

/**
 * Worker \`onmessage\` handler for anchor rewrite messages.
 * @param {MessageEvent} ev - Message event whose \`data\` should contain the worker request
 * (e.g. \`{ type: 'rewriteAnchors', id, html, contentBase?, pagePath? }\`).
 * @returns {Promise<void>} Posts a \`{id, result}\` or \`{id, error}\` message.
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        
        const parser = getSharedParser()
        if (!parser) {
          // No DOMParser available in this environment; return original HTML unchanged
          postMessage({ id, result: html })
        } else {
          const doc = parser.parseFromString(html || '', 'text/html')
          const article = doc.body
          await _rewriteAnchors(article, contentBase, pagePath, { canonical: true })
          postMessage({ id, result: doc.body.innerHTML })
        }
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process an anchor-worker style message outside of a Worker.
 * @param {Object} msg - Message object (expects \`type === 'rewriteAnchors'\` and fields \`id\`, \`html\`, \`contentBase\`, \`pagePath\`).
 * @returns {Promise<Object>} Response shaped like the worker postMessage (contains \`id\` and \`result\` or \`error\`).
 */
export async function handleAnchorWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        const parser = getSharedParser()
        if (!parser) {
          return { id, result: html }
        }
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath, { canonical: true })
        return { id, result: doc.body.innerHTML }
      } catch (e) {
        return { id, error: String(e) }
      }
    }
    return { id: msg && msg.id, error: 'unsupported message' }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`;
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "rewriteAnchors") {
      const { id: n, html: i, contentBase: r, pagePath: a } = t;
      try {
        const s = qe();
        if (!s)
          postMessage({ id: n, result: i });
        else {
          const l = s.parseFromString(i || "", "text/html"), o = l.body;
          await ii(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
        }
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Ba(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const a = qe();
        if (!a)
          return { id: t, result: n };
        const s = a.parseFromString(n || "", "text/html"), l = s.body;
        return await ii(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const pl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  handleAnchorWorkerMessage: Ba
}, Symbol.toStringTag, { value: "Module" }));
function ht(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + vi(e, t);
  } catch {
    return vi(e, t);
  }
}
function gl(...e) {
  try {
    _(...e);
  } catch {
  }
}
function nr(e) {
  try {
    if (Xt(3)) return !0;
  } catch {
  }
  try {
    if (typeof oe == "string" && oe) return !0;
  } catch {
  }
  try {
    if (ee && ee.size) return !0;
  } catch {
  }
  try {
    if (Pe && Pe.size) return !0;
  } catch {
  }
  return !1;
}
function xt(e, t) {
  try {
    if (typeof nt == "function")
      try {
        nt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && ee && typeof ee.set == "function" && !ee.has(e) && ee.set(e, t);
  } catch {
  }
  try {
    t && W && typeof W.set == "function" && W.set(t, e);
  } catch {
  }
  try {
    if (Pe && typeof Pe.has == "function") {
      if (!Pe.has(t)) {
        try {
          Pe.add(t);
        } catch {
        }
        try {
          Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
      } catch {
      }
  } catch {
  }
}
function ml(e, t) {
  try {
    return new URL(e, t).pathname;
  } catch {
    try {
      return new URL(e, typeof location < "u" ? location.href : "http://localhost/").pathname;
    } catch {
      try {
        return (String(t || "").replace(/\/$/, "") + "/" + String(e || "").replace(/^\//, "")).replace(/\/\\+/g, "/");
      } catch {
        return String(e || "");
      }
    }
  }
}
function yl(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  r.className = "menu-list";
  try {
    const a = document.createDocumentFragment();
    t.forEach((s) => {
      const l = document.createElement("li"), o = document.createElement("a");
      try {
        const h = String(s.path || "");
        try {
          o.setAttribute("href", $e(h));
        } catch {
          h && h.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(h)) : o.setAttribute("href", ht(h));
        }
      } catch {
        o.setAttribute("href", "#" + s.path);
      }
      if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
        const h = document.createElement("ul");
        s.children.forEach((c) => {
          const u = document.createElement("li"), d = document.createElement("a");
          try {
            const f = String(c.path || "");
            try {
              d.setAttribute("href", $e(f));
            } catch {
              f && f.indexOf("/") === -1 ? d.setAttribute("href", "#" + encodeURIComponent(f)) : d.setAttribute("href", ht(f));
            }
          } catch {
            d.setAttribute("href", "#" + c.path);
          }
          d.textContent = c.name, u.appendChild(d), h.appendChild(u);
        }), l.appendChild(h);
      }
      a.appendChild(l);
    }), r.appendChild(a);
  } catch {
    t.forEach((s) => {
      try {
        const l = document.createElement("li"), o = document.createElement("a");
        try {
          const h = String(s.path || "");
          try {
            o.setAttribute("href", $e(h));
          } catch {
            h && h.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(h)) : o.setAttribute("href", ht(h));
          }
        } catch {
          o.setAttribute("href", "#" + s.path);
        }
        if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
          const h = document.createElement("ul");
          s.children.forEach((c) => {
            const u = document.createElement("li"), d = document.createElement("a");
            try {
              const f = String(c.path || "");
              try {
                d.setAttribute("href", $e(f));
              } catch {
                f && f.indexOf("/") === -1 ? d.setAttribute("href", "#" + encodeURIComponent(f)) : d.setAttribute("href", ht(f));
              }
            } catch {
              d.setAttribute("href", "#" + c.path);
            }
            d.textContent = c.name, u.appendChild(d), h.appendChild(u);
          }), l.appendChild(h);
        }
        r.appendChild(l);
      } catch (l) {
        _("[htmlBuilder] createNavTree item failed", l);
      }
    });
  }
  return n.appendChild(r), n;
}
function bl(e, t, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const l = {};
    (t || []).forEach((o) => {
      try {
        if (!o || o.level === 1) return;
        const h = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), u = document.createElement("a"), d = zs(o.text || ""), f = o.id || de(d);
        u.textContent = d;
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), b = m && W && W.has && W.has(m) ? W.get(m) : m;
          b ? u.href = $e(b, f) : u.href = `#${encodeURIComponent(f)}`;
        } catch (m) {
          _("[htmlBuilder] buildTocElement href normalization failed", m), u.href = `#${encodeURIComponent(f)}`;
        }
        if (c.appendChild(u), h === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((m) => {
            Number(m) > 2 && delete l[m];
          });
          return;
        }
        let p = h - 1;
        for (; p > 2 && !l[p]; ) p--;
        p < 2 && (p = 2);
        let y = l[p];
        if (!y) {
          a.appendChild(c), l[h] = c;
          return;
        }
        let g = y.querySelector("ul");
        g || (g = document.createElement("ul"), y.appendChild(g)), g.appendChild(c), l[h] = c;
      } catch (h) {
        _("[htmlBuilder] buildTocElement item failed", h, o);
      }
    });
  } catch (l) {
    _("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function ja(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = de(n.textContent || ""));
  });
}
function wl(e, t, n) {
  try {
    const i = e.querySelectorAll("img");
    if (i && i.length) {
      const r = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
      i.forEach((a) => {
        const s = a.getAttribute("src") || "";
        if (s && !(/^(https?:)?\/\//.test(s) || s.startsWith("/")))
          try {
            const l = new URL(r + s, n).toString();
            a.src = l;
            try {
              a.getAttribute("loading") || a.setAttribute("data-want-lazy", "1");
            } catch (o) {
              _("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (l) {
            _("[htmlBuilder] resolve image src failed", l);
          }
      });
    }
  } catch (i) {
    _("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function Hi(e, t, n) {
  try {
    const i = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
    let r = null;
    try {
      const s = new URL(n, location.href);
      r = new URL(i || ".", s).toString();
    } catch {
      try {
        r = new URL(i || ".", location.href).toString();
      } catch {
        r = i || "./";
      }
    }
    const a = e.querySelectorAll("*");
    for (const s of Array.from(a || []))
      try {
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (h) => {
          try {
            const c = s.getAttribute(h) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              s.setAttribute(h, new URL(c, r).toString());
            } catch (u) {
              _("[htmlBuilder] rewrite asset attribute failed", h, c, u);
            }
          } catch (c) {
            _("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const u = (s.getAttribute("srcset") || "").split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
            const [f, p] = d.split(/\s+/, 2);
            if (!f || /^(https?:)?\/\//i.test(f) || f.startsWith("/")) return d;
            try {
              const y = new URL(f, r).toString();
              return p ? `${y} ${p}` : y;
            } catch {
              return d;
            }
          }).join(", ");
          s.setAttribute("srcset", u);
        }
      } catch (l) {
        _("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    _("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let qi = "", xr = null, Fi = "";
async function ii(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === qi && xr)
      a = xr, s = Fi;
    else {
      try {
        a = new URL(t, location.href), s = Zt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Zt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      qi = t, xr = a, Fi = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], h = /* @__PURE__ */ new Set(), c = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const d = u.getAttribute("href") || "";
        if (!d || Cr(d)) continue;
        try {
          if (d.startsWith("?") || d.indexOf("?") !== -1)
            try {
              const p = new URL(d, t || location.href), y = p.searchParams.get("page");
              if (y && y.indexOf("/") === -1 && n) {
                const g = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (g) {
                  const m = J(g + y), b = i && i.canonical ? $e(m, p.hash ? p.hash.replace(/^#/, "") : null) : ht(m, p.hash ? p.hash.replace(/^#/, "") : null);
                  u.setAttribute("href", b);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (d.startsWith("/") && !d.endsWith(".md")) continue;
        const f = d.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (f) {
          let p = f[1];
          const y = f[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const g = new URL(p, t).pathname;
            let m = g.startsWith(s) ? g.slice(s.length) : g;
            m = J(m), o.push({ node: u, mdPathRaw: p, frag: y, rel: m }), W.has(m) || l.add(m);
          } catch (g) {
            _("[htmlBuilder] resolve mdPath failed", g);
          }
          continue;
        }
        try {
          let p = d;
          !d.startsWith("/") && n && (d.startsWith("#") ? p = n + d : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + d);
          const g = new URL(p, t).pathname || "";
          if (g && g.indexOf(s) !== -1) {
            let m = g.startsWith(s) ? g.slice(s.length) : g;
            if (m = J(m), m = en(m), m || (m = Wr), !m.endsWith(".md")) {
              let b = null;
              try {
                if (W && W.has && W.has(m))
                  b = W.get(m);
                else
                  try {
                    const w = String(m || "").replace(/^.*\//, "");
                    w && W.has && W.has(w) && (b = W.get(w));
                  } catch (w) {
                    _("[htmlBuilder] mdToSlug baseName check failed", w);
                  }
              } catch (w) {
                _("[htmlBuilder] mdToSlug access check failed", w);
              }
              if (!b)
                try {
                  const w = String(m || "").replace(/^.*\//, "");
                  for (const [k, S] of ee || [])
                    if (S === m || S === w) {
                      b = k;
                      break;
                    }
                } catch {
                }
              if (b) {
                const w = i && i.canonical ? $e(b, null) : ht(b);
                u.setAttribute("href", w);
              } else {
                let w = m;
                try {
                  /\.[^\/]+$/.test(String(m || "")) || (w = String(m || "") + ".html");
                } catch {
                  w = m;
                }
                h.add(w), c.push({ node: u, rel: w });
              }
            }
          }
        } catch (p) {
          _("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (d) {
        _("[htmlBuilder] processing anchor failed", d);
      }
    if (l.size)
      if (nr(t))
        await An(Array.from(l), async (u) => {
          try {
            try {
              const f = String(u).match(/([^\/]+)\.md$/), p = f && f[1];
              if (p && ee.has(p)) {
                try {
                  const y = ee.get(p);
                  if (y)
                    try {
                      const g = typeof y == "string" ? y : y && y.default ? y.default : null;
                      g && xt(p, g);
                    } catch (g) {
                      _("[htmlBuilder] _storeSlugMapping failed", g);
                    }
                } catch (y) {
                  _("[htmlBuilder] reading slugToMd failed", y);
                }
                return;
              }
            } catch (f) {
              _("[htmlBuilder] basename slug lookup failed", f);
            }
            const d = await Te(u, t);
            if (d && d.raw) {
              const f = (d.raw || "").match(/^#\s+(.+)$/m);
              if (f && f[1]) {
                const p = de(f[1].trim());
                if (p)
                  try {
                    xt(p, u);
                  } catch (y) {
                    _("[htmlBuilder] setting slug mapping failed", y);
                  }
              }
            }
          } catch (d) {
            _("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", d);
          }
        }, 6);
      else {
        try {
          _("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(l))
          try {
            const d = String(u).match(/([^\/]+)\.md$/), f = d && d[1];
            if (f) {
              const p = de(f);
              if (p)
                try {
                  xt(p, u);
                } catch (y) {
                  _("[htmlBuilder] setting fallback slug mapping failed", y);
                }
            }
          } catch {
          }
      }
    if (h.size)
      if (nr(t))
        await An(Array.from(h), async (u) => {
          try {
            const d = await Te(u, t);
            if (d && d.raw)
              try {
                const f = qe(), p = f ? f.parseFromString(d.raw, "text/html") : null, y = p ? p.querySelector("title") : null, g = p ? p.querySelector("h1") : null, m = y && y.textContent && y.textContent.trim() ? y.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
                if (m) {
                  const b = de(m);
                  if (b)
                    try {
                      xt(b, u);
                    } catch (w) {
                      _("[htmlBuilder] setting html slug mapping failed", w);
                    }
                }
              } catch (f) {
                _("[htmlBuilder] parse fetched HTML failed", f);
              }
          } catch (d) {
            _("[htmlBuilder] fetchMarkdown for htmlPending failed", d);
          }
        }, 5);
      else {
        try {
          _("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(h))
          try {
            const d = String(u).match(/([^\/]+)\.html$/), f = d && d[1];
            if (f) {
              const p = de(f);
              if (p)
                try {
                  xt(p, u);
                } catch (y) {
                  _("[htmlBuilder] setting fallback html slug mapping failed", y);
                }
            }
          } catch {
          }
      }
    for (const u of o) {
      const { node: d, frag: f, rel: p } = u;
      let y = null;
      try {
        W.has(p) && (y = W.get(p));
      } catch (g) {
        _("[htmlBuilder] mdToSlug access failed", g);
      }
      if (y) {
        const g = i && i.canonical ? $e(y, f) : ht(y, f);
        d.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? $e(p, f) : ht(p, f);
        d.setAttribute("href", g);
      }
    }
    for (const u of c) {
      const { node: d, rel: f } = u;
      let p = null;
      try {
        W.has(f) && (p = W.get(f));
      } catch (y) {
        _("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", y);
      }
      if (!p)
        try {
          const y = String(f || "").replace(/^.*\//, "");
          W.has(y) && (p = W.get(y));
        } catch (y) {
          _("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", y);
        }
      if (p) {
        const y = i && i.canonical ? $e(p, null) : ht(p);
        d.setAttribute("href", y);
      } else {
        const y = i && i.canonical ? $e(f, null) : ht(f);
        d.setAttribute("href", y);
      }
    }
  } catch (r) {
    _("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function _l(e, t, n, i) {
  const r = t.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    let l = "";
    try {
      e && e.meta && e.meta.title && (l = String(e.meta.title).trim());
    } catch {
    }
    if (!l && a && (l = a), !l)
      try {
        const o = t.querySelector("h2");
        o && o.textContent && (l = String(o.textContent).trim());
      } catch {
      }
    !l && n && (l = String(n)), l && (s = de(l)), s || (s = Wr);
    try {
      if (n)
        try {
          xt(s, n);
        } catch (o) {
          _("[htmlBuilder] computeSlug set slug mapping failed", o);
        }
    } catch (o) {
      _("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const h = it(typeof location < "u" ? location.href : "");
          h && h.anchor && h.page && String(h.page) === String(s) ? o = h.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", ht(s, o));
      } catch (h) {
        _("[htmlBuilder] computeSlug history replace failed", h);
      }
    } catch (o) {
      _("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    _("[htmlBuilder] computeSlug failed", l);
  }
  try {
    if (e && e.meta && e.meta.title && r) {
      const l = String(e.meta.title).trim();
      if (l && l !== a) {
        try {
          s && (r.id = s);
        } catch {
        }
        try {
          if (Array.isArray(e.toc))
            for (const o of e.toc)
              try {
                if (o && Number(o.level) === 1 && String(o.text).trim() === (a || "").trim()) {
                  o.id = s;
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
  return { topH1: r, h1Text: a, slugKey: s };
}
async function kl(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const s of Array.from(e || []))
    try {
      const l = s.getAttribute("href") || "";
      if (!l) continue;
      let c = J(l).split(/::|#/, 2)[0];
      try {
        const d = c.indexOf("?");
        d !== -1 && (c = c.slice(0, d));
      } catch {
      }
      if (!c || (c.includes(".") || (c = c + ".html"), !/\.html(?:$|[?#])/.test(c) && !c.toLowerCase().endsWith(".html"))) continue;
      const u = c;
      try {
        if (W && W.has && W.has(u)) continue;
      } catch (d) {
        _("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const f of ee.values())
          if (f === u) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        _("[htmlBuilder] slugToMd iteration failed", d);
      }
      n.add(u);
    } catch (l) {
      _("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", l);
    }
  if (!n.size) return;
  if (!nr()) {
    try {
      _("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const s of Array.from(n))
      try {
        const l = String(s).match(/([^\/]+)\.html$/), o = l && l[1];
        if (o) {
          const h = de(o);
          if (h)
            try {
              xt(h, s);
            } catch (c) {
              _("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", c);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (s) => {
    try {
      const l = await Te(s, t);
      if (l && l.raw)
        try {
          const h = qe().parseFromString(l.raw, "text/html"), c = h.querySelector("title"), u = h.querySelector("h1"), d = c && c.textContent && c.textContent.trim() ? c.textContent.trim() : u && u.textContent ? u.textContent.trim() : null;
          if (d) {
            const f = de(d);
            if (f)
              try {
                xt(f, s);
              } catch (p) {
                _("[htmlBuilder] set slugToMd/mdToSlug failed", p);
              }
          }
        } catch (o) {
          _("[htmlBuilder] parse HTML title failed", o);
        }
    } catch (l) {
      _("[htmlBuilder] fetchAndExtract failed", l);
    }
  }, r = Array.from(n), a = Math.max(1, Math.min(pn(), r.length || 1));
  await An(r, i, a);
}
async function xl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Zt(a.pathname);
  } catch (a) {
    r = "", _("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = J(l[1]);
        try {
          let h;
          try {
            h = ml(o, t);
          } catch (u) {
            h = o, _("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const c = h && r && h.startsWith(r) ? h.slice(r.length) : String(h || "").replace(/^\//, "");
          n.push({ rel: c }), W.has(c) || i.add(c);
        } catch (h) {
          _("[htmlBuilder] rewriteAnchors failed", h);
        }
        continue;
      }
    } catch (s) {
      _("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (nr())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && ee.has(l)) {
            try {
              const o = ee.get(l);
              if (o)
                try {
                  const h = typeof o == "string" ? o : o && o.default ? o.default : null;
                  h && xt(l, h);
                } catch (h) {
                  _("[htmlBuilder] _storeSlugMapping failed", h);
                }
            } catch (o) {
              _("[htmlBuilder] preMapMdSlugs slug map access failed", o);
            }
            return;
          }
        } catch (s) {
          _("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await Te(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = de(l[1].trim());
              if (o)
                try {
                  xt(o, a);
                } catch (h) {
                  _("[htmlBuilder] preMapMdSlugs setting slug mapping failed", h);
                }
            }
          }
        } catch (s) {
          _("[htmlBuilder] preMapMdSlugs fetch failed", s);
        }
      }));
    else
      try {
        _("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
}
qe();
function Sr(e) {
  try {
    const n = qe().parseFromString(e || "", "text/html");
    ja(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (h) {
          _("[htmlBuilder] parseHtml set image loading attribute failed", h);
        }
      });
    } catch (l) {
      _("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", h = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (h && h[1]) {
          const c = (h[1] || "").toLowerCase(), u = Ee.size && (Ee.get(c) || Ee.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await vn(u);
              } catch (d) {
                _("[htmlBuilder] registerLanguage failed", d);
              }
            })();
          } catch (d) {
            _("[htmlBuilder] schedule registerLanguage failed", d);
          }
        } else
          try {
            if (ze && typeof ze.getLanguage == "function" && ze.getLanguage("plaintext")) {
              const c = ze.highlight ? ze.highlight(l.textContent || "", { language: "plaintext" }) : null;
              if (c && c.value)
                try {
                  if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                    const u = document.createRange().createContextualFragment(c.value);
                    if (typeof l.replaceChildren == "function") l.replaceChildren(...Array.from(u.childNodes));
                    else {
                      for (; l.firstChild; ) l.removeChild(l.firstChild);
                      l.appendChild(u);
                    }
                  } else
                    l.innerHTML = c.value;
                } catch {
                  try {
                    l.innerHTML = c.value;
                  } catch {
                  }
                }
            }
          } catch (c) {
            _("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (o) {
        _("[htmlBuilder] code element processing failed", o);
      }
    });
    const r = [];
    n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((l) => {
      r.push({ level: Number(l.tagName.substring(1)), text: (l.textContent || "").trim(), id: l.id });
    });
    const s = {};
    try {
      const l = n.querySelector("title");
      l && l.textContent && String(l.textContent).trim() && (s.title = String(l.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: s, toc: r };
  } catch (t) {
    return _("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function Sl(e) {
  const t = Nr ? await Nr(e || "", Ee) : bn(e || "", Ee), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = Ee.size && (Ee.get(r) || Ee.get(String(r).toLowerCase())) || r;
      try {
        i.push(vn(a));
      } catch (s) {
        _("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(vn(r));
        } catch (s) {
          _("[htmlBuilder] ensureLanguages push alias failed", s);
        }
    } catch (a) {
      _("[htmlBuilder] ensureLanguages inner failed", a);
    }
  try {
    await Promise.all(i);
  } catch (r) {
    _("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function vl(e) {
  if (await Sl(e), Ln) {
    const t = await Ln(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function Al(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = qe();
      if (u) {
        const d = u.parseFromString(t.raw || "", "text/html");
        try {
          Hi(d.body, n, r);
        } catch (f) {
          _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", f);
        }
        a = Sr(d.documentElement && d.documentElement.outerHTML ? d.documentElement.outerHTML : t.raw || "");
      } else
        a = Sr(t.raw || "");
    } catch {
      a = Sr(t.raw || "");
    }
  else
    a = await vl(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content";
  try {
    const u = qe && qe();
    if (u) {
      const d = u.parseFromString(String(a.html || ""), "text/html"), f = Array.from(d.body.childNodes || []);
      f.length ? s.replaceChildren(...f) : s.innerHTML = a.html;
    } else
      try {
        const d = document && typeof document.createRange == "function" ? document.createRange() : null;
        if (d && typeof d.createContextualFragment == "function") {
          const f = d.createContextualFragment(String(a.html || ""));
          s.replaceChildren(...Array.from(f.childNodes));
        } else
          s.innerHTML = a.html;
      } catch {
        s.innerHTML = a.html;
      }
  } catch {
    try {
      s.innerHTML = a.html;
    } catch (d) {
      _("[htmlBuilder] set article html failed", d);
    }
  }
  try {
    Hi(s, n, r);
  } catch (u) {
    _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    ja(s);
  } catch (u) {
    _("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((d) => {
      try {
        const f = d.getAttribute && d.getAttribute("class") || d.className || "", p = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (p)
          try {
            d.setAttribute && d.setAttribute("class", p);
          } catch (y) {
            d.className = p, _("[htmlBuilder] set element class failed", y);
          }
        else
          try {
            d.removeAttribute && d.removeAttribute("class");
          } catch (y) {
            d.className = "", _("[htmlBuilder] remove element class failed", y);
          }
      } catch (f) {
        _("[htmlBuilder] code element cleanup failed", f);
      }
    });
  } catch (u) {
    _("[htmlBuilder] processing code elements failed", u);
  }
  try {
    _s(s);
  } catch (u) {
    _("[htmlBuilder] observeCodeBlocks failed", u);
  }
  wl(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((d) => {
      try {
        const f = d.parentElement;
        if (!f || f.tagName.toLowerCase() !== "p" || f.childNodes.length !== 1) return;
        const p = document.createElement("figure");
        p.className = "image", f.replaceWith(p), p.appendChild(d);
      } catch {
      }
    });
  } catch (u) {
    _("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((d) => {
      try {
        if (d.classList)
          d.classList.contains("table") || d.classList.add("table");
        else {
          const f = d.getAttribute && d.getAttribute("class") ? d.getAttribute("class") : "", p = String(f || "").split(/\s+/).filter(Boolean);
          p.indexOf("table") === -1 && p.push("table");
          try {
            d.setAttribute && d.setAttribute("class", p.join(" "));
          } catch {
            d.className = p.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    _("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: l, h1Text: o, slugKey: h } = _l(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const d = a.meta.author ? String(a.meta.author).trim() : "", f = a.meta.date ? String(a.meta.date).trim() : "";
      let p = "";
      try {
        const g = new Date(f);
        f && !isNaN(g.getTime()) ? p = g.toLocaleDateString() : p = f;
      } catch {
        p = f;
      }
      const y = [];
      if (d && y.push(d), p && y.push(p), y.length) {
        const g = document.createElement("p"), m = y[0] ? String(y[0]).replace(/"/g, "").trim() : "", b = y.slice(1);
        if (g.className = "nimbi-article-subtitle is-6 has-text-grey-light", m) {
          const w = document.createElement("span");
          w.className = "nimbi-article-author", w.textContent = m, g.appendChild(w);
        }
        if (b.length) {
          const w = document.createElement("span");
          w.className = "nimbi-article-meta", w.textContent = b.join(" • "), g.appendChild(w);
        }
        try {
          l.parentElement.insertBefore(g, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", g);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await Ll(s, r, n);
  } catch (u) {
    gl("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await ii(s, r, n);
  }
  const c = bl(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: h };
}
function El(e) {
  if (!(!e || !e.querySelectorAll))
    try {
      const t = Array.from(e.querySelectorAll("script"));
      for (const n of t)
        try {
          const i = document.createElement("script");
          for (const a of Array.from(n.attributes || []))
            try {
              i.setAttribute(a.name, a.value);
            } catch {
            }
          if (!n.src) {
            const a = n.textContent || "";
            let s = !1;
            try {
              new Function(a)(), s = !0;
            } catch {
              s = !1;
            }
            if (s) {
              n.parentNode && n.parentNode.removeChild(n);
              try {
                Tt("[htmlBuilder] executed inline script via Function");
              } catch {
              }
              continue;
            }
            try {
              i.type = "module";
            } catch {
            }
            i.textContent = a;
          }
          if (n.src)
            try {
              if (document.querySelector && document.querySelector(`script[src="${n.src}"]`)) {
                n.parentNode && n.parentNode.removeChild(n);
                continue;
              }
            } catch {
            }
          const r = n.src || "<inline>";
          i.addEventListener("error", (a) => {
            try {
              _("[htmlBuilder] injected script error", { src: r, ev: a });
            } catch {
            }
          }), i.addEventListener("load", () => {
            try {
              Tt("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
            } catch (s) {
              try {
                _("[htmlBuilder] injected script append failed, skipping", { src: r, err: s });
              } catch {
              }
            }
          }
          n.parentNode && n.parentNode.removeChild(n);
          try {
            Tt("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          _("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function Di(e, t, n) {
  if (e)
    try {
      typeof e.replaceChildren == "function" ? e.replaceChildren() : e.innerHTML = "";
    } catch {
      try {
        e.innerHTML = "";
      } catch {
      }
    }
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!oe)
      try {
        const s = document.createElement("p"), l = t && t("goHome") || "Go back to";
        s.textContent = l + " ";
        const o = document.createElement("a");
        try {
          o.href = $e(mt);
        } catch {
          o.href = $e(mt || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Zn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, oe, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
    } catch {
    }
  } catch {
  }
  try {
    try {
      const s = typeof window < "u" && window.__nimbiNotFoundRedirect ? String(window.__nimbiNotFoundRedirect).trim() : null;
      if (s)
        try {
          const l = new URL(s, location.origin).toString();
          if ((location.href || "").split("#")[0] !== l)
            try {
              location.replace(l);
            } catch {
              location.href = l;
            }
        } catch {
        }
    } catch {
    }
  } catch {
  }
}
const Ha = Ms(fl, pl && Ba, "anchor");
function Cl() {
  return Ha.get();
}
function Ml(e) {
  return Ha.send(e, 2e3);
}
async function Ll(e, t, n) {
  if (!Cl()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Ml({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      const s = qe && qe();
      if (s) {
        const l = s.parseFromString(String(a || ""), "text/html"), o = Array.from(l.body.childNodes || []);
        o.length ? e.replaceChildren(...o) : e.innerHTML = a;
      } else
        try {
          const l = document && typeof document.createRange == "function" ? document.createRange() : null;
          if (l && typeof l.createContextualFragment == "function") {
            const o = l.createContextualFragment(String(a || ""));
            e.replaceChildren(...Array.from(o.childNodes));
          } else
            e.innerHTML = a;
        } catch {
          e.innerHTML = a;
        }
    } catch (s) {
      _("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Tl(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = it(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
        let l = null;
        try {
          history && history.state && history.state.page && (l = history.state.page);
        } catch (o) {
          l = null, _("[htmlBuilder] access history.state failed", o);
        }
        try {
          l || (l = new URL(location.href).searchParams.get("page"));
        } catch (o) {
          _("[htmlBuilder] parse current location failed", o);
        }
        if (!a && s || a && l && String(a) === String(l)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (o) {
                _("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: l || a }, "", ht(l || a, s));
              } catch (o) {
                _("[htmlBuilder] history.replaceState failed", o);
              }
          } catch (o) {
            _("[htmlBuilder] update history for anchor failed", o);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (o) {
            _("[htmlBuilder] stopPropagation failed", o);
          }
          try {
            Or(s);
          } catch (o) {
            _("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", ht(a, s));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (o) {
              _("[htmlBuilder] window.renderByQuery failed", o);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (o) {
              _("[htmlBuilder] dispatch popstate failed", o);
            }
          else
            try {
              renderByQuery();
            } catch (o) {
              _("[htmlBuilder] renderByQuery failed", o);
            }
        } catch (o) {
          _("[htmlBuilder] SPA navigation invocation failed", o);
        }
      } catch (r) {
        _("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    _("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function Or(e) {
  const t = document.querySelector(".nimbi-cms") || null;
  if (e) {
    const n = document.getElementById(e);
    if (n)
      try {
        const i = () => {
          try {
            if (t && t.scrollTo && t.contains(n)) {
              const r = n.getBoundingClientRect().top - t.getBoundingClientRect().top + t.scrollTop;
              t.scrollTo({ top: r, behavior: "smooth" });
            } else
              try {
                n.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch {
                try {
                  n.scrollIntoView();
                } catch (a) {
                  _("[htmlBuilder] scrollIntoView failed", a);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              _("[htmlBuilder] final scroll fallback failed", a);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (r) {
          _("[htmlBuilder] scheduling scroll failed", r), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          n.scrollIntoView();
        } catch (r) {
          _("[htmlBuilder] final scroll fallback failed", r);
        }
        _("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      t && t.scrollTo ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        _("[htmlBuilder] window.scrollTo failed", i);
      }
      _("[htmlBuilder] scroll to top failed", n);
    }
}
function Rl(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((y) => typeof y == "string" ? y : ""), o = i || document.querySelector(".nimbi-cms"), h = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top button is-primary is-rounded is-small", f.setAttribute("aria-label", l("scrollToTop")), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(f) : o && o.appendChild ? o.appendChild(f) : h && h.appendChild ? h.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (g) {
          _("[htmlBuilder] append scroll top button failed", g);
        }
      }
      try {
        try {
          Ji(f);
        } catch {
        }
      } catch (y) {
        _("[htmlBuilder] set scroll-top button theme registration failed", y);
      }
      f.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (g) {
            _("[htmlBuilder] fallback container scrollTop failed", g);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (g) {
            _("[htmlBuilder] fallback mountEl scrollTop failed", g);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (g) {
            _("[htmlBuilder] fallback document scrollTop failed", g);
          }
        }
      });
    }
    const p = u && u.querySelector ? u.querySelector(".menu-label") : null;
    if (t) {
      if (!f._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const y = globalThis.IntersectionObserver, g = new y((m) => {
            for (const b of m)
              b.target instanceof Element && (b.isIntersecting ? (f.classList.remove("show"), p && p.classList.remove("show")) : (f.classList.add("show"), p && p.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          f._nimbiObserver = g;
        } else
          f._nimbiObserver = null;
      try {
        f._nimbiObserver && typeof f._nimbiObserver.disconnect == "function" && f._nimbiObserver.disconnect();
      } catch (y) {
        _("[htmlBuilder] observer disconnect failed", y);
      }
      try {
        f._nimbiObserver && typeof f._nimbiObserver.observe == "function" && f._nimbiObserver.observe(t);
      } catch (y) {
        _("[htmlBuilder] observer observe failed", y);
      }
      try {
        const y = () => {
          try {
            const g = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, m = t.getBoundingClientRect();
            !(m.bottom < g.top || m.top > g.bottom) ? (f.classList.remove("show"), p && p.classList.remove("show")) : (f.classList.add("show"), p && p.classList.add("show"));
          } catch (g) {
            _("[htmlBuilder] checkIntersect failed", g);
          }
        };
        y(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(y, 100);
      } catch (y) {
        _("[htmlBuilder] checkIntersect outer failed", y);
      }
    } else {
      f.classList.remove("show"), p && p.classList.remove("show");
      const y = i instanceof Element ? i : r instanceof Element ? r : window, g = () => {
        try {
          (y === window ? window.scrollY : y.scrollTop || 0) > 10 ? (f.classList.add("show"), p && p.classList.add("show")) : (f.classList.remove("show"), p && p.classList.remove("show"));
        } catch (m) {
          _("[htmlBuilder] onScroll handler failed", m);
        }
      };
      Kn(() => y.addEventListener("scroll", g)), g();
    }
  } catch (l) {
    _("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Kt(e, t) {
  try {
    if (typeof nt == "function")
      try {
        nt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && ee && typeof ee.set == "function" && !ee.has(e) && ee.set(e, t);
  } catch {
  }
  try {
    t && W && typeof W.set == "function" && W.set(t, e);
  } catch {
  }
  try {
    if (Pe && typeof Pe.has == "function") {
      if (!Pe.has(t)) {
        try {
          Pe.add(t);
        } catch {
        }
        try {
          Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
      } catch {
      }
  } catch {
  }
}
function Ui(e, t) {
  try {
    if (!e) return;
    try {
      const n = e[t];
      if (typeof n < "u") return n;
    } catch {
    }
    try {
      if (e.default) return e.default[t];
    } catch {
    }
    return;
  } catch {
    return;
  }
}
function zl(e) {
  try {
    if (!Array.isArray(e)) return e;
    e.forEach((t) => {
      try {
        if (!t || typeof t != "object") return;
        let n = typeof t.slug == "string" ? String(t.slug) : "", i = null;
        if (n && n.indexOf("::") !== -1) {
          const l = n.split("::");
          n = l[0] || "", i = l.slice(1).join("::") || null;
        }
        const r = !!(n && (n.indexOf(".") !== -1 || n.indexOf("/") !== -1));
        let a = "";
        try {
          if (t.path && typeof t.path == "string") {
            const l = J(String(t.path || ""));
            if (a = findSlugForPath(l) || (W && W.has(l) ? W.get(l) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = de(String(t.title).trim());
              else {
                const o = l.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = de(o || l);
              }
          } else if (r) {
            const l = String(n).replace(/\.(?:md|html?)$/i, ""), o = findSlugForPath(l) || (W && W.has(l) ? W.get(l) : "") || "";
            o ? a = o : t.title && String(t.title).trim() ? a = de(String(t.title).trim()) : a = de(l);
          } else
            !n && t.title && String(t.title).trim() ? a = de(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? de(String(t.title).trim()) : n ? de(n) : "";
          } catch {
            a = n;
          }
        }
        let s = a || "";
        i && (s = s ? `${s}::${i}` : `${de(i)}`), s && (t.slug = s);
        try {
          if (t.path && s) {
            const l = String(s).split("::")[0];
            try {
              Kt(l, J(String(t.path || "")));
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
async function Pl(e, t, n, i, r, a, s, l, o = "eager", h = 1, c = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const d = qe(), f = d ? d.parseFromString(n || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Kn(() => kl(p, i)), await Kn(() => xl(p, i));
  try {
    le(p, i);
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
  let y = null, g = null, m = null, b = null, w = null, k = null, S = !1, v = null;
  const E = /* @__PURE__ */ new Map();
  function O() {
    try {
      const T = document.querySelector(".navbar-burger"), N = T && T.dataset ? T.dataset.target : null, A = N ? document.getElementById(N) : null;
      T && T.classList.contains("is-active") && (T.classList.remove("is-active"), T.setAttribute("aria-expanded", "false"), A && A.classList.remove("is-active"));
    } catch (T) {
      _("[nimbi-cms] closeMobileMenu failed", T);
    }
  }
  async function H() {
    const T = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      T && T.classList.add("is-inactive");
    } catch {
    }
    try {
      const N = s && s();
      N && typeof N.then == "function" && await N;
    } catch (N) {
      try {
        _("[nimbi-cms] renderByQuery failed", N);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              T && T.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            T && T.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          T && T.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function U(T) {
    try {
      let N = T && typeof T.slug == "string" ? String(T.slug) : "", A = null;
      try {
        N && N.indexOf("::") !== -1 && (A = N.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (T && T.path && typeof T.path == "string") {
          const C = J(String(T.path || "")), R = C.replace(/^.*\//, "");
          try {
            if (E && E.has(C)) return { page: E.get(C), hash: A };
            if (E && E.has(R)) return { page: E.get(R), hash: A };
          } catch {
          }
          try {
            if (W && W.has(C)) return { page: W.get(C), hash: A };
          } catch {
          }
          try {
            const $ = D(C);
            if ($) return { page: $, hash: A };
          } catch {
          }
        }
      } catch {
      }
      if (N && N.indexOf("::") !== -1) {
        const C = N.split("::");
        N = C[0] || "", A = C.slice(1).join("::") || null;
      }
      if (N && (N.includes(".") || N.includes("/"))) {
        const C = J(T && T.path ? String(T.path) : N), R = C.replace(/^.*\//, "");
        try {
          if (E && E.has(C)) return { page: E.get(C), hash: A };
          if (E && E.has(R)) return { page: E.get(R), hash: A };
        } catch {
        }
        try {
          let $ = D(C);
          if (!$)
            try {
              const Q = String(C || "").replace(/^\/+/, ""), z = Q.replace(/^.*\//, "");
              for (const [j, M] of ee.entries())
                try {
                  let B = null;
                  if (typeof M == "string" ? B = J(String(M || "")) : M && typeof M == "object" && (M.default ? B = J(String(M.default || "")) : B = null), !B) continue;
                  if (B === Q || B.endsWith("/" + Q) || Q.endsWith("/" + B) || B.endsWith(z) || Q.endsWith(z)) {
                    $ = j;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if ($) N = $;
          else
            try {
              const Q = String(N).replace(/\.(?:md|html?)$/i, "");
              N = de(Q || C);
            } catch {
              N = de(C);
            }
        } catch {
          N = de(C);
        }
      }
      return !N && T && T.path && (N = de(J(String(T.path || "")))), { page: N, hash: A };
    } catch {
      return { page: T && T.slug || "", hash: null };
    }
  }
  const P = () => y || (y = (async () => {
    try {
      const T = await Promise.resolve().then(() => at), N = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, A = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, C = Ui(T, "buildSearchIndex"), R = Ui(T, "buildSearchIndexWorker"), $ = typeof N == "function" ? N : C || void 0, Q = typeof A == "function" ? A : R || void 0;
      It("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof $ + " workerFn=" + typeof Q + " (global preferred)");
      const z = [];
      try {
        r && z.push(r);
      } catch {
      }
      try {
        navigationPage && z.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof Q == "function")
        try {
          const j = await Q(i, h, c, z.length ? z : void 0);
          if (j && j.length) {
            try {
              if (T && typeof T._setSearchIndex == "function")
                try {
                  T._setSearchIndex(j);
                } catch {
                }
            } catch {
            }
            return j;
          }
        } catch (j) {
          _("[nimbi-cms] worker builder threw", j);
        }
      return typeof $ == "function" ? (It("[nimbi-cms test] calling buildFn"), await $(i, h, c, z.length ? z : void 0)) : [];
    } catch (T) {
      return _("[nimbi-cms] buildSearchIndex failed", T), [];
    } finally {
      if (g) {
        try {
          g.removeAttribute("disabled");
        } catch {
        }
        try {
          m && m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), y.then((T) => {
    try {
      try {
        v = Array.isArray(T) ? T : null;
      } catch {
        v = null;
      }
      try {
        zl(T);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const R = await Promise.resolve().then(() => at);
                try {
                  try {
                    R && typeof R._setSearchIndex == "function" && R._setSearchIndex(Array.isArray(T) ? T : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return R && Array.isArray(R.searchIndex) ? R.searchIndex : Array.isArray(v) ? v : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = R && Array.isArray(R.searchIndex) ? R.searchIndex : Array.isArray(v) ? v : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(re) ? re : Array.isArray(v) ? v : [];
                } catch {
                }
              }
            })();
          } catch {
          }
          try {
            window.__nimbi_contentBase = i;
          } catch {
          }
          try {
            window.__nimbi_indexDepth = h;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = c;
          } catch {
          }
        }
      } catch {
      }
      const N = String(g && g.value || "").trim().toLowerCase();
      if (!N || !Array.isArray(T) || !T.length) return;
      const A = T.filter((R) => R.title && R.title.toLowerCase().includes(N) || R.excerpt && R.excerpt.toLowerCase().includes(N));
      if (!A || !A.length) return;
      const C = document.getElementById("nimbi-search-results");
      if (!C) return;
      try {
        typeof C.replaceChildren == "function" ? C.replaceChildren() : C.innerHTML = "";
      } catch {
        try {
          C.innerHTML = "";
        } catch {
        }
      }
      try {
        const R = document.createElement("div");
        R.className = "panel nimbi-search-panel", A.slice(0, 10).forEach(($) => {
          try {
            if ($.parentTitle) {
              const M = document.createElement("p");
              M.className = "panel-heading nimbi-search-title nimbi-search-parent", M.textContent = $.parentTitle, R.appendChild(M);
            }
            const Q = document.createElement("a");
            Q.className = "panel-block nimbi-search-result";
            const z = U($);
            Q.href = $e(z.page, z.hash), Q.setAttribute("role", "button");
            try {
              if ($.path && typeof $.path == "string")
                try {
                  Kt(z.page, $.path);
                } catch {
                }
            } catch {
            }
            const j = document.createElement("div");
            j.className = "is-size-6 has-text-weight-semibold", j.textContent = $.title, Q.appendChild(j), Q.addEventListener("click", () => {
              try {
                C.style.display = "none";
              } catch {
              }
            }), R.appendChild(Q);
          } catch {
          }
        }), C.appendChild(R);
        try {
          C.style.display = "block";
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
        if (S) return;
        S = !0;
        const T = await Promise.resolve().then(() => xn);
        try {
          await T.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
        } catch (N) {
          _("[nimbi-cms] sitemap trigger failed", N);
        }
      } catch (T) {
        try {
          _("[nimbi-cms] sitemap dynamic import failed", T);
        } catch {
        }
      }
    })();
  }), y), K = document.createElement("nav");
  K.className = "navbar", K.setAttribute("role", "navigation"), K.setAttribute("aria-label", "main navigation");
  const Z = document.createElement("div");
  Z.className = "navbar-brand";
  const ie = p[0], q = document.createElement("a");
  if (q.className = "navbar-item", ie) {
    const T = ie.getAttribute("href") || "#";
    try {
      const A = new URL(T, location.href).searchParams.get("page"), C = A ? decodeURIComponent(A) : r;
      let R = null;
      try {
        typeof C == "string" && (/(?:\.md|\.html?)$/i.test(C) || C.includes("/")) && (R = D(C));
      } catch {
      }
      !R && typeof C == "string" && !String(C).includes(".") && (R = C);
      const $ = R || C;
      q.href = $e($), (!q.textContent || !String(q.textContent).trim()) && (q.textContent = a("home"));
    } catch {
      try {
        const A = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? D(r) : typeof r == "string" && !r.includes(".") ? r : null;
        q.href = $e(A || r);
      } catch {
        q.href = $e(r);
      }
      q.textContent = a("home");
    }
  } else
    q.href = $e(r), q.textContent = a("home");
  async function L(T) {
    try {
      if (!T || T === "none") return null;
      if (T === "favicon")
        try {
          const N = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!N) return null;
          const A = N.getAttribute("href") || "";
          return A && /\.png(?:\?|$)/i.test(A) ? new URL(A, location.href).toString() : null;
        } catch {
          return null;
        }
      if (T === "copy-first" || T === "move-first")
        try {
          const N = await Te(r, i);
          if (!N || !N.raw) return null;
          const A = qe(), C = A ? A.parseFromString(N.raw, "text/html") : null, R = C ? C.querySelector("img") : null;
          if (!R) return null;
          const $ = R.getAttribute("src") || "";
          if (!$) return null;
          const Q = new URL($, location.href).toString();
          if (T === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", Q);
            } catch {
            }
          return Q;
        } catch {
          return null;
        }
      try {
        return new URL(T, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let F = null;
  try {
    F = await L(u);
  } catch {
    F = null;
  }
  if (F)
    try {
      const T = document.createElement("img");
      T.className = "nimbi-navbar-logo";
      const N = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      T.alt = N, T.title = N, T.src = F;
      try {
        T.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!q.textContent || !String(q.textContent).trim()) && (q.textContent = N);
      } catch {
      }
      try {
        q.insertBefore(T, q.firstChild);
      } catch {
        try {
          q.appendChild(T);
        } catch {
        }
      }
    } catch {
    }
  Z.appendChild(q), q.addEventListener("click", function(T) {
    const N = q.getAttribute("href") || "";
    if (N.startsWith("?page=")) {
      T.preventDefault();
      const A = new URL(N, location.href), C = A.searchParams.get("page"), R = A.hash ? A.hash.replace(/^#/, "") : null;
      history.pushState({ page: C }, "", $e(C, R)), H();
      try {
        O();
      } catch {
      }
    }
  });
  function D(T) {
    try {
      if (!T) return null;
      const N = J(String(T || ""));
      try {
        if (W && W.has(N)) return W.get(N);
      } catch {
      }
      const A = N.replace(/^.*\//, "");
      try {
        if (W && W.has(A)) return W.get(A);
      } catch {
      }
      try {
        for (const [C, R] of ee.entries())
          if (R) {
            if (typeof R == "string") {
              if (J(R) === N) return C;
            } else if (R && typeof R == "object") {
              if (R.default && J(R.default) === N) return C;
              const $ = R.langs || {};
              for (const Q in $)
                if ($[Q] && J($[Q]) === N) return C;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function le(T, N) {
    try {
      if (!T || !T.length) return;
      const A = [];
      for (let z = 0; z < T.length; z++)
        try {
          const j = T[z];
          if (!j || typeof j.getAttribute != "function") continue;
          const M = j.getAttribute("href") || "";
          if (!M || Cr(M)) continue;
          let B = null;
          try {
            const ge = it(M);
            ge && ge.page && (B = ge.page);
          } catch {
          }
          if (!B) {
            const ge = String(M || "").split(/[?#]/, 1), Me = ge && ge[0] ? ge[0] : M;
            (/\.(?:md|html?)$/i.test(Me) || Me.indexOf("/") !== -1) && (B = J(String(Me || "")));
          }
          if (!B) continue;
          const Y = J(String(B || "")), G = Y.replace(/^.*\//, "");
          let me = null;
          try {
            E && E.has(Y) && (me = E.get(Y));
          } catch {
          }
          try {
            !me && W && W.has(Y) && (me = W.get(Y));
          } catch {
          }
          if (me) continue;
          let Ce = null;
          try {
            Ce = j.textContent && String(j.textContent).trim() ? String(j.textContent).trim() : null;
          } catch {
            Ce = null;
          }
          let ye = null;
          if (Ce) ye = de(Ce);
          else {
            const ge = G.replace(/\.(?:md|html?)$/i, "");
            ye = de(ge || Y);
          }
          if (ye)
            try {
              A.push({ path: Y, candidate: ye });
            } catch {
            }
        } catch {
        }
      if (!A.length) return;
      const C = 3;
      let R = 0;
      const $ = async () => {
        for (; R < A.length; ) {
          const z = A[R++];
          if (!(!z || !z.path))
            try {
              const j = await Te(z.path, N);
              if (!j || !j.raw) continue;
              let M = null;
              if (j.isHtml)
                try {
                  const B = qe(), Y = B ? B.parseFromString(j.raw, "text/html") : null, G = Y ? Y.querySelector("h1") || Y.querySelector("title") : null;
                  G && G.textContent && (M = String(G.textContent).trim());
                } catch {
                }
              else
                try {
                  const B = j.raw.match(/^#\s+(.+)$/m);
                  B && B[1] && (M = String(B[1]).trim());
                } catch {
                }
              if (M) {
                const B = de(M);
                if (B && B !== z.candidate) {
                  try {
                    Kt(B, z.path);
                  } catch {
                  }
                  try {
                    E.set(z.path, B);
                  } catch {
                  }
                  try {
                    E.set(z.path.replace(/^.*\//, ""), B);
                  } catch {
                  }
                  try {
                    const Y = await Promise.resolve().then(() => at);
                    try {
                      if (Array.isArray(Y.searchIndex)) {
                        let G = !1;
                        for (const me of Y.searchIndex)
                          try {
                            if (me && me.path === z.path && me.slug) {
                              const ye = String(me.slug).split("::").slice(1).join("::");
                              me.slug = ye ? `${B}::${ye}` : B, G = !0;
                            }
                          } catch {
                          }
                        try {
                          G && typeof Y._setSearchIndex == "function" && Y._setSearchIndex(Y.searchIndex);
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
      }, Q = [];
      for (let z = 0; z < C; z++) Q.push($());
      try {
        await Promise.all(Q);
      } catch {
      }
    } catch {
    }
  }
  const te = document.createElement("a");
  te.className = "navbar-burger", te.setAttribute("role", "button"), te.setAttribute("aria-label", "menu"), te.setAttribute("aria-expanded", "false");
  const ce = "nimbi-navbar-menu";
  te.dataset.target = ce, te.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', Z.appendChild(te);
  try {
    te.addEventListener("click", (T) => {
      try {
        const N = te.dataset && te.dataset.target ? te.dataset.target : null, A = N ? document.getElementById(N) : null;
        te.classList.contains("is-active") ? (te.classList.remove("is-active"), te.setAttribute("aria-expanded", "false"), A && A.classList.remove("is-active")) : (te.classList.add("is-active"), te.setAttribute("aria-expanded", "true"), A && A.classList.add("is-active"));
      } catch (N) {
        _("[nimbi-cms] navbar burger toggle failed", N);
      }
    });
  } catch (T) {
    _("[nimbi-cms] burger event binding failed", T);
  }
  const _e = document.createElement("div");
  _e.className = "navbar-menu", _e.id = ce;
  const ve = document.createElement("div");
  ve.className = "navbar-start";
  let He = null, xe = null;
  if (!l)
    He = null, g = null, b = null, w = null, k = null;
  else {
    He = document.createElement("div"), He.className = "navbar-end", xe = document.createElement("div"), xe.className = "navbar-item", g = document.createElement("input"), g.className = "input", g.type = "search", g.placeholder = a("searchPlaceholder") || "", g.id = "nimbi-search";
    try {
      const R = (a && typeof a == "function" ? a("searchAria") : null) || g.placeholder || "Search";
      try {
        g.setAttribute("aria-label", R);
      } catch {
      }
      try {
        g.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        g.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        g.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    o === "eager" && (g.disabled = !0), m = document.createElement("div"), m.className = "control", o === "eager" && m.classList.add("is-loading"), m.appendChild(g), xe.appendChild(m), b = document.createElement("div"), b.className = "dropdown is-right", b.id = "nimbi-search-dropdown";
    const T = document.createElement("div");
    T.className = "dropdown-trigger", T.appendChild(xe);
    const N = document.createElement("div");
    N.className = "dropdown-menu", N.setAttribute("role", "menu"), w = document.createElement("div"), w.id = "nimbi-search-results", w.className = "dropdown-content nimbi-search-results", k = w, N.appendChild(w), b.appendChild(T), b.appendChild(N), He.appendChild(b);
    const A = (R) => {
      if (!w) return;
      try {
        if (typeof w.replaceChildren == "function") w.replaceChildren();
        else
          for (; w.firstChild; ) w.removeChild(w.firstChild);
      } catch {
        try {
          w.innerHTML = "";
        } catch {
        }
      }
      let $ = -1;
      function Q(M) {
        try {
          const B = w.querySelector(".nimbi-search-result.is-selected");
          B && B.classList.remove("is-selected");
          const Y = w.querySelectorAll(".nimbi-search-result");
          if (!Y || !Y.length) return;
          if (M < 0) {
            $ = -1;
            return;
          }
          M >= Y.length && (M = Y.length - 1);
          const G = Y[M];
          if (G) {
            G.classList.add("is-selected"), $ = M;
            try {
              G.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function z(M) {
        try {
          const B = M.key, Y = w.querySelectorAll(".nimbi-search-result");
          if (!Y || !Y.length) return;
          if (B === "ArrowDown") {
            M.preventDefault();
            const G = $ < 0 ? 0 : Math.min(Y.length - 1, $ + 1);
            Q(G);
            return;
          }
          if (B === "ArrowUp") {
            M.preventDefault();
            const G = $ <= 0 ? 0 : $ - 1;
            Q(G);
            return;
          }
          if (B === "Enter") {
            M.preventDefault();
            const G = w.querySelector(".nimbi-search-result.is-selected") || w.querySelector(".nimbi-search-result");
            if (G)
              try {
                G.click();
              } catch {
              }
            return;
          }
          if (B === "Escape") {
            try {
              b.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              w.style.display = "none";
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
              w.removeEventListener("keydown", z);
            } catch {
            }
            try {
              g && g.focus();
            } catch {
            }
            try {
              g && g.removeEventListener("keydown", j);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function j(M) {
        try {
          if (M && M.key === "ArrowDown") {
            M.preventDefault();
            try {
              w.focus();
            } catch {
            }
            Q(0);
          }
        } catch {
        }
      }
      try {
        const M = document.createElement("div");
        M.className = "panel nimbi-search-panel";
        const B = document.createDocumentFragment();
        R.forEach((Y) => {
          if (Y.parentTitle) {
            const ye = document.createElement("p");
            ye.textContent = Y.parentTitle, ye.className = "panel-heading nimbi-search-title nimbi-search-parent", B.appendChild(ye);
          }
          const G = document.createElement("a");
          G.className = "panel-block nimbi-search-result";
          const me = U(Y);
          G.href = $e(me.page, me.hash), G.setAttribute("role", "button");
          try {
            if (Y.path && typeof Y.path == "string")
              try {
                Kt(me.page, Y.path);
              } catch {
              }
          } catch {
          }
          const Ce = document.createElement("div");
          Ce.className = "is-size-6 has-text-weight-semibold", Ce.textContent = Y.title, G.appendChild(Ce), G.addEventListener("click", (ye) => {
            try {
              try {
                ye && ye.preventDefault && ye.preventDefault();
              } catch {
              }
              try {
                ye && ye.stopPropagation && ye.stopPropagation();
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
                w.style.display = "none";
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
                w.removeEventListener("keydown", z);
              } catch {
              }
              try {
                g && g.removeEventListener("keydown", j);
              } catch {
              }
              try {
                const ge = G.getAttribute && G.getAttribute("href") || "";
                let Me = null, Qe = null;
                try {
                  const je = new URL(ge, location.href);
                  Me = je.searchParams.get("page"), Qe = je.hash ? je.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Me)
                  try {
                    history.pushState({ page: Me }, "", $e(Me, Qe));
                    try {
                      H();
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
                window.location.href = G.href;
              } catch {
              }
            } catch {
            }
          }), B.appendChild(G);
        }), M.appendChild(B), w.appendChild(M);
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
        w.style.display = "block";
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
        w.addEventListener("keydown", z);
      } catch {
      }
      try {
        g && g.addEventListener("keydown", j);
      } catch {
      }
    }, C = (R, $) => {
      let Q = null;
      return (...z) => {
        Q && clearTimeout(Q), Q = setTimeout(() => R(...z), $);
      };
    };
    if (g) {
      const R = C(async () => {
        const $ = document.querySelector("input#nimbi-search"), Q = String($ && $.value || "").trim().toLowerCase();
        if (!Q) {
          A([]);
          return;
        }
        try {
          await P();
          const z = await y, j = Array.isArray(z) ? z.filter((M) => M.title && M.title.toLowerCase().includes(Q) || M.excerpt && M.excerpt.toLowerCase().includes(Q)) : [];
          A(j.slice(0, 10));
        } catch (z) {
          _("[nimbi-cms] search input handler failed", z), A([]);
        }
      }, 50);
      try {
        g.addEventListener("input", R);
      } catch {
      }
      try {
        document.addEventListener("input", ($) => {
          try {
            $ && $.target && $.target.id === "nimbi-search" && R($);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        y = P();
      } catch (R) {
        _("[nimbi-cms] eager search index init failed", R), y = Promise.resolve([]);
      }
      y.finally(() => {
        const R = document.querySelector("input#nimbi-search");
        if (R) {
          try {
            R.removeAttribute("disabled");
          } catch {
          }
          try {
            m && m.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (S) return;
            S = !0;
            const $ = await y.catch(() => []), Q = await Promise.resolve().then(() => xn);
            try {
              await Q.handleSitemapRequest({ index: Array.isArray($) ? $ : void 0, homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
            } catch (z) {
              _("[nimbi-cms] sitemap trigger failed", z);
            }
          } catch ($) {
            try {
              _("[nimbi-cms] sitemap dynamic import failed", $);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const R = ($) => {
        try {
          const Q = $ && $.target;
          if (!k || !k.classList.contains("is-open") && k.style && k.style.display !== "block" || Q && (k.contains(Q) || g && (Q === g || g.contains && g.contains(Q)))) return;
          if (b) {
            b.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            k.style.display = "none";
          } catch {
          }
          try {
            k.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", R, !0), document.addEventListener("touchstart", R, !0);
    } catch {
    }
  }
  const De = document.createDocumentFragment();
  for (let T = 0; T < p.length; T++) {
    const N = p[T];
    if (T === 0) continue;
    const A = N.getAttribute("href") || "#";
    let C = A;
    const R = document.createElement("a");
    R.className = "navbar-item";
    try {
      let $ = null;
      try {
        $ = it(String(A || ""));
      } catch {
        $ = null;
      }
      let Q = null, z = null;
      if ($ && ($.type === "canonical" && $.page || $.type === "cosmetic" && $.page) && (Q = $.page, z = $.anchor), Q && (/\.(?:md|html?)$/i.test(Q) || Q.includes("/") ? C = Q : R.href = $e(Q, z)), /^[^#]*\.md(?:$|[#?])/.test(C) || C.endsWith(".md")) {
        const M = J(C).split(/::|#/, 2), B = M[0], Y = M[1], G = D(B);
        G ? R.href = $e(G, Y) : R.href = $e(B, Y);
      } else if (/\.html(?:$|[#?])/.test(C) || C.endsWith(".html")) {
        const M = J(C).split(/::|#/, 2);
        let B = M[0];
        B && !B.toLowerCase().endsWith(".html") && (B = B + ".html");
        const Y = M[1], G = D(B);
        if (G)
          R.href = $e(G, Y);
        else
          try {
            const me = await Te(B, i);
            if (me && me.raw)
              try {
                const Ce = qe(), ye = Ce ? Ce.parseFromString(me.raw, "text/html") : null, ge = ye ? ye.querySelector("title") : null, Me = ye ? ye.querySelector("h1") : null, Qe = ge && ge.textContent && ge.textContent.trim() ? ge.textContent.trim() : Me && Me.textContent ? Me.textContent.trim() : null;
                if (Qe) {
                  const je = de(Qe);
                  if (je) {
                    try {
                      Kt(je, B);
                    } catch (yt) {
                      _("[nimbi-cms] slugToMd/mdToSlug set failed", yt);
                    }
                    R.href = $e(je, Y);
                  } else
                    R.href = $e(B, Y);
                } else
                  R.href = $e(B, Y);
              } catch {
                R.href = $e(B, Y);
              }
            else
              R.href = C;
          } catch {
            R.href = C;
          }
      } else
        R.href = C;
    } catch ($) {
      _("[nimbi-cms] nav item href parse failed", $), R.href = C;
    }
    try {
      const $ = N.textContent && String(N.textContent).trim() ? String(N.textContent).trim() : null;
      if ($)
        try {
          const Q = de($);
          if (Q) {
            const z = R.getAttribute("href") || "";
            let j = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(z))
              j = J(String(z || "").split(/[?#]/)[0]);
            else
              try {
                const M = it(z);
                M && M.type === "canonical" && M.page && (j = J(M.page));
              } catch {
              }
            if (j) {
              let M = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String(j || "")))
                  M = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String(j || "")))
                  M = !1;
                else {
                  const B = String(j || "").replace(/^\.\//, ""), Y = B.replace(/^.*\//, "");
                  Pe && Pe.size && (Pe.has(B) || Pe.has(Y)) && (M = !0);
                }
              } catch {
                M = !1;
              }
              if (M)
                try {
                  const B = J(String(j || "").split(/[?#]/)[0]);
                  let Y = !1;
                  try {
                    D && typeof D == "function" && D(B) && (Y = !0);
                  } catch {
                  }
                  try {
                    Kt(Q, j);
                  } catch {
                  }
                  try {
                    if (B) {
                      try {
                        E.set(B, Q);
                      } catch {
                      }
                      try {
                        const G = B.replace(/^.*\//, "");
                        G && E.set(G, Q);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Y)
                    try {
                      R.href = $e(Q);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (Q) {
          _("[nimbi-cms] nav slug mapping failed", Q);
        }
    } catch ($) {
      _("[nimbi-cms] nav slug mapping failed", $);
    }
    R.textContent = N.textContent || C, De.appendChild(R);
  }
  try {
    ve.appendChild(De);
  } catch {
  }
  _e.appendChild(ve), He && _e.appendChild(He), K.appendChild(Z), K.appendChild(_e), e.appendChild(K);
  try {
    const T = (N) => {
      try {
        const A = K && K.querySelector ? K.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!A || !A.classList.contains("is-active")) return;
        const C = A && A.closest ? A.closest(".navbar") : K;
        if (C && C.contains(N.target)) return;
        O();
      } catch {
      }
    };
    document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
  } catch {
  }
  try {
    _e.addEventListener("click", (T) => {
      const N = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!N) return;
      const A = N.getAttribute("href") || "";
      try {
        const C = new URL(A, location.href), R = C.searchParams.get("page"), $ = C.hash ? C.hash.replace(/^#/, "") : null;
        R && (T.preventDefault(), history.pushState({ page: R }, "", $e(R, $)), H());
      } catch (C) {
        _("[nimbi-cms] navbar click handler failed", C);
      }
      try {
        const C = K && K.querySelector ? K.querySelector(".navbar-burger") : null, R = C && C.dataset ? C.dataset.target : null, $ = R ? document.getElementById(R) : null;
        C && C.classList.contains("is-active") && (C.classList.remove("is-active"), C.setAttribute("aria-expanded", "false"), $ && $.classList.remove("is-active"));
      } catch (C) {
        _("[nimbi-cms] mobile menu close failed", C);
      }
    });
  } catch (T) {
    _("[nimbi-cms] attach content click handler failed", T);
  }
  try {
    t.addEventListener("click", (T) => {
      const N = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!N) return;
      const A = N.getAttribute("href") || "";
      if (A && !Cr(A))
        try {
          const C = new URL(A, location.href), R = C.searchParams.get("page"), $ = C.hash ? C.hash.replace(/^#/, "") : null;
          R && (T.preventDefault(), history.pushState({ page: R }, "", $e(R, $)), H());
        } catch (C) {
          _("[nimbi-cms] container click URL parse failed", C);
        }
    });
  } catch (T) {
    _("[nimbi-cms] build navbar failed", T);
  }
  return { navbar: K, linkEls: p };
}
try {
  document.addEventListener("input", (e) => {
    try {
      if (e && e.target && e.target.id === "nimbi-search") {
        const t = document.getElementById("nimbi-search-results");
        if (t && e.target && e.target.value)
          try {
            t.style.display = "block";
          } catch {
          }
      }
    } catch {
    }
  }, !0);
} catch {
}
let tt = null, fe = null, Xe = 1, kt = (e, t) => t, wn = 0, _n = 0, Gn = () => {
}, hn = 0.25;
function $l() {
  if (tt && document.contains(tt)) return tt;
  tt = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", kt("imagePreviewTitle", "Image preview"));
  try {
    const L = document.createElement("div");
    L.className = "modal-background";
    const F = document.createElement("div");
    F.className = "modal-content";
    const D = document.createElement("div");
    D.className = "nimbi-image-preview__content box", D.setAttribute("role", "document");
    const le = document.createElement("button");
    le.className = "button is-small nimbi-image-preview__close", le.type = "button", le.setAttribute("data-nimbi-preview-close", ""), le.textContent = "✕";
    const te = document.createElement("div");
    te.className = "nimbi-image-preview__image-wrapper";
    const ce = document.createElement("img");
    ce.setAttribute("data-nimbi-preview-image", ""), ce.alt = "", te.appendChild(ce);
    const _e = document.createElement("div");
    _e.className = "nimbi-image-preview__controls";
    const ve = document.createElement("div");
    ve.className = "nimbi-image-preview__group";
    const He = document.createElement("button");
    He.className = "button is-small", He.type = "button", He.setAttribute("data-nimbi-preview-fit", ""), He.textContent = "⤢";
    const xe = document.createElement("button");
    xe.className = "button is-small", xe.type = "button", xe.setAttribute("data-nimbi-preview-original", ""), xe.textContent = "1:1";
    const De = document.createElement("button");
    De.className = "button is-small", De.type = "button", De.setAttribute("data-nimbi-preview-reset", ""), De.textContent = "⟲", ve.appendChild(He), ve.appendChild(xe), ve.appendChild(De);
    const T = document.createElement("div");
    T.className = "nimbi-image-preview__group";
    const N = document.createElement("button");
    N.className = "button is-small", N.type = "button", N.setAttribute("data-nimbi-preview-zoom-out", ""), N.textContent = "−";
    const A = document.createElement("div");
    A.className = "nimbi-image-preview__zoom", A.setAttribute("data-nimbi-preview-zoom-label", ""), A.textContent = "100%";
    const C = document.createElement("button");
    C.className = "button is-small", C.type = "button", C.setAttribute("data-nimbi-preview-zoom-in", ""), C.textContent = "＋", T.appendChild(N), T.appendChild(A), T.appendChild(C), _e.appendChild(ve), _e.appendChild(T), D.appendChild(le), D.appendChild(te), D.appendChild(_e), F.appendChild(D), e.appendChild(L), e.appendChild(F);
  } catch {
    e.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="nimbi-image-preview__content box" role="document">
          <button class="button is-small nimbi-image-preview__close" type="button" data-nimbi-preview-close>✕</button>
          <div class="nimbi-image-preview__image-wrapper">
            <img data-nimbi-preview-image alt="" />
          </div>
          <div class="nimbi-image-preview__controls">
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-fit>⤢</button>
              <button class="button is-small" type="button" data-nimbi-preview-original>1:1</button>
              <button class="button is-small" type="button" data-nimbi-preview-reset>⟲</button>
            </div>
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-zoom-out>−</button>
              <div class="nimbi-image-preview__zoom" data-nimbi-preview-zoom-label>100%</div>
              <button class="button is-small" type="button" data-nimbi-preview-zoom-in>＋</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  e.addEventListener("click", (L) => {
    L.target === e && vr();
  }), e.addEventListener("wheel", (L) => {
    if (!U()) return;
    L.preventDefault();
    const F = L.deltaY < 0 ? hn : -hn;
    Et(Xe + F), h(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      vr();
      return;
    }
    if (Xe > 1) {
      const F = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!F) return;
      const D = 40;
      switch (L.key) {
        case "ArrowUp":
          F.scrollTop -= D, L.preventDefault();
          break;
        case "ArrowDown":
          F.scrollTop += D, L.preventDefault();
          break;
        case "ArrowLeft":
          F.scrollLeft -= D, L.preventDefault();
          break;
        case "ArrowRight":
          F.scrollLeft += D, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), tt = e, fe = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function h() {
    l && (l.textContent = `${Math.round(Xe * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(Xe * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Gn = h, i.addEventListener("click", () => {
    Et(Xe + hn), h(), c();
  }), r.addEventListener("click", () => {
    Et(Xe - hn), h(), c();
  }), t.addEventListener("click", () => {
    kn(), h(), c();
  }), n.addEventListener("click", () => {
    Et(1), h(), c();
  }), a.addEventListener("click", () => {
    kn(), h(), c();
  }), s.addEventListener("click", vr), t.title = kt("imagePreviewFit", "Fit to screen"), n.title = kt("imagePreviewOriginal", "Original size"), r.title = kt("imagePreviewZoomOut", "Zoom out"), i.title = kt("imagePreviewZoomIn", "Zoom in"), s.title = kt("imagePreviewClose", "Close"), s.setAttribute("aria-label", kt("imagePreviewClose", "Close"));
  let u = !1, d = 0, f = 0, p = 0, y = 0;
  const g = /* @__PURE__ */ new Map();
  let m = 0, b = 1;
  const w = (L, F) => {
    const D = L.x - F.x, le = L.y - F.y;
    return Math.hypot(D, le);
  }, k = () => {
    u = !1, g.clear(), m = 0, fe && (fe.classList.add("is-panning"), fe.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, E = 0;
  const O = (L) => {
    const F = Date.now(), D = F - S, le = L.clientX - v, te = L.clientY - E;
    S = F, v = L.clientX, E = L.clientY, D < 300 && Math.hypot(le, te) < 30 && (Et(Xe > 1 ? 1 : 2), h(), L.preventDefault());
  }, H = (L) => {
    Et(Xe > 1 ? 1 : 2), h(), L.preventDefault();
  }, U = () => tt ? typeof tt.open == "boolean" ? tt.open : tt.classList.contains("is-active") : !1, P = (L, F, D = 1) => {
    if (g.has(D) && g.set(D, { x: L, y: F }), g.size === 2) {
      const _e = Array.from(g.values()), ve = w(_e[0], _e[1]);
      if (m > 0) {
        const He = ve / m;
        Et(b * He);
      }
      return;
    }
    if (!u) return;
    const le = fe.closest(".nimbi-image-preview__image-wrapper");
    if (!le) return;
    const te = L - d, ce = F - f;
    le.scrollLeft = p - te, le.scrollTop = y - ce;
  }, K = (L, F, D = 1) => {
    if (!U()) return;
    if (g.set(D, { x: L, y: F }), g.size === 2) {
      const ce = Array.from(g.values());
      m = w(ce[0], ce[1]), b = Xe;
      return;
    }
    const le = fe.closest(".nimbi-image-preview__image-wrapper");
    !le || !(le.scrollWidth > le.clientWidth || le.scrollHeight > le.clientHeight) || (u = !0, d = L, f = F, p = le.scrollLeft, y = le.scrollTop, fe.classList.add("is-panning"), fe.classList.remove("is-grabbing"), window.addEventListener("pointermove", Z), window.addEventListener("pointerup", ie), window.addEventListener("pointercancel", ie));
  }, Z = (L) => {
    u && (L.preventDefault(), P(L.clientX, L.clientY, L.pointerId));
  }, ie = () => {
    k(), window.removeEventListener("pointermove", Z), window.removeEventListener("pointerup", ie), window.removeEventListener("pointercancel", ie);
  };
  fe.addEventListener("pointerdown", (L) => {
    L.preventDefault(), K(L.clientX, L.clientY, L.pointerId);
  }), fe.addEventListener("pointermove", (L) => {
    (u || g.size === 2) && L.preventDefault(), P(L.clientX, L.clientY, L.pointerId);
  }), fe.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && O(L), k();
  }), fe.addEventListener("dblclick", H), fe.addEventListener("pointercancel", k), fe.addEventListener("mousedown", (L) => {
    L.preventDefault(), K(L.clientX, L.clientY, 1);
  }), fe.addEventListener("mousemove", (L) => {
    u && L.preventDefault(), P(L.clientX, L.clientY, 1);
  }), fe.addEventListener("mouseup", (L) => {
    L.preventDefault(), k();
  });
  const q = e.querySelector(".nimbi-image-preview__image-wrapper");
  return q && (q.addEventListener("pointerdown", (L) => {
    if (K(L.clientX, L.clientY, L.pointerId), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), q.addEventListener("pointermove", (L) => {
    P(L.clientX, L.clientY, L.pointerId);
  }), q.addEventListener("pointerup", k), q.addEventListener("pointercancel", k), q.addEventListener("mousedown", (L) => {
    if (K(L.clientX, L.clientY, 1), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), q.addEventListener("mousemove", (L) => {
    P(L.clientX, L.clientY, 1);
  }), q.addEventListener("mouseup", k)), e;
}
function Et(e) {
  if (!fe) return;
  const t = Number(e);
  Xe = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = fe.getBoundingClientRect(), r = wn || fe.naturalWidth || fe.width || i.width || 0, a = _n || fe.naturalHeight || fe.height || i.height || 0;
  if (r && a) {
    fe.style.setProperty("--nimbi-preview-img-max-width", "none"), fe.style.setProperty("--nimbi-preview-img-max-height", "none"), fe.style.setProperty("--nimbi-preview-img-width", `${r * Xe}px`), fe.style.setProperty("--nimbi-preview-img-height", `${a * Xe}px`), fe.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      fe.style.width = `${r * Xe}px`, fe.style.height = `${a * Xe}px`, fe.style.transform = "none";
    } catch {
    }
  } else {
    fe.style.setProperty("--nimbi-preview-img-max-width", ""), fe.style.setProperty("--nimbi-preview-img-max-height", ""), fe.style.setProperty("--nimbi-preview-img-width", ""), fe.style.setProperty("--nimbi-preview-img-height", ""), fe.style.setProperty("--nimbi-preview-img-transform", `scale(${Xe})`);
    try {
      fe.style.transform = `scale(${Xe})`;
    } catch {
    }
  }
  fe && (fe.classList.add("is-panning"), fe.classList.remove("is-grabbing"));
}
function kn() {
  if (!fe) return;
  const e = fe.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = wn || fe.naturalWidth || t.width, i = _n || fe.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  Et(Number.isFinite(s) ? s : 1);
}
function Il(e, t = "", n = 0, i = 0) {
  const r = $l();
  Xe = 1, wn = n || 0, _n = i || 0, fe.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", h = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = kt("imagePreviewDefaultAlt", h || "Image");
      } catch {
        t = kt("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  fe.alt = t, fe.style.transform = "scale(1)";
  const a = () => {
    wn = fe.naturalWidth || fe.width || 0, _n = fe.naturalHeight || fe.height || 0;
  };
  if (a(), kn(), Gn(), requestAnimationFrame(() => {
    kn(), Gn();
  }), !wn || !_n) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        kn(), Gn();
      }), fe.removeEventListener("load", s);
    };
    fe.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function vr() {
  if (tt) {
    typeof tt.close == "function" && tt.open && tt.close(), tt.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Nl(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  kt = (f, p) => (typeof t == "function" ? t(f) : void 0) || p, hn = n, e.addEventListener("click", (f) => {
    const p = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!p || p.tagName !== "IMG") return;
    const y = (
      /** @type {HTMLImageElement} */
      p
    );
    if (!y.src) return;
    const g = y.closest("a");
    g && g.getAttribute("href") || Il(y.src, y.alt || "", y.naturalWidth || 0, y.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let h = 0, c = 1;
  const u = (f, p) => {
    const y = f.x - p.x, g = f.y - p.y;
    return Math.hypot(y, g);
  };
  e.addEventListener("pointerdown", (f) => {
    const p = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!p || p.tagName !== "IMG") return;
    const y = p.closest("a");
    if (y && y.getAttribute("href") || !tt || !tt.open) return;
    if (o.set(f.pointerId, { x: f.clientX, y: f.clientY }), o.size === 2) {
      const m = Array.from(o.values());
      h = u(m[0], m[1]), c = Xe;
      return;
    }
    const g = p.closest(".nimbi-image-preview__image-wrapper");
    if (g && !(Xe <= 1)) {
      f.preventDefault(), i = !0, r = f.clientX, a = f.clientY, s = g.scrollLeft, l = g.scrollTop, p.setPointerCapture(f.pointerId);
      try {
        p.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (f) => {
    if (o.has(f.pointerId) && o.set(f.pointerId, { x: f.clientX, y: f.clientY }), o.size === 2) {
      f.preventDefault();
      const w = Array.from(o.values()), k = u(w[0], w[1]);
      if (h > 0) {
        const S = k / h;
        Et(c * S);
      }
      return;
    }
    if (!i) return;
    f.preventDefault();
    const p = (
      /** @type {HTMLElement} */
      f.target
    ), y = p.closest && p.closest("a");
    if (y && y.getAttribute && y.getAttribute("href")) return;
    const g = p.closest(".nimbi-image-preview__image-wrapper");
    if (!g) return;
    const m = f.clientX - r, b = f.clientY - a;
    g.scrollLeft = s - m, g.scrollTop = l - b;
  });
  const d = () => {
    i = !1, o.clear(), h = 0;
    try {
      const f = document.querySelector("[data-nimbi-preview-image]");
      f && (f.classList.add("is-panning"), f.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", d), e.addEventListener("pointercancel", d);
}
function Ol(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: h
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const u = yl(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  let d = !1, f = !1;
  function p(k) {
    try {
      if (!k) return;
      if (typeof k.replaceChildren == "function") return k.replaceChildren();
      for (; k.firstChild; ) k.removeChild(k.firstChild);
    } catch {
      try {
        k && (k.innerHTML = "");
      } catch {
      }
    }
  }
  async function y(k, S) {
    let v, E, O;
    try {
      ({ data: v, pagePath: E, anchor: O } = await co(k, s));
    } catch (q) {
      const L = q && q.message ? String(q.message) : "", F = (!oe || typeof oe != "string" || !oe) && /no page data/i.test(L);
      try {
        if (F)
          try {
            _("[nimbi-cms] fetchPageData (expected missing)", q);
          } catch {
          }
        else
          try {
            Xn("[nimbi-cms] fetchPageData failed", q);
          } catch {
          }
      } catch {
      }
      try {
        !oe && n && p(n);
      } catch {
      }
      Di(t, a, q);
      return;
    }
    !O && S && (O = S);
    try {
      Or(null);
    } catch (q) {
      _("[nimbi-cms] scrollToAnchorOrTop failed", q);
    }
    try {
      p(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const { article: H, parsed: U, toc: P, topH1: K, h1Text: Z, slugKey: ie } = await Al(a, v, E, O, s);
    io(a, o, U, P, H, E, O, K, Z, ie, v);
    try {
      p(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    P && (n.appendChild(P), Tl(P));
    try {
      await h("transformHtml", { article: H, parsed: U, toc: P, pagePath: E, anchor: O, topH1: K, h1Text: Z, slugKey: ie, data: v });
    } catch (q) {
      _("[nimbi-cms] transformHtml hooks failed", q);
    }
    t.appendChild(H);
    try {
      El(H);
    } catch (q) {
      _("[nimbi-cms] executeEmbeddedScripts failed", q);
    }
    try {
      Nl(H, { t: a });
    } catch (q) {
      _("[nimbi-cms] attachImagePreview failed", q);
    }
    try {
      Hn(i, 100, !1), requestAnimationFrame(() => Hn(i, 100, !1)), setTimeout(() => Hn(i, 100, !1), 250);
    } catch (q) {
      _("[nimbi-cms] setEagerForAboveFoldImages failed", q);
    }
    Or(O), Rl(H, K, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await h("onPageLoad", { data: v, pagePath: E, anchor: O, article: H, toc: P, topH1: K, h1Text: Z, slugKey: ie, contentWrap: t, navWrap: n });
    } catch (q) {
      _("[nimbi-cms] onPageLoad hooks failed", q);
    }
    c = E;
  }
  async function g() {
    if (d) {
      f = !0;
      return;
    }
    d = !0;
    try {
      try {
        Xi("renderByQuery");
      } catch {
      }
      try {
        Qi("renderByQuery");
      } catch {
      }
      let k = it(location.href);
      if (k && k.type === "path" && k.page)
        try {
          let E = "?page=" + encodeURIComponent(k.page || "");
          k.params && (E += (E.includes("?") ? "&" : "?") + k.params), k.anchor && (E += "#" + encodeURIComponent(k.anchor));
          try {
            history.replaceState(history.state, "", E);
          } catch {
            try {
              history.replaceState({}, "", E);
            } catch {
            }
          }
          k = it(location.href);
        } catch {
        }
      const S = k && k.page ? k.page : l, v = k && k.anchor ? k.anchor : null;
      await y(S, v);
    } catch (k) {
      _("[nimbi-cms] renderByQuery failed", k);
      try {
        !oe && n && p(n);
      } catch {
      }
      Di(t, a, k);
    } finally {
      if (d = !1, f) {
        f = !1;
        try {
          await g();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", g);
  const m = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, b = () => {
    try {
      const k = i || document.querySelector(".nimbi-cms");
      if (!k) return;
      const S = {
        top: k.scrollTop || 0,
        left: k.scrollLeft || 0
      };
      sessionStorage.setItem(m(), JSON.stringify(S));
    } catch (k) {
      _("[nimbi-cms] save scroll position failed", k);
    }
  }, w = () => {
    try {
      const k = i || document.querySelector(".nimbi-cms");
      if (!k) return;
      const S = sessionStorage.getItem(m());
      if (!S) return;
      const v = JSON.parse(S);
      v && typeof v.top == "number" && k.scrollTo({ top: v.top, left: v.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (k) => {
    if (k.persisted)
      try {
        w(), Hn(i, 100, !1);
      } catch (S) {
        _("[nimbi-cms] bfcache restore failed", S);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      b();
    } catch (k) {
      _("[nimbi-cms] save scroll position failed", k);
    }
  }), { renderByQuery: g, siteNav: u, getCurrentPagePath: () => c };
}
function Bl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = it(window.location.href);
        a && a.params && (t = a.params.startsWith("?") ? a.params : "?" + a.params);
      } catch {
        t = "";
      }
    if (!t) return {};
    const n = new URLSearchParams(t.startsWith("?") ? t.slice(1) : t), i = {}, r = (a) => {
      if (a == null) return;
      const s = String(a).toLowerCase();
      if (s === "1" || s === "true" || s === "yes") return !0;
      if (s === "0" || s === "false" || s === "no") return !1;
    };
    if (n.has("contentPath") && (i.contentPath = n.get("contentPath")), n.has("searchIndex")) {
      const a = r(n.get("searchIndex"));
      typeof a == "boolean" && (i.searchIndex = a);
    }
    if (n.has("searchIndexMode")) {
      const a = n.get("searchIndexMode");
      (a === "eager" || a === "lazy") && (i.searchIndexMode = a);
    }
    if (n.has("defaultStyle")) {
      const a = n.get("defaultStyle");
      (a === "light" || a === "dark" || a === "system") && (i.defaultStyle = a);
    }
    if (n.has("bulmaCustomize") && (i.bulmaCustomize = n.get("bulmaCustomize")), n.has("lang") && (i.lang = n.get("lang")), n.has("l10nFile")) {
      const a = n.get("l10nFile");
      i.l10nFile = a === "null" ? null : a;
    }
    if (n.has("cacheTtlMinutes")) {
      const a = Number(n.get("cacheTtlMinutes"));
      Number.isFinite(a) && a >= 0 && (i.cacheTtlMinutes = a);
    }
    if (n.has("cacheMaxEntries")) {
      const a = Number(n.get("cacheMaxEntries"));
      Number.isInteger(a) && a >= 0 && (i.cacheMaxEntries = a);
    }
    if (n.has("homePage") && (i.homePage = n.get("homePage")), n.has("navigationPage") && (i.navigationPage = n.get("navigationPage")), n.has("notFoundPage")) {
      const a = n.get("notFoundPage");
      i.notFoundPage = a === "null" ? null : a;
    }
    if (n.has("availableLanguages") && (i.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("fetchConcurrency")) {
      const a = Number(n.get("fetchConcurrency"));
      Number.isInteger(a) && a >= 1 && (i.fetchConcurrency = a);
    }
    if (n.has("negativeFetchCacheTTL")) {
      const a = Number(n.get("negativeFetchCacheTTL"));
      Number.isFinite(a) && a >= 0 && (i.negativeFetchCacheTTL = a);
    }
    if (n.has("indexDepth")) {
      const a = Number(n.get("indexDepth"));
      Number.isInteger(a) && (a === 1 || a === 2 || a === 3) && (i.indexDepth = a);
    }
    if (n.has("noIndexing")) {
      const s = (n.get("noIndexing") || "").split(",").map((l) => l.trim()).filter(Boolean);
      s.length && (i.noIndexing = s);
    }
    return i;
  } catch {
    return {};
  }
}
function Ar(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function jl(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let Fn = "";
async function Yl(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = Bl();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        _("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
    else {
      try {
        _("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    if (Object.prototype.hasOwnProperty.call(n, "debugLevel"))
      _i(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const P = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(P) && _i(Math.max(0, Math.min(3, Math.floor(P))));
      } catch {
      }
  } catch {
  }
  try {
    Tt("[nimbi-cms] initCMS called", () => ({ options: n }));
  } catch {
  }
  t && typeof t.bulmaCustomize == "string" && t.bulmaCustomize.trim() && (n.bulmaCustomize = t.bulmaCustomize);
  let {
    el: i,
    contentPath: r = "/content",
    crawlMaxQueue: a = 1e3,
    searchIndex: s = !0,
    searchIndexMode: l = "eager",
    indexDepth: o = 1,
    noIndexing: h = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: u = "none",
    lang: d = void 0,
    l10nFile: f = null,
    cacheTtlMinutes: p = 5,
    cacheMaxEntries: y,
    markdownExtensions: g,
    availableLanguages: m,
    homePage: b = null,
    notFoundPage: w = null,
    navigationPage: k = "_navigation.md",
    exposeSitemap: S = !0
  } = n;
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: E = !1 } = n, O = (P) => {
    try {
      const K = document.querySelector(i);
      if (K && K instanceof Element)
        try {
          const Z = document.createElement("div");
          Z.style.padding = "1rem";
          try {
            Z.style.fontFamily = "system-ui, sans-serif";
          } catch {
          }
          Z.style.color = "#b00", Z.style.background = "#fee", Z.style.border = "1px solid #b00";
          const ie = document.createElement("strong");
          ie.textContent = "NimbiCMS failed to initialize:", Z.appendChild(ie);
          try {
            Z.appendChild(document.createElement("br"));
          } catch {
          }
          const q = document.createElement("pre");
          try {
            q.style.whiteSpace = "pre-wrap";
          } catch {
          }
          q.textContent = String(P), Z.appendChild(q);
          try {
            if (typeof K.replaceChildren == "function") K.replaceChildren(Z);
            else {
              for (; K.firstChild; ) K.removeChild(K.firstChild);
              K.appendChild(Z);
            }
          } catch {
            try {
              K.innerHTML = '<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">' + String(P) + "</pre></div>";
            } catch {
            }
          }
        } catch {
        }
    } catch {
    }
  };
  if (n.contentPath != null && !jl(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (b != null && !Ar(b))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (w != null && !Ar(w))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !Ar(k))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let H = i;
  if (typeof i == "string") {
    if (H = document.querySelector(i), !H) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof s != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (l != null && l !== "eager" && l !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (o != null && o !== 1 && o !== 2 && o !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (c !== "light" && c !== "dark" && c !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (u != null && typeof u != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (p != null && (typeof p != "number" || !Number.isFinite(p) || p < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (y != null && (typeof y != "number" || !Number.isInteger(y) || y < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (g != null && (!Array.isArray(g) || g.some((P) => !P || typeof P != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (m != null && (!Array.isArray(m) || m.some((P) => typeof P != "string" || !P.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (h != null && (!Array.isArray(h) || h.some((P) => typeof P != "string" || !P.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (E != null && typeof E != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (n.fetchConcurrency != null && (typeof n.fetchConcurrency != "number" || !Number.isInteger(n.fetchConcurrency) || n.fetchConcurrency < 1))
    throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');
  if (n.negativeFetchCacheTTL != null && (typeof n.negativeFetchCacheTTL != "number" || !Number.isFinite(n.negativeFetchCacheTTL) || n.negativeFetchCacheTTL < 0))
    throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const U = !!s;
  try {
    Promise.resolve().then(() => at).then((P) => {
      try {
        P && typeof P.setSkipRootReadme == "function" && P.setSkipRootReadme(!!E);
      } catch (K) {
        _("[nimbi-cms] setSkipRootReadme failed", K);
      }
    }).catch((P) => {
    });
  } catch (P) {
    _("[nimbi-cms] setSkipRootReadme dynamic import failed", P);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && no(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(P) {
        try {
          const K = { type: "error", message: P && P.message ? String(P.message) : "", filename: P && P.filename ? String(P.filename) : "", lineno: P && P.lineno ? P.lineno : null, colno: P && P.colno ? P.colno : null, stack: P && P.error && P.error.stack ? P.error.stack : null, time: Date.now() };
          try {
            _("[nimbi-cms] runtime error", K.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(K);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(P) {
        try {
          const K = { type: "unhandledrejection", reason: P && P.reason ? String(P.reason) : "", time: Date.now() };
          try {
            _("[nimbi-cms] unhandledrejection", K.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(K);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const P = it(typeof window < "u" ? window.location.href : ""), K = P && P.page ? P.page : b || void 0;
      try {
        K && ro(K, Fn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        H.classList.add("nimbi-mount");
      } catch (A) {
        _("[nimbi-cms] mount element setup failed", A);
      }
      const P = document.createElement("section");
      P.className = "section";
      const K = document.createElement("div");
      K.className = "container nimbi-cms";
      const Z = document.createElement("div");
      Z.className = "columns";
      const ie = document.createElement("div");
      ie.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", ie.setAttribute("role", "navigation");
      try {
        const A = typeof un == "function" ? un("navigation") : null;
        A && ie.setAttribute("aria-label", A);
      } catch (A) {
        _("[nimbi-cms] set nav aria-label failed", A);
      }
      Z.appendChild(ie);
      const q = document.createElement("main");
      q.className = "column nimbi-content", q.setAttribute("role", "main"), Z.appendChild(q), K.appendChild(Z), P.appendChild(K);
      const L = ie, F = q;
      H.appendChild(P);
      let D = null;
      try {
        D = H.querySelector(".nimbi-overlay"), D || (D = document.createElement("div"), D.className = "nimbi-overlay", H.appendChild(D));
      } catch (A) {
        D = null, _("[nimbi-cms] mount overlay setup failed", A);
      }
      const le = location.pathname || "/";
      let te;
      if (le.endsWith("/"))
        te = le;
      else {
        const A = le.substring(le.lastIndexOf("/") + 1);
        A && !A.includes(".") ? te = le + "/" : te = le.substring(0, le.lastIndexOf("/") + 1);
      }
      try {
        Fn = document.title || "";
      } catch (A) {
        Fn = "", _("[nimbi-cms] read initial document title failed", A);
      }
      let ce = r;
      const _e = Object.prototype.hasOwnProperty.call(n, "contentPath"), ve = typeof location < "u" && location.origin ? location.origin : "http://localhost", He = new URL(te, ve).toString();
      (ce === "." || ce === "./") && (ce = "");
      try {
        ce = String(ce || "").replace(/\\/g, "/");
      } catch {
        ce = String(ce || "");
      }
      ce.startsWith("/") && (ce = ce.replace(/^\/+/, "")), ce && !ce.endsWith("/") && (ce = ce + "/");
      try {
        if (ce && te && te !== "/") {
          const A = te.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          A && ce.startsWith(A) && (ce = ce.slice(A.length));
        }
      } catch {
      }
      try {
        if (ce)
          var xe = new URL(ce, He.endsWith("/") ? He : He + "/").toString();
        else
          var xe = He;
      } catch {
        try {
          if (ce) var xe = new URL("/" + ce, ve).toString();
          else var xe = new URL(te, ve).toString();
        } catch {
          var xe = ve;
        }
      }
      if (f && await ta(f, te), m && Array.isArray(m) && ia(m), d && na(d), typeof p == "number" && p >= 0 && typeof Ti == "function" && Ti(p * 60 * 1e3), typeof y == "number" && y >= 0 && typeof Li == "function" && Li(y), g && Array.isArray(g) && g.length)
        try {
          g.forEach((A) => {
            typeof A == "object" && Oa && typeof Ir == "function" && Ir(A);
          });
        } catch (A) {
          _("[nimbi-cms] applying markdownExtensions failed", A);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => at).then(({ setDefaultCrawlMaxQueue: A }) => {
          try {
            A(a);
          } catch (C) {
            _("[nimbi-cms] setDefaultCrawlMaxQueue failed", C);
          }
        }), typeof n.fetchConcurrency == "number" && Promise.resolve().then(() => at).then(({ setFetchConcurrency: A }) => {
          try {
            A(n.fetchConcurrency);
          } catch (C) {
            _("[nimbi-cms] setFetchConcurrency failed", C);
          }
        }).catch(() => {
        }), typeof n.negativeFetchCacheTTL == "number" && Promise.resolve().then(() => at).then(({ setFetchNegativeCacheTTL: A }) => {
          try {
            A(n.negativeFetchCacheTTL);
          } catch (C) {
            _("[nimbi-cms] setFetchNegativeCacheTTL failed", C);
          }
        }).catch(() => {
        });
      } catch (A) {
        _("[nimbi-cms] setDefaultCrawlMaxQueue import failed", A);
      }
      try {
        try {
          const A = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (A && typeof A == "object")
            try {
              const C = await Promise.resolve().then(() => at);
              if (C && typeof C._setAllMd == "function") {
                C._setAllMd(A);
                try {
                  Tt("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(A).length }));
                } catch {
                }
              }
            } catch (C) {
              _("[nimbi-cms] applying content manifest failed", C);
            }
          try {
            Zr(xe);
          } catch (C) {
            _("[nimbi-cms] setContentBase failed", C);
          }
          try {
            try {
              const C = await Promise.resolve().then(() => at);
              try {
                Tt("[nimbi-cms diagnostic] after setContentBase", () => ({
                  manifestKeys: A && typeof A == "object" ? Object.keys(A).length : 0,
                  slugToMdSize: C && C.slugToMd && typeof C.slugToMd.size == "number" ? C.slugToMd.size : void 0,
                  allMarkdownPathsLength: C && Array.isArray(C.allMarkdownPaths) ? C.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: C && C.allMarkdownPathsSet && typeof C.allMarkdownPathsSet.size == "number" ? C.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: C && Array.isArray(C.searchIndex) ? C.searchIndex.length : void 0
                }));
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (A) {
        _("[nimbi-cms] setContentBase failed", A);
      }
      try {
        oa(w);
      } catch (A) {
        _("[nimbi-cms] setNotFoundPage failed", A);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => xn).then((A) => {
          try {
            A && typeof A.attachSitemapDownloadUI == "function" && A.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let De = null, T = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k)
          try {
            const R = [], $ = [];
            try {
              k && $.push(String(k));
            } catch {
            }
            try {
              const z = String(k || "").replace(/^_/, "");
              z && z !== String(k) && $.push(z);
            } catch {
            }
            try {
              $.push("navigation.md");
            } catch {
            }
            try {
              $.push("assets/navigation.md");
            } catch {
            }
            const Q = [];
            for (const z of $)
              try {
                if (!z) continue;
                const j = String(z);
                Q.includes(j) || Q.push(j);
              } catch {
              }
            for (const z of Q) {
              R.push(z);
              try {
                if (T = await Te(z, xe, { force: !0 }), T && T.raw) {
                  try {
                    k = z;
                  } catch {
                  }
                  try {
                    _("[nimbi-cms] fetched navigation candidate", z, "contentBase=", xe);
                  } catch {
                  }
                  De = await Ln(T.raw || "");
                  try {
                    const j = qe();
                    if (j && De && De.html) {
                      const B = j.parseFromString(De.html, "text/html").querySelector("a");
                      if (B)
                        try {
                          const Y = B.getAttribute("href") || "", G = it(Y);
                          try {
                            _("[nimbi-cms] parsed nav first-link href", Y, "->", G);
                          } catch {
                          }
                          if (G && G.page && (G.type === "path" || G.type === "canonical" && (G.page.includes(".") || G.page.includes("/")))) {
                            b = G.page;
                            try {
                              _("[nimbi-cms] derived homePage from navigation", b);
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
          _("[nimbi-cms] final homePage before slugManager setHomePage", b);
        } catch {
        }
        try {
          la(b);
        } catch (R) {
          _("[nimbi-cms] setHomePage failed", R);
        }
        let C = !0;
        try {
          const R = it(typeof location < "u" ? location.href : "");
          R && R.type === "cosmetic" && (typeof w > "u" || w == null) && (C = !1);
        } catch {
        }
        if (C && b)
          try {
            await Te(b, xe, { force: !0 });
          } catch (R) {
            throw new Error(`Required ${b} not found at ${xe}${b}: ${R && R.message ? R.message : String(R)}`);
          }
      } catch (A) {
        throw A;
      }
      Ss(c), await xs(u, te);
      const N = Ol({ contentWrap: F, navWrap: L, container: K, mountOverlay: D, t: un, contentBase: xe, homePage: b, initialDocumentTitle: Fn, runHooks: ki });
      try {
        const A = document.createElement("header");
        A.className = "nimbi-site-navbar", H.insertBefore(A, P);
        let C = T, R = De;
        R || (C = await Te(k, xe, { force: !0 }), R = await Ln(C.raw || ""));
        const { navbar: $, linkEls: Q } = await Pl(A, K, R.html || "", xe, b, un, N.renderByQuery, U, l, o, h, v);
        try {
          await ki("onNavBuild", { navWrap: L, navbar: $, linkEls: Q, contentBase: xe });
        } catch (z) {
          _("[nimbi-cms] onNavBuild hooks failed", z);
        }
        try {
          try {
            if (Q && Q.length) {
              const z = await Promise.resolve().then(() => at);
              for (const j of Array.from(Q || []))
                try {
                  const M = j && j.getAttribute && j.getAttribute("href") || "";
                  if (!M) continue;
                  let B = String(M || "").split(/::|#/, 1)[0];
                  if (B = String(B || "").split("?")[0], !B) continue;
                  /\.(?:md|html?)$/.test(B) || (B = B + ".html");
                  let Y = null;
                  try {
                    Y = J(String(B || ""));
                  } catch {
                    Y = String(B || "");
                  }
                  const G = String(Y || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!G) continue;
                  try {
                    let me = null;
                    try {
                      z && typeof z.slugify == "function" && (me = z.slugify(G.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      me = String(G || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!me) continue;
                    let Ce = me;
                    try {
                      if (z && z.slugToMd && typeof z.slugToMd.has == "function" && z.slugToMd.has(me)) {
                        const ye = z.slugToMd.get(me);
                        let ge = !1;
                        try {
                          if (typeof ye == "string")
                            ye === B && (ge = !0);
                          else if (ye && typeof ye == "object") {
                            ye.default === B && (ge = !0);
                            for (const Me of Object.keys(ye.langs || {}))
                              if (ye.langs[Me] === B) {
                                ge = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!ge && typeof z.uniqueSlug == "function")
                          try {
                            Ce = z.uniqueSlug(me, new Set(z.slugToMd.keys()));
                          } catch {
                            Ce = me;
                          }
                      }
                    } catch {
                    }
                    try {
                      if (z && typeof z._storeSlugMapping == "function")
                        try {
                          z._storeSlugMapping(Ce, Y);
                        } catch {
                        }
                      else if (z && z.slugToMd && typeof z.slugToMd.set == "function")
                        try {
                          z.slugToMd.set(Ce, Y);
                        } catch {
                        }
                      try {
                        z && z.mdToSlug && typeof z.mdToSlug.set == "function" && z.mdToSlug.set(Y, Ce);
                      } catch {
                      }
                      try {
                        z && Array.isArray(z.allMarkdownPaths) && !z.allMarkdownPaths.includes(Y) && z.allMarkdownPaths.push(Y);
                      } catch {
                      }
                      try {
                        z && z.allMarkdownPathsSet && typeof z.allMarkdownPathsSet.add == "function" && z.allMarkdownPathsSet.add(Y);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const j = await Promise.resolve().then(() => wr);
                j && typeof j.refreshIndexPaths == "function" && j.refreshIndexPaths(xe);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let z = !1;
          try {
            const j = new URLSearchParams(location.search || "");
            (j.has("sitemap") || j.has("rss") || j.has("atom")) && (z = !0);
          } catch {
          }
          try {
            const M = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            M && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(M) && (z = !0);
          } catch {
          }
          if (z || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const M = await Promise.resolve().then(() => at);
                if (M && typeof M.awaitSearchIndex == "function") {
                  const B = [];
                  b && B.push(b), k && B.push(k);
                  try {
                    await M.awaitSearchIndex({ contentBase: xe, indexDepth: Math.max(o || 1, 3), noIndexing: h, seedPaths: B.length ? B : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const j = await Promise.resolve().then(() => xn);
              try {
                if (j && typeof j.handleSitemapRequest == "function" && await j.handleSitemapRequest({ includeAllMarkdown: !0, homePage: b, navigationPage: k, notFoundPage: w, contentBase: xe, indexDepth: o, noIndexing: h }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => xn).then((j) => {
              try {
                if (j && typeof j.exposeSitemapGlobals == "function")
                  try {
                    j.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: b, navigationPage: k, notFoundPage: w, contentBase: xe, indexDepth: o, noIndexing: h, waitForIndexMs: 1 / 0 }).catch(() => {
                    });
                  } catch {
                  }
              } catch {
              }
            }).catch(() => {
            });
          } catch {
          }
        } catch {
        }
        try {
          try {
            const j = await Promise.resolve().then(() => wr);
            if (j && typeof j.refreshIndexPaths == "function")
              try {
                j.refreshIndexPaths(xe);
                try {
                  try {
                    const M = await Promise.resolve().then(() => at);
                    try {
                      Tt("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({ slugToMdSize: M && M.slugToMd && typeof M.slugToMd.size == "number" ? M.slugToMd.size : void 0, allMarkdownPathsLength: M && Array.isArray(M.allMarkdownPaths) ? M.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: M && M.allMarkdownPathsSet && typeof M.allMarkdownPathsSet.size == "number" ? M.allMarkdownPathsSet.size : void 0 }));
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const M = await Promise.resolve().then(() => at), B = M && M.slugToMd && typeof M.slugToMd.size == "number" ? M.slugToMd.size : 0;
                  let Y = !1;
                  try {
                    if (!manifest) {
                      B < 30 && (Y = !0);
                      try {
                        const G = it(typeof location < "u" ? location.href : "");
                        if (G) {
                          if (G.type === "cosmetic" && G.page)
                            try {
                              M.slugToMd.has(G.page) || (Y = !0);
                            } catch {
                            }
                          else if ((G.type === "path" || G.type === "canonical") && G.page)
                            try {
                              const me = J(G.page);
                              !(M.mdToSlug && M.mdToSlug.has(me)) && !(M.allMarkdownPathsSet && M.allMarkdownPathsSet.has(me)) && (Y = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Y) {
                    let G = null;
                    try {
                      G = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      G = null;
                    }
                    if (Array.isArray(G) && G.length) {
                      let me = 0;
                      for (const Ce of G)
                        try {
                          if (!Ce || !Ce.slug) continue;
                          const ye = String(Ce.slug).split("::")[0];
                          if (M.slugToMd.has(ye)) continue;
                          let ge = Ce.sourcePath || Ce.path || null;
                          if (!ge && Array.isArray(G)) {
                            const Qe = (G || []).find((je) => je && je.slug === Ce.slug);
                            Qe && Qe.path && (ge = Qe.path);
                          }
                          if (!ge) continue;
                          try {
                            ge = String(ge);
                          } catch {
                            continue;
                          }
                          let Me = null;
                          try {
                            const Qe = xe && typeof xe == "string" ? xe : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const je = new URL(ge, Qe), yt = new URL(Qe);
                              if (je.origin === yt.origin) {
                                const rn = yt.pathname || "/";
                                let vt = je.pathname || "";
                                vt.startsWith(rn) && (vt = vt.slice(rn.length)), vt.startsWith("/") && (vt = vt.slice(1)), Me = J(vt);
                              } else
                                Me = J(je.pathname || "");
                            } catch {
                              Me = J(ge);
                            }
                          } catch {
                            Me = J(ge);
                          }
                          if (!Me) continue;
                          Me = String(Me).split(/[?#]/)[0], Me = J(Me);
                          try {
                            M._storeSlugMapping(ye, Me);
                          } catch {
                          }
                          me++;
                        } catch {
                        }
                      if (me) {
                        try {
                          Tt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({ added: me, total: M && M.slugToMd && typeof M.slugToMd.size == "number" ? M.slugToMd.size : void 0 }));
                        } catch {
                        }
                        try {
                          const Ce = await Promise.resolve().then(() => wr);
                          Ce && typeof Ce.refreshIndexPaths == "function" && Ce.refreshIndexPaths(xe);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (M) {
                _("[nimbi-cms] refreshIndexPaths after nav build failed", M);
              }
          } catch {
          }
          const z = () => {
            const j = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.offsetHeight || 0;
            if (j > 0) {
              try {
                H.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (M) {
                _("[nimbi-cms] set CSS var failed", M);
              }
              try {
                K.style.paddingTop = "";
              } catch (M) {
                _("[nimbi-cms] set container paddingTop failed", M);
              }
              try {
                const M = H && H.getBoundingClientRect && Math.round(H.getBoundingClientRect().height) || H && H.clientHeight || 0;
                if (M > 0) {
                  const B = Math.max(0, M - j);
                  try {
                    K.style.setProperty("--nimbi-cms-height", `${B}px`);
                  } catch (Y) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", Y);
                  }
                } else
                  try {
                    K.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (B) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", B);
                  }
              } catch (M) {
                _("[nimbi-cms] compute container height failed", M);
              }
              try {
                A.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (M) {
                _("[nimbi-cms] set navbar CSS var failed", M);
              }
            }
          };
          z();
          try {
            if (typeof ResizeObserver < "u") {
              const j = new ResizeObserver(() => z());
              try {
                j.observe(A);
              } catch (M) {
                _("[nimbi-cms] ResizeObserver.observe failed", M);
              }
            }
          } catch (j) {
            _("[nimbi-cms] ResizeObserver setup failed", j);
          }
        } catch (z) {
          _("[nimbi-cms] compute navbar height failed", z);
        }
      } catch (A) {
        _("[nimbi-cms] build navigation failed", A);
      }
      await N.renderByQuery();
      try {
        Promise.resolve().then(() => ql).then(({ getVersion: A }) => {
          typeof A == "function" && A().then((C) => {
            try {
              const R = C || "0.0.0";
              try {
                const $ = (j) => {
                  const M = document.createElement("a");
                  M.className = "nimbi-version-label tag is-small", M.textContent = `nimbiCMS v. ${R}`, M.href = j || "#", M.target = "_blank", M.rel = "noopener noreferrer nofollow", M.setAttribute("aria-label", `nimbiCMS version ${R}`);
                  try {
                    Ji(M);
                  } catch {
                  }
                  try {
                    H.appendChild(M);
                  } catch (B) {
                    _("[nimbi-cms] append version label failed", B);
                  }
                }, Q = "https://abelvm.github.io/nimbiCMS/", z = (() => {
                  try {
                    if (Q && typeof Q == "string")
                      return new URL(Q).toString();
                  } catch {
                  }
                  return "#";
                })();
                $(z);
              } catch ($) {
                _("[nimbi-cms] building version label failed", $);
              }
            } catch (R) {
              _("[nimbi-cms] building version label failed", R);
            }
          }).catch((C) => {
            _("[nimbi-cms] getVersion() failed", C);
          });
        }).catch((A) => {
          _("[nimbi-cms] import version module failed", A);
        });
      } catch (A) {
        _("[nimbi-cms] version label setup failed", A);
      }
    })();
  } catch (P) {
    throw O(P), P;
  }
}
async function Hl() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Hl
}, Symbol.toStringTag, { value: "Module" })), et = It, cn = _;
function ai() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function Fe(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Wi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function Fl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = J(String(t.path))), r;
  } catch {
    return null;
  }
}
async function si(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = ai().split("?")[0];
  let o = Array.isArray(re) && re.length ? re : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(re) && re.length) {
    const m = /* @__PURE__ */ new Map();
    try {
      for (const b of n)
        try {
          b && b.slug && m.set(String(b.slug), b);
        } catch {
        }
      for (const b of re)
        try {
          b && b.slug && m.set(String(b.slug), b);
        } catch {
        }
    } catch {
    }
    o = Array.from(m.values());
  }
  const h = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && h.add(J(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && h.add(J(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const m = J(String(a));
      try {
        if (W && typeof W.has == "function" && W.has(m))
          try {
            c.add(W.get(m));
          } catch {
          }
        else
          try {
            const b = await Te(m, e && e.contentBase ? e.contentBase : void 0);
            if (b && b.raw)
              try {
                let w = null;
                if (b.isHtml)
                  try {
                    const k = qe();
                    if (k) {
                      const S = k.parseFromString(b.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                      v && v.textContent && (w = v.textContent.trim());
                    } else {
                      const S = (b.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                      S && (w = (S[1] || S[2] || "").trim());
                    }
                  } catch {
                  }
                else {
                  const k = (b.raw || "").match(/^#\s+(.+)$/m);
                  k && k[1] && (w = k[1].trim());
                }
                w && c.add(de(w));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), d = [], f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), y = (m) => {
    try {
      if (!m || typeof m != "string") return !1;
      const b = J(String(m));
      try {
        if (Pe && typeof Pe.has == "function" && Pe.has(b)) return !0;
      } catch {
      }
      try {
        if (W && typeof W.has == "function" && W.has(b)) return !0;
      } catch {
      }
      try {
        if (p && p.has(b)) return !0;
      } catch {
      }
      try {
        if (W && typeof W.keys == "function" && W.size)
          for (const w of W.keys())
            try {
              if (J(String(w)) === b) return !0;
            } catch {
            }
        else
          for (const w of ee.values())
            try {
              if (!w) continue;
              if (typeof w == "string") {
                if (J(String(w)) === b) return !0;
              } else if (w && typeof w == "object") {
                if (w.default && J(String(w.default)) === b) return !0;
                const k = w.langs || {};
                for (const S of Object.keys(k || {}))
                  try {
                    if (k[S] && J(String(k[S])) === b) return !0;
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
  if (Array.isArray(o) && o.length) {
    let m = 0;
    for (const b of o) {
      try {
        m++, await Rt(m, 64);
      } catch {
      }
      try {
        if (!b || !b.slug) continue;
        const w = String(b.slug), k = String(w).split("::")[0];
        if (c.has(k)) continue;
        const S = b.path ? J(String(b.path)) : null;
        if (S && h.has(S)) continue;
        const v = b.title ? String(b.title) : b.parentTitle ? String(b.parentTitle) : void 0;
        f.set(w, { title: v || void 0, excerpt: b.excerpt ? String(b.excerpt) : void 0, path: S, source: "index" }), S && p.set(S, { title: v || void 0, excerpt: b.excerpt ? String(b.excerpt) : void 0, slug: w });
        const E = Fl(l, b);
        if (!E || !E.slug || u.has(E.slug)) continue;
        if (u.add(E.slug), f.has(E.slug)) {
          const O = f.get(E.slug);
          O && O.title && (E.title = O.title, E._titleSource = "index"), O && O.excerpt && (E.excerpt = O.excerpt);
        }
        d.push(E);
      } catch {
        continue;
      }
    }
  }
  if (t)
    try {
      let m = 0;
      for (const [b, w] of ee.entries()) {
        try {
          m++, await Rt(m, 128);
        } catch {
        }
        try {
          if (!b) continue;
          const k = String(b).split("::")[0];
          if (u.has(b) || c.has(k)) continue;
          let S = null;
          if (typeof w == "string" ? S = J(String(w)) : w && typeof w == "object" && (S = J(String(w.default || ""))), S && h.has(S)) continue;
          const E = { loc: l + "?page=" + encodeURIComponent(b), slug: b };
          if (f.has(b)) {
            const O = f.get(b);
            O && O.title && (E.title = O.title, E._titleSource = "index"), O && O.excerpt && (E.excerpt = O.excerpt);
          } else if (S) {
            const O = p.get(S);
            O && O.title && (E.title = O.title, E._titleSource = "path", !E.excerpt && O.excerpt && (E.excerpt = O.excerpt));
          }
          if (u.add(b), typeof b == "string") {
            const O = b.indexOf("/") !== -1 || /\.(md|html?)$/i.test(b), H = E.title && typeof E.title == "string" && (E.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(E.title));
            (!E.title || H || O) && (E.title = Wi(b), E._titleSource = "humanize");
          }
          d.push(E);
        } catch {
        }
      }
      try {
        if (i && typeof i == "string") {
          const b = J(String(i));
          let w = null;
          try {
            W && W.has(b) && (w = W.get(b));
          } catch {
          }
          w || (w = b);
          const k = String(w).split("::")[0];
          if (!u.has(w) && !h.has(b) && !c.has(k)) {
            const S = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (f.has(w)) {
              const v = f.get(w);
              v && v.title && (S.title = v.title, S._titleSource = "index"), v && v.excerpt && (S.excerpt = v.excerpt);
            }
            u.add(w), d.push(S);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const m = /* @__PURE__ */ new Set(), b = new Set(d.map((E) => String(E && E.slug ? E.slug : ""))), w = /* @__PURE__ */ new Set();
    for (const E of d)
      try {
        E && E.sourcePath && w.add(String(E.sourcePath));
      } catch {
      }
    const k = 30;
    let S = 0, v = 0;
    for (const E of w) {
      try {
        v++, await Rt(v, 8);
      } catch {
      }
      if (S >= k) break;
      try {
        if (!E || typeof E != "string" || !y(E)) continue;
        S += 1;
        const O = await Te(E, e && e.contentBase ? e.contentBase : void 0);
        if (!O || !O.raw || O && typeof O.status == "number" && O.status === 404) continue;
        const H = O.raw, U = (function(q) {
          try {
            return String(q || "");
          } catch {
            return "";
          }
        })(H), P = [], K = /\[[^\]]+\]\(([^)]+)\)/g;
        let Z;
        for (; Z = K.exec(U); )
          try {
            Z && Z[1] && P.push(Z[1]);
          } catch {
          }
        const ie = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; Z = ie.exec(U); )
          try {
            Z && Z[1] && P.push(Z[1]);
          } catch {
          }
        for (const q of P)
          try {
            if (!q) continue;
            if (q.indexOf("?") !== -1 || q.indexOf("=") !== -1)
              try {
                const D = new URL(q, l).searchParams.get("page");
                if (D) {
                  const le = String(D);
                  !b.has(le) && !m.has(le) && (m.add(le), d.push({ loc: l + "?page=" + encodeURIComponent(le), slug: le }));
                  continue;
                }
              } catch {
              }
            let L = String(q).split(/[?#]/)[0];
            if (L = L.replace(/^\.\//, "").replace(/^\//, ""), !L || !/\.(md|html?)$/i.test(L)) continue;
            try {
              const F = J(L);
              if (W && W.has(F)) {
                const D = W.get(F), le = String(D).split("::")[0];
                D && !b.has(D) && !m.has(D) && !c.has(le) && !h.has(F) && (m.add(D), d.push({ loc: l + "?page=" + encodeURIComponent(D), slug: D, sourcePath: F }));
                continue;
              }
              try {
                if (!y(F)) continue;
                const D = await Te(F, e && e.contentBase ? e.contentBase : void 0);
                if (D && typeof D.status == "number" && D.status === 404) continue;
                if (D && D.raw) {
                  const le = (D.raw || "").match(/^#\s+(.+)$/m), te = le && le[1] ? le[1].trim() : "", ce = de(te || F), _e = String(ce).split("::")[0];
                  ce && !b.has(ce) && !m.has(ce) && !c.has(_e) && (m.add(ce), d.push({ loc: l + "?page=" + encodeURIComponent(ce), slug: ce, sourcePath: F, title: te || void 0 }));
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
    const m = /* @__PURE__ */ new Map();
    let b = 0;
    for (const k of d) {
      try {
        b++, await Rt(b, 128);
      } catch {
      }
      try {
        if (!k || !k.slug) continue;
        m.set(String(k.slug), k);
      } catch {
      }
    }
    const w = /* @__PURE__ */ new Set();
    for (const k of d)
      try {
        if (!k || !k.slug) continue;
        const S = String(k.slug), v = S.split("::")[0];
        if (!v) continue;
        S !== v && !m.has(v) && w.add(v);
      } catch {
      }
    for (const k of w)
      try {
        let S = null;
        if (f.has(k)) {
          const v = f.get(k);
          S = { loc: l + "?page=" + encodeURIComponent(k), slug: k }, v && v.title && (S.title = v.title, S._titleSource = "index"), v && v.excerpt && (S.excerpt = v.excerpt), v && v.path && (S.sourcePath = v.path);
        } else if (p && ee && ee.has(k)) {
          const v = ee.get(k);
          let E = null;
          if (typeof v == "string" ? E = J(String(v)) : v && typeof v == "object" && (E = J(String(v.default || ""))), S = { loc: l + "?page=" + encodeURIComponent(k), slug: k }, E && p.has(E)) {
            const O = p.get(E);
            O && O.title && (S.title = O.title, S._titleSource = "path"), O && O.excerpt && (S.excerpt = O.excerpt), S.sourcePath = E;
          }
        }
        S || (S = { loc: l + "?page=" + encodeURIComponent(k), slug: k, title: Wi(k) }, S._titleSource = "humanize"), m.has(k) || (d.push(S), m.set(k, S));
      } catch {
      }
  } catch {
  }
  const g = [];
  try {
    const m = /* @__PURE__ */ new Set();
    let b = 0;
    for (const w of d) {
      try {
        b++, await Rt(b, 128);
      } catch {
      }
      try {
        if (!w || !w.slug) continue;
        const k = String(w.slug), S = String(k).split("::")[0];
        if (c.has(S) || k.indexOf("::") !== -1 || m.has(k)) continue;
        m.add(k), g.push(w);
      } catch {
      }
    }
  } catch {
  }
  try {
    try {
      et(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(g.map((m) => ({ slug: m.slug, title: m.title, titleSource: m._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let b = 0;
    const w = g.length, k = Array.from({ length: Math.min(4, w) }).map(async () => {
      for (; ; ) {
        const S = b++;
        if (S >= w) break;
        const v = g[S];
        try {
          if (!v || !v.slug) continue;
          const E = String(v.slug).split("::")[0];
          if (c.has(E) || v._titleSource === "index") continue;
          let O = null;
          try {
            if (ee && ee.has(v.slug)) {
              const H = ee.get(v.slug);
              typeof H == "string" ? O = J(String(H)) : H && typeof H == "object" && (O = J(String(H.default || "")));
            }
            !O && v.sourcePath && (O = v.sourcePath);
          } catch {
            continue;
          }
          if (!O || h.has(O) || !y(O)) continue;
          try {
            const H = await Te(O, e && e.contentBase ? e.contentBase : void 0);
            if (!H || !H.raw || H && typeof H.status == "number" && H.status === 404) continue;
            if (H && H.raw) {
              const U = (H.raw || "").match(/^#\s+(.+)$/m), P = U && U[1] ? U[1].trim() : "";
              P && (v.title = P, v._titleSource = "fetched");
            }
          } catch (H) {
            et("[runtimeSitemap] fetch title failed for", O, H);
          }
        } catch (E) {
          et("[runtimeSitemap] worker loop failure", E);
        }
      }
    });
    await Promise.all(k);
  } catch (m) {
    et("[runtimeSitemap] title enrichment failed", m);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: g };
}
function Br(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${Fe(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function jr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = ai().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${Fe("Sitemap RSS")}</title>
`, i += `<link>${Fe(n)}</link>
`, i += `<description>${Fe("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${Fe(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${Fe(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${Fe(String(r.excerpt))}</description>
`), i += `<link>${Fe(a)}</link>
`, i += `<guid>${Fe(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function Hr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = ai().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${Fe("Sitemap Atom")}</title>
`, r += `<link href="${Fe(n)}" />
`, r += `<updated>${Fe(i)}</updated>
`, r += `<id>${Fe(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${Fe(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${Fe(String(a.excerpt))}</summary>
`), r += `<link href="${Fe(s)}" />
`, r += `<id>${Fe(s)}</id>
`, r += `<updated>${Fe(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Zi(e, t = "application/xml") {
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
        const n = new Blob([e], { type: t }), i = URL.createObjectURL(n);
        try {
          location.href = i;
        } catch {
          try {
            window.open(i, "_self");
          } catch {
          }
        }
        setTimeout(() => {
          try {
            URL.revokeObjectURL(i);
          } catch {
          }
        }, 5e3);
      }
    } catch {
    }
  } catch {
    try {
      try {
        const i = document.createElement("pre");
        try {
          i.textContent = Fe(e);
        } catch {
          try {
            i.textContent = String(e);
          } catch {
          }
        }
        if (document && document.body)
          try {
            if (typeof document.body.replaceChildren == "function") document.body.replaceChildren(i);
            else {
              for (; document.body.firstChild; ) document.body.removeChild(document.body.firstChild);
              document.body.appendChild(i);
            }
          } catch {
            try {
              document.body.innerHTML = "<pre>" + Fe(e) + "</pre>";
            } catch {
            }
          }
      } catch {
      }
    } catch {
    }
  }
}
function Gi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${Fe(String(i && i.loc ? i.loc : ""))}">${Fe(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Dn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = jr(e) : t === "application/atom+xml" ? i = Hr(e) : t === "text/html" ? i = Gi(e) : i = Br(e), Zi(i, t);
        try {
          typeof window < "u" && (window.__nimbiSitemapRenderedAt = Date.now(), window.__nimbiSitemapJson = e, window.__nimbiSitemapFinal = e.entries || []);
        } catch {
        }
      } catch {
      }
      return;
    }
    const n = Array.isArray(e && e.entries) ? e.entries.length : 0;
    try {
      const i = window.__nimbiSitemapPendingWrite || null;
      if ((!i || typeof i.len == "number" && i.len < n) && (window.__nimbiSitemapPendingWrite = { finalJson: e, mimeType: t, len: n }), window.__nimbiSitemapWriteTimer) return;
      window.__nimbiSitemapWriteTimer = setTimeout(() => {
        try {
          const r = window.__nimbiSitemapPendingWrite;
          if (!r) return;
          let a = null;
          r.mimeType === "application/rss+xml" ? a = jr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = Hr(r.finalJson) : r.mimeType === "text/html" ? a = Gi(r.finalJson) : a = Br(r.finalJson);
          try {
            Zi(a, r.mimeType);
          } catch {
          }
          try {
            window.__nimbiSitemapRenderedAt = Date.now(), window.__nimbiSitemapJson = r.finalJson, window.__nimbiSitemapFinal = r.finalJson.entries || [];
          } catch {
          }
        } catch {
        }
        try {
          clearTimeout(window.__nimbiSitemapWriteTimer);
        } catch {
        }
        window.__nimbiSitemapWriteTimer = null, window.__nimbiSitemapPendingWrite = null;
      }, 40);
    } catch {
    }
  } catch {
  }
}
async function Dl(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let u = !0;
        for (const d of c.keys()) d !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (c.has("rss")) {
        let u = !0;
        for (const d of c.keys()) d !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (c.has("atom")) {
        let u = !0;
        for (const d of c.keys()) d !== "atom" && (u = !1);
        u && (i = !0);
      }
    } catch {
    }
    if (!t && !n && !i) {
      const u = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!u || (t = /^(sitemap|sitemap\.xml)$/i.test(u), n = /^(rss|rss\.xml)$/i.test(u), i = /^(atom|atom\.xml)$/i.test(u), r = /^(sitemap|sitemap\.html)$/i.test(u), !t && !n && !i && !r)) return !1;
    }
    let a = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof $t == "function")
        try {
          const c = await $t({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const u = /* @__PURE__ */ new Map();
              try {
                for (const d of e.index)
                  try {
                    d && d.slug && u.set(String(d.slug), d);
                  } catch {
                  }
                for (const d of c)
                  try {
                    d && d.slug && u.set(String(d.slug), d);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(u.values());
            } else
              a = c;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
        }
      else
        a = Array.isArray(re) && re.length ? re : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const c = /* @__PURE__ */ new Map();
          for (const u of e.index)
            try {
              if (!u || !u.slug) continue;
              const d = String(u.slug).split("::")[0];
              if (!c.has(d)) c.set(d, u);
              else {
                const f = c.get(d);
                f && String(f.slug || "").indexOf("::") !== -1 && String(u.slug || "").indexOf("::") === -1 && c.set(d, u);
              }
            } catch {
            }
          try {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(c.size));
          }
        } catch (c) {
          cn("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof qt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof $t == "function" && (u = await $t({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, p = [];
          e && e.homePage && p.push(e.homePage), e && e.navigationPage && p.push(e.navigationPage), a = await qt(e && e.contentBase ? e.contentBase : void 0, d, f, p.length ? p : void 0);
        }
      } catch (c) {
        cn("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(re) && re.length ? re : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        et(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(c));
      } catch {
      }
      try {
        et(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, d = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let f = null;
      try {
        const p = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof p == "function")
          try {
            f = await p(e && e.contentBase ? e.contentBase : void 0, u, d);
          } catch {
            f = null;
          }
      } catch {
        f = null;
      }
      if ((!f || !f.length) && typeof qt == "function")
        try {
          f = await qt(e && e.contentBase ? e.contentBase : void 0, u, d, c.length ? c : void 0);
        } catch {
          f = null;
        }
      if (Array.isArray(f) && f.length) {
        const p = /* @__PURE__ */ new Map();
        try {
          for (const y of a)
            try {
              y && y.slug && p.set(String(y.slug), y);
            } catch {
            }
          for (const y of f)
            try {
              y && y.slug && p.set(String(y.slug), y);
            } catch {
            }
        } catch {
        }
        a = Array.from(p.values());
      }
    } catch (c) {
      try {
        cn("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        et(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(c));
      } catch {
      }
      try {
        et(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await si(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), u = Array.isArray(l && l.entries) ? l.entries : [];
      for (const d of u)
        try {
          let f = null;
          if (d && d.slug) f = String(d.slug);
          else if (d && d.loc)
            try {
              f = new URL(String(d.loc)).searchParams.get("page");
            } catch {
            }
          if (!f) continue;
          const p = String(f).split("::")[0];
          if (!c.has(p)) {
            c.add(p);
            const y = Object.assign({}, d);
            y.baseSlug = p, o.push(y);
          }
        } catch {
        }
      try {
        et(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(o, null, 2));
      } catch {
        et(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(o.length));
      }
    } catch {
      try {
        o = Array.isArray(l && l.entries) ? l.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const h = Object.assign({}, l || {}, { entries: Array.isArray(o) ? o : Array.isArray(l && l.entries) ? l.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = h, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          et("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Dn(h, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          et("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Dn(h, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          et("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Dn(h, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(h && h.entries) ? h.entries : []).length;
        let d = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (d > u) {
          try {
            et("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", d, u);
          } catch {
          }
          return !0;
        }
        return Dn(h, "text/html"), !0;
      } catch (c) {
        return cn("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return cn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function Ul(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof $t == "function")
        try {
          const s = await $t({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(re) && re.length && (n = re), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await si(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), l = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of l)
        try {
          let h = null;
          if (o && o.slug) h = String(o.slug);
          else if (o && o.loc)
            try {
              h = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              h = null;
            }
          if (!h) continue;
          const c = String(h).split("::")[0];
          if (!s.has(c)) {
            s.add(c);
            const u = Object.assign({}, o);
            u.baseSlug = c, r.push(u);
          }
        } catch {
        }
    } catch {
      try {
        r = Array.isArray(i && i.entries) ? i.entries.slice(0) : [];
      } catch {
        r = [];
      }
    }
    const a = Object.assign({}, i || {}, { entries: Array.isArray(r) ? r : Array.isArray(i && i.entries) ? i.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = a, window.__nimbiSitemapFinal = r;
        } catch {
        }
    } catch {
    }
    return { json: a, deduped: r };
  } catch {
    return null;
  }
}
const xn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: Ul,
  generateAtomXml: Hr,
  generateRssXml: jr,
  generateSitemapJson: si,
  generateSitemapXml: Br,
  handleSitemapRequest: Dl
}, Symbol.toStringTag, { value: "Module" }));
export {
  Yi as BAD_LANGUAGES,
  Ee as SUPPORTED_HLJS_MAP,
  Xl as _clearHooks,
  Fr as addHook,
  Yl as default,
  xs as ensureBulma,
  Hl as getVersion,
  Yl as initCMS,
  ta as loadL10nFile,
  Vi as loadSupportedLanguages,
  _s as observeCodeBlocks,
  Zl as onNavBuild,
  Wl as onPageLoad,
  vn as registerLanguage,
  ki as runHooks,
  Ql as setHighlightTheme,
  na as setLang,
  Ss as setStyle,
  Kl as setThemeVars,
  un as t,
  Gl as transformHtml
};
