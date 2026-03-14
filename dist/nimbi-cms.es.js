const wt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function yn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(wt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  wt[t].push(e);
}
function Ka(t) {
  yn("onPageLoad", t);
}
function Va(t) {
  yn("onNavBuild", t);
}
function Ja(t) {
  yn("transformHtml", t);
}
async function Xn(t, e) {
  const n = wt[t] || [];
  for (const s of n)
    try {
      await s(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function el() {
  Object.keys(wt).forEach((t) => {
    wt[t].length = 0;
  });
}
function kr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var rn, Yn;
function Xs() {
  if (Yn) return rn;
  Yn = 1;
  function t(p) {
    return p instanceof Map ? p.clear = p.delete = p.set = function() {
      throw new Error("map is read-only");
    } : p instanceof Set && (p.add = p.clear = p.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(p), Object.getOwnPropertyNames(p).forEach((x) => {
      const A = p[x], U = typeof A;
      (U === "object" || U === "function") && !Object.isFrozen(A) && t(A);
    }), p;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(x) {
      x.data === void 0 && (x.data = {}), this.data = x.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(p) {
    return p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(p, ...x) {
    const A = /* @__PURE__ */ Object.create(null);
    for (const U in p)
      A[U] = p[U];
    return x.forEach(function(U) {
      for (const ce in U)
        A[ce] = U[ce];
    }), /** @type {T} */
    A;
  }
  const r = "</span>", i = (p) => !!p.scope, a = (p, { prefix: x }) => {
    if (p.startsWith("language:"))
      return p.replace("language:", "language-");
    if (p.includes(".")) {
      const A = p.split(".");
      return [
        `${x}${A.shift()}`,
        ...A.map((U, ce) => `${U}${"_".repeat(ce + 1)}`)
      ].join(" ");
    }
    return `${x}${p}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(x, A) {
      this.buffer = "", this.classPrefix = A.classPrefix, x.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(x) {
      this.buffer += n(x);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(x) {
      if (!i(x)) return;
      const A = a(
        x.scope,
        { prefix: this.classPrefix }
      );
      this.span(A);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(x) {
      i(x) && (this.buffer += r);
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
    span(x) {
      this.buffer += `<span class="${x}">`;
    }
  }
  const l = (p = {}) => {
    const x = { children: [] };
    return Object.assign(x, p), x;
  };
  class u {
    constructor() {
      this.rootNode = l(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(x) {
      this.top.children.push(x);
    }
    /** @param {string} scope */
    openNode(x) {
      const A = l({ scope: x });
      this.add(A), this.stack.push(A);
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
    walk(x) {
      return this.constructor._walk(x, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(x, A) {
      return typeof A == "string" ? x.addText(A) : A.children && (x.openNode(A), A.children.forEach((U) => this._walk(x, U)), x.closeNode(A)), x;
    }
    /**
     * @param {Node} node
     */
    static _collapse(x) {
      typeof x != "string" && x.children && (x.children.every((A) => typeof A == "string") ? x.children = [x.children.join("")] : x.children.forEach((A) => {
        u._collapse(A);
      }));
    }
  }
  class h extends u {
    /**
     * @param {*} options
     */
    constructor(x) {
      super(), this.options = x;
    }
    /**
     * @param {string} text
     */
    addText(x) {
      x !== "" && this.add(x);
    }
    /** @param {string} scope */
    startScope(x) {
      this.openNode(x);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(x, A) {
      const U = x.root;
      A && (U.scope = `language:${A}`), this.add(U);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function c(p) {
    return p ? typeof p == "string" ? p : p.source : null;
  }
  function d(p) {
    return m("(?=", p, ")");
  }
  function f(p) {
    return m("(?:", p, ")*");
  }
  function g(p) {
    return m("(?:", p, ")?");
  }
  function m(...p) {
    return p.map((A) => c(A)).join("");
  }
  function w(p) {
    const x = p[p.length - 1];
    return typeof x == "object" && x.constructor === Object ? (p.splice(p.length - 1, 1), x) : {};
  }
  function y(...p) {
    return "(" + (w(p).capture ? "" : "?:") + p.map((U) => c(U)).join("|") + ")";
  }
  function S(p) {
    return new RegExp(p.toString() + "|").exec("").length - 1;
  }
  function N(p, x) {
    const A = p && p.exec(x);
    return A && A.index === 0;
  }
  const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function B(p, { joinWith: x }) {
    let A = 0;
    return p.map((U) => {
      A += 1;
      const ce = A;
      let ue = c(U), $ = "";
      for (; ue.length > 0; ) {
        const L = _.exec(ue);
        if (!L) {
          $ += ue;
          break;
        }
        $ += ue.substring(0, L.index), ue = ue.substring(L.index + L[0].length), L[0][0] === "\\" && L[1] ? $ += "\\" + String(Number(L[1]) + ce) : ($ += L[0], L[0] === "(" && A++);
      }
      return $;
    }).map((U) => `(${U})`).join(x);
  }
  const I = /\b\B/, te = "[a-zA-Z]\\w*", le = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", J = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", F = "\\b(0b[01]+)", C = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Q = (p = {}) => {
    const x = /^#![ ]*\//;
    return p.binary && (p.begin = m(
      x,
      /.*\b/,
      p.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: x,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (A, U) => {
        A.index !== 0 && U.ignoreMatch();
      }
    }, p);
  }, M = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, v = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [M]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [M]
  }, R = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, k = function(p, x, A = {}) {
    const U = s(
      {
        scope: "comment",
        begin: p,
        end: x,
        contains: []
      },
      A
    );
    U.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const ce = y(
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
    return U.contains.push(
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
        begin: m(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          ce,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), U;
  }, z = k("//", "$"), X = k("/\\*", "\\*/"), ae = k("#", "$"), Ee = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, Se = {
    scope: "number",
    begin: J,
    relevance: 0
  }, we = {
    scope: "number",
    begin: F,
    relevance: 0
  }, fe = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      M,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [M]
      }
    ]
  }, Re = {
    scope: "title",
    begin: te,
    relevance: 0
  }, Oe = {
    scope: "title",
    begin: le,
    relevance: 0
  }, us = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + le,
    relevance: 0
  };
  var vt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: v,
    BACKSLASH_ESCAPE: M,
    BINARY_NUMBER_MODE: we,
    BINARY_NUMBER_RE: F,
    COMMENT: k,
    C_BLOCK_COMMENT_MODE: X,
    C_LINE_COMMENT_MODE: z,
    C_NUMBER_MODE: Se,
    C_NUMBER_RE: J,
    END_SAME_AS_BEGIN: function(p) {
      return Object.assign(
        p,
        {
          /** @type {ModeCallback} */
          "on:begin": (x, A) => {
            A.data._beginMatch = x[1];
          },
          /** @type {ModeCallback} */
          "on:end": (x, A) => {
            A.data._beginMatch !== x[1] && A.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ae,
    IDENT_RE: te,
    MATCH_NOTHING_RE: I,
    METHOD_GUARD: us,
    NUMBER_MODE: Ee,
    NUMBER_RE: ne,
    PHRASAL_WORDS_MODE: R,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: fe,
    RE_STARTERS_RE: C,
    SHEBANG: Q,
    TITLE_MODE: Re,
    UNDERSCORE_IDENT_RE: le,
    UNDERSCORE_TITLE_MODE: Oe
  });
  function hs(p, x) {
    p.input[p.index - 1] === "." && x.ignoreMatch();
  }
  function ps(p, x) {
    p.className !== void 0 && (p.scope = p.className, delete p.className);
  }
  function ds(p, x) {
    x && p.beginKeywords && (p.begin = "\\b(" + p.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", p.__beforeBegin = hs, p.keywords = p.keywords || p.beginKeywords, delete p.beginKeywords, p.relevance === void 0 && (p.relevance = 0));
  }
  function fs(p, x) {
    Array.isArray(p.illegal) && (p.illegal = y(...p.illegal));
  }
  function gs(p, x) {
    if (p.match) {
      if (p.begin || p.end) throw new Error("begin & end are not supported with match");
      p.begin = p.match, delete p.match;
    }
  }
  function ms(p, x) {
    p.relevance === void 0 && (p.relevance = 1);
  }
  const ws = (p, x) => {
    if (!p.beforeMatch) return;
    if (p.starts) throw new Error("beforeMatch cannot be used with starts");
    const A = Object.assign({}, p);
    Object.keys(p).forEach((U) => {
      delete p[U];
    }), p.keywords = A.keywords, p.begin = m(A.beforeMatch, d(A.begin)), p.starts = {
      relevance: 0,
      contains: [
        Object.assign(A, { endsParent: !0 })
      ]
    }, p.relevance = 0, delete A.beforeMatch;
  }, bs = [
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
  ], ks = "keyword";
  function Pn(p, x, A = ks) {
    const U = /* @__PURE__ */ Object.create(null);
    return typeof p == "string" ? ce(A, p.split(" ")) : Array.isArray(p) ? ce(A, p) : Object.keys(p).forEach(function(ue) {
      Object.assign(
        U,
        Pn(p[ue], x, ue)
      );
    }), U;
    function ce(ue, $) {
      x && ($ = $.map((L) => L.toLowerCase())), $.forEach(function(L) {
        const D = L.split("|");
        U[D[0]] = [ue, ys(D[0], D[1])];
      });
    }
  }
  function ys(p, x) {
    return x ? Number(x) : xs(p) ? 0 : 1;
  }
  function xs(p) {
    return bs.includes(p.toLowerCase());
  }
  const In = {}, Qe = (p) => {
    console.error(p);
  }, zn = (p, ...x) => {
    console.log(`WARN: ${p}`, ...x);
  }, Je = (p, x) => {
    In[`${p}/${x}`] || (console.log(`Deprecated as of ${p}. ${x}`), In[`${p}/${x}`] = !0);
  }, Et = new Error();
  function Bn(p, x, { key: A }) {
    let U = 0;
    const ce = p[A], ue = {}, $ = {};
    for (let L = 1; L <= x.length; L++)
      $[L + U] = ce[L], ue[L + U] = !0, U += S(x[L - 1]);
    p[A] = $, p[A]._emit = ue, p[A]._multi = !0;
  }
  function Ss(p) {
    if (Array.isArray(p.begin)) {
      if (p.skip || p.excludeBegin || p.returnBegin)
        throw Qe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Et;
      if (typeof p.beginScope != "object" || p.beginScope === null)
        throw Qe("beginScope must be object"), Et;
      Bn(p, p.begin, { key: "beginScope" }), p.begin = B(p.begin, { joinWith: "" });
    }
  }
  function vs(p) {
    if (Array.isArray(p.end)) {
      if (p.skip || p.excludeEnd || p.returnEnd)
        throw Qe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Et;
      if (typeof p.endScope != "object" || p.endScope === null)
        throw Qe("endScope must be object"), Et;
      Bn(p, p.end, { key: "endScope" }), p.end = B(p.end, { joinWith: "" });
    }
  }
  function Es(p) {
    p.scope && typeof p.scope == "object" && p.scope !== null && (p.beginScope = p.scope, delete p.scope);
  }
  function Rs(p) {
    Es(p), typeof p.beginScope == "string" && (p.beginScope = { _wrap: p.beginScope }), typeof p.endScope == "string" && (p.endScope = { _wrap: p.endScope }), Ss(p), vs(p);
  }
  function As(p) {
    function x($, L) {
      return new RegExp(
        c($),
        "m" + (p.case_insensitive ? "i" : "") + (p.unicodeRegex ? "u" : "") + (L ? "g" : "")
      );
    }
    class A {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(L, D) {
        D.position = this.position++, this.matchIndexes[this.matchAt] = D, this.regexes.push([D, L]), this.matchAt += S(L) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const L = this.regexes.map((D) => D[1]);
        this.matcherRe = x(B(L, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(L) {
        this.matcherRe.lastIndex = this.lastIndex;
        const D = this.matcherRe.exec(L);
        if (!D)
          return null;
        const de = D.findIndex((st, Kt) => Kt > 0 && st !== void 0), he = this.matchIndexes[de];
        return D.splice(0, de), Object.assign(D, he);
      }
    }
    class U {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(L) {
        if (this.multiRegexes[L]) return this.multiRegexes[L];
        const D = new A();
        return this.rules.slice(L).forEach(([de, he]) => D.addRule(de, he)), D.compile(), this.multiRegexes[L] = D, D;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(L, D) {
        this.rules.push([L, D]), D.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(L) {
        const D = this.getMatcher(this.regexIndex);
        D.lastIndex = this.lastIndex;
        let de = D.exec(L);
        if (this.resumingScanAtSamePosition() && !(de && de.index === this.lastIndex)) {
          const he = this.getMatcher(0);
          he.lastIndex = this.lastIndex + 1, de = he.exec(L);
        }
        return de && (this.regexIndex += de.position + 1, this.regexIndex === this.count && this.considerAll()), de;
      }
    }
    function ce($) {
      const L = new U();
      return $.contains.forEach((D) => L.addRule(D.begin, { rule: D, type: "begin" })), $.terminatorEnd && L.addRule($.terminatorEnd, { type: "end" }), $.illegal && L.addRule($.illegal, { type: "illegal" }), L;
    }
    function ue($, L) {
      const D = (
        /** @type CompiledMode */
        $
      );
      if ($.isCompiled) return D;
      [
        ps,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        gs,
        Rs,
        ws
      ].forEach((he) => he($, L)), p.compilerExtensions.forEach((he) => he($, L)), $.__beforeBegin = null, [
        ds,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        fs,
        // default to 1 relevance if not specified
        ms
      ].forEach((he) => he($, L)), $.isCompiled = !0;
      let de = null;
      return typeof $.keywords == "object" && $.keywords.$pattern && ($.keywords = Object.assign({}, $.keywords), de = $.keywords.$pattern, delete $.keywords.$pattern), de = de || /\w+/, $.keywords && ($.keywords = Pn($.keywords, p.case_insensitive)), D.keywordPatternRe = x(de, !0), L && ($.begin || ($.begin = /\B|\b/), D.beginRe = x(D.begin), !$.end && !$.endsWithParent && ($.end = /\B|\b/), $.end && (D.endRe = x(D.end)), D.terminatorEnd = c(D.end) || "", $.endsWithParent && L.terminatorEnd && (D.terminatorEnd += ($.end ? "|" : "") + L.terminatorEnd)), $.illegal && (D.illegalRe = x(
        /** @type {RegExp | string} */
        $.illegal
      )), $.contains || ($.contains = []), $.contains = [].concat(...$.contains.map(function(he) {
        return Ts(he === "self" ? $ : he);
      })), $.contains.forEach(function(he) {
        ue(
          /** @type Mode */
          he,
          D
        );
      }), $.starts && ue($.starts, L), D.matcher = ce(D), D;
    }
    if (p.compilerExtensions || (p.compilerExtensions = []), p.contains && p.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return p.classNameAliases = s(p.classNameAliases || {}), ue(
      /** @type Mode */
      p
    );
  }
  function On(p) {
    return p ? p.endsWithParent || On(p.starts) : !1;
  }
  function Ts(p) {
    return p.variants && !p.cachedVariants && (p.cachedVariants = p.variants.map(function(x) {
      return s(p, { variants: null }, x);
    })), p.cachedVariants ? p.cachedVariants : On(p) ? s(p, { starts: p.starts ? s(p.starts) : null }) : Object.isFrozen(p) ? s(p) : p;
  }
  var Cs = "11.11.1";
  class _s extends Error {
    constructor(x, A) {
      super(x), this.name = "HTMLInjectionError", this.html = A;
    }
  }
  const Yt = n, Nn = s, Dn = /* @__PURE__ */ Symbol("nomatch"), Ls = 7, qn = function(p) {
    const x = /* @__PURE__ */ Object.create(null), A = /* @__PURE__ */ Object.create(null), U = [];
    let ce = !0;
    const ue = "Could not find the language '{}', did you forget to load/include a language module?", $ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let L = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: h
    };
    function D(E) {
      return L.noHighlightRe.test(E);
    }
    function de(E) {
      let O = E.className + " ";
      O += E.parentNode ? E.parentNode.className : "";
      const G = L.languageDetectRe.exec(O);
      if (G) {
        const se = Ue(G[1]);
        return se || (zn(ue.replace("{}", G[1])), zn("Falling back to no-highlight mode for this block.", E)), se ? G[1] : "no-highlight";
      }
      return O.split(/\s+/).find((se) => D(se) || Ue(se));
    }
    function he(E, O, G) {
      let se = "", pe = "";
      typeof O == "object" ? (se = E, G = O.ignoreIllegals, pe = O.language) : (Je("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Je("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), pe = E, se = O), G === void 0 && (G = !0);
      const Le = {
        code: se,
        language: pe
      };
      At("before:highlight", Le);
      const He = Le.result ? Le.result : st(Le.language, Le.code, G);
      return He.code = Le.code, At("after:highlight", He), He;
    }
    function st(E, O, G, se) {
      const pe = /* @__PURE__ */ Object.create(null);
      function Le(T, P) {
        return T.keywords[P];
      }
      function He() {
        if (!j.keywords) {
          ge.addText(ie);
          return;
        }
        let T = 0;
        j.keywordPatternRe.lastIndex = 0;
        let P = j.keywordPatternRe.exec(ie), W = "";
        for (; P; ) {
          W += ie.substring(T, P.index);
          const ee = Ie.case_insensitive ? P[0].toLowerCase() : P[0], be = Le(j, ee);
          if (be) {
            const [Ne, Qs] = be;
            if (ge.addText(W), W = "", pe[ee] = (pe[ee] || 0) + 1, pe[ee] <= Ls && (_t += Qs), Ne.startsWith("_"))
              W += P[0];
            else {
              const Gs = Ie.classNameAliases[Ne] || Ne;
              Pe(P[0], Gs);
            }
          } else
            W += P[0];
          T = j.keywordPatternRe.lastIndex, P = j.keywordPatternRe.exec(ie);
        }
        W += ie.substring(T), ge.addText(W);
      }
      function Tt() {
        if (ie === "") return;
        let T = null;
        if (typeof j.subLanguage == "string") {
          if (!x[j.subLanguage]) {
            ge.addText(ie);
            return;
          }
          T = st(j.subLanguage, ie, !0, Gn[j.subLanguage]), Gn[j.subLanguage] = /** @type {CompiledMode} */
          T._top;
        } else
          T = Vt(ie, j.subLanguage.length ? j.subLanguage : null);
        j.relevance > 0 && (_t += T.relevance), ge.__addSublanguage(T._emitter, T.language);
      }
      function Ae() {
        j.subLanguage != null ? Tt() : He(), ie = "";
      }
      function Pe(T, P) {
        T !== "" && (ge.startScope(P), ge.addText(T), ge.endScope());
      }
      function Fn(T, P) {
        let W = 1;
        const ee = P.length - 1;
        for (; W <= ee; ) {
          if (!T._emit[W]) {
            W++;
            continue;
          }
          const be = Ie.classNameAliases[T[W]] || T[W], Ne = P[W];
          be ? Pe(Ne, be) : (ie = Ne, He(), ie = ""), W++;
        }
      }
      function Wn(T, P) {
        return T.scope && typeof T.scope == "string" && ge.openNode(Ie.classNameAliases[T.scope] || T.scope), T.beginScope && (T.beginScope._wrap ? (Pe(ie, Ie.classNameAliases[T.beginScope._wrap] || T.beginScope._wrap), ie = "") : T.beginScope._multi && (Fn(T.beginScope, P), ie = "")), j = Object.create(T, { parent: { value: j } }), j;
      }
      function Zn(T, P, W) {
        let ee = N(T.endRe, W);
        if (ee) {
          if (T["on:end"]) {
            const be = new e(T);
            T["on:end"](P, be), be.isMatchIgnored && (ee = !1);
          }
          if (ee) {
            for (; T.endsParent && T.parent; )
              T = T.parent;
            return T;
          }
        }
        if (T.endsWithParent)
          return Zn(T.parent, P, W);
      }
      function Hs(T) {
        return j.matcher.regexIndex === 0 ? (ie += T[0], 1) : (nn = !0, 0);
      }
      function js(T) {
        const P = T[0], W = T.rule, ee = new e(W), be = [W.__beforeBegin, W["on:begin"]];
        for (const Ne of be)
          if (Ne && (Ne(T, ee), ee.isMatchIgnored))
            return Hs(P);
        return W.skip ? ie += P : (W.excludeBegin && (ie += P), Ae(), !W.returnBegin && !W.excludeBegin && (ie = P)), Wn(W, T), W.returnBegin ? 0 : P.length;
      }
      function Fs(T) {
        const P = T[0], W = O.substring(T.index), ee = Zn(j, T, W);
        if (!ee)
          return Dn;
        const be = j;
        j.endScope && j.endScope._wrap ? (Ae(), Pe(P, j.endScope._wrap)) : j.endScope && j.endScope._multi ? (Ae(), Fn(j.endScope, T)) : be.skip ? ie += P : (be.returnEnd || be.excludeEnd || (ie += P), Ae(), be.excludeEnd && (ie = P));
        do
          j.scope && ge.closeNode(), !j.skip && !j.subLanguage && (_t += j.relevance), j = j.parent;
        while (j !== ee.parent);
        return ee.starts && Wn(ee.starts, T), be.returnEnd ? 0 : P.length;
      }
      function Ws() {
        const T = [];
        for (let P = j; P !== Ie; P = P.parent)
          P.scope && T.unshift(P.scope);
        T.forEach((P) => ge.openNode(P));
      }
      let Ct = {};
      function Qn(T, P) {
        const W = P && P[0];
        if (ie += T, W == null)
          return Ae(), 0;
        if (Ct.type === "begin" && P.type === "end" && Ct.index === P.index && W === "") {
          if (ie += O.slice(P.index, P.index + 1), !ce) {
            const ee = new Error(`0 width match regex (${E})`);
            throw ee.languageName = E, ee.badRule = Ct.rule, ee;
          }
          return 1;
        }
        if (Ct = P, P.type === "begin")
          return js(P);
        if (P.type === "illegal" && !G) {
          const ee = new Error('Illegal lexeme "' + W + '" for mode "' + (j.scope || "<unnamed>") + '"');
          throw ee.mode = j, ee;
        } else if (P.type === "end") {
          const ee = Fs(P);
          if (ee !== Dn)
            return ee;
        }
        if (P.type === "illegal" && W === "")
          return ie += `
`, 1;
        if (tn > 1e5 && tn > P.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ie += W, W.length;
      }
      const Ie = Ue(E);
      if (!Ie)
        throw Qe(ue.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const Zs = As(Ie);
      let en = "", j = se || Zs;
      const Gn = {}, ge = new L.__emitter(L);
      Ws();
      let ie = "", _t = 0, Ge = 0, tn = 0, nn = !1;
      try {
        if (Ie.__emitTokens)
          Ie.__emitTokens(O, ge);
        else {
          for (j.matcher.considerAll(); ; ) {
            tn++, nn ? nn = !1 : j.matcher.considerAll(), j.matcher.lastIndex = Ge;
            const T = j.matcher.exec(O);
            if (!T) break;
            const P = O.substring(Ge, T.index), W = Qn(P, T);
            Ge = T.index + W;
          }
          Qn(O.substring(Ge));
        }
        return ge.finalize(), en = ge.toHTML(), {
          language: E,
          value: en,
          relevance: _t,
          illegal: !1,
          _emitter: ge,
          _top: j
        };
      } catch (T) {
        if (T.message && T.message.includes("Illegal"))
          return {
            language: E,
            value: Yt(O),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: T.message,
              index: Ge,
              context: O.slice(Ge - 100, Ge + 100),
              mode: T.mode,
              resultSoFar: en
            },
            _emitter: ge
          };
        if (ce)
          return {
            language: E,
            value: Yt(O),
            illegal: !1,
            relevance: 0,
            errorRaised: T,
            _emitter: ge,
            _top: j
          };
        throw T;
      }
    }
    function Kt(E) {
      const O = {
        value: Yt(E),
        illegal: !1,
        relevance: 0,
        _top: $,
        _emitter: new L.__emitter(L)
      };
      return O._emitter.addText(E), O;
    }
    function Vt(E, O) {
      O = O || L.languages || Object.keys(x);
      const G = Kt(E), se = O.filter(Ue).filter(jn).map(
        (Ae) => st(Ae, E, !1)
      );
      se.unshift(G);
      const pe = se.sort((Ae, Pe) => {
        if (Ae.relevance !== Pe.relevance) return Pe.relevance - Ae.relevance;
        if (Ae.language && Pe.language) {
          if (Ue(Ae.language).supersetOf === Pe.language)
            return 1;
          if (Ue(Pe.language).supersetOf === Ae.language)
            return -1;
        }
        return 0;
      }), [Le, He] = pe, Tt = Le;
      return Tt.secondBest = He, Tt;
    }
    function Ms(E, O, G) {
      const se = O && A[O] || G;
      E.classList.add("hljs"), E.classList.add(`language-${se}`);
    }
    function Jt(E) {
      let O = null;
      const G = de(E);
      if (D(G)) return;
      if (At(
        "before:highlightElement",
        { el: E, language: G }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && (L.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), L.throwUnescapedHTML))
        throw new _s(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      O = E;
      const se = O.textContent, pe = G ? he(se, { language: G, ignoreIllegals: !0 }) : Vt(se);
      E.innerHTML = pe.value, E.dataset.highlighted = "yes", Ms(E, G, pe.language), E.result = {
        language: pe.language,
        // TODO: remove with version 11.0
        re: pe.relevance,
        relevance: pe.relevance
      }, pe.secondBest && (E.secondBest = {
        language: pe.secondBest.language,
        relevance: pe.secondBest.relevance
      }), At("after:highlightElement", { el: E, result: pe, text: se });
    }
    function $s(E) {
      L = Nn(L, E);
    }
    const Ps = () => {
      Rt(), Je("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Is() {
      Rt(), Je("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Un = !1;
    function Rt() {
      function E() {
        Rt();
      }
      if (document.readyState === "loading") {
        Un || window.addEventListener("DOMContentLoaded", E, !1), Un = !0;
        return;
      }
      document.querySelectorAll(L.cssSelector).forEach(Jt);
    }
    function zs(E, O) {
      let G = null;
      try {
        G = O(p);
      } catch (se) {
        if (Qe("Language definition for '{}' could not be registered.".replace("{}", E)), ce)
          Qe(se);
        else
          throw se;
        G = $;
      }
      G.name || (G.name = E), x[E] = G, G.rawDefinition = O.bind(null, p), G.aliases && Hn(G.aliases, { languageName: E });
    }
    function Bs(E) {
      delete x[E];
      for (const O of Object.keys(A))
        A[O] === E && delete A[O];
    }
    function Os() {
      return Object.keys(x);
    }
    function Ue(E) {
      return E = (E || "").toLowerCase(), x[E] || x[A[E]];
    }
    function Hn(E, { languageName: O }) {
      typeof E == "string" && (E = [E]), E.forEach((G) => {
        A[G.toLowerCase()] = O;
      });
    }
    function jn(E) {
      const O = Ue(E);
      return O && !O.disableAutodetect;
    }
    function Ns(E) {
      E["before:highlightBlock"] && !E["before:highlightElement"] && (E["before:highlightElement"] = (O) => {
        E["before:highlightBlock"](
          Object.assign({ block: O.el }, O)
        );
      }), E["after:highlightBlock"] && !E["after:highlightElement"] && (E["after:highlightElement"] = (O) => {
        E["after:highlightBlock"](
          Object.assign({ block: O.el }, O)
        );
      });
    }
    function Ds(E) {
      Ns(E), U.push(E);
    }
    function qs(E) {
      const O = U.indexOf(E);
      O !== -1 && U.splice(O, 1);
    }
    function At(E, O) {
      const G = E;
      U.forEach(function(se) {
        se[G] && se[G](O);
      });
    }
    function Us(E) {
      return Je("10.7.0", "highlightBlock will be removed entirely in v12.0"), Je("10.7.0", "Please use highlightElement now."), Jt(E);
    }
    Object.assign(p, {
      highlight: he,
      highlightAuto: Vt,
      highlightAll: Rt,
      highlightElement: Jt,
      // TODO: Remove with v12 API
      highlightBlock: Us,
      configure: $s,
      initHighlighting: Ps,
      initHighlightingOnLoad: Is,
      registerLanguage: zs,
      unregisterLanguage: Bs,
      listLanguages: Os,
      getLanguage: Ue,
      registerAliases: Hn,
      autoDetection: jn,
      inherit: Nn,
      addPlugin: Ds,
      removePlugin: qs
    }), p.debugMode = function() {
      ce = !1;
    }, p.safeMode = function() {
      ce = !0;
    }, p.versionString = Cs, p.regex = {
      concat: m,
      lookahead: d,
      either: y,
      optional: g,
      anyNumberOfTimes: f
    };
    for (const E in vt)
      typeof vt[E] == "object" && t(vt[E]);
    return Object.assign(p, vt), p;
  }, et = qn({});
  return et.newInstance = () => qn({}), rn = et, et.HighlightJS = et, et.default = et, rn;
}
var Ys = /* @__PURE__ */ Xs();
const oe = /* @__PURE__ */ kr(Ys), V = /* @__PURE__ */ new Map(), Ks = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", qe = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
}, yr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let nt = null;
const Kn = /* @__PURE__ */ new Map(), Vs = 300 * 1e3;
async function xr(t = Ks) {
  if (t)
    return nt || (nt = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const s = (await e.text()).split(/\r?\n/);
        let r = -1;
        for (let u = 0; u < s.length; u++)
          if (/\|\s*Language\s*\|/i.test(s[u])) {
            r = u;
            break;
          }
        if (r === -1) return;
        const i = s[r].replace(/^\||\|$/g, "").split("|").map((u) => u.trim().toLowerCase());
        let a = i.findIndex((u) => /alias|aliases|equivalent|alt|alternates?/i.test(u));
        a === -1 && (a = 1);
        let o = i.findIndex((u) => /file|filename|module|module name|module-name|short|slug/i.test(u));
        if (o === -1) {
          const u = i.findIndex((h) => /language/i.test(h));
          o = u !== -1 ? u : 0;
        }
        let l = [];
        for (let u = r + 1; u < s.length; u++) {
          const h = s[u].trim();
          if (!h || !h.startsWith("|")) break;
          const c = h.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (c.every((w) => /^-+$/.test(w))) continue;
          const d = c;
          if (!d.length) continue;
          const g = (d[o] || d[0] || "").toString().trim().toLowerCase();
          if (!g || /^-+$/.test(g)) continue;
          V.set(g, g);
          const m = d[a] || "";
          if (m) {
            const w = String(m).split(",").map((y) => y.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const S = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              S && /[a-z0-9]/i.test(S) && (V.set(S, S), l.push(S));
            }
          }
        }
        try {
          const u = [];
          for (const h of l) {
            const c = String(h || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            c && /[a-z0-9]/i.test(c) ? u.push(c) : V.delete(h);
          }
          l = u;
        } catch (u) {
          console.warn("[codeblocksManager] cleanup aliases failed", u);
        }
        try {
          let u = 0;
          for (const h of Array.from(V.keys())) {
            if (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) {
              V.delete(h), u++;
              continue;
            }
            if (/^[:]+/.test(h)) {
              const c = h.replace(/^[:]+/, "");
              if (c && /[a-z0-9]/i.test(c)) {
                const d = V.get(h);
                V.delete(h), V.set(c, d);
              } else
                V.delete(h), u++;
            }
          }
          for (const [h, c] of Array.from(V.entries()))
            (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) && (V.delete(h), u++);
          try {
            const h = ":---------------------";
            V.has(h) && (V.delete(h), u++);
          } catch (h) {
            console.warn("[codeblocksManager] remove sep key failed", h);
          }
          try {
            const h = Array.from(V.keys()).sort();
          } catch (h) {
            console.warn("[codeblocksManager] compute supported keys failed", h);
          }
        } catch (u) {
          console.warn("[codeblocksManager] ignored error", u);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), nt);
}
const sn = /* @__PURE__ */ new Set();
async function bt(t, e) {
  if (nt || (async () => {
    try {
      await xr();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (yr.has(n)) return !1;
  if (V.size && !V.has(n)) {
    const r = qe;
    if (!r[n] && !r[t])
      return !1;
  }
  if (sn.has(t)) return !0;
  const s = qe;
  try {
    const r = (e || t || "").toString().replace(/\.js$/i, "").trim(), i = Array.from(new Set([
      r,
      t,
      s[r],
      s[t]
    ].filter(Boolean))).map((l) => String(l).toLowerCase()).filter((l) => l && l !== "undefined");
    let a = null, o = null;
    for (const l of i)
      try {
        const u = Date.now(), h = Kn.get(l);
        if (h) {
          if (h.ok === !1 && u - (h.ts || 0) < Vs)
            a = null;
          else if (h.module)
            a = h.module;
          else if (h.promise)
            try {
              a = await h.promise;
            } catch {
              a = null;
            }
        } else {
          const c = { promise: null, module: null, ok: null, ts: 0 };
          Kn.set(l, c), c.promise = (async () => {
            try {
              try {
                return await import(
                  /* @vite-ignore */
                  `highlight.js/lib/languages/${l}.js`
                );
              } catch {
                try {
                  const f = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${l}.js`;
                  return await new Function("u", "return import(u)")(f);
                } catch {
                  try {
                    const g = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${l}.js`;
                    return await new Function("u", "return import(u)")(g);
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
            a = await c.promise, c.module = a, c.ok = !!a, c.ts = Date.now();
          } catch {
            c.module = null, c.ok = !1, c.ts = Date.now(), a = null;
          }
        }
        if (a) {
          const c = a.default || a;
          try {
            const d = V.size && V.get(t) || l || t;
            return oe.registerLanguage(d, c), sn.add(d), d !== t && (oe.registerLanguage(t, c), sn.add(t)), !0;
          } catch (d) {
            o = d;
          }
        }
      } catch (u) {
        o = u;
      }
    if (o)
      throw o;
    return !1;
  } catch {
    return !1;
  }
}
let Lt = null;
function Js(t = document) {
  nt || (async () => {
    try {
      await xr();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = qe, s = Lt || (typeof IntersectionObserver > "u" ? null : (Lt = new IntersectionObserver((i, a) => {
    i.forEach((o) => {
      if (!o.isIntersecting) return;
      const l = o.target;
      try {
        a.unobserve(l);
      } catch (u) {
        console.warn("[codeblocksManager] observer unobserve failed", u);
      }
      (async () => {
        try {
          const u = l.getAttribute && l.getAttribute("class") || l.className || "", h = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (h && h[1]) {
            const c = (h[1] || "").toLowerCase(), d = e[c] || c, f = V.size && (V.get(d) || V.get(String(d).toLowerCase())) || d;
            try {
              await bt(f);
            } catch (g) {
              console.warn("[codeblocksManager] registerLanguage failed", g);
            }
            try {
              oe.highlightElement(l);
            } catch (g) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", g);
            }
          } else
            try {
              const c = l.textContent || "";
              try {
                if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                  const d = oe.highlight(c, { language: "plaintext" });
                  d && d.value && (l.innerHTML = d.value);
                }
              } catch {
                try {
                  oe.highlightElement(l);
                } catch (f) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", f);
                }
              }
            } catch (c) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", c);
            }
        } catch (u) {
          console.warn("[codeblocksManager] observer entry processing failed", u);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Lt)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    r.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", o = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (o && o[1]) {
          const l = (o[1] || "").toLowerCase(), u = e[l] || l, h = V.size && (V.get(u) || V.get(String(u).toLowerCase())) || u;
          try {
            await bt(h);
          } catch (c) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", c);
          }
        }
        try {
          oe.highlightElement(i);
        } catch (l) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
        }
      } catch (a) {
        console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error", a);
      }
    });
    return;
  }
  r.forEach((i) => {
    try {
      s.observe(i);
    } catch (a) {
      console.warn("[codeblocksManager] observe failed", a);
    }
  });
}
function tl(t, { useCdn: e = !0 } = {}) {
  const n = document.querySelector("link[data-hl-theme]");
  n && n.remove();
  let s = t || "monokai";
  if (s === "monokai")
    return;
  if (!e) {
    console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");
    return;
  }
  const r = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`, i = document.createElement("link");
  i.rel = "stylesheet", i.href = r, i.setAttribute("data-hl-theme", s), document.head.appendChild(i);
}
let an = "light";
function ei(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([s, r]) => n.setAttribute(s, r)), document.head.appendChild(n);
}
async function ti(t = "none", e = "/") {
  if (!t || t === "none") return;
  const n = [e + "bulma.css", "/bulma.css"], s = Array.from(new Set(n));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const r of s)
      try {
        const i = await fetch(r, { method: "GET" });
        if (i.ok) {
          const a = await i.text(), o = document.createElement("style");
          o.setAttribute("data-bulma-override", r), o.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + a)), document.head.appendChild(o);
          return;
        }
      } catch (i) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", i);
      }
    return;
  }
  try {
    const r = String(t).trim();
    if (!r) return;
    const i = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ei(i, { "data-bulmaswatch-theme": r });
  } catch (r) {
    console.warn("[bulmaManager] ensureBulma failed", r);
  }
}
function ni(t) {
  an = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", an), an === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function nl(t) {
  const e = document.documentElement;
  for (const [n, s] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${n}`, s);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
const Sr = {
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
}, rt = JSON.parse(JSON.stringify(Sr));
let Bt = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Bt = String(t).split("-")[0].toLowerCase();
}
Sr[Bt] || (Bt = "en");
let We = Bt;
function ot(t, e = {}) {
  const n = rt[We] || rt.en;
  let s = n && n[t] ? n[t] : rt.en[t] || "";
  for (const r of Object.keys(e))
    s = s.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return s;
}
async function vr(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const s = await fetch(n);
    if (!s.ok) return;
    const r = await s.json();
    for (const i of Object.keys(r || {}))
      rt[i] = Object.assign({}, rt[i] || {}, r[i]);
  } catch {
  }
}
function Er(t) {
  const e = String(t).split("-")[0].toLowerCase();
  We = rt[e] ? e : "en";
}
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return We;
  },
  loadL10nFile: vr,
  setLang: Er,
  t: ot
}, Symbol.toStringTag, { value: "Module" })), si = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

/**
 * Worker entrypoint for slug-related background tasks.
 *
 * Accepted messages (via \`postMessage\`):
 * - \`{ type: 'buildSearchIndex', id: string, contentBase: string }\` -> posts \`{id, result}\`
 * - \`{ type: 'crawlForSlug', id: string, slug: string, base?: string, maxQueue?: number }\` -> posts \`{id, result}\`
 *
 * On error the worker posts \`{id, error: string}\`.
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  console.debug('[slugWorker] received message', msg)
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
`;
function Rr(t, e = "worker") {
  let n = null;
  function s() {
    if (!n)
      try {
        const o = t();
        n = o || null, o && o.addEventListener("error", () => {
          try {
            n === o && (n = null, o.terminate && o.terminate());
          } catch (l) {
            console.warn("[" + e + "] worker termination failed", l);
          }
        });
      } catch (o) {
        n = null, console.warn("[" + e + "] worker init failed", o);
      }
    return n;
  }
  function r() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (o) {
      console.warn("[" + e + "] worker termination failed", o);
    }
  }
  function i(o, l = 1e3) {
    return new Promise((u, h) => {
      const c = s();
      if (!c) return h(new Error("worker unavailable"));
      const d = String(Math.random());
      o.id = d;
      let f = null;
      const g = () => {
        f && clearTimeout(f), c.removeEventListener("message", m), c.removeEventListener("error", w);
      }, m = (y) => {
        const S = y.data || {};
        S.id === d && (g(), S.error ? h(new Error(S.error)) : u(S.result));
      }, w = (y) => {
        g(), console.warn("[" + e + "] worker error event", y);
        try {
          n === c && (n = null, c.terminate && c.terminate());
        } catch (S) {
          console.warn("[" + e + "] worker termination failed", S);
        }
        h(new Error(y && y.message || "worker error"));
      };
      f = setTimeout(() => {
        g(), console.warn("[" + e + "] worker timed out");
        try {
          n === c && (n = null, c.terminate && c.terminate());
        } catch (y) {
          console.warn("[" + e + "] worker termination on timeout failed", y);
        }
        h(new Error("worker timeout"));
      }, l), c.addEventListener("message", m), c.addEventListener("error", w);
      try {
        c.postMessage(o);
      } catch (y) {
        g(), h(y);
      }
    });
  }
  return { get: s, send: i, terminate: r };
}
function ii(t) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && t) {
      const e = new Blob([t], { type: "application/javascript" }), n = URL.createObjectURL(e);
      return new Worker(n, { type: "module" });
    }
  } catch (e) {
    console.warn("[worker-manager] createWorkerFromRaw failed", e);
  }
  return null;
}
const Be = /* @__PURE__ */ new Set();
function xn(t) {
  ai(), Be.clear();
  for (const e of Te)
    e && Be.add(e);
  Vn(Z), Vn(H), xn._refreshed = !0;
}
function Vn(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Be.add(e);
}
function Jn(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, s) {
    return s && Be.add(s), e.call(this, n, s);
  };
}
let er = !1;
function ai() {
  er || (Jn(Z), Jn(H), er = !0);
}
function Ar(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function me(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function kt(t) {
  return String(t || "").replace(/\/+$/, "");
}
function Zt(t) {
  return kt(t) + "/";
}
function li(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Mt(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const r = t, i = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, a = 0, o = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = i ? Math.max(a, i.top) : a, h = (i ? Math.min(o, i.bottom) : o) + Number(e || 0);
    let c = 0;
    r && (c = r.clientHeight || (i ? i.height : 0)), c || (c = o - a);
    let d = 0.6;
    try {
      const w = r && window.getComputedStyle ? window.getComputedStyle(r) : null, y = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), S = y ? parseFloat(y) : NaN;
      !Number.isNaN(S) && S > 0 && S <= 1 && (d = S);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const f = Math.max(200, Math.floor(c * d));
    let g = !1, m = null;
    if (s.forEach((w) => {
      try {
        const y = w.getAttribute ? w.getAttribute("loading") : void 0;
        y !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const S = w.getBoundingClientRect ? w.getBoundingClientRect() : null, N = w.src || w.getAttribute && w.getAttribute("src"), _ = S && S.height > 1 ? S.height : f, B = S ? S.top : 0, I = B + _, te = !!(S && _ > 0 && B <= h && I >= l);
        te && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), li(N), g = !0), !m && S && S.top <= h && (m = { img: w, src: N, rect: S, beforeLoading: y }), n && console.log("[helpers] setEagerForAboveFoldImages:", {
          src: N,
          rect: S,
          marginPx: e,
          visibleTop: l,
          visibleBottom: h,
          beforeLoading: y,
          isAboveFold: te,
          effectiveHeight: _,
          maxImageHeight: f
        });
      } catch (y) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", y);
      }
    }), !g && m) {
      const { img: w, src: y, rect: S, beforeLoading: N } = m;
      try {
        w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), n && console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):", {
          src: y,
          rect: S,
          marginPx: e,
          visibleTop: l,
          visibleBottom: h,
          beforeLoading: N,
          fallback: !0
        });
      } catch (_) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", _);
      }
    }
  } catch (s) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", s);
  }
}
function Ot(t) {
  try {
    const e = t();
    return e && typeof e.then == "function" ? e.catch((n) => {
      console.warn("[helpers] safe swallowed error", n);
    }) : e;
  } catch (e) {
    console.warn("[helpers] safe swallowed error", e);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Ot);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const Z = /* @__PURE__ */ new Map();
let Ce = [];
function Tr(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function oi() {
  return Ce;
}
const Cr = Rr(() => ii(si), "slugManager");
function Sn() {
  return Cr.get();
}
function _r(t) {
  return Cr.send(t);
}
async function ci(t, e = 1, n = void 0) {
  if (!Sn()) return Ut(t, e, n);
  try {
    return await _r({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
  } catch (r) {
    try {
      return await Ut(t, e, n);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), r;
    }
  }
}
async function ui(t, e, n) {
  return Sn() ? _r({ type: "crawlForSlug", slug: t, base: e, maxQueue: n }) : vn(t, e, n);
}
function je(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const s = e.split("/")[0], r = Ce.includes(s);
      let i = Z.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), r ? i.langs[s] = e : i.default = e, Z.set(t, i);
    } else
      Z.set(t, e);
}
const Qt = /* @__PURE__ */ new Set();
function hi(t) {
  typeof t == "function" && Qt.add(t);
}
function pi(t) {
  typeof t == "function" && Qt.delete(t);
}
const H = /* @__PURE__ */ new Map();
let hn = {}, Te = [], Nt = "_404.md";
function pn(t) {
  t != null && (Nt = String(t || ""));
}
function di(t) {
  hn = t || {};
}
const ht = /* @__PURE__ */ new Map(), Dt = /* @__PURE__ */ new Set();
function fi() {
  ht.clear(), Dt.clear();
}
function gi(t) {
  if (!t || t.length === 0) return "";
  let e = t[0];
  for (let s = 1; s < t.length; s++) {
    const r = t[s];
    let i = 0;
    const a = Math.min(e.length, r.length);
    for (; i < a && e[i] === r[i]; ) i++;
    e = e.slice(0, i);
  }
  const n = e.lastIndexOf("/");
  return n === -1 ? e : e.slice(0, n + 1);
}
function qt(t) {
  Z.clear(), H.clear(), Te = [], Ce = Ce || [];
  const e = Object.keys(hn || {});
  if (!e.length) return;
  let n = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? n = new URL(String(t)).pathname : n = String(t || "");
      } catch (s) {
        n = String(t || ""), console.warn("[slugManager] parse contentBase failed", s);
      }
      n = Zt(n);
    }
  } catch (s) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  n || (n = gi(e));
  for (const s of e) {
    let r = s;
    n && s.startsWith(n) ? r = me(s.slice(n.length)) : r = me(s), Te.push(r);
    try {
      xn();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const i = hn[s];
    if (typeof i == "string") {
      const a = (i || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const o = re(a[1].trim());
        if (o)
          try {
            if (Ce && Ce.length) {
              const u = r.split("/")[0], h = Ce.includes(u);
              let c = Z.get(o);
              (!c || typeof c == "string") && (c = { default: typeof c == "string" ? c : void 0, langs: {} }), h ? c.langs[u] = r : c.default = r, Z.set(o, c);
            } else
              Z.set(o, r);
            H.set(r, o);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  qt();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function re(t) {
  let e = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return e = e.replace(/(?:-?)(?:md|html)$/, ""), e;
}
function yt(t) {
  if (!t || !Z.has(t)) return null;
  const e = Z.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ce && Ce.length && We && e.langs && e.langs[We])
    return e.langs[We];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const pt = /* @__PURE__ */ new Map();
function mi() {
  pt.clear();
}
let xe = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && Z.has(i)) {
      const a = yt(i) || Z.get(i);
      a && a !== t && (t = a);
    }
  } catch (i) {
    console.warn("[slugManager] slug mapping normalization failed", i);
  }
  const n = e == null ? "" : kt(String(e));
  let s = "";
  try {
    n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? s = n.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : s = (n.startsWith("/") ? "" : "/") + n.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : s = "/" + t.replace(/^\//, "");
  } catch {
    s = "/" + t.replace(/^\//, "");
  }
  if (pt.has(s))
    return pt.get(s);
  const r = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const c = `${n}/${Nt}`, d = await globalThis.fetch(c);
          if (d && typeof d.ok == "boolean" && d.ok)
            return { raw: await d.text(), status: 404 };
        } catch (c) {
          console.warn("[slugManager] fetching fallback 404 failed", c);
        }
      let h = "";
      try {
        i && typeof i.clone == "function" ? h = await i.clone().text() : i && typeof i.text == "function" ? h = await i.text() : h = "";
      } catch (c) {
        h = "", console.warn("[slugManager] reading error body failed", c);
      }
      throw console.error("fetchMarkdown failed:", { url: s, status: i ? i.status : void 0, statusText: i ? i.statusText : void 0, body: h.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await i.text(), o = a.trim().slice(0, 16).toLowerCase(), l = o.startsWith("<!doctype") || o.startsWith("<html"), u = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const h = `${n}/${Nt}`, c = await globalThis.fetch(h);
        if (c.ok)
          return { raw: await c.text(), status: 404 };
      } catch (h) {
        console.warn("[slugManager] fetching fallback 404 failed", h);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return u ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return pt.set(s, r), r;
};
function wi(t) {
  typeof t == "function" && (xe = t);
}
const Pt = /* @__PURE__ */ new Map();
let Xe = [], it = null;
async function Ut(t, e = 1, n = void 0) {
  if (Xe && Xe.length && e === 1) return Xe;
  if (it) return it;
  it = (async () => {
    const s = Array.isArray(n) ? Array.from(new Set((n || []).map((l) => me(String(l || ""))))) : null, r = (l) => {
      if (!s || !s.length) return !1;
      for (const u of s)
        if (u && (l === u || l.startsWith(u + "/")))
          return !0;
      return !1;
    };
    let i = [];
    if (Te && Te.length && (i = Array.from(Te)), !i.length)
      for (const l of Z.values())
        l && i.push(l);
    try {
      const l = await Pr(t);
      l && l.length && (i = i.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(i), u = [...i];
      for (l.size; u.length && l.size <= xt; ) {
        const h = u.shift();
        try {
          const c = await xe(h, t);
          if (c && c.raw) {
            let d = c.raw;
            const f = [], g = /\[[^\]]+\]\(([^)]+)\)/g;
            let m;
            for (; m = g.exec(d); )
              f.push(m[1]);
            const w = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; m = w.exec(d); )
              f.push(m[1]);
            for (let y of f)
              /^[a-z][a-z0-9+.-]*:/i.test(y) || (y = me(y), /\.(md|html?)(?:$|[?#])/i.test(y) && (y = y.split(/[?#]/)[0], !r(y) && (l.has(y) || (l.add(y), u.push(y), i.push(y)))));
          }
        } catch (c) {
          console.warn("[slugManager] discovery fetch failed for", h, c);
        }
      }
    } catch (l) {
      console.warn("[slugManager] discovery loop failed", l);
    }
    const a = /* @__PURE__ */ new Set();
    i = i.filter((l) => !l || a.has(l) || r(l) ? !1 : (a.add(l), !0));
    const o = [];
    for (const l of i)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(l))
        try {
          const u = await xe(l, t);
          if (u && u.raw) {
            let h = "", c = "";
            if (u.isHtml)
              try {
                const g = new DOMParser().parseFromString(u.raw, "text/html"), m = g.querySelector("title") || g.querySelector("h1");
                m && m.textContent && (h = m.textContent.trim());
                const w = g.querySelector("p");
                if (w && w.textContent && (c = w.textContent.trim()), e === 2)
                  try {
                    const y = g.querySelector("h1"), S = y && y.textContent ? y.textContent.trim() : h || "", N = (() => {
                      try {
                        if (H.has(l)) return H.get(l);
                      } catch {
                      }
                      return re(h || l);
                    })(), _ = Array.from(g.querySelectorAll("h2"));
                    for (const B of _)
                      try {
                        const I = (B.textContent || "").trim();
                        if (!I) continue;
                        const te = B.id ? B.id : re(I), le = N ? `${N}::${te}` : `${re(l)}::${te}`;
                        let ne = "", J = B.nextElementSibling;
                        for (; J && J.tagName && J.tagName.toLowerCase() === "script"; ) J = J.nextElementSibling;
                        J && J.textContent && (ne = String(J.textContent).trim()), o.push({ slug: le, title: I, excerpt: ne, path: l, parentTitle: S });
                      } catch (I) {
                        console.warn("[slugManager] indexing H2 failed", I);
                      }
                  } catch (y) {
                    console.warn("[slugManager] collect H2s failed", y);
                  }
              } catch (f) {
                console.warn("[slugManager] parsing HTML for index failed", f);
              }
            else {
              const f = u.raw, g = f.match(/^#\s+(.+)$/m);
              h = g ? g[1].trim() : "";
              const m = f.split(/\r?\n\s*\r?\n/);
              if (m.length > 1)
                for (let w = 1; w < m.length; w++) {
                  const y = m[w].trim();
                  if (y && !/^#/.test(y)) {
                    c = y.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e === 2)
                try {
                  const w = (f.match(/^#\s+(.+)$/m) || [])[1], y = w ? w.trim() : "", S = (function() {
                    try {
                      if (H.has(l)) return H.get(l);
                    } catch {
                    }
                    return re(h || l);
                  })(), N = /^##\s+(.+)$/gm;
                  let _;
                  for (; _ = N.exec(f); )
                    try {
                      const B = (_[1] || "").trim();
                      if (!B) continue;
                      const I = re(B), te = S ? `${S}::${I}` : `${re(l)}::${I}`, ne = f.slice(N.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), J = ne && ne[1] ? String(ne[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: te, title: B, excerpt: J, path: l, parentTitle: y });
                    } catch (B) {
                      console.warn("[slugManager] indexing markdown H2 failed", B);
                    }
                } catch (w) {
                  console.warn("[slugManager] collect markdown H2s failed", w);
                }
            }
            let d = "";
            try {
              H.has(l) && (d = H.get(l));
            } catch (f) {
              console.warn("[slugManager] mdToSlug access failed", f);
            }
            d || (d = re(h || l)), o.push({ slug: d, title: h, excerpt: c, path: l });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    return Xe = o, Xe;
  })();
  try {
    await it;
  } catch (s) {
    console.warn("[slugManager] awaiting _indexPromise failed", s);
  }
  return it = null, Xe;
}
const Lr = 1e3;
let xt = Lr;
function bi(t) {
  typeof t == "number" && t >= 0 && (xt = t);
}
const Mr = new DOMParser(), $r = "a[href]";
let vn = async function(t, e, n = xt) {
  if (Pt.has(t)) return Pt.get(t);
  let s = null;
  const r = /* @__PURE__ */ new Set(), i = [""];
  for (; i.length && !s && !(i.length > n); ) {
    const a = i.shift();
    if (r.has(a)) continue;
    r.add(a);
    let o = e;
    o.endsWith("/") || (o += "/"), o += a;
    try {
      const l = await globalThis.fetch(o);
      if (!l.ok) continue;
      const u = await l.text(), c = Mr.parseFromString(u, "text/html").querySelectorAll($r);
      for (const d of c)
        try {
          let f = d.getAttribute("href") || "";
          if (!f) continue;
          if (f.endsWith("/")) {
            const g = a + f;
            r.has(g) || i.push(g);
            continue;
          }
          if (f.toLowerCase().endsWith(".md")) {
            const g = me(a + f);
            try {
              if (H.has(g))
                continue;
              for (const m of Z.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await xe(g, e);
              if (m && m.raw) {
                const w = (m.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && re(w[1].trim()) === t) {
                  s = g;
                  break;
                }
              }
            } catch (m) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", m);
            }
          }
        } catch (f) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", f);
        }
    } catch (l) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", l);
    }
  }
  return Pt.set(t, s), s;
};
async function Pr(t, e = xt) {
  const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = [""];
  for (; r.length && !(r.length > e); ) {
    const i = r.shift();
    if (s.has(i)) continue;
    s.add(i);
    let a = t;
    a.endsWith("/") || (a += "/"), a += i;
    try {
      const o = await globalThis.fetch(a);
      if (!o.ok) continue;
      const l = await o.text(), h = Mr.parseFromString(l, "text/html").querySelectorAll($r);
      for (const c of h)
        try {
          let d = c.getAttribute("href") || "";
          if (!d) continue;
          if (d.endsWith("/")) {
            const g = i + d;
            s.has(g) || r.push(g);
            continue;
          }
          const f = (i + d).replace(/^\/+/, "");
          /\.(md|html?)$/i.test(f) && n.add(f);
        } catch (d) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", d);
        }
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", o);
    }
  }
  return Array.from(n);
}
async function Ir(t, e, n) {
  if (t && typeof t == "string" && (t = me(t), t = kt(t)), Z.has(t))
    return yt(t) || Z.get(t);
  for (const r of Qt)
    try {
      const i = await r(t, e);
      if (i)
        return je(t, i), H.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Te && Te.length) {
    if (ht.has(t)) {
      const r = ht.get(t);
      return Z.set(t, r), H.set(r, t), r;
    }
    for (const r of Te)
      if (!Dt.has(r))
        try {
          const i = await xe(r, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const o = re(a[1].trim());
              if (Dt.add(r), o && ht.set(o, r), o === t)
                return je(t, r), H.set(r, t), r;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const r = await Ut(e);
    if (r && r.length) {
      const i = r.find((a) => a.slug === t);
      if (i)
        return je(t, i.path), H.set(i.path, t), i.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await vn(t, e, n);
    if (r)
      return je(t, r), H.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const r of s)
    try {
      const i = await xe(r, e);
      if (i && i.raw)
        return je(t, r), H.set(r, t), r;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Te && Te.length)
    for (const r of Te)
      try {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (re(i) === t)
          return je(t, r), H.set(r, t), r;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const r = await xe("_home.md", e);
    if (r && r.raw) {
      const i = (r.raw || "").match(/^#\s+(.+)$/m);
      if (i && i[1] && re(i[1].trim()) === t)
        return je(t, "_home.md"), H.set("_home.md", t), "_home.md";
    }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const It = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Lr,
  _setAllMd: di,
  _storeSlugMapping: je,
  addSlugResolver: hi,
  get allMarkdownPaths() {
    return Te;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Ut,
  buildSearchIndexWorker: ci,
  clearFetchCache: mi,
  clearListCaches: fi,
  crawlAllMarkdown: Pr,
  crawlCache: Pt,
  crawlForSlug: vn,
  crawlForSlugWorker: ui,
  get defaultCrawlMaxQueue() {
    return xt;
  },
  ensureSlug: Ir,
  fetchCache: pt,
  get fetchMarkdown() {
    return xe;
  },
  getLanguages: oi,
  initSlugWorker: Sn,
  listPathsFetched: Dt,
  listSlugCache: ht,
  mdToSlug: H,
  get notFoundPage() {
    return Nt;
  },
  removeSlugResolver: pi,
  resolveSlugPath: yt,
  get searchIndex() {
    return Xe;
  },
  setContentBase: qt,
  setDefaultCrawlMaxQueue: bi,
  setFetchMarkdown: wi,
  setLanguages: Tr,
  setNotFoundPage: pn,
  slugResolvers: Qt,
  slugToMd: Z,
  slugify: re
}, Symbol.toStringTag, { value: "Module" }));
let zr = 100;
function tr(t) {
  zr = t;
}
let dt = 300 * 1e3;
function nr(t) {
  dt = t;
}
const _e = /* @__PURE__ */ new Map();
function ki(t) {
  if (!_e.has(t)) return;
  const e = _e.get(t), n = Date.now();
  if (e.ts + dt < n) {
    _e.delete(t);
    return;
  }
  return _e.delete(t), _e.set(t, e), e.value;
}
function yi(t, e) {
  if (rr(), rr(), _e.delete(t), _e.set(t, { value: e, ts: Date.now() }), _e.size > zr) {
    const n = _e.keys().next().value;
    n !== void 0 && _e.delete(n);
  }
}
function rr() {
  if (!dt || dt <= 0) return;
  const t = Date.now();
  for (const [e, n] of _e.entries())
    n.ts + dt < t && _e.delete(e);
}
async function xi(t, e) {
  const n = new Set(Be), s = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(s || [])) {
    const i = r.getAttribute("href") || "";
    if (i)
      try {
        const a = new URL(i, location.href);
        if (a.origin !== location.origin) continue;
        const o = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (o) {
          let u = me(o[1]);
          u && n.add(u);
          continue;
        }
        const l = a.pathname || "";
        if (l) {
          const u = new URL(e), h = Zt(u.pathname);
          if (l.indexOf(h) !== -1) {
            let c = l.startsWith(h) ? l.slice(h.length) : l;
            c = me(c), c && n.add(c);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const i = await xe(r, e);
      if (!i || !i.raw) continue;
      const a = (i.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const o = (a[1] || "").trim();
        if (o && re(o) === t)
          return r;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function Si(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (Z.has(n)) {
        const s = yt(n) || Z.get(n);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (Be && Be.size)
          for (const s of Be) {
            const r = s.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (re(r) === n && !/index\.html$/i.test(s)) {
              e.push(s);
              break;
            }
          }
        !e.length && n && !/\.(md|html?)$/i.test(n) && (e.push(n + ".html"), e.push(n + ".md"));
      }
    } catch (n) {
      console.warn("[router] buildPageCandidates failed during slug handling", n);
    }
  return e;
}
async function vi(t, e) {
  const n = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let s = t || "", r = null;
  if (s && String(s).includes("::")) {
    const c = String(s).split("::", 2);
    s = c[0], r = c[1] || null;
  }
  const a = `${t}|||${typeof ri < "u" && We ? We : ""}`, o = ki(a);
  if (o)
    s = o.resolved, r = o.anchor || r;
  else {
    if (!String(s).includes(".md") && !String(s).includes(".html")) {
      let c = decodeURIComponent(String(s || ""));
      if (c && typeof c == "string" && (c = me(c), c = kt(c)), Z.has(c))
        s = yt(c) || Z.get(c);
      else {
        let d = await xi(c, e);
        if (d)
          s = d;
        else if (xn._refreshed && Be && Be.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const f = await Ir(c, e);
          f && (s = f);
        }
      }
    }
    yi(a, { resolved: s, anchor: r });
  }
  !r && n && (r = n);
  const l = Si(s);
  if (l.length === 1 && /index\.html$/i.test(l[0]) && !Z.has(s) && !Z.has(decodeURIComponent(String(s || ""))))
    throw new Error("Unknown slug: index.html fallback prevented");
  let u = null, h = null;
  for (const c of l)
    if (c)
      try {
        const d = me(c);
        u = await xe(d, e), h = d;
        break;
      } catch {
      }
  if (!u)
    throw new Error("no page data");
  return { data: u, pagePath: h, anchor: r };
}
function En() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Ve = En();
function Br(t) {
  Ve = t;
}
var Ye = { exec: () => null };
function Y(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(ve.caret, "$1"), n = n.replace(r, a), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Ei = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ve = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Ri = /^(?:[ \t]*(?:\n|$))+/, Ai = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ti = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, St = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ci = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Rn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Or = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Nr = Y(Or).replace(/bull/g, Rn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), _i = Y(Or).replace(/bull/g, Rn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), An = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Li = /^[^\n]+/, Tn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Mi = Y(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Tn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), $i = Y(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Rn).getRegex(), Gt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Cn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Pi = Y("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Cn).replace("tag", Gt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Dr = Y(An).replace("hr", St).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Gt).getRegex(), Ii = Y(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Dr).getRegex(), _n = { blockquote: Ii, code: Ai, def: Mi, fences: Ti, heading: Ci, hr: St, html: Pi, lheading: Nr, list: $i, newline: Ri, paragraph: Dr, table: Ye, text: Li }, sr = Y("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", St).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Gt).getRegex(), zi = { ..._n, lheading: _i, table: sr, paragraph: Y(An).replace("hr", St).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", sr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Gt).getRegex() }, Bi = { ..._n, html: Y(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Cn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ye, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Y(An).replace("hr", St).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Nr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Oi = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ni = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qr = /^( {2,}|\\)\n(?!\s*$)/, Di = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Xt = /[\p{P}\p{S}]/u, Ln = /[\s\p{P}\p{S}]/u, Ur = /[^\s\p{P}\p{S}]/u, qi = Y(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ln).getRegex(), Hr = /(?!~)[\p{P}\p{S}]/u, Ui = /(?!~)[\s\p{P}\p{S}]/u, Hi = /(?:[^\s\p{P}\p{S}]|~)/u, jr = /(?![*_])[\p{P}\p{S}]/u, ji = /(?![*_])[\s\p{P}\p{S}]/u, Fi = /(?:[^\s\p{P}\p{S}]|[*_])/u, Wi = Y(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ei ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Fr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Zi = Y(Fr, "u").replace(/punct/g, Xt).getRegex(), Qi = Y(Fr, "u").replace(/punct/g, Hr).getRegex(), Wr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Gi = Y(Wr, "gu").replace(/notPunctSpace/g, Ur).replace(/punctSpace/g, Ln).replace(/punct/g, Xt).getRegex(), Xi = Y(Wr, "gu").replace(/notPunctSpace/g, Hi).replace(/punctSpace/g, Ui).replace(/punct/g, Hr).getRegex(), Yi = Y("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ur).replace(/punctSpace/g, Ln).replace(/punct/g, Xt).getRegex(), Ki = Y(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, jr).getRegex(), Vi = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ji = Y(Vi, "gu").replace(/notPunctSpace/g, Fi).replace(/punctSpace/g, ji).replace(/punct/g, jr).getRegex(), ea = Y(/\\(punct)/, "gu").replace(/punct/g, Xt).getRegex(), ta = Y(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), na = Y(Cn).replace("(?:-->|$)", "-->").getRegex(), ra = Y("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", na).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Ht = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, sa = Y(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Ht).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Zr = Y(/^!?\[(label)\]\[(ref)\]/).replace("label", Ht).replace("ref", Tn).getRegex(), Qr = Y(/^!?\[(ref)\](?:\[\])?/).replace("ref", Tn).getRegex(), ia = Y("reflink|nolink(?!\\()", "g").replace("reflink", Zr).replace("nolink", Qr).getRegex(), ir = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Mn = { _backpedal: Ye, anyPunctuation: ea, autolink: ta, blockSkip: Wi, br: qr, code: Ni, del: Ye, delLDelim: Ye, delRDelim: Ye, emStrongLDelim: Zi, emStrongRDelimAst: Gi, emStrongRDelimUnd: Yi, escape: Oi, link: sa, nolink: Qr, punctuation: qi, reflink: Zr, reflinkSearch: ia, tag: ra, text: Di, url: Ye }, aa = { ...Mn, link: Y(/^!?\[(label)\]\((.*?)\)/).replace("label", Ht).getRegex(), reflink: Y(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Ht).getRegex() }, dn = { ...Mn, emStrongRDelimAst: Xi, emStrongLDelim: Qi, delLDelim: Ki, delRDelim: Ji, url: Y(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ir).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Y(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ir).getRegex() }, la = { ...dn, br: Y(qr).replace("{2,}", "*").getRegex(), text: Y(dn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, $t = { normal: _n, gfm: zi, pedantic: Bi }, at = { normal: Mn, gfm: dn, breaks: la, pedantic: aa }, oa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ar = (t) => oa[t];
function ze(t, e) {
  if (e) {
    if (ve.escapeTest.test(t)) return t.replace(ve.escapeReplace, ar);
  } else if (ve.escapeTestNoEncode.test(t)) return t.replace(ve.escapeReplaceNoEncode, ar);
  return t;
}
function lr(t) {
  try {
    t = encodeURI(t).replace(ve.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function or(t, e) {
  let n = t.replace(ve.findPipe, (i, a, o) => {
    let l = !1, u = a;
    for (; --u >= 0 && o[u] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), s = n.split(ve.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(ve.slashPipe, "|");
  return s;
}
function lt(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function ca(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) n++;
  else if (t[s] === e[1] && (n--, n < 0)) return s;
  return n > 0 ? -2 : -1;
}
function ua(t, e = 0) {
  let n = e, s = "";
  for (let r of t) if (r === "	") {
    let i = 4 - n % 4;
    s += " ".repeat(i), n += i;
  } else s += r, n++;
  return s;
}
function cr(t, e, n, s, r) {
  let i = e.href, a = e.title || null, o = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: o, tokens: s.inlineTokens(o) };
  return s.state.inLink = !1, l;
}
function ha(t, e, n) {
  let s = t.match(n.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((i) => {
    let a = i.match(n.other.beginningSpace);
    if (a === null) return i;
    let [o] = a;
    return o.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var jt = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Ve;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : lt(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = ha(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = lt(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: lt(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = lt(e[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let a = !1, o = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), a = !0;
        else if (!a) o.push(n[l]);
        else break;
        n = n.slice(l);
        let u = o.join(`
`), h = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${u}` : u, r = r ? `${r}
${h}` : h;
        let c = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, i, !0), this.lexer.state.top = c, n.length === 0) break;
        let d = i.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let f = d, g = f.raw + `
` + n.join(`
`), m = this.blockquote(g);
          i[i.length - 1] = m, s = s.substring(0, s.length - f.raw.length) + m.raw, r = r.substring(0, r.length - f.text.length) + m.text;
          break;
        } else if (d?.type === "list") {
          let f = d, g = f.raw + `
` + n.join(`
`), m = this.list(g);
          i[i.length - 1] = m, s = s.substring(0, s.length - d.raw.length) + m.raw, r = r.substring(0, r.length - f.raw.length) + m.raw, n = g.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), a = !1;
      for (; t; ) {
        let l = !1, u = "", h = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        u = e[0], t = t.substring(u.length);
        let c = ua(e[2].split(`
`, 1)[0], e[1].length), d = t.split(`
`, 1)[0], f = !c.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, h = c.trimStart()) : f ? g = e[1].length + 1 : (g = c.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, h = c.slice(g), g += e[1].length), f && this.rules.other.blankLine.test(d) && (u += d + `
`, t = t.substring(d.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(g), w = this.rules.other.hrRegex(g), y = this.rules.other.fencesBeginRegex(g), S = this.rules.other.headingBeginRegex(g), N = this.rules.other.htmlBeginRegex(g), _ = this.rules.other.blockquoteBeginRegex(g);
          for (; t; ) {
            let B = t.split(`
`, 1)[0], I;
            if (d = B, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), I = d) : I = d.replace(this.rules.other.tabCharGlobal, "    "), y.test(d) || S.test(d) || N.test(d) || _.test(d) || m.test(d) || w.test(d)) break;
            if (I.search(this.rules.other.nonSpaceChar) >= g || !d.trim()) h += `
` + I.slice(g);
            else {
              if (f || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || y.test(c) || S.test(c) || w.test(c)) break;
              h += `
` + d;
            }
            f = !d.trim(), u += B + `
`, t = t.substring(B.length + 1), c = I.slice(g);
          }
        }
        r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), r.raw += u;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let l of r.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let u = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (u) {
            let h = { type: "checkbox", raw: u[0] + " ", checked: u[0] !== "[ ]" };
            l.checked = h.checked, r.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = h.raw + l.tokens[0].raw, l.tokens[0].text = h.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(h)) : l.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : l.tokens.unshift(h);
          }
        }
        if (!r.loose) {
          let u = l.tokens.filter((c) => c.type === "space"), h = u.length > 0 && u.some((c) => this.rules.other.anyLine.test(c.raw));
          r.loose = h;
        }
      }
      if (r.loose) for (let l of r.items) {
        l.loose = !0;
        for (let u of l.tokens) u.type === "text" && (u.type = "paragraph");
      }
      return r;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: s, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = or(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < n.length; a++) i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] });
      for (let a of r) i.rows.push(or(a, i.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: i.align[l] })));
      return i;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = lt(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = ca(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let s = e[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), cr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[s.toLowerCase()];
      if (!r) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return cr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, i, a, o = r, l = 0, u = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = u.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
        if (a = [...i].length, s[3] || s[4]) {
          o += a;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + a) % 3)) {
          l += a;
          continue;
        }
        if (o -= a, o > 0) continue;
        a = Math.min(a, a + o + l);
        let h = [...s[0]][0].length, c = t.slice(0, r + s.index + h + a);
        if (Math.min(r, a) % 2) {
          let f = c.slice(1, -1);
          return { type: "em", raw: c, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let d = c.slice(2, -2);
        return { type: "strong", raw: c, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, n = "") {
    let s = this.rules.inline.delLDelim.exec(t);
    if (s && (!s[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, i, a, o = r, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = l.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (a = [...i].length, a !== r)) continue;
        if (s[3] || s[4]) {
          o += a;
          continue;
        }
        if (o -= a, o > 0) continue;
        a = Math.min(a, a + o);
        let u = [...s[0]][0].length, h = t.slice(0, r + s.index + u + a), c = h.slice(r, -r);
        return { type: "del", raw: h, text: c, tokens: this.lexer.inlineTokens(c) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, s;
      return e[2] === "@" ? (n = e[1], s = "mailto:" + n) : (n = e[1], s = n), { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, s;
      if (e[2] === "@") n = e[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        n = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, Me = class fn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Ve, this.options.tokenizer = this.options.tokenizer || new jt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: ve, block: $t.normal, inline: at.normal };
    this.options.pedantic ? (n.block = $t.pedantic, n.inline = at.pedantic) : this.options.gfm && (n.block = $t.gfm, this.options.breaks ? n.inline = at.breaks : n.inline = at.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: $t, inline: at };
  }
  static lex(e, n) {
    return new fn(n).lex(e);
  }
  static lexInline(e, n) {
    return new fn(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ve.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(ve.tabCharGlobal, "    ").replace(ve.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((a) => (r = a.call({ lexer: this }, e, n)) ? (e = e.substring(r.raw.length), n.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        r.raw.length === 1 && a !== void 0 ? a.raw += `
` : n.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.at(-1).src = a.text) : n.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, n.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, o = e.slice(1), l;
        this.options.extensions.startBlock.forEach((u) => {
          l = u.call({ lexer: this }, o), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
        }), a < 1 / 0 && a >= 0 && (i = e.substring(0, a + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let a = n.at(-1);
        s && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r), s = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r);
        continue;
      }
      if (e) {
        let a = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(a);
          break;
        } else throw new Error(a);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let s = e, r = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; ) l.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; ) s = s.slice(0, r.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; ) i = r[2] ? r[2].length : 0, s = s.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let a = !1, o = "";
    for (; e; ) {
      a || (o = ""), a = !1;
      let l;
      if (this.options.extensions?.inline?.some((h) => (l = h.call({ lexer: this }, e, n)) ? (e = e.substring(l.raw.length), n.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.link(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(l.raw.length);
        let h = n.at(-1);
        l.type === "text" && h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(e, s, o)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.br(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.del(e, s, o)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(e))) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, c = e.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, c), typeof d == "number" && d >= 0 && (h = Math.min(h, d));
        }), h < 1 / 0 && h >= 0 && (u = e.substring(0, h + 1));
      }
      if (l = this.tokenizer.inlineText(u)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (o = l.raw.slice(-1)), a = !0;
        let h = n.at(-1);
        h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : n.push(l);
        continue;
      }
      if (e) {
        let h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return n;
  }
}, Ft = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Ve;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(ve.notSpaceStart)?.[0], r = t.replace(ve.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + ze(s) + '">' + (n ? r : ze(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : ze(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, n = t.start, s = "";
    for (let a = 0; a < t.items.length; a++) {
      let o = t.items[a];
      s += this.listitem(o);
    }
    let r = e ? "ol" : "ul", i = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", n = "";
    for (let r = 0; r < t.header.length; r++) n += this.tablecell(t.header[r]);
    e += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < t.rows.length; r++) {
      let i = t.rows[r];
      n = "";
      for (let a = 0; a < i.length; a++) n += this.tablecell(i[a]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${ze(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let s = this.parser.parseInline(n), r = lr(t);
    if (r === null) return s;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + ze(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = lr(t);
    if (r === null) return ze(n);
    t = r;
    let i = `<img src="${t}" alt="${ze(n)}"`;
    return e && (i += ` title="${ze(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : ze(t.text);
  }
}, $n = class {
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
}, $e = class gn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Ve, this.options.renderer = this.options.renderer || new Ft(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $n();
  }
  static parse(e, n) {
    return new gn(n).parse(e);
  }
  static parseInline(e, n) {
    return new gn(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let a = r, o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          n += o || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "space": {
          n += this.renderer.space(i);
          break;
        }
        case "hr": {
          n += this.renderer.hr(i);
          break;
        }
        case "heading": {
          n += this.renderer.heading(i);
          break;
        }
        case "code": {
          n += this.renderer.code(i);
          break;
        }
        case "table": {
          n += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          n += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          n += this.renderer.html(i);
          break;
        }
        case "def": {
          n += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          n += this.renderer.text(i);
          break;
        }
        default: {
          let a = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let s = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += o || "";
          continue;
        }
      }
      let a = i;
      switch (a.type) {
        case "escape": {
          s += n.text(a);
          break;
        }
        case "html": {
          s += n.html(a);
          break;
        }
        case "link": {
          s += n.link(a);
          break;
        }
        case "image": {
          s += n.image(a);
          break;
        }
        case "checkbox": {
          s += n.checkbox(a);
          break;
        }
        case "strong": {
          s += n.strong(a);
          break;
        }
        case "em": {
          s += n.em(a);
          break;
        }
        case "codespan": {
          s += n.codespan(a);
          break;
        }
        case "br": {
          s += n.br(a);
          break;
        }
        case "del": {
          s += n.del(a);
          break;
        }
        case "text": {
          s += n.text(a);
          break;
        }
        default: {
          let o = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return s;
  }
}, ct = class {
  options;
  block;
  constructor(t) {
    this.options = t || Ve;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
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
  provideLexer() {
    return this.block ? Me.lex : Me.lexInline;
  }
  provideParser() {
    return this.block ? $e.parse : $e.parseInline;
  }
}, pa = class {
  defaults = En();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = $e;
  Renderer = Ft;
  TextRenderer = $n;
  Lexer = Me;
  Tokenizer = jt;
  Hooks = ct;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let s of t) switch (n = n.concat(e.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let i of r.header) n = n.concat(this.walkTokens(i.tokens, e));
        for (let i of r.rows) for (let a of i) n = n.concat(this.walkTokens(a.tokens, e));
        break;
      }
      case "list": {
        let r = s;
        n = n.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = s;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
          let a = r[i].flat(1 / 0);
          n = n.concat(this.walkTokens(a, e));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let i = e.renderers[r.name];
          i ? e.renderers[r.name] = function(...a) {
            let o = r.renderer.apply(this, a);
            return o === !1 && (o = i.apply(this, a)), o;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[r.level];
          i ? i.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new Ft(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let a = i, o = n.renderer[a], l = r[a];
          r[a] = (...u) => {
            let h = o.apply(r, u);
            return h === !1 && (h = l.apply(r, u)), h || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new jt(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let a = i, o = n.tokenizer[a], l = r[a];
          r[a] = (...u) => {
            let h = o.apply(r, u);
            return h === !1 && (h = l.apply(r, u)), h;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new ct();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, o = n.hooks[a], l = r[a];
          ct.passThroughHooks.has(i) ? r[a] = (u) => {
            if (this.defaults.async && ct.passThroughHooksRespectAsync.has(i)) return (async () => {
              let c = await o.call(r, u);
              return l.call(r, c);
            })();
            let h = o.call(r, u);
            return l.call(r, h);
          } : r[a] = (...u) => {
            if (this.defaults.async) return (async () => {
              let c = await o.apply(r, u);
              return c === !1 && (c = await l.apply(r, u)), c;
            })();
            let h = o.apply(r, u);
            return h === !1 && (h = l.apply(r, u)), h;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(a) {
          let o = [];
          return o.push(i.call(this, a)), r && (o = o.concat(r.call(this, a))), o;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return Me.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return $e.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let s = { ...n }, r = { ...this.defaults, ...s }, i = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let a = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer() : t ? Me.lex : Me.lexInline)(a, r), l = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser() : t ? $e.parse : $e.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(i);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let a = (r.hooks ? r.hooks.provideLexer() : t ? Me.lex : Me.lexInline)(e, r);
        r.hooks && (a = r.hooks.processAllTokens(a)), r.walkTokens && this.walkTokens(a, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser() : t ? $e.parse : $e.parseInline)(a, r);
        return r.hooks && (o = r.hooks.postprocess(o)), o;
      } catch (a) {
        return i(a);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + ze(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, Ke = new pa();
function K(t, e) {
  return Ke.parse(t, e);
}
K.options = K.setOptions = function(t) {
  return Ke.setOptions(t), K.defaults = Ke.defaults, Br(K.defaults), K;
};
K.getDefaults = En;
K.defaults = Ve;
K.use = function(...t) {
  return Ke.use(...t), K.defaults = Ke.defaults, Br(K.defaults), K;
};
K.walkTokens = function(t, e) {
  return Ke.walkTokens(t, e);
};
K.parseInline = Ke.parseInline;
K.Parser = $e;
K.parser = $e.parse;
K.Renderer = Ft;
K.TextRenderer = $n;
K.Lexer = Me;
K.lexer = Me.lex;
K.Tokenizer = jt;
K.Hooks = ct;
K.parse = K;
K.options;
K.setOptions;
K.use;
K.walkTokens;
K.parseInline;
$e.parse;
Me.lex;
const Gr = `function j() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var T = j();
function le(n) {
  T = n;
}
var $ = { exec: () => null };
function p(n, e = "") {
  let r = typeof n == "string" ? n : n.source, s = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(x.caret, "$1"), r = r.replace(t, l), s;
  }, getRegex: () => new RegExp(r, e) };
  return s;
}
var we = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), x = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (n) => new RegExp(\`^( {0,3}\${n})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}#\`), htmlBeginRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (n) => new RegExp(\`^ {0,\${Math.min(3, n - 1)}}>\`) }, me = /^(?:[ \\t]*(?:\\n|$))+/, ye = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Se = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, I = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, $e = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, H = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, ae = p(ie).replace(/bull/g, H).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Re = p(ie).replace(/bull/g, H).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), O = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Te = /^[^\\n]+/, N = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, ze = p(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", N).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Ae = p(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, H).getRegex(), E = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", G = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, _e = p("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", G).replace("tag", E).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), oe = p(O).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), Pe = p(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", oe).getRegex(), W = { blockquote: Pe, code: ye, def: ze, fences: Se, heading: $e, hr: I, html: _e, lheading: ae, list: Ae, newline: me, paragraph: oe, table: $, text: Te }, Y = p("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), Ie = { ...W, lheading: Re, table: Y, paragraph: p(O).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", Y).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex() }, Le = { ...W, html: p(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", G).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: $, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: p(O).replace("hr", I).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ve = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Be = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, ce = /^( {2,}|\\\\)\\n(?!\\s*$)/, Ce = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, q = /[\\p{P}\\p{S}]/u, X = /[\\s\\p{P}\\p{S}]/u, he = /[^\\s\\p{P}\\p{S}]/u, Ee = p(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, X).getRegex(), pe = /(?!~)[\\p{P}\\p{S}]/u, qe = /(?!~)[\\s\\p{P}\\p{S}]/u, Ze = /(?:[^\\s\\p{P}\\p{S}]|~)/u, ue = /(?![*_])[\\p{P}\\p{S}]/u, De = /(?![*_])[\\s\\p{P}\\p{S}]/u, Me = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Qe = p(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", we ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ge = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, je = p(ge, "u").replace(/punct/g, q).getRegex(), He = p(ge, "u").replace(/punct/g, pe).getRegex(), ke = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Oe = p(ke, "gu").replace(/notPunctSpace/g, he).replace(/punctSpace/g, X).replace(/punct/g, q).getRegex(), Ne = p(ke, "gu").replace(/notPunctSpace/g, Ze).replace(/punctSpace/g, qe).replace(/punct/g, pe).getRegex(), Ge = p("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, he).replace(/punctSpace/g, X).replace(/punct/g, q).getRegex(), We = p(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, ue).getRegex(), Xe = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Fe = p(Xe, "gu").replace(/notPunctSpace/g, Me).replace(/punctSpace/g, De).replace(/punct/g, ue).getRegex(), Ue = p(/\\\\(punct)/, "gu").replace(/punct/g, q).getRegex(), Je = p(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ke = p(G).replace("(?:-->|$)", "-->").getRegex(), Ve = p("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", Ke).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), v = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, Ye = p(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", v).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), fe = p(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", v).replace("ref", N).getRegex(), de = p(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", N).getRegex(), et = p("reflink|nolink(?!\\\\()", "g").replace("reflink", fe).replace("nolink", de).getRegex(), ee = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, F = { _backpedal: $, anyPunctuation: Ue, autolink: Je, blockSkip: Qe, br: ce, code: Be, del: $, delLDelim: $, delRDelim: $, emStrongLDelim: je, emStrongRDelimAst: Oe, emStrongRDelimUnd: Ge, escape: ve, link: Ye, nolink: de, punctuation: Ee, reflink: fe, reflinkSearch: et, tag: Ve, text: Ce, url: $ }, tt = { ...F, link: p(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", v).getRegex(), reflink: p(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", v).getRegex() }, D = { ...F, emStrongRDelimAst: Ne, emStrongLDelim: He, delLDelim: We, delRDelim: Fe, url: p(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", ee).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: p(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", ee).getRegex() }, rt = { ...D, br: p(ce).replace("{2,}", "*").getRegex(), text: p(D.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, L = { normal: W, gfm: Ie, pedantic: Le }, A = { normal: F, gfm: D, breaks: rt, pedantic: tt }, nt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, te = (n) => nt[n];
function y(n, e) {
  if (e) {
    if (x.escapeTest.test(n)) return n.replace(x.escapeReplace, te);
  } else if (x.escapeTestNoEncode.test(n)) return n.replace(x.escapeReplaceNoEncode, te);
  return n;
}
function re(n) {
  try {
    n = encodeURI(n).replace(x.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ne(n, e) {
  let r = n.replace(x.findPipe, (i, l, o) => {
    let a = !1, h = l;
    for (; --h >= 0 && o[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), s = r.split(x.splitPipe), t = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; t < s.length; t++) s[t] = s[t].trim().replace(x.slashPipe, "|");
  return s;
}
function _(n, e, r) {
  let s = n.length;
  if (s === 0) return "";
  let t = 0;
  for (; t < s && n.charAt(s - t - 1) === e; )
    t++;
  return n.slice(0, s - t);
}
function st(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let s = 0; s < n.length; s++) if (n[s] === "\\\\") s++;
  else if (n[s] === e[0]) r++;
  else if (n[s] === e[1] && (r--, r < 0)) return s;
  return r > 0 ? -2 : -1;
}
function lt(n, e = 0) {
  let r = e, s = "";
  for (let t of n) if (t === "	") {
    let i = 4 - r % 4;
    s += " ".repeat(i), r += i;
  } else s += t, r++;
  return s;
}
function se(n, e, r, s, t) {
  let i = e.href, l = e.title || null, o = n[1].replace(t.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let a = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: l, text: o, tokens: s.inlineTokens(o) };
  return s.state.inLink = !1, a;
}
function it(n, e, r) {
  let s = n.match(r.other.indentCodeCompensation);
  if (s === null) return e;
  let t = s[1];
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
  constructor(n) {
    this.options = n || T;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : _(r, \`
\`) };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let r = e[0], s = it(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let s = _(r, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (r = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: _(e[0], \`
\`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let r = _(e[0], \`
\`).split(\`
\`), s = "", t = "", i = [];
      for (; r.length > 0; ) {
        let l = !1, o = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) o.push(r[a]), l = !0;
        else if (!l) o.push(r[a]);
        else break;
        r = r.slice(a);
        let h = o.join(\`
\`), c = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? \`\${s}
\${h}\` : h, t = t ? \`\${t}
\${c}\` : c;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = u, r.length === 0) break;
        let g = i.at(-1);
        if (g?.type === "code") break;
        if (g?.type === "blockquote") {
          let d = g, f = d.raw + \`
\` + r.join(\`
\`), S = this.blockquote(f);
          i[i.length - 1] = S, s = s.substring(0, s.length - d.raw.length) + S.raw, t = t.substring(0, t.length - d.text.length) + S.text;
          break;
        } else if (g?.type === "list") {
          let d = g, f = d.raw + \`
\` + r.join(\`
\`), S = this.list(f);
          i[i.length - 1] = S, s = s.substring(0, s.length - g.raw.length) + S.raw, t = t.substring(0, t.length - d.raw.length) + S.raw, r = f.substring(i.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: t };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let r = e[1].trim(), s = r.length > 1, t = { type: "list", raw: "", ordered: s, start: s ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = s ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = s ? r : "[*+-]");
      let i = this.rules.other.listItemRegex(r), l = !1;
      for (; n; ) {
        let a = !1, h = "", c = "";
        if (!(e = i.exec(n)) || this.rules.block.hr.test(n)) break;
        h = e[0], n = n.substring(h.length);
        let u = lt(e[2].split(\`
\`, 1)[0], e[1].length), g = n.split(\`
\`, 1)[0], d = !u.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, c = u.trimStart()) : d ? f = e[1].length + 1 : (f = u.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = u.slice(f), f += e[1].length), d && this.rules.other.blankLine.test(g) && (h += g + \`
\`, n = n.substring(g.length + 1), a = !0), !a) {
          let S = this.rules.other.nextBulletRegex(f), J = this.rules.other.hrRegex(f), K = this.rules.other.fencesBeginRegex(f), V = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f), be = this.rules.other.blockquoteBeginRegex(f);
          for (; n; ) {
            let Z = n.split(\`
\`, 1)[0], z;
            if (g = Z, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), z = g) : z = g.replace(this.rules.other.tabCharGlobal, "    "), K.test(g) || V.test(g) || xe.test(g) || be.test(g) || S.test(g) || J.test(g)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= f || !g.trim()) c += \`
\` + z.slice(f);
            else {
              if (d || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || K.test(u) || V.test(u) || J.test(u)) break;
              c += \`
\` + g;
            }
            d = !g.trim(), h += Z + \`
\`, n = n.substring(Z.length + 1), u = z.slice(f);
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
          let h = a.tokens.filter((u) => u.type === "space"), c = h.length > 0 && h.some((u) => this.rules.other.anyLine.test(u.raw));
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
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: s, title: t };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = ne(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === s.length) {
      for (let l of s) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < r.length; l++) i.header.push({ text: r[l], tokens: this.lexer.inline(r[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(ne(l, i.header.length).map((o, a) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: i.align[a] })));
      return i;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(n) {
    let e = this.rules.block.paragraph.exec(n);
    if (e) {
      let r = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(n) {
    let e = this.rules.block.text.exec(n);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(n) {
    let e = this.rules.inline.escape.exec(n);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(n) {
    let e = this.rules.inline.tag.exec(n);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(n) {
    let e = this.rules.inline.link.exec(n);
    if (e) {
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let i = _(r.slice(0, -1), "\\\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = st(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let s = e[2], t = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], t = i[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? s = s.slice(1) : s = s.slice(1, -1)), se(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(n)) || (r = this.rules.inline.nolink.exec(n))) {
      let s = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[s.toLowerCase()];
      if (!t) {
        let i = r[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return se(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, r = "") {
    let s = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!s || s[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...s[0]].length - 1, i, l, o = t, a = 0, h = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * n.length + t); (s = h.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
        if (l = [...i].length, s[3] || s[4]) {
          o += l;
          continue;
        } else if ((s[5] || s[6]) && t % 3 && !((t + l) % 3)) {
          a += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o + a);
        let c = [...s[0]][0].length, u = n.slice(0, t + s.index + c + l);
        if (Math.min(t, l) % 2) {
          let d = u.slice(1, -1);
          return { type: "em", raw: u, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let g = u.slice(2, -2);
        return { type: "strong", raw: u, text: g, tokens: this.lexer.inlineTokens(g) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(r), t = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return s && t && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, r = "") {
    let s = this.rules.inline.delLDelim.exec(n);
    if (s && (!s[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...s[0]].length - 1, i, l, o = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * n.length + t); (s = a.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (l = [...i].length, l !== t)) continue;
        if (s[3] || s[4]) {
          o += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o);
        let h = [...s[0]][0].length, c = n.slice(0, t + s.index + h + l), u = c.slice(t, -t);
        return { type: "del", raw: c, text: u, tokens: this.lexer.inlineTokens(u) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let r, s;
      return e[2] === "@" ? (r = e[1], s = "mailto:" + r) : (r = e[1], s = r), { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(n) {
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, s;
      if (e[2] === "@") r = e[0], s = "mailto:" + r;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, w = class M {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new B(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: x, block: L.normal, inline: A.normal };
    this.options.pedantic ? (r.block = L.pedantic, r.inline = A.pedantic) : this.options.gfm && (r.block = L.gfm, this.options.breaks ? r.inline = A.breaks : r.inline = A.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: L, inline: A };
  }
  static lex(e, r) {
    return new M(r).lex(e);
  }
  static lexInline(e, r) {
    return new M(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(x.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let s = this.inlineQueue[r];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(x.tabCharGlobal, "    ").replace(x.spaceLine, "")); e; ) {
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
        s && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : r.push(t), s = i.length !== e.length, e = e.substring(t.raw.length);
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
    let s = e, t = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; ) a.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; ) s = s.slice(0, t.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; ) i = t[2] ? t[2].length : 0, s = s.slice(0, t.index + i) + "[" + "a".repeat(t[0].length - i - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
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
      if (a = this.tokenizer.emStrong(e, s, o)) {
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
      if (a = this.tokenizer.del(e, s, o)) {
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
        let c = 1 / 0, u = e.slice(1), g;
        this.options.extensions.startInline.forEach((d) => {
          g = d.call({ lexer: this }, u), typeof g == "number" && g >= 0 && (c = Math.min(c, g));
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
}, C = class {
  options;
  parser;
  constructor(n) {
    this.options = n || T;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: r }) {
    let s = (e || "").match(x.notSpaceStart)?.[0], t = n.replace(x.endingNewline, "") + \`
\`;
    return s ? '<pre><code class="language-' + y(s) + '">' + (r ? t : y(t, !0)) + \`</code></pre>
\` : "<pre><code>" + (r ? t : y(t, !0)) + \`</code></pre>
\`;
  }
  blockquote({ tokens: n }) {
    return \`<blockquote>
\${this.parser.parse(n)}</blockquote>
\`;
  }
  html({ text: n }) {
    return n;
  }
  def(n) {
    return "";
  }
  heading({ tokens: n, depth: e }) {
    return \`<h\${e}>\${this.parser.parseInline(n)}</h\${e}>
\`;
  }
  hr(n) {
    return \`<hr>
\`;
  }
  list(n) {
    let e = n.ordered, r = n.start, s = "";
    for (let l = 0; l < n.items.length; l++) {
      let o = n.items[l];
      s += this.listitem(o);
    }
    let t = e ? "ol" : "ul", i = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + i + \`>
\` + s + "</" + t + \`>
\`;
  }
  listitem(n) {
    return \`<li>\${this.parser.parse(n.tokens)}</li>
\`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: n }) {
    return \`<p>\${this.parser.parseInline(n)}</p>
\`;
  }
  table(n) {
    let e = "", r = "";
    for (let t = 0; t < n.header.length; t++) r += this.tablecell(n.header[t]);
    e += this.tablerow({ text: r });
    let s = "";
    for (let t = 0; t < n.rows.length; t++) {
      let i = n.rows[t];
      r = "";
      for (let l = 0; l < i.length; l++) r += this.tablecell(i[l]);
      s += this.tablerow({ text: r });
    }
    return s && (s = \`<tbody>\${s}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + s + \`</table>
\`;
  }
  tablerow({ text: n }) {
    return \`<tr>
\${n}</tr>
\`;
  }
  tablecell(n) {
    let e = this.parser.parseInline(n.tokens), r = n.header ? "th" : "td";
    return (n.align ? \`<\${r} align="\${n.align}">\` : \`<\${r}>\`) + e + \`</\${r}>
\`;
  }
  strong({ tokens: n }) {
    return \`<strong>\${this.parser.parseInline(n)}</strong>\`;
  }
  em({ tokens: n }) {
    return \`<em>\${this.parser.parseInline(n)}</em>\`;
  }
  codespan({ text: n }) {
    return \`<code>\${y(n, !0)}</code>\`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return \`<del>\${this.parser.parseInline(n)}</del>\`;
  }
  link({ href: n, title: e, tokens: r }) {
    let s = this.parser.parseInline(r), t = re(n);
    if (t === null) return s;
    n = t;
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + y(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: n, title: e, text: r, tokens: s }) {
    s && (r = this.parser.parseInline(s, this.parser.textRenderer));
    let t = re(n);
    if (t === null) return y(r);
    n = t;
    let i = \`<img src="\${n}" alt="\${y(r)}"\`;
    return e && (i += \` title="\${y(e)}"\`), i += ">", i;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : y(n.text);
  }
}, U = class {
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
  checkbox({ raw: n }) {
    return n;
  }
}, m = class Q {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new C(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new U();
  }
  static parse(e, r) {
    return new Q(r).parse(e);
  }
  static parseInline(e, r) {
    return new Q(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let s = 0; s < e.length; s++) {
      let t = e[s];
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
    let s = "";
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += o || "";
          continue;
        }
      }
      let l = i;
      switch (l.type) {
        case "escape": {
          s += r.text(l);
          break;
        }
        case "html": {
          s += r.html(l);
          break;
        }
        case "link": {
          s += r.link(l);
          break;
        }
        case "image": {
          s += r.image(l);
          break;
        }
        case "checkbox": {
          s += r.checkbox(l);
          break;
        }
        case "strong": {
          s += r.strong(l);
          break;
        }
        case "em": {
          s += r.em(l);
          break;
        }
        case "codespan": {
          s += r.codespan(l);
          break;
        }
        case "br": {
          s += r.br(l);
          break;
        }
        case "del": {
          s += r.del(l);
          break;
        }
        case "text": {
          s += r.text(l);
          break;
        }
        default: {
          let o = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return s;
  }
}, P = class {
  options;
  block;
  constructor(n) {
    this.options = n || T;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(n) {
    return n;
  }
  postprocess(n) {
    return n;
  }
  processAllTokens(n) {
    return n;
  }
  emStrongMask(n) {
    return n;
  }
  provideLexer() {
    return this.block ? w.lex : w.lexInline;
  }
  provideParser() {
    return this.block ? m.parse : m.parseInline;
  }
}, at = class {
  defaults = j();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = m;
  Renderer = C;
  TextRenderer = U;
  Lexer = w;
  Tokenizer = B;
  Hooks = P;
  constructor(...n) {
    this.use(...n);
  }
  walkTokens(n, e) {
    let r = [];
    for (let s of n) switch (r = r.concat(e.call(this, s)), s.type) {
      case "table": {
        let t = s;
        for (let i of t.header) r = r.concat(this.walkTokens(i.tokens, e));
        for (let i of t.rows) for (let l of i) r = r.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = s;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = s;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((i) => {
          let l = t[i].flat(1 / 0);
          r = r.concat(this.walkTokens(l, e));
        }) : t.tokens && (r = r.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return r;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((r) => {
      let s = { ...r };
      if (s.async = this.defaults.async || s.async || !1, r.extensions && (r.extensions.forEach((t) => {
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
      }), s.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new C(this.defaults);
        for (let i in r.renderer) {
          if (!(i in t)) throw new Error(\`renderer '\${i}' does not exist\`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, o = r.renderer[l], a = t[l];
          t[l] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c || "";
          };
        }
        s.renderer = t;
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
        s.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new P();
        for (let i in r.hooks) {
          if (!(i in t)) throw new Error(\`hook '\${i}' does not exist\`);
          if (["options", "block"].includes(i)) continue;
          let l = i, o = r.hooks[l], a = t[l];
          P.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(i)) return (async () => {
              let u = await o.call(t, h);
              return a.call(t, u);
            })();
            let c = o.call(t, h);
            return a.call(t, c);
          } : t[l] = (...h) => {
            if (this.defaults.async) return (async () => {
              let u = await o.apply(t, h);
              return u === !1 && (u = await a.apply(t, h)), u;
            })();
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        s.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, i = r.walkTokens;
        s.walkTokens = function(l) {
          let o = [];
          return o.push(i.call(this, l)), t && (o = o.concat(t.call(this, l))), o;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return w.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return m.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, r) => {
      let s = { ...r }, t = { ...this.defaults, ...s }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = n), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, o = await (t.hooks ? await t.hooks.provideLexer() : n ? w.lex : w.lexInline)(l, t), a = t.hooks ? await t.hooks.processAllTokens(o) : o;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : n ? m.parse : m.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : n ? w.lex : w.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let o = (t.hooks ? t.hooks.provideParser() : n ? m.parse : m.parseInline)(l, t);
        return t.hooks && (o = t.hooks.postprocess(o)), o;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(n, e) {
    return (r) => {
      if (r.message += \`
Please report this to https://github.com/markedjs/marked.\`, n) {
        let s = "<p>An error occurred:</p><pre>" + y(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, R = new at();
function k(n, e) {
  return R.parse(n, e);
}
k.options = k.setOptions = function(n) {
  return R.setOptions(n), k.defaults = R.defaults, le(k.defaults), k;
};
k.getDefaults = j;
k.defaults = T;
k.use = function(...n) {
  return R.use(...n), k.defaults = R.defaults, le(k.defaults), k;
};
k.walkTokens = function(n, e) {
  return R.walkTokens(n, e);
};
k.parseInline = R.parseInline;
k.Parser = m;
k.parser = m.parse;
k.Renderer = C;
k.TextRenderer = U;
k.Lexer = w;
k.lexer = w.lex;
k.Tokenizer = B;
k.Hooks = P;
k.parse = k;
k.options;
k.setOptions;
k.use;
k.walkTokens;
k.parseInline;
m.parse;
w.lex;
function ot(n) {
  if (n.startsWith("---")) {
    const e = n.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = n.slice(3, e + 0).trim(), s = n.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((i) => {
        const l = i.match(/^([^:]+):\\s*(.*)$/);
        l && (t[l[1].trim()] = l[2].trim());
      }), { content: s, data: t };
    }
  }
  return { content: n, data: {} };
}
let b = null;
const ct = "https://cdn.jsdelivr.net/npm/highlight.js@11.8.0";
async function ht() {
  if (b) return b;
  try {
    const n = await import(ct + "/lib/core.js");
    b = n.default || n;
  } catch {
    b = null;
  }
  return b;
}
function pt(n) {
  const e = n.split(\`
\`), r = [];
  for (const s of e) {
    const t = s.match(/^(#{1,6})\\s+(.*)$/);
    t && r.push({ level: t[1].length, text: t[2].trim() });
  }
  return r;
}
k.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (n, e) => {
    try {
      return e && b.getLanguage(e) ? b.highlight(n, { language: e }).value : b && typeof b.getLanguage == "function" && b.getLanguage("plaintext") ? b.highlight(n, { language: "plaintext" }).value : n;
    } catch {
      return n;
    }
  }
});
onmessage = async (n) => {
  const e = n.data || {};
  try {
    if (e.type === "register") {
      const { name: a, url: h } = e;
      try {
        await ht();
        const c = await import(h), u = c.default || c;
        b.registerLanguage(a, u), postMessage({ type: "registered", name: a });
      } catch (c) {
        postMessage({ type: "register-error", name: a, error: String(c) });
      }
      return;
    }
    const { id: r, md: s } = e, { content: t, data: i } = ot(s || ""), l = k.parse(t), o = pt(t);
    postMessage({ id: r, result: { html: l, meta: i || {}, toc: o } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`, ur = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Gr], { type: "text/javascript;charset=utf-8" });
function da(t) {
  let e;
  try {
    if (e = ur && (self.URL || self.webkitURL).createObjectURL(ur), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Gr),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function fa(t) {
  if (t.startsWith("---")) {
    const e = t.indexOf(`
---`, 3);
    if (e !== -1) {
      const n = t.slice(3, e + 0).trim(), s = t.slice(e + 4).trimStart(), r = {};
      return n.split(/\r?\n/).forEach((i) => {
        const a = i.match(/^([^:]+):\s*(.*)$/);
        a && (r[a[1].trim()] = a[2].trim());
      }), { content: s, data: r };
    }
  }
  return { content: t, data: {} };
}
const Xr = Rr(() => new da(), "markdown"), hr = typeof DOMParser < "u" ? new DOMParser() : null;
function mn() {
  return Xr.get();
}
function ga(t) {
  return Xr.send(t, 1e3);
}
const Ze = [];
function wn(t) {
  if (t && typeof t == "object") {
    Ze.push(t);
    try {
      K.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function ma(t) {
  Ze.length = 0, Array.isArray(t) && Ze.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Ze.forEach((e) => K.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Wt(t) {
  if (mn && mn())
    try {
      const i = await ga({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const o = (hr || new DOMParser()).parseFromString(i.html, "text/html"), l = o.querySelectorAll("h1,h2,h3,h4,h5,h6");
          l.forEach((c) => {
            c.id || (c.id = re(c.textContent || ""));
          });
          try {
            o.querySelectorAll("img").forEach((d) => {
              try {
                d.getAttribute("loading") || d.setAttribute("data-want-lazy", "1");
              } catch (f) {
                console.warn("[markdown] set image loading attribute failed", f);
              }
            });
          } catch (c) {
            console.warn("[markdown] query images failed", c);
          }
          try {
            o.querySelectorAll("pre code").forEach((d) => {
              try {
                const f = d.getAttribute && d.getAttribute("class") || d.className || "", g = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
                if (g)
                  try {
                    d.setAttribute && d.setAttribute("class", g);
                  } catch (y) {
                    console.warn("[markdown] set code class failed", y), d.className = g;
                  }
                else
                  try {
                    d.removeAttribute && d.removeAttribute("class");
                  } catch (y) {
                    console.warn("[markdown] remove code class failed", y), d.className = "";
                  }
                const m = g, w = m.match(/language-([a-zA-Z0-9_+-]+)/) || m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!w || !w[1])
                  try {
                    const y = d.textContent || "";
                    try {
                      if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                        const S = oe.highlight(y, { language: "plaintext" });
                        S && S.value && (d.innerHTML = S.value);
                      }
                    } catch {
                      try {
                        oe.highlightElement(d);
                      } catch (N) {
                        console.warn("[markdown] hljs.highlightElement failed", N);
                      }
                    }
                  } catch (y) {
                    console.warn("[markdown] code auto-detect failed", y);
                  }
              } catch (f) {
                console.warn("[markdown] processing code blocks failed", f);
              }
            });
          } catch (c) {
            console.warn("[markdown] query code blocks failed", c);
          }
          const u = o.body.innerHTML, h = [];
          return l.forEach((c) => {
            h.push({ level: Number(c.tagName.substring(1)), text: (c.textContent || "").trim(), id: c.id });
          }), { html: u, meta: i.meta || {}, toc: h };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), i;
        }
    } catch (i) {
      console.warn("[markdown] worker render failed", i);
    }
  const { content: n, data: s } = fa(t || "");
  if (K.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Ze && Ze.length)
    try {
      Ze.forEach((i) => K.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let r = K.parse(n);
  try {
    const a = (hr || new DOMParser()).parseFromString(r, "text/html"), o = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    o.forEach((u) => {
      u.id || (u.id = re(u.textContent || ""));
    });
    try {
      a.querySelectorAll("img").forEach((h) => {
        try {
          h.getAttribute("loading") || h.setAttribute("data-want-lazy", "1");
        } catch (c) {
          console.warn("[markdown] set image loading attribute failed", c);
        }
      });
    } catch (u) {
      console.warn("[markdown] query images failed", u);
    }
    try {
      a.querySelectorAll("pre code").forEach((h) => {
        try {
          const c = h.getAttribute && h.getAttribute("class") || h.className || "", d = String(c || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (d)
            try {
              h.setAttribute && h.setAttribute("class", d);
            } catch (m) {
              console.warn("[markdown] set code class failed", m), h.className = d;
            }
          else
            try {
              h.removeAttribute && h.removeAttribute("class");
            } catch (m) {
              console.warn("[markdown] remove code class failed", m), h.className = "";
            }
          const f = d, g = f.match(/language-([a-zA-Z0-9_+-]+)/) || f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!g || !g[1])
            try {
              const m = h.textContent || "";
              try {
                if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                  const w = oe.highlight(m, { language: "plaintext" });
                  w && w.value && (h.innerHTML = w.value);
                }
              } catch {
                try {
                  oe.highlightElement(h);
                } catch (y) {
                  console.warn("[markdown] hljs.highlightElement failed", y);
                }
              }
            } catch (m) {
              console.warn("[markdown] code auto-detect failed", m);
            }
        } catch (c) {
          console.warn("[markdown] processing code blocks failed", c);
        }
      });
    } catch (u) {
      console.warn("[markdown] query code blocks failed", u);
    }
    r = a.body.innerHTML;
    const l = [];
    return o.forEach((u) => {
      l.push({ level: Number(u.tagName.substring(1)), text: (u.textContent || "").trim(), id: u.id });
    }), { html: a.body.innerHTML, meta: s || {}, toc: l };
  } catch (i) {
    console.warn("post-process markdown failed", i);
  }
  return { html: r, meta: s || {}, toc: [] };
}
function bn(t, e) {
  const n = /* @__PURE__ */ new Set(), s = /```\s*([a-zA-Z0-9_\-+]+)?/g, r = /* @__PURE__ */ new Set([
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
  ]), i = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
  let a;
  for (; a = s.exec(t); )
    if (a[1]) {
      const o = a[1].toLowerCase();
      if (yr.has(o) || e && e.size && o.length < 3 && !e.has(o) && !(qe && qe[o] && e.has(qe[o]))) continue;
      if (e && e.size) {
        if (e.has(o)) {
          const u = e.get(o);
          u && n.add(u);
          continue;
        }
        if (qe && qe[o]) {
          const u = qe[o];
          if (e.has(u)) {
            const h = e.get(u) || u;
            n.add(h);
            continue;
          }
        }
      }
      (i.has(o) || o.length >= 5 && o.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(o) && !r.has(o)) && n.add(o);
    }
  return n;
}
const wa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: wn,
  detectFenceLanguages: bn,
  initRendererWorker: mn,
  markdownPlugins: Ze,
  parseMarkdownToHtml: Wt,
  setMarkdownExtensions: ma
}, Symbol.toStringTag, { value: "Module" }));
function ba(t, e) {
  const n = document.createElement("aside");
  n.className = "menu nimbi-nav";
  const s = document.createElement("p");
  s.className = "menu-label", s.textContent = t("navigation"), n.appendChild(s);
  const r = document.createElement("ul");
  return r.className = "menu-list", e.forEach((i) => {
    const a = document.createElement("li"), o = document.createElement("a");
    if (o.href = "#" + i.path, o.textContent = i.name, a.appendChild(o), i.children && i.children.length) {
      const l = document.createElement("ul");
      i.children.forEach((u) => {
        const h = document.createElement("li"), c = document.createElement("a");
        c.href = "#" + u.path, c.textContent = u.name, h.appendChild(c), l.appendChild(h);
      }), a.appendChild(l);
    }
    r.appendChild(a);
  }), n.appendChild(r), n;
}
function ka(t, e, n = "") {
  const s = document.createElement("aside");
  s.className = "menu nimbi-toc-inner";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), s.appendChild(r);
  const i = document.createElement("ul");
  return i.className = "menu-list", e.forEach((a) => {
    if (a.level === 1) return;
    const o = document.createElement("li"), l = document.createElement("a"), u = a.id || re(a.text);
    try {
      const h = String(n || "").replace(/^[\.\/]+/, ""), c = h && H && H.has && H.has(h) ? H.get(h) : h;
      c ? l.href = `?page=${encodeURIComponent(c)}#${encodeURIComponent(u)}` : l.href = `?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`;
    } catch (h) {
      console.warn("[htmlBuilder] buildTocElement href normalization failed", h);
      const c = String(n || "").replace(/^[\.\/]+/, ""), d = c && H && H.has && H.has(c) ? H.get(c) : c;
      d ? l.href = `?page=${encodeURIComponent(d)}#${encodeURIComponent(u)}` : l.href = `?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`;
    }
    l.textContent = a.text, o.appendChild(l), i.appendChild(o);
  }), s.appendChild(i), s;
}
function Yr(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = re(n.textContent || ""));
  });
}
function ya(t, e, n) {
  try {
    const s = t.querySelectorAll("img");
    if (s && s.length) {
      const r = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      s.forEach((i) => {
        const a = i.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const o = new URL(r + a, n).toString();
            i.src = o;
            try {
              i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (o) {
            console.warn("[htmlBuilder] resolve image src failed", o);
          }
      });
    }
  } catch (s) {
    console.warn("[htmlBuilder] lazyLoadImages failed", s);
  }
}
let pr = "", ln = null, dr = "";
async function Kr(t, e, n) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let r, i;
    e === pr && ln ? (r = ln, i = dr) : (r = new URL(e), i = Zt(r.pathname), pr = e, ln = r, dr = i);
    const a = /* @__PURE__ */ new Set(), o = [];
    for (const l of Array.from(s))
      try {
        const u = l.getAttribute("href") || "";
        if (!u || Ar(u) || u.startsWith("/") && !u.endsWith(".md")) continue;
        const h = u.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (h) {
          let c = h[1];
          const d = h[2];
          !c.startsWith("/") && n && (c = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + c);
          try {
            const f = new URL(c, e).pathname;
            let g = f.startsWith(i) ? f.slice(i.length) : f;
            g = me(g), o.push({ node: l, mdPathRaw: c, frag: d, rel: g }), H.has(g) || a.add(g);
          } catch (f) {
            console.warn("[htmlBuilder] resolve mdPath failed", f);
          }
          continue;
        }
        try {
          const d = new URL(u, e).pathname || "";
          if (d && d.indexOf(i) !== -1) {
            let f = d.startsWith(i) ? d.slice(i.length) : d;
            if (f = me(f), f = kt(f), f || (f = "_home"), !f.endsWith(".md"))
              if (Z.has(f)) {
                const g = Z.get(f), m = H.get(g) || f;
                l.setAttribute("href", `?page=${encodeURIComponent(m)}`);
              } else
                l.setAttribute("href", `?page=${encodeURIComponent(f)}`);
          }
        } catch (c) {
          console.warn("[htmlBuilder] resolving href to URL failed", c);
        }
      } catch (u) {
        console.warn("[htmlBuilder] processing anchor failed", u);
      }
    a.size && await Promise.all(Array.from(a).map(async (l) => {
      try {
        try {
          const h = String(l).match(/([^\/]+)\.md$/), c = h && h[1];
          if (c && Z.has(c)) {
            try {
              const d = Z.get(c);
              if (d)
                try {
                  H.set(d, c);
                } catch (f) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", f);
                }
            } catch (d) {
              console.warn("[htmlBuilder] reading slugToMd failed", d);
            }
            return;
          }
        } catch (h) {
          console.warn("[htmlBuilder] basename slug lookup failed", h);
        }
        const u = await xe(l, e);
        if (u && u.raw) {
          const h = (u.raw || "").match(/^#\s+(.+)$/m);
          if (h && h[1]) {
            const c = re(h[1].trim());
            if (c)
              try {
                Z.set(c, l), H.set(l, c);
              } catch (d) {
                console.warn("[htmlBuilder] setting slug mapping failed", d);
              }
          }
        }
      } catch (u) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", u);
      }
    }));
    for (const l of o) {
      const { node: u, frag: h, rel: c } = l;
      let d = null;
      try {
        H.has(c) && (d = H.get(c));
      } catch (f) {
        console.warn("[htmlBuilder] mdToSlug access failed", f);
      }
      d ? h ? u.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(h)}`) : u.setAttribute("href", `?page=${encodeURIComponent(d)}`) : h ? u.setAttribute("href", `?page=${encodeURIComponent(c)}#${encodeURIComponent(h)}`) : u.setAttribute("href", `?page=${encodeURIComponent(c)}`);
    }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteAnchors failed", s);
  }
}
function xa(t, e, n, s) {
  const r = e.querySelector("h1"), i = r ? (r.textContent || "").trim() : "";
  let a = "";
  try {
    i && (a = re(i)), !a && t && t.meta && t.meta.title && (a = re(t.meta.title)), !a && n && (a = re(String(n))), a || (a = "_home");
    try {
      n && (Z.set(a, n), H.set(n, a));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = "?page=" + encodeURIComponent(a);
      try {
        const l = s || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        l && (o += "#" + encodeURIComponent(l));
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", l);
      }
      try {
        history.replaceState({ page: a }, "", o);
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug history replace failed", l);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (o) {
    console.warn("[htmlBuilder] computeSlug failed", o);
  }
  return { topH1: r, h1Text: i, slugKey: a };
}
async function Sa(t, e) {
  if (!t || !t.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const l of Array.from(t || []))
    try {
      const u = l.getAttribute("href") || "";
      if (!u) continue;
      let d = me(u).split(/::|#/, 2)[0];
      if (!d || (d.includes(".") || (d = d + ".html"), !/\.html(?:$|[?#])/.test(d) && !d.toLowerCase().endsWith(".html"))) continue;
      const f = d;
      try {
        if (H && H.has && H.has(f)) continue;
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug check failed", g);
      }
      try {
        let g = !1;
        for (const m of Z.values())
          if (m === f) {
            g = !0;
            break;
          }
        if (g) continue;
      } catch (g) {
        console.warn("[htmlBuilder] slugToMd iteration failed", g);
      }
      n.add(f);
    } catch (u) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", u);
    }
  if (!n.size) return;
  const s = async (l) => {
    try {
      const u = await xe(l, e);
      if (u && u.raw)
        try {
          const c = (Vr || new DOMParser()).parseFromString(u.raw, "text/html"), d = c.querySelector("title"), f = c.querySelector("h1"), g = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : f && f.textContent ? f.textContent.trim() : null;
          if (g) {
            const m = re(g);
            if (m)
              try {
                Z.set(m, l), H.set(l, m);
              } catch (w) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", w);
              }
          }
        } catch (h) {
          console.warn("[htmlBuilder] parse HTML title failed", h);
        }
    } catch (u) {
      console.warn("[htmlBuilder] fetchAndExtract failed", u);
    }
  }, r = 5, i = Array.from(n);
  let a = 0;
  const o = [];
  for (; a < i.length; ) {
    const l = i.slice(a, a + r);
    o.push(Promise.all(l.map(s))), a += r;
  }
  await Promise.all(o);
}
async function va(t, e) {
  if (!t || !t.length) return;
  const n = [], s = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const i = new URL(e);
    r = Zt(i.pathname);
  } catch (i) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", i);
  }
  for (const i of Array.from(t || []))
    try {
      const a = i.getAttribute("href") || "";
      if (!a) continue;
      const o = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (o) {
        let l = me(o[1]);
        try {
          let u;
          try {
            u = new URL(l, e).pathname;
          } catch (c) {
            u = l, console.warn("[htmlBuilder] resolve mdPath URL failed", c);
          }
          const h = u.startsWith(r) ? u.slice(r.length) : u.replace(/^\//, "");
          n.push({ rel: h }), H.has(h) || s.add(h);
        } catch (u) {
          console.warn("[htmlBuilder] rewriteAnchors failed", u);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  s.size && await Promise.all(Array.from(s).map(async (i) => {
    try {
      const a = String(i).match(/([^\/]+)\.md$/), o = a && a[1];
      if (o && Z.has(o)) {
        try {
          const l = Z.get(o);
          l && H.set(l, o);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await xe(i, e);
      if (a && a.raw) {
        const o = (a.raw || "").match(/^#\s+(.+)$/m);
        if (o && o[1]) {
          const l = re(o[1].trim());
          if (l)
            try {
              Z.set(l, i), H.set(i, l);
            } catch (u) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", u);
            }
        }
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", a);
    }
  }));
}
const Vr = typeof DOMParser < "u" ? new DOMParser() : null;
function Ea(t) {
  try {
    const n = (Vr || new DOMParser()).parseFromString(t || "", "text/html");
    Yr(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (l) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", l);
        }
      });
    } catch (a) {
      console.warn("[htmlBuilder] parseHtml query images failed", a);
    }
    n.querySelectorAll("pre code, code[class]").forEach((a) => {
      try {
        const o = a.getAttribute && a.getAttribute("class") || a.className || "", l = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const u = (l[1] || "").toLowerCase(), h = V.size && (V.get(u) || V.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await bt(h);
              } catch (c) {
                console.warn("[htmlBuilder] registerLanguage failed", c);
              }
            })();
          } catch (c) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", c);
          }
        } else
          try {
            if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
              const u = oe.highlight ? oe.highlight(a.textContent || "", { language: "plaintext" }) : null;
              u && u.value && (a.innerHTML = u.value);
            }
          } catch (u) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", u);
          }
      } catch (o) {
        console.warn("[htmlBuilder] code element processing failed", o);
      }
    });
    const r = [];
    return n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((a) => {
      r.push({ level: Number(a.tagName.substring(1)), text: (a.textContent || "").trim(), id: a.id });
    }), { html: n.body.innerHTML, meta: {}, toc: r };
  } catch (e) {
    return console.warn("[htmlBuilder] parseHtml failed", e), { html: t || "", meta: {}, toc: [] };
  }
}
async function Ra(t) {
  const e = bn ? bn(t || "", V) : /* @__PURE__ */ new Set(), n = new Set(e), s = [];
  for (const r of n)
    try {
      const i = V.size && (V.get(r) || V.get(String(r).toLowerCase())) || r;
      try {
        s.push(bt(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(r) !== String(i))
        try {
          s.push(bt(r));
        } catch (a) {
          console.warn("[htmlBuilder] ensureLanguages push alias failed", a);
        }
    } catch (i) {
      console.warn("[htmlBuilder] ensureLanguages inner failed", i);
    }
  try {
    await Promise.all(s);
  } catch (r) {
    console.warn("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function Aa(t) {
  if (await Ra(t), Wt) {
    const e = await Wt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Ta(t, e, n, s, r) {
  let i = null;
  e.isHtml ? i = Ea(e.raw || "") : i = await Aa(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    Yr(a);
  } catch (c) {
    console.warn("[htmlBuilder] addHeadingIds failed", c);
  }
  try {
    a.querySelectorAll("pre code, code[class]").forEach((d) => {
      try {
        const f = d.getAttribute && d.getAttribute("class") || d.className || "", g = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (g)
          try {
            d.setAttribute && d.setAttribute("class", g);
          } catch (m) {
            d.className = g, console.warn("[htmlBuilder] set element class failed", m);
          }
        else
          try {
            d.removeAttribute && d.removeAttribute("class");
          } catch (m) {
            d.className = "", console.warn("[htmlBuilder] remove element class failed", m);
          }
      } catch (f) {
        console.warn("[htmlBuilder] code element cleanup failed", f);
      }
    });
  } catch (c) {
    console.warn("[htmlBuilder] processing code elements failed", c);
  }
  try {
    Js(a);
  } catch (c) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", c);
  }
  ya(a, n, r);
  try {
    await Ca(a, r, n);
  } catch (c) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", c), await Kr(a, r, n);
  }
  const { topH1: o, h1Text: l, slugKey: u } = xa(i, a, n, s), h = ka(t, i.toc, n);
  return { article: a, parsed: i, toc: h, topH1: o, h1Text: l, slugKey: u };
}
function fr(t, e, n) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", s.appendChild(r), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function Ca(t, e, n) {
  return Kr(t, e, n);
}
function _a(t) {
  try {
    t.addEventListener("click", (e) => {
      const n = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!n) return;
      const s = n.getAttribute("href") || "";
      try {
        const r = new URL(s, location.href), i = r.searchParams.get("page"), a = r.hash ? r.hash.replace(/^#/, "") : null;
        if (!i && !a) return;
        e.preventDefault();
        let o = null;
        try {
          history && history.state && history.state.page && (o = history.state.page);
        } catch (l) {
          o = null, console.warn("[htmlBuilder] access history.state failed", l);
        }
        try {
          o || (o = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          console.warn("[htmlBuilder] parse current location failed", l);
        }
        if (!i && a || i && o && String(i) === String(o)) {
          try {
            if (!i && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: o || i }, "", "?page=" + encodeURIComponent(o || i) + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
          } catch (l) {
            console.warn("[htmlBuilder] update history for anchor failed", l);
          }
          try {
            e.stopImmediatePropagation && e.stopImmediatePropagation(), e.stopPropagation && e.stopPropagation();
          } catch (l) {
            console.warn("[htmlBuilder] stopPropagation failed", l);
          }
          try {
            kn(a);
          } catch (l) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", l);
          }
          return;
        }
        history.pushState({ page: i }, "", "?page=" + encodeURIComponent(i) + (a ? "#" + encodeURIComponent(a) : ""));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (l) {
              console.warn("[htmlBuilder] window.renderByQuery failed", l);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (l) {
              console.warn("[htmlBuilder] dispatch popstate failed", l);
            }
          else
            try {
              renderByQuery();
            } catch (l) {
              console.warn("[htmlBuilder] renderByQuery failed", l);
            }
        } catch (l) {
          console.warn("[htmlBuilder] SPA navigation invocation failed", l);
        }
      } catch (r) {
        console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (e) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", e);
  }
}
function kn(t) {
  const e = document.querySelector(".nimbi-cms") || null;
  if (t) {
    const n = document.getElementById(t);
    if (n)
      try {
        const s = () => {
          try {
            if (e && e.scrollTo && e.contains(n)) {
              const r = n.getBoundingClientRect().top - e.getBoundingClientRect().top + e.scrollTop;
              e.scrollTo({ top: r, behavior: "smooth" });
            } else
              try {
                n.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch {
                try {
                  n.scrollIntoView();
                } catch (i) {
                  console.warn("[htmlBuilder] scrollIntoView failed", i);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (i) {
              console.warn("[htmlBuilder] final scroll fallback failed", i);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(s, 50));
        } catch (r) {
          console.warn("[htmlBuilder] scheduling scroll failed", r), setTimeout(s, 50);
        }
      } catch (s) {
        try {
          n.scrollIntoView();
        } catch (r) {
          console.warn("[htmlBuilder] final scroll fallback failed", r);
        }
        console.warn("[htmlBuilder] doScroll failed", s);
      }
  } else
    try {
      e && e.scrollTo ? e.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (s) {
        console.warn("[htmlBuilder] window.scrollTo failed", s);
      }
      console.warn("[htmlBuilder] scroll to top failed", n);
    }
}
function La(t, e, { mountOverlay: n = null, container: s = null, mountEl: r = null, navWrap: i = null, t: a = null } = {}) {
  try {
    const o = a || ((m) => typeof m == "string" ? m : ""), l = s || document.querySelector(".nimbi-cms"), u = r || document.querySelector(".nimbi-mount"), h = n || document.querySelector(".nimbi-overlay"), c = i || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top", f.setAttribute("aria-label", o("scrollToTop")), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        h && h.appendChild ? h.appendChild(f) : l && l.appendChild ? l.appendChild(f) : u && u.appendChild ? u.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (w) {
          console.warn("[htmlBuilder] append scroll top button failed", w);
        }
      }
      try {
        f.style.position = "absolute", f.style.right = "1rem", f.style.bottom = "1.25rem", f.style.zIndex = "60";
      } catch (m) {
        console.warn("[htmlBuilder] set scroll-top button styles failed", m);
      }
      f.addEventListener("click", () => {
        try {
          s && s.scrollTo ? s.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            s && (s.scrollTop = 0);
          } catch (w) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", w);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (w) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", w);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (w) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", w);
          }
        }
      });
    }
    const g = c && c.querySelector ? c.querySelector(".menu-label") : null;
    if (e) {
      if (!f._nimbiObserver) {
        const m = new IntersectionObserver((w) => {
          for (const y of w)
            y.target instanceof Element && (y.isIntersecting ? (f.classList.remove("show"), g && g.classList.remove("show")) : (f.classList.add("show"), g && g.classList.add("show")));
        }, { root: s instanceof Element ? s : r instanceof Element ? r : null, threshold: 0 });
        f._nimbiObserver = m;
      }
      try {
        f._nimbiObserver.disconnect();
      } catch (m) {
        console.warn("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        f._nimbiObserver.observe(e);
      } catch (m) {
        console.warn("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const w = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, y = e.getBoundingClientRect();
            !(y.bottom < w.top || y.top > w.bottom) ? (f.classList.remove("show"), g && g.classList.remove("show")) : (f.classList.add("show"), g && g.classList.add("show"));
          } catch (w) {
            console.warn("[htmlBuilder] checkIntersect failed", w);
          }
        };
        m(), "IntersectionObserver" in window || setTimeout(m, 100);
      } catch (m) {
        console.warn("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      f.classList.remove("show"), g && g.classList.remove("show");
      const m = s instanceof Element ? s : r instanceof Element ? r : window, w = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (f.classList.add("show"), g && g.classList.add("show")) : (f.classList.remove("show"), g && g.classList.remove("show"));
        } catch (y) {
          console.warn("[htmlBuilder] onScroll handler failed", y);
        }
      };
      Ot(() => m.addEventListener("scroll", w)), w();
    }
  } catch (o) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", o);
  }
}
async function Ma(t, e, n, s, r, i, a, o, l = "eager", u = 1, h = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const c = typeof DOMParser < "u" ? new DOMParser() : null, d = c ? c.parseFromString(n || "", "text/html") : null, f = d ? d.querySelectorAll("a") : [];
  await Ot(() => Sa(f, s)), await Ot(() => va(f, s));
  let g = null, m = null, w = !1;
  const y = document.createElement("nav");
  y.className = "navbar", y.setAttribute("role", "navigation"), y.setAttribute("aria-label", "main navigation");
  const S = document.createElement("div");
  S.className = "navbar-brand";
  const N = f[0], _ = document.createElement("a");
  if (_.className = "navbar-item", N) {
    const C = N.getAttribute("href") || "#";
    try {
      const M = new URL(C, location.href).searchParams.get("page");
      M ? _.href = "?page=" + encodeURIComponent(decodeURIComponent(M)) : (_.href = "?page=" + encodeURIComponent(r), _.textContent = i("home"));
    } catch {
      _.href = "?page=" + encodeURIComponent(r), _.textContent = i("home");
    }
  } else
    _.href = "?page=" + encodeURIComponent(r), _.textContent = i("home");
  S.appendChild(_), _.addEventListener("click", function(C) {
    const Q = _.getAttribute("href") || "";
    if (Q.startsWith("?page=")) {
      C.preventDefault();
      const M = new URL(Q, location.href), v = M.searchParams.get("page"), b = M.hash ? M.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", "?page=" + encodeURIComponent(v) + (b ? "#" + encodeURIComponent(b) : ""));
      try {
        a();
      } catch (R) {
        console.warn("[nimbi-cms] renderByQuery failed", R);
      }
    }
  });
  const B = document.createElement("a");
  B.className = "navbar-burger", B.setAttribute("role", "button"), B.setAttribute("aria-label", "menu"), B.setAttribute("aria-expanded", "false");
  const I = "nimbi-navbar-menu";
  B.dataset.target = I, B.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', S.appendChild(B);
  try {
    B.addEventListener("click", (C) => {
      try {
        const Q = B.dataset && B.dataset.target ? B.dataset.target : null, M = Q ? document.getElementById(Q) : null;
        B.classList.contains("is-active") ? (B.classList.remove("is-active"), B.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active")) : (B.classList.add("is-active"), B.setAttribute("aria-expanded", "true"), M && M.classList.add("is-active"));
      } catch (Q) {
        console.warn("[nimbi-cms] navbar burger toggle failed", Q);
      }
    });
  } catch (C) {
    console.warn("[nimbi-cms] burger event binding failed", C);
  }
  const te = document.createElement("div");
  te.className = "navbar-menu", te.id = I;
  const le = document.createElement("div");
  le.className = "navbar-start";
  let ne, J, F;
  if (!o)
    ne = null, m = null, F = null;
  else {
    ne = document.createElement("div"), ne.className = "navbar-end", J = document.createElement("div"), J.className = "navbar-item", J.style.position = "relative", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = i("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0, m.classList.add("is-loading")), J.appendChild(m), F = document.createElement("div"), F.id = "nimbi-search-results", F.className = "box", F.style.position = "absolute", F.style.top = "100%", F.style.right = "0", F.style.left = "auto", F.style.zIndex = "10000", F.style.minWidth = "240px", F.style.maxWidth = "420px", F.style.maxHeight = "50vh", F.style.overflowY = "auto", F.style.display = "none", F.style.padding = "8px", F.style.boxShadow = "0 6px 18px rgba(10,10,10,0.1)", J.appendChild(F), ne.appendChild(J);
    const C = (M) => {
      if (F.innerHTML = "", !M.length) {
        F.style.display = "none";
        return;
      }
      M.forEach((v) => {
        const b = document.createElement("div");
        if (b.style.marginBottom = "6px", b.style.padding = "6px", b.style.borderBottom = "1px solid rgba(0,0,0,0.06)", v.parentTitle) {
          const k = document.createElement("div");
          k.textContent = v.parentTitle, k.style.fontSize = "11px", k.style.opacity = "0.7", k.style.marginBottom = "4px", k.className = "nimbi-search-parent", k.style.whiteSpace = "nowrap", k.style.overflow = "hidden", k.style.textOverflow = "ellipsis", k.style.display = "block", k.style.maxWidth = "100%", b.appendChild(k);
        }
        const R = document.createElement("a");
        R.className = "block", R.href = "?page=" + encodeURIComponent(v.slug), R.textContent = v.title, R.style.whiteSpace = "nowrap", R.style.overflow = "hidden", R.style.textOverflow = "ellipsis", R.addEventListener("click", () => {
          F.style.display = "none";
        }), b.appendChild(R), F.appendChild(b);
      }), F.style.display = "block", F.style.right = "0", F.style.left = "auto";
    }, Q = (M, v) => {
      let b = null;
      return (...R) => {
        b && clearTimeout(b), b = setTimeout(() => M(...R), v);
      };
    };
    if (m) {
      const M = Q(async () => {
        const v = document.querySelector("input#nimbi-search"), b = String(v && v.value || "").trim().toLowerCase();
        if (!b) {
          C([]);
          return;
        }
        try {
          const R = await Promise.resolve().then(() => It);
          g || (g = (async () => {
            try {
              return l === "lazy" && R.buildSearchIndexWorker ? R.buildSearchIndexWorker(s, u, h) : R.buildSearchIndex(s, u, h);
            } catch (X) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", X), [];
            } finally {
              v && (v.removeAttribute("disabled"), v.classList.remove("is-loading"));
            }
          })());
          const z = (await g).filter((X) => X.title && X.title.toLowerCase().includes(b) || X.excerpt && X.excerpt.toLowerCase().includes(b));
          C(z.slice(0, 10));
        } catch (R) {
          console.warn("[nimbi-cms] search input handler failed", R), C([]);
        }
      }, 50);
      m && m.addEventListener("input", M), document.addEventListener("click", (v) => {
        const b = document.querySelector("input#nimbi-search");
        b && !b.contains(v.target) && F && !F.contains(v.target) && (F.style.display = "none");
      });
    }
    if (l === "eager") {
      try {
        g = (async () => {
          try {
            const v = await (await Promise.resolve().then(() => It)).buildSearchIndex(s, u, h);
            return w || (w = !0), v;
          } catch (M) {
            return console.warn("[nimbi-cms] buildSearchIndex failed", M), [];
          }
        })();
      } catch (M) {
        console.warn("[nimbi-cms] eager search index init failed", M), g = Promise.resolve([]);
      }
      g.finally(() => {
        const M = document.querySelector("input#nimbi-search");
        M && (M.removeAttribute("disabled"), M.classList.remove("is-loading"));
      });
    }
  }
  for (let C = 0; C < f.length; C++) {
    const Q = f[C];
    if (C === 0) continue;
    const M = Q.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(M) || M.endsWith(".md")) {
        const R = me(M).split(/::|#/, 2), k = R[0], z = R[1];
        v.href = "?page=" + encodeURIComponent(k) + (z ? "#" + encodeURIComponent(z) : "");
      } else if (/\.html(?:$|[#?])/.test(M) || M.endsWith(".html")) {
        const R = me(M).split(/::|#/, 2);
        let k = R[0];
        k && !k.toLowerCase().endsWith(".html") && (k = k + ".html");
        const z = R[1];
        try {
          const X = await xe(k, s);
          if (X && X.raw)
            try {
              const Ee = new DOMParser().parseFromString(X.raw, "text/html"), Se = Ee.querySelector("title"), we = Ee.querySelector("h1"), fe = Se && Se.textContent && Se.textContent.trim() ? Se.textContent.trim() : we && we.textContent ? we.textContent.trim() : null;
              if (fe) {
                const Re = re(fe);
                if (Re) {
                  try {
                    Z.set(Re, k), H.set(k, Re);
                  } catch (Oe) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Oe);
                  }
                  v.href = "?page=" + encodeURIComponent(Re) + (z ? "#" + encodeURIComponent(z) : "");
                } else
                  v.href = "?page=" + encodeURIComponent(k) + (z ? "#" + encodeURIComponent(z) : "");
              } else
                v.href = "?page=" + encodeURIComponent(k) + (z ? "#" + encodeURIComponent(z) : "");
            } catch {
              v.href = "?page=" + encodeURIComponent(k) + (z ? "#" + encodeURIComponent(z) : "");
            }
          else
            v.href = M;
        } catch {
          v.href = M;
        }
      } else
        v.href = M;
    } catch (b) {
      console.warn("[nimbi-cms] nav item href parse failed", b), v.href = M;
    }
    try {
      const b = Q.textContent && String(Q.textContent).trim() ? String(Q.textContent).trim() : null;
      if (b)
        try {
          const R = re(b);
          if (R) {
            const k = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const X = new URL(k, location.href).searchParams.get("page");
              if (X) {
                const ae = decodeURIComponent(X);
                try {
                  Z.set(R, ae), H.set(ae, R);
                } catch (Ee) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ee);
                }
              }
            } catch (z) {
              console.warn("[nimbi-cms] nav slug mapping failed", z);
            }
          }
        } catch (R) {
          console.warn("[nimbi-cms] nav slug mapping failed", R);
        }
    } catch (b) {
      console.warn("[nimbi-cms] nav slug mapping failed", b);
    }
    v.textContent = Q.textContent || M, le.appendChild(v);
  }
  try {
    m = document.getElementById("nimbi-search");
    const C = document.getElementById("nimbi-search-results"), Q = (v) => {
      if (C.innerHTML = "", !v.length) {
        C.style.display = "none";
        return;
      }
      v.forEach((b) => {
        const R = document.createElement("div");
        if (R.style.marginBottom = "6px", R.style.padding = "6px", R.style.borderBottom = "1px solid rgba(0,0,0,0.06)", b.parentTitle) {
          const z = document.createElement("div");
          z.textContent = b.parentTitle, z.style.fontSize = "11px", z.style.opacity = "0.7", z.style.marginBottom = "4px", z.className = "nimbi-search-parent", z.style.whiteSpace = "nowrap", z.style.overflow = "hidden", z.style.textOverflow = "ellipsis", z.style.display = "block", z.style.maxWidth = "100%", R.appendChild(z);
        }
        const k = document.createElement("a");
        k.className = "block", k.href = "?page=" + encodeURIComponent(b.slug), k.textContent = b.title, k.style.whiteSpace = "nowrap", k.style.overflow = "hidden", k.style.textOverflow = "ellipsis", k.addEventListener("click", () => {
          C.style.display = "none";
        }), R.appendChild(k), C.appendChild(R);
      }), C.style.display = "block", C.style.right = "0", C.style.left = "auto";
    }, M = (v, b) => {
      let R = null;
      return (...k) => {
        R && clearTimeout(R), R = setTimeout(() => v(...k), b);
      };
    };
    if (m) {
      const v = M(async () => {
        const b = String(m.value || "").trim().toLowerCase();
        if (!b) {
          Q([]);
          return;
        }
        try {
          const R = await Promise.resolve().then(() => It);
          g || (g = (async () => {
            try {
              return l === "lazy" && R.buildSearchIndexWorker ? R.buildSearchIndexWorker(s, u, h) : R.buildSearchIndex(s, u, h);
            } catch (X) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", X), [];
            } finally {
              m && (m.disabled = !1, m.classList.remove("is-loading"));
            }
          })());
          const z = (await g).filter((X) => X.title && X.title.toLowerCase().includes(b) || X.excerpt && X.excerpt.toLowerCase().includes(b));
          Q(z.slice(0, 10));
        } catch (R) {
          console.warn("[nimbi-cms] search input handler failed", R), Q([]);
        }
      }, 50);
      m.addEventListener("input", v), document.addEventListener("click", (b) => {
        m && !m.contains(b.target) && C && !C.contains(b.target) && (C.style.display = "none");
      });
    }
  } catch (C) {
    console.warn("[nimbi-cms] navbar/search setup inner failed", C);
  }
  te.appendChild(le), ne && te.appendChild(ne), y.appendChild(S), y.appendChild(te), t.appendChild(y);
  try {
    te.addEventListener("click", (C) => {
      const Q = C.target && C.target.closest ? C.target.closest("a") : null;
      if (!Q) return;
      const M = Q.getAttribute("href") || "";
      try {
        const v = new URL(M, location.href), b = v.searchParams.get("page"), R = v.hash ? v.hash.replace(/^#/, "") : null;
        if (b) {
          C.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (R ? "#" + encodeURIComponent(R) : ""));
          try {
            a();
          } catch (k) {
            console.warn("[nimbi-cms] renderByQuery failed", k);
          }
        }
      } catch (v) {
        console.warn("[nimbi-cms] navbar click handler failed", v);
      }
      try {
        const v = y && y.querySelector ? y.querySelector(".navbar-burger") : null, b = v && v.dataset ? v.dataset.target : null, R = b ? document.getElementById(b) : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), R && R.classList.remove("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (C) {
    console.warn("[nimbi-cms] attach content click handler failed", C);
  }
  try {
    e.addEventListener("click", (C) => {
      const Q = C.target && C.target.closest ? C.target.closest("a") : null;
      if (!Q) return;
      const M = Q.getAttribute("href") || "";
      if (M && !Ar(M))
        try {
          const v = new URL(M, location.href), b = v.searchParams.get("page"), R = v.hash ? v.hash.replace(/^#/, "") : null;
          if (b) {
            C.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (R ? "#" + encodeURIComponent(R) : ""));
            try {
              a();
            } catch (k) {
              console.warn("[nimbi-cms] renderByQuery failed", k);
            }
          }
        } catch (v) {
          console.warn("[nimbi-cms] container click URL parse failed", v);
        }
    });
  } catch (C) {
    console.warn("[nimbi-cms] build navbar failed", C);
  }
  return { navbar: y, linkEls: f };
}
var on, gr;
function $a() {
  if (gr) return on;
  gr = 1;
  function t(i, a) {
    return a.some(
      ([o, l]) => o <= i && i <= l
    );
  }
  function e(i) {
    if (typeof i != "string")
      return !1;
    const a = i.charCodeAt(0);
    return t(
      a,
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
  function n(i) {
    return ` 
\r	`.includes(i);
  }
  function s(i) {
    if (typeof i != "string")
      return !1;
    const a = i.charCodeAt(0);
    return t(
      a,
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
  function r(i, a = {}) {
    let o = 0, l = 0, u = i.length - 1;
    const h = a.wordsPerMinute || 200, c = a.wordBound || n;
    for (; c(i[l]); ) l++;
    for (; c(i[u]); ) u--;
    const d = `${i}
`;
    for (let w = l; w <= u; w++)
      if ((e(d[w]) || !c(d[w]) && (c(d[w + 1]) || e(d[w + 1]))) && o++, e(d[w]))
        for (; w <= u && (s(d[w + 1]) || c(d[w + 1])); )
          w++;
    const f = o / h, g = Math.round(f * 60 * 1e3);
    return {
      text: Math.ceil(f.toFixed(2)) + " min read",
      minutes: f,
      time: g,
      words: o
    };
  }
  return on = r, on;
}
var Pa = $a();
const Ia = /* @__PURE__ */ kr(Pa);
function mr(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function tt(t, e, n) {
  let s = `meta[${t}="${e}"]`, r = document.querySelector(s);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function za(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function Ba(t, e, n, s) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  tt("property", "og:title", r);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && tt("property", "og:description", i), tt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = n || t.image;
  a && (tt("property", "og:image", a), tt("name", "twitter:image", a));
}
function Oa(t, e, n, s, r = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  o && String(o).trim() && mr("description", o), mr("robots", i.robots || "index,follow"), Ba(i, e, n, o);
}
function Na() {
  try {
    const t = [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]'
    ];
    for (const e of t) {
      const n = document.querySelector(e);
      if (n) {
        const s = n.getAttribute("content") || "";
        if (s && s.trim()) return s.trim();
      }
    }
  } catch (t) {
    console.warn("[seoManager] getSiteNameFromMeta failed", t);
  }
  return "";
}
function Da(t, e, n, s, r, i = "") {
  try {
    const a = t.meta || {}, o = n && String(n).trim() ? n : a.title || i || document.title, l = r && String(r).trim() ? r : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = s || a.image || null;
    let h = "";
    try {
      if (e) {
        const g = me(e);
        try {
          h = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(g);
        } catch {
          h = location.href.split("#")[0];
        }
      } else
        h = location.href.split("#")[0];
    } catch (g) {
      h = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", g);
    }
    h && za("canonical", h);
    try {
      tt("property", "og:url", h);
    } catch (g) {
      console.warn("[seoManager] upsertMeta og:url failed", g);
    }
    const c = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o || "",
      description: l || "",
      url: h || location.href.split("#")[0]
    };
    u && (c.image = String(u)), a.date && (c.datePublished = a.date), a.dateModified && (c.dateModified = a.dateModified);
    const d = "nimbi-jsonld";
    let f = document.getElementById(d);
    f || (f = document.createElement("script"), f.type = "application/ld+json", f.id = d, document.head.appendChild(f)), f.textContent = JSON.stringify(c, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function qa(t, e, n, s, r, i, a, o, l, u, h) {
  try {
    const c = s.querySelector(".menu-label");
    c && (c.textContent = o && o.textContent || t("onThisPage"));
  } catch (c) {
    console.warn("[seoManager] update toc label failed", c);
  }
  try {
    const c = n.meta && n.meta.title ? String(n.meta.title).trim() : "", d = r.querySelector("img"), f = d && (d.getAttribute("src") || d.src) || null;
    let g = "";
    try {
      let w = "";
      try {
        const y = o || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let S = y.nextElementSibling;
          const N = [];
          for (; S && !(S.tagName && S.tagName.toLowerCase() === "h2"); ) {
            const _ = (S.textContent || "").trim();
            _ && N.push(_), S = S.nextElementSibling;
          }
          N.length && (w = N.join(" ").replace(/\s+/g, " ").trim()), !w && l && (w = String(l).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), g = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    try {
      Oa(n, l, f, g);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      Da(n, u, l, f, g, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Na();
    l ? m ? document.title = `${m} - ${l}` : document.title = `${e || "Site"} - ${l}` : c ? document.title = c : document.title = e || document.title;
  } catch (c) {
    console.warn("[seoManager] applyPageMeta failed", c);
  }
  try {
    const c = r.querySelector(".nimbi-reading-time");
    if (c && c.remove(), l) {
      const d = Ia(h.raw || ""), f = d && typeof d.minutes == "number" ? Math.ceil(d.minutes) : 0, g = document.createElement("p");
      g.className = "nimbi-reading-time", g.textContent = f ? t("readingTime", { minutes: f }) : "";
      const m = r.querySelector("h1");
      m && m.insertAdjacentElement("afterend", g);
    }
  } catch (c) {
    console.warn("[seoManager] reading time update failed", c);
  }
}
let ke = null, q = null, ye = 1, Fe = (t, e) => e, ft = 0, gt = 0, zt = () => {
}, ut = 0.25;
function Ua() {
  if (ke && document.contains(ke)) return ke;
  ke = null;
  const t = document.createElement("dialog");
  t.className = "nimbi-image-preview", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", Fe("imagePreviewTitle", "Image preview")), t.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="nimbi-image-preview__content" role="document">
        <button class="button is-small nimbi-image-preview__close" type="button" data-nimbi-preview-close>✕</button>
        <div class="nimbi-image-preview__image-wrapper">
          <img data-nimbi-preview-image alt="" />
        </div>
        <div class="nimbi-image-preview__controls">
          <div class="nimbi-image-preview__group">
            <button class="button is-small" type="button" data-nimbi-preview-fit>⤢</button>
            <button class="button is-small" type="button" data-nimbi-preview-original>1:1</button>
          </div>
          <div class="nimbi-image-preview__group">
            <button class="button is-small" type="button" data-nimbi-preview-zoom-out>−</button>
            <div class="nimbi-image-preview__zoom" data-nimbi-preview-zoom-label>100%</div>
            <button class="button is-small" type="button" data-nimbi-preview-zoom-in>＋</button>
            <button class="button is-small" type="button" data-nimbi-preview-reset>⟲</button>
          </div>
          <div class="nimbi-image-preview__hud" data-nimbi-preview-zoom-hud>100%</div>
        </div>
      </div>
    </div>
  `, t.addEventListener("click", (b) => {
    b.target === t && cn();
  }), t.addEventListener("wheel", (b) => {
    if (!J()) return;
    b.preventDefault();
    const R = b.deltaY < 0 ? ut : -ut;
    De(ye + R), u(), h();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      cn();
      return;
    }
    if (ye > 1) {
      const R = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!R) return;
      const k = 40;
      switch (b.key) {
        case "ArrowUp":
          R.scrollTop -= k, b.preventDefault();
          break;
        case "ArrowDown":
          R.scrollTop += k, b.preventDefault();
          break;
        case "ArrowLeft":
          R.scrollLeft -= k, b.preventDefault();
          break;
        case "ArrowRight":
          R.scrollLeft += k, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), ke = t, q = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), o = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function u() {
    o && (o.textContent = `${Math.round(ye * 100)}%`);
  }
  const h = () => {
    l && (l.textContent = `${Math.round(ye * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  zt = u, s.addEventListener("click", () => {
    De(ye + ut), u(), h();
  }), r.addEventListener("click", () => {
    De(ye - ut), u(), h();
  }), e.addEventListener("click", () => {
    mt(), u(), h();
  }), n.addEventListener("click", () => {
    De(1), u(), h();
  }), i.addEventListener("click", () => {
    mt(), u(), h();
  }), a.addEventListener("click", cn), e.title = Fe("imagePreviewFit", "Fit to screen"), n.title = Fe("imagePreviewOriginal", "Original size"), r.title = Fe("imagePreviewZoomOut", "Zoom out"), s.title = Fe("imagePreviewZoomIn", "Zoom in"), a.title = Fe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Fe("imagePreviewClose", "Close"));
  let c = !1, d = 0, f = 0, g = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let y = 0, S = 1;
  const N = (b, R) => {
    const k = b.x - R.x, z = b.y - R.y;
    return Math.hypot(k, z);
  }, _ = () => {
    c = !1, w.clear(), y = 0, q && (q.style.cursor = "all-scroll");
  };
  let B = 0, I = 0, te = 0;
  const le = (b) => {
    const R = Date.now(), k = R - B, z = b.clientX - I, X = b.clientY - te;
    B = R, I = b.clientX, te = b.clientY, k < 300 && Math.hypot(z, X) < 30 && (De(ye > 1 ? 1 : 2), u(), b.preventDefault());
  }, ne = (b) => {
    De(ye > 1 ? 1 : 2), u(), b.preventDefault();
  }, J = () => ke ? typeof ke.open == "boolean" ? ke.open : ke.classList.contains("is-active") : !1, F = (b, R, k = 1) => {
    if (w.has(k) && w.set(k, { x: b, y: R }), w.size === 2) {
      const Ee = Array.from(w.values()), Se = N(Ee[0], Ee[1]);
      if (y > 0) {
        const we = Se / y;
        De(S * we);
      }
      return;
    }
    if (!c) return;
    const z = q.closest(".nimbi-image-preview__image-wrapper");
    if (!z) return;
    const X = b - d, ae = R - f;
    z.scrollLeft = g - X, z.scrollTop = m - ae;
  }, C = (b, R, k = 1) => {
    if (!J()) return;
    if (w.set(k, { x: b, y: R }), w.size === 2) {
      const ae = Array.from(w.values());
      y = N(ae[0], ae[1]), S = ye;
      return;
    }
    const z = q.closest(".nimbi-image-preview__image-wrapper");
    !z || !(z.scrollWidth > z.clientWidth || z.scrollHeight > z.clientHeight) || (c = !0, d = b, f = R, g = z.scrollLeft, m = z.scrollTop, q.style.cursor = "all-scroll", window.addEventListener("pointermove", Q), window.addEventListener("pointerup", M), window.addEventListener("pointercancel", M));
  }, Q = (b) => {
    c && (b.preventDefault(), F(b.clientX, b.clientY, b.pointerId));
  }, M = () => {
    _(), window.removeEventListener("pointermove", Q), window.removeEventListener("pointerup", M), window.removeEventListener("pointercancel", M);
  };
  q.addEventListener("pointerdown", (b) => {
    b.preventDefault(), C(b.clientX, b.clientY, b.pointerId);
  }), q.addEventListener("pointermove", (b) => {
    (c || w.size === 2) && b.preventDefault(), F(b.clientX, b.clientY, b.pointerId);
  }), q.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && le(b), _();
  }), q.addEventListener("dblclick", ne), q.addEventListener("pointercancel", _), q.addEventListener("mousedown", (b) => {
    b.preventDefault(), C(b.clientX, b.clientY, 1);
  }), q.addEventListener("mousemove", (b) => {
    c && b.preventDefault(), F(b.clientX, b.clientY, 1);
  }), q.addEventListener("mouseup", (b) => {
    b.preventDefault(), _();
  });
  const v = t.querySelector(".nimbi-image-preview__image-wrapper");
  return v && (v.addEventListener("pointerdown", (b) => {
    C(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointermove", (b) => {
    F(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointerup", _), v.addEventListener("pointercancel", _), v.addEventListener("mousedown", (b) => {
    C(b.clientX, b.clientY, 1);
  }), v.addEventListener("mousemove", (b) => {
    F(b.clientX, b.clientY, 1);
  }), v.addEventListener("mouseup", _)), t;
}
function De(t) {
  if (!q) return;
  const e = Number(t);
  ye = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = q.getBoundingClientRect(), r = ft || q.naturalWidth || q.width || s.width || 0, i = gt || q.naturalHeight || q.height || s.height || 0;
  r && i ? (q.style.maxWidth = "none", q.style.maxHeight = "none", q.style.width = `${r * ye}px`, q.style.height = `${i * ye}px`, q.style.transform = "") : (q.style.maxWidth = "", q.style.maxHeight = "", q.style.width = "", q.style.height = "", q.style.transform = `scale(${ye})`), q && (q.style.cursor = "all-scroll");
}
function mt() {
  if (!q) return;
  const t = q.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = ft || q.naturalWidth || e.width, s = gt || q.naturalHeight || e.height;
  if (!n || !s) return;
  const r = e.width / n, i = e.height / s, a = Math.min(r, i, 1);
  De(Number.isFinite(a) ? a : 1);
}
function Ha(t, e = "", n = 0, s = 0) {
  const r = Ua();
  ye = 1, ft = n || 0, gt = s || 0, q.src = t, q.alt = e, q.style.transform = "scale(1)";
  const i = () => {
    ft = q.naturalWidth || q.width || 0, gt = q.naturalHeight || q.height || 0;
  };
  if (i(), mt(), zt(), requestAnimationFrame(() => {
    mt(), zt();
  }), !ft || !gt) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        mt(), zt();
      }), q.removeEventListener("load", a);
    };
    q.addEventListener("load", a);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active"), r.focus();
}
function cn() {
  ke && (typeof ke.close == "function" && ke.open && ke.close(), ke.classList.remove("is-active"));
}
function ja(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Fe = (f, g) => (typeof e == "function" ? e(f) : void 0) || g, ut = n, t.addEventListener("click", (f) => {
    const g = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!g || g.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      g
    );
    if (m.src) {
      if (f.defaultPrevented !== !0) {
        const w = m.closest("a");
        w && w.getAttribute("href") && f.preventDefault();
      }
      Ha(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
    }
  });
  let s = !1, r = 0, i = 0, a = 0, o = 0;
  const l = /* @__PURE__ */ new Map();
  let u = 0, h = 1;
  const c = (f, g) => {
    const m = f.x - g.x, w = f.y - g.y;
    return Math.hypot(m, w);
  };
  t.addEventListener("pointerdown", (f) => {
    const g = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!g || g.tagName !== "IMG" || !ke || !ke.open) return;
    if (l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      const w = Array.from(l.values());
      u = c(w[0], w[1]), h = ye;
      return;
    }
    const m = g.closest(".nimbi-image-preview__image-wrapper");
    m && (ye <= 1 || (f.preventDefault(), s = !0, r = f.clientX, i = f.clientY, a = m.scrollLeft, o = m.scrollTop, g.setPointerCapture(f.pointerId), g.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (f) => {
    if (l.has(f.pointerId) && l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      f.preventDefault();
      const S = Array.from(l.values()), N = c(S[0], S[1]);
      if (u > 0) {
        const _ = N / u;
        De(h * _);
      }
      return;
    }
    if (!s) return;
    f.preventDefault();
    const m = /** @type {HTMLElement} */ f.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = f.clientX - r, y = f.clientY - i;
    m.scrollLeft = a - w, m.scrollTop = o - y;
  });
  const d = () => {
    s = !1, l.clear(), u = 0;
  };
  t.addEventListener("pointerup", d), t.addEventListener("pointercancel", d);
}
function Fa(t) {
  const {
    contentWrap: e,
    navWrap: n,
    container: s,
    mountOverlay: r = null,
    t: i,
    contentBase: a,
    homePage: o,
    initialDocumentTitle: l,
    runHooks: u
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let h = null;
  const c = ba(i, [{ path: o, name: i("home"), isIndex: !0, children: [] }]);
  async function d(y, S) {
    let N, _, B;
    try {
      ({ data: N, pagePath: _, anchor: B } = await vi(y, a));
    } catch (C) {
      console.error("[nimbi-cms] fetchPageData failed", C), fr(e, i, C);
      return;
    }
    !B && S && (B = S);
    try {
      kn(null);
    } catch (C) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", C);
    }
    e.innerHTML = "";
    const { article: I, parsed: te, toc: le, topH1: ne, h1Text: J, slugKey: F } = await Ta(i, N, _, B, a);
    qa(i, l, te, le, I, _, B, ne, J, F, N), n.innerHTML = "", n.appendChild(le), _a(le);
    try {
      await u("transformHtml", { article: I, parsed: te, toc: le, pagePath: _, anchor: B, topH1: ne, h1Text: J, slugKey: F, data: N });
    } catch (C) {
      console.warn("[nimbi-cms] transformHtml hooks failed", C);
    }
    e.appendChild(I);
    try {
      ja(I, { t: i });
    } catch (C) {
      console.warn("[nimbi-cms] attachImagePreview failed", C);
    }
    try {
      Mt(s, 100, !1), requestAnimationFrame(() => Mt(s, 100, !1)), setTimeout(() => Mt(s, 100, !1), 250);
    } catch (C) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", C);
    }
    kn(B), La(I, ne, { mountOverlay: r, container: s, navWrap: n, t: i });
    try {
      await u("onPageLoad", { data: N, pagePath: _, anchor: B, article: I, toc: le, topH1: ne, h1Text: J, slugKey: F, contentWrap: e, navWrap: n });
    } catch (C) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", C);
    }
    h = _;
  }
  async function f() {
    let y = new URLSearchParams(location.search).get("page") || o;
    const S = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await d(y, S);
    } catch (N) {
      console.warn("[nimbi-cms] renderByQuery failed for", y, N), fr(e, i, N);
    }
  }
  window.addEventListener("popstate", f);
  const g = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const y = s || document.querySelector(".nimbi-cms");
      if (!y) return;
      const S = {
        top: y.scrollTop || 0,
        left: y.scrollLeft || 0
      };
      sessionStorage.setItem(g(), JSON.stringify(S));
    } catch {
    }
  }, w = () => {
    try {
      const y = s || document.querySelector(".nimbi-cms");
      if (!y) return;
      const S = sessionStorage.getItem(g());
      if (!S) return;
      const N = JSON.parse(S);
      N && typeof N.top == "number" && y.scrollTo({ top: N.top, left: N.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (y) => {
    if (y.persisted)
      try {
        w(), Mt(s, 100, !1);
      } catch (S) {
        console.warn("[nimbi-cms] bfcache restore failed", S);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      console.warn("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: f, siteNav: c, getCurrentPagePath: () => h };
}
function Wa(t) {
  try {
    const e = typeof t == "string" ? t : typeof window < "u" && window.location ? window.location.search : "";
    if (!e) return {};
    const n = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), s = {}, r = (i) => {
      if (i == null) return;
      const a = String(i).toLowerCase();
      if (a === "1" || a === "true" || a === "yes") return !0;
      if (a === "0" || a === "false" || a === "no") return !1;
    };
    if (n.has("contentPath") && (s.contentPath = n.get("contentPath")), n.has("searchIndex")) {
      const i = r(n.get("searchIndex"));
      typeof i == "boolean" && (s.searchIndex = i);
    }
    if (n.has("searchIndexMode")) {
      const i = n.get("searchIndexMode");
      (i === "eager" || i === "lazy") && (s.searchIndexMode = i);
    }
    if (n.has("defaultStyle")) {
      const i = n.get("defaultStyle");
      (i === "light" || i === "dark") && (s.defaultStyle = i);
    }
    if (n.has("bulmaCustomize") && (s.bulmaCustomize = n.get("bulmaCustomize")), n.has("lang") && (s.lang = n.get("lang")), n.has("l10nFile")) {
      const i = n.get("l10nFile");
      s.l10nFile = i === "null" ? null : i;
    }
    if (n.has("cacheTtlMinutes")) {
      const i = Number(n.get("cacheTtlMinutes"));
      Number.isFinite(i) && i >= 0 && (s.cacheTtlMinutes = i);
    }
    if (n.has("cacheMaxEntries")) {
      const i = Number(n.get("cacheMaxEntries"));
      Number.isInteger(i) && i >= 0 && (s.cacheMaxEntries = i);
    }
    if (n.has("homePage") && (s.homePage = n.get("homePage")), n.has("notFoundPage") && (s.notFoundPage = n.get("notFoundPage")), n.has("availableLanguages") && (s.availableLanguages = n.get("availableLanguages").split(",").map((i) => i.trim()).filter(Boolean)), n.has("indexDepth")) {
      const i = Number(n.get("indexDepth"));
      Number.isInteger(i) && (i === 1 || i === 2) && (s.indexDepth = i);
    }
    if (n.has("noIndexing")) {
      const a = (n.get("noIndexing") || "").split(",").map((o) => o.trim()).filter(Boolean);
      a.length && (s.noIndexing = a);
    }
    return s;
  } catch {
    return {};
  }
}
function Za(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function wr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let un = "";
async function rl(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = Wa();
  if (e && (e.contentPath || e.homePage || e.notFoundPage))
    if (t && t.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage");
      } catch (k) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", k);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage");
      } catch (k) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", k);
      }
      delete e.contentPath, delete e.homePage, delete e.notFoundPage;
    }
  const n = Object.assign({}, e, t), {
    el: s,
    contentPath: r = "/content",
    crawlMaxQueue: i = 1e3,
    searchIndex: a = !0,
    searchIndexMode: o = "eager",
    indexDepth: l = 1,
    noIndexing: u = void 0,
    defaultStyle: h = "light",
    bulmaCustomize: c = "none",
    lang: d = void 0,
    l10nFile: f = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: m,
    markdownExtensions: w,
    availableLanguages: y,
    homePage: S = "_home.md",
    notFoundPage: N = "_404.md"
  } = n;
  if (n.contentPath != null && !Za(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (n.homePage != null && !wr(n.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (n.notFoundPage != null && !wr(n.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!s)
    throw new Error("el is required");
  let _ = s;
  if (typeof s == "string") {
    if (_ = document.querySelector(s), !_) throw new Error(`el selector "${s}" did not match any element`);
  } else if (!(s instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2)
    throw new TypeError('initCMS(options): "indexDepth" must be 1 or 2 when provided');
  if (h !== "light" && h !== "dark")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');
  if (c != null && typeof c != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((k) => !k || typeof k != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((k) => typeof k != "string" || !k.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((k) => typeof k != "string" || !k.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (S != null && (typeof S != "string" || !S.trim() || !/\.(md|html)$/.test(S)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (N != null && (typeof N != "string" || !N.trim() || !/\.(md|html)$/.test(N)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const B = !!a;
  try {
    _.classList.add("nimbi-mount"), _.style.position = _.style.position || "relative", _.style.overflow = _.style.overflow || "hidden";
  } catch (k) {
    console.warn("[nimbi-cms] mount element setup failed", k);
  }
  const I = document.createElement("div");
  I.className = "nimbi-cms";
  try {
    I.style.position = I.style.position || "relative", I.style.overflow = I.style.overflow || "auto";
    try {
      I.style.webkitOverflowScrolling || (I.style.webkitOverflowScrolling = "touch");
    } catch (k) {
      console.warn("[nimbi-cms] set container webkitOverflowScrolling failed", k);
    }
    I.style.width = I.style.width || "100%", I.style.height = I.style.height || "100%", I.style.boxSizing = I.style.boxSizing || "border-box";
  } catch (k) {
    console.warn("[nimbi-cms] container style setup failed", k);
  }
  const te = document.createElement("div");
  te.className = "columns";
  const le = document.createElement("div");
  le.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", le.setAttribute("role", "navigation");
  try {
    const k = typeof ot == "function" ? ot("navigation") : null;
    k && le.setAttribute("aria-label", k);
  } catch (k) {
    console.warn("[nimbi-cms] set nav aria-label failed", k);
  }
  te.appendChild(le);
  const ne = document.createElement("div");
  ne.className = "column nimbi-content", ne.setAttribute("role", "main"), te.appendChild(ne), I.appendChild(te);
  const J = le, F = ne;
  _.appendChild(I);
  let C = null;
  try {
    C = _.querySelector(".nimbi-overlay"), C || (C = document.createElement("div"), C.className = "nimbi-overlay", _.appendChild(C));
  } catch (k) {
    C = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
  }
  const Q = location.pathname || "/", M = Q.endsWith("/") ? Q : Q.substring(0, Q.lastIndexOf("/") + 1);
  try {
    un = document.title || "";
  } catch (k) {
    un = "", console.warn("[nimbi-cms] read initial document title failed", k);
  }
  let v = r;
  v.startsWith("./") && (v = v.slice(2)), v.startsWith("/") && (v = v.slice(1)), v.endsWith("/") || (v = v + "/");
  const b = new URL(M + v, location.origin).toString();
  f && await vr(f, M), y && Array.isArray(y) && Tr(y), d && Er(d);
  const R = Fa({ contentWrap: F, navWrap: J, container: I, mountOverlay: C, t: ot, contentBase: b, homePage: S, initialDocumentTitle: un, runHooks: Xn });
  if (typeof g == "number" && g >= 0 && typeof nr == "function" && nr(g * 60 * 1e3), typeof m == "number" && m >= 0 && typeof tr == "function" && tr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((k) => {
        typeof k == "object" && wa && typeof wn == "function" && wn(k);
      });
    } catch (k) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", k);
    }
  try {
    typeof i == "number" && Promise.resolve().then(() => It).then(({ setDefaultCrawlMaxQueue: k }) => {
      try {
        k(i);
      } catch (z) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", z);
      }
    });
  } catch (k) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", k);
  }
  try {
    qt(b);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    pn(N);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    qt(b);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    pn(N);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    await xe(S, b);
  } catch (k) {
    throw S === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${S} not found at ${b}${S}: ${k.message}`);
  }
  ni(h), await ti(c, M);
  try {
    const k = document.createElement("header");
    k.className = "nimbi-site-navbar", _.insertBefore(k, I);
    const z = await xe("_navigation.md", b), X = await Wt(z.raw || ""), { navbar: ae, linkEls: Ee } = await Ma(k, I, X.html || "", b, S, ot, R.renderByQuery, B, o, l, u);
    try {
      await Xn("onNavBuild", { navWrap: J, navbar: ae, linkEls: Ee, contentBase: b });
    } catch (Se) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", Se);
    }
    try {
      const Se = () => {
        const we = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
        if (we > 0) {
          try {
            _.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set CSS var failed", fe);
          }
          try {
            I.style.paddingTop = "";
          } catch (fe) {
            console.warn("[nimbi-cms] set container paddingTop failed", fe);
          }
          try {
            const fe = _ && _.getBoundingClientRect && Math.round(_.getBoundingClientRect().height) || _ && _.clientHeight || 0;
            if (fe > 0) {
              const Re = Math.max(0, fe - we);
              try {
                I.style.boxSizing = "border-box";
              } catch (Oe) {
                console.warn("[nimbi-cms] set container boxSizing failed", Oe);
              }
              try {
                I.style.height = `${Re}px`;
              } catch (Oe) {
                console.warn("[nimbi-cms] set container height failed", Oe);
              }
              try {
                I.style.setProperty("--nimbi-cms-height", `${Re}px`);
              } catch (Oe) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Oe);
              }
            } else {
              try {
                I.style.height = "calc(100% - var(--nimbi-site-navbar-height))";
              } catch (Re) {
                console.warn("[nimbi-cms] set container height failed", Re);
              }
              try {
                I.style.setProperty("--nimbi-cms-height", "calc(100% - var(--nimbi-site-navbar-height))");
              } catch (Re) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Re);
              }
            }
          } catch (fe) {
            console.warn("[nimbi-cms] compute container height failed", fe);
          }
          try {
            k.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set navbar CSS var failed", fe);
          }
        }
      };
      Se();
      try {
        if (typeof ResizeObserver < "u") {
          const we = new ResizeObserver(() => Se());
          try {
            we.observe(k);
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", fe);
          }
        }
      } catch (we) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", we);
      }
    } catch (Se) {
      console.warn("[nimbi-cms] compute navbar height failed", Se);
    }
  } catch (k) {
    console.warn("[nimbi-cms] build navigation failed", k);
  }
  await R.renderByQuery();
  try {
    Promise.resolve().then(() => Ga).then(({ getVersion: k }) => {
      typeof k == "function" && k().then((z) => {
        try {
          const X = z || "0.0.0", ae = document.createElement("div");
          ae.className = "nimbi-version-label", ae.textContent = `Ninbi CMS v. ${X}`, ae.style.position = "absolute", ae.style.left = "8px", ae.style.bottom = "6px", ae.style.fontSize = "11px", ae.style.opacity = "0.6", ae.style.pointerEvents = "none", ae.style.zIndex = "9999", ae.style.userSelect = "none";
          try {
            _.appendChild(ae);
          } catch (Ee) {
            console.warn("[nimbi-cms] append version label failed", Ee);
          }
        } catch (X) {
          console.warn("[nimbi-cms] building version label failed", X);
        }
      }).catch((z) => {
        console.warn("[nimbi-cms] getVersion() failed", z);
      });
    }).catch((k) => {
      console.warn("[nimbi-cms] import version module failed", k);
    });
  } catch (k) {
    console.warn("[nimbi-cms] version label setup failed", k);
  }
}
async function Qa() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => br);
    } catch {
      try {
        t = await Promise.resolve().then(() => br);
      } catch {
        t = null;
      }
    }
    const e = t?.default?.version || t?.version;
    return typeof e == "string" && e.trim() ? e : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
const Ga = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Qa
}, Symbol.toStringTag, { value: "Module" })), Jr = "nimbi-cms", es = "0.1.0", ts = "module", ns = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, rs = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, ss = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, is = "dist/nimbi-cms.cjs.js", as = "dist/nimbi-cms.es.js", ls = "src/index.d.ts", os = "dist/nimbi-cms.js", cs = ["dist", "src/index.d.ts"], Xa = {
  name: Jr,
  version: es,
  private: !0,
  type: ts,
  scripts: ns,
  dependencies: rs,
  devDependencies: ss,
  main: is,
  module: as,
  types: ls,
  unpkg: os,
  files: cs
}, br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xa,
  dependencies: rs,
  devDependencies: ss,
  files: cs,
  main: is,
  module: as,
  name: Jr,
  scripts: ns,
  type: ts,
  types: ls,
  unpkg: os,
  version: es
}, Symbol.toStringTag, { value: "Module" }));
export {
  yr as BAD_LANGUAGES,
  V as SUPPORTED_HLJS_MAP,
  el as _clearHooks,
  yn as addHook,
  rl as default,
  ti as ensureBulma,
  Qa as getVersion,
  vr as loadL10nFile,
  xr as loadSupportedLanguages,
  Js as observeCodeBlocks,
  Va as onNavBuild,
  Ka as onPageLoad,
  bt as registerLanguage,
  Xn as runHooks,
  tl as setHighlightTheme,
  Er as setLang,
  ni as setStyle,
  nl as setThemeVars,
  ot as t,
  Ja as transformHtml
};
