let kr = 0;
const hi = /* @__PURE__ */ Object.create(null);
function di(e) {
  try {
    const t = Number(e);
    kr = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    kr = 0;
  }
}
function Zt(e = 1) {
  try {
    return Number(kr) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function Ir() {
  return Zt(1);
}
function Zn(...e) {
  try {
    if (!Zt(1) || !console || typeof console.error != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.error(...t);
  } catch {
  }
}
function _(...e) {
  try {
    if (!Zt(2) || !console || typeof console.warn != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.warn(...t);
  } catch {
  }
}
function Tt(...e) {
  try {
    if (!Zt(3) || !console || typeof console.info != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.info(...t);
  } catch {
  }
}
function $t(...e) {
  try {
    if (!Zt(3) || !console || typeof console.log != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.log(...t);
  } catch {
  }
}
function ji(e) {
  try {
    if (!Ir()) return;
    const t = String(e || "");
    if (!t) return;
    hi[t] = (hi[t] || 0) + 1;
  } catch {
  }
}
function Di(e) {
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
const kn = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Or(e, t) {
  if (!Object.prototype.hasOwnProperty.call(kn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  kn[e].push(t);
}
function Tl(e) {
  Or("onPageLoad", e);
}
function Cl(e) {
  Or("onNavBuild", e);
}
function Rl(e) {
  Or("transformHtml", e);
}
async function fi(e, t) {
  const n = kn[e] || [];
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
function Pl() {
  Object.keys(kn).forEach((e) => {
    kn[e].length = 0;
  });
}
function Hi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var dr, pi;
function ns() {
  if (pi) return dr;
  pi = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((I) => {
      const X = x[I], be = typeof X;
      (be === "object" || be === "function") && !Object.isFrozen(X) && e(X);
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
    const X = /* @__PURE__ */ Object.create(null);
    for (const be in x)
      X[be] = x[be];
    return I.forEach(function(be) {
      for (const je in be)
        X[je] = be[je];
    }), /** @type {T} */
    X;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: I }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const X = x.split(".");
      return [
        `${I}${X.shift()}`,
        ...X.map((be, je) => `${be}${"_".repeat(je + 1)}`)
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
    constructor(I, X) {
      this.buffer = "", this.classPrefix = X.classPrefix, I.walk(this);
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
      const X = s(
        I.scope,
        { prefix: this.classPrefix }
      );
      this.span(X);
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
  class u {
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
      const X = o({ scope: I });
      this.add(X), this.stack.push(X);
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
    static _walk(I, X) {
      return typeof X == "string" ? I.addText(X) : X.children && (I.openNode(X), X.children.forEach((be) => this._walk(I, be)), I.closeNode(X)), I;
    }
    /**
     * @param {Node} node
     */
    static _collapse(I) {
      typeof I != "string" && I.children && (I.children.every((X) => typeof X == "string") ? I.children = [I.children.join("")] : I.children.forEach((X) => {
        u._collapse(X);
      }));
    }
  }
  class c extends u {
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
    __addSublanguage(I, X) {
      const be = I.root;
      X && (be.scope = `language:${X}`), this.add(be);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function d(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function f(x) {
    return h("(?=", x, ")");
  }
  function g(x) {
    return h("(?:", x, ")*");
  }
  function p(x) {
    return h("(?:", x, ")?");
  }
  function h(...x) {
    return x.map((X) => d(X)).join("");
  }
  function b(x) {
    const I = x[x.length - 1];
    return typeof I == "object" && I.constructor === Object ? (x.splice(x.length - 1, 1), I) : {};
  }
  function m(...x) {
    return "(" + (b(x).capture ? "" : "?:") + x.map((be) => d(be)).join("|") + ")";
  }
  function w(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function y(x, I) {
    const X = x && x.exec(I);
    return X && X.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: I }) {
    let X = 0;
    return x.map((be) => {
      X += 1;
      const je = X;
      let De = d(be), se = "";
      for (; De.length > 0; ) {
        const ae = k.exec(De);
        if (!ae) {
          se += De;
          break;
        }
        se += De.substring(0, ae.index), De = De.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? se += "\\" + String(Number(ae[1]) + je) : (se += ae[0], ae[0] === "(" && X++);
      }
      return se;
    }).map((be) => `(${be})`).join(I);
  }
  const v = /\b\B/, R = "[a-zA-Z]\\w*", Z = "[a-zA-Z_]\\w*", $ = "\\b\\d+(\\.\\d+)?", ee = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", z = "\\b(0b[01]+)", D = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ne = (x = {}) => {
    const I = /^#![ ]*\//;
    return x.binary && (x.begin = h(
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
      "on:begin": (X, be) => {
        X.index !== 0 && be.ignoreMatch();
      }
    }, x);
  }, j = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, re = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [j]
  }, A = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [j]
  }, G = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, ie = function(x, I, X = {}) {
    const be = i(
      {
        scope: "comment",
        begin: x,
        end: I,
        contains: []
      },
      X
    );
    be.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const je = m(
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
    return be.contains.push(
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
        begin: h(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          je,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), be;
  }, Te = ie("//", "$"), Y = ie("/\\*", "\\*/"), ge = ie("#", "$"), Se = {
    scope: "number",
    begin: $,
    relevance: 0
  }, $e = {
    scope: "number",
    begin: ee,
    relevance: 0
  }, Qe = {
    scope: "number",
    begin: z,
    relevance: 0
  }, ve = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      j,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [j]
      }
    ]
  }, rt = {
    scope: "title",
    begin: R,
    relevance: 0
  }, C = {
    scope: "title",
    begin: Z,
    relevance: 0
  }, N = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Z,
    relevance: 0
  };
  var L = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: re,
    BACKSLASH_ESCAPE: j,
    BINARY_NUMBER_MODE: Qe,
    BINARY_NUMBER_RE: z,
    COMMENT: ie,
    C_BLOCK_COMMENT_MODE: Y,
    C_LINE_COMMENT_MODE: Te,
    C_NUMBER_MODE: $e,
    C_NUMBER_RE: ee,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (I, X) => {
            X.data._beginMatch = I[1];
          },
          /** @type {ModeCallback} */
          "on:end": (I, X) => {
            X.data._beginMatch !== I[1] && X.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ge,
    IDENT_RE: R,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: N,
    NUMBER_MODE: Se,
    NUMBER_RE: $,
    PHRASAL_WORDS_MODE: G,
    QUOTE_STRING_MODE: A,
    REGEXP_MODE: ve,
    RE_STARTERS_RE: D,
    SHEBANG: ne,
    TITLE_MODE: rt,
    UNDERSCORE_IDENT_RE: Z,
    UNDERSCORE_TITLE_MODE: C
  });
  function T(x, I) {
    x.input[x.index - 1] === "." && I.ignoreMatch();
  }
  function O(x, I) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function W(x, I) {
    I && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = T, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function P(x, I) {
    Array.isArray(x.illegal) && (x.illegal = m(...x.illegal));
  }
  function B(x, I) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function E(x, I) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const q = (x, I) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const X = Object.assign({}, x);
    Object.keys(x).forEach((be) => {
      delete x[be];
    }), x.keywords = X.keywords, x.begin = h(X.beforeMatch, f(X.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(X, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete X.beforeMatch;
  }, Q = [
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
  ], U = "keyword";
  function pe(x, I, X = U) {
    const be = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? je(X, x.split(" ")) : Array.isArray(x) ? je(X, x) : Object.keys(x).forEach(function(De) {
      Object.assign(
        be,
        pe(x[De], I, De)
      );
    }), be;
    function je(De, se) {
      I && (se = se.map((ae) => ae.toLowerCase())), se.forEach(function(ae) {
        const me = ae.split("|");
        be[me[0]] = [De, Ce(me[0], me[1])];
      });
    }
  }
  function Ce(x, I) {
    return I ? Number(I) : ye(x) ? 0 : 1;
  }
  function ye(x) {
    return Q.includes(x.toLowerCase());
  }
  const fe = {}, Ae = (x) => {
    console.error(x);
  }, Ze = (x, ...I) => {
    console.log(`WARN: ${x}`, ...I);
  }, qe = (x, I) => {
    fe[`${x}/${I}`] || (console.log(`Deprecated as of ${x}. ${I}`), fe[`${x}/${I}`] = !0);
  }, mt = new Error();
  function tn(x, I, { key: X }) {
    let be = 0;
    const je = x[X], De = {}, se = {};
    for (let ae = 1; ae <= I.length; ae++)
      se[ae + be] = je[ae], De[ae + be] = !0, be += w(I[ae - 1]);
    x[X] = se, x[X]._emit = De, x[X]._multi = !0;
  }
  function St(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), mt;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Ae("beginScope must be object"), mt;
      tn(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function Ca(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), mt;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Ae("endScope must be object"), mt;
      tn(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Ra(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Pa(x) {
    Ra(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), St(x), Ca(x);
  }
  function $a(x) {
    function I(se, ae) {
      return new RegExp(
        d(se),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class X {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(ae, me) {
        me.position = this.position++, this.matchIndexes[this.matchAt] = me, this.regexes.push([me, ae]), this.matchAt += w(ae) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ae = this.regexes.map((me) => me[1]);
        this.matcherRe = I(S(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const me = this.matcherRe.exec(ae);
        if (!me)
          return null;
        const Ge = me.findIndex((nn, sr) => sr > 0 && nn !== void 0), Ue = this.matchIndexes[Ge];
        return me.splice(0, Ge), Object.assign(me, Ue);
      }
    }
    class be {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const me = new X();
        return this.rules.slice(ae).forEach(([Ge, Ue]) => me.addRule(Ge, Ue)), me.compile(), this.multiRegexes[ae] = me, me;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(ae, me) {
        this.rules.push([ae, me]), me.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(ae) {
        const me = this.getMatcher(this.regexIndex);
        me.lastIndex = this.lastIndex;
        let Ge = me.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ge && Ge.index === this.lastIndex)) {
          const Ue = this.getMatcher(0);
          Ue.lastIndex = this.lastIndex + 1, Ge = Ue.exec(ae);
        }
        return Ge && (this.regexIndex += Ge.position + 1, this.regexIndex === this.count && this.considerAll()), Ge;
      }
    }
    function je(se) {
      const ae = new be();
      return se.contains.forEach((me) => ae.addRule(me.begin, { rule: me, type: "begin" })), se.terminatorEnd && ae.addRule(se.terminatorEnd, { type: "end" }), se.illegal && ae.addRule(se.illegal, { type: "illegal" }), ae;
    }
    function De(se, ae) {
      const me = (
        /** @type CompiledMode */
        se
      );
      if (se.isCompiled) return me;
      [
        O,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        B,
        Pa,
        q
      ].forEach((Ue) => Ue(se, ae)), x.compilerExtensions.forEach((Ue) => Ue(se, ae)), se.__beforeBegin = null, [
        W,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        P,
        // default to 1 relevance if not specified
        E
      ].forEach((Ue) => Ue(se, ae)), se.isCompiled = !0;
      let Ge = null;
      return typeof se.keywords == "object" && se.keywords.$pattern && (se.keywords = Object.assign({}, se.keywords), Ge = se.keywords.$pattern, delete se.keywords.$pattern), Ge = Ge || /\w+/, se.keywords && (se.keywords = pe(se.keywords, x.case_insensitive)), me.keywordPatternRe = I(Ge, !0), ae && (se.begin || (se.begin = /\B|\b/), me.beginRe = I(me.begin), !se.end && !se.endsWithParent && (se.end = /\B|\b/), se.end && (me.endRe = I(me.end)), me.terminatorEnd = d(me.end) || "", se.endsWithParent && ae.terminatorEnd && (me.terminatorEnd += (se.end ? "|" : "") + ae.terminatorEnd)), se.illegal && (me.illegalRe = I(
        /** @type {RegExp | string} */
        se.illegal
      )), se.contains || (se.contains = []), se.contains = [].concat(...se.contains.map(function(Ue) {
        return za(Ue === "self" ? se : Ue);
      })), se.contains.forEach(function(Ue) {
        De(
          /** @type Mode */
          Ue,
          me
        );
      }), se.starts && De(se.starts, ae), me.matcher = je(me), me;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), De(
      /** @type Mode */
      x
    );
  }
  function Jr(x) {
    return x ? x.endsWithParent || Jr(x.starts) : !1;
  }
  function za(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(I) {
      return i(x, { variants: null }, I);
    })), x.cachedVariants ? x.cachedVariants : Jr(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var Ia = "11.11.1";
  class Oa extends Error {
    constructor(I, X) {
      super(I), this.name = "HTMLInjectionError", this.html = X;
    }
  }
  const ar = n, ei = i, ti = /* @__PURE__ */ Symbol("nomatch"), Na = 7, ni = function(x) {
    const I = /* @__PURE__ */ Object.create(null), X = /* @__PURE__ */ Object.create(null), be = [];
    let je = !0;
    const De = "Could not find the language '{}', did you forget to load/include a language module?", se = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
    function me(F) {
      return ae.noHighlightRe.test(F);
    }
    function Ge(F) {
      let ce = F.className + " ";
      ce += F.parentNode ? F.parentNode.className : "";
      const Ee = ae.languageDetectRe.exec(ce);
      if (Ee) {
        const Ne = Et(Ee[1]);
        return Ne || (Ze(De.replace("{}", Ee[1])), Ze("Falling back to no-highlight mode for this block.", F)), Ne ? Ee[1] : "no-highlight";
      }
      return ce.split(/\s+/).find((Ne) => me(Ne) || Et(Ne));
    }
    function Ue(F, ce, Ee) {
      let Ne = "", Fe = "";
      typeof ce == "object" ? (Ne = F, Ee = ce.ignoreIllegals, Fe = ce.language) : (qe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), qe("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Fe = F, Ne = ce), Ee === void 0 && (Ee = !0);
      const pt = {
        code: Ne,
        language: Fe
      };
      Pn("before:highlight", pt);
      const Mt = pt.result ? pt.result : nn(pt.language, pt.code, Ee);
      return Mt.code = pt.code, Pn("after:highlight", Mt), Mt;
    }
    function nn(F, ce, Ee, Ne) {
      const Fe = /* @__PURE__ */ Object.create(null);
      function pt(J, le) {
        return J.keywords[le];
      }
      function Mt() {
        if (!we.keywords) {
          Xe.addText(Be);
          return;
        }
        let J = 0;
        we.keywordPatternRe.lastIndex = 0;
        let le = we.keywordPatternRe.exec(Be), _e = "";
        for (; le; ) {
          _e += Be.substring(J, le.index);
          const Ie = bt.case_insensitive ? le[0].toLowerCase() : le[0], Ke = pt(we, Ie);
          if (Ke) {
            const [vt, es] = Ke;
            if (Xe.addText(_e), _e = "", Fe[Ie] = (Fe[Ie] || 0) + 1, Fe[Ie] <= Na && (In += es), vt.startsWith("_"))
              _e += le[0];
            else {
              const ts = bt.classNameAliases[vt] || vt;
              yt(le[0], ts);
            }
          } else
            _e += le[0];
          J = we.keywordPatternRe.lastIndex, le = we.keywordPatternRe.exec(Be);
        }
        _e += Be.substring(J), Xe.addText(_e);
      }
      function $n() {
        if (Be === "") return;
        let J = null;
        if (typeof we.subLanguage == "string") {
          if (!I[we.subLanguage]) {
            Xe.addText(Be);
            return;
          }
          J = nn(we.subLanguage, Be, !0, ui[we.subLanguage]), ui[we.subLanguage] = /** @type {CompiledMode} */
          J._top;
        } else
          J = or(Be, we.subLanguage.length ? we.subLanguage : null);
        we.relevance > 0 && (In += J.relevance), Xe.__addSublanguage(J._emitter, J.language);
      }
      function st() {
        we.subLanguage != null ? $n() : Mt(), Be = "";
      }
      function yt(J, le) {
        J !== "" && (Xe.startScope(le), Xe.addText(J), Xe.endScope());
      }
      function si(J, le) {
        let _e = 1;
        const Ie = le.length - 1;
        for (; _e <= Ie; ) {
          if (!J._emit[_e]) {
            _e++;
            continue;
          }
          const Ke = bt.classNameAliases[J[_e]] || J[_e], vt = le[_e];
          Ke ? yt(vt, Ke) : (Be = vt, Mt(), Be = ""), _e++;
        }
      }
      function oi(J, le) {
        return J.scope && typeof J.scope == "string" && Xe.openNode(bt.classNameAliases[J.scope] || J.scope), J.beginScope && (J.beginScope._wrap ? (yt(Be, bt.classNameAliases[J.beginScope._wrap] || J.beginScope._wrap), Be = "") : J.beginScope._multi && (si(J.beginScope, le), Be = "")), we = Object.create(J, { parent: { value: we } }), we;
      }
      function li(J, le, _e) {
        let Ie = y(J.endRe, _e);
        if (Ie) {
          if (J["on:end"]) {
            const Ke = new t(J);
            J["on:end"](le, Ke), Ke.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; J.endsParent && J.parent; )
              J = J.parent;
            return J;
          }
        }
        if (J.endsWithParent)
          return li(J.parent, le, _e);
      }
      function Xa(J) {
        return we.matcher.regexIndex === 0 ? (Be += J[0], 1) : (hr = !0, 0);
      }
      function Ka(J) {
        const le = J[0], _e = J.rule, Ie = new t(_e), Ke = [_e.__beforeBegin, _e["on:begin"]];
        for (const vt of Ke)
          if (vt && (vt(J, Ie), Ie.isMatchIgnored))
            return Xa(le);
        return _e.skip ? Be += le : (_e.excludeBegin && (Be += le), st(), !_e.returnBegin && !_e.excludeBegin && (Be = le)), oi(_e, J), _e.returnBegin ? 0 : le.length;
      }
      function Va(J) {
        const le = J[0], _e = ce.substring(J.index), Ie = li(we, J, _e);
        if (!Ie)
          return ti;
        const Ke = we;
        we.endScope && we.endScope._wrap ? (st(), yt(le, we.endScope._wrap)) : we.endScope && we.endScope._multi ? (st(), si(we.endScope, J)) : Ke.skip ? Be += le : (Ke.returnEnd || Ke.excludeEnd || (Be += le), st(), Ke.excludeEnd && (Be = le));
        do
          we.scope && Xe.closeNode(), !we.skip && !we.subLanguage && (In += we.relevance), we = we.parent;
        while (we !== Ie.parent);
        return Ie.starts && oi(Ie.starts, J), Ke.returnEnd ? 0 : le.length;
      }
      function Ya() {
        const J = [];
        for (let le = we; le !== bt; le = le.parent)
          le.scope && J.unshift(le.scope);
        J.forEach((le) => Xe.openNode(le));
      }
      let zn = {};
      function ci(J, le) {
        const _e = le && le[0];
        if (Be += J, _e == null)
          return st(), 0;
        if (zn.type === "begin" && le.type === "end" && zn.index === le.index && _e === "") {
          if (Be += ce.slice(le.index, le.index + 1), !je) {
            const Ie = new Error(`0 width match regex (${F})`);
            throw Ie.languageName = F, Ie.badRule = zn.rule, Ie;
          }
          return 1;
        }
        if (zn = le, le.type === "begin")
          return Ka(le);
        if (le.type === "illegal" && !Ee) {
          const Ie = new Error('Illegal lexeme "' + _e + '" for mode "' + (we.scope || "<unnamed>") + '"');
          throw Ie.mode = we, Ie;
        } else if (le.type === "end") {
          const Ie = Va(le);
          if (Ie !== ti)
            return Ie;
        }
        if (le.type === "illegal" && _e === "")
          return Be += `
`, 1;
        if (ur > 1e5 && ur > le.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Be += _e, _e.length;
      }
      const bt = Et(F);
      if (!bt)
        throw Ae(De.replace("{}", F)), new Error('Unknown language: "' + F + '"');
      const Ja = $a(bt);
      let cr = "", we = Ne || Ja;
      const ui = {}, Xe = new ae.__emitter(ae);
      Ya();
      let Be = "", In = 0, Ot = 0, ur = 0, hr = !1;
      try {
        if (bt.__emitTokens)
          bt.__emitTokens(ce, Xe);
        else {
          for (we.matcher.considerAll(); ; ) {
            ur++, hr ? hr = !1 : we.matcher.considerAll(), we.matcher.lastIndex = Ot;
            const J = we.matcher.exec(ce);
            if (!J) break;
            const le = ce.substring(Ot, J.index), _e = ci(le, J);
            Ot = J.index + _e;
          }
          ci(ce.substring(Ot));
        }
        return Xe.finalize(), cr = Xe.toHTML(), {
          language: F,
          value: cr,
          relevance: In,
          illegal: !1,
          _emitter: Xe,
          _top: we
        };
      } catch (J) {
        if (J.message && J.message.includes("Illegal"))
          return {
            language: F,
            value: ar(ce),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: J.message,
              index: Ot,
              context: ce.slice(Ot - 100, Ot + 100),
              mode: J.mode,
              resultSoFar: cr
            },
            _emitter: Xe
          };
        if (je)
          return {
            language: F,
            value: ar(ce),
            illegal: !1,
            relevance: 0,
            errorRaised: J,
            _emitter: Xe,
            _top: we
          };
        throw J;
      }
    }
    function sr(F) {
      const ce = {
        value: ar(F),
        illegal: !1,
        relevance: 0,
        _top: se,
        _emitter: new ae.__emitter(ae)
      };
      return ce._emitter.addText(F), ce;
    }
    function or(F, ce) {
      ce = ce || ae.languages || Object.keys(I);
      const Ee = sr(F), Ne = ce.filter(Et).filter(ai).map(
        (st) => nn(st, F, !1)
      );
      Ne.unshift(Ee);
      const Fe = Ne.sort((st, yt) => {
        if (st.relevance !== yt.relevance) return yt.relevance - st.relevance;
        if (st.language && yt.language) {
          if (Et(st.language).supersetOf === yt.language)
            return 1;
          if (Et(yt.language).supersetOf === st.language)
            return -1;
        }
        return 0;
      }), [pt, Mt] = Fe, $n = pt;
      return $n.secondBest = Mt, $n;
    }
    function Ba(F, ce, Ee) {
      const Ne = ce && X[ce] || Ee;
      F.classList.add("hljs"), F.classList.add(`language-${Ne}`);
    }
    function lr(F) {
      let ce = null;
      const Ee = Ge(F);
      if (me(Ee)) return;
      if (Pn(
        "before:highlightElement",
        { el: F, language: Ee }
      ), F.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", F);
        return;
      }
      if (F.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(F)), ae.throwUnescapedHTML))
        throw new Oa(
          "One of your code blocks includes unescaped HTML.",
          F.innerHTML
        );
      ce = F;
      const Ne = ce.textContent, Fe = Ee ? Ue(Ne, { language: Ee, ignoreIllegals: !0 }) : or(Ne);
      F.innerHTML = Fe.value, F.dataset.highlighted = "yes", Ba(F, Ee, Fe.language), F.result = {
        language: Fe.language,
        // TODO: remove with version 11.0
        re: Fe.relevance,
        relevance: Fe.relevance
      }, Fe.secondBest && (F.secondBest = {
        language: Fe.secondBest.language,
        relevance: Fe.secondBest.relevance
      }), Pn("after:highlightElement", { el: F, result: Fe, text: Ne });
    }
    function qa(F) {
      ae = ei(ae, F);
    }
    const ja = () => {
      Rn(), qe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Da() {
      Rn(), qe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ri = !1;
    function Rn() {
      function F() {
        Rn();
      }
      if (document.readyState === "loading") {
        ri || window.addEventListener("DOMContentLoaded", F, !1), ri = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(lr);
    }
    function Ha(F, ce) {
      let Ee = null;
      try {
        Ee = ce(x);
      } catch (Ne) {
        if (Ae("Language definition for '{}' could not be registered.".replace("{}", F)), je)
          Ae(Ne);
        else
          throw Ne;
        Ee = se;
      }
      Ee.name || (Ee.name = F), I[F] = Ee, Ee.rawDefinition = ce.bind(null, x), Ee.aliases && ii(Ee.aliases, { languageName: F });
    }
    function Ua(F) {
      delete I[F];
      for (const ce of Object.keys(X))
        X[ce] === F && delete X[ce];
    }
    function Fa() {
      return Object.keys(I);
    }
    function Et(F) {
      return F = (F || "").toLowerCase(), I[F] || I[X[F]];
    }
    function ii(F, { languageName: ce }) {
      typeof F == "string" && (F = [F]), F.forEach((Ee) => {
        X[Ee.toLowerCase()] = ce;
      });
    }
    function ai(F) {
      const ce = Et(F);
      return ce && !ce.disableAutodetect;
    }
    function Wa(F) {
      F["before:highlightBlock"] && !F["before:highlightElement"] && (F["before:highlightElement"] = (ce) => {
        F["before:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      }), F["after:highlightBlock"] && !F["after:highlightElement"] && (F["after:highlightElement"] = (ce) => {
        F["after:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      });
    }
    function Za(F) {
      Wa(F), be.push(F);
    }
    function Ga(F) {
      const ce = be.indexOf(F);
      ce !== -1 && be.splice(ce, 1);
    }
    function Pn(F, ce) {
      const Ee = F;
      be.forEach(function(Ne) {
        Ne[Ee] && Ne[Ee](ce);
      });
    }
    function Qa(F) {
      return qe("10.7.0", "highlightBlock will be removed entirely in v12.0"), qe("10.7.0", "Please use highlightElement now."), lr(F);
    }
    Object.assign(x, {
      highlight: Ue,
      highlightAuto: or,
      highlightAll: Rn,
      highlightElement: lr,
      // TODO: Remove with v12 API
      highlightBlock: Qa,
      configure: qa,
      initHighlighting: ja,
      initHighlightingOnLoad: Da,
      registerLanguage: Ha,
      unregisterLanguage: Ua,
      listLanguages: Fa,
      getLanguage: Et,
      registerAliases: ii,
      autoDetection: ai,
      inherit: ei,
      addPlugin: Za,
      removePlugin: Ga
    }), x.debugMode = function() {
      je = !1;
    }, x.safeMode = function() {
      je = !0;
    }, x.versionString = Ia, x.regex = {
      concat: h,
      lookahead: f,
      either: m,
      optional: p,
      anyNumberOfTimes: g
    };
    for (const F in L)
      typeof L[F] == "object" && e(L[F]);
    return Object.assign(x, L), x;
  }, Gt = ni({});
  return Gt.newInstance = () => ni({}), dr = Gt, Gt.HighlightJS = Gt, Gt.default = Gt, dr;
}
var rs = /* @__PURE__ */ ns();
const Re = /* @__PURE__ */ Hi(rs), is = "11.11.1", xe = /* @__PURE__ */ new Map(), as = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ct = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
ct.html = "xml";
ct.xhtml = "xml";
ct.markup = "xml";
const Ui = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Rt = null;
const fr = /* @__PURE__ */ new Map(), ss = 300 * 1e3;
async function Fi(e = as) {
  if (e)
    return Rt || (Rt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let u = 0; u < i.length; u++)
          if (/\|\s*Language\s*\|/i.test(i[u])) {
            r = u;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((u) => u.trim().toLowerCase());
        let s = a.findIndex((u) => /alias|aliases|equivalent|alt|alternates?/i.test(u));
        s === -1 && (s = 1);
        let l = a.findIndex((u) => /file|filename|module|module name|module-name|short|slug/i.test(u));
        if (l === -1) {
          const u = a.findIndex((c) => /language/i.test(c));
          l = u !== -1 ? u : 0;
        }
        let o = [];
        for (let u = r + 1; u < i.length; u++) {
          const c = i[u].trim();
          if (!c || !c.startsWith("|")) break;
          const d = c.replace(/^\||\|$/g, "").split("|").map((b) => b.trim());
          if (d.every((b) => /^-+$/.test(b))) continue;
          const f = d;
          if (!f.length) continue;
          const p = (f[l] || f[0] || "").toString().trim().toLowerCase();
          if (!p || /^-+$/.test(p)) continue;
          xe.set(p, p);
          const h = f[s] || "";
          if (h) {
            const b = String(h).split(",").map((m) => m.replace(/`/g, "").trim()).filter(Boolean);
            if (b.length) {
              const w = b[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (xe.set(w, w), o.push(w));
            }
          }
        }
        try {
          const u = [];
          for (const c of o) {
            const d = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            d && /[a-z0-9]/i.test(d) ? u.push(d) : xe.delete(c);
          }
          o = u;
        } catch (u) {
          _("[codeblocksManager] cleanup aliases failed", u);
        }
        try {
          let u = 0;
          for (const c of Array.from(xe.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              xe.delete(c), u++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const d = c.replace(/^[:]+/, "");
              if (d && /[a-z0-9]/i.test(d)) {
                const f = xe.get(c);
                xe.delete(c), xe.set(d, f);
              } else
                xe.delete(c), u++;
            }
          }
          for (const [c, d] of Array.from(xe.entries()))
            (!d || /^-+$/.test(d) || !/[a-z0-9]/i.test(d)) && (xe.delete(c), u++);
          try {
            const c = ":---------------------";
            xe.has(c) && (xe.delete(c), u++);
          } catch (c) {
            _("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(xe.keys()).sort();
          } catch (c) {
            _("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (u) {
          _("[codeblocksManager] ignored error", u);
        }
      } catch (t) {
        _("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Rt);
}
const rn = /* @__PURE__ */ new Set();
async function xn(e, t) {
  if (Rt || (async () => {
    try {
      await Fi();
    } catch (r) {
      _("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Rt)
    try {
      await Rt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Ui.has(n)) return !1;
  if (xe.size && !xe.has(n)) {
    const r = ct;
    if (!r[n] && !r[e])
      return !1;
  }
  if (rn.has(e)) return !0;
  const i = ct;
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
    xe.size && (l = l.filter((c) => {
      if (xe.has(c)) return !0;
      const d = ct[c];
      return !!(d && xe.has(d));
    }));
    let o = null, u = null;
    for (const c of l)
      try {
        const d = Date.now();
        let f = fr.get(c);
        if (f && f.ok === !1 && d - (f.ts || 0) >= ss && (fr.delete(c), f = void 0), f) {
          if (f.module)
            o = f.module;
          else if (f.promise)
            try {
              o = await f.promise;
            } catch {
              o = null;
            }
        } else {
          const g = { promise: null, module: null, ok: null, ts: 0 };
          fr.set(c, g), g.promise = (async () => {
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
                  const h = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(h);
                } catch {
                  try {
                    const b = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(b);
                  } catch {
                    return null;
                  }
                }
              }
            } catch {
              return null;
            }
          })();
          try {
            o = await g.promise, g.module = o, g.ok = !!o, g.ts = Date.now();
          } catch {
            g.module = null, g.ok = !1, g.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const g = o.default || o;
          try {
            const p = xe.size && xe.get(e) || c || e;
            return Re.registerLanguage(p, g), rn.add(p), p !== e && (Re.registerLanguage(e, g), rn.add(e)), !0;
          } catch (p) {
            u = p;
          }
        } else
          try {
            if (xe.has(c) || xe.has(e)) {
              const g = () => ({});
              try {
                Re.registerLanguage(c, g), rn.add(c);
              } catch {
              }
              try {
                c !== e && (Re.registerLanguage(e, g), rn.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (d) {
        u = d;
      }
    if (u)
      throw u;
    return !1;
  } catch {
    return !1;
  }
}
let On = null;
function os(e = document) {
  Rt || (async () => {
    try {
      await Fi();
    } catch (a) {
      _("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = ct, i = On || (typeof IntersectionObserver > "u" ? null : (On = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (u) {
        _("[codeblocksManager] observer unobserve failed", u);
      }
      (async () => {
        try {
          const u = o.getAttribute && o.getAttribute("class") || o.className || "", c = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const d = (c[1] || "").toLowerCase(), f = t[d] || d, g = xe.size && (xe.get(f) || xe.get(String(f).toLowerCase())) || f;
            try {
              await xn(g);
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
              Re.highlightElement(o);
            } catch (p) {
              _("[codeblocksManager] hljs.highlightElement failed", p);
            }
          } else
            try {
              const d = o.textContent || "";
              try {
                if (Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext")) {
                  const f = Re.highlight(d, { language: "plaintext" });
                  f && f.value && (o.innerHTML = f.value);
                }
              } catch {
                try {
                  Re.highlightElement(o);
                } catch (g) {
                  _("[codeblocksManager] fallback highlightElement failed", g);
                }
              }
            } catch (d) {
              _("[codeblocksManager] auto-detect plaintext failed", d);
            }
        } catch (u) {
          _("[codeblocksManager] observer entry processing failed", u);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), On)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), u = t[o] || o, c = xe.size && (xe.get(u) || xe.get(String(u).toLowerCase())) || u;
          try {
            await xn(c);
          } catch (d) {
            _("[codeblocksManager] registerLanguage failed (no observer)", d);
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
          Re.highlightElement(a);
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
function $l(e, { useCdn: t = !0 } = {}) {
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
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${is}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let Nt = "light";
function ls(e, t = {}) {
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
function gi() {
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
async function cs(e = "none", t = "/") {
  try {
    $t("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
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
    if (gi(), document.querySelector("style[data-bulma-override]")) return;
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
    gi();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ls(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    _("[bulmaManager] ensureBulma failed", r);
  }
}
function us(e) {
  Nt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Nt === "dark" ? n.setAttribute("data-theme", "dark") : Nt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Nt === "dark" ? n.setAttribute("data-theme", "dark") : Nt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function zl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      _("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Wi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Nt === "dark" ? t.setAttribute("data-theme", "dark") : Nt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Zi = {
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
}, Vt = JSON.parse(JSON.stringify(Zi));
let Gn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Gn = String(e).split("-")[0].toLowerCase();
}
Zi[Gn] || (Gn = "en");
let zt = Gn;
function ln(e, t = {}) {
  const n = Vt[zt] || Vt.en;
  let i = n && n[e] ? n[e] : Vt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Gi(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Vt[a] = Object.assign({}, Vt[a] || {}, r[a]);
  } catch {
  }
}
function Qi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  zt = Vt[t] ? t : "en";
}
const hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return zt;
  },
  loadL10nFile: Gi,
  setLang: Qi,
  t: ln
}, Symbol.toStringTag, { value: "Module" }));
function ds(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function mi(e, t = null, n = void 0) {
  let r = "#/" + ds(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = nt(location.href);
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
function nt(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const u = t.hash.replace(/^#/, "");
        if (u.includes("&")) {
          const c = u.split("&");
          r = c.shift() || null, a = c.join("&");
        } else
          r = u || null;
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
        const u = r.split("?");
        r = u.shift() || "", a = u.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const u = s.split("#");
        s = u.shift() || "", l = u.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const fs = `/**
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
function ps(e, t = "worker") {
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
          } catch (u) {
            i("[" + t + "] worker termination failed", u);
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
  function s(o, u = 1e4) {
    return new Promise((c, d) => {
      const f = r();
      if (!f) return d(new Error("worker unavailable"));
      const g = String(Math.random()), p = Object.assign({}, o, { id: g });
      let h = null;
      const b = () => {
        h && clearTimeout(h), f.removeEventListener("message", m), f.removeEventListener("error", w);
      }, m = (y) => {
        const k = y.data || {};
        k.id === g && (b(), k.error ? d(new Error(k.error)) : c(k.result));
      }, w = (y) => {
        b(), i("[" + t + "] worker error event", y);
        try {
          n === f && (n = null, f.terminate && f.terminate());
        } catch (k) {
          i("[" + t + "] worker termination failed", k);
        }
        d(new Error(y && y.message || "worker error"));
      };
      h = setTimeout(() => {
        b(), i("[" + t + "] worker timed out");
        try {
          n === f && (n = null, f.terminate && f.terminate());
        } catch (y) {
          i("[" + t + "] worker termination on timeout failed", y);
        }
        d(new Error("worker timeout"));
      }, u), f.addEventListener("message", m), f.addEventListener("error", w);
      try {
        f.postMessage(p);
      } catch (y) {
        b(), d(y);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function Xi(e, t = "worker-pool", n = 2) {
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
        const h = e();
        i[p] = h || null, h && h.addEventListener("error", () => {
          try {
            i[p] === h && (i[p] = null, h.terminate && h.terminate());
          } catch (b) {
            a("[" + t + "] worker termination failed", b);
          }
        });
      } catch (h) {
        i[p] = null, a("[" + t + "] worker init failed", h);
      }
    return i[p];
  }
  const l = new Array(n).fill(0), o = new Array(n).fill(null), u = 30 * 1e3;
  function c(p) {
    try {
      l[p] = Date.now(), o[p] && (clearTimeout(o[p]), o[p] = null), o[p] = setTimeout(() => {
        try {
          i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
        } catch (h) {
          a("[" + t + "] idle termination failed", h);
        }
        o[p] = null;
      }, u);
    } catch {
    }
  }
  function d() {
    for (let p = 0; p < i.length; p++) {
      const h = s(p);
      if (h) return h;
    }
    return null;
  }
  function f() {
    for (let p = 0; p < i.length; p++)
      try {
        i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
      } catch (h) {
        a("[" + t + "] worker termination failed", h);
      }
  }
  function g(p, h = 1e4) {
    return new Promise((b, m) => {
      const w = r++ % i.length, y = (k) => {
        const S = (w + k) % i.length, v = s(S);
        if (!v)
          return k + 1 < i.length ? y(k + 1) : m(new Error("worker pool unavailable"));
        const R = String(Math.random()), Z = Object.assign({}, p, { id: R });
        let $ = null;
        const ee = () => {
          $ && clearTimeout($), v.removeEventListener("message", z), v.removeEventListener("error", D);
        }, z = (ne) => {
          const j = ne.data || {};
          j.id === R && (ee(), j.error ? m(new Error(j.error)) : b(j.result));
        }, D = (ne) => {
          ee(), a("[" + t + "] worker error event", ne);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (j) {
            a("[" + t + "] worker termination failed", j);
          }
          m(new Error(ne && ne.message || "worker error"));
        };
        $ = setTimeout(() => {
          ee(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (ne) {
            a("[" + t + "] worker termination on timeout failed", ne);
          }
          m(new Error("worker timeout"));
        }, h), v.addEventListener("message", z), v.addEventListener("error", D);
        try {
          c(S), v.postMessage(Z);
        } catch (ne) {
          ee(), m(ne);
        }
      };
      y(0);
    });
  }
  return { get: d, send: g, terminate: f };
}
function un(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        un._blobUrlCache || (un._blobUrlCache = /* @__PURE__ */ new Map());
        const t = un._blobUrlCache;
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
const tt = /* @__PURE__ */ new Set();
function Dt(e) {
  if (gs(), tt.clear(), Array.isArray(Oe) && Oe.length)
    for (const t of Oe)
      t && tt.add(t);
  else
    for (const t of Pe)
      t && tt.add(t);
  yi(V), yi(H), Dt._refreshed = !0;
}
function yi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && tt.add(t);
}
function bi(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && tt.add(i), t.call(this, n, i);
  };
}
let wi = !1;
function gs() {
  wi || (bi(V), bi(H), wi = !0);
}
const pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: tt,
  refreshIndexPaths: Dt
}, Symbol.toStringTag, { value: "Module" }));
function en(e, t = 1e3) {
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
function xr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const K = en(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), Yt = en(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Ut = en(function(e) {
  return Yt(String(e || "")) + "/";
}, 2e3);
function ms(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    _("[helpers] preloadImage failed", t);
  }
}
function Nn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let d = 0;
    r && (d = r.clientHeight || (a ? a.height : 0)), d || (d = l - s);
    let f = 0.6;
    try {
      const b = r && window.getComputedStyle ? window.getComputedStyle(r) : null, m = b && b.getPropertyValue("--nimbi-image-max-height-ratio"), w = m ? parseFloat(m) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (f = w);
    } catch (b) {
      _("[helpers] read CSS ratio failed", b);
    }
    const g = Math.max(200, Math.floor(d * f));
    let p = !1, h = null;
    if (i.forEach((b) => {
      try {
        const m = b.getAttribute ? b.getAttribute("loading") : void 0;
        m !== "eager" && b.setAttribute && b.setAttribute("loading", "lazy");
        const w = b.getBoundingClientRect ? b.getBoundingClientRect() : null, y = b.src || b.getAttribute && b.getAttribute("src"), k = w && w.height > 1 ? w.height : g, S = w ? w.top : 0, v = S + k;
        w && k > 0 && S <= c && v >= o && (b.setAttribute ? (b.setAttribute("loading", "eager"), b.setAttribute("fetchpriority", "high"), b.setAttribute("data-eager-by-nimbi", "1")) : (b.loading = "eager", b.fetchPriority = "high"), ms(y), p = !0), !h && w && w.top <= c && (h = { img: b, src: y, rect: w, beforeLoading: m });
      } catch (m) {
        _("[helpers] setEagerForAboveFoldImages per-image failed", m);
      }
    }), !p && h) {
      const { img: b, src: m, rect: w, beforeLoading: y } = h;
      try {
        b.setAttribute ? (b.setAttribute("loading", "eager"), b.setAttribute("fetchpriority", "high"), b.setAttribute("data-eager-by-nimbi", "1")) : (b.loading = "eager", b.fetchPriority = "high");
      } catch (k) {
        _("[helpers] setEagerForAboveFoldImages fallback failed", k);
      }
    }
  } catch (i) {
    _("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function ze(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [u, c] of r.entries())
      s.append(u, c);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
en(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return _("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Qn(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Qn);
} catch (e) {
  _("[helpers] global attach failed", e);
}
const ys = en(function(e) {
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
}, 2e3), V = /* @__PURE__ */ new Map();
let it = [], Nr = !1;
function bs(e) {
  Nr = !!e;
}
function Ki(e) {
  it = Array.isArray(e) ? e.slice() : [];
}
function ws() {
  return it;
}
const Sn = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Vi = Xi(() => un(fs), "slugManager", Sn);
function _s() {
  try {
    if (Ir()) return !0;
  } catch {
  }
  try {
    return !!(typeof oe == "string" && oe);
  } catch {
    return !1;
  }
}
function de(...e) {
  try {
    $t(...e);
  } catch {
  }
}
function ks() {
  return Vi.get();
}
function Yi(e) {
  return Vi.send(e, 5e3);
}
async function Sr(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => lt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Yi({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function xs(e, t, n) {
  const i = await Promise.resolve().then(() => lt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Yi({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function Je(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = K(typeof t == "string" ? t : String(t || ""));
  } catch {
    n = String(t || "");
  }
  if (n) {
    try {
      if (it && it.length) {
        const r = String(n).split("/")[0], a = it.includes(r);
        let s = V.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? K(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = K(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, V.set(e, s);
      } else {
        const i = V.has(e) ? V.get(e) : void 0;
        if (i) {
          let r = null;
          try {
            typeof i == "string" ? r = K(i) : i && typeof i == "object" && (r = i.default ? K(i.default) : null);
          } catch {
            r = null;
          }
          if (!r || r === n)
            V.set(e, n);
          else
            try {
              const a = /* @__PURE__ */ new Set();
              for (const l of V.keys()) a.add(l);
              const s = typeof Ht == "function" ? Ht(e, a) : `${e}-2`;
              V.set(s, n), e = s;
            } catch {
            }
        } else
          V.set(e, n);
      }
    } catch {
    }
    try {
      if (n) {
        try {
          H.set(n, e);
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
                Array.isArray(Oe) && !Oe.includes(n) && Oe.push(n);
              } catch {
              }
            }
          } else
            try {
              Array.isArray(Oe) && !Oe.includes(n) && Oe.push(n);
            } catch {
            }
        } catch {
        }
      }
    } catch {
    }
  }
}
const er = /* @__PURE__ */ new Set();
function Ss(e) {
  typeof e == "function" && er.add(e);
}
function vs(e) {
  typeof e == "function" && er.delete(e);
}
const H = /* @__PURE__ */ new Map();
let vr = {}, Oe = [];
const Pe = /* @__PURE__ */ new Set();
let oe = "_404.md", gt = null;
const Br = "_home";
function Ji(e) {
  if (e == null) {
    oe = null;
    return;
  }
  oe = String(e || "");
}
function ea(e) {
  if (e == null) {
    gt = null;
    return;
  }
  gt = String(e || "");
}
function As(e) {
  vr = e || {};
}
function ta(e) {
  try {
    if (Array.isArray(te) || (te = []), !Array.isArray(e)) return;
    try {
      Array.isArray(te) || (te = []), te.length = 0;
      for (const t of e) te.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = te;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      de("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        te = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const hn = /* @__PURE__ */ new Map(), Xn = /* @__PURE__ */ new Set();
function Es() {
  hn.clear(), Xn.clear();
}
function Ms(e) {
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
const ue = en(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function qr(e) {
  V.clear(), H.clear(), Oe = [];
  try {
    Pe.clear();
  } catch {
  }
  it = it || [];
  const t = Object.keys(vr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), de("[slugManager] parse contentBase failed", i);
      }
      n = Ut(n);
    }
  } catch (i) {
    n = "", de("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Ms(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = K(i.slice(n.length)) : r = K(i), Oe.push(r);
    try {
      Pe.add(r);
    } catch {
    }
    try {
      Dt();
    } catch (s) {
      de("[slugManager] refreshIndexPaths failed", s);
    }
    const a = vr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ue(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!it || !it.length) && (o = Ht(o, new Set(V.keys()))), it && it.length) {
              const c = r.split("/")[0], d = it.includes(c);
              let f = V.get(o);
              (!f || typeof f == "string") && (f = { default: typeof f == "string" ? f : void 0, langs: {} }), d ? f.langs[c] = r : f.default = r, V.set(o, f);
            } else
              V.set(o, r);
            H.set(r, o);
          } catch (o) {
            de("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  qr();
} catch (e) {
  de("[slugManager] initial setContentBase failed", e);
}
function Ht(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Ls(e) {
  return Ln(e, void 0);
}
function Ln(e, t) {
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
function Hn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function Jt(e) {
  if (!e || !V.has(e)) return null;
  const t = V.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (it && it.length && zt && t.langs && t.langs[zt])
    return t.langs[zt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Xt = /* @__PURE__ */ new Map();
function Ts() {
  Xt.clear(), dn.clear();
}
const dn = /* @__PURE__ */ new Map();
let na = 60 * 1e3;
function Cs(e) {
  na = Number(e) || 0;
}
let Me = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const o = nt(e);
        o && o.page && (e = o.page);
      } catch {
      }
  } catch {
  }
  try {
    const o = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (o && V.has(o)) {
      const u = Jt(o) || V.get(o);
      u && u !== e && (e = u);
    }
  } catch (o) {
    de("[slugManager] slug mapping normalization failed", o);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const o = String(e).split("::", 1)[0];
      if (o)
        try {
          if (V.has(o)) {
            const u = Jt(o) || V.get(o);
            u ? e = u : e = o;
          } else
            e = o;
        } catch {
          e = o;
        }
    }
  } catch (o) {
    de("[slugManager] path sanitize failed", o);
  }
  if (!(n && n.force === !0 || typeof oe == "string" && oe || V && V.size || Pe && Pe.size || Ir()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : Yt(String(t));
  let a = "";
  try {
    const o = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (r && r.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(r)) {
      const u = r.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
      a = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + u;
    } else {
      let u = o + "/";
      r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? u = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? u = o + r.replace(/\/$/, "") + "/" : u = o + "/" + r.replace(/\/$/, "") + "/"), a = new URL(e.replace(/^\//, ""), u).toString();
    }
  } catch {
    a = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  try {
    const o = dn.get(a);
    if (o && o > Date.now())
      return Promise.reject(new Error("failed to fetch md"));
    o && dn.delete(a);
  } catch {
  }
  if (Xt.has(a))
    return Xt.get(a);
  const l = (async () => {
    const o = await fetch(a);
    if (!o || typeof o.ok != "boolean" || !o.ok) {
      if (o && o.status === 404 && typeof oe == "string" && oe)
        try {
          const p = `${r}/${oe}`, h = await globalThis.fetch(p);
          if (h && typeof h.ok == "boolean" && h.ok)
            return { raw: await h.text(), status: 404 };
        } catch (p) {
          de("[slugManager] fetching fallback 404 failed", p);
        }
      let g = "";
      try {
        o && typeof o.clone == "function" ? g = await o.clone().text() : o && typeof o.text == "function" ? g = await o.text() : g = "";
      } catch (p) {
        g = "", de("[slugManager] reading error body failed", p);
      }
      try {
        const p = o ? o.status : void 0;
        if (p === 404)
          try {
            _("fetchMarkdown failed (404):", () => ({ url: a, status: p, statusText: o ? o.statusText : void 0, body: g.slice(0, 200) }));
          } catch {
          }
        else
          try {
            Zn("fetchMarkdown failed:", () => ({ url: a, status: p, statusText: o ? o.statusText : void 0, body: g.slice(0, 200) }));
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const u = await o.text(), c = u.trim().slice(0, 128).toLowerCase(), d = /^(?:<!doctype|<html|<title|<h1)/.test(c), f = d || String(e || "").toLowerCase().endsWith(".html");
    if (d && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof oe == "string" && oe) {
          const g = `${r}/${oe}`, p = await globalThis.fetch(g);
          if (p.ok)
            return { raw: await p.text(), status: 404 };
        }
      } catch (g) {
        de("[slugManager] fetching fallback 404 failed", g);
      }
      throw _s() && Zn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return f ? { raw: u, isHtml: !0 } : { raw: u };
  })().catch((o) => {
    try {
      dn.set(a, Date.now() + na);
    } catch {
    }
    try {
      Xt.delete(a);
    } catch {
    }
    throw o;
  });
  return Xt.set(a, l), l;
};
function Rs(e) {
  typeof e == "function" && (Me = e);
}
const Un = /* @__PURE__ */ new Map();
function Ps(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let te = [];
function $s() {
  return te;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return te;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = te;
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
          return Ar;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Ar;
      } catch {
      }
    }
} catch {
}
let Ct = null;
async function qt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => K(String(a || ""))))) : [];
  try {
    const a = K(String(oe || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (te && te.length && t === 1 && !te.some((s) => {
    try {
      return r.includes(K(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return te;
  if (Ct) return Ct;
  Ct = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((h) => K(String(h || ""))))) : [];
    try {
      const h = K(String(oe || ""));
      h && !a.includes(h) && a.push(h);
    } catch {
    }
    const s = (h) => {
      if (!a || !a.length) return !1;
      for (const b of a)
        if (b && (h === b || h.startsWith(b + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const h of i)
          try {
            const b = K(String(h || ""));
            b && l.push(b);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Oe) && Oe.length && (l = Array.from(Oe)), !l.length) {
      if (H && typeof H.size == "number" && H.size)
        try {
          l = Array.from(H.keys());
        } catch {
          l = [];
        }
      else
        for (const h of V.values())
          if (h) {
            if (typeof h == "string")
              l.push(h);
            else if (h && typeof h == "object") {
              h.default && l.push(h.default);
              const b = h.langs || {};
              for (const m of Object.keys(b || {}))
                try {
                  b[m] && l.push(b[m]);
                } catch {
                }
            }
          }
    }
    try {
      const h = await oa(e);
      h && h.length && (l = l.concat(h));
    } catch (h) {
      de("[slugManager] crawlAllMarkdown during buildSearchIndex failed", h);
    }
    try {
      const h = new Set(l), b = [...l], m = Math.max(1, Sn), w = async () => {
        for (; !(h.size > Tn); ) {
          const k = b.shift();
          if (!k) break;
          try {
            const S = await Me(k, e);
            if (S && S.raw) {
              if (S.status === 404) continue;
              let v = S.raw;
              const R = [], Z = String(k || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(Z) && Nr && (!k || !k.includes("/")))
                continue;
              const $ = Ps(v), ee = /\[[^\]]+\]\(([^)]+)\)/g;
              let z;
              for (; z = ee.exec($); )
                R.push(z[1]);
              const D = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; z = D.exec($); )
                R.push(z[1]);
              const ne = k && k.includes("/") ? k.substring(0, k.lastIndexOf("/") + 1) : "";
              for (let j of R)
                try {
                  if (Ln(j, e) || j.startsWith("..") || j.indexOf("/../") !== -1 || (ne && !j.startsWith("./") && !j.startsWith("/") && !j.startsWith("../") && (j = ne + j), j = K(j), !/\.(md|html?)(?:$|[?#])/i.test(j)) || (j = j.split(/[?#]/)[0], s(j))) continue;
                  h.has(j) || (h.add(j), b.push(j), l.push(j));
                } catch (re) {
                  de("[slugManager] href processing failed", j, re);
                }
            }
          } catch (S) {
            de("[slugManager] discovery fetch failed for", k, S);
          }
        }
      }, y = [];
      for (let k = 0; k < m; k++) y.push(w());
      await Promise.all(y);
    } catch (h) {
      de("[slugManager] discovery loop failed", h);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((h) => !h || o.has(h) || s(h) ? !1 : (o.add(h), !0));
    const u = [], c = /* @__PURE__ */ new Map(), d = l.filter((h) => /\.(?:md|html?)(?:$|[?#])/i.test(h)), f = Math.max(1, Math.min(Sn, d.length || 1)), g = d.slice(), p = [];
    for (let h = 0; h < f; h++)
      p.push((async () => {
        for (; g.length; ) {
          const b = g.shift();
          if (!b) break;
          try {
            const m = await Me(b, e);
            c.set(b, m);
          } catch (m) {
            de("[slugManager] buildSearchIndex: entry fetch failed", b, m), c.set(b, null);
          }
        }
      })());
    await Promise.all(p);
    for (const h of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(h))
        try {
          const b = c.get(h);
          if (!b || !b.raw || b.status === 404) continue;
          let m = "", w = "", y = null;
          if (b.isHtml)
            try {
              const v = new DOMParser().parseFromString(b.raw, "text/html"), R = v.querySelector("title") || v.querySelector("h1");
              R && R.textContent && (m = R.textContent.trim());
              const Z = v.querySelector("p");
              if (Z && Z.textContent && (w = Z.textContent.trim()), t >= 2)
                try {
                  const $ = v.querySelector("h1"), ee = $ && $.textContent ? $.textContent.trim() : m || "";
                  try {
                    const D = H && typeof H.has == "function" && H.has(h) ? H.get(h) : null;
                    if (D)
                      y = D;
                    else {
                      let ne = ue(m || h);
                      const j = /* @__PURE__ */ new Set();
                      try {
                        for (const A of V.keys()) j.add(A);
                      } catch {
                      }
                      try {
                        for (const A of u)
                          A && A.slug && j.add(String(A.slug).split("::")[0]);
                      } catch {
                      }
                      let re = !1;
                      try {
                        if (V.has(ne)) {
                          const A = V.get(ne);
                          if (typeof A == "string")
                            A === h && (re = !0);
                          else if (A && typeof A == "object") {
                            A.default === h && (re = !0);
                            for (const G of Object.keys(A.langs || {}))
                              if (A.langs[G] === h) {
                                re = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !re && j.has(ne) && (ne = Ht(ne, j)), y = ne;
                      try {
                        H.has(h) || Je(y, h);
                      } catch {
                      }
                    }
                  } catch (D) {
                    de("[slugManager] derive pageSlug failed", D);
                  }
                  const z = Array.from(v.querySelectorAll("h2"));
                  for (const D of z)
                    try {
                      const ne = (D.textContent || "").trim();
                      if (!ne) continue;
                      const j = D.id ? D.id : ue(ne), re = y ? `${y}::${j}` : `${ue(h)}::${j}`;
                      let A = "", G = D.nextElementSibling;
                      for (; G && G.tagName && G.tagName.toLowerCase() === "script"; ) G = G.nextElementSibling;
                      G && G.textContent && (A = String(G.textContent).trim()), u.push({ slug: re, title: ne, excerpt: A, path: h, parentTitle: ee });
                    } catch (ne) {
                      de("[slugManager] indexing H2 failed", ne);
                    }
                  if (t === 3)
                    try {
                      const D = Array.from(v.querySelectorAll("h3"));
                      for (const ne of D)
                        try {
                          const j = (ne.textContent || "").trim();
                          if (!j) continue;
                          const re = ne.id ? ne.id : ue(j), A = y ? `${y}::${re}` : `${ue(h)}::${re}`;
                          let G = "", ie = ne.nextElementSibling;
                          for (; ie && ie.tagName && ie.tagName.toLowerCase() === "script"; ) ie = ie.nextElementSibling;
                          ie && ie.textContent && (G = String(ie.textContent).trim()), u.push({ slug: A, title: j, excerpt: G, path: h, parentTitle: ee });
                        } catch (j) {
                          de("[slugManager] indexing H3 failed", j);
                        }
                    } catch (D) {
                      de("[slugManager] collect H3s failed", D);
                    }
                } catch ($) {
                  de("[slugManager] collect H2s failed", $);
                }
            } catch (S) {
              de("[slugManager] parsing HTML for index failed", S);
            }
          else {
            const S = b.raw, v = S.match(/^#\s+(.+)$/m);
            m = v ? v[1].trim() : "";
            try {
              m = Hn(m);
            } catch {
            }
            const R = S.split(/\r?\n\s*\r?\n/);
            if (R.length > 1)
              for (let Z = 1; Z < R.length; Z++) {
                const $ = R[Z].trim();
                if ($ && !/^#/.test($)) {
                  w = $.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let Z = "";
              try {
                const $ = (S.match(/^#\s+(.+)$/m) || [])[1];
                Z = $ ? $.trim() : "";
                try {
                  const D = H && typeof H.has == "function" && H.has(h) ? H.get(h) : null;
                  if (D)
                    y = D;
                  else {
                    let ne = ue(m || h);
                    const j = /* @__PURE__ */ new Set();
                    try {
                      for (const A of V.keys()) j.add(A);
                    } catch {
                    }
                    try {
                      for (const A of u)
                        A && A.slug && j.add(String(A.slug).split("::")[0]);
                    } catch {
                    }
                    let re = !1;
                    try {
                      if (V.has(ne)) {
                        const A = V.get(ne);
                        if (typeof A == "string")
                          A === h && (re = !0);
                        else if (A && typeof A == "object") {
                          A.default === h && (re = !0);
                          for (const G of Object.keys(A.langs || {}))
                            if (A.langs[G] === h) {
                              re = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !re && j.has(ne) && (ne = Ht(ne, j)), y = ne;
                    try {
                      H.has(h) || Je(y, h);
                    } catch {
                    }
                  }
                } catch (D) {
                  de("[slugManager] derive pageSlug failed", D);
                }
                const ee = /^##\s+(.+)$/gm;
                let z;
                for (; z = ee.exec(S); )
                  try {
                    const D = (z[1] || "").trim(), ne = Hn(D);
                    if (!D) continue;
                    const j = ue(D), re = y ? `${y}::${j}` : `${ue(h)}::${j}`, G = S.slice(ee.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), ie = G && G[1] ? String(G[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    u.push({ slug: re, title: ne, excerpt: ie, path: h, parentTitle: Z });
                  } catch (D) {
                    de("[slugManager] indexing markdown H2 failed", D);
                  }
              } catch ($) {
                de("[slugManager] collect markdown H2s failed", $);
              }
              if (t === 3)
                try {
                  const $ = /^###\s+(.+)$/gm;
                  let ee;
                  for (; ee = $.exec(S); )
                    try {
                      const z = (ee[1] || "").trim(), D = Hn(z);
                      if (!z) continue;
                      const ne = ue(z), j = y ? `${y}::${ne}` : `${ue(h)}::${ne}`, A = S.slice($.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), G = A && A[1] ? String(A[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      u.push({ slug: j, title: D, excerpt: G, path: h, parentTitle: Z });
                    } catch (z) {
                      de("[slugManager] indexing markdown H3 failed", z);
                    }
                } catch ($) {
                  de("[slugManager] collect markdown H3s failed", $);
                }
            }
          }
          let k = "";
          try {
            H.has(h) && (k = H.get(h));
          } catch (S) {
            de("[slugManager] mdToSlug access failed", S);
          }
          if (!k) {
            try {
              if (!y) {
                const S = H && typeof H.has == "function" && H.has(h) ? H.get(h) : null;
                if (S)
                  y = S;
                else {
                  let v = ue(m || h);
                  const R = /* @__PURE__ */ new Set();
                  try {
                    for (const $ of V.keys()) R.add($);
                  } catch {
                  }
                  try {
                    for (const $ of u)
                      $ && $.slug && R.add(String($.slug).split("::")[0]);
                  } catch {
                  }
                  let Z = !1;
                  try {
                    if (V.has(v)) {
                      const $ = V.get(v);
                      if (typeof $ == "string")
                        $ === h && (Z = !0);
                      else if ($ && typeof $ == "object") {
                        $.default === h && (Z = !0);
                        for (const ee of Object.keys($.langs || {}))
                          if ($.langs[ee] === h) {
                            Z = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !Z && R.has(v) && (v = Ht(v, R)), y = v;
                  try {
                    H.has(h) || Je(y, h);
                  } catch {
                  }
                }
              }
            } catch (S) {
              de("[slugManager] derive pageSlug failed", S);
            }
            k = y || ue(m || h);
          }
          u.push({ slug: k, title: m, excerpt: w, path: h });
        } catch (b) {
          de("[slugManager] buildSearchIndex: entry processing failed", b);
        }
    try {
      const h = u.filter((b) => {
        try {
          return !s(String(b.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(te) || (te = []), te.length = 0;
        for (const b of h) te.push(b);
      } catch {
        try {
          te = Array.from(h);
        } catch {
          te = h;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = te;
          } catch {
          }
          try {
            const b = [], m = /* @__PURE__ */ new Set();
            for (const w of te)
              try {
                if (!w || !w.slug) continue;
                const y = String(w.slug).split("::")[0];
                if (m.has(y)) continue;
                m.add(y);
                const k = { slug: y };
                w.title ? k.title = String(w.title) : w.parentTitle && (k.title = String(w.parentTitle)), w.path && (k.path = String(w.path)), b.push(k);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: b };
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
        Array.isArray(te) || (te = []), te.length = 0;
        for (const b of u) te.push(b);
      } catch {
        try {
          te = Array.from(u);
        } catch {
          te = u;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = te;
          } catch {
          }
      } catch {
      }
    }
    return te;
  })();
  try {
    await Ct;
  } catch (a) {
    de("[slugManager] awaiting _indexPromise failed", a);
  }
  return Ct = null, te;
}
async function Pt(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(te) && te.length && !Ct && !s) return te;
    if (Ct) {
      try {
        await Ct;
      } catch {
      }
      return te;
    }
    if (s) {
      try {
        if (typeof Sr == "function")
          try {
            const o = await Sr(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                ta(o);
              } catch {
              }
              return te;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await qt(n, i, r, a), te;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(te) && te.length) return te;
      await new Promise((o) => setTimeout(o, 150));
    }
    return te;
  } catch {
    return te;
  }
}
async function Ar(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Pt(t);
    } catch {
      return te;
    }
  } catch {
    return te;
  }
}
const ra = 1e3;
let Tn = ra;
function zs(e) {
  typeof e == "number" && e >= 0 && (Tn = e);
}
const ia = new DOMParser(), aa = "a[href]";
let sa = async function(e, t, n = Tn) {
  if (Un.has(e)) return Un.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? l = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? l = s + String(t).replace(/\/$/, "") + "/" : l = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  const o = Math.max(1, Math.min(Sn, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const u = a.splice(0, o);
    await Promise.all(u.map(async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let d = "";
      try {
        d = new URL(c || "", l).toString();
      } catch {
        d = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let f;
        try {
          f = await globalThis.fetch(d);
        } catch (m) {
          de("[slugManager] crawlForSlug: fetch failed", { url: d, error: m });
          return;
        }
        if (!f || !f.ok) {
          f && !f.ok && de("[slugManager] crawlForSlug: directory fetch non-ok", { url: d, status: f.status });
          return;
        }
        const g = await f.text(), h = ia.parseFromString(g, "text/html").querySelectorAll(aa), b = d;
        for (const m of h)
          try {
            if (i) break;
            let w = m.getAttribute("href") || "";
            if (!w || Ln(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const y = new URL(w, b), k = new URL(l).pathname, S = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, ""), v = Ut(K(S));
                r.has(v) || a.push(v);
              } catch {
                const k = K(c + w);
                r.has(k) || a.push(k);
              }
              continue;
            }
            if (w.toLowerCase().endsWith(".md")) {
              let y = "";
              try {
                const k = new URL(w, b), S = new URL(l).pathname;
                y = k.pathname.startsWith(S) ? k.pathname.slice(S.length) : k.pathname.replace(/^\//, "");
              } catch {
                y = (c + w).replace(/^\//, "");
              }
              y = K(y);
              try {
                if (H.has(y))
                  continue;
                for (const k of V.values())
                  ;
              } catch (k) {
                de("[slugManager] slug map access failed", k);
              }
              try {
                const k = await Me(y, t);
                if (k && k.raw) {
                  const S = (k.raw || "").match(/^#\s+(.+)$/m);
                  if (S && S[1] && ue(S[1].trim()) === e) {
                    i = y;
                    break;
                  }
                }
              } catch (k) {
                de("[slugManager] crawlForSlug: fetchMarkdown failed", k);
              }
            }
          } catch (w) {
            de("[slugManager] crawlForSlug: link iteration failed", w);
          }
      } catch (f) {
        de("[slugManager] crawlForSlug: directory fetch failed", f);
      }
    }));
  }
  return Un.set(e, i), i;
};
async function oa(e, t = Tn) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const l = Math.max(1, Math.min(Sn, 6));
  for (; r.length && !(r.length > t); ) {
    const o = r.splice(0, l);
    await Promise.all(o.map(async (u) => {
      if (u == null || i.has(u)) return;
      i.add(u);
      let c = "";
      try {
        c = new URL(u || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(u || "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(c);
        } catch (b) {
          de("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: b });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && de("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: d.status });
          return;
        }
        const f = await d.text(), p = ia.parseFromString(f, "text/html").querySelectorAll(aa), h = c;
        for (const b of p)
          try {
            let m = b.getAttribute("href") || "";
            if (!m || Ln(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
            if (m.endsWith("/")) {
              try {
                const y = new URL(m, h), k = new URL(s).pathname, S = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, ""), v = Ut(K(S));
                i.has(v) || r.push(v);
              } catch {
                const k = u + m;
                i.has(k) || r.push(k);
              }
              continue;
            }
            let w = "";
            try {
              const y = new URL(m, h), k = new URL(s).pathname;
              w = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, "");
            } catch {
              w = (u + m).replace(/^\//, "");
            }
            w = K(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (m) {
            de("[slugManager] crawlAllMarkdown: link iteration failed", m);
          }
      } catch (d) {
        de("[slugManager] crawlAllMarkdown: directory fetch failed", d);
      }
    }));
  }
  return Array.from(n);
}
async function la(e, t, n) {
  if (e && typeof e == "string" && (e = K(e), e = Yt(e)), V.has(e))
    return Jt(e) || V.get(e);
  try {
    if (!(typeof oe == "string" && oe || V.has(e) || Pe && Pe.size || Dt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of er)
    try {
      const a = await r(e, t);
      if (a)
        return Je(e, a), a;
    } catch (a) {
      de("[slugManager] slug resolver failed", a);
    }
  if (Pe && Pe.size) {
    if (hn.has(e)) {
      const r = hn.get(e);
      return Je(e, r), r;
    }
    for (const r of Oe)
      if (!Xn.has(r))
        try {
          const a = await Me(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ue(s[1].trim());
              if (Xn.add(r), l && hn.set(l, r), l === e)
                return Je(e, r), r;
            }
          }
        } catch (a) {
          de("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await qt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return Je(e, a.path), a.path;
    }
  } catch (r) {
    de("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await sa(e, t, n);
    if (r)
      return Je(e, r), r;
  } catch (r) {
    de("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Me(r, t);
      if (a && a.raw)
        return Je(e, r), r;
    } catch (a) {
      de("[slugManager] candidate fetch failed", a);
    }
  if (Pe && Pe.size)
    for (const r of Oe)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ue(a) === e)
          return Je(e, r), r;
      } catch (a) {
        de("[slugManager] build-time filename match failed", a);
      }
  try {
    if (gt && typeof gt == "string" && gt.trim())
      try {
        const r = await Me(gt, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && ue(a[1].trim()) === e)
            return Je(e, gt), gt;
        }
      } catch (r) {
        de("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    de("[slugManager] home page fetch failed", r);
  }
  return null;
}
const lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ra,
  HOME_SLUG: Br,
  _setAllMd: As,
  _setSearchIndex: ta,
  _storeSlugMapping: Je,
  addSlugResolver: Ss,
  get allMarkdownPaths() {
    return Oe;
  },
  allMarkdownPathsSet: Pe,
  get availableLanguages() {
    return it;
  },
  awaitSearchIndex: Ar,
  buildSearchIndex: qt,
  buildSearchIndexWorker: Sr,
  clearFetchCache: Ts,
  clearListCaches: Es,
  crawlAllMarkdown: oa,
  crawlCache: Un,
  crawlForSlug: sa,
  crawlForSlugWorker: xs,
  get defaultCrawlMaxQueue() {
    return Tn;
  },
  ensureSlug: la,
  fetchCache: Xt,
  get fetchMarkdown() {
    return Me;
  },
  getLanguages: ws,
  getSearchIndex: $s,
  get homePage() {
    return gt;
  },
  initSlugWorker: ks,
  isExternalLink: Ls,
  isExternalLinkWithBase: Ln,
  listPathsFetched: Xn,
  listSlugCache: hn,
  mdToSlug: H,
  negativeFetchCache: dn,
  get notFoundPage() {
    return oe;
  },
  removeSlugResolver: vs,
  resolveSlugPath: Jt,
  get searchIndex() {
    return te;
  },
  setContentBase: qr,
  setDefaultCrawlMaxQueue: zs,
  setFetchMarkdown: Rs,
  setFetchNegativeCacheTTL: Cs,
  setHomePage: ea,
  setLanguages: Ki,
  setNotFoundPage: Ji,
  setSkipRootReadme: bs,
  get skipRootReadme() {
    return Nr;
  },
  slugResolvers: er,
  slugToMd: V,
  slugify: ue,
  unescapeMarkdown: Hn,
  uniqueSlug: Ht,
  whenSearchIndexReady: Pt
}, Symbol.toStringTag, { value: "Module" }));
var gr, _i;
function Is() {
  if (_i) return gr;
  _i = 1;
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
    let l = 0, o = 0, u = a.length - 1;
    const c = s.wordsPerMinute || 200, d = s.wordBound || n;
    for (; d(a[o]); ) o++;
    for (; d(a[u]); ) u--;
    const f = `${a}
`;
    for (let b = o; b <= u; b++)
      if ((t(f[b]) || !d(f[b]) && (d(f[b + 1]) || t(f[b + 1]))) && l++, t(f[b]))
        for (; b <= u && (i(f[b + 1]) || d(f[b + 1])); )
          b++;
    const g = l / c, p = Math.round(g * 60 * 1e3);
    return {
      text: Math.ceil(g.toFixed(2)) + " min read",
      minutes: g,
      time: p,
      words: l
    };
  }
  return gr = r, gr;
}
var Os = Is();
const Ns = /* @__PURE__ */ Hi(Os);
function vn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ca(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    _("[seoManager] upsertLinkRel failed", n);
  }
}
function Bs(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Lt("property", "og:description", a), a && String(a).trim() && Lt("name", "twitter:description", a), Lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Lt("property", "og:image", s), Lt("name", "twitter:image", s));
}
function jr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && vn("description", l), vn("robots", a.robots || "index,follow"), Bs(a, t, n, l);
}
function qs() {
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
function Dr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const p = K(t);
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
    c && ca("canonical", c);
    try {
      Lt("property", "og:url", c);
    } catch (p) {
      _("[seoManager] upsertMeta og:url failed", p);
    }
    const d = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    u && (d.image = String(u)), s.date && (d.datePublished = s.date), s.dateModified && (d.dateModified = s.dateModified);
    const f = "nimbi-jsonld";
    let g = document.getElementById(f);
    g || (g = document.createElement("script"), g.type = "application/ld+json", g.id = f, document.head.appendChild(g)), g.textContent = JSON.stringify(d, null, 2);
  } catch (s) {
    _("[seoManager] setStructuredData failed", s);
  }
}
let fn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function js(e) {
  try {
    if (!e || typeof e != "object") {
      fn = {};
      return;
    }
    fn = Object.assign({}, e);
  } catch (t) {
    _("[seoManager] setSeoMap failed", t);
  }
}
function Ds(e, t = "") {
  try {
    if (!e) return;
    const n = fn && fn[e] ? fn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ca("canonical", i);
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
      n.description && vn("description", String(n.description));
    } catch {
    }
    try {
      try {
        jr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Dr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      _("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    _("[seoManager] injectSeoForPage failed", n);
  }
}
function Fn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      vn("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && vn("description", String(s));
    } catch {
    }
    try {
      jr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Dr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    _("[seoManager] markNotFound failed", r);
  }
}
function Hs(e, t, n, i, r, a, s, l, o, u, c) {
  try {
    if (i && i.querySelector) {
      const d = i.querySelector(".menu-label");
      d && (d.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (d) {
    _("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta && n.meta.title ? String(n.meta.title).trim() : "", f = r.querySelector("img"), g = f && (f.getAttribute("src") || f.src) || null;
    let p = "";
    try {
      let m = "";
      try {
        const w = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (w) {
          let y = w.nextElementSibling;
          const k = [];
          for (; y && !(y.tagName && y.tagName.toLowerCase() === "h2"); ) {
            try {
              if (y.classList && y.classList.contains("nimbi-article-subtitle")) {
                y = y.nextElementSibling;
                continue;
              }
            } catch {
            }
            const S = (y.textContent || "").trim();
            S && k.push(S), y = y.nextElementSibling;
          }
          k.length && (m = k.join(" ").replace(/\s+/g, " ").trim()), !m && o && (m = String(o).trim());
        }
      } catch (w) {
        _("[seoManager] compute descOverride failed", w);
      }
      m && String(m).length > 160 && (m = String(m).slice(0, 157).trim() + "..."), p = m;
    } catch (m) {
      _("[seoManager] compute descOverride failed", m);
    }
    let h = "";
    try {
      d && (h = d);
    } catch {
    }
    if (!h)
      try {
        l && l.textContent && (h = String(l.textContent).trim());
      } catch {
      }
    if (!h)
      try {
        const m = r.querySelector("h2");
        m && m.textContent && (h = String(m.textContent).trim());
      } catch {
      }
    h || (h = a || "");
    try {
      jr(n, h || void 0, g, p);
    } catch (m) {
      _("[seoManager] setMetaTags failed", m);
    }
    try {
      Dr(n, u, h || void 0, g, p, t);
    } catch (m) {
      _("[seoManager] setStructuredData failed", m);
    }
    const b = qs();
    h ? b ? document.title = `${b} - ${h}` : document.title = `${t || "Site"} - ${h}` : d ? document.title = d : document.title = t || document.title;
  } catch (d) {
    _("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      const d = r.querySelectorAll(".nimbi-reading-time");
      d && d.forEach((f) => f.remove());
    } catch {
    }
    if (o) {
      const d = Ns(c.raw || ""), f = d && typeof d.minutes == "number" ? Math.ceil(d.minutes) : 0, g = f ? e("readingTime", { minutes: f }) : "";
      if (!g) return;
      const p = r.querySelector("h1");
      if (p) {
        const h = r.querySelector(".nimbi-article-subtitle");
        try {
          if (h) {
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = g, h.appendChild(b);
          } else {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = g, b.appendChild(m);
            try {
              p.parentElement.insertBefore(b, p.nextSibling);
            } catch {
              try {
                p.insertAdjacentElement("afterend", b);
              } catch {
              }
            }
          }
        } catch {
          try {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = g, m.appendChild(w), p.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    _("[seoManager] reading time update failed", d);
  }
}
let ua = 100;
function ki(e) {
  ua = e;
}
function ot() {
  try {
    if (Zt(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let pn = 300 * 1e3;
function xi(e) {
  pn = e;
}
const ft = /* @__PURE__ */ new Map();
function Us(e) {
  if (!ft.has(e)) return;
  const t = ft.get(e), n = Date.now();
  if (t.ts + pn < n) {
    ft.delete(e);
    return;
  }
  return ft.delete(e), ft.set(e, t), t.value;
}
function Fs(e, t) {
  if (Si(), Si(), ft.delete(e), ft.set(e, { value: t, ts: Date.now() }), ft.size > ua) {
    const n = ft.keys().next().value;
    n !== void 0 && ft.delete(n);
  }
}
function Si() {
  if (!pn || pn <= 0) return;
  const e = Date.now();
  for (const [t, n] of ft.entries())
    n.ts + pn < e && ft.delete(t);
}
async function Ws(e, t) {
  const n = new Set(tt), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const d = nt(a);
          if (d) {
            if (d.type === "canonical" && d.page) {
              const f = K(d.page);
              if (f) {
                n.add(f);
                continue;
              }
            }
            if (d.type === "cosmetic" && d.page) {
              const f = d.page;
              if (V.has(f)) {
                const g = V.get(f);
                if (g) return g;
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
          let d = K(l[1]);
          d && n.add(d);
          continue;
        }
        const o = (r.textContent || "").trim(), u = (s.pathname || "").replace(/^.*\//, "");
        if (o && ue(o) === e || u && ue(u.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let d = s.pathname.replace(/^\//, "");
          n.add(d);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const d = new URL(t), f = Ut(d.pathname);
          if (c.indexOf(f) !== -1) {
            let g = c.startsWith(f) ? c.slice(f.length) : c;
            g = K(g), g && n.add(g);
          }
        }
      } catch (s) {
        _("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Me(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && ue(l) === e)
          return r;
      }
    } catch (a) {
      _("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function Zs(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (V.has(n)) {
        const i = Jt(n) || V.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (tt && tt.size)
          for (const i of tt) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ue(r) === n && !/index\.html$/i.test(i)) {
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
async function Gs(e, t) {
  const n = e || "";
  try {
    try {
      ji("fetchPageData");
    } catch {
    }
    try {
      Di("fetchPageData");
    } catch {
    }
  } catch {
  }
  let i = null;
  try {
    const m = nt(typeof location < "u" ? location.href : "");
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
  const o = `${e}|||${typeof hs < "u" && zt ? zt : ""}`, u = Us(o);
  if (u)
    r = u.resolved, a = u.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let m = decodeURIComponent(String(r || ""));
      if (m && typeof m == "string" && (m = K(m), m = Yt(m)), V.has(m))
        r = Jt(m) || V.get(m);
      else {
        let w = await Ws(m, t);
        if (w)
          r = w;
        else if (Dt._refreshed && tt && tt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const y = await la(m, t);
          y && (r = y);
        }
      }
    }
    Fs(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || V.has(r) || tt && tt.size || Dt._refreshed || s || m;
  } catch {
    c = !0;
  }
  !a && i && (a = i);
  try {
    if (c && r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const m = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const w = await fetch(m);
        if (w && w.ok) {
          const y = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", S = (y || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let Z = m;
                try {
                  Z = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  Z = String(m || "").replace(/^\//, "");
                }
                const $ = Z.replace(/\.html$/i, ".md");
                try {
                  const ee = await Me($, t);
                  if (ee && ee.raw)
                    return { data: ee, pagePath: $, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ee = await Me(oe, t);
                    if (ee && ee.raw) {
                      try {
                        Fn(ee.meta || {}, oe);
                      } catch {
                      }
                      return { data: ee, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  b = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let Z = m;
                try {
                  Z = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  Z = String(m || "").replace(/^\//, "");
                }
                const $ = Z.replace(/\.html$/i, ".md");
                try {
                  const ee = await Me($, t);
                  if (ee && ee.raw)
                    return { data: ee, pagePath: $, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ee = await Me(oe, t);
                    if (ee && ee.raw) {
                      try {
                        Fn(ee.meta || {}, oe);
                      } catch {
                      }
                      return { data: ee, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  b = new Error("site shell detected (absolute fetch)");
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
  const d = Zs(r);
  try {
    if (ot())
      try {
        $t("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: d });
      } catch {
      }
  } catch {
  }
  const f = String(n || "").includes(".md") || String(n || "").includes(".html");
  let g = null;
  if (!f)
    try {
      let m = decodeURIComponent(String(n || ""));
      m = K(m), m = Yt(m), m && !/\.(md|html?)$/i.test(m) && (g = m);
    } catch {
      g = null;
    }
  if (f && d.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && d.push(r), d.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && d.push(r), d.length === 1 && /index\.html$/i.test(d[0]) && !f && !V.has(r) && !V.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let p = null, h = null, b = null;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || V.has(r) || tt && tt.size || Dt._refreshed || f || m;
  } catch {
    c = !0;
  }
  if (!c)
    b = new Error("no page data");
  else
    for (const m of d)
      if (m)
        try {
          const w = K(m);
          if (p = await Me(w, t), h = w, g && !V.has(g))
            try {
              let y = "";
              if (p && p.isHtml)
                try {
                  const k = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (k) {
                    const S = k.parseFromString(p.raw || "", "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (y = v.textContent.trim());
                  }
                } catch {
                }
              else {
                const k = (p && p.raw || "").match(/^#\s+(.+)$/m);
                k && k[1] && (y = k[1].trim());
              }
              if (y && ue(y) !== g)
                try {
                  if (/\.html$/i.test(w)) {
                    const S = w.replace(/\.html$/i, ".md");
                    if (d.includes(S))
                      try {
                        const v = await Me(S, t);
                        if (v && v.raw)
                          p = v, h = S;
                        else if (typeof oe == "string" && oe)
                          try {
                            const R = await Me(oe, t);
                            if (R && R.raw)
                              p = R, h = oe;
                            else {
                              p = null, h = null, b = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            p = null, h = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          p = null, h = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const R = await Me(oe, t);
                          if (R && R.raw)
                            p = R, h = oe;
                          else {
                            p = null, h = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          p = null, h = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      p = null, h = null, b = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    p = null, h = null, b = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  p = null, h = null, b = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!f && /\.html$/i.test(w)) {
              const y = w.replace(/\.html$/i, ".md");
              if (d.includes(y))
                try {
                  const S = String(p && p.raw || "").trim().slice(0, 128).toLowerCase();
                  if (p && p.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let R = !1;
                    try {
                      const Z = await Me(y, t);
                      if (Z && Z.raw)
                        p = Z, h = y, R = !0;
                      else if (typeof oe == "string" && oe)
                        try {
                          const $ = await Me(oe, t);
                          $ && $.raw && (p = $, h = oe, R = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const $ = await Me(oe, t);
                        $ && $.raw && (p = $, h = oe, R = !0);
                      } catch {
                      }
                    }
                    if (!R) {
                      p = null, h = null, b = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (ot())
              try {
                $t("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: h, isHtml: p && p.isHtml, snippet: p && p.raw ? String(p.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          b = w;
          try {
            ot() && _("[router] candidate fetch failed", { candidate: m, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!p) {
    const m = b && (b.message || String(b)) || null, w = m && /failed to fetch md|site shell detected/i.test(m);
    try {
      if (ot())
        try {
          $t("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: d, fetchError: m });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (ot())
          try {
            _("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: d, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (ot())
          try {
            Zn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: d, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    if (typeof oe == "string" && oe)
      try {
        const y = await Me(oe, t);
        if (y && y.raw) {
          try {
            Fn(y.meta || {}, oe);
          } catch {
          }
          return { data: y, pagePath: oe, anchor: a };
        }
      } catch {
      }
    try {
      if (f && String(n || "").toLowerCase().includes(".html"))
        try {
          const y = new URL(String(n || ""), location.href).toString();
          ot() && _("[router] attempting absolute HTML fetch fallback", y);
          const k = await fetch(y);
          if (k && k.ok) {
            const S = await k.text(), v = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", R = (S || "").toLowerCase(), Z = v && v.indexOf && v.indexOf("text/html") !== -1 || R.indexOf("<!doctype") !== -1 || R.indexOf("<html") !== -1;
            if (!Z && ot())
              try {
                _("[router] absolute fetch returned non-HTML", () => ({ abs: y, contentType: v, snippet: R.slice(0, 200) }));
              } catch {
              }
            if (Z) {
              const $ = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || $.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  ot() && _("[router] absolute fetch returned directory listing; treating as not found", { abs: y });
                } catch {
                }
              else
                try {
                  const z = y, D = new URL(".", z).toString();
                  try {
                    const j = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (j) {
                      const re = j.parseFromString(S || "", "text/html"), A = (Y, ge) => {
                        try {
                          const Se = ge.getAttribute(Y) || "";
                          if (!Se || /^(https?:)?\/\//i.test(Se) || Se.startsWith("/") || Se.startsWith("#")) return;
                          try {
                            const $e = new URL(Se, z).toString();
                            ge.setAttribute(Y, $e);
                          } catch ($e) {
                            _("[router] rewrite attribute failed", Y, $e);
                          }
                        } catch (Se) {
                          _("[router] rewrite helper failed", Se);
                        }
                      }, G = re.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), ie = [];
                      for (const Y of Array.from(G || []))
                        try {
                          const ge = Y.tagName ? Y.tagName.toLowerCase() : "";
                          if (ge === "a") continue;
                          if (Y.hasAttribute("src")) {
                            const Se = Y.getAttribute("src");
                            A("src", Y);
                            const $e = Y.getAttribute("src");
                            Se !== $e && ie.push({ attr: "src", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("href") && ge === "link") {
                            const Se = Y.getAttribute("href");
                            A("href", Y);
                            const $e = Y.getAttribute("href");
                            Se !== $e && ie.push({ attr: "href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("href") && ge !== "link") {
                            const Se = Y.getAttribute("href");
                            A("href", Y);
                            const $e = Y.getAttribute("href");
                            Se !== $e && ie.push({ attr: "href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("xlink:href")) {
                            const Se = Y.getAttribute("xlink:href");
                            A("xlink:href", Y);
                            const $e = Y.getAttribute("xlink:href");
                            Se !== $e && ie.push({ attr: "xlink:href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("poster")) {
                            const Se = Y.getAttribute("poster");
                            A("poster", Y);
                            const $e = Y.getAttribute("poster");
                            Se !== $e && ie.push({ attr: "poster", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("srcset")) {
                            const Qe = (Y.getAttribute("srcset") || "").split(",").map((ve) => ve.trim()).filter(Boolean).map((ve) => {
                              const [rt, C] = ve.split(/\s+/, 2);
                              if (!rt || /^(https?:)?\/\//i.test(rt) || rt.startsWith("/")) return ve;
                              try {
                                const N = new URL(rt, z).toString();
                                return C ? `${N} ${C}` : N;
                              } catch {
                                return ve;
                              }
                            }).join(", ");
                            Y.setAttribute("srcset", Qe);
                          }
                        } catch {
                        }
                      const Te = re.documentElement && re.documentElement.outerHTML ? re.documentElement.outerHTML : S;
                      try {
                        ot() && ie && ie.length && _("[router] rewritten asset refs", { abs: y, rewritten: ie });
                      } catch {
                      }
                      return { data: { raw: Te, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let ne = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? ne = S.replace(/(<head[^>]*>)/i, `$1<base href="${D}">`) : ne = `<base href="${D}">` + S), { data: { raw: ne, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (y) {
          ot() && _("[router] absolute HTML fetch fallback failed", y);
        }
    } catch {
    }
    try {
      const y = decodeURIComponent(String(r || ""));
      if (y && !/\.(md|html?)$/i.test(y) && typeof oe == "string" && oe && ot()) {
        const S = [
          `/assets/${y}.html`,
          `/assets/${y}/index.html`
        ];
        for (const v of S)
          try {
            const R = await fetch(v, { method: "GET" });
            if (R && R.ok)
              return { data: { raw: await R.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (y) {
      ot() && _("[router] assets fallback failed", y);
    }
    throw new Error("no page data");
  }
  return { data: p, pagePath: h, anchor: a };
}
function tr() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var It = tr();
function ha(e) {
  It = e;
}
var Bt = { exec: () => null };
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(at.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Qs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), at = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Xs = /^(?:[ \t]*(?:\n|$))+/, Ks = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Vs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Cn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ys = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Hr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, da = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, fa = Le(da).replace(/bull/g, Hr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Js = Le(da).replace(/bull/g, Hr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ur = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, eo = /^[^\n]+/, Fr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, to = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Fr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), no = Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Hr).getRegex(), nr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Wr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ro = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Wr).replace("tag", nr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), pa = Le(Ur).replace("hr", Cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nr).getRegex(), io = Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", pa).getRegex(), Zr = { blockquote: io, code: Ks, def: to, fences: Vs, heading: Ys, hr: Cn, html: ro, lheading: fa, list: no, newline: Xs, paragraph: pa, table: Bt, text: eo }, vi = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nr).getRegex(), ao = { ...Zr, lheading: Js, table: vi, paragraph: Le(Ur).replace("hr", Cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", vi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nr).getRegex() }, so = { ...Zr, html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Wr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Bt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Le(Ur).replace("hr", Cn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", fa).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, oo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, lo = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ga = /^( {2,}|\\)\n(?!\s*$)/, co = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, rr = /[\p{P}\p{S}]/u, Gr = /[\s\p{P}\p{S}]/u, ma = /[^\s\p{P}\p{S}]/u, uo = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gr).getRegex(), ya = /(?!~)[\p{P}\p{S}]/u, ho = /(?!~)[\s\p{P}\p{S}]/u, fo = /(?:[^\s\p{P}\p{S}]|~)/u, ba = /(?![*_])[\p{P}\p{S}]/u, po = /(?![*_])[\s\p{P}\p{S}]/u, go = /(?:[^\s\p{P}\p{S}]|[*_])/u, mo = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Qs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), wa = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, yo = Le(wa, "u").replace(/punct/g, rr).getRegex(), bo = Le(wa, "u").replace(/punct/g, ya).getRegex(), _a = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wo = Le(_a, "gu").replace(/notPunctSpace/g, ma).replace(/punctSpace/g, Gr).replace(/punct/g, rr).getRegex(), _o = Le(_a, "gu").replace(/notPunctSpace/g, fo).replace(/punctSpace/g, ho).replace(/punct/g, ya).getRegex(), ko = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ma).replace(/punctSpace/g, Gr).replace(/punct/g, rr).getRegex(), xo = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ba).getRegex(), So = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", vo = Le(So, "gu").replace(/notPunctSpace/g, go).replace(/punctSpace/g, po).replace(/punct/g, ba).getRegex(), Ao = Le(/\\(punct)/, "gu").replace(/punct/g, rr).getRegex(), Eo = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Mo = Le(Wr).replace("(?:-->|$)", "-->").getRegex(), Lo = Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Mo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Kn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, To = Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Kn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ka = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", Kn).replace("ref", Fr).getRegex(), xa = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", Fr).getRegex(), Co = Le("reflink|nolink(?!\\()", "g").replace("reflink", ka).replace("nolink", xa).getRegex(), Ai = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Qr = { _backpedal: Bt, anyPunctuation: Ao, autolink: Eo, blockSkip: mo, br: ga, code: lo, del: Bt, delLDelim: Bt, delRDelim: Bt, emStrongLDelim: yo, emStrongRDelimAst: wo, emStrongRDelimUnd: ko, escape: oo, link: To, nolink: xa, punctuation: uo, reflink: ka, reflinkSearch: Co, tag: Lo, text: co, url: Bt }, Ro = { ...Qr, link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", Kn).getRegex(), reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Kn).getRegex() }, Er = { ...Qr, emStrongRDelimAst: _o, emStrongLDelim: bo, delLDelim: xo, delRDelim: vo, url: Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Ai).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Ai).getRegex() }, Po = { ...Er, br: Le(ga).replace("{2,}", "*").getRegex(), text: Le(Er.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Bn = { normal: Zr, gfm: ao, pedantic: so }, an = { normal: Qr, gfm: Er, breaks: Po, pedantic: Ro }, $o = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ei = (e) => $o[e];
function wt(e, t) {
  if (t) {
    if (at.escapeTest.test(e)) return e.replace(at.escapeReplace, Ei);
  } else if (at.escapeTestNoEncode.test(e)) return e.replace(at.escapeReplaceNoEncode, Ei);
  return e;
}
function Mi(e) {
  try {
    e = encodeURI(e).replace(at.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Li(e, t) {
  let n = e.replace(at.findPipe, (a, s, l) => {
    let o = !1, u = s;
    for (; --u >= 0 && l[u] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(at.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(at.slashPipe, "|");
  return i;
}
function sn(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function zo(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Io(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Ti(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function Oo(e, t, n) {
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
var An = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || It;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : sn(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = Oo(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = sn(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: sn(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = sn(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), s = !0;
        else if (!s) l.push(n[o]);
        else break;
        n = n.slice(o);
        let u = l.join(`
`), c = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, r = r ? `${r}
${c}` : c;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = d, n.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let g = f, p = g.raw + `
` + n.join(`
`), h = this.blockquote(p);
          a[a.length - 1] = h, i = i.substring(0, i.length - g.raw.length) + h.raw, r = r.substring(0, r.length - g.text.length) + h.text;
          break;
        } else if (f?.type === "list") {
          let g = f, p = g.raw + `
` + n.join(`
`), h = this.list(p);
          a[a.length - 1] = h, i = i.substring(0, i.length - f.raw.length) + h.raw, r = r.substring(0, r.length - g.raw.length) + h.raw, n = p.substring(a.at(-1).raw.length).split(`
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
        let o = !1, u = "", c = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        u = t[0], e = e.substring(u.length);
        let d = Io(t[2].split(`
`, 1)[0], t[1].length), f = e.split(`
`, 1)[0], g = !d.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, c = d.trimStart()) : g ? p = t[1].length + 1 : (p = d.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, c = d.slice(p), p += t[1].length), g && this.rules.other.blankLine.test(f) && (u += f + `
`, e = e.substring(f.length + 1), o = !0), !o) {
          let h = this.rules.other.nextBulletRegex(p), b = this.rules.other.hrRegex(p), m = this.rules.other.fencesBeginRegex(p), w = this.rules.other.headingBeginRegex(p), y = this.rules.other.htmlBeginRegex(p), k = this.rules.other.blockquoteBeginRegex(p);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (f = S, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), v = f) : v = f.replace(this.rules.other.tabCharGlobal, "    "), m.test(f) || w.test(f) || y.test(f) || k.test(f) || h.test(f) || b.test(f)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= p || !f.trim()) c += `
` + v.slice(p);
            else {
              if (g || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || m.test(d) || w.test(d) || b.test(d)) break;
              c += `
` + f;
            }
            g = !f.trim(), u += S + `
`, e = e.substring(S.length + 1), d = v.slice(p);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (s = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += u;
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
          let u = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (u) {
            let c = { type: "checkbox", raw: u[0] + " ", checked: u[0] !== "[ ]" };
            o.checked = c.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = c.raw + o.tokens[0].raw, o.tokens[0].text = c.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(c)) : o.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : o.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let u = o.tokens.filter((d) => d.type === "space"), c = u.length > 0 && u.some((d) => this.rules.other.anyLine.test(d.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let u of o.tokens) u.type === "text" && (u.type = "paragraph");
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
    let n = Li(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Li(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = sn(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = zo(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Ti(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Ti(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, u = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = u.exec(t)) != null; ) {
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
        let c = [...i[0]][0].length, d = e.slice(0, r + i.index + c + s);
        if (Math.min(r, s) % 2) {
          let g = d.slice(1, -1);
          return { type: "em", raw: d, text: g, tokens: this.lexer.inlineTokens(g) };
        }
        let f = d.slice(2, -2);
        return { type: "strong", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
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
        let u = [...i[0]][0].length, c = e.slice(0, r + i.index + u + s), d = c.slice(r, -r);
        return { type: "del", raw: c, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, ht = class Mr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || It, this.options.tokenizer = this.options.tokenizer || new An(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: at, block: Bn.normal, inline: an.normal };
    this.options.pedantic ? (n.block = Bn.pedantic, n.inline = an.pedantic) : this.options.gfm && (n.block = Bn.gfm, this.options.breaks ? n.inline = an.breaks : n.inline = an.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Bn, inline: an };
  }
  static lex(t, n) {
    return new Mr(n).lex(t);
  }
  static lexInline(t, n) {
    return new Mr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(at.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(at.tabCharGlobal, "    ").replace(at.spaceLine, "")); t; ) {
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
        this.options.extensions.startBlock.forEach((u) => {
          o = u.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
      let u = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, d = t.slice(1), f;
        this.options.extensions.startInline.forEach((g) => {
          f = g.call({ lexer: this }, d), typeof f == "number" && f >= 0 && (c = Math.min(c, f));
        }), c < 1 / 0 && c >= 0 && (u = t.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(u)) {
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
}, En = class {
  options;
  parser;
  constructor(e) {
    this.options = e || It;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(at.notSpaceStart)?.[0], r = e.replace(at.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + wt(i) + '">' + (n ? r : wt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : wt(r, !0)) + `</code></pre>
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
    return `<code>${wt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Mi(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + wt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Mi(e);
    if (r === null) return wt(n);
    e = r;
    let a = `<img src="${e}" alt="${wt(n)}"`;
    return t && (a += ` title="${wt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : wt(e.text);
  }
}, ir = class {
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
}, dt = class Lr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || It, this.options.renderer = this.options.renderer || new En(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ir();
  }
  static parse(t, n) {
    return new Lr(n).parse(t);
  }
  static parseInline(t, n) {
    return new Lr(n).parseInline(t);
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
}, Kt = class {
  options;
  block;
  constructor(e) {
    this.options = e || It;
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
    return this.block ? ht.lex : ht.lexInline;
  }
  provideParser() {
    return this.block ? dt.parse : dt.parseInline;
  }
}, Sa = class {
  defaults = tr();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = dt;
  Renderer = En;
  TextRenderer = ir;
  Lexer = ht;
  Tokenizer = An;
  Hooks = Kt;
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
        let r = this.defaults.renderer || new En(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, l = n.renderer[s], o = r[s];
          r[s] = (...u) => {
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new An(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, l = n.tokenizer[s], o = r[s];
          r[s] = (...u) => {
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Kt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          Kt.passThroughHooks.has(a) ? r[s] = (u) => {
            if (this.defaults.async && Kt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let d = await l.call(r, u);
              return o.call(r, d);
            })();
            let c = l.call(r, u);
            return o.call(r, c);
          } : r[s] = (...u) => {
            if (this.defaults.async) return (async () => {
              let d = await l.apply(r, u);
              return d === !1 && (d = await o.apply(r, u)), d;
            })();
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c;
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
    return ht.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return dt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, l = await (r.hooks ? await r.hooks.provideLexer() : e ? ht.lex : ht.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser() : e ? dt.parse : dt.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? ht.lex : ht.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : e ? dt.parse : dt.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + wt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Ft = new Sa();
function ke(e, t) {
  return Ft.parse(e, t);
}
ke.options = ke.setOptions = function(e) {
  return Ft.setOptions(e), ke.defaults = Ft.defaults, ha(ke.defaults), ke;
};
ke.getDefaults = tr;
ke.defaults = It;
ke.use = function(...e) {
  return Ft.use(...e), ke.defaults = Ft.defaults, ha(ke.defaults), ke;
};
ke.walkTokens = function(e, t) {
  return Ft.walkTokens(e, t);
};
ke.parseInline = Ft.parseInline;
ke.Parser = dt;
ke.parser = dt.parse;
ke.Renderer = En;
ke.TextRenderer = ir;
ke.Lexer = ht;
ke.lexer = ht.lex;
ke.Tokenizer = An;
ke.Hooks = Kt;
ke.parse = ke;
var No = ke.options, Bo = ke.setOptions, qo = ke.use, jo = ke.walkTokens, Do = ke.parseInline, Ho = ke, Uo = dt.parse, Fo = ht.lex;
const Ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Kt,
  Lexer: ht,
  Marked: Sa,
  Parser: dt,
  Renderer: En,
  TextRenderer: ir,
  Tokenizer: An,
  get defaults() {
    return It;
  },
  getDefaults: tr,
  lexer: Fo,
  marked: ke,
  options: No,
  parse: Ho,
  parseInline: Do,
  parser: Uo,
  setOptions: Bo,
  use: qo,
  walkTokens: jo
}, Symbol.toStringTag, { value: "Module" })), va = `function O() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = O();
function he(s) {
  $ = s;
}
var T = { exec: () => null };
function k(s, e = "") {
  let r = typeof s == "string" ? s : s.source, n = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(m.caret, "$1"), r = r.replace(t, l), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Te = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ae = /^(?:[ \\t]*(?:\\n|$))+/, _e = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Le = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, M = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Pe = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, X = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, pe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, ue = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Ie = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), K = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, ve = /^[^\\n]+/, U = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Ce = k(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", U).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Be = k(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, X).getRegex(), H = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", J = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ee = k("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", J).replace("tag", H).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ge = k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex(), qe = k(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ge).getRegex(), V = { blockquote: qe, code: _e, def: Ce, fences: Le, heading: Pe, hr: M, html: Ee, lheading: ue, list: Be, newline: Ae, paragraph: ge, table: T, text: ve }, re = k("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex(), Me = { ...V, lheading: Ie, table: re, paragraph: k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex() }, Ze = { ...V, html: k(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", J).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: T, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: k(K).replace("hr", M).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", ue).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, je = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, De = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, ke = /^( {2,}|\\\\)\\n(?!\\s*$)/, Oe = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, N = /[\\p{P}\\p{S}]/u, Y = /[\\s\\p{P}\\p{S}]/u, fe = /[^\\s\\p{P}\\p{S}]/u, He = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Y).getRegex(), de = /(?!~)[\\p{P}\\p{S}]/u, Ne = /(?!~)[\\s\\p{P}\\p{S}]/u, Qe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, xe = /(?![*_])[\\p{P}\\p{S}]/u, Ge = /(?![*_])[\\s\\p{P}\\p{S}]/u, We = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Fe = k(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Te ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), be = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Xe = k(be, "u").replace(/punct/g, N).getRegex(), Ke = k(be, "u").replace(/punct/g, de).getRegex(), me = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Ue = k(me, "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), Je = k(me, "gu").replace(/notPunctSpace/g, Qe).replace(/punctSpace/g, Ne).replace(/punct/g, de).getRegex(), Ve = k("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), Ye = k(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, xe).getRegex(), et = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", tt = k(et, "gu").replace(/notPunctSpace/g, We).replace(/punctSpace/g, Ge).replace(/punct/g, xe).getRegex(), rt = k(/\\\\(punct)/, "gu").replace(/punct/g, N).getRegex(), st = k(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), nt = k(J).replace("(?:-->|$)", "-->").getRegex(), lt = k("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", nt).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), D = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, it = k(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", D).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), we = k(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", D).replace("ref", U).getRegex(), ye = k(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", U).getRegex(), at = k("reflink|nolink(?!\\\\()", "g").replace("reflink", we).replace("nolink", ye).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ee = { _backpedal: T, anyPunctuation: rt, autolink: st, blockSkip: Fe, br: ke, code: De, del: T, delLDelim: T, delRDelim: T, emStrongLDelim: Xe, emStrongRDelimAst: Ue, emStrongRDelimUnd: Ve, escape: je, link: it, nolink: ye, punctuation: He, reflink: we, reflinkSearch: at, tag: lt, text: Oe, url: T }, ot = { ...ee, link: k(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", D).getRegex(), reflink: k(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", D).getRegex() }, G = { ...ee, emStrongRDelimAst: Je, emStrongLDelim: Ke, delLDelim: Ye, delRDelim: tt, url: k(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: k(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", se).getRegex() }, ct = { ...G, br: k(ke).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, Z = { normal: V, gfm: Me, pedantic: Ze }, C = { normal: ee, gfm: G, breaks: ct, pedantic: ot }, ht = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ne = (s) => ht[s];
function S(s, e) {
  if (e) {
    if (m.escapeTest.test(s)) return s.replace(m.escapeReplace, ne);
  } else if (m.escapeTestNoEncode.test(s)) return s.replace(m.escapeReplaceNoEncode, ne);
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
function ie(s, e) {
  let r = s.replace(m.findPipe, (i, l, c) => {
    let a = !1, h = l;
    for (; --h >= 0 && c[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function B(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function pt(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function ut(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let i = 4 - r % 4;
    n += " ".repeat(i), r += i;
  } else n += t, r++;
  return n;
}
function ae(s, e, r, n, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: l, text: c, tokens: n.inlineTokens(c) };
  return n.state.inLink = !1, a;
}
function gt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((i) => {
    let l = i.match(r.other.beginningSpace);
    if (l === null) return i;
    let [c] = l;
    return c.length >= t.length ? i.slice(t.length) : i;
  }).join(\`
\`);
}
var E = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : B(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = gt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = B(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: B(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = B(e[0], \`
\`).split(\`
\`), n = "", t = "", i = [];
      for (; r.length > 0; ) {
        let l = !1, c = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) c.push(r[a]), l = !0;
        else if (!l) c.push(r[a]);
        else break;
        r = r.slice(a);
        let h = c.join(\`
\`), o = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${o}\` : o;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(o, i, !0), this.lexer.state.top = p, r.length === 0) break;
        let u = i.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.blockquote(g);
          i[i.length - 1] = x, n = n.substring(0, n.length - d.raw.length) + x.raw, t = t.substring(0, t.length - d.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.list(g);
          i[i.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - d.raw.length) + x.raw, r = g.substring(i.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: i, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = n ? r : "[*+-]");
      let i = this.rules.other.listItemRegex(r), l = !1;
      for (; s; ) {
        let a = !1, h = "", o = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = ut(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, o = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, o = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), L = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), te = this.rules.other.htmlBeginRegex(g), v = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let P = s.split(\`
\`, 1)[0], z;
            if (u = P, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), z = u) : z = u.replace(this.rules.other.tabCharGlobal, "    "), L.test(u) || R.test(u) || te.test(u) || v.test(u) || x.test(u) || _.test(u)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) o += \`
\` + z.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || L.test(p) || R.test(p) || _.test(p)) break;
              o += \`
\` + u;
            }
            d = !u.trim(), h += P + \`
\`, s = s.substring(P.length + 1), p = z.slice(g);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (l = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(o), loose: !1, text: o, tokens: [] }), t.raw += h;
      }
      let c = t.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let a of t.items) {
        if (this.lexer.state.top = !1, a.tokens = this.lexer.blockTokens(a.text, []), a.task) {
          if (a.text = a.text.replace(this.rules.other.listReplaceTask, ""), a.tokens[0]?.type === "text" || a.tokens[0]?.type === "paragraph") {
            a.tokens[0].raw = a.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), a.tokens[0].text = a.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let o = this.lexer.inlineQueue.length - 1; o >= 0; o--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[o].src)) {
              this.lexer.inlineQueue[o].src = this.lexer.inlineQueue[o].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (h) {
            let o = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            a.checked = o.checked, t.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = o.raw + a.tokens[0].raw, a.tokens[0].text = o.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(o)) : a.tokens.unshift({ type: "paragraph", raw: o.raw, text: o.raw, tokens: [o] }) : a.tokens.unshift(o);
          }
        }
        if (!t.loose) {
          let h = a.tokens.filter((p) => p.type === "space"), o = h.length > 0 && h.some((p) => this.rules.other.anyLine.test(p.raw));
          t.loose = o;
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
    let r = ie(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let l of n) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < r.length; l++) i.header.push({ text: r[l], tokens: this.lexer.inline(r[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(ie(l, i.header.length).map((c, a) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[a] })));
      return i;
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
        let i = B(r.slice(0, -1), "\\\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = pt(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let n = e[2], t = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(n);
        i && (n = i[1], t = i[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), ae(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(s)) || (r = this.rules.inline.nolink.exec(s))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let i = r[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return ae(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, i, l, c = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i) continue;
        if (l = [...i].length, n[3] || n[4]) {
          c += l;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + l) % 3)) {
          a += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + a);
        let o = [...n[0]][0].length, p = s.slice(0, t + n.index + o + l);
        if (Math.min(t, l) % 2) {
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
      let t = [...n[0]].length - 1, i, l, c = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i || (l = [...i].length, l !== t)) continue;
        if (n[3] || n[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let h = [...n[0]][0].length, o = s.slice(0, t + n.index + h + l), p = o.slice(t, -t);
        return { type: "del", raw: o, text: p, tokens: this.lexer.inlineTokens(p) };
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
}, w = class W {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new E(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: Z.normal, inline: C.normal };
    this.options.pedantic ? (r.block = Z.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = Z.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Z, inline: C };
  }
  static lex(e, r) {
    return new W(r).lex(e);
  }
  static lexInline(e, r) {
    return new W(r).inlineTokens(e);
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
      if (this.options.extensions?.block?.some((l) => (t = l.call({ lexer: this }, e, r)) ? (e = e.substring(t.raw.length), r.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let l = r.at(-1);
        t.raw.length === 1 && l !== void 0 ? l.raw += \`
\` : r.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let l = r.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.text, this.inlineQueue.at(-1).src = l.text) : r.push(t);
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
        let l = r.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, r.push(t));
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
      let i = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, c), typeof a == "number" && a >= 0 && (l = Math.min(l, a));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(i))) {
        let l = r.at(-1);
        n && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : r.push(t), n = i.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let l = r.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : r.push(t);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
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
    let i;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i = t[2] ? t[2].length : 0, n = n.slice(0, t.index + i) + "[" + "a".repeat(t[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let a;
      if (this.options.extensions?.inline?.some((o) => (a = o.call({ lexer: this }, e, r)) ? (e = e.substring(a.raw.length), r.push(a), !0) : !1)) continue;
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
        let o = r.at(-1);
        a.type === "text" && o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : r.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, c)) {
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
      if (a = this.tokenizer.del(e, n, c)) {
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
        let o = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
        }), o < 1 / 0 && o >= 0 && (h = e.substring(0, o + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (c = a.raw.slice(-1)), l = !0;
        let o = r.at(-1);
        o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : r.push(a);
        continue;
      }
      if (e) {
        let o = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else throw new Error(o);
      }
    }
    return r;
  }
}, q = class {
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
    for (let l = 0; l < s.items.length; l++) {
      let c = s.items[l];
      n += this.listitem(c);
    }
    let t = e ? "ol" : "ul", i = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + i + \`>
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
      let i = s.rows[t];
      r = "";
      for (let l = 0; l < i.length; l++) r += this.tablecell(i[l]);
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
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + S(e) + '"'), i += ">" + n + "</a>", i;
  }
  image({ href: s, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let t = le(s);
    if (t === null) return S(r);
    s = t;
    let i = \`<img src="\${s}" alt="\${S(r)}"\`;
    return e && (i += \` title="\${S(e)}"\`), i += ">", i;
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
}, y = class F {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new q(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new F(r).parse(e);
  }
  static parseInline(e, r) {
    return new F(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let l = t, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          r += c || "";
          continue;
        }
      }
      let i = t;
      switch (i.type) {
        case "space": {
          r += this.renderer.space(i);
          break;
        }
        case "hr": {
          r += this.renderer.hr(i);
          break;
        }
        case "heading": {
          r += this.renderer.heading(i);
          break;
        }
        case "code": {
          r += this.renderer.code(i);
          break;
        }
        case "table": {
          r += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          r += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          r += this.renderer.html(i);
          break;
        }
        case "def": {
          r += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          r += this.renderer.text(i);
          break;
        }
        default: {
          let l = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (this.options.extensions?.renderers?.[i.type]) {
        let c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += c || "";
          continue;
        }
      }
      let l = i;
      switch (l.type) {
        case "escape": {
          n += r.text(l);
          break;
        }
        case "html": {
          n += r.html(l);
          break;
        }
        case "link": {
          n += r.link(l);
          break;
        }
        case "image": {
          n += r.image(l);
          break;
        }
        case "checkbox": {
          n += r.checkbox(l);
          break;
        }
        case "strong": {
          n += r.strong(l);
          break;
        }
        case "em": {
          n += r.em(l);
          break;
        }
        case "codespan": {
          n += r.codespan(l);
          break;
        }
        case "br": {
          n += r.br(l);
          break;
        }
        case "del": {
          n += r.del(l);
          break;
        }
        case "text": {
          n += r.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return n;
  }
}, I = class {
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
}, Se = class {
  defaults = O();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = q;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = E;
  Hooks = I;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let r = [];
    for (let n of s) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let i of t.header) r = r.concat(this.walkTokens(i.tokens, e));
        for (let i of t.rows) for (let l of i) r = r.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((i) => {
          let l = t[i].flat(1 / 0);
          r = r.concat(this.walkTokens(l, e));
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
          let i = e.renderers[t.name];
          i ? e.renderers[t.name] = function(...l) {
            let c = t.renderer.apply(this, l);
            return c === !1 && (c = i.apply(this, l)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[t.level];
          i ? i.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new q(this.defaults);
        for (let i in r.renderer) {
          if (!(i in t)) throw new Error(\`renderer '\${i}' does not exist\`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, c = r.renderer[l], a = t[l];
          t[l] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new E(this.defaults);
        for (let i in r.tokenizer) {
          if (!(i in t)) throw new Error(\`tokenizer '\${i}' does not exist\`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, c = r.tokenizer[l], a = t[l];
          t[l] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new I();
        for (let i in r.hooks) {
          if (!(i in t)) throw new Error(\`hook '\${i}' does not exist\`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = r.hooks[l], a = t[l];
          I.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && I.passThroughHooksRespectAsync.has(i)) return (async () => {
              let p = await c.call(t, h);
              return a.call(t, p);
            })();
            let o = c.call(t, h);
            return a.call(t, o);
          } : t[l] = (...h) => {
            if (this.defaults.async) return (async () => {
              let p = await c.apply(t, h);
              return p === !1 && (p = await a.apply(t, h)), p;
            })();
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o;
          };
        }
        n.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, i = r.walkTokens;
        n.walkTokens = function(l) {
          let c = [];
          return c.push(i.call(this, l)), t && (c = c.concat(t.call(this, l))), c;
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
      let n = { ...r }, t = { ...this.defaults, ...n }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(l, t), a = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(l, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (l) {
        return i(l);
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
}, A = new Se();
function f(s, e) {
  return A.parse(s, e);
}
f.options = f.setOptions = function(s) {
  return A.setOptions(s), f.defaults = A.defaults, he(f.defaults), f;
};
f.getDefaults = O;
f.defaults = $;
f.use = function(...s) {
  return A.use(...s), f.defaults = A.defaults, he(f.defaults), f;
};
f.walkTokens = function(s, e) {
  return A.walkTokens(s, e);
};
f.parseInline = A.parseInline;
f.Parser = y;
f.parser = y.parse;
f.Renderer = q;
f.TextRenderer = Q;
f.Lexer = w;
f.lexer = w.lex;
f.Tokenizer = E;
f.Hooks = I;
f.parse = f;
var kt = f.options, ft = f.setOptions, dt = f.use, xt = f.walkTokens, bt = f.parseInline, mt = f, wt = y.parse, yt = w.lex, oe = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: I,
  Lexer: w,
  Marked: Se,
  Parser: y,
  Renderer: q,
  TextRenderer: Q,
  Tokenizer: E,
  get defaults() {
    return $;
  },
  getDefaults: O,
  lexer: yt,
  marked: f,
  options: kt,
  parse: mt,
  parseInline: bt,
  parser: wt,
  setOptions: ft,
  use: dt,
  walkTokens: xt
});
function St(s) {
  if (s.startsWith("---")) {
    const e = s.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = s.slice(3, e + 0).trim(), n = s.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((i) => {
        const l = i.match(/^([^:]+):\\s*(.*)$/);
        l && (t[l[1].trim()] = l[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: s, data: {} };
}
function $t(s) {
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
const j = oe && (f || oe) || void 0;
let b = null;
const Rt = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ce() {
  if (b) return b;
  try {
    try {
      const s = await import(Rt + "/lib/core.js");
      b = s.default || s;
    } catch {
      b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
j && typeof j.setOptions == "function" && j.setOptions({
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
      const { name: o, url: p } = e;
      try {
        if (!await ce()) {
          postMessage({ type: "register-error", name: o, error: "hljs unavailable" });
          return;
        }
        const d = await import(p), g = d.default || d;
        b.registerLanguage(o, g), postMessage({ type: "registered", name: o });
      } catch (u) {
        postMessage({ type: "register-error", name: o, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const o = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g;
      let g;
      for (; g = d.exec(o); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: i } = St(n || "");
    await ce().catch(() => {
    });
    let l = j.parse(t);
    const c = [], a = /* @__PURE__ */ new Map(), h = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    l = l.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (o, p, u, d) => {
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = $t(x);
      } catch {
      }
      let _ = null;
      const L = (u || "").match(/\\sid="([^"]+)"/);
      L && (_ = L[1]);
      const R = _ || h(x) || "heading", v = (a.get(R) || 0) + 1;
      a.set(R, v);
      const P = v === 1 ? R : R + "-" + v;
      c.push({ level: g, text: x, id: P });
      const z = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, $e = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Re = (z[g] + " " + $e).trim(), ze = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${P}" class="\${Re}"\`).trim();
      return \`<h\${g} \${ze}>\${d}</h\${g}>\`;
    }), l = l.replace(/<img([^>]*)>/g, (o, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: l, meta: i || {}, toc: c } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`, Ri = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", va], { type: "text/javascript;charset=utf-8" });
function Wo(e) {
  let t;
  try {
    if (t = Ri && (self.URL || self.webkitURL).createObjectURL(Ri), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(va),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Vn(e) {
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
function Aa(e) {
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
const gn = Ci && (ke || Ci) || void 0;
let et = null;
const Zo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function Yn() {
  if (et) return et;
  try {
    try {
      const e = await import(Zo + "/lib/core.js");
      et = e.default || e;
    } catch {
      et = null;
    }
  } catch {
    et = null;
  }
  return et;
}
gn && typeof gn.setOptions == "function" && gn.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return et && t && typeof et.getLanguage == "function" && et.getLanguage(t) ? et.highlight(e, { language: t }).value : et && typeof et.getLanguage == "function" && et.getLanguage("plaintext") ? et.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: c, url: d } = t;
      try {
        if (!await Yn()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const g = await import(d), p = g.default || g;
        et.registerLanguage(c, p), postMessage({ type: "registered", name: c });
      } catch (f) {
        postMessage({ type: "register-error", name: c, error: String(f) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", d = t.supported || [], f = /* @__PURE__ */ new Set(), g = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let p;
      for (; p = g.exec(c); )
        if (p[1]) {
          const h = String(p[1]).toLowerCase();
          if (!h) continue;
          if (h.length >= 5 && h.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(h) && f.add(h), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(h) && f.add(h), d && d.length)
            try {
              d.indexOf(h) !== -1 && f.add(h);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(f) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Vn(i || "");
    await Yn().catch(() => {
    });
    let s = gn.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), u = (c) => {
      try {
        return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, d, f, g) => {
      const p = Number(d);
      let h = g.replace(/<[^>]+>/g, "").trim();
      try {
        h = Aa(h);
      } catch {
      }
      let b = null;
      const m = (f || "").match(/\sid="([^"]+)"/);
      m && (b = m[1]);
      const w = b || u(h) || "heading", k = (o.get(w) || 0) + 1;
      o.set(w, k);
      const S = k === 1 ? w : w + "-" + k;
      l.push({ level: p, text: h, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, R = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Z = (v[p] + " " + R).trim(), ee = ((f || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${Z}"`).trim();
      return `<h${p} ${ee}>${g}</h${p}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, d) => /\bloading=/.test(d) ? `<img${d}>` : /\bdata-want-lazy=/.test(d) ? `<img${d}>` : `<img${d} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Go(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: u } = e;
      try {
        if (!await Yn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const d = await import(u), f = d.default || d;
        return et.registerLanguage(o, f), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", u = e.supported || [], c = /* @__PURE__ */ new Set(), d = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let f;
      for (; f = d.exec(o); )
        if (f[1]) {
          const g = String(f[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && c.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && c.add(g), u && u.length)
            try {
              u.indexOf(g) !== -1 && c.add(g);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Vn(e && e.md || "");
    await Yn().catch(() => {
    });
    let r = gn.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, u, c, d) => {
      const f = Number(u);
      let g = d.replace(/<[^>]+>/g, "").trim();
      try {
        g = Aa(g);
      } catch {
      }
      let p = null;
      const h = (c || "").match(/\sid="([^"]+)"/);
      h && (p = h[1]);
      const b = p || l(g) || "heading", w = (s.get(b) || 0) + 1;
      s.set(b, w);
      const y = w === 1 ? b : b + "-" + w;
      a.push({ level: f, text: g, id: y });
      const k = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[f] + " " + S).trim(), Z = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${v}"`).trim();
      return `<h${f} ${Z}>${d}</h${f}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const mr = {
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
let qn = typeof DOMParser < "u" ? new DOMParser() : null;
function Wt() {
  return qn || (typeof DOMParser < "u" ? (qn = new DOMParser(), qn) : null);
}
const Qo = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Xo() {
  if (typeof Worker < "u")
    try {
      return new Wo();
    } catch {
    }
  const e = { message: [], error: [] };
  return {
    addEventListener(n, i) {
      e[n] || (e[n] = []), e[n].push(i);
    },
    removeEventListener(n, i) {
      if (!e[n]) return;
      const r = e[n].indexOf(i);
      r !== -1 && e[n].splice(r, 1);
    },
    postMessage(n) {
      setTimeout(async () => {
        try {
          const r = { data: await Go(n) }(e.message || []).forEach((a) => a(r));
        } catch {
          const r = { data: { id: n && n.id } }(e.message || []).forEach((a) => a(r));
        }
      }, 0);
    },
    terminate() {
      Object.keys(e).forEach((n) => e[n].length = 0);
    }
  };
}
const Ea = Xi(() => Xo(), "markdown", Qo), jt = () => Ea.get(), Xr = (e, t = 3e3) => Ea.send(e, t), xt = [];
function Tr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    xt.push(e);
    try {
      ke.use(e);
    } catch (t) {
      _("[markdown] failed to apply plugin", t);
    }
  }
}
function Ko(e) {
  xt.length = 0, Array.isArray(e) && xt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    xt.forEach((t) => ke.use(t));
  } catch (t) {
    _("[markdown] failed to apply markdown extensions", t);
  }
}
async function Mn(e) {
  if (xt && xt.length) {
    let { content: i, data: r } = Vn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => mr[l] || s);
    } catch {
    }
    ke.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      xt.forEach((s) => ke.use(s));
    } catch (s) {
      _("[markdown] apply plugins failed", s);
    }
    const a = ke.parse(i);
    try {
      const s = Wt();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), u = [], c = /* @__PURE__ */ new Set(), d = (g) => {
          try {
            return String(g || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, f = (g) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, h = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[g] + " " + h).trim();
        };
        o.forEach((g) => {
          try {
            const p = Number(g.tagName.substring(1)), h = (g.textContent || "").trim();
            let b = d(h) || "heading", m = b, w = 2;
            for (; c.has(m); )
              m = b + "-" + w, w += 1;
            c.add(m), g.id = m, g.className = f(p), u.push({ level: p, text: h, id: m });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((g) => {
            try {
              const p = g.getAttribute && g.getAttribute("loading"), h = g.getAttribute && g.getAttribute("data-want-lazy");
              !p && !h && g.setAttribute && g.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((g) => {
            try {
              const p = g.getAttribute && g.getAttribute("class") || g.className || "", h = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (h)
                try {
                  g.setAttribute && g.setAttribute("class", h);
                } catch {
                  g.className = h;
                }
              else
                try {
                  g.removeAttribute && g.removeAttribute("class");
                } catch {
                  g.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        return { html: l.body.innerHTML, meta: r || {}, toc: u };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Ma);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = jt && jt();
    }
  else
    t = jt && jt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => mr[r] || i);
  } catch {
  }
  try {
    if (typeof Re < "u" && Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Vn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (u, c) => mr[c] || u);
      } catch {
      }
      ke.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (u, c) => {
        try {
          return c && Re.getLanguage && Re.getLanguage(c) ? Re.highlight(u, { language: c }).value : Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext") ? Re.highlight(u, { language: "plaintext" }).value : u;
        } catch {
          return u;
        }
      } });
      let a = ke.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (u, c) => {
          try {
            if (c && Re && typeof Re.highlight == "function")
              try {
                const d = Re.highlight(c, { language: "plaintext" });
                return `<pre><code>${d && d.value ? d.value : d}</code></pre>`;
              } catch {
                try {
                  if (Re && typeof Re.highlightElement == "function") {
                    const f = { innerHTML: c };
                    return Re.highlightElement(f), `<pre><code>${f.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return u;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (u) => {
        try {
          return String(u || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, c, d, f) => {
        const g = Number(c), p = f.replace(/<[^>]+>/g, "").trim();
        let h = o(p) || "heading", b = h, m = 2;
        for (; l.has(b); )
          b = h + "-" + m, m += 1;
        l.add(b), s.push({ level: g, text: p, id: b });
        const w = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, y = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", k = (w[g] + " " + y).trim(), v = ((d || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${k}"`).trim();
        return `<h${g} ${v}>${f}</h${g}>`;
      }), a = a.replace(/<img([^>]*)>/g, (u, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Xr({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const u = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (u[o] + " " + c).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, u, c, d) => {
      const f = Number(u), g = d.replace(/<[^>]+>/g, "").trim(), p = (c || "").match(/\sid="([^"]+)"/), h = p ? p[1] : a(g) || "heading", m = (i.get(h) || 0) + 1;
      i.set(h, m);
      const w = m === 1 ? h : h + "-" + m;
      r.push({ level: f, text: g, id: w });
      const y = s(f), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${y}"`).trim();
      return `<h${f} ${S}>${d}</h${f}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const u = Wt();
        if (u) {
          const c = u.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((f) => {
            try {
              const g = f.getAttribute("src") || "";
              (g ? new URL(g, location.href).toString() : "") === o && f.remove();
            } catch {
            }
          }), l = c.body.innerHTML;
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
function mn(e, t) {
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
      if (Ui.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(ct && ct[l] && t.has(ct[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const u = t.get(l);
          u && n.add(u);
          continue;
        }
        if (ct && ct[l]) {
          const u = ct[l];
          if (t.has(u)) {
            const c = t.get(u) || u;
            n.add(c);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function Cr(e, t) {
  if (xt && xt.length || typeof process < "u" && process.env && process.env.VITEST) return mn(e || "", t);
  if (jt && jt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Xr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      _("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return mn(e || "", t);
}
const Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Xr,
  addMarkdownExtension: Tr,
  detectFenceLanguages: mn,
  detectFenceLanguagesAsync: Cr,
  initRendererWorker: jt,
  markdownPlugins: xt,
  parseMarkdownToHtml: Mn,
  setMarkdownExtensions: Ko
}, Symbol.toStringTag, { value: "Module" })), Vo = `/**
 * @module worker/anchorWorker
 */
import { _rewriteAnchors } from '../htmlBuilder.js'

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
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath, { canonical: true })
        postMessage({ id, result: doc.body.innerHTML })
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
        const parser = new DOMParser()
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
        const l = new DOMParser().parseFromString(i || "", "text/html"), o = l.body;
        await Kr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Yo(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), l = s.body;
        return await Kr(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function ut(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + mi(e, t);
  } catch {
    return mi(e, t);
  }
}
function Jo(...e) {
  try {
    _(...e);
  } catch {
  }
}
function Jn(e) {
  try {
    if (Zt(3)) return !0;
  } catch {
  }
  try {
    if (typeof oe == "string" && oe) return !0;
  } catch {
  }
  try {
    if (V && V.size) return !0;
  } catch {
  }
  try {
    if (Pe && Pe.size) return !0;
  } catch {
  }
  return !1;
}
function kt(e, t) {
  try {
    if (typeof Je == "function")
      try {
        Je(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && H && typeof H.set == "function" && H.set(t, e);
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
          Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
      } catch {
      }
  } catch {
  }
}
function el(e, t) {
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
function tl(e, t) {
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
        const u = String(s.path || "");
        try {
          o.setAttribute("href", ze(u));
        } catch {
          u && u.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(u)) : o.setAttribute("href", ut(u));
        }
      } catch {
        o.setAttribute("href", "#" + s.path);
      }
      if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
        const u = document.createElement("ul");
        s.children.forEach((c) => {
          const d = document.createElement("li"), f = document.createElement("a");
          try {
            const g = String(c.path || "");
            try {
              f.setAttribute("href", ze(g));
            } catch {
              g && g.indexOf("/") === -1 ? f.setAttribute("href", "#" + encodeURIComponent(g)) : f.setAttribute("href", ut(g));
            }
          } catch {
            f.setAttribute("href", "#" + c.path);
          }
          f.textContent = c.name, d.appendChild(f), u.appendChild(d);
        }), l.appendChild(u);
      }
      a.appendChild(l);
    }), r.appendChild(a);
  } catch {
    t.forEach((s) => {
      try {
        const l = document.createElement("li"), o = document.createElement("a");
        try {
          const u = String(s.path || "");
          try {
            o.setAttribute("href", ze(u));
          } catch {
            u && u.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(u)) : o.setAttribute("href", ut(u));
          }
        } catch {
          o.setAttribute("href", "#" + s.path);
        }
        if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
          const u = document.createElement("ul");
          s.children.forEach((c) => {
            const d = document.createElement("li"), f = document.createElement("a");
            try {
              const g = String(c.path || "");
              try {
                f.setAttribute("href", ze(g));
              } catch {
                g && g.indexOf("/") === -1 ? f.setAttribute("href", "#" + encodeURIComponent(g)) : f.setAttribute("href", ut(g));
              }
            } catch {
              f.setAttribute("href", "#" + c.path);
            }
            f.textContent = c.name, d.appendChild(f), u.appendChild(d);
          }), l.appendChild(u);
        }
        r.appendChild(l);
      } catch (l) {
        _("[htmlBuilder] createNavTree item failed", l);
      }
    });
  }
  return n.appendChild(r), n;
}
function nl(e, t, n = "") {
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
        const u = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), d = document.createElement("a"), f = ys(o.text || ""), g = o.id || ue(f);
        d.textContent = f;
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), w = m && H && H.has && H.has(m) ? H.get(m) : m;
          w ? d.href = ze(w, g) : d.href = `#${encodeURIComponent(g)}`;
        } catch (m) {
          _("[htmlBuilder] buildTocElement href normalization failed", m), d.href = `#${encodeURIComponent(g)}`;
        }
        if (c.appendChild(d), u === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((m) => {
            Number(m) > 2 && delete l[m];
          });
          return;
        }
        let p = u - 1;
        for (; p > 2 && !l[p]; ) p--;
        p < 2 && (p = 2);
        let h = l[p];
        if (!h) {
          a.appendChild(c), l[u] = c;
          return;
        }
        let b = h.querySelector("ul");
        b || (b = document.createElement("ul"), h.appendChild(b)), b.appendChild(c), l[u] = c;
      } catch (u) {
        _("[htmlBuilder] buildTocElement item failed", u, o);
      }
    });
  } catch (l) {
    _("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function La(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ue(n.textContent || ""));
  });
}
function rl(e, t, n) {
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
function Pi(e, t, n) {
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
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (u) => {
          try {
            const c = s.getAttribute(u) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              s.setAttribute(u, new URL(c, r).toString());
            } catch (d) {
              _("[htmlBuilder] rewrite asset attribute failed", u, c, d);
            }
          } catch (c) {
            _("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const d = (s.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [g, p] = f.split(/\s+/, 2);
            if (!g || /^(https?:)?\/\//i.test(g) || g.startsWith("/")) return f;
            try {
              const h = new URL(g, r).toString();
              return p ? `${h} ${p}` : h;
            } catch {
              return f;
            }
          }).join(", ");
          s.setAttribute("srcset", d);
        }
      } catch (l) {
        _("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    _("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let $i = "", yr = null, zi = "";
async function Kr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === $i && yr)
      a = yr, s = zi;
    else {
      try {
        a = new URL(t, location.href), s = Ut(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Ut(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      $i = t, yr = a, zi = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], u = /* @__PURE__ */ new Set(), c = [];
    for (const d of Array.from(r))
      try {
        try {
          if (d.closest && d.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const f = d.getAttribute("href") || "";
        if (!f || xr(f)) continue;
        try {
          if (f.startsWith("?") || f.indexOf("?") !== -1)
            try {
              const p = new URL(f, t || location.href), h = p.searchParams.get("page");
              if (h && h.indexOf("/") === -1 && n) {
                const b = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (b) {
                  const m = K(b + h), w = i && i.canonical ? ze(m, p.hash ? p.hash.replace(/^#/, "") : null) : ut(m, p.hash ? p.hash.replace(/^#/, "") : null);
                  d.setAttribute("href", w);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (f.startsWith("/") && !f.endsWith(".md")) continue;
        const g = f.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (g) {
          let p = g[1];
          const h = g[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const b = new URL(p, t).pathname;
            let m = b.startsWith(s) ? b.slice(s.length) : b;
            m = K(m), o.push({ node: d, mdPathRaw: p, frag: h, rel: m }), H.has(m) || l.add(m);
          } catch (b) {
            _("[htmlBuilder] resolve mdPath failed", b);
          }
          continue;
        }
        try {
          let p = f;
          !f.startsWith("/") && n && (f.startsWith("#") ? p = n + f : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + f);
          const b = new URL(p, t).pathname || "";
          if (b && b.indexOf(s) !== -1) {
            let m = b.startsWith(s) ? b.slice(s.length) : b;
            if (m = K(m), m = Yt(m), m || (m = Br), !m.endsWith(".md")) {
              let w = null;
              try {
                if (H && H.has && H.has(m))
                  w = H.get(m);
                else
                  try {
                    const y = String(m || "").replace(/^.*\//, "");
                    y && H.has && H.has(y) && (w = H.get(y));
                  } catch (y) {
                    _("[htmlBuilder] mdToSlug baseName check failed", y);
                  }
              } catch (y) {
                _("[htmlBuilder] mdToSlug access check failed", y);
              }
              if (!w)
                try {
                  const y = String(m || "").replace(/^.*\//, "");
                  for (const [k, S] of V || [])
                    if (S === m || S === y) {
                      w = k;
                      break;
                    }
                } catch {
                }
              if (w) {
                const y = i && i.canonical ? ze(w, null) : ut(w);
                d.setAttribute("href", y);
              } else {
                let y = m;
                try {
                  /\.[^\/]+$/.test(String(m || "")) || (y = String(m || "") + ".html");
                } catch {
                  y = m;
                }
                u.add(y), c.push({ node: d, rel: y });
              }
            }
          }
        } catch (p) {
          _("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (f) {
        _("[htmlBuilder] processing anchor failed", f);
      }
    if (l.size)
      if (Jn(t))
        await Promise.all(Array.from(l).map(async (d) => {
          try {
            try {
              const g = String(d).match(/([^\/]+)\.md$/), p = g && g[1];
              if (p && V.has(p)) {
                try {
                  const h = V.get(p);
                  if (h)
                    try {
                      const b = typeof h == "string" ? h : h && h.default ? h.default : null;
                      b && kt(p, b);
                    } catch (b) {
                      _("[htmlBuilder] _storeSlugMapping failed", b);
                    }
                } catch (h) {
                  _("[htmlBuilder] reading slugToMd failed", h);
                }
                return;
              }
            } catch (g) {
              _("[htmlBuilder] basename slug lookup failed", g);
            }
            const f = await Me(d, t);
            if (f && f.raw) {
              const g = (f.raw || "").match(/^#\s+(.+)$/m);
              if (g && g[1]) {
                const p = ue(g[1].trim());
                if (p)
                  try {
                    kt(p, d);
                  } catch (h) {
                    _("[htmlBuilder] setting slug mapping failed", h);
                  }
              }
            }
          } catch (f) {
            _("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", f);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(l))
          try {
            const f = String(d).match(/([^\/]+)\.md$/), g = f && f[1];
            if (g) {
              const p = ue(g);
              if (p)
                try {
                  kt(p, d);
                } catch (h) {
                  _("[htmlBuilder] setting fallback slug mapping failed", h);
                }
            }
          } catch {
          }
      }
    if (u.size)
      if (Jn(t))
        await Promise.all(Array.from(u).map(async (d) => {
          try {
            const f = await Me(d, t);
            if (f && f.raw)
              try {
                const p = Wt().parseFromString(f.raw, "text/html"), h = p.querySelector("title"), b = p.querySelector("h1"), m = h && h.textContent && h.textContent.trim() ? h.textContent.trim() : b && b.textContent ? b.textContent.trim() : null;
                if (m) {
                  const w = ue(m);
                  if (w)
                    try {
                      kt(w, d);
                    } catch (y) {
                      _("[htmlBuilder] setting html slug mapping failed", y);
                    }
                }
              } catch (g) {
                _("[htmlBuilder] parse fetched HTML failed", g);
              }
          } catch (f) {
            _("[htmlBuilder] fetchMarkdown for htmlPending failed", f);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(u))
          try {
            const f = String(d).match(/([^\/]+)\.html$/), g = f && f[1];
            if (g) {
              const p = ue(g);
              if (p)
                try {
                  kt(p, d);
                } catch (h) {
                  _("[htmlBuilder] setting fallback html slug mapping failed", h);
                }
            }
          } catch {
          }
      }
    for (const d of o) {
      const { node: f, frag: g, rel: p } = d;
      let h = null;
      try {
        H.has(p) && (h = H.get(p));
      } catch (b) {
        _("[htmlBuilder] mdToSlug access failed", b);
      }
      if (h) {
        const b = i && i.canonical ? ze(h, g) : ut(h, g);
        f.setAttribute("href", b);
      } else {
        const b = i && i.canonical ? ze(p, g) : ut(p, g);
        f.setAttribute("href", b);
      }
    }
    for (const d of c) {
      const { node: f, rel: g } = d;
      let p = null;
      try {
        H.has(g) && (p = H.get(g));
      } catch (h) {
        _("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", h);
      }
      if (!p)
        try {
          const h = String(g || "").replace(/^.*\//, "");
          H.has(h) && (p = H.get(h));
        } catch (h) {
          _("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", h);
        }
      if (p) {
        const h = i && i.canonical ? ze(p, null) : ut(p);
        f.setAttribute("href", h);
      } else {
        const h = i && i.canonical ? ze(g, null) : ut(g);
        f.setAttribute("href", h);
      }
    }
  } catch (r) {
    _("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function il(e, t, n, i) {
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
    !l && n && (l = String(n)), l && (s = ue(l)), s || (s = Br);
    try {
      if (n)
        try {
          kt(s, n);
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
          const u = nt(typeof location < "u" ? location.href : "");
          u && u.anchor && u.page && String(u.page) === String(s) ? o = u.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", ut(s, o));
      } catch (u) {
        _("[htmlBuilder] computeSlug history replace failed", u);
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
async function al(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const u = o.getAttribute("href") || "";
      if (!u) continue;
      let f = K(u).split(/::|#/, 2)[0];
      try {
        const p = f.indexOf("?");
        p !== -1 && (f = f.slice(0, p));
      } catch {
      }
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const g = f;
      try {
        if (H && H.has && H.has(g)) continue;
      } catch (p) {
        _("[htmlBuilder] mdToSlug check failed", p);
      }
      try {
        let p = !1;
        for (const h of V.values())
          if (h === g) {
            p = !0;
            break;
          }
        if (p) continue;
      } catch (p) {
        _("[htmlBuilder] slugToMd iteration failed", p);
      }
      n.add(g);
    } catch (u) {
      _("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", u);
    }
  if (!n.size) return;
  if (!Jn()) {
    try {
      _("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const u = String(o).match(/([^\/]+)\.html$/), c = u && u[1];
        if (c) {
          const d = ue(c);
          if (d)
            try {
              kt(d, o);
            } catch (f) {
              _("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", f);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (o) => {
    try {
      const u = await Me(o, t);
      if (u && u.raw)
        try {
          const d = Wt().parseFromString(u.raw, "text/html"), f = d.querySelector("title"), g = d.querySelector("h1"), p = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
          if (p) {
            const h = ue(p);
            if (h)
              try {
                kt(h, o);
              } catch (b) {
                _("[htmlBuilder] set slugToMd/mdToSlug failed", b);
              }
          }
        } catch (c) {
          _("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (u) {
      _("[htmlBuilder] fetchAndExtract failed", u);
    }
  }, r = 5, a = Array.from(n);
  let s = 0;
  const l = [];
  for (; s < a.length; ) {
    const o = a.slice(s, s + r);
    l.push(Promise.all(o.map(i))), s += r;
  }
  await Promise.all(l);
}
async function sl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Ut(a.pathname);
  } catch (a) {
    r = "", _("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = K(l[1]);
        try {
          let u;
          try {
            u = el(o, t);
          } catch (d) {
            u = o, _("[htmlBuilder] resolve mdPath URL failed", d);
          }
          const c = u && r && u.startsWith(r) ? u.slice(r.length) : String(u || "").replace(/^\//, "");
          n.push({ rel: c }), H.has(c) || i.add(c);
        } catch (u) {
          _("[htmlBuilder] rewriteAnchors failed", u);
        }
        continue;
      }
    } catch (s) {
      _("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (Jn())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && V.has(l)) {
            try {
              const o = V.get(l);
              if (o)
                try {
                  const u = typeof o == "string" ? o : o && o.default ? o.default : null;
                  u && kt(l, u);
                } catch (u) {
                  _("[htmlBuilder] _storeSlugMapping failed", u);
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
          const s = await Me(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = ue(l[1].trim());
              if (o)
                try {
                  kt(o, a);
                } catch (u) {
                  _("[htmlBuilder] preMapMdSlugs setting slug mapping failed", u);
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
Wt();
function br(e) {
  try {
    const n = Wt().parseFromString(e || "", "text/html");
    La(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (u) {
          _("[htmlBuilder] parseHtml set image loading attribute failed", u);
        }
      });
    } catch (l) {
      _("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", u = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (u && u[1]) {
          const c = (u[1] || "").toLowerCase(), d = xe.size && (xe.get(c) || xe.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await xn(d);
              } catch (f) {
                _("[htmlBuilder] registerLanguage failed", f);
              }
            })();
          } catch (f) {
            _("[htmlBuilder] schedule registerLanguage failed", f);
          }
        } else
          try {
            if (Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext")) {
              const c = Re.highlight ? Re.highlight(l.textContent || "", { language: "plaintext" }) : null;
              c && c.value && (l.innerHTML = c.value);
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
async function ol(e) {
  const t = Cr ? await Cr(e || "", xe) : mn(e || "", xe), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = xe.size && (xe.get(r) || xe.get(String(r).toLowerCase())) || r;
      try {
        i.push(xn(a));
      } catch (s) {
        _("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(xn(r));
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
async function ll(e) {
  if (await ol(e), Mn) {
    const t = await Mn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function cl(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const d = Wt();
      if (d) {
        const f = d.parseFromString(t.raw || "", "text/html");
        try {
          Pi(f.body, n, r);
        } catch (g) {
          _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", g);
        }
        a = br(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : t.raw || "");
      } else
        a = br(t.raw || "");
    } catch {
      a = br(t.raw || "");
    }
  else
    a = await ll(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Pi(s, n, r);
  } catch (d) {
    _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", d);
  }
  try {
    La(s);
  } catch (d) {
    _("[htmlBuilder] addHeadingIds failed", d);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((f) => {
      try {
        const g = f.getAttribute && f.getAttribute("class") || f.className || "", p = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (p)
          try {
            f.setAttribute && f.setAttribute("class", p);
          } catch (h) {
            f.className = p, _("[htmlBuilder] set element class failed", h);
          }
        else
          try {
            f.removeAttribute && f.removeAttribute("class");
          } catch (h) {
            f.className = "", _("[htmlBuilder] remove element class failed", h);
          }
      } catch (g) {
        _("[htmlBuilder] code element cleanup failed", g);
      }
    });
  } catch (d) {
    _("[htmlBuilder] processing code elements failed", d);
  }
  try {
    os(s);
  } catch (d) {
    _("[htmlBuilder] observeCodeBlocks failed", d);
  }
  rl(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((f) => {
      try {
        const g = f.parentElement;
        if (!g || g.tagName.toLowerCase() !== "p" || g.childNodes.length !== 1) return;
        const p = document.createElement("figure");
        p.className = "image", g.replaceWith(p), p.appendChild(f);
      } catch {
      }
    });
  } catch (d) {
    _("[htmlBuilder] wrap images in Bulma image helper failed", d);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((f) => {
      try {
        if (f.classList)
          f.classList.contains("table") || f.classList.add("table");
        else {
          const g = f.getAttribute && f.getAttribute("class") ? f.getAttribute("class") : "", p = String(g || "").split(/\s+/).filter(Boolean);
          p.indexOf("table") === -1 && p.push("table");
          try {
            f.setAttribute && f.setAttribute("class", p.join(" "));
          } catch {
            f.className = p.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (d) {
    _("[htmlBuilder] add Bulma table class failed", d);
  }
  const { topH1: l, h1Text: o, slugKey: u } = il(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const f = a.meta.author ? String(a.meta.author).trim() : "", g = a.meta.date ? String(a.meta.date).trim() : "";
      let p = "";
      try {
        const b = new Date(g);
        g && !isNaN(b.getTime()) ? p = b.toLocaleDateString() : p = g;
      } catch {
        p = g;
      }
      const h = [];
      if (f && h.push(f), p && h.push(p), h.length) {
        const b = document.createElement("p"), m = h[0] ? String(h[0]).replace(/"/g, "").trim() : "", w = h.slice(1);
        if (b.className = "nimbi-article-subtitle is-6 has-text-grey-light", m) {
          const y = document.createElement("span");
          y.className = "nimbi-article-author", y.textContent = m, b.appendChild(y);
        }
        if (w.length) {
          const y = document.createElement("span");
          y.className = "nimbi-article-meta", y.textContent = w.join(" • "), b.appendChild(y);
        }
        try {
          l.parentElement.insertBefore(b, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await fl(s, r, n);
  } catch (d) {
    Jo("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", d), await Kr(s, r, n);
  }
  const c = nl(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: u };
}
function ul(e) {
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
function Ii(e, t, n) {
  e && (e.innerHTML = "");
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
          o.href = ze(gt);
        } catch {
          o.href = ze(gt || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Fn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, oe, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const Ta = ps(() => {
  const e = un(Vo);
  if (e)
    try {
      if (!(typeof process < "u" && process.env && process.env.VITEST)) return e;
    } catch {
      return e;
    }
  const t = { message: [], error: [] };
  return {
    addEventListener(n, i) {
      t[n] || (t[n] = []), t[n].push(i);
    },
    removeEventListener(n, i) {
      if (!t[n]) return;
      const r = t[n].indexOf(i);
      r !== -1 && t[n].splice(r, 1);
    },
    postMessage(n) {
      setTimeout(async () => {
        try {
          const r = { data: await Yo(n) };
          (t.message || []).forEach((a) => a(r));
        } catch (i) {
          const r = { data: { id: n && n.id, error: String(i) } };
          (t.message || []).forEach((a) => a(r));
        }
      }, 0);
    },
    terminate() {
      Object.keys(t).forEach((n) => t[n].length = 0);
    }
  };
}, "anchor");
function hl() {
  return Ta.get();
}
function dl(e) {
  return Ta.send(e, 2e3);
}
async function fl(e, t, n) {
  if (!hl()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await dl({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      _("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function pl(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = nt(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
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
                history.replaceState({ page: l || a }, "", ut(l || a, s));
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
            Rr(s);
          } catch (o) {
            _("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", ut(a, s));
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
function Rr(e) {
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
function gl(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((h) => typeof h == "string" ? h : ""), o = i || document.querySelector(".nimbi-cms"), u = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), d = a || document.querySelector(".nimbi-nav-wrap");
    let g = document.querySelector(".nimbi-scroll-top");
    if (!g) {
      g = document.createElement("button"), g.className = "nimbi-scroll-top button is-primary is-rounded is-small", g.setAttribute("aria-label", l("scrollToTop")), g.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(g) : o && o.appendChild ? o.appendChild(g) : u && u.appendChild ? u.appendChild(g) : document.body.appendChild(g);
      } catch {
        try {
          document.body.appendChild(g);
        } catch (b) {
          _("[htmlBuilder] append scroll top button failed", b);
        }
      }
      try {
        try {
          Wi(g);
        } catch {
        }
      } catch (h) {
        _("[htmlBuilder] set scroll-top button theme registration failed", h);
      }
      g.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (b) {
            _("[htmlBuilder] fallback container scrollTop failed", b);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (b) {
            _("[htmlBuilder] fallback mountEl scrollTop failed", b);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (b) {
            _("[htmlBuilder] fallback document scrollTop failed", b);
          }
        }
      });
    }
    const p = d && d.querySelector ? d.querySelector(".menu-label") : null;
    if (t) {
      if (!g._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const h = globalThis.IntersectionObserver, b = new h((m) => {
            for (const w of m)
              w.target instanceof Element && (w.isIntersecting ? (g.classList.remove("show"), p && p.classList.remove("show")) : (g.classList.add("show"), p && p.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          g._nimbiObserver = b;
        } else
          g._nimbiObserver = null;
      try {
        g._nimbiObserver && typeof g._nimbiObserver.disconnect == "function" && g._nimbiObserver.disconnect();
      } catch (h) {
        _("[htmlBuilder] observer disconnect failed", h);
      }
      try {
        g._nimbiObserver && typeof g._nimbiObserver.observe == "function" && g._nimbiObserver.observe(t);
      } catch (h) {
        _("[htmlBuilder] observer observe failed", h);
      }
      try {
        const h = () => {
          try {
            const b = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, m = t.getBoundingClientRect();
            !(m.bottom < b.top || m.top > b.bottom) ? (g.classList.remove("show"), p && p.classList.remove("show")) : (g.classList.add("show"), p && p.classList.add("show"));
          } catch (b) {
            _("[htmlBuilder] checkIntersect failed", b);
          }
        };
        h(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(h, 100);
      } catch (h) {
        _("[htmlBuilder] checkIntersect outer failed", h);
      }
    } else {
      g.classList.remove("show"), p && p.classList.remove("show");
      const h = i instanceof Element ? i : r instanceof Element ? r : window, b = () => {
        try {
          (h === window ? window.scrollY : h.scrollTop || 0) > 10 ? (g.classList.add("show"), p && p.classList.add("show")) : (g.classList.remove("show"), p && p.classList.remove("show"));
        } catch (m) {
          _("[htmlBuilder] onScroll handler failed", m);
        }
      };
      Qn(() => h.addEventListener("scroll", b)), b();
    }
  } catch (l) {
    _("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Qt(e, t) {
  try {
    if (typeof Je == "function")
      try {
        Je(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && H && typeof H.set == "function" && H.set(t, e);
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
          Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
      } catch {
      }
  } catch {
  }
}
function Oi(e, t) {
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
function ml(e) {
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
            const l = K(String(t.path || ""));
            if (a = findSlugForPath(l) || (H && H.has(l) ? H.get(l) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = ue(String(t.title).trim());
              else {
                const o = l.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = ue(o || l);
              }
          } else if (r) {
            const l = String(n).replace(/\.(?:md|html?)$/i, ""), o = findSlugForPath(l) || (H && H.has(l) ? H.get(l) : "") || "";
            o ? a = o : t.title && String(t.title).trim() ? a = ue(String(t.title).trim()) : a = ue(l);
          } else
            !n && t.title && String(t.title).trim() ? a = ue(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? ue(String(t.title).trim()) : n ? ue(n) : "";
          } catch {
            a = n;
          }
        }
        let s = a || "";
        i && (s = s ? `${s}::${i}` : `${ue(i)}`), s && (t.slug = s);
        try {
          if (t.path && s) {
            const l = String(s).split("::")[0];
            try {
              Qt(l, K(String(t.path || "")));
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
async function yl(e, t, n, i, r, a, s, l, o = "eager", u = 1, c = void 0, d = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const f = typeof DOMParser < "u" ? new DOMParser() : null, g = f ? f.parseFromString(n || "", "text/html") : null, p = g ? g.querySelectorAll("a") : [];
  await Qn(() => al(p, i)), await Qn(() => sl(p, i));
  try {
    Te(p, i);
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
  let h = null, b = null, m = null, w = null, y = null, k = null, S = !1, v = null;
  const R = /* @__PURE__ */ new Map();
  function Z() {
    try {
      const C = document.querySelector(".navbar-burger"), N = C && C.dataset ? C.dataset.target : null, M = N ? document.getElementById(N) : null;
      C && C.classList.contains("is-active") && (C.classList.remove("is-active"), C.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active"));
    } catch (C) {
      _("[nimbi-cms] closeMobileMenu failed", C);
    }
  }
  async function $() {
    const C = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      C && C.classList.add("is-inactive");
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
              C && C.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            C && C.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          C && C.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function ee(C) {
    try {
      let N = C && typeof C.slug == "string" ? String(C.slug) : "", M = null;
      try {
        N && N.indexOf("::") !== -1 && (M = N.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (C && C.path && typeof C.path == "string") {
          const L = K(String(C.path || "")), T = L.replace(/^.*\//, "");
          try {
            if (R && R.has(L)) return { page: R.get(L), hash: M };
            if (R && R.has(T)) return { page: R.get(T), hash: M };
          } catch {
          }
          try {
            if (H && H.has(L)) return { page: H.get(L), hash: M };
          } catch {
          }
          try {
            const O = ie(L);
            if (O) return { page: O, hash: M };
          } catch {
          }
        }
      } catch {
      }
      if (N && N.indexOf("::") !== -1) {
        const L = N.split("::");
        N = L[0] || "", M = L.slice(1).join("::") || null;
      }
      if (N && (N.includes(".") || N.includes("/"))) {
        const L = K(C && C.path ? String(C.path) : N), T = L.replace(/^.*\//, "");
        try {
          if (R && R.has(L)) return { page: R.get(L), hash: M };
          if (R && R.has(T)) return { page: R.get(T), hash: M };
        } catch {
        }
        try {
          let O = ie(L);
          if (!O)
            try {
              const W = String(L || "").replace(/^\/+/, ""), P = W.replace(/^.*\//, "");
              for (const [B, E] of V.entries())
                try {
                  let q = null;
                  if (typeof E == "string" ? q = K(String(E || "")) : E && typeof E == "object" && (E.default ? q = K(String(E.default || "")) : q = null), !q) continue;
                  if (q === W || q.endsWith("/" + W) || W.endsWith("/" + q) || q.endsWith(P) || W.endsWith(P)) {
                    O = B;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if (O) N = O;
          else
            try {
              const W = String(N).replace(/\.(?:md|html?)$/i, "");
              N = ue(W || L);
            } catch {
              N = ue(L);
            }
        } catch {
          N = ue(L);
        }
      }
      return !N && C && C.path && (N = ue(K(String(C.path || "")))), { page: N, hash: M };
    } catch {
      return { page: C && C.slug || "", hash: null };
    }
  }
  const z = () => h || (h = (async () => {
    try {
      const C = await Promise.resolve().then(() => lt), N = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, M = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, L = Oi(C, "buildSearchIndex"), T = Oi(C, "buildSearchIndexWorker"), O = typeof N == "function" ? N : L || void 0, W = typeof M == "function" ? M : T || void 0;
      $t("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof O + " workerFn=" + typeof W + " (global preferred)");
      const P = [];
      try {
        r && P.push(r);
      } catch {
      }
      try {
        navigationPage && P.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof W == "function")
        try {
          const B = await W(i, u, c, P.length ? P : void 0);
          if (B && B.length) {
            try {
              if (C && typeof C._setSearchIndex == "function")
                try {
                  C._setSearchIndex(B);
                } catch {
                }
            } catch {
            }
            return B;
          }
        } catch (B) {
          _("[nimbi-cms] worker builder threw", B);
        }
      return typeof O == "function" ? ($t("[nimbi-cms test] calling buildFn"), await O(i, u, c, P.length ? P : void 0)) : [];
    } catch (C) {
      return _("[nimbi-cms] buildSearchIndex failed", C), [];
    } finally {
      if (b) {
        try {
          b.removeAttribute("disabled");
        } catch {
        }
        try {
          m && m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), h.then((C) => {
    try {
      try {
        v = Array.isArray(C) ? C : null;
      } catch {
        v = null;
      }
      try {
        ml(C);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const T = await Promise.resolve().then(() => lt);
                try {
                  try {
                    T && typeof T._setSearchIndex == "function" && T._setSearchIndex(Array.isArray(C) ? C : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(v) ? v : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(v) ? v : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(te) ? te : Array.isArray(v) ? v : [];
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
            window.__nimbi_indexDepth = u;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = c;
          } catch {
          }
        }
      } catch {
      }
      const N = String(b && b.value || "").trim().toLowerCase();
      if (!N || !Array.isArray(C) || !C.length) return;
      const M = C.filter((T) => T.title && T.title.toLowerCase().includes(N) || T.excerpt && T.excerpt.toLowerCase().includes(N));
      if (!M || !M.length) return;
      const L = document.getElementById("nimbi-search-results");
      if (!L) return;
      L.innerHTML = "";
      try {
        const T = document.createElement("div");
        T.className = "panel nimbi-search-panel", M.slice(0, 10).forEach((O) => {
          try {
            if (O.parentTitle) {
              const E = document.createElement("p");
              E.className = "panel-heading nimbi-search-title nimbi-search-parent", E.textContent = O.parentTitle, T.appendChild(E);
            }
            const W = document.createElement("a");
            W.className = "panel-block nimbi-search-result";
            const P = ee(O);
            W.href = ze(P.page, P.hash), W.setAttribute("role", "button");
            try {
              if (O.path && typeof O.path == "string")
                try {
                  Qt(P.page, O.path);
                } catch {
                }
            } catch {
            }
            const B = document.createElement("div");
            B.className = "is-size-6 has-text-weight-semibold", B.textContent = O.title, W.appendChild(B), W.addEventListener("click", () => {
              try {
                L.style.display = "none";
              } catch {
              }
            }), T.appendChild(W);
          } catch {
          }
        }), L.appendChild(T);
        try {
          L.style.display = "block";
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
        const C = await Promise.resolve().then(() => _n);
        try {
          await C.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: u, noIndexing: c, includeAllMarkdown: !0 });
        } catch (N) {
          _("[nimbi-cms] sitemap trigger failed", N);
        }
      } catch (C) {
        try {
          _("[nimbi-cms] sitemap dynamic import failed", C);
        } catch {
        }
      }
    })();
  }), h), D = document.createElement("nav");
  D.className = "navbar", D.setAttribute("role", "navigation"), D.setAttribute("aria-label", "main navigation");
  const ne = document.createElement("div");
  ne.className = "navbar-brand";
  const j = p[0], re = document.createElement("a");
  if (re.className = "navbar-item", j) {
    const C = j.getAttribute("href") || "#";
    try {
      const M = new URL(C, location.href).searchParams.get("page"), L = M ? decodeURIComponent(M) : r;
      let T = null;
      try {
        typeof L == "string" && (/(?:\.md|\.html?)$/i.test(L) || L.includes("/")) && (T = ie(L));
      } catch {
      }
      !T && typeof L == "string" && !String(L).includes(".") && (T = L);
      const O = T || L;
      re.href = ze(O), (!re.textContent || !String(re.textContent).trim()) && (re.textContent = a("home"));
    } catch {
      try {
        const M = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? ie(r) : typeof r == "string" && !r.includes(".") ? r : null;
        re.href = ze(M || r);
      } catch {
        re.href = ze(r);
      }
      re.textContent = a("home");
    }
  } else
    re.href = ze(r), re.textContent = a("home");
  async function A(C) {
    try {
      if (!C || C === "none") return null;
      if (C === "favicon")
        try {
          const N = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!N) return null;
          const M = N.getAttribute("href") || "";
          return M && /\.png(?:\?|$)/i.test(M) ? new URL(M, location.href).toString() : null;
        } catch {
          return null;
        }
      if (C === "copy-first" || C === "move-first")
        try {
          const N = await Me(r, i);
          if (!N || !N.raw) return null;
          const T = new DOMParser().parseFromString(N.raw, "text/html").querySelector("img");
          if (!T) return null;
          const O = T.getAttribute("src") || "";
          if (!O) return null;
          const W = new URL(O, location.href).toString();
          if (C === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", W);
            } catch {
            }
          return W;
        } catch {
          return null;
        }
      try {
        return new URL(C, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let G = null;
  try {
    G = await A(d);
  } catch {
    G = null;
  }
  if (G)
    try {
      const C = document.createElement("img");
      C.className = "nimbi-navbar-logo";
      const N = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      C.alt = N, C.title = N, C.src = G;
      try {
        C.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!re.textContent || !String(re.textContent).trim()) && (re.textContent = N);
      } catch {
      }
      try {
        re.insertBefore(C, re.firstChild);
      } catch {
        try {
          re.appendChild(C);
        } catch {
        }
      }
    } catch {
    }
  ne.appendChild(re), re.addEventListener("click", function(C) {
    const N = re.getAttribute("href") || "";
    if (N.startsWith("?page=")) {
      C.preventDefault();
      const M = new URL(N, location.href), L = M.searchParams.get("page"), T = M.hash ? M.hash.replace(/^#/, "") : null;
      history.pushState({ page: L }, "", ze(L, T)), $();
      try {
        Z();
      } catch {
      }
    }
  });
  function ie(C) {
    try {
      if (!C) return null;
      const N = K(String(C || ""));
      try {
        if (H && H.has(N)) return H.get(N);
      } catch {
      }
      const M = N.replace(/^.*\//, "");
      try {
        if (H && H.has(M)) return H.get(M);
      } catch {
      }
      try {
        for (const [L, T] of V.entries())
          if (T) {
            if (typeof T == "string") {
              if (K(T) === N) return L;
            } else if (T && typeof T == "object") {
              if (T.default && K(T.default) === N) return L;
              const O = T.langs || {};
              for (const W in O)
                if (O[W] && K(O[W]) === N) return L;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function Te(C, N) {
    try {
      if (!C || !C.length) return;
      const M = [];
      for (let P = 0; P < C.length; P++)
        try {
          const B = C[P];
          if (!B || typeof B.getAttribute != "function") continue;
          const E = B.getAttribute("href") || "";
          if (!E || xr(E)) continue;
          let q = null;
          try {
            const fe = nt(E);
            fe && fe.page && (q = fe.page);
          } catch {
          }
          if (!q) {
            const fe = String(E || "").split(/[?#]/, 1), Ae = fe && fe[0] ? fe[0] : E;
            (/\.(?:md|html?)$/i.test(Ae) || Ae.indexOf("/") !== -1) && (q = K(String(Ae || "")));
          }
          if (!q) continue;
          const Q = K(String(q || "")), U = Q.replace(/^.*\//, "");
          let pe = null;
          try {
            R && R.has(Q) && (pe = R.get(Q));
          } catch {
          }
          try {
            !pe && H && H.has(Q) && (pe = H.get(Q));
          } catch {
          }
          if (pe) continue;
          let Ce = null;
          try {
            Ce = B.textContent && String(B.textContent).trim() ? String(B.textContent).trim() : null;
          } catch {
            Ce = null;
          }
          let ye = null;
          if (Ce) ye = ue(Ce);
          else {
            const fe = U.replace(/\.(?:md|html?)$/i, "");
            ye = ue(fe || Q);
          }
          if (ye)
            try {
              M.push({ path: Q, candidate: ye });
            } catch {
            }
        } catch {
        }
      if (!M.length) return;
      const L = 3;
      let T = 0;
      const O = async () => {
        for (; T < M.length; ) {
          const P = M[T++];
          if (!(!P || !P.path))
            try {
              const B = await Me(P.path, N);
              if (!B || !B.raw) continue;
              let E = null;
              if (B.isHtml)
                try {
                  const Q = new DOMParser().parseFromString(B.raw, "text/html"), U = Q.querySelector("h1") || Q.querySelector("title");
                  U && U.textContent && (E = String(U.textContent).trim());
                } catch {
                }
              else
                try {
                  const q = B.raw.match(/^#\s+(.+)$/m);
                  q && q[1] && (E = String(q[1]).trim());
                } catch {
                }
              if (E) {
                const q = ue(E);
                if (q && q !== P.candidate) {
                  try {
                    Qt(q, P.path);
                  } catch {
                  }
                  try {
                    R.set(P.path, q);
                  } catch {
                  }
                  try {
                    R.set(P.path.replace(/^.*\//, ""), q);
                  } catch {
                  }
                  try {
                    const Q = await Promise.resolve().then(() => lt);
                    try {
                      if (Array.isArray(Q.searchIndex)) {
                        let U = !1;
                        for (const pe of Q.searchIndex)
                          try {
                            if (pe && pe.path === P.path && pe.slug) {
                              const ye = String(pe.slug).split("::").slice(1).join("::");
                              pe.slug = ye ? `${q}::${ye}` : q, U = !0;
                            }
                          } catch {
                          }
                        try {
                          U && typeof Q._setSearchIndex == "function" && Q._setSearchIndex(Q.searchIndex);
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
      }, W = [];
      for (let P = 0; P < L; P++) W.push(O());
      try {
        await Promise.all(W);
      } catch {
      }
    } catch {
    }
  }
  const Y = document.createElement("a");
  Y.className = "navbar-burger", Y.setAttribute("role", "button"), Y.setAttribute("aria-label", "menu"), Y.setAttribute("aria-expanded", "false");
  const ge = "nimbi-navbar-menu";
  Y.dataset.target = ge, Y.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', ne.appendChild(Y);
  try {
    Y.addEventListener("click", (C) => {
      try {
        const N = Y.dataset && Y.dataset.target ? Y.dataset.target : null, M = N ? document.getElementById(N) : null;
        Y.classList.contains("is-active") ? (Y.classList.remove("is-active"), Y.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active")) : (Y.classList.add("is-active"), Y.setAttribute("aria-expanded", "true"), M && M.classList.add("is-active"));
      } catch (N) {
        _("[nimbi-cms] navbar burger toggle failed", N);
      }
    });
  } catch (C) {
    _("[nimbi-cms] burger event binding failed", C);
  }
  const Se = document.createElement("div");
  Se.className = "navbar-menu", Se.id = ge;
  const $e = document.createElement("div");
  $e.className = "navbar-start";
  let Qe = null, ve = null;
  if (!l)
    Qe = null, b = null, w = null, y = null, k = null;
  else {
    Qe = document.createElement("div"), Qe.className = "navbar-end", ve = document.createElement("div"), ve.className = "navbar-item", b = document.createElement("input"), b.className = "input", b.type = "search", b.placeholder = a("searchPlaceholder") || "", b.id = "nimbi-search";
    try {
      const T = (a && typeof a == "function" ? a("searchAria") : null) || b.placeholder || "Search";
      try {
        b.setAttribute("aria-label", T);
      } catch {
      }
      try {
        b.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        b.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        b.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    o === "eager" && (b.disabled = !0), m = document.createElement("div"), m.className = "control", o === "eager" && m.classList.add("is-loading"), m.appendChild(b), ve.appendChild(m), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const C = document.createElement("div");
    C.className = "dropdown-trigger", C.appendChild(ve);
    const N = document.createElement("div");
    N.className = "dropdown-menu", N.setAttribute("role", "menu"), y = document.createElement("div"), y.id = "nimbi-search-results", y.className = "dropdown-content nimbi-search-results", k = y, N.appendChild(y), w.appendChild(C), w.appendChild(N), Qe.appendChild(w);
    const M = (T) => {
      if (!y) return;
      y.innerHTML = "";
      let O = -1;
      function W(E) {
        try {
          const q = y.querySelector(".nimbi-search-result.is-selected");
          q && q.classList.remove("is-selected");
          const Q = y.querySelectorAll(".nimbi-search-result");
          if (!Q || !Q.length) return;
          if (E < 0) {
            O = -1;
            return;
          }
          E >= Q.length && (E = Q.length - 1);
          const U = Q[E];
          if (U) {
            U.classList.add("is-selected"), O = E;
            try {
              U.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function P(E) {
        try {
          const q = E.key, Q = y.querySelectorAll(".nimbi-search-result");
          if (!Q || !Q.length) return;
          if (q === "ArrowDown") {
            E.preventDefault();
            const U = O < 0 ? 0 : Math.min(Q.length - 1, O + 1);
            W(U);
            return;
          }
          if (q === "ArrowUp") {
            E.preventDefault();
            const U = O <= 0 ? 0 : O - 1;
            W(U);
            return;
          }
          if (q === "Enter") {
            E.preventDefault();
            const U = y.querySelector(".nimbi-search-result.is-selected") || y.querySelector(".nimbi-search-result");
            if (U)
              try {
                U.click();
              } catch {
              }
            return;
          }
          if (q === "Escape") {
            try {
              w.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              y.style.display = "none";
            } catch {
            }
            try {
              y.classList.remove("is-open");
            } catch {
            }
            try {
              y.removeAttribute("tabindex");
            } catch {
            }
            try {
              y.removeEventListener("keydown", P);
            } catch {
            }
            try {
              b && b.focus();
            } catch {
            }
            try {
              b && b.removeEventListener("keydown", B);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function B(E) {
        try {
          if (E && E.key === "ArrowDown") {
            E.preventDefault();
            try {
              y.focus();
            } catch {
            }
            W(0);
          }
        } catch {
        }
      }
      try {
        const E = document.createElement("div");
        E.className = "panel nimbi-search-panel";
        const q = document.createDocumentFragment();
        T.forEach((Q) => {
          if (Q.parentTitle) {
            const ye = document.createElement("p");
            ye.textContent = Q.parentTitle, ye.className = "panel-heading nimbi-search-title nimbi-search-parent", q.appendChild(ye);
          }
          const U = document.createElement("a");
          U.className = "panel-block nimbi-search-result";
          const pe = ee(Q);
          U.href = ze(pe.page, pe.hash), U.setAttribute("role", "button");
          try {
            if (Q.path && typeof Q.path == "string")
              try {
                Qt(pe.page, Q.path);
              } catch {
              }
          } catch {
          }
          const Ce = document.createElement("div");
          Ce.className = "is-size-6 has-text-weight-semibold", Ce.textContent = Q.title, U.appendChild(Ce), U.addEventListener("click", (ye) => {
            try {
              try {
                ye && ye.preventDefault && ye.preventDefault();
              } catch {
              }
              try {
                ye && ye.stopPropagation && ye.stopPropagation();
              } catch {
              }
              if (w) {
                w.classList.remove("is-active");
                try {
                  document.documentElement.classList.remove("nimbi-search-open");
                } catch {
                }
              }
              try {
                y.style.display = "none";
              } catch {
              }
              try {
                y.classList.remove("is-open");
              } catch {
              }
              try {
                y.removeAttribute("tabindex");
              } catch {
              }
              try {
                y.removeEventListener("keydown", P);
              } catch {
              }
              try {
                b && b.removeEventListener("keydown", B);
              } catch {
              }
              try {
                const fe = U.getAttribute && U.getAttribute("href") || "";
                let Ae = null, Ze = null;
                try {
                  const qe = new URL(fe, location.href);
                  Ae = qe.searchParams.get("page"), Ze = qe.hash ? qe.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Ae)
                  try {
                    history.pushState({ page: Ae }, "", ze(Ae, Ze));
                    try {
                      $();
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
                window.location.href = U.href;
              } catch {
              }
            } catch {
            }
          }), q.appendChild(U);
        }), E.appendChild(q), y.appendChild(E);
      } catch {
      }
      if (w) {
        w.classList.add("is-active");
        try {
          document.documentElement.classList.add("nimbi-search-open");
        } catch {
        }
      }
      try {
        y.style.display = "block";
      } catch {
      }
      try {
        y.classList.add("is-open");
      } catch {
      }
      try {
        y.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        y.addEventListener("keydown", P);
      } catch {
      }
      try {
        b && b.addEventListener("keydown", B);
      } catch {
      }
    }, L = (T, O) => {
      let W = null;
      return (...P) => {
        W && clearTimeout(W), W = setTimeout(() => T(...P), O);
      };
    };
    if (b) {
      const T = L(async () => {
        const O = document.querySelector("input#nimbi-search"), W = String(O && O.value || "").trim().toLowerCase();
        if (!W) {
          M([]);
          return;
        }
        try {
          await z();
          const P = await h, B = Array.isArray(P) ? P.filter((E) => E.title && E.title.toLowerCase().includes(W) || E.excerpt && E.excerpt.toLowerCase().includes(W)) : [];
          M(B.slice(0, 10));
        } catch (P) {
          _("[nimbi-cms] search input handler failed", P), M([]);
        }
      }, 50);
      try {
        b.addEventListener("input", T);
      } catch {
      }
      try {
        document.addEventListener("input", (O) => {
          try {
            O && O.target && O.target.id === "nimbi-search" && T(O);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        h = z();
      } catch (T) {
        _("[nimbi-cms] eager search index init failed", T), h = Promise.resolve([]);
      }
      h.finally(() => {
        const T = document.querySelector("input#nimbi-search");
        if (T) {
          try {
            T.removeAttribute("disabled");
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
            const O = await h.catch(() => []), W = await Promise.resolve().then(() => _n);
            try {
              await W.handleSitemapRequest({ index: Array.isArray(O) ? O : void 0, homePage: r, contentBase: i, indexDepth: u, noIndexing: c, includeAllMarkdown: !0 });
            } catch (P) {
              _("[nimbi-cms] sitemap trigger failed", P);
            }
          } catch (O) {
            try {
              _("[nimbi-cms] sitemap dynamic import failed", O);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const T = (O) => {
        try {
          const W = O && O.target;
          if (!k || !k.classList.contains("is-open") && k.style && k.style.display !== "block" || W && (k.contains(W) || b && (W === b || b.contains && b.contains(W)))) return;
          if (w) {
            w.classList.remove("is-active");
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
      document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
    } catch {
    }
  }
  const rt = document.createDocumentFragment();
  for (let C = 0; C < p.length; C++) {
    const N = p[C];
    if (C === 0) continue;
    const M = N.getAttribute("href") || "#";
    let L = M;
    const T = document.createElement("a");
    T.className = "navbar-item";
    try {
      let O = null;
      try {
        O = nt(String(M || ""));
      } catch {
        O = null;
      }
      let W = null, P = null;
      if (O && (O.type === "canonical" && O.page || O.type === "cosmetic" && O.page) && (W = O.page, P = O.anchor), W && (/\.(?:md|html?)$/i.test(W) || W.includes("/") ? L = W : T.href = ze(W, P)), /^[^#]*\.md(?:$|[#?])/.test(L) || L.endsWith(".md")) {
        const E = K(L).split(/::|#/, 2), q = E[0], Q = E[1], U = ie(q);
        U ? T.href = ze(U, Q) : T.href = ze(q, Q);
      } else if (/\.html(?:$|[#?])/.test(L) || L.endsWith(".html")) {
        const E = K(L).split(/::|#/, 2);
        let q = E[0];
        q && !q.toLowerCase().endsWith(".html") && (q = q + ".html");
        const Q = E[1], U = ie(q);
        if (U)
          T.href = ze(U, Q);
        else
          try {
            const pe = await Me(q, i);
            if (pe && pe.raw)
              try {
                const ye = new DOMParser().parseFromString(pe.raw, "text/html"), fe = ye.querySelector("title"), Ae = ye.querySelector("h1"), Ze = fe && fe.textContent && fe.textContent.trim() ? fe.textContent.trim() : Ae && Ae.textContent ? Ae.textContent.trim() : null;
                if (Ze) {
                  const qe = ue(Ze);
                  if (qe) {
                    try {
                      Qt(qe, q);
                    } catch (mt) {
                      _("[nimbi-cms] slugToMd/mdToSlug set failed", mt);
                    }
                    T.href = ze(qe, Q);
                  } else
                    T.href = ze(q, Q);
                } else
                  T.href = ze(q, Q);
              } catch {
                T.href = ze(q, Q);
              }
            else
              T.href = L;
          } catch {
            T.href = L;
          }
      } else
        T.href = L;
    } catch (O) {
      _("[nimbi-cms] nav item href parse failed", O), T.href = L;
    }
    try {
      const O = N.textContent && String(N.textContent).trim() ? String(N.textContent).trim() : null;
      if (O)
        try {
          const W = ue(O);
          if (W) {
            const P = T.getAttribute("href") || "";
            let B = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(P))
              B = K(String(P || "").split(/[?#]/)[0]);
            else
              try {
                const E = nt(P);
                E && E.type === "canonical" && E.page && (B = K(E.page));
              } catch {
              }
            if (B) {
              let E = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String(B || "")))
                  E = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String(B || "")))
                  E = !1;
                else {
                  const q = String(B || "").replace(/^\.\//, ""), Q = q.replace(/^.*\//, "");
                  Pe && Pe.size && (Pe.has(q) || Pe.has(Q)) && (E = !0);
                }
              } catch {
                E = !1;
              }
              if (E)
                try {
                  const q = K(String(B || "").split(/[?#]/)[0]);
                  let Q = !1;
                  try {
                    ie && typeof ie == "function" && ie(q) && (Q = !0);
                  } catch {
                  }
                  try {
                    Qt(W, B);
                  } catch {
                  }
                  try {
                    if (q) {
                      try {
                        R.set(q, W);
                      } catch {
                      }
                      try {
                        const U = q.replace(/^.*\//, "");
                        U && R.set(U, W);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Q)
                    try {
                      T.href = ze(W);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (W) {
          _("[nimbi-cms] nav slug mapping failed", W);
        }
    } catch (O) {
      _("[nimbi-cms] nav slug mapping failed", O);
    }
    T.textContent = N.textContent || L, rt.appendChild(T);
  }
  try {
    $e.appendChild(rt);
  } catch {
  }
  Se.appendChild($e), Qe && Se.appendChild(Qe), D.appendChild(ne), D.appendChild(Se), e.appendChild(D);
  try {
    const C = (N) => {
      try {
        const M = D && D.querySelector ? D.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!M || !M.classList.contains("is-active")) return;
        const L = M && M.closest ? M.closest(".navbar") : D;
        if (L && L.contains(N.target)) return;
        Z();
      } catch {
      }
    };
    document.addEventListener("click", C, !0), document.addEventListener("touchstart", C, !0);
  } catch {
  }
  try {
    Se.addEventListener("click", (C) => {
      const N = C.target && C.target.closest ? C.target.closest("a") : null;
      if (!N) return;
      const M = N.getAttribute("href") || "";
      try {
        const L = new URL(M, location.href), T = L.searchParams.get("page"), O = L.hash ? L.hash.replace(/^#/, "") : null;
        T && (C.preventDefault(), history.pushState({ page: T }, "", ze(T, O)), $());
      } catch (L) {
        _("[nimbi-cms] navbar click handler failed", L);
      }
      try {
        const L = D && D.querySelector ? D.querySelector(".navbar-burger") : null, T = L && L.dataset ? L.dataset.target : null, O = T ? document.getElementById(T) : null;
        L && L.classList.contains("is-active") && (L.classList.remove("is-active"), L.setAttribute("aria-expanded", "false"), O && O.classList.remove("is-active"));
      } catch (L) {
        _("[nimbi-cms] mobile menu close failed", L);
      }
    });
  } catch (C) {
    _("[nimbi-cms] attach content click handler failed", C);
  }
  try {
    t.addEventListener("click", (C) => {
      const N = C.target && C.target.closest ? C.target.closest("a") : null;
      if (!N) return;
      const M = N.getAttribute("href") || "";
      if (M && !xr(M))
        try {
          const L = new URL(M, location.href), T = L.searchParams.get("page"), O = L.hash ? L.hash.replace(/^#/, "") : null;
          T && (C.preventDefault(), history.pushState({ page: T }, "", ze(T, O)), $());
        } catch (L) {
          _("[nimbi-cms] container click URL parse failed", L);
        }
    });
  } catch (C) {
    _("[nimbi-cms] build navbar failed", C);
  }
  return { navbar: D, linkEls: p };
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
let Ye = null, he = null, We = 1, _t = (e, t) => t, yn = 0, bn = 0, Wn = () => {
}, cn = 0.25;
function bl() {
  if (Ye && document.contains(Ye)) return Ye;
  Ye = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", _t("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (A) => {
    A.target === e && wr();
  }), e.addEventListener("wheel", (A) => {
    if (!ee()) return;
    A.preventDefault();
    const G = A.deltaY < 0 ? cn : -cn;
    At(We + G), u(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (A) => {
    if (A.key === "Escape") {
      wr();
      return;
    }
    if (We > 1) {
      const G = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!G) return;
      const ie = 40;
      switch (A.key) {
        case "ArrowUp":
          G.scrollTop -= ie, A.preventDefault();
          break;
        case "ArrowDown":
          G.scrollTop += ie, A.preventDefault();
          break;
        case "ArrowLeft":
          G.scrollLeft -= ie, A.preventDefault();
          break;
        case "ArrowRight":
          G.scrollLeft += ie, A.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Ye = e, he = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function u() {
    l && (l.textContent = `${Math.round(We * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(We * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Wn = u, i.addEventListener("click", () => {
    At(We + cn), u(), c();
  }), r.addEventListener("click", () => {
    At(We - cn), u(), c();
  }), t.addEventListener("click", () => {
    wn(), u(), c();
  }), n.addEventListener("click", () => {
    At(1), u(), c();
  }), a.addEventListener("click", () => {
    wn(), u(), c();
  }), s.addEventListener("click", wr), t.title = _t("imagePreviewFit", "Fit to screen"), n.title = _t("imagePreviewOriginal", "Original size"), r.title = _t("imagePreviewZoomOut", "Zoom out"), i.title = _t("imagePreviewZoomIn", "Zoom in"), s.title = _t("imagePreviewClose", "Close"), s.setAttribute("aria-label", _t("imagePreviewClose", "Close"));
  let d = !1, f = 0, g = 0, p = 0, h = 0;
  const b = /* @__PURE__ */ new Map();
  let m = 0, w = 1;
  const y = (A, G) => {
    const ie = A.x - G.x, Te = A.y - G.y;
    return Math.hypot(ie, Te);
  }, k = () => {
    d = !1, b.clear(), m = 0, he && (he.classList.add("is-panning"), he.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, R = 0;
  const Z = (A) => {
    const G = Date.now(), ie = G - S, Te = A.clientX - v, Y = A.clientY - R;
    S = G, v = A.clientX, R = A.clientY, ie < 300 && Math.hypot(Te, Y) < 30 && (At(We > 1 ? 1 : 2), u(), A.preventDefault());
  }, $ = (A) => {
    At(We > 1 ? 1 : 2), u(), A.preventDefault();
  }, ee = () => Ye ? typeof Ye.open == "boolean" ? Ye.open : Ye.classList.contains("is-active") : !1, z = (A, G, ie = 1) => {
    if (b.has(ie) && b.set(ie, { x: A, y: G }), b.size === 2) {
      const Se = Array.from(b.values()), $e = y(Se[0], Se[1]);
      if (m > 0) {
        const Qe = $e / m;
        At(w * Qe);
      }
      return;
    }
    if (!d) return;
    const Te = he.closest(".nimbi-image-preview__image-wrapper");
    if (!Te) return;
    const Y = A - f, ge = G - g;
    Te.scrollLeft = p - Y, Te.scrollTop = h - ge;
  }, D = (A, G, ie = 1) => {
    if (!ee()) return;
    if (b.set(ie, { x: A, y: G }), b.size === 2) {
      const ge = Array.from(b.values());
      m = y(ge[0], ge[1]), w = We;
      return;
    }
    const Te = he.closest(".nimbi-image-preview__image-wrapper");
    !Te || !(Te.scrollWidth > Te.clientWidth || Te.scrollHeight > Te.clientHeight) || (d = !0, f = A, g = G, p = Te.scrollLeft, h = Te.scrollTop, he.classList.add("is-panning"), he.classList.remove("is-grabbing"), window.addEventListener("pointermove", ne), window.addEventListener("pointerup", j), window.addEventListener("pointercancel", j));
  }, ne = (A) => {
    d && (A.preventDefault(), z(A.clientX, A.clientY, A.pointerId));
  }, j = () => {
    k(), window.removeEventListener("pointermove", ne), window.removeEventListener("pointerup", j), window.removeEventListener("pointercancel", j);
  };
  he.addEventListener("pointerdown", (A) => {
    A.preventDefault(), D(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointermove", (A) => {
    (d || b.size === 2) && A.preventDefault(), z(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointerup", (A) => {
    A.preventDefault(), A.pointerType === "touch" && Z(A), k();
  }), he.addEventListener("dblclick", $), he.addEventListener("pointercancel", k), he.addEventListener("mousedown", (A) => {
    A.preventDefault(), D(A.clientX, A.clientY, 1);
  }), he.addEventListener("mousemove", (A) => {
    d && A.preventDefault(), z(A.clientX, A.clientY, 1);
  }), he.addEventListener("mouseup", (A) => {
    A.preventDefault(), k();
  });
  const re = e.querySelector(".nimbi-image-preview__image-wrapper");
  return re && (re.addEventListener("pointerdown", (A) => {
    if (D(A.clientX, A.clientY, A.pointerId), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), re.addEventListener("pointermove", (A) => {
    z(A.clientX, A.clientY, A.pointerId);
  }), re.addEventListener("pointerup", k), re.addEventListener("pointercancel", k), re.addEventListener("mousedown", (A) => {
    if (D(A.clientX, A.clientY, 1), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), re.addEventListener("mousemove", (A) => {
    z(A.clientX, A.clientY, 1);
  }), re.addEventListener("mouseup", k)), e;
}
function At(e) {
  if (!he) return;
  const t = Number(e);
  We = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = he.getBoundingClientRect(), r = yn || he.naturalWidth || he.width || i.width || 0, a = bn || he.naturalHeight || he.height || i.height || 0;
  if (r && a) {
    he.style.setProperty("--nimbi-preview-img-max-width", "none"), he.style.setProperty("--nimbi-preview-img-max-height", "none"), he.style.setProperty("--nimbi-preview-img-width", `${r * We}px`), he.style.setProperty("--nimbi-preview-img-height", `${a * We}px`), he.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      he.style.width = `${r * We}px`, he.style.height = `${a * We}px`, he.style.transform = "none";
    } catch {
    }
  } else {
    he.style.setProperty("--nimbi-preview-img-max-width", ""), he.style.setProperty("--nimbi-preview-img-max-height", ""), he.style.setProperty("--nimbi-preview-img-width", ""), he.style.setProperty("--nimbi-preview-img-height", ""), he.style.setProperty("--nimbi-preview-img-transform", `scale(${We})`);
    try {
      he.style.transform = `scale(${We})`;
    } catch {
    }
  }
  he && (he.classList.add("is-panning"), he.classList.remove("is-grabbing"));
}
function wn() {
  if (!he) return;
  const e = he.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = yn || he.naturalWidth || t.width, i = bn || he.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  At(Number.isFinite(s) ? s : 1);
}
function wl(e, t = "", n = 0, i = 0) {
  const r = bl();
  We = 1, yn = n || 0, bn = i || 0, he.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", u = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = _t("imagePreviewDefaultAlt", u || "Image");
      } catch {
        t = _t("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  he.alt = t, he.style.transform = "scale(1)";
  const a = () => {
    yn = he.naturalWidth || he.width || 0, bn = he.naturalHeight || he.height || 0;
  };
  if (a(), wn(), Wn(), requestAnimationFrame(() => {
    wn(), Wn();
  }), !yn || !bn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        wn(), Wn();
      }), he.removeEventListener("load", s);
    };
    he.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function wr() {
  if (Ye) {
    typeof Ye.close == "function" && Ye.open && Ye.close(), Ye.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function _l(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  _t = (g, p) => (typeof t == "function" ? t(g) : void 0) || p, cn = n, e.addEventListener("click", (g) => {
    const p = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!p || p.tagName !== "IMG") return;
    const h = (
      /** @type {HTMLImageElement} */
      p
    );
    if (!h.src) return;
    const b = h.closest("a");
    b && b.getAttribute("href") || wl(h.src, h.alt || "", h.naturalWidth || 0, h.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let u = 0, c = 1;
  const d = (g, p) => {
    const h = g.x - p.x, b = g.y - p.y;
    return Math.hypot(h, b);
  };
  e.addEventListener("pointerdown", (g) => {
    const p = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!p || p.tagName !== "IMG") return;
    const h = p.closest("a");
    if (h && h.getAttribute("href") || !Ye || !Ye.open) return;
    if (o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      const m = Array.from(o.values());
      u = d(m[0], m[1]), c = We;
      return;
    }
    const b = p.closest(".nimbi-image-preview__image-wrapper");
    if (b && !(We <= 1)) {
      g.preventDefault(), i = !0, r = g.clientX, a = g.clientY, s = b.scrollLeft, l = b.scrollTop, p.setPointerCapture(g.pointerId);
      try {
        p.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (g) => {
    if (o.has(g.pointerId) && o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      g.preventDefault();
      const y = Array.from(o.values()), k = d(y[0], y[1]);
      if (u > 0) {
        const S = k / u;
        At(c * S);
      }
      return;
    }
    if (!i) return;
    g.preventDefault();
    const p = (
      /** @type {HTMLElement} */
      g.target
    ), h = p.closest && p.closest("a");
    if (h && h.getAttribute && h.getAttribute("href")) return;
    const b = p.closest(".nimbi-image-preview__image-wrapper");
    if (!b) return;
    const m = g.clientX - r, w = g.clientY - a;
    b.scrollLeft = s - m, b.scrollTop = l - w;
  });
  const f = () => {
    i = !1, o.clear(), u = 0;
    try {
      const g = document.querySelector("[data-nimbi-preview-image]");
      g && (g.classList.add("is-panning"), g.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", f), e.addEventListener("pointercancel", f);
}
function kl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: u
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const d = tl(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  let f = !1, g = !1;
  async function p(y, k) {
    let S, v, R;
    try {
      ({ data: S, pagePath: v, anchor: R } = await Gs(y, s));
    } catch (j) {
      const re = j && j.message ? String(j.message) : "", A = (!oe || typeof oe != "string" || !oe) && /no page data/i.test(re);
      try {
        if (A)
          try {
            _("[nimbi-cms] fetchPageData (expected missing)", j);
          } catch {
          }
        else
          try {
            Zn("[nimbi-cms] fetchPageData failed", j);
          } catch {
          }
      } catch {
      }
      try {
        !oe && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Ii(t, a, j);
      return;
    }
    !R && k && (R = k);
    try {
      Rr(null);
    } catch (j) {
      _("[nimbi-cms] scrollToAnchorOrTop failed", j);
    }
    t.innerHTML = "";
    const { article: Z, parsed: $, toc: ee, topH1: z, h1Text: D, slugKey: ne } = await cl(a, S, v, R, s);
    Hs(a, o, $, ee, Z, v, R, z, D, ne, S), n.innerHTML = "", ee && (n.appendChild(ee), pl(ee));
    try {
      await u("transformHtml", { article: Z, parsed: $, toc: ee, pagePath: v, anchor: R, topH1: z, h1Text: D, slugKey: ne, data: S });
    } catch (j) {
      _("[nimbi-cms] transformHtml hooks failed", j);
    }
    t.appendChild(Z);
    try {
      ul(Z);
    } catch (j) {
      _("[nimbi-cms] executeEmbeddedScripts failed", j);
    }
    try {
      _l(Z, { t: a });
    } catch (j) {
      _("[nimbi-cms] attachImagePreview failed", j);
    }
    try {
      Nn(i, 100, !1), requestAnimationFrame(() => Nn(i, 100, !1)), setTimeout(() => Nn(i, 100, !1), 250);
    } catch (j) {
      _("[nimbi-cms] setEagerForAboveFoldImages failed", j);
    }
    Rr(R), gl(Z, z, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await u("onPageLoad", { data: S, pagePath: v, anchor: R, article: Z, toc: ee, topH1: z, h1Text: D, slugKey: ne, contentWrap: t, navWrap: n });
    } catch (j) {
      _("[nimbi-cms] onPageLoad hooks failed", j);
    }
    c = v;
  }
  async function h() {
    if (f) {
      g = !0;
      return;
    }
    f = !0;
    try {
      try {
        ji("renderByQuery");
      } catch {
      }
      try {
        Di("renderByQuery");
      } catch {
      }
      let y = nt(location.href);
      if (y && y.type === "path" && y.page)
        try {
          let v = "?page=" + encodeURIComponent(y.page || "");
          y.params && (v += (v.includes("?") ? "&" : "?") + y.params), y.anchor && (v += "#" + encodeURIComponent(y.anchor));
          try {
            history.replaceState(history.state, "", v);
          } catch {
            try {
              history.replaceState({}, "", v);
            } catch {
            }
          }
          y = nt(location.href);
        } catch {
        }
      const k = y && y.page ? y.page : l, S = y && y.anchor ? y.anchor : null;
      await p(k, S);
    } catch (y) {
      _("[nimbi-cms] renderByQuery failed", y);
      try {
        !oe && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Ii(t, a, y);
    } finally {
      if (f = !1, g) {
        g = !1;
        try {
          await h();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", h);
  const b = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const y = i || document.querySelector(".nimbi-cms");
      if (!y) return;
      const k = {
        top: y.scrollTop || 0,
        left: y.scrollLeft || 0
      };
      sessionStorage.setItem(b(), JSON.stringify(k));
    } catch (y) {
      _("[nimbi-cms] save scroll position failed", y);
    }
  }, w = () => {
    try {
      const y = i || document.querySelector(".nimbi-cms");
      if (!y) return;
      const k = sessionStorage.getItem(b());
      if (!k) return;
      const S = JSON.parse(k);
      S && typeof S.top == "number" && y.scrollTo({ top: S.top, left: S.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (y) => {
    if (y.persisted)
      try {
        w(), Nn(i, 100, !1);
      } catch (k) {
        _("[nimbi-cms] bfcache restore failed", k);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      _("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: h, siteNav: d, getCurrentPagePath: () => c };
}
function xl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = nt(window.location.href);
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
    if (n.has("availableLanguages") && (i.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("indexDepth")) {
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
function _r(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function Sl(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let jn = "";
async function Il(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = xl();
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
      di(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const z = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(z) && di(Math.max(0, Math.min(3, Math.floor(z))));
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
    noIndexing: u = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: d = "none",
    lang: f = void 0,
    l10nFile: g = null,
    cacheTtlMinutes: p = 5,
    cacheMaxEntries: h,
    markdownExtensions: b,
    availableLanguages: m,
    homePage: w = null,
    notFoundPage: y = null,
    navigationPage: k = "_navigation.md",
    exposeSitemap: S = !0
  } = n;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof y == "string" && y.startsWith("./") && (y = y.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: R = !1 } = n, Z = (z) => {
    try {
      const D = document.querySelector(i);
      D && D instanceof Element && (D.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(z)}</pre></div>`);
    } catch {
    }
  };
  if (n.contentPath != null && !Sl(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !_r(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (y != null && !_r(y))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !_r(k))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let $ = i;
  if (typeof i == "string") {
    if ($ = document.querySelector(i), !$) throw new Error(`el selector "${i}" did not match any element`);
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
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (g != null && typeof g != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (p != null && (typeof p != "number" || !Number.isFinite(p) || p < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (h != null && (typeof h != "number" || !Number.isInteger(h) || h < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some((z) => !z || typeof z != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (m != null && (!Array.isArray(m) || m.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (R != null && typeof R != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (y != null && (typeof y != "string" || !y.trim() || !/\.(md|html)$/.test(y)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ee = !!s;
  try {
    Promise.resolve().then(() => lt).then((z) => {
      try {
        z && typeof z.setSkipRootReadme == "function" && z.setSkipRootReadme(!!R);
      } catch (D) {
        _("[nimbi-cms] setSkipRootReadme failed", D);
      }
    }).catch((z) => {
    });
  } catch (z) {
    _("[nimbi-cms] setSkipRootReadme dynamic import failed", z);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && js(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(z) {
        try {
          const D = { type: "error", message: z && z.message ? String(z.message) : "", filename: z && z.filename ? String(z.filename) : "", lineno: z && z.lineno ? z.lineno : null, colno: z && z.colno ? z.colno : null, stack: z && z.error && z.error.stack ? z.error.stack : null, time: Date.now() };
          try {
            _("[nimbi-cms] runtime error", D.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(D);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(z) {
        try {
          const D = { type: "unhandledrejection", reason: z && z.reason ? String(z.reason) : "", time: Date.now() };
          try {
            _("[nimbi-cms] unhandledrejection", D.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(D);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const z = nt(typeof window < "u" ? window.location.href : ""), D = z && z.page ? z.page : w || void 0;
      try {
        D && Ds(D, jn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        $.classList.add("nimbi-mount");
      } catch (M) {
        _("[nimbi-cms] mount element setup failed", M);
      }
      const z = document.createElement("section");
      z.className = "section";
      const D = document.createElement("div");
      D.className = "container nimbi-cms";
      const ne = document.createElement("div");
      ne.className = "columns";
      const j = document.createElement("div");
      j.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", j.setAttribute("role", "navigation");
      try {
        const M = typeof ln == "function" ? ln("navigation") : null;
        M && j.setAttribute("aria-label", M);
      } catch (M) {
        _("[nimbi-cms] set nav aria-label failed", M);
      }
      ne.appendChild(j);
      const re = document.createElement("main");
      re.className = "column nimbi-content", re.setAttribute("role", "main"), ne.appendChild(re), D.appendChild(ne), z.appendChild(D);
      const A = j, G = re;
      $.appendChild(z);
      let ie = null;
      try {
        ie = $.querySelector(".nimbi-overlay"), ie || (ie = document.createElement("div"), ie.className = "nimbi-overlay", $.appendChild(ie));
      } catch (M) {
        ie = null, _("[nimbi-cms] mount overlay setup failed", M);
      }
      const Te = location.pathname || "/";
      let Y;
      if (Te.endsWith("/"))
        Y = Te;
      else {
        const M = Te.substring(Te.lastIndexOf("/") + 1);
        M && !M.includes(".") ? Y = Te + "/" : Y = Te.substring(0, Te.lastIndexOf("/") + 1);
      }
      try {
        jn = document.title || "";
      } catch (M) {
        jn = "", _("[nimbi-cms] read initial document title failed", M);
      }
      let ge = r;
      const Se = Object.prototype.hasOwnProperty.call(n, "contentPath"), $e = typeof location < "u" && location.origin ? location.origin : "http://localhost", Qe = new URL(Y, $e).toString();
      (ge === "." || ge === "./") && (ge = "");
      try {
        ge = String(ge || "").replace(/\\/g, "/");
      } catch {
        ge = String(ge || "");
      }
      ge.startsWith("/") && (ge = ge.replace(/^\/+/, "")), ge && !ge.endsWith("/") && (ge = ge + "/");
      try {
        if (ge && Y && Y !== "/") {
          const M = Y.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          M && ge.startsWith(M) && (ge = ge.slice(M.length));
        }
      } catch {
      }
      try {
        if (ge)
          var ve = new URL(ge, Qe.endsWith("/") ? Qe : Qe + "/").toString();
        else
          var ve = Qe;
      } catch {
        try {
          if (ge) var ve = new URL("/" + ge, $e).toString();
          else var ve = new URL(Y, $e).toString();
        } catch {
          var ve = $e;
        }
      }
      if (g && await Gi(g, Y), m && Array.isArray(m) && Ki(m), f && Qi(f), typeof p == "number" && p >= 0 && typeof xi == "function" && xi(p * 60 * 1e3), typeof h == "number" && h >= 0 && typeof ki == "function" && ki(h), b && Array.isArray(b) && b.length)
        try {
          b.forEach((M) => {
            typeof M == "object" && Ma && typeof Tr == "function" && Tr(M);
          });
        } catch (M) {
          _("[nimbi-cms] applying markdownExtensions failed", M);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => lt).then(({ setDefaultCrawlMaxQueue: M }) => {
          try {
            M(a);
          } catch (L) {
            _("[nimbi-cms] setDefaultCrawlMaxQueue failed", L);
          }
        });
      } catch (M) {
        _("[nimbi-cms] setDefaultCrawlMaxQueue import failed", M);
      }
      try {
        try {
          const M = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (M && typeof M == "object")
            try {
              const L = await Promise.resolve().then(() => lt);
              if (L && typeof L._setAllMd == "function") {
                L._setAllMd(M);
                try {
                  Tt("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(M).length }));
                } catch {
                }
              }
            } catch (L) {
              _("[nimbi-cms] applying content manifest failed", L);
            }
          try {
            qr(ve);
          } catch (L) {
            _("[nimbi-cms] setContentBase failed", L);
          }
          try {
            try {
              const L = await Promise.resolve().then(() => lt);
              try {
                Tt("[nimbi-cms diagnostic] after setContentBase", () => ({
                  manifestKeys: M && typeof M == "object" ? Object.keys(M).length : 0,
                  slugToMdSize: L && L.slugToMd && typeof L.slugToMd.size == "number" ? L.slugToMd.size : void 0,
                  allMarkdownPathsLength: L && Array.isArray(L.allMarkdownPaths) ? L.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: L && L.allMarkdownPathsSet && typeof L.allMarkdownPathsSet.size == "number" ? L.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: L && Array.isArray(L.searchIndex) ? L.searchIndex.length : void 0
                }));
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (M) {
        _("[nimbi-cms] setContentBase failed", M);
      }
      try {
        Ji(y);
      } catch (M) {
        _("[nimbi-cms] setNotFoundPage failed", M);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => _n).then((M) => {
          try {
            M && typeof M.attachSitemapDownloadUI == "function" && M.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let rt = null, C = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k)
          try {
            const T = [], O = [];
            try {
              k && O.push(String(k));
            } catch {
            }
            try {
              const P = String(k || "").replace(/^_/, "");
              P && P !== String(k) && O.push(P);
            } catch {
            }
            try {
              O.push("navigation.md");
            } catch {
            }
            try {
              O.push("assets/navigation.md");
            } catch {
            }
            const W = [];
            for (const P of O)
              try {
                if (!P) continue;
                const B = String(P);
                W.includes(B) || W.push(B);
              } catch {
              }
            for (const P of W) {
              T.push(P);
              try {
                if (C = await Me(P, ve, { force: !0 }), C && C.raw) {
                  try {
                    k = P;
                  } catch {
                  }
                  try {
                    _("[nimbi-cms] fetched navigation candidate", P, "contentBase=", ve);
                  } catch {
                  }
                  rt = await Mn(C.raw || "");
                  try {
                    const B = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (B && rt && rt.html) {
                      const q = B.parseFromString(rt.html, "text/html").querySelector("a");
                      if (q)
                        try {
                          const Q = q.getAttribute("href") || "", U = nt(Q);
                          try {
                            _("[nimbi-cms] parsed nav first-link href", Q, "->", U);
                          } catch {
                          }
                          if (U && U.page && (U.type === "path" || U.type === "canonical" && (U.page.includes(".") || U.page.includes("/")))) {
                            w = U.page;
                            try {
                              _("[nimbi-cms] derived homePage from navigation", w);
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
          _("[nimbi-cms] final homePage before slugManager setHomePage", w);
        } catch {
        }
        try {
          ea(w);
        } catch (T) {
          _("[nimbi-cms] setHomePage failed", T);
        }
        let L = !0;
        try {
          const T = nt(typeof location < "u" ? location.href : "");
          T && T.type === "cosmetic" && (typeof y > "u" || y == null) && (L = !1);
        } catch {
        }
        if (L && w)
          try {
            await Me(w, ve, { force: !0 });
          } catch (T) {
            throw new Error(`Required ${w} not found at ${ve}${w}: ${T && T.message ? T.message : String(T)}`);
          }
      } catch (M) {
        throw M;
      }
      us(c), await cs(d, Y);
      const N = kl({ contentWrap: G, navWrap: A, container: D, mountOverlay: ie, t: ln, contentBase: ve, homePage: w, initialDocumentTitle: jn, runHooks: fi });
      try {
        const M = document.createElement("header");
        M.className = "nimbi-site-navbar", $.insertBefore(M, z);
        let L = C, T = rt;
        T || (L = await Me(k, ve, { force: !0 }), T = await Mn(L.raw || ""));
        const { navbar: O, linkEls: W } = await yl(M, D, T.html || "", ve, w, ln, N.renderByQuery, ee, l, o, u, v);
        try {
          await fi("onNavBuild", { navWrap: A, navbar: O, linkEls: W, contentBase: ve });
        } catch (P) {
          _("[nimbi-cms] onNavBuild hooks failed", P);
        }
        try {
          try {
            if (W && W.length) {
              const P = await Promise.resolve().then(() => lt);
              for (const B of Array.from(W || []))
                try {
                  const E = B && B.getAttribute && B.getAttribute("href") || "";
                  if (!E) continue;
                  let q = String(E || "").split(/::|#/, 1)[0];
                  if (q = String(q || "").split("?")[0], !q) continue;
                  /\.(?:md|html?)$/.test(q) || (q = q + ".html");
                  let Q = null;
                  try {
                    Q = K(String(q || ""));
                  } catch {
                    Q = String(q || "");
                  }
                  const U = String(Q || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!U) continue;
                  try {
                    let pe = null;
                    try {
                      P && typeof P.slugify == "function" && (pe = P.slugify(U.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      pe = String(U || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!pe) continue;
                    let Ce = pe;
                    try {
                      if (P && P.slugToMd && typeof P.slugToMd.has == "function" && P.slugToMd.has(pe)) {
                        const ye = P.slugToMd.get(pe);
                        let fe = !1;
                        try {
                          if (typeof ye == "string")
                            ye === q && (fe = !0);
                          else if (ye && typeof ye == "object") {
                            ye.default === q && (fe = !0);
                            for (const Ae of Object.keys(ye.langs || {}))
                              if (ye.langs[Ae] === q) {
                                fe = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!fe && typeof P.uniqueSlug == "function")
                          try {
                            Ce = P.uniqueSlug(pe, new Set(P.slugToMd.keys()));
                          } catch {
                            Ce = pe;
                          }
                      }
                    } catch {
                    }
                    try {
                      if (P && typeof P._storeSlugMapping == "function")
                        try {
                          P._storeSlugMapping(Ce, Q);
                        } catch {
                        }
                      else if (P && P.slugToMd && typeof P.slugToMd.set == "function")
                        try {
                          P.slugToMd.set(Ce, Q);
                        } catch {
                        }
                      try {
                        P && P.mdToSlug && typeof P.mdToSlug.set == "function" && P.mdToSlug.set(Q, Ce);
                      } catch {
                      }
                      try {
                        P && Array.isArray(P.allMarkdownPaths) && !P.allMarkdownPaths.includes(Q) && P.allMarkdownPaths.push(Q);
                      } catch {
                      }
                      try {
                        P && P.allMarkdownPathsSet && typeof P.allMarkdownPathsSet.add == "function" && P.allMarkdownPathsSet.add(Q);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const B = await Promise.resolve().then(() => pr);
                B && typeof B.refreshIndexPaths == "function" && B.refreshIndexPaths(ve);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let P = !1;
          try {
            const B = new URLSearchParams(location.search || "");
            (B.has("sitemap") || B.has("rss") || B.has("atom")) && (P = !0);
          } catch {
          }
          try {
            const E = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            E && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(E) && (P = !0);
          } catch {
          }
          if (P || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const E = await Promise.resolve().then(() => lt);
                if (E && typeof E.awaitSearchIndex == "function") {
                  const q = [];
                  w && q.push(w), k && q.push(k);
                  try {
                    await E.awaitSearchIndex({ contentBase: ve, indexDepth: Math.max(o || 1, 3), noIndexing: u, seedPaths: q.length ? q : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const B = await Promise.resolve().then(() => _n);
              try {
                if (B && typeof B.handleSitemapRequest == "function" && await B.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: y, contentBase: ve, indexDepth: o, noIndexing: u }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => _n).then((B) => {
              try {
                if (B && typeof B.exposeSitemapGlobals == "function")
                  try {
                    B.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: y, contentBase: ve, indexDepth: o, noIndexing: u, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const B = await Promise.resolve().then(() => pr);
            if (B && typeof B.refreshIndexPaths == "function")
              try {
                B.refreshIndexPaths(ve);
                try {
                  try {
                    const E = await Promise.resolve().then(() => lt);
                    try {
                      Tt("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({ slugToMdSize: E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : void 0, allMarkdownPathsLength: E && Array.isArray(E.allMarkdownPaths) ? E.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: E && E.allMarkdownPathsSet && typeof E.allMarkdownPathsSet.size == "number" ? E.allMarkdownPathsSet.size : void 0 }));
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const E = await Promise.resolve().then(() => lt), q = E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : 0;
                  let Q = !1;
                  try {
                    if (!manifest) {
                      q < 30 && (Q = !0);
                      try {
                        const U = nt(typeof location < "u" ? location.href : "");
                        if (U) {
                          if (U.type === "cosmetic" && U.page)
                            try {
                              E.slugToMd.has(U.page) || (Q = !0);
                            } catch {
                            }
                          else if ((U.type === "path" || U.type === "canonical") && U.page)
                            try {
                              const pe = K(U.page);
                              !(E.mdToSlug && E.mdToSlug.has(pe)) && !(E.allMarkdownPathsSet && E.allMarkdownPathsSet.has(pe)) && (Q = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Q) {
                    let U = null;
                    try {
                      U = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      U = null;
                    }
                    if (Array.isArray(U) && U.length) {
                      let pe = 0;
                      for (const Ce of U)
                        try {
                          if (!Ce || !Ce.slug) continue;
                          const ye = String(Ce.slug).split("::")[0];
                          if (E.slugToMd.has(ye)) continue;
                          let fe = Ce.sourcePath || Ce.path || null;
                          if (!fe && Array.isArray(U)) {
                            const Ze = (U || []).find((qe) => qe && qe.slug === Ce.slug);
                            Ze && Ze.path && (fe = Ze.path);
                          }
                          if (!fe) continue;
                          try {
                            fe = String(fe);
                          } catch {
                            continue;
                          }
                          let Ae = null;
                          try {
                            const Ze = ve && typeof ve == "string" ? ve : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const qe = new URL(fe, Ze), mt = new URL(Ze);
                              if (qe.origin === mt.origin) {
                                const tn = mt.pathname || "/";
                                let St = qe.pathname || "";
                                St.startsWith(tn) && (St = St.slice(tn.length)), St.startsWith("/") && (St = St.slice(1)), Ae = K(St);
                              } else
                                Ae = K(qe.pathname || "");
                            } catch {
                              Ae = K(fe);
                            }
                          } catch {
                            Ae = K(fe);
                          }
                          if (!Ae) continue;
                          Ae = String(Ae).split(/[?#]/)[0], Ae = K(Ae);
                          try {
                            E._storeSlugMapping(ye, Ae);
                          } catch {
                          }
                          pe++;
                        } catch {
                        }
                      if (pe) {
                        try {
                          Tt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({ added: pe, total: E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : void 0 }));
                        } catch {
                        }
                        try {
                          const Ce = await Promise.resolve().then(() => pr);
                          Ce && typeof Ce.refreshIndexPaths == "function" && Ce.refreshIndexPaths(ve);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (E) {
                _("[nimbi-cms] refreshIndexPaths after nav build failed", E);
              }
          } catch {
          }
          const P = () => {
            const B = M && M.getBoundingClientRect && Math.round(M.getBoundingClientRect().height) || M && M.offsetHeight || 0;
            if (B > 0) {
              try {
                $.style.setProperty("--nimbi-site-navbar-height", `${B}px`);
              } catch (E) {
                _("[nimbi-cms] set CSS var failed", E);
              }
              try {
                D.style.paddingTop = "";
              } catch (E) {
                _("[nimbi-cms] set container paddingTop failed", E);
              }
              try {
                const E = $ && $.getBoundingClientRect && Math.round($.getBoundingClientRect().height) || $ && $.clientHeight || 0;
                if (E > 0) {
                  const q = Math.max(0, E - B);
                  try {
                    D.style.setProperty("--nimbi-cms-height", `${q}px`);
                  } catch (Q) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", Q);
                  }
                } else
                  try {
                    D.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (q) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", q);
                  }
              } catch (E) {
                _("[nimbi-cms] compute container height failed", E);
              }
              try {
                M.style.setProperty("--nimbi-site-navbar-height", `${B}px`);
              } catch (E) {
                _("[nimbi-cms] set navbar CSS var failed", E);
              }
            }
          };
          P();
          try {
            if (typeof ResizeObserver < "u") {
              const B = new ResizeObserver(() => P());
              try {
                B.observe(M);
              } catch (E) {
                _("[nimbi-cms] ResizeObserver.observe failed", E);
              }
            }
          } catch (B) {
            _("[nimbi-cms] ResizeObserver setup failed", B);
          }
        } catch (P) {
          _("[nimbi-cms] compute navbar height failed", P);
        }
      } catch (M) {
        _("[nimbi-cms] build navigation failed", M);
      }
      await N.renderByQuery();
      try {
        Promise.resolve().then(() => Al).then(({ getVersion: M }) => {
          typeof M == "function" && M().then((L) => {
            try {
              const T = L || "0.0.0";
              try {
                const O = (B) => {
                  const E = document.createElement("a");
                  E.className = "nimbi-version-label tag is-small", E.textContent = `nimbiCMS v. ${T}`, E.href = B || "#", E.target = "_blank", E.rel = "noopener noreferrer nofollow", E.setAttribute("aria-label", `nimbiCMS version ${T}`);
                  try {
                    Wi(E);
                  } catch {
                  }
                  try {
                    $.appendChild(E);
                  } catch (q) {
                    _("[nimbi-cms] append version label failed", q);
                  }
                }, W = "https://abelvm.github.io/nimbiCMS/", P = (() => {
                  try {
                    if (W && typeof W == "string")
                      return new URL(W).toString();
                  } catch {
                  }
                  return "#";
                })();
                O(P);
              } catch (O) {
                _("[nimbi-cms] building version label failed", O);
              }
            } catch (T) {
              _("[nimbi-cms] building version label failed", T);
            }
          }).catch((L) => {
            _("[nimbi-cms] getVersion() failed", L);
          });
        }).catch((M) => {
          _("[nimbi-cms] import version module failed", M);
        });
      } catch (M) {
        _("[nimbi-cms] version label setup failed", M);
      }
    })();
  } catch (z) {
    throw Z(z), z;
  }
}
async function vl() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const Al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: vl
}, Symbol.toStringTag, { value: "Module" })), Ve = $t, on = _;
function Vr() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function He(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Ni(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function El(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = K(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Yr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Vr().split("?")[0];
  let o = Array.isArray(te) && te.length ? te : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(te) && te.length) {
    const m = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && m.set(String(w.slug), w);
        } catch {
        }
      for (const w of te)
        try {
          w && w.slug && m.set(String(w.slug), w);
        } catch {
        }
    } catch {
    }
    o = Array.from(m.values());
  }
  const u = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && u.add(K(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && u.add(K(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const m = K(String(a));
      try {
        if (H && typeof H.has == "function" && H.has(m))
          try {
            c.add(H.get(m));
          } catch {
          }
        else
          try {
            const w = await Me(m, e && e.contentBase ? e.contentBase : void 0);
            if (w && w.raw)
              try {
                let y = null;
                if (w.isHtml)
                  try {
                    const S = new DOMParser().parseFromString(w.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (y = v.textContent.trim());
                  } catch {
                  }
                else {
                  const k = (w.raw || "").match(/^#\s+(.+)$/m);
                  k && k[1] && (y = k[1].trim());
                }
                y && c.add(ue(y));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const d = /* @__PURE__ */ new Set(), f = [], g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), h = (m) => {
    try {
      if (!m || typeof m != "string") return !1;
      const w = K(String(m));
      try {
        if (Pe && typeof Pe.has == "function" && Pe.has(w)) return !0;
      } catch {
      }
      try {
        if (H && typeof H.has == "function" && H.has(w)) return !0;
      } catch {
      }
      try {
        if (p && p.has(w)) return !0;
      } catch {
      }
      try {
        if (H && typeof H.keys == "function" && H.size)
          for (const y of H.keys())
            try {
              if (K(String(y)) === w) return !0;
            } catch {
            }
        else
          for (const y of V.values())
            try {
              if (!y) continue;
              if (typeof y == "string") {
                if (K(String(y)) === w) return !0;
              } else if (y && typeof y == "object") {
                if (y.default && K(String(y.default)) === w) return !0;
                const k = y.langs || {};
                for (const S of Object.keys(k || {}))
                  try {
                    if (k[S] && K(String(k[S])) === w) return !0;
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
  if (Array.isArray(o) && o.length)
    for (const m of o)
      try {
        if (!m || !m.slug) continue;
        const w = String(m.slug), y = String(w).split("::")[0];
        if (c.has(y)) continue;
        const k = m.path ? K(String(m.path)) : null;
        if (k && u.has(k)) continue;
        const S = m.title ? String(m.title) : m.parentTitle ? String(m.parentTitle) : void 0;
        g.set(w, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, path: k, source: "index" }), k && p.set(k, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, slug: w });
        const v = El(l, m);
        if (!v || !v.slug || d.has(v.slug)) continue;
        if (d.add(v.slug), g.has(v.slug)) {
          const R = g.get(v.slug);
          R && R.title && (v.title = R.title, v._titleSource = "index"), R && R.excerpt && (v.excerpt = R.excerpt);
        }
        f.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [m, w] of V.entries())
        try {
          if (!m) continue;
          const y = String(m).split("::")[0];
          if (d.has(m) || c.has(y)) continue;
          let k = null;
          if (typeof w == "string" ? k = K(String(w)) : w && typeof w == "object" && (k = K(String(w.default || ""))), k && u.has(k)) continue;
          const v = { loc: l + "?page=" + encodeURIComponent(m), slug: m };
          if (g.has(m)) {
            const R = g.get(m);
            R && R.title && (v.title = R.title, v._titleSource = "index"), R && R.excerpt && (v.excerpt = R.excerpt);
          } else if (k) {
            const R = p.get(k);
            R && R.title && (v.title = R.title, v._titleSource = "path", !v.excerpt && R.excerpt && (v.excerpt = R.excerpt));
          }
          if (d.add(m), typeof m == "string") {
            const R = m.indexOf("/") !== -1 || /\.(md|html?)$/i.test(m), Z = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || Z || R) && (v.title = Ni(m), v._titleSource = "humanize");
          }
          f.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const m = K(String(i));
          let w = null;
          try {
            H && H.has(m) && (w = H.get(m));
          } catch {
          }
          w || (w = m);
          const y = String(w).split("::")[0];
          if (!d.has(w) && !u.has(m) && !c.has(y)) {
            const k = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (g.has(w)) {
              const S = g.get(w);
              S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt);
            }
            d.add(w), f.push(k);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const m = /* @__PURE__ */ new Set(), w = new Set(f.map((v) => String(v && v.slug ? v.slug : ""))), y = /* @__PURE__ */ new Set();
    for (const v of f)
      try {
        v && v.sourcePath && y.add(String(v.sourcePath));
      } catch {
      }
    const k = 30;
    let S = 0;
    for (const v of y) {
      if (S >= k) break;
      try {
        if (!v || typeof v != "string" || !h(v)) continue;
        S += 1;
        const R = await Me(v, e && e.contentBase ? e.contentBase : void 0);
        if (!R || !R.raw || R && typeof R.status == "number" && R.status === 404) continue;
        const Z = R.raw, $ = (function(j) {
          try {
            return String(j || "");
          } catch {
            return "";
          }
        })(Z), ee = [], z = /\[[^\]]+\]\(([^)]+)\)/g;
        let D;
        for (; D = z.exec($); )
          try {
            D && D[1] && ee.push(D[1]);
          } catch {
          }
        const ne = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; D = ne.exec($); )
          try {
            D && D[1] && ee.push(D[1]);
          } catch {
          }
        for (const j of ee)
          try {
            if (!j) continue;
            if (j.indexOf("?") !== -1 || j.indexOf("=") !== -1)
              try {
                const G = new URL(j, l).searchParams.get("page");
                if (G) {
                  const ie = String(G);
                  !w.has(ie) && !m.has(ie) && (m.add(ie), f.push({ loc: l + "?page=" + encodeURIComponent(ie), slug: ie }));
                  continue;
                }
              } catch {
              }
            let re = String(j).split(/[?#]/)[0];
            if (re = re.replace(/^\.\//, "").replace(/^\//, ""), !re || !/\.(md|html?)$/i.test(re)) continue;
            try {
              const A = K(re);
              if (H && H.has(A)) {
                const G = H.get(A), ie = String(G).split("::")[0];
                G && !w.has(G) && !m.has(G) && !c.has(ie) && !u.has(A) && (m.add(G), f.push({ loc: l + "?page=" + encodeURIComponent(G), slug: G, sourcePath: A }));
                continue;
              }
              try {
                if (!h(A)) continue;
                const G = await Me(A, e && e.contentBase ? e.contentBase : void 0);
                if (G && typeof G.status == "number" && G.status === 404) continue;
                if (G && G.raw) {
                  const ie = (G.raw || "").match(/^#\s+(.+)$/m), Te = ie && ie[1] ? ie[1].trim() : "", Y = ue(Te || A), ge = String(Y).split("::")[0];
                  Y && !w.has(Y) && !m.has(Y) && !c.has(ge) && (m.add(Y), f.push({ loc: l + "?page=" + encodeURIComponent(Y), slug: Y, sourcePath: A, title: Te || void 0 }));
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
    for (const y of f)
      try {
        if (!y || !y.slug) continue;
        m.set(String(y.slug), y);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const y of f)
      try {
        if (!y || !y.slug) continue;
        const k = String(y.slug), S = k.split("::")[0];
        if (!S) continue;
        k !== S && !m.has(S) && w.add(S);
      } catch {
      }
    for (const y of w)
      try {
        let k = null;
        if (g.has(y)) {
          const S = g.get(y);
          k = { loc: l + "?page=" + encodeURIComponent(y), slug: y }, S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt), S && S.path && (k.sourcePath = S.path);
        } else if (p && V && V.has(y)) {
          const S = V.get(y);
          let v = null;
          if (typeof S == "string" ? v = K(String(S)) : S && typeof S == "object" && (v = K(String(S.default || ""))), k = { loc: l + "?page=" + encodeURIComponent(y), slug: y }, v && p.has(v)) {
            const R = p.get(v);
            R && R.title && (k.title = R.title, k._titleSource = "path"), R && R.excerpt && (k.excerpt = R.excerpt), k.sourcePath = v;
          }
        }
        k || (k = { loc: l + "?page=" + encodeURIComponent(y), slug: y, title: Ni(y) }, k._titleSource = "humanize"), m.has(y) || (f.push(k), m.set(y, k));
      } catch {
      }
  } catch {
  }
  const b = [];
  try {
    const m = /* @__PURE__ */ new Set();
    for (const w of f)
      try {
        if (!w || !w.slug) continue;
        const y = String(w.slug), k = String(y).split("::")[0];
        if (c.has(k) || y.indexOf("::") !== -1 || m.has(y)) continue;
        m.add(y), b.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Ve(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(b.map((m) => ({ slug: m.slug, title: m.title, titleSource: m._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let w = 0;
    const y = b.length, k = Array.from({ length: Math.min(4, y) }).map(async () => {
      for (; ; ) {
        const S = w++;
        if (S >= y) break;
        const v = b[S];
        try {
          if (!v || !v.slug) continue;
          const R = String(v.slug).split("::")[0];
          if (c.has(R) || v._titleSource === "index") continue;
          let Z = null;
          try {
            if (V && V.has(v.slug)) {
              const $ = V.get(v.slug);
              typeof $ == "string" ? Z = K(String($)) : $ && typeof $ == "object" && (Z = K(String($.default || "")));
            }
            !Z && v.sourcePath && (Z = v.sourcePath);
          } catch {
            continue;
          }
          if (!Z || u.has(Z) || !h(Z)) continue;
          try {
            const $ = await Me(Z, e && e.contentBase ? e.contentBase : void 0);
            if (!$ || !$.raw || $ && typeof $.status == "number" && $.status === 404) continue;
            if ($ && $.raw) {
              const ee = ($.raw || "").match(/^#\s+(.+)$/m), z = ee && ee[1] ? ee[1].trim() : "";
              z && (v.title = z, v._titleSource = "fetched");
            }
          } catch ($) {
            Ve("[runtimeSitemap] fetch title failed for", Z, $);
          }
        } catch (R) {
          Ve("[runtimeSitemap] worker loop failure", R);
        }
      }
    });
    await Promise.all(k);
  } catch (m) {
    Ve("[runtimeSitemap] title enrichment failed", m);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: b };
}
function Pr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${He(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function $r(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Vr().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${He("Sitemap RSS")}</title>
`, i += `<link>${He(n)}</link>
`, i += `<description>${He("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${He(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${He(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${He(String(r.excerpt))}</description>
`), i += `<link>${He(a)}</link>
`, i += `<guid>${He(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function zr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Vr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${He("Sitemap Atom")}</title>
`, r += `<link href="${He(n)}" />
`, r += `<updated>${He(i)}</updated>
`, r += `<id>${He(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${He(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${He(String(a.excerpt))}</summary>
`), r += `<link href="${He(s)}" />
`, r += `<id>${He(s)}</id>
`, r += `<updated>${He(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Bi(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + He(e) + "</pre>";
    } catch {
    }
  }
}
function qi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${He(String(i && i.loc ? i.loc : ""))}">${He(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
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
        t === "application/rss+xml" ? i = $r(e) : t === "application/atom+xml" ? i = zr(e) : t === "text/html" ? i = qi(e) : i = Pr(e), Bi(i, t);
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
          r.mimeType === "application/rss+xml" ? a = $r(r.finalJson) : r.mimeType === "application/atom+xml" ? a = zr(r.finalJson) : r.mimeType === "text/html" ? a = qi(r.finalJson) : a = Pr(r.finalJson);
          try {
            Bi(a, r.mimeType);
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
async function Ml(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let d = !0;
        for (const f of c.keys()) f !== "sitemap" && (d = !1);
        d && (t = !0);
      }
      if (c.has("rss")) {
        let d = !0;
        for (const f of c.keys()) f !== "rss" && (d = !1);
        d && (n = !0);
      }
      if (c.has("atom")) {
        let d = !0;
        for (const f of c.keys()) f !== "atom" && (d = !1);
        d && (i = !0);
      }
    } catch {
    }
    if (!t && !n && !i) {
      const d = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!d || (t = /^(sitemap|sitemap\.xml)$/i.test(d), n = /^(rss|rss\.xml)$/i.test(d), i = /^(atom|atom\.xml)$/i.test(d), r = /^(sitemap|sitemap\.html)$/i.test(d), !t && !n && !i && !r)) return !1;
    }
    let a = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof Pt == "function")
        try {
          const c = await Pt({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const d = /* @__PURE__ */ new Map();
              try {
                for (const f of e.index)
                  try {
                    f && f.slug && d.set(String(f.slug), f);
                  } catch {
                  }
                for (const f of c)
                  try {
                    f && f.slug && d.set(String(f.slug), f);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(d.values());
            } else
              a = c;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
        }
      else
        a = Array.isArray(te) && te.length ? te : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const c = /* @__PURE__ */ new Map();
          for (const d of e.index)
            try {
              if (!d || !d.slug) continue;
              const f = String(d.slug).split("::")[0];
              if (!c.has(f)) c.set(f, d);
              else {
                const g = c.get(f);
                g && String(g.slug || "").indexOf("::") !== -1 && String(d.slug || "").indexOf("::") === -1 && c.set(f, d);
              }
            } catch {
            }
          try {
            Ve(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            Ve(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(c.size));
          }
        } catch (c) {
          on("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof qt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let d = null;
        try {
          typeof Pt == "function" && (d = await Pt({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          d = null;
        }
        if (Array.isArray(d) && d.length)
          a = d;
        else {
          const f = typeof e.indexDepth == "number" ? e.indexDepth : 3, g = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, p = [];
          e && e.homePage && p.push(e.homePage), e && e.navigationPage && p.push(e.navigationPage), a = await qt(e && e.contentBase ? e.contentBase : void 0, f, g, p.length ? p : void 0);
        }
      } catch (c) {
        on("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(te) && te.length ? te : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ve(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(c));
      } catch {
      }
      try {
        Ve(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let g = null;
      try {
        const p = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof p == "function")
          try {
            g = await p(e && e.contentBase ? e.contentBase : void 0, d, f);
          } catch {
            g = null;
          }
      } catch {
        g = null;
      }
      if ((!g || !g.length) && typeof qt == "function")
        try {
          g = await qt(e && e.contentBase ? e.contentBase : void 0, d, f, c.length ? c : void 0);
        } catch {
          g = null;
        }
      if (Array.isArray(g) && g.length) {
        const p = /* @__PURE__ */ new Map();
        try {
          for (const h of a)
            try {
              h && h.slug && p.set(String(h.slug), h);
            } catch {
            }
          for (const h of g)
            try {
              h && h.slug && p.set(String(h.slug), h);
            } catch {
            }
        } catch {
        }
        a = Array.from(p.values());
      }
    } catch (c) {
      try {
        on("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ve(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(c));
      } catch {
      }
      try {
        Ve(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await Yr(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), d = Array.isArray(l && l.entries) ? l.entries : [];
      for (const f of d)
        try {
          let g = null;
          if (f && f.slug) g = String(f.slug);
          else if (f && f.loc)
            try {
              g = new URL(String(f.loc)).searchParams.get("page");
            } catch {
            }
          if (!g) continue;
          const p = String(g).split("::")[0];
          if (!c.has(p)) {
            c.add(p);
            const h = Object.assign({}, f);
            h.baseSlug = p, o.push(h);
          }
        } catch {
        }
      try {
        Ve(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(o, null, 2));
      } catch {
        Ve(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(o.length));
      }
    } catch {
      try {
        o = Array.isArray(l && l.entries) ? l.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const u = Object.assign({}, l || {}, { entries: Array.isArray(o) ? o : Array.isArray(l && l.entries) ? l.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = u, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const c = Array.isArray(u && u.entries) ? u.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return Dn(u, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(u && u.entries) ? u.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return Dn(u, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(u && u.entries) ? u.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip XML write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return Dn(u, "application/xml"), !0;
    }
    if (r)
      try {
        const d = (Array.isArray(u && u.entries) ? u.entries : []).length;
        let f = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (f = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (f > d) {
          try {
            Ve("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", f, d);
          } catch {
          }
          return !0;
        }
        return Dn(u, "text/html"), !0;
      } catch (c) {
        return on("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return on("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function Ll(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Pt == "function")
        try {
          const s = await Pt({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(te) && te.length && (n = te), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Yr(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), l = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of l)
        try {
          let u = null;
          if (o && o.slug) u = String(o.slug);
          else if (o && o.loc)
            try {
              u = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              u = null;
            }
          if (!u) continue;
          const c = String(u).split("::")[0];
          if (!s.has(c)) {
            s.add(c);
            const d = Object.assign({}, o);
            d.baseSlug = c, r.push(d);
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
const _n = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: Ll,
  generateAtomXml: zr,
  generateRssXml: $r,
  generateSitemapJson: Yr,
  generateSitemapXml: Pr,
  handleSitemapRequest: Ml
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ui as BAD_LANGUAGES,
  xe as SUPPORTED_HLJS_MAP,
  Pl as _clearHooks,
  Or as addHook,
  Il as default,
  cs as ensureBulma,
  vl as getVersion,
  Il as initCMS,
  Gi as loadL10nFile,
  Fi as loadSupportedLanguages,
  os as observeCodeBlocks,
  Cl as onNavBuild,
  Tl as onPageLoad,
  xn as registerLanguage,
  fi as runHooks,
  $l as setHighlightTheme,
  Qi as setLang,
  us as setStyle,
  zl as setThemeVars,
  ln as t,
  Rl as transformHtml
};
