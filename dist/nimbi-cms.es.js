const xt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Tn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(xt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  xt[t].push(e);
}
function al(t) {
  Tn("onPageLoad", t);
}
function ll(t) {
  Tn("onNavBuild", t);
}
function ol(t) {
  Tn("transformHtml", t);
}
async function ir(t, e) {
  const r = xt[t] || [];
  for (const s of r)
    try {
      await s(e);
    } catch (n) {
      console.warn("[nimbi-cms] runHooks callback failed", n);
    }
}
function cl() {
  Object.keys(xt).forEach((t) => {
    xt[t].length = 0;
  });
}
function Cr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var cn, sr;
function rs() {
  if (sr) return cn;
  sr = 1;
  function t(g) {
    return g instanceof Map ? g.clear = g.delete = g.set = function() {
      throw new Error("map is read-only");
    } : g instanceof Set && (g.add = g.clear = g.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(g), Object.getOwnPropertyNames(g).forEach((S) => {
      const L = g[S], F = typeof L;
      (F === "object" || F === "function") && !Object.isFrozen(L) && t(L);
    }), g;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(S) {
      S.data === void 0 && (S.data = {}), this.data = S.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function r(g) {
    return g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(g, ...S) {
    const L = /* @__PURE__ */ Object.create(null);
    for (const F in g)
      L[F] = g[F];
    return S.forEach(function(F) {
      for (const he in F)
        L[he] = F[he];
    }), /** @type {T} */
    L;
  }
  const n = "</span>", i = (g) => !!g.scope, a = (g, { prefix: S }) => {
    if (g.startsWith("language:"))
      return g.replace("language:", "language-");
    if (g.includes(".")) {
      const L = g.split(".");
      return [
        `${S}${L.shift()}`,
        ...L.map((F, he) => `${F}${"_".repeat(he + 1)}`)
      ].join(" ");
    }
    return `${S}${g}`;
  };
  class u {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(S, L) {
      this.buffer = "", this.classPrefix = L.classPrefix, S.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(S) {
      this.buffer += r(S);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(S) {
      if (!i(S)) return;
      const L = a(
        S.scope,
        { prefix: this.classPrefix }
      );
      this.span(L);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(S) {
      i(S) && (this.buffer += n);
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
    span(S) {
      this.buffer += `<span class="${S}">`;
    }
  }
  const l = (g = {}) => {
    const S = { children: [] };
    return Object.assign(S, g), S;
  };
  class o {
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
    add(S) {
      this.top.children.push(S);
    }
    /** @param {string} scope */
    openNode(S) {
      const L = l({ scope: S });
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
    walk(S) {
      return this.constructor._walk(S, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(S, L) {
      return typeof L == "string" ? S.addText(L) : L.children && (S.openNode(L), L.children.forEach((F) => this._walk(S, F)), S.closeNode(L)), S;
    }
    /**
     * @param {Node} node
     */
    static _collapse(S) {
      typeof S != "string" && S.children && (S.children.every((L) => typeof L == "string") ? S.children = [S.children.join("")] : S.children.forEach((L) => {
        o._collapse(L);
      }));
    }
  }
  class c extends o {
    /**
     * @param {*} options
     */
    constructor(S) {
      super(), this.options = S;
    }
    /**
     * @param {string} text
     */
    addText(S) {
      S !== "" && this.add(S);
    }
    /** @param {string} scope */
    startScope(S) {
      this.openNode(S);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(S, L) {
      const F = S.root;
      L && (F.scope = `language:${L}`), this.add(F);
    }
    toHTML() {
      return new u(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(g) {
    return g ? typeof g == "string" ? g : g.source : null;
  }
  function f(g) {
    return m("(?=", g, ")");
  }
  function p(g) {
    return m("(?:", g, ")*");
  }
  function d(g) {
    return m("(?:", g, ")?");
  }
  function m(...g) {
    return g.map((L) => h(L)).join("");
  }
  function w(g) {
    const S = g[g.length - 1];
    return typeof S == "object" && S.constructor === Object ? (g.splice(g.length - 1, 1), S) : {};
  }
  function y(...g) {
    return "(" + (w(g).capture ? "" : "?:") + g.map((F) => h(F)).join("|") + ")";
  }
  function x(g) {
    return new RegExp(g.toString() + "|").exec("").length - 1;
  }
  function B(g, S) {
    const L = g && g.exec(S);
    return L && L.index === 0;
  }
  const I = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function A(g, { joinWith: S }) {
    let L = 0;
    return g.map((F) => {
      L += 1;
      const he = L;
      let de = h(F), N = "";
      for (; de.length > 0; ) {
        const z = I.exec(de);
        if (!z) {
          N += de;
          break;
        }
        N += de.substring(0, z.index), de = de.substring(z.index + z[0].length), z[0][0] === "\\" && z[1] ? N += "\\" + String(Number(z[1]) + he) : (N += z[0], z[0] === "(" && L++);
      }
      return N;
    }).map((F) => `(${F})`).join(S);
  }
  const q = /\b\B/, O = "[a-zA-Z]\\w*", G = "[a-zA-Z_]\\w*", Y = "\\b\\d+(\\.\\d+)?", te = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", P = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", $ = (g = {}) => {
    const S = /^#![ ]*\//;
    return g.binary && (g.begin = m(
      S,
      /.*\b/,
      g.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: S,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (L, F) => {
        L.index !== 0 && F.ignoreMatch();
      }
    }, g);
  }, C = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, v = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [C]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [C]
  }, E = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, M = function(g, S, L = {}) {
    const F = s(
      {
        scope: "comment",
        begin: g,
        end: S,
        contains: []
      },
      L
    );
    F.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const he = y(
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
    return F.contains.push(
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
          he,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), F;
  }, k = M("//", "$"), Q = M("/\\*", "\\*/"), ue = M("#", "$"), oe = {
    scope: "number",
    begin: Y,
    relevance: 0
  }, Le = {
    scope: "number",
    begin: te,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: P,
    relevance: 0
  }, Ae = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      C,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [C]
      }
    ]
  }, fe = {
    scope: "title",
    begin: O,
    relevance: 0
  }, Ie = {
    scope: "title",
    begin: G,
    relevance: 0
  }, Xe = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + G,
    relevance: 0
  };
  var Lt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: v,
    BACKSLASH_ESCAPE: C,
    BINARY_NUMBER_MODE: ve,
    BINARY_NUMBER_RE: P,
    COMMENT: M,
    C_BLOCK_COMMENT_MODE: Q,
    C_LINE_COMMENT_MODE: k,
    C_NUMBER_MODE: Le,
    C_NUMBER_RE: te,
    END_SAME_AS_BEGIN: function(g) {
      return Object.assign(
        g,
        {
          /** @type {ModeCallback} */
          "on:begin": (S, L) => {
            L.data._beginMatch = S[1];
          },
          /** @type {ModeCallback} */
          "on:end": (S, L) => {
            L.data._beginMatch !== S[1] && L.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ue,
    IDENT_RE: O,
    MATCH_NOTHING_RE: q,
    METHOD_GUARD: Xe,
    NUMBER_MODE: oe,
    NUMBER_RE: Y,
    PHRASAL_WORDS_MODE: E,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: Ae,
    RE_STARTERS_RE: T,
    SHEBANG: $,
    TITLE_MODE: fe,
    UNDERSCORE_IDENT_RE: G,
    UNDERSCORE_TITLE_MODE: Ie
  });
  function yi(g, S) {
    g.input[g.index - 1] === "." && S.ignoreMatch();
  }
  function ki(g, S) {
    g.className !== void 0 && (g.scope = g.className, delete g.className);
  }
  function xi(g, S) {
    S && g.beginKeywords && (g.begin = "\\b(" + g.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", g.__beforeBegin = yi, g.keywords = g.keywords || g.beginKeywords, delete g.beginKeywords, g.relevance === void 0 && (g.relevance = 0));
  }
  function Si(g, S) {
    Array.isArray(g.illegal) && (g.illegal = y(...g.illegal));
  }
  function vi(g, S) {
    if (g.match) {
      if (g.begin || g.end) throw new Error("begin & end are not supported with match");
      g.begin = g.match, delete g.match;
    }
  }
  function Ai(g, S) {
    g.relevance === void 0 && (g.relevance = 1);
  }
  const Ei = (g, S) => {
    if (!g.beforeMatch) return;
    if (g.starts) throw new Error("beforeMatch cannot be used with starts");
    const L = Object.assign({}, g);
    Object.keys(g).forEach((F) => {
      delete g[F];
    }), g.keywords = L.keywords, g.begin = m(L.beforeMatch, f(L.begin)), g.starts = {
      relevance: 0,
      contains: [
        Object.assign(L, { endsParent: !0 })
      ]
    }, g.relevance = 0, delete L.beforeMatch;
  }, Ri = [
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
  ], Ti = "keyword";
  function qn(g, S, L = Ti) {
    const F = /* @__PURE__ */ Object.create(null);
    return typeof g == "string" ? he(L, g.split(" ")) : Array.isArray(g) ? he(L, g) : Object.keys(g).forEach(function(de) {
      Object.assign(
        F,
        qn(g[de], S, de)
      );
    }), F;
    function he(de, N) {
      S && (N = N.map((z) => z.toLowerCase())), N.forEach(function(z) {
        const j = z.split("|");
        F[j[0]] = [de, Ci(j[0], j[1])];
      });
    }
  }
  function Ci(g, S) {
    return S ? Number(S) : Li(g) ? 0 : 1;
  }
  function Li(g) {
    return Ri.includes(g.toLowerCase());
  }
  const jn = {}, Ke = (g) => {
    console.error(g);
  }, Wn = (g, ...S) => {
    console.log(`WARN: ${g}`, ...S);
  }, tt = (g, S) => {
    jn[`${g}/${S}`] || (console.log(`Deprecated as of ${g}. ${S}`), jn[`${g}/${S}`] = !0);
  }, _t = new Error();
  function Fn(g, S, { key: L }) {
    let F = 0;
    const he = g[L], de = {}, N = {};
    for (let z = 1; z <= S.length; z++)
      N[z + F] = he[z], de[z + F] = !0, F += x(S[z - 1]);
    g[L] = N, g[L]._emit = de, g[L]._multi = !0;
  }
  function _i(g) {
    if (Array.isArray(g.begin)) {
      if (g.skip || g.excludeBegin || g.returnBegin)
        throw Ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), _t;
      if (typeof g.beginScope != "object" || g.beginScope === null)
        throw Ke("beginScope must be object"), _t;
      Fn(g, g.begin, { key: "beginScope" }), g.begin = A(g.begin, { joinWith: "" });
    }
  }
  function Mi(g) {
    if (Array.isArray(g.end)) {
      if (g.skip || g.excludeEnd || g.returnEnd)
        throw Ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), _t;
      if (typeof g.endScope != "object" || g.endScope === null)
        throw Ke("endScope must be object"), _t;
      Fn(g, g.end, { key: "endScope" }), g.end = A(g.end, { joinWith: "" });
    }
  }
  function $i(g) {
    g.scope && typeof g.scope == "object" && g.scope !== null && (g.beginScope = g.scope, delete g.scope);
  }
  function Pi(g) {
    $i(g), typeof g.beginScope == "string" && (g.beginScope = { _wrap: g.beginScope }), typeof g.endScope == "string" && (g.endScope = { _wrap: g.endScope }), _i(g), Mi(g);
  }
  function Ii(g) {
    function S(N, z) {
      return new RegExp(
        h(N),
        "m" + (g.case_insensitive ? "i" : "") + (g.unicodeRegex ? "u" : "") + (z ? "g" : "")
      );
    }
    class L {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(z, j) {
        j.position = this.position++, this.matchIndexes[this.matchAt] = j, this.regexes.push([j, z]), this.matchAt += x(z) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const z = this.regexes.map((j) => j[1]);
        this.matcherRe = S(A(z, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(z) {
        this.matcherRe.lastIndex = this.lastIndex;
        const j = this.matcherRe.exec(z);
        if (!j)
          return null;
        const me = j.findIndex((lt, nn) => nn > 0 && lt !== void 0), pe = this.matchIndexes[me];
        return j.splice(0, me), Object.assign(j, pe);
      }
    }
    class F {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(z) {
        if (this.multiRegexes[z]) return this.multiRegexes[z];
        const j = new L();
        return this.rules.slice(z).forEach(([me, pe]) => j.addRule(me, pe)), j.compile(), this.multiRegexes[z] = j, j;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(z, j) {
        this.rules.push([z, j]), j.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(z) {
        const j = this.getMatcher(this.regexIndex);
        j.lastIndex = this.lastIndex;
        let me = j.exec(z);
        if (this.resumingScanAtSamePosition() && !(me && me.index === this.lastIndex)) {
          const pe = this.getMatcher(0);
          pe.lastIndex = this.lastIndex + 1, me = pe.exec(z);
        }
        return me && (this.regexIndex += me.position + 1, this.regexIndex === this.count && this.considerAll()), me;
      }
    }
    function he(N) {
      const z = new F();
      return N.contains.forEach((j) => z.addRule(j.begin, { rule: j, type: "begin" })), N.terminatorEnd && z.addRule(N.terminatorEnd, { type: "end" }), N.illegal && z.addRule(N.illegal, { type: "illegal" }), z;
    }
    function de(N, z) {
      const j = (
        /** @type CompiledMode */
        N
      );
      if (N.isCompiled) return j;
      [
        ki,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        vi,
        Pi,
        Ei
      ].forEach((pe) => pe(N, z)), g.compilerExtensions.forEach((pe) => pe(N, z)), N.__beforeBegin = null, [
        xi,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Si,
        // default to 1 relevance if not specified
        Ai
      ].forEach((pe) => pe(N, z)), N.isCompiled = !0;
      let me = null;
      return typeof N.keywords == "object" && N.keywords.$pattern && (N.keywords = Object.assign({}, N.keywords), me = N.keywords.$pattern, delete N.keywords.$pattern), me = me || /\w+/, N.keywords && (N.keywords = qn(N.keywords, g.case_insensitive)), j.keywordPatternRe = S(me, !0), z && (N.begin || (N.begin = /\B|\b/), j.beginRe = S(j.begin), !N.end && !N.endsWithParent && (N.end = /\B|\b/), N.end && (j.endRe = S(j.end)), j.terminatorEnd = h(j.end) || "", N.endsWithParent && z.terminatorEnd && (j.terminatorEnd += (N.end ? "|" : "") + z.terminatorEnd)), N.illegal && (j.illegalRe = S(
        /** @type {RegExp | string} */
        N.illegal
      )), N.contains || (N.contains = []), N.contains = [].concat(...N.contains.map(function(pe) {
        return zi(pe === "self" ? N : pe);
      })), N.contains.forEach(function(pe) {
        de(
          /** @type Mode */
          pe,
          j
        );
      }), N.starts && de(N.starts, z), j.matcher = he(j), j;
    }
    if (g.compilerExtensions || (g.compilerExtensions = []), g.contains && g.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return g.classNameAliases = s(g.classNameAliases || {}), de(
      /** @type Mode */
      g
    );
  }
  function Zn(g) {
    return g ? g.endsWithParent || Zn(g.starts) : !1;
  }
  function zi(g) {
    return g.variants && !g.cachedVariants && (g.cachedVariants = g.variants.map(function(S) {
      return s(g, { variants: null }, S);
    })), g.cachedVariants ? g.cachedVariants : Zn(g) ? s(g, { starts: g.starts ? s(g.starts) : null }) : Object.isFrozen(g) ? s(g) : g;
  }
  var Bi = "11.11.1";
  class Oi extends Error {
    constructor(S, L) {
      super(S), this.name = "HTMLInjectionError", this.html = L;
    }
  }
  const tn = r, Gn = s, Qn = /* @__PURE__ */ Symbol("nomatch"), Ni = 7, Xn = function(g) {
    const S = /* @__PURE__ */ Object.create(null), L = /* @__PURE__ */ Object.create(null), F = [];
    let he = !0;
    const de = "Could not find the language '{}', did you forget to load/include a language module?", N = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
    function j(R) {
      return z.noHighlightRe.test(R);
    }
    function me(R) {
      let H = R.className + " ";
      H += R.parentNode ? R.parentNode.className : "";
      const J = z.languageDetectRe.exec(H);
      if (J) {
        const se = qe(J[1]);
        return se || (Wn(de.replace("{}", J[1])), Wn("Falling back to no-highlight mode for this block.", R)), se ? J[1] : "no-highlight";
      }
      return H.split(/\s+/).find((se) => j(se) || qe(se));
    }
    function pe(R, H, J) {
      let se = "", ge = "";
      typeof H == "object" ? (se = R, J = H.ignoreIllegals, ge = H.language) : (tt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), tt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ge = R, se = H), J === void 0 && (J = !0);
      const Me = {
        code: se,
        language: ge
      };
      $t("before:highlight", Me);
      const je = Me.result ? Me.result : lt(Me.language, Me.code, J);
      return je.code = Me.code, $t("after:highlight", je), je;
    }
    function lt(R, H, J, se) {
      const ge = /* @__PURE__ */ Object.create(null);
      function Me(_, D) {
        return _.keywords[D];
      }
      function je() {
        if (!Z.keywords) {
          we.addText(ae);
          return;
        }
        let _ = 0;
        Z.keywordPatternRe.lastIndex = 0;
        let D = Z.keywordPatternRe.exec(ae), X = "";
        for (; D; ) {
          X += ae.substring(_, D.index);
          const ie = Be.case_insensitive ? D[0].toLowerCase() : D[0], ye = Me(Z, ie);
          if (ye) {
            const [De, ts] = ye;
            if (we.addText(X), X = "", ge[ie] = (ge[ie] || 0) + 1, ge[ie] <= Ni && (zt += ts), De.startsWith("_"))
              X += D[0];
            else {
              const ns = Be.classNameAliases[De] || De;
              ze(D[0], ns);
            }
          } else
            X += D[0];
          _ = Z.keywordPatternRe.lastIndex, D = Z.keywordPatternRe.exec(ae);
        }
        X += ae.substring(_), we.addText(X);
      }
      function Pt() {
        if (ae === "") return;
        let _ = null;
        if (typeof Z.subLanguage == "string") {
          if (!S[Z.subLanguage]) {
            we.addText(ae);
            return;
          }
          _ = lt(Z.subLanguage, ae, !0, rr[Z.subLanguage]), rr[Z.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = rn(ae, Z.subLanguage.length ? Z.subLanguage : null);
        Z.relevance > 0 && (zt += _.relevance), we.__addSublanguage(_._emitter, _.language);
      }
      function Ee() {
        Z.subLanguage != null ? Pt() : je(), ae = "";
      }
      function ze(_, D) {
        _ !== "" && (we.startScope(D), we.addText(_), we.endScope());
      }
      function Jn(_, D) {
        let X = 1;
        const ie = D.length - 1;
        for (; X <= ie; ) {
          if (!_._emit[X]) {
            X++;
            continue;
          }
          const ye = Be.classNameAliases[_[X]] || _[X], De = D[X];
          ye ? ze(De, ye) : (ae = De, je(), ae = ""), X++;
        }
      }
      function er(_, D) {
        return _.scope && typeof _.scope == "string" && we.openNode(Be.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (ze(ae, Be.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), ae = "") : _.beginScope._multi && (Jn(_.beginScope, D), ae = "")), Z = Object.create(_, { parent: { value: Z } }), Z;
      }
      function tr(_, D, X) {
        let ie = B(_.endRe, X);
        if (ie) {
          if (_["on:end"]) {
            const ye = new e(_);
            _["on:end"](D, ye), ye.isMatchIgnored && (ie = !1);
          }
          if (ie) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return tr(_.parent, D, X);
      }
      function Ki(_) {
        return Z.matcher.regexIndex === 0 ? (ae += _[0], 1) : (on = !0, 0);
      }
      function Yi(_) {
        const D = _[0], X = _.rule, ie = new e(X), ye = [X.__beforeBegin, X["on:begin"]];
        for (const De of ye)
          if (De && (De(_, ie), ie.isMatchIgnored))
            return Ki(D);
        return X.skip ? ae += D : (X.excludeBegin && (ae += D), Ee(), !X.returnBegin && !X.excludeBegin && (ae = D)), er(X, _), X.returnBegin ? 0 : D.length;
      }
      function Vi(_) {
        const D = _[0], X = H.substring(_.index), ie = tr(Z, _, X);
        if (!ie)
          return Qn;
        const ye = Z;
        Z.endScope && Z.endScope._wrap ? (Ee(), ze(D, Z.endScope._wrap)) : Z.endScope && Z.endScope._multi ? (Ee(), Jn(Z.endScope, _)) : ye.skip ? ae += D : (ye.returnEnd || ye.excludeEnd || (ae += D), Ee(), ye.excludeEnd && (ae = D));
        do
          Z.scope && we.closeNode(), !Z.skip && !Z.subLanguage && (zt += Z.relevance), Z = Z.parent;
        while (Z !== ie.parent);
        return ie.starts && er(ie.starts, _), ye.returnEnd ? 0 : D.length;
      }
      function Ji() {
        const _ = [];
        for (let D = Z; D !== Be; D = D.parent)
          D.scope && _.unshift(D.scope);
        _.forEach((D) => we.openNode(D));
      }
      let It = {};
      function nr(_, D) {
        const X = D && D[0];
        if (ae += _, X == null)
          return Ee(), 0;
        if (It.type === "begin" && D.type === "end" && It.index === D.index && X === "") {
          if (ae += H.slice(D.index, D.index + 1), !he) {
            const ie = new Error(`0 width match regex (${R})`);
            throw ie.languageName = R, ie.badRule = It.rule, ie;
          }
          return 1;
        }
        if (It = D, D.type === "begin")
          return Yi(D);
        if (D.type === "illegal" && !J) {
          const ie = new Error('Illegal lexeme "' + X + '" for mode "' + (Z.scope || "<unnamed>") + '"');
          throw ie.mode = Z, ie;
        } else if (D.type === "end") {
          const ie = Vi(D);
          if (ie !== Qn)
            return ie;
        }
        if (D.type === "illegal" && X === "")
          return ae += `
`, 1;
        if (ln > 1e5 && ln > D.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ae += X, X.length;
      }
      const Be = qe(R);
      if (!Be)
        throw Ke(de.replace("{}", R)), new Error('Unknown language: "' + R + '"');
      const es = Ii(Be);
      let an = "", Z = se || es;
      const rr = {}, we = new z.__emitter(z);
      Ji();
      let ae = "", zt = 0, Ye = 0, ln = 0, on = !1;
      try {
        if (Be.__emitTokens)
          Be.__emitTokens(H, we);
        else {
          for (Z.matcher.considerAll(); ; ) {
            ln++, on ? on = !1 : Z.matcher.considerAll(), Z.matcher.lastIndex = Ye;
            const _ = Z.matcher.exec(H);
            if (!_) break;
            const D = H.substring(Ye, _.index), X = nr(D, _);
            Ye = _.index + X;
          }
          nr(H.substring(Ye));
        }
        return we.finalize(), an = we.toHTML(), {
          language: R,
          value: an,
          relevance: zt,
          illegal: !1,
          _emitter: we,
          _top: Z
        };
      } catch (_) {
        if (_.message && _.message.includes("Illegal"))
          return {
            language: R,
            value: tn(H),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: _.message,
              index: Ye,
              context: H.slice(Ye - 100, Ye + 100),
              mode: _.mode,
              resultSoFar: an
            },
            _emitter: we
          };
        if (he)
          return {
            language: R,
            value: tn(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: we,
            _top: Z
          };
        throw _;
      }
    }
    function nn(R) {
      const H = {
        value: tn(R),
        illegal: !1,
        relevance: 0,
        _top: N,
        _emitter: new z.__emitter(z)
      };
      return H._emitter.addText(R), H;
    }
    function rn(R, H) {
      H = H || z.languages || Object.keys(S);
      const J = nn(R), se = H.filter(qe).filter(Vn).map(
        (Ee) => lt(Ee, R, !1)
      );
      se.unshift(J);
      const ge = se.sort((Ee, ze) => {
        if (Ee.relevance !== ze.relevance) return ze.relevance - Ee.relevance;
        if (Ee.language && ze.language) {
          if (qe(Ee.language).supersetOf === ze.language)
            return 1;
          if (qe(ze.language).supersetOf === Ee.language)
            return -1;
        }
        return 0;
      }), [Me, je] = ge, Pt = Me;
      return Pt.secondBest = je, Pt;
    }
    function Di(R, H, J) {
      const se = H && L[H] || J;
      R.classList.add("hljs"), R.classList.add(`language-${se}`);
    }
    function sn(R) {
      let H = null;
      const J = me(R);
      if (j(J)) return;
      if ($t(
        "before:highlightElement",
        { el: R, language: J }
      ), R.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", R);
        return;
      }
      if (R.children.length > 0 && (z.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(R)), z.throwUnescapedHTML))
        throw new Oi(
          "One of your code blocks includes unescaped HTML.",
          R.innerHTML
        );
      H = R;
      const se = H.textContent, ge = J ? pe(se, { language: J, ignoreIllegals: !0 }) : rn(se);
      R.innerHTML = ge.value, R.dataset.highlighted = "yes", Di(R, J, ge.language), R.result = {
        language: ge.language,
        // TODO: remove with version 11.0
        re: ge.relevance,
        relevance: ge.relevance
      }, ge.secondBest && (R.secondBest = {
        language: ge.secondBest.language,
        relevance: ge.secondBest.relevance
      }), $t("after:highlightElement", { el: R, result: ge, text: se });
    }
    function Hi(R) {
      z = Gn(z, R);
    }
    const Ui = () => {
      Mt(), tt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function qi() {
      Mt(), tt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Kn = !1;
    function Mt() {
      function R() {
        Mt();
      }
      if (document.readyState === "loading") {
        Kn || window.addEventListener("DOMContentLoaded", R, !1), Kn = !0;
        return;
      }
      document.querySelectorAll(z.cssSelector).forEach(sn);
    }
    function ji(R, H) {
      let J = null;
      try {
        J = H(g);
      } catch (se) {
        if (Ke("Language definition for '{}' could not be registered.".replace("{}", R)), he)
          Ke(se);
        else
          throw se;
        J = N;
      }
      J.name || (J.name = R), S[R] = J, J.rawDefinition = H.bind(null, g), J.aliases && Yn(J.aliases, { languageName: R });
    }
    function Wi(R) {
      delete S[R];
      for (const H of Object.keys(L))
        L[H] === R && delete L[H];
    }
    function Fi() {
      return Object.keys(S);
    }
    function qe(R) {
      return R = (R || "").toLowerCase(), S[R] || S[L[R]];
    }
    function Yn(R, { languageName: H }) {
      typeof R == "string" && (R = [R]), R.forEach((J) => {
        L[J.toLowerCase()] = H;
      });
    }
    function Vn(R) {
      const H = qe(R);
      return H && !H.disableAutodetect;
    }
    function Zi(R) {
      R["before:highlightBlock"] && !R["before:highlightElement"] && (R["before:highlightElement"] = (H) => {
        R["before:highlightBlock"](
          Object.assign({ block: H.el }, H)
        );
      }), R["after:highlightBlock"] && !R["after:highlightElement"] && (R["after:highlightElement"] = (H) => {
        R["after:highlightBlock"](
          Object.assign({ block: H.el }, H)
        );
      });
    }
    function Gi(R) {
      Zi(R), F.push(R);
    }
    function Qi(R) {
      const H = F.indexOf(R);
      H !== -1 && F.splice(H, 1);
    }
    function $t(R, H) {
      const J = R;
      F.forEach(function(se) {
        se[J] && se[J](H);
      });
    }
    function Xi(R) {
      return tt("10.7.0", "highlightBlock will be removed entirely in v12.0"), tt("10.7.0", "Please use highlightElement now."), sn(R);
    }
    Object.assign(g, {
      highlight: pe,
      highlightAuto: rn,
      highlightAll: Mt,
      highlightElement: sn,
      // TODO: Remove with v12 API
      highlightBlock: Xi,
      configure: Hi,
      initHighlighting: Ui,
      initHighlightingOnLoad: qi,
      registerLanguage: ji,
      unregisterLanguage: Wi,
      listLanguages: Fi,
      getLanguage: qe,
      registerAliases: Yn,
      autoDetection: Vn,
      inherit: Gn,
      addPlugin: Gi,
      removePlugin: Qi
    }), g.debugMode = function() {
      he = !1;
    }, g.safeMode = function() {
      he = !0;
    }, g.versionString = Bi, g.regex = {
      concat: m,
      lookahead: f,
      either: y,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const R in Lt)
      typeof Lt[R] == "object" && t(Lt[R]);
    return Object.assign(g, Lt), g;
  }, nt = Xn({});
  return nt.newInstance = () => Xn({}), cn = nt, nt.HighlightJS = nt, nt.default = nt, cn;
}
var is = /* @__PURE__ */ rs();
const le = /* @__PURE__ */ Cr(is), V = /* @__PURE__ */ new Map(), ss = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Re = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Re.html = "xml";
Re.xhtml = "xml";
Re.markup = "xml";
const Lr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Ze = null;
const un = /* @__PURE__ */ new Map(), as = 300 * 1e3;
async function _r(t = ss) {
  if (t)
    return Ze || (Ze = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const s = (await e.text()).split(/\r?\n/);
        let n = -1;
        for (let o = 0; o < s.length; o++)
          if (/\|\s*Language\s*\|/i.test(s[o])) {
            n = o;
            break;
          }
        if (n === -1) return;
        const i = s[n].replace(/^\||\|$/g, "").split("|").map((o) => o.trim().toLowerCase());
        let a = i.findIndex((o) => /alias|aliases|equivalent|alt|alternates?/i.test(o));
        a === -1 && (a = 1);
        let u = i.findIndex((o) => /file|filename|module|module name|module-name|short|slug/i.test(o));
        if (u === -1) {
          const o = i.findIndex((c) => /language/i.test(c));
          u = o !== -1 ? o : 0;
        }
        let l = [];
        for (let o = n + 1; o < s.length; o++) {
          const c = s[o].trim();
          if (!c || !c.startsWith("|")) break;
          const h = c.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (h.every((w) => /^-+$/.test(w))) continue;
          const f = h;
          if (!f.length) continue;
          const d = (f[u] || f[0] || "").toString().trim().toLowerCase();
          if (!d || /^-+$/.test(d)) continue;
          V.set(d, d);
          const m = f[a] || "";
          if (m) {
            const w = String(m).split(",").map((y) => y.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const x = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              x && /[a-z0-9]/i.test(x) && (V.set(x, x), l.push(x));
            }
          }
        }
        try {
          const o = [];
          for (const c of l) {
            const h = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? o.push(h) : V.delete(c);
          }
          l = o;
        } catch (o) {
          console.warn("[codeblocksManager] cleanup aliases failed", o);
        }
        try {
          let o = 0;
          for (const c of Array.from(V.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              V.delete(c), o++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const h = c.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = V.get(c);
                V.delete(c), V.set(h, f);
              } else
                V.delete(c), o++;
            }
          }
          for (const [c, h] of Array.from(V.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (V.delete(c), o++);
          try {
            const c = ":---------------------";
            V.has(c) && (V.delete(c), o++);
          } catch (c) {
            console.warn("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(V.keys()).sort();
          } catch (c) {
            console.warn("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (o) {
          console.warn("[codeblocksManager] ignored error", o);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), Ze);
}
const ot = /* @__PURE__ */ new Set();
async function St(t, e) {
  if (Ze || (async () => {
    try {
      await _r();
    } catch (n) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", n);
    }
  })(), Ze)
    try {
      await Ze;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const r = t.toLowerCase();
  if (Lr.has(r)) return !1;
  if (V.size && !V.has(r)) {
    const n = Re;
    if (!n[r] && !n[t])
      return !1;
  }
  if (ot.has(t)) return !0;
  const s = Re;
  try {
    const n = (e || t || "").toString().replace(/\.js$/i, "").trim(), i = (s[t] || t || "").toString(), a = (s[n] || n || "").toString();
    let u = Array.from(new Set([
      i,
      a,
      n,
      t,
      s[n],
      s[t]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    V.size && (u = u.filter((c) => {
      if (V.has(c)) return !0;
      const h = Re[c];
      return !!(h && V.has(h));
    }));
    let l = null, o = null;
    for (const c of u)
      try {
        const h = Date.now();
        let f = un.get(c);
        if (f && f.ok === !1 && h - (f.ts || 0) >= as && (un.delete(c), f = void 0), f) {
          if (f.module)
            l = f.module;
          else if (f.promise)
            try {
              l = await f.promise;
            } catch {
              l = null;
            }
        } else {
          const p = { promise: null, module: null, ok: null, ts: 0 };
          un.set(c, p), p.promise = (async () => {
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
                  const m = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(m);
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
            l = await p.promise, p.module = l, p.ok = !!l, p.ts = Date.now();
          } catch {
            p.module = null, p.ok = !1, p.ts = Date.now(), l = null;
          }
        }
        if (l) {
          const p = l.default || l;
          try {
            const d = V.size && V.get(t) || c || t;
            return le.registerLanguage(d, p), ot.add(d), d !== t && (le.registerLanguage(t, p), ot.add(t)), !0;
          } catch (d) {
            o = d;
          }
        } else
          try {
            if (V.has(c) || V.has(t)) {
              const p = () => ({});
              try {
                le.registerLanguage(c, p), ot.add(c);
              } catch {
              }
              try {
                c !== t && (le.registerLanguage(t, p), ot.add(t));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (h) {
        o = h;
      }
    if (o)
      throw o;
    return !1;
  } catch {
    return !1;
  }
}
let Bt = null;
function ls(t = document) {
  Ze || (async () => {
    try {
      await _r();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = Re, s = Bt || (typeof IntersectionObserver > "u" ? null : (Bt = new IntersectionObserver((i, a) => {
    i.forEach((u) => {
      if (!u.isIntersecting) return;
      const l = u.target;
      try {
        a.unobserve(l);
      } catch (o) {
        console.warn("[codeblocksManager] observer unobserve failed", o);
      }
      (async () => {
        try {
          const o = l.getAttribute && l.getAttribute("class") || l.className || "", c = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const h = (c[1] || "").toLowerCase(), f = e[h] || h, p = V.size && (V.get(f) || V.get(String(f).toLowerCase())) || f;
            try {
              await St(p);
            } catch (d) {
              console.warn("[codeblocksManager] registerLanguage failed", d);
            }
            try {
              le.highlightElement(l);
            } catch (d) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const h = l.textContent || "";
              try {
                if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                  const f = le.highlight(h, { language: "plaintext" });
                  f && f.value && (l.innerHTML = f.value);
                }
              } catch {
                try {
                  le.highlightElement(l);
                } catch (p) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (h) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", h);
            }
        } catch (o) {
          console.warn("[codeblocksManager] observer entry processing failed", o);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Bt)), n = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    n.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", u = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (u && u[1]) {
          const l = (u[1] || "").toLowerCase(), o = e[l] || l, c = V.size && (V.get(o) || V.get(String(o).toLowerCase())) || o;
          try {
            await St(c);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          le.highlightElement(i);
        } catch (l) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
        }
      } catch (a) {
        console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error", a);
      }
    });
    return;
  }
  n.forEach((i) => {
    try {
      s.observe(i);
    } catch (a) {
      console.warn("[codeblocksManager] observe failed", a);
    }
  });
}
function ul(t, { useCdn: e = !0 } = {}) {
  const r = document.querySelector("link[data-hl-theme]");
  r && r.remove();
  let s = t || "monokai";
  if (s === "monokai")
    return;
  if (!e) {
    console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");
    return;
  }
  const n = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`, i = document.createElement("link");
  i.rel = "stylesheet", i.href = n, i.setAttribute("data-hl-theme", s), document.head.appendChild(i);
}
let hn = "light";
function os(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = t, Object.entries(e).forEach(([s, n]) => r.setAttribute(s, n)), document.head.appendChild(r);
}
async function cs(t = "none", e = "/") {
  if (!t || t === "none") return;
  const r = [e + "bulma.css", "/bulma.css"], s = Array.from(new Set(r));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const n of s)
      try {
        const i = await fetch(n, { method: "GET" });
        if (i.ok) {
          const a = await i.text(), u = document.createElement("style");
          u.setAttribute("data-bulma-override", n), u.appendChild(document.createTextNode(`
/* bulma override: ${n} */
` + a)), document.head.appendChild(u);
          return;
        }
      } catch (i) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", i);
      }
    return;
  }
  try {
    const n = String(t).trim();
    if (!n) return;
    const i = `https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;
    os(i, { "data-bulmaswatch-theme": n });
  } catch (n) {
    console.warn("[bulmaManager] ensureBulma failed", n);
  }
}
function us(t) {
  hn = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", hn), hn === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function hl(t) {
  const e = document.documentElement;
  for (const [r, s] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${r}`, s);
    } catch (n) {
      console.warn("[bulmaManager] setThemeVars failed for", r, n);
    }
}
const Mr = {
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
}, st = JSON.parse(JSON.stringify(Mr));
let jt = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  jt = String(t).split("-")[0].toLowerCase();
}
Mr[jt] || (jt = "en");
let Ge = jt;
function dt(t, e = {}) {
  const r = st[Ge] || st.en;
  let s = r && r[t] ? r[t] : st.en[t] || "";
  for (const n of Object.keys(e))
    s = s.replace(new RegExp(`{${n}}`, "g"), String(e[n]));
  return s;
}
async function $r(t, e) {
  if (!t) return;
  let r = t;
  try {
    /^https?:\/\//.test(t) || (r = new URL(t, location.origin + e).toString());
    const s = await fetch(r);
    if (!s.ok) return;
    const n = await s.json();
    for (const i of Object.keys(n || {}))
      st[i] = Object.assign({}, st[i] || {}, n[i]);
  } catch {
  }
}
function Pr(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Ge = st[e] ? e : "en";
}
const hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ge;
  },
  loadL10nFile: $r,
  setLang: Pr,
  t: dt
}, Symbol.toStringTag, { value: "Module" })), ds = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Ir(t, e = "worker") {
  let r = null;
  function s() {
    if (!r)
      try {
        const u = t();
        r = u || null, u && u.addEventListener("error", () => {
          try {
            r === u && (r = null, u.terminate && u.terminate());
          } catch (l) {
            console.warn("[" + e + "] worker termination failed", l);
          }
        });
      } catch (u) {
        r = null, console.warn("[" + e + "] worker init failed", u);
      }
    return r;
  }
  function n() {
    try {
      r && (r.terminate && r.terminate(), r = null);
    } catch (u) {
      console.warn("[" + e + "] worker termination failed", u);
    }
  }
  function i(u, l = 1e3) {
    return new Promise((o, c) => {
      const h = s();
      if (!h) return c(new Error("worker unavailable"));
      const f = String(Math.random());
      u.id = f;
      let p = null;
      const d = () => {
        p && clearTimeout(p), h.removeEventListener("message", m), h.removeEventListener("error", w);
      }, m = (y) => {
        const x = y.data || {};
        x.id === f && (d(), x.error ? c(new Error(x.error)) : o(x.result));
      }, w = (y) => {
        d(), console.warn("[" + e + "] worker error event", y);
        try {
          r === h && (r = null, h.terminate && h.terminate());
        } catch (x) {
          console.warn("[" + e + "] worker termination failed", x);
        }
        c(new Error(y && y.message || "worker error"));
      };
      p = setTimeout(() => {
        d(), console.warn("[" + e + "] worker timed out");
        try {
          r === h && (r = null, h.terminate && h.terminate());
        } catch (y) {
          console.warn("[" + e + "] worker termination on timeout failed", y);
        }
        c(new Error("worker timeout"));
      }, l), h.addEventListener("message", m), h.addEventListener("error", w);
      try {
        h.postMessage(u);
      } catch (y) {
        d(), c(y);
      }
    });
  }
  return { get: s, send: i, terminate: n };
}
function ps(t) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && t) {
      const e = new Blob([t], { type: "application/javascript" }), r = URL.createObjectURL(e);
      return new Worker(r, { type: "module" });
    }
  } catch (e) {
    console.warn("[worker-manager] createWorkerFromRaw failed", e);
  }
  return null;
}
const Ne = /* @__PURE__ */ new Set();
function Cn(t) {
  fs(), Ne.clear();
  for (const e of Te)
    e && Ne.add(e);
  ar(K), ar(U), Cn._refreshed = !0;
}
function ar(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Ne.add(e);
}
function lr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(r, s) {
    return s && Ne.add(s), e.call(this, r, s);
  };
}
let or = !1;
function fs() {
  or || (lr(K), lr(U), or = !0);
}
function zr(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function ce(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function At(t) {
  return String(t || "").replace(/\/+$/, "");
}
function vt(t) {
  return At(t) + "/";
}
function gs(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const r = document.createElement("link");
    r.rel = "preload", r.as = "image", r.href = t, document.head.appendChild(r);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Ot(t, e = 0, r = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const n = t, i = n && n.getBoundingClientRect ? n.getBoundingClientRect() : null, a = 0, u = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = i ? Math.max(a, i.top) : a, c = (i ? Math.min(u, i.bottom) : u) + Number(e || 0);
    let h = 0;
    n && (h = n.clientHeight || (i ? i.height : 0)), h || (h = u - a);
    let f = 0.6;
    try {
      const w = n && window.getComputedStyle ? window.getComputedStyle(n) : null, y = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), x = y ? parseFloat(y) : NaN;
      !Number.isNaN(x) && x > 0 && x <= 1 && (f = x);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(h * f));
    let d = !1, m = null;
    if (s.forEach((w) => {
      try {
        const y = w.getAttribute ? w.getAttribute("loading") : void 0;
        y !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const x = w.getBoundingClientRect ? w.getBoundingClientRect() : null, B = w.src || w.getAttribute && w.getAttribute("src"), I = x && x.height > 1 ? x.height : p, A = x ? x.top : 0, q = A + I, O = !!(x && I > 0 && A <= c && q >= l);
        O && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), gs(B), d = !0), !m && x && x.top <= c && (m = { img: w, src: B, rect: x, beforeLoading: y }), r && console.log("[helpers] setEagerForAboveFoldImages:", {
          src: B,
          rect: x,
          marginPx: e,
          visibleTop: l,
          visibleBottom: c,
          beforeLoading: y,
          isAboveFold: O,
          effectiveHeight: I,
          maxImageHeight: p
        });
      } catch (y) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", y);
      }
    }), !d && m) {
      const { img: w, src: y, rect: x, beforeLoading: B } = m;
      try {
        w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), r && console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):", {
          src: y,
          rect: x,
          marginPx: e,
          visibleTop: l,
          visibleBottom: c,
          beforeLoading: B,
          fallback: !0
        });
      } catch (I) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", I);
      }
    }
  } catch (s) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", s);
  }
}
function Wt(t) {
  try {
    const e = t();
    return e && typeof e.then == "function" ? e.catch((r) => {
      console.warn("[helpers] safe swallowed error", r);
    }) : e;
  } catch (e) {
    console.warn("[helpers] safe swallowed error", e);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Wt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const K = /* @__PURE__ */ new Map();
let Ce = [], Ln = !1;
function Br(t) {
  Ln = !!t;
}
function Or(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function ms() {
  return Ce;
}
const Nr = Ir(() => ps(ds), "slugManager");
function _n() {
  return Nr.get();
}
function Dr(t) {
  return Nr.send(t);
}
async function ws(t, e = 1, r = void 0) {
  if (!_n()) return Gt(t, e, r);
  try {
    return await Dr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: r });
  } catch (n) {
    try {
      return await Gt(t, e, r);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), n;
    }
  }
}
async function bs(t, e, r) {
  return _n() ? Dr({ type: "crawlForSlug", slug: t, base: e, maxQueue: r }) : Mn(t, e, r);
}
function We(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const s = e.split("/")[0], n = Ce.includes(s);
      let i = K.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), n ? i.langs[s] = e : i.default = e, K.set(t, i);
    } else
      K.set(t, e);
}
const Vt = /* @__PURE__ */ new Set();
function ys(t) {
  typeof t == "function" && Vt.add(t);
}
function ks(t) {
  typeof t == "function" && Vt.delete(t);
}
const U = /* @__PURE__ */ new Map();
let wn = {}, Te = [], at = "_404.md", it = "_home.md";
function bn(t) {
  t != null && (at = String(t || ""));
}
function yn(t) {
  t != null && (it = String(t || ""));
}
function xs(t) {
  wn = t || {};
}
const gt = /* @__PURE__ */ new Map(), Ft = /* @__PURE__ */ new Set();
function Ss() {
  gt.clear(), Ft.clear();
}
function vs(t) {
  if (!t || t.length === 0) return "";
  let e = t[0];
  for (let s = 1; s < t.length; s++) {
    const n = t[s];
    let i = 0;
    const a = Math.min(e.length, n.length);
    for (; i < a && e[i] === n[i]; ) i++;
    e = e.slice(0, i);
  }
  const r = e.lastIndexOf("/");
  return r === -1 ? e : e.slice(0, r + 1);
}
function Zt(t) {
  K.clear(), U.clear(), Te = [], Ce = Ce || [];
  const e = Object.keys(wn || {});
  if (!e.length) return;
  let r = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? r = new URL(String(t)).pathname : r = String(t || "");
      } catch (s) {
        r = String(t || ""), console.warn("[slugManager] parse contentBase failed", s);
      }
      r = vt(r);
    }
  } catch (s) {
    r = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  r || (r = vs(e));
  for (const s of e) {
    let n = s;
    r && s.startsWith(r) ? n = ce(s.slice(r.length)) : n = ce(s), Te.push(n);
    try {
      Cn();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const i = wn[s];
    if (typeof i == "string") {
      const a = (i || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const u = re(a[1].trim());
        if (u)
          try {
            if (Ce && Ce.length) {
              const o = n.split("/")[0], c = Ce.includes(o);
              let h = K.get(u);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), c ? h.langs[o] = n : h.default = n, K.set(u, h);
            } else
              K.set(u, n);
            U.set(n, u);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  Zt();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function re(t) {
  let r = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return r = r.replace(/(?:-?)(?:md|html)$/, ""), r.length > 80 && (r = r.slice(0, 80).replace(/-+$/g, "")), r;
}
function As(t) {
  return Et(t, void 0);
}
function Et(t, e) {
  if (!t) return !1;
  if (t.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    if (e && typeof e == "string")
      try {
        const r = new URL(t), s = new URL(e);
        return r.origin !== s.origin ? !0 : !r.pathname.startsWith(s.pathname);
      } catch {
        return !0;
      }
    return !0;
  }
  if (t.startsWith("/") && e && typeof e == "string")
    try {
      const r = new URL(t, e), s = new URL(e);
      return r.origin !== s.origin ? !0 : !r.pathname.startsWith(s.pathname);
    } catch {
      return !0;
    }
  return !1;
}
function Dt(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, r) => r);
}
function Rt(t) {
  if (!t || !K.has(t)) return null;
  const e = K.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ce && Ce.length && Ge && e.langs && e.langs[Ge])
    return e.langs[Ge];
  if (e.default) return e.default;
  if (e.langs) {
    const r = Object.keys(e.langs);
    if (r.length) return e.langs[r[0]];
  }
  return null;
}
const mt = /* @__PURE__ */ new Map();
function Es() {
  mt.clear();
}
let be = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && K.has(i)) {
      const a = Rt(i) || K.get(i);
      a && a !== t && (t = a);
    }
  } catch (i) {
    console.warn("[slugManager] slug mapping normalization failed", i);
  }
  const r = e == null ? "" : At(String(e));
  let s = "";
  try {
    r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? s = r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : s = (r.startsWith("/") ? "" : "/") + r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : s = "/" + t.replace(/^\//, "");
  } catch {
    s = "/" + t.replace(/^\//, "");
  }
  if (mt.has(s))
    return mt.get(s);
  const n = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const h = `${r}/${at}`, f = await globalThis.fetch(h);
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
    const a = await i.text(), u = a.trim().slice(0, 16).toLowerCase(), l = u.startsWith("<!doctype") || u.startsWith("<html"), o = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const c = `${r}/${at}`, h = await globalThis.fetch(c);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (c) {
        console.warn("[slugManager] fetching fallback 404 failed", c);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return o ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return mt.set(s, n), n;
};
function Rs(t) {
  typeof t == "function" && (be = t);
}
const Ht = /* @__PURE__ */ new Map();
function Ts(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let He = [], ct = null;
async function Gt(t, e = 1, r = void 0) {
  const s = Array.isArray(r) ? Array.from(new Set((r || []).map((n) => ce(String(n || ""))))) : [];
  try {
    const n = ce(String(at || ""));
    n && !s.includes(n) && s.push(n);
  } catch {
  }
  if (He && He.length && e === 1 && !He.some((i) => {
    try {
      return s.includes(ce(String(i.path || "")));
    } catch {
      return !1;
    }
  }))
    return He;
  if (ct) return ct;
  ct = (async () => {
    let n = Array.isArray(r) ? Array.from(new Set((r || []).map((o) => ce(String(o || ""))))) : [];
    try {
      const o = ce(String(at || ""));
      o && !n.includes(o) && n.push(o);
    } catch {
    }
    const i = (o) => {
      if (!n || !n.length) return !1;
      for (const c of n)
        if (c && (o === c || o.startsWith(c + "/")))
          return !0;
      return !1;
    };
    let a = [];
    if (Te && Te.length && (a = Array.from(Te)), !a.length)
      for (const o of K.values())
        o && a.push(o);
    try {
      const o = await jr(t);
      o && o.length && (a = a.concat(o));
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", o);
    }
    try {
      const o = new Set(a), c = [...a];
      for (o.size; c.length && o.size <= Tt; ) {
        const h = c.shift();
        try {
          const f = await be(h, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], m = String(h || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(m) && Ln && (!h || !h.includes("/")))
              continue;
            const w = Ts(p), y = /\[[^\]]+\]\(([^)]+)\)/g;
            let x;
            for (; x = y.exec(w); )
              d.push(x[1]);
            const B = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; x = B.exec(w); )
              d.push(x[1]);
            const I = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
            for (let A of d)
              try {
                if (Et(A, t) || A.startsWith("..") || A.indexOf("/../") !== -1 || (I && !A.startsWith("./") && !A.startsWith("/") && !A.startsWith("../") && (A = I + A), A = ce(A), !/\.(md|html?)(?:$|[?#])/i.test(A)) || (A = A.split(/[?#]/)[0], i(A))) continue;
                o.has(A) || (o.add(A), c.push(A), a.push(A));
              } catch (q) {
                console.warn("[slugManager] href processing failed", A, q);
              }
          }
        } catch (f) {
          console.warn("[slugManager] discovery fetch failed for", h, f);
        }
      }
    } catch (o) {
      console.warn("[slugManager] discovery loop failed", o);
    }
    const u = /* @__PURE__ */ new Set();
    a = a.filter((o) => !o || u.has(o) || i(o) ? !1 : (u.add(o), !0));
    const l = [];
    for (const o of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(o))
        try {
          const c = await be(o, t);
          if (c && c.raw) {
            if (c.status === 404) continue;
            let h = "", f = "";
            if (c.isHtml)
              try {
                const m = new DOMParser().parseFromString(c.raw, "text/html"), w = m.querySelector("title") || m.querySelector("h1");
                w && w.textContent && (h = w.textContent.trim());
                const y = m.querySelector("p");
                if (y && y.textContent && (f = y.textContent.trim()), e >= 2)
                  try {
                    const x = m.querySelector("h1"), B = x && x.textContent ? x.textContent.trim() : h || "", I = (() => {
                      try {
                        if (U.has(o)) return U.get(o);
                      } catch {
                      }
                      return re(h || o);
                    })(), A = Array.from(m.querySelectorAll("h2"));
                    for (const q of A)
                      try {
                        const O = (q.textContent || "").trim();
                        if (!O) continue;
                        const G = q.id ? q.id : re(O), Y = I ? `${I}::${G}` : `${re(o)}::${G}`;
                        let te = "", P = q.nextElementSibling;
                        for (; P && P.tagName && P.tagName.toLowerCase() === "script"; ) P = P.nextElementSibling;
                        P && P.textContent && (te = String(P.textContent).trim()), l.push({ slug: Y, title: O, excerpt: te, path: o, parentTitle: B });
                      } catch (O) {
                        console.warn("[slugManager] indexing H2 failed", O);
                      }
                    if (e === 3)
                      try {
                        const q = Array.from(m.querySelectorAll("h3"));
                        for (const O of q)
                          try {
                            const G = (O.textContent || "").trim();
                            if (!G) continue;
                            const Y = O.id ? O.id : re(G), te = I ? `${I}::${Y}` : `${re(o)}::${Y}`;
                            let P = "", T = O.nextElementSibling;
                            for (; T && T.tagName && T.tagName.toLowerCase() === "script"; ) T = T.nextElementSibling;
                            T && T.textContent && (P = String(T.textContent).trim()), l.push({ slug: te, title: G, excerpt: P, path: o, parentTitle: B });
                          } catch (G) {
                            console.warn("[slugManager] indexing H3 failed", G);
                          }
                      } catch (q) {
                        console.warn("[slugManager] collect H3s failed", q);
                      }
                  } catch (x) {
                    console.warn("[slugManager] collect H2s failed", x);
                  }
              } catch (d) {
                console.warn("[slugManager] parsing HTML for index failed", d);
              }
            else {
              const d = c.raw, m = d.match(/^#\s+(.+)$/m);
              h = m ? m[1].trim() : "";
              try {
                h = Dt(h);
              } catch {
              }
              const w = d.split(/\r?\n\s*\r?\n/);
              if (w.length > 1)
                for (let y = 1; y < w.length; y++) {
                  const x = w[y].trim();
                  if (x && !/^#/.test(x)) {
                    f = x.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e >= 2) {
                let y = "", x = "";
                try {
                  const B = (d.match(/^#\s+(.+)$/m) || [])[1];
                  y = B ? B.trim() : "", x = (function() {
                    try {
                      if (U.has(o)) return U.get(o);
                    } catch {
                    }
                    return re(h || o);
                  })();
                  const I = /^##\s+(.+)$/gm;
                  let A;
                  for (; A = I.exec(d); )
                    try {
                      const q = (A[1] || "").trim(), O = Dt(q);
                      if (!q) continue;
                      const G = re(q), Y = x ? `${x}::${G}` : `${re(o)}::${G}`, P = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), T = P && P[1] ? String(P[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      l.push({ slug: Y, title: O, excerpt: T, path: o, parentTitle: y });
                    } catch (q) {
                      console.warn("[slugManager] indexing markdown H2 failed", q);
                    }
                } catch (B) {
                  console.warn("[slugManager] collect markdown H2s failed", B);
                }
                if (e === 3)
                  try {
                    const B = /^###\s+(.+)$/gm;
                    let I;
                    for (; I = B.exec(d); )
                      try {
                        const A = (I[1] || "").trim(), q = Dt(A);
                        if (!A) continue;
                        const O = re(A), G = x ? `${x}::${O}` : `${re(o)}::${O}`, te = d.slice(B.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), P = te && te[1] ? String(te[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        l.push({ slug: G, title: q, excerpt: P, path: o, parentTitle: y });
                      } catch (A) {
                        console.warn("[slugManager] indexing markdown H3 failed", A);
                      }
                  } catch (B) {
                    console.warn("[slugManager] collect markdown H3s failed", B);
                  }
              }
            }
            let p = "";
            try {
              U.has(o) && (p = U.get(o));
            } catch (d) {
              console.warn("[slugManager] mdToSlug access failed", d);
            }
            p || (p = re(h || o)), l.push({ slug: p, title: h, excerpt: f, path: o });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    try {
      He = l.filter((c) => {
        try {
          return !i(String(c.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (o) {
      console.warn("[slugManager] filtering index by excludes failed", o), He = l;
    }
    return He;
  })();
  try {
    await ct;
  } catch (n) {
    console.warn("[slugManager] awaiting _indexPromise failed", n);
  }
  return ct = null, He;
}
const Hr = 1e3;
let Tt = Hr;
function Cs(t) {
  typeof t == "number" && t >= 0 && (Tt = t);
}
const Ur = new DOMParser(), qr = "a[href]";
let Mn = async function(t, e, r = Tt) {
  if (Ht.has(t)) return Ht.get(t);
  let s = null;
  const n = /* @__PURE__ */ new Set(), i = [""];
  for (; i.length && !s && !(i.length > r); ) {
    const a = i.shift();
    if (n.has(a)) continue;
    n.add(a);
    let u = e;
    u.endsWith("/") || (u += "/"), u += a;
    try {
      let l;
      try {
        l = await globalThis.fetch(u);
      } catch (f) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: u, error: f });
        continue;
      }
      if (!l || !l.ok) {
        l && !l.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: u, status: l.status });
        continue;
      }
      const o = await l.text(), h = Ur.parseFromString(o, "text/html").querySelectorAll(qr);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Et(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            n.has(d) || i.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = ce(a + p);
            try {
              if (U.has(d))
                continue;
              for (const m of K.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await be(d, e);
              if (m && m.raw) {
                const w = (m.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && re(w[1].trim()) === t) {
                  s = d;
                  break;
                }
              }
            } catch (m) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", m);
            }
          }
        } catch (p) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", p);
        }
    } catch (l) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", l);
    }
  }
  return Ht.set(t, s), s;
};
async function jr(t, e = Tt) {
  const r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), n = [""];
  for (; n.length && !(n.length > e); ) {
    const i = n.shift();
    if (s.has(i)) continue;
    s.add(i);
    let a = t;
    a.endsWith("/") || (a += "/"), a += i;
    try {
      let u;
      try {
        u = await globalThis.fetch(a);
      } catch (h) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: a, error: h });
        continue;
      }
      if (!u || !u.ok) {
        u && !u.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: a, status: u.status });
        continue;
      }
      const l = await u.text(), c = Ur.parseFromString(l, "text/html").querySelectorAll(qr);
      for (const h of c)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Et(f, t) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
          if (f.endsWith("/")) {
            const d = i + f;
            s.has(d) || n.push(d);
            continue;
          }
          const p = (i + f).replace(/^\/+/, "");
          /\.(md|html?)$/i.test(p) && r.add(p);
        } catch (f) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", f);
        }
    } catch (u) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", u);
    }
  }
  return Array.from(r);
}
async function Wr(t, e, r) {
  if (t && typeof t == "string" && (t = ce(t), t = At(t)), K.has(t))
    return Rt(t) || K.get(t);
  for (const n of Vt)
    try {
      const i = await n(t, e);
      if (i)
        return We(t, i), U.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Te && Te.length) {
    if (gt.has(t)) {
      const n = gt.get(t);
      return K.set(t, n), U.set(n, t), n;
    }
    for (const n of Te)
      if (!Ft.has(n))
        try {
          const i = await be(n, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const u = re(a[1].trim());
              if (Ft.add(n), u && gt.set(u, n), u === t)
                return We(t, n), U.set(n, t), n;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const n = await Gt(e);
    if (n && n.length) {
      const i = n.find((a) => a.slug === t);
      if (i)
        return We(t, i.path), U.set(i.path, t), i.path;
    }
  } catch (n) {
    console.warn("[slugManager] buildSearchIndex lookup failed", n);
  }
  try {
    const n = await Mn(t, e, r);
    if (n)
      return We(t, n), U.set(n, t), n;
  } catch (n) {
    console.warn("[slugManager] crawlForSlug lookup failed", n);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const n of s)
    try {
      const i = await be(n, e);
      if (i && i.raw)
        return We(t, n), U.set(n, t), n;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Te && Te.length)
    for (const n of Te)
      try {
        const i = n.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (re(i) === t)
          return We(t, n), U.set(n, t), n;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const n = [];
    it && typeof it == "string" && it.trim() && n.push(it), n.includes("_home.md") || n.push("_home.md");
    for (const i of n)
      try {
        const a = await be(i, e);
        if (a && a.raw) {
          const u = (a.raw || "").match(/^#\s+(.+)$/m);
          if (u && u[1] && re(u[1].trim()) === t)
            return We(t, i), U.set(i, t), i;
        }
      } catch {
      }
  } catch (n) {
    console.warn("[slugManager] home page fetch failed", n);
  }
  return null;
}
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Hr,
  _setAllMd: xs,
  _storeSlugMapping: We,
  addSlugResolver: ys,
  get allMarkdownPaths() {
    return Te;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Gt,
  buildSearchIndexWorker: ws,
  clearFetchCache: Es,
  clearListCaches: Ss,
  crawlAllMarkdown: jr,
  crawlCache: Ht,
  crawlForSlug: Mn,
  crawlForSlugWorker: bs,
  get defaultCrawlMaxQueue() {
    return Tt;
  },
  ensureSlug: Wr,
  fetchCache: mt,
  get fetchMarkdown() {
    return be;
  },
  getLanguages: ms,
  get homePage() {
    return it;
  },
  initSlugWorker: _n,
  isExternalLink: As,
  isExternalLinkWithBase: Et,
  listPathsFetched: Ft,
  listSlugCache: gt,
  mdToSlug: U,
  get notFoundPage() {
    return at;
  },
  removeSlugResolver: ks,
  resolveSlugPath: Rt,
  get searchIndex() {
    return He;
  },
  setContentBase: Zt,
  setDefaultCrawlMaxQueue: Cs,
  setFetchMarkdown: Rs,
  setHomePage: yn,
  setLanguages: Or,
  setNotFoundPage: bn,
  setSkipRootReadme: Br,
  get skipRootReadme() {
    return Ln;
  },
  slugResolvers: Vt,
  slugToMd: K,
  slugify: re,
  unescapeMarkdown: Dt
}, Symbol.toStringTag, { value: "Module" }));
let Fr = 100;
function cr(t) {
  Fr = t;
}
let wt = 300 * 1e3;
function ur(t) {
  wt = t;
}
const _e = /* @__PURE__ */ new Map();
function Ls(t) {
  if (!_e.has(t)) return;
  const e = _e.get(t), r = Date.now();
  if (e.ts + wt < r) {
    _e.delete(t);
    return;
  }
  return _e.delete(t), _e.set(t, e), e.value;
}
function _s(t, e) {
  if (hr(), hr(), _e.delete(t), _e.set(t, { value: e, ts: Date.now() }), _e.size > Fr) {
    const r = _e.keys().next().value;
    r !== void 0 && _e.delete(r);
  }
}
function hr() {
  if (!wt || wt <= 0) return;
  const t = Date.now();
  for (const [e, r] of _e.entries())
    r.ts + wt < t && _e.delete(e);
}
async function Ms(t, e) {
  const r = new Set(Ne), s = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const n of Array.from(s || [])) {
    const i = n.getAttribute("href") || "";
    if (i)
      try {
        const a = new URL(i, location.href);
        if (a.origin !== location.origin) continue;
        const u = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (u) {
          let o = ce(u[1]);
          o && r.add(o);
          continue;
        }
        const l = a.pathname || "";
        if (l) {
          const o = new URL(e), c = vt(o.pathname);
          if (l.indexOf(c) !== -1) {
            let h = l.startsWith(c) ? l.slice(c.length) : l;
            h = ce(h), h && r.add(h);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const n of r)
    try {
      if (!n || !String(n).includes(".md")) continue;
      const i = await be(n, e);
      if (!i || !i.raw) continue;
      const a = (i.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const u = (a[1] || "").trim();
        if (u && re(u) === t)
          return n;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function $s(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const r = decodeURIComponent(String(t || ""));
      if (K.has(r)) {
        const s = Rt(r) || K.get(r);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (Ne && Ne.size)
          for (const s of Ne) {
            const n = s.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (re(n) === r && !/index\.html$/i.test(s)) {
              e.push(s);
              break;
            }
          }
        !e.length && r && !/\.(md|html?)$/i.test(r) && (e.push(r + ".html"), e.push(r + ".md"));
      }
    } catch (r) {
      console.warn("[router] buildPageCandidates failed during slug handling", r);
    }
  return e;
}
async function Ps(t, e) {
  const r = t || "", s = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let n = t || "", i = null;
  if (n && String(n).includes("::")) {
    const d = String(n).split("::", 2);
    n = d[0], i = d[1] || null;
  }
  const u = `${t}|||${typeof hs < "u" && Ge ? Ge : ""}`, l = Ls(u);
  if (l)
    n = l.resolved, i = l.anchor || i;
  else {
    if (!String(n).includes(".md") && !String(n).includes(".html")) {
      let d = decodeURIComponent(String(n || ""));
      if (d && typeof d == "string" && (d = ce(d), d = At(d)), K.has(d))
        n = Rt(d) || K.get(d);
      else {
        let m = await Ms(d, e);
        if (m)
          n = m;
        else if (Cn._refreshed && Ne && Ne.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await Wr(d, e);
          w && (n = w);
        }
      }
    }
    _s(u, { resolved: n, anchor: i });
  }
  !i && s && (i = s);
  const o = $s(n), c = String(r || "").includes(".md") || String(r || "").includes(".html");
  if (c && o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 1 && /index\.html$/i.test(o[0]) && !c && !K.has(n) && !K.has(decodeURIComponent(String(n || ""))) && !String(n || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const d of o)
    if (d)
      try {
        const m = ce(d);
        h = await be(m, e), f = m;
        break;
      } catch (m) {
        p = m;
        try {
          console.warn("[router] candidate fetch failed", { candidate: d, contentBase: e, err: m && m.message || m });
        } catch {
        }
      }
  if (!h) {
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: r, resolved: n, pageCandidates: o, contentBase: e, fetchError: p && (p.message || String(p)) || null });
    } catch {
    }
    try {
      if (c && String(r || "").toLowerCase().includes(".html"))
        try {
          const d = new URL(String(r || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", d);
          const m = await fetch(d);
          if (m && m.ok) {
            const w = await m.text(), y = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", x = (w || "").toLowerCase(), B = y && y.indexOf && y.indexOf("text/html") !== -1 || x.indexOf("<!doctype") !== -1 || x.indexOf("<html") !== -1;
            if (B || console.warn("[router] absolute fetch returned non-HTML", { abs: d, contentType: y, snippet: x.slice(0, 200) }), B)
              try {
                const I = d, A = new URL(".", I).toString();
                try {
                  const O = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (O) {
                    const G = O.parseFromString(w || "", "text/html"), Y = ($, C) => {
                      try {
                        const v = C.getAttribute($) || "";
                        if (!v || /^(https?:)?\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return;
                        try {
                          const b = new URL(v, I).toString();
                          C.setAttribute($, b);
                        } catch (b) {
                          console.warn("[router] rewrite attribute failed", $, b);
                        }
                      } catch (v) {
                        console.warn("[router] rewrite helper failed", v);
                      }
                    }, te = G.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), P = [];
                    for (const $ of Array.from(te || []))
                      try {
                        const C = $.tagName ? $.tagName.toLowerCase() : "";
                        if (C === "a") continue;
                        if ($.hasAttribute("src")) {
                          const v = $.getAttribute("src");
                          Y("src", $);
                          const b = $.getAttribute("src");
                          v !== b && P.push({ attr: "src", tag: C, before: v, after: b });
                        }
                        if ($.hasAttribute("href") && C === "link") {
                          const v = $.getAttribute("href");
                          Y("href", $);
                          const b = $.getAttribute("href");
                          v !== b && P.push({ attr: "href", tag: C, before: v, after: b });
                        }
                        if ($.hasAttribute("href") && C !== "link") {
                          const v = $.getAttribute("href");
                          Y("href", $);
                          const b = $.getAttribute("href");
                          v !== b && P.push({ attr: "href", tag: C, before: v, after: b });
                        }
                        if ($.hasAttribute("xlink:href")) {
                          const v = $.getAttribute("xlink:href");
                          Y("xlink:href", $);
                          const b = $.getAttribute("xlink:href");
                          v !== b && P.push({ attr: "xlink:href", tag: C, before: v, after: b });
                        }
                        if ($.hasAttribute("poster")) {
                          const v = $.getAttribute("poster");
                          Y("poster", $);
                          const b = $.getAttribute("poster");
                          v !== b && P.push({ attr: "poster", tag: C, before: v, after: b });
                        }
                        if ($.hasAttribute("srcset")) {
                          const E = ($.getAttribute("srcset") || "").split(",").map((M) => M.trim()).filter(Boolean).map((M) => {
                            const [k, Q] = M.split(/\s+/, 2);
                            if (!k || /^(https?:)?\/\//i.test(k) || k.startsWith("/")) return M;
                            try {
                              const ue = new URL(k, I).toString();
                              return Q ? `${ue} ${Q}` : ue;
                            } catch {
                              return M;
                            }
                          }).join(", ");
                          $.setAttribute("srcset", E);
                        }
                      } catch {
                      }
                    const T = G.documentElement && G.documentElement.outerHTML ? G.documentElement.outerHTML : w;
                    try {
                      P && P.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: P });
                    } catch {
                    }
                    return { data: { raw: T, isHtml: !0 }, pagePath: String(r || ""), anchor: i };
                  }
                } catch {
                }
                let q = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? q = w.replace(/(<head[^>]*>)/i, `$1<base href="${A}">`) : q = `<base href="${A}">` + w), { data: { raw: q, isHtml: !0 }, pagePath: String(r || ""), anchor: i };
              } catch {
                return { data: { raw: w, isHtml: !0 }, pagePath: String(r || ""), anchor: i };
              }
          }
        } catch (d) {
          console.warn("[router] absolute HTML fetch fallback failed", d);
        }
    } catch {
    }
    throw new Error("no page data");
  }
  return { data: h, pagePath: f, anchor: i };
}
function $n() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var et = $n();
function Zr(t) {
  et = t;
}
var Ve = { exec: () => null };
function ee(t, e = "") {
  let r = typeof t == "string" ? t : t.source, s = { replace: (n, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(Se.caret, "$1"), r = r.replace(n, a), s;
  }, getRegex: () => new RegExp(r, e) };
  return s;
}
var Is = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Se = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, zs = /^(?:[ \t]*(?:\n|$))+/, Bs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Os = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ct = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ns = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Pn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Gr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Qr = ee(Gr).replace(/bull/g, Pn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ds = ee(Gr).replace(/bull/g, Pn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), In = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Hs = /^[^\n]+/, zn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Us = ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", zn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), qs = ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Pn).getRegex(), Jt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Bn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, js = ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Bn).replace("tag", Jt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Xr = ee(In).replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Ws = ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Xr).getRegex(), On = { blockquote: Ws, code: Bs, def: Us, fences: Os, heading: Ns, hr: Ct, html: js, lheading: Qr, list: qs, newline: zs, paragraph: Xr, table: Ve, text: Hs }, dr = ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Fs = { ...On, lheading: Ds, table: dr, paragraph: ee(In).replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex() }, Zs = { ...On, html: ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Bn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ve, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ee(In).replace("hr", Ct).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Qr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Gs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Qs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Kr = /^( {2,}|\\)\n(?!\s*$)/, Xs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, en = /[\p{P}\p{S}]/u, Nn = /[\s\p{P}\p{S}]/u, Yr = /[^\s\p{P}\p{S}]/u, Ks = ee(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Nn).getRegex(), Vr = /(?!~)[\p{P}\p{S}]/u, Ys = /(?!~)[\s\p{P}\p{S}]/u, Vs = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = /(?![*_])[\p{P}\p{S}]/u, Js = /(?![*_])[\s\p{P}\p{S}]/u, ea = /(?:[^\s\p{P}\p{S}]|[*_])/u, ta = ee(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Is ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ei = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, na = ee(ei, "u").replace(/punct/g, en).getRegex(), ra = ee(ei, "u").replace(/punct/g, Vr).getRegex(), ti = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ia = ee(ti, "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), sa = ee(ti, "gu").replace(/notPunctSpace/g, Vs).replace(/punctSpace/g, Ys).replace(/punct/g, Vr).getRegex(), aa = ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), la = ee(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Jr).getRegex(), oa = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ca = ee(oa, "gu").replace(/notPunctSpace/g, ea).replace(/punctSpace/g, Js).replace(/punct/g, Jr).getRegex(), ua = ee(/\\(punct)/, "gu").replace(/punct/g, en).getRegex(), ha = ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), da = ee(Bn).replace("(?:-->|$)", "-->").getRegex(), pa = ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", da).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, fa = ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Qt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ni = ee(/^!?\[(label)\]\[(ref)\]/).replace("label", Qt).replace("ref", zn).getRegex(), ri = ee(/^!?\[(ref)\](?:\[\])?/).replace("ref", zn).getRegex(), ga = ee("reflink|nolink(?!\\()", "g").replace("reflink", ni).replace("nolink", ri).getRegex(), pr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Dn = { _backpedal: Ve, anyPunctuation: ua, autolink: ha, blockSkip: ta, br: Kr, code: Qs, del: Ve, delLDelim: Ve, delRDelim: Ve, emStrongLDelim: na, emStrongRDelimAst: ia, emStrongRDelimUnd: aa, escape: Gs, link: fa, nolink: ri, punctuation: Ks, reflink: ni, reflinkSearch: ga, tag: pa, text: Xs, url: Ve }, ma = { ...Dn, link: ee(/^!?\[(label)\]\((.*?)\)/).replace("label", Qt).getRegex(), reflink: ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qt).getRegex() }, kn = { ...Dn, emStrongRDelimAst: sa, emStrongLDelim: ra, delLDelim: la, delRDelim: ca, url: ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", pr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", pr).getRegex() }, wa = { ...kn, br: ee(Kr).replace("{2,}", "*").getRegex(), text: ee(kn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Nt = { normal: On, gfm: Fs, pedantic: Zs }, ut = { normal: Dn, gfm: kn, breaks: wa, pedantic: ma }, ba = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, fr = (t) => ba[t];
function Oe(t, e) {
  if (e) {
    if (Se.escapeTest.test(t)) return t.replace(Se.escapeReplace, fr);
  } else if (Se.escapeTestNoEncode.test(t)) return t.replace(Se.escapeReplaceNoEncode, fr);
  return t;
}
function gr(t) {
  try {
    t = encodeURI(t).replace(Se.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function mr(t, e) {
  let r = t.replace(Se.findPipe, (i, a, u) => {
    let l = !1, o = a;
    for (; --o >= 0 && u[o] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), s = r.split(Se.splitPipe), n = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; n < s.length; n++) s[n] = s[n].trim().replace(Se.slashPipe, "|");
  return s;
}
function ht(t, e, r) {
  let s = t.length;
  if (s === 0) return "";
  let n = 0;
  for (; n < s && t.charAt(s - n - 1) === e; )
    n++;
  return t.slice(0, s - n);
}
function ya(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) r++;
  else if (t[s] === e[1] && (r--, r < 0)) return s;
  return r > 0 ? -2 : -1;
}
function ka(t, e = 0) {
  let r = e, s = "";
  for (let n of t) if (n === "	") {
    let i = 4 - r % 4;
    s += " ".repeat(i), r += i;
  } else s += n, r++;
  return s;
}
function wr(t, e, r, s, n) {
  let i = e.href, a = e.title || null, u = t[1].replace(n.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: a, text: u, tokens: s.inlineTokens(u) };
  return s.state.inLink = !1, l;
}
function xa(t, e, r) {
  let s = t.match(r.other.indentCodeCompensation);
  if (s === null) return e;
  let n = s[1];
  return e.split(`
`).map((i) => {
    let a = i.match(r.other.beginningSpace);
    if (a === null) return i;
    let [u] = a;
    return u.length >= n.length ? i.slice(n.length) : i;
  }).join(`
`);
}
var Xt = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || et;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : ht(r, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let r = e[0], s = xa(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let s = ht(r, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (r = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: ht(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let r = ht(e[0], `
`).split(`
`), s = "", n = "", i = [];
      for (; r.length > 0; ) {
        let a = !1, u = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) u.push(r[l]), a = !0;
        else if (!a) u.push(r[l]);
        else break;
        r = r.slice(l);
        let o = u.join(`
`), c = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${o}` : o, n = n ? `${n}
${c}` : c;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = h, r.length === 0) break;
        let f = i.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, d = p.raw + `
` + r.join(`
`), m = this.blockquote(d);
          i[i.length - 1] = m, s = s.substring(0, s.length - p.raw.length) + m.raw, n = n.substring(0, n.length - p.text.length) + m.text;
          break;
        } else if (f?.type === "list") {
          let p = f, d = p.raw + `
` + r.join(`
`), m = this.list(d);
          i[i.length - 1] = m, s = s.substring(0, s.length - f.raw.length) + m.raw, n = n.substring(0, n.length - p.raw.length) + m.raw, r = d.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: n };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let r = e[1].trim(), s = r.length > 1, n = { type: "list", raw: "", ordered: s, start: s ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = s ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = s ? r : "[*+-]");
      let i = this.rules.other.listItemRegex(r), a = !1;
      for (; t; ) {
        let l = !1, o = "", c = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        o = e[0], t = t.substring(o.length);
        let h = ka(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !h.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, c = h.trimStart()) : p ? d = e[1].length + 1 : (d = h.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, c = h.slice(d), d += e[1].length), p && this.rules.other.blankLine.test(f) && (o += f + `
`, t = t.substring(f.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(d), w = this.rules.other.hrRegex(d), y = this.rules.other.fencesBeginRegex(d), x = this.rules.other.headingBeginRegex(d), B = this.rules.other.htmlBeginRegex(d), I = this.rules.other.blockquoteBeginRegex(d);
          for (; t; ) {
            let A = t.split(`
`, 1)[0], q;
            if (f = A, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), q = f) : q = f.replace(this.rules.other.tabCharGlobal, "    "), y.test(f) || x.test(f) || B.test(f) || I.test(f) || m.test(f) || w.test(f)) break;
            if (q.search(this.rules.other.nonSpaceChar) >= d || !f.trim()) c += `
` + q.slice(d);
            else {
              if (p || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || y.test(h) || x.test(h) || w.test(h)) break;
              c += `
` + f;
            }
            p = !f.trim(), o += A + `
`, t = t.substring(A.length + 1), h = q.slice(d);
          }
        }
        n.loose || (a ? n.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (a = !0)), n.items.push({ type: "list_item", raw: o, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), n.raw += o;
      }
      let u = n.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      n.raw = n.raw.trimEnd();
      for (let l of n.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c = this.lexer.inlineQueue.length - 1; c >= 0; c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)) {
              this.lexer.inlineQueue[c].src = this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let o = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (o) {
            let c = { type: "checkbox", raw: o[0] + " ", checked: o[0] !== "[ ]" };
            l.checked = c.checked, n.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = c.raw + l.tokens[0].raw, l.tokens[0].text = c.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(c)) : l.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : l.tokens.unshift(c);
          }
        }
        if (!n.loose) {
          let o = l.tokens.filter((h) => h.type === "space"), c = o.length > 0 && o.some((h) => this.rules.other.anyLine.test(h.raw));
          n.loose = c;
        }
      }
      if (n.loose) for (let l of n.items) {
        l.loose = !0;
        for (let o of l.tokens) o.type === "text" && (o.type = "paragraph");
      }
      return n;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", n = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: s, title: n };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = mr(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < r.length; a++) i.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: i.align[a] });
      for (let a of n) i.rows.push(mr(a, i.header.length).map((u, l) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: i.align[l] })));
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
      let r = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
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
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let i = ht(r.slice(0, -1), "\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = ya(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let s = e[2], n = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], n = i[3]);
      } else n = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? s = s.slice(1) : s = s.slice(1, -1)), wr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: n && n.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(t)) || (r = this.rules.inline.nolink.exec(t))) {
      let s = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = e[s.toLowerCase()];
      if (!n) {
        let i = r[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return wr(r, n, r[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, r = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let n = [...s[0]].length - 1, i, a, u = n, l = 0, o = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + n); (s = o.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
        if (a = [...i].length, s[3] || s[4]) {
          u += a;
          continue;
        } else if ((s[5] || s[6]) && n % 3 && !((n + a) % 3)) {
          l += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u + l);
        let c = [...s[0]][0].length, h = t.slice(0, n + s.index + c + a);
        if (Math.min(n, a) % 2) {
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
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(r), n = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return s && n && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, r = "") {
    let s = this.rules.inline.delLDelim.exec(t);
    if (s && (!s[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let n = [...s[0]].length - 1, i, a, u = n, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + n); (s = l.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (a = [...i].length, a !== n)) continue;
        if (s[3] || s[4]) {
          u += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u);
        let o = [...s[0]][0].length, c = t.slice(0, n + s.index + o + a), h = c.slice(n, -n);
        return { type: "del", raw: c, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let r, s;
      return e[2] === "@" ? (r = e[1], s = "mailto:" + r) : (r = e[1], s = r), { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let r, s;
      if (e[2] === "@") r = e[0], s = "mailto:" + r;
      else {
        let n;
        do
          n = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (n !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, $e = class xn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || et, this.options.tokenizer = this.options.tokenizer || new Xt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: Se, block: Nt.normal, inline: ut.normal };
    this.options.pedantic ? (r.block = Nt.pedantic, r.inline = ut.pedantic) : this.options.gfm && (r.block = Nt.gfm, this.options.breaks ? r.inline = ut.breaks : r.inline = ut.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Nt, inline: ut };
  }
  static lex(e, r) {
    return new xn(r).lex(e);
  }
  static lexInline(e, r) {
    return new xn(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Se.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let s = this.inlineQueue[r];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(Se.tabCharGlobal, "    ").replace(Se.spaceLine, "")); e; ) {
      let n;
      if (this.options.extensions?.block?.some((a) => (n = a.call({ lexer: this }, e, r)) ? (e = e.substring(n.raw.length), r.push(n), !0) : !1)) continue;
      if (n = this.tokenizer.space(e)) {
        e = e.substring(n.raw.length);
        let a = r.at(-1);
        n.raw.length === 1 && a !== void 0 ? a.raw += `
` : r.push(n);
        continue;
      }
      if (n = this.tokenizer.code(e)) {
        e = e.substring(n.raw.length);
        let a = r.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + n.raw, a.text += `
` + n.text, this.inlineQueue.at(-1).src = a.text) : r.push(n);
        continue;
      }
      if (n = this.tokenizer.fences(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.heading(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.hr(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.blockquote(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.list(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.html(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.def(e)) {
        e = e.substring(n.raw.length);
        let a = r.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + n.raw, a.text += `
` + n.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = { href: n.href, title: n.title }, r.push(n));
        continue;
      }
      if (n = this.tokenizer.table(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.lheading(e)) {
        e = e.substring(n.raw.length), r.push(n);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, u = e.slice(1), l;
        this.options.extensions.startBlock.forEach((o) => {
          l = o.call({ lexer: this }, u), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
        }), a < 1 / 0 && a >= 0 && (i = e.substring(0, a + 1));
      }
      if (this.state.top && (n = this.tokenizer.paragraph(i))) {
        let a = r.at(-1);
        s && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + n.raw, a.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : r.push(n), s = i.length !== e.length, e = e.substring(n.raw.length);
        continue;
      }
      if (n = this.tokenizer.text(e)) {
        e = e.substring(n.raw.length);
        let a = r.at(-1);
        a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + n.raw, a.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : r.push(n);
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
    return this.state.top = !0, r;
  }
  inline(e, r = []) {
    return this.inlineQueue.push({ src: e, tokens: r }), r;
  }
  inlineTokens(e, r = []) {
    let s = e, n = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (n = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; ) l.includes(n[0].slice(n[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (n = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; ) s = s.slice(0, n.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (n = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; ) i = n[2] ? n[2].length : 0, s = s.slice(0, n.index + i) + "[" + "a".repeat(n[0].length - i - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let a = !1, u = "";
    for (; e; ) {
      a || (u = ""), a = !1;
      let l;
      if (this.options.extensions?.inline?.some((c) => (l = c.call({ lexer: this }, e, r)) ? (e = e.substring(l.raw.length), r.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.link(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(l.raw.length);
        let c = r.at(-1);
        l.type === "text" && c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : r.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(e, s, u)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.br(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.del(e, s, u)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(e))) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      let o = e;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, h = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, h), typeof f == "number" && f >= 0 && (c = Math.min(c, f));
        }), c < 1 / 0 && c >= 0 && (o = e.substring(0, c + 1));
      }
      if (l = this.tokenizer.inlineText(o)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (u = l.raw.slice(-1)), a = !0;
        let c = r.at(-1);
        c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : r.push(l);
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
}, Kt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || et;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: r }) {
    let s = (e || "").match(Se.notSpaceStart)?.[0], n = t.replace(Se.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + Oe(s) + '">' + (r ? n : Oe(n, !0)) + `</code></pre>
` : "<pre><code>" + (r ? n : Oe(n, !0)) + `</code></pre>
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
    let e = t.ordered, r = t.start, s = "";
    for (let a = 0; a < t.items.length; a++) {
      let u = t.items[a];
      s += this.listitem(u);
    }
    let n = e ? "ol" : "ul", i = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + n + i + `>
` + s + "</" + n + `>
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
    let e = "", r = "";
    for (let n = 0; n < t.header.length; n++) r += this.tablecell(t.header[n]);
    e += this.tablerow({ text: r });
    let s = "";
    for (let n = 0; n < t.rows.length; n++) {
      let i = t.rows[n];
      r = "";
      for (let a = 0; a < i.length; a++) r += this.tablecell(i[a]);
      s += this.tablerow({ text: r });
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
    let e = this.parser.parseInline(t.tokens), r = t.header ? "th" : "td";
    return (t.align ? `<${r} align="${t.align}">` : `<${r}>`) + e + `</${r}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${Oe(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: r }) {
    let s = this.parser.parseInline(r), n = gr(t);
    if (n === null) return s;
    t = n;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + Oe(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: r, tokens: s }) {
    s && (r = this.parser.parseInline(s, this.parser.textRenderer));
    let n = gr(t);
    if (n === null) return Oe(r);
    t = n;
    let i = `<img src="${t}" alt="${Oe(r)}"`;
    return e && (i += ` title="${Oe(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Oe(t.text);
  }
}, Hn = class {
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
}, Pe = class Sn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || et, this.options.renderer = this.options.renderer || new Kt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Hn();
  }
  static parse(e, r) {
    return new Sn(r).parse(e);
  }
  static parseInline(e, r) {
    return new Sn(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let s = 0; s < e.length; s++) {
      let n = e[s];
      if (this.options.extensions?.renderers?.[n.type]) {
        let a = n, u = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          r += u || "";
          continue;
        }
      }
      let i = n;
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
          let a = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let s = "";
    for (let n = 0; n < e.length; n++) {
      let i = e[n];
      if (this.options.extensions?.renderers?.[i.type]) {
        let u = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += u || "";
          continue;
        }
      }
      let a = i;
      switch (a.type) {
        case "escape": {
          s += r.text(a);
          break;
        }
        case "html": {
          s += r.html(a);
          break;
        }
        case "link": {
          s += r.link(a);
          break;
        }
        case "image": {
          s += r.image(a);
          break;
        }
        case "checkbox": {
          s += r.checkbox(a);
          break;
        }
        case "strong": {
          s += r.strong(a);
          break;
        }
        case "em": {
          s += r.em(a);
          break;
        }
        case "codespan": {
          s += r.codespan(a);
          break;
        }
        case "br": {
          s += r.br(a);
          break;
        }
        case "del": {
          s += r.del(a);
          break;
        }
        case "text": {
          s += r.text(a);
          break;
        }
        default: {
          let u = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return s;
  }
}, pt = class {
  options;
  block;
  constructor(t) {
    this.options = t || et;
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
    return this.block ? $e.lex : $e.lexInline;
  }
  provideParser() {
    return this.block ? Pe.parse : Pe.parseInline;
  }
}, Sa = class {
  defaults = $n();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Pe;
  Renderer = Kt;
  TextRenderer = Hn;
  Lexer = $e;
  Tokenizer = Xt;
  Hooks = pt;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let r = [];
    for (let s of t) switch (r = r.concat(e.call(this, s)), s.type) {
      case "table": {
        let n = s;
        for (let i of n.header) r = r.concat(this.walkTokens(i.tokens, e));
        for (let i of n.rows) for (let a of i) r = r.concat(this.walkTokens(a.tokens, e));
        break;
      }
      case "list": {
        let n = s;
        r = r.concat(this.walkTokens(n.items, e));
        break;
      }
      default: {
        let n = s;
        this.defaults.extensions?.childTokens?.[n.type] ? this.defaults.extensions.childTokens[n.type].forEach((i) => {
          let a = n[i].flat(1 / 0);
          r = r.concat(this.walkTokens(a, e));
        }) : n.tokens && (r = r.concat(this.walkTokens(n.tokens, e)));
      }
    }
    return r;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((r) => {
      let s = { ...r };
      if (s.async = this.defaults.async || s.async || !1, r.extensions && (r.extensions.forEach((n) => {
        if (!n.name) throw new Error("extension name required");
        if ("renderer" in n) {
          let i = e.renderers[n.name];
          i ? e.renderers[n.name] = function(...a) {
            let u = n.renderer.apply(this, a);
            return u === !1 && (u = i.apply(this, a)), u;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[n.level];
          i ? i.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), s.extensions = e), r.renderer) {
        let n = this.defaults.renderer || new Kt(this.defaults);
        for (let i in r.renderer) {
          if (!(i in n)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let a = i, u = r.renderer[a], l = n[a];
          n[a] = (...o) => {
            let c = u.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c || "";
          };
        }
        s.renderer = n;
      }
      if (r.tokenizer) {
        let n = this.defaults.tokenizer || new Xt(this.defaults);
        for (let i in r.tokenizer) {
          if (!(i in n)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let a = i, u = r.tokenizer[a], l = n[a];
          n[a] = (...o) => {
            let c = u.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c;
          };
        }
        s.tokenizer = n;
      }
      if (r.hooks) {
        let n = this.defaults.hooks || new pt();
        for (let i in r.hooks) {
          if (!(i in n)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, u = r.hooks[a], l = n[a];
          pt.passThroughHooks.has(i) ? n[a] = (o) => {
            if (this.defaults.async && pt.passThroughHooksRespectAsync.has(i)) return (async () => {
              let h = await u.call(n, o);
              return l.call(n, h);
            })();
            let c = u.call(n, o);
            return l.call(n, c);
          } : n[a] = (...o) => {
            if (this.defaults.async) return (async () => {
              let h = await u.apply(n, o);
              return h === !1 && (h = await l.apply(n, o)), h;
            })();
            let c = u.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c;
          };
        }
        s.hooks = n;
      }
      if (r.walkTokens) {
        let n = this.defaults.walkTokens, i = r.walkTokens;
        s.walkTokens = function(a) {
          let u = [];
          return u.push(i.call(this, a)), n && (u = u.concat(n.call(this, a))), u;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return $e.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Pe.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, r) => {
      let s = { ...r }, n = { ...this.defaults, ...s }, i = this.onError(!!n.silent, !!n.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (n.hooks && (n.hooks.options = n, n.hooks.block = t), n.async) return (async () => {
        let a = n.hooks ? await n.hooks.preprocess(e) : e, u = await (n.hooks ? await n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(a, n), l = n.hooks ? await n.hooks.processAllTokens(u) : u;
        n.walkTokens && await Promise.all(this.walkTokens(l, n.walkTokens));
        let o = await (n.hooks ? await n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(l, n);
        return n.hooks ? await n.hooks.postprocess(o) : o;
      })().catch(i);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let a = (n.hooks ? n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(e, n);
        n.hooks && (a = n.hooks.processAllTokens(a)), n.walkTokens && this.walkTokens(a, n.walkTokens);
        let u = (n.hooks ? n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(a, n);
        return n.hooks && (u = n.hooks.postprocess(u)), u;
      } catch (a) {
        return i(a);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + Oe(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Je = new Sa();
function ne(t, e) {
  return Je.parse(t, e);
}
ne.options = ne.setOptions = function(t) {
  return Je.setOptions(t), ne.defaults = Je.defaults, Zr(ne.defaults), ne;
};
ne.getDefaults = $n;
ne.defaults = et;
ne.use = function(...t) {
  return Je.use(...t), ne.defaults = Je.defaults, Zr(ne.defaults), ne;
};
ne.walkTokens = function(t, e) {
  return Je.walkTokens(t, e);
};
ne.parseInline = Je.parseInline;
ne.Parser = Pe;
ne.parser = Pe.parse;
ne.Renderer = Kt;
ne.TextRenderer = Hn;
ne.Lexer = $e;
ne.lexer = $e.lex;
ne.Tokenizer = Xt;
ne.Hooks = pt;
ne.parse = ne;
ne.options;
ne.setOptions;
ne.use;
ne.walkTokens;
ne.parseInline;
Pe.parse;
$e.lex;
const ii = `function j() {
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
`, br = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", ii], { type: "text/javascript;charset=utf-8" });
function va(t) {
  let e;
  try {
    if (e = br && (self.URL || self.webkitURL).createObjectURL(br), !e) throw "";
    const r = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return r.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), r;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(ii),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function Aa(t) {
  if (t.startsWith("---")) {
    const e = t.indexOf(`
---`, 3);
    if (e !== -1) {
      const r = t.slice(3, e + 0).trim(), s = t.slice(e + 4).trimStart(), n = {};
      return r.split(/\r?\n/).forEach((i) => {
        const a = i.match(/^([^:]+):\s*(.*)$/);
        a && (n[a[1].trim()] = a[2].trim());
      }), { content: s, data: n };
    }
  }
  return { content: t, data: {} };
}
const si = Ir(() => new va(), "markdown"), yr = typeof DOMParser < "u" ? new DOMParser() : null;
function vn() {
  return si.get();
}
function Ea(t) {
  return si.send(t, 1e3);
}
const Qe = [];
function An(t) {
  if (t && typeof t == "object") {
    Qe.push(t);
    try {
      ne.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function Ra(t) {
  Qe.length = 0, Array.isArray(t) && Qe.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Qe.forEach((e) => ne.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Yt(t) {
  if (vn && vn())
    try {
      const i = await Ea({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const u = (yr || new DOMParser()).parseFromString(i.html, "text/html"), l = u.querySelectorAll("h1,h2,h3,h4,h5,h6");
          l.forEach((h) => {
            h.id || (h.id = re(h.textContent || ""));
          });
          try {
            u.querySelectorAll("img").forEach((f) => {
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
            u.querySelectorAll("pre code").forEach((f) => {
              try {
                const p = f.getAttribute && f.getAttribute("class") || f.className || "", d = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
                if (d)
                  try {
                    f.setAttribute && f.setAttribute("class", d);
                  } catch (y) {
                    console.warn("[markdown] set code class failed", y), f.className = d;
                  }
                else
                  try {
                    f.removeAttribute && f.removeAttribute("class");
                  } catch (y) {
                    console.warn("[markdown] remove code class failed", y), f.className = "";
                  }
                const m = d, w = m.match(/language-([a-zA-Z0-9_+-]+)/) || m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!w || !w[1])
                  try {
                    const y = f.textContent || "";
                    try {
                      if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                        const x = le.highlight(y, { language: "plaintext" });
                        x && x.value && (f.innerHTML = x.value);
                      }
                    } catch {
                      try {
                        le.highlightElement(f);
                      } catch (B) {
                        console.warn("[markdown] hljs.highlightElement failed", B);
                      }
                    }
                  } catch (y) {
                    console.warn("[markdown] code auto-detect failed", y);
                  }
              } catch (p) {
                console.warn("[markdown] processing code blocks failed", p);
              }
            });
          } catch (h) {
            console.warn("[markdown] query code blocks failed", h);
          }
          const o = u.body.innerHTML, c = [];
          return l.forEach((h) => {
            c.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || "").trim(), id: h.id });
          }), { html: o, meta: i.meta || {}, toc: c };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), i;
        }
    } catch (i) {
      console.warn("[markdown] worker render failed", i);
    }
  const { content: r, data: s } = Aa(t || "");
  if (ne.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Qe && Qe.length)
    try {
      Qe.forEach((i) => ne.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let n = ne.parse(r);
  try {
    const a = (yr || new DOMParser()).parseFromString(n, "text/html"), u = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    u.forEach((o) => {
      o.id || (o.id = re(o.textContent || ""));
    });
    try {
      a.querySelectorAll("img").forEach((c) => {
        try {
          c.getAttribute("loading") || c.setAttribute("data-want-lazy", "1");
        } catch (h) {
          console.warn("[markdown] set image loading attribute failed", h);
        }
      });
    } catch (o) {
      console.warn("[markdown] query images failed", o);
    }
    try {
      a.querySelectorAll("pre code").forEach((c) => {
        try {
          const h = c.getAttribute && c.getAttribute("class") || c.className || "", f = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (f)
            try {
              c.setAttribute && c.setAttribute("class", f);
            } catch (m) {
              console.warn("[markdown] set code class failed", m), c.className = f;
            }
          else
            try {
              c.removeAttribute && c.removeAttribute("class");
            } catch (m) {
              console.warn("[markdown] remove code class failed", m), c.className = "";
            }
          const p = f, d = p.match(/language-([a-zA-Z0-9_+-]+)/) || p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!d || !d[1])
            try {
              const m = c.textContent || "";
              try {
                if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                  const w = le.highlight(m, { language: "plaintext" });
                  w && w.value && (c.innerHTML = w.value);
                }
              } catch {
                try {
                  le.highlightElement(c);
                } catch (y) {
                  console.warn("[markdown] hljs.highlightElement failed", y);
                }
              }
            } catch (m) {
              console.warn("[markdown] code auto-detect failed", m);
            }
        } catch (h) {
          console.warn("[markdown] processing code blocks failed", h);
        }
      });
    } catch (o) {
      console.warn("[markdown] query code blocks failed", o);
    }
    n = a.body.innerHTML;
    const l = [];
    return u.forEach((o) => {
      l.push({ level: Number(o.tagName.substring(1)), text: (o.textContent || "").trim(), id: o.id });
    }), { html: a.body.innerHTML, meta: s || {}, toc: l };
  } catch (i) {
    console.warn("post-process markdown failed", i);
  }
  return { html: n, meta: s || {}, toc: [] };
}
function En(t, e) {
  const r = /* @__PURE__ */ new Set(), s = /```\s*([a-zA-Z0-9_\-+]+)?/g, n = /* @__PURE__ */ new Set([
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
      const u = a[1].toLowerCase();
      if (Lr.has(u) || e && e.size && u.length < 3 && !e.has(u) && !(Re && Re[u] && e.has(Re[u]))) continue;
      if (e && e.size) {
        if (e.has(u)) {
          const o = e.get(u);
          o && r.add(o);
          continue;
        }
        if (Re && Re[u]) {
          const o = Re[u];
          if (e.has(o)) {
            const c = e.get(o) || o;
            r.add(c);
            continue;
          }
        }
      }
      (i.has(u) || u.length >= 5 && u.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(u) && !n.has(u)) && r.add(u);
    }
  return r;
}
const Ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: An,
  detectFenceLanguages: En,
  initRendererWorker: vn,
  markdownPlugins: Qe,
  parseMarkdownToHtml: Yt,
  setMarkdownExtensions: Ra
}, Symbol.toStringTag, { value: "Module" }));
function Ca(t, e) {
  const r = document.createElement("aside");
  r.className = "menu nimbi-nav";
  const s = document.createElement("p");
  s.className = "menu-label", s.textContent = t("navigation"), r.appendChild(s);
  const n = document.createElement("ul");
  return n.className = "menu-list", e.forEach((i) => {
    const a = document.createElement("li"), u = document.createElement("a");
    if (u.href = "#" + i.path, u.textContent = i.name, a.appendChild(u), i.children && i.children.length) {
      const l = document.createElement("ul");
      i.children.forEach((o) => {
        const c = document.createElement("li"), h = document.createElement("a");
        h.href = "#" + o.path, h.textContent = o.name, c.appendChild(h), l.appendChild(c);
      }), a.appendChild(l);
    }
    n.appendChild(a);
  }), r.appendChild(n), r;
}
function La(t, e, r = "") {
  const s = document.createElement("aside");
  s.className = "menu nimbi-toc-inner";
  const n = document.createElement("p");
  n.className = "menu-label", n.textContent = t("onThisPage"), s.appendChild(n);
  const i = document.createElement("ul");
  return i.className = "menu-list", (e || []).forEach((a) => {
    try {
      if (!a || a.level === 1) return;
      const u = document.createElement("li"), l = document.createElement("a"), o = a.id || re(a.text || "");
      l.textContent = a.text || "";
      try {
        const c = String(r || "").replace(/^[\.\/]+/, ""), h = c && U && U.has && U.has(c) ? U.get(c) : c;
        h ? l.href = `?page=${encodeURIComponent(h)}#${encodeURIComponent(o)}` : l.href = `#${encodeURIComponent(o)}`;
      } catch (c) {
        console.warn("[htmlBuilder] buildTocElement href normalization failed", c), l.href = `#${encodeURIComponent(o)}`;
      }
      u.appendChild(l), i.appendChild(u);
    } catch (u) {
      console.warn("[htmlBuilder] buildTocElement item failed", u, a);
    }
  }), s.appendChild(i), s;
}
function ai(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((r) => {
    r.id || (r.id = re(r.textContent || ""));
  });
}
function _a(t, e, r) {
  try {
    const s = t.querySelectorAll("img");
    if (s && s.length) {
      const n = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      s.forEach((i) => {
        const a = i.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const u = new URL(n + a, r).toString();
            i.src = u;
            try {
              i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (u) {
            console.warn("[htmlBuilder] resolve image src failed", u);
          }
      });
    }
  } catch (s) {
    console.warn("[htmlBuilder] lazyLoadImages failed", s);
  }
}
function kr(t, e, r) {
  try {
    const s = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
    let n = null;
    try {
      const a = new URL(r, location.href);
      n = new URL(s || ".", a).toString();
    } catch {
      try {
        n = new URL(s || ".", location.href).toString();
      } catch {
        n = s || "./";
      }
    }
    const i = t.querySelectorAll("*");
    for (const a of Array.from(i || []))
      try {
        const u = a.tagName ? a.tagName.toLowerCase() : "", l = (o) => {
          try {
            const c = a.getAttribute(o) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              a.setAttribute(o, new URL(c, n).toString());
            } catch (h) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", o, c, h);
            }
          } catch (c) {
            console.warn("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && l("src"), a.hasAttribute && a.hasAttribute("href") && u !== "a" && l("href"), a.hasAttribute && a.hasAttribute("xlink:href") && l("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && l("poster"), a.hasAttribute("srcset")) {
          const h = (a.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [p, d] = f.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return f;
            try {
              const m = new URL(p, n).toString();
              return d ? `${m} ${d}` : m;
            } catch {
              return f;
            }
          }).join(", ");
          a.setAttribute("srcset", h);
        }
      } catch (u) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", u);
      }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", s);
  }
}
let xr = "", dn = null, Sr = "";
async function li(t, e, r) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let n, i;
    if (e === xr && dn)
      n = dn, i = Sr;
    else {
      try {
        n = new URL(e, location.href), i = vt(n.pathname);
      } catch {
        try {
          n = new URL(e, location.href), i = vt(n.pathname);
        } catch {
          n = null, i = "/";
        }
      }
      xr = e, dn = n, Sr = i;
    }
    const a = /* @__PURE__ */ new Set(), u = [], l = /* @__PURE__ */ new Set(), o = [];
    for (const c of Array.from(s))
      try {
        const h = c.getAttribute("href") || "";
        if (!h || zr(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const p = new URL(h, e || location.href), d = p.searchParams.get("page");
              if (d && d.indexOf("/") === -1 && r) {
                const m = r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "";
                if (m) {
                  const w = ce(m + d);
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
          !p.startsWith("/") && r && (p = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + p);
          try {
            const m = new URL(p, e).pathname;
            let w = m.startsWith(i) ? m.slice(i.length) : m;
            w = ce(w), u.push({ node: c, mdPathRaw: p, frag: d, rel: w }), U.has(w) || a.add(w);
          } catch (m) {
            console.warn("[htmlBuilder] resolve mdPath failed", m);
          }
          continue;
        }
        try {
          let p = h;
          !h.startsWith("/") && r && (h.startsWith("#") ? p = r + h : p = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + h);
          const m = new URL(p, e).pathname || "";
          if (m && m.indexOf(i) !== -1) {
            let w = m.startsWith(i) ? m.slice(i.length) : m;
            if (w = ce(w), w = At(w), w || (w = "_home"), !w.endsWith(".md")) {
              let y = null;
              try {
                if (U && U.has && U.has(w))
                  y = U.get(w);
                else
                  try {
                    const x = String(w || "").replace(/^.*\//, "");
                    x && U.has && U.has(x) && (y = U.get(x));
                  } catch (x) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", x);
                  }
              } catch (x) {
                console.warn("[htmlBuilder] mdToSlug access check failed", x);
              }
              if (!y)
                try {
                  const x = String(w || "").replace(/^.*\//, "");
                  for (const [B, I] of K || [])
                    if (I === w || I === x) {
                      y = B;
                      break;
                    }
                } catch {
                }
              y ? c.setAttribute("href", `?page=${encodeURIComponent(y)}`) : (l.add(w), o.push({ node: c, rel: w }));
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
          if (p && K.has(p)) {
            try {
              const d = K.get(p);
              if (d)
                try {
                  U.set(d, p);
                } catch (m) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", m);
                }
            } catch (d) {
              console.warn("[htmlBuilder] reading slugToMd failed", d);
            }
            return;
          }
        } catch (f) {
          console.warn("[htmlBuilder] basename slug lookup failed", f);
        }
        const h = await be(c, e);
        if (h && h.raw) {
          const f = (h.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = re(f[1].trim());
            if (p)
              try {
                K.set(p, c), U.set(c, p);
              } catch (d) {
                console.warn("[htmlBuilder] setting slug mapping failed", d);
              }
          }
        }
      } catch (h) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
      }
    })), l.size && await Promise.all(Array.from(l).map(async (c) => {
      try {
        const h = await be(c, e);
        if (h && h.raw)
          try {
            const p = (Un || new DOMParser()).parseFromString(h.raw, "text/html"), d = p.querySelector("title"), m = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
            if (w) {
              const y = re(w);
              if (y)
                try {
                  K.set(y, c), U.set(c, y);
                } catch (x) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", x);
                }
            }
          } catch (f) {
            console.warn("[htmlBuilder] parse fetched HTML failed", f);
          }
      } catch (h) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", h);
      }
    }));
    for (const c of u) {
      const { node: h, frag: f, rel: p } = c;
      let d = null;
      try {
        U.has(p) && (d = U.get(p));
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug access failed", m);
      }
      d ? f ? h.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(d)}`) : f ? h.setAttribute("href", `?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(p)}`);
    }
    for (const c of o) {
      const { node: h, rel: f } = c;
      let p = null;
      try {
        U.has(f) && (p = U.get(f));
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", d);
      }
      if (!p)
        try {
          const d = String(f || "").replace(/^.*\//, "");
          U.has(d) && (p = U.get(d));
        } catch (d) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", d);
        }
      p ? h.setAttribute("href", `?page=${encodeURIComponent(p)}`) : h.setAttribute("href", `?page=${encodeURIComponent(f)}`);
    }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteAnchors failed", s);
  }
}
function Ma(t, e, r, s) {
  const n = e.querySelector("h1"), i = n ? (n.textContent || "").trim() : "";
  let a = "";
  try {
    i && (a = re(i)), !a && t && t.meta && t.meta.title && (a = re(t.meta.title)), !a && r && (a = re(String(r))), a || (a = "_home");
    try {
      r && (K.set(a, r), U.set(r, a));
    } catch (u) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", u);
    }
    try {
      let u = "?page=" + encodeURIComponent(a);
      try {
        const l = s || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        l && (u += "#" + encodeURIComponent(l));
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", l);
      }
      try {
        history.replaceState({ page: a }, "", u);
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug history replace failed", l);
      }
    } catch (u) {
      console.warn("[htmlBuilder] computeSlug inner failed", u);
    }
  } catch (u) {
    console.warn("[htmlBuilder] computeSlug failed", u);
  }
  return { topH1: n, h1Text: i, slugKey: a };
}
async function $a(t, e) {
  if (!t || !t.length) return;
  const r = /* @__PURE__ */ new Set();
  for (const l of Array.from(t || []))
    try {
      const o = l.getAttribute("href") || "";
      if (!o) continue;
      let f = ce(o).split(/::|#/, 2)[0];
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const p = f;
      try {
        if (U && U.has && U.has(p)) continue;
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const m of K.values())
          if (m === p) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        console.warn("[htmlBuilder] slugToMd iteration failed", d);
      }
      r.add(p);
    } catch (o) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", o);
    }
  if (!r.size) return;
  const s = async (l) => {
    try {
      const o = await be(l, e);
      if (o && o.raw)
        try {
          const h = (Un || new DOMParser()).parseFromString(o.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const m = re(d);
            if (m)
              try {
                K.set(m, l), U.set(l, m);
              } catch (w) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", w);
              }
          }
        } catch (c) {
          console.warn("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (o) {
      console.warn("[htmlBuilder] fetchAndExtract failed", o);
    }
  }, n = 5, i = Array.from(r);
  let a = 0;
  const u = [];
  for (; a < i.length; ) {
    const l = i.slice(a, a + n);
    u.push(Promise.all(l.map(s))), a += n;
  }
  await Promise.all(u);
}
async function Pa(t, e) {
  if (!t || !t.length) return;
  const r = [], s = /* @__PURE__ */ new Set();
  let n = "";
  try {
    const i = new URL(e);
    n = vt(i.pathname);
  } catch (i) {
    n = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", i);
  }
  for (const i of Array.from(t || []))
    try {
      const a = i.getAttribute("href") || "";
      if (!a) continue;
      const u = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (u) {
        let l = ce(u[1]);
        try {
          let o;
          try {
            o = new URL(l, e).pathname;
          } catch (h) {
            o = l, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const c = o.startsWith(n) ? o.slice(n.length) : o.replace(/^\//, "");
          r.push({ rel: c }), U.has(c) || s.add(c);
        } catch (o) {
          console.warn("[htmlBuilder] rewriteAnchors failed", o);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  s.size && await Promise.all(Array.from(s).map(async (i) => {
    try {
      const a = String(i).match(/([^\/]+)\.md$/), u = a && a[1];
      if (u && K.has(u)) {
        try {
          const l = K.get(u);
          l && U.set(l, u);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await be(i, e);
      if (a && a.raw) {
        const u = (a.raw || "").match(/^#\s+(.+)$/m);
        if (u && u[1]) {
          const l = re(u[1].trim());
          if (l)
            try {
              K.set(l, i), U.set(i, l);
            } catch (o) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", o);
            }
        }
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", a);
    }
  }));
}
const Un = typeof DOMParser < "u" ? new DOMParser() : null;
function pn(t) {
  try {
    const r = (Un || new DOMParser()).parseFromString(t || "", "text/html");
    ai(r);
    try {
      r.querySelectorAll("img").forEach((u) => {
        try {
          u.getAttribute("loading") || u.setAttribute("data-want-lazy", "1");
        } catch (l) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", l);
        }
      });
    } catch (a) {
      console.warn("[htmlBuilder] parseHtml query images failed", a);
    }
    r.querySelectorAll("pre code, code[class]").forEach((a) => {
      try {
        const u = a.getAttribute && a.getAttribute("class") || a.className || "", l = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), c = V.size && (V.get(o) || V.get(String(o).toLowerCase())) || o;
          try {
            (async () => {
              try {
                await St(c);
              } catch (h) {
                console.warn("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
              const o = le.highlight ? le.highlight(a.textContent || "", { language: "plaintext" }) : null;
              o && o.value && (a.innerHTML = o.value);
            }
          } catch (o) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", o);
          }
      } catch (u) {
        console.warn("[htmlBuilder] code element processing failed", u);
      }
    });
    const n = [];
    return r.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((a) => {
      n.push({ level: Number(a.tagName.substring(1)), text: (a.textContent || "").trim(), id: a.id });
    }), { html: r.body.innerHTML, meta: {}, toc: n };
  } catch (e) {
    return console.warn("[htmlBuilder] parseHtml failed", e), { html: t || "", meta: {}, toc: [] };
  }
}
async function Ia(t) {
  const e = En ? En(t || "", V) : /* @__PURE__ */ new Set(), r = new Set(e), s = [];
  for (const n of r)
    try {
      const i = V.size && (V.get(n) || V.get(String(n).toLowerCase())) || n;
      try {
        s.push(St(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(n) !== String(i))
        try {
          s.push(St(n));
        } catch (a) {
          console.warn("[htmlBuilder] ensureLanguages push alias failed", a);
        }
    } catch (i) {
      console.warn("[htmlBuilder] ensureLanguages inner failed", i);
    }
  try {
    await Promise.all(s);
  } catch (n) {
    console.warn("[htmlBuilder] ensureLanguages failed", n);
  }
}
async function za(t) {
  if (await Ia(t), Yt) {
    const e = await Yt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Ba(t, e, r, s, n) {
  let i = null;
  if (e.isHtml)
    try {
      const h = typeof DOMParser < "u" ? new DOMParser() : null;
      if (h) {
        const f = h.parseFromString(e.raw || "", "text/html");
        try {
          kr(f.body, r, n);
        } catch (p) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", p);
        }
        i = pn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : e.raw || "");
      } else
        i = pn(e.raw || "");
    } catch {
      i = pn(e.raw || "");
    }
  else
    i = await za(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    kr(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    ai(a);
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
          } catch (m) {
            f.className = d, console.warn("[htmlBuilder] set element class failed", m);
          }
        else
          try {
            f.removeAttribute && f.removeAttribute("class");
          } catch (m) {
            f.className = "", console.warn("[htmlBuilder] remove element class failed", m);
          }
      } catch (p) {
        console.warn("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (h) {
    console.warn("[htmlBuilder] processing code elements failed", h);
  }
  try {
    ls(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  _a(a, r, n);
  const { topH1: u, h1Text: l, slugKey: o } = Ma(i, a, r, s);
  try {
    await Oa(a, n, r);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await li(a, n, r);
  }
  const c = La(t, i.toc, r);
  return { article: a, parsed: i, toc: c, topH1: u, h1Text: l, slugKey: o };
}
function vr(t, e, r) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const n = document.createElement("h1");
  n.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = r && r.message ? String(r.message) : "Failed to resolve the requested page.", s.appendChild(n), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function Oa(t, e, r) {
  return li(t, e, r);
}
function Na(t) {
  try {
    t.addEventListener("click", (e) => {
      const r = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!r) return;
      const s = r.getAttribute("href") || "";
      try {
        const n = new URL(s, location.href), i = n.searchParams.get("page"), a = n.hash ? n.hash.replace(/^#/, "") : null;
        if (!i && !a) return;
        e.preventDefault();
        let u = null;
        try {
          history && history.state && history.state.page && (u = history.state.page);
        } catch (l) {
          u = null, console.warn("[htmlBuilder] access history.state failed", l);
        }
        try {
          u || (u = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          console.warn("[htmlBuilder] parse current location failed", l);
        }
        if (!i && a || i && u && String(i) === String(u)) {
          try {
            if (!i && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: u || i }, "", "?page=" + encodeURIComponent(u || i) + (a ? "#" + encodeURIComponent(a) : ""));
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
            Rn(a);
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
      } catch (n) {
        console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", n);
      }
    });
  } catch (e) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", e);
  }
}
function Rn(t) {
  const e = document.querySelector(".nimbi-cms") || null;
  if (t) {
    const r = document.getElementById(t);
    if (r)
      try {
        const s = () => {
          try {
            if (e && e.scrollTo && e.contains(r)) {
              const n = r.getBoundingClientRect().top - e.getBoundingClientRect().top + e.scrollTop;
              e.scrollTo({ top: n, behavior: "smooth" });
            } else
              try {
                r.scrollIntoView({ behavior: "smooth", block: "start" });
              } catch {
                try {
                  r.scrollIntoView();
                } catch (i) {
                  console.warn("[htmlBuilder] scrollIntoView failed", i);
                }
              }
          } catch {
            try {
              r.scrollIntoView();
            } catch (i) {
              console.warn("[htmlBuilder] final scroll fallback failed", i);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(s, 50));
        } catch (n) {
          console.warn("[htmlBuilder] scheduling scroll failed", n), setTimeout(s, 50);
        }
      } catch (s) {
        try {
          r.scrollIntoView();
        } catch (n) {
          console.warn("[htmlBuilder] final scroll fallback failed", n);
        }
        console.warn("[htmlBuilder] doScroll failed", s);
      }
  } else
    try {
      e && e.scrollTo ? e.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (r) {
      try {
        window.scrollTo(0, 0);
      } catch (s) {
        console.warn("[htmlBuilder] window.scrollTo failed", s);
      }
      console.warn("[htmlBuilder] scroll to top failed", r);
    }
}
function Da(t, e, { mountOverlay: r = null, container: s = null, mountEl: n = null, navWrap: i = null, t: a = null } = {}) {
  try {
    const u = a || ((m) => typeof m == "string" ? m : ""), l = s || document.querySelector(".nimbi-cms"), o = n || document.querySelector(".nimbi-mount"), c = r || document.querySelector(".nimbi-overlay"), h = i || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top button is-primary is-rounded is-small", p.setAttribute("aria-label", u("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(p) : l && l.appendChild ? l.appendChild(p) : o && o.appendChild ? o.appendChild(p) : document.body.appendChild(p);
      } catch {
        try {
          document.body.appendChild(p);
        } catch (w) {
          console.warn("[htmlBuilder] append scroll top button failed", w);
        }
      }
      try {
        p.style.position = "absolute", p.style.right = "1rem", p.style.bottom = "1.25rem", p.style.zIndex = "60";
      } catch (m) {
        console.warn("[htmlBuilder] set scroll-top button styles failed", m);
      }
      p.addEventListener("click", () => {
        try {
          s && s.scrollTo ? s.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : n && n.scrollTo ? n.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            s && (s.scrollTop = 0);
          } catch (w) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", w);
          }
          try {
            n && (n.scrollTop = 0);
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
        const m = new IntersectionObserver((w) => {
          for (const y of w)
            y.target instanceof Element && (y.isIntersecting ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show")));
        }, { root: s instanceof Element ? s : n instanceof Element ? n : null, threshold: 0 });
        p._nimbiObserver = m;
      }
      try {
        p._nimbiObserver.disconnect();
      } catch (m) {
        console.warn("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        p._nimbiObserver.observe(e);
      } catch (m) {
        console.warn("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const w = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, y = e.getBoundingClientRect();
            !(y.bottom < w.top || y.top > w.bottom) ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show"));
          } catch (w) {
            console.warn("[htmlBuilder] checkIntersect failed", w);
          }
        };
        m(), "IntersectionObserver" in window || setTimeout(m, 100);
      } catch (m) {
        console.warn("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      p.classList.remove("show"), d && d.classList.remove("show");
      const m = s instanceof Element ? s : n instanceof Element ? n : window, w = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (p.classList.add("show"), d && d.classList.add("show")) : (p.classList.remove("show"), d && d.classList.remove("show"));
        } catch (y) {
          console.warn("[htmlBuilder] onScroll handler failed", y);
        }
      };
      Wt(() => m.addEventListener("scroll", w)), w();
    }
  } catch (u) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", u);
  }
}
async function Ha(t, e, r, s, n, i, a, u, l = "eager", o = 1, c = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, f = h ? h.parseFromString(r || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Wt(() => $a(p, s)), await Wt(() => Pa(p, s));
  let d = null, m = null, w = !1;
  const y = document.createElement("nav");
  y.className = "navbar", y.setAttribute("role", "navigation"), y.setAttribute("aria-label", "main navigation");
  const x = document.createElement("div");
  x.className = "navbar-brand";
  const B = p[0], I = document.createElement("a");
  if (I.className = "navbar-item", B) {
    const T = B.getAttribute("href") || "#";
    try {
      const C = new URL(T, location.href).searchParams.get("page");
      C ? I.href = "?page=" + encodeURIComponent(decodeURIComponent(C)) : (I.href = "?page=" + encodeURIComponent(n), I.textContent = i("home"));
    } catch {
      I.href = "?page=" + encodeURIComponent(n), I.textContent = i("home");
    }
  } else
    I.href = "?page=" + encodeURIComponent(n), I.textContent = i("home");
  x.appendChild(I), I.addEventListener("click", function(T) {
    const $ = I.getAttribute("href") || "";
    if ($.startsWith("?page=")) {
      T.preventDefault();
      const C = new URL($, location.href), v = C.searchParams.get("page"), b = C.hash ? C.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", "?page=" + encodeURIComponent(v) + (b ? "#" + encodeURIComponent(b) : ""));
      try {
        a();
      } catch (E) {
        console.warn("[nimbi-cms] renderByQuery failed", E);
      }
    }
  });
  const A = document.createElement("a");
  A.className = "navbar-burger", A.setAttribute("role", "button"), A.setAttribute("aria-label", "menu"), A.setAttribute("aria-expanded", "false");
  const q = "nimbi-navbar-menu";
  A.dataset.target = q, A.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', x.appendChild(A);
  try {
    A.addEventListener("click", (T) => {
      try {
        const $ = A.dataset && A.dataset.target ? A.dataset.target : null, C = $ ? document.getElementById($) : null;
        A.classList.contains("is-active") ? (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active")) : (A.classList.add("is-active"), A.setAttribute("aria-expanded", "true"), C && C.classList.add("is-active"));
      } catch ($) {
        console.warn("[nimbi-cms] navbar burger toggle failed", $);
      }
    });
  } catch (T) {
    console.warn("[nimbi-cms] burger event binding failed", T);
  }
  const O = document.createElement("div");
  O.className = "navbar-menu", O.id = q;
  const G = document.createElement("div");
  G.className = "navbar-start";
  let Y, te, P;
  if (!u)
    Y = null, m = null, P = null;
  else {
    Y = document.createElement("div"), Y.className = "navbar-end", te = document.createElement("div"), te.className = "navbar-item", te.style.position = "relative", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = i("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0, m.classList.add("is-loading")), te.appendChild(m), P = document.createElement("div"), P.id = "nimbi-search-results", P.className = "box", P.style.position = "absolute", P.style.top = "100%", P.style.right = "0", P.style.left = "auto", P.style.zIndex = "10000", P.style.minWidth = "240px", P.style.maxWidth = "420px", P.style.maxHeight = "50vh", P.style.overflowY = "auto", P.style.display = "none", P.style.padding = "8px", P.style.boxShadow = "0 6px 18px rgba(10,10,10,0.1)", te.appendChild(P), Y.appendChild(te);
    const T = (C) => {
      if (P.innerHTML = "", !C.length) {
        P.style.display = "none";
        return;
      }
      C.forEach((v) => {
        const b = document.createElement("div");
        if (b.style.marginBottom = "6px", b.style.padding = "6px", b.style.borderBottom = "1px solid rgba(0,0,0,0.06)", v.parentTitle) {
          const M = document.createElement("div");
          M.textContent = v.parentTitle, M.style.fontSize = "11px", M.style.opacity = "0.7", M.style.marginBottom = "4px", M.className = "nimbi-search-parent", M.style.whiteSpace = "nowrap", M.style.overflow = "hidden", M.style.textOverflow = "ellipsis", M.style.display = "block", M.style.maxWidth = "100%", b.appendChild(M);
        }
        const E = document.createElement("a");
        E.className = "block", E.href = "?page=" + encodeURIComponent(v.slug), E.textContent = v.title, E.style.whiteSpace = "nowrap", E.style.overflow = "hidden", E.style.textOverflow = "ellipsis", E.addEventListener("click", () => {
          P.style.display = "none";
        }), b.appendChild(E), P.appendChild(b);
      }), P.style.display = "block", P.style.right = "0", P.style.left = "auto";
    }, $ = (C, v) => {
      let b = null;
      return (...E) => {
        b && clearTimeout(b), b = setTimeout(() => C(...E), v);
      };
    };
    if (m) {
      const C = $(async () => {
        const v = document.querySelector("input#nimbi-search"), b = String(v && v.value || "").trim().toLowerCase();
        if (!b) {
          T([]);
          return;
        }
        try {
          const E = await Promise.resolve().then(() => Ut);
          d || (d = (async () => {
            try {
              return l === "lazy" && E.buildSearchIndexWorker ? E.buildSearchIndexWorker(s, o, c) : E.buildSearchIndex(s, o, c);
            } catch (Q) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", Q), [];
            } finally {
              v && (v.removeAttribute("disabled"), v.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((Q) => Q.title && Q.title.toLowerCase().includes(b) || Q.excerpt && Q.excerpt.toLowerCase().includes(b));
          T(k.slice(0, 10));
        } catch (E) {
          console.warn("[nimbi-cms] search input handler failed", E), T([]);
        }
      }, 50);
      m && m.addEventListener("input", C), document.addEventListener("click", (v) => {
        const b = document.querySelector("input#nimbi-search");
        b && !b.contains(v.target) && P && !P.contains(v.target) && (P.style.display = "none");
      });
    }
    if (l === "eager") {
      try {
        d = (async () => {
          try {
            const v = await (await Promise.resolve().then(() => Ut)).buildSearchIndex(s, o, c);
            return w || (w = !0), v;
          } catch (C) {
            return console.warn("[nimbi-cms] buildSearchIndex failed", C), [];
          }
        })();
      } catch (C) {
        console.warn("[nimbi-cms] eager search index init failed", C), d = Promise.resolve([]);
      }
      d.finally(() => {
        const C = document.querySelector("input#nimbi-search");
        C && (C.removeAttribute("disabled"), C.classList.remove("is-loading"));
      });
    }
  }
  for (let T = 0; T < p.length; T++) {
    const $ = p[T];
    if (T === 0) continue;
    const C = $.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(C) || C.endsWith(".md")) {
        const E = ce(C).split(/::|#/, 2), M = E[0], k = E[1];
        v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
      } else if (/\.html(?:$|[#?])/.test(C) || C.endsWith(".html")) {
        const E = ce(C).split(/::|#/, 2);
        let M = E[0];
        M && !M.toLowerCase().endsWith(".html") && (M = M + ".html");
        const k = E[1];
        try {
          const Q = await be(M, s);
          if (Q && Q.raw)
            try {
              const oe = new DOMParser().parseFromString(Q.raw, "text/html"), Le = oe.querySelector("title"), ve = oe.querySelector("h1"), Ae = Le && Le.textContent && Le.textContent.trim() ? Le.textContent.trim() : ve && ve.textContent ? ve.textContent.trim() : null;
              if (Ae) {
                const fe = re(Ae);
                if (fe) {
                  try {
                    K.set(fe, M), U.set(M, fe);
                  } catch (Ie) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ie);
                  }
                  v.href = "?page=" + encodeURIComponent(fe) + (k ? "#" + encodeURIComponent(k) : "");
                } else
                  v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
              } else
                v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
            } catch {
              v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
            }
          else
            v.href = C;
        } catch {
          v.href = C;
        }
      } else
        v.href = C;
    } catch (b) {
      console.warn("[nimbi-cms] nav item href parse failed", b), v.href = C;
    }
    try {
      const b = $.textContent && String($.textContent).trim() ? String($.textContent).trim() : null;
      if (b)
        try {
          const E = re(b);
          if (E) {
            const M = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const Q = new URL(M, location.href).searchParams.get("page");
              if (Q) {
                const ue = decodeURIComponent(Q);
                try {
                  K.set(E, ue), U.set(ue, E);
                } catch (oe) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", oe);
                }
              }
            } catch (k) {
              console.warn("[nimbi-cms] nav slug mapping failed", k);
            }
          }
        } catch (E) {
          console.warn("[nimbi-cms] nav slug mapping failed", E);
        }
    } catch (b) {
      console.warn("[nimbi-cms] nav slug mapping failed", b);
    }
    v.textContent = $.textContent || C, G.appendChild(v);
  }
  try {
    m = document.getElementById("nimbi-search");
    const T = document.getElementById("nimbi-search-results"), $ = (v) => {
      if (T.innerHTML = "", !v.length) {
        T.style.display = "none";
        return;
      }
      v.forEach((b) => {
        const E = document.createElement("div");
        if (E.style.marginBottom = "6px", E.style.padding = "6px", E.style.borderBottom = "1px solid rgba(0,0,0,0.06)", b.parentTitle) {
          const k = document.createElement("div");
          k.textContent = b.parentTitle, k.style.fontSize = "11px", k.style.opacity = "0.7", k.style.marginBottom = "4px", k.className = "nimbi-search-parent", k.style.whiteSpace = "nowrap", k.style.overflow = "hidden", k.style.textOverflow = "ellipsis", k.style.display = "block", k.style.maxWidth = "100%", E.appendChild(k);
        }
        const M = document.createElement("a");
        M.className = "block", M.href = "?page=" + encodeURIComponent(b.slug), M.textContent = b.title, M.style.whiteSpace = "nowrap", M.style.overflow = "hidden", M.style.textOverflow = "ellipsis", M.addEventListener("click", () => {
          T.style.display = "none";
        }), E.appendChild(M), T.appendChild(E);
      }), T.style.display = "block", T.style.right = "0", T.style.left = "auto";
    }, C = (v, b) => {
      let E = null;
      return (...M) => {
        E && clearTimeout(E), E = setTimeout(() => v(...M), b);
      };
    };
    if (m) {
      const v = C(async () => {
        const b = String(m.value || "").trim().toLowerCase();
        if (!b) {
          $([]);
          return;
        }
        try {
          const E = await Promise.resolve().then(() => Ut);
          d || (d = (async () => {
            try {
              return l === "lazy" && E.buildSearchIndexWorker ? E.buildSearchIndexWorker(s, o, c) : E.buildSearchIndex(s, o, c);
            } catch (Q) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", Q), [];
            } finally {
              m && (m.disabled = !1, m.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((Q) => Q.title && Q.title.toLowerCase().includes(b) || Q.excerpt && Q.excerpt.toLowerCase().includes(b));
          $(k.slice(0, 10));
        } catch (E) {
          console.warn("[nimbi-cms] search input handler failed", E), $([]);
        }
      }, 50);
      m.addEventListener("input", v), document.addEventListener("click", (b) => {
        m && !m.contains(b.target) && T && !T.contains(b.target) && (T.style.display = "none");
      });
    }
  } catch (T) {
    console.warn("[nimbi-cms] navbar/search setup inner failed", T);
  }
  O.appendChild(G), Y && O.appendChild(Y), y.appendChild(x), y.appendChild(O), t.appendChild(y);
  try {
    O.addEventListener("click", (T) => {
      const $ = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!$) return;
      const C = $.getAttribute("href") || "";
      try {
        const v = new URL(C, location.href), b = v.searchParams.get("page"), E = v.hash ? v.hash.replace(/^#/, "") : null;
        if (b) {
          T.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (E ? "#" + encodeURIComponent(E) : ""));
          try {
            a();
          } catch (M) {
            console.warn("[nimbi-cms] renderByQuery failed", M);
          }
        }
      } catch (v) {
        console.warn("[nimbi-cms] navbar click handler failed", v);
      }
      try {
        const v = y && y.querySelector ? y.querySelector(".navbar-burger") : null, b = v && v.dataset ? v.dataset.target : null, E = b ? document.getElementById(b) : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), E && E.classList.remove("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (T) {
    console.warn("[nimbi-cms] attach content click handler failed", T);
  }
  try {
    e.addEventListener("click", (T) => {
      const $ = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!$) return;
      const C = $.getAttribute("href") || "";
      if (C && !zr(C))
        try {
          const v = new URL(C, location.href), b = v.searchParams.get("page"), E = v.hash ? v.hash.replace(/^#/, "") : null;
          if (b) {
            T.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (E ? "#" + encodeURIComponent(E) : ""));
            try {
              a();
            } catch (M) {
              console.warn("[nimbi-cms] renderByQuery failed", M);
            }
          }
        } catch (v) {
          console.warn("[nimbi-cms] container click URL parse failed", v);
        }
    });
  } catch (T) {
    console.warn("[nimbi-cms] build navbar failed", T);
  }
  return { navbar: y, linkEls: p };
}
var fn, Ar;
function Ua() {
  if (Ar) return fn;
  Ar = 1;
  function t(i, a) {
    return a.some(
      ([u, l]) => u <= i && i <= l
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
  function r(i) {
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
  function n(i, a = {}) {
    let u = 0, l = 0, o = i.length - 1;
    const c = a.wordsPerMinute || 200, h = a.wordBound || r;
    for (; h(i[l]); ) l++;
    for (; h(i[o]); ) o--;
    const f = `${i}
`;
    for (let w = l; w <= o; w++)
      if ((e(f[w]) || !h(f[w]) && (h(f[w + 1]) || e(f[w + 1]))) && u++, e(f[w]))
        for (; w <= o && (s(f[w + 1]) || h(f[w + 1])); )
          w++;
    const p = u / c, d = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: d,
      words: u
    };
  }
  return fn = n, fn;
}
var qa = Ua();
const ja = /* @__PURE__ */ Cr(qa);
function Er(t, e) {
  let r = document.querySelector(`meta[name="${t}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", t), document.head.appendChild(r)), r.setAttribute("content", e);
}
function rt(t, e, r) {
  let s = `meta[${t}="${e}"]`, n = document.querySelector(s);
  n || (n = document.createElement("meta"), n.setAttribute(t, e), document.head.appendChild(n)), n.setAttribute("content", r);
}
function Wa(t, e) {
  try {
    let r = document.querySelector(`link[rel="${t}"]`);
    r || (r = document.createElement("link"), r.setAttribute("rel", t), document.head.appendChild(r)), r.setAttribute("href", e);
  } catch (r) {
    console.warn("[seoManager] upsertLinkRel failed", r);
  }
}
function Fa(t, e, r, s) {
  const n = e && String(e).trim() ? e : t.title || document.title;
  rt("property", "og:title", n);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && rt("property", "og:description", i), rt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = r || t.image;
  a && (rt("property", "og:image", a), rt("name", "twitter:image", a));
}
function Za(t, e, r, s, n = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  u && String(u).trim() && Er("description", u), Er("robots", i.robots || "index,follow"), Fa(i, e, r, u);
}
function Ga() {
  try {
    const t = [
      'meta[name="site"]',
      'meta[name="site-name"]',
      'meta[name="siteName"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:site"]'
    ];
    for (const e of t) {
      const r = document.querySelector(e);
      if (r) {
        const s = r.getAttribute("content") || "";
        if (s && s.trim()) return s.trim();
      }
    }
  } catch (t) {
    console.warn("[seoManager] getSiteNameFromMeta failed", t);
  }
  return "";
}
function Qa(t, e, r, s, n, i = "") {
  try {
    const a = t.meta || {}, u = r && String(r).trim() ? r : a.title || i || document.title, l = n && String(n).trim() ? n : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = s || a.image || null;
    let c = "";
    try {
      if (e) {
        const d = ce(e);
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
    c && Wa("canonical", c);
    try {
      rt("property", "og:url", c);
    } catch (d) {
      console.warn("[seoManager] upsertMeta og:url failed", d);
    }
    const h = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: u || "",
      description: l || "",
      url: c || location.href.split("#")[0]
    };
    o && (h.image = String(o)), a.date && (h.datePublished = a.date), a.dateModified && (h.dateModified = a.dateModified);
    const f = "nimbi-jsonld";
    let p = document.getElementById(f);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = f, document.head.appendChild(p)), p.textContent = JSON.stringify(h, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function Xa(t, e, r, s, n, i, a, u, l, o, c) {
  try {
    const h = s.querySelector(".menu-label");
    h && (h.textContent = u && u.textContent || t("onThisPage"));
  } catch (h) {
    console.warn("[seoManager] update toc label failed", h);
  }
  try {
    const h = r.meta && r.meta.title ? String(r.meta.title).trim() : "", f = n.querySelector("img"), p = f && (f.getAttribute("src") || f.src) || null;
    let d = "";
    try {
      let w = "";
      try {
        const y = u || (n && n.querySelector ? n.querySelector("h1") : null);
        if (y) {
          let x = y.nextElementSibling;
          const B = [];
          for (; x && !(x.tagName && x.tagName.toLowerCase() === "h2"); ) {
            const I = (x.textContent || "").trim();
            I && B.push(I), x = x.nextElementSibling;
          }
          B.length && (w = B.join(" ").replace(/\s+/g, " ").trim()), !w && l && (w = String(l).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), d = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    try {
      Za(r, l, p, d);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      Qa(r, o, l, p, d, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Ga();
    l ? m ? document.title = `${m} - ${l}` : document.title = `${e || "Site"} - ${l}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = n.querySelector(".nimbi-reading-time");
    if (h && h.remove(), l) {
      const f = ja(c.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = n.querySelector("h1");
      m && m.insertAdjacentElement("afterend", d);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let ke = null, W = null, xe = 1, Fe = (t, e) => e, bt = 0, yt = 0, qt = () => {
}, ft = 0.25;
function Ka() {
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
    b.target === t && gn();
  }), t.addEventListener("wheel", (b) => {
    if (!te()) return;
    b.preventDefault();
    const E = b.deltaY < 0 ? ft : -ft;
    Ue(xe + E), o(), c();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      gn();
      return;
    }
    if (xe > 1) {
      const E = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!E) return;
      const M = 40;
      switch (b.key) {
        case "ArrowUp":
          E.scrollTop -= M, b.preventDefault();
          break;
        case "ArrowDown":
          E.scrollTop += M, b.preventDefault();
          break;
        case "ArrowLeft":
          E.scrollLeft -= M, b.preventDefault();
          break;
        case "ArrowRight":
          E.scrollLeft += M, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), ke = t, W = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), r = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), n = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), u = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function o() {
    u && (u.textContent = `${Math.round(xe * 100)}%`);
  }
  const c = () => {
    l && (l.textContent = `${Math.round(xe * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  qt = o, s.addEventListener("click", () => {
    Ue(xe + ft), o(), c();
  }), n.addEventListener("click", () => {
    Ue(xe - ft), o(), c();
  }), e.addEventListener("click", () => {
    kt(), o(), c();
  }), r.addEventListener("click", () => {
    Ue(1), o(), c();
  }), i.addEventListener("click", () => {
    kt(), o(), c();
  }), a.addEventListener("click", gn), e.title = Fe("imagePreviewFit", "Fit to screen"), r.title = Fe("imagePreviewOriginal", "Original size"), n.title = Fe("imagePreviewZoomOut", "Zoom out"), s.title = Fe("imagePreviewZoomIn", "Zoom in"), a.title = Fe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Fe("imagePreviewClose", "Close"));
  let h = !1, f = 0, p = 0, d = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let y = 0, x = 1;
  const B = (b, E) => {
    const M = b.x - E.x, k = b.y - E.y;
    return Math.hypot(M, k);
  }, I = () => {
    h = !1, w.clear(), y = 0, W && (W.style.cursor = "all-scroll");
  };
  let A = 0, q = 0, O = 0;
  const G = (b) => {
    const E = Date.now(), M = E - A, k = b.clientX - q, Q = b.clientY - O;
    A = E, q = b.clientX, O = b.clientY, M < 300 && Math.hypot(k, Q) < 30 && (Ue(xe > 1 ? 1 : 2), o(), b.preventDefault());
  }, Y = (b) => {
    Ue(xe > 1 ? 1 : 2), o(), b.preventDefault();
  }, te = () => ke ? typeof ke.open == "boolean" ? ke.open : ke.classList.contains("is-active") : !1, P = (b, E, M = 1) => {
    if (w.has(M) && w.set(M, { x: b, y: E }), w.size === 2) {
      const oe = Array.from(w.values()), Le = B(oe[0], oe[1]);
      if (y > 0) {
        const ve = Le / y;
        Ue(x * ve);
      }
      return;
    }
    if (!h) return;
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    if (!k) return;
    const Q = b - f, ue = E - p;
    k.scrollLeft = d - Q, k.scrollTop = m - ue;
  }, T = (b, E, M = 1) => {
    if (!te()) return;
    if (w.set(M, { x: b, y: E }), w.size === 2) {
      const ue = Array.from(w.values());
      y = B(ue[0], ue[1]), x = xe;
      return;
    }
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    !k || !(k.scrollWidth > k.clientWidth || k.scrollHeight > k.clientHeight) || (h = !0, f = b, p = E, d = k.scrollLeft, m = k.scrollTop, W.style.cursor = "all-scroll", window.addEventListener("pointermove", $), window.addEventListener("pointerup", C), window.addEventListener("pointercancel", C));
  }, $ = (b) => {
    h && (b.preventDefault(), P(b.clientX, b.clientY, b.pointerId));
  }, C = () => {
    I(), window.removeEventListener("pointermove", $), window.removeEventListener("pointerup", C), window.removeEventListener("pointercancel", C);
  };
  W.addEventListener("pointerdown", (b) => {
    b.preventDefault(), T(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointermove", (b) => {
    (h || w.size === 2) && b.preventDefault(), P(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && G(b), I();
  }), W.addEventListener("dblclick", Y), W.addEventListener("pointercancel", I), W.addEventListener("mousedown", (b) => {
    b.preventDefault(), T(b.clientX, b.clientY, 1);
  }), W.addEventListener("mousemove", (b) => {
    h && b.preventDefault(), P(b.clientX, b.clientY, 1);
  }), W.addEventListener("mouseup", (b) => {
    b.preventDefault(), I();
  });
  const v = t.querySelector(".nimbi-image-preview__image-wrapper");
  return v && (v.addEventListener("pointerdown", (b) => {
    T(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointermove", (b) => {
    P(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointerup", I), v.addEventListener("pointercancel", I), v.addEventListener("mousedown", (b) => {
    T(b.clientX, b.clientY, 1);
  }), v.addEventListener("mousemove", (b) => {
    P(b.clientX, b.clientY, 1);
  }), v.addEventListener("mouseup", I)), t;
}
function Ue(t) {
  if (!W) return;
  const e = Number(t);
  xe = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = W.getBoundingClientRect(), n = bt || W.naturalWidth || W.width || s.width || 0, i = yt || W.naturalHeight || W.height || s.height || 0;
  n && i ? (W.style.maxWidth = "none", W.style.maxHeight = "none", W.style.width = `${n * xe}px`, W.style.height = `${i * xe}px`, W.style.transform = "") : (W.style.maxWidth = "", W.style.maxHeight = "", W.style.width = "", W.style.height = "", W.style.transform = `scale(${xe})`), W && (W.style.cursor = "all-scroll");
}
function kt() {
  if (!W) return;
  const t = W.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const r = bt || W.naturalWidth || e.width, s = yt || W.naturalHeight || e.height;
  if (!r || !s) return;
  const n = e.width / r, i = e.height / s, a = Math.min(n, i, 1);
  Ue(Number.isFinite(a) ? a : 1);
}
function Ya(t, e = "", r = 0, s = 0) {
  const n = Ka();
  xe = 1, bt = r || 0, yt = s || 0, W.src = t, W.alt = e, W.style.transform = "scale(1)";
  const i = () => {
    bt = W.naturalWidth || W.width || 0, yt = W.naturalHeight || W.height || 0;
  };
  if (i(), kt(), qt(), requestAnimationFrame(() => {
    kt(), qt();
  }), !bt || !yt) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        kt(), qt();
      }), W.removeEventListener("load", a);
    };
    W.addEventListener("load", a);
  }
  typeof n.showModal == "function" && (n.open || n.showModal()), n.classList.add("is-active"), n.focus();
}
function gn() {
  ke && (typeof ke.close == "function" && ke.open && ke.close(), ke.classList.remove("is-active"));
}
function Va(t, { t: e, zoomStep: r = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Fe = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, ft = r, t.addEventListener("click", (p) => {
    const d = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!d || d.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      d
    );
    if (m.src) {
      if (p.defaultPrevented !== !0) {
        const w = m.closest("a");
        w && w.getAttribute("href") && p.preventDefault();
      }
      Ya(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
    }
  });
  let s = !1, n = 0, i = 0, a = 0, u = 0;
  const l = /* @__PURE__ */ new Map();
  let o = 0, c = 1;
  const h = (p, d) => {
    const m = p.x - d.x, w = p.y - d.y;
    return Math.hypot(m, w);
  };
  t.addEventListener("pointerdown", (p) => {
    const d = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!d || d.tagName !== "IMG" || !ke || !ke.open) return;
    if (l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      const w = Array.from(l.values());
      o = h(w[0], w[1]), c = xe;
      return;
    }
    const m = d.closest(".nimbi-image-preview__image-wrapper");
    m && (xe <= 1 || (p.preventDefault(), s = !0, n = p.clientX, i = p.clientY, a = m.scrollLeft, u = m.scrollTop, d.setPointerCapture(p.pointerId), d.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (l.has(p.pointerId) && l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      p.preventDefault();
      const x = Array.from(l.values()), B = h(x[0], x[1]);
      if (o > 0) {
        const I = B / o;
        Ue(c * I);
      }
      return;
    }
    if (!s) return;
    p.preventDefault();
    const m = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = p.clientX - n, y = p.clientY - i;
    m.scrollLeft = a - w, m.scrollTop = u - y;
  });
  const f = () => {
    s = !1, l.clear(), o = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function Ja(t) {
  const {
    contentWrap: e,
    navWrap: r,
    container: s,
    mountOverlay: n = null,
    t: i,
    contentBase: a,
    homePage: u,
    initialDocumentTitle: l,
    runHooks: o
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const h = Ca(i, [{ path: u, name: i("home"), isIndex: !0, children: [] }]);
  async function f(y, x) {
    let B, I, A;
    try {
      ({ data: B, pagePath: I, anchor: A } = await Ps(y, a));
    } catch (T) {
      console.error("[nimbi-cms] fetchPageData failed", T), vr(e, i, T);
      return;
    }
    !A && x && (A = x);
    try {
      Rn(null);
    } catch (T) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", T);
    }
    e.innerHTML = "";
    const { article: q, parsed: O, toc: G, topH1: Y, h1Text: te, slugKey: P } = await Ba(i, B, I, A, a);
    Xa(i, l, O, G, q, I, A, Y, te, P, B), r.innerHTML = "", r.appendChild(G), Na(G);
    try {
      await o("transformHtml", { article: q, parsed: O, toc: G, pagePath: I, anchor: A, topH1: Y, h1Text: te, slugKey: P, data: B });
    } catch (T) {
      console.warn("[nimbi-cms] transformHtml hooks failed", T);
    }
    e.appendChild(q);
    try {
      Va(q, { t: i });
    } catch (T) {
      console.warn("[nimbi-cms] attachImagePreview failed", T);
    }
    try {
      Ot(s, 100, !1), requestAnimationFrame(() => Ot(s, 100, !1)), setTimeout(() => Ot(s, 100, !1), 250);
    } catch (T) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", T);
    }
    Rn(A), Da(q, Y, { mountOverlay: n, container: s, navWrap: r, t: i });
    try {
      await o("onPageLoad", { data: B, pagePath: I, anchor: A, article: q, toc: G, topH1: Y, h1Text: te, slugKey: P, contentWrap: e, navWrap: r });
    } catch (T) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", T);
    }
    c = I;
  }
  async function p() {
    let y = new URLSearchParams(location.search).get("page") || u;
    const x = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await f(y, x);
    } catch (B) {
      console.warn("[nimbi-cms] renderByQuery failed for", y, B), vr(e, i, B);
    }
  }
  window.addEventListener("popstate", p);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const y = s || document.querySelector(".nimbi-cms");
      if (!y) return;
      const x = {
        top: y.scrollTop || 0,
        left: y.scrollLeft || 0
      };
      sessionStorage.setItem(d(), JSON.stringify(x));
    } catch {
    }
  }, w = () => {
    try {
      const y = s || document.querySelector(".nimbi-cms");
      if (!y) return;
      const x = sessionStorage.getItem(d());
      if (!x) return;
      const B = JSON.parse(x);
      B && typeof B.top == "number" && y.scrollTo({ top: B.top, left: B.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (y) => {
    if (y.persisted)
      try {
        w(), Ot(s, 100, !1);
      } catch (x) {
        console.warn("[nimbi-cms] bfcache restore failed", x);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      console.warn("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: p, siteNav: h, getCurrentPagePath: () => c };
}
function el(t) {
  try {
    const e = typeof t == "string" ? t : typeof window < "u" && window.location ? window.location.search : "";
    if (!e) return {};
    const r = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), s = {}, n = (i) => {
      if (i == null) return;
      const a = String(i).toLowerCase();
      if (a === "1" || a === "true" || a === "yes") return !0;
      if (a === "0" || a === "false" || a === "no") return !1;
    };
    if (r.has("contentPath") && (s.contentPath = r.get("contentPath")), r.has("searchIndex")) {
      const i = n(r.get("searchIndex"));
      typeof i == "boolean" && (s.searchIndex = i);
    }
    if (r.has("searchIndexMode")) {
      const i = r.get("searchIndexMode");
      (i === "eager" || i === "lazy") && (s.searchIndexMode = i);
    }
    if (r.has("defaultStyle")) {
      const i = r.get("defaultStyle");
      (i === "light" || i === "dark") && (s.defaultStyle = i);
    }
    if (r.has("bulmaCustomize") && (s.bulmaCustomize = r.get("bulmaCustomize")), r.has("lang") && (s.lang = r.get("lang")), r.has("l10nFile")) {
      const i = r.get("l10nFile");
      s.l10nFile = i === "null" ? null : i;
    }
    if (r.has("cacheTtlMinutes")) {
      const i = Number(r.get("cacheTtlMinutes"));
      Number.isFinite(i) && i >= 0 && (s.cacheTtlMinutes = i);
    }
    if (r.has("cacheMaxEntries")) {
      const i = Number(r.get("cacheMaxEntries"));
      Number.isInteger(i) && i >= 0 && (s.cacheMaxEntries = i);
    }
    if (r.has("homePage") && (s.homePage = r.get("homePage")), r.has("notFoundPage") && (s.notFoundPage = r.get("notFoundPage")), r.has("availableLanguages") && (s.availableLanguages = r.get("availableLanguages").split(",").map((i) => i.trim()).filter(Boolean)), r.has("indexDepth")) {
      const i = Number(r.get("indexDepth"));
      Number.isInteger(i) && (i === 1 || i === 2 || i === 3) && (s.indexDepth = i);
    }
    if (r.has("noIndexing")) {
      const a = (r.get("noIndexing") || "").split(",").map((u) => u.trim()).filter(Boolean);
      a.length && (s.noIndexing = a);
    }
    return s;
  } catch {
    return {};
  }
}
function tl(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Rr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let mn = "";
async function dl(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = el();
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
  const r = Object.assign({}, e, t), {
    el: s,
    contentPath: n = "/content",
    crawlMaxQueue: i = 1e3,
    searchIndex: a = !0,
    searchIndexMode: u = "eager",
    indexDepth: l = 1,
    noIndexing: o = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: h = "none",
    lang: f = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: d = 5,
    cacheMaxEntries: m,
    markdownExtensions: w,
    availableLanguages: y,
    homePage: x = "_home.md",
    notFoundPage: B = "_404.md"
  } = r, { skipRootReadme: I = !1 } = r;
  if (r.contentPath != null && !tl(r.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (r.homePage != null && !Rr(r.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (r.notFoundPage != null && !Rr(r.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!s)
    throw new Error("el is required");
  let A = s;
  if (typeof s == "string") {
    if (A = document.querySelector(s), !A) throw new Error(`el selector "${s}" did not match any element`);
  } else if (!(s instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof n != "string" || !n.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (u != null && u !== "eager" && u !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (c !== "light" && c !== "dark")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (d != null && (typeof d != "number" || !Number.isFinite(d) || d < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((k) => !k || typeof k != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((k) => typeof k != "string" || !k.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (o != null && (!Array.isArray(o) || o.some((k) => typeof k != "string" || !k.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (I != null && typeof I != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (x != null && (typeof x != "string" || !x.trim() || !/\.(md|html)$/.test(x)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (B != null && (typeof B != "string" || !B.trim() || !/\.(md|html)$/.test(B)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const q = !!a;
  try {
    Br(!!I);
  } catch (k) {
    console.warn("[nimbi-cms] setSkipRootReadme failed", k);
  }
  try {
    A.classList.add("nimbi-mount"), A.style.position = A.style.position || "relative", A.style.overflow = A.style.overflow || "hidden";
  } catch (k) {
    console.warn("[nimbi-cms] mount element setup failed", k);
  }
  const O = document.createElement("div");
  O.className = "nimbi-cms";
  try {
    O.style.position = O.style.position || "relative", O.style.overflow = O.style.overflow || "auto";
    try {
      O.style.webkitOverflowScrolling || (O.style.webkitOverflowScrolling = "touch");
    } catch (k) {
      console.warn("[nimbi-cms] set container webkitOverflowScrolling failed", k);
    }
    O.style.width = O.style.width || "100%", O.style.height = O.style.height || "100%", O.style.boxSizing = O.style.boxSizing || "border-box";
  } catch (k) {
    console.warn("[nimbi-cms] container style setup failed", k);
  }
  const G = document.createElement("div");
  G.className = "columns";
  const Y = document.createElement("div");
  Y.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", Y.setAttribute("role", "navigation");
  try {
    const k = typeof dt == "function" ? dt("navigation") : null;
    k && Y.setAttribute("aria-label", k);
  } catch (k) {
    console.warn("[nimbi-cms] set nav aria-label failed", k);
  }
  G.appendChild(Y);
  const te = document.createElement("div");
  te.className = "column nimbi-content", te.setAttribute("role", "main"), G.appendChild(te), O.appendChild(G);
  const P = Y, T = te;
  A.appendChild(O);
  let $ = null;
  try {
    $ = A.querySelector(".nimbi-overlay"), $ || ($ = document.createElement("div"), $.className = "nimbi-overlay", A.appendChild($));
  } catch (k) {
    $ = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
  }
  const C = location.pathname || "/", v = C.endsWith("/") ? C : C.substring(0, C.lastIndexOf("/") + 1);
  try {
    mn = document.title || "";
  } catch (k) {
    mn = "", console.warn("[nimbi-cms] read initial document title failed", k);
  }
  let b = n;
  (b === "." || b === "./") && (b = ""), b.startsWith("./") && (b = b.slice(2)), b.startsWith("/") && (b = b.slice(1)), b !== "" && !b.endsWith("/") && (b = b + "/");
  const E = new URL(v + b, location.origin).toString();
  try {
    yn && yn(x);
  } catch (k) {
    console.warn("[nimbi-cms] setHomePage failed", k);
  }
  p && await $r(p, v), y && Array.isArray(y) && Or(y), f && Pr(f);
  const M = Ja({ contentWrap: T, navWrap: P, container: O, mountOverlay: $, t: dt, contentBase: E, homePage: x, initialDocumentTitle: mn, runHooks: ir });
  if (typeof d == "number" && d >= 0 && typeof ur == "function" && ur(d * 60 * 1e3), typeof m == "number" && m >= 0 && typeof cr == "function" && cr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((k) => {
        typeof k == "object" && Ta && typeof An == "function" && An(k);
      });
    } catch (k) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", k);
    }
  try {
    typeof i == "number" && Promise.resolve().then(() => Ut).then(({ setDefaultCrawlMaxQueue: k }) => {
      try {
        k(i);
      } catch (Q) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", Q);
      }
    });
  } catch (k) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", k);
  }
  try {
    Zt(E);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    bn(B);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    Zt(E);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    bn(B);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    await be(x, E);
  } catch (k) {
    throw x === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${x} not found at ${E}${x}: ${k.message}`);
  }
  us(c), await cs(h, v);
  try {
    const k = document.createElement("header");
    k.className = "nimbi-site-navbar", A.insertBefore(k, O);
    const Q = await be("_navigation.md", E), ue = await Yt(Q.raw || ""), { navbar: oe, linkEls: Le } = await Ha(k, O, ue.html || "", E, x, dt, M.renderByQuery, q, u, l, o);
    try {
      await ir("onNavBuild", { navWrap: P, navbar: oe, linkEls: Le, contentBase: E });
    } catch (ve) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", ve);
    }
    try {
      const ve = () => {
        const Ae = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
        if (Ae > 0) {
          try {
            A.style.setProperty("--nimbi-site-navbar-height", `${Ae}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set CSS var failed", fe);
          }
          try {
            O.style.paddingTop = "";
          } catch (fe) {
            console.warn("[nimbi-cms] set container paddingTop failed", fe);
          }
          try {
            const fe = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.clientHeight || 0;
            if (fe > 0) {
              const Ie = Math.max(0, fe - Ae);
              try {
                O.style.boxSizing = "border-box";
              } catch (Xe) {
                console.warn("[nimbi-cms] set container boxSizing failed", Xe);
              }
              try {
                O.style.height = `${Ie}px`;
              } catch (Xe) {
                console.warn("[nimbi-cms] set container height failed", Xe);
              }
              try {
                O.style.setProperty("--nimbi-cms-height", `${Ie}px`);
              } catch (Xe) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Xe);
              }
            } else {
              try {
                O.style.height = "calc(100vh - var(--nimbi-site-navbar-height))";
              } catch (Ie) {
                console.warn("[nimbi-cms] set container height failed", Ie);
              }
              try {
                O.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
              } catch (Ie) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ie);
              }
            }
          } catch (fe) {
            console.warn("[nimbi-cms] compute container height failed", fe);
          }
          try {
            k.style.setProperty("--nimbi-site-navbar-height", `${Ae}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set navbar CSS var failed", fe);
          }
        }
      };
      ve();
      try {
        if (typeof ResizeObserver < "u") {
          const Ae = new ResizeObserver(() => ve());
          try {
            Ae.observe(k);
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", fe);
          }
        }
      } catch (Ae) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", Ae);
      }
    } catch (ve) {
      console.warn("[nimbi-cms] compute navbar height failed", ve);
    }
  } catch (k) {
    console.warn("[nimbi-cms] build navigation failed", k);
  }
  await M.renderByQuery();
  try {
    Promise.resolve().then(() => rl).then(({ getVersion: k }) => {
      typeof k == "function" && k().then((Q) => {
        try {
          const ue = Q || "0.0.0", oe = document.createElement("div");
          oe.className = "nimbi-version-label", oe.textContent = `Ninbi CMS v. ${ue}`, oe.style.position = "absolute", oe.style.left = "8px", oe.style.bottom = "6px", oe.style.fontSize = "11px", oe.style.opacity = "0.6", oe.style.pointerEvents = "none", oe.style.zIndex = "9999", oe.style.userSelect = "none";
          try {
            A.appendChild(oe);
          } catch (Le) {
            console.warn("[nimbi-cms] append version label failed", Le);
          }
        } catch (ue) {
          console.warn("[nimbi-cms] building version label failed", ue);
        }
      }).catch((Q) => {
        console.warn("[nimbi-cms] getVersion() failed", Q);
      });
    }).catch((k) => {
      console.warn("[nimbi-cms] import version module failed", k);
    });
  } catch (k) {
    console.warn("[nimbi-cms] version label setup failed", k);
  }
}
async function nl() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => Tr);
    } catch {
      try {
        t = await Promise.resolve().then(() => Tr);
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
const rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: nl
}, Symbol.toStringTag, { value: "Module" })), oi = "nimbi-cms", ci = "0.1.0", ui = "module", hi = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, di = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, pi = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, fi = "dist/nimbi-cms.cjs.js", gi = "dist/nimbi-cms.es.js", mi = "src/index.d.ts", wi = "dist/nimbi-cms.js", bi = ["dist", "src/index.d.ts"], il = {
  name: oi,
  version: ci,
  private: !0,
  type: ui,
  scripts: hi,
  dependencies: di,
  devDependencies: pi,
  main: fi,
  module: gi,
  types: mi,
  unpkg: wi,
  files: bi
}, Tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: il,
  dependencies: di,
  devDependencies: pi,
  files: bi,
  main: fi,
  module: gi,
  name: oi,
  scripts: hi,
  type: ui,
  types: mi,
  unpkg: wi,
  version: ci
}, Symbol.toStringTag, { value: "Module" }));
export {
  Lr as BAD_LANGUAGES,
  V as SUPPORTED_HLJS_MAP,
  cl as _clearHooks,
  Tn as addHook,
  dl as default,
  cs as ensureBulma,
  nl as getVersion,
  $r as loadL10nFile,
  _r as loadSupportedLanguages,
  ls as observeCodeBlocks,
  ll as onNavBuild,
  al as onPageLoad,
  St as registerLanguage,
  ir as runHooks,
  ul as setHighlightTheme,
  Pr as setLang,
  us as setStyle,
  hl as setThemeVars,
  dt as t,
  ol as transformHtml
};
