const Jt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function dr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Jt, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  Jt[e].push(t);
}
function ul(e) {
  dr("onPageLoad", e);
}
function hl(e) {
  dr("onNavBuild", e);
}
function dl(e) {
  dr("transformHtml", e);
}
async function Zr(e, t) {
  const n = Jt[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function fl() {
  Object.keys(Jt).forEach((e) => {
    Jt[e].length = 0;
  });
}
function _i(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Zn, Gr;
function Na() {
  if (Gr) return Zn;
  Gr = 1;
  function e(k) {
    return k instanceof Map ? k.clear = k.delete = k.set = function() {
      throw new Error("map is read-only");
    } : k instanceof Set && (k.add = k.clear = k.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(k), Object.getOwnPropertyNames(k).forEach((M) => {
      const q = k[M], he = typeof q;
      (he === "object" || he === "function") && !Object.isFrozen(q) && e(q);
    }), k;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(M) {
      M.data === void 0 && (M.data = {}), this.data = M.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(k) {
    return k.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(k, ...M) {
    const q = /* @__PURE__ */ Object.create(null);
    for (const he in k)
      q[he] = k[he];
    return M.forEach(function(he) {
      for (const Ce in he)
        q[Ce] = he[Ce];
    }), /** @type {T} */
    q;
  }
  const r = "</span>", a = (k) => !!k.scope, s = (k, { prefix: M }) => {
    if (k.startsWith("language:"))
      return k.replace("language:", "language-");
    if (k.includes(".")) {
      const q = k.split(".");
      return [
        `${M}${q.shift()}`,
        ...q.map((he, Ce) => `${he}${"_".repeat(Ce + 1)}`)
      ].join(" ");
    }
    return `${M}${k}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(M, q) {
      this.buffer = "", this.classPrefix = q.classPrefix, M.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(M) {
      this.buffer += n(M);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(M) {
      if (!a(M)) return;
      const q = s(
        M.scope,
        { prefix: this.classPrefix }
      );
      this.span(q);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(M) {
      a(M) && (this.buffer += r);
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
    span(M) {
      this.buffer += `<span class="${M}">`;
    }
  }
  const o = (k = {}) => {
    const M = { children: [] };
    return Object.assign(M, k), M;
  };
  class d {
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
    add(M) {
      this.top.children.push(M);
    }
    /** @param {string} scope */
    openNode(M) {
      const q = o({ scope: M });
      this.add(q), this.stack.push(q);
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
    walk(M) {
      return this.constructor._walk(M, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(M, q) {
      return typeof q == "string" ? M.addText(q) : q.children && (M.openNode(q), q.children.forEach((he) => this._walk(M, he)), M.closeNode(q)), M;
    }
    /**
     * @param {Node} node
     */
    static _collapse(M) {
      typeof M != "string" && M.children && (M.children.every((q) => typeof q == "string") ? M.children = [M.children.join("")] : M.children.forEach((q) => {
        d._collapse(q);
      }));
    }
  }
  class l extends d {
    /**
     * @param {*} options
     */
    constructor(M) {
      super(), this.options = M;
    }
    /**
     * @param {string} text
     */
    addText(M) {
      M !== "" && this.add(M);
    }
    /** @param {string} scope */
    startScope(M) {
      this.openNode(M);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(M, q) {
      const he = M.root;
      q && (he.scope = `language:${q}`), this.add(he);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(k) {
    return k ? typeof k == "string" ? k : k.source : null;
  }
  function p(k) {
    return g("(?=", k, ")");
  }
  function f(k) {
    return g("(?:", k, ")*");
  }
  function y(k) {
    return g("(?:", k, ")?");
  }
  function g(...k) {
    return k.map((q) => u(q)).join("");
  }
  function h(k) {
    const M = k[k.length - 1];
    return typeof M == "object" && M.constructor === Object ? (k.splice(k.length - 1, 1), M) : {};
  }
  function m(...k) {
    return "(" + (h(k).capture ? "" : "?:") + k.map((he) => u(he)).join("|") + ")";
  }
  function b(k) {
    return new RegExp(k.toString() + "|").exec("").length - 1;
  }
  function _(k, M) {
    const q = k && k.exec(M);
    return q && q.index === 0;
  }
  const w = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function x(k, { joinWith: M }) {
    let q = 0;
    return k.map((he) => {
      q += 1;
      const Ce = q;
      let Te = u(he), X = "";
      for (; Te.length > 0; ) {
        const F = w.exec(Te);
        if (!F) {
          X += Te;
          break;
        }
        X += Te.substring(0, F.index), Te = Te.substring(F.index + F[0].length), F[0][0] === "\\" && F[1] ? X += "\\" + String(Number(F[1]) + Ce) : (X += F[0], F[0] === "(" && q++);
      }
      return X;
    }).map((he) => `(${he})`).join(M);
  }
  const S = /\b\B/, C = "[a-zA-Z]\\w*", B = "[a-zA-Z_]\\w*", z = "\\b\\d+(\\.\\d+)?", K = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Z = "\\b(0b[01]+)", W = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", E = (k = {}) => {
    const M = /^#![ ]*\//;
    return k.binary && (k.begin = g(
      M,
      /.*\b/,
      k.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: M,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (q, he) => {
        q.index !== 0 && he.ignoreMatch();
      }
    }, k);
  }, P = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, J = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [P]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [P]
  }, R = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, Q = function(k, M, q = {}) {
    const he = i(
      {
        scope: "comment",
        begin: k,
        end: M,
        contains: []
      },
      q
    );
    he.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Ce = m(
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
    return he.contains.push(
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
        begin: g(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          Ce,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), he;
  }, ee = Q("//", "$"), le = Q("/\\*", "\\*/"), Le = Q("#", "$"), ve = {
    scope: "number",
    begin: z,
    relevance: 0
  }, A = {
    scope: "number",
    begin: K,
    relevance: 0
  }, O = {
    scope: "number",
    begin: Z,
    relevance: 0
  }, D = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      P,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [P]
      }
    ]
  }, N = {
    scope: "title",
    begin: C,
    relevance: 0
  }, T = {
    scope: "title",
    begin: B,
    relevance: 0
  }, I = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + B,
    relevance: 0
  };
  var G = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: J,
    BACKSLASH_ESCAPE: P,
    BINARY_NUMBER_MODE: O,
    BINARY_NUMBER_RE: Z,
    COMMENT: Q,
    C_BLOCK_COMMENT_MODE: le,
    C_LINE_COMMENT_MODE: ee,
    C_NUMBER_MODE: A,
    C_NUMBER_RE: K,
    END_SAME_AS_BEGIN: function(k) {
      return Object.assign(
        k,
        {
          /** @type {ModeCallback} */
          "on:begin": (M, q) => {
            q.data._beginMatch = M[1];
          },
          /** @type {ModeCallback} */
          "on:end": (M, q) => {
            q.data._beginMatch !== M[1] && q.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Le,
    IDENT_RE: C,
    MATCH_NOTHING_RE: S,
    METHOD_GUARD: I,
    NUMBER_MODE: ve,
    NUMBER_RE: z,
    PHRASAL_WORDS_MODE: R,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: D,
    RE_STARTERS_RE: W,
    SHEBANG: E,
    TITLE_MODE: N,
    UNDERSCORE_IDENT_RE: B,
    UNDERSCORE_TITLE_MODE: T
  });
  function oe(k, M) {
    k.input[k.index - 1] === "." && M.ignoreMatch();
  }
  function ie(k, M) {
    k.className !== void 0 && (k.scope = k.className, delete k.className);
  }
  function be(k, M) {
    M && k.beginKeywords && (k.begin = "\\b(" + k.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", k.__beforeBegin = oe, k.keywords = k.keywords || k.beginKeywords, delete k.beginKeywords, k.relevance === void 0 && (k.relevance = 0));
  }
  function me(k, M) {
    Array.isArray(k.illegal) && (k.illegal = m(...k.illegal));
  }
  function V(k, M) {
    if (k.match) {
      if (k.begin || k.end) throw new Error("begin & end are not supported with match");
      k.begin = k.match, delete k.match;
    }
  }
  function te(k, M) {
    k.relevance === void 0 && (k.relevance = 1);
  }
  const qe = (k, M) => {
    if (!k.beforeMatch) return;
    if (k.starts) throw new Error("beforeMatch cannot be used with starts");
    const q = Object.assign({}, k);
    Object.keys(k).forEach((he) => {
      delete k[he];
    }), k.keywords = q.keywords, k.begin = g(q.beforeMatch, p(q.begin)), k.starts = {
      relevance: 0,
      contains: [
        Object.assign(q, { endsParent: !0 })
      ]
    }, k.relevance = 0, delete q.beforeMatch;
  }, lt = [
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
  ], Nn = "keyword";
  function Cr(k, M, q = Nn) {
    const he = /* @__PURE__ */ Object.create(null);
    return typeof k == "string" ? Ce(q, k.split(" ")) : Array.isArray(k) ? Ce(q, k) : Object.keys(k).forEach(function(Te) {
      Object.assign(
        he,
        Cr(k[Te], M, Te)
      );
    }), he;
    function Ce(Te, X) {
      M && (X = X.map((F) => F.toLowerCase())), X.forEach(function(F) {
        const ce = F.split("|");
        he[ce[0]] = [Te, ca(ce[0], ce[1])];
      });
    }
  }
  function ca(k, M) {
    return M ? Number(M) : ua(k) ? 0 : 1;
  }
  function ua(k) {
    return lt.includes(k.toLowerCase());
  }
  const Tr = {}, kt = (k) => {
    console.error(k);
  }, Pr = (k, ...M) => {
    console.log(`WARN: ${k}`, ...M);
  }, Rt = (k, M) => {
    Tr[`${k}/${M}`] || (console.log(`Deprecated as of ${k}. ${M}`), Tr[`${k}/${M}`] = !0);
  }, un = new Error();
  function $r(k, M, { key: q }) {
    let he = 0;
    const Ce = k[q], Te = {}, X = {};
    for (let F = 1; F <= M.length; F++)
      X[F + he] = Ce[F], Te[F + he] = !0, he += b(M[F - 1]);
    k[q] = X, k[q]._emit = Te, k[q]._multi = !0;
  }
  function ha(k) {
    if (Array.isArray(k.begin)) {
      if (k.skip || k.excludeBegin || k.returnBegin)
        throw kt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), un;
      if (typeof k.beginScope != "object" || k.beginScope === null)
        throw kt("beginScope must be object"), un;
      $r(k, k.begin, { key: "beginScope" }), k.begin = x(k.begin, { joinWith: "" });
    }
  }
  function da(k) {
    if (Array.isArray(k.end)) {
      if (k.skip || k.excludeEnd || k.returnEnd)
        throw kt("skip, excludeEnd, returnEnd not compatible with endScope: {}"), un;
      if (typeof k.endScope != "object" || k.endScope === null)
        throw kt("endScope must be object"), un;
      $r(k, k.end, { key: "endScope" }), k.end = x(k.end, { joinWith: "" });
    }
  }
  function fa(k) {
    k.scope && typeof k.scope == "object" && k.scope !== null && (k.beginScope = k.scope, delete k.scope);
  }
  function pa(k) {
    fa(k), typeof k.beginScope == "string" && (k.beginScope = { _wrap: k.beginScope }), typeof k.endScope == "string" && (k.endScope = { _wrap: k.endScope }), ha(k), da(k);
  }
  function ga(k) {
    function M(X, F) {
      return new RegExp(
        u(X),
        "m" + (k.case_insensitive ? "i" : "") + (k.unicodeRegex ? "u" : "") + (F ? "g" : "")
      );
    }
    class q {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(F, ce) {
        ce.position = this.position++, this.matchIndexes[this.matchAt] = ce, this.regexes.push([ce, F]), this.matchAt += b(F) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const F = this.regexes.map((ce) => ce[1]);
        this.matcherRe = M(x(F, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(F) {
        this.matcherRe.lastIndex = this.lastIndex;
        const ce = this.matcherRe.exec(F);
        if (!ce)
          return null;
        const Ne = ce.findIndex((It, qn) => qn > 0 && It !== void 0), ze = this.matchIndexes[Ne];
        return ce.splice(0, Ne), Object.assign(ce, ze);
      }
    }
    class he {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(F) {
        if (this.multiRegexes[F]) return this.multiRegexes[F];
        const ce = new q();
        return this.rules.slice(F).forEach(([Ne, ze]) => ce.addRule(Ne, ze)), ce.compile(), this.multiRegexes[F] = ce, ce;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(F, ce) {
        this.rules.push([F, ce]), ce.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(F) {
        const ce = this.getMatcher(this.regexIndex);
        ce.lastIndex = this.lastIndex;
        let Ne = ce.exec(F);
        if (this.resumingScanAtSamePosition() && !(Ne && Ne.index === this.lastIndex)) {
          const ze = this.getMatcher(0);
          ze.lastIndex = this.lastIndex + 1, Ne = ze.exec(F);
        }
        return Ne && (this.regexIndex += Ne.position + 1, this.regexIndex === this.count && this.considerAll()), Ne;
      }
    }
    function Ce(X) {
      const F = new he();
      return X.contains.forEach((ce) => F.addRule(ce.begin, { rule: ce, type: "begin" })), X.terminatorEnd && F.addRule(X.terminatorEnd, { type: "end" }), X.illegal && F.addRule(X.illegal, { type: "illegal" }), F;
    }
    function Te(X, F) {
      const ce = (
        /** @type CompiledMode */
        X
      );
      if (X.isCompiled) return ce;
      [
        ie,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        V,
        pa,
        qe
      ].forEach((ze) => ze(X, F)), k.compilerExtensions.forEach((ze) => ze(X, F)), X.__beforeBegin = null, [
        be,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        me,
        // default to 1 relevance if not specified
        te
      ].forEach((ze) => ze(X, F)), X.isCompiled = !0;
      let Ne = null;
      return typeof X.keywords == "object" && X.keywords.$pattern && (X.keywords = Object.assign({}, X.keywords), Ne = X.keywords.$pattern, delete X.keywords.$pattern), Ne = Ne || /\w+/, X.keywords && (X.keywords = Cr(X.keywords, k.case_insensitive)), ce.keywordPatternRe = M(Ne, !0), F && (X.begin || (X.begin = /\B|\b/), ce.beginRe = M(ce.begin), !X.end && !X.endsWithParent && (X.end = /\B|\b/), X.end && (ce.endRe = M(ce.end)), ce.terminatorEnd = u(ce.end) || "", X.endsWithParent && F.terminatorEnd && (ce.terminatorEnd += (X.end ? "|" : "") + F.terminatorEnd)), X.illegal && (ce.illegalRe = M(
        /** @type {RegExp | string} */
        X.illegal
      )), X.contains || (X.contains = []), X.contains = [].concat(...X.contains.map(function(ze) {
        return ma(ze === "self" ? X : ze);
      })), X.contains.forEach(function(ze) {
        Te(
          /** @type Mode */
          ze,
          ce
        );
      }), X.starts && Te(X.starts, F), ce.matcher = Ce(ce), ce;
    }
    if (k.compilerExtensions || (k.compilerExtensions = []), k.contains && k.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return k.classNameAliases = i(k.classNameAliases || {}), Te(
      /** @type Mode */
      k
    );
  }
  function zr(k) {
    return k ? k.endsWithParent || zr(k.starts) : !1;
  }
  function ma(k) {
    return k.variants && !k.cachedVariants && (k.cachedVariants = k.variants.map(function(M) {
      return i(k, { variants: null }, M);
    })), k.cachedVariants ? k.cachedVariants : zr(k) ? i(k, { starts: k.starts ? i(k.starts) : null }) : Object.isFrozen(k) ? i(k) : k;
  }
  var ya = "11.11.1";
  class ba extends Error {
    constructor(M, q) {
      super(M), this.name = "HTMLInjectionError", this.html = q;
    }
  }
  const Dn = n, Ir = i, Or = /* @__PURE__ */ Symbol("nomatch"), wa = 7, Br = function(k) {
    const M = /* @__PURE__ */ Object.create(null), q = /* @__PURE__ */ Object.create(null), he = [];
    let Ce = !0;
    const Te = "Could not find the language '{}', did you forget to load/include a language module?", X = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let F = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: l
    };
    function ce($) {
      return F.noHighlightRe.test($);
    }
    function Ne($) {
      let ne = $.className + " ";
      ne += $.parentNode ? $.parentNode.className : "";
      const ye = F.languageDetectRe.exec(ne);
      if (ye) {
        const Ae = ht(ye[1]);
        return Ae || (Pr(Te.replace("{}", ye[1])), Pr("Falling back to no-highlight mode for this block.", $)), Ae ? ye[1] : "no-highlight";
      }
      return ne.split(/\s+/).find((Ae) => ce(Ae) || ht(Ae));
    }
    function ze($, ne, ye) {
      let Ae = "", Oe = "";
      typeof ne == "object" ? (Ae = $, ye = ne.ignoreIllegals, Oe = ne.language) : (Rt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Rt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Oe = $, Ae = ne), ye === void 0 && (ye = !0);
      const Ye = {
        code: Ae,
        language: Oe
      };
      dn("before:highlight", Ye);
      const dt = Ye.result ? Ye.result : It(Ye.language, Ye.code, ye);
      return dt.code = Ye.code, dn("after:highlight", dt), dt;
    }
    function It($, ne, ye, Ae) {
      const Oe = /* @__PURE__ */ Object.create(null);
      function Ye(j, Y) {
        return j.keywords[Y];
      }
      function dt() {
        if (!de.keywords) {
          De.addText(Ee);
          return;
        }
        let j = 0;
        de.keywordPatternRe.lastIndex = 0;
        let Y = de.keywordPatternRe.exec(Ee), fe = "";
        for (; Y; ) {
          fe += Ee.substring(j, Y.index);
          const Se = nt.case_insensitive ? Y[0].toLowerCase() : Y[0], je = Ye(de, Se);
          if (je) {
            const [ct, Oa] = je;
            if (De.addText(fe), fe = "", Oe[Se] = (Oe[Se] || 0) + 1, Oe[Se] <= wa && (gn += Oa), ct.startsWith("_"))
              fe += Y[0];
            else {
              const Ba = nt.classNameAliases[ct] || ct;
              tt(Y[0], Ba);
            }
          } else
            fe += Y[0];
          j = de.keywordPatternRe.lastIndex, Y = de.keywordPatternRe.exec(Ee);
        }
        fe += Ee.substring(j), De.addText(fe);
      }
      function fn() {
        if (Ee === "") return;
        let j = null;
        if (typeof de.subLanguage == "string") {
          if (!M[de.subLanguage]) {
            De.addText(Ee);
            return;
          }
          j = It(de.subLanguage, Ee, !0, Wr[de.subLanguage]), Wr[de.subLanguage] = /** @type {CompiledMode} */
          j._top;
        } else
          j = jn(Ee, de.subLanguage.length ? de.subLanguage : null);
        de.relevance > 0 && (gn += j.relevance), De.__addSublanguage(j._emitter, j.language);
      }
      function Ge() {
        de.subLanguage != null ? fn() : dt(), Ee = "";
      }
      function tt(j, Y) {
        j !== "" && (De.startScope(Y), De.addText(j), De.endScope());
      }
      function jr(j, Y) {
        let fe = 1;
        const Se = Y.length - 1;
        for (; fe <= Se; ) {
          if (!j._emit[fe]) {
            fe++;
            continue;
          }
          const je = nt.classNameAliases[j[fe]] || j[fe], ct = Y[fe];
          je ? tt(ct, je) : (Ee = ct, dt(), Ee = ""), fe++;
        }
      }
      function Hr(j, Y) {
        return j.scope && typeof j.scope == "string" && De.openNode(nt.classNameAliases[j.scope] || j.scope), j.beginScope && (j.beginScope._wrap ? (tt(Ee, nt.classNameAliases[j.beginScope._wrap] || j.beginScope._wrap), Ee = "") : j.beginScope._multi && (jr(j.beginScope, Y), Ee = "")), de = Object.create(j, { parent: { value: de } }), de;
      }
      function Ur(j, Y, fe) {
        let Se = _(j.endRe, fe);
        if (Se) {
          if (j["on:end"]) {
            const je = new t(j);
            j["on:end"](Y, je), je.isMatchIgnored && (Se = !1);
          }
          if (Se) {
            for (; j.endsParent && j.parent; )
              j = j.parent;
            return j;
          }
        }
        if (j.endsWithParent)
          return Ur(j.parent, Y, fe);
      }
      function Ta(j) {
        return de.matcher.regexIndex === 0 ? (Ee += j[0], 1) : (Wn = !0, 0);
      }
      function Pa(j) {
        const Y = j[0], fe = j.rule, Se = new t(fe), je = [fe.__beforeBegin, fe["on:begin"]];
        for (const ct of je)
          if (ct && (ct(j, Se), Se.isMatchIgnored))
            return Ta(Y);
        return fe.skip ? Ee += Y : (fe.excludeBegin && (Ee += Y), Ge(), !fe.returnBegin && !fe.excludeBegin && (Ee = Y)), Hr(fe, j), fe.returnBegin ? 0 : Y.length;
      }
      function $a(j) {
        const Y = j[0], fe = ne.substring(j.index), Se = Ur(de, j, fe);
        if (!Se)
          return Or;
        const je = de;
        de.endScope && de.endScope._wrap ? (Ge(), tt(Y, de.endScope._wrap)) : de.endScope && de.endScope._multi ? (Ge(), jr(de.endScope, j)) : je.skip ? Ee += Y : (je.returnEnd || je.excludeEnd || (Ee += Y), Ge(), je.excludeEnd && (Ee = Y));
        do
          de.scope && De.closeNode(), !de.skip && !de.subLanguage && (gn += de.relevance), de = de.parent;
        while (de !== Se.parent);
        return Se.starts && Hr(Se.starts, j), je.returnEnd ? 0 : Y.length;
      }
      function za() {
        const j = [];
        for (let Y = de; Y !== nt; Y = Y.parent)
          Y.scope && j.unshift(Y.scope);
        j.forEach((Y) => De.openNode(Y));
      }
      let pn = {};
      function Fr(j, Y) {
        const fe = Y && Y[0];
        if (Ee += j, fe == null)
          return Ge(), 0;
        if (pn.type === "begin" && Y.type === "end" && pn.index === Y.index && fe === "") {
          if (Ee += ne.slice(Y.index, Y.index + 1), !Ce) {
            const Se = new Error(`0 width match regex (${$})`);
            throw Se.languageName = $, Se.badRule = pn.rule, Se;
          }
          return 1;
        }
        if (pn = Y, Y.type === "begin")
          return Pa(Y);
        if (Y.type === "illegal" && !ye) {
          const Se = new Error('Illegal lexeme "' + fe + '" for mode "' + (de.scope || "<unnamed>") + '"');
          throw Se.mode = de, Se;
        } else if (Y.type === "end") {
          const Se = $a(Y);
          if (Se !== Or)
            return Se;
        }
        if (Y.type === "illegal" && fe === "")
          return Ee += `
`, 1;
        if (Fn > 1e5 && Fn > Y.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Ee += fe, fe.length;
      }
      const nt = ht($);
      if (!nt)
        throw kt(Te.replace("{}", $)), new Error('Unknown language: "' + $ + '"');
      const Ia = ga(nt);
      let Un = "", de = Ae || Ia;
      const Wr = {}, De = new F.__emitter(F);
      za();
      let Ee = "", gn = 0, xt = 0, Fn = 0, Wn = !1;
      try {
        if (nt.__emitTokens)
          nt.__emitTokens(ne, De);
        else {
          for (de.matcher.considerAll(); ; ) {
            Fn++, Wn ? Wn = !1 : de.matcher.considerAll(), de.matcher.lastIndex = xt;
            const j = de.matcher.exec(ne);
            if (!j) break;
            const Y = ne.substring(xt, j.index), fe = Fr(Y, j);
            xt = j.index + fe;
          }
          Fr(ne.substring(xt));
        }
        return De.finalize(), Un = De.toHTML(), {
          language: $,
          value: Un,
          relevance: gn,
          illegal: !1,
          _emitter: De,
          _top: de
        };
      } catch (j) {
        if (j.message && j.message.includes("Illegal"))
          return {
            language: $,
            value: Dn(ne),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: j.message,
              index: xt,
              context: ne.slice(xt - 100, xt + 100),
              mode: j.mode,
              resultSoFar: Un
            },
            _emitter: De
          };
        if (Ce)
          return {
            language: $,
            value: Dn(ne),
            illegal: !1,
            relevance: 0,
            errorRaised: j,
            _emitter: De,
            _top: de
          };
        throw j;
      }
    }
    function qn($) {
      const ne = {
        value: Dn($),
        illegal: !1,
        relevance: 0,
        _top: X,
        _emitter: new F.__emitter(F)
      };
      return ne._emitter.addText($), ne;
    }
    function jn($, ne) {
      ne = ne || F.languages || Object.keys(M);
      const ye = qn($), Ae = ne.filter(ht).filter(qr).map(
        (Ge) => It(Ge, $, !1)
      );
      Ae.unshift(ye);
      const Oe = Ae.sort((Ge, tt) => {
        if (Ge.relevance !== tt.relevance) return tt.relevance - Ge.relevance;
        if (Ge.language && tt.language) {
          if (ht(Ge.language).supersetOf === tt.language)
            return 1;
          if (ht(tt.language).supersetOf === Ge.language)
            return -1;
        }
        return 0;
      }), [Ye, dt] = Oe, fn = Ye;
      return fn.secondBest = dt, fn;
    }
    function _a($, ne, ye) {
      const Ae = ne && q[ne] || ye;
      $.classList.add("hljs"), $.classList.add(`language-${Ae}`);
    }
    function Hn($) {
      let ne = null;
      const ye = Ne($);
      if (ce(ye)) return;
      if (dn(
        "before:highlightElement",
        { el: $, language: ye }
      ), $.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", $);
        return;
      }
      if ($.children.length > 0 && (F.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn($)), F.throwUnescapedHTML))
        throw new ba(
          "One of your code blocks includes unescaped HTML.",
          $.innerHTML
        );
      ne = $;
      const Ae = ne.textContent, Oe = ye ? ze(Ae, { language: ye, ignoreIllegals: !0 }) : jn(Ae);
      $.innerHTML = Oe.value, $.dataset.highlighted = "yes", _a($, ye, Oe.language), $.result = {
        language: Oe.language,
        // TODO: remove with version 11.0
        re: Oe.relevance,
        relevance: Oe.relevance
      }, Oe.secondBest && ($.secondBest = {
        language: Oe.secondBest.language,
        relevance: Oe.secondBest.relevance
      }), dn("after:highlightElement", { el: $, result: Oe, text: Ae });
    }
    function ka($) {
      F = Ir(F, $);
    }
    const xa = () => {
      hn(), Rt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Sa() {
      hn(), Rt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Nr = !1;
    function hn() {
      function $() {
        hn();
      }
      if (document.readyState === "loading") {
        Nr || window.addEventListener("DOMContentLoaded", $, !1), Nr = !0;
        return;
      }
      document.querySelectorAll(F.cssSelector).forEach(Hn);
    }
    function va($, ne) {
      let ye = null;
      try {
        ye = ne(k);
      } catch (Ae) {
        if (kt("Language definition for '{}' could not be registered.".replace("{}", $)), Ce)
          kt(Ae);
        else
          throw Ae;
        ye = X;
      }
      ye.name || (ye.name = $), M[$] = ye, ye.rawDefinition = ne.bind(null, k), ye.aliases && Dr(ye.aliases, { languageName: $ });
    }
    function Aa($) {
      delete M[$];
      for (const ne of Object.keys(q))
        q[ne] === $ && delete q[ne];
    }
    function Ea() {
      return Object.keys(M);
    }
    function ht($) {
      return $ = ($ || "").toLowerCase(), M[$] || M[q[$]];
    }
    function Dr($, { languageName: ne }) {
      typeof $ == "string" && ($ = [$]), $.forEach((ye) => {
        q[ye.toLowerCase()] = ne;
      });
    }
    function qr($) {
      const ne = ht($);
      return ne && !ne.disableAutodetect;
    }
    function La($) {
      $["before:highlightBlock"] && !$["before:highlightElement"] && ($["before:highlightElement"] = (ne) => {
        $["before:highlightBlock"](
          Object.assign({ block: ne.el }, ne)
        );
      }), $["after:highlightBlock"] && !$["after:highlightElement"] && ($["after:highlightElement"] = (ne) => {
        $["after:highlightBlock"](
          Object.assign({ block: ne.el }, ne)
        );
      });
    }
    function Ma($) {
      La($), he.push($);
    }
    function Ra($) {
      const ne = he.indexOf($);
      ne !== -1 && he.splice(ne, 1);
    }
    function dn($, ne) {
      const ye = $;
      he.forEach(function(Ae) {
        Ae[ye] && Ae[ye](ne);
      });
    }
    function Ca($) {
      return Rt("10.7.0", "highlightBlock will be removed entirely in v12.0"), Rt("10.7.0", "Please use highlightElement now."), Hn($);
    }
    Object.assign(k, {
      highlight: ze,
      highlightAuto: jn,
      highlightAll: hn,
      highlightElement: Hn,
      // TODO: Remove with v12 API
      highlightBlock: Ca,
      configure: ka,
      initHighlighting: xa,
      initHighlightingOnLoad: Sa,
      registerLanguage: va,
      unregisterLanguage: Aa,
      listLanguages: Ea,
      getLanguage: ht,
      registerAliases: Dr,
      autoDetection: qr,
      inherit: Ir,
      addPlugin: Ma,
      removePlugin: Ra
    }), k.debugMode = function() {
      Ce = !1;
    }, k.safeMode = function() {
      Ce = !0;
    }, k.versionString = ya, k.regex = {
      concat: g,
      lookahead: p,
      either: m,
      optional: y,
      anyNumberOfTimes: f
    };
    for (const $ in G)
      typeof G[$] == "object" && e(G[$]);
    return Object.assign(k, G), k;
  }, Ct = Br({});
  return Ct.newInstance = () => Br({}), Zn = Ct, Ct.HighlightJS = Ct, Ct.default = Ct, Zn;
}
var Da = /* @__PURE__ */ Na();
const ke = /* @__PURE__ */ _i(Da), qa = "11.11.1", ge = /* @__PURE__ */ new Map(), ja = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Qe = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Qe.html = "xml";
Qe.xhtml = "xml";
Qe.markup = "xml";
const ki = /* @__PURE__ */ new Set(["magic", "undefined"]);
let mt = null;
const Gn = /* @__PURE__ */ new Map(), Ha = 300 * 1e3;
async function xi(e = ja) {
  if (e)
    return mt || (mt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let d = 0; d < i.length; d++)
          if (/\|\s*Language\s*\|/i.test(i[d])) {
            r = d;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((d) => d.trim().toLowerCase());
        let s = a.findIndex((d) => /alias|aliases|equivalent|alt|alternates?/i.test(d));
        s === -1 && (s = 1);
        let c = a.findIndex((d) => /file|filename|module|module name|module-name|short|slug/i.test(d));
        if (c === -1) {
          const d = a.findIndex((l) => /language/i.test(l));
          c = d !== -1 ? d : 0;
        }
        let o = [];
        for (let d = r + 1; d < i.length; d++) {
          const l = i[d].trim();
          if (!l || !l.startsWith("|")) break;
          const u = l.replace(/^\||\|$/g, "").split("|").map((h) => h.trim());
          if (u.every((h) => /^-+$/.test(h))) continue;
          const p = u;
          if (!p.length) continue;
          const y = (p[c] || p[0] || "").toString().trim().toLowerCase();
          if (!y || /^-+$/.test(y)) continue;
          ge.set(y, y);
          const g = p[s] || "";
          if (g) {
            const h = String(g).split(",").map((m) => m.replace(/`/g, "").trim()).filter(Boolean);
            if (h.length) {
              const b = h[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              b && /[a-z0-9]/i.test(b) && (ge.set(b, b), o.push(b));
            }
          }
        }
        try {
          const d = [];
          for (const l of o) {
            const u = String(l || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? d.push(u) : ge.delete(l);
          }
          o = d;
        } catch (d) {
          console.warn("[codeblocksManager] cleanup aliases failed", d);
        }
        try {
          let d = 0;
          for (const l of Array.from(ge.keys())) {
            if (!l || /^-+$/.test(l) || !/[a-z0-9]/i.test(l)) {
              ge.delete(l), d++;
              continue;
            }
            if (/^[:]+/.test(l)) {
              const u = l.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const p = ge.get(l);
                ge.delete(l), ge.set(u, p);
              } else
                ge.delete(l), d++;
            }
          }
          for (const [l, u] of Array.from(ge.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (ge.delete(l), d++);
          try {
            const l = ":---------------------";
            ge.has(l) && (ge.delete(l), d++);
          } catch (l) {
            console.warn("[codeblocksManager] remove sep key failed", l);
          }
          try {
            const l = Array.from(ge.keys()).sort();
          } catch (l) {
            console.warn("[codeblocksManager] compute supported keys failed", l);
          }
        } catch (d) {
          console.warn("[codeblocksManager] ignored error", d);
        }
      } catch (t) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), mt);
}
const Ot = /* @__PURE__ */ new Set();
async function en(e, t) {
  if (mt || (async () => {
    try {
      await xi();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), mt)
    try {
      await mt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (ki.has(n)) return !1;
  if (ge.size && !ge.has(n)) {
    const r = Qe;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Ot.has(e)) return !0;
  const i = Qe;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let c = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((l) => String(l).toLowerCase()).filter((l) => l && l !== "undefined");
    ge.size && (c = c.filter((l) => {
      if (ge.has(l)) return !0;
      const u = Qe[l];
      return !!(u && ge.has(u));
    }));
    let o = null, d = null;
    for (const l of c)
      try {
        const u = Date.now();
        let p = Gn.get(l);
        if (p && p.ok === !1 && u - (p.ts || 0) >= Ha && (Gn.delete(l), p = void 0), p) {
          if (p.module)
            o = p.module;
          else if (p.promise)
            try {
              o = await p.promise;
            } catch {
              o = null;
            }
        } else {
          const f = { promise: null, module: null, ok: null, ts: 0 };
          Gn.set(l, f), f.promise = (async () => {
            try {
              try {
                try {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${l}.js`
                  );
                } catch {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${l}`
                  );
                }
              } catch {
                try {
                  const g = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${l}.js`;
                  return await new Function("u", "return import(u)")(g);
                } catch {
                  try {
                    const h = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${l}.js`;
                    return await new Function("u", "return import(u)")(h);
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
            o = await f.promise, f.module = o, f.ok = !!o, f.ts = Date.now();
          } catch {
            f.module = null, f.ok = !1, f.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const f = o.default || o;
          try {
            const y = ge.size && ge.get(e) || l || e;
            return ke.registerLanguage(y, f), Ot.add(y), y !== e && (ke.registerLanguage(e, f), Ot.add(e)), !0;
          } catch (y) {
            d = y;
          }
        } else
          try {
            if (ge.has(l) || ge.has(e)) {
              const f = () => ({});
              try {
                ke.registerLanguage(l, f), Ot.add(l);
              } catch {
              }
              try {
                l !== e && (ke.registerLanguage(e, f), Ot.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        d = u;
      }
    if (d)
      throw d;
    return !1;
  } catch {
    return !1;
  }
}
let mn = null;
function Ua(e = document) {
  mt || (async () => {
    try {
      await xi();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = Qe, i = mn || (typeof IntersectionObserver > "u" ? null : (mn = new IntersectionObserver((a, s) => {
    a.forEach((c) => {
      if (!c.isIntersecting) return;
      const o = c.target;
      try {
        s.unobserve(o);
      } catch (d) {
        console.warn("[codeblocksManager] observer unobserve failed", d);
      }
      (async () => {
        try {
          const d = o.getAttribute && o.getAttribute("class") || o.className || "", l = d.match(/language-([a-zA-Z0-9_+-]+)/) || d.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (l && l[1]) {
            const u = (l[1] || "").toLowerCase(), p = t[u] || u, f = ge.size && (ge.get(p) || ge.get(String(p).toLowerCase())) || p;
            try {
              await en(f);
            } catch (y) {
              console.warn("[codeblocksManager] registerLanguage failed", y);
            }
            try {
              try {
                const y = o.textContent || o.innerText || "";
                y != null && (o.textContent = y);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              ke.highlightElement(o);
            } catch (y) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", y);
            }
          } else
            try {
              const u = o.textContent || "";
              try {
                if (ke && typeof ke.getLanguage == "function" && ke.getLanguage("plaintext")) {
                  const p = ke.highlight(u, { language: "plaintext" });
                  p && p.value && (o.innerHTML = p.value);
                }
              } catch {
                try {
                  ke.highlightElement(o);
                } catch (f) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", f);
                }
              }
            } catch (u) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (d) {
          console.warn("[codeblocksManager] observer entry processing failed", d);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), mn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", c = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const o = (c[1] || "").toLowerCase(), d = t[o] || o, l = ge.size && (ge.get(d) || ge.get(String(d).toLowerCase())) || d;
          try {
            await en(l);
          } catch (u) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", u);
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
          ke.highlightElement(a);
        } catch (o) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", o);
        }
      } catch (s) {
        console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error", s);
      }
    });
    return;
  }
  r.forEach((a) => {
    try {
      i.observe(a);
    } catch (s) {
      console.warn("[codeblocksManager] observe failed", s);
    }
  });
}
function pl(e, { useCdn: t = !0 } = {}) {
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
    console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    return;
  }
  const s = a, c = `https://cdn.jsdelivr.net/npm/highlight.js@${qa}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = c, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let St = "light";
function Fa(e, t = {}) {
  if (document.querySelector(`link[href="${e}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = e, Object.entries(t).forEach(([i, r]) => n.setAttribute(i, r)), document.head.appendChild(n), t["data-bulmaswatch-theme"])
    try {
      if (n.getAttribute("data-bulmaswatch-observer")) return;
      let i = Number(n.getAttribute("data-bulmaswatch-move-count") || 0), r = !1;
      const a = new MutationObserver(() => {
        try {
          if (r) return;
          const c = n.parentNode;
          if (!c || c.lastElementChild === n) return;
          if (i >= 1e3) {
            n.setAttribute("data-bulmaswatch-move-stopped", "1");
            return;
          }
          r = !0;
          try {
            c.appendChild(n);
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
function Qr() {
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
async function Wa(e = "none", t = "/") {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.debug("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
    } catch {
    }
  if (!e) return;
  if (e === "none") {
    try {
      const a = [
        location && location.protocol && location.protocol === "file:" ? "https://unpkg.com/bulma/css/bulma.min.css" : "//unpkg.com/bulma/css/bulma.min.css",
        "https://unpkg.com/bulma/css/bulma.min.css"
      ];
      let s = !1;
      for (const c of a)
        try {
          if (document.querySelector(`link[href="${c}"]`)) {
            s = !0;
            break;
          }
        } catch {
        }
      if (!s) {
        const c = a[0], o = document.createElement("link");
        o.rel = "stylesheet", o.href = c, o.setAttribute("data-bulma-base", "1");
        const d = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        d && d.parentNode ? d.parentNode.insertBefore(o, d) : document.head.appendChild(o);
      }
    } catch {
    }
    try {
      const a = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
      for (const s of a)
        s && s.parentNode && s.parentNode.removeChild(s);
    } catch {
    }
    try {
      const a = Array.from(document.querySelectorAll("style[data-bulma-override]"));
      for (const s of a)
        s && s.parentNode && s.parentNode.removeChild(s);
    } catch {
    }
    return;
  }
  const i = [t + "bulma.css", "/bulma.css"], r = Array.from(new Set(i));
  if (e === "local") {
    if (Qr(), document.querySelector("style[data-bulma-override]")) return;
    for (const a of r)
      try {
        const s = await fetch(a, { method: "GET" });
        if (s.ok) {
          const c = await s.text(), o = document.createElement("style");
          o.setAttribute("data-bulma-override", a), o.appendChild(document.createTextNode(`
/* bulma override: ${a} */
` + c)), document.head.appendChild(o);
          return;
        }
      } catch (s) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", s);
      }
    return;
  }
  try {
    const a = String(e).trim();
    if (!a) return;
    Qr();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    Fa(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function Za(e) {
  St = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        St === "dark" ? n.setAttribute("data-theme", "dark") : St === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      St === "dark" ? n.setAttribute("data-theme", "dark") : St === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function gl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Si(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (St === "dark" ? t.setAttribute("data-theme", "dark") : St === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const vi = {
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
}, $t = JSON.parse(JSON.stringify(vi));
let En = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  En = String(e).split("-")[0].toLowerCase();
}
vi[En] || (En = "en");
let wt = En;
function qt(e, t = {}) {
  const n = $t[wt] || $t.en;
  let i = n && n[e] ? n[e] : $t.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Ai(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      $t[a] = Object.assign({}, $t[a] || {}, r[a]);
  } catch {
  }
}
function Ei(e) {
  const t = String(e).split("-")[0].toLowerCase();
  wt = $t[t] ? t : "en";
}
const Ga = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return wt;
  },
  loadL10nFile: Ai,
  setLang: Ei,
  t: qt
}, Symbol.toStringTag, { value: "Module" }));
function Li(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
function se(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}
function zt(e) {
  return String(e || "").replace(/\/+$/, "");
}
function Lt(e) {
  return zt(e) + "/";
}
function Qa(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    console.warn("[helpers] preloadImage failed", t);
  }
}
function yn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, l = (a ? Math.min(c, a.bottom) : c) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = c - s);
    let p = 0.6;
    try {
      const h = r && window.getComputedStyle ? window.getComputedStyle(r) : null, m = h && h.getPropertyValue("--nimbi-image-max-height-ratio"), b = m ? parseFloat(m) : NaN;
      !Number.isNaN(b) && b > 0 && b <= 1 && (p = b);
    } catch (h) {
      console.warn("[helpers] read CSS ratio failed", h);
    }
    const f = Math.max(200, Math.floor(u * p));
    let y = !1, g = null;
    if (i.forEach((h) => {
      try {
        const m = h.getAttribute ? h.getAttribute("loading") : void 0;
        m !== "eager" && h.setAttribute && h.setAttribute("loading", "lazy");
        const b = h.getBoundingClientRect ? h.getBoundingClientRect() : null, _ = h.src || h.getAttribute && h.getAttribute("src"), w = b && b.height > 1 ? b.height : f, x = b ? b.top : 0, S = x + w;
        b && w > 0 && x <= l && S >= o && (h.setAttribute ? (h.setAttribute("loading", "eager"), h.setAttribute("fetchpriority", "high"), h.setAttribute("data-eager-by-nimbi", "1")) : (h.loading = "eager", h.fetchPriority = "high"), Qa(_), y = !0), !g && b && b.top <= l && (g = { img: h, src: _, rect: b, beforeLoading: m });
      } catch (m) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", m);
      }
    }), !y && g) {
      const { img: h, src: m, rect: b, beforeLoading: _ } = g;
      try {
        h.setAttribute ? (h.setAttribute("loading", "eager"), h.setAttribute("fetchpriority", "high"), h.setAttribute("data-eager-by-nimbi", "1")) : (h.loading = "eager", h.fetchPriority = "high");
      } catch (w) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", w);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Me(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [d, l] of r.entries())
      s.append(d, l);
    const c = s.toString();
    let o = c ? `?${c}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
function Ln(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      console.warn("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    console.warn("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Ln);
} catch (e) {
  console.warn("[helpers] global attach failed", e);
}
function Xa(e) {
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
function Ka(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function Xr(e, t = null, n = void 0) {
  let r = "#/" + Ka(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = et(location.href);
        s && s.params && (a = s.params);
      } catch {
      }
    if (a) {
      const s = typeof a == "string" && a.startsWith("?") ? a.slice(1) : a;
      try {
        const c = new URLSearchParams(s);
        c.delete("page");
        const o = c.toString();
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
function et(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const d = t.hash.replace(/^#/, "");
        if (d.includes("&")) {
          const l = d.split("&");
          r = l.shift() || null, a = l.join("&");
        } else
          r = d || null;
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
        const d = r.split("?");
        r = d.shift() || "", a = d.join("?") || "";
      }
      let s = r, c = null;
      if (s.indexOf("#") !== -1) {
        const d = s.split("#");
        s = d.shift() || "", c = d.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: c, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const Va = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Ya(e, t = "worker") {
  let n = null;
  const i = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function r(...d) {
    try {
      i && console && typeof console.warn == "function" && console.warn(...d);
    } catch {
    }
  }
  function a() {
    if (!n)
      try {
        const d = e();
        n = d || null, d && d.addEventListener("error", () => {
          try {
            n === d && (n = null, d.terminate && d.terminate());
          } catch (l) {
            r("[" + t + "] worker termination failed", l);
          }
        });
      } catch (d) {
        n = null, r("[" + t + "] worker init failed", d);
      }
    return n;
  }
  function s() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (d) {
      r("[" + t + "] worker termination failed", d);
    }
  }
  function c(d, l = 1e4) {
    return new Promise((u, p) => {
      const f = a();
      if (!f) return p(new Error("worker unavailable"));
      const y = String(Math.random()), g = Object.assign({}, d, { id: y });
      let h = null;
      const m = () => {
        h && clearTimeout(h), f.removeEventListener("message", b), f.removeEventListener("error", _);
      }, b = (w) => {
        const x = w.data || {};
        x.id === y && (m(), x.error ? p(new Error(x.error)) : u(x.result));
      }, _ = (w) => {
        m(), r("[" + t + "] worker error event", w);
        try {
          n === f && (n = null, f.terminate && f.terminate());
        } catch (x) {
          r("[" + t + "] worker termination failed", x);
        }
        p(new Error(w && w.message || "worker error"));
      };
      h = setTimeout(() => {
        m(), r("[" + t + "] worker timed out");
        try {
          n === f && (n = null, f.terminate && f.terminate());
        } catch (w) {
          r("[" + t + "] worker termination on timeout failed", w);
        }
        p(new Error("worker timeout"));
      }, l), f.addEventListener("message", b), f.addEventListener("error", _);
      try {
        f.postMessage(g);
      } catch (w) {
        m(), p(w);
      }
    });
  }
  return { get: a, send: c, terminate: s };
}
function Mi(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  const a = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function s(...g) {
    try {
      a && console && typeof console.warn == "function" && console.warn(...g);
    } catch {
    }
  }
  function c(g) {
    if (!i[g])
      try {
        const h = e();
        i[g] = h || null, h && h.addEventListener("error", () => {
          try {
            i[g] === h && (i[g] = null, h.terminate && h.terminate());
          } catch (m) {
            s("[" + t + "] worker termination failed", m);
          }
        });
      } catch (h) {
        i[g] = null, s("[" + t + "] worker init failed", h);
      }
    return i[g];
  }
  const o = new Array(n).fill(0), d = new Array(n).fill(null), l = 30 * 1e3;
  function u(g) {
    try {
      o[g] = Date.now(), d[g] && (clearTimeout(d[g]), d[g] = null), d[g] = setTimeout(() => {
        try {
          i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
        } catch (h) {
          s("[" + t + "] idle termination failed", h);
        }
        d[g] = null;
      }, l);
    } catch {
    }
  }
  function p() {
    for (let g = 0; g < i.length; g++) {
      const h = c(g);
      if (h) return h;
    }
    return null;
  }
  function f() {
    for (let g = 0; g < i.length; g++)
      try {
        i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
      } catch (h) {
        s("[" + t + "] worker termination failed", h);
      }
  }
  function y(g, h = 1e4) {
    return new Promise((m, b) => {
      const _ = r++ % i.length, w = (x) => {
        const S = (_ + x) % i.length, C = c(S);
        if (!C)
          return x + 1 < i.length ? w(x + 1) : b(new Error("worker pool unavailable"));
        const B = String(Math.random()), z = Object.assign({}, g, { id: B });
        let K = null;
        const Z = () => {
          K && clearTimeout(K), C.removeEventListener("message", W), C.removeEventListener("error", E);
        }, W = (P) => {
          const J = P.data || {};
          J.id === B && (Z(), J.error ? b(new Error(J.error)) : m(J.result));
        }, E = (P) => {
          Z(), s("[" + t + "] worker error event", P);
          try {
            i[S] === C && (i[S] = null, C.terminate && C.terminate());
          } catch (J) {
            s("[" + t + "] worker termination failed", J);
          }
          b(new Error(P && P.message || "worker error"));
        };
        K = setTimeout(() => {
          Z(), s("[" + t + "] worker timed out");
          try {
            i[S] === C && (i[S] = null, C.terminate && C.terminate());
          } catch (P) {
            s("[" + t + "] worker termination on timeout failed", P);
          }
          b(new Error("worker timeout"));
        }, h), C.addEventListener("message", W), C.addEventListener("error", E);
        try {
          u(S), C.postMessage(z);
        } catch (P) {
          Z(), b(P);
        }
      };
      w(0);
    });
  }
  return { get: p, send: y, terminate: f };
}
function Ht(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Ht._blobUrlCache || (Ht._blobUrlCache = /* @__PURE__ */ new Map());
        const t = Ht._blobUrlCache;
        let n = t.get(e);
        if (!n) {
          const i = new Blob([e], { type: "application/javascript" });
          n = URL.createObjectURL(i), t.set(e, n);
        }
        return new Worker(n, { type: "module" });
      } catch (t) {
        try {
          typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console && typeof console.warn == "function" && console.warn("[worker-manager] createWorkerFromRaw failed", t);
        } catch {
        }
      }
  } catch (t) {
    try {
      typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console && typeof console.warn == "function" && console.warn("[worker-manager] createWorkerFromRaw failed", t);
    } catch {
    }
  }
  return null;
}
const st = /* @__PURE__ */ new Set();
function fr(e) {
  Ja(), st.clear();
  for (const t of Ie)
    t && st.add(t);
  Kr(re), Kr(U), fr._refreshed = !0;
}
function Kr(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && st.add(t);
}
function Vr(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && st.add(i), t.call(this, n, i);
  };
}
let Yr = !1;
function Ja() {
  Yr || (Vr(re), Vr(U), Yr = !0);
}
const re = /* @__PURE__ */ new Map();
let We = [], pr = !1;
function es(e) {
  pr = !!e;
}
function Ri(e) {
  We = Array.isArray(e) ? e.slice() : [];
}
function ts() {
  return We;
}
const tn = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Ci = Mi(() => Ht(Va), "slugManager", tn);
function ue(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.log(...e);
  } catch {
  }
}
function ns() {
  return Ci.get();
}
function Ti(e) {
  return Ci.send(e, 5e3);
}
async function er(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => bt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Ti({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function rs(e, t, n) {
  const i = await Promise.resolve().then(() => bt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Ti({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function ft(e, t) {
  if (e)
    if (We && We.length) {
      const i = t.split("/")[0], r = We.includes(i);
      let a = re.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, re.set(e, a);
    } else
      re.set(e, t);
}
const $n = /* @__PURE__ */ new Set();
function is(e) {
  typeof e == "function" && $n.add(e);
}
function as(e) {
  typeof e == "function" && $n.delete(e);
}
const U = /* @__PURE__ */ new Map();
let tr = {}, Ie = [], Re = "_404.md", Tt = "_home.md";
function Pi(e) {
  e != null && (Re = String(e || ""));
}
function ss(e) {
  e != null && (Tt = String(e || ""));
}
function os(e) {
  tr = e || {};
}
function $i(e) {
  try {
    if (Array.isArray(H) || (H = []), !Array.isArray(e)) return;
    try {
      Array.isArray(H) || (H = []), H.length = 0;
      for (const t of e) H.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = H;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      ue("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        H = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const Ut = /* @__PURE__ */ new Map(), Mn = /* @__PURE__ */ new Set();
function ls() {
  Ut.clear(), Mn.clear();
}
function cs(e) {
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
function gr(e) {
  re.clear(), U.clear(), Ie = [], We = We || [];
  const t = Object.keys(tr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), ue("[slugManager] parse contentBase failed", i);
      }
      n = Lt(n);
    }
  } catch (i) {
    n = "", ue("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = cs(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = se(i.slice(n.length)) : r = se(i), Ie.push(r);
    try {
      fr();
    } catch (s) {
      ue("[slugManager] refreshIndexPaths failed", s);
    }
    const a = tr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const c = we(s[1].trim());
        if (c)
          try {
            let o = c;
            if ((!We || !We.length) && (o = zi(o, new Set(re.keys()))), We && We.length) {
              const l = r.split("/")[0], u = We.includes(l);
              let p = re.get(o);
              (!p || typeof p == "string") && (p = { default: typeof p == "string" ? p : void 0, langs: {} }), u ? p.langs[l] = r : p.default = r, re.set(o, p);
            } else
              re.set(o, r);
            U.set(r, o);
          } catch (o) {
            ue("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  gr();
} catch (e) {
  ue("[slugManager] initial setContentBase failed", e);
}
function we(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function zi(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function us(e) {
  return sn(e, void 0);
}
function sn(e, t) {
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
function xn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function on(e) {
  if (!e || !re.has(e)) return null;
  const t = re.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (We && We.length && wt && t.langs && t.langs[wt])
    return t.langs[wt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Ft = /* @__PURE__ */ new Map();
function hs() {
  Ft.clear();
}
let xe = async function(e, t) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const a = et(e);
        a && a.page && (e = a.page);
      } catch {
      }
  } catch {
  }
  try {
    const a = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (a && re.has(a)) {
      const s = on(a) || re.get(a);
      s && s !== e && (e = s);
    }
  } catch (a) {
    ue("[slugManager] slug mapping normalization failed", a);
  }
  const n = t == null ? "" : zt(String(t));
  let i = "";
  try {
    const a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (n && n.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(n)) {
      const s = n.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
      i = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + s;
    } else {
      let s = a + "/";
      n && (/^[a-z][a-z0-9+.-]*:/i.test(n) ? s = n.replace(/\/$/, "") + "/" : n.startsWith("/") ? s = a + n.replace(/\/$/, "") + "/" : s = a + "/" + n.replace(/\/$/, "") + "/"), i = new URL(e.replace(/^\//, ""), s).toString();
    }
  } catch {
    i = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  if (Ft.has(i))
    return Ft.get(i);
  const r = (async () => {
    const a = await fetch(i);
    if (!a || typeof a.ok != "boolean" || !a.ok) {
      if (a && a.status === 404)
        try {
          const u = `${n}/${Re}`, p = await globalThis.fetch(u);
          if (p && typeof p.ok == "boolean" && p.ok)
            return { raw: await p.text(), status: 404 };
        } catch (u) {
          ue("[slugManager] fetching fallback 404 failed", u);
        }
      let l = "";
      try {
        a && typeof a.clone == "function" ? l = await a.clone().text() : a && typeof a.text == "function" ? l = await a.text() : l = "";
      } catch (u) {
        l = "", ue("[slugManager] reading error body failed", u);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: a ? a.status : void 0, statusText: a ? a.statusText : void 0, body: l.slice(0, 200) }), new Error("failed to fetch md");
    }
    const s = await a.text(), c = s.trim().slice(0, 128).toLowerCase(), o = /^(?:<!doctype|<html|<title|<h1)/.test(c), d = o || String(e || "").toLowerCase().endsWith(".html");
    if (o && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        const l = `${n}/${Re}`, u = await globalThis.fetch(l);
        if (u.ok)
          return { raw: await u.text(), status: 404 };
      } catch (l) {
        ue("[slugManager] fetching fallback 404 failed", l);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return d ? { raw: s, isHtml: !0 } : { raw: s };
  })();
  return Ft.set(i, r), r;
};
function ds(e) {
  typeof e == "function" && (xe = e);
}
const Sn = /* @__PURE__ */ new Map();
function fs(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let H = [];
function ps() {
  return H;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return H;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = H;
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
          return nr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = nr;
      } catch {
      }
    }
} catch {
}
let gt = null;
async function At(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => se(String(a || ""))))) : [];
  try {
    const a = se(String(Re || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (H && H.length && t === 1 && !H.some((s) => {
    try {
      return r.includes(se(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return H;
  if (gt) return gt;
  gt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((g) => se(String(g || ""))))) : [];
    try {
      const g = se(String(Re || ""));
      g && !a.includes(g) && a.push(g);
    } catch {
    }
    const s = (g) => {
      if (!a || !a.length) return !1;
      for (const h of a)
        if (h && (g === h || g.startsWith(h + "/")))
          return !0;
      return !1;
    };
    let c = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const g of i)
          try {
            const h = se(String(g || ""));
            h && c.push(h);
          } catch {
          }
    } catch {
    }
    if (Ie && Ie.length && (c = Array.from(Ie)), !c.length)
      for (const g of re.values())
        g && c.push(g);
    try {
      const g = await Di(e);
      g && g.length && (c = c.concat(g));
    } catch (g) {
      ue("[slugManager] crawlAllMarkdown during buildSearchIndex failed", g);
    }
    try {
      const g = new Set(c), h = [...c], m = Math.max(1, tn), b = async () => {
        for (; !(g.size > ln); ) {
          const w = h.shift();
          if (!w) break;
          try {
            const x = await xe(w, e);
            if (x && x.raw) {
              if (x.status === 404) continue;
              let S = x.raw;
              const C = [], B = String(w || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(B) && pr && (!w || !w.includes("/")))
                continue;
              const z = fs(S), K = /\[[^\]]+\]\(([^)]+)\)/g;
              let Z;
              for (; Z = K.exec(z); )
                C.push(Z[1]);
              const W = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; Z = W.exec(z); )
                C.push(Z[1]);
              const E = w && w.includes("/") ? w.substring(0, w.lastIndexOf("/") + 1) : "";
              for (let P of C)
                try {
                  if (sn(P, e) || P.startsWith("..") || P.indexOf("/../") !== -1 || (E && !P.startsWith("./") && !P.startsWith("/") && !P.startsWith("../") && (P = E + P), P = se(P), !/\.(md|html?)(?:$|[?#])/i.test(P)) || (P = P.split(/[?#]/)[0], s(P))) continue;
                  g.has(P) || (g.add(P), h.push(P), c.push(P));
                } catch (J) {
                  ue("[slugManager] href processing failed", P, J);
                }
            }
          } catch (x) {
            ue("[slugManager] discovery fetch failed for", w, x);
          }
        }
      }, _ = [];
      for (let w = 0; w < m; w++) _.push(b());
      await Promise.all(_);
    } catch (g) {
      ue("[slugManager] discovery loop failed", g);
    }
    const o = /* @__PURE__ */ new Set();
    c = c.filter((g) => !g || o.has(g) || s(g) ? !1 : (o.add(g), !0));
    const d = [], l = /* @__PURE__ */ new Map(), u = c.filter((g) => /\.(?:md|html?)(?:$|[?#])/i.test(g)), p = Math.max(1, Math.min(tn, u.length || 1)), f = u.slice(), y = [];
    for (let g = 0; g < p; g++)
      y.push((async () => {
        for (; f.length; ) {
          const h = f.shift();
          if (!h) break;
          try {
            const m = await xe(h, e);
            l.set(h, m);
          } catch (m) {
            ue("[slugManager] buildSearchIndex: entry fetch failed", h, m), l.set(h, null);
          }
        }
      })());
    await Promise.all(y);
    for (const g of c)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(g))
        try {
          const h = l.get(g);
          if (!h || !h.raw || h.status === 404) continue;
          let m = "", b = "";
          if (h.isHtml)
            try {
              const x = new DOMParser().parseFromString(h.raw, "text/html"), S = x.querySelector("title") || x.querySelector("h1");
              S && S.textContent && (m = S.textContent.trim());
              const C = x.querySelector("p");
              if (C && C.textContent && (b = C.textContent.trim()), t >= 2)
                try {
                  const B = x.querySelector("h1"), z = B && B.textContent ? B.textContent.trim() : m || "", K = (() => {
                    try {
                      if (U.has(g)) return U.get(g);
                    } catch {
                    }
                    return we(m || g);
                  })(), Z = Array.from(x.querySelectorAll("h2"));
                  for (const W of Z)
                    try {
                      const E = (W.textContent || "").trim();
                      if (!E) continue;
                      const P = W.id ? W.id : we(E), J = K ? `${K}::${P}` : `${we(g)}::${P}`;
                      let L = "", R = W.nextElementSibling;
                      for (; R && R.tagName && R.tagName.toLowerCase() === "script"; ) R = R.nextElementSibling;
                      R && R.textContent && (L = String(R.textContent).trim()), d.push({ slug: J, title: E, excerpt: L, path: g, parentTitle: z });
                    } catch (E) {
                      ue("[slugManager] indexing H2 failed", E);
                    }
                  if (t === 3)
                    try {
                      const W = Array.from(x.querySelectorAll("h3"));
                      for (const E of W)
                        try {
                          const P = (E.textContent || "").trim();
                          if (!P) continue;
                          const J = E.id ? E.id : we(P), L = K ? `${K}::${J}` : `${we(g)}::${J}`;
                          let R = "", Q = E.nextElementSibling;
                          for (; Q && Q.tagName && Q.tagName.toLowerCase() === "script"; ) Q = Q.nextElementSibling;
                          Q && Q.textContent && (R = String(Q.textContent).trim()), d.push({ slug: L, title: P, excerpt: R, path: g, parentTitle: z });
                        } catch (P) {
                          ue("[slugManager] indexing H3 failed", P);
                        }
                    } catch (W) {
                      ue("[slugManager] collect H3s failed", W);
                    }
                } catch (B) {
                  ue("[slugManager] collect H2s failed", B);
                }
            } catch (w) {
              ue("[slugManager] parsing HTML for index failed", w);
            }
          else {
            const w = h.raw, x = w.match(/^#\s+(.+)$/m);
            m = x ? x[1].trim() : "";
            try {
              m = xn(m);
            } catch {
            }
            const S = w.split(/\r?\n\s*\r?\n/);
            if (S.length > 1)
              for (let C = 1; C < S.length; C++) {
                const B = S[C].trim();
                if (B && !/^#/.test(B)) {
                  b = B.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let C = "", B = "";
              try {
                const z = (w.match(/^#\s+(.+)$/m) || [])[1];
                C = z ? z.trim() : "", B = (function() {
                  try {
                    if (U.has(g)) return U.get(g);
                  } catch {
                  }
                  return we(m || g);
                })();
                const K = /^##\s+(.+)$/gm;
                let Z;
                for (; Z = K.exec(w); )
                  try {
                    const W = (Z[1] || "").trim(), E = xn(W);
                    if (!W) continue;
                    const P = we(W), J = B ? `${B}::${P}` : `${we(g)}::${P}`, R = w.slice(K.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), Q = R && R[1] ? String(R[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    d.push({ slug: J, title: E, excerpt: Q, path: g, parentTitle: C });
                  } catch (W) {
                    ue("[slugManager] indexing markdown H2 failed", W);
                  }
              } catch (z) {
                ue("[slugManager] collect markdown H2s failed", z);
              }
              if (t === 3)
                try {
                  const z = /^###\s+(.+)$/gm;
                  let K;
                  for (; K = z.exec(w); )
                    try {
                      const Z = (K[1] || "").trim(), W = xn(Z);
                      if (!Z) continue;
                      const E = we(Z), P = B ? `${B}::${E}` : `${we(g)}::${E}`, L = w.slice(z.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), R = L && L[1] ? String(L[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      d.push({ slug: P, title: W, excerpt: R, path: g, parentTitle: C });
                    } catch (Z) {
                      ue("[slugManager] indexing markdown H3 failed", Z);
                    }
                } catch (z) {
                  ue("[slugManager] collect markdown H3s failed", z);
                }
            }
          }
          let _ = "";
          try {
            U.has(g) && (_ = U.get(g));
          } catch (w) {
            ue("[slugManager] mdToSlug access failed", w);
          }
          _ || (_ = we(m || g)), d.push({ slug: _, title: m, excerpt: b, path: g });
        } catch (h) {
          ue("[slugManager] buildSearchIndex: entry processing failed", h);
        }
    try {
      const g = d.filter((h) => {
        try {
          return !s(String(h.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(H) || (H = []), H.length = 0;
        for (const h of g) H.push(h);
      } catch {
        try {
          H = Array.from(g);
        } catch {
          H = g;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = H;
          } catch {
          }
          try {
            const h = [], m = /* @__PURE__ */ new Set();
            for (const b of H)
              try {
                if (!b || !b.slug) continue;
                const _ = String(b.slug).split("::")[0];
                if (m.has(_)) continue;
                m.add(_);
                const w = { slug: _ };
                b.title ? w.title = String(b.title) : b.parentTitle && (w.title = String(b.parentTitle)), b.path && (w.path = String(b.path)), h.push(w);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: h };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = h;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (g) {
      ue("[slugManager] filtering index by excludes failed", g);
      try {
        Array.isArray(H) || (H = []), H.length = 0;
        for (const h of d) H.push(h);
      } catch {
        try {
          H = Array.from(d);
        } catch {
          H = d;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = H;
          } catch {
          }
      } catch {
      }
    }
    return H;
  })();
  try {
    await gt;
  } catch (a) {
    ue("[slugManager] awaiting _indexPromise failed", a);
  }
  return gt = null, H;
}
async function yt(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(H) && H.length && !gt && !s) return H;
    if (gt) {
      try {
        await gt;
      } catch {
      }
      return H;
    }
    if (s) {
      try {
        if (typeof er == "function")
          try {
            const o = await er(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                $i(o);
              } catch {
              }
              return H;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await At(n, i, r, a), H;
      } catch {
      }
    }
    const c = Date.now();
    for (; Date.now() - c < t; ) {
      if (Array.isArray(H) && H.length) return H;
      await new Promise((o) => setTimeout(o, 150));
    }
    return H;
  } catch {
    return H;
  }
}
async function nr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await yt(t);
    } catch {
      return H;
    }
  } catch {
    return H;
  }
}
const Ii = 1e3;
let ln = Ii;
function gs(e) {
  typeof e == "number" && e >= 0 && (ln = e);
}
const Oi = new DOMParser(), Bi = "a[href]";
let Ni = async function(e, t, n = ln) {
  if (Sn.has(e)) return Sn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let c = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? c = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? c = s + String(t).replace(/\/$/, "") + "/" : c = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    c = s + "/";
  }
  const o = Math.max(1, Math.min(tn, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const d = a.splice(0, o);
    await Promise.all(d.map(async (l) => {
      if (l == null || r.has(l)) return;
      r.add(l);
      let u = "";
      try {
        u = new URL(l || "", c).toString();
      } catch {
        u = (String(t || "") || s) + "/" + String(l || "").replace(/^\//, "");
      }
      try {
        let p;
        try {
          p = await globalThis.fetch(u);
        } catch (m) {
          ue("[slugManager] crawlForSlug: fetch failed", { url: u, error: m });
          return;
        }
        if (!p || !p.ok) {
          p && !p.ok && ue("[slugManager] crawlForSlug: directory fetch non-ok", { url: u, status: p.status });
          return;
        }
        const f = await p.text(), g = Oi.parseFromString(f, "text/html").querySelectorAll(Bi), h = u;
        for (const m of g)
          try {
            if (i) break;
            let b = m.getAttribute("href") || "";
            if (!b || sn(b, t) || b.startsWith("..") || b.indexOf("/../") !== -1) continue;
            if (b.endsWith("/")) {
              try {
                const _ = new URL(b, h), w = new URL(c).pathname, x = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, ""), S = Lt(se(x));
                r.has(S) || a.push(S);
              } catch {
                const w = se(l + b);
                r.has(w) || a.push(w);
              }
              continue;
            }
            if (b.toLowerCase().endsWith(".md")) {
              let _ = "";
              try {
                const w = new URL(b, h), x = new URL(c).pathname;
                _ = w.pathname.startsWith(x) ? w.pathname.slice(x.length) : w.pathname.replace(/^\//, "");
              } catch {
                _ = (l + b).replace(/^\//, "");
              }
              _ = se(_);
              try {
                if (U.has(_))
                  continue;
                for (const w of re.values())
                  ;
              } catch (w) {
                ue("[slugManager] slug map access failed", w);
              }
              try {
                const w = await xe(_, t);
                if (w && w.raw) {
                  const x = (w.raw || "").match(/^#\s+(.+)$/m);
                  if (x && x[1] && we(x[1].trim()) === e) {
                    i = _;
                    break;
                  }
                }
              } catch (w) {
                ue("[slugManager] crawlForSlug: fetchMarkdown failed", w);
              }
            }
          } catch (b) {
            ue("[slugManager] crawlForSlug: link iteration failed", b);
          }
      } catch (p) {
        ue("[slugManager] crawlForSlug: directory fetch failed", p);
      }
    }));
  }
  return Sn.set(e, i), i;
};
async function Di(e, t = ln) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const c = Math.max(1, Math.min(tn, 6));
  for (; r.length && !(r.length > t); ) {
    const o = r.splice(0, c);
    await Promise.all(o.map(async (d) => {
      if (d == null || i.has(d)) return;
      i.add(d);
      let l = "";
      try {
        l = new URL(d || "", s).toString();
      } catch {
        l = (String(e || "") || a) + "/" + String(d || "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(l);
        } catch (h) {
          ue("[slugManager] crawlAllMarkdown: fetch failed", { url: l, error: h });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && ue("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: l, status: u.status });
          return;
        }
        const p = await u.text(), y = Oi.parseFromString(p, "text/html").querySelectorAll(Bi), g = l;
        for (const h of y)
          try {
            let m = h.getAttribute("href") || "";
            if (!m || sn(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
            if (m.endsWith("/")) {
              try {
                const _ = new URL(m, g), w = new URL(s).pathname, x = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, ""), S = Lt(se(x));
                i.has(S) || r.push(S);
              } catch {
                const w = d + m;
                i.has(w) || r.push(w);
              }
              continue;
            }
            let b = "";
            try {
              const _ = new URL(m, g), w = new URL(s).pathname;
              b = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, "");
            } catch {
              b = (d + m).replace(/^\//, "");
            }
            b = se(b), /\.(md|html?)$/i.test(b) && n.add(b);
          } catch (m) {
            ue("[slugManager] crawlAllMarkdown: link iteration failed", m);
          }
      } catch (u) {
        ue("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }));
  }
  return Array.from(n);
}
async function qi(e, t, n) {
  if (e && typeof e == "string" && (e = se(e), e = zt(e)), re.has(e))
    return on(e) || re.get(e);
  for (const r of $n)
    try {
      const a = await r(e, t);
      if (a)
        return ft(e, a), U.set(a, e), a;
    } catch (a) {
      ue("[slugManager] slug resolver failed", a);
    }
  if (Ie && Ie.length) {
    if (Ut.has(e)) {
      const r = Ut.get(e);
      return re.set(e, r), U.set(r, e), r;
    }
    for (const r of Ie)
      if (!Mn.has(r))
        try {
          const a = await xe(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const c = we(s[1].trim());
              if (Mn.add(r), c && Ut.set(c, r), c === e)
                return ft(e, r), U.set(r, e), r;
            }
          }
        } catch (a) {
          ue("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await At(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return ft(e, a.path), U.set(a.path, e), a.path;
    }
  } catch (r) {
    ue("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Ni(e, t, n);
    if (r)
      return ft(e, r), U.set(r, e), r;
  } catch (r) {
    ue("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await xe(r, t);
      if (a && a.raw)
        return ft(e, r), U.set(r, e), r;
    } catch (a) {
      ue("[slugManager] candidate fetch failed", a);
    }
  if (Ie && Ie.length)
    for (const r of Ie)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (we(a) === e)
          return ft(e, r), U.set(r, e), r;
      } catch (a) {
        ue("[slugManager] build-time filename match failed", a);
      }
  try {
    const r = [];
    Tt && typeof Tt == "string" && Tt.trim() && r.push(Tt), r.includes("_home.md") || r.push("_home.md");
    for (const a of r)
      try {
        const s = await xe(a, t);
        if (s && s.raw) {
          const c = (s.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && we(c[1].trim()) === e)
            return ft(e, a), U.set(a, e), a;
        }
      } catch {
      }
  } catch (r) {
    ue("[slugManager] home page fetch failed", r);
  }
  return null;
}
const bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Ii,
  _setAllMd: os,
  _setSearchIndex: $i,
  _storeSlugMapping: ft,
  addSlugResolver: is,
  get allMarkdownPaths() {
    return Ie;
  },
  get availableLanguages() {
    return We;
  },
  awaitSearchIndex: nr,
  buildSearchIndex: At,
  buildSearchIndexWorker: er,
  clearFetchCache: hs,
  clearListCaches: ls,
  crawlAllMarkdown: Di,
  crawlCache: Sn,
  crawlForSlug: Ni,
  crawlForSlugWorker: rs,
  get defaultCrawlMaxQueue() {
    return ln;
  },
  ensureSlug: qi,
  fetchCache: Ft,
  get fetchMarkdown() {
    return xe;
  },
  getLanguages: ts,
  getSearchIndex: ps,
  get homePage() {
    return Tt;
  },
  initSlugWorker: ns,
  isExternalLink: us,
  isExternalLinkWithBase: sn,
  listPathsFetched: Mn,
  listSlugCache: Ut,
  mdToSlug: U,
  get notFoundPage() {
    return Re;
  },
  removeSlugResolver: as,
  resolveSlugPath: on,
  get searchIndex() {
    return H;
  },
  setContentBase: gr,
  setDefaultCrawlMaxQueue: gs,
  setFetchMarkdown: ds,
  setHomePage: ss,
  setLanguages: Ri,
  setNotFoundPage: Pi,
  setSkipRootReadme: es,
  get skipRootReadme() {
    return pr;
  },
  slugResolvers: $n,
  slugToMd: re,
  slugify: we,
  unescapeMarkdown: xn,
  uniqueSlug: zi,
  whenSearchIndexReady: yt
}, Symbol.toStringTag, { value: "Module" }));
var Qn, Jr;
function ms() {
  if (Jr) return Qn;
  Jr = 1;
  function e(a, s) {
    return s.some(
      ([c, o]) => c <= a && a <= o
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
    let c = 0, o = 0, d = a.length - 1;
    const l = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[o]); ) o++;
    for (; u(a[d]); ) d--;
    const p = `${a}
`;
    for (let h = o; h <= d; h++)
      if ((t(p[h]) || !u(p[h]) && (u(p[h + 1]) || t(p[h + 1]))) && c++, t(p[h]))
        for (; h <= d && (i(p[h + 1]) || u(p[h + 1])); )
          h++;
    const f = c / l, y = Math.round(f * 60 * 1e3);
    return {
      text: Math.ceil(f.toFixed(2)) + " min read",
      minutes: f,
      time: y,
      words: c
    };
  }
  return Qn = r, Qn;
}
var ys = ms();
const bs = /* @__PURE__ */ _i(ys);
function nn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function pt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ji(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function ws(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  pt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && pt("property", "og:description", a), a && String(a).trim() && pt("name", "twitter:description", a), pt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (pt("property", "og:image", s), pt("name", "twitter:image", s));
}
function mr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  c && String(c).trim() && nn("description", c), nn("robots", a.robots || "index,follow"), ws(a, t, n, c);
}
function _s() {
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
    console.warn("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function yr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, c = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", d = i || s.image || null;
    let l = "";
    try {
      if (t) {
        const y = se(t);
        try {
          l = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(y);
        } catch {
          l = location.href.split("#")[0];
        }
      } else
        l = location.href.split("#")[0];
    } catch (y) {
      l = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", y);
    }
    l && ji("canonical", l);
    try {
      pt("property", "og:url", l);
    } catch (y) {
      console.warn("[seoManager] upsertMeta og:url failed", y);
    }
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c || "",
      description: o || "",
      url: l || location.href.split("#")[0]
    };
    d && (u.image = String(d)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const p = "nimbi-jsonld";
    let f = document.getElementById(p);
    f || (f = document.createElement("script"), f.type = "application/ld+json", f.id = p, document.head.appendChild(f)), f.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    console.warn("[seoManager] setStructuredData failed", s);
  }
}
let Wt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function ks(e) {
  try {
    if (!e || typeof e != "object") {
      Wt = {};
      return;
    }
    Wt = Object.assign({}, e);
  } catch (t) {
    console.warn("[seoManager] setSeoMap failed", t);
  }
}
function xs(e, t = "") {
  try {
    if (!e) return;
    const n = Wt && Wt[e] ? Wt[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ji("canonical", i);
      try {
        pt("property", "og:url", i);
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
      n.description && nn("description", String(n.description));
    } catch {
    }
    try {
      try {
        mr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      yr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      console.warn("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    console.warn("[seoManager] injectSeoForPage failed", n);
  }
}
function vn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      nn("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && nn("description", String(s));
    } catch {
    }
    try {
      mr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      yr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    console.warn("[seoManager] markNotFound failed", r);
  }
}
function Ss(e, t, n, i, r, a, s, c, o, d, l) {
  try {
    if (i && i.querySelector) {
      const u = i.querySelector(".menu-label");
      u && (u.textContent = c && c.textContent || e("onThisPage"));
    }
  } catch (u) {
    console.warn("[seoManager] update toc label failed", u);
  }
  try {
    const u = n.meta && n.meta.title ? String(n.meta.title).trim() : "", p = r.querySelector("img"), f = p && (p.getAttribute("src") || p.src) || null;
    let y = "";
    try {
      let m = "";
      try {
        const b = c || (r && r.querySelector ? r.querySelector("h1") : null);
        if (b) {
          let _ = b.nextElementSibling;
          const w = [];
          for (; _ && !(_.tagName && _.tagName.toLowerCase() === "h2"); ) {
            try {
              if (_.classList && _.classList.contains("nimbi-article-subtitle")) {
                _ = _.nextElementSibling;
                continue;
              }
            } catch {
            }
            const x = (_.textContent || "").trim();
            x && w.push(x), _ = _.nextElementSibling;
          }
          w.length && (m = w.join(" ").replace(/\s+/g, " ").trim()), !m && o && (m = String(o).trim());
        }
      } catch (b) {
        console.warn("[seoManager] compute descOverride failed", b);
      }
      m && String(m).length > 160 && (m = String(m).slice(0, 157).trim() + "..."), y = m;
    } catch (m) {
      console.warn("[seoManager] compute descOverride failed", m);
    }
    let g = "";
    try {
      u && (g = u);
    } catch {
    }
    if (!g)
      try {
        c && c.textContent && (g = String(c.textContent).trim());
      } catch {
      }
    if (!g)
      try {
        const m = r.querySelector("h2");
        m && m.textContent && (g = String(m.textContent).trim());
      } catch {
      }
    g || (g = a || "");
    try {
      mr(n, g || void 0, f, y);
    } catch (m) {
      console.warn("[seoManager] setMetaTags failed", m);
    }
    try {
      yr(n, d, g || void 0, f, y, t);
    } catch (m) {
      console.warn("[seoManager] setStructuredData failed", m);
    }
    const h = _s();
    g ? h ? document.title = `${h} - ${g}` : document.title = `${t || "Site"} - ${g}` : u ? document.title = u : document.title = t || document.title;
  } catch (u) {
    console.warn("[seoManager] applyPageMeta failed", u);
  }
  try {
    try {
      const u = r.querySelectorAll(".nimbi-reading-time");
      u && u.forEach((p) => p.remove());
    } catch {
    }
    if (o) {
      const u = bs(l.raw || ""), p = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, f = p ? e("readingTime", { minutes: p }) : "";
      if (!f) return;
      const y = r.querySelector("h1");
      if (y) {
        const g = r.querySelector(".nimbi-article-subtitle");
        try {
          if (g) {
            const h = document.createElement("span");
            h.className = "nimbi-reading-time", h.textContent = f, g.appendChild(h);
          } else {
            const h = document.createElement("p");
            h.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = f, h.appendChild(m);
            try {
              y.parentElement.insertBefore(h, y.nextSibling);
            } catch {
              try {
                y.insertAdjacentElement("afterend", h);
              } catch {
              }
            }
          }
        } catch {
          try {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = f, m.appendChild(b), y.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    console.warn("[seoManager] reading time update failed", u);
  }
}
let Hi = 100;
function ei(e) {
  Hi = e;
}
let Zt = 300 * 1e3;
function ti(e) {
  Zt = e;
}
const Ve = /* @__PURE__ */ new Map();
function vs(e) {
  if (!Ve.has(e)) return;
  const t = Ve.get(e), n = Date.now();
  if (t.ts + Zt < n) {
    Ve.delete(e);
    return;
  }
  return Ve.delete(e), Ve.set(e, t), t.value;
}
function As(e, t) {
  if (ni(), ni(), Ve.delete(e), Ve.set(e, { value: t, ts: Date.now() }), Ve.size > Hi) {
    const n = Ve.keys().next().value;
    n !== void 0 && Ve.delete(n);
  }
}
function ni() {
  if (!Zt || Zt <= 0) return;
  const e = Date.now();
  for (const [t, n] of Ve.entries())
    n.ts + Zt < e && Ve.delete(t);
}
async function Es(e, t) {
  const n = new Set(st), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = et(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const p = se(u.page);
              if (p) {
                n.add(p);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const p = u.page;
              if (re.has(p)) {
                const f = re.get(p);
                if (f) return f;
              }
              continue;
            }
          }
        } catch {
        }
        const s = new URL(a, location.href);
        if (s.origin !== location.origin) continue;
        const c = (s.hash || s.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (s.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (c) {
          let u = se(c[1]);
          u && n.add(u);
          continue;
        }
        const o = (r.textContent || "").trim(), d = (s.pathname || "").replace(/^.*\//, "");
        if (o && we(o) === e || d && we(d.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const l = s.pathname || "";
        if (l) {
          const u = new URL(t), p = Lt(u.pathname);
          if (l.indexOf(p) !== -1) {
            let f = l.startsWith(p) ? l.slice(p.length) : l;
            f = se(f), f && n.add(f);
          }
        }
      } catch (s) {
        console.warn("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await xe(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const c = (s[1] || "").trim();
        if (c && we(c) === e)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function Ls(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (re.has(n)) {
        const i = on(n) || re.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (st && st.size)
          for (const i of st) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (we(r) === n && !/index\.html$/i.test(i)) {
              t.push(i);
              break;
            }
          }
        !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
      }
    } catch (n) {
      console.warn("[router] buildPageCandidates failed during slug handling", n);
    }
  return t;
}
async function Ms(e, t) {
  const n = e || "";
  try {
    if (typeof window < "u" && window.__nimbiCMSDebug)
      try {
        window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}, window.__nimbiCMSDebug.fetchPageData = (window.__nimbiCMSDebug.fetchPageData || 0) + 1;
      } catch {
      }
  } catch {
  }
  let i = null;
  try {
    const h = et(typeof location < "u" ? location.href : "");
    h && h.anchor && (i = h.anchor);
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
    const h = String(r).split("::", 2);
    r = h[0], a = h[1] || null;
  }
  const o = `${e}|||${typeof Ga < "u" && wt ? wt : ""}`, d = vs(o);
  if (d)
    r = d.resolved, a = d.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let h = decodeURIComponent(String(r || ""));
      if (h && typeof h == "string" && (h = se(h), h = zt(h)), re.has(h))
        r = on(h) || re.get(h);
      else {
        let m = await Es(h, t);
        if (m)
          r = m;
        else if (fr._refreshed && st && st.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await qi(h, t);
          b && (r = b);
        }
      }
    }
    As(o, { resolved: r, anchor: a });
  }
  !a && i && (a = i);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const h = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const m = await fetch(h);
        if (m && m.ok) {
          const b = await m.text(), _ = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", w = (b || "").toLowerCase();
          if (_ && _.indexOf && _.indexOf("text/html") !== -1 || w.indexOf("<!doctype") !== -1 || w.indexOf("<html") !== -1) {
            if (!s)
              try {
                let C = h;
                try {
                  C = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  C = String(h || "").replace(/^\//, "");
                }
                const B = C.replace(/\.html$/i, ".md");
                try {
                  const z = await xe(B, t);
                  if (z && z.raw)
                    return { data: z, pagePath: B, anchor: a };
                } catch {
                }
                try {
                  const z = await xe(Re, t);
                  if (z && z.raw) {
                    try {
                      vn(z.meta || {}, Re);
                    } catch {
                    }
                    return { data: z, pagePath: Re, anchor: a };
                  }
                } catch {
                }
                try {
                  g = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (w.indexOf('<div id="app"') !== -1 || w.indexOf("nimbi-cms") !== -1 || w.indexOf("nimbi-mount") !== -1 || w.indexOf("nimbi-") !== -1 || w.indexOf("initcms(") !== -1 || w.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(w))
              try {
                let C = h;
                try {
                  C = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  C = String(h || "").replace(/^\//, "");
                }
                const B = C.replace(/\.html$/i, ".md");
                try {
                  const z = await xe(B, t);
                  if (z && z.raw)
                    return { data: z, pagePath: B, anchor: a };
                } catch {
                }
                try {
                  const z = await xe(Re, t);
                  if (z && z.raw) {
                    try {
                      vn(z.meta || {}, Re);
                    } catch {
                    }
                    return { data: z, pagePath: Re, anchor: a };
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
  const l = Ls(r);
  try {
    try {
      console.warn("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: l });
    } catch {
    }
  } catch {
  }
  const u = String(n || "").includes(".md") || String(n || "").includes(".html");
  let p = null;
  if (!u)
    try {
      let h = decodeURIComponent(String(n || ""));
      h = se(h), h = zt(h), h && !/\.(md|html?)$/i.test(h) && (p = h);
    } catch {
      p = null;
    }
  if (u && l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 1 && /index\.html$/i.test(l[0]) && !u && !re.has(r) && !re.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let f = null, y = null, g = null;
  for (const h of l)
    if (h)
      try {
        const m = se(h);
        if (f = await xe(m, t), y = m, p && !re.has(p))
          try {
            let b = "";
            if (f && f.isHtml)
              try {
                const _ = typeof DOMParser < "u" ? new DOMParser() : null;
                if (_) {
                  const w = _.parseFromString(f.raw || "", "text/html"), x = w.querySelector("h1") || w.querySelector("title");
                  x && x.textContent && (b = x.textContent.trim());
                }
              } catch {
              }
            else {
              const _ = (f && f.raw || "").match(/^#\s+(.+)$/m);
              _ && _[1] && (b = _[1].trim());
            }
            if (b && we(b) !== p)
              try {
                if (/\.html$/i.test(m)) {
                  const w = m.replace(/\.html$/i, ".md");
                  if (l.includes(w))
                    try {
                      const x = await xe(w, t);
                      if (x && x.raw)
                        f = x, y = w;
                      else
                        try {
                          const S = await xe(Re, t);
                          if (S && S.raw)
                            f = S, y = Re;
                          else {
                            f = null, y = null, g = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          f = null, y = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                    } catch {
                      try {
                        const S = await xe(Re, t);
                        if (S && S.raw)
                          f = S, y = Re;
                        else {
                          f = null, y = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        f = null, y = null, g = new Error("slug mismatch for candidate");
                        continue;
                      }
                    }
                  else {
                    f = null, y = null, g = new Error("slug mismatch for candidate");
                    continue;
                  }
                } else {
                  f = null, y = null, g = new Error("slug mismatch for candidate");
                  continue;
                }
              } catch {
                f = null, y = null, g = new Error("slug mismatch for candidate");
                continue;
              }
          } catch {
          }
        try {
          if (!u && /\.html$/i.test(m)) {
            const b = m.replace(/\.html$/i, ".md");
            if (l.includes(b))
              try {
                const w = String(f && f.raw || "").trim().slice(0, 128).toLowerCase();
                if (f && f.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(w) || w.indexOf('<div id="app"') !== -1 || w.indexOf("nimbi-") !== -1 || w.indexOf("nimbi") !== -1 || w.indexOf("initcms(") !== -1) {
                  let S = !1;
                  try {
                    const C = await xe(b, t);
                    if (C && C.raw)
                      f = C, y = b, S = !0;
                    else
                      try {
                        const B = await xe(Re, t);
                        B && B.raw && (f = B, y = Re, S = !0);
                      } catch {
                      }
                  } catch {
                    try {
                      const B = await xe(Re, t);
                      B && B.raw && (f = B, y = Re, S = !0);
                    } catch {
                    }
                  }
                  if (!S) {
                    f = null, y = null, g = new Error("site shell detected (candidate HTML rejected)");
                    continue;
                  }
                }
              } catch {
              }
          }
        } catch {
        }
        try {
          try {
            console.warn("[router-debug] fetchPageData accepted candidate", { candidate: m, pagePath: y, isHtml: f && f.isHtml, snippet: f && f.raw ? String(f.raw).slice(0, 160) : null });
          } catch {
          }
        } catch {
        }
        break;
      } catch (m) {
        g = m;
        try {
          console.warn("[router] candidate fetch failed", { candidate: h, contentBase: t, err: m && m.message || m });
        } catch {
        }
      }
  if (!f) {
    try {
      console.warn("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: l, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: l, contentBase: t, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      const h = await xe(Re, t);
      if (h && h.raw) {
        try {
          vn(h.meta || {}, Re);
        } catch {
        }
        return { data: h, pagePath: Re, anchor: a };
      }
    } catch {
    }
    try {
      if (u && String(n || "").toLowerCase().includes(".html"))
        try {
          const h = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", h);
          const m = await fetch(h);
          if (m && m.ok) {
            const b = await m.text(), _ = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", w = (b || "").toLowerCase(), x = _ && _.indexOf && _.indexOf("text/html") !== -1 || w.indexOf("<!doctype") !== -1 || w.indexOf("<html") !== -1;
            if (x || console.warn("[router] absolute fetch returned non-HTML", { abs: h, contentType: _, snippet: w.slice(0, 200) }), x) {
              const S = (b || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(b) || /<h1>\s*index of\b/i.test(b) || S.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(b) || /<h1>\s*directory listing/i.test(b))
                try {
                  console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: h });
                } catch {
                }
              else
                try {
                  const B = h, z = new URL(".", B).toString();
                  try {
                    const Z = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (Z) {
                      const W = Z.parseFromString(b || "", "text/html"), E = (R, Q) => {
                        try {
                          const ee = Q.getAttribute(R) || "";
                          if (!ee || /^(https?:)?\/\//i.test(ee) || ee.startsWith("/") || ee.startsWith("#")) return;
                          try {
                            const le = new URL(ee, B).toString();
                            Q.setAttribute(R, le);
                          } catch (le) {
                            console.warn("[router] rewrite attribute failed", R, le);
                          }
                        } catch (ee) {
                          console.warn("[router] rewrite helper failed", ee);
                        }
                      }, P = W.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), J = [];
                      for (const R of Array.from(P || []))
                        try {
                          const Q = R.tagName ? R.tagName.toLowerCase() : "";
                          if (Q === "a") continue;
                          if (R.hasAttribute("src")) {
                            const ee = R.getAttribute("src");
                            E("src", R);
                            const le = R.getAttribute("src");
                            ee !== le && J.push({ attr: "src", tag: Q, before: ee, after: le });
                          }
                          if (R.hasAttribute("href") && Q === "link") {
                            const ee = R.getAttribute("href");
                            E("href", R);
                            const le = R.getAttribute("href");
                            ee !== le && J.push({ attr: "href", tag: Q, before: ee, after: le });
                          }
                          if (R.hasAttribute("href") && Q !== "link") {
                            const ee = R.getAttribute("href");
                            E("href", R);
                            const le = R.getAttribute("href");
                            ee !== le && J.push({ attr: "href", tag: Q, before: ee, after: le });
                          }
                          if (R.hasAttribute("xlink:href")) {
                            const ee = R.getAttribute("xlink:href");
                            E("xlink:href", R);
                            const le = R.getAttribute("xlink:href");
                            ee !== le && J.push({ attr: "xlink:href", tag: Q, before: ee, after: le });
                          }
                          if (R.hasAttribute("poster")) {
                            const ee = R.getAttribute("poster");
                            E("poster", R);
                            const le = R.getAttribute("poster");
                            ee !== le && J.push({ attr: "poster", tag: Q, before: ee, after: le });
                          }
                          if (R.hasAttribute("srcset")) {
                            const Le = (R.getAttribute("srcset") || "").split(",").map((ve) => ve.trim()).filter(Boolean).map((ve) => {
                              const [A, O] = ve.split(/\s+/, 2);
                              if (!A || /^(https?:)?\/\//i.test(A) || A.startsWith("/")) return ve;
                              try {
                                const D = new URL(A, B).toString();
                                return O ? `${D} ${O}` : D;
                              } catch {
                                return ve;
                              }
                            }).join(", ");
                            R.setAttribute("srcset", Le);
                          }
                        } catch {
                        }
                      const L = W.documentElement && W.documentElement.outerHTML ? W.documentElement.outerHTML : b;
                      try {
                        J && J.length && console.warn("[router] rewritten asset refs", { abs: h, rewritten: J });
                      } catch {
                      }
                      return { data: { raw: L, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let K = b;
                  return /<base\s+[^>]*>/i.test(b) || (/<head[^>]*>/i.test(b) ? K = b.replace(/(<head[^>]*>)/i, `$1<base href="${z}">`) : K = `<base href="${z}">` + b), { data: { raw: K, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: b, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (h) {
          console.warn("[router] absolute HTML fetch fallback failed", h);
        }
    } catch {
    }
    try {
      const h = decodeURIComponent(String(r || ""));
      if (h && !/\.(md|html?)$/i.test(h)) {
        const m = [
          `/assets/${h}.html`,
          `/assets/${h}/index.html`
        ];
        for (const b of m)
          try {
            const _ = await fetch(b, { method: "GET" });
            if (_ && _.ok)
              return { data: { raw: await _.text(), isHtml: !0 }, pagePath: b.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (h) {
      console.warn("[router] assets fallback failed", h);
    }
    throw new Error("no page data");
  }
  return { data: f, pagePath: y, anchor: a };
}
function zn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var _t = zn();
function Ui(e) {
  _t = e;
}
var vt = { exec: () => null };
function _e(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Ze.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Rs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ze = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Cs = /^(?:[ \t]*(?:\n|$))+/, Ts = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ps = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, cn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, $s = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, br = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Fi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Wi = _e(Fi).replace(/bull/g, br).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), zs = _e(Fi).replace(/bull/g, br).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), wr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Is = /^[^\n]+/, _r = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Os = _e(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _r).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Bs = _e(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, br).getRegex(), In = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", kr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ns = _e("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", kr).replace("tag", In).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Zi = _e(wr).replace("hr", cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", In).getRegex(), Ds = _e(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Zi).getRegex(), xr = { blockquote: Ds, code: Ts, def: Os, fences: Ps, heading: $s, hr: cn, html: Ns, lheading: Wi, list: Bs, newline: Cs, paragraph: Zi, table: vt, text: Is }, ri = _e("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", In).getRegex(), qs = { ...xr, lheading: zs, table: ri, paragraph: _e(wr).replace("hr", cn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ri).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", In).getRegex() }, js = { ...xr, html: _e(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", kr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: vt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: _e(wr).replace("hr", cn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Wi).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Hs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Us = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Gi = /^( {2,}|\\)\n(?!\s*$)/, Fs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, On = /[\p{P}\p{S}]/u, Sr = /[\s\p{P}\p{S}]/u, Qi = /[^\s\p{P}\p{S}]/u, Ws = _e(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Sr).getRegex(), Xi = /(?!~)[\p{P}\p{S}]/u, Zs = /(?!~)[\s\p{P}\p{S}]/u, Gs = /(?:[^\s\p{P}\p{S}]|~)/u, Ki = /(?![*_])[\p{P}\p{S}]/u, Qs = /(?![*_])[\s\p{P}\p{S}]/u, Xs = /(?:[^\s\p{P}\p{S}]|[*_])/u, Ks = _e(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Rs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Vi = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Vs = _e(Vi, "u").replace(/punct/g, On).getRegex(), Ys = _e(Vi, "u").replace(/punct/g, Xi).getRegex(), Yi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Js = _e(Yi, "gu").replace(/notPunctSpace/g, Qi).replace(/punctSpace/g, Sr).replace(/punct/g, On).getRegex(), eo = _e(Yi, "gu").replace(/notPunctSpace/g, Gs).replace(/punctSpace/g, Zs).replace(/punct/g, Xi).getRegex(), to = _e("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Qi).replace(/punctSpace/g, Sr).replace(/punct/g, On).getRegex(), no = _e(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ki).getRegex(), ro = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", io = _e(ro, "gu").replace(/notPunctSpace/g, Xs).replace(/punctSpace/g, Qs).replace(/punct/g, Ki).getRegex(), ao = _e(/\\(punct)/, "gu").replace(/punct/g, On).getRegex(), so = _e(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), oo = _e(kr).replace("(?:-->|$)", "-->").getRegex(), lo = _e("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", oo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Rn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, co = _e(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Rn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ji = _e(/^!?\[(label)\]\[(ref)\]/).replace("label", Rn).replace("ref", _r).getRegex(), ea = _e(/^!?\[(ref)\](?:\[\])?/).replace("ref", _r).getRegex(), uo = _e("reflink|nolink(?!\\()", "g").replace("reflink", Ji).replace("nolink", ea).getRegex(), ii = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, vr = { _backpedal: vt, anyPunctuation: ao, autolink: so, blockSkip: Ks, br: Gi, code: Us, del: vt, delLDelim: vt, delRDelim: vt, emStrongLDelim: Vs, emStrongRDelimAst: Js, emStrongRDelimUnd: to, escape: Hs, link: co, nolink: ea, punctuation: Ws, reflink: Ji, reflinkSearch: uo, tag: lo, text: Fs, url: vt }, ho = { ...vr, link: _e(/^!?\[(label)\]\((.*?)\)/).replace("label", Rn).getRegex(), reflink: _e(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Rn).getRegex() }, rr = { ...vr, emStrongRDelimAst: eo, emStrongLDelim: Ys, delLDelim: no, delRDelim: io, url: _e(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ii).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: _e(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ii).getRegex() }, fo = { ...rr, br: _e(Gi).replace("{2,}", "*").getRegex(), text: _e(rr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, bn = { normal: xr, gfm: qs, pedantic: js }, Bt = { normal: vr, gfm: rr, breaks: fo, pedantic: ho }, po = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ai = (e) => po[e];
function it(e, t) {
  if (t) {
    if (Ze.escapeTest.test(e)) return e.replace(Ze.escapeReplace, ai);
  } else if (Ze.escapeTestNoEncode.test(e)) return e.replace(Ze.escapeReplaceNoEncode, ai);
  return e;
}
function si(e) {
  try {
    e = encodeURI(e).replace(Ze.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function oi(e, t) {
  let n = e.replace(Ze.findPipe, (a, s, c) => {
    let o = !1, d = s;
    for (; --d >= 0 && c[d] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Ze.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Ze.slashPipe, "|");
  return i;
}
function Nt(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function go(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function mo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function li(e, t, n, i, r) {
  let a = t.href, s = t.title || null, c = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: c, tokens: i.inlineTokens(c) };
  return i.state.inLink = !1, o;
}
function yo(e, t, n) {
  let i = e.match(n.other.indentCodeCompensation);
  if (i === null) return t;
  let r = i[1];
  return t.split(`
`).map((a) => {
    let s = a.match(n.other.beginningSpace);
    if (s === null) return a;
    let [c] = s;
    return c.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var rn = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || _t;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Nt(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = yo(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Nt(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Nt(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = Nt(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), s = !0;
        else if (!s) c.push(n[o]);
        else break;
        n = n.slice(o);
        let d = c.join(`
`), l = d.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${d}` : d, r = r ? `${r}
${l}` : l;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(l, a, !0), this.lexer.state.top = u, n.length === 0) break;
        let p = a.at(-1);
        if (p?.type === "code") break;
        if (p?.type === "blockquote") {
          let f = p, y = f.raw + `
` + n.join(`
`), g = this.blockquote(y);
          a[a.length - 1] = g, i = i.substring(0, i.length - f.raw.length) + g.raw, r = r.substring(0, r.length - f.text.length) + g.text;
          break;
        } else if (p?.type === "list") {
          let f = p, y = f.raw + `
` + n.join(`
`), g = this.list(y);
          a[a.length - 1] = g, i = i.substring(0, i.length - p.raw.length) + g.raw, r = r.substring(0, r.length - f.raw.length) + g.raw, n = y.substring(a.at(-1).raw.length).split(`
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
        let o = !1, d = "", l = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        d = t[0], e = e.substring(d.length);
        let u = mo(t[2].split(`
`, 1)[0], t[1].length), p = e.split(`
`, 1)[0], f = !u.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, l = u.trimStart()) : f ? y = t[1].length + 1 : (y = u.search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, l = u.slice(y), y += t[1].length), f && this.rules.other.blankLine.test(p) && (d += p + `
`, e = e.substring(p.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(y), h = this.rules.other.hrRegex(y), m = this.rules.other.fencesBeginRegex(y), b = this.rules.other.headingBeginRegex(y), _ = this.rules.other.htmlBeginRegex(y), w = this.rules.other.blockquoteBeginRegex(y);
          for (; e; ) {
            let x = e.split(`
`, 1)[0], S;
            if (p = x, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), S = p) : S = p.replace(this.rules.other.tabCharGlobal, "    "), m.test(p) || b.test(p) || _.test(p) || w.test(p) || g.test(p) || h.test(p)) break;
            if (S.search(this.rules.other.nonSpaceChar) >= y || !p.trim()) l += `
` + S.slice(y);
            else {
              if (f || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || m.test(u) || b.test(u) || h.test(u)) break;
              l += `
` + p;
            }
            f = !p.trim(), d += x + `
`, e = e.substring(x.length + 1), u = S.slice(y);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(d) && (s = !0)), r.items.push({ type: "list_item", raw: d, task: !!this.options.gfm && this.rules.other.listIsTask.test(l), loose: !1, text: l, tokens: [] }), r.raw += d;
      }
      let c = r.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let o of r.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let l = this.lexer.inlineQueue.length - 1; l >= 0; l--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[l].src)) {
              this.lexer.inlineQueue[l].src = this.lexer.inlineQueue[l].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let d = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (d) {
            let l = { type: "checkbox", raw: d[0] + " ", checked: d[0] !== "[ ]" };
            o.checked = l.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = l.raw + o.tokens[0].raw, o.tokens[0].text = l.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(l)) : o.tokens.unshift({ type: "paragraph", raw: l.raw, text: l.raw, tokens: [l] }) : o.tokens.unshift(l);
          }
        }
        if (!r.loose) {
          let d = o.tokens.filter((u) => u.type === "space"), l = d.length > 0 && d.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = l;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let d of o.tokens) d.type === "text" && (d.type = "paragraph");
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
    let n = oi(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(oi(s, a.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[o] })));
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
        let a = Nt(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = go(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), li(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return li(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, c = r, o = 0, d = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = d.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (s = [...a].length, i[3] || i[4]) {
          c += s;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + s) % 3)) {
          o += s;
          continue;
        }
        if (c -= s, c > 0) continue;
        s = Math.min(s, s + c + o);
        let l = [...i[0]][0].length, u = e.slice(0, r + i.index + l + s);
        if (Math.min(r, s) % 2) {
          let f = u.slice(1, -1);
          return { type: "em", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let p = u.slice(2, -2);
        return { type: "strong", raw: u, text: p, tokens: this.lexer.inlineTokens(p) };
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
      let r = [...i[0]].length - 1, a, s, c = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = o.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          c += s;
          continue;
        }
        if (c -= s, c > 0) continue;
        s = Math.min(s, s + c);
        let d = [...i[0]][0].length, l = e.slice(0, r + i.index + d + s), u = l.slice(r, -r);
        return { type: "del", raw: l, text: u, tokens: this.lexer.inlineTokens(u) };
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
}, Xe = class ir {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || _t, this.options.tokenizer = this.options.tokenizer || new rn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Ze, block: bn.normal, inline: Bt.normal };
    this.options.pedantic ? (n.block = bn.pedantic, n.inline = Bt.pedantic) : this.options.gfm && (n.block = bn.gfm, this.options.breaks ? n.inline = Bt.breaks : n.inline = Bt.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: bn, inline: Bt };
  }
  static lex(t, n) {
    return new ir(n).lex(t);
  }
  static lexInline(t, n) {
    return new ir(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Ze.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Ze.tabCharGlobal, "    ").replace(Ze.spaceLine, "")); t; ) {
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
        let s = 1 / 0, c = t.slice(1), o;
        this.options.extensions.startBlock.forEach((d) => {
          o = d.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
    let s = !1, c = "";
    for (; t; ) {
      s || (c = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((l) => (o = l.call({ lexer: this }, t, n)) ? (t = t.substring(o.raw.length), n.push(o), !0) : !1)) continue;
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
        let l = n.at(-1);
        o.type === "text" && l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(t, i, c)) {
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
      if (o = this.tokenizer.del(t, i, c)) {
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
      let d = t;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0, u = t.slice(1), p;
        this.options.extensions.startInline.forEach((f) => {
          p = f.call({ lexer: this }, u), typeof p == "number" && p >= 0 && (l = Math.min(l, p));
        }), l < 1 / 0 && l >= 0 && (d = t.substring(0, l + 1));
      }
      if (o = this.tokenizer.inlineText(d)) {
        t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), s = !0;
        let l = n.at(-1);
        l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : n.push(o);
        continue;
      }
      if (t) {
        let l = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return n;
  }
}, an = class {
  options;
  parser;
  constructor(e) {
    this.options = e || _t;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(Ze.notSpaceStart)?.[0], r = e.replace(Ze.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + it(i) + '">' + (n ? r : it(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : it(r, !0)) + `</code></pre>
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
      let c = e.items[s];
      i += this.listitem(c);
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
    return `<code>${it(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = si(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + it(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = si(e);
    if (r === null) return it(n);
    e = r;
    let a = `<img src="${e}" alt="${it(n)}"`;
    return t && (a += ` title="${it(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : it(e.text);
  }
}, Bn = class {
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
}, Ke = class ar {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || _t, this.options.renderer = this.options.renderer || new an(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Bn();
  }
  static parse(t, n) {
    return new ar(n).parse(t);
  }
  static parseInline(t, n) {
    return new ar(n).parseInline(t);
  }
  parse(t) {
    let n = "";
    for (let i = 0; i < t.length; i++) {
      let r = t[i];
      if (this.options.extensions?.renderers?.[r.type]) {
        let s = r, c = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
          n += c || "";
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
        let c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          i += c || "";
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
          let c = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return i;
  }
}, Pt = class {
  options;
  block;
  constructor(e) {
    this.options = e || _t;
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
    return this.block ? Xe.lex : Xe.lexInline;
  }
  provideParser() {
    return this.block ? Ke.parse : Ke.parseInline;
  }
}, ta = class {
  defaults = zn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Ke;
  Renderer = an;
  TextRenderer = Bn;
  Lexer = Xe;
  Tokenizer = rn;
  Hooks = Pt;
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
            let c = r.renderer.apply(this, s);
            return c === !1 && (c = a.apply(this, s)), c;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = t[r.level];
          a ? a.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), i.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new an(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, c = n.renderer[s], o = r[s];
          r[s] = (...d) => {
            let l = c.apply(r, d);
            return l === !1 && (l = o.apply(r, d)), l || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new rn(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, c = n.tokenizer[s], o = r[s];
          r[s] = (...d) => {
            let l = c.apply(r, d);
            return l === !1 && (l = o.apply(r, d)), l;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Pt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, c = n.hooks[s], o = r[s];
          Pt.passThroughHooks.has(a) ? r[s] = (d) => {
            if (this.defaults.async && Pt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await c.call(r, d);
              return o.call(r, u);
            })();
            let l = c.call(r, d);
            return o.call(r, l);
          } : r[s] = (...d) => {
            if (this.defaults.async) return (async () => {
              let u = await c.apply(r, d);
              return u === !1 && (u = await o.apply(r, d)), u;
            })();
            let l = c.apply(r, d);
            return l === !1 && (l = o.apply(r, d)), l;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, a = n.walkTokens;
        i.walkTokens = function(s) {
          let c = [];
          return c.push(a.call(this, s)), r && (c = c.concat(r.call(this, s))), c;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return Xe.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Ke.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, c = await (r.hooks ? await r.hooks.provideLexer() : e ? Xe.lex : Xe.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let d = await (r.hooks ? await r.hooks.provideParser() : e ? Ke.parse : Ke.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(d) : d;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? Xe.lex : Xe.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : e ? Ke.parse : Ke.parseInline)(s, r);
        return r.hooks && (c = r.hooks.postprocess(c)), c;
      } catch (s) {
        return a(s);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let i = "<p>An error occurred:</p><pre>" + it(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Mt = new ta();
function pe(e, t) {
  return Mt.parse(e, t);
}
pe.options = pe.setOptions = function(e) {
  return Mt.setOptions(e), pe.defaults = Mt.defaults, Ui(pe.defaults), pe;
};
pe.getDefaults = zn;
pe.defaults = _t;
pe.use = function(...e) {
  return Mt.use(...e), pe.defaults = Mt.defaults, Ui(pe.defaults), pe;
};
pe.walkTokens = function(e, t) {
  return Mt.walkTokens(e, t);
};
pe.parseInline = Mt.parseInline;
pe.Parser = Ke;
pe.parser = Ke.parse;
pe.Renderer = an;
pe.TextRenderer = Bn;
pe.Lexer = Xe;
pe.lexer = Xe.lex;
pe.Tokenizer = rn;
pe.Hooks = Pt;
pe.parse = pe;
var bo = pe.options, wo = pe.setOptions, _o = pe.use, ko = pe.walkTokens, xo = pe.parseInline, So = pe, vo = Ke.parse, Ao = Xe.lex;
const ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Pt,
  Lexer: Xe,
  Marked: ta,
  Parser: Ke,
  Renderer: an,
  TextRenderer: Bn,
  Tokenizer: rn,
  get defaults() {
    return _t;
  },
  getDefaults: zn,
  lexer: Ao,
  marked: pe,
  options: bo,
  parse: So,
  parseInline: xo,
  parser: vo,
  setOptions: wo,
  use: _o,
  walkTokens: ko
}, Symbol.toStringTag, { value: "Module" })), na = `function O() {
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
`, ui = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", na], { type: "text/javascript;charset=utf-8" });
function Eo(e) {
  let t;
  try {
    if (t = ui && (self.URL || self.webkitURL).createObjectURL(ui), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(na),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Cn(e) {
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
function ra(e) {
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
const Gt = ci && (pe || ci) || void 0;
let Fe = null;
const Lo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function Tn() {
  if (Fe) return Fe;
  try {
    try {
      const e = await import(Lo + "/lib/core.js");
      Fe = e.default || e;
    } catch {
      Fe = null;
    }
  } catch {
    Fe = null;
  }
  return Fe;
}
Gt && typeof Gt.setOptions == "function" && Gt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Fe && t && typeof Fe.getLanguage == "function" && Fe.getLanguage(t) ? Fe.highlight(e, { language: t }).value : Fe && typeof Fe.getLanguage == "function" && Fe.getLanguage("plaintext") ? Fe.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: l, url: u } = t;
      try {
        if (!await Tn()) {
          postMessage({ type: "register-error", name: l, error: "hljs unavailable" });
          return;
        }
        const f = await import(u), y = f.default || f;
        Fe.registerLanguage(l, y), postMessage({ type: "registered", name: l });
      } catch (p) {
        postMessage({ type: "register-error", name: l, error: String(p) });
      }
      return;
    }
    if (t.type === "detect") {
      const l = t.md || "", u = t.supported || [], p = /* @__PURE__ */ new Set(), f = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let y;
      for (; y = f.exec(l); )
        if (y[1]) {
          const g = String(y[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && p.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && p.add(g), u && u.length)
            try {
              u.indexOf(g) !== -1 && p.add(g);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(p) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Cn(i || "");
    await Tn().catch(() => {
    });
    let s = Gt.parse(r);
    const c = [], o = /* @__PURE__ */ new Map(), d = (l) => {
      try {
        return String(l || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, u, p, f) => {
      const y = Number(u);
      let g = f.replace(/<[^>]+>/g, "").trim();
      try {
        g = ra(g);
      } catch {
      }
      let h = null;
      const m = (p || "").match(/\sid="([^"]+)"/);
      m && (h = m[1]);
      const b = h || d(g) || "heading", w = (o.get(b) || 0) + 1;
      o.set(b, w);
      const x = w === 1 ? b : b + "-" + w;
      c.push({ level: y, text: g, id: x });
      const S = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, C = y <= 2 ? "has-text-weight-bold" : y <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", B = (S[y] + " " + C).trim(), K = ((p || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${x}" class="${B}"`).trim();
      return `<h${y} ${K}>${f}</h${y}>`;
    }), s = s.replace(/<img([^>]*)>/g, (l, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: c } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Mo(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: d } = e;
      try {
        if (!await Tn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const u = await import(d), p = u.default || u;
        return Fe.registerLanguage(o, p), { type: "registered", name: o };
      } catch (l) {
        return { type: "register-error", name: o, error: String(l) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", d = e.supported || [], l = /* @__PURE__ */ new Set(), u = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let p;
      for (; p = u.exec(o); )
        if (p[1]) {
          const f = String(p[1]).toLowerCase();
          if (!f) continue;
          if (f.length >= 5 && f.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(f) && l.add(f), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(f) && l.add(f), d && d.length)
            try {
              d.indexOf(f) !== -1 && l.add(f);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(l) };
    }
    const t = e && e.id, { content: n, data: i } = Cn(e && e.md || "");
    await Tn().catch(() => {
    });
    let r = Gt.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), c = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, d, l, u) => {
      const p = Number(d);
      let f = u.replace(/<[^>]+>/g, "").trim();
      try {
        f = ra(f);
      } catch {
      }
      let y = null;
      const g = (l || "").match(/\sid="([^"]+)"/);
      g && (y = g[1]);
      const h = y || c(f) || "heading", b = (s.get(h) || 0) + 1;
      s.set(h, b);
      const _ = b === 1 ? h : h + "-" + b;
      a.push({ level: p, text: f, id: _ });
      const w = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, x = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", S = (w[p] + " " + x).trim(), B = ((l || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${_}" class="${S}"`).trim();
      return `<h${p} ${B}>${u}</h${p}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, d) => /\bloading=/.test(d) ? `<img${d}>` : /\bdata-want-lazy=/.test(d) ? `<img${d}>` : `<img${d} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Xn = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, Ro = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Co() {
  if (typeof Worker < "u")
    try {
      return new Eo();
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
          const r = { data: await Mo(n) }(e.message || []).forEach((a) => a(r));
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
const ia = Mi(() => Co(), "markdown", Ro), hi = typeof DOMParser < "u" ? new DOMParser() : null, Et = () => ia.get(), Ar = (e) => ia.send(e, 3e3), ot = [];
function sr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    ot.push(e);
    try {
      pe.use(e);
    } catch (t) {
      console.warn("[markdown] failed to apply plugin", t);
    }
  }
}
function To(e) {
  ot.length = 0, Array.isArray(e) && ot.push(...e.filter((t) => t && typeof t == "object"));
  try {
    ot.forEach((t) => pe.use(t));
  } catch (t) {
    console.warn("[markdown] failed to apply markdown extensions", t);
  }
}
async function Pn(e) {
  if (ot && ot.length) {
    let { content: i, data: r } = Cn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, c) => Xn[c] || s);
    } catch {
    }
    pe.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      ot.forEach((s) => pe.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = pe.parse(i);
    try {
      const s = hi || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const c = s.parseFromString(a, "text/html"), o = c.querySelectorAll("h1,h2,h3,h4,h5,h6"), d = [], l = /* @__PURE__ */ new Set(), u = (f) => {
          try {
            return String(f || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, p = (f) => {
          const y = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, g = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (y[f] + " " + g).trim();
        };
        o.forEach((f) => {
          try {
            const y = Number(f.tagName.substring(1)), g = (f.textContent || "").trim();
            let h = u(g) || "heading", m = h, b = 2;
            for (; l.has(m); )
              m = h + "-" + b, b += 1;
            l.add(m), f.id = m, f.className = p(y), d.push({ level: y, text: g, id: m });
          } catch {
          }
        });
        try {
          c.querySelectorAll("img").forEach((f) => {
            try {
              const y = f.getAttribute && f.getAttribute("loading"), g = f.getAttribute && f.getAttribute("data-want-lazy");
              !y && !g && f.setAttribute && f.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          c.querySelectorAll("pre code, code[class]").forEach((f) => {
            try {
              const y = f.getAttribute && f.getAttribute("class") || f.className || "", g = String(y || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (g)
                try {
                  f.setAttribute && f.setAttribute("class", g);
                } catch {
                  f.className = g;
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
        return { html: c.body.innerHTML, meta: r || {}, toc: d };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => aa);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Et && Et();
    }
  else
    t = Et && Et();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => Xn[r] || i);
  } catch {
  }
  try {
    if (typeof ke < "u" && ke && typeof ke.getLanguage == "function" && ke.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Cn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (d, l) => Xn[l] || d);
      } catch {
      }
      pe.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (d, l) => {
        try {
          return l && ke.getLanguage && ke.getLanguage(l) ? ke.highlight(d, { language: l }).value : ke && typeof ke.getLanguage == "function" && ke.getLanguage("plaintext") ? ke.highlight(d, { language: "plaintext" }).value : d;
        } catch {
          return d;
        }
      } });
      let a = pe.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (d, l) => {
          try {
            if (l && ke && typeof ke.highlight == "function")
              try {
                const u = ke.highlight(l, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (ke && typeof ke.highlightElement == "function") {
                    const p = { innerHTML: l };
                    return ke.highlightElement(p), `<pre><code>${p.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return d;
        });
      } catch {
      }
      const s = [], c = /* @__PURE__ */ new Set(), o = (d) => {
        try {
          return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (d, l, u, p) => {
        const f = Number(l), y = p.replace(/<[^>]+>/g, "").trim();
        let g = o(y) || "heading", h = g, m = 2;
        for (; c.has(h); )
          h = g + "-" + m, m += 1;
        c.add(h), s.push({ level: f, text: y, id: h });
        const b = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, _ = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", w = (b[f] + " " + _).trim(), S = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${h}" class="${w}"`).trim();
        return `<h${f} ${S}>${p}</h${f}>`;
      }), a = a.replace(/<img([^>]*)>/g, (d, l) => /\bloading=/.test(l) ? `<img${l}>` : /\bdata-want-lazy=/.test(l) ? `<img${l}>` : `<img${l} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Ar({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const d = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, l = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (d[o] + " " + l).trim();
    };
    let c = n.html;
    c = c.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, d, l, u) => {
      const p = Number(d), f = u.replace(/<[^>]+>/g, "").trim(), y = (l || "").match(/\sid="([^"]+)"/), g = y ? y[1] : a(f) || "heading", m = (i.get(g) || 0) + 1;
      i.set(g, m);
      const b = m === 1 ? g : g + "-" + m;
      r.push({ level: p, text: f, id: b });
      const _ = s(p), x = ((l || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${_}"`).trim();
      return `<h${p} ${x}>${u}</h${p}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const d = hi || (typeof DOMParser < "u" ? new DOMParser() : null);
        if (d) {
          const l = d.parseFromString(c, "text/html");
          l.querySelectorAll("img").forEach((p) => {
            try {
              const f = p.getAttribute("src") || "";
              (f ? new URL(f, location.href).toString() : "") === o && p.remove();
            } catch {
            }
          }), c = l.body.innerHTML;
        } else
          try {
            const l = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            c = c.replace(new RegExp(`<img[^>]*src=\\"${l}\\"[^>]*>`, "g"), "");
          } catch {
          }
      }
    } catch {
    }
    return { html: c, meta: n.meta || {}, toc: r };
  } catch {
    return { html: n.html, meta: n.meta || {}, toc: n.toc || [] };
  }
}
function Qt(e, t) {
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
      const c = s[1].toLowerCase();
      if (ki.has(c) || t && t.size && c.length < 3 && !t.has(c) && !(Qe && Qe[c] && t.has(Qe[c]))) continue;
      if (t && t.size) {
        if (t.has(c)) {
          const d = t.get(c);
          d && n.add(d);
          continue;
        }
        if (Qe && Qe[c]) {
          const d = Qe[c];
          if (t.has(d)) {
            const l = t.get(d) || d;
            n.add(l);
            continue;
          }
        }
      }
      (a.has(c) || c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(c) && !r.has(c)) && n.add(c);
    }
  return n;
}
async function or(e, t) {
  if (ot && ot.length || typeof process < "u" && process.env && process.env.VITEST) return Qt(e || "", t);
  if (Et && Et())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Ar({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return Qt(e || "", t);
}
const aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Ar,
  addMarkdownExtension: sr,
  detectFenceLanguages: Qt,
  detectFenceLanguagesAsync: or,
  initRendererWorker: Et,
  markdownPlugins: ot,
  parseMarkdownToHtml: Pn,
  setMarkdownExtensions: To
}, Symbol.toStringTag, { value: "Module" })), Po = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
        const c = new DOMParser().parseFromString(i || "", "text/html"), o = c.body;
        await Er(o, r, a, { canonical: !0 }), postMessage({ id: n, result: c.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function $o(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), c = s.body;
        return await Er(c, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function Je(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Xr(e, t);
  } catch {
    return Xr(e, t);
  }
}
const zo = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function Io(...e) {
  try {
    zo && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Oo(e, t) {
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
function Bo(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  return r.className = "menu-list", t.forEach((a) => {
    const s = document.createElement("li"), c = document.createElement("a");
    try {
      const o = String(a.path || "");
      try {
        c.setAttribute("href", Me(o));
      } catch {
        o && o.indexOf("/") === -1 ? c.setAttribute("href", "#" + encodeURIComponent(o)) : c.setAttribute("href", Je(o));
      }
    } catch {
      c.setAttribute("href", "#" + a.path);
    }
    if (c.textContent = a.name, s.appendChild(c), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((d) => {
        const l = document.createElement("li"), u = document.createElement("a");
        try {
          const p = String(d.path || "");
          try {
            u.setAttribute("href", Me(p));
          } catch {
            p && p.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(p)) : u.setAttribute("href", Je(p));
          }
        } catch {
          u.setAttribute("href", "#" + d.path);
        }
        u.textContent = d.name, l.appendChild(u), o.appendChild(l);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function No(e, t, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const c = {};
    (t || []).forEach((o) => {
      try {
        if (!o || o.level === 1) return;
        const d = Number(o.level) >= 2 ? Number(o.level) : 2, l = document.createElement("li"), u = document.createElement("a"), p = Xa(o.text || ""), f = o.id || we(p);
        u.textContent = p;
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), b = m && U && U.has && U.has(m) ? U.get(m) : m;
          b ? u.href = Me(b, f) : u.href = `#${encodeURIComponent(f)}`;
        } catch (m) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", m), u.href = `#${encodeURIComponent(f)}`;
        }
        if (l.appendChild(u), d === 2) {
          a.appendChild(l), c[2] = l, Object.keys(c).forEach((m) => {
            Number(m) > 2 && delete c[m];
          });
          return;
        }
        let y = d - 1;
        for (; y > 2 && !c[y]; ) y--;
        y < 2 && (y = 2);
        let g = c[y];
        if (!g) {
          a.appendChild(l), c[d] = l;
          return;
        }
        let h = g.querySelector("ul");
        h || (h = document.createElement("ul"), g.appendChild(h)), h.appendChild(l), c[d] = l;
      } catch (d) {
        console.warn("[htmlBuilder] buildTocElement item failed", d, o);
      }
    });
  } catch (c) {
    console.warn("[htmlBuilder] buildTocElement failed", c);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function sa(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = we(n.textContent || ""));
  });
}
function Do(e, t, n) {
  try {
    const i = e.querySelectorAll("img");
    if (i && i.length) {
      const r = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
      i.forEach((a) => {
        const s = a.getAttribute("src") || "";
        if (s && !(/^(https?:)?\/\//.test(s) || s.startsWith("/")))
          try {
            const c = new URL(r + s, n).toString();
            a.src = c;
            try {
              a.getAttribute("loading") || a.setAttribute("data-want-lazy", "1");
            } catch (o) {
              console.warn("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (c) {
            console.warn("[htmlBuilder] resolve image src failed", c);
          }
      });
    }
  } catch (i) {
    console.warn("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function di(e, t, n) {
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
        const c = s.tagName ? s.tagName.toLowerCase() : "", o = (d) => {
          try {
            const l = s.getAttribute(d) || "";
            if (!l || /^(https?:)?\/\//i.test(l) || l.startsWith("/") || l.startsWith("#")) return;
            try {
              s.setAttribute(d, new URL(l, r).toString());
            } catch (u) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", d, l, u);
            }
          } catch (l) {
            console.warn("[htmlBuilder] rewriteAttr failed", l);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && c !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const u = (s.getAttribute("srcset") || "").split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
            const [f, y] = p.split(/\s+/, 2);
            if (!f || /^(https?:)?\/\//i.test(f) || f.startsWith("/")) return p;
            try {
              const g = new URL(f, r).toString();
              return y ? `${g} ${y}` : g;
            } catch {
              return p;
            }
          }).join(", ");
          s.setAttribute("srcset", u);
        }
      } catch (c) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", c);
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let fi = "", Kn = null, pi = "";
async function Er(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === fi && Kn)
      a = Kn, s = pi;
    else {
      try {
        a = new URL(t, location.href), s = Lt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Lt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      fi = t, Kn = a, pi = s;
    }
    const c = /* @__PURE__ */ new Set(), o = [], d = /* @__PURE__ */ new Set(), l = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const p = u.getAttribute("href") || "";
        if (!p || Li(p)) continue;
        try {
          if (p.startsWith("?") || p.indexOf("?") !== -1)
            try {
              const y = new URL(p, t || location.href), g = y.searchParams.get("page");
              if (g && g.indexOf("/") === -1 && n) {
                const h = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (h) {
                  const m = se(h + g), b = i && i.canonical ? Me(m, y.hash ? y.hash.replace(/^#/, "") : null) : Je(m, y.hash ? y.hash.replace(/^#/, "") : null);
                  u.setAttribute("href", b);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (p.startsWith("/") && !p.endsWith(".md")) continue;
        const f = p.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (f) {
          let y = f[1];
          const g = f[2];
          !y.startsWith("/") && n && (y = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + y);
          try {
            const h = new URL(y, t).pathname;
            let m = h.startsWith(s) ? h.slice(s.length) : h;
            m = se(m), o.push({ node: u, mdPathRaw: y, frag: g, rel: m }), U.has(m) || c.add(m);
          } catch (h) {
            console.warn("[htmlBuilder] resolve mdPath failed", h);
          }
          continue;
        }
        try {
          let y = p;
          !p.startsWith("/") && n && (p.startsWith("#") ? y = n + p : y = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          const h = new URL(y, t).pathname || "";
          if (h && h.indexOf(s) !== -1) {
            let m = h.startsWith(s) ? h.slice(s.length) : h;
            if (m = se(m), m = zt(m), m || (m = "_home"), !m.endsWith(".md")) {
              let b = null;
              try {
                if (U && U.has && U.has(m))
                  b = U.get(m);
                else
                  try {
                    const _ = String(m || "").replace(/^.*\//, "");
                    _ && U.has && U.has(_) && (b = U.get(_));
                  } catch (_) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", _);
                  }
              } catch (_) {
                console.warn("[htmlBuilder] mdToSlug access check failed", _);
              }
              if (!b)
                try {
                  const _ = String(m || "").replace(/^.*\//, "");
                  for (const [w, x] of re || [])
                    if (x === m || x === _) {
                      b = w;
                      break;
                    }
                } catch {
                }
              if (b) {
                const _ = i && i.canonical ? Me(b, null) : Je(b);
                u.setAttribute("href", _);
              } else {
                let _ = m;
                try {
                  /\.[^\/]+$/.test(String(m || "")) || (_ = String(m || "") + ".html");
                } catch {
                  _ = m;
                }
                d.add(_), l.push({ node: u, rel: _ });
              }
            }
          }
        } catch (y) {
          console.warn("[htmlBuilder] resolving href to URL failed", y);
        }
      } catch (p) {
        console.warn("[htmlBuilder] processing anchor failed", p);
      }
    c.size && await Promise.all(Array.from(c).map(async (u) => {
      try {
        try {
          const f = String(u).match(/([^\/]+)\.md$/), y = f && f[1];
          if (y && re.has(y)) {
            try {
              const g = re.get(y);
              if (g)
                try {
                  U.set(g, y);
                } catch (h) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", h);
                }
            } catch (g) {
              console.warn("[htmlBuilder] reading slugToMd failed", g);
            }
            return;
          }
        } catch (f) {
          console.warn("[htmlBuilder] basename slug lookup failed", f);
        }
        const p = await xe(u, t);
        if (p && p.raw) {
          const f = (p.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const y = we(f[1].trim());
            if (y)
              try {
                re.set(y, u), U.set(u, y);
              } catch (g) {
                console.warn("[htmlBuilder] setting slug mapping failed", g);
              }
          }
        }
      } catch (p) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", p);
      }
    })), d.size && await Promise.all(Array.from(d).map(async (u) => {
      try {
        const p = await xe(u, t);
        if (p && p.raw)
          try {
            const y = (Lr || new DOMParser()).parseFromString(p.raw, "text/html"), g = y.querySelector("title"), h = y.querySelector("h1"), m = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : h && h.textContent ? h.textContent.trim() : null;
            if (m) {
              const b = we(m);
              if (b)
                try {
                  re.set(b, u), U.set(u, b);
                } catch (_) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", _);
                }
            }
          } catch (f) {
            console.warn("[htmlBuilder] parse fetched HTML failed", f);
          }
      } catch (p) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", p);
      }
    }));
    for (const u of o) {
      const { node: p, frag: f, rel: y } = u;
      let g = null;
      try {
        U.has(y) && (g = U.get(y));
      } catch (h) {
        console.warn("[htmlBuilder] mdToSlug access failed", h);
      }
      if (g) {
        const h = i && i.canonical ? Me(g, f) : Je(g, f);
        p.setAttribute("href", h);
      } else {
        const h = i && i.canonical ? Me(y, f) : Je(y, f);
        p.setAttribute("href", h);
      }
    }
    for (const u of l) {
      const { node: p, rel: f } = u;
      let y = null;
      try {
        U.has(f) && (y = U.get(f));
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", g);
      }
      if (!y)
        try {
          const g = String(f || "").replace(/^.*\//, "");
          U.has(g) && (y = U.get(g));
        } catch (g) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
        }
      if (y) {
        const g = i && i.canonical ? Me(y, null) : Je(y);
        p.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? Me(f, null) : Je(f);
        p.setAttribute("href", g);
      }
    }
  } catch (r) {
    console.warn("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function qo(e, t, n, i) {
  const r = t.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    let c = "";
    try {
      e && e.meta && e.meta.title && (c = String(e.meta.title).trim());
    } catch {
    }
    if (!c && a && (c = a), !c)
      try {
        const o = t.querySelector("h2");
        o && o.textContent && (c = String(o.textContent).trim());
      } catch {
      }
    !c && n && (c = String(n)), c && (s = we(c)), s || (s = "_home");
    try {
      n && (re.set(s, n), U.set(n, s));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const d = et(typeof location < "u" ? location.href : "");
          d && d.anchor && d.page && String(d.page) === String(s) ? o = d.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", Je(s, o));
      } catch (d) {
        console.warn("[htmlBuilder] computeSlug history replace failed", d);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (c) {
    console.warn("[htmlBuilder] computeSlug failed", c);
  }
  try {
    if (e && e.meta && e.meta.title && r) {
      const c = String(e.meta.title).trim();
      if (c && c !== a) {
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
async function jo(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const d = o.getAttribute("href") || "";
      if (!d) continue;
      let p = se(d).split(/::|#/, 2)[0];
      try {
        const y = p.indexOf("?");
        y !== -1 && (p = p.slice(0, y));
      } catch {
      }
      if (!p || (p.includes(".") || (p = p + ".html"), !/\.html(?:$|[?#])/.test(p) && !p.toLowerCase().endsWith(".html"))) continue;
      const f = p;
      try {
        if (U && U.has && U.has(f)) continue;
      } catch (y) {
        console.warn("[htmlBuilder] mdToSlug check failed", y);
      }
      try {
        let y = !1;
        for (const g of re.values())
          if (g === f) {
            y = !0;
            break;
          }
        if (y) continue;
      } catch (y) {
        console.warn("[htmlBuilder] slugToMd iteration failed", y);
      }
      n.add(f);
    } catch (d) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", d);
    }
  if (!n.size) return;
  const i = async (o) => {
    try {
      const d = await xe(o, t);
      if (d && d.raw)
        try {
          const u = (Lr || new DOMParser()).parseFromString(d.raw, "text/html"), p = u.querySelector("title"), f = u.querySelector("h1"), y = p && p.textContent && p.textContent.trim() ? p.textContent.trim() : f && f.textContent ? f.textContent.trim() : null;
          if (y) {
            const g = we(y);
            if (g)
              try {
                re.set(g, o), U.set(o, g);
              } catch (h) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", h);
              }
          }
        } catch (l) {
          console.warn("[htmlBuilder] parse HTML title failed", l);
        }
    } catch (d) {
      console.warn("[htmlBuilder] fetchAndExtract failed", d);
    }
  }, r = 5, a = Array.from(n);
  let s = 0;
  const c = [];
  for (; s < a.length; ) {
    const o = a.slice(s, s + r);
    c.push(Promise.all(o.map(i))), s += r;
  }
  await Promise.all(c);
}
async function Ho(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Lt(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const c = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let o = se(c[1]);
        try {
          let d;
          try {
            d = Oo(o, t);
          } catch (u) {
            d = o, console.warn("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const l = d && r && d.startsWith(r) ? d.slice(r.length) : String(d || "").replace(/^\//, "");
          n.push({ rel: l }), U.has(l) || i.add(l);
        } catch (d) {
          console.warn("[htmlBuilder] rewriteAnchors failed", d);
        }
        continue;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  i.size && await Promise.all(Array.from(i).map(async (a) => {
    try {
      const s = String(a).match(/([^\/]+)\.md$/), c = s && s[1];
      if (c && re.has(c)) {
        try {
          const o = re.get(c);
          o && U.set(o, c);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", s);
    }
    try {
      const s = await xe(a, t);
      if (s && s.raw) {
        const c = (s.raw || "").match(/^#\s+(.+)$/m);
        if (c && c[1]) {
          const o = we(c[1].trim());
          if (o)
            try {
              re.set(o, a), U.set(a, o);
            } catch (d) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", d);
            }
        }
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", s);
    }
  }));
}
const Lr = typeof DOMParser < "u" ? new DOMParser() : null;
function Vn(e) {
  try {
    const n = (Lr || new DOMParser()).parseFromString(e || "", "text/html");
    sa(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (d) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", d);
        }
      });
    } catch (c) {
      console.warn("[htmlBuilder] parseHtml query images failed", c);
    }
    n.querySelectorAll("pre code, code[class]").forEach((c) => {
      try {
        const o = c.getAttribute && c.getAttribute("class") || c.className || "", d = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (d && d[1]) {
          const l = (d[1] || "").toLowerCase(), u = ge.size && (ge.get(l) || ge.get(String(l).toLowerCase())) || l;
          try {
            (async () => {
              try {
                await en(u);
              } catch (p) {
                console.warn("[htmlBuilder] registerLanguage failed", p);
              }
            })();
          } catch (p) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", p);
          }
        } else
          try {
            if (ke && typeof ke.getLanguage == "function" && ke.getLanguage("plaintext")) {
              const l = ke.highlight ? ke.highlight(c.textContent || "", { language: "plaintext" }) : null;
              l && l.value && (c.innerHTML = l.value);
            }
          } catch (l) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", l);
          }
      } catch (o) {
        console.warn("[htmlBuilder] code element processing failed", o);
      }
    });
    const r = [];
    n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((c) => {
      r.push({ level: Number(c.tagName.substring(1)), text: (c.textContent || "").trim(), id: c.id });
    });
    const s = {};
    try {
      const c = n.querySelector("title");
      c && c.textContent && String(c.textContent).trim() && (s.title = String(c.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: s, toc: r };
  } catch (t) {
    return console.warn("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function Uo(e) {
  const t = or ? await or(e || "", ge) : Qt(e || "", ge), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = ge.size && (ge.get(r) || ge.get(String(r).toLowerCase())) || r;
      try {
        i.push(en(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(en(r));
        } catch (s) {
          console.warn("[htmlBuilder] ensureLanguages push alias failed", s);
        }
    } catch (a) {
      console.warn("[htmlBuilder] ensureLanguages inner failed", a);
    }
  try {
    await Promise.all(i);
  } catch (r) {
    console.warn("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function Fo(e) {
  if (await Uo(e), Pn) {
    const t = await Pn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function Wo(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = typeof DOMParser < "u" ? new DOMParser() : null;
      if (u) {
        const p = u.parseFromString(t.raw || "", "text/html");
        try {
          di(p.body, n, r);
        } catch (f) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", f);
        }
        a = Vn(p.documentElement && p.documentElement.outerHTML ? p.documentElement.outerHTML : t.raw || "");
      } else
        a = Vn(t.raw || "");
    } catch {
      a = Vn(t.raw || "");
    }
  else
    a = await Fo(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    di(s, n, r);
  } catch (u) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    sa(s);
  } catch (u) {
    console.warn("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((p) => {
      try {
        const f = p.getAttribute && p.getAttribute("class") || p.className || "", y = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (y)
          try {
            p.setAttribute && p.setAttribute("class", y);
          } catch (g) {
            p.className = y, console.warn("[htmlBuilder] set element class failed", g);
          }
        else
          try {
            p.removeAttribute && p.removeAttribute("class");
          } catch (g) {
            p.className = "", console.warn("[htmlBuilder] remove element class failed", g);
          }
      } catch (f) {
        console.warn("[htmlBuilder] code element cleanup failed", f);
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] processing code elements failed", u);
  }
  try {
    Ua(s);
  } catch (u) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", u);
  }
  Do(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((p) => {
      try {
        const f = p.parentElement;
        if (!f || f.tagName.toLowerCase() !== "p" || f.childNodes.length !== 1) return;
        const y = document.createElement("figure");
        y.className = "image", f.replaceWith(y), y.appendChild(p);
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((p) => {
      try {
        if (p.classList)
          p.classList.contains("table") || p.classList.add("table");
        else {
          const f = p.getAttribute && p.getAttribute("class") ? p.getAttribute("class") : "", y = String(f || "").split(/\s+/).filter(Boolean);
          y.indexOf("table") === -1 && y.push("table");
          try {
            p.setAttribute && p.setAttribute("class", y.join(" "));
          } catch {
            p.className = y.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: c, h1Text: o, slugKey: d } = qo(a, s, n, i);
  try {
    if (c && a && a.meta && (a.meta.author || a.meta.date) && !(c.parentElement && c.parentElement.querySelector && c.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const p = a.meta.author ? String(a.meta.author).trim() : "", f = a.meta.date ? String(a.meta.date).trim() : "";
      let y = "";
      try {
        const h = new Date(f);
        f && !isNaN(h.getTime()) ? y = h.toLocaleDateString() : y = f;
      } catch {
        y = f;
      }
      const g = [];
      if (p && g.push(p), y && g.push(y), g.length) {
        const h = document.createElement("p"), m = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", b = g.slice(1);
        if (h.className = "nimbi-article-subtitle is-6 has-text-grey-light", m) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-author", _.textContent = m, h.appendChild(_);
        }
        if (b.length) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-meta", _.textContent = b.join(" • "), h.appendChild(_);
        }
        try {
          c.parentElement.insertBefore(h, c.nextSibling);
        } catch {
          try {
            c.insertAdjacentElement("afterend", h);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await Xo(s, r, n);
  } catch (u) {
    Io("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await Er(s, r, n);
  }
  const l = No(e, a.toc, n);
  return { article: s, parsed: a, toc: l, topH1: c, h1Text: o, slugKey: d };
}
function Zo(e) {
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
                console.info("[htmlBuilder] executed inline script via Function");
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
              console.warn("[htmlBuilder] injected script error", { src: r, ev: a });
            } catch {
            }
          }), i.addEventListener("load", () => {
            try {
              console.info("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
                console.warn("[htmlBuilder] injected script append failed, skipping", { src: r, err: s });
              } catch {
              }
            }
          }
          n.parentNode && n.parentNode.removeChild(n);
          try {
            console.info("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          console.warn("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function gi(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    try {
      vn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, Re, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
    } catch {
    }
  } catch {
  }
  try {
    try {
      const s = typeof window < "u" && window.__nimbiNotFoundRedirect ? String(window.__nimbiNotFoundRedirect).trim() : null;
      if (s)
        try {
          const c = new URL(s, location.origin).toString();
          if ((location.href || "").split("#")[0] !== c)
            try {
              location.replace(c);
            } catch {
              location.href = c;
            }
        } catch {
        }
    } catch {
    }
  } catch {
  }
}
const oa = Ya(() => {
  const e = Ht(Po);
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
          const r = { data: await $o(n) };
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
function Go() {
  return oa.get();
}
function Qo(e) {
  return oa.send(e, 2e3);
}
async function Xo(e, t, n) {
  if (!Go()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Qo({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Ko(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = et(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
        let c = null;
        try {
          history && history.state && history.state.page && (c = history.state.page);
        } catch (o) {
          c = null, console.warn("[htmlBuilder] access history.state failed", o);
        }
        try {
          c || (c = new URL(location.href).searchParams.get("page"));
        } catch (o) {
          console.warn("[htmlBuilder] parse current location failed", o);
        }
        if (!a && s || a && c && String(a) === String(c)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: c || a }, "", Je(c || a, s));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
          } catch (o) {
            console.warn("[htmlBuilder] update history for anchor failed", o);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (o) {
            console.warn("[htmlBuilder] stopPropagation failed", o);
          }
          try {
            lr(s);
          } catch (o) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", Je(a, s));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (o) {
              console.warn("[htmlBuilder] window.renderByQuery failed", o);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (o) {
              console.warn("[htmlBuilder] dispatch popstate failed", o);
            }
          else
            try {
              renderByQuery();
            } catch (o) {
              console.warn("[htmlBuilder] renderByQuery failed", o);
            }
        } catch (o) {
          console.warn("[htmlBuilder] SPA navigation invocation failed", o);
        }
      } catch (r) {
        console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function lr(e) {
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
                  console.warn("[htmlBuilder] scrollIntoView failed", a);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              console.warn("[htmlBuilder] final scroll fallback failed", a);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (r) {
          console.warn("[htmlBuilder] scheduling scroll failed", r), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          n.scrollIntoView();
        } catch (r) {
          console.warn("[htmlBuilder] final scroll fallback failed", r);
        }
        console.warn("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      t && t.scrollTo ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        console.warn("[htmlBuilder] window.scrollTo failed", i);
      }
      console.warn("[htmlBuilder] scroll to top failed", n);
    }
}
function Vo(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const c = s || ((g) => typeof g == "string" ? g : ""), o = i || document.querySelector(".nimbi-cms"), d = r || document.querySelector(".nimbi-mount"), l = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top button is-primary is-rounded is-small", f.setAttribute("aria-label", c("scrollToTop")), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        l && l.appendChild ? l.appendChild(f) : o && o.appendChild ? o.appendChild(f) : d && d.appendChild ? d.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (h) {
          console.warn("[htmlBuilder] append scroll top button failed", h);
        }
      }
      try {
        try {
          Si(f);
        } catch {
        }
      } catch (g) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", g);
      }
      f.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (h) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", h);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (h) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", h);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (h) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", h);
          }
        }
      });
    }
    const y = u && u.querySelector ? u.querySelector(".menu-label") : null;
    if (t) {
      if (!f._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const g = globalThis.IntersectionObserver, h = new g((m) => {
            for (const b of m)
              b.target instanceof Element && (b.isIntersecting ? (f.classList.remove("show"), y && y.classList.remove("show")) : (f.classList.add("show"), y && y.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          f._nimbiObserver = h;
        } else
          f._nimbiObserver = null;
      try {
        f._nimbiObserver && typeof f._nimbiObserver.disconnect == "function" && f._nimbiObserver.disconnect();
      } catch (g) {
        console.warn("[htmlBuilder] observer disconnect failed", g);
      }
      try {
        f._nimbiObserver && typeof f._nimbiObserver.observe == "function" && f._nimbiObserver.observe(t);
      } catch (g) {
        console.warn("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const h = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, m = t.getBoundingClientRect();
            !(m.bottom < h.top || m.top > h.bottom) ? (f.classList.remove("show"), y && y.classList.remove("show")) : (f.classList.add("show"), y && y.classList.add("show"));
          } catch (h) {
            console.warn("[htmlBuilder] checkIntersect failed", h);
          }
        };
        g(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(g, 100);
      } catch (g) {
        console.warn("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      f.classList.remove("show"), y && y.classList.remove("show");
      const g = i instanceof Element ? i : r instanceof Element ? r : window, h = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (f.classList.add("show"), y && y.classList.add("show")) : (f.classList.remove("show"), y && y.classList.remove("show"));
        } catch (m) {
          console.warn("[htmlBuilder] onScroll handler failed", m);
        }
      };
      Ln(() => g.addEventListener("scroll", h)), h();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
const la = typeof window < "u" && window.__nimbiCMSDebug;
function wn(...e) {
  if (la)
    try {
      console.log(...e);
    } catch {
    }
}
function Pe(...e) {
  if (la)
    try {
      console.warn(...e);
    } catch {
    }
}
function mi(e, t) {
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
async function Yo(e, t, n, i, r, a, s, c, o = "eager", d = 1, l = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const p = typeof DOMParser < "u" ? new DOMParser() : null, f = p ? p.parseFromString(n || "", "text/html") : null, y = f ? f.querySelectorAll("a") : [];
  await Ln(() => jo(y, i)), await Ln(() => Ho(y, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let g = null, h = null, m = null, b = null, _ = null, w = null, x = !1, S = null;
  function C() {
    try {
      const A = document.querySelector(".navbar-burger"), O = A && A.dataset ? A.dataset.target : null, D = O ? document.getElementById(O) : null;
      A && A.classList.contains("is-active") && (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), D && D.classList.remove("is-active"));
    } catch (A) {
      Pe("[nimbi-cms] closeMobileMenu failed", A);
    }
  }
  async function B() {
    const A = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      A && A.classList.add("is-inactive");
    } catch {
    }
    try {
      const O = s && s();
      O && typeof O.then == "function" && await O;
    } catch (O) {
      try {
        Pe("[nimbi-cms] renderByQuery failed", O);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              A && A.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
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
  const z = () => g || (g = (async () => {
    try {
      const A = await Promise.resolve().then(() => bt), O = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, D = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, N = mi(A, "buildSearchIndex"), T = mi(A, "buildSearchIndexWorker"), I = typeof O == "function" ? O : N || void 0, v = typeof D == "function" ? D : T || void 0;
      wn("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof I + " workerFn=" + typeof v + " (global preferred)");
      const G = [];
      try {
        r && G.push(r);
      } catch {
      }
      try {
        navigationPage && G.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof v == "function")
        try {
          const oe = await v(i, d, l, G.length ? G : void 0);
          if (oe && oe.length) {
            try {
              if (A && typeof A._setSearchIndex == "function")
                try {
                  A._setSearchIndex(oe);
                } catch {
                }
            } catch {
            }
            return oe;
          }
        } catch (oe) {
          Pe("[nimbi-cms] worker builder threw", oe);
        }
      return typeof I == "function" ? (wn("[nimbi-cms test] calling buildFn"), await I(i, d, l, G.length ? G : void 0)) : [];
    } catch (A) {
      return Pe("[nimbi-cms] buildSearchIndex failed", A), [];
    } finally {
      if (h) {
        try {
          h.removeAttribute("disabled");
        } catch {
        }
        try {
          m && m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), g.then((A) => {
    try {
      try {
        S = Array.isArray(A) ? A : null;
      } catch {
        S = null;
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const T = await Promise.resolve().then(() => bt);
                try {
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(S) ? S : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(S) ? S : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(H) ? H : Array.isArray(S) ? S : [];
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
            window.__nimbi_indexDepth = d;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = l;
          } catch {
          }
        }
      } catch {
      }
      const O = String(h && h.value || "").trim().toLowerCase();
      if (!O || !Array.isArray(A) || !A.length) return;
      const D = A.filter((T) => T.title && T.title.toLowerCase().includes(O) || T.excerpt && T.excerpt.toLowerCase().includes(O));
      if (!D || !D.length) return;
      const N = document.getElementById("nimbi-search-results");
      if (!N) return;
      N.innerHTML = "";
      try {
        const T = document.createElement("div");
        T.className = "panel nimbi-search-panel", D.slice(0, 10).forEach((I) => {
          try {
            if (I.parentTitle) {
              const oe = document.createElement("p");
              oe.className = "panel-heading nimbi-search-title nimbi-search-parent", oe.textContent = I.parentTitle, T.appendChild(oe);
            }
            const v = document.createElement("a");
            v.className = "panel-block nimbi-search-result", v.href = Me(I.slug), v.setAttribute("role", "button");
            try {
              if (I.path && typeof I.slug == "string") {
                try {
                  re.set(I.slug, I.path);
                } catch {
                }
                try {
                  U.set(I.path, I.slug);
                } catch {
                }
              }
            } catch {
            }
            const G = document.createElement("div");
            G.className = "is-size-6 has-text-weight-semibold", G.textContent = I.title, v.appendChild(G), v.addEventListener("click", () => {
              try {
                N.style.display = "none";
              } catch {
              }
            }), T.appendChild(v);
          } catch {
          }
        }), N.appendChild(T);
        try {
          N.style.display = "block";
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
        if (x) return;
        x = !0;
        const A = await Promise.resolve().then(() => Yt);
        try {
          await A.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: d, noIndexing: l, includeAllMarkdown: !0 });
        } catch (O) {
          Pe("[nimbi-cms] sitemap trigger failed", O);
        }
      } catch (A) {
        try {
          Pe("[nimbi-cms] sitemap dynamic import failed", A);
        } catch {
        }
      }
    })();
  }), g), K = document.createElement("nav");
  K.className = "navbar", K.setAttribute("role", "navigation"), K.setAttribute("aria-label", "main navigation");
  const Z = document.createElement("div");
  Z.className = "navbar-brand";
  const W = y[0], E = document.createElement("a");
  if (E.className = "navbar-item", W) {
    const A = W.getAttribute("href") || "#";
    try {
      const D = new URL(A, location.href).searchParams.get("page"), N = D ? decodeURIComponent(D) : r;
      let T = null;
      try {
        typeof N == "string" && (/(?:\.md|\.html?)$/i.test(N) || N.includes("/")) && (T = L(N));
      } catch {
      }
      !T && typeof N == "string" && !String(N).includes(".") && (T = N);
      const I = T || N;
      E.href = Me(I), (!E.textContent || !String(E.textContent).trim()) && (E.textContent = a("home"));
    } catch {
      try {
        const D = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? L(r) : typeof r == "string" && !r.includes(".") ? r : null;
        E.href = Me(D || r);
      } catch {
        E.href = Me(r);
      }
      E.textContent = a("home");
    }
  } else
    E.href = Me(r), E.textContent = a("home");
  async function P(A) {
    try {
      if (!A || A === "none") return null;
      if (A === "favicon")
        try {
          const O = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!O) return null;
          const D = O.getAttribute("href") || "";
          return D && /\.png(?:\?|$)/i.test(D) ? new URL(D, location.href).toString() : null;
        } catch {
          return null;
        }
      if (A === "copy-first" || A === "move-first")
        try {
          const O = await xe(r, i);
          if (!O || !O.raw) return null;
          const T = new DOMParser().parseFromString(O.raw, "text/html").querySelector("img");
          if (!T) return null;
          const I = T.getAttribute("src") || "";
          if (!I) return null;
          const v = new URL(I, location.href).toString();
          if (A === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", v);
            } catch {
            }
          return v;
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
  let J = null;
  try {
    J = await P(u);
  } catch {
    J = null;
  }
  if (J)
    try {
      const A = document.createElement("img");
      A.className = "nimbi-navbar-logo";
      const O = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      A.alt = O, A.title = O, A.src = J;
      try {
        A.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!E.textContent || !String(E.textContent).trim()) && (E.textContent = O);
      } catch {
      }
      try {
        E.insertBefore(A, E.firstChild);
      } catch {
        try {
          E.appendChild(A);
        } catch {
        }
      }
    } catch {
    }
  Z.appendChild(E), E.addEventListener("click", function(A) {
    const O = E.getAttribute("href") || "";
    if (O.startsWith("?page=")) {
      A.preventDefault();
      const D = new URL(O, location.href), N = D.searchParams.get("page"), T = D.hash ? D.hash.replace(/^#/, "") : null;
      history.pushState({ page: N }, "", Me(N, T)), B();
      try {
        C();
      } catch {
      }
    }
  });
  function L(A) {
    try {
      if (!A) return null;
      const O = se(String(A || ""));
      try {
        if (U && U.has(O)) return U.get(O);
      } catch {
      }
      const D = O.replace(/^.*\//, "");
      try {
        if (U && U.has(D)) return U.get(D);
      } catch {
      }
      try {
        for (const [N, T] of re.entries())
          if (T) {
            if (typeof T == "string") {
              if (se(T) === O) return N;
            } else if (T && typeof T == "object") {
              if (T.default && se(T.default) === O) return N;
              const I = T.langs || {};
              for (const v in I)
                if (I[v] && se(I[v]) === O) return N;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const R = document.createElement("a");
  R.className = "navbar-burger", R.setAttribute("role", "button"), R.setAttribute("aria-label", "menu"), R.setAttribute("aria-expanded", "false");
  const Q = "nimbi-navbar-menu";
  R.dataset.target = Q, R.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', Z.appendChild(R);
  try {
    R.addEventListener("click", (A) => {
      try {
        const O = R.dataset && R.dataset.target ? R.dataset.target : null, D = O ? document.getElementById(O) : null;
        R.classList.contains("is-active") ? (R.classList.remove("is-active"), R.setAttribute("aria-expanded", "false"), D && D.classList.remove("is-active")) : (R.classList.add("is-active"), R.setAttribute("aria-expanded", "true"), D && D.classList.add("is-active"));
      } catch (O) {
        Pe("[nimbi-cms] navbar burger toggle failed", O);
      }
    });
  } catch (A) {
    Pe("[nimbi-cms] burger event binding failed", A);
  }
  const ee = document.createElement("div");
  ee.className = "navbar-menu", ee.id = Q;
  const le = document.createElement("div");
  le.className = "navbar-start";
  let Le = null, ve = null;
  if (!c)
    Le = null, h = null, b = null, _ = null, w = null;
  else {
    Le = document.createElement("div"), Le.className = "navbar-end", ve = document.createElement("div"), ve.className = "navbar-item", h = document.createElement("input"), h.className = "input", h.type = "search", h.placeholder = a("searchPlaceholder") || "", h.id = "nimbi-search";
    try {
      const T = (a && typeof a == "function" ? a("searchAria") : null) || h.placeholder || "Search";
      try {
        h.setAttribute("aria-label", T);
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
    o === "eager" && (h.disabled = !0), m = document.createElement("div"), m.className = "control", o === "eager" && m.classList.add("is-loading"), m.appendChild(h), ve.appendChild(m), b = document.createElement("div"), b.className = "dropdown is-right", b.id = "nimbi-search-dropdown";
    const A = document.createElement("div");
    A.className = "dropdown-trigger", A.appendChild(ve);
    const O = document.createElement("div");
    O.className = "dropdown-menu", O.setAttribute("role", "menu"), _ = document.createElement("div"), _.id = "nimbi-search-results", _.className = "dropdown-content nimbi-search-results", w = _, O.appendChild(_), b.appendChild(A), b.appendChild(O), Le.appendChild(b);
    const D = (T) => {
      if (!_) return;
      _.innerHTML = "";
      let I = -1;
      function v(ie) {
        try {
          const be = _.querySelector(".nimbi-search-result.is-selected");
          be && be.classList.remove("is-selected");
          const me = _.querySelectorAll(".nimbi-search-result");
          if (!me || !me.length) return;
          if (ie < 0) {
            I = -1;
            return;
          }
          ie >= me.length && (ie = me.length - 1);
          const V = me[ie];
          if (V) {
            V.classList.add("is-selected"), I = ie;
            try {
              V.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function G(ie) {
        try {
          const be = ie.key, me = _.querySelectorAll(".nimbi-search-result");
          if (!me || !me.length) return;
          if (be === "ArrowDown") {
            ie.preventDefault();
            const V = I < 0 ? 0 : Math.min(me.length - 1, I + 1);
            v(V);
            return;
          }
          if (be === "ArrowUp") {
            ie.preventDefault();
            const V = I <= 0 ? 0 : I - 1;
            v(V);
            return;
          }
          if (be === "Enter") {
            ie.preventDefault();
            const V = _.querySelector(".nimbi-search-result.is-selected") || _.querySelector(".nimbi-search-result");
            if (V)
              try {
                V.click();
              } catch {
              }
            return;
          }
          if (be === "Escape") {
            try {
              b.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              _.style.display = "none";
            } catch {
            }
            try {
              _.classList.remove("is-open");
            } catch {
            }
            try {
              _.removeAttribute("tabindex");
            } catch {
            }
            try {
              _.removeEventListener("keydown", G);
            } catch {
            }
            try {
              h && h.focus();
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", oe);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function oe(ie) {
        try {
          if (ie && ie.key === "ArrowDown") {
            ie.preventDefault();
            try {
              _.focus();
            } catch {
            }
            v(0);
          }
        } catch {
        }
      }
      try {
        const ie = document.createElement("div");
        ie.className = "panel nimbi-search-panel", T.forEach((be) => {
          if (be.parentTitle) {
            const te = document.createElement("p");
            te.textContent = be.parentTitle, te.className = "panel-heading nimbi-search-title nimbi-search-parent", ie.appendChild(te);
          }
          const me = document.createElement("a");
          me.className = "panel-block nimbi-search-result", me.href = Me(be.slug), me.setAttribute("role", "button");
          try {
            if (be.path && typeof be.slug == "string") {
              try {
                re.set(be.slug, be.path);
              } catch {
              }
              try {
                U.set(be.path, be.slug);
              } catch {
              }
            }
          } catch {
          }
          const V = document.createElement("div");
          V.className = "is-size-6 has-text-weight-semibold", V.textContent = be.title, me.appendChild(V), me.addEventListener("click", () => {
            if (b) {
              b.classList.remove("is-active");
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
            try {
              _.removeAttribute("tabindex");
            } catch {
            }
            try {
              _.removeEventListener("keydown", G);
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", oe);
            } catch {
            }
          }), ie.appendChild(me);
        }), _.appendChild(ie);
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
        _.style.display = "block";
      } catch {
      }
      try {
        _.classList.add("is-open");
      } catch {
      }
      try {
        _.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        _.addEventListener("keydown", G);
      } catch {
      }
      try {
        h && h.addEventListener("keydown", oe);
      } catch {
      }
    }, N = (T, I) => {
      let v = null;
      return (...G) => {
        v && clearTimeout(v), v = setTimeout(() => T(...G), I);
      };
    };
    if (h) {
      const T = N(async () => {
        const I = document.querySelector("input#nimbi-search"), v = String(I && I.value || "").trim().toLowerCase();
        if (!v) {
          D([]);
          return;
        }
        try {
          await z();
          const G = await g;
          wn('[nimbi-cms test] search handleInput q="' + v + '" idxlen=' + (Array.isArray(G) ? G.length : "nil"));
          const oe = G.filter((ie) => ie.title && ie.title.toLowerCase().includes(v) || ie.excerpt && ie.excerpt.toLowerCase().includes(v));
          wn("[nimbi-cms test] filtered len=" + (Array.isArray(oe) ? oe.length : "nil")), D(oe.slice(0, 10));
        } catch (G) {
          Pe("[nimbi-cms] search input handler failed", G), D([]);
        }
      }, 50);
      try {
        h.addEventListener("input", T);
      } catch {
      }
      try {
        document.addEventListener("input", (I) => {
          try {
            I && I.target && I.target.id === "nimbi-search" && T(I);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = z();
      } catch (T) {
        Pe("[nimbi-cms] eager search index init failed", T), g = Promise.resolve([]);
      }
      g.finally(() => {
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
            if (x) return;
            x = !0;
            const I = await g.catch(() => []), v = await Promise.resolve().then(() => Yt);
            try {
              await v.handleSitemapRequest({ index: Array.isArray(I) ? I : void 0, homePage: r, contentBase: i, indexDepth: d, noIndexing: l, includeAllMarkdown: !0 });
            } catch (G) {
              Pe("[nimbi-cms] sitemap trigger failed", G);
            }
          } catch (I) {
            try {
              Pe("[nimbi-cms] sitemap dynamic import failed", I);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const T = (I) => {
        try {
          const v = I && I.target;
          if (!w || !w.classList.contains("is-open") && w.style && w.style.display !== "block" || v && (w.contains(v) || h && (v === h || h.contains && h.contains(v)))) return;
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
        } catch {
        }
      };
      document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
    } catch {
    }
  }
  for (let A = 0; A < y.length; A++) {
    const O = y[A];
    if (A === 0) continue;
    const D = O.getAttribute("href") || "#", N = document.createElement("a");
    N.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(D) || D.endsWith(".md")) {
        const I = se(D).split(/::|#/, 2), v = I[0], G = I[1], oe = L(v);
        oe ? N.href = Me(oe, G) : N.href = Me(v, G);
      } else if (/\.html(?:$|[#?])/.test(D) || D.endsWith(".html")) {
        const I = se(D).split(/::|#/, 2);
        let v = I[0];
        v && !v.toLowerCase().endsWith(".html") && (v = v + ".html");
        const G = I[1], oe = L(v);
        if (oe)
          N.href = Me(oe, G);
        else
          try {
            const ie = await xe(v, i);
            if (ie && ie.raw)
              try {
                const me = new DOMParser().parseFromString(ie.raw, "text/html"), V = me.querySelector("title"), te = me.querySelector("h1"), qe = V && V.textContent && V.textContent.trim() ? V.textContent.trim() : te && te.textContent ? te.textContent.trim() : null;
                if (qe) {
                  const lt = we(qe);
                  if (lt) {
                    try {
                      re.set(lt, v), U.set(v, lt);
                    } catch (Nn) {
                      Pe("[nimbi-cms] slugToMd/mdToSlug set failed", Nn);
                    }
                    N.href = Me(lt, G);
                  } else
                    N.href = Me(v, G);
                } else
                  N.href = Me(v, G);
              } catch {
                N.href = Me(v, G);
              }
            else
              N.href = D;
          } catch {
            N.href = D;
          }
      } else
        N.href = D;
    } catch (T) {
      Pe("[nimbi-cms] nav item href parse failed", T), N.href = D;
    }
    try {
      const T = O.textContent && String(O.textContent).trim() ? String(O.textContent).trim() : null;
      if (T)
        try {
          const I = we(T);
          if (I) {
            const v = N.getAttribute("href") || "";
            let G = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(v))
              G = se(String(v || "").split(/[?#]/)[0]);
            else
              try {
                const oe = et(v);
                oe && oe.type === "canonical" && oe.page && (G = se(oe.page));
              } catch {
              }
            if (G) {
              let oe = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(G || "")))
                  oe = !0;
                else {
                  const ie = String(G || "").replace(/^\.\//, ""), be = ie.replace(/^.*\//, "");
                  Array.isArray(Ie) && Ie.length && (Ie.includes(ie) || Ie.includes(be)) && (oe = !0);
                }
              } catch {
                oe = !1;
              }
              if (oe) {
                try {
                  re.set(I, G);
                } catch {
                }
                try {
                  U.set(G, I);
                } catch {
                }
              }
            }
          }
        } catch (I) {
          Pe("[nimbi-cms] nav slug mapping failed", I);
        }
    } catch (T) {
      Pe("[nimbi-cms] nav slug mapping failed", T);
    }
    N.textContent = O.textContent || D, le.appendChild(N);
  }
  ee.appendChild(le), Le && ee.appendChild(Le), K.appendChild(Z), K.appendChild(ee), e.appendChild(K);
  try {
    const A = (O) => {
      try {
        const D = K && K.querySelector ? K.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!D || !D.classList.contains("is-active")) return;
        const N = D && D.closest ? D.closest(".navbar") : K;
        if (N && N.contains(O.target)) return;
        C();
      } catch {
      }
    };
    document.addEventListener("click", A, !0), document.addEventListener("touchstart", A, !0);
  } catch {
  }
  try {
    ee.addEventListener("click", (A) => {
      const O = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!O) return;
      const D = O.getAttribute("href") || "";
      try {
        const N = new URL(D, location.href), T = N.searchParams.get("page"), I = N.hash ? N.hash.replace(/^#/, "") : null;
        T && (A.preventDefault(), history.pushState({ page: T }, "", Me(T, I)), B());
      } catch (N) {
        Pe("[nimbi-cms] navbar click handler failed", N);
      }
      try {
        const N = K && K.querySelector ? K.querySelector(".navbar-burger") : null, T = N && N.dataset ? N.dataset.target : null, I = T ? document.getElementById(T) : null;
        N && N.classList.contains("is-active") && (N.classList.remove("is-active"), N.setAttribute("aria-expanded", "false"), I && I.classList.remove("is-active"));
      } catch (N) {
        Pe("[nimbi-cms] mobile menu close failed", N);
      }
    });
  } catch (A) {
    Pe("[nimbi-cms] attach content click handler failed", A);
  }
  try {
    t.addEventListener("click", (A) => {
      const O = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!O) return;
      const D = O.getAttribute("href") || "";
      if (D && !Li(D))
        try {
          const N = new URL(D, location.href), T = N.searchParams.get("page"), I = N.hash ? N.hash.replace(/^#/, "") : null;
          T && (A.preventDefault(), history.pushState({ page: T }, "", Me(T, I)), B());
        } catch (N) {
          Pe("[nimbi-cms] container click URL parse failed", N);
        }
    });
  } catch (A) {
    Pe("[nimbi-cms] build navbar failed", A);
  }
  return { navbar: K, linkEls: y };
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
let Ue = null, ae = null, Be = 1, at = (e, t) => t, Xt = 0, Kt = 0, An = () => {
}, jt = 0.25;
function Jo() {
  if (Ue && document.contains(Ue)) return Ue;
  Ue = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", at("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (L) => {
    L.target === e && Yn();
  }), e.addEventListener("wheel", (L) => {
    if (!K()) return;
    L.preventDefault();
    const R = L.deltaY < 0 ? jt : -jt;
    ut(Be + R), d(), l();
  }, { passive: !1 }), e.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      Yn();
      return;
    }
    if (Be > 1) {
      const R = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!R) return;
      const Q = 40;
      switch (L.key) {
        case "ArrowUp":
          R.scrollTop -= Q, L.preventDefault();
          break;
        case "ArrowDown":
          R.scrollTop += Q, L.preventDefault();
          break;
        case "ArrowLeft":
          R.scrollLeft -= Q, L.preventDefault();
          break;
        case "ArrowRight":
          R.scrollLeft += Q, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Ue = e, ae = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), c = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function d() {
    c && (c.textContent = `${Math.round(Be * 100)}%`);
  }
  const l = () => {
    o && (o.textContent = `${Math.round(Be * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  An = d, i.addEventListener("click", () => {
    ut(Be + jt), d(), l();
  }), r.addEventListener("click", () => {
    ut(Be - jt), d(), l();
  }), t.addEventListener("click", () => {
    Vt(), d(), l();
  }), n.addEventListener("click", () => {
    ut(1), d(), l();
  }), a.addEventListener("click", () => {
    Vt(), d(), l();
  }), s.addEventListener("click", Yn), t.title = at("imagePreviewFit", "Fit to screen"), n.title = at("imagePreviewOriginal", "Original size"), r.title = at("imagePreviewZoomOut", "Zoom out"), i.title = at("imagePreviewZoomIn", "Zoom in"), s.title = at("imagePreviewClose", "Close"), s.setAttribute("aria-label", at("imagePreviewClose", "Close"));
  let u = !1, p = 0, f = 0, y = 0, g = 0;
  const h = /* @__PURE__ */ new Map();
  let m = 0, b = 1;
  const _ = (L, R) => {
    const Q = L.x - R.x, ee = L.y - R.y;
    return Math.hypot(Q, ee);
  }, w = () => {
    u = !1, h.clear(), m = 0, ae && (ae.classList.add("is-panning"), ae.classList.remove("is-grabbing"));
  };
  let x = 0, S = 0, C = 0;
  const B = (L) => {
    const R = Date.now(), Q = R - x, ee = L.clientX - S, le = L.clientY - C;
    x = R, S = L.clientX, C = L.clientY, Q < 300 && Math.hypot(ee, le) < 30 && (ut(Be > 1 ? 1 : 2), d(), L.preventDefault());
  }, z = (L) => {
    ut(Be > 1 ? 1 : 2), d(), L.preventDefault();
  }, K = () => Ue ? typeof Ue.open == "boolean" ? Ue.open : Ue.classList.contains("is-active") : !1, Z = (L, R, Q = 1) => {
    if (h.has(Q) && h.set(Q, { x: L, y: R }), h.size === 2) {
      const ve = Array.from(h.values()), A = _(ve[0], ve[1]);
      if (m > 0) {
        const O = A / m;
        ut(b * O);
      }
      return;
    }
    if (!u) return;
    const ee = ae.closest(".nimbi-image-preview__image-wrapper");
    if (!ee) return;
    const le = L - p, Le = R - f;
    ee.scrollLeft = y - le, ee.scrollTop = g - Le;
  }, W = (L, R, Q = 1) => {
    if (!K()) return;
    if (h.set(Q, { x: L, y: R }), h.size === 2) {
      const Le = Array.from(h.values());
      m = _(Le[0], Le[1]), b = Be;
      return;
    }
    const ee = ae.closest(".nimbi-image-preview__image-wrapper");
    !ee || !(ee.scrollWidth > ee.clientWidth || ee.scrollHeight > ee.clientHeight) || (u = !0, p = L, f = R, y = ee.scrollLeft, g = ee.scrollTop, ae.classList.add("is-panning"), ae.classList.remove("is-grabbing"), window.addEventListener("pointermove", E), window.addEventListener("pointerup", P), window.addEventListener("pointercancel", P));
  }, E = (L) => {
    u && (L.preventDefault(), Z(L.clientX, L.clientY, L.pointerId));
  }, P = () => {
    w(), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", P), window.removeEventListener("pointercancel", P);
  };
  ae.addEventListener("pointerdown", (L) => {
    L.preventDefault(), W(L.clientX, L.clientY, L.pointerId);
  }), ae.addEventListener("pointermove", (L) => {
    (u || h.size === 2) && L.preventDefault(), Z(L.clientX, L.clientY, L.pointerId);
  }), ae.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && B(L), w();
  }), ae.addEventListener("dblclick", z), ae.addEventListener("pointercancel", w), ae.addEventListener("mousedown", (L) => {
    L.preventDefault(), W(L.clientX, L.clientY, 1);
  }), ae.addEventListener("mousemove", (L) => {
    u && L.preventDefault(), Z(L.clientX, L.clientY, 1);
  }), ae.addEventListener("mouseup", (L) => {
    L.preventDefault(), w();
  });
  const J = e.querySelector(".nimbi-image-preview__image-wrapper");
  return J && (J.addEventListener("pointerdown", (L) => {
    if (W(L.clientX, L.clientY, L.pointerId), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), J.addEventListener("pointermove", (L) => {
    Z(L.clientX, L.clientY, L.pointerId);
  }), J.addEventListener("pointerup", w), J.addEventListener("pointercancel", w), J.addEventListener("mousedown", (L) => {
    if (W(L.clientX, L.clientY, 1), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), J.addEventListener("mousemove", (L) => {
    Z(L.clientX, L.clientY, 1);
  }), J.addEventListener("mouseup", w)), e;
}
function ut(e) {
  if (!ae) return;
  const t = Number(e);
  Be = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = ae.getBoundingClientRect(), r = Xt || ae.naturalWidth || ae.width || i.width || 0, a = Kt || ae.naturalHeight || ae.height || i.height || 0;
  if (r && a) {
    ae.style.setProperty("--nimbi-preview-img-max-width", "none"), ae.style.setProperty("--nimbi-preview-img-max-height", "none"), ae.style.setProperty("--nimbi-preview-img-width", `${r * Be}px`), ae.style.setProperty("--nimbi-preview-img-height", `${a * Be}px`), ae.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      ae.style.width = `${r * Be}px`, ae.style.height = `${a * Be}px`, ae.style.transform = "none";
    } catch {
    }
  } else {
    ae.style.setProperty("--nimbi-preview-img-max-width", ""), ae.style.setProperty("--nimbi-preview-img-max-height", ""), ae.style.setProperty("--nimbi-preview-img-width", ""), ae.style.setProperty("--nimbi-preview-img-height", ""), ae.style.setProperty("--nimbi-preview-img-transform", `scale(${Be})`);
    try {
      ae.style.transform = `scale(${Be})`;
    } catch {
    }
  }
  ae && (ae.classList.add("is-panning"), ae.classList.remove("is-grabbing"));
}
function Vt() {
  if (!ae) return;
  const e = ae.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = Xt || ae.naturalWidth || t.width, i = Kt || ae.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  ut(Number.isFinite(s) ? s : 1);
}
function el(e, t = "", n = 0, i = 0) {
  const r = Jo();
  Be = 1, Xt = n || 0, Kt = i || 0, ae.src = e;
  try {
    if (!t)
      try {
        const c = new URL(e, typeof location < "u" ? location.href : "").pathname || "", d = (c.substring(c.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = at("imagePreviewDefaultAlt", d || "Image");
      } catch {
        t = at("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  ae.alt = t, ae.style.transform = "scale(1)";
  const a = () => {
    Xt = ae.naturalWidth || ae.width || 0, Kt = ae.naturalHeight || ae.height || 0;
  };
  if (a(), Vt(), An(), requestAnimationFrame(() => {
    Vt(), An();
  }), !Xt || !Kt) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        Vt(), An();
      }), ae.removeEventListener("load", s);
    };
    ae.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function Yn() {
  if (Ue) {
    typeof Ue.close == "function" && Ue.open && Ue.close(), Ue.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function tl(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  at = (f, y) => (typeof t == "function" ? t(f) : void 0) || y, jt = n, e.addEventListener("click", (f) => {
    const y = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!y || y.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      y
    );
    if (!g.src) return;
    const h = g.closest("a");
    h && h.getAttribute("href") || el(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, c = 0;
  const o = /* @__PURE__ */ new Map();
  let d = 0, l = 1;
  const u = (f, y) => {
    const g = f.x - y.x, h = f.y - y.y;
    return Math.hypot(g, h);
  };
  e.addEventListener("pointerdown", (f) => {
    const y = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!y || y.tagName !== "IMG") return;
    const g = y.closest("a");
    if (g && g.getAttribute("href") || !Ue || !Ue.open) return;
    if (o.set(f.pointerId, { x: f.clientX, y: f.clientY }), o.size === 2) {
      const m = Array.from(o.values());
      d = u(m[0], m[1]), l = Be;
      return;
    }
    const h = y.closest(".nimbi-image-preview__image-wrapper");
    if (h && !(Be <= 1)) {
      f.preventDefault(), i = !0, r = f.clientX, a = f.clientY, s = h.scrollLeft, c = h.scrollTop, y.setPointerCapture(f.pointerId);
      try {
        y.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (f) => {
    if (o.has(f.pointerId) && o.set(f.pointerId, { x: f.clientX, y: f.clientY }), o.size === 2) {
      f.preventDefault();
      const _ = Array.from(o.values()), w = u(_[0], _[1]);
      if (d > 0) {
        const x = w / d;
        ut(l * x);
      }
      return;
    }
    if (!i) return;
    f.preventDefault();
    const y = (
      /** @type {HTMLElement} */
      f.target
    ), g = y.closest && y.closest("a");
    if (g && g.getAttribute && g.getAttribute("href")) return;
    const h = y.closest(".nimbi-image-preview__image-wrapper");
    if (!h) return;
    const m = f.clientX - r, b = f.clientY - a;
    h.scrollLeft = s - m, h.scrollTop = c - b;
  });
  const p = () => {
    i = !1, o.clear(), d = 0;
    try {
      const f = document.querySelector("[data-nimbi-preview-image]");
      f && (f.classList.add("is-panning"), f.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", p), e.addEventListener("pointercancel", p);
}
function rt(...e) {
  try {
    typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console.warn(...e);
  } catch {
  }
}
function nl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: c,
    initialDocumentTitle: o,
    runHooks: d
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let l = null;
  const u = Bo(a, [{ path: c, name: a("home"), isIndex: !0, children: [] }]);
  async function p(m, b) {
    let _, w, x;
    try {
      ({ data: _, pagePath: w, anchor: x } = await Ms(m, s));
    } catch (W) {
      console.error("[nimbi-cms] fetchPageData failed", W), gi(t, a, W);
      return;
    }
    !x && b && (x = b);
    try {
      lr(null);
    } catch (W) {
      rt("[nimbi-cms] scrollToAnchorOrTop failed", W);
    }
    t.innerHTML = "";
    const { article: S, parsed: C, toc: B, topH1: z, h1Text: K, slugKey: Z } = await Wo(a, _, w, x, s);
    Ss(a, o, C, B, S, w, x, z, K, Z, _), n.innerHTML = "", B && (n.appendChild(B), Ko(B));
    try {
      await d("transformHtml", { article: S, parsed: C, toc: B, pagePath: w, anchor: x, topH1: z, h1Text: K, slugKey: Z, data: _ });
    } catch (W) {
      rt("[nimbi-cms] transformHtml hooks failed", W);
    }
    t.appendChild(S);
    try {
      Zo(S);
    } catch (W) {
      rt("[nimbi-cms] executeEmbeddedScripts failed", W);
    }
    try {
      tl(S, { t: a });
    } catch (W) {
      rt("[nimbi-cms] attachImagePreview failed", W);
    }
    try {
      yn(i, 100, !1), requestAnimationFrame(() => yn(i, 100, !1)), setTimeout(() => yn(i, 100, !1), 250);
    } catch (W) {
      rt("[nimbi-cms] setEagerForAboveFoldImages failed", W);
    }
    lr(x), Vo(S, z, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await d("onPageLoad", { data: _, pagePath: w, anchor: x, article: S, toc: B, topH1: z, h1Text: K, slugKey: Z, contentWrap: t, navWrap: n });
    } catch (W) {
      rt("[nimbi-cms] onPageLoad hooks failed", W);
    }
    l = w;
  }
  async function f() {
    try {
      if (typeof window < "u" && window.__nimbiCMSDebug)
        try {
          window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}, window.__nimbiCMSDebug.renderByQuery = (window.__nimbiCMSDebug.renderByQuery || 0) + 1;
        } catch {
        }
      let m = et(location.href);
      if (m && m.type === "path" && m.page)
        try {
          let w = "?page=" + encodeURIComponent(m.page || "");
          m.params && (w += (w.includes("?") ? "&" : "?") + m.params), m.anchor && (w += "#" + encodeURIComponent(m.anchor));
          try {
            history.replaceState(history.state, "", w);
          } catch {
            try {
              history.replaceState({}, "", w);
            } catch {
            }
          }
          m = et(location.href);
        } catch {
        }
      const b = m && m.page ? m.page : c, _ = m && m.anchor ? m.anchor : null;
      await p(b, _);
    } catch (m) {
      rt("[nimbi-cms] renderByQuery failed", m), gi(t, a, m);
    }
  }
  window.addEventListener("popstate", f);
  const y = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const m = i || document.querySelector(".nimbi-cms");
      if (!m) return;
      const b = {
        top: m.scrollTop || 0,
        left: m.scrollLeft || 0
      };
      sessionStorage.setItem(y(), JSON.stringify(b));
    } catch (m) {
      rt("[nimbi-cms] save scroll position failed", m);
    }
  }, h = () => {
    try {
      const m = i || document.querySelector(".nimbi-cms");
      if (!m) return;
      const b = sessionStorage.getItem(y());
      if (!b) return;
      const _ = JSON.parse(b);
      _ && typeof _.top == "number" && m.scrollTo({ top: _.top, left: _.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (m) => {
    if (m.persisted)
      try {
        h(), yn(i, 100, !1);
      } catch (b) {
        rt("[nimbi-cms] bfcache restore failed", b);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (m) {
      rt("[nimbi-cms] save scroll position failed", m);
    }
  }), { renderByQuery: f, siteNav: u, getCurrentPagePath: () => l };
}
function rl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = et(window.location.href);
        if (a && a.params) t = a.params.startsWith("?") ? a.params : "?" + a.params;
        else {
          const s = window.location.hash, c = s.indexOf("?");
          c !== -1 && (t = s.slice(c));
        }
      } catch {
        const s = window.location.hash, c = s.indexOf("?");
        c !== -1 && (t = s.slice(c));
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
    if (n.has("homePage") && (i.homePage = n.get("homePage")), n.has("navigationPage") && (i.navigationPage = n.get("navigationPage")), n.has("notFoundPage") && (i.notFoundPage = n.get("notFoundPage")), n.has("availableLanguages") && (i.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("indexDepth")) {
      const a = Number(n.get("indexDepth"));
      Number.isInteger(a) && (a === 1 || a === 2 || a === 3) && (i.indexDepth = a);
    }
    if (n.has("noIndexing")) {
      const s = (n.get("noIndexing") || "").split(",").map((c) => c.trim()).filter(Boolean);
      s.length && (i.noIndexing = s);
    }
    return i;
  } catch {
    return {};
  }
}
function il(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function Jn(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let _n = "";
async function ml(e = {}) {
  const t = typeof window < "u" && window.__nimbiCMSDebug;
  if (t)
    try {
      console.info("[nimbi-cms] initCMS called", { options: e });
    } catch {
    }
  const n = (...E) => {
    try {
      typeof window < "u" && window.__nimbiCMSDebug && console.warn(...E);
    } catch {
    }
  };
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const i = rl();
  if (i && (i.contentPath || i.homePage || i.notFoundPage || i.navigationPage))
    if (e && e.allowUrlPathOverrides === !0) {
      if (t)
        try {
          n("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
        } catch {
        }
    } else {
      if (t)
        try {
          n("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
        } catch {
        }
      delete i.contentPath, delete i.homePage, delete i.notFoundPage, delete i.navigationPage;
    }
  const r = Object.assign({}, i, e);
  i && typeof i.bulmaCustomize == "string" && i.bulmaCustomize.trim() && (r.bulmaCustomize = i.bulmaCustomize);
  let {
    el: a,
    contentPath: s = "/content",
    crawlMaxQueue: c = 1e3,
    searchIndex: o = !0,
    searchIndexMode: d = "eager",
    indexDepth: l = 1,
    noIndexing: u = void 0,
    defaultStyle: p = "light",
    bulmaCustomize: f = "none",
    lang: y = void 0,
    l10nFile: g = null,
    cacheTtlMinutes: h = 5,
    cacheMaxEntries: m,
    markdownExtensions: b,
    availableLanguages: _,
    homePage: w = "_home.md",
    notFoundPage: x = "_404.md",
    navigationPage: S = "_navigation.md",
    exposeSitemap: C = !0
  } = r;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof x == "string" && x.startsWith("./") && (x = x.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof S == "string" && S.startsWith("./") && (S = S.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: B = "favicon" } = r, { skipRootReadme: z = !1 } = r, K = (E) => {
    try {
      const P = document.querySelector(a);
      P && P instanceof Element && (P.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(E)}</pre></div>`);
    } catch {
    }
  };
  if (r.contentPath != null && !il(r.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !Jn(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (x != null && !Jn(x))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (S != null && !Jn(S))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!a)
    throw new Error("el is required");
  let Z = a;
  if (typeof a == "string") {
    if (Z = document.querySelector(a), !Z) throw new Error(`el selector "${a}" did not match any element`);
  } else if (!(a instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof s != "string" || !s.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof o != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (d != null && d !== "eager" && d !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (p !== "light" && p !== "dark" && p !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (y != null && typeof y != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (g != null && typeof g != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (h != null && (typeof h != "number" || !Number.isFinite(h) || h < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some((E) => !E || typeof E != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (_ != null && (!Array.isArray(_) || _.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (z != null && typeof z != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (x != null && (typeof x != "string" || !x.trim() || !/\.(md|html)$/.test(x)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const W = !!o;
  try {
    Promise.resolve().then(() => bt).then((E) => {
      try {
        E && typeof E.setSkipRootReadme == "function" && E.setSkipRootReadme(!!z);
      } catch (P) {
        n("[nimbi-cms] setSkipRootReadme failed", P);
      }
    }).catch((E) => {
    });
  } catch (E) {
    n("[nimbi-cms] setSkipRootReadme dynamic import failed", E);
  }
  try {
    try {
      r && r.seoMap && typeof r.seoMap == "object" && ks(r.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(E) {
        try {
          const P = { type: "error", message: E && E.message ? String(E.message) : "", filename: E && E.filename ? String(E.filename) : "", lineno: E && E.lineno ? E.lineno : null, colno: E && E.colno ? E.colno : null, stack: E && E.error && E.error.stack ? E.error.stack : null, time: Date.now() };
          try {
            n("[nimbi-cms] runtime error", P.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(P);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(E) {
        try {
          const P = { type: "unhandledrejection", reason: E && E.reason ? String(E.reason) : "", time: Date.now() };
          try {
            n("[nimbi-cms] unhandledrejection", P.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(P);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const E = et(typeof window < "u" ? window.location.href : ""), P = E && E.page ? E.page : w || "_home.md";
      try {
        xs(P, _n || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        Z.classList.add("nimbi-mount");
      } catch (v) {
        n("[nimbi-cms] mount element setup failed", v);
      }
      const E = document.createElement("section");
      E.className = "section";
      const P = document.createElement("div");
      P.className = "container nimbi-cms";
      const J = document.createElement("div");
      J.className = "columns";
      const L = document.createElement("div");
      L.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", L.setAttribute("role", "navigation");
      try {
        const v = typeof qt == "function" ? qt("navigation") : null;
        v && L.setAttribute("aria-label", v);
      } catch (v) {
        n("[nimbi-cms] set nav aria-label failed", v);
      }
      J.appendChild(L);
      const R = document.createElement("main");
      R.className = "column nimbi-content", R.setAttribute("role", "main"), J.appendChild(R), P.appendChild(J), E.appendChild(P);
      const Q = L, ee = R;
      Z.appendChild(E);
      let le = null;
      try {
        le = Z.querySelector(".nimbi-overlay"), le || (le = document.createElement("div"), le.className = "nimbi-overlay", Z.appendChild(le));
      } catch (v) {
        le = null, n("[nimbi-cms] mount overlay setup failed", v);
      }
      const Le = location.pathname || "/";
      let ve;
      if (Le.endsWith("/"))
        ve = Le;
      else {
        const v = Le.substring(Le.lastIndexOf("/") + 1);
        v && !v.includes(".") ? ve = Le + "/" : ve = Le.substring(0, Le.lastIndexOf("/") + 1);
      }
      try {
        _n = document.title || "";
      } catch (v) {
        _n = "", n("[nimbi-cms] read initial document title failed", v);
      }
      let A = s;
      const O = Object.prototype.hasOwnProperty.call(r, "contentPath"), D = typeof location < "u" && location.origin ? location.origin : "http://localhost", N = new URL(ve, D).toString();
      (A === "." || A === "./") && (A = "");
      try {
        A = String(A || "").replace(/\\/g, "/");
      } catch {
        A = String(A || "");
      }
      A.startsWith("/") && (A = A.replace(/^\/+/, "")), A && !A.endsWith("/") && (A = A + "/");
      try {
        if (A && ve && ve !== "/") {
          const v = ve.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          v && A.startsWith(v) && (A = A.slice(v.length));
        }
      } catch {
      }
      try {
        if (A)
          var T = new URL(A, N.endsWith("/") ? N : N + "/").toString();
        else
          var T = N;
      } catch {
        try {
          if (A) var T = new URL("/" + A, D).toString();
          else var T = new URL(ve, D).toString();
        } catch {
          var T = D;
        }
      }
      try {
        Promise.resolve().then(() => bt).then((v) => {
          try {
            v && typeof v.setHomePage == "function" && v.setHomePage(w);
          } catch (G) {
            n("[nimbi-cms] setHomePage failed", G);
          }
        }).catch((v) => {
        });
      } catch (v) {
        n("[nimbi-cms] setHomePage dynamic import failed", v);
      }
      g && await Ai(g, ve), _ && Array.isArray(_) && Ri(_), y && Ei(y);
      const I = nl({ contentWrap: ee, navWrap: Q, container: P, mountOverlay: le, t: qt, contentBase: T, homePage: w, initialDocumentTitle: _n, runHooks: Zr });
      if (typeof h == "number" && h >= 0 && typeof ti == "function" && ti(h * 60 * 1e3), typeof m == "number" && m >= 0 && typeof ei == "function" && ei(m), b && Array.isArray(b) && b.length)
        try {
          b.forEach((v) => {
            typeof v == "object" && aa && typeof sr == "function" && sr(v);
          });
        } catch (v) {
          n("[nimbi-cms] applying markdownExtensions failed", v);
        }
      try {
        typeof c == "number" && Promise.resolve().then(() => bt).then(({ setDefaultCrawlMaxQueue: v }) => {
          try {
            v(c);
          } catch (G) {
            n("[nimbi-cms] setDefaultCrawlMaxQueue failed", G);
          }
        });
      } catch (v) {
        n("[nimbi-cms] setDefaultCrawlMaxQueue import failed", v);
      }
      try {
        gr(T);
      } catch (v) {
        n("[nimbi-cms] setContentBase failed", v);
      }
      try {
        Pi(x);
      } catch (v) {
        n("[nimbi-cms] setNotFoundPage failed", v);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => Yt).then((v) => {
          try {
            v && typeof v.attachSitemapDownloadUI == "function" && v.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      try {
        await xe(w, T);
      } catch (v) {
        throw w === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${w} not found at ${T}${w}: ${v.message}`);
      }
      Za(p), await Wa(f, ve);
      try {
        const v = document.createElement("header");
        v.className = "nimbi-site-navbar", Z.insertBefore(v, E);
        const G = await xe(S, T), oe = await Pn(G.raw || ""), { navbar: ie, linkEls: be } = await Yo(v, P, oe.html || "", T, w, qt, I.renderByQuery, W, d, l, u, B);
        try {
          await Zr("onNavBuild", { navWrap: Q, navbar: ie, linkEls: be, contentBase: T });
        } catch (me) {
          n("[nimbi-cms] onNavBuild hooks failed", me);
        }
        try {
          let me = !1;
          try {
            const V = new URLSearchParams(location.search || "");
            (V.has("sitemap") || V.has("rss") || V.has("atom")) && (me = !0);
          } catch {
          }
          try {
            const te = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            te && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(te) && (me = !0);
          } catch {
          }
          if (me || C === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const te = await Promise.resolve().then(() => bt);
                if (te && typeof te.awaitSearchIndex == "function") {
                  const qe = [];
                  w && qe.push(w), S && qe.push(S);
                  try {
                    await te.awaitSearchIndex({ contentBase: T, indexDepth: Math.max(l || 1, 3), noIndexing: u, seedPaths: qe.length ? qe : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const V = await Promise.resolve().then(() => Yt);
              try {
                if (V && typeof V.handleSitemapRequest == "function" && await V.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: S, notFoundPage: x, contentBase: T, indexDepth: l, noIndexing: u }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => Yt).then((V) => {
              try {
                if (V && typeof V.exposeSitemapGlobals == "function")
                  try {
                    V.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: S, notFoundPage: x, contentBase: T, indexDepth: l, noIndexing: u, waitForIndexMs: 1 / 0 }).catch(() => {
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
          const me = () => {
            const V = v && v.getBoundingClientRect && Math.round(v.getBoundingClientRect().height) || v && v.offsetHeight || 0;
            if (V > 0) {
              try {
                Z.style.setProperty("--nimbi-site-navbar-height", `${V}px`);
              } catch (te) {
                n("[nimbi-cms] set CSS var failed", te);
              }
              try {
                P.style.paddingTop = "";
              } catch (te) {
                n("[nimbi-cms] set container paddingTop failed", te);
              }
              try {
                const te = Z && Z.getBoundingClientRect && Math.round(Z.getBoundingClientRect().height) || Z && Z.clientHeight || 0;
                if (te > 0) {
                  const qe = Math.max(0, te - V);
                  try {
                    P.style.setProperty("--nimbi-cms-height", `${qe}px`);
                  } catch (lt) {
                    n("[nimbi-cms] set --nimbi-cms-height failed", lt);
                  }
                } else
                  try {
                    P.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (qe) {
                    n("[nimbi-cms] set --nimbi-cms-height failed", qe);
                  }
              } catch (te) {
                n("[nimbi-cms] compute container height failed", te);
              }
              try {
                v.style.setProperty("--nimbi-site-navbar-height", `${V}px`);
              } catch (te) {
                n("[nimbi-cms] set navbar CSS var failed", te);
              }
            }
          };
          me();
          try {
            if (typeof ResizeObserver < "u") {
              const V = new ResizeObserver(() => me());
              try {
                V.observe(v);
              } catch (te) {
                n("[nimbi-cms] ResizeObserver.observe failed", te);
              }
            }
          } catch (V) {
            n("[nimbi-cms] ResizeObserver setup failed", V);
          }
        } catch (me) {
          n("[nimbi-cms] compute navbar height failed", me);
        }
      } catch (v) {
        n("[nimbi-cms] build navigation failed", v);
      }
      await I.renderByQuery();
      try {
        Promise.resolve().then(() => sl).then(({ getVersion: v }) => {
          typeof v == "function" && v().then((G) => {
            try {
              const oe = G || "0.0.0";
              try {
                const ie = (V) => {
                  const te = document.createElement("a");
                  te.className = "nimbi-version-label tag is-small", te.textContent = `nimbiCMS v. ${oe}`, te.href = V || "#", te.target = "_blank", te.rel = "noopener noreferrer nofollow", te.setAttribute("aria-label", `nimbiCMS version ${oe}`);
                  try {
                    Si(te);
                  } catch {
                  }
                  try {
                    Z.appendChild(te);
                  } catch (qe) {
                    n("[nimbi-cms] append version label failed", qe);
                  }
                }, be = "https://abelvm.github.io/nimbiCMS/", me = (() => {
                  try {
                    if (be && typeof be == "string")
                      return new URL(be).toString();
                  } catch {
                  }
                  return "#";
                })();
                ie(me);
              } catch (ie) {
                n("[nimbi-cms] building version label failed", ie);
              }
            } catch (oe) {
              n("[nimbi-cms] building version label failed", oe);
            }
          }).catch((G) => {
            n("[nimbi-cms] getVersion() failed", G);
          });
        }).catch((v) => {
          n("[nimbi-cms] import version module failed", v);
        });
      } catch (v) {
        n("[nimbi-cms] version label setup failed", v);
      }
    })();
  } catch (E) {
    throw K(E), E;
  }
}
async function al() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: al
}, Symbol.toStringTag, { value: "Module" }));
function He(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.log(...e);
  } catch {
  }
}
function Dt(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.warn(...e);
  } catch {
  }
}
function Mr() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function $e(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function yi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function ol(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = se(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Rr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, c = Mr().split("?")[0];
  let o = Array.isArray(H) && H.length ? H : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(H) && H.length) {
    const m = /* @__PURE__ */ new Map();
    try {
      for (const b of n)
        try {
          b && b.slug && m.set(String(b.slug), b);
        } catch {
        }
      for (const b of H)
        try {
          b && b.slug && m.set(String(b.slug), b);
        } catch {
        }
    } catch {
    }
    o = Array.from(m.values());
  }
  const d = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && d.add(se(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && d.add(se(String(r)));
  } catch {
  }
  const l = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const m = se(String(a));
      try {
        if (U && typeof U.has == "function" && U.has(m))
          try {
            l.add(U.get(m));
          } catch {
          }
        else
          try {
            const b = await xe(m, e && e.contentBase ? e.contentBase : void 0);
            if (b && b.raw)
              try {
                let _ = null;
                if (b.isHtml)
                  try {
                    const x = new DOMParser().parseFromString(b.raw, "text/html"), S = x.querySelector("h1") || x.querySelector("title");
                    S && S.textContent && (_ = S.textContent.trim());
                  } catch {
                  }
                else {
                  const w = (b.raw || "").match(/^#\s+(.+)$/m);
                  w && w[1] && (_ = w[1].trim());
                }
                _ && l.add(we(_));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), p = [], f = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), g = (m) => {
    try {
      if (!m || typeof m != "string") return !1;
      const b = se(String(m));
      try {
        if (Array.isArray(Ie) && Ie.length && Ie.includes(b)) return !0;
      } catch {
      }
      try {
        if (U && typeof U.has == "function" && U.has(b)) return !0;
      } catch {
      }
      try {
        if (y && y.has(b)) return !0;
      } catch {
      }
      try {
        for (const _ of re.values())
          try {
            if (!_) continue;
            if (typeof _ == "string") {
              if (se(String(_)) === b) return !0;
            } else if (_ && typeof _ == "object") {
              if (_.default && se(String(_.default)) === b) return !0;
              const w = _.langs || {};
              for (const x of Object.keys(w || {}))
                try {
                  if (w[x] && se(String(w[x])) === b) return !0;
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
        const b = String(m.slug), _ = String(b).split("::")[0];
        if (l.has(_)) continue;
        const w = m.path ? se(String(m.path)) : null;
        if (w && d.has(w)) continue;
        const x = m.title ? String(m.title) : m.parentTitle ? String(m.parentTitle) : void 0;
        f.set(b, { title: x || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, path: w, source: "index" }), w && y.set(w, { title: x || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, slug: b });
        const S = ol(c, m);
        if (!S || !S.slug || u.has(S.slug)) continue;
        if (u.add(S.slug), f.has(S.slug)) {
          const C = f.get(S.slug);
          C && C.title && (S.title = C.title, S._titleSource = "index"), C && C.excerpt && (S.excerpt = C.excerpt);
        }
        p.push(S);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [m, b] of re.entries())
        try {
          if (!m) continue;
          const _ = String(m).split("::")[0];
          if (u.has(m) || l.has(_)) continue;
          let w = null;
          if (typeof b == "string" ? w = se(String(b)) : b && typeof b == "object" && (w = se(String(b.default || ""))), w && d.has(w)) continue;
          const S = { loc: c + "?page=" + encodeURIComponent(m), slug: m };
          if (f.has(m)) {
            const C = f.get(m);
            C && C.title && (S.title = C.title, S._titleSource = "index"), C && C.excerpt && (S.excerpt = C.excerpt);
          } else if (w) {
            const C = y.get(w);
            C && C.title && (S.title = C.title, S._titleSource = "path", !S.excerpt && C.excerpt && (S.excerpt = C.excerpt));
          }
          if (u.add(m), typeof m == "string") {
            const C = m.indexOf("/") !== -1 || /\.(md|html?)$/i.test(m), B = S.title && typeof S.title == "string" && (S.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(S.title));
            (!S.title || B || C) && (S.title = yi(m), S._titleSource = "humanize");
          }
          p.push(S);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const m = se(String(i));
          let b = null;
          try {
            U && U.has(m) && (b = U.get(m));
          } catch {
          }
          b || (b = m);
          const _ = String(b).split("::")[0];
          if (!u.has(b) && !d.has(m) && !l.has(_)) {
            const w = { loc: c + "?page=" + encodeURIComponent(b), slug: b };
            if (f.has(b)) {
              const x = f.get(b);
              x && x.title && (w.title = x.title, w._titleSource = "index"), x && x.excerpt && (w.excerpt = x.excerpt);
            }
            u.add(b), p.push(w);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const m = /* @__PURE__ */ new Set(), b = new Set(p.map((S) => String(S && S.slug ? S.slug : ""))), _ = /* @__PURE__ */ new Set();
    for (const S of p)
      try {
        S && S.sourcePath && _.add(String(S.sourcePath));
      } catch {
      }
    const w = 30;
    let x = 0;
    for (const S of _) {
      if (x >= w) break;
      try {
        if (!S || typeof S != "string" || !g(S)) continue;
        x += 1;
        const C = await xe(S, e && e.contentBase ? e.contentBase : void 0);
        if (!C || !C.raw || C && typeof C.status == "number" && C.status === 404) continue;
        const B = C.raw, z = (function(P) {
          try {
            return String(P || "");
          } catch {
            return "";
          }
        })(B), K = [], Z = /\[[^\]]+\]\(([^)]+)\)/g;
        let W;
        for (; W = Z.exec(z); )
          try {
            W && W[1] && K.push(W[1]);
          } catch {
          }
        const E = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; W = E.exec(z); )
          try {
            W && W[1] && K.push(W[1]);
          } catch {
          }
        for (const P of K)
          try {
            if (!P) continue;
            if (P.indexOf("?") !== -1 || P.indexOf("=") !== -1)
              try {
                const R = new URL(P, c).searchParams.get("page");
                if (R) {
                  const Q = String(R);
                  !b.has(Q) && !m.has(Q) && (m.add(Q), p.push({ loc: c + "?page=" + encodeURIComponent(Q), slug: Q }));
                  continue;
                }
              } catch {
              }
            let J = String(P).split(/[?#]/)[0];
            if (J = J.replace(/^\.\//, "").replace(/^\//, ""), !J || !/\.(md|html?)$/i.test(J)) continue;
            try {
              const L = se(J);
              if (U && U.has(L)) {
                const R = U.get(L), Q = String(R).split("::")[0];
                R && !b.has(R) && !m.has(R) && !l.has(Q) && !d.has(L) && (m.add(R), p.push({ loc: c + "?page=" + encodeURIComponent(R), slug: R, sourcePath: L }));
                continue;
              }
              try {
                if (!g(L)) continue;
                const R = await xe(L, e && e.contentBase ? e.contentBase : void 0);
                if (R && typeof R.status == "number" && R.status === 404) continue;
                if (R && R.raw) {
                  const Q = (R.raw || "").match(/^#\s+(.+)$/m), ee = Q && Q[1] ? Q[1].trim() : "", le = we(ee || L), Le = String(le).split("::")[0];
                  le && !b.has(le) && !m.has(le) && !l.has(Le) && (m.add(le), p.push({ loc: c + "?page=" + encodeURIComponent(le), slug: le, sourcePath: L, title: ee || void 0 }));
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
    for (const _ of p)
      try {
        if (!_ || !_.slug) continue;
        m.set(String(_.slug), _);
      } catch {
      }
    const b = /* @__PURE__ */ new Set();
    for (const _ of p)
      try {
        if (!_ || !_.slug) continue;
        const w = String(_.slug), x = w.split("::")[0];
        if (!x) continue;
        w !== x && !m.has(x) && b.add(x);
      } catch {
      }
    for (const _ of b)
      try {
        let w = null;
        if (f.has(_)) {
          const x = f.get(_);
          w = { loc: c + "?page=" + encodeURIComponent(_), slug: _ }, x && x.title && (w.title = x.title, w._titleSource = "index"), x && x.excerpt && (w.excerpt = x.excerpt), x && x.path && (w.sourcePath = x.path);
        } else if (y && re && re.has(_)) {
          const x = re.get(_);
          let S = null;
          if (typeof x == "string" ? S = se(String(x)) : x && typeof x == "object" && (S = se(String(x.default || ""))), w = { loc: c + "?page=" + encodeURIComponent(_), slug: _ }, S && y.has(S)) {
            const C = y.get(S);
            C && C.title && (w.title = C.title, w._titleSource = "path"), C && C.excerpt && (w.excerpt = C.excerpt), w.sourcePath = S;
          }
        }
        w || (w = { loc: c + "?page=" + encodeURIComponent(_), slug: _, title: yi(_) }, w._titleSource = "humanize"), m.has(_) || (p.push(w), m.set(_, w));
      } catch {
      }
  } catch {
  }
  const h = [];
  try {
    const m = /* @__PURE__ */ new Set();
    for (const b of p)
      try {
        if (!b || !b.slug) continue;
        const _ = String(b.slug), w = String(_).split("::")[0];
        if (l.has(w) || _.indexOf("::") !== -1 || m.has(_)) continue;
        m.add(_), h.push(b);
      } catch {
      }
  } catch {
  }
  try {
    try {
      He("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(h.map((m) => ({ slug: m.slug, title: m.title, titleSource: m._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let b = 0;
    const _ = h.length, w = Array.from({ length: Math.min(4, _) }).map(async () => {
      for (; ; ) {
        const x = b++;
        if (x >= _) break;
        const S = h[x];
        try {
          if (!S || !S.slug) continue;
          const C = String(S.slug).split("::")[0];
          if (l.has(C) || S._titleSource === "index") continue;
          let B = null;
          try {
            if (re && re.has(S.slug)) {
              const z = re.get(S.slug);
              typeof z == "string" ? B = se(String(z)) : z && typeof z == "object" && (B = se(String(z.default || "")));
            }
            !B && S.sourcePath && (B = S.sourcePath);
          } catch {
            continue;
          }
          if (!B || d.has(B) || !g(B)) continue;
          try {
            const z = await xe(B, e && e.contentBase ? e.contentBase : void 0);
            if (!z || !z.raw || z && typeof z.status == "number" && z.status === 404) continue;
            if (z && z.raw) {
              const K = (z.raw || "").match(/^#\s+(.+)$/m), Z = K && K[1] ? K[1].trim() : "";
              Z && (S.title = Z, S._titleSource = "fetched");
            }
          } catch (z) {
            He("[runtimeSitemap] fetch title failed for", B, z);
          }
        } catch (C) {
          He("[runtimeSitemap] worker loop failure", C);
        }
      }
    });
    await Promise.all(w);
  } catch (m) {
    He("[runtimeSitemap] title enrichment failed", m);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: h };
}
function cr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${$e(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function ur(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Mr().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${$e("Sitemap RSS")}</title>
`, i += `<link>${$e(n)}</link>
`, i += `<description>${$e("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${$e(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${$e(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${$e(String(r.excerpt))}</description>
`), i += `<link>${$e(a)}</link>
`, i += `<guid>${$e(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function hr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Mr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${$e("Sitemap Atom")}</title>
`, r += `<link href="${$e(n)}" />
`, r += `<updated>${$e(i)}</updated>
`, r += `<id>${$e(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), c = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${$e(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${$e(String(a.excerpt))}</summary>
`), r += `<link href="${$e(s)}" />
`, r += `<id>${$e(s)}</id>
`, r += `<updated>${$e(c)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function bi(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + $e(e) + "</pre>";
    } catch {
    }
  }
}
function wi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${$e(String(i && i.loc ? i.loc : ""))}">${$e(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function kn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = ur(e) : t === "application/atom+xml" ? i = hr(e) : t === "text/html" ? i = wi(e) : i = cr(e), bi(i, t);
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
          r.mimeType === "application/rss+xml" ? a = ur(r.finalJson) : r.mimeType === "application/atom+xml" ? a = hr(r.finalJson) : r.mimeType === "text/html" ? a = wi(r.finalJson) : a = cr(r.finalJson);
          try {
            bi(a, r.mimeType);
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
async function ll(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const l = new URLSearchParams(location.search || "");
      if (l.has("sitemap")) {
        let u = !0;
        for (const p of l.keys()) p !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (l.has("rss")) {
        let u = !0;
        for (const p of l.keys()) p !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (l.has("atom")) {
        let u = !0;
        for (const p of l.keys()) p !== "atom" && (u = !1);
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
      if (typeof yt == "function")
        try {
          const l = await yt({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(l) && l.length)
            if (Array.isArray(e.index) && e.index.length) {
              const u = /* @__PURE__ */ new Map();
              try {
                for (const p of e.index)
                  try {
                    p && p.slug && u.set(String(p.slug), p);
                  } catch {
                  }
                for (const p of l)
                  try {
                    p && p.slug && u.set(String(p.slug), p);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(u.values());
            } else
              a = l;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(H) && H.length ? H : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(H) && H.length ? H : [];
        }
      else
        a = Array.isArray(H) && H.length ? H : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(H) && H.length ? H : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const l = /* @__PURE__ */ new Map();
          for (const u of e.index)
            try {
              if (!u || !u.slug) continue;
              const p = String(u.slug).split("::")[0];
              if (!l.has(p)) l.set(p, u);
              else {
                const f = l.get(p);
                f && String(f.slug || "").indexOf("::") !== -1 && String(u.slug || "").indexOf("::") === -1 && l.set(p, u);
              }
            } catch {
            }
          try {
            He("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(l.values()), null, 2));
          } catch {
            He("[runtimeSitemap] providedIndex.dedupedByBase (count):", l.size);
          }
        } catch (l) {
          Dt("[runtimeSitemap] logging provided index failed", l);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof At == "function")
      try {
        const l = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof yt == "function" && (u = await yt({ timeoutMs: l, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const p = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, y = [];
          e && e.homePage && y.push(e.homePage), e && e.navigationPage && y.push(e.navigationPage), a = await At(e && e.contentBase ? e.contentBase : void 0, p, f, y.length ? y : void 0);
        }
      } catch (l) {
        Dt("[runtimeSitemap] rebuild index failed", l), a = Array.isArray(H) && H.length ? H : [];
      }
    try {
      const l = Array.isArray(a) ? a.length : 0;
      try {
        He("[runtimeSitemap] usedIndex.full.length (before rebuild):", l);
      } catch {
      }
      try {
        He("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const l = [];
      e && e.homePage && l.push(e.homePage), e && e.navigationPage && l.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, p = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let f = null;
      try {
        const y = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof y == "function")
          try {
            f = await y(e && e.contentBase ? e.contentBase : void 0, u, p);
          } catch {
            f = null;
          }
      } catch {
        f = null;
      }
      if ((!f || !f.length) && typeof At == "function")
        try {
          f = await At(e && e.contentBase ? e.contentBase : void 0, u, p, l.length ? l : void 0);
        } catch {
          f = null;
        }
      if (Array.isArray(f) && f.length) {
        const y = /* @__PURE__ */ new Map();
        try {
          for (const g of a)
            try {
              g && g.slug && y.set(String(g.slug), g);
            } catch {
            }
          for (const g of f)
            try {
              g && g.slug && y.set(String(g.slug), g);
            } catch {
            }
        } catch {
        }
        a = Array.from(y.values());
      }
    } catch (l) {
      try {
        Dt("[runtimeSitemap] rebuild index call failed", l);
      } catch {
      }
    }
    try {
      const l = Array.isArray(a) ? a.length : 0;
      try {
        He("[runtimeSitemap] usedIndex.full.length (after rebuild):", l);
      } catch {
      }
      try {
        He("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const c = await Rr(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const l = /* @__PURE__ */ new Set(), u = Array.isArray(c && c.entries) ? c.entries : [];
      for (const p of u)
        try {
          let f = null;
          if (p && p.slug) f = String(p.slug);
          else if (p && p.loc)
            try {
              f = new URL(String(p.loc)).searchParams.get("page");
            } catch {
            }
          if (!f) continue;
          const y = String(f).split("::")[0];
          if (!l.has(y)) {
            l.add(y);
            const g = Object.assign({}, p);
            g.baseSlug = y, o.push(g);
          }
        } catch {
        }
      try {
        He("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(o, null, 2));
      } catch {
        He("[runtimeSitemap] finalEntries.dedupedByBase (count):", o.length);
      }
    } catch {
      try {
        o = Array.isArray(c && c.entries) ? c.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const d = Object.assign({}, c || {}, { entries: Array.isArray(o) ? o : Array.isArray(c && c.entries) ? c.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = d, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const l = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > l) {
        try {
          He("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, l);
        } catch {
        }
        return !0;
      }
      return kn(d, "application/rss+xml"), !0;
    }
    if (i) {
      const l = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > l) {
        try {
          He("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, l);
        } catch {
        }
        return !0;
      }
      return kn(d, "application/atom+xml"), !0;
    }
    if (t) {
      const l = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > l) {
        try {
          He("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, l);
        } catch {
        }
        return !0;
      }
      return kn(d, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(d && d.entries) ? d.entries : []).length;
        let p = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (p = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (p > u) {
          try {
            He("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", p, u);
          } catch {
          }
          return !0;
        }
        return kn(d, "text/html"), !0;
      } catch (l) {
        return Dt("[runtimeSitemap] render HTML failed", l), !1;
      }
    return !1;
  } catch (t) {
    return Dt("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function cl(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof yt == "function")
        try {
          const s = await yt({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(H) && H.length && (n = H), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Rr(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), c = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of c)
        try {
          let d = null;
          if (o && o.slug) d = String(o.slug);
          else if (o && o.loc)
            try {
              d = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              d = null;
            }
          if (!d) continue;
          const l = String(d).split("::")[0];
          if (!s.has(l)) {
            s.add(l);
            const u = Object.assign({}, o);
            u.baseSlug = l, r.push(u);
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
const Yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: cl,
  generateAtomXml: hr,
  generateRssXml: ur,
  generateSitemapJson: Rr,
  generateSitemapXml: cr,
  handleSitemapRequest: ll
}, Symbol.toStringTag, { value: "Module" }));
export {
  ki as BAD_LANGUAGES,
  ge as SUPPORTED_HLJS_MAP,
  fl as _clearHooks,
  dr as addHook,
  ml as default,
  Wa as ensureBulma,
  al as getVersion,
  ml as initCMS,
  Ai as loadL10nFile,
  xi as loadSupportedLanguages,
  Ua as observeCodeBlocks,
  hl as onNavBuild,
  ul as onPageLoad,
  en as registerLanguage,
  Zr as runHooks,
  pl as setHighlightTheme,
  Ei as setLang,
  Za as setStyle,
  gl as setThemeVars,
  qt as t,
  dl as transformHtml
};
