const Ct = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function $n(t, e) {
  if (!Object.prototype.hasOwnProperty.call(Ct, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  Ct[t].push(e);
}
function tl(t) {
  $n("onPageLoad", t);
}
function nl(t) {
  $n("onNavBuild", t);
}
function rl(t) {
  $n("transformHtml", t);
}
async function cr(t, e) {
  const n = Ct[t] || [];
  for (const s of n)
    try {
      await s(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function il() {
  Object.keys(Ct).forEach((t) => {
    Ct[t].length = 0;
  });
}
function Ir(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var mn, ur;
function Xi() {
  if (ur) return mn;
  ur = 1;
  function t(w) {
    return w instanceof Map ? w.clear = w.delete = w.set = function() {
      throw new Error("map is read-only");
    } : w instanceof Set && (w.add = w.clear = w.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(w), Object.getOwnPropertyNames(w).forEach((x) => {
      const M = w[x], K = typeof M;
      (K === "object" || K === "function") && !Object.isFrozen(M) && t(M);
    }), w;
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
  function n(w) {
    return w.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(w, ...x) {
    const M = /* @__PURE__ */ Object.create(null);
    for (const K in w)
      M[K] = w[K];
    return x.forEach(function(K) {
      for (const ye in K)
        M[ye] = K[ye];
    }), /** @type {T} */
    M;
  }
  const r = "</span>", i = (w) => !!w.scope, a = (w, { prefix: x }) => {
    if (w.startsWith("language:"))
      return w.replace("language:", "language-");
    if (w.includes(".")) {
      const M = w.split(".");
      return [
        `${x}${M.shift()}`,
        ...M.map((K, ye) => `${K}${"_".repeat(ye + 1)}`)
      ].join(" ");
    }
    return `${x}${w}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(x, M) {
      this.buffer = "", this.classPrefix = M.classPrefix, x.walk(this);
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
      const M = a(
        x.scope,
        { prefix: this.classPrefix }
      );
      this.span(M);
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
  const l = (w = {}) => {
    const x = { children: [] };
    return Object.assign(x, w), x;
  };
  class h {
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
      const M = l({ scope: x });
      this.add(M), this.stack.push(M);
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
    static _walk(x, M) {
      return typeof M == "string" ? x.addText(M) : M.children && (x.openNode(M), M.children.forEach((K) => this._walk(x, K)), x.closeNode(M)), x;
    }
    /**
     * @param {Node} node
     */
    static _collapse(x) {
      typeof x != "string" && x.children && (x.children.every((M) => typeof M == "string") ? x.children = [x.children.join("")] : x.children.forEach((M) => {
        h._collapse(M);
      }));
    }
  }
  class c extends h {
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
    __addSublanguage(x, M) {
      const K = x.root;
      M && (K.scope = `language:${M}`), this.add(K);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function d(w) {
    return w ? typeof w == "string" ? w : w.source : null;
  }
  function p(w) {
    return g("(?=", w, ")");
  }
  function f(w) {
    return g("(?:", w, ")*");
  }
  function u(w) {
    return g("(?:", w, ")?");
  }
  function g(...w) {
    return w.map((M) => d(M)).join("");
  }
  function m(w) {
    const x = w[w.length - 1];
    return typeof x == "object" && x.constructor === Object ? (w.splice(w.length - 1, 1), x) : {};
  }
  function b(...w) {
    return "(" + (m(w).capture ? "" : "?:") + w.map((K) => d(K)).join("|") + ")";
  }
  function y(w) {
    return new RegExp(w.toString() + "|").exec("").length - 1;
  }
  function S(w, x) {
    const M = w && w.exec(x);
    return M && M.index === 0;
  }
  const L = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function I(w, { joinWith: x }) {
    let M = 0;
    return w.map((K) => {
      M += 1;
      const ye = M;
      let ke = d(K), B = "";
      for (; ke.length > 0; ) {
        const z = L.exec(ke);
        if (!z) {
          B += ke;
          break;
        }
        B += ke.substring(0, z.index), ke = ke.substring(z.index + z[0].length), z[0][0] === "\\" && z[1] ? B += "\\" + String(Number(z[1]) + ye) : (B += z[0], z[0] === "(" && M++);
      }
      return B;
    }).map((K) => `(${K})`).join(x);
  }
  const U = /\b\B/, Z = "[a-zA-Z]\\w*", F = "[a-zA-Z_]\\w*", fe = "\\b\\d+(\\.\\d+)?", $ = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", q = "\\b(0b[01]+)", Q = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", O = (w = {}) => {
    const x = /^#![ ]*\//;
    return w.binary && (w.begin = g(
      x,
      /.*\b/,
      w.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: x,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (M, K) => {
        M.index !== 0 && K.ignoreMatch();
      }
    }, w);
  }, oe = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, X = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [oe]
  }, v = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [oe]
  }, J = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, re = function(w, x, M = {}) {
    const K = s(
      {
        scope: "comment",
        begin: w,
        end: x,
        contains: []
      },
      M
    );
    K.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const ye = b(
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
    return K.contains.push(
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
          ye,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), K;
  }, A = re("//", "$"), T = re("/\\*", "\\*/"), C = re("#", "$"), P = {
    scope: "number",
    begin: fe,
    relevance: 0
  }, k = {
    scope: "number",
    begin: $,
    relevance: 0
  }, R = {
    scope: "number",
    begin: q,
    relevance: 0
  }, N = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      oe,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [oe]
      }
    ]
  }, te = {
    scope: "title",
    begin: Z,
    relevance: 0
  }, ue = {
    scope: "title",
    begin: F,
    relevance: 0
  }, he = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + F,
    relevance: 0
  };
  var ce = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: X,
    BACKSLASH_ESCAPE: oe,
    BINARY_NUMBER_MODE: R,
    BINARY_NUMBER_RE: q,
    COMMENT: re,
    C_BLOCK_COMMENT_MODE: T,
    C_LINE_COMMENT_MODE: A,
    C_NUMBER_MODE: k,
    C_NUMBER_RE: $,
    END_SAME_AS_BEGIN: function(w) {
      return Object.assign(
        w,
        {
          /** @type {ModeCallback} */
          "on:begin": (x, M) => {
            M.data._beginMatch = x[1];
          },
          /** @type {ModeCallback} */
          "on:end": (x, M) => {
            M.data._beginMatch !== x[1] && M.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: C,
    IDENT_RE: Z,
    MATCH_NOTHING_RE: U,
    METHOD_GUARD: he,
    NUMBER_MODE: P,
    NUMBER_RE: fe,
    PHRASAL_WORDS_MODE: J,
    QUOTE_STRING_MODE: v,
    REGEXP_MODE: N,
    RE_STARTERS_RE: Q,
    SHEBANG: O,
    TITLE_MODE: te,
    UNDERSCORE_IDENT_RE: F,
    UNDERSCORE_TITLE_MODE: ue
  });
  function ze(w, x) {
    w.input[w.index - 1] === "." && x.ignoreMatch();
  }
  function lt(w, x) {
    w.className !== void 0 && (w.scope = w.className, delete w.className);
  }
  function ot(w, x) {
    x && w.beginKeywords && (w.begin = "\\b(" + w.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", w.__beforeBegin = ze, w.keywords = w.keywords || w.beginKeywords, delete w.beginKeywords, w.relevance === void 0 && (w.relevance = 0));
  }
  function on(w, x) {
    Array.isArray(w.illegal) && (w.illegal = b(...w.illegal));
  }
  function gi(w, x) {
    if (w.match) {
      if (w.begin || w.end) throw new Error("begin & end are not supported with match");
      w.begin = w.match, delete w.match;
    }
  }
  function mi(w, x) {
    w.relevance === void 0 && (w.relevance = 1);
  }
  const wi = (w, x) => {
    if (!w.beforeMatch) return;
    if (w.starts) throw new Error("beforeMatch cannot be used with starts");
    const M = Object.assign({}, w);
    Object.keys(w).forEach((K) => {
      delete w[K];
    }), w.keywords = M.keywords, w.begin = g(M.beforeMatch, p(M.begin)), w.starts = {
      relevance: 0,
      contains: [
        Object.assign(M, { endsParent: !0 })
      ]
    }, w.relevance = 0, delete M.beforeMatch;
  }, bi = [
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
  ], yi = "keyword";
  function Gn(w, x, M = yi) {
    const K = /* @__PURE__ */ Object.create(null);
    return typeof w == "string" ? ye(M, w.split(" ")) : Array.isArray(w) ? ye(M, w) : Object.keys(w).forEach(function(ke) {
      Object.assign(
        K,
        Gn(w[ke], x, ke)
      );
    }), K;
    function ye(ke, B) {
      x && (B = B.map((z) => z.toLowerCase())), B.forEach(function(z) {
        const G = z.split("|");
        K[G[0]] = [ke, ki(G[0], G[1])];
      });
    }
  }
  function ki(w, x) {
    return x ? Number(x) : xi(w) ? 0 : 1;
  }
  function xi(w) {
    return bi.includes(w.toLowerCase());
  }
  const Qn = {}, et = (w) => {
    console.error(w);
  }, Xn = (w, ...x) => {
    console.log(`WARN: ${w}`, ...x);
  }, ct = (w, x) => {
    Qn[`${w}/${x}`] || (console.log(`Deprecated as of ${w}. ${x}`), Qn[`${w}/${x}`] = !0);
  }, Nt = new Error();
  function Kn(w, x, { key: M }) {
    let K = 0;
    const ye = w[M], ke = {}, B = {};
    for (let z = 1; z <= x.length; z++)
      B[z + K] = ye[z], ke[z + K] = !0, K += y(x[z - 1]);
    w[M] = B, w[M]._emit = ke, w[M]._multi = !0;
  }
  function Si(w) {
    if (Array.isArray(w.begin)) {
      if (w.skip || w.excludeBegin || w.returnBegin)
        throw et("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Nt;
      if (typeof w.beginScope != "object" || w.beginScope === null)
        throw et("beginScope must be object"), Nt;
      Kn(w, w.begin, { key: "beginScope" }), w.begin = I(w.begin, { joinWith: "" });
    }
  }
  function vi(w) {
    if (Array.isArray(w.end)) {
      if (w.skip || w.excludeEnd || w.returnEnd)
        throw et("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Nt;
      if (typeof w.endScope != "object" || w.endScope === null)
        throw et("endScope must be object"), Nt;
      Kn(w, w.end, { key: "endScope" }), w.end = I(w.end, { joinWith: "" });
    }
  }
  function Ai(w) {
    w.scope && typeof w.scope == "object" && w.scope !== null && (w.beginScope = w.scope, delete w.scope);
  }
  function Ei(w) {
    Ai(w), typeof w.beginScope == "string" && (w.beginScope = { _wrap: w.beginScope }), typeof w.endScope == "string" && (w.endScope = { _wrap: w.endScope }), Si(w), vi(w);
  }
  function Li(w) {
    function x(B, z) {
      return new RegExp(
        d(B),
        "m" + (w.case_insensitive ? "i" : "") + (w.unicodeRegex ? "u" : "") + (z ? "g" : "")
      );
    }
    class M {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(z, G) {
        G.position = this.position++, this.matchIndexes[this.matchAt] = G, this.regexes.push([G, z]), this.matchAt += y(z) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const z = this.regexes.map((G) => G[1]);
        this.matcherRe = x(I(z, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(z) {
        this.matcherRe.lastIndex = this.lastIndex;
        const G = this.matcherRe.exec(z);
        if (!G)
          return null;
        const Ae = G.findIndex((pt, un) => un > 0 && pt !== void 0), xe = this.matchIndexes[Ae];
        return G.splice(0, Ae), Object.assign(G, xe);
      }
    }
    class K {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(z) {
        if (this.multiRegexes[z]) return this.multiRegexes[z];
        const G = new M();
        return this.rules.slice(z).forEach(([Ae, xe]) => G.addRule(Ae, xe)), G.compile(), this.multiRegexes[z] = G, G;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(z, G) {
        this.rules.push([z, G]), G.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(z) {
        const G = this.getMatcher(this.regexIndex);
        G.lastIndex = this.lastIndex;
        let Ae = G.exec(z);
        if (this.resumingScanAtSamePosition() && !(Ae && Ae.index === this.lastIndex)) {
          const xe = this.getMatcher(0);
          xe.lastIndex = this.lastIndex + 1, Ae = xe.exec(z);
        }
        return Ae && (this.regexIndex += Ae.position + 1, this.regexIndex === this.count && this.considerAll()), Ae;
      }
    }
    function ye(B) {
      const z = new K();
      return B.contains.forEach((G) => z.addRule(G.begin, { rule: G, type: "begin" })), B.terminatorEnd && z.addRule(B.terminatorEnd, { type: "end" }), B.illegal && z.addRule(B.illegal, { type: "illegal" }), z;
    }
    function ke(B, z) {
      const G = (
        /** @type CompiledMode */
        B
      );
      if (B.isCompiled) return G;
      [
        lt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        gi,
        Ei,
        wi
      ].forEach((xe) => xe(B, z)), w.compilerExtensions.forEach((xe) => xe(B, z)), B.__beforeBegin = null, [
        ot,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        on,
        // default to 1 relevance if not specified
        mi
      ].forEach((xe) => xe(B, z)), B.isCompiled = !0;
      let Ae = null;
      return typeof B.keywords == "object" && B.keywords.$pattern && (B.keywords = Object.assign({}, B.keywords), Ae = B.keywords.$pattern, delete B.keywords.$pattern), Ae = Ae || /\w+/, B.keywords && (B.keywords = Gn(B.keywords, w.case_insensitive)), G.keywordPatternRe = x(Ae, !0), z && (B.begin || (B.begin = /\B|\b/), G.beginRe = x(G.begin), !B.end && !B.endsWithParent && (B.end = /\B|\b/), B.end && (G.endRe = x(G.end)), G.terminatorEnd = d(G.end) || "", B.endsWithParent && z.terminatorEnd && (G.terminatorEnd += (B.end ? "|" : "") + z.terminatorEnd)), B.illegal && (G.illegalRe = x(
        /** @type {RegExp | string} */
        B.illegal
      )), B.contains || (B.contains = []), B.contains = [].concat(...B.contains.map(function(xe) {
        return Ti(xe === "self" ? B : xe);
      })), B.contains.forEach(function(xe) {
        ke(
          /** @type Mode */
          xe,
          G
        );
      }), B.starts && ke(B.starts, z), G.matcher = ye(G), G;
    }
    if (w.compilerExtensions || (w.compilerExtensions = []), w.contains && w.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return w.classNameAliases = s(w.classNameAliases || {}), ke(
      /** @type Mode */
      w
    );
  }
  function Yn(w) {
    return w ? w.endsWithParent || Yn(w.starts) : !1;
  }
  function Ti(w) {
    return w.variants && !w.cachedVariants && (w.cachedVariants = w.variants.map(function(x) {
      return s(w, { variants: null }, x);
    })), w.cachedVariants ? w.cachedVariants : Yn(w) ? s(w, { starts: w.starts ? s(w.starts) : null }) : Object.isFrozen(w) ? s(w) : w;
  }
  var Ci = "11.11.1";
  class Ri extends Error {
    constructor(x, M) {
      super(x), this.name = "HTMLInjectionError", this.html = M;
    }
  }
  const cn = n, Vn = s, Jn = /* @__PURE__ */ Symbol("nomatch"), Mi = 7, er = function(w) {
    const x = /* @__PURE__ */ Object.create(null), M = /* @__PURE__ */ Object.create(null), K = [];
    let ye = !0;
    const ke = "Could not find the language '{}', did you forget to load/include a language module?", B = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let z = {
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
    function G(E) {
      return z.noHighlightRe.test(E);
    }
    function Ae(E) {
      let H = E.className + " ";
      H += E.parentNode ? E.parentNode.className : "";
      const ie = z.languageDetectRe.exec(H);
      if (ie) {
        const pe = Ge(ie[1]);
        return pe || (Xn(ke.replace("{}", ie[1])), Xn("Falling back to no-highlight mode for this block.", E)), pe ? ie[1] : "no-highlight";
      }
      return H.split(/\s+/).find((pe) => G(pe) || Ge(pe));
    }
    function xe(E, H, ie) {
      let pe = "", Se = "";
      typeof H == "object" ? (pe = E, ie = H.ignoreIllegals, Se = H.language) : (ct("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ct("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Se = E, pe = H), ie === void 0 && (ie = !0);
      const Be = {
        code: pe,
        language: Se
      };
      Ot("before:highlight", Be);
      const Qe = Be.result ? Be.result : pt(Be.language, Be.code, ie);
      return Qe.code = Be.code, Ot("after:highlight", Qe), Qe;
    }
    function pt(E, H, ie, pe) {
      const Se = /* @__PURE__ */ Object.create(null);
      function Be(_, D) {
        return _.keywords[D];
      }
      function Qe() {
        if (!Y.keywords) {
          Te.addText(ge);
          return;
        }
        let _ = 0;
        Y.keywordPatternRe.lastIndex = 0;
        let D = Y.keywordPatternRe.exec(ge), ee = "";
        for (; D; ) {
          ee += ge.substring(_, D.index);
          const de = He.case_insensitive ? D[0].toLowerCase() : D[0], Ce = Be(Y, de);
          if (Ce) {
            const [We, Gi] = Ce;
            if (Te.addText(ee), ee = "", Se[de] = (Se[de] || 0) + 1, Se[de] <= Mi && (Ht += Gi), We.startsWith("_"))
              ee += D[0];
            else {
              const Qi = He.classNameAliases[We] || We;
              De(D[0], Qi);
            }
          } else
            ee += D[0];
          _ = Y.keywordPatternRe.lastIndex, D = Y.keywordPatternRe.exec(ge);
        }
        ee += ge.substring(_), Te.addText(ee);
      }
      function qt() {
        if (ge === "") return;
        let _ = null;
        if (typeof Y.subLanguage == "string") {
          if (!x[Y.subLanguage]) {
            Te.addText(ge);
            return;
          }
          _ = pt(Y.subLanguage, ge, !0, or[Y.subLanguage]), or[Y.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = hn(ge, Y.subLanguage.length ? Y.subLanguage : null);
        Y.relevance > 0 && (Ht += _.relevance), Te.__addSublanguage(_._emitter, _.language);
      }
      function $e() {
        Y.subLanguage != null ? qt() : Qe(), ge = "";
      }
      function De(_, D) {
        _ !== "" && (Te.startScope(D), Te.addText(_), Te.endScope());
      }
      function ir(_, D) {
        let ee = 1;
        const de = D.length - 1;
        for (; ee <= de; ) {
          if (!_._emit[ee]) {
            ee++;
            continue;
          }
          const Ce = He.classNameAliases[_[ee]] || _[ee], We = D[ee];
          Ce ? De(We, Ce) : (ge = We, Qe(), ge = ""), ee++;
        }
      }
      function sr(_, D) {
        return _.scope && typeof _.scope == "string" && Te.openNode(He.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (De(ge, He.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), ge = "") : _.beginScope._multi && (ir(_.beginScope, D), ge = "")), Y = Object.create(_, { parent: { value: Y } }), Y;
      }
      function ar(_, D, ee) {
        let de = S(_.endRe, ee);
        if (de) {
          if (_["on:end"]) {
            const Ce = new e(_);
            _["on:end"](D, Ce), Ce.isMatchIgnored && (de = !1);
          }
          if (de) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return ar(_.parent, D, ee);
      }
      function Ui(_) {
        return Y.matcher.regexIndex === 0 ? (ge += _[0], 1) : (gn = !0, 0);
      }
      function ji(_) {
        const D = _[0], ee = _.rule, de = new e(ee), Ce = [ee.__beforeBegin, ee["on:begin"]];
        for (const We of Ce)
          if (We && (We(_, de), de.isMatchIgnored))
            return Ui(D);
        return ee.skip ? ge += D : (ee.excludeBegin && (ge += D), $e(), !ee.returnBegin && !ee.excludeBegin && (ge = D)), sr(ee, _), ee.returnBegin ? 0 : D.length;
      }
      function Wi(_) {
        const D = _[0], ee = H.substring(_.index), de = ar(Y, _, ee);
        if (!de)
          return Jn;
        const Ce = Y;
        Y.endScope && Y.endScope._wrap ? ($e(), De(D, Y.endScope._wrap)) : Y.endScope && Y.endScope._multi ? ($e(), ir(Y.endScope, _)) : Ce.skip ? ge += D : (Ce.returnEnd || Ce.excludeEnd || (ge += D), $e(), Ce.excludeEnd && (ge = D));
        do
          Y.scope && Te.closeNode(), !Y.skip && !Y.subLanguage && (Ht += Y.relevance), Y = Y.parent;
        while (Y !== de.parent);
        return de.starts && sr(de.starts, _), Ce.returnEnd ? 0 : D.length;
      }
      function Fi() {
        const _ = [];
        for (let D = Y; D !== He; D = D.parent)
          D.scope && _.unshift(D.scope);
        _.forEach((D) => Te.openNode(D));
      }
      let Dt = {};
      function lr(_, D) {
        const ee = D && D[0];
        if (ge += _, ee == null)
          return $e(), 0;
        if (Dt.type === "begin" && D.type === "end" && Dt.index === D.index && ee === "") {
          if (ge += H.slice(D.index, D.index + 1), !ye) {
            const de = new Error(`0 width match regex (${E})`);
            throw de.languageName = E, de.badRule = Dt.rule, de;
          }
          return 1;
        }
        if (Dt = D, D.type === "begin")
          return ji(D);
        if (D.type === "illegal" && !ie) {
          const de = new Error('Illegal lexeme "' + ee + '" for mode "' + (Y.scope || "<unnamed>") + '"');
          throw de.mode = Y, de;
        } else if (D.type === "end") {
          const de = Wi(D);
          if (de !== Jn)
            return de;
        }
        if (D.type === "illegal" && ee === "")
          return ge += `
`, 1;
        if (pn > 1e5 && pn > D.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ge += ee, ee.length;
      }
      const He = Ge(E);
      if (!He)
        throw et(ke.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const Zi = Li(He);
      let fn = "", Y = pe || Zi;
      const or = {}, Te = new z.__emitter(z);
      Fi();
      let ge = "", Ht = 0, tt = 0, pn = 0, gn = !1;
      try {
        if (He.__emitTokens)
          He.__emitTokens(H, Te);
        else {
          for (Y.matcher.considerAll(); ; ) {
            pn++, gn ? gn = !1 : Y.matcher.considerAll(), Y.matcher.lastIndex = tt;
            const _ = Y.matcher.exec(H);
            if (!_) break;
            const D = H.substring(tt, _.index), ee = lr(D, _);
            tt = _.index + ee;
          }
          lr(H.substring(tt));
        }
        return Te.finalize(), fn = Te.toHTML(), {
          language: E,
          value: fn,
          relevance: Ht,
          illegal: !1,
          _emitter: Te,
          _top: Y
        };
      } catch (_) {
        if (_.message && _.message.includes("Illegal"))
          return {
            language: E,
            value: cn(H),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: _.message,
              index: tt,
              context: H.slice(tt - 100, tt + 100),
              mode: _.mode,
              resultSoFar: fn
            },
            _emitter: Te
          };
        if (ye)
          return {
            language: E,
            value: cn(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: Te,
            _top: Y
          };
        throw _;
      }
    }
    function un(E) {
      const H = {
        value: cn(E),
        illegal: !1,
        relevance: 0,
        _top: B,
        _emitter: new z.__emitter(z)
      };
      return H._emitter.addText(E), H;
    }
    function hn(E, H) {
      H = H || z.languages || Object.keys(x);
      const ie = un(E), pe = H.filter(Ge).filter(rr).map(
        ($e) => pt($e, E, !1)
      );
      pe.unshift(ie);
      const Se = pe.sort(($e, De) => {
        if ($e.relevance !== De.relevance) return De.relevance - $e.relevance;
        if ($e.language && De.language) {
          if (Ge($e.language).supersetOf === De.language)
            return 1;
          if (Ge(De.language).supersetOf === $e.language)
            return -1;
        }
        return 0;
      }), [Be, Qe] = Se, qt = Be;
      return qt.secondBest = Qe, qt;
    }
    function _i(E, H, ie) {
      const pe = H && M[H] || ie;
      E.classList.add("hljs"), E.classList.add(`language-${pe}`);
    }
    function dn(E) {
      let H = null;
      const ie = Ae(E);
      if (G(ie)) return;
      if (Ot(
        "before:highlightElement",
        { el: E, language: ie }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && (z.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), z.throwUnescapedHTML))
        throw new Ri(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      H = E;
      const pe = H.textContent, Se = ie ? xe(pe, { language: ie, ignoreIllegals: !0 }) : hn(pe);
      E.innerHTML = Se.value, E.dataset.highlighted = "yes", _i(E, ie, Se.language), E.result = {
        language: Se.language,
        // TODO: remove with version 11.0
        re: Se.relevance,
        relevance: Se.relevance
      }, Se.secondBest && (E.secondBest = {
        language: Se.secondBest.language,
        relevance: Se.secondBest.relevance
      }), Ot("after:highlightElement", { el: E, result: Se, text: pe });
    }
    function $i(E) {
      z = Vn(z, E);
    }
    const Pi = () => {
      Bt(), ct("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Ii() {
      Bt(), ct("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tr = !1;
    function Bt() {
      function E() {
        Bt();
      }
      if (document.readyState === "loading") {
        tr || window.addEventListener("DOMContentLoaded", E, !1), tr = !0;
        return;
      }
      document.querySelectorAll(z.cssSelector).forEach(dn);
    }
    function zi(E, H) {
      let ie = null;
      try {
        ie = H(w);
      } catch (pe) {
        if (et("Language definition for '{}' could not be registered.".replace("{}", E)), ye)
          et(pe);
        else
          throw pe;
        ie = B;
      }
      ie.name || (ie.name = E), x[E] = ie, ie.rawDefinition = H.bind(null, w), ie.aliases && nr(ie.aliases, { languageName: E });
    }
    function Ni(E) {
      delete x[E];
      for (const H of Object.keys(M))
        M[H] === E && delete M[H];
    }
    function Bi() {
      return Object.keys(x);
    }
    function Ge(E) {
      return E = (E || "").toLowerCase(), x[E] || x[M[E]];
    }
    function nr(E, { languageName: H }) {
      typeof E == "string" && (E = [E]), E.forEach((ie) => {
        M[ie.toLowerCase()] = H;
      });
    }
    function rr(E) {
      const H = Ge(E);
      return H && !H.disableAutodetect;
    }
    function Oi(E) {
      E["before:highlightBlock"] && !E["before:highlightElement"] && (E["before:highlightElement"] = (H) => {
        E["before:highlightBlock"](
          Object.assign({ block: H.el }, H)
        );
      }), E["after:highlightBlock"] && !E["after:highlightElement"] && (E["after:highlightElement"] = (H) => {
        E["after:highlightBlock"](
          Object.assign({ block: H.el }, H)
        );
      });
    }
    function qi(E) {
      Oi(E), K.push(E);
    }
    function Di(E) {
      const H = K.indexOf(E);
      H !== -1 && K.splice(H, 1);
    }
    function Ot(E, H) {
      const ie = E;
      K.forEach(function(pe) {
        pe[ie] && pe[ie](H);
      });
    }
    function Hi(E) {
      return ct("10.7.0", "highlightBlock will be removed entirely in v12.0"), ct("10.7.0", "Please use highlightElement now."), dn(E);
    }
    Object.assign(w, {
      highlight: xe,
      highlightAuto: hn,
      highlightAll: Bt,
      highlightElement: dn,
      // TODO: Remove with v12 API
      highlightBlock: Hi,
      configure: $i,
      initHighlighting: Pi,
      initHighlightingOnLoad: Ii,
      registerLanguage: zi,
      unregisterLanguage: Ni,
      listLanguages: Bi,
      getLanguage: Ge,
      registerAliases: nr,
      autoDetection: rr,
      inherit: Vn,
      addPlugin: qi,
      removePlugin: Di
    }), w.debugMode = function() {
      ye = !1;
    }, w.safeMode = function() {
      ye = !0;
    }, w.versionString = Ci, w.regex = {
      concat: g,
      lookahead: p,
      either: b,
      optional: u,
      anyNumberOfTimes: f
    };
    for (const E in ce)
      typeof ce[E] == "object" && t(ce[E]);
    return Object.assign(w, ce), w;
  }, ut = er({});
  return ut.newInstance = () => er({}), mn = ut, ut.HighlightJS = ut, ut.default = ut, mn;
}
var Ki = /* @__PURE__ */ Xi();
const me = /* @__PURE__ */ Ir(Ki), Yi = "11.11.1", ne = /* @__PURE__ */ new Map(), Vi = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Pe = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Pe.html = "xml";
Pe.xhtml = "xml";
Pe.markup = "xml";
const zr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Ye = null;
const wn = /* @__PURE__ */ new Map(), Ji = 300 * 1e3;
async function Nr(t = Vi) {
  if (t)
    return Ye || (Ye = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const s = (await e.text()).split(/\r?\n/);
        let r = -1;
        for (let h = 0; h < s.length; h++)
          if (/\|\s*Language\s*\|/i.test(s[h])) {
            r = h;
            break;
          }
        if (r === -1) return;
        const i = s[r].replace(/^\||\|$/g, "").split("|").map((h) => h.trim().toLowerCase());
        let a = i.findIndex((h) => /alias|aliases|equivalent|alt|alternates?/i.test(h));
        a === -1 && (a = 1);
        let o = i.findIndex((h) => /file|filename|module|module name|module-name|short|slug/i.test(h));
        if (o === -1) {
          const h = i.findIndex((c) => /language/i.test(c));
          o = h !== -1 ? h : 0;
        }
        let l = [];
        for (let h = r + 1; h < s.length; h++) {
          const c = s[h].trim();
          if (!c || !c.startsWith("|")) break;
          const d = c.replace(/^\||\|$/g, "").split("|").map((m) => m.trim());
          if (d.every((m) => /^-+$/.test(m))) continue;
          const p = d;
          if (!p.length) continue;
          const u = (p[o] || p[0] || "").toString().trim().toLowerCase();
          if (!u || /^-+$/.test(u)) continue;
          ne.set(u, u);
          const g = p[a] || "";
          if (g) {
            const m = String(g).split(",").map((b) => b.replace(/`/g, "").trim()).filter(Boolean);
            if (m.length) {
              const y = m[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (ne.set(y, y), l.push(y));
            }
          }
        }
        try {
          const h = [];
          for (const c of l) {
            const d = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            d && /[a-z0-9]/i.test(d) ? h.push(d) : ne.delete(c);
          }
          l = h;
        } catch (h) {
          console.warn("[codeblocksManager] cleanup aliases failed", h);
        }
        try {
          let h = 0;
          for (const c of Array.from(ne.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              ne.delete(c), h++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const d = c.replace(/^[:]+/, "");
              if (d && /[a-z0-9]/i.test(d)) {
                const p = ne.get(c);
                ne.delete(c), ne.set(d, p);
              } else
                ne.delete(c), h++;
            }
          }
          for (const [c, d] of Array.from(ne.entries()))
            (!d || /^-+$/.test(d) || !/[a-z0-9]/i.test(d)) && (ne.delete(c), h++);
          try {
            const c = ":---------------------";
            ne.has(c) && (ne.delete(c), h++);
          } catch (c) {
            console.warn("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(ne.keys()).sort();
          } catch (c) {
            console.warn("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (h) {
          console.warn("[codeblocksManager] ignored error", h);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), Ye);
}
const gt = /* @__PURE__ */ new Set();
async function Rt(t, e) {
  if (Ye || (async () => {
    try {
      await Nr();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Ye)
    try {
      await Ye;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (zr.has(n)) return !1;
  if (ne.size && !ne.has(n)) {
    const r = Pe;
    if (!r[n] && !r[t])
      return !1;
  }
  if (gt.has(t)) return !0;
  const s = Pe;
  try {
    const r = (e || t || "").toString().replace(/\.js$/i, "").trim(), i = (s[t] || t || "").toString(), a = (s[r] || r || "").toString();
    let o = Array.from(new Set([
      i,
      a,
      r,
      t,
      s[r],
      s[t]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    ne.size && (o = o.filter((c) => {
      if (ne.has(c)) return !0;
      const d = Pe[c];
      return !!(d && ne.has(d));
    }));
    let l = null, h = null;
    for (const c of o)
      try {
        const d = Date.now();
        let p = wn.get(c);
        if (p && p.ok === !1 && d - (p.ts || 0) >= Ji && (wn.delete(c), p = void 0), p) {
          if (p.module)
            l = p.module;
          else if (p.promise)
            try {
              l = await p.promise;
            } catch {
              l = null;
            }
        } else {
          const f = { promise: null, module: null, ok: null, ts: 0 };
          wn.set(c, f), f.promise = (async () => {
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
                  const g = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(g);
                } catch {
                  try {
                    const m = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(m);
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
            l = await f.promise, f.module = l, f.ok = !!l, f.ts = Date.now();
          } catch {
            f.module = null, f.ok = !1, f.ts = Date.now(), l = null;
          }
        }
        if (l) {
          const f = l.default || l;
          try {
            const u = ne.size && ne.get(t) || c || t;
            return me.registerLanguage(u, f), gt.add(u), u !== t && (me.registerLanguage(t, f), gt.add(t)), !0;
          } catch (u) {
            h = u;
          }
        } else
          try {
            if (ne.has(c) || ne.has(t)) {
              const f = () => ({});
              try {
                me.registerLanguage(c, f), gt.add(c);
              } catch {
              }
              try {
                c !== t && (me.registerLanguage(t, f), gt.add(t));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (d) {
        h = d;
      }
    if (h)
      throw h;
    return !1;
  } catch {
    return !1;
  }
}
let Ut = null;
function es(t = document) {
  Ye || (async () => {
    try {
      await Nr();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = Pe, s = Ut || (typeof IntersectionObserver > "u" ? null : (Ut = new IntersectionObserver((i, a) => {
    i.forEach((o) => {
      if (!o.isIntersecting) return;
      const l = o.target;
      try {
        a.unobserve(l);
      } catch (h) {
        console.warn("[codeblocksManager] observer unobserve failed", h);
      }
      (async () => {
        try {
          const h = l.getAttribute && l.getAttribute("class") || l.className || "", c = h.match(/language-([a-zA-Z0-9_+-]+)/) || h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const d = (c[1] || "").toLowerCase(), p = e[d] || d, f = ne.size && (ne.get(p) || ne.get(String(p).toLowerCase())) || p;
            try {
              await Rt(f);
            } catch (u) {
              console.warn("[codeblocksManager] registerLanguage failed", u);
            }
            try {
              try {
                const u = l.textContent || l.innerText || "";
                u != null && (l.textContent = u);
              } catch {
              }
              try {
                l && l.dataset && l.dataset.highlighted && delete l.dataset.highlighted;
              } catch {
              }
              me.highlightElement(l);
            } catch (u) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", u);
            }
          } else
            try {
              const d = l.textContent || "";
              try {
                if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
                  const p = me.highlight(d, { language: "plaintext" });
                  p && p.value && (l.innerHTML = p.value);
                }
              } catch {
                try {
                  me.highlightElement(l);
                } catch (f) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", f);
                }
              }
            } catch (d) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", d);
            }
        } catch (h) {
          console.warn("[codeblocksManager] observer entry processing failed", h);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Ut)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    r.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", o = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (o && o[1]) {
          const l = (o[1] || "").toLowerCase(), h = e[l] || l, c = ne.size && (ne.get(h) || ne.get(String(h).toLowerCase())) || h;
          try {
            await Rt(c);
          } catch (d) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", d);
          }
        }
        try {
          try {
            const l = i.textContent || i.innerText || "";
            l != null && (i.textContent = l);
          } catch {
          }
          try {
            i && i.dataset && i.dataset.highlighted && delete i.dataset.highlighted;
          } catch {
          }
          me.highlightElement(i);
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
function sl(t, { useCdn: e = !0 } = {}) {
  const n = document.querySelector("link[data-hl-theme]"), s = n && n.getAttribute ? n.getAttribute("data-hl-theme") : null, r = t == null ? "default" : String(t), i = r && String(r).toLowerCase() || "";
  if (i === "default" || i === "monokai") {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
    return;
  }
  if (s && s.toLowerCase() === i) return;
  if (!e) {
    console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    return;
  }
  const a = i, o = `https://cdn.jsdelivr.net/npm/highlight.js@${Yi}/styles/${a}.css`, l = document.createElement("link");
  l.rel = "stylesheet", l.href = o, l.setAttribute("data-hl-theme", a), l.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(l);
}
let rt = "light";
function ts(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([s, r]) => n.setAttribute(s, r)), document.head.appendChild(n), e["data-bulmaswatch-theme"])
    try {
      if (n.getAttribute("data-bulmaswatch-observer")) return;
      let s = Number(n.getAttribute("data-bulmaswatch-move-count") || 0), r = !1;
      const i = new MutationObserver(() => {
        try {
          if (r) return;
          const o = n.parentNode;
          if (!o || o.lastElementChild === n) return;
          if (s >= 1e3) {
            n.setAttribute("data-bulmaswatch-move-stopped", "1");
            return;
          }
          r = !0;
          try {
            o.appendChild(n);
          } catch {
          }
          s += 1, n.setAttribute("data-bulmaswatch-move-count", String(s)), r = !1;
        } catch {
        }
      });
      try {
        i.observe(document.head, { childList: !0 }), n.setAttribute("data-bulmaswatch-observer", "1"), n.setAttribute("data-bulmaswatch-move-count", String(s));
      } catch {
      }
      const a = document.head;
      a && a.lastElementChild !== n && a.appendChild(n);
    } catch {
    }
}
function hr() {
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
async function ns(t = "none", e = "/") {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.debug("[bulmaManager] ensureBulma called", { bulmaCustomize: t, pageDir: e });
    } catch {
    }
  if (!t) return;
  if (t === "none") {
    try {
      const i = [
        location && location.protocol && location.protocol === "file:" ? "https://unpkg.com/bulma/css/bulma.min.css" : "//unpkg.com/bulma/css/bulma.min.css",
        "https://unpkg.com/bulma/css/bulma.min.css"
      ];
      let a = !1;
      for (const o of i)
        try {
          if (document.querySelector(`link[href="${o}"]`)) {
            a = !0;
            break;
          }
        } catch {
        }
      if (!a) {
        const o = i[0], l = document.createElement("link");
        l.rel = "stylesheet", l.href = o, l.setAttribute("data-bulma-base", "1");
        const h = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        h && h.parentNode ? h.parentNode.insertBefore(l, h) : document.head.appendChild(l);
      }
    } catch {
    }
    try {
      const i = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
      for (const a of i)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    try {
      const i = Array.from(document.querySelectorAll("style[data-bulma-override]"));
      for (const a of i)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    return;
  }
  const s = [e + "bulma.css", "/bulma.css"], r = Array.from(new Set(s));
  if (t === "local") {
    if (hr(), document.querySelector("style[data-bulma-override]")) return;
    for (const i of r)
      try {
        const a = await fetch(i, { method: "GET" });
        if (a.ok) {
          const o = await a.text(), l = document.createElement("style");
          l.setAttribute("data-bulma-override", i), l.appendChild(document.createTextNode(`
/* bulma override: ${i} */
` + o)), document.head.appendChild(l);
          return;
        }
      } catch (a) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", a);
      }
    return;
  }
  try {
    const i = String(t).trim();
    if (!i) return;
    hr();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`;
    ts(a, { "data-bulmaswatch-theme": i });
  } catch (i) {
    console.warn("[bulmaManager] ensureBulma failed", i);
  }
}
function rs(t) {
  rt = t === "dark" ? "dark" : t === "system" ? "system" : "light";
  try {
    const e = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (e.length > 0)
      for (const n of e)
        rt === "dark" ? n.setAttribute("data-theme", "dark") : rt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      rt === "dark" ? n.setAttribute("data-theme", "dark") : rt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function al(t) {
  const e = document.documentElement;
  for (const [n, s] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${n}`, s);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Br(t) {
  if (!t || !(t instanceof HTMLElement)) return () => {
  };
  const e = t.closest && t.closest(".nimbi-mount") || null;
  try {
    e && (rt === "dark" ? e.setAttribute("data-theme", "dark") : rt === "light" ? e.setAttribute("data-theme", "light") : e.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Or = {
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
}, dt = JSON.parse(JSON.stringify(Or));
let Xt = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Xt = String(t).split("-")[0].toLowerCase();
}
Or[Xt] || (Xt = "en");
let Ve = Xt;
function yt(t, e = {}) {
  const n = dt[Ve] || dt.en;
  let s = n && n[t] ? n[t] : dt.en[t] || "";
  for (const r of Object.keys(e))
    s = s.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return s;
}
async function qr(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const s = await fetch(n);
    if (!s.ok) return;
    const r = await s.json();
    for (const i of Object.keys(r || {}))
      dt[i] = Object.assign({}, dt[i] || {}, r[i]);
  } catch {
  }
}
function Dr(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Ve = dt[e] ? e : "en";
}
const is = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ve;
  },
  loadL10nFile: qr,
  setLang: Dr,
  t: yt
}, Symbol.toStringTag, { value: "Module" })), ss = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Hr(t, e = "worker") {
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
    return new Promise((h, c) => {
      const d = s();
      if (!d) return c(new Error("worker unavailable"));
      const p = String(Math.random());
      o.id = p;
      let f = null;
      const u = () => {
        f && clearTimeout(f), d.removeEventListener("message", g), d.removeEventListener("error", m);
      }, g = (b) => {
        const y = b.data || {};
        y.id === p && (u(), y.error ? c(new Error(y.error)) : h(y.result));
      }, m = (b) => {
        u(), console.warn("[" + e + "] worker error event", b);
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (y) {
          console.warn("[" + e + "] worker termination failed", y);
        }
        c(new Error(b && b.message || "worker error"));
      };
      f = setTimeout(() => {
        u(), console.warn("[" + e + "] worker timed out");
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (b) {
          console.warn("[" + e + "] worker termination on timeout failed", b);
        }
        c(new Error("worker timeout"));
      }, l), d.addEventListener("message", g), d.addEventListener("error", m);
      try {
        d.postMessage(o);
      } catch (b) {
        u(), c(b);
      }
    });
  }
  return { get: s, send: i, terminate: r };
}
function as(t) {
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
const je = /* @__PURE__ */ new Set();
function Pn(t) {
  ls(), je.clear();
  for (const e of Ie)
    e && je.add(e);
  dr(V), dr(j), Pn._refreshed = !0;
}
function dr(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && je.add(e);
}
function fr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, s) {
    return s && je.add(s), e.call(this, n, s);
  };
}
let pr = !1;
function ls() {
  pr || (fr(V), fr(j), pr = !0);
}
function Ur(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function be(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function _t(t) {
  return String(t || "").replace(/\/+$/, "");
}
function Mt(t) {
  return _t(t) + "/";
}
function os(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function jt(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const r = t, i = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, a = 0, o = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = i ? Math.max(a, i.top) : a, c = (i ? Math.min(o, i.bottom) : o) + Number(e || 0);
    let d = 0;
    r && (d = r.clientHeight || (i ? i.height : 0)), d || (d = o - a);
    let p = 0.6;
    try {
      const m = r && window.getComputedStyle ? window.getComputedStyle(r) : null, b = m && m.getPropertyValue("--nimbi-image-max-height-ratio"), y = b ? parseFloat(b) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (p = y);
    } catch (m) {
      console.warn("[helpers] read CSS ratio failed", m);
    }
    const f = Math.max(200, Math.floor(d * p));
    let u = !1, g = null;
    if (s.forEach((m) => {
      try {
        const b = m.getAttribute ? m.getAttribute("loading") : void 0;
        b !== "eager" && m.setAttribute && m.setAttribute("loading", "lazy");
        const y = m.getBoundingClientRect ? m.getBoundingClientRect() : null, S = m.src || m.getAttribute && m.getAttribute("src"), L = y && y.height > 1 ? y.height : f, I = y ? y.top : 0, U = I + L;
        y && L > 0 && I <= c && U >= l && (m.setAttribute ? (m.setAttribute("loading", "eager"), m.setAttribute("fetchpriority", "high"), m.setAttribute("data-eager-by-nimbi", "1")) : (m.loading = "eager", m.fetchPriority = "high"), os(S), u = !0), !g && y && y.top <= c && (g = { img: m, src: S, rect: y, beforeLoading: b });
      } catch (b) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", b);
      }
    }), !u && g) {
      const { img: m, src: b, rect: y, beforeLoading: S } = g;
      try {
        m.setAttribute ? (m.setAttribute("loading", "eager"), m.setAttribute("fetchpriority", "high"), m.setAttribute("data-eager-by-nimbi", "1")) : (m.loading = "eager", m.fetchPriority = "high");
      } catch (L) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", L);
      }
    }
  } catch (s) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", s);
  }
}
function we(t, e = null, n) {
  try {
    const s = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(s.startsWith("?") ? s.slice(1) : s), i = String(t || "");
    r.delete("page");
    const a = new URLSearchParams();
    a.set("page", i);
    for (const [h, c] of r.entries())
      a.append(h, c);
    const o = a.toString();
    let l = o ? `?${o}` : "";
    return e && (l += `#${encodeURIComponent(e)}`), l || `?page=${encodeURIComponent(i)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(t || ""))}`;
    return e ? `${r}#${encodeURIComponent(e)}` : r;
  }
}
function Kt(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Kt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const V = /* @__PURE__ */ new Map();
let Me = [], In = !1;
function cs(t) {
  In = !!t;
}
function jr(t) {
  Me = Array.isArray(t) ? t.slice() : [];
}
function us() {
  return Me;
}
const Wr = Hr(() => as(ss), "slugManager");
function zn() {
  return Wr.get();
}
function Fr(t) {
  return Wr.send(t);
}
async function hs(t, e = 1, n = void 0) {
  if (!zn()) return Jt(t, e, n);
  try {
    return await Fr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
  } catch (r) {
    try {
      return await Jt(t, e, n);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), r;
    }
  }
}
async function ds(t, e, n) {
  return zn() ? Fr({ type: "crawlForSlug", slug: t, base: e, maxQueue: n }) : Nn(t, e, n);
}
function Xe(t, e) {
  if (t)
    if (Me && Me.length) {
      const s = e.split("/")[0], r = Me.includes(s);
      let i = V.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), r ? i.langs[s] = e : i.default = e, V.set(t, i);
    } else
      V.set(t, e);
}
const sn = /* @__PURE__ */ new Set();
function fs(t) {
  typeof t == "function" && sn.add(t);
}
function ps(t) {
  typeof t == "function" && sn.delete(t);
}
const j = /* @__PURE__ */ new Map();
let vn = {}, Ie = [], ft = "_404.md", ht = "_home.md";
function An(t) {
  t != null && (ft = String(t || ""));
}
function gs(t) {
  t != null && (ht = String(t || ""));
}
function ms(t) {
  vn = t || {};
}
const St = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Set();
function ws() {
  St.clear(), Yt.clear();
}
function bs(t) {
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
function Vt(t) {
  V.clear(), j.clear(), Ie = [], Me = Me || [];
  const e = Object.keys(vn || {});
  if (!e.length) return;
  let n = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? n = new URL(String(t)).pathname : n = String(t || "");
      } catch (s) {
        n = String(t || ""), console.warn("[slugManager] parse contentBase failed", s);
      }
      n = Mt(n);
    }
  } catch (s) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  n || (n = bs(e));
  for (const s of e) {
    let r = s;
    n && s.startsWith(n) ? r = be(s.slice(n.length)) : r = be(s), Ie.push(r);
    try {
      Pn();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const i = vn[s];
    if (typeof i == "string") {
      const a = (i || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const o = le(a[1].trim());
        if (o)
          try {
            let l = o;
            if ((!Me || !Me.length) && (l = Zr(l, new Set(V.keys()))), Me && Me.length) {
              const c = r.split("/")[0], d = Me.includes(c);
              let p = V.get(l);
              (!p || typeof p == "string") && (p = { default: typeof p == "string" ? p : void 0, langs: {} }), d ? p.langs[c] = r : p.default = r, V.set(l, p);
            } else
              V.set(l, r);
            j.set(r, l);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  Vt();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function le(t) {
  let n = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function Zr(t, e) {
  if (!e.has(t)) return t;
  let n = 2, s = `${t}-${n}`;
  for (; e.has(s); )
    n += 1, s = `${t}-${n}`;
  return s;
}
function ys(t) {
  return $t(t, void 0);
}
function $t(t, e) {
  if (!t) return !1;
  if (t.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    if (e && typeof e == "string")
      try {
        const n = new URL(t), s = new URL(e);
        return n.origin !== s.origin ? !0 : !n.pathname.startsWith(s.pathname);
      } catch {
        return !0;
      }
    return !0;
  }
  if (t.startsWith("/") && e && typeof e == "string")
    try {
      const n = new URL(t, e), s = new URL(e);
      return n.origin !== s.origin ? !0 : !n.pathname.startsWith(s.pathname);
    } catch {
      return !0;
    }
  return !1;
}
function Ft(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, n) => n);
}
function Pt(t) {
  if (!t || !V.has(t)) return null;
  const e = V.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Me && Me.length && Ve && e.langs && e.langs[Ve])
    return e.langs[Ve];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const vt = /* @__PURE__ */ new Map();
function ks() {
  vt.clear();
}
let Ee = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && V.has(i)) {
      const a = Pt(i) || V.get(i);
      a && a !== t && (t = a);
    }
  } catch (i) {
    console.warn("[slugManager] slug mapping normalization failed", i);
  }
  const n = e == null ? "" : _t(String(e));
  let s = "";
  try {
    if (n)
      if (/^[a-z][a-z0-9+.-]*:/i.test(n))
        s = n.replace(/\/$/, "") + "/" + t.replace(/^\//, "");
      else if (n.startsWith("/"))
        s = n.replace(/\/$/, "") + "/" + t.replace(/^\//, "");
      else {
        const i = typeof location < "u" && location.origin ? location.origin : "http://localhost", a = n.startsWith("/") ? n : "/" + n;
        s = i + a.replace(/\/$/, "") + "/" + t.replace(/^\//, "");
      }
    else
      s = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + t.replace(/^\//, "");
  } catch {
    s = "/" + t.replace(/^\//, "");
  }
  if (vt.has(s))
    return vt.get(s);
  const r = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const d = `${n}/${ft}`, p = await globalThis.fetch(d);
          if (p && typeof p.ok == "boolean" && p.ok)
            return { raw: await p.text(), status: 404 };
        } catch (d) {
          console.warn("[slugManager] fetching fallback 404 failed", d);
        }
      let c = "";
      try {
        i && typeof i.clone == "function" ? c = await i.clone().text() : i && typeof i.text == "function" ? c = await i.text() : c = "";
      } catch (d) {
        c = "", console.warn("[slugManager] reading error body failed", d);
      }
      throw console.error("fetchMarkdown failed:", { url: s, status: i ? i.status : void 0, statusText: i ? i.statusText : void 0, body: c.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await i.text(), o = a.trim().slice(0, 16).toLowerCase(), l = o.startsWith("<!doctype") || o.startsWith("<html"), h = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const c = `${n}/${ft}`, d = await globalThis.fetch(c);
        if (d.ok)
          return { raw: await d.text(), status: 404 };
      } catch (c) {
        console.warn("[slugManager] fetching fallback 404 failed", c);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return h ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return vt.set(s, r), r;
};
function xs(t) {
  typeof t == "function" && (Ee = t);
}
const Zt = /* @__PURE__ */ new Map();
function Ss(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let Fe = [], mt = null;
async function Jt(t, e = 1, n = void 0) {
  const s = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => be(String(r || ""))))) : [];
  try {
    const r = be(String(ft || ""));
    r && !s.includes(r) && s.push(r);
  } catch {
  }
  if (Fe && Fe.length && e === 1 && !Fe.some((i) => {
    try {
      return s.includes(be(String(i.path || "")));
    } catch {
      return !1;
    }
  }))
    return Fe;
  if (mt) return mt;
  mt = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((h) => be(String(h || ""))))) : [];
    try {
      const h = be(String(ft || ""));
      h && !r.includes(h) && r.push(h);
    } catch {
    }
    const i = (h) => {
      if (!r || !r.length) return !1;
      for (const c of r)
        if (c && (h === c || h.startsWith(c + "/")))
          return !0;
      return !1;
    };
    let a = [];
    if (Ie && Ie.length && (a = Array.from(Ie)), !a.length)
      for (const h of V.values())
        h && a.push(h);
    try {
      const h = await Kr(t);
      h && h.length && (a = a.concat(h));
    } catch (h) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", h);
    }
    try {
      const h = new Set(a), c = [...a];
      for (h.size; c.length && h.size <= It; ) {
        const d = c.shift();
        try {
          const p = await Ee(d, t);
          if (p && p.raw) {
            if (p.status === 404) continue;
            let f = p.raw;
            const u = [], g = String(d || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(g) && In && (!d || !d.includes("/")))
              continue;
            const m = Ss(f), b = /\[[^\]]+\]\(([^)]+)\)/g;
            let y;
            for (; y = b.exec(m); )
              u.push(y[1]);
            const S = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; y = S.exec(m); )
              u.push(y[1]);
            const L = d && d.includes("/") ? d.substring(0, d.lastIndexOf("/") + 1) : "";
            for (let I of u)
              try {
                if ($t(I, t) || I.startsWith("..") || I.indexOf("/../") !== -1 || (L && !I.startsWith("./") && !I.startsWith("/") && !I.startsWith("../") && (I = L + I), I = be(I), !/\.(md|html?)(?:$|[?#])/i.test(I)) || (I = I.split(/[?#]/)[0], i(I))) continue;
                h.has(I) || (h.add(I), c.push(I), a.push(I));
              } catch (U) {
                console.warn("[slugManager] href processing failed", I, U);
              }
          }
        } catch (p) {
          console.warn("[slugManager] discovery fetch failed for", d, p);
        }
      }
    } catch (h) {
      console.warn("[slugManager] discovery loop failed", h);
    }
    const o = /* @__PURE__ */ new Set();
    a = a.filter((h) => !h || o.has(h) || i(h) ? !1 : (o.add(h), !0));
    const l = [];
    for (const h of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(h))
        try {
          const c = await Ee(h, t);
          if (c && c.raw) {
            if (c.status === 404) continue;
            let d = "", p = "";
            if (c.isHtml)
              try {
                const g = new DOMParser().parseFromString(c.raw, "text/html"), m = g.querySelector("title") || g.querySelector("h1");
                m && m.textContent && (d = m.textContent.trim());
                const b = g.querySelector("p");
                if (b && b.textContent && (p = b.textContent.trim()), e >= 2)
                  try {
                    const y = g.querySelector("h1"), S = y && y.textContent ? y.textContent.trim() : d || "", L = (() => {
                      try {
                        if (j.has(h)) return j.get(h);
                      } catch {
                      }
                      return le(d || h);
                    })(), I = Array.from(g.querySelectorAll("h2"));
                    for (const U of I)
                      try {
                        const Z = (U.textContent || "").trim();
                        if (!Z) continue;
                        const F = U.id ? U.id : le(Z), fe = L ? `${L}::${F}` : `${le(h)}::${F}`;
                        let $ = "", q = U.nextElementSibling;
                        for (; q && q.tagName && q.tagName.toLowerCase() === "script"; ) q = q.nextElementSibling;
                        q && q.textContent && ($ = String(q.textContent).trim()), l.push({ slug: fe, title: Z, excerpt: $, path: h, parentTitle: S });
                      } catch (Z) {
                        console.warn("[slugManager] indexing H2 failed", Z);
                      }
                    if (e === 3)
                      try {
                        const U = Array.from(g.querySelectorAll("h3"));
                        for (const Z of U)
                          try {
                            const F = (Z.textContent || "").trim();
                            if (!F) continue;
                            const fe = Z.id ? Z.id : le(F), $ = L ? `${L}::${fe}` : `${le(h)}::${fe}`;
                            let q = "", Q = Z.nextElementSibling;
                            for (; Q && Q.tagName && Q.tagName.toLowerCase() === "script"; ) Q = Q.nextElementSibling;
                            Q && Q.textContent && (q = String(Q.textContent).trim()), l.push({ slug: $, title: F, excerpt: q, path: h, parentTitle: S });
                          } catch (F) {
                            console.warn("[slugManager] indexing H3 failed", F);
                          }
                      } catch (U) {
                        console.warn("[slugManager] collect H3s failed", U);
                      }
                  } catch (y) {
                    console.warn("[slugManager] collect H2s failed", y);
                  }
              } catch (u) {
                console.warn("[slugManager] parsing HTML for index failed", u);
              }
            else {
              const u = c.raw, g = u.match(/^#\s+(.+)$/m);
              d = g ? g[1].trim() : "";
              try {
                d = Ft(d);
              } catch {
              }
              const m = u.split(/\r?\n\s*\r?\n/);
              if (m.length > 1)
                for (let b = 1; b < m.length; b++) {
                  const y = m[b].trim();
                  if (y && !/^#/.test(y)) {
                    p = y.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e >= 2) {
                let b = "", y = "";
                try {
                  const S = (u.match(/^#\s+(.+)$/m) || [])[1];
                  b = S ? S.trim() : "", y = (function() {
                    try {
                      if (j.has(h)) return j.get(h);
                    } catch {
                    }
                    return le(d || h);
                  })();
                  const L = /^##\s+(.+)$/gm;
                  let I;
                  for (; I = L.exec(u); )
                    try {
                      const U = (I[1] || "").trim(), Z = Ft(U);
                      if (!U) continue;
                      const F = le(U), fe = y ? `${y}::${F}` : `${le(h)}::${F}`, q = u.slice(L.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), Q = q && q[1] ? String(q[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      l.push({ slug: fe, title: Z, excerpt: Q, path: h, parentTitle: b });
                    } catch (U) {
                      console.warn("[slugManager] indexing markdown H2 failed", U);
                    }
                } catch (S) {
                  console.warn("[slugManager] collect markdown H2s failed", S);
                }
                if (e === 3)
                  try {
                    const S = /^###\s+(.+)$/gm;
                    let L;
                    for (; L = S.exec(u); )
                      try {
                        const I = (L[1] || "").trim(), U = Ft(I);
                        if (!I) continue;
                        const Z = le(I), F = y ? `${y}::${Z}` : `${le(h)}::${Z}`, $ = u.slice(S.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), q = $ && $[1] ? String($[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        l.push({ slug: F, title: U, excerpt: q, path: h, parentTitle: b });
                      } catch (I) {
                        console.warn("[slugManager] indexing markdown H3 failed", I);
                      }
                  } catch (S) {
                    console.warn("[slugManager] collect markdown H3s failed", S);
                  }
              }
            }
            let f = "";
            try {
              j.has(h) && (f = j.get(h));
            } catch (u) {
              console.warn("[slugManager] mdToSlug access failed", u);
            }
            f || (f = le(d || h)), l.push({ slug: f, title: d, excerpt: p, path: h });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    try {
      Fe = l.filter((c) => {
        try {
          return !i(String(c.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (h) {
      console.warn("[slugManager] filtering index by excludes failed", h), Fe = l;
    }
    return Fe;
  })();
  try {
    await mt;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return mt = null, Fe;
}
const Gr = 1e3;
let It = Gr;
function vs(t) {
  typeof t == "number" && t >= 0 && (It = t);
}
const Qr = new DOMParser(), Xr = "a[href]";
let Nn = async function(t, e, n = It) {
  if (Zt.has(t)) return Zt.get(t);
  let s = null;
  const r = /* @__PURE__ */ new Set(), i = [""];
  for (; i.length && !s && !(i.length > n); ) {
    const a = i.shift();
    if (r.has(a)) continue;
    r.add(a);
    let o = e;
    o.endsWith("/") || (o += "/"), o += a;
    try {
      let l;
      try {
        l = await globalThis.fetch(o);
      } catch (p) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: o, error: p });
        continue;
      }
      if (!l || !l.ok) {
        l && !l.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: o, status: l.status });
        continue;
      }
      const h = await l.text(), d = Qr.parseFromString(h, "text/html").querySelectorAll(Xr);
      for (const p of d)
        try {
          let f = p.getAttribute("href") || "";
          if (!f || $t(f, e) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
          if (f.endsWith("/")) {
            const u = a + f;
            r.has(u) || i.push(u);
            continue;
          }
          if (f.toLowerCase().endsWith(".md")) {
            const u = be(a + f);
            try {
              if (j.has(u))
                continue;
              for (const g of V.values())
                ;
            } catch (g) {
              console.warn("[slugManager] slug map access failed", g);
            }
            try {
              const g = await Ee(u, e);
              if (g && g.raw) {
                const m = (g.raw || "").match(/^#\s+(.+)$/m);
                if (m && m[1] && le(m[1].trim()) === t) {
                  s = u;
                  break;
                }
              }
            } catch (g) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", g);
            }
          }
        } catch (f) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", f);
        }
    } catch (l) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", l);
    }
  }
  return Zt.set(t, s), s;
};
async function Kr(t, e = It) {
  const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = [""];
  for (; r.length && !(r.length > e); ) {
    const i = r.shift();
    if (s.has(i)) continue;
    s.add(i);
    let a = t;
    a.endsWith("/") || (a += "/"), a += i;
    try {
      let o;
      try {
        o = await globalThis.fetch(a);
      } catch (d) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: a, error: d });
        continue;
      }
      if (!o || !o.ok) {
        o && !o.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: a, status: o.status });
        continue;
      }
      const l = await o.text(), c = Qr.parseFromString(l, "text/html").querySelectorAll(Xr);
      for (const d of c)
        try {
          let p = d.getAttribute("href") || "";
          if (!p || $t(p, t) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const u = i + p;
            s.has(u) || r.push(u);
            continue;
          }
          const f = (i + p).replace(/^\/+/, "");
          /\.(md|html?)$/i.test(f) && n.add(f);
        } catch (p) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", p);
        }
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", o);
    }
  }
  return Array.from(n);
}
async function Yr(t, e, n) {
  if (t && typeof t == "string" && (t = be(t), t = _t(t)), V.has(t))
    return Pt(t) || V.get(t);
  for (const r of sn)
    try {
      const i = await r(t, e);
      if (i)
        return Xe(t, i), j.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Ie && Ie.length) {
    if (St.has(t)) {
      const r = St.get(t);
      return V.set(t, r), j.set(r, t), r;
    }
    for (const r of Ie)
      if (!Yt.has(r))
        try {
          const i = await Ee(r, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const o = le(a[1].trim());
              if (Yt.add(r), o && St.set(o, r), o === t)
                return Xe(t, r), j.set(r, t), r;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const r = await Jt(e);
    if (r && r.length) {
      const i = r.find((a) => a.slug === t);
      if (i)
        return Xe(t, i.path), j.set(i.path, t), i.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Nn(t, e, n);
    if (r)
      return Xe(t, r), j.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const r of s)
    try {
      const i = await Ee(r, e);
      if (i && i.raw)
        return Xe(t, r), j.set(r, t), r;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Ie && Ie.length)
    for (const r of Ie)
      try {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (le(i) === t)
          return Xe(t, r), j.set(r, t), r;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const r = [];
    ht && typeof ht == "string" && ht.trim() && r.push(ht), r.includes("_home.md") || r.push("_home.md");
    for (const i of r)
      try {
        const a = await Ee(i, e);
        if (a && a.raw) {
          const o = (a.raw || "").match(/^#\s+(.+)$/m);
          if (o && o[1] && le(o[1].trim()) === t)
            return Xe(t, i), j.set(i, t), i;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const Gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Gr,
  _setAllMd: ms,
  _storeSlugMapping: Xe,
  addSlugResolver: fs,
  get allMarkdownPaths() {
    return Ie;
  },
  get availableLanguages() {
    return Me;
  },
  buildSearchIndex: Jt,
  buildSearchIndexWorker: hs,
  clearFetchCache: ks,
  clearListCaches: ws,
  crawlAllMarkdown: Kr,
  crawlCache: Zt,
  crawlForSlug: Nn,
  crawlForSlugWorker: ds,
  get defaultCrawlMaxQueue() {
    return It;
  },
  ensureSlug: Yr,
  fetchCache: vt,
  get fetchMarkdown() {
    return Ee;
  },
  getLanguages: us,
  get homePage() {
    return ht;
  },
  initSlugWorker: zn,
  isExternalLink: ys,
  isExternalLinkWithBase: $t,
  listPathsFetched: Yt,
  listSlugCache: St,
  mdToSlug: j,
  get notFoundPage() {
    return ft;
  },
  removeSlugResolver: ps,
  resolveSlugPath: Pt,
  get searchIndex() {
    return Fe;
  },
  setContentBase: Vt,
  setDefaultCrawlMaxQueue: vs,
  setFetchMarkdown: xs,
  setHomePage: gs,
  setLanguages: jr,
  setNotFoundPage: An,
  setSkipRootReadme: cs,
  get skipRootReadme() {
    return In;
  },
  slugResolvers: sn,
  slugToMd: V,
  slugify: le,
  unescapeMarkdown: Ft,
  uniqueSlug: Zr
}, Symbol.toStringTag, { value: "Module" }));
let Vr = 100;
function gr(t) {
  Vr = t;
}
let At = 300 * 1e3;
function mr(t) {
  At = t;
}
const Ne = /* @__PURE__ */ new Map();
function As(t) {
  if (!Ne.has(t)) return;
  const e = Ne.get(t), n = Date.now();
  if (e.ts + At < n) {
    Ne.delete(t);
    return;
  }
  return Ne.delete(t), Ne.set(t, e), e.value;
}
function Es(t, e) {
  if (wr(), wr(), Ne.delete(t), Ne.set(t, { value: e, ts: Date.now() }), Ne.size > Vr) {
    const n = Ne.keys().next().value;
    n !== void 0 && Ne.delete(n);
  }
}
function wr() {
  if (!At || At <= 0) return;
  const t = Date.now();
  for (const [e, n] of Ne.entries())
    n.ts + At < t && Ne.delete(e);
}
async function Ls(t, e) {
  const n = new Set(je), s = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(s || [])) {
    const i = r.getAttribute("href") || "";
    if (i)
      try {
        const a = new URL(i, location.href);
        if (a.origin !== location.origin) continue;
        const o = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (o) {
          let d = be(o[1]);
          d && n.add(d);
          continue;
        }
        const l = (r.textContent || "").trim(), h = (a.pathname || "").replace(/^.*\//, "");
        if (l && le(l) === t || h && le(h.replace(/\.(html?|md)$/i, "")) === t) return a.toString();
        if (/\.(html?)$/i.test(a.pathname)) {
          let d = a.pathname.replace(/^\//, "");
          n.add(d);
          continue;
        }
        const c = a.pathname || "";
        if (c) {
          const d = new URL(e), p = Mt(d.pathname);
          if (c.indexOf(p) !== -1) {
            let f = c.startsWith(p) ? c.slice(p.length) : c;
            f = be(f), f && n.add(f);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const i = await Ee(r, e);
      if (!i || !i.raw) continue;
      const a = (i.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const o = (a[1] || "").trim();
        if (o && le(o) === t)
          return r;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function Ts(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (V.has(n)) {
        const s = Pt(n) || V.get(n);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (je && je.size)
          for (const s of je) {
            const r = s.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (le(r) === n && !/index\.html$/i.test(s)) {
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
async function Cs(t, e) {
  const n = t || "", s = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let r = t || "", i = null;
  if (r && String(r).includes("::")) {
    const u = String(r).split("::", 2);
    r = u[0], i = u[1] || null;
  }
  const o = `${t}|||${typeof is < "u" && Ve ? Ve : ""}`, l = As(o);
  if (l)
    r = l.resolved, i = l.anchor || i;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let u = decodeURIComponent(String(r || ""));
      if (u && typeof u == "string" && (u = be(u), u = _t(u)), V.has(u))
        r = Pt(u) || V.get(u);
      else {
        let g = await Ls(u, e);
        if (g)
          r = g;
        else if (Pn._refreshed && je && je.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const m = await Yr(u, e);
          m && (r = m);
        }
      }
    }
    Es(o, { resolved: r, anchor: i });
  }
  !i && s && (i = s);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const u = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const g = await fetch(u);
        if (g && g.ok) {
          const m = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", y = (m || "").toLowerCase();
          if (b && b.indexOf && b.indexOf("text/html") !== -1 || y.indexOf("<!doctype") !== -1 || y.indexOf("<html") !== -1)
            return { data: { raw: m, isHtml: !0 }, pagePath: u.replace(/^\//, ""), anchor: i };
        }
      } catch {
      }
    }
  } catch {
  }
  const h = Ts(r), c = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (c && h.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && h.push(r), h.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && h.push(r), h.length === 1 && /index\.html$/i.test(h[0]) && !c && !V.has(r) && !V.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let d = null, p = null, f = null;
  for (const u of h)
    if (u)
      try {
        const g = be(u);
        d = await Ee(g, e), p = g;
        break;
      } catch (g) {
        f = g;
        try {
          console.warn("[router] candidate fetch failed", { candidate: u, contentBase: e, err: g && g.message || g });
        } catch {
        }
      }
  if (!d) {
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: h, contentBase: e, fetchError: f && (f.message || String(f)) || null });
    } catch {
    }
    try {
      if (c && String(n || "").toLowerCase().includes(".html"))
        try {
          const u = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", u);
          const g = await fetch(u);
          if (g && g.ok) {
            const m = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", y = (m || "").toLowerCase(), S = b && b.indexOf && b.indexOf("text/html") !== -1 || y.indexOf("<!doctype") !== -1 || y.indexOf("<html") !== -1;
            if (S || console.warn("[router] absolute fetch returned non-HTML", { abs: u, contentType: b, snippet: y.slice(0, 200) }), S)
              try {
                const L = u, I = new URL(".", L).toString();
                try {
                  const Z = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (Z) {
                    const F = Z.parseFromString(m || "", "text/html"), fe = (O, oe) => {
                      try {
                        const X = oe.getAttribute(O) || "";
                        if (!X || /^(https?:)?\/\//i.test(X) || X.startsWith("/") || X.startsWith("#")) return;
                        try {
                          const v = new URL(X, L).toString();
                          oe.setAttribute(O, v);
                        } catch (v) {
                          console.warn("[router] rewrite attribute failed", O, v);
                        }
                      } catch (X) {
                        console.warn("[router] rewrite helper failed", X);
                      }
                    }, $ = F.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), q = [];
                    for (const O of Array.from($ || []))
                      try {
                        const oe = O.tagName ? O.tagName.toLowerCase() : "";
                        if (oe === "a") continue;
                        if (O.hasAttribute("src")) {
                          const X = O.getAttribute("src");
                          fe("src", O);
                          const v = O.getAttribute("src");
                          X !== v && q.push({ attr: "src", tag: oe, before: X, after: v });
                        }
                        if (O.hasAttribute("href") && oe === "link") {
                          const X = O.getAttribute("href");
                          fe("href", O);
                          const v = O.getAttribute("href");
                          X !== v && q.push({ attr: "href", tag: oe, before: X, after: v });
                        }
                        if (O.hasAttribute("href") && oe !== "link") {
                          const X = O.getAttribute("href");
                          fe("href", O);
                          const v = O.getAttribute("href");
                          X !== v && q.push({ attr: "href", tag: oe, before: X, after: v });
                        }
                        if (O.hasAttribute("xlink:href")) {
                          const X = O.getAttribute("xlink:href");
                          fe("xlink:href", O);
                          const v = O.getAttribute("xlink:href");
                          X !== v && q.push({ attr: "xlink:href", tag: oe, before: X, after: v });
                        }
                        if (O.hasAttribute("poster")) {
                          const X = O.getAttribute("poster");
                          fe("poster", O);
                          const v = O.getAttribute("poster");
                          X !== v && q.push({ attr: "poster", tag: oe, before: X, after: v });
                        }
                        if (O.hasAttribute("srcset")) {
                          const J = (O.getAttribute("srcset") || "").split(",").map((re) => re.trim()).filter(Boolean).map((re) => {
                            const [A, T] = re.split(/\s+/, 2);
                            if (!A || /^(https?:)?\/\//i.test(A) || A.startsWith("/")) return re;
                            try {
                              const C = new URL(A, L).toString();
                              return T ? `${C} ${T}` : C;
                            } catch {
                              return re;
                            }
                          }).join(", ");
                          O.setAttribute("srcset", J);
                        }
                      } catch {
                      }
                    const Q = F.documentElement && F.documentElement.outerHTML ? F.documentElement.outerHTML : m;
                    try {
                      q && q.length && console.warn("[router] rewritten asset refs", { abs: u, rewritten: q });
                    } catch {
                    }
                    return { data: { raw: Q, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
                  }
                } catch {
                }
                let U = m;
                return /<base\s+[^>]*>/i.test(m) || (/<head[^>]*>/i.test(m) ? U = m.replace(/(<head[^>]*>)/i, `$1<base href="${I}">`) : U = `<base href="${I}">` + m), { data: { raw: U, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
              } catch {
                return { data: { raw: m, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
              }
          }
        } catch (u) {
          console.warn("[router] absolute HTML fetch fallback failed", u);
        }
    } catch {
    }
    try {
      const u = decodeURIComponent(String(r || ""));
      if (u && !/\.(md|html?)$/i.test(u)) {
        const g = [
          `/assets/${u}.html`,
          `/assets/${u}/index.html`
        ];
        for (const m of g)
          try {
            const b = await fetch(m, { method: "GET" });
            if (b && b.ok)
              return { data: { raw: await b.text(), isHtml: !0 }, pagePath: m.replace(/^\//, ""), anchor: i };
          } catch {
          }
      }
    } catch (u) {
      console.warn("[router] assets fallback failed", u);
    }
    throw new Error("no page data");
  }
  return { data: d, pagePath: p, anchor: i };
}
function Bn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var at = Bn();
function Jr(t) {
  at = t;
}
var it = { exec: () => null };
function se(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(_e.caret, "$1"), n = n.replace(r, a), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Rs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), _e = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Ms = /^(?:[ \t]*(?:\n|$))+/, _s = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, $s = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, zt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ps = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, On = / {0,3}(?:[*+-]|\d{1,9}[.)])/, ei = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ti = se(ei).replace(/bull/g, On).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Is = se(ei).replace(/bull/g, On).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), qn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, zs = /^[^\n]+/, Dn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ns = se(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Dn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Bs = se(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, On).getRegex(), an = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Hn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Os = se("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Hn).replace("tag", an).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ni = se(qn).replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", an).getRegex(), qs = se(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ni).getRegex(), Un = { blockquote: qs, code: _s, def: Ns, fences: $s, heading: Ps, hr: zt, html: Os, lheading: ti, list: Bs, newline: Ms, paragraph: ni, table: it, text: zs }, br = se("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", an).getRegex(), Ds = { ...Un, lheading: Is, table: br, paragraph: se(qn).replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", br).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", an).getRegex() }, Hs = { ...Un, html: se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Hn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: it, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: se(qn).replace("hr", zt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ti).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Us = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, js = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ri = /^( {2,}|\\)\n(?!\s*$)/, Ws = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ln = /[\p{P}\p{S}]/u, jn = /[\s\p{P}\p{S}]/u, ii = /[^\s\p{P}\p{S}]/u, Fs = se(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, jn).getRegex(), si = /(?!~)[\p{P}\p{S}]/u, Zs = /(?!~)[\s\p{P}\p{S}]/u, Gs = /(?:[^\s\p{P}\p{S}]|~)/u, ai = /(?![*_])[\p{P}\p{S}]/u, Qs = /(?![*_])[\s\p{P}\p{S}]/u, Xs = /(?:[^\s\p{P}\p{S}]|[*_])/u, Ks = se(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Rs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), li = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Ys = se(li, "u").replace(/punct/g, ln).getRegex(), Vs = se(li, "u").replace(/punct/g, si).getRegex(), oi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Js = se(oi, "gu").replace(/notPunctSpace/g, ii).replace(/punctSpace/g, jn).replace(/punct/g, ln).getRegex(), ea = se(oi, "gu").replace(/notPunctSpace/g, Gs).replace(/punctSpace/g, Zs).replace(/punct/g, si).getRegex(), ta = se("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ii).replace(/punctSpace/g, jn).replace(/punct/g, ln).getRegex(), na = se(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ai).getRegex(), ra = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ia = se(ra, "gu").replace(/notPunctSpace/g, Xs).replace(/punctSpace/g, Qs).replace(/punct/g, ai).getRegex(), sa = se(/\\(punct)/, "gu").replace(/punct/g, ln).getRegex(), aa = se(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), la = se(Hn).replace("(?:-->|$)", "-->").getRegex(), oa = se("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", la).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), en = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ca = se(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", en).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ci = se(/^!?\[(label)\]\[(ref)\]/).replace("label", en).replace("ref", Dn).getRegex(), ui = se(/^!?\[(ref)\](?:\[\])?/).replace("ref", Dn).getRegex(), ua = se("reflink|nolink(?!\\()", "g").replace("reflink", ci).replace("nolink", ui).getRegex(), yr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Wn = { _backpedal: it, anyPunctuation: sa, autolink: aa, blockSkip: Ks, br: ri, code: js, del: it, delLDelim: it, delRDelim: it, emStrongLDelim: Ys, emStrongRDelimAst: Js, emStrongRDelimUnd: ta, escape: Us, link: ca, nolink: ui, punctuation: Fs, reflink: ci, reflinkSearch: ua, tag: oa, text: Ws, url: it }, ha = { ...Wn, link: se(/^!?\[(label)\]\((.*?)\)/).replace("label", en).getRegex(), reflink: se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", en).getRegex() }, En = { ...Wn, emStrongRDelimAst: ea, emStrongLDelim: Vs, delLDelim: na, delRDelim: ia, url: se(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", yr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: se(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", yr).getRegex() }, da = { ...En, br: se(ri).replace("{2,}", "*").getRegex(), text: se(En.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Wt = { normal: Un, gfm: Ds, pedantic: Hs }, wt = { normal: Wn, gfm: En, breaks: da, pedantic: ha }, fa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, kr = (t) => fa[t];
function Ue(t, e) {
  if (e) {
    if (_e.escapeTest.test(t)) return t.replace(_e.escapeReplace, kr);
  } else if (_e.escapeTestNoEncode.test(t)) return t.replace(_e.escapeReplaceNoEncode, kr);
  return t;
}
function xr(t) {
  try {
    t = encodeURI(t).replace(_e.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function Sr(t, e) {
  let n = t.replace(_e.findPipe, (i, a, o) => {
    let l = !1, h = a;
    for (; --h >= 0 && o[h] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), s = n.split(_e.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(_e.slashPipe, "|");
  return s;
}
function bt(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function pa(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) n++;
  else if (t[s] === e[1] && (n--, n < 0)) return s;
  return n > 0 ? -2 : -1;
}
function ga(t, e = 0) {
  let n = e, s = "";
  for (let r of t) if (r === "	") {
    let i = 4 - n % 4;
    s += " ".repeat(i), n += i;
  } else s += r, n++;
  return s;
}
function vr(t, e, n, s, r) {
  let i = e.href, a = e.title || null, o = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: o, tokens: s.inlineTokens(o) };
  return s.state.inLink = !1, l;
}
function ma(t, e, n) {
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
var tn = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || at;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : bt(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = ma(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = bt(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: bt(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = bt(e[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let a = !1, o = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), a = !0;
        else if (!a) o.push(n[l]);
        else break;
        n = n.slice(l);
        let h = o.join(`
`), c = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${h}` : h, r = r ? `${r}
${c}` : c;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = d, n.length === 0) break;
        let p = i.at(-1);
        if (p?.type === "code") break;
        if (p?.type === "blockquote") {
          let f = p, u = f.raw + `
` + n.join(`
`), g = this.blockquote(u);
          i[i.length - 1] = g, s = s.substring(0, s.length - f.raw.length) + g.raw, r = r.substring(0, r.length - f.text.length) + g.text;
          break;
        } else if (p?.type === "list") {
          let f = p, u = f.raw + `
` + n.join(`
`), g = this.list(u);
          i[i.length - 1] = g, s = s.substring(0, s.length - p.raw.length) + g.raw, r = r.substring(0, r.length - f.raw.length) + g.raw, n = u.substring(i.at(-1).raw.length).split(`
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
        let l = !1, h = "", c = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        h = e[0], t = t.substring(h.length);
        let d = ga(e[2].split(`
`, 1)[0], e[1].length), p = t.split(`
`, 1)[0], f = !d.trim(), u = 0;
        if (this.options.pedantic ? (u = 2, c = d.trimStart()) : f ? u = e[1].length + 1 : (u = d.search(this.rules.other.nonSpaceChar), u = u > 4 ? 1 : u, c = d.slice(u), u += e[1].length), f && this.rules.other.blankLine.test(p) && (h += p + `
`, t = t.substring(p.length + 1), l = !0), !l) {
          let g = this.rules.other.nextBulletRegex(u), m = this.rules.other.hrRegex(u), b = this.rules.other.fencesBeginRegex(u), y = this.rules.other.headingBeginRegex(u), S = this.rules.other.htmlBeginRegex(u), L = this.rules.other.blockquoteBeginRegex(u);
          for (; t; ) {
            let I = t.split(`
`, 1)[0], U;
            if (p = I, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), U = p) : U = p.replace(this.rules.other.tabCharGlobal, "    "), b.test(p) || y.test(p) || S.test(p) || L.test(p) || g.test(p) || m.test(p)) break;
            if (U.search(this.rules.other.nonSpaceChar) >= u || !p.trim()) c += `
` + U.slice(u);
            else {
              if (f || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(d) || y.test(d) || m.test(d)) break;
              c += `
` + p;
            }
            f = !p.trim(), h += I + `
`, t = t.substring(I.length + 1), d = U.slice(u);
          }
        }
        r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (a = !0)), r.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += h;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let l of r.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
              this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (h) {
            let c = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            l.checked = c.checked, r.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let h = l.tokens.filter((d) => d.type === "space"), c = h.length > 0 && h.some((d) => this.rules.other.anyLine.test(d.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let l of r.items) {
        l.loose = !0;
        for (let h of l.tokens) h.type === "text" && (h.type = "paragraph");
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
    let n = Sr(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < n.length; a++) i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] });
      for (let a of r) i.rows.push(Sr(a, i.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: i.align[l] })));
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
        let i = bt(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = pa(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), vr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return vr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, i, a, o = r, l = 0, h = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = h.exec(e)) != null; ) {
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
        let c = [...s[0]][0].length, d = t.slice(0, r + s.index + c + a);
        if (Math.min(r, a) % 2) {
          let f = d.slice(1, -1);
          return { type: "em", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let p = d.slice(2, -2);
        return { type: "strong", raw: d, text: p, tokens: this.lexer.inlineTokens(p) };
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
        let h = [...s[0]][0].length, c = t.slice(0, r + s.index + h + a), d = c.slice(r, -r);
        return { type: "del", raw: c, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, Oe = class Ln {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || at, this.options.tokenizer = this.options.tokenizer || new tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: _e, block: Wt.normal, inline: wt.normal };
    this.options.pedantic ? (n.block = Wt.pedantic, n.inline = wt.pedantic) : this.options.gfm && (n.block = Wt.gfm, this.options.breaks ? n.inline = wt.breaks : n.inline = wt.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Wt, inline: wt };
  }
  static lex(e, n) {
    return new Ln(n).lex(e);
  }
  static lexInline(e, n) {
    return new Ln(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(_e.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(_e.tabCharGlobal, "    ").replace(_e.spaceLine, "")); e; ) {
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
        this.options.extensions.startBlock.forEach((h) => {
          l = h.call({ lexer: this }, o), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
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
      if (this.options.extensions?.inline?.some((c) => (l = c.call({ lexer: this }, e, n)) ? (e = e.substring(l.raw.length), n.push(l), !0) : !1)) continue;
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
        let c = n.at(-1);
        l.type === "text" && c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : n.push(l);
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
      let h = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, d = e.slice(1), p;
        this.options.extensions.startInline.forEach((f) => {
          p = f.call({ lexer: this }, d), typeof p == "number" && p >= 0 && (c = Math.min(c, p));
        }), c < 1 / 0 && c >= 0 && (h = e.substring(0, c + 1));
      }
      if (l = this.tokenizer.inlineText(h)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (o = l.raw.slice(-1)), a = !0;
        let c = n.at(-1);
        c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : n.push(l);
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
    return n;
  }
}, nn = class {
  options;
  parser;
  constructor(t) {
    this.options = t || at;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(_e.notSpaceStart)?.[0], r = t.replace(_e.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + Ue(s) + '">' + (n ? r : Ue(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Ue(r, !0)) + `</code></pre>
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
    return `<code>${Ue(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let s = this.parser.parseInline(n), r = xr(t);
    if (r === null) return s;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + Ue(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = xr(t);
    if (r === null) return Ue(n);
    t = r;
    let i = `<img src="${t}" alt="${Ue(n)}"`;
    return e && (i += ` title="${Ue(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Ue(t.text);
  }
}, Fn = class {
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
}, qe = class Tn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || at, this.options.renderer = this.options.renderer || new nn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fn();
  }
  static parse(e, n) {
    return new Tn(n).parse(e);
  }
  static parseInline(e, n) {
    return new Tn(n).parseInline(e);
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
}, kt = class {
  options;
  block;
  constructor(t) {
    this.options = t || at;
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
    return this.block ? Oe.lex : Oe.lexInline;
  }
  provideParser() {
    return this.block ? qe.parse : qe.parseInline;
  }
}, wa = class {
  defaults = Bn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = qe;
  Renderer = nn;
  TextRenderer = Fn;
  Lexer = Oe;
  Tokenizer = tn;
  Hooks = kt;
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
        let r = this.defaults.renderer || new nn(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let a = i, o = n.renderer[a], l = r[a];
          r[a] = (...h) => {
            let c = o.apply(r, h);
            return c === !1 && (c = l.apply(r, h)), c || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new tn(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let a = i, o = n.tokenizer[a], l = r[a];
          r[a] = (...h) => {
            let c = o.apply(r, h);
            return c === !1 && (c = l.apply(r, h)), c;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new kt();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, o = n.hooks[a], l = r[a];
          kt.passThroughHooks.has(i) ? r[a] = (h) => {
            if (this.defaults.async && kt.passThroughHooksRespectAsync.has(i)) return (async () => {
              let d = await o.call(r, h);
              return l.call(r, d);
            })();
            let c = o.call(r, h);
            return l.call(r, c);
          } : r[a] = (...h) => {
            if (this.defaults.async) return (async () => {
              let d = await o.apply(r, h);
              return d === !1 && (d = await l.apply(r, h)), d;
            })();
            let c = o.apply(r, h);
            return c === !1 && (c = l.apply(r, h)), c;
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
    return Oe.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return qe.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let s = { ...n }, r = { ...this.defaults, ...s }, i = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let a = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer() : t ? Oe.lex : Oe.lexInline)(a, r), l = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let h = await (r.hooks ? await r.hooks.provideParser() : t ? qe.parse : qe.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let a = (r.hooks ? r.hooks.provideLexer() : t ? Oe.lex : Oe.lexInline)(e, r);
        r.hooks && (a = r.hooks.processAllTokens(a)), r.walkTokens && this.walkTokens(a, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser() : t ? qe.parse : qe.parseInline)(a, r);
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
        let s = "<p>An error occurred:</p><pre>" + Ue(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, st = new wa();
function ae(t, e) {
  return st.parse(t, e);
}
ae.options = ae.setOptions = function(t) {
  return st.setOptions(t), ae.defaults = st.defaults, Jr(ae.defaults), ae;
};
ae.getDefaults = Bn;
ae.defaults = at;
ae.use = function(...t) {
  return st.use(...t), ae.defaults = st.defaults, Jr(ae.defaults), ae;
};
ae.walkTokens = function(t, e) {
  return st.walkTokens(t, e);
};
ae.parseInline = st.parseInline;
ae.Parser = qe;
ae.parser = qe.parse;
ae.Renderer = nn;
ae.TextRenderer = Fn;
ae.Lexer = Oe;
ae.lexer = Oe.lex;
ae.Tokenizer = tn;
ae.Hooks = kt;
ae.parse = ae;
ae.options;
ae.setOptions;
ae.use;
ae.walkTokens;
ae.parseInline;
qe.parse;
Oe.lex;
const hi = `function j() {
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
const ct = "https://cdn.jsdelivr.net/npm/highlight.js";
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
`, Ar = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", hi], { type: "text/javascript;charset=utf-8" });
function ba(t) {
  let e;
  try {
    if (e = Ar && (self.URL || self.webkitURL).createObjectURL(Ar), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(hi),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function ya(t) {
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
const di = Hr(() => new ba(), "markdown"), Er = typeof DOMParser < "u" ? new DOMParser() : null;
function Cn() {
  return di.get();
}
function ka(t) {
  return di.send(t, 1e3);
}
const Je = [];
function Rn(t) {
  if (t && typeof t == "object") {
    Je.push(t);
    try {
      ae.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function xa(t) {
  Je.length = 0, Array.isArray(t) && Je.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Je.forEach((e) => ae.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function rn(t) {
  if (Cn && Cn())
    try {
      const i = await ka({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const o = (Er || new DOMParser()).parseFromString(i.html, "text/html"), l = o.querySelectorAll("h1,h2,h3,h4,h5,h6"), h = /* @__PURE__ */ new Set(), c = (f) => {
            f || (f = "heading");
            let u = f, g = 2;
            for (; h.has(u); )
              u = `${f}-${g}`, g += 1;
            return h.add(u), u;
          };
          l.forEach((f) => {
            if (f.id)
              f.id = c(f.id);
            else {
              const u = le(f.textContent || "");
              f.id = c(u);
            }
            try {
              const u = Number(f.tagName.substring(1));
              if (u >= 1 && u <= 6) {
                const g = {
                  1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
                  2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
                  3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
                  4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
                  5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
                  6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
                }, m = u <= 2 ? "has-text-weight-bold" : u <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
                `${g[u]} ${m}`.split(/\s+/).filter(Boolean).forEach((y) => {
                  try {
                    f.classList.add(y);
                  } catch {
                  }
                });
              }
            } catch {
            }
          });
          try {
            try {
              const u = typeof document < "u" && document.documentElement && document.documentElement.getAttribute ? document.documentElement.getAttribute("data-nimbi-logo-moved") : null;
              if (u) {
                const g = Array.from(o.querySelectorAll("img"));
                for (const m of g)
                  try {
                    const b = m.getAttribute("src") || "";
                    if (new URL(b, location.href).toString() === u) {
                      const S = m.parentElement;
                      m.remove(), S && S.tagName && S.tagName.toLowerCase() === "p" && S.childNodes.length === 0 && S.remove();
                      break;
                    }
                  } catch {
                  }
              }
            } catch {
            }
            o.querySelectorAll("img").forEach((u) => {
              try {
                u.getAttribute("loading") || u.setAttribute("data-want-lazy", "1");
              } catch (g) {
                console.warn("[markdown] set image loading attribute failed", g);
              }
            });
          } catch (f) {
            console.warn("[markdown] query images failed", f);
          }
          try {
            o.querySelectorAll("pre code").forEach((u) => {
              try {
                const g = u.getAttribute && u.getAttribute("class") || u.className || "", m = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
                if (m)
                  try {
                    u.setAttribute && u.setAttribute("class", m);
                  } catch (S) {
                    console.warn("[markdown] set code class failed", S), u.className = m;
                  }
                else
                  try {
                    u.removeAttribute && u.removeAttribute("class");
                  } catch (S) {
                    console.warn("[markdown] remove code class failed", S), u.className = "";
                  }
                const b = m, y = b.match(/language-([a-zA-Z0-9_+-]+)/) || b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!y || !y[1])
                  try {
                    const S = u.textContent || "";
                    try {
                      if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
                        const L = me.highlight(S, { language: "plaintext" });
                        L && L.value && (u.innerHTML = L.value);
                      }
                    } catch {
                      try {
                        me.highlightElement(u);
                      } catch (I) {
                        console.warn("[markdown] hljs.highlightElement failed", I);
                      }
                    }
                  } catch (S) {
                    console.warn("[markdown] code auto-detect failed", S);
                  }
              } catch (g) {
                console.warn("[markdown] processing code blocks failed", g);
              }
            });
          } catch (f) {
            console.warn("[markdown] query code blocks failed", f);
          }
          const d = o.body.innerHTML, p = [];
          return l.forEach((f) => {
            p.push({ level: Number(f.tagName.substring(1)), text: (f.textContent || "").trim(), id: f.id });
          }), { html: d, meta: i.meta || {}, toc: p };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), i;
        }
    } catch (i) {
      console.warn("[markdown] worker render failed", i);
    }
  const { content: n, data: s } = ya(t || "");
  if (ae.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Je && Je.length)
    try {
      Je.forEach((i) => ae.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let r = ae.parse(n);
  try {
    const a = (Er || new DOMParser()).parseFromString(r, "text/html"), o = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    o.forEach((h) => {
      h.id || (h.id = le(h.textContent || ""));
      try {
        const c = Number(h.tagName.substring(1));
        if (c >= 1 && c <= 6) {
          const d = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, p = c <= 2 ? "has-text-weight-bold" : c <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          `${d[c]} ${p}`.split(/\s+/).filter(Boolean).forEach((u) => {
            try {
              h.classList.add(u);
            } catch {
            }
          });
        }
      } catch {
      }
    });
    try {
      try {
        const c = typeof document < "u" && document.documentElement && document.documentElement.getAttribute ? document.documentElement.getAttribute("data-nimbi-logo-moved") : null;
        if (c) {
          const d = Array.from(a.querySelectorAll("img"));
          for (const p of d)
            try {
              const f = p.getAttribute("src") || "";
              if (new URL(f, location.href).toString() === c) {
                const g = p.parentElement;
                p.remove(), g && g.tagName && g.tagName.toLowerCase() === "p" && g.childNodes.length === 0 && g.remove();
                break;
              }
            } catch {
            }
        }
      } catch {
      }
      a.querySelectorAll("img").forEach((c) => {
        try {
          c.getAttribute("loading") || c.setAttribute("data-want-lazy", "1");
        } catch (d) {
          console.warn("[markdown] set image loading attribute failed", d);
        }
      });
    } catch (h) {
      console.warn("[markdown] query images failed", h);
    }
    try {
      a.querySelectorAll("pre code").forEach((c) => {
        try {
          const d = c.getAttribute && c.getAttribute("class") || c.className || "", p = String(d || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (p)
            try {
              c.setAttribute && c.setAttribute("class", p);
            } catch (g) {
              console.warn("[markdown] set code class failed", g), c.className = p;
            }
          else
            try {
              c.removeAttribute && c.removeAttribute("class");
            } catch (g) {
              console.warn("[markdown] remove code class failed", g), c.className = "";
            }
          const f = p, u = f.match(/language-([a-zA-Z0-9_+-]+)/) || f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!u || !u[1])
            try {
              const g = c.textContent || "";
              try {
                if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
                  const m = me.highlight(g, { language: "plaintext" });
                  m && m.value && (c.innerHTML = m.value);
                }
              } catch {
                try {
                  me.highlightElement(c);
                } catch (b) {
                  console.warn("[markdown] hljs.highlightElement failed", b);
                }
              }
            } catch (g) {
              console.warn("[markdown] code auto-detect failed", g);
            }
        } catch (d) {
          console.warn("[markdown] processing code blocks failed", d);
        }
      });
    } catch (h) {
      console.warn("[markdown] query code blocks failed", h);
    }
    r = a.body.innerHTML;
    const l = [];
    return o.forEach((h) => {
      l.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || "").trim(), id: h.id });
    }), { html: a.body.innerHTML, meta: s || {}, toc: l };
  } catch (i) {
    console.warn("post-process markdown failed", i);
  }
  return { html: r, meta: s || {}, toc: [] };
}
function Mn(t, e) {
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
      if (zr.has(o) || e && e.size && o.length < 3 && !e.has(o) && !(Pe && Pe[o] && e.has(Pe[o]))) continue;
      if (e && e.size) {
        if (e.has(o)) {
          const h = e.get(o);
          h && n.add(h);
          continue;
        }
        if (Pe && Pe[o]) {
          const h = Pe[o];
          if (e.has(h)) {
            const c = e.get(h) || h;
            n.add(c);
            continue;
          }
        }
      }
      (i.has(o) || o.length >= 5 && o.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(o) && !r.has(o)) && n.add(o);
    }
  return n;
}
const Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: Rn,
  detectFenceLanguages: Mn,
  initRendererWorker: Cn,
  markdownPlugins: Je,
  parseMarkdownToHtml: rn,
  setMarkdownExtensions: xa
}, Symbol.toStringTag, { value: "Module" }));
function va(t, e) {
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
function Aa(t, e) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const s = document.createElement("p");
  s.className = "menu-label", s.textContent = t("navigation"), n.appendChild(s);
  const r = document.createElement("ul");
  return r.className = "menu-list", e.forEach((i) => {
    const a = document.createElement("li"), o = document.createElement("a");
    if (o.href = "#" + i.path, o.textContent = i.name, a.appendChild(o), i.children && i.children.length) {
      const l = document.createElement("ul");
      i.children.forEach((h) => {
        const c = document.createElement("li"), d = document.createElement("a");
        d.href = "#" + h.path, d.textContent = h.name, c.appendChild(d), l.appendChild(c);
      }), a.appendChild(l);
    }
    r.appendChild(a);
  }), n.appendChild(r), n;
}
function Ea(t, e, n = "") {
  const s = document.createElement("aside");
  s.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), s.appendChild(r);
  const i = document.createElement("ul");
  i.className = "menu-list";
  try {
    const o = {};
    (e || []).forEach((l) => {
      try {
        if (!l || l.level === 1) return;
        const h = Number(l.level) >= 2 ? Number(l.level) : 2, c = document.createElement("li"), d = document.createElement("a"), p = l.id || le(l.text || "");
        d.textContent = l.text || "";
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), b = m && j && j.has && j.has(m) ? j.get(m) : m;
          b ? d.href = we(b, p) : d.href = `#${encodeURIComponent(p)}`;
        } catch (m) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", m), d.href = `#${encodeURIComponent(p)}`;
        }
        if (c.appendChild(d), h === 2) {
          i.appendChild(c), o[2] = c, Object.keys(o).forEach((m) => {
            Number(m) > 2 && delete o[m];
          });
          return;
        }
        let f = h - 1;
        for (; f > 2 && !o[f]; ) f--;
        f < 2 && (f = 2);
        let u = o[f];
        if (!u) {
          i.appendChild(c), o[h] = c;
          return;
        }
        let g = u.querySelector("ul");
        g || (g = document.createElement("ul"), u.appendChild(g)), g.appendChild(c), o[h] = c;
      } catch (h) {
        console.warn("[htmlBuilder] buildTocElement item failed", h, l);
      }
    });
  } catch (o) {
    console.warn("[htmlBuilder] buildTocElement failed", o);
  }
  return s.appendChild(i), i.querySelectorAll("li").length <= 1 ? null : s;
}
function fi(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = le(n.textContent || ""));
  });
}
function La(t, e, n) {
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
function Lr(t, e, n) {
  try {
    const s = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
    let r = null;
    try {
      const a = new URL(n, location.href);
      r = new URL(s || ".", a).toString();
    } catch {
      try {
        r = new URL(s || ".", location.href).toString();
      } catch {
        r = s || "./";
      }
    }
    const i = t.querySelectorAll("*");
    for (const a of Array.from(i || []))
      try {
        const o = a.tagName ? a.tagName.toLowerCase() : "", l = (h) => {
          try {
            const c = a.getAttribute(h) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              a.setAttribute(h, new URL(c, r).toString());
            } catch (d) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", h, c, d);
            }
          } catch (c) {
            console.warn("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && l("src"), a.hasAttribute && a.hasAttribute("href") && o !== "a" && l("href"), a.hasAttribute && a.hasAttribute("xlink:href") && l("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && l("poster"), a.hasAttribute("srcset")) {
          const d = (a.getAttribute("srcset") || "").split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
            const [f, u] = p.split(/\s+/, 2);
            if (!f || /^(https?:)?\/\//i.test(f) || f.startsWith("/")) return p;
            try {
              const g = new URL(f, r).toString();
              return u ? `${g} ${u}` : g;
            } catch {
              return p;
            }
          }).join(", ");
          a.setAttribute("srcset", d);
        }
      } catch (o) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", o);
      }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", s);
  }
}
let Tr = "", bn = null, Cr = "";
async function pi(t, e, n) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let r, i;
    if (e === Tr && bn)
      r = bn, i = Cr;
    else {
      try {
        r = new URL(e, location.href), i = Mt(r.pathname);
      } catch {
        try {
          r = new URL(e, location.href), i = Mt(r.pathname);
        } catch {
          r = null, i = "/";
        }
      }
      Tr = e, bn = r, Cr = i;
    }
    const a = /* @__PURE__ */ new Set(), o = [], l = /* @__PURE__ */ new Set(), h = [];
    for (const c of Array.from(s))
      try {
        const d = c.getAttribute("href") || "";
        if (!d || Ur(d)) continue;
        try {
          if (d.startsWith("?") || d.indexOf("?") !== -1)
            try {
              const f = new URL(d, e || location.href), u = f.searchParams.get("page");
              if (u && u.indexOf("/") === -1 && n) {
                const g = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (g) {
                  const m = be(g + u);
                  c.setAttribute("href", we(m, f.hash ? f.hash.replace(/^#/, "") : null));
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (d.startsWith("/") && !d.endsWith(".md")) continue;
        const p = d.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (p) {
          let f = p[1];
          const u = p[2];
          !f.startsWith("/") && n && (f = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + f);
          try {
            const g = new URL(f, e).pathname;
            let m = g.startsWith(i) ? g.slice(i.length) : g;
            m = be(m), o.push({ node: c, mdPathRaw: f, frag: u, rel: m }), j.has(m) || a.add(m);
          } catch (g) {
            console.warn("[htmlBuilder] resolve mdPath failed", g);
          }
          continue;
        }
        try {
          let f = d;
          !d.startsWith("/") && n && (d.startsWith("#") ? f = n + d : f = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + d);
          const g = new URL(f, e).pathname || "";
          if (g && g.indexOf(i) !== -1) {
            let m = g.startsWith(i) ? g.slice(i.length) : g;
            if (m = be(m), m = _t(m), m || (m = "_home"), !m.endsWith(".md")) {
              let b = null;
              try {
                if (j && j.has && j.has(m))
                  b = j.get(m);
                else
                  try {
                    const y = String(m || "").replace(/^.*\//, "");
                    y && j.has && j.has(y) && (b = j.get(y));
                  } catch (y) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", y);
                  }
              } catch (y) {
                console.warn("[htmlBuilder] mdToSlug access check failed", y);
              }
              if (!b)
                try {
                  const y = String(m || "").replace(/^.*\//, "");
                  for (const [S, L] of V || [])
                    if (L === m || L === y) {
                      b = S;
                      break;
                    }
                } catch {
                }
              b ? c.setAttribute("href", we(b)) : (l.add(m), h.push({ node: c, rel: m }));
            }
          }
        } catch (f) {
          console.warn("[htmlBuilder] resolving href to URL failed", f);
        }
      } catch (d) {
        console.warn("[htmlBuilder] processing anchor failed", d);
      }
    a.size && await Promise.all(Array.from(a).map(async (c) => {
      try {
        try {
          const p = String(c).match(/([^\/]+)\.md$/), f = p && p[1];
          if (f && V.has(f)) {
            try {
              const u = V.get(f);
              if (u)
                try {
                  j.set(u, f);
                } catch (g) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", g);
                }
            } catch (u) {
              console.warn("[htmlBuilder] reading slugToMd failed", u);
            }
            return;
          }
        } catch (p) {
          console.warn("[htmlBuilder] basename slug lookup failed", p);
        }
        const d = await Ee(c, e);
        if (d && d.raw) {
          const p = (d.raw || "").match(/^#\s+(.+)$/m);
          if (p && p[1]) {
            const f = le(p[1].trim());
            if (f)
              try {
                V.set(f, c), j.set(c, f);
              } catch (u) {
                console.warn("[htmlBuilder] setting slug mapping failed", u);
              }
          }
        }
      } catch (d) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", d);
      }
    })), l.size && await Promise.all(Array.from(l).map(async (c) => {
      try {
        const d = await Ee(c, e);
        if (d && d.raw)
          try {
            const f = (Zn || new DOMParser()).parseFromString(d.raw, "text/html"), u = f.querySelector("title"), g = f.querySelector("h1"), m = u && u.textContent && u.textContent.trim() ? u.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
            if (m) {
              const b = le(m);
              if (b)
                try {
                  V.set(b, c), j.set(c, b);
                } catch (y) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", y);
                }
            }
          } catch (p) {
            console.warn("[htmlBuilder] parse fetched HTML failed", p);
          }
      } catch (d) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", d);
      }
    }));
    for (const c of o) {
      const { node: d, frag: p, rel: f } = c;
      let u = null;
      try {
        j.has(f) && (u = j.get(f));
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug access failed", g);
      }
      u ? d.setAttribute("href", we(u, p)) : d.setAttribute("href", we(f, p));
    }
    for (const c of h) {
      const { node: d, rel: p } = c;
      let f = null;
      try {
        j.has(p) && (f = j.get(p));
      } catch (u) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", u);
      }
      if (!f)
        try {
          const u = String(p || "").replace(/^.*\//, "");
          j.has(u) && (f = j.get(u));
        } catch (u) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", u);
        }
      f ? d.setAttribute("href", we(f)) : d.setAttribute("href", we(p));
    }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteAnchors failed", s);
  }
}
function Ta(t, e, n, s) {
  const r = e.querySelector("h1"), i = r ? (r.textContent || "").trim() : "";
  let a = "";
  try {
    let o = "";
    try {
      t && t.meta && t.meta.title && (o = String(t.meta.title).trim());
    } catch {
    }
    if (!o && i && (o = i), !o)
      try {
        const l = e.querySelector("h2");
        l && l.textContent && (o = String(l.textContent).trim());
      } catch {
      }
    !o && n && (o = String(n)), o && (a = le(o)), a || (a = "_home");
    try {
      n && (V.set(a, n), j.set(n, a));
    } catch (l) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", l);
    }
    try {
      const l = s || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
      try {
        history.replaceState({ page: a }, "", we(a, l));
      } catch (h) {
        console.warn("[htmlBuilder] computeSlug history replace failed", h);
      }
    } catch (l) {
      console.warn("[htmlBuilder] computeSlug inner failed", l);
    }
  } catch (o) {
    console.warn("[htmlBuilder] computeSlug failed", o);
  }
  try {
    if (t && t.meta && t.meta.title && r) {
      const o = String(t.meta.title).trim();
      if (o && o !== i) {
        try {
          a && (r.id = a);
        } catch {
        }
        try {
          if (Array.isArray(t.toc))
            for (const l of t.toc)
              try {
                if (l && Number(l.level) === 1 && String(l.text).trim() === (i || "").trim()) {
                  l.id = a;
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
  return { topH1: r, h1Text: i, slugKey: a };
}
async function Ca(t, e) {
  if (!t || !t.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const l of Array.from(t || []))
    try {
      const h = l.getAttribute("href") || "";
      if (!h) continue;
      let p = be(h).split(/::|#/, 2)[0];
      try {
        const u = p.indexOf("?");
        u !== -1 && (p = p.slice(0, u));
      } catch {
      }
      if (!p || (p.includes(".") || (p = p + ".html"), !/\.html(?:$|[?#])/.test(p) && !p.toLowerCase().endsWith(".html"))) continue;
      const f = p;
      try {
        if (j && j.has && j.has(f)) continue;
      } catch (u) {
        console.warn("[htmlBuilder] mdToSlug check failed", u);
      }
      try {
        let u = !1;
        for (const g of V.values())
          if (g === f) {
            u = !0;
            break;
          }
        if (u) continue;
      } catch (u) {
        console.warn("[htmlBuilder] slugToMd iteration failed", u);
      }
      n.add(f);
    } catch (h) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", h);
    }
  if (!n.size) return;
  const s = async (l) => {
    try {
      const h = await Ee(l, e);
      if (h && h.raw)
        try {
          const d = (Zn || new DOMParser()).parseFromString(h.raw, "text/html"), p = d.querySelector("title"), f = d.querySelector("h1"), u = p && p.textContent && p.textContent.trim() ? p.textContent.trim() : f && f.textContent ? f.textContent.trim() : null;
          if (u) {
            const g = le(u);
            if (g)
              try {
                V.set(g, l), j.set(l, g);
              } catch (m) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", m);
              }
          }
        } catch (c) {
          console.warn("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (h) {
      console.warn("[htmlBuilder] fetchAndExtract failed", h);
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
async function Ra(t, e) {
  if (!t || !t.length) return;
  const n = [], s = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const i = new URL(e, typeof location < "u" ? location.href : "http://localhost/");
    r = Mt(i.pathname);
  } catch (i) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", i);
  }
  for (const i of Array.from(t || []))
    try {
      const a = i.getAttribute("href") || "";
      if (!a) continue;
      const o = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (o) {
        let l = be(o[1]);
        try {
          let h;
          try {
            h = va(l, e);
          } catch (d) {
            h = l, console.warn("[htmlBuilder] resolve mdPath URL failed", d);
          }
          const c = h && r && h.startsWith(r) ? h.slice(r.length) : String(h || "").replace(/^\//, "");
          n.push({ rel: c }), j.has(c) || s.add(c);
        } catch (h) {
          console.warn("[htmlBuilder] rewriteAnchors failed", h);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  s.size && await Promise.all(Array.from(s).map(async (i) => {
    try {
      const a = String(i).match(/([^\/]+)\.md$/), o = a && a[1];
      if (o && V.has(o)) {
        try {
          const l = V.get(o);
          l && j.set(l, o);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await Ee(i, e);
      if (a && a.raw) {
        const o = (a.raw || "").match(/^#\s+(.+)$/m);
        if (o && o[1]) {
          const l = le(o[1].trim());
          if (l)
            try {
              V.set(l, i), j.set(i, l);
            } catch (h) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", h);
            }
        }
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", a);
    }
  }));
}
const Zn = typeof DOMParser < "u" ? new DOMParser() : null;
function yn(t) {
  try {
    const n = (Zn || new DOMParser()).parseFromString(t || "", "text/html");
    fi(n);
    try {
      n.querySelectorAll("img").forEach((l) => {
        try {
          l.getAttribute("loading") || l.setAttribute("data-want-lazy", "1");
        } catch (h) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", h);
        }
      });
    } catch (o) {
      console.warn("[htmlBuilder] parseHtml query images failed", o);
    }
    n.querySelectorAll("pre code, code[class]").forEach((o) => {
      try {
        const l = o.getAttribute && o.getAttribute("class") || o.className || "", h = l.match(/language-([a-zA-Z0-9_+-]+)/) || l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (h && h[1]) {
          const c = (h[1] || "").toLowerCase(), d = ne.size && (ne.get(c) || ne.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await Rt(d);
              } catch (p) {
                console.warn("[htmlBuilder] registerLanguage failed", p);
              }
            })();
          } catch (p) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", p);
          }
        } else
          try {
            if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
              const c = me.highlight ? me.highlight(o.textContent || "", { language: "plaintext" }) : null;
              c && c.value && (o.innerHTML = c.value);
            }
          } catch (c) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (l) {
        console.warn("[htmlBuilder] code element processing failed", l);
      }
    });
    const r = [];
    n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((o) => {
      r.push({ level: Number(o.tagName.substring(1)), text: (o.textContent || "").trim(), id: o.id });
    });
    const a = {};
    try {
      const o = n.querySelector("title");
      o && o.textContent && String(o.textContent).trim() && (a.title = String(o.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: a, toc: r };
  } catch (e) {
    return console.warn("[htmlBuilder] parseHtml failed", e), { html: t || "", meta: {}, toc: [] };
  }
}
async function Ma(t) {
  const e = Mn ? Mn(t || "", ne) : /* @__PURE__ */ new Set(), n = new Set(e), s = [];
  for (const r of n)
    try {
      const i = ne.size && (ne.get(r) || ne.get(String(r).toLowerCase())) || r;
      try {
        s.push(Rt(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(r) !== String(i))
        try {
          s.push(Rt(r));
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
async function _a(t) {
  if (await Ma(t), rn) {
    const e = await rn(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function $a(t, e, n, s, r) {
  let i = null;
  if (e.isHtml)
    try {
      const d = typeof DOMParser < "u" ? new DOMParser() : null;
      if (d) {
        const p = d.parseFromString(e.raw || "", "text/html");
        try {
          Lr(p.body, n, r);
        } catch (f) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", f);
        }
        i = yn(p.documentElement && p.documentElement.outerHTML ? p.documentElement.outerHTML : e.raw || "");
      } else
        i = yn(e.raw || "");
    } catch {
      i = yn(e.raw || "");
    }
  else
    i = await _a(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    Lr(a, n, r);
  } catch (d) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", d);
  }
  try {
    fi(a);
  } catch (d) {
    console.warn("[htmlBuilder] addHeadingIds failed", d);
  }
  try {
    a.querySelectorAll("pre code, code[class]").forEach((p) => {
      try {
        const f = p.getAttribute && p.getAttribute("class") || p.className || "", u = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (u)
          try {
            p.setAttribute && p.setAttribute("class", u);
          } catch (g) {
            p.className = u, console.warn("[htmlBuilder] set element class failed", g);
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
  } catch (d) {
    console.warn("[htmlBuilder] processing code elements failed", d);
  }
  try {
    es(a);
  } catch (d) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", d);
  }
  La(a, n, r);
  try {
    (a.querySelectorAll && a.querySelectorAll("img") || []).forEach((p) => {
      try {
        const f = p.parentElement;
        if (!f || f.tagName.toLowerCase() !== "p" || f.childNodes.length !== 1) return;
        const u = document.createElement("figure");
        u.className = "image", f.replaceWith(u), u.appendChild(p);
      } catch {
      }
    });
  } catch (d) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", d);
  }
  try {
    (a.querySelectorAll && a.querySelectorAll("table") || []).forEach((p) => {
      try {
        if (p.classList)
          p.classList.contains("table") || p.classList.add("table");
        else {
          const f = p.getAttribute && p.getAttribute("class") ? p.getAttribute("class") : "", u = String(f || "").split(/\s+/).filter(Boolean);
          u.indexOf("table") === -1 && u.push("table");
          try {
            p.setAttribute && p.setAttribute("class", u.join(" "));
          } catch {
            p.className = u.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (d) {
    console.warn("[htmlBuilder] add Bulma table class failed", d);
  }
  const { topH1: o, h1Text: l, slugKey: h } = Ta(i, a, n, s);
  try {
    if (o && i && i.meta && (i.meta.author || i.meta.date) && !(o.parentElement && o.parentElement.querySelector && o.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const p = i.meta.author ? String(i.meta.author).trim() : "", f = i.meta.date ? String(i.meta.date).trim() : "";
      let u = "";
      try {
        const m = new Date(f);
        f && !isNaN(m.getTime()) ? u = m.toLocaleDateString() : u = f;
      } catch {
        u = f;
      }
      const g = [];
      if (p && g.push(p), u && g.push(u), g.length) {
        const m = document.createElement("p"), b = g[0] ? String(g[0]).replace(/\"/g, "").trim() : "", y = g.slice(1), S = [];
        b && S.push(b), y.length && S.push(y.join(" • ")), m.className = "nimbi-article-subtitle is-6 has-text-grey-light", m.textContent = S.join(" • ");
        try {
          o.parentElement.insertBefore(m, o.nextSibling);
        } catch {
          try {
            o.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await Ia(a, r, n);
  } catch (d) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", d), await pi(a, r, n);
  }
  const c = Ea(t, i.toc, n);
  return { article: a, parsed: i, toc: c, topH1: o, h1Text: l, slugKey: h };
}
function Pa(t) {
  if (!(!t || !t.querySelectorAll))
    try {
      const e = Array.from(t.querySelectorAll("script"));
      for (const n of e)
        try {
          const s = document.createElement("script");
          for (const i of Array.from(n.attributes || []))
            try {
              s.setAttribute(i.name, i.value);
            } catch {
            }
          if (!n.src) {
            try {
              s.type = "module";
            } catch {
            }
            s.textContent = n.textContent || "";
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
          s.addEventListener("error", (i) => {
            try {
              console.warn("[htmlBuilder] injected script error", { src: r, ev: i });
            } catch {
            }
          }), s.addEventListener("load", () => {
            try {
              console.info("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
            } catch {
            }
          }), (document.head || document.body || document.documentElement).appendChild(s), n.parentNode && n.parentNode.removeChild(n);
          try {
            console.info("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (s) {
          console.warn("[htmlBuilder] execute injected script failed", s);
        }
    } catch {
    }
}
function Rr(t, e, n) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", s.appendChild(r), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function Ia(t, e, n) {
  return pi(t, e, n);
}
function za(t) {
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
                history.replaceState({ page: o || i }, "", we(o || i, a));
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
            _n(a);
          } catch (l) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", l);
          }
          return;
        }
        history.pushState({ page: i }, "", we(i, a));
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
function _n(t) {
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
function Na(t, e, { mountOverlay: n = null, container: s = null, mountEl: r = null, navWrap: i = null, t: a = null } = {}) {
  try {
    const o = a || ((g) => typeof g == "string" ? g : ""), l = s || document.querySelector(".nimbi-cms"), h = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), d = i || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top button is-primary is-rounded is-small", f.setAttribute("aria-label", o("scrollToTop")), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(f) : l && l.appendChild ? l.appendChild(f) : h && h.appendChild ? h.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (m) {
          console.warn("[htmlBuilder] append scroll top button failed", m);
        }
      }
      try {
        try {
          Br(f);
        } catch {
        }
      } catch (g) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", g);
      }
      f.addEventListener("click", () => {
        try {
          s && s.scrollTo ? s.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            s && (s.scrollTop = 0);
          } catch (m) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", m);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (m) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", m);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (m) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", m);
          }
        }
      });
    }
    const u = d && d.querySelector ? d.querySelector(".menu-label") : null;
    if (e) {
      if (!f._nimbiObserver) {
        const g = new IntersectionObserver((m) => {
          for (const b of m)
            b.target instanceof Element && (b.isIntersecting ? (f.classList.remove("show"), u && u.classList.remove("show")) : (f.classList.add("show"), u && u.classList.add("show")));
        }, { root: s instanceof Element ? s : r instanceof Element ? r : null, threshold: 0 });
        f._nimbiObserver = g;
      }
      try {
        f._nimbiObserver.disconnect();
      } catch (g) {
        console.warn("[htmlBuilder] observer disconnect failed", g);
      }
      try {
        f._nimbiObserver.observe(e);
      } catch (g) {
        console.warn("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const m = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, b = e.getBoundingClientRect();
            !(b.bottom < m.top || b.top > m.bottom) ? (f.classList.remove("show"), u && u.classList.remove("show")) : (f.classList.add("show"), u && u.classList.add("show"));
          } catch (m) {
            console.warn("[htmlBuilder] checkIntersect failed", m);
          }
        };
        g(), "IntersectionObserver" in window || setTimeout(g, 100);
      } catch (g) {
        console.warn("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      f.classList.remove("show"), u && u.classList.remove("show");
      const g = s instanceof Element ? s : r instanceof Element ? r : window, m = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (f.classList.add("show"), u && u.classList.add("show")) : (f.classList.remove("show"), u && u.classList.remove("show"));
        } catch (b) {
          console.warn("[htmlBuilder] onScroll handler failed", b);
        }
      };
      Kt(() => g.addEventListener("scroll", m)), m();
    }
  } catch (o) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", o);
  }
}
function Mr(t, e) {
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
async function Ba(t, e, n, s, r, i, a, o, l = "eager", h = 1, c = void 0, d = "favicon") {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const p = typeof DOMParser < "u" ? new DOMParser() : null, f = p ? p.parseFromString(n || "", "text/html") : null, u = f ? f.querySelectorAll("a") : [];
  await Kt(() => Ca(u, s)), await Kt(() => Ra(u, s));
  let g = null, m = null, b = null, y = null, S = null, L = null;
  function I() {
    try {
      const A = document.querySelector(".navbar-burger"), T = A && A.dataset ? A.dataset.target : null, C = T ? document.getElementById(T) : null;
      A && A.classList.contains("is-active") && (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active"));
    } catch (A) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", A);
    }
  }
  const U = () => g || (g = (async () => {
    try {
      const A = await Promise.resolve().then(() => Gt), T = Mr(A, "buildSearchIndex") || (typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0), C = Mr(A, "buildSearchIndexWorker") || (typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0);
      if (l === "lazy" && typeof C == "function")
        try {
          const P = await C(s, h, c);
          if (P && P.length) return P;
        } catch (P) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", P);
        }
      return typeof T == "function" ? await T(s, h, c) : [];
    } catch (A) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", A), [];
    } finally {
      if (m) {
        try {
          m.removeAttribute("disabled");
        } catch {
        }
        try {
          b && b.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), g.then((A) => {
    try {
      const T = String(m && m.value || "").trim().toLowerCase();
      if (!T || !Array.isArray(A) || !A.length) return;
      const C = A.filter((k) => k.title && k.title.toLowerCase().includes(T) || k.excerpt && k.excerpt.toLowerCase().includes(T));
      if (!C || !C.length) return;
      const P = document.getElementById("nimbi-search-results");
      if (!P) return;
      P.innerHTML = "";
      try {
        const k = document.createElement("div");
        k.className = "panel nimbi-search-panel", C.slice(0, 10).forEach((R) => {
          try {
            if (R.parentTitle) {
              const ue = document.createElement("p");
              ue.className = "panel-heading nimbi-search-title nimbi-search-parent", ue.textContent = R.parentTitle, k.appendChild(ue);
            }
            const N = document.createElement("a");
            N.className = "panel-block nimbi-search-result", N.href = we(R.slug), N.setAttribute("role", "button");
            try {
              if (R.path && typeof R.slug == "string") {
                try {
                  V.set(R.slug, R.path);
                } catch {
                }
                try {
                  j.set(R.path, R.slug);
                } catch {
                }
              }
            } catch {
            }
            const te = document.createElement("div");
            te.className = "is-size-6 has-text-weight-semibold", te.textContent = R.title, N.appendChild(te), N.addEventListener("click", () => {
              try {
                P.style.display = "none";
              } catch {
              }
            }), k.appendChild(N);
          } catch {
          }
        }), P.appendChild(k);
        try {
          P.style.display = "block";
        } catch {
        }
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), g), Z = document.createElement("nav");
  Z.className = "navbar", Z.setAttribute("role", "navigation"), Z.setAttribute("aria-label", "main navigation");
  const F = document.createElement("div");
  F.className = "navbar-brand";
  const fe = u[0], $ = document.createElement("a");
  if ($.className = "navbar-item", fe) {
    const A = fe.getAttribute("href") || "#";
    try {
      const C = new URL(A, location.href).searchParams.get("page");
      if (C) {
        const P = decodeURIComponent(C);
        $.href = we(P);
      } else
        $.href = we(r), $.textContent = i("home");
    } catch {
      $.href = we(r), $.textContent = i("home");
    }
  } else
    $.href = we(r), $.textContent = i("home");
  async function q(A) {
    try {
      if (!A || A === "none") return null;
      if (A === "favicon")
        try {
          const T = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!T) return null;
          const C = T.getAttribute("href") || "";
          return C && /\.png(?:\?|$)/i.test(C) ? new URL(C, location.href).toString() : null;
        } catch {
          return null;
        }
      if (A === "copy-first" || A === "move-first")
        try {
          const T = await Ee(r, s);
          if (!T || !T.raw) return null;
          const k = new DOMParser().parseFromString(T.raw, "text/html").querySelector("img");
          if (!k) return null;
          const R = k.getAttribute("src") || "";
          if (!R) return null;
          const N = new URL(R, location.href).toString();
          if (A === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", N);
            } catch {
            }
          return N;
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
  let Q = null;
  try {
    Q = await q(d);
  } catch {
    Q = null;
  }
  if (Q)
    try {
      const A = document.createElement("img");
      A.className = "nimbi-navbar-logo";
      const T = i && typeof i == "function" && (i("home") || i("siteLogo")) || "";
      A.alt = T, A.title = T, A.src = Q;
      try {
        A.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!$.textContent || !String($.textContent).trim()) && ($.textContent = T);
      } catch {
      }
      try {
        $.insertBefore(A, $.firstChild);
      } catch {
        try {
          $.appendChild(A);
        } catch {
        }
      }
    } catch {
    }
  F.appendChild($), $.addEventListener("click", function(A) {
    const T = $.getAttribute("href") || "";
    if (T.startsWith("?page=")) {
      A.preventDefault();
      const C = new URL(T, location.href), P = C.searchParams.get("page"), k = C.hash ? C.hash.replace(/^#/, "") : null;
      history.pushState({ page: P }, "", we(P, k));
      try {
        a();
      } catch (R) {
        console.warn("[nimbi-cms] renderByQuery failed", R);
      }
      try {
        I();
      } catch {
      }
    }
  });
  const O = document.createElement("a");
  O.className = "navbar-burger", O.setAttribute("role", "button"), O.setAttribute("aria-label", "menu"), O.setAttribute("aria-expanded", "false");
  const oe = "nimbi-navbar-menu";
  O.dataset.target = oe, O.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', F.appendChild(O);
  try {
    O.addEventListener("click", (A) => {
      try {
        const T = O.dataset && O.dataset.target ? O.dataset.target : null, C = T ? document.getElementById(T) : null;
        O.classList.contains("is-active") ? (O.classList.remove("is-active"), O.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active")) : (O.classList.add("is-active"), O.setAttribute("aria-expanded", "true"), C && C.classList.add("is-active"));
      } catch (T) {
        console.warn("[nimbi-cms] navbar burger toggle failed", T);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] burger event binding failed", A);
  }
  const X = document.createElement("div");
  X.className = "navbar-menu", X.id = oe;
  const v = document.createElement("div");
  v.className = "navbar-start";
  let J = null, re = null;
  if (!o)
    J = null, m = null, y = null, S = null, L = null;
  else {
    J = document.createElement("div"), J.className = "navbar-end", re = document.createElement("div"), re.className = "navbar-item", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = i("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0), b = document.createElement("div"), b.className = "control", l === "eager" && b.classList.add("is-loading"), b.appendChild(m), re.appendChild(b), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const A = document.createElement("div");
    A.className = "dropdown-trigger", A.appendChild(re);
    const T = document.createElement("div");
    T.className = "dropdown-menu", T.setAttribute("role", "menu"), S = document.createElement("div"), S.id = "nimbi-search-results", S.className = "dropdown-content nimbi-search-results", L = S, T.appendChild(S), y.appendChild(A), y.appendChild(T), J.appendChild(y);
    const C = (k) => {
      if (S) {
        if (S.innerHTML = "", !k.length) {
          y && y.classList.remove("is-active");
          try {
            S.style.display = "none";
          } catch {
          }
          try {
            S.classList.remove("is-open");
          } catch {
          }
          return;
        }
        try {
          const R = document.createElement("div");
          R.className = "panel nimbi-search-panel", k.forEach((N) => {
            if (N.parentTitle) {
              const he = document.createElement("p");
              he.textContent = N.parentTitle, he.className = "panel-heading nimbi-search-title nimbi-search-parent", R.appendChild(he);
            }
            const te = document.createElement("a");
            te.className = "panel-block nimbi-search-result", te.href = we(N.slug), te.setAttribute("role", "button");
            try {
              if (N.path && typeof N.slug == "string") {
                try {
                  V.set(N.slug, N.path);
                } catch {
                }
                try {
                  j.set(N.path, N.slug);
                } catch {
                }
              }
            } catch {
            }
            const ue = document.createElement("div");
            ue.className = "is-size-6 has-text-weight-semibold", ue.textContent = N.title, te.appendChild(ue), te.addEventListener("click", () => {
              y && y.classList.remove("is-active");
              try {
                S.style.display = "none";
              } catch {
              }
              try {
                S.classList.remove("is-open");
              } catch {
              }
            }), R.appendChild(te);
          }), S.appendChild(R);
        } catch {
        }
        y && y.classList.add("is-active");
        try {
          S.style.display = "block";
        } catch {
        }
        try {
          S.classList.add("is-open");
        } catch {
        }
      }
    }, P = (k, R) => {
      let N = null;
      return (...te) => {
        N && clearTimeout(N), N = setTimeout(() => k(...te), R);
      };
    };
    if (m) {
      const k = P(async () => {
        const R = document.querySelector("input#nimbi-search"), N = String(R && R.value || "").trim().toLowerCase();
        if (!N) {
          C([]);
          return;
        }
        try {
          await U();
          const ue = (await g).filter((he) => he.title && he.title.toLowerCase().includes(N) || he.excerpt && he.excerpt.toLowerCase().includes(N));
          C(ue.slice(0, 10));
        } catch (te) {
          console.warn("[nimbi-cms] search input handler failed", te), C([]);
        }
      }, 50);
      try {
        m.addEventListener("input", k);
      } catch {
      }
      try {
        document.addEventListener("input", (R) => {
          try {
            R && R.target && R.target.id === "nimbi-search" && k(R);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        g = U();
      } catch (k) {
        console.warn("[nimbi-cms] eager search index init failed", k), g = Promise.resolve([]);
      }
      g.finally(() => {
        const k = document.querySelector("input#nimbi-search");
        if (k) {
          try {
            k.removeAttribute("disabled");
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
      const k = (R) => {
        try {
          const N = R && R.target;
          if (!L || !L.classList.contains("is-open") && L.style && L.style.display !== "block" || N && (L.contains(N) || m && (N === m || m.contains && m.contains(N)))) return;
          y && y.classList.remove("is-active");
          try {
            L.style.display = "none";
          } catch {
          }
          try {
            L.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", k, !0), document.addEventListener("touchstart", k, !0);
    } catch {
    }
  }
  for (let A = 0; A < u.length; A++) {
    const T = u[A];
    if (A === 0) continue;
    const C = T.getAttribute("href") || "#", P = document.createElement("a");
    P.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(C) || C.endsWith(".md")) {
        const R = be(C).split(/::|#/, 2), N = R[0], te = R[1];
        P.href = we(N, te);
      } else if (/\.html(?:$|[#?])/.test(C) || C.endsWith(".html")) {
        const R = be(C).split(/::|#/, 2);
        let N = R[0];
        N && !N.toLowerCase().endsWith(".html") && (N = N + ".html");
        const te = R[1];
        try {
          const ue = await Ee(N, s);
          if (ue && ue.raw)
            try {
              const Le = new DOMParser().parseFromString(ue.raw, "text/html"), ce = Le.querySelector("title"), ze = Le.querySelector("h1"), lt = ce && ce.textContent && ce.textContent.trim() ? ce.textContent.trim() : ze && ze.textContent ? ze.textContent.trim() : null;
              if (lt) {
                const ot = le(lt);
                if (ot) {
                  try {
                    V.set(ot, N), j.set(N, ot);
                  } catch (on) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", on);
                  }
                  P.href = we(ot, te);
                } else
                  P.href = we(N, te);
              } else
                P.href = we(N, te);
            } catch {
              P.href = we(N, te);
            }
          else
            P.href = C;
        } catch {
          P.href = C;
        }
      } else
        P.href = C;
    } catch (k) {
      console.warn("[nimbi-cms] nav item href parse failed", k), P.href = C;
    }
    try {
      const k = T.textContent && String(T.textContent).trim() ? String(T.textContent).trim() : null;
      if (k)
        try {
          const R = le(k);
          if (R) {
            const N = P.getAttribute && P.getAttribute("href") ? P.getAttribute("href") : "";
            try {
              const ue = new URL(N, location.href).searchParams.get("page");
              if (ue) {
                const he = decodeURIComponent(ue);
                try {
                  V.set(R, he), j.set(he, R);
                } catch (Le) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Le);
                }
              }
            } catch (te) {
              console.warn("[nimbi-cms] nav slug mapping failed", te);
            }
          }
        } catch (R) {
          console.warn("[nimbi-cms] nav slug mapping failed", R);
        }
    } catch (k) {
      console.warn("[nimbi-cms] nav slug mapping failed", k);
    }
    P.textContent = T.textContent || C, v.appendChild(P);
  }
  X.appendChild(v), J && X.appendChild(J), Z.appendChild(F), Z.appendChild(X), t.appendChild(Z);
  try {
    const A = (T) => {
      try {
        const C = Z && Z.querySelector ? Z.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!C || !C.classList.contains("is-active")) return;
        const P = C && C.closest ? C.closest(".navbar") : Z;
        if (P && P.contains(T.target)) return;
        I();
      } catch {
      }
    };
    document.addEventListener("click", A, !0), document.addEventListener("touchstart", A, !0);
  } catch {
  }
  try {
    X.addEventListener("click", (A) => {
      const T = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!T) return;
      const C = T.getAttribute("href") || "";
      try {
        const P = new URL(C, location.href), k = P.searchParams.get("page"), R = P.hash ? P.hash.replace(/^#/, "") : null;
        if (k) {
          A.preventDefault(), history.pushState({ page: k }, "", we(k, R));
          try {
            a();
          } catch (N) {
            console.warn("[nimbi-cms] renderByQuery failed", N);
          }
        }
      } catch (P) {
        console.warn("[nimbi-cms] navbar click handler failed", P);
      }
      try {
        const P = Z && Z.querySelector ? Z.querySelector(".navbar-burger") : null, k = P && P.dataset ? P.dataset.target : null, R = k ? document.getElementById(k) : null;
        P && P.classList.contains("is-active") && (P.classList.remove("is-active"), P.setAttribute("aria-expanded", "false"), R && R.classList.remove("is-active"));
      } catch (P) {
        console.warn("[nimbi-cms] mobile menu close failed", P);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] attach content click handler failed", A);
  }
  try {
    e.addEventListener("click", (A) => {
      const T = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!T) return;
      const C = T.getAttribute("href") || "";
      if (C && !Ur(C))
        try {
          const P = new URL(C, location.href), k = P.searchParams.get("page"), R = P.hash ? P.hash.replace(/^#/, "") : null;
          if (k) {
            A.preventDefault(), history.pushState({ page: k }, "", we(k, R));
            try {
              a();
            } catch (N) {
              console.warn("[nimbi-cms] renderByQuery failed", N);
            }
          }
        } catch (P) {
          console.warn("[nimbi-cms] container click URL parse failed", P);
        }
    });
  } catch (A) {
    console.warn("[nimbi-cms] build navbar failed", A);
  }
  return { navbar: Z, linkEls: u };
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
var kn, _r;
function Oa() {
  if (_r) return kn;
  _r = 1;
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
    let o = 0, l = 0, h = i.length - 1;
    const c = a.wordsPerMinute || 200, d = a.wordBound || n;
    for (; d(i[l]); ) l++;
    for (; d(i[h]); ) h--;
    const p = `${i}
`;
    for (let m = l; m <= h; m++)
      if ((e(p[m]) || !d(p[m]) && (d(p[m + 1]) || e(p[m + 1]))) && o++, e(p[m]))
        for (; m <= h && (s(p[m + 1]) || d(p[m + 1])); )
          m++;
    const f = o / c, u = Math.round(f * 60 * 1e3);
    return {
      text: Math.ceil(f.toFixed(2)) + " min read",
      minutes: f,
      time: u,
      words: o
    };
  }
  return kn = r, kn;
}
var qa = Oa();
const Da = /* @__PURE__ */ Ir(qa);
function $r(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function nt(t, e, n) {
  let s = `meta[${t}="${e}"]`, r = document.querySelector(s);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function Ha(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function Ua(t, e, n, s) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  nt("property", "og:title", r);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && nt("property", "og:description", i), i && String(i).trim() && nt("name", "twitter:description", i), nt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = n || t.image;
  a && (nt("property", "og:image", a), nt("name", "twitter:image", a));
}
function ja(t, e, n, s, r = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  o && String(o).trim() && $r("description", o), $r("robots", i.robots || "index,follow"), Ua(i, e, n, o);
}
function Wa() {
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
function Fa(t, e, n, s, r, i = "") {
  try {
    const a = t.meta || {}, o = n && String(n).trim() ? n : a.title || i || document.title, l = r && String(r).trim() ? r : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", h = s || a.image || null;
    let c = "";
    try {
      if (e) {
        const u = be(e);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(u);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (u) {
      c = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", u);
    }
    c && Ha("canonical", c);
    try {
      nt("property", "og:url", c);
    } catch (u) {
      console.warn("[seoManager] upsertMeta og:url failed", u);
    }
    const d = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o || "",
      description: l || "",
      url: c || location.href.split("#")[0]
    };
    h && (d.image = String(h)), a.date && (d.datePublished = a.date), a.dateModified && (d.dateModified = a.dateModified);
    const p = "nimbi-jsonld";
    let f = document.getElementById(p);
    f || (f = document.createElement("script"), f.type = "application/ld+json", f.id = p, document.head.appendChild(f)), f.textContent = JSON.stringify(d, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function Za(t, e, n, s, r, i, a, o, l, h, c) {
  try {
    if (s && s.querySelector) {
      const d = s.querySelector(".menu-label");
      d && (d.textContent = o && o.textContent || t("onThisPage"));
    }
  } catch (d) {
    console.warn("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta && n.meta.title ? String(n.meta.title).trim() : "", p = r.querySelector("img"), f = p && (p.getAttribute("src") || p.src) || null;
    let u = "";
    try {
      let b = "";
      try {
        const y = o || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let S = y.nextElementSibling;
          const L = [];
          for (; S && !(S.tagName && S.tagName.toLowerCase() === "h2"); ) {
            try {
              if (S.classList && S.classList.contains("nimbi-article-subtitle")) {
                S = S.nextElementSibling;
                continue;
              }
            } catch {
            }
            const I = (S.textContent || "").trim();
            I && L.push(I), S = S.nextElementSibling;
          }
          L.length && (b = L.join(" ").replace(/\s+/g, " ").trim()), !b && l && (b = String(l).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      b && String(b).length > 160 && (b = String(b).slice(0, 157).trim() + "..."), u = b;
    } catch (b) {
      console.warn("[seoManager] compute descOverride failed", b);
    }
    let g = "";
    try {
      d && (g = d);
    } catch {
    }
    if (!g)
      try {
        o && o.textContent && (g = String(o.textContent).trim());
      } catch {
      }
    if (!g)
      try {
        const b = r.querySelector("h2");
        b && b.textContent && (g = String(b.textContent).trim());
      } catch {
      }
    g || (g = i || "");
    try {
      ja(n, g || void 0, f, u);
    } catch (b) {
      console.warn("[seoManager] setMetaTags failed", b);
    }
    try {
      Fa(n, h, g || void 0, f, u, e);
    } catch (b) {
      console.warn("[seoManager] setStructuredData failed", b);
    }
    const m = Wa();
    g ? m ? document.title = `${m} - ${g}` : document.title = `${e || "Site"} - ${g}` : d ? document.title = d : document.title = e || document.title;
  } catch (d) {
    console.warn("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      const d = r.querySelectorAll(".nimbi-reading-time");
      d && d.forEach((p) => p.remove());
    } catch {
    }
    if (l) {
      const d = Da(c.raw || ""), p = d && typeof d.minutes == "number" ? Math.ceil(d.minutes) : 0, f = p ? t("readingTime", { minutes: p }) : "";
      if (!f) return;
      const u = r.querySelector("h1");
      if (u) {
        const g = r.querySelector(".nimbi-article-subtitle");
        try {
          if (g) {
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = " • " + f, g.appendChild(m);
          } else {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = f, m.appendChild(b);
            try {
              u.parentElement.insertBefore(m, u.nextSibling);
            } catch {
              try {
                u.insertAdjacentElement("afterend", m);
              } catch {
              }
            }
          }
        } catch {
          try {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = f, b.appendChild(y), u.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    console.warn("[seoManager] reading time update failed", d);
  }
}
let Re = null, W = null, ve = 1, Ke = (t, e) => e, Et = 0, Lt = 0, Qt = () => {
}, xt = 0.25;
function Ga() {
  if (Re && document.contains(Re)) return Re;
  Re = null;
  const t = document.createElement("dialog");
  t.className = "nimbi-image-preview modal", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", Ke("imagePreviewTitle", "Image preview")), t.innerHTML = `
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
  `, t.addEventListener("click", (v) => {
    v.target === t && xn();
  }), t.addEventListener("wheel", (v) => {
    if (!$()) return;
    v.preventDefault();
    const J = v.deltaY < 0 ? xt : -xt;
    Ze(ve + J), h(), c();
  }, { passive: !1 }), t.addEventListener("keydown", (v) => {
    if (v.key === "Escape") {
      xn();
      return;
    }
    if (ve > 1) {
      const J = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!J) return;
      const re = 40;
      switch (v.key) {
        case "ArrowUp":
          J.scrollTop -= re, v.preventDefault();
          break;
        case "ArrowDown":
          J.scrollTop += re, v.preventDefault();
          break;
        case "ArrowLeft":
          J.scrollLeft -= re, v.preventDefault();
          break;
        case "ArrowRight":
          J.scrollLeft += re, v.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), Re = t, W = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), o = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function h() {
    o && (o.textContent = `${Math.round(ve * 100)}%`);
  }
  const c = () => {
    l && (l.textContent = `${Math.round(ve * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  Qt = h, s.addEventListener("click", () => {
    Ze(ve + xt), h(), c();
  }), r.addEventListener("click", () => {
    Ze(ve - xt), h(), c();
  }), e.addEventListener("click", () => {
    Tt(), h(), c();
  }), n.addEventListener("click", () => {
    Ze(1), h(), c();
  }), i.addEventListener("click", () => {
    Tt(), h(), c();
  }), a.addEventListener("click", xn), e.title = Ke("imagePreviewFit", "Fit to screen"), n.title = Ke("imagePreviewOriginal", "Original size"), r.title = Ke("imagePreviewZoomOut", "Zoom out"), s.title = Ke("imagePreviewZoomIn", "Zoom in"), a.title = Ke("imagePreviewClose", "Close"), a.setAttribute("aria-label", Ke("imagePreviewClose", "Close"));
  let d = !1, p = 0, f = 0, u = 0, g = 0;
  const m = /* @__PURE__ */ new Map();
  let b = 0, y = 1;
  const S = (v, J) => {
    const re = v.x - J.x, A = v.y - J.y;
    return Math.hypot(re, A);
  }, L = () => {
    d = !1, m.clear(), b = 0, W && (W.classList.add("is-panning"), W.classList.remove("is-grabbing"));
  };
  let I = 0, U = 0, Z = 0;
  const F = (v) => {
    const J = Date.now(), re = J - I, A = v.clientX - U, T = v.clientY - Z;
    I = J, U = v.clientX, Z = v.clientY, re < 300 && Math.hypot(A, T) < 30 && (Ze(ve > 1 ? 1 : 2), h(), v.preventDefault());
  }, fe = (v) => {
    Ze(ve > 1 ? 1 : 2), h(), v.preventDefault();
  }, $ = () => Re ? typeof Re.open == "boolean" ? Re.open : Re.classList.contains("is-active") : !1, q = (v, J, re = 1) => {
    if (m.has(re) && m.set(re, { x: v, y: J }), m.size === 2) {
      const P = Array.from(m.values()), k = S(P[0], P[1]);
      if (b > 0) {
        const R = k / b;
        Ze(y * R);
      }
      return;
    }
    if (!d) return;
    const A = W.closest(".nimbi-image-preview__image-wrapper");
    if (!A) return;
    const T = v - p, C = J - f;
    A.scrollLeft = u - T, A.scrollTop = g - C;
  }, Q = (v, J, re = 1) => {
    if (!$()) return;
    if (m.set(re, { x: v, y: J }), m.size === 2) {
      const C = Array.from(m.values());
      b = S(C[0], C[1]), y = ve;
      return;
    }
    const A = W.closest(".nimbi-image-preview__image-wrapper");
    !A || !(A.scrollWidth > A.clientWidth || A.scrollHeight > A.clientHeight) || (d = !0, p = v, f = J, u = A.scrollLeft, g = A.scrollTop, W.classList.add("is-panning"), W.classList.remove("is-grabbing"), window.addEventListener("pointermove", O), window.addEventListener("pointerup", oe), window.addEventListener("pointercancel", oe));
  }, O = (v) => {
    d && (v.preventDefault(), q(v.clientX, v.clientY, v.pointerId));
  }, oe = () => {
    L(), window.removeEventListener("pointermove", O), window.removeEventListener("pointerup", oe), window.removeEventListener("pointercancel", oe);
  };
  W.addEventListener("pointerdown", (v) => {
    v.preventDefault(), Q(v.clientX, v.clientY, v.pointerId);
  }), W.addEventListener("pointermove", (v) => {
    (d || m.size === 2) && v.preventDefault(), q(v.clientX, v.clientY, v.pointerId);
  }), W.addEventListener("pointerup", (v) => {
    v.preventDefault(), v.pointerType === "touch" && F(v), L();
  }), W.addEventListener("dblclick", fe), W.addEventListener("pointercancel", L), W.addEventListener("mousedown", (v) => {
    v.preventDefault(), Q(v.clientX, v.clientY, 1);
  }), W.addEventListener("mousemove", (v) => {
    d && v.preventDefault(), q(v.clientX, v.clientY, 1);
  }), W.addEventListener("mouseup", (v) => {
    v.preventDefault(), L();
  });
  const X = t.querySelector(".nimbi-image-preview__image-wrapper");
  return X && (X.addEventListener("pointerdown", (v) => {
    if (Q(v.clientX, v.clientY, v.pointerId), v && v.target && v.target.tagName === "IMG")
      try {
        v.target.classList.add("is-grabbing");
      } catch {
      }
  }), X.addEventListener("pointermove", (v) => {
    q(v.clientX, v.clientY, v.pointerId);
  }), X.addEventListener("pointerup", L), X.addEventListener("pointercancel", L), X.addEventListener("mousedown", (v) => {
    if (Q(v.clientX, v.clientY, 1), v && v.target && v.target.tagName === "IMG")
      try {
        v.target.classList.add("is-grabbing");
      } catch {
      }
  }), X.addEventListener("mousemove", (v) => {
    q(v.clientX, v.clientY, 1);
  }), X.addEventListener("mouseup", L)), t;
}
function Ze(t) {
  if (!W) return;
  const e = Number(t);
  ve = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = W.getBoundingClientRect(), r = Et || W.naturalWidth || W.width || s.width || 0, i = Lt || W.naturalHeight || W.height || s.height || 0;
  if (r && i) {
    W.style.setProperty("--nimbi-preview-img-max-width", "none"), W.style.setProperty("--nimbi-preview-img-max-height", "none"), W.style.setProperty("--nimbi-preview-img-width", `${r * ve}px`), W.style.setProperty("--nimbi-preview-img-height", `${i * ve}px`), W.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      W.style.width = `${r * ve}px`, W.style.height = `${i * ve}px`, W.style.transform = "none";
    } catch {
    }
  } else {
    W.style.setProperty("--nimbi-preview-img-max-width", ""), W.style.setProperty("--nimbi-preview-img-max-height", ""), W.style.setProperty("--nimbi-preview-img-width", ""), W.style.setProperty("--nimbi-preview-img-height", ""), W.style.setProperty("--nimbi-preview-img-transform", `scale(${ve})`);
    try {
      W.style.transform = `scale(${ve})`;
    } catch {
    }
  }
  W && (W.classList.add("is-panning"), W.classList.remove("is-grabbing"));
}
function Tt() {
  if (!W) return;
  const t = W.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = Et || W.naturalWidth || e.width, s = Lt || W.naturalHeight || e.height;
  if (!n || !s) return;
  const r = e.width / n, i = e.height / s, a = Math.min(r, i, 1);
  Ze(Number.isFinite(a) ? a : 1);
}
function Qa(t, e = "", n = 0, s = 0) {
  const r = Ga();
  ve = 1, Et = n || 0, Lt = s || 0, W.src = t, W.alt = e, W.style.transform = "scale(1)";
  const i = () => {
    Et = W.naturalWidth || W.width || 0, Lt = W.naturalHeight || W.height || 0;
  };
  if (i(), Tt(), Qt(), requestAnimationFrame(() => {
    Tt(), Qt();
  }), !Et || !Lt) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        Tt(), Qt();
      }), W.removeEventListener("load", a);
    };
    W.addEventListener("load", a);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function xn() {
  if (Re) {
    typeof Re.close == "function" && Re.open && Re.close(), Re.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Xa(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Ke = (f, u) => (typeof e == "function" ? e(f) : void 0) || u, xt = n, t.addEventListener("click", (f) => {
    const u = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!u || u.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      u
    );
    if (!g.src) return;
    const m = g.closest("a");
    m && m.getAttribute("href") || Qa(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let s = !1, r = 0, i = 0, a = 0, o = 0;
  const l = /* @__PURE__ */ new Map();
  let h = 0, c = 1;
  const d = (f, u) => {
    const g = f.x - u.x, m = f.y - u.y;
    return Math.hypot(g, m);
  };
  t.addEventListener("pointerdown", (f) => {
    const u = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!u || u.tagName !== "IMG") return;
    const g = u.closest("a");
    if (g && g.getAttribute("href") || !Re || !Re.open) return;
    if (l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      const b = Array.from(l.values());
      h = d(b[0], b[1]), c = ve;
      return;
    }
    const m = u.closest(".nimbi-image-preview__image-wrapper");
    if (m && !(ve <= 1)) {
      f.preventDefault(), s = !0, r = f.clientX, i = f.clientY, a = m.scrollLeft, o = m.scrollTop, u.setPointerCapture(f.pointerId);
      try {
        u.classList.add("is-grabbing");
      } catch {
      }
    }
  }), t.addEventListener("pointermove", (f) => {
    if (l.has(f.pointerId) && l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      f.preventDefault();
      const S = Array.from(l.values()), L = d(S[0], S[1]);
      if (h > 0) {
        const I = L / h;
        Ze(c * I);
      }
      return;
    }
    if (!s) return;
    f.preventDefault();
    const u = (
      /** @type {HTMLElement} */
      f.target
    ), g = u.closest && u.closest("a");
    if (g && g.getAttribute && g.getAttribute("href")) return;
    const m = u.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const b = f.clientX - r, y = f.clientY - i;
    m.scrollLeft = a - b, m.scrollTop = o - y;
  });
  const p = () => {
    s = !1, l.clear(), h = 0;
    try {
      const f = document.querySelector("[data-nimbi-preview-image]");
      f && (f.classList.add("is-panning"), f.classList.remove("is-grabbing"));
    } catch {
    }
  };
  t.addEventListener("pointerup", p), t.addEventListener("pointercancel", p);
}
function Ka(t) {
  const {
    contentWrap: e,
    navWrap: n,
    container: s,
    mountOverlay: r = null,
    t: i,
    contentBase: a,
    homePage: o,
    initialDocumentTitle: l,
    runHooks: h
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const d = Aa(i, [{ path: o, name: i("home"), isIndex: !0, children: [] }]);
  async function p(b, y) {
    let S, L, I;
    try {
      ({ data: S, pagePath: L, anchor: I } = await Cs(b, a));
    } catch (Q) {
      console.error("[nimbi-cms] fetchPageData failed", Q), Rr(e, i, Q);
      return;
    }
    !I && y && (I = y);
    try {
      _n(null);
    } catch (Q) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", Q);
    }
    e.innerHTML = "";
    const { article: U, parsed: Z, toc: F, topH1: fe, h1Text: $, slugKey: q } = await $a(i, S, L, I, a);
    Za(i, l, Z, F, U, L, I, fe, $, q, S), n.innerHTML = "", F && (n.appendChild(F), za(F));
    try {
      await h("transformHtml", { article: U, parsed: Z, toc: F, pagePath: L, anchor: I, topH1: fe, h1Text: $, slugKey: q, data: S });
    } catch (Q) {
      console.warn("[nimbi-cms] transformHtml hooks failed", Q);
    }
    e.appendChild(U);
    try {
      Pa(U);
    } catch (Q) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", Q);
    }
    try {
      Xa(U, { t: i });
    } catch (Q) {
      console.warn("[nimbi-cms] attachImagePreview failed", Q);
    }
    try {
      jt(s, 100, !1), requestAnimationFrame(() => jt(s, 100, !1)), setTimeout(() => jt(s, 100, !1), 250);
    } catch (Q) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", Q);
    }
    _n(I), Na(U, fe, { mountOverlay: r, container: s, navWrap: n, t: i });
    try {
      await h("onPageLoad", { data: S, pagePath: L, anchor: I, article: U, toc: F, topH1: fe, h1Text: $, slugKey: q, contentWrap: e, navWrap: n });
    } catch (Q) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", Q);
    }
    c = L;
  }
  async function f() {
    let b = new URLSearchParams(location.search).get("page") || o;
    const y = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await p(b, y);
    } catch (S) {
      console.warn("[nimbi-cms] renderByQuery failed for", b, S), Rr(e, i, S);
    }
  }
  window.addEventListener("popstate", f);
  const u = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const b = s || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = {
        top: b.scrollTop || 0,
        left: b.scrollLeft || 0
      };
      sessionStorage.setItem(u(), JSON.stringify(y));
    } catch {
    }
  }, m = () => {
    try {
      const b = s || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = sessionStorage.getItem(u());
      if (!y) return;
      const S = JSON.parse(y);
      S && typeof S.top == "number" && b.scrollTo({ top: S.top, left: S.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (b) => {
    if (b.persisted)
      try {
        m(), jt(s, 100, !1);
      } catch (y) {
        console.warn("[nimbi-cms] bfcache restore failed", y);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (b) {
      console.warn("[nimbi-cms] save scroll position failed", b);
    }
  }), { renderByQuery: f, siteNav: d, getCurrentPagePath: () => c };
}
function Ya(t) {
  try {
    let e = typeof t == "string" ? t : typeof window < "u" && window.location ? window.location.search : "";
    if (!e && typeof window < "u" && window.location && window.location.hash) {
      const i = window.location.hash, a = i.indexOf("?");
      a !== -1 && (e = i.slice(a));
    }
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
      (i === "light" || i === "dark" || i === "system") && (s.defaultStyle = i);
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
      Number.isInteger(i) && (i === 1 || i === 2 || i === 3) && (s.indexDepth = i);
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
function Va(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Pr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  if (!e || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e)) return !1;
  const n = e.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let Sn = "";
async function ll(t = {}) {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.info("[nimbi-cms] initCMS called", { options: t });
    } catch {
    }
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const n = Ya();
  if (n && (n.contentPath || n.homePage || n.notFoundPage))
    if (t && t.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage");
      } catch ($) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", $);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage");
      } catch ($) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", $);
      }
      delete n.contentPath, delete n.homePage, delete n.notFoundPage;
    }
  const s = Object.assign({}, n, t);
  n && typeof n.bulmaCustomize == "string" && n.bulmaCustomize.trim() && (s.bulmaCustomize = n.bulmaCustomize);
  let {
    el: r,
    contentPath: i = "/content",
    crawlMaxQueue: a = 1e3,
    searchIndex: o = !0,
    searchIndexMode: l = "eager",
    indexDepth: h = 1,
    noIndexing: c = void 0,
    defaultStyle: d = "light",
    bulmaCustomize: p = "none",
    lang: f = void 0,
    l10nFile: u = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: m,
    markdownExtensions: b,
    availableLanguages: y,
    homePage: S = "_home.md",
    notFoundPage: L = "_404.md"
  } = s;
  try {
    typeof S == "string" && S.startsWith("./") && (S = S.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof L == "string" && L.startsWith("./") && (L = L.replace(/^\.\//, ""));
  } catch {
  }
  const { navbarLogo: I = "favicon" } = s, { skipRootReadme: U = !1 } = s, Z = ($) => {
    try {
      const q = document.querySelector(r);
      q && q instanceof Element && (q.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String($)}</pre></div>`);
    } catch {
    }
  };
  if (s.contentPath != null && !Va(s.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (S != null && !Pr(S))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (L != null && !Pr(L))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r)
    throw new Error("el is required");
  let F = r;
  if (typeof r == "string") {
    if (F = document.querySelector(r), !F) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof i != "string" || !i.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof o != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (l != null && l !== "eager" && l !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (h != null && h !== 1 && h !== 2 && h !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (d !== "light" && d !== "dark" && d !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (u != null && typeof u != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some(($) => !$ || typeof $ != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some(($) => typeof $ != "string" || !$.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some(($) => typeof $ != "string" || !$.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (U != null && typeof U != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (S != null && (typeof S != "string" || !S.trim() || !/\.(md|html)$/.test(S)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (L != null && (typeof L != "string" || !L.trim() || !/\.(md|html)$/.test(L)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const fe = !!o;
  try {
    Promise.resolve().then(() => Gt).then(($) => {
      try {
        $ && typeof $.setSkipRootReadme == "function" && $.setSkipRootReadme(!!U);
      } catch (q) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", q);
      }
    }).catch(($) => {
    });
  } catch ($) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", $);
  }
  try {
    await (async () => {
      try {
        F.classList.add("nimbi-mount");
      } catch (k) {
        console.warn("[nimbi-cms] mount element setup failed", k);
      }
      const $ = document.createElement("section");
      $.className = "section";
      const q = document.createElement("div");
      q.className = "container nimbi-cms";
      const Q = document.createElement("div");
      Q.className = "columns";
      const O = document.createElement("div");
      O.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", O.setAttribute("role", "navigation");
      try {
        const k = typeof yt == "function" ? yt("navigation") : null;
        k && O.setAttribute("aria-label", k);
      } catch (k) {
        console.warn("[nimbi-cms] set nav aria-label failed", k);
      }
      Q.appendChild(O);
      const oe = document.createElement("main");
      oe.className = "column nimbi-content", oe.setAttribute("role", "main"), Q.appendChild(oe), q.appendChild(Q), $.appendChild(q);
      const X = O, v = oe;
      F.appendChild($);
      let J = null;
      try {
        J = F.querySelector(".nimbi-overlay"), J || (J = document.createElement("div"), J.className = "nimbi-overlay", F.appendChild(J));
      } catch (k) {
        J = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
      }
      const re = location.pathname || "/", A = re.endsWith("/") ? re : re.substring(0, re.lastIndexOf("/") + 1);
      try {
        Sn = document.title || "";
      } catch (k) {
        Sn = "", console.warn("[nimbi-cms] read initial document title failed", k);
      }
      let T = i;
      (T === "." || T === "./") && (T = ""), T.startsWith("./") && (T = T.slice(2)), T.startsWith("/") && (T = T.slice(1)), T !== "" && !T.endsWith("/") && (T = T + "/");
      const C = new URL(A + T, location.origin).toString();
      try {
        Promise.resolve().then(() => Gt).then((k) => {
          try {
            k && typeof k.setHomePage == "function" && k.setHomePage(S);
          } catch (R) {
            console.warn("[nimbi-cms] setHomePage failed", R);
          }
        }).catch((k) => {
        });
      } catch (k) {
        console.warn("[nimbi-cms] setHomePage dynamic import failed", k);
      }
      u && await qr(u, A), y && Array.isArray(y) && jr(y), f && Dr(f);
      const P = Ka({ contentWrap: v, navWrap: X, container: q, mountOverlay: J, t: yt, contentBase: C, homePage: S, initialDocumentTitle: Sn, runHooks: cr });
      if (typeof g == "number" && g >= 0 && typeof mr == "function" && mr(g * 60 * 1e3), typeof m == "number" && m >= 0 && typeof gr == "function" && gr(m), b && Array.isArray(b) && b.length)
        try {
          b.forEach((k) => {
            typeof k == "object" && Sa && typeof Rn == "function" && Rn(k);
          });
        } catch (k) {
          console.warn("[nimbi-cms] applying markdownExtensions failed", k);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => Gt).then(({ setDefaultCrawlMaxQueue: k }) => {
          try {
            k(a);
          } catch (R) {
            console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", R);
          }
        });
      } catch (k) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", k);
      }
      try {
        Vt(C);
      } catch (k) {
        console.warn("[nimbi-cms] setContentBase failed", k);
      }
      try {
        An(L);
      } catch (k) {
        console.warn("[nimbi-cms] setNotFoundPage failed", k);
      }
      try {
        Vt(C);
      } catch (k) {
        console.warn("[nimbi-cms] setContentBase failed", k);
      }
      try {
        An(L);
      } catch (k) {
        console.warn("[nimbi-cms] setNotFoundPage failed", k);
      }
      try {
        await Ee(S, C);
      } catch (k) {
        throw S === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${S} not found at ${C}${S}: ${k.message}`);
      }
      rs(d), await ns(p, A);
      try {
        const k = document.createElement("header");
        k.className = "nimbi-site-navbar", F.insertBefore(k, $);
        const R = await Ee("_navigation.md", C), N = await rn(R.raw || ""), { navbar: te, linkEls: ue } = await Ba(k, q, N.html || "", C, S, yt, P.renderByQuery, fe, l, h, c, I);
        try {
          await cr("onNavBuild", { navWrap: X, navbar: te, linkEls: ue, contentBase: C });
        } catch (he) {
          console.warn("[nimbi-cms] onNavBuild hooks failed", he);
        }
        try {
          const he = () => {
            const Le = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
            if (Le > 0) {
              try {
                F.style.setProperty("--nimbi-site-navbar-height", `${Le}px`);
              } catch (ce) {
                console.warn("[nimbi-cms] set CSS var failed", ce);
              }
              try {
                q.style.paddingTop = "";
              } catch (ce) {
                console.warn("[nimbi-cms] set container paddingTop failed", ce);
              }
              try {
                const ce = F && F.getBoundingClientRect && Math.round(F.getBoundingClientRect().height) || F && F.clientHeight || 0;
                if (ce > 0) {
                  const ze = Math.max(0, ce - Le);
                  try {
                    q.style.setProperty("--nimbi-cms-height", `${ze}px`);
                  } catch (lt) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", lt);
                  }
                } else
                  try {
                    q.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (ze) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", ze);
                  }
              } catch (ce) {
                console.warn("[nimbi-cms] compute container height failed", ce);
              }
              try {
                k.style.setProperty("--nimbi-site-navbar-height", `${Le}px`);
              } catch (ce) {
                console.warn("[nimbi-cms] set navbar CSS var failed", ce);
              }
            }
          };
          he();
          try {
            if (typeof ResizeObserver < "u") {
              const Le = new ResizeObserver(() => he());
              try {
                Le.observe(k);
              } catch (ce) {
                console.warn("[nimbi-cms] ResizeObserver.observe failed", ce);
              }
            }
          } catch (Le) {
            console.warn("[nimbi-cms] ResizeObserver setup failed", Le);
          }
        } catch (he) {
          console.warn("[nimbi-cms] compute navbar height failed", he);
        }
      } catch (k) {
        console.warn("[nimbi-cms] build navigation failed", k);
      }
      await P.renderByQuery();
      try {
        Promise.resolve().then(() => el).then(({ getVersion: k }) => {
          typeof k == "function" && k().then((R) => {
            try {
              const N = R || "0.0.0";
              try {
                const te = (Le) => {
                  const ce = document.createElement("a");
                  ce.className = "nimbi-version-label tag is-small", ce.textContent = `Ninbi CMS v. ${N}`, ce.href = Le || "#", ce.target = "_blank", ce.rel = "noopener noreferrer nofollow", ce.setAttribute("aria-label", `Ninbi CMS version ${N}`);
                  try {
                    Br(ce);
                  } catch {
                  }
                  try {
                    F.appendChild(ce);
                  } catch (ze) {
                    console.warn("[nimbi-cms] append version label failed", ze);
                  }
                }, ue = "https://abelvm.github.io/nimbiCMS/", he = (() => {
                  try {
                    if (ue && typeof ue == "string")
                      return new URL(ue).toString();
                  } catch {
                  }
                  return "#";
                })();
                te(he);
              } catch (te) {
                console.warn("[nimbi-cms] building version label failed", te);
              }
            } catch (N) {
              console.warn("[nimbi-cms] building version label failed", N);
            }
          }).catch((R) => {
            console.warn("[nimbi-cms] getVersion() failed", R);
          });
        }).catch((k) => {
          console.warn("[nimbi-cms] import version module failed", k);
        });
      } catch (k) {
        console.warn("[nimbi-cms] version label setup failed", k);
      }
    })();
  } catch ($) {
    throw Z($), $;
  }
}
async function Ja() {
  try {
    if ("1.0.1".trim())
      return "1.0.1";
  } catch {
  }
  return "0.0.0";
}
const el = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Ja
}, Symbol.toStringTag, { value: "Module" }));
export {
  zr as BAD_LANGUAGES,
  ne as SUPPORTED_HLJS_MAP,
  il as _clearHooks,
  $n as addHook,
  ll as default,
  ns as ensureBulma,
  Ja as getVersion,
  ll as initCMS,
  qr as loadL10nFile,
  Nr as loadSupportedLanguages,
  es as observeCodeBlocks,
  nl as onNavBuild,
  tl as onPageLoad,
  Rt as registerLanguage,
  cr as runHooks,
  sl as setHighlightTheme,
  Dr as setLang,
  rs as setStyle,
  al as setThemeVars,
  yt as t,
  rl as transformHtml
};
