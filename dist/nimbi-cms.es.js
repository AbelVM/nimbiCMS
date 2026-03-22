const sn = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function wr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(sn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  sn[e].push(t);
}
function pl(e) {
  wr("onPageLoad", e);
}
function gl(e) {
  wr("onNavBuild", e);
}
function ml(e) {
  wr("transformHtml", e);
}
async function Yr(e, t) {
  const n = sn[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function yl() {
  Object.keys(sn).forEach((e) => {
    sn[e].length = 0;
  });
}
function Ei(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Jn, Jr;
function Ua() {
  if (Jr) return Jn;
  Jr = 1;
  function e(k) {
    return k instanceof Map ? k.clear = k.delete = k.set = function() {
      throw new Error("map is read-only");
    } : k instanceof Set && (k.add = k.clear = k.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(k), Object.getOwnPropertyNames(k).forEach((L) => {
      const j = k[L], fe = typeof j;
      (fe === "object" || fe === "function") && !Object.isFrozen(j) && e(j);
    }), k;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(L) {
      L.data === void 0 && (L.data = {}), this.data = L.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(k) {
    return k.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(k, ...L) {
    const j = /* @__PURE__ */ Object.create(null);
    for (const fe in k)
      j[fe] = k[fe];
    return L.forEach(function(fe) {
      for (const $e in fe)
        j[$e] = fe[$e];
    }), /** @type {T} */
    j;
  }
  const r = "</span>", a = (k) => !!k.scope, s = (k, { prefix: L }) => {
    if (k.startsWith("language:"))
      return k.replace("language:", "language-");
    if (k.includes(".")) {
      const j = k.split(".");
      return [
        `${L}${j.shift()}`,
        ...j.map((fe, $e) => `${fe}${"_".repeat($e + 1)}`)
      ].join(" ");
    }
    return `${L}${k}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(L, j) {
      this.buffer = "", this.classPrefix = j.classPrefix, L.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(L) {
      this.buffer += n(L);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(L) {
      if (!a(L)) return;
      const j = s(
        L.scope,
        { prefix: this.classPrefix }
      );
      this.span(j);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(L) {
      a(L) && (this.buffer += r);
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
    span(L) {
      this.buffer += `<span class="${L}">`;
    }
  }
  const o = (k = {}) => {
    const L = { children: [] };
    return Object.assign(L, k), L;
  };
  class h {
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
    add(L) {
      this.top.children.push(L);
    }
    /** @param {string} scope */
    openNode(L) {
      const j = o({ scope: L });
      this.add(j), this.stack.push(j);
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
    walk(L) {
      return this.constructor._walk(L, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(L, j) {
      return typeof j == "string" ? L.addText(j) : j.children && (L.openNode(j), j.children.forEach((fe) => this._walk(L, fe)), L.closeNode(j)), L;
    }
    /**
     * @param {Node} node
     */
    static _collapse(L) {
      typeof L != "string" && L.children && (L.children.every((j) => typeof j == "string") ? L.children = [L.children.join("")] : L.children.forEach((j) => {
        h._collapse(j);
      }));
    }
  }
  class c extends h {
    /**
     * @param {*} options
     */
    constructor(L) {
      super(), this.options = L;
    }
    /**
     * @param {string} text
     */
    addText(L) {
      L !== "" && this.add(L);
    }
    /** @param {string} scope */
    startScope(L) {
      this.openNode(L);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(L, j) {
      const fe = L.root;
      j && (fe.scope = `language:${j}`), this.add(fe);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(k) {
    return k ? typeof k == "string" ? k : k.source : null;
  }
  function d(k) {
    return p("(?=", k, ")");
  }
  function g(k) {
    return p("(?:", k, ")*");
  }
  function m(k) {
    return p("(?:", k, ")?");
  }
  function p(...k) {
    return k.map((j) => u(j)).join("");
  }
  function y(k) {
    const L = k[k.length - 1];
    return typeof L == "object" && L.constructor === Object ? (k.splice(k.length - 1, 1), L) : {};
  }
  function f(...k) {
    return "(" + (y(k).capture ? "" : "?:") + k.map((fe) => u(fe)).join("|") + ")";
  }
  function w(k) {
    return new RegExp(k.toString() + "|").exec("").length - 1;
  }
  function b(k, L) {
    const j = k && k.exec(L);
    return j && j.index === 0;
  }
  const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function x(k, { joinWith: L }) {
    let j = 0;
    return k.map((fe) => {
      j += 1;
      const $e = j;
      let ze = u(fe), Y = "";
      for (; ze.length > 0; ) {
        const X = _.exec(ze);
        if (!X) {
          Y += ze;
          break;
        }
        Y += ze.substring(0, X.index), ze = ze.substring(X.index + X[0].length), X[0][0] === "\\" && X[1] ? Y += "\\" + String(Number(X[1]) + $e) : (Y += X[0], X[0] === "(" && j++);
      }
      return Y;
    }).map((fe) => `(${fe})`).join(L);
  }
  const S = /\b\B/, M = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", H = "\\b\\d+(\\.\\d+)?", B = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Z = "\\b(0b[01]+)", G = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", E = (k = {}) => {
    const L = /^#![ ]*\//;
    return k.binary && (k.begin = p(
      L,
      /.*\b/,
      k.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: L,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (j, fe) => {
        j.index !== 0 && fe.ignoreMatch();
      }
    }, k);
  }, T = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, ne = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, A = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, I = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, te = function(k, L, j = {}) {
    const fe = i(
      {
        scope: "comment",
        begin: k,
        end: L,
        contains: []
      },
      j
    );
    fe.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const $e = f(
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
    return fe.contains.push(
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
        begin: p(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          $e,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), fe;
  }, Le = te("//", "$"), J = te("/\\*", "\\*/"), ke = te("#", "$"), he = {
    scope: "number",
    begin: H,
    relevance: 0
  }, v = {
    scope: "number",
    begin: B,
    relevance: 0
  }, O = {
    scope: "number",
    begin: Z,
    relevance: 0
  }, N = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      T,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [T]
      }
    ]
  }, z = {
    scope: "title",
    begin: M,
    relevance: 0
  }, C = {
    scope: "title",
    begin: q,
    relevance: 0
  }, P = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + q,
    relevance: 0
  };
  var ie = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: ne,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: O,
    BINARY_NUMBER_RE: Z,
    COMMENT: te,
    C_BLOCK_COMMENT_MODE: J,
    C_LINE_COMMENT_MODE: Le,
    C_NUMBER_MODE: v,
    C_NUMBER_RE: B,
    END_SAME_AS_BEGIN: function(k) {
      return Object.assign(
        k,
        {
          /** @type {ModeCallback} */
          "on:begin": (L, j) => {
            j.data._beginMatch = L[1];
          },
          /** @type {ModeCallback} */
          "on:end": (L, j) => {
            j.data._beginMatch !== L[1] && j.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ke,
    IDENT_RE: M,
    MATCH_NOTHING_RE: S,
    METHOD_GUARD: P,
    NUMBER_MODE: he,
    NUMBER_RE: H,
    PHRASAL_WORDS_MODE: I,
    QUOTE_STRING_MODE: A,
    REGEXP_MODE: N,
    RE_STARTERS_RE: G,
    SHEBANG: E,
    TITLE_MODE: z,
    UNDERSCORE_IDENT_RE: q,
    UNDERSCORE_TITLE_MODE: C
  });
  function R(k, L) {
    k.input[k.index - 1] === "." && L.ignoreMatch();
  }
  function V(k, L) {
    k.className !== void 0 && (k.scope = k.className, delete k.className);
  }
  function ae(k, L) {
    L && k.beginKeywords && (k.begin = "\\b(" + k.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", k.__beforeBegin = R, k.keywords = k.keywords || k.beginKeywords, delete k.beginKeywords, k.relevance === void 0 && (k.relevance = 0));
  }
  function Ae(k, L) {
    Array.isArray(k.illegal) && (k.illegal = f(...k.illegal));
  }
  function me(k, L) {
    if (k.match) {
      if (k.begin || k.end) throw new Error("begin & end are not supported with match");
      k.begin = k.match, delete k.match;
    }
  }
  function le(k, L) {
    k.relevance === void 0 && (k.relevance = 1);
  }
  const de = (k, L) => {
    if (!k.beforeMatch) return;
    if (k.starts) throw new Error("beforeMatch cannot be used with starts");
    const j = Object.assign({}, k);
    Object.keys(k).forEach((fe) => {
      delete k[fe];
    }), k.keywords = j.keywords, k.begin = p(j.beforeMatch, d(j.begin)), k.starts = {
      relevance: 0,
      contains: [
        Object.assign(j, { endsParent: !0 })
      ]
    }, k.relevance = 0, delete j.beforeMatch;
  }, ge = [
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
  ], qe = "keyword";
  function ft(k, L, j = qe) {
    const fe = /* @__PURE__ */ Object.create(null);
    return typeof k == "string" ? $e(j, k.split(" ")) : Array.isArray(k) ? $e(j, k) : Object.keys(k).forEach(function(ze) {
      Object.assign(
        fe,
        ft(k[ze], L, ze)
      );
    }), fe;
    function $e(ze, Y) {
      L && (Y = Y.map((X) => X.toLowerCase())), Y.forEach(function(X) {
        const ce = X.split("|");
        fe[ce[0]] = [ze, st(ce[0], ce[1])];
      });
    }
  }
  function st(k, L) {
    return L ? Number(L) : Wn(k) ? 0 : 1;
  }
  function Wn(k) {
    return ge.includes(k.toLowerCase());
  }
  const Br = {}, At = (k) => {
    console.error(k);
  }, Nr = (k, ...L) => {
    console.log(`WARN: ${k}`, ...L);
  }, zt = (k, L) => {
    Br[`${k}/${L}`] || (console.log(`Deprecated as of ${k}. ${L}`), Br[`${k}/${L}`] = !0);
  }, yn = new Error();
  function Dr(k, L, { key: j }) {
    let fe = 0;
    const $e = k[j], ze = {}, Y = {};
    for (let X = 1; X <= L.length; X++)
      Y[X + fe] = $e[X], ze[X + fe] = !0, fe += w(L[X - 1]);
    k[j] = Y, k[j]._emit = ze, k[j]._multi = !0;
  }
  function ma(k) {
    if (Array.isArray(k.begin)) {
      if (k.skip || k.excludeBegin || k.returnBegin)
        throw At("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), yn;
      if (typeof k.beginScope != "object" || k.beginScope === null)
        throw At("beginScope must be object"), yn;
      Dr(k, k.begin, { key: "beginScope" }), k.begin = x(k.begin, { joinWith: "" });
    }
  }
  function ya(k) {
    if (Array.isArray(k.end)) {
      if (k.skip || k.excludeEnd || k.returnEnd)
        throw At("skip, excludeEnd, returnEnd not compatible with endScope: {}"), yn;
      if (typeof k.endScope != "object" || k.endScope === null)
        throw At("endScope must be object"), yn;
      Dr(k, k.end, { key: "endScope" }), k.end = x(k.end, { joinWith: "" });
    }
  }
  function ba(k) {
    k.scope && typeof k.scope == "object" && k.scope !== null && (k.beginScope = k.scope, delete k.scope);
  }
  function wa(k) {
    ba(k), typeof k.beginScope == "string" && (k.beginScope = { _wrap: k.beginScope }), typeof k.endScope == "string" && (k.endScope = { _wrap: k.endScope }), ma(k), ya(k);
  }
  function _a(k) {
    function L(Y, X) {
      return new RegExp(
        u(Y),
        "m" + (k.case_insensitive ? "i" : "") + (k.unicodeRegex ? "u" : "") + (X ? "g" : "")
      );
    }
    class j {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(X, ce) {
        ce.position = this.position++, this.matchIndexes[this.matchAt] = ce, this.regexes.push([ce, X]), this.matchAt += w(X) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const X = this.regexes.map((ce) => ce[1]);
        this.matcherRe = L(x(X, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(X) {
        this.matcherRe.lastIndex = this.lastIndex;
        const ce = this.matcherRe.exec(X);
        if (!ce)
          return null;
        const je = ce.findIndex((jt, Gn) => Gn > 0 && jt !== void 0), Be = this.matchIndexes[je];
        return ce.splice(0, je), Object.assign(ce, Be);
      }
    }
    class fe {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(X) {
        if (this.multiRegexes[X]) return this.multiRegexes[X];
        const ce = new j();
        return this.rules.slice(X).forEach(([je, Be]) => ce.addRule(je, Be)), ce.compile(), this.multiRegexes[X] = ce, ce;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(X, ce) {
        this.rules.push([X, ce]), ce.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(X) {
        const ce = this.getMatcher(this.regexIndex);
        ce.lastIndex = this.lastIndex;
        let je = ce.exec(X);
        if (this.resumingScanAtSamePosition() && !(je && je.index === this.lastIndex)) {
          const Be = this.getMatcher(0);
          Be.lastIndex = this.lastIndex + 1, je = Be.exec(X);
        }
        return je && (this.regexIndex += je.position + 1, this.regexIndex === this.count && this.considerAll()), je;
      }
    }
    function $e(Y) {
      const X = new fe();
      return Y.contains.forEach((ce) => X.addRule(ce.begin, { rule: ce, type: "begin" })), Y.terminatorEnd && X.addRule(Y.terminatorEnd, { type: "end" }), Y.illegal && X.addRule(Y.illegal, { type: "illegal" }), X;
    }
    function ze(Y, X) {
      const ce = (
        /** @type CompiledMode */
        Y
      );
      if (Y.isCompiled) return ce;
      [
        V,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        me,
        wa,
        de
      ].forEach((Be) => Be(Y, X)), k.compilerExtensions.forEach((Be) => Be(Y, X)), Y.__beforeBegin = null, [
        ae,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Ae,
        // default to 1 relevance if not specified
        le
      ].forEach((Be) => Be(Y, X)), Y.isCompiled = !0;
      let je = null;
      return typeof Y.keywords == "object" && Y.keywords.$pattern && (Y.keywords = Object.assign({}, Y.keywords), je = Y.keywords.$pattern, delete Y.keywords.$pattern), je = je || /\w+/, Y.keywords && (Y.keywords = ft(Y.keywords, k.case_insensitive)), ce.keywordPatternRe = L(je, !0), X && (Y.begin || (Y.begin = /\B|\b/), ce.beginRe = L(ce.begin), !Y.end && !Y.endsWithParent && (Y.end = /\B|\b/), Y.end && (ce.endRe = L(ce.end)), ce.terminatorEnd = u(ce.end) || "", Y.endsWithParent && X.terminatorEnd && (ce.terminatorEnd += (Y.end ? "|" : "") + X.terminatorEnd)), Y.illegal && (ce.illegalRe = L(
        /** @type {RegExp | string} */
        Y.illegal
      )), Y.contains || (Y.contains = []), Y.contains = [].concat(...Y.contains.map(function(Be) {
        return ka(Be === "self" ? Y : Be);
      })), Y.contains.forEach(function(Be) {
        ze(
          /** @type Mode */
          Be,
          ce
        );
      }), Y.starts && ze(Y.starts, X), ce.matcher = $e(ce), ce;
    }
    if (k.compilerExtensions || (k.compilerExtensions = []), k.contains && k.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return k.classNameAliases = i(k.classNameAliases || {}), ze(
      /** @type Mode */
      k
    );
  }
  function qr(k) {
    return k ? k.endsWithParent || qr(k.starts) : !1;
  }
  function ka(k) {
    return k.variants && !k.cachedVariants && (k.cachedVariants = k.variants.map(function(L) {
      return i(k, { variants: null }, L);
    })), k.cachedVariants ? k.cachedVariants : qr(k) ? i(k, { starts: k.starts ? i(k.starts) : null }) : Object.isFrozen(k) ? i(k) : k;
  }
  var xa = "11.11.1";
  class Sa extends Error {
    constructor(L, j) {
      super(L), this.name = "HTMLInjectionError", this.html = j;
    }
  }
  const Zn = n, jr = i, Hr = /* @__PURE__ */ Symbol("nomatch"), va = 7, Ur = function(k) {
    const L = /* @__PURE__ */ Object.create(null), j = /* @__PURE__ */ Object.create(null), fe = [];
    let $e = !0;
    const ze = "Could not find the language '{}', did you forget to load/include a language module?", Y = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let X = {
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
    function ce($) {
      return X.noHighlightRe.test($);
    }
    function je($) {
      let re = $.className + " ";
      re += $.parentNode ? $.parentNode.className : "";
      const xe = X.languageDetectRe.exec(re);
      if (xe) {
        const Re = mt(xe[1]);
        return Re || (Nr(ze.replace("{}", xe[1])), Nr("Falling back to no-highlight mode for this block.", $)), Re ? xe[1] : "no-highlight";
      }
      return re.split(/\s+/).find((Re) => ce(Re) || mt(Re));
    }
    function Be($, re, xe) {
      let Re = "", Ne = "";
      typeof re == "object" ? (Re = $, xe = re.ignoreIllegals, Ne = re.language) : (zt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), zt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Ne = $, Re = re), xe === void 0 && (xe = !0);
      const it = {
        code: Re,
        language: Ne
      };
      wn("before:highlight", it);
      const yt = it.result ? it.result : jt(it.language, it.code, xe);
      return yt.code = it.code, wn("after:highlight", yt), yt;
    }
    function jt($, re, xe, Re) {
      const Ne = /* @__PURE__ */ Object.create(null);
      function it(U, ee) {
        return U.keywords[ee];
      }
      function yt() {
        if (!pe.keywords) {
          He.addText(Te);
          return;
        }
        let U = 0;
        pe.keywordPatternRe.lastIndex = 0;
        let ee = pe.keywordPatternRe.exec(Te), ye = "";
        for (; ee; ) {
          ye += Te.substring(U, ee.index);
          const Me = lt.case_insensitive ? ee[0].toLowerCase() : ee[0], Ue = it(pe, Me);
          if (Ue) {
            const [pt, ja] = Ue;
            if (He.addText(ye), ye = "", Ne[Me] = (Ne[Me] || 0) + 1, Ne[Me] <= va && (xn += ja), pt.startsWith("_"))
              ye += ee[0];
            else {
              const Ha = lt.classNameAliases[pt] || pt;
              ot(ee[0], Ha);
            }
          } else
            ye += ee[0];
          U = pe.keywordPatternRe.lastIndex, ee = pe.keywordPatternRe.exec(Te);
        }
        ye += Te.substring(U), He.addText(ye);
      }
      function _n() {
        if (Te === "") return;
        let U = null;
        if (typeof pe.subLanguage == "string") {
          if (!L[pe.subLanguage]) {
            He.addText(Te);
            return;
          }
          U = jt(pe.subLanguage, Te, !0, Vr[pe.subLanguage]), Vr[pe.subLanguage] = /** @type {CompiledMode} */
          U._top;
        } else
          U = Qn(Te, pe.subLanguage.length ? pe.subLanguage : null);
        pe.relevance > 0 && (xn += U.relevance), He.__addSublanguage(U._emitter, U.language);
      }
      function Ke() {
        pe.subLanguage != null ? _n() : yt(), Te = "";
      }
      function ot(U, ee) {
        U !== "" && (He.startScope(ee), He.addText(U), He.endScope());
      }
      function Gr(U, ee) {
        let ye = 1;
        const Me = ee.length - 1;
        for (; ye <= Me; ) {
          if (!U._emit[ye]) {
            ye++;
            continue;
          }
          const Ue = lt.classNameAliases[U[ye]] || U[ye], pt = ee[ye];
          Ue ? ot(pt, Ue) : (Te = pt, yt(), Te = ""), ye++;
        }
      }
      function Qr(U, ee) {
        return U.scope && typeof U.scope == "string" && He.openNode(lt.classNameAliases[U.scope] || U.scope), U.beginScope && (U.beginScope._wrap ? (ot(Te, lt.classNameAliases[U.beginScope._wrap] || U.beginScope._wrap), Te = "") : U.beginScope._multi && (Gr(U.beginScope, ee), Te = "")), pe = Object.create(U, { parent: { value: pe } }), pe;
      }
      function Xr(U, ee, ye) {
        let Me = b(U.endRe, ye);
        if (Me) {
          if (U["on:end"]) {
            const Ue = new t(U);
            U["on:end"](ee, Ue), Ue.isMatchIgnored && (Me = !1);
          }
          if (Me) {
            for (; U.endsParent && U.parent; )
              U = U.parent;
            return U;
          }
        }
        if (U.endsWithParent)
          return Xr(U.parent, ee, ye);
      }
      function Oa(U) {
        return pe.matcher.regexIndex === 0 ? (Te += U[0], 1) : (Yn = !0, 0);
      }
      function Ba(U) {
        const ee = U[0], ye = U.rule, Me = new t(ye), Ue = [ye.__beforeBegin, ye["on:begin"]];
        for (const pt of Ue)
          if (pt && (pt(U, Me), Me.isMatchIgnored))
            return Oa(ee);
        return ye.skip ? Te += ee : (ye.excludeBegin && (Te += ee), Ke(), !ye.returnBegin && !ye.excludeBegin && (Te = ee)), Qr(ye, U), ye.returnBegin ? 0 : ee.length;
      }
      function Na(U) {
        const ee = U[0], ye = re.substring(U.index), Me = Xr(pe, U, ye);
        if (!Me)
          return Hr;
        const Ue = pe;
        pe.endScope && pe.endScope._wrap ? (Ke(), ot(ee, pe.endScope._wrap)) : pe.endScope && pe.endScope._multi ? (Ke(), Gr(pe.endScope, U)) : Ue.skip ? Te += ee : (Ue.returnEnd || Ue.excludeEnd || (Te += ee), Ke(), Ue.excludeEnd && (Te = ee));
        do
          pe.scope && He.closeNode(), !pe.skip && !pe.subLanguage && (xn += pe.relevance), pe = pe.parent;
        while (pe !== Me.parent);
        return Me.starts && Qr(Me.starts, U), Ue.returnEnd ? 0 : ee.length;
      }
      function Da() {
        const U = [];
        for (let ee = pe; ee !== lt; ee = ee.parent)
          ee.scope && U.unshift(ee.scope);
        U.forEach((ee) => He.openNode(ee));
      }
      let kn = {};
      function Kr(U, ee) {
        const ye = ee && ee[0];
        if (Te += U, ye == null)
          return Ke(), 0;
        if (kn.type === "begin" && ee.type === "end" && kn.index === ee.index && ye === "") {
          if (Te += re.slice(ee.index, ee.index + 1), !$e) {
            const Me = new Error(`0 width match regex (${$})`);
            throw Me.languageName = $, Me.badRule = kn.rule, Me;
          }
          return 1;
        }
        if (kn = ee, ee.type === "begin")
          return Ba(ee);
        if (ee.type === "illegal" && !xe) {
          const Me = new Error('Illegal lexeme "' + ye + '" for mode "' + (pe.scope || "<unnamed>") + '"');
          throw Me.mode = pe, Me;
        } else if (ee.type === "end") {
          const Me = Na(ee);
          if (Me !== Hr)
            return Me;
        }
        if (ee.type === "illegal" && ye === "")
          return Te += `
`, 1;
        if (Vn > 1e5 && Vn > ee.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Te += ye, ye.length;
      }
      const lt = mt($);
      if (!lt)
        throw At(ze.replace("{}", $)), new Error('Unknown language: "' + $ + '"');
      const qa = _a(lt);
      let Kn = "", pe = Re || qa;
      const Vr = {}, He = new X.__emitter(X);
      Da();
      let Te = "", xn = 0, Et = 0, Vn = 0, Yn = !1;
      try {
        if (lt.__emitTokens)
          lt.__emitTokens(re, He);
        else {
          for (pe.matcher.considerAll(); ; ) {
            Vn++, Yn ? Yn = !1 : pe.matcher.considerAll(), pe.matcher.lastIndex = Et;
            const U = pe.matcher.exec(re);
            if (!U) break;
            const ee = re.substring(Et, U.index), ye = Kr(ee, U);
            Et = U.index + ye;
          }
          Kr(re.substring(Et));
        }
        return He.finalize(), Kn = He.toHTML(), {
          language: $,
          value: Kn,
          relevance: xn,
          illegal: !1,
          _emitter: He,
          _top: pe
        };
      } catch (U) {
        if (U.message && U.message.includes("Illegal"))
          return {
            language: $,
            value: Zn(re),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: U.message,
              index: Et,
              context: re.slice(Et - 100, Et + 100),
              mode: U.mode,
              resultSoFar: Kn
            },
            _emitter: He
          };
        if ($e)
          return {
            language: $,
            value: Zn(re),
            illegal: !1,
            relevance: 0,
            errorRaised: U,
            _emitter: He,
            _top: pe
          };
        throw U;
      }
    }
    function Gn($) {
      const re = {
        value: Zn($),
        illegal: !1,
        relevance: 0,
        _top: Y,
        _emitter: new X.__emitter(X)
      };
      return re._emitter.addText($), re;
    }
    function Qn($, re) {
      re = re || X.languages || Object.keys(L);
      const xe = Gn($), Re = re.filter(mt).filter(Zr).map(
        (Ke) => jt(Ke, $, !1)
      );
      Re.unshift(xe);
      const Ne = Re.sort((Ke, ot) => {
        if (Ke.relevance !== ot.relevance) return ot.relevance - Ke.relevance;
        if (Ke.language && ot.language) {
          if (mt(Ke.language).supersetOf === ot.language)
            return 1;
          if (mt(ot.language).supersetOf === Ke.language)
            return -1;
        }
        return 0;
      }), [it, yt] = Ne, _n = it;
      return _n.secondBest = yt, _n;
    }
    function Aa($, re, xe) {
      const Re = re && j[re] || xe;
      $.classList.add("hljs"), $.classList.add(`language-${Re}`);
    }
    function Xn($) {
      let re = null;
      const xe = je($);
      if (ce(xe)) return;
      if (wn(
        "before:highlightElement",
        { el: $, language: xe }
      ), $.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", $);
        return;
      }
      if ($.children.length > 0 && (X.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn($)), X.throwUnescapedHTML))
        throw new Sa(
          "One of your code blocks includes unescaped HTML.",
          $.innerHTML
        );
      re = $;
      const Re = re.textContent, Ne = xe ? Be(Re, { language: xe, ignoreIllegals: !0 }) : Qn(Re);
      $.innerHTML = Ne.value, $.dataset.highlighted = "yes", Aa($, xe, Ne.language), $.result = {
        language: Ne.language,
        // TODO: remove with version 11.0
        re: Ne.relevance,
        relevance: Ne.relevance
      }, Ne.secondBest && ($.secondBest = {
        language: Ne.secondBest.language,
        relevance: Ne.secondBest.relevance
      }), wn("after:highlightElement", { el: $, result: Ne, text: Re });
    }
    function Ea($) {
      X = jr(X, $);
    }
    const La = () => {
      bn(), zt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Ma() {
      bn(), zt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Fr = !1;
    function bn() {
      function $() {
        bn();
      }
      if (document.readyState === "loading") {
        Fr || window.addEventListener("DOMContentLoaded", $, !1), Fr = !0;
        return;
      }
      document.querySelectorAll(X.cssSelector).forEach(Xn);
    }
    function Ca($, re) {
      let xe = null;
      try {
        xe = re(k);
      } catch (Re) {
        if (At("Language definition for '{}' could not be registered.".replace("{}", $)), $e)
          At(Re);
        else
          throw Re;
        xe = Y;
      }
      xe.name || (xe.name = $), L[$] = xe, xe.rawDefinition = re.bind(null, k), xe.aliases && Wr(xe.aliases, { languageName: $ });
    }
    function Ra($) {
      delete L[$];
      for (const re of Object.keys(j))
        j[re] === $ && delete j[re];
    }
    function Ta() {
      return Object.keys(L);
    }
    function mt($) {
      return $ = ($ || "").toLowerCase(), L[$] || L[j[$]];
    }
    function Wr($, { languageName: re }) {
      typeof $ == "string" && ($ = [$]), $.forEach((xe) => {
        j[xe.toLowerCase()] = re;
      });
    }
    function Zr($) {
      const re = mt($);
      return re && !re.disableAutodetect;
    }
    function Pa($) {
      $["before:highlightBlock"] && !$["before:highlightElement"] && ($["before:highlightElement"] = (re) => {
        $["before:highlightBlock"](
          Object.assign({ block: re.el }, re)
        );
      }), $["after:highlightBlock"] && !$["after:highlightElement"] && ($["after:highlightElement"] = (re) => {
        $["after:highlightBlock"](
          Object.assign({ block: re.el }, re)
        );
      });
    }
    function $a($) {
      Pa($), fe.push($);
    }
    function za($) {
      const re = fe.indexOf($);
      re !== -1 && fe.splice(re, 1);
    }
    function wn($, re) {
      const xe = $;
      fe.forEach(function(Re) {
        Re[xe] && Re[xe](re);
      });
    }
    function Ia($) {
      return zt("10.7.0", "highlightBlock will be removed entirely in v12.0"), zt("10.7.0", "Please use highlightElement now."), Xn($);
    }
    Object.assign(k, {
      highlight: Be,
      highlightAuto: Qn,
      highlightAll: bn,
      highlightElement: Xn,
      // TODO: Remove with v12 API
      highlightBlock: Ia,
      configure: Ea,
      initHighlighting: La,
      initHighlightingOnLoad: Ma,
      registerLanguage: Ca,
      unregisterLanguage: Ra,
      listLanguages: Ta,
      getLanguage: mt,
      registerAliases: Wr,
      autoDetection: Zr,
      inherit: jr,
      addPlugin: $a,
      removePlugin: za
    }), k.debugMode = function() {
      $e = !1;
    }, k.safeMode = function() {
      $e = !0;
    }, k.versionString = xa, k.regex = {
      concat: p,
      lookahead: d,
      either: f,
      optional: m,
      anyNumberOfTimes: g
    };
    for (const $ in ie)
      typeof ie[$] == "object" && e(ie[$]);
    return Object.assign(k, ie), k;
  }, It = Ur({});
  return It.newInstance = () => Ur({}), Jn = It, It.HighlightJS = It, It.default = It, Jn;
}
var Fa = /* @__PURE__ */ Ua();
const Ee = /* @__PURE__ */ Ei(Fa), Wa = "11.11.1", we = /* @__PURE__ */ new Map(), Za = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Ye = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Ye.html = "xml";
Ye.xhtml = "xml";
Ye.markup = "xml";
const Li = /* @__PURE__ */ new Set(["magic", "undefined"]);
let kt = null;
const er = /* @__PURE__ */ new Map(), Ga = 300 * 1e3;
async function Mi(e = Za) {
  if (e)
    return kt || (kt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let h = 0; h < i.length; h++)
          if (/\|\s*Language\s*\|/i.test(i[h])) {
            r = h;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((h) => h.trim().toLowerCase());
        let s = a.findIndex((h) => /alias|aliases|equivalent|alt|alternates?/i.test(h));
        s === -1 && (s = 1);
        let l = a.findIndex((h) => /file|filename|module|module name|module-name|short|slug/i.test(h));
        if (l === -1) {
          const h = a.findIndex((c) => /language/i.test(c));
          l = h !== -1 ? h : 0;
        }
        let o = [];
        for (let h = r + 1; h < i.length; h++) {
          const c = i[h].trim();
          if (!c || !c.startsWith("|")) break;
          const u = c.replace(/^\||\|$/g, "").split("|").map((y) => y.trim());
          if (u.every((y) => /^-+$/.test(y))) continue;
          const d = u;
          if (!d.length) continue;
          const m = (d[l] || d[0] || "").toString().trim().toLowerCase();
          if (!m || /^-+$/.test(m)) continue;
          we.set(m, m);
          const p = d[s] || "";
          if (p) {
            const y = String(p).split(",").map((f) => f.replace(/`/g, "").trim()).filter(Boolean);
            if (y.length) {
              const w = y[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (we.set(w, w), o.push(w));
            }
          }
        }
        try {
          const h = [];
          for (const c of o) {
            const u = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? h.push(u) : we.delete(c);
          }
          o = h;
        } catch (h) {
          console.warn("[codeblocksManager] cleanup aliases failed", h);
        }
        try {
          let h = 0;
          for (const c of Array.from(we.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              we.delete(c), h++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const d = we.get(c);
                we.delete(c), we.set(u, d);
              } else
                we.delete(c), h++;
            }
          }
          for (const [c, u] of Array.from(we.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (we.delete(c), h++);
          try {
            const c = ":---------------------";
            we.has(c) && (we.delete(c), h++);
          } catch (c) {
            console.warn("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(we.keys()).sort();
          } catch (c) {
            console.warn("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (h) {
          console.warn("[codeblocksManager] ignored error", h);
        }
      } catch (t) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), kt);
}
const Ht = /* @__PURE__ */ new Set();
async function on(e, t) {
  if (kt || (async () => {
    try {
      await Mi();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), kt)
    try {
      await kt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Li.has(n)) return !1;
  if (we.size && !we.has(n)) {
    const r = Ye;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Ht.has(e)) return !0;
  const i = Ye;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let l = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((c) => String(c).toLowerCase()).filter((c) => c && c !== "undefined");
    we.size && (l = l.filter((c) => {
      if (we.has(c)) return !0;
      const u = Ye[c];
      return !!(u && we.has(u));
    }));
    let o = null, h = null;
    for (const c of l)
      try {
        const u = Date.now();
        let d = er.get(c);
        if (d && d.ok === !1 && u - (d.ts || 0) >= Ga && (er.delete(c), d = void 0), d) {
          if (d.module)
            o = d.module;
          else if (d.promise)
            try {
              o = await d.promise;
            } catch {
              o = null;
            }
        } else {
          const g = { promise: null, module: null, ok: null, ts: 0 };
          er.set(c, g), g.promise = (async () => {
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
                  const p = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(p);
                } catch {
                  try {
                    const y = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(y);
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
            o = await g.promise, g.module = o, g.ok = !!o, g.ts = Date.now();
          } catch {
            g.module = null, g.ok = !1, g.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const g = o.default || o;
          try {
            const m = we.size && we.get(e) || c || e;
            return Ee.registerLanguage(m, g), Ht.add(m), m !== e && (Ee.registerLanguage(e, g), Ht.add(e)), !0;
          } catch (m) {
            h = m;
          }
        } else
          try {
            if (we.has(c) || we.has(e)) {
              const g = () => ({});
              try {
                Ee.registerLanguage(c, g), Ht.add(c);
              } catch {
              }
              try {
                c !== e && (Ee.registerLanguage(e, g), Ht.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        h = u;
      }
    if (h)
      throw h;
    return !1;
  } catch {
    return !1;
  }
}
let Sn = null;
function Qa(e = document) {
  kt || (async () => {
    try {
      await Mi();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = Ye, i = Sn || (typeof IntersectionObserver > "u" ? null : (Sn = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (h) {
        console.warn("[codeblocksManager] observer unobserve failed", h);
      }
      (async () => {
        try {
          const h = o.getAttribute && o.getAttribute("class") || o.className || "", c = h.match(/language-([a-zA-Z0-9_+-]+)/) || h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const u = (c[1] || "").toLowerCase(), d = t[u] || u, g = we.size && (we.get(d) || we.get(String(d).toLowerCase())) || d;
            try {
              await on(g);
            } catch (m) {
              console.warn("[codeblocksManager] registerLanguage failed", m);
            }
            try {
              try {
                const m = o.textContent || o.innerText || "";
                m != null && (o.textContent = m);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              Ee.highlightElement(o);
            } catch (m) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", m);
            }
          } else
            try {
              const u = o.textContent || "";
              try {
                if (Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext")) {
                  const d = Ee.highlight(u, { language: "plaintext" });
                  d && d.value && (o.innerHTML = d.value);
                }
              } catch {
                try {
                  Ee.highlightElement(o);
                } catch (g) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", g);
                }
              }
            } catch (u) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (h) {
          console.warn("[codeblocksManager] observer entry processing failed", h);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Sn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), h = t[o] || o, c = we.size && (we.get(h) || we.get(String(h).toLowerCase())) || h;
          try {
            await on(c);
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
          Ee.highlightElement(a);
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
function bl(e, { useCdn: t = !0 } = {}) {
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
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${Wa}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let Lt = "light";
function Xa(e, t = {}) {
  if (document.querySelector(`link[href="${e}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = e, Object.entries(t).forEach(([i, r]) => n.setAttribute(i, r)), document.head.appendChild(n), t["data-bulmaswatch-theme"])
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
function ei() {
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
async function Ka(e = "none", t = "/") {
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
        const h = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        h && h.parentNode ? h.parentNode.insertBefore(o, h) : document.head.appendChild(o);
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
    if (ei(), document.querySelector("style[data-bulma-override]")) return;
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
    const a = String(e).trim();
    if (!a) return;
    ei();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    Xa(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function Va(e) {
  Lt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Lt === "dark" ? n.setAttribute("data-theme", "dark") : Lt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Lt === "dark" ? n.setAttribute("data-theme", "dark") : Lt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function wl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Ci(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Lt === "dark" ? t.setAttribute("data-theme", "dark") : Lt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Ri = {
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
}, Bt = JSON.parse(JSON.stringify(Ri));
let $n = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  $n = String(e).split("-")[0].toLowerCase();
}
Ri[$n] || ($n = "en");
let St = $n;
function Zt(e, t = {}) {
  const n = Bt[St] || Bt.en;
  let i = n && n[e] ? n[e] : Bt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Ti(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Bt[a] = Object.assign({}, Bt[a] || {}, r[a]);
  } catch {
  }
}
function Pi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  St = Bt[t] ? t : "en";
}
const Ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return St;
  },
  loadL10nFile: Ti,
  setLang: Pi,
  t: Zt
}, Symbol.toStringTag, { value: "Module" }));
function $i(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
function oe(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}
function Dt(e) {
  return String(e || "").replace(/\/+$/, "");
}
function Pt(e) {
  return Dt(e) + "/";
}
function Ja(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    console.warn("[helpers] preloadImage failed", t);
  }
}
function vn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = l - s);
    let d = 0.6;
    try {
      const y = r && window.getComputedStyle ? window.getComputedStyle(r) : null, f = y && y.getPropertyValue("--nimbi-image-max-height-ratio"), w = f ? parseFloat(f) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (d = w);
    } catch (y) {
      console.warn("[helpers] read CSS ratio failed", y);
    }
    const g = Math.max(200, Math.floor(u * d));
    let m = !1, p = null;
    if (i.forEach((y) => {
      try {
        const f = y.getAttribute ? y.getAttribute("loading") : void 0;
        f !== "eager" && y.setAttribute && y.setAttribute("loading", "lazy");
        const w = y.getBoundingClientRect ? y.getBoundingClientRect() : null, b = y.src || y.getAttribute && y.getAttribute("src"), _ = w && w.height > 1 ? w.height : g, x = w ? w.top : 0, S = x + _;
        w && _ > 0 && x <= c && S >= o && (y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high"), Ja(b), m = !0), !p && w && w.top <= c && (p = { img: y, src: b, rect: w, beforeLoading: f });
      } catch (f) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", f);
      }
    }), !m && p) {
      const { img: y, src: f, rect: w, beforeLoading: b } = p;
      try {
        y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high");
      } catch (_) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", _);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Ce(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [h, c] of r.entries())
      s.append(h, c);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
function zn(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = zn);
} catch (e) {
  console.warn("[helpers] global attach failed", e);
}
function es(e) {
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
function ts(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function ti(e, t = null, n = void 0) {
  let r = "#/" + ts(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = Je(location.href);
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
function Je(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const h = t.hash.replace(/^#/, "");
        if (h.includes("&")) {
          const c = h.split("&");
          r = c.shift() || null, a = c.join("&");
        } else
          r = h || null;
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
        const h = r.split("?");
        r = h.shift() || "", a = h.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const h = s.split("#");
        s = h.shift() || "", l = h.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const ns = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function rs(e, t = "worker") {
  let n = null;
  const i = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function r(...h) {
    try {
      i && console && typeof console.warn == "function" && console.warn(...h);
    } catch {
    }
  }
  function a() {
    if (!n)
      try {
        const h = e();
        n = h || null, h && h.addEventListener("error", () => {
          try {
            n === h && (n = null, h.terminate && h.terminate());
          } catch (c) {
            r("[" + t + "] worker termination failed", c);
          }
        });
      } catch (h) {
        n = null, r("[" + t + "] worker init failed", h);
      }
    return n;
  }
  function s() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (h) {
      r("[" + t + "] worker termination failed", h);
    }
  }
  function l(h, c = 1e4) {
    return new Promise((u, d) => {
      const g = a();
      if (!g) return d(new Error("worker unavailable"));
      const m = String(Math.random()), p = Object.assign({}, h, { id: m });
      let y = null;
      const f = () => {
        y && clearTimeout(y), g.removeEventListener("message", w), g.removeEventListener("error", b);
      }, w = (_) => {
        const x = _.data || {};
        x.id === m && (f(), x.error ? d(new Error(x.error)) : u(x.result));
      }, b = (_) => {
        f(), r("[" + t + "] worker error event", _);
        try {
          n === g && (n = null, g.terminate && g.terminate());
        } catch (x) {
          r("[" + t + "] worker termination failed", x);
        }
        d(new Error(_ && _.message || "worker error"));
      };
      y = setTimeout(() => {
        f(), r("[" + t + "] worker timed out");
        try {
          n === g && (n = null, g.terminate && g.terminate());
        } catch (_) {
          r("[" + t + "] worker termination on timeout failed", _);
        }
        d(new Error("worker timeout"));
      }, c), g.addEventListener("message", w), g.addEventListener("error", b);
      try {
        g.postMessage(p);
      } catch (_) {
        f(), d(_);
      }
    });
  }
  return { get: a, send: l, terminate: s };
}
function zi(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  const a = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function s(...p) {
    try {
      a && console && typeof console.warn == "function" && console.warn(...p);
    } catch {
    }
  }
  function l(p) {
    if (!i[p])
      try {
        const y = e();
        i[p] = y || null, y && y.addEventListener("error", () => {
          try {
            i[p] === y && (i[p] = null, y.terminate && y.terminate());
          } catch (f) {
            s("[" + t + "] worker termination failed", f);
          }
        });
      } catch (y) {
        i[p] = null, s("[" + t + "] worker init failed", y);
      }
    return i[p];
  }
  const o = new Array(n).fill(0), h = new Array(n).fill(null), c = 30 * 1e3;
  function u(p) {
    try {
      o[p] = Date.now(), h[p] && (clearTimeout(h[p]), h[p] = null), h[p] = setTimeout(() => {
        try {
          i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
        } catch (y) {
          s("[" + t + "] idle termination failed", y);
        }
        h[p] = null;
      }, c);
    } catch {
    }
  }
  function d() {
    for (let p = 0; p < i.length; p++) {
      const y = l(p);
      if (y) return y;
    }
    return null;
  }
  function g() {
    for (let p = 0; p < i.length; p++)
      try {
        i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
      } catch (y) {
        s("[" + t + "] worker termination failed", y);
      }
  }
  function m(p, y = 1e4) {
    return new Promise((f, w) => {
      const b = r++ % i.length, _ = (x) => {
        const S = (b + x) % i.length, M = l(S);
        if (!M)
          return x + 1 < i.length ? _(x + 1) : w(new Error("worker pool unavailable"));
        const q = String(Math.random()), H = Object.assign({}, p, { id: q });
        let B = null;
        const Z = () => {
          B && clearTimeout(B), M.removeEventListener("message", G), M.removeEventListener("error", E);
        }, G = (T) => {
          const ne = T.data || {};
          ne.id === q && (Z(), ne.error ? w(new Error(ne.error)) : f(ne.result));
        }, E = (T) => {
          Z(), s("[" + t + "] worker error event", T);
          try {
            i[S] === M && (i[S] = null, M.terminate && M.terminate());
          } catch (ne) {
            s("[" + t + "] worker termination failed", ne);
          }
          w(new Error(T && T.message || "worker error"));
        };
        B = setTimeout(() => {
          Z(), s("[" + t + "] worker timed out");
          try {
            i[S] === M && (i[S] = null, M.terminate && M.terminate());
          } catch (T) {
            s("[" + t + "] worker termination on timeout failed", T);
          }
          w(new Error("worker timeout"));
        }, y), M.addEventListener("message", G), M.addEventListener("error", E);
        try {
          u(S), M.postMessage(H);
        } catch (T) {
          Z(), w(T);
        }
      };
      _(0);
    });
  }
  return { get: d, send: m, terminate: g };
}
function Qt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Qt._blobUrlCache || (Qt._blobUrlCache = /* @__PURE__ */ new Map());
        const t = Qt._blobUrlCache;
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
const Xe = /* @__PURE__ */ new Set();
function Nt(e) {
  is(), Xe.clear();
  for (const t of Pe)
    t && Xe.add(t);
  ni(Q), ni(D), Nt._refreshed = !0;
}
function ni(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && Xe.add(t);
}
function ri(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && Xe.add(i), t.call(this, n, i);
  };
}
let ii = !1;
function is() {
  ii || (ri(Q), ri(D), ii = !0);
}
const Q = /* @__PURE__ */ new Map();
let Ge = [], _r = !1;
function as(e) {
  _r = !!e;
}
function Ii(e) {
  Ge = Array.isArray(e) ? e.slice() : [];
}
function ss() {
  return Ge;
}
const ln = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Oi = zi(() => Qt(ns), "slugManager", ln);
function ue(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.log(...e);
  } catch {
  }
}
function os() {
  try {
    if (typeof window < "u" && window.__nimbiCMSDebug) return !0;
  } catch {
  }
  try {
    return !!(typeof K == "string" && K);
  } catch {
    return !1;
  }
}
function ls() {
  return Oi.get();
}
function Bi(e) {
  return Oi.send(e, 5e3);
}
async function or(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => Tt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Bi({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function cs(e, t, n) {
  const i = await Promise.resolve().then(() => Tt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Bi({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function bt(e, t) {
  if (e)
    if (Ge && Ge.length) {
      const i = t.split("/")[0], r = Ge.includes(i);
      let a = Q.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, Q.set(e, a);
    } else
      Q.set(e, t);
}
const qn = /* @__PURE__ */ new Set();
function us(e) {
  typeof e == "function" && qn.add(e);
}
function hs(e) {
  typeof e == "function" && qn.delete(e);
}
const D = /* @__PURE__ */ new Map();
let lr = {}, Pe = [], K = "_404.md", et = null;
const kr = "_home";
function Ni(e) {
  if (e == null) {
    K = null;
    return;
  }
  K = String(e || "");
}
function Di(e) {
  if (e == null) {
    et = null;
    return;
  }
  et = String(e || "");
}
function ds(e) {
  lr = e || {};
}
function qi(e) {
  try {
    if (Array.isArray(F) || (F = []), !Array.isArray(e)) return;
    try {
      Array.isArray(F) || (F = []), F.length = 0;
      for (const t of e) F.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = F;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      ue("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        F = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const Xt = /* @__PURE__ */ new Map(), In = /* @__PURE__ */ new Set();
function fs() {
  Xt.clear(), In.clear();
}
function ps(e) {
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
function xr(e) {
  Q.clear(), D.clear(), Pe = [], Ge = Ge || [];
  const t = Object.keys(lr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), ue("[slugManager] parse contentBase failed", i);
      }
      n = Pt(n);
    }
  } catch (i) {
    n = "", ue("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = ps(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = oe(i.slice(n.length)) : r = oe(i), Pe.push(r);
    try {
      Nt();
    } catch (s) {
      ue("[slugManager] refreshIndexPaths failed", s);
    }
    const a = lr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = _e(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!Ge || !Ge.length) && (o = ji(o, new Set(Q.keys()))), Ge && Ge.length) {
              const c = r.split("/")[0], u = Ge.includes(c);
              let d = Q.get(o);
              (!d || typeof d == "string") && (d = { default: typeof d == "string" ? d : void 0, langs: {} }), u ? d.langs[c] = r : d.default = r, Q.set(o, d);
            } else
              Q.set(o, r);
            D.set(r, o);
          } catch (o) {
            ue("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  xr();
} catch (e) {
  ue("[slugManager] initial setContentBase failed", e);
}
function _e(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function ji(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function gs(e) {
  return fn(e, void 0);
}
function fn(e, t) {
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
function Cn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function pn(e) {
  if (!e || !Q.has(e)) return null;
  const t = Q.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (Ge && Ge.length && St && t.langs && t.langs[St])
    return t.langs[St];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Kt = /* @__PURE__ */ new Map();
function ms() {
  Kt.clear();
}
let Se = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const l = Je(e);
        l && l.page && (e = l.page);
      } catch {
      }
  } catch {
  }
  try {
    const l = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (l && Q.has(l)) {
      const o = pn(l) || Q.get(l);
      o && o !== e && (e = o);
    }
  } catch (l) {
    ue("[slugManager] slug mapping normalization failed", l);
  }
  if (!(n && n.force === !0 || typeof K == "string" && K || Q && Q.size || Pe && Pe.length || typeof globalThis < "u" && globalThis.__nimbiCMSDebug))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : Dt(String(t));
  let a = "";
  try {
    const l = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (r && r.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(r)) {
      const o = r.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
      a = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + o;
    } else {
      let o = l + "/";
      r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? o = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? o = l + r.replace(/\/$/, "") + "/" : o = l + "/" + r.replace(/\/$/, "") + "/"), a = new URL(e.replace(/^\//, ""), o).toString();
    }
  } catch {
    a = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  if (Kt.has(a))
    return Kt.get(a);
  const s = (async () => {
    const l = await fetch(a);
    if (!l || typeof l.ok != "boolean" || !l.ok) {
      if (l && l.status === 404 && typeof K == "string" && K)
        try {
          const g = `${r}/${K}`, m = await globalThis.fetch(g);
          if (m && typeof m.ok == "boolean" && m.ok)
            return { raw: await m.text(), status: 404 };
        } catch (g) {
          ue("[slugManager] fetching fallback 404 failed", g);
        }
      let d = "";
      try {
        l && typeof l.clone == "function" ? d = await l.clone().text() : l && typeof l.text == "function" ? d = await l.text() : d = "";
      } catch (g) {
        d = "", ue("[slugManager] reading error body failed", g);
      }
      try {
        const g = l ? l.status : void 0;
        if (g === 404)
          try {
            console && typeof console.warn == "function" && console.warn("fetchMarkdown failed (404):", { url: a, status: g, statusText: l ? l.statusText : void 0, body: d.slice(0, 200) });
          } catch {
          }
        else
          try {
            console && typeof console.error == "function" && console.error("fetchMarkdown failed:", { url: a, status: g, statusText: l ? l.statusText : void 0, body: d.slice(0, 200) });
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const o = await l.text(), h = o.trim().slice(0, 128).toLowerCase(), c = /^(?:<!doctype|<html|<title|<h1)/.test(h), u = c || String(e || "").toLowerCase().endsWith(".html");
    if (c && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof K == "string" && K) {
          const d = `${r}/${K}`, g = await globalThis.fetch(d);
          if (g.ok)
            return { raw: await g.text(), status: 404 };
        }
      } catch (d) {
        ue("[slugManager] fetching fallback 404 failed", d);
      }
      throw os() && console.error("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return u ? { raw: o, isHtml: !0 } : { raw: o };
  })();
  return Kt.set(a, s), s;
};
function ys(e) {
  typeof e == "function" && (Se = e);
}
const Rn = /* @__PURE__ */ new Map();
function bs(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let F = [];
function ws() {
  return F;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return F;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = F;
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
          return cr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = cr;
      } catch {
      }
    }
} catch {
}
let _t = null;
async function Ct(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => oe(String(a || ""))))) : [];
  try {
    const a = oe(String(K || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (F && F.length && t === 1 && !F.some((s) => {
    try {
      return r.includes(oe(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return F;
  if (_t) return _t;
  _t = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((p) => oe(String(p || ""))))) : [];
    try {
      const p = oe(String(K || ""));
      p && !a.includes(p) && a.push(p);
    } catch {
    }
    const s = (p) => {
      if (!a || !a.length) return !1;
      for (const y of a)
        if (y && (p === y || p.startsWith(y + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const p of i)
          try {
            const y = oe(String(p || ""));
            y && l.push(y);
          } catch {
          }
    } catch {
    }
    if (Pe && Pe.length && (l = Array.from(Pe)), !l.length)
      for (const p of Q.values())
        p && l.push(p);
    try {
      const p = await Zi(e);
      p && p.length && (l = l.concat(p));
    } catch (p) {
      ue("[slugManager] crawlAllMarkdown during buildSearchIndex failed", p);
    }
    try {
      const p = new Set(l), y = [...l], f = Math.max(1, ln), w = async () => {
        for (; !(p.size > gn); ) {
          const _ = y.shift();
          if (!_) break;
          try {
            const x = await Se(_, e);
            if (x && x.raw) {
              if (x.status === 404) continue;
              let S = x.raw;
              const M = [], q = String(_ || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(q) && _r && (!_ || !_.includes("/")))
                continue;
              const H = bs(S), B = /\[[^\]]+\]\(([^)]+)\)/g;
              let Z;
              for (; Z = B.exec(H); )
                M.push(Z[1]);
              const G = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; Z = G.exec(H); )
                M.push(Z[1]);
              const E = _ && _.includes("/") ? _.substring(0, _.lastIndexOf("/") + 1) : "";
              for (let T of M)
                try {
                  if (fn(T, e) || T.startsWith("..") || T.indexOf("/../") !== -1 || (E && !T.startsWith("./") && !T.startsWith("/") && !T.startsWith("../") && (T = E + T), T = oe(T), !/\.(md|html?)(?:$|[?#])/i.test(T)) || (T = T.split(/[?#]/)[0], s(T))) continue;
                  p.has(T) || (p.add(T), y.push(T), l.push(T));
                } catch (ne) {
                  ue("[slugManager] href processing failed", T, ne);
                }
            }
          } catch (x) {
            ue("[slugManager] discovery fetch failed for", _, x);
          }
        }
      }, b = [];
      for (let _ = 0; _ < f; _++) b.push(w());
      await Promise.all(b);
    } catch (p) {
      ue("[slugManager] discovery loop failed", p);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((p) => !p || o.has(p) || s(p) ? !1 : (o.add(p), !0));
    const h = [], c = /* @__PURE__ */ new Map(), u = l.filter((p) => /\.(?:md|html?)(?:$|[?#])/i.test(p)), d = Math.max(1, Math.min(ln, u.length || 1)), g = u.slice(), m = [];
    for (let p = 0; p < d; p++)
      m.push((async () => {
        for (; g.length; ) {
          const y = g.shift();
          if (!y) break;
          try {
            const f = await Se(y, e);
            c.set(y, f);
          } catch (f) {
            ue("[slugManager] buildSearchIndex: entry fetch failed", y, f), c.set(y, null);
          }
        }
      })());
    await Promise.all(m);
    for (const p of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(p))
        try {
          const y = c.get(p);
          if (!y || !y.raw || y.status === 404) continue;
          let f = "", w = "";
          if (y.isHtml)
            try {
              const x = new DOMParser().parseFromString(y.raw, "text/html"), S = x.querySelector("title") || x.querySelector("h1");
              S && S.textContent && (f = S.textContent.trim());
              const M = x.querySelector("p");
              if (M && M.textContent && (w = M.textContent.trim()), t >= 2)
                try {
                  const q = x.querySelector("h1"), H = q && q.textContent ? q.textContent.trim() : f || "", B = (() => {
                    try {
                      if (D.has(p)) return D.get(p);
                    } catch {
                    }
                    return _e(f || p);
                  })(), Z = Array.from(x.querySelectorAll("h2"));
                  for (const G of Z)
                    try {
                      const E = (G.textContent || "").trim();
                      if (!E) continue;
                      const T = G.id ? G.id : _e(E), ne = B ? `${B}::${T}` : `${_e(p)}::${T}`;
                      let A = "", I = G.nextElementSibling;
                      for (; I && I.tagName && I.tagName.toLowerCase() === "script"; ) I = I.nextElementSibling;
                      I && I.textContent && (A = String(I.textContent).trim()), h.push({ slug: ne, title: E, excerpt: A, path: p, parentTitle: H });
                    } catch (E) {
                      ue("[slugManager] indexing H2 failed", E);
                    }
                  if (t === 3)
                    try {
                      const G = Array.from(x.querySelectorAll("h3"));
                      for (const E of G)
                        try {
                          const T = (E.textContent || "").trim();
                          if (!T) continue;
                          const ne = E.id ? E.id : _e(T), A = B ? `${B}::${ne}` : `${_e(p)}::${ne}`;
                          let I = "", te = E.nextElementSibling;
                          for (; te && te.tagName && te.tagName.toLowerCase() === "script"; ) te = te.nextElementSibling;
                          te && te.textContent && (I = String(te.textContent).trim()), h.push({ slug: A, title: T, excerpt: I, path: p, parentTitle: H });
                        } catch (T) {
                          ue("[slugManager] indexing H3 failed", T);
                        }
                    } catch (G) {
                      ue("[slugManager] collect H3s failed", G);
                    }
                } catch (q) {
                  ue("[slugManager] collect H2s failed", q);
                }
            } catch (_) {
              ue("[slugManager] parsing HTML for index failed", _);
            }
          else {
            const _ = y.raw, x = _.match(/^#\s+(.+)$/m);
            f = x ? x[1].trim() : "";
            try {
              f = Cn(f);
            } catch {
            }
            const S = _.split(/\r?\n\s*\r?\n/);
            if (S.length > 1)
              for (let M = 1; M < S.length; M++) {
                const q = S[M].trim();
                if (q && !/^#/.test(q)) {
                  w = q.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let M = "", q = "";
              try {
                const H = (_.match(/^#\s+(.+)$/m) || [])[1];
                M = H ? H.trim() : "", q = (function() {
                  try {
                    if (D.has(p)) return D.get(p);
                  } catch {
                  }
                  return _e(f || p);
                })();
                const B = /^##\s+(.+)$/gm;
                let Z;
                for (; Z = B.exec(_); )
                  try {
                    const G = (Z[1] || "").trim(), E = Cn(G);
                    if (!G) continue;
                    const T = _e(G), ne = q ? `${q}::${T}` : `${_e(p)}::${T}`, I = _.slice(B.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), te = I && I[1] ? String(I[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    h.push({ slug: ne, title: E, excerpt: te, path: p, parentTitle: M });
                  } catch (G) {
                    ue("[slugManager] indexing markdown H2 failed", G);
                  }
              } catch (H) {
                ue("[slugManager] collect markdown H2s failed", H);
              }
              if (t === 3)
                try {
                  const H = /^###\s+(.+)$/gm;
                  let B;
                  for (; B = H.exec(_); )
                    try {
                      const Z = (B[1] || "").trim(), G = Cn(Z);
                      if (!Z) continue;
                      const E = _e(Z), T = q ? `${q}::${E}` : `${_e(p)}::${E}`, A = _.slice(H.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), I = A && A[1] ? String(A[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      h.push({ slug: T, title: G, excerpt: I, path: p, parentTitle: M });
                    } catch (Z) {
                      ue("[slugManager] indexing markdown H3 failed", Z);
                    }
                } catch (H) {
                  ue("[slugManager] collect markdown H3s failed", H);
                }
            }
          }
          let b = "";
          try {
            D.has(p) && (b = D.get(p));
          } catch (_) {
            ue("[slugManager] mdToSlug access failed", _);
          }
          b || (b = _e(f || p)), h.push({ slug: b, title: f, excerpt: w, path: p });
        } catch (y) {
          ue("[slugManager] buildSearchIndex: entry processing failed", y);
        }
    try {
      const p = h.filter((y) => {
        try {
          return !s(String(y.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(F) || (F = []), F.length = 0;
        for (const y of p) F.push(y);
      } catch {
        try {
          F = Array.from(p);
        } catch {
          F = p;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = F;
          } catch {
          }
          try {
            const y = [], f = /* @__PURE__ */ new Set();
            for (const w of F)
              try {
                if (!w || !w.slug) continue;
                const b = String(w.slug).split("::")[0];
                if (f.has(b)) continue;
                f.add(b);
                const _ = { slug: b };
                w.title ? _.title = String(w.title) : w.parentTitle && (_.title = String(w.parentTitle)), w.path && (_.path = String(w.path)), y.push(_);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = y;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (p) {
      ue("[slugManager] filtering index by excludes failed", p);
      try {
        Array.isArray(F) || (F = []), F.length = 0;
        for (const y of h) F.push(y);
      } catch {
        try {
          F = Array.from(h);
        } catch {
          F = h;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = F;
          } catch {
          }
      } catch {
      }
    }
    return F;
  })();
  try {
    await _t;
  } catch (a) {
    ue("[slugManager] awaiting _indexPromise failed", a);
  }
  return _t = null, F;
}
async function xt(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(F) && F.length && !_t && !s) return F;
    if (_t) {
      try {
        await _t;
      } catch {
      }
      return F;
    }
    if (s) {
      try {
        if (typeof or == "function")
          try {
            const o = await or(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                qi(o);
              } catch {
              }
              return F;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await Ct(n, i, r, a), F;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(F) && F.length) return F;
      await new Promise((o) => setTimeout(o, 150));
    }
    return F;
  } catch {
    return F;
  }
}
async function cr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await xt(t);
    } catch {
      return F;
    }
  } catch {
    return F;
  }
}
const Hi = 1e3;
let gn = Hi;
function _s(e) {
  typeof e == "number" && e >= 0 && (gn = e);
}
const Ui = new DOMParser(), Fi = "a[href]";
let Wi = async function(e, t, n = gn) {
  if (Rn.has(e)) return Rn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? l = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? l = s + String(t).replace(/\/$/, "") + "/" : l = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  const o = Math.max(1, Math.min(ln, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const h = a.splice(0, o);
    await Promise.all(h.map(async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let u = "";
      try {
        u = new URL(c || "", l).toString();
      } catch {
        u = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(u);
        } catch (f) {
          ue("[slugManager] crawlForSlug: fetch failed", { url: u, error: f });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && ue("[slugManager] crawlForSlug: directory fetch non-ok", { url: u, status: d.status });
          return;
        }
        const g = await d.text(), p = Ui.parseFromString(g, "text/html").querySelectorAll(Fi), y = u;
        for (const f of p)
          try {
            if (i) break;
            let w = f.getAttribute("href") || "";
            if (!w || fn(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const b = new URL(w, y), _ = new URL(l).pathname, x = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), S = Pt(oe(x));
                r.has(S) || a.push(S);
              } catch {
                const _ = oe(c + w);
                r.has(_) || a.push(_);
              }
              continue;
            }
            if (w.toLowerCase().endsWith(".md")) {
              let b = "";
              try {
                const _ = new URL(w, y), x = new URL(l).pathname;
                b = _.pathname.startsWith(x) ? _.pathname.slice(x.length) : _.pathname.replace(/^\//, "");
              } catch {
                b = (c + w).replace(/^\//, "");
              }
              b = oe(b);
              try {
                if (D.has(b))
                  continue;
                for (const _ of Q.values())
                  ;
              } catch (_) {
                ue("[slugManager] slug map access failed", _);
              }
              try {
                const _ = await Se(b, t);
                if (_ && _.raw) {
                  const x = (_.raw || "").match(/^#\s+(.+)$/m);
                  if (x && x[1] && _e(x[1].trim()) === e) {
                    i = b;
                    break;
                  }
                }
              } catch (_) {
                ue("[slugManager] crawlForSlug: fetchMarkdown failed", _);
              }
            }
          } catch (w) {
            ue("[slugManager] crawlForSlug: link iteration failed", w);
          }
      } catch (d) {
        ue("[slugManager] crawlForSlug: directory fetch failed", d);
      }
    }));
  }
  return Rn.set(e, i), i;
};
async function Zi(e, t = gn) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const l = Math.max(1, Math.min(ln, 6));
  for (; r.length && !(r.length > t); ) {
    const o = r.splice(0, l);
    await Promise.all(o.map(async (h) => {
      if (h == null || i.has(h)) return;
      i.add(h);
      let c = "";
      try {
        c = new URL(h || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(h || "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(c);
        } catch (y) {
          ue("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: y });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && ue("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: u.status });
          return;
        }
        const d = await u.text(), m = Ui.parseFromString(d, "text/html").querySelectorAll(Fi), p = c;
        for (const y of m)
          try {
            let f = y.getAttribute("href") || "";
            if (!f || fn(f, e) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
            if (f.endsWith("/")) {
              try {
                const b = new URL(f, p), _ = new URL(s).pathname, x = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, ""), S = Pt(oe(x));
                i.has(S) || r.push(S);
              } catch {
                const _ = h + f;
                i.has(_) || r.push(_);
              }
              continue;
            }
            let w = "";
            try {
              const b = new URL(f, p), _ = new URL(s).pathname;
              w = b.pathname.startsWith(_) ? b.pathname.slice(_.length) : b.pathname.replace(/^\//, "");
            } catch {
              w = (h + f).replace(/^\//, "");
            }
            w = oe(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (f) {
            ue("[slugManager] crawlAllMarkdown: link iteration failed", f);
          }
      } catch (u) {
        ue("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }));
  }
  return Array.from(n);
}
async function Gi(e, t, n) {
  if (e && typeof e == "string" && (e = oe(e), e = Dt(e)), Q.has(e))
    return pn(e) || Q.get(e);
  try {
    if (!(typeof K == "string" && K || Q.has(e) || Pe && Pe.length || Nt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of qn)
    try {
      const a = await r(e, t);
      if (a)
        return bt(e, a), D.set(a, e), a;
    } catch (a) {
      ue("[slugManager] slug resolver failed", a);
    }
  if (Pe && Pe.length) {
    if (Xt.has(e)) {
      const r = Xt.get(e);
      return Q.set(e, r), D.set(r, e), r;
    }
    for (const r of Pe)
      if (!In.has(r))
        try {
          const a = await Se(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = _e(s[1].trim());
              if (In.add(r), l && Xt.set(l, r), l === e)
                return bt(e, r), D.set(r, e), r;
            }
          }
        } catch (a) {
          ue("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await Ct(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return bt(e, a.path), D.set(a.path, e), a.path;
    }
  } catch (r) {
    ue("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Wi(e, t, n);
    if (r)
      return bt(e, r), D.set(r, e), r;
  } catch (r) {
    ue("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Se(r, t);
      if (a && a.raw)
        return bt(e, r), D.set(r, e), r;
    } catch (a) {
      ue("[slugManager] candidate fetch failed", a);
    }
  if (Pe && Pe.length)
    for (const r of Pe)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (_e(a) === e)
          return bt(e, r), D.set(r, e), r;
      } catch (a) {
        ue("[slugManager] build-time filename match failed", a);
      }
  try {
    if (et && typeof et == "string" && et.trim())
      try {
        const r = await Se(et, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && _e(a[1].trim()) === e)
            return bt(e, et), D.set(et, e), et;
        }
      } catch (r) {
        ue("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    ue("[slugManager] home page fetch failed", r);
  }
  return null;
}
const Tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Hi,
  HOME_SLUG: kr,
  _setAllMd: ds,
  _setSearchIndex: qi,
  _storeSlugMapping: bt,
  addSlugResolver: us,
  get allMarkdownPaths() {
    return Pe;
  },
  get availableLanguages() {
    return Ge;
  },
  awaitSearchIndex: cr,
  buildSearchIndex: Ct,
  buildSearchIndexWorker: or,
  clearFetchCache: ms,
  clearListCaches: fs,
  crawlAllMarkdown: Zi,
  crawlCache: Rn,
  crawlForSlug: Wi,
  crawlForSlugWorker: cs,
  get defaultCrawlMaxQueue() {
    return gn;
  },
  ensureSlug: Gi,
  fetchCache: Kt,
  get fetchMarkdown() {
    return Se;
  },
  getLanguages: ss,
  getSearchIndex: ws,
  get homePage() {
    return et;
  },
  initSlugWorker: ls,
  isExternalLink: gs,
  isExternalLinkWithBase: fn,
  listPathsFetched: In,
  listSlugCache: Xt,
  mdToSlug: D,
  get notFoundPage() {
    return K;
  },
  removeSlugResolver: hs,
  resolveSlugPath: pn,
  get searchIndex() {
    return F;
  },
  setContentBase: xr,
  setDefaultCrawlMaxQueue: _s,
  setFetchMarkdown: ys,
  setHomePage: Di,
  setLanguages: Ii,
  setNotFoundPage: Ni,
  setSkipRootReadme: as,
  get skipRootReadme() {
    return _r;
  },
  slugResolvers: qn,
  slugToMd: Q,
  slugify: _e,
  unescapeMarkdown: Cn,
  uniqueSlug: ji,
  whenSearchIndexReady: xt
}, Symbol.toStringTag, { value: "Module" }));
var tr, ai;
function ks() {
  if (ai) return tr;
  ai = 1;
  function e(a, s) {
    return s.some(
      ([l, o]) => l <= a && a <= o
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
    let l = 0, o = 0, h = a.length - 1;
    const c = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[o]); ) o++;
    for (; u(a[h]); ) h--;
    const d = `${a}
`;
    for (let y = o; y <= h; y++)
      if ((t(d[y]) || !u(d[y]) && (u(d[y + 1]) || t(d[y + 1]))) && l++, t(d[y]))
        for (; y <= h && (i(d[y + 1]) || u(d[y + 1])); )
          y++;
    const g = l / c, m = Math.round(g * 60 * 1e3);
    return {
      text: Math.ceil(g.toFixed(2)) + " min read",
      minutes: g,
      time: m,
      words: l
    };
  }
  return tr = r, tr;
}
var xs = ks();
const Ss = /* @__PURE__ */ Ei(xs);
function cn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function wt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function Qi(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function vs(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  wt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && wt("property", "og:description", a), a && String(a).trim() && wt("name", "twitter:description", a), wt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (wt("property", "og:image", s), wt("name", "twitter:image", s));
}
function Sr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && cn("description", l), cn("robots", a.robots || "index,follow"), vs(a, t, n, l);
}
function As() {
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
function vr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", h = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const m = oe(t);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(m);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (m) {
      c = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", m);
    }
    c && Qi("canonical", c);
    try {
      wt("property", "og:url", c);
    } catch (m) {
      console.warn("[seoManager] upsertMeta og:url failed", m);
    }
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    h && (u.image = String(h)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const d = "nimbi-jsonld";
    let g = document.getElementById(d);
    g || (g = document.createElement("script"), g.type = "application/ld+json", g.id = d, document.head.appendChild(g)), g.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    console.warn("[seoManager] setStructuredData failed", s);
  }
}
let Vt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function Es(e) {
  try {
    if (!e || typeof e != "object") {
      Vt = {};
      return;
    }
    Vt = Object.assign({}, e);
  } catch (t) {
    console.warn("[seoManager] setSeoMap failed", t);
  }
}
function Ls(e, t = "") {
  try {
    if (!e) return;
    const n = Vt && Vt[e] ? Vt[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      Qi("canonical", i);
      try {
        wt("property", "og:url", i);
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
      n.description && cn("description", String(n.description));
    } catch {
    }
    try {
      try {
        Sr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      vr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      console.warn("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    console.warn("[seoManager] injectSeoForPage failed", n);
  }
}
function Tn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      cn("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && cn("description", String(s));
    } catch {
    }
    try {
      Sr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      vr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    console.warn("[seoManager] markNotFound failed", r);
  }
}
function Ms(e, t, n, i, r, a, s, l, o, h, c) {
  try {
    if (i && i.querySelector) {
      const u = i.querySelector(".menu-label");
      u && (u.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (u) {
    console.warn("[seoManager] update toc label failed", u);
  }
  try {
    const u = n.meta && n.meta.title ? String(n.meta.title).trim() : "", d = r.querySelector("img"), g = d && (d.getAttribute("src") || d.src) || null;
    let m = "";
    try {
      let f = "";
      try {
        const w = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (w) {
          let b = w.nextElementSibling;
          const _ = [];
          for (; b && !(b.tagName && b.tagName.toLowerCase() === "h2"); ) {
            try {
              if (b.classList && b.classList.contains("nimbi-article-subtitle")) {
                b = b.nextElementSibling;
                continue;
              }
            } catch {
            }
            const x = (b.textContent || "").trim();
            x && _.push(x), b = b.nextElementSibling;
          }
          _.length && (f = _.join(" ").replace(/\s+/g, " ").trim()), !f && o && (f = String(o).trim());
        }
      } catch (w) {
        console.warn("[seoManager] compute descOverride failed", w);
      }
      f && String(f).length > 160 && (f = String(f).slice(0, 157).trim() + "..."), m = f;
    } catch (f) {
      console.warn("[seoManager] compute descOverride failed", f);
    }
    let p = "";
    try {
      u && (p = u);
    } catch {
    }
    if (!p)
      try {
        l && l.textContent && (p = String(l.textContent).trim());
      } catch {
      }
    if (!p)
      try {
        const f = r.querySelector("h2");
        f && f.textContent && (p = String(f.textContent).trim());
      } catch {
      }
    p || (p = a || "");
    try {
      Sr(n, p || void 0, g, m);
    } catch (f) {
      console.warn("[seoManager] setMetaTags failed", f);
    }
    try {
      vr(n, h, p || void 0, g, m, t);
    } catch (f) {
      console.warn("[seoManager] setStructuredData failed", f);
    }
    const y = As();
    p ? y ? document.title = `${y} - ${p}` : document.title = `${t || "Site"} - ${p}` : u ? document.title = u : document.title = t || document.title;
  } catch (u) {
    console.warn("[seoManager] applyPageMeta failed", u);
  }
  try {
    try {
      const u = r.querySelectorAll(".nimbi-reading-time");
      u && u.forEach((d) => d.remove());
    } catch {
    }
    if (o) {
      const u = Ss(c.raw || ""), d = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, g = d ? e("readingTime", { minutes: d }) : "";
      if (!g) return;
      const m = r.querySelector("h1");
      if (m) {
        const p = r.querySelector(".nimbi-article-subtitle");
        try {
          if (p) {
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = g, p.appendChild(y);
          } else {
            const y = document.createElement("p");
            y.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const f = document.createElement("span");
            f.className = "nimbi-reading-time", f.textContent = g, y.appendChild(f);
            try {
              m.parentElement.insertBefore(y, m.nextSibling);
            } catch {
              try {
                m.insertAdjacentElement("afterend", y);
              } catch {
              }
            }
          }
        } catch {
          try {
            const f = document.createElement("p");
            f.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = g, f.appendChild(w), m.insertAdjacentElement("afterend", f);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    console.warn("[seoManager] reading time update failed", u);
  }
}
let Xi = 100;
function si(e) {
  Xi = e;
}
function Ve() {
  try {
    if (typeof window < "u" && window.__nimbiCMSDebug) return !0;
  } catch {
  }
  try {
    return !!(typeof K == "string" && K);
  } catch {
    return !1;
  }
}
let Yt = 300 * 1e3;
function oi(e) {
  Yt = e;
}
const rt = /* @__PURE__ */ new Map();
function Cs(e) {
  if (!rt.has(e)) return;
  const t = rt.get(e), n = Date.now();
  if (t.ts + Yt < n) {
    rt.delete(e);
    return;
  }
  return rt.delete(e), rt.set(e, t), t.value;
}
function Rs(e, t) {
  if (li(), li(), rt.delete(e), rt.set(e, { value: t, ts: Date.now() }), rt.size > Xi) {
    const n = rt.keys().next().value;
    n !== void 0 && rt.delete(n);
  }
}
function li() {
  if (!Yt || Yt <= 0) return;
  const e = Date.now();
  for (const [t, n] of rt.entries())
    n.ts + Yt < e && rt.delete(t);
}
async function Ts(e, t) {
  const n = new Set(Xe), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = Je(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const d = oe(u.page);
              if (d) {
                n.add(d);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const d = u.page;
              if (Q.has(d)) {
                const g = Q.get(d);
                if (g) return g;
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
          let u = oe(l[1]);
          u && n.add(u);
          continue;
        }
        const o = (r.textContent || "").trim(), h = (s.pathname || "").replace(/^.*\//, "");
        if (o && _e(o) === e || h && _e(h.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const u = new URL(t), d = Pt(u.pathname);
          if (c.indexOf(d) !== -1) {
            let g = c.startsWith(d) ? c.slice(d.length) : c;
            g = oe(g), g && n.add(g);
          }
        }
      } catch (s) {
        console.warn("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Se(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && _e(l) === e)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function Ps(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (Q.has(n)) {
        const i = pn(n) || Q.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (Xe && Xe.size)
          for (const i of Xe) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (_e(r) === n && !/index\.html$/i.test(i)) {
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
async function $s(e, t) {
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
    const f = Je(typeof location < "u" ? location.href : "");
    f && f.anchor && (i = f.anchor);
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
    const f = String(r).split("::", 2);
    r = f[0], a = f[1] || null;
  }
  const o = `${e}|||${typeof Ya < "u" && St ? St : ""}`, h = Cs(o);
  if (h)
    r = h.resolved, a = h.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let f = decodeURIComponent(String(r || ""));
      if (f && typeof f == "string" && (f = oe(f), f = Dt(f)), Q.has(f))
        r = pn(f) || Q.get(f);
      else {
        let w = await Ts(f, t);
        if (w)
          r = w;
        else if (Nt._refreshed && Xe && Xe.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await Gi(f, t);
          b && (r = b);
        }
      }
    }
    Rs(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const f = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof K == "string" && K || Q.has(r) || Xe && Xe.size || Nt._refreshed || s || f;
  } catch {
    c = !0;
  }
  !a && i && (a = i);
  try {
    if (c && r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const f = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const w = await fetch(f);
        if (w && w.ok) {
          const b = await w.text(), _ = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", x = (b || "").toLowerCase();
          if (_ && _.indexOf && _.indexOf("text/html") !== -1 || x.indexOf("<!doctype") !== -1 || x.indexOf("<html") !== -1) {
            if (!s)
              try {
                let q = f;
                try {
                  q = new URL(f).pathname.replace(/^\//, "");
                } catch {
                  q = String(f || "").replace(/^\//, "");
                }
                const H = q.replace(/\.html$/i, ".md");
                try {
                  const B = await Se(H, t);
                  if (B && B.raw)
                    return { data: B, pagePath: H, anchor: a };
                } catch {
                }
                if (typeof K == "string" && K)
                  try {
                    const B = await Se(K, t);
                    if (B && B.raw) {
                      try {
                        Tn(B.meta || {}, K);
                      } catch {
                      }
                      return { data: B, pagePath: K, anchor: a };
                    }
                  } catch {
                  }
                try {
                  y = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (x.indexOf('<div id="app"') !== -1 || x.indexOf("nimbi-cms") !== -1 || x.indexOf("nimbi-mount") !== -1 || x.indexOf("nimbi-") !== -1 || x.indexOf("initcms(") !== -1 || x.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(x))
              try {
                let q = f;
                try {
                  q = new URL(f).pathname.replace(/^\//, "");
                } catch {
                  q = String(f || "").replace(/^\//, "");
                }
                const H = q.replace(/\.html$/i, ".md");
                try {
                  const B = await Se(H, t);
                  if (B && B.raw)
                    return { data: B, pagePath: H, anchor: a };
                } catch {
                }
                if (typeof K == "string" && K)
                  try {
                    const B = await Se(K, t);
                    if (B && B.raw) {
                      try {
                        Tn(B.meta || {}, K);
                      } catch {
                      }
                      return { data: B, pagePath: K, anchor: a };
                    }
                  } catch {
                  }
                try {
                  y = new Error("site shell detected (absolute fetch)");
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
  const u = Ps(r);
  try {
    if (Ve())
      try {
        console.warn("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
      } catch {
      }
  } catch {
  }
  const d = String(n || "").includes(".md") || String(n || "").includes(".html");
  let g = null;
  if (!d)
    try {
      let f = decodeURIComponent(String(n || ""));
      f = oe(f), f = Dt(f), f && !/\.(md|html?)$/i.test(f) && (g = f);
    } catch {
      g = null;
    }
  if (d && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !d && !Q.has(r) && !Q.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let m = null, p = null, y = null;
  try {
    const f = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof K == "string" && K || Q.has(r) || Xe && Xe.size || Nt._refreshed || d || f;
  } catch {
    c = !0;
  }
  if (!c)
    y = new Error("no page data");
  else
    for (const f of u)
      if (f)
        try {
          const w = oe(f);
          if (m = await Se(w, t), p = w, g && !Q.has(g))
            try {
              let b = "";
              if (m && m.isHtml)
                try {
                  const _ = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (_) {
                    const x = _.parseFromString(m.raw || "", "text/html"), S = x.querySelector("h1") || x.querySelector("title");
                    S && S.textContent && (b = S.textContent.trim());
                  }
                } catch {
                }
              else {
                const _ = (m && m.raw || "").match(/^#\s+(.+)$/m);
                _ && _[1] && (b = _[1].trim());
              }
              if (b && _e(b) !== g)
                try {
                  if (/\.html$/i.test(w)) {
                    const x = w.replace(/\.html$/i, ".md");
                    if (u.includes(x))
                      try {
                        const S = await Se(x, t);
                        if (S && S.raw)
                          m = S, p = x;
                        else if (typeof K == "string" && K)
                          try {
                            const M = await Se(K, t);
                            if (M && M.raw)
                              m = M, p = K;
                            else {
                              m = null, p = null, y = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            m = null, p = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          m = null, p = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const M = await Se(K, t);
                          if (M && M.raw)
                            m = M, p = K;
                          else {
                            m = null, p = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          m = null, p = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      m = null, p = null, y = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    m = null, p = null, y = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  m = null, p = null, y = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!d && /\.html$/i.test(w)) {
              const b = w.replace(/\.html$/i, ".md");
              if (u.includes(b))
                try {
                  const x = String(m && m.raw || "").trim().slice(0, 128).toLowerCase();
                  if (m && m.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(x) || x.indexOf('<div id="app"') !== -1 || x.indexOf("nimbi-") !== -1 || x.indexOf("nimbi") !== -1 || x.indexOf("initcms(") !== -1) {
                    let M = !1;
                    try {
                      const q = await Se(b, t);
                      if (q && q.raw)
                        m = q, p = b, M = !0;
                      else if (typeof K == "string" && K)
                        try {
                          const H = await Se(K, t);
                          H && H.raw && (m = H, p = K, M = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const H = await Se(K, t);
                        H && H.raw && (m = H, p = K, M = !0);
                      } catch {
                      }
                    }
                    if (!M) {
                      m = null, p = null, y = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (Ve())
              try {
                console.warn("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: p, isHtml: m && m.isHtml, snippet: m && m.raw ? String(m.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          y = w;
          try {
            Ve() && console.warn("[router] candidate fetch failed", { candidate: f, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!m) {
    const f = y && (y.message || String(y)) || null, w = f && /failed to fetch md|site shell detected/i.test(f);
    try {
      if (Ve())
        try {
          console.warn("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: f });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (Ve())
          try {
            console.warn("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: f });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (Ve())
          try {
            console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: f });
          } catch {
          }
      } catch {
      }
    if (typeof K == "string" && K)
      try {
        const b = await Se(K, t);
        if (b && b.raw) {
          try {
            Tn(b.meta || {}, K);
          } catch {
          }
          return { data: b, pagePath: K, anchor: a };
        }
      } catch {
      }
    try {
      if (d && String(n || "").toLowerCase().includes(".html"))
        try {
          const b = new URL(String(n || ""), location.href).toString();
          Ve() && console.warn("[router] attempting absolute HTML fetch fallback", b);
          const _ = await fetch(b);
          if (_ && _.ok) {
            const x = await _.text(), S = _ && _.headers && typeof _.headers.get == "function" && _.headers.get("content-type") || "", M = (x || "").toLowerCase(), q = S && S.indexOf && S.indexOf("text/html") !== -1 || M.indexOf("<!doctype") !== -1 || M.indexOf("<html") !== -1;
            if (!q && Ve() && console.warn("[router] absolute fetch returned non-HTML", { abs: b, contentType: S, snippet: M.slice(0, 200) }), q) {
              const H = (x || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(x) || /<h1>\s*index of\b/i.test(x) || H.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(x) || /<h1>\s*directory listing/i.test(x))
                try {
                  Ve() && console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
                } catch {
                }
              else
                try {
                  const Z = b, G = new URL(".", Z).toString();
                  try {
                    const T = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (T) {
                      const ne = T.parseFromString(x || "", "text/html"), A = (J, ke) => {
                        try {
                          const he = ke.getAttribute(J) || "";
                          if (!he || /^(https?:)?\/\//i.test(he) || he.startsWith("/") || he.startsWith("#")) return;
                          try {
                            const v = new URL(he, Z).toString();
                            ke.setAttribute(J, v);
                          } catch (v) {
                            console.warn("[router] rewrite attribute failed", J, v);
                          }
                        } catch (he) {
                          console.warn("[router] rewrite helper failed", he);
                        }
                      }, I = ne.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), te = [];
                      for (const J of Array.from(I || []))
                        try {
                          const ke = J.tagName ? J.tagName.toLowerCase() : "";
                          if (ke === "a") continue;
                          if (J.hasAttribute("src")) {
                            const he = J.getAttribute("src");
                            A("src", J);
                            const v = J.getAttribute("src");
                            he !== v && te.push({ attr: "src", tag: ke, before: he, after: v });
                          }
                          if (J.hasAttribute("href") && ke === "link") {
                            const he = J.getAttribute("href");
                            A("href", J);
                            const v = J.getAttribute("href");
                            he !== v && te.push({ attr: "href", tag: ke, before: he, after: v });
                          }
                          if (J.hasAttribute("href") && ke !== "link") {
                            const he = J.getAttribute("href");
                            A("href", J);
                            const v = J.getAttribute("href");
                            he !== v && te.push({ attr: "href", tag: ke, before: he, after: v });
                          }
                          if (J.hasAttribute("xlink:href")) {
                            const he = J.getAttribute("xlink:href");
                            A("xlink:href", J);
                            const v = J.getAttribute("xlink:href");
                            he !== v && te.push({ attr: "xlink:href", tag: ke, before: he, after: v });
                          }
                          if (J.hasAttribute("poster")) {
                            const he = J.getAttribute("poster");
                            A("poster", J);
                            const v = J.getAttribute("poster");
                            he !== v && te.push({ attr: "poster", tag: ke, before: he, after: v });
                          }
                          if (J.hasAttribute("srcset")) {
                            const O = (J.getAttribute("srcset") || "").split(",").map((N) => N.trim()).filter(Boolean).map((N) => {
                              const [z, C] = N.split(/\s+/, 2);
                              if (!z || /^(https?:)?\/\//i.test(z) || z.startsWith("/")) return N;
                              try {
                                const P = new URL(z, Z).toString();
                                return C ? `${P} ${C}` : P;
                              } catch {
                                return N;
                              }
                            }).join(", ");
                            J.setAttribute("srcset", O);
                          }
                        } catch {
                        }
                      const Le = ne.documentElement && ne.documentElement.outerHTML ? ne.documentElement.outerHTML : x;
                      try {
                        Ve() && te && te.length && console.warn("[router] rewritten asset refs", { abs: b, rewritten: te });
                      } catch {
                      }
                      return { data: { raw: Le, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let E = x;
                  return /<base\s+[^>]*>/i.test(x) || (/<head[^>]*>/i.test(x) ? E = x.replace(/(<head[^>]*>)/i, `$1<base href="${G}">`) : E = `<base href="${G}">` + x), { data: { raw: E, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: x, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (b) {
          Ve() && console.warn("[router] absolute HTML fetch fallback failed", b);
        }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(r || ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof K == "string" && K && Ve()) {
        const x = [
          `/assets/${b}.html`,
          `/assets/${b}/index.html`
        ];
        for (const S of x)
          try {
            const M = await fetch(S, { method: "GET" });
            if (M && M.ok)
              return { data: { raw: await M.text(), isHtml: !0 }, pagePath: S.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (b) {
      Ve() && console.warn("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return { data: m, pagePath: p, anchor: a };
}
function jn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var vt = jn();
function Ki(e) {
  vt = e;
}
var Mt = { exec: () => null };
function ve(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Qe.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var zs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Qe = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Is = /^(?:[ \t]*(?:\n|$))+/, Os = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Bs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, mn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ns = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ar = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Vi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Yi = ve(Vi).replace(/bull/g, Ar).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ds = ve(Vi).replace(/bull/g, Ar).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Er = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, qs = /^[^\n]+/, Lr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, js = ve(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Lr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Hs = ve(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ar).getRegex(), Hn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Mr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Us = ve("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Mr).replace("tag", Hn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ji = ve(Er).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Hn).getRegex(), Fs = ve(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ji).getRegex(), Cr = { blockquote: Fs, code: Os, def: js, fences: Bs, heading: Ns, hr: mn, html: Us, lheading: Yi, list: Hs, newline: Is, paragraph: Ji, table: Mt, text: qs }, ci = ve("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Hn).getRegex(), Ws = { ...Cr, lheading: Ds, table: ci, paragraph: ve(Er).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ci).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Hn).getRegex() }, Zs = { ...Cr, html: ve(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Mr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Mt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ve(Er).replace("hr", mn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Yi).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Gs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Qs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ea = /^( {2,}|\\)\n(?!\s*$)/, Xs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Un = /[\p{P}\p{S}]/u, Rr = /[\s\p{P}\p{S}]/u, ta = /[^\s\p{P}\p{S}]/u, Ks = ve(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Rr).getRegex(), na = /(?!~)[\p{P}\p{S}]/u, Vs = /(?!~)[\s\p{P}\p{S}]/u, Ys = /(?:[^\s\p{P}\p{S}]|~)/u, ra = /(?![*_])[\p{P}\p{S}]/u, Js = /(?![*_])[\s\p{P}\p{S}]/u, eo = /(?:[^\s\p{P}\p{S}]|[*_])/u, to = ve(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", zs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ia = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, no = ve(ia, "u").replace(/punct/g, Un).getRegex(), ro = ve(ia, "u").replace(/punct/g, na).getRegex(), aa = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", io = ve(aa, "gu").replace(/notPunctSpace/g, ta).replace(/punctSpace/g, Rr).replace(/punct/g, Un).getRegex(), ao = ve(aa, "gu").replace(/notPunctSpace/g, Ys).replace(/punctSpace/g, Vs).replace(/punct/g, na).getRegex(), so = ve("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ta).replace(/punctSpace/g, Rr).replace(/punct/g, Un).getRegex(), oo = ve(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ra).getRegex(), lo = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", co = ve(lo, "gu").replace(/notPunctSpace/g, eo).replace(/punctSpace/g, Js).replace(/punct/g, ra).getRegex(), uo = ve(/\\(punct)/, "gu").replace(/punct/g, Un).getRegex(), ho = ve(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), fo = ve(Mr).replace("(?:-->|$)", "-->").getRegex(), po = ve("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", fo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), On = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, go = ve(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", On).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), sa = ve(/^!?\[(label)\]\[(ref)\]/).replace("label", On).replace("ref", Lr).getRegex(), oa = ve(/^!?\[(ref)\](?:\[\])?/).replace("ref", Lr).getRegex(), mo = ve("reflink|nolink(?!\\()", "g").replace("reflink", sa).replace("nolink", oa).getRegex(), ui = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Tr = { _backpedal: Mt, anyPunctuation: uo, autolink: ho, blockSkip: to, br: ea, code: Qs, del: Mt, delLDelim: Mt, delRDelim: Mt, emStrongLDelim: no, emStrongRDelimAst: io, emStrongRDelimUnd: so, escape: Gs, link: go, nolink: oa, punctuation: Ks, reflink: sa, reflinkSearch: mo, tag: po, text: Xs, url: Mt }, yo = { ...Tr, link: ve(/^!?\[(label)\]\((.*?)\)/).replace("label", On).getRegex(), reflink: ve(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", On).getRegex() }, ur = { ...Tr, emStrongRDelimAst: ao, emStrongLDelim: ro, delLDelim: oo, delRDelim: co, url: ve(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ui).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ve(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ui).getRegex() }, bo = { ...ur, br: ve(ea).replace("{2,}", "*").getRegex(), text: ve(ur.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, An = { normal: Cr, gfm: Ws, pedantic: Zs }, Ut = { normal: Tr, gfm: ur, breaks: bo, pedantic: yo }, wo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, hi = (e) => wo[e];
function ut(e, t) {
  if (t) {
    if (Qe.escapeTest.test(e)) return e.replace(Qe.escapeReplace, hi);
  } else if (Qe.escapeTestNoEncode.test(e)) return e.replace(Qe.escapeReplaceNoEncode, hi);
  return e;
}
function di(e) {
  try {
    e = encodeURI(e).replace(Qe.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function fi(e, t) {
  let n = e.replace(Qe.findPipe, (a, s, l) => {
    let o = !1, h = s;
    for (; --h >= 0 && l[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Qe.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Qe.slashPipe, "|");
  return i;
}
function Ft(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function _o(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function ko(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function pi(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function xo(e, t, n) {
  let i = e.match(n.other.indentCodeCompensation);
  if (i === null) return t;
  let r = i[1];
  return t.split(`
`).map((a) => {
    let s = a.match(n.other.beginningSpace);
    if (s === null) return a;
    let [l] = s;
    return l.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var un = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || vt;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Ft(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = xo(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Ft(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Ft(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = Ft(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), s = !0;
        else if (!s) l.push(n[o]);
        else break;
        n = n.slice(o);
        let h = l.join(`
`), c = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${h}` : h, r = r ? `${r}
${c}` : c;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = u, n.length === 0) break;
        let d = a.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let g = d, m = g.raw + `
` + n.join(`
`), p = this.blockquote(m);
          a[a.length - 1] = p, i = i.substring(0, i.length - g.raw.length) + p.raw, r = r.substring(0, r.length - g.text.length) + p.text;
          break;
        } else if (d?.type === "list") {
          let g = d, m = g.raw + `
` + n.join(`
`), p = this.list(m);
          a[a.length - 1] = p, i = i.substring(0, i.length - d.raw.length) + p.raw, r = r.substring(0, r.length - g.raw.length) + p.raw, n = m.substring(a.at(-1).raw.length).split(`
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
        let o = !1, h = "", c = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        h = t[0], e = e.substring(h.length);
        let u = ko(t[2].split(`
`, 1)[0], t[1].length), d = e.split(`
`, 1)[0], g = !u.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, c = u.trimStart()) : g ? m = t[1].length + 1 : (m = u.search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, c = u.slice(m), m += t[1].length), g && this.rules.other.blankLine.test(d) && (h += d + `
`, e = e.substring(d.length + 1), o = !0), !o) {
          let p = this.rules.other.nextBulletRegex(m), y = this.rules.other.hrRegex(m), f = this.rules.other.fencesBeginRegex(m), w = this.rules.other.headingBeginRegex(m), b = this.rules.other.htmlBeginRegex(m), _ = this.rules.other.blockquoteBeginRegex(m);
          for (; e; ) {
            let x = e.split(`
`, 1)[0], S;
            if (d = x, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), S = d) : S = d.replace(this.rules.other.tabCharGlobal, "    "), f.test(d) || w.test(d) || b.test(d) || _.test(d) || p.test(d) || y.test(d)) break;
            if (S.search(this.rules.other.nonSpaceChar) >= m || !d.trim()) c += `
` + S.slice(m);
            else {
              if (g || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || f.test(u) || w.test(u) || y.test(u)) break;
              c += `
` + d;
            }
            g = !d.trim(), h += x + `
`, e = e.substring(x.length + 1), u = S.slice(m);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (s = !0)), r.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += h;
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
          let h = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (h) {
            let c = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            o.checked = c.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = c.raw + o.tokens[0].raw, o.tokens[0].text = c.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(c)) : o.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : o.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let h = o.tokens.filter((u) => u.type === "space"), c = h.length > 0 && h.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let h of o.tokens) h.type === "text" && (h.type = "paragraph");
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
    let n = fi(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(fi(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = Ft(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = _o(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), pi(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return pi(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, h = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = h.exec(t)) != null; ) {
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
        let c = [...i[0]][0].length, u = e.slice(0, r + i.index + c + s);
        if (Math.min(r, s) % 2) {
          let g = u.slice(1, -1);
          return { type: "em", raw: u, text: g, tokens: this.lexer.inlineTokens(g) };
        }
        let d = u.slice(2, -2);
        return { type: "strong", raw: u, text: d, tokens: this.lexer.inlineTokens(d) };
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
      let r = [...i[0]].length - 1, a, s, l = r, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = o.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          l += s;
          continue;
        }
        if (l -= s, l > 0) continue;
        s = Math.min(s, s + l);
        let h = [...i[0]][0].length, c = e.slice(0, r + i.index + h + s), u = c.slice(r, -r);
        return { type: "del", raw: c, text: u, tokens: this.lexer.inlineTokens(u) };
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
}, tt = class hr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || vt, this.options.tokenizer = this.options.tokenizer || new un(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Qe, block: An.normal, inline: Ut.normal };
    this.options.pedantic ? (n.block = An.pedantic, n.inline = Ut.pedantic) : this.options.gfm && (n.block = An.gfm, this.options.breaks ? n.inline = Ut.breaks : n.inline = Ut.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: An, inline: Ut };
  }
  static lex(t, n) {
    return new hr(n).lex(t);
  }
  static lexInline(t, n) {
    return new hr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Qe.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Qe.tabCharGlobal, "    ").replace(Qe.spaceLine, "")); t; ) {
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
        let s = 1 / 0, l = t.slice(1), o;
        this.options.extensions.startBlock.forEach((h) => {
          o = h.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
    let s = !1, l = "";
    for (; t; ) {
      s || (l = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((c) => (o = c.call({ lexer: this }, t, n)) ? (t = t.substring(o.raw.length), n.push(o), !0) : !1)) continue;
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
        let c = n.at(-1);
        o.type === "text" && c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(t, i, l)) {
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
      if (o = this.tokenizer.del(t, i, l)) {
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
      let h = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, u = t.slice(1), d;
        this.options.extensions.startInline.forEach((g) => {
          d = g.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (c = Math.min(c, d));
        }), c < 1 / 0 && c >= 0 && (h = t.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(h)) {
        t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (l = o.raw.slice(-1)), s = !0;
        let c = n.at(-1);
        c?.type === "text" ? (c.raw += o.raw, c.text += o.text) : n.push(o);
        continue;
      }
      if (t) {
        let c = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else throw new Error(c);
      }
    }
    return n;
  }
}, hn = class {
  options;
  parser;
  constructor(e) {
    this.options = e || vt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(Qe.notSpaceStart)?.[0], r = e.replace(Qe.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + ut(i) + '">' + (n ? r : ut(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : ut(r, !0)) + `</code></pre>
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
      let l = e.items[s];
      i += this.listitem(l);
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
    return `<code>${ut(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = di(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + ut(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = di(e);
    if (r === null) return ut(n);
    e = r;
    let a = `<img src="${e}" alt="${ut(n)}"`;
    return t && (a += ` title="${ut(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : ut(e.text);
  }
}, Fn = class {
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
}, nt = class dr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || vt, this.options.renderer = this.options.renderer || new hn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fn();
  }
  static parse(t, n) {
    return new dr(n).parse(t);
  }
  static parseInline(t, n) {
    return new dr(n).parseInline(t);
  }
  parse(t) {
    let n = "";
    for (let i = 0; i < t.length; i++) {
      let r = t[i];
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
  parseInline(t, n = this.renderer) {
    let i = "";
    for (let r = 0; r < t.length; r++) {
      let a = t[r];
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
}, Ot = class {
  options;
  block;
  constructor(e) {
    this.options = e || vt;
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
    return this.block ? tt.lex : tt.lexInline;
  }
  provideParser() {
    return this.block ? nt.parse : nt.parseInline;
  }
}, la = class {
  defaults = jn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = nt;
  Renderer = hn;
  TextRenderer = Fn;
  Lexer = tt;
  Tokenizer = un;
  Hooks = Ot;
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
            let l = r.renderer.apply(this, s);
            return l === !1 && (l = a.apply(this, s)), l;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = t[r.level];
          a ? a.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), i.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new hn(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, l = n.renderer[s], o = r[s];
          r[s] = (...h) => {
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new un(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, l = n.tokenizer[s], o = r[s];
          r[s] = (...h) => {
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Ot();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          Ot.passThroughHooks.has(a) ? r[s] = (h) => {
            if (this.defaults.async && Ot.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await l.call(r, h);
              return o.call(r, u);
            })();
            let c = l.call(r, h);
            return o.call(r, c);
          } : r[s] = (...h) => {
            if (this.defaults.async) return (async () => {
              let u = await l.apply(r, h);
              return u === !1 && (u = await o.apply(r, h)), u;
            })();
            let c = l.apply(r, h);
            return c === !1 && (c = o.apply(r, h)), c;
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
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return tt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return nt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, l = await (r.hooks ? await r.hooks.provideLexer() : e ? tt.lex : tt.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let h = await (r.hooks ? await r.hooks.provideParser() : e ? nt.parse : nt.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? tt.lex : tt.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : e ? nt.parse : nt.parseInline)(s, r);
        return r.hooks && (l = r.hooks.postprocess(l)), l;
      } catch (s) {
        return a(s);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let i = "<p>An error occurred:</p><pre>" + ut(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, $t = new la();
function be(e, t) {
  return $t.parse(e, t);
}
be.options = be.setOptions = function(e) {
  return $t.setOptions(e), be.defaults = $t.defaults, Ki(be.defaults), be;
};
be.getDefaults = jn;
be.defaults = vt;
be.use = function(...e) {
  return $t.use(...e), be.defaults = $t.defaults, Ki(be.defaults), be;
};
be.walkTokens = function(e, t) {
  return $t.walkTokens(e, t);
};
be.parseInline = $t.parseInline;
be.Parser = nt;
be.parser = nt.parse;
be.Renderer = hn;
be.TextRenderer = Fn;
be.Lexer = tt;
be.lexer = tt.lex;
be.Tokenizer = un;
be.Hooks = Ot;
be.parse = be;
var So = be.options, vo = be.setOptions, Ao = be.use, Eo = be.walkTokens, Lo = be.parseInline, Mo = be, Co = nt.parse, Ro = tt.lex;
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Ot,
  Lexer: tt,
  Marked: la,
  Parser: nt,
  Renderer: hn,
  TextRenderer: Fn,
  Tokenizer: un,
  get defaults() {
    return vt;
  },
  getDefaults: jn,
  lexer: Ro,
  marked: be,
  options: So,
  parse: Mo,
  parseInline: Lo,
  parser: Co,
  setOptions: vo,
  use: Ao,
  walkTokens: Eo
}, Symbol.toStringTag, { value: "Module" })), ca = `function O() {
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
`, mi = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", ca], { type: "text/javascript;charset=utf-8" });
function To(e) {
  let t;
  try {
    if (t = mi && (self.URL || self.webkitURL).createObjectURL(mi), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(ca),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Bn(e) {
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
function ua(e) {
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
const Jt = gi && (be || gi) || void 0;
let Ze = null;
const Po = "https://cdn.jsdelivr.net/npm/highlight.js";
async function Nn() {
  if (Ze) return Ze;
  try {
    try {
      const e = await import(Po + "/lib/core.js");
      Ze = e.default || e;
    } catch {
      Ze = null;
    }
  } catch {
    Ze = null;
  }
  return Ze;
}
Jt && typeof Jt.setOptions == "function" && Jt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Ze && t && typeof Ze.getLanguage == "function" && Ze.getLanguage(t) ? Ze.highlight(e, { language: t }).value : Ze && typeof Ze.getLanguage == "function" && Ze.getLanguage("plaintext") ? Ze.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: c, url: u } = t;
      try {
        if (!await Nn()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const g = await import(u), m = g.default || g;
        Ze.registerLanguage(c, m), postMessage({ type: "registered", name: c });
      } catch (d) {
        postMessage({ type: "register-error", name: c, error: String(d) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", u = t.supported || [], d = /* @__PURE__ */ new Set(), g = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let m;
      for (; m = g.exec(c); )
        if (m[1]) {
          const p = String(m[1]).toLowerCase();
          if (!p) continue;
          if (p.length >= 5 && p.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(p) && d.add(p), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(p) && d.add(p), u && u.length)
            try {
              u.indexOf(p) !== -1 && d.add(p);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(d) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Bn(i || "");
    await Nn().catch(() => {
    });
    let s = Jt.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), h = (c) => {
      try {
        return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, d, g) => {
      const m = Number(u);
      let p = g.replace(/<[^>]+>/g, "").trim();
      try {
        p = ua(p);
      } catch {
      }
      let y = null;
      const f = (d || "").match(/\sid="([^"]+)"/);
      f && (y = f[1]);
      const w = y || h(p) || "heading", _ = (o.get(w) || 0) + 1;
      o.set(w, _);
      const x = _ === 1 ? w : w + "-" + _;
      l.push({ level: m, text: p, id: x });
      const S = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, M = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", q = (S[m] + " " + M).trim(), B = ((d || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${x}" class="${q}"`).trim();
      return `<h${m} ${B}>${g}</h${m}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function $o(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: h } = e;
      try {
        if (!await Nn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const u = await import(h), d = u.default || u;
        return Ze.registerLanguage(o, d), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", h = e.supported || [], c = /* @__PURE__ */ new Set(), u = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let d;
      for (; d = u.exec(o); )
        if (d[1]) {
          const g = String(d[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && c.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && c.add(g), h && h.length)
            try {
              h.indexOf(g) !== -1 && c.add(g);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Bn(e && e.md || "");
    await Nn().catch(() => {
    });
    let r = Jt.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, u) => {
      const d = Number(h);
      let g = u.replace(/<[^>]+>/g, "").trim();
      try {
        g = ua(g);
      } catch {
      }
      let m = null;
      const p = (c || "").match(/\sid="([^"]+)"/);
      p && (m = p[1]);
      const y = m || l(g) || "heading", w = (s.get(y) || 0) + 1;
      s.set(y, w);
      const b = w === 1 ? y : y + "-" + w;
      a.push({ level: d, text: g, id: b });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, x = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", S = (_[d] + " " + x).trim(), q = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${S}"`).trim();
      return `<h${d} ${q}>${u}</h${d}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, h) => /\bloading=/.test(h) ? `<img${h}>` : /\bdata-want-lazy=/.test(h) ? `<img${h}>` : `<img${h} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const nr = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, zo = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Io() {
  if (typeof Worker < "u")
    try {
      return new To();
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
          const r = { data: await $o(n) }(e.message || []).forEach((a) => a(r));
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
const ha = zi(() => Io(), "markdown", zo), yi = typeof DOMParser < "u" ? new DOMParser() : null, Rt = () => ha.get(), Pr = (e) => ha.send(e, 3e3), dt = [];
function fr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    dt.push(e);
    try {
      be.use(e);
    } catch (t) {
      console.warn("[markdown] failed to apply plugin", t);
    }
  }
}
function Oo(e) {
  dt.length = 0, Array.isArray(e) && dt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    dt.forEach((t) => be.use(t));
  } catch (t) {
    console.warn("[markdown] failed to apply markdown extensions", t);
  }
}
async function dn(e) {
  if (dt && dt.length) {
    let { content: i, data: r } = Bn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => nr[l] || s);
    } catch {
    }
    be.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      dt.forEach((s) => be.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = be.parse(i);
    try {
      const s = yi || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), h = [], c = /* @__PURE__ */ new Set(), u = (g) => {
          try {
            return String(g || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, d = (g) => {
          const m = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, p = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (m[g] + " " + p).trim();
        };
        o.forEach((g) => {
          try {
            const m = Number(g.tagName.substring(1)), p = (g.textContent || "").trim();
            let y = u(p) || "heading", f = y, w = 2;
            for (; c.has(f); )
              f = y + "-" + w, w += 1;
            c.add(f), g.id = f, g.className = d(m), h.push({ level: m, text: p, id: f });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((g) => {
            try {
              const m = g.getAttribute && g.getAttribute("loading"), p = g.getAttribute && g.getAttribute("data-want-lazy");
              !m && !p && g.setAttribute && g.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((g) => {
            try {
              const m = g.getAttribute && g.getAttribute("class") || g.className || "", p = String(m || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (p)
                try {
                  g.setAttribute && g.setAttribute("class", p);
                } catch {
                  g.className = p;
                }
              else
                try {
                  g.removeAttribute && g.removeAttribute("class");
                } catch {
                  g.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        return { html: l.body.innerHTML, meta: r || {}, toc: h };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => da);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Rt && Rt();
    }
  else
    t = Rt && Rt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => nr[r] || i);
  } catch {
  }
  try {
    if (typeof Ee < "u" && Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Bn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (h, c) => nr[c] || h);
      } catch {
      }
      be.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (h, c) => {
        try {
          return c && Ee.getLanguage && Ee.getLanguage(c) ? Ee.highlight(h, { language: c }).value : Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext") ? Ee.highlight(h, { language: "plaintext" }).value : h;
        } catch {
          return h;
        }
      } });
      let a = be.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (h, c) => {
          try {
            if (c && Ee && typeof Ee.highlight == "function")
              try {
                const u = Ee.highlight(c, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (Ee && typeof Ee.highlightElement == "function") {
                    const d = { innerHTML: c };
                    return Ee.highlightElement(d), `<pre><code>${d.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return h;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (h) => {
        try {
          return String(h || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (h, c, u, d) => {
        const g = Number(c), m = d.replace(/<[^>]+>/g, "").trim();
        let p = o(m) || "heading", y = p, f = 2;
        for (; l.has(y); )
          y = p + "-" + f, f += 1;
        l.add(y), s.push({ level: g, text: m, id: y });
        const w = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, b = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", _ = (w[g] + " " + b).trim(), S = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${_}"`).trim();
        return `<h${g} ${S}>${d}</h${g}>`;
      }), a = a.replace(/<img([^>]*)>/g, (h, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Pr({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const h = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (h[o] + " " + c).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, u) => {
      const d = Number(h), g = u.replace(/<[^>]+>/g, "").trim(), m = (c || "").match(/\sid="([^"]+)"/), p = m ? m[1] : a(g) || "heading", f = (i.get(p) || 0) + 1;
      i.set(p, f);
      const w = f === 1 ? p : p + "-" + f;
      r.push({ level: d, text: g, id: w });
      const b = s(d), x = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${b}"`).trim();
      return `<h${d} ${x}>${u}</h${d}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const h = yi || (typeof DOMParser < "u" ? new DOMParser() : null);
        if (h) {
          const c = h.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((d) => {
            try {
              const g = d.getAttribute("src") || "";
              (g ? new URL(g, location.href).toString() : "") === o && d.remove();
            } catch {
            }
          }), l = c.body.innerHTML;
        } else
          try {
            const c = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            l = l.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`, "g"), "");
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
function en(e, t) {
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
      const l = s[1].toLowerCase();
      if (Li.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(Ye && Ye[l] && t.has(Ye[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const h = t.get(l);
          h && n.add(h);
          continue;
        }
        if (Ye && Ye[l]) {
          const h = Ye[l];
          if (t.has(h)) {
            const c = t.get(h) || h;
            n.add(c);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function pr(e, t) {
  if (dt && dt.length || typeof process < "u" && process.env && process.env.VITEST) return en(e || "", t);
  if (Rt && Rt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Pr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return en(e || "", t);
}
const da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Pr,
  addMarkdownExtension: fr,
  detectFenceLanguages: en,
  detectFenceLanguagesAsync: pr,
  initRendererWorker: Rt,
  markdownPlugins: dt,
  parseMarkdownToHtml: dn,
  setMarkdownExtensions: Oo
}, Symbol.toStringTag, { value: "Module" })), Bo = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
        const l = new DOMParser().parseFromString(i || "", "text/html"), o = l.body;
        await $r(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function No(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), l = s.body;
        return await $r(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function at(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + ti(e, t);
  } catch {
    return ti(e, t);
  }
}
const qt = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function Do(...e) {
  try {
    qt && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Dn(e) {
  try {
    if (qt) return !0;
  } catch {
  }
  try {
    if (typeof K == "string" && K) return !0;
  } catch {
  }
  try {
    if (Q && Q.size) return !0;
  } catch {
  }
  try {
    if (Pe && Pe.length) return !0;
  } catch {
  }
  return !1;
}
function qo(e, t) {
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
function jo(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  return r.className = "menu-list", t.forEach((a) => {
    const s = document.createElement("li"), l = document.createElement("a");
    try {
      const o = String(a.path || "");
      try {
        l.setAttribute("href", Ce(o));
      } catch {
        o && o.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(o)) : l.setAttribute("href", at(o));
      }
    } catch {
      l.setAttribute("href", "#" + a.path);
    }
    if (l.textContent = a.name, s.appendChild(l), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((h) => {
        const c = document.createElement("li"), u = document.createElement("a");
        try {
          const d = String(h.path || "");
          try {
            u.setAttribute("href", Ce(d));
          } catch {
            d && d.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(d)) : u.setAttribute("href", at(d));
          }
        } catch {
          u.setAttribute("href", "#" + h.path);
        }
        u.textContent = h.name, c.appendChild(u), o.appendChild(c);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function Ho(e, t, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const l = {};
    (t || []).forEach((o) => {
      try {
        if (!o || o.level === 1) return;
        const h = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), u = document.createElement("a"), d = es(o.text || ""), g = o.id || _e(d);
        u.textContent = d;
        try {
          const f = String(n || "").replace(/^[\\.\\/]+/, ""), w = f && D && D.has && D.has(f) ? D.get(f) : f;
          w ? u.href = Ce(w, g) : u.href = `#${encodeURIComponent(g)}`;
        } catch (f) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", f), u.href = `#${encodeURIComponent(g)}`;
        }
        if (c.appendChild(u), h === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((f) => {
            Number(f) > 2 && delete l[f];
          });
          return;
        }
        let m = h - 1;
        for (; m > 2 && !l[m]; ) m--;
        m < 2 && (m = 2);
        let p = l[m];
        if (!p) {
          a.appendChild(c), l[h] = c;
          return;
        }
        let y = p.querySelector("ul");
        y || (y = document.createElement("ul"), p.appendChild(y)), y.appendChild(c), l[h] = c;
      } catch (h) {
        console.warn("[htmlBuilder] buildTocElement item failed", h, o);
      }
    });
  } catch (l) {
    console.warn("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function fa(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = _e(n.textContent || ""));
  });
}
function Uo(e, t, n) {
  try {
    const i = e.querySelectorAll("img");
    if (i && i.length) {
      const r = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
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
function bi(e, t, n) {
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
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (h) => {
          try {
            const c = s.getAttribute(h) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              s.setAttribute(h, new URL(c, r).toString());
            } catch (u) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", h, c, u);
            }
          } catch (c) {
            console.warn("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const u = (s.getAttribute("srcset") || "").split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
            const [g, m] = d.split(/\s+/, 2);
            if (!g || /^(https?:)?\/\//i.test(g) || g.startsWith("/")) return d;
            try {
              const p = new URL(g, r).toString();
              return m ? `${p} ${m}` : p;
            } catch {
              return d;
            }
          }).join(", ");
          s.setAttribute("srcset", u);
        }
      } catch (l) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let wi = "", rr = null, _i = "";
async function $r(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === wi && rr)
      a = rr, s = _i;
    else {
      try {
        a = new URL(t, location.href), s = Pt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Pt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      wi = t, rr = a, _i = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], h = /* @__PURE__ */ new Set(), c = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const d = u.getAttribute("href") || "";
        if (!d || $i(d)) continue;
        try {
          if (d.startsWith("?") || d.indexOf("?") !== -1)
            try {
              const m = new URL(d, t || location.href), p = m.searchParams.get("page");
              if (p && p.indexOf("/") === -1 && n) {
                const y = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (y) {
                  const f = oe(y + p), w = i && i.canonical ? Ce(f, m.hash ? m.hash.replace(/^#/, "") : null) : at(f, m.hash ? m.hash.replace(/^#/, "") : null);
                  u.setAttribute("href", w);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (d.startsWith("/") && !d.endsWith(".md")) continue;
        const g = d.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (g) {
          let m = g[1];
          const p = g[2];
          !m.startsWith("/") && n && (m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + m);
          try {
            const y = new URL(m, t).pathname;
            let f = y.startsWith(s) ? y.slice(s.length) : y;
            f = oe(f), o.push({ node: u, mdPathRaw: m, frag: p, rel: f }), D.has(f) || l.add(f);
          } catch (y) {
            console.warn("[htmlBuilder] resolve mdPath failed", y);
          }
          continue;
        }
        try {
          let m = d;
          !d.startsWith("/") && n && (d.startsWith("#") ? m = n + d : m = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + d);
          const y = new URL(m, t).pathname || "";
          if (y && y.indexOf(s) !== -1) {
            let f = y.startsWith(s) ? y.slice(s.length) : y;
            if (f = oe(f), f = Dt(f), f || (f = kr), !f.endsWith(".md")) {
              let w = null;
              try {
                if (D && D.has && D.has(f))
                  w = D.get(f);
                else
                  try {
                    const b = String(f || "").replace(/^.*\//, "");
                    b && D.has && D.has(b) && (w = D.get(b));
                  } catch (b) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", b);
                  }
              } catch (b) {
                console.warn("[htmlBuilder] mdToSlug access check failed", b);
              }
              if (!w)
                try {
                  const b = String(f || "").replace(/^.*\//, "");
                  for (const [_, x] of Q || [])
                    if (x === f || x === b) {
                      w = _;
                      break;
                    }
                } catch {
                }
              if (w) {
                const b = i && i.canonical ? Ce(w, null) : at(w);
                u.setAttribute("href", b);
              } else {
                let b = f;
                try {
                  /\.[^\/]+$/.test(String(f || "")) || (b = String(f || "") + ".html");
                } catch {
                  b = f;
                }
                h.add(b), c.push({ node: u, rel: b });
              }
            }
          }
        } catch (m) {
          console.warn("[htmlBuilder] resolving href to URL failed", m);
        }
      } catch (d) {
        console.warn("[htmlBuilder] processing anchor failed", d);
      }
    if (l.size)
      if (Dn(t))
        await Promise.all(Array.from(l).map(async (u) => {
          try {
            try {
              const g = String(u).match(/([^\/]+)\.md$/), m = g && g[1];
              if (m && Q.has(m)) {
                try {
                  const p = Q.get(m);
                  if (p)
                    try {
                      D.set(p, m);
                    } catch (y) {
                      console.warn("[htmlBuilder] mdToSlug.set failed", y);
                    }
                } catch (p) {
                  console.warn("[htmlBuilder] reading slugToMd failed", p);
                }
                return;
              }
            } catch (g) {
              console.warn("[htmlBuilder] basename slug lookup failed", g);
            }
            const d = await Se(u, t);
            if (d && d.raw) {
              const g = (d.raw || "").match(/^#\s+(.+)$/m);
              if (g && g[1]) {
                const m = _e(g[1].trim());
                if (m)
                  try {
                    Q.set(m, u), D.set(u, m);
                  } catch (p) {
                    console.warn("[htmlBuilder] setting slug mapping failed", p);
                  }
              }
            }
          } catch (d) {
            console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", d);
          }
        }));
      else {
        try {
          qt && console && typeof console.warn == "function" && console.warn("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(l))
          try {
            const d = String(u).match(/([^\/]+)\.md$/), g = d && d[1];
            if (g) {
              const m = _e(g);
              if (m)
                try {
                  Q.has(m) || Q.set(m, u), D.has(u) || D.set(u, m);
                } catch (p) {
                  console.warn("[htmlBuilder] setting fallback slug mapping failed", p);
                }
            }
          } catch {
          }
      }
    if (h.size)
      if (Dn(t))
        await Promise.all(Array.from(h).map(async (u) => {
          try {
            const d = await Se(u, t);
            if (d && d.raw)
              try {
                const m = (zr || new DOMParser()).parseFromString(d.raw, "text/html"), p = m.querySelector("title"), y = m.querySelector("h1"), f = p && p.textContent && p.textContent.trim() ? p.textContent.trim() : y && y.textContent ? y.textContent.trim() : null;
                if (f) {
                  const w = _e(f);
                  if (w)
                    try {
                      Q.set(w, u), D.set(u, w);
                    } catch (b) {
                      console.warn("[htmlBuilder] setting html slug mapping failed", b);
                    }
                }
              } catch (g) {
                console.warn("[htmlBuilder] parse fetched HTML failed", g);
              }
          } catch (d) {
            console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", d);
          }
        }));
      else {
        try {
          qt && console && typeof console.warn == "function" && console.warn("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(h))
          try {
            const d = String(u).match(/([^\/]+)\.html$/), g = d && d[1];
            if (g) {
              const m = _e(g);
              if (m)
                try {
                  Q.has(m) || Q.set(m, u), D.has(u) || D.set(u, m);
                } catch (p) {
                  console.warn("[htmlBuilder] setting fallback html slug mapping failed", p);
                }
            }
          } catch {
          }
      }
    for (const u of o) {
      const { node: d, frag: g, rel: m } = u;
      let p = null;
      try {
        D.has(m) && (p = D.get(m));
      } catch (y) {
        console.warn("[htmlBuilder] mdToSlug access failed", y);
      }
      if (p) {
        const y = i && i.canonical ? Ce(p, g) : at(p, g);
        d.setAttribute("href", y);
      } else {
        const y = i && i.canonical ? Ce(m, g) : at(m, g);
        d.setAttribute("href", y);
      }
    }
    for (const u of c) {
      const { node: d, rel: g } = u;
      let m = null;
      try {
        D.has(g) && (m = D.get(g));
      } catch (p) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", p);
      }
      if (!m)
        try {
          const p = String(g || "").replace(/^.*\//, "");
          D.has(p) && (m = D.get(p));
        } catch (p) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", p);
        }
      if (m) {
        const p = i && i.canonical ? Ce(m, null) : at(m);
        d.setAttribute("href", p);
      } else {
        const p = i && i.canonical ? Ce(g, null) : at(g);
        d.setAttribute("href", p);
      }
    }
  } catch (r) {
    console.warn("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Fo(e, t, n, i) {
  const r = t.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    let l = "";
    try {
      e && e.meta && e.meta.title && (l = String(e.meta.title).trim());
    } catch {
    }
    if (!l && a && (l = a), !l)
      try {
        const o = t.querySelector("h2");
        o && o.textContent && (l = String(o.textContent).trim());
      } catch {
      }
    !l && n && (l = String(n)), l && (s = _e(l)), s || (s = kr);
    try {
      n && (Q.set(s, n), D.set(n, s));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const h = Je(typeof location < "u" ? location.href : "");
          h && h.anchor && h.page && String(h.page) === String(s) ? o = h.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", at(s, o));
      } catch (h) {
        console.warn("[htmlBuilder] computeSlug history replace failed", h);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    console.warn("[htmlBuilder] computeSlug failed", l);
  }
  try {
    if (e && e.meta && e.meta.title && r) {
      const l = String(e.meta.title).trim();
      if (l && l !== a) {
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
async function Wo(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const h = o.getAttribute("href") || "";
      if (!h) continue;
      let d = oe(h).split(/::|#/, 2)[0];
      try {
        const m = d.indexOf("?");
        m !== -1 && (d = d.slice(0, m));
      } catch {
      }
      if (!d || (d.includes(".") || (d = d + ".html"), !/\.html(?:$|[?#])/.test(d) && !d.toLowerCase().endsWith(".html"))) continue;
      const g = d;
      try {
        if (D && D.has && D.has(g)) continue;
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug check failed", m);
      }
      try {
        let m = !1;
        for (const p of Q.values())
          if (p === g) {
            m = !0;
            break;
          }
        if (m) continue;
      } catch (m) {
        console.warn("[htmlBuilder] slugToMd iteration failed", m);
      }
      n.add(g);
    } catch (h) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", h);
    }
  if (!n.size) return;
  if (!Dn()) {
    try {
      qt && console && typeof console.warn == "function" && console.warn("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const h = String(o).match(/([^\/]+)\.html$/), c = h && h[1];
        if (c) {
          const u = _e(c);
          if (u)
            try {
              Q.has(u) || Q.set(u, o), D.has(o) || D.set(o, u);
            } catch (d) {
              console.warn("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", d);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (o) => {
    try {
      const h = await Se(o, t);
      if (h && h.raw)
        try {
          const u = (zr || new DOMParser()).parseFromString(h.raw, "text/html"), d = u.querySelector("title"), g = u.querySelector("h1"), m = d && d.textContent && d.textContent.trim() ? d.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
          if (m) {
            const p = _e(m);
            if (p)
              try {
                Q.set(p, o), D.set(o, p);
              } catch (y) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", y);
              }
          }
        } catch (c) {
          console.warn("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (h) {
      console.warn("[htmlBuilder] fetchAndExtract failed", h);
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
async function Zo(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Pt(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = oe(l[1]);
        try {
          let h;
          try {
            h = qo(o, t);
          } catch (u) {
            h = o, console.warn("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const c = h && r && h.startsWith(r) ? h.slice(r.length) : String(h || "").replace(/^\//, "");
          n.push({ rel: c }), D.has(c) || i.add(c);
        } catch (h) {
          console.warn("[htmlBuilder] rewriteAnchors failed", h);
        }
        continue;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (Dn())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && Q.has(l)) {
            try {
              const o = Q.get(l);
              o && D.set(o, l);
            } catch (o) {
              console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
            }
            return;
          }
        } catch (s) {
          console.warn("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await Se(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = _e(l[1].trim());
              if (o)
                try {
                  Q.set(o, a), D.set(a, o);
                } catch (h) {
                  console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", h);
                }
            }
          }
        } catch (s) {
          console.warn("[htmlBuilder] preMapMdSlugs fetch failed", s);
        }
      }));
    else
      try {
        qt && console && typeof console.warn == "function" && console.warn("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
}
const zr = typeof DOMParser < "u" ? new DOMParser() : null;
function ir(e) {
  try {
    const n = (zr || new DOMParser()).parseFromString(e || "", "text/html");
    fa(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (h) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", h);
        }
      });
    } catch (l) {
      console.warn("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", h = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (h && h[1]) {
          const c = (h[1] || "").toLowerCase(), u = we.size && (we.get(c) || we.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await on(u);
              } catch (d) {
                console.warn("[htmlBuilder] registerLanguage failed", d);
              }
            })();
          } catch (d) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", d);
          }
        } else
          try {
            if (Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext")) {
              const c = Ee.highlight ? Ee.highlight(l.textContent || "", { language: "plaintext" }) : null;
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
    const s = {};
    try {
      const l = n.querySelector("title");
      l && l.textContent && String(l.textContent).trim() && (s.title = String(l.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: s, toc: r };
  } catch (t) {
    return console.warn("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function Go(e) {
  const t = pr ? await pr(e || "", we) : en(e || "", we), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = we.size && (we.get(r) || we.get(String(r).toLowerCase())) || r;
      try {
        i.push(on(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(on(r));
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
async function Qo(e) {
  if (await Go(e), dn) {
    const t = await dn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function Xo(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = typeof DOMParser < "u" ? new DOMParser() : null;
      if (u) {
        const d = u.parseFromString(t.raw || "", "text/html");
        try {
          bi(d.body, n, r);
        } catch (g) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", g);
        }
        a = ir(d.documentElement && d.documentElement.outerHTML ? d.documentElement.outerHTML : t.raw || "");
      } else
        a = ir(t.raw || "");
    } catch {
      a = ir(t.raw || "");
    }
  else
    a = await Qo(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    bi(s, n, r);
  } catch (u) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    fa(s);
  } catch (u) {
    console.warn("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((d) => {
      try {
        const g = d.getAttribute && d.getAttribute("class") || d.className || "", m = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (m)
          try {
            d.setAttribute && d.setAttribute("class", m);
          } catch (p) {
            d.className = m, console.warn("[htmlBuilder] set element class failed", p);
          }
        else
          try {
            d.removeAttribute && d.removeAttribute("class");
          } catch (p) {
            d.className = "", console.warn("[htmlBuilder] remove element class failed", p);
          }
      } catch (g) {
        console.warn("[htmlBuilder] code element cleanup failed", g);
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] processing code elements failed", u);
  }
  try {
    Qa(s);
  } catch (u) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", u);
  }
  Uo(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((d) => {
      try {
        const g = d.parentElement;
        if (!g || g.tagName.toLowerCase() !== "p" || g.childNodes.length !== 1) return;
        const m = document.createElement("figure");
        m.className = "image", g.replaceWith(m), m.appendChild(d);
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((d) => {
      try {
        if (d.classList)
          d.classList.contains("table") || d.classList.add("table");
        else {
          const g = d.getAttribute && d.getAttribute("class") ? d.getAttribute("class") : "", m = String(g || "").split(/\s+/).filter(Boolean);
          m.indexOf("table") === -1 && m.push("table");
          try {
            d.setAttribute && d.setAttribute("class", m.join(" "));
          } catch {
            d.className = m.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: l, h1Text: o, slugKey: h } = Fo(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const d = a.meta.author ? String(a.meta.author).trim() : "", g = a.meta.date ? String(a.meta.date).trim() : "";
      let m = "";
      try {
        const y = new Date(g);
        g && !isNaN(y.getTime()) ? m = y.toLocaleDateString() : m = g;
      } catch {
        m = g;
      }
      const p = [];
      if (d && p.push(d), m && p.push(m), p.length) {
        const y = document.createElement("p"), f = p[0] ? String(p[0]).replace(/"/g, "").trim() : "", w = p.slice(1);
        if (y.className = "nimbi-article-subtitle is-6 has-text-grey-light", f) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = f, y.appendChild(b);
        }
        if (w.length) {
          const b = document.createElement("span");
          b.className = "nimbi-article-meta", b.textContent = w.join(" • "), y.appendChild(b);
        }
        try {
          l.parentElement.insertBefore(y, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", y);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await Jo(s, r, n);
  } catch (u) {
    Do("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await $r(s, r, n);
  }
  const c = Ho(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: h };
}
function Ko(e) {
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
function ki(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!K)
      try {
        const s = document.createElement("p"), l = t && t("goHome") || "Go back to";
        s.textContent = l + " ";
        const o = document.createElement("a");
        try {
          o.href = Ce(et);
        } catch {
          o.href = Ce(et || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Tn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, K, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const pa = rs(() => {
  const e = Qt(Bo);
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
          const r = { data: await No(n) };
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
function Vo() {
  return pa.get();
}
function Yo(e) {
  return pa.send(e, 2e3);
}
async function Jo(e, t, n) {
  if (!Vo()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Yo({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function el(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = Je(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
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
                history.replaceState({ page: l || a }, "", at(l || a, s));
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
            gr(s);
          } catch (o) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", at(a, s));
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
function gr(e) {
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
function tl(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((p) => typeof p == "string" ? p : ""), o = i || document.querySelector(".nimbi-cms"), h = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let g = document.querySelector(".nimbi-scroll-top");
    if (!g) {
      g = document.createElement("button"), g.className = "nimbi-scroll-top button is-primary is-rounded is-small", g.setAttribute("aria-label", l("scrollToTop")), g.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(g) : o && o.appendChild ? o.appendChild(g) : h && h.appendChild ? h.appendChild(g) : document.body.appendChild(g);
      } catch {
        try {
          document.body.appendChild(g);
        } catch (y) {
          console.warn("[htmlBuilder] append scroll top button failed", y);
        }
      }
      try {
        try {
          Ci(g);
        } catch {
        }
      } catch (p) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", p);
      }
      g.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (y) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", y);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (y) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", y);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (y) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", y);
          }
        }
      });
    }
    const m = u && u.querySelector ? u.querySelector(".menu-label") : null;
    if (t) {
      if (!g._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const p = globalThis.IntersectionObserver, y = new p((f) => {
            for (const w of f)
              w.target instanceof Element && (w.isIntersecting ? (g.classList.remove("show"), m && m.classList.remove("show")) : (g.classList.add("show"), m && m.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          g._nimbiObserver = y;
        } else
          g._nimbiObserver = null;
      try {
        g._nimbiObserver && typeof g._nimbiObserver.disconnect == "function" && g._nimbiObserver.disconnect();
      } catch (p) {
        console.warn("[htmlBuilder] observer disconnect failed", p);
      }
      try {
        g._nimbiObserver && typeof g._nimbiObserver.observe == "function" && g._nimbiObserver.observe(t);
      } catch (p) {
        console.warn("[htmlBuilder] observer observe failed", p);
      }
      try {
        const p = () => {
          try {
            const y = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, f = t.getBoundingClientRect();
            !(f.bottom < y.top || f.top > y.bottom) ? (g.classList.remove("show"), m && m.classList.remove("show")) : (g.classList.add("show"), m && m.classList.add("show"));
          } catch (y) {
            console.warn("[htmlBuilder] checkIntersect failed", y);
          }
        };
        p(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(p, 100);
      } catch (p) {
        console.warn("[htmlBuilder] checkIntersect outer failed", p);
      }
    } else {
      g.classList.remove("show"), m && m.classList.remove("show");
      const p = i instanceof Element ? i : r instanceof Element ? r : window, y = () => {
        try {
          (p === window ? window.scrollY : p.scrollTop || 0) > 10 ? (g.classList.add("show"), m && m.classList.add("show")) : (g.classList.remove("show"), m && m.classList.remove("show"));
        } catch (f) {
          console.warn("[htmlBuilder] onScroll handler failed", f);
        }
      };
      zn(() => p.addEventListener("scroll", y)), y();
    }
  } catch (l) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
const ga = typeof window < "u" && window.__nimbiCMSDebug;
function En(...e) {
  if (ga)
    try {
      console.log(...e);
    } catch {
    }
}
function Ie(...e) {
  if (ga)
    try {
      console.warn(...e);
    } catch {
    }
}
function xi(e, t) {
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
async function nl(e, t, n, i, r, a, s, l, o = "eager", h = 1, c = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const d = typeof DOMParser < "u" ? new DOMParser() : null, g = d ? d.parseFromString(n || "", "text/html") : null, m = g ? g.querySelectorAll("a") : [];
  await zn(() => Wo(m, i)), await zn(() => Zo(m, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let p = null, y = null, f = null, w = null, b = null, _ = null, x = !1, S = null;
  function M() {
    try {
      const v = document.querySelector(".navbar-burger"), O = v && v.dataset ? v.dataset.target : null, N = O ? document.getElementById(O) : null;
      v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), N && N.classList.remove("is-active"));
    } catch (v) {
      Ie("[nimbi-cms] closeMobileMenu failed", v);
    }
  }
  async function q() {
    const v = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      v && v.classList.add("is-inactive");
    } catch {
    }
    try {
      const O = s && s();
      O && typeof O.then == "function" && await O;
    } catch (O) {
      try {
        Ie("[nimbi-cms] renderByQuery failed", O);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              v && v.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            v && v.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          v && v.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  const H = () => p || (p = (async () => {
    try {
      const v = await Promise.resolve().then(() => Tt), O = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, N = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, z = xi(v, "buildSearchIndex"), C = xi(v, "buildSearchIndexWorker"), P = typeof O == "function" ? O : z || void 0, W = typeof N == "function" ? N : C || void 0;
      En("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof P + " workerFn=" + typeof W + " (global preferred)");
      const ie = [];
      try {
        r && ie.push(r);
      } catch {
      }
      try {
        navigationPage && ie.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof W == "function")
        try {
          const R = await W(i, h, c, ie.length ? ie : void 0);
          if (R && R.length) {
            try {
              if (v && typeof v._setSearchIndex == "function")
                try {
                  v._setSearchIndex(R);
                } catch {
                }
            } catch {
            }
            return R;
          }
        } catch (R) {
          Ie("[nimbi-cms] worker builder threw", R);
        }
      return typeof P == "function" ? (En("[nimbi-cms test] calling buildFn"), await P(i, h, c, ie.length ? ie : void 0)) : [];
    } catch (v) {
      return Ie("[nimbi-cms] buildSearchIndex failed", v), [];
    } finally {
      if (y) {
        try {
          y.removeAttribute("disabled");
        } catch {
        }
        try {
          f && f.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), p.then((v) => {
    try {
      try {
        S = Array.isArray(v) ? v : null;
      } catch {
        S = null;
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const C = await Promise.resolve().then(() => Tt);
                try {
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return C && Array.isArray(C.searchIndex) ? C.searchIndex : Array.isArray(S) ? S : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = C && Array.isArray(C.searchIndex) ? C.searchIndex : Array.isArray(S) ? S : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(F) ? F : Array.isArray(S) ? S : [];
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
            window.__nimbi_indexDepth = h;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = c;
          } catch {
          }
        }
      } catch {
      }
      const O = String(y && y.value || "").trim().toLowerCase();
      if (!O || !Array.isArray(v) || !v.length) return;
      const N = v.filter((C) => C.title && C.title.toLowerCase().includes(O) || C.excerpt && C.excerpt.toLowerCase().includes(O));
      if (!N || !N.length) return;
      const z = document.getElementById("nimbi-search-results");
      if (!z) return;
      z.innerHTML = "";
      try {
        const C = document.createElement("div");
        C.className = "panel nimbi-search-panel", N.slice(0, 10).forEach((P) => {
          try {
            if (P.parentTitle) {
              const R = document.createElement("p");
              R.className = "panel-heading nimbi-search-title nimbi-search-parent", R.textContent = P.parentTitle, C.appendChild(R);
            }
            const W = document.createElement("a");
            W.className = "panel-block nimbi-search-result", W.href = Ce(P.slug), W.setAttribute("role", "button");
            try {
              if (P.path && typeof P.slug == "string") {
                try {
                  Q.set(P.slug, P.path);
                } catch {
                }
                try {
                  D.set(P.path, P.slug);
                } catch {
                }
              }
            } catch {
            }
            const ie = document.createElement("div");
            ie.className = "is-size-6 has-text-weight-semibold", ie.textContent = P.title, W.appendChild(ie), W.addEventListener("click", () => {
              try {
                z.style.display = "none";
              } catch {
              }
            }), C.appendChild(W);
          } catch {
          }
        }), z.appendChild(C);
        try {
          z.style.display = "block";
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
        const v = await Promise.resolve().then(() => an);
        try {
          await v.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
        } catch (O) {
          Ie("[nimbi-cms] sitemap trigger failed", O);
        }
      } catch (v) {
        try {
          Ie("[nimbi-cms] sitemap dynamic import failed", v);
        } catch {
        }
      }
    })();
  }), p), B = document.createElement("nav");
  B.className = "navbar", B.setAttribute("role", "navigation"), B.setAttribute("aria-label", "main navigation");
  const Z = document.createElement("div");
  Z.className = "navbar-brand";
  const G = m[0], E = document.createElement("a");
  if (E.className = "navbar-item", G) {
    const v = G.getAttribute("href") || "#";
    try {
      const N = new URL(v, location.href).searchParams.get("page"), z = N ? decodeURIComponent(N) : r;
      let C = null;
      try {
        typeof z == "string" && (/(?:\.md|\.html?)$/i.test(z) || z.includes("/")) && (C = A(z));
      } catch {
      }
      !C && typeof z == "string" && !String(z).includes(".") && (C = z);
      const P = C || z;
      E.href = Ce(P), (!E.textContent || !String(E.textContent).trim()) && (E.textContent = a("home"));
    } catch {
      try {
        const N = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? A(r) : typeof r == "string" && !r.includes(".") ? r : null;
        E.href = Ce(N || r);
      } catch {
        E.href = Ce(r);
      }
      E.textContent = a("home");
    }
  } else
    E.href = Ce(r), E.textContent = a("home");
  async function T(v) {
    try {
      if (!v || v === "none") return null;
      if (v === "favicon")
        try {
          const O = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!O) return null;
          const N = O.getAttribute("href") || "";
          return N && /\.png(?:\?|$)/i.test(N) ? new URL(N, location.href).toString() : null;
        } catch {
          return null;
        }
      if (v === "copy-first" || v === "move-first")
        try {
          const O = await Se(r, i);
          if (!O || !O.raw) return null;
          const C = new DOMParser().parseFromString(O.raw, "text/html").querySelector("img");
          if (!C) return null;
          const P = C.getAttribute("src") || "";
          if (!P) return null;
          const W = new URL(P, location.href).toString();
          if (v === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", W);
            } catch {
            }
          return W;
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
  let ne = null;
  try {
    ne = await T(u);
  } catch {
    ne = null;
  }
  if (ne)
    try {
      const v = document.createElement("img");
      v.className = "nimbi-navbar-logo";
      const O = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      v.alt = O, v.title = O, v.src = ne;
      try {
        v.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!E.textContent || !String(E.textContent).trim()) && (E.textContent = O);
      } catch {
      }
      try {
        E.insertBefore(v, E.firstChild);
      } catch {
        try {
          E.appendChild(v);
        } catch {
        }
      }
    } catch {
    }
  Z.appendChild(E), E.addEventListener("click", function(v) {
    const O = E.getAttribute("href") || "";
    if (O.startsWith("?page=")) {
      v.preventDefault();
      const N = new URL(O, location.href), z = N.searchParams.get("page"), C = N.hash ? N.hash.replace(/^#/, "") : null;
      history.pushState({ page: z }, "", Ce(z, C)), q();
      try {
        M();
      } catch {
      }
    }
  });
  function A(v) {
    try {
      if (!v) return null;
      const O = oe(String(v || ""));
      try {
        if (D && D.has(O)) return D.get(O);
      } catch {
      }
      const N = O.replace(/^.*\//, "");
      try {
        if (D && D.has(N)) return D.get(N);
      } catch {
      }
      try {
        for (const [z, C] of Q.entries())
          if (C) {
            if (typeof C == "string") {
              if (oe(C) === O) return z;
            } else if (C && typeof C == "object") {
              if (C.default && oe(C.default) === O) return z;
              const P = C.langs || {};
              for (const W in P)
                if (P[W] && oe(P[W]) === O) return z;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const I = document.createElement("a");
  I.className = "navbar-burger", I.setAttribute("role", "button"), I.setAttribute("aria-label", "menu"), I.setAttribute("aria-expanded", "false");
  const te = "nimbi-navbar-menu";
  I.dataset.target = te, I.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', Z.appendChild(I);
  try {
    I.addEventListener("click", (v) => {
      try {
        const O = I.dataset && I.dataset.target ? I.dataset.target : null, N = O ? document.getElementById(O) : null;
        I.classList.contains("is-active") ? (I.classList.remove("is-active"), I.setAttribute("aria-expanded", "false"), N && N.classList.remove("is-active")) : (I.classList.add("is-active"), I.setAttribute("aria-expanded", "true"), N && N.classList.add("is-active"));
      } catch (O) {
        Ie("[nimbi-cms] navbar burger toggle failed", O);
      }
    });
  } catch (v) {
    Ie("[nimbi-cms] burger event binding failed", v);
  }
  const Le = document.createElement("div");
  Le.className = "navbar-menu", Le.id = te;
  const J = document.createElement("div");
  J.className = "navbar-start";
  let ke = null, he = null;
  if (!l)
    ke = null, y = null, w = null, b = null, _ = null;
  else {
    ke = document.createElement("div"), ke.className = "navbar-end", he = document.createElement("div"), he.className = "navbar-item", y = document.createElement("input"), y.className = "input", y.type = "search", y.placeholder = a("searchPlaceholder") || "", y.id = "nimbi-search";
    try {
      const C = (a && typeof a == "function" ? a("searchAria") : null) || y.placeholder || "Search";
      try {
        y.setAttribute("aria-label", C);
      } catch {
      }
      try {
        y.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        y.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        y.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    o === "eager" && (y.disabled = !0), f = document.createElement("div"), f.className = "control", o === "eager" && f.classList.add("is-loading"), f.appendChild(y), he.appendChild(f), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const v = document.createElement("div");
    v.className = "dropdown-trigger", v.appendChild(he);
    const O = document.createElement("div");
    O.className = "dropdown-menu", O.setAttribute("role", "menu"), b = document.createElement("div"), b.id = "nimbi-search-results", b.className = "dropdown-content nimbi-search-results", _ = b, O.appendChild(b), w.appendChild(v), w.appendChild(O), ke.appendChild(w);
    const N = (C) => {
      if (!b) return;
      b.innerHTML = "";
      let P = -1;
      function W(V) {
        try {
          const ae = b.querySelector(".nimbi-search-result.is-selected");
          ae && ae.classList.remove("is-selected");
          const Ae = b.querySelectorAll(".nimbi-search-result");
          if (!Ae || !Ae.length) return;
          if (V < 0) {
            P = -1;
            return;
          }
          V >= Ae.length && (V = Ae.length - 1);
          const me = Ae[V];
          if (me) {
            me.classList.add("is-selected"), P = V;
            try {
              me.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function ie(V) {
        try {
          const ae = V.key, Ae = b.querySelectorAll(".nimbi-search-result");
          if (!Ae || !Ae.length) return;
          if (ae === "ArrowDown") {
            V.preventDefault();
            const me = P < 0 ? 0 : Math.min(Ae.length - 1, P + 1);
            W(me);
            return;
          }
          if (ae === "ArrowUp") {
            V.preventDefault();
            const me = P <= 0 ? 0 : P - 1;
            W(me);
            return;
          }
          if (ae === "Enter") {
            V.preventDefault();
            const me = b.querySelector(".nimbi-search-result.is-selected") || b.querySelector(".nimbi-search-result");
            if (me)
              try {
                me.click();
              } catch {
              }
            return;
          }
          if (ae === "Escape") {
            try {
              w.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              b.style.display = "none";
            } catch {
            }
            try {
              b.classList.remove("is-open");
            } catch {
            }
            try {
              b.removeAttribute("tabindex");
            } catch {
            }
            try {
              b.removeEventListener("keydown", ie);
            } catch {
            }
            try {
              y && y.focus();
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", R);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function R(V) {
        try {
          if (V && V.key === "ArrowDown") {
            V.preventDefault();
            try {
              b.focus();
            } catch {
            }
            W(0);
          }
        } catch {
        }
      }
      try {
        const V = document.createElement("div");
        V.className = "panel nimbi-search-panel", C.forEach((ae) => {
          if (ae.parentTitle) {
            const le = document.createElement("p");
            le.textContent = ae.parentTitle, le.className = "panel-heading nimbi-search-title nimbi-search-parent", V.appendChild(le);
          }
          const Ae = document.createElement("a");
          Ae.className = "panel-block nimbi-search-result", Ae.href = Ce(ae.slug), Ae.setAttribute("role", "button");
          try {
            if (ae.path && typeof ae.slug == "string") {
              try {
                Q.set(ae.slug, ae.path);
              } catch {
              }
              try {
                D.set(ae.path, ae.slug);
              } catch {
              }
            }
          } catch {
          }
          const me = document.createElement("div");
          me.className = "is-size-6 has-text-weight-semibold", me.textContent = ae.title, Ae.appendChild(me), Ae.addEventListener("click", () => {
            if (w) {
              w.classList.remove("is-active");
              try {
                document.documentElement.classList.remove("nimbi-search-open");
              } catch {
              }
            }
            try {
              b.style.display = "none";
            } catch {
            }
            try {
              b.classList.remove("is-open");
            } catch {
            }
            try {
              b.removeAttribute("tabindex");
            } catch {
            }
            try {
              b.removeEventListener("keydown", ie);
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", R);
            } catch {
            }
          }), V.appendChild(Ae);
        }), b.appendChild(V);
      } catch {
      }
      if (w) {
        w.classList.add("is-active");
        try {
          document.documentElement.classList.add("nimbi-search-open");
        } catch {
        }
      }
      try {
        b.style.display = "block";
      } catch {
      }
      try {
        b.classList.add("is-open");
      } catch {
      }
      try {
        b.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        b.addEventListener("keydown", ie);
      } catch {
      }
      try {
        y && y.addEventListener("keydown", R);
      } catch {
      }
    }, z = (C, P) => {
      let W = null;
      return (...ie) => {
        W && clearTimeout(W), W = setTimeout(() => C(...ie), P);
      };
    };
    if (y) {
      const C = z(async () => {
        const P = document.querySelector("input#nimbi-search"), W = String(P && P.value || "").trim().toLowerCase();
        if (!W) {
          N([]);
          return;
        }
        try {
          await H();
          const ie = await p;
          En('[nimbi-cms test] search handleInput q="' + W + '" idxlen=' + (Array.isArray(ie) ? ie.length : "nil"));
          const R = ie.filter((V) => V.title && V.title.toLowerCase().includes(W) || V.excerpt && V.excerpt.toLowerCase().includes(W));
          En("[nimbi-cms test] filtered len=" + (Array.isArray(R) ? R.length : "nil")), N(R.slice(0, 10));
        } catch (ie) {
          Ie("[nimbi-cms] search input handler failed", ie), N([]);
        }
      }, 50);
      try {
        y.addEventListener("input", C);
      } catch {
      }
      try {
        document.addEventListener("input", (P) => {
          try {
            P && P.target && P.target.id === "nimbi-search" && C(P);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        p = H();
      } catch (C) {
        Ie("[nimbi-cms] eager search index init failed", C), p = Promise.resolve([]);
      }
      p.finally(() => {
        const C = document.querySelector("input#nimbi-search");
        if (C) {
          try {
            C.removeAttribute("disabled");
          } catch {
          }
          try {
            f && f.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (x) return;
            x = !0;
            const P = await p.catch(() => []), W = await Promise.resolve().then(() => an);
            try {
              await W.handleSitemapRequest({ index: Array.isArray(P) ? P : void 0, homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
            } catch (ie) {
              Ie("[nimbi-cms] sitemap trigger failed", ie);
            }
          } catch (P) {
            try {
              Ie("[nimbi-cms] sitemap dynamic import failed", P);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const C = (P) => {
        try {
          const W = P && P.target;
          if (!_ || !_.classList.contains("is-open") && _.style && _.style.display !== "block" || W && (_.contains(W) || y && (W === y || y.contains && y.contains(W)))) return;
          if (w) {
            w.classList.remove("is-active");
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
      document.addEventListener("click", C, !0), document.addEventListener("touchstart", C, !0);
    } catch {
    }
  }
  for (let v = 0; v < m.length; v++) {
    const O = m[v];
    if (v === 0) continue;
    const N = O.getAttribute("href") || "#", z = document.createElement("a");
    z.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(N) || N.endsWith(".md")) {
        const P = oe(N).split(/::|#/, 2), W = P[0], ie = P[1], R = A(W);
        R ? z.href = Ce(R, ie) : z.href = Ce(W, ie);
      } else if (/\.html(?:$|[#?])/.test(N) || N.endsWith(".html")) {
        const P = oe(N).split(/::|#/, 2);
        let W = P[0];
        W && !W.toLowerCase().endsWith(".html") && (W = W + ".html");
        const ie = P[1], R = A(W);
        if (R)
          z.href = Ce(R, ie);
        else
          try {
            const V = await Se(W, i);
            if (V && V.raw)
              try {
                const Ae = new DOMParser().parseFromString(V.raw, "text/html"), me = Ae.querySelector("title"), le = Ae.querySelector("h1"), de = me && me.textContent && me.textContent.trim() ? me.textContent.trim() : le && le.textContent ? le.textContent.trim() : null;
                if (de) {
                  const ge = _e(de);
                  if (ge) {
                    try {
                      Q.set(ge, W), D.set(W, ge);
                    } catch (qe) {
                      Ie("[nimbi-cms] slugToMd/mdToSlug set failed", qe);
                    }
                    z.href = Ce(ge, ie);
                  } else
                    z.href = Ce(W, ie);
                } else
                  z.href = Ce(W, ie);
              } catch {
                z.href = Ce(W, ie);
              }
            else
              z.href = N;
          } catch {
            z.href = N;
          }
      } else
        z.href = N;
    } catch (C) {
      Ie("[nimbi-cms] nav item href parse failed", C), z.href = N;
    }
    try {
      const C = O.textContent && String(O.textContent).trim() ? String(O.textContent).trim() : null;
      if (C)
        try {
          const P = _e(C);
          if (P) {
            const W = z.getAttribute("href") || "";
            let ie = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(W))
              ie = oe(String(W || "").split(/[?#]/)[0]);
            else
              try {
                const R = Je(W);
                R && R.type === "canonical" && R.page && (ie = oe(R.page));
              } catch {
              }
            if (ie) {
              let R = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(ie || "")))
                  R = !0;
                else {
                  const V = String(ie || "").replace(/^\.\//, ""), ae = V.replace(/^.*\//, "");
                  Array.isArray(Pe) && Pe.length && (Pe.includes(V) || Pe.includes(ae)) && (R = !0);
                }
              } catch {
                R = !1;
              }
              if (R) {
                try {
                  Q.set(P, ie);
                } catch {
                }
                try {
                  D.set(ie, P);
                } catch {
                }
              }
            }
          }
        } catch (P) {
          Ie("[nimbi-cms] nav slug mapping failed", P);
        }
    } catch (C) {
      Ie("[nimbi-cms] nav slug mapping failed", C);
    }
    z.textContent = O.textContent || N, J.appendChild(z);
  }
  Le.appendChild(J), ke && Le.appendChild(ke), B.appendChild(Z), B.appendChild(Le), e.appendChild(B);
  try {
    const v = (O) => {
      try {
        const N = B && B.querySelector ? B.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!N || !N.classList.contains("is-active")) return;
        const z = N && N.closest ? N.closest(".navbar") : B;
        if (z && z.contains(O.target)) return;
        M();
      } catch {
      }
    };
    document.addEventListener("click", v, !0), document.addEventListener("touchstart", v, !0);
  } catch {
  }
  try {
    Le.addEventListener("click", (v) => {
      const O = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!O) return;
      const N = O.getAttribute("href") || "";
      try {
        const z = new URL(N, location.href), C = z.searchParams.get("page"), P = z.hash ? z.hash.replace(/^#/, "") : null;
        C && (v.preventDefault(), history.pushState({ page: C }, "", Ce(C, P)), q());
      } catch (z) {
        Ie("[nimbi-cms] navbar click handler failed", z);
      }
      try {
        const z = B && B.querySelector ? B.querySelector(".navbar-burger") : null, C = z && z.dataset ? z.dataset.target : null, P = C ? document.getElementById(C) : null;
        z && z.classList.contains("is-active") && (z.classList.remove("is-active"), z.setAttribute("aria-expanded", "false"), P && P.classList.remove("is-active"));
      } catch (z) {
        Ie("[nimbi-cms] mobile menu close failed", z);
      }
    });
  } catch (v) {
    Ie("[nimbi-cms] attach content click handler failed", v);
  }
  try {
    t.addEventListener("click", (v) => {
      const O = v.target && v.target.closest ? v.target.closest("a") : null;
      if (!O) return;
      const N = O.getAttribute("href") || "";
      if (N && !$i(N))
        try {
          const z = new URL(N, location.href), C = z.searchParams.get("page"), P = z.hash ? z.hash.replace(/^#/, "") : null;
          C && (v.preventDefault(), history.pushState({ page: C }, "", Ce(C, P)), q());
        } catch (z) {
          Ie("[nimbi-cms] container click URL parse failed", z);
        }
    });
  } catch (v) {
    Ie("[nimbi-cms] build navbar failed", v);
  }
  return { navbar: B, linkEls: m };
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
let We = null, se = null, De = 1, ht = (e, t) => t, tn = 0, nn = 0, Pn = () => {
}, Gt = 0.25;
function rl() {
  if (We && document.contains(We)) return We;
  We = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", ht("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (A) => {
    A.target === e && ar();
  }), e.addEventListener("wheel", (A) => {
    if (!B()) return;
    A.preventDefault();
    const I = A.deltaY < 0 ? Gt : -Gt;
    gt(De + I), h(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (A) => {
    if (A.key === "Escape") {
      ar();
      return;
    }
    if (De > 1) {
      const I = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!I) return;
      const te = 40;
      switch (A.key) {
        case "ArrowUp":
          I.scrollTop -= te, A.preventDefault();
          break;
        case "ArrowDown":
          I.scrollTop += te, A.preventDefault();
          break;
        case "ArrowLeft":
          I.scrollLeft -= te, A.preventDefault();
          break;
        case "ArrowRight":
          I.scrollLeft += te, A.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), We = e, se = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function h() {
    l && (l.textContent = `${Math.round(De * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(De * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Pn = h, i.addEventListener("click", () => {
    gt(De + Gt), h(), c();
  }), r.addEventListener("click", () => {
    gt(De - Gt), h(), c();
  }), t.addEventListener("click", () => {
    rn(), h(), c();
  }), n.addEventListener("click", () => {
    gt(1), h(), c();
  }), a.addEventListener("click", () => {
    rn(), h(), c();
  }), s.addEventListener("click", ar), t.title = ht("imagePreviewFit", "Fit to screen"), n.title = ht("imagePreviewOriginal", "Original size"), r.title = ht("imagePreviewZoomOut", "Zoom out"), i.title = ht("imagePreviewZoomIn", "Zoom in"), s.title = ht("imagePreviewClose", "Close"), s.setAttribute("aria-label", ht("imagePreviewClose", "Close"));
  let u = !1, d = 0, g = 0, m = 0, p = 0;
  const y = /* @__PURE__ */ new Map();
  let f = 0, w = 1;
  const b = (A, I) => {
    const te = A.x - I.x, Le = A.y - I.y;
    return Math.hypot(te, Le);
  }, _ = () => {
    u = !1, y.clear(), f = 0, se && (se.classList.add("is-panning"), se.classList.remove("is-grabbing"));
  };
  let x = 0, S = 0, M = 0;
  const q = (A) => {
    const I = Date.now(), te = I - x, Le = A.clientX - S, J = A.clientY - M;
    x = I, S = A.clientX, M = A.clientY, te < 300 && Math.hypot(Le, J) < 30 && (gt(De > 1 ? 1 : 2), h(), A.preventDefault());
  }, H = (A) => {
    gt(De > 1 ? 1 : 2), h(), A.preventDefault();
  }, B = () => We ? typeof We.open == "boolean" ? We.open : We.classList.contains("is-active") : !1, Z = (A, I, te = 1) => {
    if (y.has(te) && y.set(te, { x: A, y: I }), y.size === 2) {
      const he = Array.from(y.values()), v = b(he[0], he[1]);
      if (f > 0) {
        const O = v / f;
        gt(w * O);
      }
      return;
    }
    if (!u) return;
    const Le = se.closest(".nimbi-image-preview__image-wrapper");
    if (!Le) return;
    const J = A - d, ke = I - g;
    Le.scrollLeft = m - J, Le.scrollTop = p - ke;
  }, G = (A, I, te = 1) => {
    if (!B()) return;
    if (y.set(te, { x: A, y: I }), y.size === 2) {
      const ke = Array.from(y.values());
      f = b(ke[0], ke[1]), w = De;
      return;
    }
    const Le = se.closest(".nimbi-image-preview__image-wrapper");
    !Le || !(Le.scrollWidth > Le.clientWidth || Le.scrollHeight > Le.clientHeight) || (u = !0, d = A, g = I, m = Le.scrollLeft, p = Le.scrollTop, se.classList.add("is-panning"), se.classList.remove("is-grabbing"), window.addEventListener("pointermove", E), window.addEventListener("pointerup", T), window.addEventListener("pointercancel", T));
  }, E = (A) => {
    u && (A.preventDefault(), Z(A.clientX, A.clientY, A.pointerId));
  }, T = () => {
    _(), window.removeEventListener("pointermove", E), window.removeEventListener("pointerup", T), window.removeEventListener("pointercancel", T);
  };
  se.addEventListener("pointerdown", (A) => {
    A.preventDefault(), G(A.clientX, A.clientY, A.pointerId);
  }), se.addEventListener("pointermove", (A) => {
    (u || y.size === 2) && A.preventDefault(), Z(A.clientX, A.clientY, A.pointerId);
  }), se.addEventListener("pointerup", (A) => {
    A.preventDefault(), A.pointerType === "touch" && q(A), _();
  }), se.addEventListener("dblclick", H), se.addEventListener("pointercancel", _), se.addEventListener("mousedown", (A) => {
    A.preventDefault(), G(A.clientX, A.clientY, 1);
  }), se.addEventListener("mousemove", (A) => {
    u && A.preventDefault(), Z(A.clientX, A.clientY, 1);
  }), se.addEventListener("mouseup", (A) => {
    A.preventDefault(), _();
  });
  const ne = e.querySelector(".nimbi-image-preview__image-wrapper");
  return ne && (ne.addEventListener("pointerdown", (A) => {
    if (G(A.clientX, A.clientY, A.pointerId), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), ne.addEventListener("pointermove", (A) => {
    Z(A.clientX, A.clientY, A.pointerId);
  }), ne.addEventListener("pointerup", _), ne.addEventListener("pointercancel", _), ne.addEventListener("mousedown", (A) => {
    if (G(A.clientX, A.clientY, 1), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), ne.addEventListener("mousemove", (A) => {
    Z(A.clientX, A.clientY, 1);
  }), ne.addEventListener("mouseup", _)), e;
}
function gt(e) {
  if (!se) return;
  const t = Number(e);
  De = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = se.getBoundingClientRect(), r = tn || se.naturalWidth || se.width || i.width || 0, a = nn || se.naturalHeight || se.height || i.height || 0;
  if (r && a) {
    se.style.setProperty("--nimbi-preview-img-max-width", "none"), se.style.setProperty("--nimbi-preview-img-max-height", "none"), se.style.setProperty("--nimbi-preview-img-width", `${r * De}px`), se.style.setProperty("--nimbi-preview-img-height", `${a * De}px`), se.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      se.style.width = `${r * De}px`, se.style.height = `${a * De}px`, se.style.transform = "none";
    } catch {
    }
  } else {
    se.style.setProperty("--nimbi-preview-img-max-width", ""), se.style.setProperty("--nimbi-preview-img-max-height", ""), se.style.setProperty("--nimbi-preview-img-width", ""), se.style.setProperty("--nimbi-preview-img-height", ""), se.style.setProperty("--nimbi-preview-img-transform", `scale(${De})`);
    try {
      se.style.transform = `scale(${De})`;
    } catch {
    }
  }
  se && (se.classList.add("is-panning"), se.classList.remove("is-grabbing"));
}
function rn() {
  if (!se) return;
  const e = se.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = tn || se.naturalWidth || t.width, i = nn || se.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  gt(Number.isFinite(s) ? s : 1);
}
function il(e, t = "", n = 0, i = 0) {
  const r = rl();
  De = 1, tn = n || 0, nn = i || 0, se.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", h = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = ht("imagePreviewDefaultAlt", h || "Image");
      } catch {
        t = ht("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  se.alt = t, se.style.transform = "scale(1)";
  const a = () => {
    tn = se.naturalWidth || se.width || 0, nn = se.naturalHeight || se.height || 0;
  };
  if (a(), rn(), Pn(), requestAnimationFrame(() => {
    rn(), Pn();
  }), !tn || !nn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        rn(), Pn();
      }), se.removeEventListener("load", s);
    };
    se.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function ar() {
  if (We) {
    typeof We.close == "function" && We.open && We.close(), We.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function al(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  ht = (g, m) => (typeof t == "function" ? t(g) : void 0) || m, Gt = n, e.addEventListener("click", (g) => {
    const m = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!m || m.tagName !== "IMG") return;
    const p = (
      /** @type {HTMLImageElement} */
      m
    );
    if (!p.src) return;
    const y = p.closest("a");
    y && y.getAttribute("href") || il(p.src, p.alt || "", p.naturalWidth || 0, p.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let h = 0, c = 1;
  const u = (g, m) => {
    const p = g.x - m.x, y = g.y - m.y;
    return Math.hypot(p, y);
  };
  e.addEventListener("pointerdown", (g) => {
    const m = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!m || m.tagName !== "IMG") return;
    const p = m.closest("a");
    if (p && p.getAttribute("href") || !We || !We.open) return;
    if (o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      const f = Array.from(o.values());
      h = u(f[0], f[1]), c = De;
      return;
    }
    const y = m.closest(".nimbi-image-preview__image-wrapper");
    if (y && !(De <= 1)) {
      g.preventDefault(), i = !0, r = g.clientX, a = g.clientY, s = y.scrollLeft, l = y.scrollTop, m.setPointerCapture(g.pointerId);
      try {
        m.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (g) => {
    if (o.has(g.pointerId) && o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      g.preventDefault();
      const b = Array.from(o.values()), _ = u(b[0], b[1]);
      if (h > 0) {
        const x = _ / h;
        gt(c * x);
      }
      return;
    }
    if (!i) return;
    g.preventDefault();
    const m = (
      /** @type {HTMLElement} */
      g.target
    ), p = m.closest && m.closest("a");
    if (p && p.getAttribute && p.getAttribute("href")) return;
    const y = m.closest(".nimbi-image-preview__image-wrapper");
    if (!y) return;
    const f = g.clientX - r, w = g.clientY - a;
    y.scrollLeft = s - f, y.scrollTop = l - w;
  });
  const d = () => {
    i = !1, o.clear(), h = 0;
    try {
      const g = document.querySelector("[data-nimbi-preview-image]");
      g && (g.classList.add("is-panning"), g.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", d), e.addEventListener("pointercancel", d);
}
function ct(...e) {
  try {
    typeof globalThis < "u" && globalThis.__nimbiCMSDebug && console.warn(...e);
  } catch {
  }
}
function sl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: h
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const u = jo(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  async function d(f, w) {
    let b, _, x;
    try {
      ({ data: b, pagePath: _, anchor: x } = await $s(f, s));
    } catch (G) {
      const E = G && G.message ? String(G.message) : "", T = (!K || typeof K != "string" || !K) && /no page data/i.test(E);
      try {
        if (T)
          try {
            console && typeof console.warn == "function" && console.warn("[nimbi-cms] fetchPageData (expected missing)", G);
          } catch {
          }
        else
          console.error("[nimbi-cms] fetchPageData failed", G);
      } catch {
      }
      try {
        !K && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      ki(t, a, G);
      return;
    }
    !x && w && (x = w);
    try {
      gr(null);
    } catch (G) {
      ct("[nimbi-cms] scrollToAnchorOrTop failed", G);
    }
    t.innerHTML = "";
    const { article: S, parsed: M, toc: q, topH1: H, h1Text: B, slugKey: Z } = await Xo(a, b, _, x, s);
    Ms(a, o, M, q, S, _, x, H, B, Z, b), n.innerHTML = "", q && (n.appendChild(q), el(q));
    try {
      await h("transformHtml", { article: S, parsed: M, toc: q, pagePath: _, anchor: x, topH1: H, h1Text: B, slugKey: Z, data: b });
    } catch (G) {
      ct("[nimbi-cms] transformHtml hooks failed", G);
    }
    t.appendChild(S);
    try {
      Ko(S);
    } catch (G) {
      ct("[nimbi-cms] executeEmbeddedScripts failed", G);
    }
    try {
      al(S, { t: a });
    } catch (G) {
      ct("[nimbi-cms] attachImagePreview failed", G);
    }
    try {
      vn(i, 100, !1), requestAnimationFrame(() => vn(i, 100, !1)), setTimeout(() => vn(i, 100, !1), 250);
    } catch (G) {
      ct("[nimbi-cms] setEagerForAboveFoldImages failed", G);
    }
    gr(x), tl(S, H, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await h("onPageLoad", { data: b, pagePath: _, anchor: x, article: S, toc: q, topH1: H, h1Text: B, slugKey: Z, contentWrap: t, navWrap: n });
    } catch (G) {
      ct("[nimbi-cms] onPageLoad hooks failed", G);
    }
    c = _;
  }
  async function g() {
    try {
      if (typeof window < "u" && window.__nimbiCMSDebug)
        try {
          window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}, window.__nimbiCMSDebug.renderByQuery = (window.__nimbiCMSDebug.renderByQuery || 0) + 1;
        } catch {
        }
      let f = Je(location.href);
      if (f && f.type === "path" && f.page)
        try {
          let _ = "?page=" + encodeURIComponent(f.page || "");
          f.params && (_ += (_.includes("?") ? "&" : "?") + f.params), f.anchor && (_ += "#" + encodeURIComponent(f.anchor));
          try {
            history.replaceState(history.state, "", _);
          } catch {
            try {
              history.replaceState({}, "", _);
            } catch {
            }
          }
          f = Je(location.href);
        } catch {
        }
      const w = f && f.page ? f.page : l, b = f && f.anchor ? f.anchor : null;
      await d(w, b);
    } catch (f) {
      ct("[nimbi-cms] renderByQuery failed", f);
      try {
        !K && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      ki(t, a, f);
    }
  }
  window.addEventListener("popstate", g);
  const m = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, p = () => {
    try {
      const f = i || document.querySelector(".nimbi-cms");
      if (!f) return;
      const w = {
        top: f.scrollTop || 0,
        left: f.scrollLeft || 0
      };
      sessionStorage.setItem(m(), JSON.stringify(w));
    } catch (f) {
      ct("[nimbi-cms] save scroll position failed", f);
    }
  }, y = () => {
    try {
      const f = i || document.querySelector(".nimbi-cms");
      if (!f) return;
      const w = sessionStorage.getItem(m());
      if (!w) return;
      const b = JSON.parse(w);
      b && typeof b.top == "number" && f.scrollTo({ top: b.top, left: b.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (f) => {
    if (f.persisted)
      try {
        y(), vn(i, 100, !1);
      } catch (w) {
        ct("[nimbi-cms] bfcache restore failed", w);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      p();
    } catch (f) {
      ct("[nimbi-cms] save scroll position failed", f);
    }
  }), { renderByQuery: g, siteNav: u, getCurrentPagePath: () => c };
}
function ol(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = Je(window.location.href);
        if (a && a.params) t = a.params.startsWith("?") ? a.params : "?" + a.params;
        else {
          const s = window.location.hash, l = s.indexOf("?");
          l !== -1 && (t = s.slice(l));
        }
      } catch {
        const s = window.location.hash, l = s.indexOf("?");
        l !== -1 && (t = s.slice(l));
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
    if (n.has("homePage") && (i.homePage = n.get("homePage")), n.has("navigationPage") && (i.navigationPage = n.get("navigationPage")), n.has("notFoundPage")) {
      const a = n.get("notFoundPage");
      i.notFoundPage = a === "null" ? null : a;
    }
    if (n.has("availableLanguages") && (i.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("indexDepth")) {
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
function ll(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function sr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let Ln = "";
async function _l(e = {}) {
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
  const i = ol();
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
    crawlMaxQueue: l = 1e3,
    searchIndex: o = !0,
    searchIndexMode: h = "eager",
    indexDepth: c = 1,
    noIndexing: u = void 0,
    defaultStyle: d = "light",
    bulmaCustomize: g = "none",
    lang: m = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: y = 5,
    cacheMaxEntries: f,
    markdownExtensions: w,
    availableLanguages: b,
    homePage: _ = null,
    notFoundPage: x = null,
    navigationPage: S = "_navigation.md",
    exposeSitemap: M = !0
  } = r;
  try {
    typeof _ == "string" && _.startsWith("./") && (_ = _.replace(/^\.\//, ""));
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
  const { navbarLogo: q = "favicon" } = r, { skipRootReadme: H = !1 } = r, B = (E) => {
    try {
      const T = document.querySelector(a);
      T && T instanceof Element && (T.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(E)}</pre></div>`);
    } catch {
    }
  };
  if (r.contentPath != null && !ll(r.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (_ != null && !sr(_))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (x != null && !sr(x))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (S != null && !sr(S))
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
  if (h != null && h !== "eager" && h !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (c != null && c !== 1 && c !== 2 && c !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (d !== "light" && d !== "dark" && d !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (g != null && typeof g != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (m != null && typeof m != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (y != null && (typeof y != "number" || !Number.isFinite(y) || y < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (f != null && (typeof f != "number" || !Number.isInteger(f) || f < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((E) => !E || typeof E != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (b != null && (!Array.isArray(b) || b.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((E) => typeof E != "string" || !E.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (H != null && typeof H != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (x != null && (typeof x != "string" || !x.trim() || !/\.(md|html)$/.test(x)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const G = !!o;
  try {
    Promise.resolve().then(() => Tt).then((E) => {
      try {
        E && typeof E.setSkipRootReadme == "function" && E.setSkipRootReadme(!!H);
      } catch (T) {
        n("[nimbi-cms] setSkipRootReadme failed", T);
      }
    }).catch((E) => {
    });
  } catch (E) {
    n("[nimbi-cms] setSkipRootReadme dynamic import failed", E);
  }
  try {
    try {
      r && r.seoMap && typeof r.seoMap == "object" && Es(r.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(E) {
        try {
          const T = { type: "error", message: E && E.message ? String(E.message) : "", filename: E && E.filename ? String(E.filename) : "", lineno: E && E.lineno ? E.lineno : null, colno: E && E.colno ? E.colno : null, stack: E && E.error && E.error.stack ? E.error.stack : null, time: Date.now() };
          try {
            n("[nimbi-cms] runtime error", T.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(T);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(E) {
        try {
          const T = { type: "unhandledrejection", reason: E && E.reason ? String(E.reason) : "", time: Date.now() };
          try {
            n("[nimbi-cms] unhandledrejection", T.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(T);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const E = Je(typeof window < "u" ? window.location.href : ""), T = E && E.page ? E.page : _ || void 0;
      try {
        T && Ls(T, Ln || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        Z.classList.add("nimbi-mount");
      } catch (R) {
        n("[nimbi-cms] mount element setup failed", R);
      }
      const E = document.createElement("section");
      E.className = "section";
      const T = document.createElement("div");
      T.className = "container nimbi-cms";
      const ne = document.createElement("div");
      ne.className = "columns";
      const A = document.createElement("div");
      A.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", A.setAttribute("role", "navigation");
      try {
        const R = typeof Zt == "function" ? Zt("navigation") : null;
        R && A.setAttribute("aria-label", R);
      } catch (R) {
        n("[nimbi-cms] set nav aria-label failed", R);
      }
      ne.appendChild(A);
      const I = document.createElement("main");
      I.className = "column nimbi-content", I.setAttribute("role", "main"), ne.appendChild(I), T.appendChild(ne), E.appendChild(T);
      const te = A, Le = I;
      Z.appendChild(E);
      let J = null;
      try {
        J = Z.querySelector(".nimbi-overlay"), J || (J = document.createElement("div"), J.className = "nimbi-overlay", Z.appendChild(J));
      } catch (R) {
        J = null, n("[nimbi-cms] mount overlay setup failed", R);
      }
      const ke = location.pathname || "/";
      let he;
      if (ke.endsWith("/"))
        he = ke;
      else {
        const R = ke.substring(ke.lastIndexOf("/") + 1);
        R && !R.includes(".") ? he = ke + "/" : he = ke.substring(0, ke.lastIndexOf("/") + 1);
      }
      try {
        Ln = document.title || "";
      } catch (R) {
        Ln = "", n("[nimbi-cms] read initial document title failed", R);
      }
      let v = s;
      const O = Object.prototype.hasOwnProperty.call(r, "contentPath"), N = typeof location < "u" && location.origin ? location.origin : "http://localhost", z = new URL(he, N).toString();
      (v === "." || v === "./") && (v = "");
      try {
        v = String(v || "").replace(/\\/g, "/");
      } catch {
        v = String(v || "");
      }
      v.startsWith("/") && (v = v.replace(/^\/+/, "")), v && !v.endsWith("/") && (v = v + "/");
      try {
        if (v && he && he !== "/") {
          const R = he.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          R && v.startsWith(R) && (v = v.slice(R.length));
        }
      } catch {
      }
      try {
        if (v)
          var C = new URL(v, z.endsWith("/") ? z : z + "/").toString();
        else
          var C = z;
      } catch {
        try {
          if (v) var C = new URL("/" + v, N).toString();
          else var C = new URL(he, N).toString();
        } catch {
          var C = N;
        }
      }
      if (p && await Ti(p, he), b && Array.isArray(b) && Ii(b), m && Pi(m), typeof y == "number" && y >= 0 && typeof oi == "function" && oi(y * 60 * 1e3), typeof f == "number" && f >= 0 && typeof si == "function" && si(f), w && Array.isArray(w) && w.length)
        try {
          w.forEach((R) => {
            typeof R == "object" && da && typeof fr == "function" && fr(R);
          });
        } catch (R) {
          n("[nimbi-cms] applying markdownExtensions failed", R);
        }
      try {
        typeof l == "number" && Promise.resolve().then(() => Tt).then(({ setDefaultCrawlMaxQueue: R }) => {
          try {
            R(l);
          } catch (V) {
            n("[nimbi-cms] setDefaultCrawlMaxQueue failed", V);
          }
        });
      } catch (R) {
        n("[nimbi-cms] setDefaultCrawlMaxQueue import failed", R);
      }
      try {
        xr(C);
      } catch (R) {
        n("[nimbi-cms] setContentBase failed", R);
      }
      try {
        Ni(x);
      } catch (R) {
        n("[nimbi-cms] setNotFoundPage failed", R);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => an).then((R) => {
          try {
            R && typeof R.attachSitemapDownloadUI == "function" && R.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let P = null, W = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(r, "homePage") && S)
          try {
            const ae = [], Ae = [];
            try {
              S && Ae.push(String(S));
            } catch {
            }
            try {
              const le = String(S || "").replace(/^_/, "");
              le && le !== String(S) && Ae.push(le);
            } catch {
            }
            try {
              Ae.push("navigation.md");
            } catch {
            }
            try {
              Ae.push("assets/navigation.md");
            } catch {
            }
            const me = [];
            for (const le of Ae)
              try {
                if (!le) continue;
                const de = String(le);
                me.includes(de) || me.push(de);
              } catch {
              }
            for (const le of me) {
              ae.push(le);
              try {
                if (W = await Se(le, C, { force: !0 }), W && W.raw) {
                  try {
                    S = le;
                  } catch {
                  }
                  try {
                    n("[nimbi-cms] fetched navigation candidate", le, "contentBase=", C);
                  } catch {
                  }
                  P = await dn(W.raw || "");
                  try {
                    const de = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (de && P && P.html) {
                      const qe = de.parseFromString(P.html, "text/html").querySelector("a");
                      if (qe)
                        try {
                          const ft = qe.getAttribute("href") || "", st = Je(ft);
                          try {
                            n("[nimbi-cms] parsed nav first-link href", ft, "->", st);
                          } catch {
                          }
                          if (st && st.page && (st.type === "path" || st.type === "canonical" && (st.page.includes(".") || st.page.includes("/")))) {
                            _ = st.page;
                            try {
                              n("[nimbi-cms] derived homePage from navigation", _);
                            } catch {
                            }
                            break;
                          }
                        } catch {
                        }
                    }
                  } catch {
                  }
                }
              } catch {
              }
            }
          } catch {
          }
        try {
          n("[nimbi-cms] final homePage before slugManager setHomePage", _);
        } catch {
        }
        try {
          Di(_);
        } catch (ae) {
          n("[nimbi-cms] setHomePage failed", ae);
        }
        let V = !0;
        try {
          const ae = Je(typeof location < "u" ? location.href : "");
          ae && ae.type === "cosmetic" && (typeof x > "u" || x == null) && (V = !1);
        } catch {
        }
        if (V && _)
          try {
            await Se(_, C, { force: !0 });
          } catch (ae) {
            throw new Error(`Required ${_} not found at ${C}${_}: ${ae && ae.message ? ae.message : String(ae)}`);
          }
      } catch (R) {
        throw R;
      }
      Va(d), await Ka(g, he);
      const ie = sl({ contentWrap: Le, navWrap: te, container: T, mountOverlay: J, t: Zt, contentBase: C, homePage: _, initialDocumentTitle: Ln, runHooks: Yr });
      try {
        const R = document.createElement("header");
        R.className = "nimbi-site-navbar", Z.insertBefore(R, E);
        let V = W, ae = P;
        ae || (V = await Se(S, C, { force: !0 }), ae = await dn(V.raw || ""));
        const { navbar: Ae, linkEls: me } = await nl(R, T, ae.html || "", C, _, Zt, ie.renderByQuery, G, h, c, u, q);
        try {
          await Yr("onNavBuild", { navWrap: te, navbar: Ae, linkEls: me, contentBase: C });
        } catch (le) {
          n("[nimbi-cms] onNavBuild hooks failed", le);
        }
        try {
          let le = !1;
          try {
            const de = new URLSearchParams(location.search || "");
            (de.has("sitemap") || de.has("rss") || de.has("atom")) && (le = !0);
          } catch {
          }
          try {
            const ge = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            ge && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(ge) && (le = !0);
          } catch {
          }
          if (le || M === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const ge = await Promise.resolve().then(() => Tt);
                if (ge && typeof ge.awaitSearchIndex == "function") {
                  const qe = [];
                  _ && qe.push(_), S && qe.push(S);
                  try {
                    await ge.awaitSearchIndex({ contentBase: C, indexDepth: Math.max(c || 1, 3), noIndexing: u, seedPaths: qe.length ? qe : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const de = await Promise.resolve().then(() => an);
              try {
                if (de && typeof de.handleSitemapRequest == "function" && await de.handleSitemapRequest({ includeAllMarkdown: !0, homePage: _, navigationPage: S, notFoundPage: x, contentBase: C, indexDepth: c, noIndexing: u }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => an).then((de) => {
              try {
                if (de && typeof de.exposeSitemapGlobals == "function")
                  try {
                    de.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: _, navigationPage: S, notFoundPage: x, contentBase: C, indexDepth: c, noIndexing: u, waitForIndexMs: 1 / 0 }).catch(() => {
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
          const le = () => {
            const de = R && R.getBoundingClientRect && Math.round(R.getBoundingClientRect().height) || R && R.offsetHeight || 0;
            if (de > 0) {
              try {
                Z.style.setProperty("--nimbi-site-navbar-height", `${de}px`);
              } catch (ge) {
                n("[nimbi-cms] set CSS var failed", ge);
              }
              try {
                T.style.paddingTop = "";
              } catch (ge) {
                n("[nimbi-cms] set container paddingTop failed", ge);
              }
              try {
                const ge = Z && Z.getBoundingClientRect && Math.round(Z.getBoundingClientRect().height) || Z && Z.clientHeight || 0;
                if (ge > 0) {
                  const qe = Math.max(0, ge - de);
                  try {
                    T.style.setProperty("--nimbi-cms-height", `${qe}px`);
                  } catch (ft) {
                    n("[nimbi-cms] set --nimbi-cms-height failed", ft);
                  }
                } else
                  try {
                    T.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (qe) {
                    n("[nimbi-cms] set --nimbi-cms-height failed", qe);
                  }
              } catch (ge) {
                n("[nimbi-cms] compute container height failed", ge);
              }
              try {
                R.style.setProperty("--nimbi-site-navbar-height", `${de}px`);
              } catch (ge) {
                n("[nimbi-cms] set navbar CSS var failed", ge);
              }
            }
          };
          le();
          try {
            if (typeof ResizeObserver < "u") {
              const de = new ResizeObserver(() => le());
              try {
                de.observe(R);
              } catch (ge) {
                n("[nimbi-cms] ResizeObserver.observe failed", ge);
              }
            }
          } catch (de) {
            n("[nimbi-cms] ResizeObserver setup failed", de);
          }
        } catch (le) {
          n("[nimbi-cms] compute navbar height failed", le);
        }
      } catch (R) {
        n("[nimbi-cms] build navigation failed", R);
      }
      await ie.renderByQuery();
      try {
        Promise.resolve().then(() => ul).then(({ getVersion: R }) => {
          typeof R == "function" && R().then((V) => {
            try {
              const ae = V || "0.0.0";
              try {
                const Ae = (de) => {
                  const ge = document.createElement("a");
                  ge.className = "nimbi-version-label tag is-small", ge.textContent = `nimbiCMS v. ${ae}`, ge.href = de || "#", ge.target = "_blank", ge.rel = "noopener noreferrer nofollow", ge.setAttribute("aria-label", `nimbiCMS version ${ae}`);
                  try {
                    Ci(ge);
                  } catch {
                  }
                  try {
                    Z.appendChild(ge);
                  } catch (qe) {
                    n("[nimbi-cms] append version label failed", qe);
                  }
                }, me = "https://abelvm.github.io/nimbiCMS/", le = (() => {
                  try {
                    if (me && typeof me == "string")
                      return new URL(me).toString();
                  } catch {
                  }
                  return "#";
                })();
                Ae(le);
              } catch (Ae) {
                n("[nimbi-cms] building version label failed", Ae);
              }
            } catch (ae) {
              n("[nimbi-cms] building version label failed", ae);
            }
          }).catch((V) => {
            n("[nimbi-cms] getVersion() failed", V);
          });
        }).catch((R) => {
          n("[nimbi-cms] import version module failed", R);
        });
      } catch (R) {
        n("[nimbi-cms] version label setup failed", R);
      }
    })();
  } catch (E) {
    throw B(E), E;
  }
}
async function cl() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: cl
}, Symbol.toStringTag, { value: "Module" }));
function Fe(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.log(...e);
  } catch {
  }
}
function Wt(...e) {
  try {
    typeof window < "u" && window.__nimbiCMSDebug && console.warn(...e);
  } catch {
  }
}
function Ir() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function Oe(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Si(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function hl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = oe(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Or(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Ir().split("?")[0];
  let o = Array.isArray(F) && F.length ? F : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(F) && F.length) {
    const f = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && f.set(String(w.slug), w);
        } catch {
        }
      for (const w of F)
        try {
          w && w.slug && f.set(String(w.slug), w);
        } catch {
        }
    } catch {
    }
    o = Array.from(f.values());
  }
  const h = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && h.add(oe(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && h.add(oe(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const f = oe(String(a));
      try {
        if (D && typeof D.has == "function" && D.has(f))
          try {
            c.add(D.get(f));
          } catch {
          }
        else
          try {
            const w = await Se(f, e && e.contentBase ? e.contentBase : void 0);
            if (w && w.raw)
              try {
                let b = null;
                if (w.isHtml)
                  try {
                    const x = new DOMParser().parseFromString(w.raw, "text/html"), S = x.querySelector("h1") || x.querySelector("title");
                    S && S.textContent && (b = S.textContent.trim());
                  } catch {
                  }
                else {
                  const _ = (w.raw || "").match(/^#\s+(.+)$/m);
                  _ && _[1] && (b = _[1].trim());
                }
                b && c.add(_e(b));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), d = [], g = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), p = (f) => {
    try {
      if (!f || typeof f != "string") return !1;
      const w = oe(String(f));
      try {
        if (Array.isArray(Pe) && Pe.length && Pe.includes(w)) return !0;
      } catch {
      }
      try {
        if (D && typeof D.has == "function" && D.has(w)) return !0;
      } catch {
      }
      try {
        if (m && m.has(w)) return !0;
      } catch {
      }
      try {
        for (const b of Q.values())
          try {
            if (!b) continue;
            if (typeof b == "string") {
              if (oe(String(b)) === w) return !0;
            } else if (b && typeof b == "object") {
              if (b.default && oe(String(b.default)) === w) return !0;
              const _ = b.langs || {};
              for (const x of Object.keys(_ || {}))
                try {
                  if (_[x] && oe(String(_[x])) === w) return !0;
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
    for (const f of o)
      try {
        if (!f || !f.slug) continue;
        const w = String(f.slug), b = String(w).split("::")[0];
        if (c.has(b)) continue;
        const _ = f.path ? oe(String(f.path)) : null;
        if (_ && h.has(_)) continue;
        const x = f.title ? String(f.title) : f.parentTitle ? String(f.parentTitle) : void 0;
        g.set(w, { title: x || void 0, excerpt: f.excerpt ? String(f.excerpt) : void 0, path: _, source: "index" }), _ && m.set(_, { title: x || void 0, excerpt: f.excerpt ? String(f.excerpt) : void 0, slug: w });
        const S = hl(l, f);
        if (!S || !S.slug || u.has(S.slug)) continue;
        if (u.add(S.slug), g.has(S.slug)) {
          const M = g.get(S.slug);
          M && M.title && (S.title = M.title, S._titleSource = "index"), M && M.excerpt && (S.excerpt = M.excerpt);
        }
        d.push(S);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [f, w] of Q.entries())
        try {
          if (!f) continue;
          const b = String(f).split("::")[0];
          if (u.has(f) || c.has(b)) continue;
          let _ = null;
          if (typeof w == "string" ? _ = oe(String(w)) : w && typeof w == "object" && (_ = oe(String(w.default || ""))), _ && h.has(_)) continue;
          const S = { loc: l + "?page=" + encodeURIComponent(f), slug: f };
          if (g.has(f)) {
            const M = g.get(f);
            M && M.title && (S.title = M.title, S._titleSource = "index"), M && M.excerpt && (S.excerpt = M.excerpt);
          } else if (_) {
            const M = m.get(_);
            M && M.title && (S.title = M.title, S._titleSource = "path", !S.excerpt && M.excerpt && (S.excerpt = M.excerpt));
          }
          if (u.add(f), typeof f == "string") {
            const M = f.indexOf("/") !== -1 || /\.(md|html?)$/i.test(f), q = S.title && typeof S.title == "string" && (S.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(S.title));
            (!S.title || q || M) && (S.title = Si(f), S._titleSource = "humanize");
          }
          d.push(S);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const f = oe(String(i));
          let w = null;
          try {
            D && D.has(f) && (w = D.get(f));
          } catch {
          }
          w || (w = f);
          const b = String(w).split("::")[0];
          if (!u.has(w) && !h.has(f) && !c.has(b)) {
            const _ = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (g.has(w)) {
              const x = g.get(w);
              x && x.title && (_.title = x.title, _._titleSource = "index"), x && x.excerpt && (_.excerpt = x.excerpt);
            }
            u.add(w), d.push(_);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const f = /* @__PURE__ */ new Set(), w = new Set(d.map((S) => String(S && S.slug ? S.slug : ""))), b = /* @__PURE__ */ new Set();
    for (const S of d)
      try {
        S && S.sourcePath && b.add(String(S.sourcePath));
      } catch {
      }
    const _ = 30;
    let x = 0;
    for (const S of b) {
      if (x >= _) break;
      try {
        if (!S || typeof S != "string" || !p(S)) continue;
        x += 1;
        const M = await Se(S, e && e.contentBase ? e.contentBase : void 0);
        if (!M || !M.raw || M && typeof M.status == "number" && M.status === 404) continue;
        const q = M.raw, H = (function(T) {
          try {
            return String(T || "");
          } catch {
            return "";
          }
        })(q), B = [], Z = /\[[^\]]+\]\(([^)]+)\)/g;
        let G;
        for (; G = Z.exec(H); )
          try {
            G && G[1] && B.push(G[1]);
          } catch {
          }
        const E = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; G = E.exec(H); )
          try {
            G && G[1] && B.push(G[1]);
          } catch {
          }
        for (const T of B)
          try {
            if (!T) continue;
            if (T.indexOf("?") !== -1 || T.indexOf("=") !== -1)
              try {
                const I = new URL(T, l).searchParams.get("page");
                if (I) {
                  const te = String(I);
                  !w.has(te) && !f.has(te) && (f.add(te), d.push({ loc: l + "?page=" + encodeURIComponent(te), slug: te }));
                  continue;
                }
              } catch {
              }
            let ne = String(T).split(/[?#]/)[0];
            if (ne = ne.replace(/^\.\//, "").replace(/^\//, ""), !ne || !/\.(md|html?)$/i.test(ne)) continue;
            try {
              const A = oe(ne);
              if (D && D.has(A)) {
                const I = D.get(A), te = String(I).split("::")[0];
                I && !w.has(I) && !f.has(I) && !c.has(te) && !h.has(A) && (f.add(I), d.push({ loc: l + "?page=" + encodeURIComponent(I), slug: I, sourcePath: A }));
                continue;
              }
              try {
                if (!p(A)) continue;
                const I = await Se(A, e && e.contentBase ? e.contentBase : void 0);
                if (I && typeof I.status == "number" && I.status === 404) continue;
                if (I && I.raw) {
                  const te = (I.raw || "").match(/^#\s+(.+)$/m), Le = te && te[1] ? te[1].trim() : "", J = _e(Le || A), ke = String(J).split("::")[0];
                  J && !w.has(J) && !f.has(J) && !c.has(ke) && (f.add(J), d.push({ loc: l + "?page=" + encodeURIComponent(J), slug: J, sourcePath: A, title: Le || void 0 }));
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
    const f = /* @__PURE__ */ new Map();
    for (const b of d)
      try {
        if (!b || !b.slug) continue;
        f.set(String(b.slug), b);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const b of d)
      try {
        if (!b || !b.slug) continue;
        const _ = String(b.slug), x = _.split("::")[0];
        if (!x) continue;
        _ !== x && !f.has(x) && w.add(x);
      } catch {
      }
    for (const b of w)
      try {
        let _ = null;
        if (g.has(b)) {
          const x = g.get(b);
          _ = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, x && x.title && (_.title = x.title, _._titleSource = "index"), x && x.excerpt && (_.excerpt = x.excerpt), x && x.path && (_.sourcePath = x.path);
        } else if (m && Q && Q.has(b)) {
          const x = Q.get(b);
          let S = null;
          if (typeof x == "string" ? S = oe(String(x)) : x && typeof x == "object" && (S = oe(String(x.default || ""))), _ = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, S && m.has(S)) {
            const M = m.get(S);
            M && M.title && (_.title = M.title, _._titleSource = "path"), M && M.excerpt && (_.excerpt = M.excerpt), _.sourcePath = S;
          }
        }
        _ || (_ = { loc: l + "?page=" + encodeURIComponent(b), slug: b, title: Si(b) }, _._titleSource = "humanize"), f.has(b) || (d.push(_), f.set(b, _));
      } catch {
      }
  } catch {
  }
  const y = [];
  try {
    const f = /* @__PURE__ */ new Set();
    for (const w of d)
      try {
        if (!w || !w.slug) continue;
        const b = String(w.slug), _ = String(b).split("::")[0];
        if (c.has(_) || b.indexOf("::") !== -1 || f.has(b)) continue;
        f.add(b), y.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Fe("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(y.map((f) => ({ slug: f.slug, title: f.title, titleSource: f._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let w = 0;
    const b = y.length, _ = Array.from({ length: Math.min(4, b) }).map(async () => {
      for (; ; ) {
        const x = w++;
        if (x >= b) break;
        const S = y[x];
        try {
          if (!S || !S.slug) continue;
          const M = String(S.slug).split("::")[0];
          if (c.has(M) || S._titleSource === "index") continue;
          let q = null;
          try {
            if (Q && Q.has(S.slug)) {
              const H = Q.get(S.slug);
              typeof H == "string" ? q = oe(String(H)) : H && typeof H == "object" && (q = oe(String(H.default || "")));
            }
            !q && S.sourcePath && (q = S.sourcePath);
          } catch {
            continue;
          }
          if (!q || h.has(q) || !p(q)) continue;
          try {
            const H = await Se(q, e && e.contentBase ? e.contentBase : void 0);
            if (!H || !H.raw || H && typeof H.status == "number" && H.status === 404) continue;
            if (H && H.raw) {
              const B = (H.raw || "").match(/^#\s+(.+)$/m), Z = B && B[1] ? B[1].trim() : "";
              Z && (S.title = Z, S._titleSource = "fetched");
            }
          } catch (H) {
            Fe("[runtimeSitemap] fetch title failed for", q, H);
          }
        } catch (M) {
          Fe("[runtimeSitemap] worker loop failure", M);
        }
      }
    });
    await Promise.all(_);
  } catch (f) {
    Fe("[runtimeSitemap] title enrichment failed", f);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
}
function mr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${Oe(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function yr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Ir().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${Oe("Sitemap RSS")}</title>
`, i += `<link>${Oe(n)}</link>
`, i += `<description>${Oe("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${Oe(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${Oe(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${Oe(String(r.excerpt))}</description>
`), i += `<link>${Oe(a)}</link>
`, i += `<guid>${Oe(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function br(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Ir().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${Oe("Sitemap Atom")}</title>
`, r += `<link href="${Oe(n)}" />
`, r += `<updated>${Oe(i)}</updated>
`, r += `<id>${Oe(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${Oe(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${Oe(String(a.excerpt))}</summary>
`), r += `<link href="${Oe(s)}" />
`, r += `<id>${Oe(s)}</id>
`, r += `<updated>${Oe(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function vi(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + Oe(e) + "</pre>";
    } catch {
    }
  }
}
function Ai(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${Oe(String(i && i.loc ? i.loc : ""))}">${Oe(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Mn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = yr(e) : t === "application/atom+xml" ? i = br(e) : t === "text/html" ? i = Ai(e) : i = mr(e), vi(i, t);
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
          r.mimeType === "application/rss+xml" ? a = yr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = br(r.finalJson) : r.mimeType === "text/html" ? a = Ai(r.finalJson) : a = mr(r.finalJson);
          try {
            vi(a, r.mimeType);
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
async function dl(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let u = !0;
        for (const d of c.keys()) d !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (c.has("rss")) {
        let u = !0;
        for (const d of c.keys()) d !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (c.has("atom")) {
        let u = !0;
        for (const d of c.keys()) d !== "atom" && (u = !1);
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
      if (typeof xt == "function")
        try {
          const c = await xt({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const u = /* @__PURE__ */ new Map();
              try {
                for (const d of e.index)
                  try {
                    d && d.slug && u.set(String(d.slug), d);
                  } catch {
                  }
                for (const d of c)
                  try {
                    d && d.slug && u.set(String(d.slug), d);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(u.values());
            } else
              a = c;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(F) && F.length ? F : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(F) && F.length ? F : [];
        }
      else
        a = Array.isArray(F) && F.length ? F : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(F) && F.length ? F : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const c = /* @__PURE__ */ new Map();
          for (const u of e.index)
            try {
              if (!u || !u.slug) continue;
              const d = String(u.slug).split("::")[0];
              if (!c.has(d)) c.set(d, u);
              else {
                const g = c.get(d);
                g && String(g.slug || "").indexOf("::") !== -1 && String(u.slug || "").indexOf("::") === -1 && c.set(d, u);
              }
            } catch {
            }
          try {
            Fe("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            Fe("[runtimeSitemap] providedIndex.dedupedByBase (count):", c.size);
          }
        } catch (c) {
          Wt("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Ct == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof xt == "function" && (u = await xt({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, g = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, m = [];
          e && e.homePage && m.push(e.homePage), e && e.navigationPage && m.push(e.navigationPage), a = await Ct(e && e.contentBase ? e.contentBase : void 0, d, g, m.length ? m : void 0);
        }
      } catch (c) {
        Wt("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(F) && F.length ? F : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Fe("[runtimeSitemap] usedIndex.full.length (before rebuild):", c);
      } catch {
      }
      try {
        Fe("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, d = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let g = null;
      try {
        const m = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof m == "function")
          try {
            g = await m(e && e.contentBase ? e.contentBase : void 0, u, d);
          } catch {
            g = null;
          }
      } catch {
        g = null;
      }
      if ((!g || !g.length) && typeof Ct == "function")
        try {
          g = await Ct(e && e.contentBase ? e.contentBase : void 0, u, d, c.length ? c : void 0);
        } catch {
          g = null;
        }
      if (Array.isArray(g) && g.length) {
        const m = /* @__PURE__ */ new Map();
        try {
          for (const p of a)
            try {
              p && p.slug && m.set(String(p.slug), p);
            } catch {
            }
          for (const p of g)
            try {
              p && p.slug && m.set(String(p.slug), p);
            } catch {
            }
        } catch {
        }
        a = Array.from(m.values());
      }
    } catch (c) {
      try {
        Wt("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Fe("[runtimeSitemap] usedIndex.full.length (after rebuild):", c);
      } catch {
      }
      try {
        Fe("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await Or(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), u = Array.isArray(l && l.entries) ? l.entries : [];
      for (const d of u)
        try {
          let g = null;
          if (d && d.slug) g = String(d.slug);
          else if (d && d.loc)
            try {
              g = new URL(String(d.loc)).searchParams.get("page");
            } catch {
            }
          if (!g) continue;
          const m = String(g).split("::")[0];
          if (!c.has(m)) {
            c.add(m);
            const p = Object.assign({}, d);
            p.baseSlug = m, o.push(p);
          }
        } catch {
        }
      try {
        Fe("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(o, null, 2));
      } catch {
        Fe("[runtimeSitemap] finalEntries.dedupedByBase (count):", o.length);
      }
    } catch {
      try {
        o = Array.isArray(l && l.entries) ? l.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const h = Object.assign({}, l || {}, { entries: Array.isArray(o) ? o : Array.isArray(l && l.entries) ? l.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = h, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Fe("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Mn(h, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Fe("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Mn(h, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Fe("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Mn(h, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(h && h.entries) ? h.entries : []).length;
        let d = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (d > u) {
          try {
            Fe("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", d, u);
          } catch {
          }
          return !0;
        }
        return Mn(h, "text/html"), !0;
      } catch (c) {
        return Wt("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return Wt("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function fl(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof xt == "function")
        try {
          const s = await xt({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(F) && F.length && (n = F), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Or(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), l = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of l)
        try {
          let h = null;
          if (o && o.slug) h = String(o.slug);
          else if (o && o.loc)
            try {
              h = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              h = null;
            }
          if (!h) continue;
          const c = String(h).split("::")[0];
          if (!s.has(c)) {
            s.add(c);
            const u = Object.assign({}, o);
            u.baseSlug = c, r.push(u);
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
const an = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: fl,
  generateAtomXml: br,
  generateRssXml: yr,
  generateSitemapJson: Or,
  generateSitemapXml: mr,
  handleSitemapRequest: dl
}, Symbol.toStringTag, { value: "Module" }));
export {
  Li as BAD_LANGUAGES,
  we as SUPPORTED_HLJS_MAP,
  yl as _clearHooks,
  wr as addHook,
  _l as default,
  Ka as ensureBulma,
  cl as getVersion,
  _l as initCMS,
  Ti as loadL10nFile,
  Mi as loadSupportedLanguages,
  Qa as observeCodeBlocks,
  gl as onNavBuild,
  pl as onPageLoad,
  on as registerLanguage,
  Yr as runHooks,
  bl as setHighlightTheme,
  Pi as setLang,
  Va as setStyle,
  wl as setThemeVars,
  Zt as t,
  ml as transformHtml
};
