const jt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Xn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(jt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  jt[t].push(e);
}
function Wo(t) {
  Xn("onPageLoad", t);
}
function Zo(t) {
  Xn("onNavBuild", t);
}
function Go(t) {
  Xn("transformHtml", t);
}
async function Er(t, e) {
  const n = jt[t] || [];
  for (const i of n)
    try {
      await i(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function Qo() {
  Object.keys(jt).forEach((t) => {
    jt[t].length = 0;
  });
}
function Yr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var $n, Lr;
function ya() {
  if (Lr) return $n;
  Lr = 1;
  function t(w) {
    return w instanceof Map ? w.clear = w.delete = w.set = function() {
      throw new Error("map is read-only");
    } : w instanceof Set && (w.add = w.clear = w.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(w), Object.getOwnPropertyNames(w).forEach((A) => {
      const P = w[A], ne = typeof P;
      (ne === "object" || ne === "function") && !Object.isFrozen(P) && t(P);
    }), w;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(A) {
      A.data === void 0 && (A.data = {}), this.data = A.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(w) {
    return w.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(w, ...A) {
    const P = /* @__PURE__ */ Object.create(null);
    for (const ne in w)
      P[ne] = w[ne];
    return A.forEach(function(ne) {
      for (const Ee in ne)
        P[Ee] = ne[Ee];
    }), /** @type {T} */
    P;
  }
  const r = "</span>", a = (w) => !!w.scope, s = (w, { prefix: A }) => {
    if (w.startsWith("language:"))
      return w.replace("language:", "language-");
    if (w.includes(".")) {
      const P = w.split(".");
      return [
        `${A}${P.shift()}`,
        ...P.map((ne, Ee) => `${ne}${"_".repeat(Ee + 1)}`)
      ].join(" ");
    }
    return `${A}${w}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(A, P) {
      this.buffer = "", this.classPrefix = P.classPrefix, A.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(A) {
      this.buffer += n(A);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(A) {
      if (!a(A)) return;
      const P = s(
        A.scope,
        { prefix: this.classPrefix }
      );
      this.span(P);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(A) {
      a(A) && (this.buffer += r);
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
    span(A) {
      this.buffer += `<span class="${A}">`;
    }
  }
  const o = (w = {}) => {
    const A = { children: [] };
    return Object.assign(A, w), A;
  };
  class c {
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
    add(A) {
      this.top.children.push(A);
    }
    /** @param {string} scope */
    openNode(A) {
      const P = o({ scope: A });
      this.add(P), this.stack.push(P);
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
    walk(A) {
      return this.constructor._walk(A, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(A, P) {
      return typeof P == "string" ? A.addText(P) : P.children && (A.openNode(P), P.children.forEach((ne) => this._walk(A, ne)), A.closeNode(P)), A;
    }
    /**
     * @param {Node} node
     */
    static _collapse(A) {
      typeof A != "string" && A.children && (A.children.every((P) => typeof P == "string") ? A.children = [A.children.join("")] : A.children.forEach((P) => {
        c._collapse(P);
      }));
    }
  }
  class u extends c {
    /**
     * @param {*} options
     */
    constructor(A) {
      super(), this.options = A;
    }
    /**
     * @param {string} text
     */
    addText(A) {
      A !== "" && this.add(A);
    }
    /** @param {string} scope */
    startScope(A) {
      this.openNode(A);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(A, P) {
      const ne = A.root;
      P && (ne.scope = `language:${P}`), this.add(ne);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function f(w) {
    return w ? typeof w == "string" ? w : w.source : null;
  }
  function m(w) {
    return g("(?=", w, ")");
  }
  function d(w) {
    return g("(?:", w, ")*");
  }
  function p(w) {
    return g("(?:", w, ")?");
  }
  function g(...w) {
    return w.map((P) => f(P)).join("");
  }
  function h(w) {
    const A = w[w.length - 1];
    return typeof A == "object" && A.constructor === Object ? (w.splice(w.length - 1, 1), A) : {};
  }
  function b(...w) {
    return "(" + (h(w).capture ? "" : "?:") + w.map((ne) => f(ne)).join("|") + ")";
  }
  function y(w) {
    return new RegExp(w.toString() + "|").exec("").length - 1;
  }
  function k(w, A) {
    const P = w && w.exec(A);
    return P && P.index === 0;
  }
  const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function M(w, { joinWith: A }) {
    let P = 0;
    return w.map((ne) => {
      P += 1;
      const Ee = P;
      let Le = f(ne), U = "";
      for (; Le.length > 0; ) {
        const j = _.exec(Le);
        if (!j) {
          U += Le;
          break;
        }
        U += Le.substring(0, j.index), Le = Le.substring(j.index + j[0].length), j[0][0] === "\\" && j[1] ? U += "\\" + String(Number(j[1]) + Ee) : (U += j[0], j[0] === "(" && P++);
      }
      return U;
    }).map((ne) => `(${ne})`).join(A);
  }
  const $ = /\b\B/, q = "[a-zA-Z]\\w*", C = "[a-zA-Z_]\\w*", O = "\\b\\d+(\\.\\d+)?", ce = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", S = "\\b(0b[01]+)", B = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", _e = (w = {}) => {
    const A = /^#![ ]*\//;
    return w.binary && (w.begin = g(
      A,
      /.*\b/,
      w.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: A,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (P, ne) => {
        P.index !== 0 && ne.ignoreMatch();
      }
    }, w);
  }, J = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, he = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [J]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [J]
  }, H = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, V = function(w, A, P = {}) {
    const ne = i(
      {
        scope: "comment",
        begin: w,
        end: A,
        contains: []
      },
      P
    );
    ne.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Ee = b(
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
    return ne.contains.push(
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
          Ee,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), ne;
  }, Z = V("//", "$"), x = V("/\\*", "\\*/"), E = V("#", "$"), z = {
    scope: "number",
    begin: O,
    relevance: 0
  }, N = {
    scope: "number",
    begin: ce,
    relevance: 0
  }, D = {
    scope: "number",
    begin: S,
    relevance: 0
  }, R = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      J,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [J]
      }
    ]
  }, W = {
    scope: "title",
    begin: q,
    relevance: 0
  }, v = {
    scope: "title",
    begin: C,
    relevance: 0
  }, ee = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + C,
    relevance: 0
  };
  var ae = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: he,
    BACKSLASH_ESCAPE: J,
    BINARY_NUMBER_MODE: D,
    BINARY_NUMBER_RE: S,
    COMMENT: V,
    C_BLOCK_COMMENT_MODE: x,
    C_LINE_COMMENT_MODE: Z,
    C_NUMBER_MODE: N,
    C_NUMBER_RE: ce,
    END_SAME_AS_BEGIN: function(w) {
      return Object.assign(
        w,
        {
          /** @type {ModeCallback} */
          "on:begin": (A, P) => {
            P.data._beginMatch = A[1];
          },
          /** @type {ModeCallback} */
          "on:end": (A, P) => {
            P.data._beginMatch !== A[1] && P.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: E,
    IDENT_RE: q,
    MATCH_NOTHING_RE: $,
    METHOD_GUARD: ee,
    NUMBER_MODE: z,
    NUMBER_RE: O,
    PHRASAL_WORDS_MODE: H,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: R,
    RE_STARTERS_RE: B,
    SHEBANG: _e,
    TITLE_MODE: W,
    UNDERSCORE_IDENT_RE: C,
    UNDERSCORE_TITLE_MODE: v
  });
  function be(w, A) {
    w.input[w.index - 1] === "." && A.ignoreMatch();
  }
  function oe(w, A) {
    w.className !== void 0 && (w.scope = w.className, delete w.className);
  }
  function fe(w, A) {
    A && w.beginKeywords && (w.begin = "\\b(" + w.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", w.__beforeBegin = be, w.keywords = w.keywords || w.beginKeywords, delete w.beginKeywords, w.relevance === void 0 && (w.relevance = 0));
  }
  function ke(w, A) {
    Array.isArray(w.illegal) && (w.illegal = b(...w.illegal));
  }
  function Ge(w, A) {
    if (w.match) {
      if (w.begin || w.end) throw new Error("begin & end are not supported with match");
      w.begin = w.match, delete w.match;
    }
  }
  function vn(w, A) {
    w.relevance === void 0 && (w.relevance = 1);
  }
  const ji = (w, A) => {
    if (!w.beforeMatch) return;
    if (w.starts) throw new Error("beforeMatch cannot be used with starts");
    const P = Object.assign({}, w);
    Object.keys(w).forEach((ne) => {
      delete w[ne];
    }), w.keywords = P.keywords, w.begin = g(P.beforeMatch, m(P.begin)), w.starts = {
      relevance: 0,
      contains: [
        Object.assign(P, { endsParent: !0 })
      ]
    }, w.relevance = 0, delete P.beforeMatch;
  }, Hi = [
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
  ], Ui = "keyword";
  function ur(w, A, P = Ui) {
    const ne = /* @__PURE__ */ Object.create(null);
    return typeof w == "string" ? Ee(P, w.split(" ")) : Array.isArray(w) ? Ee(P, w) : Object.keys(w).forEach(function(Le) {
      Object.assign(
        ne,
        ur(w[Le], A, Le)
      );
    }), ne;
    function Ee(Le, U) {
      A && (U = U.map((j) => j.toLowerCase())), U.forEach(function(j) {
        const Y = j.split("|");
        ne[Y[0]] = [Le, Fi(Y[0], Y[1])];
      });
    }
  }
  function Fi(w, A) {
    return A ? Number(A) : Wi(w) ? 0 : 1;
  }
  function Wi(w) {
    return Hi.includes(w.toLowerCase());
  }
  const hr = {}, ut = (w) => {
    console.error(w);
  }, dr = (w, ...A) => {
    console.log(`WARN: ${w}`, ...A);
  }, bt = (w, A) => {
    hr[`${w}/${A}`] || (console.log(`Deprecated as of ${w}. ${A}`), hr[`${w}/${A}`] = !0);
  }, Kt = new Error();
  function pr(w, A, { key: P }) {
    let ne = 0;
    const Ee = w[P], Le = {}, U = {};
    for (let j = 1; j <= A.length; j++)
      U[j + ne] = Ee[j], Le[j + ne] = !0, ne += y(A[j - 1]);
    w[P] = U, w[P]._emit = Le, w[P]._multi = !0;
  }
  function Zi(w) {
    if (Array.isArray(w.begin)) {
      if (w.skip || w.excludeBegin || w.returnBegin)
        throw ut("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Kt;
      if (typeof w.beginScope != "object" || w.beginScope === null)
        throw ut("beginScope must be object"), Kt;
      pr(w, w.begin, { key: "beginScope" }), w.begin = M(w.begin, { joinWith: "" });
    }
  }
  function Gi(w) {
    if (Array.isArray(w.end)) {
      if (w.skip || w.excludeEnd || w.returnEnd)
        throw ut("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Kt;
      if (typeof w.endScope != "object" || w.endScope === null)
        throw ut("endScope must be object"), Kt;
      pr(w, w.end, { key: "endScope" }), w.end = M(w.end, { joinWith: "" });
    }
  }
  function Qi(w) {
    w.scope && typeof w.scope == "object" && w.scope !== null && (w.beginScope = w.scope, delete w.scope);
  }
  function Xi(w) {
    Qi(w), typeof w.beginScope == "string" && (w.beginScope = { _wrap: w.beginScope }), typeof w.endScope == "string" && (w.endScope = { _wrap: w.endScope }), Zi(w), Gi(w);
  }
  function Ki(w) {
    function A(U, j) {
      return new RegExp(
        f(U),
        "m" + (w.case_insensitive ? "i" : "") + (w.unicodeRegex ? "u" : "") + (j ? "g" : "")
      );
    }
    class P {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(j, Y) {
        Y.position = this.position++, this.matchIndexes[this.matchAt] = Y, this.regexes.push([Y, j]), this.matchAt += y(j) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const j = this.regexes.map((Y) => Y[1]);
        this.matcherRe = A(M(j, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(j) {
        this.matcherRe.lastIndex = this.lastIndex;
        const Y = this.matcherRe.exec(j);
        if (!Y)
          return null;
        const $e = Y.findIndex((vt, En) => En > 0 && vt !== void 0), Ce = this.matchIndexes[$e];
        return Y.splice(0, $e), Object.assign(Y, Ce);
      }
    }
    class ne {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(j) {
        if (this.multiRegexes[j]) return this.multiRegexes[j];
        const Y = new P();
        return this.rules.slice(j).forEach(([$e, Ce]) => Y.addRule($e, Ce)), Y.compile(), this.multiRegexes[j] = Y, Y;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(j, Y) {
        this.rules.push([j, Y]), Y.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(j) {
        const Y = this.getMatcher(this.regexIndex);
        Y.lastIndex = this.lastIndex;
        let $e = Y.exec(j);
        if (this.resumingScanAtSamePosition() && !($e && $e.index === this.lastIndex)) {
          const Ce = this.getMatcher(0);
          Ce.lastIndex = this.lastIndex + 1, $e = Ce.exec(j);
        }
        return $e && (this.regexIndex += $e.position + 1, this.regexIndex === this.count && this.considerAll()), $e;
      }
    }
    function Ee(U) {
      const j = new ne();
      return U.contains.forEach((Y) => j.addRule(Y.begin, { rule: Y, type: "begin" })), U.terminatorEnd && j.addRule(U.terminatorEnd, { type: "end" }), U.illegal && j.addRule(U.illegal, { type: "illegal" }), j;
    }
    function Le(U, j) {
      const Y = (
        /** @type CompiledMode */
        U
      );
      if (U.isCompiled) return Y;
      [
        oe,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Ge,
        Xi,
        ji
      ].forEach((Ce) => Ce(U, j)), w.compilerExtensions.forEach((Ce) => Ce(U, j)), U.__beforeBegin = null, [
        fe,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        ke,
        // default to 1 relevance if not specified
        vn
      ].forEach((Ce) => Ce(U, j)), U.isCompiled = !0;
      let $e = null;
      return typeof U.keywords == "object" && U.keywords.$pattern && (U.keywords = Object.assign({}, U.keywords), $e = U.keywords.$pattern, delete U.keywords.$pattern), $e = $e || /\w+/, U.keywords && (U.keywords = ur(U.keywords, w.case_insensitive)), Y.keywordPatternRe = A($e, !0), j && (U.begin || (U.begin = /\B|\b/), Y.beginRe = A(Y.begin), !U.end && !U.endsWithParent && (U.end = /\B|\b/), U.end && (Y.endRe = A(Y.end)), Y.terminatorEnd = f(Y.end) || "", U.endsWithParent && j.terminatorEnd && (Y.terminatorEnd += (U.end ? "|" : "") + j.terminatorEnd)), U.illegal && (Y.illegalRe = A(
        /** @type {RegExp | string} */
        U.illegal
      )), U.contains || (U.contains = []), U.contains = [].concat(...U.contains.map(function(Ce) {
        return Vi(Ce === "self" ? U : Ce);
      })), U.contains.forEach(function(Ce) {
        Le(
          /** @type Mode */
          Ce,
          Y
        );
      }), U.starts && Le(U.starts, j), Y.matcher = Ee(Y), Y;
    }
    if (w.compilerExtensions || (w.compilerExtensions = []), w.contains && w.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return w.classNameAliases = i(w.classNameAliases || {}), Le(
      /** @type Mode */
      w
    );
  }
  function fr(w) {
    return w ? w.endsWithParent || fr(w.starts) : !1;
  }
  function Vi(w) {
    return w.variants && !w.cachedVariants && (w.cachedVariants = w.variants.map(function(A) {
      return i(w, { variants: null }, A);
    })), w.cachedVariants ? w.cachedVariants : fr(w) ? i(w, { starts: w.starts ? i(w.starts) : null }) : Object.isFrozen(w) ? i(w) : w;
  }
  var Yi = "11.11.1";
  class Ji extends Error {
    constructor(A, P) {
      super(A), this.name = "HTMLInjectionError", this.html = P;
    }
  }
  const An = n, gr = i, mr = /* @__PURE__ */ Symbol("nomatch"), ea = 7, br = function(w) {
    const A = /* @__PURE__ */ Object.create(null), P = /* @__PURE__ */ Object.create(null), ne = [];
    let Ee = !0;
    const Le = "Could not find the language '{}', did you forget to load/include a language module?", U = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let j = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: u
    };
    function Y(T) {
      return j.noHighlightRe.test(T);
    }
    function $e(T) {
      let G = T.className + " ";
      G += T.parentNode ? T.parentNode.className : "";
      const ue = j.languageDetectRe.exec(G);
      if (ue) {
        const xe = rt(ue[1]);
        return xe || (dr(Le.replace("{}", ue[1])), dr("Falling back to no-highlight mode for this block.", T)), xe ? ue[1] : "no-highlight";
      }
      return G.split(/\s+/).find((xe) => Y(xe) || rt(xe));
    }
    function Ce(T, G, ue) {
      let xe = "", Te = "";
      typeof G == "object" ? (xe = T, ue = G.ignoreIllegals, Te = G.language) : (bt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), bt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Te = T, xe = G), ue === void 0 && (ue = !0);
      const Fe = {
        code: xe,
        language: Te
      };
      Yt("before:highlight", Fe);
      const it = Fe.result ? Fe.result : vt(Fe.language, Fe.code, ue);
      return it.code = Fe.code, Yt("after:highlight", it), it;
    }
    function vt(T, G, ue, xe) {
      const Te = /* @__PURE__ */ Object.create(null);
      function Fe(I, F) {
        return I.keywords[F];
      }
      function it() {
        if (!re.keywords) {
          Pe.addText(Se);
          return;
        }
        let I = 0;
        re.keywordPatternRe.lastIndex = 0;
        let F = re.keywordPatternRe.exec(Se), ie = "";
        for (; F; ) {
          ie += Se.substring(I, F.index);
          const we = Xe.case_insensitive ? F[0].toLowerCase() : F[0], ze = Fe(re, we);
          if (ze) {
            const [et, ba] = ze;
            if (Pe.addText(ie), ie = "", Te[we] = (Te[we] || 0) + 1, Te[we] <= ea && (tn += ba), et.startsWith("_"))
              ie += F[0];
            else {
              const wa = Xe.classNameAliases[et] || et;
              Qe(F[0], wa);
            }
          } else
            ie += F[0];
          I = re.keywordPatternRe.lastIndex, F = re.keywordPatternRe.exec(Se);
        }
        ie += Se.substring(I), Pe.addText(ie);
      }
      function Jt() {
        if (Se === "") return;
        let I = null;
        if (typeof re.subLanguage == "string") {
          if (!A[re.subLanguage]) {
            Pe.addText(Se);
            return;
          }
          I = vt(re.subLanguage, Se, !0, Ar[re.subLanguage]), Ar[re.subLanguage] = /** @type {CompiledMode} */
          I._top;
        } else
          I = Ln(Se, re.subLanguage.length ? re.subLanguage : null);
        re.relevance > 0 && (tn += I.relevance), Pe.__addSublanguage(I._emitter, I.language);
      }
      function De() {
        re.subLanguage != null ? Jt() : it(), Se = "";
      }
      function Qe(I, F) {
        I !== "" && (Pe.startScope(F), Pe.addText(I), Pe.endScope());
      }
      function _r(I, F) {
        let ie = 1;
        const we = F.length - 1;
        for (; ie <= we; ) {
          if (!I._emit[ie]) {
            ie++;
            continue;
          }
          const ze = Xe.classNameAliases[I[ie]] || I[ie], et = F[ie];
          ze ? Qe(et, ze) : (Se = et, it(), Se = ""), ie++;
        }
      }
      function xr(I, F) {
        return I.scope && typeof I.scope == "string" && Pe.openNode(Xe.classNameAliases[I.scope] || I.scope), I.beginScope && (I.beginScope._wrap ? (Qe(Se, Xe.classNameAliases[I.beginScope._wrap] || I.beginScope._wrap), Se = "") : I.beginScope._multi && (_r(I.beginScope, F), Se = "")), re = Object.create(I, { parent: { value: re } }), re;
      }
      function Sr(I, F, ie) {
        let we = k(I.endRe, ie);
        if (we) {
          if (I["on:end"]) {
            const ze = new e(I);
            I["on:end"](F, ze), ze.isMatchIgnored && (we = !1);
          }
          if (we) {
            for (; I.endsParent && I.parent; )
              I = I.parent;
            return I;
          }
        }
        if (I.endsWithParent)
          return Sr(I.parent, F, ie);
      }
      function da(I) {
        return re.matcher.regexIndex === 0 ? (Se += I[0], 1) : (Rn = !0, 0);
      }
      function pa(I) {
        const F = I[0], ie = I.rule, we = new e(ie), ze = [ie.__beforeBegin, ie["on:begin"]];
        for (const et of ze)
          if (et && (et(I, we), we.isMatchIgnored))
            return da(F);
        return ie.skip ? Se += F : (ie.excludeBegin && (Se += F), De(), !ie.returnBegin && !ie.excludeBegin && (Se = F)), xr(ie, I), ie.returnBegin ? 0 : F.length;
      }
      function fa(I) {
        const F = I[0], ie = G.substring(I.index), we = Sr(re, I, ie);
        if (!we)
          return mr;
        const ze = re;
        re.endScope && re.endScope._wrap ? (De(), Qe(F, re.endScope._wrap)) : re.endScope && re.endScope._multi ? (De(), _r(re.endScope, I)) : ze.skip ? Se += F : (ze.returnEnd || ze.excludeEnd || (Se += F), De(), ze.excludeEnd && (Se = F));
        do
          re.scope && Pe.closeNode(), !re.skip && !re.subLanguage && (tn += re.relevance), re = re.parent;
        while (re !== we.parent);
        return we.starts && xr(we.starts, I), ze.returnEnd ? 0 : F.length;
      }
      function ga() {
        const I = [];
        for (let F = re; F !== Xe; F = F.parent)
          F.scope && I.unshift(F.scope);
        I.forEach((F) => Pe.openNode(F));
      }
      let en = {};
      function vr(I, F) {
        const ie = F && F[0];
        if (Se += I, ie == null)
          return De(), 0;
        if (en.type === "begin" && F.type === "end" && en.index === F.index && ie === "") {
          if (Se += G.slice(F.index, F.index + 1), !Ee) {
            const we = new Error(`0 width match regex (${T})`);
            throw we.languageName = T, we.badRule = en.rule, we;
          }
          return 1;
        }
        if (en = F, F.type === "begin")
          return pa(F);
        if (F.type === "illegal" && !ue) {
          const we = new Error('Illegal lexeme "' + ie + '" for mode "' + (re.scope || "<unnamed>") + '"');
          throw we.mode = re, we;
        } else if (F.type === "end") {
          const we = fa(F);
          if (we !== mr)
            return we;
        }
        if (F.type === "illegal" && ie === "")
          return Se += `
`, 1;
        if (Tn > 1e5 && Tn > F.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Se += ie, ie.length;
      }
      const Xe = rt(T);
      if (!Xe)
        throw ut(Le.replace("{}", T)), new Error('Unknown language: "' + T + '"');
      const ma = Ki(Xe);
      let Mn = "", re = xe || ma;
      const Ar = {}, Pe = new j.__emitter(j);
      ga();
      let Se = "", tn = 0, ht = 0, Tn = 0, Rn = !1;
      try {
        if (Xe.__emitTokens)
          Xe.__emitTokens(G, Pe);
        else {
          for (re.matcher.considerAll(); ; ) {
            Tn++, Rn ? Rn = !1 : re.matcher.considerAll(), re.matcher.lastIndex = ht;
            const I = re.matcher.exec(G);
            if (!I) break;
            const F = G.substring(ht, I.index), ie = vr(F, I);
            ht = I.index + ie;
          }
          vr(G.substring(ht));
        }
        return Pe.finalize(), Mn = Pe.toHTML(), {
          language: T,
          value: Mn,
          relevance: tn,
          illegal: !1,
          _emitter: Pe,
          _top: re
        };
      } catch (I) {
        if (I.message && I.message.includes("Illegal"))
          return {
            language: T,
            value: An(G),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: I.message,
              index: ht,
              context: G.slice(ht - 100, ht + 100),
              mode: I.mode,
              resultSoFar: Mn
            },
            _emitter: Pe
          };
        if (Ee)
          return {
            language: T,
            value: An(G),
            illegal: !1,
            relevance: 0,
            errorRaised: I,
            _emitter: Pe,
            _top: re
          };
        throw I;
      }
    }
    function En(T) {
      const G = {
        value: An(T),
        illegal: !1,
        relevance: 0,
        _top: U,
        _emitter: new j.__emitter(j)
      };
      return G._emitter.addText(T), G;
    }
    function Ln(T, G) {
      G = G || j.languages || Object.keys(A);
      const ue = En(T), xe = G.filter(rt).filter(kr).map(
        (De) => vt(De, T, !1)
      );
      xe.unshift(ue);
      const Te = xe.sort((De, Qe) => {
        if (De.relevance !== Qe.relevance) return Qe.relevance - De.relevance;
        if (De.language && Qe.language) {
          if (rt(De.language).supersetOf === Qe.language)
            return 1;
          if (rt(Qe.language).supersetOf === De.language)
            return -1;
        }
        return 0;
      }), [Fe, it] = Te, Jt = Fe;
      return Jt.secondBest = it, Jt;
    }
    function ta(T, G, ue) {
      const xe = G && P[G] || ue;
      T.classList.add("hljs"), T.classList.add(`language-${xe}`);
    }
    function Cn(T) {
      let G = null;
      const ue = $e(T);
      if (Y(ue)) return;
      if (Yt(
        "before:highlightElement",
        { el: T, language: ue }
      ), T.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", T);
        return;
      }
      if (T.children.length > 0 && (j.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(T)), j.throwUnescapedHTML))
        throw new Ji(
          "One of your code blocks includes unescaped HTML.",
          T.innerHTML
        );
      G = T;
      const xe = G.textContent, Te = ue ? Ce(xe, { language: ue, ignoreIllegals: !0 }) : Ln(xe);
      T.innerHTML = Te.value, T.dataset.highlighted = "yes", ta(T, ue, Te.language), T.result = {
        language: Te.language,
        // TODO: remove with version 11.0
        re: Te.relevance,
        relevance: Te.relevance
      }, Te.secondBest && (T.secondBest = {
        language: Te.secondBest.language,
        relevance: Te.secondBest.relevance
      }), Yt("after:highlightElement", { el: T, result: Te, text: xe });
    }
    function na(T) {
      j = gr(j, T);
    }
    const ra = () => {
      Vt(), bt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function ia() {
      Vt(), bt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let wr = !1;
    function Vt() {
      function T() {
        Vt();
      }
      if (document.readyState === "loading") {
        wr || window.addEventListener("DOMContentLoaded", T, !1), wr = !0;
        return;
      }
      document.querySelectorAll(j.cssSelector).forEach(Cn);
    }
    function aa(T, G) {
      let ue = null;
      try {
        ue = G(w);
      } catch (xe) {
        if (ut("Language definition for '{}' could not be registered.".replace("{}", T)), Ee)
          ut(xe);
        else
          throw xe;
        ue = U;
      }
      ue.name || (ue.name = T), A[T] = ue, ue.rawDefinition = G.bind(null, w), ue.aliases && yr(ue.aliases, { languageName: T });
    }
    function sa(T) {
      delete A[T];
      for (const G of Object.keys(P))
        P[G] === T && delete P[G];
    }
    function oa() {
      return Object.keys(A);
    }
    function rt(T) {
      return T = (T || "").toLowerCase(), A[T] || A[P[T]];
    }
    function yr(T, { languageName: G }) {
      typeof T == "string" && (T = [T]), T.forEach((ue) => {
        P[ue.toLowerCase()] = G;
      });
    }
    function kr(T) {
      const G = rt(T);
      return G && !G.disableAutodetect;
    }
    function la(T) {
      T["before:highlightBlock"] && !T["before:highlightElement"] && (T["before:highlightElement"] = (G) => {
        T["before:highlightBlock"](
          Object.assign({ block: G.el }, G)
        );
      }), T["after:highlightBlock"] && !T["after:highlightElement"] && (T["after:highlightElement"] = (G) => {
        T["after:highlightBlock"](
          Object.assign({ block: G.el }, G)
        );
      });
    }
    function ca(T) {
      la(T), ne.push(T);
    }
    function ua(T) {
      const G = ne.indexOf(T);
      G !== -1 && ne.splice(G, 1);
    }
    function Yt(T, G) {
      const ue = T;
      ne.forEach(function(xe) {
        xe[ue] && xe[ue](G);
      });
    }
    function ha(T) {
      return bt("10.7.0", "highlightBlock will be removed entirely in v12.0"), bt("10.7.0", "Please use highlightElement now."), Cn(T);
    }
    Object.assign(w, {
      highlight: Ce,
      highlightAuto: Ln,
      highlightAll: Vt,
      highlightElement: Cn,
      // TODO: Remove with v12 API
      highlightBlock: ha,
      configure: na,
      initHighlighting: ra,
      initHighlightingOnLoad: ia,
      registerLanguage: aa,
      unregisterLanguage: sa,
      listLanguages: oa,
      getLanguage: rt,
      registerAliases: yr,
      autoDetection: kr,
      inherit: gr,
      addPlugin: ca,
      removePlugin: ua
    }), w.debugMode = function() {
      Ee = !1;
    }, w.safeMode = function() {
      Ee = !0;
    }, w.versionString = Yi, w.regex = {
      concat: g,
      lookahead: m,
      either: b,
      optional: p,
      anyNumberOfTimes: d
    };
    for (const T in ae)
      typeof ae[T] == "object" && t(ae[T]);
    return Object.assign(w, ae), w;
  }, wt = br({});
  return wt.newInstance = () => br({}), $n = wt, wt.HighlightJS = wt, wt.default = wt, $n;
}
var ka = /* @__PURE__ */ ya();
const pe = /* @__PURE__ */ Yr(ka), _a = "11.11.1", le = /* @__PURE__ */ new Map(), xa = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", qe = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
qe.html = "xml";
qe.xhtml = "xml";
qe.markup = "xml";
const Jr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let ot = null;
const Pn = /* @__PURE__ */ new Map(), Sa = 300 * 1e3;
async function ei(t = xa) {
  if (t)
    return ot || (ot = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const i = (await e.text()).split(/\r?\n/);
        let r = -1;
        for (let c = 0; c < i.length; c++)
          if (/\|\s*Language\s*\|/i.test(i[c])) {
            r = c;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((c) => c.trim().toLowerCase());
        let s = a.findIndex((c) => /alias|aliases|equivalent|alt|alternates?/i.test(c));
        s === -1 && (s = 1);
        let l = a.findIndex((c) => /file|filename|module|module name|module-name|short|slug/i.test(c));
        if (l === -1) {
          const c = a.findIndex((u) => /language/i.test(u));
          l = c !== -1 ? c : 0;
        }
        let o = [];
        for (let c = r + 1; c < i.length; c++) {
          const u = i[c].trim();
          if (!u || !u.startsWith("|")) break;
          const f = u.replace(/^\||\|$/g, "").split("|").map((h) => h.trim());
          if (f.every((h) => /^-+$/.test(h))) continue;
          const m = f;
          if (!m.length) continue;
          const p = (m[l] || m[0] || "").toString().trim().toLowerCase();
          if (!p || /^-+$/.test(p)) continue;
          le.set(p, p);
          const g = m[s] || "";
          if (g) {
            const h = String(g).split(",").map((b) => b.replace(/`/g, "").trim()).filter(Boolean);
            if (h.length) {
              const y = h[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (le.set(y, y), o.push(y));
            }
          }
        }
        try {
          const c = [];
          for (const u of o) {
            const f = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            f && /[a-z0-9]/i.test(f) ? c.push(f) : le.delete(u);
          }
          o = c;
        } catch (c) {
          console.warn("[codeblocksManager] cleanup aliases failed", c);
        }
        try {
          let c = 0;
          for (const u of Array.from(le.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              le.delete(u), c++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const f = u.replace(/^[:]+/, "");
              if (f && /[a-z0-9]/i.test(f)) {
                const m = le.get(u);
                le.delete(u), le.set(f, m);
              } else
                le.delete(u), c++;
            }
          }
          for (const [u, f] of Array.from(le.entries()))
            (!f || /^-+$/.test(f) || !/[a-z0-9]/i.test(f)) && (le.delete(u), c++);
          try {
            const u = ":---------------------";
            le.has(u) && (le.delete(u), c++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(le.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (c) {
          console.warn("[codeblocksManager] ignored error", c);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), ot);
}
const At = /* @__PURE__ */ new Set();
async function Ht(t, e) {
  if (ot || (async () => {
    try {
      await ei();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), ot)
    try {
      await ot;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (Jr.has(n)) return !1;
  if (le.size && !le.has(n)) {
    const r = qe;
    if (!r[n] && !r[t])
      return !1;
  }
  if (At.has(t)) return !0;
  const i = qe;
  try {
    const r = (e || t || "").toString().replace(/\.js$/i, "").trim(), a = (i[t] || t || "").toString(), s = (i[r] || r || "").toString();
    let l = Array.from(new Set([
      a,
      s,
      r,
      t,
      i[r],
      i[t]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    le.size && (l = l.filter((u) => {
      if (le.has(u)) return !0;
      const f = qe[u];
      return !!(f && le.has(f));
    }));
    let o = null, c = null;
    for (const u of l)
      try {
        const f = Date.now();
        let m = Pn.get(u);
        if (m && m.ok === !1 && f - (m.ts || 0) >= Sa && (Pn.delete(u), m = void 0), m) {
          if (m.module)
            o = m.module;
          else if (m.promise)
            try {
              o = await m.promise;
            } catch {
              o = null;
            }
        } else {
          const d = { promise: null, module: null, ok: null, ts: 0 };
          Pn.set(u, d), d.promise = (async () => {
            try {
              try {
                try {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${u}.js`
                  );
                } catch {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${u}`
                  );
                }
              } catch {
                try {
                  const g = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;
                  return await new Function("u", "return import(u)")(g);
                } catch {
                  try {
                    const h = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;
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
            o = await d.promise, d.module = o, d.ok = !!o, d.ts = Date.now();
          } catch {
            d.module = null, d.ok = !1, d.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const d = o.default || o;
          try {
            const p = le.size && le.get(t) || u || t;
            return pe.registerLanguage(p, d), At.add(p), p !== t && (pe.registerLanguage(t, d), At.add(t)), !0;
          } catch (p) {
            c = p;
          }
        } else
          try {
            if (le.has(u) || le.has(t)) {
              const d = () => ({});
              try {
                pe.registerLanguage(u, d), At.add(u);
              } catch {
              }
              try {
                u !== t && (pe.registerLanguage(t, d), At.add(t));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (f) {
        c = f;
      }
    if (c)
      throw c;
    return !1;
  } catch {
    return !1;
  }
}
let nn = null;
function va(t = document) {
  ot || (async () => {
    try {
      await ei();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const e = qe, i = nn || (typeof IntersectionObserver > "u" ? null : (nn = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (c) {
        console.warn("[codeblocksManager] observer unobserve failed", c);
      }
      (async () => {
        try {
          const c = o.getAttribute && o.getAttribute("class") || o.className || "", u = c.match(/language-([a-zA-Z0-9_+-]+)/) || c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (u && u[1]) {
            const f = (u[1] || "").toLowerCase(), m = e[f] || f, d = le.size && (le.get(m) || le.get(String(m).toLowerCase())) || m;
            try {
              await Ht(d);
            } catch (p) {
              console.warn("[codeblocksManager] registerLanguage failed", p);
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
              pe.highlightElement(o);
            } catch (p) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", p);
            }
          } else
            try {
              const f = o.textContent || "";
              try {
                if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
                  const m = pe.highlight(f, { language: "plaintext" });
                  m && m.value && (o.innerHTML = m.value);
                }
              } catch {
                try {
                  pe.highlightElement(o);
                } catch (d) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", d);
                }
              }
            } catch (f) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", f);
            }
        } catch (c) {
          console.warn("[codeblocksManager] observer entry processing failed", c);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), nn)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), c = e[o] || o, u = le.size && (le.get(c) || le.get(String(c).toLowerCase())) || c;
          try {
            await Ht(u);
          } catch (f) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", f);
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
          pe.highlightElement(a);
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
function Xo(t, { useCdn: e = !0 } = {}) {
  const n = document.querySelector("link[data-hl-theme]"), i = n && n.getAttribute ? n.getAttribute("data-hl-theme") : null, r = t == null ? "default" : String(t), a = r && String(r).toLowerCase() || "";
  if (a === "default" || a === "monokai") {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
    return;
  }
  if (i && i.toLowerCase() === a) return;
  if (!e) {
    console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    return;
  }
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${_a}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let dt = "light";
function Aa(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([i, r]) => n.setAttribute(i, r)), document.head.appendChild(n), e["data-bulmaswatch-theme"])
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
function Cr() {
  try {
    const t = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
    for (const e of t) e && e.parentNode && e.parentNode.removeChild(e);
  } catch {
  }
  try {
    const t = Array.from(document.querySelectorAll("style[data-bulma-override]"));
    for (const e of t) e && e.parentNode && e.parentNode.removeChild(e);
  } catch {
  }
}
async function Ea(t = "none", e = "/") {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.debug("[bulmaManager] ensureBulma called", { bulmaCustomize: t, pageDir: e });
    } catch {
    }
  if (!t) return;
  if (t === "none") {
    try {
      const a = [
        location && location.protocol && location.protocol === "file:" ? "https://unpkg.com/bulma/css/bulma.min.css" : "//unpkg.com/bulma/css/bulma.min.css",
        "https://unpkg.com/bulma/css/bulma.min.css"
      ];
      let s = !1;
      for (const l of a)
        try {
          if (document.querySelector(`link[href="${l}"]`)) {
            s = !0;
            break;
          }
        } catch {
        }
      if (!s) {
        const l = a[0], o = document.createElement("link");
        o.rel = "stylesheet", o.href = l, o.setAttribute("data-bulma-base", "1");
        const c = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        c && c.parentNode ? c.parentNode.insertBefore(o, c) : document.head.appendChild(o);
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
  const i = [e + "bulma.css", "/bulma.css"], r = Array.from(new Set(i));
  if (t === "local") {
    if (Cr(), document.querySelector("style[data-bulma-override]")) return;
    for (const a of r)
      try {
        const s = await fetch(a, { method: "GET" });
        if (s.ok) {
          const l = await s.text(), o = document.createElement("style");
          o.setAttribute("data-bulma-override", a), o.appendChild(document.createTextNode(`
/* bulma override: ${a} */
` + l)), document.head.appendChild(o);
          return;
        }
      } catch (s) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", s);
      }
    return;
  }
  try {
    const a = String(t).trim();
    if (!a) return;
    Cr();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    Aa(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function La(t) {
  dt = t === "dark" ? "dark" : t === "system" ? "system" : "light";
  try {
    const e = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (e.length > 0)
      for (const n of e)
        dt === "dark" ? n.setAttribute("data-theme", "dark") : dt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      dt === "dark" ? n.setAttribute("data-theme", "dark") : dt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Ko(t) {
  const e = document.documentElement;
  for (const [n, i] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function ti(t) {
  if (!t || !(t instanceof HTMLElement)) return () => {
  };
  const e = t.closest && t.closest(".nimbi-mount") || null;
  try {
    e && (dt === "dark" ? e.setAttribute("data-theme", "dark") : dt === "light" ? e.setAttribute("data-theme", "light") : e.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const ni = {
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
}, _t = JSON.parse(JSON.stringify(ni));
let hn = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  hn = String(t).split("-")[0].toLowerCase();
}
ni[hn] || (hn = "en");
let lt = hn;
function Mt(t, e = {}) {
  const n = _t[lt] || _t.en;
  let i = n && n[t] ? n[t] : _t.en[t] || "";
  for (const r of Object.keys(e))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return i;
}
async function ri(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      _t[a] = Object.assign({}, _t[a] || {}, r[a]);
  } catch {
  }
}
function ii(t) {
  const e = String(t).split("-")[0].toLowerCase();
  lt = _t[e] ? e : "en";
}
const Ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return lt;
  },
  loadL10nFile: ri,
  setLang: ii,
  t: Mt
}, Symbol.toStringTag, { value: "Module" }));
function ai(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function me(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function St(t) {
  return String(t || "").replace(/\/+$/, "");
}
function gt(t) {
  return St(t) + "/";
}
function Ma(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function rn(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const i = Array.from(t.querySelectorAll("img"));
    if (!i.length) return;
    const r = t, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, u = (a ? Math.min(l, a.bottom) : l) + Number(e || 0);
    let f = 0;
    r && (f = r.clientHeight || (a ? a.height : 0)), f || (f = l - s);
    let m = 0.6;
    try {
      const h = r && window.getComputedStyle ? window.getComputedStyle(r) : null, b = h && h.getPropertyValue("--nimbi-image-max-height-ratio"), y = b ? parseFloat(b) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (m = y);
    } catch (h) {
      console.warn("[helpers] read CSS ratio failed", h);
    }
    const d = Math.max(200, Math.floor(f * m));
    let p = !1, g = null;
    if (i.forEach((h) => {
      try {
        const b = h.getAttribute ? h.getAttribute("loading") : void 0;
        b !== "eager" && h.setAttribute && h.setAttribute("loading", "lazy");
        const y = h.getBoundingClientRect ? h.getBoundingClientRect() : null, k = h.src || h.getAttribute && h.getAttribute("src"), _ = y && y.height > 1 ? y.height : d, M = y ? y.top : 0, $ = M + _;
        y && _ > 0 && M <= u && $ >= o && (h.setAttribute ? (h.setAttribute("loading", "eager"), h.setAttribute("fetchpriority", "high"), h.setAttribute("data-eager-by-nimbi", "1")) : (h.loading = "eager", h.fetchPriority = "high"), Ma(k), p = !0), !g && y && y.top <= u && (g = { img: h, src: k, rect: y, beforeLoading: b });
      } catch (b) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", b);
      }
    }), !p && g) {
      const { img: h, src: b, rect: y, beforeLoading: k } = g;
      try {
        h.setAttribute ? (h.setAttribute("loading", "eager"), h.setAttribute("fetchpriority", "high"), h.setAttribute("data-eager-by-nimbi", "1")) : (h.loading = "eager", h.fetchPriority = "high");
      } catch (_) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", _);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Ae(t, e = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(t || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [c, u] of r.entries())
      s.append(c, u);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return e && (o += `#${encodeURIComponent(e)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(t || ""))}`;
    return e ? `${r}#${encodeURIComponent(e)}` : r;
  }
}
function dn(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = dn);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
function Ta(t) {
  try {
    if (!t && t !== 0) return "";
    const e = String(t), n = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (i, r) => {
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
    return String(t || "");
  }
}
function Ra(t) {
  try {
    return String(t || "").split("/").map((e) => encodeURIComponent(e)).join("/");
  } catch {
    return String(t || "");
  }
}
function Mr(t, e = null, n = void 0) {
  let r = "#/" + Ra(String(t || ""));
  e && (r += "#" + encodeURIComponent(String(e)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = Ze(location.href);
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
function Ze(t) {
  try {
    const e = new URL(t, typeof location < "u" ? location.href : "http://localhost/"), n = e.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (e.hash) {
        const c = e.hash.replace(/^#/, "");
        if (c.includes("&")) {
          const u = c.split("&");
          r = u.shift() || null, a = u.join("&");
        } else
          r = c || null;
      }
      const s = new URLSearchParams(e.search);
      s.delete("page");
      const o = [s.toString(), a].filter(Boolean).join("&");
      return { type: "canonical", page: decodeURIComponent(n), anchor: r, params: o };
    }
    const i = e.hash ? decodeURIComponent(e.hash.replace(/^#/, "")) : "";
    if (i && i.startsWith("/")) {
      let r = i, a = "";
      if (r.indexOf("?") !== -1) {
        const c = r.split("?");
        r = c.shift() || "", a = c.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const c = s.split("#");
        s = c.shift() || "", l = c.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (e.pathname || "").replace(/^\//, "") || null, anchor: e.hash ? e.hash.replace(/^#/, "") : null, params: e.search ? e.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: t, anchor: null, params: "" };
  }
}
const $a = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Pa(t, e = "worker") {
  let n = null;
  const i = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function r(...c) {
    try {
      i && console && typeof console.warn == "function" && console.warn(...c);
    } catch {
    }
  }
  function a() {
    if (!n)
      try {
        const c = t();
        n = c || null, c && c.addEventListener("error", () => {
          try {
            n === c && (n = null, c.terminate && c.terminate());
          } catch (u) {
            r("[" + e + "] worker termination failed", u);
          }
        });
      } catch (c) {
        n = null, r("[" + e + "] worker init failed", c);
      }
    return n;
  }
  function s() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (c) {
      r("[" + e + "] worker termination failed", c);
    }
  }
  function l(c, u = 1e4) {
    return new Promise((f, m) => {
      const d = a();
      if (!d) return m(new Error("worker unavailable"));
      const p = String(Math.random()), g = Object.assign({}, c, { id: p });
      let h = null;
      const b = () => {
        h && clearTimeout(h), d.removeEventListener("message", y), d.removeEventListener("error", k);
      }, y = (_) => {
        const M = _.data || {};
        M.id === p && (b(), M.error ? m(new Error(M.error)) : f(M.result));
      }, k = (_) => {
        b(), r("[" + e + "] worker error event", _);
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (M) {
          r("[" + e + "] worker termination failed", M);
        }
        m(new Error(_ && _.message || "worker error"));
      };
      h = setTimeout(() => {
        b(), r("[" + e + "] worker timed out");
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (_) {
          r("[" + e + "] worker termination on timeout failed", _);
        }
        m(new Error("worker timeout"));
      }, u), d.addEventListener("message", y), d.addEventListener("error", k);
      try {
        d.postMessage(g);
      } catch (_) {
        b(), m(_);
      }
    });
  }
  return { get: a, send: l, terminate: s };
}
function si(t, e = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  const a = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function s(...g) {
    try {
      a && console && typeof console.warn == "function" && console.warn(...g);
    } catch {
    }
  }
  function l(g) {
    if (!i[g])
      try {
        const h = t();
        i[g] = h || null, h && h.addEventListener("error", () => {
          try {
            i[g] === h && (i[g] = null, h.terminate && h.terminate());
          } catch (b) {
            s("[" + e + "] worker termination failed", b);
          }
        });
      } catch (h) {
        i[g] = null, s("[" + e + "] worker init failed", h);
      }
    return i[g];
  }
  const o = new Array(n).fill(0), c = new Array(n).fill(null), u = 30 * 1e3;
  function f(g) {
    try {
      o[g] = Date.now(), c[g] && (clearTimeout(c[g]), c[g] = null), c[g] = setTimeout(() => {
        try {
          i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
        } catch (h) {
          s("[" + e + "] idle termination failed", h);
        }
        c[g] = null;
      }, u);
    } catch {
    }
  }
  function m() {
    for (let g = 0; g < i.length; g++) {
      const h = l(g);
      if (h) return h;
    }
    return null;
  }
  function d() {
    for (let g = 0; g < i.length; g++)
      try {
        i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
      } catch (h) {
        s("[" + e + "] worker termination failed", h);
      }
  }
  function p(g, h = 1e4) {
    return new Promise((b, y) => {
      const k = r++ % i.length, _ = (M) => {
        const $ = (k + M) % i.length, q = l($);
        if (!q)
          return M + 1 < i.length ? _(M + 1) : y(new Error("worker pool unavailable"));
        const C = String(Math.random()), O = Object.assign({}, g, { id: C });
        let ce = null;
        const S = () => {
          ce && clearTimeout(ce), q.removeEventListener("message", B), q.removeEventListener("error", _e);
        }, B = (J) => {
          const he = J.data || {};
          he.id === C && (S(), he.error ? y(new Error(he.error)) : b(he.result));
        }, _e = (J) => {
          S(), s("[" + e + "] worker error event", J);
          try {
            i[$] === q && (i[$] = null, q.terminate && q.terminate());
          } catch (he) {
            s("[" + e + "] worker termination failed", he);
          }
          y(new Error(J && J.message || "worker error"));
        };
        ce = setTimeout(() => {
          S(), s("[" + e + "] worker timed out");
          try {
            i[$] === q && (i[$] = null, q.terminate && q.terminate());
          } catch (J) {
            s("[" + e + "] worker termination on timeout failed", J);
          }
          y(new Error("worker timeout"));
        }, h), q.addEventListener("message", B), q.addEventListener("error", _e);
        try {
          f($), q.postMessage(O);
        } catch (J) {
          S(), y(J);
        }
      };
      _(0);
    });
  }
  return { get: m, send: p, terminate: d };
}
function Rt(t) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && t)
      try {
        Rt._blobUrlCache || (Rt._blobUrlCache = /* @__PURE__ */ new Map());
        const e = Rt._blobUrlCache;
        let n = e.get(t);
        if (!n) {
          const i = new Blob([t], { type: "application/javascript" });
          n = URL.createObjectURL(i), e.set(t, n);
        }
        return new Worker(n, { type: "module" });
      } catch (e) {
        try {
          typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console && typeof console.warn == "function" && console.warn("[worker-manager] createWorkerFromRaw failed", e);
        } catch {
        }
      }
  } catch (e) {
    try {
      typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console && typeof console.warn == "function" && console.warn("[worker-manager] createWorkerFromRaw failed", e);
    } catch {
    }
  }
  return null;
}
const Ye = /* @__PURE__ */ new Set();
function Kn(t) {
  za(), Ye.clear();
  for (const e of Me)
    e && Ye.add(e);
  Tr(te), Tr(Q), Kn._refreshed = !0;
}
function Tr(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Ye.add(e);
}
function Rr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, i) {
    return i && Ye.add(i), e.call(this, n, i);
  };
}
let $r = !1;
function za() {
  $r || (Rr(te), Rr(Q), $r = !0);
}
const te = /* @__PURE__ */ new Map();
let Ne = [], Vn = !1;
function Ia(t) {
  Vn = !!t;
}
function oi(t) {
  Ne = Array.isArray(t) ? t.slice() : [];
}
function Oa() {
  return Ne;
}
const li = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, ci = si(() => Rt($a), "slugManager", li);
function Na() {
  return ci.get();
}
function ui(t) {
  return ci.send(t, 5e3);
}
async function Ba(t, e = 1, n = void 0) {
  const i = await Promise.resolve().then(() => xt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await ui({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
}
async function Da(t, e, n) {
  const i = await Promise.resolve().then(() => xt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return ui({ type: "crawlForSlug", slug: t, base: e, maxQueue: n });
}
function at(t, e) {
  if (t)
    if (Ne && Ne.length) {
      const i = e.split("/")[0], r = Ne.includes(i);
      let a = te.get(t);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = e : a.default = e, te.set(t, a);
    } else
      te.set(t, e);
}
const yn = /* @__PURE__ */ new Set();
function qa(t) {
  typeof t == "function" && yn.add(t);
}
function ja(t) {
  typeof t == "function" && yn.delete(t);
}
const Q = /* @__PURE__ */ new Map();
let qn = {}, Me = [], ve = "_404.md", yt = "_home.md";
function jn(t) {
  t != null && (ve = String(t || ""));
}
function Ha(t) {
  t != null && (yt = String(t || ""));
}
function Ua(t) {
  qn = t || {};
}
const $t = /* @__PURE__ */ new Map(), pn = /* @__PURE__ */ new Set();
function Fa() {
  $t.clear(), pn.clear();
}
function Wa(t) {
  if (!t || t.length === 0) return "";
  let e = t[0];
  for (let i = 1; i < t.length; i++) {
    const r = t[i];
    let a = 0;
    const s = Math.min(e.length, r.length);
    for (; a < s && e[a] === r[a]; ) a++;
    e = e.slice(0, a);
  }
  const n = e.lastIndexOf("/");
  return n === -1 ? e : e.slice(0, n + 1);
}
function fn(t) {
  te.clear(), Q.clear(), Me = [], Ne = Ne || [];
  const e = Object.keys(qn || {});
  if (!e.length) return;
  let n = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? n = new URL(String(t)).pathname : n = String(t || "");
      } catch (i) {
        n = String(t || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      n = gt(n);
    }
  } catch (i) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Wa(e));
  for (const i of e) {
    let r = i;
    n && i.startsWith(n) ? r = me(i.slice(n.length)) : r = me(i), Me.push(r);
    try {
      Kn();
    } catch (s) {
      console.warn("[slugManager] refreshIndexPaths failed", s);
    }
    const a = qn[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ge(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!Ne || !Ne.length) && (o = hi(o, new Set(te.keys()))), Ne && Ne.length) {
              const u = r.split("/")[0], f = Ne.includes(u);
              let m = te.get(o);
              (!m || typeof m == "string") && (m = { default: typeof m == "string" ? m : void 0, langs: {} }), f ? m.langs[u] = r : m.default = r, te.set(o, m);
            } else
              te.set(o, r);
            Q.set(r, o);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  fn();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function ge(t) {
  let n = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function hi(t, e) {
  if (!e.has(t)) return t;
  let n = 2, i = `${t}-${n}`;
  for (; e.has(i); )
    n += 1, i = `${t}-${n}`;
  return i;
}
function Za(t) {
  return Zt(t, void 0);
}
function Zt(t, e) {
  if (!t) return !1;
  if (t.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    if (e && typeof e == "string")
      try {
        const n = new URL(t), i = new URL(e);
        return n.origin !== i.origin ? !0 : !n.pathname.startsWith(i.pathname);
      } catch {
        return !0;
      }
    return !0;
  }
  if (t.startsWith("/") && e && typeof e == "string")
    try {
      const n = new URL(t, e), i = new URL(e);
      return n.origin !== i.origin ? !0 : !n.pathname.startsWith(i.pathname);
    } catch {
      return !0;
    }
  return !1;
}
function on(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, n) => n);
}
function Gt(t) {
  if (!t || !te.has(t)) return null;
  const e = te.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ne && Ne.length && lt && e.langs && e.langs[lt])
    return e.langs[lt];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const Pt = /* @__PURE__ */ new Map();
function Ga() {
  Pt.clear();
}
let ye = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    if (typeof t == "string" && (t.indexOf("?page=") !== -1 || t.startsWith("?") || t.startsWith("#/") || t.indexOf("#/") !== -1))
      try {
        const a = Ze(t);
        a && a.page && (t = a.page);
      } catch {
      }
  } catch {
  }
  try {
    const a = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (a && te.has(a)) {
      const s = Gt(a) || te.get(a);
      s && s !== t && (t = s);
    }
  } catch (a) {
    console.warn("[slugManager] slug mapping normalization failed", a);
  }
  const n = e == null ? "" : St(String(e));
  let i = "";
  try {
    const a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (n && n.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(n)) {
      const s = n.replace(/\/$/, "") + "/" + t.replace(/^\//, "");
      i = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + s;
    } else {
      let s = a + "/";
      n && (/^[a-z][a-z0-9+.-]*:/i.test(n) ? s = n.replace(/\/$/, "") + "/" : n.startsWith("/") ? s = a + n.replace(/\/$/, "") + "/" : s = a + "/" + n.replace(/\/$/, "") + "/"), i = new URL(t.replace(/^\//, ""), s).toString();
    }
  } catch {
    i = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + t.replace(/^\//, "");
  }
  if (Pt.has(i))
    return Pt.get(i);
  const r = (async () => {
    const a = await fetch(i);
    if (!a || typeof a.ok != "boolean" || !a.ok) {
      if (a && a.status === 404)
        try {
          const f = `${n}/${ve}`, m = await globalThis.fetch(f);
          if (m && typeof m.ok == "boolean" && m.ok)
            return { raw: await m.text(), status: 404 };
        } catch (f) {
          console.warn("[slugManager] fetching fallback 404 failed", f);
        }
      let u = "";
      try {
        a && typeof a.clone == "function" ? u = await a.clone().text() : a && typeof a.text == "function" ? u = await a.text() : u = "";
      } catch (f) {
        u = "", console.warn("[slugManager] reading error body failed", f);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: a ? a.status : void 0, statusText: a ? a.statusText : void 0, body: u.slice(0, 200) }), new Error("failed to fetch md");
    }
    const s = await a.text(), l = s.trim().slice(0, 128).toLowerCase(), o = /^(?:<!doctype|<html|<title|<h1)/.test(l), c = o || String(t || "").toLowerCase().endsWith(".html");
    if (o && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const u = `${n}/${ve}`, f = await globalThis.fetch(u);
        if (f.ok)
          return { raw: await f.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return c ? { raw: s, isHtml: !0 } : { raw: s };
  })();
  return Pt.set(i, r), r;
};
function Qa(t) {
  typeof t == "function" && (ye = t);
}
const ln = /* @__PURE__ */ new Map();
function Xa(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let tt = [], Et = null;
async function di(t, e = 1, n = void 0) {
  const i = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => me(String(r || ""))))) : [];
  try {
    const r = me(String(ve || ""));
    r && !i.includes(r) && i.push(r);
  } catch {
  }
  if (tt && tt.length && e === 1 && !tt.some((a) => {
    try {
      return i.includes(me(String(a.path || "")));
    } catch {
      return !1;
    }
  }))
    return tt;
  if (Et) return Et;
  Et = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((c) => me(String(c || ""))))) : [];
    try {
      const c = me(String(ve || ""));
      c && !r.includes(c) && r.push(c);
    } catch {
    }
    const a = (c) => {
      if (!r || !r.length) return !1;
      for (const u of r)
        if (u && (c === u || c.startsWith(u + "/")))
          return !0;
      return !1;
    };
    let s = [];
    if (Me && Me.length && (s = Array.from(Me)), !s.length)
      for (const c of te.values())
        c && s.push(c);
    try {
      const c = await bi(t);
      c && c.length && (s = s.concat(c));
    } catch (c) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", c);
    }
    try {
      const c = new Set(s), u = [...s], f = Math.max(1, li), m = async () => {
        for (; !(c.size > Qt); ) {
          const p = u.shift();
          if (!p) break;
          try {
            const g = await ye(p, t);
            if (g && g.raw) {
              if (g.status === 404) continue;
              let h = g.raw;
              const b = [], y = String(p || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(y) && Vn && (!p || !p.includes("/")))
                continue;
              const k = Xa(h), _ = /\[[^\]]+\]\(([^)]+)\)/g;
              let M;
              for (; M = _.exec(k); )
                b.push(M[1]);
              const $ = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; M = $.exec(k); )
                b.push(M[1]);
              const q = p && p.includes("/") ? p.substring(0, p.lastIndexOf("/") + 1) : "";
              for (let C of b)
                try {
                  if (Zt(C, t) || C.startsWith("..") || C.indexOf("/../") !== -1 || (q && !C.startsWith("./") && !C.startsWith("/") && !C.startsWith("../") && (C = q + C), C = me(C), !/\.(md|html?)(?:$|[?#])/i.test(C)) || (C = C.split(/[?#]/)[0], a(C))) continue;
                  c.has(C) || (c.add(C), u.push(C), s.push(C));
                } catch (O) {
                  console.warn("[slugManager] href processing failed", C, O);
                }
            }
          } catch (g) {
            console.warn("[slugManager] discovery fetch failed for", p, g);
          }
        }
      }, d = [];
      for (let p = 0; p < f; p++) d.push(m());
      await Promise.all(d);
    } catch (c) {
      console.warn("[slugManager] discovery loop failed", c);
    }
    const l = /* @__PURE__ */ new Set();
    s = s.filter((c) => !c || l.has(c) || a(c) ? !1 : (l.add(c), !0));
    const o = [];
    for (const c of s)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(c))
        try {
          const u = await ye(c, t);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let f = "", m = "";
            if (u.isHtml)
              try {
                const g = new DOMParser().parseFromString(u.raw, "text/html"), h = g.querySelector("title") || g.querySelector("h1");
                h && h.textContent && (f = h.textContent.trim());
                const b = g.querySelector("p");
                if (b && b.textContent && (m = b.textContent.trim()), e >= 2)
                  try {
                    const y = g.querySelector("h1"), k = y && y.textContent ? y.textContent.trim() : f || "", _ = (() => {
                      try {
                        if (Q.has(c)) return Q.get(c);
                      } catch {
                      }
                      return ge(f || c);
                    })(), M = Array.from(g.querySelectorAll("h2"));
                    for (const $ of M)
                      try {
                        const q = ($.textContent || "").trim();
                        if (!q) continue;
                        const C = $.id ? $.id : ge(q), O = _ ? `${_}::${C}` : `${ge(c)}::${C}`;
                        let ce = "", S = $.nextElementSibling;
                        for (; S && S.tagName && S.tagName.toLowerCase() === "script"; ) S = S.nextElementSibling;
                        S && S.textContent && (ce = String(S.textContent).trim()), o.push({ slug: O, title: q, excerpt: ce, path: c, parentTitle: k });
                      } catch (q) {
                        console.warn("[slugManager] indexing H2 failed", q);
                      }
                    if (e === 3)
                      try {
                        const $ = Array.from(g.querySelectorAll("h3"));
                        for (const q of $)
                          try {
                            const C = (q.textContent || "").trim();
                            if (!C) continue;
                            const O = q.id ? q.id : ge(C), ce = _ ? `${_}::${O}` : `${ge(c)}::${O}`;
                            let S = "", B = q.nextElementSibling;
                            for (; B && B.tagName && B.tagName.toLowerCase() === "script"; ) B = B.nextElementSibling;
                            B && B.textContent && (S = String(B.textContent).trim()), o.push({ slug: ce, title: C, excerpt: S, path: c, parentTitle: k });
                          } catch (C) {
                            console.warn("[slugManager] indexing H3 failed", C);
                          }
                      } catch ($) {
                        console.warn("[slugManager] collect H3s failed", $);
                      }
                  } catch (y) {
                    console.warn("[slugManager] collect H2s failed", y);
                  }
              } catch (p) {
                console.warn("[slugManager] parsing HTML for index failed", p);
              }
            else {
              const p = u.raw, g = p.match(/^#\s+(.+)$/m);
              f = g ? g[1].trim() : "";
              try {
                f = on(f);
              } catch {
              }
              const h = p.split(/\r?\n\s*\r?\n/);
              if (h.length > 1)
                for (let b = 1; b < h.length; b++) {
                  const y = h[b].trim();
                  if (y && !/^#/.test(y)) {
                    m = y.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e >= 2) {
                let b = "", y = "";
                try {
                  const k = (p.match(/^#\s+(.+)$/m) || [])[1];
                  b = k ? k.trim() : "", y = (function() {
                    try {
                      if (Q.has(c)) return Q.get(c);
                    } catch {
                    }
                    return ge(f || c);
                  })();
                  const _ = /^##\s+(.+)$/gm;
                  let M;
                  for (; M = _.exec(p); )
                    try {
                      const $ = (M[1] || "").trim(), q = on($);
                      if (!$) continue;
                      const C = ge($), O = y ? `${y}::${C}` : `${ge(c)}::${C}`, S = p.slice(_.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), B = S && S[1] ? String(S[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: O, title: q, excerpt: B, path: c, parentTitle: b });
                    } catch ($) {
                      console.warn("[slugManager] indexing markdown H2 failed", $);
                    }
                } catch (k) {
                  console.warn("[slugManager] collect markdown H2s failed", k);
                }
                if (e === 3)
                  try {
                    const k = /^###\s+(.+)$/gm;
                    let _;
                    for (; _ = k.exec(p); )
                      try {
                        const M = (_[1] || "").trim(), $ = on(M);
                        if (!M) continue;
                        const q = ge(M), C = y ? `${y}::${q}` : `${ge(c)}::${q}`, ce = p.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), S = ce && ce[1] ? String(ce[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: C, title: $, excerpt: S, path: c, parentTitle: b });
                      } catch (M) {
                        console.warn("[slugManager] indexing markdown H3 failed", M);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect markdown H3s failed", k);
                  }
              }
            }
            let d = "";
            try {
              Q.has(c) && (d = Q.get(c));
            } catch (p) {
              console.warn("[slugManager] mdToSlug access failed", p);
            }
            d || (d = ge(f || c)), o.push({ slug: d, title: f, excerpt: m, path: c });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    try {
      tt = o.filter((u) => {
        try {
          return !a(String(u.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (c) {
      console.warn("[slugManager] filtering index by excludes failed", c), tt = o;
    }
    return tt;
  })();
  try {
    await Et;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return Et = null, tt;
}
const pi = 1e3;
let Qt = pi;
function Ka(t) {
  typeof t == "number" && t >= 0 && (Qt = t);
}
const fi = new DOMParser(), gi = "a[href]";
let mi = async function(t, e, n = Qt) {
  if (ln.has(t)) return ln.get(t);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? l = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? l = s + String(e).replace(/\/$/, "") + "/" : l = s + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  for (; a.length && !i && !(a.length > n); ) {
    const o = a.shift();
    if (r.has(o)) continue;
    r.add(o);
    let c = "";
    try {
      c = new URL(o || "", l).toString();
    } catch {
      c = (String(e || "") || s) + "/" + String(o || "").replace(/^\//, "");
    }
    try {
      let u;
      try {
        u = await globalThis.fetch(c);
      } catch (g) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: g });
        continue;
      }
      if (!u || !u.ok) {
        u && !u.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: u.status });
        continue;
      }
      const f = await u.text(), d = fi.parseFromString(f, "text/html").querySelectorAll(gi), p = c;
      for (const g of d)
        try {
          let h = g.getAttribute("href") || "";
          if (!h || Zt(h, e) || h.startsWith("..") || h.indexOf("/../") !== -1) continue;
          if (h.endsWith("/")) {
            try {
              const b = new URL(h, p), y = new URL(l).pathname, k = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, ""), _ = gt(me(k));
              r.has(_) || a.push(_);
            } catch {
              const y = me(o + h);
              r.has(y) || a.push(y);
            }
            continue;
          }
          if (h.toLowerCase().endsWith(".md")) {
            let b = "";
            try {
              const y = new URL(h, p), k = new URL(l).pathname;
              b = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, "");
            } catch {
              b = (o + h).replace(/^\//, "");
            }
            b = me(b);
            try {
              if (Q.has(b))
                continue;
              for (const y of te.values())
                ;
            } catch (y) {
              console.warn("[slugManager] slug map access failed", y);
            }
            try {
              const y = await ye(b, e);
              if (y && y.raw) {
                const k = (y.raw || "").match(/^#\s+(.+)$/m);
                if (k && k[1] && ge(k[1].trim()) === t) {
                  i = b;
                  break;
                }
              }
            } catch (y) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", y);
            }
          }
        } catch (h) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", h);
        }
    } catch (u) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", u);
    }
  }
  return ln.set(t, i), i;
};
async function bi(t, e = Qt) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? s = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? s = a + String(t).replace(/\/$/, "") + "/" : s = a + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  for (; r.length && !(r.length > e); ) {
    const l = r.shift();
    if (i.has(l)) continue;
    i.add(l);
    let o = "";
    try {
      o = new URL(l || "", s).toString();
    } catch {
      o = (String(t || "") || a) + "/" + String(l || "").replace(/^\//, "");
    }
    try {
      let c;
      try {
        c = await globalThis.fetch(o);
      } catch (p) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: o, error: p });
        continue;
      }
      if (!c || !c.ok) {
        c && !c.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: o, status: c.status });
        continue;
      }
      const u = await c.text(), m = fi.parseFromString(u, "text/html").querySelectorAll(gi), d = o;
      for (const p of m)
        try {
          let g = p.getAttribute("href") || "";
          if (!g || Zt(g, t) || g.startsWith("..") || g.indexOf("/../") !== -1) continue;
          if (g.endsWith("/")) {
            try {
              const b = new URL(g, d), y = new URL(s).pathname, k = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, ""), _ = gt(me(k));
              i.has(_) || r.push(_);
            } catch {
              const y = l + g;
              i.has(y) || r.push(y);
            }
            continue;
          }
          let h = "";
          try {
            const b = new URL(g, d), y = new URL(s).pathname;
            h = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, "");
          } catch {
            h = (l + g).replace(/^\//, "");
          }
          h = me(h), /\.(md|html?)$/i.test(h) && n.add(h);
        } catch (g) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", g);
        }
    } catch (c) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", c);
    }
  }
  return Array.from(n);
}
async function wi(t, e, n) {
  if (t && typeof t == "string" && (t = me(t), t = St(t)), te.has(t))
    return Gt(t) || te.get(t);
  for (const r of yn)
    try {
      const a = await r(t, e);
      if (a)
        return at(t, a), Q.set(a, t), a;
    } catch (a) {
      console.warn("[slugManager] slug resolver failed", a);
    }
  if (Me && Me.length) {
    if ($t.has(t)) {
      const r = $t.get(t);
      return te.set(t, r), Q.set(r, t), r;
    }
    for (const r of Me)
      if (!pn.has(r))
        try {
          const a = await ye(r, e);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ge(s[1].trim());
              if (pn.add(r), l && $t.set(l, r), l === t)
                return at(t, r), Q.set(r, t), r;
            }
          }
        } catch (a) {
          console.warn("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await di(e);
    if (r && r.length) {
      const a = r.find((s) => s.slug === t);
      if (a)
        return at(t, a.path), Q.set(a.path, t), a.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await mi(t, e, n);
    if (r)
      return at(t, r), Q.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${t}.html`, `${t}.md`];
  for (const r of i)
    try {
      const a = await ye(r, e);
      if (a && a.raw)
        return at(t, r), Q.set(r, t), r;
    } catch (a) {
      console.warn("[slugManager] candidate fetch failed", a);
    }
  if (Me && Me.length)
    for (const r of Me)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ge(a) === t)
          return at(t, r), Q.set(r, t), r;
      } catch (a) {
        console.warn("[slugManager] build-time filename match failed", a);
      }
  try {
    const r = [];
    yt && typeof yt == "string" && yt.trim() && r.push(yt), r.includes("_home.md") || r.push("_home.md");
    for (const a of r)
      try {
        const s = await ye(a, e);
        if (s && s.raw) {
          const l = (s.raw || "").match(/^#\s+(.+)$/m);
          if (l && l[1] && ge(l[1].trim()) === t)
            return at(t, a), Q.set(a, t), a;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: pi,
  _setAllMd: Ua,
  _storeSlugMapping: at,
  addSlugResolver: qa,
  get allMarkdownPaths() {
    return Me;
  },
  get availableLanguages() {
    return Ne;
  },
  buildSearchIndex: di,
  buildSearchIndexWorker: Ba,
  clearFetchCache: Ga,
  clearListCaches: Fa,
  crawlAllMarkdown: bi,
  crawlCache: ln,
  crawlForSlug: mi,
  crawlForSlugWorker: Da,
  get defaultCrawlMaxQueue() {
    return Qt;
  },
  ensureSlug: wi,
  fetchCache: Pt,
  get fetchMarkdown() {
    return ye;
  },
  getLanguages: Oa,
  get homePage() {
    return yt;
  },
  initSlugWorker: Na,
  isExternalLink: Za,
  isExternalLinkWithBase: Zt,
  listPathsFetched: pn,
  listSlugCache: $t,
  mdToSlug: Q,
  get notFoundPage() {
    return ve;
  },
  removeSlugResolver: ja,
  resolveSlugPath: Gt,
  get searchIndex() {
    return tt;
  },
  setContentBase: fn,
  setDefaultCrawlMaxQueue: Ka,
  setFetchMarkdown: Qa,
  setHomePage: Ha,
  setLanguages: oi,
  setNotFoundPage: jn,
  setSkipRootReadme: Ia,
  get skipRootReadme() {
    return Vn;
  },
  slugResolvers: yn,
  slugToMd: te,
  slugify: ge,
  unescapeMarkdown: on,
  uniqueSlug: hi
}, Symbol.toStringTag, { value: "Module" }));
var zn, Pr;
function Va() {
  if (Pr) return zn;
  Pr = 1;
  function t(a, s) {
    return s.some(
      ([l, o]) => l <= a && a <= o
    );
  }
  function e(a) {
    if (typeof a != "string")
      return !1;
    const s = a.charCodeAt(0);
    return t(
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
    return t(
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
    let l = 0, o = 0, c = a.length - 1;
    const u = s.wordsPerMinute || 200, f = s.wordBound || n;
    for (; f(a[o]); ) o++;
    for (; f(a[c]); ) c--;
    const m = `${a}
`;
    for (let h = o; h <= c; h++)
      if ((e(m[h]) || !f(m[h]) && (f(m[h + 1]) || e(m[h + 1]))) && l++, e(m[h]))
        for (; h <= c && (i(m[h + 1]) || f(m[h + 1])); )
          h++;
    const d = l / u, p = Math.round(d * 60 * 1e3);
    return {
      text: Math.ceil(d.toFixed(2)) + " min read",
      minutes: d,
      time: p,
      words: l
    };
  }
  return zn = r, zn;
}
var Ya = Va();
const Ja = /* @__PURE__ */ Yr(Ya);
function Ut(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function st(t, e, n) {
  let i = `meta[${t}="${e}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function yi(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function es(t, e, n, i) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  st("property", "og:title", r);
  const a = i && String(i).trim() ? i : t.description || "";
  a && String(a).trim() && st("property", "og:description", a), a && String(a).trim() && st("name", "twitter:description", a), st("name", "twitter:card", t.twitter_card || "summary_large_image");
  const s = n || t.image;
  s && (st("property", "og:image", s), st("name", "twitter:image", s));
}
function Yn(t, e, n, i, r = "") {
  const a = t.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && Ut("description", l), Ut("robots", a.robots || "index,follow"), es(a, e, n, l);
}
function ts() {
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
        const i = n.getAttribute("content") || "";
        if (i && i.trim()) return i.trim();
      }
    }
  } catch (t) {
    console.warn("[seoManager] getSiteNameFromMeta failed", t);
  }
  return "";
}
function Jn(t, e, n, i, r, a = "") {
  try {
    const s = t.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i || s.image || null;
    let u = "";
    try {
      if (e) {
        const p = me(e);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(p);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (p) {
      u = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", p);
    }
    u && yi("canonical", u);
    try {
      st("property", "og:url", u);
    } catch (p) {
      console.warn("[seoManager] upsertMeta og:url failed", p);
    }
    const f = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: u || location.href.split("#")[0]
    };
    c && (f.image = String(c)), s.date && (f.datePublished = s.date), s.dateModified && (f.dateModified = s.dateModified);
    const m = "nimbi-jsonld";
    let d = document.getElementById(m);
    d || (d = document.createElement("script"), d.type = "application/ld+json", d.id = m, document.head.appendChild(d)), d.textContent = JSON.stringify(f, null, 2);
  } catch (s) {
    console.warn("[seoManager] setStructuredData failed", s);
  }
}
let zt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function ns(t) {
  try {
    if (!t || typeof t != "object") {
      zt = {};
      return;
    }
    zt = Object.assign({}, t);
  } catch (e) {
    console.warn("[seoManager] setSeoMap failed", e);
  }
}
function rs(t, e = "") {
  try {
    if (!t) return;
    const n = zt && zt[t] ? zt[t] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[t] ? window.__SEO_MAP[t] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(t || ""));
      yi("canonical", i);
      try {
        st("property", "og:url", i);
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
      n.description && Ut("description", String(n.description));
    } catch {
    }
    try {
      try {
        Yn({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, e);
      } catch {
      }
    } catch {
    }
    try {
      Jn({ meta: n }, t, n.title || void 0, n.image || void 0, n.description || void 0, e);
    } catch (i) {
      console.warn("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    console.warn("[seoManager] injectSeoForPage failed", n);
  }
}
function cn(t = {}, e = "", n = void 0, i = void 0) {
  try {
    const r = t || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Ut("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Ut("description", String(s));
    } catch {
    }
    try {
      Yn({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Jn({ meta: Object.assign({}, r, { title: a, description: s }) }, e || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    console.warn("[seoManager] markNotFound failed", r);
  }
}
function is(t, e, n, i, r, a, s, l, o, c, u) {
  try {
    if (i && i.querySelector) {
      const f = i.querySelector(".menu-label");
      f && (f.textContent = l && l.textContent || t("onThisPage"));
    }
  } catch (f) {
    console.warn("[seoManager] update toc label failed", f);
  }
  try {
    const f = n.meta && n.meta.title ? String(n.meta.title).trim() : "", m = r.querySelector("img"), d = m && (m.getAttribute("src") || m.src) || null;
    let p = "";
    try {
      let b = "";
      try {
        const y = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let k = y.nextElementSibling;
          const _ = [];
          for (; k && !(k.tagName && k.tagName.toLowerCase() === "h2"); ) {
            try {
              if (k.classList && k.classList.contains("nimbi-article-subtitle")) {
                k = k.nextElementSibling;
                continue;
              }
            } catch {
            }
            const M = (k.textContent || "").trim();
            M && _.push(M), k = k.nextElementSibling;
          }
          _.length && (b = _.join(" ").replace(/\s+/g, " ").trim()), !b && o && (b = String(o).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      b && String(b).length > 160 && (b = String(b).slice(0, 157).trim() + "..."), p = b;
    } catch (b) {
      console.warn("[seoManager] compute descOverride failed", b);
    }
    let g = "";
    try {
      f && (g = f);
    } catch {
    }
    if (!g)
      try {
        l && l.textContent && (g = String(l.textContent).trim());
      } catch {
      }
    if (!g)
      try {
        const b = r.querySelector("h2");
        b && b.textContent && (g = String(b.textContent).trim());
      } catch {
      }
    g || (g = a || "");
    try {
      Yn(n, g || void 0, d, p);
    } catch (b) {
      console.warn("[seoManager] setMetaTags failed", b);
    }
    try {
      Jn(n, c, g || void 0, d, p, e);
    } catch (b) {
      console.warn("[seoManager] setStructuredData failed", b);
    }
    const h = ts();
    g ? h ? document.title = `${h} - ${g}` : document.title = `${e || "Site"} - ${g}` : f ? document.title = f : document.title = e || document.title;
  } catch (f) {
    console.warn("[seoManager] applyPageMeta failed", f);
  }
  try {
    try {
      const f = r.querySelectorAll(".nimbi-reading-time");
      f && f.forEach((m) => m.remove());
    } catch {
    }
    if (o) {
      const f = Ja(u.raw || ""), m = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = m ? t("readingTime", { minutes: m }) : "";
      if (!d) return;
      const p = r.querySelector("h1");
      if (p) {
        const g = r.querySelector(".nimbi-article-subtitle");
        try {
          if (g) {
            const h = document.createElement("span");
            h.className = "nimbi-reading-time", h.textContent = d, g.appendChild(h);
          } else {
            const h = document.createElement("p");
            h.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = d, h.appendChild(b);
            try {
              p.parentElement.insertBefore(h, p.nextSibling);
            } catch {
              try {
                p.insertAdjacentElement("afterend", h);
              } catch {
              }
            }
          }
        } catch {
          try {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = d, b.appendChild(y), p.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch (f) {
    console.warn("[seoManager] reading time update failed", f);
  }
}
let ki = 100;
function zr(t) {
  ki = t;
}
let It = 300 * 1e3;
function Ir(t) {
  It = t;
}
const Ue = /* @__PURE__ */ new Map();
function as(t) {
  if (!Ue.has(t)) return;
  const e = Ue.get(t), n = Date.now();
  if (e.ts + It < n) {
    Ue.delete(t);
    return;
  }
  return Ue.delete(t), Ue.set(t, e), e.value;
}
function ss(t, e) {
  if (Or(), Or(), Ue.delete(t), Ue.set(t, { value: e, ts: Date.now() }), Ue.size > ki) {
    const n = Ue.keys().next().value;
    n !== void 0 && Ue.delete(n);
  }
}
function Or() {
  if (!It || It <= 0) return;
  const t = Date.now();
  for (const [e, n] of Ue.entries())
    n.ts + It < t && Ue.delete(e);
}
async function os(t, e) {
  const n = new Set(Ye), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const f = Ze(a);
          if (f) {
            if (f.type === "canonical" && f.page) {
              const m = me(f.page);
              if (m) {
                n.add(m);
                continue;
              }
            }
            if (f.type === "cosmetic" && f.page) {
              const m = f.page;
              if (te.has(m)) {
                const d = te.get(m);
                if (d) return d;
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
          let f = me(l[1]);
          f && n.add(f);
          continue;
        }
        const o = (r.textContent || "").trim(), c = (s.pathname || "").replace(/^.*\//, "");
        if (o && ge(o) === t || c && ge(c.replace(/\.(html?|md)$/i, "")) === t) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let f = s.pathname.replace(/^\//, "");
          n.add(f);
          continue;
        }
        const u = s.pathname || "";
        if (u) {
          const f = new URL(e), m = gt(f.pathname);
          if (u.indexOf(m) !== -1) {
            let d = u.startsWith(m) ? u.slice(m.length) : u;
            d = me(d), d && n.add(d);
          }
        }
      } catch (s) {
        console.warn("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await ye(r, e);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && ge(l) === t)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function ls(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (te.has(n)) {
        const i = Gt(n) || te.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || e.push(i) : (e.push(i), e.push(i + ".html")));
      } else {
        if (Ye && Ye.size)
          for (const i of Ye) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ge(r) === n && !/index\.html$/i.test(i)) {
              e.push(i);
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
async function cs(t, e) {
  const n = t || "";
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
    const h = Ze(typeof location < "u" ? location.href : "");
    h && h.anchor && (i = h.anchor);
  } catch {
    try {
      i = location && location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    } catch {
      i = null;
    }
  }
  let r = t || "", a = null;
  const s = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (r && String(r).includes("::")) {
    const h = String(r).split("::", 2);
    r = h[0], a = h[1] || null;
  }
  const o = `${t}|||${typeof Ca < "u" && lt ? lt : ""}`, c = as(o);
  if (c)
    r = c.resolved, a = c.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let h = decodeURIComponent(String(r || ""));
      if (h && typeof h == "string" && (h = me(h), h = St(h)), te.has(h))
        r = Gt(h) || te.get(h);
      else {
        let b = await os(h, e);
        if (b)
          r = b;
        else if (Kn._refreshed && Ye && Ye.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const y = await wi(h, e);
          y && (r = y);
        }
      }
    }
    ss(o, { resolved: r, anchor: a });
  }
  !a && i && (a = i);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const h = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const b = await fetch(h);
        if (b && b.ok) {
          const y = await b.text(), k = b && b.headers && typeof b.headers.get == "function" && b.headers.get("content-type") || "", _ = (y || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || _.indexOf("<!doctype") !== -1 || _.indexOf("<html") !== -1) {
            if (!s)
              try {
                let q = h;
                try {
                  q = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  q = String(h || "").replace(/^\//, "");
                }
                const C = q.replace(/\.html$/i, ".md");
                try {
                  const O = await ye(C, e);
                  if (O && O.raw)
                    return { data: O, pagePath: C, anchor: a };
                } catch {
                }
                try {
                  const O = await ye(ve, e);
                  if (O && O.raw) {
                    try {
                      cn(O.meta || {}, ve);
                    } catch {
                    }
                    return { data: O, pagePath: ve, anchor: a };
                  }
                } catch {
                }
                try {
                  g = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (_.indexOf('<div id="app"') !== -1 || _.indexOf("nimbi-cms") !== -1 || _.indexOf("nimbi-mount") !== -1 || _.indexOf("nimbi-") !== -1 || _.indexOf("initcms(") !== -1 || _.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(_))
              try {
                let q = h;
                try {
                  q = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  q = String(h || "").replace(/^\//, "");
                }
                const C = q.replace(/\.html$/i, ".md");
                try {
                  const O = await ye(C, e);
                  if (O && O.raw)
                    return { data: O, pagePath: C, anchor: a };
                } catch {
                }
                try {
                  const O = await ye(ve, e);
                  if (O && O.raw) {
                    try {
                      cn(O.meta || {}, ve);
                    } catch {
                    }
                    return { data: O, pagePath: ve, anchor: a };
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
  const u = ls(r);
  try {
    try {
      console.warn("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
    } catch {
    }
  } catch {
  }
  const f = String(n || "").includes(".md") || String(n || "").includes(".html");
  let m = null;
  if (!f)
    try {
      let h = decodeURIComponent(String(n || ""));
      h = me(h), h = St(h), h && !/\.(md|html?)$/i.test(h) && (m = h);
    } catch {
      m = null;
    }
  if (f && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !f && !te.has(r) && !te.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let d = null, p = null, g = null;
  for (const h of u)
    if (h)
      try {
        const b = me(h);
        if (d = await ye(b, e), p = b, m && !te.has(m))
          try {
            let y = "";
            if (d && d.isHtml)
              try {
                const k = typeof DOMParser < "u" ? new DOMParser() : null;
                if (k) {
                  const _ = k.parseFromString(d.raw || "", "text/html"), M = _.querySelector("h1") || _.querySelector("title");
                  M && M.textContent && (y = M.textContent.trim());
                }
              } catch {
              }
            else {
              const k = (d && d.raw || "").match(/^#\s+(.+)$/m);
              k && k[1] && (y = k[1].trim());
            }
            if (y && ge(y) !== m)
              try {
                if (/\.html$/i.test(b)) {
                  const _ = b.replace(/\.html$/i, ".md");
                  if (u.includes(_))
                    try {
                      const M = await ye(_, e);
                      if (M && M.raw)
                        d = M, p = _;
                      else
                        try {
                          const $ = await ye(ve, e);
                          if ($ && $.raw)
                            d = $, p = ve;
                          else {
                            d = null, p = null, g = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          d = null, p = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                    } catch {
                      try {
                        const $ = await ye(ve, e);
                        if ($ && $.raw)
                          d = $, p = ve;
                        else {
                          d = null, p = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        d = null, p = null, g = new Error("slug mismatch for candidate");
                        continue;
                      }
                    }
                  else {
                    d = null, p = null, g = new Error("slug mismatch for candidate");
                    continue;
                  }
                } else {
                  d = null, p = null, g = new Error("slug mismatch for candidate");
                  continue;
                }
              } catch {
                d = null, p = null, g = new Error("slug mismatch for candidate");
                continue;
              }
          } catch {
          }
        try {
          if (!f && /\.html$/i.test(b)) {
            const y = b.replace(/\.html$/i, ".md");
            if (u.includes(y))
              try {
                const _ = String(d && d.raw || "").trim().slice(0, 128).toLowerCase();
                if (d && d.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(_) || _.indexOf('<div id="app"') !== -1 || _.indexOf("nimbi-") !== -1 || _.indexOf("nimbi") !== -1 || _.indexOf("initcms(") !== -1) {
                  let $ = !1;
                  try {
                    const q = await ye(y, e);
                    if (q && q.raw)
                      d = q, p = y, $ = !0;
                    else
                      try {
                        const C = await ye(ve, e);
                        C && C.raw && (d = C, p = ve, $ = !0);
                      } catch {
                      }
                  } catch {
                    try {
                      const C = await ye(ve, e);
                      C && C.raw && (d = C, p = ve, $ = !0);
                    } catch {
                    }
                  }
                  if (!$) {
                    d = null, p = null, g = new Error("site shell detected (candidate HTML rejected)");
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
            console.warn("[router-debug] fetchPageData accepted candidate", { candidate: b, pagePath: p, isHtml: d && d.isHtml, snippet: d && d.raw ? String(d.raw).slice(0, 160) : null });
          } catch {
          }
        } catch {
        }
        break;
      } catch (b) {
        g = b;
        try {
          console.warn("[router] candidate fetch failed", { candidate: h, contentBase: e, err: b && b.message || b });
        } catch {
        }
      }
  if (!d) {
    try {
      console.warn("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: e, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      const h = await ye(ve, e);
      if (h && h.raw) {
        try {
          cn(h.meta || {}, ve);
        } catch {
        }
        return { data: h, pagePath: ve, anchor: a };
      }
    } catch {
    }
    try {
      if (f && String(n || "").toLowerCase().includes(".html"))
        try {
          const h = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", h);
          const b = await fetch(h);
          if (b && b.ok) {
            const y = await b.text(), k = b && b.headers && typeof b.headers.get == "function" && b.headers.get("content-type") || "", _ = (y || "").toLowerCase(), M = k && k.indexOf && k.indexOf("text/html") !== -1 || _.indexOf("<!doctype") !== -1 || _.indexOf("<html") !== -1;
            if (M || console.warn("[router] absolute fetch returned non-HTML", { abs: h, contentType: k, snippet: _.slice(0, 200) }), M) {
              const $ = (y || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(y) || /<h1>\s*index of\b/i.test(y) || $.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(y) || /<h1>\s*directory listing/i.test(y))
                try {
                  console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: h });
                } catch {
                }
              else
                try {
                  const C = h, O = new URL(".", C).toString();
                  try {
                    const S = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (S) {
                      const B = S.parseFromString(y || "", "text/html"), _e = (H, V) => {
                        try {
                          const Z = V.getAttribute(H) || "";
                          if (!Z || /^(https?:)?\/\//i.test(Z) || Z.startsWith("/") || Z.startsWith("#")) return;
                          try {
                            const x = new URL(Z, C).toString();
                            V.setAttribute(H, x);
                          } catch (x) {
                            console.warn("[router] rewrite attribute failed", H, x);
                          }
                        } catch (Z) {
                          console.warn("[router] rewrite helper failed", Z);
                        }
                      }, J = B.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), he = [];
                      for (const H of Array.from(J || []))
                        try {
                          const V = H.tagName ? H.tagName.toLowerCase() : "";
                          if (V === "a") continue;
                          if (H.hasAttribute("src")) {
                            const Z = H.getAttribute("src");
                            _e("src", H);
                            const x = H.getAttribute("src");
                            Z !== x && he.push({ attr: "src", tag: V, before: Z, after: x });
                          }
                          if (H.hasAttribute("href") && V === "link") {
                            const Z = H.getAttribute("href");
                            _e("href", H);
                            const x = H.getAttribute("href");
                            Z !== x && he.push({ attr: "href", tag: V, before: Z, after: x });
                          }
                          if (H.hasAttribute("href") && V !== "link") {
                            const Z = H.getAttribute("href");
                            _e("href", H);
                            const x = H.getAttribute("href");
                            Z !== x && he.push({ attr: "href", tag: V, before: Z, after: x });
                          }
                          if (H.hasAttribute("xlink:href")) {
                            const Z = H.getAttribute("xlink:href");
                            _e("xlink:href", H);
                            const x = H.getAttribute("xlink:href");
                            Z !== x && he.push({ attr: "xlink:href", tag: V, before: Z, after: x });
                          }
                          if (H.hasAttribute("poster")) {
                            const Z = H.getAttribute("poster");
                            _e("poster", H);
                            const x = H.getAttribute("poster");
                            Z !== x && he.push({ attr: "poster", tag: V, before: Z, after: x });
                          }
                          if (H.hasAttribute("srcset")) {
                            const E = (H.getAttribute("srcset") || "").split(",").map((z) => z.trim()).filter(Boolean).map((z) => {
                              const [N, D] = z.split(/\s+/, 2);
                              if (!N || /^(https?:)?\/\//i.test(N) || N.startsWith("/")) return z;
                              try {
                                const R = new URL(N, C).toString();
                                return D ? `${R} ${D}` : R;
                              } catch {
                                return z;
                              }
                            }).join(", ");
                            H.setAttribute("srcset", E);
                          }
                        } catch {
                        }
                      const L = B.documentElement && B.documentElement.outerHTML ? B.documentElement.outerHTML : y;
                      try {
                        he && he.length && console.warn("[router] rewritten asset refs", { abs: h, rewritten: he });
                      } catch {
                      }
                      return { data: { raw: L, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let ce = y;
                  return /<base\s+[^>]*>/i.test(y) || (/<head[^>]*>/i.test(y) ? ce = y.replace(/(<head[^>]*>)/i, `$1<base href="${O}">`) : ce = `<base href="${O}">` + y), { data: { raw: ce, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: y, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
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
        const b = [
          `/assets/${h}.html`,
          `/assets/${h}/index.html`
        ];
        for (const y of b)
          try {
            const k = await fetch(y, { method: "GET" });
            if (k && k.ok)
              return { data: { raw: await k.text(), isHtml: !0 }, pagePath: y.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (h) {
      console.warn("[router] assets fallback failed", h);
    }
    throw new Error("no page data");
  }
  return { data: d, pagePath: p, anchor: a };
}
function kn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ct = kn();
function _i(t) {
  ct = t;
}
var pt = { exec: () => null };
function de(t, e = "") {
  let n = typeof t == "string" ? t : t.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Be.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, e) };
  return i;
}
var us = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Be = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, hs = /^(?:[ \t]*(?:\n|$))+/, ds = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, ps = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Xt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, fs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, er = / {0,3}(?:[*+-]|\d{1,9}[.)])/, xi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Si = de(xi).replace(/bull/g, er).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), gs = de(xi).replace(/bull/g, er).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), tr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ms = /^[^\n]+/, nr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, bs = de(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", nr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ws = de(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, er).getRegex(), _n = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", rr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ys = de("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", rr).replace("tag", _n).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), vi = de(tr).replace("hr", Xt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _n).getRegex(), ks = de(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", vi).getRegex(), ir = { blockquote: ks, code: ds, def: bs, fences: ps, heading: fs, hr: Xt, html: ys, lheading: Si, list: ws, newline: hs, paragraph: vi, table: pt, text: ms }, Nr = de("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Xt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _n).getRegex(), _s = { ...ir, lheading: gs, table: Nr, paragraph: de(tr).replace("hr", Xt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Nr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _n).getRegex() }, xs = { ...ir, html: de(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", rr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: pt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: de(tr).replace("hr", Xt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Si).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ss = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, vs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ai = /^( {2,}|\\)\n(?!\s*$)/, As = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, xn = /[\p{P}\p{S}]/u, ar = /[\s\p{P}\p{S}]/u, Ei = /[^\s\p{P}\p{S}]/u, Es = de(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ar).getRegex(), Li = /(?!~)[\p{P}\p{S}]/u, Ls = /(?!~)[\s\p{P}\p{S}]/u, Cs = /(?:[^\s\p{P}\p{S}]|~)/u, Ci = /(?![*_])[\p{P}\p{S}]/u, Ms = /(?![*_])[\s\p{P}\p{S}]/u, Ts = /(?:[^\s\p{P}\p{S}]|[*_])/u, Rs = de(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", us ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Mi = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, $s = de(Mi, "u").replace(/punct/g, xn).getRegex(), Ps = de(Mi, "u").replace(/punct/g, Li).getRegex(), Ti = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", zs = de(Ti, "gu").replace(/notPunctSpace/g, Ei).replace(/punctSpace/g, ar).replace(/punct/g, xn).getRegex(), Is = de(Ti, "gu").replace(/notPunctSpace/g, Cs).replace(/punctSpace/g, Ls).replace(/punct/g, Li).getRegex(), Os = de("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ei).replace(/punctSpace/g, ar).replace(/punct/g, xn).getRegex(), Ns = de(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ci).getRegex(), Bs = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ds = de(Bs, "gu").replace(/notPunctSpace/g, Ts).replace(/punctSpace/g, Ms).replace(/punct/g, Ci).getRegex(), qs = de(/\\(punct)/, "gu").replace(/punct/g, xn).getRegex(), js = de(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Hs = de(rr).replace("(?:-->|$)", "-->").getRegex(), Us = de("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Hs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), gn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Fs = de(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", gn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ri = de(/^!?\[(label)\]\[(ref)\]/).replace("label", gn).replace("ref", nr).getRegex(), $i = de(/^!?\[(ref)\](?:\[\])?/).replace("ref", nr).getRegex(), Ws = de("reflink|nolink(?!\\()", "g").replace("reflink", Ri).replace("nolink", $i).getRegex(), Br = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, sr = { _backpedal: pt, anyPunctuation: qs, autolink: js, blockSkip: Rs, br: Ai, code: vs, del: pt, delLDelim: pt, delRDelim: pt, emStrongLDelim: $s, emStrongRDelimAst: zs, emStrongRDelimUnd: Os, escape: Ss, link: Fs, nolink: $i, punctuation: Es, reflink: Ri, reflinkSearch: Ws, tag: Us, text: As, url: pt }, Zs = { ...sr, link: de(/^!?\[(label)\]\((.*?)\)/).replace("label", gn).getRegex(), reflink: de(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", gn).getRegex() }, Hn = { ...sr, emStrongRDelimAst: Is, emStrongLDelim: Ps, delLDelim: Ns, delRDelim: Ds, url: de(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Br).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: de(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Br).getRegex() }, Gs = { ...Hn, br: de(Ai).replace("{2,}", "*").getRegex(), text: de(Hn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, an = { normal: ir, gfm: _s, pedantic: xs }, Lt = { normal: sr, gfm: Hn, breaks: Gs, pedantic: Zs }, Qs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Dr = (t) => Qs[t];
function Ke(t, e) {
  if (e) {
    if (Be.escapeTest.test(t)) return t.replace(Be.escapeReplace, Dr);
  } else if (Be.escapeTestNoEncode.test(t)) return t.replace(Be.escapeReplaceNoEncode, Dr);
  return t;
}
function qr(t) {
  try {
    t = encodeURI(t).replace(Be.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function jr(t, e) {
  let n = t.replace(Be.findPipe, (a, s, l) => {
    let o = !1, c = s;
    for (; --c >= 0 && l[c] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Be.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Be.slashPipe, "|");
  return i;
}
function Ct(t, e, n) {
  let i = t.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && t.charAt(i - r - 1) === e; )
    r++;
  return t.slice(0, i - r);
}
function Xs(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) n++;
  else if (t[i] === e[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Ks(t, e = 0) {
  let n = e, i = "";
  for (let r of t) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Hr(t, e, n, i, r) {
  let a = e.href, s = e.title || null, l = t[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function Vs(t, e, n) {
  let i = t.match(n.other.indentCodeCompensation);
  if (i === null) return e;
  let r = i[1];
  return e.split(`
`).map((a) => {
    let s = a.match(n.other.beginningSpace);
    if (s === null) return a;
    let [l] = s;
    return l.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var Ft = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || ct;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Ct(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], i = Vs(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Ct(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: Ct(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = Ct(e[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), s = !0;
        else if (!s) l.push(n[o]);
        else break;
        n = n.slice(o);
        let c = l.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${c}` : c, r = r ? `${r}
${u}` : u;
        let f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = f, n.length === 0) break;
        let m = a.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let d = m, p = d.raw + `
` + n.join(`
`), g = this.blockquote(p);
          a[a.length - 1] = g, i = i.substring(0, i.length - d.raw.length) + g.raw, r = r.substring(0, r.length - d.text.length) + g.text;
          break;
        } else if (m?.type === "list") {
          let d = m, p = d.raw + `
` + n.join(`
`), g = this.list(p);
          a[a.length - 1] = g, i = i.substring(0, i.length - m.raw.length) + g.raw, r = r.substring(0, r.length - d.raw.length) + g.raw, n = p.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: a, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), i = n.length > 1, r = { type: "list", raw: "", ordered: i, start: i ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      let a = this.rules.other.listItemRegex(n), s = !1;
      for (; t; ) {
        let o = !1, c = "", u = "";
        if (!(e = a.exec(t)) || this.rules.block.hr.test(t)) break;
        c = e[0], t = t.substring(c.length);
        let f = Ks(e[2].split(`
`, 1)[0], e[1].length), m = t.split(`
`, 1)[0], d = !f.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, u = f.trimStart()) : d ? p = e[1].length + 1 : (p = f.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, u = f.slice(p), p += e[1].length), d && this.rules.other.blankLine.test(m) && (c += m + `
`, t = t.substring(m.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(p), h = this.rules.other.hrRegex(p), b = this.rules.other.fencesBeginRegex(p), y = this.rules.other.headingBeginRegex(p), k = this.rules.other.htmlBeginRegex(p), _ = this.rules.other.blockquoteBeginRegex(p);
          for (; t; ) {
            let M = t.split(`
`, 1)[0], $;
            if (m = M, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), $ = m) : $ = m.replace(this.rules.other.tabCharGlobal, "    "), b.test(m) || y.test(m) || k.test(m) || _.test(m) || g.test(m) || h.test(m)) break;
            if ($.search(this.rules.other.nonSpaceChar) >= p || !m.trim()) u += `
` + $.slice(p);
            else {
              if (d || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(f) || y.test(f) || h.test(f)) break;
              u += `
` + m;
            }
            d = !m.trim(), c += M + `
`, t = t.substring(M.length + 1), f = $.slice(p);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (s = !0)), r.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), r.raw += c;
      }
      let l = r.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let o of r.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let u = this.lexer.inlineQueue.length - 1; u >= 0; u--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)) {
              this.lexer.inlineQueue[u].src = this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let c = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (c) {
            let u = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
            o.checked = u.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = u.raw + o.tokens[0].raw, o.tokens[0].text = u.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(u)) : o.tokens.unshift({ type: "paragraph", raw: u.raw, text: u.raw, tokens: [u] }) : o.tokens.unshift(u);
          }
        }
        if (!r.loose) {
          let c = o.tokens.filter((f) => f.type === "space"), u = c.length > 0 && c.some((f) => this.rules.other.anyLine.test(f.raw));
          r.loose = u;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let c of o.tokens) c.type === "text" && (c.type = "paragraph");
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
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: i, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = jr(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(jr(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
      return a;
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
        let a = Ct(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = Xs(e[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let s = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + a;
          e[2] = e[2].substring(0, a), e[0] = e[0].substring(0, s).trim(), e[3] = "";
        }
      }
      let i = e[2], r = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(i);
        a && (i = a[1], r = a[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Hr(e, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let i = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[i.toLowerCase()];
      if (!r) {
        let a = n[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return Hr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, c = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = c.exec(e)) != null; ) {
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
        let u = [...i[0]][0].length, f = t.slice(0, r + i.index + u + s);
        if (Math.min(r, s) % 2) {
          let d = f.slice(1, -1);
          return { type: "em", raw: f, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let m = f.slice(2, -2);
        return { type: "strong", raw: f, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return i && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, n = "") {
    let i = this.rules.inline.delLDelim.exec(t);
    if (i && (!i[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = o.exec(e)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          l += s;
          continue;
        }
        if (l -= s, l > 0) continue;
        s = Math.min(s, s + l);
        let c = [...i[0]][0].length, u = t.slice(0, r + i.index + c + s), f = u.slice(r, -r);
        return { type: "del", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, i;
      return e[2] === "@" ? (n = e[1], i = "mailto:" + n) : (n = e[1], i = n), { type: "link", raw: e[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, i;
      if (e[2] === "@") n = e[0], i = "mailto:" + n;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        n = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, je = class Un {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ct, this.options.tokenizer = this.options.tokenizer || new Ft(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Be, block: an.normal, inline: Lt.normal };
    this.options.pedantic ? (n.block = an.pedantic, n.inline = Lt.pedantic) : this.options.gfm && (n.block = an.gfm, this.options.breaks ? n.inline = Lt.breaks : n.inline = Lt.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: an, inline: Lt };
  }
  static lex(e, n) {
    return new Un(n).lex(e);
  }
  static lexInline(e, n) {
    return new Un(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Be.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], i = !1) {
    for (this.options.pedantic && (e = e.replace(Be.tabCharGlobal, "    ").replace(Be.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, n)) ? (e = e.substring(r.raw.length), n.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let s = n.at(-1);
        r.raw.length === 1 && s !== void 0 ? s.raw += `
` : n.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : n.push(r);
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
        let s = n.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, n.push(r));
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
      let a = e;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, l = e.slice(1), o;
        this.options.extensions.startBlock.forEach((c) => {
          o = c.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
        }), s < 1 / 0 && s >= 0 && (a = e.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(a))) {
        let s = n.at(-1);
        i && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(r), i = a.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let s = n.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : n.push(r);
        continue;
      }
      if (e) {
        let s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else throw new Error(s);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let i = e, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, r.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let a;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) a = r[2] ? r[2].length : 0, i = i.slice(0, r.index + a) + "[" + "a".repeat(r[0].length - a - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let s = !1, l = "";
    for (; e; ) {
      s || (l = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((u) => (o = u.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let u = n.at(-1);
        o.type === "text" && u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, i, l)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, i, l)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, f = e.slice(1), m;
        this.options.extensions.startInline.forEach((d) => {
          m = d.call({ lexer: this }, f), typeof m == "number" && m >= 0 && (u = Math.min(u, m));
        }), u < 1 / 0 && u >= 0 && (c = e.substring(0, u + 1));
      }
      if (o = this.tokenizer.inlineText(c)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (l = o.raw.slice(-1)), s = !0;
        let u = n.at(-1);
        u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
        continue;
      }
      if (e) {
        let u = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else throw new Error(u);
      }
    }
    return n;
  }
}, Wt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || ct;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let i = (e || "").match(Be.notSpaceStart)?.[0], r = t.replace(Be.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Ke(i) + '">' + (n ? r : Ke(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Ke(r, !0)) + `</code></pre>
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
    let e = t.ordered, n = t.start, i = "";
    for (let s = 0; s < t.items.length; s++) {
      let l = t.items[s];
      i += this.listitem(l);
    }
    let r = e ? "ol" : "ul", a = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + a + `>
` + i + "</" + r + `>
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
    let i = "";
    for (let r = 0; r < t.rows.length; r++) {
      let a = t.rows[r];
      n = "";
      for (let s = 0; s < a.length; s++) n += this.tablecell(a[s]);
      i += this.tablerow({ text: n });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + i + `</table>
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
    return `<code>${Ke(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let i = this.parser.parseInline(n), r = qr(t);
    if (r === null) return i;
    t = r;
    let a = '<a href="' + t + '"';
    return e && (a += ' title="' + Ke(e) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = qr(t);
    if (r === null) return Ke(n);
    t = r;
    let a = `<img src="${t}" alt="${Ke(n)}"`;
    return e && (a += ` title="${Ke(e)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Ke(t.text);
  }
}, Sn = class {
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
}, He = class Fn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || ct, this.options.renderer = this.options.renderer || new Wt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Sn();
  }
  static parse(e, n) {
    return new Fn(n).parse(e);
  }
  static parseInline(e, n) {
    return new Fn(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
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
  parseInline(e, n = this.renderer) {
    let i = "";
    for (let r = 0; r < e.length; r++) {
      let a = e[r];
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
}, kt = class {
  options;
  block;
  constructor(t) {
    this.options = t || ct;
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
    return this.block ? je.lex : je.lexInline;
  }
  provideParser() {
    return this.block ? He.parse : He.parseInline;
  }
}, Pi = class {
  defaults = kn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = He;
  Renderer = Wt;
  TextRenderer = Sn;
  Lexer = je;
  Tokenizer = Ft;
  Hooks = kt;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let i of t) switch (n = n.concat(e.call(this, i)), i.type) {
      case "table": {
        let r = i;
        for (let a of r.header) n = n.concat(this.walkTokens(a.tokens, e));
        for (let a of r.rows) for (let s of a) n = n.concat(this.walkTokens(s.tokens, e));
        break;
      }
      case "list": {
        let r = i;
        n = n.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = i;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((a) => {
          let s = r[a].flat(1 / 0);
          n = n.concat(this.walkTokens(s, e));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let a = e.renderers[r.name];
          a ? e.renderers[r.name] = function(...s) {
            let l = r.renderer.apply(this, s);
            return l === !1 && (l = a.apply(this, s)), l;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[r.level];
          a ? a.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), i.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new Wt(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, l = n.renderer[s], o = r[s];
          r[s] = (...c) => {
            let u = l.apply(r, c);
            return u === !1 && (u = o.apply(r, c)), u || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Ft(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, l = n.tokenizer[s], o = r[s];
          r[s] = (...c) => {
            let u = l.apply(r, c);
            return u === !1 && (u = o.apply(r, c)), u;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new kt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          kt.passThroughHooks.has(a) ? r[s] = (c) => {
            if (this.defaults.async && kt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let f = await l.call(r, c);
              return o.call(r, f);
            })();
            let u = l.call(r, c);
            return o.call(r, u);
          } : r[s] = (...c) => {
            if (this.defaults.async) return (async () => {
              let f = await l.apply(r, c);
              return f === !1 && (f = await o.apply(r, c)), f;
            })();
            let u = l.apply(r, c);
            return u === !1 && (u = o.apply(r, c)), u;
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
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return je.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return He.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(e) : e, l = await (r.hooks ? await r.hooks.provideLexer() : t ? je.lex : je.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let c = await (r.hooks ? await r.hooks.provideParser() : t ? He.parse : He.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let s = (r.hooks ? r.hooks.provideLexer() : t ? je.lex : je.lexInline)(e, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : t ? He.parse : He.parseInline)(s, r);
        return r.hooks && (l = r.hooks.postprocess(l)), l;
      } catch (s) {
        return a(s);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + Ke(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, mt = new Pi();
function se(t, e) {
  return mt.parse(t, e);
}
se.options = se.setOptions = function(t) {
  return mt.setOptions(t), se.defaults = mt.defaults, _i(se.defaults), se;
};
se.getDefaults = kn;
se.defaults = ct;
se.use = function(...t) {
  return mt.use(...t), se.defaults = mt.defaults, _i(se.defaults), se;
};
se.walkTokens = function(t, e) {
  return mt.walkTokens(t, e);
};
se.parseInline = mt.parseInline;
se.Parser = He;
se.parser = He.parse;
se.Renderer = Wt;
se.TextRenderer = Sn;
se.Lexer = je;
se.lexer = je.lex;
se.Tokenizer = Ft;
se.Hooks = kt;
se.parse = se;
var Ys = se.options, Js = se.setOptions, eo = se.use, to = se.walkTokens, no = se.parseInline, ro = se, io = He.parse, ao = je.lex;
const Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: kt,
  Lexer: je,
  Marked: Pi,
  Parser: He,
  Renderer: Wt,
  TextRenderer: Sn,
  Tokenizer: Ft,
  get defaults() {
    return ct;
  },
  getDefaults: kn,
  lexer: ao,
  marked: se,
  options: Ys,
  parse: ro,
  parseInline: no,
  parser: io,
  setOptions: Js,
  use: eo,
  walkTokens: to
}, Symbol.toStringTag, { value: "Module" })), zi = `function O() {
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
`, Fr = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", zi], { type: "text/javascript;charset=utf-8" });
function so(t) {
  let e;
  try {
    if (e = Fr && (self.URL || self.webkitURL).createObjectURL(Fr), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(zi),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function mn(t) {
  if (t.startsWith("---")) {
    const e = t.indexOf(`
---`, 3);
    if (e !== -1) {
      const n = t.slice(3, e + 0).trim(), i = t.slice(e + 4).trimStart(), r = {};
      return n.split(/\r?\n/).forEach((a) => {
        const s = a.match(/^([^:]+):\s*(.*)$/);
        s && (r[s[1].trim()] = s[2].trim());
      }), { content: i, data: r };
    }
  }
  return { content: t, data: {} };
}
function Ii(t) {
  try {
    if (!t && t !== 0) return "";
    const e = String(t), n = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (i, r) => {
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
    return String(t || "");
  }
}
const Ot = Ur && (se || Ur) || void 0;
let Oe = null;
const oo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function bn() {
  if (Oe) return Oe;
  try {
    try {
      const t = await import(oo + "/lib/core.js");
      Oe = t.default || t;
    } catch {
      Oe = null;
    }
  } catch {
    Oe = null;
  }
  return Oe;
}
Ot && typeof Ot.setOptions == "function" && Ot.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (t, e) => {
    try {
      return Oe && e && typeof Oe.getLanguage == "function" && Oe.getLanguage(e) ? Oe.highlight(t, { language: e }).value : Oe && typeof Oe.getLanguage == "function" && Oe.getLanguage("plaintext") ? Oe.highlight(t, { language: "plaintext" }).value : t;
    } catch {
      return t;
    }
  }
});
onmessage = async (t) => {
  const e = t.data || {};
  try {
    if (e.type === "register") {
      const { name: u, url: f } = e;
      try {
        if (!await bn()) {
          postMessage({ type: "register-error", name: u, error: "hljs unavailable" });
          return;
        }
        const d = await import(f), p = d.default || d;
        Oe.registerLanguage(u, p), postMessage({ type: "registered", name: u });
      } catch (m) {
        postMessage({ type: "register-error", name: u, error: String(m) });
      }
      return;
    }
    if (e.type === "detect") {
      const u = e.md || "", f = e.supported || [], m = /* @__PURE__ */ new Set(), d = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let p;
      for (; p = d.exec(u); )
        if (p[1]) {
          const g = String(p[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && m.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && m.add(g), f && f.length)
            try {
              f.indexOf(g) !== -1 && m.add(g);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(m) });
      return;
    }
    const { id: n, md: i } = e, { content: r, data: a } = mn(i || "");
    await bn().catch(() => {
    });
    let s = Ot.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), c = (u) => {
      try {
        return String(u || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, f, m, d) => {
      const p = Number(f);
      let g = d.replace(/<[^>]+>/g, "").trim();
      try {
        g = Ii(g);
      } catch {
      }
      let h = null;
      const b = (m || "").match(/\sid="([^"]+)"/);
      b && (h = b[1]);
      const y = h || c(g) || "heading", _ = (o.get(y) || 0) + 1;
      o.set(y, _);
      const M = _ === 1 ? y : y + "-" + _;
      l.push({ level: p, text: g, id: M });
      const $ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, q = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", C = ($[p] + " " + q).trim(), ce = ((m || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${M}" class="${C}"`).trim();
      return `<h${p} ${ce}>${d}</h${p}>`;
    }), s = s.replace(/<img([^>]*)>/g, (u, f) => /\bloading=/.test(f) ? `<img${f}>` : /\bdata-want-lazy=/.test(f) ? `<img${f}>` : `<img${f} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: e.id, error: String(n) });
  }
};
async function lo(t) {
  try {
    if (t && t.type === "register") {
      const { name: o, url: c } = t;
      try {
        if (!await bn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const f = await import(c), m = f.default || f;
        return Oe.registerLanguage(o, m), { type: "registered", name: o };
      } catch (u) {
        return { type: "register-error", name: o, error: String(u) };
      }
    }
    if (t && t.type === "detect") {
      const o = t.md || "", c = t.supported || [], u = /* @__PURE__ */ new Set(), f = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let m;
      for (; m = f.exec(o); )
        if (m[1]) {
          const d = String(m[1]).toLowerCase();
          if (!d) continue;
          if (d.length >= 5 && d.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(d) && u.add(d), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(d) && u.add(d), c && c.length)
            try {
              c.indexOf(d) !== -1 && u.add(d);
            } catch {
            }
        }
      return { id: t.id, result: Array.from(u) };
    }
    const e = t && t.id, { content: n, data: i } = mn(t && t.md || "");
    await bn().catch(() => {
    });
    let r = Ot.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, c, u, f) => {
      const m = Number(c);
      let d = f.replace(/<[^>]+>/g, "").trim();
      try {
        d = Ii(d);
      } catch {
      }
      let p = null;
      const g = (u || "").match(/\sid="([^"]+)"/);
      g && (p = g[1]);
      const h = p || l(d) || "heading", y = (s.get(h) || 0) + 1;
      s.set(h, y);
      const k = y === 1 ? h : h + "-" + y;
      a.push({ level: m, text: d, id: k });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, M = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", $ = (_[m] + " " + M).trim(), C = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${k}" class="${$}"`).trim();
      return `<h${m} ${C}>${f}</h${m}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { id: e, result: { html: r, meta: i || {}, toc: a } };
  } catch (e) {
    return { id: t && t.id, error: String(e) };
  }
}
const In = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, co = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function uo() {
  if (typeof Worker < "u")
    try {
      return new so();
    } catch {
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
          const r = { data: await lo(n) }(t.message || []).forEach((a) => a(r));
        } catch {
          const r = { data: { id: n && n.id } }(t.message || []).forEach((a) => a(r));
        }
      }, 0);
    },
    terminate() {
      Object.keys(t).forEach((n) => t[n].length = 0);
    }
  };
}
const Oi = si(() => uo(), "markdown", co), Wr = typeof DOMParser < "u" ? new DOMParser() : null, ft = () => Oi.get(), or = (t) => Oi.send(t, 3e3), Je = [];
function Wn(t) {
  if (t && (typeof t == "object" || typeof t == "function")) {
    Je.push(t);
    try {
      se.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function ho(t) {
  Je.length = 0, Array.isArray(t) && Je.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Je.forEach((e) => se.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function wn(t) {
  if (Je && Je.length) {
    let { content: i, data: r } = mn(t || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => In[l] || s);
    } catch {
    }
    se.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      Je.forEach((s) => se.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = se.parse(i);
    try {
      const s = Wr || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), c = [], u = /* @__PURE__ */ new Set(), f = (d) => {
          try {
            return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, m = (d) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, g = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[d] + " " + g).trim();
        };
        o.forEach((d) => {
          try {
            const p = Number(d.tagName.substring(1)), g = (d.textContent || "").trim();
            let h = f(g) || "heading", b = h, y = 2;
            for (; u.has(b); )
              b = h + "-" + y, y += 1;
            u.add(b), d.id = b, d.className = m(p), c.push({ level: p, text: g, id: b });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((d) => {
            try {
              const p = d.getAttribute && d.getAttribute("loading"), g = d.getAttribute && d.getAttribute("data-want-lazy");
              !p && !g && d.setAttribute && d.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((d) => {
            try {
              const p = d.getAttribute && d.getAttribute("class") || d.className || "", g = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (g)
                try {
                  d.setAttribute && d.setAttribute("class", g);
                } catch {
                  d.className = g;
                }
              else
                try {
                  d.removeAttribute && d.removeAttribute("class");
                } catch {
                  d.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        return { html: l.body.innerHTML, meta: r || {}, toc: c };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let e;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Ni);
      e = i.initRendererWorker && i.initRendererWorker();
    } catch {
      e = ft && ft();
    }
  else
    e = ft && ft();
  try {
    t = String(t || "").replace(/:([^:\s]+):/g, (i, r) => In[r] || i);
  } catch {
  }
  try {
    if (typeof pe < "u" && pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext") && /```\s*\n/.test(String(t || ""))) {
      let { content: i, data: r } = mn(t || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (c, u) => In[u] || c);
      } catch {
      }
      se.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (c, u) => {
        try {
          return u && pe.getLanguage && pe.getLanguage(u) ? pe.highlight(c, { language: u }).value : pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext") ? pe.highlight(c, { language: "plaintext" }).value : c;
        } catch {
          return c;
        }
      } });
      let a = se.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (c, u) => {
          try {
            if (u && pe && typeof pe.highlight == "function")
              try {
                const f = pe.highlight(u, { language: "plaintext" });
                return `<pre><code>${f && f.value ? f.value : f}</code></pre>`;
              } catch {
                try {
                  if (pe && typeof pe.highlightElement == "function") {
                    const m = { innerHTML: u };
                    return pe.highlightElement(m), `<pre><code>${m.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return c;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (c) => {
        try {
          return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, f, m) => {
        const d = Number(u), p = m.replace(/<[^>]+>/g, "").trim();
        let g = o(p) || "heading", h = g, b = 2;
        for (; l.has(h); )
          h = g + "-" + b, b += 1;
        l.add(h), s.push({ level: d, text: p, id: h });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, k = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", _ = (y[d] + " " + k).trim(), $ = ((f || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${h}" class="${_}"`).trim();
        return `<h${d} ${$}>${m}</h${d}>`;
      }), a = a.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!e) throw new Error("renderer worker required but unavailable");
  const n = await or({ type: "render", md: t });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const c = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, u = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (c[o] + " " + u).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, c, u, f) => {
      const m = Number(c), d = f.replace(/<[^>]+>/g, "").trim(), p = (u || "").match(/\sid="([^"]+)"/), g = p ? p[1] : a(d) || "heading", b = (i.get(g) || 0) + 1;
      i.set(g, b);
      const y = b === 1 ? g : g + "-" + b;
      r.push({ level: m, text: d, id: y });
      const k = s(m), M = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${k}"`).trim();
      return `<h${m} ${M}>${f}</h${m}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const c = Wr || (typeof DOMParser < "u" ? new DOMParser() : null);
        if (c) {
          const u = c.parseFromString(l, "text/html");
          u.querySelectorAll("img").forEach((m) => {
            try {
              const d = m.getAttribute("src") || "";
              (d ? new URL(d, location.href).toString() : "") === o && m.remove();
            } catch {
            }
          }), l = u.body.innerHTML;
        } else
          try {
            const u = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            l = l.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`, "g"), "");
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
function Nt(t, e) {
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
  for (; s = i.exec(t); )
    if (s[1]) {
      const l = s[1].toLowerCase();
      if (Jr.has(l) || e && e.size && l.length < 3 && !e.has(l) && !(qe && qe[l] && e.has(qe[l]))) continue;
      if (e && e.size) {
        if (e.has(l)) {
          const c = e.get(l);
          c && n.add(c);
          continue;
        }
        if (qe && qe[l]) {
          const c = qe[l];
          if (e.has(c)) {
            const u = e.get(c) || c;
            n.add(u);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function Zn(t, e) {
  if (Je && Je.length || typeof process < "u" && process.env && process.env.VITEST) return Nt(t || "", e);
  if (ft && ft())
    try {
      const i = e && e.size ? Array.from(e.keys()) : [], r = await or({ type: "detect", md: String(t || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return Nt(t || "", e);
}
const Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: or,
  addMarkdownExtension: Wn,
  detectFenceLanguages: Nt,
  detectFenceLanguagesAsync: Zn,
  initRendererWorker: ft,
  markdownPlugins: Je,
  parseMarkdownToHtml: wn,
  setMarkdownExtensions: ho
}, Symbol.toStringTag, { value: "Module" })), po = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
onmessage = async (t) => {
  const e = t.data || {};
  try {
    if (e.type === "rewriteAnchors") {
      const { id: n, html: i, contentBase: r, pagePath: a } = e;
      try {
        const l = new DOMParser().parseFromString(i || "", "text/html"), o = l.body;
        await lr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: e.id, error: String(n) });
  }
};
async function fo(t) {
  try {
    if (t && t.type === "rewriteAnchors") {
      const { id: e, html: n, contentBase: i, pagePath: r } = t;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), l = s.body;
        return await lr(l, i, r, { canonical: !0 }), { id: e, result: s.body.innerHTML };
      } catch (a) {
        return { id: e, error: String(a) };
      }
    }
    return { id: t && t.id, error: "unsupported message" };
  } catch (e) {
    return { id: t && t.id, error: String(e) };
  }
}
function We(t, e = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Mr(t, e);
  } catch {
    return Mr(t, e);
  }
}
const go = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function mo(...t) {
  try {
    go && console && typeof console.warn == "function" && console.warn(...t);
  } catch {
  }
}
function bo(t, e) {
  try {
    return new URL(t, e).pathname;
  } catch {
    try {
      return new URL(t, typeof location < "u" ? location.href : "http://localhost/").pathname;
    } catch {
      try {
        return (String(e || "").replace(/\/$/, "") + "/" + String(t || "").replace(/^\//, "")).replace(/\/\\+/g, "/");
      } catch {
        return String(t || "");
      }
    }
  }
}
function wo(t, e) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = t("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  return r.className = "menu-list", e.forEach((a) => {
    const s = document.createElement("li"), l = document.createElement("a");
    try {
      const o = String(a.path || "");
      try {
        l.setAttribute("href", Ae(o));
      } catch {
        o && o.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(o)) : l.setAttribute("href", We(o));
      }
    } catch {
      l.setAttribute("href", "#" + a.path);
    }
    if (l.textContent = a.name, s.appendChild(l), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((c) => {
        const u = document.createElement("li"), f = document.createElement("a");
        try {
          const m = String(c.path || "");
          try {
            f.setAttribute("href", Ae(m));
          } catch {
            m && m.indexOf("/") === -1 ? f.setAttribute("href", "#" + encodeURIComponent(m)) : f.setAttribute("href", We(m));
          }
        } catch {
          f.setAttribute("href", "#" + c.path);
        }
        f.textContent = c.name, u.appendChild(f), o.appendChild(u);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function yo(t, e, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const l = {};
    (e || []).forEach((o) => {
      try {
        if (!o || o.level === 1) return;
        const c = Number(o.level) >= 2 ? Number(o.level) : 2, u = document.createElement("li"), f = document.createElement("a"), m = Ta(o.text || ""), d = o.id || ge(m);
        f.textContent = m;
        try {
          const b = String(n || "").replace(/^[\\.\\/]+/, ""), y = b && Q && Q.has && Q.has(b) ? Q.get(b) : b;
          y ? f.href = Ae(y, d) : f.href = `#${encodeURIComponent(d)}`;
        } catch (b) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", b), f.href = `#${encodeURIComponent(d)}`;
        }
        if (u.appendChild(f), c === 2) {
          a.appendChild(u), l[2] = u, Object.keys(l).forEach((b) => {
            Number(b) > 2 && delete l[b];
          });
          return;
        }
        let p = c - 1;
        for (; p > 2 && !l[p]; ) p--;
        p < 2 && (p = 2);
        let g = l[p];
        if (!g) {
          a.appendChild(u), l[c] = u;
          return;
        }
        let h = g.querySelector("ul");
        h || (h = document.createElement("ul"), g.appendChild(h)), h.appendChild(u), l[c] = u;
      } catch (c) {
        console.warn("[htmlBuilder] buildTocElement item failed", c, o);
      }
    });
  } catch (l) {
    console.warn("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Bi(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ge(n.textContent || ""));
  });
}
function ko(t, e, n) {
  try {
    const i = t.querySelectorAll("img");
    if (i && i.length) {
      const r = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      i.forEach((a) => {
        const s = a.getAttribute("src") || "";
        if (s && !(/^(https?:)?\/\//.test(s) || s.startsWith("/")))
          try {
            const l = new URL(r + s, n).toString();
            a.src = l;
            try {
              a.getAttribute("loading") || a.setAttribute("data-want-lazy", "1");
            } catch (o) {
              console.warn("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (l) {
            console.warn("[htmlBuilder] resolve image src failed", l);
          }
      });
    }
  } catch (i) {
    console.warn("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function Zr(t, e, n) {
  try {
    const i = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
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
    const a = t.querySelectorAll("*");
    for (const s of Array.from(a || []))
      try {
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (c) => {
          try {
            const u = s.getAttribute(c) || "";
            if (!u || /^(https?:)?\/\//i.test(u) || u.startsWith("/") || u.startsWith("#")) return;
            try {
              s.setAttribute(c, new URL(u, r).toString());
            } catch (f) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", c, u, f);
            }
          } catch (u) {
            console.warn("[htmlBuilder] rewriteAttr failed", u);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const f = (s.getAttribute("srcset") || "").split(",").map((m) => m.trim()).filter(Boolean).map((m) => {
            const [d, p] = m.split(/\s+/, 2);
            if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/")) return m;
            try {
              const g = new URL(d, r).toString();
              return p ? `${g} ${p}` : g;
            } catch {
              return m;
            }
          }).join(", ");
          s.setAttribute("srcset", f);
        }
      } catch (l) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Gr = "", On = null, Qr = "";
async function lr(t, e, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = t.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (e === Gr && On)
      a = On, s = Qr;
    else {
      try {
        a = new URL(e, location.href), s = gt(a.pathname);
      } catch {
        try {
          a = new URL(e, location.href), s = gt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Gr = e, On = a, Qr = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], c = /* @__PURE__ */ new Set(), u = [];
    for (const f of Array.from(r))
      try {
        try {
          if (f.closest && f.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const m = f.getAttribute("href") || "";
        if (!m || ai(m)) continue;
        try {
          if (m.startsWith("?") || m.indexOf("?") !== -1)
            try {
              const p = new URL(m, e || location.href), g = p.searchParams.get("page");
              if (g && g.indexOf("/") === -1 && n) {
                const h = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (h) {
                  const b = me(h + g), y = i && i.canonical ? Ae(b, p.hash ? p.hash.replace(/^#/, "") : null) : We(b, p.hash ? p.hash.replace(/^#/, "") : null);
                  f.setAttribute("href", y);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (m.startsWith("/") && !m.endsWith(".md")) continue;
        const d = m.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (d) {
          let p = d[1];
          const g = d[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const h = new URL(p, e).pathname;
            let b = h.startsWith(s) ? h.slice(s.length) : h;
            b = me(b), o.push({ node: f, mdPathRaw: p, frag: g, rel: b }), Q.has(b) || l.add(b);
          } catch (h) {
            console.warn("[htmlBuilder] resolve mdPath failed", h);
          }
          continue;
        }
        try {
          let p = m;
          !m.startsWith("/") && n && (m.startsWith("#") ? p = n + m : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + m);
          const h = new URL(p, e).pathname || "";
          if (h && h.indexOf(s) !== -1) {
            let b = h.startsWith(s) ? h.slice(s.length) : h;
            if (b = me(b), b = St(b), b || (b = "_home"), !b.endsWith(".md")) {
              let y = null;
              try {
                if (Q && Q.has && Q.has(b))
                  y = Q.get(b);
                else
                  try {
                    const k = String(b || "").replace(/^.*\//, "");
                    k && Q.has && Q.has(k) && (y = Q.get(k));
                  } catch (k) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", k);
                  }
              } catch (k) {
                console.warn("[htmlBuilder] mdToSlug access check failed", k);
              }
              if (!y)
                try {
                  const k = String(b || "").replace(/^.*\//, "");
                  for (const [_, M] of te || [])
                    if (M === b || M === k) {
                      y = _;
                      break;
                    }
                } catch {
                }
              if (y) {
                const k = i && i.canonical ? Ae(y, null) : We(y);
                f.setAttribute("href", k);
              } else {
                let k = b;
                try {
                  /\.[^\/]+$/.test(String(b || "")) || (k = String(b || "") + ".html");
                } catch {
                  k = b;
                }
                c.add(k), u.push({ node: f, rel: k });
              }
            }
          }
        } catch (p) {
          console.warn("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (m) {
        console.warn("[htmlBuilder] processing anchor failed", m);
      }
    l.size && await Promise.all(Array.from(l).map(async (f) => {
      try {
        try {
          const d = String(f).match(/([^\/]+)\.md$/), p = d && d[1];
          if (p && te.has(p)) {
            try {
              const g = te.get(p);
              if (g)
                try {
                  Q.set(g, p);
                } catch (h) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", h);
                }
            } catch (g) {
              console.warn("[htmlBuilder] reading slugToMd failed", g);
            }
            return;
          }
        } catch (d) {
          console.warn("[htmlBuilder] basename slug lookup failed", d);
        }
        const m = await ye(f, e);
        if (m && m.raw) {
          const d = (m.raw || "").match(/^#\s+(.+)$/m);
          if (d && d[1]) {
            const p = ge(d[1].trim());
            if (p)
              try {
                te.set(p, f), Q.set(f, p);
              } catch (g) {
                console.warn("[htmlBuilder] setting slug mapping failed", g);
              }
          }
        }
      } catch (m) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", m);
      }
    })), c.size && await Promise.all(Array.from(c).map(async (f) => {
      try {
        const m = await ye(f, e);
        if (m && m.raw)
          try {
            const p = (cr || new DOMParser()).parseFromString(m.raw, "text/html"), g = p.querySelector("title"), h = p.querySelector("h1"), b = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : h && h.textContent ? h.textContent.trim() : null;
            if (b) {
              const y = ge(b);
              if (y)
                try {
                  te.set(y, f), Q.set(f, y);
                } catch (k) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", k);
                }
            }
          } catch (d) {
            console.warn("[htmlBuilder] parse fetched HTML failed", d);
          }
      } catch (m) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", m);
      }
    }));
    for (const f of o) {
      const { node: m, frag: d, rel: p } = f;
      let g = null;
      try {
        Q.has(p) && (g = Q.get(p));
      } catch (h) {
        console.warn("[htmlBuilder] mdToSlug access failed", h);
      }
      if (g) {
        const h = i && i.canonical ? Ae(g, d) : We(g, d);
        m.setAttribute("href", h);
      } else {
        const h = i && i.canonical ? Ae(p, d) : We(p, d);
        m.setAttribute("href", h);
      }
    }
    for (const f of u) {
      const { node: m, rel: d } = f;
      let p = null;
      try {
        Q.has(d) && (p = Q.get(d));
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", g);
      }
      if (!p)
        try {
          const g = String(d || "").replace(/^.*\//, "");
          Q.has(g) && (p = Q.get(g));
        } catch (g) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
        }
      if (p) {
        const g = i && i.canonical ? Ae(p, null) : We(p);
        m.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? Ae(d, null) : We(d);
        m.setAttribute("href", g);
      }
    }
  } catch (r) {
    console.warn("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function _o(t, e, n, i) {
  const r = e.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    let l = "";
    try {
      t && t.meta && t.meta.title && (l = String(t.meta.title).trim());
    } catch {
    }
    if (!l && a && (l = a), !l)
      try {
        const o = e.querySelector("h2");
        o && o.textContent && (l = String(o.textContent).trim());
      } catch {
      }
    !l && n && (l = String(n)), l && (s = ge(l)), s || (s = "_home");
    try {
      n && (te.set(s, n), Q.set(n, s));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const c = Ze(typeof location < "u" ? location.href : "");
          c && c.anchor && c.page && String(c.page) === String(s) ? o = c.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", We(s, o));
      } catch (c) {
        console.warn("[htmlBuilder] computeSlug history replace failed", c);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    console.warn("[htmlBuilder] computeSlug failed", l);
  }
  try {
    if (t && t.meta && t.meta.title && r) {
      const l = String(t.meta.title).trim();
      if (l && l !== a) {
        try {
          s && (r.id = s);
        } catch {
        }
        try {
          if (Array.isArray(t.toc))
            for (const o of t.toc)
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
async function xo(t, e) {
  if (!t || !t.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(t || []))
    try {
      const c = o.getAttribute("href") || "";
      if (!c) continue;
      let m = me(c).split(/::|#/, 2)[0];
      try {
        const p = m.indexOf("?");
        p !== -1 && (m = m.slice(0, p));
      } catch {
      }
      if (!m || (m.includes(".") || (m = m + ".html"), !/\.html(?:$|[?#])/.test(m) && !m.toLowerCase().endsWith(".html"))) continue;
      const d = m;
      try {
        if (Q && Q.has && Q.has(d)) continue;
      } catch (p) {
        console.warn("[htmlBuilder] mdToSlug check failed", p);
      }
      try {
        let p = !1;
        for (const g of te.values())
          if (g === d) {
            p = !0;
            break;
          }
        if (p) continue;
      } catch (p) {
        console.warn("[htmlBuilder] slugToMd iteration failed", p);
      }
      n.add(d);
    } catch (c) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", c);
    }
  if (!n.size) return;
  const i = async (o) => {
    try {
      const c = await ye(o, e);
      if (c && c.raw)
        try {
          const f = (cr || new DOMParser()).parseFromString(c.raw, "text/html"), m = f.querySelector("title"), d = f.querySelector("h1"), p = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : d && d.textContent ? d.textContent.trim() : null;
          if (p) {
            const g = ge(p);
            if (g)
              try {
                te.set(g, o), Q.set(o, g);
              } catch (h) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", h);
              }
          }
        } catch (u) {
          console.warn("[htmlBuilder] parse HTML title failed", u);
        }
    } catch (c) {
      console.warn("[htmlBuilder] fetchAndExtract failed", c);
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
async function So(t, e) {
  if (!t || !t.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(e, typeof location < "u" ? location.href : "http://localhost/");
    r = gt(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(t || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = me(l[1]);
        try {
          let c;
          try {
            c = bo(o, e);
          } catch (f) {
            c = o, console.warn("[htmlBuilder] resolve mdPath URL failed", f);
          }
          const u = c && r && c.startsWith(r) ? c.slice(r.length) : String(c || "").replace(/^\//, "");
          n.push({ rel: u }), Q.has(u) || i.add(u);
        } catch (c) {
          console.warn("[htmlBuilder] rewriteAnchors failed", c);
        }
        continue;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  i.size && await Promise.all(Array.from(i).map(async (a) => {
    try {
      const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
      if (l && te.has(l)) {
        try {
          const o = te.get(l);
          o && Q.set(o, l);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", s);
    }
    try {
      const s = await ye(a, e);
      if (s && s.raw) {
        const l = (s.raw || "").match(/^#\s+(.+)$/m);
        if (l && l[1]) {
          const o = ge(l[1].trim());
          if (o)
            try {
              te.set(o, a), Q.set(a, o);
            } catch (c) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", c);
            }
        }
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", s);
    }
  }));
}
const cr = typeof DOMParser < "u" ? new DOMParser() : null;
function Nn(t) {
  try {
    const n = (cr || new DOMParser()).parseFromString(t || "", "text/html");
    Bi(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (c) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", c);
        }
      });
    } catch (l) {
      console.warn("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", c = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const u = (c[1] || "").toLowerCase(), f = le.size && (le.get(u) || le.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await Ht(f);
              } catch (m) {
                console.warn("[htmlBuilder] registerLanguage failed", m);
              }
            })();
          } catch (m) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", m);
          }
        } else
          try {
            if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
              const u = pe.highlight ? pe.highlight(l.textContent || "", { language: "plaintext" }) : null;
              u && u.value && (l.innerHTML = u.value);
            }
          } catch (u) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", u);
          }
      } catch (o) {
        console.warn("[htmlBuilder] code element processing failed", o);
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
  } catch (e) {
    return console.warn("[htmlBuilder] parseHtml failed", e), { html: t || "", meta: {}, toc: [] };
  }
}
async function vo(t) {
  const e = Zn ? await Zn(t || "", le) : Nt(t || "", le), n = new Set(e), i = [];
  for (const r of n)
    try {
      const a = le.size && (le.get(r) || le.get(String(r).toLowerCase())) || r;
      try {
        i.push(Ht(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Ht(r));
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
async function Ao(t) {
  if (await vo(t), wn) {
    const e = await wn(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Eo(t, e, n, i, r) {
  let a = null;
  if (e.isHtml)
    try {
      const f = typeof DOMParser < "u" ? new DOMParser() : null;
      if (f) {
        const m = f.parseFromString(e.raw || "", "text/html");
        try {
          Zr(m.body, n, r);
        } catch (d) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", d);
        }
        a = Nn(m.documentElement && m.documentElement.outerHTML ? m.documentElement.outerHTML : e.raw || "");
      } else
        a = Nn(e.raw || "");
    } catch {
      a = Nn(e.raw || "");
    }
  else
    a = await Ao(e.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Zr(s, n, r);
  } catch (f) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", f);
  }
  try {
    Bi(s);
  } catch (f) {
    console.warn("[htmlBuilder] addHeadingIds failed", f);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((m) => {
      try {
        const d = m.getAttribute && m.getAttribute("class") || m.className || "", p = String(d || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (p)
          try {
            m.setAttribute && m.setAttribute("class", p);
          } catch (g) {
            m.className = p, console.warn("[htmlBuilder] set element class failed", g);
          }
        else
          try {
            m.removeAttribute && m.removeAttribute("class");
          } catch (g) {
            m.className = "", console.warn("[htmlBuilder] remove element class failed", g);
          }
      } catch (d) {
        console.warn("[htmlBuilder] code element cleanup failed", d);
      }
    });
  } catch (f) {
    console.warn("[htmlBuilder] processing code elements failed", f);
  }
  try {
    va(s);
  } catch (f) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", f);
  }
  ko(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((m) => {
      try {
        const d = m.parentElement;
        if (!d || d.tagName.toLowerCase() !== "p" || d.childNodes.length !== 1) return;
        const p = document.createElement("figure");
        p.className = "image", d.replaceWith(p), p.appendChild(m);
      } catch {
      }
    });
  } catch (f) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", f);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((m) => {
      try {
        if (m.classList)
          m.classList.contains("table") || m.classList.add("table");
        else {
          const d = m.getAttribute && m.getAttribute("class") ? m.getAttribute("class") : "", p = String(d || "").split(/\s+/).filter(Boolean);
          p.indexOf("table") === -1 && p.push("table");
          try {
            m.setAttribute && m.setAttribute("class", p.join(" "));
          } catch {
            m.className = p.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (f) {
    console.warn("[htmlBuilder] add Bulma table class failed", f);
  }
  const { topH1: l, h1Text: o, slugKey: c } = _o(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const m = a.meta.author ? String(a.meta.author).trim() : "", d = a.meta.date ? String(a.meta.date).trim() : "";
      let p = "";
      try {
        const h = new Date(d);
        d && !isNaN(h.getTime()) ? p = h.toLocaleDateString() : p = d;
      } catch {
        p = d;
      }
      const g = [];
      if (m && g.push(m), p && g.push(p), g.length) {
        const h = document.createElement("p"), b = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", y = g.slice(1);
        if (h.className = "nimbi-article-subtitle is-6 has-text-grey-light", b) {
          const k = document.createElement("span");
          k.className = "nimbi-article-author", k.textContent = b, h.appendChild(k);
        }
        if (y.length) {
          const k = document.createElement("span");
          k.className = "nimbi-article-meta", k.textContent = y.join(" • "), h.appendChild(k);
        }
        try {
          l.parentElement.insertBefore(h, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", h);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await To(s, r, n);
  } catch (f) {
    mo("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", f), await lr(s, r, n);
  }
  const u = yo(t, a.toc, n);
  return { article: s, parsed: a, toc: u, topH1: l, h1Text: o, slugKey: c };
}
function Lo(t) {
  if (!(!t || !t.querySelectorAll))
    try {
      const e = Array.from(t.querySelectorAll("script"));
      for (const n of e)
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
function Xr(t, e, n) {
  t && (t.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), t && t.appendChild && t.appendChild(i);
  try {
    try {
      cn({ title: e && e("notFound") || "Not Found", description: e && e("notFoundDescription") || "" }, ve, e && e("notFound") || "Not Found", e && e("notFoundDescription") || "");
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
const Di = Pa(() => {
  const t = Rt(po);
  if (t)
    try {
      if (!(typeof process < "u" && process.env && process.env.VITEST)) return t;
    } catch {
      return t;
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
          const r = { data: await fo(n) };
          (e.message || []).forEach((a) => a(r));
        } catch (i) {
          const r = { data: { id: n && n.id, error: String(i) } };
          (e.message || []).forEach((a) => a(r));
        }
      }, 0);
    },
    terminate() {
      Object.keys(e).forEach((n) => e[n].length = 0);
    }
  };
}, "anchor");
function Co() {
  return Di.get();
}
function Mo(t) {
  return Di.send(t, 2e3);
}
async function To(t, e, n) {
  if (!Co()) throw new Error("anchor worker unavailable");
  if (!t || typeof t.innerHTML != "string") throw new Error("invalid article element");
  const r = String(t.innerHTML), a = await Mo({ type: "rewriteAnchors", html: r, contentBase: e, pagePath: n });
  if (a && typeof a == "string")
    try {
      t.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Ro(t) {
  try {
    t.addEventListener("click", (e) => {
      const n = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = Ze(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        e.preventDefault();
        let l = null;
        try {
          history && history.state && history.state.page && (l = history.state.page);
        } catch (o) {
          l = null, console.warn("[htmlBuilder] access history.state failed", o);
        }
        try {
          l || (l = new URL(location.href).searchParams.get("page"));
        } catch (o) {
          console.warn("[htmlBuilder] parse current location failed", o);
        }
        if (!a && s || a && l && String(a) === String(l)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: l || a }, "", We(l || a, s));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
          } catch (o) {
            console.warn("[htmlBuilder] update history for anchor failed", o);
          }
          try {
            e.stopImmediatePropagation && e.stopImmediatePropagation(), e.stopPropagation && e.stopPropagation();
          } catch (o) {
            console.warn("[htmlBuilder] stopPropagation failed", o);
          }
          try {
            Gn(s);
          } catch (o) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", We(a, s));
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
  } catch (e) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", e);
  }
}
function Gn(t) {
  const e = document.querySelector(".nimbi-cms") || null;
  if (t) {
    const n = document.getElementById(t);
    if (n)
      try {
        const i = () => {
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
      e && e.scrollTo ? e.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        console.warn("[htmlBuilder] window.scrollTo failed", i);
      }
      console.warn("[htmlBuilder] scroll to top failed", n);
    }
}
function $o(t, e, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((g) => typeof g == "string" ? g : ""), o = i || document.querySelector(".nimbi-cms"), c = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), f = a || document.querySelector(".nimbi-nav-wrap");
    let d = document.querySelector(".nimbi-scroll-top");
    if (!d) {
      d = document.createElement("button"), d.className = "nimbi-scroll-top button is-primary is-rounded is-small", d.setAttribute("aria-label", l("scrollToTop")), d.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(d) : o && o.appendChild ? o.appendChild(d) : c && c.appendChild ? c.appendChild(d) : document.body.appendChild(d);
      } catch {
        try {
          document.body.appendChild(d);
        } catch (h) {
          console.warn("[htmlBuilder] append scroll top button failed", h);
        }
      }
      try {
        try {
          ti(d);
        } catch {
        }
      } catch (g) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", g);
      }
      d.addEventListener("click", () => {
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
    const p = f && f.querySelector ? f.querySelector(".menu-label") : null;
    if (e) {
      if (!d._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const g = globalThis.IntersectionObserver, h = new g((b) => {
            for (const y of b)
              y.target instanceof Element && (y.isIntersecting ? (d.classList.remove("show"), p && p.classList.remove("show")) : (d.classList.add("show"), p && p.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          d._nimbiObserver = h;
        } else
          d._nimbiObserver = null;
      try {
        d._nimbiObserver && typeof d._nimbiObserver.disconnect == "function" && d._nimbiObserver.disconnect();
      } catch (g) {
        console.warn("[htmlBuilder] observer disconnect failed", g);
      }
      try {
        d._nimbiObserver && typeof d._nimbiObserver.observe == "function" && d._nimbiObserver.observe(e);
      } catch (g) {
        console.warn("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const h = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, b = e.getBoundingClientRect();
            !(b.bottom < h.top || b.top > h.bottom) ? (d.classList.remove("show"), p && p.classList.remove("show")) : (d.classList.add("show"), p && p.classList.add("show"));
          } catch (h) {
            console.warn("[htmlBuilder] checkIntersect failed", h);
          }
        };
        g(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(g, 100);
      } catch (g) {
        console.warn("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      d.classList.remove("show"), p && p.classList.remove("show");
      const g = i instanceof Element ? i : r instanceof Element ? r : window, h = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (d.classList.add("show"), p && p.classList.add("show")) : (d.classList.remove("show"), p && p.classList.remove("show"));
        } catch (b) {
          console.warn("[htmlBuilder] onScroll handler failed", b);
        }
      };
      dn(() => g.addEventListener("scroll", h)), h();
    }
  } catch (l) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Kr(t, e) {
  try {
    if (!t) return;
    try {
      const n = t[e];
      if (typeof n < "u") return n;
    } catch {
    }
    try {
      if (t.default) return t.default[e];
    } catch {
    }
    return;
  } catch {
    return;
  }
}
async function Po(t, e, n, i, r, a, s, l, o = "eager", c = 1, u = void 0, f = "favicon") {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const m = typeof DOMParser < "u" ? new DOMParser() : null, d = m ? m.parseFromString(n || "", "text/html") : null, p = d ? d.querySelectorAll("a") : [];
  await dn(() => xo(p, i)), await dn(() => So(p, i));
  try {
    if (e && e instanceof HTMLElement && (!e.hasAttribute || !e.hasAttribute("role")))
      try {
        e.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let g = null, h = null, b = null, y = null, k = null, _ = null;
  function M() {
    try {
      const x = document.querySelector(".navbar-burger"), E = x && x.dataset ? x.dataset.target : null, z = E ? document.getElementById(E) : null;
      x && x.classList.contains("is-active") && (x.classList.remove("is-active"), x.setAttribute("aria-expanded", "false"), z && z.classList.remove("is-active"));
    } catch (x) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", x);
    }
  }
  async function $() {
    const x = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      x && x.classList.add("is-inactive");
    } catch {
    }
    try {
      const E = s && s();
      E && typeof E.then == "function" && await E;
    } catch (E) {
      try {
        console.warn && console.warn("[nimbi-cms] renderByQuery failed", E);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              x && x.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            x && x.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          x && x.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  const q = () => g || (g = (async () => {
    try {
      const x = await Promise.resolve().then(() => xt), E = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, z = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, N = Kr(x, "buildSearchIndex"), D = Kr(x, "buildSearchIndexWorker"), R = typeof E == "function" ? E : N || void 0, W = typeof z == "function" ? z : D || void 0;
      try {
        console.log("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof R + " workerFn=" + typeof W + " (global preferred)");
      } catch {
      }
      if (o === "lazy" && typeof W == "function")
        try {
          const v = await W(i, c, u);
          if (v && v.length) return v;
        } catch (v) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", v);
        }
      if (typeof R == "function") {
        try {
          console.log("[nimbi-cms test] calling buildFn");
        } catch {
        }
        return await R(i, c, u);
      }
      return [];
    } catch (x) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", x), [];
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
  })(), g.then((x) => {
    try {
      const E = String(h && h.value || "").trim().toLowerCase();
      if (!E || !Array.isArray(x) || !x.length) return;
      const z = x.filter((D) => D.title && D.title.toLowerCase().includes(E) || D.excerpt && D.excerpt.toLowerCase().includes(E));
      if (!z || !z.length) return;
      const N = document.getElementById("nimbi-search-results");
      if (!N) return;
      N.innerHTML = "";
      try {
        const D = document.createElement("div");
        D.className = "panel nimbi-search-panel", z.slice(0, 10).forEach((R) => {
          try {
            if (R.parentTitle) {
              const ee = document.createElement("p");
              ee.className = "panel-heading nimbi-search-title nimbi-search-parent", ee.textContent = R.parentTitle, D.appendChild(ee);
            }
            const W = document.createElement("a");
            W.className = "panel-block nimbi-search-result", W.href = Ae(R.slug), W.setAttribute("role", "button");
            try {
              if (R.path && typeof R.slug == "string") {
                try {
                  te.set(R.slug, R.path);
                } catch {
                }
                try {
                  Q.set(R.path, R.slug);
                } catch {
                }
              }
            } catch {
            }
            const v = document.createElement("div");
            v.className = "is-size-6 has-text-weight-semibold", v.textContent = R.title, W.appendChild(v), W.addEventListener("click", () => {
              try {
                N.style.display = "none";
              } catch {
              }
            }), D.appendChild(W);
          } catch {
          }
        }), N.appendChild(D);
        try {
          N.style.display = "block";
        } catch {
        }
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), g), C = document.createElement("nav");
  C.className = "navbar", C.setAttribute("role", "navigation"), C.setAttribute("aria-label", "main navigation");
  const O = document.createElement("div");
  O.className = "navbar-brand";
  const ce = p[0], S = document.createElement("a");
  if (S.className = "navbar-item", ce) {
    const x = ce.getAttribute("href") || "#";
    try {
      const z = new URL(x, location.href).searchParams.get("page");
      if (z) {
        const N = decodeURIComponent(z);
        S.href = Ae(N);
      } else
        S.href = Ae(r), S.textContent = a("home");
    } catch {
      S.href = Ae(r), S.textContent = a("home");
    }
  } else
    S.href = Ae(r), S.textContent = a("home");
  async function B(x) {
    try {
      if (!x || x === "none") return null;
      if (x === "favicon")
        try {
          const E = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!E) return null;
          const z = E.getAttribute("href") || "";
          return z && /\.png(?:\?|$)/i.test(z) ? new URL(z, location.href).toString() : null;
        } catch {
          return null;
        }
      if (x === "copy-first" || x === "move-first")
        try {
          const E = await ye(r, i);
          if (!E || !E.raw) return null;
          const D = new DOMParser().parseFromString(E.raw, "text/html").querySelector("img");
          if (!D) return null;
          const R = D.getAttribute("src") || "";
          if (!R) return null;
          const W = new URL(R, location.href).toString();
          if (x === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", W);
            } catch {
            }
          return W;
        } catch {
          return null;
        }
      try {
        return new URL(x, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let _e = null;
  try {
    _e = await B(f);
  } catch {
    _e = null;
  }
  if (_e)
    try {
      const x = document.createElement("img");
      x.className = "nimbi-navbar-logo";
      const E = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      x.alt = E, x.title = E, x.src = _e;
      try {
        x.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!S.textContent || !String(S.textContent).trim()) && (S.textContent = E);
      } catch {
      }
      try {
        S.insertBefore(x, S.firstChild);
      } catch {
        try {
          S.appendChild(x);
        } catch {
        }
      }
    } catch {
    }
  O.appendChild(S), S.addEventListener("click", function(x) {
    const E = S.getAttribute("href") || "";
    if (E.startsWith("?page=")) {
      x.preventDefault();
      const z = new URL(E, location.href), N = z.searchParams.get("page"), D = z.hash ? z.hash.replace(/^#/, "") : null;
      history.pushState({ page: N }, "", Ae(N, D)), $();
      try {
        M();
      } catch {
      }
    }
  });
  const J = document.createElement("a");
  J.className = "navbar-burger", J.setAttribute("role", "button"), J.setAttribute("aria-label", "menu"), J.setAttribute("aria-expanded", "false");
  const he = "nimbi-navbar-menu";
  J.dataset.target = he, J.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', O.appendChild(J);
  try {
    J.addEventListener("click", (x) => {
      try {
        const E = J.dataset && J.dataset.target ? J.dataset.target : null, z = E ? document.getElementById(E) : null;
        J.classList.contains("is-active") ? (J.classList.remove("is-active"), J.setAttribute("aria-expanded", "false"), z && z.classList.remove("is-active")) : (J.classList.add("is-active"), J.setAttribute("aria-expanded", "true"), z && z.classList.add("is-active"));
      } catch (E) {
        console.warn("[nimbi-cms] navbar burger toggle failed", E);
      }
    });
  } catch (x) {
    console.warn("[nimbi-cms] burger event binding failed", x);
  }
  const L = document.createElement("div");
  L.className = "navbar-menu", L.id = he;
  const H = document.createElement("div");
  H.className = "navbar-start";
  let V = null, Z = null;
  if (!l)
    V = null, h = null, y = null, k = null, _ = null;
  else {
    V = document.createElement("div"), V.className = "navbar-end", Z = document.createElement("div"), Z.className = "navbar-item", h = document.createElement("input"), h.className = "input", h.type = "search", h.placeholder = a("searchPlaceholder") || "", h.id = "nimbi-search";
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
    o === "eager" && (h.disabled = !0), b = document.createElement("div"), b.className = "control", o === "eager" && b.classList.add("is-loading"), b.appendChild(h), Z.appendChild(b), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const x = document.createElement("div");
    x.className = "dropdown-trigger", x.appendChild(Z);
    const E = document.createElement("div");
    E.className = "dropdown-menu", E.setAttribute("role", "menu"), k = document.createElement("div"), k.id = "nimbi-search-results", k.className = "dropdown-content nimbi-search-results", _ = k, E.appendChild(k), y.appendChild(x), y.appendChild(E), V.appendChild(y);
    const z = (D) => {
      if (!k) return;
      k.innerHTML = "";
      let R = -1;
      function W(K) {
        try {
          const ae = k.querySelector(".nimbi-search-result.is-selected");
          ae && ae.classList.remove("is-selected");
          const be = k.querySelectorAll(".nimbi-search-result");
          if (!be || !be.length) return;
          if (K < 0) {
            R = -1;
            return;
          }
          K >= be.length && (K = be.length - 1);
          const oe = be[K];
          if (oe) {
            oe.classList.add("is-selected"), R = K;
            try {
              oe.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function v(K) {
        try {
          const ae = K.key, be = k.querySelectorAll(".nimbi-search-result");
          if (!be || !be.length) return;
          if (ae === "ArrowDown") {
            K.preventDefault();
            const oe = R < 0 ? 0 : Math.min(be.length - 1, R + 1);
            W(oe);
            return;
          }
          if (ae === "ArrowUp") {
            K.preventDefault();
            const oe = R <= 0 ? 0 : R - 1;
            W(oe);
            return;
          }
          if (ae === "Enter") {
            K.preventDefault();
            const oe = k.querySelector(".nimbi-search-result.is-selected") || k.querySelector(".nimbi-search-result");
            if (oe)
              try {
                oe.click();
              } catch {
              }
            return;
          }
          if (ae === "Escape") {
            try {
              y.classList.remove("is-active");
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
              k.removeEventListener("keydown", v);
            } catch {
            }
            try {
              h && h.focus();
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", ee);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function ee(K) {
        try {
          if (K && K.key === "ArrowDown") {
            K.preventDefault();
            try {
              k.focus();
            } catch {
            }
            W(0);
          }
        } catch {
        }
      }
      try {
        const K = document.createElement("div");
        K.className = "panel nimbi-search-panel", D.forEach((ae) => {
          if (ae.parentTitle) {
            const fe = document.createElement("p");
            fe.textContent = ae.parentTitle, fe.className = "panel-heading nimbi-search-title nimbi-search-parent", K.appendChild(fe);
          }
          const be = document.createElement("a");
          be.className = "panel-block nimbi-search-result", be.href = Ae(ae.slug), be.setAttribute("role", "button");
          try {
            if (ae.path && typeof ae.slug == "string") {
              try {
                te.set(ae.slug, ae.path);
              } catch {
              }
              try {
                Q.set(ae.path, ae.slug);
              } catch {
              }
            }
          } catch {
          }
          const oe = document.createElement("div");
          oe.className = "is-size-6 has-text-weight-semibold", oe.textContent = ae.title, be.appendChild(oe), be.addEventListener("click", () => {
            if (y) {
              y.classList.remove("is-active");
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
            try {
              k.removeAttribute("tabindex");
            } catch {
            }
            try {
              k.removeEventListener("keydown", v);
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", ee);
            } catch {
            }
          }), K.appendChild(be);
        }), k.appendChild(K);
      } catch {
      }
      if (y) {
        y.classList.add("is-active");
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
        k.addEventListener("keydown", v);
      } catch {
      }
      try {
        h && h.addEventListener("keydown", ee);
      } catch {
      }
    }, N = (D, R) => {
      let W = null;
      return (...v) => {
        W && clearTimeout(W), W = setTimeout(() => D(...v), R);
      };
    };
    if (h) {
      const D = N(async () => {
        const R = document.querySelector("input#nimbi-search"), W = String(R && R.value || "").trim().toLowerCase();
        if (!W) {
          z([]);
          return;
        }
        try {
          await q();
          const v = await g;
          try {
            console.log('[nimbi-cms test] search handleInput q="' + W + '" idxlen=' + (Array.isArray(v) ? v.length : "nil"));
          } catch {
          }
          const ee = v.filter((K) => K.title && K.title.toLowerCase().includes(W) || K.excerpt && K.excerpt.toLowerCase().includes(W));
          try {
            console.log("[nimbi-cms test] filtered len=" + (Array.isArray(ee) ? ee.length : "nil"));
          } catch {
          }
          z(ee.slice(0, 10));
        } catch (v) {
          console.warn("[nimbi-cms] search input handler failed", v), z([]);
        }
      }, 50);
      try {
        h.addEventListener("input", D);
      } catch {
      }
      try {
        document.addEventListener("input", (R) => {
          try {
            R && R.target && R.target.id === "nimbi-search" && D(R);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = q();
      } catch (D) {
        console.warn("[nimbi-cms] eager search index init failed", D), g = Promise.resolve([]);
      }
      g.finally(() => {
        const D = document.querySelector("input#nimbi-search");
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
      });
    }
    try {
      const D = (R) => {
        try {
          const W = R && R.target;
          if (!_ || !_.classList.contains("is-open") && _.style && _.style.display !== "block" || W && (_.contains(W) || h && (W === h || h.contains && h.contains(W)))) return;
          if (y) {
            y.classList.remove("is-active");
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
      document.addEventListener("click", D, !0), document.addEventListener("touchstart", D, !0);
    } catch {
    }
  }
  for (let x = 0; x < p.length; x++) {
    const E = p[x];
    if (x === 0) continue;
    const z = E.getAttribute("href") || "#", N = document.createElement("a");
    N.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(z) || z.endsWith(".md")) {
        const R = me(z).split(/::|#/, 2), W = R[0], v = R[1];
        N.href = Ae(W, v);
      } else if (/\.html(?:$|[#?])/.test(z) || z.endsWith(".html")) {
        const R = me(z).split(/::|#/, 2);
        let W = R[0];
        W && !W.toLowerCase().endsWith(".html") && (W = W + ".html");
        const v = R[1];
        try {
          const ee = await ye(W, i);
          if (ee && ee.raw)
            try {
              const ae = new DOMParser().parseFromString(ee.raw, "text/html"), be = ae.querySelector("title"), oe = ae.querySelector("h1"), fe = be && be.textContent && be.textContent.trim() ? be.textContent.trim() : oe && oe.textContent ? oe.textContent.trim() : null;
              if (fe) {
                const ke = ge(fe);
                if (ke) {
                  try {
                    te.set(ke, W), Q.set(W, ke);
                  } catch (Ge) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ge);
                  }
                  N.href = Ae(ke, v);
                } else
                  N.href = Ae(W, v);
              } else
                N.href = Ae(W, v);
            } catch {
              N.href = Ae(W, v);
            }
          else
            N.href = z;
        } catch {
          N.href = z;
        }
      } else
        N.href = z;
    } catch (D) {
      console.warn("[nimbi-cms] nav item href parse failed", D), N.href = z;
    }
    try {
      const D = E.textContent && String(E.textContent).trim() ? String(E.textContent).trim() : null;
      if (D)
        try {
          const R = ge(D);
          if (R) {
            const W = N.getAttribute("href") || "";
            let v = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(W))
              v = me(String(W || "").split(/[?#]/)[0]);
            else
              try {
                const ee = Ze(W);
                ee && ee.type === "canonical" && ee.page && (v = me(ee.page));
              } catch {
              }
            if (v) {
              let ee = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(v || "")))
                  ee = !0;
                else {
                  const K = String(v || "").replace(/^\.\//, ""), ae = K.replace(/^.*\//, "");
                  Array.isArray(Me) && Me.length && (Me.includes(K) || Me.includes(ae)) && (ee = !0);
                }
              } catch {
                ee = !1;
              }
              if (ee) {
                try {
                  te.set(R, v);
                } catch {
                }
                try {
                  Q.set(v, R);
                } catch {
                }
              }
            }
          }
        } catch (R) {
          console.warn("[nimbi-cms] nav slug mapping failed", R);
        }
    } catch (D) {
      console.warn("[nimbi-cms] nav slug mapping failed", D);
    }
    N.textContent = E.textContent || z, H.appendChild(N);
  }
  L.appendChild(H), V && L.appendChild(V), C.appendChild(O), C.appendChild(L), t.appendChild(C);
  try {
    const x = (E) => {
      try {
        const z = C && C.querySelector ? C.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!z || !z.classList.contains("is-active")) return;
        const N = z && z.closest ? z.closest(".navbar") : C;
        if (N && N.contains(E.target)) return;
        M();
      } catch {
      }
    };
    document.addEventListener("click", x, !0), document.addEventListener("touchstart", x, !0);
  } catch {
  }
  try {
    L.addEventListener("click", (x) => {
      const E = x.target && x.target.closest ? x.target.closest("a") : null;
      if (!E) return;
      const z = E.getAttribute("href") || "";
      try {
        const N = new URL(z, location.href), D = N.searchParams.get("page"), R = N.hash ? N.hash.replace(/^#/, "") : null;
        D && (x.preventDefault(), history.pushState({ page: D }, "", Ae(D, R)), $());
      } catch (N) {
        console.warn("[nimbi-cms] navbar click handler failed", N);
      }
      try {
        const N = C && C.querySelector ? C.querySelector(".navbar-burger") : null, D = N && N.dataset ? N.dataset.target : null, R = D ? document.getElementById(D) : null;
        N && N.classList.contains("is-active") && (N.classList.remove("is-active"), N.setAttribute("aria-expanded", "false"), R && R.classList.remove("is-active"));
      } catch (N) {
        console.warn("[nimbi-cms] mobile menu close failed", N);
      }
    });
  } catch (x) {
    console.warn("[nimbi-cms] attach content click handler failed", x);
  }
  try {
    e.addEventListener("click", (x) => {
      const E = x.target && x.target.closest ? x.target.closest("a") : null;
      if (!E) return;
      const z = E.getAttribute("href") || "";
      if (z && !ai(z))
        try {
          const N = new URL(z, location.href), D = N.searchParams.get("page"), R = N.hash ? N.hash.replace(/^#/, "") : null;
          D && (x.preventDefault(), history.pushState({ page: D }, "", Ae(D, R)), $());
        } catch (N) {
          console.warn("[nimbi-cms] container click URL parse failed", N);
        }
    });
  } catch (x) {
    console.warn("[nimbi-cms] build navbar failed", x);
  }
  return { navbar: C, linkEls: p };
}
try {
  document.addEventListener("input", (t) => {
    try {
      if (t && t.target && t.target.id === "nimbi-search") {
        const e = document.getElementById("nimbi-search-results");
        if (e && t.target && t.target.value)
          try {
            e.style.display = "block";
          } catch {
          }
      }
    } catch {
    }
  }, !0);
} catch {
}
let Ie = null, X = null, Re = 1, Ve = (t, e) => e, Bt = 0, Dt = 0, un = () => {
}, Tt = 0.25;
function zo() {
  if (Ie && document.contains(Ie)) return Ie;
  Ie = null;
  const t = document.createElement("dialog");
  t.className = "nimbi-image-preview modal", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", Ve("imagePreviewTitle", "Image preview")), t.innerHTML = `
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
  `, t.addEventListener("click", (L) => {
    L.target === t && Bn();
  }), t.addEventListener("wheel", (L) => {
    if (!ce()) return;
    L.preventDefault();
    const H = L.deltaY < 0 ? Tt : -Tt;
    nt(Re + H), c(), u();
  }, { passive: !1 }), t.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      Bn();
      return;
    }
    if (Re > 1) {
      const H = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!H) return;
      const V = 40;
      switch (L.key) {
        case "ArrowUp":
          H.scrollTop -= V, L.preventDefault();
          break;
        case "ArrowDown":
          H.scrollTop += V, L.preventDefault();
          break;
        case "ArrowLeft":
          H.scrollLeft -= V, L.preventDefault();
          break;
        case "ArrowRight":
          H.scrollLeft += V, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), Ie = t, X = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), i = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), a = t.querySelector("[data-nimbi-preview-reset]"), s = t.querySelector("[data-nimbi-preview-close]"), l = t.querySelector("[data-nimbi-preview-zoom-label]"), o = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function c() {
    l && (l.textContent = `${Math.round(Re * 100)}%`);
  }
  const u = () => {
    o && (o.textContent = `${Math.round(Re * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  un = c, i.addEventListener("click", () => {
    nt(Re + Tt), c(), u();
  }), r.addEventListener("click", () => {
    nt(Re - Tt), c(), u();
  }), e.addEventListener("click", () => {
    qt(), c(), u();
  }), n.addEventListener("click", () => {
    nt(1), c(), u();
  }), a.addEventListener("click", () => {
    qt(), c(), u();
  }), s.addEventListener("click", Bn), e.title = Ve("imagePreviewFit", "Fit to screen"), n.title = Ve("imagePreviewOriginal", "Original size"), r.title = Ve("imagePreviewZoomOut", "Zoom out"), i.title = Ve("imagePreviewZoomIn", "Zoom in"), s.title = Ve("imagePreviewClose", "Close"), s.setAttribute("aria-label", Ve("imagePreviewClose", "Close"));
  let f = !1, m = 0, d = 0, p = 0, g = 0;
  const h = /* @__PURE__ */ new Map();
  let b = 0, y = 1;
  const k = (L, H) => {
    const V = L.x - H.x, Z = L.y - H.y;
    return Math.hypot(V, Z);
  }, _ = () => {
    f = !1, h.clear(), b = 0, X && (X.classList.add("is-panning"), X.classList.remove("is-grabbing"));
  };
  let M = 0, $ = 0, q = 0;
  const C = (L) => {
    const H = Date.now(), V = H - M, Z = L.clientX - $, x = L.clientY - q;
    M = H, $ = L.clientX, q = L.clientY, V < 300 && Math.hypot(Z, x) < 30 && (nt(Re > 1 ? 1 : 2), c(), L.preventDefault());
  }, O = (L) => {
    nt(Re > 1 ? 1 : 2), c(), L.preventDefault();
  }, ce = () => Ie ? typeof Ie.open == "boolean" ? Ie.open : Ie.classList.contains("is-active") : !1, S = (L, H, V = 1) => {
    if (h.has(V) && h.set(V, { x: L, y: H }), h.size === 2) {
      const z = Array.from(h.values()), N = k(z[0], z[1]);
      if (b > 0) {
        const D = N / b;
        nt(y * D);
      }
      return;
    }
    if (!f) return;
    const Z = X.closest(".nimbi-image-preview__image-wrapper");
    if (!Z) return;
    const x = L - m, E = H - d;
    Z.scrollLeft = p - x, Z.scrollTop = g - E;
  }, B = (L, H, V = 1) => {
    if (!ce()) return;
    if (h.set(V, { x: L, y: H }), h.size === 2) {
      const E = Array.from(h.values());
      b = k(E[0], E[1]), y = Re;
      return;
    }
    const Z = X.closest(".nimbi-image-preview__image-wrapper");
    !Z || !(Z.scrollWidth > Z.clientWidth || Z.scrollHeight > Z.clientHeight) || (f = !0, m = L, d = H, p = Z.scrollLeft, g = Z.scrollTop, X.classList.add("is-panning"), X.classList.remove("is-grabbing"), window.addEventListener("pointermove", _e), window.addEventListener("pointerup", J), window.addEventListener("pointercancel", J));
  }, _e = (L) => {
    f && (L.preventDefault(), S(L.clientX, L.clientY, L.pointerId));
  }, J = () => {
    _(), window.removeEventListener("pointermove", _e), window.removeEventListener("pointerup", J), window.removeEventListener("pointercancel", J);
  };
  X.addEventListener("pointerdown", (L) => {
    L.preventDefault(), B(L.clientX, L.clientY, L.pointerId);
  }), X.addEventListener("pointermove", (L) => {
    (f || h.size === 2) && L.preventDefault(), S(L.clientX, L.clientY, L.pointerId);
  }), X.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && C(L), _();
  }), X.addEventListener("dblclick", O), X.addEventListener("pointercancel", _), X.addEventListener("mousedown", (L) => {
    L.preventDefault(), B(L.clientX, L.clientY, 1);
  }), X.addEventListener("mousemove", (L) => {
    f && L.preventDefault(), S(L.clientX, L.clientY, 1);
  }), X.addEventListener("mouseup", (L) => {
    L.preventDefault(), _();
  });
  const he = t.querySelector(".nimbi-image-preview__image-wrapper");
  return he && (he.addEventListener("pointerdown", (L) => {
    if (B(L.clientX, L.clientY, L.pointerId), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), he.addEventListener("pointermove", (L) => {
    S(L.clientX, L.clientY, L.pointerId);
  }), he.addEventListener("pointerup", _), he.addEventListener("pointercancel", _), he.addEventListener("mousedown", (L) => {
    if (B(L.clientX, L.clientY, 1), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), he.addEventListener("mousemove", (L) => {
    S(L.clientX, L.clientY, 1);
  }), he.addEventListener("mouseup", _)), t;
}
function nt(t) {
  if (!X) return;
  const e = Number(t);
  Re = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const i = X.getBoundingClientRect(), r = Bt || X.naturalWidth || X.width || i.width || 0, a = Dt || X.naturalHeight || X.height || i.height || 0;
  if (r && a) {
    X.style.setProperty("--nimbi-preview-img-max-width", "none"), X.style.setProperty("--nimbi-preview-img-max-height", "none"), X.style.setProperty("--nimbi-preview-img-width", `${r * Re}px`), X.style.setProperty("--nimbi-preview-img-height", `${a * Re}px`), X.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      X.style.width = `${r * Re}px`, X.style.height = `${a * Re}px`, X.style.transform = "none";
    } catch {
    }
  } else {
    X.style.setProperty("--nimbi-preview-img-max-width", ""), X.style.setProperty("--nimbi-preview-img-max-height", ""), X.style.setProperty("--nimbi-preview-img-width", ""), X.style.setProperty("--nimbi-preview-img-height", ""), X.style.setProperty("--nimbi-preview-img-transform", `scale(${Re})`);
    try {
      X.style.transform = `scale(${Re})`;
    } catch {
    }
  }
  X && (X.classList.add("is-panning"), X.classList.remove("is-grabbing"));
}
function qt() {
  if (!X) return;
  const t = X.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = Bt || X.naturalWidth || e.width, i = Dt || X.naturalHeight || e.height;
  if (!n || !i) return;
  const r = e.width / n, a = e.height / i, s = Math.min(r, a, 1);
  nt(Number.isFinite(s) ? s : 1);
}
function Io(t, e = "", n = 0, i = 0) {
  const r = zo();
  Re = 1, Bt = n || 0, Dt = i || 0, X.src = t;
  try {
    if (!e)
      try {
        const l = new URL(t, typeof location < "u" ? location.href : "").pathname || "", c = (l.substring(l.lastIndexOf("/") + 1) || t).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        e = Ve("imagePreviewDefaultAlt", c || "Image");
      } catch {
        e = Ve("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  X.alt = e, X.style.transform = "scale(1)";
  const a = () => {
    Bt = X.naturalWidth || X.width || 0, Dt = X.naturalHeight || X.height || 0;
  };
  if (a(), qt(), un(), requestAnimationFrame(() => {
    qt(), un();
  }), !Bt || !Dt) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        qt(), un();
      }), X.removeEventListener("load", s);
    };
    X.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function Bn() {
  if (Ie) {
    typeof Ie.close == "function" && Ie.open && Ie.close(), Ie.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Oo(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Ve = (d, p) => (typeof e == "function" ? e(d) : void 0) || p, Tt = n, t.addEventListener("click", (d) => {
    const p = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!p || p.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      p
    );
    if (!g.src) return;
    const h = g.closest("a");
    h && h.getAttribute("href") || Io(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let c = 0, u = 1;
  const f = (d, p) => {
    const g = d.x - p.x, h = d.y - p.y;
    return Math.hypot(g, h);
  };
  t.addEventListener("pointerdown", (d) => {
    const p = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!p || p.tagName !== "IMG") return;
    const g = p.closest("a");
    if (g && g.getAttribute("href") || !Ie || !Ie.open) return;
    if (o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      const b = Array.from(o.values());
      c = f(b[0], b[1]), u = Re;
      return;
    }
    const h = p.closest(".nimbi-image-preview__image-wrapper");
    if (h && !(Re <= 1)) {
      d.preventDefault(), i = !0, r = d.clientX, a = d.clientY, s = h.scrollLeft, l = h.scrollTop, p.setPointerCapture(d.pointerId);
      try {
        p.classList.add("is-grabbing");
      } catch {
      }
    }
  }), t.addEventListener("pointermove", (d) => {
    if (o.has(d.pointerId) && o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      d.preventDefault();
      const k = Array.from(o.values()), _ = f(k[0], k[1]);
      if (c > 0) {
        const M = _ / c;
        nt(u * M);
      }
      return;
    }
    if (!i) return;
    d.preventDefault();
    const p = (
      /** @type {HTMLElement} */
      d.target
    ), g = p.closest && p.closest("a");
    if (g && g.getAttribute && g.getAttribute("href")) return;
    const h = p.closest(".nimbi-image-preview__image-wrapper");
    if (!h) return;
    const b = d.clientX - r, y = d.clientY - a;
    h.scrollLeft = s - b, h.scrollTop = l - y;
  });
  const m = () => {
    i = !1, o.clear(), c = 0;
    try {
      const d = document.querySelector("[data-nimbi-preview-image]");
      d && (d.classList.add("is-panning"), d.classList.remove("is-grabbing"));
    } catch {
    }
  };
  t.addEventListener("pointerup", m), t.addEventListener("pointercancel", m);
}
function No(t) {
  const {
    contentWrap: e,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: c
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const f = wo(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  async function m(b, y) {
    let k, _, M;
    try {
      ({ data: k, pagePath: _, anchor: M } = await cs(b, s));
    } catch (B) {
      console.error("[nimbi-cms] fetchPageData failed", B), Xr(e, a, B);
      return;
    }
    !M && y && (M = y);
    try {
      Gn(null);
    } catch (B) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", B);
    }
    e.innerHTML = "";
    const { article: $, parsed: q, toc: C, topH1: O, h1Text: ce, slugKey: S } = await Eo(a, k, _, M, s);
    is(a, o, q, C, $, _, M, O, ce, S, k), n.innerHTML = "", C && (n.appendChild(C), Ro(C));
    try {
      await c("transformHtml", { article: $, parsed: q, toc: C, pagePath: _, anchor: M, topH1: O, h1Text: ce, slugKey: S, data: k });
    } catch (B) {
      console.warn("[nimbi-cms] transformHtml hooks failed", B);
    }
    e.appendChild($);
    try {
      Lo($);
    } catch (B) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", B);
    }
    try {
      Oo($, { t: a });
    } catch (B) {
      console.warn("[nimbi-cms] attachImagePreview failed", B);
    }
    try {
      rn(i, 100, !1), requestAnimationFrame(() => rn(i, 100, !1)), setTimeout(() => rn(i, 100, !1), 250);
    } catch (B) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", B);
    }
    Gn(M), $o($, O, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await c("onPageLoad", { data: k, pagePath: _, anchor: M, article: $, toc: C, topH1: O, h1Text: ce, slugKey: S, contentWrap: e, navWrap: n });
    } catch (B) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", B);
    }
    u = _;
  }
  async function d() {
    try {
      if (typeof window < "u" && window.__nimbiCMSDebug)
        try {
          window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}, window.__nimbiCMSDebug.renderByQuery = (window.__nimbiCMSDebug.renderByQuery || 0) + 1;
        } catch {
        }
      let b = Ze(location.href);
      if (b && b.type === "path" && b.page)
        try {
          let _ = "?page=" + encodeURIComponent(b.page || "");
          b.params && (_ += (_.includes("?") ? "&" : "?") + b.params), b.anchor && (_ += "#" + encodeURIComponent(b.anchor));
          try {
            history.replaceState(history.state, "", _);
          } catch {
            try {
              history.replaceState({}, "", _);
            } catch {
            }
          }
          b = Ze(location.href);
        } catch {
        }
      const y = b && b.page ? b.page : l, k = b && b.anchor ? b.anchor : null;
      await m(y, k);
    } catch (b) {
      console.warn("[nimbi-cms] renderByQuery failed", b), Xr(e, a, b);
    }
  }
  window.addEventListener("popstate", d);
  const p = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = {
        top: b.scrollTop || 0,
        left: b.scrollLeft || 0
      };
      sessionStorage.setItem(p(), JSON.stringify(y));
    } catch {
    }
  }, h = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = sessionStorage.getItem(p());
      if (!y) return;
      const k = JSON.parse(y);
      k && typeof k.top == "number" && b.scrollTo({ top: k.top, left: k.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (b) => {
    if (b.persisted)
      try {
        h(), rn(i, 100, !1);
      } catch (y) {
        console.warn("[nimbi-cms] bfcache restore failed", y);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (b) {
      console.warn("[nimbi-cms] save scroll position failed", b);
    }
  }), { renderByQuery: d, siteNav: f, getCurrentPagePath: () => u };
}
function Bo(t) {
  try {
    let e = typeof t == "string" ? t : typeof window < "u" && window.location ? window.location.search : "";
    if (!e && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = Ze(window.location.href);
        if (a && a.params) e = a.params.startsWith("?") ? a.params : "?" + a.params;
        else {
          const s = window.location.hash, l = s.indexOf("?");
          l !== -1 && (e = s.slice(l));
        }
      } catch {
        const s = window.location.hash, l = s.indexOf("?");
        l !== -1 && (e = s.slice(l));
      }
    if (!e) return {};
    const n = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), i = {}, r = (a) => {
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
      const s = (n.get("noIndexing") || "").split(",").map((l) => l.trim()).filter(Boolean);
      s.length && (i.noIndexing = s);
    }
    return i;
  } catch {
    return {};
  }
}
function Do(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Dn(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  if (!e || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e)) return !1;
  const n = e.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let sn = "";
async function Vo(t = {}) {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.info("[nimbi-cms] initCMS called", { options: t });
    } catch {
    }
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const n = Bo();
  if (n && (n.contentPath || n.homePage || n.notFoundPage || n.navigationPage))
    if (t && t.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (S) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", S);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (S) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", S);
      }
      delete n.contentPath, delete n.homePage, delete n.notFoundPage, delete n.navigationPage;
    }
  const i = Object.assign({}, n, t);
  n && typeof n.bulmaCustomize == "string" && n.bulmaCustomize.trim() && (i.bulmaCustomize = n.bulmaCustomize);
  let {
    el: r,
    contentPath: a = "/content",
    crawlMaxQueue: s = 1e3,
    searchIndex: l = !0,
    searchIndexMode: o = "eager",
    indexDepth: c = 1,
    noIndexing: u = void 0,
    defaultStyle: f = "light",
    bulmaCustomize: m = "none",
    lang: d = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: h,
    markdownExtensions: b,
    availableLanguages: y,
    homePage: k = "_home.md",
    notFoundPage: _ = "_404.md",
    navigationPage: M = "_navigation.md"
  } = i;
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof _ == "string" && _.startsWith("./") && (_ = _.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof M == "string" && M.startsWith("./") && (M = M.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: $ = "favicon" } = i, { skipRootReadme: q = !1 } = i, C = (S) => {
    try {
      const B = document.querySelector(r);
      B && B instanceof Element && (B.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(S)}</pre></div>`);
    } catch {
    }
  };
  if (i.contentPath != null && !Do(i.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (k != null && !Dn(k))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !Dn(_))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (M != null && !Dn(M))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r)
    throw new Error("el is required");
  let O = r;
  if (typeof r == "string") {
    if (O = document.querySelector(r), !O) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof a != "string" || !a.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof l != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (c != null && c !== 1 && c !== 2 && c !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (f !== "light" && f !== "dark" && f !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (m != null && typeof m != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (h != null && (typeof h != "number" || !Number.isInteger(h) || h < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some((S) => !S || typeof S != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((S) => typeof S != "string" || !S.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((S) => typeof S != "string" || !S.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (q != null && typeof q != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ce = !!l;
  try {
    Promise.resolve().then(() => xt).then((S) => {
      try {
        S && typeof S.setSkipRootReadme == "function" && S.setSkipRootReadme(!!q);
      } catch (B) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", B);
      }
    }).catch((S) => {
    });
  } catch (S) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", S);
  }
  try {
    try {
      i && i.seoMap && typeof i.seoMap == "object" && ns(i.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(S) {
        try {
          const B = { type: "error", message: S && S.message ? String(S.message) : "", filename: S && S.filename ? String(S.filename) : "", lineno: S && S.lineno ? S.lineno : null, colno: S && S.colno ? S.colno : null, stack: S && S.error && S.error.stack ? S.error.stack : null, time: Date.now() };
          try {
            console.warn("[nimbi-cms] runtime error", B.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(B);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(S) {
        try {
          const B = { type: "unhandledrejection", reason: S && S.reason ? String(S.reason) : "", time: Date.now() };
          try {
            console.warn("[nimbi-cms] unhandledrejection", B.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(B);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const S = Ze(typeof window < "u" ? window.location.href : ""), B = S && S.page ? S.page : k || "_home.md";
      try {
        rs(B, sn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        O.classList.add("nimbi-mount");
      } catch (v) {
        console.warn("[nimbi-cms] mount element setup failed", v);
      }
      const S = document.createElement("section");
      S.className = "section";
      const B = document.createElement("div");
      B.className = "container nimbi-cms";
      const _e = document.createElement("div");
      _e.className = "columns";
      const J = document.createElement("div");
      J.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", J.setAttribute("role", "navigation");
      try {
        const v = typeof Mt == "function" ? Mt("navigation") : null;
        v && J.setAttribute("aria-label", v);
      } catch (v) {
        console.warn("[nimbi-cms] set nav aria-label failed", v);
      }
      _e.appendChild(J);
      const he = document.createElement("main");
      he.className = "column nimbi-content", he.setAttribute("role", "main"), _e.appendChild(he), B.appendChild(_e), S.appendChild(B);
      const L = J, H = he;
      O.appendChild(S);
      let V = null;
      try {
        V = O.querySelector(".nimbi-overlay"), V || (V = document.createElement("div"), V.className = "nimbi-overlay", O.appendChild(V));
      } catch (v) {
        V = null, console.warn("[nimbi-cms] mount overlay setup failed", v);
      }
      const Z = location.pathname || "/";
      let x;
      if (Z.endsWith("/"))
        x = Z;
      else {
        const v = Z.substring(Z.lastIndexOf("/") + 1);
        v && !v.includes(".") ? x = Z + "/" : x = Z.substring(0, Z.lastIndexOf("/") + 1);
      }
      try {
        sn = document.title || "";
      } catch (v) {
        sn = "", console.warn("[nimbi-cms] read initial document title failed", v);
      }
      let E = a;
      const z = Object.prototype.hasOwnProperty.call(i, "contentPath"), N = typeof location < "u" && location.origin ? location.origin : "http://localhost", D = new URL(x, N).toString();
      (E === "." || E === "./") && (E = "");
      try {
        E = String(E || "").replace(/\\/g, "/");
      } catch {
        E = String(E || "");
      }
      E.startsWith("/") && (E = E.replace(/^\/+/, "")), E && !E.endsWith("/") && (E = E + "/");
      try {
        if (E && x && x !== "/") {
          const v = x.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          v && E.startsWith(v) && (E = E.slice(v.length));
        }
      } catch {
      }
      try {
        if (E)
          var R = new URL(E, D.endsWith("/") ? D : D + "/").toString();
        else
          var R = D;
      } catch {
        try {
          if (E) var R = new URL("/" + E, N).toString();
          else var R = new URL(x, N).toString();
        } catch {
          var R = N;
        }
      }
      try {
        Promise.resolve().then(() => xt).then((v) => {
          try {
            v && typeof v.setHomePage == "function" && v.setHomePage(k);
          } catch (ee) {
            console.warn("[nimbi-cms] setHomePage failed", ee);
          }
        }).catch((v) => {
        });
      } catch (v) {
        console.warn("[nimbi-cms] setHomePage dynamic import failed", v);
      }
      p && await ri(p, x), y && Array.isArray(y) && oi(y), d && ii(d);
      const W = No({ contentWrap: H, navWrap: L, container: B, mountOverlay: V, t: Mt, contentBase: R, homePage: k, initialDocumentTitle: sn, runHooks: Er });
      if (typeof g == "number" && g >= 0 && typeof Ir == "function" && Ir(g * 60 * 1e3), typeof h == "number" && h >= 0 && typeof zr == "function" && zr(h), b && Array.isArray(b) && b.length)
        try {
          b.forEach((v) => {
            typeof v == "object" && Ni && typeof Wn == "function" && Wn(v);
          });
        } catch (v) {
          console.warn("[nimbi-cms] applying markdownExtensions failed", v);
        }
      try {
        typeof s == "number" && Promise.resolve().then(() => xt).then(({ setDefaultCrawlMaxQueue: v }) => {
          try {
            v(s);
          } catch (ee) {
            console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", ee);
          }
        });
      } catch (v) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", v);
      }
      try {
        fn(R);
      } catch (v) {
        console.warn("[nimbi-cms] setContentBase failed", v);
      }
      try {
        jn(_);
      } catch (v) {
        console.warn("[nimbi-cms] setNotFoundPage failed", v);
      }
      try {
        fn(R);
      } catch (v) {
        console.warn("[nimbi-cms] setContentBase failed", v);
      }
      try {
        jn(_);
      } catch (v) {
        console.warn("[nimbi-cms] setNotFoundPage failed", v);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => Fo).then((v) => {
          try {
            v && typeof v.attachSitemapDownloadUI == "function" && v.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      try {
        await ye(k, R);
      } catch (v) {
        throw k === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${k} not found at ${R}${k}: ${v.message}`);
      }
      La(f), await Ea(m, x);
      try {
        const v = document.createElement("header");
        v.className = "nimbi-site-navbar", O.insertBefore(v, S);
        const ee = await ye(M, R), K = await wn(ee.raw || ""), { navbar: ae, linkEls: be } = await Po(v, B, K.html || "", R, k, Mt, W.renderByQuery, ce, o, c, u, $);
        try {
          await Er("onNavBuild", { navWrap: L, navbar: ae, linkEls: be, contentBase: R });
        } catch (oe) {
          console.warn("[nimbi-cms] onNavBuild hooks failed", oe);
        }
        try {
          const oe = () => {
            const fe = v && v.getBoundingClientRect && Math.round(v.getBoundingClientRect().height) || v && v.offsetHeight || 0;
            if (fe > 0) {
              try {
                O.style.setProperty("--nimbi-site-navbar-height", `${fe}px`);
              } catch (ke) {
                console.warn("[nimbi-cms] set CSS var failed", ke);
              }
              try {
                B.style.paddingTop = "";
              } catch (ke) {
                console.warn("[nimbi-cms] set container paddingTop failed", ke);
              }
              try {
                const ke = O && O.getBoundingClientRect && Math.round(O.getBoundingClientRect().height) || O && O.clientHeight || 0;
                if (ke > 0) {
                  const Ge = Math.max(0, ke - fe);
                  try {
                    B.style.setProperty("--nimbi-cms-height", `${Ge}px`);
                  } catch (vn) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", vn);
                  }
                } else
                  try {
                    B.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (Ge) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ge);
                  }
              } catch (ke) {
                console.warn("[nimbi-cms] compute container height failed", ke);
              }
              try {
                v.style.setProperty("--nimbi-site-navbar-height", `${fe}px`);
              } catch (ke) {
                console.warn("[nimbi-cms] set navbar CSS var failed", ke);
              }
            }
          };
          oe();
          try {
            if (typeof ResizeObserver < "u") {
              const fe = new ResizeObserver(() => oe());
              try {
                fe.observe(v);
              } catch (ke) {
                console.warn("[nimbi-cms] ResizeObserver.observe failed", ke);
              }
            }
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver setup failed", fe);
          }
        } catch (oe) {
          console.warn("[nimbi-cms] compute navbar height failed", oe);
        }
      } catch (v) {
        console.warn("[nimbi-cms] build navigation failed", v);
      }
      await W.renderByQuery();
      try {
        Promise.resolve().then(() => jo).then(({ getVersion: v }) => {
          typeof v == "function" && v().then((ee) => {
            try {
              const K = ee || "0.0.0";
              try {
                const ae = (fe) => {
                  const ke = document.createElement("a");
                  ke.className = "nimbi-version-label tag is-small", ke.textContent = `nimbiCMS v. ${K}`, ke.href = fe || "#", ke.target = "_blank", ke.rel = "noopener noreferrer nofollow", ke.setAttribute("aria-label", `nimbiCMS version ${K}`);
                  try {
                    ti(ke);
                  } catch {
                  }
                  try {
                    O.appendChild(ke);
                  } catch (Ge) {
                    console.warn("[nimbi-cms] append version label failed", Ge);
                  }
                }, be = "https://abelvm.github.io/nimbiCMS/", oe = (() => {
                  try {
                    if (be && typeof be == "string")
                      return new URL(be).toString();
                  } catch {
                  }
                  return "#";
                })();
                ae(oe);
              } catch (ae) {
                console.warn("[nimbi-cms] building version label failed", ae);
              }
            } catch (K) {
              console.warn("[nimbi-cms] building version label failed", K);
            }
          }).catch((ee) => {
            console.warn("[nimbi-cms] getVersion() failed", ee);
          });
        }).catch((v) => {
          console.warn("[nimbi-cms] import version module failed", v);
        });
      } catch (v) {
        console.warn("[nimbi-cms] version label setup failed", v);
      }
    })();
  } catch (S) {
    throw C(S), S;
  }
}
async function qo() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const jo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: qo
}, Symbol.toStringTag, { value: "Module" }));
function Ho() {
  try {
    const t = typeof location < "u" && location && typeof location.pathname == "string" ? location.origin + location.pathname.split("?")[0] : typeof location < "u" && location.origin ? location.origin : "http://localhost";
    return String(t);
  } catch {
    return "http://localhost/";
  }
}
function Qn(t = {}) {
  const { includeAllMarkdown: e = !0 } = t || {}, n = Ho(), i = [];
  try {
    if (e && Array.isArray(Me) && Me.length)
      i.push(...Me);
    else
      for (const s of Array.from(te.values()))
        if (s) {
          if (typeof s == "string") i.push(s);
          else if (s && typeof s == "object" && (s.default && i.push(s.default), s.langs))
            for (const l of Object.values(s.langs || {})) l && i.push(l);
        }
  } catch (s) {
    console.warn("[runtimeSitemap] gather paths failed", s);
  }
  const r = /* @__PURE__ */ new Set(), a = [];
  for (let s of i)
    try {
      if (!s || (s = me(String(s)), r.has(s))) continue;
      r.add(s);
      const l = n.split("?")[0] + "?page=" + encodeURIComponent(s);
      a.push({ loc: l, path: s });
    } catch {
    }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: a };
}
function Vr(t) {
  return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function qi(t) {
  const e = t && Array.isArray(t.entries) ? t.entries : Array.isArray(t) ? t : t && t.entries ? t.entries : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of e)
    try {
      n += `  <url>
`, n += `    <loc>${Vr(String(i.loc || i.path || ""))}</loc>
`, i.lastmod && (n += `    <lastmod>${Vr(String(i.lastmod))}</lastmod>
`), n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function Uo(t, e = {}) {
  try {
    if (typeof document > "u") return null;
    const n = typeof t == "string" ? document.querySelector(t) : t;
    if (!n || !n.appendChild) return null;
    const i = document.createElement("div");
    i.className = "nimbi-sitemap-ui", i.style.cssText = "position:fixed;right:8px;bottom:8px;z-index:9999;padding:6px;background:rgba(0,0,0,0.6);border-radius:6px;";
    const r = (l) => {
      const o = document.createElement("button");
      return o.textContent = l, o.style.cssText = "color:#fff;background:transparent;border:1px solid rgba(255,255,255,0.2);padding:6px 8px;margin:2px;border-radius:4px;cursor:pointer", o;
    }, a = r("sitemap.json");
    a.title = "Download sitemap.json", a.addEventListener("click", () => {
      try {
        const l = Qn(e), o = new Blob([JSON.stringify(l, null, 2)], { type: "application/json" }), c = URL.createObjectURL(o), u = document.createElement("a");
        u.href = c, u.download = e.filename || "sitemap.json", document.body.appendChild(u), u.click(), u.remove(), setTimeout(() => URL.revokeObjectURL(c), 5e3);
      } catch (l) {
        console.warn("[runtimeSitemap] download json failed", l);
      }
    });
    const s = r("sitemap.xml");
    return s.title = "Download sitemap.xml", s.addEventListener("click", () => {
      try {
        const l = Qn(e), o = qi(l), c = new Blob([o], { type: "application/xml" }), u = URL.createObjectURL(c), f = document.createElement("a");
        f.href = u, f.download = e.filename || "sitemap.xml", document.body.appendChild(f), f.click(), f.remove(), setTimeout(() => URL.revokeObjectURL(u), 5e3);
      } catch (l) {
        console.warn("[runtimeSitemap] download xml failed", l);
      }
    }), i.appendChild(a), i.appendChild(s), n.appendChild(i), i;
  } catch (n) {
    return console.warn("[runtimeSitemap] attach UI failed", n), null;
  }
}
const Fo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attachSitemapDownloadUI: Uo,
  generateSitemapJson: Qn,
  generateSitemapXml: qi
}, Symbol.toStringTag, { value: "Module" }));
export {
  Jr as BAD_LANGUAGES,
  le as SUPPORTED_HLJS_MAP,
  Qo as _clearHooks,
  Xn as addHook,
  Vo as default,
  Ea as ensureBulma,
  qo as getVersion,
  Vo as initCMS,
  ri as loadL10nFile,
  ei as loadSupportedLanguages,
  va as observeCodeBlocks,
  Zo as onNavBuild,
  Wo as onPageLoad,
  Ht as registerLanguage,
  Er as runHooks,
  Xo as setHighlightTheme,
  ii as setLang,
  La as setStyle,
  Ko as setThemeVars,
  Mt as t,
  Go as transformHtml
};
