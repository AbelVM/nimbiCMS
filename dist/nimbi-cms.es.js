const kt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Rn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(kt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  kt[t].push(e);
}
function al(t) {
  Rn("onPageLoad", t);
}
function ll(t) {
  Rn("onNavBuild", t);
}
function ol(t) {
  Rn("transformHtml", t);
}
async function rr(t, e) {
  const r = kt[t] || [];
  for (const i of r)
    try {
      await i(e);
    } catch (n) {
      console.warn("[nimbi-cms] runHooks callback failed", n);
    }
}
function cl() {
  Object.keys(kt).forEach((t) => {
    kt[t].length = 0;
  });
}
function Cr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var on, sr;
function ri() {
  if (sr) return on;
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
  function i(g, ...S) {
    const L = /* @__PURE__ */ Object.create(null);
    for (const F in g)
      L[F] = g[F];
    return S.forEach(function(F) {
      for (const he in F)
        L[he] = F[he];
    }), /** @type {T} */
    L;
  }
  const n = "</span>", s = (g) => !!g.scope, a = (g, { prefix: S }) => {
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
  class h {
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
      if (!s(S)) return;
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
      return new h(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(g) {
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
    return g.map((L) => u(L)).join("");
  }
  function w(g) {
    const S = g[g.length - 1];
    return typeof S == "object" && S.constructor === Object ? (g.splice(g.length - 1, 1), S) : {};
  }
  function y(...g) {
    return "(" + (w(g).capture ? "" : "?:") + g.map((F) => u(F)).join("|") + ")";
  }
  function x(g) {
    return new RegExp(g.toString() + "|").exec("").length - 1;
  }
  function B(g, S) {
    const L = g && g.exec(S);
    return L && L.index === 0;
  }
  const I = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function E(g, { joinWith: S }) {
    let L = 0;
    return g.map((F) => {
      L += 1;
      const he = L;
      let de = u(F), N = "";
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
  const U = /\b\B/, O = "[a-zA-Z]\\w*", Q = "[a-zA-Z_]\\w*", Y = "\\b\\d+(\\.\\d+)?", te = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", $ = "\\b(0b[01]+)", T = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", P = (g = {}) => {
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
  }, A = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, M = function(g, S, L = {}) {
    const F = i(
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
  }, k = M("//", "$"), G = M("/\\*", "\\*/"), ue = M("#", "$"), oe = {
    scope: "number",
    begin: Y,
    relevance: 0
  }, Le = {
    scope: "number",
    begin: te,
    relevance: 0
  }, ve = {
    scope: "number",
    begin: $,
    relevance: 0
  }, Ee = {
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
    begin: Q,
    relevance: 0
  }, Xe = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Q,
    relevance: 0
  };
  var Ct = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: v,
    BACKSLASH_ESCAPE: C,
    BINARY_NUMBER_MODE: ve,
    BINARY_NUMBER_RE: $,
    COMMENT: M,
    C_BLOCK_COMMENT_MODE: G,
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
    MATCH_NOTHING_RE: U,
    METHOD_GUARD: Xe,
    NUMBER_MODE: oe,
    NUMBER_RE: Y,
    PHRASAL_WORDS_MODE: A,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: Ee,
    RE_STARTERS_RE: T,
    SHEBANG: P,
    TITLE_MODE: fe,
    UNDERSCORE_IDENT_RE: Q,
    UNDERSCORE_TITLE_MODE: Ie
  });
  function ys(g, S) {
    g.input[g.index - 1] === "." && S.ignoreMatch();
  }
  function ks(g, S) {
    g.className !== void 0 && (g.scope = g.className, delete g.className);
  }
  function xs(g, S) {
    S && g.beginKeywords && (g.begin = "\\b(" + g.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", g.__beforeBegin = ys, g.keywords = g.keywords || g.beginKeywords, delete g.beginKeywords, g.relevance === void 0 && (g.relevance = 0));
  }
  function Ss(g, S) {
    Array.isArray(g.illegal) && (g.illegal = y(...g.illegal));
  }
  function vs(g, S) {
    if (g.match) {
      if (g.begin || g.end) throw new Error("begin & end are not supported with match");
      g.begin = g.match, delete g.match;
    }
  }
  function Es(g, S) {
    g.relevance === void 0 && (g.relevance = 1);
  }
  const As = (g, S) => {
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
  }, Rs = [
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
  ], Ts = "keyword";
  function qn(g, S, L = Ts) {
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
        F[j[0]] = [de, Cs(j[0], j[1])];
      });
    }
  }
  function Cs(g, S) {
    return S ? Number(S) : Ls(g) ? 0 : 1;
  }
  function Ls(g) {
    return Rs.includes(g.toLowerCase());
  }
  const Un = {}, Ke = (g) => {
    console.error(g);
  }, jn = (g, ...S) => {
    console.log(`WARN: ${g}`, ...S);
  }, tt = (g, S) => {
    Un[`${g}/${S}`] || (console.log(`Deprecated as of ${g}. ${S}`), Un[`${g}/${S}`] = !0);
  }, Lt = new Error();
  function Wn(g, S, { key: L }) {
    let F = 0;
    const he = g[L], de = {}, N = {};
    for (let z = 1; z <= S.length; z++)
      N[z + F] = he[z], de[z + F] = !0, F += x(S[z - 1]);
    g[L] = N, g[L]._emit = de, g[L]._multi = !0;
  }
  function _s(g) {
    if (Array.isArray(g.begin)) {
      if (g.skip || g.excludeBegin || g.returnBegin)
        throw Ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Lt;
      if (typeof g.beginScope != "object" || g.beginScope === null)
        throw Ke("beginScope must be object"), Lt;
      Wn(g, g.begin, { key: "beginScope" }), g.begin = E(g.begin, { joinWith: "" });
    }
  }
  function Ms(g) {
    if (Array.isArray(g.end)) {
      if (g.skip || g.excludeEnd || g.returnEnd)
        throw Ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Lt;
      if (typeof g.endScope != "object" || g.endScope === null)
        throw Ke("endScope must be object"), Lt;
      Wn(g, g.end, { key: "endScope" }), g.end = E(g.end, { joinWith: "" });
    }
  }
  function $s(g) {
    g.scope && typeof g.scope == "object" && g.scope !== null && (g.beginScope = g.scope, delete g.scope);
  }
  function Ps(g) {
    $s(g), typeof g.beginScope == "string" && (g.beginScope = { _wrap: g.beginScope }), typeof g.endScope == "string" && (g.endScope = { _wrap: g.endScope }), _s(g), Ms(g);
  }
  function Is(g) {
    function S(N, z) {
      return new RegExp(
        u(N),
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
        this.matcherRe = S(E(z, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(z) {
        this.matcherRe.lastIndex = this.lastIndex;
        const j = this.matcherRe.exec(z);
        if (!j)
          return null;
        const me = j.findIndex((lt, tn) => tn > 0 && lt !== void 0), pe = this.matchIndexes[me];
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
        ks,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        vs,
        Ps,
        As
      ].forEach((pe) => pe(N, z)), g.compilerExtensions.forEach((pe) => pe(N, z)), N.__beforeBegin = null, [
        xs,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ss,
        // default to 1 relevance if not specified
        Es
      ].forEach((pe) => pe(N, z)), N.isCompiled = !0;
      let me = null;
      return typeof N.keywords == "object" && N.keywords.$pattern && (N.keywords = Object.assign({}, N.keywords), me = N.keywords.$pattern, delete N.keywords.$pattern), me = me || /\w+/, N.keywords && (N.keywords = qn(N.keywords, g.case_insensitive)), j.keywordPatternRe = S(me, !0), z && (N.begin || (N.begin = /\B|\b/), j.beginRe = S(j.begin), !N.end && !N.endsWithParent && (N.end = /\B|\b/), N.end && (j.endRe = S(j.end)), j.terminatorEnd = u(j.end) || "", N.endsWithParent && z.terminatorEnd && (j.terminatorEnd += (N.end ? "|" : "") + z.terminatorEnd)), N.illegal && (j.illegalRe = S(
        /** @type {RegExp | string} */
        N.illegal
      )), N.contains || (N.contains = []), N.contains = [].concat(...N.contains.map(function(pe) {
        return zs(pe === "self" ? N : pe);
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
    return g.classNameAliases = i(g.classNameAliases || {}), de(
      /** @type Mode */
      g
    );
  }
  function Fn(g) {
    return g ? g.endsWithParent || Fn(g.starts) : !1;
  }
  function zs(g) {
    return g.variants && !g.cachedVariants && (g.cachedVariants = g.variants.map(function(S) {
      return i(g, { variants: null }, S);
    })), g.cachedVariants ? g.cachedVariants : Fn(g) ? i(g, { starts: g.starts ? i(g.starts) : null }) : Object.isFrozen(g) ? i(g) : g;
  }
  var Bs = "11.11.1";
  class Os extends Error {
    constructor(S, L) {
      super(S), this.name = "HTMLInjectionError", this.html = L;
    }
  }
  const en = r, Zn = i, Qn = /* @__PURE__ */ Symbol("nomatch"), Ns = 7, Gn = function(g) {
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
      const V = z.languageDetectRe.exec(H);
      if (V) {
        const ie = Ue(V[1]);
        return ie || (jn(de.replace("{}", V[1])), jn("Falling back to no-highlight mode for this block.", R)), ie ? V[1] : "no-highlight";
      }
      return H.split(/\s+/).find((ie) => j(ie) || Ue(ie));
    }
    function pe(R, H, V) {
      let ie = "", ge = "";
      typeof H == "object" ? (ie = R, V = H.ignoreIllegals, ge = H.language) : (tt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), tt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ge = R, ie = H), V === void 0 && (V = !0);
      const Me = {
        code: ie,
        language: ge
      };
      Mt("before:highlight", Me);
      const je = Me.result ? Me.result : lt(Me.language, Me.code, V);
      return je.code = Me.code, Mt("after:highlight", je), je;
    }
    function lt(R, H, V, ie) {
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
          const se = Be.case_insensitive ? D[0].toLowerCase() : D[0], ye = Me(Z, se);
          if (ye) {
            const [De, ti] = ye;
            if (we.addText(X), X = "", ge[se] = (ge[se] || 0) + 1, ge[se] <= Ns && (It += ti), De.startsWith("_"))
              X += D[0];
            else {
              const ni = Be.classNameAliases[De] || De;
              ze(D[0], ni);
            }
          } else
            X += D[0];
          _ = Z.keywordPatternRe.lastIndex, D = Z.keywordPatternRe.exec(ae);
        }
        X += ae.substring(_), we.addText(X);
      }
      function $t() {
        if (ae === "") return;
        let _ = null;
        if (typeof Z.subLanguage == "string") {
          if (!S[Z.subLanguage]) {
            we.addText(ae);
            return;
          }
          _ = lt(Z.subLanguage, ae, !0, nr[Z.subLanguage]), nr[Z.subLanguage] = /** @type {CompiledMode} */
          _._top;
        } else
          _ = nn(ae, Z.subLanguage.length ? Z.subLanguage : null);
        Z.relevance > 0 && (It += _.relevance), we.__addSublanguage(_._emitter, _.language);
      }
      function Ae() {
        Z.subLanguage != null ? $t() : je(), ae = "";
      }
      function ze(_, D) {
        _ !== "" && (we.startScope(D), we.addText(_), we.endScope());
      }
      function Vn(_, D) {
        let X = 1;
        const se = D.length - 1;
        for (; X <= se; ) {
          if (!_._emit[X]) {
            X++;
            continue;
          }
          const ye = Be.classNameAliases[_[X]] || _[X], De = D[X];
          ye ? ze(De, ye) : (ae = De, je(), ae = ""), X++;
        }
      }
      function Jn(_, D) {
        return _.scope && typeof _.scope == "string" && we.openNode(Be.classNameAliases[_.scope] || _.scope), _.beginScope && (_.beginScope._wrap ? (ze(ae, Be.classNameAliases[_.beginScope._wrap] || _.beginScope._wrap), ae = "") : _.beginScope._multi && (Vn(_.beginScope, D), ae = "")), Z = Object.create(_, { parent: { value: Z } }), Z;
      }
      function er(_, D, X) {
        let se = B(_.endRe, X);
        if (se) {
          if (_["on:end"]) {
            const ye = new e(_);
            _["on:end"](D, ye), ye.isMatchIgnored && (se = !1);
          }
          if (se) {
            for (; _.endsParent && _.parent; )
              _ = _.parent;
            return _;
          }
        }
        if (_.endsWithParent)
          return er(_.parent, D, X);
      }
      function Ks(_) {
        return Z.matcher.regexIndex === 0 ? (ae += _[0], 1) : (ln = !0, 0);
      }
      function Ys(_) {
        const D = _[0], X = _.rule, se = new e(X), ye = [X.__beforeBegin, X["on:begin"]];
        for (const De of ye)
          if (De && (De(_, se), se.isMatchIgnored))
            return Ks(D);
        return X.skip ? ae += D : (X.excludeBegin && (ae += D), Ae(), !X.returnBegin && !X.excludeBegin && (ae = D)), Jn(X, _), X.returnBegin ? 0 : D.length;
      }
      function Vs(_) {
        const D = _[0], X = H.substring(_.index), se = er(Z, _, X);
        if (!se)
          return Qn;
        const ye = Z;
        Z.endScope && Z.endScope._wrap ? (Ae(), ze(D, Z.endScope._wrap)) : Z.endScope && Z.endScope._multi ? (Ae(), Vn(Z.endScope, _)) : ye.skip ? ae += D : (ye.returnEnd || ye.excludeEnd || (ae += D), Ae(), ye.excludeEnd && (ae = D));
        do
          Z.scope && we.closeNode(), !Z.skip && !Z.subLanguage && (It += Z.relevance), Z = Z.parent;
        while (Z !== se.parent);
        return se.starts && Jn(se.starts, _), ye.returnEnd ? 0 : D.length;
      }
      function Js() {
        const _ = [];
        for (let D = Z; D !== Be; D = D.parent)
          D.scope && _.unshift(D.scope);
        _.forEach((D) => we.openNode(D));
      }
      let Pt = {};
      function tr(_, D) {
        const X = D && D[0];
        if (ae += _, X == null)
          return Ae(), 0;
        if (Pt.type === "begin" && D.type === "end" && Pt.index === D.index && X === "") {
          if (ae += H.slice(D.index, D.index + 1), !he) {
            const se = new Error(`0 width match regex (${R})`);
            throw se.languageName = R, se.badRule = Pt.rule, se;
          }
          return 1;
        }
        if (Pt = D, D.type === "begin")
          return Ys(D);
        if (D.type === "illegal" && !V) {
          const se = new Error('Illegal lexeme "' + X + '" for mode "' + (Z.scope || "<unnamed>") + '"');
          throw se.mode = Z, se;
        } else if (D.type === "end") {
          const se = Vs(D);
          if (se !== Qn)
            return se;
        }
        if (D.type === "illegal" && X === "")
          return ae += `
`, 1;
        if (an > 1e5 && an > D.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ae += X, X.length;
      }
      const Be = Ue(R);
      if (!Be)
        throw Ke(de.replace("{}", R)), new Error('Unknown language: "' + R + '"');
      const ei = Is(Be);
      let sn = "", Z = ie || ei;
      const nr = {}, we = new z.__emitter(z);
      Js();
      let ae = "", It = 0, Ye = 0, an = 0, ln = !1;
      try {
        if (Be.__emitTokens)
          Be.__emitTokens(H, we);
        else {
          for (Z.matcher.considerAll(); ; ) {
            an++, ln ? ln = !1 : Z.matcher.considerAll(), Z.matcher.lastIndex = Ye;
            const _ = Z.matcher.exec(H);
            if (!_) break;
            const D = H.substring(Ye, _.index), X = tr(D, _);
            Ye = _.index + X;
          }
          tr(H.substring(Ye));
        }
        return we.finalize(), sn = we.toHTML(), {
          language: R,
          value: sn,
          relevance: It,
          illegal: !1,
          _emitter: we,
          _top: Z
        };
      } catch (_) {
        if (_.message && _.message.includes("Illegal"))
          return {
            language: R,
            value: en(H),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: _.message,
              index: Ye,
              context: H.slice(Ye - 100, Ye + 100),
              mode: _.mode,
              resultSoFar: sn
            },
            _emitter: we
          };
        if (he)
          return {
            language: R,
            value: en(H),
            illegal: !1,
            relevance: 0,
            errorRaised: _,
            _emitter: we,
            _top: Z
          };
        throw _;
      }
    }
    function tn(R) {
      const H = {
        value: en(R),
        illegal: !1,
        relevance: 0,
        _top: N,
        _emitter: new z.__emitter(z)
      };
      return H._emitter.addText(R), H;
    }
    function nn(R, H) {
      H = H || z.languages || Object.keys(S);
      const V = tn(R), ie = H.filter(Ue).filter(Yn).map(
        (Ae) => lt(Ae, R, !1)
      );
      ie.unshift(V);
      const ge = ie.sort((Ae, ze) => {
        if (Ae.relevance !== ze.relevance) return ze.relevance - Ae.relevance;
        if (Ae.language && ze.language) {
          if (Ue(Ae.language).supersetOf === ze.language)
            return 1;
          if (Ue(ze.language).supersetOf === Ae.language)
            return -1;
        }
        return 0;
      }), [Me, je] = ge, $t = Me;
      return $t.secondBest = je, $t;
    }
    function Ds(R, H, V) {
      const ie = H && L[H] || V;
      R.classList.add("hljs"), R.classList.add(`language-${ie}`);
    }
    function rn(R) {
      let H = null;
      const V = me(R);
      if (j(V)) return;
      if (Mt(
        "before:highlightElement",
        { el: R, language: V }
      ), R.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", R);
        return;
      }
      if (R.children.length > 0 && (z.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(R)), z.throwUnescapedHTML))
        throw new Os(
          "One of your code blocks includes unescaped HTML.",
          R.innerHTML
        );
      H = R;
      const ie = H.textContent, ge = V ? pe(ie, { language: V, ignoreIllegals: !0 }) : nn(ie);
      R.innerHTML = ge.value, R.dataset.highlighted = "yes", Ds(R, V, ge.language), R.result = {
        language: ge.language,
        // TODO: remove with version 11.0
        re: ge.relevance,
        relevance: ge.relevance
      }, ge.secondBest && (R.secondBest = {
        language: ge.secondBest.language,
        relevance: ge.secondBest.relevance
      }), Mt("after:highlightElement", { el: R, result: ge, text: ie });
    }
    function Hs(R) {
      z = Zn(z, R);
    }
    const qs = () => {
      _t(), tt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Us() {
      _t(), tt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Xn = !1;
    function _t() {
      function R() {
        _t();
      }
      if (document.readyState === "loading") {
        Xn || window.addEventListener("DOMContentLoaded", R, !1), Xn = !0;
        return;
      }
      document.querySelectorAll(z.cssSelector).forEach(rn);
    }
    function js(R, H) {
      let V = null;
      try {
        V = H(g);
      } catch (ie) {
        if (Ke("Language definition for '{}' could not be registered.".replace("{}", R)), he)
          Ke(ie);
        else
          throw ie;
        V = N;
      }
      V.name || (V.name = R), S[R] = V, V.rawDefinition = H.bind(null, g), V.aliases && Kn(V.aliases, { languageName: R });
    }
    function Ws(R) {
      delete S[R];
      for (const H of Object.keys(L))
        L[H] === R && delete L[H];
    }
    function Fs() {
      return Object.keys(S);
    }
    function Ue(R) {
      return R = (R || "").toLowerCase(), S[R] || S[L[R]];
    }
    function Kn(R, { languageName: H }) {
      typeof R == "string" && (R = [R]), R.forEach((V) => {
        L[V.toLowerCase()] = H;
      });
    }
    function Yn(R) {
      const H = Ue(R);
      return H && !H.disableAutodetect;
    }
    function Zs(R) {
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
    function Qs(R) {
      Zs(R), F.push(R);
    }
    function Gs(R) {
      const H = F.indexOf(R);
      H !== -1 && F.splice(H, 1);
    }
    function Mt(R, H) {
      const V = R;
      F.forEach(function(ie) {
        ie[V] && ie[V](H);
      });
    }
    function Xs(R) {
      return tt("10.7.0", "highlightBlock will be removed entirely in v12.0"), tt("10.7.0", "Please use highlightElement now."), rn(R);
    }
    Object.assign(g, {
      highlight: pe,
      highlightAuto: nn,
      highlightAll: _t,
      highlightElement: rn,
      // TODO: Remove with v12 API
      highlightBlock: Xs,
      configure: Hs,
      initHighlighting: qs,
      initHighlightingOnLoad: Us,
      registerLanguage: js,
      unregisterLanguage: Ws,
      listLanguages: Fs,
      getLanguage: Ue,
      registerAliases: Kn,
      autoDetection: Yn,
      inherit: Zn,
      addPlugin: Qs,
      removePlugin: Gs
    }), g.debugMode = function() {
      he = !1;
    }, g.safeMode = function() {
      he = !0;
    }, g.versionString = Bs, g.regex = {
      concat: m,
      lookahead: f,
      either: y,
      optional: d,
      anyNumberOfTimes: p
    };
    for (const R in Ct)
      typeof Ct[R] == "object" && t(Ct[R]);
    return Object.assign(g, Ct), g;
  }, nt = Gn({});
  return nt.newInstance = () => Gn({}), on = nt, nt.HighlightJS = nt, nt.default = nt, on;
}
var si = /* @__PURE__ */ ri();
const le = /* @__PURE__ */ Cr(si), J = /* @__PURE__ */ new Map(), ii = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Re = {
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
const ir = /* @__PURE__ */ new Map(), ai = 300 * 1e3;
async function _r(t = ii) {
  if (t)
    return Ze || (Ze = (async () => {
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
        let h = s.findIndex((o) => /file|filename|module|module name|module-name|short|slug/i.test(o));
        if (h === -1) {
          const o = s.findIndex((c) => /language/i.test(c));
          h = o !== -1 ? o : 0;
        }
        let l = [];
        for (let o = n + 1; o < i.length; o++) {
          const c = i[o].trim();
          if (!c || !c.startsWith("|")) break;
          const u = c.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (u.every((w) => /^-+$/.test(w))) continue;
          const f = u;
          if (!f.length) continue;
          const d = (f[h] || f[0] || "").toString().trim().toLowerCase();
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
            const u = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? o.push(u) : J.delete(c);
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
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const f = J.get(c);
                J.delete(c), J.set(u, f);
              } else
                J.delete(c), o++;
            }
          }
          for (const [c, u] of Array.from(J.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (J.delete(c), o++);
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
    })(), Ze);
}
const cn = /* @__PURE__ */ new Set();
async function xt(t, e) {
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
  if (J.size && !J.has(r)) {
    const n = Re;
    if (!n[r] && !n[t])
      return !1;
  }
  if (cn.has(t)) return !0;
  const i = Re;
  try {
    const n = (e || t || "").toString().replace(/\.js$/i, "").trim(), s = (i[t] || t || "").toString(), a = (i[n] || n || "").toString();
    let h = Array.from(new Set([
      s,
      a,
      n,
      t,
      i[n],
      i[t]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    J.size && (h = h.filter((c) => {
      if (J.has(c)) return !0;
      const u = Re[c];
      return !!(u && J.has(u));
    }));
    let l = null, o = null;
    for (const c of h)
      try {
        const u = Date.now(), f = ir.get(c);
        if (f) {
          if (f.ok === !1 && u - (f.ts || 0) < ai)
            l = null;
          else if (f.module)
            l = f.module;
          else if (f.promise)
            try {
              l = await f.promise;
            } catch {
              l = null;
            }
        } else {
          const p = { promise: null, module: null, ok: null, ts: 0 };
          ir.set(c, p), p.promise = (async () => {
            try {
              try {
                return await import(
                  /* @vite-ignore */
                  `highlight.js/lib/languages/${c}.js`
                );
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
            return le.registerLanguage(d, p), cn.add(d), d !== t && (le.registerLanguage(t, p), cn.add(t)), !0;
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
let zt = null;
function li(t = document) {
  Ze || (async () => {
    try {
      await _r();
    } catch (s) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", s);
    }
  })();
  const e = Re, i = zt || (typeof IntersectionObserver > "u" ? null : (zt = new IntersectionObserver((s, a) => {
    s.forEach((h) => {
      if (!h.isIntersecting) return;
      const l = h.target;
      try {
        a.unobserve(l);
      } catch (o) {
        console.warn("[codeblocksManager] observer unobserve failed", o);
      }
      (async () => {
        try {
          const o = l.getAttribute && l.getAttribute("class") || l.className || "", c = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const u = (c[1] || "").toLowerCase(), f = e[u] || u, p = J.size && (J.get(f) || J.get(String(f).toLowerCase())) || f;
            try {
              await xt(p);
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
              const u = l.textContent || "";
              try {
                if (le && typeof le.getLanguage == "function" && le.getLanguage("plaintext")) {
                  const f = le.highlight(u, { language: "plaintext" });
                  f && f.value && (l.innerHTML = f.value);
                }
              } catch {
                try {
                  le.highlightElement(l);
                } catch (p) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (u) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (o) {
          console.warn("[codeblocksManager] observer entry processing failed", o);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), zt)), n = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!i) {
    n.forEach(async (s) => {
      try {
        const a = s.getAttribute && s.getAttribute("class") || s.className || "", h = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (h && h[1]) {
          const l = (h[1] || "").toLowerCase(), o = e[l] || l, c = J.size && (J.get(o) || J.get(String(o).toLowerCase())) || o;
          try {
            await xt(c);
          } catch (u) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", u);
          }
        }
        try {
          le.highlightElement(s);
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
function ul(t, { useCdn: e = !0 } = {}) {
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
let un = "light";
function oi(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = t, Object.entries(e).forEach(([i, n]) => r.setAttribute(i, n)), document.head.appendChild(r);
}
async function ci(t = "none", e = "/") {
  if (!t || t === "none") return;
  const r = [e + "bulma.css", "/bulma.css"], i = Array.from(new Set(r));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const n of i)
      try {
        const s = await fetch(n, { method: "GET" });
        if (s.ok) {
          const a = await s.text(), h = document.createElement("style");
          h.setAttribute("data-bulma-override", n), h.appendChild(document.createTextNode(`
/* bulma override: ${n} */
` + a)), document.head.appendChild(h);
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
    oi(s, { "data-bulmaswatch-theme": n });
  } catch (n) {
    console.warn("[bulmaManager] ensureBulma failed", n);
  }
}
function ui(t) {
  un = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", un), un === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function hl(t) {
  const e = document.documentElement;
  for (const [r, i] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${r}`, i);
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
}, it = JSON.parse(JSON.stringify(Mr));
let Ut = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Ut = String(t).split("-")[0].toLowerCase();
}
Mr[Ut] || (Ut = "en");
let Qe = Ut;
function ht(t, e = {}) {
  const r = it[Qe] || it.en;
  let i = r && r[t] ? r[t] : it.en[t] || "";
  for (const n of Object.keys(e))
    i = i.replace(new RegExp(`{${n}}`, "g"), String(e[n]));
  return i;
}
async function $r(t, e) {
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
function Pr(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Qe = it[e] ? e : "en";
}
const hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Qe;
  },
  loadL10nFile: $r,
  setLang: Pr,
  t: ht
}, Symbol.toStringTag, { value: "Module" })), di = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
  function i() {
    if (!r)
      try {
        const h = t();
        r = h || null, h && h.addEventListener("error", () => {
          try {
            r === h && (r = null, h.terminate && h.terminate());
          } catch (l) {
            console.warn("[" + e + "] worker termination failed", l);
          }
        });
      } catch (h) {
        r = null, console.warn("[" + e + "] worker init failed", h);
      }
    return r;
  }
  function n() {
    try {
      r && (r.terminate && r.terminate(), r = null);
    } catch (h) {
      console.warn("[" + e + "] worker termination failed", h);
    }
  }
  function s(h, l = 1e3) {
    return new Promise((o, c) => {
      const u = i();
      if (!u) return c(new Error("worker unavailable"));
      const f = String(Math.random());
      h.id = f;
      let p = null;
      const d = () => {
        p && clearTimeout(p), u.removeEventListener("message", m), u.removeEventListener("error", w);
      }, m = (y) => {
        const x = y.data || {};
        x.id === f && (d(), x.error ? c(new Error(x.error)) : o(x.result));
      }, w = (y) => {
        d(), console.warn("[" + e + "] worker error event", y);
        try {
          r === u && (r = null, u.terminate && u.terminate());
        } catch (x) {
          console.warn("[" + e + "] worker termination failed", x);
        }
        c(new Error(y && y.message || "worker error"));
      };
      p = setTimeout(() => {
        d(), console.warn("[" + e + "] worker timed out");
        try {
          r === u && (r = null, u.terminate && u.terminate());
        } catch (y) {
          console.warn("[" + e + "] worker termination on timeout failed", y);
        }
        c(new Error("worker timeout"));
      }, l), u.addEventListener("message", m), u.addEventListener("error", w);
      try {
        u.postMessage(h);
      } catch (y) {
        d(), c(y);
      }
    });
  }
  return { get: i, send: s, terminate: n };
}
function pi(t) {
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
function Tn(t) {
  fi(), Ne.clear();
  for (const e of Te)
    e && Ne.add(e);
  ar(K), ar(q), Tn._refreshed = !0;
}
function ar(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Ne.add(e);
}
function lr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(r, i) {
    return i && Ne.add(i), e.call(this, r, i);
  };
}
let or = !1;
function fi() {
  or || (lr(K), lr(q), or = !0);
}
function zr(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function ce(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function vt(t) {
  return String(t || "").replace(/\/+$/, "");
}
function St(t) {
  return vt(t) + "/";
}
function gi(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const r = document.createElement("link");
    r.rel = "preload", r.as = "image", r.href = t, document.head.appendChild(r);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function Bt(t, e = 0, r = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const i = Array.from(t.querySelectorAll("img"));
    if (!i.length) return;
    const n = t, s = n && n.getBoundingClientRect ? n.getBoundingClientRect() : null, a = 0, h = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = s ? Math.max(a, s.top) : a, c = (s ? Math.min(h, s.bottom) : h) + Number(e || 0);
    let u = 0;
    n && (u = n.clientHeight || (s ? s.height : 0)), u || (u = h - a);
    let f = 0.6;
    try {
      const w = n && window.getComputedStyle ? window.getComputedStyle(n) : null, y = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), x = y ? parseFloat(y) : NaN;
      !Number.isNaN(x) && x > 0 && x <= 1 && (f = x);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(u * f));
    let d = !1, m = null;
    if (i.forEach((w) => {
      try {
        const y = w.getAttribute ? w.getAttribute("loading") : void 0;
        y !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const x = w.getBoundingClientRect ? w.getBoundingClientRect() : null, B = w.src || w.getAttribute && w.getAttribute("src"), I = x && x.height > 1 ? x.height : p, E = x ? x.top : 0, U = E + I, O = !!(x && I > 0 && E <= c && U >= l);
        O && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), gi(B), d = !0), !m && x && x.top <= c && (m = { img: w, src: B, rect: x, beforeLoading: y }), r && console.log("[helpers] setEagerForAboveFoldImages:", {
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
function jt(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = jt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const K = /* @__PURE__ */ new Map();
let Ce = [], Cn = !1;
function Br(t) {
  Cn = !!t;
}
function Or(t) {
  Ce = Array.isArray(t) ? t.slice() : [];
}
function mi() {
  return Ce;
}
const Nr = Ir(() => pi(di), "slugManager");
function Ln() {
  return Nr.get();
}
function Dr(t) {
  return Nr.send(t);
}
async function wi(t, e = 1, r = void 0) {
  if (!Ln()) return Zt(t, e, r);
  try {
    return await Dr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: r });
  } catch (n) {
    try {
      return await Zt(t, e, r);
    } catch (s) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", s), n;
    }
  }
}
async function bi(t, e, r) {
  return Ln() ? Dr({ type: "crawlForSlug", slug: t, base: e, maxQueue: r }) : _n(t, e, r);
}
function We(t, e) {
  if (t)
    if (Ce && Ce.length) {
      const i = e.split("/")[0], n = Ce.includes(i);
      let s = K.get(t);
      (!s || typeof s == "string") && (s = { default: typeof s == "string" ? s : void 0, langs: {} }), n ? s.langs[i] = e : s.default = e, K.set(t, s);
    } else
      K.set(t, e);
}
const Yt = /* @__PURE__ */ new Set();
function yi(t) {
  typeof t == "function" && Yt.add(t);
}
function ki(t) {
  typeof t == "function" && Yt.delete(t);
}
const q = /* @__PURE__ */ new Map();
let mn = {}, Te = [], at = "_404.md", st = "_home.md";
function wn(t) {
  t != null && (at = String(t || ""));
}
function bn(t) {
  t != null && (st = String(t || ""));
}
function xi(t) {
  mn = t || {};
}
const ft = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Set();
function Si() {
  ft.clear(), Wt.clear();
}
function vi(t) {
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
function Ft(t) {
  K.clear(), q.clear(), Te = [], Ce = Ce || [];
  const e = Object.keys(mn || {});
  if (!e.length) return;
  let r = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? r = new URL(String(t)).pathname : r = String(t || "");
      } catch (i) {
        r = String(t || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      r = St(r);
    }
  } catch (i) {
    r = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  r || (r = vi(e));
  for (const i of e) {
    let n = i;
    r && i.startsWith(r) ? n = ce(i.slice(r.length)) : n = ce(i), Te.push(n);
    try {
      Tn();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const s = mn[i];
    if (typeof s == "string") {
      const a = (s || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const h = re(a[1].trim());
        if (h)
          try {
            if (Ce && Ce.length) {
              const o = n.split("/")[0], c = Ce.includes(o);
              let u = K.get(h);
              (!u || typeof u == "string") && (u = { default: typeof u == "string" ? u : void 0, langs: {} }), c ? u.langs[o] = n : u.default = n, K.set(h, u);
            } else
              K.set(h, n);
            q.set(n, h);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  Ft();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function re(t) {
  let e = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return e = e.replace(/(?:-?)(?:md|html)$/, ""), e;
}
function Ei(t) {
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
function Nt(t) {
  return t == null ? t : String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (e, r) => r);
}
function At(t) {
  if (!t || !K.has(t)) return null;
  const e = K.get(t);
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
const gt = /* @__PURE__ */ new Map();
function Ai() {
  gt.clear();
}
let be = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const s = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (s && K.has(s)) {
      const a = At(s) || K.get(s);
      a && a !== t && (t = a);
    }
  } catch (s) {
    console.warn("[slugManager] slug mapping normalization failed", s);
  }
  const r = e == null ? "" : vt(String(e));
  let i = "";
  try {
    r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? i = r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = (r.startsWith("/") ? "" : "/") + r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = "/" + t.replace(/^\//, "");
  } catch {
    i = "/" + t.replace(/^\//, "");
  }
  if (gt.has(i))
    return gt.get(i);
  const n = (async () => {
    const s = await fetch(i);
    if (!s || typeof s.ok != "boolean" || !s.ok) {
      if (s && s.status === 404)
        try {
          const u = `${r}/${at}`, f = await globalThis.fetch(u);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (u) {
          console.warn("[slugManager] fetching fallback 404 failed", u);
        }
      let c = "";
      try {
        s && typeof s.clone == "function" ? c = await s.clone().text() : s && typeof s.text == "function" ? c = await s.text() : c = "";
      } catch (u) {
        c = "", console.warn("[slugManager] reading error body failed", u);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: s ? s.status : void 0, statusText: s ? s.statusText : void 0, body: c.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await s.text(), h = a.trim().slice(0, 16).toLowerCase(), l = h.startsWith("<!doctype") || h.startsWith("<html"), o = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const c = `${r}/${at}`, u = await globalThis.fetch(c);
        if (u.ok)
          return { raw: await u.text(), status: 404 };
      } catch (c) {
        console.warn("[slugManager] fetching fallback 404 failed", c);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return o ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return gt.set(i, n), n;
};
function Ri(t) {
  typeof t == "function" && (be = t);
}
const Dt = /* @__PURE__ */ new Map();
function Ti(t) {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/```[\s\S]*?```/g, "");
  return e = e.replace(/<pre[\s\S]*?<\/pre>/gi, ""), e = e.replace(/<code[\s\S]*?<\/code>/gi, ""), e = e.replace(/<!--([\s\S]*?)-->/g, ""), e = e.replace(/^ {4,}.*$/gm, ""), e = e.replace(/`[^`]*`/g, ""), e;
}
let He = [], ot = null;
async function Zt(t, e = 1, r = void 0) {
  const i = Array.isArray(r) ? Array.from(new Set((r || []).map((n) => ce(String(n || ""))))) : [];
  try {
    const n = ce(String(at || ""));
    n && !i.includes(n) && i.push(n);
  } catch {
  }
  if (He && He.length && e === 1 && !He.some((s) => {
    try {
      return i.includes(ce(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return He;
  if (ot) return ot;
  ot = (async () => {
    let n = Array.isArray(r) ? Array.from(new Set((r || []).map((o) => ce(String(o || ""))))) : [];
    try {
      const o = ce(String(at || ""));
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
      for (o.size; c.length && o.size <= Rt; ) {
        const u = c.shift();
        try {
          const f = await be(u, t);
          if (f && f.raw) {
            if (f.status === 404) continue;
            let p = f.raw;
            const d = [], m = String(u || "").replace(/^.*\//, "");
            if (/^readme(?:\.md)?$/i.test(m) && Cn && (!u || !u.includes("/")))
              continue;
            const w = Ti(p), y = /\[[^\]]+\]\(([^)]+)\)/g;
            let x;
            for (; x = y.exec(w); )
              d.push(x[1]);
            const B = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; x = B.exec(w); )
              d.push(x[1]);
            const I = u && u.includes("/") ? u.substring(0, u.lastIndexOf("/") + 1) : "";
            for (let E of d)
              try {
                if (Et(E, t) || E.startsWith("..") || E.indexOf("/../") !== -1 || (I && !E.startsWith("./") && !E.startsWith("/") && !E.startsWith("../") && (E = I + E), E = ce(E), !/\.(md|html?)(?:$|[?#])/i.test(E)) || (E = E.split(/[?#]/)[0], s(E))) continue;
                o.has(E) || (o.add(E), c.push(E), a.push(E));
              } catch (U) {
                console.warn("[slugManager] href processing failed", E, U);
              }
          }
        } catch (f) {
          console.warn("[slugManager] discovery fetch failed for", u, f);
        }
      }
    } catch (o) {
      console.warn("[slugManager] discovery loop failed", o);
    }
    const h = /* @__PURE__ */ new Set();
    a = a.filter((o) => !o || h.has(o) || s(o) ? !1 : (h.add(o), !0));
    const l = [];
    for (const o of a)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(o))
        try {
          const c = await be(o, t);
          if (c && c.raw) {
            if (c.status === 404) continue;
            let u = "", f = "";
            if (c.isHtml)
              try {
                const m = new DOMParser().parseFromString(c.raw, "text/html"), w = m.querySelector("title") || m.querySelector("h1");
                w && w.textContent && (u = w.textContent.trim());
                const y = m.querySelector("p");
                if (y && y.textContent && (f = y.textContent.trim()), e >= 2)
                  try {
                    const x = m.querySelector("h1"), B = x && x.textContent ? x.textContent.trim() : u || "", I = (() => {
                      try {
                        if (q.has(o)) return q.get(o);
                      } catch {
                      }
                      return re(u || o);
                    })(), E = Array.from(m.querySelectorAll("h2"));
                    for (const U of E)
                      try {
                        const O = (U.textContent || "").trim();
                        if (!O) continue;
                        const Q = U.id ? U.id : re(O), Y = I ? `${I}::${Q}` : `${re(o)}::${Q}`;
                        let te = "", $ = U.nextElementSibling;
                        for (; $ && $.tagName && $.tagName.toLowerCase() === "script"; ) $ = $.nextElementSibling;
                        $ && $.textContent && (te = String($.textContent).trim()), l.push({ slug: Y, title: O, excerpt: te, path: o, parentTitle: B });
                      } catch (O) {
                        console.warn("[slugManager] indexing H2 failed", O);
                      }
                    if (e === 3)
                      try {
                        const U = Array.from(m.querySelectorAll("h3"));
                        for (const O of U)
                          try {
                            const Q = (O.textContent || "").trim();
                            if (!Q) continue;
                            const Y = O.id ? O.id : re(Q), te = I ? `${I}::${Y}` : `${re(o)}::${Y}`;
                            let $ = "", T = O.nextElementSibling;
                            for (; T && T.tagName && T.tagName.toLowerCase() === "script"; ) T = T.nextElementSibling;
                            T && T.textContent && ($ = String(T.textContent).trim()), l.push({ slug: te, title: Q, excerpt: $, path: o, parentTitle: B });
                          } catch (Q) {
                            console.warn("[slugManager] indexing H3 failed", Q);
                          }
                      } catch (U) {
                        console.warn("[slugManager] collect H3s failed", U);
                      }
                  } catch (x) {
                    console.warn("[slugManager] collect H2s failed", x);
                  }
              } catch (d) {
                console.warn("[slugManager] parsing HTML for index failed", d);
              }
            else {
              const d = c.raw, m = d.match(/^#\s+(.+)$/m);
              u = m ? m[1].trim() : "";
              try {
                u = Nt(u);
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
                      if (q.has(o)) return q.get(o);
                    } catch {
                    }
                    return re(u || o);
                  })();
                  const I = /^##\s+(.+)$/gm;
                  let E;
                  for (; E = I.exec(d); )
                    try {
                      const U = (E[1] || "").trim(), O = Nt(U);
                      if (!U) continue;
                      const Q = re(U), Y = x ? `${x}::${Q}` : `${re(o)}::${Q}`, $ = d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), T = $ && $[1] ? String($[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      l.push({ slug: Y, title: O, excerpt: T, path: o, parentTitle: y });
                    } catch (U) {
                      console.warn("[slugManager] indexing markdown H2 failed", U);
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
                        const E = (I[1] || "").trim(), U = Nt(E);
                        if (!E) continue;
                        const O = re(E), Q = x ? `${x}::${O}` : `${re(o)}::${O}`, te = d.slice(B.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), $ = te && te[1] ? String(te[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        l.push({ slug: Q, title: U, excerpt: $, path: o, parentTitle: y });
                      } catch (E) {
                        console.warn("[slugManager] indexing markdown H3 failed", E);
                      }
                  } catch (B) {
                    console.warn("[slugManager] collect markdown H3s failed", B);
                  }
              }
            }
            let p = "";
            try {
              q.has(o) && (p = q.get(o));
            } catch (d) {
              console.warn("[slugManager] mdToSlug access failed", d);
            }
            p || (p = re(u || o)), l.push({ slug: p, title: u, excerpt: f, path: o });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    try {
      He = l.filter((c) => {
        try {
          return !s(String(c.path || ""));
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
    await ot;
  } catch (n) {
    console.warn("[slugManager] awaiting _indexPromise failed", n);
  }
  return ot = null, He;
}
const Hr = 1e3;
let Rt = Hr;
function Ci(t) {
  typeof t == "number" && t >= 0 && (Rt = t);
}
const qr = new DOMParser(), Ur = "a[href]";
let _n = async function(t, e, r = Rt) {
  if (Dt.has(t)) return Dt.get(t);
  let i = null;
  const n = /* @__PURE__ */ new Set(), s = [""];
  for (; s.length && !i && !(s.length > r); ) {
    const a = s.shift();
    if (n.has(a)) continue;
    n.add(a);
    let h = e;
    h.endsWith("/") || (h += "/"), h += a;
    try {
      const l = await globalThis.fetch(h);
      if (!l.ok) continue;
      const o = await l.text(), u = qr.parseFromString(o, "text/html").querySelectorAll(Ur);
      for (const f of u)
        try {
          let p = f.getAttribute("href") || "";
          if (!p || Et(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            const d = a + p;
            n.has(d) || s.push(d);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const d = ce(a + p);
            try {
              if (q.has(d))
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
  return Dt.set(t, i), i;
};
async function jr(t, e = Rt) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), n = [""];
  for (; n.length && !(n.length > e); ) {
    const s = n.shift();
    if (i.has(s)) continue;
    i.add(s);
    let a = t;
    a.endsWith("/") || (a += "/"), a += s;
    try {
      const h = await globalThis.fetch(a);
      if (!h.ok) continue;
      const l = await h.text(), c = qr.parseFromString(l, "text/html").querySelectorAll(Ur);
      for (const u of c)
        try {
          let f = u.getAttribute("href") || "";
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
    } catch (h) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", h);
    }
  }
  return Array.from(r);
}
async function Wr(t, e, r) {
  if (t && typeof t == "string" && (t = ce(t), t = vt(t)), K.has(t))
    return At(t) || K.get(t);
  for (const n of Yt)
    try {
      const s = await n(t, e);
      if (s)
        return We(t, s), q.set(s, t), s;
    } catch (s) {
      console.warn("[slugManager] slug resolver failed", s);
    }
  if (Te && Te.length) {
    if (ft.has(t)) {
      const n = ft.get(t);
      return K.set(t, n), q.set(n, t), n;
    }
    for (const n of Te)
      if (!Wt.has(n))
        try {
          const s = await be(n, e);
          if (s && s.raw) {
            const a = (s.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const h = re(a[1].trim());
              if (Wt.add(n), h && ft.set(h, n), h === t)
                return We(t, n), q.set(n, t), n;
            }
          }
        } catch (s) {
          console.warn("[slugManager] manifest title fetch failed", s);
        }
  }
  try {
    const n = await Zt(e);
    if (n && n.length) {
      const s = n.find((a) => a.slug === t);
      if (s)
        return We(t, s.path), q.set(s.path, t), s.path;
    }
  } catch (n) {
    console.warn("[slugManager] buildSearchIndex lookup failed", n);
  }
  try {
    const n = await _n(t, e, r);
    if (n)
      return We(t, n), q.set(n, t), n;
  } catch (n) {
    console.warn("[slugManager] crawlForSlug lookup failed", n);
  }
  const i = [`${t}.html`, `${t}.md`];
  for (const n of i)
    try {
      const s = await be(n, e);
      if (s && s.raw)
        return We(t, n), q.set(n, t), n;
    } catch (s) {
      console.warn("[slugManager] candidate fetch failed", s);
    }
  if (Te && Te.length)
    for (const n of Te)
      try {
        const s = n.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (re(s) === t)
          return We(t, n), q.set(n, t), n;
      } catch (s) {
        console.warn("[slugManager] build-time filename match failed", s);
      }
  try {
    const n = [];
    st && typeof st == "string" && st.trim() && n.push(st), n.includes("_home.md") || n.push("_home.md");
    for (const s of n)
      try {
        const a = await be(s, e);
        if (a && a.raw) {
          const h = (a.raw || "").match(/^#\s+(.+)$/m);
          if (h && h[1] && re(h[1].trim()) === t)
            return We(t, s), q.set(s, t), s;
        }
      } catch {
      }
  } catch (n) {
    console.warn("[slugManager] home page fetch failed", n);
  }
  return null;
}
const Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Hr,
  _setAllMd: xi,
  _storeSlugMapping: We,
  addSlugResolver: yi,
  get allMarkdownPaths() {
    return Te;
  },
  get availableLanguages() {
    return Ce;
  },
  buildSearchIndex: Zt,
  buildSearchIndexWorker: wi,
  clearFetchCache: Ai,
  clearListCaches: Si,
  crawlAllMarkdown: jr,
  crawlCache: Dt,
  crawlForSlug: _n,
  crawlForSlugWorker: bi,
  get defaultCrawlMaxQueue() {
    return Rt;
  },
  ensureSlug: Wr,
  fetchCache: gt,
  get fetchMarkdown() {
    return be;
  },
  getLanguages: mi,
  get homePage() {
    return st;
  },
  initSlugWorker: Ln,
  isExternalLink: Ei,
  isExternalLinkWithBase: Et,
  listPathsFetched: Wt,
  listSlugCache: ft,
  mdToSlug: q,
  get notFoundPage() {
    return at;
  },
  removeSlugResolver: ki,
  resolveSlugPath: At,
  get searchIndex() {
    return He;
  },
  setContentBase: Ft,
  setDefaultCrawlMaxQueue: Ci,
  setFetchMarkdown: Ri,
  setHomePage: bn,
  setLanguages: Or,
  setNotFoundPage: wn,
  setSkipRootReadme: Br,
  get skipRootReadme() {
    return Cn;
  },
  slugResolvers: Yt,
  slugToMd: K,
  slugify: re,
  unescapeMarkdown: Nt
}, Symbol.toStringTag, { value: "Module" }));
let Fr = 100;
function cr(t) {
  Fr = t;
}
let mt = 300 * 1e3;
function ur(t) {
  mt = t;
}
const _e = /* @__PURE__ */ new Map();
function Li(t) {
  if (!_e.has(t)) return;
  const e = _e.get(t), r = Date.now();
  if (e.ts + mt < r) {
    _e.delete(t);
    return;
  }
  return _e.delete(t), _e.set(t, e), e.value;
}
function _i(t, e) {
  if (hr(), hr(), _e.delete(t), _e.set(t, { value: e, ts: Date.now() }), _e.size > Fr) {
    const r = _e.keys().next().value;
    r !== void 0 && _e.delete(r);
  }
}
function hr() {
  if (!mt || mt <= 0) return;
  const t = Date.now();
  for (const [e, r] of _e.entries())
    r.ts + mt < t && _e.delete(e);
}
async function Mi(t, e) {
  const r = new Set(Ne), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const n of Array.from(i || [])) {
    const s = n.getAttribute("href") || "";
    if (s)
      try {
        const a = new URL(s, location.href);
        if (a.origin !== location.origin) continue;
        const h = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (h) {
          let o = ce(h[1]);
          o && r.add(o);
          continue;
        }
        const l = a.pathname || "";
        if (l) {
          const o = new URL(e), c = St(o.pathname);
          if (l.indexOf(c) !== -1) {
            let u = l.startsWith(c) ? l.slice(c.length) : l;
            u = ce(u), u && r.add(u);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const n of r)
    try {
      if (!n || !String(n).includes(".md")) continue;
      const s = await be(n, e);
      if (!s || !s.raw) continue;
      const a = (s.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const h = (a[1] || "").trim();
        if (h && re(h) === t)
          return n;
      }
    } catch (s) {
      console.warn("[router] fetchMarkdown during index discovery failed", s);
    }
  return null;
}
function $i(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const r = decodeURIComponent(String(t || ""));
      if (K.has(r)) {
        const i = At(r) || K.get(r);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || e.push(i) : (e.push(i), e.push(i + ".html")));
      } else {
        if (Ne && Ne.size)
          for (const i of Ne) {
            const n = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (re(n) === r && !/index\.html$/i.test(i)) {
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
async function Pi(t, e) {
  const r = t || "", i = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let n = t || "", s = null;
  if (n && String(n).includes("::")) {
    const d = String(n).split("::", 2);
    n = d[0], s = d[1] || null;
  }
  const h = `${t}|||${typeof hi < "u" && Qe ? Qe : ""}`, l = Li(h);
  if (l)
    n = l.resolved, s = l.anchor || s;
  else {
    if (!String(n).includes(".md") && !String(n).includes(".html")) {
      let d = decodeURIComponent(String(n || ""));
      if (d && typeof d == "string" && (d = ce(d), d = vt(d)), K.has(d))
        n = At(d) || K.get(d);
      else {
        let m = await Mi(d, e);
        if (m)
          n = m;
        else if (Tn._refreshed && Ne && Ne.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await Wr(d, e);
          w && (n = w);
        }
      }
    }
    _i(h, { resolved: n, anchor: s });
  }
  !s && i && (s = i);
  const o = $i(n), c = String(r || "").includes(".md") || String(r || "").includes(".html");
  if (c && o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && o.push(n), o.length === 1 && /index\.html$/i.test(o[0]) && !c && !K.has(n) && !K.has(decodeURIComponent(String(n || ""))) && !String(n || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let u = null, f = null, p = null;
  for (const d of o)
    if (d)
      try {
        const m = ce(d);
        u = await be(m, e), f = m;
        break;
      } catch (m) {
        p = m;
        try {
          console.warn("[router] candidate fetch failed", { candidate: d, contentBase: e, err: m && m.message || m });
        } catch {
        }
      }
  if (!u) {
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
                const I = d, E = new URL(".", I).toString();
                try {
                  const O = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (O) {
                    const Q = O.parseFromString(w || "", "text/html"), Y = (P, C) => {
                      try {
                        const v = C.getAttribute(P) || "";
                        if (!v || /^(https?:)?\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return;
                        try {
                          const b = new URL(v, I).toString();
                          C.setAttribute(P, b);
                        } catch {
                        }
                      } catch {
                      }
                    }, te = Q.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), $ = [];
                    for (const P of Array.from(te || []))
                      try {
                        const C = P.tagName ? P.tagName.toLowerCase() : "";
                        if (C === "a") continue;
                        if (P.hasAttribute("src")) {
                          const v = P.getAttribute("src");
                          Y("src", P);
                          const b = P.getAttribute("src");
                          v !== b && $.push({ attr: "src", tag: C, before: v, after: b });
                        }
                        if (P.hasAttribute("href") && C === "link") {
                          const v = P.getAttribute("href");
                          Y("href", P);
                          const b = P.getAttribute("href");
                          v !== b && $.push({ attr: "href", tag: C, before: v, after: b });
                        }
                        if (P.hasAttribute("href") && C !== "link") {
                          const v = P.getAttribute("href");
                          Y("href", P);
                          const b = P.getAttribute("href");
                          v !== b && $.push({ attr: "href", tag: C, before: v, after: b });
                        }
                        if (P.hasAttribute("xlink:href")) {
                          const v = P.getAttribute("xlink:href");
                          Y("xlink:href", P);
                          const b = P.getAttribute("xlink:href");
                          v !== b && $.push({ attr: "xlink:href", tag: C, before: v, after: b });
                        }
                        if (P.hasAttribute("poster")) {
                          const v = P.getAttribute("poster");
                          Y("poster", P);
                          const b = P.getAttribute("poster");
                          v !== b && $.push({ attr: "poster", tag: C, before: v, after: b });
                        }
                        if (P.hasAttribute("srcset")) {
                          const A = (P.getAttribute("srcset") || "").split(",").map((M) => M.trim()).filter(Boolean).map((M) => {
                            const [k, G] = M.split(/\s+/, 2);
                            if (!k || /^(https?:)?\/\//i.test(k) || k.startsWith("/")) return M;
                            try {
                              const ue = new URL(k, I).toString();
                              return G ? `${ue} ${G}` : ue;
                            } catch {
                              return M;
                            }
                          }).join(", ");
                          P.setAttribute("srcset", A);
                        }
                      } catch {
                      }
                    const T = Q.documentElement && Q.documentElement.outerHTML ? Q.documentElement.outerHTML : w;
                    try {
                      $ && $.length && console.warn("[router] rewritten asset refs", { abs: d, rewritten: $ });
                    } catch {
                    }
                    return { data: { raw: T, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
                  }
                } catch {
                }
                let U = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? U = w.replace(/(<head[^>]*>)/i, `$1<base href="${E}">`) : U = `<base href="${E}">` + w), { data: { raw: U, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
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
  return { data: u, pagePath: f, anchor: s };
}
function Mn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var et = Mn();
function Zr(t) {
  et = t;
}
var Ve = { exec: () => null };
function ee(t, e = "") {
  let r = typeof t == "string" ? t : t.source, i = { replace: (n, s) => {
    let a = typeof s == "string" ? s : s.source;
    return a = a.replace(Se.caret, "$1"), r = r.replace(n, a), i;
  }, getRegex: () => new RegExp(r, e) };
  return i;
}
var Ii = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Se = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, zi = /^(?:[ \t]*(?:\n|$))+/, Bi = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Oi = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Tt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ni = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, $n = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Qr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = ee(Qr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Di = ee(Qr).replace(/bull/g, $n).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Pn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Hi = /^[^\n]+/, In = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, qi = ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", In).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ui = ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, $n).getRegex(), Vt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", zn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ji = ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", zn).replace("tag", Vt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Xr = ee(Pn).replace("hr", Tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), Wi = ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Xr).getRegex(), Bn = { blockquote: Wi, code: Bi, def: qi, fences: Oi, heading: Ni, hr: Tt, html: ji, lheading: Gr, list: Ui, newline: zi, paragraph: Xr, table: Ve, text: Hi }, dr = ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), Fi = { ...Bn, lheading: Di, table: dr, paragraph: ee(Pn).replace("hr", Tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex() }, Zi = { ...Bn, html: ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", zn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ve, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ee(Pn).replace("hr", Tt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Qi = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gi = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Kr = /^( {2,}|\\)\n(?!\s*$)/, Xi = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Jt = /[\p{P}\p{S}]/u, On = /[\s\p{P}\p{S}]/u, Yr = /[^\s\p{P}\p{S}]/u, Ki = ee(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, On).getRegex(), Vr = /(?!~)[\p{P}\p{S}]/u, Yi = /(?!~)[\s\p{P}\p{S}]/u, Vi = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = /(?![*_])[\p{P}\p{S}]/u, Ji = /(?![*_])[\s\p{P}\p{S}]/u, ea = /(?:[^\s\p{P}\p{S}]|[*_])/u, ta = ee(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ii ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), es = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, na = ee(es, "u").replace(/punct/g, Jt).getRegex(), ra = ee(es, "u").replace(/punct/g, Vr).getRegex(), ts = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sa = ee(ts, "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, On).replace(/punct/g, Jt).getRegex(), ia = ee(ts, "gu").replace(/notPunctSpace/g, Vi).replace(/punctSpace/g, Yi).replace(/punct/g, Vr).getRegex(), aa = ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Yr).replace(/punctSpace/g, On).replace(/punct/g, Jt).getRegex(), la = ee(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Jr).getRegex(), oa = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ca = ee(oa, "gu").replace(/notPunctSpace/g, ea).replace(/punctSpace/g, Ji).replace(/punct/g, Jr).getRegex(), ua = ee(/\\(punct)/, "gu").replace(/punct/g, Jt).getRegex(), ha = ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), da = ee(zn).replace("(?:-->|$)", "-->").getRegex(), pa = ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", da).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, fa = ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Qt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ns = ee(/^!?\[(label)\]\[(ref)\]/).replace("label", Qt).replace("ref", In).getRegex(), rs = ee(/^!?\[(ref)\](?:\[\])?/).replace("ref", In).getRegex(), ga = ee("reflink|nolink(?!\\()", "g").replace("reflink", ns).replace("nolink", rs).getRegex(), pr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Nn = { _backpedal: Ve, anyPunctuation: ua, autolink: ha, blockSkip: ta, br: Kr, code: Gi, del: Ve, delLDelim: Ve, delRDelim: Ve, emStrongLDelim: na, emStrongRDelimAst: sa, emStrongRDelimUnd: aa, escape: Qi, link: fa, nolink: rs, punctuation: Ki, reflink: ns, reflinkSearch: ga, tag: pa, text: Xi, url: Ve }, ma = { ...Nn, link: ee(/^!?\[(label)\]\((.*?)\)/).replace("label", Qt).getRegex(), reflink: ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qt).getRegex() }, yn = { ...Nn, emStrongRDelimAst: ia, emStrongLDelim: ra, delLDelim: la, delRDelim: ca, url: ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", pr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", pr).getRegex() }, wa = { ...yn, br: ee(Kr).replace("{2,}", "*").getRegex(), text: ee(yn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ot = { normal: Bn, gfm: Fi, pedantic: Zi }, ct = { normal: Nn, gfm: yn, breaks: wa, pedantic: ma }, ba = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, fr = (t) => ba[t];
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
  let r = t.replace(Se.findPipe, (s, a, h) => {
    let l = !1, o = a;
    for (; --o >= 0 && h[o] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(Se.splitPipe), n = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; n < i.length; n++) i[n] = i[n].trim().replace(Se.slashPipe, "|");
  return i;
}
function ut(t, e, r) {
  let i = t.length;
  if (i === 0) return "";
  let n = 0;
  for (; n < i && t.charAt(i - n - 1) === e; )
    n++;
  return t.slice(0, i - n);
}
function ya(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) r++;
  else if (t[i] === e[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function ka(t, e = 0) {
  let r = e, i = "";
  for (let n of t) if (n === "	") {
    let s = 4 - r % 4;
    i += " ".repeat(s), r += s;
  } else i += n, r++;
  return i;
}
function wr(t, e, r, i, n) {
  let s = e.href, a = e.title || null, h = t[1].replace(n.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: s, title: a, text: h, tokens: i.inlineTokens(h) };
  return i.state.inLink = !1, l;
}
function xa(t, e, r) {
  let i = t.match(r.other.indentCodeCompensation);
  if (i === null) return e;
  let n = i[1];
  return e.split(`
`).map((s) => {
    let a = s.match(r.other.beginningSpace);
    if (a === null) return s;
    let [h] = a;
    return h.length >= n.length ? s.slice(n.length) : s;
  }).join(`
`);
}
var Gt = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : ut(r, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let r = e[0], i = xa(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = ut(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
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
      let r = ut(e[0], `
`).split(`
`), i = "", n = "", s = [];
      for (; r.length > 0; ) {
        let a = !1, h = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) h.push(r[l]), a = !0;
        else if (!a) h.push(r[l]);
        else break;
        r = r.slice(l);
        let o = h.join(`
`), c = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${o}` : o, n = n ? `${n}
${c}` : c;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, s, !0), this.lexer.state.top = u, r.length === 0) break;
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
        let u = ka(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !u.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, c = u.trimStart()) : p ? d = e[1].length + 1 : (d = u.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, c = u.slice(d), d += e[1].length), p && this.rules.other.blankLine.test(f) && (o += f + `
`, t = t.substring(f.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(d), w = this.rules.other.hrRegex(d), y = this.rules.other.fencesBeginRegex(d), x = this.rules.other.headingBeginRegex(d), B = this.rules.other.htmlBeginRegex(d), I = this.rules.other.blockquoteBeginRegex(d);
          for (; t; ) {
            let E = t.split(`
`, 1)[0], U;
            if (f = E, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), U = f) : U = f.replace(this.rules.other.tabCharGlobal, "    "), y.test(f) || x.test(f) || B.test(f) || I.test(f) || m.test(f) || w.test(f)) break;
            if (U.search(this.rules.other.nonSpaceChar) >= d || !f.trim()) c += `
` + U.slice(d);
            else {
              if (p || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || y.test(u) || x.test(u) || w.test(u)) break;
              c += `
` + f;
            }
            p = !f.trim(), o += E + `
`, t = t.substring(E.length + 1), u = U.slice(d);
          }
        }
        n.loose || (a ? n.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (a = !0)), n.items.push({ type: "list_item", raw: o, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), n.raw += o;
      }
      let h = n.items.at(-1);
      if (h) h.raw = h.raw.trimEnd(), h.text = h.text.trimEnd();
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
          let o = l.tokens.filter((u) => u.type === "space"), c = o.length > 0 && o.some((u) => this.rules.other.anyLine.test(u.raw));
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
      for (let a of n) s.rows.push(mr(a, s.header.length).map((h, l) => ({ text: h, tokens: this.lexer.inline(h), header: !1, align: s.align[l] })));
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
        let s = ut(r.slice(0, -1), "\\");
        if ((r.length - s.length) % 2 === 0) return;
      } else {
        let s = ya(e[2], "()");
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
      let n = [...i[0]].length - 1, s, a, h = n, l = 0, o = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (o.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = o.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s) continue;
        if (a = [...s].length, i[3] || i[4]) {
          h += a;
          continue;
        } else if ((i[5] || i[6]) && n % 3 && !((n + a) % 3)) {
          l += a;
          continue;
        }
        if (h -= a, h > 0) continue;
        a = Math.min(a, a + h + l);
        let c = [...i[0]][0].length, u = t.slice(0, n + i.index + c + a);
        if (Math.min(n, a) % 2) {
          let p = u.slice(1, -1);
          return { type: "em", raw: u, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let f = u.slice(2, -2);
        return { type: "strong", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
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
      let n = [...i[0]].length - 1, s, a, h = n, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = l.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s || (a = [...s].length, a !== n)) continue;
        if (i[3] || i[4]) {
          h += a;
          continue;
        }
        if (h -= a, h > 0) continue;
        a = Math.min(a, a + h);
        let o = [...i[0]][0].length, c = t.slice(0, n + i.index + o + a), u = c.slice(n, -n);
        return { type: "del", raw: c, text: u, tokens: this.lexer.inlineTokens(u) };
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
}, $e = class kn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || et, this.options.tokenizer = this.options.tokenizer || new Gt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: Se, block: Ot.normal, inline: ct.normal };
    this.options.pedantic ? (r.block = Ot.pedantic, r.inline = ct.pedantic) : this.options.gfm && (r.block = Ot.gfm, this.options.breaks ? r.inline = ct.breaks : r.inline = ct.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Ot, inline: ct };
  }
  static lex(e, r) {
    return new kn(r).lex(e);
  }
  static lexInline(e, r) {
    return new kn(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Se.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], i = !1) {
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
      let s = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, h = e.slice(1), l;
        this.options.extensions.startBlock.forEach((o) => {
          l = o.call({ lexer: this }, h), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
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
    let a = !1, h = "";
    for (; e; ) {
      a || (h = ""), a = !1;
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
      if (l = this.tokenizer.emStrong(e, i, h)) {
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
      if (l = this.tokenizer.del(e, i, h)) {
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
        let c = 1 / 0, u = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, u), typeof f == "number" && f >= 0 && (c = Math.min(c, f));
        }), c < 1 / 0 && c >= 0 && (o = e.substring(0, c + 1));
      }
      if (l = this.tokenizer.inlineText(o)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (h = l.raw.slice(-1)), a = !0;
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
}, Xt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || et;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: r }) {
    let i = (e || "").match(Se.notSpaceStart)?.[0], n = t.replace(Se.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Oe(i) + '">' + (r ? n : Oe(n, !0)) + `</code></pre>
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
    let e = t.ordered, r = t.start, i = "";
    for (let a = 0; a < t.items.length; a++) {
      let h = t.items[a];
      i += this.listitem(h);
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
    return `<code>${Oe(t, !0)}</code>`;
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
    return e && (s += ' title="' + Oe(e) + '"'), s += ">" + i + "</a>", s;
  }
  image({ href: t, title: e, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let n = gr(t);
    if (n === null) return Oe(r);
    t = n;
    let s = `<img src="${t}" alt="${Oe(r)}"`;
    return e && (s += ` title="${Oe(e)}"`), s += ">", s;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Oe(t.text);
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
    this.options = e || et, this.options.renderer = this.options.renderer || new Xt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Dn();
  }
  static parse(e, r) {
    return new xn(r).parse(e);
  }
  static parseInline(e, r) {
    return new xn(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (this.options.extensions?.renderers?.[n.type]) {
        let a = n, h = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (h !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          r += h || "";
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
        let h = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (h !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += h || "";
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
          let h = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(h), "";
          throw new Error(h);
        }
      }
    }
    return i;
  }
}, dt = class {
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
  defaults = Mn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Pe;
  Renderer = Xt;
  TextRenderer = Dn;
  Lexer = $e;
  Tokenizer = Gt;
  Hooks = dt;
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
            let h = n.renderer.apply(this, a);
            return h === !1 && (h = s.apply(this, a)), h;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = e[n.level];
          s ? s.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), i.extensions = e), r.renderer) {
        let n = this.defaults.renderer || new Xt(this.defaults);
        for (let s in r.renderer) {
          if (!(s in n)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let a = s, h = r.renderer[a], l = n[a];
          n[a] = (...o) => {
            let c = h.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c || "";
          };
        }
        i.renderer = n;
      }
      if (r.tokenizer) {
        let n = this.defaults.tokenizer || new Gt(this.defaults);
        for (let s in r.tokenizer) {
          if (!(s in n)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let a = s, h = r.tokenizer[a], l = n[a];
          n[a] = (...o) => {
            let c = h.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c;
          };
        }
        i.tokenizer = n;
      }
      if (r.hooks) {
        let n = this.defaults.hooks || new dt();
        for (let s in r.hooks) {
          if (!(s in n)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let a = s, h = r.hooks[a], l = n[a];
          dt.passThroughHooks.has(s) ? n[a] = (o) => {
            if (this.defaults.async && dt.passThroughHooksRespectAsync.has(s)) return (async () => {
              let u = await h.call(n, o);
              return l.call(n, u);
            })();
            let c = h.call(n, o);
            return l.call(n, c);
          } : n[a] = (...o) => {
            if (this.defaults.async) return (async () => {
              let u = await h.apply(n, o);
              return u === !1 && (u = await l.apply(n, o)), u;
            })();
            let c = h.apply(n, o);
            return c === !1 && (c = l.apply(n, o)), c;
          };
        }
        i.hooks = n;
      }
      if (r.walkTokens) {
        let n = this.defaults.walkTokens, s = r.walkTokens;
        i.walkTokens = function(a) {
          let h = [];
          return h.push(s.call(this, a)), n && (h = h.concat(n.call(this, a))), h;
        };
      }
      this.defaults = { ...this.defaults, ...i };
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
      let i = { ...r }, n = { ...this.defaults, ...i }, s = this.onError(!!n.silent, !!n.async);
      if (this.defaults.async === !0 && i.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (n.hooks && (n.hooks.options = n, n.hooks.block = t), n.async) return (async () => {
        let a = n.hooks ? await n.hooks.preprocess(e) : e, h = await (n.hooks ? await n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(a, n), l = n.hooks ? await n.hooks.processAllTokens(h) : h;
        n.walkTokens && await Promise.all(this.walkTokens(l, n.walkTokens));
        let o = await (n.hooks ? await n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(l, n);
        return n.hooks ? await n.hooks.postprocess(o) : o;
      })().catch(s);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let a = (n.hooks ? n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(e, n);
        n.hooks && (a = n.hooks.processAllTokens(a)), n.walkTokens && this.walkTokens(a, n.walkTokens);
        let h = (n.hooks ? n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(a, n);
        return n.hooks && (h = n.hooks.postprocess(h)), h;
      } catch (a) {
        return s(a);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + Oe(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
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
ne.getDefaults = Mn;
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
ne.Renderer = Xt;
ne.TextRenderer = Dn;
ne.Lexer = $e;
ne.lexer = $e.lex;
ne.Tokenizer = Gt;
ne.Hooks = dt;
ne.parse = ne;
ne.options;
ne.setOptions;
ne.use;
ne.walkTokens;
ne.parseInline;
Pe.parse;
$e.lex;
const ss = `function j() {
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
`, br = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", ss], { type: "text/javascript;charset=utf-8" });
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
      "data:text/javascript;charset=utf-8," + encodeURIComponent(ss),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function Ea(t) {
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
const is = Ir(() => new va(), "markdown"), yr = typeof DOMParser < "u" ? new DOMParser() : null;
function Sn() {
  return is.get();
}
function Aa(t) {
  return is.send(t, 1e3);
}
const Ge = [];
function vn(t) {
  if (t && typeof t == "object") {
    Ge.push(t);
    try {
      ne.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function Ra(t) {
  Ge.length = 0, Array.isArray(t) && Ge.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Ge.forEach((e) => ne.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Kt(t) {
  if (Sn && Sn())
    try {
      const s = await Aa({ type: "render", md: t });
      if (s && s.html !== void 0)
        try {
          const h = (yr || new DOMParser()).parseFromString(s.html, "text/html"), l = h.querySelectorAll("h1,h2,h3,h4,h5,h6");
          l.forEach((u) => {
            u.id || (u.id = re(u.textContent || ""));
          });
          try {
            h.querySelectorAll("img").forEach((f) => {
              try {
                f.getAttribute("loading") || f.setAttribute("data-want-lazy", "1");
              } catch (p) {
                console.warn("[markdown] set image loading attribute failed", p);
              }
            });
          } catch (u) {
            console.warn("[markdown] query images failed", u);
          }
          try {
            h.querySelectorAll("pre code").forEach((f) => {
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
          } catch (u) {
            console.warn("[markdown] query code blocks failed", u);
          }
          const o = h.body.innerHTML, c = [];
          return l.forEach((u) => {
            c.push({ level: Number(u.tagName.substring(1)), text: (u.textContent || "").trim(), id: u.id });
          }), { html: o, meta: s.meta || {}, toc: c };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), s;
        }
    } catch (s) {
      console.warn("[markdown] worker render failed", s);
    }
  const { content: r, data: i } = Ea(t || "");
  if (ne.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Ge && Ge.length)
    try {
      Ge.forEach((s) => ne.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
  let n = ne.parse(r);
  try {
    const a = (yr || new DOMParser()).parseFromString(n, "text/html"), h = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    h.forEach((o) => {
      o.id || (o.id = re(o.textContent || ""));
    });
    try {
      a.querySelectorAll("img").forEach((c) => {
        try {
          c.getAttribute("loading") || c.setAttribute("data-want-lazy", "1");
        } catch (u) {
          console.warn("[markdown] set image loading attribute failed", u);
        }
      });
    } catch (o) {
      console.warn("[markdown] query images failed", o);
    }
    try {
      a.querySelectorAll("pre code").forEach((c) => {
        try {
          const u = c.getAttribute && c.getAttribute("class") || c.className || "", f = String(u || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
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
        } catch (u) {
          console.warn("[markdown] processing code blocks failed", u);
        }
      });
    } catch (o) {
      console.warn("[markdown] query code blocks failed", o);
    }
    n = a.body.innerHTML;
    const l = [];
    return h.forEach((o) => {
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
      const h = a[1].toLowerCase();
      if (Lr.has(h) || e && e.size && h.length < 3 && !e.has(h) && !(Re && Re[h] && e.has(Re[h]))) continue;
      if (e && e.size) {
        if (e.has(h)) {
          const o = e.get(h);
          o && r.add(o);
          continue;
        }
        if (Re && Re[h]) {
          const o = Re[h];
          if (e.has(o)) {
            const c = e.get(o) || o;
            r.add(c);
            continue;
          }
        }
      }
      (s.has(h) || h.length >= 5 && h.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(h) && !n.has(h)) && r.add(h);
    }
  return r;
}
const Ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: vn,
  detectFenceLanguages: En,
  initRendererWorker: Sn,
  markdownPlugins: Ge,
  parseMarkdownToHtml: Kt,
  setMarkdownExtensions: Ra
}, Symbol.toStringTag, { value: "Module" }));
function Ca(t, e) {
  const r = document.createElement("aside");
  r.className = "menu nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = t("navigation"), r.appendChild(i);
  const n = document.createElement("ul");
  return n.className = "menu-list", e.forEach((s) => {
    const a = document.createElement("li"), h = document.createElement("a");
    if (h.href = "#" + s.path, h.textContent = s.name, a.appendChild(h), s.children && s.children.length) {
      const l = document.createElement("ul");
      s.children.forEach((o) => {
        const c = document.createElement("li"), u = document.createElement("a");
        u.href = "#" + o.path, u.textContent = o.name, c.appendChild(u), l.appendChild(c);
      }), a.appendChild(l);
    }
    n.appendChild(a);
  }), r.appendChild(n), r;
}
function La(t, e, r = "") {
  const i = document.createElement("aside");
  i.className = "menu nimbi-toc-inner";
  const n = document.createElement("p");
  n.className = "menu-label", n.textContent = t("onThisPage"), i.appendChild(n);
  const s = document.createElement("ul");
  return s.className = "menu-list", (e || []).forEach((a) => {
    try {
      if (!a || a.level === 1) return;
      const h = document.createElement("li"), l = document.createElement("a"), o = a.id || re(a.text || "");
      l.textContent = a.text || "";
      try {
        const c = String(r || "").replace(/^[\.\/]+/, ""), u = c && q && q.has && q.has(c) ? q.get(c) : c;
        u ? l.href = `?page=${encodeURIComponent(u)}#${encodeURIComponent(o)}` : l.href = `#${encodeURIComponent(o)}`;
      } catch (c) {
        console.warn("[htmlBuilder] buildTocElement href normalization failed", c), l.href = `#${encodeURIComponent(o)}`;
      }
      h.appendChild(l), s.appendChild(h);
    } catch {
    }
  }), i.appendChild(s), i;
}
function as(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((r) => {
    r.id || (r.id = re(r.textContent || ""));
  });
}
function _a(t, e, r) {
  try {
    const i = t.querySelectorAll("img");
    if (i && i.length) {
      const n = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      i.forEach((s) => {
        const a = s.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const h = new URL(n + a, r).toString();
            s.src = h;
            try {
              s.getAttribute("loading") || s.setAttribute("data-want-lazy", "1");
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (h) {
            console.warn("[htmlBuilder] resolve image src failed", h);
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
        const h = a.tagName ? a.tagName.toLowerCase() : "", l = (o) => {
          try {
            const c = a.getAttribute(o) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              a.setAttribute(o, new URL(c, n).toString());
            } catch {
            }
          } catch {
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && l("src"), a.hasAttribute && a.hasAttribute("href") && h !== "a" && l("href"), a.hasAttribute && a.hasAttribute("xlink:href") && l("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && l("poster"), a.hasAttribute("srcset")) {
          const u = (a.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [p, d] = f.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return f;
            try {
              const m = new URL(p, n).toString();
              return d ? `${m} ${d}` : m;
            } catch {
              return f;
            }
          }).join(", ");
          a.setAttribute("srcset", u);
        }
      } catch {
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let xr = "", hn = null, Sr = "";
async function ls(t, e, r) {
  try {
    const i = t.querySelectorAll("a");
    if (!i || !i.length) return;
    let n, s;
    if (e === xr && hn)
      n = hn, s = Sr;
    else {
      try {
        n = new URL(e, location.href), s = St(n.pathname);
      } catch {
        try {
          n = new URL(e, location.href), s = St(n.pathname);
        } catch {
          n = null, s = "/";
        }
      }
      xr = e, hn = n, Sr = s;
    }
    const a = /* @__PURE__ */ new Set(), h = [], l = /* @__PURE__ */ new Set(), o = [];
    for (const c of Array.from(i))
      try {
        const u = c.getAttribute("href") || "";
        if (!u || zr(u)) continue;
        try {
          if (u.startsWith("?") || u.indexOf("?") !== -1)
            try {
              const p = new URL(u, e || location.href), d = p.searchParams.get("page");
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
        if (u.startsWith("/") && !u.endsWith(".md")) continue;
        const f = u.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (f) {
          let p = f[1];
          const d = f[2];
          !p.startsWith("/") && r && (p = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + p);
          try {
            const m = new URL(p, e).pathname;
            let w = m.startsWith(s) ? m.slice(s.length) : m;
            w = ce(w), h.push({ node: c, mdPathRaw: p, frag: d, rel: w }), q.has(w) || a.add(w);
          } catch (m) {
            console.warn("[htmlBuilder] resolve mdPath failed", m);
          }
          continue;
        }
        try {
          let p = u;
          !u.startsWith("/") && r && (u.startsWith("#") ? p = r + u : p = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + u);
          const m = new URL(p, e).pathname || "";
          if (m && m.indexOf(s) !== -1) {
            let w = m.startsWith(s) ? m.slice(s.length) : m;
            if (w = ce(w), w = vt(w), w || (w = "_home"), !w.endsWith(".md")) {
              let y = null;
              try {
                if (q && q.has && q.has(w))
                  y = q.get(w);
                else
                  try {
                    const x = String(w || "").replace(/^.*\//, "");
                    x && q.has && q.has(x) && (y = q.get(x));
                  } catch {
                  }
              } catch {
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
      } catch (u) {
        console.warn("[htmlBuilder] processing anchor failed", u);
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
        const u = await be(c, e);
        if (u && u.raw) {
          const f = (u.raw || "").match(/^#\s+(.+)$/m);
          if (f && f[1]) {
            const p = re(f[1].trim());
            if (p)
              try {
                K.set(p, c), q.set(c, p);
              } catch (d) {
                console.warn("[htmlBuilder] setting slug mapping failed", d);
              }
          }
        }
      } catch (u) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", u);
      }
    })), l.size && await Promise.all(Array.from(l).map(async (c) => {
      try {
        const u = await be(c, e);
        if (u && u.raw)
          try {
            const p = (Hn || new DOMParser()).parseFromString(u.raw, "text/html"), d = p.querySelector("title"), m = p.querySelector("h1"), w = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
            if (w) {
              const y = re(w);
              if (y)
                try {
                  K.set(y, c), q.set(c, y);
                } catch (x) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", x);
                }
            }
          } catch (f) {
            console.warn("[htmlBuilder] parse fetched HTML failed", f);
          }
      } catch (u) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", u);
      }
    }));
    for (const c of h) {
      const { node: u, frag: f, rel: p } = c;
      let d = null;
      try {
        q.has(p) && (d = q.get(p));
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug access failed", m);
      }
      d ? f ? u.setAttribute("href", `?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`) : u.setAttribute("href", `?page=${encodeURIComponent(d)}`) : f ? u.setAttribute("href", `?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`) : u.setAttribute("href", `?page=${encodeURIComponent(p)}`);
    }
    for (const c of o) {
      const { node: u, rel: f } = c;
      let p = null;
      try {
        q.has(f) && (p = q.get(f));
      } catch {
      }
      if (!p)
        try {
          const d = String(f || "").replace(/^.*\//, "");
          q.has(d) && (p = q.get(d));
        } catch {
        }
      p ? u.setAttribute("href", `?page=${encodeURIComponent(p)}`) : u.setAttribute("href", `?page=${encodeURIComponent(f)}`);
    }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function Ma(t, e, r, i) {
  const n = e.querySelector("h1"), s = n ? (n.textContent || "").trim() : "";
  let a = "";
  try {
    s && (a = re(s)), !a && t && t.meta && t.meta.title && (a = re(t.meta.title)), !a && r && (a = re(String(r))), a || (a = "_home");
    try {
      r && (K.set(a, r), q.set(r, a));
    } catch (h) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", h);
    }
    try {
      let h = "?page=" + encodeURIComponent(a);
      try {
        const l = i || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        l && (h += "#" + encodeURIComponent(l));
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", l);
      }
      try {
        history.replaceState({ page: a }, "", h);
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug history replace failed", l);
      }
    } catch (h) {
      console.warn("[htmlBuilder] computeSlug inner failed", h);
    }
  } catch (h) {
    console.warn("[htmlBuilder] computeSlug failed", h);
  }
  return { topH1: n, h1Text: s, slugKey: a };
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
        if (q && q.has && q.has(p)) continue;
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
  const i = async (l) => {
    try {
      const o = await be(l, e);
      if (o && o.raw)
        try {
          const u = (Hn || new DOMParser()).parseFromString(o.raw, "text/html"), f = u.querySelector("title"), p = u.querySelector("h1"), d = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (d) {
            const m = re(d);
            if (m)
              try {
                K.set(m, l), q.set(l, m);
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
  const h = [];
  for (; a < s.length; ) {
    const l = s.slice(a, a + n);
    h.push(Promise.all(l.map(i))), a += n;
  }
  await Promise.all(h);
}
async function Pa(t, e) {
  if (!t || !t.length) return;
  const r = [], i = /* @__PURE__ */ new Set();
  let n = "";
  try {
    const s = new URL(e);
    n = St(s.pathname);
  } catch (s) {
    n = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", s);
  }
  for (const s of Array.from(t || []))
    try {
      const a = s.getAttribute("href") || "";
      if (!a) continue;
      const h = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (h) {
        let l = ce(h[1]);
        try {
          let o;
          try {
            o = new URL(l, e).pathname;
          } catch (u) {
            o = l, console.warn("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const c = o.startsWith(n) ? o.slice(n.length) : o.replace(/^\//, "");
          r.push({ rel: c }), q.has(c) || i.add(c);
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
      const a = String(s).match(/([^\/]+)\.md$/), h = a && a[1];
      if (h && K.has(h)) {
        try {
          const l = K.get(h);
          l && q.set(l, h);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await be(s, e);
      if (a && a.raw) {
        const h = (a.raw || "").match(/^#\s+(.+)$/m);
        if (h && h[1]) {
          const l = re(h[1].trim());
          if (l)
            try {
              K.set(l, s), q.set(s, l);
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
const Hn = typeof DOMParser < "u" ? new DOMParser() : null;
function dn(t) {
  try {
    const r = (Hn || new DOMParser()).parseFromString(t || "", "text/html");
    as(r);
    try {
      r.querySelectorAll("img").forEach((h) => {
        try {
          h.getAttribute("loading") || h.setAttribute("data-want-lazy", "1");
        } catch (l) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", l);
        }
      });
    } catch (a) {
      console.warn("[htmlBuilder] parseHtml query images failed", a);
    }
    r.querySelectorAll("pre code, code[class]").forEach((a) => {
      try {
        const h = a.getAttribute && a.getAttribute("class") || a.className || "", l = h.match(/language-([a-zA-Z0-9_+-]+)/) || h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), c = J.size && (J.get(o) || J.get(String(o).toLowerCase())) || o;
          try {
            (async () => {
              try {
                await xt(c);
              } catch (u) {
                console.warn("[htmlBuilder] registerLanguage failed", u);
              }
            })();
          } catch (u) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", u);
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
      } catch (h) {
        console.warn("[htmlBuilder] code element processing failed", h);
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
  const e = En ? En(t || "", J) : /* @__PURE__ */ new Set(), r = new Set(e), i = [];
  for (const n of r)
    try {
      const s = J.size && (J.get(n) || J.get(String(n).toLowerCase())) || n;
      try {
        i.push(xt(s));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(n) !== String(s))
        try {
          i.push(xt(n));
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
async function za(t) {
  if (await Ia(t), Kt) {
    const e = await Kt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function Ba(t, e, r, i, n) {
  let s = null;
  if (e.isHtml)
    try {
      const u = typeof DOMParser < "u" ? new DOMParser() : null;
      if (u) {
        const f = u.parseFromString(e.raw || "", "text/html");
        try {
          kr(f.body, r, n);
        } catch {
        }
        s = dn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : e.raw || "");
      } else
        s = dn(e.raw || "");
    } catch {
      s = dn(e.raw || "");
    }
  else
    s = await za(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = s.html;
  try {
    kr(a, r, n);
  } catch (u) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    as(a);
  } catch (u) {
    console.warn("[htmlBuilder] addHeadingIds failed", u);
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
  } catch (u) {
    console.warn("[htmlBuilder] processing code elements failed", u);
  }
  try {
    li(a);
  } catch (u) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", u);
  }
  _a(a, r, n);
  const { topH1: h, h1Text: l, slugKey: o } = Ma(s, a, r, i);
  try {
    await Oa(a, n, r);
  } catch (u) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await ls(a, n, r);
  }
  const c = La(t, s.toc, r);
  return { article: a, parsed: s, toc: c, topH1: h, h1Text: l, slugKey: o };
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
async function Oa(t, e, r) {
  return ls(t, e, r);
}
function Na(t) {
  try {
    t.addEventListener("click", (e) => {
      const r = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!r) return;
      const i = r.getAttribute("href") || "";
      try {
        const n = new URL(i, location.href), s = n.searchParams.get("page"), a = n.hash ? n.hash.replace(/^#/, "") : null;
        if (!s && !a) return;
        e.preventDefault();
        let h = null;
        try {
          history && history.state && history.state.page && (h = history.state.page);
        } catch (l) {
          h = null, console.warn("[htmlBuilder] access history.state failed", l);
        }
        try {
          h || (h = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          console.warn("[htmlBuilder] parse current location failed", l);
        }
        if (!s && a || s && h && String(s) === String(h)) {
          try {
            if (!s && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: h || s }, "", "?page=" + encodeURIComponent(h || s) + (a ? "#" + encodeURIComponent(a) : ""));
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
            An(a);
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
function An(t) {
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
function Da(t, e, { mountOverlay: r = null, container: i = null, mountEl: n = null, navWrap: s = null, t: a = null } = {}) {
  try {
    const h = a || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), o = n || document.querySelector(".nimbi-mount"), c = r || document.querySelector(".nimbi-overlay"), u = s || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top", p.setAttribute("aria-label", h("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
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
    const d = u && u.querySelector ? u.querySelector(".menu-label") : null;
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
      jt(() => m.addEventListener("scroll", w)), w();
    }
  } catch (h) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", h);
  }
}
async function Ha(t, e, r, i, n, s, a, h, l = "eager", o = 1, c = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const u = typeof DOMParser < "u" ? new DOMParser() : null, f = u ? u.parseFromString(r || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await jt(() => $a(p, i)), await jt(() => Pa(p, i));
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
      C ? I.href = "?page=" + encodeURIComponent(decodeURIComponent(C)) : (I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home"));
    } catch {
      I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home");
    }
  } else
    I.href = "?page=" + encodeURIComponent(n), I.textContent = s("home");
  x.appendChild(I), I.addEventListener("click", function(T) {
    const P = I.getAttribute("href") || "";
    if (P.startsWith("?page=")) {
      T.preventDefault();
      const C = new URL(P, location.href), v = C.searchParams.get("page"), b = C.hash ? C.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", "?page=" + encodeURIComponent(v) + (b ? "#" + encodeURIComponent(b) : ""));
      try {
        a();
      } catch (A) {
        console.warn("[nimbi-cms] renderByQuery failed", A);
      }
    }
  });
  const E = document.createElement("a");
  E.className = "navbar-burger", E.setAttribute("role", "button"), E.setAttribute("aria-label", "menu"), E.setAttribute("aria-expanded", "false");
  const U = "nimbi-navbar-menu";
  E.dataset.target = U, E.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', x.appendChild(E);
  try {
    E.addEventListener("click", (T) => {
      try {
        const P = E.dataset && E.dataset.target ? E.dataset.target : null, C = P ? document.getElementById(P) : null;
        E.classList.contains("is-active") ? (E.classList.remove("is-active"), E.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active")) : (E.classList.add("is-active"), E.setAttribute("aria-expanded", "true"), C && C.classList.add("is-active"));
      } catch (P) {
        console.warn("[nimbi-cms] navbar burger toggle failed", P);
      }
    });
  } catch (T) {
    console.warn("[nimbi-cms] burger event binding failed", T);
  }
  const O = document.createElement("div");
  O.className = "navbar-menu", O.id = U;
  const Q = document.createElement("div");
  Q.className = "navbar-start";
  let Y, te, $;
  if (!h)
    Y = null, m = null, $ = null;
  else {
    Y = document.createElement("div"), Y.className = "navbar-end", te = document.createElement("div"), te.className = "navbar-item", te.style.position = "relative", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = s("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0, m.classList.add("is-loading")), te.appendChild(m), $ = document.createElement("div"), $.id = "nimbi-search-results", $.className = "box", $.style.position = "absolute", $.style.top = "100%", $.style.right = "0", $.style.left = "auto", $.style.zIndex = "10000", $.style.minWidth = "240px", $.style.maxWidth = "420px", $.style.maxHeight = "50vh", $.style.overflowY = "auto", $.style.display = "none", $.style.padding = "8px", $.style.boxShadow = "0 6px 18px rgba(10,10,10,0.1)", te.appendChild($), Y.appendChild(te);
    const T = (C) => {
      if ($.innerHTML = "", !C.length) {
        $.style.display = "none";
        return;
      }
      C.forEach((v) => {
        const b = document.createElement("div");
        if (b.style.marginBottom = "6px", b.style.padding = "6px", b.style.borderBottom = "1px solid rgba(0,0,0,0.06)", v.parentTitle) {
          const M = document.createElement("div");
          M.textContent = v.parentTitle, M.style.fontSize = "11px", M.style.opacity = "0.7", M.style.marginBottom = "4px", M.className = "nimbi-search-parent", M.style.whiteSpace = "nowrap", M.style.overflow = "hidden", M.style.textOverflow = "ellipsis", M.style.display = "block", M.style.maxWidth = "100%", b.appendChild(M);
        }
        const A = document.createElement("a");
        A.className = "block", A.href = "?page=" + encodeURIComponent(v.slug), A.textContent = v.title, A.style.whiteSpace = "nowrap", A.style.overflow = "hidden", A.style.textOverflow = "ellipsis", A.addEventListener("click", () => {
          $.style.display = "none";
        }), b.appendChild(A), $.appendChild(b);
      }), $.style.display = "block", $.style.right = "0", $.style.left = "auto";
    }, P = (C, v) => {
      let b = null;
      return (...A) => {
        b && clearTimeout(b), b = setTimeout(() => C(...A), v);
      };
    };
    if (m) {
      const C = P(async () => {
        const v = document.querySelector("input#nimbi-search"), b = String(v && v.value || "").trim().toLowerCase();
        if (!b) {
          T([]);
          return;
        }
        try {
          const A = await Promise.resolve().then(() => Ht);
          d || (d = (async () => {
            try {
              return l === "lazy" && A.buildSearchIndexWorker ? A.buildSearchIndexWorker(i, o, c) : A.buildSearchIndex(i, o, c);
            } catch (G) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", G), [];
            } finally {
              v && (v.removeAttribute("disabled"), v.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((G) => G.title && G.title.toLowerCase().includes(b) || G.excerpt && G.excerpt.toLowerCase().includes(b));
          T(k.slice(0, 10));
        } catch (A) {
          console.warn("[nimbi-cms] search input handler failed", A), T([]);
        }
      }, 50);
      m && m.addEventListener("input", C), document.addEventListener("click", (v) => {
        const b = document.querySelector("input#nimbi-search");
        b && !b.contains(v.target) && $ && !$.contains(v.target) && ($.style.display = "none");
      });
    }
    if (l === "eager") {
      try {
        d = (async () => {
          try {
            const v = await (await Promise.resolve().then(() => Ht)).buildSearchIndex(i, o, c);
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
    const P = p[T];
    if (T === 0) continue;
    const C = P.getAttribute("href") || "#", v = document.createElement("a");
    v.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(C) || C.endsWith(".md")) {
        const A = ce(C).split(/::|#/, 2), M = A[0], k = A[1];
        v.href = "?page=" + encodeURIComponent(M) + (k ? "#" + encodeURIComponent(k) : "");
      } else if (/\.html(?:$|[#?])/.test(C) || C.endsWith(".html")) {
        const A = ce(C).split(/::|#/, 2);
        let M = A[0];
        M && !M.toLowerCase().endsWith(".html") && (M = M + ".html");
        const k = A[1];
        try {
          const G = await be(M, i);
          if (G && G.raw)
            try {
              const oe = new DOMParser().parseFromString(G.raw, "text/html"), Le = oe.querySelector("title"), ve = oe.querySelector("h1"), Ee = Le && Le.textContent && Le.textContent.trim() ? Le.textContent.trim() : ve && ve.textContent ? ve.textContent.trim() : null;
              if (Ee) {
                const fe = re(Ee);
                if (fe) {
                  try {
                    K.set(fe, M), q.set(M, fe);
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
      const b = P.textContent && String(P.textContent).trim() ? String(P.textContent).trim() : null;
      if (b)
        try {
          const A = re(b);
          if (A) {
            const M = v.getAttribute && v.getAttribute("href") ? v.getAttribute("href") : "";
            try {
              const G = new URL(M, location.href).searchParams.get("page");
              if (G) {
                const ue = decodeURIComponent(G);
                try {
                  K.set(A, ue), q.set(ue, A);
                } catch (oe) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", oe);
                }
              }
            } catch (k) {
              console.warn("[nimbi-cms] nav slug mapping failed", k);
            }
          }
        } catch (A) {
          console.warn("[nimbi-cms] nav slug mapping failed", A);
        }
    } catch (b) {
      console.warn("[nimbi-cms] nav slug mapping failed", b);
    }
    v.textContent = P.textContent || C, Q.appendChild(v);
  }
  try {
    m = document.getElementById("nimbi-search");
    const T = document.getElementById("nimbi-search-results"), P = (v) => {
      if (T.innerHTML = "", !v.length) {
        T.style.display = "none";
        return;
      }
      v.forEach((b) => {
        const A = document.createElement("div");
        if (A.style.marginBottom = "6px", A.style.padding = "6px", A.style.borderBottom = "1px solid rgba(0,0,0,0.06)", b.parentTitle) {
          const k = document.createElement("div");
          k.textContent = b.parentTitle, k.style.fontSize = "11px", k.style.opacity = "0.7", k.style.marginBottom = "4px", k.className = "nimbi-search-parent", k.style.whiteSpace = "nowrap", k.style.overflow = "hidden", k.style.textOverflow = "ellipsis", k.style.display = "block", k.style.maxWidth = "100%", A.appendChild(k);
        }
        const M = document.createElement("a");
        M.className = "block", M.href = "?page=" + encodeURIComponent(b.slug), M.textContent = b.title, M.style.whiteSpace = "nowrap", M.style.overflow = "hidden", M.style.textOverflow = "ellipsis", M.addEventListener("click", () => {
          T.style.display = "none";
        }), A.appendChild(M), T.appendChild(A);
      }), T.style.display = "block", T.style.right = "0", T.style.left = "auto";
    }, C = (v, b) => {
      let A = null;
      return (...M) => {
        A && clearTimeout(A), A = setTimeout(() => v(...M), b);
      };
    };
    if (m) {
      const v = C(async () => {
        const b = String(m.value || "").trim().toLowerCase();
        if (!b) {
          P([]);
          return;
        }
        try {
          const A = await Promise.resolve().then(() => Ht);
          d || (d = (async () => {
            try {
              return l === "lazy" && A.buildSearchIndexWorker ? A.buildSearchIndexWorker(i, o, c) : A.buildSearchIndex(i, o, c);
            } catch (G) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", G), [];
            } finally {
              m && (m.disabled = !1, m.classList.remove("is-loading"));
            }
          })());
          const k = (await d).filter((G) => G.title && G.title.toLowerCase().includes(b) || G.excerpt && G.excerpt.toLowerCase().includes(b));
          P(k.slice(0, 10));
        } catch (A) {
          console.warn("[nimbi-cms] search input handler failed", A), P([]);
        }
      }, 50);
      m.addEventListener("input", v), document.addEventListener("click", (b) => {
        m && !m.contains(b.target) && T && !T.contains(b.target) && (T.style.display = "none");
      });
    }
  } catch (T) {
    console.warn("[nimbi-cms] navbar/search setup inner failed", T);
  }
  O.appendChild(Q), Y && O.appendChild(Y), y.appendChild(x), y.appendChild(O), t.appendChild(y);
  try {
    O.addEventListener("click", (T) => {
      const P = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!P) return;
      const C = P.getAttribute("href") || "";
      try {
        const v = new URL(C, location.href), b = v.searchParams.get("page"), A = v.hash ? v.hash.replace(/^#/, "") : null;
        if (b) {
          T.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (A ? "#" + encodeURIComponent(A) : ""));
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
        const v = y && y.querySelector ? y.querySelector(".navbar-burger") : null, b = v && v.dataset ? v.dataset.target : null, A = b ? document.getElementById(b) : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), A && A.classList.remove("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (T) {
    console.warn("[nimbi-cms] attach content click handler failed", T);
  }
  try {
    e.addEventListener("click", (T) => {
      const P = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!P) return;
      const C = P.getAttribute("href") || "";
      if (C && !zr(C))
        try {
          const v = new URL(C, location.href), b = v.searchParams.get("page"), A = v.hash ? v.hash.replace(/^#/, "") : null;
          if (b) {
            T.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (A ? "#" + encodeURIComponent(A) : ""));
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
var pn, Er;
function qa() {
  if (Er) return pn;
  Er = 1;
  function t(s, a) {
    return a.some(
      ([h, l]) => h <= s && s <= l
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
    let h = 0, l = 0, o = s.length - 1;
    const c = a.wordsPerMinute || 200, u = a.wordBound || r;
    for (; u(s[l]); ) l++;
    for (; u(s[o]); ) o--;
    const f = `${s}
`;
    for (let w = l; w <= o; w++)
      if ((e(f[w]) || !u(f[w]) && (u(f[w + 1]) || e(f[w + 1]))) && h++, e(f[w]))
        for (; w <= o && (i(f[w + 1]) || u(f[w + 1])); )
          w++;
    const p = h / c, d = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: d,
      words: h
    };
  }
  return pn = n, pn;
}
var Ua = qa();
const ja = /* @__PURE__ */ Cr(Ua);
function Ar(t, e) {
  let r = document.querySelector(`meta[name="${t}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", t), document.head.appendChild(r)), r.setAttribute("content", e);
}
function rt(t, e, r) {
  let i = `meta[${t}="${e}"]`, n = document.querySelector(i);
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
function Fa(t, e, r, i) {
  const n = e && String(e).trim() ? e : t.title || document.title;
  rt("property", "og:title", n);
  const s = i && String(i).trim() ? i : t.description || "";
  s && String(s).trim() && rt("property", "og:description", s), rt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = r || t.image;
  a && (rt("property", "og:image", a), rt("name", "twitter:image", a));
}
function Za(t, e, r, i, n = "") {
  const s = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", h = i && String(i).trim() ? i : s.description && String(s.description).trim() ? s.description : a && String(a).trim() ? a : "";
  h && String(h).trim() && Ar("description", h), Ar("robots", s.robots || "index,follow"), Fa(s, e, r, h);
}
function Qa() {
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
function Ga(t, e, r, i, n, s = "") {
  try {
    const a = t.meta || {}, h = r && String(r).trim() ? r : a.title || s || document.title, l = n && String(n).trim() ? n : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = i || a.image || null;
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
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: h || "",
      description: l || "",
      url: c || location.href.split("#")[0]
    };
    o && (u.image = String(o)), a.date && (u.datePublished = a.date), a.dateModified && (u.dateModified = a.dateModified);
    const f = "nimbi-jsonld";
    let p = document.getElementById(f);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = f, document.head.appendChild(p)), p.textContent = JSON.stringify(u, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function Xa(t, e, r, i, n, s, a, h, l, o, c) {
  try {
    const u = i.querySelector(".menu-label");
    u && (u.textContent = h && h.textContent || t("onThisPage"));
  } catch (u) {
    console.warn("[seoManager] update toc label failed", u);
  }
  try {
    const u = r.meta && r.meta.title ? String(r.meta.title).trim() : "", f = n.querySelector("img"), p = f && (f.getAttribute("src") || f.src) || null;
    let d = "";
    try {
      let w = "";
      try {
        const y = h || (n && n.querySelector ? n.querySelector("h1") : null);
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
      Ga(r, o, l, p, d, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Qa();
    l ? m ? document.title = `${m} - ${l}` : document.title = `${e || "Site"} - ${l}` : u ? document.title = u : document.title = e || document.title;
  } catch (u) {
    console.warn("[seoManager] applyPageMeta failed", u);
  }
  try {
    const u = n.querySelector(".nimbi-reading-time");
    if (u && u.remove(), l) {
      const f = ja(c.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, d = document.createElement("p");
      d.className = "nimbi-reading-time", d.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = n.querySelector("h1");
      m && m.insertAdjacentElement("afterend", d);
    }
  } catch (u) {
    console.warn("[seoManager] reading time update failed", u);
  }
}
let ke = null, W = null, xe = 1, Fe = (t, e) => e, wt = 0, bt = 0, qt = () => {
}, pt = 0.25;
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
    b.target === t && fn();
  }), t.addEventListener("wheel", (b) => {
    if (!te()) return;
    b.preventDefault();
    const A = b.deltaY < 0 ? pt : -pt;
    qe(xe + A), o(), c();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      fn();
      return;
    }
    if (xe > 1) {
      const A = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!A) return;
      const M = 40;
      switch (b.key) {
        case "ArrowUp":
          A.scrollTop -= M, b.preventDefault();
          break;
        case "ArrowDown":
          A.scrollTop += M, b.preventDefault();
          break;
        case "ArrowLeft":
          A.scrollLeft -= M, b.preventDefault();
          break;
        case "ArrowRight":
          A.scrollLeft += M, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), ke = t, W = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), r = t.querySelector("[data-nimbi-preview-original]"), i = t.querySelector("[data-nimbi-preview-zoom-in]"), n = t.querySelector("[data-nimbi-preview-zoom-out]"), s = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), h = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function o() {
    h && (h.textContent = `${Math.round(xe * 100)}%`);
  }
  const c = () => {
    l && (l.textContent = `${Math.round(xe * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  qt = o, i.addEventListener("click", () => {
    qe(xe + pt), o(), c();
  }), n.addEventListener("click", () => {
    qe(xe - pt), o(), c();
  }), e.addEventListener("click", () => {
    yt(), o(), c();
  }), r.addEventListener("click", () => {
    qe(1), o(), c();
  }), s.addEventListener("click", () => {
    yt(), o(), c();
  }), a.addEventListener("click", fn), e.title = Fe("imagePreviewFit", "Fit to screen"), r.title = Fe("imagePreviewOriginal", "Original size"), n.title = Fe("imagePreviewZoomOut", "Zoom out"), i.title = Fe("imagePreviewZoomIn", "Zoom in"), a.title = Fe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Fe("imagePreviewClose", "Close"));
  let u = !1, f = 0, p = 0, d = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let y = 0, x = 1;
  const B = (b, A) => {
    const M = b.x - A.x, k = b.y - A.y;
    return Math.hypot(M, k);
  }, I = () => {
    u = !1, w.clear(), y = 0, W && (W.style.cursor = "all-scroll");
  };
  let E = 0, U = 0, O = 0;
  const Q = (b) => {
    const A = Date.now(), M = A - E, k = b.clientX - U, G = b.clientY - O;
    E = A, U = b.clientX, O = b.clientY, M < 300 && Math.hypot(k, G) < 30 && (qe(xe > 1 ? 1 : 2), o(), b.preventDefault());
  }, Y = (b) => {
    qe(xe > 1 ? 1 : 2), o(), b.preventDefault();
  }, te = () => ke ? typeof ke.open == "boolean" ? ke.open : ke.classList.contains("is-active") : !1, $ = (b, A, M = 1) => {
    if (w.has(M) && w.set(M, { x: b, y: A }), w.size === 2) {
      const oe = Array.from(w.values()), Le = B(oe[0], oe[1]);
      if (y > 0) {
        const ve = Le / y;
        qe(x * ve);
      }
      return;
    }
    if (!u) return;
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    if (!k) return;
    const G = b - f, ue = A - p;
    k.scrollLeft = d - G, k.scrollTop = m - ue;
  }, T = (b, A, M = 1) => {
    if (!te()) return;
    if (w.set(M, { x: b, y: A }), w.size === 2) {
      const ue = Array.from(w.values());
      y = B(ue[0], ue[1]), x = xe;
      return;
    }
    const k = W.closest(".nimbi-image-preview__image-wrapper");
    !k || !(k.scrollWidth > k.clientWidth || k.scrollHeight > k.clientHeight) || (u = !0, f = b, p = A, d = k.scrollLeft, m = k.scrollTop, W.style.cursor = "all-scroll", window.addEventListener("pointermove", P), window.addEventListener("pointerup", C), window.addEventListener("pointercancel", C));
  }, P = (b) => {
    u && (b.preventDefault(), $(b.clientX, b.clientY, b.pointerId));
  }, C = () => {
    I(), window.removeEventListener("pointermove", P), window.removeEventListener("pointerup", C), window.removeEventListener("pointercancel", C);
  };
  W.addEventListener("pointerdown", (b) => {
    b.preventDefault(), T(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointermove", (b) => {
    (u || w.size === 2) && b.preventDefault(), $(b.clientX, b.clientY, b.pointerId);
  }), W.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && Q(b), I();
  }), W.addEventListener("dblclick", Y), W.addEventListener("pointercancel", I), W.addEventListener("mousedown", (b) => {
    b.preventDefault(), T(b.clientX, b.clientY, 1);
  }), W.addEventListener("mousemove", (b) => {
    u && b.preventDefault(), $(b.clientX, b.clientY, 1);
  }), W.addEventListener("mouseup", (b) => {
    b.preventDefault(), I();
  });
  const v = t.querySelector(".nimbi-image-preview__image-wrapper");
  return v && (v.addEventListener("pointerdown", (b) => {
    T(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointermove", (b) => {
    $(b.clientX, b.clientY, b.pointerId);
  }), v.addEventListener("pointerup", I), v.addEventListener("pointercancel", I), v.addEventListener("mousedown", (b) => {
    T(b.clientX, b.clientY, 1);
  }), v.addEventListener("mousemove", (b) => {
    $(b.clientX, b.clientY, 1);
  }), v.addEventListener("mouseup", I)), t;
}
function qe(t) {
  if (!W) return;
  const e = Number(t);
  xe = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const i = W.getBoundingClientRect(), n = wt || W.naturalWidth || W.width || i.width || 0, s = bt || W.naturalHeight || W.height || i.height || 0;
  n && s ? (W.style.maxWidth = "none", W.style.maxHeight = "none", W.style.width = `${n * xe}px`, W.style.height = `${s * xe}px`, W.style.transform = "") : (W.style.maxWidth = "", W.style.maxHeight = "", W.style.width = "", W.style.height = "", W.style.transform = `scale(${xe})`), W && (W.style.cursor = "all-scroll");
}
function yt() {
  if (!W) return;
  const t = W.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const r = wt || W.naturalWidth || e.width, i = bt || W.naturalHeight || e.height;
  if (!r || !i) return;
  const n = e.width / r, s = e.height / i, a = Math.min(n, s, 1);
  qe(Number.isFinite(a) ? a : 1);
}
function Ya(t, e = "", r = 0, i = 0) {
  const n = Ka();
  xe = 1, wt = r || 0, bt = i || 0, W.src = t, W.alt = e, W.style.transform = "scale(1)";
  const s = () => {
    wt = W.naturalWidth || W.width || 0, bt = W.naturalHeight || W.height || 0;
  };
  if (s(), yt(), qt(), requestAnimationFrame(() => {
    yt(), qt();
  }), !wt || !bt) {
    const a = () => {
      s(), requestAnimationFrame(() => {
        yt(), qt();
      }), W.removeEventListener("load", a);
    };
    W.addEventListener("load", a);
  }
  typeof n.showModal == "function" && (n.open || n.showModal()), n.classList.add("is-active"), n.focus();
}
function fn() {
  ke && (typeof ke.close == "function" && ke.open && ke.close(), ke.classList.remove("is-active"));
}
function Va(t, { t: e, zoomStep: r = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Fe = (p, d) => (typeof e == "function" ? e(p) : void 0) || d, pt = r, t.addEventListener("click", (p) => {
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
  let i = !1, n = 0, s = 0, a = 0, h = 0;
  const l = /* @__PURE__ */ new Map();
  let o = 0, c = 1;
  const u = (p, d) => {
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
      o = u(w[0], w[1]), c = xe;
      return;
    }
    const m = d.closest(".nimbi-image-preview__image-wrapper");
    m && (xe <= 1 || (p.preventDefault(), i = !0, n = p.clientX, s = p.clientY, a = m.scrollLeft, h = m.scrollTop, d.setPointerCapture(p.pointerId), d.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (l.has(p.pointerId) && l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      p.preventDefault();
      const x = Array.from(l.values()), B = u(x[0], x[1]);
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
    m.scrollLeft = a - w, m.scrollTop = h - y;
  });
  const f = () => {
    i = !1, l.clear(), o = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function Ja(t) {
  const {
    contentWrap: e,
    navWrap: r,
    container: i,
    mountOverlay: n = null,
    t: s,
    contentBase: a,
    homePage: h,
    initialDocumentTitle: l,
    runHooks: o
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const u = Ca(s, [{ path: h, name: s("home"), isIndex: !0, children: [] }]);
  async function f(y, x) {
    let B, I, E;
    try {
      ({ data: B, pagePath: I, anchor: E } = await Pi(y, a));
    } catch (T) {
      console.error("[nimbi-cms] fetchPageData failed", T), vr(e, s, T);
      return;
    }
    !E && x && (E = x);
    try {
      An(null);
    } catch (T) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", T);
    }
    e.innerHTML = "";
    const { article: U, parsed: O, toc: Q, topH1: Y, h1Text: te, slugKey: $ } = await Ba(s, B, I, E, a);
    Xa(s, l, O, Q, U, I, E, Y, te, $, B), r.innerHTML = "", r.appendChild(Q), Na(Q);
    try {
      await o("transformHtml", { article: U, parsed: O, toc: Q, pagePath: I, anchor: E, topH1: Y, h1Text: te, slugKey: $, data: B });
    } catch (T) {
      console.warn("[nimbi-cms] transformHtml hooks failed", T);
    }
    e.appendChild(U);
    try {
      Va(U, { t: s });
    } catch (T) {
      console.warn("[nimbi-cms] attachImagePreview failed", T);
    }
    try {
      Bt(i, 100, !1), requestAnimationFrame(() => Bt(i, 100, !1)), setTimeout(() => Bt(i, 100, !1), 250);
    } catch (T) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", T);
    }
    An(E), Da(U, Y, { mountOverlay: n, container: i, navWrap: r, t: s });
    try {
      await o("onPageLoad", { data: B, pagePath: I, anchor: E, article: U, toc: Q, topH1: Y, h1Text: te, slugKey: $, contentWrap: e, navWrap: r });
    } catch (T) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", T);
    }
    c = I;
  }
  async function p() {
    let y = new URLSearchParams(location.search).get("page") || h;
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
        w(), Bt(i, 100, !1);
      } catch (x) {
        console.warn("[nimbi-cms] bfcache restore failed", x);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      console.warn("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: p, siteNav: u, getCurrentPagePath: () => c };
}
function el(t) {
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
      const a = (r.get("noIndexing") || "").split(",").map((h) => h.trim()).filter(Boolean);
      a.length && (i.noIndexing = a);
    }
    return i;
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
let gn = "";
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
    el: i,
    contentPath: n = "/content",
    crawlMaxQueue: s = 1e3,
    searchIndex: a = !0,
    searchIndexMode: h = "eager",
    indexDepth: l = 1,
    noIndexing: o = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: u = "none",
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
  if (!i)
    throw new Error("el is required");
  let E = i;
  if (typeof i == "string") {
    if (E = document.querySelector(i), !E) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof n != "string" || !n.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (h != null && h !== "eager" && h !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (c !== "light" && c !== "dark")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');
  if (u != null && typeof u != "string")
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
  const U = !!a;
  try {
    Br(!!I);
  } catch (k) {
    console.warn("[nimbi-cms] setSkipRootReadme failed", k);
  }
  try {
    E.classList.add("nimbi-mount"), E.style.position = E.style.position || "relative", E.style.overflow = E.style.overflow || "hidden";
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
  const Y = document.createElement("div");
  Y.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", Y.setAttribute("role", "navigation");
  try {
    const k = typeof ht == "function" ? ht("navigation") : null;
    k && Y.setAttribute("aria-label", k);
  } catch (k) {
    console.warn("[nimbi-cms] set nav aria-label failed", k);
  }
  Q.appendChild(Y);
  const te = document.createElement("div");
  te.className = "column nimbi-content", te.setAttribute("role", "main"), Q.appendChild(te), O.appendChild(Q);
  const $ = Y, T = te;
  E.appendChild(O);
  let P = null;
  try {
    P = E.querySelector(".nimbi-overlay"), P || (P = document.createElement("div"), P.className = "nimbi-overlay", E.appendChild(P));
  } catch (k) {
    P = null, console.warn("[nimbi-cms] mount overlay setup failed", k);
  }
  const C = location.pathname || "/", v = C.endsWith("/") ? C : C.substring(0, C.lastIndexOf("/") + 1);
  try {
    gn = document.title || "";
  } catch (k) {
    gn = "", console.warn("[nimbi-cms] read initial document title failed", k);
  }
  let b = n;
  (b === "." || b === "./") && (b = ""), b.startsWith("./") && (b = b.slice(2)), b.startsWith("/") && (b = b.slice(1)), b !== "" && !b.endsWith("/") && (b = b + "/");
  const A = new URL(v + b, location.origin).toString();
  try {
    bn && bn(x);
  } catch {
  }
  p && await $r(p, v), y && Array.isArray(y) && Or(y), f && Pr(f);
  const M = Ja({ contentWrap: T, navWrap: $, container: O, mountOverlay: P, t: ht, contentBase: A, homePage: x, initialDocumentTitle: gn, runHooks: rr });
  if (typeof d == "number" && d >= 0 && typeof ur == "function" && ur(d * 60 * 1e3), typeof m == "number" && m >= 0 && typeof cr == "function" && cr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((k) => {
        typeof k == "object" && Ta && typeof vn == "function" && vn(k);
      });
    } catch (k) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", k);
    }
  try {
    typeof s == "number" && Promise.resolve().then(() => Ht).then(({ setDefaultCrawlMaxQueue: k }) => {
      try {
        k(s);
      } catch (G) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", G);
      }
    });
  } catch (k) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", k);
  }
  try {
    Ft(A);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    wn(B);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    Ft(A);
  } catch (k) {
    console.warn("[nimbi-cms] setContentBase failed", k);
  }
  try {
    wn(B);
  } catch (k) {
    console.warn("[nimbi-cms] setNotFoundPage failed", k);
  }
  try {
    await be(x, A);
  } catch (k) {
    throw x === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${x} not found at ${A}${x}: ${k.message}`);
  }
  ui(c), await ci(u, v);
  try {
    const k = document.createElement("header");
    k.className = "nimbi-site-navbar", E.insertBefore(k, O);
    const G = await be("_navigation.md", A), ue = await Kt(G.raw || ""), { navbar: oe, linkEls: Le } = await Ha(k, O, ue.html || "", A, x, ht, M.renderByQuery, U, h, l, o);
    try {
      await rr("onNavBuild", { navWrap: $, navbar: oe, linkEls: Le, contentBase: A });
    } catch (ve) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", ve);
    }
    try {
      const ve = () => {
        const Ee = k && k.getBoundingClientRect && Math.round(k.getBoundingClientRect().height) || k && k.offsetHeight || 0;
        if (Ee > 0) {
          try {
            E.style.setProperty("--nimbi-site-navbar-height", `${Ee}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set CSS var failed", fe);
          }
          try {
            O.style.paddingTop = "";
          } catch (fe) {
            console.warn("[nimbi-cms] set container paddingTop failed", fe);
          }
          try {
            const fe = E && E.getBoundingClientRect && Math.round(E.getBoundingClientRect().height) || E && E.clientHeight || 0;
            if (fe > 0) {
              const Ie = Math.max(0, fe - Ee);
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
            k.style.setProperty("--nimbi-site-navbar-height", `${Ee}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set navbar CSS var failed", fe);
          }
        }
      };
      ve();
      try {
        if (typeof ResizeObserver < "u") {
          const Ee = new ResizeObserver(() => ve());
          try {
            Ee.observe(k);
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", fe);
          }
        }
      } catch (Ee) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", Ee);
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
      typeof k == "function" && k().then((G) => {
        try {
          const ue = G || "0.0.0", oe = document.createElement("div");
          oe.className = "nimbi-version-label", oe.textContent = `Ninbi CMS v. ${ue}`, oe.style.position = "absolute", oe.style.left = "8px", oe.style.bottom = "6px", oe.style.fontSize = "11px", oe.style.opacity = "0.6", oe.style.pointerEvents = "none", oe.style.zIndex = "9999", oe.style.userSelect = "none";
          try {
            E.appendChild(oe);
          } catch (Le) {
            console.warn("[nimbi-cms] append version label failed", Le);
          }
        } catch (ue) {
          console.warn("[nimbi-cms] building version label failed", ue);
        }
      }).catch((G) => {
        console.warn("[nimbi-cms] getVersion() failed", G);
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
}, Symbol.toStringTag, { value: "Module" })), os = "nimbi-cms", cs = "0.1.0", us = "module", hs = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, ds = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, ps = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", "typedoc-plugin-markdown": "^4.10.0", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, fs = "dist/nimbi-cms.cjs.js", gs = "dist/nimbi-cms.es.js", ms = "src/index.d.ts", ws = "dist/nimbi-cms.js", bs = ["dist", "src/index.d.ts"], sl = {
  name: os,
  version: cs,
  private: !0,
  type: us,
  scripts: hs,
  dependencies: ds,
  devDependencies: ps,
  main: fs,
  module: gs,
  types: ms,
  unpkg: ws,
  files: bs
}, Tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sl,
  dependencies: ds,
  devDependencies: ps,
  files: bs,
  main: fs,
  module: gs,
  name: os,
  scripts: hs,
  type: us,
  types: ms,
  unpkg: ws,
  version: cs
}, Symbol.toStringTag, { value: "Module" }));
export {
  Lr as BAD_LANGUAGES,
  J as SUPPORTED_HLJS_MAP,
  cl as _clearHooks,
  Rn as addHook,
  dl as default,
  ci as ensureBulma,
  nl as getVersion,
  $r as loadL10nFile,
  _r as loadSupportedLanguages,
  li as observeCodeBlocks,
  ll as onNavBuild,
  al as onPageLoad,
  xt as registerLanguage,
  rr as runHooks,
  ul as setHighlightTheme,
  Pr as setLang,
  ui as setStyle,
  hl as setThemeVars,
  ht as t,
  ol as transformHtml
};
