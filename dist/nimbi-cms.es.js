const Rt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function _n(t, e) {
  if (!Object.prototype.hasOwnProperty.call(Rt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  Rt[t].push(e);
}
function xo(t) {
  _n("onPageLoad", t);
}
function So(t) {
  _n("onNavBuild", t);
}
function vo(t) {
  _n("transformHtml", t);
}
async function lr(t, e) {
  const n = Rt[t] || [];
  for (const s of n)
    try {
      await s(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function Ao() {
  Object.keys(Rt).forEach((t) => {
    Rt[t].length = 0;
  });
}
function $r(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var gn, cr;
function fs() {
  if (cr) return gn;
  cr = 1;
  function t(m) {
    return m instanceof Map ? m.clear = m.delete = m.set = function() {
      throw new Error("map is read-only");
    } : m instanceof Set && (m.add = m.clear = m.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(m), Object.getOwnPropertyNames(m).forEach((x) => {
      const L = m[x], K = typeof L;
      (K === "object" || K === "function") && !Object.isFrozen(L) && t(L);
    }), m;
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
  function n(m) {
    return m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(m, ...x) {
    const L = /* @__PURE__ */ Object.create(null);
    for (const K in m)
      L[K] = m[K];
    return x.forEach(function(K) {
      for (const we in K)
        L[we] = K[we];
    }), /** @type {T} */
    L;
  }
  const r = "</span>", i = (m) => !!m.scope, a = (m, { prefix: x }) => {
    if (m.startsWith("language:"))
      return m.replace("language:", "language-");
    if (m.includes(".")) {
      const L = m.split(".");
      return [
        `${x}${L.shift()}`,
        ...L.map((K, we) => `${K}${"_".repeat(we + 1)}`)
      ].join(" ");
    }
    return `${x}${m}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(x, L) {
      this.buffer = "", this.classPrefix = L.classPrefix, x.walk(this);
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
      const L = a(
        x.scope,
        { prefix: this.classPrefix }
      );
      this.span(L);
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
  const o = (m = {}) => {
    const x = { children: [] };
    return Object.assign(x, m), x;
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
    add(x) {
      this.top.children.push(x);
    }
    /** @param {string} scope */
    openNode(x) {
      const L = o({ scope: x });
      this.add(L), this.stack.push(L);
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
    static _walk(x, L) {
      return typeof L == "string" ? x.addText(L) : L.children && (x.openNode(L), L.children.forEach((K) => this._walk(x, K)), x.closeNode(L)), x;
    }
    /**
     * @param {Node} node
     */
    static _collapse(x) {
      typeof x != "string" && x.children && (x.children.every((L) => typeof L == "string") ? x.children = [x.children.join("")] : x.children.forEach((L) => {
        u._collapse(L);
      }));
    }
  }
  class c extends u {
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
    __addSublanguage(x, L) {
      const K = x.root;
      L && (K.scope = `language:${L}`), this.add(K);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(m) {
    return m ? typeof m == "string" ? m : m.source : null;
  }
  function f(m) {
    return g("(?=", m, ")");
  }
  function p(m) {
    return g("(?:", m, ")*");
  }
  function d(m) {
    return g("(?:", m, ")?");
  }
  function g(...m) {
    return m.map((L) => h(L)).join("");
  }
  function w(m) {
    const x = m[m.length - 1];
    return typeof x == "object" && x.constructor === Object ? (m.splice(m.length - 1, 1), x) : {};
  }
  function b(...m) {
    return "(" + (w(m).capture ? "" : "?:") + m.map((K) => h(K)).join("|") + ")";
  }
  function k(m) {
    return new RegExp(m.toString() + "|").exec("").length - 1;
  }
  function E(m, x) {
    const L = m && m.exec(x);
    return L && L.index === 0;
  }
  const I = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function M(m, { joinWith: x }) {
    let L = 0;
    return m.map((K) => {
      L += 1;
      const we = L;
      let be = h(K), N = "";
      for (; be.length > 0; ) {
        const $ = I.exec(be);
        if (!$) {
          N += be;
          break;
        }
        N += be.substring(0, $.index), be = be.substring($.index + $[0].length), $[0][0] === "\\" && $[1] ? N += "\\" + String(Number($[1]) + we) : (N += $[0], $[0] === "(" && L++);
      }
      return N;
    }).map((K) => `(${K})`).join(x);
  }
  const z = /\b\B/, Z = "[a-zA-Z]\\w*", V = "[a-zA-Z_]\\w*", ie = "\\b\\d+(\\.\\d+)?", J = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", W = "\\b(0b[01]+)", X = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", D = (m = {}) => {
    const x = /^#![ ]*\//;
    return m.binary && (m.begin = g(
      x,
      /.*\b/,
      m.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: x,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (L, K) => {
        L.index !== 0 && K.ignoreMatch();
      }
    }, m);
  }, he = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, F = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [he]
  }, S = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [he]
  }, ne = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, Q = function(m, x, L = {}) {
    const K = s(
      {
        scope: "comment",
        begin: m,
        end: x,
        contains: []
      },
      L
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
    const we = b(
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
          we,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), K;
  }, v = Q("//", "$"), _ = Q("/\\*", "\\*/"), y = Q("#", "$"), R = {
    scope: "number",
    begin: ie,
    relevance: 0
  }, P = {
    scope: "number",
    begin: J,
    relevance: 0
  }, T = {
    scope: "number",
    begin: W,
    relevance: 0
  }, O = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      he,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [he]
      }
    ]
  }, B = {
    scope: "title",
    begin: Z,
    relevance: 0
  }, ce = {
    scope: "title",
    begin: V,
    relevance: 0
  }, ge = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + V,
    relevance: 0
  };
  var Pe = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: F,
    BACKSLASH_ESCAPE: he,
    BINARY_NUMBER_MODE: T,
    BINARY_NUMBER_RE: W,
    COMMENT: Q,
    C_BLOCK_COMMENT_MODE: _,
    C_LINE_COMMENT_MODE: v,
    C_NUMBER_MODE: P,
    C_NUMBER_RE: J,
    END_SAME_AS_BEGIN: function(m) {
      return Object.assign(
        m,
        {
          /** @type {ModeCallback} */
          "on:begin": (x, L) => {
            L.data._beginMatch = x[1];
          },
          /** @type {ModeCallback} */
          "on:end": (x, L) => {
            L.data._beginMatch !== x[1] && L.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: y,
    IDENT_RE: Z,
    MATCH_NOTHING_RE: z,
    METHOD_GUARD: ge,
    NUMBER_MODE: R,
    NUMBER_RE: ie,
    PHRASAL_WORDS_MODE: ne,
    QUOTE_STRING_MODE: S,
    REGEXP_MODE: O,
    RE_STARTERS_RE: X,
    SHEBANG: D,
    TITLE_MODE: B,
    UNDERSCORE_IDENT_RE: V,
    UNDERSCORE_TITLE_MODE: ce
  });
  function ht(m, x) {
    m.input[m.index - 1] === "." && x.ignoreMatch();
  }
  function It(m, x) {
    m.className !== void 0 && (m.scope = m.className, delete m.className);
  }
  function it(m, x) {
    x && m.beginKeywords && (m.begin = "\\b(" + m.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", m.__beforeBegin = ht, m.keywords = m.keywords || m.beginKeywords, delete m.beginKeywords, m.relevance === void 0 && (m.relevance = 0));
  }
  function on(m, x) {
    Array.isArray(m.illegal) && (m.illegal = b(...m.illegal));
  }
  function Pi(m, x) {
    if (m.match) {
      if (m.begin || m.end) throw new Error("begin & end are not supported with match");
      m.begin = m.match, delete m.match;
    }
  }
  function Ii(m, x) {
    m.relevance === void 0 && (m.relevance = 1);
  }
  const zi = (m, x) => {
    if (!m.beforeMatch) return;
    if (m.starts) throw new Error("beforeMatch cannot be used with starts");
    const L = Object.assign({}, m);
    Object.keys(m).forEach((K) => {
      delete m[K];
    }), m.keywords = L.keywords, m.begin = g(L.beforeMatch, f(L.begin)), m.starts = {
      relevance: 0,
      contains: [
        Object.assign(L, { endsParent: !0 })
      ]
    }, m.relevance = 0, delete L.beforeMatch;
  }, Bi = [
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
  ], Ni = "keyword";
  function Zn(m, x, L = Ni) {
    const K = /* @__PURE__ */ Object.create(null);
    return typeof m == "string" ? we(L, m.split(" ")) : Array.isArray(m) ? we(L, m) : Object.keys(m).forEach(function(be) {
      Object.assign(
        K,
        Zn(m[be], x, be)
      );
    }), K;
    function we(be, N) {
      x && (N = N.map(($) => $.toLowerCase())), N.forEach(function($) {
        const G = $.split("|");
        K[G[0]] = [be, Oi(G[0], G[1])];
      });
    }
  }
  function Oi(m, x) {
    return x ? Number(x) : qi(m) ? 0 : 1;
  }
  function qi(m) {
    return Bi.includes(m.toLowerCase());
  }
  const Gn = {}, Ve = (m) => {
    console.error(m);
  }, Qn = (m, ...x) => {
    console.log(`WARN: ${m}`, ...x);
  }, st = (m, x) => {
    Gn[`${m}/${x}`] || (console.log(`Deprecated as of ${m}. ${x}`), Gn[`${m}/${x}`] = !0);
  }, zt = new Error();
  function Xn(m, x, { key: L }) {
    let K = 0;
    const we = m[L], be = {}, N = {};
    for (let $ = 1; $ <= x.length; $++)
      N[$ + K] = we[$], be[$ + K] = !0, K += k(x[$ - 1]);
    m[L] = N, m[L]._emit = be, m[L]._multi = !0;
  }
  function Di(m) {
    if (Array.isArray(m.begin)) {
      if (m.skip || m.excludeBegin || m.returnBegin)
        throw Ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), zt;
      if (typeof m.beginScope != "object" || m.beginScope === null)
        throw Ve("beginScope must be object"), zt;
      Xn(m, m.begin, { key: "beginScope" }), m.begin = M(m.begin, { joinWith: "" });
    }
  }
  function Ui(m) {
    if (Array.isArray(m.end)) {
      if (m.skip || m.excludeEnd || m.returnEnd)
        throw Ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"), zt;
      if (typeof m.endScope != "object" || m.endScope === null)
        throw Ve("endScope must be object"), zt;
      Xn(m, m.end, { key: "endScope" }), m.end = M(m.end, { joinWith: "" });
    }
  }
  function Hi(m) {
    m.scope && typeof m.scope == "object" && m.scope !== null && (m.beginScope = m.scope, delete m.scope);
  }
  function ji(m) {
    Hi(m), typeof m.beginScope == "string" && (m.beginScope = { _wrap: m.beginScope }), typeof m.endScope == "string" && (m.endScope = { _wrap: m.endScope }), Di(m), Ui(m);
  }
  function Fi(m) {
    function x(N, $) {
      return new RegExp(
        h(N),
        "m" + (m.case_insensitive ? "i" : "") + (m.unicodeRegex ? "u" : "") + ($ ? "g" : "")
      );
    }
    class L {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule($, G) {
        G.position = this.position++, this.matchIndexes[this.matchAt] = G, this.regexes.push([G, $]), this.matchAt += k($) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const $ = this.regexes.map((G) => G[1]);
        this.matcherRe = x(M($, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec($) {
        this.matcherRe.lastIndex = this.lastIndex;
        const G = this.matcherRe.exec($);
        if (!G)
          return null;
        const Se = G.findIndex((dt, cn) => cn > 0 && dt !== void 0), ye = this.matchIndexes[Se];
        return G.splice(0, Se), Object.assign(G, ye);
      }
    }
    class K {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher($) {
        if (this.multiRegexes[$]) return this.multiRegexes[$];
        const G = new L();
        return this.rules.slice($).forEach(([Se, ye]) => G.addRule(Se, ye)), G.compile(), this.multiRegexes[$] = G, G;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule($, G) {
        this.rules.push([$, G]), G.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec($) {
        const G = this.getMatcher(this.regexIndex);
        G.lastIndex = this.lastIndex;
        let Se = G.exec($);
        if (this.resumingScanAtSamePosition() && !(Se && Se.index === this.lastIndex)) {
          const ye = this.getMatcher(0);
          ye.lastIndex = this.lastIndex + 1, Se = ye.exec($);
        }
        return Se && (this.regexIndex += Se.position + 1, this.regexIndex === this.count && this.considerAll()), Se;
      }
    }
    function we(N) {
      const $ = new K();
      return N.contains.forEach((G) => $.addRule(G.begin, { rule: G, type: "begin" })), N.terminatorEnd && $.addRule(N.terminatorEnd, { type: "end" }), N.illegal && $.addRule(N.illegal, { type: "illegal" }), $;
    }
    function be(N, $) {
      const G = (
        /** @type CompiledMode */
        N
      );
      if (N.isCompiled) return G;
      [
        It,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Pi,
        ji,
        zi
      ].forEach((ye) => ye(N, $)), m.compilerExtensions.forEach((ye) => ye(N, $)), N.__beforeBegin = null, [
        it,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        on,
        // default to 1 relevance if not specified
        Ii
      ].forEach((ye) => ye(N, $)), N.isCompiled = !0;
      let Se = null;
      return typeof N.keywords == "object" && N.keywords.$pattern && (N.keywords = Object.assign({}, N.keywords), Se = N.keywords.$pattern, delete N.keywords.$pattern), Se = Se || /\w+/, N.keywords && (N.keywords = Zn(N.keywords, m.case_insensitive)), G.keywordPatternRe = x(Se, !0), $ && (N.begin || (N.begin = /\B|\b/), G.beginRe = x(G.begin), !N.end && !N.endsWithParent && (N.end = /\B|\b/), N.end && (G.endRe = x(G.end)), G.terminatorEnd = h(G.end) || "", N.endsWithParent && $.terminatorEnd && (G.terminatorEnd += (N.end ? "|" : "") + $.terminatorEnd)), N.illegal && (G.illegalRe = x(
        /** @type {RegExp | string} */
        N.illegal
      )), N.contains || (N.contains = []), N.contains = [].concat(...N.contains.map(function(ye) {
        return Wi(ye === "self" ? N : ye);
      })), N.contains.forEach(function(ye) {
        be(
          /** @type Mode */
          ye,
          G
        );
      }), N.starts && be(N.starts, $), G.matcher = we(G), G;
    }
    if (m.compilerExtensions || (m.compilerExtensions = []), m.contains && m.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return m.classNameAliases = s(m.classNameAliases || {}), be(
      /** @type Mode */
      m
    );
  }
  function Kn(m) {
    return m ? m.endsWithParent || Kn(m.starts) : !1;
  }
  function Wi(m) {
    return m.variants && !m.cachedVariants && (m.cachedVariants = m.variants.map(function(x) {
      return s(m, { variants: null }, x);
    })), m.cachedVariants ? m.cachedVariants : Kn(m) ? s(m, { starts: m.starts ? s(m.starts) : null }) : Object.isFrozen(m) ? s(m) : m;
  }
  var Zi = "11.11.1";
  class Gi extends Error {
    constructor(x, L) {
      super(x), this.name = "HTMLInjectionError", this.html = L;
    }
  }
  const ln = n, Yn = s, Vn = /* @__PURE__ */ Symbol("nomatch"), Qi = 7, Jn = function(m) {
    const x = /* @__PURE__ */ Object.create(null), L = /* @__PURE__ */ Object.create(null), K = [];
    let we = !0;
    const be = "Could not find the language '{}', did you forget to load/include a language module?", N = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let $ = {
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
    function G(A) {
      return $.noHighlightRe.test(A);
    }
    function Se(A) {
      let U = A.className + " ";
      U += A.parentNode ? A.parentNode.className : "";
      const se = $.languageDetectRe.exec(U);
      if (se) {
        const de = We(se[1]);
        return de || (Qn(be.replace("{}", se[1])), Qn("Falling back to no-highlight mode for this block.", A)), de ? se[1] : "no-highlight";
      }
      return U.split(/\s+/).find((de) => G(de) || We(de));
    }
    function ye(A, U, se) {
      let de = "", ke = "";
      typeof U == "object" ? (de = A, se = U.ignoreIllegals, ke = U.language) : (st("10.7.0", "highlight(lang, code, ...args) has been deprecated."), st("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ke = A, de = U), se === void 0 && (se = !0);
      const Ie = {
        code: de,
        language: ke
      };
      Nt("before:highlight", Ie);
      const Ze = Ie.result ? Ie.result : dt(Ie.language, Ie.code, se);
      return Ze.code = Ie.code, Nt("after:highlight", Ze), Ze;
    }
    function dt(A, U, se, de) {
      const ke = /* @__PURE__ */ Object.create(null);
      function Ie(C, q) {
        return C.keywords[q];
      }
      function Ze() {
        if (!Y.keywords) {
          Ae.addText(fe);
          return;
        }
        let C = 0;
        Y.keywordPatternRe.lastIndex = 0;
        let q = Y.keywordPatternRe.exec(fe), ee = "";
        for (; q; ) {
          ee += fe.substring(C, q.index);
          const ue = Oe.case_insensitive ? q[0].toLowerCase() : q[0], Ee = Ie(Y, ue);
          if (Ee) {
            const [He, hs] = Ee;
            if (Ae.addText(ee), ee = "", ke[ue] = (ke[ue] || 0) + 1, ke[ue] <= Qi && (Dt += hs), He.startsWith("_"))
              ee += q[0];
            else {
              const ds = Oe.classNameAliases[He] || He;
              Ne(q[0], ds);
            }
          } else
            ee += q[0];
          C = Y.keywordPatternRe.lastIndex, q = Y.keywordPatternRe.exec(fe);
        }
        ee += fe.substring(C), Ae.addText(ee);
      }
      function Ot() {
        if (fe === "") return;
        let C = null;
        if (typeof Y.subLanguage == "string") {
          if (!x[Y.subLanguage]) {
            Ae.addText(fe);
            return;
          }
          C = dt(Y.subLanguage, fe, !0, or[Y.subLanguage]), or[Y.subLanguage] = /** @type {CompiledMode} */
          C._top;
        } else
          C = un(fe, Y.subLanguage.length ? Y.subLanguage : null);
        Y.relevance > 0 && (Dt += C.relevance), Ae.__addSublanguage(C._emitter, C.language);
      }
      function Ce() {
        Y.subLanguage != null ? Ot() : Ze(), fe = "";
      }
      function Ne(C, q) {
        C !== "" && (Ae.startScope(q), Ae.addText(C), Ae.endScope());
      }
      function rr(C, q) {
        let ee = 1;
        const ue = q.length - 1;
        for (; ee <= ue; ) {
          if (!C._emit[ee]) {
            ee++;
            continue;
          }
          const Ee = Oe.classNameAliases[C[ee]] || C[ee], He = q[ee];
          Ee ? Ne(He, Ee) : (fe = He, Ze(), fe = ""), ee++;
        }
      }
      function ir(C, q) {
        return C.scope && typeof C.scope == "string" && Ae.openNode(Oe.classNameAliases[C.scope] || C.scope), C.beginScope && (C.beginScope._wrap ? (Ne(fe, Oe.classNameAliases[C.beginScope._wrap] || C.beginScope._wrap), fe = "") : C.beginScope._multi && (rr(C.beginScope, q), fe = "")), Y = Object.create(C, { parent: { value: Y } }), Y;
      }
      function sr(C, q, ee) {
        let ue = E(C.endRe, ee);
        if (ue) {
          if (C["on:end"]) {
            const Ee = new e(C);
            C["on:end"](q, Ee), Ee.isMatchIgnored && (ue = !1);
          }
          if (ue) {
            for (; C.endsParent && C.parent; )
              C = C.parent;
            return C;
          }
        }
        if (C.endsWithParent)
          return sr(C.parent, q, ee);
      }
      function as(C) {
        return Y.matcher.regexIndex === 0 ? (fe += C[0], 1) : (pn = !0, 0);
      }
      function os(C) {
        const q = C[0], ee = C.rule, ue = new e(ee), Ee = [ee.__beforeBegin, ee["on:begin"]];
        for (const He of Ee)
          if (He && (He(C, ue), ue.isMatchIgnored))
            return as(q);
        return ee.skip ? fe += q : (ee.excludeBegin && (fe += q), Ce(), !ee.returnBegin && !ee.excludeBegin && (fe = q)), ir(ee, C), ee.returnBegin ? 0 : q.length;
      }
      function ls(C) {
        const q = C[0], ee = U.substring(C.index), ue = sr(Y, C, ee);
        if (!ue)
          return Vn;
        const Ee = Y;
        Y.endScope && Y.endScope._wrap ? (Ce(), Ne(q, Y.endScope._wrap)) : Y.endScope && Y.endScope._multi ? (Ce(), rr(Y.endScope, C)) : Ee.skip ? fe += q : (Ee.returnEnd || Ee.excludeEnd || (fe += q), Ce(), Ee.excludeEnd && (fe = q));
        do
          Y.scope && Ae.closeNode(), !Y.skip && !Y.subLanguage && (Dt += Y.relevance), Y = Y.parent;
        while (Y !== ue.parent);
        return ue.starts && ir(ue.starts, C), Ee.returnEnd ? 0 : q.length;
      }
      function cs() {
        const C = [];
        for (let q = Y; q !== Oe; q = q.parent)
          q.scope && C.unshift(q.scope);
        C.forEach((q) => Ae.openNode(q));
      }
      let qt = {};
      function ar(C, q) {
        const ee = q && q[0];
        if (fe += C, ee == null)
          return Ce(), 0;
        if (qt.type === "begin" && q.type === "end" && qt.index === q.index && ee === "") {
          if (fe += U.slice(q.index, q.index + 1), !we) {
            const ue = new Error(`0 width match regex (${A})`);
            throw ue.languageName = A, ue.badRule = qt.rule, ue;
          }
          return 1;
        }
        if (qt = q, q.type === "begin")
          return os(q);
        if (q.type === "illegal" && !se) {
          const ue = new Error('Illegal lexeme "' + ee + '" for mode "' + (Y.scope || "<unnamed>") + '"');
          throw ue.mode = Y, ue;
        } else if (q.type === "end") {
          const ue = ls(q);
          if (ue !== Vn)
            return ue;
        }
        if (q.type === "illegal" && ee === "")
          return fe += `
`, 1;
        if (fn > 1e5 && fn > q.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return fe += ee, ee.length;
      }
      const Oe = We(A);
      if (!Oe)
        throw Ve(be.replace("{}", A)), new Error('Unknown language: "' + A + '"');
      const us = Fi(Oe);
      let dn = "", Y = de || us;
      const or = {}, Ae = new $.__emitter($);
      cs();
      let fe = "", Dt = 0, Je = 0, fn = 0, pn = !1;
      try {
        if (Oe.__emitTokens)
          Oe.__emitTokens(U, Ae);
        else {
          for (Y.matcher.considerAll(); ; ) {
            fn++, pn ? pn = !1 : Y.matcher.considerAll(), Y.matcher.lastIndex = Je;
            const C = Y.matcher.exec(U);
            if (!C) break;
            const q = U.substring(Je, C.index), ee = ar(q, C);
            Je = C.index + ee;
          }
          ar(U.substring(Je));
        }
        return Ae.finalize(), dn = Ae.toHTML(), {
          language: A,
          value: dn,
          relevance: Dt,
          illegal: !1,
          _emitter: Ae,
          _top: Y
        };
      } catch (C) {
        if (C.message && C.message.includes("Illegal"))
          return {
            language: A,
            value: ln(U),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: C.message,
              index: Je,
              context: U.slice(Je - 100, Je + 100),
              mode: C.mode,
              resultSoFar: dn
            },
            _emitter: Ae
          };
        if (we)
          return {
            language: A,
            value: ln(U),
            illegal: !1,
            relevance: 0,
            errorRaised: C,
            _emitter: Ae,
            _top: Y
          };
        throw C;
      }
    }
    function cn(A) {
      const U = {
        value: ln(A),
        illegal: !1,
        relevance: 0,
        _top: N,
        _emitter: new $.__emitter($)
      };
      return U._emitter.addText(A), U;
    }
    function un(A, U) {
      U = U || $.languages || Object.keys(x);
      const se = cn(A), de = U.filter(We).filter(nr).map(
        (Ce) => dt(Ce, A, !1)
      );
      de.unshift(se);
      const ke = de.sort((Ce, Ne) => {
        if (Ce.relevance !== Ne.relevance) return Ne.relevance - Ce.relevance;
        if (Ce.language && Ne.language) {
          if (We(Ce.language).supersetOf === Ne.language)
            return 1;
          if (We(Ne.language).supersetOf === Ce.language)
            return -1;
        }
        return 0;
      }), [Ie, Ze] = ke, Ot = Ie;
      return Ot.secondBest = Ze, Ot;
    }
    function Xi(A, U, se) {
      const de = U && L[U] || se;
      A.classList.add("hljs"), A.classList.add(`language-${de}`);
    }
    function hn(A) {
      let U = null;
      const se = Se(A);
      if (G(se)) return;
      if (Nt(
        "before:highlightElement",
        { el: A, language: se }
      ), A.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", A);
        return;
      }
      if (A.children.length > 0 && ($.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(A)), $.throwUnescapedHTML))
        throw new Gi(
          "One of your code blocks includes unescaped HTML.",
          A.innerHTML
        );
      U = A;
      const de = U.textContent, ke = se ? ye(de, { language: se, ignoreIllegals: !0 }) : un(de);
      A.innerHTML = ke.value, A.dataset.highlighted = "yes", Xi(A, se, ke.language), A.result = {
        language: ke.language,
        // TODO: remove with version 11.0
        re: ke.relevance,
        relevance: ke.relevance
      }, ke.secondBest && (A.secondBest = {
        language: ke.secondBest.language,
        relevance: ke.secondBest.relevance
      }), Nt("after:highlightElement", { el: A, result: ke, text: de });
    }
    function Ki(A) {
      $ = Yn($, A);
    }
    const Yi = () => {
      Bt(), st("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Vi() {
      Bt(), st("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let er = !1;
    function Bt() {
      function A() {
        Bt();
      }
      if (document.readyState === "loading") {
        er || window.addEventListener("DOMContentLoaded", A, !1), er = !0;
        return;
      }
      document.querySelectorAll($.cssSelector).forEach(hn);
    }
    function Ji(A, U) {
      let se = null;
      try {
        se = U(m);
      } catch (de) {
        if (Ve("Language definition for '{}' could not be registered.".replace("{}", A)), we)
          Ve(de);
        else
          throw de;
        se = N;
      }
      se.name || (se.name = A), x[A] = se, se.rawDefinition = U.bind(null, m), se.aliases && tr(se.aliases, { languageName: A });
    }
    function es(A) {
      delete x[A];
      for (const U of Object.keys(L))
        L[U] === A && delete L[U];
    }
    function ts() {
      return Object.keys(x);
    }
    function We(A) {
      return A = (A || "").toLowerCase(), x[A] || x[L[A]];
    }
    function tr(A, { languageName: U }) {
      typeof A == "string" && (A = [A]), A.forEach((se) => {
        L[se.toLowerCase()] = U;
      });
    }
    function nr(A) {
      const U = We(A);
      return U && !U.disableAutodetect;
    }
    function ns(A) {
      A["before:highlightBlock"] && !A["before:highlightElement"] && (A["before:highlightElement"] = (U) => {
        A["before:highlightBlock"](
          Object.assign({ block: U.el }, U)
        );
      }), A["after:highlightBlock"] && !A["after:highlightElement"] && (A["after:highlightElement"] = (U) => {
        A["after:highlightBlock"](
          Object.assign({ block: U.el }, U)
        );
      });
    }
    function rs(A) {
      ns(A), K.push(A);
    }
    function is(A) {
      const U = K.indexOf(A);
      U !== -1 && K.splice(U, 1);
    }
    function Nt(A, U) {
      const se = A;
      K.forEach(function(de) {
        de[se] && de[se](U);
      });
    }
    function ss(A) {
      return st("10.7.0", "highlightBlock will be removed entirely in v12.0"), st("10.7.0", "Please use highlightElement now."), hn(A);
    }
    Object.assign(m, {
      highlight: ye,
      highlightAuto: un,
      highlightAll: Bt,
      highlightElement: hn,
      // TODO: Remove with v12 API
      highlightBlock: ss,
      configure: Ki,
      initHighlighting: Yi,
      initHighlightingOnLoad: Vi,
      registerLanguage: Ji,
      unregisterLanguage: es,
      listLanguages: ts,
      getLanguage: We,
      registerAliases: tr,
      autoDetection: nr,
      inherit: Yn,
      addPlugin: rs,
      removePlugin: is
    }), m.debugMode = function() {
      we = !1;
    }, m.safeMode = function() {
      we = !0;
    }, m.versionString = Zi, m.regex = {
      concat: g,
      lookahead: f,
      either: b,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const A in Pe)
      typeof Pe[A] == "object" && t(Pe[A]);
    return Object.assign(m, Pe), m;
  }, at = Jn({});
  return at.newInstance = () => Jn({}), gn = at, at.HighlightJS = at, at.default = at, gn;
}
var ps = /* @__PURE__ */ fs();
const pe = /* @__PURE__ */ $r(ps), gs = "11.11.1", re = /* @__PURE__ */ new Map(), ms = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Te = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Te.html = "xml";
Te.xhtml = "xml";
Te.markup = "xml";
const Pr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Xe = null;
const mn = /* @__PURE__ */ new Map(), ws = 300 * 1e3;
async function Ir(t = ms) {
  if (t)
    return Xe || (Xe = (async () => {
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
        let l = i.findIndex((u) => /file|filename|module|module name|module-name|short|slug/i.test(u));
        if (l === -1) {
          const u = i.findIndex((c) => /language/i.test(c));
          l = u !== -1 ? u : 0;
        }
        let o = [];
        for (let u = r + 1; u < s.length; u++) {
          const c = s[u].trim();
          if (!c || !c.startsWith("|")) break;
          const h = c.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (h.every((w) => /^-+$/.test(w))) continue;
          const f = h;
          if (!f.length) continue;
          const d = (f[l] || f[0] || "").toString().trim().toLowerCase();
          if (!d || /^-+$/.test(d)) continue;
          re.set(d, d);
          const g = f[a] || "";
          if (g) {
            const w = String(g).split(",").map((b) => b.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const k = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              k && /[a-z0-9]/i.test(k) && (re.set(k, k), o.push(k));
            }
          }
        }
        try {
          const u = [];
          for (const c of o) {
            const h = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? u.push(h) : re.delete(c);
          }
          o = u;
        } catch (u) {
          console.warn("[codeblocksManager] cleanup aliases failed", u);
        }
        try {
          let u = 0;
          for (const c of Array.from(re.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              re.delete(c), u++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const h = c.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = re.get(c);
                re.delete(c), re.set(h, f);
              } else
                re.delete(c), u++;
            }
          }
          for (const [c, h] of Array.from(re.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (re.delete(c), u++);
          try {
            const c = ":---------------------";
            re.has(c) && (re.delete(c), u++);
          } catch (c) {
            console.warn("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(re.keys()).sort();
          } catch (c) {
            console.warn("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (u) {
          console.warn("[codeblocksManager] ignored error", u);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), Xe);
}
const ft = /* @__PURE__ */ new Set();
async function Lt(t, e) {
  if (Xe || (async () => {
    try {
      await Ir();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Xe)
    try {
      await Xe;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (Pr.has(n)) return !1;
  if (re.size && !re.has(n)) {
    const r = Te;
    if (!r[n] && !r[t])
      return !1;
  }
  if (ft.has(t)) return !0;
  const s = Te;
  try {
    const r = (e || t || "").toString().replace(/\.js$/i, "").trim(), i = (s[t] || t || "").toString(), a = (s[r] || r || "").toString();
    let l = Array.from(new Set([
      i,
      a,
      r,
      t,
      s[r],
      s[t]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    re.size && (l = l.filter((c) => {
      if (re.has(c)) return !0;
      const h = Te[c];
      return !!(h && re.has(h));
    }));
    let o = null, u = null;
    for (const c of l)
      try {
        const h = Date.now();
        let f = mn.get(c);
        if (f && f.ok === !1 && h - (f.ts || 0) >= ws && (mn.delete(c), f = void 0), f) {
          if (f.module)
            o = f.module;
          else if (f.promise)
            try {
              o = await f.promise;
            } catch {
              o = null;
            }
        } else {
          const p = { promise: null, module: null, ok: null, ts: 0 };
          mn.set(c, p), p.promise = (async () => {
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
                    const w = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(w);
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
            const d = re.size && re.get(t) || c || t;
            return pe.registerLanguage(d, p), ft.add(d), d !== t && (pe.registerLanguage(t, p), ft.add(t)), !0;
          } catch (d) {
            u = d;
          }
        } else
          try {
            if (re.has(c) || re.has(t)) {
              const p = () => ({});
              try {
                pe.registerLanguage(c, p), ft.add(c);
              } catch {
              }
              try {
                c !== t && (pe.registerLanguage(t, p), ft.add(t));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (h) {
        u = h;
      }
    if (u)
      throw u;
    return !1;
  } catch {
    return !1;
  }
}
let Ut = null;
function bs(t = document) {
  Xe || (async () => {
    try {
      await Ir();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = Te, s = Ut || (typeof IntersectionObserver > "u" ? null : (Ut = new IntersectionObserver((i, a) => {
    i.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        a.unobserve(o);
      } catch (u) {
        console.warn("[codeblocksManager] observer unobserve failed", u);
      }
      (async () => {
        try {
          const u = o.getAttribute && o.getAttribute("class") || o.className || "", c = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const h = (c[1] || "").toLowerCase(), f = e[h] || h, p = re.size && (re.get(f) || re.get(String(f).toLowerCase())) || f;
            try {
              await Lt(p);
            } catch (d) {
              console.warn("[codeblocksManager] registerLanguage failed", d);
            }
            try {
              try {
                const d = o.textContent || o.innerText || "";
                d != null && (o.textContent = d);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              pe.highlightElement(o);
            } catch (d) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const h = o.textContent || "";
              try {
                if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
                  const f = pe.highlight(h, { language: "plaintext" });
                  f && f.value && (o.innerHTML = f.value);
                }
              } catch {
                try {
                  pe.highlightElement(o);
                } catch (p) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (h) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", h);
            }
        } catch (u) {
          console.warn("[codeblocksManager] observer entry processing failed", u);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Ut)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    r.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", l = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), u = e[o] || o, c = re.size && (re.get(u) || re.get(String(u).toLowerCase())) || u;
          try {
            await Lt(c);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          try {
            const o = i.textContent || i.innerText || "";
            o != null && (i.textContent = o);
          } catch {
          }
          try {
            i && i.dataset && i.dataset.highlighted && delete i.dataset.highlighted;
          } catch {
          }
          pe.highlightElement(i);
        } catch (o) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", o);
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
function Eo(t, { useCdn: e = !0 } = {}) {
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
  const a = i, l = `https://cdn.jsdelivr.net/npm/highlight.js@${gs}/styles/${a}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", a), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let et = "light";
function ys(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([s, r]) => n.setAttribute(s, r)), document.head.appendChild(n);
}
async function ks(t = "none", e = "/") {
  if (!t || t === "none") return;
  const n = [e + "bulma.css", "/bulma.css"], s = Array.from(new Set(n));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const r of s)
      try {
        const i = await fetch(r, { method: "GET" });
        if (i.ok) {
          const a = await i.text(), l = document.createElement("style");
          l.setAttribute("data-bulma-override", r), l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + a)), document.head.appendChild(l);
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
    ys(i, { "data-bulmaswatch-theme": r });
  } catch (r) {
    console.warn("[bulmaManager] ensureBulma failed", r);
  }
}
function xs(t) {
  et = t === "dark" ? "dark" : t === "system" ? "system" : "light";
  try {
    const e = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (e.length > 0)
      for (const n of e)
        et === "dark" ? n.setAttribute("data-theme", "dark") : et === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      et === "dark" ? n.setAttribute("data-theme", "dark") : et === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Ro(t) {
  const e = document.documentElement;
  for (const [n, s] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${n}`, s);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function zr(t) {
  if (!t || !(t instanceof HTMLElement)) return () => {
  };
  const e = t.closest && t.closest(".nimbi-mount") || null;
  try {
    e && (et === "dark" ? e.setAttribute("data-theme", "dark") : et === "light" ? e.setAttribute("data-theme", "light") : e.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Br = {
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
}, ct = JSON.parse(JSON.stringify(Br));
let Qt = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Qt = String(t).split("-")[0].toLowerCase();
}
Br[Qt] || (Qt = "en");
let Ke = Qt;
function wt(t, e = {}) {
  const n = ct[Ke] || ct.en;
  let s = n && n[t] ? n[t] : ct.en[t] || "";
  for (const r of Object.keys(e))
    s = s.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return s;
}
async function Nr(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const s = await fetch(n);
    if (!s.ok) return;
    const r = await s.json();
    for (const i of Object.keys(r || {}))
      ct[i] = Object.assign({}, ct[i] || {}, r[i]);
  } catch {
  }
}
function Or(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Ke = ct[e] ? e : "en";
}
const Ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ke;
  },
  loadL10nFile: Nr,
  setLang: Or,
  t: wt
}, Symbol.toStringTag, { value: "Module" })), vs = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function qr(t, e = "worker") {
  let n = null;
  function s() {
    if (!n)
      try {
        const l = t();
        n = l || null, l && l.addEventListener("error", () => {
          try {
            n === l && (n = null, l.terminate && l.terminate());
          } catch (o) {
            console.warn("[" + e + "] worker termination failed", o);
          }
        });
      } catch (l) {
        n = null, console.warn("[" + e + "] worker init failed", l);
      }
    return n;
  }
  function r() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (l) {
      console.warn("[" + e + "] worker termination failed", l);
    }
  }
  function i(l, o = 1e3) {
    return new Promise((u, c) => {
      const h = s();
      if (!h) return c(new Error("worker unavailable"));
      const f = String(Math.random());
      l.id = f;
      let p = null;
      const d = () => {
        p && clearTimeout(p), h.removeEventListener("message", g), h.removeEventListener("error", w);
      }, g = (b) => {
        const k = b.data || {};
        k.id === f && (d(), k.error ? c(new Error(k.error)) : u(k.result));
      }, w = (b) => {
        d(), console.warn("[" + e + "] worker error event", b);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (k) {
          console.warn("[" + e + "] worker termination failed", k);
        }
        c(new Error(b && b.message || "worker error"));
      };
      p = setTimeout(() => {
        d(), console.warn("[" + e + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (b) {
          console.warn("[" + e + "] worker termination on timeout failed", b);
        }
        c(new Error("worker timeout"));
      }, o), h.addEventListener("message", g), h.addEventListener("error", w);
      try {
        h.postMessage(l);
      } catch (b) {
        d(), c(b);
      }
    });
  }
  return { get: s, send: i, terminate: r };
}
function As(t) {
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
const De = /* @__PURE__ */ new Set();
function $n(t) {
  Es(), De.clear();
  for (const e of Me)
    e && De.add(e);
  ur(te), ur(j), $n._refreshed = !0;
}
function ur(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && De.add(e);
}
function hr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, s) {
    return s && De.add(s), e.call(this, n, s);
  };
}
let dr = !1;
function Es() {
  dr || (hr(te), hr(j), dr = !0);
}
function Dr(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function me(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function Tt(t) {
  return String(t || "").replace(/\/+$/, "");
}
function Ct(t) {
  return Tt(t) + "/";
}
function Rs(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Ht(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const r = t, i = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, a = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = i ? Math.max(a, i.top) : a, c = (i ? Math.min(l, i.bottom) : l) + Number(e || 0);
    let h = 0;
    r && (h = r.clientHeight || (i ? i.height : 0)), h || (h = l - a);
    let f = 0.6;
    try {
      const w = r && window.getComputedStyle ? window.getComputedStyle(r) : null, b = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), k = b ? parseFloat(b) : NaN;
      !Number.isNaN(k) && k > 0 && k <= 1 && (f = k);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(h * f));
    let d = !1, g = null;
    if (s.forEach((w) => {
      try {
        const b = w.getAttribute ? w.getAttribute("loading") : void 0;
        b !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const k = w.getBoundingClientRect ? w.getBoundingClientRect() : null, E = w.src || w.getAttribute && w.getAttribute("src"), I = k && k.height > 1 ? k.height : p, M = k ? k.top : 0, z = M + I;
        k && I > 0 && M <= c && z >= o && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), Rs(E), d = !0), !g && k && k.top <= c && (g = { img: w, src: E, rect: k, beforeLoading: b });
      } catch (b) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", b);
      }
    }), !d && g) {
      const { img: w, src: b, rect: k, beforeLoading: E } = g;
      try {
        w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high");
      } catch (I) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", I);
      }
    }
  } catch (s) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", s);
  }
}
function Xt(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Xt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const te = /* @__PURE__ */ new Map();
let _e = [], Pn = !1;
function Ls(t) {
  Pn = !!t;
}
function Ur(t) {
  _e = Array.isArray(t) ? t.slice() : [];
}
function Cs() {
  return _e;
}
const Hr = qr(() => As(vs), "slugManager");
function In() {
  return Hr.get();
}
function jr(t) {
  return Hr.send(t);
}
async function Ts(t, e = 1, n = void 0) {
  if (!In()) return Vt(t, e, n);
  try {
    return await jr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
  } catch (r) {
    try {
      return await Vt(t, e, n);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), r;
    }
  }
}
async function Ms(t, e, n) {
  return In() ? jr({ type: "crawlForSlug", slug: t, base: e, maxQueue: n }) : zn(t, e, n);
}
function Ge(t, e) {
  if (t)
    if (_e && _e.length) {
      const s = e.split("/")[0], r = _e.includes(s);
      let i = te.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), r ? i.langs[s] = e : i.default = e, te.set(t, i);
    } else
      te.set(t, e);
}
const rn = /* @__PURE__ */ new Set();
function _s(t) {
  typeof t == "function" && rn.add(t);
}
function $s(t) {
  typeof t == "function" && rn.delete(t);
}
const j = /* @__PURE__ */ new Map();
let Sn = {}, Me = [], ut = "_404.md", lt = "_home.md";
function vn(t) {
  t != null && (ut = String(t || ""));
}
function Ps(t) {
  t != null && (lt = String(t || ""));
}
function Is(t) {
  Sn = t || {};
}
const kt = /* @__PURE__ */ new Map(), Kt = /* @__PURE__ */ new Set();
function zs() {
  kt.clear(), Kt.clear();
}
function Bs(t) {
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
function Yt(t) {
  te.clear(), j.clear(), Me = [], _e = _e || [];
  const e = Object.keys(Sn || {});
  if (!e.length) return;
  let n = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? n = new URL(String(t)).pathname : n = String(t || "");
      } catch (s) {
        n = String(t || ""), console.warn("[slugManager] parse contentBase failed", s);
      }
      n = Ct(n);
    }
  } catch (s) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  n || (n = Bs(e));
  for (const s of e) {
    let r = s;
    n && s.startsWith(n) ? r = me(s.slice(n.length)) : r = me(s), Me.push(r);
    try {
      $n();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const i = Sn[s];
    if (typeof i == "string") {
      const a = (i || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const l = le(a[1].trim());
        if (l)
          try {
            if (_e && _e.length) {
              const u = r.split("/")[0], c = _e.includes(u);
              let h = te.get(l);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), c ? h.langs[u] = r : h.default = r, te.set(l, h);
            } else
              te.set(l, r);
            j.set(r, l);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Yt();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function le(t) {
  let n = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function Ns(t) {
  return Mt(t, void 0);
}
function Mt(t, e) {
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
function _t(t) {
  if (!t || !te.has(t)) return null;
  const e = te.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (_e && _e.length && Ke && e.langs && e.langs[Ke])
    return e.langs[Ke];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const xt = /* @__PURE__ */ new Map();
function Os() {
  xt.clear();
}
let ve = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && te.has(i)) {
      const a = _t(i) || te.get(i);
      a && a !== t && (t = a);
    }
  } catch (i) {
    console.warn("[slugManager] slug mapping normalization failed", i);
  }
  const n = e == null ? "" : Tt(String(e));
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
  if (xt.has(s))
    return xt.get(s);
  const r = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const h = `${n}/${ut}`, f = await globalThis.fetch(h);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (h) {
          console.warn("[slugManager] fetching fallback 404 failed", h);
        }
      let c = "";
      try {
        i && typeof i.clone == "function" ? c = await i.clone().text() : i && typeof i.text == "function" ? c = await i.text() : c = "";
      } catch (h) {
        c = "", console.warn("[slugManager] reading error body failed", h);
      }
      throw console.error("fetchMarkdown failed:", { url: s, status: i ? i.status : void 0, statusText: i ? i.statusText : void 0, body: c.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await i.text(), l = a.trim().slice(0, 16).toLowerCase(), o = l.startsWith("<!doctype") || l.startsWith("<html"), u = o || String(t || "").toLowerCase().endsWith(".html");
    if (o && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const c = `${n}/${ut}`, h = await globalThis.fetch(c);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (c) {
        console.warn("[slugManager] fetching fallback 404 failed", c);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return u ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return xt.set(s, r), r;
};
function qs(t) {
  typeof t == "function" && (ve = t);
}
const Wt = /* @__PURE__ */ new Map();
function Ds(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let je = [], pt = null;
async function Vt(t, e = 1, n = void 0) {
  const s = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => me(String(r || ""))))) : [];
  try {
    const r = me(String(ut || ""));
    r && !s.includes(r) && s.push(r);
  } catch {
  }
  if (je && je.length && e === 1 && !je.some((i) => {
    try {
      return s.includes(me(String(i.path || "")));
    } catch {
      return !1;
    }
  }))
    return je;
  if (pt) return pt;
  pt = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((u) => me(String(u || ""))))) : [];
    try {
      const u = me(String(ut || ""));
      u && !r.includes(u) && r.push(u);
    } catch {
    }
    const i = (u) => {
      if (!r || !r.length) return !1;
      for (const c of r)
        if (c && (u === c || u.startsWith(c + "/")))
          return !0;
      return !1;
    };
    let a = [];
    if (Me && Me.length && (a = Array.from(Me)), !a.length)
      for (const u of te.values())
        u && a.push(u);
    try {
      const u = await Gr(t);
      u && u.length && (a = a.concat(u));
    } catch (u) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", u);
    }
    try {
      const u = new Set(a), c = [...a];
      for (u.size; c.length && u.size <= $t; ) {
        const h = c.shift();
        try {
          const f = await ve(h, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], g = String(h || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(g) && Pn && (!h || !h.includes("/")))
              continue;
            const w = Ds(p), b = /\[[^\]]+\]\(([^)]+)\)/g;
            let k;
            for (; k = b.exec(w); )
              d.push(k[1]);
            const E = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; k = E.exec(w); )
              d.push(k[1]);
            const I = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
            for (let M of d)
              try {
                if (Mt(M, t) || M.startsWith("..") || M.indexOf("/../") !== -1 || (I && !M.startsWith("./") && !M.startsWith("/") && !M.startsWith("../") && (M = I + M), M = me(M), !/\.(md|html?)(?:$|[?#])/i.test(M)) || (M = M.split(/[?#]/)[0], i(M))) continue;
                u.has(M) || (u.add(M), c.push(M), a.push(M));
              } catch (z) {
                console.warn("[slugManager] href processing failed", M, z);
              }
          }
        } catch (f) {
          console.warn("[slugManager] discovery fetch failed for", h, f);
        }
      }
    } catch (u) {
      console.warn("[slugManager] discovery loop failed", u);
    }
    const l = /* @__PURE__ */ new Set();
    a = a.filter((u) => !u || l.has(u) || i(u) ? !1 : (l.add(u), !0));
    const o = [];
    for (const u of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(u))
        try {
          const c = await ve(u, t);
          if (c && c.raw) {
            if (c.status === 404) continue;
            let h = "", f = "";
            if (c.isHtml)
              try {
                const g = new DOMParser().parseFromString(c.raw, "text/html"), w = g.querySelector("title") || g.querySelector("h1");
                w && w.textContent && (h = w.textContent.trim());
                const b = g.querySelector("p");
                if (b && b.textContent && (f = b.textContent.trim()), e >= 2)
                  try {
                    const k = g.querySelector("h1"), E = k && k.textContent ? k.textContent.trim() : h || "", I = (() => {
                      try {
                        if (j.has(u)) return j.get(u);
                      } catch {
                      }
                      return le(h || u);
                    })(), M = Array.from(g.querySelectorAll("h2"));
                    for (const z of M)
                      try {
                        const Z = (z.textContent || "").trim();
                        if (!Z) continue;
                        const V = z.id ? z.id : le(Z), ie = I ? `${I}::${V}` : `${le(u)}::${V}`;
                        let J = "", W = z.nextElementSibling;
                        for (; W && W.tagName && W.tagName.toLowerCase() === "script"; ) W = W.nextElementSibling;
                        W && W.textContent && (J = String(W.textContent).trim()), o.push({ slug: ie, title: Z, excerpt: J, path: u, parentTitle: E });
                      } catch (Z) {
                        console.warn("[slugManager] indexing H2 failed", Z);
                      }
                    if (e === 3)
                      try {
                        const z = Array.from(g.querySelectorAll("h3"));
                        for (const Z of z)
                          try {
                            const V = (Z.textContent || "").trim();
                            if (!V) continue;
                            const ie = Z.id ? Z.id : le(V), J = I ? `${I}::${ie}` : `${le(u)}::${ie}`;
                            let W = "", X = Z.nextElementSibling;
                            for (; X && X.tagName && X.tagName.toLowerCase() === "script"; ) X = X.nextElementSibling;
                            X && X.textContent && (W = String(X.textContent).trim()), o.push({ slug: J, title: V, excerpt: W, path: u, parentTitle: E });
                          } catch (V) {
                            console.warn("[slugManager] indexing H3 failed", V);
                          }
                      } catch (z) {
                        console.warn("[slugManager] collect H3s failed", z);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect H2s failed", k);
                  }
              } catch (d) {
                console.warn("[slugManager] parsing HTML for index failed", d);
              }
            else {
              const d = c.raw, g = d.match(/^#\s+(.+)$/m);
              h = g ? g[1].trim() : "";
              try {
                h = Ft(h);
              } catch {
              }
              const w = d.split(/\r?\n\s*\r?\n/);
              if (w.length > 1)
                for (let b = 1; b < w.length; b++) {
                  const k = w[b].trim();
                  if (k && !/^#/.test(k)) {
                    f = k.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e >= 2) {
                let b = "", k = "";
                try {
                  const E = (d.match(/^#\s+(.+)$/m) || [])[1];
                  b = E ? E.trim() : "", k = (function() {
                    try {
                      if (j.has(u)) return j.get(u);
                    } catch {
                    }
                    return le(h || u);
                  })();
                  const I = /^##\s+(.+)$/gm;
                  let M;
                  for (; M = I.exec(d); )
                    try {
                      const z = (M[1] || "").trim(), Z = Ft(z);
                      if (!z) continue;
                      const V = le(z), ie = k ? `${k}::${V}` : `${le(u)}::${V}`, W = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), X = W && W[1] ? String(W[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: ie, title: Z, excerpt: X, path: u, parentTitle: b });
                    } catch (z) {
                      console.warn("[slugManager] indexing markdown H2 failed", z);
                    }
                } catch (E) {
                  console.warn("[slugManager] collect markdown H2s failed", E);
                }
                if (e === 3)
                  try {
                    const E = /^###\s+(.+)$/gm;
                    let I;
                    for (; I = E.exec(d); )
                      try {
                        const M = (I[1] || "").trim(), z = Ft(M);
                        if (!M) continue;
                        const Z = le(M), V = k ? `${k}::${Z}` : `${le(u)}::${Z}`, J = d.slice(E.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), W = J && J[1] ? String(J[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: V, title: z, excerpt: W, path: u, parentTitle: b });
                      } catch (M) {
                        console.warn("[slugManager] indexing markdown H3 failed", M);
                      }
                  } catch (E) {
                    console.warn("[slugManager] collect markdown H3s failed", E);
                  }
              }
            }
            let p = "";
            try {
              j.has(u) && (p = j.get(u));
            } catch (d) {
              console.warn("[slugManager] mdToSlug access failed", d);
            }
            p || (p = le(h || u)), o.push({ slug: p, title: h, excerpt: f, path: u });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    try {
      je = o.filter((c) => {
        try {
          return !i(String(c.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (u) {
      console.warn("[slugManager] filtering index by excludes failed", u), je = o;
    }
    return je;
  })();
  try {
    await pt;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return pt = null, je;
}
const Fr = 1e3;
let $t = Fr;
function Us(t) {
  typeof t == "number" && t >= 0 && ($t = t);
}
const Wr = new DOMParser(), Zr = "a[href]";
let zn = async function(t, e, n = $t) {
  if (Wt.has(t)) return Wt.get(t);
  let s = null;
  const r = /* @__PURE__ */ new Set(), i = [""];
  for (; i.length && !s && !(i.length > n); ) {
    const a = i.shift();
    if (r.has(a)) continue;
    r.add(a);
    let l = e;
    l.endsWith("/") || (l += "/"), l += a;
    try {
      let o;
      try {
        o = await globalThis.fetch(l);
      } catch (f) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: l, error: f });
        continue;
      }
      if (!o || !o.ok) {
        o && !o.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: l, status: o.status });
        continue;
      }
      const u = await o.text(), h = Wr.parseFromString(u, "text/html").querySelectorAll(Zr);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Mt(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            r.has(d) || i.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = me(a + p);
            try {
              if (j.has(d))
                continue;
              for (const g of te.values())
                ;
            } catch (g) {
              console.warn("[slugManager] slug map access failed", g);
            }
            try {
              const g = await ve(d, e);
              if (g && g.raw) {
                const w = (g.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && le(w[1].trim()) === t) {
                  s = d;
                  break;
                }
              }
            } catch (g) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", g);
            }
          }
        } catch (p) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", p);
        }
    } catch (o) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", o);
    }
  }
  return Wt.set(t, s), s;
};
async function Gr(t, e = $t) {
  const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = [""];
  for (; r.length && !(r.length > e); ) {
    const i = r.shift();
    if (s.has(i)) continue;
    s.add(i);
    let a = t;
    a.endsWith("/") || (a += "/"), a += i;
    try {
      let l;
      try {
        l = await globalThis.fetch(a);
      } catch (h) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: a, error: h });
        continue;
      }
      if (!l || !l.ok) {
        l && !l.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: a, status: l.status });
        continue;
      }
      const o = await l.text(), c = Wr.parseFromString(o, "text/html").querySelectorAll(Zr);
      for (const h of c)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Mt(f, t) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
          if (f.endsWith("/")) {
            const d = i + f;
            s.has(d) || r.push(d);
            continue;
          }
          const p = (i + f).replace(/^\/+/, "");
          /\.(md|html?)$/i.test(p) && n.add(p);
        } catch (f) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", f);
        }
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", l);
    }
  }
  return Array.from(n);
}
async function Qr(t, e, n) {
  if (t && typeof t == "string" && (t = me(t), t = Tt(t)), te.has(t))
    return _t(t) || te.get(t);
  for (const r of rn)
    try {
      const i = await r(t, e);
      if (i)
        return Ge(t, i), j.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Me && Me.length) {
    if (kt.has(t)) {
      const r = kt.get(t);
      return te.set(t, r), j.set(r, t), r;
    }
    for (const r of Me)
      if (!Kt.has(r))
        try {
          const i = await ve(r, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const l = le(a[1].trim());
              if (Kt.add(r), l && kt.set(l, r), l === t)
                return Ge(t, r), j.set(r, t), r;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const r = await Vt(e);
    if (r && r.length) {
      const i = r.find((a) => a.slug === t);
      if (i)
        return Ge(t, i.path), j.set(i.path, t), i.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await zn(t, e, n);
    if (r)
      return Ge(t, r), j.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const r of s)
    try {
      const i = await ve(r, e);
      if (i && i.raw)
        return Ge(t, r), j.set(r, t), r;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Me && Me.length)
    for (const r of Me)
      try {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (le(i) === t)
          return Ge(t, r), j.set(r, t), r;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const r = [];
    lt && typeof lt == "string" && lt.trim() && r.push(lt), r.includes("_home.md") || r.push("_home.md");
    for (const i of r)
      try {
        const a = await ve(i, e);
        if (a && a.raw) {
          const l = (a.raw || "").match(/^#\s+(.+)$/m);
          if (l && l[1] && le(l[1].trim()) === t)
            return Ge(t, i), j.set(i, t), i;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Fr,
  _setAllMd: Is,
  _storeSlugMapping: Ge,
  addSlugResolver: _s,
  get allMarkdownPaths() {
    return Me;
  },
  get availableLanguages() {
    return _e;
  },
  buildSearchIndex: Vt,
  buildSearchIndexWorker: Ts,
  clearFetchCache: Os,
  clearListCaches: zs,
  crawlAllMarkdown: Gr,
  crawlCache: Wt,
  crawlForSlug: zn,
  crawlForSlugWorker: Ms,
  get defaultCrawlMaxQueue() {
    return $t;
  },
  ensureSlug: Qr,
  fetchCache: xt,
  get fetchMarkdown() {
    return ve;
  },
  getLanguages: Cs,
  get homePage() {
    return lt;
  },
  initSlugWorker: In,
  isExternalLink: Ns,
  isExternalLinkWithBase: Mt,
  listPathsFetched: Kt,
  listSlugCache: kt,
  mdToSlug: j,
  get notFoundPage() {
    return ut;
  },
  removeSlugResolver: $s,
  resolveSlugPath: _t,
  get searchIndex() {
    return je;
  },
  setContentBase: Yt,
  setDefaultCrawlMaxQueue: Us,
  setFetchMarkdown: qs,
  setHomePage: Ps,
  setLanguages: Ur,
  setNotFoundPage: vn,
  setSkipRootReadme: Ls,
  get skipRootReadme() {
    return Pn;
  },
  slugResolvers: rn,
  slugToMd: te,
  slugify: le,
  unescapeMarkdown: Ft
}, Symbol.toStringTag, { value: "Module" }));
let Xr = 100;
function fr(t) {
  Xr = t;
}
let St = 300 * 1e3;
function pr(t) {
  St = t;
}
const $e = /* @__PURE__ */ new Map();
function Hs(t) {
  if (!$e.has(t)) return;
  const e = $e.get(t), n = Date.now();
  if (e.ts + St < n) {
    $e.delete(t);
    return;
  }
  return $e.delete(t), $e.set(t, e), e.value;
}
function js(t, e) {
  if (gr(), gr(), $e.delete(t), $e.set(t, { value: e, ts: Date.now() }), $e.size > Xr) {
    const n = $e.keys().next().value;
    n !== void 0 && $e.delete(n);
  }
}
function gr() {
  if (!St || St <= 0) return;
  const t = Date.now();
  for (const [e, n] of $e.entries())
    n.ts + St < t && $e.delete(e);
}
async function Fs(t, e) {
  const n = new Set(De), s = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(s || [])) {
    const i = r.getAttribute("href") || "";
    if (i)
      try {
        const a = new URL(i, location.href);
        if (a.origin !== location.origin) continue;
        const l = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (l) {
          let h = me(l[1]);
          h && n.add(h);
          continue;
        }
        const o = (r.textContent || "").trim(), u = (a.pathname || "").replace(/^.*\//, "");
        if (o && le(o) === t || u && le(u.replace(/\.(html?|md)$/i, "")) === t) return a.toString();
        if (/\.(html?)$/i.test(a.pathname)) {
          let h = a.pathname.replace(/^\//, "");
          n.add(h);
          continue;
        }
        const c = a.pathname || "";
        if (c) {
          const h = new URL(e), f = Ct(h.pathname);
          if (c.indexOf(f) !== -1) {
            let p = c.startsWith(f) ? c.slice(f.length) : c;
            p = me(p), p && n.add(p);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const i = await ve(r, e);
      if (!i || !i.raw) continue;
      const a = (i.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const l = (a[1] || "").trim();
        if (l && le(l) === t)
          return r;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function Ws(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (te.has(n)) {
        const s = _t(n) || te.get(n);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (De && De.size)
          for (const s of De) {
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
async function Zs(t, e) {
  const n = t || "", s = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let r = t || "", i = null;
  if (r && String(r).includes("::")) {
    const d = String(r).split("::", 2);
    r = d[0], i = d[1] || null;
  }
  const l = `${t}|||${typeof Ss < "u" && Ke ? Ke : ""}`, o = Hs(l);
  if (o)
    r = o.resolved, i = o.anchor || i;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let d = decodeURIComponent(String(r || ""));
      if (d && typeof d == "string" && (d = me(d), d = Tt(d)), te.has(d))
        r = _t(d) || te.get(d);
      else {
        let g = await Fs(d, e);
        if (g)
          r = g;
        else if ($n._refreshed && De && De.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await Qr(d, e);
          w && (r = w);
        }
      }
    }
    js(l, { resolved: r, anchor: i });
  }
  !i && s && (i = s);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const d = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const g = await fetch(d);
        if (g && g.ok) {
          const w = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", k = (w || "").toLowerCase();
          if (b && b.indexOf && b.indexOf("text/html") !== -1 || k.indexOf("<!doctype") !== -1 || k.indexOf("<html") !== -1)
            return { data: { raw: w, isHtml: !0 }, pagePath: d.replace(/^\//, ""), anchor: i };
        }
      } catch {
      }
    }
  } catch {
  }
  const u = Ws(r), c = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (c && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !c && !te.has(r) && !te.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const d of u)
    if (d)
      try {
        const g = me(d);
        h = await ve(g, e), f = g;
        break;
      } catch (g) {
        p = g;
        try {
          console.warn("[router] candidate fetch failed", { candidate: d, contentBase: e, err: g && g.message || g });
        } catch {
        }
      }
  if (!h) {
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: e, fetchError: p && (p.message || String(p)) || null });
    } catch {
    }
    try {
      if (c && String(n || "").toLowerCase().includes(".html"))
        try {
          const d = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", d);
          const g = await fetch(d);
          if (g && g.ok) {
            const w = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", k = (w || "").toLowerCase(), E = b && b.indexOf && b.indexOf("text/html") !== -1 || k.indexOf("<!doctype") !== -1 || k.indexOf("<html") !== -1;
            if (E || console.warn("[router] absolute fetch returned non-HTML", { abs: d, contentType: b, snippet: k.slice(0, 200) }), E)
              try {
                const I = d, M = new URL(".", I).toString();
                try {
                  const Z = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (Z) {
                    const V = Z.parseFromString(w || "", "text/html"), ie = (D, he) => {
                      try {
                        const F = he.getAttribute(D) || "";
                        if (!F || /^(https?:)?\/\//i.test(F) || F.startsWith("/") || F.startsWith("#")) return;
                        try {
                          const S = new URL(F, I).toString();
                          he.setAttribute(D, S);
                        } catch (S) {
                          console.warn("[router] rewrite attribute failed", D, S);
                        }
                      } catch (F) {
                        console.warn("[router] rewrite helper failed", F);
                      }
                    }, J = V.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), W = [];
                    for (const D of Array.from(J || []))
                      try {
                        const he = D.tagName ? D.tagName.toLowerCase() : "";
                        if (he === "a") continue;
                        if (D.hasAttribute("src")) {
                          const F = D.getAttribute("src");
                          ie("src", D);
                          const S = D.getAttribute("src");
                          F !== S && W.push({ attr: "src", tag: he, before: F, after: S });
                        }
                        if (D.hasAttribute("href") && he === "link") {
                          const F = D.getAttribute("href");
                          ie("href", D);
                          const S = D.getAttribute("href");
                          F !== S && W.push({ attr: "href", tag: he, before: F, after: S });
                        }
                        if (D.hasAttribute("href") && he !== "link") {
                          const F = D.getAttribute("href");
                          ie("href", D);
                          const S = D.getAttribute("href");
                          F !== S && W.push({ attr: "href", tag: he, before: F, after: S });
                        }
                        if (D.hasAttribute("xlink:href")) {
                          const F = D.getAttribute("xlink:href");
                          ie("xlink:href", D);
                          const S = D.getAttribute("xlink:href");
                          F !== S && W.push({ attr: "xlink:href", tag: he, before: F, after: S });
                        }
                        if (D.hasAttribute("poster")) {
                          const F = D.getAttribute("poster");
                          ie("poster", D);
                          const S = D.getAttribute("poster");
                          F !== S && W.push({ attr: "poster", tag: he, before: F, after: S });
                        }
                        if (D.hasAttribute("srcset")) {
                          const ne = (D.getAttribute("srcset") || "").split(",").map((Q) => Q.trim()).filter(Boolean).map((Q) => {
                            const [v, _] = Q.split(/\s+/, 2);
                            if (!v || /^(https?:)?\/\//i.test(v) || v.startsWith("/")) return Q;
                            try {
                              const y = new URL(v, I).toString();
                              return _ ? `${y} ${_}` : y;
                            } catch {
                              return Q;
                            }
                          }).join(", ");
                          D.setAttribute("srcset", ne);
                        }
                      } catch {
                      }
                    const X = V.documentElement && V.documentElement.outerHTML ? V.documentElement.outerHTML : w;
                    try {
                      W && W.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: W });
                    } catch {
                    }
                    return { data: { raw: X, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
                  }
                } catch {
                }
                let z = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? z = w.replace(/(<head[^>]*>)/i, `$1<base href="${M}">`) : z = `<base href="${M}">` + w), { data: { raw: z, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
              } catch {
                return { data: { raw: w, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
              }
          }
        } catch (d) {
          console.warn("[router] absolute HTML fetch fallback failed", d);
        }
    } catch {
    }
    try {
      const d = decodeURIComponent(String(r || ""));
      if (d && !/\.(md|html?)$/i.test(d)) {
        const g = [
          `/assets/${d}.html`,
          `/assets/${d}/index.html`
        ];
        for (const w of g)
          try {
            const b = await fetch(w, { method: "GET" });
            if (b && b.ok)
              return { data: { raw: await b.text(), isHtml: !0 }, pagePath: w.replace(/^\//, ""), anchor: i };
          } catch {
          }
      }
    } catch (d) {
      console.warn("[router] assets fallback failed", d);
    }
    throw new Error("no page data");
  }
  return { data: h, pagePath: f, anchor: i };
}
function Bn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var rt = Bn();
function Kr(t) {
  rt = t;
}
var tt = { exec: () => null };
function ae(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(Le.caret, "$1"), n = n.replace(r, a), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Gs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Le = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Qs = /^(?:[ \t]*(?:\n|$))+/, Xs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ks = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Pt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ys = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Nn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Yr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Vr = ae(Yr).replace(/bull/g, Nn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Vs = ae(Yr).replace(/bull/g, Nn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), On = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Js = /^[^\n]+/, qn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, ea = ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ta = ae(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Nn).getRegex(), sn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Dn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, na = ae("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Dn).replace("tag", sn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Jr = ae(On).replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), ra = ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Jr).getRegex(), Un = { blockquote: ra, code: Xs, def: ea, fences: Ks, heading: Ys, hr: Pt, html: na, lheading: Vr, list: ta, newline: Qs, paragraph: Jr, table: tt, text: Js }, mr = ae("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), ia = { ...Un, lheading: Vs, table: mr, paragraph: ae(On).replace("hr", Pt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", mr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex() }, sa = { ...Un, html: ae(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Dn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: tt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ae(On).replace("hr", Pt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Vr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, aa = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, oa = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ei = /^( {2,}|\\)\n(?!\s*$)/, la = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, an = /[\p{P}\p{S}]/u, Hn = /[\s\p{P}\p{S}]/u, ti = /[^\s\p{P}\p{S}]/u, ca = ae(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Hn).getRegex(), ni = /(?!~)[\p{P}\p{S}]/u, ua = /(?!~)[\s\p{P}\p{S}]/u, ha = /(?:[^\s\p{P}\p{S}]|~)/u, ri = /(?![*_])[\p{P}\p{S}]/u, da = /(?![*_])[\s\p{P}\p{S}]/u, fa = /(?:[^\s\p{P}\p{S}]|[*_])/u, pa = ae(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Gs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ii = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ga = ae(ii, "u").replace(/punct/g, an).getRegex(), ma = ae(ii, "u").replace(/punct/g, ni).getRegex(), si = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wa = ae(si, "gu").replace(/notPunctSpace/g, ti).replace(/punctSpace/g, Hn).replace(/punct/g, an).getRegex(), ba = ae(si, "gu").replace(/notPunctSpace/g, ha).replace(/punctSpace/g, ua).replace(/punct/g, ni).getRegex(), ya = ae("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ti).replace(/punctSpace/g, Hn).replace(/punct/g, an).getRegex(), ka = ae(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ri).getRegex(), xa = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Sa = ae(xa, "gu").replace(/notPunctSpace/g, fa).replace(/punctSpace/g, da).replace(/punct/g, ri).getRegex(), va = ae(/\\(punct)/, "gu").replace(/punct/g, an).getRegex(), Aa = ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ea = ae(Dn).replace("(?:-->|$)", "-->").getRegex(), Ra = ae("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ea).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Jt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, La = ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Jt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ai = ae(/^!?\[(label)\]\[(ref)\]/).replace("label", Jt).replace("ref", qn).getRegex(), oi = ae(/^!?\[(ref)\](?:\[\])?/).replace("ref", qn).getRegex(), Ca = ae("reflink|nolink(?!\\()", "g").replace("reflink", ai).replace("nolink", oi).getRegex(), wr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, jn = { _backpedal: tt, anyPunctuation: va, autolink: Aa, blockSkip: pa, br: ei, code: oa, del: tt, delLDelim: tt, delRDelim: tt, emStrongLDelim: ga, emStrongRDelimAst: wa, emStrongRDelimUnd: ya, escape: aa, link: La, nolink: oi, punctuation: ca, reflink: ai, reflinkSearch: Ca, tag: Ra, text: la, url: tt }, Ta = { ...jn, link: ae(/^!?\[(label)\]\((.*?)\)/).replace("label", Jt).getRegex(), reflink: ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Jt).getRegex() }, An = { ...jn, emStrongRDelimAst: ba, emStrongLDelim: ma, delLDelim: ka, delRDelim: Sa, url: ae(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", wr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ae(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", wr).getRegex() }, Ma = { ...An, br: ae(ei).replace("{2,}", "*").getRegex(), text: ae(An.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, jt = { normal: Un, gfm: ia, pedantic: sa }, gt = { normal: jn, gfm: An, breaks: Ma, pedantic: Ta }, _a = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, br = (t) => _a[t];
function qe(t, e) {
  if (e) {
    if (Le.escapeTest.test(t)) return t.replace(Le.escapeReplace, br);
  } else if (Le.escapeTestNoEncode.test(t)) return t.replace(Le.escapeReplaceNoEncode, br);
  return t;
}
function yr(t) {
  try {
    t = encodeURI(t).replace(Le.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function kr(t, e) {
  let n = t.replace(Le.findPipe, (i, a, l) => {
    let o = !1, u = a;
    for (; --u >= 0 && l[u] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), s = n.split(Le.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(Le.slashPipe, "|");
  return s;
}
function mt(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function $a(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) n++;
  else if (t[s] === e[1] && (n--, n < 0)) return s;
  return n > 0 ? -2 : -1;
}
function Pa(t, e = 0) {
  let n = e, s = "";
  for (let r of t) if (r === "	") {
    let i = 4 - n % 4;
    s += " ".repeat(i), n += i;
  } else s += r, n++;
  return s;
}
function xr(t, e, n, s, r) {
  let i = e.href, a = e.title || null, l = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let o = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: l, tokens: s.inlineTokens(l) };
  return s.state.inLink = !1, o;
}
function Ia(t, e, n) {
  let s = t.match(n.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((i) => {
    let a = i.match(n.other.beginningSpace);
    if (a === null) return i;
    let [l] = a;
    return l.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var en = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || rt;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : mt(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = Ia(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = mt(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: mt(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = mt(e[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let a = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), a = !0;
        else if (!a) l.push(n[o]);
        else break;
        n = n.slice(o);
        let u = l.join(`
`), c = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${u}` : u, r = r ? `${r}
${c}` : c;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = h, n.length === 0) break;
        let f = i.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, d = p.raw + `
` + n.join(`
`), g = this.blockquote(d);
          i[i.length - 1] = g, s = s.substring(0, s.length - p.raw.length) + g.raw, r = r.substring(0, r.length - p.text.length) + g.text;
          break;
        } else if (f?.type === "list") {
          let p = f, d = p.raw + `
` + n.join(`
`), g = this.list(d);
          i[i.length - 1] = g, s = s.substring(0, s.length - f.raw.length) + g.raw, r = r.substring(0, r.length - p.raw.length) + g.raw, n = d.substring(i.at(-1).raw.length).split(`
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
        let o = !1, u = "", c = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        u = e[0], t = t.substring(u.length);
        let h = Pa(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !h.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, c = h.trimStart()) : p ? d = e[1].length + 1 : (d = h.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, c = h.slice(d), d += e[1].length), p && this.rules.other.blankLine.test(f) && (u += f + `
`, t = t.substring(f.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(d), w = this.rules.other.hrRegex(d), b = this.rules.other.fencesBeginRegex(d), k = this.rules.other.headingBeginRegex(d), E = this.rules.other.htmlBeginRegex(d), I = this.rules.other.blockquoteBeginRegex(d);
          for (; t; ) {
            let M = t.split(`
`, 1)[0], z;
            if (f = M, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), z = f) : z = f.replace(this.rules.other.tabCharGlobal, "    "), b.test(f) || k.test(f) || E.test(f) || I.test(f) || g.test(f) || w.test(f)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= d || !f.trim()) c += `
` + z.slice(d);
            else {
              if (p || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(h) || k.test(h) || w.test(h)) break;
              c += `
` + f;
            }
            p = !f.trim(), u += M + `
`, t = t.substring(M.length + 1), h = z.slice(d);
          }
        }
        r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += u;
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
          let u = o.tokens.filter((h) => h.type === "space"), c = u.length > 0 && u.some((h) => this.rules.other.anyLine.test(h.raw));
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
    let n = kr(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < n.length; a++) i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] });
      for (let a of r) i.rows.push(kr(a, i.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: i.align[o] })));
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
        let i = mt(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = $a(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), xr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return xr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, i, a, l = r, o = 0, u = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = u.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
        if (a = [...i].length, s[3] || s[4]) {
          l += a;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + a) % 3)) {
          o += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + o);
        let c = [...s[0]][0].length, h = t.slice(0, r + s.index + c + a);
        if (Math.min(r, a) % 2) {
          let p = h.slice(1, -1);
          return { type: "em", raw: h, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let f = h.slice(2, -2);
        return { type: "strong", raw: h, text: f, tokens: this.lexer.inlineTokens(f) };
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
      let r = [...s[0]].length - 1, i, a, l = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = o.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (a = [...i].length, a !== r)) continue;
        if (s[3] || s[4]) {
          l += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l);
        let u = [...s[0]][0].length, c = t.slice(0, r + s.index + u + a), h = c.slice(r, -r);
        return { type: "del", raw: c, text: h, tokens: this.lexer.inlineTokens(h) };
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
}, ze = class En {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || rt, this.options.tokenizer = this.options.tokenizer || new en(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Le, block: jt.normal, inline: gt.normal };
    this.options.pedantic ? (n.block = jt.pedantic, n.inline = gt.pedantic) : this.options.gfm && (n.block = jt.gfm, this.options.breaks ? n.inline = gt.breaks : n.inline = gt.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: jt, inline: gt };
  }
  static lex(e, n) {
    return new En(n).lex(e);
  }
  static lexInline(e, n) {
    return new En(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Le.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(Le.tabCharGlobal, "    ").replace(Le.spaceLine, "")); e; ) {
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
        let a = 1 / 0, l = e.slice(1), o;
        this.options.extensions.startBlock.forEach((u) => {
          o = u.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (a = Math.min(a, o));
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
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; ) s = s.slice(0, r.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; ) i = r[2] ? r[2].length : 0, s = s.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let a = !1, l = "";
    for (; e; ) {
      a || (l = ""), a = !1;
      let o;
      if (this.options.extensions?.inline?.some((c) => (o = c.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
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
        let c = n.at(-1);
        o.type === "text" && c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, s, l)) {
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
      if (o = this.tokenizer.del(e, s, l)) {
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
      let u = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, h = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, h), typeof f == "number" && f >= 0 && (c = Math.min(c, f));
        }), c < 1 / 0 && c >= 0 && (u = e.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(u)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (l = o.raw.slice(-1)), a = !0;
        let c = n.at(-1);
        c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
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
}, tn = class {
  options;
  parser;
  constructor(t) {
    this.options = t || rt;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(Le.notSpaceStart)?.[0], r = t.replace(Le.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + qe(s) + '">' + (n ? r : qe(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : qe(r, !0)) + `</code></pre>
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
      let l = t.items[a];
      s += this.listitem(l);
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
    return `<code>${qe(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let s = this.parser.parseInline(n), r = yr(t);
    if (r === null) return s;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + qe(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = yr(t);
    if (r === null) return qe(n);
    t = r;
    let i = `<img src="${t}" alt="${qe(n)}"`;
    return e && (i += ` title="${qe(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : qe(t.text);
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
}, Be = class Rn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || rt, this.options.renderer = this.options.renderer || new tn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fn();
  }
  static parse(e, n) {
    return new Rn(n).parse(e);
  }
  static parseInline(e, n) {
    return new Rn(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let a = r, l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          n += l || "";
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
        let l = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += l || "";
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
          let l = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return s;
  }
}, bt = class {
  options;
  block;
  constructor(t) {
    this.options = t || rt;
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
    return this.block ? ze.lex : ze.lexInline;
  }
  provideParser() {
    return this.block ? Be.parse : Be.parseInline;
  }
}, za = class {
  defaults = Bn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Be;
  Renderer = tn;
  TextRenderer = Fn;
  Lexer = ze;
  Tokenizer = en;
  Hooks = bt;
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
            let l = r.renderer.apply(this, a);
            return l === !1 && (l = i.apply(this, a)), l;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[r.level];
          i ? i.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new tn(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let a = i, l = n.renderer[a], o = r[a];
          r[a] = (...u) => {
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new en(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let a = i, l = n.tokenizer[a], o = r[a];
          r[a] = (...u) => {
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new bt();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, l = n.hooks[a], o = r[a];
          bt.passThroughHooks.has(i) ? r[a] = (u) => {
            if (this.defaults.async && bt.passThroughHooksRespectAsync.has(i)) return (async () => {
              let h = await l.call(r, u);
              return o.call(r, h);
            })();
            let c = l.call(r, u);
            return o.call(r, c);
          } : r[a] = (...u) => {
            if (this.defaults.async) return (async () => {
              let h = await l.apply(r, u);
              return h === !1 && (h = await o.apply(r, u)), h;
            })();
            let c = l.apply(r, u);
            return c === !1 && (c = o.apply(r, u)), c;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(a) {
          let l = [];
          return l.push(i.call(this, a)), r && (l = l.concat(r.call(this, a))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return ze.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Be.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let s = { ...n }, r = { ...this.defaults, ...s }, i = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let a = r.hooks ? await r.hooks.preprocess(e) : e, l = await (r.hooks ? await r.hooks.provideLexer() : t ? ze.lex : ze.lexInline)(a, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser() : t ? Be.parse : Be.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(i);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let a = (r.hooks ? r.hooks.provideLexer() : t ? ze.lex : ze.lexInline)(e, r);
        r.hooks && (a = r.hooks.processAllTokens(a)), r.walkTokens && this.walkTokens(a, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : t ? Be.parse : Be.parseInline)(a, r);
        return r.hooks && (l = r.hooks.postprocess(l)), l;
      } catch (a) {
        return i(a);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + qe(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, nt = new za();
function oe(t, e) {
  return nt.parse(t, e);
}
oe.options = oe.setOptions = function(t) {
  return nt.setOptions(t), oe.defaults = nt.defaults, Kr(oe.defaults), oe;
};
oe.getDefaults = Bn;
oe.defaults = rt;
oe.use = function(...t) {
  return nt.use(...t), oe.defaults = nt.defaults, Kr(oe.defaults), oe;
};
oe.walkTokens = function(t, e) {
  return nt.walkTokens(t, e);
};
oe.parseInline = nt.parseInline;
oe.Parser = Be;
oe.parser = Be.parse;
oe.Renderer = tn;
oe.TextRenderer = Fn;
oe.Lexer = ze;
oe.lexer = ze.lex;
oe.Tokenizer = en;
oe.Hooks = bt;
oe.parse = oe;
oe.options;
oe.setOptions;
oe.use;
oe.walkTokens;
oe.parseInline;
Be.parse;
ze.lex;
const li = `function j() {
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
`, Sr = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", li], { type: "text/javascript;charset=utf-8" });
function Ba(t) {
  let e;
  try {
    if (e = Sr && (self.URL || self.webkitURL).createObjectURL(Sr), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(li),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function Na(t) {
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
const ci = qr(() => new Ba(), "markdown"), vr = typeof DOMParser < "u" ? new DOMParser() : null;
function Ln() {
  return ci.get();
}
function Oa(t) {
  return ci.send(t, 1e3);
}
const Ye = [];
function Cn(t) {
  if (t && typeof t == "object") {
    Ye.push(t);
    try {
      oe.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function qa(t) {
  Ye.length = 0, Array.isArray(t) && Ye.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Ye.forEach((e) => oe.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function nn(t) {
  if (Ln && Ln())
    try {
      const i = await Oa({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const l = (vr || new DOMParser()).parseFromString(i.html, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6");
          o.forEach((h) => {
            h.id || (h.id = le(h.textContent || ""));
            try {
              const f = Number(h.tagName.substring(1));
              if (f >= 1 && f <= 6) {
                const p = {
                  1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
                  2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
                  3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
                  4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
                  5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
                  6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
                }, d = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
                `${p[f]} ${d}`.split(/\s+/).filter(Boolean).forEach((w) => {
                  try {
                    h.classList.add(w);
                  } catch {
                  }
                });
              }
            } catch {
            }
          });
          try {
            try {
              const f = typeof document < "u" && document.documentElement && document.documentElement.getAttribute ? document.documentElement.getAttribute("data-nimbi-logo-moved") : null;
              if (f) {
                const p = Array.from(l.querySelectorAll("img"));
                for (const d of p)
                  try {
                    const g = d.getAttribute("src") || "";
                    if (new URL(g, location.href).toString() === f) {
                      const b = d.parentElement;
                      d.remove(), b && b.tagName && b.tagName.toLowerCase() === "p" && b.childNodes.length === 0 && b.remove();
                      break;
                    }
                  } catch {
                  }
              }
            } catch {
            }
            l.querySelectorAll("img").forEach((f) => {
              try {
                f.getAttribute("loading") || f.setAttribute("data-want-lazy", "1");
              } catch (p) {
                console.warn("[markdown] set image loading attribute failed", p);
              }
            });
          } catch (h) {
            console.warn("[markdown] query images failed", h);
          }
          try {
            l.querySelectorAll("pre code").forEach((f) => {
              try {
                const p = f.getAttribute && f.getAttribute("class") || f.className || "", d = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
                if (d)
                  try {
                    f.setAttribute && f.setAttribute("class", d);
                  } catch (b) {
                    console.warn("[markdown] set code class failed", b), f.className = d;
                  }
                else
                  try {
                    f.removeAttribute && f.removeAttribute("class");
                  } catch (b) {
                    console.warn("[markdown] remove code class failed", b), f.className = "";
                  }
                const g = d, w = g.match(/language-([a-zA-Z0-9_+-]+)/) || g.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!w || !w[1])
                  try {
                    const b = f.textContent || "";
                    try {
                      if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
                        const k = pe.highlight(b, { language: "plaintext" });
                        k && k.value && (f.innerHTML = k.value);
                      }
                    } catch {
                      try {
                        pe.highlightElement(f);
                      } catch (E) {
                        console.warn("[markdown] hljs.highlightElement failed", E);
                      }
                    }
                  } catch (b) {
                    console.warn("[markdown] code auto-detect failed", b);
                  }
              } catch (p) {
                console.warn("[markdown] processing code blocks failed", p);
              }
            });
          } catch (h) {
            console.warn("[markdown] query code blocks failed", h);
          }
          const u = l.body.innerHTML, c = [];
          return o.forEach((h) => {
            c.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || "").trim(), id: h.id });
          }), { html: u, meta: i.meta || {}, toc: c };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), i;
        }
    } catch (i) {
      console.warn("[markdown] worker render failed", i);
    }
  const { content: n, data: s } = Na(t || "");
  if (oe.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Ye && Ye.length)
    try {
      Ye.forEach((i) => oe.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let r = oe.parse(n);
  try {
    const a = (vr || new DOMParser()).parseFromString(r, "text/html"), l = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    l.forEach((u) => {
      u.id || (u.id = le(u.textContent || ""));
      try {
        const c = Number(u.tagName.substring(1));
        if (c >= 1 && c <= 6) {
          const h = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, f = c <= 2 ? "has-text-weight-bold" : c <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          `${h[c]} ${f}`.split(/\s+/).filter(Boolean).forEach((d) => {
            try {
              u.classList.add(d);
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
          const h = Array.from(a.querySelectorAll("img"));
          for (const f of h)
            try {
              const p = f.getAttribute("src") || "";
              if (new URL(p, location.href).toString() === c) {
                const g = f.parentElement;
                f.remove(), g && g.tagName && g.tagName.toLowerCase() === "p" && g.childNodes.length === 0 && g.remove();
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
        } catch (h) {
          console.warn("[markdown] set image loading attribute failed", h);
        }
      });
    } catch (u) {
      console.warn("[markdown] query images failed", u);
    }
    try {
      a.querySelectorAll("pre code").forEach((c) => {
        try {
          const h = c.getAttribute && c.getAttribute("class") || c.className || "", f = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (f)
            try {
              c.setAttribute && c.setAttribute("class", f);
            } catch (g) {
              console.warn("[markdown] set code class failed", g), c.className = f;
            }
          else
            try {
              c.removeAttribute && c.removeAttribute("class");
            } catch (g) {
              console.warn("[markdown] remove code class failed", g), c.className = "";
            }
          const p = f, d = p.match(/language-([a-zA-Z0-9_+-]+)/) || p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!d || !d[1])
            try {
              const g = c.textContent || "";
              try {
                if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
                  const w = pe.highlight(g, { language: "plaintext" });
                  w && w.value && (c.innerHTML = w.value);
                }
              } catch {
                try {
                  pe.highlightElement(c);
                } catch (b) {
                  console.warn("[markdown] hljs.highlightElement failed", b);
                }
              }
            } catch (g) {
              console.warn("[markdown] code auto-detect failed", g);
            }
        } catch (h) {
          console.warn("[markdown] processing code blocks failed", h);
        }
      });
    } catch (u) {
      console.warn("[markdown] query code blocks failed", u);
    }
    r = a.body.innerHTML;
    const o = [];
    return l.forEach((u) => {
      o.push({ level: Number(u.tagName.substring(1)), text: (u.textContent || "").trim(), id: u.id });
    }), { html: a.body.innerHTML, meta: s || {}, toc: o };
  } catch (i) {
    console.warn("post-process markdown failed", i);
  }
  return { html: r, meta: s || {}, toc: [] };
}
function Tn(t, e) {
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
      const l = a[1].toLowerCase();
      if (Pr.has(l) || e && e.size && l.length < 3 && !e.has(l) && !(Te && Te[l] && e.has(Te[l]))) continue;
      if (e && e.size) {
        if (e.has(l)) {
          const u = e.get(l);
          u && n.add(u);
          continue;
        }
        if (Te && Te[l]) {
          const u = Te[l];
          if (e.has(u)) {
            const c = e.get(u) || u;
            n.add(c);
            continue;
          }
        }
      }
      (i.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
const Da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: Cn,
  detectFenceLanguages: Tn,
  initRendererWorker: Ln,
  markdownPlugins: Ye,
  parseMarkdownToHtml: nn,
  setMarkdownExtensions: qa
}, Symbol.toStringTag, { value: "Module" }));
function Ua(t, e) {
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
function Ha(t, e) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const s = document.createElement("p");
  s.className = "menu-label", s.textContent = t("navigation"), n.appendChild(s);
  const r = document.createElement("ul");
  return r.className = "menu-list", e.forEach((i) => {
    const a = document.createElement("li"), l = document.createElement("a");
    if (l.href = "#" + i.path, l.textContent = i.name, a.appendChild(l), i.children && i.children.length) {
      const o = document.createElement("ul");
      i.children.forEach((u) => {
        const c = document.createElement("li"), h = document.createElement("a");
        h.href = "#" + u.path, h.textContent = u.name, c.appendChild(h), o.appendChild(c);
      }), a.appendChild(o);
    }
    r.appendChild(a);
  }), n.appendChild(r), n;
}
function ja(t, e, n = "") {
  const s = document.createElement("aside");
  s.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), s.appendChild(r);
  const i = document.createElement("ul");
  i.className = "menu-list";
  try {
    const l = {};
    (e || []).forEach((o) => {
      try {
        if (!o || o.level === 1) return;
        const u = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), h = document.createElement("a"), f = o.id || le(o.text || "");
        h.textContent = o.text || "";
        try {
          const w = String(n || "").replace(/^[\\.\\/]+/, ""), b = w && j && j.has && j.has(w) ? j.get(w) : w;
          b ? h.href = `?page=${encodeURIComponent(b)}#${encodeURIComponent(f)}` : h.href = `#${encodeURIComponent(f)}`;
        } catch (w) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", w), h.href = `#${encodeURIComponent(f)}`;
        }
        if (c.appendChild(h), u === 2) {
          i.appendChild(c), l[2] = c, Object.keys(l).forEach((w) => {
            Number(w) > 2 && delete l[w];
          });
          return;
        }
        let p = u - 1;
        for (; p > 2 && !l[p]; ) p--;
        p < 2 && (p = 2);
        let d = l[p];
        if (!d) {
          i.appendChild(c), l[u] = c;
          return;
        }
        let g = d.querySelector("ul");
        g || (g = document.createElement("ul"), d.appendChild(g)), g.appendChild(c), l[u] = c;
      } catch (u) {
        console.warn("[htmlBuilder] buildTocElement item failed", u, o);
      }
    });
  } catch (l) {
    console.warn("[htmlBuilder] buildTocElement failed", l);
  }
  return s.appendChild(i), i.querySelectorAll("li").length <= 1 ? null : s;
}
function ui(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = le(n.textContent || ""));
  });
}
function Fa(t, e, n) {
  try {
    const s = t.querySelectorAll("img");
    if (s && s.length) {
      const r = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      s.forEach((i) => {
        const a = i.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const l = new URL(r + a, n).toString();
            i.src = l;
            try {
              i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
            } catch (o) {
              console.warn("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (l) {
            console.warn("[htmlBuilder] resolve image src failed", l);
          }
      });
    }
  } catch (s) {
    console.warn("[htmlBuilder] lazyLoadImages failed", s);
  }
}
function Ar(t, e, n) {
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
        const l = a.tagName ? a.tagName.toLowerCase() : "", o = (u) => {
          try {
            const c = a.getAttribute(u) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              a.setAttribute(u, new URL(c, r).toString());
            } catch (h) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", u, c, h);
            }
          } catch (c) {
            console.warn("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && o("src"), a.hasAttribute && a.hasAttribute("href") && l !== "a" && o("href"), a.hasAttribute && a.hasAttribute("xlink:href") && o("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && o("poster"), a.hasAttribute("srcset")) {
          const h = (a.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [p, d] = f.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return f;
            try {
              const g = new URL(p, r).toString();
              return d ? `${g} ${d}` : g;
            } catch {
              return f;
            }
          }).join(", ");
          a.setAttribute("srcset", h);
        }
      } catch (l) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", s);
  }
}
let Er = "", wn = null, Rr = "";
async function hi(t, e, n) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let r, i;
    if (e === Er && wn)
      r = wn, i = Rr;
    else {
      try {
        r = new URL(e, location.href), i = Ct(r.pathname);
      } catch {
        try {
          r = new URL(e, location.href), i = Ct(r.pathname);
        } catch {
          r = null, i = "/";
        }
      }
      Er = e, wn = r, Rr = i;
    }
    const a = /* @__PURE__ */ new Set(), l = [], o = /* @__PURE__ */ new Set(), u = [];
    for (const c of Array.from(s))
      try {
        const h = c.getAttribute("href") || "";
        if (!h || Dr(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const p = new URL(h, e || location.href), d = p.searchParams.get("page");
              if (d && d.indexOf("/") === -1 && n) {
                const g = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (g) {
                  const w = me(g + d);
                  c.setAttribute("href", "?page=" + encodeURIComponent(w) + (p.hash || ""));
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (h.startsWith("/") && !h.endsWith(".md")) continue;
        const f = h.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (f) {
          let p = f[1];
          const d = f[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const g = new URL(p, e).pathname;
            let w = g.startsWith(i) ? g.slice(i.length) : g;
            w = me(w), l.push({ node: c, mdPathRaw: p, frag: d, rel: w }), j.has(w) || a.add(w);
          } catch (g) {
            console.warn("[htmlBuilder] resolve mdPath failed", g);
          }
          continue;
        }
        try {
          let p = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? p = n + h : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const g = new URL(p, e).pathname || "";
          if (g && g.indexOf(i) !== -1) {
            let w = g.startsWith(i) ? g.slice(i.length) : g;
            if (w = me(w), w = Tt(w), w || (w = "_home"), !w.endsWith(".md")) {
              let b = null;
              try {
                if (j && j.has && j.has(w))
                  b = j.get(w);
                else
                  try {
                    const k = String(w || "").replace(/^.*\//, "");
                    k && j.has && j.has(k) && (b = j.get(k));
                  } catch (k) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", k);
                  }
              } catch (k) {
                console.warn("[htmlBuilder] mdToSlug access check failed", k);
              }
              if (!b)
                try {
                  const k = String(w || "").replace(/^.*\//, "");
                  for (const [E, I] of te || [])
                    if (I === w || I === k) {
                      b = E;
                      break;
                    }
                } catch {
                }
              b ? c.setAttribute("href", `?page=${encodeURIComponent(b)}`) : (o.add(w), u.push({ node: c, rel: w }));
            }
          }
        } catch (p) {
          console.warn("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (h) {
        console.warn("[htmlBuilder] processing anchor failed", h);
      }
    a.size && await Promise.all(Array.from(a).map(async (c) => {
      try {
        try {
          const f = String(c).match(/([^\/]+)\.md$/), p = f && f[1];
          if (p && te.has(p)) {
            try {
              const d = te.get(p);
              if (d)
                try {
                  j.set(d, p);
                } catch (g) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", g);
                }
            } catch (d) {
              console.warn("[htmlBuilder] reading slugToMd failed", d);
            }
            return;
          }
        } catch (f) {
          console.warn("[htmlBuilder] basename slug lookup failed", f);
        }
        const h = await ve(c, e);
        if (h && h.raw) {
          const f = (h.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = le(f[1].trim());
            if (p)
              try {
                te.set(p, c), j.set(c, p);
              } catch (d) {
                console.warn("[htmlBuilder] setting slug mapping failed", d);
              }
          }
        }
      } catch (h) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
      }
    })), o.size && await Promise.all(Array.from(o).map(async (c) => {
      try {
        const h = await ve(c, e);
        if (h && h.raw)
          try {
            const p = (Wn || new DOMParser()).parseFromString(h.raw, "text/html"), d = p.querySelector("title"), g = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
            if (w) {
              const b = le(w);
              if (b)
                try {
                  te.set(b, c), j.set(c, b);
                } catch (k) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", k);
                }
            }
          } catch (f) {
            console.warn("[htmlBuilder] parse fetched HTML failed", f);
          }
      } catch (h) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", h);
      }
    }));
    for (const c of l) {
      const { node: h, frag: f, rel: p } = c;
      let d = null;
      try {
        j.has(p) && (d = j.get(p));
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug access failed", g);
      }
      d ? f ? h.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(d)}`) : f ? h.setAttribute("href", `?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(p)}`);
    }
    for (const c of u) {
      const { node: h, rel: f } = c;
      let p = null;
      try {
        j.has(f) && (p = j.get(f));
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", d);
      }
      if (!p)
        try {
          const d = String(f || "").replace(/^.*\//, "");
          j.has(d) && (p = j.get(d));
        } catch (d) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", d);
        }
      p ? h.setAttribute("href", `?page=${encodeURIComponent(p)}`) : h.setAttribute("href", `?page=${encodeURIComponent(f)}`);
    }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteAnchors failed", s);
  }
}
function Wa(t, e, n, s) {
  const r = e.querySelector("h1"), i = r ? (r.textContent || "").trim() : "";
  let a = "";
  try {
    let l = "";
    try {
      t && t.meta && t.meta.title && (l = String(t.meta.title).trim());
    } catch {
    }
    if (!l && i && (l = i), !l)
      try {
        const o = e.querySelector("h2");
        o && o.textContent && (l = String(o.textContent).trim());
      } catch {
      }
    !l && n && (l = String(n)), l && (a = le(l)), a || (a = "_home");
    try {
      n && (te.set(a, n), j.set(n, a));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = "?page=" + encodeURIComponent(a);
      try {
        const u = s || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        u && (o += "#" + encodeURIComponent(u));
      } catch (u) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", u);
      }
      try {
        history.replaceState({ page: a }, "", o);
      } catch (u) {
        console.warn("[htmlBuilder] computeSlug history replace failed", u);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    console.warn("[htmlBuilder] computeSlug failed", l);
  }
  return { topH1: r, h1Text: i, slugKey: a };
}
async function Za(t, e) {
  if (!t || !t.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(t || []))
    try {
      const u = o.getAttribute("href") || "";
      if (!u) continue;
      let f = me(u).split(/::|#/, 2)[0];
      try {
        const d = f.indexOf("?");
        d !== -1 && (f = f.slice(0, d));
      } catch {
      }
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const p = f;
      try {
        if (j && j.has && j.has(p)) continue;
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const g of te.values())
          if (g === p) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        console.warn("[htmlBuilder] slugToMd iteration failed", d);
      }
      n.add(p);
    } catch (u) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", u);
    }
  if (!n.size) return;
  const s = async (o) => {
    try {
      const u = await ve(o, e);
      if (u && u.raw)
        try {
          const h = (Wn || new DOMParser()).parseFromString(u.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const g = le(d);
            if (g)
              try {
                te.set(g, o), j.set(o, g);
              } catch (w) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", w);
              }
          }
        } catch (c) {
          console.warn("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (u) {
      console.warn("[htmlBuilder] fetchAndExtract failed", u);
    }
  }, r = 5, i = Array.from(n);
  let a = 0;
  const l = [];
  for (; a < i.length; ) {
    const o = i.slice(a, a + r);
    l.push(Promise.all(o.map(s))), a += r;
  }
  await Promise.all(l);
}
async function Ga(t, e) {
  if (!t || !t.length) return;
  const n = [], s = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const i = new URL(e, typeof location < "u" ? location.href : "http://localhost/");
    r = Ct(i.pathname);
  } catch (i) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", i);
  }
  for (const i of Array.from(t || []))
    try {
      const a = i.getAttribute("href") || "";
      if (!a) continue;
      const l = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = me(l[1]);
        try {
          let u;
          try {
            u = Ua(o, e);
          } catch (h) {
            u = o, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const c = u && r && u.startsWith(r) ? u.slice(r.length) : String(u || "").replace(/^\//, "");
          n.push({ rel: c }), j.has(c) || s.add(c);
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
      const a = String(i).match(/([^\/]+)\.md$/), l = a && a[1];
      if (l && te.has(l)) {
        try {
          const o = te.get(l);
          o && j.set(o, l);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await ve(i, e);
      if (a && a.raw) {
        const l = (a.raw || "").match(/^#\s+(.+)$/m);
        if (l && l[1]) {
          const o = le(l[1].trim());
          if (o)
            try {
              te.set(o, i), j.set(i, o);
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
const Wn = typeof DOMParser < "u" ? new DOMParser() : null;
function bn(t) {
  try {
    const n = (Wn || new DOMParser()).parseFromString(t || "", "text/html");
    ui(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (u) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", u);
        }
      });
    } catch (l) {
      console.warn("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", u = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (u && u[1]) {
          const c = (u[1] || "").toLowerCase(), h = re.size && (re.get(c) || re.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await Lt(h);
              } catch (f) {
                console.warn("[htmlBuilder] registerLanguage failed", f);
              }
            })();
          } catch (f) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", f);
          }
        } else
          try {
            if (pe && typeof pe.getLanguage == "function" && pe.getLanguage("plaintext")) {
              const c = pe.highlight ? pe.highlight(l.textContent || "", { language: "plaintext" }) : null;
              c && c.value && (l.innerHTML = c.value);
            }
          } catch (c) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (o) {
        console.warn("[htmlBuilder] code element processing failed", o);
      }
    });
    const r = [];
    n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((l) => {
      r.push({ level: Number(l.tagName.substring(1)), text: (l.textContent || "").trim(), id: l.id });
    });
    const a = {};
    try {
      const l = n.querySelector("title");
      l && l.textContent && String(l.textContent).trim() && (a.title = String(l.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: a, toc: r };
  } catch (e) {
    return console.warn("[htmlBuilder] parseHtml failed", e), { html: t || "", meta: {}, toc: [] };
  }
}
async function Qa(t) {
  const e = Tn ? Tn(t || "", re) : /* @__PURE__ */ new Set(), n = new Set(e), s = [];
  for (const r of n)
    try {
      const i = re.size && (re.get(r) || re.get(String(r).toLowerCase())) || r;
      try {
        s.push(Lt(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(r) !== String(i))
        try {
          s.push(Lt(r));
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
async function Xa(t) {
  if (await Qa(t), nn) {
    const e = await nn(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Ka(t, e, n, s, r) {
  let i = null;
  if (e.isHtml)
    try {
      const h = typeof DOMParser < "u" ? new DOMParser() : null;
      if (h) {
        const f = h.parseFromString(e.raw || "", "text/html");
        try {
          Ar(f.body, n, r);
        } catch (p) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", p);
        }
        i = bn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : e.raw || "");
      } else
        i = bn(e.raw || "");
    } catch {
      i = bn(e.raw || "");
    }
  else
    i = await Xa(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    Ar(a, n, r);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    ui(a);
  } catch (h) {
    console.warn("[htmlBuilder] addHeadingIds failed", h);
  }
  try {
    a.querySelectorAll("pre code, code[class]").forEach((f) => {
      try {
        const p = f.getAttribute && f.getAttribute("class") || f.className || "", d = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (d)
          try {
            f.setAttribute && f.setAttribute("class", d);
          } catch (g) {
            f.className = d, console.warn("[htmlBuilder] set element class failed", g);
          }
        else
          try {
            f.removeAttribute && f.removeAttribute("class");
          } catch (g) {
            f.className = "", console.warn("[htmlBuilder] remove element class failed", g);
          }
      } catch (p) {
        console.warn("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (h) {
    console.warn("[htmlBuilder] processing code elements failed", h);
  }
  try {
    bs(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  Fa(a, n, r);
  try {
    (a.querySelectorAll && a.querySelectorAll("img") || []).forEach((f) => {
      try {
        const p = f.parentElement;
        if (!p || p.tagName.toLowerCase() !== "p" || p.childNodes.length !== 1) return;
        const d = document.createElement("figure");
        d.className = "image", p.replaceWith(d), d.appendChild(f);
      } catch {
      }
    });
  } catch (h) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", h);
  }
  try {
    (a.querySelectorAll && a.querySelectorAll("table") || []).forEach((f) => {
      try {
        if (f.classList)
          f.classList.contains("table") || f.classList.add("table");
        else {
          const p = f.getAttribute && f.getAttribute("class") ? f.getAttribute("class") : "", d = String(p || "").split(/\s+/).filter(Boolean);
          d.indexOf("table") === -1 && d.push("table");
          try {
            f.setAttribute && f.setAttribute("class", d.join(" "));
          } catch {
            f.className = d.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (h) {
    console.warn("[htmlBuilder] add Bulma table class failed", h);
  }
  const { topH1: l, h1Text: o, slugKey: u } = Wa(i, a, n, s);
  try {
    await Va(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await hi(a, r, n);
  }
  const c = ja(t, i.toc, n);
  return { article: a, parsed: i, toc: c, topH1: l, h1Text: o, slugKey: u };
}
function Ya(t) {
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
function Lr(t, e, n) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", s.appendChild(r), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function Va(t, e, n) {
  return hi(t, e, n);
}
function Ja(t) {
  try {
    t.addEventListener("click", (e) => {
      const n = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!n) return;
      const s = n.getAttribute("href") || "";
      try {
        const r = new URL(s, location.href), i = r.searchParams.get("page"), a = r.hash ? r.hash.replace(/^#/, "") : null;
        if (!i && !a) return;
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
        if (!i && a || i && l && String(i) === String(l)) {
          try {
            if (!i && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: l || i }, "", "?page=" + encodeURIComponent(l || i) + (a ? "#" + encodeURIComponent(a) : ""));
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
            Mn(a);
          } catch (o) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: i }, "", "?page=" + encodeURIComponent(i) + (a ? "#" + encodeURIComponent(a) : ""));
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
function Mn(t) {
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
function eo(t, e, { mountOverlay: n = null, container: s = null, mountEl: r = null, navWrap: i = null, t: a = null } = {}) {
  try {
    const l = a || ((g) => typeof g == "string" ? g : ""), o = s || document.querySelector(".nimbi-cms"), u = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), h = i || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top button is-primary is-rounded is-small", p.setAttribute("aria-label", l("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(p) : o && o.appendChild ? o.appendChild(p) : u && u.appendChild ? u.appendChild(p) : document.body.appendChild(p);
      } catch {
        try {
          document.body.appendChild(p);
        } catch (w) {
          console.warn("[htmlBuilder] append scroll top button failed", w);
        }
      }
      try {
        try {
          zr(p);
        } catch {
        }
      } catch (g) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", g);
      }
      p.addEventListener("click", () => {
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
    const d = h && h.querySelector ? h.querySelector(".menu-label") : null;
    if (e) {
      if (!p._nimbiObserver) {
        const g = new IntersectionObserver((w) => {
          for (const b of w)
            b.target instanceof Element && (b.isIntersecting ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show")));
        }, { root: s instanceof Element ? s : r instanceof Element ? r : null, threshold: 0 });
        p._nimbiObserver = g;
      }
      try {
        p._nimbiObserver.disconnect();
      } catch (g) {
        console.warn("[htmlBuilder] observer disconnect failed", g);
      }
      try {
        p._nimbiObserver.observe(e);
      } catch (g) {
        console.warn("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const w = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, b = e.getBoundingClientRect();
            !(b.bottom < w.top || b.top > w.bottom) ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show"));
          } catch (w) {
            console.warn("[htmlBuilder] checkIntersect failed", w);
          }
        };
        g(), "IntersectionObserver" in window || setTimeout(g, 100);
      } catch (g) {
        console.warn("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      p.classList.remove("show"), d && d.classList.remove("show");
      const g = s instanceof Element ? s : r instanceof Element ? r : window, w = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (p.classList.add("show"), d && d.classList.add("show")) : (p.classList.remove("show"), d && d.classList.remove("show"));
        } catch (b) {
          console.warn("[htmlBuilder] onScroll handler failed", b);
        }
      };
      Xt(() => g.addEventListener("scroll", w)), w();
    }
  } catch (l) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Cr(t, e) {
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
async function to(t, e, n, s, r, i, a, l, o = "eager", u = 1, c = void 0, h = "favicon") {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const f = typeof DOMParser < "u" ? new DOMParser() : null, p = f ? f.parseFromString(n || "", "text/html") : null, d = p ? p.querySelectorAll("a") : [];
  await Xt(() => Za(d, s)), await Xt(() => Ga(d, s));
  let g = null, w = null, b = null, k = null, E = null, I = null;
  function M() {
    try {
      const v = document.querySelector(".navbar-burger"), _ = v && v.dataset ? v.dataset.target : null, y = _ ? document.getElementById(_) : null;
      v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), y && y.classList.remove("is-active"));
    } catch (v) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", v);
    }
  }
  const z = () => g || (g = (async () => {
    try {
      const v = await Promise.resolve().then(() => Zt), _ = Cr(v, "buildSearchIndex") || (typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0), y = Cr(v, "buildSearchIndexWorker") || (typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0);
      if (o === "lazy" && typeof y == "function")
        try {
          const R = await y(s, u, c);
          if (R && R.length) return R;
        } catch (R) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", R);
        }
      return typeof _ == "function" ? await _(s, u, c) : [];
    } catch (v) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", v), [];
    } finally {
      if (w) {
        try {
          w.removeAttribute("disabled");
        } catch {
        }
        try {
          b && b.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), g.then((v) => {
    try {
      const _ = String(w && w.value || "").trim().toLowerCase();
      if (!_ || !Array.isArray(v) || !v.length) return;
      const y = v.filter((P) => P.title && P.title.toLowerCase().includes(_) || P.excerpt && P.excerpt.toLowerCase().includes(_));
      if (!y || !y.length) return;
      const R = document.getElementById("nimbi-search-results");
      if (!R) return;
      R.innerHTML = "", y.slice(0, 10).forEach((P) => {
        const T = document.createElement("div");
        if (T.className = "nimbi-search-result", P.parentTitle) {
          const B = document.createElement("div");
          B.textContent = P.parentTitle, B.className = "nimbi-search-title nimbi-search-parent", T.appendChild(B);
        }
        const O = document.createElement("a");
        O.className = "block", O.href = "?page=" + encodeURIComponent(P.slug), O.textContent = P.title, O.addEventListener("click", () => {
          try {
            R.style.display = "none";
          } catch {
          }
        }), T.appendChild(O), R.appendChild(T);
      });
      try {
        R.style.display = "block";
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), g), Z = document.createElement("nav");
  Z.className = "navbar", Z.setAttribute("role", "navigation"), Z.setAttribute("aria-label", "main navigation");
  const V = document.createElement("div");
  V.className = "navbar-brand";
  const ie = d[0], J = document.createElement("a");
  if (J.className = "navbar-item", ie) {
    const v = ie.getAttribute("href") || "#";
    try {
      const y = new URL(v, location.href).searchParams.get("page");
      y ? J.href = "?page=" + encodeURIComponent(decodeURIComponent(y)) : (J.href = "?page=" + encodeURIComponent(r), J.textContent = i("home"));
    } catch {
      J.href = "?page=" + encodeURIComponent(r), J.textContent = i("home");
    }
  } else
    J.href = "?page=" + encodeURIComponent(r), J.textContent = i("home");
  async function W(v) {
    try {
      if (!v || v === "none") return null;
      if (v === "favicon")
        try {
          const _ = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!_) return null;
          const y = _.getAttribute("href") || "";
          return y && /\.png(?:\?|$)/i.test(y) ? new URL(y, location.href).toString() : null;
        } catch {
          return null;
        }
      if (v === "copy-first" || v === "move-first")
        try {
          const _ = await ve(r, s);
          if (!_ || !_.raw) return null;
          const P = new DOMParser().parseFromString(_.raw, "text/html").querySelector("img");
          if (!P) return null;
          const T = P.getAttribute("src") || "";
          if (!T) return null;
          const O = new URL(T, location.href).toString();
          if (v === "move-first")
            try {
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
  let X = null;
  try {
    X = await W(h);
  } catch {
    X = null;
  }
  if (X)
    try {
      const v = document.createElement("img");
      v.className = "nimbi-navbar-logo";
      const _ = i && typeof i == "function" && (i("home") || i("siteLogo")) || "";
      v.alt = _, v.title = _, v.src = X;
      try {
        J.innerHTML = "";
      } catch {
        J.textContent = "";
      }
      J.appendChild(v);
    } catch {
    }
  V.appendChild(J), J.addEventListener("click", function(v) {
    const _ = J.getAttribute("href") || "";
    if (_.startsWith("?page=")) {
      v.preventDefault();
      const y = new URL(_, location.href), R = y.searchParams.get("page"), P = y.hash ? y.hash.replace(/^#/, "") : null;
      history.pushState({ page: R }, "", "?page=" + encodeURIComponent(R) + (P ? "#" + encodeURIComponent(P) : ""));
      try {
        a();
      } catch (T) {
        console.warn("[nimbi-cms] renderByQuery failed", T);
      }
      try {
        M();
      } catch {
      }
    }
  });
  const D = document.createElement("a");
  D.className = "navbar-burger", D.setAttribute("role", "button"), D.setAttribute("aria-label", "menu"), D.setAttribute("aria-expanded", "false");
  const he = "nimbi-navbar-menu";
  D.dataset.target = he, D.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', V.appendChild(D);
  try {
    D.addEventListener("click", (v) => {
      try {
        const _ = D.dataset && D.dataset.target ? D.dataset.target : null, y = _ ? document.getElementById(_) : null;
        D.classList.contains("is-active") ? (D.classList.remove("is-active"), D.setAttribute("aria-expanded", "false"), y && y.classList.remove("is-active")) : (D.classList.add("is-active"), D.setAttribute("aria-expanded", "true"), y && y.classList.add("is-active"));
      } catch (_) {
        console.warn("[nimbi-cms] navbar burger toggle failed", _);
      }
    });
  } catch (v) {
    console.warn("[nimbi-cms] burger event binding failed", v);
  }
  const F = document.createElement("div");
  F.className = "navbar-menu", F.id = he;
  const S = document.createElement("div");
  S.className = "navbar-start";
  let ne = null, Q = null;
  if (!l)
    ne = null, w = null, k = null, E = null, I = null;
  else {
    ne = document.createElement("div"), ne.className = "navbar-end", Q = document.createElement("div"), Q.className = "navbar-item", w = document.createElement("input"), w.className = "input", w.type = "search", w.placeholder = i("searchPlaceholder") || "", w.id = "nimbi-search", o === "eager" && (w.disabled = !0), b = document.createElement("div"), b.className = "control", o === "eager" && b.classList.add("is-loading"), b.appendChild(w), Q.appendChild(b), k = document.createElement("div"), k.className = "dropdown is-right", k.id = "nimbi-search-dropdown";
    const v = document.createElement("div");
    v.className = "dropdown-trigger", v.appendChild(Q);
    const _ = document.createElement("div");
    _.className = "dropdown-menu", _.setAttribute("role", "menu"), E = document.createElement("div"), E.id = "nimbi-search-results", E.className = "dropdown-content nimbi-search-results", I = E, _.appendChild(E), k.appendChild(v), k.appendChild(_), ne.appendChild(k);
    const y = (P) => {
      if (E) {
        if (E.innerHTML = "", !P.length) {
          k && k.classList.remove("is-active");
          try {
            E.style.display = "none";
          } catch {
          }
          try {
            E.classList.remove("is-open");
          } catch {
          }
          return;
        }
        P.forEach((T) => {
          if (T.parentTitle) {
            const B = document.createElement("p");
            B.textContent = T.parentTitle, B.className = "panel-heading nimbi-search-title nimbi-search-parent", E.appendChild(B);
          }
          const O = document.createElement("a");
          O.className = "dropdown-item nimbi-search-result", O.href = "?page=" + encodeURIComponent(T.slug), O.textContent = T.title, O.addEventListener("click", () => {
            k && k.classList.remove("is-active");
            try {
              E.style.display = "none";
            } catch {
            }
            try {
              E.classList.remove("is-open");
            } catch {
            }
          }), E.appendChild(O);
        }), k && k.classList.add("is-active");
        try {
          E.style.display = "block";
        } catch {
        }
        try {
          E.classList.add("is-open");
        } catch {
        }
      }
    }, R = (P, T) => {
      let O = null;
      return (...B) => {
        O && clearTimeout(O), O = setTimeout(() => P(...B), T);
      };
    };
    if (w) {
      const P = R(async () => {
        const T = document.querySelector("input#nimbi-search"), O = String(T && T.value || "").trim().toLowerCase();
        if (!O) {
          y([]);
          return;
        }
        try {
          await z();
          const ce = (await g).filter((ge) => ge.title && ge.title.toLowerCase().includes(O) || ge.excerpt && ge.excerpt.toLowerCase().includes(O));
          y(ce.slice(0, 10));
        } catch (B) {
          console.warn("[nimbi-cms] search input handler failed", B), y([]);
        }
      }, 50);
      try {
        w.addEventListener("input", P);
      } catch {
      }
      try {
        document.addEventListener("input", (T) => {
          try {
            T && T.target && T.target.id === "nimbi-search" && P(T);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = z();
      } catch (P) {
        console.warn("[nimbi-cms] eager search index init failed", P), g = Promise.resolve([]);
      }
      g.finally(() => {
        const P = document.querySelector("input#nimbi-search");
        if (P) {
          try {
            P.removeAttribute("disabled");
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
      const P = (T) => {
        try {
          const O = T && T.target;
          if (!I || !I.classList.contains("is-open") && I.style && I.style.display !== "block" || O && (I.contains(O) || w && (O === w || w.contains && w.contains(O)))) return;
          k && k.classList.remove("is-active");
          try {
            I.style.display = "none";
          } catch {
          }
          try {
            I.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", P, !0), document.addEventListener("touchstart", P, !0);
    } catch {
    }
  }
  for (let v = 0; v < d.length; v++) {
    const _ = d[v];
    if (v === 0) continue;
    const y = _.getAttribute("href") || "#", R = document.createElement("a");
    R.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(y) || y.endsWith(".md")) {
        const T = me(y).split(/::|#/, 2), O = T[0], B = T[1];
        R.href = "?page=" + encodeURIComponent(O) + (B ? "#" + encodeURIComponent(B) : "");
      } else if (/\.html(?:$|[#?])/.test(y) || y.endsWith(".html")) {
        const T = me(y).split(/::|#/, 2);
        let O = T[0];
        O && !O.toLowerCase().endsWith(".html") && (O = O + ".html");
        const B = T[1];
        try {
          const ce = await ve(O, s);
          if (ce && ce.raw)
            try {
              const Ue = new DOMParser().parseFromString(ce.raw, "text/html"), Pe = Ue.querySelector("title"), ht = Ue.querySelector("h1"), It = Pe && Pe.textContent && Pe.textContent.trim() ? Pe.textContent.trim() : ht && ht.textContent ? ht.textContent.trim() : null;
              if (It) {
                const it = le(It);
                if (it) {
                  try {
                    te.set(it, O), j.set(O, it);
                  } catch (on) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", on);
                  }
                  R.href = "?page=" + encodeURIComponent(it) + (B ? "#" + encodeURIComponent(B) : "");
                } else
                  R.href = "?page=" + encodeURIComponent(O) + (B ? "#" + encodeURIComponent(B) : "");
              } else
                R.href = "?page=" + encodeURIComponent(O) + (B ? "#" + encodeURIComponent(B) : "");
            } catch {
              R.href = "?page=" + encodeURIComponent(O) + (B ? "#" + encodeURIComponent(B) : "");
            }
          else
            R.href = y;
        } catch {
          R.href = y;
        }
      } else
        R.href = y;
    } catch (P) {
      console.warn("[nimbi-cms] nav item href parse failed", P), R.href = y;
    }
    try {
      const P = _.textContent && String(_.textContent).trim() ? String(_.textContent).trim() : null;
      if (P)
        try {
          const T = le(P);
          if (T) {
            const O = R.getAttribute && R.getAttribute("href") ? R.getAttribute("href") : "";
            try {
              const ce = new URL(O, location.href).searchParams.get("page");
              if (ce) {
                const ge = decodeURIComponent(ce);
                try {
                  te.set(T, ge), j.set(ge, T);
                } catch (Ue) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ue);
                }
              }
            } catch (B) {
              console.warn("[nimbi-cms] nav slug mapping failed", B);
            }
          }
        } catch (T) {
          console.warn("[nimbi-cms] nav slug mapping failed", T);
        }
    } catch (P) {
      console.warn("[nimbi-cms] nav slug mapping failed", P);
    }
    R.textContent = _.textContent || y, S.appendChild(R);
  }
  F.appendChild(S), ne && F.appendChild(ne), Z.appendChild(V), Z.appendChild(F), t.appendChild(Z);
  try {
    const v = (_) => {
      try {
        const y = Z && Z.querySelector ? Z.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!y || !y.classList.contains("is-active")) return;
        const R = y && y.closest ? y.closest(".navbar") : Z;
        if (R && R.contains(_.target)) return;
        M();
      } catch {
      }
    };
    document.addEventListener("click", v, !0), document.addEventListener("touchstart", v, !0);
  } catch {
  }
  try {
    F.addEventListener("click", (v) => {
      const _ = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!_) return;
      const y = _.getAttribute("href") || "";
      try {
        const R = new URL(y, location.href), P = R.searchParams.get("page"), T = R.hash ? R.hash.replace(/^#/, "") : null;
        if (P) {
          v.preventDefault(), history.pushState({ page: P }, "", "?page=" + encodeURIComponent(P) + (T ? "#" + encodeURIComponent(T) : ""));
          try {
            a();
          } catch (O) {
            console.warn("[nimbi-cms] renderByQuery failed", O);
          }
        }
      } catch (R) {
        console.warn("[nimbi-cms] navbar click handler failed", R);
      }
      try {
        const R = Z && Z.querySelector ? Z.querySelector(".navbar-burger") : null, P = R && R.dataset ? R.dataset.target : null, T = P ? document.getElementById(P) : null;
        R && R.classList.contains("is-active") && (R.classList.remove("is-active"), R.setAttribute("aria-expanded", "false"), T && T.classList.remove("is-active"));
      } catch (R) {
        console.warn("[nimbi-cms] mobile menu close failed", R);
      }
    });
  } catch (v) {
    console.warn("[nimbi-cms] attach content click handler failed", v);
  }
  try {
    e.addEventListener("click", (v) => {
      const _ = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!_) return;
      const y = _.getAttribute("href") || "";
      if (y && !Dr(y))
        try {
          const R = new URL(y, location.href), P = R.searchParams.get("page"), T = R.hash ? R.hash.replace(/^#/, "") : null;
          if (P) {
            v.preventDefault(), history.pushState({ page: P }, "", "?page=" + encodeURIComponent(P) + (T ? "#" + encodeURIComponent(T) : ""));
            try {
              a();
            } catch (O) {
              console.warn("[nimbi-cms] renderByQuery failed", O);
            }
          }
        } catch (R) {
          console.warn("[nimbi-cms] container click URL parse failed", R);
        }
    });
  } catch (v) {
    console.warn("[nimbi-cms] build navbar failed", v);
  }
  return { navbar: Z, linkEls: d };
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
var yn, Tr;
function no() {
  if (Tr) return yn;
  Tr = 1;
  function t(i, a) {
    return a.some(
      ([l, o]) => l <= i && i <= o
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
    let l = 0, o = 0, u = i.length - 1;
    const c = a.wordsPerMinute || 200, h = a.wordBound || n;
    for (; h(i[o]); ) o++;
    for (; h(i[u]); ) u--;
    const f = `${i}
`;
    for (let w = o; w <= u; w++)
      if ((e(f[w]) || !h(f[w]) && (h(f[w + 1]) || e(f[w + 1]))) && l++, e(f[w]))
        for (; w <= u && (s(f[w + 1]) || h(f[w + 1])); )
          w++;
    const p = l / c, d = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: d,
      words: l
    };
  }
  return yn = r, yn;
}
var ro = no();
const io = /* @__PURE__ */ $r(ro);
function Mr(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function ot(t, e, n) {
  let s = `meta[${t}="${e}"]`, r = document.querySelector(s);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function so(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function ao(t, e, n, s) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  ot("property", "og:title", r);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && ot("property", "og:description", i), ot("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = n || t.image;
  a && (ot("property", "og:image", a), ot("name", "twitter:image", a));
}
function oo(t, e, n, s, r = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  l && String(l).trim() && Mr("description", l), Mr("robots", i.robots || "index,follow"), ao(i, e, n, l);
}
function lo() {
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
function co(t, e, n, s, r, i = "") {
  try {
    const a = t.meta || {}, l = n && String(n).trim() ? n : a.title || i || document.title, o = r && String(r).trim() ? r : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = s || a.image || null;
    let c = "";
    try {
      if (e) {
        const d = me(e);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(d);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (d) {
      c = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", d);
    }
    c && so("canonical", c);
    try {
      ot("property", "og:url", c);
    } catch (d) {
      console.warn("[seoManager] upsertMeta og:url failed", d);
    }
    const h = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    u && (h.image = String(u)), a.date && (h.datePublished = a.date), a.dateModified && (h.dateModified = a.dateModified);
    const f = "nimbi-jsonld";
    let p = document.getElementById(f);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = f, document.head.appendChild(p)), p.textContent = JSON.stringify(h, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function uo(t, e, n, s, r, i, a, l, o, u, c) {
  try {
    if (s && s.querySelector) {
      const h = s.querySelector(".menu-label");
      h && (h.textContent = l && l.textContent || t("onThisPage"));
    }
  } catch (h) {
    console.warn("[seoManager] update toc label failed", h);
  }
  try {
    const h = n.meta && n.meta.title ? String(n.meta.title).trim() : "", f = r.querySelector("img"), p = f && (f.getAttribute("src") || f.src) || null;
    let d = "";
    try {
      let b = "";
      try {
        const k = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (k) {
          let E = k.nextElementSibling;
          const I = [];
          for (; E && !(E.tagName && E.tagName.toLowerCase() === "h2"); ) {
            const M = (E.textContent || "").trim();
            M && I.push(M), E = E.nextElementSibling;
          }
          I.length && (b = I.join(" ").replace(/\s+/g, " ").trim()), !b && o && (b = String(o).trim());
        }
      } catch (k) {
        console.warn("[seoManager] compute descOverride failed", k);
      }
      b && String(b).length > 160 && (b = String(b).slice(0, 157).trim() + "..."), d = b;
    } catch (b) {
      console.warn("[seoManager] compute descOverride failed", b);
    }
    let g = "";
    try {
      h && (g = h);
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
    g || (g = i || "");
    try {
      oo(n, g || void 0, p, d);
    } catch (b) {
      console.warn("[seoManager] setMetaTags failed", b);
    }
    try {
      co(n, u, g || void 0, p, d, e);
    } catch (b) {
      console.warn("[seoManager] setStructuredData failed", b);
    }
    const w = lo();
    g ? w ? document.title = `${w} - ${g}` : document.title = `${e || "Site"} - ${g}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = r.querySelector(".nimbi-reading-time");
    if (h && h.remove(), o) {
      const f = io(c.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const g = r.querySelector("h1");
      g && g.insertAdjacentElement("afterend", d);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let Re = null, H = null, xe = 1, Qe = (t, e) => e, vt = 0, At = 0, Gt = () => {
}, yt = 0.25;
function ho() {
  if (Re && document.contains(Re)) return Re;
  Re = null;
  const t = document.createElement("dialog");
  t.className = "nimbi-image-preview modal", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", Qe("imagePreviewTitle", "Image preview")), t.innerHTML = `
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
  `, t.addEventListener("click", (S) => {
    S.target === t && kn();
  }), t.addEventListener("wheel", (S) => {
    if (!J()) return;
    S.preventDefault();
    const ne = S.deltaY < 0 ? yt : -yt;
    Fe(xe + ne), u(), c();
  }, { passive: !1 }), t.addEventListener("keydown", (S) => {
    if (S.key === "Escape") {
      kn();
      return;
    }
    if (xe > 1) {
      const ne = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!ne) return;
      const Q = 40;
      switch (S.key) {
        case "ArrowUp":
          ne.scrollTop -= Q, S.preventDefault();
          break;
        case "ArrowDown":
          ne.scrollTop += Q, S.preventDefault();
          break;
        case "ArrowLeft":
          ne.scrollLeft -= Q, S.preventDefault();
          break;
        case "ArrowRight":
          ne.scrollLeft += Q, S.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), Re = t, H = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), l = t.querySelector("[data-nimbi-preview-zoom-label]"), o = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function u() {
    l && (l.textContent = `${Math.round(xe * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(xe * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Gt = u, s.addEventListener("click", () => {
    Fe(xe + yt), u(), c();
  }), r.addEventListener("click", () => {
    Fe(xe - yt), u(), c();
  }), e.addEventListener("click", () => {
    Et(), u(), c();
  }), n.addEventListener("click", () => {
    Fe(1), u(), c();
  }), i.addEventListener("click", () => {
    Et(), u(), c();
  }), a.addEventListener("click", kn), e.title = Qe("imagePreviewFit", "Fit to screen"), n.title = Qe("imagePreviewOriginal", "Original size"), r.title = Qe("imagePreviewZoomOut", "Zoom out"), s.title = Qe("imagePreviewZoomIn", "Zoom in"), a.title = Qe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Qe("imagePreviewClose", "Close"));
  let h = !1, f = 0, p = 0, d = 0, g = 0;
  const w = /* @__PURE__ */ new Map();
  let b = 0, k = 1;
  const E = (S, ne) => {
    const Q = S.x - ne.x, v = S.y - ne.y;
    return Math.hypot(Q, v);
  }, I = () => {
    h = !1, w.clear(), b = 0, H && (H.classList.add("is-panning"), H.classList.remove("is-grabbing"));
  };
  let M = 0, z = 0, Z = 0;
  const V = (S) => {
    const ne = Date.now(), Q = ne - M, v = S.clientX - z, _ = S.clientY - Z;
    M = ne, z = S.clientX, Z = S.clientY, Q < 300 && Math.hypot(v, _) < 30 && (Fe(xe > 1 ? 1 : 2), u(), S.preventDefault());
  }, ie = (S) => {
    Fe(xe > 1 ? 1 : 2), u(), S.preventDefault();
  }, J = () => Re ? typeof Re.open == "boolean" ? Re.open : Re.classList.contains("is-active") : !1, W = (S, ne, Q = 1) => {
    if (w.has(Q) && w.set(Q, { x: S, y: ne }), w.size === 2) {
      const R = Array.from(w.values()), P = E(R[0], R[1]);
      if (b > 0) {
        const T = P / b;
        Fe(k * T);
      }
      return;
    }
    if (!h) return;
    const v = H.closest(".nimbi-image-preview__image-wrapper");
    if (!v) return;
    const _ = S - f, y = ne - p;
    v.scrollLeft = d - _, v.scrollTop = g - y;
  }, X = (S, ne, Q = 1) => {
    if (!J()) return;
    if (w.set(Q, { x: S, y: ne }), w.size === 2) {
      const y = Array.from(w.values());
      b = E(y[0], y[1]), k = xe;
      return;
    }
    const v = H.closest(".nimbi-image-preview__image-wrapper");
    !v || !(v.scrollWidth > v.clientWidth || v.scrollHeight > v.clientHeight) || (h = !0, f = S, p = ne, d = v.scrollLeft, g = v.scrollTop, H.classList.add("is-panning"), H.classList.remove("is-grabbing"), window.addEventListener("pointermove", D), window.addEventListener("pointerup", he), window.addEventListener("pointercancel", he));
  }, D = (S) => {
    h && (S.preventDefault(), W(S.clientX, S.clientY, S.pointerId));
  }, he = () => {
    I(), window.removeEventListener("pointermove", D), window.removeEventListener("pointerup", he), window.removeEventListener("pointercancel", he);
  };
  H.addEventListener("pointerdown", (S) => {
    S.preventDefault(), X(S.clientX, S.clientY, S.pointerId);
  }), H.addEventListener("pointermove", (S) => {
    (h || w.size === 2) && S.preventDefault(), W(S.clientX, S.clientY, S.pointerId);
  }), H.addEventListener("pointerup", (S) => {
    S.preventDefault(), S.pointerType === "touch" && V(S), I();
  }), H.addEventListener("dblclick", ie), H.addEventListener("pointercancel", I), H.addEventListener("mousedown", (S) => {
    S.preventDefault(), X(S.clientX, S.clientY, 1);
  }), H.addEventListener("mousemove", (S) => {
    h && S.preventDefault(), W(S.clientX, S.clientY, 1);
  }), H.addEventListener("mouseup", (S) => {
    S.preventDefault(), I();
  });
  const F = t.querySelector(".nimbi-image-preview__image-wrapper");
  return F && (F.addEventListener("pointerdown", (S) => {
    if (X(S.clientX, S.clientY, S.pointerId), S && S.target && S.target.tagName === "IMG")
      try {
        S.target.classList.add("is-grabbing");
      } catch {
      }
  }), F.addEventListener("pointermove", (S) => {
    W(S.clientX, S.clientY, S.pointerId);
  }), F.addEventListener("pointerup", I), F.addEventListener("pointercancel", I), F.addEventListener("mousedown", (S) => {
    if (X(S.clientX, S.clientY, 1), S && S.target && S.target.tagName === "IMG")
      try {
        S.target.classList.add("is-grabbing");
      } catch {
      }
  }), F.addEventListener("mousemove", (S) => {
    W(S.clientX, S.clientY, 1);
  }), F.addEventListener("mouseup", I)), t;
}
function Fe(t) {
  if (!H) return;
  const e = Number(t);
  xe = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = H.getBoundingClientRect(), r = vt || H.naturalWidth || H.width || s.width || 0, i = At || H.naturalHeight || H.height || s.height || 0;
  if (r && i) {
    H.style.setProperty("--nimbi-preview-img-max-width", "none"), H.style.setProperty("--nimbi-preview-img-max-height", "none"), H.style.setProperty("--nimbi-preview-img-width", `${r * xe}px`), H.style.setProperty("--nimbi-preview-img-height", `${i * xe}px`), H.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      H.style.width = `${r * xe}px`, H.style.height = `${i * xe}px`, H.style.transform = "none";
    } catch {
    }
  } else {
    H.style.setProperty("--nimbi-preview-img-max-width", ""), H.style.setProperty("--nimbi-preview-img-max-height", ""), H.style.setProperty("--nimbi-preview-img-width", ""), H.style.setProperty("--nimbi-preview-img-height", ""), H.style.setProperty("--nimbi-preview-img-transform", `scale(${xe})`);
    try {
      H.style.transform = `scale(${xe})`;
    } catch {
    }
  }
  H && (H.classList.add("is-panning"), H.classList.remove("is-grabbing"));
}
function Et() {
  if (!H) return;
  const t = H.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = vt || H.naturalWidth || e.width, s = At || H.naturalHeight || e.height;
  if (!n || !s) return;
  const r = e.width / n, i = e.height / s, a = Math.min(r, i, 1);
  Fe(Number.isFinite(a) ? a : 1);
}
function fo(t, e = "", n = 0, s = 0) {
  const r = ho();
  xe = 1, vt = n || 0, At = s || 0, H.src = t, H.alt = e, H.style.transform = "scale(1)";
  const i = () => {
    vt = H.naturalWidth || H.width || 0, At = H.naturalHeight || H.height || 0;
  };
  if (i(), Et(), Gt(), requestAnimationFrame(() => {
    Et(), Gt();
  }), !vt || !At) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        Et(), Gt();
      }), H.removeEventListener("load", a);
    };
    H.addEventListener("load", a);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function kn() {
  if (Re) {
    typeof Re.close == "function" && Re.open && Re.close(), Re.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function po(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Qe = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, yt = n, t.addEventListener("click", (p) => {
    const d = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!d || d.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      d
    );
    if (g.src) {
      if (p.defaultPrevented !== !0) {
        const w = g.closest("a");
        w && w.getAttribute("href") && p.preventDefault();
      }
      fo(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
    }
  });
  let s = !1, r = 0, i = 0, a = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let u = 0, c = 1;
  const h = (p, d) => {
    const g = p.x - d.x, w = p.y - d.y;
    return Math.hypot(g, w);
  };
  t.addEventListener("pointerdown", (p) => {
    const d = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!d || d.tagName !== "IMG" || !Re || !Re.open) return;
    if (o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      const w = Array.from(o.values());
      u = h(w[0], w[1]), c = xe;
      return;
    }
    const g = d.closest(".nimbi-image-preview__image-wrapper");
    if (g && !(xe <= 1)) {
      p.preventDefault(), s = !0, r = p.clientX, i = p.clientY, a = g.scrollLeft, l = g.scrollTop, d.setPointerCapture(p.pointerId);
      try {
        d.classList.add("is-grabbing");
      } catch {
      }
    }
  }), t.addEventListener("pointermove", (p) => {
    if (o.has(p.pointerId) && o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      p.preventDefault();
      const k = Array.from(o.values()), E = h(k[0], k[1]);
      if (u > 0) {
        const I = E / u;
        Fe(c * I);
      }
      return;
    }
    if (!s) return;
    p.preventDefault();
    const g = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!g) return;
    const w = p.clientX - r, b = p.clientY - i;
    g.scrollLeft = a - w, g.scrollTop = l - b;
  });
  const f = () => {
    s = !1, o.clear(), u = 0;
    try {
      const p = document.querySelector("[data-nimbi-preview-image]");
      p && (p.classList.add("is-panning"), p.classList.remove("is-grabbing"));
    } catch {
    }
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function go(t) {
  const {
    contentWrap: e,
    navWrap: n,
    container: s,
    mountOverlay: r = null,
    t: i,
    contentBase: a,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: u
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const h = Ha(i, [{ path: l, name: i("home"), isIndex: !0, children: [] }]);
  async function f(b, k) {
    let E, I, M;
    try {
      ({ data: E, pagePath: I, anchor: M } = await Zs(b, a));
    } catch (X) {
      console.error("[nimbi-cms] fetchPageData failed", X), Lr(e, i, X);
      return;
    }
    !M && k && (M = k);
    try {
      Mn(null);
    } catch (X) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", X);
    }
    e.innerHTML = "";
    const { article: z, parsed: Z, toc: V, topH1: ie, h1Text: J, slugKey: W } = await Ka(i, E, I, M, a);
    uo(i, o, Z, V, z, I, M, ie, J, W, E), n.innerHTML = "", V && (n.appendChild(V), Ja(V));
    try {
      await u("transformHtml", { article: z, parsed: Z, toc: V, pagePath: I, anchor: M, topH1: ie, h1Text: J, slugKey: W, data: E });
    } catch (X) {
      console.warn("[nimbi-cms] transformHtml hooks failed", X);
    }
    e.appendChild(z);
    try {
      Ya(z);
    } catch (X) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", X);
    }
    try {
      po(z, { t: i });
    } catch (X) {
      console.warn("[nimbi-cms] attachImagePreview failed", X);
    }
    try {
      Ht(s, 100, !1), requestAnimationFrame(() => Ht(s, 100, !1)), setTimeout(() => Ht(s, 100, !1), 250);
    } catch (X) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", X);
    }
    Mn(M), eo(z, ie, { mountOverlay: r, container: s, navWrap: n, t: i });
    try {
      await u("onPageLoad", { data: E, pagePath: I, anchor: M, article: z, toc: V, topH1: ie, h1Text: J, slugKey: W, contentWrap: e, navWrap: n });
    } catch (X) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", X);
    }
    c = I;
  }
  async function p() {
    let b = new URLSearchParams(location.search).get("page") || l;
    const k = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await f(b, k);
    } catch (E) {
      console.warn("[nimbi-cms] renderByQuery failed for", b, E), Lr(e, i, E);
    }
  }
  window.addEventListener("popstate", p);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const b = s || document.querySelector(".nimbi-cms");
      if (!b) return;
      const k = {
        top: b.scrollTop || 0,
        left: b.scrollLeft || 0
      };
      sessionStorage.setItem(d(), JSON.stringify(k));
    } catch {
    }
  }, w = () => {
    try {
      const b = s || document.querySelector(".nimbi-cms");
      if (!b) return;
      const k = sessionStorage.getItem(d());
      if (!k) return;
      const E = JSON.parse(k);
      E && typeof E.top == "number" && b.scrollTo({ top: E.top, left: E.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (b) => {
    if (b.persisted)
      try {
        w(), Ht(s, 100, !1);
      } catch (k) {
        console.warn("[nimbi-cms] bfcache restore failed", k);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (b) {
      console.warn("[nimbi-cms] save scroll position failed", b);
    }
  }), { renderByQuery: p, siteNav: h, getCurrentPagePath: () => c };
}
function mo(t) {
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
      const a = (n.get("noIndexing") || "").split(",").map((l) => l.trim()).filter(Boolean);
      a.length && (s.noIndexing = a);
    }
    return s;
  } catch {
    return {};
  }
}
function wo(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function _r(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let xn = "";
async function Lo(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = mo();
  if (e && (e.contentPath || e.homePage || e.notFoundPage))
    if (t && t.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage");
      } catch (y) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", y);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage");
      } catch (y) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", y);
      }
      delete e.contentPath, delete e.homePage, delete e.notFoundPage;
    }
  const n = Object.assign({}, e, t), {
    el: s,
    contentPath: r = "/content",
    crawlMaxQueue: i = 1e3,
    searchIndex: a = !0,
    searchIndexMode: l = "eager",
    indexDepth: o = 1,
    noIndexing: u = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: h = "none",
    lang: f = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: d = 5,
    cacheMaxEntries: g,
    markdownExtensions: w,
    availableLanguages: b,
    homePage: k = "_home.md",
    notFoundPage: E = "_404.md"
  } = n, { navbarLogo: I = "favicon" } = n, { skipRootReadme: M = !1 } = n;
  if (n.contentPath != null && !wo(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (n.homePage != null && !_r(n.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (n.notFoundPage != null && !_r(n.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!s)
    throw new Error("el is required");
  let z = s;
  if (typeof s == "string") {
    if (z = document.querySelector(s), !z) throw new Error(`el selector "${s}" did not match any element`);
  } else if (!(s instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (l != null && l !== "eager" && l !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (o != null && o !== 1 && o !== 2 && o !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (c !== "light" && c !== "dark" && c !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (d != null && (typeof d != "number" || !Number.isFinite(d) || d < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (g != null && (typeof g != "number" || !Number.isInteger(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((y) => !y || typeof y != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (b != null && (!Array.isArray(b) || b.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (M != null && typeof M != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (E != null && (typeof E != "string" || !E.trim() || !/\.(md|html)$/.test(E)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const Z = !!a;
  try {
    Promise.resolve().then(() => Zt).then((y) => {
      try {
        y && typeof y.setSkipRootReadme == "function" && y.setSkipRootReadme(!!M);
      } catch (R) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", R);
      }
    }).catch((y) => {
    });
  } catch (y) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", y);
  }
  try {
    z.classList.add("nimbi-mount");
  } catch (y) {
    console.warn("[nimbi-cms] mount element setup failed", y);
  }
  const V = document.createElement("section");
  V.className = "section";
  const ie = document.createElement("div");
  ie.className = "container nimbi-cms";
  const J = document.createElement("div");
  J.className = "columns";
  const W = document.createElement("div");
  W.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", W.setAttribute("role", "navigation");
  try {
    const y = typeof wt == "function" ? wt("navigation") : null;
    y && W.setAttribute("aria-label", y);
  } catch (y) {
    console.warn("[nimbi-cms] set nav aria-label failed", y);
  }
  J.appendChild(W);
  const X = document.createElement("main");
  X.className = "column nimbi-content", X.setAttribute("role", "main"), J.appendChild(X), ie.appendChild(J), V.appendChild(ie);
  const D = W, he = X;
  z.appendChild(V);
  let F = null;
  try {
    F = z.querySelector(".nimbi-overlay"), F || (F = document.createElement("div"), F.className = "nimbi-overlay", z.appendChild(F));
  } catch (y) {
    F = null, console.warn("[nimbi-cms] mount overlay setup failed", y);
  }
  const S = location.pathname || "/", ne = S.endsWith("/") ? S : S.substring(0, S.lastIndexOf("/") + 1);
  try {
    xn = document.title || "";
  } catch (y) {
    xn = "", console.warn("[nimbi-cms] read initial document title failed", y);
  }
  let Q = r;
  (Q === "." || Q === "./") && (Q = ""), Q.startsWith("./") && (Q = Q.slice(2)), Q.startsWith("/") && (Q = Q.slice(1)), Q !== "" && !Q.endsWith("/") && (Q = Q + "/");
  const v = new URL(ne + Q, location.origin).toString();
  try {
    Promise.resolve().then(() => Zt).then((y) => {
      try {
        y && typeof y.setHomePage == "function" && y.setHomePage(k);
      } catch (R) {
        console.warn("[nimbi-cms] setHomePage failed", R);
      }
    }).catch((y) => {
    });
  } catch (y) {
    console.warn("[nimbi-cms] setHomePage dynamic import failed", y);
  }
  p && await Nr(p, ne), b && Array.isArray(b) && Ur(b), f && Or(f);
  const _ = go({ contentWrap: he, navWrap: D, container: ie, mountOverlay: F, t: wt, contentBase: v, homePage: k, initialDocumentTitle: xn, runHooks: lr });
  if (typeof d == "number" && d >= 0 && typeof pr == "function" && pr(d * 60 * 1e3), typeof g == "number" && g >= 0 && typeof fr == "function" && fr(g), w && Array.isArray(w) && w.length)
    try {
      w.forEach((y) => {
        typeof y == "object" && Da && typeof Cn == "function" && Cn(y);
      });
    } catch (y) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", y);
    }
  try {
    typeof i == "number" && Promise.resolve().then(() => Zt).then(({ setDefaultCrawlMaxQueue: y }) => {
      try {
        y(i);
      } catch (R) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", R);
      }
    });
  } catch (y) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", y);
  }
  try {
    Yt(v);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    vn(E);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    Yt(v);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    vn(E);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    await ve(k, v);
  } catch (y) {
    throw k === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${k} not found at ${v}${k}: ${y.message}`);
  }
  xs(c), await ks(h, ne);
  try {
    const y = document.createElement("header");
    y.className = "nimbi-site-navbar", z.insertBefore(y, V);
    const R = await ve("_navigation.md", v), P = await nn(R.raw || ""), { navbar: T, linkEls: O } = await to(y, ie, P.html || "", v, k, wt, _.renderByQuery, Z, l, o, u, I);
    try {
      await lr("onNavBuild", { navWrap: D, navbar: T, linkEls: O, contentBase: v });
    } catch (B) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", B);
    }
    try {
      const B = () => {
        const ce = y && y.getBoundingClientRect && Math.round(y.getBoundingClientRect().height) || y && y.offsetHeight || 0;
        if (ce > 0) {
          try {
            z.style.setProperty("--nimbi-site-navbar-height", `${ce}px`);
          } catch (ge) {
            console.warn("[nimbi-cms] set CSS var failed", ge);
          }
          try {
            ie.style.paddingTop = "";
          } catch (ge) {
            console.warn("[nimbi-cms] set container paddingTop failed", ge);
          }
          try {
            const ge = z && z.getBoundingClientRect && Math.round(z.getBoundingClientRect().height) || z && z.clientHeight || 0;
            if (ge > 0) {
              const Ue = Math.max(0, ge - ce);
              try {
                ie.style.setProperty("--nimbi-cms-height", `${Ue}px`);
              } catch (Pe) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Pe);
              }
            } else
              try {
                ie.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
              } catch (Ue) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ue);
              }
          } catch (ge) {
            console.warn("[nimbi-cms] compute container height failed", ge);
          }
          try {
            y.style.setProperty("--nimbi-site-navbar-height", `${ce}px`);
          } catch (ge) {
            console.warn("[nimbi-cms] set navbar CSS var failed", ge);
          }
        }
      };
      B();
      try {
        if (typeof ResizeObserver < "u") {
          const ce = new ResizeObserver(() => B());
          try {
            ce.observe(y);
          } catch (ge) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", ge);
          }
        }
      } catch (ce) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", ce);
      }
    } catch (B) {
      console.warn("[nimbi-cms] compute navbar height failed", B);
    }
  } catch (y) {
    console.warn("[nimbi-cms] build navigation failed", y);
  }
  await _.renderByQuery();
  try {
    Promise.resolve().then(() => yo).then(({ getVersion: y }) => {
      typeof y == "function" && y().then((R) => {
        try {
          const P = R || "0.0.0";
          try {
            const T = (O) => {
              const B = document.createElement("a");
              B.className = "nimbi-version-label tag is-small", B.textContent = `Ninbi CMS v. ${P}`, B.href = O || "#", B.target = "_blank", B.rel = "noopener noreferrer nofollow", B.setAttribute("aria-label", `Ninbi CMS version ${P}`);
              try {
                zr(B);
              } catch {
              }
              try {
                z.appendChild(B);
              } catch (ce) {
                console.warn("[nimbi-cms] append version label failed", ce);
              }
            };
            (async () => {
              try {
                const O = await Promise.resolve().then(() => $i).catch(() => null), B = O && (O.default || O);
                let ce = null;
                B && (B.homepage && typeof B.homepage == "string" ? ce = B.homepage : B.repository && (typeof B.repository == "string" ? ce = B.repository : B.repository.url && typeof B.repository.url == "string" && (ce = B.repository.url)));
                try {
                  ce && new URL(ce);
                } catch {
                  ce = null;
                }
                T(ce || "#");
              } catch {
                T("#");
              }
            })();
          } catch (T) {
            console.warn("[nimbi-cms] building version label failed", T);
          }
        } catch (P) {
          console.warn("[nimbi-cms] building version label failed", P);
        }
      }).catch((R) => {
        console.warn("[nimbi-cms] getVersion() failed", R);
      });
    }).catch((y) => {
      console.warn("[nimbi-cms] import version module failed", y);
    });
  } catch (y) {
    console.warn("[nimbi-cms] version label setup failed", y);
  }
}
async function bo() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => $i);
    } catch {
      try {
        if (typeof fetch == "function" && typeof location < "u") {
          const s = new URL("../package.json", location.href).toString(), r = await fetch(s);
          r && r.ok ? t = { default: await r.json() } : t = null;
        } else
          t = null;
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
const yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: bo
}, Symbol.toStringTag, { value: "Module" })), di = "nimbi-cms", fi = "0.1.0", pi = { type: "git", url: "git+https://github.com/AbelVM/nimbiCMS.git" }, gi = "https://abelvm.github.io/nimbiCMS/", mi = "Lightweight CMS client for static sites with Bulma UI and search/indexing features", wi = ["cms", "static", "bulma", "search", "markdown", "nimbi"], bi = "Abel Vázquez Montoro", yi = "MIT", ki = { url: "https://github.com/AbelVM/nimbiCMS/issues" }, xi = { node: ">=16" }, Si = "module", vi = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", prepare: "npm run build:lib && npm run gen-dts", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, Ai = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, Ei = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, Ri = "dist/nimbi-cms.cjs.js", Li = "dist/nimbi-cms.es.js", Ci = "src/index.d.ts", Ti = "dist/nimbi-cms.js", Mi = ["dist", "src/index.d.ts"], _i = { access: "public" }, ko = {
  name: di,
  version: fi,
  repository: pi,
  homepage: gi,
  private: !0,
  description: mi,
  keywords: wi,
  author: bi,
  license: yi,
  bugs: ki,
  engines: xi,
  type: Si,
  scripts: vi,
  dependencies: Ai,
  devDependencies: Ei,
  main: Ri,
  module: Li,
  types: Ci,
  unpkg: Ti,
  files: Mi,
  publishConfig: _i
}, $i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  author: bi,
  bugs: ki,
  default: ko,
  dependencies: Ai,
  description: mi,
  devDependencies: Ei,
  engines: xi,
  files: Mi,
  homepage: gi,
  keywords: wi,
  license: yi,
  main: Ri,
  module: Li,
  name: di,
  publishConfig: _i,
  repository: pi,
  scripts: vi,
  type: Si,
  types: Ci,
  unpkg: Ti,
  version: fi
}, Symbol.toStringTag, { value: "Module" }));
export {
  Pr as BAD_LANGUAGES,
  re as SUPPORTED_HLJS_MAP,
  Ao as _clearHooks,
  _n as addHook,
  Lo as default,
  ks as ensureBulma,
  bo as getVersion,
  Lo as initCMS,
  Nr as loadL10nFile,
  Ir as loadSupportedLanguages,
  bs as observeCodeBlocks,
  So as onNavBuild,
  xo as onPageLoad,
  Lt as registerLanguage,
  lr as runHooks,
  Eo as setHighlightTheme,
  Or as setLang,
  xs as setStyle,
  Ro as setThemeVars,
  wt as t,
  vo as transformHtml
};
