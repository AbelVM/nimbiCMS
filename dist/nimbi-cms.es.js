const Ft = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function tr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Ft, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  Ft[e].push(t);
}
function Ko(e) {
  tr("onPageLoad", e);
}
function Vo(e) {
  tr("onNavBuild", e);
}
function Yo(e) {
  tr("transformHtml", e);
}
async function $r(e, t) {
  const n = Ft[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function Jo() {
  Object.keys(Ft).forEach((e) => {
    Ft[e].length = 0;
  });
}
function ii(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Nn, Pr;
function Sa() {
  if (Pr) return Nn;
  Pr = 1;
  function e(b) {
    return b instanceof Map ? b.clear = b.delete = b.set = function() {
      throw new Error("map is read-only");
    } : b instanceof Set && (b.add = b.clear = b.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(b), Object.getOwnPropertyNames(b).forEach((S) => {
      const I = b[S], re = typeof I;
      (re === "object" || re === "function") && !Object.isFrozen(I) && e(I);
    }), b;
  }
  class t {
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
  function n(b) {
    return b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(b, ...S) {
    const I = /* @__PURE__ */ Object.create(null);
    for (const re in b)
      I[re] = b[re];
    return S.forEach(function(re) {
      for (const Re in re)
        I[Re] = re[Re];
    }), /** @type {T} */
    I;
  }
  const r = "</span>", a = (b) => !!b.scope, s = (b, { prefix: S }) => {
    if (b.startsWith("language:"))
      return b.replace("language:", "language-");
    if (b.includes(".")) {
      const I = b.split(".");
      return [
        `${S}${I.shift()}`,
        ...I.map((re, Re) => `${re}${"_".repeat(Re + 1)}`)
      ].join(" ");
    }
    return `${S}${b}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(S, I) {
      this.buffer = "", this.classPrefix = I.classPrefix, S.walk(this);
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
      if (!a(S)) return;
      const I = s(
        S.scope,
        { prefix: this.classPrefix }
      );
      this.span(I);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(S) {
      a(S) && (this.buffer += r);
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
  const o = (b = {}) => {
    const S = { children: [] };
    return Object.assign(S, b), S;
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
      const I = o({ scope: S });
      this.add(I), this.stack.push(I);
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
    static _walk(S, I) {
      return typeof I == "string" ? S.addText(I) : I.children && (S.openNode(I), I.children.forEach((re) => this._walk(S, re)), S.closeNode(I)), S;
    }
    /**
     * @param {Node} node
     */
    static _collapse(S) {
      typeof S != "string" && S.children && (S.children.every((I) => typeof I == "string") ? S.children = [S.children.join("")] : S.children.forEach((I) => {
        l._collapse(I);
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
    __addSublanguage(S, I) {
      const re = S.root;
      I && (re.scope = `language:${I}`), this.add(re);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function p(b) {
    return b ? typeof b == "string" ? b : b.source : null;
  }
  function m(b) {
    return g("(?=", b, ")");
  }
  function d(b) {
    return g("(?:", b, ")*");
  }
  function f(b) {
    return g("(?:", b, ")?");
  }
  function g(...b) {
    return b.map((I) => p(I)).join("");
  }
  function h(b) {
    const S = b[b.length - 1];
    return typeof S == "object" && S.constructor === Object ? (b.splice(b.length - 1, 1), S) : {};
  }
  function w(...b) {
    return "(" + (h(b).capture ? "" : "?:") + b.map((re) => p(re)).join("|") + ")";
  }
  function y(b) {
    return new RegExp(b.toString() + "|").exec("").length - 1;
  }
  function k(b, S) {
    const I = b && b.exec(S);
    return I && I.index === 0;
  }
  const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function R(b, { joinWith: S }) {
    let I = 0;
    return b.map((re) => {
      I += 1;
      const Re = I;
      let Ce = p(re), H = "";
      for (; Ce.length > 0; ) {
        const D = _.exec(Ce);
        if (!D) {
          H += Ce;
          break;
        }
        H += Ce.substring(0, D.index), Ce = Ce.substring(D.index + D[0].length), D[0][0] === "\\" && D[1] ? H += "\\" + String(Number(D[1]) + Re) : (H += D[0], D[0] === "(" && I++);
      }
      return H;
    }).map((re) => `(${re})`).join(S);
  }
  const $ = /\b\B/, B = "[a-zA-Z]\\w*", L = "[a-zA-Z_]\\w*", F = "\\b\\d+(\\.\\d+)?", V = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", j = "\\b(0b[01]+)", E = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ne = (b = {}) => {
    const S = /^#![ ]*\//;
    return b.binary && (b.begin = g(
      S,
      /.*\b/,
      b.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: S,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (I, re) => {
        I.index !== 0 && re.ignoreMatch();
      }
    }, b);
  }, ge = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, Y = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [ge]
  }, C = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [ge]
  }, q = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, ce = function(b, S, I = {}) {
    const re = i(
      {
        scope: "comment",
        begin: b,
        end: S,
        contains: []
      },
      I
    );
    re.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Re = w(
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
    return re.contains.push(
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
          Re,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), re;
  }, G = ce("//", "$"), ae = ce("/\\*", "\\*/"), A = ce("#", "$"), v = {
    scope: "number",
    begin: F,
    relevance: 0
  }, O = {
    scope: "number",
    begin: V,
    relevance: 0
  }, P = {
    scope: "number",
    begin: j,
    relevance: 0
  }, z = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      ge,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [ge]
      }
    ]
  }, M = {
    scope: "title",
    begin: B,
    relevance: 0
  }, U = {
    scope: "title",
    begin: L,
    relevance: 0
  }, x = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + L,
    relevance: 0
  };
  var Q = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: Y,
    BACKSLASH_ESCAPE: ge,
    BINARY_NUMBER_MODE: P,
    BINARY_NUMBER_RE: j,
    COMMENT: ce,
    C_BLOCK_COMMENT_MODE: ae,
    C_LINE_COMMENT_MODE: G,
    C_NUMBER_MODE: O,
    C_NUMBER_RE: V,
    END_SAME_AS_BEGIN: function(b) {
      return Object.assign(
        b,
        {
          /** @type {ModeCallback} */
          "on:begin": (S, I) => {
            I.data._beginMatch = S[1];
          },
          /** @type {ModeCallback} */
          "on:end": (S, I) => {
            I.data._beginMatch !== S[1] && I.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: A,
    IDENT_RE: B,
    MATCH_NOTHING_RE: $,
    METHOD_GUARD: x,
    NUMBER_MODE: v,
    NUMBER_RE: F,
    PHRASAL_WORDS_MODE: q,
    QUOTE_STRING_MODE: C,
    REGEXP_MODE: z,
    RE_STARTERS_RE: E,
    SHEBANG: ne,
    TITLE_MODE: M,
    UNDERSCORE_IDENT_RE: L,
    UNDERSCORE_TITLE_MODE: U
  });
  function fe(b, S) {
    b.input[b.index - 1] === "." && S.ignoreMatch();
  }
  function _e(b, S) {
    b.className !== void 0 && (b.scope = b.className, delete b.className);
  }
  function oe(b, S) {
    S && b.beginKeywords && (b.begin = "\\b(" + b.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", b.__beforeBegin = fe, b.keywords = b.keywords || b.beginKeywords, delete b.beginKeywords, b.relevance === void 0 && (b.relevance = 0));
  }
  function we(b, S) {
    Array.isArray(b.illegal) && (b.illegal = w(...b.illegal));
  }
  function xe(b, S) {
    if (b.match) {
      if (b.begin || b.end) throw new Error("begin & end are not supported with match");
      b.begin = b.match, delete b.match;
    }
  }
  function Ue(b, S) {
    b.relevance === void 0 && (b.relevance = 1);
  }
  const Et = (b, S) => {
    if (!b.beforeMatch) return;
    if (b.starts) throw new Error("beforeMatch cannot be used with starts");
    const I = Object.assign({}, b);
    Object.keys(b).forEach((re) => {
      delete b[re];
    }), b.keywords = I.keywords, b.begin = g(I.beforeMatch, m(I.begin)), b.starts = {
      relevance: 0,
      contains: [
        Object.assign(I, { endsParent: !0 })
      ]
    }, b.relevance = 0, delete I.beforeMatch;
  }, Zi = [
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
  ], Gi = "keyword";
  function mr(b, S, I = Gi) {
    const re = /* @__PURE__ */ Object.create(null);
    return typeof b == "string" ? Re(I, b.split(" ")) : Array.isArray(b) ? Re(I, b) : Object.keys(b).forEach(function(Ce) {
      Object.assign(
        re,
        mr(b[Ce], S, Ce)
      );
    }), re;
    function Re(Ce, H) {
      S && (H = H.map((D) => D.toLowerCase())), H.forEach(function(D) {
        const ee = D.split("|");
        re[ee[0]] = [Ce, Qi(ee[0], ee[1])];
      });
    }
  }
  function Qi(b, S) {
    return S ? Number(S) : Xi(b) ? 0 : 1;
  }
  function Xi(b) {
    return Zi.includes(b.toLowerCase());
  }
  const wr = {}, dt = (b) => {
    console.error(b);
  }, br = (b, ...S) => {
    console.log(`WARN: ${b}`, ...S);
  }, yt = (b, S) => {
    wr[`${b}/${S}`] || (console.log(`Deprecated as of ${b}. ${S}`), wr[`${b}/${S}`] = !0);
  }, Jt = new Error();
  function yr(b, S, { key: I }) {
    let re = 0;
    const Re = b[I], Ce = {}, H = {};
    for (let D = 1; D <= S.length; D++)
      H[D + re] = Re[D], Ce[D + re] = !0, re += y(S[D - 1]);
    b[I] = H, b[I]._emit = Ce, b[I]._multi = !0;
  }
  function Ki(b) {
    if (Array.isArray(b.begin)) {
      if (b.skip || b.excludeBegin || b.returnBegin)
        throw dt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Jt;
      if (typeof b.beginScope != "object" || b.beginScope === null)
        throw dt("beginScope must be object"), Jt;
      yr(b, b.begin, { key: "beginScope" }), b.begin = R(b.begin, { joinWith: "" });
    }
  }
  function Vi(b) {
    if (Array.isArray(b.end)) {
      if (b.skip || b.excludeEnd || b.returnEnd)
        throw dt("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Jt;
      if (typeof b.endScope != "object" || b.endScope === null)
        throw dt("endScope must be object"), Jt;
      yr(b, b.end, { key: "endScope" }), b.end = R(b.end, { joinWith: "" });
    }
  }
  function Yi(b) {
    b.scope && typeof b.scope == "object" && b.scope !== null && (b.beginScope = b.scope, delete b.scope);
  }
  function Ji(b) {
    Yi(b), typeof b.beginScope == "string" && (b.beginScope = { _wrap: b.beginScope }), typeof b.endScope == "string" && (b.endScope = { _wrap: b.endScope }), Ki(b), Vi(b);
  }
  function ea(b) {
    function S(H, D) {
      return new RegExp(
        p(H),
        "m" + (b.case_insensitive ? "i" : "") + (b.unicodeRegex ? "u" : "") + (D ? "g" : "")
      );
    }
    class I {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(D, ee) {
        ee.position = this.position++, this.matchIndexes[this.matchAt] = ee, this.regexes.push([ee, D]), this.matchAt += y(D) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const D = this.regexes.map((ee) => ee[1]);
        this.matcherRe = S(R(D, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(D) {
        this.matcherRe.lastIndex = this.lastIndex;
        const ee = this.matcherRe.exec(D);
        if (!ee)
          return null;
        const ze = ee.findIndex((Lt, Mn) => Mn > 0 && Lt !== void 0), Te = this.matchIndexes[ze];
        return ee.splice(0, ze), Object.assign(ee, Te);
      }
    }
    class re {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(D) {
        if (this.multiRegexes[D]) return this.multiRegexes[D];
        const ee = new I();
        return this.rules.slice(D).forEach(([ze, Te]) => ee.addRule(ze, Te)), ee.compile(), this.multiRegexes[D] = ee, ee;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(D, ee) {
        this.rules.push([D, ee]), ee.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(D) {
        const ee = this.getMatcher(this.regexIndex);
        ee.lastIndex = this.lastIndex;
        let ze = ee.exec(D);
        if (this.resumingScanAtSamePosition() && !(ze && ze.index === this.lastIndex)) {
          const Te = this.getMatcher(0);
          Te.lastIndex = this.lastIndex + 1, ze = Te.exec(D);
        }
        return ze && (this.regexIndex += ze.position + 1, this.regexIndex === this.count && this.considerAll()), ze;
      }
    }
    function Re(H) {
      const D = new re();
      return H.contains.forEach((ee) => D.addRule(ee.begin, { rule: ee, type: "begin" })), H.terminatorEnd && D.addRule(H.terminatorEnd, { type: "end" }), H.illegal && D.addRule(H.illegal, { type: "illegal" }), D;
    }
    function Ce(H, D) {
      const ee = (
        /** @type CompiledMode */
        H
      );
      if (H.isCompiled) return ee;
      [
        _e,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        xe,
        Ji,
        Et
      ].forEach((Te) => Te(H, D)), b.compilerExtensions.forEach((Te) => Te(H, D)), H.__beforeBegin = null, [
        oe,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        we,
        // default to 1 relevance if not specified
        Ue
      ].forEach((Te) => Te(H, D)), H.isCompiled = !0;
      let ze = null;
      return typeof H.keywords == "object" && H.keywords.$pattern && (H.keywords = Object.assign({}, H.keywords), ze = H.keywords.$pattern, delete H.keywords.$pattern), ze = ze || /\w+/, H.keywords && (H.keywords = mr(H.keywords, b.case_insensitive)), ee.keywordPatternRe = S(ze, !0), D && (H.begin || (H.begin = /\B|\b/), ee.beginRe = S(ee.begin), !H.end && !H.endsWithParent && (H.end = /\B|\b/), H.end && (ee.endRe = S(ee.end)), ee.terminatorEnd = p(ee.end) || "", H.endsWithParent && D.terminatorEnd && (ee.terminatorEnd += (H.end ? "|" : "") + D.terminatorEnd)), H.illegal && (ee.illegalRe = S(
        /** @type {RegExp | string} */
        H.illegal
      )), H.contains || (H.contains = []), H.contains = [].concat(...H.contains.map(function(Te) {
        return ta(Te === "self" ? H : Te);
      })), H.contains.forEach(function(Te) {
        Ce(
          /** @type Mode */
          Te,
          ee
        );
      }), H.starts && Ce(H.starts, D), ee.matcher = Re(ee), ee;
    }
    if (b.compilerExtensions || (b.compilerExtensions = []), b.contains && b.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return b.classNameAliases = i(b.classNameAliases || {}), Ce(
      /** @type Mode */
      b
    );
  }
  function kr(b) {
    return b ? b.endsWithParent || kr(b.starts) : !1;
  }
  function ta(b) {
    return b.variants && !b.cachedVariants && (b.cachedVariants = b.variants.map(function(S) {
      return i(b, { variants: null }, S);
    })), b.cachedVariants ? b.cachedVariants : kr(b) ? i(b, { starts: b.starts ? i(b.starts) : null }) : Object.isFrozen(b) ? i(b) : b;
  }
  var na = "11.11.1";
  class ra extends Error {
    constructor(S, I) {
      super(S), this.name = "HTMLInjectionError", this.html = I;
    }
  }
  const Tn = n, _r = i, xr = /* @__PURE__ */ Symbol("nomatch"), ia = 7, Sr = function(b) {
    const S = /* @__PURE__ */ Object.create(null), I = /* @__PURE__ */ Object.create(null), re = [];
    let Re = !0;
    const Ce = "Could not find the language '{}', did you forget to load/include a language module?", H = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let D = {
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
    function ee(T) {
      return D.noHighlightRe.test(T);
    }
    function ze(T) {
      let X = T.className + " ";
      X += T.parentNode ? T.parentNode.className : "";
      const de = D.languageDetectRe.exec(X);
      if (de) {
        const Se = at(de[1]);
        return Se || (br(Ce.replace("{}", de[1])), br("Falling back to no-highlight mode for this block.", T)), Se ? de[1] : "no-highlight";
      }
      return X.split(/\s+/).find((Se) => ee(Se) || at(Se));
    }
    function Te(T, X, de) {
      let Se = "", $e = "";
      typeof X == "object" ? (Se = T, de = X.ignoreIllegals, $e = X.language) : (yt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), yt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), $e = T, Se = X), de === void 0 && (de = !0);
      const Ge = {
        code: Se,
        language: $e
      };
      tn("before:highlight", Ge);
      const st = Ge.result ? Ge.result : Lt(Ge.language, Ge.code, de);
      return st.code = Ge.code, tn("after:highlight", st), st;
    }
    function Lt(T, X, de, Se) {
      const $e = /* @__PURE__ */ Object.create(null);
      function Ge(N, Z) {
        return N.keywords[Z];
      }
      function st() {
        if (!ie.keywords) {
          Ie.addText(ve);
          return;
        }
        let N = 0;
        ie.keywordPatternRe.lastIndex = 0;
        let Z = ie.keywordPatternRe.exec(ve), se = "";
        for (; Z; ) {
          se += ve.substring(N, Z.index);
          const ye = Ve.case_insensitive ? Z[0].toLowerCase() : Z[0], Oe = Ge(ie, ye);
          if (Oe) {
            const [nt, _a] = Oe;
            if (Ie.addText(se), se = "", $e[ye] = ($e[ye] || 0) + 1, $e[ye] <= ia && (an += _a), nt.startsWith("_"))
              se += Z[0];
            else {
              const xa = Ve.classNameAliases[nt] || nt;
              Ke(Z[0], xa);
            }
          } else
            se += Z[0];
          N = ie.keywordPatternRe.lastIndex, Z = ie.keywordPatternRe.exec(ve);
        }
        se += ve.substring(N), Ie.addText(se);
      }
      function nn() {
        if (ve === "") return;
        let N = null;
        if (typeof ie.subLanguage == "string") {
          if (!S[ie.subLanguage]) {
            Ie.addText(ve);
            return;
          }
          N = Lt(ie.subLanguage, ve, !0, Mr[ie.subLanguage]), Mr[ie.subLanguage] = /** @type {CompiledMode} */
          N._top;
        } else
          N = $n(ve, ie.subLanguage.length ? ie.subLanguage : null);
        ie.relevance > 0 && (an += N.relevance), Ie.__addSublanguage(N._emitter, N.language);
      }
      function je() {
        ie.subLanguage != null ? nn() : st(), ve = "";
      }
      function Ke(N, Z) {
        N !== "" && (Ie.startScope(Z), Ie.addText(N), Ie.endScope());
      }
      function Lr(N, Z) {
        let se = 1;
        const ye = Z.length - 1;
        for (; se <= ye; ) {
          if (!N._emit[se]) {
            se++;
            continue;
          }
          const Oe = Ve.classNameAliases[N[se]] || N[se], nt = Z[se];
          Oe ? Ke(nt, Oe) : (ve = nt, st(), ve = ""), se++;
        }
      }
      function Rr(N, Z) {
        return N.scope && typeof N.scope == "string" && Ie.openNode(Ve.classNameAliases[N.scope] || N.scope), N.beginScope && (N.beginScope._wrap ? (Ke(ve, Ve.classNameAliases[N.beginScope._wrap] || N.beginScope._wrap), ve = "") : N.beginScope._multi && (Lr(N.beginScope, Z), ve = "")), ie = Object.create(N, { parent: { value: ie } }), ie;
      }
      function Cr(N, Z, se) {
        let ye = k(N.endRe, se);
        if (ye) {
          if (N["on:end"]) {
            const Oe = new t(N);
            N["on:end"](Z, Oe), Oe.isMatchIgnored && (ye = !1);
          }
          if (ye) {
            for (; N.endsParent && N.parent; )
              N = N.parent;
            return N;
          }
        }
        if (N.endsWithParent)
          return Cr(N.parent, Z, se);
      }
      function ma(N) {
        return ie.matcher.regexIndex === 0 ? (ve += N[0], 1) : (On = !0, 0);
      }
      function wa(N) {
        const Z = N[0], se = N.rule, ye = new t(se), Oe = [se.__beforeBegin, se["on:begin"]];
        for (const nt of Oe)
          if (nt && (nt(N, ye), ye.isMatchIgnored))
            return ma(Z);
        return se.skip ? ve += Z : (se.excludeBegin && (ve += Z), je(), !se.returnBegin && !se.excludeBegin && (ve = Z)), Rr(se, N), se.returnBegin ? 0 : Z.length;
      }
      function ba(N) {
        const Z = N[0], se = X.substring(N.index), ye = Cr(ie, N, se);
        if (!ye)
          return xr;
        const Oe = ie;
        ie.endScope && ie.endScope._wrap ? (je(), Ke(Z, ie.endScope._wrap)) : ie.endScope && ie.endScope._multi ? (je(), Lr(ie.endScope, N)) : Oe.skip ? ve += Z : (Oe.returnEnd || Oe.excludeEnd || (ve += Z), je(), Oe.excludeEnd && (ve = Z));
        do
          ie.scope && Ie.closeNode(), !ie.skip && !ie.subLanguage && (an += ie.relevance), ie = ie.parent;
        while (ie !== ye.parent);
        return ye.starts && Rr(ye.starts, N), Oe.returnEnd ? 0 : Z.length;
      }
      function ya() {
        const N = [];
        for (let Z = ie; Z !== Ve; Z = Z.parent)
          Z.scope && N.unshift(Z.scope);
        N.forEach((Z) => Ie.openNode(Z));
      }
      let rn = {};
      function Tr(N, Z) {
        const se = Z && Z[0];
        if (ve += N, se == null)
          return je(), 0;
        if (rn.type === "begin" && Z.type === "end" && rn.index === Z.index && se === "") {
          if (ve += X.slice(Z.index, Z.index + 1), !Re) {
            const ye = new Error(`0 width match regex (${T})`);
            throw ye.languageName = T, ye.badRule = rn.rule, ye;
          }
          return 1;
        }
        if (rn = Z, Z.type === "begin")
          return wa(Z);
        if (Z.type === "illegal" && !de) {
          const ye = new Error('Illegal lexeme "' + se + '" for mode "' + (ie.scope || "<unnamed>") + '"');
          throw ye.mode = ie, ye;
        } else if (Z.type === "end") {
          const ye = ba(Z);
          if (ye !== xr)
            return ye;
        }
        if (Z.type === "illegal" && se === "")
          return ve += `
`, 1;
        if (In > 1e5 && In > Z.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return ve += se, se.length;
      }
      const Ve = at(T);
      if (!Ve)
        throw dt(Ce.replace("{}", T)), new Error('Unknown language: "' + T + '"');
      const ka = ea(Ve);
      let zn = "", ie = Se || ka;
      const Mr = {}, Ie = new D.__emitter(D);
      ya();
      let ve = "", an = 0, ft = 0, In = 0, On = !1;
      try {
        if (Ve.__emitTokens)
          Ve.__emitTokens(X, Ie);
        else {
          for (ie.matcher.considerAll(); ; ) {
            In++, On ? On = !1 : ie.matcher.considerAll(), ie.matcher.lastIndex = ft;
            const N = ie.matcher.exec(X);
            if (!N) break;
            const Z = X.substring(ft, N.index), se = Tr(Z, N);
            ft = N.index + se;
          }
          Tr(X.substring(ft));
        }
        return Ie.finalize(), zn = Ie.toHTML(), {
          language: T,
          value: zn,
          relevance: an,
          illegal: !1,
          _emitter: Ie,
          _top: ie
        };
      } catch (N) {
        if (N.message && N.message.includes("Illegal"))
          return {
            language: T,
            value: Tn(X),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: N.message,
              index: ft,
              context: X.slice(ft - 100, ft + 100),
              mode: N.mode,
              resultSoFar: zn
            },
            _emitter: Ie
          };
        if (Re)
          return {
            language: T,
            value: Tn(X),
            illegal: !1,
            relevance: 0,
            errorRaised: N,
            _emitter: Ie,
            _top: ie
          };
        throw N;
      }
    }
    function Mn(T) {
      const X = {
        value: Tn(T),
        illegal: !1,
        relevance: 0,
        _top: H,
        _emitter: new D.__emitter(D)
      };
      return X._emitter.addText(T), X;
    }
    function $n(T, X) {
      X = X || D.languages || Object.keys(S);
      const de = Mn(T), Se = X.filter(at).filter(Er).map(
        (je) => Lt(je, T, !1)
      );
      Se.unshift(de);
      const $e = Se.sort((je, Ke) => {
        if (je.relevance !== Ke.relevance) return Ke.relevance - je.relevance;
        if (je.language && Ke.language) {
          if (at(je.language).supersetOf === Ke.language)
            return 1;
          if (at(Ke.language).supersetOf === je.language)
            return -1;
        }
        return 0;
      }), [Ge, st] = $e, nn = Ge;
      return nn.secondBest = st, nn;
    }
    function aa(T, X, de) {
      const Se = X && I[X] || de;
      T.classList.add("hljs"), T.classList.add(`language-${Se}`);
    }
    function Pn(T) {
      let X = null;
      const de = ze(T);
      if (ee(de)) return;
      if (tn(
        "before:highlightElement",
        { el: T, language: de }
      ), T.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", T);
        return;
      }
      if (T.children.length > 0 && (D.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(T)), D.throwUnescapedHTML))
        throw new ra(
          "One of your code blocks includes unescaped HTML.",
          T.innerHTML
        );
      X = T;
      const Se = X.textContent, $e = de ? Te(Se, { language: de, ignoreIllegals: !0 }) : $n(Se);
      T.innerHTML = $e.value, T.dataset.highlighted = "yes", aa(T, de, $e.language), T.result = {
        language: $e.language,
        // TODO: remove with version 11.0
        re: $e.relevance,
        relevance: $e.relevance
      }, $e.secondBest && (T.secondBest = {
        language: $e.secondBest.language,
        relevance: $e.secondBest.relevance
      }), tn("after:highlightElement", { el: T, result: $e, text: Se });
    }
    function sa(T) {
      D = _r(D, T);
    }
    const oa = () => {
      en(), yt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function la() {
      en(), yt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let vr = !1;
    function en() {
      function T() {
        en();
      }
      if (document.readyState === "loading") {
        vr || window.addEventListener("DOMContentLoaded", T, !1), vr = !0;
        return;
      }
      document.querySelectorAll(D.cssSelector).forEach(Pn);
    }
    function ca(T, X) {
      let de = null;
      try {
        de = X(b);
      } catch (Se) {
        if (dt("Language definition for '{}' could not be registered.".replace("{}", T)), Re)
          dt(Se);
        else
          throw Se;
        de = H;
      }
      de.name || (de.name = T), S[T] = de, de.rawDefinition = X.bind(null, b), de.aliases && Ar(de.aliases, { languageName: T });
    }
    function ua(T) {
      delete S[T];
      for (const X of Object.keys(I))
        I[X] === T && delete I[X];
    }
    function ha() {
      return Object.keys(S);
    }
    function at(T) {
      return T = (T || "").toLowerCase(), S[T] || S[I[T]];
    }
    function Ar(T, { languageName: X }) {
      typeof T == "string" && (T = [T]), T.forEach((de) => {
        I[de.toLowerCase()] = X;
      });
    }
    function Er(T) {
      const X = at(T);
      return X && !X.disableAutodetect;
    }
    function da(T) {
      T["before:highlightBlock"] && !T["before:highlightElement"] && (T["before:highlightElement"] = (X) => {
        T["before:highlightBlock"](
          Object.assign({ block: X.el }, X)
        );
      }), T["after:highlightBlock"] && !T["after:highlightElement"] && (T["after:highlightElement"] = (X) => {
        T["after:highlightBlock"](
          Object.assign({ block: X.el }, X)
        );
      });
    }
    function fa(T) {
      da(T), re.push(T);
    }
    function pa(T) {
      const X = re.indexOf(T);
      X !== -1 && re.splice(X, 1);
    }
    function tn(T, X) {
      const de = T;
      re.forEach(function(Se) {
        Se[de] && Se[de](X);
      });
    }
    function ga(T) {
      return yt("10.7.0", "highlightBlock will be removed entirely in v12.0"), yt("10.7.0", "Please use highlightElement now."), Pn(T);
    }
    Object.assign(b, {
      highlight: Te,
      highlightAuto: $n,
      highlightAll: en,
      highlightElement: Pn,
      // TODO: Remove with v12 API
      highlightBlock: ga,
      configure: sa,
      initHighlighting: oa,
      initHighlightingOnLoad: la,
      registerLanguage: ca,
      unregisterLanguage: ua,
      listLanguages: ha,
      getLanguage: at,
      registerAliases: Ar,
      autoDetection: Er,
      inherit: _r,
      addPlugin: fa,
      removePlugin: pa
    }), b.debugMode = function() {
      Re = !1;
    }, b.safeMode = function() {
      Re = !0;
    }, b.versionString = na, b.regex = {
      concat: g,
      lookahead: m,
      either: w,
      optional: f,
      anyNumberOfTimes: d
    };
    for (const T in Q)
      typeof Q[T] == "object" && e(Q[T]);
    return Object.assign(b, Q), b;
  }, kt = Sr({});
  return kt.newInstance = () => Sr({}), Nn = kt, kt.HighlightJS = kt, kt.default = kt, Nn;
}
var va = /* @__PURE__ */ Sa();
const me = /* @__PURE__ */ ii(va), Aa = "11.11.1", ue = /* @__PURE__ */ new Map(), Ea = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", He = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
He.html = "xml";
He.xhtml = "xml";
He.markup = "xml";
const ai = /* @__PURE__ */ new Set(["magic", "undefined"]);
let ct = null;
const Bn = /* @__PURE__ */ new Map(), La = 300 * 1e3;
async function si(e = Ea) {
  if (e)
    return ct || (ct = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let l = 0; l < i.length; l++)
          if (/\|\s*Language\s*\|/i.test(i[l])) {
            r = l;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((l) => l.trim().toLowerCase());
        let s = a.findIndex((l) => /alias|aliases|equivalent|alt|alternates?/i.test(l));
        s === -1 && (s = 1);
        let c = a.findIndex((l) => /file|filename|module|module name|module-name|short|slug/i.test(l));
        if (c === -1) {
          const l = a.findIndex((u) => /language/i.test(u));
          c = l !== -1 ? l : 0;
        }
        let o = [];
        for (let l = r + 1; l < i.length; l++) {
          const u = i[l].trim();
          if (!u || !u.startsWith("|")) break;
          const p = u.replace(/^\||\|$/g, "").split("|").map((h) => h.trim());
          if (p.every((h) => /^-+$/.test(h))) continue;
          const m = p;
          if (!m.length) continue;
          const f = (m[c] || m[0] || "").toString().trim().toLowerCase();
          if (!f || /^-+$/.test(f)) continue;
          ue.set(f, f);
          const g = m[s] || "";
          if (g) {
            const h = String(g).split(",").map((w) => w.replace(/`/g, "").trim()).filter(Boolean);
            if (h.length) {
              const y = h[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (ue.set(y, y), o.push(y));
            }
          }
        }
        try {
          const l = [];
          for (const u of o) {
            const p = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            p && /[a-z0-9]/i.test(p) ? l.push(p) : ue.delete(u);
          }
          o = l;
        } catch (l) {
          console.warn("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const u of Array.from(ue.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              ue.delete(u), l++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const p = u.replace(/^[:]+/, "");
              if (p && /[a-z0-9]/i.test(p)) {
                const m = ue.get(u);
                ue.delete(u), ue.set(p, m);
              } else
                ue.delete(u), l++;
            }
          }
          for (const [u, p] of Array.from(ue.entries()))
            (!p || /^-+$/.test(p) || !/[a-z0-9]/i.test(p)) && (ue.delete(u), l++);
          try {
            const u = ":---------------------";
            ue.has(u) && (ue.delete(u), l++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(ue.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (l) {
          console.warn("[codeblocksManager] ignored error", l);
        }
      } catch (t) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), ct);
}
const Rt = /* @__PURE__ */ new Set();
async function Wt(e, t) {
  if (ct || (async () => {
    try {
      await si();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), ct)
    try {
      await ct;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (ai.has(n)) return !1;
  if (ue.size && !ue.has(n)) {
    const r = He;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Rt.has(e)) return !0;
  const i = He;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let c = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    ue.size && (c = c.filter((u) => {
      if (ue.has(u)) return !0;
      const p = He[u];
      return !!(p && ue.has(p));
    }));
    let o = null, l = null;
    for (const u of c)
      try {
        const p = Date.now();
        let m = Bn.get(u);
        if (m && m.ok === !1 && p - (m.ts || 0) >= La && (Bn.delete(u), m = void 0), m) {
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
          Bn.set(u, d), d.promise = (async () => {
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
            const f = ue.size && ue.get(e) || u || e;
            return me.registerLanguage(f, d), Rt.add(f), f !== e && (me.registerLanguage(e, d), Rt.add(e)), !0;
          } catch (f) {
            l = f;
          }
        } else
          try {
            if (ue.has(u) || ue.has(e)) {
              const d = () => ({});
              try {
                me.registerLanguage(u, d), Rt.add(u);
              } catch {
              }
              try {
                u !== e && (me.registerLanguage(e, d), Rt.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (p) {
        l = p;
      }
    if (l)
      throw l;
    return !1;
  } catch {
    return !1;
  }
}
let sn = null;
function Ra(e = document) {
  ct || (async () => {
    try {
      await si();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = He, i = sn || (typeof IntersectionObserver > "u" ? null : (sn = new IntersectionObserver((a, s) => {
    a.forEach((c) => {
      if (!c.isIntersecting) return;
      const o = c.target;
      try {
        s.unobserve(o);
      } catch (l) {
        console.warn("[codeblocksManager] observer unobserve failed", l);
      }
      (async () => {
        try {
          const l = o.getAttribute && o.getAttribute("class") || o.className || "", u = l.match(/language-([a-zA-Z0-9_+-]+)/) || l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (u && u[1]) {
            const p = (u[1] || "").toLowerCase(), m = t[p] || p, d = ue.size && (ue.get(m) || ue.get(String(m).toLowerCase())) || m;
            try {
              await Wt(d);
            } catch (f) {
              console.warn("[codeblocksManager] registerLanguage failed", f);
            }
            try {
              try {
                const f = o.textContent || o.innerText || "";
                f != null && (o.textContent = f);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              me.highlightElement(o);
            } catch (f) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", f);
            }
          } else
            try {
              const p = o.textContent || "";
              try {
                if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
                  const m = me.highlight(p, { language: "plaintext" });
                  m && m.value && (o.innerHTML = m.value);
                }
              } catch {
                try {
                  me.highlightElement(o);
                } catch (d) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", d);
                }
              }
            } catch (p) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", p);
            }
        } catch (l) {
          console.warn("[codeblocksManager] observer entry processing failed", l);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), sn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", c = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const o = (c[1] || "").toLowerCase(), l = t[o] || o, u = ue.size && (ue.get(l) || ue.get(String(l).toLowerCase())) || l;
          try {
            await Wt(u);
          } catch (p) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", p);
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
          me.highlightElement(a);
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
function el(e, { useCdn: t = !0 } = {}) {
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
  const s = a, c = `https://cdn.jsdelivr.net/npm/highlight.js@${Aa}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = c, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let pt = "light";
function Ca(e, t = {}) {
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
function zr() {
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
async function Ta(e = "none", t = "/") {
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
        const l = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        l && l.parentNode ? l.parentNode.insertBefore(o, l) : document.head.appendChild(o);
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
    if (zr(), document.querySelector("style[data-bulma-override]")) return;
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
    zr();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    Ca(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function Ma(e) {
  pt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        pt === "dark" ? n.setAttribute("data-theme", "dark") : pt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      pt === "dark" ? n.setAttribute("data-theme", "dark") : pt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function tl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function oi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (pt === "dark" ? t.setAttribute("data-theme", "dark") : pt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const li = {
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
}, St = JSON.parse(JSON.stringify(li));
let pn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  pn = String(e).split("-")[0].toLowerCase();
}
li[pn] || (pn = "en");
let ut = pn;
function $t(e, t = {}) {
  const n = St[ut] || St.en;
  let i = n && n[e] ? n[e] : St.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function ci(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      St[a] = Object.assign({}, St[a] || {}, r[a]);
  } catch {
  }
}
function ui(e) {
  const t = String(e).split("-")[0].toLowerCase();
  ut = St[t] ? t : "en";
}
const $a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return ut;
  },
  loadL10nFile: ci,
  setLang: ui,
  t: $t
}, Symbol.toStringTag, { value: "Module" }));
function hi(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
function he(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}
function At(e) {
  return String(e || "").replace(/\/+$/, "");
}
function wt(e) {
  return At(e) + "/";
}
function Pa(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    console.warn("[helpers] preloadImage failed", t);
  }
}
function on(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, u = (a ? Math.min(c, a.bottom) : c) + Number(t || 0);
    let p = 0;
    r && (p = r.clientHeight || (a ? a.height : 0)), p || (p = c - s);
    let m = 0.6;
    try {
      const h = r && window.getComputedStyle ? window.getComputedStyle(r) : null, w = h && h.getPropertyValue("--nimbi-image-max-height-ratio"), y = w ? parseFloat(w) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (m = y);
    } catch (h) {
      console.warn("[helpers] read CSS ratio failed", h);
    }
    const d = Math.max(200, Math.floor(p * m));
    let f = !1, g = null;
    if (i.forEach((h) => {
      try {
        const w = h.getAttribute ? h.getAttribute("loading") : void 0;
        w !== "eager" && h.setAttribute && h.setAttribute("loading", "lazy");
        const y = h.getBoundingClientRect ? h.getBoundingClientRect() : null, k = h.src || h.getAttribute && h.getAttribute("src"), _ = y && y.height > 1 ? y.height : d, R = y ? y.top : 0, $ = R + _;
        y && _ > 0 && R <= u && $ >= o && (h.setAttribute ? (h.setAttribute("loading", "eager"), h.setAttribute("fetchpriority", "high"), h.setAttribute("data-eager-by-nimbi", "1")) : (h.loading = "eager", h.fetchPriority = "high"), Pa(k), f = !0), !g && y && y.top <= u && (g = { img: h, src: k, rect: y, beforeLoading: w });
      } catch (w) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", w);
      }
    }), !f && g) {
      const { img: h, src: w, rect: y, beforeLoading: k } = g;
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
function Ae(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [l, u] of r.entries())
      s.append(l, u);
    const c = s.toString();
    let o = c ? `?${c}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
function gn(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = gn);
} catch (e) {
  console.warn("[helpers] global attach failed", e);
}
function za(e) {
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
function Ia(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function Ir(e, t = null, n = void 0) {
  let r = "#/" + Ia(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = Xe(location.href);
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
function Xe(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const l = t.hash.replace(/^#/, "");
        if (l.includes("&")) {
          const u = l.split("&");
          r = u.shift() || null, a = u.join("&");
        } else
          r = l || null;
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
        const l = r.split("?");
        r = l.shift() || "", a = l.join("?") || "";
      }
      let s = r, c = null;
      if (s.indexOf("#") !== -1) {
        const l = s.split("#");
        s = l.shift() || "", c = l.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: c, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const Oa = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Na(e, t = "worker") {
  let n = null;
  const i = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function r(...l) {
    try {
      i && console && typeof console.warn == "function" && console.warn(...l);
    } catch {
    }
  }
  function a() {
    if (!n)
      try {
        const l = e();
        n = l || null, l && l.addEventListener("error", () => {
          try {
            n === l && (n = null, l.terminate && l.terminate());
          } catch (u) {
            r("[" + t + "] worker termination failed", u);
          }
        });
      } catch (l) {
        n = null, r("[" + t + "] worker init failed", l);
      }
    return n;
  }
  function s() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (l) {
      r("[" + t + "] worker termination failed", l);
    }
  }
  function c(l, u = 1e4) {
    return new Promise((p, m) => {
      const d = a();
      if (!d) return m(new Error("worker unavailable"));
      const f = String(Math.random()), g = Object.assign({}, l, { id: f });
      let h = null;
      const w = () => {
        h && clearTimeout(h), d.removeEventListener("message", y), d.removeEventListener("error", k);
      }, y = (_) => {
        const R = _.data || {};
        R.id === f && (w(), R.error ? m(new Error(R.error)) : p(R.result));
      }, k = (_) => {
        w(), r("[" + t + "] worker error event", _);
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (R) {
          r("[" + t + "] worker termination failed", R);
        }
        m(new Error(_ && _.message || "worker error"));
      };
      h = setTimeout(() => {
        w(), r("[" + t + "] worker timed out");
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (_) {
          r("[" + t + "] worker termination on timeout failed", _);
        }
        m(new Error("worker timeout"));
      }, u), d.addEventListener("message", y), d.addEventListener("error", k);
      try {
        d.postMessage(g);
      } catch (_) {
        w(), m(_);
      }
    });
  }
  return { get: a, send: c, terminate: s };
}
function di(e, t = "worker-pool", n = 2) {
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
          } catch (w) {
            s("[" + t + "] worker termination failed", w);
          }
        });
      } catch (h) {
        i[g] = null, s("[" + t + "] worker init failed", h);
      }
    return i[g];
  }
  const o = new Array(n).fill(0), l = new Array(n).fill(null), u = 30 * 1e3;
  function p(g) {
    try {
      o[g] = Date.now(), l[g] && (clearTimeout(l[g]), l[g] = null), l[g] = setTimeout(() => {
        try {
          i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
        } catch (h) {
          s("[" + t + "] idle termination failed", h);
        }
        l[g] = null;
      }, u);
    } catch {
    }
  }
  function m() {
    for (let g = 0; g < i.length; g++) {
      const h = c(g);
      if (h) return h;
    }
    return null;
  }
  function d() {
    for (let g = 0; g < i.length; g++)
      try {
        i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
      } catch (h) {
        s("[" + t + "] worker termination failed", h);
      }
  }
  function f(g, h = 1e4) {
    return new Promise((w, y) => {
      const k = r++ % i.length, _ = (R) => {
        const $ = (k + R) % i.length, B = c($);
        if (!B)
          return R + 1 < i.length ? _(R + 1) : y(new Error("worker pool unavailable"));
        const L = String(Math.random()), F = Object.assign({}, g, { id: L });
        let V = null;
        const j = () => {
          V && clearTimeout(V), B.removeEventListener("message", E), B.removeEventListener("error", ne);
        }, E = (ge) => {
          const Y = ge.data || {};
          Y.id === L && (j(), Y.error ? y(new Error(Y.error)) : w(Y.result));
        }, ne = (ge) => {
          j(), s("[" + t + "] worker error event", ge);
          try {
            i[$] === B && (i[$] = null, B.terminate && B.terminate());
          } catch (Y) {
            s("[" + t + "] worker termination failed", Y);
          }
          y(new Error(ge && ge.message || "worker error"));
        };
        V = setTimeout(() => {
          j(), s("[" + t + "] worker timed out");
          try {
            i[$] === B && (i[$] = null, B.terminate && B.terminate());
          } catch (ge) {
            s("[" + t + "] worker termination on timeout failed", ge);
          }
          y(new Error("worker timeout"));
        }, h), B.addEventListener("message", E), B.addEventListener("error", ne);
        try {
          p($), B.postMessage(F);
        } catch (ge) {
          j(), y(ge);
        }
      };
      _(0);
    });
  }
  return { get: m, send: f, terminate: d };
}
function zt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        zt._blobUrlCache || (zt._blobUrlCache = /* @__PURE__ */ new Map());
        const t = zt._blobUrlCache;
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
const et = /* @__PURE__ */ new Set();
function nr(e) {
  Ba(), et.clear();
  for (const t of Me)
    t && et.add(t);
  Or(te), Or(W), nr._refreshed = !0;
}
function Or(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && et.add(t);
}
function Nr(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && et.add(i), t.call(this, n, i);
  };
}
let Br = !1;
function Ba() {
  Br || (Nr(te), Nr(W), Br = !0);
}
const te = /* @__PURE__ */ new Map();
let De = [], rr = !1;
function Da(e) {
  rr = !!e;
}
function fi(e) {
  De = Array.isArray(e) ? e.slice() : [];
}
function qa() {
  return De;
}
const pi = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, gi = di(() => zt(Oa), "slugManager", pi);
function Ua() {
  return gi.get();
}
function mi(e) {
  return gi.send(e, 5e3);
}
async function ja(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => vt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await mi({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Ha(e, t, n) {
  const i = await Promise.resolve().then(() => vt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return mi({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function ot(e, t) {
  if (e)
    if (De && De.length) {
      const i = t.split("/")[0], r = De.includes(i);
      let a = te.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, te.set(e, a);
    } else
      te.set(e, t);
}
const vn = /* @__PURE__ */ new Set();
function Fa(e) {
  typeof e == "function" && vn.add(e);
}
function Wa(e) {
  typeof e == "function" && vn.delete(e);
}
const W = /* @__PURE__ */ new Map();
let Wn = {}, Me = [], Ee = "_404.md", _t = "_home.md";
function Zn(e) {
  e != null && (Ee = String(e || ""));
}
function Za(e) {
  e != null && (_t = String(e || ""));
}
function Ga(e) {
  Wn = e || {};
}
const It = /* @__PURE__ */ new Map(), mn = /* @__PURE__ */ new Set();
function Qa() {
  It.clear(), mn.clear();
}
function Xa(e) {
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
function wn(e) {
  te.clear(), W.clear(), Me = [], De = De || [];
  const t = Object.keys(Wn || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      n = wt(n);
    }
  } catch (i) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Xa(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = he(i.slice(n.length)) : r = he(i), Me.push(r);
    try {
      nr();
    } catch (s) {
      console.warn("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Wn[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const c = be(s[1].trim());
        if (c)
          try {
            let o = c;
            if ((!De || !De.length) && (o = wi(o, new Set(te.keys()))), De && De.length) {
              const u = r.split("/")[0], p = De.includes(u);
              let m = te.get(o);
              (!m || typeof m == "string") && (m = { default: typeof m == "string" ? m : void 0, langs: {} }), p ? m.langs[u] = r : m.default = r, te.set(o, m);
            } else
              te.set(o, r);
            W.set(r, o);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  wn();
} catch (e) {
  console.warn("[slugManager] initial setContentBase failed", e);
}
function be(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function wi(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Ka(e) {
  return Xt(e, void 0);
}
function Xt(e, t) {
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
function un(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function Kt(e) {
  if (!e || !te.has(e)) return null;
  const t = te.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (De && De.length && ut && t.langs && t.langs[ut])
    return t.langs[ut];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Ot = /* @__PURE__ */ new Map();
function Va() {
  Ot.clear();
}
let ke = async function(e, t) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const a = Xe(e);
        a && a.page && (e = a.page);
      } catch {
      }
  } catch {
  }
  try {
    const a = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (a && te.has(a)) {
      const s = Kt(a) || te.get(a);
      s && s !== e && (e = s);
    }
  } catch (a) {
    console.warn("[slugManager] slug mapping normalization failed", a);
  }
  const n = t == null ? "" : At(String(t));
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
  if (Ot.has(i))
    return Ot.get(i);
  const r = (async () => {
    const a = await fetch(i);
    if (!a || typeof a.ok != "boolean" || !a.ok) {
      if (a && a.status === 404)
        try {
          const p = `${n}/${Ee}`, m = await globalThis.fetch(p);
          if (m && typeof m.ok == "boolean" && m.ok)
            return { raw: await m.text(), status: 404 };
        } catch (p) {
          console.warn("[slugManager] fetching fallback 404 failed", p);
        }
      let u = "";
      try {
        a && typeof a.clone == "function" ? u = await a.clone().text() : a && typeof a.text == "function" ? u = await a.text() : u = "";
      } catch (p) {
        u = "", console.warn("[slugManager] reading error body failed", p);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: a ? a.status : void 0, statusText: a ? a.statusText : void 0, body: u.slice(0, 200) }), new Error("failed to fetch md");
    }
    const s = await a.text(), c = s.trim().slice(0, 128).toLowerCase(), o = /^(?:<!doctype|<html|<title|<h1)/.test(c), l = o || String(e || "").toLowerCase().endsWith(".html");
    if (o && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        const u = `${n}/${Ee}`, p = await globalThis.fetch(u);
        if (p.ok)
          return { raw: await p.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return l ? { raw: s, isHtml: !0 } : { raw: s };
  })();
  return Ot.set(i, r), r;
};
function Ya(e) {
  typeof e == "function" && (ke = e);
}
const hn = /* @__PURE__ */ new Map();
function Ja(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let rt = [], Ct = null;
async function bi(e, t = 1, n = void 0) {
  const i = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => he(String(r || ""))))) : [];
  try {
    const r = he(String(Ee || ""));
    r && !i.includes(r) && i.push(r);
  } catch {
  }
  if (rt && rt.length && t === 1 && !rt.some((a) => {
    try {
      return i.includes(he(String(a.path || "")));
    } catch {
      return !1;
    }
  }))
    return rt;
  if (Ct) return Ct;
  Ct = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((l) => he(String(l || ""))))) : [];
    try {
      const l = he(String(Ee || ""));
      l && !r.includes(l) && r.push(l);
    } catch {
    }
    const a = (l) => {
      if (!r || !r.length) return !1;
      for (const u of r)
        if (u && (l === u || l.startsWith(u + "/")))
          return !0;
      return !1;
    };
    let s = [];
    if (Me && Me.length && (s = Array.from(Me)), !s.length)
      for (const l of te.values())
        l && s.push(l);
    try {
      const l = await Si(e);
      l && l.length && (s = s.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(s), u = [...s], p = Math.max(1, pi), m = async () => {
        for (; !(l.size > Vt); ) {
          const f = u.shift();
          if (!f) break;
          try {
            const g = await ke(f, e);
            if (g && g.raw) {
              if (g.status === 404) continue;
              let h = g.raw;
              const w = [], y = String(f || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(y) && rr && (!f || !f.includes("/")))
                continue;
              const k = Ja(h), _ = /\[[^\]]+\]\(([^)]+)\)/g;
              let R;
              for (; R = _.exec(k); )
                w.push(R[1]);
              const $ = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; R = $.exec(k); )
                w.push(R[1]);
              const B = f && f.includes("/") ? f.substring(0, f.lastIndexOf("/") + 1) : "";
              for (let L of w)
                try {
                  if (Xt(L, e) || L.startsWith("..") || L.indexOf("/../") !== -1 || (B && !L.startsWith("./") && !L.startsWith("/") && !L.startsWith("../") && (L = B + L), L = he(L), !/\.(md|html?)(?:$|[?#])/i.test(L)) || (L = L.split(/[?#]/)[0], a(L))) continue;
                  l.has(L) || (l.add(L), u.push(L), s.push(L));
                } catch (F) {
                  console.warn("[slugManager] href processing failed", L, F);
                }
            }
          } catch (g) {
            console.warn("[slugManager] discovery fetch failed for", f, g);
          }
        }
      }, d = [];
      for (let f = 0; f < p; f++) d.push(m());
      await Promise.all(d);
    } catch (l) {
      console.warn("[slugManager] discovery loop failed", l);
    }
    const c = /* @__PURE__ */ new Set();
    s = s.filter((l) => !l || c.has(l) || a(l) ? !1 : (c.add(l), !0));
    const o = [];
    for (const l of s)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(l))
        try {
          const u = await ke(l, e);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let p = "", m = "";
            if (u.isHtml)
              try {
                const g = new DOMParser().parseFromString(u.raw, "text/html"), h = g.querySelector("title") || g.querySelector("h1");
                h && h.textContent && (p = h.textContent.trim());
                const w = g.querySelector("p");
                if (w && w.textContent && (m = w.textContent.trim()), t >= 2)
                  try {
                    const y = g.querySelector("h1"), k = y && y.textContent ? y.textContent.trim() : p || "", _ = (() => {
                      try {
                        if (W.has(l)) return W.get(l);
                      } catch {
                      }
                      return be(p || l);
                    })(), R = Array.from(g.querySelectorAll("h2"));
                    for (const $ of R)
                      try {
                        const B = ($.textContent || "").trim();
                        if (!B) continue;
                        const L = $.id ? $.id : be(B), F = _ ? `${_}::${L}` : `${be(l)}::${L}`;
                        let V = "", j = $.nextElementSibling;
                        for (; j && j.tagName && j.tagName.toLowerCase() === "script"; ) j = j.nextElementSibling;
                        j && j.textContent && (V = String(j.textContent).trim()), o.push({ slug: F, title: B, excerpt: V, path: l, parentTitle: k });
                      } catch (B) {
                        console.warn("[slugManager] indexing H2 failed", B);
                      }
                    if (t === 3)
                      try {
                        const $ = Array.from(g.querySelectorAll("h3"));
                        for (const B of $)
                          try {
                            const L = (B.textContent || "").trim();
                            if (!L) continue;
                            const F = B.id ? B.id : be(L), V = _ ? `${_}::${F}` : `${be(l)}::${F}`;
                            let j = "", E = B.nextElementSibling;
                            for (; E && E.tagName && E.tagName.toLowerCase() === "script"; ) E = E.nextElementSibling;
                            E && E.textContent && (j = String(E.textContent).trim()), o.push({ slug: V, title: L, excerpt: j, path: l, parentTitle: k });
                          } catch (L) {
                            console.warn("[slugManager] indexing H3 failed", L);
                          }
                      } catch ($) {
                        console.warn("[slugManager] collect H3s failed", $);
                      }
                  } catch (y) {
                    console.warn("[slugManager] collect H2s failed", y);
                  }
              } catch (f) {
                console.warn("[slugManager] parsing HTML for index failed", f);
              }
            else {
              const f = u.raw, g = f.match(/^#\s+(.+)$/m);
              p = g ? g[1].trim() : "";
              try {
                p = un(p);
              } catch {
              }
              const h = f.split(/\r?\n\s*\r?\n/);
              if (h.length > 1)
                for (let w = 1; w < h.length; w++) {
                  const y = h[w].trim();
                  if (y && !/^#/.test(y)) {
                    m = y.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (t >= 2) {
                let w = "", y = "";
                try {
                  const k = (f.match(/^#\s+(.+)$/m) || [])[1];
                  w = k ? k.trim() : "", y = (function() {
                    try {
                      if (W.has(l)) return W.get(l);
                    } catch {
                    }
                    return be(p || l);
                  })();
                  const _ = /^##\s+(.+)$/gm;
                  let R;
                  for (; R = _.exec(f); )
                    try {
                      const $ = (R[1] || "").trim(), B = un($);
                      if (!$) continue;
                      const L = be($), F = y ? `${y}::${L}` : `${be(l)}::${L}`, j = f.slice(_.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), E = j && j[1] ? String(j[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: F, title: B, excerpt: E, path: l, parentTitle: w });
                    } catch ($) {
                      console.warn("[slugManager] indexing markdown H2 failed", $);
                    }
                } catch (k) {
                  console.warn("[slugManager] collect markdown H2s failed", k);
                }
                if (t === 3)
                  try {
                    const k = /^###\s+(.+)$/gm;
                    let _;
                    for (; _ = k.exec(f); )
                      try {
                        const R = (_[1] || "").trim(), $ = un(R);
                        if (!R) continue;
                        const B = be(R), L = y ? `${y}::${B}` : `${be(l)}::${B}`, V = f.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), j = V && V[1] ? String(V[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: L, title: $, excerpt: j, path: l, parentTitle: w });
                      } catch (R) {
                        console.warn("[slugManager] indexing markdown H3 failed", R);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect markdown H3s failed", k);
                  }
              }
            }
            let d = "";
            try {
              W.has(l) && (d = W.get(l));
            } catch (f) {
              console.warn("[slugManager] mdToSlug access failed", f);
            }
            d || (d = be(p || l)), o.push({ slug: d, title: p, excerpt: m, path: l });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    try {
      rt = o.filter((u) => {
        try {
          return !a(String(u.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (l) {
      console.warn("[slugManager] filtering index by excludes failed", l), rt = o;
    }
    return rt;
  })();
  try {
    await Ct;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return Ct = null, rt;
}
const yi = 1e3;
let Vt = yi;
function es(e) {
  typeof e == "number" && e >= 0 && (Vt = e);
}
const ki = new DOMParser(), _i = "a[href]";
let xi = async function(e, t, n = Vt) {
  if (hn.has(e)) return hn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let c = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? c = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? c = s + String(t).replace(/\/$/, "") + "/" : c = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    c = s + "/";
  }
  for (; a.length && !i && !(a.length > n); ) {
    const o = a.shift();
    if (r.has(o)) continue;
    r.add(o);
    let l = "";
    try {
      l = new URL(o || "", c).toString();
    } catch {
      l = (String(t || "") || s) + "/" + String(o || "").replace(/^\//, "");
    }
    try {
      let u;
      try {
        u = await globalThis.fetch(l);
      } catch (g) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: l, error: g });
        continue;
      }
      if (!u || !u.ok) {
        u && !u.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: l, status: u.status });
        continue;
      }
      const p = await u.text(), d = ki.parseFromString(p, "text/html").querySelectorAll(_i), f = l;
      for (const g of d)
        try {
          let h = g.getAttribute("href") || "";
          if (!h || Xt(h, t) || h.startsWith("..") || h.indexOf("/../") !== -1) continue;
          if (h.endsWith("/")) {
            try {
              const w = new URL(h, f), y = new URL(c).pathname, k = w.pathname.startsWith(y) ? w.pathname.slice(y.length) : w.pathname.replace(/^\//, ""), _ = wt(he(k));
              r.has(_) || a.push(_);
            } catch {
              const y = he(o + h);
              r.has(y) || a.push(y);
            }
            continue;
          }
          if (h.toLowerCase().endsWith(".md")) {
            let w = "";
            try {
              const y = new URL(h, f), k = new URL(c).pathname;
              w = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, "");
            } catch {
              w = (o + h).replace(/^\//, "");
            }
            w = he(w);
            try {
              if (W.has(w))
                continue;
              for (const y of te.values())
                ;
            } catch (y) {
              console.warn("[slugManager] slug map access failed", y);
            }
            try {
              const y = await ke(w, t);
              if (y && y.raw) {
                const k = (y.raw || "").match(/^#\s+(.+)$/m);
                if (k && k[1] && be(k[1].trim()) === e) {
                  i = w;
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
  return hn.set(e, i), i;
};
async function Si(e, t = Vt) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  for (; r.length && !(r.length > t); ) {
    const c = r.shift();
    if (i.has(c)) continue;
    i.add(c);
    let o = "";
    try {
      o = new URL(c || "", s).toString();
    } catch {
      o = (String(e || "") || a) + "/" + String(c || "").replace(/^\//, "");
    }
    try {
      let l;
      try {
        l = await globalThis.fetch(o);
      } catch (f) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: o, error: f });
        continue;
      }
      if (!l || !l.ok) {
        l && !l.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: o, status: l.status });
        continue;
      }
      const u = await l.text(), m = ki.parseFromString(u, "text/html").querySelectorAll(_i), d = o;
      for (const f of m)
        try {
          let g = f.getAttribute("href") || "";
          if (!g || Xt(g, e) || g.startsWith("..") || g.indexOf("/../") !== -1) continue;
          if (g.endsWith("/")) {
            try {
              const w = new URL(g, d), y = new URL(s).pathname, k = w.pathname.startsWith(y) ? w.pathname.slice(y.length) : w.pathname.replace(/^\//, ""), _ = wt(he(k));
              i.has(_) || r.push(_);
            } catch {
              const y = c + g;
              i.has(y) || r.push(y);
            }
            continue;
          }
          let h = "";
          try {
            const w = new URL(g, d), y = new URL(s).pathname;
            h = w.pathname.startsWith(y) ? w.pathname.slice(y.length) : w.pathname.replace(/^\//, "");
          } catch {
            h = (c + g).replace(/^\//, "");
          }
          h = he(h), /\.(md|html?)$/i.test(h) && n.add(h);
        } catch (g) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", g);
        }
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", l);
    }
  }
  return Array.from(n);
}
async function vi(e, t, n) {
  if (e && typeof e == "string" && (e = he(e), e = At(e)), te.has(e))
    return Kt(e) || te.get(e);
  for (const r of vn)
    try {
      const a = await r(e, t);
      if (a)
        return ot(e, a), W.set(a, e), a;
    } catch (a) {
      console.warn("[slugManager] slug resolver failed", a);
    }
  if (Me && Me.length) {
    if (It.has(e)) {
      const r = It.get(e);
      return te.set(e, r), W.set(r, e), r;
    }
    for (const r of Me)
      if (!mn.has(r))
        try {
          const a = await ke(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const c = be(s[1].trim());
              if (mn.add(r), c && It.set(c, r), c === e)
                return ot(e, r), W.set(r, e), r;
            }
          }
        } catch (a) {
          console.warn("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await bi(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return ot(e, a.path), W.set(a.path, e), a.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await xi(e, t, n);
    if (r)
      return ot(e, r), W.set(r, e), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await ke(r, t);
      if (a && a.raw)
        return ot(e, r), W.set(r, e), r;
    } catch (a) {
      console.warn("[slugManager] candidate fetch failed", a);
    }
  if (Me && Me.length)
    for (const r of Me)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (be(a) === e)
          return ot(e, r), W.set(r, e), r;
      } catch (a) {
        console.warn("[slugManager] build-time filename match failed", a);
      }
  try {
    const r = [];
    _t && typeof _t == "string" && _t.trim() && r.push(_t), r.includes("_home.md") || r.push("_home.md");
    for (const a of r)
      try {
        const s = await ke(a, t);
        if (s && s.raw) {
          const c = (s.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && be(c[1].trim()) === e)
            return ot(e, a), W.set(a, e), a;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: yi,
  _setAllMd: Ga,
  _storeSlugMapping: ot,
  addSlugResolver: Fa,
  get allMarkdownPaths() {
    return Me;
  },
  get availableLanguages() {
    return De;
  },
  buildSearchIndex: bi,
  buildSearchIndexWorker: ja,
  clearFetchCache: Va,
  clearListCaches: Qa,
  crawlAllMarkdown: Si,
  crawlCache: hn,
  crawlForSlug: xi,
  crawlForSlugWorker: Ha,
  get defaultCrawlMaxQueue() {
    return Vt;
  },
  ensureSlug: vi,
  fetchCache: Ot,
  get fetchMarkdown() {
    return ke;
  },
  getLanguages: qa,
  get homePage() {
    return _t;
  },
  initSlugWorker: Ua,
  isExternalLink: Ka,
  isExternalLinkWithBase: Xt,
  listPathsFetched: mn,
  listSlugCache: It,
  mdToSlug: W,
  get notFoundPage() {
    return Ee;
  },
  removeSlugResolver: Wa,
  resolveSlugPath: Kt,
  get searchIndex() {
    return rt;
  },
  setContentBase: wn,
  setDefaultCrawlMaxQueue: es,
  setFetchMarkdown: Ya,
  setHomePage: Za,
  setLanguages: fi,
  setNotFoundPage: Zn,
  setSkipRootReadme: Da,
  get skipRootReadme() {
    return rr;
  },
  slugResolvers: vn,
  slugToMd: te,
  slugify: be,
  unescapeMarkdown: un,
  uniqueSlug: wi
}, Symbol.toStringTag, { value: "Module" }));
var Dn, Dr;
function ts() {
  if (Dr) return Dn;
  Dr = 1;
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
    let c = 0, o = 0, l = a.length - 1;
    const u = s.wordsPerMinute || 200, p = s.wordBound || n;
    for (; p(a[o]); ) o++;
    for (; p(a[l]); ) l--;
    const m = `${a}
`;
    for (let h = o; h <= l; h++)
      if ((t(m[h]) || !p(m[h]) && (p(m[h + 1]) || t(m[h + 1]))) && c++, t(m[h]))
        for (; h <= l && (i(m[h + 1]) || p(m[h + 1])); )
          h++;
    const d = c / u, f = Math.round(d * 60 * 1e3);
    return {
      text: Math.ceil(d.toFixed(2)) + " min read",
      minutes: d,
      time: f,
      words: c
    };
  }
  return Dn = r, Dn;
}
var ns = ts();
const rs = /* @__PURE__ */ ii(ns);
function Zt(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function Ai(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function is(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && lt("property", "og:description", a), a && String(a).trim() && lt("name", "twitter:description", a), lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (lt("property", "og:image", s), lt("name", "twitter:image", s));
}
function ir(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  c && String(c).trim() && Zt("description", c), Zt("robots", a.robots || "index,follow"), is(a, t, n, c);
}
function as() {
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
function ar(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, c = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i || s.image || null;
    let u = "";
    try {
      if (t) {
        const f = he(t);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(f);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (f) {
      u = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", f);
    }
    u && Ai("canonical", u);
    try {
      lt("property", "og:url", u);
    } catch (f) {
      console.warn("[seoManager] upsertMeta og:url failed", f);
    }
    const p = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c || "",
      description: o || "",
      url: u || location.href.split("#")[0]
    };
    l && (p.image = String(l)), s.date && (p.datePublished = s.date), s.dateModified && (p.dateModified = s.dateModified);
    const m = "nimbi-jsonld";
    let d = document.getElementById(m);
    d || (d = document.createElement("script"), d.type = "application/ld+json", d.id = m, document.head.appendChild(d)), d.textContent = JSON.stringify(p, null, 2);
  } catch (s) {
    console.warn("[seoManager] setStructuredData failed", s);
  }
}
let Nt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function ss(e) {
  try {
    if (!e || typeof e != "object") {
      Nt = {};
      return;
    }
    Nt = Object.assign({}, e);
  } catch (t) {
    console.warn("[seoManager] setSeoMap failed", t);
  }
}
function os(e, t = "") {
  try {
    if (!e) return;
    const n = Nt && Nt[e] ? Nt[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      Ai("canonical", i);
      try {
        lt("property", "og:url", i);
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
      n.description && Zt("description", String(n.description));
    } catch {
    }
    try {
      try {
        ir({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      ar({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      console.warn("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    console.warn("[seoManager] injectSeoForPage failed", n);
  }
}
function dn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Zt("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Zt("description", String(s));
    } catch {
    }
    try {
      ir({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      ar({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    console.warn("[seoManager] markNotFound failed", r);
  }
}
function ls(e, t, n, i, r, a, s, c, o, l, u) {
  try {
    if (i && i.querySelector) {
      const p = i.querySelector(".menu-label");
      p && (p.textContent = c && c.textContent || e("onThisPage"));
    }
  } catch (p) {
    console.warn("[seoManager] update toc label failed", p);
  }
  try {
    const p = n.meta && n.meta.title ? String(n.meta.title).trim() : "", m = r.querySelector("img"), d = m && (m.getAttribute("src") || m.src) || null;
    let f = "";
    try {
      let w = "";
      try {
        const y = c || (r && r.querySelector ? r.querySelector("h1") : null);
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
            const R = (k.textContent || "").trim();
            R && _.push(R), k = k.nextElementSibling;
          }
          _.length && (w = _.join(" ").replace(/\s+/g, " ").trim()), !w && o && (w = String(o).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), f = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    let g = "";
    try {
      p && (g = p);
    } catch {
    }
    if (!g)
      try {
        c && c.textContent && (g = String(c.textContent).trim());
      } catch {
      }
    if (!g)
      try {
        const w = r.querySelector("h2");
        w && w.textContent && (g = String(w.textContent).trim());
      } catch {
      }
    g || (g = a || "");
    try {
      ir(n, g || void 0, d, f);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      ar(n, l, g || void 0, d, f, t);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const h = as();
    g ? h ? document.title = `${h} - ${g}` : document.title = `${t || "Site"} - ${g}` : p ? document.title = p : document.title = t || document.title;
  } catch (p) {
    console.warn("[seoManager] applyPageMeta failed", p);
  }
  try {
    try {
      const p = r.querySelectorAll(".nimbi-reading-time");
      p && p.forEach((m) => m.remove());
    } catch {
    }
    if (o) {
      const p = rs(u.raw || ""), m = p && typeof p.minutes == "number" ? Math.ceil(p.minutes) : 0, d = m ? e("readingTime", { minutes: m }) : "";
      if (!d) return;
      const f = r.querySelector("h1");
      if (f) {
        const g = r.querySelector(".nimbi-article-subtitle");
        try {
          if (g) {
            const h = document.createElement("span");
            h.className = "nimbi-reading-time", h.textContent = d, g.appendChild(h);
          } else {
            const h = document.createElement("p");
            h.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = d, h.appendChild(w);
            try {
              f.parentElement.insertBefore(h, f.nextSibling);
            } catch {
              try {
                f.insertAdjacentElement("afterend", h);
              } catch {
              }
            }
          }
        } catch {
          try {
            const w = document.createElement("p");
            w.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = d, w.appendChild(y), f.insertAdjacentElement("afterend", w);
          } catch {
          }
        }
      }
    }
  } catch (p) {
    console.warn("[seoManager] reading time update failed", p);
  }
}
let Ei = 100;
function qr(e) {
  Ei = e;
}
let Bt = 300 * 1e3;
function Ur(e) {
  Bt = e;
}
const Ze = /* @__PURE__ */ new Map();
function cs(e) {
  if (!Ze.has(e)) return;
  const t = Ze.get(e), n = Date.now();
  if (t.ts + Bt < n) {
    Ze.delete(e);
    return;
  }
  return Ze.delete(e), Ze.set(e, t), t.value;
}
function us(e, t) {
  if (jr(), jr(), Ze.delete(e), Ze.set(e, { value: t, ts: Date.now() }), Ze.size > Ei) {
    const n = Ze.keys().next().value;
    n !== void 0 && Ze.delete(n);
  }
}
function jr() {
  if (!Bt || Bt <= 0) return;
  const e = Date.now();
  for (const [t, n] of Ze.entries())
    n.ts + Bt < e && Ze.delete(t);
}
async function hs(e, t) {
  const n = new Set(et), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const p = Xe(a);
          if (p) {
            if (p.type === "canonical" && p.page) {
              const m = he(p.page);
              if (m) {
                n.add(m);
                continue;
              }
            }
            if (p.type === "cosmetic" && p.page) {
              const m = p.page;
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
        const c = (s.hash || s.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (s.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (c) {
          let p = he(c[1]);
          p && n.add(p);
          continue;
        }
        const o = (r.textContent || "").trim(), l = (s.pathname || "").replace(/^.*\//, "");
        if (o && be(o) === e || l && be(l.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let p = s.pathname.replace(/^\//, "");
          n.add(p);
          continue;
        }
        const u = s.pathname || "";
        if (u) {
          const p = new URL(t), m = wt(p.pathname);
          if (u.indexOf(m) !== -1) {
            let d = u.startsWith(m) ? u.slice(m.length) : u;
            d = he(d), d && n.add(d);
          }
        }
      } catch (s) {
        console.warn("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await ke(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const c = (s[1] || "").trim();
        if (c && be(c) === e)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function ds(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (te.has(n)) {
        const i = Kt(n) || te.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (et && et.size)
          for (const i of et) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (be(r) === n && !/index\.html$/i.test(i)) {
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
async function fs(e, t) {
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
    const h = Xe(typeof location < "u" ? location.href : "");
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
  const o = `${e}|||${typeof $a < "u" && ut ? ut : ""}`, l = cs(o);
  if (l)
    r = l.resolved, a = l.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let h = decodeURIComponent(String(r || ""));
      if (h && typeof h == "string" && (h = he(h), h = At(h)), te.has(h))
        r = Kt(h) || te.get(h);
      else {
        let w = await hs(h, t);
        if (w)
          r = w;
        else if (nr._refreshed && et && et.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const y = await vi(h, t);
          y && (r = y);
        }
      }
    }
    us(o, { resolved: r, anchor: a });
  }
  !a && i && (a = i);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const h = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const w = await fetch(h);
        if (w && w.ok) {
          const y = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", _ = (y || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || _.indexOf("<!doctype") !== -1 || _.indexOf("<html") !== -1) {
            if (!s)
              try {
                let B = h;
                try {
                  B = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  B = String(h || "").replace(/^\//, "");
                }
                const L = B.replace(/\.html$/i, ".md");
                try {
                  const F = await ke(L, t);
                  if (F && F.raw)
                    return { data: F, pagePath: L, anchor: a };
                } catch {
                }
                try {
                  const F = await ke(Ee, t);
                  if (F && F.raw) {
                    try {
                      dn(F.meta || {}, Ee);
                    } catch {
                    }
                    return { data: F, pagePath: Ee, anchor: a };
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
                let B = h;
                try {
                  B = new URL(h).pathname.replace(/^\//, "");
                } catch {
                  B = String(h || "").replace(/^\//, "");
                }
                const L = B.replace(/\.html$/i, ".md");
                try {
                  const F = await ke(L, t);
                  if (F && F.raw)
                    return { data: F, pagePath: L, anchor: a };
                } catch {
                }
                try {
                  const F = await ke(Ee, t);
                  if (F && F.raw) {
                    try {
                      dn(F.meta || {}, Ee);
                    } catch {
                    }
                    return { data: F, pagePath: Ee, anchor: a };
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
  const u = ds(r);
  try {
    try {
      console.warn("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
    } catch {
    }
  } catch {
  }
  const p = String(n || "").includes(".md") || String(n || "").includes(".html");
  let m = null;
  if (!p)
    try {
      let h = decodeURIComponent(String(n || ""));
      h = he(h), h = At(h), h && !/\.(md|html?)$/i.test(h) && (m = h);
    } catch {
      m = null;
    }
  if (p && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !p && !te.has(r) && !te.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let d = null, f = null, g = null;
  for (const h of u)
    if (h)
      try {
        const w = he(h);
        if (d = await ke(w, t), f = w, m && !te.has(m))
          try {
            let y = "";
            if (d && d.isHtml)
              try {
                const k = typeof DOMParser < "u" ? new DOMParser() : null;
                if (k) {
                  const _ = k.parseFromString(d.raw || "", "text/html"), R = _.querySelector("h1") || _.querySelector("title");
                  R && R.textContent && (y = R.textContent.trim());
                }
              } catch {
              }
            else {
              const k = (d && d.raw || "").match(/^#\s+(.+)$/m);
              k && k[1] && (y = k[1].trim());
            }
            if (y && be(y) !== m)
              try {
                if (/\.html$/i.test(w)) {
                  const _ = w.replace(/\.html$/i, ".md");
                  if (u.includes(_))
                    try {
                      const R = await ke(_, t);
                      if (R && R.raw)
                        d = R, f = _;
                      else
                        try {
                          const $ = await ke(Ee, t);
                          if ($ && $.raw)
                            d = $, f = Ee;
                          else {
                            d = null, f = null, g = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          d = null, f = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                    } catch {
                      try {
                        const $ = await ke(Ee, t);
                        if ($ && $.raw)
                          d = $, f = Ee;
                        else {
                          d = null, f = null, g = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        d = null, f = null, g = new Error("slug mismatch for candidate");
                        continue;
                      }
                    }
                  else {
                    d = null, f = null, g = new Error("slug mismatch for candidate");
                    continue;
                  }
                } else {
                  d = null, f = null, g = new Error("slug mismatch for candidate");
                  continue;
                }
              } catch {
                d = null, f = null, g = new Error("slug mismatch for candidate");
                continue;
              }
          } catch {
          }
        try {
          if (!p && /\.html$/i.test(w)) {
            const y = w.replace(/\.html$/i, ".md");
            if (u.includes(y))
              try {
                const _ = String(d && d.raw || "").trim().slice(0, 128).toLowerCase();
                if (d && d.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(_) || _.indexOf('<div id="app"') !== -1 || _.indexOf("nimbi-") !== -1 || _.indexOf("nimbi") !== -1 || _.indexOf("initcms(") !== -1) {
                  let $ = !1;
                  try {
                    const B = await ke(y, t);
                    if (B && B.raw)
                      d = B, f = y, $ = !0;
                    else
                      try {
                        const L = await ke(Ee, t);
                        L && L.raw && (d = L, f = Ee, $ = !0);
                      } catch {
                      }
                  } catch {
                    try {
                      const L = await ke(Ee, t);
                      L && L.raw && (d = L, f = Ee, $ = !0);
                    } catch {
                    }
                  }
                  if (!$) {
                    d = null, f = null, g = new Error("site shell detected (candidate HTML rejected)");
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
            console.warn("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: f, isHtml: d && d.isHtml, snippet: d && d.raw ? String(d.raw).slice(0, 160) : null });
          } catch {
          }
        } catch {
        }
        break;
      } catch (w) {
        g = w;
        try {
          console.warn("[router] candidate fetch failed", { candidate: h, contentBase: t, err: w && w.message || w });
        } catch {
        }
      }
  if (!d) {
    try {
      console.warn("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: g && (g.message || String(g)) || null });
    } catch {
    }
    try {
      const h = await ke(Ee, t);
      if (h && h.raw) {
        try {
          dn(h.meta || {}, Ee);
        } catch {
        }
        return { data: h, pagePath: Ee, anchor: a };
      }
    } catch {
    }
    try {
      if (p && String(n || "").toLowerCase().includes(".html"))
        try {
          const h = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", h);
          const w = await fetch(h);
          if (w && w.ok) {
            const y = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", _ = (y || "").toLowerCase(), R = k && k.indexOf && k.indexOf("text/html") !== -1 || _.indexOf("<!doctype") !== -1 || _.indexOf("<html") !== -1;
            if (R || console.warn("[router] absolute fetch returned non-HTML", { abs: h, contentType: k, snippet: _.slice(0, 200) }), R) {
              const $ = (y || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(y) || /<h1>\s*index of\b/i.test(y) || $.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(y) || /<h1>\s*directory listing/i.test(y))
                try {
                  console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: h });
                } catch {
                }
              else
                try {
                  const L = h, F = new URL(".", L).toString();
                  try {
                    const j = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (j) {
                      const E = j.parseFromString(y || "", "text/html"), ne = (q, ce) => {
                        try {
                          const G = ce.getAttribute(q) || "";
                          if (!G || /^(https?:)?\/\//i.test(G) || G.startsWith("/") || G.startsWith("#")) return;
                          try {
                            const ae = new URL(G, L).toString();
                            ce.setAttribute(q, ae);
                          } catch (ae) {
                            console.warn("[router] rewrite attribute failed", q, ae);
                          }
                        } catch (G) {
                          console.warn("[router] rewrite helper failed", G);
                        }
                      }, ge = E.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), Y = [];
                      for (const q of Array.from(ge || []))
                        try {
                          const ce = q.tagName ? q.tagName.toLowerCase() : "";
                          if (ce === "a") continue;
                          if (q.hasAttribute("src")) {
                            const G = q.getAttribute("src");
                            ne("src", q);
                            const ae = q.getAttribute("src");
                            G !== ae && Y.push({ attr: "src", tag: ce, before: G, after: ae });
                          }
                          if (q.hasAttribute("href") && ce === "link") {
                            const G = q.getAttribute("href");
                            ne("href", q);
                            const ae = q.getAttribute("href");
                            G !== ae && Y.push({ attr: "href", tag: ce, before: G, after: ae });
                          }
                          if (q.hasAttribute("href") && ce !== "link") {
                            const G = q.getAttribute("href");
                            ne("href", q);
                            const ae = q.getAttribute("href");
                            G !== ae && Y.push({ attr: "href", tag: ce, before: G, after: ae });
                          }
                          if (q.hasAttribute("xlink:href")) {
                            const G = q.getAttribute("xlink:href");
                            ne("xlink:href", q);
                            const ae = q.getAttribute("xlink:href");
                            G !== ae && Y.push({ attr: "xlink:href", tag: ce, before: G, after: ae });
                          }
                          if (q.hasAttribute("poster")) {
                            const G = q.getAttribute("poster");
                            ne("poster", q);
                            const ae = q.getAttribute("poster");
                            G !== ae && Y.push({ attr: "poster", tag: ce, before: G, after: ae });
                          }
                          if (q.hasAttribute("srcset")) {
                            const A = (q.getAttribute("srcset") || "").split(",").map((v) => v.trim()).filter(Boolean).map((v) => {
                              const [O, P] = v.split(/\s+/, 2);
                              if (!O || /^(https?:)?\/\//i.test(O) || O.startsWith("/")) return v;
                              try {
                                const z = new URL(O, L).toString();
                                return P ? `${z} ${P}` : z;
                              } catch {
                                return v;
                              }
                            }).join(", ");
                            q.setAttribute("srcset", A);
                          }
                        } catch {
                        }
                      const C = E.documentElement && E.documentElement.outerHTML ? E.documentElement.outerHTML : y;
                      try {
                        Y && Y.length && console.warn("[router] rewritten asset refs", { abs: h, rewritten: Y });
                      } catch {
                      }
                      return { data: { raw: C, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let V = y;
                  return /<base\s+[^>]*>/i.test(y) || (/<head[^>]*>/i.test(y) ? V = y.replace(/(<head[^>]*>)/i, `$1<base href="${F}">`) : V = `<base href="${F}">` + y), { data: { raw: V, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
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
        const w = [
          `/assets/${h}.html`,
          `/assets/${h}/index.html`
        ];
        for (const y of w)
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
  return { data: d, pagePath: f, anchor: a };
}
function An() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ht = An();
function Li(e) {
  ht = e;
}
var gt = { exec: () => null };
function pe(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(qe.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var ps = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), qe = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, gs = /^(?:[ \t]*(?:\n|$))+/, ms = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, ws = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Yt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, bs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, sr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ri = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ci = pe(Ri).replace(/bull/g, sr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ys = pe(Ri).replace(/bull/g, sr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), or = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ks = /^[^\n]+/, lr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, _s = pe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", lr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), xs = pe(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, sr).getRegex(), En = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", cr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ss = pe("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", cr).replace("tag", En).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ti = pe(or).replace("hr", Yt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", En).getRegex(), vs = pe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ti).getRegex(), ur = { blockquote: vs, code: ms, def: _s, fences: ws, heading: bs, hr: Yt, html: Ss, lheading: Ci, list: xs, newline: gs, paragraph: Ti, table: gt, text: ks }, Hr = pe("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Yt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", En).getRegex(), As = { ...ur, lheading: ys, table: Hr, paragraph: pe(or).replace("hr", Yt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Hr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", En).getRegex() }, Es = { ...ur, html: pe(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", cr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: gt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: pe(or).replace("hr", Yt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ci).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Ls = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Rs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Mi = /^( {2,}|\\)\n(?!\s*$)/, Cs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ln = /[\p{P}\p{S}]/u, hr = /[\s\p{P}\p{S}]/u, $i = /[^\s\p{P}\p{S}]/u, Ts = pe(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, hr).getRegex(), Pi = /(?!~)[\p{P}\p{S}]/u, Ms = /(?!~)[\s\p{P}\p{S}]/u, $s = /(?:[^\s\p{P}\p{S}]|~)/u, zi = /(?![*_])[\p{P}\p{S}]/u, Ps = /(?![*_])[\s\p{P}\p{S}]/u, zs = /(?:[^\s\p{P}\p{S}]|[*_])/u, Is = pe(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", ps ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ii = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Os = pe(Ii, "u").replace(/punct/g, Ln).getRegex(), Ns = pe(Ii, "u").replace(/punct/g, Pi).getRegex(), Oi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Bs = pe(Oi, "gu").replace(/notPunctSpace/g, $i).replace(/punctSpace/g, hr).replace(/punct/g, Ln).getRegex(), Ds = pe(Oi, "gu").replace(/notPunctSpace/g, $s).replace(/punctSpace/g, Ms).replace(/punct/g, Pi).getRegex(), qs = pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, $i).replace(/punctSpace/g, hr).replace(/punct/g, Ln).getRegex(), Us = pe(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, zi).getRegex(), js = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Hs = pe(js, "gu").replace(/notPunctSpace/g, zs).replace(/punctSpace/g, Ps).replace(/punct/g, zi).getRegex(), Fs = pe(/\\(punct)/, "gu").replace(/punct/g, Ln).getRegex(), Ws = pe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Zs = pe(cr).replace("(?:-->|$)", "-->").getRegex(), Gs = pe("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Zs).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), bn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Qs = pe(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", bn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ni = pe(/^!?\[(label)\]\[(ref)\]/).replace("label", bn).replace("ref", lr).getRegex(), Bi = pe(/^!?\[(ref)\](?:\[\])?/).replace("ref", lr).getRegex(), Xs = pe("reflink|nolink(?!\\()", "g").replace("reflink", Ni).replace("nolink", Bi).getRegex(), Fr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, dr = { _backpedal: gt, anyPunctuation: Fs, autolink: Ws, blockSkip: Is, br: Mi, code: Rs, del: gt, delLDelim: gt, delRDelim: gt, emStrongLDelim: Os, emStrongRDelimAst: Bs, emStrongRDelimUnd: qs, escape: Ls, link: Qs, nolink: Bi, punctuation: Ts, reflink: Ni, reflinkSearch: Xs, tag: Gs, text: Cs, url: gt }, Ks = { ...dr, link: pe(/^!?\[(label)\]\((.*?)\)/).replace("label", bn).getRegex(), reflink: pe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", bn).getRegex() }, Gn = { ...dr, emStrongRDelimAst: Ds, emStrongLDelim: Ns, delLDelim: Us, delRDelim: Hs, url: pe(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Fr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: pe(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Fr).getRegex() }, Vs = { ...Gn, br: pe(Mi).replace("{2,}", "*").getRegex(), text: pe(Gn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, ln = { normal: ur, gfm: As, pedantic: Es }, Tt = { normal: dr, gfm: Gn, breaks: Vs, pedantic: Ks }, Ys = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Wr = (e) => Ys[e];
function Ye(e, t) {
  if (t) {
    if (qe.escapeTest.test(e)) return e.replace(qe.escapeReplace, Wr);
  } else if (qe.escapeTestNoEncode.test(e)) return e.replace(qe.escapeReplaceNoEncode, Wr);
  return e;
}
function Zr(e) {
  try {
    e = encodeURI(e).replace(qe.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Gr(e, t) {
  let n = e.replace(qe.findPipe, (a, s, c) => {
    let o = !1, l = s;
    for (; --l >= 0 && c[l] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(qe.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(qe.slashPipe, "|");
  return i;
}
function Mt(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function Js(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function eo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Qr(e, t, n, i, r) {
  let a = t.href, s = t.title || null, c = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: c, tokens: i.inlineTokens(c) };
  return i.state.inLink = !1, o;
}
function to(e, t, n) {
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
var Gt = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || ht;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Mt(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = to(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Mt(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Mt(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = Mt(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), s = !0;
        else if (!s) c.push(n[o]);
        else break;
        n = n.slice(o);
        let l = c.join(`
`), u = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${l}` : l, r = r ? `${r}
${u}` : u;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = p, n.length === 0) break;
        let m = a.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let d = m, f = d.raw + `
` + n.join(`
`), g = this.blockquote(f);
          a[a.length - 1] = g, i = i.substring(0, i.length - d.raw.length) + g.raw, r = r.substring(0, r.length - d.text.length) + g.text;
          break;
        } else if (m?.type === "list") {
          let d = m, f = d.raw + `
` + n.join(`
`), g = this.list(f);
          a[a.length - 1] = g, i = i.substring(0, i.length - m.raw.length) + g.raw, r = r.substring(0, r.length - d.raw.length) + g.raw, n = f.substring(a.at(-1).raw.length).split(`
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
        let o = !1, l = "", u = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        l = t[0], e = e.substring(l.length);
        let p = eo(t[2].split(`
`, 1)[0], t[1].length), m = e.split(`
`, 1)[0], d = !p.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, u = p.trimStart()) : d ? f = t[1].length + 1 : (f = p.search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, u = p.slice(f), f += t[1].length), d && this.rules.other.blankLine.test(m) && (l += m + `
`, e = e.substring(m.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(f), h = this.rules.other.hrRegex(f), w = this.rules.other.fencesBeginRegex(f), y = this.rules.other.headingBeginRegex(f), k = this.rules.other.htmlBeginRegex(f), _ = this.rules.other.blockquoteBeginRegex(f);
          for (; e; ) {
            let R = e.split(`
`, 1)[0], $;
            if (m = R, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), $ = m) : $ = m.replace(this.rules.other.tabCharGlobal, "    "), w.test(m) || y.test(m) || k.test(m) || _.test(m) || g.test(m) || h.test(m)) break;
            if ($.search(this.rules.other.nonSpaceChar) >= f || !m.trim()) u += `
` + $.slice(f);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || w.test(p) || y.test(p) || h.test(p)) break;
              u += `
` + m;
            }
            d = !m.trim(), l += R + `
`, e = e.substring(R.length + 1), p = $.slice(f);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (s = !0)), r.items.push({ type: "list_item", raw: l, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), r.raw += l;
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
          let l = o.tokens.filter((p) => p.type === "space"), u = l.length > 0 && l.some((p) => this.rules.other.anyLine.test(p.raw));
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
    let n = Gr(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Gr(s, a.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[o] })));
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
        let a = Mt(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = Js(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Qr(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Qr(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, c = r, o = 0, l = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (l.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = l.exec(t)) != null; ) {
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
        let u = [...i[0]][0].length, p = e.slice(0, r + i.index + u + s);
        if (Math.min(r, s) % 2) {
          let d = p.slice(1, -1);
          return { type: "em", raw: p, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let m = p.slice(2, -2);
        return { type: "strong", raw: p, text: m, tokens: this.lexer.inlineTokens(m) };
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
        let l = [...i[0]][0].length, u = e.slice(0, r + i.index + l + s), p = u.slice(r, -r);
        return { type: "del", raw: u, text: p, tokens: this.lexer.inlineTokens(p) };
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
}, Fe = class Qn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || ht, this.options.tokenizer = this.options.tokenizer || new Gt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: qe, block: ln.normal, inline: Tt.normal };
    this.options.pedantic ? (n.block = ln.pedantic, n.inline = Tt.pedantic) : this.options.gfm && (n.block = ln.gfm, this.options.breaks ? n.inline = Tt.breaks : n.inline = Tt.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: ln, inline: Tt };
  }
  static lex(t, n) {
    return new Qn(n).lex(t);
  }
  static lexInline(t, n) {
    return new Qn(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(qe.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(qe.tabCharGlobal, "    ").replace(qe.spaceLine, "")); t; ) {
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
        this.options.extensions.startBlock.forEach((l) => {
          o = l.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
      if (this.options.extensions?.inline?.some((u) => (o = u.call({ lexer: this }, t, n)) ? (t = t.substring(o.raw.length), n.push(o), !0) : !1)) continue;
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
        let u = n.at(-1);
        o.type === "text" && u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
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
      let l = t;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, p = t.slice(1), m;
        this.options.extensions.startInline.forEach((d) => {
          m = d.call({ lexer: this }, p), typeof m == "number" && m >= 0 && (u = Math.min(u, m));
        }), u < 1 / 0 && u >= 0 && (l = t.substring(0, u + 1));
      }
      if (o = this.tokenizer.inlineText(l)) {
        t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), s = !0;
        let u = n.at(-1);
        u?.type === "text" ? (u.raw += o.raw, u.text += o.text) : n.push(o);
        continue;
      }
      if (t) {
        let u = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else throw new Error(u);
      }
    }
    return n;
  }
}, Qt = class {
  options;
  parser;
  constructor(e) {
    this.options = e || ht;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(qe.notSpaceStart)?.[0], r = e.replace(qe.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Ye(i) + '">' + (n ? r : Ye(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Ye(r, !0)) + `</code></pre>
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
    return `<code>${Ye(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Zr(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + Ye(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Zr(e);
    if (r === null) return Ye(n);
    e = r;
    let a = `<img src="${e}" alt="${Ye(n)}"`;
    return t && (a += ` title="${Ye(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Ye(e.text);
  }
}, Rn = class {
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
}, We = class Xn {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || ht, this.options.renderer = this.options.renderer || new Qt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Rn();
  }
  static parse(t, n) {
    return new Xn(n).parse(t);
  }
  static parseInline(t, n) {
    return new Xn(n).parseInline(t);
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
}, xt = class {
  options;
  block;
  constructor(e) {
    this.options = e || ht;
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
    return this.block ? Fe.lex : Fe.lexInline;
  }
  provideParser() {
    return this.block ? We.parse : We.parseInline;
  }
}, Di = class {
  defaults = An();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = We;
  Renderer = Qt;
  TextRenderer = Rn;
  Lexer = Fe;
  Tokenizer = Gt;
  Hooks = xt;
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
        let r = this.defaults.renderer || new Qt(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, c = n.renderer[s], o = r[s];
          r[s] = (...l) => {
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Gt(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, c = n.tokenizer[s], o = r[s];
          r[s] = (...l) => {
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new xt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, c = n.hooks[s], o = r[s];
          xt.passThroughHooks.has(a) ? r[s] = (l) => {
            if (this.defaults.async && xt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let p = await c.call(r, l);
              return o.call(r, p);
            })();
            let u = c.call(r, l);
            return o.call(r, u);
          } : r[s] = (...l) => {
            if (this.defaults.async) return (async () => {
              let p = await c.apply(r, l);
              return p === !1 && (p = await o.apply(r, l)), p;
            })();
            let u = c.apply(r, l);
            return u === !1 && (u = o.apply(r, l)), u;
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
    return Fe.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return We.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, c = await (r.hooks ? await r.hooks.provideLexer() : e ? Fe.lex : Fe.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let l = await (r.hooks ? await r.hooks.provideParser() : e ? We.parse : We.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(l) : l;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? Fe.lex : Fe.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : e ? We.parse : We.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + Ye(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, bt = new Di();
function le(e, t) {
  return bt.parse(e, t);
}
le.options = le.setOptions = function(e) {
  return bt.setOptions(e), le.defaults = bt.defaults, Li(le.defaults), le;
};
le.getDefaults = An;
le.defaults = ht;
le.use = function(...e) {
  return bt.use(...e), le.defaults = bt.defaults, Li(le.defaults), le;
};
le.walkTokens = function(e, t) {
  return bt.walkTokens(e, t);
};
le.parseInline = bt.parseInline;
le.Parser = We;
le.parser = We.parse;
le.Renderer = Qt;
le.TextRenderer = Rn;
le.Lexer = Fe;
le.lexer = Fe.lex;
le.Tokenizer = Gt;
le.Hooks = xt;
le.parse = le;
var no = le.options, ro = le.setOptions, io = le.use, ao = le.walkTokens, so = le.parseInline, oo = le, lo = We.parse, co = Fe.lex;
const Xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: xt,
  Lexer: Fe,
  Marked: Di,
  Parser: We,
  Renderer: Qt,
  TextRenderer: Rn,
  Tokenizer: Gt,
  get defaults() {
    return ht;
  },
  getDefaults: An,
  lexer: co,
  marked: le,
  options: no,
  parse: oo,
  parseInline: so,
  parser: lo,
  setOptions: ro,
  use: io,
  walkTokens: ao
}, Symbol.toStringTag, { value: "Module" })), qi = `function O() {
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
`, Kr = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", qi], { type: "text/javascript;charset=utf-8" });
function uo(e) {
  let t;
  try {
    if (t = Kr && (self.URL || self.webkitURL).createObjectURL(Kr), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(qi),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function yn(e) {
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
function Ui(e) {
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
const Dt = Xr && (le || Xr) || void 0;
let Be = null;
const ho = "https://cdn.jsdelivr.net/npm/highlight.js";
async function kn() {
  if (Be) return Be;
  try {
    try {
      const e = await import(ho + "/lib/core.js");
      Be = e.default || e;
    } catch {
      Be = null;
    }
  } catch {
    Be = null;
  }
  return Be;
}
Dt && typeof Dt.setOptions == "function" && Dt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Be && t && typeof Be.getLanguage == "function" && Be.getLanguage(t) ? Be.highlight(e, { language: t }).value : Be && typeof Be.getLanguage == "function" && Be.getLanguage("plaintext") ? Be.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: u, url: p } = t;
      try {
        if (!await kn()) {
          postMessage({ type: "register-error", name: u, error: "hljs unavailable" });
          return;
        }
        const d = await import(p), f = d.default || d;
        Be.registerLanguage(u, f), postMessage({ type: "registered", name: u });
      } catch (m) {
        postMessage({ type: "register-error", name: u, error: String(m) });
      }
      return;
    }
    if (t.type === "detect") {
      const u = t.md || "", p = t.supported || [], m = /* @__PURE__ */ new Set(), d = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let f;
      for (; f = d.exec(u); )
        if (f[1]) {
          const g = String(f[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && m.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && m.add(g), p && p.length)
            try {
              p.indexOf(g) !== -1 && m.add(g);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(m) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = yn(i || "");
    await kn().catch(() => {
    });
    let s = Dt.parse(r);
    const c = [], o = /* @__PURE__ */ new Map(), l = (u) => {
      try {
        return String(u || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, p, m, d) => {
      const f = Number(p);
      let g = d.replace(/<[^>]+>/g, "").trim();
      try {
        g = Ui(g);
      } catch {
      }
      let h = null;
      const w = (m || "").match(/\sid="([^"]+)"/);
      w && (h = w[1]);
      const y = h || l(g) || "heading", _ = (o.get(y) || 0) + 1;
      o.set(y, _);
      const R = _ === 1 ? y : y + "-" + _;
      c.push({ level: f, text: g, id: R });
      const $ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, B = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", L = ($[f] + " " + B).trim(), V = ((m || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${R}" class="${L}"`).trim();
      return `<h${f} ${V}>${d}</h${f}>`;
    }), s = s.replace(/<img([^>]*)>/g, (u, p) => /\bloading=/.test(p) ? `<img${p}>` : /\bdata-want-lazy=/.test(p) ? `<img${p}>` : `<img${p} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: c } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function fo(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: l } = e;
      try {
        if (!await kn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const p = await import(l), m = p.default || p;
        return Be.registerLanguage(o, m), { type: "registered", name: o };
      } catch (u) {
        return { type: "register-error", name: o, error: String(u) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", l = e.supported || [], u = /* @__PURE__ */ new Set(), p = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let m;
      for (; m = p.exec(o); )
        if (m[1]) {
          const d = String(m[1]).toLowerCase();
          if (!d) continue;
          if (d.length >= 5 && d.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(d) && u.add(d), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(d) && u.add(d), l && l.length)
            try {
              l.indexOf(d) !== -1 && u.add(d);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(u) };
    }
    const t = e && e.id, { content: n, data: i } = yn(e && e.md || "");
    await kn().catch(() => {
    });
    let r = Dt.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), c = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, l, u, p) => {
      const m = Number(l);
      let d = p.replace(/<[^>]+>/g, "").trim();
      try {
        d = Ui(d);
      } catch {
      }
      let f = null;
      const g = (u || "").match(/\sid="([^"]+)"/);
      g && (f = g[1]);
      const h = f || c(d) || "heading", y = (s.get(h) || 0) + 1;
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
      }, R = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", $ = (_[m] + " " + R).trim(), L = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${k}" class="${$}"`).trim();
      return `<h${m} ${L}>${p}</h${m}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, l) => /\bloading=/.test(l) ? `<img${l}>` : /\bdata-want-lazy=/.test(l) ? `<img${l}>` : `<img${l} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const qn = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, po = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function go() {
  if (typeof Worker < "u")
    try {
      return new uo();
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
          const r = { data: await fo(n) }(e.message || []).forEach((a) => a(r));
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
const ji = di(() => go(), "markdown", po), Vr = typeof DOMParser < "u" ? new DOMParser() : null, mt = () => ji.get(), fr = (e) => ji.send(e, 3e3), tt = [];
function Kn(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    tt.push(e);
    try {
      le.use(e);
    } catch (t) {
      console.warn("[markdown] failed to apply plugin", t);
    }
  }
}
function mo(e) {
  tt.length = 0, Array.isArray(e) && tt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    tt.forEach((t) => le.use(t));
  } catch (t) {
    console.warn("[markdown] failed to apply markdown extensions", t);
  }
}
async function _n(e) {
  if (tt && tt.length) {
    let { content: i, data: r } = yn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, c) => qn[c] || s);
    } catch {
    }
    le.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      tt.forEach((s) => le.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = le.parse(i);
    try {
      const s = Vr || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const c = s.parseFromString(a, "text/html"), o = c.querySelectorAll("h1,h2,h3,h4,h5,h6"), l = [], u = /* @__PURE__ */ new Set(), p = (d) => {
          try {
            return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, m = (d) => {
          const f = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, g = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (f[d] + " " + g).trim();
        };
        o.forEach((d) => {
          try {
            const f = Number(d.tagName.substring(1)), g = (d.textContent || "").trim();
            let h = p(g) || "heading", w = h, y = 2;
            for (; u.has(w); )
              w = h + "-" + y, y += 1;
            u.add(w), d.id = w, d.className = m(f), l.push({ level: f, text: g, id: w });
          } catch {
          }
        });
        try {
          c.querySelectorAll("img").forEach((d) => {
            try {
              const f = d.getAttribute && d.getAttribute("loading"), g = d.getAttribute && d.getAttribute("data-want-lazy");
              !f && !g && d.setAttribute && d.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          c.querySelectorAll("pre code, code[class]").forEach((d) => {
            try {
              const f = d.getAttribute && d.getAttribute("class") || d.className || "", g = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
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
        return { html: c.body.innerHTML, meta: r || {}, toc: l };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Hi);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = mt && mt();
    }
  else
    t = mt && mt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => qn[r] || i);
  } catch {
  }
  try {
    if (typeof me < "u" && me && typeof me.getLanguage == "function" && me.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = yn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (l, u) => qn[u] || l);
      } catch {
      }
      le.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (l, u) => {
        try {
          return u && me.getLanguage && me.getLanguage(u) ? me.highlight(l, { language: u }).value : me && typeof me.getLanguage == "function" && me.getLanguage("plaintext") ? me.highlight(l, { language: "plaintext" }).value : l;
        } catch {
          return l;
        }
      } });
      let a = le.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (l, u) => {
          try {
            if (u && me && typeof me.highlight == "function")
              try {
                const p = me.highlight(u, { language: "plaintext" });
                return `<pre><code>${p && p.value ? p.value : p}</code></pre>`;
              } catch {
                try {
                  if (me && typeof me.highlightElement == "function") {
                    const m = { innerHTML: u };
                    return me.highlightElement(m), `<pre><code>${m.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return l;
        });
      } catch {
      }
      const s = [], c = /* @__PURE__ */ new Set(), o = (l) => {
        try {
          return String(l || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, u, p, m) => {
        const d = Number(u), f = m.replace(/<[^>]+>/g, "").trim();
        let g = o(f) || "heading", h = g, w = 2;
        for (; c.has(h); )
          h = g + "-" + w, w += 1;
        c.add(h), s.push({ level: d, text: f, id: h });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, k = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", _ = (y[d] + " " + k).trim(), $ = ((p || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${h}" class="${_}"`).trim();
        return `<h${d} ${$}>${m}</h${d}>`;
      }), a = a.replace(/<img([^>]*)>/g, (l, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await fr({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const l = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, u = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (l[o] + " " + u).trim();
    };
    let c = n.html;
    c = c.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, l, u, p) => {
      const m = Number(l), d = p.replace(/<[^>]+>/g, "").trim(), f = (u || "").match(/\sid="([^"]+)"/), g = f ? f[1] : a(d) || "heading", w = (i.get(g) || 0) + 1;
      i.set(g, w);
      const y = w === 1 ? g : g + "-" + w;
      r.push({ level: m, text: d, id: y });
      const k = s(m), R = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${k}"`).trim();
      return `<h${m} ${R}>${p}</h${m}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const l = Vr || (typeof DOMParser < "u" ? new DOMParser() : null);
        if (l) {
          const u = l.parseFromString(c, "text/html");
          u.querySelectorAll("img").forEach((m) => {
            try {
              const d = m.getAttribute("src") || "";
              (d ? new URL(d, location.href).toString() : "") === o && m.remove();
            } catch {
            }
          }), c = u.body.innerHTML;
        } else
          try {
            const u = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            c = c.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`, "g"), "");
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
function qt(e, t) {
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
      if (ai.has(c) || t && t.size && c.length < 3 && !t.has(c) && !(He && He[c] && t.has(He[c]))) continue;
      if (t && t.size) {
        if (t.has(c)) {
          const l = t.get(c);
          l && n.add(l);
          continue;
        }
        if (He && He[c]) {
          const l = He[c];
          if (t.has(l)) {
            const u = t.get(l) || l;
            n.add(u);
            continue;
          }
        }
      }
      (a.has(c) || c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(c) && !r.has(c)) && n.add(c);
    }
  return n;
}
async function Vn(e, t) {
  if (tt && tt.length || typeof process < "u" && process.env && process.env.VITEST) return qt(e || "", t);
  if (mt && mt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await fr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return qt(e || "", t);
}
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: fr,
  addMarkdownExtension: Kn,
  detectFenceLanguages: qt,
  detectFenceLanguagesAsync: Vn,
  initRendererWorker: mt,
  markdownPlugins: tt,
  parseMarkdownToHtml: _n,
  setMarkdownExtensions: mo
}, Symbol.toStringTag, { value: "Module" })), wo = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
        await pr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: c.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function bo(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), c = s.body;
        return await pr(c, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function Qe(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Ir(e, t);
  } catch {
    return Ir(e, t);
  }
}
const yo = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function ko(...e) {
  try {
    yo && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function _o(e, t) {
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
function xo(e, t) {
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
        c.setAttribute("href", Ae(o));
      } catch {
        o && o.indexOf("/") === -1 ? c.setAttribute("href", "#" + encodeURIComponent(o)) : c.setAttribute("href", Qe(o));
      }
    } catch {
      c.setAttribute("href", "#" + a.path);
    }
    if (c.textContent = a.name, s.appendChild(c), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((l) => {
        const u = document.createElement("li"), p = document.createElement("a");
        try {
          const m = String(l.path || "");
          try {
            p.setAttribute("href", Ae(m));
          } catch {
            m && m.indexOf("/") === -1 ? p.setAttribute("href", "#" + encodeURIComponent(m)) : p.setAttribute("href", Qe(m));
          }
        } catch {
          p.setAttribute("href", "#" + l.path);
        }
        p.textContent = l.name, u.appendChild(p), o.appendChild(u);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function So(e, t, n = "") {
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
        const l = Number(o.level) >= 2 ? Number(o.level) : 2, u = document.createElement("li"), p = document.createElement("a"), m = za(o.text || ""), d = o.id || be(m);
        p.textContent = m;
        try {
          const w = String(n || "").replace(/^[\\.\\/]+/, ""), y = w && W && W.has && W.has(w) ? W.get(w) : w;
          y ? p.href = Ae(y, d) : p.href = `#${encodeURIComponent(d)}`;
        } catch (w) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", w), p.href = `#${encodeURIComponent(d)}`;
        }
        if (u.appendChild(p), l === 2) {
          a.appendChild(u), c[2] = u, Object.keys(c).forEach((w) => {
            Number(w) > 2 && delete c[w];
          });
          return;
        }
        let f = l - 1;
        for (; f > 2 && !c[f]; ) f--;
        f < 2 && (f = 2);
        let g = c[f];
        if (!g) {
          a.appendChild(u), c[l] = u;
          return;
        }
        let h = g.querySelector("ul");
        h || (h = document.createElement("ul"), g.appendChild(h)), h.appendChild(u), c[l] = u;
      } catch (l) {
        console.warn("[htmlBuilder] buildTocElement item failed", l, o);
      }
    });
  } catch (c) {
    console.warn("[htmlBuilder] buildTocElement failed", c);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Fi(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = be(n.textContent || ""));
  });
}
function vo(e, t, n) {
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
function Yr(e, t, n) {
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
        const c = s.tagName ? s.tagName.toLowerCase() : "", o = (l) => {
          try {
            const u = s.getAttribute(l) || "";
            if (!u || /^(https?:)?\/\//i.test(u) || u.startsWith("/") || u.startsWith("#")) return;
            try {
              s.setAttribute(l, new URL(u, r).toString());
            } catch (p) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", l, u, p);
            }
          } catch (u) {
            console.warn("[htmlBuilder] rewriteAttr failed", u);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && c !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const p = (s.getAttribute("srcset") || "").split(",").map((m) => m.trim()).filter(Boolean).map((m) => {
            const [d, f] = m.split(/\s+/, 2);
            if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/")) return m;
            try {
              const g = new URL(d, r).toString();
              return f ? `${g} ${f}` : g;
            } catch {
              return m;
            }
          }).join(", ");
          s.setAttribute("srcset", p);
        }
      } catch (c) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", c);
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Jr = "", Un = null, ei = "";
async function pr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Jr && Un)
      a = Un, s = ei;
    else {
      try {
        a = new URL(t, location.href), s = wt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = wt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Jr = t, Un = a, ei = s;
    }
    const c = /* @__PURE__ */ new Set(), o = [], l = /* @__PURE__ */ new Set(), u = [];
    for (const p of Array.from(r))
      try {
        try {
          if (p.closest && p.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const m = p.getAttribute("href") || "";
        if (!m || hi(m)) continue;
        try {
          if (m.startsWith("?") || m.indexOf("?") !== -1)
            try {
              const f = new URL(m, t || location.href), g = f.searchParams.get("page");
              if (g && g.indexOf("/") === -1 && n) {
                const h = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (h) {
                  const w = he(h + g), y = i && i.canonical ? Ae(w, f.hash ? f.hash.replace(/^#/, "") : null) : Qe(w, f.hash ? f.hash.replace(/^#/, "") : null);
                  p.setAttribute("href", y);
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
          let f = d[1];
          const g = d[2];
          !f.startsWith("/") && n && (f = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + f);
          try {
            const h = new URL(f, t).pathname;
            let w = h.startsWith(s) ? h.slice(s.length) : h;
            w = he(w), o.push({ node: p, mdPathRaw: f, frag: g, rel: w }), W.has(w) || c.add(w);
          } catch (h) {
            console.warn("[htmlBuilder] resolve mdPath failed", h);
          }
          continue;
        }
        try {
          let f = m;
          !m.startsWith("/") && n && (m.startsWith("#") ? f = n + m : f = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + m);
          const h = new URL(f, t).pathname || "";
          if (h && h.indexOf(s) !== -1) {
            let w = h.startsWith(s) ? h.slice(s.length) : h;
            if (w = he(w), w = At(w), w || (w = "_home"), !w.endsWith(".md")) {
              let y = null;
              try {
                if (W && W.has && W.has(w))
                  y = W.get(w);
                else
                  try {
                    const k = String(w || "").replace(/^.*\//, "");
                    k && W.has && W.has(k) && (y = W.get(k));
                  } catch (k) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", k);
                  }
              } catch (k) {
                console.warn("[htmlBuilder] mdToSlug access check failed", k);
              }
              if (!y)
                try {
                  const k = String(w || "").replace(/^.*\//, "");
                  for (const [_, R] of te || [])
                    if (R === w || R === k) {
                      y = _;
                      break;
                    }
                } catch {
                }
              if (y) {
                const k = i && i.canonical ? Ae(y, null) : Qe(y);
                p.setAttribute("href", k);
              } else {
                let k = w;
                try {
                  /\.[^\/]+$/.test(String(w || "")) || (k = String(w || "") + ".html");
                } catch {
                  k = w;
                }
                l.add(k), u.push({ node: p, rel: k });
              }
            }
          }
        } catch (f) {
          console.warn("[htmlBuilder] resolving href to URL failed", f);
        }
      } catch (m) {
        console.warn("[htmlBuilder] processing anchor failed", m);
      }
    c.size && await Promise.all(Array.from(c).map(async (p) => {
      try {
        try {
          const d = String(p).match(/([^\/]+)\.md$/), f = d && d[1];
          if (f && te.has(f)) {
            try {
              const g = te.get(f);
              if (g)
                try {
                  W.set(g, f);
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
        const m = await ke(p, t);
        if (m && m.raw) {
          const d = (m.raw || "").match(/^#\s+(.+)$/m);
          if (d && d[1]) {
            const f = be(d[1].trim());
            if (f)
              try {
                te.set(f, p), W.set(p, f);
              } catch (g) {
                console.warn("[htmlBuilder] setting slug mapping failed", g);
              }
          }
        }
      } catch (m) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", m);
      }
    })), l.size && await Promise.all(Array.from(l).map(async (p) => {
      try {
        const m = await ke(p, t);
        if (m && m.raw)
          try {
            const f = (gr || new DOMParser()).parseFromString(m.raw, "text/html"), g = f.querySelector("title"), h = f.querySelector("h1"), w = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : h && h.textContent ? h.textContent.trim() : null;
            if (w) {
              const y = be(w);
              if (y)
                try {
                  te.set(y, p), W.set(p, y);
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
    for (const p of o) {
      const { node: m, frag: d, rel: f } = p;
      let g = null;
      try {
        W.has(f) && (g = W.get(f));
      } catch (h) {
        console.warn("[htmlBuilder] mdToSlug access failed", h);
      }
      if (g) {
        const h = i && i.canonical ? Ae(g, d) : Qe(g, d);
        m.setAttribute("href", h);
      } else {
        const h = i && i.canonical ? Ae(f, d) : Qe(f, d);
        m.setAttribute("href", h);
      }
    }
    for (const p of u) {
      const { node: m, rel: d } = p;
      let f = null;
      try {
        W.has(d) && (f = W.get(d));
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", g);
      }
      if (!f)
        try {
          const g = String(d || "").replace(/^.*\//, "");
          W.has(g) && (f = W.get(g));
        } catch (g) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
        }
      if (f) {
        const g = i && i.canonical ? Ae(f, null) : Qe(f);
        m.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? Ae(d, null) : Qe(d);
        m.setAttribute("href", g);
      }
    }
  } catch (r) {
    console.warn("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Ao(e, t, n, i) {
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
    !c && n && (c = String(n)), c && (s = be(c)), s || (s = "_home");
    try {
      n && (te.set(s, n), W.set(n, s));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const l = Xe(typeof location < "u" ? location.href : "");
          l && l.anchor && l.page && String(l.page) === String(s) ? o = l.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", Qe(s, o));
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug history replace failed", l);
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
async function Eo(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const l = o.getAttribute("href") || "";
      if (!l) continue;
      let m = he(l).split(/::|#/, 2)[0];
      try {
        const f = m.indexOf("?");
        f !== -1 && (m = m.slice(0, f));
      } catch {
      }
      if (!m || (m.includes(".") || (m = m + ".html"), !/\.html(?:$|[?#])/.test(m) && !m.toLowerCase().endsWith(".html"))) continue;
      const d = m;
      try {
        if (W && W.has && W.has(d)) continue;
      } catch (f) {
        console.warn("[htmlBuilder] mdToSlug check failed", f);
      }
      try {
        let f = !1;
        for (const g of te.values())
          if (g === d) {
            f = !0;
            break;
          }
        if (f) continue;
      } catch (f) {
        console.warn("[htmlBuilder] slugToMd iteration failed", f);
      }
      n.add(d);
    } catch (l) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", l);
    }
  if (!n.size) return;
  const i = async (o) => {
    try {
      const l = await ke(o, t);
      if (l && l.raw)
        try {
          const p = (gr || new DOMParser()).parseFromString(l.raw, "text/html"), m = p.querySelector("title"), d = p.querySelector("h1"), f = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : d && d.textContent ? d.textContent.trim() : null;
          if (f) {
            const g = be(f);
            if (g)
              try {
                te.set(g, o), W.set(o, g);
              } catch (h) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", h);
              }
          }
        } catch (u) {
          console.warn("[htmlBuilder] parse HTML title failed", u);
        }
    } catch (l) {
      console.warn("[htmlBuilder] fetchAndExtract failed", l);
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
async function Lo(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = wt(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const c = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let o = he(c[1]);
        try {
          let l;
          try {
            l = _o(o, t);
          } catch (p) {
            l = o, console.warn("[htmlBuilder] resolve mdPath URL failed", p);
          }
          const u = l && r && l.startsWith(r) ? l.slice(r.length) : String(l || "").replace(/^\//, "");
          n.push({ rel: u }), W.has(u) || i.add(u);
        } catch (l) {
          console.warn("[htmlBuilder] rewriteAnchors failed", l);
        }
        continue;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  i.size && await Promise.all(Array.from(i).map(async (a) => {
    try {
      const s = String(a).match(/([^\/]+)\.md$/), c = s && s[1];
      if (c && te.has(c)) {
        try {
          const o = te.get(c);
          o && W.set(o, c);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", s);
    }
    try {
      const s = await ke(a, t);
      if (s && s.raw) {
        const c = (s.raw || "").match(/^#\s+(.+)$/m);
        if (c && c[1]) {
          const o = be(c[1].trim());
          if (o)
            try {
              te.set(o, a), W.set(a, o);
            } catch (l) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", l);
            }
        }
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", s);
    }
  }));
}
const gr = typeof DOMParser < "u" ? new DOMParser() : null;
function jn(e) {
  try {
    const n = (gr || new DOMParser()).parseFromString(e || "", "text/html");
    Fi(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (l) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", l);
        }
      });
    } catch (c) {
      console.warn("[htmlBuilder] parseHtml query images failed", c);
    }
    n.querySelectorAll("pre code, code[class]").forEach((c) => {
      try {
        const o = c.getAttribute && c.getAttribute("class") || c.className || "", l = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const u = (l[1] || "").toLowerCase(), p = ue.size && (ue.get(u) || ue.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await Wt(p);
              } catch (m) {
                console.warn("[htmlBuilder] registerLanguage failed", m);
              }
            })();
          } catch (m) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", m);
          }
        } else
          try {
            if (me && typeof me.getLanguage == "function" && me.getLanguage("plaintext")) {
              const u = me.highlight ? me.highlight(c.textContent || "", { language: "plaintext" }) : null;
              u && u.value && (c.innerHTML = u.value);
            }
          } catch (u) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", u);
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
async function Ro(e) {
  const t = Vn ? await Vn(e || "", ue) : qt(e || "", ue), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = ue.size && (ue.get(r) || ue.get(String(r).toLowerCase())) || r;
      try {
        i.push(Wt(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Wt(r));
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
async function Co(e) {
  if (await Ro(e), _n) {
    const t = await _n(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function To(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const p = typeof DOMParser < "u" ? new DOMParser() : null;
      if (p) {
        const m = p.parseFromString(t.raw || "", "text/html");
        try {
          Yr(m.body, n, r);
        } catch (d) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", d);
        }
        a = jn(m.documentElement && m.documentElement.outerHTML ? m.documentElement.outerHTML : t.raw || "");
      } else
        a = jn(t.raw || "");
    } catch {
      a = jn(t.raw || "");
    }
  else
    a = await Co(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Yr(s, n, r);
  } catch (p) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", p);
  }
  try {
    Fi(s);
  } catch (p) {
    console.warn("[htmlBuilder] addHeadingIds failed", p);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((m) => {
      try {
        const d = m.getAttribute && m.getAttribute("class") || m.className || "", f = String(d || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (f)
          try {
            m.setAttribute && m.setAttribute("class", f);
          } catch (g) {
            m.className = f, console.warn("[htmlBuilder] set element class failed", g);
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
  } catch (p) {
    console.warn("[htmlBuilder] processing code elements failed", p);
  }
  try {
    Ra(s);
  } catch (p) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", p);
  }
  vo(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((m) => {
      try {
        const d = m.parentElement;
        if (!d || d.tagName.toLowerCase() !== "p" || d.childNodes.length !== 1) return;
        const f = document.createElement("figure");
        f.className = "image", d.replaceWith(f), f.appendChild(m);
      } catch {
      }
    });
  } catch (p) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", p);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((m) => {
      try {
        if (m.classList)
          m.classList.contains("table") || m.classList.add("table");
        else {
          const d = m.getAttribute && m.getAttribute("class") ? m.getAttribute("class") : "", f = String(d || "").split(/\s+/).filter(Boolean);
          f.indexOf("table") === -1 && f.push("table");
          try {
            m.setAttribute && m.setAttribute("class", f.join(" "));
          } catch {
            m.className = f.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (p) {
    console.warn("[htmlBuilder] add Bulma table class failed", p);
  }
  const { topH1: c, h1Text: o, slugKey: l } = Ao(a, s, n, i);
  try {
    if (c && a && a.meta && (a.meta.author || a.meta.date) && !(c.parentElement && c.parentElement.querySelector && c.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const m = a.meta.author ? String(a.meta.author).trim() : "", d = a.meta.date ? String(a.meta.date).trim() : "";
      let f = "";
      try {
        const h = new Date(d);
        d && !isNaN(h.getTime()) ? f = h.toLocaleDateString() : f = d;
      } catch {
        f = d;
      }
      const g = [];
      if (m && g.push(m), f && g.push(f), g.length) {
        const h = document.createElement("p"), w = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", y = g.slice(1);
        if (h.className = "nimbi-article-subtitle is-6 has-text-grey-light", w) {
          const k = document.createElement("span");
          k.className = "nimbi-article-author", k.textContent = w, h.appendChild(k);
        }
        if (y.length) {
          const k = document.createElement("span");
          k.className = "nimbi-article-meta", k.textContent = y.join(" • "), h.appendChild(k);
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
    await zo(s, r, n);
  } catch (p) {
    ko("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", p), await pr(s, r, n);
  }
  const u = So(e, a.toc, n);
  return { article: s, parsed: a, toc: u, topH1: c, h1Text: o, slugKey: l };
}
function Mo(e) {
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
function ti(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    try {
      dn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, Ee, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const Wi = Na(() => {
  const e = zt(wo);
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
          const r = { data: await bo(n) };
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
function $o() {
  return Wi.get();
}
function Po(e) {
  return Wi.send(e, 2e3);
}
async function zo(e, t, n) {
  if (!$o()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Po({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Io(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = Xe(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
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
                history.replaceState({ page: c || a }, "", Qe(c || a, s));
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
            Yn(s);
          } catch (o) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", Qe(a, s));
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
function Yn(e) {
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
function Oo(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const c = s || ((g) => typeof g == "string" ? g : ""), o = i || document.querySelector(".nimbi-cms"), l = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), p = a || document.querySelector(".nimbi-nav-wrap");
    let d = document.querySelector(".nimbi-scroll-top");
    if (!d) {
      d = document.createElement("button"), d.className = "nimbi-scroll-top button is-primary is-rounded is-small", d.setAttribute("aria-label", c("scrollToTop")), d.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(d) : o && o.appendChild ? o.appendChild(d) : l && l.appendChild ? l.appendChild(d) : document.body.appendChild(d);
      } catch {
        try {
          document.body.appendChild(d);
        } catch (h) {
          console.warn("[htmlBuilder] append scroll top button failed", h);
        }
      }
      try {
        try {
          oi(d);
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
    const f = p && p.querySelector ? p.querySelector(".menu-label") : null;
    if (t) {
      if (!d._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const g = globalThis.IntersectionObserver, h = new g((w) => {
            for (const y of w)
              y.target instanceof Element && (y.isIntersecting ? (d.classList.remove("show"), f && f.classList.remove("show")) : (d.classList.add("show"), f && f.classList.add("show")));
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
        d._nimbiObserver && typeof d._nimbiObserver.observe == "function" && d._nimbiObserver.observe(t);
      } catch (g) {
        console.warn("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const h = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, w = t.getBoundingClientRect();
            !(w.bottom < h.top || w.top > h.bottom) ? (d.classList.remove("show"), f && f.classList.remove("show")) : (d.classList.add("show"), f && f.classList.add("show"));
          } catch (h) {
            console.warn("[htmlBuilder] checkIntersect failed", h);
          }
        };
        g(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(g, 100);
      } catch (g) {
        console.warn("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      d.classList.remove("show"), f && f.classList.remove("show");
      const g = i instanceof Element ? i : r instanceof Element ? r : window, h = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (d.classList.add("show"), f && f.classList.add("show")) : (d.classList.remove("show"), f && f.classList.remove("show"));
        } catch (w) {
          console.warn("[htmlBuilder] onScroll handler failed", w);
        }
      };
      gn(() => g.addEventListener("scroll", h)), h();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
function ni(e, t) {
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
async function No(e, t, n, i, r, a, s, c, o = "eager", l = 1, u = void 0, p = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const m = typeof DOMParser < "u" ? new DOMParser() : null, d = m ? m.parseFromString(n || "", "text/html") : null, f = d ? d.querySelectorAll("a") : [];
  await gn(() => Eo(f, i)), await gn(() => Lo(f, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let g = null, h = null, w = null, y = null, k = null, _ = null;
  function R() {
    try {
      const A = document.querySelector(".navbar-burger"), v = A && A.dataset ? A.dataset.target : null, O = v ? document.getElementById(v) : null;
      A && A.classList.contains("is-active") && (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), O && O.classList.remove("is-active"));
    } catch (A) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", A);
    }
  }
  async function $() {
    const A = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      A && A.classList.add("is-inactive");
    } catch {
    }
    try {
      const v = s && s();
      v && typeof v.then == "function" && await v;
    } catch (v) {
      try {
        console.warn && console.warn("[nimbi-cms] renderByQuery failed", v);
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
  const B = () => g || (g = (async () => {
    try {
      const A = await Promise.resolve().then(() => vt), v = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, O = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, P = ni(A, "buildSearchIndex"), z = ni(A, "buildSearchIndexWorker"), M = typeof v == "function" ? v : P || void 0, U = typeof O == "function" ? O : z || void 0;
      try {
        console.log("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof M + " workerFn=" + typeof U + " (global preferred)");
      } catch {
      }
      if (o === "lazy" && typeof U == "function")
        try {
          const x = await U(i, l, u);
          if (x && x.length) return x;
        } catch (x) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", x);
        }
      if (typeof M == "function") {
        try {
          console.log("[nimbi-cms test] calling buildFn");
        } catch {
        }
        return await M(i, l, u);
      }
      return [];
    } catch (A) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", A), [];
    } finally {
      if (h) {
        try {
          h.removeAttribute("disabled");
        } catch {
        }
        try {
          w && w.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), g.then((A) => {
    try {
      const v = String(h && h.value || "").trim().toLowerCase();
      if (!v || !Array.isArray(A) || !A.length) return;
      const O = A.filter((z) => z.title && z.title.toLowerCase().includes(v) || z.excerpt && z.excerpt.toLowerCase().includes(v));
      if (!O || !O.length) return;
      const P = document.getElementById("nimbi-search-results");
      if (!P) return;
      P.innerHTML = "";
      try {
        const z = document.createElement("div");
        z.className = "panel nimbi-search-panel", O.slice(0, 10).forEach((M) => {
          try {
            if (M.parentTitle) {
              const J = document.createElement("p");
              J.className = "panel-heading nimbi-search-title nimbi-search-parent", J.textContent = M.parentTitle, z.appendChild(J);
            }
            const U = document.createElement("a");
            U.className = "panel-block nimbi-search-result", U.href = Ae(M.slug), U.setAttribute("role", "button");
            try {
              if (M.path && typeof M.slug == "string") {
                try {
                  te.set(M.slug, M.path);
                } catch {
                }
                try {
                  W.set(M.path, M.slug);
                } catch {
                }
              }
            } catch {
            }
            const x = document.createElement("div");
            x.className = "is-size-6 has-text-weight-semibold", x.textContent = M.title, U.appendChild(x), U.addEventListener("click", () => {
              try {
                P.style.display = "none";
              } catch {
              }
            }), z.appendChild(U);
          } catch {
          }
        }), P.appendChild(z);
        try {
          P.style.display = "block";
        } catch {
        }
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), g), L = document.createElement("nav");
  L.className = "navbar", L.setAttribute("role", "navigation"), L.setAttribute("aria-label", "main navigation");
  const F = document.createElement("div");
  F.className = "navbar-brand";
  const V = f[0], j = document.createElement("a");
  if (j.className = "navbar-item", V) {
    const A = V.getAttribute("href") || "#";
    try {
      const O = new URL(A, location.href).searchParams.get("page");
      if (O) {
        const P = decodeURIComponent(O);
        j.href = Ae(P);
      } else
        j.href = Ae(r), j.textContent = a("home");
    } catch {
      j.href = Ae(r), j.textContent = a("home");
    }
  } else
    j.href = Ae(r), j.textContent = a("home");
  async function E(A) {
    try {
      if (!A || A === "none") return null;
      if (A === "favicon")
        try {
          const v = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!v) return null;
          const O = v.getAttribute("href") || "";
          return O && /\.png(?:\?|$)/i.test(O) ? new URL(O, location.href).toString() : null;
        } catch {
          return null;
        }
      if (A === "copy-first" || A === "move-first")
        try {
          const v = await ke(r, i);
          if (!v || !v.raw) return null;
          const z = new DOMParser().parseFromString(v.raw, "text/html").querySelector("img");
          if (!z) return null;
          const M = z.getAttribute("src") || "";
          if (!M) return null;
          const U = new URL(M, location.href).toString();
          if (A === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", U);
            } catch {
            }
          return U;
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
  let ne = null;
  try {
    ne = await E(p);
  } catch {
    ne = null;
  }
  if (ne)
    try {
      const A = document.createElement("img");
      A.className = "nimbi-navbar-logo";
      const v = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      A.alt = v, A.title = v, A.src = ne;
      try {
        A.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!j.textContent || !String(j.textContent).trim()) && (j.textContent = v);
      } catch {
      }
      try {
        j.insertBefore(A, j.firstChild);
      } catch {
        try {
          j.appendChild(A);
        } catch {
        }
      }
    } catch {
    }
  F.appendChild(j), j.addEventListener("click", function(A) {
    const v = j.getAttribute("href") || "";
    if (v.startsWith("?page=")) {
      A.preventDefault();
      const O = new URL(v, location.href), P = O.searchParams.get("page"), z = O.hash ? O.hash.replace(/^#/, "") : null;
      history.pushState({ page: P }, "", Ae(P, z)), $();
      try {
        R();
      } catch {
      }
    }
  });
  function ge(A) {
    try {
      if (!A) return null;
      const v = he(String(A || ""));
      try {
        if (W && W.has(v)) return W.get(v);
      } catch {
      }
      const O = v.replace(/^.*\//, "");
      try {
        if (W && W.has(O)) return W.get(O);
      } catch {
      }
      try {
        for (const [P, z] of te.entries())
          if (z) {
            if (typeof z == "string") {
              if (he(z) === v) return P;
            } else if (z && typeof z == "object") {
              if (z.default && he(z.default) === v) return P;
              const M = z.langs || {};
              for (const U in M)
                if (M[U] && he(M[U]) === v) return P;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const Y = document.createElement("a");
  Y.className = "navbar-burger", Y.setAttribute("role", "button"), Y.setAttribute("aria-label", "menu"), Y.setAttribute("aria-expanded", "false");
  const C = "nimbi-navbar-menu";
  Y.dataset.target = C, Y.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', F.appendChild(Y);
  try {
    Y.addEventListener("click", (A) => {
      try {
        const v = Y.dataset && Y.dataset.target ? Y.dataset.target : null, O = v ? document.getElementById(v) : null;
        Y.classList.contains("is-active") ? (Y.classList.remove("is-active"), Y.setAttribute("aria-expanded", "false"), O && O.classList.remove("is-active")) : (Y.classList.add("is-active"), Y.setAttribute("aria-expanded", "true"), O && O.classList.add("is-active"));
      } catch (v) {
        console.warn("[nimbi-cms] navbar burger toggle failed", v);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] burger event binding failed", A);
  }
  const q = document.createElement("div");
  q.className = "navbar-menu", q.id = C;
  const ce = document.createElement("div");
  ce.className = "navbar-start";
  let G = null, ae = null;
  if (!c)
    G = null, h = null, y = null, k = null, _ = null;
  else {
    G = document.createElement("div"), G.className = "navbar-end", ae = document.createElement("div"), ae.className = "navbar-item", h = document.createElement("input"), h.className = "input", h.type = "search", h.placeholder = a("searchPlaceholder") || "", h.id = "nimbi-search";
    try {
      const z = (a && typeof a == "function" ? a("searchAria") : null) || h.placeholder || "Search";
      try {
        h.setAttribute("aria-label", z);
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
    o === "eager" && (h.disabled = !0), w = document.createElement("div"), w.className = "control", o === "eager" && w.classList.add("is-loading"), w.appendChild(h), ae.appendChild(w), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const A = document.createElement("div");
    A.className = "dropdown-trigger", A.appendChild(ae);
    const v = document.createElement("div");
    v.className = "dropdown-menu", v.setAttribute("role", "menu"), k = document.createElement("div"), k.id = "nimbi-search-results", k.className = "dropdown-content nimbi-search-results", _ = k, v.appendChild(k), y.appendChild(A), y.appendChild(v), G.appendChild(y);
    const O = (z) => {
      if (!k) return;
      k.innerHTML = "";
      let M = -1;
      function U(Q) {
        try {
          const fe = k.querySelector(".nimbi-search-result.is-selected");
          fe && fe.classList.remove("is-selected");
          const _e = k.querySelectorAll(".nimbi-search-result");
          if (!_e || !_e.length) return;
          if (Q < 0) {
            M = -1;
            return;
          }
          Q >= _e.length && (Q = _e.length - 1);
          const oe = _e[Q];
          if (oe) {
            oe.classList.add("is-selected"), M = Q;
            try {
              oe.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function x(Q) {
        try {
          const fe = Q.key, _e = k.querySelectorAll(".nimbi-search-result");
          if (!_e || !_e.length) return;
          if (fe === "ArrowDown") {
            Q.preventDefault();
            const oe = M < 0 ? 0 : Math.min(_e.length - 1, M + 1);
            U(oe);
            return;
          }
          if (fe === "ArrowUp") {
            Q.preventDefault();
            const oe = M <= 0 ? 0 : M - 1;
            U(oe);
            return;
          }
          if (fe === "Enter") {
            Q.preventDefault();
            const oe = k.querySelector(".nimbi-search-result.is-selected") || k.querySelector(".nimbi-search-result");
            if (oe)
              try {
                oe.click();
              } catch {
              }
            return;
          }
          if (fe === "Escape") {
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
              k.removeEventListener("keydown", x);
            } catch {
            }
            try {
              h && h.focus();
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", J);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function J(Q) {
        try {
          if (Q && Q.key === "ArrowDown") {
            Q.preventDefault();
            try {
              k.focus();
            } catch {
            }
            U(0);
          }
        } catch {
        }
      }
      try {
        const Q = document.createElement("div");
        Q.className = "panel nimbi-search-panel", z.forEach((fe) => {
          if (fe.parentTitle) {
            const we = document.createElement("p");
            we.textContent = fe.parentTitle, we.className = "panel-heading nimbi-search-title nimbi-search-parent", Q.appendChild(we);
          }
          const _e = document.createElement("a");
          _e.className = "panel-block nimbi-search-result", _e.href = Ae(fe.slug), _e.setAttribute("role", "button");
          try {
            if (fe.path && typeof fe.slug == "string") {
              try {
                te.set(fe.slug, fe.path);
              } catch {
              }
              try {
                W.set(fe.path, fe.slug);
              } catch {
              }
            }
          } catch {
          }
          const oe = document.createElement("div");
          oe.className = "is-size-6 has-text-weight-semibold", oe.textContent = fe.title, _e.appendChild(oe), _e.addEventListener("click", () => {
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
              k.removeEventListener("keydown", x);
            } catch {
            }
            try {
              h && h.removeEventListener("keydown", J);
            } catch {
            }
          }), Q.appendChild(_e);
        }), k.appendChild(Q);
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
        k.addEventListener("keydown", x);
      } catch {
      }
      try {
        h && h.addEventListener("keydown", J);
      } catch {
      }
    }, P = (z, M) => {
      let U = null;
      return (...x) => {
        U && clearTimeout(U), U = setTimeout(() => z(...x), M);
      };
    };
    if (h) {
      const z = P(async () => {
        const M = document.querySelector("input#nimbi-search"), U = String(M && M.value || "").trim().toLowerCase();
        if (!U) {
          O([]);
          return;
        }
        try {
          await B();
          const x = await g;
          try {
            console.log('[nimbi-cms test] search handleInput q="' + U + '" idxlen=' + (Array.isArray(x) ? x.length : "nil"));
          } catch {
          }
          const J = x.filter((Q) => Q.title && Q.title.toLowerCase().includes(U) || Q.excerpt && Q.excerpt.toLowerCase().includes(U));
          try {
            console.log("[nimbi-cms test] filtered len=" + (Array.isArray(J) ? J.length : "nil"));
          } catch {
          }
          O(J.slice(0, 10));
        } catch (x) {
          console.warn("[nimbi-cms] search input handler failed", x), O([]);
        }
      }, 50);
      try {
        h.addEventListener("input", z);
      } catch {
      }
      try {
        document.addEventListener("input", (M) => {
          try {
            M && M.target && M.target.id === "nimbi-search" && z(M);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = B();
      } catch (z) {
        console.warn("[nimbi-cms] eager search index init failed", z), g = Promise.resolve([]);
      }
      g.finally(() => {
        const z = document.querySelector("input#nimbi-search");
        if (z) {
          try {
            z.removeAttribute("disabled");
          } catch {
          }
          try {
            w && w.classList.remove("is-loading");
          } catch {
          }
        }
      });
    }
    try {
      const z = (M) => {
        try {
          const U = M && M.target;
          if (!_ || !_.classList.contains("is-open") && _.style && _.style.display !== "block" || U && (_.contains(U) || h && (U === h || h.contains && h.contains(U)))) return;
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
      document.addEventListener("click", z, !0), document.addEventListener("touchstart", z, !0);
    } catch {
    }
  }
  for (let A = 0; A < f.length; A++) {
    const v = f[A];
    if (A === 0) continue;
    const O = v.getAttribute("href") || "#", P = document.createElement("a");
    P.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(O) || O.endsWith(".md")) {
        const M = he(O).split(/::|#/, 2), U = M[0], x = M[1], J = ge(U);
        J ? P.href = Ae(J, x) : P.href = Ae(U, x);
      } else if (/\.html(?:$|[#?])/.test(O) || O.endsWith(".html")) {
        const M = he(O).split(/::|#/, 2);
        let U = M[0];
        U && !U.toLowerCase().endsWith(".html") && (U = U + ".html");
        const x = M[1], J = ge(U);
        if (J)
          P.href = Ae(J, x);
        else
          try {
            const Q = await ke(U, i);
            if (Q && Q.raw)
              try {
                const _e = new DOMParser().parseFromString(Q.raw, "text/html"), oe = _e.querySelector("title"), we = _e.querySelector("h1"), xe = oe && oe.textContent && oe.textContent.trim() ? oe.textContent.trim() : we && we.textContent ? we.textContent.trim() : null;
                if (xe) {
                  const Ue = be(xe);
                  if (Ue) {
                    try {
                      te.set(Ue, U), W.set(U, Ue);
                    } catch (Et) {
                      console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Et);
                    }
                    P.href = Ae(Ue, x);
                  } else
                    P.href = Ae(U, x);
                } else
                  P.href = Ae(U, x);
              } catch {
                P.href = Ae(U, x);
              }
            else
              P.href = O;
          } catch {
            P.href = O;
          }
      } else
        P.href = O;
    } catch (z) {
      console.warn("[nimbi-cms] nav item href parse failed", z), P.href = O;
    }
    try {
      const z = v.textContent && String(v.textContent).trim() ? String(v.textContent).trim() : null;
      if (z)
        try {
          const M = be(z);
          if (M) {
            const U = P.getAttribute("href") || "";
            let x = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(U))
              x = he(String(U || "").split(/[?#]/)[0]);
            else
              try {
                const J = Xe(U);
                J && J.type === "canonical" && J.page && (x = he(J.page));
              } catch {
              }
            if (x) {
              let J = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(x || "")))
                  J = !0;
                else {
                  const Q = String(x || "").replace(/^\.\//, ""), fe = Q.replace(/^.*\//, "");
                  Array.isArray(Me) && Me.length && (Me.includes(Q) || Me.includes(fe)) && (J = !0);
                }
              } catch {
                J = !1;
              }
              if (J) {
                try {
                  te.set(M, x);
                } catch {
                }
                try {
                  W.set(x, M);
                } catch {
                }
              }
            }
          }
        } catch (M) {
          console.warn("[nimbi-cms] nav slug mapping failed", M);
        }
    } catch (z) {
      console.warn("[nimbi-cms] nav slug mapping failed", z);
    }
    P.textContent = v.textContent || O, ce.appendChild(P);
  }
  q.appendChild(ce), G && q.appendChild(G), L.appendChild(F), L.appendChild(q), e.appendChild(L);
  try {
    const A = (v) => {
      try {
        const O = L && L.querySelector ? L.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!O || !O.classList.contains("is-active")) return;
        const P = O && O.closest ? O.closest(".navbar") : L;
        if (P && P.contains(v.target)) return;
        R();
      } catch {
      }
    };
    document.addEventListener("click", A, !0), document.addEventListener("touchstart", A, !0);
  } catch {
  }
  try {
    q.addEventListener("click", (A) => {
      const v = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!v) return;
      const O = v.getAttribute("href") || "";
      try {
        const P = new URL(O, location.href), z = P.searchParams.get("page"), M = P.hash ? P.hash.replace(/^#/, "") : null;
        z && (A.preventDefault(), history.pushState({ page: z }, "", Ae(z, M)), $());
      } catch (P) {
        console.warn("[nimbi-cms] navbar click handler failed", P);
      }
      try {
        const P = L && L.querySelector ? L.querySelector(".navbar-burger") : null, z = P && P.dataset ? P.dataset.target : null, M = z ? document.getElementById(z) : null;
        P && P.classList.contains("is-active") && (P.classList.remove("is-active"), P.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active"));
      } catch (P) {
        console.warn("[nimbi-cms] mobile menu close failed", P);
      }
    });
  } catch (A) {
    console.warn("[nimbi-cms] attach content click handler failed", A);
  }
  try {
    t.addEventListener("click", (A) => {
      const v = A.target && A.target.closest ? A.target.closest("a") : null;
      if (!v) return;
      const O = v.getAttribute("href") || "";
      if (O && !hi(O))
        try {
          const P = new URL(O, location.href), z = P.searchParams.get("page"), M = P.hash ? P.hash.replace(/^#/, "") : null;
          z && (A.preventDefault(), history.pushState({ page: z }, "", Ae(z, M)), $());
        } catch (P) {
          console.warn("[nimbi-cms] container click URL parse failed", P);
        }
    });
  } catch (A) {
    console.warn("[nimbi-cms] build navbar failed", A);
  }
  return { navbar: L, linkEls: f };
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
let Ne = null, K = null, Pe = 1, Je = (e, t) => t, Ut = 0, jt = 0, fn = () => {
}, Pt = 0.25;
function Bo() {
  if (Ne && document.contains(Ne)) return Ne;
  Ne = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", Je("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (C) => {
    C.target === e && Hn();
  }), e.addEventListener("wheel", (C) => {
    if (!V()) return;
    C.preventDefault();
    const q = C.deltaY < 0 ? Pt : -Pt;
    it(Pe + q), l(), u();
  }, { passive: !1 }), e.addEventListener("keydown", (C) => {
    if (C.key === "Escape") {
      Hn();
      return;
    }
    if (Pe > 1) {
      const q = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!q) return;
      const ce = 40;
      switch (C.key) {
        case "ArrowUp":
          q.scrollTop -= ce, C.preventDefault();
          break;
        case "ArrowDown":
          q.scrollTop += ce, C.preventDefault();
          break;
        case "ArrowLeft":
          q.scrollLeft -= ce, C.preventDefault();
          break;
        case "ArrowRight":
          q.scrollLeft += ce, C.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Ne = e, K = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), c = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function l() {
    c && (c.textContent = `${Math.round(Pe * 100)}%`);
  }
  const u = () => {
    o && (o.textContent = `${Math.round(Pe * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  fn = l, i.addEventListener("click", () => {
    it(Pe + Pt), l(), u();
  }), r.addEventListener("click", () => {
    it(Pe - Pt), l(), u();
  }), t.addEventListener("click", () => {
    Ht(), l(), u();
  }), n.addEventListener("click", () => {
    it(1), l(), u();
  }), a.addEventListener("click", () => {
    Ht(), l(), u();
  }), s.addEventListener("click", Hn), t.title = Je("imagePreviewFit", "Fit to screen"), n.title = Je("imagePreviewOriginal", "Original size"), r.title = Je("imagePreviewZoomOut", "Zoom out"), i.title = Je("imagePreviewZoomIn", "Zoom in"), s.title = Je("imagePreviewClose", "Close"), s.setAttribute("aria-label", Je("imagePreviewClose", "Close"));
  let p = !1, m = 0, d = 0, f = 0, g = 0;
  const h = /* @__PURE__ */ new Map();
  let w = 0, y = 1;
  const k = (C, q) => {
    const ce = C.x - q.x, G = C.y - q.y;
    return Math.hypot(ce, G);
  }, _ = () => {
    p = !1, h.clear(), w = 0, K && (K.classList.add("is-panning"), K.classList.remove("is-grabbing"));
  };
  let R = 0, $ = 0, B = 0;
  const L = (C) => {
    const q = Date.now(), ce = q - R, G = C.clientX - $, ae = C.clientY - B;
    R = q, $ = C.clientX, B = C.clientY, ce < 300 && Math.hypot(G, ae) < 30 && (it(Pe > 1 ? 1 : 2), l(), C.preventDefault());
  }, F = (C) => {
    it(Pe > 1 ? 1 : 2), l(), C.preventDefault();
  }, V = () => Ne ? typeof Ne.open == "boolean" ? Ne.open : Ne.classList.contains("is-active") : !1, j = (C, q, ce = 1) => {
    if (h.has(ce) && h.set(ce, { x: C, y: q }), h.size === 2) {
      const v = Array.from(h.values()), O = k(v[0], v[1]);
      if (w > 0) {
        const P = O / w;
        it(y * P);
      }
      return;
    }
    if (!p) return;
    const G = K.closest(".nimbi-image-preview__image-wrapper");
    if (!G) return;
    const ae = C - m, A = q - d;
    G.scrollLeft = f - ae, G.scrollTop = g - A;
  }, E = (C, q, ce = 1) => {
    if (!V()) return;
    if (h.set(ce, { x: C, y: q }), h.size === 2) {
      const A = Array.from(h.values());
      w = k(A[0], A[1]), y = Pe;
      return;
    }
    const G = K.closest(".nimbi-image-preview__image-wrapper");
    !G || !(G.scrollWidth > G.clientWidth || G.scrollHeight > G.clientHeight) || (p = !0, m = C, d = q, f = G.scrollLeft, g = G.scrollTop, K.classList.add("is-panning"), K.classList.remove("is-grabbing"), window.addEventListener("pointermove", ne), window.addEventListener("pointerup", ge), window.addEventListener("pointercancel", ge));
  }, ne = (C) => {
    p && (C.preventDefault(), j(C.clientX, C.clientY, C.pointerId));
  }, ge = () => {
    _(), window.removeEventListener("pointermove", ne), window.removeEventListener("pointerup", ge), window.removeEventListener("pointercancel", ge);
  };
  K.addEventListener("pointerdown", (C) => {
    C.preventDefault(), E(C.clientX, C.clientY, C.pointerId);
  }), K.addEventListener("pointermove", (C) => {
    (p || h.size === 2) && C.preventDefault(), j(C.clientX, C.clientY, C.pointerId);
  }), K.addEventListener("pointerup", (C) => {
    C.preventDefault(), C.pointerType === "touch" && L(C), _();
  }), K.addEventListener("dblclick", F), K.addEventListener("pointercancel", _), K.addEventListener("mousedown", (C) => {
    C.preventDefault(), E(C.clientX, C.clientY, 1);
  }), K.addEventListener("mousemove", (C) => {
    p && C.preventDefault(), j(C.clientX, C.clientY, 1);
  }), K.addEventListener("mouseup", (C) => {
    C.preventDefault(), _();
  });
  const Y = e.querySelector(".nimbi-image-preview__image-wrapper");
  return Y && (Y.addEventListener("pointerdown", (C) => {
    if (E(C.clientX, C.clientY, C.pointerId), C && C.target && C.target.tagName === "IMG")
      try {
        C.target.classList.add("is-grabbing");
      } catch {
      }
  }), Y.addEventListener("pointermove", (C) => {
    j(C.clientX, C.clientY, C.pointerId);
  }), Y.addEventListener("pointerup", _), Y.addEventListener("pointercancel", _), Y.addEventListener("mousedown", (C) => {
    if (E(C.clientX, C.clientY, 1), C && C.target && C.target.tagName === "IMG")
      try {
        C.target.classList.add("is-grabbing");
      } catch {
      }
  }), Y.addEventListener("mousemove", (C) => {
    j(C.clientX, C.clientY, 1);
  }), Y.addEventListener("mouseup", _)), e;
}
function it(e) {
  if (!K) return;
  const t = Number(e);
  Pe = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = K.getBoundingClientRect(), r = Ut || K.naturalWidth || K.width || i.width || 0, a = jt || K.naturalHeight || K.height || i.height || 0;
  if (r && a) {
    K.style.setProperty("--nimbi-preview-img-max-width", "none"), K.style.setProperty("--nimbi-preview-img-max-height", "none"), K.style.setProperty("--nimbi-preview-img-width", `${r * Pe}px`), K.style.setProperty("--nimbi-preview-img-height", `${a * Pe}px`), K.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      K.style.width = `${r * Pe}px`, K.style.height = `${a * Pe}px`, K.style.transform = "none";
    } catch {
    }
  } else {
    K.style.setProperty("--nimbi-preview-img-max-width", ""), K.style.setProperty("--nimbi-preview-img-max-height", ""), K.style.setProperty("--nimbi-preview-img-width", ""), K.style.setProperty("--nimbi-preview-img-height", ""), K.style.setProperty("--nimbi-preview-img-transform", `scale(${Pe})`);
    try {
      K.style.transform = `scale(${Pe})`;
    } catch {
    }
  }
  K && (K.classList.add("is-panning"), K.classList.remove("is-grabbing"));
}
function Ht() {
  if (!K) return;
  const e = K.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = Ut || K.naturalWidth || t.width, i = jt || K.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  it(Number.isFinite(s) ? s : 1);
}
function Do(e, t = "", n = 0, i = 0) {
  const r = Bo();
  Pe = 1, Ut = n || 0, jt = i || 0, K.src = e;
  try {
    if (!t)
      try {
        const c = new URL(e, typeof location < "u" ? location.href : "").pathname || "", l = (c.substring(c.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = Je("imagePreviewDefaultAlt", l || "Image");
      } catch {
        t = Je("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  K.alt = t, K.style.transform = "scale(1)";
  const a = () => {
    Ut = K.naturalWidth || K.width || 0, jt = K.naturalHeight || K.height || 0;
  };
  if (a(), Ht(), fn(), requestAnimationFrame(() => {
    Ht(), fn();
  }), !Ut || !jt) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        Ht(), fn();
      }), K.removeEventListener("load", s);
    };
    K.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function Hn() {
  if (Ne) {
    typeof Ne.close == "function" && Ne.open && Ne.close(), Ne.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function qo(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  Je = (d, f) => (typeof t == "function" ? t(d) : void 0) || f, Pt = n, e.addEventListener("click", (d) => {
    const f = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!f || f.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      f
    );
    if (!g.src) return;
    const h = g.closest("a");
    h && h.getAttribute("href") || Do(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, c = 0;
  const o = /* @__PURE__ */ new Map();
  let l = 0, u = 1;
  const p = (d, f) => {
    const g = d.x - f.x, h = d.y - f.y;
    return Math.hypot(g, h);
  };
  e.addEventListener("pointerdown", (d) => {
    const f = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!f || f.tagName !== "IMG") return;
    const g = f.closest("a");
    if (g && g.getAttribute("href") || !Ne || !Ne.open) return;
    if (o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      const w = Array.from(o.values());
      l = p(w[0], w[1]), u = Pe;
      return;
    }
    const h = f.closest(".nimbi-image-preview__image-wrapper");
    if (h && !(Pe <= 1)) {
      d.preventDefault(), i = !0, r = d.clientX, a = d.clientY, s = h.scrollLeft, c = h.scrollTop, f.setPointerCapture(d.pointerId);
      try {
        f.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (d) => {
    if (o.has(d.pointerId) && o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      d.preventDefault();
      const k = Array.from(o.values()), _ = p(k[0], k[1]);
      if (l > 0) {
        const R = _ / l;
        it(u * R);
      }
      return;
    }
    if (!i) return;
    d.preventDefault();
    const f = (
      /** @type {HTMLElement} */
      d.target
    ), g = f.closest && f.closest("a");
    if (g && g.getAttribute && g.getAttribute("href")) return;
    const h = f.closest(".nimbi-image-preview__image-wrapper");
    if (!h) return;
    const w = d.clientX - r, y = d.clientY - a;
    h.scrollLeft = s - w, h.scrollTop = c - y;
  });
  const m = () => {
    i = !1, o.clear(), l = 0;
    try {
      const d = document.querySelector("[data-nimbi-preview-image]");
      d && (d.classList.add("is-panning"), d.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", m), e.addEventListener("pointercancel", m);
}
function Uo(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: c,
    initialDocumentTitle: o,
    runHooks: l
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const p = xo(a, [{ path: c, name: a("home"), isIndex: !0, children: [] }]);
  async function m(w, y) {
    let k, _, R;
    try {
      ({ data: k, pagePath: _, anchor: R } = await fs(w, s));
    } catch (E) {
      console.error("[nimbi-cms] fetchPageData failed", E), ti(t, a, E);
      return;
    }
    !R && y && (R = y);
    try {
      Yn(null);
    } catch (E) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", E);
    }
    t.innerHTML = "";
    const { article: $, parsed: B, toc: L, topH1: F, h1Text: V, slugKey: j } = await To(a, k, _, R, s);
    ls(a, o, B, L, $, _, R, F, V, j, k), n.innerHTML = "", L && (n.appendChild(L), Io(L));
    try {
      await l("transformHtml", { article: $, parsed: B, toc: L, pagePath: _, anchor: R, topH1: F, h1Text: V, slugKey: j, data: k });
    } catch (E) {
      console.warn("[nimbi-cms] transformHtml hooks failed", E);
    }
    t.appendChild($);
    try {
      Mo($);
    } catch (E) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", E);
    }
    try {
      qo($, { t: a });
    } catch (E) {
      console.warn("[nimbi-cms] attachImagePreview failed", E);
    }
    try {
      on(i, 100, !1), requestAnimationFrame(() => on(i, 100, !1)), setTimeout(() => on(i, 100, !1), 250);
    } catch (E) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", E);
    }
    Yn(R), Oo($, F, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await l("onPageLoad", { data: k, pagePath: _, anchor: R, article: $, toc: L, topH1: F, h1Text: V, slugKey: j, contentWrap: t, navWrap: n });
    } catch (E) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", E);
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
      let w = Xe(location.href);
      if (w && w.type === "path" && w.page)
        try {
          let _ = "?page=" + encodeURIComponent(w.page || "");
          w.params && (_ += (_.includes("?") ? "&" : "?") + w.params), w.anchor && (_ += "#" + encodeURIComponent(w.anchor));
          try {
            history.replaceState(history.state, "", _);
          } catch {
            try {
              history.replaceState({}, "", _);
            } catch {
            }
          }
          w = Xe(location.href);
        } catch {
        }
      const y = w && w.page ? w.page : c, k = w && w.anchor ? w.anchor : null;
      await m(y, k);
    } catch (w) {
      console.warn("[nimbi-cms] renderByQuery failed", w), ti(t, a, w);
    }
  }
  window.addEventListener("popstate", d);
  const f = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const w = i || document.querySelector(".nimbi-cms");
      if (!w) return;
      const y = {
        top: w.scrollTop || 0,
        left: w.scrollLeft || 0
      };
      sessionStorage.setItem(f(), JSON.stringify(y));
    } catch {
    }
  }, h = () => {
    try {
      const w = i || document.querySelector(".nimbi-cms");
      if (!w) return;
      const y = sessionStorage.getItem(f());
      if (!y) return;
      const k = JSON.parse(y);
      k && typeof k.top == "number" && w.scrollTo({ top: k.top, left: k.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (w) => {
    if (w.persisted)
      try {
        h(), on(i, 100, !1);
      } catch (y) {
        console.warn("[nimbi-cms] bfcache restore failed", y);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (w) {
      console.warn("[nimbi-cms] save scroll position failed", w);
    }
  }), { renderByQuery: d, siteNav: p, getCurrentPagePath: () => u };
}
function jo(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = Xe(window.location.href);
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
function Ho(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function Fn(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let cn = "";
async function nl(e = {}) {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.info("[nimbi-cms] initCMS called", { options: e });
    } catch {
    }
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const n = jo();
  if (n && (n.contentPath || n.homePage || n.notFoundPage || n.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (E) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", E);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (E) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", E);
      }
      delete n.contentPath, delete n.homePage, delete n.notFoundPage, delete n.navigationPage;
    }
  const i = Object.assign({}, n, e);
  n && typeof n.bulmaCustomize == "string" && n.bulmaCustomize.trim() && (i.bulmaCustomize = n.bulmaCustomize);
  let {
    el: r,
    contentPath: a = "/content",
    crawlMaxQueue: s = 1e3,
    searchIndex: c = !0,
    searchIndexMode: o = "eager",
    indexDepth: l = 1,
    noIndexing: u = void 0,
    defaultStyle: p = "light",
    bulmaCustomize: m = "none",
    lang: d = void 0,
    l10nFile: f = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: h,
    markdownExtensions: w,
    availableLanguages: y,
    homePage: k = "_home.md",
    notFoundPage: _ = "_404.md",
    navigationPage: R = "_navigation.md",
    exposeSitemap: $ = !0
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
    typeof R == "string" && R.startsWith("./") && (R = R.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: B = "favicon" } = i, { skipRootReadme: L = !1 } = i, F = (E) => {
    try {
      const ne = document.querySelector(r);
      ne && ne instanceof Element && (ne.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(E)}</pre></div>`);
    } catch {
    }
  };
  if (i.contentPath != null && !Ho(i.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (k != null && !Fn(k))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !Fn(_))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (R != null && !Fn(R))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r)
    throw new Error("el is required");
  let V = r;
  if (typeof r == "string") {
    if (V = document.querySelector(r), !V) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof a != "string" || !a.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof c != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (p !== "light" && p !== "dark" && p !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (m != null && typeof m != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (h != null && (typeof h != "number" || !Number.isInteger(h) || h < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((E) => !E || typeof E != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (L != null && typeof L != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const j = !!c;
  try {
    Promise.resolve().then(() => vt).then((E) => {
      try {
        E && typeof E.setSkipRootReadme == "function" && E.setSkipRootReadme(!!L);
      } catch (ne) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", ne);
      }
    }).catch((E) => {
    });
  } catch (E) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", E);
  }
  try {
    try {
      i && i.seoMap && typeof i.seoMap == "object" && ss(i.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(E) {
        try {
          const ne = { type: "error", message: E && E.message ? String(E.message) : "", filename: E && E.filename ? String(E.filename) : "", lineno: E && E.lineno ? E.lineno : null, colno: E && E.colno ? E.colno : null, stack: E && E.error && E.error.stack ? E.error.stack : null, time: Date.now() };
          try {
            console.warn("[nimbi-cms] runtime error", ne.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(ne);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(E) {
        try {
          const ne = { type: "unhandledrejection", reason: E && E.reason ? String(E.reason) : "", time: Date.now() };
          try {
            console.warn("[nimbi-cms] unhandledrejection", ne.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(ne);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const E = Xe(typeof window < "u" ? window.location.href : ""), ne = E && E.page ? E.page : k || "_home.md";
      try {
        os(ne, cn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        V.classList.add("nimbi-mount");
      } catch (x) {
        console.warn("[nimbi-cms] mount element setup failed", x);
      }
      const E = document.createElement("section");
      E.className = "section";
      const ne = document.createElement("div");
      ne.className = "container nimbi-cms";
      const ge = document.createElement("div");
      ge.className = "columns";
      const Y = document.createElement("div");
      Y.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", Y.setAttribute("role", "navigation");
      try {
        const x = typeof $t == "function" ? $t("navigation") : null;
        x && Y.setAttribute("aria-label", x);
      } catch (x) {
        console.warn("[nimbi-cms] set nav aria-label failed", x);
      }
      ge.appendChild(Y);
      const C = document.createElement("main");
      C.className = "column nimbi-content", C.setAttribute("role", "main"), ge.appendChild(C), ne.appendChild(ge), E.appendChild(ne);
      const q = Y, ce = C;
      V.appendChild(E);
      let G = null;
      try {
        G = V.querySelector(".nimbi-overlay"), G || (G = document.createElement("div"), G.className = "nimbi-overlay", V.appendChild(G));
      } catch (x) {
        G = null, console.warn("[nimbi-cms] mount overlay setup failed", x);
      }
      const ae = location.pathname || "/";
      let A;
      if (ae.endsWith("/"))
        A = ae;
      else {
        const x = ae.substring(ae.lastIndexOf("/") + 1);
        x && !x.includes(".") ? A = ae + "/" : A = ae.substring(0, ae.lastIndexOf("/") + 1);
      }
      try {
        cn = document.title || "";
      } catch (x) {
        cn = "", console.warn("[nimbi-cms] read initial document title failed", x);
      }
      let v = a;
      const O = Object.prototype.hasOwnProperty.call(i, "contentPath"), P = typeof location < "u" && location.origin ? location.origin : "http://localhost", z = new URL(A, P).toString();
      (v === "." || v === "./") && (v = "");
      try {
        v = String(v || "").replace(/\\/g, "/");
      } catch {
        v = String(v || "");
      }
      v.startsWith("/") && (v = v.replace(/^\/+/, "")), v && !v.endsWith("/") && (v = v + "/");
      try {
        if (v && A && A !== "/") {
          const x = A.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          x && v.startsWith(x) && (v = v.slice(x.length));
        }
      } catch {
      }
      try {
        if (v)
          var M = new URL(v, z.endsWith("/") ? z : z + "/").toString();
        else
          var M = z;
      } catch {
        try {
          if (v) var M = new URL("/" + v, P).toString();
          else var M = new URL(A, P).toString();
        } catch {
          var M = P;
        }
      }
      try {
        Promise.resolve().then(() => vt).then((x) => {
          try {
            x && typeof x.setHomePage == "function" && x.setHomePage(k);
          } catch (J) {
            console.warn("[nimbi-cms] setHomePage failed", J);
          }
        }).catch((x) => {
        });
      } catch (x) {
        console.warn("[nimbi-cms] setHomePage dynamic import failed", x);
      }
      f && await ci(f, A), y && Array.isArray(y) && fi(y), d && ui(d);
      const U = Uo({ contentWrap: ce, navWrap: q, container: ne, mountOverlay: G, t: $t, contentBase: M, homePage: k, initialDocumentTitle: cn, runHooks: $r });
      if (typeof g == "number" && g >= 0 && typeof Ur == "function" && Ur(g * 60 * 1e3), typeof h == "number" && h >= 0 && typeof qr == "function" && qr(h), w && Array.isArray(w) && w.length)
        try {
          w.forEach((x) => {
            typeof x == "object" && Hi && typeof Kn == "function" && Kn(x);
          });
        } catch (x) {
          console.warn("[nimbi-cms] applying markdownExtensions failed", x);
        }
      try {
        typeof s == "number" && Promise.resolve().then(() => vt).then(({ setDefaultCrawlMaxQueue: x }) => {
          try {
            x(s);
          } catch (J) {
            console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", J);
          }
        });
      } catch (x) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", x);
      }
      try {
        wn(M);
      } catch (x) {
        console.warn("[nimbi-cms] setContentBase failed", x);
      }
      try {
        Zn(_);
      } catch (x) {
        console.warn("[nimbi-cms] setNotFoundPage failed", x);
      }
      try {
        wn(M);
      } catch (x) {
        console.warn("[nimbi-cms] setContentBase failed", x);
      }
      try {
        Zn(_);
      } catch (x) {
        console.warn("[nimbi-cms] setNotFoundPage failed", x);
      }
      try {
        if ($ === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
          try {
            const x = await Promise.resolve().then(() => ri);
            try {
              if (x && typeof x.handleSitemapRequest == "function" && x.handleSitemapRequest({ includeAllMarkdown: !0, homePage: k, navigationPage: R, notFoundPage: _, contentBase: M }))
                return;
            } catch {
            }
          } catch {
          }
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => ri).then((x) => {
          try {
            x && typeof x.attachSitemapDownloadUI == "function" && x.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      try {
        await ke(k, M);
      } catch (x) {
        throw k === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${k} not found at ${M}${k}: ${x.message}`);
      }
      Ma(p), await Ta(m, A);
      try {
        const x = document.createElement("header");
        x.className = "nimbi-site-navbar", V.insertBefore(x, E);
        const J = await ke(R, M), Q = await _n(J.raw || ""), { navbar: fe, linkEls: _e } = await No(x, ne, Q.html || "", M, k, $t, U.renderByQuery, j, o, l, u, B);
        try {
          await $r("onNavBuild", { navWrap: q, navbar: fe, linkEls: _e, contentBase: M });
        } catch (oe) {
          console.warn("[nimbi-cms] onNavBuild hooks failed", oe);
        }
        try {
          const oe = () => {
            const we = x && x.getBoundingClientRect && Math.round(x.getBoundingClientRect().height) || x && x.offsetHeight || 0;
            if (we > 0) {
              try {
                V.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
              } catch (xe) {
                console.warn("[nimbi-cms] set CSS var failed", xe);
              }
              try {
                ne.style.paddingTop = "";
              } catch (xe) {
                console.warn("[nimbi-cms] set container paddingTop failed", xe);
              }
              try {
                const xe = V && V.getBoundingClientRect && Math.round(V.getBoundingClientRect().height) || V && V.clientHeight || 0;
                if (xe > 0) {
                  const Ue = Math.max(0, xe - we);
                  try {
                    ne.style.setProperty("--nimbi-cms-height", `${Ue}px`);
                  } catch (Et) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", Et);
                  }
                } else
                  try {
                    ne.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (Ue) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ue);
                  }
              } catch (xe) {
                console.warn("[nimbi-cms] compute container height failed", xe);
              }
              try {
                x.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
              } catch (xe) {
                console.warn("[nimbi-cms] set navbar CSS var failed", xe);
              }
            }
          };
          oe();
          try {
            if (typeof ResizeObserver < "u") {
              const we = new ResizeObserver(() => oe());
              try {
                we.observe(x);
              } catch (xe) {
                console.warn("[nimbi-cms] ResizeObserver.observe failed", xe);
              }
            }
          } catch (we) {
            console.warn("[nimbi-cms] ResizeObserver setup failed", we);
          }
        } catch (oe) {
          console.warn("[nimbi-cms] compute navbar height failed", oe);
        }
      } catch (x) {
        console.warn("[nimbi-cms] build navigation failed", x);
      }
      await U.renderByQuery();
      try {
        Promise.resolve().then(() => Wo).then(({ getVersion: x }) => {
          typeof x == "function" && x().then((J) => {
            try {
              const Q = J || "0.0.0";
              try {
                const fe = (we) => {
                  const xe = document.createElement("a");
                  xe.className = "nimbi-version-label tag is-small", xe.textContent = `nimbiCMS v. ${Q}`, xe.href = we || "#", xe.target = "_blank", xe.rel = "noopener noreferrer nofollow", xe.setAttribute("aria-label", `nimbiCMS version ${Q}`);
                  try {
                    oi(xe);
                  } catch {
                  }
                  try {
                    V.appendChild(xe);
                  } catch (Ue) {
                    console.warn("[nimbi-cms] append version label failed", Ue);
                  }
                }, _e = "https://abelvm.github.io/nimbiCMS/", oe = (() => {
                  try {
                    if (_e && typeof _e == "string")
                      return new URL(_e).toString();
                  } catch {
                  }
                  return "#";
                })();
                fe(oe);
              } catch (fe) {
                console.warn("[nimbi-cms] building version label failed", fe);
              }
            } catch (Q) {
              console.warn("[nimbi-cms] building version label failed", Q);
            }
          }).catch((J) => {
            console.warn("[nimbi-cms] getVersion() failed", J);
          });
        }).catch((x) => {
          console.warn("[nimbi-cms] import version module failed", x);
        });
      } catch (x) {
        console.warn("[nimbi-cms] version label setup failed", x);
      }
    })();
  } catch (E) {
    throw F(E), E;
  }
}
async function Fo() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Fo
}, Symbol.toStringTag, { value: "Module" }));
function Cn() {
  try {
    const e = typeof location < "u" && location && typeof location.pathname == "string" ? location.origin + location.pathname.split("?")[0] : typeof location < "u" && location.origin ? location.origin : "http://localhost";
    return String(e);
  } catch {
    return "http://localhost/";
  }
}
function xn(e = {}) {
  const { includeAllMarkdown: t = !0 } = e || {}, n = Cn(), i = [];
  try {
    if (t && Array.isArray(Me) && Me.length)
      i.push(...Me);
    else
      for (const s of Array.from(te.values()))
        if (s) {
          if (typeof s == "string") i.push(s);
          else if (s && typeof s == "object" && (s.default && i.push(s.default), s.langs))
            for (const c of Object.values(s.langs || {})) c && i.push(c);
        }
  } catch (s) {
    console.warn("[runtimeSitemap] gather paths failed", s);
  }
  const r = /* @__PURE__ */ new Set(), a = [];
  for (let s of i)
    try {
      if (!s || (s = he(String(s)), r.has(s))) continue;
      r.add(s);
      const c = n.split("?")[0] + "?page=" + encodeURIComponent(s);
      a.push({ loc: c, path: s });
    } catch {
    }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: a };
}
function Le(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Sn(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : e && e.entries ? e.entries : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${Le(String(i.loc || i.path || ""))}</loc>
`, i.lastmod && (n += `    <lastmod>${Le(String(i.lastmod))}</lastmod>
`), n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function Jn(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : e && e.entries ? e.entries : [], n = Cn().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${Le("Sitemap RSS")}</title>
`, i += `<link>${Le(n)}</link>
`, i += `<description>${Le("RSS feed generated from site index")}</description>
`;
  const r = e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString();
  i += `<lastBuildDate>${Le(r)}</lastBuildDate>
`;
  for (const a of t)
    try {
      const s = String(a.loc || a.path || "");
      if (i += `<item>
`, i += `<title>${Le(String(a.path || a.loc || ""))}</title>
`, i += `<link>${Le(s)}</link>
`, i += `<guid>${Le(s)}</guid>
`, a && a.lastmod)
        try {
          const c = new Date(a.lastmod);
          isNaN(c) || (i += `<pubDate>${Le(c.toUTCString())}</pubDate>
`);
        } catch {
        }
      i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function er(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : e && e.entries ? e.entries : [], n = Cn().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${Le("Sitemap Atom")}</title>
`, r += `<link href="${Le(n)}" />
`, r += `<updated>${Le(i)}</updated>
`, r += `<id>${Le(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || a.path || ""), c = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${Le(String(a.path || a.loc || ""))}</title>
`, r += `<link href="${Le(s)}" />
`, r += `<id>${Le(s)}</id>
`, r += `<updated>${Le(c)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Zo(e) {
  try {
    const t = [];
    if (!e) return t;
    const n = /\[[^\]]+\]\(([^)]+)\)/g;
    let i;
    for (; (i = n.exec(e)) !== null; )
      i[1] && t.push(i[1]);
    const r = /<a[^>]+href=["']([^"']+)["']/gi;
    for (; (i = r.exec(e)) !== null; )
      i[1] && t.push(i[1]);
    return t;
  } catch {
    return [];
  }
}
async function Go(e = {}) {
  if (typeof fetch > "u" || typeof location > "u") return [];
  const { navigationPage: t, homePage: n, contentBase: i } = e || {}, r = [];
  try {
    if (t && typeof t == "string" && (r.push("/" + String(t || "").replace(/^\/+/, "")), i))
      try {
        r.push(new URL(String(t || ""), String(i)).toString());
      } catch {
      }
  } catch {
  }
  try {
    if (n && typeof n == "string" && (r.push("/" + String(n || "").replace(/^\/+/, "")), i))
      try {
        r.push(new URL(String(n || ""), String(i)).toString());
      } catch {
      }
  } catch {
  }
  const a = [
    "/_navigation.md",
    "/_navigation.html",
    "/_home.md",
    "/_home.html",
    "/content/_navigation.md",
    "/content/_navigation.html",
    "/content/_home.md",
    "/content/_home.html"
  ];
  for (const l of a) r.includes(l) || r.push(l);
  const s = Cn().split("?")[0], c = /* @__PURE__ */ new Set(), o = [];
  for (const l of r)
    try {
      const u = typeof l == "string" && /^https?:\/\//i.test(l) ? l : new URL(l, location.origin).toString(), p = await fetch(u, { method: "GET" });
      if (!p || !p.ok) continue;
      const m = await p.text(), d = Zo(m);
      for (let f of d)
        try {
          try {
            const g = new URL(f, u);
            if (g.origin !== location.origin) continue;
            f = g.pathname.replace(/^\//, "");
          } catch {
          }
          if (f = he(String(f || "")), !f || c.has(f)) continue;
          c.add(f), o.push({ loc: s + "?page=" + encodeURIComponent(f), path: f });
        } catch {
        }
      if (o.length) return o;
    } catch {
    }
  return [];
}
function Qo(e, t = {}) {
  try {
    if (typeof document > "u") return null;
    const n = typeof e == "string" ? document.querySelector(e) : e;
    if (!n || !n.appendChild) return null;
    const i = document.createElement("div");
    i.className = "nimbi-sitemap-ui", i.style.cssText = "position:fixed;right:8px;bottom:8px;z-index:9999;padding:6px;background:rgba(0,0,0,0.6);border-radius:6px;";
    const r = (c) => {
      const o = document.createElement("button");
      return o.textContent = c, o.style.cssText = "color:#fff;background:transparent;border:1px solid rgba(255,255,255,0.2);padding:6px 8px;margin:2px;border-radius:4px;cursor:pointer", o;
    }, a = r("sitemap.json");
    a.title = "Download sitemap.json", a.addEventListener("click", () => {
      try {
        const c = xn(t), o = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" }), l = URL.createObjectURL(o), u = document.createElement("a");
        u.href = l, u.download = t.filename || "sitemap.json", document.body.appendChild(u), u.click(), u.remove(), setTimeout(() => URL.revokeObjectURL(l), 5e3);
      } catch (c) {
        console.warn("[runtimeSitemap] download json failed", c);
      }
    });
    const s = r("sitemap.xml");
    return s.title = "Download sitemap.xml", s.addEventListener("click", () => {
      try {
        const c = xn(t), o = Sn(c), l = new Blob([o], { type: "application/xml" }), u = URL.createObjectURL(l), p = document.createElement("a");
        p.href = u, p.download = t.filename || "sitemap.xml", document.body.appendChild(p), p.click(), p.remove(), setTimeout(() => URL.revokeObjectURL(u), 5e3);
      } catch (c) {
        console.warn("[runtimeSitemap] download xml failed", c);
      }
    }), i.appendChild(a), i.appendChild(s), n.appendChild(i), i;
  } catch (n) {
    return console.warn("[runtimeSitemap] attach UI failed", n), null;
  }
}
function Xo(e = {}) {
  try {
    if (typeof location > "u" || typeof document > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      if (typeof location.search == "string" && location.search) {
        const c = new URLSearchParams(location.search);
        if (c.has("sitemap")) {
          let o = !0;
          for (const l of c.keys())
            if (l !== "sitemap") {
              o = !1;
              break;
            }
          if (o) {
            if (location.hash && String(location.hash || "").trim())
              return !1;
            t = !0;
          } else
            return !1;
        }
      }
    } catch {
    }
    try {
      if (!t && typeof location.hash == "string" && location.hash && location.hash.startsWith("#/?")) {
        const c = location.hash.slice(2), o = new URLSearchParams(c.startsWith("?") ? c.slice(1) : c);
        if (o.has("sitemap")) {
          let l = !0;
          for (const u of o.keys())
            if (u !== "sitemap") {
              l = !1;
              break;
            }
          l && (t = !0);
        }
      }
    } catch {
    }
    if (typeof location.search == "string" && location.search) {
      const c = new URLSearchParams(location.search);
      if (c.has("rss")) {
        let o = !0;
        for (const l of c.keys())
          if (l !== "rss") {
            o = !1;
            break;
          }
        if (o) {
          if (location.hash && String(location.hash || "").trim()) return !1;
          i = !0;
        } else return !1;
      } else if (c.has("atom")) {
        let o = !0;
        for (const l of c.keys())
          if (l !== "atom") {
            o = !1;
            break;
          }
        if (o) {
          if (location.hash && String(location.hash || "").trim()) return !1;
          r = !0;
        } else return !1;
      }
    }
    try {
      typeof window < "u" && window && window.__nimbiPreferHtmlSitemap === !0 && t && (t = !1, n = !0);
    } catch {
    }
    if (!t && !n) {
      const o = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!o || (t = /^(sitemap|sitemap\.xml)$/i.test(o), n = /^(sitemap|sitemap\.html)$/i.test(o), i = /^(rss|rss\.xml)$/i.test(o), r = /^(atom|atom\.xml)$/i.test(o), !t && !n && !i && !r)) return !1;
    }
    const a = xn(e);
    async function s(c = "sitemap") {
      try {
        const o = await Go(e);
        if (o && o.length) {
          let l = "";
          c === "rss" ? l = Jn({ generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: o }) : c === "atom" ? l = er({ generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: o }) : l = Sn({ generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: o });
          try {
            try {
              document.open("application/xml", "replace");
            } catch {
              try {
                document.open();
              } catch {
              }
            }
            document.write(l), document.close();
            try {
              if (typeof Blob < "u" && typeof URL < "u" && URL.createObjectURL) {
                const u = new Blob([l], { type: "application/xml" }), p = URL.createObjectURL(u);
                try {
                  location.href = p;
                } catch {
                  try {
                    typeof window < "u" && window && typeof window.open == "function" && window.open(p, "_self");
                  } catch {
                  }
                }
                setTimeout(() => {
                  try {
                    URL.revokeObjectURL(p);
                  } catch {
                  }
                }, 5e3);
              }
            } catch {
            }
            return;
          } catch {
            try {
              if (typeof location < "u" && location) {
                const p = "data:application/xml;charset=utf-8," + encodeURIComponent(l);
                try {
                  location.href = p;
                  return;
                } catch {
                }
                try {
                  if (typeof window < "u" && window && typeof window.open == "function") {
                    window.open(p, "_self");
                    return;
                  }
                } catch {
                }
              }
            } catch {
            }
            try {
              document.body.innerHTML = "<pre>" + Le(l) + "</pre>";
            } catch {
            }
            return;
          }
        }
      } catch (o) {
        console.warn("[runtimeSitemap] fallback fetch failed", o);
      }
    }
    if (t) {
      if (a && Array.isArray(a.entries) && a.entries.length) {
        const c = Sn(a);
        try {
          try {
            document.open("application/xml", "replace");
          } catch {
            try {
              document.open();
            } catch {
            }
          }
          document.write(c), document.close();
          try {
            if (typeof Blob < "u" && typeof URL < "u" && URL.createObjectURL) {
              const o = new Blob([c], { type: "application/xml" }), l = URL.createObjectURL(o);
              try {
                location.href = l;
              } catch {
                try {
                  typeof window < "u" && window && typeof window.open == "function" && window.open(l, "_self");
                } catch {
                }
              }
              setTimeout(() => {
                try {
                  URL.revokeObjectURL(l);
                } catch {
                }
              }, 5e3);
            }
          } catch {
          }
        } catch {
          try {
            if (typeof location < "u" && location) {
              const l = "data:application/xml;charset=utf-8," + encodeURIComponent(c);
              try {
                location.href = l;
              } catch {
              }
            }
          } catch {
          }
          try {
            document.body.innerHTML = "<pre>" + Le(c) + "</pre>";
          } catch {
          }
        }
      } else
        s();
      return !0;
    }
    if (i) {
      if (a && Array.isArray(a.entries) && a.entries.length) {
        const c = Jn(a);
        try {
          try {
            document.open("application/rss+xml", "replace");
          } catch {
            try {
              document.open();
            } catch {
            }
          }
          document.write(c), document.close();
          try {
            if (typeof Blob < "u" && typeof URL < "u" && URL.createObjectURL) {
              const o = new Blob([c], { type: "application/rss+xml" }), l = URL.createObjectURL(o);
              try {
                location.href = l;
              } catch {
                try {
                  typeof window < "u" && window && typeof window.open == "function" && window.open(l, "_self");
                } catch {
                }
              }
              setTimeout(() => {
                try {
                  URL.revokeObjectURL(l);
                } catch {
                }
              }, 5e3);
            }
          } catch {
          }
        } catch {
          try {
            if (typeof location < "u" && location) {
              const l = "data:application/rss+xml;charset=utf-8," + encodeURIComponent(c);
              try {
                location.href = l;
              } catch {
              }
            }
          } catch {
          }
          try {
            document.body.innerHTML = "<pre>" + Le(c) + "</pre>";
          } catch {
          }
        }
      } else
        s("rss");
      return !0;
    }
    if (r) {
      if (a && Array.isArray(a.entries) && a.entries.length) {
        const c = er(a);
        try {
          try {
            document.open("application/atom+xml", "replace");
          } catch {
            try {
              document.open();
            } catch {
            }
          }
          document.write(c), document.close();
          try {
            if (typeof Blob < "u" && typeof URL < "u" && URL.createObjectURL) {
              const o = new Blob([c], { type: "application/atom+xml" }), l = URL.createObjectURL(o);
              try {
                location.href = l;
              } catch {
                try {
                  typeof window < "u" && window && typeof window.open == "function" && window.open(l, "_self");
                } catch {
                }
              }
              setTimeout(() => {
                try {
                  URL.revokeObjectURL(l);
                } catch {
                }
              }, 5e3);
            }
          } catch {
          }
        } catch {
          try {
            if (typeof location < "u" && location) {
              const l = "data:application/atom+xml;charset=utf-8," + encodeURIComponent(c);
              try {
                location.href = l;
              } catch {
              }
            }
          } catch {
          }
          try {
            document.body.innerHTML = "<pre>" + Le(c) + "</pre>";
          } catch {
          }
        }
      } else
        s("atom");
      return !0;
    }
    try {
      let c = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
      c += "<h1>Sitemap</h1><ul>";
      for (const o of a && a.entries || [])
        try {
          const l = String(o.loc || "");
          c += `<li><a href="${l}">${l}</a></li>`;
        } catch {
        }
      c += "</ul></body></html>";
      try {
        document.open(), document.write(c), document.close();
      } catch {
        try {
          document.body.innerHTML = c;
        } catch {
        }
      }
      return !0;
    } catch (c) {
      return console.warn("[runtimeSitemap] handleSitemapRequest failed to render", c), !1;
    }
  } catch (t) {
    return console.warn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attachSitemapDownloadUI: Qo,
  generateAtomXml: er,
  generateRssXml: Jn,
  generateSitemapJson: xn,
  generateSitemapXml: Sn,
  handleSitemapRequest: Xo
}, Symbol.toStringTag, { value: "Module" }));
export {
  ai as BAD_LANGUAGES,
  ue as SUPPORTED_HLJS_MAP,
  Jo as _clearHooks,
  tr as addHook,
  nl as default,
  Ta as ensureBulma,
  Fo as getVersion,
  nl as initCMS,
  ci as loadL10nFile,
  si as loadSupportedLanguages,
  Ra as observeCodeBlocks,
  Vo as onNavBuild,
  Ko as onPageLoad,
  Wt as registerLanguage,
  $r as runHooks,
  el as setHighlightTheme,
  ui as setLang,
  Ma as setStyle,
  tl as setThemeVars,
  $t as t,
  Yo as transformHtml
};
