let Sr = 0;
const fi = /* @__PURE__ */ Object.create(null);
function pi(e) {
  try {
    const t = Number(e);
    Sr = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    Sr = 0;
  }
}
function Zt(e = 1) {
  try {
    return Number(Sr) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function Or() {
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
function k(...e) {
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
function zt(...e) {
  try {
    if (!Zt(3) || !console || typeof console.log != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.log(...t);
  } catch {
  }
}
function Di(e) {
  try {
    if (!Or()) return;
    const t = String(e || "");
    if (!t) return;
    fi[t] = (fi[t] || 0) + 1;
  } catch {
  }
}
function Fi(e) {
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
function Br(e, t) {
  if (!Object.prototype.hasOwnProperty.call(kn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  kn[e].push(t);
}
function zl(e) {
  Br("onPageLoad", e);
}
function Il(e) {
  Br("onNavBuild", e);
}
function Nl(e) {
  Br("transformHtml", e);
}
async function gi(e, t) {
  const n = kn[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      try {
        k("[nimbi-cms] runHooks callback failed", r);
      } catch {
      }
    }
}
function Ol() {
  Object.keys(kn).forEach((e) => {
    kn[e].length = 0;
  });
}
function Ui(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var pr, mi;
function ss() {
  if (mi) return pr;
  mi = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((N) => {
      const J = x[N], be = typeof J;
      (be === "object" || be === "function") && !Object.isFrozen(J) && e(J);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(N) {
      N.data === void 0 && (N.data = {}), this.data = N.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...N) {
    const J = /* @__PURE__ */ Object.create(null);
    for (const be in x)
      J[be] = x[be];
    return N.forEach(function(be) {
      for (const Ue in be)
        J[Ue] = be[Ue];
    }), /** @type {T} */
    J;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: N }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const J = x.split(".");
      return [
        `${N}${J.shift()}`,
        ...J.map((be, Ue) => `${be}${"_".repeat(Ue + 1)}`)
      ].join(" ");
    }
    return `${N}${x}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(N, J) {
      this.buffer = "", this.classPrefix = J.classPrefix, N.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(N) {
      this.buffer += n(N);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(N) {
      if (!a(N)) return;
      const J = s(
        N.scope,
        { prefix: this.classPrefix }
      );
      this.span(J);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(N) {
      a(N) && (this.buffer += r);
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
    span(N) {
      this.buffer += `<span class="${N}">`;
    }
  }
  const o = (x = {}) => {
    const N = { children: [] };
    return Object.assign(N, x), N;
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
    add(N) {
      this.top.children.push(N);
    }
    /** @param {string} scope */
    openNode(N) {
      const J = o({ scope: N });
      this.add(J), this.stack.push(J);
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
    walk(N) {
      return this.constructor._walk(N, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(N, J) {
      return typeof J == "string" ? N.addText(J) : J.children && (N.openNode(J), J.children.forEach((be) => this._walk(N, be)), N.closeNode(J)), N;
    }
    /**
     * @param {Node} node
     */
    static _collapse(N) {
      typeof N != "string" && N.children && (N.children.every((J) => typeof J == "string") ? N.children = [N.children.join("")] : N.children.forEach((J) => {
        u._collapse(J);
      }));
    }
  }
  class c extends u {
    /**
     * @param {*} options
     */
    constructor(N) {
      super(), this.options = N;
    }
    /**
     * @param {string} text
     */
    addText(N) {
      N !== "" && this.add(N);
    }
    /** @param {string} scope */
    startScope(N) {
      this.openNode(N);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(N, J) {
      const be = N.root;
      J && (be.scope = `language:${J}`), this.add(be);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function f(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function h(x) {
    return d("(?=", x, ")");
  }
  function p(x) {
    return d("(?:", x, ")*");
  }
  function g(x) {
    return d("(?:", x, ")?");
  }
  function d(...x) {
    return x.map((J) => f(J)).join("");
  }
  function y(x) {
    const N = x[x.length - 1];
    return typeof N == "object" && N.constructor === Object ? (x.splice(x.length - 1, 1), N) : {};
  }
  function m(...x) {
    return "(" + (y(x).capture ? "" : "?:") + x.map((be) => f(be)).join("|") + ")";
  }
  function w(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function b(x, N) {
    const J = x && x.exec(N);
    return J && J.index === 0;
  }
  const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: N }) {
    let J = 0;
    return x.map((be) => {
      J += 1;
      const Ue = J;
      let We = f(be), se = "";
      for (; We.length > 0; ) {
        const ae = _.exec(We);
        if (!ae) {
          se += We;
          break;
        }
        se += We.substring(0, ae.index), We = We.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? se += "\\" + String(Number(ae[1]) + Ue) : (se += ae[0], ae[0] === "(" && J++);
      }
      return se;
    }).map((be) => `(${be})`).join(N);
  }
  const v = /\b\B/, T = "[a-zA-Z]\\w*", X = "[a-zA-Z_]\\w*", P = "\\b\\d+(\\.\\d+)?", ie = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", z = "\\b(0b[01]+)", q = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", G = (x = {}) => {
    const N = /^#![ ]*\//;
    return x.binary && (x.begin = d(
      N,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: N,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (J, be) => {
        J.index !== 0 && be.ignoreMatch();
      }
    }, x);
  }, F = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, H = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [F]
  }, A = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [F]
  }, Q = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, K = function(x, N, J = {}) {
    const be = i(
      {
        scope: "comment",
        begin: x,
        end: N,
        contains: []
      },
      J
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
        begin: d(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          Ue,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), be;
  }, xe = K("//", "$"), V = K("/\\*", "\\*/"), de = K("#", "$"), ke = {
    scope: "number",
    begin: P,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: ie,
    relevance: 0
  }, je = {
    scope: "number",
    begin: z,
    relevance: 0
  }, _e = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      F,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [F]
      }
    ]
  }, Fe = {
    scope: "title",
    begin: T,
    relevance: 0
  }, L = {
    scope: "title",
    begin: X,
    relevance: 0
  }, O = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + X,
    relevance: 0
  };
  var M = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: H,
    BACKSLASH_ESCAPE: F,
    BINARY_NUMBER_MODE: je,
    BINARY_NUMBER_RE: z,
    COMMENT: K,
    C_BLOCK_COMMENT_MODE: V,
    C_LINE_COMMENT_MODE: xe,
    C_NUMBER_MODE: ve,
    C_NUMBER_RE: ie,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (N, J) => {
            J.data._beginMatch = N[1];
          },
          /** @type {ModeCallback} */
          "on:end": (N, J) => {
            J.data._beginMatch !== N[1] && J.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: de,
    IDENT_RE: T,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: O,
    NUMBER_MODE: ke,
    NUMBER_RE: P,
    PHRASAL_WORDS_MODE: Q,
    QUOTE_STRING_MODE: A,
    REGEXP_MODE: _e,
    RE_STARTERS_RE: q,
    SHEBANG: G,
    TITLE_MODE: Fe,
    UNDERSCORE_IDENT_RE: X,
    UNDERSCORE_TITLE_MODE: L
  });
  function R(x, N) {
    x.input[x.index - 1] === "." && N.ignoreMatch();
  }
  function I(x, N) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function Z(x, N) {
    N && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = R, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function $(x, N) {
    Array.isArray(x.illegal) && (x.illegal = m(...x.illegal));
  }
  function j(x, N) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function C(x, N) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const B = (x, N) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const J = Object.assign({}, x);
    Object.keys(x).forEach((be) => {
      delete x[be];
    }), x.keywords = J.keywords, x.begin = d(J.beforeMatch, h(J.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(J, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete J.beforeMatch;
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
  ], U = "keyword";
  function ge(x, N, J = U) {
    const be = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? Ue(J, x.split(" ")) : Array.isArray(x) ? Ue(J, x) : Object.keys(x).forEach(function(We) {
      Object.assign(
        be,
        ge(x[We], N, We)
      );
    }), be;
    function Ue(We, se) {
      N && (se = se.map((ae) => ae.toLowerCase())), se.forEach(function(ae) {
        const ye = ae.split("|");
        be[ye[0]] = [We, Ce(ye[0], ye[1])];
      });
    }
  }
  function Ce(x, N) {
    return N ? Number(N) : me(x) ? 0 : 1;
  }
  function me(x) {
    return Y.includes(x.toLowerCase());
  }
  const pe = {}, Me = (x) => {
    console.error(x);
  }, Qe = (x, ...N) => {
    console.log(`WARN: ${x}`, ...N);
  }, qe = (x, N) => {
    pe[`${x}/${N}`] || (console.log(`Deprecated as of ${x}. ${N}`), pe[`${x}/${N}`] = !0);
  }, yt = new Error();
  function tn(x, N, { key: J }) {
    let be = 0;
    const Ue = x[J], We = {}, se = {};
    for (let ae = 1; ae <= N.length; ae++)
      se[ae + be] = Ue[ae], We[ae + be] = !0, be += w(N[ae - 1]);
    x[J] = se, x[J]._emit = We, x[J]._multi = !0;
  }
  function vt(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Me("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), yt;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Me("beginScope must be object"), yt;
      tn(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function za(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Me("skip, excludeEnd, returnEnd not compatible with endScope: {}"), yt;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Me("endScope must be object"), yt;
      tn(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Ia(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Na(x) {
    Ia(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), vt(x), za(x);
  }
  function Oa(x) {
    function N(se, ae) {
      return new RegExp(
        f(se),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class J {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(ae, ye) {
        ye.position = this.position++, this.matchIndexes[this.matchAt] = ye, this.regexes.push([ye, ae]), this.matchAt += w(ae) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ae = this.regexes.map((ye) => ye[1]);
        this.matcherRe = N(S(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const ye = this.matcherRe.exec(ae);
        if (!ye)
          return null;
        const Ke = ye.findIndex((nn, lr) => lr > 0 && nn !== void 0), Ze = this.matchIndexes[Ke];
        return ye.splice(0, Ke), Object.assign(ye, Ze);
      }
    }
    class be {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const ye = new J();
        return this.rules.slice(ae).forEach(([Ke, Ze]) => ye.addRule(Ke, Ze)), ye.compile(), this.multiRegexes[ae] = ye, ye;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(ae, ye) {
        this.rules.push([ae, ye]), ye.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(ae) {
        const ye = this.getMatcher(this.regexIndex);
        ye.lastIndex = this.lastIndex;
        let Ke = ye.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ke && Ke.index === this.lastIndex)) {
          const Ze = this.getMatcher(0);
          Ze.lastIndex = this.lastIndex + 1, Ke = Ze.exec(ae);
        }
        return Ke && (this.regexIndex += Ke.position + 1, this.regexIndex === this.count && this.considerAll()), Ke;
      }
    }
    function Ue(se) {
      const ae = new be();
      return se.contains.forEach((ye) => ae.addRule(ye.begin, { rule: ye, type: "begin" })), se.terminatorEnd && ae.addRule(se.terminatorEnd, { type: "end" }), se.illegal && ae.addRule(se.illegal, { type: "illegal" }), ae;
    }
    function We(se, ae) {
      const ye = (
        /** @type CompiledMode */
        se
      );
      if (se.isCompiled) return ye;
      [
        I,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        j,
        Na,
        B
      ].forEach((Ze) => Ze(se, ae)), x.compilerExtensions.forEach((Ze) => Ze(se, ae)), se.__beforeBegin = null, [
        Z,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        $,
        // default to 1 relevance if not specified
        C
      ].forEach((Ze) => Ze(se, ae)), se.isCompiled = !0;
      let Ke = null;
      return typeof se.keywords == "object" && se.keywords.$pattern && (se.keywords = Object.assign({}, se.keywords), Ke = se.keywords.$pattern, delete se.keywords.$pattern), Ke = Ke || /\w+/, se.keywords && (se.keywords = ge(se.keywords, x.case_insensitive)), ye.keywordPatternRe = N(Ke, !0), ae && (se.begin || (se.begin = /\B|\b/), ye.beginRe = N(ye.begin), !se.end && !se.endsWithParent && (se.end = /\B|\b/), se.end && (ye.endRe = N(ye.end)), ye.terminatorEnd = f(ye.end) || "", se.endsWithParent && ae.terminatorEnd && (ye.terminatorEnd += (se.end ? "|" : "") + ae.terminatorEnd)), se.illegal && (ye.illegalRe = N(
        /** @type {RegExp | string} */
        se.illegal
      )), se.contains || (se.contains = []), se.contains = [].concat(...se.contains.map(function(Ze) {
        return Ba(Ze === "self" ? se : Ze);
      })), se.contains.forEach(function(Ze) {
        We(
          /** @type Mode */
          Ze,
          ye
        );
      }), se.starts && We(se.starts, ae), ye.matcher = Ue(ye), ye;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), We(
      /** @type Mode */
      x
    );
  }
  function ti(x) {
    return x ? x.endsWithParent || ti(x.starts) : !1;
  }
  function Ba(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(N) {
      return i(x, { variants: null }, N);
    })), x.cachedVariants ? x.cachedVariants : ti(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var qa = "11.11.1";
  class ja extends Error {
    constructor(N, J) {
      super(N), this.name = "HTMLInjectionError", this.html = J;
    }
  }
  const or = n, ni = i, ri = /* @__PURE__ */ Symbol("nomatch"), Ha = 7, ii = function(x) {
    const N = /* @__PURE__ */ Object.create(null), J = /* @__PURE__ */ Object.create(null), be = [];
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
    function ye(W) {
      return ae.noHighlightRe.test(W);
    }
    function Ke(W) {
      let ce = W.className + " ";
      ce += W.parentNode ? W.parentNode.className : "";
      const Le = ae.languageDetectRe.exec(ce);
      if (Le) {
        const Oe = Ct(Le[1]);
        return Oe || (Qe(We.replace("{}", Le[1])), Qe("Falling back to no-highlight mode for this block.", W)), Oe ? Le[1] : "no-highlight";
      }
      return ce.split(/\s+/).find((Oe) => ye(Oe) || Ct(Oe));
    }
    function Ze(W, ce, Le) {
      let Oe = "", Ge = "";
      typeof ce == "object" ? (Oe = W, Le = ce.ignoreIllegals, Ge = ce.language) : (qe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), qe("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Ge = W, Oe = ce), Le === void 0 && (Le = !0);
      const gt = {
        code: Oe,
        language: Ge
      };
      Pn("before:highlight", gt);
      const Mt = gt.result ? gt.result : nn(gt.language, gt.code, Le);
      return Mt.code = gt.code, Pn("after:highlight", Mt), Mt;
    }
    function nn(W, ce, Le, Oe) {
      const Ge = /* @__PURE__ */ Object.create(null);
      function gt(ne, le) {
        return ne.keywords[le];
      }
      function Mt() {
        if (!we.keywords) {
          Ve.addText(Be);
          return;
        }
        let ne = 0;
        we.keywordPatternRe.lastIndex = 0;
        let le = we.keywordPatternRe.exec(Be), Se = "";
        for (; le; ) {
          Se += Be.substring(ne, le.index);
          const Ie = wt.case_insensitive ? le[0].toLowerCase() : le[0], Ye = gt(we, Ie);
          if (Ye) {
            const [At, is] = Ye;
            if (Ve.addText(Se), Se = "", Ge[Ie] = (Ge[Ie] || 0) + 1, Ge[Ie] <= Ha && (In += is), At.startsWith("_"))
              Se += le[0];
            else {
              const as = wt.classNameAliases[At] || At;
              bt(le[0], as);
            }
          } else
            Se += le[0];
          ne = we.keywordPatternRe.lastIndex, le = we.keywordPatternRe.exec(Be);
        }
        Se += Be.substring(ne), Ve.addText(Se);
      }
      function $n() {
        if (Be === "") return;
        let ne = null;
        if (typeof we.subLanguage == "string") {
          if (!N[we.subLanguage]) {
            Ve.addText(Be);
            return;
          }
          ne = nn(we.subLanguage, Be, !0, di[we.subLanguage]), di[we.subLanguage] = /** @type {CompiledMode} */
          ne._top;
        } else
          ne = cr(Be, we.subLanguage.length ? we.subLanguage : null);
        we.relevance > 0 && (In += ne.relevance), Ve.__addSublanguage(ne._emitter, ne.language);
      }
      function ot() {
        we.subLanguage != null ? $n() : Mt(), Be = "";
      }
      function bt(ne, le) {
        ne !== "" && (Ve.startScope(le), Ve.addText(ne), Ve.endScope());
      }
      function li(ne, le) {
        let Se = 1;
        const Ie = le.length - 1;
        for (; Se <= Ie; ) {
          if (!ne._emit[Se]) {
            Se++;
            continue;
          }
          const Ye = wt.classNameAliases[ne[Se]] || ne[Se], At = le[Se];
          Ye ? bt(At, Ye) : (Be = At, Mt(), Be = ""), Se++;
        }
      }
      function ci(ne, le) {
        return ne.scope && typeof ne.scope == "string" && Ve.openNode(wt.classNameAliases[ne.scope] || ne.scope), ne.beginScope && (ne.beginScope._wrap ? (bt(Be, wt.classNameAliases[ne.beginScope._wrap] || ne.beginScope._wrap), Be = "") : ne.beginScope._multi && (li(ne.beginScope, le), Be = "")), we = Object.create(ne, { parent: { value: we } }), we;
      }
      function ui(ne, le, Se) {
        let Ie = b(ne.endRe, Se);
        if (Ie) {
          if (ne["on:end"]) {
            const Ye = new t(ne);
            ne["on:end"](le, Ye), Ye.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; ne.endsParent && ne.parent; )
              ne = ne.parent;
            return ne;
          }
        }
        if (ne.endsWithParent)
          return ui(ne.parent, le, Se);
      }
      function Ja(ne) {
        return we.matcher.regexIndex === 0 ? (Be += ne[0], 1) : (fr = !0, 0);
      }
      function es(ne) {
        const le = ne[0], Se = ne.rule, Ie = new t(Se), Ye = [Se.__beforeBegin, Se["on:begin"]];
        for (const At of Ye)
          if (At && (At(ne, Ie), Ie.isMatchIgnored))
            return Ja(le);
        return Se.skip ? Be += le : (Se.excludeBegin && (Be += le), ot(), !Se.returnBegin && !Se.excludeBegin && (Be = le)), ci(Se, ne), Se.returnBegin ? 0 : le.length;
      }
      function ts(ne) {
        const le = ne[0], Se = ce.substring(ne.index), Ie = ui(we, ne, Se);
        if (!Ie)
          return ri;
        const Ye = we;
        we.endScope && we.endScope._wrap ? (ot(), bt(le, we.endScope._wrap)) : we.endScope && we.endScope._multi ? (ot(), li(we.endScope, ne)) : Ye.skip ? Be += le : (Ye.returnEnd || Ye.excludeEnd || (Be += le), ot(), Ye.excludeEnd && (Be = le));
        do
          we.scope && Ve.closeNode(), !we.skip && !we.subLanguage && (In += we.relevance), we = we.parent;
        while (we !== Ie.parent);
        return Ie.starts && ci(Ie.starts, ne), Ye.returnEnd ? 0 : le.length;
      }
      function ns() {
        const ne = [];
        for (let le = we; le !== wt; le = le.parent)
          le.scope && ne.unshift(le.scope);
        ne.forEach((le) => Ve.openNode(le));
      }
      let zn = {};
      function hi(ne, le) {
        const Se = le && le[0];
        if (Be += ne, Se == null)
          return ot(), 0;
        if (zn.type === "begin" && le.type === "end" && zn.index === le.index && Se === "") {
          if (Be += ce.slice(le.index, le.index + 1), !Ue) {
            const Ie = new Error(`0 width match regex (${W})`);
            throw Ie.languageName = W, Ie.badRule = zn.rule, Ie;
          }
          return 1;
        }
        if (zn = le, le.type === "begin")
          return es(le);
        if (le.type === "illegal" && !Le) {
          const Ie = new Error('Illegal lexeme "' + Se + '" for mode "' + (we.scope || "<unnamed>") + '"');
          throw Ie.mode = we, Ie;
        } else if (le.type === "end") {
          const Ie = ts(le);
          if (Ie !== ri)
            return Ie;
        }
        if (le.type === "illegal" && Se === "")
          return Be += `
`, 1;
        if (dr > 1e5 && dr > le.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Be += Se, Se.length;
      }
      const wt = Ct(W);
      if (!wt)
        throw Me(We.replace("{}", W)), new Error('Unknown language: "' + W + '"');
      const rs = Oa(wt);
      let hr = "", we = Oe || rs;
      const di = {}, Ve = new ae.__emitter(ae);
      ns();
      let Be = "", In = 0, Ot = 0, dr = 0, fr = !1;
      try {
        if (wt.__emitTokens)
          wt.__emitTokens(ce, Ve);
        else {
          for (we.matcher.considerAll(); ; ) {
            dr++, fr ? fr = !1 : we.matcher.considerAll(), we.matcher.lastIndex = Ot;
            const ne = we.matcher.exec(ce);
            if (!ne) break;
            const le = ce.substring(Ot, ne.index), Se = hi(le, ne);
            Ot = ne.index + Se;
          }
          hi(ce.substring(Ot));
        }
        return Ve.finalize(), hr = Ve.toHTML(), {
          language: W,
          value: hr,
          relevance: In,
          illegal: !1,
          _emitter: Ve,
          _top: we
        };
      } catch (ne) {
        if (ne.message && ne.message.includes("Illegal"))
          return {
            language: W,
            value: or(ce),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: ne.message,
              index: Ot,
              context: ce.slice(Ot - 100, Ot + 100),
              mode: ne.mode,
              resultSoFar: hr
            },
            _emitter: Ve
          };
        if (Ue)
          return {
            language: W,
            value: or(ce),
            illegal: !1,
            relevance: 0,
            errorRaised: ne,
            _emitter: Ve,
            _top: we
          };
        throw ne;
      }
    }
    function lr(W) {
      const ce = {
        value: or(W),
        illegal: !1,
        relevance: 0,
        _top: se,
        _emitter: new ae.__emitter(ae)
      };
      return ce._emitter.addText(W), ce;
    }
    function cr(W, ce) {
      ce = ce || ae.languages || Object.keys(N);
      const Le = lr(W), Oe = ce.filter(Ct).filter(oi).map(
        (ot) => nn(ot, W, !1)
      );
      Oe.unshift(Le);
      const Ge = Oe.sort((ot, bt) => {
        if (ot.relevance !== bt.relevance) return bt.relevance - ot.relevance;
        if (ot.language && bt.language) {
          if (Ct(ot.language).supersetOf === bt.language)
            return 1;
          if (Ct(bt.language).supersetOf === ot.language)
            return -1;
        }
        return 0;
      }), [gt, Mt] = Ge, $n = gt;
      return $n.secondBest = Mt, $n;
    }
    function Da(W, ce, Le) {
      const Oe = ce && J[ce] || Le;
      W.classList.add("hljs"), W.classList.add(`language-${Oe}`);
    }
    function ur(W) {
      let ce = null;
      const Le = Ke(W);
      if (ye(Le)) return;
      if (Pn(
        "before:highlightElement",
        { el: W, language: Le }
      ), W.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", W);
        return;
      }
      if (W.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(W)), ae.throwUnescapedHTML))
        throw new ja(
          "One of your code blocks includes unescaped HTML.",
          W.innerHTML
        );
      ce = W;
      const Oe = ce.textContent, Ge = Le ? Ze(Oe, { language: Le, ignoreIllegals: !0 }) : cr(Oe);
      W.innerHTML = Ge.value, W.dataset.highlighted = "yes", Da(W, Le, Ge.language), W.result = {
        language: Ge.language,
        // TODO: remove with version 11.0
        re: Ge.relevance,
        relevance: Ge.relevance
      }, Ge.secondBest && (W.secondBest = {
        language: Ge.secondBest.language,
        relevance: Ge.secondBest.relevance
      }), Pn("after:highlightElement", { el: W, result: Ge, text: Oe });
    }
    function Fa(W) {
      ae = ni(ae, W);
    }
    const Ua = () => {
      Rn(), qe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Wa() {
      Rn(), qe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ai = !1;
    function Rn() {
      function W() {
        Rn();
      }
      if (document.readyState === "loading") {
        ai || window.addEventListener("DOMContentLoaded", W, !1), ai = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(ur);
    }
    function Za(W, ce) {
      let Le = null;
      try {
        Le = ce(x);
      } catch (Oe) {
        if (Me("Language definition for '{}' could not be registered.".replace("{}", W)), Ue)
          Me(Oe);
        else
          throw Oe;
        Le = se;
      }
      Le.name || (Le.name = W), N[W] = Le, Le.rawDefinition = ce.bind(null, x), Le.aliases && si(Le.aliases, { languageName: W });
    }
    function Ga(W) {
      delete N[W];
      for (const ce of Object.keys(J))
        J[ce] === W && delete J[ce];
    }
    function Xa() {
      return Object.keys(N);
    }
    function Ct(W) {
      return W = (W || "").toLowerCase(), N[W] || N[J[W]];
    }
    function si(W, { languageName: ce }) {
      typeof W == "string" && (W = [W]), W.forEach((Le) => {
        J[Le.toLowerCase()] = ce;
      });
    }
    function oi(W) {
      const ce = Ct(W);
      return ce && !ce.disableAutodetect;
    }
    function Qa(W) {
      W["before:highlightBlock"] && !W["before:highlightElement"] && (W["before:highlightElement"] = (ce) => {
        W["before:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      }), W["after:highlightBlock"] && !W["after:highlightElement"] && (W["after:highlightElement"] = (ce) => {
        W["after:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      });
    }
    function Ka(W) {
      Qa(W), be.push(W);
    }
    function Va(W) {
      const ce = be.indexOf(W);
      ce !== -1 && be.splice(ce, 1);
    }
    function Pn(W, ce) {
      const Le = W;
      be.forEach(function(Oe) {
        Oe[Le] && Oe[Le](ce);
      });
    }
    function Ya(W) {
      return qe("10.7.0", "highlightBlock will be removed entirely in v12.0"), qe("10.7.0", "Please use highlightElement now."), ur(W);
    }
    Object.assign(x, {
      highlight: Ze,
      highlightAuto: cr,
      highlightAll: Rn,
      highlightElement: ur,
      // TODO: Remove with v12 API
      highlightBlock: Ya,
      configure: Fa,
      initHighlighting: Ua,
      initHighlightingOnLoad: Wa,
      registerLanguage: Za,
      unregisterLanguage: Ga,
      listLanguages: Xa,
      getLanguage: Ct,
      registerAliases: si,
      autoDetection: oi,
      inherit: ni,
      addPlugin: Ka,
      removePlugin: Va
    }), x.debugMode = function() {
      Ue = !1;
    }, x.safeMode = function() {
      Ue = !0;
    }, x.versionString = qa, x.regex = {
      concat: d,
      lookahead: h,
      either: m,
      optional: g,
      anyNumberOfTimes: p
    };
    for (const W in M)
      typeof M[W] == "object" && e(M[W]);
    return Object.assign(x, M), x;
  }, Gt = ii({});
  return Gt.newInstance = () => ii({}), pr = Gt, Gt.HighlightJS = Gt, Gt.default = Gt, pr;
}
var os = /* @__PURE__ */ ss();
const Pe = /* @__PURE__ */ Ui(os), ls = "11.11.1", Ee = /* @__PURE__ */ new Map(), cs = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ut = {
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
const Wi = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Pt = null;
const gr = /* @__PURE__ */ new Map();
let us = null, hs = 300 * 1e3;
async function Zi(e = cs) {
  if (e)
    return Pt || (Pt = (async () => {
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
          const f = c.replace(/^\||\|$/g, "").split("|").map((y) => y.trim());
          if (f.every((y) => /^-+$/.test(y))) continue;
          const h = f;
          if (!h.length) continue;
          const g = (h[l] || h[0] || "").toString().trim().toLowerCase();
          if (!g || /^-+$/.test(g)) continue;
          Ee.set(g, g);
          const d = h[s] || "";
          if (d) {
            const y = String(d).split(",").map((m) => m.replace(/`/g, "").trim()).filter(Boolean);
            if (y.length) {
              const w = y[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (Ee.set(w, w), o.push(w));
            }
          }
        }
        try {
          const u = [];
          for (const c of o) {
            const f = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            f && /[a-z0-9]/i.test(f) ? u.push(f) : Ee.delete(c);
          }
          o = u;
        } catch (u) {
          k("[codeblocksManager] cleanup aliases failed", u);
        }
        try {
          let u = 0;
          for (const c of Array.from(Ee.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              Ee.delete(c), u++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const f = c.replace(/^[:]+/, "");
              if (f && /[a-z0-9]/i.test(f)) {
                const h = Ee.get(c);
                Ee.delete(c), Ee.set(f, h);
              } else
                Ee.delete(c), u++;
            }
          }
          for (const [c, f] of Array.from(Ee.entries()))
            (!f || /^-+$/.test(f) || !/[a-z0-9]/i.test(f)) && (Ee.delete(c), u++);
          try {
            const c = ":---------------------";
            Ee.has(c) && (Ee.delete(c), u++);
          } catch (c) {
            k("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(Ee.keys()).sort();
          } catch (c) {
            k("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (u) {
          k("[codeblocksManager] ignored error", u);
        }
      } catch (t) {
        k("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Pt);
}
const rn = /* @__PURE__ */ new Set();
async function xn(e, t) {
  if (Pt || (async () => {
    try {
      await Zi();
    } catch (r) {
      k("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Pt)
    try {
      await Pt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Wi.has(n)) return !1;
  if (Ee.size && !Ee.has(n)) {
    const r = ut;
    if (!r[n] && !r[e])
      return !1;
  }
  if (rn.has(e)) return !0;
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
      const f = ut[c];
      return !!(f && Ee.has(f));
    }));
    let o = null, u = null;
    for (const c of l)
      try {
        const f = Date.now();
        let h = gr.get(c);
        if (h && h.ok === !1 && f - (h.ts || 0) >= hs && (gr.delete(c), h = void 0), h) {
          if (h.module)
            o = h.module;
          else if (h.promise)
            try {
              o = await h.promise;
            } catch {
              o = null;
            }
        } else {
          const p = { promise: null, module: null, ok: null, ts: 0 };
          gr.set(c, p), p.promise = (async () => {
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
                  const d = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(d);
                } catch {
                  try {
                    const y = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(y);
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
            o = await p.promise, p.module = o, p.ok = !!o, p.ts = Date.now();
          } catch {
            p.module = null, p.ok = !1, p.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const p = o.default || o;
          try {
            const g = Ee.size && Ee.get(e) || c || e;
            return Pe.registerLanguage(g, p), rn.add(g), g !== e && (Pe.registerLanguage(e, p), rn.add(e)), !0;
          } catch (g) {
            u = g;
          }
        } else
          try {
            if (Ee.has(c) || Ee.has(e)) {
              const p = () => ({});
              try {
                Pe.registerLanguage(c, p), rn.add(c);
              } catch {
              }
              try {
                c !== e && (Pe.registerLanguage(e, p), rn.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (f) {
        u = f;
      }
    if (u)
      throw u;
    return !1;
  } catch {
    return !1;
  }
}
let Nn = null;
function ds(e = document) {
  Pt || (async () => {
    try {
      await Zi();
    } catch (a) {
      k("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = ut, i = Nn || (typeof IntersectionObserver > "u" ? null : (Nn = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (u) {
        k("[codeblocksManager] observer unobserve failed", u);
      }
      (async () => {
        try {
          const u = o.getAttribute && o.getAttribute("class") || o.className || "", c = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const f = (c[1] || "").toLowerCase(), h = t[f] || f, p = Ee.size && (Ee.get(h) || Ee.get(String(h).toLowerCase())) || h;
            try {
              await xn(p);
            } catch (g) {
              k("[codeblocksManager] registerLanguage failed", g);
            }
            try {
              try {
                const g = o.textContent || o.innerText || "";
                g != null && (o.textContent = g);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              Pe.highlightElement(o);
            } catch (g) {
              k("[codeblocksManager] hljs.highlightElement failed", g);
            }
          } else
            try {
              const f = o.textContent || "";
              try {
                if (Pe && typeof Pe.getLanguage == "function" && Pe.getLanguage("plaintext")) {
                  const h = Pe.highlight(f, { language: "plaintext" });
                  if (h && h.value)
                    try {
                      if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                        const p = document.createRange().createContextualFragment(h.value);
                        if (typeof o.replaceChildren == "function") o.replaceChildren(...Array.from(p.childNodes));
                        else {
                          for (; o.firstChild; ) o.removeChild(o.firstChild);
                          o.appendChild(p);
                        }
                      } else
                        o.innerHTML = h.value;
                    } catch {
                      try {
                        o.innerHTML = h.value;
                      } catch {
                      }
                    }
                }
              } catch {
                try {
                  Pe.highlightElement(o);
                } catch (p) {
                  k("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (f) {
              k("[codeblocksManager] auto-detect plaintext failed", f);
            }
        } catch (u) {
          k("[codeblocksManager] observer entry processing failed", u);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Nn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), u = t[o] || o, c = Ee.size && (Ee.get(u) || Ee.get(String(u).toLowerCase())) || u;
          try {
            await xn(c);
          } catch (f) {
            k("[codeblocksManager] registerLanguage failed (no observer)", f);
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
          Pe.highlightElement(a);
        } catch (o) {
          k("[codeblocksManager] hljs.highlightElement failed (no observer)", o);
        }
      } catch (s) {
        k("[codeblocksManager] loadSupportedLanguages fallback ignored error", s);
      }
    });
    return;
  }
  r.forEach((a) => {
    try {
      i.observe(a);
    } catch (s) {
      k("[codeblocksManager] observe failed", s);
    }
  });
}
function Bl(e, { useCdn: t = !0 } = {}) {
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
      k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${ls}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let Bt = "light";
function fs(e, t = {}) {
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
function yi() {
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
async function ps(e = "none", t = "/") {
  try {
    zt("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
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
    if (yi(), document.querySelector("style[data-bulma-override]")) return;
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
        k("[bulmaManager] fetch local bulma candidate failed", a);
      }
    return;
  }
  try {
    const r = String(e).trim();
    if (!r) return;
    yi();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    fs(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    k("[bulmaManager] ensureBulma failed", r);
  }
}
function gs(e) {
  Bt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Bt === "dark" ? n.setAttribute("data-theme", "dark") : Bt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Bt === "dark" ? n.setAttribute("data-theme", "dark") : Bt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function ql(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      k("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Gi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Bt === "dark" ? t.setAttribute("data-theme", "dark") : Bt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Xi = {
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
}, Vt = JSON.parse(JSON.stringify(Xi));
let Gn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Gn = String(e).split("-")[0].toLowerCase();
}
Xi[Gn] || (Gn = "en");
let It = Gn;
function ln(e, t = {}) {
  const n = Vt[It] || Vt.en;
  let i = n && n[e] ? n[e] : Vt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Qi(e, t) {
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
function Ki(e) {
  const t = String(e).split("-")[0].toLowerCase();
  It = Vt[t] ? t : "en";
}
const ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return It;
  },
  loadL10nFile: Qi,
  setLang: Ki,
  t: ln
}, Symbol.toStringTag, { value: "Module" }));
function ys(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function bi(e, t = null, n = void 0) {
  let r = "#/" + ys(String(e || ""));
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
let On = typeof DOMParser < "u" ? new DOMParser() : null;
function He() {
  return On || (typeof DOMParser < "u" ? (On = new DOMParser(), On) : null);
}
async function Xn(e, t, n = 4) {
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
const bs = `/**
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
function ws(e, t = "worker") {
  let n = null;
  function i(...o) {
    try {
      k(...o);
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
    return new Promise((c, f) => {
      const h = r();
      if (!h) return f(new Error("worker unavailable"));
      const p = String(Math.random()), g = Object.assign({}, o, { id: p });
      let d = null;
      const y = () => {
        d && clearTimeout(d), h.removeEventListener("message", m), h.removeEventListener("error", w);
      }, m = (b) => {
        const _ = b.data || {};
        _.id === p && (y(), _.error ? f(new Error(_.error)) : c(_.result));
      }, w = (b) => {
        y(), i("[" + t + "] worker error event", b);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (_) {
          i("[" + t + "] worker termination failed", _);
        }
        f(new Error(b && b.message || "worker error"));
      };
      d = setTimeout(() => {
        y(), i("[" + t + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (b) {
          i("[" + t + "] worker termination on timeout failed", b);
        }
        f(new Error("worker timeout"));
      }, u), h.addEventListener("message", m), h.addEventListener("error", w);
      try {
        h.postMessage(g);
      } catch (b) {
        y(), f(b);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function Vi(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...g) {
    try {
      k(...g);
    } catch {
    }
  }
  function s(g) {
    if (!i[g])
      try {
        const d = e();
        i[g] = d || null, d && d.addEventListener("error", () => {
          try {
            i[g] === d && (i[g] = null, d.terminate && d.terminate());
          } catch (y) {
            a("[" + t + "] worker termination failed", y);
          }
        });
      } catch (d) {
        i[g] = null, a("[" + t + "] worker init failed", d);
      }
    return i[g];
  }
  const l = new Array(n).fill(0), o = new Array(n).fill(null), u = 30 * 1e3;
  function c(g) {
    try {
      l[g] = Date.now(), o[g] && (clearTimeout(o[g]), o[g] = null), o[g] = setTimeout(() => {
        try {
          i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
        } catch (d) {
          a("[" + t + "] idle termination failed", d);
        }
        o[g] = null;
      }, u);
    } catch {
    }
  }
  function f() {
    for (let g = 0; g < i.length; g++) {
      const d = s(g);
      if (d) return d;
    }
    return null;
  }
  function h() {
    for (let g = 0; g < i.length; g++)
      try {
        i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
      } catch (d) {
        a("[" + t + "] worker termination failed", d);
      }
  }
  function p(g, d = 1e4) {
    return new Promise((y, m) => {
      const w = r++ % i.length, b = (_) => {
        const S = (w + _) % i.length, v = s(S);
        if (!v)
          return _ + 1 < i.length ? b(_ + 1) : m(new Error("worker pool unavailable"));
        const T = String(Math.random()), X = Object.assign({}, g, { id: T });
        let P = null;
        const ie = () => {
          P && clearTimeout(P), v.removeEventListener("message", z), v.removeEventListener("error", q);
        }, z = (G) => {
          const F = G.data || {};
          F.id === T && (ie(), F.error ? m(new Error(F.error)) : y(F.result));
        }, q = (G) => {
          ie(), a("[" + t + "] worker error event", G);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (F) {
            a("[" + t + "] worker termination failed", F);
          }
          m(new Error(G && G.message || "worker error"));
        };
        P = setTimeout(() => {
          ie(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (G) {
            a("[" + t + "] worker termination on timeout failed", G);
          }
          m(new Error("worker timeout"));
        }, d), v.addEventListener("message", z), v.addEventListener("error", q);
        try {
          c(S), v.postMessage(X);
        } catch (G) {
          ie(), m(G);
        }
      };
      b(0);
    });
  }
  return { get: f, send: p, terminate: h };
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
          k("[worker-manager] createWorkerFromRaw failed", t);
        } catch {
        }
      }
  } catch (t) {
    try {
      k("[worker-manager] createWorkerFromRaw failed", t);
    } catch {
    }
  }
  return null;
}
const rt = /* @__PURE__ */ new Set();
function Dt(e) {
  if (_s(), rt.clear(), Array.isArray(Ne) && Ne.length)
    for (const t of Ne)
      t && rt.add(t);
  else
    for (const t of $e)
      t && rt.add(t);
  wi(te), wi(D), Dt._refreshed = !0;
}
function wi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && rt.add(t);
}
function _i(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && rt.add(i), t.call(this, n, i);
  };
}
let ki = !1;
function _s() {
  ki || (_i(te), _i(D), ki = !0);
}
const mr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: rt,
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
function vr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const ee = en(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), Yt = en(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Ut = en(function(e) {
  return Yt(String(e || "")) + "/";
}, 2e3);
function ks(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    k("[helpers] preloadImage failed", t);
  }
}
function Bn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let f = 0;
    r && (f = r.clientHeight || (a ? a.height : 0)), f || (f = l - s);
    let h = 0.6;
    try {
      const y = r && window.getComputedStyle ? window.getComputedStyle(r) : null, m = y && y.getPropertyValue("--nimbi-image-max-height-ratio"), w = m ? parseFloat(m) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (h = w);
    } catch (y) {
      k("[helpers] read CSS ratio failed", y);
    }
    const p = Math.max(200, Math.floor(f * h));
    let g = !1, d = null;
    if (i.forEach((y) => {
      try {
        const m = y.getAttribute ? y.getAttribute("loading") : void 0;
        m !== "eager" && y.setAttribute && y.setAttribute("loading", "lazy");
        const w = y.getBoundingClientRect ? y.getBoundingClientRect() : null, b = y.src || y.getAttribute && y.getAttribute("src"), _ = w && w.height > 1 ? w.height : p, S = w ? w.top : 0, v = S + _;
        w && _ > 0 && S <= c && v >= o && (y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high"), ks(b), g = !0), !d && w && w.top <= c && (d = { img: y, src: b, rect: w, beforeLoading: m });
      } catch (m) {
        k("[helpers] setEagerForAboveFoldImages per-image failed", m);
      }
    }), !g && d) {
      const { img: y, src: m, rect: w, beforeLoading: b } = d;
      try {
        y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high");
      } catch (_) {
        k("[helpers] setEagerForAboveFoldImages fallback failed", _);
      }
    }
  } catch (i) {
    k("[helpers] setEagerForAboveFoldImages failed", i);
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
    return k("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Qn(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      k("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    k("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Qn);
} catch (e) {
  k("[helpers] global attach failed", e);
}
const xs = en(function(e) {
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
}, 2e3), te = /* @__PURE__ */ new Map();
let at = [], qr = !1;
function Ss(e) {
  qr = !!e;
}
function Yi(e) {
  at = Array.isArray(e) ? e.slice() : [];
}
function vs() {
  return at;
}
const Sn = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Ji = Vi(() => un(bs), "slugManager", Sn);
function As() {
  try {
    if (Or()) return !0;
  } catch {
  }
  try {
    return !!(typeof oe == "string" && oe);
  } catch {
    return !1;
  }
}
function fe(...e) {
  try {
    zt(...e);
  } catch {
  }
}
function Es() {
  return Ji.get();
}
function ea(e) {
  return Ji.send(e, 5e3);
}
async function Ar(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => ct);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await ea({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Cs(e, t, n) {
  const i = await Promise.resolve().then(() => ct);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return ea({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function tt(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = ee(typeof t == "string" ? t : String(t || ""));
  } catch {
    n = String(t || "");
  }
  if (n) {
    try {
      if (at && at.length) {
        const r = String(n).split("/")[0], a = at.includes(r);
        let s = te.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? ee(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = ee(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, te.set(e, s);
      } else {
        const i = te.has(e) ? te.get(e) : void 0;
        if (i) {
          let r = null;
          try {
            typeof i == "string" ? r = ee(i) : i && typeof i == "object" && (r = i.default ? ee(i.default) : null);
          } catch {
            r = null;
          }
          if (!r || r === n)
            te.set(e, n);
          else
            try {
              const a = /* @__PURE__ */ new Set();
              for (const l of te.keys()) a.add(l);
              const s = typeof Ft == "function" ? Ft(e, a) : `${e}-2`;
              te.set(s, n), e = s;
            } catch {
            }
        } else
          te.set(e, n);
      }
    } catch {
    }
    try {
      if (n) {
        try {
          D.set(n, e);
        } catch {
        }
        try {
          if ($e && typeof $e.has == "function") {
            if (!$e.has(n)) {
              try {
                $e.add(n);
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
const nr = /* @__PURE__ */ new Set();
function Ms(e) {
  typeof e == "function" && nr.add(e);
}
function Ls(e) {
  typeof e == "function" && nr.delete(e);
}
const D = /* @__PURE__ */ new Map();
let Er = {}, Ne = [];
const $e = /* @__PURE__ */ new Set();
let oe = "_404.md", mt = null;
const jr = "_home";
function ta(e) {
  if (e == null) {
    oe = null;
    return;
  }
  oe = String(e || "");
}
function na(e) {
  if (e == null) {
    mt = null;
    return;
  }
  mt = String(e || "");
}
function Ts(e) {
  Er = e || {};
}
function ra(e) {
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
      fe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        re = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const hn = /* @__PURE__ */ new Map(), Kn = /* @__PURE__ */ new Set();
function Rs() {
  hn.clear(), Kn.clear();
}
function Ps(e) {
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
function Hr(e) {
  te.clear(), D.clear(), Ne = [];
  try {
    $e.clear();
  } catch {
  }
  at = at || [];
  const t = Object.keys(Er || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), fe("[slugManager] parse contentBase failed", i);
      }
      n = Ut(n);
    }
  } catch (i) {
    n = "", fe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Ps(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = ee(i.slice(n.length)) : r = ee(i), Ne.push(r);
    try {
      $e.add(r);
    } catch {
    }
    try {
      Dt();
    } catch (s) {
      fe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Er[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ue(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!at || !at.length) && (o = Ft(o, new Set(te.keys()))), at && at.length) {
              const c = r.split("/")[0], f = at.includes(c);
              let h = te.get(o);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), f ? h.langs[c] = r : h.default = r, te.set(o, h);
            } else
              te.set(o, r);
            D.set(r, o);
          } catch (o) {
            fe("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Hr();
} catch (e) {
  fe("[slugManager] initial setContentBase failed", e);
}
function Ft(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function $s(e) {
  return Mn(e, void 0);
}
function Mn(e, t) {
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
function Dn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function Jt(e) {
  if (!e || !te.has(e)) return null;
  const t = te.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (at && at.length && It && t.langs && t.langs[It])
    return t.langs[It];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Qt = /* @__PURE__ */ new Map();
function zs() {
  Qt.clear(), dn.clear();
}
const dn = /* @__PURE__ */ new Map();
let ia = 60 * 1e3;
function Is(e) {
  ia = Number(e) || 0;
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
    if (o && te.has(o)) {
      const u = Jt(o) || te.get(o);
      u && u !== e && (e = u);
    }
  } catch (o) {
    fe("[slugManager] slug mapping normalization failed", o);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const o = String(e).split("::", 1)[0];
      if (o)
        try {
          if (te.has(o)) {
            const u = Jt(o) || te.get(o);
            u ? e = u : e = o;
          } else
            e = o;
        } catch {
          e = o;
        }
    }
  } catch (o) {
    fe("[slugManager] path sanitize failed", o);
  }
  if (!(n && n.force === !0 || typeof oe == "string" && oe || te && te.size || $e && $e.size || Or()))
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
  if (Qt.has(a))
    return Qt.get(a);
  const l = (async () => {
    const o = await fetch(a);
    if (!o || typeof o.ok != "boolean" || !o.ok) {
      if (o && o.status === 404 && typeof oe == "string" && oe)
        try {
          const g = `${r}/${oe}`, d = await globalThis.fetch(g);
          if (d && typeof d.ok == "boolean" && d.ok)
            return { raw: await d.text(), status: 404 };
        } catch (g) {
          fe("[slugManager] fetching fallback 404 failed", g);
        }
      let p = "";
      try {
        o && typeof o.clone == "function" ? p = await o.clone().text() : o && typeof o.text == "function" ? p = await o.text() : p = "";
      } catch (g) {
        p = "", fe("[slugManager] reading error body failed", g);
      }
      try {
        const g = o ? o.status : void 0;
        if (g === 404)
          try {
            k("fetchMarkdown failed (404):", () => ({ url: a, status: g, statusText: o ? o.statusText : void 0, body: p.slice(0, 200) }));
          } catch {
          }
        else
          try {
            Zn("fetchMarkdown failed:", () => ({ url: a, status: g, statusText: o ? o.statusText : void 0, body: p.slice(0, 200) }));
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const u = await o.text(), c = u.trim().slice(0, 128).toLowerCase(), f = /^(?:<!doctype|<html|<title|<h1)/.test(c), h = f || String(e || "").toLowerCase().endsWith(".html");
    if (f && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof oe == "string" && oe) {
          const p = `${r}/${oe}`, g = await globalThis.fetch(p);
          if (g.ok)
            return { raw: await g.text(), status: 404 };
        }
      } catch (p) {
        fe("[slugManager] fetching fallback 404 failed", p);
      }
      throw As() && Zn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return h ? { raw: u, isHtml: !0 } : { raw: u };
  })().catch((o) => {
    try {
      dn.set(a, Date.now() + ia);
    } catch {
    }
    try {
      Qt.delete(a);
    } catch {
    }
    throw o;
  });
  return Qt.set(a, l), l;
};
function Ns(e) {
  typeof e == "function" && (Te = e);
}
const Fn = /* @__PURE__ */ new Map();
function Os(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let re = [];
function Bs() {
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
          return Cr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Cr;
      } catch {
      }
    }
} catch {
}
let Rt = null;
async function jt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => ee(String(a || ""))))) : [];
  try {
    const a = ee(String(oe || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (re && re.length && t === 1 && !re.some((s) => {
    try {
      return r.includes(ee(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return re;
  if (Rt) return Rt;
  Rt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((d) => ee(String(d || ""))))) : [];
    try {
      const d = ee(String(oe || ""));
      d && !a.includes(d) && a.push(d);
    } catch {
    }
    const s = (d) => {
      if (!a || !a.length) return !1;
      for (const y of a)
        if (y && (d === y || d.startsWith(y + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const d of i)
          try {
            const y = ee(String(d || ""));
            y && l.push(y);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Ne) && Ne.length && (l = Array.from(Ne)), !l.length) {
      if (D && typeof D.size == "number" && D.size)
        try {
          l = Array.from(D.keys());
        } catch {
          l = [];
        }
      else
        for (const d of te.values())
          if (d) {
            if (typeof d == "string")
              l.push(d);
            else if (d && typeof d == "object") {
              d.default && l.push(d.default);
              const y = d.langs || {};
              for (const m of Object.keys(y || {}))
                try {
                  y[m] && l.push(y[m]);
                } catch {
                }
            }
          }
    }
    try {
      const d = await ca(e);
      d && d.length && (l = l.concat(d));
    } catch (d) {
      fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", d);
    }
    try {
      const d = new Set(l), y = [...l], m = Math.max(1, Sn), w = async () => {
        for (; !(d.size > Ln); ) {
          const _ = y.shift();
          if (!_) break;
          try {
            const S = await Te(_, e);
            if (S && S.raw) {
              if (S.status === 404) continue;
              let v = S.raw;
              const T = [], X = String(_ || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(X) && qr && (!_ || !_.includes("/")))
                continue;
              const P = Os(v), ie = /\[[^\]]+\]\(([^)]+)\)/g;
              let z;
              for (; z = ie.exec(P); )
                T.push(z[1]);
              const q = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; z = q.exec(P); )
                T.push(z[1]);
              const G = _ && _.includes("/") ? _.substring(0, _.lastIndexOf("/") + 1) : "";
              for (let F of T)
                try {
                  if (Mn(F, e) || F.startsWith("..") || F.indexOf("/../") !== -1 || (G && !F.startsWith("./") && !F.startsWith("/") && !F.startsWith("../") && (F = G + F), F = ee(F), !/\.(md|html?)(?:$|[?#])/i.test(F)) || (F = F.split(/[?#]/)[0], s(F))) continue;
                  d.has(F) || (d.add(F), y.push(F), l.push(F));
                } catch (H) {
                  fe("[slugManager] href processing failed", F, H);
                }
            }
          } catch (S) {
            fe("[slugManager] discovery fetch failed for", _, S);
          }
        }
      }, b = [];
      for (let _ = 0; _ < m; _++) b.push(w());
      await Promise.all(b);
    } catch (d) {
      fe("[slugManager] discovery loop failed", d);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((d) => !d || o.has(d) || s(d) ? !1 : (o.add(d), !0));
    const u = [], c = /* @__PURE__ */ new Map(), f = l.filter((d) => /\.(?:md|html?)(?:$|[?#])/i.test(d)), h = Math.max(1, Math.min(Sn, f.length || 1)), p = f.slice(), g = [];
    for (let d = 0; d < h; d++)
      g.push((async () => {
        for (; p.length; ) {
          const y = p.shift();
          if (!y) break;
          try {
            const m = await Te(y, e);
            c.set(y, m);
          } catch (m) {
            fe("[slugManager] buildSearchIndex: entry fetch failed", y, m), c.set(y, null);
          }
        }
      })());
    await Promise.all(g);
    for (const d of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(d))
        try {
          const y = c.get(d);
          if (!y || !y.raw || y.status === 404) continue;
          let m = "", w = "", b = null;
          if (y.isHtml)
            try {
              const S = He(), v = S ? S.parseFromString(y.raw, "text/html") : null, T = v ? v.querySelector("title") || v.querySelector("h1") : null;
              T && T.textContent && (m = T.textContent.trim());
              const X = v ? v.querySelector("p") : null;
              if (X && X.textContent && (w = X.textContent.trim()), t >= 2)
                try {
                  const P = v ? v.querySelector("h1") : null, ie = P && P.textContent ? P.textContent.trim() : m || "";
                  try {
                    const q = D && typeof D.has == "function" && D.has(d) ? D.get(d) : null;
                    if (q)
                      b = q;
                    else {
                      let G = ue(m || d);
                      const F = /* @__PURE__ */ new Set();
                      try {
                        for (const A of te.keys()) F.add(A);
                      } catch {
                      }
                      try {
                        for (const A of u)
                          A && A.slug && F.add(String(A.slug).split("::")[0]);
                      } catch {
                      }
                      let H = !1;
                      try {
                        if (te.has(G)) {
                          const A = te.get(G);
                          if (typeof A == "string")
                            A === d && (H = !0);
                          else if (A && typeof A == "object") {
                            A.default === d && (H = !0);
                            for (const Q of Object.keys(A.langs || {}))
                              if (A.langs[Q] === d) {
                                H = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !H && F.has(G) && (G = Ft(G, F)), b = G;
                      try {
                        D.has(d) || tt(b, d);
                      } catch {
                      }
                    }
                  } catch (q) {
                    fe("[slugManager] derive pageSlug failed", q);
                  }
                  const z = Array.from(v.querySelectorAll("h2"));
                  for (const q of z)
                    try {
                      const G = (q.textContent || "").trim();
                      if (!G) continue;
                      const F = q.id ? q.id : ue(G), H = b ? `${b}::${F}` : `${ue(d)}::${F}`;
                      let A = "", Q = q.nextElementSibling;
                      for (; Q && Q.tagName && Q.tagName.toLowerCase() === "script"; ) Q = Q.nextElementSibling;
                      Q && Q.textContent && (A = String(Q.textContent).trim()), u.push({ slug: H, title: G, excerpt: A, path: d, parentTitle: ie });
                    } catch (G) {
                      fe("[slugManager] indexing H2 failed", G);
                    }
                  if (t === 3)
                    try {
                      const q = Array.from(v.querySelectorAll("h3"));
                      for (const G of q)
                        try {
                          const F = (G.textContent || "").trim();
                          if (!F) continue;
                          const H = G.id ? G.id : ue(F), A = b ? `${b}::${H}` : `${ue(d)}::${H}`;
                          let Q = "", K = G.nextElementSibling;
                          for (; K && K.tagName && K.tagName.toLowerCase() === "script"; ) K = K.nextElementSibling;
                          K && K.textContent && (Q = String(K.textContent).trim()), u.push({ slug: A, title: F, excerpt: Q, path: d, parentTitle: ie });
                        } catch (F) {
                          fe("[slugManager] indexing H3 failed", F);
                        }
                    } catch (q) {
                      fe("[slugManager] collect H3s failed", q);
                    }
                } catch (P) {
                  fe("[slugManager] collect H2s failed", P);
                }
            } catch (S) {
              fe("[slugManager] parsing HTML for index failed", S);
            }
          else {
            const S = y.raw, v = S.match(/^#\s+(.+)$/m);
            m = v ? v[1].trim() : "";
            try {
              m = Dn(m);
            } catch {
            }
            const T = S.split(/\r?\n\s*\r?\n/);
            if (T.length > 1)
              for (let X = 1; X < T.length; X++) {
                const P = T[X].trim();
                if (P && !/^#/.test(P)) {
                  w = P.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let X = "";
              try {
                const P = (S.match(/^#\s+(.+)$/m) || [])[1];
                X = P ? P.trim() : "";
                try {
                  const q = D && typeof D.has == "function" && D.has(d) ? D.get(d) : null;
                  if (q)
                    b = q;
                  else {
                    let G = ue(m || d);
                    const F = /* @__PURE__ */ new Set();
                    try {
                      for (const A of te.keys()) F.add(A);
                    } catch {
                    }
                    try {
                      for (const A of u)
                        A && A.slug && F.add(String(A.slug).split("::")[0]);
                    } catch {
                    }
                    let H = !1;
                    try {
                      if (te.has(G)) {
                        const A = te.get(G);
                        if (typeof A == "string")
                          A === d && (H = !0);
                        else if (A && typeof A == "object") {
                          A.default === d && (H = !0);
                          for (const Q of Object.keys(A.langs || {}))
                            if (A.langs[Q] === d) {
                              H = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !H && F.has(G) && (G = Ft(G, F)), b = G;
                    try {
                      D.has(d) || tt(b, d);
                    } catch {
                    }
                  }
                } catch (q) {
                  fe("[slugManager] derive pageSlug failed", q);
                }
                const ie = /^##\s+(.+)$/gm;
                let z;
                for (; z = ie.exec(S); )
                  try {
                    const q = (z[1] || "").trim(), G = Dn(q);
                    if (!q) continue;
                    const F = ue(q), H = b ? `${b}::${F}` : `${ue(d)}::${F}`, Q = S.slice(ie.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), K = Q && Q[1] ? String(Q[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    u.push({ slug: H, title: G, excerpt: K, path: d, parentTitle: X });
                  } catch (q) {
                    fe("[slugManager] indexing markdown H2 failed", q);
                  }
              } catch (P) {
                fe("[slugManager] collect markdown H2s failed", P);
              }
              if (t === 3)
                try {
                  const P = /^###\s+(.+)$/gm;
                  let ie;
                  for (; ie = P.exec(S); )
                    try {
                      const z = (ie[1] || "").trim(), q = Dn(z);
                      if (!z) continue;
                      const G = ue(z), F = b ? `${b}::${G}` : `${ue(d)}::${G}`, A = S.slice(P.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), Q = A && A[1] ? String(A[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      u.push({ slug: F, title: q, excerpt: Q, path: d, parentTitle: X });
                    } catch (z) {
                      fe("[slugManager] indexing markdown H3 failed", z);
                    }
                } catch (P) {
                  fe("[slugManager] collect markdown H3s failed", P);
                }
            }
          }
          let _ = "";
          try {
            D.has(d) && (_ = D.get(d));
          } catch (S) {
            fe("[slugManager] mdToSlug access failed", S);
          }
          if (!_) {
            try {
              if (!b) {
                const S = D && typeof D.has == "function" && D.has(d) ? D.get(d) : null;
                if (S)
                  b = S;
                else {
                  let v = ue(m || d);
                  const T = /* @__PURE__ */ new Set();
                  try {
                    for (const P of te.keys()) T.add(P);
                  } catch {
                  }
                  try {
                    for (const P of u)
                      P && P.slug && T.add(String(P.slug).split("::")[0]);
                  } catch {
                  }
                  let X = !1;
                  try {
                    if (te.has(v)) {
                      const P = te.get(v);
                      if (typeof P == "string")
                        P === d && (X = !0);
                      else if (P && typeof P == "object") {
                        P.default === d && (X = !0);
                        for (const ie of Object.keys(P.langs || {}))
                          if (P.langs[ie] === d) {
                            X = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !X && T.has(v) && (v = Ft(v, T)), b = v;
                  try {
                    D.has(d) || tt(b, d);
                  } catch {
                  }
                }
              }
            } catch (S) {
              fe("[slugManager] derive pageSlug failed", S);
            }
            _ = b || ue(m || d);
          }
          u.push({ slug: _, title: m, excerpt: w, path: d });
        } catch (y) {
          fe("[slugManager] buildSearchIndex: entry processing failed", y);
        }
    try {
      const d = u.filter((y) => {
        try {
          return !s(String(y.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const y of d) re.push(y);
      } catch {
        try {
          re = Array.from(d);
        } catch {
          re = d;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = re;
          } catch {
          }
          try {
            const y = [], m = /* @__PURE__ */ new Set();
            for (const w of re)
              try {
                if (!w || !w.slug) continue;
                const b = String(w.slug).split("::")[0];
                if (m.has(b)) continue;
                m.add(b);
                const _ = { slug: b };
                w.title ? _.title = String(w.title) : w.parentTitle && (_.title = String(w.parentTitle)), w.path && (_.path = String(w.path)), y.push(_);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = y;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (d) {
      fe("[slugManager] filtering index by excludes failed", d);
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const y of u) re.push(y);
      } catch {
        try {
          re = Array.from(u);
        } catch {
          re = u;
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
    await Rt;
  } catch (a) {
    fe("[slugManager] awaiting _indexPromise failed", a);
  }
  return Rt = null, re;
}
async function $t(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(re) && re.length && !Rt && !s) return re;
    if (Rt) {
      try {
        await Rt;
      } catch {
      }
      return re;
    }
    if (s) {
      try {
        if (typeof Ar == "function")
          try {
            const o = await Ar(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                ra(o);
              } catch {
              }
              return re;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await jt(n, i, r, a), re;
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
async function Cr(e = {}) {
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
const aa = 1e3;
let Ln = aa;
function qs(e) {
  typeof e == "number" && e >= 0 && (Ln = e);
}
const sa = He(), oa = "a[href]";
let la = async function(e, t, n = Ln) {
  if (Fn.has(e)) return Fn.get(e);
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
    await Xn(u, async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let f = "";
      try {
        f = new URL(c || "", l).toString();
      } catch {
        f = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let h;
        try {
          h = await globalThis.fetch(f);
        } catch (m) {
          fe("[slugManager] crawlForSlug: fetch failed", { url: f, error: m });
          return;
        }
        if (!h || !h.ok) {
          h && !h.ok && fe("[slugManager] crawlForSlug: directory fetch non-ok", { url: f, status: h.status });
          return;
        }
        const p = await h.text(), d = sa.parseFromString(p, "text/html").querySelectorAll(oa), y = f;
        for (const m of d)
          try {
            if (i) break;
            let w = m.getAttribute("href") || "";
            if (!w || Mn(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const b = new URL(w, y), _ = new URL(l).pathname, S = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), v = Ut(ee(S));
                r.has(v) || a.push(v);
              } catch {
                const _ = ee(c + w);
                r.has(_) || a.push(_);
              }
              continue;
            }
            if (w.toLowerCase().endsWith(".md")) {
              let b = "";
              try {
                const _ = new URL(w, y), S = new URL(l).pathname;
                b = _.pathname.startsWith(S) ? _.pathname.slice(S.length) : _.pathname.replace(/^\//, "");
              } catch {
                b = (c + w).replace(/^\//, "");
              }
              b = ee(b);
              try {
                if (D.has(b))
                  continue;
                for (const _ of te.values())
                  ;
              } catch (_) {
                fe("[slugManager] slug map access failed", _);
              }
              try {
                const _ = await Te(b, t);
                if (_ && _.raw) {
                  const S = (_.raw || "").match(/^#\s+(.+)$/m);
                  if (S && S[1] && ue(S[1].trim()) === e) {
                    i = b;
                    break;
                  }
                }
              } catch (_) {
                fe("[slugManager] crawlForSlug: fetchMarkdown failed", _);
              }
            }
          } catch (w) {
            fe("[slugManager] crawlForSlug: link iteration failed", w);
          }
      } catch (h) {
        fe("[slugManager] crawlForSlug: directory fetch failed", h);
      }
    }, o);
  }
  return Fn.set(e, i), i;
};
async function ca(e, t = Ln) {
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
    await Xn(o, async (u) => {
      if (u == null || i.has(u)) return;
      i.add(u);
      let c = "";
      try {
        c = new URL(u || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(u || "").replace(/^\//, "");
      }
      try {
        let f;
        try {
          f = await globalThis.fetch(c);
        } catch (y) {
          fe("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: y });
          return;
        }
        if (!f || !f.ok) {
          f && !f.ok && fe("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: f.status });
          return;
        }
        const h = await f.text(), g = sa.parseFromString(h, "text/html").querySelectorAll(oa), d = c;
        for (const y of g)
          try {
            let m = y.getAttribute("href") || "";
            if (!m || Mn(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
            if (m.endsWith("/")) {
              try {
                const b = new URL(m, d), _ = new URL(s).pathname, S = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), v = Ut(ee(S));
                i.has(v) || r.push(v);
              } catch {
                const _ = u + m;
                i.has(_) || r.push(_);
              }
              continue;
            }
            let w = "";
            try {
              const b = new URL(m, d), _ = new URL(s).pathname;
              w = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, "");
            } catch {
              w = (u + m).replace(/^\//, "");
            }
            w = ee(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (m) {
            fe("[slugManager] crawlAllMarkdown: link iteration failed", m);
          }
      } catch (f) {
        fe("[slugManager] crawlAllMarkdown: directory fetch failed", f);
      }
    }, l);
  }
  return Array.from(n);
}
async function ua(e, t, n) {
  if (e && typeof e == "string" && (e = ee(e), e = Yt(e)), te.has(e))
    return Jt(e) || te.get(e);
  try {
    if (!(typeof oe == "string" && oe || te.has(e) || $e && $e.size || Dt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of nr)
    try {
      const a = await r(e, t);
      if (a)
        return tt(e, a), a;
    } catch (a) {
      fe("[slugManager] slug resolver failed", a);
    }
  if ($e && $e.size) {
    if (hn.has(e)) {
      const r = hn.get(e);
      return tt(e, r), r;
    }
    for (const r of Ne)
      if (!Kn.has(r))
        try {
          const a = await Te(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ue(s[1].trim());
              if (Kn.add(r), l && hn.set(l, r), l === e)
                return tt(e, r), r;
            }
          }
        } catch (a) {
          fe("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await jt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return tt(e, a.path), a.path;
    }
  } catch (r) {
    fe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await la(e, t, n);
    if (r)
      return tt(e, r), r;
  } catch (r) {
    fe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Te(r, t);
      if (a && a.raw)
        return tt(e, r), r;
    } catch (a) {
      fe("[slugManager] candidate fetch failed", a);
    }
  if ($e && $e.size)
    for (const r of Ne)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ue(a) === e)
          return tt(e, r), r;
      } catch (a) {
        fe("[slugManager] build-time filename match failed", a);
      }
  try {
    if (mt && typeof mt == "string" && mt.trim())
      try {
        const r = await Te(mt, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && ue(a[1].trim()) === e)
            return tt(e, mt), mt;
        }
      } catch (r) {
        fe("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    fe("[slugManager] home page fetch failed", r);
  }
  return null;
}
const ct = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: aa,
  HOME_SLUG: jr,
  _setAllMd: Ts,
  _setSearchIndex: ra,
  _storeSlugMapping: tt,
  addSlugResolver: Ms,
  get allMarkdownPaths() {
    return Ne;
  },
  allMarkdownPathsSet: $e,
  get availableLanguages() {
    return at;
  },
  awaitSearchIndex: Cr,
  buildSearchIndex: jt,
  buildSearchIndexWorker: Ar,
  clearFetchCache: zs,
  clearListCaches: Rs,
  crawlAllMarkdown: ca,
  crawlCache: Fn,
  crawlForSlug: la,
  crawlForSlugWorker: Cs,
  get defaultCrawlMaxQueue() {
    return Ln;
  },
  ensureSlug: ua,
  fetchCache: Qt,
  get fetchMarkdown() {
    return Te;
  },
  getLanguages: vs,
  getSearchIndex: Bs,
  get homePage() {
    return mt;
  },
  initSlugWorker: Es,
  isExternalLink: $s,
  isExternalLinkWithBase: Mn,
  listPathsFetched: Kn,
  listSlugCache: hn,
  mdToSlug: D,
  negativeFetchCache: dn,
  get notFoundPage() {
    return oe;
  },
  removeSlugResolver: Ls,
  resolveSlugPath: Jt,
  get searchIndex() {
    return re;
  },
  setContentBase: Hr,
  setDefaultCrawlMaxQueue: qs,
  setFetchMarkdown: Ns,
  setFetchNegativeCacheTTL: Is,
  setHomePage: na,
  setLanguages: Yi,
  setNotFoundPage: ta,
  setSkipRootReadme: Ss,
  get skipRootReadme() {
    return qr;
  },
  slugResolvers: nr,
  slugToMd: te,
  slugify: ue,
  unescapeMarkdown: Dn,
  uniqueSlug: Ft,
  whenSearchIndexReady: $t
}, Symbol.toStringTag, { value: "Module" }));
var yr, xi;
function js() {
  if (xi) return yr;
  xi = 1;
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
    const c = s.wordsPerMinute || 200, f = s.wordBound || n;
    for (; f(a[o]); ) o++;
    for (; f(a[u]); ) u--;
    const h = `${a}
`;
    for (let y = o; y <= u; y++)
      if ((t(h[y]) || !f(h[y]) && (f(h[y + 1]) || t(h[y + 1]))) && l++, t(h[y]))
        for (; y <= u && (i(h[y + 1]) || f(h[y + 1])); )
          y++;
    const p = l / c, g = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: g,
      words: l
    };
  }
  return yr = r, yr;
}
var Hs = js();
const Ds = /* @__PURE__ */ Ui(Hs);
function vn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ha(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    k("[seoManager] upsertLinkRel failed", n);
  }
}
function Fs(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Lt("property", "og:description", a), a && String(a).trim() && Lt("name", "twitter:description", a), Lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Lt("property", "og:image", s), Lt("name", "twitter:image", s));
}
function Dr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && vn("description", l), vn("robots", a.robots || "index,follow"), Fs(a, t, n, l);
}
function Us() {
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
    k("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Fr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const g = ee(t);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(g);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (g) {
      c = location.href.split("#")[0], k("[seoManager] compute canonical failed", g);
    }
    c && ha("canonical", c);
    try {
      Lt("property", "og:url", c);
    } catch (g) {
      k("[seoManager] upsertMeta og:url failed", g);
    }
    const f = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    u && (f.image = String(u)), s.date && (f.datePublished = s.date), s.dateModified && (f.dateModified = s.dateModified);
    const h = "nimbi-jsonld";
    let p = document.getElementById(h);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = h, document.head.appendChild(p)), p.textContent = JSON.stringify(f, null, 2);
  } catch (s) {
    k("[seoManager] setStructuredData failed", s);
  }
}
let fn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function Ws(e) {
  try {
    if (!e || typeof e != "object") {
      fn = {};
      return;
    }
    fn = Object.assign({}, e);
  } catch (t) {
    k("[seoManager] setSeoMap failed", t);
  }
}
function Zs(e, t = "") {
  try {
    if (!e) return;
    const n = fn && fn[e] ? fn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ha("canonical", i);
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
        Dr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Fr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      k("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    k("[seoManager] injectSeoForPage failed", n);
  }
}
function Un(e = {}, t = "", n = void 0, i = void 0) {
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
      Dr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Fr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    k("[seoManager] markNotFound failed", r);
  }
}
function Gs(e, t, n, i, r, a, s, l, o, u, c) {
  try {
    if (i && i.querySelector) {
      const f = i.querySelector(".menu-label");
      f && (f.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (f) {
    k("[seoManager] update toc label failed", f);
  }
  try {
    const f = n.meta && n.meta.title ? String(n.meta.title).trim() : "", h = r.querySelector("img"), p = h && (h.getAttribute("src") || h.src) || null;
    let g = "";
    try {
      let m = "";
      try {
        const w = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (w) {
          let b = w.nextElementSibling;
          const _ = [];
          for (; b && !(b.tagName && b.tagName.toLowerCase() === "h2"); ) {
            try {
              if (b.classList && b.classList.contains("nimbi-article-subtitle")) {
                b = b.nextElementSibling;
                continue;
              }
            } catch {
            }
            const S = (b.textContent || "").trim();
            S && _.push(S), b = b.nextElementSibling;
          }
          _.length && (m = _.join(" ").replace(/\s+/g, " ").trim()), !m && o && (m = String(o).trim());
        }
      } catch (w) {
        k("[seoManager] compute descOverride failed", w);
      }
      m && String(m).length > 160 && (m = String(m).slice(0, 157).trim() + "..."), g = m;
    } catch (m) {
      k("[seoManager] compute descOverride failed", m);
    }
    let d = "";
    try {
      f && (d = f);
    } catch {
    }
    if (!d)
      try {
        l && l.textContent && (d = String(l.textContent).trim());
      } catch {
      }
    if (!d)
      try {
        const m = r.querySelector("h2");
        m && m.textContent && (d = String(m.textContent).trim());
      } catch {
      }
    d || (d = a || "");
    try {
      Dr(n, d || void 0, p, g);
    } catch (m) {
      k("[seoManager] setMetaTags failed", m);
    }
    try {
      Fr(n, u, d || void 0, p, g, t);
    } catch (m) {
      k("[seoManager] setStructuredData failed", m);
    }
    const y = Us();
    d ? y ? document.title = `${y} - ${d}` : document.title = `${t || "Site"} - ${d}` : f ? document.title = f : document.title = t || document.title;
  } catch (f) {
    k("[seoManager] applyPageMeta failed", f);
  }
  try {
    try {
      const f = r.querySelectorAll(".nimbi-reading-time");
      f && f.forEach((h) => h.remove());
    } catch {
    }
    if (o) {
      const f = Ds(c.raw || ""), h = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, p = h ? e("readingTime", { minutes: h }) : "";
      if (!p) return;
      const g = r.querySelector("h1");
      if (g) {
        const d = r.querySelector(".nimbi-article-subtitle");
        try {
          if (d) {
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = p, d.appendChild(y);
          } else {
            const y = document.createElement("p");
            y.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = p, y.appendChild(m);
            try {
              g.parentElement.insertBefore(y, g.nextSibling);
            } catch {
              try {
                g.insertAdjacentElement("afterend", y);
              } catch {
              }
            }
          }
        } catch {
          try {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = p, m.appendChild(w), g.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch (f) {
    k("[seoManager] reading time update failed", f);
  }
}
let da = 100;
function Si(e) {
  da = e;
}
function lt() {
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
function vi(e) {
  pn = e;
}
const pt = /* @__PURE__ */ new Map();
function Xs(e) {
  if (!pt.has(e)) return;
  const t = pt.get(e), n = Date.now();
  if (t.ts + pn < n) {
    pt.delete(e);
    return;
  }
  return pt.delete(e), pt.set(e, t), t.value;
}
function Qs(e, t) {
  if (Ai(), Ai(), pt.delete(e), pt.set(e, { value: t, ts: Date.now() }), pt.size > da) {
    const n = pt.keys().next().value;
    n !== void 0 && pt.delete(n);
  }
}
function Ai() {
  if (!pn || pn <= 0) return;
  const e = Date.now();
  for (const [t, n] of pt.entries())
    n.ts + pn < e && pt.delete(t);
}
async function Ks(e, t) {
  const n = new Set(rt), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const f = it(a);
          if (f) {
            if (f.type === "canonical" && f.page) {
              const h = ee(f.page);
              if (h) {
                n.add(h);
                continue;
              }
            }
            if (f.type === "cosmetic" && f.page) {
              const h = f.page;
              if (te.has(h)) {
                const p = te.get(h);
                if (p) return p;
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
          let f = ee(l[1]);
          f && n.add(f);
          continue;
        }
        const o = (r.textContent || "").trim(), u = (s.pathname || "").replace(/^.*\//, "");
        if (o && ue(o) === e || u && ue(u.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let f = s.pathname.replace(/^\//, "");
          n.add(f);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const f = new URL(t), h = Ut(f.pathname);
          if (c.indexOf(h) !== -1) {
            let p = c.startsWith(h) ? c.slice(h.length) : c;
            p = ee(p), p && n.add(p);
          }
        }
      } catch (s) {
        k("[router] malformed URL while discovering index candidates", s);
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
        if (l && ue(l) === e)
          return r;
      }
    } catch (a) {
      k("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function Vs(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (te.has(n)) {
        const i = Jt(n) || te.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (rt && rt.size)
          for (const i of rt) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ue(r) === n && !/index\.html$/i.test(i)) {
              t.push(i);
              break;
            }
          }
        !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
      }
    } catch (n) {
      k("[router] buildPageCandidates failed during slug handling", n);
    }
  return t;
}
async function Ys(e, t) {
  const n = e || "";
  try {
    try {
      Di("fetchPageData");
    } catch {
    }
    try {
      Fi("fetchPageData");
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
  const o = `${e}|||${typeof ms < "u" && It ? It : ""}`, u = Xs(o);
  if (u)
    r = u.resolved, a = u.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let m = decodeURIComponent(String(r || ""));
      if (m && typeof m == "string" && (m = ee(m), m = Yt(m)), te.has(m))
        r = Jt(m) || te.get(m);
      else {
        let w = await Ks(m, t);
        if (w)
          r = w;
        else if (Dt._refreshed && rt && rt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await ua(m, t);
          b && (r = b);
        }
      }
    }
    Qs(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || te.has(r) || rt && rt.size || Dt._refreshed || s || m;
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
          const b = await w.text(), _ = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", S = (b || "").toLowerCase();
          if (_ && _.indexOf && _.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let X = m;
                try {
                  X = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  X = String(m || "").replace(/^\//, "");
                }
                const P = X.replace(/\.html$/i, ".md");
                try {
                  const ie = await Te(P, t);
                  if (ie && ie.raw)
                    return { data: ie, pagePath: P, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ie = await Te(oe, t);
                    if (ie && ie.raw) {
                      try {
                        Un(ie.meta || {}, oe);
                      } catch {
                      }
                      return { data: ie, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  y = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let X = m;
                try {
                  X = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  X = String(m || "").replace(/^\//, "");
                }
                const P = X.replace(/\.html$/i, ".md");
                try {
                  const ie = await Te(P, t);
                  if (ie && ie.raw)
                    return { data: ie, pagePath: P, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ie = await Te(oe, t);
                    if (ie && ie.raw) {
                      try {
                        Un(ie.meta || {}, oe);
                      } catch {
                      }
                      return { data: ie, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  y = new Error("site shell detected (absolute fetch)");
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
  const f = Vs(r);
  try {
    if (lt())
      try {
        zt("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: f });
      } catch {
      }
  } catch {
  }
  const h = String(n || "").includes(".md") || String(n || "").includes(".html");
  let p = null;
  if (!h)
    try {
      let m = decodeURIComponent(String(n || ""));
      m = ee(m), m = Yt(m), m && !/\.(md|html?)$/i.test(m) && (p = m);
    } catch {
      p = null;
    }
  if (h && f.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && f.push(r), f.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && f.push(r), f.length === 1 && /index\.html$/i.test(f[0]) && !h && !te.has(r) && !te.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let g = null, d = null, y = null;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || te.has(r) || rt && rt.size || Dt._refreshed || h || m;
  } catch {
    c = !0;
  }
  if (!c)
    y = new Error("no page data");
  else
    for (const m of f)
      if (m)
        try {
          const w = ee(m);
          if (g = await Te(w, t), d = w, p && !te.has(p))
            try {
              let b = "";
              if (g && g.isHtml)
                try {
                  const _ = He();
                  if (_) {
                    const S = _.parseFromString(g.raw || "", "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (b = v.textContent.trim());
                  }
                } catch {
                }
              else {
                const _ = (g && g.raw || "").match(/^#\s+(.+)$/m);
                _ && _[1] && (b = _[1].trim());
              }
              if (b && ue(b) !== p)
                try {
                  if (/\.html$/i.test(w)) {
                    const S = w.replace(/\.html$/i, ".md");
                    if (f.includes(S))
                      try {
                        const v = await Te(S, t);
                        if (v && v.raw)
                          g = v, d = S;
                        else if (typeof oe == "string" && oe)
                          try {
                            const T = await Te(oe, t);
                            if (T && T.raw)
                              g = T, d = oe;
                            else {
                              g = null, d = null, y = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            g = null, d = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          g = null, d = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const T = await Te(oe, t);
                          if (T && T.raw)
                            g = T, d = oe;
                          else {
                            g = null, d = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          g = null, d = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      g = null, d = null, y = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    g = null, d = null, y = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  g = null, d = null, y = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!h && /\.html$/i.test(w)) {
              const b = w.replace(/\.html$/i, ".md");
              if (f.includes(b))
                try {
                  const S = String(g && g.raw || "").trim().slice(0, 128).toLowerCase();
                  if (g && g.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let T = !1;
                    try {
                      const X = await Te(b, t);
                      if (X && X.raw)
                        g = X, d = b, T = !0;
                      else if (typeof oe == "string" && oe)
                        try {
                          const P = await Te(oe, t);
                          P && P.raw && (g = P, d = oe, T = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const P = await Te(oe, t);
                        P && P.raw && (g = P, d = oe, T = !0);
                      } catch {
                      }
                    }
                    if (!T) {
                      g = null, d = null, y = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (lt())
              try {
                zt("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: d, isHtml: g && g.isHtml, snippet: g && g.raw ? String(g.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          y = w;
          try {
            lt() && k("[router] candidate fetch failed", { candidate: m, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!g) {
    const m = y && (y.message || String(y)) || null, w = m && /failed to fetch md|site shell detected/i.test(m);
    try {
      if (lt())
        try {
          zt("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: f, fetchError: m });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (lt())
          try {
            k("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: f, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (lt())
          try {
            Zn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: f, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    if (typeof oe == "string" && oe)
      try {
        const b = await Te(oe, t);
        if (b && b.raw) {
          try {
            Un(b.meta || {}, oe);
          } catch {
          }
          return { data: b, pagePath: oe, anchor: a };
        }
      } catch {
      }
    try {
      if (h && String(n || "").toLowerCase().includes(".html"))
        try {
          const b = new URL(String(n || ""), location.href).toString();
          lt() && k("[router] attempting absolute HTML fetch fallback", b);
          const _ = await fetch(b);
          if (_ && _.ok) {
            const S = await _.text(), v = _ && _.headers && typeof _.headers.get == "function" && _.headers.get("content-type") || "", T = (S || "").toLowerCase(), X = v && v.indexOf && v.indexOf("text/html") !== -1 || T.indexOf("<!doctype") !== -1 || T.indexOf("<html") !== -1;
            if (!X && lt())
              try {
                k("[router] absolute fetch returned non-HTML", () => ({ abs: b, contentType: v, snippet: T.slice(0, 200) }));
              } catch {
              }
            if (X) {
              const P = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || P.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  lt() && k("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
                } catch {
                }
              else
                try {
                  const z = b, q = new URL(".", z).toString();
                  try {
                    const F = He();
                    if (F) {
                      const H = F.parseFromString(S || "", "text/html"), A = (V, de) => {
                        try {
                          const ke = de.getAttribute(V) || "";
                          if (!ke || /^(https?:)?\/\//i.test(ke) || ke.startsWith("/") || ke.startsWith("#")) return;
                          try {
                            const ve = new URL(ke, z).toString();
                            de.setAttribute(V, ve);
                          } catch (ve) {
                            k("[router] rewrite attribute failed", V, ve);
                          }
                        } catch (ke) {
                          k("[router] rewrite helper failed", ke);
                        }
                      }, Q = H.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), K = [];
                      for (const V of Array.from(Q || []))
                        try {
                          const de = V.tagName ? V.tagName.toLowerCase() : "";
                          if (de === "a") continue;
                          if (V.hasAttribute("src")) {
                            const ke = V.getAttribute("src");
                            A("src", V);
                            const ve = V.getAttribute("src");
                            ke !== ve && K.push({ attr: "src", tag: de, before: ke, after: ve });
                          }
                          if (V.hasAttribute("href") && de === "link") {
                            const ke = V.getAttribute("href");
                            A("href", V);
                            const ve = V.getAttribute("href");
                            ke !== ve && K.push({ attr: "href", tag: de, before: ke, after: ve });
                          }
                          if (V.hasAttribute("href") && de !== "link") {
                            const ke = V.getAttribute("href");
                            A("href", V);
                            const ve = V.getAttribute("href");
                            ke !== ve && K.push({ attr: "href", tag: de, before: ke, after: ve });
                          }
                          if (V.hasAttribute("xlink:href")) {
                            const ke = V.getAttribute("xlink:href");
                            A("xlink:href", V);
                            const ve = V.getAttribute("xlink:href");
                            ke !== ve && K.push({ attr: "xlink:href", tag: de, before: ke, after: ve });
                          }
                          if (V.hasAttribute("poster")) {
                            const ke = V.getAttribute("poster");
                            A("poster", V);
                            const ve = V.getAttribute("poster");
                            ke !== ve && K.push({ attr: "poster", tag: de, before: ke, after: ve });
                          }
                          if (V.hasAttribute("srcset")) {
                            const je = (V.getAttribute("srcset") || "").split(",").map((_e) => _e.trim()).filter(Boolean).map((_e) => {
                              const [Fe, L] = _e.split(/\s+/, 2);
                              if (!Fe || /^(https?:)?\/\//i.test(Fe) || Fe.startsWith("/")) return _e;
                              try {
                                const O = new URL(Fe, z).toString();
                                return L ? `${O} ${L}` : O;
                              } catch {
                                return _e;
                              }
                            }).join(", ");
                            V.setAttribute("srcset", je);
                          }
                        } catch {
                        }
                      const xe = H.documentElement && H.documentElement.outerHTML ? H.documentElement.outerHTML : S;
                      try {
                        lt() && K && K.length && k("[router] rewritten asset refs", { abs: b, rewritten: K });
                      } catch {
                      }
                      return { data: { raw: xe, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let G = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? G = S.replace(/(<head[^>]*>)/i, `$1<base href="${q}">`) : G = `<base href="${q}">` + S), { data: { raw: G, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (b) {
          lt() && k("[router] absolute HTML fetch fallback failed", b);
        }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(r || ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof oe == "string" && oe && lt()) {
        const S = [
          `/assets/${b}.html`,
          `/assets/${b}/index.html`
        ];
        for (const v of S)
          try {
            const T = await fetch(v, { method: "GET" });
            if (T && T.ok)
              return { data: { raw: await T.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (b) {
      lt() && k("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return { data: g, pagePath: d, anchor: a };
}
function rr() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Nt = rr();
function fa(e) {
  Nt = e;
}
var qt = { exec: () => null };
function Re(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(st.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Js = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), st = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, eo = /^(?:[ \t]*(?:\n|$))+/, to = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, no = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Tn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ro = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ur = / {0,3}(?:[*+-]|\d{1,9}[.)])/, pa = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ga = Re(pa).replace(/bull/g, Ur).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), io = Re(pa).replace(/bull/g, Ur).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Wr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ao = /^[^\n]+/, Zr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, so = Re(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Zr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), oo = Re(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ur).getRegex(), ir = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Gr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, lo = Re("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Gr).replace("tag", ir).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ma = Re(Wr).replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ir).getRegex(), co = Re(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ma).getRegex(), Xr = { blockquote: co, code: to, def: so, fences: no, heading: ro, hr: Tn, html: lo, lheading: ga, list: oo, newline: eo, paragraph: ma, table: qt, text: ao }, Ei = Re("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ir).getRegex(), uo = { ...Xr, lheading: io, table: Ei, paragraph: Re(Wr).replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ei).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ir).getRegex() }, ho = { ...Xr, html: Re(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Gr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: qt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Re(Wr).replace("hr", Tn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ga).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, fo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, po = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ya = /^( {2,}|\\)\n(?!\s*$)/, go = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ar = /[\p{P}\p{S}]/u, Qr = /[\s\p{P}\p{S}]/u, ba = /[^\s\p{P}\p{S}]/u, mo = Re(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Qr).getRegex(), wa = /(?!~)[\p{P}\p{S}]/u, yo = /(?!~)[\s\p{P}\p{S}]/u, bo = /(?:[^\s\p{P}\p{S}]|~)/u, _a = /(?![*_])[\p{P}\p{S}]/u, wo = /(?![*_])[\s\p{P}\p{S}]/u, _o = /(?:[^\s\p{P}\p{S}]|[*_])/u, ko = Re(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Js ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ka = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, xo = Re(ka, "u").replace(/punct/g, ar).getRegex(), So = Re(ka, "u").replace(/punct/g, wa).getRegex(), xa = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", vo = Re(xa, "gu").replace(/notPunctSpace/g, ba).replace(/punctSpace/g, Qr).replace(/punct/g, ar).getRegex(), Ao = Re(xa, "gu").replace(/notPunctSpace/g, bo).replace(/punctSpace/g, yo).replace(/punct/g, wa).getRegex(), Eo = Re("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ba).replace(/punctSpace/g, Qr).replace(/punct/g, ar).getRegex(), Co = Re(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, _a).getRegex(), Mo = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Lo = Re(Mo, "gu").replace(/notPunctSpace/g, _o).replace(/punctSpace/g, wo).replace(/punct/g, _a).getRegex(), To = Re(/\\(punct)/, "gu").replace(/punct/g, ar).getRegex(), Ro = Re(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Po = Re(Gr).replace("(?:-->|$)", "-->").getRegex(), $o = Re("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Po).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Vn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, zo = Re(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Vn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Sa = Re(/^!?\[(label)\]\[(ref)\]/).replace("label", Vn).replace("ref", Zr).getRegex(), va = Re(/^!?\[(ref)\](?:\[\])?/).replace("ref", Zr).getRegex(), Io = Re("reflink|nolink(?!\\()", "g").replace("reflink", Sa).replace("nolink", va).getRegex(), Ci = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Kr = { _backpedal: qt, anyPunctuation: To, autolink: Ro, blockSkip: ko, br: ya, code: po, del: qt, delLDelim: qt, delRDelim: qt, emStrongLDelim: xo, emStrongRDelimAst: vo, emStrongRDelimUnd: Eo, escape: fo, link: zo, nolink: va, punctuation: mo, reflink: Sa, reflinkSearch: Io, tag: $o, text: go, url: qt }, No = { ...Kr, link: Re(/^!?\[(label)\]\((.*?)\)/).replace("label", Vn).getRegex(), reflink: Re(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vn).getRegex() }, Mr = { ...Kr, emStrongRDelimAst: Ao, emStrongLDelim: So, delLDelim: Co, delRDelim: Lo, url: Re(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Ci).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Re(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Ci).getRegex() }, Oo = { ...Mr, br: Re(ya).replace("{2,}", "*").getRegex(), text: Re(Mr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, qn = { normal: Xr, gfm: uo, pedantic: ho }, an = { normal: Kr, gfm: Mr, breaks: Oo, pedantic: No }, Bo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Mi = (e) => Bo[e];
function _t(e, t) {
  if (t) {
    if (st.escapeTest.test(e)) return e.replace(st.escapeReplace, Mi);
  } else if (st.escapeTestNoEncode.test(e)) return e.replace(st.escapeReplaceNoEncode, Mi);
  return e;
}
function Li(e) {
  try {
    e = encodeURI(e).replace(st.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ti(e, t) {
  let n = e.replace(st.findPipe, (a, s, l) => {
    let o = !1, u = s;
    for (; --u >= 0 && l[u] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(st.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(st.slashPipe, "|");
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
function qo(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function jo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Ri(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function Ho(e, t, n) {
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
    this.options = e || Nt;
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
      let n = t[0], i = Ho(n, t[3] || "", this.rules);
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
        let f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = f, n.length === 0) break;
        let h = a.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let p = h, g = p.raw + `
` + n.join(`
`), d = this.blockquote(g);
          a[a.length - 1] = d, i = i.substring(0, i.length - p.raw.length) + d.raw, r = r.substring(0, r.length - p.text.length) + d.text;
          break;
        } else if (h?.type === "list") {
          let p = h, g = p.raw + `
` + n.join(`
`), d = this.list(g);
          a[a.length - 1] = d, i = i.substring(0, i.length - h.raw.length) + d.raw, r = r.substring(0, r.length - p.raw.length) + d.raw, n = g.substring(a.at(-1).raw.length).split(`
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
        let f = jo(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], p = !f.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = f.trimStart()) : p ? g = t[1].length + 1 : (g = f.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = f.slice(g), g += t[1].length), p && this.rules.other.blankLine.test(h) && (u += h + `
`, e = e.substring(h.length + 1), o = !0), !o) {
          let d = this.rules.other.nextBulletRegex(g), y = this.rules.other.hrRegex(g), m = this.rules.other.fencesBeginRegex(g), w = this.rules.other.headingBeginRegex(g), b = this.rules.other.htmlBeginRegex(g), _ = this.rules.other.blockquoteBeginRegex(g);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (h = S, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), v = h) : v = h.replace(this.rules.other.tabCharGlobal, "    "), m.test(h) || w.test(h) || b.test(h) || _.test(h) || d.test(h) || y.test(h)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= g || !h.trim()) c += `
` + v.slice(g);
            else {
              if (p || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || m.test(f) || w.test(f) || y.test(f)) break;
              c += `
` + h;
            }
            p = !h.trim(), u += S + `
`, e = e.substring(S.length + 1), f = v.slice(g);
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
          let u = o.tokens.filter((f) => f.type === "space"), c = u.length > 0 && u.some((f) => this.rules.other.anyLine.test(f.raw));
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
    let n = Ti(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Ti(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = qo(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Ri(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Ri(n, r, n[0], this.lexer, this.rules);
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
        let c = [...i[0]][0].length, f = e.slice(0, r + i.index + c + s);
        if (Math.min(r, s) % 2) {
          let p = f.slice(1, -1);
          return { type: "em", raw: f, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let h = f.slice(2, -2);
        return { type: "strong", raw: f, text: h, tokens: this.lexer.inlineTokens(h) };
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
        let u = [...i[0]][0].length, c = e.slice(0, r + i.index + u + s), f = c.slice(r, -r);
        return { type: "del", raw: c, text: f, tokens: this.lexer.inlineTokens(f) };
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
}, dt = class Lr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Nt, this.options.tokenizer = this.options.tokenizer || new An(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: st, block: qn.normal, inline: an.normal };
    this.options.pedantic ? (n.block = qn.pedantic, n.inline = an.pedantic) : this.options.gfm && (n.block = qn.gfm, this.options.breaks ? n.inline = an.breaks : n.inline = an.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: qn, inline: an };
  }
  static lex(t, n) {
    return new Lr(n).lex(t);
  }
  static lexInline(t, n) {
    return new Lr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(st.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(st.tabCharGlobal, "    ").replace(st.spaceLine, "")); t; ) {
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
        let c = 1 / 0, f = t.slice(1), h;
        this.options.extensions.startInline.forEach((p) => {
          h = p.call({ lexer: this }, f), typeof h == "number" && h >= 0 && (c = Math.min(c, h));
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
    this.options = e || Nt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(st.notSpaceStart)?.[0], r = e.replace(st.endingNewline, "") + `
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
    let i = this.parser.parseInline(n), r = Li(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + _t(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Li(e);
    if (r === null) return _t(n);
    e = r;
    let a = `<img src="${e}" alt="${_t(n)}"`;
    return t && (a += ` title="${_t(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : _t(e.text);
  }
}, sr = class {
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
}, ft = class Tr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || Nt, this.options.renderer = this.options.renderer || new En(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new sr();
  }
  static parse(t, n) {
    return new Tr(n).parse(t);
  }
  static parseInline(t, n) {
    return new Tr(n).parseInline(t);
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
    this.options = e || Nt;
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
}, Aa = class {
  defaults = rr();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ft;
  Renderer = En;
  TextRenderer = sr;
  Lexer = dt;
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
              let f = await l.call(r, u);
              return o.call(r, f);
            })();
            let c = l.call(r, u);
            return o.call(r, c);
          } : r[s] = (...u) => {
            if (this.defaults.async) return (async () => {
              let f = await l.apply(r, u);
              return f === !1 && (f = await o.apply(r, u)), f;
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
        let u = await (r.hooks ? await r.hooks.provideParser() : e ? ft.parse : ft.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
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
}, Wt = new Aa();
function Ae(e, t) {
  return Wt.parse(e, t);
}
Ae.options = Ae.setOptions = function(e) {
  return Wt.setOptions(e), Ae.defaults = Wt.defaults, fa(Ae.defaults), Ae;
};
Ae.getDefaults = rr;
Ae.defaults = Nt;
Ae.use = function(...e) {
  return Wt.use(...e), Ae.defaults = Wt.defaults, fa(Ae.defaults), Ae;
};
Ae.walkTokens = function(e, t) {
  return Wt.walkTokens(e, t);
};
Ae.parseInline = Wt.parseInline;
Ae.Parser = ft;
Ae.parser = ft.parse;
Ae.Renderer = En;
Ae.TextRenderer = sr;
Ae.Lexer = dt;
Ae.lexer = dt.lex;
Ae.Tokenizer = An;
Ae.Hooks = Kt;
Ae.parse = Ae;
var Do = Ae.options, Fo = Ae.setOptions, Uo = Ae.use, Wo = Ae.walkTokens, Zo = Ae.parseInline, Go = Ae, Xo = ft.parse, Qo = dt.lex;
const Pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Kt,
  Lexer: dt,
  Marked: Aa,
  Parser: ft,
  Renderer: En,
  TextRenderer: sr,
  Tokenizer: An,
  get defaults() {
    return Nt;
  },
  getDefaults: rr,
  lexer: Qo,
  marked: Ae,
  options: Do,
  parse: Go,
  parseInline: Zo,
  parser: Xo,
  setOptions: Fo,
  use: Uo,
  walkTokens: Wo
}, Symbol.toStringTag, { value: "Module" })), Ea = `function H() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = H();
function pe(s) {
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
var Ae = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, _e = /^(?:[ \\t]*(?:\\n|$))+/, Pe = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Le = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, M = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ie = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, X = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, ue = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, ge = k(ue).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), ve = k(ue).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), U = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Ce = /^[^\\n]+/, K = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Ee = k(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", K).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Be = k(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, X).getRegex(), O = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", J = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, qe = k("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", J).replace("tag", O).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ke = k(U).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", O).getRegex(), Me = k(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ke).getRegex(), V = { blockquote: Me, code: Pe, def: Ee, fences: Le, heading: Ie, hr: M, html: qe, lheading: ge, list: Be, newline: _e, paragraph: ke, table: T, text: Ce }, re = k("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", O).getRegex(), Ze = { ...V, lheading: ve, table: re, paragraph: k(U).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", O).getRegex() }, je = { ...V, html: k(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", J).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: T, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: k(U).replace("hr", M).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", ge).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, De = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, He = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, fe = /^( {2,}|\\\\)\\n(?!\\s*$)/, Oe = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, N = /[\\p{P}\\p{S}]/u, Y = /[\\s\\p{P}\\p{S}]/u, de = /[^\\s\\p{P}\\p{S}]/u, Ne = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Y).getRegex(), xe = /(?!~)[\\p{P}\\p{S}]/u, Qe = /(?!~)[\\s\\p{P}\\p{S}]/u, Ge = /(?:[^\\s\\p{P}\\p{S}]|~)/u, be = /(?![*_])[\\p{P}\\p{S}]/u, Fe = /(?![*_])[\\s\\p{P}\\p{S}]/u, We = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Xe = k(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Ae ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), me = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Ue = k(me, "u").replace(/punct/g, N).getRegex(), Ke = k(me, "u").replace(/punct/g, xe).getRegex(), we = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Je = k(we, "gu").replace(/notPunctSpace/g, de).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), Ve = k(we, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, Qe).replace(/punct/g, xe).getRegex(), Ye = k("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, de).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), et = k(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, be).getRegex(), tt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", rt = k(tt, "gu").replace(/notPunctSpace/g, We).replace(/punctSpace/g, Fe).replace(/punct/g, be).getRegex(), st = k(/\\\\(punct)/, "gu").replace(/punct/g, N).getRegex(), nt = k(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), lt = k(J).replace("(?:-->|$)", "-->").getRegex(), it = k("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", lt).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), D = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, at = k(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", D).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), ye = k(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", D).replace("ref", K).getRegex(), Se = k(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", K).getRegex(), ot = k("reflink|nolink(?!\\\\()", "g").replace("reflink", ye).replace("nolink", Se).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ee = { _backpedal: T, anyPunctuation: st, autolink: nt, blockSkip: Xe, br: fe, code: He, del: T, delLDelim: T, delRDelim: T, emStrongLDelim: Ue, emStrongRDelimAst: Je, emStrongRDelimUnd: Ye, escape: De, link: at, nolink: Se, punctuation: Ne, reflink: ye, reflinkSearch: ot, tag: it, text: Oe, url: T }, ct = { ...ee, link: k(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", D).getRegex(), reflink: k(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", D).getRegex() }, G = { ...ee, emStrongRDelimAst: Ve, emStrongLDelim: Ke, delLDelim: et, delRDelim: rt, url: k(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: k(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", se).getRegex() }, ht = { ...G, br: k(fe).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, Z = { normal: V, gfm: Ze, pedantic: je }, C = { normal: ee, gfm: G, breaks: ht, pedantic: ct }, pt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ne = (s) => pt[s];
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
  let r = s.replace(m.findPipe, (i, l, o) => {
    let a = !1, h = l;
    for (; --h >= 0 && o[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function E(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function ut(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function gt(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let i = 4 - r % 4;
    n += " ".repeat(i), r += i;
  } else n += t, r++;
  return n;
}
function ae(s, e, r, n, t) {
  let i = e.href, l = e.title || null, o = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: l, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = !1, a;
}
function kt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((i) => {
    let l = i.match(r.other.beginningSpace);
    if (l === null) return i;
    let [o] = l;
    return o.length >= t.length ? i.slice(t.length) : i;
  }).join(\`
\`);
}
var B = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : E(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = kt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = E(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: E(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = E(e[0], \`
\`).split(\`
\`), n = "", t = "", i = [];
      for (; r.length > 0; ) {
        let l = !1, o = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) o.push(r[a]), l = !0;
        else if (!l) o.push(r[a]);
        else break;
        r = r.slice(a);
        let h = o.join(\`
\`), c = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${c}\` : c;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = p, r.length === 0) break;
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
        let a = !1, h = "", c = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = gt(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), I = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), te = this.rules.other.htmlBeginRegex(g), v = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let P = s.split(\`
\`, 1)[0], z;
            if (u = P, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), z = u) : z = u.replace(this.rules.other.tabCharGlobal, "    "), I.test(u) || R.test(u) || te.test(u) || v.test(u) || x.test(u) || _.test(u)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) c += \`
\` + z.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || I.test(p) || R.test(p) || _.test(p)) break;
              c += \`
\` + u;
            }
            d = !u.trim(), h += P + \`
\`, s = s.substring(P.length + 1), p = z.slice(g);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (l = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), t.raw += h;
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
    let r = ie(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let l of n) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < r.length; l++) i.header.push({ text: r[l], tokens: this.lexer.inline(r[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(ie(l, i.header.length).map((o, a) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: i.align[a] })));
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
        let i = E(r.slice(0, -1), "\\\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = ut(e[2], "()");
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
      let t = [...n[0]].length - 1, i, l, o = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i) continue;
        if (l = [...i].length, n[3] || n[4]) {
          o += l;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + l) % 3)) {
          a += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o + a);
        let c = [...n[0]][0].length, p = s.slice(0, t + n.index + c + l);
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
      let t = [...n[0]].length - 1, i, l, o = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i || (l = [...i].length, l !== t)) continue;
        if (n[3] || n[4]) {
          o += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o);
        let h = [...n[0]][0].length, c = s.slice(0, t + n.index + h + l), p = c.slice(t, -t);
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
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new B(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: Z.normal, inline: C.normal };
    this.options.pedantic ? (r.block = Z.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = Z.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Z, inline: C };
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
        let l = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (l = Math.min(l, a));
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
    let l = !1, o = "";
    for (; e; ) {
      l || (o = ""), l = !1;
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
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), l = !0;
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
      let o = s.items[l];
      n += this.listitem(o);
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
}, y = class W {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new q(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new W(r).parse(e);
  }
  static parseInline(e, r) {
    return new W(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let l = t, o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          r += o || "";
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
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
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
          let o = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, L = class {
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
}, $e = class {
  defaults = H();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = q;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = B;
  Hooks = L;
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
            let o = t.renderer.apply(this, l);
            return o === !1 && (o = i.apply(this, l)), o;
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
          let l = i, o = r.renderer[l], a = t[l];
          t[l] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new B(this.defaults);
        for (let i in r.tokenizer) {
          if (!(i in t)) throw new Error(\`tokenizer '\${i}' does not exist\`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, o = r.tokenizer[l], a = t[l];
          t[l] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new L();
        for (let i in r.hooks) {
          if (!(i in t)) throw new Error(\`hook '\${i}' does not exist\`);
          if (["options", "block"].includes(i)) continue;
          let l = i, o = r.hooks[l], a = t[l];
          L.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && L.passThroughHooksRespectAsync.has(i)) return (async () => {
              let p = await o.call(t, h);
              return a.call(t, p);
            })();
            let c = o.call(t, h);
            return a.call(t, c);
          } : t[l] = (...h) => {
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
        let t = this.defaults.walkTokens, i = r.walkTokens;
        n.walkTokens = function(l) {
          let o = [];
          return o.push(i.call(this, l)), t && (o = o.concat(t.call(this, l))), o;
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
        let l = t.hooks ? await t.hooks.preprocess(e) : e, o = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(l, t), a = t.hooks ? await t.hooks.processAllTokens(o) : o;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let o = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(l, t);
        return t.hooks && (o = t.hooks.postprocess(o)), o;
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
}, A = new $e();
function f(s, e) {
  return A.parse(s, e);
}
f.options = f.setOptions = function(s) {
  return A.setOptions(s), f.defaults = A.defaults, pe(f.defaults), f;
};
f.getDefaults = H;
f.defaults = $;
f.use = function(...s) {
  return A.use(...s), f.defaults = A.defaults, pe(f.defaults), f;
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
f.Tokenizer = B;
f.Hooks = L;
f.parse = f;
var ft = f.options, dt = f.setOptions, xt = f.use, bt = f.walkTokens, mt = f.parseInline, wt = f, yt = y.parse, St = w.lex, oe = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: L,
  Lexer: w,
  Marked: $e,
  Parser: y,
  Renderer: q,
  TextRenderer: Q,
  Tokenizer: B,
  get defaults() {
    return $;
  },
  getDefaults: H,
  lexer: St,
  marked: f,
  options: ft,
  parse: wt,
  parseInline: mt,
  parser: yt,
  setOptions: dt,
  use: xt,
  walkTokens: bt
});
function $t(s) {
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
function Rt(s) {
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
const j = oe && (f || oe) || void 0, ce = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, zt = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function Tt(s) {
  try {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
  } catch {
    return "heading";
  }
}
let b = null;
const At = "https://cdn.jsdelivr.net/npm/highlight.js";
async function he() {
  if (b) return b;
  try {
    try {
      const s = await import(At + "/lib/core.js");
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
      const { name: c, url: p } = e;
      try {
        if (!await he()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const d = await import(p), g = d.default || d;
        b.registerLanguage(c, g), postMessage({ type: "registered", name: c });
      } catch (u) {
        postMessage({ type: "register-error", name: c, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const c = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = new RegExp(ce.source, ce.flags);
      let g;
      for (; g = d.exec(c); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), zt.has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: i } = $t(n || "");
    await he().catch(() => {
    });
    let l = j.parse(t);
    const o = [], a = /* @__PURE__ */ new Map(), h = Tt;
    l = l.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (c, p, u, d) => {
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = Rt(x);
      } catch {
      }
      let _ = null;
      const I = (u || "").match(/\\sid="([^"]+)"/);
      I && (_ = I[1]);
      const R = _ || h(x) || "heading", v = (a.get(R) || 0) + 1;
      a.set(R, v);
      const P = v === 1 ? R : R + "-" + v;
      o.push({ level: g, text: x, id: P });
      const z = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, Re = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", ze = (z[g] + " " + Re).trim(), Te = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${P}" class="\${ze}"\`).trim();
      return \`<h\${g} \${Te}>\${d}</h\${g}>\`;
    }), l = l.replace(/<img([^>]*)>/g, (c, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: l, meta: i || {}, toc: o } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`, $i = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Ea], { type: "text/javascript;charset=utf-8" });
function Ko(e) {
  let t;
  try {
    if (t = $i && (self.URL || self.webkitURL).createObjectURL($i), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Ea),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Yn(e) {
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
function Ca(e) {
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
const gn = Pi && (Ae || Pi) || void 0, Jn = /```\s*([a-zA-Z0-9_\-+]+)?/g, Ma = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function La(e) {
  try {
    return String(e || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
  } catch {
    return "heading";
  }
}
let nt = null;
const Vo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function er() {
  if (nt) return nt;
  try {
    try {
      const e = await import(Vo + "/lib/core.js");
      nt = e.default || e;
    } catch {
      nt = null;
    }
  } catch {
    nt = null;
  }
  return nt;
}
gn && typeof gn.setOptions == "function" && gn.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return nt && t && typeof nt.getLanguage == "function" && nt.getLanguage(t) ? nt.highlight(e, { language: t }).value : nt && typeof nt.getLanguage == "function" && nt.getLanguage("plaintext") ? nt.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: c, url: f } = t;
      try {
        if (!await er()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const p = await import(f), g = p.default || p;
        nt.registerLanguage(c, g), postMessage({ type: "registered", name: c });
      } catch (h) {
        postMessage({ type: "register-error", name: c, error: String(h) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", f = t.supported || [], h = /* @__PURE__ */ new Set(), p = new RegExp(Jn.source, Jn.flags);
      let g;
      for (; g = p.exec(c); )
        if (g[1]) {
          const d = String(g[1]).toLowerCase();
          if (!d) continue;
          if (d.length >= 5 && d.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(d) && h.add(d), Ma.has(d) && h.add(d), f && f.length)
            try {
              f.indexOf(d) !== -1 && h.add(d);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(h) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Yn(i || "");
    await er().catch(() => {
    });
    let s = gn.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), u = La;
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, f, h, p) => {
      const g = Number(f);
      let d = p.replace(/<[^>]+>/g, "").trim();
      try {
        d = Ca(d);
      } catch {
      }
      let y = null;
      const m = (h || "").match(/\sid="([^"]+)"/);
      m && (y = m[1]);
      const w = y || u(d) || "heading", _ = (o.get(w) || 0) + 1;
      o.set(w, _);
      const S = _ === 1 ? w : w + "-" + _;
      l.push({ level: g, text: d, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, T = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", X = (v[g] + " " + T).trim(), ie = ((h || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${X}"`).trim();
      return `<h${g} ${ie}>${p}</h${g}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, f) => /\bloading=/.test(f) ? `<img${f}>` : /\bdata-want-lazy=/.test(f) ? `<img${f}>` : `<img${f} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Yo(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: u } = e;
      try {
        if (!await er()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const f = await import(u), h = f.default || f;
        return nt.registerLanguage(o, h), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", u = e.supported || [], c = /* @__PURE__ */ new Set(), f = new RegExp(Jn.source, Jn.flags);
      let h;
      for (; h = f.exec(o); )
        if (h[1]) {
          const p = String(h[1]).toLowerCase();
          if (!p) continue;
          if (p.length >= 5 && p.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(p) && c.add(p), Ma.has(p) && c.add(p), u && u.length)
            try {
              u.indexOf(p) !== -1 && c.add(p);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Yn(e && e.md || "");
    await er().catch(() => {
    });
    let r = gn.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = La;
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, u, c, f) => {
      const h = Number(u);
      let p = f.replace(/<[^>]+>/g, "").trim();
      try {
        p = Ca(p);
      } catch {
      }
      let g = null;
      const d = (c || "").match(/\sid="([^"]+)"/);
      d && (g = d[1]);
      const y = g || l(p) || "heading", w = (s.get(y) || 0) + 1;
      s.set(y, w);
      const b = w === 1 ? y : y + "-" + w;
      a.push({ level: h, text: p, id: b });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (_[h] + " " + S).trim(), X = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${v}"`).trim();
      return `<h${h} ${X}>${f}</h${h}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const br = {
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
}, Jo = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function el() {
  if (typeof Worker < "u")
    try {
      return new Ko();
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
          const r = { data: await Yo(n) }(e.message || []).forEach((a) => a(r));
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
const Ta = Vi(() => el(), "markdown", Jo), Ht = () => Ta.get(), Vr = (e, t = 3e3) => Ta.send(e, t), St = [];
function Rr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    St.push(e);
    try {
      Ae.use(e);
    } catch (t) {
      k("[markdown] failed to apply plugin", t);
    }
  }
}
function tl(e) {
  St.length = 0, Array.isArray(e) && St.push(...e.filter((t) => t && typeof t == "object"));
  try {
    St.forEach((t) => Ae.use(t));
  } catch (t) {
    k("[markdown] failed to apply markdown extensions", t);
  }
}
async function Cn(e) {
  if (St && St.length) {
    let { content: i, data: r } = Yn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => br[l] || s);
    } catch {
    }
    Ae.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      St.forEach((s) => Ae.use(s));
    } catch (s) {
      k("[markdown] apply plugins failed", s);
    }
    const a = Ae.parse(i);
    try {
      const s = He();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), u = [], c = /* @__PURE__ */ new Set(), f = (p) => {
          try {
            return String(p || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, h = (p) => {
          const g = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, d = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (g[p] + " " + d).trim();
        };
        o.forEach((p) => {
          try {
            const g = Number(p.tagName.substring(1)), d = (p.textContent || "").trim();
            let y = f(d) || "heading", m = y, w = 2;
            for (; c.has(m); )
              m = y + "-" + w, w += 1;
            c.add(m), p.id = m, p.className = h(g), u.push({ level: g, text: d, id: m });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((p) => {
            try {
              const g = p.getAttribute && p.getAttribute("loading"), d = p.getAttribute && p.getAttribute("data-want-lazy");
              !g && !d && p.setAttribute && p.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((p) => {
            try {
              const g = p.getAttribute && p.getAttribute("class") || p.className || "", d = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (d)
                try {
                  p.setAttribute && p.setAttribute("class", d);
                } catch {
                  p.className = d;
                }
              else
                try {
                  p.removeAttribute && p.removeAttribute("class");
                } catch {
                  p.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        try {
          let p = null;
          try {
            typeof XMLSerializer < "u" ? p = new XMLSerializer().serializeToString(l.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : p = Array.from(l.body.childNodes || []).map((d) => d && typeof d.outerHTML == "string" ? d.outerHTML : d && typeof d.textContent == "string" ? d.textContent : "").join("");
          } catch {
            try {
              p = l.body.innerHTML;
            } catch {
              p = "";
            }
          }
          return { html: p, meta: r || {}, toc: u };
        } catch {
          return { html: "", meta: r || {}, toc: u };
        }
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Ra);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Ht && Ht();
    }
  else
    t = Ht && Ht();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => br[r] || i);
  } catch {
  }
  try {
    if (typeof Pe < "u" && Pe && typeof Pe.getLanguage == "function" && Pe.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Yn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (u, c) => br[c] || u);
      } catch {
      }
      Ae.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (u, c) => {
        try {
          return c && Pe.getLanguage && Pe.getLanguage(c) ? Pe.highlight(u, { language: c }).value : Pe && typeof Pe.getLanguage == "function" && Pe.getLanguage("plaintext") ? Pe.highlight(u, { language: "plaintext" }).value : u;
        } catch {
          return u;
        }
      } });
      let a = Ae.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (u, c) => {
          try {
            if (c && Pe && typeof Pe.highlight == "function")
              try {
                const f = Pe.highlight(c, { language: "plaintext" });
                return `<pre><code>${f && f.value ? f.value : f}</code></pre>`;
              } catch {
                try {
                  if (Pe && typeof Pe.highlightElement == "function") {
                    const h = { innerHTML: c };
                    return Pe.highlightElement(h), `<pre><code>${h.innerHTML}</code></pre>`;
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
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, c, f, h) => {
        const p = Number(c), g = h.replace(/<[^>]+>/g, "").trim();
        let d = o(g) || "heading", y = d, m = 2;
        for (; l.has(y); )
          y = d + "-" + m, m += 1;
        l.add(y), s.push({ level: p, text: g, id: y });
        const w = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, b = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", _ = (w[p] + " " + b).trim(), v = ((f || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${_}"`).trim();
        return `<h${p} ${v}>${h}</h${p}>`;
      }), a = a.replace(/<img([^>]*)>/g, (u, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Vr({ type: "render", md: e });
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
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, u, c, f) => {
      const h = Number(u), p = f.replace(/<[^>]+>/g, "").trim(), g = (c || "").match(/\sid="([^"]+)"/), d = g ? g[1] : a(p) || "heading", m = (i.get(d) || 0) + 1;
      i.set(d, m);
      const w = m === 1 ? d : d + "-" + m;
      r.push({ level: h, text: p, id: w });
      const b = s(h), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${b}"`).trim();
      return `<h${h} ${S}>${f}</h${h}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const u = He();
        if (u) {
          const c = u.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((h) => {
            try {
              const p = h.getAttribute("src") || "";
              (p ? new URL(p, location.href).toString() : "") === o && h.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? l = new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : l = Array.from(c.body.childNodes || []).map((p) => p && typeof p.outerHTML == "string" ? p.outerHTML : p && typeof p.textContent == "string" ? p.textContent : "").join("");
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
      if (Wi.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(ut && ut[l] && t.has(ut[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const u = t.get(l);
          u && n.add(u);
          continue;
        }
        if (ut && ut[l]) {
          const u = ut[l];
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
async function Pr(e, t) {
  if (St && St.length || typeof process < "u" && process.env && process.env.VITEST) return mn(e || "", t);
  if (Ht && Ht())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Vr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      k("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return mn(e || "", t);
}
const Ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Vr,
  addMarkdownExtension: Rr,
  detectFenceLanguages: mn,
  detectFenceLanguagesAsync: Pr,
  initRendererWorker: Ht,
  markdownPlugins: St,
  parseMarkdownToHtml: Cn,
  setMarkdownExtensions: tl
}, Symbol.toStringTag, { value: "Module" })), nl = `/**
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
        const s = He();
        if (!s)
          postMessage({ id: n, result: i });
        else {
          const l = s.parseFromString(i || "", "text/html"), o = l.body;
          await Yr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
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
async function rl(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const a = He();
        if (!a)
          return { id: t, result: n };
        const s = a.parseFromString(n || "", "text/html"), l = s.body;
        return await Yr(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function ht(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + bi(e, t);
  } catch {
    return bi(e, t);
  }
}
function il(...e) {
  try {
    k(...e);
  } catch {
  }
}
function tr(e) {
  try {
    if (Zt(3)) return !0;
  } catch {
  }
  try {
    if (typeof oe == "string" && oe) return !0;
  } catch {
  }
  try {
    if (te && te.size) return !0;
  } catch {
  }
  try {
    if ($e && $e.size) return !0;
  } catch {
  }
  return !1;
}
function xt(e, t) {
  try {
    if (typeof tt == "function")
      try {
        tt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && te && typeof te.set == "function" && !te.has(e) && te.set(e, t);
  } catch {
  }
  try {
    t && D && typeof D.set == "function" && D.set(t, e);
  } catch {
  }
  try {
    if ($e && typeof $e.has == "function") {
      if (!$e.has(t)) {
        try {
          $e.add(t);
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
function al(e, t) {
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
function sl(e, t) {
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
          u && u.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(u)) : o.setAttribute("href", ht(u));
        }
      } catch {
        o.setAttribute("href", "#" + s.path);
      }
      if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
        const u = document.createElement("ul");
        s.children.forEach((c) => {
          const f = document.createElement("li"), h = document.createElement("a");
          try {
            const p = String(c.path || "");
            try {
              h.setAttribute("href", ze(p));
            } catch {
              p && p.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(p)) : h.setAttribute("href", ht(p));
            }
          } catch {
            h.setAttribute("href", "#" + c.path);
          }
          h.textContent = c.name, f.appendChild(h), u.appendChild(f);
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
            u && u.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(u)) : o.setAttribute("href", ht(u));
          }
        } catch {
          o.setAttribute("href", "#" + s.path);
        }
        if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
          const u = document.createElement("ul");
          s.children.forEach((c) => {
            const f = document.createElement("li"), h = document.createElement("a");
            try {
              const p = String(c.path || "");
              try {
                h.setAttribute("href", ze(p));
              } catch {
                p && p.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(p)) : h.setAttribute("href", ht(p));
              }
            } catch {
              h.setAttribute("href", "#" + c.path);
            }
            h.textContent = c.name, f.appendChild(h), u.appendChild(f);
          }), l.appendChild(u);
        }
        r.appendChild(l);
      } catch (l) {
        k("[htmlBuilder] createNavTree item failed", l);
      }
    });
  }
  return n.appendChild(r), n;
}
function ol(e, t, n = "") {
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
        const u = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), f = document.createElement("a"), h = xs(o.text || ""), p = o.id || ue(h);
        f.textContent = h;
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), w = m && D && D.has && D.has(m) ? D.get(m) : m;
          w ? f.href = ze(w, p) : f.href = `#${encodeURIComponent(p)}`;
        } catch (m) {
          k("[htmlBuilder] buildTocElement href normalization failed", m), f.href = `#${encodeURIComponent(p)}`;
        }
        if (c.appendChild(f), u === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((m) => {
            Number(m) > 2 && delete l[m];
          });
          return;
        }
        let g = u - 1;
        for (; g > 2 && !l[g]; ) g--;
        g < 2 && (g = 2);
        let d = l[g];
        if (!d) {
          a.appendChild(c), l[u] = c;
          return;
        }
        let y = d.querySelector("ul");
        y || (y = document.createElement("ul"), d.appendChild(y)), y.appendChild(c), l[u] = c;
      } catch (u) {
        k("[htmlBuilder] buildTocElement item failed", u, o);
      }
    });
  } catch (l) {
    k("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Pa(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ue(n.textContent || ""));
  });
}
function ll(e, t, n) {
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
              k("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (l) {
            k("[htmlBuilder] resolve image src failed", l);
          }
      });
    }
  } catch (i) {
    k("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function zi(e, t, n) {
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
            } catch (f) {
              k("[htmlBuilder] rewrite asset attribute failed", u, c, f);
            }
          } catch (c) {
            k("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const f = (s.getAttribute("srcset") || "").split(",").map((h) => h.trim()).filter(Boolean).map((h) => {
            const [p, g] = h.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return h;
            try {
              const d = new URL(p, r).toString();
              return g ? `${d} ${g}` : d;
            } catch {
              return h;
            }
          }).join(", ");
          s.setAttribute("srcset", f);
        }
      } catch (l) {
        k("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    k("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Ii = "", wr = null, Ni = "";
async function Yr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Ii && wr)
      a = wr, s = Ni;
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
      Ii = t, wr = a, Ni = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], u = /* @__PURE__ */ new Set(), c = [];
    for (const f of Array.from(r))
      try {
        try {
          if (f.closest && f.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const h = f.getAttribute("href") || "";
        if (!h || vr(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const g = new URL(h, t || location.href), d = g.searchParams.get("page");
              if (d && d.indexOf("/") === -1 && n) {
                const y = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (y) {
                  const m = ee(y + d), w = i && i.canonical ? ze(m, g.hash ? g.hash.replace(/^#/, "") : null) : ht(m, g.hash ? g.hash.replace(/^#/, "") : null);
                  f.setAttribute("href", w);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (h.startsWith("/") && !h.endsWith(".md")) continue;
        const p = h.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (p) {
          let g = p[1];
          const d = p[2];
          !g.startsWith("/") && n && (g = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + g);
          try {
            const y = new URL(g, t).pathname;
            let m = y.startsWith(s) ? y.slice(s.length) : y;
            m = ee(m), o.push({ node: f, mdPathRaw: g, frag: d, rel: m }), D.has(m) || l.add(m);
          } catch (y) {
            k("[htmlBuilder] resolve mdPath failed", y);
          }
          continue;
        }
        try {
          let g = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? g = n + h : g = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const y = new URL(g, t).pathname || "";
          if (y && y.indexOf(s) !== -1) {
            let m = y.startsWith(s) ? y.slice(s.length) : y;
            if (m = ee(m), m = Yt(m), m || (m = jr), !m.endsWith(".md")) {
              let w = null;
              try {
                if (D && D.has && D.has(m))
                  w = D.get(m);
                else
                  try {
                    const b = String(m || "").replace(/^.*\//, "");
                    b && D.has && D.has(b) && (w = D.get(b));
                  } catch (b) {
                    k("[htmlBuilder] mdToSlug baseName check failed", b);
                  }
              } catch (b) {
                k("[htmlBuilder] mdToSlug access check failed", b);
              }
              if (!w)
                try {
                  const b = String(m || "").replace(/^.*\//, "");
                  for (const [_, S] of te || [])
                    if (S === m || S === b) {
                      w = _;
                      break;
                    }
                } catch {
                }
              if (w) {
                const b = i && i.canonical ? ze(w, null) : ht(w);
                f.setAttribute("href", b);
              } else {
                let b = m;
                try {
                  /\.[^\/]+$/.test(String(m || "")) || (b = String(m || "") + ".html");
                } catch {
                  b = m;
                }
                u.add(b), c.push({ node: f, rel: b });
              }
            }
          }
        } catch (g) {
          k("[htmlBuilder] resolving href to URL failed", g);
        }
      } catch (h) {
        k("[htmlBuilder] processing anchor failed", h);
      }
    if (l.size)
      if (tr(t))
        await Xn(Array.from(l), async (f) => {
          try {
            try {
              const p = String(f).match(/([^\/]+)\.md$/), g = p && p[1];
              if (g && te.has(g)) {
                try {
                  const d = te.get(g);
                  if (d)
                    try {
                      const y = typeof d == "string" ? d : d && d.default ? d.default : null;
                      y && xt(g, y);
                    } catch (y) {
                      k("[htmlBuilder] _storeSlugMapping failed", y);
                    }
                } catch (d) {
                  k("[htmlBuilder] reading slugToMd failed", d);
                }
                return;
              }
            } catch (p) {
              k("[htmlBuilder] basename slug lookup failed", p);
            }
            const h = await Te(f, t);
            if (h && h.raw) {
              const p = (h.raw || "").match(/^#\s+(.+)$/m);
              if (p && p[1]) {
                const g = ue(p[1].trim());
                if (g)
                  try {
                    xt(g, f);
                  } catch (d) {
                    k("[htmlBuilder] setting slug mapping failed", d);
                  }
              }
            }
          } catch (h) {
            k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
          }
        }, 6);
      else {
        try {
          k("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const f of Array.from(l))
          try {
            const h = String(f).match(/([^\/]+)\.md$/), p = h && h[1];
            if (p) {
              const g = ue(p);
              if (g)
                try {
                  xt(g, f);
                } catch (d) {
                  k("[htmlBuilder] setting fallback slug mapping failed", d);
                }
            }
          } catch {
          }
      }
    if (u.size)
      if (tr(t))
        await Xn(Array.from(u), async (f) => {
          try {
            const h = await Te(f, t);
            if (h && h.raw)
              try {
                const p = He(), g = p ? p.parseFromString(h.raw, "text/html") : null, d = g ? g.querySelector("title") : null, y = g ? g.querySelector("h1") : null, m = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : y && y.textContent ? y.textContent.trim() : null;
                if (m) {
                  const w = ue(m);
                  if (w)
                    try {
                      xt(w, f);
                    } catch (b) {
                      k("[htmlBuilder] setting html slug mapping failed", b);
                    }
                }
              } catch (p) {
                k("[htmlBuilder] parse fetched HTML failed", p);
              }
          } catch (h) {
            k("[htmlBuilder] fetchMarkdown for htmlPending failed", h);
          }
        }, 5);
      else {
        try {
          k("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const f of Array.from(u))
          try {
            const h = String(f).match(/([^\/]+)\.html$/), p = h && h[1];
            if (p) {
              const g = ue(p);
              if (g)
                try {
                  xt(g, f);
                } catch (d) {
                  k("[htmlBuilder] setting fallback html slug mapping failed", d);
                }
            }
          } catch {
          }
      }
    for (const f of o) {
      const { node: h, frag: p, rel: g } = f;
      let d = null;
      try {
        D.has(g) && (d = D.get(g));
      } catch (y) {
        k("[htmlBuilder] mdToSlug access failed", y);
      }
      if (d) {
        const y = i && i.canonical ? ze(d, p) : ht(d, p);
        h.setAttribute("href", y);
      } else {
        const y = i && i.canonical ? ze(g, p) : ht(g, p);
        h.setAttribute("href", y);
      }
    }
    for (const f of c) {
      const { node: h, rel: p } = f;
      let g = null;
      try {
        D.has(p) && (g = D.get(p));
      } catch (d) {
        k("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", d);
      }
      if (!g)
        try {
          const d = String(p || "").replace(/^.*\//, "");
          D.has(d) && (g = D.get(d));
        } catch (d) {
          k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", d);
        }
      if (g) {
        const d = i && i.canonical ? ze(g, null) : ht(g);
        h.setAttribute("href", d);
      } else {
        const d = i && i.canonical ? ze(p, null) : ht(p);
        h.setAttribute("href", d);
      }
    }
  } catch (r) {
    k("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function cl(e, t, n, i) {
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
    !l && n && (l = String(n)), l && (s = ue(l)), s || (s = jr);
    try {
      if (n)
        try {
          xt(s, n);
        } catch (o) {
          k("[htmlBuilder] computeSlug set slug mapping failed", o);
        }
    } catch (o) {
      k("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const u = it(typeof location < "u" ? location.href : "");
          u && u.anchor && u.page && String(u.page) === String(s) ? o = u.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", ht(s, o));
      } catch (u) {
        k("[htmlBuilder] computeSlug history replace failed", u);
      }
    } catch (o) {
      k("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    k("[htmlBuilder] computeSlug failed", l);
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
async function ul(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const u = o.getAttribute("href") || "";
      if (!u) continue;
      let h = ee(u).split(/::|#/, 2)[0];
      try {
        const g = h.indexOf("?");
        g !== -1 && (h = h.slice(0, g));
      } catch {
      }
      if (!h || (h.includes(".") || (h = h + ".html"), !/\.html(?:$|[?#])/.test(h) && !h.toLowerCase().endsWith(".html"))) continue;
      const p = h;
      try {
        if (D && D.has && D.has(p)) continue;
      } catch (g) {
        k("[htmlBuilder] mdToSlug check failed", g);
      }
      try {
        let g = !1;
        for (const d of te.values())
          if (d === p) {
            g = !0;
            break;
          }
        if (g) continue;
      } catch (g) {
        k("[htmlBuilder] slugToMd iteration failed", g);
      }
      n.add(p);
    } catch (u) {
      k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", u);
    }
  if (!n.size) return;
  if (!tr()) {
    try {
      k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const u = String(o).match(/([^\/]+)\.html$/), c = u && u[1];
        if (c) {
          const f = ue(c);
          if (f)
            try {
              xt(f, o);
            } catch (h) {
              k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", h);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (o) => {
    try {
      const u = await Te(o, t);
      if (u && u.raw)
        try {
          const f = He().parseFromString(u.raw, "text/html"), h = f.querySelector("title"), p = f.querySelector("h1"), g = h && h.textContent && h.textContent.trim() ? h.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (g) {
            const d = ue(g);
            if (d)
              try {
                xt(d, o);
              } catch (y) {
                k("[htmlBuilder] set slugToMd/mdToSlug failed", y);
              }
          }
        } catch (c) {
          k("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (u) {
      k("[htmlBuilder] fetchAndExtract failed", u);
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
async function hl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Ut(a.pathname);
  } catch (a) {
    r = "", k("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = ee(l[1]);
        try {
          let u;
          try {
            u = al(o, t);
          } catch (f) {
            u = o, k("[htmlBuilder] resolve mdPath URL failed", f);
          }
          const c = u && r && u.startsWith(r) ? u.slice(r.length) : String(u || "").replace(/^\//, "");
          n.push({ rel: c }), D.has(c) || i.add(c);
        } catch (u) {
          k("[htmlBuilder] rewriteAnchors failed", u);
        }
        continue;
      }
    } catch (s) {
      k("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (tr())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && te.has(l)) {
            try {
              const o = te.get(l);
              if (o)
                try {
                  const u = typeof o == "string" ? o : o && o.default ? o.default : null;
                  u && xt(l, u);
                } catch (u) {
                  k("[htmlBuilder] _storeSlugMapping failed", u);
                }
            } catch (o) {
              k("[htmlBuilder] preMapMdSlugs slug map access failed", o);
            }
            return;
          }
        } catch (s) {
          k("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await Te(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = ue(l[1].trim());
              if (o)
                try {
                  xt(o, a);
                } catch (u) {
                  k("[htmlBuilder] preMapMdSlugs setting slug mapping failed", u);
                }
            }
          }
        } catch (s) {
          k("[htmlBuilder] preMapMdSlugs fetch failed", s);
        }
      }));
    else
      try {
        k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
}
He();
function _r(e) {
  try {
    const n = He().parseFromString(e || "", "text/html");
    Pa(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (u) {
          k("[htmlBuilder] parseHtml set image loading attribute failed", u);
        }
      });
    } catch (l) {
      k("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", u = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (u && u[1]) {
          const c = (u[1] || "").toLowerCase(), f = Ee.size && (Ee.get(c) || Ee.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await xn(f);
              } catch (h) {
                k("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            k("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (Pe && typeof Pe.getLanguage == "function" && Pe.getLanguage("plaintext")) {
              const c = Pe.highlight ? Pe.highlight(l.textContent || "", { language: "plaintext" }) : null;
              if (c && c.value)
                try {
                  if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                    const f = document.createRange().createContextualFragment(c.value);
                    if (typeof l.replaceChildren == "function") l.replaceChildren(...Array.from(f.childNodes));
                    else {
                      for (; l.firstChild; ) l.removeChild(l.firstChild);
                      l.appendChild(f);
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
            k("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (o) {
        k("[htmlBuilder] code element processing failed", o);
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
    return k("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function dl(e) {
  const t = Pr ? await Pr(e || "", Ee) : mn(e || "", Ee), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = Ee.size && (Ee.get(r) || Ee.get(String(r).toLowerCase())) || r;
      try {
        i.push(xn(a));
      } catch (s) {
        k("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(xn(r));
        } catch (s) {
          k("[htmlBuilder] ensureLanguages push alias failed", s);
        }
    } catch (a) {
      k("[htmlBuilder] ensureLanguages inner failed", a);
    }
  try {
    await Promise.all(i);
  } catch (r) {
    k("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function fl(e) {
  if (await dl(e), Cn) {
    const t = await Cn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function pl(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const f = He();
      if (f) {
        const h = f.parseFromString(t.raw || "", "text/html");
        try {
          zi(h.body, n, r);
        } catch (p) {
          k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", p);
        }
        a = _r(h.documentElement && h.documentElement.outerHTML ? h.documentElement.outerHTML : t.raw || "");
      } else
        a = _r(t.raw || "");
    } catch {
      a = _r(t.raw || "");
    }
  else
    a = await fl(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content";
  try {
    const f = He && He();
    if (f) {
      const h = f.parseFromString(String(a.html || ""), "text/html"), p = Array.from(h.body.childNodes || []);
      p.length ? s.replaceChildren(...p) : s.innerHTML = a.html;
    } else
      try {
        const h = document && typeof document.createRange == "function" ? document.createRange() : null;
        if (h && typeof h.createContextualFragment == "function") {
          const p = h.createContextualFragment(String(a.html || ""));
          s.replaceChildren(...Array.from(p.childNodes));
        } else
          s.innerHTML = a.html;
      } catch {
        s.innerHTML = a.html;
      }
  } catch {
    try {
      s.innerHTML = a.html;
    } catch (h) {
      k("[htmlBuilder] set article html failed", h);
    }
  }
  try {
    zi(s, n, r);
  } catch (f) {
    k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", f);
  }
  try {
    Pa(s);
  } catch (f) {
    k("[htmlBuilder] addHeadingIds failed", f);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((h) => {
      try {
        const p = h.getAttribute && h.getAttribute("class") || h.className || "", g = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (g)
          try {
            h.setAttribute && h.setAttribute("class", g);
          } catch (d) {
            h.className = g, k("[htmlBuilder] set element class failed", d);
          }
        else
          try {
            h.removeAttribute && h.removeAttribute("class");
          } catch (d) {
            h.className = "", k("[htmlBuilder] remove element class failed", d);
          }
      } catch (p) {
        k("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (f) {
    k("[htmlBuilder] processing code elements failed", f);
  }
  try {
    ds(s);
  } catch (f) {
    k("[htmlBuilder] observeCodeBlocks failed", f);
  }
  ll(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((h) => {
      try {
        const p = h.parentElement;
        if (!p || p.tagName.toLowerCase() !== "p" || p.childNodes.length !== 1) return;
        const g = document.createElement("figure");
        g.className = "image", p.replaceWith(g), g.appendChild(h);
      } catch {
      }
    });
  } catch (f) {
    k("[htmlBuilder] wrap images in Bulma image helper failed", f);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((h) => {
      try {
        if (h.classList)
          h.classList.contains("table") || h.classList.add("table");
        else {
          const p = h.getAttribute && h.getAttribute("class") ? h.getAttribute("class") : "", g = String(p || "").split(/\s+/).filter(Boolean);
          g.indexOf("table") === -1 && g.push("table");
          try {
            h.setAttribute && h.setAttribute("class", g.join(" "));
          } catch {
            h.className = g.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (f) {
    k("[htmlBuilder] add Bulma table class failed", f);
  }
  const { topH1: l, h1Text: o, slugKey: u } = cl(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const h = a.meta.author ? String(a.meta.author).trim() : "", p = a.meta.date ? String(a.meta.date).trim() : "";
      let g = "";
      try {
        const y = new Date(p);
        p && !isNaN(y.getTime()) ? g = y.toLocaleDateString() : g = p;
      } catch {
        g = p;
      }
      const d = [];
      if (h && d.push(h), g && d.push(g), d.length) {
        const y = document.createElement("p"), m = d[0] ? String(d[0]).replace(/"/g, "").trim() : "", w = d.slice(1);
        if (y.className = "nimbi-article-subtitle is-6 has-text-grey-light", m) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = m, y.appendChild(b);
        }
        if (w.length) {
          const b = document.createElement("span");
          b.className = "nimbi-article-meta", b.textContent = w.join(" • "), y.appendChild(b);
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
    await bl(s, r, n);
  } catch (f) {
    il("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", f), await Yr(s, r, n);
  }
  const c = ol(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: u };
}
function gl(e) {
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
              k("[htmlBuilder] injected script error", { src: r, ev: a });
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
                k("[htmlBuilder] injected script append failed, skipping", { src: r, err: s });
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
          k("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function Oi(e, t, n) {
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
          o.href = ze(mt);
        } catch {
          o.href = ze(mt || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Un({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, oe, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const $a = ws(() => {
  const e = un(nl);
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
          const r = { data: await rl(n) };
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
function ml() {
  return $a.get();
}
function yl(e) {
  return $a.send(e, 2e3);
}
async function bl(e, t, n) {
  if (!ml()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await yl({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      const s = He && He();
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
      k("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function wl(e) {
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
          l = null, k("[htmlBuilder] access history.state failed", o);
        }
        try {
          l || (l = new URL(location.href).searchParams.get("page"));
        } catch (o) {
          k("[htmlBuilder] parse current location failed", o);
        }
        if (!a && s || a && l && String(a) === String(l)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (o) {
                k("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: l || a }, "", ht(l || a, s));
              } catch (o) {
                k("[htmlBuilder] history.replaceState failed", o);
              }
          } catch (o) {
            k("[htmlBuilder] update history for anchor failed", o);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (o) {
            k("[htmlBuilder] stopPropagation failed", o);
          }
          try {
            $r(s);
          } catch (o) {
            k("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", ht(a, s));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (o) {
              k("[htmlBuilder] window.renderByQuery failed", o);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (o) {
              k("[htmlBuilder] dispatch popstate failed", o);
            }
          else
            try {
              renderByQuery();
            } catch (o) {
              k("[htmlBuilder] renderByQuery failed", o);
            }
        } catch (o) {
          k("[htmlBuilder] SPA navigation invocation failed", o);
        }
      } catch (r) {
        k("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    k("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function $r(e) {
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
                  k("[htmlBuilder] scrollIntoView failed", a);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              k("[htmlBuilder] final scroll fallback failed", a);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (r) {
          k("[htmlBuilder] scheduling scroll failed", r), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          n.scrollIntoView();
        } catch (r) {
          k("[htmlBuilder] final scroll fallback failed", r);
        }
        k("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      t && t.scrollTo ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        k("[htmlBuilder] window.scrollTo failed", i);
      }
      k("[htmlBuilder] scroll to top failed", n);
    }
}
function _l(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((d) => typeof d == "string" ? d : ""), o = i || document.querySelector(".nimbi-cms"), u = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), f = a || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top button is-primary is-rounded is-small", p.setAttribute("aria-label", l("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(p) : o && o.appendChild ? o.appendChild(p) : u && u.appendChild ? u.appendChild(p) : document.body.appendChild(p);
      } catch {
        try {
          document.body.appendChild(p);
        } catch (y) {
          k("[htmlBuilder] append scroll top button failed", y);
        }
      }
      try {
        try {
          Gi(p);
        } catch {
        }
      } catch (d) {
        k("[htmlBuilder] set scroll-top button theme registration failed", d);
      }
      p.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (y) {
            k("[htmlBuilder] fallback container scrollTop failed", y);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (y) {
            k("[htmlBuilder] fallback mountEl scrollTop failed", y);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (y) {
            k("[htmlBuilder] fallback document scrollTop failed", y);
          }
        }
      });
    }
    const g = f && f.querySelector ? f.querySelector(".menu-label") : null;
    if (t) {
      if (!p._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const d = globalThis.IntersectionObserver, y = new d((m) => {
            for (const w of m)
              w.target instanceof Element && (w.isIntersecting ? (p.classList.remove("show"), g && g.classList.remove("show")) : (p.classList.add("show"), g && g.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          p._nimbiObserver = y;
        } else
          p._nimbiObserver = null;
      try {
        p._nimbiObserver && typeof p._nimbiObserver.disconnect == "function" && p._nimbiObserver.disconnect();
      } catch (d) {
        k("[htmlBuilder] observer disconnect failed", d);
      }
      try {
        p._nimbiObserver && typeof p._nimbiObserver.observe == "function" && p._nimbiObserver.observe(t);
      } catch (d) {
        k("[htmlBuilder] observer observe failed", d);
      }
      try {
        const d = () => {
          try {
            const y = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, m = t.getBoundingClientRect();
            !(m.bottom < y.top || m.top > y.bottom) ? (p.classList.remove("show"), g && g.classList.remove("show")) : (p.classList.add("show"), g && g.classList.add("show"));
          } catch (y) {
            k("[htmlBuilder] checkIntersect failed", y);
          }
        };
        d(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(d, 100);
      } catch (d) {
        k("[htmlBuilder] checkIntersect outer failed", d);
      }
    } else {
      p.classList.remove("show"), g && g.classList.remove("show");
      const d = i instanceof Element ? i : r instanceof Element ? r : window, y = () => {
        try {
          (d === window ? window.scrollY : d.scrollTop || 0) > 10 ? (p.classList.add("show"), g && g.classList.add("show")) : (p.classList.remove("show"), g && g.classList.remove("show"));
        } catch (m) {
          k("[htmlBuilder] onScroll handler failed", m);
        }
      };
      Qn(() => d.addEventListener("scroll", y)), y();
    }
  } catch (l) {
    k("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Xt(e, t) {
  try {
    if (typeof tt == "function")
      try {
        tt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && te && typeof te.set == "function" && !te.has(e) && te.set(e, t);
  } catch {
  }
  try {
    t && D && typeof D.set == "function" && D.set(t, e);
  } catch {
  }
  try {
    if ($e && typeof $e.has == "function") {
      if (!$e.has(t)) {
        try {
          $e.add(t);
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
function Bi(e, t) {
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
function kl(e) {
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
            const l = ee(String(t.path || ""));
            if (a = findSlugForPath(l) || (D && D.has(l) ? D.get(l) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = ue(String(t.title).trim());
              else {
                const o = l.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = ue(o || l);
              }
          } else if (r) {
            const l = String(n).replace(/\.(?:md|html?)$/i, ""), o = findSlugForPath(l) || (D && D.has(l) ? D.get(l) : "") || "";
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
              Xt(l, ee(String(t.path || "")));
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
async function xl(e, t, n, i, r, a, s, l, o = "eager", u = 1, c = void 0, f = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = He(), p = h ? h.parseFromString(n || "", "text/html") : null, g = p ? p.querySelectorAll("a") : [];
  await Qn(() => ul(g, i)), await Qn(() => hl(g, i));
  try {
    xe(g, i);
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
  let d = null, y = null, m = null, w = null, b = null, _ = null, S = !1, v = null;
  const T = /* @__PURE__ */ new Map();
  function X() {
    try {
      const L = document.querySelector(".navbar-burger"), O = L && L.dataset ? L.dataset.target : null, E = O ? document.getElementById(O) : null;
      L && L.classList.contains("is-active") && (L.classList.remove("is-active"), L.setAttribute("aria-expanded", "false"), E && E.classList.remove("is-active"));
    } catch (L) {
      k("[nimbi-cms] closeMobileMenu failed", L);
    }
  }
  async function P() {
    const L = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      L && L.classList.add("is-inactive");
    } catch {
    }
    try {
      const O = s && s();
      O && typeof O.then == "function" && await O;
    } catch (O) {
      try {
        k("[nimbi-cms] renderByQuery failed", O);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              L && L.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            L && L.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          L && L.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function ie(L) {
    try {
      let O = L && typeof L.slug == "string" ? String(L.slug) : "", E = null;
      try {
        O && O.indexOf("::") !== -1 && (E = O.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (L && L.path && typeof L.path == "string") {
          const M = ee(String(L.path || "")), R = M.replace(/^.*\//, "");
          try {
            if (T && T.has(M)) return { page: T.get(M), hash: E };
            if (T && T.has(R)) return { page: T.get(R), hash: E };
          } catch {
          }
          try {
            if (D && D.has(M)) return { page: D.get(M), hash: E };
          } catch {
          }
          try {
            const I = K(M);
            if (I) return { page: I, hash: E };
          } catch {
          }
        }
      } catch {
      }
      if (O && O.indexOf("::") !== -1) {
        const M = O.split("::");
        O = M[0] || "", E = M.slice(1).join("::") || null;
      }
      if (O && (O.includes(".") || O.includes("/"))) {
        const M = ee(L && L.path ? String(L.path) : O), R = M.replace(/^.*\//, "");
        try {
          if (T && T.has(M)) return { page: T.get(M), hash: E };
          if (T && T.has(R)) return { page: T.get(R), hash: E };
        } catch {
        }
        try {
          let I = K(M);
          if (!I)
            try {
              const Z = String(M || "").replace(/^\/+/, ""), $ = Z.replace(/^.*\//, "");
              for (const [j, C] of te.entries())
                try {
                  let B = null;
                  if (typeof C == "string" ? B = ee(String(C || "")) : C && typeof C == "object" && (C.default ? B = ee(String(C.default || "")) : B = null), !B) continue;
                  if (B === Z || B.endsWith("/" + Z) || Z.endsWith("/" + B) || B.endsWith($) || Z.endsWith($)) {
                    I = j;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if (I) O = I;
          else
            try {
              const Z = String(O).replace(/\.(?:md|html?)$/i, "");
              O = ue(Z || M);
            } catch {
              O = ue(M);
            }
        } catch {
          O = ue(M);
        }
      }
      return !O && L && L.path && (O = ue(ee(String(L.path || "")))), { page: O, hash: E };
    } catch {
      return { page: L && L.slug || "", hash: null };
    }
  }
  const z = () => d || (d = (async () => {
    try {
      const L = await Promise.resolve().then(() => ct), O = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, E = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, M = Bi(L, "buildSearchIndex"), R = Bi(L, "buildSearchIndexWorker"), I = typeof O == "function" ? O : M || void 0, Z = typeof E == "function" ? E : R || void 0;
      zt("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof I + " workerFn=" + typeof Z + " (global preferred)");
      const $ = [];
      try {
        r && $.push(r);
      } catch {
      }
      try {
        navigationPage && $.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof Z == "function")
        try {
          const j = await Z(i, u, c, $.length ? $ : void 0);
          if (j && j.length) {
            try {
              if (L && typeof L._setSearchIndex == "function")
                try {
                  L._setSearchIndex(j);
                } catch {
                }
            } catch {
            }
            return j;
          }
        } catch (j) {
          k("[nimbi-cms] worker builder threw", j);
        }
      return typeof I == "function" ? (zt("[nimbi-cms test] calling buildFn"), await I(i, u, c, $.length ? $ : void 0)) : [];
    } catch (L) {
      return k("[nimbi-cms] buildSearchIndex failed", L), [];
    } finally {
      if (y) {
        try {
          y.removeAttribute("disabled");
        } catch {
        }
        try {
          m && m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), d.then((L) => {
    try {
      try {
        v = Array.isArray(L) ? L : null;
      } catch {
        v = null;
      }
      try {
        kl(L);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const R = await Promise.resolve().then(() => ct);
                try {
                  try {
                    R && typeof R._setSearchIndex == "function" && R._setSearchIndex(Array.isArray(L) ? L : []);
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
      const O = String(y && y.value || "").trim().toLowerCase();
      if (!O || !Array.isArray(L) || !L.length) return;
      const E = L.filter((R) => R.title && R.title.toLowerCase().includes(O) || R.excerpt && R.excerpt.toLowerCase().includes(O));
      if (!E || !E.length) return;
      const M = document.getElementById("nimbi-search-results");
      if (!M) return;
      try {
        typeof M.replaceChildren == "function" ? M.replaceChildren() : M.innerHTML = "";
      } catch {
        try {
          M.innerHTML = "";
        } catch {
        }
      }
      try {
        const R = document.createElement("div");
        R.className = "panel nimbi-search-panel", E.slice(0, 10).forEach((I) => {
          try {
            if (I.parentTitle) {
              const C = document.createElement("p");
              C.className = "panel-heading nimbi-search-title nimbi-search-parent", C.textContent = I.parentTitle, R.appendChild(C);
            }
            const Z = document.createElement("a");
            Z.className = "panel-block nimbi-search-result";
            const $ = ie(I);
            Z.href = ze($.page, $.hash), Z.setAttribute("role", "button");
            try {
              if (I.path && typeof I.path == "string")
                try {
                  Xt($.page, I.path);
                } catch {
                }
            } catch {
            }
            const j = document.createElement("div");
            j.className = "is-size-6 has-text-weight-semibold", j.textContent = I.title, Z.appendChild(j), Z.addEventListener("click", () => {
              try {
                M.style.display = "none";
              } catch {
              }
            }), R.appendChild(Z);
          } catch {
          }
        }), M.appendChild(R);
        try {
          M.style.display = "block";
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
        const L = await Promise.resolve().then(() => _n);
        try {
          await L.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: u, noIndexing: c, includeAllMarkdown: !0 });
        } catch (O) {
          k("[nimbi-cms] sitemap trigger failed", O);
        }
      } catch (L) {
        try {
          k("[nimbi-cms] sitemap dynamic import failed", L);
        } catch {
        }
      }
    })();
  }), d), q = document.createElement("nav");
  q.className = "navbar", q.setAttribute("role", "navigation"), q.setAttribute("aria-label", "main navigation");
  const G = document.createElement("div");
  G.className = "navbar-brand";
  const F = g[0], H = document.createElement("a");
  if (H.className = "navbar-item", F) {
    const L = F.getAttribute("href") || "#";
    try {
      const E = new URL(L, location.href).searchParams.get("page"), M = E ? decodeURIComponent(E) : r;
      let R = null;
      try {
        typeof M == "string" && (/(?:\.md|\.html?)$/i.test(M) || M.includes("/")) && (R = K(M));
      } catch {
      }
      !R && typeof M == "string" && !String(M).includes(".") && (R = M);
      const I = R || M;
      H.href = ze(I), (!H.textContent || !String(H.textContent).trim()) && (H.textContent = a("home"));
    } catch {
      try {
        const E = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? K(r) : typeof r == "string" && !r.includes(".") ? r : null;
        H.href = ze(E || r);
      } catch {
        H.href = ze(r);
      }
      H.textContent = a("home");
    }
  } else
    H.href = ze(r), H.textContent = a("home");
  async function A(L) {
    try {
      if (!L || L === "none") return null;
      if (L === "favicon")
        try {
          const O = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!O) return null;
          const E = O.getAttribute("href") || "";
          return E && /\.png(?:\?|$)/i.test(E) ? new URL(E, location.href).toString() : null;
        } catch {
          return null;
        }
      if (L === "copy-first" || L === "move-first")
        try {
          const O = await Te(r, i);
          if (!O || !O.raw) return null;
          const E = He(), M = E ? E.parseFromString(O.raw, "text/html") : null, R = M ? M.querySelector("img") : null;
          if (!R) return null;
          const I = R.getAttribute("src") || "";
          if (!I) return null;
          const Z = new URL(I, location.href).toString();
          if (L === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", Z);
            } catch {
            }
          return Z;
        } catch {
          return null;
        }
      try {
        return new URL(L, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let Q = null;
  try {
    Q = await A(f);
  } catch {
    Q = null;
  }
  if (Q)
    try {
      const L = document.createElement("img");
      L.className = "nimbi-navbar-logo";
      const O = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      L.alt = O, L.title = O, L.src = Q;
      try {
        L.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!H.textContent || !String(H.textContent).trim()) && (H.textContent = O);
      } catch {
      }
      try {
        H.insertBefore(L, H.firstChild);
      } catch {
        try {
          H.appendChild(L);
        } catch {
        }
      }
    } catch {
    }
  G.appendChild(H), H.addEventListener("click", function(L) {
    const O = H.getAttribute("href") || "";
    if (O.startsWith("?page=")) {
      L.preventDefault();
      const E = new URL(O, location.href), M = E.searchParams.get("page"), R = E.hash ? E.hash.replace(/^#/, "") : null;
      history.pushState({ page: M }, "", ze(M, R)), P();
      try {
        X();
      } catch {
      }
    }
  });
  function K(L) {
    try {
      if (!L) return null;
      const O = ee(String(L || ""));
      try {
        if (D && D.has(O)) return D.get(O);
      } catch {
      }
      const E = O.replace(/^.*\//, "");
      try {
        if (D && D.has(E)) return D.get(E);
      } catch {
      }
      try {
        for (const [M, R] of te.entries())
          if (R) {
            if (typeof R == "string") {
              if (ee(R) === O) return M;
            } else if (R && typeof R == "object") {
              if (R.default && ee(R.default) === O) return M;
              const I = R.langs || {};
              for (const Z in I)
                if (I[Z] && ee(I[Z]) === O) return M;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function xe(L, O) {
    try {
      if (!L || !L.length) return;
      const E = [];
      for (let $ = 0; $ < L.length; $++)
        try {
          const j = L[$];
          if (!j || typeof j.getAttribute != "function") continue;
          const C = j.getAttribute("href") || "";
          if (!C || vr(C)) continue;
          let B = null;
          try {
            const pe = it(C);
            pe && pe.page && (B = pe.page);
          } catch {
          }
          if (!B) {
            const pe = String(C || "").split(/[?#]/, 1), Me = pe && pe[0] ? pe[0] : C;
            (/\.(?:md|html?)$/i.test(Me) || Me.indexOf("/") !== -1) && (B = ee(String(Me || "")));
          }
          if (!B) continue;
          const Y = ee(String(B || "")), U = Y.replace(/^.*\//, "");
          let ge = null;
          try {
            T && T.has(Y) && (ge = T.get(Y));
          } catch {
          }
          try {
            !ge && D && D.has(Y) && (ge = D.get(Y));
          } catch {
          }
          if (ge) continue;
          let Ce = null;
          try {
            Ce = j.textContent && String(j.textContent).trim() ? String(j.textContent).trim() : null;
          } catch {
            Ce = null;
          }
          let me = null;
          if (Ce) me = ue(Ce);
          else {
            const pe = U.replace(/\.(?:md|html?)$/i, "");
            me = ue(pe || Y);
          }
          if (me)
            try {
              E.push({ path: Y, candidate: me });
            } catch {
            }
        } catch {
        }
      if (!E.length) return;
      const M = 3;
      let R = 0;
      const I = async () => {
        for (; R < E.length; ) {
          const $ = E[R++];
          if (!(!$ || !$.path))
            try {
              const j = await Te($.path, O);
              if (!j || !j.raw) continue;
              let C = null;
              if (j.isHtml)
                try {
                  const B = He(), Y = B ? B.parseFromString(j.raw, "text/html") : null, U = Y ? Y.querySelector("h1") || Y.querySelector("title") : null;
                  U && U.textContent && (C = String(U.textContent).trim());
                } catch {
                }
              else
                try {
                  const B = j.raw.match(/^#\s+(.+)$/m);
                  B && B[1] && (C = String(B[1]).trim());
                } catch {
                }
              if (C) {
                const B = ue(C);
                if (B && B !== $.candidate) {
                  try {
                    Xt(B, $.path);
                  } catch {
                  }
                  try {
                    T.set($.path, B);
                  } catch {
                  }
                  try {
                    T.set($.path.replace(/^.*\//, ""), B);
                  } catch {
                  }
                  try {
                    const Y = await Promise.resolve().then(() => ct);
                    try {
                      if (Array.isArray(Y.searchIndex)) {
                        let U = !1;
                        for (const ge of Y.searchIndex)
                          try {
                            if (ge && ge.path === $.path && ge.slug) {
                              const me = String(ge.slug).split("::").slice(1).join("::");
                              ge.slug = me ? `${B}::${me}` : B, U = !0;
                            }
                          } catch {
                          }
                        try {
                          U && typeof Y._setSearchIndex == "function" && Y._setSearchIndex(Y.searchIndex);
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
      }, Z = [];
      for (let $ = 0; $ < M; $++) Z.push(I());
      try {
        await Promise.all(Z);
      } catch {
      }
    } catch {
    }
  }
  const V = document.createElement("a");
  V.className = "navbar-burger", V.setAttribute("role", "button"), V.setAttribute("aria-label", "menu"), V.setAttribute("aria-expanded", "false");
  const de = "nimbi-navbar-menu";
  V.dataset.target = de, V.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', G.appendChild(V);
  try {
    V.addEventListener("click", (L) => {
      try {
        const O = V.dataset && V.dataset.target ? V.dataset.target : null, E = O ? document.getElementById(O) : null;
        V.classList.contains("is-active") ? (V.classList.remove("is-active"), V.setAttribute("aria-expanded", "false"), E && E.classList.remove("is-active")) : (V.classList.add("is-active"), V.setAttribute("aria-expanded", "true"), E && E.classList.add("is-active"));
      } catch (O) {
        k("[nimbi-cms] navbar burger toggle failed", O);
      }
    });
  } catch (L) {
    k("[nimbi-cms] burger event binding failed", L);
  }
  const ke = document.createElement("div");
  ke.className = "navbar-menu", ke.id = de;
  const ve = document.createElement("div");
  ve.className = "navbar-start";
  let je = null, _e = null;
  if (!l)
    je = null, y = null, w = null, b = null, _ = null;
  else {
    je = document.createElement("div"), je.className = "navbar-end", _e = document.createElement("div"), _e.className = "navbar-item", y = document.createElement("input"), y.className = "input", y.type = "search", y.placeholder = a("searchPlaceholder") || "", y.id = "nimbi-search";
    try {
      const R = (a && typeof a == "function" ? a("searchAria") : null) || y.placeholder || "Search";
      try {
        y.setAttribute("aria-label", R);
      } catch {
      }
      try {
        y.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        y.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        y.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    o === "eager" && (y.disabled = !0), m = document.createElement("div"), m.className = "control", o === "eager" && m.classList.add("is-loading"), m.appendChild(y), _e.appendChild(m), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const L = document.createElement("div");
    L.className = "dropdown-trigger", L.appendChild(_e);
    const O = document.createElement("div");
    O.className = "dropdown-menu", O.setAttribute("role", "menu"), b = document.createElement("div"), b.id = "nimbi-search-results", b.className = "dropdown-content nimbi-search-results", _ = b, O.appendChild(b), w.appendChild(L), w.appendChild(O), je.appendChild(w);
    const E = (R) => {
      if (!b) return;
      try {
        if (typeof b.replaceChildren == "function") b.replaceChildren();
        else
          for (; b.firstChild; ) b.removeChild(b.firstChild);
      } catch {
        try {
          b.innerHTML = "";
        } catch {
        }
      }
      let I = -1;
      function Z(C) {
        try {
          const B = b.querySelector(".nimbi-search-result.is-selected");
          B && B.classList.remove("is-selected");
          const Y = b.querySelectorAll(".nimbi-search-result");
          if (!Y || !Y.length) return;
          if (C < 0) {
            I = -1;
            return;
          }
          C >= Y.length && (C = Y.length - 1);
          const U = Y[C];
          if (U) {
            U.classList.add("is-selected"), I = C;
            try {
              U.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function $(C) {
        try {
          const B = C.key, Y = b.querySelectorAll(".nimbi-search-result");
          if (!Y || !Y.length) return;
          if (B === "ArrowDown") {
            C.preventDefault();
            const U = I < 0 ? 0 : Math.min(Y.length - 1, I + 1);
            Z(U);
            return;
          }
          if (B === "ArrowUp") {
            C.preventDefault();
            const U = I <= 0 ? 0 : I - 1;
            Z(U);
            return;
          }
          if (B === "Enter") {
            C.preventDefault();
            const U = b.querySelector(".nimbi-search-result.is-selected") || b.querySelector(".nimbi-search-result");
            if (U)
              try {
                U.click();
              } catch {
              }
            return;
          }
          if (B === "Escape") {
            try {
              w.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              b.style.display = "none";
            } catch {
            }
            try {
              b.classList.remove("is-open");
            } catch {
            }
            try {
              b.removeAttribute("tabindex");
            } catch {
            }
            try {
              b.removeEventListener("keydown", $);
            } catch {
            }
            try {
              y && y.focus();
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", j);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function j(C) {
        try {
          if (C && C.key === "ArrowDown") {
            C.preventDefault();
            try {
              b.focus();
            } catch {
            }
            Z(0);
          }
        } catch {
        }
      }
      try {
        const C = document.createElement("div");
        C.className = "panel nimbi-search-panel";
        const B = document.createDocumentFragment();
        R.forEach((Y) => {
          if (Y.parentTitle) {
            const me = document.createElement("p");
            me.textContent = Y.parentTitle, me.className = "panel-heading nimbi-search-title nimbi-search-parent", B.appendChild(me);
          }
          const U = document.createElement("a");
          U.className = "panel-block nimbi-search-result";
          const ge = ie(Y);
          U.href = ze(ge.page, ge.hash), U.setAttribute("role", "button");
          try {
            if (Y.path && typeof Y.path == "string")
              try {
                Xt(ge.page, Y.path);
              } catch {
              }
          } catch {
          }
          const Ce = document.createElement("div");
          Ce.className = "is-size-6 has-text-weight-semibold", Ce.textContent = Y.title, U.appendChild(Ce), U.addEventListener("click", (me) => {
            try {
              try {
                me && me.preventDefault && me.preventDefault();
              } catch {
              }
              try {
                me && me.stopPropagation && me.stopPropagation();
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
                b.style.display = "none";
              } catch {
              }
              try {
                b.classList.remove("is-open");
              } catch {
              }
              try {
                b.removeAttribute("tabindex");
              } catch {
              }
              try {
                b.removeEventListener("keydown", $);
              } catch {
              }
              try {
                y && y.removeEventListener("keydown", j);
              } catch {
              }
              try {
                const pe = U.getAttribute && U.getAttribute("href") || "";
                let Me = null, Qe = null;
                try {
                  const qe = new URL(pe, location.href);
                  Me = qe.searchParams.get("page"), Qe = qe.hash ? qe.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Me)
                  try {
                    history.pushState({ page: Me }, "", ze(Me, Qe));
                    try {
                      P();
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
          }), B.appendChild(U);
        }), C.appendChild(B), b.appendChild(C);
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
        b.style.display = "block";
      } catch {
      }
      try {
        b.classList.add("is-open");
      } catch {
      }
      try {
        b.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        b.addEventListener("keydown", $);
      } catch {
      }
      try {
        y && y.addEventListener("keydown", j);
      } catch {
      }
    }, M = (R, I) => {
      let Z = null;
      return (...$) => {
        Z && clearTimeout(Z), Z = setTimeout(() => R(...$), I);
      };
    };
    if (y) {
      const R = M(async () => {
        const I = document.querySelector("input#nimbi-search"), Z = String(I && I.value || "").trim().toLowerCase();
        if (!Z) {
          E([]);
          return;
        }
        try {
          await z();
          const $ = await d, j = Array.isArray($) ? $.filter((C) => C.title && C.title.toLowerCase().includes(Z) || C.excerpt && C.excerpt.toLowerCase().includes(Z)) : [];
          E(j.slice(0, 10));
        } catch ($) {
          k("[nimbi-cms] search input handler failed", $), E([]);
        }
      }, 50);
      try {
        y.addEventListener("input", R);
      } catch {
      }
      try {
        document.addEventListener("input", (I) => {
          try {
            I && I.target && I.target.id === "nimbi-search" && R(I);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        d = z();
      } catch (R) {
        k("[nimbi-cms] eager search index init failed", R), d = Promise.resolve([]);
      }
      d.finally(() => {
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
            const I = await d.catch(() => []), Z = await Promise.resolve().then(() => _n);
            try {
              await Z.handleSitemapRequest({ index: Array.isArray(I) ? I : void 0, homePage: r, contentBase: i, indexDepth: u, noIndexing: c, includeAllMarkdown: !0 });
            } catch ($) {
              k("[nimbi-cms] sitemap trigger failed", $);
            }
          } catch (I) {
            try {
              k("[nimbi-cms] sitemap dynamic import failed", I);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const R = (I) => {
        try {
          const Z = I && I.target;
          if (!_ || !_.classList.contains("is-open") && _.style && _.style.display !== "block" || Z && (_.contains(Z) || y && (Z === y || y.contains && y.contains(Z)))) return;
          if (w) {
            w.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            _.style.display = "none";
          } catch {
          }
          try {
            _.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", R, !0), document.addEventListener("touchstart", R, !0);
    } catch {
    }
  }
  const Fe = document.createDocumentFragment();
  for (let L = 0; L < g.length; L++) {
    const O = g[L];
    if (L === 0) continue;
    const E = O.getAttribute("href") || "#";
    let M = E;
    const R = document.createElement("a");
    R.className = "navbar-item";
    try {
      let I = null;
      try {
        I = it(String(E || ""));
      } catch {
        I = null;
      }
      let Z = null, $ = null;
      if (I && (I.type === "canonical" && I.page || I.type === "cosmetic" && I.page) && (Z = I.page, $ = I.anchor), Z && (/\.(?:md|html?)$/i.test(Z) || Z.includes("/") ? M = Z : R.href = ze(Z, $)), /^[^#]*\.md(?:$|[#?])/.test(M) || M.endsWith(".md")) {
        const C = ee(M).split(/::|#/, 2), B = C[0], Y = C[1], U = K(B);
        U ? R.href = ze(U, Y) : R.href = ze(B, Y);
      } else if (/\.html(?:$|[#?])/.test(M) || M.endsWith(".html")) {
        const C = ee(M).split(/::|#/, 2);
        let B = C[0];
        B && !B.toLowerCase().endsWith(".html") && (B = B + ".html");
        const Y = C[1], U = K(B);
        if (U)
          R.href = ze(U, Y);
        else
          try {
            const ge = await Te(B, i);
            if (ge && ge.raw)
              try {
                const Ce = He(), me = Ce ? Ce.parseFromString(ge.raw, "text/html") : null, pe = me ? me.querySelector("title") : null, Me = me ? me.querySelector("h1") : null, Qe = pe && pe.textContent && pe.textContent.trim() ? pe.textContent.trim() : Me && Me.textContent ? Me.textContent.trim() : null;
                if (Qe) {
                  const qe = ue(Qe);
                  if (qe) {
                    try {
                      Xt(qe, B);
                    } catch (yt) {
                      k("[nimbi-cms] slugToMd/mdToSlug set failed", yt);
                    }
                    R.href = ze(qe, Y);
                  } else
                    R.href = ze(B, Y);
                } else
                  R.href = ze(B, Y);
              } catch {
                R.href = ze(B, Y);
              }
            else
              R.href = M;
          } catch {
            R.href = M;
          }
      } else
        R.href = M;
    } catch (I) {
      k("[nimbi-cms] nav item href parse failed", I), R.href = M;
    }
    try {
      const I = O.textContent && String(O.textContent).trim() ? String(O.textContent).trim() : null;
      if (I)
        try {
          const Z = ue(I);
          if (Z) {
            const $ = R.getAttribute("href") || "";
            let j = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test($))
              j = ee(String($ || "").split(/[?#]/)[0]);
            else
              try {
                const C = it($);
                C && C.type === "canonical" && C.page && (j = ee(C.page));
              } catch {
              }
            if (j) {
              let C = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String(j || "")))
                  C = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String(j || "")))
                  C = !1;
                else {
                  const B = String(j || "").replace(/^\.\//, ""), Y = B.replace(/^.*\//, "");
                  $e && $e.size && ($e.has(B) || $e.has(Y)) && (C = !0);
                }
              } catch {
                C = !1;
              }
              if (C)
                try {
                  const B = ee(String(j || "").split(/[?#]/)[0]);
                  let Y = !1;
                  try {
                    K && typeof K == "function" && K(B) && (Y = !0);
                  } catch {
                  }
                  try {
                    Xt(Z, j);
                  } catch {
                  }
                  try {
                    if (B) {
                      try {
                        T.set(B, Z);
                      } catch {
                      }
                      try {
                        const U = B.replace(/^.*\//, "");
                        U && T.set(U, Z);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Y)
                    try {
                      R.href = ze(Z);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (Z) {
          k("[nimbi-cms] nav slug mapping failed", Z);
        }
    } catch (I) {
      k("[nimbi-cms] nav slug mapping failed", I);
    }
    R.textContent = O.textContent || M, Fe.appendChild(R);
  }
  try {
    ve.appendChild(Fe);
  } catch {
  }
  ke.appendChild(ve), je && ke.appendChild(je), q.appendChild(G), q.appendChild(ke), e.appendChild(q);
  try {
    const L = (O) => {
      try {
        const E = q && q.querySelector ? q.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!E || !E.classList.contains("is-active")) return;
        const M = E && E.closest ? E.closest(".navbar") : q;
        if (M && M.contains(O.target)) return;
        X();
      } catch {
      }
    };
    document.addEventListener("click", L, !0), document.addEventListener("touchstart", L, !0);
  } catch {
  }
  try {
    ke.addEventListener("click", (L) => {
      const O = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!O) return;
      const E = O.getAttribute("href") || "";
      try {
        const M = new URL(E, location.href), R = M.searchParams.get("page"), I = M.hash ? M.hash.replace(/^#/, "") : null;
        R && (L.preventDefault(), history.pushState({ page: R }, "", ze(R, I)), P());
      } catch (M) {
        k("[nimbi-cms] navbar click handler failed", M);
      }
      try {
        const M = q && q.querySelector ? q.querySelector(".navbar-burger") : null, R = M && M.dataset ? M.dataset.target : null, I = R ? document.getElementById(R) : null;
        M && M.classList.contains("is-active") && (M.classList.remove("is-active"), M.setAttribute("aria-expanded", "false"), I && I.classList.remove("is-active"));
      } catch (M) {
        k("[nimbi-cms] mobile menu close failed", M);
      }
    });
  } catch (L) {
    k("[nimbi-cms] attach content click handler failed", L);
  }
  try {
    t.addEventListener("click", (L) => {
      const O = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!O) return;
      const E = O.getAttribute("href") || "";
      if (E && !vr(E))
        try {
          const M = new URL(E, location.href), R = M.searchParams.get("page"), I = M.hash ? M.hash.replace(/^#/, "") : null;
          R && (L.preventDefault(), history.pushState({ page: R }, "", ze(R, I)), P());
        } catch (M) {
          k("[nimbi-cms] container click URL parse failed", M);
        }
    });
  } catch (L) {
    k("[nimbi-cms] build navbar failed", L);
  }
  return { navbar: q, linkEls: g };
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
let et = null, he = null, Xe = 1, kt = (e, t) => t, yn = 0, bn = 0, Wn = () => {
}, cn = 0.25;
function Sl() {
  if (et && document.contains(et)) return et;
  et = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", kt("imagePreviewTitle", "Image preview"));
  try {
    const A = document.createElement("div");
    A.className = "modal-background";
    const Q = document.createElement("div");
    Q.className = "modal-content";
    const K = document.createElement("div");
    K.className = "nimbi-image-preview__content box", K.setAttribute("role", "document");
    const xe = document.createElement("button");
    xe.className = "button is-small nimbi-image-preview__close", xe.type = "button", xe.setAttribute("data-nimbi-preview-close", ""), xe.textContent = "✕";
    const V = document.createElement("div");
    V.className = "nimbi-image-preview__image-wrapper";
    const de = document.createElement("img");
    de.setAttribute("data-nimbi-preview-image", ""), de.alt = "", V.appendChild(de);
    const ke = document.createElement("div");
    ke.className = "nimbi-image-preview__controls";
    const ve = document.createElement("div");
    ve.className = "nimbi-image-preview__group";
    const je = document.createElement("button");
    je.className = "button is-small", je.type = "button", je.setAttribute("data-nimbi-preview-fit", ""), je.textContent = "⤢";
    const _e = document.createElement("button");
    _e.className = "button is-small", _e.type = "button", _e.setAttribute("data-nimbi-preview-original", ""), _e.textContent = "1:1";
    const Fe = document.createElement("button");
    Fe.className = "button is-small", Fe.type = "button", Fe.setAttribute("data-nimbi-preview-reset", ""), Fe.textContent = "⟲", ve.appendChild(je), ve.appendChild(_e), ve.appendChild(Fe);
    const L = document.createElement("div");
    L.className = "nimbi-image-preview__group";
    const O = document.createElement("button");
    O.className = "button is-small", O.type = "button", O.setAttribute("data-nimbi-preview-zoom-out", ""), O.textContent = "−";
    const E = document.createElement("div");
    E.className = "nimbi-image-preview__zoom", E.setAttribute("data-nimbi-preview-zoom-label", ""), E.textContent = "100%";
    const M = document.createElement("button");
    M.className = "button is-small", M.type = "button", M.setAttribute("data-nimbi-preview-zoom-in", ""), M.textContent = "＋", L.appendChild(O), L.appendChild(E), L.appendChild(M), ke.appendChild(ve), ke.appendChild(L), K.appendChild(xe), K.appendChild(V), K.appendChild(ke), Q.appendChild(K), e.appendChild(A), e.appendChild(Q);
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
  e.addEventListener("click", (A) => {
    A.target === e && kr();
  }), e.addEventListener("wheel", (A) => {
    if (!ie()) return;
    A.preventDefault();
    const Q = A.deltaY < 0 ? cn : -cn;
    Et(Xe + Q), u(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (A) => {
    if (A.key === "Escape") {
      kr();
      return;
    }
    if (Xe > 1) {
      const Q = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!Q) return;
      const K = 40;
      switch (A.key) {
        case "ArrowUp":
          Q.scrollTop -= K, A.preventDefault();
          break;
        case "ArrowDown":
          Q.scrollTop += K, A.preventDefault();
          break;
        case "ArrowLeft":
          Q.scrollLeft -= K, A.preventDefault();
          break;
        case "ArrowRight":
          Q.scrollLeft += K, A.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), et = e, he = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function u() {
    l && (l.textContent = `${Math.round(Xe * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(Xe * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Wn = u, i.addEventListener("click", () => {
    Et(Xe + cn), u(), c();
  }), r.addEventListener("click", () => {
    Et(Xe - cn), u(), c();
  }), t.addEventListener("click", () => {
    wn(), u(), c();
  }), n.addEventListener("click", () => {
    Et(1), u(), c();
  }), a.addEventListener("click", () => {
    wn(), u(), c();
  }), s.addEventListener("click", kr), t.title = kt("imagePreviewFit", "Fit to screen"), n.title = kt("imagePreviewOriginal", "Original size"), r.title = kt("imagePreviewZoomOut", "Zoom out"), i.title = kt("imagePreviewZoomIn", "Zoom in"), s.title = kt("imagePreviewClose", "Close"), s.setAttribute("aria-label", kt("imagePreviewClose", "Close"));
  let f = !1, h = 0, p = 0, g = 0, d = 0;
  const y = /* @__PURE__ */ new Map();
  let m = 0, w = 1;
  const b = (A, Q) => {
    const K = A.x - Q.x, xe = A.y - Q.y;
    return Math.hypot(K, xe);
  }, _ = () => {
    f = !1, y.clear(), m = 0, he && (he.classList.add("is-panning"), he.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, T = 0;
  const X = (A) => {
    const Q = Date.now(), K = Q - S, xe = A.clientX - v, V = A.clientY - T;
    S = Q, v = A.clientX, T = A.clientY, K < 300 && Math.hypot(xe, V) < 30 && (Et(Xe > 1 ? 1 : 2), u(), A.preventDefault());
  }, P = (A) => {
    Et(Xe > 1 ? 1 : 2), u(), A.preventDefault();
  }, ie = () => et ? typeof et.open == "boolean" ? et.open : et.classList.contains("is-active") : !1, z = (A, Q, K = 1) => {
    if (y.has(K) && y.set(K, { x: A, y: Q }), y.size === 2) {
      const ke = Array.from(y.values()), ve = b(ke[0], ke[1]);
      if (m > 0) {
        const je = ve / m;
        Et(w * je);
      }
      return;
    }
    if (!f) return;
    const xe = he.closest(".nimbi-image-preview__image-wrapper");
    if (!xe) return;
    const V = A - h, de = Q - p;
    xe.scrollLeft = g - V, xe.scrollTop = d - de;
  }, q = (A, Q, K = 1) => {
    if (!ie()) return;
    if (y.set(K, { x: A, y: Q }), y.size === 2) {
      const de = Array.from(y.values());
      m = b(de[0], de[1]), w = Xe;
      return;
    }
    const xe = he.closest(".nimbi-image-preview__image-wrapper");
    !xe || !(xe.scrollWidth > xe.clientWidth || xe.scrollHeight > xe.clientHeight) || (f = !0, h = A, p = Q, g = xe.scrollLeft, d = xe.scrollTop, he.classList.add("is-panning"), he.classList.remove("is-grabbing"), window.addEventListener("pointermove", G), window.addEventListener("pointerup", F), window.addEventListener("pointercancel", F));
  }, G = (A) => {
    f && (A.preventDefault(), z(A.clientX, A.clientY, A.pointerId));
  }, F = () => {
    _(), window.removeEventListener("pointermove", G), window.removeEventListener("pointerup", F), window.removeEventListener("pointercancel", F);
  };
  he.addEventListener("pointerdown", (A) => {
    A.preventDefault(), q(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointermove", (A) => {
    (f || y.size === 2) && A.preventDefault(), z(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointerup", (A) => {
    A.preventDefault(), A.pointerType === "touch" && X(A), _();
  }), he.addEventListener("dblclick", P), he.addEventListener("pointercancel", _), he.addEventListener("mousedown", (A) => {
    A.preventDefault(), q(A.clientX, A.clientY, 1);
  }), he.addEventListener("mousemove", (A) => {
    f && A.preventDefault(), z(A.clientX, A.clientY, 1);
  }), he.addEventListener("mouseup", (A) => {
    A.preventDefault(), _();
  });
  const H = e.querySelector(".nimbi-image-preview__image-wrapper");
  return H && (H.addEventListener("pointerdown", (A) => {
    if (q(A.clientX, A.clientY, A.pointerId), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), H.addEventListener("pointermove", (A) => {
    z(A.clientX, A.clientY, A.pointerId);
  }), H.addEventListener("pointerup", _), H.addEventListener("pointercancel", _), H.addEventListener("mousedown", (A) => {
    if (q(A.clientX, A.clientY, 1), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), H.addEventListener("mousemove", (A) => {
    z(A.clientX, A.clientY, 1);
  }), H.addEventListener("mouseup", _)), e;
}
function Et(e) {
  if (!he) return;
  const t = Number(e);
  Xe = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = he.getBoundingClientRect(), r = yn || he.naturalWidth || he.width || i.width || 0, a = bn || he.naturalHeight || he.height || i.height || 0;
  if (r && a) {
    he.style.setProperty("--nimbi-preview-img-max-width", "none"), he.style.setProperty("--nimbi-preview-img-max-height", "none"), he.style.setProperty("--nimbi-preview-img-width", `${r * Xe}px`), he.style.setProperty("--nimbi-preview-img-height", `${a * Xe}px`), he.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      he.style.width = `${r * Xe}px`, he.style.height = `${a * Xe}px`, he.style.transform = "none";
    } catch {
    }
  } else {
    he.style.setProperty("--nimbi-preview-img-max-width", ""), he.style.setProperty("--nimbi-preview-img-max-height", ""), he.style.setProperty("--nimbi-preview-img-width", ""), he.style.setProperty("--nimbi-preview-img-height", ""), he.style.setProperty("--nimbi-preview-img-transform", `scale(${Xe})`);
    try {
      he.style.transform = `scale(${Xe})`;
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
  Et(Number.isFinite(s) ? s : 1);
}
function vl(e, t = "", n = 0, i = 0) {
  const r = Sl();
  Xe = 1, yn = n || 0, bn = i || 0, he.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", u = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = kt("imagePreviewDefaultAlt", u || "Image");
      } catch {
        t = kt("imagePreviewDefaultAlt", "Image");
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
function kr() {
  if (et) {
    typeof et.close == "function" && et.open && et.close(), et.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Al(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  kt = (p, g) => (typeof t == "function" ? t(p) : void 0) || g, cn = n, e.addEventListener("click", (p) => {
    const g = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!g || g.tagName !== "IMG") return;
    const d = (
      /** @type {HTMLImageElement} */
      g
    );
    if (!d.src) return;
    const y = d.closest("a");
    y && y.getAttribute("href") || vl(d.src, d.alt || "", d.naturalWidth || 0, d.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let u = 0, c = 1;
  const f = (p, g) => {
    const d = p.x - g.x, y = p.y - g.y;
    return Math.hypot(d, y);
  };
  e.addEventListener("pointerdown", (p) => {
    const g = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!g || g.tagName !== "IMG") return;
    const d = g.closest("a");
    if (d && d.getAttribute("href") || !et || !et.open) return;
    if (o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      const m = Array.from(o.values());
      u = f(m[0], m[1]), c = Xe;
      return;
    }
    const y = g.closest(".nimbi-image-preview__image-wrapper");
    if (y && !(Xe <= 1)) {
      p.preventDefault(), i = !0, r = p.clientX, a = p.clientY, s = y.scrollLeft, l = y.scrollTop, g.setPointerCapture(p.pointerId);
      try {
        g.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (p) => {
    if (o.has(p.pointerId) && o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      p.preventDefault();
      const b = Array.from(o.values()), _ = f(b[0], b[1]);
      if (u > 0) {
        const S = _ / u;
        Et(c * S);
      }
      return;
    }
    if (!i) return;
    p.preventDefault();
    const g = (
      /** @type {HTMLElement} */
      p.target
    ), d = g.closest && g.closest("a");
    if (d && d.getAttribute && d.getAttribute("href")) return;
    const y = g.closest(".nimbi-image-preview__image-wrapper");
    if (!y) return;
    const m = p.clientX - r, w = p.clientY - a;
    y.scrollLeft = s - m, y.scrollTop = l - w;
  });
  const h = () => {
    i = !1, o.clear(), u = 0;
    try {
      const p = document.querySelector("[data-nimbi-preview-image]");
      p && (p.classList.add("is-panning"), p.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", h), e.addEventListener("pointercancel", h);
}
function El(e) {
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
  const f = sl(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  let h = !1, p = !1;
  function g(_) {
    try {
      if (!_) return;
      if (typeof _.replaceChildren == "function") return _.replaceChildren();
      for (; _.firstChild; ) _.removeChild(_.firstChild);
    } catch {
      try {
        _ && (_.innerHTML = "");
      } catch {
      }
    }
  }
  async function d(_, S) {
    let v, T, X;
    try {
      ({ data: v, pagePath: T, anchor: X } = await Ys(_, s));
    } catch (H) {
      const A = H && H.message ? String(H.message) : "", Q = (!oe || typeof oe != "string" || !oe) && /no page data/i.test(A);
      try {
        if (Q)
          try {
            k("[nimbi-cms] fetchPageData (expected missing)", H);
          } catch {
          }
        else
          try {
            Zn("[nimbi-cms] fetchPageData failed", H);
          } catch {
          }
      } catch {
      }
      try {
        !oe && n && g(n);
      } catch {
      }
      Oi(t, a, H);
      return;
    }
    !X && S && (X = S);
    try {
      $r(null);
    } catch (H) {
      k("[nimbi-cms] scrollToAnchorOrTop failed", H);
    }
    try {
      g(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const { article: P, parsed: ie, toc: z, topH1: q, h1Text: G, slugKey: F } = await pl(a, v, T, X, s);
    Gs(a, o, ie, z, P, T, X, q, G, F, v);
    try {
      g(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    z && (n.appendChild(z), wl(z));
    try {
      await u("transformHtml", { article: P, parsed: ie, toc: z, pagePath: T, anchor: X, topH1: q, h1Text: G, slugKey: F, data: v });
    } catch (H) {
      k("[nimbi-cms] transformHtml hooks failed", H);
    }
    t.appendChild(P);
    try {
      gl(P);
    } catch (H) {
      k("[nimbi-cms] executeEmbeddedScripts failed", H);
    }
    try {
      Al(P, { t: a });
    } catch (H) {
      k("[nimbi-cms] attachImagePreview failed", H);
    }
    try {
      Bn(i, 100, !1), requestAnimationFrame(() => Bn(i, 100, !1)), setTimeout(() => Bn(i, 100, !1), 250);
    } catch (H) {
      k("[nimbi-cms] setEagerForAboveFoldImages failed", H);
    }
    $r(X), _l(P, q, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await u("onPageLoad", { data: v, pagePath: T, anchor: X, article: P, toc: z, topH1: q, h1Text: G, slugKey: F, contentWrap: t, navWrap: n });
    } catch (H) {
      k("[nimbi-cms] onPageLoad hooks failed", H);
    }
    c = T;
  }
  async function y() {
    if (h) {
      p = !0;
      return;
    }
    h = !0;
    try {
      try {
        Di("renderByQuery");
      } catch {
      }
      try {
        Fi("renderByQuery");
      } catch {
      }
      let _ = it(location.href);
      if (_ && _.type === "path" && _.page)
        try {
          let T = "?page=" + encodeURIComponent(_.page || "");
          _.params && (T += (T.includes("?") ? "&" : "?") + _.params), _.anchor && (T += "#" + encodeURIComponent(_.anchor));
          try {
            history.replaceState(history.state, "", T);
          } catch {
            try {
              history.replaceState({}, "", T);
            } catch {
            }
          }
          _ = it(location.href);
        } catch {
        }
      const S = _ && _.page ? _.page : l, v = _ && _.anchor ? _.anchor : null;
      await d(S, v);
    } catch (_) {
      k("[nimbi-cms] renderByQuery failed", _);
      try {
        !oe && n && g(n);
      } catch {
      }
      Oi(t, a, _);
    } finally {
      if (h = !1, p) {
        p = !1;
        try {
          await y();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", y);
  const m = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, w = () => {
    try {
      const _ = i || document.querySelector(".nimbi-cms");
      if (!_) return;
      const S = {
        top: _.scrollTop || 0,
        left: _.scrollLeft || 0
      };
      sessionStorage.setItem(m(), JSON.stringify(S));
    } catch (_) {
      k("[nimbi-cms] save scroll position failed", _);
    }
  }, b = () => {
    try {
      const _ = i || document.querySelector(".nimbi-cms");
      if (!_) return;
      const S = sessionStorage.getItem(m());
      if (!S) return;
      const v = JSON.parse(S);
      v && typeof v.top == "number" && _.scrollTo({ top: v.top, left: v.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (_) => {
    if (_.persisted)
      try {
        b(), Bn(i, 100, !1);
      } catch (S) {
        k("[nimbi-cms] bfcache restore failed", S);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      w();
    } catch (_) {
      k("[nimbi-cms] save scroll position failed", _);
    }
  }), { renderByQuery: y, siteNav: f, getCurrentPagePath: () => c };
}
function Cl(e) {
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
function xr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function Ml(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let jn = "";
async function jl(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = Cl();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
    else {
      try {
        k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    if (Object.prototype.hasOwnProperty.call(n, "debugLevel"))
      pi(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const z = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(z) && pi(Math.max(0, Math.min(3, Math.floor(z))));
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
    bulmaCustomize: f = "none",
    lang: h = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: d,
    markdownExtensions: y,
    availableLanguages: m,
    homePage: w = null,
    notFoundPage: b = null,
    navigationPage: _ = "_navigation.md",
    exposeSitemap: S = !0
  } = n;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof _ == "string" && _.startsWith("./") && (_ = _.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: T = !1 } = n, X = (z) => {
    try {
      const q = document.querySelector(i);
      if (q && q instanceof Element)
        try {
          const G = document.createElement("div");
          G.style.padding = "1rem";
          try {
            G.style.fontFamily = "system-ui, sans-serif";
          } catch {
          }
          G.style.color = "#b00", G.style.background = "#fee", G.style.border = "1px solid #b00";
          const F = document.createElement("strong");
          F.textContent = "NimbiCMS failed to initialize:", G.appendChild(F);
          try {
            G.appendChild(document.createElement("br"));
          } catch {
          }
          const H = document.createElement("pre");
          try {
            H.style.whiteSpace = "pre-wrap";
          } catch {
          }
          H.textContent = String(z), G.appendChild(H);
          try {
            if (typeof q.replaceChildren == "function") q.replaceChildren(G);
            else {
              for (; q.firstChild; ) q.removeChild(q.firstChild);
              q.appendChild(G);
            }
          } catch {
            try {
              q.innerHTML = '<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">' + String(z) + "</pre></div>";
            } catch {
            }
          }
        } catch {
        }
    } catch {
    }
  };
  if (n.contentPath != null && !Ml(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !xr(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (b != null && !xr(b))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !xr(_))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let P = i;
  if (typeof i == "string") {
    if (P = document.querySelector(i), !P) throw new Error(`el selector "${i}" did not match any element`);
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
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (d != null && (typeof d != "number" || !Number.isInteger(d) || d < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (y != null && (!Array.isArray(y) || y.some((z) => !z || typeof z != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (m != null && (!Array.isArray(m) || m.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (T != null && typeof T != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ie = !!s;
  try {
    Promise.resolve().then(() => ct).then((z) => {
      try {
        z && typeof z.setSkipRootReadme == "function" && z.setSkipRootReadme(!!T);
      } catch (q) {
        k("[nimbi-cms] setSkipRootReadme failed", q);
      }
    }).catch((z) => {
    });
  } catch (z) {
    k("[nimbi-cms] setSkipRootReadme dynamic import failed", z);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && Ws(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(z) {
        try {
          const q = { type: "error", message: z && z.message ? String(z.message) : "", filename: z && z.filename ? String(z.filename) : "", lineno: z && z.lineno ? z.lineno : null, colno: z && z.colno ? z.colno : null, stack: z && z.error && z.error.stack ? z.error.stack : null, time: Date.now() };
          try {
            k("[nimbi-cms] runtime error", q.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(q);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(z) {
        try {
          const q = { type: "unhandledrejection", reason: z && z.reason ? String(z.reason) : "", time: Date.now() };
          try {
            k("[nimbi-cms] unhandledrejection", q.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(q);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const z = it(typeof window < "u" ? window.location.href : ""), q = z && z.page ? z.page : w || void 0;
      try {
        q && Zs(q, jn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        P.classList.add("nimbi-mount");
      } catch (E) {
        k("[nimbi-cms] mount element setup failed", E);
      }
      const z = document.createElement("section");
      z.className = "section";
      const q = document.createElement("div");
      q.className = "container nimbi-cms";
      const G = document.createElement("div");
      G.className = "columns";
      const F = document.createElement("div");
      F.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", F.setAttribute("role", "navigation");
      try {
        const E = typeof ln == "function" ? ln("navigation") : null;
        E && F.setAttribute("aria-label", E);
      } catch (E) {
        k("[nimbi-cms] set nav aria-label failed", E);
      }
      G.appendChild(F);
      const H = document.createElement("main");
      H.className = "column nimbi-content", H.setAttribute("role", "main"), G.appendChild(H), q.appendChild(G), z.appendChild(q);
      const A = F, Q = H;
      P.appendChild(z);
      let K = null;
      try {
        K = P.querySelector(".nimbi-overlay"), K || (K = document.createElement("div"), K.className = "nimbi-overlay", P.appendChild(K));
      } catch (E) {
        K = null, k("[nimbi-cms] mount overlay setup failed", E);
      }
      const xe = location.pathname || "/";
      let V;
      if (xe.endsWith("/"))
        V = xe;
      else {
        const E = xe.substring(xe.lastIndexOf("/") + 1);
        E && !E.includes(".") ? V = xe + "/" : V = xe.substring(0, xe.lastIndexOf("/") + 1);
      }
      try {
        jn = document.title || "";
      } catch (E) {
        jn = "", k("[nimbi-cms] read initial document title failed", E);
      }
      let de = r;
      const ke = Object.prototype.hasOwnProperty.call(n, "contentPath"), ve = typeof location < "u" && location.origin ? location.origin : "http://localhost", je = new URL(V, ve).toString();
      (de === "." || de === "./") && (de = "");
      try {
        de = String(de || "").replace(/\\/g, "/");
      } catch {
        de = String(de || "");
      }
      de.startsWith("/") && (de = de.replace(/^\/+/, "")), de && !de.endsWith("/") && (de = de + "/");
      try {
        if (de && V && V !== "/") {
          const E = V.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          E && de.startsWith(E) && (de = de.slice(E.length));
        }
      } catch {
      }
      try {
        if (de)
          var _e = new URL(de, je.endsWith("/") ? je : je + "/").toString();
        else
          var _e = je;
      } catch {
        try {
          if (de) var _e = new URL("/" + de, ve).toString();
          else var _e = new URL(V, ve).toString();
        } catch {
          var _e = ve;
        }
      }
      if (p && await Qi(p, V), m && Array.isArray(m) && Yi(m), h && Ki(h), typeof g == "number" && g >= 0 && typeof vi == "function" && vi(g * 60 * 1e3), typeof d == "number" && d >= 0 && typeof Si == "function" && Si(d), y && Array.isArray(y) && y.length)
        try {
          y.forEach((E) => {
            typeof E == "object" && Ra && typeof Rr == "function" && Rr(E);
          });
        } catch (E) {
          k("[nimbi-cms] applying markdownExtensions failed", E);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => ct).then(({ setDefaultCrawlMaxQueue: E }) => {
          try {
            E(a);
          } catch (M) {
            k("[nimbi-cms] setDefaultCrawlMaxQueue failed", M);
          }
        });
      } catch (E) {
        k("[nimbi-cms] setDefaultCrawlMaxQueue import failed", E);
      }
      try {
        try {
          const E = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (E && typeof E == "object")
            try {
              const M = await Promise.resolve().then(() => ct);
              if (M && typeof M._setAllMd == "function") {
                M._setAllMd(E);
                try {
                  Tt("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(E).length }));
                } catch {
                }
              }
            } catch (M) {
              k("[nimbi-cms] applying content manifest failed", M);
            }
          try {
            Hr(_e);
          } catch (M) {
            k("[nimbi-cms] setContentBase failed", M);
          }
          try {
            try {
              const M = await Promise.resolve().then(() => ct);
              try {
                Tt("[nimbi-cms diagnostic] after setContentBase", () => ({
                  manifestKeys: E && typeof E == "object" ? Object.keys(E).length : 0,
                  slugToMdSize: M && M.slugToMd && typeof M.slugToMd.size == "number" ? M.slugToMd.size : void 0,
                  allMarkdownPathsLength: M && Array.isArray(M.allMarkdownPaths) ? M.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: M && M.allMarkdownPathsSet && typeof M.allMarkdownPathsSet.size == "number" ? M.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: M && Array.isArray(M.searchIndex) ? M.searchIndex.length : void 0
                }));
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (E) {
        k("[nimbi-cms] setContentBase failed", E);
      }
      try {
        ta(b);
      } catch (E) {
        k("[nimbi-cms] setNotFoundPage failed", E);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => _n).then((E) => {
          try {
            E && typeof E.attachSitemapDownloadUI == "function" && E.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let Fe = null, L = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && _)
          try {
            const R = [], I = [];
            try {
              _ && I.push(String(_));
            } catch {
            }
            try {
              const $ = String(_ || "").replace(/^_/, "");
              $ && $ !== String(_) && I.push($);
            } catch {
            }
            try {
              I.push("navigation.md");
            } catch {
            }
            try {
              I.push("assets/navigation.md");
            } catch {
            }
            const Z = [];
            for (const $ of I)
              try {
                if (!$) continue;
                const j = String($);
                Z.includes(j) || Z.push(j);
              } catch {
              }
            for (const $ of Z) {
              R.push($);
              try {
                if (L = await Te($, _e, { force: !0 }), L && L.raw) {
                  try {
                    _ = $;
                  } catch {
                  }
                  try {
                    k("[nimbi-cms] fetched navigation candidate", $, "contentBase=", _e);
                  } catch {
                  }
                  Fe = await Cn(L.raw || "");
                  try {
                    const j = He();
                    if (j && Fe && Fe.html) {
                      const B = j.parseFromString(Fe.html, "text/html").querySelector("a");
                      if (B)
                        try {
                          const Y = B.getAttribute("href") || "", U = it(Y);
                          try {
                            k("[nimbi-cms] parsed nav first-link href", Y, "->", U);
                          } catch {
                          }
                          if (U && U.page && (U.type === "path" || U.type === "canonical" && (U.page.includes(".") || U.page.includes("/")))) {
                            w = U.page;
                            try {
                              k("[nimbi-cms] derived homePage from navigation", w);
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
          k("[nimbi-cms] final homePage before slugManager setHomePage", w);
        } catch {
        }
        try {
          na(w);
        } catch (R) {
          k("[nimbi-cms] setHomePage failed", R);
        }
        let M = !0;
        try {
          const R = it(typeof location < "u" ? location.href : "");
          R && R.type === "cosmetic" && (typeof b > "u" || b == null) && (M = !1);
        } catch {
        }
        if (M && w)
          try {
            await Te(w, _e, { force: !0 });
          } catch (R) {
            throw new Error(`Required ${w} not found at ${_e}${w}: ${R && R.message ? R.message : String(R)}`);
          }
      } catch (E) {
        throw E;
      }
      gs(c), await ps(f, V);
      const O = El({ contentWrap: Q, navWrap: A, container: q, mountOverlay: K, t: ln, contentBase: _e, homePage: w, initialDocumentTitle: jn, runHooks: gi });
      try {
        const E = document.createElement("header");
        E.className = "nimbi-site-navbar", P.insertBefore(E, z);
        let M = L, R = Fe;
        R || (M = await Te(_, _e, { force: !0 }), R = await Cn(M.raw || ""));
        const { navbar: I, linkEls: Z } = await xl(E, q, R.html || "", _e, w, ln, O.renderByQuery, ie, l, o, u, v);
        try {
          await gi("onNavBuild", { navWrap: A, navbar: I, linkEls: Z, contentBase: _e });
        } catch ($) {
          k("[nimbi-cms] onNavBuild hooks failed", $);
        }
        try {
          try {
            if (Z && Z.length) {
              const $ = await Promise.resolve().then(() => ct);
              for (const j of Array.from(Z || []))
                try {
                  const C = j && j.getAttribute && j.getAttribute("href") || "";
                  if (!C) continue;
                  let B = String(C || "").split(/::|#/, 1)[0];
                  if (B = String(B || "").split("?")[0], !B) continue;
                  /\.(?:md|html?)$/.test(B) || (B = B + ".html");
                  let Y = null;
                  try {
                    Y = ee(String(B || ""));
                  } catch {
                    Y = String(B || "");
                  }
                  const U = String(Y || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!U) continue;
                  try {
                    let ge = null;
                    try {
                      $ && typeof $.slugify == "function" && (ge = $.slugify(U.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      ge = String(U || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!ge) continue;
                    let Ce = ge;
                    try {
                      if ($ && $.slugToMd && typeof $.slugToMd.has == "function" && $.slugToMd.has(ge)) {
                        const me = $.slugToMd.get(ge);
                        let pe = !1;
                        try {
                          if (typeof me == "string")
                            me === B && (pe = !0);
                          else if (me && typeof me == "object") {
                            me.default === B && (pe = !0);
                            for (const Me of Object.keys(me.langs || {}))
                              if (me.langs[Me] === B) {
                                pe = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!pe && typeof $.uniqueSlug == "function")
                          try {
                            Ce = $.uniqueSlug(ge, new Set($.slugToMd.keys()));
                          } catch {
                            Ce = ge;
                          }
                      }
                    } catch {
                    }
                    try {
                      if ($ && typeof $._storeSlugMapping == "function")
                        try {
                          $._storeSlugMapping(Ce, Y);
                        } catch {
                        }
                      else if ($ && $.slugToMd && typeof $.slugToMd.set == "function")
                        try {
                          $.slugToMd.set(Ce, Y);
                        } catch {
                        }
                      try {
                        $ && $.mdToSlug && typeof $.mdToSlug.set == "function" && $.mdToSlug.set(Y, Ce);
                      } catch {
                      }
                      try {
                        $ && Array.isArray($.allMarkdownPaths) && !$.allMarkdownPaths.includes(Y) && $.allMarkdownPaths.push(Y);
                      } catch {
                      }
                      try {
                        $ && $.allMarkdownPathsSet && typeof $.allMarkdownPathsSet.add == "function" && $.allMarkdownPathsSet.add(Y);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const j = await Promise.resolve().then(() => mr);
                j && typeof j.refreshIndexPaths == "function" && j.refreshIndexPaths(_e);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let $ = !1;
          try {
            const j = new URLSearchParams(location.search || "");
            (j.has("sitemap") || j.has("rss") || j.has("atom")) && ($ = !0);
          } catch {
          }
          try {
            const C = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            C && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(C) && ($ = !0);
          } catch {
          }
          if ($ || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const C = await Promise.resolve().then(() => ct);
                if (C && typeof C.awaitSearchIndex == "function") {
                  const B = [];
                  w && B.push(w), _ && B.push(_);
                  try {
                    await C.awaitSearchIndex({ contentBase: _e, indexDepth: Math.max(o || 1, 3), noIndexing: u, seedPaths: B.length ? B : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const j = await Promise.resolve().then(() => _n);
              try {
                if (j && typeof j.handleSitemapRequest == "function" && await j.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: _, notFoundPage: b, contentBase: _e, indexDepth: o, noIndexing: u }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => _n).then((j) => {
              try {
                if (j && typeof j.exposeSitemapGlobals == "function")
                  try {
                    j.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: _, notFoundPage: b, contentBase: _e, indexDepth: o, noIndexing: u, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const j = await Promise.resolve().then(() => mr);
            if (j && typeof j.refreshIndexPaths == "function")
              try {
                j.refreshIndexPaths(_e);
                try {
                  try {
                    const C = await Promise.resolve().then(() => ct);
                    try {
                      Tt("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({ slugToMdSize: C && C.slugToMd && typeof C.slugToMd.size == "number" ? C.slugToMd.size : void 0, allMarkdownPathsLength: C && Array.isArray(C.allMarkdownPaths) ? C.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: C && C.allMarkdownPathsSet && typeof C.allMarkdownPathsSet.size == "number" ? C.allMarkdownPathsSet.size : void 0 }));
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const C = await Promise.resolve().then(() => ct), B = C && C.slugToMd && typeof C.slugToMd.size == "number" ? C.slugToMd.size : 0;
                  let Y = !1;
                  try {
                    if (!manifest) {
                      B < 30 && (Y = !0);
                      try {
                        const U = it(typeof location < "u" ? location.href : "");
                        if (U) {
                          if (U.type === "cosmetic" && U.page)
                            try {
                              C.slugToMd.has(U.page) || (Y = !0);
                            } catch {
                            }
                          else if ((U.type === "path" || U.type === "canonical") && U.page)
                            try {
                              const ge = ee(U.page);
                              !(C.mdToSlug && C.mdToSlug.has(ge)) && !(C.allMarkdownPathsSet && C.allMarkdownPathsSet.has(ge)) && (Y = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Y) {
                    let U = null;
                    try {
                      U = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      U = null;
                    }
                    if (Array.isArray(U) && U.length) {
                      let ge = 0;
                      for (const Ce of U)
                        try {
                          if (!Ce || !Ce.slug) continue;
                          const me = String(Ce.slug).split("::")[0];
                          if (C.slugToMd.has(me)) continue;
                          let pe = Ce.sourcePath || Ce.path || null;
                          if (!pe && Array.isArray(U)) {
                            const Qe = (U || []).find((qe) => qe && qe.slug === Ce.slug);
                            Qe && Qe.path && (pe = Qe.path);
                          }
                          if (!pe) continue;
                          try {
                            pe = String(pe);
                          } catch {
                            continue;
                          }
                          let Me = null;
                          try {
                            const Qe = _e && typeof _e == "string" ? _e : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const qe = new URL(pe, Qe), yt = new URL(Qe);
                              if (qe.origin === yt.origin) {
                                const tn = yt.pathname || "/";
                                let vt = qe.pathname || "";
                                vt.startsWith(tn) && (vt = vt.slice(tn.length)), vt.startsWith("/") && (vt = vt.slice(1)), Me = ee(vt);
                              } else
                                Me = ee(qe.pathname || "");
                            } catch {
                              Me = ee(pe);
                            }
                          } catch {
                            Me = ee(pe);
                          }
                          if (!Me) continue;
                          Me = String(Me).split(/[?#]/)[0], Me = ee(Me);
                          try {
                            C._storeSlugMapping(me, Me);
                          } catch {
                          }
                          ge++;
                        } catch {
                        }
                      if (ge) {
                        try {
                          Tt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({ added: ge, total: C && C.slugToMd && typeof C.slugToMd.size == "number" ? C.slugToMd.size : void 0 }));
                        } catch {
                        }
                        try {
                          const Ce = await Promise.resolve().then(() => mr);
                          Ce && typeof Ce.refreshIndexPaths == "function" && Ce.refreshIndexPaths(_e);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (C) {
                k("[nimbi-cms] refreshIndexPaths after nav build failed", C);
              }
          } catch {
          }
          const $ = () => {
            const j = E && E.getBoundingClientRect && Math.round(E.getBoundingClientRect().height) || E && E.offsetHeight || 0;
            if (j > 0) {
              try {
                P.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (C) {
                k("[nimbi-cms] set CSS var failed", C);
              }
              try {
                q.style.paddingTop = "";
              } catch (C) {
                k("[nimbi-cms] set container paddingTop failed", C);
              }
              try {
                const C = P && P.getBoundingClientRect && Math.round(P.getBoundingClientRect().height) || P && P.clientHeight || 0;
                if (C > 0) {
                  const B = Math.max(0, C - j);
                  try {
                    q.style.setProperty("--nimbi-cms-height", `${B}px`);
                  } catch (Y) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", Y);
                  }
                } else
                  try {
                    q.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (B) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", B);
                  }
              } catch (C) {
                k("[nimbi-cms] compute container height failed", C);
              }
              try {
                E.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (C) {
                k("[nimbi-cms] set navbar CSS var failed", C);
              }
            }
          };
          $();
          try {
            if (typeof ResizeObserver < "u") {
              const j = new ResizeObserver(() => $());
              try {
                j.observe(E);
              } catch (C) {
                k("[nimbi-cms] ResizeObserver.observe failed", C);
              }
            }
          } catch (j) {
            k("[nimbi-cms] ResizeObserver setup failed", j);
          }
        } catch ($) {
          k("[nimbi-cms] compute navbar height failed", $);
        }
      } catch (E) {
        k("[nimbi-cms] build navigation failed", E);
      }
      await O.renderByQuery();
      try {
        Promise.resolve().then(() => Tl).then(({ getVersion: E }) => {
          typeof E == "function" && E().then((M) => {
            try {
              const R = M || "0.0.0";
              try {
                const I = (j) => {
                  const C = document.createElement("a");
                  C.className = "nimbi-version-label tag is-small", C.textContent = `nimbiCMS v. ${R}`, C.href = j || "#", C.target = "_blank", C.rel = "noopener noreferrer nofollow", C.setAttribute("aria-label", `nimbiCMS version ${R}`);
                  try {
                    Gi(C);
                  } catch {
                  }
                  try {
                    P.appendChild(C);
                  } catch (B) {
                    k("[nimbi-cms] append version label failed", B);
                  }
                }, Z = "https://abelvm.github.io/nimbiCMS/", $ = (() => {
                  try {
                    if (Z && typeof Z == "string")
                      return new URL(Z).toString();
                  } catch {
                  }
                  return "#";
                })();
                I($);
              } catch (I) {
                k("[nimbi-cms] building version label failed", I);
              }
            } catch (R) {
              k("[nimbi-cms] building version label failed", R);
            }
          }).catch((M) => {
            k("[nimbi-cms] getVersion() failed", M);
          });
        }).catch((E) => {
          k("[nimbi-cms] import version module failed", E);
        });
      } catch (E) {
        k("[nimbi-cms] version label setup failed", E);
      }
    })();
  } catch (z) {
    throw X(z), z;
  }
}
async function Ll() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const Tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Ll
}, Symbol.toStringTag, { value: "Module" })), Je = zt, on = k;
function Jr() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function De(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function qi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function Rl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = ee(String(t.path))), r;
  } catch {
    return null;
  }
}
async function ei(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Jr().split("?")[0];
  let o = Array.isArray(re) && re.length ? re : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(re) && re.length) {
    const m = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && m.set(String(w.slug), w);
        } catch {
        }
      for (const w of re)
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
    typeof a == "string" && a.trim() && u.add(ee(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && u.add(ee(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const m = ee(String(a));
      try {
        if (D && typeof D.has == "function" && D.has(m))
          try {
            c.add(D.get(m));
          } catch {
          }
        else
          try {
            const w = await Te(m, e && e.contentBase ? e.contentBase : void 0);
            if (w && w.raw)
              try {
                let b = null;
                if (w.isHtml)
                  try {
                    const _ = He();
                    if (_) {
                      const S = _.parseFromString(w.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                      v && v.textContent && (b = v.textContent.trim());
                    } else {
                      const S = (w.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                      S && (b = (S[1] || S[2] || "").trim());
                    }
                  } catch {
                  }
                else {
                  const _ = (w.raw || "").match(/^#\s+(.+)$/m);
                  _ && _[1] && (b = _[1].trim());
                }
                b && c.add(ue(b));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const f = /* @__PURE__ */ new Set(), h = [], p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), d = (m) => {
    try {
      if (!m || typeof m != "string") return !1;
      const w = ee(String(m));
      try {
        if ($e && typeof $e.has == "function" && $e.has(w)) return !0;
      } catch {
      }
      try {
        if (D && typeof D.has == "function" && D.has(w)) return !0;
      } catch {
      }
      try {
        if (g && g.has(w)) return !0;
      } catch {
      }
      try {
        if (D && typeof D.keys == "function" && D.size)
          for (const b of D.keys())
            try {
              if (ee(String(b)) === w) return !0;
            } catch {
            }
        else
          for (const b of te.values())
            try {
              if (!b) continue;
              if (typeof b == "string") {
                if (ee(String(b)) === w) return !0;
              } else if (b && typeof b == "object") {
                if (b.default && ee(String(b.default)) === w) return !0;
                const _ = b.langs || {};
                for (const S of Object.keys(_ || {}))
                  try {
                    if (_[S] && ee(String(_[S])) === w) return !0;
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
        const w = String(m.slug), b = String(w).split("::")[0];
        if (c.has(b)) continue;
        const _ = m.path ? ee(String(m.path)) : null;
        if (_ && u.has(_)) continue;
        const S = m.title ? String(m.title) : m.parentTitle ? String(m.parentTitle) : void 0;
        p.set(w, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, path: _, source: "index" }), _ && g.set(_, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, slug: w });
        const v = Rl(l, m);
        if (!v || !v.slug || f.has(v.slug)) continue;
        if (f.add(v.slug), p.has(v.slug)) {
          const T = p.get(v.slug);
          T && T.title && (v.title = T.title, v._titleSource = "index"), T && T.excerpt && (v.excerpt = T.excerpt);
        }
        h.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [m, w] of te.entries())
        try {
          if (!m) continue;
          const b = String(m).split("::")[0];
          if (f.has(m) || c.has(b)) continue;
          let _ = null;
          if (typeof w == "string" ? _ = ee(String(w)) : w && typeof w == "object" && (_ = ee(String(w.default || ""))), _ && u.has(_)) continue;
          const v = { loc: l + "?page=" + encodeURIComponent(m), slug: m };
          if (p.has(m)) {
            const T = p.get(m);
            T && T.title && (v.title = T.title, v._titleSource = "index"), T && T.excerpt && (v.excerpt = T.excerpt);
          } else if (_) {
            const T = g.get(_);
            T && T.title && (v.title = T.title, v._titleSource = "path", !v.excerpt && T.excerpt && (v.excerpt = T.excerpt));
          }
          if (f.add(m), typeof m == "string") {
            const T = m.indexOf("/") !== -1 || /\.(md|html?)$/i.test(m), X = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || X || T) && (v.title = qi(m), v._titleSource = "humanize");
          }
          h.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const m = ee(String(i));
          let w = null;
          try {
            D && D.has(m) && (w = D.get(m));
          } catch {
          }
          w || (w = m);
          const b = String(w).split("::")[0];
          if (!f.has(w) && !u.has(m) && !c.has(b)) {
            const _ = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (p.has(w)) {
              const S = p.get(w);
              S && S.title && (_.title = S.title, _._titleSource = "index"), S && S.excerpt && (_.excerpt = S.excerpt);
            }
            f.add(w), h.push(_);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const m = /* @__PURE__ */ new Set(), w = new Set(h.map((v) => String(v && v.slug ? v.slug : ""))), b = /* @__PURE__ */ new Set();
    for (const v of h)
      try {
        v && v.sourcePath && b.add(String(v.sourcePath));
      } catch {
      }
    const _ = 30;
    let S = 0;
    for (const v of b) {
      if (S >= _) break;
      try {
        if (!v || typeof v != "string" || !d(v)) continue;
        S += 1;
        const T = await Te(v, e && e.contentBase ? e.contentBase : void 0);
        if (!T || !T.raw || T && typeof T.status == "number" && T.status === 404) continue;
        const X = T.raw, P = (function(F) {
          try {
            return String(F || "");
          } catch {
            return "";
          }
        })(X), ie = [], z = /\[[^\]]+\]\(([^)]+)\)/g;
        let q;
        for (; q = z.exec(P); )
          try {
            q && q[1] && ie.push(q[1]);
          } catch {
          }
        const G = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; q = G.exec(P); )
          try {
            q && q[1] && ie.push(q[1]);
          } catch {
          }
        for (const F of ie)
          try {
            if (!F) continue;
            if (F.indexOf("?") !== -1 || F.indexOf("=") !== -1)
              try {
                const Q = new URL(F, l).searchParams.get("page");
                if (Q) {
                  const K = String(Q);
                  !w.has(K) && !m.has(K) && (m.add(K), h.push({ loc: l + "?page=" + encodeURIComponent(K), slug: K }));
                  continue;
                }
              } catch {
              }
            let H = String(F).split(/[?#]/)[0];
            if (H = H.replace(/^\.\//, "").replace(/^\//, ""), !H || !/\.(md|html?)$/i.test(H)) continue;
            try {
              const A = ee(H);
              if (D && D.has(A)) {
                const Q = D.get(A), K = String(Q).split("::")[0];
                Q && !w.has(Q) && !m.has(Q) && !c.has(K) && !u.has(A) && (m.add(Q), h.push({ loc: l + "?page=" + encodeURIComponent(Q), slug: Q, sourcePath: A }));
                continue;
              }
              try {
                if (!d(A)) continue;
                const Q = await Te(A, e && e.contentBase ? e.contentBase : void 0);
                if (Q && typeof Q.status == "number" && Q.status === 404) continue;
                if (Q && Q.raw) {
                  const K = (Q.raw || "").match(/^#\s+(.+)$/m), xe = K && K[1] ? K[1].trim() : "", V = ue(xe || A), de = String(V).split("::")[0];
                  V && !w.has(V) && !m.has(V) && !c.has(de) && (m.add(V), h.push({ loc: l + "?page=" + encodeURIComponent(V), slug: V, sourcePath: A, title: xe || void 0 }));
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
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        m.set(String(b.slug), b);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        const _ = String(b.slug), S = _.split("::")[0];
        if (!S) continue;
        _ !== S && !m.has(S) && w.add(S);
      } catch {
      }
    for (const b of w)
      try {
        let _ = null;
        if (p.has(b)) {
          const S = p.get(b);
          _ = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, S && S.title && (_.title = S.title, _._titleSource = "index"), S && S.excerpt && (_.excerpt = S.excerpt), S && S.path && (_.sourcePath = S.path);
        } else if (g && te && te.has(b)) {
          const S = te.get(b);
          let v = null;
          if (typeof S == "string" ? v = ee(String(S)) : S && typeof S == "object" && (v = ee(String(S.default || ""))), _ = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, v && g.has(v)) {
            const T = g.get(v);
            T && T.title && (_.title = T.title, _._titleSource = "path"), T && T.excerpt && (_.excerpt = T.excerpt), _.sourcePath = v;
          }
        }
        _ || (_ = { loc: l + "?page=" + encodeURIComponent(b), slug: b, title: qi(b) }, _._titleSource = "humanize"), m.has(b) || (h.push(_), m.set(b, _));
      } catch {
      }
  } catch {
  }
  const y = [];
  try {
    const m = /* @__PURE__ */ new Set();
    for (const w of h)
      try {
        if (!w || !w.slug) continue;
        const b = String(w.slug), _ = String(b).split("::")[0];
        if (c.has(_) || b.indexOf("::") !== -1 || m.has(b)) continue;
        m.add(b), y.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Je(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(y.map((m) => ({ slug: m.slug, title: m.title, titleSource: m._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let w = 0;
    const b = y.length, _ = Array.from({ length: Math.min(4, b) }).map(async () => {
      for (; ; ) {
        const S = w++;
        if (S >= b) break;
        const v = y[S];
        try {
          if (!v || !v.slug) continue;
          const T = String(v.slug).split("::")[0];
          if (c.has(T) || v._titleSource === "index") continue;
          let X = null;
          try {
            if (te && te.has(v.slug)) {
              const P = te.get(v.slug);
              typeof P == "string" ? X = ee(String(P)) : P && typeof P == "object" && (X = ee(String(P.default || "")));
            }
            !X && v.sourcePath && (X = v.sourcePath);
          } catch {
            continue;
          }
          if (!X || u.has(X) || !d(X)) continue;
          try {
            const P = await Te(X, e && e.contentBase ? e.contentBase : void 0);
            if (!P || !P.raw || P && typeof P.status == "number" && P.status === 404) continue;
            if (P && P.raw) {
              const ie = (P.raw || "").match(/^#\s+(.+)$/m), z = ie && ie[1] ? ie[1].trim() : "";
              z && (v.title = z, v._titleSource = "fetched");
            }
          } catch (P) {
            Je("[runtimeSitemap] fetch title failed for", X, P);
          }
        } catch (T) {
          Je("[runtimeSitemap] worker loop failure", T);
        }
      }
    });
    await Promise.all(_);
  } catch (m) {
    Je("[runtimeSitemap] title enrichment failed", m);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
}
function zr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${De(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function Ir(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Jr().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${De("Sitemap RSS")}</title>
`, i += `<link>${De(n)}</link>
`, i += `<description>${De("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${De(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${De(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${De(String(r.excerpt))}</description>
`), i += `<link>${De(a)}</link>
`, i += `<guid>${De(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function Nr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Jr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${De("Sitemap Atom")}</title>
`, r += `<link href="${De(n)}" />
`, r += `<updated>${De(i)}</updated>
`, r += `<id>${De(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${De(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${De(String(a.excerpt))}</summary>
`), r += `<link href="${De(s)}" />
`, r += `<id>${De(s)}</id>
`, r += `<updated>${De(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function ji(e, t = "application/xml") {
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
          i.textContent = De(e);
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
              document.body.innerHTML = "<pre>" + De(e) + "</pre>";
            } catch {
            }
          }
      } catch {
      }
    } catch {
    }
  }
}
function Hi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${De(String(i && i.loc ? i.loc : ""))}">${De(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Hn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = Ir(e) : t === "application/atom+xml" ? i = Nr(e) : t === "text/html" ? i = Hi(e) : i = zr(e), ji(i, t);
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
          r.mimeType === "application/rss+xml" ? a = Ir(r.finalJson) : r.mimeType === "application/atom+xml" ? a = Nr(r.finalJson) : r.mimeType === "text/html" ? a = Hi(r.finalJson) : a = zr(r.finalJson);
          try {
            ji(a, r.mimeType);
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
async function Pl(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let f = !0;
        for (const h of c.keys()) h !== "sitemap" && (f = !1);
        f && (t = !0);
      }
      if (c.has("rss")) {
        let f = !0;
        for (const h of c.keys()) h !== "rss" && (f = !1);
        f && (n = !0);
      }
      if (c.has("atom")) {
        let f = !0;
        for (const h of c.keys()) h !== "atom" && (f = !1);
        f && (i = !0);
      }
    } catch {
    }
    if (!t && !n && !i) {
      const f = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!f || (t = /^(sitemap|sitemap\.xml)$/i.test(f), n = /^(rss|rss\.xml)$/i.test(f), i = /^(atom|atom\.xml)$/i.test(f), r = /^(sitemap|sitemap\.html)$/i.test(f), !t && !n && !i && !r)) return !1;
    }
    let a = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof $t == "function")
        try {
          const c = await $t({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const f = /* @__PURE__ */ new Map();
              try {
                for (const h of e.index)
                  try {
                    h && h.slug && f.set(String(h.slug), h);
                  } catch {
                  }
                for (const h of c)
                  try {
                    h && h.slug && f.set(String(h.slug), h);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(f.values());
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
          for (const f of e.index)
            try {
              if (!f || !f.slug) continue;
              const h = String(f.slug).split("::")[0];
              if (!c.has(h)) c.set(h, f);
              else {
                const p = c.get(h);
                p && String(p.slug || "").indexOf("::") !== -1 && String(f.slug || "").indexOf("::") === -1 && c.set(h, f);
              }
            } catch {
            }
          try {
            Je(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            Je(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(c.size));
          }
        } catch (c) {
          on("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof jt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let f = null;
        try {
          typeof $t == "function" && (f = await $t({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          f = null;
        }
        if (Array.isArray(f) && f.length)
          a = f;
        else {
          const h = typeof e.indexDepth == "number" ? e.indexDepth : 3, p = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, g = [];
          e && e.homePage && g.push(e.homePage), e && e.navigationPage && g.push(e.navigationPage), a = await jt(e && e.contentBase ? e.contentBase : void 0, h, p, g.length ? g : void 0);
        }
      } catch (c) {
        on("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(re) && re.length ? re : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Je(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(c));
      } catch {
      }
      try {
        Je(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const f = typeof e.indexDepth == "number" ? e.indexDepth : 3, h = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let p = null;
      try {
        const g = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof g == "function")
          try {
            p = await g(e && e.contentBase ? e.contentBase : void 0, f, h);
          } catch {
            p = null;
          }
      } catch {
        p = null;
      }
      if ((!p || !p.length) && typeof jt == "function")
        try {
          p = await jt(e && e.contentBase ? e.contentBase : void 0, f, h, c.length ? c : void 0);
        } catch {
          p = null;
        }
      if (Array.isArray(p) && p.length) {
        const g = /* @__PURE__ */ new Map();
        try {
          for (const d of a)
            try {
              d && d.slug && g.set(String(d.slug), d);
            } catch {
            }
          for (const d of p)
            try {
              d && d.slug && g.set(String(d.slug), d);
            } catch {
            }
        } catch {
        }
        a = Array.from(g.values());
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
        Je(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(c));
      } catch {
      }
      try {
        Je(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await ei(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), f = Array.isArray(l && l.entries) ? l.entries : [];
      for (const h of f)
        try {
          let p = null;
          if (h && h.slug) p = String(h.slug);
          else if (h && h.loc)
            try {
              p = new URL(String(h.loc)).searchParams.get("page");
            } catch {
            }
          if (!p) continue;
          const g = String(p).split("::")[0];
          if (!c.has(g)) {
            c.add(g);
            const d = Object.assign({}, h);
            d.baseSlug = g, o.push(d);
          }
        } catch {
        }
      try {
        Je(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(o, null, 2));
      } catch {
        Je(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(o.length));
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
      let f = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (f = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (f > c) {
        try {
          Je("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", f, c);
        } catch {
        }
        return !0;
      }
      return Hn(u, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(u && u.entries) ? u.entries.length : 0;
      let f = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (f = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (f > c) {
        try {
          Je("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", f, c);
        } catch {
        }
        return !0;
      }
      return Hn(u, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(u && u.entries) ? u.entries.length : 0;
      let f = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (f = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (f > c) {
        try {
          Je("[runtimeSitemap] skip XML write: existing rendered sitemap larger", f, c);
        } catch {
        }
        return !0;
      }
      return Hn(u, "application/xml"), !0;
    }
    if (r)
      try {
        const f = (Array.isArray(u && u.entries) ? u.entries : []).length;
        let h = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (h = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (h > f) {
          try {
            Je("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", h, f);
          } catch {
          }
          return !0;
        }
        return Hn(u, "text/html"), !0;
      } catch (c) {
        return on("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return on("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function $l(e = {}) {
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
    const i = await ei(Object.assign({}, e, { index: n }));
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
            const f = Object.assign({}, o);
            f.baseSlug = c, r.push(f);
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
  exposeSitemapGlobals: $l,
  generateAtomXml: Nr,
  generateRssXml: Ir,
  generateSitemapJson: ei,
  generateSitemapXml: zr,
  handleSitemapRequest: Pl
}, Symbol.toStringTag, { value: "Module" }));
export {
  Wi as BAD_LANGUAGES,
  Ee as SUPPORTED_HLJS_MAP,
  Ol as _clearHooks,
  Br as addHook,
  jl as default,
  ps as ensureBulma,
  Ll as getVersion,
  jl as initCMS,
  Qi as loadL10nFile,
  Zi as loadSupportedLanguages,
  ds as observeCodeBlocks,
  Il as onNavBuild,
  zl as onPageLoad,
  xn as registerLanguage,
  gi as runHooks,
  Bl as setHighlightTheme,
  Ki as setLang,
  gs as setStyle,
  ql as setThemeVars,
  ln as t,
  Nl as transformHtml
};
