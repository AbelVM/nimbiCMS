const xt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Rn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(xt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  xt[t].push(e);
}
function ho(t) {
  Rn("onPageLoad", t);
}
function po(t) {
  Rn("onNavBuild", t);
}
function fo(t) {
  Rn("transformHtml", t);
}
async function rr(t, e) {
  const n = xt[t] || [];
  for (const s of n)
    try {
      await s(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function go() {
  Object.keys(xt).forEach((t) => {
    xt[t].length = 0;
  });
}
function Tr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var un, ir;
function ss() {
  if (ir) return un;
  ir = 1;
  function t(g) {
    return g instanceof Map ? g.clear = g.delete = g.set = function() {
      throw new Error("map is read-only");
    } : g instanceof Set && (g.add = g.clear = g.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(g), Object.getOwnPropertyNames(g).forEach((S) => {
      const T = g[S], W = typeof T;
      (W === "object" || W === "function") && !Object.isFrozen(T) && t(T);
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
  function n(g) {
    return g.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(g, ...S) {
    const T = /* @__PURE__ */ Object.create(null);
    for (const W in g)
      T[W] = g[W];
    return S.forEach(function(W) {
      for (const de in W)
        T[de] = W[de];
    }), /** @type {T} */
    T;
  }
  const r = "</span>", i = (g) => !!g.scope, a = (g, { prefix: S }) => {
    if (g.startsWith("language:"))
      return g.replace("language:", "language-");
    if (g.includes(".")) {
      const T = g.split(".");
      return [
        `${S}${T.shift()}`,
        ...T.map((W, de) => `${W}${"_".repeat(de + 1)}`)
      ].join(" ");
    }
    return `${S}${g}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(S, T) {
      this.buffer = "", this.classPrefix = T.classPrefix, S.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(S) {
      this.buffer += n(S);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(S) {
      if (!i(S)) return;
      const T = a(
        S.scope,
        { prefix: this.classPrefix }
      );
      this.span(T);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(S) {
      i(S) && (this.buffer += r);
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
  const o = (g = {}) => {
    const S = { children: [] };
    return Object.assign(S, g), S;
  };
  class l {
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
    add(S) {
      this.top.children.push(S);
    }
    /** @param {string} scope */
    openNode(S) {
      const T = o({ scope: S });
      this.add(T), this.stack.push(T);
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
    static _walk(S, T) {
      return typeof T == "string" ? S.addText(T) : T.children && (S.openNode(T), T.children.forEach((W) => this._walk(S, W)), S.closeNode(T)), S;
    }
    /**
     * @param {Node} node
     */
    static _collapse(S) {
      typeof S != "string" && S.children && (S.children.every((T) => typeof T == "string") ? S.children = [S.children.join("")] : S.children.forEach((T) => {
        l._collapse(T);
      }));
    }
  }
  class u extends l {
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
    __addSublanguage(S, T) {
      const W = S.root;
      T && (W.scope = `language:${T}`), this.add(W);
    }
    toHTML() {
      return new c(this, this.options).value();
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
    return g.map((T) => h(T)).join("");
  }
  function w(g) {
    const S = g[g.length - 1];
    return typeof S == "object" && S.constructor === Object ? (g.splice(g.length - 1, 1), S) : {};
  }
  function y(...g) {
    return "(" + (w(g).capture ? "" : "?:") + g.map((W) => h(W)).join("|") + ")";
  }
  function x(g) {
    return new RegExp(g.toString() + "|").exec("").length - 1;
  }
  function I(g, S) {
    const T = g && g.exec(S);
    return T && T.index === 0;
  }
  const $ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function A(g, { joinWith: S }) {
    let T = 0;
    return g.map((W) => {
      T += 1;
      const de = T;
      let pe = h(W), B = "";
      for (; pe.length > 0; ) {
        const P = $.exec(pe);
        if (!P) {
          B += pe;
          break;
        }
        B += pe.substring(0, P.index), pe = pe.substring(P.index + P[0].length), P[0][0] === "\\" && P[1] ? B += "\\" + String(Number(P[1]) + de) : (B += P[0], P[0] === "(" && T++);
      }
      return B;
    }).map((W) => `(${W})`).join(S);
  }
  const q = /\b\B/, j = "[a-zA-Z]\\w*", G = "[a-zA-Z_]\\w*", K = "\\b\\d+(\\.\\d+)?", ne = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", O = "\\b(0b[01]+)", L = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", C = (g = {}) => {
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
      "on:begin": (T, W) => {
        T.index !== 0 && W.ignoreMatch();
      }
    }, g);
  }, R = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, v = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [R]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [R]
  }, M = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, z = function(g, S, T = {}) {
    const W = s(
      {
        scope: "comment",
        begin: g,
        end: S,
        contains: []
      },
      T
    );
    W.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const de = y(
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
    return W.contains.push(
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
          de,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), W;
  }, k = z("//", "$"), ie = z("/\\*", "\\*/"), ue = z("#", "$"), Se = {
    scope: "number",
    begin: K,
    relevance: 0
  }, ye = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, J = {
    scope: "number",
    begin: O,
    relevance: 0
  }, ce = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      R,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [R]
      }
    ]
  }, fe = {
    scope: "title",
    begin: j,
    relevance: 0
  }, Qe = {
    scope: "title",
    begin: G,
    relevance: 0
  }, tn = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + G,
    relevance: 0
  };
  var Ct = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: v,
    BACKSLASH_ESCAPE: R,
    BINARY_NUMBER_MODE: J,
    BINARY_NUMBER_RE: O,
    COMMENT: z,
    C_BLOCK_COMMENT_MODE: ie,
    C_LINE_COMMENT_MODE: k,
    C_NUMBER_MODE: ye,
    C_NUMBER_RE: ne,
    END_SAME_AS_BEGIN: function(g) {
      return Object.assign(
        g,
        {
          /** @type {ModeCallback} */
          "on:begin": (S, T) => {
            T.data._beginMatch = S[1];
          },
          /** @type {ModeCallback} */
          "on:end": (S, T) => {
            T.data._beginMatch !== S[1] && T.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ue,
    IDENT_RE: j,
    MATCH_NOTHING_RE: q,
    METHOD_GUARD: tn,
    NUMBER_MODE: Se,
    NUMBER_RE: K,
    PHRASAL_WORDS_MODE: M,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: ce,
    RE_STARTERS_RE: L,
    SHEBANG: C,
    TITLE_MODE: fe,
    UNDERSCORE_IDENT_RE: G,
    UNDERSCORE_TITLE_MODE: Qe
  });
  function xi(g, S) {
    g.input[g.index - 1] === "." && S.ignoreMatch();
  }
  function Si(g, S) {
    g.className !== void 0 && (g.scope = g.className, delete g.className);
  }
  function vi(g, S) {
    S && g.beginKeywords && (g.begin = "\\b(" + g.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", g.__beforeBegin = xi, g.keywords = g.keywords || g.beginKeywords, delete g.beginKeywords, g.relevance === void 0 && (g.relevance = 0));
  }
  function Ai(g, S) {
    Array.isArray(g.illegal) && (g.illegal = y(...g.illegal));
  }
  function Ei(g, S) {
    if (g.match) {
      if (g.begin || g.end) throw new Error("begin & end are not supported with match");
      g.begin = g.match, delete g.match;
    }
  }
  function Ri(g, S) {
    g.relevance === void 0 && (g.relevance = 1);
  }
  const Ti = (g, S) => {
    if (!g.beforeMatch) return;
    if (g.starts) throw new Error("beforeMatch cannot be used with starts");
    const T = Object.assign({}, g);
    Object.keys(g).forEach((W) => {
      delete g[W];
    }), g.keywords = T.keywords, g.begin = m(T.beforeMatch, f(T.begin)), g.starts = {
      relevance: 0,
      contains: [
        Object.assign(T, { endsParent: !0 })
      ]
    }, g.relevance = 0, delete T.beforeMatch;
  }, Li = [
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
  ], Ci = "keyword";
  function Un(g, S, T = Ci) {
    const W = /* @__PURE__ */ Object.create(null);
    return typeof g == "string" ? de(T, g.split(" ")) : Array.isArray(g) ? de(T, g) : Object.keys(g).forEach(function(pe) {
      Object.assign(
        W,
        Un(g[pe], S, pe)
      );
    }), W;
    function de(pe, B) {
      S && (B = B.map((P) => P.toLowerCase())), B.forEach(function(P) {
        const F = P.split("|");
        W[F[0]] = [pe, Mi(F[0], F[1])];
      });
    }
  }
  function Mi(g, S) {
    return S ? Number(S) : _i(g) ? 0 : 1;
  }
  function _i(g) {
    return Li.includes(g.toLowerCase());
  }
  const qn = {}, Xe = (g) => {
    console.error(g);
  }, jn = (g, ...S) => {
    console.log(`WARN: ${g}`, ...S);
  }, et = (g, S) => {
    qn[`${g}/${S}`] || (console.log(`Deprecated as of ${g}. ${S}`), qn[`${g}/${S}`] = !0);
  }, Mt = new Error();
  function Fn(g, S, { key: T }) {
    let W = 0;
    const de = g[T], pe = {}, B = {};
    for (let P = 1; P <= S.length; P++)
      B[P + W] = de[P], pe[P + W] = !0, W += x(S[P - 1]);
    g[T] = B, g[T]._emit = pe, g[T]._multi = !0;
  }
  function $i(g) {
    if (Array.isArray(g.begin)) {
      if (g.skip || g.excludeBegin || g.returnBegin)
        throw Xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Mt;
      if (typeof g.beginScope != "object" || g.beginScope === null)
        throw Xe("beginScope must be object"), Mt;
      Fn(g, g.begin, { key: "beginScope" }), g.begin = A(g.begin, { joinWith: "" });
    }
  }
  function Pi(g) {
    if (Array.isArray(g.end)) {
      if (g.skip || g.excludeEnd || g.returnEnd)
        throw Xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Mt;
      if (typeof g.endScope != "object" || g.endScope === null)
        throw Xe("endScope must be object"), Mt;
      Fn(g, g.end, { key: "endScope" }), g.end = A(g.end, { joinWith: "" });
    }
  }
  function Ii(g) {
    g.scope && typeof g.scope == "object" && g.scope !== null && (g.beginScope = g.scope, delete g.scope);
  }
  function Bi(g) {
    Ii(g), typeof g.beginScope == "string" && (g.beginScope = { _wrap: g.beginScope }), typeof g.endScope == "string" && (g.endScope = { _wrap: g.endScope }), $i(g), Pi(g);
  }
  function zi(g) {
    function S(B, P) {
      return new RegExp(
        h(B),
        "m" + (g.case_insensitive ? "i" : "") + (g.unicodeRegex ? "u" : "") + (P ? "g" : "")
      );
    }
    class T {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(P, F) {
        F.position = this.position++, this.matchIndexes[this.matchAt] = F, this.regexes.push([F, P]), this.matchAt += x(P) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const P = this.regexes.map((F) => F[1]);
        this.matcherRe = S(A(P, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(P) {
        this.matcherRe.lastIndex = this.lastIndex;
        const F = this.matcherRe.exec(P);
        if (!F)
          return null;
        const be = F.findIndex((at, rn) => rn > 0 && at !== void 0), ge = this.matchIndexes[be];
        return F.splice(0, be), Object.assign(F, ge);
      }
    }
    class W {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(P) {
        if (this.multiRegexes[P]) return this.multiRegexes[P];
        const F = new T();
        return this.rules.slice(P).forEach(([be, ge]) => F.addRule(be, ge)), F.compile(), this.multiRegexes[P] = F, F;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(P, F) {
        this.rules.push([P, F]), F.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(P) {
        const F = this.getMatcher(this.regexIndex);
        F.lastIndex = this.lastIndex;
        let be = F.exec(P);
        if (this.resumingScanAtSamePosition() && !(be && be.index === this.lastIndex)) {
          const ge = this.getMatcher(0);
          ge.lastIndex = this.lastIndex + 1, be = ge.exec(P);
        }
        return be && (this.regexIndex += be.position + 1, this.regexIndex === this.count && this.considerAll()), be;
      }
    }
    function de(B) {
      const P = new W();
      return B.contains.forEach((F) => P.addRule(F.begin, { rule: F, type: "begin" })), B.terminatorEnd && P.addRule(B.terminatorEnd, { type: "end" }), B.illegal && P.addRule(B.illegal, { type: "illegal" }), P;
    }
    function pe(B, P) {
      const F = (
        /** @type CompiledMode */
        B
      );
      if (B.isCompiled) return F;
      [
        Si,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Ei,
        Bi,
        Ti
      ].forEach((ge) => ge(B, P)), g.compilerExtensions.forEach((ge) => ge(B, P)), B.__beforeBegin = null, [
        vi,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ai,
        // default to 1 relevance if not specified
        Ri
      ].forEach((ge) => ge(B, P)), B.isCompiled = !0;
      let be = null;
      return typeof B.keywords == "object" && B.keywords.$pattern && (B.keywords = Object.assign({}, B.keywords), be = B.keywords.$pattern, delete B.keywords.$pattern), be = be || /\w+/, B.keywords && (B.keywords = Un(B.keywords, g.case_insensitive)), F.keywordPatternRe = S(be, !0), P && (B.begin || (B.begin = /\B|\b/), F.beginRe = S(F.begin), !B.end && !B.endsWithParent && (B.end = /\B|\b/), B.end && (F.endRe = S(F.end)), F.terminatorEnd = h(F.end) || "", B.endsWithParent && P.terminatorEnd && (F.terminatorEnd += (B.end ? "|" : "") + P.terminatorEnd)), B.illegal && (F.illegalRe = S(
        /** @type {RegExp | string} */
        B.illegal
      )), B.contains || (B.contains = []), B.contains = [].concat(...B.contains.map(function(ge) {
        return Ni(ge === "self" ? B : ge);
      })), B.contains.forEach(function(ge) {
        pe(
          /** @type Mode */
          ge,
          F
        );
      }), B.starts && pe(B.starts, P), F.matcher = de(F), F;
    }
    if (g.compilerExtensions || (g.compilerExtensions = []), g.contains && g.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return g.classNameAliases = s(g.classNameAliases || {}), pe(
      /** @type Mode */
      g
    );
  }
  function Wn(g) {
    return g ? g.endsWithParent || Wn(g.starts) : !1;
  }
  function Ni(g) {
    return g.variants && !g.cachedVariants && (g.cachedVariants = g.variants.map(function(S) {
      return s(g, { variants: null }, S);
    })), g.cachedVariants ? g.cachedVariants : Wn(g) ? s(g, { starts: g.starts ? s(g.starts) : null }) : Object.isFrozen(g) ? s(g) : g;
  }
  var Oi = "11.11.1";
  class Di extends Error {
    constructor(S, T) {
      super(S), this.name = "HTMLInjectionError", this.html = T;
    }
  }
  const nn = n, Zn = s, Gn = /* @__PURE__ */ Symbol("nomatch"), Hi = 7, Qn = function(g) {
    const S = /* @__PURE__ */ Object.create(null), T = /* @__PURE__ */ Object.create(null), W = [];
    let de = !0;
    const pe = "Could not find the language '{}', did you forget to load/include a language module?", B = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let P = {
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
    function F(E) {
      return P.noHighlightRe.test(E);
    }
    function be(E) {
      let H = E.className + " ";
      H += E.parentNode ? E.parentNode.className : "";
      const V = P.languageDetectRe.exec(H);
      if (V) {
        const ae = Ue(V[1]);
        return ae || (jn(pe.replace("{}", V[1])), jn("Falling back to no-highlight mode for this block.", E)), ae ? V[1] : "no-highlight";
      }
      return H.split(/\s+/).find((ae) => F(ae) || Ue(ae));
    }
    function ge(E, H, V) {
      let ae = "", me = "";
      typeof H == "object" ? (ae = E, V = H.ignoreIllegals, me = H.language) : (et("10.7.0", "highlight(lang, code, ...args) has been deprecated."), et("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), me = E, ae = H), V === void 0 && (V = !0);
      const _e = {
        code: ae,
        language: me
      };
      $t("before:highlight", _e);
      const qe = _e.result ? _e.result : at(_e.language, _e.code, V);
      return qe.code = _e.code, $t("after:highlight", qe), qe;
    }
    function at(E, H, V, ae) {
      const me = /* @__PURE__ */ Object.create(null);
      function _e(_, N) {
        return _.keywords[N];
      }
      function qe() {
        if (!Z.keywords) {
          ke.addText(oe);
          return;
        }
        let _ = 0;
        Z.keywordPatternRe.lastIndex = 0;
        let N = Z.keywordPatternRe.exec(oe), Q = "";
        for (; N; ) {
          Q += oe.substring(_, N.index);
          const se = Be.case_insensitive ? N[0].toLowerCase() : N[0], ve = _e(Z, se);
          if (ve) {
            const [Oe, rs] = ve;
            if (ke.addText(Q), Q = "", me[se] = (me[se] || 0) + 1, me[se] <= Hi && (Bt += rs), Oe.startsWith("_"))
              Q += N[0];
            else {
              const is = Be.classNameAliases[Oe] || Oe;
              Ie(N[0], is);
            }
          } else
            Q += N[0];
          _ = Z.keywordPatternRe.lastIndex, N = Z.keywordPatternRe.exec(oe);
        }
        Q += oe.substring(_), ke.addText(Q);
      }
      function Pt() {
        if (oe === "") return;
        let _ = null;
        if (typeof Z.subLanguage == "string") {
          if (!S[Z.subLanguage]) {
            ke.addText(oe);
            return;
          }
          _ = at(Z.subLanguage, oe, !0, nr[Z.subLanguage]), nr[Z.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = sn(oe, Z.subLanguage.length ? Z.subLanguage : null);
        Z.relevance > 0 && (Bt += _.relevance), ke.__addSublanguage(_._emitter, _.language);
      }
      function Re() {
        Z.subLanguage != null ? Pt() : qe(), oe = "";
      }
      function Ie(_, N) {
        _ !== "" && (ke.startScope(N), ke.addText(_), ke.endScope());
      }
      function Vn(_, N) {
        let Q = 1;
        const se = N.length - 1;
        for (; Q <= se; ) {
          if (!_._emit[Q]) {
            Q++;
            continue;
          }
          const ve = Be.classNameAliases[_[Q]] || _[Q], Oe = N[Q];
          ve ? Ie(Oe, ve) : (oe = Oe, qe(), oe = ""), Q++;
        }
      }
      function Jn(_, N) {
        return _.scope && typeof _.scope == "string" && ke.openNode(Be.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (Ie(oe, Be.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), oe = "") : _.beginScope._multi && (Vn(_.beginScope, N), oe = "")), Z = Object.create(_, { parent: { value: Z } }), Z;
      }
      function er(_, N, Q) {
        let se = I(_.endRe, Q);
        if (se) {
          if (_["on:end"]) {
            const ve = new e(_);
            _["on:end"](N, ve), ve.isMatchIgnored && (se = !1);
          }
          if (se) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return er(_.parent, N, Q);
      }
      function Vi(_) {
        return Z.matcher.regexIndex === 0 ? (oe += _[0], 1) : (cn = !0, 0);
      }
      function Ji(_) {
        const N = _[0], Q = _.rule, se = new e(Q), ve = [Q.__beforeBegin, Q["on:begin"]];
        for (const Oe of ve)
          if (Oe && (Oe(_, se), se.isMatchIgnored))
            return Vi(N);
        return Q.skip ? oe += N : (Q.excludeBegin && (oe += N), Re(), !Q.returnBegin && !Q.excludeBegin && (oe = N)), Jn(Q, _), Q.returnBegin ? 0 : N.length;
      }
      function es(_) {
        const N = _[0], Q = H.substring(_.index), se = er(Z, _, Q);
        if (!se)
          return Gn;
        const ve = Z;
        Z.endScope && Z.endScope._wrap ? (Re(), Ie(N, Z.endScope._wrap)) : Z.endScope && Z.endScope._multi ? (Re(), Vn(Z.endScope, _)) : ve.skip ? oe += N : (ve.returnEnd || ve.excludeEnd || (oe += N), Re(), ve.excludeEnd && (oe = N));
        do
          Z.scope && ke.closeNode(), !Z.skip && !Z.subLanguage && (Bt += Z.relevance), Z = Z.parent;
        while (Z !== se.parent);
        return se.starts && Jn(se.starts, _), ve.returnEnd ? 0 : N.length;
      }
      function ts() {
        const _ = [];
        for (let N = Z; N !== Be; N = N.parent)
          N.scope && _.unshift(N.scope);
        _.forEach((N) => ke.openNode(N));
      }
      let It = {};
      function tr(_, N) {
        const Q = N && N[0];
        if (oe += _, Q == null)
          return Re(), 0;
        if (It.type === "begin" && N.type === "end" && It.index === N.index && Q === "") {
          if (oe += H.slice(N.index, N.index + 1), !de) {
            const se = new Error(`0 width match regex (${E})`);
            throw se.languageName = E, se.badRule = It.rule, se;
          }
          return 1;
        }
        if (It = N, N.type === "begin")
          return Ji(N);
        if (N.type === "illegal" && !V) {
          const se = new Error('Illegal lexeme "' + Q + '" for mode "' + (Z.scope || "<unnamed>") + '"');
          throw se.mode = Z, se;
        } else if (N.type === "end") {
          const se = es(N);
          if (se !== Gn)
            return se;
        }
        if (N.type === "illegal" && Q === "")
          return oe += `
`, 1;
        if (ln > 1e5 && ln > N.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return oe += Q, Q.length;
      }
      const Be = Ue(E);
      if (!Be)
        throw Xe(pe.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const ns = zi(Be);
      let on = "", Z = ae || ns;
      const nr = {}, ke = new P.__emitter(P);
      ts();
      let oe = "", Bt = 0, Ke = 0, ln = 0, cn = !1;
      try {
        if (Be.__emitTokens)
          Be.__emitTokens(H, ke);
        else {
          for (Z.matcher.considerAll(); ; ) {
            ln++, cn ? cn = !1 : Z.matcher.considerAll(), Z.matcher.lastIndex = Ke;
            const _ = Z.matcher.exec(H);
            if (!_) break;
            const N = H.substring(Ke, _.index), Q = tr(N, _);
            Ke = _.index + Q;
          }
          tr(H.substring(Ke));
        }
        return ke.finalize(), on = ke.toHTML(), {
          language: E,
          value: on,
          relevance: Bt,
          illegal: !1,
          _emitter: ke,
          _top: Z
        };
      } catch (_) {
        if (_.message && _.message.includes("Illegal"))
          return {
            language: E,
            value: nn(H),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: _.message,
              index: Ke,
              context: H.slice(Ke - 100, Ke + 100),
              mode: _.mode,
              resultSoFar: on
            },
            _emitter: ke
          };
        if (de)
          return {
            language: E,
            value: nn(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: ke,
            _top: Z
          };
        throw _;
      }
    }
    function rn(E) {
      const H = {
        value: nn(E),
        illegal: !1,
        relevance: 0,
        _top: B,
        _emitter: new P.__emitter(P)
      };
      return H._emitter.addText(E), H;
    }
    function sn(E, H) {
      H = H || P.languages || Object.keys(S);
      const V = rn(E), ae = H.filter(Ue).filter(Yn).map(
        (Re) => at(Re, E, !1)
      );
      ae.unshift(V);
      const me = ae.sort((Re, Ie) => {
        if (Re.relevance !== Ie.relevance) return Ie.relevance - Re.relevance;
        if (Re.language && Ie.language) {
          if (Ue(Re.language).supersetOf === Ie.language)
            return 1;
          if (Ue(Ie.language).supersetOf === Re.language)
            return -1;
        }
        return 0;
      }), [_e, qe] = me, Pt = _e;
      return Pt.secondBest = qe, Pt;
    }
    function Ui(E, H, V) {
      const ae = H && T[H] || V;
      E.classList.add("hljs"), E.classList.add(`language-${ae}`);
    }
    function an(E) {
      let H = null;
      const V = be(E);
      if (F(V)) return;
      if ($t(
        "before:highlightElement",
        { el: E, language: V }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && (P.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), P.throwUnescapedHTML))
        throw new Di(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      H = E;
      const ae = H.textContent, me = V ? ge(ae, { language: V, ignoreIllegals: !0 }) : sn(ae);
      E.innerHTML = me.value, E.dataset.highlighted = "yes", Ui(E, V, me.language), E.result = {
        language: me.language,
        // TODO: remove with version 11.0
        re: me.relevance,
        relevance: me.relevance
      }, me.secondBest && (E.secondBest = {
        language: me.secondBest.language,
        relevance: me.secondBest.relevance
      }), $t("after:highlightElement", { el: E, result: me, text: ae });
    }
    function qi(E) {
      P = Zn(P, E);
    }
    const ji = () => {
      _t(), et("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Fi() {
      _t(), et("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Xn = !1;
    function _t() {
      function E() {
        _t();
      }
      if (document.readyState === "loading") {
        Xn || window.addEventListener("DOMContentLoaded", E, !1), Xn = !0;
        return;
      }
      document.querySelectorAll(P.cssSelector).forEach(an);
    }
    function Wi(E, H) {
      let V = null;
      try {
        V = H(g);
      } catch (ae) {
        if (Xe("Language definition for '{}' could not be registered.".replace("{}", E)), de)
          Xe(ae);
        else
          throw ae;
        V = B;
      }
      V.name || (V.name = E), S[E] = V, V.rawDefinition = H.bind(null, g), V.aliases && Kn(V.aliases, { languageName: E });
    }
    function Zi(E) {
      delete S[E];
      for (const H of Object.keys(T))
        T[H] === E && delete T[H];
    }
    function Gi() {
      return Object.keys(S);
    }
    function Ue(E) {
      return E = (E || "").toLowerCase(), S[E] || S[T[E]];
    }
    function Kn(E, { languageName: H }) {
      typeof E == "string" && (E = [E]), E.forEach((V) => {
        T[V.toLowerCase()] = H;
      });
    }
    function Yn(E) {
      const H = Ue(E);
      return H && !H.disableAutodetect;
    }
    function Qi(E) {
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
    function Xi(E) {
      Qi(E), W.push(E);
    }
    function Ki(E) {
      const H = W.indexOf(E);
      H !== -1 && W.splice(H, 1);
    }
    function $t(E, H) {
      const V = E;
      W.forEach(function(ae) {
        ae[V] && ae[V](H);
      });
    }
    function Yi(E) {
      return et("10.7.0", "highlightBlock will be removed entirely in v12.0"), et("10.7.0", "Please use highlightElement now."), an(E);
    }
    Object.assign(g, {
      highlight: ge,
      highlightAuto: sn,
      highlightAll: _t,
      highlightElement: an,
      // TODO: Remove with v12 API
      highlightBlock: Yi,
      configure: qi,
      initHighlighting: ji,
      initHighlightingOnLoad: Fi,
      registerLanguage: Wi,
      unregisterLanguage: Zi,
      listLanguages: Gi,
      getLanguage: Ue,
      registerAliases: Kn,
      autoDetection: Yn,
      inherit: Zn,
      addPlugin: Xi,
      removePlugin: Ki
    }), g.debugMode = function() {
      de = !1;
    }, g.safeMode = function() {
      de = !0;
    }, g.versionString = Oi, g.regex = {
      concat: m,
      lookahead: f,
      either: y,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const E in Ct)
      typeof Ct[E] == "object" && t(Ct[E]);
    return Object.assign(g, Ct), g;
  }, tt = Qn({});
  return tt.newInstance = () => Qn({}), un = tt, tt.HighlightJS = tt, tt.default = tt, un;
}
var as = /* @__PURE__ */ ss();
const le = /* @__PURE__ */ Tr(as), Y = /* @__PURE__ */ new Map(), os = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Te = {
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
const Lr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let We = null;
const hn = /* @__PURE__ */ new Map(), ls = 300 * 1e3;
async function Cr(t = os) {
  if (t)
    return We || (We = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const s = (await e.text()).split(/\r?\n/);
        let r = -1;
        for (let l = 0; l < s.length; l++)
          if (/\|\s*Language\s*\|/i.test(s[l])) {
            r = l;
            break;
          }
        if (r === -1) return;
        const i = s[r].replace(/^\||\|$/g, "").split("|").map((l) => l.trim().toLowerCase());
        let a = i.findIndex((l) => /alias|aliases|equivalent|alt|alternates?/i.test(l));
        a === -1 && (a = 1);
        let c = i.findIndex((l) => /file|filename|module|module name|module-name|short|slug/i.test(l));
        if (c === -1) {
          const l = i.findIndex((u) => /language/i.test(u));
          c = l !== -1 ? l : 0;
        }
        let o = [];
        for (let l = r + 1; l < s.length; l++) {
          const u = s[l].trim();
          if (!u || !u.startsWith("|")) break;
          const h = u.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (h.every((w) => /^-+$/.test(w))) continue;
          const f = h;
          if (!f.length) continue;
          const d = (f[c] || f[0] || "").toString().trim().toLowerCase();
          if (!d || /^-+$/.test(d)) continue;
          Y.set(d, d);
          const m = f[a] || "";
          if (m) {
            const w = String(m).split(",").map((y) => y.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const x = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              x && /[a-z0-9]/i.test(x) && (Y.set(x, x), o.push(x));
            }
          }
        }
        try {
          const l = [];
          for (const u of o) {
            const h = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? l.push(h) : Y.delete(u);
          }
          o = l;
        } catch (l) {
          console.warn("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const u of Array.from(Y.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              Y.delete(u), l++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const h = u.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = Y.get(u);
                Y.delete(u), Y.set(h, f);
              } else
                Y.delete(u), l++;
            }
          }
          for (const [u, h] of Array.from(Y.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (Y.delete(u), l++);
          try {
            const u = ":---------------------";
            Y.has(u) && (Y.delete(u), l++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(Y.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (l) {
          console.warn("[codeblocksManager] ignored error", l);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), We);
}
const ot = /* @__PURE__ */ new Set();
async function St(t, e) {
  if (We || (async () => {
    try {
      await Cr();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), We)
    try {
      await We;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (Lr.has(n)) return !1;
  if (Y.size && !Y.has(n)) {
    const r = Te;
    if (!r[n] && !r[t])
      return !1;
  }
  if (ot.has(t)) return !0;
  const s = Te;
  try {
    const r = (e || t || "").toString().replace(/\.js$/i, "").trim(), i = (s[t] || t || "").toString(), a = (s[r] || r || "").toString();
    let c = Array.from(new Set([
      i,
      a,
      r,
      t,
      s[r],
      s[t]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    Y.size && (c = c.filter((u) => {
      if (Y.has(u)) return !0;
      const h = Te[u];
      return !!(h && Y.has(h));
    }));
    let o = null, l = null;
    for (const u of c)
      try {
        const h = Date.now();
        let f = hn.get(u);
        if (f && f.ok === !1 && h - (f.ts || 0) >= ls && (hn.delete(u), f = void 0), f) {
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
          hn.set(u, p), p.promise = (async () => {
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
                  const m = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;
                  return await new Function("u", "return import(u)")(m);
                } catch {
                  try {
                    const w = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;
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
            const d = Y.size && Y.get(t) || u || t;
            return le.registerLanguage(d, p), ot.add(d), d !== t && (le.registerLanguage(t, p), ot.add(t)), !0;
          } catch (d) {
            l = d;
          }
        } else
          try {
            if (Y.has(u) || Y.has(t)) {
              const p = () => ({});
              try {
                le.registerLanguage(u, p), ot.add(u);
              } catch {
              }
              try {
                u !== t && (le.registerLanguage(t, p), ot.add(t));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (h) {
        l = h;
      }
    if (l)
      throw l;
    return !1;
  } catch {
    return !1;
  }
}
let zt = null;
function cs(t = document) {
  We || (async () => {
    try {
      await Cr();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = Te, s = zt || (typeof IntersectionObserver > "u" ? null : (zt = new IntersectionObserver((i, a) => {
    i.forEach((c) => {
      if (!c.isIntersecting) return;
      const o = c.target;
      try {
        a.unobserve(o);
      } catch (l) {
        console.warn("[codeblocksManager] observer unobserve failed", l);
      }
      (async () => {
        try {
          const l = o.getAttribute && o.getAttribute("class") || o.className || "", u = l.match(/language-([a-zA-Z0-9_+-]+)/) || l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (u && u[1]) {
            const h = (u[1] || "").toLowerCase(), f = e[h] || h, p = Y.size && (Y.get(f) || Y.get(String(f).toLowerCase())) || f;
            try {
              await St(p);
            } catch (d) {
              console.warn("[codeblocksManager] registerLanguage failed", d);
            }
            try {
              le.highlightElement(o);
            } catch (d) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const h = o.textContent || "";
              try {
                if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                  const f = le.highlight(h, { language: "plaintext" });
                  f && f.value && (o.innerHTML = f.value);
                }
              } catch {
                try {
                  le.highlightElement(o);
                } catch (p) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (h) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", h);
            }
        } catch (l) {
          console.warn("[codeblocksManager] observer entry processing failed", l);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), zt)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    r.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", c = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const o = (c[1] || "").toLowerCase(), l = e[o] || o, u = Y.size && (Y.get(l) || Y.get(String(l).toLowerCase())) || l;
          try {
            await St(u);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          le.highlightElement(i);
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
function mo(t, { useCdn: e = !0 } = {}) {
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
let ft = "light";
function us(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([s, r]) => n.setAttribute(s, r)), document.head.appendChild(n);
}
async function hs(t = "none", e = "/") {
  if (!t || t === "none") return;
  const n = [e + "bulma.css", "/bulma.css"], s = Array.from(new Set(n));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const r of s)
      try {
        const i = await fetch(r, { method: "GET" });
        if (i.ok) {
          const a = await i.text(), c = document.createElement("style");
          c.setAttribute("data-bulma-override", r), c.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + a)), document.head.appendChild(c);
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
    us(i, { "data-bulmaswatch-theme": r });
  } catch (r) {
    console.warn("[bulmaManager] ensureBulma failed", r);
  }
}
function ds(t) {
  ft = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", ft), ft === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function wo(t) {
  const e = document.documentElement;
  for (const [n, s] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${n}`, s);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Mr(t) {
  if (!t || !(t instanceof HTMLElement)) return () => {
  };
  const e = () => {
    ft === "dark" ? (t.classList.add("is-dark"), t.classList.remove("is-light")) : (t.classList.add("is-light"), t.classList.remove("is-dark"));
  };
  e();
  const n = new MutationObserver(() => {
    ft = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light", e();
  });
  try {
    n.observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme"] });
  } catch {
  }
  return () => {
    try {
      n.disconnect();
    } catch {
    }
  };
}
const _r = {
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
}, it = JSON.parse(JSON.stringify(_r));
let jt = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  jt = String(t).split("-")[0].toLowerCase();
}
_r[jt] || (jt = "en");
let Ze = jt;
function ht(t, e = {}) {
  const n = it[Ze] || it.en;
  let s = n && n[t] ? n[t] : it.en[t] || "";
  for (const r of Object.keys(e))
    s = s.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return s;
}
async function $r(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const s = await fetch(n);
    if (!s.ok) return;
    const r = await s.json();
    for (const i of Object.keys(r || {}))
      it[i] = Object.assign({}, it[i] || {}, r[i]);
  } catch {
  }
}
function Pr(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Ze = it[e] ? e : "en";
}
const ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ze;
  },
  loadL10nFile: $r,
  setLang: Pr,
  t: ht
}, Symbol.toStringTag, { value: "Module" })), fs = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Ir(t, e = "worker") {
  let n = null;
  function s() {
    if (!n)
      try {
        const c = t();
        n = c || null, c && c.addEventListener("error", () => {
          try {
            n === c && (n = null, c.terminate && c.terminate());
          } catch (o) {
            console.warn("[" + e + "] worker termination failed", o);
          }
        });
      } catch (c) {
        n = null, console.warn("[" + e + "] worker init failed", c);
      }
    return n;
  }
  function r() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (c) {
      console.warn("[" + e + "] worker termination failed", c);
    }
  }
  function i(c, o = 1e3) {
    return new Promise((l, u) => {
      const h = s();
      if (!h) return u(new Error("worker unavailable"));
      const f = String(Math.random());
      c.id = f;
      let p = null;
      const d = () => {
        p && clearTimeout(p), h.removeEventListener("message", m), h.removeEventListener("error", w);
      }, m = (y) => {
        const x = y.data || {};
        x.id === f && (d(), x.error ? u(new Error(x.error)) : l(x.result));
      }, w = (y) => {
        d(), console.warn("[" + e + "] worker error event", y);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (x) {
          console.warn("[" + e + "] worker termination failed", x);
        }
        u(new Error(y && y.message || "worker error"));
      };
      p = setTimeout(() => {
        d(), console.warn("[" + e + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (y) {
          console.warn("[" + e + "] worker termination on timeout failed", y);
        }
        u(new Error("worker timeout"));
      }, o), h.addEventListener("message", m), h.addEventListener("error", w);
      try {
        h.postMessage(c);
      } catch (y) {
        d(), u(y);
      }
    });
  }
  return { get: s, send: i, terminate: r };
}
function gs(t) {
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
const Ne = /* @__PURE__ */ new Set();
function Tn(t) {
  ms(), Ne.clear();
  for (const e of Le)
    e && Ne.add(e);
  sr(X), sr(U), Tn._refreshed = !0;
}
function sr(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Ne.add(e);
}
function ar(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, s) {
    return s && Ne.add(s), e.call(this, n, s);
  };
}
let or = !1;
function ms() {
  or || (ar(X), ar(U), or = !0);
}
function Br(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function he(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function At(t) {
  return String(t || "").replace(/\/+$/, "");
}
function vt(t) {
  return At(t) + "/";
}
function ws(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Nt(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const r = t, i = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, a = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = i ? Math.max(a, i.top) : a, u = (i ? Math.min(c, i.bottom) : c) + Number(e || 0);
    let h = 0;
    r && (h = r.clientHeight || (i ? i.height : 0)), h || (h = c - a);
    let f = 0.6;
    try {
      const w = r && window.getComputedStyle ? window.getComputedStyle(r) : null, y = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), x = y ? parseFloat(y) : NaN;
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
        const x = w.getBoundingClientRect ? w.getBoundingClientRect() : null, I = w.src || w.getAttribute && w.getAttribute("src"), $ = x && x.height > 1 ? x.height : p, A = x ? x.top : 0, q = A + $;
        x && $ > 0 && A <= u && q >= o && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), ws(I), d = !0), !m && x && x.top <= u && (m = { img: w, src: I, rect: x, beforeLoading: y });
      } catch (y) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", y);
      }
    }), !d && m) {
      const { img: w, src: y, rect: x, beforeLoading: I } = m;
      try {
        w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high");
      } catch ($) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", $);
      }
    }
  } catch (s) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", s);
  }
}
function Ft(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Ft);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const X = /* @__PURE__ */ new Map();
let Ce = [], Ln = !1;
function bs(t) {
  Ln = !!t;
}
function zr(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function ys() {
  return Ce;
}
const Nr = Ir(() => gs(fs), "slugManager");
function Cn() {
  return Nr.get();
}
function Or(t) {
  return Nr.send(t);
}
async function ks(t, e = 1, n = void 0) {
  if (!Cn()) return Gt(t, e, n);
  try {
    return await Or({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
  } catch (r) {
    try {
      return await Gt(t, e, n);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), r;
    }
  }
}
async function xs(t, e, n) {
  return Cn() ? Or({ type: "crawlForSlug", slug: t, base: e, maxQueue: n }) : Mn(t, e, n);
}
function je(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const s = e.split("/")[0], r = Ce.includes(s);
      let i = X.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), r ? i.langs[s] = e : i.default = e, X.set(t, i);
    } else
      X.set(t, e);
}
const Vt = /* @__PURE__ */ new Set();
function Ss(t) {
  typeof t == "function" && Vt.add(t);
}
function vs(t) {
  typeof t == "function" && Vt.delete(t);
}
const U = /* @__PURE__ */ new Map();
let wn = {}, Le = [], st = "_404.md", rt = "_home.md";
function bn(t) {
  t != null && (st = String(t || ""));
}
function As(t) {
  t != null && (rt = String(t || ""));
}
function Es(t) {
  wn = t || {};
}
const gt = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Set();
function Rs() {
  gt.clear(), Wt.clear();
}
function Ts(t) {
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
function Zt(t) {
  X.clear(), U.clear(), Le = [], Ce = Ce || [];
  const e = Object.keys(wn || {});
  if (!e.length) return;
  let n = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? n = new URL(String(t)).pathname : n = String(t || "");
      } catch (s) {
        n = String(t || ""), console.warn("[slugManager] parse contentBase failed", s);
      }
      n = vt(n);
    }
  } catch (s) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  n || (n = Ts(e));
  for (const s of e) {
    let r = s;
    n && s.startsWith(n) ? r = he(s.slice(n.length)) : r = he(s), Le.push(r);
    try {
      Tn();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const i = wn[s];
    if (typeof i == "string") {
      const a = (i || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const c = re(a[1].trim());
        if (c)
          try {
            if (Ce && Ce.length) {
              const l = r.split("/")[0], u = Ce.includes(l);
              let h = X.get(c);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), u ? h.langs[l] = r : h.default = r, X.set(c, h);
            } else
              X.set(c, r);
            U.set(r, c);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
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
  let n = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function Ls(t) {
  return Et(t, void 0);
}
function Et(t, e) {
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
function Dt(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, n) => n);
}
function Rt(t) {
  if (!t || !X.has(t)) return null;
  const e = X.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ce && Ce.length && Ze && e.langs && e.langs[Ze])
    return e.langs[Ze];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const mt = /* @__PURE__ */ new Map();
function Cs() {
  mt.clear();
}
let xe = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && X.has(i)) {
      const a = Rt(i) || X.get(i);
      a && a !== t && (t = a);
    }
  } catch (i) {
    console.warn("[slugManager] slug mapping normalization failed", i);
  }
  const n = e == null ? "" : At(String(e));
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
  if (mt.has(s))
    return mt.get(s);
  const r = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const h = `${n}/${st}`, f = await globalThis.fetch(h);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (h) {
          console.warn("[slugManager] fetching fallback 404 failed", h);
        }
      let u = "";
      try {
        i && typeof i.clone == "function" ? u = await i.clone().text() : i && typeof i.text == "function" ? u = await i.text() : u = "";
      } catch (h) {
        u = "", console.warn("[slugManager] reading error body failed", h);
      }
      throw console.error("fetchMarkdown failed:", { url: s, status: i ? i.status : void 0, statusText: i ? i.statusText : void 0, body: u.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await i.text(), c = a.trim().slice(0, 16).toLowerCase(), o = c.startsWith("<!doctype") || c.startsWith("<html"), l = o || String(t || "").toLowerCase().endsWith(".html");
    if (o && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const u = `${n}/${st}`, h = await globalThis.fetch(u);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return l ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return mt.set(s, r), r;
};
function Ms(t) {
  typeof t == "function" && (xe = t);
}
const Ht = /* @__PURE__ */ new Map();
function _s(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let De = [], lt = null;
async function Gt(t, e = 1, n = void 0) {
  const s = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => he(String(r || ""))))) : [];
  try {
    const r = he(String(st || ""));
    r && !s.includes(r) && s.push(r);
  } catch {
  }
  if (De && De.length && e === 1 && !De.some((i) => {
    try {
      return s.includes(he(String(i.path || "")));
    } catch {
      return !1;
    }
  }))
    return De;
  if (lt) return lt;
  lt = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((l) => he(String(l || ""))))) : [];
    try {
      const l = he(String(st || ""));
      l && !r.includes(l) && r.push(l);
    } catch {
    }
    const i = (l) => {
      if (!r || !r.length) return !1;
      for (const u of r)
        if (u && (l === u || l.startsWith(u + "/")))
          return !0;
      return !1;
    };
    let a = [];
    if (Le && Le.length && (a = Array.from(Le)), !a.length)
      for (const l of X.values())
        l && a.push(l);
    try {
      const l = await qr(t);
      l && l.length && (a = a.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(a), u = [...a];
      for (l.size; u.length && l.size <= Tt; ) {
        const h = u.shift();
        try {
          const f = await xe(h, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], m = String(h || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(m) && Ln && (!h || !h.includes("/")))
              continue;
            const w = _s(p), y = /\[[^\]]+\]\(([^)]+)\)/g;
            let x;
            for (; x = y.exec(w); )
              d.push(x[1]);
            const I = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; x = I.exec(w); )
              d.push(x[1]);
            const $ = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
            for (let A of d)
              try {
                if (Et(A, t) || A.startsWith("..") || A.indexOf("/../") !== -1 || ($ && !A.startsWith("./") && !A.startsWith("/") && !A.startsWith("../") && (A = $ + A), A = he(A), !/\.(md|html?)(?:$|[?#])/i.test(A)) || (A = A.split(/[?#]/)[0], i(A))) continue;
                l.has(A) || (l.add(A), u.push(A), a.push(A));
              } catch (q) {
                console.warn("[slugManager] href processing failed", A, q);
              }
          }
        } catch (f) {
          console.warn("[slugManager] discovery fetch failed for", h, f);
        }
      }
    } catch (l) {
      console.warn("[slugManager] discovery loop failed", l);
    }
    const c = /* @__PURE__ */ new Set();
    a = a.filter((l) => !l || c.has(l) || i(l) ? !1 : (c.add(l), !0));
    const o = [];
    for (const l of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(l))
        try {
          const u = await xe(l, t);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let h = "", f = "";
            if (u.isHtml)
              try {
                const m = new DOMParser().parseFromString(u.raw, "text/html"), w = m.querySelector("title") || m.querySelector("h1");
                w && w.textContent && (h = w.textContent.trim());
                const y = m.querySelector("p");
                if (y && y.textContent && (f = y.textContent.trim()), e >= 2)
                  try {
                    const x = m.querySelector("h1"), I = x && x.textContent ? x.textContent.trim() : h || "", $ = (() => {
                      try {
                        if (U.has(l)) return U.get(l);
                      } catch {
                      }
                      return re(h || l);
                    })(), A = Array.from(m.querySelectorAll("h2"));
                    for (const q of A)
                      try {
                        const j = (q.textContent || "").trim();
                        if (!j) continue;
                        const G = q.id ? q.id : re(j), K = $ ? `${$}::${G}` : `${re(l)}::${G}`;
                        let ne = "", O = q.nextElementSibling;
                        for (; O && O.tagName && O.tagName.toLowerCase() === "script"; ) O = O.nextElementSibling;
                        O && O.textContent && (ne = String(O.textContent).trim()), o.push({ slug: K, title: j, excerpt: ne, path: l, parentTitle: I });
                      } catch (j) {
                        console.warn("[slugManager] indexing H2 failed", j);
                      }
                    if (e === 3)
                      try {
                        const q = Array.from(m.querySelectorAll("h3"));
                        for (const j of q)
                          try {
                            const G = (j.textContent || "").trim();
                            if (!G) continue;
                            const K = j.id ? j.id : re(G), ne = $ ? `${$}::${K}` : `${re(l)}::${K}`;
                            let O = "", L = j.nextElementSibling;
                            for (; L && L.tagName && L.tagName.toLowerCase() === "script"; ) L = L.nextElementSibling;
                            L && L.textContent && (O = String(L.textContent).trim()), o.push({ slug: ne, title: G, excerpt: O, path: l, parentTitle: I });
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
              const d = u.raw, m = d.match(/^#\s+(.+)$/m);
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
                  const I = (d.match(/^#\s+(.+)$/m) || [])[1];
                  y = I ? I.trim() : "", x = (function() {
                    try {
                      if (U.has(l)) return U.get(l);
                    } catch {
                    }
                    return re(h || l);
                  })();
                  const $ = /^##\s+(.+)$/gm;
                  let A;
                  for (; A = $.exec(d); )
                    try {
                      const q = (A[1] || "").trim(), j = Dt(q);
                      if (!q) continue;
                      const G = re(q), K = x ? `${x}::${G}` : `${re(l)}::${G}`, O = d.slice($.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), L = O && O[1] ? String(O[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: K, title: j, excerpt: L, path: l, parentTitle: y });
                    } catch (q) {
                      console.warn("[slugManager] indexing markdown H2 failed", q);
                    }
                } catch (I) {
                  console.warn("[slugManager] collect markdown H2s failed", I);
                }
                if (e === 3)
                  try {
                    const I = /^###\s+(.+)$/gm;
                    let $;
                    for (; $ = I.exec(d); )
                      try {
                        const A = ($[1] || "").trim(), q = Dt(A);
                        if (!A) continue;
                        const j = re(A), G = x ? `${x}::${j}` : `${re(l)}::${j}`, ne = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), O = ne && ne[1] ? String(ne[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: G, title: q, excerpt: O, path: l, parentTitle: y });
                      } catch (A) {
                        console.warn("[slugManager] indexing markdown H3 failed", A);
                      }
                  } catch (I) {
                    console.warn("[slugManager] collect markdown H3s failed", I);
                  }
              }
            }
            let p = "";
            try {
              U.has(l) && (p = U.get(l));
            } catch (d) {
              console.warn("[slugManager] mdToSlug access failed", d);
            }
            p || (p = re(h || l)), o.push({ slug: p, title: h, excerpt: f, path: l });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    try {
      De = o.filter((u) => {
        try {
          return !i(String(u.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (l) {
      console.warn("[slugManager] filtering index by excludes failed", l), De = o;
    }
    return De;
  })();
  try {
    await lt;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return lt = null, De;
}
const Dr = 1e3;
let Tt = Dr;
function $s(t) {
  typeof t == "number" && t >= 0 && (Tt = t);
}
const Hr = new DOMParser(), Ur = "a[href]";
let Mn = async function(t, e, n = Tt) {
  if (Ht.has(t)) return Ht.get(t);
  let s = null;
  const r = /* @__PURE__ */ new Set(), i = [""];
  for (; i.length && !s && !(i.length > n); ) {
    const a = i.shift();
    if (r.has(a)) continue;
    r.add(a);
    let c = e;
    c.endsWith("/") || (c += "/"), c += a;
    try {
      let o;
      try {
        o = await globalThis.fetch(c);
      } catch (f) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: f });
        continue;
      }
      if (!o || !o.ok) {
        o && !o.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: o.status });
        continue;
      }
      const l = await o.text(), h = Hr.parseFromString(l, "text/html").querySelectorAll(Ur);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Et(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            r.has(d) || i.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = he(a + p);
            try {
              if (U.has(d))
                continue;
              for (const m of X.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await xe(d, e);
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
    } catch (o) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", o);
    }
  }
  return Ht.set(t, s), s;
};
async function qr(t, e = Tt) {
  const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = [""];
  for (; r.length && !(r.length > e); ) {
    const i = r.shift();
    if (s.has(i)) continue;
    s.add(i);
    let a = t;
    a.endsWith("/") || (a += "/"), a += i;
    try {
      let c;
      try {
        c = await globalThis.fetch(a);
      } catch (h) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: a, error: h });
        continue;
      }
      if (!c || !c.ok) {
        c && !c.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: a, status: c.status });
        continue;
      }
      const o = await c.text(), u = Hr.parseFromString(o, "text/html").querySelectorAll(Ur);
      for (const h of u)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Et(f, t) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
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
    } catch (c) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", c);
    }
  }
  return Array.from(n);
}
async function jr(t, e, n) {
  if (t && typeof t == "string" && (t = he(t), t = At(t)), X.has(t))
    return Rt(t) || X.get(t);
  for (const r of Vt)
    try {
      const i = await r(t, e);
      if (i)
        return je(t, i), U.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Le && Le.length) {
    if (gt.has(t)) {
      const r = gt.get(t);
      return X.set(t, r), U.set(r, t), r;
    }
    for (const r of Le)
      if (!Wt.has(r))
        try {
          const i = await xe(r, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const c = re(a[1].trim());
              if (Wt.add(r), c && gt.set(c, r), c === t)
                return je(t, r), U.set(r, t), r;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const r = await Gt(e);
    if (r && r.length) {
      const i = r.find((a) => a.slug === t);
      if (i)
        return je(t, i.path), U.set(i.path, t), i.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Mn(t, e, n);
    if (r)
      return je(t, r), U.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const r of s)
    try {
      const i = await xe(r, e);
      if (i && i.raw)
        return je(t, r), U.set(r, t), r;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Le && Le.length)
    for (const r of Le)
      try {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (re(i) === t)
          return je(t, r), U.set(r, t), r;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const r = [];
    rt && typeof rt == "string" && rt.trim() && r.push(rt), r.includes("_home.md") || r.push("_home.md");
    for (const i of r)
      try {
        const a = await xe(i, e);
        if (a && a.raw) {
          const c = (a.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && re(c[1].trim()) === t)
            return je(t, i), U.set(i, t), i;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Dr,
  _setAllMd: Es,
  _storeSlugMapping: je,
  addSlugResolver: Ss,
  get allMarkdownPaths() {
    return Le;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Gt,
  buildSearchIndexWorker: ks,
  clearFetchCache: Cs,
  clearListCaches: Rs,
  crawlAllMarkdown: qr,
  crawlCache: Ht,
  crawlForSlug: Mn,
  crawlForSlugWorker: xs,
  get defaultCrawlMaxQueue() {
    return Tt;
  },
  ensureSlug: jr,
  fetchCache: mt,
  get fetchMarkdown() {
    return xe;
  },
  getLanguages: ys,
  get homePage() {
    return rt;
  },
  initSlugWorker: Cn,
  isExternalLink: Ls,
  isExternalLinkWithBase: Et,
  listPathsFetched: Wt,
  listSlugCache: gt,
  mdToSlug: U,
  get notFoundPage() {
    return st;
  },
  removeSlugResolver: vs,
  resolveSlugPath: Rt,
  get searchIndex() {
    return De;
  },
  setContentBase: Zt,
  setDefaultCrawlMaxQueue: $s,
  setFetchMarkdown: Ms,
  setHomePage: As,
  setLanguages: zr,
  setNotFoundPage: bn,
  setSkipRootReadme: bs,
  get skipRootReadme() {
    return Ln;
  },
  slugResolvers: Vt,
  slugToMd: X,
  slugify: re,
  unescapeMarkdown: Dt
}, Symbol.toStringTag, { value: "Module" }));
let Fr = 100;
function lr(t) {
  Fr = t;
}
let wt = 300 * 1e3;
function cr(t) {
  wt = t;
}
const Me = /* @__PURE__ */ new Map();
function Ps(t) {
  if (!Me.has(t)) return;
  const e = Me.get(t), n = Date.now();
  if (e.ts + wt < n) {
    Me.delete(t);
    return;
  }
  return Me.delete(t), Me.set(t, e), e.value;
}
function Is(t, e) {
  if (ur(), ur(), Me.delete(t), Me.set(t, { value: e, ts: Date.now() }), Me.size > Fr) {
    const n = Me.keys().next().value;
    n !== void 0 && Me.delete(n);
  }
}
function ur() {
  if (!wt || wt <= 0) return;
  const t = Date.now();
  for (const [e, n] of Me.entries())
    n.ts + wt < t && Me.delete(e);
}
async function Bs(t, e) {
  const n = new Set(Ne), s = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(s || [])) {
    const i = r.getAttribute("href") || "";
    if (i)
      try {
        const a = new URL(i, location.href);
        if (a.origin !== location.origin) continue;
        const c = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (c) {
          let l = he(c[1]);
          l && n.add(l);
          continue;
        }
        const o = a.pathname || "";
        if (o) {
          const l = new URL(e), u = vt(l.pathname);
          if (o.indexOf(u) !== -1) {
            let h = o.startsWith(u) ? o.slice(u.length) : o;
            h = he(h), h && n.add(h);
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
        const c = (a[1] || "").trim();
        if (c && re(c) === t)
          return r;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function zs(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (X.has(n)) {
        const s = Rt(n) || X.get(n);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (Ne && Ne.size)
          for (const s of Ne) {
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
async function Ns(t, e) {
  const n = t || "", s = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let r = t || "", i = null;
  if (r && String(r).includes("::")) {
    const d = String(r).split("::", 2);
    r = d[0], i = d[1] || null;
  }
  const c = `${t}|||${typeof ps < "u" && Ze ? Ze : ""}`, o = Ps(c);
  if (o)
    r = o.resolved, i = o.anchor || i;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let d = decodeURIComponent(String(r || ""));
      if (d && typeof d == "string" && (d = he(d), d = At(d)), X.has(d))
        r = Rt(d) || X.get(d);
      else {
        let m = await Bs(d, e);
        if (m)
          r = m;
        else if (Tn._refreshed && Ne && Ne.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await jr(d, e);
          w && (r = w);
        }
      }
    }
    Is(c, { resolved: r, anchor: i });
  }
  !i && s && (i = s);
  const l = zs(r), u = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (u && l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 1 && /index\.html$/i.test(l[0]) && !u && !X.has(r) && !X.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const d of l)
    if (d)
      try {
        const m = he(d);
        h = await xe(m, e), f = m;
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
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: l, contentBase: e, fetchError: p && (p.message || String(p)) || null });
    } catch {
    }
    try {
      if (u && String(n || "").toLowerCase().includes(".html"))
        try {
          const d = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", d);
          const m = await fetch(d);
          if (m && m.ok) {
            const w = await m.text(), y = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", x = (w || "").toLowerCase(), I = y && y.indexOf && y.indexOf("text/html") !== -1 || x.indexOf("<!doctype") !== -1 || x.indexOf("<html") !== -1;
            if (I || console.warn("[router] absolute fetch returned non-HTML", { abs: d, contentType: y, snippet: x.slice(0, 200) }), I)
              try {
                const $ = d, A = new URL(".", $).toString();
                try {
                  const j = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (j) {
                    const G = j.parseFromString(w || "", "text/html"), K = (C, R) => {
                      try {
                        const v = R.getAttribute(C) || "";
                        if (!v || /^(https?:)?\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return;
                        try {
                          const b = new URL(v, $).toString();
                          R.setAttribute(C, b);
                        } catch (b) {
                          console.warn("[router] rewrite attribute failed", C, b);
                        }
                      } catch (v) {
                        console.warn("[router] rewrite helper failed", v);
                      }
                    }, ne = G.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), O = [];
                    for (const C of Array.from(ne || []))
                      try {
                        const R = C.tagName ? C.tagName.toLowerCase() : "";
                        if (R === "a") continue;
                        if (C.hasAttribute("src")) {
                          const v = C.getAttribute("src");
                          K("src", C);
                          const b = C.getAttribute("src");
                          v !== b && O.push({ attr: "src", tag: R, before: v, after: b });
                        }
                        if (C.hasAttribute("href") && R === "link") {
                          const v = C.getAttribute("href");
                          K("href", C);
                          const b = C.getAttribute("href");
                          v !== b && O.push({ attr: "href", tag: R, before: v, after: b });
                        }
                        if (C.hasAttribute("href") && R !== "link") {
                          const v = C.getAttribute("href");
                          K("href", C);
                          const b = C.getAttribute("href");
                          v !== b && O.push({ attr: "href", tag: R, before: v, after: b });
                        }
                        if (C.hasAttribute("xlink:href")) {
                          const v = C.getAttribute("xlink:href");
                          K("xlink:href", C);
                          const b = C.getAttribute("xlink:href");
                          v !== b && O.push({ attr: "xlink:href", tag: R, before: v, after: b });
                        }
                        if (C.hasAttribute("poster")) {
                          const v = C.getAttribute("poster");
                          K("poster", C);
                          const b = C.getAttribute("poster");
                          v !== b && O.push({ attr: "poster", tag: R, before: v, after: b });
                        }
                        if (C.hasAttribute("srcset")) {
                          const M = (C.getAttribute("srcset") || "").split(",").map((z) => z.trim()).filter(Boolean).map((z) => {
                            const [k, ie] = z.split(/\s+/, 2);
                            if (!k || /^(https?:)?\/\//i.test(k) || k.startsWith("/")) return z;
                            try {
                              const ue = new URL(k, $).toString();
                              return ie ? `${ue} ${ie}` : ue;
                            } catch {
                              return z;
                            }
                          }).join(", ");
                          C.setAttribute("srcset", M);
                        }
                      } catch {
                      }
                    const L = G.documentElement && G.documentElement.outerHTML ? G.documentElement.outerHTML : w;
                    try {
                      O && O.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: O });
                    } catch {
                    }
                    return { data: { raw: L, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
                  }
                } catch {
                }
                let q = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? q = w.replace(/(<head[^>]*>)/i, `$1<base href="${A}">`) : q = `<base href="${A}">` + w), { data: { raw: q, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
              } catch {
                return { data: { raw: w, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
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
function _n() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Je = _n();
function Wr(t) {
  Je = t;
}
var Ye = { exec: () => null };
function ee(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(Ee.caret, "$1"), n = n.replace(r, a), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Os = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ee = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Ds = /^(?:[ \t]*(?:\n|$))+/, Hs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Us = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Lt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, qs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, $n = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Zr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = ee(Zr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), js = ee(Zr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Pn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Fs = /^[^\n]+/, In = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ws = ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", In).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Zs = ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, $n).getRegex(), Jt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Bn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Gs = ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Bn).replace("tag", Jt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Qr = ee(Pn).replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Qs = ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Qr).getRegex(), zn = { blockquote: Qs, code: Hs, def: Ws, fences: Us, heading: qs, hr: Lt, html: Gs, lheading: Gr, list: Zs, newline: Ds, paragraph: Qr, table: Ye, text: Fs }, hr = ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Xs = { ...zn, lheading: js, table: hr, paragraph: ee(Pn).replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", hr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex() }, Ks = { ...zn, html: ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Bn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ye, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ee(Pn).replace("hr", Lt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ys = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Vs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Xr = /^( {2,}|\\)\n(?!\s*$)/, Js = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, en = /[\p{P}\p{S}]/u, Nn = /[\s\p{P}\p{S}]/u, Kr = /[^\s\p{P}\p{S}]/u, ea = ee(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Nn).getRegex(), Yr = /(?!~)[\p{P}\p{S}]/u, ta = /(?!~)[\s\p{P}\p{S}]/u, na = /(?:[^\s\p{P}\p{S}]|~)/u, Vr = /(?![*_])[\p{P}\p{S}]/u, ra = /(?![*_])[\s\p{P}\p{S}]/u, ia = /(?:[^\s\p{P}\p{S}]|[*_])/u, sa = ee(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Os ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Jr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, aa = ee(Jr, "u").replace(/punct/g, en).getRegex(), oa = ee(Jr, "u").replace(/punct/g, Yr).getRegex(), ei = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", la = ee(ei, "gu").replace(/notPunctSpace/g, Kr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), ca = ee(ei, "gu").replace(/notPunctSpace/g, na).replace(/punctSpace/g, ta).replace(/punct/g, Yr).getRegex(), ua = ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Kr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), ha = ee(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Vr).getRegex(), da = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", pa = ee(da, "gu").replace(/notPunctSpace/g, ia).replace(/punctSpace/g, ra).replace(/punct/g, Vr).getRegex(), fa = ee(/\\(punct)/, "gu").replace(/punct/g, en).getRegex(), ga = ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ma = ee(Bn).replace("(?:-->|$)", "-->").getRegex(), wa = ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ma).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ba = ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Qt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ti = ee(/^!?\[(label)\]\[(ref)\]/).replace("label", Qt).replace("ref", In).getRegex(), ni = ee(/^!?\[(ref)\](?:\[\])?/).replace("ref", In).getRegex(), ya = ee("reflink|nolink(?!\\()", "g").replace("reflink", ti).replace("nolink", ni).getRegex(), dr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, On = { _backpedal: Ye, anyPunctuation: fa, autolink: ga, blockSkip: sa, br: Xr, code: Vs, del: Ye, delLDelim: Ye, delRDelim: Ye, emStrongLDelim: aa, emStrongRDelimAst: la, emStrongRDelimUnd: ua, escape: Ys, link: ba, nolink: ni, punctuation: ea, reflink: ti, reflinkSearch: ya, tag: wa, text: Js, url: Ye }, ka = { ...On, link: ee(/^!?\[(label)\]\((.*?)\)/).replace("label", Qt).getRegex(), reflink: ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qt).getRegex() }, yn = { ...On, emStrongRDelimAst: ca, emStrongLDelim: oa, delLDelim: ha, delRDelim: pa, url: ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", dr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", dr).getRegex() }, xa = { ...yn, br: ee(Xr).replace("{2,}", "*").getRegex(), text: ee(yn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ot = { normal: zn, gfm: Xs, pedantic: Ks }, ct = { normal: On, gfm: yn, breaks: xa, pedantic: ka }, Sa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, pr = (t) => Sa[t];
function ze(t, e) {
  if (e) {
    if (Ee.escapeTest.test(t)) return t.replace(Ee.escapeReplace, pr);
  } else if (Ee.escapeTestNoEncode.test(t)) return t.replace(Ee.escapeReplaceNoEncode, pr);
  return t;
}
function fr(t) {
  try {
    t = encodeURI(t).replace(Ee.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function gr(t, e) {
  let n = t.replace(Ee.findPipe, (i, a, c) => {
    let o = !1, l = a;
    for (; --l >= 0 && c[l] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), s = n.split(Ee.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(Ee.slashPipe, "|");
  return s;
}
function ut(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function va(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) n++;
  else if (t[s] === e[1] && (n--, n < 0)) return s;
  return n > 0 ? -2 : -1;
}
function Aa(t, e = 0) {
  let n = e, s = "";
  for (let r of t) if (r === "	") {
    let i = 4 - n % 4;
    s += " ".repeat(i), n += i;
  } else s += r, n++;
  return s;
}
function mr(t, e, n, s, r) {
  let i = e.href, a = e.title || null, c = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let o = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: c, tokens: s.inlineTokens(c) };
  return s.state.inLink = !1, o;
}
function Ea(t, e, n) {
  let s = t.match(n.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((i) => {
    let a = i.match(n.other.beginningSpace);
    if (a === null) return i;
    let [c] = a;
    return c.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var Xt = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Je;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : ut(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = Ea(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = ut(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: ut(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = ut(e[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let a = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), a = !0;
        else if (!a) c.push(n[o]);
        else break;
        n = n.slice(o);
        let l = c.join(`
`), u = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${l}` : l, r = r ? `${r}
${u}` : u;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, i, !0), this.lexer.state.top = h, n.length === 0) break;
        let f = i.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, d = p.raw + `
` + n.join(`
`), m = this.blockquote(d);
          i[i.length - 1] = m, s = s.substring(0, s.length - p.raw.length) + m.raw, r = r.substring(0, r.length - p.text.length) + m.text;
          break;
        } else if (f?.type === "list") {
          let p = f, d = p.raw + `
` + n.join(`
`), m = this.list(d);
          i[i.length - 1] = m, s = s.substring(0, s.length - f.raw.length) + m.raw, r = r.substring(0, r.length - p.raw.length) + m.raw, n = d.substring(i.at(-1).raw.length).split(`
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
        let o = !1, l = "", u = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        l = e[0], t = t.substring(l.length);
        let h = Aa(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !h.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, u = h.trimStart()) : p ? d = e[1].length + 1 : (d = h.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, u = h.slice(d), d += e[1].length), p && this.rules.other.blankLine.test(f) && (l += f + `
`, t = t.substring(f.length + 1), o = !0), !o) {
          let m = this.rules.other.nextBulletRegex(d), w = this.rules.other.hrRegex(d), y = this.rules.other.fencesBeginRegex(d), x = this.rules.other.headingBeginRegex(d), I = this.rules.other.htmlBeginRegex(d), $ = this.rules.other.blockquoteBeginRegex(d);
          for (; t; ) {
            let A = t.split(`
`, 1)[0], q;
            if (f = A, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), q = f) : q = f.replace(this.rules.other.tabCharGlobal, "    "), y.test(f) || x.test(f) || I.test(f) || $.test(f) || m.test(f) || w.test(f)) break;
            if (q.search(this.rules.other.nonSpaceChar) >= d || !f.trim()) u += `
` + q.slice(d);
            else {
              if (p || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || y.test(h) || x.test(h) || w.test(h)) break;
              u += `
` + f;
            }
            p = !f.trim(), l += A + `
`, t = t.substring(A.length + 1), h = q.slice(d);
          }
        }
        r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (a = !0)), r.items.push({ type: "list_item", raw: l, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), r.raw += l;
      }
      let c = r.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
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
          let l = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (l) {
            let u = { type: "checkbox", raw: l[0] + " ", checked: l[0] !== "[ ]" };
            o.checked = u.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = u.raw + o.tokens[0].raw, o.tokens[0].text = u.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(u)) : o.tokens.unshift({ type: "paragraph", raw: u.raw, text: u.raw, tokens: [u] }) : o.tokens.unshift(u);
          }
        }
        if (!r.loose) {
          let l = o.tokens.filter((h) => h.type === "space"), u = l.length > 0 && l.some((h) => this.rules.other.anyLine.test(h.raw));
          r.loose = u;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let l of o.tokens) l.type === "text" && (l.type = "paragraph");
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
    let n = gr(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < n.length; a++) i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] });
      for (let a of r) i.rows.push(gr(a, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
        let i = ut(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = va(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), mr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return mr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, i, a, c = r, o = 0, l = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = l.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i) continue;
        if (a = [...i].length, s[3] || s[4]) {
          c += a;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + a) % 3)) {
          o += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + o);
        let u = [...s[0]][0].length, h = t.slice(0, r + s.index + u + a);
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
      let r = [...s[0]].length - 1, i, a, c = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = o.exec(e)) != null; ) {
        if (i = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !i || (a = [...i].length, a !== r)) continue;
        if (s[3] || s[4]) {
          c += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c);
        let l = [...s[0]][0].length, u = t.slice(0, r + s.index + l + a), h = u.slice(r, -r);
        return { type: "del", raw: u, text: h, tokens: this.lexer.inlineTokens(h) };
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
}, $e = class kn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Je, this.options.tokenizer = this.options.tokenizer || new Xt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Ee, block: Ot.normal, inline: ct.normal };
    this.options.pedantic ? (n.block = Ot.pedantic, n.inline = ct.pedantic) : this.options.gfm && (n.block = Ot.gfm, this.options.breaks ? n.inline = ct.breaks : n.inline = ct.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Ot, inline: ct };
  }
  static lex(e, n) {
    return new kn(n).lex(e);
  }
  static lexInline(e, n) {
    return new kn(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Ee.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(Ee.tabCharGlobal, "    ").replace(Ee.spaceLine, "")); e; ) {
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
        let a = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((l) => {
          o = l.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (a = Math.min(a, o));
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
    let a = !1, c = "";
    for (; e; ) {
      a || (c = ""), a = !1;
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
      if (o = this.tokenizer.emStrong(e, s, c)) {
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
      if (o = this.tokenizer.del(e, s, c)) {
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
      let l = e;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, h = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, h), typeof f == "number" && f >= 0 && (u = Math.min(u, f));
        }), u < 1 / 0 && u >= 0 && (l = e.substring(0, u + 1));
      }
      if (o = this.tokenizer.inlineText(l)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), a = !0;
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
}, Kt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Je;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(Ee.notSpaceStart)?.[0], r = t.replace(Ee.endingNewline, "") + `
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
      let c = t.items[a];
      s += this.listitem(c);
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
    let s = this.parser.parseInline(n), r = fr(t);
    if (r === null) return s;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + ze(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = fr(t);
    if (r === null) return ze(n);
    t = r;
    let i = `<img src="${t}" alt="${ze(n)}"`;
    return e && (i += ` title="${ze(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : ze(t.text);
  }
}, Dn = class {
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
}, Pe = class xn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Je, this.options.renderer = this.options.renderer || new Kt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Dn();
  }
  static parse(e, n) {
    return new xn(n).parse(e);
  }
  static parseInline(e, n) {
    return new xn(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let a = r, c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          n += c || "";
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
        let c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += c || "";
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
          let c = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return s;
  }
}, dt = class {
  options;
  block;
  constructor(t) {
    this.options = t || Je;
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
}, Ra = class {
  defaults = _n();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Pe;
  Renderer = Kt;
  TextRenderer = Dn;
  Lexer = $e;
  Tokenizer = Xt;
  Hooks = dt;
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
            let c = r.renderer.apply(this, a);
            return c === !1 && (c = i.apply(this, a)), c;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[r.level];
          i ? i.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new Kt(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let a = i, c = n.renderer[a], o = r[a];
          r[a] = (...l) => {
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Xt(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let a = i, c = n.tokenizer[a], o = r[a];
          r[a] = (...l) => {
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new dt();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, c = n.hooks[a], o = r[a];
          dt.passThroughHooks.has(i) ? r[a] = (l) => {
            if (this.defaults.async && dt.passThroughHooksRespectAsync.has(i)) return (async () => {
              let h = await c.call(r, l);
              return o.call(r, h);
            })();
            let u = c.call(r, l);
            return o.call(r, u);
          } : r[a] = (...l) => {
            if (this.defaults.async) return (async () => {
              let h = await c.apply(r, l);
              return h === !1 && (h = await o.apply(r, l)), h;
            })();
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(a) {
          let c = [];
          return c.push(i.call(this, a)), r && (c = c.concat(r.call(this, a))), c;
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
    return (e, n) => {
      let s = { ...n }, r = { ...this.defaults, ...s }, i = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let a = r.hooks ? await r.hooks.preprocess(e) : e, c = await (r.hooks ? await r.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(a, r), o = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let l = await (r.hooks ? await r.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(l) : l;
      })().catch(i);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let a = (r.hooks ? r.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(e, r);
        r.hooks && (a = r.hooks.processAllTokens(a)), r.walkTokens && this.walkTokens(a, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(a, r);
        return r.hooks && (c = r.hooks.postprocess(c)), c;
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
}, Ve = new Ra();
function te(t, e) {
  return Ve.parse(t, e);
}
te.options = te.setOptions = function(t) {
  return Ve.setOptions(t), te.defaults = Ve.defaults, Wr(te.defaults), te;
};
te.getDefaults = _n;
te.defaults = Je;
te.use = function(...t) {
  return Ve.use(...t), te.defaults = Ve.defaults, Wr(te.defaults), te;
};
te.walkTokens = function(t, e) {
  return Ve.walkTokens(t, e);
};
te.parseInline = Ve.parseInline;
te.Parser = Pe;
te.parser = Pe.parse;
te.Renderer = Kt;
te.TextRenderer = Dn;
te.Lexer = $e;
te.lexer = $e.lex;
te.Tokenizer = Xt;
te.Hooks = dt;
te.parse = te;
te.options;
te.setOptions;
te.use;
te.walkTokens;
te.parseInline;
Pe.parse;
$e.lex;
const ri = `function j() {
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
`, wr = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", ri], { type: "text/javascript;charset=utf-8" });
function Ta(t) {
  let e;
  try {
    if (e = wr && (self.URL || self.webkitURL).createObjectURL(wr), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(ri),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function La(t) {
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
const ii = Ir(() => new Ta(), "markdown"), br = typeof DOMParser < "u" ? new DOMParser() : null;
function Sn() {
  return ii.get();
}
function Ca(t) {
  return ii.send(t, 1e3);
}
const Ge = [];
function vn(t) {
  if (t && typeof t == "object") {
    Ge.push(t);
    try {
      te.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function Ma(t) {
  Ge.length = 0, Array.isArray(t) && Ge.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Ge.forEach((e) => te.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Yt(t) {
  if (Sn && Sn())
    try {
      const i = await Ca({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const c = (br || new DOMParser()).parseFromString(i.html, "text/html"), o = c.querySelectorAll("h1,h2,h3,h4,h5,h6");
          o.forEach((h) => {
            h.id || (h.id = re(h.textContent || ""));
          });
          try {
            c.querySelectorAll("img").forEach((f) => {
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
            c.querySelectorAll("pre code").forEach((f) => {
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
                      } catch (I) {
                        console.warn("[markdown] hljs.highlightElement failed", I);
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
          const l = c.body.innerHTML, u = [];
          return o.forEach((h) => {
            u.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || "").trim(), id: h.id });
          }), { html: l, meta: i.meta || {}, toc: u };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), i;
        }
    } catch (i) {
      console.warn("[markdown] worker render failed", i);
    }
  const { content: n, data: s } = La(t || "");
  if (te.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Ge && Ge.length)
    try {
      Ge.forEach((i) => te.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let r = te.parse(n);
  try {
    const a = (br || new DOMParser()).parseFromString(r, "text/html"), c = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    c.forEach((l) => {
      l.id || (l.id = re(l.textContent || ""));
    });
    try {
      a.querySelectorAll("img").forEach((u) => {
        try {
          u.getAttribute("loading") || u.setAttribute("data-want-lazy", "1");
        } catch (h) {
          console.warn("[markdown] set image loading attribute failed", h);
        }
      });
    } catch (l) {
      console.warn("[markdown] query images failed", l);
    }
    try {
      a.querySelectorAll("pre code").forEach((u) => {
        try {
          const h = u.getAttribute && u.getAttribute("class") || u.className || "", f = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (f)
            try {
              u.setAttribute && u.setAttribute("class", f);
            } catch (m) {
              console.warn("[markdown] set code class failed", m), u.className = f;
            }
          else
            try {
              u.removeAttribute && u.removeAttribute("class");
            } catch (m) {
              console.warn("[markdown] remove code class failed", m), u.className = "";
            }
          const p = f, d = p.match(/language-([a-zA-Z0-9_+-]+)/) || p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!d || !d[1])
            try {
              const m = u.textContent || "";
              try {
                if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                  const w = le.highlight(m, { language: "plaintext" });
                  w && w.value && (u.innerHTML = w.value);
                }
              } catch {
                try {
                  le.highlightElement(u);
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
    } catch (l) {
      console.warn("[markdown] query code blocks failed", l);
    }
    r = a.body.innerHTML;
    const o = [];
    return c.forEach((l) => {
      o.push({ level: Number(l.tagName.substring(1)), text: (l.textContent || "").trim(), id: l.id });
    }), { html: a.body.innerHTML, meta: s || {}, toc: o };
  } catch (i) {
    console.warn("post-process markdown failed", i);
  }
  return { html: r, meta: s || {}, toc: [] };
}
function An(t, e) {
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
      const c = a[1].toLowerCase();
      if (Lr.has(c) || e && e.size && c.length < 3 && !e.has(c) && !(Te && Te[c] && e.has(Te[c]))) continue;
      if (e && e.size) {
        if (e.has(c)) {
          const l = e.get(c);
          l && n.add(l);
          continue;
        }
        if (Te && Te[c]) {
          const l = Te[c];
          if (e.has(l)) {
            const u = e.get(l) || l;
            n.add(u);
            continue;
          }
        }
      }
      (i.has(c) || c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(c) && !r.has(c)) && n.add(c);
    }
  return n;
}
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: vn,
  detectFenceLanguages: An,
  initRendererWorker: Sn,
  markdownPlugins: Ge,
  parseMarkdownToHtml: Yt,
  setMarkdownExtensions: Ma
}, Symbol.toStringTag, { value: "Module" }));
function $a(t, e) {
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
function Pa(t, e) {
  const n = document.createElement("aside");
  n.className = "menu nimbi-nav";
  const s = document.createElement("p");
  s.className = "menu-label", s.textContent = t("navigation"), n.appendChild(s);
  const r = document.createElement("ul");
  return r.className = "menu-list", e.forEach((i) => {
    const a = document.createElement("li"), c = document.createElement("a");
    if (c.href = "#" + i.path, c.textContent = i.name, a.appendChild(c), i.children && i.children.length) {
      const o = document.createElement("ul");
      i.children.forEach((l) => {
        const u = document.createElement("li"), h = document.createElement("a");
        h.href = "#" + l.path, h.textContent = l.name, u.appendChild(h), o.appendChild(u);
      }), a.appendChild(o);
    }
    r.appendChild(a);
  }), n.appendChild(r), n;
}
function Ia(t, e, n = "") {
  const s = document.createElement("aside");
  s.className = "menu nimbi-toc-inner";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), s.appendChild(r);
  const i = document.createElement("ul");
  return i.className = "menu-list", (e || []).forEach((a) => {
    try {
      if (!a || a.level === 1) return;
      const c = document.createElement("li"), o = document.createElement("a"), l = a.id || re(a.text || "");
      o.textContent = a.text || "";
      try {
        const u = String(n || "").replace(/^[\.\/]+/, ""), h = u && U && U.has && U.has(u) ? U.get(u) : u;
        h ? o.href = `?page=${encodeURIComponent(h)}#${encodeURIComponent(l)}` : o.href = `#${encodeURIComponent(l)}`;
      } catch (u) {
        console.warn("[htmlBuilder] buildTocElement href normalization failed", u), o.href = `#${encodeURIComponent(l)}`;
      }
      c.appendChild(o), i.appendChild(c);
    } catch (c) {
      console.warn("[htmlBuilder] buildTocElement item failed", c, a);
    }
  }), s.appendChild(i), s;
}
function si(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = re(n.textContent || ""));
  });
}
function Ba(t, e, n) {
  try {
    const s = t.querySelectorAll("img");
    if (s && s.length) {
      const r = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      s.forEach((i) => {
        const a = i.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const c = new URL(r + a, n).toString();
            i.src = c;
            try {
              i.getAttribute("loading") || i.setAttribute("data-want-lazy", "1");
            } catch (o) {
              console.warn("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (c) {
            console.warn("[htmlBuilder] resolve image src failed", c);
          }
      });
    }
  } catch (s) {
    console.warn("[htmlBuilder] lazyLoadImages failed", s);
  }
}
function yr(t, e, n) {
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
        const c = a.tagName ? a.tagName.toLowerCase() : "", o = (l) => {
          try {
            const u = a.getAttribute(l) || "";
            if (!u || /^(https?:)?\/\//i.test(u) || u.startsWith("/") || u.startsWith("#")) return;
            try {
              a.setAttribute(l, new URL(u, r).toString());
            } catch (h) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", l, u, h);
            }
          } catch (u) {
            console.warn("[htmlBuilder] rewriteAttr failed", u);
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && o("src"), a.hasAttribute && a.hasAttribute("href") && c !== "a" && o("href"), a.hasAttribute && a.hasAttribute("xlink:href") && o("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && o("poster"), a.hasAttribute("srcset")) {
          const h = (a.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [p, d] = f.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return f;
            try {
              const m = new URL(p, r).toString();
              return d ? `${m} ${d}` : m;
            } catch {
              return f;
            }
          }).join(", ");
          a.setAttribute("srcset", h);
        }
      } catch (c) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", c);
      }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", s);
  }
}
let kr = "", dn = null, xr = "";
async function ai(t, e, n) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let r, i;
    if (e === kr && dn)
      r = dn, i = xr;
    else {
      try {
        r = new URL(e, location.href), i = vt(r.pathname);
      } catch {
        try {
          r = new URL(e, location.href), i = vt(r.pathname);
        } catch {
          r = null, i = "/";
        }
      }
      kr = e, dn = r, xr = i;
    }
    const a = /* @__PURE__ */ new Set(), c = [], o = /* @__PURE__ */ new Set(), l = [];
    for (const u of Array.from(s))
      try {
        const h = u.getAttribute("href") || "";
        if (!h || Br(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const p = new URL(h, e || location.href), d = p.searchParams.get("page");
              if (d && d.indexOf("/") === -1 && n) {
                const m = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (m) {
                  const w = he(m + d);
                  u.setAttribute("href", "?page=" + encodeURIComponent(w) + (p.hash || ""));
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
            const m = new URL(p, e).pathname;
            let w = m.startsWith(i) ? m.slice(i.length) : m;
            w = he(w), c.push({ node: u, mdPathRaw: p, frag: d, rel: w }), U.has(w) || a.add(w);
          } catch (m) {
            console.warn("[htmlBuilder] resolve mdPath failed", m);
          }
          continue;
        }
        try {
          let p = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? p = n + h : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const m = new URL(p, e).pathname || "";
          if (m && m.indexOf(i) !== -1) {
            let w = m.startsWith(i) ? m.slice(i.length) : m;
            if (w = he(w), w = At(w), w || (w = "_home"), !w.endsWith(".md")) {
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
                  for (const [I, $] of X || [])
                    if ($ === w || $ === x) {
                      y = I;
                      break;
                    }
                } catch {
                }
              y ? u.setAttribute("href", `?page=${encodeURIComponent(y)}`) : (o.add(w), l.push({ node: u, rel: w }));
            }
          }
        } catch (p) {
          console.warn("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (h) {
        console.warn("[htmlBuilder] processing anchor failed", h);
      }
    a.size && await Promise.all(Array.from(a).map(async (u) => {
      try {
        try {
          const f = String(u).match(/([^\/]+)\.md$/), p = f && f[1];
          if (p && X.has(p)) {
            try {
              const d = X.get(p);
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
        const h = await xe(u, e);
        if (h && h.raw) {
          const f = (h.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = re(f[1].trim());
            if (p)
              try {
                X.set(p, u), U.set(u, p);
              } catch (d) {
                console.warn("[htmlBuilder] setting slug mapping failed", d);
              }
          }
        }
      } catch (h) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
      }
    })), o.size && await Promise.all(Array.from(o).map(async (u) => {
      try {
        const h = await xe(u, e);
        if (h && h.raw)
          try {
            const p = (Hn || new DOMParser()).parseFromString(h.raw, "text/html"), d = p.querySelector("title"), m = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
            if (w) {
              const y = re(w);
              if (y)
                try {
                  X.set(y, u), U.set(u, y);
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
    for (const u of c) {
      const { node: h, frag: f, rel: p } = u;
      let d = null;
      try {
        U.has(p) && (d = U.get(p));
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug access failed", m);
      }
      d ? f ? h.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(d)}`) : f ? h.setAttribute("href", `?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(p)}`);
    }
    for (const u of l) {
      const { node: h, rel: f } = u;
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
function za(t, e, n, s) {
  const r = e.querySelector("h1"), i = r ? (r.textContent || "").trim() : "";
  let a = "";
  try {
    i && (a = re(i)), !a && t && t.meta && t.meta.title && (a = re(t.meta.title)), !a && n && (a = re(String(n))), a || (a = "_home");
    try {
      n && (X.set(a, n), U.set(n, a));
    } catch (c) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", c);
    }
    try {
      let c = "?page=" + encodeURIComponent(a);
      try {
        const o = s || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        o && (c += "#" + encodeURIComponent(o));
      } catch (o) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", o);
      }
      try {
        history.replaceState({ page: a }, "", c);
      } catch (o) {
        console.warn("[htmlBuilder] computeSlug history replace failed", o);
      }
    } catch (c) {
      console.warn("[htmlBuilder] computeSlug inner failed", c);
    }
  } catch (c) {
    console.warn("[htmlBuilder] computeSlug failed", c);
  }
  return { topH1: r, h1Text: i, slugKey: a };
}
async function Na(t, e) {
  if (!t || !t.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(t || []))
    try {
      const l = o.getAttribute("href") || "";
      if (!l) continue;
      let f = he(l).split(/::|#/, 2)[0];
      try {
        const d = f.indexOf("?");
        d !== -1 && (f = f.slice(0, d));
      } catch {
      }
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const p = f;
      try {
        if (U && U.has && U.has(p)) continue;
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const m of X.values())
          if (m === p) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        console.warn("[htmlBuilder] slugToMd iteration failed", d);
      }
      n.add(p);
    } catch (l) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", l);
    }
  if (!n.size) return;
  const s = async (o) => {
    try {
      const l = await xe(o, e);
      if (l && l.raw)
        try {
          const h = (Hn || new DOMParser()).parseFromString(l.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const m = re(d);
            if (m)
              try {
                X.set(m, o), U.set(o, m);
              } catch (w) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", w);
              }
          }
        } catch (u) {
          console.warn("[htmlBuilder] parse HTML title failed", u);
        }
    } catch (l) {
      console.warn("[htmlBuilder] fetchAndExtract failed", l);
    }
  }, r = 5, i = Array.from(n);
  let a = 0;
  const c = [];
  for (; a < i.length; ) {
    const o = i.slice(a, a + r);
    c.push(Promise.all(o.map(s))), a += r;
  }
  await Promise.all(c);
}
async function Oa(t, e) {
  if (!t || !t.length) return;
  const n = [], s = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const i = new URL(e, typeof location < "u" ? location.href : "http://localhost/");
    r = vt(i.pathname);
  } catch (i) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", i);
  }
  for (const i of Array.from(t || []))
    try {
      const a = i.getAttribute("href") || "";
      if (!a) continue;
      const c = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let o = he(c[1]);
        try {
          let l;
          try {
            l = $a(o, e);
          } catch (h) {
            l = o, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const u = l && r && l.startsWith(r) ? l.slice(r.length) : String(l || "").replace(/^\//, "");
          n.push({ rel: u }), U.has(u) || s.add(u);
        } catch (l) {
          console.warn("[htmlBuilder] rewriteAnchors failed", l);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  s.size && await Promise.all(Array.from(s).map(async (i) => {
    try {
      const a = String(i).match(/([^\/]+)\.md$/), c = a && a[1];
      if (c && X.has(c)) {
        try {
          const o = X.get(c);
          o && U.set(o, c);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await xe(i, e);
      if (a && a.raw) {
        const c = (a.raw || "").match(/^#\s+(.+)$/m);
        if (c && c[1]) {
          const o = re(c[1].trim());
          if (o)
            try {
              X.set(o, i), U.set(i, o);
            } catch (l) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", l);
            }
        }
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", a);
    }
  }));
}
const Hn = typeof DOMParser < "u" ? new DOMParser() : null;
function pn(t) {
  try {
    const n = (Hn || new DOMParser()).parseFromString(t || "", "text/html");
    si(n);
    try {
      n.querySelectorAll("img").forEach((c) => {
        try {
          c.getAttribute("loading") || c.setAttribute("data-want-lazy", "1");
        } catch (o) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", o);
        }
      });
    } catch (a) {
      console.warn("[htmlBuilder] parseHtml query images failed", a);
    }
    n.querySelectorAll("pre code, code[class]").forEach((a) => {
      try {
        const c = a.getAttribute && a.getAttribute("class") || a.className || "", o = c.match(/language-([a-zA-Z0-9_+-]+)/) || c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (o && o[1]) {
          const l = (o[1] || "").toLowerCase(), u = Y.size && (Y.get(l) || Y.get(String(l).toLowerCase())) || l;
          try {
            (async () => {
              try {
                await St(u);
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
              const l = le.highlight ? le.highlight(a.textContent || "", { language: "plaintext" }) : null;
              l && l.value && (a.innerHTML = l.value);
            }
          } catch (l) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", l);
          }
      } catch (c) {
        console.warn("[htmlBuilder] code element processing failed", c);
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
async function Da(t) {
  const e = An ? An(t || "", Y) : /* @__PURE__ */ new Set(), n = new Set(e), s = [];
  for (const r of n)
    try {
      const i = Y.size && (Y.get(r) || Y.get(String(r).toLowerCase())) || r;
      try {
        s.push(St(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(r) !== String(i))
        try {
          s.push(St(r));
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
async function Ha(t) {
  if (await Da(t), Yt) {
    const e = await Yt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Ua(t, e, n, s, r) {
  let i = null;
  if (e.isHtml)
    try {
      const h = typeof DOMParser < "u" ? new DOMParser() : null;
      if (h) {
        const f = h.parseFromString(e.raw || "", "text/html");
        try {
          yr(f.body, n, r);
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
    i = await Ha(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    yr(a, n, r);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    si(a);
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
    cs(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  Ba(a, n, r);
  const { topH1: c, h1Text: o, slugKey: l } = za(i, a, n, s);
  try {
    await qa(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await ai(a, r, n);
  }
  const u = Ia(t, i.toc, n);
  return { article: a, parsed: i, toc: u, topH1: c, h1Text: o, slugKey: l };
}
function Sr(t, e, n) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", s.appendChild(r), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function qa(t, e, n) {
  return ai(t, e, n);
}
function ja(t) {
  try {
    t.addEventListener("click", (e) => {
      const n = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!n) return;
      const s = n.getAttribute("href") || "";
      try {
        const r = new URL(s, location.href), i = r.searchParams.get("page"), a = r.hash ? r.hash.replace(/^#/, "") : null;
        if (!i && !a) return;
        e.preventDefault();
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
        if (!i && a || i && c && String(i) === String(c)) {
          try {
            if (!i && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (o) {
                console.warn("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: c || i }, "", "?page=" + encodeURIComponent(c || i) + (a ? "#" + encodeURIComponent(a) : ""));
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
            En(a);
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
function En(t) {
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
function Fa(t, e, { mountOverlay: n = null, container: s = null, mountEl: r = null, navWrap: i = null, t: a = null } = {}) {
  try {
    const c = a || ((m) => typeof m == "string" ? m : ""), o = s || document.querySelector(".nimbi-cms"), l = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), h = i || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top button is-primary is-rounded is-small", p.setAttribute("aria-label", c("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(p) : o && o.appendChild ? o.appendChild(p) : l && l.appendChild ? l.appendChild(p) : document.body.appendChild(p);
      } catch {
        try {
          document.body.appendChild(p);
        } catch (w) {
          console.warn("[htmlBuilder] append scroll top button failed", w);
        }
      }
      try {
        try {
          Mr(p);
        } catch {
        }
      } catch (m) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", m);
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
        const m = new IntersectionObserver((w) => {
          for (const y of w)
            y.target instanceof Element && (y.isIntersecting ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show")));
        }, { root: s instanceof Element ? s : r instanceof Element ? r : null, threshold: 0 });
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
            const w = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, y = e.getBoundingClientRect();
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
      const m = s instanceof Element ? s : r instanceof Element ? r : window, w = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (p.classList.add("show"), d && d.classList.add("show")) : (p.classList.remove("show"), d && d.classList.remove("show"));
        } catch (y) {
          console.warn("[htmlBuilder] onScroll handler failed", y);
        }
      };
      Ft(() => m.addEventListener("scroll", w)), w();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
function vr(t, e) {
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
async function Wa(t, e, n, s, r, i, a, c, o = "eager", l = 1, u = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, f = h ? h.parseFromString(n || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Ft(() => Na(p, s)), await Ft(() => Oa(p, s));
  let d = null, m = null;
  const w = () => d || (d = (async () => {
    try {
      const L = await Promise.resolve().then(() => Ut), C = vr(L, "buildSearchIndexWorker"), R = vr(L, "buildSearchIndex");
      if (o === "lazy" && typeof C == "function")
        try {
          const v = await C(s, l, u);
          if (v && v.length) return v;
        } catch (v) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", v);
        }
      return typeof R == "function" ? await R(s, l, u) : [];
    } catch (L) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", L), [];
    } finally {
      if (m) {
        try {
          m.removeAttribute("disabled");
        } catch {
        }
        try {
          m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), d.then((L) => {
    try {
      const C = String(m && m.value || "").trim().toLowerCase();
      if (!C || !Array.isArray(L) || !L.length) return;
      const R = L.filter((b) => b.title && b.title.toLowerCase().includes(C) || b.excerpt && b.excerpt.toLowerCase().includes(C));
      if (!R || !R.length) return;
      const v = document.getElementById("nimbi-search-results");
      if (!v) return;
      v.innerHTML = "", R.slice(0, 10).forEach((b) => {
        const M = document.createElement("div");
        if (M.className = "nimbi-search-result", b.parentTitle) {
          const k = document.createElement("div");
          k.textContent = b.parentTitle, k.className = "nimbi-search-title nimbi-search-parent", M.appendChild(k);
        }
        const z = document.createElement("a");
        z.className = "block", z.href = "?page=" + encodeURIComponent(b.slug), z.textContent = b.title, z.addEventListener("click", () => {
          try {
            v.style.display = "none";
          } catch {
          }
        }), M.appendChild(z), v.appendChild(M);
      });
      try {
        v.style.display = "block";
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), d), y = document.createElement("nav");
  y.className = "navbar", y.setAttribute("role", "navigation"), y.setAttribute("aria-label", "main navigation");
  const x = document.createElement("div");
  x.className = "navbar-brand";
  const I = p[0], $ = document.createElement("a");
  if ($.className = "navbar-item", I) {
    const L = I.getAttribute("href") || "#";
    try {
      const R = new URL(L, location.href).searchParams.get("page");
      R ? $.href = "?page=" + encodeURIComponent(decodeURIComponent(R)) : ($.href = "?page=" + encodeURIComponent(r), $.textContent = i("home"));
    } catch {
      $.href = "?page=" + encodeURIComponent(r), $.textContent = i("home");
    }
  } else
    $.href = "?page=" + encodeURIComponent(r), $.textContent = i("home");
  x.appendChild($), $.addEventListener("click", function(L) {
    const C = $.getAttribute("href") || "";
    if (C.startsWith("?page=")) {
      L.preventDefault();
      const R = new URL(C, location.href), v = R.searchParams.get("page"), b = R.hash ? R.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", "?page=" + encodeURIComponent(v) + (b ? "#" + encodeURIComponent(b) : ""));
      try {
        a();
      } catch (M) {
        console.warn("[nimbi-cms] renderByQuery failed", M);
      }
    }
  });
  const A = document.createElement("a");
  A.className = "navbar-burger", A.setAttribute("role", "button"), A.setAttribute("aria-label", "menu"), A.setAttribute("aria-expanded", "false");
  const q = "nimbi-navbar-menu";
  A.dataset.target = q, A.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', x.appendChild(A);
  try {
    A.addEventListener("click", (L) => {
      try {
        const C = A.dataset && A.dataset.target ? A.dataset.target : null, R = C ? document.getElementById(C) : null;
        A.classList.contains("is-active") ? (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), R && R.classList.remove("is-active")) : (A.classList.add("is-active"), A.setAttribute("aria-expanded", "true"), R && R.classList.add("is-active"));
      } catch (C) {
        console.warn("[nimbi-cms] navbar burger toggle failed", C);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] burger event binding failed", L);
  }
  const j = document.createElement("div");
  j.className = "navbar-menu", j.id = q;
  const G = document.createElement("div");
  G.className = "navbar-start";
  let K, ne, O;
  if (!c)
    K = null, m = null, O = null;
  else {
    K = document.createElement("div"), K.className = "navbar-end", ne = document.createElement("div"), ne.className = "navbar-item", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = i("searchPlaceholder") || "", m.id = "nimbi-search", o === "eager" && (m.disabled = !0, m.classList.add("is-loading")), ne.appendChild(m), O = document.createElement("div"), O.id = "nimbi-search-results", O.className = "box", ne.appendChild(O), K.appendChild(ne);
    const L = (R) => {
      if (O.innerHTML = "", !R.length) {
        O.classList.remove("is-open");
        try {
          O.style.display = "none";
        } catch {
        }
        return;
      }
      R.forEach((v) => {
        const b = document.createElement("div");
        if (b.className = "nimbi-search-result", v.parentTitle) {
          const z = document.createElement("div");
          z.textContent = v.parentTitle, z.className = "nimbi-search-title nimbi-search-parent", b.appendChild(z);
        }
        const M = document.createElement("a");
        M.className = "block", M.href = "?page=" + encodeURIComponent(v.slug), M.textContent = v.title, M.addEventListener("click", () => {
          O.style.display = "none";
        }), b.appendChild(M), O.appendChild(b);
      });
      try {
        O.style.display = "block";
      } catch {
      }
      O.classList.add("is-open");
    }, C = (R, v) => {
      let b = null;
      return (...M) => {
        b && clearTimeout(b), b = setTimeout(() => R(...M), v);
      };
    };
    if (m) {
      const R = C(async () => {
        const v = document.querySelector("input#nimbi-search"), b = String(v && v.value || "").trim().toLowerCase();
        if (!b) {
          L([]);
          return;
        }
        try {
          await w();
          const z = (await d).filter((k) => k.title && k.title.toLowerCase().includes(b) || k.excerpt && k.excerpt.toLowerCase().includes(b));
          L(z.slice(0, 10));
        } catch (M) {
          console.warn("[nimbi-cms] search input handler failed", M), L([]);
        }
      }, 50);
      try {
        m.addEventListener("input", R);
      } catch {
      }
      try {
        document.addEventListener("input", (v) => {
          try {
            v && v.target && v.target.id === "nimbi-search" && R(v);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        d = w();
      } catch (R) {
        console.warn("[nimbi-cms] eager search index init failed", R), d = Promise.resolve([]);
      }
      d.finally(() => {
        const R = document.querySelector("input#nimbi-search");
        if (R) {
          try {
            R.removeAttribute("disabled");
          } catch {
          }
          try {
            R.classList.remove("is-loading");
          } catch {
          }
        }
      });
    }
  }
  for (let L = 0; L < p.length; L++) {
    const C = p[L];
    if (L === 0) continue;
    const R = C.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(R) || R.endsWith(".md")) {
        const M = he(R).split(/::|#/, 2), z = M[0], k = M[1];
        v.href = "?page=" + encodeURIComponent(z) + (k ? "#" + encodeURIComponent(k) : "");
      } else if (/\.html(?:$|[#?])/.test(R) || R.endsWith(".html")) {
        const M = he(R).split(/::|#/, 2);
        let z = M[0];
        z && !z.toLowerCase().endsWith(".html") && (z = z + ".html");
        const k = M[1];
        try {
          const ie = await xe(z, s);
          if (ie && ie.raw)
            try {
              const Se = new DOMParser().parseFromString(ie.raw, "text/html"), ye = Se.querySelector("title"), J = Se.querySelector("h1"), ce = ye && ye.textContent && ye.textContent.trim() ? ye.textContent.trim() : J && J.textContent ? J.textContent.trim() : null;
              if (ce) {
                const fe = re(ce);
                if (fe) {
                  try {
                    X.set(fe, z), U.set(z, fe);
                  } catch (Qe) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Qe);
                  }
                  v.href = "?page=" + encodeURIComponent(fe) + (k ? "#" + encodeURIComponent(k) : "");
                } else
                  v.href = "?page=" + encodeURIComponent(z) + (k ? "#" + encodeURIComponent(k) : "");
              } else
                v.href = "?page=" + encodeURIComponent(z) + (k ? "#" + encodeURIComponent(k) : "");
            } catch {
              v.href = "?page=" + encodeURIComponent(z) + (k ? "#" + encodeURIComponent(k) : "");
            }
          else
            v.href = R;
        } catch {
          v.href = R;
        }
      } else
        v.href = R;
    } catch (b) {
      console.warn("[nimbi-cms] nav item href parse failed", b), v.href = R;
    }
    try {
      const b = C.textContent && String(C.textContent).trim() ? String(C.textContent).trim() : null;
      if (b)
        try {
          const M = re(b);
          if (M) {
            const z = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const ie = new URL(z, location.href).searchParams.get("page");
              if (ie) {
                const ue = decodeURIComponent(ie);
                try {
                  X.set(M, ue), U.set(ue, M);
                } catch (Se) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Se);
                }
              }
            } catch (k) {
              console.warn("[nimbi-cms] nav slug mapping failed", k);
            }
          }
        } catch (M) {
          console.warn("[nimbi-cms] nav slug mapping failed", M);
        }
    } catch (b) {
      console.warn("[nimbi-cms] nav slug mapping failed", b);
    }
    v.textContent = C.textContent || R, G.appendChild(v);
  }
  j.appendChild(G), K && j.appendChild(K), y.appendChild(x), y.appendChild(j), t.appendChild(y);
  try {
    j.addEventListener("click", (L) => {
      const C = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!C) return;
      const R = C.getAttribute("href") || "";
      try {
        const v = new URL(R, location.href), b = v.searchParams.get("page"), M = v.hash ? v.hash.replace(/^#/, "") : null;
        if (b) {
          L.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (M ? "#" + encodeURIComponent(M) : ""));
          try {
            a();
          } catch (z) {
            console.warn("[nimbi-cms] renderByQuery failed", z);
          }
        }
      } catch (v) {
        console.warn("[nimbi-cms] navbar click handler failed", v);
      }
      try {
        const v = y && y.querySelector ? y.querySelector(".navbar-burger") : null, b = v && v.dataset ? v.dataset.target : null, M = b ? document.getElementById(b) : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] attach content click handler failed", L);
  }
  try {
    e.addEventListener("click", (L) => {
      const C = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!C) return;
      const R = C.getAttribute("href") || "";
      if (R && !Br(R))
        try {
          const v = new URL(R, location.href), b = v.searchParams.get("page"), M = v.hash ? v.hash.replace(/^#/, "") : null;
          if (b) {
            L.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (M ? "#" + encodeURIComponent(M) : ""));
            try {
              a();
            } catch (z) {
              console.warn("[nimbi-cms] renderByQuery failed", z);
            }
          }
        } catch (v) {
          console.warn("[nimbi-cms] container click URL parse failed", v);
        }
    });
  } catch (L) {
    console.warn("[nimbi-cms] build navbar failed", L);
  }
  return { navbar: y, linkEls: p };
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
var fn, Ar;
function Za() {
  if (Ar) return fn;
  Ar = 1;
  function t(i, a) {
    return a.some(
      ([c, o]) => c <= i && i <= o
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
    let c = 0, o = 0, l = i.length - 1;
    const u = a.wordsPerMinute || 200, h = a.wordBound || n;
    for (; h(i[o]); ) o++;
    for (; h(i[l]); ) l--;
    const f = `${i}
`;
    for (let w = o; w <= l; w++)
      if ((e(f[w]) || !h(f[w]) && (h(f[w + 1]) || e(f[w + 1]))) && c++, e(f[w]))
        for (; w <= l && (s(f[w + 1]) || h(f[w + 1])); )
          w++;
    const p = c / u, d = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: d,
      words: c
    };
  }
  return fn = r, fn;
}
var Ga = Za();
const Qa = /* @__PURE__ */ Tr(Ga);
function Er(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function nt(t, e, n) {
  let s = `meta[${t}="${e}"]`, r = document.querySelector(s);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function Xa(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function Ka(t, e, n, s) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  nt("property", "og:title", r);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && nt("property", "og:description", i), nt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = n || t.image;
  a && (nt("property", "og:image", a), nt("name", "twitter:image", a));
}
function Ya(t, e, n, s, r = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  c && String(c).trim() && Er("description", c), Er("robots", i.robots || "index,follow"), Ka(i, e, n, c);
}
function Va() {
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
function Ja(t, e, n, s, r, i = "") {
  try {
    const a = t.meta || {}, c = n && String(n).trim() ? n : a.title || i || document.title, o = r && String(r).trim() ? r : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = s || a.image || null;
    let u = "";
    try {
      if (e) {
        const d = he(e);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(d);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (d) {
      u = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", d);
    }
    u && Xa("canonical", u);
    try {
      nt("property", "og:url", u);
    } catch (d) {
      console.warn("[seoManager] upsertMeta og:url failed", d);
    }
    const h = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c || "",
      description: o || "",
      url: u || location.href.split("#")[0]
    };
    l && (h.image = String(l)), a.date && (h.datePublished = a.date), a.dateModified && (h.dateModified = a.dateModified);
    const f = "nimbi-jsonld";
    let p = document.getElementById(f);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = f, document.head.appendChild(p)), p.textContent = JSON.stringify(h, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function eo(t, e, n, s, r, i, a, c, o, l, u) {
  try {
    const h = s.querySelector(".menu-label");
    h && (h.textContent = c && c.textContent || t("onThisPage"));
  } catch (h) {
    console.warn("[seoManager] update toc label failed", h);
  }
  try {
    const h = n.meta && n.meta.title ? String(n.meta.title).trim() : "", f = r.querySelector("img"), p = f && (f.getAttribute("src") || f.src) || null;
    let d = "";
    try {
      let w = "";
      try {
        const y = c || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let x = y.nextElementSibling;
          const I = [];
          for (; x && !(x.tagName && x.tagName.toLowerCase() === "h2"); ) {
            const $ = (x.textContent || "").trim();
            $ && I.push($), x = x.nextElementSibling;
          }
          I.length && (w = I.join(" ").replace(/\s+/g, " ").trim()), !w && o && (w = String(o).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), d = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    try {
      Ya(n, o, p, d);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      Ja(n, l, o, p, d, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Va();
    o ? m ? document.title = `${m} - ${o}` : document.title = `${e || "Site"} - ${o}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = r.querySelector(".nimbi-reading-time");
    if (h && h.remove(), o) {
      const f = Qa(u.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = r.querySelector("h1");
      m && m.insertAdjacentElement("afterend", d);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let Ae = null, D = null, we = 1, Fe = (t, e) => e, bt = 0, yt = 0, qt = () => {
}, pt = 0.25;
function to() {
  if (Ae && document.contains(Ae)) return Ae;
  Ae = null;
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
    if (!ne()) return;
    b.preventDefault();
    const M = b.deltaY < 0 ? pt : -pt;
    He(we + M), l(), u();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      gn();
      return;
    }
    if (we > 1) {
      const M = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!M) return;
      const z = 40;
      switch (b.key) {
        case "ArrowUp":
          M.scrollTop -= z, b.preventDefault();
          break;
        case "ArrowDown":
          M.scrollTop += z, b.preventDefault();
          break;
        case "ArrowLeft":
          M.scrollLeft -= z, b.preventDefault();
          break;
        case "ArrowRight":
          M.scrollLeft += z, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), Ae = t, D = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), c = t.querySelector("[data-nimbi-preview-zoom-label]"), o = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function l() {
    c && (c.textContent = `${Math.round(we * 100)}%`);
  }
  const u = () => {
    o && (o.textContent = `${Math.round(we * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  qt = l, s.addEventListener("click", () => {
    He(we + pt), l(), u();
  }), r.addEventListener("click", () => {
    He(we - pt), l(), u();
  }), e.addEventListener("click", () => {
    kt(), l(), u();
  }), n.addEventListener("click", () => {
    He(1), l(), u();
  }), i.addEventListener("click", () => {
    kt(), l(), u();
  }), a.addEventListener("click", gn), e.title = Fe("imagePreviewFit", "Fit to screen"), n.title = Fe("imagePreviewOriginal", "Original size"), r.title = Fe("imagePreviewZoomOut", "Zoom out"), s.title = Fe("imagePreviewZoomIn", "Zoom in"), a.title = Fe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Fe("imagePreviewClose", "Close"));
  let h = !1, f = 0, p = 0, d = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let y = 0, x = 1;
  const I = (b, M) => {
    const z = b.x - M.x, k = b.y - M.y;
    return Math.hypot(z, k);
  }, $ = () => {
    if (h = !1, w.clear(), y = 0, D) {
      D.classList.add("is-panning"), D.classList.remove("is-grabbing");
      try {
        D.style.cursor = "all-scroll";
      } catch {
      }
    }
  };
  let A = 0, q = 0, j = 0;
  const G = (b) => {
    const M = Date.now(), z = M - A, k = b.clientX - q, ie = b.clientY - j;
    A = M, q = b.clientX, j = b.clientY, z < 300 && Math.hypot(k, ie) < 30 && (He(we > 1 ? 1 : 2), l(), b.preventDefault());
  }, K = (b) => {
    He(we > 1 ? 1 : 2), l(), b.preventDefault();
  }, ne = () => Ae ? typeof Ae.open == "boolean" ? Ae.open : Ae.classList.contains("is-active") : !1, O = (b, M, z = 1) => {
    if (w.has(z) && w.set(z, { x: b, y: M }), w.size === 2) {
      const Se = Array.from(w.values()), ye = I(Se[0], Se[1]);
      if (y > 0) {
        const J = ye / y;
        He(x * J);
      }
      return;
    }
    if (!h) return;
    const k = D.closest(".nimbi-image-preview__image-wrapper");
    if (!k) return;
    const ie = b - f, ue = M - p;
    k.scrollLeft = d - ie, k.scrollTop = m - ue;
  }, L = (b, M, z = 1) => {
    if (!ne()) return;
    if (w.set(z, { x: b, y: M }), w.size === 2) {
      const ue = Array.from(w.values());
      y = I(ue[0], ue[1]), x = we;
      return;
    }
    const k = D.closest(".nimbi-image-preview__image-wrapper");
    if (!(!k || !(k.scrollWidth > k.clientWidth || k.scrollHeight > k.clientHeight))) {
      h = !0, f = b, p = M, d = k.scrollLeft, m = k.scrollTop, D.classList.add("is-panning"), D.classList.remove("is-grabbing");
      try {
        D.style.cursor = "all-scroll";
      } catch {
      }
      window.addEventListener("pointermove", C), window.addEventListener("pointerup", R), window.addEventListener("pointercancel", R);
    }
  }, C = (b) => {
    h && (b.preventDefault(), O(b.clientX, b.clientY, b.pointerId));
  }, R = () => {
    $(), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", R), window.removeEventListener("pointercancel", R);
  };
  D.addEventListener("pointerdown", (b) => {
    b.preventDefault(), L(b.clientX, b.clientY, b.pointerId);
  }), D.addEventListener("pointermove", (b) => {
    (h || w.size === 2) && b.preventDefault(), O(b.clientX, b.clientY, b.pointerId);
  }), D.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && G(b), $();
  }), D.addEventListener("dblclick", K), D.addEventListener("pointercancel", $), D.addEventListener("mousedown", (b) => {
    b.preventDefault(), L(b.clientX, b.clientY, 1);
  }), D.addEventListener("mousemove", (b) => {
    h && b.preventDefault(), O(b.clientX, b.clientY, 1);
  }), D.addEventListener("mouseup", (b) => {
    b.preventDefault(), $();
  });
  const v = t.querySelector(".nimbi-image-preview__image-wrapper");
  return v && (v.addEventListener("pointerdown", (b) => {
    if (L(b.clientX, b.clientY, b.pointerId), b && b.target && b.target.tagName === "IMG")
      try {
        b.target.classList.add("is-grabbing"), b.target.style.cursor = "grabbing";
      } catch {
      }
  }), v.addEventListener("pointermove", (b) => {
    O(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointerup", $), v.addEventListener("pointercancel", $), v.addEventListener("mousedown", (b) => {
    if (L(b.clientX, b.clientY, 1), b && b.target && b.target.tagName === "IMG")
      try {
        b.target.classList.add("is-grabbing"), b.target.style.cursor = "grabbing";
      } catch {
      }
  }), v.addEventListener("mousemove", (b) => {
    O(b.clientX, b.clientY, 1);
  }), v.addEventListener("mouseup", $)), t;
}
function He(t) {
  if (!D) return;
  const e = Number(t);
  we = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = D.getBoundingClientRect(), r = bt || D.naturalWidth || D.width || s.width || 0, i = yt || D.naturalHeight || D.height || s.height || 0;
  if (r && i) {
    D.style.setProperty("--nimbi-preview-img-max-width", "none"), D.style.setProperty("--nimbi-preview-img-max-height", "none"), D.style.setProperty("--nimbi-preview-img-width", `${r * we}px`), D.style.setProperty("--nimbi-preview-img-height", `${i * we}px`), D.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      D.style.width = `${r * we}px`, D.style.height = `${i * we}px`, D.style.transform = "none";
    } catch {
    }
  } else {
    D.style.setProperty("--nimbi-preview-img-max-width", ""), D.style.setProperty("--nimbi-preview-img-max-height", ""), D.style.setProperty("--nimbi-preview-img-width", ""), D.style.setProperty("--nimbi-preview-img-height", ""), D.style.setProperty("--nimbi-preview-img-transform", `scale(${we})`);
    try {
      D.style.transform = `scale(${we})`;
    } catch {
    }
  }
  if (D) {
    D.classList.add("is-panning"), D.classList.remove("is-grabbing");
    try {
      D.style.cursor = "all-scroll";
    } catch {
    }
  }
}
function kt() {
  if (!D) return;
  const t = D.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = bt || D.naturalWidth || e.width, s = yt || D.naturalHeight || e.height;
  if (!n || !s) return;
  const r = e.width / n, i = e.height / s, a = Math.min(r, i, 1);
  He(Number.isFinite(a) ? a : 1);
}
function no(t, e = "", n = 0, s = 0) {
  const r = to();
  we = 1, bt = n || 0, yt = s || 0, D.src = t, D.alt = e, D.style.transform = "scale(1)";
  const i = () => {
    bt = D.naturalWidth || D.width || 0, yt = D.naturalHeight || D.height || 0;
  };
  if (i(), kt(), qt(), requestAnimationFrame(() => {
    kt(), qt();
  }), !bt || !yt) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        kt(), qt();
      }), D.removeEventListener("load", a);
    };
    D.addEventListener("load", a);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active"), r.focus();
}
function gn() {
  Ae && (typeof Ae.close == "function" && Ae.open && Ae.close(), Ae.classList.remove("is-active"));
}
function ro(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Fe = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, pt = n, t.addEventListener("click", (p) => {
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
      no(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
    }
  });
  let s = !1, r = 0, i = 0, a = 0, c = 0;
  const o = /* @__PURE__ */ new Map();
  let l = 0, u = 1;
  const h = (p, d) => {
    const m = p.x - d.x, w = p.y - d.y;
    return Math.hypot(m, w);
  };
  t.addEventListener("pointerdown", (p) => {
    const d = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!d || d.tagName !== "IMG" || !Ae || !Ae.open) return;
    if (o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      const w = Array.from(o.values());
      l = h(w[0], w[1]), u = we;
      return;
    }
    const m = d.closest(".nimbi-image-preview__image-wrapper");
    m && (we <= 1 || (p.preventDefault(), s = !0, r = p.clientX, i = p.clientY, a = m.scrollLeft, c = m.scrollTop, d.setPointerCapture(p.pointerId), d.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (o.has(p.pointerId) && o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      p.preventDefault();
      const x = Array.from(o.values()), I = h(x[0], x[1]);
      if (l > 0) {
        const $ = I / l;
        He(u * $);
      }
      return;
    }
    if (!s) return;
    p.preventDefault();
    const m = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = p.clientX - r, y = p.clientY - i;
    m.scrollLeft = a - w, m.scrollTop = c - y;
  });
  const f = () => {
    s = !1, o.clear(), l = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function io(t) {
  const {
    contentWrap: e,
    navWrap: n,
    container: s,
    mountOverlay: r = null,
    t: i,
    contentBase: a,
    homePage: c,
    initialDocumentTitle: o,
    runHooks: l
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const h = Pa(i, [{ path: c, name: i("home"), isIndex: !0, children: [] }]);
  async function f(y, x) {
    let I, $, A;
    try {
      ({ data: I, pagePath: $, anchor: A } = await Ns(y, a));
    } catch (L) {
      console.error("[nimbi-cms] fetchPageData failed", L), Sr(e, i, L);
      return;
    }
    !A && x && (A = x);
    try {
      En(null);
    } catch (L) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", L);
    }
    e.innerHTML = "";
    const { article: q, parsed: j, toc: G, topH1: K, h1Text: ne, slugKey: O } = await Ua(i, I, $, A, a);
    eo(i, o, j, G, q, $, A, K, ne, O, I), n.innerHTML = "", n.appendChild(G), ja(G);
    try {
      await l("transformHtml", { article: q, parsed: j, toc: G, pagePath: $, anchor: A, topH1: K, h1Text: ne, slugKey: O, data: I });
    } catch (L) {
      console.warn("[nimbi-cms] transformHtml hooks failed", L);
    }
    e.appendChild(q);
    try {
      ro(q, { t: i });
    } catch (L) {
      console.warn("[nimbi-cms] attachImagePreview failed", L);
    }
    try {
      Nt(s, 100, !1), requestAnimationFrame(() => Nt(s, 100, !1)), setTimeout(() => Nt(s, 100, !1), 250);
    } catch (L) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", L);
    }
    En(A), Fa(q, K, { mountOverlay: r, container: s, navWrap: n, t: i });
    try {
      await l("onPageLoad", { data: I, pagePath: $, anchor: A, article: q, toc: G, topH1: K, h1Text: ne, slugKey: O, contentWrap: e, navWrap: n });
    } catch (L) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", L);
    }
    u = $;
  }
  async function p() {
    let y = new URLSearchParams(location.search).get("page") || c;
    const x = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await f(y, x);
    } catch (I) {
      console.warn("[nimbi-cms] renderByQuery failed for", y, I), Sr(e, i, I);
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
      const I = JSON.parse(x);
      I && typeof I.top == "number" && y.scrollTo({ top: I.top, left: I.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (y) => {
    if (y.persisted)
      try {
        w(), Nt(s, 100, !1);
      } catch (x) {
        console.warn("[nimbi-cms] bfcache restore failed", x);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      console.warn("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: p, siteNav: h, getCurrentPagePath: () => u };
}
function so(t) {
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
      Number.isInteger(i) && (i === 1 || i === 2 || i === 3) && (s.indexDepth = i);
    }
    if (n.has("noIndexing")) {
      const a = (n.get("noIndexing") || "").split(",").map((c) => c.trim()).filter(Boolean);
      a.length && (s.noIndexing = a);
    }
    return s;
  } catch {
    return {};
  }
}
function ao(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Rr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let mn = "";
async function bo(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = so();
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
    searchIndexMode: c = "eager",
    indexDepth: o = 1,
    noIndexing: l = void 0,
    defaultStyle: u = "light",
    bulmaCustomize: h = "none",
    lang: f = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: d = 5,
    cacheMaxEntries: m,
    markdownExtensions: w,
    availableLanguages: y,
    homePage: x = "_home.md",
    notFoundPage: I = "_404.md"
  } = n, { skipRootReadme: $ = !1 } = n;
  if (n.contentPath != null && !ao(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (n.homePage != null && !Rr(n.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (n.notFoundPage != null && !Rr(n.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!s)
    throw new Error("el is required");
  let A = s;
  if (typeof s == "string") {
    if (A = document.querySelector(s), !A) throw new Error(`el selector "${s}" did not match any element`);
  } else if (!(s instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (c != null && c !== "eager" && c !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (o != null && o !== 1 && o !== 2 && o !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (u !== "light" && u !== "dark")
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
  if (l != null && (!Array.isArray(l) || l.some((k) => typeof k != "string" || !k.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if ($ != null && typeof $ != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (x != null && (typeof x != "string" || !x.trim() || !/\.(md|html)$/.test(x)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (I != null && (typeof I != "string" || !I.trim() || !/\.(md|html)$/.test(I)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const q = !!a;
  try {
    Promise.resolve().then(() => Ut).then((k) => {
      try {
        k && typeof k.setSkipRootReadme == "function" && k.setSkipRootReadme(!!$);
      } catch (ie) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", ie);
      }
    }).catch((k) => {
    });
  } catch (k) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", k);
  }
  try {
    A.classList.add("nimbi-mount");
  } catch (k) {
    console.warn("[nimbi-cms] mount element setup failed", k);
  }
  const j = document.createElement("div");
  j.className = "nimbi-cms";
  const G = document.createElement("div");
  G.className = "columns";
  const K = document.createElement("div");
  K.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", K.setAttribute("role", "navigation");
  try {
    const k = typeof ht == "function" ? ht("navigation") : null;
    k && K.setAttribute("aria-label", k);
  } catch (k) {
    console.warn("[nimbi-cms] set nav aria-label failed", k);
  }
  G.appendChild(K);
  const ne = document.createElement("div");
  ne.className = "column nimbi-content", ne.setAttribute("role", "main"), G.appendChild(ne), j.appendChild(G);
  const O = K, L = ne;
  A.appendChild(j);
  let C = null;
  try {
    C = A.querySelector(".nimbi-overlay"), C || (C = document.createElement("div"), C.className = "nimbi-overlay", A.appendChild(C));
  } catch (k) {
    C = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
  }
  const R = location.pathname || "/", v = R.endsWith("/") ? R : R.substring(0, R.lastIndexOf("/") + 1);
  try {
    mn = document.title || "";
  } catch (k) {
    mn = "", console.warn("[nimbi-cms] read initial document title failed", k);
  }
  let b = r;
  (b === "." || b === "./") && (b = ""), b.startsWith("./") && (b = b.slice(2)), b.startsWith("/") && (b = b.slice(1)), b !== "" && !b.endsWith("/") && (b = b + "/");
  const M = new URL(v + b, location.origin).toString();
  try {
    Promise.resolve().then(() => Ut).then((k) => {
      try {
        k && typeof k.setHomePage == "function" && k.setHomePage(x);
      } catch (ie) {
        console.warn("[nimbi-cms] setHomePage failed", ie);
      }
    }).catch((k) => {
    });
  } catch (k) {
    console.warn("[nimbi-cms] setHomePage dynamic import failed", k);
  }
  p && await $r(p, v), y && Array.isArray(y) && zr(y), f && Pr(f);
  const z = io({ contentWrap: L, navWrap: O, container: j, mountOverlay: C, t: ht, contentBase: M, homePage: x, initialDocumentTitle: mn, runHooks: rr });
  if (typeof d == "number" && d >= 0 && typeof cr == "function" && cr(d * 60 * 1e3), typeof m == "number" && m >= 0 && typeof lr == "function" && lr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((k) => {
        typeof k == "object" && _a && typeof vn == "function" && vn(k);
      });
    } catch (k) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", k);
    }
  try {
    typeof i == "number" && Promise.resolve().then(() => Ut).then(({ setDefaultCrawlMaxQueue: k }) => {
      try {
        k(i);
      } catch (ie) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", ie);
      }
    });
  } catch (k) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", k);
  }
  try {
    Zt(M);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    bn(I);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    Zt(M);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    bn(I);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    await xe(x, M);
  } catch (k) {
    throw x === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${x} not found at ${M}${x}: ${k.message}`);
  }
  ds(u), await hs(h, v);
  try {
    const k = document.createElement("header");
    k.className = "nimbi-site-navbar", A.insertBefore(k, j);
    const ie = await xe("_navigation.md", M), ue = await Yt(ie.raw || ""), { navbar: Se, linkEls: ye } = await Wa(k, j, ue.html || "", M, x, ht, z.renderByQuery, q, c, o, l);
    try {
      await rr("onNavBuild", { navWrap: O, navbar: Se, linkEls: ye, contentBase: M });
    } catch (J) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", J);
    }
    try {
      const J = () => {
        const ce = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
        if (ce > 0) {
          try {
            A.style.setProperty("--nimbi-site-navbar-height", `${ce}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set CSS var failed", fe);
          }
          try {
            j.style.paddingTop = "";
          } catch (fe) {
            console.warn("[nimbi-cms] set container paddingTop failed", fe);
          }
          try {
            const fe = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.clientHeight || 0;
            if (fe > 0) {
              const Qe = Math.max(0, fe - ce);
              try {
                j.style.setProperty("--nimbi-cms-height", `${Qe}px`);
              } catch (tn) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", tn);
              }
            } else
              try {
                j.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
              } catch (Qe) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Qe);
              }
          } catch (fe) {
            console.warn("[nimbi-cms] compute container height failed", fe);
          }
          try {
            k.style.setProperty("--nimbi-site-navbar-height", `${ce}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set navbar CSS var failed", fe);
          }
        }
      };
      J();
      try {
        if (typeof ResizeObserver < "u") {
          const ce = new ResizeObserver(() => J());
          try {
            ce.observe(k);
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", fe);
          }
        }
      } catch (ce) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", ce);
      }
    } catch (J) {
      console.warn("[nimbi-cms] compute navbar height failed", J);
    }
  } catch (k) {
    console.warn("[nimbi-cms] build navigation failed", k);
  }
  await z.renderByQuery();
  try {
    Promise.resolve().then(() => lo).then(({ getVersion: k }) => {
      typeof k == "function" && k().then((ie) => {
        try {
          const ue = ie || "0.0.0";
          try {
            const Se = (ye) => {
              const J = document.createElement("a");
              J.className = "nimbi-version-label tag is-small", J.textContent = `Ninbi CMS v. ${ue}`, J.href = ye || "#", J.target = "_blank", J.rel = "noopener noreferrer nofollow", J.setAttribute("aria-label", `Ninbi CMS version ${ue}`);
              try {
                Mr(J);
              } catch {
              }
              try {
                A.appendChild(J);
              } catch (ce) {
                console.warn("[nimbi-cms] append version label failed", ce);
              }
            };
            (async () => {
              try {
                const ye = await Promise.resolve().then(() => ki).catch(() => null), J = ye && (ye.default || ye);
                let ce = null;
                J && (J.homepage && typeof J.homepage == "string" ? ce = J.homepage : J.repository && (typeof J.repository == "string" ? ce = J.repository : J.repository.url && typeof J.repository.url == "string" && (ce = J.repository.url)));
                try {
                  ce && new URL(ce);
                } catch {
                  ce = null;
                }
                Se(ce || "#");
              } catch {
                Se("#");
              }
            })();
          } catch (Se) {
            console.warn("[nimbi-cms] building version label failed", Se);
          }
        } catch (ue) {
          console.warn("[nimbi-cms] building version label failed", ue);
        }
      }).catch((ie) => {
        console.warn("[nimbi-cms] getVersion() failed", ie);
      });
    }).catch((k) => {
      console.warn("[nimbi-cms] import version module failed", k);
    });
  } catch (k) {
    console.warn("[nimbi-cms] version label setup failed", k);
  }
}
async function oo() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => ki);
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
const lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: oo
}, Symbol.toStringTag, { value: "Module" })), oi = "nimbi-cms", li = "0.1.0", ci = { type: "git", url: "git+https://github.com/AbelVM/nimbiCMS.git" }, ui = "https://abelvm.github.io/nimbiCMS/", hi = "module", di = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, pi = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, fi = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, gi = "dist/nimbi-cms.cjs.js", mi = "dist/nimbi-cms.es.js", wi = "src/index.d.ts", bi = "dist/nimbi-cms.js", yi = ["dist", "src/index.d.ts"], co = {
  name: oi,
  version: li,
  repository: ci,
  homepage: ui,
  private: !0,
  type: hi,
  scripts: di,
  dependencies: pi,
  devDependencies: fi,
  main: gi,
  module: mi,
  types: wi,
  unpkg: bi,
  files: yi
}, ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: co,
  dependencies: pi,
  devDependencies: fi,
  files: yi,
  homepage: ui,
  main: gi,
  module: mi,
  name: oi,
  repository: ci,
  scripts: di,
  type: hi,
  types: wi,
  unpkg: bi,
  version: li
}, Symbol.toStringTag, { value: "Module" }));
export {
  Lr as BAD_LANGUAGES,
  Y as SUPPORTED_HLJS_MAP,
  go as _clearHooks,
  Rn as addHook,
  bo as default,
  hs as ensureBulma,
  oo as getVersion,
  $r as loadL10nFile,
  Cr as loadSupportedLanguages,
  cs as observeCodeBlocks,
  po as onNavBuild,
  ho as onPageLoad,
  St as registerLanguage,
  rr as runHooks,
  mo as setHighlightTheme,
  Pr as setLang,
  ds as setStyle,
  wo as setThemeVars,
  ht as t,
  fo as transformHtml
};
