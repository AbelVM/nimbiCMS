const qt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Wn(e, t) {
  if (!Object.prototype.hasOwnProperty.call(qt, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  qt[e].push(t);
}
function Po(e) {
  Wn("onPageLoad", e);
}
function $o(e) {
  Wn("onNavBuild", e);
}
function zo(e) {
  Wn("transformHtml", e);
}
async function yr(e, t) {
  const n = qt[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function Io() {
  Object.keys(qt).forEach((e) => {
    qt[e].length = 0;
  });
}
function Wr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ln, kr;
function ca() {
  if (kr) return Ln;
  kr = 1;
  function e(w) {
    return w instanceof Map ? w.clear = w.delete = w.set = function() {
      throw new Error("map is read-only");
    } : w instanceof Set && (w.add = w.clear = w.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(w), Object.getOwnPropertyNames(w).forEach((A) => {
      const B = w[A], ie = typeof B;
      (ie === "object" || ie === "function") && !Object.isFrozen(B) && e(B);
    }), w;
  }
  class t {
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
    const B = /* @__PURE__ */ Object.create(null);
    for (const ie in w)
      B[ie] = w[ie];
    return A.forEach(function(ie) {
      for (const ve in ie)
        B[ve] = ie[ve];
    }), /** @type {T} */
    B;
  }
  const r = "</span>", a = (w) => !!w.scope, s = (w, { prefix: A }) => {
    if (w.startsWith("language:"))
      return w.replace("language:", "language-");
    if (w.includes(".")) {
      const B = w.split(".");
      return [
        `${A}${B.shift()}`,
        ...B.map((ie, ve) => `${ie}${"_".repeat(ve + 1)}`)
      ].join(" ");
    }
    return `${A}${w}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(A, B) {
      this.buffer = "", this.classPrefix = B.classPrefix, A.walk(this);
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
      const B = s(
        A.scope,
        { prefix: this.classPrefix }
      );
      this.span(B);
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
    add(A) {
      this.top.children.push(A);
    }
    /** @param {string} scope */
    openNode(A) {
      const B = o({ scope: A });
      this.add(B), this.stack.push(B);
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
    static _walk(A, B) {
      return typeof B == "string" ? A.addText(B) : B.children && (A.openNode(B), B.children.forEach((ie) => this._walk(A, ie)), A.closeNode(B)), A;
    }
    /**
     * @param {Node} node
     */
    static _collapse(A) {
      typeof A != "string" && A.children && (A.children.every((B) => typeof B == "string") ? A.children = [A.children.join("")] : A.children.forEach((B) => {
        l._collapse(B);
      }));
    }
  }
  class u extends l {
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
    __addSublanguage(A, B) {
      const ie = A.root;
      B && (ie.scope = `language:${B}`), this.add(ie);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function p(w) {
    return w ? typeof w == "string" ? w : w.source : null;
  }
  function m(w) {
    return f("(?=", w, ")");
  }
  function d(w) {
    return f("(?:", w, ")*");
  }
  function h(w) {
    return f("(?:", w, ")?");
  }
  function f(...w) {
    return w.map((B) => p(B)).join("");
  }
  function g(w) {
    const A = w[w.length - 1];
    return typeof A == "object" && A.constructor === Object ? (w.splice(w.length - 1, 1), A) : {};
  }
  function b(...w) {
    return "(" + (g(w).capture ? "" : "?:") + w.map((ie) => p(ie)).join("|") + ")";
  }
  function y(w) {
    return new RegExp(w.toString() + "|").exec("").length - 1;
  }
  function k(w, A) {
    const B = w && w.exec(A);
    return B && B.index === 0;
  }
  const S = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function $(w, { joinWith: A }) {
    let B = 0;
    return w.map((ie) => {
      B += 1;
      const ve = B;
      let Ae = p(ie), F = "";
      for (; Ae.length > 0; ) {
        const j = S.exec(Ae);
        if (!j) {
          F += Ae;
          break;
        }
        F += Ae.substring(0, j.index), Ae = Ae.substring(j.index + j[0].length), j[0][0] === "\\" && j[1] ? F += "\\" + String(Number(j[1]) + ve) : (F += j[0], j[0] === "(" && B++);
      }
      return F;
    }).map((ie) => `(${ie})`).join(A);
  }
  const H = /\b\B/, K = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", ee = "\\b\\d+(\\.\\d+)?", ue = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", T = "\\b(0b[01]+)", Q = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", _e = (w = {}) => {
    const A = /^#![ ]*\//;
    return w.binary && (w.begin = f(
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
      "on:begin": (B, ie) => {
        B.index !== 0 && ie.ignoreMatch();
      }
    }, w);
  }, re = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, G = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [re]
  }, C = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [re]
  }, V = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, X = function(w, A, B = {}) {
    const ie = i(
      {
        scope: "comment",
        begin: w,
        end: A,
        contains: []
      },
      B
    );
    ie.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const ve = b(
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
    return ie.contains.push(
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
        begin: f(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          ve,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), ie;
  }, ge = X("//", "$"), L = X("/\\*", "\\*/"), R = X("#", "$"), P = {
    scope: "number",
    begin: ee,
    relevance: 0
  }, x = {
    scope: "number",
    begin: ue,
    relevance: 0
  }, I = {
    scope: "number",
    begin: T,
    relevance: 0
  }, M = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      re,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [re]
      }
    ]
  }, N = {
    scope: "title",
    begin: K,
    relevance: 0
  }, _ = {
    scope: "title",
    begin: q,
    relevance: 0
  }, v = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + q,
    relevance: 0
  };
  var U = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: G,
    BACKSLASH_ESCAPE: re,
    BINARY_NUMBER_MODE: I,
    BINARY_NUMBER_RE: T,
    COMMENT: X,
    C_BLOCK_COMMENT_MODE: L,
    C_LINE_COMMENT_MODE: ge,
    C_NUMBER_MODE: x,
    C_NUMBER_RE: ue,
    END_SAME_AS_BEGIN: function(w) {
      return Object.assign(
        w,
        {
          /** @type {ModeCallback} */
          "on:begin": (A, B) => {
            B.data._beginMatch = A[1];
          },
          /** @type {ModeCallback} */
          "on:end": (A, B) => {
            B.data._beginMatch !== A[1] && B.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: R,
    IDENT_RE: K,
    MATCH_NOTHING_RE: H,
    METHOD_GUARD: v,
    NUMBER_MODE: P,
    NUMBER_RE: ee,
    PHRASAL_WORDS_MODE: V,
    QUOTE_STRING_MODE: C,
    REGEXP_MODE: M,
    RE_STARTERS_RE: Q,
    SHEBANG: _e,
    TITLE_MODE: N,
    UNDERSCORE_IDENT_RE: q,
    UNDERSCORE_TITLE_MODE: _
  });
  function W(w, A) {
    w.input[w.index - 1] === "." && A.ignoreMatch();
  }
  function we(w, A) {
    w.className !== void 0 && (w.scope = w.className, delete w.className);
  }
  function me(w, A) {
    A && w.beginKeywords && (w.begin = "\\b(" + w.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", w.__beforeBegin = W, w.keywords = w.keywords || w.beginKeywords, delete w.beginKeywords, w.relevance === void 0 && (w.relevance = 0));
  }
  function be(w, A) {
    Array.isArray(w.illegal) && (w.illegal = b(...w.illegal));
  }
  function Ne(w, A) {
    if (w.match) {
      if (w.begin || w.end) throw new Error("begin & end are not supported with match");
      w.begin = w.match, delete w.match;
    }
  }
  function Ve(w, A) {
    w.relevance === void 0 && (w.relevance = 1);
  }
  const Mi = (w, A) => {
    if (!w.beforeMatch) return;
    if (w.starts) throw new Error("beforeMatch cannot be used with starts");
    const B = Object.assign({}, w);
    Object.keys(w).forEach((ie) => {
      delete w[ie];
    }), w.keywords = B.keywords, w.begin = f(B.beforeMatch, m(B.begin)), w.starts = {
      relevance: 0,
      contains: [
        Object.assign(B, { endsParent: !0 })
      ]
    }, w.relevance = 0, delete B.beforeMatch;
  }, Pi = [
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
  ], $i = "keyword";
  function rr(w, A, B = $i) {
    const ie = /* @__PURE__ */ Object.create(null);
    return typeof w == "string" ? ve(B, w.split(" ")) : Array.isArray(w) ? ve(B, w) : Object.keys(w).forEach(function(Ae) {
      Object.assign(
        ie,
        rr(w[Ae], A, Ae)
      );
    }), ie;
    function ve(Ae, F) {
      A && (F = F.map((j) => j.toLowerCase())), F.forEach(function(j) {
        const te = j.split("|");
        ie[te[0]] = [Ae, zi(te[0], te[1])];
      });
    }
  }
  function zi(w, A) {
    return A ? Number(A) : Ii(w) ? 0 : 1;
  }
  function Ii(w) {
    return Pi.includes(w.toLowerCase());
  }
  const ir = {}, lt = (w) => {
    console.error(w);
  }, ar = (w, ...A) => {
    console.log(`WARN: ${w}`, ...A);
  }, mt = (w, A) => {
    ir[`${w}/${A}`] || (console.log(`Deprecated as of ${w}. ${A}`), ir[`${w}/${A}`] = !0);
  }, Qt = new Error();
  function sr(w, A, { key: B }) {
    let ie = 0;
    const ve = w[B], Ae = {}, F = {};
    for (let j = 1; j <= A.length; j++)
      F[j + ie] = ve[j], Ae[j + ie] = !0, ie += y(A[j - 1]);
    w[B] = F, w[B]._emit = Ae, w[B]._multi = !0;
  }
  function Ni(w) {
    if (Array.isArray(w.begin)) {
      if (w.skip || w.excludeBegin || w.returnBegin)
        throw lt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Qt;
      if (typeof w.beginScope != "object" || w.beginScope === null)
        throw lt("beginScope must be object"), Qt;
      sr(w, w.begin, { key: "beginScope" }), w.begin = $(w.begin, { joinWith: "" });
    }
  }
  function Oi(w) {
    if (Array.isArray(w.end)) {
      if (w.skip || w.excludeEnd || w.returnEnd)
        throw lt("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Qt;
      if (typeof w.endScope != "object" || w.endScope === null)
        throw lt("endScope must be object"), Qt;
      sr(w, w.end, { key: "endScope" }), w.end = $(w.end, { joinWith: "" });
    }
  }
  function Bi(w) {
    w.scope && typeof w.scope == "object" && w.scope !== null && (w.beginScope = w.scope, delete w.scope);
  }
  function qi(w) {
    Bi(w), typeof w.beginScope == "string" && (w.beginScope = { _wrap: w.beginScope }), typeof w.endScope == "string" && (w.endScope = { _wrap: w.endScope }), Ni(w), Oi(w);
  }
  function Di(w) {
    function A(F, j) {
      return new RegExp(
        p(F),
        "m" + (w.case_insensitive ? "i" : "") + (w.unicodeRegex ? "u" : "") + (j ? "g" : "")
      );
    }
    class B {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(j, te) {
        te.position = this.position++, this.matchIndexes[this.matchAt] = te, this.regexes.push([te, j]), this.matchAt += y(j) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const j = this.regexes.map((te) => te[1]);
        this.matcherRe = A($(j, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(j) {
        this.matcherRe.lastIndex = this.lastIndex;
        const te = this.matcherRe.exec(j);
        if (!te)
          return null;
        const Ce = te.findIndex((St, _n) => _n > 0 && St !== void 0), Ee = this.matchIndexes[Ce];
        return te.splice(0, Ce), Object.assign(te, Ee);
      }
    }
    class ie {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(j) {
        if (this.multiRegexes[j]) return this.multiRegexes[j];
        const te = new B();
        return this.rules.slice(j).forEach(([Ce, Ee]) => te.addRule(Ce, Ee)), te.compile(), this.multiRegexes[j] = te, te;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(j, te) {
        this.rules.push([j, te]), te.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(j) {
        const te = this.getMatcher(this.regexIndex);
        te.lastIndex = this.lastIndex;
        let Ce = te.exec(j);
        if (this.resumingScanAtSamePosition() && !(Ce && Ce.index === this.lastIndex)) {
          const Ee = this.getMatcher(0);
          Ee.lastIndex = this.lastIndex + 1, Ce = Ee.exec(j);
        }
        return Ce && (this.regexIndex += Ce.position + 1, this.regexIndex === this.count && this.considerAll()), Ce;
      }
    }
    function ve(F) {
      const j = new ie();
      return F.contains.forEach((te) => j.addRule(te.begin, { rule: te, type: "begin" })), F.terminatorEnd && j.addRule(F.terminatorEnd, { type: "end" }), F.illegal && j.addRule(F.illegal, { type: "illegal" }), j;
    }
    function Ae(F, j) {
      const te = (
        /** @type CompiledMode */
        F
      );
      if (F.isCompiled) return te;
      [
        we,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Ne,
        qi,
        Mi
      ].forEach((Ee) => Ee(F, j)), w.compilerExtensions.forEach((Ee) => Ee(F, j)), F.__beforeBegin = null, [
        me,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        be,
        // default to 1 relevance if not specified
        Ve
      ].forEach((Ee) => Ee(F, j)), F.isCompiled = !0;
      let Ce = null;
      return typeof F.keywords == "object" && F.keywords.$pattern && (F.keywords = Object.assign({}, F.keywords), Ce = F.keywords.$pattern, delete F.keywords.$pattern), Ce = Ce || /\w+/, F.keywords && (F.keywords = rr(F.keywords, w.case_insensitive)), te.keywordPatternRe = A(Ce, !0), j && (F.begin || (F.begin = /\B|\b/), te.beginRe = A(te.begin), !F.end && !F.endsWithParent && (F.end = /\B|\b/), F.end && (te.endRe = A(te.end)), te.terminatorEnd = p(te.end) || "", F.endsWithParent && j.terminatorEnd && (te.terminatorEnd += (F.end ? "|" : "") + j.terminatorEnd)), F.illegal && (te.illegalRe = A(
        /** @type {RegExp | string} */
        F.illegal
      )), F.contains || (F.contains = []), F.contains = [].concat(...F.contains.map(function(Ee) {
        return Ui(Ee === "self" ? F : Ee);
      })), F.contains.forEach(function(Ee) {
        Ae(
          /** @type Mode */
          Ee,
          te
        );
      }), F.starts && Ae(F.starts, j), te.matcher = ve(te), te;
    }
    if (w.compilerExtensions || (w.compilerExtensions = []), w.contains && w.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return w.classNameAliases = i(w.classNameAliases || {}), Ae(
      /** @type Mode */
      w
    );
  }
  function or(w) {
    return w ? w.endsWithParent || or(w.starts) : !1;
  }
  function Ui(w) {
    return w.variants && !w.cachedVariants && (w.cachedVariants = w.variants.map(function(A) {
      return i(w, { variants: null }, A);
    })), w.cachedVariants ? w.cachedVariants : or(w) ? i(w, { starts: w.starts ? i(w.starts) : null }) : Object.isFrozen(w) ? i(w) : w;
  }
  var Hi = "11.11.1";
  class ji extends Error {
    constructor(A, B) {
      super(A), this.name = "HTMLInjectionError", this.html = B;
    }
  }
  const kn = n, lr = i, cr = /* @__PURE__ */ Symbol("nomatch"), Wi = 7, ur = function(w) {
    const A = /* @__PURE__ */ Object.create(null), B = /* @__PURE__ */ Object.create(null), ie = [];
    let ve = !0;
    const Ae = "Could not find the language '{}', did you forget to load/include a language module?", F = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
    function te(z) {
      return j.noHighlightRe.test(z);
    }
    function Ce(z) {
      let Y = z.className + " ";
      Y += z.parentNode ? z.parentNode.className : "";
      const he = j.languageDetectRe.exec(Y);
      if (he) {
        const xe = nt(he[1]);
        return xe || (ar(Ae.replace("{}", he[1])), ar("Falling back to no-highlight mode for this block.", z)), xe ? he[1] : "no-highlight";
      }
      return Y.split(/\s+/).find((xe) => te(xe) || nt(xe));
    }
    function Ee(z, Y, he) {
      let xe = "", Le = "";
      typeof Y == "object" ? (xe = z, he = Y.ignoreIllegals, Le = Y.language) : (mt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), mt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Le = z, xe = Y), he === void 0 && (he = !0);
      const Fe = {
        code: xe,
        language: Le
      };
      Xt("before:highlight", Fe);
      const rt = Fe.result ? Fe.result : St(Fe.language, Fe.code, he);
      return rt.code = Fe.code, Xt("after:highlight", rt), rt;
    }
    function St(z, Y, he, xe) {
      const Le = /* @__PURE__ */ Object.create(null);
      function Fe(D, Z) {
        return D.keywords[Z];
      }
      function rt() {
        if (!ae.keywords) {
          Pe.addText(Se);
          return;
        }
        let D = 0;
        ae.keywordPatternRe.lastIndex = 0;
        let Z = ae.keywordPatternRe.exec(Se), se = "";
        for (; Z; ) {
          se += Se.substring(D, Z.index);
          const ke = Ge.case_insensitive ? Z[0].toLowerCase() : Z[0], $e = Fe(ae, ke);
          if ($e) {
            const [Je, oa] = $e;
            if (Pe.addText(se), se = "", Le[ke] = (Le[ke] || 0) + 1, Le[ke] <= Wi && (Jt += oa), Je.startsWith("_"))
              se += Z[0];
            else {
              const la = Ge.classNameAliases[Je] || Je;
              Ze(Z[0], la);
            }
          } else
            se += Z[0];
          D = ae.keywordPatternRe.lastIndex, Z = ae.keywordPatternRe.exec(Se);
        }
        se += Se.substring(D), Pe.addText(se);
      }
      function Yt() {
        if (Se === "") return;
        let D = null;
        if (typeof ae.subLanguage == "string") {
          if (!A[ae.subLanguage]) {
            Pe.addText(Se);
            return;
          }
          D = St(ae.subLanguage, Se, !0, wr[ae.subLanguage]), wr[ae.subLanguage] = /** @type {CompiledMode} */
          D._top;
        } else
          D = xn(Se, ae.subLanguage.length ? ae.subLanguage : null);
        ae.relevance > 0 && (Jt += D.relevance), Pe.__addSublanguage(D._emitter, D.language);
      }
      function qe() {
        ae.subLanguage != null ? Yt() : rt(), Se = "";
      }
      function Ze(D, Z) {
        D !== "" && (Pe.startScope(Z), Pe.addText(D), Pe.endScope());
      }
      function fr(D, Z) {
        let se = 1;
        const ke = Z.length - 1;
        for (; se <= ke; ) {
          if (!D._emit[se]) {
            se++;
            continue;
          }
          const $e = Ge.classNameAliases[D[se]] || D[se], Je = Z[se];
          $e ? Ze(Je, $e) : (Se = Je, rt(), Se = ""), se++;
        }
      }
      function gr(D, Z) {
        return D.scope && typeof D.scope == "string" && Pe.openNode(Ge.classNameAliases[D.scope] || D.scope), D.beginScope && (D.beginScope._wrap ? (Ze(Se, Ge.classNameAliases[D.beginScope._wrap] || D.beginScope._wrap), Se = "") : D.beginScope._multi && (fr(D.beginScope, Z), Se = "")), ae = Object.create(D, { parent: { value: ae } }), ae;
      }
      function mr(D, Z, se) {
        let ke = k(D.endRe, se);
        if (ke) {
          if (D["on:end"]) {
            const $e = new t(D);
            D["on:end"](Z, $e), $e.isMatchIgnored && (ke = !1);
          }
          if (ke) {
            for (; D.endsParent && D.parent; )
              D = D.parent;
            return D;
          }
        }
        if (D.endsWithParent)
          return mr(D.parent, Z, se);
      }
      function na(D) {
        return ae.matcher.regexIndex === 0 ? (Se += D[0], 1) : (En = !0, 0);
      }
      function ra(D) {
        const Z = D[0], se = D.rule, ke = new t(se), $e = [se.__beforeBegin, se["on:begin"]];
        for (const Je of $e)
          if (Je && (Je(D, ke), ke.isMatchIgnored))
            return na(Z);
        return se.skip ? Se += Z : (se.excludeBegin && (Se += Z), qe(), !se.returnBegin && !se.excludeBegin && (Se = Z)), gr(se, D), se.returnBegin ? 0 : Z.length;
      }
      function ia(D) {
        const Z = D[0], se = Y.substring(D.index), ke = mr(ae, D, se);
        if (!ke)
          return cr;
        const $e = ae;
        ae.endScope && ae.endScope._wrap ? (qe(), Ze(Z, ae.endScope._wrap)) : ae.endScope && ae.endScope._multi ? (qe(), fr(ae.endScope, D)) : $e.skip ? Se += Z : ($e.returnEnd || $e.excludeEnd || (Se += Z), qe(), $e.excludeEnd && (Se = Z));
        do
          ae.scope && Pe.closeNode(), !ae.skip && !ae.subLanguage && (Jt += ae.relevance), ae = ae.parent;
        while (ae !== ke.parent);
        return ke.starts && gr(ke.starts, D), $e.returnEnd ? 0 : Z.length;
      }
      function aa() {
        const D = [];
        for (let Z = ae; Z !== Ge; Z = Z.parent)
          Z.scope && D.unshift(Z.scope);
        D.forEach((Z) => Pe.openNode(Z));
      }
      let Vt = {};
      function br(D, Z) {
        const se = Z && Z[0];
        if (Se += D, se == null)
          return qe(), 0;
        if (Vt.type === "begin" && Z.type === "end" && Vt.index === Z.index && se === "") {
          if (Se += Y.slice(Z.index, Z.index + 1), !ve) {
            const ke = new Error(`0 width match regex (${z})`);
            throw ke.languageName = z, ke.badRule = Vt.rule, ke;
          }
          return 1;
        }
        if (Vt = Z, Z.type === "begin")
          return ra(Z);
        if (Z.type === "illegal" && !he) {
          const ke = new Error('Illegal lexeme "' + se + '" for mode "' + (ae.scope || "<unnamed>") + '"');
          throw ke.mode = ae, ke;
        } else if (Z.type === "end") {
          const ke = ia(Z);
          if (ke !== cr)
            return ke;
        }
        if (Z.type === "illegal" && se === "")
          return Se += `
`, 1;
        if (An > 1e5 && An > Z.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Se += se, se.length;
      }
      const Ge = nt(z);
      if (!Ge)
        throw lt(Ae.replace("{}", z)), new Error('Unknown language: "' + z + '"');
      const sa = Di(Ge);
      let vn = "", ae = xe || sa;
      const wr = {}, Pe = new j.__emitter(j);
      aa();
      let Se = "", Jt = 0, ct = 0, An = 0, En = !1;
      try {
        if (Ge.__emitTokens)
          Ge.__emitTokens(Y, Pe);
        else {
          for (ae.matcher.considerAll(); ; ) {
            An++, En ? En = !1 : ae.matcher.considerAll(), ae.matcher.lastIndex = ct;
            const D = ae.matcher.exec(Y);
            if (!D) break;
            const Z = Y.substring(ct, D.index), se = br(Z, D);
            ct = D.index + se;
          }
          br(Y.substring(ct));
        }
        return Pe.finalize(), vn = Pe.toHTML(), {
          language: z,
          value: vn,
          relevance: Jt,
          illegal: !1,
          _emitter: Pe,
          _top: ae
        };
      } catch (D) {
        if (D.message && D.message.includes("Illegal"))
          return {
            language: z,
            value: kn(Y),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: D.message,
              index: ct,
              context: Y.slice(ct - 100, ct + 100),
              mode: D.mode,
              resultSoFar: vn
            },
            _emitter: Pe
          };
        if (ve)
          return {
            language: z,
            value: kn(Y),
            illegal: !1,
            relevance: 0,
            errorRaised: D,
            _emitter: Pe,
            _top: ae
          };
        throw D;
      }
    }
    function _n(z) {
      const Y = {
        value: kn(z),
        illegal: !1,
        relevance: 0,
        _top: F,
        _emitter: new j.__emitter(j)
      };
      return Y._emitter.addText(z), Y;
    }
    function xn(z, Y) {
      Y = Y || j.languages || Object.keys(A);
      const he = _n(z), xe = Y.filter(nt).filter(pr).map(
        (qe) => St(qe, z, !1)
      );
      xe.unshift(he);
      const Le = xe.sort((qe, Ze) => {
        if (qe.relevance !== Ze.relevance) return Ze.relevance - qe.relevance;
        if (qe.language && Ze.language) {
          if (nt(qe.language).supersetOf === Ze.language)
            return 1;
          if (nt(Ze.language).supersetOf === qe.language)
            return -1;
        }
        return 0;
      }), [Fe, rt] = Le, Yt = Fe;
      return Yt.secondBest = rt, Yt;
    }
    function Fi(z, Y, he) {
      const xe = Y && B[Y] || he;
      z.classList.add("hljs"), z.classList.add(`language-${xe}`);
    }
    function Sn(z) {
      let Y = null;
      const he = Ce(z);
      if (te(he)) return;
      if (Xt(
        "before:highlightElement",
        { el: z, language: he }
      ), z.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", z);
        return;
      }
      if (z.children.length > 0 && (j.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(z)), j.throwUnescapedHTML))
        throw new ji(
          "One of your code blocks includes unescaped HTML.",
          z.innerHTML
        );
      Y = z;
      const xe = Y.textContent, Le = he ? Ee(xe, { language: he, ignoreIllegals: !0 }) : xn(xe);
      z.innerHTML = Le.value, z.dataset.highlighted = "yes", Fi(z, he, Le.language), z.result = {
        language: Le.language,
        // TODO: remove with version 11.0
        re: Le.relevance,
        relevance: Le.relevance
      }, Le.secondBest && (z.secondBest = {
        language: Le.secondBest.language,
        relevance: Le.secondBest.relevance
      }), Xt("after:highlightElement", { el: z, result: Le, text: xe });
    }
    function Zi(z) {
      j = lr(j, z);
    }
    const Gi = () => {
      Kt(), mt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Qi() {
      Kt(), mt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let hr = !1;
    function Kt() {
      function z() {
        Kt();
      }
      if (document.readyState === "loading") {
        hr || window.addEventListener("DOMContentLoaded", z, !1), hr = !0;
        return;
      }
      document.querySelectorAll(j.cssSelector).forEach(Sn);
    }
    function Ki(z, Y) {
      let he = null;
      try {
        he = Y(w);
      } catch (xe) {
        if (lt("Language definition for '{}' could not be registered.".replace("{}", z)), ve)
          lt(xe);
        else
          throw xe;
        he = F;
      }
      he.name || (he.name = z), A[z] = he, he.rawDefinition = Y.bind(null, w), he.aliases && dr(he.aliases, { languageName: z });
    }
    function Xi(z) {
      delete A[z];
      for (const Y of Object.keys(B))
        B[Y] === z && delete B[Y];
    }
    function Yi() {
      return Object.keys(A);
    }
    function nt(z) {
      return z = (z || "").toLowerCase(), A[z] || A[B[z]];
    }
    function dr(z, { languageName: Y }) {
      typeof z == "string" && (z = [z]), z.forEach((he) => {
        B[he.toLowerCase()] = Y;
      });
    }
    function pr(z) {
      const Y = nt(z);
      return Y && !Y.disableAutodetect;
    }
    function Vi(z) {
      z["before:highlightBlock"] && !z["before:highlightElement"] && (z["before:highlightElement"] = (Y) => {
        z["before:highlightBlock"](
          Object.assign({ block: Y.el }, Y)
        );
      }), z["after:highlightBlock"] && !z["after:highlightElement"] && (z["after:highlightElement"] = (Y) => {
        z["after:highlightBlock"](
          Object.assign({ block: Y.el }, Y)
        );
      });
    }
    function Ji(z) {
      Vi(z), ie.push(z);
    }
    function ea(z) {
      const Y = ie.indexOf(z);
      Y !== -1 && ie.splice(Y, 1);
    }
    function Xt(z, Y) {
      const he = z;
      ie.forEach(function(xe) {
        xe[he] && xe[he](Y);
      });
    }
    function ta(z) {
      return mt("10.7.0", "highlightBlock will be removed entirely in v12.0"), mt("10.7.0", "Please use highlightElement now."), Sn(z);
    }
    Object.assign(w, {
      highlight: Ee,
      highlightAuto: xn,
      highlightAll: Kt,
      highlightElement: Sn,
      // TODO: Remove with v12 API
      highlightBlock: ta,
      configure: Zi,
      initHighlighting: Gi,
      initHighlightingOnLoad: Qi,
      registerLanguage: Ki,
      unregisterLanguage: Xi,
      listLanguages: Yi,
      getLanguage: nt,
      registerAliases: dr,
      autoDetection: pr,
      inherit: lr,
      addPlugin: Ji,
      removePlugin: ea
    }), w.debugMode = function() {
      ve = !1;
    }, w.safeMode = function() {
      ve = !0;
    }, w.versionString = Hi, w.regex = {
      concat: f,
      lookahead: m,
      either: b,
      optional: h,
      anyNumberOfTimes: d
    };
    for (const z in U)
      typeof U[z] == "object" && e(U[z]);
    return Object.assign(w, U), w;
  }, bt = ur({});
  return bt.newInstance = () => ur({}), Ln = bt, bt.HighlightJS = bt, bt.default = bt, Ln;
}
var ua = /* @__PURE__ */ ca();
const fe = /* @__PURE__ */ Wr(ua), ha = "11.11.1", le = /* @__PURE__ */ new Map(), da = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", De = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
De.html = "xml";
De.xhtml = "xml";
De.markup = "xml";
const Fr = /* @__PURE__ */ new Set(["magic", "undefined"]);
let at = null;
const Rn = /* @__PURE__ */ new Map(), pa = 300 * 1e3;
async function Zr(e = da) {
  if (e)
    return at || (at = (async () => {
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
          const p = u.replace(/^\||\|$/g, "").split("|").map((g) => g.trim());
          if (p.every((g) => /^-+$/.test(g))) continue;
          const m = p;
          if (!m.length) continue;
          const h = (m[c] || m[0] || "").toString().trim().toLowerCase();
          if (!h || /^-+$/.test(h)) continue;
          le.set(h, h);
          const f = m[s] || "";
          if (f) {
            const g = String(f).split(",").map((b) => b.replace(/`/g, "").trim()).filter(Boolean);
            if (g.length) {
              const y = g[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (le.set(y, y), o.push(y));
            }
          }
        }
        try {
          const l = [];
          for (const u of o) {
            const p = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            p && /[a-z0-9]/i.test(p) ? l.push(p) : le.delete(u);
          }
          o = l;
        } catch (l) {
          console.warn("[codeblocksManager] cleanup aliases failed", l);
        }
        try {
          let l = 0;
          for (const u of Array.from(le.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              le.delete(u), l++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const p = u.replace(/^[:]+/, "");
              if (p && /[a-z0-9]/i.test(p)) {
                const m = le.get(u);
                le.delete(u), le.set(p, m);
              } else
                le.delete(u), l++;
            }
          }
          for (const [u, p] of Array.from(le.entries()))
            (!p || /^-+$/.test(p) || !/[a-z0-9]/i.test(p)) && (le.delete(u), l++);
          try {
            const u = ":---------------------";
            le.has(u) && (le.delete(u), l++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(le.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (l) {
          console.warn("[codeblocksManager] ignored error", l);
        }
      } catch (t) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), at);
}
const vt = /* @__PURE__ */ new Set();
async function Dt(e, t) {
  if (at || (async () => {
    try {
      await Zr();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), at)
    try {
      await at;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Fr.has(n)) return !1;
  if (le.size && !le.has(n)) {
    const r = De;
    if (!r[n] && !r[e])
      return !1;
  }
  if (vt.has(e)) return !0;
  const i = De;
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
    le.size && (c = c.filter((u) => {
      if (le.has(u)) return !0;
      const p = De[u];
      return !!(p && le.has(p));
    }));
    let o = null, l = null;
    for (const u of c)
      try {
        const p = Date.now();
        let m = Rn.get(u);
        if (m && m.ok === !1 && p - (m.ts || 0) >= pa && (Rn.delete(u), m = void 0), m) {
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
          Rn.set(u, d), d.promise = (async () => {
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
                  const f = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;
                  return await new Function("u", "return import(u)")(f);
                } catch {
                  try {
                    const g = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;
                    return await new Function("u", "return import(u)")(g);
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
            const h = le.size && le.get(e) || u || e;
            return fe.registerLanguage(h, d), vt.add(h), h !== e && (fe.registerLanguage(e, d), vt.add(e)), !0;
          } catch (h) {
            l = h;
          }
        } else
          try {
            if (le.has(u) || le.has(e)) {
              const d = () => ({});
              try {
                fe.registerLanguage(u, d), vt.add(u);
              } catch {
              }
              try {
                u !== e && (fe.registerLanguage(e, d), vt.add(e));
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
let en = null;
function fa(e = document) {
  at || (async () => {
    try {
      await Zr();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = De, i = en || (typeof IntersectionObserver > "u" ? null : (en = new IntersectionObserver((a, s) => {
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
            const p = (u[1] || "").toLowerCase(), m = t[p] || p, d = le.size && (le.get(m) || le.get(String(m).toLowerCase())) || m;
            try {
              await Dt(d);
            } catch (h) {
              console.warn("[codeblocksManager] registerLanguage failed", h);
            }
            try {
              try {
                const h = o.textContent || o.innerText || "";
                h != null && (o.textContent = h);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              fe.highlightElement(o);
            } catch (h) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", h);
            }
          } else
            try {
              const p = o.textContent || "";
              try {
                if (fe && typeof fe.getLanguage == "function" && fe.getLanguage("plaintext")) {
                  const m = fe.highlight(p, { language: "plaintext" });
                  m && m.value && (o.innerHTML = m.value);
                }
              } catch {
                try {
                  fe.highlightElement(o);
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
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), en)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", c = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const o = (c[1] || "").toLowerCase(), l = t[o] || o, u = le.size && (le.get(l) || le.get(String(l).toLowerCase())) || l;
          try {
            await Dt(u);
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
          fe.highlightElement(a);
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
function No(e, { useCdn: t = !0 } = {}) {
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
  const s = a, c = `https://cdn.jsdelivr.net/npm/highlight.js@${ha}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = c, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let ht = "light";
function ga(e, t = {}) {
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
function _r() {
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
async function ma(e = "none", t = "/") {
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
    if (_r(), document.querySelector("style[data-bulma-override]")) return;
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
    _r();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    ga(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function ba(e) {
  ht = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        ht === "dark" ? n.setAttribute("data-theme", "dark") : ht === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      ht === "dark" ? n.setAttribute("data-theme", "dark") : ht === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Oo(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Gr(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (ht === "dark" ? t.setAttribute("data-theme", "dark") : ht === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Qr = {
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
}, kt = JSON.parse(JSON.stringify(Qr));
let on = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  on = String(e).split("-")[0].toLowerCase();
}
Qr[on] || (on = "en");
let st = on;
function Rt(e, t = {}) {
  const n = kt[st] || kt.en;
  let i = n && n[e] ? n[e] : kt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Kr(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      kt[a] = Object.assign({}, kt[a] || {}, r[a]);
  } catch {
  }
}
function Xr(e) {
  const t = String(e).split("-")[0].toLowerCase();
  st = kt[t] ? t : "en";
}
const wa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return st;
  },
  loadL10nFile: Kr,
  setLang: Xr,
  t: Rt
}, Symbol.toStringTag, { value: "Module" })), ya = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function ka(e, t = "worker") {
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
      const h = String(Math.random()), f = Object.assign({}, l, { id: h });
      let g = null;
      const b = () => {
        g && clearTimeout(g), d.removeEventListener("message", y), d.removeEventListener("error", k);
      }, y = (S) => {
        const $ = S.data || {};
        $.id === h && (b(), $.error ? m(new Error($.error)) : p($.result));
      }, k = (S) => {
        b(), r("[" + t + "] worker error event", S);
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch ($) {
          r("[" + t + "] worker termination failed", $);
        }
        m(new Error(S && S.message || "worker error"));
      };
      g = setTimeout(() => {
        b(), r("[" + t + "] worker timed out");
        try {
          n === d && (n = null, d.terminate && d.terminate());
        } catch (S) {
          r("[" + t + "] worker termination on timeout failed", S);
        }
        m(new Error("worker timeout"));
      }, u), d.addEventListener("message", y), d.addEventListener("error", k);
      try {
        d.postMessage(f);
      } catch (S) {
        b(), m(S);
      }
    });
  }
  return { get: a, send: c, terminate: s };
}
function Yr(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  const a = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function s(...f) {
    try {
      a && console && typeof console.warn == "function" && console.warn(...f);
    } catch {
    }
  }
  function c(f) {
    if (!i[f])
      try {
        const g = e();
        i[f] = g || null, g && g.addEventListener("error", () => {
          try {
            i[f] === g && (i[f] = null, g.terminate && g.terminate());
          } catch (b) {
            s("[" + t + "] worker termination failed", b);
          }
        });
      } catch (g) {
        i[f] = null, s("[" + t + "] worker init failed", g);
      }
    return i[f];
  }
  const o = new Array(n).fill(0), l = new Array(n).fill(null), u = 30 * 1e3;
  function p(f) {
    try {
      o[f] = Date.now(), l[f] && (clearTimeout(l[f]), l[f] = null), l[f] = setTimeout(() => {
        try {
          i[f] && (i[f].terminate && i[f].terminate(), i[f] = null);
        } catch (g) {
          s("[" + t + "] idle termination failed", g);
        }
        l[f] = null;
      }, u);
    } catch {
    }
  }
  function m() {
    for (let f = 0; f < i.length; f++) {
      const g = c(f);
      if (g) return g;
    }
    return null;
  }
  function d() {
    for (let f = 0; f < i.length; f++)
      try {
        i[f] && (i[f].terminate && i[f].terminate(), i[f] = null);
      } catch (g) {
        s("[" + t + "] worker termination failed", g);
      }
  }
  function h(f, g = 1e4) {
    return new Promise((b, y) => {
      const k = r++ % i.length, S = ($) => {
        const H = (k + $) % i.length, K = c(H);
        if (!K)
          return $ + 1 < i.length ? S($ + 1) : y(new Error("worker pool unavailable"));
        const q = String(Math.random()), ee = Object.assign({}, f, { id: q });
        let ue = null;
        const T = () => {
          ue && clearTimeout(ue), K.removeEventListener("message", Q), K.removeEventListener("error", _e);
        }, Q = (re) => {
          const G = re.data || {};
          G.id === q && (T(), G.error ? y(new Error(G.error)) : b(G.result));
        }, _e = (re) => {
          T(), s("[" + t + "] worker error event", re);
          try {
            i[H] === K && (i[H] = null, K.terminate && K.terminate());
          } catch (G) {
            s("[" + t + "] worker termination failed", G);
          }
          y(new Error(re && re.message || "worker error"));
        };
        ue = setTimeout(() => {
          T(), s("[" + t + "] worker timed out");
          try {
            i[H] === K && (i[H] = null, K.terminate && K.terminate());
          } catch (re) {
            s("[" + t + "] worker termination on timeout failed", re);
          }
          y(new Error("worker timeout"));
        }, g), K.addEventListener("message", Q), K.addEventListener("error", _e);
        try {
          p(H), K.postMessage(ee);
        } catch (re) {
          T(), y(re);
        }
      };
      S(0);
    });
  }
  return { get: m, send: h, terminate: d };
}
function Tt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Tt._blobUrlCache || (Tt._blobUrlCache = /* @__PURE__ */ new Map());
        const t = Tt._blobUrlCache;
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
function Fn(e) {
  _a(), Xe.clear();
  for (const t of Ue)
    t && Xe.add(t);
  xr(ne), xr(E), Fn._refreshed = !0;
}
function xr(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && Xe.add(t);
}
function Sr(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && Xe.add(i), t.call(this, n, i);
  };
}
let vr = !1;
function _a() {
  vr || (Sr(ne), Sr(E), vr = !0);
}
function Vr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
function ce(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}
function jt(e) {
  return String(e || "").replace(/\/+$/, "");
}
function ft(e) {
  return jt(e) + "/";
}
function xa(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    console.warn("[helpers] preloadImage failed", t);
  }
}
function tn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, u = (a ? Math.min(c, a.bottom) : c) + Number(t || 0);
    let p = 0;
    r && (p = r.clientHeight || (a ? a.height : 0)), p || (p = c - s);
    let m = 0.6;
    try {
      const g = r && window.getComputedStyle ? window.getComputedStyle(r) : null, b = g && g.getPropertyValue("--nimbi-image-max-height-ratio"), y = b ? parseFloat(b) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (m = y);
    } catch (g) {
      console.warn("[helpers] read CSS ratio failed", g);
    }
    const d = Math.max(200, Math.floor(p * m));
    let h = !1, f = null;
    if (i.forEach((g) => {
      try {
        const b = g.getAttribute ? g.getAttribute("loading") : void 0;
        b !== "eager" && g.setAttribute && g.setAttribute("loading", "lazy");
        const y = g.getBoundingClientRect ? g.getBoundingClientRect() : null, k = g.src || g.getAttribute && g.getAttribute("src"), S = y && y.height > 1 ? y.height : d, $ = y ? y.top : 0, H = $ + S;
        y && S > 0 && $ <= u && H >= o && (g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high"), xa(k), h = !0), !f && y && y.top <= u && (f = { img: g, src: k, rect: y, beforeLoading: b });
      } catch (b) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", b);
      }
    }), !h && f) {
      const { img: g, src: b, rect: y, beforeLoading: k } = f;
      try {
        g.setAttribute ? (g.setAttribute("loading", "eager"), g.setAttribute("fetchpriority", "high"), g.setAttribute("data-eager-by-nimbi", "1")) : (g.loading = "eager", g.fetchPriority = "high");
      } catch (S) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", S);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Te(e, t = null, n) {
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
function de(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return console.warn("[helpers] encodeURL failed", t), String(e || "");
  }
}
function ln(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = ln);
} catch (e) {
  console.warn("[helpers] global attach failed", e);
}
function Sa(e) {
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
const ne = /* @__PURE__ */ new Map();
let Oe = [], Zn = !1;
function va(e) {
  Zn = !!e;
}
function Jr(e) {
  Oe = Array.isArray(e) ? e.slice() : [];
}
function Aa() {
  return Oe;
}
const ei = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, ti = Yr(() => Tt(ya), "slugManager", ei);
function Ea() {
  return ti.get();
}
function ni(e) {
  return ti.send(e, 5e3);
}
async function La(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => _t);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await ni({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Ra(e, t, n) {
  const i = await Promise.resolve().then(() => _t);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return ni({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function it(e, t) {
  if (e)
    if (Oe && Oe.length) {
      const i = t.split("/")[0], r = Oe.includes(i);
      let a = ne.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, ne.set(e, a);
    } else
      ne.set(e, t);
}
const gn = /* @__PURE__ */ new Set();
function Ca(e) {
  typeof e == "function" && gn.add(e);
}
function Ta(e) {
  typeof e == "function" && gn.delete(e);
}
const E = /* @__PURE__ */ new Map();
let Nn = {}, Ue = [], xt = "_404.md", wt = "_home.md";
function On(e) {
  e != null && (xt = String(e || ""));
}
function Ma(e) {
  e != null && (wt = String(e || ""));
}
function Pa(e) {
  Nn = e || {};
}
const Mt = /* @__PURE__ */ new Map(), cn = /* @__PURE__ */ new Set();
function $a() {
  Mt.clear(), cn.clear();
}
function za(e) {
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
function un(e) {
  ne.clear(), E.clear(), Ue = [], Oe = Oe || [];
  const t = Object.keys(Nn || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      n = ft(n);
    }
  } catch (i) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = za(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = ce(i.slice(n.length)) : r = ce(i), Ue.push(r);
    try {
      Fn();
    } catch (s) {
      console.warn("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Nn[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const c = ye(s[1].trim());
        if (c)
          try {
            let o = c;
            if ((!Oe || !Oe.length) && (o = ri(o, new Set(ne.keys()))), Oe && Oe.length) {
              const u = r.split("/")[0], p = Oe.includes(u);
              let m = ne.get(o);
              (!m || typeof m == "string") && (m = { default: typeof m == "string" ? m : void 0, langs: {} }), p ? m.langs[u] = r : m.default = r, ne.set(o, m);
            } else
              ne.set(o, r);
            E.set(r, o);
          } catch (o) {
            console.warn("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  un();
} catch (e) {
  console.warn("[slugManager] initial setContentBase failed", e);
}
function ye(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function ri(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Ia(e) {
  return Wt(e, void 0);
}
function Wt(e, t) {
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
function rn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function Ft(e) {
  if (!e || !ne.has(e)) return null;
  const t = ne.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (Oe && Oe.length && st && t.langs && t.langs[st])
    return t.langs[st];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Pt = /* @__PURE__ */ new Map();
function Na() {
  Pt.clear();
}
let Me = async function(e, t) {
  if (!e) throw new Error("path required");
  try {
    const a = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (a && ne.has(a)) {
      const s = Ft(a) || ne.get(a);
      s && s !== e && (e = s);
    }
  } catch (a) {
    console.warn("[slugManager] slug mapping normalization failed", a);
  }
  const n = t == null ? "" : jt(String(t));
  let i = "";
  try {
    const a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (n && n.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(n))
      i = n.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
    else {
      let s = a + "/";
      n && (/^[a-z][a-z0-9+.-]*:/i.test(n) ? s = n.replace(/\/$/, "") + "/" : n.startsWith("/") ? s = a + n.replace(/\/$/, "") + "/" : s = a + "/" + n.replace(/\/$/, "") + "/"), i = new URL(e.replace(/^\//, ""), s).toString();
    }
  } catch {
    i = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  if (Pt.has(i))
    return Pt.get(i);
  const r = (async () => {
    const a = await fetch(i);
    if (!a || typeof a.ok != "boolean" || !a.ok) {
      if (a && a.status === 404)
        try {
          const p = `${n}/${xt}`, m = await globalThis.fetch(p);
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
        const u = `${n}/${xt}`, p = await globalThis.fetch(u);
        if (p.ok)
          return { raw: await p.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return l ? { raw: s, isHtml: !0 } : { raw: s };
  })();
  return Pt.set(i, r), r;
};
function Oa(e) {
  typeof e == "function" && (Me = e);
}
const an = /* @__PURE__ */ new Map();
function Ba(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let et = [], At = null;
async function ii(e, t = 1, n = void 0) {
  const i = Array.isArray(n) ? Array.from(new Set((n || []).map((r) => ce(String(r || ""))))) : [];
  try {
    const r = ce(String(xt || ""));
    r && !i.includes(r) && i.push(r);
  } catch {
  }
  if (et && et.length && t === 1 && !et.some((a) => {
    try {
      return i.includes(ce(String(a.path || "")));
    } catch {
      return !1;
    }
  }))
    return et;
  if (At) return At;
  At = (async () => {
    let r = Array.isArray(n) ? Array.from(new Set((n || []).map((l) => ce(String(l || ""))))) : [];
    try {
      const l = ce(String(xt || ""));
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
    if (Ue && Ue.length && (s = Array.from(Ue)), !s.length)
      for (const l of ne.values())
        l && s.push(l);
    try {
      const l = await ci(e);
      l && l.length && (s = s.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(s), u = [...s], p = Math.max(1, ei), m = async () => {
        for (; !(l.size > Zt); ) {
          const h = u.shift();
          if (!h) break;
          try {
            const f = await Me(h, e);
            if (f && f.raw) {
              if (f.status === 404) continue;
              let g = f.raw;
              const b = [], y = String(h || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(y) && Zn && (!h || !h.includes("/")))
                continue;
              const k = Ba(g), S = /\[[^\]]+\]\(([^)]+)\)/g;
              let $;
              for (; $ = S.exec(k); )
                b.push($[1]);
              const H = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; $ = H.exec(k); )
                b.push($[1]);
              const K = h && h.includes("/") ? h.substring(0, h.lastIndexOf("/") + 1) : "";
              for (let q of b)
                try {
                  if (Wt(q, e) || q.startsWith("..") || q.indexOf("/../") !== -1 || (K && !q.startsWith("./") && !q.startsWith("/") && !q.startsWith("../") && (q = K + q), q = ce(q), !/\.(md|html?)(?:$|[?#])/i.test(q)) || (q = q.split(/[?#]/)[0], a(q))) continue;
                  l.has(q) || (l.add(q), u.push(q), s.push(q));
                } catch (ee) {
                  console.warn("[slugManager] href processing failed", q, ee);
                }
            }
          } catch (f) {
            console.warn("[slugManager] discovery fetch failed for", h, f);
          }
        }
      }, d = [];
      for (let h = 0; h < p; h++) d.push(m());
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
          const u = await Me(l, e);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let p = "", m = "";
            if (u.isHtml)
              try {
                const f = new DOMParser().parseFromString(u.raw, "text/html"), g = f.querySelector("title") || f.querySelector("h1");
                g && g.textContent && (p = g.textContent.trim());
                const b = f.querySelector("p");
                if (b && b.textContent && (m = b.textContent.trim()), t >= 2)
                  try {
                    const y = f.querySelector("h1"), k = y && y.textContent ? y.textContent.trim() : p || "", S = (() => {
                      try {
                        if (E.has(l)) return E.get(l);
                      } catch {
                      }
                      return ye(p || l);
                    })(), $ = Array.from(f.querySelectorAll("h2"));
                    for (const H of $)
                      try {
                        const K = (H.textContent || "").trim();
                        if (!K) continue;
                        const q = H.id ? H.id : ye(K), ee = S ? `${S}::${q}` : `${ye(l)}::${q}`;
                        let ue = "", T = H.nextElementSibling;
                        for (; T && T.tagName && T.tagName.toLowerCase() === "script"; ) T = T.nextElementSibling;
                        T && T.textContent && (ue = String(T.textContent).trim()), o.push({ slug: ee, title: K, excerpt: ue, path: l, parentTitle: k });
                      } catch (K) {
                        console.warn("[slugManager] indexing H2 failed", K);
                      }
                    if (t === 3)
                      try {
                        const H = Array.from(f.querySelectorAll("h3"));
                        for (const K of H)
                          try {
                            const q = (K.textContent || "").trim();
                            if (!q) continue;
                            const ee = K.id ? K.id : ye(q), ue = S ? `${S}::${ee}` : `${ye(l)}::${ee}`;
                            let T = "", Q = K.nextElementSibling;
                            for (; Q && Q.tagName && Q.tagName.toLowerCase() === "script"; ) Q = Q.nextElementSibling;
                            Q && Q.textContent && (T = String(Q.textContent).trim()), o.push({ slug: ue, title: q, excerpt: T, path: l, parentTitle: k });
                          } catch (q) {
                            console.warn("[slugManager] indexing H3 failed", q);
                          }
                      } catch (H) {
                        console.warn("[slugManager] collect H3s failed", H);
                      }
                  } catch (y) {
                    console.warn("[slugManager] collect H2s failed", y);
                  }
              } catch (h) {
                console.warn("[slugManager] parsing HTML for index failed", h);
              }
            else {
              const h = u.raw, f = h.match(/^#\s+(.+)$/m);
              p = f ? f[1].trim() : "";
              try {
                p = rn(p);
              } catch {
              }
              const g = h.split(/\r?\n\s*\r?\n/);
              if (g.length > 1)
                for (let b = 1; b < g.length; b++) {
                  const y = g[b].trim();
                  if (y && !/^#/.test(y)) {
                    m = y.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (t >= 2) {
                let b = "", y = "";
                try {
                  const k = (h.match(/^#\s+(.+)$/m) || [])[1];
                  b = k ? k.trim() : "", y = (function() {
                    try {
                      if (E.has(l)) return E.get(l);
                    } catch {
                    }
                    return ye(p || l);
                  })();
                  const S = /^##\s+(.+)$/gm;
                  let $;
                  for (; $ = S.exec(h); )
                    try {
                      const H = ($[1] || "").trim(), K = rn(H);
                      if (!H) continue;
                      const q = ye(H), ee = y ? `${y}::${q}` : `${ye(l)}::${q}`, T = h.slice(S.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), Q = T && T[1] ? String(T[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: ee, title: K, excerpt: Q, path: l, parentTitle: b });
                    } catch (H) {
                      console.warn("[slugManager] indexing markdown H2 failed", H);
                    }
                } catch (k) {
                  console.warn("[slugManager] collect markdown H2s failed", k);
                }
                if (t === 3)
                  try {
                    const k = /^###\s+(.+)$/gm;
                    let S;
                    for (; S = k.exec(h); )
                      try {
                        const $ = (S[1] || "").trim(), H = rn($);
                        if (!$) continue;
                        const K = ye($), q = y ? `${y}::${K}` : `${ye(l)}::${K}`, ue = h.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), T = ue && ue[1] ? String(ue[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        o.push({ slug: q, title: H, excerpt: T, path: l, parentTitle: b });
                      } catch ($) {
                        console.warn("[slugManager] indexing markdown H3 failed", $);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect markdown H3s failed", k);
                  }
              }
            }
            let d = "";
            try {
              E.has(l) && (d = E.get(l));
            } catch (h) {
              console.warn("[slugManager] mdToSlug access failed", h);
            }
            d || (d = ye(p || l)), o.push({ slug: d, title: p, excerpt: m, path: l });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    try {
      et = o.filter((u) => {
        try {
          return !a(String(u.path || ""));
        } catch {
          return !0;
        }
      });
    } catch (l) {
      console.warn("[slugManager] filtering index by excludes failed", l), et = o;
    }
    return et;
  })();
  try {
    await At;
  } catch (r) {
    console.warn("[slugManager] awaiting _indexPromise failed", r);
  }
  return At = null, et;
}
const ai = 1e3;
let Zt = ai;
function qa(e) {
  typeof e == "number" && e >= 0 && (Zt = e);
}
const si = new DOMParser(), oi = "a[href]";
let li = async function(e, t, n = Zt) {
  if (an.has(e)) return an.get(e);
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
      } catch (f) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: l, error: f });
        continue;
      }
      if (!u || !u.ok) {
        u && !u.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: l, status: u.status });
        continue;
      }
      const p = await u.text(), d = si.parseFromString(p, "text/html").querySelectorAll(oi), h = l;
      for (const f of d)
        try {
          let g = f.getAttribute("href") || "";
          if (!g || Wt(g, t) || g.startsWith("..") || g.indexOf("/../") !== -1) continue;
          if (g.endsWith("/")) {
            try {
              const b = new URL(g, h), y = new URL(c).pathname, k = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, ""), S = ft(ce(k));
              r.has(S) || a.push(S);
            } catch {
              const y = ce(o + g);
              r.has(y) || a.push(y);
            }
            continue;
          }
          if (g.toLowerCase().endsWith(".md")) {
            let b = "";
            try {
              const y = new URL(g, h), k = new URL(c).pathname;
              b = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, "");
            } catch {
              b = (o + g).replace(/^\//, "");
            }
            b = ce(b);
            try {
              if (E.has(b))
                continue;
              for (const y of ne.values())
                ;
            } catch (y) {
              console.warn("[slugManager] slug map access failed", y);
            }
            try {
              const y = await Me(b, t);
              if (y && y.raw) {
                const k = (y.raw || "").match(/^#\s+(.+)$/m);
                if (k && k[1] && ye(k[1].trim()) === e) {
                  i = b;
                  break;
                }
              }
            } catch (y) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", y);
            }
          }
        } catch (g) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", g);
        }
    } catch (u) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", u);
    }
  }
  return an.set(e, i), i;
};
async function ci(e, t = Zt) {
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
      } catch (h) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: o, error: h });
        continue;
      }
      if (!l || !l.ok) {
        l && !l.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: o, status: l.status });
        continue;
      }
      const u = await l.text(), m = si.parseFromString(u, "text/html").querySelectorAll(oi), d = o;
      for (const h of m)
        try {
          let f = h.getAttribute("href") || "";
          if (!f || Wt(f, e) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
          if (f.endsWith("/")) {
            try {
              const b = new URL(f, d), y = new URL(s).pathname, k = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, ""), S = ft(ce(k));
              i.has(S) || r.push(S);
            } catch {
              const y = c + f;
              i.has(y) || r.push(y);
            }
            continue;
          }
          let g = "";
          try {
            const b = new URL(f, d), y = new URL(s).pathname;
            g = b.pathname.startsWith(y) ? b.pathname.slice(y.length) : b.pathname.replace(/^\//, "");
          } catch {
            g = (c + f).replace(/^\//, "");
          }
          g = ce(g), /\.(md|html?)$/i.test(g) && n.add(g);
        } catch (f) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", f);
        }
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", l);
    }
  }
  return Array.from(n);
}
async function ui(e, t, n) {
  if (e && typeof e == "string" && (e = ce(e), e = jt(e)), ne.has(e))
    return Ft(e) || ne.get(e);
  for (const r of gn)
    try {
      const a = await r(e, t);
      if (a)
        return it(e, a), E.set(a, e), a;
    } catch (a) {
      console.warn("[slugManager] slug resolver failed", a);
    }
  if (Ue && Ue.length) {
    if (Mt.has(e)) {
      const r = Mt.get(e);
      return ne.set(e, r), E.set(r, e), r;
    }
    for (const r of Ue)
      if (!cn.has(r))
        try {
          const a = await Me(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const c = ye(s[1].trim());
              if (cn.add(r), c && Mt.set(c, r), c === e)
                return it(e, r), E.set(r, e), r;
            }
          }
        } catch (a) {
          console.warn("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await ii(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return it(e, a.path), E.set(a.path, e), a.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await li(e, t, n);
    if (r)
      return it(e, r), E.set(r, e), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Me(r, t);
      if (a && a.raw)
        return it(e, r), E.set(r, e), r;
    } catch (a) {
      console.warn("[slugManager] candidate fetch failed", a);
    }
  if (Ue && Ue.length)
    for (const r of Ue)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ye(a) === e)
          return it(e, r), E.set(r, e), r;
      } catch (a) {
        console.warn("[slugManager] build-time filename match failed", a);
      }
  try {
    const r = [];
    wt && typeof wt == "string" && wt.trim() && r.push(wt), r.includes("_home.md") || r.push("_home.md");
    for (const a of r)
      try {
        const s = await Me(a, t);
        if (s && s.raw) {
          const c = (s.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && ye(c[1].trim()) === e)
            return it(e, a), E.set(a, e), a;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ai,
  _setAllMd: Pa,
  _storeSlugMapping: it,
  addSlugResolver: Ca,
  get allMarkdownPaths() {
    return Ue;
  },
  get availableLanguages() {
    return Oe;
  },
  buildSearchIndex: ii,
  buildSearchIndexWorker: La,
  clearFetchCache: Na,
  clearListCaches: $a,
  crawlAllMarkdown: ci,
  crawlCache: an,
  crawlForSlug: li,
  crawlForSlugWorker: Ra,
  get defaultCrawlMaxQueue() {
    return Zt;
  },
  ensureSlug: ui,
  fetchCache: Pt,
  get fetchMarkdown() {
    return Me;
  },
  getLanguages: Aa,
  get homePage() {
    return wt;
  },
  initSlugWorker: Ea,
  isExternalLink: Ia,
  isExternalLinkWithBase: Wt,
  listPathsFetched: cn,
  listSlugCache: Mt,
  mdToSlug: E,
  get notFoundPage() {
    return xt;
  },
  removeSlugResolver: Ta,
  resolveSlugPath: Ft,
  get searchIndex() {
    return et;
  },
  setContentBase: un,
  setDefaultCrawlMaxQueue: qa,
  setFetchMarkdown: Oa,
  setHomePage: Ma,
  setLanguages: Jr,
  setNotFoundPage: On,
  setSkipRootReadme: va,
  get skipRootReadme() {
    return Zn;
  },
  slugResolvers: gn,
  slugToMd: ne,
  slugify: ye,
  unescapeMarkdown: rn,
  uniqueSlug: ri
}, Symbol.toStringTag, { value: "Module" }));
let hi = 100;
function Ar(e) {
  hi = e;
}
let $t = 300 * 1e3;
function Er(e) {
  $t = e;
}
const We = /* @__PURE__ */ new Map();
function Da(e) {
  if (!We.has(e)) return;
  const t = We.get(e), n = Date.now();
  if (t.ts + $t < n) {
    We.delete(e);
    return;
  }
  return We.delete(e), We.set(e, t), t.value;
}
function Ua(e, t) {
  if (Lr(), Lr(), We.delete(e), We.set(e, { value: t, ts: Date.now() }), We.size > hi) {
    const n = We.keys().next().value;
    n !== void 0 && We.delete(n);
  }
}
function Lr() {
  if (!$t || $t <= 0) return;
  const e = Date.now();
  for (const [t, n] of We.entries())
    n.ts + $t < e && We.delete(t);
}
async function Ha(e, t) {
  const n = new Set(Xe), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        const s = new URL(a, location.href);
        if (s.origin !== location.origin) continue;
        const c = (s.hash || s.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (s.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (c) {
          let p = ce(c[1]);
          p && n.add(p);
          continue;
        }
        const o = (r.textContent || "").trim(), l = (s.pathname || "").replace(/^.*\//, "");
        if (o && ye(o) === e || l && ye(l.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let p = s.pathname.replace(/^\//, "");
          n.add(p);
          continue;
        }
        const u = s.pathname || "";
        if (u) {
          const p = new URL(t), m = ft(p.pathname);
          if (u.indexOf(m) !== -1) {
            let d = u.startsWith(m) ? u.slice(m.length) : u;
            d = ce(d), d && n.add(d);
          }
        }
      } catch (s) {
        console.warn("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Me(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const c = (s[1] || "").trim();
        if (c && ye(c) === e)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function ja(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (ne.has(n)) {
        const i = Ft(n) || ne.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (Xe && Xe.size)
          for (const i of Xe) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ye(r) === n && !/index\.html$/i.test(i)) {
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
async function Wa(e, t) {
  const n = e || "";
  let i = null;
  try {
    if (location.hash) {
      const h = decodeURIComponent(location.hash.replace(/^#/, ""));
      h && !String(h).startsWith("/") && (i = h);
    }
  } catch {
  }
  let r = e || "", a = null;
  if (r && String(r).includes("::")) {
    const h = String(r).split("::", 2);
    r = h[0], a = h[1] || null;
  }
  const c = `${e}|||${typeof wa < "u" && st ? st : ""}`, o = Da(c);
  if (o)
    r = o.resolved, a = o.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let h = decodeURIComponent(String(r || ""));
      if (h && typeof h == "string" && (h = ce(h), h = jt(h)), ne.has(h))
        r = Ft(h) || ne.get(h);
      else {
        let f = await Ha(h, t);
        if (f)
          r = f;
        else if (Fn._refreshed && Xe && Xe.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const g = await ui(h, t);
          g && (r = g);
        }
      }
    }
    Ua(c, { resolved: r, anchor: a });
  }
  !a && i && (a = i);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const h = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const f = await fetch(h);
        if (f && f.ok) {
          const g = await f.text(), b = f && f.headers && typeof f.headers.get == "function" && f.headers.get("content-type") || "", y = (g || "").toLowerCase();
          if (b && b.indexOf && b.indexOf("text/html") !== -1 || y.indexOf("<!doctype") !== -1 || y.indexOf("<html") !== -1)
            return { data: { raw: g, isHtml: !0 }, pagePath: h.replace(/^\//, ""), anchor: a };
        }
      } catch {
      }
    }
  } catch {
  }
  const l = ja(r), u = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (u && l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && l.push(r), l.length === 1 && /index\.html$/i.test(l[0]) && !u && !ne.has(r) && !ne.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let p = null, m = null, d = null;
  for (const h of l)
    if (h)
      try {
        const f = ce(h);
        p = await Me(f, t), m = f;
        break;
      } catch (f) {
        d = f;
        try {
          console.warn("[router] candidate fetch failed", { candidate: h, contentBase: t, err: f && f.message || f });
        } catch {
        }
      }
  if (!p) {
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: l, contentBase: t, fetchError: d && (d.message || String(d)) || null });
    } catch {
    }
    try {
      if (u && String(n || "").toLowerCase().includes(".html"))
        try {
          const h = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", h);
          const f = await fetch(h);
          if (f && f.ok) {
            const g = await f.text(), b = f && f.headers && typeof f.headers.get == "function" && f.headers.get("content-type") || "", y = (g || "").toLowerCase(), k = b && b.indexOf && b.indexOf("text/html") !== -1 || y.indexOf("<!doctype") !== -1 || y.indexOf("<html") !== -1;
            if (k || console.warn("[router] absolute fetch returned non-HTML", { abs: h, contentType: b, snippet: y.slice(0, 200) }), k) {
              const S = (g || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(g) || /<h1>\s*index of\b/i.test(g) || S.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(g) || /<h1>\s*directory listing/i.test(g))
                try {
                  console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: h });
                } catch {
                }
              else
                try {
                  const H = h, K = new URL(".", H).toString();
                  try {
                    const ee = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (ee) {
                      const ue = ee.parseFromString(g || "", "text/html"), T = (G, C) => {
                        try {
                          const V = C.getAttribute(G) || "";
                          if (!V || /^(https?:)?\/\//i.test(V) || V.startsWith("/") || V.startsWith("#")) return;
                          try {
                            const X = new URL(V, H).toString();
                            C.setAttribute(G, X);
                          } catch (X) {
                            console.warn("[router] rewrite attribute failed", G, X);
                          }
                        } catch (V) {
                          console.warn("[router] rewrite helper failed", V);
                        }
                      }, Q = ue.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), _e = [];
                      for (const G of Array.from(Q || []))
                        try {
                          const C = G.tagName ? G.tagName.toLowerCase() : "";
                          if (C === "a") continue;
                          if (G.hasAttribute("src")) {
                            const V = G.getAttribute("src");
                            T("src", G);
                            const X = G.getAttribute("src");
                            V !== X && _e.push({ attr: "src", tag: C, before: V, after: X });
                          }
                          if (G.hasAttribute("href") && C === "link") {
                            const V = G.getAttribute("href");
                            T("href", G);
                            const X = G.getAttribute("href");
                            V !== X && _e.push({ attr: "href", tag: C, before: V, after: X });
                          }
                          if (G.hasAttribute("href") && C !== "link") {
                            const V = G.getAttribute("href");
                            T("href", G);
                            const X = G.getAttribute("href");
                            V !== X && _e.push({ attr: "href", tag: C, before: V, after: X });
                          }
                          if (G.hasAttribute("xlink:href")) {
                            const V = G.getAttribute("xlink:href");
                            T("xlink:href", G);
                            const X = G.getAttribute("xlink:href");
                            V !== X && _e.push({ attr: "xlink:href", tag: C, before: V, after: X });
                          }
                          if (G.hasAttribute("poster")) {
                            const V = G.getAttribute("poster");
                            T("poster", G);
                            const X = G.getAttribute("poster");
                            V !== X && _e.push({ attr: "poster", tag: C, before: V, after: X });
                          }
                          if (G.hasAttribute("srcset")) {
                            const ge = (G.getAttribute("srcset") || "").split(",").map((L) => L.trim()).filter(Boolean).map((L) => {
                              const [R, P] = L.split(/\s+/, 2);
                              if (!R || /^(https?:)?\/\//i.test(R) || R.startsWith("/")) return L;
                              try {
                                const x = new URL(R, H).toString();
                                return P ? `${x} ${P}` : x;
                              } catch {
                                return L;
                              }
                            }).join(", ");
                            G.setAttribute("srcset", ge);
                          }
                        } catch {
                        }
                      const re = ue.documentElement && ue.documentElement.outerHTML ? ue.documentElement.outerHTML : g;
                      try {
                        _e && _e.length && console.warn("[router] rewritten asset refs", { abs: h, rewritten: _e });
                      } catch {
                      }
                      return { data: { raw: re, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let q = g;
                  return /<base\s+[^>]*>/i.test(g) || (/<head[^>]*>/i.test(g) ? q = g.replace(/(<head[^>]*>)/i, `$1<base href="${K}">`) : q = `<base href="${K}">` + g), { data: { raw: q, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: g, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
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
        const f = [
          `/assets/${h}.html`,
          `/assets/${h}/index.html`
        ];
        for (const g of f)
          try {
            const b = await fetch(g, { method: "GET" });
            if (b && b.ok)
              return { data: { raw: await b.text(), isHtml: !0 }, pagePath: g.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (h) {
      console.warn("[router] assets fallback failed", h);
    }
    throw new Error("no page data");
  }
  return { data: p, pagePath: m, anchor: a };
}
function mn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ot = mn();
function di(e) {
  ot = e;
}
var dt = { exec: () => null };
function pe(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Be.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Fa = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Be = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Za = /^(?:[ \t]*(?:\n|$))+/, Ga = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Qa = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Gt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ka = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, pi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, fi = pe(pi).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Xa = pe(pi).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Qn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ya = /^[^\n]+/, Kn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Va = pe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Kn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ja = pe(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Gn).getRegex(), bn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Xn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, es = pe("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Xn).replace("tag", bn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), gi = pe(Qn).replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex(), ts = pe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", gi).getRegex(), Yn = { blockquote: ts, code: Ga, def: Va, fences: Qa, heading: Ka, hr: Gt, html: es, lheading: fi, list: Ja, newline: Za, paragraph: gi, table: dt, text: Ya }, Rr = pe("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex(), ns = { ...Yn, lheading: Xa, table: Rr, paragraph: pe(Qn).replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Rr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex() }, rs = { ...Yn, html: pe(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Xn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: dt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: pe(Qn).replace("hr", Gt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", fi).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, is = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, as = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, mi = /^( {2,}|\\)\n(?!\s*$)/, ss = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, wn = /[\p{P}\p{S}]/u, Vn = /[\s\p{P}\p{S}]/u, bi = /[^\s\p{P}\p{S}]/u, os = pe(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vn).getRegex(), wi = /(?!~)[\p{P}\p{S}]/u, ls = /(?!~)[\s\p{P}\p{S}]/u, cs = /(?:[^\s\p{P}\p{S}]|~)/u, yi = /(?![*_])[\p{P}\p{S}]/u, us = /(?![*_])[\s\p{P}\p{S}]/u, hs = /(?:[^\s\p{P}\p{S}]|[*_])/u, ds = pe(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Fa ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ki = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ps = pe(ki, "u").replace(/punct/g, wn).getRegex(), fs = pe(ki, "u").replace(/punct/g, wi).getRegex(), _i = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", gs = pe(_i, "gu").replace(/notPunctSpace/g, bi).replace(/punctSpace/g, Vn).replace(/punct/g, wn).getRegex(), ms = pe(_i, "gu").replace(/notPunctSpace/g, cs).replace(/punctSpace/g, ls).replace(/punct/g, wi).getRegex(), bs = pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, bi).replace(/punctSpace/g, Vn).replace(/punct/g, wn).getRegex(), ws = pe(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, yi).getRegex(), ys = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ks = pe(ys, "gu").replace(/notPunctSpace/g, hs).replace(/punctSpace/g, us).replace(/punct/g, yi).getRegex(), _s = pe(/\\(punct)/, "gu").replace(/punct/g, wn).getRegex(), xs = pe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ss = pe(Xn).replace("(?:-->|$)", "-->").getRegex(), vs = pe("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ss).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), hn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, As = pe(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", hn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), xi = pe(/^!?\[(label)\]\[(ref)\]/).replace("label", hn).replace("ref", Kn).getRegex(), Si = pe(/^!?\[(ref)\](?:\[\])?/).replace("ref", Kn).getRegex(), Es = pe("reflink|nolink(?!\\()", "g").replace("reflink", xi).replace("nolink", Si).getRegex(), Cr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Jn = { _backpedal: dt, anyPunctuation: _s, autolink: xs, blockSkip: ds, br: mi, code: as, del: dt, delLDelim: dt, delRDelim: dt, emStrongLDelim: ps, emStrongRDelimAst: gs, emStrongRDelimUnd: bs, escape: is, link: As, nolink: Si, punctuation: os, reflink: xi, reflinkSearch: Es, tag: vs, text: ss, url: dt }, Ls = { ...Jn, link: pe(/^!?\[(label)\]\((.*?)\)/).replace("label", hn).getRegex(), reflink: pe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", hn).getRegex() }, Bn = { ...Jn, emStrongRDelimAst: ms, emStrongLDelim: fs, delLDelim: ws, delRDelim: ks, url: pe(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Cr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: pe(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Cr).getRegex() }, Rs = { ...Bn, br: pe(mi).replace("{2,}", "*").getRegex(), text: pe(Bn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, nn = { normal: Yn, gfm: ns, pedantic: rs }, Et = { normal: Jn, gfm: Bn, breaks: Rs, pedantic: Ls }, Cs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Tr = (e) => Cs[e];
function Qe(e, t) {
  if (t) {
    if (Be.escapeTest.test(e)) return e.replace(Be.escapeReplace, Tr);
  } else if (Be.escapeTestNoEncode.test(e)) return e.replace(Be.escapeReplaceNoEncode, Tr);
  return e;
}
function Mr(e) {
  try {
    e = encodeURI(e).replace(Be.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Pr(e, t) {
  let n = e.replace(Be.findPipe, (a, s, c) => {
    let o = !1, l = s;
    for (; --l >= 0 && c[l] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Be.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Be.slashPipe, "|");
  return i;
}
function Lt(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function Ts(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Ms(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function $r(e, t, n, i, r) {
  let a = t.href, s = t.title || null, c = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: c, tokens: i.inlineTokens(c) };
  return i.state.inLink = !1, o;
}
function Ps(e, t, n) {
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
var Ut = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || ot;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Lt(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = Ps(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = Lt(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Lt(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = Lt(t[0], `
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
          let d = m, h = d.raw + `
` + n.join(`
`), f = this.blockquote(h);
          a[a.length - 1] = f, i = i.substring(0, i.length - d.raw.length) + f.raw, r = r.substring(0, r.length - d.text.length) + f.text;
          break;
        } else if (m?.type === "list") {
          let d = m, h = d.raw + `
` + n.join(`
`), f = this.list(h);
          a[a.length - 1] = f, i = i.substring(0, i.length - m.raw.length) + f.raw, r = r.substring(0, r.length - d.raw.length) + f.raw, n = h.substring(a.at(-1).raw.length).split(`
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
        let p = Ms(t[2].split(`
`, 1)[0], t[1].length), m = e.split(`
`, 1)[0], d = !p.trim(), h = 0;
        if (this.options.pedantic ? (h = 2, u = p.trimStart()) : d ? h = t[1].length + 1 : (h = p.search(this.rules.other.nonSpaceChar), h = h > 4 ? 1 : h, u = p.slice(h), h += t[1].length), d && this.rules.other.blankLine.test(m) && (l += m + `
`, e = e.substring(m.length + 1), o = !0), !o) {
          let f = this.rules.other.nextBulletRegex(h), g = this.rules.other.hrRegex(h), b = this.rules.other.fencesBeginRegex(h), y = this.rules.other.headingBeginRegex(h), k = this.rules.other.htmlBeginRegex(h), S = this.rules.other.blockquoteBeginRegex(h);
          for (; e; ) {
            let $ = e.split(`
`, 1)[0], H;
            if (m = $, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), H = m) : H = m.replace(this.rules.other.tabCharGlobal, "    "), b.test(m) || y.test(m) || k.test(m) || S.test(m) || f.test(m) || g.test(m)) break;
            if (H.search(this.rules.other.nonSpaceChar) >= h || !m.trim()) u += `
` + H.slice(h);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(p) || y.test(p) || g.test(p)) break;
              u += `
` + m;
            }
            d = !m.trim(), l += $ + `
`, e = e.substring($.length + 1), p = H.slice(h);
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
    let n = Pr(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Pr(s, a.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[o] })));
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
        let a = Lt(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = Ts(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), $r(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return $r(n, r, n[0], this.lexer, this.rules);
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
}, He = class qn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || ot, this.options.tokenizer = this.options.tokenizer || new Ut(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Be, block: nn.normal, inline: Et.normal };
    this.options.pedantic ? (n.block = nn.pedantic, n.inline = Et.pedantic) : this.options.gfm && (n.block = nn.gfm, this.options.breaks ? n.inline = Et.breaks : n.inline = Et.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: nn, inline: Et };
  }
  static lex(t, n) {
    return new qn(n).lex(t);
  }
  static lexInline(t, n) {
    return new qn(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Be.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Be.tabCharGlobal, "    ").replace(Be.spaceLine, "")); t; ) {
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
}, Ht = class {
  options;
  parser;
  constructor(e) {
    this.options = e || ot;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(Be.notSpaceStart)?.[0], r = e.replace(Be.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Qe(i) + '">' + (n ? r : Qe(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Qe(r, !0)) + `</code></pre>
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
    return `<code>${Qe(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Mr(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + Qe(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Mr(e);
    if (r === null) return Qe(n);
    e = r;
    let a = `<img src="${e}" alt="${Qe(n)}"`;
    return t && (a += ` title="${Qe(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Qe(e.text);
  }
}, yn = class {
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
}, je = class Dn {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || ot, this.options.renderer = this.options.renderer || new Ht(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new yn();
  }
  static parse(t, n) {
    return new Dn(n).parse(t);
  }
  static parseInline(t, n) {
    return new Dn(n).parseInline(t);
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
}, yt = class {
  options;
  block;
  constructor(e) {
    this.options = e || ot;
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
    return this.block ? He.lex : He.lexInline;
  }
  provideParser() {
    return this.block ? je.parse : je.parseInline;
  }
}, vi = class {
  defaults = mn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = je;
  Renderer = Ht;
  TextRenderer = yn;
  Lexer = He;
  Tokenizer = Ut;
  Hooks = yt;
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
        let r = this.defaults.renderer || new Ht(this.defaults);
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
        let r = this.defaults.tokenizer || new Ut(this.defaults);
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
        let r = this.defaults.hooks || new yt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, c = n.hooks[s], o = r[s];
          yt.passThroughHooks.has(a) ? r[s] = (l) => {
            if (this.defaults.async && yt.passThroughHooksRespectAsync.has(a)) return (async () => {
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
    return He.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return je.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, c = await (r.hooks ? await r.hooks.provideLexer() : e ? He.lex : He.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let l = await (r.hooks ? await r.hooks.provideParser() : e ? je.parse : je.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(l) : l;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? He.lex : He.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : e ? je.parse : je.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + Qe(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, gt = new vi();
function oe(e, t) {
  return gt.parse(e, t);
}
oe.options = oe.setOptions = function(e) {
  return gt.setOptions(e), oe.defaults = gt.defaults, di(oe.defaults), oe;
};
oe.getDefaults = mn;
oe.defaults = ot;
oe.use = function(...e) {
  return gt.use(...e), oe.defaults = gt.defaults, di(oe.defaults), oe;
};
oe.walkTokens = function(e, t) {
  return gt.walkTokens(e, t);
};
oe.parseInline = gt.parseInline;
oe.Parser = je;
oe.parser = je.parse;
oe.Renderer = Ht;
oe.TextRenderer = yn;
oe.Lexer = He;
oe.lexer = He.lex;
oe.Tokenizer = Ut;
oe.Hooks = yt;
oe.parse = oe;
var $s = oe.options, zs = oe.setOptions, Is = oe.use, Ns = oe.walkTokens, Os = oe.parseInline, Bs = oe, qs = je.parse, Ds = He.lex;
const zr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: yt,
  Lexer: He,
  Marked: vi,
  Parser: je,
  Renderer: Ht,
  TextRenderer: yn,
  Tokenizer: Ut,
  get defaults() {
    return ot;
  },
  getDefaults: mn,
  lexer: Ds,
  marked: oe,
  options: $s,
  parse: Bs,
  parseInline: Os,
  parser: qs,
  setOptions: zs,
  use: Is,
  walkTokens: Ns
}, Symbol.toStringTag, { value: "Module" })), Ai = `function O() {
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
`, Ir = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Ai], { type: "text/javascript;charset=utf-8" });
function Us(e) {
  let t;
  try {
    if (t = Ir && (self.URL || self.webkitURL).createObjectURL(Ir), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Ai),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function dn(e) {
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
function Ei(e) {
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
const zt = zr && (oe || zr) || void 0;
let Ie = null;
const Hs = "https://cdn.jsdelivr.net/npm/highlight.js";
async function pn() {
  if (Ie) return Ie;
  try {
    try {
      const e = await import(Hs + "/lib/core.js");
      Ie = e.default || e;
    } catch {
      Ie = null;
    }
  } catch {
    Ie = null;
  }
  return Ie;
}
zt && typeof zt.setOptions == "function" && zt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Ie && t && typeof Ie.getLanguage == "function" && Ie.getLanguage(t) ? Ie.highlight(e, { language: t }).value : Ie && typeof Ie.getLanguage == "function" && Ie.getLanguage("plaintext") ? Ie.highlight(e, { language: "plaintext" }).value : e;
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
        if (!await pn()) {
          postMessage({ type: "register-error", name: u, error: "hljs unavailable" });
          return;
        }
        const d = await import(p), h = d.default || d;
        Ie.registerLanguage(u, h), postMessage({ type: "registered", name: u });
      } catch (m) {
        postMessage({ type: "register-error", name: u, error: String(m) });
      }
      return;
    }
    if (t.type === "detect") {
      const u = t.md || "", p = t.supported || [], m = /* @__PURE__ */ new Set(), d = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let h;
      for (; h = d.exec(u); )
        if (h[1]) {
          const f = String(h[1]).toLowerCase();
          if (!f) continue;
          if (f.length >= 5 && f.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(f) && m.add(f), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(f) && m.add(f), p && p.length)
            try {
              p.indexOf(f) !== -1 && m.add(f);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(m) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = dn(i || "");
    await pn().catch(() => {
    });
    let s = zt.parse(r);
    const c = [], o = /* @__PURE__ */ new Map(), l = (u) => {
      try {
        return String(u || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, p, m, d) => {
      const h = Number(p);
      let f = d.replace(/<[^>]+>/g, "").trim();
      try {
        f = Ei(f);
      } catch {
      }
      let g = null;
      const b = (m || "").match(/\sid="([^"]+)"/);
      b && (g = b[1]);
      const y = g || l(f) || "heading", S = (o.get(y) || 0) + 1;
      o.set(y, S);
      const $ = S === 1 ? y : y + "-" + S;
      c.push({ level: h, text: f, id: $ });
      const H = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, K = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", q = (H[h] + " " + K).trim(), ue = ((m || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${$}" class="${q}"`).trim();
      return `<h${h} ${ue}>${d}</h${h}>`;
    }), s = s.replace(/<img([^>]*)>/g, (u, p) => /\bloading=/.test(p) ? `<img${p}>` : /\bdata-want-lazy=/.test(p) ? `<img${p}>` : `<img${p} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: c } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function js(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: l } = e;
      try {
        if (!await pn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const p = await import(l), m = p.default || p;
        return Ie.registerLanguage(o, m), { type: "registered", name: o };
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
    const t = e && e.id, { content: n, data: i } = dn(e && e.md || "");
    await pn().catch(() => {
    });
    let r = zt.parse(n);
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
        d = Ei(d);
      } catch {
      }
      let h = null;
      const f = (u || "").match(/\sid="([^"]+)"/);
      f && (h = f[1]);
      const g = h || c(d) || "heading", y = (s.get(g) || 0) + 1;
      s.set(g, y);
      const k = y === 1 ? g : g + "-" + y;
      a.push({ level: m, text: d, id: k });
      const S = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, $ = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", H = (S[m] + " " + $).trim(), q = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${k}" class="${H}"`).trim();
      return `<h${m} ${q}>${p}</h${m}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, l) => /\bloading=/.test(l) ? `<img${l}>` : /\bdata-want-lazy=/.test(l) ? `<img${l}>` : `<img${l} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Cn = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, Ws = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Fs() {
  if (typeof Worker < "u")
    try {
      return new Us();
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
          const r = { data: await js(n) }(e.message || []).forEach((a) => a(r));
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
const Li = Yr(() => Fs(), "markdown", Ws), Nr = typeof DOMParser < "u" ? new DOMParser() : null, pt = () => Li.get(), er = (e) => Li.send(e, 3e3), Ye = [];
function Un(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    Ye.push(e);
    try {
      oe.use(e);
    } catch (t) {
      console.warn("[markdown] failed to apply plugin", t);
    }
  }
}
function Zs(e) {
  Ye.length = 0, Array.isArray(e) && Ye.push(...e.filter((t) => t && typeof t == "object"));
  try {
    Ye.forEach((t) => oe.use(t));
  } catch (t) {
    console.warn("[markdown] failed to apply markdown extensions", t);
  }
}
async function fn(e) {
  if (Ye && Ye.length) {
    let { content: i, data: r } = dn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, c) => Cn[c] || s);
    } catch {
    }
    oe.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      Ye.forEach((s) => oe.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = oe.parse(i);
    try {
      const s = Nr || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const c = s.parseFromString(a, "text/html"), o = c.querySelectorAll("h1,h2,h3,h4,h5,h6"), l = [], u = /* @__PURE__ */ new Set(), p = (d) => {
          try {
            return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, m = (d) => {
          const h = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, f = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (h[d] + " " + f).trim();
        };
        o.forEach((d) => {
          try {
            const h = Number(d.tagName.substring(1)), f = (d.textContent || "").trim();
            let g = p(f) || "heading", b = g, y = 2;
            for (; u.has(b); )
              b = g + "-" + y, y += 1;
            u.add(b), d.id = b, d.className = m(h), l.push({ level: h, text: f, id: b });
          } catch {
          }
        });
        try {
          c.querySelectorAll("img").forEach((d) => {
            try {
              const h = d.getAttribute && d.getAttribute("loading"), f = d.getAttribute && d.getAttribute("data-want-lazy");
              !h && !f && d.setAttribute && d.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          c.querySelectorAll("pre code, code[class]").forEach((d) => {
            try {
              const h = d.getAttribute && d.getAttribute("class") || d.className || "", f = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (f)
                try {
                  d.setAttribute && d.setAttribute("class", f);
                } catch {
                  d.className = f;
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
      const i = await Promise.resolve().then(() => Ri);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = pt && pt();
    }
  else
    t = pt && pt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => Cn[r] || i);
  } catch {
  }
  try {
    if (typeof fe < "u" && fe && typeof fe.getLanguage == "function" && fe.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = dn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (l, u) => Cn[u] || l);
      } catch {
      }
      oe.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (l, u) => {
        try {
          return u && fe.getLanguage && fe.getLanguage(u) ? fe.highlight(l, { language: u }).value : fe && typeof fe.getLanguage == "function" && fe.getLanguage("plaintext") ? fe.highlight(l, { language: "plaintext" }).value : l;
        } catch {
          return l;
        }
      } });
      let a = oe.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (l, u) => {
          try {
            if (u && fe && typeof fe.highlight == "function")
              try {
                const p = fe.highlight(u, { language: "plaintext" });
                return `<pre><code>${p && p.value ? p.value : p}</code></pre>`;
              } catch {
                try {
                  if (fe && typeof fe.highlightElement == "function") {
                    const m = { innerHTML: u };
                    return fe.highlightElement(m), `<pre><code>${m.innerHTML}</code></pre>`;
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
        const d = Number(u), h = m.replace(/<[^>]+>/g, "").trim();
        let f = o(h) || "heading", g = f, b = 2;
        for (; c.has(g); )
          g = f + "-" + b, b += 1;
        c.add(g), s.push({ level: d, text: h, id: g });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, k = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", S = (y[d] + " " + k).trim(), H = ((p || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${g}" class="${S}"`).trim();
        return `<h${d} ${H}>${m}</h${d}>`;
      }), a = a.replace(/<img([^>]*)>/g, (l, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await er({ type: "render", md: e });
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
      const m = Number(l), d = p.replace(/<[^>]+>/g, "").trim(), h = (u || "").match(/\sid="([^"]+)"/), f = h ? h[1] : a(d) || "heading", b = (i.get(f) || 0) + 1;
      i.set(f, b);
      const y = b === 1 ? f : f + "-" + b;
      r.push({ level: m, text: d, id: y });
      const k = s(m), $ = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${k}"`).trim();
      return `<h${m} ${$}>${p}</h${m}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const l = Nr || (typeof DOMParser < "u" ? new DOMParser() : null);
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
function It(e, t) {
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
      if (Fr.has(c) || t && t.size && c.length < 3 && !t.has(c) && !(De && De[c] && t.has(De[c]))) continue;
      if (t && t.size) {
        if (t.has(c)) {
          const l = t.get(c);
          l && n.add(l);
          continue;
        }
        if (De && De[c]) {
          const l = De[c];
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
async function Hn(e, t) {
  if (Ye && Ye.length || typeof process < "u" && process.env && process.env.VITEST) return It(e || "", t);
  if (pt && pt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await er({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return It(e || "", t);
}
const Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: er,
  addMarkdownExtension: Un,
  detectFenceLanguages: It,
  detectFenceLanguagesAsync: Hn,
  initRendererWorker: pt,
  markdownPlugins: Ye,
  parseMarkdownToHtml: fn,
  setMarkdownExtensions: Zs
}, Symbol.toStringTag, { value: "Module" })), Gs = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
        await _rewriteAnchors(article, contentBase, pagePath)
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
        await _rewriteAnchors(article, contentBase, pagePath)
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
        await tr(o, r, a), postMessage({ id: n, result: c.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Qs(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), c = s.body;
        return await tr(c, i, r), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Ks = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function Xs(...e) {
  try {
    Ks && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Ys(e, t) {
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
function Vs(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  return r.className = "menu-list", t.forEach((a) => {
    const s = document.createElement("li"), c = document.createElement("a");
    try {
      const l = String(a.path || "").replace(/^[\.\/]+/, "");
      let u = null;
      try {
        if (E && E.has && E.has(l)) u = E.get(l);
        else {
          const p = String(l || "").replace(/^.*\//, "");
          if (p && E && E.has && E.has(p)) u = E.get(p);
          else
            try {
              for (const [m, d] of ne || [])
                if (d === l || d === p) {
                  u = m;
                  break;
                }
            } catch {
            }
        }
      } catch {
      }
      u ? c.href = "#/" + de(String(u)) : c.href = "#" + de(String(a.path || ""));
    } catch {
      c.href = "#" + de(String(a.path || ""));
    }
    if (c.textContent = a.name, s.appendChild(c), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((l) => {
        const u = document.createElement("li"), p = document.createElement("a");
        try {
          const d = String(l.path || "").replace(/^[\.\/]+/, "");
          let h = null;
          try {
            if (E && E.has && E.has(d)) h = E.get(d);
            else {
              const f = String(d || "").replace(/^.*\//, "");
              if (f && E && E.has && E.has(f)) h = E.get(f);
              else
                try {
                  for (const [g, b] of ne || [])
                    if (b === d || b === f) {
                      h = g;
                      break;
                    }
                } catch {
                }
            }
          } catch {
          }
          h ? p.href = "#/" + de(String(h)) : p.href = "#" + de(String(l.path || ""));
        } catch {
          p.href = "#" + de(String(l.path || ""));
        }
        p.textContent = l.name, u.appendChild(p), o.appendChild(u);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function Js(e, t, n = "") {
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
        const l = Number(o.level) >= 2 ? Number(o.level) : 2, u = document.createElement("li"), p = document.createElement("a"), m = Sa(o.text || ""), d = o.id || ye(m);
        p.textContent = m;
        try {
          const b = String(n || "").replace(/^[\.\/]+/, "");
          let y = null;
          if (b)
            try {
              if (E && E.has && E.has(b)) y = E.get(b);
              else {
                const k = String(b).replace(/^.*\//, "");
                if (k && E && E.has && E.has(k)) y = E.get(k);
                else
                  try {
                    for (const [S, $] of ne || [])
                      if ($ === b || $ === k) {
                        y = S;
                        break;
                      }
                  } catch {
                  }
              }
            } catch (k) {
              console.warn("[htmlBuilder] buildTocElement mdToSlug lookup failed", k);
            }
          if (y)
            try {
              const k = typeof location < "u" && location.search ? new URLSearchParams(location.search) : null;
              k && k.delete("page");
              const S = k ? k.toString() : "", $ = S ? "?" + S : "";
              p.href = "#/" + de(y) + (d ? "#" + encodeURIComponent(d) : "") + $;
            } catch {
              p.href = Te(y, d);
            }
          else p.href = `#${encodeURIComponent(d)}`;
        } catch (b) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", b), p.href = `#${de(d)}`;
        }
        if (u.appendChild(p), l === 2) {
          a.appendChild(u), c[2] = u, Object.keys(c).forEach((b) => {
            Number(b) > 2 && delete c[b];
          });
          return;
        }
        let h = l - 1;
        for (; h > 2 && !c[h]; ) h--;
        h < 2 && (h = 2);
        let f = c[h];
        if (!f) {
          a.appendChild(u), c[l] = u;
          return;
        }
        let g = f.querySelector("ul");
        g || (g = document.createElement("ul"), f.appendChild(g)), g.appendChild(u), c[l] = u;
      } catch (l) {
        console.warn("[htmlBuilder] buildTocElement item failed", l, o);
      }
    });
  } catch (c) {
    console.warn("[htmlBuilder] buildTocElement failed", c);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Ci(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ye(n.textContent || ""));
  });
}
function eo(e, t, n) {
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
function Or(e, t, n) {
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
            const [d, h] = m.split(/\s+/, 2);
            if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/")) return m;
            try {
              const f = new URL(d, r).toString();
              return h ? `${f} ${h}` : f;
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
let Br = "", Tn = null, qr = "";
async function tr(e, t, n) {
  try {
    const i = e.querySelectorAll("a");
    if (!i || !i.length) return;
    let r, a;
    if (t === Br && Tn)
      r = Tn, a = qr;
    else {
      try {
        r = new URL(t, location.href), a = ft(r.pathname);
      } catch {
        try {
          r = new URL(t, location.href), a = ft(r.pathname);
        } catch {
          r = null, a = "/";
        }
      }
      Br = t, Tn = r, qr = a;
    }
    const s = /* @__PURE__ */ new Set(), c = [], o = /* @__PURE__ */ new Set(), l = [];
    for (const u of Array.from(i))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const p = u.getAttribute("href") || "";
        if (!p || Vr(p)) continue;
        try {
          if (p.startsWith("?") || p.indexOf("?") !== -1)
            try {
              const d = new URL(p, t || location.href), h = d.searchParams.get("page");
              if (h && h.indexOf("/") === -1 && n) {
                const f = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (f) {
                  const g = ce(f + h);
                  u.setAttribute("href", Te(g, d.hash ? d.hash.replace(/^#/, "") : null));
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (p.startsWith("/") && !p.endsWith(".md")) continue;
        const m = p.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (m) {
          let d = m[1];
          const h = m[2];
          !d.startsWith("/") && n && (d = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + d);
          try {
            const f = new URL(d, t).pathname;
            let g = f.startsWith(a) ? f.slice(a.length) : f;
            g = ce(g), c.push({ node: u, mdPathRaw: d, frag: h, rel: g }), E.has(g) || s.add(g);
          } catch (f) {
            console.warn("[htmlBuilder] resolve mdPath failed", f);
          }
          continue;
        }
        try {
          let d = p;
          !p.startsWith("/") && n && (p.startsWith("#") ? d = n + p : d = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          const f = new URL(d, t).pathname || "";
          if (f && f.indexOf(a) !== -1) {
            let g = f.startsWith(a) ? f.slice(a.length) : f;
            if (g = ce(g), g = jt(g), g || (g = "_home"), !g.endsWith(".md")) {
              let b = null;
              try {
                if (E && E.has && E.has(g))
                  b = E.get(g);
                else
                  try {
                    const y = String(g || "").replace(/^.*\//, "");
                    y && E.has && E.has(y) && (b = E.get(y));
                  } catch (y) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", y);
                  }
              } catch (y) {
                console.warn("[htmlBuilder] mdToSlug access check failed", y);
              }
              if (!b)
                try {
                  const y = String(g || "").replace(/^.*\//, "");
                  for (const [k, S] of ne || [])
                    if (S === g || S === y) {
                      b = k;
                      break;
                    }
                } catch {
                }
              b ? u.setAttribute("href", Te(b)) : (o.add(g), l.push({ node: u, rel: g }));
            }
          }
        } catch (d) {
          console.warn("[htmlBuilder] resolving href to URL failed", d);
        }
      } catch (p) {
        console.warn("[htmlBuilder] processing anchor failed", p);
      }
    s.size && await Promise.all(Array.from(s).map(async (u) => {
      try {
        try {
          const m = String(u).match(/([^\/]+)\.md$/), d = m && m[1];
          if (d && ne.has(d)) {
            try {
              const h = ne.get(d);
              if (h)
                try {
                  E.set(h, d);
                } catch (f) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", f);
                }
            } catch (h) {
              console.warn("[htmlBuilder] reading slugToMd failed", h);
            }
            return;
          }
        } catch (m) {
          console.warn("[htmlBuilder] basename slug lookup failed", m);
        }
        const p = await Me(u, t);
        if (p && p.raw) {
          const m = (p.raw || "").match(/^#\s+(.+)$/m);
          if (m && m[1]) {
            const d = ye(m[1].trim());
            if (d)
              try {
                ne.set(d, u), E.set(u, d);
              } catch (h) {
                console.warn("[htmlBuilder] setting slug mapping failed", h);
              }
          }
        }
      } catch (p) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", p);
      }
    })), o.size && await Promise.all(Array.from(o).map(async (u) => {
      try {
        const p = await Me(u, t);
        if (p && p.raw)
          try {
            const d = (nr || new DOMParser()).parseFromString(p.raw, "text/html"), h = d.querySelector("title"), f = d.querySelector("h1"), g = h && h.textContent && h.textContent.trim() ? h.textContent.trim() : f && f.textContent ? f.textContent.trim() : null;
            if (g) {
              const b = ye(g);
              if (b)
                try {
                  ne.set(b, u), E.set(u, b);
                } catch (y) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", y);
                }
            }
          } catch (m) {
            console.warn("[htmlBuilder] parse fetched HTML failed", m);
          }
      } catch (p) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", p);
      }
    }));
    for (const u of c) {
      const { node: p, frag: m, rel: d } = u;
      let h = null;
      try {
        E.has(d) && (h = E.get(d));
      } catch (f) {
        console.warn("[htmlBuilder] mdToSlug access failed", f);
      }
      h ? p.setAttribute("href", Te(h, m)) : p.setAttribute("href", Te(d, m));
    }
    for (const u of l) {
      const { node: p, rel: m } = u;
      let d = null;
      try {
        E.has(m) && (d = E.get(m));
      } catch (h) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", h);
      }
      if (!d)
        try {
          const h = String(m || "").replace(/^.*\//, "");
          E.has(h) && (d = E.get(h));
        } catch (h) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", h);
        }
      d ? p.setAttribute("href", Te(d)) : p.setAttribute("href", Te(m));
    }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function to(e, t, n, i) {
  const r = t.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    if (n && typeof n == "string" && n.indexOf(".") === -1 && n.indexOf("/") === -1)
      try {
        s = ce(String(n));
      } catch {
        s = String(n);
      }
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
    !c && n && (c = String(n)), !s && c && (s = ye(c)), s || (s = "_home");
    try {
      const o = String(s || ""), l = o.indexOf("#/");
      l !== -1 && (s = o.slice(0, l)), s || (s = "_home");
    } catch {
      s = "_home";
    }
    try {
      n && (ne.set(s, n), E.set(n, s));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      try {
        const o = new URLSearchParams(location.search || "");
        o.delete("page");
        const l = o.toString(), u = l ? "?" + l : "", p = i ? "#" + encodeURIComponent(i) : "", m = s + (i ? `::${i}` : "");
        try {
          const d = "#/" + de(String(s)) + (i ? "#" + encodeURIComponent(i) : "") + (l ? "?" + l : ""), h = typeof location < "u" ? String(location.hash || "") : "", f = h ? String(h).replace(/^#\/?/, "") : "";
          let g = f;
          try {
            g = decodeURIComponent(f);
          } catch {
          }
          try {
            g = String(g).replace(/^\/+/, "");
          } catch {
          }
          const b = h === d || f === String(s) || g === String(s);
          try {
            const y = (location.pathname || "") + (location.search || "");
            if (b)
              try {
                history.replaceState({ page: m }, "", y + d);
              } catch (k) {
                console.warn("[htmlBuilder] computeSlug history replace failed", k);
              }
            else
              try {
                history.replaceState({ page: m }, "", y + d);
              } catch (k) {
                console.warn("[htmlBuilder] computeSlug history replace failed", k);
              }
          } catch {
            try {
              history.replaceState({ page: m }, "", "#/" + de(String(s)) + (i ? "#" + encodeURIComponent(i) : "") + (l ? "?" + l : ""));
            } catch (k) {
              console.warn("[htmlBuilder] computeSlug history replace failed", k);
            }
          }
        } catch {
          const h = (location.pathname || "") + "#/" + de(String(s)) + p + u;
          try {
            history.replaceState({ page: m }, "", h);
          } catch (f) {
            console.warn("[htmlBuilder] computeSlug history replace failed", f);
          }
        }
      } catch {
        try {
          history.replaceState({ page: s + (i ? `::${i}` : "") }, "", "#/" + de(String(s)));
        } catch (l) {
          console.warn("[htmlBuilder] computeSlug history replace failed", l);
        }
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
async function no(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const l = o.getAttribute("href") || "";
      if (!l) continue;
      let m = ce(l).split(/::|#/, 2)[0];
      try {
        const h = m.indexOf("?");
        h !== -1 && (m = m.slice(0, h));
      } catch {
      }
      if (!m || (m.includes(".") || (m = m + ".html"), !/\.html(?:$|[?#])/.test(m) && !m.toLowerCase().endsWith(".html"))) continue;
      const d = m;
      try {
        if (E && E.has && E.has(d)) continue;
      } catch (h) {
        console.warn("[htmlBuilder] mdToSlug check failed", h);
      }
      try {
        let h = !1;
        for (const f of ne.values())
          if (f === d) {
            h = !0;
            break;
          }
        if (h) continue;
      } catch (h) {
        console.warn("[htmlBuilder] slugToMd iteration failed", h);
      }
      n.add(d);
    } catch (l) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", l);
    }
  if (!n.size) return;
  const i = async (o) => {
    try {
      const l = await Me(o, t);
      if (l && l.raw)
        try {
          const p = (nr || new DOMParser()).parseFromString(l.raw, "text/html"), m = p.querySelector("title"), d = p.querySelector("h1"), h = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : d && d.textContent ? d.textContent.trim() : null;
          if (h) {
            const f = ye(h);
            if (f)
              try {
                ne.set(f, o), E.set(o, f);
              } catch (g) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", g);
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
async function ro(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = ft(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const c = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let o = ce(c[1]);
        try {
          let l;
          try {
            l = Ys(o, t);
          } catch (p) {
            l = o, console.warn("[htmlBuilder] resolve mdPath URL failed", p);
          }
          const u = l && r && l.startsWith(r) ? l.slice(r.length) : String(l || "").replace(/^\//, "");
          n.push({ rel: u }), E.has(u) || i.add(u);
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
      if (c && ne.has(c)) {
        try {
          const o = ne.get(c);
          o && E.set(o, c);
        } catch (o) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", o);
        }
        return;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", s);
    }
    try {
      const s = await Me(a, t);
      if (s && s.raw) {
        const c = (s.raw || "").match(/^#\s+(.+)$/m);
        if (c && c[1]) {
          const o = ye(c[1].trim());
          if (o)
            try {
              ne.set(o, a), E.set(a, o);
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
const nr = typeof DOMParser < "u" ? new DOMParser() : null;
function Mn(e) {
  try {
    const n = (nr || new DOMParser()).parseFromString(e || "", "text/html");
    Ci(n);
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
          const u = (l[1] || "").toLowerCase(), p = le.size && (le.get(u) || le.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await Dt(p);
              } catch (m) {
                console.warn("[htmlBuilder] registerLanguage failed", m);
              }
            })();
          } catch (m) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", m);
          }
        } else
          try {
            if (fe && typeof fe.getLanguage == "function" && fe.getLanguage("plaintext")) {
              const u = fe.highlight ? fe.highlight(c.textContent || "", { language: "plaintext" }) : null;
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
async function io(e) {
  const t = Hn ? await Hn(e || "", le) : It(e || "", le), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = le.size && (le.get(r) || le.get(String(r).toLowerCase())) || r;
      try {
        i.push(Dt(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Dt(r));
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
async function ao(e) {
  if (await io(e), fn) {
    const t = await fn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function so(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const p = typeof DOMParser < "u" ? new DOMParser() : null;
      if (p) {
        const m = p.parseFromString(t.raw || "", "text/html");
        try {
          Or(m.body, n, r);
        } catch (d) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", d);
        }
        a = Mn(m.documentElement && m.documentElement.outerHTML ? m.documentElement.outerHTML : t.raw || "");
      } else
        a = Mn(t.raw || "");
    } catch {
      a = Mn(t.raw || "");
    }
  else
    a = await ao(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Or(s, n, r);
  } catch (p) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", p);
  }
  try {
    Ci(s);
  } catch (p) {
    console.warn("[htmlBuilder] addHeadingIds failed", p);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((m) => {
      try {
        const d = m.getAttribute && m.getAttribute("class") || m.className || "", h = String(d || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (h)
          try {
            m.setAttribute && m.setAttribute("class", h);
          } catch (f) {
            m.className = h, console.warn("[htmlBuilder] set element class failed", f);
          }
        else
          try {
            m.removeAttribute && m.removeAttribute("class");
          } catch (f) {
            m.className = "", console.warn("[htmlBuilder] remove element class failed", f);
          }
      } catch (d) {
        console.warn("[htmlBuilder] code element cleanup failed", d);
      }
    });
  } catch (p) {
    console.warn("[htmlBuilder] processing code elements failed", p);
  }
  try {
    fa(s);
  } catch (p) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", p);
  }
  eo(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((m) => {
      try {
        const d = m.parentElement;
        if (!d || d.tagName.toLowerCase() !== "p" || d.childNodes.length !== 1) return;
        const h = document.createElement("figure");
        h.className = "image", d.replaceWith(h), h.appendChild(m);
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
          const d = m.getAttribute && m.getAttribute("class") ? m.getAttribute("class") : "", h = String(d || "").split(/\s+/).filter(Boolean);
          h.indexOf("table") === -1 && h.push("table");
          try {
            m.setAttribute && m.setAttribute("class", h.join(" "));
          } catch {
            m.className = h.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (p) {
    console.warn("[htmlBuilder] add Bulma table class failed", p);
  }
  const { topH1: c, h1Text: o, slugKey: l } = to(a, s, n, i);
  try {
    if (c && a && a.meta && (a.meta.author || a.meta.date) && !(c.parentElement && c.parentElement.querySelector && c.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const m = a.meta.author ? String(a.meta.author).trim() : "", d = a.meta.date ? String(a.meta.date).trim() : "";
      let h = "";
      try {
        const g = new Date(d);
        d && !isNaN(g.getTime()) ? h = g.toLocaleDateString() : h = d;
      } catch {
        h = d;
      }
      const f = [];
      if (m && f.push(m), h && f.push(h), f.length) {
        const g = document.createElement("p"), b = f[0] ? String(f[0]).replace(/"/g, "").trim() : "", y = f.slice(1);
        if (g.className = "nimbi-article-subtitle is-6 has-text-grey-light", b) {
          const k = document.createElement("span");
          k.className = "nimbi-article-author", k.textContent = b, g.appendChild(k);
        }
        if (y.length) {
          const k = document.createElement("span");
          k.className = "nimbi-article-meta", k.textContent = y.join(" • "), g.appendChild(k);
        }
        try {
          c.parentElement.insertBefore(g, c.nextSibling);
        } catch {
          try {
            c.insertAdjacentElement("afterend", g);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await uo(s, r, n);
  } catch (p) {
    Xs("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", p), await tr(s, r, n);
  }
  const u = Js(e, a.toc, n);
  return { article: s, parsed: a, toc: u, topH1: c, h1Text: o, slugKey: l };
}
function oo(e) {
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
function Dr(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
}
const Ti = ka(() => {
  const e = Tt(Gs);
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
          const r = { data: await Qs(n) };
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
function lo() {
  return Ti.get();
}
function co(e) {
  return Ti.send(e, 2e3);
}
async function uo(e, t, n) {
  if (!lo()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await co({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function ho(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        let r = null, a = null;
        try {
          if (i.startsWith("#/")) {
            const c = i.replace(/^#\//, ""), o = String(c).match(/^([^?#]+)(?:#([^?]+))?(?:\?(.*))?$/);
            o && (r = o[1] || null, a = o[2] || null);
          } else if (i.startsWith("#"))
            r = null, a = i.replace(/^#/, "") || null;
          else {
            const c = new URL(i, location.href);
            r = c.searchParams.get("page"), a = c.hash ? c.hash.replace(/^#/, "") : null;
          }
        } catch (c) {
          console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", c);
        }
        if (!r && !a) return;
        t.preventDefault();
        let s = null;
        try {
          history && history.state && history.state.page && (s = history.state.page);
        } catch (c) {
          s = null, console.warn("[htmlBuilder] access history.state failed", c);
        }
        try {
          s || (s = new URL(location.href).searchParams.get("page"));
        } catch (c) {
          console.warn("[htmlBuilder] parse current location failed", c);
        }
        if (!r && a || r && s && String(r) === String(s)) {
          try {
            if (!r && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (c) {
                console.warn("[htmlBuilder] history.replaceState failed", c);
              }
            else
              try {
                const c = String(s || r) + (a ? `::${a}` : "");
                try {
                  let o = "";
                  try {
                    if (i && i.includes("?")) {
                      const p = i.indexOf("?");
                      o = i.slice(p + 1), o && o.indexOf("#") !== -1 && (o = o.split("#")[0]);
                      try {
                        const m = new URLSearchParams(o);
                        m.delete("page"), o = m.toString();
                      } catch {
                      }
                    }
                  } catch {
                    o = "";
                  }
                  if (!o) {
                    const p = new URLSearchParams(location.search || "");
                    p.delete("page"), o = p.toString();
                  }
                  const l = o ? "?" + o : "", u = a ? "#" + encodeURIComponent(a) : "";
                  history.replaceState({ page: c }, "", "#/" + de(String(s || r)) + u + l);
                } catch (o) {
                  console.warn("[htmlBuilder] history.replaceState failed", o);
                }
              } catch (c) {
                console.warn("[htmlBuilder] history.replaceState failed", c);
              }
          } catch (c) {
            console.warn("[htmlBuilder] update history for anchor failed", c);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (c) {
            console.warn("[htmlBuilder] stopPropagation failed", c);
          }
          try {
            jn(a);
          } catch (c) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", c);
          }
          return;
        }
        try {
          const c = String(r) + (a ? `::${a}` : "");
          try {
            let o = "";
            try {
              if (i && i.indexOf("?") !== -1) {
                const p = i.indexOf("?");
                o = i.slice(p + 1), o && o.indexOf("#") !== -1 && (o = o.split("#")[0]);
                try {
                  const m = new URLSearchParams(o);
                  m.delete("page"), o = m.toString();
                } catch {
                }
              }
            } catch {
              o = "";
            }
            if (!o) {
              const p = new URLSearchParams(location.search || "");
              p.delete("page"), o = p.toString();
            }
            const l = o ? "?" + o : "", u = a ? "#" + encodeURIComponent(a) : "";
            history.pushState({ page: c }, "", "#/" + de(String(r)) + u + l);
          } catch {
            history.pushState({ page: c }, "", "#/" + de(String(r)));
          }
        } catch {
          try {
            history.pushState({ page: r }, "", Te(r, a));
          } catch (o) {
            console.warn("[htmlBuilder] history.pushState failed", o);
          }
        }
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (c) {
              console.warn("[htmlBuilder] window.renderByQuery failed", c);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (c) {
              console.warn("[htmlBuilder] dispatch popstate failed", c);
            }
          else
            try {
              renderByQuery();
            } catch (c) {
              console.warn("[htmlBuilder] renderByQuery failed", c);
            }
        } catch (c) {
          console.warn("[htmlBuilder] SPA navigation invocation failed", c);
        }
      } catch (r) {
        console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function jn(e) {
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
function po(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const c = s || ((f) => typeof f == "string" ? f : ""), o = i || document.querySelector(".nimbi-cms"), l = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), p = a || document.querySelector(".nimbi-nav-wrap");
    let d = document.querySelector(".nimbi-scroll-top");
    if (!d) {
      d = document.createElement("button"), d.className = "nimbi-scroll-top button is-primary is-rounded is-small", d.setAttribute("aria-label", c("scrollToTop")), d.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(d) : o && o.appendChild ? o.appendChild(d) : l && l.appendChild ? l.appendChild(d) : document.body.appendChild(d);
      } catch {
        try {
          document.body.appendChild(d);
        } catch (g) {
          console.warn("[htmlBuilder] append scroll top button failed", g);
        }
      }
      try {
        try {
          Gr(d);
        } catch {
        }
      } catch (f) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", f);
      }
      d.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (g) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", g);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (g) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", g);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (g) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", g);
          }
        }
      });
    }
    const h = p && p.querySelector ? p.querySelector(".menu-label") : null;
    if (t) {
      if (!d._nimbiObserver) {
        const f = new IntersectionObserver((g) => {
          for (const b of g)
            b.target instanceof Element && (b.isIntersecting ? (d.classList.remove("show"), h && h.classList.remove("show")) : (d.classList.add("show"), h && h.classList.add("show")));
        }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
        d._nimbiObserver = f;
      }
      try {
        d._nimbiObserver.disconnect();
      } catch (f) {
        console.warn("[htmlBuilder] observer disconnect failed", f);
      }
      try {
        d._nimbiObserver.observe(t);
      } catch (f) {
        console.warn("[htmlBuilder] observer observe failed", f);
      }
      try {
        const f = () => {
          try {
            const g = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, b = t.getBoundingClientRect();
            !(b.bottom < g.top || b.top > g.bottom) ? (d.classList.remove("show"), h && h.classList.remove("show")) : (d.classList.add("show"), h && h.classList.add("show"));
          } catch (g) {
            console.warn("[htmlBuilder] checkIntersect failed", g);
          }
        };
        f(), "IntersectionObserver" in window || setTimeout(f, 100);
      } catch (f) {
        console.warn("[htmlBuilder] checkIntersect outer failed", f);
      }
    } else {
      d.classList.remove("show"), h && h.classList.remove("show");
      const f = i instanceof Element ? i : r instanceof Element ? r : window, g = () => {
        try {
          (f === window ? window.scrollY : f.scrollTop || 0) > 10 ? (d.classList.add("show"), h && h.classList.add("show")) : (d.classList.remove("show"), h && h.classList.remove("show"));
        } catch (b) {
          console.warn("[htmlBuilder] onScroll handler failed", b);
        }
      };
      ln(() => f.addEventListener("scroll", g)), g();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
function Ur(e, t) {
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
async function fo(e, t, n, i, r, a, s, c, o = "eager", l = 1, u = void 0, p = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const m = typeof DOMParser < "u" ? new DOMParser() : null, d = m ? m.parseFromString(n || "", "text/html") : null, h = d ? d.querySelectorAll("a") : [];
  await ln(() => no(h, i)), await ln(() => ro(h, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let f = null, g = null, b = null, y = null, k = null, S = null;
  function $() {
    try {
      const L = document.querySelector(".navbar-burger"), R = L && L.dataset ? L.dataset.target : null, P = R ? document.getElementById(R) : null;
      L && L.classList.contains("is-active") && (L.classList.remove("is-active"), L.setAttribute("aria-expanded", "false"), P && P.classList.remove("is-active"));
    } catch (L) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", L);
    }
  }
  async function H() {
    const L = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      L && L.classList.add("is-inactive");
    } catch {
    }
    try {
      const R = s && s();
      R && typeof R.then == "function" && await R;
    } catch (R) {
      try {
        console.warn && console.warn("[nimbi-cms] renderByQuery failed", R);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              L && L.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            L && L.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          L && L.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  const K = () => f || (f = (async () => {
    try {
      const L = await Promise.resolve().then(() => _t), R = Ur(L, "buildSearchIndex") || (typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0), P = Ur(L, "buildSearchIndexWorker") || (typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0);
      if (o === "lazy" && typeof P == "function")
        try {
          const x = await P(i, l, u);
          if (x && x.length) return x;
        } catch (x) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", x);
        }
      return typeof R == "function" ? await R(i, l, u) : [];
    } catch (L) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", L), [];
    } finally {
      if (g) {
        try {
          g.removeAttribute("disabled");
        } catch {
        }
        try {
          b && b.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), f.then((L) => {
    try {
      const R = String(g && g.value || "").trim().toLowerCase();
      if (!R || !Array.isArray(L) || !L.length) return;
      const P = L.filter((I) => I.title && I.title.toLowerCase().includes(R) || I.excerpt && I.excerpt.toLowerCase().includes(R));
      if (!P || !P.length) return;
      const x = document.getElementById("nimbi-search-results");
      if (!x) return;
      x.innerHTML = "";
      try {
        const I = document.createElement("div");
        I.className = "panel nimbi-search-panel", P.slice(0, 10).forEach((M) => {
          try {
            if (M.parentTitle) {
              const v = document.createElement("p");
              v.className = "panel-heading nimbi-search-title nimbi-search-parent", v.textContent = M.parentTitle, I.appendChild(v);
            }
            const N = document.createElement("a");
            N.className = "panel-block nimbi-search-result";
            try {
              if (o === "eager") {
                let v = M.slug || "";
                try {
                  v = decodeURIComponent(String(v || ""));
                } catch {
                }
                let O = null;
                if (typeof v == "string" && v.indexOf("::") !== -1) {
                  const U = v.split("::", 2);
                  v = U[0], O = U[1] || null;
                }
                N.href = Te(v, O);
              } else {
                let v = M.slug || "";
                try {
                  v = decodeURIComponent(String(v || ""));
                } catch {
                }
                let O = "";
                if (typeof v == "string" && v.indexOf("::") !== -1) {
                  const me = v.split("::", 2);
                  v = me[0], O = me[1] ? "#" + encodeURIComponent(me[1]) : "";
                }
                const U = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
                U.delete("page");
                const W = U.toString(), we = W ? "?" + W : "";
                N.href = "#/" + de(v || "") + O + we;
              }
            } catch {
              N.href = Te(M.slug);
            }
            N.setAttribute("role", "button");
            try {
              if (M.path && typeof M.slug == "string") {
                try {
                  ne.set(M.slug, M.path);
                } catch {
                }
                try {
                  E.set(M.path, M.slug);
                } catch {
                }
              }
            } catch {
            }
            const _ = document.createElement("div");
            _.className = "is-size-6 has-text-weight-semibold", _.textContent = M.title, N.appendChild(_), N.addEventListener("click", () => {
              try {
                x.style.display = "none";
              } catch {
              }
            }), I.appendChild(N);
          } catch {
          }
        }), x.appendChild(I);
        try {
          x.style.display = "block";
        } catch {
        }
      } catch {
      }
    } catch {
    }
  }).catch(() => {
  }), f), q = document.createElement("nav");
  q.className = "navbar", q.setAttribute("role", "navigation"), q.setAttribute("aria-label", "main navigation");
  const ee = document.createElement("div");
  ee.className = "navbar-brand";
  const ue = h[0], T = document.createElement("a");
  if (T.className = "navbar-item", ue) {
    const L = ue.getAttribute("href") || "#";
    try {
      const R = new URL(L, location.href), P = R.searchParams.get("page");
      let x = R.hash ? String(R.hash).replace(/^#/, "") : null;
      if (x && x.startsWith("/") && (x = null), P) {
        const I = decodeURIComponent(P || "");
        let M = !1;
        try {
          const N = R && R.origin ? R.origin : null, _ = typeof location < "u" && location.origin ? location.origin : typeof location < "u" && location.href ? new URL(location.href).origin : null;
          typeof L == "string" && L.indexOf("://") !== -1 && N && _ && N === _ && (M = !0);
        } catch {
        }
        if (M) {
          let N = typeof ce == "function" ? ce(I) : String(I).replace(/^\/+/, ""), _ = N;
          try {
            if (E && typeof E.has == "function")
              if (E.has(N)) _ = E.get(N);
              else {
                const U = decodeURIComponent(String(I || "")), W = typeof ce == "function" ? ce(U) : String(U).replace(/^\/+/, "");
                if (E.has(W)) _ = E.get(W);
                else {
                  const we = String(N || "").replace(/^.*\//, "");
                  E.has(we) && (_ = E.get(we));
                }
              }
          } catch {
          }
          const v = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
          v.delete("page");
          const O = v.toString() ? "?" + v.toString() : "";
          T.href = "#/" + de(String(_ || N || I)) + (x ? "#" + encodeURIComponent(x) : "") + O, T.textContent = a("home");
        } else {
          try {
            T.href = Te(I, x, typeof location < "u" && location.search ? location.search : "");
          } catch {
            T.href = L;
          }
          T.textContent = a("home");
        }
      } else
        try {
          const I = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
          I.delete("page");
          const M = I.toString() ? "?" + I.toString() : "";
          let N = String(r || "");
          try {
            const _ = typeof ce == "function" ? ce(String(r || "")) : String(r || "");
            if (E && typeof E.has == "function" && E.has(_)) N = E.get(_);
            else {
              const v = String(_ || "").replace(/^.*\//, "");
              v && E && typeof E.has == "function" && E.has(v) && (N = E.get(v));
            }
          } catch {
          }
          T.href = "#/" + de(String(N || r || "")) + M, T.textContent = a("home");
        } catch {
          T.href = "#/" + de(String(r || "")), T.textContent = a("home");
        }
    } catch {
      T.href = "#/" + de(String(r || "")), T.textContent = a("home");
    }
  } else
    T.href = "#/" + de(String(r || "")), T.textContent = a("home");
  async function Q(L) {
    try {
      if (!L || L === "none") return null;
      if (L === "favicon")
        try {
          const R = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!R) return null;
          const P = R.getAttribute("href") || "";
          return P && /\.png(?:\?|$)/i.test(P) ? new URL(P, location.href).toString() : null;
        } catch {
          return null;
        }
      if (L === "copy-first" || L === "move-first")
        try {
          const R = await Me(r, i);
          if (!R || !R.raw) return null;
          const I = new DOMParser().parseFromString(R.raw, "text/html").querySelector("img");
          if (!I) return null;
          const M = I.getAttribute("src") || "";
          if (!M) return null;
          const N = new URL(M, location.href).toString();
          if (L === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", N);
            } catch {
            }
          return N;
        } catch {
          return null;
        }
      try {
        return new URL(L, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let _e = null;
  try {
    _e = await Q(p);
  } catch {
    _e = null;
  }
  if (_e)
    try {
      const L = document.createElement("img");
      L.className = "nimbi-navbar-logo";
      const R = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      L.alt = R, L.title = R, L.src = _e;
      try {
        L.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!T.textContent || !String(T.textContent).trim()) && (T.textContent = R);
      } catch {
      }
      try {
        T.insertBefore(L, T.firstChild);
      } catch {
        try {
          T.appendChild(L);
        } catch {
        }
      }
    } catch {
    }
  ee.appendChild(T), T.addEventListener("click", function(L) {
    const R = T.getAttribute("href") || "";
    if (R.startsWith("?page=") || R.startsWith("#/")) {
      L.preventDefault();
      let P = null, x = null, I = R;
      try {
        if (R.startsWith("?page=")) {
          const M = new URL(R, location.href);
          P = M.searchParams.get("page"), x = M.hash ? M.hash.replace(/^#/, "") : null;
        } else if (R.startsWith("#/")) {
          const M = String(R || "").replace(/^#/, "");
          let N = M, _ = "";
          if (M.indexOf("?") !== -1) {
            const U = M.indexOf("?");
            N = M.slice(0, U), _ = M.slice(U);
          }
          const v = N.split("#");
          let O = v[0] || "";
          O.startsWith("/") && (O = O.slice(1)), P = O || null, x = v[1] || null, I = "#" + N + _;
        }
      } catch {
      }
      try {
        const M = P || "", N = typeof ce == "function" ? ce(M) : M.replace(/^\/+/, "");
        let _ = N + (x ? `::${x}` : ""), v = N;
        try {
          if (E && typeof E.has == "function")
            if (E.has(N))
              v = E.get(N), _ = v + (x ? `::${x}` : "");
            else
              try {
                const O = decodeURIComponent(M || ""), U = typeof ce == "function" ? ce(O) : String(O).replace(/^\/+/, "");
                if (E.has(U))
                  v = E.get(U), _ = v + (x ? `::${x}` : "");
                else {
                  const W = String(N || "").replace(/^.*\//, "");
                  E.has(W) && (v = E.get(W), _ = v + (x ? `::${x}` : ""));
                }
              } catch {
              }
        } catch {
        }
        try {
          let O = null;
          typeof url < "u" && url && url.search ? O = new URLSearchParams(url.search) : O = new URLSearchParams(typeof location < "u" && location.search ? location.search : ""), O.delete("page");
          const U = O.toString(), W = U ? "?" + U : "", we = x ? "#" + encodeURIComponent(x) : "", me = I && I.indexOf("#/") === 0 ? I : "#/" + de(v || "") + we + W;
          history.pushState({ page: _ }, "", me);
        } catch {
          const U = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
          U.delete("page");
          const W = U.toString(), we = W ? "?" + W : "", me = x ? "#" + encodeURIComponent(x) : "", be = "#/" + de(v || P || "") + me + we;
          history.pushState({ page: _ }, "", be);
        }
      } catch {
        const N = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
        N.delete("page");
        const _ = N.toString(), v = _ ? "?" + _ : "", O = x ? "#" + encodeURIComponent(x) : "", U = "#/" + de(cosmeticPageKey || P || "") + O + v;
        history.pushState({ page: pageVal }, "", U);
      }
      H();
      try {
        $();
      } catch {
      }
    }
  });
  const re = document.createElement("a");
  re.className = "navbar-burger", re.setAttribute("role", "button"), re.setAttribute("aria-label", "menu"), re.setAttribute("aria-expanded", "false");
  const G = "nimbi-navbar-menu";
  re.dataset.target = G, re.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', ee.appendChild(re);
  try {
    re.addEventListener("click", (L) => {
      try {
        const R = re.dataset && re.dataset.target ? re.dataset.target : null, P = R ? document.getElementById(R) : null;
        re.classList.contains("is-active") ? (re.classList.remove("is-active"), re.setAttribute("aria-expanded", "false"), P && P.classList.remove("is-active")) : (re.classList.add("is-active"), re.setAttribute("aria-expanded", "true"), P && P.classList.add("is-active"));
      } catch (R) {
        console.warn("[nimbi-cms] navbar burger toggle failed", R);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] burger event binding failed", L);
  }
  const C = document.createElement("div");
  C.className = "navbar-menu", C.id = G;
  const V = document.createElement("div");
  V.className = "navbar-start";
  let X = null, ge = null;
  if (!c)
    X = null, g = null, y = null, k = null, S = null;
  else {
    X = document.createElement("div"), X.className = "navbar-end", ge = document.createElement("div"), ge.className = "navbar-item", g = document.createElement("input"), g.className = "input", g.type = "search", g.placeholder = a("searchPlaceholder") || "", g.id = "nimbi-search";
    try {
      g.setAttribute("disabled", "disabled");
    } catch {
    }
    try {
      const P = (a && typeof a == "function" ? a("searchAria") : null) || g.placeholder || "Search";
      try {
        g.setAttribute("aria-label", P);
      } catch {
      }
      try {
        g.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        g.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        g.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    try {
      y = document.createElement("div"), y.className = "dropdown is-right nimbi-search";
      const P = document.createElement("div");
      P.className = "dropdown-menu", k = document.createElement("div"), k.id = "nimbi-search-results", k.className = "dropdown-content nimbi-search-results", S = k, P.appendChild(k), y.appendChild(P);
      try {
        ge.appendChild(g);
      } catch {
      }
      try {
        X.appendChild(ge);
      } catch {
      }
      X.appendChild(y);
    } catch {
      y = null, k = null, S = null;
    }
    const L = (P) => {
      if (!k) return;
      k.innerHTML = "";
      let x = -1;
      function I(_) {
        try {
          const v = k.querySelector(".nimbi-search-result.is-selected");
          v && v.classList.remove("is-selected");
          const O = k.querySelectorAll(".nimbi-search-result");
          if (!O || !O.length) return;
          if (_ < 0) {
            x = -1;
            return;
          }
          _ >= O.length && (_ = O.length - 1);
          const U = O[_];
          if (U) {
            U.classList.add("is-selected"), x = _;
            try {
              U.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function M(_) {
        try {
          const v = _.key, O = k.querySelectorAll(".nimbi-search-result");
          if (!O || !O.length) return;
          if (v === "ArrowDown") {
            _.preventDefault();
            const U = x < 0 ? 0 : Math.min(O.length - 1, x + 1);
            I(U);
            return;
          }
          if (v === "ArrowUp") {
            _.preventDefault();
            const U = x <= 0 ? 0 : x - 1;
            I(U);
            return;
          }
          if (v === "Enter") {
            _.preventDefault();
            const U = k.querySelector(".nimbi-search-result.is-selected") || k.querySelector(".nimbi-search-result");
            if (U)
              try {
                U.click();
              } catch {
              }
            return;
          }
          if (v === "Escape") {
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
              k.removeEventListener("keydown", M);
            } catch {
            }
            try {
              g && g.focus();
            } catch {
            }
            try {
              g && g.removeEventListener("keydown", N);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function N(_) {
        try {
          if (_ && _.key === "ArrowDown") {
            _.preventDefault();
            try {
              k.focus();
            } catch {
            }
            I(0);
          }
        } catch {
        }
      }
      try {
        const _ = document.createElement("div");
        _.className = "panel nimbi-search-panel", P.forEach((v) => {
          if (v.parentTitle) {
            const W = document.createElement("p");
            W.textContent = v.parentTitle, W.className = "panel-heading nimbi-search-title nimbi-search-parent", _.appendChild(W);
          }
          const O = document.createElement("a");
          O.className = "panel-block nimbi-search-result";
          try {
            if (o === "eager") {
              let W = v.slug || "", we = null;
              if (typeof W == "string" && W.indexOf("::") !== -1) {
                const me = W.split("::", 2);
                W = me[0], we = me[1] || null;
              }
              O.href = Te(W, we);
            } else {
              let W = v.slug || "", we = "";
              if (typeof W == "string" && W.indexOf("::") !== -1) {
                const Ve = W.split("::", 2);
                W = Ve[0], we = Ve[1] ? "#" + encodeURIComponent(Ve[1]) : "";
              }
              const me = new URLSearchParams(typeof location < "u" && location.search ? location.search : "");
              me.delete("page");
              const be = me.toString(), Ne = be ? "?" + be : "";
              O.href = "#/" + de(W || "") + we + Ne;
            }
          } catch {
            O.href = Te(v.slug);
          }
          O.setAttribute("role", "button");
          try {
            if (v.path && typeof v.slug == "string") {
              try {
                ne.set(v.slug, v.path);
              } catch {
              }
              try {
                E.set(v.path, v.slug);
              } catch {
              }
            }
          } catch {
          }
          const U = document.createElement("div");
          U.className = "is-size-6 has-text-weight-semibold", U.textContent = v.title, O.appendChild(U), O.addEventListener("click", () => {
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
              k.removeEventListener("keydown", M);
            } catch {
            }
            try {
              g && g.removeEventListener("keydown", N);
            } catch {
            }
          }), _.appendChild(O);
        }), k.appendChild(_);
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
        k.addEventListener("keydown", M);
      } catch {
      }
      try {
        g && g.addEventListener("keydown", N);
      } catch {
      }
    }, R = (P, x) => {
      let I = null;
      return (...M) => {
        I && clearTimeout(I), I = setTimeout(() => P(...M), x);
      };
    };
    if (g) {
      const P = R(async () => {
        const x = document.querySelector("input#nimbi-search"), I = String(x && x.value || "").trim().toLowerCase();
        if (!I) {
          L([]);
          return;
        }
        try {
          await K();
          const N = (await f).filter((_) => _.title && _.title.toLowerCase().includes(I) || _.excerpt && _.excerpt.toLowerCase().includes(I));
          L(N.slice(0, 10));
        } catch (M) {
          console.warn("[nimbi-cms] search input handler failed", M), L([]);
        }
      }, 50);
      try {
        g.addEventListener("input", P);
      } catch {
      }
      try {
        document.addEventListener("input", (x) => {
          try {
            x && x.target && x.target.id === "nimbi-search" && P(x);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        f = K();
      } catch (P) {
        console.warn("[nimbi-cms] eager search index init failed", P), f = Promise.resolve([]);
      }
      f.finally(() => {
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
      const P = (x) => {
        try {
          const I = x && x.target;
          if (!S || !S.classList.contains("is-open") && S.style && S.style.display !== "block" || I && (S.contains(I) || g && (I === g || g.contains && g.contains(I)))) return;
          if (y) {
            y.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            S.style.display = "none";
          } catch {
          }
          try {
            S.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", P, !0), document.addEventListener("touchstart", P, !0);
    } catch {
    }
  }
  for (let L = 0; L < h.length; L++) {
    const R = h[L];
    if (L === 0) continue;
    const P = R.getAttribute("href") || "#", x = document.createElement("a");
    x.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(P) || P.endsWith(".md")) {
        const M = ce(P).split(/::|#/, 2), N = M[0], _ = M[1];
        try {
          let v = null;
          try {
            if (E && E.has && E.has(N)) v = E.get(N);
            else {
              const O = String(N || "").replace(/^.*\//, "");
              if (O && E && E.has && E.has(O)) v = E.get(O);
              else
                try {
                  for (const [U, W] of ne || [])
                    if (W === N || W === O) {
                      v = U;
                      break;
                    }
                } catch {
                }
            }
          } catch (O) {
            console.warn("[nimbi-cms] nav mdToSlug lookup failed", O);
          }
          v ? x.href = "#/" + de(v) + (_ ? "#" + encodeURIComponent(_) : "") : x.href = Te(N, _);
        } catch {
          x.href = Te(N, _);
        }
      } else if (/\.html(?:$|[#?])/.test(P) || P.endsWith(".html")) {
        const M = ce(P).split(/::|#/, 2);
        let N = M[0];
        N && !N.toLowerCase().endsWith(".html") && (N = N + ".html");
        const _ = M[1];
        try {
          let v = null;
          try {
            if (E && E.has && E.has(N)) v = E.get(N);
            else {
              const O = String(N || "").replace(/^.*\//, "");
              if (O && E && E.has && E.has(O)) v = E.get(O);
              else
                try {
                  for (const [U, W] of ne || [])
                    if (W === N || W === O) {
                      v = U;
                      break;
                    }
                } catch {
                }
            }
          } catch (O) {
            console.warn("[nimbi-cms] nav mdToSlug lookup failed (html)", O);
          }
          if (v)
            x.href = "#/" + de(v) + (_ ? "#" + encodeURIComponent(_) : "");
          else
            try {
              const O = await Me(N, i);
              if (O && O.raw)
                try {
                  const W = new DOMParser().parseFromString(O.raw, "text/html"), we = W.querySelector("title"), me = W.querySelector("h1"), be = we && we.textContent && we.textContent.trim() ? we.textContent.trim() : me && me.textContent ? me.textContent.trim() : null;
                  if (be) {
                    const Ne = ye(be);
                    if (Ne) {
                      try {
                        ne.set(Ne, N), E.set(N, Ne);
                      } catch (Ve) {
                        console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ve);
                      }
                      x.href = "#/" + de(Ne) + (_ ? "#" + encodeURIComponent(_) : "");
                    } else
                      x.href = Te(N, _);
                  } else
                    x.href = Te(N, _);
                } catch {
                  x.href = Te(N, _);
                }
              else
                x.href = P;
            } catch {
              x.href = P;
            }
        } catch {
          x.href = P;
        }
      } else
        x.href = P;
    } catch (I) {
      console.warn("[nimbi-cms] nav item href parse failed", I), x.href = P;
    }
    try {
      const I = R.textContent && String(R.textContent).trim() ? String(R.textContent).trim() : null;
      if (I)
        try {
          const M = ye(I);
          if (M) {
            const N = x.getAttribute && x.getAttribute("href") ? x.getAttribute("href") : "";
            try {
              const v = new URL(N, location.href).searchParams.get("page");
              if (v) {
                const O = decodeURIComponent(v);
                try {
                  ne.set(M, O), E.set(O, M);
                } catch (U) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", U);
                }
              }
            } catch (_) {
              console.warn("[nimbi-cms] nav slug mapping failed", _);
            }
          }
        } catch (M) {
          console.warn("[nimbi-cms] nav slug mapping failed", M);
        }
    } catch (I) {
      console.warn("[nimbi-cms] nav slug mapping failed", I);
    }
    x.textContent = R.textContent || P, V.appendChild(x);
  }
  C.appendChild(V), X && C.appendChild(X), q.appendChild(ee), q.appendChild(C), e.appendChild(q);
  try {
    const L = (R) => {
      try {
        const P = q && q.querySelector ? q.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!P || !P.classList.contains("is-active")) return;
        const x = P && P.closest ? P.closest(".navbar") : q;
        if (x && x.contains(R.target)) return;
        $();
      } catch {
      }
    };
    document.addEventListener("click", L, !0), document.addEventListener("touchstart", L, !0);
  } catch {
  }
  try {
    C.addEventListener("click", (L) => {
      const R = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!R) return;
      const P = R.getAttribute("href") || "";
      try {
        const x = new URL(P, location.href), I = x.searchParams.get("page"), M = x.hash ? x.hash.replace(/^#/, "") : null;
        if (I) {
          L.preventDefault();
          try {
            const N = I + (M ? `::${M}` : "");
            try {
              const _ = M ? "#" + encodeURIComponent(M) : "", v = "#/" + de(I || "") + _;
              history.pushState({ page: N }, "", v);
            } catch {
              const v = M ? "#" + encodeURIComponent(M) : "", O = "#/" + de(I || "") + v;
              history.pushState({ page: N }, "", O);
            }
          } catch {
            const _ = new URLSearchParams(location.search || "");
            _.delete("page");
            const v = _.toString(), O = v ? "?" + v : "", U = M ? "#" + encodeURIComponent(M) : "", W = "#/" + de(I || "") + U + O;
            history.pushState({ page: I }, "", W);
          }
          H();
        }
      } catch (x) {
        console.warn("[nimbi-cms] navbar click handler failed", x);
      }
      try {
        const x = q && q.querySelector ? q.querySelector(".navbar-burger") : null, I = x && x.dataset ? x.dataset.target : null, M = I ? document.getElementById(I) : null;
        x && x.classList.contains("is-active") && (x.classList.remove("is-active"), x.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active"));
      } catch (x) {
        console.warn("[nimbi-cms] mobile menu close failed", x);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] attach content click handler failed", L);
  }
  try {
    t.addEventListener("click", (L) => {
      const R = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!R) return;
      const P = R.getAttribute("href") || "";
      if (P && !Vr(P))
        try {
          const x = new URL(P, location.href), I = x.searchParams.get("page"), M = x.hash ? x.hash.replace(/^#/, "") : null;
          if (I) {
            L.preventDefault();
            try {
              const N = I + (M ? `::${M}` : "");
              try {
                const _ = M ? "#" + encodeURIComponent(M) : "", v = "#/" + de(I || "") + _;
                history.pushState({ page: N }, "", v);
              } catch {
                const v = M ? "#" + encodeURIComponent(M) : "", O = "#/" + de(I || "") + v;
                history.pushState({ page: N }, "", O);
              }
            } catch {
              const _ = new URLSearchParams(location.search || "");
              _.delete("page");
              const v = _.toString(), O = v ? "?" + v : "", U = M ? "#" + encodeURIComponent(M) : "", W = "#/" + de(I || "") + U + O;
              history.pushState({ page: I }, "", W);
            }
            H();
          }
        } catch (x) {
          console.warn("[nimbi-cms] container click URL parse failed", x);
        }
    });
  } catch (L) {
    console.warn("[nimbi-cms] build navbar failed", L);
  }
  return { navbar: q, linkEls: h };
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
var Pn, Hr;
function go() {
  if (Hr) return Pn;
  Hr = 1;
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
    for (let g = o; g <= l; g++)
      if ((t(m[g]) || !p(m[g]) && (p(m[g + 1]) || t(m[g + 1]))) && c++, t(m[g]))
        for (; g <= l && (i(m[g + 1]) || p(m[g + 1])); )
          g++;
    const d = c / u, h = Math.round(d * 60 * 1e3);
    return {
      text: Math.ceil(d.toFixed(2)) + " min read",
      minutes: d,
      time: h,
      words: c
    };
  }
  return Pn = r, Pn;
}
var mo = go();
const bo = /* @__PURE__ */ Wr(mo);
function jr(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function ut(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function wo(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function yo(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  ut("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && ut("property", "og:description", a), a && String(a).trim() && ut("name", "twitter:description", a), ut("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (ut("property", "og:image", s), ut("name", "twitter:image", s));
}
function ko(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  c && String(c).trim() && jr("description", c), jr("robots", a.robots || "index,follow"), yo(a, t, n, c);
}
function _o() {
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
function xo(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, c = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i || s.image || null;
    let u = "";
    try {
      if (t) {
        const h = ce(t);
        try {
          const f = location.origin + location.pathname, g = new URLSearchParams(location.search || "");
          g.delete("page");
          let b = g.toString();
          if (!b)
            try {
              const y = location.hash ? decodeURIComponent(String(location.hash).replace(/^#/, "")) : "";
              y && y.indexOf("?") !== -1 && (b = y.split("?")[1] || "");
            } catch {
            }
          u = f.split("?")[0] + "?page=" + encodeURIComponent(h) + (b ? "&" + b : "");
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (h) {
      u = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", h);
    }
    u && wo("canonical", u);
    try {
      ut("property", "og:url", u);
    } catch (h) {
      console.warn("[seoManager] upsertMeta og:url failed", h);
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
function So(e, t, n, i, r, a, s, c, o, l, u) {
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
    let h = "";
    try {
      let b = "";
      try {
        const y = c || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let k = y.nextElementSibling;
          const S = [];
          for (; k && !(k.tagName && k.tagName.toLowerCase() === "h2"); ) {
            try {
              if (k.classList && k.classList.contains("nimbi-article-subtitle")) {
                k = k.nextElementSibling;
                continue;
              }
            } catch {
            }
            const $ = (k.textContent || "").trim();
            $ && S.push($), k = k.nextElementSibling;
          }
          S.length && (b = S.join(" ").replace(/\s+/g, " ").trim()), !b && o && (b = String(o).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      b && String(b).length > 160 && (b = String(b).slice(0, 157).trim() + "..."), h = b;
    } catch (b) {
      console.warn("[seoManager] compute descOverride failed", b);
    }
    let f = "";
    try {
      p && (f = p);
    } catch {
    }
    if (!f)
      try {
        c && c.textContent && (f = String(c.textContent).trim());
      } catch {
      }
    if (!f)
      try {
        const b = r.querySelector("h2");
        b && b.textContent && (f = String(b.textContent).trim());
      } catch {
      }
    f || (f = a || "");
    try {
      ko(n, f || void 0, d, h);
    } catch (b) {
      console.warn("[seoManager] setMetaTags failed", b);
    }
    try {
      xo(n, l, f || void 0, d, h, t);
    } catch (b) {
      console.warn("[seoManager] setStructuredData failed", b);
    }
    const g = _o();
    f ? g ? document.title = `${g} - ${f}` : document.title = `${t || "Site"} - ${f}` : p ? document.title = p : document.title = t || document.title;
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
      const p = bo(u.raw || ""), m = p && typeof p.minutes == "number" ? Math.ceil(p.minutes) : 0, d = m ? e("readingTime", { minutes: m }) : "";
      if (!d) return;
      const h = r.querySelector("h1");
      if (h) {
        const f = r.querySelector(".nimbi-article-subtitle");
        try {
          if (f) {
            const g = document.createElement("span");
            g.className = "nimbi-reading-time", g.textContent = d, f.appendChild(g);
          } else {
            const g = document.createElement("p");
            g.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = d, g.appendChild(b);
            try {
              h.parentElement.insertBefore(g, h.nextSibling);
            } catch {
              try {
                h.insertAdjacentElement("afterend", g);
              } catch {
              }
            }
          }
        } catch {
          try {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = d, b.appendChild(y), h.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch (p) {
    console.warn("[seoManager] reading time update failed", p);
  }
}
let ze = null, J = null, Re = 1, Ke = (e, t) => t, Nt = 0, Ot = 0, sn = () => {
}, Ct = 0.25;
function vo() {
  if (ze && document.contains(ze)) return ze;
  ze = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", Ke("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
    C.target === e && $n();
  }), e.addEventListener("wheel", (C) => {
    if (!ue()) return;
    C.preventDefault();
    const V = C.deltaY < 0 ? Ct : -Ct;
    tt(Re + V), l(), u();
  }, { passive: !1 }), e.addEventListener("keydown", (C) => {
    if (C.key === "Escape") {
      $n();
      return;
    }
    if (Re > 1) {
      const V = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!V) return;
      const X = 40;
      switch (C.key) {
        case "ArrowUp":
          V.scrollTop -= X, C.preventDefault();
          break;
        case "ArrowDown":
          V.scrollTop += X, C.preventDefault();
          break;
        case "ArrowLeft":
          V.scrollLeft -= X, C.preventDefault();
          break;
        case "ArrowRight":
          V.scrollLeft += X, C.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), ze = e, J = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), c = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function l() {
    c && (c.textContent = `${Math.round(Re * 100)}%`);
  }
  const u = () => {
    o && (o.textContent = `${Math.round(Re * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  sn = l, i.addEventListener("click", () => {
    tt(Re + Ct), l(), u();
  }), r.addEventListener("click", () => {
    tt(Re - Ct), l(), u();
  }), t.addEventListener("click", () => {
    Bt(), l(), u();
  }), n.addEventListener("click", () => {
    tt(1), l(), u();
  }), a.addEventListener("click", () => {
    Bt(), l(), u();
  }), s.addEventListener("click", $n), t.title = Ke("imagePreviewFit", "Fit to screen"), n.title = Ke("imagePreviewOriginal", "Original size"), r.title = Ke("imagePreviewZoomOut", "Zoom out"), i.title = Ke("imagePreviewZoomIn", "Zoom in"), s.title = Ke("imagePreviewClose", "Close"), s.setAttribute("aria-label", Ke("imagePreviewClose", "Close"));
  let p = !1, m = 0, d = 0, h = 0, f = 0;
  const g = /* @__PURE__ */ new Map();
  let b = 0, y = 1;
  const k = (C, V) => {
    const X = C.x - V.x, ge = C.y - V.y;
    return Math.hypot(X, ge);
  }, S = () => {
    p = !1, g.clear(), b = 0, J && (J.classList.add("is-panning"), J.classList.remove("is-grabbing"));
  };
  let $ = 0, H = 0, K = 0;
  const q = (C) => {
    const V = Date.now(), X = V - $, ge = C.clientX - H, L = C.clientY - K;
    $ = V, H = C.clientX, K = C.clientY, X < 300 && Math.hypot(ge, L) < 30 && (tt(Re > 1 ? 1 : 2), l(), C.preventDefault());
  }, ee = (C) => {
    tt(Re > 1 ? 1 : 2), l(), C.preventDefault();
  }, ue = () => ze ? typeof ze.open == "boolean" ? ze.open : ze.classList.contains("is-active") : !1, T = (C, V, X = 1) => {
    if (g.has(X) && g.set(X, { x: C, y: V }), g.size === 2) {
      const P = Array.from(g.values()), x = k(P[0], P[1]);
      if (b > 0) {
        const I = x / b;
        tt(y * I);
      }
      return;
    }
    if (!p) return;
    const ge = J.closest(".nimbi-image-preview__image-wrapper");
    if (!ge) return;
    const L = C - m, R = V - d;
    ge.scrollLeft = h - L, ge.scrollTop = f - R;
  }, Q = (C, V, X = 1) => {
    if (!ue()) return;
    if (g.set(X, { x: C, y: V }), g.size === 2) {
      const R = Array.from(g.values());
      b = k(R[0], R[1]), y = Re;
      return;
    }
    const ge = J.closest(".nimbi-image-preview__image-wrapper");
    !ge || !(ge.scrollWidth > ge.clientWidth || ge.scrollHeight > ge.clientHeight) || (p = !0, m = C, d = V, h = ge.scrollLeft, f = ge.scrollTop, J.classList.add("is-panning"), J.classList.remove("is-grabbing"), window.addEventListener("pointermove", _e), window.addEventListener("pointerup", re), window.addEventListener("pointercancel", re));
  }, _e = (C) => {
    p && (C.preventDefault(), T(C.clientX, C.clientY, C.pointerId));
  }, re = () => {
    S(), window.removeEventListener("pointermove", _e), window.removeEventListener("pointerup", re), window.removeEventListener("pointercancel", re);
  };
  J.addEventListener("pointerdown", (C) => {
    C.preventDefault(), Q(C.clientX, C.clientY, C.pointerId);
  }), J.addEventListener("pointermove", (C) => {
    (p || g.size === 2) && C.preventDefault(), T(C.clientX, C.clientY, C.pointerId);
  }), J.addEventListener("pointerup", (C) => {
    C.preventDefault(), C.pointerType === "touch" && q(C), S();
  }), J.addEventListener("dblclick", ee), J.addEventListener("pointercancel", S), J.addEventListener("mousedown", (C) => {
    C.preventDefault(), Q(C.clientX, C.clientY, 1);
  }), J.addEventListener("mousemove", (C) => {
    p && C.preventDefault(), T(C.clientX, C.clientY, 1);
  }), J.addEventListener("mouseup", (C) => {
    C.preventDefault(), S();
  });
  const G = e.querySelector(".nimbi-image-preview__image-wrapper");
  return G && (G.addEventListener("pointerdown", (C) => {
    if (Q(C.clientX, C.clientY, C.pointerId), C && C.target && C.target.tagName === "IMG")
      try {
        C.target.classList.add("is-grabbing");
      } catch {
      }
  }), G.addEventListener("pointermove", (C) => {
    T(C.clientX, C.clientY, C.pointerId);
  }), G.addEventListener("pointerup", S), G.addEventListener("pointercancel", S), G.addEventListener("mousedown", (C) => {
    if (Q(C.clientX, C.clientY, 1), C && C.target && C.target.tagName === "IMG")
      try {
        C.target.classList.add("is-grabbing");
      } catch {
      }
  }), G.addEventListener("mousemove", (C) => {
    T(C.clientX, C.clientY, 1);
  }), G.addEventListener("mouseup", S)), e;
}
function tt(e) {
  if (!J) return;
  const t = Number(e);
  Re = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = J.getBoundingClientRect(), r = Nt || J.naturalWidth || J.width || i.width || 0, a = Ot || J.naturalHeight || J.height || i.height || 0;
  if (r && a) {
    J.style.setProperty("--nimbi-preview-img-max-width", "none"), J.style.setProperty("--nimbi-preview-img-max-height", "none"), J.style.setProperty("--nimbi-preview-img-width", `${r * Re}px`), J.style.setProperty("--nimbi-preview-img-height", `${a * Re}px`), J.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      J.style.width = `${r * Re}px`, J.style.height = `${a * Re}px`, J.style.transform = "none";
    } catch {
    }
  } else {
    J.style.setProperty("--nimbi-preview-img-max-width", ""), J.style.setProperty("--nimbi-preview-img-max-height", ""), J.style.setProperty("--nimbi-preview-img-width", ""), J.style.setProperty("--nimbi-preview-img-height", ""), J.style.setProperty("--nimbi-preview-img-transform", `scale(${Re})`);
    try {
      J.style.transform = `scale(${Re})`;
    } catch {
    }
  }
  J && (J.classList.add("is-panning"), J.classList.remove("is-grabbing"));
}
function Bt() {
  if (!J) return;
  const e = J.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = Nt || J.naturalWidth || t.width, i = Ot || J.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  tt(Number.isFinite(s) ? s : 1);
}
function Ao(e, t = "", n = 0, i = 0) {
  const r = vo();
  Re = 1, Nt = n || 0, Ot = i || 0, J.src = e;
  try {
    if (!t)
      try {
        const c = new URL(e, typeof location < "u" ? location.href : "").pathname || "", l = (c.substring(c.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = Ke("imagePreviewDefaultAlt", l || "Image");
      } catch {
        t = Ke("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  J.alt = t, J.style.transform = "scale(1)";
  const a = () => {
    Nt = J.naturalWidth || J.width || 0, Ot = J.naturalHeight || J.height || 0;
  };
  if (a(), Bt(), sn(), requestAnimationFrame(() => {
    Bt(), sn();
  }), !Nt || !Ot) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        Bt(), sn();
      }), J.removeEventListener("load", s);
    };
    J.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function $n() {
  if (ze) {
    typeof ze.close == "function" && ze.open && ze.close(), ze.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Eo(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  Ke = (d, h) => (typeof t == "function" ? t(d) : void 0) || h, Ct = n, e.addEventListener("click", (d) => {
    const h = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!h || h.tagName !== "IMG") return;
    const f = (
      /** @type {HTMLImageElement} */
      h
    );
    if (!f.src) return;
    const g = f.closest("a");
    g && g.getAttribute("href") || Ao(f.src, f.alt || "", f.naturalWidth || 0, f.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, c = 0;
  const o = /* @__PURE__ */ new Map();
  let l = 0, u = 1;
  const p = (d, h) => {
    const f = d.x - h.x, g = d.y - h.y;
    return Math.hypot(f, g);
  };
  e.addEventListener("pointerdown", (d) => {
    const h = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!h || h.tagName !== "IMG") return;
    const f = h.closest("a");
    if (f && f.getAttribute("href") || !ze || !ze.open) return;
    if (o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      const b = Array.from(o.values());
      l = p(b[0], b[1]), u = Re;
      return;
    }
    const g = h.closest(".nimbi-image-preview__image-wrapper");
    if (g && !(Re <= 1)) {
      d.preventDefault(), i = !0, r = d.clientX, a = d.clientY, s = g.scrollLeft, c = g.scrollTop, h.setPointerCapture(d.pointerId);
      try {
        h.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (d) => {
    if (o.has(d.pointerId) && o.set(d.pointerId, { x: d.clientX, y: d.clientY }), o.size === 2) {
      d.preventDefault();
      const k = Array.from(o.values()), S = p(k[0], k[1]);
      if (l > 0) {
        const $ = S / l;
        tt(u * $);
      }
      return;
    }
    if (!i) return;
    d.preventDefault();
    const h = (
      /** @type {HTMLElement} */
      d.target
    ), f = h.closest && h.closest("a");
    if (f && f.getAttribute && f.getAttribute("href")) return;
    const g = h.closest(".nimbi-image-preview__image-wrapper");
    if (!g) return;
    const b = d.clientX - r, y = d.clientY - a;
    g.scrollLeft = s - b, g.scrollTop = c - y;
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
function Lo(e) {
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
  const p = Vs(a, [{ path: c, name: a("home"), isIndex: !0, children: [] }]);
  async function m(b, y) {
    let k, S, $;
    try {
      ({ data: k, pagePath: S, anchor: $ } = await Wa(b, s));
    } catch (Q) {
      console.error("[nimbi-cms] fetchPageData failed", Q), Dr(t, a, Q);
      return;
    }
    !$ && y && ($ = y);
    try {
      jn(null);
    } catch (Q) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", Q);
    }
    t.innerHTML = "";
    const { article: H, parsed: K, toc: q, topH1: ee, h1Text: ue, slugKey: T } = await so(a, k, S, $, s);
    So(a, o, K, q, H, S, $, ee, ue, T, k), n.innerHTML = "", q && (n.appendChild(q), ho(q));
    try {
      await l("transformHtml", { article: H, parsed: K, toc: q, pagePath: S, anchor: $, topH1: ee, h1Text: ue, slugKey: T, data: k });
    } catch (Q) {
      console.warn("[nimbi-cms] transformHtml hooks failed", Q);
    }
    t.appendChild(H);
    try {
      oo(H);
    } catch (Q) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", Q);
    }
    try {
      Eo(H, { t: a });
    } catch (Q) {
      console.warn("[nimbi-cms] attachImagePreview failed", Q);
    }
    try {
      tn(i, 100, !1), requestAnimationFrame(() => tn(i, 100, !1)), setTimeout(() => tn(i, 100, !1), 250);
    } catch (Q) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", Q);
    }
    jn($), po(H, ee, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await l("onPageLoad", { data: k, pagePath: S, anchor: $, article: H, toc: q, topH1: ee, h1Text: ue, slugKey: T, contentWrap: t, navWrap: n });
    } catch (Q) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", Q);
    }
    u = S;
  }
  async function d() {
    let y = new URLSearchParams(location.search).get("page") || null;
    try {
      !y && history && history.state && history.state.page && (y = history.state.page);
    } catch {
    }
    try {
      if (location.hash && String(location.hash).startsWith("#/") && String(location.hash).indexOf("#/", 2) !== -1) {
        const S = String(location.hash).slice(0, String(location.hash).indexOf("#/", 2));
        try {
          history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + S);
        } catch {
        }
      }
    } catch {
    }
    let k = null;
    try {
      const S = location.hash ? String(location.hash).replace(/^#/, "") : "";
      if (S) {
        let $ = S;
        try {
          $ = decodeURIComponent(S);
        } catch {
          $ = S;
        }
        !y && $.startsWith("/") ? y = $.replace(/^\//, "") : $.startsWith("/") || (k = $);
      }
    } catch (S) {
      console.warn("[nimbi-cms] parse location.hash failed", S);
    }
    y || (y = c);
    try {
      await m(y, k);
    } catch (S) {
      console.warn("[nimbi-cms] renderByQuery failed for", y, S), Dr(t, a, S);
    }
  }
  window.addEventListener("popstate", d);
  const h = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, f = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = {
        top: b.scrollTop || 0,
        left: b.scrollLeft || 0
      };
      sessionStorage.setItem(h(), JSON.stringify(y));
    } catch {
    }
  }, g = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const y = sessionStorage.getItem(h());
      if (!y) return;
      const k = JSON.parse(y);
      k && typeof k.top == "number" && b.scrollTo({ top: k.top, left: k.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (b) => {
    if (b.persisted)
      try {
        g(), tn(i, 100, !1);
      } catch (y) {
        console.warn("[nimbi-cms] bfcache restore failed", y);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      f();
    } catch (b) {
      console.warn("[nimbi-cms] save scroll position failed", b);
    }
  }), { renderByQuery: d, siteNav: p, getCurrentPagePath: () => u };
}
function Ro(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash) {
      const a = window.location.hash, s = a.indexOf("?");
      s !== -1 && (t = a.slice(s));
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
function Co(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function zn(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let In = "";
async function Bo(e = {}) {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.info("[nimbi-cms] initCMS called", { options: e });
    } catch {
    }
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const n = Ro();
  if (n && (n.contentPath || n.homePage || n.notFoundPage || n.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (T) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", T);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (T) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", T);
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
    l10nFile: h = null,
    cacheTtlMinutes: f = 5,
    cacheMaxEntries: g,
    markdownExtensions: b,
    availableLanguages: y,
    homePage: k = "_home.md",
    notFoundPage: S = "_404.md",
    navigationPage: $ = "_navigation.md"
  } = i;
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof S == "string" && S.startsWith("./") && (S = S.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof $ == "string" && $.startsWith("./") && ($ = $.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: H = "favicon" } = i, { skipRootReadme: K = !1 } = i, q = (T) => {
    try {
      const Q = document.querySelector(r);
      Q && Q instanceof Element && (Q.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(T)}</pre></div>`);
    } catch {
    }
  };
  if (i.contentPath != null && !Co(i.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (k != null && !zn(k))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (S != null && !zn(S))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if ($ != null && !zn($))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r)
    throw new Error("el is required");
  let ee = r;
  if (typeof r == "string") {
    if (ee = document.querySelector(r), !ee) throw new Error(`el selector "${r}" did not match any element`);
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
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (f != null && (typeof f != "number" || !Number.isFinite(f) || f < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (g != null && (typeof g != "number" || !Number.isInteger(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some((T) => !T || typeof T != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((T) => typeof T != "string" || !T.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (u != null && (!Array.isArray(u) || u.some((T) => typeof T != "string" || !T.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (K != null && typeof K != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (S != null && (typeof S != "string" || !S.trim() || !/\.(md|html)$/.test(S)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ue = !!c;
  try {
    Promise.resolve().then(() => _t).then((T) => {
      try {
        T && typeof T.setSkipRootReadme == "function" && T.setSkipRootReadme(!!K);
      } catch (Q) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", Q);
      }
    }).catch((T) => {
    });
  } catch (T) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", T);
  }
  try {
    await (async () => {
      try {
        ee.classList.add("nimbi-mount");
      } catch (_) {
        console.warn("[nimbi-cms] mount element setup failed", _);
      }
      const T = document.createElement("section");
      T.className = "section";
      const Q = document.createElement("div");
      Q.className = "container nimbi-cms";
      const _e = document.createElement("div");
      _e.className = "columns";
      const re = document.createElement("div");
      re.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", re.setAttribute("role", "navigation");
      try {
        const _ = typeof Rt == "function" ? Rt("navigation") : null;
        _ && re.setAttribute("aria-label", _);
      } catch (_) {
        console.warn("[nimbi-cms] set nav aria-label failed", _);
      }
      _e.appendChild(re);
      const G = document.createElement("main");
      G.className = "column nimbi-content", G.setAttribute("role", "main"), _e.appendChild(G), Q.appendChild(_e), T.appendChild(Q);
      const C = re, V = G;
      ee.appendChild(T);
      let X = null;
      try {
        X = ee.querySelector(".nimbi-overlay"), X || (X = document.createElement("div"), X.className = "nimbi-overlay", ee.appendChild(X));
      } catch (_) {
        X = null, console.warn("[nimbi-cms] mount overlay setup failed", _);
      }
      const ge = location.pathname || "/";
      let L;
      if (ge.endsWith("/"))
        L = ge;
      else {
        const _ = ge.substring(ge.lastIndexOf("/") + 1);
        _ && !_.includes(".") ? L = ge + "/" : L = ge.substring(0, ge.lastIndexOf("/") + 1);
      }
      try {
        In = document.title || "";
      } catch (_) {
        In = "", console.warn("[nimbi-cms] read initial document title failed", _);
      }
      let R = a;
      const P = Object.prototype.hasOwnProperty.call(i, "contentPath"), x = typeof location < "u" && location.origin ? location.origin : "http://localhost", I = new URL(L, x).toString();
      (R === "." || R === "./") && (R = "");
      try {
        R = String(R || "").replace(/\\/g, "/");
      } catch {
        R = String(R || "");
      }
      R.startsWith("/") && (R = R.replace(/^\/+/, "")), R && !R.endsWith("/") && (R = R + "/");
      try {
        if (R && L && L !== "/") {
          const _ = L.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          _ && R.startsWith(_) && (R = R.slice(_.length));
        }
      } catch {
      }
      try {
        if (R)
          var M = new URL(R, I.endsWith("/") ? I : I + "/").toString();
        else
          var M = I;
      } catch {
        try {
          if (R) var M = new URL("/" + R, x).toString();
          else var M = new URL(L, x).toString();
        } catch {
          var M = x;
        }
      }
      try {
        Promise.resolve().then(() => _t).then((_) => {
          try {
            _ && typeof _.setHomePage == "function" && _.setHomePage(k);
          } catch (v) {
            console.warn("[nimbi-cms] setHomePage failed", v);
          }
        }).catch((_) => {
        });
      } catch (_) {
        console.warn("[nimbi-cms] setHomePage dynamic import failed", _);
      }
      h && await Kr(h, L), y && Array.isArray(y) && Jr(y), d && Xr(d);
      const N = Lo({ contentWrap: V, navWrap: C, container: Q, mountOverlay: X, t: Rt, contentBase: M, homePage: k, initialDocumentTitle: In, runHooks: yr });
      if (typeof f == "number" && f >= 0 && typeof Er == "function" && Er(f * 60 * 1e3), typeof g == "number" && g >= 0 && typeof Ar == "function" && Ar(g), b && Array.isArray(b) && b.length)
        try {
          b.forEach((_) => {
            typeof _ == "object" && Ri && typeof Un == "function" && Un(_);
          });
        } catch (_) {
          console.warn("[nimbi-cms] applying markdownExtensions failed", _);
        }
      try {
        typeof s == "number" && Promise.resolve().then(() => _t).then(({ setDefaultCrawlMaxQueue: _ }) => {
          try {
            _(s);
          } catch (v) {
            console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", v);
          }
        });
      } catch (_) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", _);
      }
      try {
        un(M);
      } catch (_) {
        console.warn("[nimbi-cms] setContentBase failed", _);
      }
      try {
        On(S);
      } catch (_) {
        console.warn("[nimbi-cms] setNotFoundPage failed", _);
      }
      try {
        un(M);
      } catch (_) {
        console.warn("[nimbi-cms] setContentBase failed", _);
      }
      try {
        On(S);
      } catch (_) {
        console.warn("[nimbi-cms] setNotFoundPage failed", _);
      }
      try {
        await Me(k, M);
      } catch (_) {
        throw k === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${k} not found at ${M}${k}: ${_.message}`);
      }
      ba(p), await ma(m, L);
      try {
        const _ = document.createElement("header");
        _.className = "nimbi-site-navbar", ee.insertBefore(_, T);
        const v = await Me($, M), O = await fn(v.raw || ""), { navbar: U, linkEls: W } = await fo(_, Q, O.html || "", M, k, Rt, N.renderByQuery, ue, o, l, u, H);
        try {
          await yr("onNavBuild", { navWrap: C, navbar: U, linkEls: W, contentBase: M });
        } catch (we) {
          console.warn("[nimbi-cms] onNavBuild hooks failed", we);
        }
        try {
          const we = () => {
            const me = _ && _.getBoundingClientRect && Math.round(_.getBoundingClientRect().height) || _ && _.offsetHeight || 0;
            if (me > 0) {
              try {
                ee.style.setProperty("--nimbi-site-navbar-height", `${me}px`);
              } catch (be) {
                console.warn("[nimbi-cms] set CSS var failed", be);
              }
              try {
                Q.style.paddingTop = "";
              } catch (be) {
                console.warn("[nimbi-cms] set container paddingTop failed", be);
              }
              try {
                const be = ee && ee.getBoundingClientRect && Math.round(ee.getBoundingClientRect().height) || ee && ee.clientHeight || 0;
                if (be > 0) {
                  const Ne = Math.max(0, be - me);
                  try {
                    Q.style.setProperty("--nimbi-cms-height", `${Ne}px`);
                  } catch (Ve) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ve);
                  }
                } else
                  try {
                    Q.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (Ne) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ne);
                  }
              } catch (be) {
                console.warn("[nimbi-cms] compute container height failed", be);
              }
              try {
                _.style.setProperty("--nimbi-site-navbar-height", `${me}px`);
              } catch (be) {
                console.warn("[nimbi-cms] set navbar CSS var failed", be);
              }
            }
          };
          we();
          try {
            if (typeof ResizeObserver < "u") {
              const me = new ResizeObserver(() => we());
              try {
                me.observe(_);
              } catch (be) {
                console.warn("[nimbi-cms] ResizeObserver.observe failed", be);
              }
            }
          } catch (me) {
            console.warn("[nimbi-cms] ResizeObserver setup failed", me);
          }
        } catch (we) {
          console.warn("[nimbi-cms] compute navbar height failed", we);
        }
      } catch (_) {
        console.warn("[nimbi-cms] build navigation failed", _);
      }
      await N.renderByQuery();
      try {
        Promise.resolve().then(() => Mo).then(({ getVersion: _ }) => {
          typeof _ == "function" && _().then((v) => {
            try {
              const O = v || "0.0.0";
              try {
                const U = (me) => {
                  const be = document.createElement("a");
                  be.className = "nimbi-version-label tag is-small", be.textContent = `Nimbi CMS v. ${O}`, be.href = me || "#", be.target = "_blank", be.rel = "noopener noreferrer nofollow", be.setAttribute("aria-label", `Nimbi CMS version ${O}`);
                  try {
                    Gr(be);
                  } catch {
                  }
                  try {
                    ee.appendChild(be);
                  } catch (Ne) {
                    console.warn("[nimbi-cms] append version label failed", Ne);
                  }
                }, W = "https://abelvm.github.io/nimbiCMS/", we = (() => {
                  try {
                    if (W && typeof W == "string")
                      return new URL(W).toString();
                  } catch {
                  }
                  return "#";
                })();
                U(we);
              } catch (U) {
                console.warn("[nimbi-cms] building version label failed", U);
              }
            } catch (O) {
              console.warn("[nimbi-cms] building version label failed", O);
            }
          }).catch((v) => {
            console.warn("[nimbi-cms] getVersion() failed", v);
          });
        }).catch((_) => {
          console.warn("[nimbi-cms] import version module failed", _);
        });
      } catch (_) {
        console.warn("[nimbi-cms] version label setup failed", _);
      }
    })();
  } catch (T) {
    throw q(T), T;
  }
}
async function To() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const Mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: To
}, Symbol.toStringTag, { value: "Module" }));
export {
  Fr as BAD_LANGUAGES,
  le as SUPPORTED_HLJS_MAP,
  Io as _clearHooks,
  Wn as addHook,
  Bo as default,
  ma as ensureBulma,
  To as getVersion,
  Bo as initCMS,
  Kr as loadL10nFile,
  Zr as loadSupportedLanguages,
  fa as observeCodeBlocks,
  $o as onNavBuild,
  Po as onPageLoad,
  Dt as registerLanguage,
  yr as runHooks,
  No as setHighlightTheme,
  Xr as setLang,
  ba as setStyle,
  Oo as setThemeVars,
  Rt as t,
  zo as transformHtml
};
