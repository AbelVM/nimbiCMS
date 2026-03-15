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
function ol(t) {
  Tn("onPageLoad", t);
}
function cl(t) {
  Tn("onNavBuild", t);
}
function ul(t) {
  Tn("transformHtml", t);
}
async function sr(t, e) {
  const r = xt[t] || [];
  for (const i of r)
    try {
      await i(e);
    } catch (n) {
      console.warn("[nimbi-cms] runHooks callback failed", n);
    }
}
function hl() {
  Object.keys(xt).forEach((t) => {
    xt[t].length = 0;
  });
}
function Tr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var cn, ir;
function ii() {
  if (ir) return cn;
  ir = 1;
  function t(g) {
    return g instanceof Map ? g.clear = g.delete = g.set = function() {
      throw new Error("map is read-only");
    } : g instanceof Set && (g.add = g.clear = g.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(g), Object.getOwnPropertyNames(g).forEach((S) => {
      const C = g[S], Z = typeof C;
      (Z === "object" || Z === "function") && !Object.isFrozen(C) && t(C);
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
  function i(g, ...S) {
    const C = /* @__PURE__ */ Object.create(null);
    for (const Z in g)
      C[Z] = g[Z];
    return S.forEach(function(Z) {
      for (const pe in Z)
        C[pe] = Z[pe];
    }), /** @type {T} */
    C;
  }
  const n = "</span>", s = (g) => !!g.scope, a = (g, { prefix: S }) => {
    if (g.startsWith("language:"))
      return g.replace("language:", "language-");
    if (g.includes(".")) {
      const C = g.split(".");
      return [
        `${S}${C.shift()}`,
        ...C.map((Z, pe) => `${Z}${"_".repeat(pe + 1)}`)
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
    constructor(S, C) {
      this.buffer = "", this.classPrefix = C.classPrefix, S.walk(this);
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
      if (!s(S)) return;
      const C = a(
        S.scope,
        { prefix: this.classPrefix }
      );
      this.span(C);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(S) {
      s(S) && (this.buffer += n);
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
      const C = l({ scope: S });
      this.add(C), this.stack.push(C);
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
    static _walk(S, C) {
      return typeof C == "string" ? S.addText(C) : C.children && (S.openNode(C), C.children.forEach((Z) => this._walk(S, Z)), S.closeNode(C)), S;
    }
    /**
     * @param {Node} node
     */
    static _collapse(S) {
      typeof S != "string" && S.children && (S.children.every((C) => typeof C == "string") ? S.children = [S.children.join("")] : S.children.forEach((C) => {
        o._collapse(C);
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
    __addSublanguage(S, C) {
      const Z = S.root;
      C && (Z.scope = `language:${C}`), this.add(Z);
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
    return g.map((C) => h(C)).join("");
  }
  function w(g) {
    const S = g[g.length - 1];
    return typeof S == "object" && S.constructor === Object ? (g.splice(g.length - 1, 1), S) : {};
  }
  function y(...g) {
    return "(" + (w(g).capture ? "" : "?:") + g.map((Z) => h(Z)).join("|") + ")";
  }
  function x(g) {
    return new RegExp(g.toString() + "|").exec("").length - 1;
  }
  function B(g, S) {
    const C = g && g.exec(S);
    return C && C.index === 0;
  }
  const I = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function A(g, { joinWith: S }) {
    let C = 0;
    return g.map((Z) => {
      C += 1;
      const pe = C;
      let fe = h(Z), N = "";
      for (; fe.length > 0; ) {
        const z = I.exec(fe);
        if (!z) {
          N += fe;
          break;
        }
        N += fe.substring(0, z.index), fe = fe.substring(z.index + z[0].length), z[0][0] === "\\" && z[1] ? N += "\\" + String(Number(z[1]) + pe) : (N += z[0], z[0] === "(" && C++);
      }
      return N;
    }).map((Z) => `(${Z})`).join(S);
  }
  const q = /\b\B/, O = "[a-zA-Z]\\w*", Q = "[a-zA-Z_]\\w*", V = "\\b\\d+(\\.\\d+)?", ne = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", P = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", $ = (g = {}) => {
    const S = /^#![ ]*\//;
    return g.binary && (g.begin = m(
      S,
      /.*\b/,
      g.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: S,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (C, Z) => {
        C.index !== 0 && Z.ignoreMatch();
      }
    }, g);
  }, L = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, v = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [L]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [L]
  }, E = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, M = function(g, S, C = {}) {
    const Z = i(
      {
        scope: "comment",
        begin: g,
        end: S,
        contains: []
      },
      C
    );
    Z.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const pe = y(
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
    return Z.contains.push(
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
          pe,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), Z;
  }, k = M("//", "$"), X = M("/\\*", "\\*/"), he = M("#", "$"), xe = {
    scope: "number",
    begin: V,
    relevance: 0
  }, be = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, j = {
    scope: "number",
    begin: P,
    relevance: 0
  }, ue = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      L,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [L]
      }
    ]
  }, se = {
    scope: "title",
    begin: O,
    relevance: 0
  }, _e = {
    scope: "title",
    begin: Q,
    relevance: 0
  }, $e = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Q,
    relevance: 0
  };
  var Ct = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: v,
    BACKSLASH_ESCAPE: L,
    BINARY_NUMBER_MODE: j,
    BINARY_NUMBER_RE: P,
    COMMENT: M,
    C_BLOCK_COMMENT_MODE: X,
    C_LINE_COMMENT_MODE: k,
    C_NUMBER_MODE: be,
    C_NUMBER_RE: ne,
    END_SAME_AS_BEGIN: function(g) {
      return Object.assign(
        g,
        {
          /** @type {ModeCallback} */
          "on:begin": (S, C) => {
            C.data._beginMatch = S[1];
          },
          /** @type {ModeCallback} */
          "on:end": (S, C) => {
            C.data._beginMatch !== S[1] && C.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: he,
    IDENT_RE: O,
    MATCH_NOTHING_RE: q,
    METHOD_GUARD: $e,
    NUMBER_MODE: xe,
    NUMBER_RE: V,
    PHRASAL_WORDS_MODE: E,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: ue,
    RE_STARTERS_RE: T,
    SHEBANG: $,
    TITLE_MODE: se,
    UNDERSCORE_IDENT_RE: Q,
    UNDERSCORE_TITLE_MODE: _e
  });
  function xs(g, S) {
    g.input[g.index - 1] === "." && S.ignoreMatch();
  }
  function Ss(g, S) {
    g.className !== void 0 && (g.scope = g.className, delete g.className);
  }
  function vs(g, S) {
    S && g.beginKeywords && (g.begin = "\\b(" + g.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", g.__beforeBegin = xs, g.keywords = g.keywords || g.beginKeywords, delete g.beginKeywords, g.relevance === void 0 && (g.relevance = 0));
  }
  function As(g, S) {
    Array.isArray(g.illegal) && (g.illegal = y(...g.illegal));
  }
  function Es(g, S) {
    if (g.match) {
      if (g.begin || g.end) throw new Error("begin & end are not supported with match");
      g.begin = g.match, delete g.match;
    }
  }
  function Rs(g, S) {
    g.relevance === void 0 && (g.relevance = 1);
  }
  const Ts = (g, S) => {
    if (!g.beforeMatch) return;
    if (g.starts) throw new Error("beforeMatch cannot be used with starts");
    const C = Object.assign({}, g);
    Object.keys(g).forEach((Z) => {
      delete g[Z];
    }), g.keywords = C.keywords, g.begin = m(C.beforeMatch, f(C.begin)), g.starts = {
      relevance: 0,
      contains: [
        Object.assign(C, { endsParent: !0 })
      ]
    }, g.relevance = 0, delete C.beforeMatch;
  }, Ls = [
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
  ], Cs = "keyword";
  function qn(g, S, C = Cs) {
    const Z = /* @__PURE__ */ Object.create(null);
    return typeof g == "string" ? pe(C, g.split(" ")) : Array.isArray(g) ? pe(C, g) : Object.keys(g).forEach(function(fe) {
      Object.assign(
        Z,
        qn(g[fe], S, fe)
      );
    }), Z;
    function pe(fe, N) {
      S && (N = N.map((z) => z.toLowerCase())), N.forEach(function(z) {
        const F = z.split("|");
        Z[F[0]] = [fe, _s(F[0], F[1])];
      });
    }
  }
  function _s(g, S) {
    return S ? Number(S) : Ms(g) ? 0 : 1;
  }
  function Ms(g) {
    return Ls.includes(g.toLowerCase());
  }
  const jn = {}, Ke = (g) => {
    console.error(g);
  }, Fn = (g, ...S) => {
    console.log(`WARN: ${g}`, ...S);
  }, tt = (g, S) => {
    jn[`${g}/${S}`] || (console.log(`Deprecated as of ${g}. ${S}`), jn[`${g}/${S}`] = !0);
  }, _t = new Error();
  function Wn(g, S, { key: C }) {
    let Z = 0;
    const pe = g[C], fe = {}, N = {};
    for (let z = 1; z <= S.length; z++)
      N[z + Z] = pe[z], fe[z + Z] = !0, Z += x(S[z - 1]);
    g[C] = N, g[C]._emit = fe, g[C]._multi = !0;
  }
  function $s(g) {
    if (Array.isArray(g.begin)) {
      if (g.skip || g.excludeBegin || g.returnBegin)
        throw Ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), _t;
      if (typeof g.beginScope != "object" || g.beginScope === null)
        throw Ke("beginScope must be object"), _t;
      Wn(g, g.begin, { key: "beginScope" }), g.begin = A(g.begin, { joinWith: "" });
    }
  }
  function Ps(g) {
    if (Array.isArray(g.end)) {
      if (g.skip || g.excludeEnd || g.returnEnd)
        throw Ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), _t;
      if (typeof g.endScope != "object" || g.endScope === null)
        throw Ke("endScope must be object"), _t;
      Wn(g, g.end, { key: "endScope" }), g.end = A(g.end, { joinWith: "" });
    }
  }
  function Is(g) {
    g.scope && typeof g.scope == "object" && g.scope !== null && (g.beginScope = g.scope, delete g.scope);
  }
  function zs(g) {
    Is(g), typeof g.beginScope == "string" && (g.beginScope = { _wrap: g.beginScope }), typeof g.endScope == "string" && (g.endScope = { _wrap: g.endScope }), $s(g), Ps(g);
  }
  function Bs(g) {
    function S(N, z) {
      return new RegExp(
        h(N),
        "m" + (g.case_insensitive ? "i" : "") + (g.unicodeRegex ? "u" : "") + (z ? "g" : "")
      );
    }
    class C {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(z, F) {
        F.position = this.position++, this.matchIndexes[this.matchAt] = F, this.regexes.push([F, z]), this.matchAt += x(z) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const z = this.regexes.map((F) => F[1]);
        this.matcherRe = S(A(z, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(z) {
        this.matcherRe.lastIndex = this.lastIndex;
        const F = this.matcherRe.exec(z);
        if (!F)
          return null;
        const we = F.findIndex((lt, nn) => nn > 0 && lt !== void 0), ge = this.matchIndexes[we];
        return F.splice(0, we), Object.assign(F, ge);
      }
    }
    class Z {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(z) {
        if (this.multiRegexes[z]) return this.multiRegexes[z];
        const F = new C();
        return this.rules.slice(z).forEach(([we, ge]) => F.addRule(we, ge)), F.compile(), this.multiRegexes[z] = F, F;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(z, F) {
        this.rules.push([z, F]), F.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(z) {
        const F = this.getMatcher(this.regexIndex);
        F.lastIndex = this.lastIndex;
        let we = F.exec(z);
        if (this.resumingScanAtSamePosition() && !(we && we.index === this.lastIndex)) {
          const ge = this.getMatcher(0);
          ge.lastIndex = this.lastIndex + 1, we = ge.exec(z);
        }
        return we && (this.regexIndex += we.position + 1, this.regexIndex === this.count && this.considerAll()), we;
      }
    }
    function pe(N) {
      const z = new Z();
      return N.contains.forEach((F) => z.addRule(F.begin, { rule: F, type: "begin" })), N.terminatorEnd && z.addRule(N.terminatorEnd, { type: "end" }), N.illegal && z.addRule(N.illegal, { type: "illegal" }), z;
    }
    function fe(N, z) {
      const F = (
        /** @type CompiledMode */
        N
      );
      if (N.isCompiled) return F;
      [
        Ss,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Es,
        zs,
        Ts
      ].forEach((ge) => ge(N, z)), g.compilerExtensions.forEach((ge) => ge(N, z)), N.__beforeBegin = null, [
        vs,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        As,
        // default to 1 relevance if not specified
        Rs
      ].forEach((ge) => ge(N, z)), N.isCompiled = !0;
      let we = null;
      return typeof N.keywords == "object" && N.keywords.$pattern && (N.keywords = Object.assign({}, N.keywords), we = N.keywords.$pattern, delete N.keywords.$pattern), we = we || /\w+/, N.keywords && (N.keywords = qn(N.keywords, g.case_insensitive)), F.keywordPatternRe = S(we, !0), z && (N.begin || (N.begin = /\B|\b/), F.beginRe = S(F.begin), !N.end && !N.endsWithParent && (N.end = /\B|\b/), N.end && (F.endRe = S(F.end)), F.terminatorEnd = h(F.end) || "", N.endsWithParent && z.terminatorEnd && (F.terminatorEnd += (N.end ? "|" : "") + z.terminatorEnd)), N.illegal && (F.illegalRe = S(
        /** @type {RegExp | string} */
        N.illegal
      )), N.contains || (N.contains = []), N.contains = [].concat(...N.contains.map(function(ge) {
        return Os(ge === "self" ? N : ge);
      })), N.contains.forEach(function(ge) {
        fe(
          /** @type Mode */
          ge,
          F
        );
      }), N.starts && fe(N.starts, z), F.matcher = pe(F), F;
    }
    if (g.compilerExtensions || (g.compilerExtensions = []), g.contains && g.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return g.classNameAliases = i(g.classNameAliases || {}), fe(
      /** @type Mode */
      g
    );
  }
  function Zn(g) {
    return g ? g.endsWithParent || Zn(g.starts) : !1;
  }
  function Os(g) {
    return g.variants && !g.cachedVariants && (g.cachedVariants = g.variants.map(function(S) {
      return i(g, { variants: null }, S);
    })), g.cachedVariants ? g.cachedVariants : Zn(g) ? i(g, { starts: g.starts ? i(g.starts) : null }) : Object.isFrozen(g) ? i(g) : g;
  }
  var Ns = "11.11.1";
  class Ds extends Error {
    constructor(S, C) {
      super(S), this.name = "HTMLInjectionError", this.html = C;
    }
  }
  const tn = r, Gn = i, Qn = /* @__PURE__ */ Symbol("nomatch"), Hs = 7, Xn = function(g) {
    const S = /* @__PURE__ */ Object.create(null), C = /* @__PURE__ */ Object.create(null), Z = [];
    let pe = !0;
    const fe = "Could not find the language '{}', did you forget to load/include a language module?", N = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
    function F(R) {
      return z.noHighlightRe.test(R);
    }
    function we(R) {
      let H = R.className + " ";
      H += R.parentNode ? R.parentNode.className : "";
      const ee = z.languageDetectRe.exec(H);
      if (ee) {
        const le = je(ee[1]);
        return le || (Fn(fe.replace("{}", ee[1])), Fn("Falling back to no-highlight mode for this block.", R)), le ? ee[1] : "no-highlight";
      }
      return H.split(/\s+/).find((le) => F(le) || je(le));
    }
    function ge(R, H, ee) {
      let le = "", me = "";
      typeof H == "object" ? (le = R, ee = H.ignoreIllegals, me = H.language) : (tt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), tt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), me = R, le = H), ee === void 0 && (ee = !0);
      const Pe = {
        code: le,
        language: me
      };
      $t("before:highlight", Pe);
      const Fe = Pe.result ? Pe.result : lt(Pe.language, Pe.code, ee);
      return Fe.code = Pe.code, $t("after:highlight", Fe), Fe;
    }
    function lt(R, H, ee, le) {
      const me = /* @__PURE__ */ Object.create(null);
      function Pe(_, D) {
        return _.keywords[D];
      }
      function Fe() {
        if (!G.keywords) {
          ye.addText(oe);
          return;
        }
        let _ = 0;
        G.keywordPatternRe.lastIndex = 0;
        let D = G.keywordPatternRe.exec(oe), K = "";
        for (; D; ) {
          K += oe.substring(_, D.index);
          const ae = Oe.case_insensitive ? D[0].toLowerCase() : D[0], Se = Pe(G, ae);
          if (Se) {
            const [He, ri] = Se;
            if (ye.addText(K), K = "", me[ae] = (me[ae] || 0) + 1, me[ae] <= Hs && (zt += ri), He.startsWith("_"))
              K += D[0];
            else {
              const si = Oe.classNameAliases[He] || He;
              Be(D[0], si);
            }
          } else
            K += D[0];
          _ = G.keywordPatternRe.lastIndex, D = G.keywordPatternRe.exec(oe);
        }
        K += oe.substring(_), ye.addText(K);
      }
      function Pt() {
        if (oe === "") return;
        let _ = null;
        if (typeof G.subLanguage == "string") {
          if (!S[G.subLanguage]) {
            ye.addText(oe);
            return;
          }
          _ = lt(G.subLanguage, oe, !0, rr[G.subLanguage]), rr[G.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = rn(oe, G.subLanguage.length ? G.subLanguage : null);
        G.relevance > 0 && (zt += _.relevance), ye.__addSublanguage(_._emitter, _.language);
      }
      function Re() {
        G.subLanguage != null ? Pt() : Fe(), oe = "";
      }
      function Be(_, D) {
        _ !== "" && (ye.startScope(D), ye.addText(_), ye.endScope());
      }
      function Jn(_, D) {
        let K = 1;
        const ae = D.length - 1;
        for (; K <= ae; ) {
          if (!_._emit[K]) {
            K++;
            continue;
          }
          const Se = Oe.classNameAliases[_[K]] || _[K], He = D[K];
          Se ? Be(He, Se) : (oe = He, Fe(), oe = ""), K++;
        }
      }
      function er(_, D) {
        return _.scope && typeof _.scope == "string" && ye.openNode(Oe.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (Be(oe, Oe.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), oe = "") : _.beginScope._multi && (Jn(_.beginScope, D), oe = "")), G = Object.create(_, { parent: { value: G } }), G;
      }
      function tr(_, D, K) {
        let ae = B(_.endRe, K);
        if (ae) {
          if (_["on:end"]) {
            const Se = new e(_);
            _["on:end"](D, Se), Se.isMatchIgnored && (ae = !1);
          }
          if (ae) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return tr(_.parent, D, K);
      }
      function Vs(_) {
        return G.matcher.regexIndex === 0 ? (oe += _[0], 1) : (on = !0, 0);
      }
      function Js(_) {
        const D = _[0], K = _.rule, ae = new e(K), Se = [K.__beforeBegin, K["on:begin"]];
        for (const He of Se)
          if (He && (He(_, ae), ae.isMatchIgnored))
            return Vs(D);
        return K.skip ? oe += D : (K.excludeBegin && (oe += D), Re(), !K.returnBegin && !K.excludeBegin && (oe = D)), er(K, _), K.returnBegin ? 0 : D.length;
      }
      function ei(_) {
        const D = _[0], K = H.substring(_.index), ae = tr(G, _, K);
        if (!ae)
          return Qn;
        const Se = G;
        G.endScope && G.endScope._wrap ? (Re(), Be(D, G.endScope._wrap)) : G.endScope && G.endScope._multi ? (Re(), Jn(G.endScope, _)) : Se.skip ? oe += D : (Se.returnEnd || Se.excludeEnd || (oe += D), Re(), Se.excludeEnd && (oe = D));
        do
          G.scope && ye.closeNode(), !G.skip && !G.subLanguage && (zt += G.relevance), G = G.parent;
        while (G !== ae.parent);
        return ae.starts && er(ae.starts, _), Se.returnEnd ? 0 : D.length;
      }
      function ti() {
        const _ = [];
        for (let D = G; D !== Oe; D = D.parent)
          D.scope && _.unshift(D.scope);
        _.forEach((D) => ye.openNode(D));
      }
      let It = {};
      function nr(_, D) {
        const K = D && D[0];
        if (oe += _, K == null)
          return Re(), 0;
        if (It.type === "begin" && D.type === "end" && It.index === D.index && K === "") {
          if (oe += H.slice(D.index, D.index + 1), !pe) {
            const ae = new Error(`0 width match regex (${R})`);
            throw ae.languageName = R, ae.badRule = It.rule, ae;
          }
          return 1;
        }
        if (It = D, D.type === "begin")
          return Js(D);
        if (D.type === "illegal" && !ee) {
          const ae = new Error('Illegal lexeme "' + K + '" for mode "' + (G.scope || "<unnamed>") + '"');
          throw ae.mode = G, ae;
        } else if (D.type === "end") {
          const ae = ei(D);
          if (ae !== Qn)
            return ae;
        }
        if (D.type === "illegal" && K === "")
          return oe += `
`, 1;
        if (ln > 1e5 && ln > D.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return oe += K, K.length;
      }
      const Oe = je(R);
      if (!Oe)
        throw Ke(fe.replace("{}", R)), new Error('Unknown language: "' + R + '"');
      const ni = Bs(Oe);
      let an = "", G = le || ni;
      const rr = {}, ye = new z.__emitter(z);
      ti();
      let oe = "", zt = 0, Ye = 0, ln = 0, on = !1;
      try {
        if (Oe.__emitTokens)
          Oe.__emitTokens(H, ye);
        else {
          for (G.matcher.considerAll(); ; ) {
            ln++, on ? on = !1 : G.matcher.considerAll(), G.matcher.lastIndex = Ye;
            const _ = G.matcher.exec(H);
            if (!_) break;
            const D = H.substring(Ye, _.index), K = nr(D, _);
            Ye = _.index + K;
          }
          nr(H.substring(Ye));
        }
        return ye.finalize(), an = ye.toHTML(), {
          language: R,
          value: an,
          relevance: zt,
          illegal: !1,
          _emitter: ye,
          _top: G
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
            _emitter: ye
          };
        if (pe)
          return {
            language: R,
            value: tn(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: ye,
            _top: G
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
      const ee = nn(R), le = H.filter(je).filter(Vn).map(
        (Re) => lt(Re, R, !1)
      );
      le.unshift(ee);
      const me = le.sort((Re, Be) => {
        if (Re.relevance !== Be.relevance) return Be.relevance - Re.relevance;
        if (Re.language && Be.language) {
          if (je(Re.language).supersetOf === Be.language)
            return 1;
          if (je(Be.language).supersetOf === Re.language)
            return -1;
        }
        return 0;
      }), [Pe, Fe] = me, Pt = Pe;
      return Pt.secondBest = Fe, Pt;
    }
    function Us(R, H, ee) {
      const le = H && C[H] || ee;
      R.classList.add("hljs"), R.classList.add(`language-${le}`);
    }
    function sn(R) {
      let H = null;
      const ee = we(R);
      if (F(ee)) return;
      if ($t(
        "before:highlightElement",
        { el: R, language: ee }
      ), R.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", R);
        return;
      }
      if (R.children.length > 0 && (z.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(R)), z.throwUnescapedHTML))
        throw new Ds(
          "One of your code blocks includes unescaped HTML.",
          R.innerHTML
        );
      H = R;
      const le = H.textContent, me = ee ? ge(le, { language: ee, ignoreIllegals: !0 }) : rn(le);
      R.innerHTML = me.value, R.dataset.highlighted = "yes", Us(R, ee, me.language), R.result = {
        language: me.language,
        // TODO: remove with version 11.0
        re: me.relevance,
        relevance: me.relevance
      }, me.secondBest && (R.secondBest = {
        language: me.secondBest.language,
        relevance: me.secondBest.relevance
      }), $t("after:highlightElement", { el: R, result: me, text: le });
    }
    function qs(R) {
      z = Gn(z, R);
    }
    const js = () => {
      Mt(), tt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Fs() {
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
    function Ws(R, H) {
      let ee = null;
      try {
        ee = H(g);
      } catch (le) {
        if (Ke("Language definition for '{}' could not be registered.".replace("{}", R)), pe)
          Ke(le);
        else
          throw le;
        ee = N;
      }
      ee.name || (ee.name = R), S[R] = ee, ee.rawDefinition = H.bind(null, g), ee.aliases && Yn(ee.aliases, { languageName: R });
    }
    function Zs(R) {
      delete S[R];
      for (const H of Object.keys(C))
        C[H] === R && delete C[H];
    }
    function Gs() {
      return Object.keys(S);
    }
    function je(R) {
      return R = (R || "").toLowerCase(), S[R] || S[C[R]];
    }
    function Yn(R, { languageName: H }) {
      typeof R == "string" && (R = [R]), R.forEach((ee) => {
        C[ee.toLowerCase()] = H;
      });
    }
    function Vn(R) {
      const H = je(R);
      return H && !H.disableAutodetect;
    }
    function Qs(R) {
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
    function Xs(R) {
      Qs(R), Z.push(R);
    }
    function Ks(R) {
      const H = Z.indexOf(R);
      H !== -1 && Z.splice(H, 1);
    }
    function $t(R, H) {
      const ee = R;
      Z.forEach(function(le) {
        le[ee] && le[ee](H);
      });
    }
    function Ys(R) {
      return tt("10.7.0", "highlightBlock will be removed entirely in v12.0"), tt("10.7.0", "Please use highlightElement now."), sn(R);
    }
    Object.assign(g, {
      highlight: ge,
      highlightAuto: rn,
      highlightAll: Mt,
      highlightElement: sn,
      // TODO: Remove with v12 API
      highlightBlock: Ys,
      configure: qs,
      initHighlighting: js,
      initHighlightingOnLoad: Fs,
      registerLanguage: Ws,
      unregisterLanguage: Zs,
      listLanguages: Gs,
      getLanguage: je,
      registerAliases: Yn,
      autoDetection: Vn,
      inherit: Gn,
      addPlugin: Xs,
      removePlugin: Ks
    }), g.debugMode = function() {
      pe = !1;
    }, g.safeMode = function() {
      pe = !0;
    }, g.versionString = Ns, g.regex = {
      concat: m,
      lookahead: f,
      either: y,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const R in Ct)
      typeof Ct[R] == "object" && t(Ct[R]);
    return Object.assign(g, Ct), g;
  }, nt = Xn({});
  return nt.newInstance = () => Xn({}), cn = nt, nt.HighlightJS = nt, nt.default = nt, cn;
}
var ai = /* @__PURE__ */ ii();
const ce = /* @__PURE__ */ Tr(ai), J = /* @__PURE__ */ new Map(), li = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Te = {
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
let Ge = null;
const un = /* @__PURE__ */ new Map(), oi = 300 * 1e3;
async function Cr(t = li) {
  if (t)
    return Ge || (Ge = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const i = (await e.text()).split(/\r?\n/);
        let n = -1;
        for (let o = 0; o < i.length; o++)
          if (/\|\s*Language\s*\|/i.test(i[o])) {
            n = o;
            break;
          }
        if (n === -1) return;
        const s = i[n].replace(/^\||\|$/g, "").split("|").map((o) => o.trim().toLowerCase());
        let a = s.findIndex((o) => /alias|aliases|equivalent|alt|alternates?/i.test(o));
        a === -1 && (a = 1);
        let u = s.findIndex((o) => /file|filename|module|module name|module-name|short|slug/i.test(o));
        if (u === -1) {
          const o = s.findIndex((c) => /language/i.test(c));
          u = o !== -1 ? o : 0;
        }
        let l = [];
        for (let o = n + 1; o < i.length; o++) {
          const c = i[o].trim();
          if (!c || !c.startsWith("|")) break;
          const h = c.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (h.every((w) => /^-+$/.test(w))) continue;
          const f = h;
          if (!f.length) continue;
          const d = (f[u] || f[0] || "").toString().trim().toLowerCase();
          if (!d || /^-+$/.test(d)) continue;
          J.set(d, d);
          const m = f[a] || "";
          if (m) {
            const w = String(m).split(",").map((y) => y.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const x = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              x && /[a-z0-9]/i.test(x) && (J.set(x, x), l.push(x));
            }
          }
        }
        try {
          const o = [];
          for (const c of l) {
            const h = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? o.push(h) : J.delete(c);
          }
          l = o;
        } catch (o) {
          console.warn("[codeblocksManager] cleanup aliases failed", o);
        }
        try {
          let o = 0;
          for (const c of Array.from(J.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              J.delete(c), o++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const h = c.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = J.get(c);
                J.delete(c), J.set(h, f);
              } else
                J.delete(c), o++;
            }
          }
          for (const [c, h] of Array.from(J.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (J.delete(c), o++);
          try {
            const c = ":---------------------";
            J.has(c) && (J.delete(c), o++);
          } catch (c) {
            console.warn("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(J.keys()).sort();
          } catch (c) {
            console.warn("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (o) {
          console.warn("[codeblocksManager] ignored error", o);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), Ge);
}
const ot = /* @__PURE__ */ new Set();
async function St(t, e) {
  if (Ge || (async () => {
    try {
      await Cr();
    } catch (n) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", n);
    }
  })(), Ge)
    try {
      await Ge;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const r = t.toLowerCase();
  if (Lr.has(r)) return !1;
  if (J.size && !J.has(r)) {
    const n = Te;
    if (!n[r] && !n[t])
      return !1;
  }
  if (ot.has(t)) return !0;
  const i = Te;
  try {
    const n = (e || t || "").toString().replace(/\.js$/i, "").trim(), s = (i[t] || t || "").toString(), a = (i[n] || n || "").toString();
    let u = Array.from(new Set([
      s,
      a,
      n,
      t,
      i[n],
      i[t]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    J.size && (u = u.filter((c) => {
      if (J.has(c)) return !0;
      const h = Te[c];
      return !!(h && J.has(h));
    }));
    let l = null, o = null;
    for (const c of u)
      try {
        const h = Date.now();
        let f = un.get(c);
        if (f && f.ok === !1 && h - (f.ts || 0) >= oi && (un.delete(c), f = void 0), f) {
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
            const d = J.size && J.get(t) || c || t;
            return ce.registerLanguage(d, p), ot.add(d), d !== t && (ce.registerLanguage(t, p), ot.add(t)), !0;
          } catch (d) {
            o = d;
          }
        } else
          try {
            if (J.has(c) || J.has(t)) {
              const p = () => ({});
              try {
                ce.registerLanguage(c, p), ot.add(c);
              } catch {
              }
              try {
                c !== t && (ce.registerLanguage(t, p), ot.add(t));
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
function ci(t = document) {
  Ge || (async () => {
    try {
      await Cr();
    } catch (s) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", s);
    }
  })();
  const e = Te, i = Bt || (typeof IntersectionObserver > "u" ? null : (Bt = new IntersectionObserver((s, a) => {
    s.forEach((u) => {
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
            const h = (c[1] || "").toLowerCase(), f = e[h] || h, p = J.size && (J.get(f) || J.get(String(f).toLowerCase())) || f;
            try {
              await St(p);
            } catch (d) {
              console.warn("[codeblocksManager] registerLanguage failed", d);
            }
            try {
              ce.highlightElement(l);
            } catch (d) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const h = l.textContent || "";
              try {
                if (ce && typeof ce.getLanguage == "function" && ce.getLanguage("plaintext")) {
                  const f = ce.highlight(h, { language: "plaintext" });
                  f && f.value && (l.innerHTML = f.value);
                }
              } catch {
                try {
                  ce.highlightElement(l);
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
  if (!i) {
    n.forEach(async (s) => {
      try {
        const a = s.getAttribute && s.getAttribute("class") || s.className || "", u = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (u && u[1]) {
          const l = (u[1] || "").toLowerCase(), o = e[l] || l, c = J.size && (J.get(o) || J.get(String(o).toLowerCase())) || o;
          try {
            await St(c);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          ce.highlightElement(s);
        } catch (l) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
        }
      } catch (a) {
        console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error", a);
      }
    });
    return;
  }
  n.forEach((s) => {
    try {
      i.observe(s);
    } catch (a) {
      console.warn("[codeblocksManager] observe failed", a);
    }
  });
}
function dl(t, { useCdn: e = !0 } = {}) {
  const r = document.querySelector("link[data-hl-theme]");
  r && r.remove();
  let i = t || "monokai";
  if (i === "monokai")
    return;
  if (!e) {
    console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");
    return;
  }
  const n = `https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${i}.css`, s = document.createElement("link");
  s.rel = "stylesheet", s.href = n, s.setAttribute("data-hl-theme", i), document.head.appendChild(s);
}
let hn = "light";
function ui(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = t, Object.entries(e).forEach(([i, n]) => r.setAttribute(i, n)), document.head.appendChild(r);
}
async function hi(t = "none", e = "/") {
  if (!t || t === "none") return;
  const r = [e + "bulma.css", "/bulma.css"], i = Array.from(new Set(r));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const n of i)
      try {
        const s = await fetch(n, { method: "GET" });
        if (s.ok) {
          const a = await s.text(), u = document.createElement("style");
          u.setAttribute("data-bulma-override", n), u.appendChild(document.createTextNode(`
/* bulma override: ${n} */
` + a)), document.head.appendChild(u);
          return;
        }
      } catch (s) {
        console.warn("[bulmaManager] fetch local bulma candidate failed", s);
      }
    return;
  }
  try {
    const n = String(t).trim();
    if (!n) return;
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;
    ui(s, { "data-bulmaswatch-theme": n });
  } catch (n) {
    console.warn("[bulmaManager] ensureBulma failed", n);
  }
}
function di(t) {
  hn = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", hn), hn === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function pl(t) {
  const e = document.documentElement;
  for (const [r, i] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${r}`, i);
    } catch (n) {
      console.warn("[bulmaManager] setThemeVars failed for", r, n);
    }
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
let Qe = jt;
function dt(t, e = {}) {
  const r = it[Qe] || it.en;
  let i = r && r[t] ? r[t] : it.en[t] || "";
  for (const n of Object.keys(e))
    i = i.replace(new RegExp(`{${n}}`, "g"), String(e[n]));
  return i;
}
async function Mr(t, e) {
  if (!t) return;
  let r = t;
  try {
    /^https?:\/\//.test(t) || (r = new URL(t, location.origin + e).toString());
    const i = await fetch(r);
    if (!i.ok) return;
    const n = await i.json();
    for (const s of Object.keys(n || {}))
      it[s] = Object.assign({}, it[s] || {}, n[s]);
  } catch {
  }
}
function $r(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Qe = it[e] ? e : "en";
}
const pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Qe;
  },
  loadL10nFile: Mr,
  setLang: $r,
  t: dt
}, Symbol.toStringTag, { value: "Module" })), fi = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Pr(t, e = "worker") {
  let r = null;
  function i() {
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
  function s(u, l = 1e3) {
    return new Promise((o, c) => {
      const h = i();
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
  return { get: i, send: s, terminate: n };
}
function gi(t) {
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
const De = /* @__PURE__ */ new Set();
function Ln(t) {
  mi(), De.clear();
  for (const e of Le)
    e && De.add(e);
  ar(Y), ar(U), Ln._refreshed = !0;
}
function ar(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && De.add(e);
}
function lr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(r, i) {
    return i && De.add(i), e.call(this, r, i);
  };
}
let or = !1;
function mi() {
  or || (lr(Y), lr(U), or = !0);
}
function Ir(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function de(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function At(t) {
  return String(t || "").replace(/\/+$/, "");
}
function vt(t) {
  return At(t) + "/";
}
function wi(t) {
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
    const i = Array.from(t.querySelectorAll("img"));
    if (!i.length) return;
    const n = t, s = n && n.getBoundingClientRect ? n.getBoundingClientRect() : null, a = 0, u = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = s ? Math.max(a, s.top) : a, c = (s ? Math.min(u, s.bottom) : u) + Number(e || 0);
    let h = 0;
    n && (h = n.clientHeight || (s ? s.height : 0)), h || (h = u - a);
    let f = 0.6;
    try {
      const w = n && window.getComputedStyle ? window.getComputedStyle(n) : null, y = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), x = y ? parseFloat(y) : NaN;
      !Number.isNaN(x) && x > 0 && x <= 1 && (f = x);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(h * f));
    let d = !1, m = null;
    if (i.forEach((w) => {
      try {
        const y = w.getAttribute ? w.getAttribute("loading") : void 0;
        y !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const x = w.getBoundingClientRect ? w.getBoundingClientRect() : null, B = w.src || w.getAttribute && w.getAttribute("src"), I = x && x.height > 1 ? x.height : p, A = x ? x.top : 0, q = A + I, O = !!(x && I > 0 && A <= c && q >= l);
        O && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), wi(B), d = !0), !m && x && x.top <= c && (m = { img: w, src: B, rect: x, beforeLoading: y }), r && console.log("[helpers] setEagerForAboveFoldImages:", {
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
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Ft(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Ft);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const Y = /* @__PURE__ */ new Map();
let Ce = [], Cn = !1;
function zr(t) {
  Cn = !!t;
}
function Br(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function bi() {
  return Ce;
}
const Or = Pr(() => gi(fi), "slugManager");
function _n() {
  return Or.get();
}
function Nr(t) {
  return Or.send(t);
}
async function yi(t, e = 1, r = void 0) {
  if (!_n()) return Gt(t, e, r);
  try {
    return await Nr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: r });
  } catch (n) {
    try {
      return await Gt(t, e, r);
    } catch (s) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", s), n;
    }
  }
}
async function ki(t, e, r) {
  return _n() ? Nr({ type: "crawlForSlug", slug: t, base: e, maxQueue: r }) : Mn(t, e, r);
}
function We(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const i = e.split("/")[0], n = Ce.includes(i);
      let s = Y.get(t);
      (!s || typeof s == "string") && (s = { default: typeof s == "string" ? s : void 0, langs: {} }), n ? s.langs[i] = e : s.default = e, Y.set(t, s);
    } else
      Y.set(t, e);
}
const Vt = /* @__PURE__ */ new Set();
function xi(t) {
  typeof t == "function" && Vt.add(t);
}
function Si(t) {
  typeof t == "function" && Vt.delete(t);
}
const U = /* @__PURE__ */ new Map();
let wn = {}, Le = [], at = "_404.md", st = "_home.md";
function bn(t) {
  t != null && (at = String(t || ""));
}
function yn(t) {
  t != null && (st = String(t || ""));
}
function vi(t) {
  wn = t || {};
}
const gt = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Set();
function Ai() {
  gt.clear(), Wt.clear();
}
function Ei(t) {
  if (!t || t.length === 0) return "";
  let e = t[0];
  for (let i = 1; i < t.length; i++) {
    const n = t[i];
    let s = 0;
    const a = Math.min(e.length, n.length);
    for (; s < a && e[s] === n[s]; ) s++;
    e = e.slice(0, s);
  }
  const r = e.lastIndexOf("/");
  return r === -1 ? e : e.slice(0, r + 1);
}
function Zt(t) {
  Y.clear(), U.clear(), Le = [], Ce = Ce || [];
  const e = Object.keys(wn || {});
  if (!e.length) return;
  let r = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? r = new URL(String(t)).pathname : r = String(t || "");
      } catch (i) {
        r = String(t || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      r = vt(r);
    }
  } catch (i) {
    r = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  r || (r = Ei(e));
  for (const i of e) {
    let n = i;
    r && i.startsWith(r) ? n = de(i.slice(r.length)) : n = de(i), Le.push(n);
    try {
      Ln();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const s = wn[i];
    if (typeof s == "string") {
      const a = (s || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const u = ie(a[1].trim());
        if (u)
          try {
            if (Ce && Ce.length) {
              const o = n.split("/")[0], c = Ce.includes(o);
              let h = Y.get(u);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), c ? h.langs[o] = n : h.default = n, Y.set(u, h);
            } else
              Y.set(u, n);
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
function ie(t) {
  let r = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return r = r.replace(/(?:-?)(?:md|html)$/, ""), r.length > 80 && (r = r.slice(0, 80).replace(/-+$/g, "")), r;
}
function Ri(t) {
  return Et(t, void 0);
}
function Et(t, e) {
  if (!t) return !1;
  if (t.startsWith("//")) return !0;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
    if (e && typeof e == "string")
      try {
        const r = new URL(t), i = new URL(e);
        return r.origin !== i.origin ? !0 : !r.pathname.startsWith(i.pathname);
      } catch {
        return !0;
      }
    return !0;
  }
  if (t.startsWith("/") && e && typeof e == "string")
    try {
      const r = new URL(t, e), i = new URL(e);
      return r.origin !== i.origin ? !0 : !r.pathname.startsWith(i.pathname);
    } catch {
      return !0;
    }
  return !1;
}
function Dt(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, r) => r);
}
function Rt(t) {
  if (!t || !Y.has(t)) return null;
  const e = Y.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (Ce && Ce.length && Qe && e.langs && e.langs[Qe])
    return e.langs[Qe];
  if (e.default) return e.default;
  if (e.langs) {
    const r = Object.keys(e.langs);
    if (r.length) return e.langs[r[0]];
  }
  return null;
}
const mt = /* @__PURE__ */ new Map();
function Ti() {
  mt.clear();
}
let ke = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const s = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (s && Y.has(s)) {
      const a = Rt(s) || Y.get(s);
      a && a !== t && (t = a);
    }
  } catch (s) {
    console.warn("[slugManager] slug mapping normalization failed", s);
  }
  const r = e == null ? "" : At(String(e));
  let i = "";
  try {
    r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? i = r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = (r.startsWith("/") ? "" : "/") + r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = "/" + t.replace(/^\//, "");
  } catch {
    i = "/" + t.replace(/^\//, "");
  }
  if (mt.has(i))
    return mt.get(i);
  const n = (async () => {
    const s = await fetch(i);
    if (!s || typeof s.ok != "boolean" || !s.ok) {
      if (s && s.status === 404)
        try {
          const h = `${r}/${at}`, f = await globalThis.fetch(h);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (h) {
          console.warn("[slugManager] fetching fallback 404 failed", h);
        }
      let c = "";
      try {
        s && typeof s.clone == "function" ? c = await s.clone().text() : s && typeof s.text == "function" ? c = await s.text() : c = "";
      } catch (h) {
        c = "", console.warn("[slugManager] reading error body failed", h);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: s ? s.status : void 0, statusText: s ? s.statusText : void 0, body: c.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await s.text(), u = a.trim().slice(0, 16).toLowerCase(), l = u.startsWith("<!doctype") || u.startsWith("<html"), o = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const c = `${r}/${at}`, h = await globalThis.fetch(c);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (c) {
        console.warn("[slugManager] fetching fallback 404 failed", c);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return o ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return mt.set(i, n), n;
};
function Li(t) {
  typeof t == "function" && (ke = t);
}
const Ht = /* @__PURE__ */ new Map();
function Ci(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let Ue = [], ct = null;
async function Gt(t, e = 1, r = void 0) {
  const i = Array.isArray(r) ? Array.from(new Set((r || []).map((n) => de(String(n || ""))))) : [];
  try {
    const n = de(String(at || ""));
    n && !i.includes(n) && i.push(n);
  } catch {
  }
  if (Ue && Ue.length && e === 1 && !Ue.some((s) => {
    try {
      return i.includes(de(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return Ue;
  if (ct) return ct;
  ct = (async () => {
    let n = Array.isArray(r) ? Array.from(new Set((r || []).map((o) => de(String(o || ""))))) : [];
    try {
      const o = de(String(at || ""));
      o && !n.includes(o) && n.push(o);
    } catch {
    }
    const s = (o) => {
      if (!n || !n.length) return !1;
      for (const c of n)
        if (c && (o === c || o.startsWith(c + "/")))
          return !0;
      return !1;
    };
    let a = [];
    if (Le && Le.length && (a = Array.from(Le)), !a.length)
      for (const o of Y.values())
        o && a.push(o);
    try {
      const o = await qr(t);
      o && o.length && (a = a.concat(o));
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", o);
    }
    try {
      const o = new Set(a), c = [...a];
      for (o.size; c.length && o.size <= Tt; ) {
        const h = c.shift();
        try {
          const f = await ke(h, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], m = String(h || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(m) && Cn && (!h || !h.includes("/")))
              continue;
            const w = Ci(p), y = /\[[^\]]+\]\(([^)]+)\)/g;
            let x;
            for (; x = y.exec(w); )
              d.push(x[1]);
            const B = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; x = B.exec(w); )
              d.push(x[1]);
            const I = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
            for (let A of d)
              try {
                if (Et(A, t) || A.startsWith("..") || A.indexOf("/../") !== -1 || (I && !A.startsWith("./") && !A.startsWith("/") && !A.startsWith("../") && (A = I + A), A = de(A), !/\.(md|html?)(?:$|[?#])/i.test(A)) || (A = A.split(/[?#]/)[0], s(A))) continue;
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
    a = a.filter((o) => !o || u.has(o) || s(o) ? !1 : (u.add(o), !0));
    const l = [];
    for (const o of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(o))
        try {
          const c = await ke(o, t);
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
                      return ie(h || o);
                    })(), A = Array.from(m.querySelectorAll("h2"));
                    for (const q of A)
                      try {
                        const O = (q.textContent || "").trim();
                        if (!O) continue;
                        const Q = q.id ? q.id : ie(O), V = I ? `${I}::${Q}` : `${ie(o)}::${Q}`;
                        let ne = "", P = q.nextElementSibling;
                        for (; P && P.tagName && P.tagName.toLowerCase() === "script"; ) P = P.nextElementSibling;
                        P && P.textContent && (ne = String(P.textContent).trim()), l.push({ slug: V, title: O, excerpt: ne, path: o, parentTitle: B });
                      } catch (O) {
                        console.warn("[slugManager] indexing H2 failed", O);
                      }
                    if (e === 3)
                      try {
                        const q = Array.from(m.querySelectorAll("h3"));
                        for (const O of q)
                          try {
                            const Q = (O.textContent || "").trim();
                            if (!Q) continue;
                            const V = O.id ? O.id : ie(Q), ne = I ? `${I}::${V}` : `${ie(o)}::${V}`;
                            let P = "", T = O.nextElementSibling;
                            for (; T && T.tagName && T.tagName.toLowerCase() === "script"; ) T = T.nextElementSibling;
                            T && T.textContent && (P = String(T.textContent).trim()), l.push({ slug: ne, title: Q, excerpt: P, path: o, parentTitle: B });
                          } catch (Q) {
                            console.warn("[slugManager] indexing H3 failed", Q);
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
                    return ie(h || o);
                  })();
                  const I = /^##\s+(.+)$/gm;
                  let A;
                  for (; A = I.exec(d); )
                    try {
                      const q = (A[1] || "").trim(), O = Dt(q);
                      if (!q) continue;
                      const Q = ie(q), V = x ? `${x}::${Q}` : `${ie(o)}::${Q}`, P = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), T = P && P[1] ? String(P[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      l.push({ slug: V, title: O, excerpt: T, path: o, parentTitle: y });
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
                        const O = ie(A), Q = x ? `${x}::${O}` : `${ie(o)}::${O}`, ne = d.slice(B.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), P = ne && ne[1] ? String(ne[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        l.push({ slug: Q, title: q, excerpt: P, path: o, parentTitle: y });
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
            p || (p = ie(h || o)), l.push({ slug: p, title: h, excerpt: f, path: o });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    try {
      Ue = l.filter((c) => {
        try {
          return !s(String(c.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (o) {
      console.warn("[slugManager] filtering index by excludes failed", o), Ue = l;
    }
    return Ue;
  })();
  try {
    await ct;
  } catch (n) {
    console.warn("[slugManager] awaiting _indexPromise failed", n);
  }
  return ct = null, Ue;
}
const Dr = 1e3;
let Tt = Dr;
function _i(t) {
  typeof t == "number" && t >= 0 && (Tt = t);
}
const Hr = new DOMParser(), Ur = "a[href]";
let Mn = async function(t, e, r = Tt) {
  if (Ht.has(t)) return Ht.get(t);
  let i = null;
  const n = /* @__PURE__ */ new Set(), s = [""];
  for (; s.length && !i && !(s.length > r); ) {
    const a = s.shift();
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
      const o = await l.text(), h = Hr.parseFromString(o, "text/html").querySelectorAll(Ur);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Et(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            n.has(d) || s.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = de(a + p);
            try {
              if (U.has(d))
                continue;
              for (const m of Y.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await ke(d, e);
              if (m && m.raw) {
                const w = (m.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && ie(w[1].trim()) === t) {
                  i = d;
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
  return Ht.set(t, i), i;
};
async function qr(t, e = Tt) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), n = [""];
  for (; n.length && !(n.length > e); ) {
    const s = n.shift();
    if (i.has(s)) continue;
    i.add(s);
    let a = t;
    a.endsWith("/") || (a += "/"), a += s;
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
      const l = await u.text(), c = Hr.parseFromString(l, "text/html").querySelectorAll(Ur);
      for (const h of c)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Et(f, t) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
          if (f.endsWith("/")) {
            const d = s + f;
            i.has(d) || n.push(d);
            continue;
          }
          const p = (s + f).replace(/^\/+/, "");
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
async function jr(t, e, r) {
  if (t && typeof t == "string" && (t = de(t), t = At(t)), Y.has(t))
    return Rt(t) || Y.get(t);
  for (const n of Vt)
    try {
      const s = await n(t, e);
      if (s)
        return We(t, s), U.set(s, t), s;
    } catch (s) {
      console.warn("[slugManager] slug resolver failed", s);
    }
  if (Le && Le.length) {
    if (gt.has(t)) {
      const n = gt.get(t);
      return Y.set(t, n), U.set(n, t), n;
    }
    for (const n of Le)
      if (!Wt.has(n))
        try {
          const s = await ke(n, e);
          if (s && s.raw) {
            const a = (s.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const u = ie(a[1].trim());
              if (Wt.add(n), u && gt.set(u, n), u === t)
                return We(t, n), U.set(n, t), n;
            }
          }
        } catch (s) {
          console.warn("[slugManager] manifest title fetch failed", s);
        }
  }
  try {
    const n = await Gt(e);
    if (n && n.length) {
      const s = n.find((a) => a.slug === t);
      if (s)
        return We(t, s.path), U.set(s.path, t), s.path;
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
  const i = [`${t}.html`, `${t}.md`];
  for (const n of i)
    try {
      const s = await ke(n, e);
      if (s && s.raw)
        return We(t, n), U.set(n, t), n;
    } catch (s) {
      console.warn("[slugManager] candidate fetch failed", s);
    }
  if (Le && Le.length)
    for (const n of Le)
      try {
        const s = n.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ie(s) === t)
          return We(t, n), U.set(n, t), n;
      } catch (s) {
        console.warn("[slugManager] build-time filename match failed", s);
      }
  try {
    const n = [];
    st && typeof st == "string" && st.trim() && n.push(st), n.includes("_home.md") || n.push("_home.md");
    for (const s of n)
      try {
        const a = await ke(s, e);
        if (a && a.raw) {
          const u = (a.raw || "").match(/^#\s+(.+)$/m);
          if (u && u[1] && ie(u[1].trim()) === t)
            return We(t, s), U.set(s, t), s;
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
  CRAWL_MAX_QUEUE: Dr,
  _setAllMd: vi,
  _storeSlugMapping: We,
  addSlugResolver: xi,
  get allMarkdownPaths() {
    return Le;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Gt,
  buildSearchIndexWorker: yi,
  clearFetchCache: Ti,
  clearListCaches: Ai,
  crawlAllMarkdown: qr,
  crawlCache: Ht,
  crawlForSlug: Mn,
  crawlForSlugWorker: ki,
  get defaultCrawlMaxQueue() {
    return Tt;
  },
  ensureSlug: jr,
  fetchCache: mt,
  get fetchMarkdown() {
    return ke;
  },
  getLanguages: bi,
  get homePage() {
    return st;
  },
  initSlugWorker: _n,
  isExternalLink: Ri,
  isExternalLinkWithBase: Et,
  listPathsFetched: Wt,
  listSlugCache: gt,
  mdToSlug: U,
  get notFoundPage() {
    return at;
  },
  removeSlugResolver: Si,
  resolveSlugPath: Rt,
  get searchIndex() {
    return Ue;
  },
  setContentBase: Zt,
  setDefaultCrawlMaxQueue: _i,
  setFetchMarkdown: Li,
  setHomePage: yn,
  setLanguages: Br,
  setNotFoundPage: bn,
  setSkipRootReadme: zr,
  get skipRootReadme() {
    return Cn;
  },
  slugResolvers: Vt,
  slugToMd: Y,
  slugify: ie,
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
const Me = /* @__PURE__ */ new Map();
function Mi(t) {
  if (!Me.has(t)) return;
  const e = Me.get(t), r = Date.now();
  if (e.ts + wt < r) {
    Me.delete(t);
    return;
  }
  return Me.delete(t), Me.set(t, e), e.value;
}
function $i(t, e) {
  if (hr(), hr(), Me.delete(t), Me.set(t, { value: e, ts: Date.now() }), Me.size > Fr) {
    const r = Me.keys().next().value;
    r !== void 0 && Me.delete(r);
  }
}
function hr() {
  if (!wt || wt <= 0) return;
  const t = Date.now();
  for (const [e, r] of Me.entries())
    r.ts + wt < t && Me.delete(e);
}
async function Pi(t, e) {
  const r = new Set(De), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const n of Array.from(i || [])) {
    const s = n.getAttribute("href") || "";
    if (s)
      try {
        const a = new URL(s, location.href);
        if (a.origin !== location.origin) continue;
        const u = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (u) {
          let o = de(u[1]);
          o && r.add(o);
          continue;
        }
        const l = a.pathname || "";
        if (l) {
          const o = new URL(e), c = vt(o.pathname);
          if (l.indexOf(c) !== -1) {
            let h = l.startsWith(c) ? l.slice(c.length) : l;
            h = de(h), h && r.add(h);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const n of r)
    try {
      if (!n || !String(n).includes(".md")) continue;
      const s = await ke(n, e);
      if (!s || !s.raw) continue;
      const a = (s.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const u = (a[1] || "").trim();
        if (u && ie(u) === t)
          return n;
      }
    } catch (s) {
      console.warn("[router] fetchMarkdown during index discovery failed", s);
    }
  return null;
}
function Ii(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const r = decodeURIComponent(String(t || ""));
      if (Y.has(r)) {
        const i = Rt(r) || Y.get(r);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || e.push(i) : (e.push(i), e.push(i + ".html")));
      } else {
        if (De && De.size)
          for (const i of De) {
            const n = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ie(n) === r && !/index\.html$/i.test(i)) {
              e.push(i);
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
async function zi(t, e) {
  const r = t || "", i = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let n = t || "", s = null;
  if (n && String(n).includes("::")) {
    const d = String(n).split("::", 2);
    n = d[0], s = d[1] || null;
  }
  const u = `${t}|||${typeof pi < "u" && Qe ? Qe : ""}`, l = Mi(u);
  if (l)
    n = l.resolved, s = l.anchor || s;
  else {
    if (!String(n).includes(".md") && !String(n).includes(".html")) {
      let d = decodeURIComponent(String(n || ""));
      if (d && typeof d == "string" && (d = de(d), d = At(d)), Y.has(d))
        n = Rt(d) || Y.get(d);
      else {
        let m = await Pi(d, e);
        if (m)
          n = m;
        else if (Ln._refreshed && De && De.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await jr(d, e);
          w && (n = w);
        }
      }
    }
    $i(u, { resolved: n, anchor: s });
  }
  !s && i && (s = i);
  const o = Ii(n), c = String(r || "").includes(".md") || String(r || "").includes(".html");
  if (c && o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 1 && /index\.html$/i.test(o[0]) && !c && !Y.has(n) && !Y.has(decodeURIComponent(String(n || ""))) && !String(n || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const d of o)
    if (d)
      try {
        const m = de(d);
        h = await ke(m, e), f = m;
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
                    const Q = O.parseFromString(w || "", "text/html"), V = ($, L) => {
                      try {
                        const v = L.getAttribute($) || "";
                        if (!v || /^(https?:)?\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return;
                        try {
                          const b = new URL(v, I).toString();
                          L.setAttribute($, b);
                        } catch (b) {
                          console.warn("[router] rewrite attribute failed", $, b);
                        }
                      } catch (v) {
                        console.warn("[router] rewrite helper failed", v);
                      }
                    }, ne = Q.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), P = [];
                    for (const $ of Array.from(ne || []))
                      try {
                        const L = $.tagName ? $.tagName.toLowerCase() : "";
                        if (L === "a") continue;
                        if ($.hasAttribute("src")) {
                          const v = $.getAttribute("src");
                          V("src", $);
                          const b = $.getAttribute("src");
                          v !== b && P.push({ attr: "src", tag: L, before: v, after: b });
                        }
                        if ($.hasAttribute("href") && L === "link") {
                          const v = $.getAttribute("href");
                          V("href", $);
                          const b = $.getAttribute("href");
                          v !== b && P.push({ attr: "href", tag: L, before: v, after: b });
                        }
                        if ($.hasAttribute("href") && L !== "link") {
                          const v = $.getAttribute("href");
                          V("href", $);
                          const b = $.getAttribute("href");
                          v !== b && P.push({ attr: "href", tag: L, before: v, after: b });
                        }
                        if ($.hasAttribute("xlink:href")) {
                          const v = $.getAttribute("xlink:href");
                          V("xlink:href", $);
                          const b = $.getAttribute("xlink:href");
                          v !== b && P.push({ attr: "xlink:href", tag: L, before: v, after: b });
                        }
                        if ($.hasAttribute("poster")) {
                          const v = $.getAttribute("poster");
                          V("poster", $);
                          const b = $.getAttribute("poster");
                          v !== b && P.push({ attr: "poster", tag: L, before: v, after: b });
                        }
                        if ($.hasAttribute("srcset")) {
                          const E = ($.getAttribute("srcset") || "").split(",").map((M) => M.trim()).filter(Boolean).map((M) => {
                            const [k, X] = M.split(/\s+/, 2);
                            if (!k || /^(https?:)?\/\//i.test(k) || k.startsWith("/")) return M;
                            try {
                              const he = new URL(k, I).toString();
                              return X ? `${he} ${X}` : he;
                            } catch {
                              return M;
                            }
                          }).join(", ");
                          $.setAttribute("srcset", E);
                        }
                      } catch {
                      }
                    const T = Q.documentElement && Q.documentElement.outerHTML ? Q.documentElement.outerHTML : w;
                    try {
                      P && P.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: P });
                    } catch {
                    }
                    return { data: { raw: T, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
                  }
                } catch {
                }
                let q = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? q = w.replace(/(<head[^>]*>)/i, `$1<base href="${A}">`) : q = `<base href="${A}">` + w), { data: { raw: q, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
              } catch {
                return { data: { raw: w, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
              }
          }
        } catch (d) {
          console.warn("[router] absolute HTML fetch fallback failed", d);
        }
    } catch {
    }
    throw new Error("no page data");
  }
  return { data: h, pagePath: f, anchor: s };
}
function $n() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var et = $n();
function Wr(t) {
  et = t;
}
var Ve = { exec: () => null };
function te(t, e = "") {
  let r = typeof t == "string" ? t : t.source, i = { replace: (n, s) => {
    let a = typeof s == "string" ? s : s.source;
    return a = a.replace(Ee.caret, "$1"), r = r.replace(n, a), i;
  }, getRegex: () => new RegExp(r, e) };
  return i;
}
var Bi = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ee = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Oi = /^(?:[ \t]*(?:\n|$))+/, Ni = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Di = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Lt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Hi = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Pn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Zr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = te(Zr).replace(/bull/g, Pn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ui = te(Zr).replace(/bull/g, Pn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), In = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, qi = /^[^\n]+/, zn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, ji = te(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", zn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fi = te(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Pn).getRegex(), Jt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Bn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Wi = te("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Bn).replace("tag", Jt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Qr = te(In).replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Zi = te(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Qr).getRegex(), On = { blockquote: Zi, code: Ni, def: ji, fences: Di, heading: Hi, hr: Lt, html: Wi, lheading: Gr, list: Fi, newline: Oi, paragraph: Qr, table: Ve, text: qi }, dr = te("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex(), Gi = { ...On, lheading: Ui, table: dr, paragraph: te(In).replace("hr", Lt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Jt).getRegex() }, Qi = { ...On, html: te(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Bn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ve, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: te(In).replace("hr", Lt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Xi = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ki = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Xr = /^( {2,}|\\)\n(?!\s*$)/, Yi = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, en = /[\p{P}\p{S}]/u, Nn = /[\s\p{P}\p{S}]/u, Kr = /[^\s\p{P}\p{S}]/u, Vi = te(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Nn).getRegex(), Yr = /(?!~)[\p{P}\p{S}]/u, Ji = /(?!~)[\s\p{P}\p{S}]/u, ea = /(?:[^\s\p{P}\p{S}]|~)/u, Vr = /(?![*_])[\p{P}\p{S}]/u, ta = /(?![*_])[\s\p{P}\p{S}]/u, na = /(?:[^\s\p{P}\p{S}]|[*_])/u, ra = te(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Bi ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Jr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, sa = te(Jr, "u").replace(/punct/g, en).getRegex(), ia = te(Jr, "u").replace(/punct/g, Yr).getRegex(), es = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", aa = te(es, "gu").replace(/notPunctSpace/g, Kr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), la = te(es, "gu").replace(/notPunctSpace/g, ea).replace(/punctSpace/g, Ji).replace(/punct/g, Yr).getRegex(), oa = te("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Kr).replace(/punctSpace/g, Nn).replace(/punct/g, en).getRegex(), ca = te(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Vr).getRegex(), ua = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ha = te(ua, "gu").replace(/notPunctSpace/g, na).replace(/punctSpace/g, ta).replace(/punct/g, Vr).getRegex(), da = te(/\\(punct)/, "gu").replace(/punct/g, en).getRegex(), pa = te(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), fa = te(Bn).replace("(?:-->|$)", "-->").getRegex(), ga = te("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", fa).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, ma = te(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Qt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ts = te(/^!?\[(label)\]\[(ref)\]/).replace("label", Qt).replace("ref", zn).getRegex(), ns = te(/^!?\[(ref)\](?:\[\])?/).replace("ref", zn).getRegex(), wa = te("reflink|nolink(?!\\()", "g").replace("reflink", ts).replace("nolink", ns).getRegex(), pr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Dn = { _backpedal: Ve, anyPunctuation: da, autolink: pa, blockSkip: ra, br: Xr, code: Ki, del: Ve, delLDelim: Ve, delRDelim: Ve, emStrongLDelim: sa, emStrongRDelimAst: aa, emStrongRDelimUnd: oa, escape: Xi, link: ma, nolink: ns, punctuation: Vi, reflink: ts, reflinkSearch: wa, tag: ga, text: Yi, url: Ve }, ba = { ...Dn, link: te(/^!?\[(label)\]\((.*?)\)/).replace("label", Qt).getRegex(), reflink: te(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qt).getRegex() }, kn = { ...Dn, emStrongRDelimAst: la, emStrongLDelim: ia, delLDelim: ca, delRDelim: ha, url: te(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", pr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: te(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", pr).getRegex() }, ya = { ...kn, br: te(Xr).replace("{2,}", "*").getRegex(), text: te(kn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Nt = { normal: On, gfm: Gi, pedantic: Qi }, ut = { normal: Dn, gfm: kn, breaks: ya, pedantic: ba }, ka = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, fr = (t) => ka[t];
function Ne(t, e) {
  if (e) {
    if (Ee.escapeTest.test(t)) return t.replace(Ee.escapeReplace, fr);
  } else if (Ee.escapeTestNoEncode.test(t)) return t.replace(Ee.escapeReplaceNoEncode, fr);
  return t;
}
function gr(t) {
  try {
    t = encodeURI(t).replace(Ee.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function mr(t, e) {
  let r = t.replace(Ee.findPipe, (s, a, u) => {
    let l = !1, o = a;
    for (; --o >= 0 && u[o] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(Ee.splitPipe), n = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; n < i.length; n++) i[n] = i[n].trim().replace(Ee.slashPipe, "|");
  return i;
}
function ht(t, e, r) {
  let i = t.length;
  if (i === 0) return "";
  let n = 0;
  for (; n < i && t.charAt(i - n - 1) === e; )
    n++;
  return t.slice(0, i - n);
}
function xa(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) r++;
  else if (t[i] === e[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function Sa(t, e = 0) {
  let r = e, i = "";
  for (let n of t) if (n === "	") {
    let s = 4 - r % 4;
    i += " ".repeat(s), r += s;
  } else i += n, r++;
  return i;
}
function wr(t, e, r, i, n) {
  let s = e.href, a = e.title || null, u = t[1].replace(n.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: s, title: a, text: u, tokens: i.inlineTokens(u) };
  return i.state.inLink = !1, l;
}
function va(t, e, r) {
  let i = t.match(r.other.indentCodeCompensation);
  if (i === null) return e;
  let n = i[1];
  return e.split(`
`).map((s) => {
    let a = s.match(r.other.beginningSpace);
    if (a === null) return s;
    let [u] = a;
    return u.length >= n.length ? s.slice(n.length) : s;
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
      let r = e[0], i = va(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = ht(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
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
`), i = "", n = "", s = [];
      for (; r.length > 0; ) {
        let a = !1, u = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) u.push(r[l]), a = !0;
        else if (!a) u.push(r[l]);
        else break;
        r = r.slice(l);
        let o = u.join(`
`), c = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${o}` : o, n = n ? `${n}
${c}` : c;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, s, !0), this.lexer.state.top = h, r.length === 0) break;
        let f = s.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, d = p.raw + `
` + r.join(`
`), m = this.blockquote(d);
          s[s.length - 1] = m, i = i.substring(0, i.length - p.raw.length) + m.raw, n = n.substring(0, n.length - p.text.length) + m.text;
          break;
        } else if (f?.type === "list") {
          let p = f, d = p.raw + `
` + r.join(`
`), m = this.list(d);
          s[s.length - 1] = m, i = i.substring(0, i.length - f.raw.length) + m.raw, n = n.substring(0, n.length - p.raw.length) + m.raw, r = d.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: s, text: n };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let r = e[1].trim(), i = r.length > 1, n = { type: "list", raw: "", ordered: i, start: i ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = i ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = i ? r : "[*+-]");
      let s = this.rules.other.listItemRegex(r), a = !1;
      for (; t; ) {
        let l = !1, o = "", c = "";
        if (!(e = s.exec(t)) || this.rules.block.hr.test(t)) break;
        o = e[0], t = t.substring(o.length);
        let h = Sa(e[2].split(`
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
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", n = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: i, title: n };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = mr(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
      for (let a = 0; a < r.length; a++) s.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: s.align[a] });
      for (let a of n) s.rows.push(mr(a, s.header.length).map((u, l) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: s.align[l] })));
      return s;
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
        let s = ht(r.slice(0, -1), "\\");
        if ((r.length - s.length) % 2 === 0) return;
      } else {
        let s = xa(e[2], "()");
        if (s === -2) return;
        if (s > -1) {
          let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + s;
          e[2] = e[2].substring(0, s), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let i = e[2], n = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(i);
        s && (i = s[1], n = s[3]);
      } else n = e[3] ? e[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), wr(e, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: n && n.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(t)) || (r = this.rules.inline.nolink.exec(t))) {
      let i = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = e[i.toLowerCase()];
      if (!n) {
        let s = r[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return wr(r, n, r[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || i[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let n = [...i[0]].length - 1, s, a, u = n, l = 0, o = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = o.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s) continue;
        if (a = [...s].length, i[3] || i[4]) {
          u += a;
          continue;
        } else if ((i[5] || i[6]) && n % 3 && !((n + a) % 3)) {
          l += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u + l);
        let c = [...i[0]][0].length, h = t.slice(0, n + i.index + c + a);
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
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(r), n = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return i && n && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, r = "") {
    let i = this.rules.inline.delLDelim.exec(t);
    if (i && (!i[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let n = [...i[0]].length - 1, s, a, u = n, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = l.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s || (a = [...s].length, a !== n)) continue;
        if (i[3] || i[4]) {
          u += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u);
        let o = [...i[0]][0].length, c = t.slice(0, n + i.index + o + a), h = c.slice(n, -n);
        return { type: "del", raw: c, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let r, i;
      return e[2] === "@" ? (r = e[1], i = "mailto:" + r) : (r = e[1], i = r), { type: "link", raw: e[0], text: r, href: i, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let r, i;
      if (e[2] === "@") r = e[0], i = "mailto:" + r;
      else {
        let n;
        do
          n = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (n !== e[0]);
        r = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: i, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, Ie = class xn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || et, this.options.tokenizer = this.options.tokenizer || new Xt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: Ee, block: Nt.normal, inline: ut.normal };
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
    e = e.replace(Ee.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], i = !1) {
    for (this.options.pedantic && (e = e.replace(Ee.tabCharGlobal, "    ").replace(Ee.spaceLine, "")); e; ) {
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
      let s = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, u = e.slice(1), l;
        this.options.extensions.startBlock.forEach((o) => {
          l = o.call({ lexer: this }, u), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
        }), a < 1 / 0 && a >= 0 && (s = e.substring(0, a + 1));
      }
      if (this.state.top && (n = this.tokenizer.paragraph(s))) {
        let a = r.at(-1);
        i && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + n.raw, a.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : r.push(n), i = s.length !== e.length, e = e.substring(n.raw.length);
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
    let i = e, n = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (n = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) l.includes(n[0].slice(n[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (n = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, n.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let s;
    for (; (n = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) s = n[2] ? n[2].length : 0, i = i.slice(0, n.index + s) + "[" + "a".repeat(n[0].length - s - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
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
      if (l = this.tokenizer.emStrong(e, i, u)) {
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
      if (l = this.tokenizer.del(e, i, u)) {
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
    let i = (e || "").match(Ee.notSpaceStart)?.[0], n = t.replace(Ee.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Ne(i) + '">' + (r ? n : Ne(n, !0)) + `</code></pre>
` : "<pre><code>" + (r ? n : Ne(n, !0)) + `</code></pre>
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
    let e = t.ordered, r = t.start, i = "";
    for (let a = 0; a < t.items.length; a++) {
      let u = t.items[a];
      i += this.listitem(u);
    }
    let n = e ? "ol" : "ul", s = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + n + s + `>
` + i + "</" + n + `>
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
    let i = "";
    for (let n = 0; n < t.rows.length; n++) {
      let s = t.rows[n];
      r = "";
      for (let a = 0; a < s.length; a++) r += this.tablecell(s[a]);
      i += this.tablerow({ text: r });
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
    return `<code>${Ne(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: r }) {
    let i = this.parser.parseInline(r), n = gr(t);
    if (n === null) return i;
    t = n;
    let s = '<a href="' + t + '"';
    return e && (s += ' title="' + Ne(e) + '"'), s += ">" + i + "</a>", s;
  }
  image({ href: t, title: e, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let n = gr(t);
    if (n === null) return Ne(r);
    t = n;
    let s = `<img src="${t}" alt="${Ne(r)}"`;
    return e && (s += ` title="${Ne(e)}"`), s += ">", s;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Ne(t.text);
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
}, ze = class Sn {
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
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (this.options.extensions?.renderers?.[n.type]) {
        let a = n, u = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          r += u || "";
          continue;
        }
      }
      let s = n;
      switch (s.type) {
        case "space": {
          r += this.renderer.space(s);
          break;
        }
        case "hr": {
          r += this.renderer.hr(s);
          break;
        }
        case "heading": {
          r += this.renderer.heading(s);
          break;
        }
        case "code": {
          r += this.renderer.code(s);
          break;
        }
        case "table": {
          r += this.renderer.table(s);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(s);
          break;
        }
        case "list": {
          r += this.renderer.list(s);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(s);
          break;
        }
        case "html": {
          r += this.renderer.html(s);
          break;
        }
        case "def": {
          r += this.renderer.def(s);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(s);
          break;
        }
        case "text": {
          r += this.renderer.text(s);
          break;
        }
        default: {
          let a = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let i = "";
    for (let n = 0; n < e.length; n++) {
      let s = e[n];
      if (this.options.extensions?.renderers?.[s.type]) {
        let u = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (u !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += u || "";
          continue;
        }
      }
      let a = s;
      switch (a.type) {
        case "escape": {
          i += r.text(a);
          break;
        }
        case "html": {
          i += r.html(a);
          break;
        }
        case "link": {
          i += r.link(a);
          break;
        }
        case "image": {
          i += r.image(a);
          break;
        }
        case "checkbox": {
          i += r.checkbox(a);
          break;
        }
        case "strong": {
          i += r.strong(a);
          break;
        }
        case "em": {
          i += r.em(a);
          break;
        }
        case "codespan": {
          i += r.codespan(a);
          break;
        }
        case "br": {
          i += r.br(a);
          break;
        }
        case "del": {
          i += r.del(a);
          break;
        }
        case "text": {
          i += r.text(a);
          break;
        }
        default: {
          let u = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return i;
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
    return this.block ? Ie.lex : Ie.lexInline;
  }
  provideParser() {
    return this.block ? ze.parse : ze.parseInline;
  }
}, Aa = class {
  defaults = $n();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ze;
  Renderer = Kt;
  TextRenderer = Hn;
  Lexer = Ie;
  Tokenizer = Xt;
  Hooks = pt;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let r = [];
    for (let i of t) switch (r = r.concat(e.call(this, i)), i.type) {
      case "table": {
        let n = i;
        for (let s of n.header) r = r.concat(this.walkTokens(s.tokens, e));
        for (let s of n.rows) for (let a of s) r = r.concat(this.walkTokens(a.tokens, e));
        break;
      }
      case "list": {
        let n = i;
        r = r.concat(this.walkTokens(n.items, e));
        break;
      }
      default: {
        let n = i;
        this.defaults.extensions?.childTokens?.[n.type] ? this.defaults.extensions.childTokens[n.type].forEach((s) => {
          let a = n[s].flat(1 / 0);
          r = r.concat(this.walkTokens(a, e));
        }) : n.tokens && (r = r.concat(this.walkTokens(n.tokens, e)));
      }
    }
    return r;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((r) => {
      let i = { ...r };
      if (i.async = this.defaults.async || i.async || !1, r.extensions && (r.extensions.forEach((n) => {
        if (!n.name) throw new Error("extension name required");
        if ("renderer" in n) {
          let s = e.renderers[n.name];
          s ? e.renderers[n.name] = function(...a) {
            let u = n.renderer.apply(this, a);
            return u === !1 && (u = s.apply(this, a)), u;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = e[n.level];
          s ? s.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), i.extensions = e), r.renderer) {
        let n = this.defaults.renderer || new Kt(this.defaults);
        for (let s in r.renderer) {
          if (!(s in n)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let a = s, u = r.renderer[a], l = n[a];
          n[a] = (...o) => {
            let c = u.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c || "";
          };
        }
        i.renderer = n;
      }
      if (r.tokenizer) {
        let n = this.defaults.tokenizer || new Xt(this.defaults);
        for (let s in r.tokenizer) {
          if (!(s in n)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let a = s, u = r.tokenizer[a], l = n[a];
          n[a] = (...o) => {
            let c = u.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c;
          };
        }
        i.tokenizer = n;
      }
      if (r.hooks) {
        let n = this.defaults.hooks || new pt();
        for (let s in r.hooks) {
          if (!(s in n)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let a = s, u = r.hooks[a], l = n[a];
          pt.passThroughHooks.has(s) ? n[a] = (o) => {
            if (this.defaults.async && pt.passThroughHooksRespectAsync.has(s)) return (async () => {
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
        i.hooks = n;
      }
      if (r.walkTokens) {
        let n = this.defaults.walkTokens, s = r.walkTokens;
        i.walkTokens = function(a) {
          let u = [];
          return u.push(s.call(this, a)), n && (u = u.concat(n.call(this, a))), u;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return Ie.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return ze.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, r) => {
      let i = { ...r }, n = { ...this.defaults, ...i }, s = this.onError(!!n.silent, !!n.async);
      if (this.defaults.async === !0 && i.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (n.hooks && (n.hooks.options = n, n.hooks.block = t), n.async) return (async () => {
        let a = n.hooks ? await n.hooks.preprocess(e) : e, u = await (n.hooks ? await n.hooks.provideLexer() : t ? Ie.lex : Ie.lexInline)(a, n), l = n.hooks ? await n.hooks.processAllTokens(u) : u;
        n.walkTokens && await Promise.all(this.walkTokens(l, n.walkTokens));
        let o = await (n.hooks ? await n.hooks.provideParser() : t ? ze.parse : ze.parseInline)(l, n);
        return n.hooks ? await n.hooks.postprocess(o) : o;
      })().catch(s);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let a = (n.hooks ? n.hooks.provideLexer() : t ? Ie.lex : Ie.lexInline)(e, n);
        n.hooks && (a = n.hooks.processAllTokens(a)), n.walkTokens && this.walkTokens(a, n.walkTokens);
        let u = (n.hooks ? n.hooks.provideParser() : t ? ze.parse : ze.parseInline)(a, n);
        return n.hooks && (u = n.hooks.postprocess(u)), u;
      } catch (a) {
        return s(a);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + Ne(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Je = new Aa();
function re(t, e) {
  return Je.parse(t, e);
}
re.options = re.setOptions = function(t) {
  return Je.setOptions(t), re.defaults = Je.defaults, Wr(re.defaults), re;
};
re.getDefaults = $n;
re.defaults = et;
re.use = function(...t) {
  return Je.use(...t), re.defaults = Je.defaults, Wr(re.defaults), re;
};
re.walkTokens = function(t, e) {
  return Je.walkTokens(t, e);
};
re.parseInline = Je.parseInline;
re.Parser = ze;
re.parser = ze.parse;
re.Renderer = Kt;
re.TextRenderer = Hn;
re.Lexer = Ie;
re.lexer = Ie.lex;
re.Tokenizer = Xt;
re.Hooks = pt;
re.parse = re;
re.options;
re.setOptions;
re.use;
re.walkTokens;
re.parseInline;
ze.parse;
Ie.lex;
const rs = `function j() {
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
`, br = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", rs], { type: "text/javascript;charset=utf-8" });
function Ea(t) {
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
      "data:text/javascript;charset=utf-8," + encodeURIComponent(rs),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function Ra(t) {
  if (t.startsWith("---")) {
    const e = t.indexOf(`
---`, 3);
    if (e !== -1) {
      const r = t.slice(3, e + 0).trim(), i = t.slice(e + 4).trimStart(), n = {};
      return r.split(/\r?\n/).forEach((s) => {
        const a = s.match(/^([^:]+):\s*(.*)$/);
        a && (n[a[1].trim()] = a[2].trim());
      }), { content: i, data: n };
    }
  }
  return { content: t, data: {} };
}
const ss = Pr(() => new Ea(), "markdown"), yr = typeof DOMParser < "u" ? new DOMParser() : null;
function vn() {
  return ss.get();
}
function Ta(t) {
  return ss.send(t, 1e3);
}
const Xe = [];
function An(t) {
  if (t && typeof t == "object") {
    Xe.push(t);
    try {
      re.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function La(t) {
  Xe.length = 0, Array.isArray(t) && Xe.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Xe.forEach((e) => re.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Yt(t) {
  if (vn && vn())
    try {
      const s = await Ta({ type: "render", md: t });
      if (s && s.html !== void 0)
        try {
          const u = (yr || new DOMParser()).parseFromString(s.html, "text/html"), l = u.querySelectorAll("h1,h2,h3,h4,h5,h6");
          l.forEach((h) => {
            h.id || (h.id = ie(h.textContent || ""));
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
                      if (ce && typeof ce.getLanguage == "function" && ce.getLanguage("plaintext")) {
                        const x = ce.highlight(y, { language: "plaintext" });
                        x && x.value && (f.innerHTML = x.value);
                      }
                    } catch {
                      try {
                        ce.highlightElement(f);
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
          }), { html: o, meta: s.meta || {}, toc: c };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), s;
        }
    } catch (s) {
      console.warn("[markdown] worker render failed", s);
    }
  const { content: r, data: i } = Ra(t || "");
  if (re.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Xe && Xe.length)
    try {
      Xe.forEach((s) => re.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
  let n = re.parse(r);
  try {
    const a = (yr || new DOMParser()).parseFromString(n, "text/html"), u = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    u.forEach((o) => {
      o.id || (o.id = ie(o.textContent || ""));
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
                if (ce && typeof ce.getLanguage == "function" && ce.getLanguage("plaintext")) {
                  const w = ce.highlight(m, { language: "plaintext" });
                  w && w.value && (c.innerHTML = w.value);
                }
              } catch {
                try {
                  ce.highlightElement(c);
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
    }), { html: a.body.innerHTML, meta: i || {}, toc: l };
  } catch (s) {
    console.warn("post-process markdown failed", s);
  }
  return { html: n, meta: i || {}, toc: [] };
}
function En(t, e) {
  const r = /* @__PURE__ */ new Set(), i = /```\s*([a-zA-Z0-9_\-+]+)?/g, n = /* @__PURE__ */ new Set([
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
  ]), s = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
  let a;
  for (; a = i.exec(t); )
    if (a[1]) {
      const u = a[1].toLowerCase();
      if (Lr.has(u) || e && e.size && u.length < 3 && !e.has(u) && !(Te && Te[u] && e.has(Te[u]))) continue;
      if (e && e.size) {
        if (e.has(u)) {
          const o = e.get(u);
          o && r.add(o);
          continue;
        }
        if (Te && Te[u]) {
          const o = Te[u];
          if (e.has(o)) {
            const c = e.get(o) || o;
            r.add(c);
            continue;
          }
        }
      }
      (s.has(u) || u.length >= 5 && u.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(u) && !n.has(u)) && r.add(u);
    }
  return r;
}
const Ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: An,
  detectFenceLanguages: En,
  initRendererWorker: vn,
  markdownPlugins: Xe,
  parseMarkdownToHtml: Yt,
  setMarkdownExtensions: La
}, Symbol.toStringTag, { value: "Module" }));
function _a(t, e) {
  const r = document.createElement("aside");
  r.className = "menu nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = t("navigation"), r.appendChild(i);
  const n = document.createElement("ul");
  return n.className = "menu-list", e.forEach((s) => {
    const a = document.createElement("li"), u = document.createElement("a");
    if (u.href = "#" + s.path, u.textContent = s.name, a.appendChild(u), s.children && s.children.length) {
      const l = document.createElement("ul");
      s.children.forEach((o) => {
        const c = document.createElement("li"), h = document.createElement("a");
        h.href = "#" + o.path, h.textContent = o.name, c.appendChild(h), l.appendChild(c);
      }), a.appendChild(l);
    }
    n.appendChild(a);
  }), r.appendChild(n), r;
}
function Ma(t, e, r = "") {
  const i = document.createElement("aside");
  i.className = "menu nimbi-toc-inner";
  const n = document.createElement("p");
  n.className = "menu-label", n.textContent = t("onThisPage"), i.appendChild(n);
  const s = document.createElement("ul");
  return s.className = "menu-list", (e || []).forEach((a) => {
    try {
      if (!a || a.level === 1) return;
      const u = document.createElement("li"), l = document.createElement("a"), o = a.id || ie(a.text || "");
      l.textContent = a.text || "";
      try {
        const c = String(r || "").replace(/^[\.\/]+/, ""), h = c && U && U.has && U.has(c) ? U.get(c) : c;
        h ? l.href = `?page=${encodeURIComponent(h)}#${encodeURIComponent(o)}` : l.href = `#${encodeURIComponent(o)}`;
      } catch (c) {
        console.warn("[htmlBuilder] buildTocElement href normalization failed", c), l.href = `#${encodeURIComponent(o)}`;
      }
      u.appendChild(l), s.appendChild(u);
    } catch (u) {
      console.warn("[htmlBuilder] buildTocElement item failed", u, a);
    }
  }), i.appendChild(s), i;
}
function is(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((r) => {
    r.id || (r.id = ie(r.textContent || ""));
  });
}
function $a(t, e, r) {
  try {
    const i = t.querySelectorAll("img");
    if (i && i.length) {
      const n = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      i.forEach((s) => {
        const a = s.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const u = new URL(n + a, r).toString();
            s.src = u;
            try {
              s.getAttribute("loading") || s.setAttribute("data-want-lazy", "1");
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (u) {
            console.warn("[htmlBuilder] resolve image src failed", u);
          }
      });
    }
  } catch (i) {
    console.warn("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function kr(t, e, r) {
  try {
    const i = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
    let n = null;
    try {
      const a = new URL(r, location.href);
      n = new URL(i || ".", a).toString();
    } catch {
      try {
        n = new URL(i || ".", location.href).toString();
      } catch {
        n = i || "./";
      }
    }
    const s = t.querySelectorAll("*");
    for (const a of Array.from(s || []))
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
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let xr = "", dn = null, Sr = "";
async function as(t, e, r) {
  try {
    const i = t.querySelectorAll("a");
    if (!i || !i.length) return;
    let n, s;
    if (e === xr && dn)
      n = dn, s = Sr;
    else {
      try {
        n = new URL(e, location.href), s = vt(n.pathname);
      } catch {
        try {
          n = new URL(e, location.href), s = vt(n.pathname);
        } catch {
          n = null, s = "/";
        }
      }
      xr = e, dn = n, Sr = s;
    }
    const a = /* @__PURE__ */ new Set(), u = [], l = /* @__PURE__ */ new Set(), o = [];
    for (const c of Array.from(i))
      try {
        const h = c.getAttribute("href") || "";
        if (!h || Ir(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const p = new URL(h, e || location.href), d = p.searchParams.get("page");
              if (d && d.indexOf("/") === -1 && r) {
                const m = r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "";
                if (m) {
                  const w = de(m + d);
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
            let w = m.startsWith(s) ? m.slice(s.length) : m;
            w = de(w), u.push({ node: c, mdPathRaw: p, frag: d, rel: w }), U.has(w) || a.add(w);
          } catch (m) {
            console.warn("[htmlBuilder] resolve mdPath failed", m);
          }
          continue;
        }
        try {
          let p = h;
          !h.startsWith("/") && r && (h.startsWith("#") ? p = r + h : p = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + h);
          const m = new URL(p, e).pathname || "";
          if (m && m.indexOf(s) !== -1) {
            let w = m.startsWith(s) ? m.slice(s.length) : m;
            if (w = de(w), w = At(w), w || (w = "_home"), !w.endsWith(".md")) {
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
                  for (const [B, I] of Y || [])
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
          if (p && Y.has(p)) {
            try {
              const d = Y.get(p);
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
        const h = await ke(c, e);
        if (h && h.raw) {
          const f = (h.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = ie(f[1].trim());
            if (p)
              try {
                Y.set(p, c), U.set(c, p);
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
        const h = await ke(c, e);
        if (h && h.raw)
          try {
            const p = (Un || new DOMParser()).parseFromString(h.raw, "text/html"), d = p.querySelector("title"), m = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
            if (w) {
              const y = ie(w);
              if (y)
                try {
                  Y.set(y, c), U.set(c, y);
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
  } catch (i) {
    console.warn("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function Pa(t, e, r, i) {
  const n = e.querySelector("h1"), s = n ? (n.textContent || "").trim() : "";
  let a = "";
  try {
    s && (a = ie(s)), !a && t && t.meta && t.meta.title && (a = ie(t.meta.title)), !a && r && (a = ie(String(r))), a || (a = "_home");
    try {
      r && (Y.set(a, r), U.set(r, a));
    } catch (u) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", u);
    }
    try {
      let u = "?page=" + encodeURIComponent(a);
      try {
        const l = i || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
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
  return { topH1: n, h1Text: s, slugKey: a };
}
async function Ia(t, e) {
  if (!t || !t.length) return;
  const r = /* @__PURE__ */ new Set();
  for (const l of Array.from(t || []))
    try {
      const o = l.getAttribute("href") || "";
      if (!o) continue;
      let f = de(o).split(/::|#/, 2)[0];
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const p = f;
      try {
        if (U && U.has && U.has(p)) continue;
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
      r.add(p);
    } catch (o) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", o);
    }
  if (!r.size) return;
  const i = async (l) => {
    try {
      const o = await ke(l, e);
      if (o && o.raw)
        try {
          const h = (Un || new DOMParser()).parseFromString(o.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const m = ie(d);
            if (m)
              try {
                Y.set(m, l), U.set(l, m);
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
  }, n = 5, s = Array.from(r);
  let a = 0;
  const u = [];
  for (; a < s.length; ) {
    const l = s.slice(a, a + n);
    u.push(Promise.all(l.map(i))), a += n;
  }
  await Promise.all(u);
}
async function za(t, e) {
  if (!t || !t.length) return;
  const r = [], i = /* @__PURE__ */ new Set();
  let n = "";
  try {
    const s = new URL(e);
    n = vt(s.pathname);
  } catch (s) {
    n = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", s);
  }
  for (const s of Array.from(t || []))
    try {
      const a = s.getAttribute("href") || "";
      if (!a) continue;
      const u = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (u) {
        let l = de(u[1]);
        try {
          let o;
          try {
            o = new URL(l, e).pathname;
          } catch (h) {
            o = l, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const c = o.startsWith(n) ? o.slice(n.length) : o.replace(/^\//, "");
          r.push({ rel: c }), U.has(c) || i.add(c);
        } catch (o) {
          console.warn("[htmlBuilder] rewriteAnchors failed", o);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  i.size && await Promise.all(Array.from(i).map(async (s) => {
    try {
      const a = String(s).match(/([^\/]+)\.md$/), u = a && a[1];
      if (u && Y.has(u)) {
        try {
          const l = Y.get(u);
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
      const a = await ke(s, e);
      if (a && a.raw) {
        const u = (a.raw || "").match(/^#\s+(.+)$/m);
        if (u && u[1]) {
          const l = ie(u[1].trim());
          if (l)
            try {
              Y.set(l, s), U.set(s, l);
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
    is(r);
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
          const o = (l[1] || "").toLowerCase(), c = J.size && (J.get(o) || J.get(String(o).toLowerCase())) || o;
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
            if (ce && typeof ce.getLanguage == "function" && ce.getLanguage("plaintext")) {
              const o = ce.highlight ? ce.highlight(a.textContent || "", { language: "plaintext" }) : null;
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
async function Ba(t) {
  const e = En ? En(t || "", J) : /* @__PURE__ */ new Set(), r = new Set(e), i = [];
  for (const n of r)
    try {
      const s = J.size && (J.get(n) || J.get(String(n).toLowerCase())) || n;
      try {
        i.push(St(s));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(n) !== String(s))
        try {
          i.push(St(n));
        } catch (a) {
          console.warn("[htmlBuilder] ensureLanguages push alias failed", a);
        }
    } catch (s) {
      console.warn("[htmlBuilder] ensureLanguages inner failed", s);
    }
  try {
    await Promise.all(i);
  } catch (n) {
    console.warn("[htmlBuilder] ensureLanguages failed", n);
  }
}
async function Oa(t) {
  if (await Ba(t), Yt) {
    const e = await Yt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Na(t, e, r, i, n) {
  let s = null;
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
        s = pn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : e.raw || "");
      } else
        s = pn(e.raw || "");
    } catch {
      s = pn(e.raw || "");
    }
  else
    s = await Oa(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = s.html;
  try {
    kr(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    is(a);
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
    ci(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  $a(a, r, n);
  const { topH1: u, h1Text: l, slugKey: o } = Pa(s, a, r, i);
  try {
    await Da(a, n, r);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await as(a, n, r);
  }
  const c = Ma(t, s.toc, r);
  return { article: a, parsed: s, toc: c, topH1: u, h1Text: l, slugKey: o };
}
function vr(t, e, r) {
  t && (t.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const n = document.createElement("h1");
  n.textContent = e && e("notFound") || "Page not found";
  const s = document.createElement("p");
  s.textContent = r && r.message ? String(r.message) : "Failed to resolve the requested page.", i.appendChild(n), i.appendChild(s), t && t.appendChild && t.appendChild(i);
}
async function Da(t, e, r) {
  return as(t, e, r);
}
function Ha(t) {
  try {
    t.addEventListener("click", (e) => {
      const r = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!r) return;
      const i = r.getAttribute("href") || "";
      try {
        const n = new URL(i, location.href), s = n.searchParams.get("page"), a = n.hash ? n.hash.replace(/^#/, "") : null;
        if (!s && !a) return;
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
        if (!s && a || s && u && String(s) === String(u)) {
          try {
            if (!s && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: u || s }, "", "?page=" + encodeURIComponent(u || s) + (a ? "#" + encodeURIComponent(a) : ""));
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
        history.pushState({ page: s }, "", "?page=" + encodeURIComponent(s) + (a ? "#" + encodeURIComponent(a) : ""));
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
        const i = () => {
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
                } catch (s) {
                  console.warn("[htmlBuilder] scrollIntoView failed", s);
                }
              }
          } catch {
            try {
              r.scrollIntoView();
            } catch (s) {
              console.warn("[htmlBuilder] final scroll fallback failed", s);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (n) {
          console.warn("[htmlBuilder] scheduling scroll failed", n), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          r.scrollIntoView();
        } catch (n) {
          console.warn("[htmlBuilder] final scroll fallback failed", n);
        }
        console.warn("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      e && e.scrollTo ? e.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (r) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        console.warn("[htmlBuilder] window.scrollTo failed", i);
      }
      console.warn("[htmlBuilder] scroll to top failed", r);
    }
}
function Ua(t, e, { mountOverlay: r = null, container: i = null, mountEl: n = null, navWrap: s = null, t: a = null } = {}) {
  try {
    const u = a || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), o = n || document.querySelector(".nimbi-mount"), c = r || document.querySelector(".nimbi-overlay"), h = s || document.querySelector(".nimbi-nav-wrap");
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
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : n && n.scrollTo ? n.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
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
        }, { root: i instanceof Element ? i : n instanceof Element ? n : null, threshold: 0 });
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
      const m = i instanceof Element ? i : n instanceof Element ? n : window, w = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (p.classList.add("show"), d && d.classList.add("show")) : (p.classList.remove("show"), d && d.classList.remove("show"));
        } catch (y) {
          console.warn("[htmlBuilder] onScroll handler failed", y);
        }
      };
      Ft(() => m.addEventListener("scroll", w)), w();
    }
  } catch (u) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", u);
  }
}
async function qa(t, e, r, i, n, s, a, u, l = "eager", o = 1, c = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, f = h ? h.parseFromString(r || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Ft(() => Ia(p, i)), await Ft(() => za(p, i));
  let d = null, m = null, w = !1;
  const y = document.createElement("nav");
  y.className = "navbar", y.setAttribute("role", "navigation"), y.setAttribute("aria-label", "main navigation");
  const x = document.createElement("div");
  x.className = "navbar-brand";
  const B = p[0], I = document.createElement("a");
  if (I.className = "navbar-item", B) {
    const T = B.getAttribute("href") || "#";
    try {
      const L = new URL(T, location.href).searchParams.get("page");
      L ? I.href = "?page=" + encodeURIComponent(decodeURIComponent(L)) : (I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home"));
    } catch {
      I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home");
    }
  } else
    I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home");
  x.appendChild(I), I.addEventListener("click", function(T) {
    const $ = I.getAttribute("href") || "";
    if ($.startsWith("?page=")) {
      T.preventDefault();
      const L = new URL($, location.href), v = L.searchParams.get("page"), b = L.hash ? L.hash.replace(/^#/, "") : null;
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
        const $ = A.dataset && A.dataset.target ? A.dataset.target : null, L = $ ? document.getElementById($) : null;
        A.classList.contains("is-active") ? (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), L && L.classList.remove("is-active")) : (A.classList.add("is-active"), A.setAttribute("aria-expanded", "true"), L && L.classList.add("is-active"));
      } catch ($) {
        console.warn("[nimbi-cms] navbar burger toggle failed", $);
      }
    });
  } catch (T) {
    console.warn("[nimbi-cms] burger event binding failed", T);
  }
  const O = document.createElement("div");
  O.className = "navbar-menu", O.id = q;
  const Q = document.createElement("div");
  Q.className = "navbar-start";
  let V, ne, P;
  if (!u)
    V = null, m = null, P = null;
  else {
    V = document.createElement("div"), V.className = "navbar-end", ne = document.createElement("div"), ne.className = "navbar-item", ne.style.position = "relative", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = s("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0, m.classList.add("is-loading")), ne.appendChild(m), P = document.createElement("div"), P.id = "nimbi-search-results", P.className = "box", P.style.position = "absolute", P.style.top = "100%", P.style.right = "0", P.style.left = "auto", P.style.zIndex = "10000", P.style.minWidth = "240px", P.style.maxWidth = "420px", P.style.maxHeight = "50vh", P.style.overflowY = "auto", P.style.display = "none", P.style.padding = "8px", P.style.boxShadow = "0 6px 18px rgba(10,10,10,0.1)", ne.appendChild(P), V.appendChild(ne);
    const T = (L) => {
      if (P.innerHTML = "", !L.length) {
        P.style.display = "none";
        return;
      }
      L.forEach((v) => {
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
    }, $ = (L, v) => {
      let b = null;
      return (...E) => {
        b && clearTimeout(b), b = setTimeout(() => L(...E), v);
      };
    };
    if (m) {
      const L = $(async () => {
        const v = document.querySelector("input#nimbi-search"), b = String(v && v.value || "").trim().toLowerCase();
        if (!b) {
          T([]);
          return;
        }
        try {
          const E = await Promise.resolve().then(() => Ut);
          d || (d = (async () => {
            try {
              return l === "lazy" && E.buildSearchIndexWorker ? E.buildSearchIndexWorker(i, o, c) : E.buildSearchIndex(i, o, c);
            } catch (X) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", X), [];
            } finally {
              v && (v.removeAttribute("disabled"), v.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((X) => X.title && X.title.toLowerCase().includes(b) || X.excerpt && X.excerpt.toLowerCase().includes(b));
          T(k.slice(0, 10));
        } catch (E) {
          console.warn("[nimbi-cms] search input handler failed", E), T([]);
        }
      }, 50);
      m && m.addEventListener("input", L), document.addEventListener("click", (v) => {
        const b = document.querySelector("input#nimbi-search");
        b && !b.contains(v.target) && P && !P.contains(v.target) && (P.style.display = "none");
      });
    }
    if (l === "eager") {
      try {
        d = (async () => {
          try {
            const v = await (await Promise.resolve().then(() => Ut)).buildSearchIndex(i, o, c);
            return w || (w = !0), v;
          } catch (L) {
            return console.warn("[nimbi-cms] buildSearchIndex failed", L), [];
          }
        })();
      } catch (L) {
        console.warn("[nimbi-cms] eager search index init failed", L), d = Promise.resolve([]);
      }
      d.finally(() => {
        const L = document.querySelector("input#nimbi-search");
        L && (L.removeAttribute("disabled"), L.classList.remove("is-loading"));
      });
    }
  }
  for (let T = 0; T < p.length; T++) {
    const $ = p[T];
    if (T === 0) continue;
    const L = $.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(L) || L.endsWith(".md")) {
        const E = de(L).split(/::|#/, 2), M = E[0], k = E[1];
        v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
      } else if (/\.html(?:$|[#?])/.test(L) || L.endsWith(".html")) {
        const E = de(L).split(/::|#/, 2);
        let M = E[0];
        M && !M.toLowerCase().endsWith(".html") && (M = M + ".html");
        const k = E[1];
        try {
          const X = await ke(M, i);
          if (X && X.raw)
            try {
              const xe = new DOMParser().parseFromString(X.raw, "text/html"), be = xe.querySelector("title"), j = xe.querySelector("h1"), ue = be && be.textContent && be.textContent.trim() ? be.textContent.trim() : j && j.textContent ? j.textContent.trim() : null;
              if (ue) {
                const se = ie(ue);
                if (se) {
                  try {
                    Y.set(se, M), U.set(M, se);
                  } catch (_e) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", _e);
                  }
                  v.href = "?page=" + encodeURIComponent(se) + (k ? "#" + encodeURIComponent(k) : "");
                } else
                  v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
              } else
                v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
            } catch {
              v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
            }
          else
            v.href = L;
        } catch {
          v.href = L;
        }
      } else
        v.href = L;
    } catch (b) {
      console.warn("[nimbi-cms] nav item href parse failed", b), v.href = L;
    }
    try {
      const b = $.textContent && String($.textContent).trim() ? String($.textContent).trim() : null;
      if (b)
        try {
          const E = ie(b);
          if (E) {
            const M = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const X = new URL(M, location.href).searchParams.get("page");
              if (X) {
                const he = decodeURIComponent(X);
                try {
                  Y.set(E, he), U.set(he, E);
                } catch (xe) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", xe);
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
    v.textContent = $.textContent || L, Q.appendChild(v);
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
    }, L = (v, b) => {
      let E = null;
      return (...M) => {
        E && clearTimeout(E), E = setTimeout(() => v(...M), b);
      };
    };
    if (m) {
      const v = L(async () => {
        const b = String(m.value || "").trim().toLowerCase();
        if (!b) {
          $([]);
          return;
        }
        try {
          const E = await Promise.resolve().then(() => Ut);
          d || (d = (async () => {
            try {
              return l === "lazy" && E.buildSearchIndexWorker ? E.buildSearchIndexWorker(i, o, c) : E.buildSearchIndex(i, o, c);
            } catch (X) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", X), [];
            } finally {
              m && (m.disabled = !1, m.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((X) => X.title && X.title.toLowerCase().includes(b) || X.excerpt && X.excerpt.toLowerCase().includes(b));
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
  O.appendChild(Q), V && O.appendChild(V), y.appendChild(x), y.appendChild(O), t.appendChild(y);
  try {
    O.addEventListener("click", (T) => {
      const $ = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!$) return;
      const L = $.getAttribute("href") || "";
      try {
        const v = new URL(L, location.href), b = v.searchParams.get("page"), E = v.hash ? v.hash.replace(/^#/, "") : null;
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
      const L = $.getAttribute("href") || "";
      if (L && !Ir(L))
        try {
          const v = new URL(L, location.href), b = v.searchParams.get("page"), E = v.hash ? v.hash.replace(/^#/, "") : null;
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
function ja() {
  if (Ar) return fn;
  Ar = 1;
  function t(s, a) {
    return a.some(
      ([u, l]) => u <= s && s <= l
    );
  }
  function e(s) {
    if (typeof s != "string")
      return !1;
    const a = s.charCodeAt(0);
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
  function r(s) {
    return ` 
\r	`.includes(s);
  }
  function i(s) {
    if (typeof s != "string")
      return !1;
    const a = s.charCodeAt(0);
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
  function n(s, a = {}) {
    let u = 0, l = 0, o = s.length - 1;
    const c = a.wordsPerMinute || 200, h = a.wordBound || r;
    for (; h(s[l]); ) l++;
    for (; h(s[o]); ) o--;
    const f = `${s}
`;
    for (let w = l; w <= o; w++)
      if ((e(f[w]) || !h(f[w]) && (h(f[w + 1]) || e(f[w + 1]))) && u++, e(f[w]))
        for (; w <= o && (i(f[w + 1]) || h(f[w + 1])); )
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
var Fa = ja();
const Wa = /* @__PURE__ */ Tr(Fa);
function Er(t, e) {
  let r = document.querySelector(`meta[name="${t}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", t), document.head.appendChild(r)), r.setAttribute("content", e);
}
function rt(t, e, r) {
  let i = `meta[${t}="${e}"]`, n = document.querySelector(i);
  n || (n = document.createElement("meta"), n.setAttribute(t, e), document.head.appendChild(n)), n.setAttribute("content", r);
}
function Za(t, e) {
  try {
    let r = document.querySelector(`link[rel="${t}"]`);
    r || (r = document.createElement("link"), r.setAttribute("rel", t), document.head.appendChild(r)), r.setAttribute("href", e);
  } catch (r) {
    console.warn("[seoManager] upsertLinkRel failed", r);
  }
}
function Ga(t, e, r, i) {
  const n = e && String(e).trim() ? e : t.title || document.title;
  rt("property", "og:title", n);
  const s = i && String(i).trim() ? i : t.description || "";
  s && String(s).trim() && rt("property", "og:description", s), rt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = r || t.image;
  a && (rt("property", "og:image", a), rt("name", "twitter:image", a));
}
function Qa(t, e, r, i, n = "") {
  const s = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", u = i && String(i).trim() ? i : s.description && String(s.description).trim() ? s.description : a && String(a).trim() ? a : "";
  u && String(u).trim() && Er("description", u), Er("robots", s.robots || "index,follow"), Ga(s, e, r, u);
}
function Xa() {
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
        const i = r.getAttribute("content") || "";
        if (i && i.trim()) return i.trim();
      }
    }
  } catch (t) {
    console.warn("[seoManager] getSiteNameFromMeta failed", t);
  }
  return "";
}
function Ka(t, e, r, i, n, s = "") {
  try {
    const a = t.meta || {}, u = r && String(r).trim() ? r : a.title || s || document.title, l = n && String(n).trim() ? n : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = i || a.image || null;
    let c = "";
    try {
      if (e) {
        const d = de(e);
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
    c && Za("canonical", c);
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
function Ya(t, e, r, i, n, s, a, u, l, o, c) {
  try {
    const h = i.querySelector(".menu-label");
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
      Qa(r, l, p, d);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      Ka(r, o, l, p, d, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Xa();
    l ? m ? document.title = `${m} - ${l}` : document.title = `${e || "Site"} - ${l}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = n.querySelector(".nimbi-reading-time");
    if (h && h.remove(), l) {
      const f = Wa(c.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = n.querySelector("h1");
      m && m.insertAdjacentElement("afterend", d);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let ve = null, W = null, Ae = 1, Ze = (t, e) => e, bt = 0, yt = 0, qt = () => {
}, ft = 0.25;
function Va() {
  if (ve && document.contains(ve)) return ve;
  ve = null;
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
    if (!ne()) return;
    b.preventDefault();
    const E = b.deltaY < 0 ? ft : -ft;
    qe(Ae + E), o(), c();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      gn();
      return;
    }
    if (Ae > 1) {
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
  }), document.body.appendChild(t), ve = t, W = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), r = t.querySelector("[data-nimbi-preview-original]"), i = t.querySelector("[data-nimbi-preview-zoom-in]"), n = t.querySelector("[data-nimbi-preview-zoom-out]"), s = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), u = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function o() {
    u && (u.textContent = `${Math.round(Ae * 100)}%`);
  }
  const c = () => {
    l && (l.textContent = `${Math.round(Ae * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  qt = o, i.addEventListener("click", () => {
    qe(Ae + ft), o(), c();
  }), n.addEventListener("click", () => {
    qe(Ae - ft), o(), c();
  }), e.addEventListener("click", () => {
    kt(), o(), c();
  }), r.addEventListener("click", () => {
    qe(1), o(), c();
  }), s.addEventListener("click", () => {
    kt(), o(), c();
  }), a.addEventListener("click", gn), e.title = Ze("imagePreviewFit", "Fit to screen"), r.title = Ze("imagePreviewOriginal", "Original size"), n.title = Ze("imagePreviewZoomOut", "Zoom out"), i.title = Ze("imagePreviewZoomIn", "Zoom in"), a.title = Ze("imagePreviewClose", "Close"), a.setAttribute("aria-label", Ze("imagePreviewClose", "Close"));
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
  const Q = (b) => {
    const E = Date.now(), M = E - A, k = b.clientX - q, X = b.clientY - O;
    A = E, q = b.clientX, O = b.clientY, M < 300 && Math.hypot(k, X) < 30 && (qe(Ae > 1 ? 1 : 2), o(), b.preventDefault());
  }, V = (b) => {
    qe(Ae > 1 ? 1 : 2), o(), b.preventDefault();
  }, ne = () => ve ? typeof ve.open == "boolean" ? ve.open : ve.classList.contains("is-active") : !1, P = (b, E, M = 1) => {
    if (w.has(M) && w.set(M, { x: b, y: E }), w.size === 2) {
      const xe = Array.from(w.values()), be = B(xe[0], xe[1]);
      if (y > 0) {
        const j = be / y;
        qe(x * j);
      }
      return;
    }
    if (!h) return;
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    if (!k) return;
    const X = b - f, he = E - p;
    k.scrollLeft = d - X, k.scrollTop = m - he;
  }, T = (b, E, M = 1) => {
    if (!ne()) return;
    if (w.set(M, { x: b, y: E }), w.size === 2) {
      const he = Array.from(w.values());
      y = B(he[0], he[1]), x = Ae;
      return;
    }
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    !k || !(k.scrollWidth > k.clientWidth || k.scrollHeight > k.clientHeight) || (h = !0, f = b, p = E, d = k.scrollLeft, m = k.scrollTop, W.style.cursor = "all-scroll", window.addEventListener("pointermove", $), window.addEventListener("pointerup", L), window.addEventListener("pointercancel", L));
  }, $ = (b) => {
    h && (b.preventDefault(), P(b.clientX, b.clientY, b.pointerId));
  }, L = () => {
    I(), window.removeEventListener("pointermove", $), window.removeEventListener("pointerup", L), window.removeEventListener("pointercancel", L);
  };
  W.addEventListener("pointerdown", (b) => {
    b.preventDefault(), T(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointermove", (b) => {
    (h || w.size === 2) && b.preventDefault(), P(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && Q(b), I();
  }), W.addEventListener("dblclick", V), W.addEventListener("pointercancel", I), W.addEventListener("mousedown", (b) => {
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
function qe(t) {
  if (!W) return;
  const e = Number(t);
  Ae = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const i = W.getBoundingClientRect(), n = bt || W.naturalWidth || W.width || i.width || 0, s = yt || W.naturalHeight || W.height || i.height || 0;
  n && s ? (W.style.maxWidth = "none", W.style.maxHeight = "none", W.style.width = `${n * Ae}px`, W.style.height = `${s * Ae}px`, W.style.transform = "") : (W.style.maxWidth = "", W.style.maxHeight = "", W.style.width = "", W.style.height = "", W.style.transform = `scale(${Ae})`), W && (W.style.cursor = "all-scroll");
}
function kt() {
  if (!W) return;
  const t = W.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const r = bt || W.naturalWidth || e.width, i = yt || W.naturalHeight || e.height;
  if (!r || !i) return;
  const n = e.width / r, s = e.height / i, a = Math.min(n, s, 1);
  qe(Number.isFinite(a) ? a : 1);
}
function Ja(t, e = "", r = 0, i = 0) {
  const n = Va();
  Ae = 1, bt = r || 0, yt = i || 0, W.src = t, W.alt = e, W.style.transform = "scale(1)";
  const s = () => {
    bt = W.naturalWidth || W.width || 0, yt = W.naturalHeight || W.height || 0;
  };
  if (s(), kt(), qt(), requestAnimationFrame(() => {
    kt(), qt();
  }), !bt || !yt) {
    const a = () => {
      s(), requestAnimationFrame(() => {
        kt(), qt();
      }), W.removeEventListener("load", a);
    };
    W.addEventListener("load", a);
  }
  typeof n.showModal == "function" && (n.open || n.showModal()), n.classList.add("is-active"), n.focus();
}
function gn() {
  ve && (typeof ve.close == "function" && ve.open && ve.close(), ve.classList.remove("is-active"));
}
function el(t, { t: e, zoomStep: r = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Ze = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, ft = r, t.addEventListener("click", (p) => {
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
      Ja(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
    }
  });
  let i = !1, n = 0, s = 0, a = 0, u = 0;
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
    if (!d || d.tagName !== "IMG" || !ve || !ve.open) return;
    if (l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      const w = Array.from(l.values());
      o = h(w[0], w[1]), c = Ae;
      return;
    }
    const m = d.closest(".nimbi-image-preview__image-wrapper");
    m && (Ae <= 1 || (p.preventDefault(), i = !0, n = p.clientX, s = p.clientY, a = m.scrollLeft, u = m.scrollTop, d.setPointerCapture(p.pointerId), d.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (l.has(p.pointerId) && l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      p.preventDefault();
      const x = Array.from(l.values()), B = h(x[0], x[1]);
      if (o > 0) {
        const I = B / o;
        qe(c * I);
      }
      return;
    }
    if (!i) return;
    p.preventDefault();
    const m = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = p.clientX - n, y = p.clientY - s;
    m.scrollLeft = a - w, m.scrollTop = u - y;
  });
  const f = () => {
    i = !1, l.clear(), o = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function tl(t) {
  const {
    contentWrap: e,
    navWrap: r,
    container: i,
    mountOverlay: n = null,
    t: s,
    contentBase: a,
    homePage: u,
    initialDocumentTitle: l,
    runHooks: o
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const h = _a(s, [{ path: u, name: s("home"), isIndex: !0, children: [] }]);
  async function f(y, x) {
    let B, I, A;
    try {
      ({ data: B, pagePath: I, anchor: A } = await zi(y, a));
    } catch (T) {
      console.error("[nimbi-cms] fetchPageData failed", T), vr(e, s, T);
      return;
    }
    !A && x && (A = x);
    try {
      Rn(null);
    } catch (T) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", T);
    }
    e.innerHTML = "";
    const { article: q, parsed: O, toc: Q, topH1: V, h1Text: ne, slugKey: P } = await Na(s, B, I, A, a);
    Ya(s, l, O, Q, q, I, A, V, ne, P, B), r.innerHTML = "", r.appendChild(Q), Ha(Q);
    try {
      await o("transformHtml", { article: q, parsed: O, toc: Q, pagePath: I, anchor: A, topH1: V, h1Text: ne, slugKey: P, data: B });
    } catch (T) {
      console.warn("[nimbi-cms] transformHtml hooks failed", T);
    }
    e.appendChild(q);
    try {
      el(q, { t: s });
    } catch (T) {
      console.warn("[nimbi-cms] attachImagePreview failed", T);
    }
    try {
      Ot(i, 100, !1), requestAnimationFrame(() => Ot(i, 100, !1)), setTimeout(() => Ot(i, 100, !1), 250);
    } catch (T) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", T);
    }
    Rn(A), Ua(q, V, { mountOverlay: n, container: i, navWrap: r, t: s });
    try {
      await o("onPageLoad", { data: B, pagePath: I, anchor: A, article: q, toc: Q, topH1: V, h1Text: ne, slugKey: P, contentWrap: e, navWrap: r });
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
      console.warn("[nimbi-cms] renderByQuery failed for", y, B), vr(e, s, B);
    }
  }
  window.addEventListener("popstate", p);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const y = i || document.querySelector(".nimbi-cms");
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
      const y = i || document.querySelector(".nimbi-cms");
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
        w(), Ot(i, 100, !1);
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
function nl(t) {
  try {
    const e = typeof t == "string" ? t : typeof window < "u" && window.location ? window.location.search : "";
    if (!e) return {};
    const r = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), i = {}, n = (s) => {
      if (s == null) return;
      const a = String(s).toLowerCase();
      if (a === "1" || a === "true" || a === "yes") return !0;
      if (a === "0" || a === "false" || a === "no") return !1;
    };
    if (r.has("contentPath") && (i.contentPath = r.get("contentPath")), r.has("searchIndex")) {
      const s = n(r.get("searchIndex"));
      typeof s == "boolean" && (i.searchIndex = s);
    }
    if (r.has("searchIndexMode")) {
      const s = r.get("searchIndexMode");
      (s === "eager" || s === "lazy") && (i.searchIndexMode = s);
    }
    if (r.has("defaultStyle")) {
      const s = r.get("defaultStyle");
      (s === "light" || s === "dark") && (i.defaultStyle = s);
    }
    if (r.has("bulmaCustomize") && (i.bulmaCustomize = r.get("bulmaCustomize")), r.has("lang") && (i.lang = r.get("lang")), r.has("l10nFile")) {
      const s = r.get("l10nFile");
      i.l10nFile = s === "null" ? null : s;
    }
    if (r.has("cacheTtlMinutes")) {
      const s = Number(r.get("cacheTtlMinutes"));
      Number.isFinite(s) && s >= 0 && (i.cacheTtlMinutes = s);
    }
    if (r.has("cacheMaxEntries")) {
      const s = Number(r.get("cacheMaxEntries"));
      Number.isInteger(s) && s >= 0 && (i.cacheMaxEntries = s);
    }
    if (r.has("homePage") && (i.homePage = r.get("homePage")), r.has("notFoundPage") && (i.notFoundPage = r.get("notFoundPage")), r.has("availableLanguages") && (i.availableLanguages = r.get("availableLanguages").split(",").map((s) => s.trim()).filter(Boolean)), r.has("indexDepth")) {
      const s = Number(r.get("indexDepth"));
      Number.isInteger(s) && (s === 1 || s === 2 || s === 3) && (i.indexDepth = s);
    }
    if (r.has("noIndexing")) {
      const a = (r.get("noIndexing") || "").split(",").map((u) => u.trim()).filter(Boolean);
      a.length && (i.noIndexing = a);
    }
    return i;
  } catch {
    return {};
  }
}
function rl(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function Rr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let mn = "";
async function fl(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = nl();
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
    el: i,
    contentPath: n = "/content",
    crawlMaxQueue: s = 1e3,
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
  if (r.contentPath != null && !rl(r.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (r.homePage != null && !Rr(r.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (r.notFoundPage != null && !Rr(r.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let A = i;
  if (typeof i == "string") {
    if (A = document.querySelector(i), !A) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
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
    zr(!!I);
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
  const Q = document.createElement("div");
  Q.className = "columns";
  const V = document.createElement("div");
  V.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", V.setAttribute("role", "navigation");
  try {
    const k = typeof dt == "function" ? dt("navigation") : null;
    k && V.setAttribute("aria-label", k);
  } catch (k) {
    console.warn("[nimbi-cms] set nav aria-label failed", k);
  }
  Q.appendChild(V);
  const ne = document.createElement("div");
  ne.className = "column nimbi-content", ne.setAttribute("role", "main"), Q.appendChild(ne), O.appendChild(Q);
  const P = V, T = ne;
  A.appendChild(O);
  let $ = null;
  try {
    $ = A.querySelector(".nimbi-overlay"), $ || ($ = document.createElement("div"), $.className = "nimbi-overlay", A.appendChild($));
  } catch (k) {
    $ = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
  }
  const L = location.pathname || "/", v = L.endsWith("/") ? L : L.substring(0, L.lastIndexOf("/") + 1);
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
  p && await Mr(p, v), y && Array.isArray(y) && Br(y), f && $r(f);
  const M = tl({ contentWrap: T, navWrap: P, container: O, mountOverlay: $, t: dt, contentBase: E, homePage: x, initialDocumentTitle: mn, runHooks: sr });
  if (typeof d == "number" && d >= 0 && typeof ur == "function" && ur(d * 60 * 1e3), typeof m == "number" && m >= 0 && typeof cr == "function" && cr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((k) => {
        typeof k == "object" && Ca && typeof An == "function" && An(k);
      });
    } catch (k) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", k);
    }
  try {
    typeof s == "number" && Promise.resolve().then(() => Ut).then(({ setDefaultCrawlMaxQueue: k }) => {
      try {
        k(s);
      } catch (X) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", X);
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
    await ke(x, E);
  } catch (k) {
    throw x === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${x} not found at ${E}${x}: ${k.message}`);
  }
  di(c), await hi(h, v);
  try {
    const k = document.createElement("header");
    k.className = "nimbi-site-navbar", A.insertBefore(k, O);
    const X = await ke("_navigation.md", E), he = await Yt(X.raw || ""), { navbar: xe, linkEls: be } = await qa(k, O, he.html || "", E, x, dt, M.renderByQuery, q, u, l, o);
    try {
      await sr("onNavBuild", { navWrap: P, navbar: xe, linkEls: be, contentBase: E });
    } catch (j) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", j);
    }
    try {
      const j = () => {
        const ue = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
        if (ue > 0) {
          try {
            A.style.setProperty("--nimbi-site-navbar-height", `${ue}px`);
          } catch (se) {
            console.warn("[nimbi-cms] set CSS var failed", se);
          }
          try {
            O.style.paddingTop = "";
          } catch (se) {
            console.warn("[nimbi-cms] set container paddingTop failed", se);
          }
          try {
            const se = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.clientHeight || 0;
            if (se > 0) {
              const _e = Math.max(0, se - ue);
              try {
                O.style.boxSizing = "border-box";
              } catch ($e) {
                console.warn("[nimbi-cms] set container boxSizing failed", $e);
              }
              try {
                O.style.height = `${_e}px`;
              } catch ($e) {
                console.warn("[nimbi-cms] set container height failed", $e);
              }
              try {
                O.style.setProperty("--nimbi-cms-height", `${_e}px`);
              } catch ($e) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", $e);
              }
            } else {
              try {
                O.style.height = "calc(100vh - var(--nimbi-site-navbar-height))";
              } catch (_e) {
                console.warn("[nimbi-cms] set container height failed", _e);
              }
              try {
                O.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
              } catch (_e) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", _e);
              }
            }
          } catch (se) {
            console.warn("[nimbi-cms] compute container height failed", se);
          }
          try {
            k.style.setProperty("--nimbi-site-navbar-height", `${ue}px`);
          } catch (se) {
            console.warn("[nimbi-cms] set navbar CSS var failed", se);
          }
        }
      };
      j();
      try {
        if (typeof ResizeObserver < "u") {
          const ue = new ResizeObserver(() => j());
          try {
            ue.observe(k);
          } catch (se) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", se);
          }
        }
      } catch (ue) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", ue);
      }
    } catch (j) {
      console.warn("[nimbi-cms] compute navbar height failed", j);
    }
  } catch (k) {
    console.warn("[nimbi-cms] build navigation failed", k);
  }
  await M.renderByQuery();
  try {
    Promise.resolve().then(() => il).then(({ getVersion: k }) => {
      typeof k == "function" && k().then((X) => {
        try {
          const he = X || "0.0.0";
          try {
            const xe = (be) => {
              const j = document.createElement("a");
              j.className = "nimbi-version-label tag is-small", j.textContent = `Ninbi CMS v. ${he}`, j.href = be || "#", j.target = "_blank", j.rel = "noopener noreferrer nofollow", j.setAttribute("aria-label", `Ninbi CMS version ${he}`), j.style.position = "absolute", j.style.left = "8px", j.style.bottom = "6px", j.style.fontSize = "11px", j.style.opacity = "0.6", j.style.zIndex = "9999", j.style.userSelect = "none", j.style.transition = "opacity 150ms ease", j.addEventListener("mouseenter", () => {
                try {
                  j.style.opacity = "0.95", j.classList.add("has-text-weight-semibold");
                } catch {
                }
              }), j.addEventListener("mouseleave", () => {
                try {
                  j.style.opacity = "0.6", j.classList.remove("has-text-weight-semibold");
                } catch {
                }
              });
              const ue = () => {
                try {
                  const se = document.documentElement.getAttribute("data-theme") === "dark" || document.body.classList.contains("is-dark");
                  j.classList.toggle("is-dark", se), j.classList.toggle("is-light", !se);
                } catch {
                }
              };
              ue();
              try {
                const se = new MutationObserver((_e) => {
                  for (const $e of _e)
                    $e.type === "attributes" && ($e.attributeName === "data-theme" || $e.attributeName === "class") && ue();
                });
                se.observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme"] }), se.observe(document.body, { attributes: !0, attributeFilter: ["class"] });
              } catch {
              }
              try {
                A.appendChild(j);
              } catch (se) {
                console.warn("[nimbi-cms] append version label failed", se);
              }
            };
            (async () => {
              try {
                const be = await Promise.resolve().then(() => ks).catch(() => null), j = be && (be.default || be);
                let ue = null;
                j && (j.homepage && typeof j.homepage == "string" ? ue = j.homepage : j.repository && (typeof j.repository == "string" ? ue = j.repository : j.repository.url && typeof j.repository.url == "string" && (ue = j.repository.url)));
                try {
                  ue && new URL(ue);
                } catch {
                  ue = null;
                }
                xe(ue || "#");
              } catch {
                xe("#");
              }
            })();
          } catch (xe) {
            console.warn("[nimbi-cms] building version label failed", xe);
          }
        } catch (he) {
          console.warn("[nimbi-cms] building version label failed", he);
        }
      }).catch((X) => {
        console.warn("[nimbi-cms] getVersion() failed", X);
      });
    }).catch((k) => {
      console.warn("[nimbi-cms] import version module failed", k);
    });
  } catch (k) {
    console.warn("[nimbi-cms] version label setup failed", k);
  }
}
async function sl() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => ks);
    } catch {
      try {
        if (typeof fetch == "function" && typeof location < "u") {
          const i = new URL("../package.json", location.href).toString(), n = await fetch(i);
          n && n.ok ? t = { default: await n.json() } : t = null;
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
const il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: sl
}, Symbol.toStringTag, { value: "Module" })), ls = "nimbi-cms", os = "0.1.0", cs = { type: "git", url: "git+https://github.com/AbelVM/nimbiCMS.git" }, us = "https://abelvm.github.io/nimbiCMS/", hs = "module", ds = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, ps = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, fs = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, gs = "dist/nimbi-cms.cjs.js", ms = "dist/nimbi-cms.es.js", ws = "src/index.d.ts", bs = "dist/nimbi-cms.js", ys = ["dist", "src/index.d.ts"], al = {
  name: ls,
  version: os,
  repository: cs,
  homepage: us,
  private: !0,
  type: hs,
  scripts: ds,
  dependencies: ps,
  devDependencies: fs,
  main: gs,
  module: ms,
  types: ws,
  unpkg: bs,
  files: ys
}, ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: al,
  dependencies: ps,
  devDependencies: fs,
  files: ys,
  homepage: us,
  main: gs,
  module: ms,
  name: ls,
  repository: cs,
  scripts: ds,
  type: hs,
  types: ws,
  unpkg: bs,
  version: os
}, Symbol.toStringTag, { value: "Module" }));
export {
  Lr as BAD_LANGUAGES,
  J as SUPPORTED_HLJS_MAP,
  hl as _clearHooks,
  Tn as addHook,
  fl as default,
  hi as ensureBulma,
  sl as getVersion,
  Mr as loadL10nFile,
  Cr as loadSupportedLanguages,
  ci as observeCodeBlocks,
  cl as onNavBuild,
  ol as onPageLoad,
  St as registerLanguage,
  sr as runHooks,
  dl as setHighlightTheme,
  $r as setLang,
  di as setStyle,
  pl as setThemeVars,
  dt as t,
  ul as transformHtml
};
