let wr = 0;
const li = /* @__PURE__ */ Object.create(null);
function ci(e) {
  try {
    const t = Number(e);
    wr = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    wr = 0;
  }
}
function Ft(e = 1) {
  try {
    return Number(wr) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function Pr() {
  return Ft(1);
}
function Fn(...e) {
  try {
    Ft(1) && console && typeof console.error == "function" && console.error(...e);
  } catch {
  }
}
function _(...e) {
  try {
    Ft(2) && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Mt(...e) {
  try {
    Ft(3) && console && typeof console.info == "function" && console.info(...e);
  } catch {
  }
}
function _t(...e) {
  try {
    Ft(3) && console && typeof console.log == "function" && console.log(...e);
  } catch {
  }
}
function Ni(e) {
  try {
    if (!Pr()) return;
    const t = String(e || "");
    if (!t) return;
    li[t] = (li[t] || 0) + 1;
  } catch {
  }
}
function Bi(e) {
  try {
    if (typeof globalThis > "u" || !globalThis.__nimbiCMSDebug) return;
    const t = String(e || "");
    if (!t) return;
    try {
      globalThis.__nimbiCMSDebug[t] = (globalThis.__nimbiCMSDebug[t] || 0) + 1;
    } catch {
    }
  } catch {
  }
}
const yn = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function $r(e, t) {
  if (!Object.prototype.hasOwnProperty.call(yn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  yn[e].push(t);
}
function Al(e) {
  $r("onPageLoad", e);
}
function El(e) {
  $r("onNavBuild", e);
}
function Ll(e) {
  $r("transformHtml", e);
}
async function ui(e, t) {
  const n = yn[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      try {
        _("[nimbi-cms] runHooks callback failed", r);
      } catch {
      }
    }
}
function Ml() {
  Object.keys(yn).forEach((e) => {
    yn[e].length = 0;
  });
}
function qi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ur, hi;
function es() {
  if (hi) return ur;
  hi = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((T) => {
      const F = x[T], pe = typeof F;
      (pe === "object" || pe === "function") && !Object.isFrozen(F) && e(F);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(T) {
      T.data === void 0 && (T.data = {}), this.data = T.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...T) {
    const F = /* @__PURE__ */ Object.create(null);
    for (const pe in x)
      F[pe] = x[pe];
    return T.forEach(function(pe) {
      for (const ze in pe)
        F[ze] = pe[ze];
    }), /** @type {T} */
    F;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: T }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const F = x.split(".");
      return [
        `${T}${F.shift()}`,
        ...F.map((pe, ze) => `${pe}${"_".repeat(ze + 1)}`)
      ].join(" ");
    }
    return `${T}${x}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(T, F) {
      this.buffer = "", this.classPrefix = F.classPrefix, T.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(T) {
      this.buffer += n(T);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(T) {
      if (!a(T)) return;
      const F = s(
        T.scope,
        { prefix: this.classPrefix }
      );
      this.span(F);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(T) {
      a(T) && (this.buffer += r);
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
    span(T) {
      this.buffer += `<span class="${T}">`;
    }
  }
  const o = (x = {}) => {
    const T = { children: [] };
    return Object.assign(T, x), T;
  };
  class f {
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
    add(T) {
      this.top.children.push(T);
    }
    /** @param {string} scope */
    openNode(T) {
      const F = o({ scope: T });
      this.add(F), this.stack.push(F);
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
    walk(T) {
      return this.constructor._walk(T, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(T, F) {
      return typeof F == "string" ? T.addText(F) : F.children && (T.openNode(F), F.children.forEach((pe) => this._walk(T, pe)), T.closeNode(F)), T;
    }
    /**
     * @param {Node} node
     */
    static _collapse(T) {
      typeof T != "string" && T.children && (T.children.every((F) => typeof F == "string") ? T.children = [T.children.join("")] : T.children.forEach((F) => {
        f._collapse(F);
      }));
    }
  }
  class c extends f {
    /**
     * @param {*} options
     */
    constructor(T) {
      super(), this.options = T;
    }
    /**
     * @param {string} text
     */
    addText(T) {
      T !== "" && this.add(T);
    }
    /** @param {string} scope */
    startScope(T) {
      this.openNode(T);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(T, F) {
      const pe = T.root;
      F && (pe.scope = `language:${F}`), this.add(pe);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function h(x) {
    return g("(?=", x, ")");
  }
  function m(x) {
    return g("(?:", x, ")*");
  }
  function d(x) {
    return g("(?:", x, ")?");
  }
  function g(...x) {
    return x.map((F) => u(F)).join("");
  }
  function y(x) {
    const T = x[x.length - 1];
    return typeof T == "object" && T.constructor === Object ? (x.splice(x.length - 1, 1), T) : {};
  }
  function p(...x) {
    return "(" + (y(x).capture ? "" : "?:") + x.map((pe) => u(pe)).join("|") + ")";
  }
  function w(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function b(x, T) {
    const F = x && x.exec(T);
    return F && F.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: T }) {
    let F = 0;
    return x.map((pe) => {
      F += 1;
      const ze = F;
      let Ie = u(pe), te = "";
      for (; Ie.length > 0; ) {
        const Y = k.exec(Ie);
        if (!Y) {
          te += Ie;
          break;
        }
        te += Ie.substring(0, Y.index), Ie = Ie.substring(Y.index + Y[0].length), Y[0][0] === "\\" && Y[1] ? te += "\\" + String(Number(Y[1]) + ze) : (te += Y[0], Y[0] === "(" && F++);
      }
      return te;
    }).map((pe) => `(${pe})`).join(T);
  }
  const v = /\b\B/, R = "[a-zA-Z]\\w*", W = "[a-zA-Z_]\\w*", I = "\\b\\d+(\\.\\d+)?", H = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", M = "\\b(0b[01]+)", $ = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", K = (x = {}) => {
    const T = /^#![ ]*\//;
    return x.binary && (x.begin = g(
      T,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: T,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (F, pe) => {
        F.index !== 0 && pe.ignoreMatch();
      }
    }, x);
  }, Z = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, he = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Z]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Z]
  }, U = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, J = function(x, T, F = {}) {
    const pe = i(
      {
        scope: "comment",
        begin: x,
        end: T,
        contains: []
      },
      F
    );
    pe.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const ze = p(
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
    return pe.contains.push(
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
          ze,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), pe;
  }, be = J("//", "$"), ee = J("/\\*", "\\*/"), ue = J("#", "$"), Ae = {
    scope: "number",
    begin: I,
    relevance: 0
  }, E = {
    scope: "number",
    begin: H,
    relevance: 0
  }, B = {
    scope: "number",
    begin: M,
    relevance: 0
  }, C = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Z,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Z]
      }
    ]
  }, q = {
    scope: "title",
    begin: R,
    relevance: 0
  }, P = {
    scope: "title",
    begin: W,
    relevance: 0
  }, D = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + W,
    relevance: 0
  };
  var O = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: he,
    BACKSLASH_ESCAPE: Z,
    BINARY_NUMBER_MODE: B,
    BINARY_NUMBER_RE: M,
    COMMENT: J,
    C_BLOCK_COMMENT_MODE: ee,
    C_LINE_COMMENT_MODE: be,
    C_NUMBER_MODE: E,
    C_NUMBER_RE: H,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (T, F) => {
            F.data._beginMatch = T[1];
          },
          /** @type {ModeCallback} */
          "on:end": (T, F) => {
            F.data._beginMatch !== T[1] && F.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ue,
    IDENT_RE: R,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: D,
    NUMBER_MODE: Ae,
    NUMBER_RE: I,
    PHRASAL_WORDS_MODE: U,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: C,
    RE_STARTERS_RE: $,
    SHEBANG: K,
    TITLE_MODE: q,
    UNDERSCORE_IDENT_RE: W,
    UNDERSCORE_TITLE_MODE: P
  });
  function V(x, T) {
    x.input[x.index - 1] === "." && T.ignoreMatch();
  }
  function se(x, T) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function me(x, T) {
    T && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = V, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function G(x, T) {
    Array.isArray(x.illegal) && (x.illegal = p(...x.illegal));
  }
  function j(x, T) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function z(x, T) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const xe = (x, T) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const F = Object.assign({}, x);
    Object.keys(x).forEach((pe) => {
      delete x[pe];
    }), x.keywords = F.keywords, x.begin = g(F.beforeMatch, h(F.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(F, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete F.beforeMatch;
  }, De = [
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
  ], Se = "keyword";
  function Ne(x, T, F = Se) {
    const pe = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? ze(F, x.split(" ")) : Array.isArray(x) ? ze(F, x) : Object.keys(x).forEach(function(Ie) {
      Object.assign(
        pe,
        Ne(x[Ie], T, Ie)
      );
    }), pe;
    function ze(Ie, te) {
      T && (te = te.map((Y) => Y.toLowerCase())), te.forEach(function(Y) {
        const de = Y.split("|");
        pe[de[0]] = [Ie, Je(de[0], de[1])];
      });
    }
  }
  function Je(x, T) {
    return T ? Number(T) : Kt(x) ? 0 : 1;
  }
  function Kt(x) {
    return De.includes(x.toLowerCase());
  }
  const ht = {}, Ue = (x) => {
    console.error(x);
  }, st = (x, ...T) => {
    console.log(`WARN: ${x}`, ...T);
  }, et = (x, T) => {
    ht[`${x}/${T}`] || (console.log(`Deprecated as of ${x}. ${T}`), ht[`${x}/${T}`] = !0);
  }, zt = new Error();
  function Vt(x, T, { key: F }) {
    let pe = 0;
    const ze = x[F], Ie = {}, te = {};
    for (let Y = 1; Y <= T.length; Y++)
      te[Y + pe] = ze[Y], Ie[Y + pe] = !0, pe += w(T[Y - 1]);
    x[F] = te, x[F]._emit = Ie, x[F]._multi = !0;
  }
  function xt(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Ue("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), zt;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Ue("beginScope must be object"), zt;
      Vt(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function Ma(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Ue("skip, excludeEnd, returnEnd not compatible with endScope: {}"), zt;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Ue("endScope must be object"), zt;
      Vt(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Ta(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Ra(x) {
    Ta(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), xt(x), Ma(x);
  }
  function Ca(x) {
    function T(te, Y) {
      return new RegExp(
        u(te),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (Y ? "g" : "")
      );
    }
    class F {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(Y, de) {
        de.position = this.position++, this.matchIndexes[this.matchAt] = de, this.regexes.push([de, Y]), this.matchAt += w(Y) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const Y = this.regexes.map((de) => de[1]);
        this.matcherRe = T(S(Y, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(Y) {
        this.matcherRe.lastIndex = this.lastIndex;
        const de = this.matcherRe.exec(Y);
        if (!de)
          return null;
        const Fe = de.findIndex((Yt, ir) => ir > 0 && Yt !== void 0), Be = this.matchIndexes[Fe];
        return de.splice(0, Fe), Object.assign(de, Be);
      }
    }
    class pe {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(Y) {
        if (this.multiRegexes[Y]) return this.multiRegexes[Y];
        const de = new F();
        return this.rules.slice(Y).forEach(([Fe, Be]) => de.addRule(Fe, Be)), de.compile(), this.multiRegexes[Y] = de, de;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(Y, de) {
        this.rules.push([Y, de]), de.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(Y) {
        const de = this.getMatcher(this.regexIndex);
        de.lastIndex = this.lastIndex;
        let Fe = de.exec(Y);
        if (this.resumingScanAtSamePosition() && !(Fe && Fe.index === this.lastIndex)) {
          const Be = this.getMatcher(0);
          Be.lastIndex = this.lastIndex + 1, Fe = Be.exec(Y);
        }
        return Fe && (this.regexIndex += Fe.position + 1, this.regexIndex === this.count && this.considerAll()), Fe;
      }
    }
    function ze(te) {
      const Y = new pe();
      return te.contains.forEach((de) => Y.addRule(de.begin, { rule: de, type: "begin" })), te.terminatorEnd && Y.addRule(te.terminatorEnd, { type: "end" }), te.illegal && Y.addRule(te.illegal, { type: "illegal" }), Y;
    }
    function Ie(te, Y) {
      const de = (
        /** @type CompiledMode */
        te
      );
      if (te.isCompiled) return de;
      [
        se,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        j,
        Ra,
        xe
      ].forEach((Be) => Be(te, Y)), x.compilerExtensions.forEach((Be) => Be(te, Y)), te.__beforeBegin = null, [
        me,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        G,
        // default to 1 relevance if not specified
        z
      ].forEach((Be) => Be(te, Y)), te.isCompiled = !0;
      let Fe = null;
      return typeof te.keywords == "object" && te.keywords.$pattern && (te.keywords = Object.assign({}, te.keywords), Fe = te.keywords.$pattern, delete te.keywords.$pattern), Fe = Fe || /\w+/, te.keywords && (te.keywords = Ne(te.keywords, x.case_insensitive)), de.keywordPatternRe = T(Fe, !0), Y && (te.begin || (te.begin = /\B|\b/), de.beginRe = T(de.begin), !te.end && !te.endsWithParent && (te.end = /\B|\b/), te.end && (de.endRe = T(de.end)), de.terminatorEnd = u(de.end) || "", te.endsWithParent && Y.terminatorEnd && (de.terminatorEnd += (te.end ? "|" : "") + Y.terminatorEnd)), te.illegal && (de.illegalRe = T(
        /** @type {RegExp | string} */
        te.illegal
      )), te.contains || (te.contains = []), te.contains = [].concat(...te.contains.map(function(Be) {
        return Pa(Be === "self" ? te : Be);
      })), te.contains.forEach(function(Be) {
        Ie(
          /** @type Mode */
          Be,
          de
        );
      }), te.starts && Ie(te.starts, Y), de.matcher = ze(de), de;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), Ie(
      /** @type Mode */
      x
    );
  }
  function Kr(x) {
    return x ? x.endsWithParent || Kr(x.starts) : !1;
  }
  function Pa(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(T) {
      return i(x, { variants: null }, T);
    })), x.cachedVariants ? x.cachedVariants : Kr(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var $a = "11.11.1";
  class za extends Error {
    constructor(T, F) {
      super(T), this.name = "HTMLInjectionError", this.html = F;
    }
  }
  const rr = n, Vr = i, Yr = /* @__PURE__ */ Symbol("nomatch"), Ia = 7, Jr = function(x) {
    const T = /* @__PURE__ */ Object.create(null), F = /* @__PURE__ */ Object.create(null), pe = [];
    let ze = !0;
    const Ie = "Could not find the language '{}', did you forget to load/include a language module?", te = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let Y = {
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
    function de(N) {
      return Y.noHighlightRe.test(N);
    }
    function Fe(N) {
      let le = N.className + " ";
      le += N.parentNode ? N.parentNode.className : "";
      const ve = Y.languageDetectRe.exec(le);
      if (ve) {
        const Pe = At(ve[1]);
        return Pe || (st(Ie.replace("{}", ve[1])), st("Falling back to no-highlight mode for this block.", N)), Pe ? ve[1] : "no-highlight";
      }
      return le.split(/\s+/).find((Pe) => de(Pe) || At(Pe));
    }
    function Be(N, le, ve) {
      let Pe = "", je = "";
      typeof le == "object" ? (Pe = N, ve = le.ignoreIllegals, je = le.language) : (et("10.7.0", "highlight(lang, code, ...args) has been deprecated."), et("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), je = N, Pe = le), ve === void 0 && (ve = !0);
      const dt = {
        code: Pe,
        language: je
      };
      Tn("before:highlight", dt);
      const Et = dt.result ? dt.result : Yt(dt.language, dt.code, ve);
      return Et.code = dt.code, Tn("after:highlight", Et), Et;
    }
    function Yt(N, le, ve, Pe) {
      const je = /* @__PURE__ */ Object.create(null);
      function dt(Q, oe) {
        return Q.keywords[oe];
      }
      function Et() {
        if (!ge.keywords) {
          We.addText($e);
          return;
        }
        let Q = 0;
        ge.keywordPatternRe.lastIndex = 0;
        let oe = ge.keywordPatternRe.exec($e), ye = "";
        for (; oe; ) {
          ye += $e.substring(Q, oe.index);
          const Re = mt.case_insensitive ? oe[0].toLowerCase() : oe[0], Ze = dt(ge, Re);
          if (Ze) {
            const [St, Ya] = Ze;
            if (We.addText(ye), ye = "", je[Re] = (je[Re] || 0) + 1, je[Re] <= Ia && (Pn += Ya), St.startsWith("_"))
              ye += oe[0];
            else {
              const Ja = mt.classNameAliases[St] || St;
              gt(oe[0], Ja);
            }
          } else
            ye += oe[0];
          Q = ge.keywordPatternRe.lastIndex, oe = ge.keywordPatternRe.exec($e);
        }
        ye += $e.substring(Q), We.addText(ye);
      }
      function Rn() {
        if ($e === "") return;
        let Q = null;
        if (typeof ge.subLanguage == "string") {
          if (!T[ge.subLanguage]) {
            We.addText($e);
            return;
          }
          Q = Yt(ge.subLanguage, $e, !0, oi[ge.subLanguage]), oi[ge.subLanguage] = /** @type {CompiledMode} */
          Q._top;
        } else
          Q = ar($e, ge.subLanguage.length ? ge.subLanguage : null);
        ge.relevance > 0 && (Pn += Q.relevance), We.__addSublanguage(Q._emitter, Q.language);
      }
      function nt() {
        ge.subLanguage != null ? Rn() : Et(), $e = "";
      }
      function gt(Q, oe) {
        Q !== "" && (We.startScope(oe), We.addText(Q), We.endScope());
      }
      function ri(Q, oe) {
        let ye = 1;
        const Re = oe.length - 1;
        for (; ye <= Re; ) {
          if (!Q._emit[ye]) {
            ye++;
            continue;
          }
          const Ze = mt.classNameAliases[Q[ye]] || Q[ye], St = oe[ye];
          Ze ? gt(St, Ze) : ($e = St, Et(), $e = ""), ye++;
        }
      }
      function ii(Q, oe) {
        return Q.scope && typeof Q.scope == "string" && We.openNode(mt.classNameAliases[Q.scope] || Q.scope), Q.beginScope && (Q.beginScope._wrap ? (gt($e, mt.classNameAliases[Q.beginScope._wrap] || Q.beginScope._wrap), $e = "") : Q.beginScope._multi && (ri(Q.beginScope, oe), $e = "")), ge = Object.create(Q, { parent: { value: ge } }), ge;
      }
      function ai(Q, oe, ye) {
        let Re = b(Q.endRe, ye);
        if (Re) {
          if (Q["on:end"]) {
            const Ze = new t(Q);
            Q["on:end"](oe, Ze), Ze.isMatchIgnored && (Re = !1);
          }
          if (Re) {
            for (; Q.endsParent && Q.parent; )
              Q = Q.parent;
            return Q;
          }
        }
        if (Q.endsWithParent)
          return ai(Q.parent, oe, ye);
      }
      function Ga(Q) {
        return ge.matcher.regexIndex === 0 ? ($e += Q[0], 1) : (cr = !0, 0);
      }
      function Qa(Q) {
        const oe = Q[0], ye = Q.rule, Re = new t(ye), Ze = [ye.__beforeBegin, ye["on:begin"]];
        for (const St of Ze)
          if (St && (St(Q, Re), Re.isMatchIgnored))
            return Ga(oe);
        return ye.skip ? $e += oe : (ye.excludeBegin && ($e += oe), nt(), !ye.returnBegin && !ye.excludeBegin && ($e = oe)), ii(ye, Q), ye.returnBegin ? 0 : oe.length;
      }
      function Xa(Q) {
        const oe = Q[0], ye = le.substring(Q.index), Re = ai(ge, Q, ye);
        if (!Re)
          return Yr;
        const Ze = ge;
        ge.endScope && ge.endScope._wrap ? (nt(), gt(oe, ge.endScope._wrap)) : ge.endScope && ge.endScope._multi ? (nt(), ri(ge.endScope, Q)) : Ze.skip ? $e += oe : (Ze.returnEnd || Ze.excludeEnd || ($e += oe), nt(), Ze.excludeEnd && ($e = oe));
        do
          ge.scope && We.closeNode(), !ge.skip && !ge.subLanguage && (Pn += ge.relevance), ge = ge.parent;
        while (ge !== Re.parent);
        return Re.starts && ii(Re.starts, Q), Ze.returnEnd ? 0 : oe.length;
      }
      function Ka() {
        const Q = [];
        for (let oe = ge; oe !== mt; oe = oe.parent)
          oe.scope && Q.unshift(oe.scope);
        Q.forEach((oe) => We.openNode(oe));
      }
      let Cn = {};
      function si(Q, oe) {
        const ye = oe && oe[0];
        if ($e += Q, ye == null)
          return nt(), 0;
        if (Cn.type === "begin" && oe.type === "end" && Cn.index === oe.index && ye === "") {
          if ($e += le.slice(oe.index, oe.index + 1), !ze) {
            const Re = new Error(`0 width match regex (${N})`);
            throw Re.languageName = N, Re.badRule = Cn.rule, Re;
          }
          return 1;
        }
        if (Cn = oe, oe.type === "begin")
          return Qa(oe);
        if (oe.type === "illegal" && !ve) {
          const Re = new Error('Illegal lexeme "' + ye + '" for mode "' + (ge.scope || "<unnamed>") + '"');
          throw Re.mode = ge, Re;
        } else if (oe.type === "end") {
          const Re = Xa(oe);
          if (Re !== Yr)
            return Re;
        }
        if (oe.type === "illegal" && ye === "")
          return $e += `
`, 1;
        if (lr > 1e5 && lr > oe.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return $e += ye, ye.length;
      }
      const mt = At(N);
      if (!mt)
        throw Ue(Ie.replace("{}", N)), new Error('Unknown language: "' + N + '"');
      const Va = Ca(mt);
      let or = "", ge = Pe || Va;
      const oi = {}, We = new Y.__emitter(Y);
      Ka();
      let $e = "", Pn = 0, It = 0, lr = 0, cr = !1;
      try {
        if (mt.__emitTokens)
          mt.__emitTokens(le, We);
        else {
          for (ge.matcher.considerAll(); ; ) {
            lr++, cr ? cr = !1 : ge.matcher.considerAll(), ge.matcher.lastIndex = It;
            const Q = ge.matcher.exec(le);
            if (!Q) break;
            const oe = le.substring(It, Q.index), ye = si(oe, Q);
            It = Q.index + ye;
          }
          si(le.substring(It));
        }
        return We.finalize(), or = We.toHTML(), {
          language: N,
          value: or,
          relevance: Pn,
          illegal: !1,
          _emitter: We,
          _top: ge
        };
      } catch (Q) {
        if (Q.message && Q.message.includes("Illegal"))
          return {
            language: N,
            value: rr(le),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: Q.message,
              index: It,
              context: le.slice(It - 100, It + 100),
              mode: Q.mode,
              resultSoFar: or
            },
            _emitter: We
          };
        if (ze)
          return {
            language: N,
            value: rr(le),
            illegal: !1,
            relevance: 0,
            errorRaised: Q,
            _emitter: We,
            _top: ge
          };
        throw Q;
      }
    }
    function ir(N) {
      const le = {
        value: rr(N),
        illegal: !1,
        relevance: 0,
        _top: te,
        _emitter: new Y.__emitter(Y)
      };
      return le._emitter.addText(N), le;
    }
    function ar(N, le) {
      le = le || Y.languages || Object.keys(T);
      const ve = ir(N), Pe = le.filter(At).filter(ni).map(
        (nt) => Yt(nt, N, !1)
      );
      Pe.unshift(ve);
      const je = Pe.sort((nt, gt) => {
        if (nt.relevance !== gt.relevance) return gt.relevance - nt.relevance;
        if (nt.language && gt.language) {
          if (At(nt.language).supersetOf === gt.language)
            return 1;
          if (At(gt.language).supersetOf === nt.language)
            return -1;
        }
        return 0;
      }), [dt, Et] = je, Rn = dt;
      return Rn.secondBest = Et, Rn;
    }
    function Oa(N, le, ve) {
      const Pe = le && F[le] || ve;
      N.classList.add("hljs"), N.classList.add(`language-${Pe}`);
    }
    function sr(N) {
      let le = null;
      const ve = Fe(N);
      if (de(ve)) return;
      if (Tn(
        "before:highlightElement",
        { el: N, language: ve }
      ), N.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", N);
        return;
      }
      if (N.children.length > 0 && (Y.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(N)), Y.throwUnescapedHTML))
        throw new za(
          "One of your code blocks includes unescaped HTML.",
          N.innerHTML
        );
      le = N;
      const Pe = le.textContent, je = ve ? Be(Pe, { language: ve, ignoreIllegals: !0 }) : ar(Pe);
      N.innerHTML = je.value, N.dataset.highlighted = "yes", Oa(N, ve, je.language), N.result = {
        language: je.language,
        // TODO: remove with version 11.0
        re: je.relevance,
        relevance: je.relevance
      }, je.secondBest && (N.secondBest = {
        language: je.secondBest.language,
        relevance: je.secondBest.relevance
      }), Tn("after:highlightElement", { el: N, result: je, text: Pe });
    }
    function Na(N) {
      Y = Vr(Y, N);
    }
    const Ba = () => {
      Mn(), et("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function qa() {
      Mn(), et("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ei = !1;
    function Mn() {
      function N() {
        Mn();
      }
      if (document.readyState === "loading") {
        ei || window.addEventListener("DOMContentLoaded", N, !1), ei = !0;
        return;
      }
      document.querySelectorAll(Y.cssSelector).forEach(sr);
    }
    function Da(N, le) {
      let ve = null;
      try {
        ve = le(x);
      } catch (Pe) {
        if (Ue("Language definition for '{}' could not be registered.".replace("{}", N)), ze)
          Ue(Pe);
        else
          throw Pe;
        ve = te;
      }
      ve.name || (ve.name = N), T[N] = ve, ve.rawDefinition = le.bind(null, x), ve.aliases && ti(ve.aliases, { languageName: N });
    }
    function ja(N) {
      delete T[N];
      for (const le of Object.keys(F))
        F[le] === N && delete F[le];
    }
    function Ha() {
      return Object.keys(T);
    }
    function At(N) {
      return N = (N || "").toLowerCase(), T[N] || T[F[N]];
    }
    function ti(N, { languageName: le }) {
      typeof N == "string" && (N = [N]), N.forEach((ve) => {
        F[ve.toLowerCase()] = le;
      });
    }
    function ni(N) {
      const le = At(N);
      return le && !le.disableAutodetect;
    }
    function Ua(N) {
      N["before:highlightBlock"] && !N["before:highlightElement"] && (N["before:highlightElement"] = (le) => {
        N["before:highlightBlock"](
          Object.assign({ block: le.el }, le)
        );
      }), N["after:highlightBlock"] && !N["after:highlightElement"] && (N["after:highlightElement"] = (le) => {
        N["after:highlightBlock"](
          Object.assign({ block: le.el }, le)
        );
      });
    }
    function Fa(N) {
      Ua(N), pe.push(N);
    }
    function Wa(N) {
      const le = pe.indexOf(N);
      le !== -1 && pe.splice(le, 1);
    }
    function Tn(N, le) {
      const ve = N;
      pe.forEach(function(Pe) {
        Pe[ve] && Pe[ve](le);
      });
    }
    function Za(N) {
      return et("10.7.0", "highlightBlock will be removed entirely in v12.0"), et("10.7.0", "Please use highlightElement now."), sr(N);
    }
    Object.assign(x, {
      highlight: Be,
      highlightAuto: ar,
      highlightAll: Mn,
      highlightElement: sr,
      // TODO: Remove with v12 API
      highlightBlock: Za,
      configure: Na,
      initHighlighting: Ba,
      initHighlightingOnLoad: qa,
      registerLanguage: Da,
      unregisterLanguage: ja,
      listLanguages: Ha,
      getLanguage: At,
      registerAliases: ti,
      autoDetection: ni,
      inherit: Vr,
      addPlugin: Fa,
      removePlugin: Wa
    }), x.debugMode = function() {
      ze = !1;
    }, x.safeMode = function() {
      ze = !0;
    }, x.versionString = $a, x.regex = {
      concat: g,
      lookahead: h,
      either: p,
      optional: d,
      anyNumberOfTimes: m
    };
    for (const N in O)
      typeof O[N] == "object" && e(O[N]);
    return Object.assign(x, O), x;
  }, Wt = Jr({});
  return Wt.newInstance = () => Jr({}), ur = Wt, Wt.HighlightJS = Wt, Wt.default = Wt, ur;
}
var ts = /* @__PURE__ */ es();
const Me = /* @__PURE__ */ qi(ts), ns = "11.11.1", _e = /* @__PURE__ */ new Map(), rs = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", at = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
at.html = "xml";
at.xhtml = "xml";
at.markup = "xml";
const Di = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Rt = null;
const hr = /* @__PURE__ */ new Map(), is = 300 * 1e3;
async function ji(e = rs) {
  if (e)
    return Rt || (Rt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let f = 0; f < i.length; f++)
          if (/\|\s*Language\s*\|/i.test(i[f])) {
            r = f;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((f) => f.trim().toLowerCase());
        let s = a.findIndex((f) => /alias|aliases|equivalent|alt|alternates?/i.test(f));
        s === -1 && (s = 1);
        let l = a.findIndex((f) => /file|filename|module|module name|module-name|short|slug/i.test(f));
        if (l === -1) {
          const f = a.findIndex((c) => /language/i.test(c));
          l = f !== -1 ? f : 0;
        }
        let o = [];
        for (let f = r + 1; f < i.length; f++) {
          const c = i[f].trim();
          if (!c || !c.startsWith("|")) break;
          const u = c.replace(/^\||\|$/g, "").split("|").map((y) => y.trim());
          if (u.every((y) => /^-+$/.test(y))) continue;
          const h = u;
          if (!h.length) continue;
          const d = (h[l] || h[0] || "").toString().trim().toLowerCase();
          if (!d || /^-+$/.test(d)) continue;
          _e.set(d, d);
          const g = h[s] || "";
          if (g) {
            const y = String(g).split(",").map((p) => p.replace(/`/g, "").trim()).filter(Boolean);
            if (y.length) {
              const w = y[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (_e.set(w, w), o.push(w));
            }
          }
        }
        try {
          const f = [];
          for (const c of o) {
            const u = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? f.push(u) : _e.delete(c);
          }
          o = f;
        } catch (f) {
          _("[codeblocksManager] cleanup aliases failed", f);
        }
        try {
          let f = 0;
          for (const c of Array.from(_e.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              _e.delete(c), f++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const h = _e.get(c);
                _e.delete(c), _e.set(u, h);
              } else
                _e.delete(c), f++;
            }
          }
          for (const [c, u] of Array.from(_e.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (_e.delete(c), f++);
          try {
            const c = ":---------------------";
            _e.has(c) && (_e.delete(c), f++);
          } catch (c) {
            _("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(_e.keys()).sort();
          } catch (c) {
            _("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (f) {
          _("[codeblocksManager] ignored error", f);
        }
      } catch (t) {
        _("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Rt);
}
const Jt = /* @__PURE__ */ new Set();
async function bn(e, t) {
  if (Rt || (async () => {
    try {
      await ji();
    } catch (r) {
      _("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Rt)
    try {
      await Rt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Di.has(n)) return !1;
  if (_e.size && !_e.has(n)) {
    const r = at;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Jt.has(e)) return !0;
  const i = at;
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
    _e.size && (l = l.filter((c) => {
      if (_e.has(c)) return !0;
      const u = at[c];
      return !!(u && _e.has(u));
    }));
    let o = null, f = null;
    for (const c of l)
      try {
        const u = Date.now();
        let h = hr.get(c);
        if (h && h.ok === !1 && u - (h.ts || 0) >= is && (hr.delete(c), h = void 0), h) {
          if (h.module)
            o = h.module;
          else if (h.promise)
            try {
              o = await h.promise;
            } catch {
              o = null;
            }
        } else {
          const m = { promise: null, module: null, ok: null, ts: 0 };
          hr.set(c, m), m.promise = (async () => {
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
            o = await m.promise, m.module = o, m.ok = !!o, m.ts = Date.now();
          } catch {
            m.module = null, m.ok = !1, m.ts = Date.now(), o = null;
          }
        }
        if (o) {
          const m = o.default || o;
          try {
            const d = _e.size && _e.get(e) || c || e;
            return Me.registerLanguage(d, m), Jt.add(d), d !== e && (Me.registerLanguage(e, m), Jt.add(e)), !0;
          } catch (d) {
            f = d;
          }
        } else
          try {
            if (_e.has(c) || _e.has(e)) {
              const m = () => ({});
              try {
                Me.registerLanguage(c, m), Jt.add(c);
              } catch {
              }
              try {
                c !== e && (Me.registerLanguage(e, m), Jt.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        f = u;
      }
    if (f)
      throw f;
    return !1;
  } catch {
    return !1;
  }
}
let $n = null;
function as(e = document) {
  Rt || (async () => {
    try {
      await ji();
    } catch (a) {
      _("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = at, i = $n || (typeof IntersectionObserver > "u" ? null : ($n = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (f) {
        _("[codeblocksManager] observer unobserve failed", f);
      }
      (async () => {
        try {
          const f = o.getAttribute && o.getAttribute("class") || o.className || "", c = f.match(/language-([a-zA-Z0-9_+-]+)/) || f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const u = (c[1] || "").toLowerCase(), h = t[u] || u, m = _e.size && (_e.get(h) || _e.get(String(h).toLowerCase())) || h;
            try {
              await bn(m);
            } catch (d) {
              _("[codeblocksManager] registerLanguage failed", d);
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
              Me.highlightElement(o);
            } catch (d) {
              _("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const u = o.textContent || "";
              try {
                if (Me && typeof Me.getLanguage == "function" && Me.getLanguage("plaintext")) {
                  const h = Me.highlight(u, { language: "plaintext" });
                  h && h.value && (o.innerHTML = h.value);
                }
              } catch {
                try {
                  Me.highlightElement(o);
                } catch (m) {
                  _("[codeblocksManager] fallback highlightElement failed", m);
                }
              }
            } catch (u) {
              _("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (f) {
          _("[codeblocksManager] observer entry processing failed", f);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), $n)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), f = t[o] || o, c = _e.size && (_e.get(f) || _e.get(String(f).toLowerCase())) || f;
          try {
            await bn(c);
          } catch (u) {
            _("[codeblocksManager] registerLanguage failed (no observer)", u);
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
          Me.highlightElement(a);
        } catch (o) {
          _("[codeblocksManager] hljs.highlightElement failed (no observer)", o);
        }
      } catch (s) {
        _("[codeblocksManager] loadSupportedLanguages fallback ignored error", s);
      }
    });
    return;
  }
  r.forEach((a) => {
    try {
      i.observe(a);
    } catch (s) {
      _("[codeblocksManager] observe failed", s);
    }
  });
}
function Tl(e, { useCdn: t = !0 } = {}) {
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
    try {
      _("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${ns}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let Ot = "light";
function ss(e, t = {}) {
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
function di() {
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
async function os(e = "none", t = "/") {
  try {
    _t("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      const r = [
        location && location.protocol && location.protocol === "file:" ? "https://unpkg.com/bulma/css/bulma.min.css" : "//unpkg.com/bulma/css/bulma.min.css",
        "https://unpkg.com/bulma/css/bulma.min.css"
      ];
      let a = !1;
      for (const s of r)
        try {
          if (document.querySelector(`link[href="${s}"]`)) {
            a = !0;
            break;
          }
        } catch {
        }
      if (!a) {
        const s = r[0], l = document.createElement("link");
        l.rel = "stylesheet", l.href = s, l.setAttribute("data-bulma-base", "1");
        const o = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        o && o.parentNode ? o.parentNode.insertBefore(l, o) : document.head.appendChild(l);
      }
    } catch {
    }
    try {
      const r = Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));
      for (const a of r)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    try {
      const r = Array.from(document.querySelectorAll("style[data-bulma-override]"));
      for (const a of r)
        a && a.parentNode && a.parentNode.removeChild(a);
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], i = Array.from(new Set(n));
  if (e === "local") {
    if (di(), document.querySelector("style[data-bulma-override]")) return;
    for (const r of i)
      try {
        const a = await fetch(r, { method: "GET" });
        if (a.ok) {
          const s = await a.text(), l = document.createElement("style");
          l.setAttribute("data-bulma-override", r), l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + s)), document.head.appendChild(l);
          return;
        }
      } catch (a) {
        _("[bulmaManager] fetch local bulma candidate failed", a);
      }
    return;
  }
  try {
    const r = String(e).trim();
    if (!r) return;
    di();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ss(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    _("[bulmaManager] ensureBulma failed", r);
  }
}
function ls(e) {
  Ot = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Ot === "dark" ? n.setAttribute("data-theme", "dark") : Ot === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Ot === "dark" ? n.setAttribute("data-theme", "dark") : Ot === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Rl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      _("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Hi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Ot === "dark" ? t.setAttribute("data-theme", "dark") : Ot === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Ui = {
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
}, Gt = JSON.parse(JSON.stringify(Ui));
let Wn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Wn = String(e).split("-")[0].toLowerCase();
}
Ui[Wn] || (Wn = "en");
let Pt = Wn;
function rn(e, t = {}) {
  const n = Gt[Pt] || Gt.en;
  let i = n && n[e] ? n[e] : Gt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Fi(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Gt[a] = Object.assign({}, Gt[a] || {}, r[a]);
  } catch {
  }
}
function Wi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  Pt = Gt[t] ? t : "en";
}
const cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Pt;
  },
  loadL10nFile: Fi,
  setLang: Wi,
  t: rn
}, Symbol.toStringTag, { value: "Module" }));
function us(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function fi(e, t = null, n = void 0) {
  let r = "#/" + us(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = tt(location.href);
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
function tt(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const f = t.hash.replace(/^#/, "");
        if (f.includes("&")) {
          const c = f.split("&");
          r = c.shift() || null, a = c.join("&");
        } else
          r = f || null;
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
        const f = r.split("?");
        r = f.shift() || "", a = f.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const f = s.split("#");
        s = f.shift() || "", l = f.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const hs = `/**
 * @module worker/slugWorker
 */
import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function ds(e, t = "worker") {
  let n = null;
  function i(...o) {
    try {
      _(...o);
    } catch {
    }
  }
  function r() {
    if (!n)
      try {
        const o = e();
        n = o || null, o && o.addEventListener("error", () => {
          try {
            n === o && (n = null, o.terminate && o.terminate());
          } catch (f) {
            i("[" + t + "] worker termination failed", f);
          }
        });
      } catch (o) {
        n = null, i("[" + t + "] worker init failed", o);
      }
    return n;
  }
  function a() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (o) {
      i("[" + t + "] worker termination failed", o);
    }
  }
  function s(o, f = 1e4) {
    return new Promise((c, u) => {
      const h = r();
      if (!h) return u(new Error("worker unavailable"));
      const m = String(Math.random()), d = Object.assign({}, o, { id: m });
      let g = null;
      const y = () => {
        g && clearTimeout(g), h.removeEventListener("message", p), h.removeEventListener("error", w);
      }, p = (b) => {
        const k = b.data || {};
        k.id === m && (y(), k.error ? u(new Error(k.error)) : c(k.result));
      }, w = (b) => {
        y(), i("[" + t + "] worker error event", b);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (k) {
          i("[" + t + "] worker termination failed", k);
        }
        u(new Error(b && b.message || "worker error"));
      };
      g = setTimeout(() => {
        y(), i("[" + t + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (b) {
          i("[" + t + "] worker termination on timeout failed", b);
        }
        u(new Error("worker timeout"));
      }, f), h.addEventListener("message", p), h.addEventListener("error", w);
      try {
        h.postMessage(d);
      } catch (b) {
        y(), u(b);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function Zi(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...d) {
    try {
      _(...d);
    } catch {
    }
  }
  function s(d) {
    if (!i[d])
      try {
        const g = e();
        i[d] = g || null, g && g.addEventListener("error", () => {
          try {
            i[d] === g && (i[d] = null, g.terminate && g.terminate());
          } catch (y) {
            a("[" + t + "] worker termination failed", y);
          }
        });
      } catch (g) {
        i[d] = null, a("[" + t + "] worker init failed", g);
      }
    return i[d];
  }
  const l = new Array(n).fill(0), o = new Array(n).fill(null), f = 30 * 1e3;
  function c(d) {
    try {
      l[d] = Date.now(), o[d] && (clearTimeout(o[d]), o[d] = null), o[d] = setTimeout(() => {
        try {
          i[d] && (i[d].terminate && i[d].terminate(), i[d] = null);
        } catch (g) {
          a("[" + t + "] idle termination failed", g);
        }
        o[d] = null;
      }, f);
    } catch {
    }
  }
  function u() {
    for (let d = 0; d < i.length; d++) {
      const g = s(d);
      if (g) return g;
    }
    return null;
  }
  function h() {
    for (let d = 0; d < i.length; d++)
      try {
        i[d] && (i[d].terminate && i[d].terminate(), i[d] = null);
      } catch (g) {
        a("[" + t + "] worker termination failed", g);
      }
  }
  function m(d, g = 1e4) {
    return new Promise((y, p) => {
      const w = r++ % i.length, b = (k) => {
        const S = (w + k) % i.length, v = s(S);
        if (!v)
          return k + 1 < i.length ? b(k + 1) : p(new Error("worker pool unavailable"));
        const R = String(Math.random()), W = Object.assign({}, d, { id: R });
        let I = null;
        const H = () => {
          I && clearTimeout(I), v.removeEventListener("message", M), v.removeEventListener("error", $);
        }, M = (K) => {
          const Z = K.data || {};
          Z.id === R && (H(), Z.error ? p(new Error(Z.error)) : y(Z.result));
        }, $ = (K) => {
          H(), a("[" + t + "] worker error event", K);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (Z) {
            a("[" + t + "] worker termination failed", Z);
          }
          p(new Error(K && K.message || "worker error"));
        };
        I = setTimeout(() => {
          H(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (K) {
            a("[" + t + "] worker termination on timeout failed", K);
          }
          p(new Error("worker timeout"));
        }, g), v.addEventListener("message", M), v.addEventListener("error", $);
        try {
          c(S), v.postMessage(W);
        } catch (K) {
          H(), p(K);
        }
      };
      b(0);
    });
  }
  return { get: u, send: m, terminate: h };
}
function sn(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        sn._blobUrlCache || (sn._blobUrlCache = /* @__PURE__ */ new Map());
        const t = sn._blobUrlCache;
        let n = t.get(e);
        if (!n) {
          const i = new Blob([e], { type: "application/javascript" });
          n = URL.createObjectURL(i), t.set(e, n);
        }
        return new Worker(n, { type: "module" });
      } catch (t) {
        try {
          _("[worker-manager] createWorkerFromRaw failed", t);
        } catch {
        }
      }
  } catch (t) {
    try {
      _("[worker-manager] createWorkerFromRaw failed", t);
    } catch {
    }
  }
  return null;
}
const Ke = /* @__PURE__ */ new Set();
function Dt(e) {
  if (fs(), Ke.clear(), Array.isArray(qe) && qe.length)
    for (const t of qe)
      t && Ke.add(t);
  else
    for (const t of Te)
      t && Ke.add(t);
  pi(ae), pi(ne), Dt._refreshed = !0;
}
function pi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && Ke.add(t);
}
function gi(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && Ke.add(i), t.call(this, n, i);
  };
}
let mi = !1;
function fs() {
  mi || (gi(ae), gi(ne), mi = !0);
}
const dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: Ke,
  refreshIndexPaths: Dt
}, Symbol.toStringTag, { value: "Module" }));
function Xt(e, t = 1e3) {
  const n = /* @__PURE__ */ new Map();
  function i(r) {
    const a = r === void 0 ? "__undefined" : String(r);
    if (n.has(a)) {
      const l = n.get(a);
      return n.delete(a), n.set(a, l), l;
    }
    const s = e(r);
    try {
      if (n.set(a, s), n.size > t) {
        const l = n.keys().next().value;
        n.delete(l);
      }
    } catch {
    }
    return s;
  }
  return i._cache = n, i._reset = () => n.clear(), i;
}
function Gi(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const ie = Xt(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), Qt = Xt(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), jt = Xt(function(e) {
  return Qt(String(e || "")) + "/";
}, 2e3);
function ps(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    _("[helpers] preloadImage failed", t);
  }
}
function zn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = l - s);
    let h = 0.6;
    try {
      const y = r && window.getComputedStyle ? window.getComputedStyle(r) : null, p = y && y.getPropertyValue("--nimbi-image-max-height-ratio"), w = p ? parseFloat(p) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (h = w);
    } catch (y) {
      _("[helpers] read CSS ratio failed", y);
    }
    const m = Math.max(200, Math.floor(u * h));
    let d = !1, g = null;
    if (i.forEach((y) => {
      try {
        const p = y.getAttribute ? y.getAttribute("loading") : void 0;
        p !== "eager" && y.setAttribute && y.setAttribute("loading", "lazy");
        const w = y.getBoundingClientRect ? y.getBoundingClientRect() : null, b = y.src || y.getAttribute && y.getAttribute("src"), k = w && w.height > 1 ? w.height : m, S = w ? w.top : 0, v = S + k;
        w && k > 0 && S <= c && v >= o && (y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high"), ps(b), d = !0), !g && w && w.top <= c && (g = { img: y, src: b, rect: w, beforeLoading: p });
      } catch (p) {
        _("[helpers] setEagerForAboveFoldImages per-image failed", p);
      }
    }), !d && g) {
      const { img: y, src: p, rect: w, beforeLoading: b } = g;
      try {
        y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high");
      } catch (k) {
        _("[helpers] setEagerForAboveFoldImages fallback failed", k);
      }
    }
  } catch (i) {
    _("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Ce(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [f, c] of r.entries())
      s.append(f, c);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
Xt(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return _("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Zn(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      _("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    _("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Zn);
} catch (e) {
  _("[helpers] global attach failed", e);
}
const gs = Xt(function(e) {
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
}, 2e3), ae = /* @__PURE__ */ new Map();
let Ve = [], zr = !1;
function ms(e) {
  zr = !!e;
}
function Qi(e) {
  Ve = Array.isArray(e) ? e.slice() : [];
}
function ys() {
  return Ve;
}
const wn = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Xi = Zi(() => sn(hs), "slugManager", wn);
function bs() {
  try {
    if (Pr()) return !0;
  } catch {
  }
  try {
    return !!(typeof re == "string" && re);
  } catch {
    return !1;
  }
}
function fe(...e) {
  try {
    _t(...e);
  } catch {
  }
}
function ws() {
  return Xi.get();
}
function Ki(e) {
  return Xi.send(e, 5e3);
}
async function _r(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => ot);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Ki({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function _s(e, t, n) {
  const i = await Promise.resolve().then(() => ot);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Ki({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function it(e, t) {
  if (e) {
    if (Ve && Ve.length) {
      const i = t.split("/")[0], r = Ve.includes(i);
      let a = ae.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, ae.set(e, a);
    } else
      ae.set(e, t);
    try {
      if (t && typeof t == "string") {
        try {
          ne.set(t, e);
        } catch {
        }
        try {
          Array.isArray(qe) && !qe.includes(t) && qe.push(t);
        } catch {
        }
        try {
          Te && typeof Te.add == "function" && Te.add(t);
        } catch {
        }
      }
    } catch {
    }
  }
}
const Yn = /* @__PURE__ */ new Set();
function ks(e) {
  typeof e == "function" && Yn.add(e);
}
function xs(e) {
  typeof e == "function" && Yn.delete(e);
}
const ne = /* @__PURE__ */ new Map();
let kr = {}, qe = [];
const Te = /* @__PURE__ */ new Set();
let re = "_404.md", ft = null;
const Ir = "_home";
function Vi(e) {
  if (e == null) {
    re = null;
    return;
  }
  re = String(e || "");
}
function Yi(e) {
  if (e == null) {
    ft = null;
    return;
  }
  ft = String(e || "");
}
function Ss(e) {
  kr = e || {};
}
function Ji(e) {
  try {
    if (Array.isArray(X) || (X = []), !Array.isArray(e)) return;
    try {
      Array.isArray(X) || (X = []), X.length = 0;
      for (const t of e) X.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = X;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      fe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        X = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const on = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new Set();
function vs() {
  on.clear(), Gn.clear();
}
function As(e) {
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
const ke = Xt(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function Or(e) {
  ae.clear(), ne.clear(), qe = [];
  try {
    Te.clear();
  } catch {
  }
  Ve = Ve || [];
  const t = Object.keys(kr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), fe("[slugManager] parse contentBase failed", i);
      }
      n = jt(n);
    }
  } catch (i) {
    n = "", fe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = As(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = ie(i.slice(n.length)) : r = ie(i), qe.push(r);
    try {
      Te.add(r);
    } catch {
    }
    try {
      Dt();
    } catch (s) {
      fe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = kr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ke(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!Ve || !Ve.length) && (o = ea(o, new Set(ae.keys()))), Ve && Ve.length) {
              const c = r.split("/")[0], u = Ve.includes(c);
              let h = ae.get(o);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), u ? h.langs[c] = r : h.default = r, ae.set(o, h);
            } else
              ae.set(o, r);
            ne.set(r, o);
          } catch (o) {
            fe("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Or();
} catch (e) {
  fe("[slugManager] initial setContentBase failed", e);
}
function ea(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Es(e) {
  return vn(e, void 0);
}
function vn(e, t) {
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
function Dn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function An(e) {
  if (!e || !ae.has(e)) return null;
  const t = ae.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (Ve && Ve.length && Pt && t.langs && t.langs[Pt])
    return t.langs[Pt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const ln = /* @__PURE__ */ new Map();
function Ls() {
  ln.clear();
}
let Ee = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const l = tt(e);
        l && l.page && (e = l.page);
      } catch {
      }
  } catch {
  }
  try {
    const l = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (l && ae.has(l)) {
      const o = An(l) || ae.get(l);
      o && o !== e && (e = o);
    }
  } catch (l) {
    fe("[slugManager] slug mapping normalization failed", l);
  }
  if (!(n && n.force === !0 || typeof re == "string" && re || ae && ae.size || Te && Te.size || Pr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : Qt(String(t));
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
  if (ln.has(a))
    return ln.get(a);
  const s = (async () => {
    const l = await fetch(a);
    if (!l || typeof l.ok != "boolean" || !l.ok) {
      if (l && l.status === 404 && typeof re == "string" && re)
        try {
          const m = `${r}/${re}`, d = await globalThis.fetch(m);
          if (d && typeof d.ok == "boolean" && d.ok)
            return { raw: await d.text(), status: 404 };
        } catch (m) {
          fe("[slugManager] fetching fallback 404 failed", m);
        }
      let h = "";
      try {
        l && typeof l.clone == "function" ? h = await l.clone().text() : l && typeof l.text == "function" ? h = await l.text() : h = "";
      } catch (m) {
        h = "", fe("[slugManager] reading error body failed", m);
      }
      try {
        const m = l ? l.status : void 0;
        if (m === 404)
          try {
            _("fetchMarkdown failed (404):", { url: a, status: m, statusText: l ? l.statusText : void 0, body: h.slice(0, 200) });
          } catch {
          }
        else
          try {
            Fn("fetchMarkdown failed:", { url: a, status: m, statusText: l ? l.statusText : void 0, body: h.slice(0, 200) });
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const o = await l.text(), f = o.trim().slice(0, 128).toLowerCase(), c = /^(?:<!doctype|<html|<title|<h1)/.test(f), u = c || String(e || "").toLowerCase().endsWith(".html");
    if (c && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof re == "string" && re) {
          const h = `${r}/${re}`, m = await globalThis.fetch(h);
          if (m.ok)
            return { raw: await m.text(), status: 404 };
        }
      } catch (h) {
        fe("[slugManager] fetching fallback 404 failed", h);
      }
      throw bs() && Fn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return u ? { raw: o, isHtml: !0 } : { raw: o };
  })();
  return ln.set(a, s), s;
};
function Ms(e) {
  typeof e == "function" && (Ee = e);
}
const jn = /* @__PURE__ */ new Map();
function Ts(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let X = [];
function Rs() {
  return X;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return X;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = X;
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
          return xr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = xr;
      } catch {
      }
    }
} catch {
}
let Tt = null;
async function Bt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => ie(String(a || ""))))) : [];
  try {
    const a = ie(String(re || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (X && X.length && t === 1 && !X.some((s) => {
    try {
      return r.includes(ie(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return X;
  if (Tt) return Tt;
  Tt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((g) => ie(String(g || ""))))) : [];
    try {
      const g = ie(String(re || ""));
      g && !a.includes(g) && a.push(g);
    } catch {
    }
    const s = (g) => {
      if (!a || !a.length) return !1;
      for (const y of a)
        if (y && (g === y || g.startsWith(y + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const g of i)
          try {
            const y = ie(String(g || ""));
            y && l.push(y);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(qe) && qe.length && (l = Array.from(qe)), !l.length)
      for (const g of ae.values())
        g && l.push(g);
    try {
      const g = await aa(e);
      g && g.length && (l = l.concat(g));
    } catch (g) {
      fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", g);
    }
    try {
      const g = new Set(l), y = [...l], p = Math.max(1, wn), w = async () => {
        for (; !(g.size > En); ) {
          const k = y.shift();
          if (!k) break;
          try {
            const S = await Ee(k, e);
            if (S && S.raw) {
              if (S.status === 404) continue;
              let v = S.raw;
              const R = [], W = String(k || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(W) && zr && (!k || !k.includes("/")))
                continue;
              const I = Ts(v), H = /\[[^\]]+\]\(([^)]+)\)/g;
              let M;
              for (; M = H.exec(I); )
                R.push(M[1]);
              const $ = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; M = $.exec(I); )
                R.push(M[1]);
              const K = k && k.includes("/") ? k.substring(0, k.lastIndexOf("/") + 1) : "";
              for (let Z of R)
                try {
                  if (vn(Z, e) || Z.startsWith("..") || Z.indexOf("/../") !== -1 || (K && !Z.startsWith("./") && !Z.startsWith("/") && !Z.startsWith("../") && (Z = K + Z), Z = ie(Z), !/\.(md|html?)(?:$|[?#])/i.test(Z)) || (Z = Z.split(/[?#]/)[0], s(Z))) continue;
                  g.has(Z) || (g.add(Z), y.push(Z), l.push(Z));
                } catch (he) {
                  fe("[slugManager] href processing failed", Z, he);
                }
            }
          } catch (S) {
            fe("[slugManager] discovery fetch failed for", k, S);
          }
        }
      }, b = [];
      for (let k = 0; k < p; k++) b.push(w());
      await Promise.all(b);
    } catch (g) {
      fe("[slugManager] discovery loop failed", g);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((g) => !g || o.has(g) || s(g) ? !1 : (o.add(g), !0));
    const f = [], c = /* @__PURE__ */ new Map(), u = l.filter((g) => /\.(?:md|html?)(?:$|[?#])/i.test(g)), h = Math.max(1, Math.min(wn, u.length || 1)), m = u.slice(), d = [];
    for (let g = 0; g < h; g++)
      d.push((async () => {
        for (; m.length; ) {
          const y = m.shift();
          if (!y) break;
          try {
            const p = await Ee(y, e);
            c.set(y, p);
          } catch (p) {
            fe("[slugManager] buildSearchIndex: entry fetch failed", y, p), c.set(y, null);
          }
        }
      })());
    await Promise.all(d);
    for (const g of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(g))
        try {
          const y = c.get(g);
          if (!y || !y.raw || y.status === 404) continue;
          let p = "", w = "";
          if (y.isHtml)
            try {
              const S = new DOMParser().parseFromString(y.raw, "text/html"), v = S.querySelector("title") || S.querySelector("h1");
              v && v.textContent && (p = v.textContent.trim());
              const R = S.querySelector("p");
              if (R && R.textContent && (w = R.textContent.trim()), t >= 2)
                try {
                  const W = S.querySelector("h1"), I = W && W.textContent ? W.textContent.trim() : p || "", H = (() => {
                    try {
                      if (ne.has(g)) return ne.get(g);
                    } catch {
                    }
                    return ke(p || g);
                  })(), M = Array.from(S.querySelectorAll("h2"));
                  for (const $ of M)
                    try {
                      const K = ($.textContent || "").trim();
                      if (!K) continue;
                      const Z = $.id ? $.id : ke(K), he = H ? `${H}::${Z}` : `${ke(g)}::${Z}`;
                      let L = "", U = $.nextElementSibling;
                      for (; U && U.tagName && U.tagName.toLowerCase() === "script"; ) U = U.nextElementSibling;
                      U && U.textContent && (L = String(U.textContent).trim()), f.push({ slug: he, title: K, excerpt: L, path: g, parentTitle: I });
                    } catch (K) {
                      fe("[slugManager] indexing H2 failed", K);
                    }
                  if (t === 3)
                    try {
                      const $ = Array.from(S.querySelectorAll("h3"));
                      for (const K of $)
                        try {
                          const Z = (K.textContent || "").trim();
                          if (!Z) continue;
                          const he = K.id ? K.id : ke(Z), L = H ? `${H}::${he}` : `${ke(g)}::${he}`;
                          let U = "", J = K.nextElementSibling;
                          for (; J && J.tagName && J.tagName.toLowerCase() === "script"; ) J = J.nextElementSibling;
                          J && J.textContent && (U = String(J.textContent).trim()), f.push({ slug: L, title: Z, excerpt: U, path: g, parentTitle: I });
                        } catch (Z) {
                          fe("[slugManager] indexing H3 failed", Z);
                        }
                    } catch ($) {
                      fe("[slugManager] collect H3s failed", $);
                    }
                } catch (W) {
                  fe("[slugManager] collect H2s failed", W);
                }
            } catch (k) {
              fe("[slugManager] parsing HTML for index failed", k);
            }
          else {
            const k = y.raw, S = k.match(/^#\s+(.+)$/m);
            p = S ? S[1].trim() : "";
            try {
              p = Dn(p);
            } catch {
            }
            const v = k.split(/\r?\n\s*\r?\n/);
            if (v.length > 1)
              for (let R = 1; R < v.length; R++) {
                const W = v[R].trim();
                if (W && !/^#/.test(W)) {
                  w = W.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let R = "", W = "";
              try {
                const I = (k.match(/^#\s+(.+)$/m) || [])[1];
                R = I ? I.trim() : "", W = (function() {
                  try {
                    if (ne.has(g)) return ne.get(g);
                  } catch {
                  }
                  return ke(p || g);
                })();
                const H = /^##\s+(.+)$/gm;
                let M;
                for (; M = H.exec(k); )
                  try {
                    const $ = (M[1] || "").trim(), K = Dn($);
                    if (!$) continue;
                    const Z = ke($), he = W ? `${W}::${Z}` : `${ke(g)}::${Z}`, U = k.slice(H.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), J = U && U[1] ? String(U[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    f.push({ slug: he, title: K, excerpt: J, path: g, parentTitle: R });
                  } catch ($) {
                    fe("[slugManager] indexing markdown H2 failed", $);
                  }
              } catch (I) {
                fe("[slugManager] collect markdown H2s failed", I);
              }
              if (t === 3)
                try {
                  const I = /^###\s+(.+)$/gm;
                  let H;
                  for (; H = I.exec(k); )
                    try {
                      const M = (H[1] || "").trim(), $ = Dn(M);
                      if (!M) continue;
                      const K = ke(M), Z = W ? `${W}::${K}` : `${ke(g)}::${K}`, L = k.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), U = L && L[1] ? String(L[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      f.push({ slug: Z, title: $, excerpt: U, path: g, parentTitle: R });
                    } catch (M) {
                      fe("[slugManager] indexing markdown H3 failed", M);
                    }
                } catch (I) {
                  fe("[slugManager] collect markdown H3s failed", I);
                }
            }
          }
          let b = "";
          try {
            ne.has(g) && (b = ne.get(g));
          } catch (k) {
            fe("[slugManager] mdToSlug access failed", k);
          }
          b || (b = ke(p || g)), f.push({ slug: b, title: p, excerpt: w, path: g });
        } catch (y) {
          fe("[slugManager] buildSearchIndex: entry processing failed", y);
        }
    try {
      const g = f.filter((y) => {
        try {
          return !s(String(y.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(X) || (X = []), X.length = 0;
        for (const y of g) X.push(y);
      } catch {
        try {
          X = Array.from(g);
        } catch {
          X = g;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = X;
          } catch {
          }
          try {
            const y = [], p = /* @__PURE__ */ new Set();
            for (const w of X)
              try {
                if (!w || !w.slug) continue;
                const b = String(w.slug).split("::")[0];
                if (p.has(b)) continue;
                p.add(b);
                const k = { slug: b };
                w.title ? k.title = String(w.title) : w.parentTitle && (k.title = String(w.parentTitle)), w.path && (k.path = String(w.path)), y.push(k);
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
    } catch (g) {
      fe("[slugManager] filtering index by excludes failed", g);
      try {
        Array.isArray(X) || (X = []), X.length = 0;
        for (const y of f) X.push(y);
      } catch {
        try {
          X = Array.from(f);
        } catch {
          X = f;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = X;
          } catch {
          }
      } catch {
      }
    }
    return X;
  })();
  try {
    await Tt;
  } catch (a) {
    fe("[slugManager] awaiting _indexPromise failed", a);
  }
  return Tt = null, X;
}
async function Ct(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(X) && X.length && !Tt && !s) return X;
    if (Tt) {
      try {
        await Tt;
      } catch {
      }
      return X;
    }
    if (s) {
      try {
        if (typeof _r == "function")
          try {
            const o = await _r(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                Ji(o);
              } catch {
              }
              return X;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await Bt(n, i, r, a), X;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(X) && X.length) return X;
      await new Promise((o) => setTimeout(o, 150));
    }
    return X;
  } catch {
    return X;
  }
}
async function xr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Ct(t);
    } catch {
      return X;
    }
  } catch {
    return X;
  }
}
const ta = 1e3;
let En = ta;
function Cs(e) {
  typeof e == "number" && e >= 0 && (En = e);
}
const na = new DOMParser(), ra = "a[href]";
let ia = async function(e, t, n = En) {
  if (jn.has(e)) return jn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? l = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? l = s + String(t).replace(/\/$/, "") + "/" : l = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  const o = Math.max(1, Math.min(wn, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const f = a.splice(0, o);
    await Promise.all(f.map(async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let u = "";
      try {
        u = new URL(c || "", l).toString();
      } catch {
        u = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let h;
        try {
          h = await globalThis.fetch(u);
        } catch (p) {
          fe("[slugManager] crawlForSlug: fetch failed", { url: u, error: p });
          return;
        }
        if (!h || !h.ok) {
          h && !h.ok && fe("[slugManager] crawlForSlug: directory fetch non-ok", { url: u, status: h.status });
          return;
        }
        const m = await h.text(), g = na.parseFromString(m, "text/html").querySelectorAll(ra), y = u;
        for (const p of g)
          try {
            if (i) break;
            let w = p.getAttribute("href") || "";
            if (!w || vn(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const b = new URL(w, y), k = new URL(l).pathname, S = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, ""), v = jt(ie(S));
                r.has(v) || a.push(v);
              } catch {
                const k = ie(c + w);
                r.has(k) || a.push(k);
              }
              continue;
            }
            if (w.toLowerCase().endsWith(".md")) {
              let b = "";
              try {
                const k = new URL(w, y), S = new URL(l).pathname;
                b = k.pathname.startsWith(S) ? k.pathname.slice(S.length) : k.pathname.replace(/^\//, "");
              } catch {
                b = (c + w).replace(/^\//, "");
              }
              b = ie(b);
              try {
                if (ne.has(b))
                  continue;
                for (const k of ae.values())
                  ;
              } catch (k) {
                fe("[slugManager] slug map access failed", k);
              }
              try {
                const k = await Ee(b, t);
                if (k && k.raw) {
                  const S = (k.raw || "").match(/^#\s+(.+)$/m);
                  if (S && S[1] && ke(S[1].trim()) === e) {
                    i = b;
                    break;
                  }
                }
              } catch (k) {
                fe("[slugManager] crawlForSlug: fetchMarkdown failed", k);
              }
            }
          } catch (w) {
            fe("[slugManager] crawlForSlug: link iteration failed", w);
          }
      } catch (h) {
        fe("[slugManager] crawlForSlug: directory fetch failed", h);
      }
    }));
  }
  return jn.set(e, i), i;
};
async function aa(e, t = En) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const l = Math.max(1, Math.min(wn, 6));
  for (; r.length && !(r.length > t); ) {
    const o = r.splice(0, l);
    await Promise.all(o.map(async (f) => {
      if (f == null || i.has(f)) return;
      i.add(f);
      let c = "";
      try {
        c = new URL(f || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(f || "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(c);
        } catch (y) {
          fe("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: y });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && fe("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: u.status });
          return;
        }
        const h = await u.text(), d = na.parseFromString(h, "text/html").querySelectorAll(ra), g = c;
        for (const y of d)
          try {
            let p = y.getAttribute("href") || "";
            if (!p || vn(p, e) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
            if (p.endsWith("/")) {
              try {
                const b = new URL(p, g), k = new URL(s).pathname, S = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, ""), v = jt(ie(S));
                i.has(v) || r.push(v);
              } catch {
                const k = f + p;
                i.has(k) || r.push(k);
              }
              continue;
            }
            let w = "";
            try {
              const b = new URL(p, g), k = new URL(s).pathname;
              w = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, "");
            } catch {
              w = (f + p).replace(/^\//, "");
            }
            w = ie(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (p) {
            fe("[slugManager] crawlAllMarkdown: link iteration failed", p);
          }
      } catch (u) {
        fe("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }));
  }
  return Array.from(n);
}
async function sa(e, t, n) {
  if (e && typeof e == "string" && (e = ie(e), e = Qt(e)), ae.has(e))
    return An(e) || ae.get(e);
  try {
    if (!(typeof re == "string" && re || ae.has(e) || Te && Te.size || Dt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of Yn)
    try {
      const a = await r(e, t);
      if (a)
        return it(e, a), a;
    } catch (a) {
      fe("[slugManager] slug resolver failed", a);
    }
  if (Te && Te.size) {
    if (on.has(e)) {
      const r = on.get(e);
      return it(e, r), r;
    }
    for (const r of qe)
      if (!Gn.has(r))
        try {
          const a = await Ee(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ke(s[1].trim());
              if (Gn.add(r), l && on.set(l, r), l === e)
                return it(e, r), r;
            }
          }
        } catch (a) {
          fe("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await Bt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return it(e, a.path), a.path;
    }
  } catch (r) {
    fe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await ia(e, t, n);
    if (r)
      return it(e, r), r;
  } catch (r) {
    fe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Ee(r, t);
      if (a && a.raw)
        return it(e, r), r;
    } catch (a) {
      fe("[slugManager] candidate fetch failed", a);
    }
  if (Te && Te.size)
    for (const r of qe)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ke(a) === e)
          return it(e, r), r;
      } catch (a) {
        fe("[slugManager] build-time filename match failed", a);
      }
  try {
    if (ft && typeof ft == "string" && ft.trim())
      try {
        const r = await Ee(ft, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && ke(a[1].trim()) === e)
            return it(e, ft), ft;
        }
      } catch (r) {
        fe("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    fe("[slugManager] home page fetch failed", r);
  }
  return null;
}
const ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ta,
  HOME_SLUG: Ir,
  _setAllMd: Ss,
  _setSearchIndex: Ji,
  _storeSlugMapping: it,
  addSlugResolver: ks,
  get allMarkdownPaths() {
    return qe;
  },
  allMarkdownPathsSet: Te,
  get availableLanguages() {
    return Ve;
  },
  awaitSearchIndex: xr,
  buildSearchIndex: Bt,
  buildSearchIndexWorker: _r,
  clearFetchCache: Ls,
  clearListCaches: vs,
  crawlAllMarkdown: aa,
  crawlCache: jn,
  crawlForSlug: ia,
  crawlForSlugWorker: _s,
  get defaultCrawlMaxQueue() {
    return En;
  },
  ensureSlug: sa,
  fetchCache: ln,
  get fetchMarkdown() {
    return Ee;
  },
  getLanguages: ys,
  getSearchIndex: Rs,
  get homePage() {
    return ft;
  },
  initSlugWorker: ws,
  isExternalLink: Es,
  isExternalLinkWithBase: vn,
  listPathsFetched: Gn,
  listSlugCache: on,
  mdToSlug: ne,
  get notFoundPage() {
    return re;
  },
  removeSlugResolver: xs,
  resolveSlugPath: An,
  get searchIndex() {
    return X;
  },
  setContentBase: Or,
  setDefaultCrawlMaxQueue: Cs,
  setFetchMarkdown: Ms,
  setHomePage: Yi,
  setLanguages: Qi,
  setNotFoundPage: Vi,
  setSkipRootReadme: ms,
  get skipRootReadme() {
    return zr;
  },
  slugResolvers: Yn,
  slugToMd: ae,
  slugify: ke,
  unescapeMarkdown: Dn,
  uniqueSlug: ea,
  whenSearchIndexReady: Ct
}, Symbol.toStringTag, { value: "Module" }));
var fr, yi;
function Ps() {
  if (yi) return fr;
  yi = 1;
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
    let l = 0, o = 0, f = a.length - 1;
    const c = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[o]); ) o++;
    for (; u(a[f]); ) f--;
    const h = `${a}
`;
    for (let y = o; y <= f; y++)
      if ((t(h[y]) || !u(h[y]) && (u(h[y + 1]) || t(h[y + 1]))) && l++, t(h[y]))
        for (; y <= f && (i(h[y + 1]) || u(h[y + 1])); )
          y++;
    const m = l / c, d = Math.round(m * 60 * 1e3);
    return {
      text: Math.ceil(m.toFixed(2)) + " min read",
      minutes: m,
      time: d,
      words: l
    };
  }
  return fr = r, fr;
}
var $s = Ps();
const zs = /* @__PURE__ */ qi($s);
function _n(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function oa(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    _("[seoManager] upsertLinkRel failed", n);
  }
}
function Is(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Lt("property", "og:description", a), a && String(a).trim() && Lt("name", "twitter:description", a), Lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Lt("property", "og:image", s), Lt("name", "twitter:image", s));
}
function Nr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && _n("description", l), _n("robots", a.robots || "index,follow"), Is(a, t, n, l);
}
function Os() {
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
    _("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Br(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", f = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const d = ie(t);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(d);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (d) {
      c = location.href.split("#")[0], _("[seoManager] compute canonical failed", d);
    }
    c && oa("canonical", c);
    try {
      Lt("property", "og:url", c);
    } catch (d) {
      _("[seoManager] upsertMeta og:url failed", d);
    }
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    f && (u.image = String(f)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const h = "nimbi-jsonld";
    let m = document.getElementById(h);
    m || (m = document.createElement("script"), m.type = "application/ld+json", m.id = h, document.head.appendChild(m)), m.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    _("[seoManager] setStructuredData failed", s);
  }
}
let cn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function Ns(e) {
  try {
    if (!e || typeof e != "object") {
      cn = {};
      return;
    }
    cn = Object.assign({}, e);
  } catch (t) {
    _("[seoManager] setSeoMap failed", t);
  }
}
function Bs(e, t = "") {
  try {
    if (!e) return;
    const n = cn && cn[e] ? cn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      oa("canonical", i);
      try {
        Lt("property", "og:url", i);
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
      n.description && _n("description", String(n.description));
    } catch {
    }
    try {
      try {
        Nr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Br({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      _("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    _("[seoManager] injectSeoForPage failed", n);
  }
}
function Hn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      _n("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && _n("description", String(s));
    } catch {
    }
    try {
      Nr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Br({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    _("[seoManager] markNotFound failed", r);
  }
}
function qs(e, t, n, i, r, a, s, l, o, f, c) {
  try {
    if (i && i.querySelector) {
      const u = i.querySelector(".menu-label");
      u && (u.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (u) {
    _("[seoManager] update toc label failed", u);
  }
  try {
    const u = n.meta && n.meta.title ? String(n.meta.title).trim() : "", h = r.querySelector("img"), m = h && (h.getAttribute("src") || h.src) || null;
    let d = "";
    try {
      let p = "";
      try {
        const w = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (w) {
          let b = w.nextElementSibling;
          const k = [];
          for (; b && !(b.tagName && b.tagName.toLowerCase() === "h2"); ) {
            try {
              if (b.classList && b.classList.contains("nimbi-article-subtitle")) {
                b = b.nextElementSibling;
                continue;
              }
            } catch {
            }
            const S = (b.textContent || "").trim();
            S && k.push(S), b = b.nextElementSibling;
          }
          k.length && (p = k.join(" ").replace(/\s+/g, " ").trim()), !p && o && (p = String(o).trim());
        }
      } catch (w) {
        _("[seoManager] compute descOverride failed", w);
      }
      p && String(p).length > 160 && (p = String(p).slice(0, 157).trim() + "..."), d = p;
    } catch (p) {
      _("[seoManager] compute descOverride failed", p);
    }
    let g = "";
    try {
      u && (g = u);
    } catch {
    }
    if (!g)
      try {
        l && l.textContent && (g = String(l.textContent).trim());
      } catch {
      }
    if (!g)
      try {
        const p = r.querySelector("h2");
        p && p.textContent && (g = String(p.textContent).trim());
      } catch {
      }
    g || (g = a || "");
    try {
      Nr(n, g || void 0, m, d);
    } catch (p) {
      _("[seoManager] setMetaTags failed", p);
    }
    try {
      Br(n, f, g || void 0, m, d, t);
    } catch (p) {
      _("[seoManager] setStructuredData failed", p);
    }
    const y = Os();
    g ? y ? document.title = `${y} - ${g}` : document.title = `${t || "Site"} - ${g}` : u ? document.title = u : document.title = t || document.title;
  } catch (u) {
    _("[seoManager] applyPageMeta failed", u);
  }
  try {
    try {
      const u = r.querySelectorAll(".nimbi-reading-time");
      u && u.forEach((h) => h.remove());
    } catch {
    }
    if (o) {
      const u = zs(c.raw || ""), h = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, m = h ? e("readingTime", { minutes: h }) : "";
      if (!m) return;
      const d = r.querySelector("h1");
      if (d) {
        const g = r.querySelector(".nimbi-article-subtitle");
        try {
          if (g) {
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = m, g.appendChild(y);
          } else {
            const y = document.createElement("p");
            y.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const p = document.createElement("span");
            p.className = "nimbi-reading-time", p.textContent = m, y.appendChild(p);
            try {
              d.parentElement.insertBefore(y, d.nextSibling);
            } catch {
              try {
                d.insertAdjacentElement("afterend", y);
              } catch {
              }
            }
          }
        } catch {
          try {
            const p = document.createElement("p");
            p.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = m, p.appendChild(w), d.insertAdjacentElement("afterend", p);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    _("[seoManager] reading time update failed", u);
  }
}
let la = 100;
function bi(e) {
  la = e;
}
function rt() {
  try {
    if (Ft(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let un = 300 * 1e3;
function wi(e) {
  un = e;
}
const ut = /* @__PURE__ */ new Map();
function Ds(e) {
  if (!ut.has(e)) return;
  const t = ut.get(e), n = Date.now();
  if (t.ts + un < n) {
    ut.delete(e);
    return;
  }
  return ut.delete(e), ut.set(e, t), t.value;
}
function js(e, t) {
  if (_i(), _i(), ut.delete(e), ut.set(e, { value: t, ts: Date.now() }), ut.size > la) {
    const n = ut.keys().next().value;
    n !== void 0 && ut.delete(n);
  }
}
function _i() {
  if (!un || un <= 0) return;
  const e = Date.now();
  for (const [t, n] of ut.entries())
    n.ts + un < e && ut.delete(t);
}
async function Hs(e, t) {
  const n = new Set(Ke), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = tt(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const h = ie(u.page);
              if (h) {
                n.add(h);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const h = u.page;
              if (ae.has(h)) {
                const m = ae.get(h);
                if (m) return m;
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
          let u = ie(l[1]);
          u && n.add(u);
          continue;
        }
        const o = (r.textContent || "").trim(), f = (s.pathname || "").replace(/^.*\//, "");
        if (o && ke(o) === e || f && ke(f.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const u = new URL(t), h = jt(u.pathname);
          if (c.indexOf(h) !== -1) {
            let m = c.startsWith(h) ? c.slice(h.length) : c;
            m = ie(m), m && n.add(m);
          }
        }
      } catch (s) {
        _("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Ee(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && ke(l) === e)
          return r;
      }
    } catch (a) {
      _("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function Us(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (ae.has(n)) {
        const i = An(n) || ae.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (Ke && Ke.size)
          for (const i of Ke) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ke(r) === n && !/index\.html$/i.test(i)) {
              t.push(i);
              break;
            }
          }
        !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
      }
    } catch (n) {
      _("[router] buildPageCandidates failed during slug handling", n);
    }
  return t;
}
async function Fs(e, t) {
  const n = e || "";
  try {
    try {
      Ni("fetchPageData");
    } catch {
    }
    try {
      Bi("fetchPageData");
    } catch {
    }
  } catch {
  }
  let i = null;
  try {
    const p = tt(typeof location < "u" ? location.href : "");
    p && p.anchor && (i = p.anchor);
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
    const p = String(r).split("::", 2);
    r = p[0], a = p[1] || null;
  }
  const o = `${e}|||${typeof cs < "u" && Pt ? Pt : ""}`, f = Ds(o);
  if (f)
    r = f.resolved, a = f.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let p = decodeURIComponent(String(r || ""));
      if (p && typeof p == "string" && (p = ie(p), p = Qt(p)), ae.has(p))
        r = An(p) || ae.get(p);
      else {
        let w = await Hs(p, t);
        if (w)
          r = w;
        else if (Dt._refreshed && Ke && Ke.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await sa(p, t);
          b && (r = b);
        }
      }
    }
    js(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const p = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof re == "string" && re || ae.has(r) || Ke && Ke.size || Dt._refreshed || s || p;
  } catch {
    c = !0;
  }
  !a && i && (a = i);
  try {
    if (c && r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const p = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const w = await fetch(p);
        if (w && w.ok) {
          const b = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", S = (b || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let W = p;
                try {
                  W = new URL(p).pathname.replace(/^\//, "");
                } catch {
                  W = String(p || "").replace(/^\//, "");
                }
                const I = W.replace(/\.html$/i, ".md");
                try {
                  const H = await Ee(I, t);
                  if (H && H.raw)
                    return { data: H, pagePath: I, anchor: a };
                } catch {
                }
                if (typeof re == "string" && re)
                  try {
                    const H = await Ee(re, t);
                    if (H && H.raw) {
                      try {
                        Hn(H.meta || {}, re);
                      } catch {
                      }
                      return { data: H, pagePath: re, anchor: a };
                    }
                  } catch {
                  }
                try {
                  y = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let W = p;
                try {
                  W = new URL(p).pathname.replace(/^\//, "");
                } catch {
                  W = String(p || "").replace(/^\//, "");
                }
                const I = W.replace(/\.html$/i, ".md");
                try {
                  const H = await Ee(I, t);
                  if (H && H.raw)
                    return { data: H, pagePath: I, anchor: a };
                } catch {
                }
                if (typeof re == "string" && re)
                  try {
                    const H = await Ee(re, t);
                    if (H && H.raw) {
                      try {
                        Hn(H.meta || {}, re);
                      } catch {
                      }
                      return { data: H, pagePath: re, anchor: a };
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
  const u = Us(r);
  try {
    if (rt())
      try {
        _t("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
      } catch {
      }
  } catch {
  }
  const h = String(n || "").includes(".md") || String(n || "").includes(".html");
  let m = null;
  if (!h)
    try {
      let p = decodeURIComponent(String(n || ""));
      p = ie(p), p = Qt(p), p && !/\.(md|html?)$/i.test(p) && (m = p);
    } catch {
      m = null;
    }
  if (h && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !h && !ae.has(r) && !ae.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let d = null, g = null, y = null;
  try {
    const p = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof re == "string" && re || ae.has(r) || Ke && Ke.size || Dt._refreshed || h || p;
  } catch {
    c = !0;
  }
  if (!c)
    y = new Error("no page data");
  else
    for (const p of u)
      if (p)
        try {
          const w = ie(p);
          if (d = await Ee(w, t), g = w, m && !ae.has(m))
            try {
              let b = "";
              if (d && d.isHtml)
                try {
                  const k = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (k) {
                    const S = k.parseFromString(d.raw || "", "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (b = v.textContent.trim());
                  }
                } catch {
                }
              else {
                const k = (d && d.raw || "").match(/^#\s+(.+)$/m);
                k && k[1] && (b = k[1].trim());
              }
              if (b && ke(b) !== m)
                try {
                  if (/\.html$/i.test(w)) {
                    const S = w.replace(/\.html$/i, ".md");
                    if (u.includes(S))
                      try {
                        const v = await Ee(S, t);
                        if (v && v.raw)
                          d = v, g = S;
                        else if (typeof re == "string" && re)
                          try {
                            const R = await Ee(re, t);
                            if (R && R.raw)
                              d = R, g = re;
                            else {
                              d = null, g = null, y = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            d = null, g = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          d = null, g = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const R = await Ee(re, t);
                          if (R && R.raw)
                            d = R, g = re;
                          else {
                            d = null, g = null, y = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          d = null, g = null, y = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      d = null, g = null, y = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    d = null, g = null, y = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  d = null, g = null, y = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!h && /\.html$/i.test(w)) {
              const b = w.replace(/\.html$/i, ".md");
              if (u.includes(b))
                try {
                  const S = String(d && d.raw || "").trim().slice(0, 128).toLowerCase();
                  if (d && d.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let R = !1;
                    try {
                      const W = await Ee(b, t);
                      if (W && W.raw)
                        d = W, g = b, R = !0;
                      else if (typeof re == "string" && re)
                        try {
                          const I = await Ee(re, t);
                          I && I.raw && (d = I, g = re, R = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const I = await Ee(re, t);
                        I && I.raw && (d = I, g = re, R = !0);
                      } catch {
                      }
                    }
                    if (!R) {
                      d = null, g = null, y = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (rt())
              try {
                _t("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: g, isHtml: d && d.isHtml, snippet: d && d.raw ? String(d.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          y = w;
          try {
            rt() && _("[router] candidate fetch failed", { candidate: p, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!d) {
    const p = y && (y.message || String(y)) || null, w = p && /failed to fetch md|site shell detected/i.test(p);
    try {
      if (rt())
        try {
          _t("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: p });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (rt())
          try {
            _("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: p });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (rt())
          try {
            Fn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: p });
          } catch {
          }
      } catch {
      }
    if (typeof re == "string" && re)
      try {
        const b = await Ee(re, t);
        if (b && b.raw) {
          try {
            Hn(b.meta || {}, re);
          } catch {
          }
          return { data: b, pagePath: re, anchor: a };
        }
      } catch {
      }
    try {
      if (h && String(n || "").toLowerCase().includes(".html"))
        try {
          const b = new URL(String(n || ""), location.href).toString();
          rt() && _("[router] attempting absolute HTML fetch fallback", b);
          const k = await fetch(b);
          if (k && k.ok) {
            const S = await k.text(), v = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", R = (S || "").toLowerCase(), W = v && v.indexOf && v.indexOf("text/html") !== -1 || R.indexOf("<!doctype") !== -1 || R.indexOf("<html") !== -1;
            if (!W && rt() && _("[router] absolute fetch returned non-HTML", { abs: b, contentType: v, snippet: R.slice(0, 200) }), W) {
              const I = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || I.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  rt() && _("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
                } catch {
                }
              else
                try {
                  const M = b, $ = new URL(".", M).toString();
                  try {
                    const Z = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (Z) {
                      const he = Z.parseFromString(S || "", "text/html"), L = (ee, ue) => {
                        try {
                          const Ae = ue.getAttribute(ee) || "";
                          if (!Ae || /^(https?:)?\/\//i.test(Ae) || Ae.startsWith("/") || Ae.startsWith("#")) return;
                          try {
                            const E = new URL(Ae, M).toString();
                            ue.setAttribute(ee, E);
                          } catch (E) {
                            _("[router] rewrite attribute failed", ee, E);
                          }
                        } catch (Ae) {
                          _("[router] rewrite helper failed", Ae);
                        }
                      }, U = he.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), J = [];
                      for (const ee of Array.from(U || []))
                        try {
                          const ue = ee.tagName ? ee.tagName.toLowerCase() : "";
                          if (ue === "a") continue;
                          if (ee.hasAttribute("src")) {
                            const Ae = ee.getAttribute("src");
                            L("src", ee);
                            const E = ee.getAttribute("src");
                            Ae !== E && J.push({ attr: "src", tag: ue, before: Ae, after: E });
                          }
                          if (ee.hasAttribute("href") && ue === "link") {
                            const Ae = ee.getAttribute("href");
                            L("href", ee);
                            const E = ee.getAttribute("href");
                            Ae !== E && J.push({ attr: "href", tag: ue, before: Ae, after: E });
                          }
                          if (ee.hasAttribute("href") && ue !== "link") {
                            const Ae = ee.getAttribute("href");
                            L("href", ee);
                            const E = ee.getAttribute("href");
                            Ae !== E && J.push({ attr: "href", tag: ue, before: Ae, after: E });
                          }
                          if (ee.hasAttribute("xlink:href")) {
                            const Ae = ee.getAttribute("xlink:href");
                            L("xlink:href", ee);
                            const E = ee.getAttribute("xlink:href");
                            Ae !== E && J.push({ attr: "xlink:href", tag: ue, before: Ae, after: E });
                          }
                          if (ee.hasAttribute("poster")) {
                            const Ae = ee.getAttribute("poster");
                            L("poster", ee);
                            const E = ee.getAttribute("poster");
                            Ae !== E && J.push({ attr: "poster", tag: ue, before: Ae, after: E });
                          }
                          if (ee.hasAttribute("srcset")) {
                            const B = (ee.getAttribute("srcset") || "").split(",").map((C) => C.trim()).filter(Boolean).map((C) => {
                              const [q, P] = C.split(/\s+/, 2);
                              if (!q || /^(https?:)?\/\//i.test(q) || q.startsWith("/")) return C;
                              try {
                                const D = new URL(q, M).toString();
                                return P ? `${D} ${P}` : D;
                              } catch {
                                return C;
                              }
                            }).join(", ");
                            ee.setAttribute("srcset", B);
                          }
                        } catch {
                        }
                      const be = he.documentElement && he.documentElement.outerHTML ? he.documentElement.outerHTML : S;
                      try {
                        rt() && J && J.length && _("[router] rewritten asset refs", { abs: b, rewritten: J });
                      } catch {
                      }
                      return { data: { raw: be, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let K = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? K = S.replace(/(<head[^>]*>)/i, `$1<base href="${$}">`) : K = `<base href="${$}">` + S), { data: { raw: K, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (b) {
          rt() && _("[router] absolute HTML fetch fallback failed", b);
        }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(r || ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof re == "string" && re && rt()) {
        const S = [
          `/assets/${b}.html`,
          `/assets/${b}/index.html`
        ];
        for (const v of S)
          try {
            const R = await fetch(v, { method: "GET" });
            if (R && R.ok)
              return { data: { raw: await R.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (b) {
      rt() && _("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return { data: d, pagePath: g, anchor: a };
}
function Jn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $t = Jn();
function ca(e) {
  $t = e;
}
var Nt = { exec: () => null };
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Ye.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Ws = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ye = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Zs = /^(?:[ \t]*(?:\n|$))+/, Gs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Qs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ln = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Xs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, ua = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ha = Le(ua).replace(/bull/g, qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ks = Le(ua).replace(/bull/g, qr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Dr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Vs = /^[^\n]+/, jr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ys = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", jr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Js = Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, qr).getRegex(), er = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Hr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, eo = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Hr).replace("tag", er).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), da = Le(Dr).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", er).getRegex(), to = Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", da).getRegex(), Ur = { blockquote: to, code: Gs, def: Ys, fences: Qs, heading: Xs, hr: Ln, html: eo, lheading: ha, list: Js, newline: Zs, paragraph: da, table: Nt, text: Vs }, ki = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", er).getRegex(), no = { ...Ur, lheading: Ks, table: ki, paragraph: Le(Dr).replace("hr", Ln).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ki).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", er).getRegex() }, ro = { ...Ur, html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Hr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Nt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Le(Dr).replace("hr", Ln).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ha).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, io = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ao = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, fa = /^( {2,}|\\)\n(?!\s*$)/, so = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, tr = /[\p{P}\p{S}]/u, Fr = /[\s\p{P}\p{S}]/u, pa = /[^\s\p{P}\p{S}]/u, oo = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Fr).getRegex(), ga = /(?!~)[\p{P}\p{S}]/u, lo = /(?!~)[\s\p{P}\p{S}]/u, co = /(?:[^\s\p{P}\p{S}]|~)/u, ma = /(?![*_])[\p{P}\p{S}]/u, uo = /(?![*_])[\s\p{P}\p{S}]/u, ho = /(?:[^\s\p{P}\p{S}]|[*_])/u, fo = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ws ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ya = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, po = Le(ya, "u").replace(/punct/g, tr).getRegex(), go = Le(ya, "u").replace(/punct/g, ga).getRegex(), ba = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", mo = Le(ba, "gu").replace(/notPunctSpace/g, pa).replace(/punctSpace/g, Fr).replace(/punct/g, tr).getRegex(), yo = Le(ba, "gu").replace(/notPunctSpace/g, co).replace(/punctSpace/g, lo).replace(/punct/g, ga).getRegex(), bo = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pa).replace(/punctSpace/g, Fr).replace(/punct/g, tr).getRegex(), wo = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ma).getRegex(), _o = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ko = Le(_o, "gu").replace(/notPunctSpace/g, ho).replace(/punctSpace/g, uo).replace(/punct/g, ma).getRegex(), xo = Le(/\\(punct)/, "gu").replace(/punct/g, tr).getRegex(), So = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), vo = Le(Hr).replace("(?:-->|$)", "-->").getRegex(), Ao = Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", vo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Eo = Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Qn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), wa = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", Qn).replace("ref", jr).getRegex(), _a = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", jr).getRegex(), Lo = Le("reflink|nolink(?!\\()", "g").replace("reflink", wa).replace("nolink", _a).getRegex(), xi = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Wr = { _backpedal: Nt, anyPunctuation: xo, autolink: So, blockSkip: fo, br: fa, code: ao, del: Nt, delLDelim: Nt, delRDelim: Nt, emStrongLDelim: po, emStrongRDelimAst: mo, emStrongRDelimUnd: bo, escape: io, link: Eo, nolink: _a, punctuation: oo, reflink: wa, reflinkSearch: Lo, tag: Ao, text: so, url: Nt }, Mo = { ...Wr, link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", Qn).getRegex(), reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qn).getRegex() }, Sr = { ...Wr, emStrongRDelimAst: yo, emStrongLDelim: go, delLDelim: wo, delRDelim: ko, url: Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", xi).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", xi).getRegex() }, To = { ...Sr, br: Le(fa).replace("{2,}", "*").getRegex(), text: Le(Sr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, In = { normal: Ur, gfm: no, pedantic: ro }, en = { normal: Wr, gfm: Sr, breaks: To, pedantic: Mo }, Ro = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Si = (e) => Ro[e];
function yt(e, t) {
  if (t) {
    if (Ye.escapeTest.test(e)) return e.replace(Ye.escapeReplace, Si);
  } else if (Ye.escapeTestNoEncode.test(e)) return e.replace(Ye.escapeReplaceNoEncode, Si);
  return e;
}
function vi(e) {
  try {
    e = encodeURI(e).replace(Ye.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ai(e, t) {
  let n = e.replace(Ye.findPipe, (a, s, l) => {
    let o = !1, f = s;
    for (; --f >= 0 && l[f] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Ye.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Ye.slashPipe, "|");
  return i;
}
function tn(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function Co(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Po(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Ei(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function $o(e, t, n) {
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
var kn = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || $t;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : tn(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = $o(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = tn(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: tn(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = tn(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, l = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) l.push(n[o]), s = !0;
        else if (!s) l.push(n[o]);
        else break;
        n = n.slice(o);
        let f = l.join(`
`), c = f.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${f}` : f, r = r ? `${r}
${c}` : c;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = u, n.length === 0) break;
        let h = a.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let m = h, d = m.raw + `
` + n.join(`
`), g = this.blockquote(d);
          a[a.length - 1] = g, i = i.substring(0, i.length - m.raw.length) + g.raw, r = r.substring(0, r.length - m.text.length) + g.text;
          break;
        } else if (h?.type === "list") {
          let m = h, d = m.raw + `
` + n.join(`
`), g = this.list(d);
          a[a.length - 1] = g, i = i.substring(0, i.length - h.raw.length) + g.raw, r = r.substring(0, r.length - m.raw.length) + g.raw, n = d.substring(a.at(-1).raw.length).split(`
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
        let o = !1, f = "", c = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        f = t[0], e = e.substring(f.length);
        let u = Po(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], m = !u.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, c = u.trimStart()) : m ? d = t[1].length + 1 : (d = u.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, c = u.slice(d), d += t[1].length), m && this.rules.other.blankLine.test(h) && (f += h + `
`, e = e.substring(h.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(d), y = this.rules.other.hrRegex(d), p = this.rules.other.fencesBeginRegex(d), w = this.rules.other.headingBeginRegex(d), b = this.rules.other.htmlBeginRegex(d), k = this.rules.other.blockquoteBeginRegex(d);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (h = S, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), v = h) : v = h.replace(this.rules.other.tabCharGlobal, "    "), p.test(h) || w.test(h) || b.test(h) || k.test(h) || g.test(h) || y.test(h)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= d || !h.trim()) c += `
` + v.slice(d);
            else {
              if (m || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || p.test(u) || w.test(u) || y.test(u)) break;
              c += `
` + h;
            }
            m = !h.trim(), f += S + `
`, e = e.substring(S.length + 1), u = v.slice(d);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(f) && (s = !0)), r.items.push({ type: "list_item", raw: f, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += f;
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
          let f = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (f) {
            let c = { type: "checkbox", raw: f[0] + " ", checked: f[0] !== "[ ]" };
            o.checked = c.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = c.raw + o.tokens[0].raw, o.tokens[0].text = c.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(c)) : o.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : o.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let f = o.tokens.filter((u) => u.type === "space"), c = f.length > 0 && f.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let f of o.tokens) f.type === "text" && (f.type = "paragraph");
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
    let n = Ai(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Ai(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = tn(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = Co(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Ei(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Ei(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, f = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = f.exec(t)) != null; ) {
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
          let m = u.slice(1, -1);
          return { type: "em", raw: u, text: m, tokens: this.lexer.inlineTokens(m) };
        }
        let h = u.slice(2, -2);
        return { type: "strong", raw: u, text: h, tokens: this.lexer.inlineTokens(h) };
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
        let f = [...i[0]][0].length, c = e.slice(0, r + i.index + f + s), u = c.slice(r, -r);
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
}, lt = class vr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || $t, this.options.tokenizer = this.options.tokenizer || new kn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Ye, block: In.normal, inline: en.normal };
    this.options.pedantic ? (n.block = In.pedantic, n.inline = en.pedantic) : this.options.gfm && (n.block = In.gfm, this.options.breaks ? n.inline = en.breaks : n.inline = en.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: In, inline: en };
  }
  static lex(t, n) {
    return new vr(n).lex(t);
  }
  static lexInline(t, n) {
    return new vr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Ye.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Ye.tabCharGlobal, "    ").replace(Ye.spaceLine, "")); t; ) {
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
        this.options.extensions.startBlock.forEach((f) => {
          o = f.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
      let f = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, u = t.slice(1), h;
        this.options.extensions.startInline.forEach((m) => {
          h = m.call({ lexer: this }, u), typeof h == "number" && h >= 0 && (c = Math.min(c, h));
        }), c < 1 / 0 && c >= 0 && (f = t.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(f)) {
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
}, xn = class {
  options;
  parser;
  constructor(e) {
    this.options = e || $t;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(Ye.notSpaceStart)?.[0], r = e.replace(Ye.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + yt(i) + '">' + (n ? r : yt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : yt(r, !0)) + `</code></pre>
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
    return `<code>${yt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = vi(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + yt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = vi(e);
    if (r === null) return yt(n);
    e = r;
    let a = `<img src="${e}" alt="${yt(n)}"`;
    return t && (a += ` title="${yt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : yt(e.text);
  }
}, nr = class {
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
}, ct = class Ar {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || $t, this.options.renderer = this.options.renderer || new xn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new nr();
  }
  static parse(t, n) {
    return new Ar(n).parse(t);
  }
  static parseInline(t, n) {
    return new Ar(n).parseInline(t);
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
}, Zt = class {
  options;
  block;
  constructor(e) {
    this.options = e || $t;
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
    return this.block ? lt.lex : lt.lexInline;
  }
  provideParser() {
    return this.block ? ct.parse : ct.parseInline;
  }
}, ka = class {
  defaults = Jn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ct;
  Renderer = xn;
  TextRenderer = nr;
  Lexer = lt;
  Tokenizer = kn;
  Hooks = Zt;
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
        let r = this.defaults.renderer || new xn(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, l = n.renderer[s], o = r[s];
          r[s] = (...f) => {
            let c = l.apply(r, f);
            return c === !1 && (c = o.apply(r, f)), c || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new kn(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, l = n.tokenizer[s], o = r[s];
          r[s] = (...f) => {
            let c = l.apply(r, f);
            return c === !1 && (c = o.apply(r, f)), c;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Zt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          Zt.passThroughHooks.has(a) ? r[s] = (f) => {
            if (this.defaults.async && Zt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await l.call(r, f);
              return o.call(r, u);
            })();
            let c = l.call(r, f);
            return o.call(r, c);
          } : r[s] = (...f) => {
            if (this.defaults.async) return (async () => {
              let u = await l.apply(r, f);
              return u === !1 && (u = await o.apply(r, f)), u;
            })();
            let c = l.apply(r, f);
            return c === !1 && (c = o.apply(r, f)), c;
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
    return lt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return ct.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, l = await (r.hooks ? await r.hooks.provideLexer() : e ? lt.lex : lt.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let f = await (r.hooks ? await r.hooks.provideParser() : e ? ct.parse : ct.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(f) : f;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? lt.lex : lt.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : e ? ct.parse : ct.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + yt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Ht = new ka();
function we(e, t) {
  return Ht.parse(e, t);
}
we.options = we.setOptions = function(e) {
  return Ht.setOptions(e), we.defaults = Ht.defaults, ca(we.defaults), we;
};
we.getDefaults = Jn;
we.defaults = $t;
we.use = function(...e) {
  return Ht.use(...e), we.defaults = Ht.defaults, ca(we.defaults), we;
};
we.walkTokens = function(e, t) {
  return Ht.walkTokens(e, t);
};
we.parseInline = Ht.parseInline;
we.Parser = ct;
we.parser = ct.parse;
we.Renderer = xn;
we.TextRenderer = nr;
we.Lexer = lt;
we.lexer = lt.lex;
we.Tokenizer = kn;
we.Hooks = Zt;
we.parse = we;
var zo = we.options, Io = we.setOptions, Oo = we.use, No = we.walkTokens, Bo = we.parseInline, qo = we, Do = ct.parse, jo = lt.lex;
const Li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Zt,
  Lexer: lt,
  Marked: ka,
  Parser: ct,
  Renderer: xn,
  TextRenderer: nr,
  Tokenizer: kn,
  get defaults() {
    return $t;
  },
  getDefaults: Jn,
  lexer: jo,
  marked: we,
  options: zo,
  parse: qo,
  parseInline: Bo,
  parser: Do,
  setOptions: Io,
  use: Oo,
  walkTokens: No
}, Symbol.toStringTag, { value: "Module" })), xa = `function O() {
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
`, Mi = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", xa], { type: "text/javascript;charset=utf-8" });
function Ho(e) {
  let t;
  try {
    if (t = Mi && (self.URL || self.webkitURL).createObjectURL(Mi), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(xa),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Xn(e) {
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
const hn = Li && (we || Li) || void 0;
let Xe = null;
const Uo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function Kn() {
  if (Xe) return Xe;
  try {
    try {
      const e = await import(Uo + "/lib/core.js");
      Xe = e.default || e;
    } catch {
      Xe = null;
    }
  } catch {
    Xe = null;
  }
  return Xe;
}
hn && typeof hn.setOptions == "function" && hn.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Xe && t && typeof Xe.getLanguage == "function" && Xe.getLanguage(t) ? Xe.highlight(e, { language: t }).value : Xe && typeof Xe.getLanguage == "function" && Xe.getLanguage("plaintext") ? Xe.highlight(e, { language: "plaintext" }).value : e;
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
        if (!await Kn()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const m = await import(u), d = m.default || m;
        Xe.registerLanguage(c, d), postMessage({ type: "registered", name: c });
      } catch (h) {
        postMessage({ type: "register-error", name: c, error: String(h) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", u = t.supported || [], h = /* @__PURE__ */ new Set(), m = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let d;
      for (; d = m.exec(c); )
        if (d[1]) {
          const g = String(d[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && h.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && h.add(g), u && u.length)
            try {
              u.indexOf(g) !== -1 && h.add(g);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(h) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Xn(i || "");
    await Kn().catch(() => {
    });
    let s = hn.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), f = (c) => {
      try {
        return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, h, m) => {
      const d = Number(u);
      let g = m.replace(/<[^>]+>/g, "").trim();
      try {
        g = Sa(g);
      } catch {
      }
      let y = null;
      const p = (h || "").match(/\sid="([^"]+)"/);
      p && (y = p[1]);
      const w = y || f(g) || "heading", k = (o.get(w) || 0) + 1;
      o.set(w, k);
      const S = k === 1 ? w : w + "-" + k;
      l.push({ level: d, text: g, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, R = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", W = (v[d] + " " + R).trim(), H = ((h || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${W}"`).trim();
      return `<h${d} ${H}>${m}</h${d}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Fo(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: f } = e;
      try {
        if (!await Kn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const u = await import(f), h = u.default || u;
        return Xe.registerLanguage(o, h), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", f = e.supported || [], c = /* @__PURE__ */ new Set(), u = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let h;
      for (; h = u.exec(o); )
        if (h[1]) {
          const m = String(h[1]).toLowerCase();
          if (!m) continue;
          if (m.length >= 5 && m.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(m) && c.add(m), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(m) && c.add(m), f && f.length)
            try {
              f.indexOf(m) !== -1 && c.add(m);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Xn(e && e.md || "");
    await Kn().catch(() => {
    });
    let r = hn.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, f, c, u) => {
      const h = Number(f);
      let m = u.replace(/<[^>]+>/g, "").trim();
      try {
        m = Sa(m);
      } catch {
      }
      let d = null;
      const g = (c || "").match(/\sid="([^"]+)"/);
      g && (d = g[1]);
      const y = d || l(m) || "heading", w = (s.get(y) || 0) + 1;
      s.set(y, w);
      const b = w === 1 ? y : y + "-" + w;
      a.push({ level: h, text: m, id: b });
      const k = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[h] + " " + S).trim(), W = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${v}"`).trim();
      return `<h${h} ${W}>${u}</h${h}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, f) => /\bloading=/.test(f) ? `<img${f}>` : /\bdata-want-lazy=/.test(f) ? `<img${f}>` : `<img${f} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const pr = {
  100: "💯",
  1234: "🔢",
  grinning: "😀",
  grimacing: "😬",
  grin: "😁",
  joy: "😂",
  rofl: "🤣",
  partying: "🥳",
  smiley: "😃",
  smile: "😄",
  sweat_smile: "😅",
  laughing: "😆",
  innocent: "😇",
  wink: "😉",
  blush: "😊",
  slightly_smiling_face: "🙂",
  upside_down_face: "🙃",
  relaxed: "☺️",
  yum: "😋",
  relieved: "😌",
  heart_eyes: "😍",
  smiling_face_with_three_hearts: "🥰",
  kissing_heart: "😘",
  kissing: "😗",
  kissing_smiling_eyes: "😙",
  kissing_closed_eyes: "😚",
  stuck_out_tongue_winking_eye: "😜",
  zany: "🤪",
  raised_eyebrow: "🤨",
  monocle: "🧐",
  stuck_out_tongue_closed_eyes: "😝",
  stuck_out_tongue: "😛",
  money_mouth_face: "🤑",
  nerd_face: "🤓",
  sunglasses: "😎",
  star_struck: "🤩",
  clown_face: "🤡",
  cowboy_hat_face: "🤠",
  hugs: "🤗",
  smirk: "😏",
  no_mouth: "😶",
  neutral_face: "😐",
  expressionless: "😑",
  unamused: "😒",
  roll_eyes: "🙄",
  thinking: "🤔",
  lying_face: "🤥",
  hand_over_mouth: "🤭",
  shushing: "🤫",
  symbols_over_mouth: "🤬",
  exploding_head: "🤯",
  flushed: "😳",
  disappointed: "😞",
  worried: "😟",
  angry: "😠",
  rage: "😡",
  pensive: "😔",
  confused: "😕",
  slightly_frowning_face: "🙁",
  frowning_face: "☹",
  persevere: "😣",
  confounded: "😖",
  tired_face: "😫",
  weary: "😩",
  pleading: "🥺",
  triumph: "😤",
  open_mouth: "😮",
  scream: "😱",
  fearful: "😨",
  cold_sweat: "😰",
  hushed: "😯",
  frowning: "😦",
  anguished: "😧",
  cry: "😢",
  disappointed_relieved: "😥",
  drooling_face: "🤤",
  sleepy: "😪",
  sweat: "😓",
  hot: "🥵",
  cold: "🥶",
  sob: "😭",
  dizzy_face: "😵",
  astonished: "😲",
  zipper_mouth_face: "🤐",
  nauseated_face: "🤢",
  sneezing_face: "🤧",
  vomiting: "🤮",
  mask: "😷",
  face_with_thermometer: "🤒",
  face_with_head_bandage: "🤕",
  woozy: "🥴",
  sleeping: "😴",
  zzz: "💤",
  poop: "💩",
  smiling_imp: "😈",
  imp: "👿",
  japanese_ogre: "👹",
  japanese_goblin: "👺",
  skull: "💀",
  ghost: "👻",
  alien: "👽",
  robot: "🤖",
  smiley_cat: "😺",
  smile_cat: "😸",
  joy_cat: "😹",
  heart_eyes_cat: "😻",
  smirk_cat: "😼",
  kissing_cat: "😽",
  scream_cat: "🙀",
  crying_cat_face: "😿",
  pouting_cat: "😾",
  palms_up: "🤲",
  raised_hands: "🙌",
  clap: "👏",
  wave: "👋",
  call_me_hand: "🤙",
  "+1": "👍",
  "-1": "👎",
  facepunch: "👊",
  fist: "✊",
  fist_left: "🤛",
  fist_right: "🤜",
  v: "✌",
  ok_hand: "👌",
  raised_hand: "✋",
  raised_back_of_hand: "🤚",
  open_hands: "👐",
  muscle: "💪",
  pray: "🙏",
  foot: "🦶",
  leg: "🦵",
  handshake: "🤝",
  point_up: "☝",
  point_up_2: "👆",
  point_down: "👇",
  point_left: "👈",
  point_right: "👉",
  fu: "🖕",
  raised_hand_with_fingers_splayed: "🖐",
  love_you: "🤟",
  metal: "🤘",
  crossed_fingers: "🤞",
  vulcan_salute: "🖖",
  writing_hand: "✍",
  selfie: "🤳",
  nail_care: "💅",
  lips: "👄",
  tooth: "🦷",
  tongue: "👅",
  ear: "👂",
  nose: "👃",
  eye: "👁",
  eyes: "👀",
  brain: "🧠",
  bust_in_silhouette: "👤",
  busts_in_silhouette: "👥",
  speaking_head: "🗣",
  baby: "👶",
  child: "🧒",
  boy: "👦",
  girl: "👧",
  adult: "🧑",
  man: "👨",
  woman: "👩",
  blonde_woman: "👱‍♀️",
  blonde_man: "👱",
  bearded_person: "🧔",
  older_adult: "🧓",
  older_man: "👴",
  older_woman: "👵",
  man_with_gua_pi_mao: "👲",
  woman_with_headscarf: "🧕",
  woman_with_turban: "👳‍♀️",
  man_with_turban: "👳",
  policewoman: "👮‍♀️",
  policeman: "👮",
  construction_worker_woman: "👷‍♀️",
  construction_worker_man: "👷",
  guardswoman: "💂‍♀️",
  guardsman: "💂",
  female_detective: "🕵️‍♀️",
  male_detective: "🕵",
  woman_health_worker: "👩‍⚕️",
  man_health_worker: "👨‍⚕️",
  woman_farmer: "👩‍🌾",
  man_farmer: "👨‍🌾",
  woman_cook: "👩‍🍳",
  man_cook: "👨‍🍳",
  woman_student: "👩‍🎓",
  man_student: "👨‍🎓",
  woman_singer: "👩‍🎤",
  man_singer: "👨‍🎤",
  woman_teacher: "👩‍🏫",
  man_teacher: "👨‍🏫",
  woman_factory_worker: "👩‍🏭",
  man_factory_worker: "👨‍🏭",
  woman_technologist: "👩‍💻",
  man_technologist: "👨‍💻",
  woman_office_worker: "👩‍💼",
  man_office_worker: "👨‍💼",
  woman_mechanic: "👩‍🔧",
  man_mechanic: "👨‍🔧",
  woman_scientist: "👩‍🔬",
  man_scientist: "👨‍🔬",
  woman_artist: "👩‍🎨",
  man_artist: "👨‍🎨",
  woman_firefighter: "👩‍🚒",
  man_firefighter: "👨‍🚒",
  woman_pilot: "👩‍✈️",
  man_pilot: "👨‍✈️",
  woman_astronaut: "👩‍🚀",
  man_astronaut: "👨‍🚀",
  woman_judge: "👩‍⚖️",
  man_judge: "👨‍⚖️",
  woman_superhero: "🦸‍♀️",
  man_superhero: "🦸‍♂️",
  woman_supervillain: "🦹‍♀️",
  man_supervillain: "🦹‍♂️",
  mrs_claus: "🤶",
  santa: "🎅",
  sorceress: "🧙‍♀️",
  wizard: "🧙‍♂️",
  woman_elf: "🧝‍♀️",
  man_elf: "🧝‍♂️",
  woman_vampire: "🧛‍♀️",
  man_vampire: "🧛‍♂️",
  woman_zombie: "🧟‍♀️",
  man_zombie: "🧟‍♂️",
  woman_genie: "🧞‍♀️",
  man_genie: "🧞‍♂️",
  mermaid: "🧜‍♀️",
  merman: "🧜‍♂️",
  woman_fairy: "🧚‍♀️",
  man_fairy: "🧚‍♂️",
  angel: "👼",
  pregnant_woman: "🤰",
  breastfeeding: "🤱",
  princess: "👸",
  prince: "🤴",
  bride_with_veil: "👰",
  man_in_tuxedo: "🤵",
  running_woman: "🏃‍♀️",
  running_man: "🏃",
  walking_woman: "🚶‍♀️",
  walking_man: "🚶",
  dancer: "💃",
  man_dancing: "🕺",
  dancing_women: "👯",
  dancing_men: "👯‍♂️",
  couple: "👫",
  two_men_holding_hands: "👬",
  two_women_holding_hands: "👭",
  bowing_woman: "🙇‍♀️",
  bowing_man: "🙇",
  man_facepalming: "🤦‍♂️",
  woman_facepalming: "🤦‍♀️",
  woman_shrugging: "🤷",
  man_shrugging: "🤷‍♂️",
  tipping_hand_woman: "💁",
  tipping_hand_man: "💁‍♂️",
  no_good_woman: "🙅",
  no_good_man: "🙅‍♂️",
  ok_woman: "🙆",
  ok_man: "🙆‍♂️",
  raising_hand_woman: "🙋",
  raising_hand_man: "🙋‍♂️",
  pouting_woman: "🙎",
  pouting_man: "🙎‍♂️",
  frowning_woman: "🙍",
  frowning_man: "🙍‍♂️",
  haircut_woman: "💇",
  haircut_man: "💇‍♂️",
  massage_woman: "💆",
  massage_man: "💆‍♂️",
  woman_in_steamy_room: "🧖‍♀️",
  man_in_steamy_room: "🧖‍♂️",
  couple_with_heart_woman_man: "💑",
  couple_with_heart_woman_woman: "👩‍❤️‍👩",
  couple_with_heart_man_man: "👨‍❤️‍👨",
  couplekiss_man_woman: "💏",
  couplekiss_woman_woman: "👩‍❤️‍💋‍👩",
  couplekiss_man_man: "👨‍❤️‍💋‍👨",
  family_man_woman_boy: "👪",
  family_man_woman_girl: "👨‍👩‍👧",
  family_man_woman_girl_boy: "👨‍👩‍👧‍👦",
  family_man_woman_boy_boy: "👨‍👩‍👦‍👦",
  family_man_woman_girl_girl: "👨‍👩‍👧‍👧",
  family_woman_woman_boy: "👩‍👩‍👦",
  family_woman_woman_girl: "👩‍👩‍👧",
  family_woman_woman_girl_boy: "👩‍👩‍👧‍👦",
  family_woman_woman_boy_boy: "👩‍👩‍👦‍👦",
  family_woman_woman_girl_girl: "👩‍👩‍👧‍👧",
  family_man_man_boy: "👨‍👨‍👦",
  family_man_man_girl: "👨‍👨‍👧",
  family_man_man_girl_boy: "👨‍👨‍👧‍👦",
  family_man_man_boy_boy: "👨‍👨‍👦‍👦",
  family_man_man_girl_girl: "👨‍👨‍👧‍👧",
  family_woman_boy: "👩‍👦",
  family_woman_girl: "👩‍👧",
  family_woman_girl_boy: "👩‍👧‍👦",
  family_woman_boy_boy: "👩‍👦‍👦",
  family_woman_girl_girl: "👩‍👧‍👧",
  family_man_boy: "👨‍👦",
  family_man_girl: "👨‍👧",
  family_man_girl_boy: "👨‍👧‍👦",
  family_man_boy_boy: "👨‍👦‍👦",
  family_man_girl_girl: "👨‍👧‍👧",
  yarn: "🧶",
  thread: "🧵",
  coat: "🧥",
  labcoat: "🥼",
  womans_clothes: "👚",
  tshirt: "👕",
  jeans: "👖",
  necktie: "👔",
  dress: "👗",
  bikini: "👙",
  kimono: "👘",
  lipstick: "💄",
  kiss: "💋",
  footprints: "👣",
  flat_shoe: "🥿",
  high_heel: "👠",
  sandal: "👡",
  boot: "👢",
  mans_shoe: "👞",
  athletic_shoe: "👟",
  hiking_boot: "🥾",
  socks: "🧦",
  gloves: "🧤",
  scarf: "🧣",
  womans_hat: "👒",
  tophat: "🎩",
  billed_hat: "🧢",
  rescue_worker_helmet: "⛑",
  mortar_board: "🎓",
  crown: "👑",
  school_satchel: "🎒",
  luggage: "🧳",
  pouch: "👝",
  purse: "👛",
  handbag: "👜",
  briefcase: "💼",
  eyeglasses: "👓",
  dark_sunglasses: "🕶",
  goggles: "🥽",
  ring: "💍",
  closed_umbrella: "🌂",
  dog: "🐶",
  cat: "🐱",
  mouse: "🐭",
  hamster: "🐹",
  rabbit: "🐰",
  fox_face: "🦊",
  bear: "🐻",
  panda_face: "🐼",
  koala: "🐨",
  tiger: "🐯",
  lion: "🦁",
  cow: "🐮",
  pig: "🐷",
  pig_nose: "🐽",
  frog: "🐸",
  squid: "🦑",
  octopus: "🐙",
  shrimp: "🦐",
  monkey_face: "🐵",
  gorilla: "🦍",
  see_no_evil: "🙈",
  hear_no_evil: "🙉",
  speak_no_evil: "🙊",
  monkey: "🐒",
  chicken: "🐔",
  penguin: "🐧",
  bird: "🐦",
  baby_chick: "🐤",
  hatching_chick: "🐣",
  hatched_chick: "🐥",
  duck: "🦆",
  eagle: "🦅",
  owl: "🦉",
  bat: "🦇",
  wolf: "🐺",
  boar: "🐗",
  horse: "🐴",
  unicorn: "🦄",
  honeybee: "🐝",
  bug: "🐛",
  butterfly: "🦋",
  snail: "🐌",
  beetle: "🐞",
  ant: "🐜",
  grasshopper: "🦗",
  spider: "🕷",
  scorpion: "🦂",
  crab: "🦀",
  snake: "🐍",
  lizard: "🦎",
  "t-rex": "🦖",
  sauropod: "🦕",
  turtle: "🐢",
  tropical_fish: "🐠",
  fish: "🐟",
  blowfish: "🐡",
  dolphin: "🐬",
  shark: "🦈",
  whale: "🐳",
  whale2: "🐋",
  crocodile: "🐊",
  leopard: "🐆",
  zebra: "🦓",
  tiger2: "🐅",
  water_buffalo: "🐃",
  ox: "🐂",
  cow2: "🐄",
  deer: "🦌",
  dromedary_camel: "🐪",
  camel: "🐫",
  giraffe: "🦒",
  elephant: "🐘",
  rhinoceros: "🦏",
  goat: "🐐",
  ram: "🐏",
  sheep: "🐑",
  racehorse: "🐎",
  pig2: "🐖",
  rat: "🐀",
  mouse2: "🐁",
  rooster: "🐓",
  turkey: "🦃",
  dove: "🕊",
  dog2: "🐕",
  poodle: "🐩",
  cat2: "🐈",
  rabbit2: "🐇",
  chipmunk: "🐿",
  hedgehog: "🦔",
  raccoon: "🦝",
  llama: "🦙",
  hippopotamus: "🦛",
  kangaroo: "🦘",
  badger: "🦡",
  swan: "🦢",
  peacock: "🦚",
  parrot: "🦜",
  lobster: "🦞",
  mosquito: "🦟",
  paw_prints: "🐾",
  dragon: "🐉",
  dragon_face: "🐲",
  cactus: "🌵",
  christmas_tree: "🎄",
  evergreen_tree: "🌲",
  deciduous_tree: "🌳",
  palm_tree: "🌴",
  seedling: "🌱",
  herb: "🌿",
  shamrock: "☘",
  four_leaf_clover: "🍀",
  bamboo: "🎍",
  tanabata_tree: "🎋",
  leaves: "🍃",
  fallen_leaf: "🍂",
  maple_leaf: "🍁",
  ear_of_rice: "🌾",
  hibiscus: "🌺",
  sunflower: "🌻",
  rose: "🌹",
  wilted_flower: "🥀",
  tulip: "🌷",
  blossom: "🌼",
  cherry_blossom: "🌸",
  bouquet: "💐",
  mushroom: "🍄",
  chestnut: "🌰",
  jack_o_lantern: "🎃",
  shell: "🐚",
  spider_web: "🕸",
  earth_americas: "🌎",
  earth_africa: "🌍",
  earth_asia: "🌏",
  full_moon: "🌕",
  waning_gibbous_moon: "🌖",
  last_quarter_moon: "🌗",
  waning_crescent_moon: "🌘",
  new_moon: "🌑",
  waxing_crescent_moon: "🌒",
  first_quarter_moon: "🌓",
  waxing_gibbous_moon: "🌔",
  new_moon_with_face: "🌚",
  full_moon_with_face: "🌝",
  first_quarter_moon_with_face: "🌛",
  last_quarter_moon_with_face: "🌜",
  sun_with_face: "🌞",
  crescent_moon: "🌙",
  star: "⭐",
  star2: "🌟",
  dizzy: "💫",
  sparkles: "✨",
  comet: "☄",
  sunny: "☀️",
  sun_behind_small_cloud: "🌤",
  partly_sunny: "⛅",
  sun_behind_large_cloud: "🌥",
  sun_behind_rain_cloud: "🌦",
  cloud: "☁️",
  cloud_with_rain: "🌧",
  cloud_with_lightning_and_rain: "⛈",
  cloud_with_lightning: "🌩",
  zap: "⚡",
  fire: "🔥",
  boom: "💥",
  snowflake: "❄️",
  cloud_with_snow: "🌨",
  snowman: "⛄",
  snowman_with_snow: "☃",
  wind_face: "🌬",
  dash: "💨",
  tornado: "🌪",
  fog: "🌫",
  open_umbrella: "☂",
  umbrella: "☔",
  droplet: "💧",
  sweat_drops: "💦",
  ocean: "🌊",
  green_apple: "🍏",
  apple: "🍎",
  pear: "🍐",
  tangerine: "🍊",
  lemon: "🍋",
  banana: "🍌",
  watermelon: "🍉",
  grapes: "🍇",
  strawberry: "🍓",
  melon: "🍈",
  cherries: "🍒",
  peach: "🍑",
  pineapple: "🍍",
  coconut: "🥥",
  kiwi_fruit: "🥝",
  mango: "🥭",
  avocado: "🥑",
  broccoli: "🥦",
  tomato: "🍅",
  eggplant: "🍆",
  cucumber: "🥒",
  carrot: "🥕",
  hot_pepper: "🌶",
  potato: "🥔",
  corn: "🌽",
  leafy_greens: "🥬",
  sweet_potato: "🍠",
  peanuts: "🥜",
  honey_pot: "🍯",
  croissant: "🥐",
  bread: "🍞",
  baguette_bread: "🥖",
  bagel: "🥯",
  pretzel: "🥨",
  cheese: "🧀",
  egg: "🥚",
  bacon: "🥓",
  steak: "🥩",
  pancakes: "🥞",
  poultry_leg: "🍗",
  meat_on_bone: "🍖",
  bone: "🦴",
  fried_shrimp: "🍤",
  fried_egg: "🍳",
  hamburger: "🍔",
  fries: "🍟",
  stuffed_flatbread: "🥙",
  hotdog: "🌭",
  pizza: "🍕",
  sandwich: "🥪",
  canned_food: "🥫",
  spaghetti: "🍝",
  taco: "🌮",
  burrito: "🌯",
  green_salad: "🥗",
  shallow_pan_of_food: "🥘",
  ramen: "🍜",
  stew: "🍲",
  fish_cake: "🍥",
  fortune_cookie: "🥠",
  sushi: "🍣",
  bento: "🍱",
  curry: "🍛",
  rice_ball: "🍙",
  rice: "🍚",
  rice_cracker: "🍘",
  oden: "🍢",
  dango: "🍡",
  shaved_ice: "🍧",
  ice_cream: "🍨",
  icecream: "🍦",
  pie: "🥧",
  cake: "🍰",
  cupcake: "🧁",
  moon_cake: "🥮",
  birthday: "🎂",
  custard: "🍮",
  candy: "🍬",
  lollipop: "🍭",
  chocolate_bar: "🍫",
  popcorn: "🍿",
  dumpling: "🥟",
  doughnut: "🍩",
  cookie: "🍪",
  milk_glass: "🥛",
  beer: "🍺",
  beers: "🍻",
  clinking_glasses: "🥂",
  wine_glass: "🍷",
  tumbler_glass: "🥃",
  cocktail: "🍸",
  tropical_drink: "🍹",
  champagne: "🍾",
  sake: "🍶",
  tea: "🍵",
  cup_with_straw: "🥤",
  coffee: "☕",
  baby_bottle: "🍼",
  salt: "🧂",
  spoon: "🥄",
  fork_and_knife: "🍴",
  plate_with_cutlery: "🍽",
  bowl_with_spoon: "🥣",
  takeout_box: "🥡",
  chopsticks: "🥢",
  soccer: "⚽",
  basketball: "🏀",
  football: "🏈",
  baseball: "⚾",
  softball: "🥎",
  tennis: "🎾",
  volleyball: "🏐",
  rugby_football: "🏉",
  flying_disc: "🥏",
  "8ball": "🎱",
  golf: "⛳",
  golfing_woman: "🏌️‍♀️",
  golfing_man: "🏌",
  ping_pong: "🏓",
  badminton: "🏸",
  goal_net: "🥅",
  ice_hockey: "🏒",
  field_hockey: "🏑",
  lacrosse: "🥍",
  cricket: "🏏",
  ski: "🎿",
  skier: "⛷",
  snowboarder: "🏂",
  person_fencing: "🤺",
  women_wrestling: "🤼‍♀️",
  men_wrestling: "🤼‍♂️",
  woman_cartwheeling: "🤸‍♀️",
  man_cartwheeling: "🤸‍♂️",
  woman_playing_handball: "🤾‍♀️",
  man_playing_handball: "🤾‍♂️",
  ice_skate: "⛸",
  curling_stone: "🥌",
  skateboard: "🛹",
  sled: "🛷",
  bow_and_arrow: "🏹",
  fishing_pole_and_fish: "🎣",
  boxing_glove: "🥊",
  martial_arts_uniform: "🥋",
  rowing_woman: "🚣‍♀️",
  rowing_man: "🚣",
  climbing_woman: "🧗‍♀️",
  climbing_man: "🧗‍♂️",
  swimming_woman: "🏊‍♀️",
  swimming_man: "🏊",
  woman_playing_water_polo: "🤽‍♀️",
  man_playing_water_polo: "🤽‍♂️",
  woman_in_lotus_position: "🧘‍♀️",
  man_in_lotus_position: "🧘‍♂️",
  surfing_woman: "🏄‍♀️",
  surfing_man: "🏄",
  bath: "🛀",
  basketball_woman: "⛹️‍♀️",
  basketball_man: "⛹",
  weight_lifting_woman: "🏋️‍♀️",
  weight_lifting_man: "🏋",
  biking_woman: "🚴‍♀️",
  biking_man: "🚴",
  mountain_biking_woman: "🚵‍♀️",
  mountain_biking_man: "🚵",
  horse_racing: "🏇",
  business_suit_levitating: "🕴",
  trophy: "🏆",
  running_shirt_with_sash: "🎽",
  medal_sports: "🏅",
  medal_military: "🎖",
  "1st_place_medal": "🥇",
  "2nd_place_medal": "🥈",
  "3rd_place_medal": "🥉",
  reminder_ribbon: "🎗",
  rosette: "🏵",
  ticket: "🎫",
  tickets: "🎟",
  performing_arts: "🎭",
  art: "🎨",
  circus_tent: "🎪",
  woman_juggling: "🤹‍♀️",
  man_juggling: "🤹‍♂️",
  microphone: "🎤",
  headphones: "🎧",
  musical_score: "🎼",
  musical_keyboard: "🎹",
  drum: "🥁",
  saxophone: "🎷",
  trumpet: "🎺",
  guitar: "🎸",
  violin: "🎻",
  clapper: "🎬",
  video_game: "🎮",
  space_invader: "👾",
  dart: "🎯",
  game_die: "🎲",
  chess_pawn: "♟",
  slot_machine: "🎰",
  jigsaw: "🧩",
  bowling: "🎳",
  red_car: "🚗",
  taxi: "🚕",
  blue_car: "🚙",
  bus: "🚌",
  trolleybus: "🚎",
  racing_car: "🏎",
  police_car: "🚓",
  ambulance: "🚑",
  fire_engine: "🚒",
  minibus: "🚐",
  truck: "🚚",
  articulated_lorry: "🚛",
  tractor: "🚜",
  kick_scooter: "🛴",
  motorcycle: "🏍",
  bike: "🚲",
  motor_scooter: "🛵",
  rotating_light: "🚨",
  oncoming_police_car: "🚔",
  oncoming_bus: "🚍",
  oncoming_automobile: "🚘",
  oncoming_taxi: "🚖",
  aerial_tramway: "🚡",
  mountain_cableway: "🚠",
  suspension_railway: "🚟",
  railway_car: "🚃",
  train: "🚋",
  monorail: "🚝",
  bullettrain_side: "🚄",
  bullettrain_front: "🚅",
  light_rail: "🚈",
  mountain_railway: "🚞",
  steam_locomotive: "🚂",
  train2: "🚆",
  metro: "🚇",
  tram: "🚊",
  station: "🚉",
  flying_saucer: "🛸",
  helicopter: "🚁",
  small_airplane: "🛩",
  airplane: "✈️",
  flight_departure: "🛫",
  flight_arrival: "🛬",
  sailboat: "⛵",
  motor_boat: "🛥",
  speedboat: "🚤",
  ferry: "⛴",
  passenger_ship: "🛳",
  rocket: "🚀",
  artificial_satellite: "🛰",
  seat: "💺",
  canoe: "🛶",
  anchor: "⚓",
  construction: "🚧",
  fuelpump: "⛽",
  busstop: "🚏",
  vertical_traffic_light: "🚦",
  traffic_light: "🚥",
  checkered_flag: "🏁",
  ship: "🚢",
  ferris_wheel: "🎡",
  roller_coaster: "🎢",
  carousel_horse: "🎠",
  building_construction: "🏗",
  foggy: "🌁",
  tokyo_tower: "🗼",
  factory: "🏭",
  fountain: "⛲",
  rice_scene: "🎑",
  mountain: "⛰",
  mountain_snow: "🏔",
  mount_fuji: "🗻",
  volcano: "🌋",
  japan: "🗾",
  camping: "🏕",
  tent: "⛺",
  national_park: "🏞",
  motorway: "🛣",
  railway_track: "🛤",
  sunrise: "🌅",
  sunrise_over_mountains: "🌄",
  desert: "🏜",
  beach_umbrella: "🏖",
  desert_island: "🏝",
  city_sunrise: "🌇",
  city_sunset: "🌆",
  cityscape: "🏙",
  night_with_stars: "🌃",
  bridge_at_night: "🌉",
  milky_way: "🌌",
  stars: "🌠",
  sparkler: "🎇",
  fireworks: "🎆",
  rainbow: "🌈",
  houses: "🏘",
  european_castle: "🏰",
  japanese_castle: "🏯",
  stadium: "🏟",
  statue_of_liberty: "🗽",
  house: "🏠",
  house_with_garden: "🏡",
  derelict_house: "🏚",
  office: "🏢",
  department_store: "🏬",
  post_office: "🏣",
  european_post_office: "🏤",
  hospital: "🏥",
  bank: "🏦",
  hotel: "🏨",
  convenience_store: "🏪",
  school: "🏫",
  love_hotel: "🏩",
  wedding: "💒",
  classical_building: "🏛",
  church: "⛪",
  mosque: "🕌",
  synagogue: "🕍",
  kaaba: "🕋",
  shinto_shrine: "⛩",
  watch: "⌚",
  iphone: "📱",
  calling: "📲",
  computer: "💻",
  keyboard: "⌨",
  desktop_computer: "🖥",
  printer: "🖨",
  computer_mouse: "🖱",
  trackball: "🖲",
  joystick: "🕹",
  clamp: "🗜",
  minidisc: "💽",
  floppy_disk: "💾",
  cd: "💿",
  dvd: "📀",
  vhs: "📼",
  camera: "📷",
  camera_flash: "📸",
  video_camera: "📹",
  movie_camera: "🎥",
  film_projector: "📽",
  film_strip: "🎞",
  telephone_receiver: "📞",
  phone: "☎️",
  pager: "📟",
  fax: "📠",
  tv: "📺",
  radio: "📻",
  studio_microphone: "🎙",
  level_slider: "🎚",
  control_knobs: "🎛",
  compass: "🧭",
  stopwatch: "⏱",
  timer_clock: "⏲",
  alarm_clock: "⏰",
  mantelpiece_clock: "🕰",
  hourglass_flowing_sand: "⏳",
  hourglass: "⌛",
  satellite: "📡",
  battery: "🔋",
  electric_plug: "🔌",
  bulb: "💡",
  flashlight: "🔦",
  candle: "🕯",
  fire_extinguisher: "🧯",
  wastebasket: "🗑",
  oil_drum: "🛢",
  money_with_wings: "💸",
  dollar: "💵",
  yen: "💴",
  euro: "💶",
  pound: "💷",
  moneybag: "💰",
  credit_card: "💳",
  gem: "💎",
  balance_scale: "⚖",
  toolbox: "🧰",
  wrench: "🔧",
  hammer: "🔨",
  hammer_and_pick: "⚒",
  hammer_and_wrench: "🛠",
  pick: "⛏",
  nut_and_bolt: "🔩",
  gear: "⚙",
  brick: "🧱",
  chains: "⛓",
  magnet: "🧲",
  gun: "🔫",
  bomb: "💣",
  firecracker: "🧨",
  hocho: "🔪",
  dagger: "🗡",
  crossed_swords: "⚔",
  shield: "🛡",
  smoking: "🚬",
  skull_and_crossbones: "☠",
  coffin: "⚰",
  funeral_urn: "⚱",
  amphora: "🏺",
  crystal_ball: "🔮",
  prayer_beads: "📿",
  nazar_amulet: "🧿",
  barber: "💈",
  alembic: "⚗",
  telescope: "🔭",
  microscope: "🔬",
  hole: "🕳",
  pill: "💊",
  syringe: "💉",
  dna: "🧬",
  microbe: "🦠",
  petri_dish: "🧫",
  test_tube: "🧪",
  thermometer: "🌡",
  broom: "🧹",
  basket: "🧺",
  toilet_paper: "🧻",
  label: "🏷",
  bookmark: "🔖",
  toilet: "🚽",
  shower: "🚿",
  bathtub: "🛁",
  soap: "🧼",
  sponge: "🧽",
  lotion_bottle: "🧴",
  key: "🔑",
  old_key: "🗝",
  couch_and_lamp: "🛋",
  sleeping_bed: "🛌",
  bed: "🛏",
  door: "🚪",
  bellhop_bell: "🛎",
  teddy_bear: "🧸",
  framed_picture: "🖼",
  world_map: "🗺",
  parasol_on_ground: "⛱",
  moyai: "🗿",
  shopping: "🛍",
  shopping_cart: "🛒",
  balloon: "🎈",
  flags: "🎏",
  ribbon: "🎀",
  gift: "🎁",
  confetti_ball: "🎊",
  tada: "🎉",
  dolls: "🎎",
  wind_chime: "🎐",
  crossed_flags: "🎌",
  izakaya_lantern: "🏮",
  red_envelope: "🧧",
  email: "✉️",
  envelope_with_arrow: "📩",
  incoming_envelope: "📨",
  "e-mail": "📧",
  love_letter: "💌",
  postbox: "📮",
  mailbox_closed: "📪",
  mailbox: "📫",
  mailbox_with_mail: "📬",
  mailbox_with_no_mail: "📭",
  package: "📦",
  postal_horn: "📯",
  inbox_tray: "📥",
  outbox_tray: "📤",
  scroll: "📜",
  page_with_curl: "📃",
  bookmark_tabs: "📑",
  receipt: "🧾",
  bar_chart: "📊",
  chart_with_upwards_trend: "📈",
  chart_with_downwards_trend: "📉",
  page_facing_up: "📄",
  date: "📅",
  calendar: "📆",
  spiral_calendar: "🗓",
  card_index: "📇",
  card_file_box: "🗃",
  ballot_box: "🗳",
  file_cabinet: "🗄",
  clipboard: "📋",
  spiral_notepad: "🗒",
  file_folder: "📁",
  open_file_folder: "📂",
  card_index_dividers: "🗂",
  newspaper_roll: "🗞",
  newspaper: "📰",
  notebook: "📓",
  closed_book: "📕",
  green_book: "📗",
  blue_book: "📘",
  orange_book: "📙",
  notebook_with_decorative_cover: "📔",
  ledger: "📒",
  books: "📚",
  open_book: "📖",
  safety_pin: "🧷",
  link: "🔗",
  paperclip: "📎",
  paperclips: "🖇",
  scissors: "✂️",
  triangular_ruler: "📐",
  straight_ruler: "📏",
  abacus: "🧮",
  pushpin: "📌",
  round_pushpin: "📍",
  triangular_flag_on_post: "🚩",
  white_flag: "🏳",
  black_flag: "🏴",
  rainbow_flag: "🏳️‍🌈",
  closed_lock_with_key: "🔐",
  lock: "🔒",
  unlock: "🔓",
  lock_with_ink_pen: "🔏",
  pen: "🖊",
  fountain_pen: "🖋",
  black_nib: "✒️",
  memo: "📝",
  pencil2: "✏️",
  crayon: "🖍",
  paintbrush: "🖌",
  mag: "🔍",
  mag_right: "🔎",
  heart: "❤️",
  orange_heart: "🧡",
  yellow_heart: "💛",
  green_heart: "💚",
  blue_heart: "💙",
  purple_heart: "💜",
  black_heart: "🖤",
  broken_heart: "💔",
  heavy_heart_exclamation: "❣",
  two_hearts: "💕",
  revolving_hearts: "💞",
  heartbeat: "💓",
  heartpulse: "💗",
  sparkling_heart: "💖",
  cupid: "💘",
  gift_heart: "💝",
  heart_decoration: "💟",
  peace_symbol: "☮",
  latin_cross: "✝",
  star_and_crescent: "☪",
  om: "🕉",
  wheel_of_dharma: "☸",
  star_of_david: "✡",
  six_pointed_star: "🔯",
  menorah: "🕎",
  yin_yang: "☯",
  orthodox_cross: "☦",
  place_of_worship: "🛐",
  ophiuchus: "⛎",
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpius: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
  id: "🆔",
  atom_symbol: "⚛",
  u7a7a: "🈳",
  u5272: "🈹",
  radioactive: "☢",
  biohazard: "☣",
  mobile_phone_off: "📴",
  vibration_mode: "📳",
  u6709: "🈶",
  u7121: "🈚",
  u7533: "🈸",
  u55b6: "🈺",
  u6708: "🈷️",
  eight_pointed_black_star: "✴️",
  vs: "🆚",
  accept: "🉑",
  white_flower: "💮",
  ideograph_advantage: "🉐",
  secret: "㊙️",
  congratulations: "㊗️",
  u5408: "🈴",
  u6e80: "🈵",
  u7981: "🈲",
  a: "🅰️",
  b: "🅱️",
  ab: "🆎",
  cl: "🆑",
  o2: "🅾️",
  sos: "🆘",
  no_entry: "⛔",
  name_badge: "📛",
  no_entry_sign: "🚫",
  x: "❌",
  o: "⭕",
  stop_sign: "🛑",
  anger: "💢",
  hotsprings: "♨️",
  no_pedestrians: "🚷",
  do_not_litter: "🚯",
  no_bicycles: "🚳",
  "non-potable_water": "🚱",
  underage: "🔞",
  no_mobile_phones: "📵",
  exclamation: "❗",
  grey_exclamation: "❕",
  question: "❓",
  grey_question: "❔",
  bangbang: "‼️",
  interrobang: "⁉️",
  low_brightness: "🔅",
  high_brightness: "🔆",
  trident: "🔱",
  fleur_de_lis: "⚜",
  part_alternation_mark: "〽️",
  warning: "⚠️",
  children_crossing: "🚸",
  beginner: "🔰",
  recycle: "♻️",
  u6307: "🈯",
  chart: "💹",
  sparkle: "❇️",
  eight_spoked_asterisk: "✳️",
  negative_squared_cross_mark: "❎",
  white_check_mark: "✅",
  diamond_shape_with_a_dot_inside: "💠",
  cyclone: "🌀",
  loop: "➿",
  globe_with_meridians: "🌐",
  m: "Ⓜ️",
  atm: "🏧",
  sa: "🈂️",
  passport_control: "🛂",
  customs: "🛃",
  baggage_claim: "🛄",
  left_luggage: "🛅",
  wheelchair: "♿",
  no_smoking: "🚭",
  wc: "🚾",
  parking: "🅿️",
  potable_water: "🚰",
  mens: "🚹",
  womens: "🚺",
  baby_symbol: "🚼",
  restroom: "🚻",
  put_litter_in_its_place: "🚮",
  cinema: "🎦",
  signal_strength: "📶",
  koko: "🈁",
  ng: "🆖",
  ok: "🆗",
  up: "🆙",
  cool: "🆒",
  new: "🆕",
  free: "🆓",
  zero: "0️⃣",
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
  six: "6️⃣",
  seven: "7️⃣",
  eight: "8️⃣",
  nine: "9️⃣",
  keycap_ten: "🔟",
  asterisk: "*⃣",
  eject_button: "⏏️",
  arrow_forward: "▶️",
  pause_button: "⏸",
  next_track_button: "⏭",
  stop_button: "⏹",
  record_button: "⏺",
  play_or_pause_button: "⏯",
  previous_track_button: "⏮",
  fast_forward: "⏩",
  rewind: "⏪",
  twisted_rightwards_arrows: "🔀",
  repeat: "🔁",
  repeat_one: "🔂",
  arrow_backward: "◀️",
  arrow_up_small: "🔼",
  arrow_down_small: "🔽",
  arrow_double_up: "⏫",
  arrow_double_down: "⏬",
  arrow_right: "➡️",
  arrow_left: "⬅️",
  arrow_up: "⬆️",
  arrow_down: "⬇️",
  arrow_upper_right: "↗️",
  arrow_lower_right: "↘️",
  arrow_lower_left: "↙️",
  arrow_upper_left: "↖️",
  arrow_up_down: "↕️",
  left_right_arrow: "↔️",
  arrows_counterclockwise: "🔄",
  arrow_right_hook: "↪️",
  leftwards_arrow_with_hook: "↩️",
  arrow_heading_up: "⤴️",
  arrow_heading_down: "⤵️",
  hash: "#️⃣",
  information_source: "ℹ️",
  abc: "🔤",
  abcd: "🔡",
  capital_abcd: "🔠",
  symbols: "🔣",
  musical_note: "🎵",
  notes: "🎶",
  wavy_dash: "〰️",
  curly_loop: "➰",
  heavy_check_mark: "✔️",
  arrows_clockwise: "🔃",
  heavy_plus_sign: "➕",
  heavy_minus_sign: "➖",
  heavy_division_sign: "➗",
  heavy_multiplication_x: "✖️",
  infinity: "♾",
  heavy_dollar_sign: "💲",
  currency_exchange: "💱",
  copyright: "©️",
  registered: "®️",
  tm: "™️",
  end: "🔚",
  back: "🔙",
  on: "🔛",
  top: "🔝",
  soon: "🔜",
  ballot_box_with_check: "☑️",
  radio_button: "🔘",
  white_circle: "⚪",
  black_circle: "⚫",
  red_circle: "🔴",
  large_blue_circle: "🔵",
  small_orange_diamond: "🔸",
  small_blue_diamond: "🔹",
  large_orange_diamond: "🔶",
  large_blue_diamond: "🔷",
  small_red_triangle: "🔺",
  black_small_square: "▪️",
  white_small_square: "▫️",
  black_large_square: "⬛",
  white_large_square: "⬜",
  small_red_triangle_down: "🔻",
  black_medium_square: "◼️",
  white_medium_square: "◻️",
  black_medium_small_square: "◾",
  white_medium_small_square: "◽",
  black_square_button: "🔲",
  white_square_button: "🔳",
  speaker: "🔈",
  sound: "🔉",
  loud_sound: "🔊",
  mute: "🔇",
  mega: "📣",
  loudspeaker: "📢",
  bell: "🔔",
  no_bell: "🔕",
  black_joker: "🃏",
  mahjong: "🀄",
  spades: "♠️",
  clubs: "♣️",
  hearts: "♥️",
  diamonds: "♦️",
  flower_playing_cards: "🎴",
  thought_balloon: "💭",
  right_anger_bubble: "🗯",
  speech_balloon: "💬",
  left_speech_bubble: "🗨",
  clock1: "🕐",
  clock2: "🕑",
  clock3: "🕒",
  clock4: "🕓",
  clock5: "🕔",
  clock6: "🕕",
  clock7: "🕖",
  clock8: "🕗",
  clock9: "🕘",
  clock10: "🕙",
  clock11: "🕚",
  clock12: "🕛",
  clock130: "🕜",
  clock230: "🕝",
  clock330: "🕞",
  clock430: "🕟",
  clock530: "🕠",
  clock630: "🕡",
  clock730: "🕢",
  clock830: "🕣",
  clock930: "🕤",
  clock1030: "🕥",
  clock1130: "🕦",
  clock1230: "🕧",
  afghanistan: "🇦🇫",
  aland_islands: "🇦🇽",
  albania: "🇦🇱",
  algeria: "🇩🇿",
  american_samoa: "🇦🇸",
  andorra: "🇦🇩",
  angola: "🇦🇴",
  anguilla: "🇦🇮",
  antarctica: "🇦🇶",
  antigua_barbuda: "🇦🇬",
  argentina: "🇦🇷",
  armenia: "🇦🇲",
  aruba: "🇦🇼",
  australia: "🇦🇺",
  austria: "🇦🇹",
  azerbaijan: "🇦🇿",
  bahamas: "🇧🇸",
  bahrain: "🇧🇭",
  bangladesh: "🇧🇩",
  barbados: "🇧🇧",
  belarus: "🇧🇾",
  belgium: "🇧🇪",
  belize: "🇧🇿",
  benin: "🇧🇯",
  bermuda: "🇧🇲",
  bhutan: "🇧🇹",
  bolivia: "🇧🇴",
  caribbean_netherlands: "🇧🇶",
  bosnia_herzegovina: "🇧🇦",
  botswana: "🇧🇼",
  brazil: "🇧🇷",
  british_indian_ocean_territory: "🇮🇴",
  british_virgin_islands: "🇻🇬",
  brunei: "🇧🇳",
  bulgaria: "🇧🇬",
  burkina_faso: "🇧🇫",
  burundi: "🇧🇮",
  cape_verde: "🇨🇻",
  cambodia: "🇰🇭",
  cameroon: "🇨🇲",
  canada: "🇨🇦",
  canary_islands: "🇮🇨",
  cayman_islands: "🇰🇾",
  central_african_republic: "🇨🇫",
  chad: "🇹🇩",
  chile: "🇨🇱",
  cn: "🇨🇳",
  christmas_island: "🇨🇽",
  cocos_islands: "🇨🇨",
  colombia: "🇨🇴",
  comoros: "🇰🇲",
  congo_brazzaville: "🇨🇬",
  congo_kinshasa: "🇨🇩",
  cook_islands: "🇨🇰",
  costa_rica: "🇨🇷",
  croatia: "🇭🇷",
  cuba: "🇨🇺",
  curacao: "🇨🇼",
  cyprus: "🇨🇾",
  czech_republic: "🇨🇿",
  denmark: "🇩🇰",
  djibouti: "🇩🇯",
  dominica: "🇩🇲",
  dominican_republic: "🇩🇴",
  ecuador: "🇪🇨",
  egypt: "🇪🇬",
  el_salvador: "🇸🇻",
  equatorial_guinea: "🇬🇶",
  eritrea: "🇪🇷",
  estonia: "🇪🇪",
  ethiopia: "🇪🇹",
  eu: "🇪🇺",
  falkland_islands: "🇫🇰",
  faroe_islands: "🇫🇴",
  fiji: "🇫🇯",
  finland: "🇫🇮",
  fr: "🇫🇷",
  french_guiana: "🇬🇫",
  french_polynesia: "🇵🇫",
  french_southern_territories: "🇹🇫",
  gabon: "🇬🇦",
  gambia: "🇬🇲",
  georgia: "🇬🇪",
  de: "🇩🇪",
  ghana: "🇬🇭",
  gibraltar: "🇬🇮",
  greece: "🇬🇷",
  greenland: "🇬🇱",
  grenada: "🇬🇩",
  guadeloupe: "🇬🇵",
  guam: "🇬🇺",
  guatemala: "🇬🇹",
  guernsey: "🇬🇬",
  guinea: "🇬🇳",
  guinea_bissau: "🇬🇼",
  guyana: "🇬🇾",
  haiti: "🇭🇹",
  honduras: "🇭🇳",
  hong_kong: "🇭🇰",
  hungary: "🇭🇺",
  iceland: "🇮🇸",
  india: "🇮🇳",
  indonesia: "🇮🇩",
  iran: "🇮🇷",
  iraq: "🇮🇶",
  ireland: "🇮🇪",
  isle_of_man: "🇮🇲",
  israel: "🇮🇱",
  it: "🇮🇹",
  cote_divoire: "🇨🇮",
  jamaica: "🇯🇲",
  jp: "🇯🇵",
  jersey: "🇯🇪",
  jordan: "🇯🇴",
  kazakhstan: "🇰🇿",
  kenya: "🇰🇪",
  kiribati: "🇰🇮",
  kosovo: "🇽🇰",
  kuwait: "🇰🇼",
  kyrgyzstan: "🇰🇬",
  laos: "🇱🇦",
  latvia: "🇱🇻",
  lebanon: "🇱🇧",
  lesotho: "🇱🇸",
  liberia: "🇱🇷",
  libya: "🇱🇾",
  liechtenstein: "🇱🇮",
  lithuania: "🇱🇹",
  luxembourg: "🇱🇺",
  macau: "🇲🇴",
  macedonia: "🇲🇰",
  madagascar: "🇲🇬",
  malawi: "🇲🇼",
  malaysia: "🇲🇾",
  maldives: "🇲🇻",
  mali: "🇲🇱",
  malta: "🇲🇹",
  marshall_islands: "🇲🇭",
  martinique: "🇲🇶",
  mauritania: "🇲🇷",
  mauritius: "🇲🇺",
  mayotte: "🇾🇹",
  mexico: "🇲🇽",
  micronesia: "🇫🇲",
  moldova: "🇲🇩",
  monaco: "🇲🇨",
  mongolia: "🇲🇳",
  montenegro: "🇲🇪",
  montserrat: "🇲🇸",
  morocco: "🇲🇦",
  mozambique: "🇲🇿",
  myanmar: "🇲🇲",
  namibia: "🇳🇦",
  nauru: "🇳🇷",
  nepal: "🇳🇵",
  netherlands: "🇳🇱",
  new_caledonia: "🇳🇨",
  new_zealand: "🇳🇿",
  nicaragua: "🇳🇮",
  niger: "🇳🇪",
  nigeria: "🇳🇬",
  niue: "🇳🇺",
  norfolk_island: "🇳🇫",
  northern_mariana_islands: "🇲🇵",
  north_korea: "🇰🇵",
  norway: "🇳🇴",
  oman: "🇴🇲",
  pakistan: "🇵🇰",
  palau: "🇵🇼",
  palestinian_territories: "🇵🇸",
  panama: "🇵🇦",
  papua_new_guinea: "🇵🇬",
  paraguay: "🇵🇾",
  peru: "🇵🇪",
  philippines: "🇵🇭",
  pitcairn_islands: "🇵🇳",
  poland: "🇵🇱",
  portugal: "🇵🇹",
  puerto_rico: "🇵🇷",
  qatar: "🇶🇦",
  reunion: "🇷🇪",
  romania: "🇷🇴",
  ru: "🇷🇺",
  rwanda: "🇷🇼",
  st_barthelemy: "🇧🇱",
  st_helena: "🇸🇭",
  st_kitts_nevis: "🇰🇳",
  st_lucia: "🇱🇨",
  st_pierre_miquelon: "🇵🇲",
  st_vincent_grenadines: "🇻🇨",
  samoa: "🇼🇸",
  san_marino: "🇸🇲",
  sao_tome_principe: "🇸🇹",
  saudi_arabia: "🇸🇦",
  senegal: "🇸🇳",
  serbia: "🇷🇸",
  seychelles: "🇸🇨",
  sierra_leone: "🇸🇱",
  singapore: "🇸🇬",
  sint_maarten: "🇸🇽",
  slovakia: "🇸🇰",
  slovenia: "🇸🇮",
  solomon_islands: "🇸🇧",
  somalia: "🇸🇴",
  south_africa: "🇿🇦",
  south_georgia_south_sandwich_islands: "🇬🇸",
  kr: "🇰🇷",
  south_sudan: "🇸🇸",
  es: "🇪🇸",
  sri_lanka: "🇱🇰",
  sudan: "🇸🇩",
  suriname: "🇸🇷",
  swaziland: "🇸🇿",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  syria: "🇸🇾",
  taiwan: "🇹🇼",
  tajikistan: "🇹🇯",
  tanzania: "🇹🇿",
  thailand: "🇹🇭",
  timor_leste: "🇹🇱",
  togo: "🇹🇬",
  tokelau: "🇹🇰",
  tonga: "🇹🇴",
  trinidad_tobago: "🇹🇹",
  tunisia: "🇹🇳",
  tr: "🇹🇷",
  turkmenistan: "🇹🇲",
  turks_caicos_islands: "🇹🇨",
  tuvalu: "🇹🇻",
  uganda: "🇺🇬",
  ukraine: "🇺🇦",
  united_arab_emirates: "🇦🇪",
  uk: "🇬🇧",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  us: "🇺🇸",
  us_virgin_islands: "🇻🇮",
  uruguay: "🇺🇾",
  uzbekistan: "🇺🇿",
  vanuatu: "🇻🇺",
  vatican_city: "🇻🇦",
  venezuela: "🇻🇪",
  vietnam: "🇻🇳",
  wallis_futuna: "🇼🇫",
  western_sahara: "🇪🇭",
  yemen: "🇾🇪",
  zambia: "🇿🇲",
  zimbabwe: "🇿🇼",
  united_nations: "🇺🇳",
  pirate_flag: "🏴‍☠️"
};
let On = typeof DOMParser < "u" ? new DOMParser() : null;
function Ut() {
  return On || (typeof DOMParser < "u" ? (On = new DOMParser(), On) : null);
}
const Wo = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Zo() {
  if (typeof Worker < "u")
    try {
      return new Ho();
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
          const r = { data: await Fo(n) }(e.message || []).forEach((a) => a(r));
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
const va = Zi(() => Zo(), "markdown", Wo), qt = () => va.get(), Zr = (e, t = 3e3) => va.send(e, t), kt = [];
function Er(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    kt.push(e);
    try {
      we.use(e);
    } catch (t) {
      _("[markdown] failed to apply plugin", t);
    }
  }
}
function Go(e) {
  kt.length = 0, Array.isArray(e) && kt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    kt.forEach((t) => we.use(t));
  } catch (t) {
    _("[markdown] failed to apply markdown extensions", t);
  }
}
async function Sn(e) {
  if (kt && kt.length) {
    let { content: i, data: r } = Xn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => pr[l] || s);
    } catch {
    }
    we.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      kt.forEach((s) => we.use(s));
    } catch (s) {
      _("[markdown] apply plugins failed", s);
    }
    const a = we.parse(i);
    try {
      const s = Ut();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), f = [], c = /* @__PURE__ */ new Set(), u = (m) => {
          try {
            return String(m || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, h = (m) => {
          const d = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, g = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (d[m] + " " + g).trim();
        };
        o.forEach((m) => {
          try {
            const d = Number(m.tagName.substring(1)), g = (m.textContent || "").trim();
            let y = u(g) || "heading", p = y, w = 2;
            for (; c.has(p); )
              p = y + "-" + w, w += 1;
            c.add(p), m.id = p, m.className = h(d), f.push({ level: d, text: g, id: p });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((m) => {
            try {
              const d = m.getAttribute && m.getAttribute("loading"), g = m.getAttribute && m.getAttribute("data-want-lazy");
              !d && !g && m.setAttribute && m.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((m) => {
            try {
              const d = m.getAttribute && m.getAttribute("class") || m.className || "", g = String(d || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (g)
                try {
                  m.setAttribute && m.setAttribute("class", g);
                } catch {
                  m.className = g;
                }
              else
                try {
                  m.removeAttribute && m.removeAttribute("class");
                } catch {
                  m.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        return { html: l.body.innerHTML, meta: r || {}, toc: f };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Aa);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = qt && qt();
    }
  else
    t = qt && qt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => pr[r] || i);
  } catch {
  }
  try {
    if (typeof Me < "u" && Me && typeof Me.getLanguage == "function" && Me.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Xn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (f, c) => pr[c] || f);
      } catch {
      }
      we.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (f, c) => {
        try {
          return c && Me.getLanguage && Me.getLanguage(c) ? Me.highlight(f, { language: c }).value : Me && typeof Me.getLanguage == "function" && Me.getLanguage("plaintext") ? Me.highlight(f, { language: "plaintext" }).value : f;
        } catch {
          return f;
        }
      } });
      let a = we.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (f, c) => {
          try {
            if (c && Me && typeof Me.highlight == "function")
              try {
                const u = Me.highlight(c, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (Me && typeof Me.highlightElement == "function") {
                    const h = { innerHTML: c };
                    return Me.highlightElement(h), `<pre><code>${h.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return f;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (f) => {
        try {
          return String(f || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (f, c, u, h) => {
        const m = Number(c), d = h.replace(/<[^>]+>/g, "").trim();
        let g = o(d) || "heading", y = g, p = 2;
        for (; l.has(y); )
          y = g + "-" + p, p += 1;
        l.add(y), s.push({ level: m, text: d, id: y });
        const w = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, b = m <= 2 ? "has-text-weight-bold" : m <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", k = (w[m] + " " + b).trim(), v = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${k}"`).trim();
        return `<h${m} ${v}>${h}</h${m}>`;
      }), a = a.replace(/<img([^>]*)>/g, (f, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Zr({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const f = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (f[o] + " " + c).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, f, c, u) => {
      const h = Number(f), m = u.replace(/<[^>]+>/g, "").trim(), d = (c || "").match(/\sid="([^"]+)"/), g = d ? d[1] : a(m) || "heading", p = (i.get(g) || 0) + 1;
      i.set(g, p);
      const w = p === 1 ? g : g + "-" + p;
      r.push({ level: h, text: m, id: w });
      const b = s(h), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${b}"`).trim();
      return `<h${h} ${S}>${u}</h${h}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const f = Ut();
        if (f) {
          const c = f.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((h) => {
            try {
              const m = h.getAttribute("src") || "";
              (m ? new URL(m, location.href).toString() : "") === o && h.remove();
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
function dn(e, t) {
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
      if (Di.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(at && at[l] && t.has(at[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const f = t.get(l);
          f && n.add(f);
          continue;
        }
        if (at && at[l]) {
          const f = at[l];
          if (t.has(f)) {
            const c = t.get(f) || f;
            n.add(c);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function Lr(e, t) {
  if (kt && kt.length || typeof process < "u" && process.env && process.env.VITEST) return dn(e || "", t);
  if (qt && qt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Zr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      _("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return dn(e || "", t);
}
const Aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Zr,
  addMarkdownExtension: Er,
  detectFenceLanguages: dn,
  detectFenceLanguagesAsync: Lr,
  initRendererWorker: qt,
  markdownPlugins: kt,
  parseMarkdownToHtml: Sn,
  setMarkdownExtensions: Go
}, Symbol.toStringTag, { value: "Module" })), Qo = `/**
 * @module worker/anchorWorker
 */
import { _rewriteAnchors } from '../htmlBuilder.js'

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
        await Gr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Xo(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), l = s.body;
        return await Gr(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function pt(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + fi(e, t);
  } catch {
    return fi(e, t);
  }
}
function Ko(...e) {
  try {
    _(...e);
  } catch {
  }
}
function Vn(e) {
  try {
    if (Ft(3)) return !0;
  } catch {
  }
  try {
    if (typeof re == "string" && re) return !0;
  } catch {
  }
  try {
    if (ae && ae.size) return !0;
  } catch {
  }
  try {
    if (Te && Te.size) return !0;
  } catch {
  }
  return !1;
}
function wt(e, t) {
  try {
    if (typeof it == "function")
      try {
        it(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && ae && typeof ae.set == "function" && !ae.has(e) && ae.set(e, t);
  } catch {
  }
  try {
    t && ne && typeof ne.set == "function" && ne.set(t, e);
  } catch {
  }
  try {
    Array.isArray(qe) && !qe.includes(t) && qe.push(t);
  } catch {
  }
  try {
    Te && typeof Te.add == "function" && Te.add(t);
  } catch {
  }
}
function Vo(e, t) {
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
function Yo(e, t) {
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
        o && o.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(o)) : l.setAttribute("href", pt(o));
      }
    } catch {
      l.setAttribute("href", "#" + a.path);
    }
    if (l.textContent = a.name, s.appendChild(l), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((f) => {
        const c = document.createElement("li"), u = document.createElement("a");
        try {
          const h = String(f.path || "");
          try {
            u.setAttribute("href", Ce(h));
          } catch {
            h && h.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(h)) : u.setAttribute("href", pt(h));
          }
        } catch {
          u.setAttribute("href", "#" + f.path);
        }
        u.textContent = f.name, c.appendChild(u), o.appendChild(c);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function Jo(e, t, n = "") {
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
        const f = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), u = document.createElement("a"), h = gs(o.text || ""), m = o.id || ke(h);
        u.textContent = h;
        try {
          const p = String(n || "").replace(/^[\\.\\/]+/, ""), w = p && ne && ne.has && ne.has(p) ? ne.get(p) : p;
          w ? u.href = Ce(w, m) : u.href = `#${encodeURIComponent(m)}`;
        } catch (p) {
          _("[htmlBuilder] buildTocElement href normalization failed", p), u.href = `#${encodeURIComponent(m)}`;
        }
        if (c.appendChild(u), f === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((p) => {
            Number(p) > 2 && delete l[p];
          });
          return;
        }
        let d = f - 1;
        for (; d > 2 && !l[d]; ) d--;
        d < 2 && (d = 2);
        let g = l[d];
        if (!g) {
          a.appendChild(c), l[f] = c;
          return;
        }
        let y = g.querySelector("ul");
        y || (y = document.createElement("ul"), g.appendChild(y)), y.appendChild(c), l[f] = c;
      } catch (f) {
        _("[htmlBuilder] buildTocElement item failed", f, o);
      }
    });
  } catch (l) {
    _("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Ea(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ke(n.textContent || ""));
  });
}
function el(e, t, n) {
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
              _("[htmlBuilder] set image loading attribute failed", o);
            }
          } catch (l) {
            _("[htmlBuilder] resolve image src failed", l);
          }
      });
    }
  } catch (i) {
    _("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function Ti(e, t, n) {
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
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (f) => {
          try {
            const c = s.getAttribute(f) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              s.setAttribute(f, new URL(c, r).toString());
            } catch (u) {
              _("[htmlBuilder] rewrite asset attribute failed", f, c, u);
            }
          } catch (c) {
            _("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const u = (s.getAttribute("srcset") || "").split(",").map((h) => h.trim()).filter(Boolean).map((h) => {
            const [m, d] = h.split(/\s+/, 2);
            if (!m || /^(https?:)?\/\//i.test(m) || m.startsWith("/")) return h;
            try {
              const g = new URL(m, r).toString();
              return d ? `${g} ${d}` : g;
            } catch {
              return h;
            }
          }).join(", ");
          s.setAttribute("srcset", u);
        }
      } catch (l) {
        _("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    _("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Ri = "", gr = null, Ci = "";
async function Gr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Ri && gr)
      a = gr, s = Ci;
    else {
      try {
        a = new URL(t, location.href), s = jt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = jt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Ri = t, gr = a, Ci = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], f = /* @__PURE__ */ new Set(), c = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const h = u.getAttribute("href") || "";
        if (!h || Gi(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const d = new URL(h, t || location.href), g = d.searchParams.get("page");
              if (g && g.indexOf("/") === -1 && n) {
                const y = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (y) {
                  const p = ie(y + g), w = i && i.canonical ? Ce(p, d.hash ? d.hash.replace(/^#/, "") : null) : pt(p, d.hash ? d.hash.replace(/^#/, "") : null);
                  u.setAttribute("href", w);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (h.startsWith("/") && !h.endsWith(".md")) continue;
        const m = h.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (m) {
          let d = m[1];
          const g = m[2];
          !d.startsWith("/") && n && (d = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + d);
          try {
            const y = new URL(d, t).pathname;
            let p = y.startsWith(s) ? y.slice(s.length) : y;
            p = ie(p), o.push({ node: u, mdPathRaw: d, frag: g, rel: p }), ne.has(p) || l.add(p);
          } catch (y) {
            _("[htmlBuilder] resolve mdPath failed", y);
          }
          continue;
        }
        try {
          let d = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? d = n + h : d = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const y = new URL(d, t).pathname || "";
          if (y && y.indexOf(s) !== -1) {
            let p = y.startsWith(s) ? y.slice(s.length) : y;
            if (p = ie(p), p = Qt(p), p || (p = Ir), !p.endsWith(".md")) {
              let w = null;
              try {
                if (ne && ne.has && ne.has(p))
                  w = ne.get(p);
                else
                  try {
                    const b = String(p || "").replace(/^.*\//, "");
                    b && ne.has && ne.has(b) && (w = ne.get(b));
                  } catch (b) {
                    _("[htmlBuilder] mdToSlug baseName check failed", b);
                  }
              } catch (b) {
                _("[htmlBuilder] mdToSlug access check failed", b);
              }
              if (!w)
                try {
                  const b = String(p || "").replace(/^.*\//, "");
                  for (const [k, S] of ae || [])
                    if (S === p || S === b) {
                      w = k;
                      break;
                    }
                } catch {
                }
              if (w) {
                const b = i && i.canonical ? Ce(w, null) : pt(w);
                u.setAttribute("href", b);
              } else {
                let b = p;
                try {
                  /\.[^\/]+$/.test(String(p || "")) || (b = String(p || "") + ".html");
                } catch {
                  b = p;
                }
                f.add(b), c.push({ node: u, rel: b });
              }
            }
          }
        } catch (d) {
          _("[htmlBuilder] resolving href to URL failed", d);
        }
      } catch (h) {
        _("[htmlBuilder] processing anchor failed", h);
      }
    if (l.size)
      if (Vn(t))
        await Promise.all(Array.from(l).map(async (u) => {
          try {
            try {
              const m = String(u).match(/([^\/]+)\.md$/), d = m && m[1];
              if (d && ae.has(d)) {
                try {
                  const g = ae.get(d);
                  if (g)
                    try {
                      const y = typeof g == "string" ? g : g && g.default ? g.default : null;
                      y && wt(d, y);
                    } catch (y) {
                      _("[htmlBuilder] _storeSlugMapping failed", y);
                    }
                } catch (g) {
                  _("[htmlBuilder] reading slugToMd failed", g);
                }
                return;
              }
            } catch (m) {
              _("[htmlBuilder] basename slug lookup failed", m);
            }
            const h = await Ee(u, t);
            if (h && h.raw) {
              const m = (h.raw || "").match(/^#\s+(.+)$/m);
              if (m && m[1]) {
                const d = ke(m[1].trim());
                if (d)
                  try {
                    wt(d, u);
                  } catch (g) {
                    _("[htmlBuilder] setting slug mapping failed", g);
                  }
              }
            }
          } catch (h) {
            _("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(l))
          try {
            const h = String(u).match(/([^\/]+)\.md$/), m = h && h[1];
            if (m) {
              const d = ke(m);
              if (d)
                try {
                  wt(d, u);
                } catch (g) {
                  _("[htmlBuilder] setting fallback slug mapping failed", g);
                }
            }
          } catch {
          }
      }
    if (f.size)
      if (Vn(t))
        await Promise.all(Array.from(f).map(async (u) => {
          try {
            const h = await Ee(u, t);
            if (h && h.raw)
              try {
                const d = Ut().parseFromString(h.raw, "text/html"), g = d.querySelector("title"), y = d.querySelector("h1"), p = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : y && y.textContent ? y.textContent.trim() : null;
                if (p) {
                  const w = ke(p);
                  if (w)
                    try {
                      wt(w, u);
                    } catch (b) {
                      _("[htmlBuilder] setting html slug mapping failed", b);
                    }
                }
              } catch (m) {
                _("[htmlBuilder] parse fetched HTML failed", m);
              }
          } catch (h) {
            _("[htmlBuilder] fetchMarkdown for htmlPending failed", h);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const u of Array.from(f))
          try {
            const h = String(u).match(/([^\/]+)\.html$/), m = h && h[1];
            if (m) {
              const d = ke(m);
              if (d)
                try {
                  wt(d, u);
                } catch (g) {
                  _("[htmlBuilder] setting fallback html slug mapping failed", g);
                }
            }
          } catch {
          }
      }
    for (const u of o) {
      const { node: h, frag: m, rel: d } = u;
      let g = null;
      try {
        ne.has(d) && (g = ne.get(d));
      } catch (y) {
        _("[htmlBuilder] mdToSlug access failed", y);
      }
      if (g) {
        const y = i && i.canonical ? Ce(g, m) : pt(g, m);
        h.setAttribute("href", y);
      } else {
        const y = i && i.canonical ? Ce(d, m) : pt(d, m);
        h.setAttribute("href", y);
      }
    }
    for (const u of c) {
      const { node: h, rel: m } = u;
      let d = null;
      try {
        ne.has(m) && (d = ne.get(m));
      } catch (g) {
        _("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", g);
      }
      if (!d)
        try {
          const g = String(m || "").replace(/^.*\//, "");
          ne.has(g) && (d = ne.get(g));
        } catch (g) {
          _("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
        }
      if (d) {
        const g = i && i.canonical ? Ce(d, null) : pt(d);
        h.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? Ce(m, null) : pt(m);
        h.setAttribute("href", g);
      }
    }
  } catch (r) {
    _("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function tl(e, t, n, i) {
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
    !l && n && (l = String(n)), l && (s = ke(l)), s || (s = Ir);
    try {
      if (n)
        try {
          wt(s, n);
        } catch (o) {
          _("[htmlBuilder] computeSlug set slug mapping failed", o);
        }
    } catch (o) {
      _("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const f = tt(typeof location < "u" ? location.href : "");
          f && f.anchor && f.page && String(f.page) === String(s) ? o = f.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", pt(s, o));
      } catch (f) {
        _("[htmlBuilder] computeSlug history replace failed", f);
      }
    } catch (o) {
      _("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (l) {
    _("[htmlBuilder] computeSlug failed", l);
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
async function nl(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const f = o.getAttribute("href") || "";
      if (!f) continue;
      let h = ie(f).split(/::|#/, 2)[0];
      try {
        const d = h.indexOf("?");
        d !== -1 && (h = h.slice(0, d));
      } catch {
      }
      if (!h || (h.includes(".") || (h = h + ".html"), !/\.html(?:$|[?#])/.test(h) && !h.toLowerCase().endsWith(".html"))) continue;
      const m = h;
      try {
        if (ne && ne.has && ne.has(m)) continue;
      } catch (d) {
        _("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const g of ae.values())
          if (g === m) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        _("[htmlBuilder] slugToMd iteration failed", d);
      }
      n.add(m);
    } catch (f) {
      _("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", f);
    }
  if (!n.size) return;
  if (!Vn()) {
    try {
      _("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const f = String(o).match(/([^\/]+)\.html$/), c = f && f[1];
        if (c) {
          const u = ke(c);
          if (u)
            try {
              wt(u, o);
            } catch (h) {
              _("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", h);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (o) => {
    try {
      const f = await Ee(o, t);
      if (f && f.raw)
        try {
          const u = Ut().parseFromString(f.raw, "text/html"), h = u.querySelector("title"), m = u.querySelector("h1"), d = h && h.textContent && h.textContent.trim() ? h.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
          if (d) {
            const g = ke(d);
            if (g)
              try {
                wt(g, o);
              } catch (y) {
                _("[htmlBuilder] set slugToMd/mdToSlug failed", y);
              }
          }
        } catch (c) {
          _("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (f) {
      _("[htmlBuilder] fetchAndExtract failed", f);
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
async function rl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = jt(a.pathname);
  } catch (a) {
    r = "", _("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = ie(l[1]);
        try {
          let f;
          try {
            f = Vo(o, t);
          } catch (u) {
            f = o, _("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const c = f && r && f.startsWith(r) ? f.slice(r.length) : String(f || "").replace(/^\//, "");
          n.push({ rel: c }), ne.has(c) || i.add(c);
        } catch (f) {
          _("[htmlBuilder] rewriteAnchors failed", f);
        }
        continue;
      }
    } catch (s) {
      _("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (Vn())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && ae.has(l)) {
            try {
              const o = ae.get(l);
              if (o)
                try {
                  const f = typeof o == "string" ? o : o && o.default ? o.default : null;
                  f && wt(l, f);
                } catch (f) {
                  _("[htmlBuilder] _storeSlugMapping failed", f);
                }
            } catch (o) {
              _("[htmlBuilder] preMapMdSlugs slug map access failed", o);
            }
            return;
          }
        } catch (s) {
          _("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await Ee(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = ke(l[1].trim());
              if (o)
                try {
                  wt(o, a);
                } catch (f) {
                  _("[htmlBuilder] preMapMdSlugs setting slug mapping failed", f);
                }
            }
          }
        } catch (s) {
          _("[htmlBuilder] preMapMdSlugs fetch failed", s);
        }
      }));
    else
      try {
        _("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
}
Ut();
function mr(e) {
  try {
    const n = Ut().parseFromString(e || "", "text/html");
    Ea(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (f) {
          _("[htmlBuilder] parseHtml set image loading attribute failed", f);
        }
      });
    } catch (l) {
      _("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", f = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (f && f[1]) {
          const c = (f[1] || "").toLowerCase(), u = _e.size && (_e.get(c) || _e.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await bn(u);
              } catch (h) {
                _("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            _("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (Me && typeof Me.getLanguage == "function" && Me.getLanguage("plaintext")) {
              const c = Me.highlight ? Me.highlight(l.textContent || "", { language: "plaintext" }) : null;
              c && c.value && (l.innerHTML = c.value);
            }
          } catch (c) {
            _("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (o) {
        _("[htmlBuilder] code element processing failed", o);
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
    return _("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function il(e) {
  const t = Lr ? await Lr(e || "", _e) : dn(e || "", _e), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = _e.size && (_e.get(r) || _e.get(String(r).toLowerCase())) || r;
      try {
        i.push(bn(a));
      } catch (s) {
        _("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(bn(r));
        } catch (s) {
          _("[htmlBuilder] ensureLanguages push alias failed", s);
        }
    } catch (a) {
      _("[htmlBuilder] ensureLanguages inner failed", a);
    }
  try {
    await Promise.all(i);
  } catch (r) {
    _("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function al(e) {
  if (await il(e), Sn) {
    const t = await Sn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function sl(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = Ut();
      if (u) {
        const h = u.parseFromString(t.raw || "", "text/html");
        try {
          Ti(h.body, n, r);
        } catch (m) {
          _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", m);
        }
        a = mr(h.documentElement && h.documentElement.outerHTML ? h.documentElement.outerHTML : t.raw || "");
      } else
        a = mr(t.raw || "");
    } catch {
      a = mr(t.raw || "");
    }
  else
    a = await al(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Ti(s, n, r);
  } catch (u) {
    _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    Ea(s);
  } catch (u) {
    _("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((h) => {
      try {
        const m = h.getAttribute && h.getAttribute("class") || h.className || "", d = String(m || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (d)
          try {
            h.setAttribute && h.setAttribute("class", d);
          } catch (g) {
            h.className = d, _("[htmlBuilder] set element class failed", g);
          }
        else
          try {
            h.removeAttribute && h.removeAttribute("class");
          } catch (g) {
            h.className = "", _("[htmlBuilder] remove element class failed", g);
          }
      } catch (m) {
        _("[htmlBuilder] code element cleanup failed", m);
      }
    });
  } catch (u) {
    _("[htmlBuilder] processing code elements failed", u);
  }
  try {
    as(s);
  } catch (u) {
    _("[htmlBuilder] observeCodeBlocks failed", u);
  }
  el(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((h) => {
      try {
        const m = h.parentElement;
        if (!m || m.tagName.toLowerCase() !== "p" || m.childNodes.length !== 1) return;
        const d = document.createElement("figure");
        d.className = "image", m.replaceWith(d), d.appendChild(h);
      } catch {
      }
    });
  } catch (u) {
    _("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((h) => {
      try {
        if (h.classList)
          h.classList.contains("table") || h.classList.add("table");
        else {
          const m = h.getAttribute && h.getAttribute("class") ? h.getAttribute("class") : "", d = String(m || "").split(/\s+/).filter(Boolean);
          d.indexOf("table") === -1 && d.push("table");
          try {
            h.setAttribute && h.setAttribute("class", d.join(" "));
          } catch {
            h.className = d.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    _("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: l, h1Text: o, slugKey: f } = tl(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const h = a.meta.author ? String(a.meta.author).trim() : "", m = a.meta.date ? String(a.meta.date).trim() : "";
      let d = "";
      try {
        const y = new Date(m);
        m && !isNaN(y.getTime()) ? d = y.toLocaleDateString() : d = m;
      } catch {
        d = m;
      }
      const g = [];
      if (h && g.push(h), d && g.push(d), g.length) {
        const y = document.createElement("p"), p = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", w = g.slice(1);
        if (y.className = "nimbi-article-subtitle is-6 has-text-grey-light", p) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = p, y.appendChild(b);
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
    await ul(s, r, n);
  } catch (u) {
    Ko("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await Gr(s, r, n);
  }
  const c = Jo(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: f };
}
function ol(e) {
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
                Mt("[htmlBuilder] executed inline script via Function");
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
              _("[htmlBuilder] injected script error", { src: r, ev: a });
            } catch {
            }
          }), i.addEventListener("load", () => {
            try {
              Mt("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
                _("[htmlBuilder] injected script append failed, skipping", { src: r, err: s });
              } catch {
              }
            }
          }
          n.parentNode && n.parentNode.removeChild(n);
          try {
            Mt("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          _("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function Pi(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!re)
      try {
        const s = document.createElement("p"), l = t && t("goHome") || "Go back to";
        s.textContent = l + " ";
        const o = document.createElement("a");
        try {
          o.href = Ce(ft);
        } catch {
          o.href = Ce(ft || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Hn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, re, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const La = ds(() => {
  const e = sn(Qo);
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
          const r = { data: await Xo(n) };
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
function ll() {
  return La.get();
}
function cl(e) {
  return La.send(e, 2e3);
}
async function ul(e, t, n) {
  if (!ll()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await cl({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      _("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function hl(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = tt(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
        let l = null;
        try {
          history && history.state && history.state.page && (l = history.state.page);
        } catch (o) {
          l = null, _("[htmlBuilder] access history.state failed", o);
        }
        try {
          l || (l = new URL(location.href).searchParams.get("page"));
        } catch (o) {
          _("[htmlBuilder] parse current location failed", o);
        }
        if (!a && s || a && l && String(a) === String(l)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (o) {
                _("[htmlBuilder] history.replaceState failed", o);
              }
            else
              try {
                history.replaceState({ page: l || a }, "", pt(l || a, s));
              } catch (o) {
                _("[htmlBuilder] history.replaceState failed", o);
              }
          } catch (o) {
            _("[htmlBuilder] update history for anchor failed", o);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (o) {
            _("[htmlBuilder] stopPropagation failed", o);
          }
          try {
            Mr(s);
          } catch (o) {
            _("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", pt(a, s));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (o) {
              _("[htmlBuilder] window.renderByQuery failed", o);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (o) {
              _("[htmlBuilder] dispatch popstate failed", o);
            }
          else
            try {
              renderByQuery();
            } catch (o) {
              _("[htmlBuilder] renderByQuery failed", o);
            }
        } catch (o) {
          _("[htmlBuilder] SPA navigation invocation failed", o);
        }
      } catch (r) {
        _("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    _("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function Mr(e) {
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
                  _("[htmlBuilder] scrollIntoView failed", a);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              _("[htmlBuilder] final scroll fallback failed", a);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (r) {
          _("[htmlBuilder] scheduling scroll failed", r), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          n.scrollIntoView();
        } catch (r) {
          _("[htmlBuilder] final scroll fallback failed", r);
        }
        _("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      t && t.scrollTo ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        _("[htmlBuilder] window.scrollTo failed", i);
      }
      _("[htmlBuilder] scroll to top failed", n);
    }
}
function dl(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((g) => typeof g == "string" ? g : ""), o = i || document.querySelector(".nimbi-cms"), f = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let m = document.querySelector(".nimbi-scroll-top");
    if (!m) {
      m = document.createElement("button"), m.className = "nimbi-scroll-top button is-primary is-rounded is-small", m.setAttribute("aria-label", l("scrollToTop")), m.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(m) : o && o.appendChild ? o.appendChild(m) : f && f.appendChild ? f.appendChild(m) : document.body.appendChild(m);
      } catch {
        try {
          document.body.appendChild(m);
        } catch (y) {
          _("[htmlBuilder] append scroll top button failed", y);
        }
      }
      try {
        try {
          Hi(m);
        } catch {
        }
      } catch (g) {
        _("[htmlBuilder] set scroll-top button theme registration failed", g);
      }
      m.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (y) {
            _("[htmlBuilder] fallback container scrollTop failed", y);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (y) {
            _("[htmlBuilder] fallback mountEl scrollTop failed", y);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (y) {
            _("[htmlBuilder] fallback document scrollTop failed", y);
          }
        }
      });
    }
    const d = u && u.querySelector ? u.querySelector(".menu-label") : null;
    if (t) {
      if (!m._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const g = globalThis.IntersectionObserver, y = new g((p) => {
            for (const w of p)
              w.target instanceof Element && (w.isIntersecting ? (m.classList.remove("show"), d && d.classList.remove("show")) : (m.classList.add("show"), d && d.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          m._nimbiObserver = y;
        } else
          m._nimbiObserver = null;
      try {
        m._nimbiObserver && typeof m._nimbiObserver.disconnect == "function" && m._nimbiObserver.disconnect();
      } catch (g) {
        _("[htmlBuilder] observer disconnect failed", g);
      }
      try {
        m._nimbiObserver && typeof m._nimbiObserver.observe == "function" && m._nimbiObserver.observe(t);
      } catch (g) {
        _("[htmlBuilder] observer observe failed", g);
      }
      try {
        const g = () => {
          try {
            const y = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, p = t.getBoundingClientRect();
            !(p.bottom < y.top || p.top > y.bottom) ? (m.classList.remove("show"), d && d.classList.remove("show")) : (m.classList.add("show"), d && d.classList.add("show"));
          } catch (y) {
            _("[htmlBuilder] checkIntersect failed", y);
          }
        };
        g(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(g, 100);
      } catch (g) {
        _("[htmlBuilder] checkIntersect outer failed", g);
      }
    } else {
      m.classList.remove("show"), d && d.classList.remove("show");
      const g = i instanceof Element ? i : r instanceof Element ? r : window, y = () => {
        try {
          (g === window ? window.scrollY : g.scrollTop || 0) > 10 ? (m.classList.add("show"), d && d.classList.add("show")) : (m.classList.remove("show"), d && d.classList.remove("show"));
        } catch (p) {
          _("[htmlBuilder] onScroll handler failed", p);
        }
      };
      Zn(() => g.addEventListener("scroll", y)), y();
    }
  } catch (l) {
    _("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Nn(e, t) {
  try {
    if (typeof it == "function")
      try {
        it(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && ae && typeof ae.set == "function" && !ae.has(e) && ae.set(e, t);
  } catch {
  }
  try {
    t && ne && typeof ne.set == "function" && ne.set(t, e);
  } catch {
  }
  try {
    Array.isArray(qe) && !qe.includes(t) && qe.push(t);
  } catch {
  }
  try {
    Te && typeof Te.add == "function" && Te.add(t);
  } catch {
  }
}
function $i(e, t) {
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
async function fl(e, t, n, i, r, a, s, l, o = "eager", f = 1, c = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, m = h ? h.parseFromString(n || "", "text/html") : null, d = m ? m.querySelectorAll("a") : [];
  await Zn(() => nl(d, i)), await Zn(() => rl(d, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let g = null, y = null, p = null, w = null, b = null, k = null, S = !1, v = null;
  function R() {
    try {
      const E = document.querySelector(".navbar-burger"), B = E && E.dataset ? E.dataset.target : null, C = B ? document.getElementById(B) : null;
      E && E.classList.contains("is-active") && (E.classList.remove("is-active"), E.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active"));
    } catch (E) {
      _("[nimbi-cms] closeMobileMenu failed", E);
    }
  }
  async function W() {
    const E = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      E && E.classList.add("is-inactive");
    } catch {
    }
    try {
      const B = s && s();
      B && typeof B.then == "function" && await B;
    } catch (B) {
      try {
        _("[nimbi-cms] renderByQuery failed", B);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              E && E.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            E && E.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          E && E.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  const I = () => g || (g = (async () => {
    try {
      const E = await Promise.resolve().then(() => ot), B = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, C = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, q = $i(E, "buildSearchIndex"), P = $i(E, "buildSearchIndexWorker"), D = typeof B == "function" ? B : q || void 0, A = typeof C == "function" ? C : P || void 0;
      _t("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof D + " workerFn=" + typeof A + " (global preferred)");
      const O = [];
      try {
        r && O.push(r);
      } catch {
      }
      try {
        navigationPage && O.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof A == "function")
        try {
          const V = await A(i, f, c, O.length ? O : void 0);
          if (V && V.length) {
            try {
              if (E && typeof E._setSearchIndex == "function")
                try {
                  E._setSearchIndex(V);
                } catch {
                }
            } catch {
            }
            return V;
          }
        } catch (V) {
          _("[nimbi-cms] worker builder threw", V);
        }
      return typeof D == "function" ? (_t("[nimbi-cms test] calling buildFn"), await D(i, f, c, O.length ? O : void 0)) : [];
    } catch (E) {
      return _("[nimbi-cms] buildSearchIndex failed", E), [];
    } finally {
      if (y) {
        try {
          y.removeAttribute("disabled");
        } catch {
        }
        try {
          p && p.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), g.then((E) => {
    try {
      try {
        v = Array.isArray(E) ? E : null;
      } catch {
        v = null;
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const P = await Promise.resolve().then(() => ot);
                try {
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return P && Array.isArray(P.searchIndex) ? P.searchIndex : Array.isArray(v) ? v : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = P && Array.isArray(P.searchIndex) ? P.searchIndex : Array.isArray(v) ? v : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(X) ? X : Array.isArray(v) ? v : [];
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
            window.__nimbi_indexDepth = f;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = c;
          } catch {
          }
        }
      } catch {
      }
      const B = String(y && y.value || "").trim().toLowerCase();
      if (!B || !Array.isArray(E) || !E.length) return;
      const C = E.filter((P) => P.title && P.title.toLowerCase().includes(B) || P.excerpt && P.excerpt.toLowerCase().includes(B));
      if (!C || !C.length) return;
      const q = document.getElementById("nimbi-search-results");
      if (!q) return;
      q.innerHTML = "";
      try {
        const P = document.createElement("div");
        P.className = "panel nimbi-search-panel", C.slice(0, 10).forEach((D) => {
          try {
            if (D.parentTitle) {
              const V = document.createElement("p");
              V.className = "panel-heading nimbi-search-title nimbi-search-parent", V.textContent = D.parentTitle, P.appendChild(V);
            }
            const A = document.createElement("a");
            A.className = "panel-block nimbi-search-result", A.href = Ce(D.slug), A.setAttribute("role", "button");
            try {
              if (D.path && typeof D.slug == "string")
                try {
                  Nn(D.slug, D.path);
                } catch {
                }
            } catch {
            }
            const O = document.createElement("div");
            O.className = "is-size-6 has-text-weight-semibold", O.textContent = D.title, A.appendChild(O), A.addEventListener("click", () => {
              try {
                q.style.display = "none";
              } catch {
              }
            }), P.appendChild(A);
          } catch {
          }
        }), q.appendChild(P);
        try {
          q.style.display = "block";
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
        if (S) return;
        S = !0;
        const E = await Promise.resolve().then(() => mn);
        try {
          await E.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: f, noIndexing: c, includeAllMarkdown: !0 });
        } catch (B) {
          _("[nimbi-cms] sitemap trigger failed", B);
        }
      } catch (E) {
        try {
          _("[nimbi-cms] sitemap dynamic import failed", E);
        } catch {
        }
      }
    })();
  }), g), H = document.createElement("nav");
  H.className = "navbar", H.setAttribute("role", "navigation"), H.setAttribute("aria-label", "main navigation");
  const M = document.createElement("div");
  M.className = "navbar-brand";
  const $ = d[0], K = document.createElement("a");
  if (K.className = "navbar-item", $) {
    const E = $.getAttribute("href") || "#";
    try {
      const C = new URL(E, location.href).searchParams.get("page"), q = C ? decodeURIComponent(C) : r;
      let P = null;
      try {
        typeof q == "string" && (/(?:\.md|\.html?)$/i.test(q) || q.includes("/")) && (P = L(q));
      } catch {
      }
      !P && typeof q == "string" && !String(q).includes(".") && (P = q);
      const D = P || q;
      K.href = Ce(D), (!K.textContent || !String(K.textContent).trim()) && (K.textContent = a("home"));
    } catch {
      try {
        const C = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? L(r) : typeof r == "string" && !r.includes(".") ? r : null;
        K.href = Ce(C || r);
      } catch {
        K.href = Ce(r);
      }
      K.textContent = a("home");
    }
  } else
    K.href = Ce(r), K.textContent = a("home");
  async function Z(E) {
    try {
      if (!E || E === "none") return null;
      if (E === "favicon")
        try {
          const B = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!B) return null;
          const C = B.getAttribute("href") || "";
          return C && /\.png(?:\?|$)/i.test(C) ? new URL(C, location.href).toString() : null;
        } catch {
          return null;
        }
      if (E === "copy-first" || E === "move-first")
        try {
          const B = await Ee(r, i);
          if (!B || !B.raw) return null;
          const P = new DOMParser().parseFromString(B.raw, "text/html").querySelector("img");
          if (!P) return null;
          const D = P.getAttribute("src") || "";
          if (!D) return null;
          const A = new URL(D, location.href).toString();
          if (E === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", A);
            } catch {
            }
          return A;
        } catch {
          return null;
        }
      try {
        return new URL(E, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let he = null;
  try {
    he = await Z(u);
  } catch {
    he = null;
  }
  if (he)
    try {
      const E = document.createElement("img");
      E.className = "nimbi-navbar-logo";
      const B = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      E.alt = B, E.title = B, E.src = he;
      try {
        E.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!K.textContent || !String(K.textContent).trim()) && (K.textContent = B);
      } catch {
      }
      try {
        K.insertBefore(E, K.firstChild);
      } catch {
        try {
          K.appendChild(E);
        } catch {
        }
      }
    } catch {
    }
  M.appendChild(K), K.addEventListener("click", function(E) {
    const B = K.getAttribute("href") || "";
    if (B.startsWith("?page=")) {
      E.preventDefault();
      const C = new URL(B, location.href), q = C.searchParams.get("page"), P = C.hash ? C.hash.replace(/^#/, "") : null;
      history.pushState({ page: q }, "", Ce(q, P)), W();
      try {
        R();
      } catch {
      }
    }
  });
  function L(E) {
    try {
      if (!E) return null;
      const B = ie(String(E || ""));
      try {
        if (ne && ne.has(B)) return ne.get(B);
      } catch {
      }
      const C = B.replace(/^.*\//, "");
      try {
        if (ne && ne.has(C)) return ne.get(C);
      } catch {
      }
      try {
        for (const [q, P] of ae.entries())
          if (P) {
            if (typeof P == "string") {
              if (ie(P) === B) return q;
            } else if (P && typeof P == "object") {
              if (P.default && ie(P.default) === B) return q;
              const D = P.langs || {};
              for (const A in D)
                if (D[A] && ie(D[A]) === B) return q;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const U = document.createElement("a");
  U.className = "navbar-burger", U.setAttribute("role", "button"), U.setAttribute("aria-label", "menu"), U.setAttribute("aria-expanded", "false");
  const J = "nimbi-navbar-menu";
  U.dataset.target = J, U.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', M.appendChild(U);
  try {
    U.addEventListener("click", (E) => {
      try {
        const B = U.dataset && U.dataset.target ? U.dataset.target : null, C = B ? document.getElementById(B) : null;
        U.classList.contains("is-active") ? (U.classList.remove("is-active"), U.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active")) : (U.classList.add("is-active"), U.setAttribute("aria-expanded", "true"), C && C.classList.add("is-active"));
      } catch (B) {
        _("[nimbi-cms] navbar burger toggle failed", B);
      }
    });
  } catch (E) {
    _("[nimbi-cms] burger event binding failed", E);
  }
  const be = document.createElement("div");
  be.className = "navbar-menu", be.id = J;
  const ee = document.createElement("div");
  ee.className = "navbar-start";
  let ue = null, Ae = null;
  if (!l)
    ue = null, y = null, w = null, b = null, k = null;
  else {
    ue = document.createElement("div"), ue.className = "navbar-end", Ae = document.createElement("div"), Ae.className = "navbar-item", y = document.createElement("input"), y.className = "input", y.type = "search", y.placeholder = a("searchPlaceholder") || "", y.id = "nimbi-search";
    try {
      const P = (a && typeof a == "function" ? a("searchAria") : null) || y.placeholder || "Search";
      try {
        y.setAttribute("aria-label", P);
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
    o === "eager" && (y.disabled = !0), p = document.createElement("div"), p.className = "control", o === "eager" && p.classList.add("is-loading"), p.appendChild(y), Ae.appendChild(p), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const E = document.createElement("div");
    E.className = "dropdown-trigger", E.appendChild(Ae);
    const B = document.createElement("div");
    B.className = "dropdown-menu", B.setAttribute("role", "menu"), b = document.createElement("div"), b.id = "nimbi-search-results", b.className = "dropdown-content nimbi-search-results", k = b, B.appendChild(b), w.appendChild(E), w.appendChild(B), ue.appendChild(w);
    const C = (P) => {
      if (!b) return;
      b.innerHTML = "";
      let D = -1;
      function A(se) {
        try {
          const me = b.querySelector(".nimbi-search-result.is-selected");
          me && me.classList.remove("is-selected");
          const G = b.querySelectorAll(".nimbi-search-result");
          if (!G || !G.length) return;
          if (se < 0) {
            D = -1;
            return;
          }
          se >= G.length && (se = G.length - 1);
          const j = G[se];
          if (j) {
            j.classList.add("is-selected"), D = se;
            try {
              j.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function O(se) {
        try {
          const me = se.key, G = b.querySelectorAll(".nimbi-search-result");
          if (!G || !G.length) return;
          if (me === "ArrowDown") {
            se.preventDefault();
            const j = D < 0 ? 0 : Math.min(G.length - 1, D + 1);
            A(j);
            return;
          }
          if (me === "ArrowUp") {
            se.preventDefault();
            const j = D <= 0 ? 0 : D - 1;
            A(j);
            return;
          }
          if (me === "Enter") {
            se.preventDefault();
            const j = b.querySelector(".nimbi-search-result.is-selected") || b.querySelector(".nimbi-search-result");
            if (j)
              try {
                j.click();
              } catch {
              }
            return;
          }
          if (me === "Escape") {
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
              b.removeEventListener("keydown", O);
            } catch {
            }
            try {
              y && y.focus();
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", V);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function V(se) {
        try {
          if (se && se.key === "ArrowDown") {
            se.preventDefault();
            try {
              b.focus();
            } catch {
            }
            A(0);
          }
        } catch {
        }
      }
      try {
        const se = document.createElement("div");
        se.className = "panel nimbi-search-panel", P.forEach((me) => {
          if (me.parentTitle) {
            const z = document.createElement("p");
            z.textContent = me.parentTitle, z.className = "panel-heading nimbi-search-title nimbi-search-parent", se.appendChild(z);
          }
          const G = document.createElement("a");
          G.className = "panel-block nimbi-search-result", G.href = Ce(me.slug), G.setAttribute("role", "button");
          try {
            if (me.path && typeof me.slug == "string")
              try {
                Nn(me.slug, me.path);
              } catch {
              }
          } catch {
          }
          const j = document.createElement("div");
          j.className = "is-size-6 has-text-weight-semibold", j.textContent = me.title, G.appendChild(j), G.addEventListener("click", () => {
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
              b.removeEventListener("keydown", O);
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", V);
            } catch {
            }
          }), se.appendChild(G);
        }), b.appendChild(se);
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
        b.addEventListener("keydown", O);
      } catch {
      }
      try {
        y && y.addEventListener("keydown", V);
      } catch {
      }
    }, q = (P, D) => {
      let A = null;
      return (...O) => {
        A && clearTimeout(A), A = setTimeout(() => P(...O), D);
      };
    };
    if (y) {
      const P = q(async () => {
        const D = document.querySelector("input#nimbi-search"), A = String(D && D.value || "").trim().toLowerCase();
        if (!A) {
          C([]);
          return;
        }
        try {
          await I();
          const O = await g;
          _t('[nimbi-cms test] search handleInput q="' + A + '" idxlen=' + (Array.isArray(O) ? O.length : "nil"));
          const V = O.filter((se) => se.title && se.title.toLowerCase().includes(A) || se.excerpt && se.excerpt.toLowerCase().includes(A));
          _t("[nimbi-cms test] filtered len=" + (Array.isArray(V) ? V.length : "nil")), C(V.slice(0, 10));
        } catch (O) {
          _("[nimbi-cms] search input handler failed", O), C([]);
        }
      }, 50);
      try {
        y.addEventListener("input", P);
      } catch {
      }
      try {
        document.addEventListener("input", (D) => {
          try {
            D && D.target && D.target.id === "nimbi-search" && P(D);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = I();
      } catch (P) {
        _("[nimbi-cms] eager search index init failed", P), g = Promise.resolve([]);
      }
      g.finally(() => {
        const P = document.querySelector("input#nimbi-search");
        if (P) {
          try {
            P.removeAttribute("disabled");
          } catch {
          }
          try {
            p && p.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (S) return;
            S = !0;
            const D = await g.catch(() => []), A = await Promise.resolve().then(() => mn);
            try {
              await A.handleSitemapRequest({ index: Array.isArray(D) ? D : void 0, homePage: r, contentBase: i, indexDepth: f, noIndexing: c, includeAllMarkdown: !0 });
            } catch (O) {
              _("[nimbi-cms] sitemap trigger failed", O);
            }
          } catch (D) {
            try {
              _("[nimbi-cms] sitemap dynamic import failed", D);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const P = (D) => {
        try {
          const A = D && D.target;
          if (!k || !k.classList.contains("is-open") && k.style && k.style.display !== "block" || A && (k.contains(A) || y && (A === y || y.contains && y.contains(A)))) return;
          if (w) {
            w.classList.remove("is-active");
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
        } catch {
        }
      };
      document.addEventListener("click", P, !0), document.addEventListener("touchstart", P, !0);
    } catch {
    }
  }
  for (let E = 0; E < d.length; E++) {
    const B = d[E];
    if (E === 0) continue;
    const C = B.getAttribute("href") || "#", q = document.createElement("a");
    q.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(C) || C.endsWith(".md")) {
        const D = ie(C).split(/::|#/, 2), A = D[0], O = D[1], V = L(A);
        V ? q.href = Ce(V, O) : q.href = Ce(A, O);
      } else if (/\.html(?:$|[#?])/.test(C) || C.endsWith(".html")) {
        const D = ie(C).split(/::|#/, 2);
        let A = D[0];
        A && !A.toLowerCase().endsWith(".html") && (A = A + ".html");
        const O = D[1], V = L(A);
        if (V)
          q.href = Ce(V, O);
        else
          try {
            const se = await Ee(A, i);
            if (se && se.raw)
              try {
                const G = new DOMParser().parseFromString(se.raw, "text/html"), j = G.querySelector("title"), z = G.querySelector("h1"), xe = j && j.textContent && j.textContent.trim() ? j.textContent.trim() : z && z.textContent ? z.textContent.trim() : null;
                if (xe) {
                  const De = ke(xe);
                  if (De) {
                    try {
                      Nn(De, A);
                    } catch (Se) {
                      _("[nimbi-cms] slugToMd/mdToSlug set failed", Se);
                    }
                    q.href = Ce(De, O);
                  } else
                    q.href = Ce(A, O);
                } else
                  q.href = Ce(A, O);
              } catch {
                q.href = Ce(A, O);
              }
            else
              q.href = C;
          } catch {
            q.href = C;
          }
      } else
        q.href = C;
    } catch (P) {
      _("[nimbi-cms] nav item href parse failed", P), q.href = C;
    }
    try {
      const P = B.textContent && String(B.textContent).trim() ? String(B.textContent).trim() : null;
      if (P)
        try {
          const D = ke(P);
          if (D) {
            const A = q.getAttribute("href") || "";
            let O = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(A))
              O = ie(String(A || "").split(/[?#]/)[0]);
            else
              try {
                const V = tt(A);
                V && V.type === "canonical" && V.page && (O = ie(V.page));
              } catch {
              }
            if (O) {
              let V = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(O || "")))
                  V = !0;
                else {
                  const se = String(O || "").replace(/^\.\//, ""), me = se.replace(/^.*\//, "");
                  Te && Te.size && (Te.has(se) || Te.has(me)) && (V = !0);
                }
              } catch {
                V = !1;
              }
              if (V)
                try {
                  Nn(D, O);
                } catch {
                }
            }
          }
        } catch (D) {
          _("[nimbi-cms] nav slug mapping failed", D);
        }
    } catch (P) {
      _("[nimbi-cms] nav slug mapping failed", P);
    }
    q.textContent = B.textContent || C, ee.appendChild(q);
  }
  be.appendChild(ee), ue && be.appendChild(ue), H.appendChild(M), H.appendChild(be), e.appendChild(H);
  try {
    const E = (B) => {
      try {
        const C = H && H.querySelector ? H.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!C || !C.classList.contains("is-active")) return;
        const q = C && C.closest ? C.closest(".navbar") : H;
        if (q && q.contains(B.target)) return;
        R();
      } catch {
      }
    };
    document.addEventListener("click", E, !0), document.addEventListener("touchstart", E, !0);
  } catch {
  }
  try {
    be.addEventListener("click", (E) => {
      const B = E.target && E.target.closest ? E.target.closest("a") : null;
      if (!B) return;
      const C = B.getAttribute("href") || "";
      try {
        const q = new URL(C, location.href), P = q.searchParams.get("page"), D = q.hash ? q.hash.replace(/^#/, "") : null;
        P && (E.preventDefault(), history.pushState({ page: P }, "", Ce(P, D)), W());
      } catch (q) {
        _("[nimbi-cms] navbar click handler failed", q);
      }
      try {
        const q = H && H.querySelector ? H.querySelector(".navbar-burger") : null, P = q && q.dataset ? q.dataset.target : null, D = P ? document.getElementById(P) : null;
        q && q.classList.contains("is-active") && (q.classList.remove("is-active"), q.setAttribute("aria-expanded", "false"), D && D.classList.remove("is-active"));
      } catch (q) {
        _("[nimbi-cms] mobile menu close failed", q);
      }
    });
  } catch (E) {
    _("[nimbi-cms] attach content click handler failed", E);
  }
  try {
    t.addEventListener("click", (E) => {
      const B = E.target && E.target.closest ? E.target.closest("a") : null;
      if (!B) return;
      const C = B.getAttribute("href") || "";
      if (C && !Gi(C))
        try {
          const q = new URL(C, location.href), P = q.searchParams.get("page"), D = q.hash ? q.hash.replace(/^#/, "") : null;
          P && (E.preventDefault(), history.pushState({ page: P }, "", Ce(P, D)), W());
        } catch (q) {
          _("[nimbi-cms] container click URL parse failed", q);
        }
    });
  } catch (E) {
    _("[nimbi-cms] build navbar failed", E);
  }
  return { navbar: H, linkEls: d };
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
let Qe = null, ce = null, He = 1, bt = (e, t) => t, fn = 0, pn = 0, Un = () => {
}, an = 0.25;
function pl() {
  if (Qe && document.contains(Qe)) return Qe;
  Qe = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", bt("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (L) => {
    L.target === e && yr();
  }), e.addEventListener("wheel", (L) => {
    if (!H()) return;
    L.preventDefault();
    const U = L.deltaY < 0 ? an : -an;
    vt(He + U), f(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      yr();
      return;
    }
    if (He > 1) {
      const U = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!U) return;
      const J = 40;
      switch (L.key) {
        case "ArrowUp":
          U.scrollTop -= J, L.preventDefault();
          break;
        case "ArrowDown":
          U.scrollTop += J, L.preventDefault();
          break;
        case "ArrowLeft":
          U.scrollLeft -= J, L.preventDefault();
          break;
        case "ArrowRight":
          U.scrollLeft += J, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Qe = e, ce = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function f() {
    l && (l.textContent = `${Math.round(He * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(He * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Un = f, i.addEventListener("click", () => {
    vt(He + an), f(), c();
  }), r.addEventListener("click", () => {
    vt(He - an), f(), c();
  }), t.addEventListener("click", () => {
    gn(), f(), c();
  }), n.addEventListener("click", () => {
    vt(1), f(), c();
  }), a.addEventListener("click", () => {
    gn(), f(), c();
  }), s.addEventListener("click", yr), t.title = bt("imagePreviewFit", "Fit to screen"), n.title = bt("imagePreviewOriginal", "Original size"), r.title = bt("imagePreviewZoomOut", "Zoom out"), i.title = bt("imagePreviewZoomIn", "Zoom in"), s.title = bt("imagePreviewClose", "Close"), s.setAttribute("aria-label", bt("imagePreviewClose", "Close"));
  let u = !1, h = 0, m = 0, d = 0, g = 0;
  const y = /* @__PURE__ */ new Map();
  let p = 0, w = 1;
  const b = (L, U) => {
    const J = L.x - U.x, be = L.y - U.y;
    return Math.hypot(J, be);
  }, k = () => {
    u = !1, y.clear(), p = 0, ce && (ce.classList.add("is-panning"), ce.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, R = 0;
  const W = (L) => {
    const U = Date.now(), J = U - S, be = L.clientX - v, ee = L.clientY - R;
    S = U, v = L.clientX, R = L.clientY, J < 300 && Math.hypot(be, ee) < 30 && (vt(He > 1 ? 1 : 2), f(), L.preventDefault());
  }, I = (L) => {
    vt(He > 1 ? 1 : 2), f(), L.preventDefault();
  }, H = () => Qe ? typeof Qe.open == "boolean" ? Qe.open : Qe.classList.contains("is-active") : !1, M = (L, U, J = 1) => {
    if (y.has(J) && y.set(J, { x: L, y: U }), y.size === 2) {
      const Ae = Array.from(y.values()), E = b(Ae[0], Ae[1]);
      if (p > 0) {
        const B = E / p;
        vt(w * B);
      }
      return;
    }
    if (!u) return;
    const be = ce.closest(".nimbi-image-preview__image-wrapper");
    if (!be) return;
    const ee = L - h, ue = U - m;
    be.scrollLeft = d - ee, be.scrollTop = g - ue;
  }, $ = (L, U, J = 1) => {
    if (!H()) return;
    if (y.set(J, { x: L, y: U }), y.size === 2) {
      const ue = Array.from(y.values());
      p = b(ue[0], ue[1]), w = He;
      return;
    }
    const be = ce.closest(".nimbi-image-preview__image-wrapper");
    !be || !(be.scrollWidth > be.clientWidth || be.scrollHeight > be.clientHeight) || (u = !0, h = L, m = U, d = be.scrollLeft, g = be.scrollTop, ce.classList.add("is-panning"), ce.classList.remove("is-grabbing"), window.addEventListener("pointermove", K), window.addEventListener("pointerup", Z), window.addEventListener("pointercancel", Z));
  }, K = (L) => {
    u && (L.preventDefault(), M(L.clientX, L.clientY, L.pointerId));
  }, Z = () => {
    k(), window.removeEventListener("pointermove", K), window.removeEventListener("pointerup", Z), window.removeEventListener("pointercancel", Z);
  };
  ce.addEventListener("pointerdown", (L) => {
    L.preventDefault(), $(L.clientX, L.clientY, L.pointerId);
  }), ce.addEventListener("pointermove", (L) => {
    (u || y.size === 2) && L.preventDefault(), M(L.clientX, L.clientY, L.pointerId);
  }), ce.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && W(L), k();
  }), ce.addEventListener("dblclick", I), ce.addEventListener("pointercancel", k), ce.addEventListener("mousedown", (L) => {
    L.preventDefault(), $(L.clientX, L.clientY, 1);
  }), ce.addEventListener("mousemove", (L) => {
    u && L.preventDefault(), M(L.clientX, L.clientY, 1);
  }), ce.addEventListener("mouseup", (L) => {
    L.preventDefault(), k();
  });
  const he = e.querySelector(".nimbi-image-preview__image-wrapper");
  return he && (he.addEventListener("pointerdown", (L) => {
    if ($(L.clientX, L.clientY, L.pointerId), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), he.addEventListener("pointermove", (L) => {
    M(L.clientX, L.clientY, L.pointerId);
  }), he.addEventListener("pointerup", k), he.addEventListener("pointercancel", k), he.addEventListener("mousedown", (L) => {
    if ($(L.clientX, L.clientY, 1), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), he.addEventListener("mousemove", (L) => {
    M(L.clientX, L.clientY, 1);
  }), he.addEventListener("mouseup", k)), e;
}
function vt(e) {
  if (!ce) return;
  const t = Number(e);
  He = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = ce.getBoundingClientRect(), r = fn || ce.naturalWidth || ce.width || i.width || 0, a = pn || ce.naturalHeight || ce.height || i.height || 0;
  if (r && a) {
    ce.style.setProperty("--nimbi-preview-img-max-width", "none"), ce.style.setProperty("--nimbi-preview-img-max-height", "none"), ce.style.setProperty("--nimbi-preview-img-width", `${r * He}px`), ce.style.setProperty("--nimbi-preview-img-height", `${a * He}px`), ce.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      ce.style.width = `${r * He}px`, ce.style.height = `${a * He}px`, ce.style.transform = "none";
    } catch {
    }
  } else {
    ce.style.setProperty("--nimbi-preview-img-max-width", ""), ce.style.setProperty("--nimbi-preview-img-max-height", ""), ce.style.setProperty("--nimbi-preview-img-width", ""), ce.style.setProperty("--nimbi-preview-img-height", ""), ce.style.setProperty("--nimbi-preview-img-transform", `scale(${He})`);
    try {
      ce.style.transform = `scale(${He})`;
    } catch {
    }
  }
  ce && (ce.classList.add("is-panning"), ce.classList.remove("is-grabbing"));
}
function gn() {
  if (!ce) return;
  const e = ce.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = fn || ce.naturalWidth || t.width, i = pn || ce.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  vt(Number.isFinite(s) ? s : 1);
}
function gl(e, t = "", n = 0, i = 0) {
  const r = pl();
  He = 1, fn = n || 0, pn = i || 0, ce.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", f = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = bt("imagePreviewDefaultAlt", f || "Image");
      } catch {
        t = bt("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  ce.alt = t, ce.style.transform = "scale(1)";
  const a = () => {
    fn = ce.naturalWidth || ce.width || 0, pn = ce.naturalHeight || ce.height || 0;
  };
  if (a(), gn(), Un(), requestAnimationFrame(() => {
    gn(), Un();
  }), !fn || !pn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        gn(), Un();
      }), ce.removeEventListener("load", s);
    };
    ce.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function yr() {
  if (Qe) {
    typeof Qe.close == "function" && Qe.open && Qe.close(), Qe.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function ml(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  bt = (m, d) => (typeof t == "function" ? t(m) : void 0) || d, an = n, e.addEventListener("click", (m) => {
    const d = (
      /** @type {HTMLElement} */
      m.target
    );
    if (!d || d.tagName !== "IMG") return;
    const g = (
      /** @type {HTMLImageElement} */
      d
    );
    if (!g.src) return;
    const y = g.closest("a");
    y && y.getAttribute("href") || gl(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let f = 0, c = 1;
  const u = (m, d) => {
    const g = m.x - d.x, y = m.y - d.y;
    return Math.hypot(g, y);
  };
  e.addEventListener("pointerdown", (m) => {
    const d = (
      /** @type {HTMLElement} */
      m.target
    );
    if (!d || d.tagName !== "IMG") return;
    const g = d.closest("a");
    if (g && g.getAttribute("href") || !Qe || !Qe.open) return;
    if (o.set(m.pointerId, { x: m.clientX, y: m.clientY }), o.size === 2) {
      const p = Array.from(o.values());
      f = u(p[0], p[1]), c = He;
      return;
    }
    const y = d.closest(".nimbi-image-preview__image-wrapper");
    if (y && !(He <= 1)) {
      m.preventDefault(), i = !0, r = m.clientX, a = m.clientY, s = y.scrollLeft, l = y.scrollTop, d.setPointerCapture(m.pointerId);
      try {
        d.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (m) => {
    if (o.has(m.pointerId) && o.set(m.pointerId, { x: m.clientX, y: m.clientY }), o.size === 2) {
      m.preventDefault();
      const b = Array.from(o.values()), k = u(b[0], b[1]);
      if (f > 0) {
        const S = k / f;
        vt(c * S);
      }
      return;
    }
    if (!i) return;
    m.preventDefault();
    const d = (
      /** @type {HTMLElement} */
      m.target
    ), g = d.closest && d.closest("a");
    if (g && g.getAttribute && g.getAttribute("href")) return;
    const y = d.closest(".nimbi-image-preview__image-wrapper");
    if (!y) return;
    const p = m.clientX - r, w = m.clientY - a;
    y.scrollLeft = s - p, y.scrollTop = l - w;
  });
  const h = () => {
    i = !1, o.clear(), f = 0;
    try {
      const m = document.querySelector("[data-nimbi-preview-image]");
      m && (m.classList.add("is-panning"), m.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", h), e.addEventListener("pointercancel", h);
}
function yl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: f
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const u = Yo(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  async function h(p, w) {
    let b, k, S;
    try {
      ({ data: b, pagePath: k, anchor: S } = await Fs(p, s));
    } catch ($) {
      const K = $ && $.message ? String($.message) : "", Z = (!re || typeof re != "string" || !re) && /no page data/i.test(K);
      try {
        if (Z)
          try {
            _("[nimbi-cms] fetchPageData (expected missing)", $);
          } catch {
          }
        else
          try {
            Fn("[nimbi-cms] fetchPageData failed", $);
          } catch {
          }
      } catch {
      }
      try {
        !re && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Pi(t, a, $);
      return;
    }
    !S && w && (S = w);
    try {
      Mr(null);
    } catch ($) {
      _("[nimbi-cms] scrollToAnchorOrTop failed", $);
    }
    t.innerHTML = "";
    const { article: v, parsed: R, toc: W, topH1: I, h1Text: H, slugKey: M } = await sl(a, b, k, S, s);
    qs(a, o, R, W, v, k, S, I, H, M, b), n.innerHTML = "", W && (n.appendChild(W), hl(W));
    try {
      await f("transformHtml", { article: v, parsed: R, toc: W, pagePath: k, anchor: S, topH1: I, h1Text: H, slugKey: M, data: b });
    } catch ($) {
      _("[nimbi-cms] transformHtml hooks failed", $);
    }
    t.appendChild(v);
    try {
      ol(v);
    } catch ($) {
      _("[nimbi-cms] executeEmbeddedScripts failed", $);
    }
    try {
      ml(v, { t: a });
    } catch ($) {
      _("[nimbi-cms] attachImagePreview failed", $);
    }
    try {
      zn(i, 100, !1), requestAnimationFrame(() => zn(i, 100, !1)), setTimeout(() => zn(i, 100, !1), 250);
    } catch ($) {
      _("[nimbi-cms] setEagerForAboveFoldImages failed", $);
    }
    Mr(S), dl(v, I, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await f("onPageLoad", { data: b, pagePath: k, anchor: S, article: v, toc: W, topH1: I, h1Text: H, slugKey: M, contentWrap: t, navWrap: n });
    } catch ($) {
      _("[nimbi-cms] onPageLoad hooks failed", $);
    }
    c = k;
  }
  async function m() {
    try {
      try {
        Ni("renderByQuery");
      } catch {
      }
      try {
        Bi("renderByQuery");
      } catch {
      }
      let p = tt(location.href);
      if (p && p.type === "path" && p.page)
        try {
          let k = "?page=" + encodeURIComponent(p.page || "");
          p.params && (k += (k.includes("?") ? "&" : "?") + p.params), p.anchor && (k += "#" + encodeURIComponent(p.anchor));
          try {
            history.replaceState(history.state, "", k);
          } catch {
            try {
              history.replaceState({}, "", k);
            } catch {
            }
          }
          p = tt(location.href);
        } catch {
        }
      const w = p && p.page ? p.page : l, b = p && p.anchor ? p.anchor : null;
      await h(w, b);
    } catch (p) {
      _("[nimbi-cms] renderByQuery failed", p);
      try {
        !re && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Pi(t, a, p);
    }
  }
  window.addEventListener("popstate", m);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const p = i || document.querySelector(".nimbi-cms");
      if (!p) return;
      const w = {
        top: p.scrollTop || 0,
        left: p.scrollLeft || 0
      };
      sessionStorage.setItem(d(), JSON.stringify(w));
    } catch (p) {
      _("[nimbi-cms] save scroll position failed", p);
    }
  }, y = () => {
    try {
      const p = i || document.querySelector(".nimbi-cms");
      if (!p) return;
      const w = sessionStorage.getItem(d());
      if (!w) return;
      const b = JSON.parse(w);
      b && typeof b.top == "number" && p.scrollTo({ top: b.top, left: b.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (p) => {
    if (p.persisted)
      try {
        y(), zn(i, 100, !1);
      } catch (w) {
        _("[nimbi-cms] bfcache restore failed", w);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (p) {
      _("[nimbi-cms] save scroll position failed", p);
    }
  }), { renderByQuery: m, siteNav: u, getCurrentPagePath: () => c };
}
function bl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = tt(window.location.href);
        a && a.params && (t = a.params.startsWith("?") ? a.params : "?" + a.params);
      } catch {
        t = "";
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
function br(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function wl(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let Bn = "";
async function Cl(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = bl();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        _("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
    else {
      try {
        _("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    if (Object.prototype.hasOwnProperty.call(n, "debugLevel"))
      ci(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const M = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(M) && ci(Math.max(0, Math.min(3, Math.floor(M))));
      } catch {
      }
  } catch {
  }
  try {
    Mt("[nimbi-cms] initCMS called", { options: n });
  } catch {
  }
  t && typeof t.bulmaCustomize == "string" && t.bulmaCustomize.trim() && (n.bulmaCustomize = t.bulmaCustomize);
  let {
    el: i,
    contentPath: r = "/content",
    crawlMaxQueue: a = 1e3,
    searchIndex: s = !0,
    searchIndexMode: l = "eager",
    indexDepth: o = 1,
    noIndexing: f = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: u = "none",
    lang: h = void 0,
    l10nFile: m = null,
    cacheTtlMinutes: d = 5,
    cacheMaxEntries: g,
    markdownExtensions: y,
    availableLanguages: p,
    homePage: w = null,
    notFoundPage: b = null,
    navigationPage: k = "_navigation.md",
    exposeSitemap: S = !0
  } = n;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: R = !1 } = n, W = (M) => {
    try {
      const $ = document.querySelector(i);
      $ && $ instanceof Element && ($.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(M)}</pre></div>`);
    } catch {
    }
  };
  if (n.contentPath != null && !wl(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !br(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (b != null && !br(b))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !br(k))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let I = i;
  if (typeof i == "string") {
    if (I = document.querySelector(i), !I) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof s != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (l != null && l !== "eager" && l !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (o != null && o !== 1 && o !== 2 && o !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (c !== "light" && c !== "dark" && c !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (u != null && typeof u != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (m != null && typeof m != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (d != null && (typeof d != "number" || !Number.isFinite(d) || d < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (g != null && (typeof g != "number" || !Number.isInteger(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (y != null && (!Array.isArray(y) || y.some((M) => !M || typeof M != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (p != null && (!Array.isArray(p) || p.some((M) => typeof M != "string" || !M.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (f != null && (!Array.isArray(f) || f.some((M) => typeof M != "string" || !M.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (R != null && typeof R != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const H = !!s;
  try {
    Promise.resolve().then(() => ot).then((M) => {
      try {
        M && typeof M.setSkipRootReadme == "function" && M.setSkipRootReadme(!!R);
      } catch ($) {
        _("[nimbi-cms] setSkipRootReadme failed", $);
      }
    }).catch((M) => {
    });
  } catch (M) {
    _("[nimbi-cms] setSkipRootReadme dynamic import failed", M);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && Ns(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(M) {
        try {
          const $ = { type: "error", message: M && M.message ? String(M.message) : "", filename: M && M.filename ? String(M.filename) : "", lineno: M && M.lineno ? M.lineno : null, colno: M && M.colno ? M.colno : null, stack: M && M.error && M.error.stack ? M.error.stack : null, time: Date.now() };
          try {
            _("[nimbi-cms] runtime error", $.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push($);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(M) {
        try {
          const $ = { type: "unhandledrejection", reason: M && M.reason ? String(M.reason) : "", time: Date.now() };
          try {
            _("[nimbi-cms] unhandledrejection", $.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push($);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const M = tt(typeof window < "u" ? window.location.href : ""), $ = M && M.page ? M.page : w || void 0;
      try {
        $ && Bs($, Bn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        I.classList.add("nimbi-mount");
      } catch (A) {
        _("[nimbi-cms] mount element setup failed", A);
      }
      const M = document.createElement("section");
      M.className = "section";
      const $ = document.createElement("div");
      $.className = "container nimbi-cms";
      const K = document.createElement("div");
      K.className = "columns";
      const Z = document.createElement("div");
      Z.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", Z.setAttribute("role", "navigation");
      try {
        const A = typeof rn == "function" ? rn("navigation") : null;
        A && Z.setAttribute("aria-label", A);
      } catch (A) {
        _("[nimbi-cms] set nav aria-label failed", A);
      }
      K.appendChild(Z);
      const he = document.createElement("main");
      he.className = "column nimbi-content", he.setAttribute("role", "main"), K.appendChild(he), $.appendChild(K), M.appendChild($);
      const L = Z, U = he;
      I.appendChild(M);
      let J = null;
      try {
        J = I.querySelector(".nimbi-overlay"), J || (J = document.createElement("div"), J.className = "nimbi-overlay", I.appendChild(J));
      } catch (A) {
        J = null, _("[nimbi-cms] mount overlay setup failed", A);
      }
      const be = location.pathname || "/";
      let ee;
      if (be.endsWith("/"))
        ee = be;
      else {
        const A = be.substring(be.lastIndexOf("/") + 1);
        A && !A.includes(".") ? ee = be + "/" : ee = be.substring(0, be.lastIndexOf("/") + 1);
      }
      try {
        Bn = document.title || "";
      } catch (A) {
        Bn = "", _("[nimbi-cms] read initial document title failed", A);
      }
      let ue = r;
      const Ae = Object.prototype.hasOwnProperty.call(n, "contentPath"), E = typeof location < "u" && location.origin ? location.origin : "http://localhost", B = new URL(ee, E).toString();
      (ue === "." || ue === "./") && (ue = "");
      try {
        ue = String(ue || "").replace(/\\/g, "/");
      } catch {
        ue = String(ue || "");
      }
      ue.startsWith("/") && (ue = ue.replace(/^\/+/, "")), ue && !ue.endsWith("/") && (ue = ue + "/");
      try {
        if (ue && ee && ee !== "/") {
          const A = ee.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          A && ue.startsWith(A) && (ue = ue.slice(A.length));
        }
      } catch {
      }
      try {
        if (ue)
          var C = new URL(ue, B.endsWith("/") ? B : B + "/").toString();
        else
          var C = B;
      } catch {
        try {
          if (ue) var C = new URL("/" + ue, E).toString();
          else var C = new URL(ee, E).toString();
        } catch {
          var C = E;
        }
      }
      if (m && await Fi(m, ee), p && Array.isArray(p) && Qi(p), h && Wi(h), typeof d == "number" && d >= 0 && typeof wi == "function" && wi(d * 60 * 1e3), typeof g == "number" && g >= 0 && typeof bi == "function" && bi(g), y && Array.isArray(y) && y.length)
        try {
          y.forEach((A) => {
            typeof A == "object" && Aa && typeof Er == "function" && Er(A);
          });
        } catch (A) {
          _("[nimbi-cms] applying markdownExtensions failed", A);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => ot).then(({ setDefaultCrawlMaxQueue: A }) => {
          try {
            A(a);
          } catch (O) {
            _("[nimbi-cms] setDefaultCrawlMaxQueue failed", O);
          }
        });
      } catch (A) {
        _("[nimbi-cms] setDefaultCrawlMaxQueue import failed", A);
      }
      try {
        try {
          const A = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (A && typeof A == "object")
            try {
              const O = await Promise.resolve().then(() => ot);
              if (O && typeof O._setAllMd == "function") {
                O._setAllMd(A);
                try {
                  Mt("[nimbi-cms diagnostic] applied content manifest", { manifestKeys: Object.keys(A).length });
                } catch {
                }
              }
            } catch (O) {
              _("[nimbi-cms] applying content manifest failed", O);
            }
          try {
            Or(C);
          } catch (O) {
            _("[nimbi-cms] setContentBase failed", O);
          }
          try {
            try {
              const O = await Promise.resolve().then(() => ot);
              try {
                Mt("[nimbi-cms diagnostic] after setContentBase", {
                  manifestKeys: A && typeof A == "object" ? Object.keys(A).length : 0,
                  slugToMdSize: O && O.slugToMd && typeof O.slugToMd.size == "number" ? O.slugToMd.size : void 0,
                  allMarkdownPathsLength: O && Array.isArray(O.allMarkdownPaths) ? O.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: O && O.allMarkdownPathsSet && typeof O.allMarkdownPathsSet.size == "number" ? O.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: O && Array.isArray(O.searchIndex) ? O.searchIndex.length : void 0
                });
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (A) {
        _("[nimbi-cms] setContentBase failed", A);
      }
      try {
        Vi(b);
      } catch (A) {
        _("[nimbi-cms] setNotFoundPage failed", A);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => mn).then((A) => {
          try {
            A && typeof A.attachSitemapDownloadUI == "function" && A.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let q = null, P = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k)
          try {
            const V = [], se = [];
            try {
              k && se.push(String(k));
            } catch {
            }
            try {
              const G = String(k || "").replace(/^_/, "");
              G && G !== String(k) && se.push(G);
            } catch {
            }
            try {
              se.push("navigation.md");
            } catch {
            }
            try {
              se.push("assets/navigation.md");
            } catch {
            }
            const me = [];
            for (const G of se)
              try {
                if (!G) continue;
                const j = String(G);
                me.includes(j) || me.push(j);
              } catch {
              }
            for (const G of me) {
              V.push(G);
              try {
                if (P = await Ee(G, C, { force: !0 }), P && P.raw) {
                  try {
                    k = G;
                  } catch {
                  }
                  try {
                    _("[nimbi-cms] fetched navigation candidate", G, "contentBase=", C);
                  } catch {
                  }
                  q = await Sn(P.raw || "");
                  try {
                    const j = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (j && q && q.html) {
                      const xe = j.parseFromString(q.html, "text/html").querySelector("a");
                      if (xe)
                        try {
                          const De = xe.getAttribute("href") || "", Se = tt(De);
                          try {
                            _("[nimbi-cms] parsed nav first-link href", De, "->", Se);
                          } catch {
                          }
                          if (Se && Se.page && (Se.type === "path" || Se.type === "canonical" && (Se.page.includes(".") || Se.page.includes("/")))) {
                            w = Se.page;
                            try {
                              _("[nimbi-cms] derived homePage from navigation", w);
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
          _("[nimbi-cms] final homePage before slugManager setHomePage", w);
        } catch {
        }
        try {
          Yi(w);
        } catch (V) {
          _("[nimbi-cms] setHomePage failed", V);
        }
        let O = !0;
        try {
          const V = tt(typeof location < "u" ? location.href : "");
          V && V.type === "cosmetic" && (typeof b > "u" || b == null) && (O = !1);
        } catch {
        }
        if (O && w)
          try {
            await Ee(w, C, { force: !0 });
          } catch (V) {
            throw new Error(`Required ${w} not found at ${C}${w}: ${V && V.message ? V.message : String(V)}`);
          }
      } catch (A) {
        throw A;
      }
      ls(c), await os(u, ee);
      const D = yl({ contentWrap: U, navWrap: L, container: $, mountOverlay: J, t: rn, contentBase: C, homePage: w, initialDocumentTitle: Bn, runHooks: ui });
      try {
        const A = document.createElement("header");
        A.className = "nimbi-site-navbar", I.insertBefore(A, M);
        let O = P, V = q;
        V || (O = await Ee(k, C, { force: !0 }), V = await Sn(O.raw || ""));
        const { navbar: se, linkEls: me } = await fl(A, $, V.html || "", C, w, rn, D.renderByQuery, H, l, o, f, v);
        try {
          await ui("onNavBuild", { navWrap: L, navbar: se, linkEls: me, contentBase: C });
        } catch (G) {
          _("[nimbi-cms] onNavBuild hooks failed", G);
        }
        try {
          try {
            if (me && me.length) {
              const G = await Promise.resolve().then(() => ot);
              for (const j of Array.from(me || []))
                try {
                  const z = j && j.getAttribute && j.getAttribute("href") || "";
                  if (!z) continue;
                  let xe = String(z || "").split(/::|#/, 1)[0];
                  if (xe = String(xe || "").split("?")[0], !xe) continue;
                  /\.(?:md|html?)$/.test(xe) || (xe = xe + ".html");
                  const De = String(xe || "").replace(/^.*\//, "").replace(/\?.*$/, ""), Se = String(De || "").replace(/\s+/g, "-").toLowerCase();
                  if (!Se) continue;
                  try {
                    if (G && typeof G._storeSlugMapping == "function")
                      try {
                        G._storeSlugMapping(Se, xe);
                      } catch {
                      }
                    else if (G && G.slugToMd && typeof G.slugToMd.set == "function")
                      try {
                        G.slugToMd.set(Se, xe);
                      } catch {
                      }
                    try {
                      G && G.mdToSlug && typeof G.mdToSlug.set == "function" && G.mdToSlug.set(xe, Se);
                    } catch {
                    }
                    try {
                      G && Array.isArray(G.allMarkdownPaths) && !G.allMarkdownPaths.includes(xe) && G.allMarkdownPaths.push(xe);
                    } catch {
                    }
                    try {
                      G && G.allMarkdownPathsSet && typeof G.allMarkdownPathsSet.add == "function" && G.allMarkdownPathsSet.add(xe);
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const j = await Promise.resolve().then(() => dr);
                j && typeof j.refreshIndexPaths == "function" && j.refreshIndexPaths(C);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let G = !1;
          try {
            const j = new URLSearchParams(location.search || "");
            (j.has("sitemap") || j.has("rss") || j.has("atom")) && (G = !0);
          } catch {
          }
          try {
            const z = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            z && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(z) && (G = !0);
          } catch {
          }
          if (G || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const z = await Promise.resolve().then(() => ot);
                if (z && typeof z.awaitSearchIndex == "function") {
                  const xe = [];
                  w && xe.push(w), k && xe.push(k);
                  try {
                    await z.awaitSearchIndex({ contentBase: C, indexDepth: Math.max(o || 1, 3), noIndexing: f, seedPaths: xe.length ? xe : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const j = await Promise.resolve().then(() => mn);
              try {
                if (j && typeof j.handleSitemapRequest == "function" && await j.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: b, contentBase: C, indexDepth: o, noIndexing: f }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => mn).then((j) => {
              try {
                if (j && typeof j.exposeSitemapGlobals == "function")
                  try {
                    j.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: b, contentBase: C, indexDepth: o, noIndexing: f, waitForIndexMs: 1 / 0 }).catch(() => {
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
          try {
            const j = await Promise.resolve().then(() => dr);
            if (j && typeof j.refreshIndexPaths == "function")
              try {
                j.refreshIndexPaths(C);
                try {
                  try {
                    const z = await Promise.resolve().then(() => ot);
                    try {
                      Mt("[nimbi-cms diagnostic] after refreshIndexPaths", { slugToMdSize: z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : void 0, allMarkdownPathsLength: z && Array.isArray(z.allMarkdownPaths) ? z.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: z && z.allMarkdownPathsSet && typeof z.allMarkdownPathsSet.size == "number" ? z.allMarkdownPathsSet.size : void 0 });
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const z = await Promise.resolve().then(() => ot), xe = z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : 0;
                  let De = !1;
                  try {
                    if (!manifest) {
                      xe < 30 && (De = !0);
                      try {
                        const Se = tt(typeof location < "u" ? location.href : "");
                        if (Se) {
                          if (Se.type === "cosmetic" && Se.page)
                            try {
                              z.slugToMd.has(Se.page) || (De = !0);
                            } catch {
                            }
                          else if ((Se.type === "path" || Se.type === "canonical") && Se.page)
                            try {
                              const Ne = ie(Se.page);
                              !(z.mdToSlug && z.mdToSlug.has(Ne)) && !(z.allMarkdownPathsSet && z.allMarkdownPathsSet.has(Ne)) && (De = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (De) {
                    let Se = null;
                    try {
                      Se = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      Se = null;
                    }
                    if (Array.isArray(Se) && Se.length) {
                      let Ne = 0;
                      for (const Je of Se)
                        try {
                          if (!Je || !Je.slug) continue;
                          const Kt = String(Je.slug).split("::")[0];
                          if (z.slugToMd.has(Kt)) continue;
                          let ht = Je.sourcePath || Je.path || null;
                          if (!ht && Array.isArray(Se)) {
                            const st = (Se || []).find((et) => et && et.slug === Je.slug);
                            st && st.path && (ht = st.path);
                          }
                          if (!ht) continue;
                          try {
                            ht = String(ht);
                          } catch {
                            continue;
                          }
                          let Ue = null;
                          try {
                            const st = C && typeof C == "string" ? C : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const et = new URL(ht, st), zt = new URL(st);
                              if (et.origin === zt.origin) {
                                const Vt = zt.pathname || "/";
                                let xt = et.pathname || "";
                                xt.startsWith(Vt) && (xt = xt.slice(Vt.length)), xt.startsWith("/") && (xt = xt.slice(1)), Ue = ie(xt);
                              } else
                                Ue = ie(et.pathname || "");
                            } catch {
                              Ue = ie(ht);
                            }
                          } catch {
                            Ue = ie(ht);
                          }
                          if (!Ue) continue;
                          Ue = String(Ue).split(/[?#]/)[0], Ue = ie(Ue);
                          try {
                            z._storeSlugMapping(Kt, Ue);
                          } catch {
                          }
                          Ne++;
                        } catch {
                        }
                      if (Ne) {
                        try {
                          Mt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", { added: Ne, total: z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : void 0 });
                        } catch {
                        }
                        try {
                          const Je = await Promise.resolve().then(() => dr);
                          Je && typeof Je.refreshIndexPaths == "function" && Je.refreshIndexPaths(C);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (z) {
                _("[nimbi-cms] refreshIndexPaths after nav build failed", z);
              }
          } catch {
          }
          const G = () => {
            const j = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.offsetHeight || 0;
            if (j > 0) {
              try {
                I.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (z) {
                _("[nimbi-cms] set CSS var failed", z);
              }
              try {
                $.style.paddingTop = "";
              } catch (z) {
                _("[nimbi-cms] set container paddingTop failed", z);
              }
              try {
                const z = I && I.getBoundingClientRect && Math.round(I.getBoundingClientRect().height) || I && I.clientHeight || 0;
                if (z > 0) {
                  const xe = Math.max(0, z - j);
                  try {
                    $.style.setProperty("--nimbi-cms-height", `${xe}px`);
                  } catch (De) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", De);
                  }
                } else
                  try {
                    $.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (xe) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", xe);
                  }
              } catch (z) {
                _("[nimbi-cms] compute container height failed", z);
              }
              try {
                A.style.setProperty("--nimbi-site-navbar-height", `${j}px`);
              } catch (z) {
                _("[nimbi-cms] set navbar CSS var failed", z);
              }
            }
          };
          G();
          try {
            if (typeof ResizeObserver < "u") {
              const j = new ResizeObserver(() => G());
              try {
                j.observe(A);
              } catch (z) {
                _("[nimbi-cms] ResizeObserver.observe failed", z);
              }
            }
          } catch (j) {
            _("[nimbi-cms] ResizeObserver setup failed", j);
          }
        } catch (G) {
          _("[nimbi-cms] compute navbar height failed", G);
        }
      } catch (A) {
        _("[nimbi-cms] build navigation failed", A);
      }
      await D.renderByQuery();
      try {
        Promise.resolve().then(() => kl).then(({ getVersion: A }) => {
          typeof A == "function" && A().then((O) => {
            try {
              const V = O || "0.0.0";
              try {
                const se = (j) => {
                  const z = document.createElement("a");
                  z.className = "nimbi-version-label tag is-small", z.textContent = `nimbiCMS v. ${V}`, z.href = j || "#", z.target = "_blank", z.rel = "noopener noreferrer nofollow", z.setAttribute("aria-label", `nimbiCMS version ${V}`);
                  try {
                    Hi(z);
                  } catch {
                  }
                  try {
                    I.appendChild(z);
                  } catch (xe) {
                    _("[nimbi-cms] append version label failed", xe);
                  }
                }, me = "https://abelvm.github.io/nimbiCMS/", G = (() => {
                  try {
                    if (me && typeof me == "string")
                      return new URL(me).toString();
                  } catch {
                  }
                  return "#";
                })();
                se(G);
              } catch (se) {
                _("[nimbi-cms] building version label failed", se);
              }
            } catch (V) {
              _("[nimbi-cms] building version label failed", V);
            }
          }).catch((O) => {
            _("[nimbi-cms] getVersion() failed", O);
          });
        }).catch((A) => {
          _("[nimbi-cms] import version module failed", A);
        });
      } catch (A) {
        _("[nimbi-cms] version label setup failed", A);
      }
    })();
  } catch (M) {
    throw W(M), M;
  }
}
async function _l() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: _l
}, Symbol.toStringTag, { value: "Module" })), Ge = _t, nn = _;
function Qr() {
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
function zi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function xl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = ie(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Xr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Qr().split("?")[0];
  let o = Array.isArray(X) && X.length ? X : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(X) && X.length) {
    const p = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && p.set(String(w.slug), w);
        } catch {
        }
      for (const w of X)
        try {
          w && w.slug && p.set(String(w.slug), w);
        } catch {
        }
    } catch {
    }
    o = Array.from(p.values());
  }
  const f = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && f.add(ie(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && f.add(ie(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const p = ie(String(a));
      try {
        if (ne && typeof ne.has == "function" && ne.has(p))
          try {
            c.add(ne.get(p));
          } catch {
          }
        else
          try {
            const w = await Ee(p, e && e.contentBase ? e.contentBase : void 0);
            if (w && w.raw)
              try {
                let b = null;
                if (w.isHtml)
                  try {
                    const S = new DOMParser().parseFromString(w.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (b = v.textContent.trim());
                  } catch {
                  }
                else {
                  const k = (w.raw || "").match(/^#\s+(.+)$/m);
                  k && k[1] && (b = k[1].trim());
                }
                b && c.add(ke(b));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), h = [], m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), g = (p) => {
    try {
      if (!p || typeof p != "string") return !1;
      const w = ie(String(p));
      try {
        if (Te && typeof Te.has == "function" && Te.has(w)) return !0;
      } catch {
      }
      try {
        if (ne && typeof ne.has == "function" && ne.has(w)) return !0;
      } catch {
      }
      try {
        if (d && d.has(w)) return !0;
      } catch {
      }
      try {
        for (const b of ae.values())
          try {
            if (!b) continue;
            if (typeof b == "string") {
              if (ie(String(b)) === w) return !0;
            } else if (b && typeof b == "object") {
              if (b.default && ie(String(b.default)) === w) return !0;
              const k = b.langs || {};
              for (const S of Object.keys(k || {}))
                try {
                  if (k[S] && ie(String(k[S])) === w) return !0;
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
    for (const p of o)
      try {
        if (!p || !p.slug) continue;
        const w = String(p.slug), b = String(w).split("::")[0];
        if (c.has(b)) continue;
        const k = p.path ? ie(String(p.path)) : null;
        if (k && f.has(k)) continue;
        const S = p.title ? String(p.title) : p.parentTitle ? String(p.parentTitle) : void 0;
        m.set(w, { title: S || void 0, excerpt: p.excerpt ? String(p.excerpt) : void 0, path: k, source: "index" }), k && d.set(k, { title: S || void 0, excerpt: p.excerpt ? String(p.excerpt) : void 0, slug: w });
        const v = xl(l, p);
        if (!v || !v.slug || u.has(v.slug)) continue;
        if (u.add(v.slug), m.has(v.slug)) {
          const R = m.get(v.slug);
          R && R.title && (v.title = R.title, v._titleSource = "index"), R && R.excerpt && (v.excerpt = R.excerpt);
        }
        h.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [p, w] of ae.entries())
        try {
          if (!p) continue;
          const b = String(p).split("::")[0];
          if (u.has(p) || c.has(b)) continue;
          let k = null;
          if (typeof w == "string" ? k = ie(String(w)) : w && typeof w == "object" && (k = ie(String(w.default || ""))), k && f.has(k)) continue;
          const v = { loc: l + "?page=" + encodeURIComponent(p), slug: p };
          if (m.has(p)) {
            const R = m.get(p);
            R && R.title && (v.title = R.title, v._titleSource = "index"), R && R.excerpt && (v.excerpt = R.excerpt);
          } else if (k) {
            const R = d.get(k);
            R && R.title && (v.title = R.title, v._titleSource = "path", !v.excerpt && R.excerpt && (v.excerpt = R.excerpt));
          }
          if (u.add(p), typeof p == "string") {
            const R = p.indexOf("/") !== -1 || /\.(md|html?)$/i.test(p), W = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || W || R) && (v.title = zi(p), v._titleSource = "humanize");
          }
          h.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const p = ie(String(i));
          let w = null;
          try {
            ne && ne.has(p) && (w = ne.get(p));
          } catch {
          }
          w || (w = p);
          const b = String(w).split("::")[0];
          if (!u.has(w) && !f.has(p) && !c.has(b)) {
            const k = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (m.has(w)) {
              const S = m.get(w);
              S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt);
            }
            u.add(w), h.push(k);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const p = /* @__PURE__ */ new Set(), w = new Set(h.map((v) => String(v && v.slug ? v.slug : ""))), b = /* @__PURE__ */ new Set();
    for (const v of h)
      try {
        v && v.sourcePath && b.add(String(v.sourcePath));
      } catch {
      }
    const k = 30;
    let S = 0;
    for (const v of b) {
      if (S >= k) break;
      try {
        if (!v || typeof v != "string" || !g(v)) continue;
        S += 1;
        const R = await Ee(v, e && e.contentBase ? e.contentBase : void 0);
        if (!R || !R.raw || R && typeof R.status == "number" && R.status === 404) continue;
        const W = R.raw, I = (function(Z) {
          try {
            return String(Z || "");
          } catch {
            return "";
          }
        })(W), H = [], M = /\[[^\]]+\]\(([^)]+)\)/g;
        let $;
        for (; $ = M.exec(I); )
          try {
            $ && $[1] && H.push($[1]);
          } catch {
          }
        const K = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; $ = K.exec(I); )
          try {
            $ && $[1] && H.push($[1]);
          } catch {
          }
        for (const Z of H)
          try {
            if (!Z) continue;
            if (Z.indexOf("?") !== -1 || Z.indexOf("=") !== -1)
              try {
                const U = new URL(Z, l).searchParams.get("page");
                if (U) {
                  const J = String(U);
                  !w.has(J) && !p.has(J) && (p.add(J), h.push({ loc: l + "?page=" + encodeURIComponent(J), slug: J }));
                  continue;
                }
              } catch {
              }
            let he = String(Z).split(/[?#]/)[0];
            if (he = he.replace(/^\.\//, "").replace(/^\//, ""), !he || !/\.(md|html?)$/i.test(he)) continue;
            try {
              const L = ie(he);
              if (ne && ne.has(L)) {
                const U = ne.get(L), J = String(U).split("::")[0];
                U && !w.has(U) && !p.has(U) && !c.has(J) && !f.has(L) && (p.add(U), h.push({ loc: l + "?page=" + encodeURIComponent(U), slug: U, sourcePath: L }));
                continue;
              }
              try {
                if (!g(L)) continue;
                const U = await Ee(L, e && e.contentBase ? e.contentBase : void 0);
                if (U && typeof U.status == "number" && U.status === 404) continue;
                if (U && U.raw) {
                  const J = (U.raw || "").match(/^#\s+(.+)$/m), be = J && J[1] ? J[1].trim() : "", ee = ke(be || L), ue = String(ee).split("::")[0];
                  ee && !w.has(ee) && !p.has(ee) && !c.has(ue) && (p.add(ee), h.push({ loc: l + "?page=" + encodeURIComponent(ee), slug: ee, sourcePath: L, title: be || void 0 }));
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
    const p = /* @__PURE__ */ new Map();
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        p.set(String(b.slug), b);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        const k = String(b.slug), S = k.split("::")[0];
        if (!S) continue;
        k !== S && !p.has(S) && w.add(S);
      } catch {
      }
    for (const b of w)
      try {
        let k = null;
        if (m.has(b)) {
          const S = m.get(b);
          k = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt), S && S.path && (k.sourcePath = S.path);
        } else if (d && ae && ae.has(b)) {
          const S = ae.get(b);
          let v = null;
          if (typeof S == "string" ? v = ie(String(S)) : S && typeof S == "object" && (v = ie(String(S.default || ""))), k = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, v && d.has(v)) {
            const R = d.get(v);
            R && R.title && (k.title = R.title, k._titleSource = "path"), R && R.excerpt && (k.excerpt = R.excerpt), k.sourcePath = v;
          }
        }
        k || (k = { loc: l + "?page=" + encodeURIComponent(b), slug: b, title: zi(b) }, k._titleSource = "humanize"), p.has(b) || (h.push(k), p.set(b, k));
      } catch {
      }
  } catch {
  }
  const y = [];
  try {
    const p = /* @__PURE__ */ new Set();
    for (const w of h)
      try {
        if (!w || !w.slug) continue;
        const b = String(w.slug), k = String(b).split("::")[0];
        if (c.has(k) || b.indexOf("::") !== -1 || p.has(b)) continue;
        p.add(b), y.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Ge("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(y.map((p) => ({ slug: p.slug, title: p.title, titleSource: p._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let w = 0;
    const b = y.length, k = Array.from({ length: Math.min(4, b) }).map(async () => {
      for (; ; ) {
        const S = w++;
        if (S >= b) break;
        const v = y[S];
        try {
          if (!v || !v.slug) continue;
          const R = String(v.slug).split("::")[0];
          if (c.has(R) || v._titleSource === "index") continue;
          let W = null;
          try {
            if (ae && ae.has(v.slug)) {
              const I = ae.get(v.slug);
              typeof I == "string" ? W = ie(String(I)) : I && typeof I == "object" && (W = ie(String(I.default || "")));
            }
            !W && v.sourcePath && (W = v.sourcePath);
          } catch {
            continue;
          }
          if (!W || f.has(W) || !g(W)) continue;
          try {
            const I = await Ee(W, e && e.contentBase ? e.contentBase : void 0);
            if (!I || !I.raw || I && typeof I.status == "number" && I.status === 404) continue;
            if (I && I.raw) {
              const H = (I.raw || "").match(/^#\s+(.+)$/m), M = H && H[1] ? H[1].trim() : "";
              M && (v.title = M, v._titleSource = "fetched");
            }
          } catch (I) {
            Ge("[runtimeSitemap] fetch title failed for", W, I);
          }
        } catch (R) {
          Ge("[runtimeSitemap] worker loop failure", R);
        }
      }
    });
    await Promise.all(k);
  } catch (p) {
    Ge("[runtimeSitemap] title enrichment failed", p);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
}
function Tr(e) {
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
function Rr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Qr().split("?")[0];
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
function Cr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Qr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
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
function Ii(e, t = "application/xml") {
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
function Oi(e) {
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
function qn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = Rr(e) : t === "application/atom+xml" ? i = Cr(e) : t === "text/html" ? i = Oi(e) : i = Tr(e), Ii(i, t);
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
          r.mimeType === "application/rss+xml" ? a = Rr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = Cr(r.finalJson) : r.mimeType === "text/html" ? a = Oi(r.finalJson) : a = Tr(r.finalJson);
          try {
            Ii(a, r.mimeType);
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
async function Sl(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let u = !0;
        for (const h of c.keys()) h !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (c.has("rss")) {
        let u = !0;
        for (const h of c.keys()) h !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (c.has("atom")) {
        let u = !0;
        for (const h of c.keys()) h !== "atom" && (u = !1);
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
      if (typeof Ct == "function")
        try {
          const c = await Ct({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const u = /* @__PURE__ */ new Map();
              try {
                for (const h of e.index)
                  try {
                    h && h.slug && u.set(String(h.slug), h);
                  } catch {
                  }
                for (const h of c)
                  try {
                    h && h.slug && u.set(String(h.slug), h);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(u.values());
            } else
              a = c;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(X) && X.length ? X : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(X) && X.length ? X : [];
        }
      else
        a = Array.isArray(X) && X.length ? X : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(X) && X.length ? X : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const c = /* @__PURE__ */ new Map();
          for (const u of e.index)
            try {
              if (!u || !u.slug) continue;
              const h = String(u.slug).split("::")[0];
              if (!c.has(h)) c.set(h, u);
              else {
                const m = c.get(h);
                m && String(m.slug || "").indexOf("::") !== -1 && String(u.slug || "").indexOf("::") === -1 && c.set(h, u);
              }
            } catch {
            }
          try {
            Ge("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            Ge("[runtimeSitemap] providedIndex.dedupedByBase (count):", c.size);
          }
        } catch (c) {
          nn("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Bt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof Ct == "function" && (u = await Ct({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const h = typeof e.indexDepth == "number" ? e.indexDepth : 3, m = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, d = [];
          e && e.homePage && d.push(e.homePage), e && e.navigationPage && d.push(e.navigationPage), a = await Bt(e && e.contentBase ? e.contentBase : void 0, h, m, d.length ? d : void 0);
        }
      } catch (c) {
        nn("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(X) && X.length ? X : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ge("[runtimeSitemap] usedIndex.full.length (before rebuild):", c);
      } catch {
      }
      try {
        Ge("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, h = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let m = null;
      try {
        const d = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof d == "function")
          try {
            m = await d(e && e.contentBase ? e.contentBase : void 0, u, h);
          } catch {
            m = null;
          }
      } catch {
        m = null;
      }
      if ((!m || !m.length) && typeof Bt == "function")
        try {
          m = await Bt(e && e.contentBase ? e.contentBase : void 0, u, h, c.length ? c : void 0);
        } catch {
          m = null;
        }
      if (Array.isArray(m) && m.length) {
        const d = /* @__PURE__ */ new Map();
        try {
          for (const g of a)
            try {
              g && g.slug && d.set(String(g.slug), g);
            } catch {
            }
          for (const g of m)
            try {
              g && g.slug && d.set(String(g.slug), g);
            } catch {
            }
        } catch {
        }
        a = Array.from(d.values());
      }
    } catch (c) {
      try {
        nn("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ge("[runtimeSitemap] usedIndex.full.length (after rebuild):", c);
      } catch {
      }
      try {
        Ge("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await Xr(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), u = Array.isArray(l && l.entries) ? l.entries : [];
      for (const h of u)
        try {
          let m = null;
          if (h && h.slug) m = String(h.slug);
          else if (h && h.loc)
            try {
              m = new URL(String(h.loc)).searchParams.get("page");
            } catch {
            }
          if (!m) continue;
          const d = String(m).split("::")[0];
          if (!c.has(d)) {
            c.add(d);
            const g = Object.assign({}, h);
            g.baseSlug = d, o.push(g);
          }
        } catch {
        }
      try {
        Ge("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(o, null, 2));
      } catch {
        Ge("[runtimeSitemap] finalEntries.dedupedByBase (count):", o.length);
      }
    } catch {
      try {
        o = Array.isArray(l && l.entries) ? l.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const f = Object.assign({}, l || {}, { entries: Array.isArray(o) ? o : Array.isArray(l && l.entries) ? l.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = f, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const c = Array.isArray(f && f.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Ge("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return qn(f, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(f && f.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Ge("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return qn(f, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(f && f.entries) ? f.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          Ge("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return qn(f, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(f && f.entries) ? f.entries : []).length;
        let h = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (h = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (h > u) {
          try {
            Ge("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", h, u);
          } catch {
          }
          return !0;
        }
        return qn(f, "text/html"), !0;
      } catch (c) {
        return nn("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return nn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function vl(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Ct == "function")
        try {
          const s = await Ct({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(X) && X.length && (n = X), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Xr(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), l = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of l)
        try {
          let f = null;
          if (o && o.slug) f = String(o.slug);
          else if (o && o.loc)
            try {
              f = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              f = null;
            }
          if (!f) continue;
          const c = String(f).split("::")[0];
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
const mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: vl,
  generateAtomXml: Cr,
  generateRssXml: Rr,
  generateSitemapJson: Xr,
  generateSitemapXml: Tr,
  handleSitemapRequest: Sl
}, Symbol.toStringTag, { value: "Module" }));
export {
  Di as BAD_LANGUAGES,
  _e as SUPPORTED_HLJS_MAP,
  Ml as _clearHooks,
  $r as addHook,
  Cl as default,
  os as ensureBulma,
  _l as getVersion,
  Cl as initCMS,
  Fi as loadL10nFile,
  ji as loadSupportedLanguages,
  as as observeCodeBlocks,
  El as onNavBuild,
  Al as onPageLoad,
  bn as registerLanguage,
  ui as runHooks,
  Tl as setHighlightTheme,
  Wi as setLang,
  ls as setStyle,
  Rl as setThemeVars,
  rn as t,
  Ll as transformHtml
};
