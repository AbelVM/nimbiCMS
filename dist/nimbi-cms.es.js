const St = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Rn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(St, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  St[t].push(e);
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
async function ir(t, e) {
  const n = St[t] || [];
  for (const s of n)
    try {
      await s(e);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function go() {
  Object.keys(St).forEach((t) => {
    St[t].length = 0;
  });
}
function Lr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var un, sr;
function as() {
  if (sr) return un;
  sr = 1;
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
  function x(...g) {
    return "(" + (w(g).capture ? "" : "?:") + g.map((W) => h(W)).join("|") + ")";
  }
  function k(g) {
    return new RegExp(g.toString() + "|").exec("").length - 1;
  }
  function C(g, S) {
    const T = g && g.exec(S);
    return T && T.index === 0;
  }
  const I = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function M(g, { joinWith: S }) {
    let T = 0;
    return g.map((W) => {
      T += 1;
      const de = T;
      let pe = h(W), P = "";
      for (; pe.length > 0; ) {
        const $ = I.exec(pe);
        if (!$) {
          P += pe;
          break;
        }
        P += pe.substring(0, $.index), pe = pe.substring($.index + $[0].length), $[0][0] === "\\" && $[1] ? P += "\\" + String(Number($[1]) + de) : (P += $[0], $[0] === "(" && T++);
      }
      return P;
    }).map((W) => `(${W})`).join(S);
  }
  const B = /\b\B/, N = "[a-zA-Z]\\w*", K = "[a-zA-Z_]\\w*", V = "\\b\\d+(\\.\\d+)?", se = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", j = "\\b(0b[01]+)", Q = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", O = (g = {}) => {
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
  }, A = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, L = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [A]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [A]
  }, v = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, R = function(g, S, T = {}) {
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
    const de = x(
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
  }, y = R("//", "$"), U = R("/\\*", "\\*/"), Z = R("#", "$"), ge = {
    scope: "number",
    begin: V,
    relevance: 0
  }, ke = {
    scope: "number",
    begin: se,
    relevance: 0
  }, ee = {
    scope: "number",
    begin: j,
    relevance: 0
  }, oe = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      A,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [A]
      }
    ]
  }, me = {
    scope: "title",
    begin: N,
    relevance: 0
  }, Ue = {
    scope: "title",
    begin: K,
    relevance: 0
  }, qe = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + K,
    relevance: 0
  };
  var Mt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: L,
    BACKSLASH_ESCAPE: A,
    BINARY_NUMBER_MODE: ee,
    BINARY_NUMBER_RE: j,
    COMMENT: R,
    C_BLOCK_COMMENT_MODE: U,
    C_LINE_COMMENT_MODE: y,
    C_NUMBER_MODE: ke,
    C_NUMBER_RE: se,
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
    HASH_COMMENT_MODE: Z,
    IDENT_RE: N,
    MATCH_NOTHING_RE: B,
    METHOD_GUARD: qe,
    NUMBER_MODE: ge,
    NUMBER_RE: V,
    PHRASAL_WORDS_MODE: v,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: oe,
    RE_STARTERS_RE: Q,
    SHEBANG: O,
    TITLE_MODE: me,
    UNDERSCORE_IDENT_RE: K,
    UNDERSCORE_TITLE_MODE: Ue
  });
  function Si(g, S) {
    g.input[g.index - 1] === "." && S.ignoreMatch();
  }
  function vi(g, S) {
    g.className !== void 0 && (g.scope = g.className, delete g.className);
  }
  function Ei(g, S) {
    S && g.beginKeywords && (g.begin = "\\b(" + g.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", g.__beforeBegin = Si, g.keywords = g.keywords || g.beginKeywords, delete g.beginKeywords, g.relevance === void 0 && (g.relevance = 0));
  }
  function Ai(g, S) {
    Array.isArray(g.illegal) && (g.illegal = x(...g.illegal));
  }
  function Ri(g, S) {
    if (g.match) {
      if (g.begin || g.end) throw new Error("begin & end are not supported with match");
      g.begin = g.match, delete g.match;
    }
  }
  function Ti(g, S) {
    g.relevance === void 0 && (g.relevance = 1);
  }
  const Li = (g, S) => {
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
  }, Ci = [
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
  ], Mi = "keyword";
  function qn(g, S, T = Mi) {
    const W = /* @__PURE__ */ Object.create(null);
    return typeof g == "string" ? de(T, g.split(" ")) : Array.isArray(g) ? de(T, g) : Object.keys(g).forEach(function(pe) {
      Object.assign(
        W,
        qn(g[pe], S, pe)
      );
    }), W;
    function de(pe, P) {
      S && (P = P.map(($) => $.toLowerCase())), P.forEach(function($) {
        const F = $.split("|");
        W[F[0]] = [pe, _i(F[0], F[1])];
      });
    }
  }
  function _i(g, S) {
    return S ? Number(S) : $i(g) ? 0 : 1;
  }
  function $i(g) {
    return Ci.includes(g.toLowerCase());
  }
  const jn = {}, Ke = (g) => {
    console.error(g);
  }, Fn = (g, ...S) => {
    console.log(`WARN: ${g}`, ...S);
  }, tt = (g, S) => {
    jn[`${g}/${S}`] || (console.log(`Deprecated as of ${g}. ${S}`), jn[`${g}/${S}`] = !0);
  }, _t = new Error();
  function Wn(g, S, { key: T }) {
    let W = 0;
    const de = g[T], pe = {}, P = {};
    for (let $ = 1; $ <= S.length; $++)
      P[$ + W] = de[$], pe[$ + W] = !0, W += k(S[$ - 1]);
    g[T] = P, g[T]._emit = pe, g[T]._multi = !0;
  }
  function Pi(g) {
    if (Array.isArray(g.begin)) {
      if (g.skip || g.excludeBegin || g.returnBegin)
        throw Ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), _t;
      if (typeof g.beginScope != "object" || g.beginScope === null)
        throw Ke("beginScope must be object"), _t;
      Wn(g, g.begin, { key: "beginScope" }), g.begin = M(g.begin, { joinWith: "" });
    }
  }
  function Ii(g) {
    if (Array.isArray(g.end)) {
      if (g.skip || g.excludeEnd || g.returnEnd)
        throw Ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), _t;
      if (typeof g.endScope != "object" || g.endScope === null)
        throw Ke("endScope must be object"), _t;
      Wn(g, g.end, { key: "endScope" }), g.end = M(g.end, { joinWith: "" });
    }
  }
  function Bi(g) {
    g.scope && typeof g.scope == "object" && g.scope !== null && (g.beginScope = g.scope, delete g.scope);
  }
  function zi(g) {
    Bi(g), typeof g.beginScope == "string" && (g.beginScope = { _wrap: g.beginScope }), typeof g.endScope == "string" && (g.endScope = { _wrap: g.endScope }), Pi(g), Ii(g);
  }
  function Ni(g) {
    function S(P, $) {
      return new RegExp(
        h(P),
        "m" + (g.case_insensitive ? "i" : "") + (g.unicodeRegex ? "u" : "") + ($ ? "g" : "")
      );
    }
    class T {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule($, F) {
        F.position = this.position++, this.matchIndexes[this.matchAt] = F, this.regexes.push([F, $]), this.matchAt += k($) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const $ = this.regexes.map((F) => F[1]);
        this.matcherRe = S(M($, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec($) {
        this.matcherRe.lastIndex = this.lastIndex;
        const F = this.matcherRe.exec($);
        if (!F)
          return null;
        const ye = F.findIndex((ot, rn) => rn > 0 && ot !== void 0), fe = this.matchIndexes[ye];
        return F.splice(0, ye), Object.assign(F, fe);
      }
    }
    class W {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher($) {
        if (this.multiRegexes[$]) return this.multiRegexes[$];
        const F = new T();
        return this.rules.slice($).forEach(([ye, fe]) => F.addRule(ye, fe)), F.compile(), this.multiRegexes[$] = F, F;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule($, F) {
        this.rules.push([$, F]), F.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec($) {
        const F = this.getMatcher(this.regexIndex);
        F.lastIndex = this.lastIndex;
        let ye = F.exec($);
        if (this.resumingScanAtSamePosition() && !(ye && ye.index === this.lastIndex)) {
          const fe = this.getMatcher(0);
          fe.lastIndex = this.lastIndex + 1, ye = fe.exec($);
        }
        return ye && (this.regexIndex += ye.position + 1, this.regexIndex === this.count && this.considerAll()), ye;
      }
    }
    function de(P) {
      const $ = new W();
      return P.contains.forEach((F) => $.addRule(F.begin, { rule: F, type: "begin" })), P.terminatorEnd && $.addRule(P.terminatorEnd, { type: "end" }), P.illegal && $.addRule(P.illegal, { type: "illegal" }), $;
    }
    function pe(P, $) {
      const F = (
        /** @type CompiledMode */
        P
      );
      if (P.isCompiled) return F;
      [
        vi,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Ri,
        zi,
        Li
      ].forEach((fe) => fe(P, $)), g.compilerExtensions.forEach((fe) => fe(P, $)), P.__beforeBegin = null, [
        Ei,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ai,
        // default to 1 relevance if not specified
        Ti
      ].forEach((fe) => fe(P, $)), P.isCompiled = !0;
      let ye = null;
      return typeof P.keywords == "object" && P.keywords.$pattern && (P.keywords = Object.assign({}, P.keywords), ye = P.keywords.$pattern, delete P.keywords.$pattern), ye = ye || /\w+/, P.keywords && (P.keywords = qn(P.keywords, g.case_insensitive)), F.keywordPatternRe = S(ye, !0), $ && (P.begin || (P.begin = /\B|\b/), F.beginRe = S(F.begin), !P.end && !P.endsWithParent && (P.end = /\B|\b/), P.end && (F.endRe = S(F.end)), F.terminatorEnd = h(F.end) || "", P.endsWithParent && $.terminatorEnd && (F.terminatorEnd += (P.end ? "|" : "") + $.terminatorEnd)), P.illegal && (F.illegalRe = S(
        /** @type {RegExp | string} */
        P.illegal
      )), P.contains || (P.contains = []), P.contains = [].concat(...P.contains.map(function(fe) {
        return Oi(fe === "self" ? P : fe);
      })), P.contains.forEach(function(fe) {
        pe(
          /** @type Mode */
          fe,
          F
        );
      }), P.starts && pe(P.starts, $), F.matcher = de(F), F;
    }
    if (g.compilerExtensions || (g.compilerExtensions = []), g.contains && g.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return g.classNameAliases = s(g.classNameAliases || {}), pe(
      /** @type Mode */
      g
    );
  }
  function Zn(g) {
    return g ? g.endsWithParent || Zn(g.starts) : !1;
  }
  function Oi(g) {
    return g.variants && !g.cachedVariants && (g.cachedVariants = g.variants.map(function(S) {
      return s(g, { variants: null }, S);
    })), g.cachedVariants ? g.cachedVariants : Zn(g) ? s(g, { starts: g.starts ? s(g.starts) : null }) : Object.isFrozen(g) ? s(g) : g;
  }
  var Di = "11.11.1";
  class Hi extends Error {
    constructor(S, T) {
      super(S), this.name = "HTMLInjectionError", this.html = T;
    }
  }
  const nn = n, Gn = s, Qn = /* @__PURE__ */ Symbol("nomatch"), Ui = 7, Xn = function(g) {
    const S = /* @__PURE__ */ Object.create(null), T = /* @__PURE__ */ Object.create(null), W = [];
    let de = !0;
    const pe = "Could not find the language '{}', did you forget to load/include a language module?", P = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
      __emitter: u
    };
    function F(E) {
      return $.noHighlightRe.test(E);
    }
    function ye(E) {
      let H = E.className + " ";
      H += E.parentNode ? E.parentNode.className : "";
      const te = $.languageDetectRe.exec(H);
      if (te) {
        const le = je(te[1]);
        return le || (Fn(pe.replace("{}", te[1])), Fn("Falling back to no-highlight mode for this block.", E)), le ? te[1] : "no-highlight";
      }
      return H.split(/\s+/).find((le) => F(le) || je(le));
    }
    function fe(E, H, te) {
      let le = "", we = "";
      typeof H == "object" ? (le = E, te = H.ignoreIllegals, we = H.language) : (tt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), tt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), we = E, le = H), te === void 0 && (te = !0);
      const _e = {
        code: le,
        language: we
      };
      Pt("before:highlight", _e);
      const Fe = _e.result ? _e.result : ot(_e.language, _e.code, te);
      return Fe.code = _e.code, Pt("after:highlight", Fe), Fe;
    }
    function ot(E, H, te, le) {
      const we = /* @__PURE__ */ Object.create(null);
      function _e(_, z) {
        return _.keywords[z];
      }
      function Fe() {
        if (!G.keywords) {
          xe.addText(ce);
          return;
        }
        let _ = 0;
        G.keywordPatternRe.lastIndex = 0;
        let z = G.keywordPatternRe.exec(ce), X = "";
        for (; z; ) {
          X += ce.substring(_, z.index);
          const ae = Be.case_insensitive ? z[0].toLowerCase() : z[0], ve = _e(G, ae);
          if (ve) {
            const [Oe, is] = ve;
            if (xe.addText(X), X = "", we[ae] = (we[ae] || 0) + 1, we[ae] <= Ui && (zt += is), Oe.startsWith("_"))
              X += z[0];
            else {
              const ss = Be.classNameAliases[Oe] || Oe;
              Ie(z[0], ss);
            }
          } else
            X += z[0];
          _ = G.keywordPatternRe.lastIndex, z = G.keywordPatternRe.exec(ce);
        }
        X += ce.substring(_), xe.addText(X);
      }
      function It() {
        if (ce === "") return;
        let _ = null;
        if (typeof G.subLanguage == "string") {
          if (!S[G.subLanguage]) {
            xe.addText(ce);
            return;
          }
          _ = ot(G.subLanguage, ce, !0, rr[G.subLanguage]), rr[G.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = sn(ce, G.subLanguage.length ? G.subLanguage : null);
        G.relevance > 0 && (zt += _.relevance), xe.__addSublanguage(_._emitter, _.language);
      }
      function Re() {
        G.subLanguage != null ? It() : Fe(), ce = "";
      }
      function Ie(_, z) {
        _ !== "" && (xe.startScope(z), xe.addText(_), xe.endScope());
      }
      function Jn(_, z) {
        let X = 1;
        const ae = z.length - 1;
        for (; X <= ae; ) {
          if (!_._emit[X]) {
            X++;
            continue;
          }
          const ve = Be.classNameAliases[_[X]] || _[X], Oe = z[X];
          ve ? Ie(Oe, ve) : (ce = Oe, Fe(), ce = ""), X++;
        }
      }
      function er(_, z) {
        return _.scope && typeof _.scope == "string" && xe.openNode(Be.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (Ie(ce, Be.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), ce = "") : _.beginScope._multi && (Jn(_.beginScope, z), ce = "")), G = Object.create(_, { parent: { value: G } }), G;
      }
      function tr(_, z, X) {
        let ae = C(_.endRe, X);
        if (ae) {
          if (_["on:end"]) {
            const ve = new e(_);
            _["on:end"](z, ve), ve.isMatchIgnored && (ae = !1);
          }
          if (ae) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return tr(_.parent, z, X);
      }
      function Ji(_) {
        return G.matcher.regexIndex === 0 ? (ce += _[0], 1) : (cn = !0, 0);
      }
      function es(_) {
        const z = _[0], X = _.rule, ae = new e(X), ve = [X.__beforeBegin, X["on:begin"]];
        for (const Oe of ve)
          if (Oe && (Oe(_, ae), ae.isMatchIgnored))
            return Ji(z);
        return X.skip ? ce += z : (X.excludeBegin && (ce += z), Re(), !X.returnBegin && !X.excludeBegin && (ce = z)), er(X, _), X.returnBegin ? 0 : z.length;
      }
      function ts(_) {
        const z = _[0], X = H.substring(_.index), ae = tr(G, _, X);
        if (!ae)
          return Qn;
        const ve = G;
        G.endScope && G.endScope._wrap ? (Re(), Ie(z, G.endScope._wrap)) : G.endScope && G.endScope._multi ? (Re(), Jn(G.endScope, _)) : ve.skip ? ce += z : (ve.returnEnd || ve.excludeEnd || (ce += z), Re(), ve.excludeEnd && (ce = z));
        do
          G.scope && xe.closeNode(), !G.skip && !G.subLanguage && (zt += G.relevance), G = G.parent;
        while (G !== ae.parent);
        return ae.starts && er(ae.starts, _), ve.returnEnd ? 0 : z.length;
      }
      function ns() {
        const _ = [];
        for (let z = G; z !== Be; z = z.parent)
          z.scope && _.unshift(z.scope);
        _.forEach((z) => xe.openNode(z));
      }
      let Bt = {};
      function nr(_, z) {
        const X = z && z[0];
        if (ce += _, X == null)
          return Re(), 0;
        if (Bt.type === "begin" && z.type === "end" && Bt.index === z.index && X === "") {
          if (ce += H.slice(z.index, z.index + 1), !de) {
            const ae = new Error(`0 width match regex (${E})`);
            throw ae.languageName = E, ae.badRule = Bt.rule, ae;
          }
          return 1;
        }
        if (Bt = z, z.type === "begin")
          return es(z);
        if (z.type === "illegal" && !te) {
          const ae = new Error('Illegal lexeme "' + X + '" for mode "' + (G.scope || "<unnamed>") + '"');
          throw ae.mode = G, ae;
        } else if (z.type === "end") {
          const ae = ts(z);
          if (ae !== Qn)
            return ae;
        }
        if (z.type === "illegal" && X === "")
          return ce += `
`, 1;
        if (ln > 1e5 && ln > z.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ce += X, X.length;
      }
      const Be = je(E);
      if (!Be)
        throw Ke(pe.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const rs = Ni(Be);
      let on = "", G = le || rs;
      const rr = {}, xe = new $.__emitter($);
      ns();
      let ce = "", zt = 0, Ye = 0, ln = 0, cn = !1;
      try {
        if (Be.__emitTokens)
          Be.__emitTokens(H, xe);
        else {
          for (G.matcher.considerAll(); ; ) {
            ln++, cn ? cn = !1 : G.matcher.considerAll(), G.matcher.lastIndex = Ye;
            const _ = G.matcher.exec(H);
            if (!_) break;
            const z = H.substring(Ye, _.index), X = nr(z, _);
            Ye = _.index + X;
          }
          nr(H.substring(Ye));
        }
        return xe.finalize(), on = xe.toHTML(), {
          language: E,
          value: on,
          relevance: zt,
          illegal: !1,
          _emitter: xe,
          _top: G
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
              index: Ye,
              context: H.slice(Ye - 100, Ye + 100),
              mode: _.mode,
              resultSoFar: on
            },
            _emitter: xe
          };
        if (de)
          return {
            language: E,
            value: nn(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: xe,
            _top: G
          };
        throw _;
      }
    }
    function rn(E) {
      const H = {
        value: nn(E),
        illegal: !1,
        relevance: 0,
        _top: P,
        _emitter: new $.__emitter($)
      };
      return H._emitter.addText(E), H;
    }
    function sn(E, H) {
      H = H || $.languages || Object.keys(S);
      const te = rn(E), le = H.filter(je).filter(Vn).map(
        (Re) => ot(Re, E, !1)
      );
      le.unshift(te);
      const we = le.sort((Re, Ie) => {
        if (Re.relevance !== Ie.relevance) return Ie.relevance - Re.relevance;
        if (Re.language && Ie.language) {
          if (je(Re.language).supersetOf === Ie.language)
            return 1;
          if (je(Ie.language).supersetOf === Re.language)
            return -1;
        }
        return 0;
      }), [_e, Fe] = we, It = _e;
      return It.secondBest = Fe, It;
    }
    function qi(E, H, te) {
      const le = H && T[H] || te;
      E.classList.add("hljs"), E.classList.add(`language-${le}`);
    }
    function an(E) {
      let H = null;
      const te = ye(E);
      if (F(te)) return;
      if (Pt(
        "before:highlightElement",
        { el: E, language: te }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && ($.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), $.throwUnescapedHTML))
        throw new Hi(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      H = E;
      const le = H.textContent, we = te ? fe(le, { language: te, ignoreIllegals: !0 }) : sn(le);
      E.innerHTML = we.value, E.dataset.highlighted = "yes", qi(E, te, we.language), E.result = {
        language: we.language,
        // TODO: remove with version 11.0
        re: we.relevance,
        relevance: we.relevance
      }, we.secondBest && (E.secondBest = {
        language: we.secondBest.language,
        relevance: we.secondBest.relevance
      }), Pt("after:highlightElement", { el: E, result: we, text: le });
    }
    function ji(E) {
      $ = Gn($, E);
    }
    const Fi = () => {
      $t(), tt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Wi() {
      $t(), tt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Kn = !1;
    function $t() {
      function E() {
        $t();
      }
      if (document.readyState === "loading") {
        Kn || window.addEventListener("DOMContentLoaded", E, !1), Kn = !0;
        return;
      }
      document.querySelectorAll($.cssSelector).forEach(an);
    }
    function Zi(E, H) {
      let te = null;
      try {
        te = H(g);
      } catch (le) {
        if (Ke("Language definition for '{}' could not be registered.".replace("{}", E)), de)
          Ke(le);
        else
          throw le;
        te = P;
      }
      te.name || (te.name = E), S[E] = te, te.rawDefinition = H.bind(null, g), te.aliases && Yn(te.aliases, { languageName: E });
    }
    function Gi(E) {
      delete S[E];
      for (const H of Object.keys(T))
        T[H] === E && delete T[H];
    }
    function Qi() {
      return Object.keys(S);
    }
    function je(E) {
      return E = (E || "").toLowerCase(), S[E] || S[T[E]];
    }
    function Yn(E, { languageName: H }) {
      typeof E == "string" && (E = [E]), E.forEach((te) => {
        T[te.toLowerCase()] = H;
      });
    }
    function Vn(E) {
      const H = je(E);
      return H && !H.disableAutodetect;
    }
    function Xi(E) {
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
    function Ki(E) {
      Xi(E), W.push(E);
    }
    function Yi(E) {
      const H = W.indexOf(E);
      H !== -1 && W.splice(H, 1);
    }
    function Pt(E, H) {
      const te = E;
      W.forEach(function(le) {
        le[te] && le[te](H);
      });
    }
    function Vi(E) {
      return tt("10.7.0", "highlightBlock will be removed entirely in v12.0"), tt("10.7.0", "Please use highlightElement now."), an(E);
    }
    Object.assign(g, {
      highlight: fe,
      highlightAuto: sn,
      highlightAll: $t,
      highlightElement: an,
      // TODO: Remove with v12 API
      highlightBlock: Vi,
      configure: ji,
      initHighlighting: Fi,
      initHighlightingOnLoad: Wi,
      registerLanguage: Zi,
      unregisterLanguage: Gi,
      listLanguages: Qi,
      getLanguage: je,
      registerAliases: Yn,
      autoDetection: Vn,
      inherit: Gn,
      addPlugin: Ki,
      removePlugin: Yi
    }), g.debugMode = function() {
      de = !1;
    }, g.safeMode = function() {
      de = !0;
    }, g.versionString = Di, g.regex = {
      concat: m,
      lookahead: f,
      either: x,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const E in Mt)
      typeof Mt[E] == "object" && t(Mt[E]);
    return Object.assign(g, Mt), g;
  }, nt = Xn({});
  return nt.newInstance = () => Xn({}), un = nt, nt.HighlightJS = nt, nt.default = nt, un;
}
var os = /* @__PURE__ */ as();
const ue = /* @__PURE__ */ Lr(os), J = /* @__PURE__ */ new Map(), ls = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Te = {
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
const Cr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Ge = null;
const hn = /* @__PURE__ */ new Map(), cs = 300 * 1e3;
async function Mr(t = ls) {
  if (t)
    return Ge || (Ge = (async () => {
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
          J.set(d, d);
          const m = f[a] || "";
          if (m) {
            const w = String(m).split(",").map((x) => x.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const k = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              k && /[a-z0-9]/i.test(k) && (J.set(k, k), o.push(k));
            }
          }
        }
        try {
          const l = [];
          for (const u of o) {
            const h = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? l.push(h) : J.delete(u);
          }
          o = l;
        } catch (l) {
          console.warn("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const u of Array.from(J.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              J.delete(u), l++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const h = u.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = J.get(u);
                J.delete(u), J.set(h, f);
              } else
                J.delete(u), l++;
            }
          }
          for (const [u, h] of Array.from(J.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (J.delete(u), l++);
          try {
            const u = ":---------------------";
            J.has(u) && (J.delete(u), l++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(J.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (l) {
          console.warn("[codeblocksManager] ignored error", l);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), Ge);
}
const lt = /* @__PURE__ */ new Set();
async function vt(t, e) {
  if (Ge || (async () => {
    try {
      await Mr();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Ge)
    try {
      await Ge;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const n = t.toLowerCase();
  if (Cr.has(n)) return !1;
  if (J.size && !J.has(n)) {
    const r = Te;
    if (!r[n] && !r[t])
      return !1;
  }
  if (lt.has(t)) return !0;
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
    J.size && (c = c.filter((u) => {
      if (J.has(u)) return !0;
      const h = Te[u];
      return !!(h && J.has(h));
    }));
    let o = null, l = null;
    for (const u of c)
      try {
        const h = Date.now();
        let f = hn.get(u);
        if (f && f.ok === !1 && h - (f.ts || 0) >= cs && (hn.delete(u), f = void 0), f) {
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
            const d = J.size && J.get(t) || u || t;
            return ue.registerLanguage(d, p), lt.add(d), d !== t && (ue.registerLanguage(t, p), lt.add(t)), !0;
          } catch (d) {
            l = d;
          }
        } else
          try {
            if (J.has(u) || J.has(t)) {
              const p = () => ({});
              try {
                ue.registerLanguage(u, p), lt.add(u);
              } catch {
              }
              try {
                u !== t && (ue.registerLanguage(t, p), lt.add(t));
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
let Nt = null;
function us(t = document) {
  Ge || (async () => {
    try {
      await Mr();
    } catch (i) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", i);
    }
  })();
  const e = Te, s = Nt || (typeof IntersectionObserver > "u" ? null : (Nt = new IntersectionObserver((i, a) => {
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
            const h = (u[1] || "").toLowerCase(), f = e[h] || h, p = J.size && (J.get(f) || J.get(String(f).toLowerCase())) || f;
            try {
              await vt(p);
            } catch (d) {
              console.warn("[codeblocksManager] registerLanguage failed", d);
            }
            try {
              ue.highlightElement(o);
            } catch (d) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const h = o.textContent || "";
              try {
                if (ue && typeof ue.getLanguage == "function" && ue.getLanguage("plaintext")) {
                  const f = ue.highlight(h, { language: "plaintext" });
                  f && f.value && (o.innerHTML = f.value);
                }
              } catch {
                try {
                  ue.highlightElement(o);
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
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Nt)), r = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!s) {
    r.forEach(async (i) => {
      try {
        const a = i.getAttribute && i.getAttribute("class") || i.className || "", c = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const o = (c[1] || "").toLowerCase(), l = e[o] || o, u = J.size && (J.get(l) || J.get(String(l).toLowerCase())) || l;
          try {
            await vt(u);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          ue.highlightElement(i);
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
let gt = "light";
function hs(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const n = document.createElement("link");
  n.rel = "stylesheet", n.href = t, Object.entries(e).forEach(([s, r]) => n.setAttribute(s, r)), document.head.appendChild(n);
}
async function ds(t = "none", e = "/") {
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
    hs(i, { "data-bulmaswatch-theme": r });
  } catch (r) {
    console.warn("[bulmaManager] ensureBulma failed", r);
  }
}
function ps(t) {
  gt = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", gt), gt === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
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
function _r(t) {
  if (!t || !(t instanceof HTMLElement)) return () => {
  };
  const e = () => {
    gt === "dark" ? (t.classList.add("is-dark"), t.classList.remove("is-light")) : (t.classList.add("is-light"), t.classList.remove("is-dark"));
  };
  e();
  const n = new MutationObserver(() => {
    gt = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light", e();
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
const $r = {
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
}, st = JSON.parse(JSON.stringify($r));
let Ft = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Ft = String(t).split("-")[0].toLowerCase();
}
$r[Ft] || (Ft = "en");
let Qe = Ft;
function dt(t, e = {}) {
  const n = st[Qe] || st.en;
  let s = n && n[t] ? n[t] : st.en[t] || "";
  for (const r of Object.keys(e))
    s = s.replace(new RegExp(`{${r}}`, "g"), String(e[r]));
  return s;
}
async function Pr(t, e) {
  if (!t) return;
  let n = t;
  try {
    /^https?:\/\//.test(t) || (n = new URL(t, location.origin + e).toString());
    const s = await fetch(n);
    if (!s.ok) return;
    const r = await s.json();
    for (const i of Object.keys(r || {}))
      st[i] = Object.assign({}, st[i] || {}, r[i]);
  } catch {
  }
}
function Ir(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Qe = st[e] ? e : "en";
}
const fs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Qe;
  },
  loadL10nFile: Pr,
  setLang: Ir,
  t: dt
}, Symbol.toStringTag, { value: "Module" })), gs = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Br(t, e = "worker") {
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
      }, m = (x) => {
        const k = x.data || {};
        k.id === f && (d(), k.error ? u(new Error(k.error)) : l(k.result));
      }, w = (x) => {
        d(), console.warn("[" + e + "] worker error event", x);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (k) {
          console.warn("[" + e + "] worker termination failed", k);
        }
        u(new Error(x && x.message || "worker error"));
      };
      p = setTimeout(() => {
        d(), console.warn("[" + e + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (x) {
          console.warn("[" + e + "] worker termination on timeout failed", x);
        }
        u(new Error("worker timeout"));
      }, o), h.addEventListener("message", m), h.addEventListener("error", w);
      try {
        h.postMessage(c);
      } catch (x) {
        d(), u(x);
      }
    });
  }
  return { get: s, send: i, terminate: r };
}
function ms(t) {
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
  ws(), Ne.clear();
  for (const e of Le)
    e && Ne.add(e);
  ar(Y), ar(q), Tn._refreshed = !0;
}
function ar(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Ne.add(e);
}
function or(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(n, s) {
    return s && Ne.add(s), e.call(this, n, s);
  };
}
let lr = !1;
function ws() {
  lr || (or(Y), or(q), lr = !0);
}
function zr(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function he(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function At(t) {
  return String(t || "").replace(/\/+$/, "");
}
function Et(t) {
  return At(t) + "/";
}
function bs(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = t, document.head.appendChild(n);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Ot(t, e = 0, n = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const s = Array.from(t.querySelectorAll("img"));
    if (!s.length) return;
    const r = t, i = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, a = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = i ? Math.max(a, i.top) : a, u = (i ? Math.min(c, i.bottom) : c) + Number(e || 0);
    let h = 0;
    r && (h = r.clientHeight || (i ? i.height : 0)), h || (h = c - a);
    let f = 0.6;
    try {
      const w = r && window.getComputedStyle ? window.getComputedStyle(r) : null, x = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), k = x ? parseFloat(x) : NaN;
      !Number.isNaN(k) && k > 0 && k <= 1 && (f = k);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(h * f));
    let d = !1, m = null;
    if (s.forEach((w) => {
      try {
        const x = w.getAttribute ? w.getAttribute("loading") : void 0;
        x !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const k = w.getBoundingClientRect ? w.getBoundingClientRect() : null, C = w.src || w.getAttribute && w.getAttribute("src"), I = k && k.height > 1 ? k.height : p, M = k ? k.top : 0, B = M + I;
        k && I > 0 && M <= u && B >= o && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), bs(C), d = !0), !m && k && k.top <= u && (m = { img: w, src: C, rect: k, beforeLoading: x });
      } catch (x) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", x);
      }
    }), !d && m) {
      const { img: w, src: x, rect: k, beforeLoading: C } = m;
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
function Wt(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Wt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const Y = /* @__PURE__ */ new Map();
let Ce = [], Ln = !1;
function ys(t) {
  Ln = !!t;
}
function Nr(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function ks() {
  return Ce;
}
const Or = Br(() => ms(gs), "slugManager");
function Cn() {
  return Or.get();
}
function Dr(t) {
  return Or.send(t);
}
async function xs(t, e = 1, n = void 0) {
  if (!Cn()) return Qt(t, e, n);
  try {
    return await Dr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: n });
  } catch (r) {
    try {
      return await Qt(t, e, n);
    } catch (i) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", i), r;
    }
  }
}
async function Ss(t, e, n) {
  return Cn() ? Dr({ type: "crawlForSlug", slug: t, base: e, maxQueue: n }) : Mn(t, e, n);
}
function We(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const s = e.split("/")[0], r = Ce.includes(s);
      let i = Y.get(t);
      (!i || typeof i == "string") && (i = { default: typeof i == "string" ? i : void 0, langs: {} }), r ? i.langs[s] = e : i.default = e, Y.set(t, i);
    } else
      Y.set(t, e);
}
const Jt = /* @__PURE__ */ new Set();
function vs(t) {
  typeof t == "function" && Jt.add(t);
}
function Es(t) {
  typeof t == "function" && Jt.delete(t);
}
const q = /* @__PURE__ */ new Map();
let wn = {}, Le = [], at = "_404.md", it = "_home.md";
function bn(t) {
  t != null && (at = String(t || ""));
}
function As(t) {
  t != null && (it = String(t || ""));
}
function Rs(t) {
  wn = t || {};
}
const mt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Set();
function Ts() {
  mt.clear(), Zt.clear();
}
function Ls(t) {
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
function Gt(t) {
  Y.clear(), q.clear(), Le = [], Ce = Ce || [];
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
      n = Et(n);
    }
  } catch (s) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", s);
  }
  n || (n = Ls(e));
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
        const c = ie(a[1].trim());
        if (c)
          try {
            if (Ce && Ce.length) {
              const l = r.split("/")[0], u = Ce.includes(l);
              let h = Y.get(c);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), u ? h.langs[l] = r : h.default = r, Y.set(c, h);
            } else
              Y.set(c, r);
            q.set(r, c);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Gt();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function ie(t) {
  let n = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function Cs(t) {
  return Rt(t, void 0);
}
function Rt(t, e) {
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
function Ht(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, n) => n);
}
function Tt(t) {
  if (!t || !Y.has(t)) return null;
  const e = Y.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ce && Ce.length && Qe && e.langs && e.langs[Qe])
    return e.langs[Qe];
  if (e.default) return e.default;
  if (e.langs) {
    const n = Object.keys(e.langs);
    if (n.length) return e.langs[n[0]];
  }
  return null;
}
const wt = /* @__PURE__ */ new Map();
function Ms() {
  wt.clear();
}
let Se = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const i = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (i && Y.has(i)) {
      const a = Tt(i) || Y.get(i);
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
  if (wt.has(s))
    return wt.get(s);
  const r = (async () => {
    const i = await fetch(s);
    if (!i || typeof i.ok != "boolean" || !i.ok) {
      if (i && i.status === 404)
        try {
          const h = `${n}/${at}`, f = await globalThis.fetch(h);
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
        const u = `${n}/${at}`, h = await globalThis.fetch(u);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", s), new Error("failed to fetch md");
    }
    return l ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return wt.set(s, r), r;
};
function _s(t) {
  typeof t == "function" && (Se = t);
}
const Ut = /* @__PURE__ */ new Map();
function $s(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let De = [], ct = null;
async function Qt(t, e = 1, n = void 0) {
  const s = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => he(String(r || ""))))) : [];
  try {
    const r = he(String(at || ""));
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
  if (ct) return ct;
  ct = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((l) => he(String(l || ""))))) : [];
    try {
      const l = he(String(at || ""));
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
      for (const l of Y.values())
        l && a.push(l);
    try {
      const l = await jr(t);
      l && l.length && (a = a.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(a), u = [...a];
      for (l.size; u.length && l.size <= Lt; ) {
        const h = u.shift();
        try {
          const f = await Se(h, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], m = String(h || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(m) && Ln && (!h || !h.includes("/")))
              continue;
            const w = $s(p), x = /\[[^\]]+\]\(([^)]+)\)/g;
            let k;
            for (; k = x.exec(w); )
              d.push(k[1]);
            const C = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; k = C.exec(w); )
              d.push(k[1]);
            const I = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
            for (let M of d)
              try {
                if (Rt(M, t) || M.startsWith("..") || M.indexOf("/../") !== -1 || (I && !M.startsWith("./") && !M.startsWith("/") && !M.startsWith("../") && (M = I + M), M = he(M), !/\.(md|html?)(?:$|[?#])/i.test(M)) || (M = M.split(/[?#]/)[0], i(M))) continue;
                l.has(M) || (l.add(M), u.push(M), a.push(M));
              } catch (B) {
                console.warn("[slugManager] href processing failed", M, B);
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
          const u = await Se(l, t);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let h = "", f = "";
            if (u.isHtml)
              try {
                const m = new DOMParser().parseFromString(u.raw, "text/html"), w = m.querySelector("title") || m.querySelector("h1");
                w && w.textContent && (h = w.textContent.trim());
                const x = m.querySelector("p");
                if (x && x.textContent && (f = x.textContent.trim()), e >= 2)
                  try {
                    const k = m.querySelector("h1"), C = k && k.textContent ? k.textContent.trim() : h || "", I = (() => {
                      try {
                        if (q.has(l)) return q.get(l);
                      } catch {
                      }
                      return ie(h || l);
                    })(), M = Array.from(m.querySelectorAll("h2"));
                    for (const B of M)
                      try {
                        const N = (B.textContent || "").trim();
                        if (!N) continue;
                        const K = B.id ? B.id : ie(N), V = I ? `${I}::${K}` : `${ie(l)}::${K}`;
                        let se = "", j = B.nextElementSibling;
                        for (; j && j.tagName && j.tagName.toLowerCase() === "script"; ) j = j.nextElementSibling;
                        j && j.textContent && (se = String(j.textContent).trim()), o.push({ slug: V, title: N, excerpt: se, path: l, parentTitle: C });
                      } catch (N) {
                        console.warn("[slugManager] indexing H2 failed", N);
                      }
                    if (e === 3)
                      try {
                        const B = Array.from(m.querySelectorAll("h3"));
                        for (const N of B)
                          try {
                            const K = (N.textContent || "").trim();
                            if (!K) continue;
                            const V = N.id ? N.id : ie(K), se = I ? `${I}::${V}` : `${ie(l)}::${V}`;
                            let j = "", Q = N.nextElementSibling;
                            for (; Q && Q.tagName && Q.tagName.toLowerCase() === "script"; ) Q = Q.nextElementSibling;
                            Q && Q.textContent && (j = String(Q.textContent).trim()), o.push({ slug: se, title: K, excerpt: j, path: l, parentTitle: C });
                          } catch (K) {
                            console.warn("[slugManager] indexing H3 failed", K);
                          }
                      } catch (B) {
                        console.warn("[slugManager] collect H3s failed", B);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect H2s failed", k);
                  }
              } catch (d) {
                console.warn("[slugManager] parsing HTML for index failed", d);
              }
            else {
              const d = u.raw, m = d.match(/^#\s+(.+)$/m);
              h = m ? m[1].trim() : "";
              try {
                h = Ht(h);
              } catch {
              }
              const w = d.split(/\r?\n\s*\r?\n/);
              if (w.length > 1)
                for (let x = 1; x < w.length; x++) {
                  const k = w[x].trim();
                  if (k && !/^#/.test(k)) {
                    f = k.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e >= 2) {
                let x = "", k = "";
                try {
                  const C = (d.match(/^#\s+(.+)$/m) || [])[1];
                  x = C ? C.trim() : "", k = (function() {
                    try {
                      if (q.has(l)) return q.get(l);
                    } catch {
                    }
                    return ie(h || l);
                  })();
                  const I = /^##\s+(.+)$/gm;
                  let M;
                  for (; M = I.exec(d); )
                    try {
                      const B = (M[1] || "").trim(), N = Ht(B);
                      if (!B) continue;
                      const K = ie(B), V = k ? `${k}::${K}` : `${ie(l)}::${K}`, j = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), Q = j && j[1] ? String(j[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: V, title: N, excerpt: Q, path: l, parentTitle: x });
                    } catch (B) {
                      console.warn("[slugManager] indexing markdown H2 failed", B);
                    }
                } catch (C) {
                  console.warn("[slugManager] collect markdown H2s failed", C);
                }
                if (e === 3)
                  try {
                    const C = /^###\s+(.+)$/gm;
                    let I;
                    for (; I = C.exec(d); )
                      try {
                        const M = (I[1] || "").trim(), B = Ht(M);
                        if (!M) continue;
                        const N = ie(M), K = k ? `${k}::${N}` : `${ie(l)}::${N}`, se = d.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), j = se && se[1] ? String(se[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: K, title: B, excerpt: j, path: l, parentTitle: x });
                      } catch (M) {
                        console.warn("[slugManager] indexing markdown H3 failed", M);
                      }
                  } catch (C) {
                    console.warn("[slugManager] collect markdown H3s failed", C);
                  }
              }
            }
            let p = "";
            try {
              q.has(l) && (p = q.get(l));
            } catch (d) {
              console.warn("[slugManager] mdToSlug access failed", d);
            }
            p || (p = ie(h || l)), o.push({ slug: p, title: h, excerpt: f, path: l });
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
    await ct;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return ct = null, De;
}
const Hr = 1e3;
let Lt = Hr;
function Ps(t) {
  typeof t == "number" && t >= 0 && (Lt = t);
}
const Ur = new DOMParser(), qr = "a[href]";
let Mn = async function(t, e, n = Lt) {
  if (Ut.has(t)) return Ut.get(t);
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
      const l = await o.text(), h = Ur.parseFromString(l, "text/html").querySelectorAll(qr);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Rt(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            r.has(d) || i.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = he(a + p);
            try {
              if (q.has(d))
                continue;
              for (const m of Y.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await Se(d, e);
              if (m && m.raw) {
                const w = (m.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && ie(w[1].trim()) === t) {
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
  return Ut.set(t, s), s;
};
async function jr(t, e = Lt) {
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
      const o = await c.text(), u = Ur.parseFromString(o, "text/html").querySelectorAll(qr);
      for (const h of u)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Rt(f, t) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
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
async function Fr(t, e, n) {
  if (t && typeof t == "string" && (t = he(t), t = At(t)), Y.has(t))
    return Tt(t) || Y.get(t);
  for (const r of Jt)
    try {
      const i = await r(t, e);
      if (i)
        return We(t, i), q.set(i, t), i;
    } catch (i) {
      console.warn("[slugManager] slug resolver failed", i);
    }
  if (Le && Le.length) {
    if (mt.has(t)) {
      const r = mt.get(t);
      return Y.set(t, r), q.set(r, t), r;
    }
    for (const r of Le)
      if (!Zt.has(r))
        try {
          const i = await Se(r, e);
          if (i && i.raw) {
            const a = (i.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const c = ie(a[1].trim());
              if (Zt.add(r), c && mt.set(c, r), c === t)
                return We(t, r), q.set(r, t), r;
            }
          }
        } catch (i) {
          console.warn("[slugManager] manifest title fetch failed", i);
        }
  }
  try {
    const r = await Qt(e);
    if (r && r.length) {
      const i = r.find((a) => a.slug === t);
      if (i)
        return We(t, i.path), q.set(i.path, t), i.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Mn(t, e, n);
    if (r)
      return We(t, r), q.set(r, t), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const s = [`${t}.html`, `${t}.md`];
  for (const r of s)
    try {
      const i = await Se(r, e);
      if (i && i.raw)
        return We(t, r), q.set(r, t), r;
    } catch (i) {
      console.warn("[slugManager] candidate fetch failed", i);
    }
  if (Le && Le.length)
    for (const r of Le)
      try {
        const i = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ie(i) === t)
          return We(t, r), q.set(r, t), r;
      } catch (i) {
        console.warn("[slugManager] build-time filename match failed", i);
      }
  try {
    const r = [];
    it && typeof it == "string" && it.trim() && r.push(it), r.includes("_home.md") || r.push("_home.md");
    for (const i of r)
      try {
        const a = await Se(i, e);
        if (a && a.raw) {
          const c = (a.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && ie(c[1].trim()) === t)
            return We(t, i), q.set(i, t), i;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Hr,
  _setAllMd: Rs,
  _storeSlugMapping: We,
  addSlugResolver: vs,
  get allMarkdownPaths() {
    return Le;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Qt,
  buildSearchIndexWorker: xs,
  clearFetchCache: Ms,
  clearListCaches: Ts,
  crawlAllMarkdown: jr,
  crawlCache: Ut,
  crawlForSlug: Mn,
  crawlForSlugWorker: Ss,
  get defaultCrawlMaxQueue() {
    return Lt;
  },
  ensureSlug: Fr,
  fetchCache: wt,
  get fetchMarkdown() {
    return Se;
  },
  getLanguages: ks,
  get homePage() {
    return it;
  },
  initSlugWorker: Cn,
  isExternalLink: Cs,
  isExternalLinkWithBase: Rt,
  listPathsFetched: Zt,
  listSlugCache: mt,
  mdToSlug: q,
  get notFoundPage() {
    return at;
  },
  removeSlugResolver: Es,
  resolveSlugPath: Tt,
  get searchIndex() {
    return De;
  },
  setContentBase: Gt,
  setDefaultCrawlMaxQueue: Ps,
  setFetchMarkdown: _s,
  setHomePage: As,
  setLanguages: Nr,
  setNotFoundPage: bn,
  setSkipRootReadme: ys,
  get skipRootReadme() {
    return Ln;
  },
  slugResolvers: Jt,
  slugToMd: Y,
  slugify: ie,
  unescapeMarkdown: Ht
}, Symbol.toStringTag, { value: "Module" }));
let Wr = 100;
function cr(t) {
  Wr = t;
}
let bt = 300 * 1e3;
function ur(t) {
  bt = t;
}
const Me = /* @__PURE__ */ new Map();
function Is(t) {
  if (!Me.has(t)) return;
  const e = Me.get(t), n = Date.now();
  if (e.ts + bt < n) {
    Me.delete(t);
    return;
  }
  return Me.delete(t), Me.set(t, e), e.value;
}
function Bs(t, e) {
  if (hr(), hr(), Me.delete(t), Me.set(t, { value: e, ts: Date.now() }), Me.size > Wr) {
    const n = Me.keys().next().value;
    n !== void 0 && Me.delete(n);
  }
}
function hr() {
  if (!bt || bt <= 0) return;
  const t = Date.now();
  for (const [e, n] of Me.entries())
    n.ts + bt < t && Me.delete(e);
}
async function zs(t, e) {
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
          const l = new URL(e), u = Et(l.pathname);
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
      const i = await Se(r, e);
      if (!i || !i.raw) continue;
      const a = (i.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const c = (a[1] || "").trim();
        if (c && ie(c) === t)
          return r;
      }
    } catch (i) {
      console.warn("[router] fetchMarkdown during index discovery failed", i);
    }
  return null;
}
function Ns(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const n = decodeURIComponent(String(t || ""));
      if (Y.has(n)) {
        const s = Tt(n) || Y.get(n);
        s && (/\.(md|html?)$/i.test(s) ? /index\.html$/i.test(s) || e.push(s) : (e.push(s), e.push(s + ".html")));
      } else {
        if (Ne && Ne.size)
          for (const s of Ne) {
            const r = s.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ie(r) === n && !/index\.html$/i.test(s)) {
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
async function Os(t, e) {
  const n = t || "", s = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let r = t || "", i = null;
  if (r && String(r).includes("::")) {
    const d = String(r).split("::", 2);
    r = d[0], i = d[1] || null;
  }
  const c = `${t}|||${typeof fs < "u" && Qe ? Qe : ""}`, o = Is(c);
  if (o)
    r = o.resolved, i = o.anchor || i;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let d = decodeURIComponent(String(r || ""));
      if (d && typeof d == "string" && (d = he(d), d = At(d)), Y.has(d))
        r = Tt(d) || Y.get(d);
      else {
        let m = await zs(d, e);
        if (m)
          r = m;
        else if (Tn._refreshed && Ne && Ne.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await Fr(d, e);
          w && (r = w);
        }
      }
    }
    Bs(c, { resolved: r, anchor: i });
  }
  !i && s && (i = s);
  const l = Ns(r), u = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (u && l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 1 && /index\.html$/i.test(l[0]) && !u && !Y.has(r) && !Y.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const d of l)
    if (d)
      try {
        const m = he(d);
        h = await Se(m, e), f = m;
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
            const w = await m.text(), x = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", k = (w || "").toLowerCase(), C = x && x.indexOf && x.indexOf("text/html") !== -1 || k.indexOf("<!doctype") !== -1 || k.indexOf("<html") !== -1;
            if (C || console.warn("[router] absolute fetch returned non-HTML", { abs: d, contentType: x, snippet: k.slice(0, 200) }), C)
              try {
                const I = d, M = new URL(".", I).toString();
                try {
                  const N = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (N) {
                    const K = N.parseFromString(w || "", "text/html"), V = (O, A) => {
                      try {
                        const L = A.getAttribute(O) || "";
                        if (!L || /^(https?:)?\/\//i.test(L) || L.startsWith("/") || L.startsWith("#")) return;
                        try {
                          const b = new URL(L, I).toString();
                          A.setAttribute(O, b);
                        } catch (b) {
                          console.warn("[router] rewrite attribute failed", O, b);
                        }
                      } catch (L) {
                        console.warn("[router] rewrite helper failed", L);
                      }
                    }, se = K.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), j = [];
                    for (const O of Array.from(se || []))
                      try {
                        const A = O.tagName ? O.tagName.toLowerCase() : "";
                        if (A === "a") continue;
                        if (O.hasAttribute("src")) {
                          const L = O.getAttribute("src");
                          V("src", O);
                          const b = O.getAttribute("src");
                          L !== b && j.push({ attr: "src", tag: A, before: L, after: b });
                        }
                        if (O.hasAttribute("href") && A === "link") {
                          const L = O.getAttribute("href");
                          V("href", O);
                          const b = O.getAttribute("href");
                          L !== b && j.push({ attr: "href", tag: A, before: L, after: b });
                        }
                        if (O.hasAttribute("href") && A !== "link") {
                          const L = O.getAttribute("href");
                          V("href", O);
                          const b = O.getAttribute("href");
                          L !== b && j.push({ attr: "href", tag: A, before: L, after: b });
                        }
                        if (O.hasAttribute("xlink:href")) {
                          const L = O.getAttribute("xlink:href");
                          V("xlink:href", O);
                          const b = O.getAttribute("xlink:href");
                          L !== b && j.push({ attr: "xlink:href", tag: A, before: L, after: b });
                        }
                        if (O.hasAttribute("poster")) {
                          const L = O.getAttribute("poster");
                          V("poster", O);
                          const b = O.getAttribute("poster");
                          L !== b && j.push({ attr: "poster", tag: A, before: L, after: b });
                        }
                        if (O.hasAttribute("srcset")) {
                          const v = (O.getAttribute("srcset") || "").split(",").map((R) => R.trim()).filter(Boolean).map((R) => {
                            const [y, U] = R.split(/\s+/, 2);
                            if (!y || /^(https?:)?\/\//i.test(y) || y.startsWith("/")) return R;
                            try {
                              const Z = new URL(y, I).toString();
                              return U ? `${Z} ${U}` : Z;
                            } catch {
                              return R;
                            }
                          }).join(", ");
                          O.setAttribute("srcset", v);
                        }
                      } catch {
                      }
                    const Q = K.documentElement && K.documentElement.outerHTML ? K.documentElement.outerHTML : w;
                    try {
                      j && j.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: j });
                    } catch {
                    }
                    return { data: { raw: Q, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
                  }
                } catch {
                }
                let B = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? B = w.replace(/(<head[^>]*>)/i, `$1<base href="${M}">`) : B = `<base href="${M}">` + w), { data: { raw: B, isHtml: !0 }, pagePath: String(n || ""), anchor: i };
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
var et = _n();
function Zr(t) {
  et = t;
}
var Ve = { exec: () => null };
function ne(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, i) => {
    let a = typeof i == "string" ? i : i.source;
    return a = a.replace(Ae.caret, "$1"), n = n.replace(r, a), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Ds = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ae = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Hs = /^(?:[ \t]*(?:\n|$))+/, Us = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, qs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ct = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, js = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, $n = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Gr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Qr = ne(Gr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Fs = ne(Gr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Pn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ws = /^[^\n]+/, In = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Zs = ne(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", In).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Gs = ne(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, $n).getRegex(), en = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Bn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Qs = ne("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Bn).replace("tag", en).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Xr = ne(Pn).replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", en).getRegex(), Xs = ne(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Xr).getRegex(), zn = { blockquote: Xs, code: Us, def: Zs, fences: qs, heading: js, hr: Ct, html: Qs, lheading: Qr, list: Gs, newline: Hs, paragraph: Xr, table: Ve, text: Ws }, dr = ne("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", en).getRegex(), Ks = { ...zn, lheading: Fs, table: dr, paragraph: ne(Pn).replace("hr", Ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", en).getRegex() }, Ys = { ...zn, html: ne(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Bn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ve, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ne(Pn).replace("hr", Ct).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Qr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Vs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Js = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Kr = /^( {2,}|\\)\n(?!\s*$)/, ea = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, tn = /[\p{P}\p{S}]/u, Nn = /[\s\p{P}\p{S}]/u, Yr = /[^\s\p{P}\p{S}]/u, ta = ne(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Nn).getRegex(), Vr = /(?!~)[\p{P}\p{S}]/u, na = /(?!~)[\s\p{P}\p{S}]/u, ra = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = /(?![*_])[\p{P}\p{S}]/u, ia = /(?![*_])[\s\p{P}\p{S}]/u, sa = /(?:[^\s\p{P}\p{S}]|[*_])/u, aa = ne(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ds ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ei = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, oa = ne(ei, "u").replace(/punct/g, tn).getRegex(), la = ne(ei, "u").replace(/punct/g, Vr).getRegex(), ti = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ca = ne(ti, "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, Nn).replace(/punct/g, tn).getRegex(), ua = ne(ti, "gu").replace(/notPunctSpace/g, ra).replace(/punctSpace/g, na).replace(/punct/g, Vr).getRegex(), ha = ne("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, Nn).replace(/punct/g, tn).getRegex(), da = ne(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Jr).getRegex(), pa = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", fa = ne(pa, "gu").replace(/notPunctSpace/g, sa).replace(/punctSpace/g, ia).replace(/punct/g, Jr).getRegex(), ga = ne(/\\(punct)/, "gu").replace(/punct/g, tn).getRegex(), ma = ne(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), wa = ne(Bn).replace("(?:-->|$)", "-->").getRegex(), ba = ne("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", wa).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Xt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ya = ne(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Xt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ni = ne(/^!?\[(label)\]\[(ref)\]/).replace("label", Xt).replace("ref", In).getRegex(), ri = ne(/^!?\[(ref)\](?:\[\])?/).replace("ref", In).getRegex(), ka = ne("reflink|nolink(?!\\()", "g").replace("reflink", ni).replace("nolink", ri).getRegex(), pr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, On = { _backpedal: Ve, anyPunctuation: ga, autolink: ma, blockSkip: aa, br: Kr, code: Js, del: Ve, delLDelim: Ve, delRDelim: Ve, emStrongLDelim: oa, emStrongRDelimAst: ca, emStrongRDelimUnd: ha, escape: Vs, link: ya, nolink: ri, punctuation: ta, reflink: ni, reflinkSearch: ka, tag: ba, text: ea, url: Ve }, xa = { ...On, link: ne(/^!?\[(label)\]\((.*?)\)/).replace("label", Xt).getRegex(), reflink: ne(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Xt).getRegex() }, yn = { ...On, emStrongRDelimAst: ua, emStrongLDelim: la, delLDelim: da, delRDelim: fa, url: ne(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", pr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ne(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", pr).getRegex() }, Sa = { ...yn, br: ne(Kr).replace("{2,}", "*").getRegex(), text: ne(yn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Dt = { normal: zn, gfm: Ks, pedantic: Ys }, ut = { normal: On, gfm: yn, breaks: Sa, pedantic: xa }, va = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, fr = (t) => va[t];
function ze(t, e) {
  if (e) {
    if (Ae.escapeTest.test(t)) return t.replace(Ae.escapeReplace, fr);
  } else if (Ae.escapeTestNoEncode.test(t)) return t.replace(Ae.escapeReplaceNoEncode, fr);
  return t;
}
function gr(t) {
  try {
    t = encodeURI(t).replace(Ae.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function mr(t, e) {
  let n = t.replace(Ae.findPipe, (i, a, c) => {
    let o = !1, l = a;
    for (; --l >= 0 && c[l] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), s = n.split(Ae.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(Ae.slashPipe, "|");
  return s;
}
function ht(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function Ea(t, e) {
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
function wr(t, e, n, s, r) {
  let i = e.href, a = e.title || null, c = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let o = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: c, tokens: s.inlineTokens(c) };
  return s.state.inLink = !1, o;
}
function Ra(t, e, n) {
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
var Kt = class {
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
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : ht(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = Ra(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = ht(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
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
      let n = ht(e[0], `
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
          let m = this.rules.other.nextBulletRegex(d), w = this.rules.other.hrRegex(d), x = this.rules.other.fencesBeginRegex(d), k = this.rules.other.headingBeginRegex(d), C = this.rules.other.htmlBeginRegex(d), I = this.rules.other.blockquoteBeginRegex(d);
          for (; t; ) {
            let M = t.split(`
`, 1)[0], B;
            if (f = M, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), B = f) : B = f.replace(this.rules.other.tabCharGlobal, "    "), x.test(f) || k.test(f) || C.test(f) || I.test(f) || m.test(f) || w.test(f)) break;
            if (B.search(this.rules.other.nonSpaceChar) >= d || !f.trim()) u += `
` + B.slice(d);
            else {
              if (p || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || x.test(h) || k.test(h) || w.test(h)) break;
              u += `
` + f;
            }
            p = !f.trim(), l += M + `
`, t = t.substring(M.length + 1), h = B.slice(d);
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
    let n = mr(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < n.length; a++) i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] });
      for (let a of r) i.rows.push(mr(a, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
        let i = ht(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = Ea(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), wr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return wr(n, r, n[0], this.lexer, this.rules);
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
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || et, this.options.tokenizer = this.options.tokenizer || new Kt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Ae, block: Dt.normal, inline: ut.normal };
    this.options.pedantic ? (n.block = Dt.pedantic, n.inline = ut.pedantic) : this.options.gfm && (n.block = Dt.gfm, this.options.breaks ? n.inline = ut.breaks : n.inline = ut.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Dt, inline: ut };
  }
  static lex(e, n) {
    return new kn(n).lex(e);
  }
  static lexInline(e, n) {
    return new kn(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Ae.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(Ae.tabCharGlobal, "    ").replace(Ae.spaceLine, "")); e; ) {
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
}, Yt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || et;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(Ae.notSpaceStart)?.[0], r = t.replace(Ae.endingNewline, "") + `
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
    let s = this.parser.parseInline(n), r = gr(t);
    if (r === null) return s;
    t = r;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + ze(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = gr(t);
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
    this.options = e || et, this.options.renderer = this.options.renderer || new Yt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Dn();
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
}, Ta = class {
  defaults = _n();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Pe;
  Renderer = Yt;
  TextRenderer = Dn;
  Lexer = $e;
  Tokenizer = Kt;
  Hooks = pt;
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
        let r = this.defaults.renderer || new Yt(this.defaults);
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
        let r = this.defaults.tokenizer || new Kt(this.defaults);
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
        let r = this.defaults.hooks || new pt();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let a = i, c = n.hooks[a], o = r[a];
          pt.passThroughHooks.has(i) ? r[a] = (l) => {
            if (this.defaults.async && pt.passThroughHooksRespectAsync.has(i)) return (async () => {
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
}, Je = new Ta();
function re(t, e) {
  return Je.parse(t, e);
}
re.options = re.setOptions = function(t) {
  return Je.setOptions(t), re.defaults = Je.defaults, Zr(re.defaults), re;
};
re.getDefaults = _n;
re.defaults = et;
re.use = function(...t) {
  return Je.use(...t), re.defaults = Je.defaults, Zr(re.defaults), re;
};
re.walkTokens = function(t, e) {
  return Je.walkTokens(t, e);
};
re.parseInline = Je.parseInline;
re.Parser = Pe;
re.parser = Pe.parse;
re.Renderer = Yt;
re.TextRenderer = Dn;
re.Lexer = $e;
re.lexer = $e.lex;
re.Tokenizer = Kt;
re.Hooks = pt;
re.parse = re;
re.options;
re.setOptions;
re.use;
re.walkTokens;
re.parseInline;
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
function La(t) {
  let e;
  try {
    if (e = br && (self.URL || self.webkitURL).createObjectURL(br), !e) throw "";
    const n = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), n;
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
function Ca(t) {
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
const si = Br(() => new La(), "markdown"), yr = typeof DOMParser < "u" ? new DOMParser() : null;
function Sn() {
  return si.get();
}
function Ma(t) {
  return si.send(t, 1e3);
}
const Xe = [];
function vn(t) {
  if (t && typeof t == "object") {
    Xe.push(t);
    try {
      re.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function _a(t) {
  Xe.length = 0, Array.isArray(t) && Xe.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Xe.forEach((e) => re.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Vt(t) {
  if (Sn && Sn())
    try {
      const i = await Ma({ type: "render", md: t });
      if (i && i.html !== void 0)
        try {
          const c = (yr || new DOMParser()).parseFromString(i.html, "text/html"), o = c.querySelectorAll("h1,h2,h3,h4,h5,h6");
          o.forEach((h) => {
            h.id || (h.id = ie(h.textContent || ""));
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
                  } catch (x) {
                    console.warn("[markdown] set code class failed", x), f.className = d;
                  }
                else
                  try {
                    f.removeAttribute && f.removeAttribute("class");
                  } catch (x) {
                    console.warn("[markdown] remove code class failed", x), f.className = "";
                  }
                const m = d, w = m.match(/language-([a-zA-Z0-9_+-]+)/) || m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!w || !w[1])
                  try {
                    const x = f.textContent || "";
                    try {
                      if (ue && typeof ue.getLanguage == "function" && ue.getLanguage("plaintext")) {
                        const k = ue.highlight(x, { language: "plaintext" });
                        k && k.value && (f.innerHTML = k.value);
                      }
                    } catch {
                      try {
                        ue.highlightElement(f);
                      } catch (C) {
                        console.warn("[markdown] hljs.highlightElement failed", C);
                      }
                    }
                  } catch (x) {
                    console.warn("[markdown] code auto-detect failed", x);
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
  const { content: n, data: s } = Ca(t || "");
  if (re.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Xe && Xe.length)
    try {
      Xe.forEach((i) => re.use(i));
    } catch (i) {
      console.warn("[markdown] apply plugins failed", i);
    }
  let r = re.parse(n);
  try {
    const a = (yr || new DOMParser()).parseFromString(r, "text/html"), c = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    c.forEach((l) => {
      l.id || (l.id = ie(l.textContent || ""));
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
                if (ue && typeof ue.getLanguage == "function" && ue.getLanguage("plaintext")) {
                  const w = ue.highlight(m, { language: "plaintext" });
                  w && w.value && (u.innerHTML = w.value);
                }
              } catch {
                try {
                  ue.highlightElement(u);
                } catch (x) {
                  console.warn("[markdown] hljs.highlightElement failed", x);
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
function En(t, e) {
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
      if (Cr.has(c) || e && e.size && c.length < 3 && !e.has(c) && !(Te && Te[c] && e.has(Te[c]))) continue;
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
const $a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: vn,
  detectFenceLanguages: En,
  initRendererWorker: Sn,
  markdownPlugins: Xe,
  parseMarkdownToHtml: Vt,
  setMarkdownExtensions: _a
}, Symbol.toStringTag, { value: "Module" }));
function Pa(t, e) {
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
function Ia(t, e) {
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
function Ba(t, e, n = "") {
  const s = document.createElement("aside");
  s.className = "menu nimbi-toc-inner";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = t("onThisPage"), s.appendChild(r);
  const i = document.createElement("ul");
  return i.className = "menu-list", (e || []).forEach((a) => {
    try {
      if (!a || a.level === 1) return;
      const c = document.createElement("li"), o = document.createElement("a"), l = a.id || ie(a.text || "");
      o.textContent = a.text || "";
      try {
        const u = String(n || "").replace(/^[\.\/]+/, ""), h = u && q && q.has && q.has(u) ? q.get(u) : u;
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
function ai(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ie(n.textContent || ""));
  });
}
function za(t, e, n) {
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
function kr(t, e, n) {
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
let xr = "", dn = null, Sr = "";
async function oi(t, e, n) {
  try {
    const s = t.querySelectorAll("a");
    if (!s || !s.length) return;
    let r, i;
    if (e === xr && dn)
      r = dn, i = Sr;
    else {
      try {
        r = new URL(e, location.href), i = Et(r.pathname);
      } catch {
        try {
          r = new URL(e, location.href), i = Et(r.pathname);
        } catch {
          r = null, i = "/";
        }
      }
      xr = e, dn = r, Sr = i;
    }
    const a = /* @__PURE__ */ new Set(), c = [], o = /* @__PURE__ */ new Set(), l = [];
    for (const u of Array.from(s))
      try {
        const h = u.getAttribute("href") || "";
        if (!h || zr(h)) continue;
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
            w = he(w), c.push({ node: u, mdPathRaw: p, frag: d, rel: w }), q.has(w) || a.add(w);
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
              let x = null;
              try {
                if (q && q.has && q.has(w))
                  x = q.get(w);
                else
                  try {
                    const k = String(w || "").replace(/^.*\//, "");
                    k && q.has && q.has(k) && (x = q.get(k));
                  } catch (k) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", k);
                  }
              } catch (k) {
                console.warn("[htmlBuilder] mdToSlug access check failed", k);
              }
              if (!x)
                try {
                  const k = String(w || "").replace(/^.*\//, "");
                  for (const [C, I] of Y || [])
                    if (I === w || I === k) {
                      x = C;
                      break;
                    }
                } catch {
                }
              x ? u.setAttribute("href", `?page=${encodeURIComponent(x)}`) : (o.add(w), l.push({ node: u, rel: w }));
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
          if (p && Y.has(p)) {
            try {
              const d = Y.get(p);
              if (d)
                try {
                  q.set(d, p);
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
        const h = await Se(u, e);
        if (h && h.raw) {
          const f = (h.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = ie(f[1].trim());
            if (p)
              try {
                Y.set(p, u), q.set(u, p);
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
        const h = await Se(u, e);
        if (h && h.raw)
          try {
            const p = (Hn || new DOMParser()).parseFromString(h.raw, "text/html"), d = p.querySelector("title"), m = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
            if (w) {
              const x = ie(w);
              if (x)
                try {
                  Y.set(x, u), q.set(u, x);
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
    for (const u of c) {
      const { node: h, frag: f, rel: p } = u;
      let d = null;
      try {
        q.has(p) && (d = q.get(p));
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug access failed", m);
      }
      d ? f ? h.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(d)}`) : f ? h.setAttribute("href", `?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`) : h.setAttribute("href", `?page=${encodeURIComponent(p)}`);
    }
    for (const u of l) {
      const { node: h, rel: f } = u;
      let p = null;
      try {
        q.has(f) && (p = q.get(f));
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", d);
      }
      if (!p)
        try {
          const d = String(f || "").replace(/^.*\//, "");
          q.has(d) && (p = q.get(d));
        } catch (d) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", d);
        }
      p ? h.setAttribute("href", `?page=${encodeURIComponent(p)}`) : h.setAttribute("href", `?page=${encodeURIComponent(f)}`);
    }
  } catch (s) {
    console.warn("[htmlBuilder] rewriteAnchors failed", s);
  }
}
function Na(t, e, n, s) {
  const r = e.querySelector("h1"), i = r ? (r.textContent || "").trim() : "";
  let a = "";
  try {
    i && (a = ie(i)), !a && t && t.meta && t.meta.title && (a = ie(t.meta.title)), !a && n && (a = ie(String(n))), a || (a = "_home");
    try {
      n && (Y.set(a, n), q.set(n, a));
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
async function Oa(t, e) {
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
        if (q && q.has && q.has(p)) continue;
      } catch (d) {
        console.warn("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const m of Y.values())
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
      const l = await Se(o, e);
      if (l && l.raw)
        try {
          const h = (Hn || new DOMParser()).parseFromString(l.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const m = ie(d);
            if (m)
              try {
                Y.set(m, o), q.set(o, m);
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
async function Da(t, e) {
  if (!t || !t.length) return;
  const n = [], s = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const i = new URL(e, typeof location < "u" ? location.href : "http://localhost/");
    r = Et(i.pathname);
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
            l = Pa(o, e);
          } catch (h) {
            l = o, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const u = l && r && l.startsWith(r) ? l.slice(r.length) : String(l || "").replace(/^\//, "");
          n.push({ rel: u }), q.has(u) || s.add(u);
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
      if (c && Y.has(c)) {
        try {
          const o = Y.get(c);
          o && q.set(o, c);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await Se(i, e);
      if (a && a.raw) {
        const c = (a.raw || "").match(/^#\s+(.+)$/m);
        if (c && c[1]) {
          const o = ie(c[1].trim());
          if (o)
            try {
              Y.set(o, i), q.set(i, o);
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
    ai(n);
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
          const l = (o[1] || "").toLowerCase(), u = J.size && (J.get(l) || J.get(String(l).toLowerCase())) || l;
          try {
            (async () => {
              try {
                await vt(u);
              } catch (h) {
                console.warn("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (ue && typeof ue.getLanguage == "function" && ue.getLanguage("plaintext")) {
              const l = ue.highlight ? ue.highlight(a.textContent || "", { language: "plaintext" }) : null;
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
async function Ha(t) {
  const e = En ? En(t || "", J) : /* @__PURE__ */ new Set(), n = new Set(e), s = [];
  for (const r of n)
    try {
      const i = J.size && (J.get(r) || J.get(String(r).toLowerCase())) || r;
      try {
        s.push(vt(i));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(r) !== String(i))
        try {
          s.push(vt(r));
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
async function Ua(t) {
  if (await Ha(t), Vt) {
    const e = await Vt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function qa(t, e, n, s, r) {
  let i = null;
  if (e.isHtml)
    try {
      const h = typeof DOMParser < "u" ? new DOMParser() : null;
      if (h) {
        const f = h.parseFromString(e.raw || "", "text/html");
        try {
          kr(f.body, n, r);
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
    i = await Ua(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = i.html;
  try {
    kr(a, n, r);
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
    us(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  za(a, n, r);
  const { topH1: c, h1Text: o, slugKey: l } = Na(i, a, n, s);
  try {
    await ja(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await oi(a, r, n);
  }
  const u = Ba(t, i.toc, n);
  return { article: a, parsed: i, toc: u, topH1: c, h1Text: o, slugKey: l };
}
function vr(t, e, n) {
  t && (t.innerHTML = "");
  const s = document.createElement("article");
  s.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = e && e("notFound") || "Page not found";
  const i = document.createElement("p");
  i.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", s.appendChild(r), s.appendChild(i), t && t.appendChild && t.appendChild(s);
}
async function ja(t, e, n) {
  return oi(t, e, n);
}
function Fa(t) {
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
            An(a);
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
function An(t) {
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
function Wa(t, e, { mountOverlay: n = null, container: s = null, mountEl: r = null, navWrap: i = null, t: a = null } = {}) {
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
          _r(p);
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
          for (const x of w)
            x.target instanceof Element && (x.isIntersecting ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show")));
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
            const w = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, x = e.getBoundingClientRect();
            !(x.bottom < w.top || x.top > w.bottom) ? (p.classList.remove("show"), d && d.classList.remove("show")) : (p.classList.add("show"), d && d.classList.add("show"));
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
        } catch (x) {
          console.warn("[htmlBuilder] onScroll handler failed", x);
        }
      };
      Wt(() => m.addEventListener("scroll", w)), w();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
function Er(t, e) {
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
async function Za(t, e, n, s, r, i, a, c, o = "eager", l = 1, u = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, f = h ? h.parseFromString(n || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Wt(() => Oa(p, s)), await Wt(() => Da(p, s));
  let d = null, m = null, w = null;
  function x() {
    try {
      const A = document.querySelector(".navbar-burger"), L = A && A.dataset ? A.dataset.target : null, b = L ? document.getElementById(L) : null;
      A && A.classList.contains("is-active") && (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), b && b.classList.remove("is-active"));
    } catch (A) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", A);
    }
  }
  const k = () => d || (d = (async () => {
    try {
      const A = await Promise.resolve().then(() => qt), L = Er(A, "buildSearchIndexWorker"), b = Er(A, "buildSearchIndex");
      if (o === "lazy" && typeof L == "function")
        try {
          const v = await L(s, l, u);
          if (v && v.length) return v;
        } catch (v) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", v);
        }
      return typeof b == "function" ? await b(s, l, u) : [];
    } catch (A) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", A), [];
    } finally {
      if (m) {
        try {
          m.removeAttribute("disabled");
        } catch {
        }
        try {
          w && w.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), d.then((A) => {
    try {
      const L = String(m && m.value || "").trim().toLowerCase();
      if (!L || !Array.isArray(A) || !A.length) return;
      const b = A.filter((R) => R.title && R.title.toLowerCase().includes(L) || R.excerpt && R.excerpt.toLowerCase().includes(L));
      if (!b || !b.length) return;
      const v = document.getElementById("nimbi-search-results");
      if (!v) return;
      v.innerHTML = "", b.slice(0, 10).forEach((R) => {
        const y = document.createElement("div");
        if (y.className = "nimbi-search-result", R.parentTitle) {
          const Z = document.createElement("div");
          Z.textContent = R.parentTitle, Z.className = "nimbi-search-title nimbi-search-parent", y.appendChild(Z);
        }
        const U = document.createElement("a");
        U.className = "block", U.href = "?page=" + encodeURIComponent(R.slug), U.textContent = R.title, U.addEventListener("click", () => {
          try {
            v.style.display = "none";
          } catch {
          }
        }), y.appendChild(U), v.appendChild(y);
      });
      try {
        v.style.display = "block";
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), d), C = document.createElement("nav");
  C.className = "navbar", C.setAttribute("role", "navigation"), C.setAttribute("aria-label", "main navigation");
  const I = document.createElement("div");
  I.className = "navbar-brand";
  const M = p[0], B = document.createElement("a");
  if (B.className = "navbar-item", M) {
    const A = M.getAttribute("href") || "#";
    try {
      const b = new URL(A, location.href).searchParams.get("page");
      b ? B.href = "?page=" + encodeURIComponent(decodeURIComponent(b)) : (B.href = "?page=" + encodeURIComponent(r), B.textContent = i("home"));
    } catch {
      B.href = "?page=" + encodeURIComponent(r), B.textContent = i("home");
    }
  } else
    B.href = "?page=" + encodeURIComponent(r), B.textContent = i("home");
  I.appendChild(B), B.addEventListener("click", function(A) {
    const L = B.getAttribute("href") || "";
    if (L.startsWith("?page=")) {
      A.preventDefault();
      const b = new URL(L, location.href), v = b.searchParams.get("page"), R = b.hash ? b.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", "?page=" + encodeURIComponent(v) + (R ? "#" + encodeURIComponent(R) : ""));
      try {
        a();
      } catch (y) {
        console.warn("[nimbi-cms] renderByQuery failed", y);
      }
      try {
        x();
      } catch {
      }
    }
  });
  const N = document.createElement("a");
  N.className = "navbar-burger", N.setAttribute("role", "button"), N.setAttribute("aria-label", "menu"), N.setAttribute("aria-expanded", "false");
  const K = "nimbi-navbar-menu";
  N.dataset.target = K, N.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', I.appendChild(N);
  try {
    N.addEventListener("click", (A) => {
      try {
        const L = N.dataset && N.dataset.target ? N.dataset.target : null, b = L ? document.getElementById(L) : null;
        N.classList.contains("is-active") ? (N.classList.remove("is-active"), N.setAttribute("aria-expanded", "false"), b && b.classList.remove("is-active")) : (N.classList.add("is-active"), N.setAttribute("aria-expanded", "true"), b && b.classList.add("is-active"));
      } catch (L) {
        console.warn("[nimbi-cms] navbar burger toggle failed", L);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] burger event binding failed", A);
  }
  const V = document.createElement("div");
  V.className = "navbar-menu", V.id = K;
  const se = document.createElement("div");
  se.className = "navbar-start";
  let j, Q, O;
  if (!c)
    j = null, m = null, O = null;
  else {
    j = document.createElement("div"), j.className = "navbar-end", Q = document.createElement("div"), Q.className = "navbar-item", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = i("searchPlaceholder") || "", m.id = "nimbi-search", o === "eager" && (m.disabled = !0), w = document.createElement("div"), w.className = "control", o === "eager" && w.classList.add("is-loading"), w.appendChild(m), Q.appendChild(w), O = document.createElement("div"), O.id = "nimbi-search-results", O.className = "box", Q.appendChild(O), j.appendChild(Q);
    const A = (b) => {
      if (O.innerHTML = "", !b.length) {
        O.classList.remove("is-open");
        try {
          O.style.display = "none";
        } catch {
        }
        return;
      }
      b.forEach((v) => {
        const R = document.createElement("div");
        if (R.className = "nimbi-search-result", v.parentTitle) {
          const U = document.createElement("div");
          U.textContent = v.parentTitle, U.className = "nimbi-search-title nimbi-search-parent", R.appendChild(U);
        }
        const y = document.createElement("a");
        y.className = "block", y.href = "?page=" + encodeURIComponent(v.slug), y.textContent = v.title, y.addEventListener("click", () => {
          O.style.display = "none";
        }), R.appendChild(y), O.appendChild(R);
      });
      try {
        O.style.display = "block";
      } catch {
      }
      O.classList.add("is-open");
    }, L = (b, v) => {
      let R = null;
      return (...y) => {
        R && clearTimeout(R), R = setTimeout(() => b(...y), v);
      };
    };
    if (m) {
      const b = L(async () => {
        const v = document.querySelector("input#nimbi-search"), R = String(v && v.value || "").trim().toLowerCase();
        if (!R) {
          A([]);
          return;
        }
        try {
          await k();
          const U = (await d).filter((Z) => Z.title && Z.title.toLowerCase().includes(R) || Z.excerpt && Z.excerpt.toLowerCase().includes(R));
          A(U.slice(0, 10));
        } catch (y) {
          console.warn("[nimbi-cms] search input handler failed", y), A([]);
        }
      }, 50);
      try {
        m.addEventListener("input", b);
      } catch {
      }
      try {
        document.addEventListener("input", (v) => {
          try {
            v && v.target && v.target.id === "nimbi-search" && b(v);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        d = k();
      } catch (b) {
        console.warn("[nimbi-cms] eager search index init failed", b), d = Promise.resolve([]);
      }
      d.finally(() => {
        const b = document.querySelector("input#nimbi-search");
        if (b) {
          try {
            b.removeAttribute("disabled");
          } catch {
          }
          try {
            w && w.classList.remove("is-loading");
          } catch {
          }
        }
      });
    }
  }
  for (let A = 0; A < p.length; A++) {
    const L = p[A];
    if (A === 0) continue;
    const b = L.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(b) || b.endsWith(".md")) {
        const y = he(b).split(/::|#/, 2), U = y[0], Z = y[1];
        v.href = "?page=" + encodeURIComponent(U) + (Z ? "#" + encodeURIComponent(Z) : "");
      } else if (/\.html(?:$|[#?])/.test(b) || b.endsWith(".html")) {
        const y = he(b).split(/::|#/, 2);
        let U = y[0];
        U && !U.toLowerCase().endsWith(".html") && (U = U + ".html");
        const Z = y[1];
        try {
          const ge = await Se(U, s);
          if (ge && ge.raw)
            try {
              const ee = new DOMParser().parseFromString(ge.raw, "text/html"), oe = ee.querySelector("title"), me = ee.querySelector("h1"), Ue = oe && oe.textContent && oe.textContent.trim() ? oe.textContent.trim() : me && me.textContent ? me.textContent.trim() : null;
              if (Ue) {
                const qe = ie(Ue);
                if (qe) {
                  try {
                    Y.set(qe, U), q.set(U, qe);
                  } catch (Un) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Un);
                  }
                  v.href = "?page=" + encodeURIComponent(qe) + (Z ? "#" + encodeURIComponent(Z) : "");
                } else
                  v.href = "?page=" + encodeURIComponent(U) + (Z ? "#" + encodeURIComponent(Z) : "");
              } else
                v.href = "?page=" + encodeURIComponent(U) + (Z ? "#" + encodeURIComponent(Z) : "");
            } catch {
              v.href = "?page=" + encodeURIComponent(U) + (Z ? "#" + encodeURIComponent(Z) : "");
            }
          else
            v.href = b;
        } catch {
          v.href = b;
        }
      } else
        v.href = b;
    } catch (R) {
      console.warn("[nimbi-cms] nav item href parse failed", R), v.href = b;
    }
    try {
      const R = L.textContent && String(L.textContent).trim() ? String(L.textContent).trim() : null;
      if (R)
        try {
          const y = ie(R);
          if (y) {
            const U = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const ge = new URL(U, location.href).searchParams.get("page");
              if (ge) {
                const ke = decodeURIComponent(ge);
                try {
                  Y.set(y, ke), q.set(ke, y);
                } catch (ee) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", ee);
                }
              }
            } catch (Z) {
              console.warn("[nimbi-cms] nav slug mapping failed", Z);
            }
          }
        } catch (y) {
          console.warn("[nimbi-cms] nav slug mapping failed", y);
        }
    } catch (R) {
      console.warn("[nimbi-cms] nav slug mapping failed", R);
    }
    v.textContent = L.textContent || b, se.appendChild(v);
  }
  V.appendChild(se), j && V.appendChild(j), C.appendChild(I), C.appendChild(V), t.appendChild(C);
  try {
    const A = (L) => {
      try {
        const b = C && C.querySelector ? C.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!b || !b.classList.contains("is-active")) return;
        const v = b && b.closest ? b.closest(".navbar") : C;
        if (v && v.contains(L.target)) return;
        x();
      } catch {
      }
    };
    document.addEventListener("click", A, !0), document.addEventListener("touchstart", A, !0);
  } catch {
  }
  try {
    V.addEventListener("click", (A) => {
      const L = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!L) return;
      const b = L.getAttribute("href") || "";
      try {
        const v = new URL(b, location.href), R = v.searchParams.get("page"), y = v.hash ? v.hash.replace(/^#/, "") : null;
        if (R) {
          A.preventDefault(), history.pushState({ page: R }, "", "?page=" + encodeURIComponent(R) + (y ? "#" + encodeURIComponent(y) : ""));
          try {
            a();
          } catch (U) {
            console.warn("[nimbi-cms] renderByQuery failed", U);
          }
        }
      } catch (v) {
        console.warn("[nimbi-cms] navbar click handler failed", v);
      }
      try {
        const v = C && C.querySelector ? C.querySelector(".navbar-burger") : null, R = v && v.dataset ? v.dataset.target : null, y = R ? document.getElementById(R) : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), y && y.classList.remove("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] attach content click handler failed", A);
  }
  try {
    e.addEventListener("click", (A) => {
      const L = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!L) return;
      const b = L.getAttribute("href") || "";
      if (b && !zr(b))
        try {
          const v = new URL(b, location.href), R = v.searchParams.get("page"), y = v.hash ? v.hash.replace(/^#/, "") : null;
          if (R) {
            A.preventDefault(), history.pushState({ page: R }, "", "?page=" + encodeURIComponent(R) + (y ? "#" + encodeURIComponent(y) : ""));
            try {
              a();
            } catch (U) {
              console.warn("[nimbi-cms] renderByQuery failed", U);
            }
          }
        } catch (v) {
          console.warn("[nimbi-cms] container click URL parse failed", v);
        }
    });
  } catch (A) {
    console.warn("[nimbi-cms] build navbar failed", A);
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
var fn, Ar;
function Ga() {
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
var Qa = Ga();
const Xa = /* @__PURE__ */ Lr(Qa);
function Rr(t, e) {
  let n = document.querySelector(`meta[name="${t}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", t), document.head.appendChild(n)), n.setAttribute("content", e);
}
function rt(t, e, n) {
  let s = `meta[${t}="${e}"]`, r = document.querySelector(s);
  r || (r = document.createElement("meta"), r.setAttribute(t, e), document.head.appendChild(r)), r.setAttribute("content", n);
}
function Ka(t, e) {
  try {
    let n = document.querySelector(`link[rel="${t}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", t), document.head.appendChild(n)), n.setAttribute("href", e);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function Ya(t, e, n, s) {
  const r = e && String(e).trim() ? e : t.title || document.title;
  rt("property", "og:title", r);
  const i = s && String(s).trim() ? s : t.description || "";
  i && String(i).trim() && rt("property", "og:description", i), rt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = n || t.image;
  a && (rt("property", "og:image", a), rt("name", "twitter:image", a));
}
function Va(t, e, n, s, r = "") {
  const i = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = s && String(s).trim() ? s : i.description && String(i.description).trim() ? i.description : a && String(a).trim() ? a : "";
  c && String(c).trim() && Rr("description", c), Rr("robots", i.robots || "index,follow"), Ya(i, e, n, c);
}
function Ja() {
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
function eo(t, e, n, s, r, i = "") {
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
    u && Ka("canonical", u);
    try {
      rt("property", "og:url", u);
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
function to(t, e, n, s, r, i, a, c, o, l, u) {
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
        const x = c || (r && r.querySelector ? r.querySelector("h1") : null);
        if (x) {
          let k = x.nextElementSibling;
          const C = [];
          for (; k && !(k.tagName && k.tagName.toLowerCase() === "h2"); ) {
            const I = (k.textContent || "").trim();
            I && C.push(I), k = k.nextElementSibling;
          }
          C.length && (w = C.join(" ").replace(/\s+/g, " ").trim()), !w && o && (w = String(o).trim());
        }
      } catch (x) {
        console.warn("[seoManager] compute descOverride failed", x);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), d = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    try {
      Va(n, o, p, d);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      eo(n, l, o, p, d, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Ja();
    o ? m ? document.title = `${m} - ${o}` : document.title = `${e || "Site"} - ${o}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = r.querySelector(".nimbi-reading-time");
    if (h && h.remove(), o) {
      const f = Xa(u.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = r.querySelector("h1");
      m && m.insertAdjacentElement("afterend", d);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let Ee = null, D = null, be = 1, Ze = (t, e) => e, yt = 0, kt = 0, jt = () => {
}, ft = 0.25;
function no() {
  if (Ee && document.contains(Ee)) return Ee;
  Ee = null;
  const t = document.createElement("dialog");
  t.className = "nimbi-image-preview", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", Ze("imagePreviewTitle", "Image preview")), t.innerHTML = `
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
    if (!se()) return;
    b.preventDefault();
    const v = b.deltaY < 0 ? ft : -ft;
    He(be + v), l(), u();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      gn();
      return;
    }
    if (be > 1) {
      const v = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!v) return;
      const R = 40;
      switch (b.key) {
        case "ArrowUp":
          v.scrollTop -= R, b.preventDefault();
          break;
        case "ArrowDown":
          v.scrollTop += R, b.preventDefault();
          break;
        case "ArrowLeft":
          v.scrollLeft -= R, b.preventDefault();
          break;
        case "ArrowRight":
          v.scrollLeft += R, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), Ee = t, D = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), n = t.querySelector("[data-nimbi-preview-original]"), s = t.querySelector("[data-nimbi-preview-zoom-in]"), r = t.querySelector("[data-nimbi-preview-zoom-out]"), i = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), c = t.querySelector("[data-nimbi-preview-zoom-label]"), o = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function l() {
    c && (c.textContent = `${Math.round(be * 100)}%`);
  }
  const u = () => {
    o && (o.textContent = `${Math.round(be * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  jt = l, s.addEventListener("click", () => {
    He(be + ft), l(), u();
  }), r.addEventListener("click", () => {
    He(be - ft), l(), u();
  }), e.addEventListener("click", () => {
    xt(), l(), u();
  }), n.addEventListener("click", () => {
    He(1), l(), u();
  }), i.addEventListener("click", () => {
    xt(), l(), u();
  }), a.addEventListener("click", gn), e.title = Ze("imagePreviewFit", "Fit to screen"), n.title = Ze("imagePreviewOriginal", "Original size"), r.title = Ze("imagePreviewZoomOut", "Zoom out"), s.title = Ze("imagePreviewZoomIn", "Zoom in"), a.title = Ze("imagePreviewClose", "Close"), a.setAttribute("aria-label", Ze("imagePreviewClose", "Close"));
  let h = !1, f = 0, p = 0, d = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let x = 0, k = 1;
  const C = (b, v) => {
    const R = b.x - v.x, y = b.y - v.y;
    return Math.hypot(R, y);
  }, I = () => {
    if (h = !1, w.clear(), x = 0, D) {
      D.classList.add("is-panning"), D.classList.remove("is-grabbing");
      try {
        D.style.cursor = "all-scroll";
      } catch {
      }
    }
  };
  let M = 0, B = 0, N = 0;
  const K = (b) => {
    const v = Date.now(), R = v - M, y = b.clientX - B, U = b.clientY - N;
    M = v, B = b.clientX, N = b.clientY, R < 300 && Math.hypot(y, U) < 30 && (He(be > 1 ? 1 : 2), l(), b.preventDefault());
  }, V = (b) => {
    He(be > 1 ? 1 : 2), l(), b.preventDefault();
  }, se = () => Ee ? typeof Ee.open == "boolean" ? Ee.open : Ee.classList.contains("is-active") : !1, j = (b, v, R = 1) => {
    if (w.has(R) && w.set(R, { x: b, y: v }), w.size === 2) {
      const ge = Array.from(w.values()), ke = C(ge[0], ge[1]);
      if (x > 0) {
        const ee = ke / x;
        He(k * ee);
      }
      return;
    }
    if (!h) return;
    const y = D.closest(".nimbi-image-preview__image-wrapper");
    if (!y) return;
    const U = b - f, Z = v - p;
    y.scrollLeft = d - U, y.scrollTop = m - Z;
  }, Q = (b, v, R = 1) => {
    if (!se()) return;
    if (w.set(R, { x: b, y: v }), w.size === 2) {
      const Z = Array.from(w.values());
      x = C(Z[0], Z[1]), k = be;
      return;
    }
    const y = D.closest(".nimbi-image-preview__image-wrapper");
    if (!(!y || !(y.scrollWidth > y.clientWidth || y.scrollHeight > y.clientHeight))) {
      h = !0, f = b, p = v, d = y.scrollLeft, m = y.scrollTop, D.classList.add("is-panning"), D.classList.remove("is-grabbing");
      try {
        D.style.cursor = "all-scroll";
      } catch {
      }
      window.addEventListener("pointermove", O), window.addEventListener("pointerup", A), window.addEventListener("pointercancel", A);
    }
  }, O = (b) => {
    h && (b.preventDefault(), j(b.clientX, b.clientY, b.pointerId));
  }, A = () => {
    I(), window.removeEventListener("pointermove", O), window.removeEventListener("pointerup", A), window.removeEventListener("pointercancel", A);
  };
  D.addEventListener("pointerdown", (b) => {
    b.preventDefault(), Q(b.clientX, b.clientY, b.pointerId);
  }), D.addEventListener("pointermove", (b) => {
    (h || w.size === 2) && b.preventDefault(), j(b.clientX, b.clientY, b.pointerId);
  }), D.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && K(b), I();
  }), D.addEventListener("dblclick", V), D.addEventListener("pointercancel", I), D.addEventListener("mousedown", (b) => {
    b.preventDefault(), Q(b.clientX, b.clientY, 1);
  }), D.addEventListener("mousemove", (b) => {
    h && b.preventDefault(), j(b.clientX, b.clientY, 1);
  }), D.addEventListener("mouseup", (b) => {
    b.preventDefault(), I();
  });
  const L = t.querySelector(".nimbi-image-preview__image-wrapper");
  return L && (L.addEventListener("pointerdown", (b) => {
    if (Q(b.clientX, b.clientY, b.pointerId), b && b.target && b.target.tagName === "IMG")
      try {
        b.target.classList.add("is-grabbing"), b.target.style.cursor = "grabbing";
      } catch {
      }
  }), L.addEventListener("pointermove", (b) => {
    j(b.clientX, b.clientY, b.pointerId);
  }), L.addEventListener("pointerup", I), L.addEventListener("pointercancel", I), L.addEventListener("mousedown", (b) => {
    if (Q(b.clientX, b.clientY, 1), b && b.target && b.target.tagName === "IMG")
      try {
        b.target.classList.add("is-grabbing"), b.target.style.cursor = "grabbing";
      } catch {
      }
  }), L.addEventListener("mousemove", (b) => {
    j(b.clientX, b.clientY, 1);
  }), L.addEventListener("mouseup", I)), t;
}
function He(t) {
  if (!D) return;
  const e = Number(t);
  be = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const s = D.getBoundingClientRect(), r = yt || D.naturalWidth || D.width || s.width || 0, i = kt || D.naturalHeight || D.height || s.height || 0;
  if (r && i) {
    D.style.setProperty("--nimbi-preview-img-max-width", "none"), D.style.setProperty("--nimbi-preview-img-max-height", "none"), D.style.setProperty("--nimbi-preview-img-width", `${r * be}px`), D.style.setProperty("--nimbi-preview-img-height", `${i * be}px`), D.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      D.style.width = `${r * be}px`, D.style.height = `${i * be}px`, D.style.transform = "none";
    } catch {
    }
  } else {
    D.style.setProperty("--nimbi-preview-img-max-width", ""), D.style.setProperty("--nimbi-preview-img-max-height", ""), D.style.setProperty("--nimbi-preview-img-width", ""), D.style.setProperty("--nimbi-preview-img-height", ""), D.style.setProperty("--nimbi-preview-img-transform", `scale(${be})`);
    try {
      D.style.transform = `scale(${be})`;
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
function xt() {
  if (!D) return;
  const t = D.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const n = yt || D.naturalWidth || e.width, s = kt || D.naturalHeight || e.height;
  if (!n || !s) return;
  const r = e.width / n, i = e.height / s, a = Math.min(r, i, 1);
  He(Number.isFinite(a) ? a : 1);
}
function ro(t, e = "", n = 0, s = 0) {
  const r = no();
  be = 1, yt = n || 0, kt = s || 0, D.src = t, D.alt = e, D.style.transform = "scale(1)";
  const i = () => {
    yt = D.naturalWidth || D.width || 0, kt = D.naturalHeight || D.height || 0;
  };
  if (i(), xt(), jt(), requestAnimationFrame(() => {
    xt(), jt();
  }), !yt || !kt) {
    const a = () => {
      i(), requestAnimationFrame(() => {
        xt(), jt();
      }), D.removeEventListener("load", a);
    };
    D.addEventListener("load", a);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active"), r.focus();
}
function gn() {
  Ee && (typeof Ee.close == "function" && Ee.open && Ee.close(), Ee.classList.remove("is-active"));
}
function io(t, { t: e, zoomStep: n = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Ze = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, ft = n, t.addEventListener("click", (p) => {
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
      ro(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
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
    if (!d || d.tagName !== "IMG" || !Ee || !Ee.open) return;
    if (o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      const w = Array.from(o.values());
      l = h(w[0], w[1]), u = be;
      return;
    }
    const m = d.closest(".nimbi-image-preview__image-wrapper");
    m && (be <= 1 || (p.preventDefault(), s = !0, r = p.clientX, i = p.clientY, a = m.scrollLeft, c = m.scrollTop, d.setPointerCapture(p.pointerId), d.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (o.has(p.pointerId) && o.set(p.pointerId, { x: p.clientX, y: p.clientY }), o.size === 2) {
      p.preventDefault();
      const k = Array.from(o.values()), C = h(k[0], k[1]);
      if (l > 0) {
        const I = C / l;
        He(u * I);
      }
      return;
    }
    if (!s) return;
    p.preventDefault();
    const m = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = p.clientX - r, x = p.clientY - i;
    m.scrollLeft = a - w, m.scrollTop = c - x;
  });
  const f = () => {
    s = !1, o.clear(), l = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function so(t) {
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
  const h = Ia(i, [{ path: c, name: i("home"), isIndex: !0, children: [] }]);
  async function f(x, k) {
    let C, I, M;
    try {
      ({ data: C, pagePath: I, anchor: M } = await Os(x, a));
    } catch (Q) {
      console.error("[nimbi-cms] fetchPageData failed", Q), vr(e, i, Q);
      return;
    }
    !M && k && (M = k);
    try {
      An(null);
    } catch (Q) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", Q);
    }
    e.innerHTML = "";
    const { article: B, parsed: N, toc: K, topH1: V, h1Text: se, slugKey: j } = await qa(i, C, I, M, a);
    to(i, o, N, K, B, I, M, V, se, j, C), n.innerHTML = "", n.appendChild(K), Fa(K);
    try {
      await l("transformHtml", { article: B, parsed: N, toc: K, pagePath: I, anchor: M, topH1: V, h1Text: se, slugKey: j, data: C });
    } catch (Q) {
      console.warn("[nimbi-cms] transformHtml hooks failed", Q);
    }
    e.appendChild(B);
    try {
      io(B, { t: i });
    } catch (Q) {
      console.warn("[nimbi-cms] attachImagePreview failed", Q);
    }
    try {
      Ot(s, 100, !1), requestAnimationFrame(() => Ot(s, 100, !1)), setTimeout(() => Ot(s, 100, !1), 250);
    } catch (Q) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", Q);
    }
    An(M), Wa(B, V, { mountOverlay: r, container: s, navWrap: n, t: i });
    try {
      await l("onPageLoad", { data: C, pagePath: I, anchor: M, article: B, toc: K, topH1: V, h1Text: se, slugKey: j, contentWrap: e, navWrap: n });
    } catch (Q) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", Q);
    }
    u = I;
  }
  async function p() {
    let x = new URLSearchParams(location.search).get("page") || c;
    const k = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await f(x, k);
    } catch (C) {
      console.warn("[nimbi-cms] renderByQuery failed for", x, C), vr(e, i, C);
    }
  }
  window.addEventListener("popstate", p);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const x = s || document.querySelector(".nimbi-cms");
      if (!x) return;
      const k = {
        top: x.scrollTop || 0,
        left: x.scrollLeft || 0
      };
      sessionStorage.setItem(d(), JSON.stringify(k));
    } catch {
    }
  }, w = () => {
    try {
      const x = s || document.querySelector(".nimbi-cms");
      if (!x) return;
      const k = sessionStorage.getItem(d());
      if (!k) return;
      const C = JSON.parse(k);
      C && typeof C.top == "number" && x.scrollTo({ top: C.top, left: C.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (x) => {
    if (x.persisted)
      try {
        w(), Ot(s, 100, !1);
      } catch (k) {
        console.warn("[nimbi-cms] bfcache restore failed", k);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (x) {
      console.warn("[nimbi-cms] save scroll position failed", x);
    }
  }), { renderByQuery: p, siteNav: h, getCurrentPagePath: () => u };
}
function ao(t) {
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
function oo(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Tr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let mn = "";
async function bo(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = ao();
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
    availableLanguages: x,
    homePage: k = "_home.md",
    notFoundPage: C = "_404.md"
  } = n, { skipRootReadme: I = !1 } = n;
  if (n.contentPath != null && !oo(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (n.homePage != null && !Tr(n.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (n.notFoundPage != null && !Tr(n.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!s)
    throw new Error("el is required");
  let M = s;
  if (typeof s == "string") {
    if (M = document.querySelector(s), !M) throw new Error(`el selector "${s}" did not match any element`);
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
  if (w != null && (!Array.isArray(w) || w.some((y) => !y || typeof y != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (x != null && (!Array.isArray(x) || x.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (l != null && (!Array.isArray(l) || l.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (I != null && typeof I != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (C != null && (typeof C != "string" || !C.trim() || !/\.(md|html)$/.test(C)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const B = !!a;
  try {
    Promise.resolve().then(() => qt).then((y) => {
      try {
        y && typeof y.setSkipRootReadme == "function" && y.setSkipRootReadme(!!I);
      } catch (U) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", U);
      }
    }).catch((y) => {
    });
  } catch (y) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", y);
  }
  try {
    M.classList.add("nimbi-mount");
  } catch (y) {
    console.warn("[nimbi-cms] mount element setup failed", y);
  }
  const N = document.createElement("div");
  N.className = "nimbi-cms";
  const K = document.createElement("div");
  K.className = "columns";
  const V = document.createElement("div");
  V.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", V.setAttribute("role", "navigation");
  try {
    const y = typeof dt == "function" ? dt("navigation") : null;
    y && V.setAttribute("aria-label", y);
  } catch (y) {
    console.warn("[nimbi-cms] set nav aria-label failed", y);
  }
  K.appendChild(V);
  const se = document.createElement("div");
  se.className = "column nimbi-content", se.setAttribute("role", "main"), K.appendChild(se), N.appendChild(K);
  const j = V, Q = se;
  M.appendChild(N);
  let O = null;
  try {
    O = M.querySelector(".nimbi-overlay"), O || (O = document.createElement("div"), O.className = "nimbi-overlay", M.appendChild(O));
  } catch (y) {
    O = null, console.warn("[nimbi-cms] mount overlay setup failed", y);
  }
  const A = location.pathname || "/", L = A.endsWith("/") ? A : A.substring(0, A.lastIndexOf("/") + 1);
  try {
    mn = document.title || "";
  } catch (y) {
    mn = "", console.warn("[nimbi-cms] read initial document title failed", y);
  }
  let b = r;
  (b === "." || b === "./") && (b = ""), b.startsWith("./") && (b = b.slice(2)), b.startsWith("/") && (b = b.slice(1)), b !== "" && !b.endsWith("/") && (b = b + "/");
  const v = new URL(L + b, location.origin).toString();
  try {
    Promise.resolve().then(() => qt).then((y) => {
      try {
        y && typeof y.setHomePage == "function" && y.setHomePage(k);
      } catch (U) {
        console.warn("[nimbi-cms] setHomePage failed", U);
      }
    }).catch((y) => {
    });
  } catch (y) {
    console.warn("[nimbi-cms] setHomePage dynamic import failed", y);
  }
  p && await Pr(p, L), x && Array.isArray(x) && Nr(x), f && Ir(f);
  const R = so({ contentWrap: Q, navWrap: j, container: N, mountOverlay: O, t: dt, contentBase: v, homePage: k, initialDocumentTitle: mn, runHooks: ir });
  if (typeof d == "number" && d >= 0 && typeof ur == "function" && ur(d * 60 * 1e3), typeof m == "number" && m >= 0 && typeof cr == "function" && cr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((y) => {
        typeof y == "object" && $a && typeof vn == "function" && vn(y);
      });
    } catch (y) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", y);
    }
  try {
    typeof i == "number" && Promise.resolve().then(() => qt).then(({ setDefaultCrawlMaxQueue: y }) => {
      try {
        y(i);
      } catch (U) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", U);
      }
    });
  } catch (y) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", y);
  }
  try {
    Gt(v);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    bn(C);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    Gt(v);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    bn(C);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    await Se(k, v);
  } catch (y) {
    throw k === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${k} not found at ${v}${k}: ${y.message}`);
  }
  ps(u), await ds(h, L);
  try {
    const y = document.createElement("header");
    y.className = "nimbi-site-navbar", M.insertBefore(y, N);
    const U = await Se("_navigation.md", v), Z = await Vt(U.raw || ""), { navbar: ge, linkEls: ke } = await Za(y, N, Z.html || "", v, k, dt, R.renderByQuery, B, c, o, l);
    try {
      await ir("onNavBuild", { navWrap: j, navbar: ge, linkEls: ke, contentBase: v });
    } catch (ee) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", ee);
    }
    try {
      const ee = () => {
        const oe = y && y.getBoundingClientRect && Math.round(y.getBoundingClientRect().height) || y && y.offsetHeight || 0;
        if (oe > 0) {
          try {
            M.style.setProperty("--nimbi-site-navbar-height", `${oe}px`);
          } catch (me) {
            console.warn("[nimbi-cms] set CSS var failed", me);
          }
          try {
            N.style.paddingTop = "";
          } catch (me) {
            console.warn("[nimbi-cms] set container paddingTop failed", me);
          }
          try {
            const me = M && M.getBoundingClientRect && Math.round(M.getBoundingClientRect().height) || M && M.clientHeight || 0;
            if (me > 0) {
              const Ue = Math.max(0, me - oe);
              try {
                N.style.setProperty("--nimbi-cms-height", `${Ue}px`);
              } catch (qe) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", qe);
              }
            } else
              try {
                N.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
              } catch (Ue) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ue);
              }
          } catch (me) {
            console.warn("[nimbi-cms] compute container height failed", me);
          }
          try {
            y.style.setProperty("--nimbi-site-navbar-height", `${oe}px`);
          } catch (me) {
            console.warn("[nimbi-cms] set navbar CSS var failed", me);
          }
        }
      };
      ee();
      try {
        if (typeof ResizeObserver < "u") {
          const oe = new ResizeObserver(() => ee());
          try {
            oe.observe(y);
          } catch (me) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", me);
          }
        }
      } catch (oe) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", oe);
      }
    } catch (ee) {
      console.warn("[nimbi-cms] compute navbar height failed", ee);
    }
  } catch (y) {
    console.warn("[nimbi-cms] build navigation failed", y);
  }
  await R.renderByQuery();
  try {
    Promise.resolve().then(() => co).then(({ getVersion: y }) => {
      typeof y == "function" && y().then((U) => {
        try {
          const Z = U || "0.0.0";
          try {
            const ge = (ke) => {
              const ee = document.createElement("a");
              ee.className = "nimbi-version-label tag is-small", ee.textContent = `Ninbi CMS v. ${Z}`, ee.href = ke || "#", ee.target = "_blank", ee.rel = "noopener noreferrer nofollow", ee.setAttribute("aria-label", `Ninbi CMS version ${Z}`);
              try {
                _r(ee);
              } catch {
              }
              try {
                M.appendChild(ee);
              } catch (oe) {
                console.warn("[nimbi-cms] append version label failed", oe);
              }
            };
            (async () => {
              try {
                const ke = await Promise.resolve().then(() => xi).catch(() => null), ee = ke && (ke.default || ke);
                let oe = null;
                ee && (ee.homepage && typeof ee.homepage == "string" ? oe = ee.homepage : ee.repository && (typeof ee.repository == "string" ? oe = ee.repository : ee.repository.url && typeof ee.repository.url == "string" && (oe = ee.repository.url)));
                try {
                  oe && new URL(oe);
                } catch {
                  oe = null;
                }
                ge(oe || "#");
              } catch {
                ge("#");
              }
            })();
          } catch (ge) {
            console.warn("[nimbi-cms] building version label failed", ge);
          }
        } catch (Z) {
          console.warn("[nimbi-cms] building version label failed", Z);
        }
      }).catch((U) => {
        console.warn("[nimbi-cms] getVersion() failed", U);
      });
    }).catch((y) => {
      console.warn("[nimbi-cms] import version module failed", y);
    });
  } catch (y) {
    console.warn("[nimbi-cms] version label setup failed", y);
  }
}
async function lo() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => xi);
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
const co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: lo
}, Symbol.toStringTag, { value: "Module" })), li = "nimbi-cms", ci = "0.1.0", ui = { type: "git", url: "git+https://github.com/AbelVM/nimbiCMS.git" }, hi = "https://abelvm.github.io/nimbiCMS/", di = "module", pi = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, fi = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, gi = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, mi = "dist/nimbi-cms.cjs.js", wi = "dist/nimbi-cms.es.js", bi = "src/index.d.ts", yi = "dist/nimbi-cms.js", ki = ["dist", "src/index.d.ts"], uo = {
  name: li,
  version: ci,
  repository: ui,
  homepage: hi,
  private: !0,
  type: di,
  scripts: pi,
  dependencies: fi,
  devDependencies: gi,
  main: mi,
  module: wi,
  types: bi,
  unpkg: yi,
  files: ki
}, xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: uo,
  dependencies: fi,
  devDependencies: gi,
  files: ki,
  homepage: hi,
  main: mi,
  module: wi,
  name: li,
  repository: ui,
  scripts: pi,
  type: di,
  types: bi,
  unpkg: yi,
  version: ci
}, Symbol.toStringTag, { value: "Module" }));
export {
  Cr as BAD_LANGUAGES,
  J as SUPPORTED_HLJS_MAP,
  go as _clearHooks,
  Rn as addHook,
  bo as default,
  ds as ensureBulma,
  lo as getVersion,
  Pr as loadL10nFile,
  Mr as loadSupportedLanguages,
  us as observeCodeBlocks,
  po as onNavBuild,
  ho as onPageLoad,
  vt as registerLanguage,
  ir as runHooks,
  mo as setHighlightTheme,
  Ir as setLang,
  ps as setStyle,
  wo as setThemeVars,
  dt as t,
  fo as transformHtml
};
