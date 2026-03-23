let _r = 0;
const ui = /* @__PURE__ */ Object.create(null);
function hi(e) {
  try {
    const t = Number(e);
    _r = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    _r = 0;
  }
}
function Zt(e = 1) {
  try {
    return Number(_r) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function zr() {
  return Zt(1);
}
function Wn(...e) {
  try {
    Zt(1) && console && typeof console.error == "function" && console.error(...e);
  } catch {
  }
}
function _(...e) {
  try {
    Zt(2) && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Tt(...e) {
  try {
    Zt(3) && console && typeof console.info == "function" && console.info(...e);
  } catch {
  }
}
function $t(...e) {
  try {
    Zt(3) && console && typeof console.log == "function" && console.log(...e);
  } catch {
  }
}
function qi(e) {
  try {
    if (!zr()) return;
    const t = String(e || "");
    if (!t) return;
    ui[t] = (ui[t] || 0) + 1;
  } catch {
  }
}
function ji(e) {
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
const _n = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Ir(e, t) {
  if (!Object.prototype.hasOwnProperty.call(_n, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  _n[e].push(t);
}
function El(e) {
  Ir("onPageLoad", e);
}
function Ml(e) {
  Ir("onNavBuild", e);
}
function Ll(e) {
  Ir("transformHtml", e);
}
async function di(e, t) {
  const n = _n[e] || [];
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
function Tl() {
  Object.keys(_n).forEach((e) => {
    _n[e].length = 0;
  });
}
function Di(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var hr, fi;
function es() {
  if (fi) return hr;
  fi = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((z) => {
      const X = x[z], be = typeof X;
      (be === "object" || be === "function") && !Object.isFrozen(X) && e(X);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(z) {
      z.data === void 0 && (z.data = {}), this.data = z.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...z) {
    const X = /* @__PURE__ */ Object.create(null);
    for (const be in x)
      X[be] = x[be];
    return z.forEach(function(be) {
      for (const je in be)
        X[je] = be[je];
    }), /** @type {T} */
    X;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: z }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const X = x.split(".");
      return [
        `${z}${X.shift()}`,
        ...X.map((be, je) => `${be}${"_".repeat(je + 1)}`)
      ].join(" ");
    }
    return `${z}${x}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(z, X) {
      this.buffer = "", this.classPrefix = X.classPrefix, z.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(z) {
      this.buffer += n(z);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(z) {
      if (!a(z)) return;
      const X = s(
        z.scope,
        { prefix: this.classPrefix }
      );
      this.span(X);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(z) {
      a(z) && (this.buffer += r);
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
    span(z) {
      this.buffer += `<span class="${z}">`;
    }
  }
  const o = (x = {}) => {
    const z = { children: [] };
    return Object.assign(z, x), z;
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
    add(z) {
      this.top.children.push(z);
    }
    /** @param {string} scope */
    openNode(z) {
      const X = o({ scope: z });
      this.add(X), this.stack.push(X);
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
    walk(z) {
      return this.constructor._walk(z, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(z, X) {
      return typeof X == "string" ? z.addText(X) : X.children && (z.openNode(X), X.children.forEach((be) => this._walk(z, be)), z.closeNode(X)), z;
    }
    /**
     * @param {Node} node
     */
    static _collapse(z) {
      typeof z != "string" && z.children && (z.children.every((X) => typeof X == "string") ? z.children = [z.children.join("")] : z.children.forEach((X) => {
        h._collapse(X);
      }));
    }
  }
  class c extends h {
    /**
     * @param {*} options
     */
    constructor(z) {
      super(), this.options = z;
    }
    /**
     * @param {string} text
     */
    addText(z) {
      z !== "" && this.add(z);
    }
    /** @param {string} scope */
    startScope(z) {
      this.openNode(z);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(z, X) {
      const be = z.root;
      X && (be.scope = `language:${X}`), this.add(be);
    }
    toHTML() {
      return new l(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function d(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function u(x) {
    return f("(?=", x, ")");
  }
  function g(x) {
    return f("(?:", x, ")*");
  }
  function p(x) {
    return f("(?:", x, ")?");
  }
  function f(...x) {
    return x.map((X) => d(X)).join("");
  }
  function b(x) {
    const z = x[x.length - 1];
    return typeof z == "object" && z.constructor === Object ? (x.splice(x.length - 1, 1), z) : {};
  }
  function m(...x) {
    return "(" + (b(x).capture ? "" : "?:") + x.map((be) => d(be)).join("|") + ")";
  }
  function w(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function y(x, z) {
    const X = x && x.exec(z);
    return X && X.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: z }) {
    let X = 0;
    return x.map((be) => {
      X += 1;
      const je = X;
      let De = d(be), se = "";
      for (; De.length > 0; ) {
        const ae = k.exec(De);
        if (!ae) {
          se += De;
          break;
        }
        se += De.substring(0, ae.index), De = De.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? se += "\\" + String(Number(ae[1]) + je) : (se += ae[0], ae[0] === "(" && X++);
      }
      return se;
    }).map((be) => `(${be})`).join(z);
  }
  const v = /\b\B/, C = "[a-zA-Z]\\w*", Z = "[a-zA-Z_]\\w*", I = "\\b\\d+(\\.\\d+)?", ee = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", $ = "\\b(0b[01]+)", D = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", ne = (x = {}) => {
    const z = /^#![ ]*\//;
    return x.binary && (x.begin = f(
      z,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: z,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (X, be) => {
        X.index !== 0 && be.ignoreMatch();
      }
    }, x);
  }, j = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, re = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [j]
  }, A = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [j]
  }, G = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, ie = function(x, z, X = {}) {
    const be = i(
      {
        scope: "comment",
        begin: x,
        end: z,
        contains: []
      },
      X
    );
    be.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const je = m(
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
    return be.contains.push(
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
          je,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), be;
  }, Te = ie("//", "$"), Y = ie("/\\*", "\\*/"), ge = ie("#", "$"), Se = {
    scope: "number",
    begin: I,
    relevance: 0
  }, $e = {
    scope: "number",
    begin: ee,
    relevance: 0
  }, Qe = {
    scope: "number",
    begin: $,
    relevance: 0
  }, ve = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      j,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [j]
      }
    ]
  }, rt = {
    scope: "title",
    begin: C,
    relevance: 0
  }, R = {
    scope: "title",
    begin: Z,
    relevance: 0
  }, N = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + Z,
    relevance: 0
  };
  var L = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: re,
    BACKSLASH_ESCAPE: j,
    BINARY_NUMBER_MODE: Qe,
    BINARY_NUMBER_RE: $,
    COMMENT: ie,
    C_BLOCK_COMMENT_MODE: Y,
    C_LINE_COMMENT_MODE: Te,
    C_NUMBER_MODE: $e,
    C_NUMBER_RE: ee,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (z, X) => {
            X.data._beginMatch = z[1];
          },
          /** @type {ModeCallback} */
          "on:end": (z, X) => {
            X.data._beginMatch !== z[1] && X.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ge,
    IDENT_RE: C,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: N,
    NUMBER_MODE: Se,
    NUMBER_RE: I,
    PHRASAL_WORDS_MODE: G,
    QUOTE_STRING_MODE: A,
    REGEXP_MODE: ve,
    RE_STARTERS_RE: D,
    SHEBANG: ne,
    TITLE_MODE: rt,
    UNDERSCORE_IDENT_RE: Z,
    UNDERSCORE_TITLE_MODE: R
  });
  function T(x, z) {
    x.input[x.index - 1] === "." && z.ignoreMatch();
  }
  function O(x, z) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function W(x, z) {
    z && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = T, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function P(x, z) {
    Array.isArray(x.illegal) && (x.illegal = m(...x.illegal));
  }
  function B(x, z) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function E(x, z) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const q = (x, z) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const X = Object.assign({}, x);
    Object.keys(x).forEach((be) => {
      delete x[be];
    }), x.keywords = X.keywords, x.begin = f(X.beforeMatch, u(X.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(X, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete X.beforeMatch;
  }, Q = [
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
  ], U = "keyword";
  function pe(x, z, X = U) {
    const be = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? je(X, x.split(" ")) : Array.isArray(x) ? je(X, x) : Object.keys(x).forEach(function(De) {
      Object.assign(
        be,
        pe(x[De], z, De)
      );
    }), be;
    function je(De, se) {
      z && (se = se.map((ae) => ae.toLowerCase())), se.forEach(function(ae) {
        const me = ae.split("|");
        be[me[0]] = [De, Re(me[0], me[1])];
      });
    }
  }
  function Re(x, z) {
    return z ? Number(z) : ye(x) ? 0 : 1;
  }
  function ye(x) {
    return Q.includes(x.toLowerCase());
  }
  const fe = {}, Ae = (x) => {
    console.error(x);
  }, Ze = (x, ...z) => {
    console.log(`WARN: ${x}`, ...z);
  }, qe = (x, z) => {
    fe[`${x}/${z}`] || (console.log(`Deprecated as of ${x}. ${z}`), fe[`${x}/${z}`] = !0);
  }, mt = new Error();
  function en(x, z, { key: X }) {
    let be = 0;
    const je = x[X], De = {}, se = {};
    for (let ae = 1; ae <= z.length; ae++)
      se[ae + be] = je[ae], De[ae + be] = !0, be += w(z[ae - 1]);
    x[X] = se, x[X]._emit = De, x[X]._multi = !0;
  }
  function St(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), mt;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Ae("beginScope must be object"), mt;
      en(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function La(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), mt;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Ae("endScope must be object"), mt;
      en(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Ta(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Ra(x) {
    Ta(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), St(x), La(x);
  }
  function Ca(x) {
    function z(se, ae) {
      return new RegExp(
        d(se),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class X {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(ae, me) {
        me.position = this.position++, this.matchIndexes[this.matchAt] = me, this.regexes.push([me, ae]), this.matchAt += w(ae) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ae = this.regexes.map((me) => me[1]);
        this.matcherRe = z(S(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const me = this.matcherRe.exec(ae);
        if (!me)
          return null;
        const Ge = me.findIndex((tn, ar) => ar > 0 && tn !== void 0), Ue = this.matchIndexes[Ge];
        return me.splice(0, Ge), Object.assign(me, Ue);
      }
    }
    class be {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const me = new X();
        return this.rules.slice(ae).forEach(([Ge, Ue]) => me.addRule(Ge, Ue)), me.compile(), this.multiRegexes[ae] = me, me;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(ae, me) {
        this.rules.push([ae, me]), me.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(ae) {
        const me = this.getMatcher(this.regexIndex);
        me.lastIndex = this.lastIndex;
        let Ge = me.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ge && Ge.index === this.lastIndex)) {
          const Ue = this.getMatcher(0);
          Ue.lastIndex = this.lastIndex + 1, Ge = Ue.exec(ae);
        }
        return Ge && (this.regexIndex += Ge.position + 1, this.regexIndex === this.count && this.considerAll()), Ge;
      }
    }
    function je(se) {
      const ae = new be();
      return se.contains.forEach((me) => ae.addRule(me.begin, { rule: me, type: "begin" })), se.terminatorEnd && ae.addRule(se.terminatorEnd, { type: "end" }), se.illegal && ae.addRule(se.illegal, { type: "illegal" }), ae;
    }
    function De(se, ae) {
      const me = (
        /** @type CompiledMode */
        se
      );
      if (se.isCompiled) return me;
      [
        O,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        B,
        Ra,
        q
      ].forEach((Ue) => Ue(se, ae)), x.compilerExtensions.forEach((Ue) => Ue(se, ae)), se.__beforeBegin = null, [
        W,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        P,
        // default to 1 relevance if not specified
        E
      ].forEach((Ue) => Ue(se, ae)), se.isCompiled = !0;
      let Ge = null;
      return typeof se.keywords == "object" && se.keywords.$pattern && (se.keywords = Object.assign({}, se.keywords), Ge = se.keywords.$pattern, delete se.keywords.$pattern), Ge = Ge || /\w+/, se.keywords && (se.keywords = pe(se.keywords, x.case_insensitive)), me.keywordPatternRe = z(Ge, !0), ae && (se.begin || (se.begin = /\B|\b/), me.beginRe = z(me.begin), !se.end && !se.endsWithParent && (se.end = /\B|\b/), se.end && (me.endRe = z(me.end)), me.terminatorEnd = d(me.end) || "", se.endsWithParent && ae.terminatorEnd && (me.terminatorEnd += (se.end ? "|" : "") + ae.terminatorEnd)), se.illegal && (me.illegalRe = z(
        /** @type {RegExp | string} */
        se.illegal
      )), se.contains || (se.contains = []), se.contains = [].concat(...se.contains.map(function(Ue) {
        return Pa(Ue === "self" ? se : Ue);
      })), se.contains.forEach(function(Ue) {
        De(
          /** @type Mode */
          Ue,
          me
        );
      }), se.starts && De(se.starts, ae), me.matcher = je(me), me;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), De(
      /** @type Mode */
      x
    );
  }
  function Yr(x) {
    return x ? x.endsWithParent || Yr(x.starts) : !1;
  }
  function Pa(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(z) {
      return i(x, { variants: null }, z);
    })), x.cachedVariants ? x.cachedVariants : Yr(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var $a = "11.11.1";
  class za extends Error {
    constructor(z, X) {
      super(z), this.name = "HTMLInjectionError", this.html = X;
    }
  }
  const ir = n, Jr = i, ei = /* @__PURE__ */ Symbol("nomatch"), Ia = 7, ti = function(x) {
    const z = /* @__PURE__ */ Object.create(null), X = /* @__PURE__ */ Object.create(null), be = [];
    let je = !0;
    const De = "Could not find the language '{}', did you forget to load/include a language module?", se = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let ae = {
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
    function me(F) {
      return ae.noHighlightRe.test(F);
    }
    function Ge(F) {
      let ce = F.className + " ";
      ce += F.parentNode ? F.parentNode.className : "";
      const Ee = ae.languageDetectRe.exec(ce);
      if (Ee) {
        const Ne = Et(Ee[1]);
        return Ne || (Ze(De.replace("{}", Ee[1])), Ze("Falling back to no-highlight mode for this block.", F)), Ne ? Ee[1] : "no-highlight";
      }
      return ce.split(/\s+/).find((Ne) => me(Ne) || Et(Ne));
    }
    function Ue(F, ce, Ee) {
      let Ne = "", Fe = "";
      typeof ce == "object" ? (Ne = F, Ee = ce.ignoreIllegals, Fe = ce.language) : (qe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), qe("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Fe = F, Ne = ce), Ee === void 0 && (Ee = !0);
      const pt = {
        code: Ne,
        language: Fe
      };
      Cn("before:highlight", pt);
      const Mt = pt.result ? pt.result : tn(pt.language, pt.code, Ee);
      return Mt.code = pt.code, Cn("after:highlight", Mt), Mt;
    }
    function tn(F, ce, Ee, Ne) {
      const Fe = /* @__PURE__ */ Object.create(null);
      function pt(J, le) {
        return J.keywords[le];
      }
      function Mt() {
        if (!we.keywords) {
          Xe.addText(Be);
          return;
        }
        let J = 0;
        we.keywordPatternRe.lastIndex = 0;
        let le = we.keywordPatternRe.exec(Be), _e = "";
        for (; le; ) {
          _e += Be.substring(J, le.index);
          const Ie = bt.case_insensitive ? le[0].toLowerCase() : le[0], Ke = pt(we, Ie);
          if (Ke) {
            const [vt, Ya] = Ke;
            if (Xe.addText(_e), _e = "", Fe[Ie] = (Fe[Ie] || 0) + 1, Fe[Ie] <= Ia && (zn += Ya), vt.startsWith("_"))
              _e += le[0];
            else {
              const Ja = bt.classNameAliases[vt] || vt;
              yt(le[0], Ja);
            }
          } else
            _e += le[0];
          J = we.keywordPatternRe.lastIndex, le = we.keywordPatternRe.exec(Be);
        }
        _e += Be.substring(J), Xe.addText(_e);
      }
      function Pn() {
        if (Be === "") return;
        let J = null;
        if (typeof we.subLanguage == "string") {
          if (!z[we.subLanguage]) {
            Xe.addText(Be);
            return;
          }
          J = tn(we.subLanguage, Be, !0, ci[we.subLanguage]), ci[we.subLanguage] = /** @type {CompiledMode} */
          J._top;
        } else
          J = sr(Be, we.subLanguage.length ? we.subLanguage : null);
        we.relevance > 0 && (zn += J.relevance), Xe.__addSublanguage(J._emitter, J.language);
      }
      function st() {
        we.subLanguage != null ? Pn() : Mt(), Be = "";
      }
      function yt(J, le) {
        J !== "" && (Xe.startScope(le), Xe.addText(J), Xe.endScope());
      }
      function ai(J, le) {
        let _e = 1;
        const Ie = le.length - 1;
        for (; _e <= Ie; ) {
          if (!J._emit[_e]) {
            _e++;
            continue;
          }
          const Ke = bt.classNameAliases[J[_e]] || J[_e], vt = le[_e];
          Ke ? yt(vt, Ke) : (Be = vt, Mt(), Be = ""), _e++;
        }
      }
      function si(J, le) {
        return J.scope && typeof J.scope == "string" && Xe.openNode(bt.classNameAliases[J.scope] || J.scope), J.beginScope && (J.beginScope._wrap ? (yt(Be, bt.classNameAliases[J.beginScope._wrap] || J.beginScope._wrap), Be = "") : J.beginScope._multi && (ai(J.beginScope, le), Be = "")), we = Object.create(J, { parent: { value: we } }), we;
      }
      function oi(J, le, _e) {
        let Ie = y(J.endRe, _e);
        if (Ie) {
          if (J["on:end"]) {
            const Ke = new t(J);
            J["on:end"](le, Ke), Ke.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; J.endsParent && J.parent; )
              J = J.parent;
            return J;
          }
        }
        if (J.endsWithParent)
          return oi(J.parent, le, _e);
      }
      function Ga(J) {
        return we.matcher.regexIndex === 0 ? (Be += J[0], 1) : (ur = !0, 0);
      }
      function Qa(J) {
        const le = J[0], _e = J.rule, Ie = new t(_e), Ke = [_e.__beforeBegin, _e["on:begin"]];
        for (const vt of Ke)
          if (vt && (vt(J, Ie), Ie.isMatchIgnored))
            return Ga(le);
        return _e.skip ? Be += le : (_e.excludeBegin && (Be += le), st(), !_e.returnBegin && !_e.excludeBegin && (Be = le)), si(_e, J), _e.returnBegin ? 0 : le.length;
      }
      function Xa(J) {
        const le = J[0], _e = ce.substring(J.index), Ie = oi(we, J, _e);
        if (!Ie)
          return ei;
        const Ke = we;
        we.endScope && we.endScope._wrap ? (st(), yt(le, we.endScope._wrap)) : we.endScope && we.endScope._multi ? (st(), ai(we.endScope, J)) : Ke.skip ? Be += le : (Ke.returnEnd || Ke.excludeEnd || (Be += le), st(), Ke.excludeEnd && (Be = le));
        do
          we.scope && Xe.closeNode(), !we.skip && !we.subLanguage && (zn += we.relevance), we = we.parent;
        while (we !== Ie.parent);
        return Ie.starts && si(Ie.starts, J), Ke.returnEnd ? 0 : le.length;
      }
      function Ka() {
        const J = [];
        for (let le = we; le !== bt; le = le.parent)
          le.scope && J.unshift(le.scope);
        J.forEach((le) => Xe.openNode(le));
      }
      let $n = {};
      function li(J, le) {
        const _e = le && le[0];
        if (Be += J, _e == null)
          return st(), 0;
        if ($n.type === "begin" && le.type === "end" && $n.index === le.index && _e === "") {
          if (Be += ce.slice(le.index, le.index + 1), !je) {
            const Ie = new Error(`0 width match regex (${F})`);
            throw Ie.languageName = F, Ie.badRule = $n.rule, Ie;
          }
          return 1;
        }
        if ($n = le, le.type === "begin")
          return Qa(le);
        if (le.type === "illegal" && !Ee) {
          const Ie = new Error('Illegal lexeme "' + _e + '" for mode "' + (we.scope || "<unnamed>") + '"');
          throw Ie.mode = we, Ie;
        } else if (le.type === "end") {
          const Ie = Xa(le);
          if (Ie !== ei)
            return Ie;
        }
        if (le.type === "illegal" && _e === "")
          return Be += `
`, 1;
        if (cr > 1e5 && cr > le.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Be += _e, _e.length;
      }
      const bt = Et(F);
      if (!bt)
        throw Ae(De.replace("{}", F)), new Error('Unknown language: "' + F + '"');
      const Va = Ca(bt);
      let lr = "", we = Ne || Va;
      const ci = {}, Xe = new ae.__emitter(ae);
      Ka();
      let Be = "", zn = 0, Ot = 0, cr = 0, ur = !1;
      try {
        if (bt.__emitTokens)
          bt.__emitTokens(ce, Xe);
        else {
          for (we.matcher.considerAll(); ; ) {
            cr++, ur ? ur = !1 : we.matcher.considerAll(), we.matcher.lastIndex = Ot;
            const J = we.matcher.exec(ce);
            if (!J) break;
            const le = ce.substring(Ot, J.index), _e = li(le, J);
            Ot = J.index + _e;
          }
          li(ce.substring(Ot));
        }
        return Xe.finalize(), lr = Xe.toHTML(), {
          language: F,
          value: lr,
          relevance: zn,
          illegal: !1,
          _emitter: Xe,
          _top: we
        };
      } catch (J) {
        if (J.message && J.message.includes("Illegal"))
          return {
            language: F,
            value: ir(ce),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: J.message,
              index: Ot,
              context: ce.slice(Ot - 100, Ot + 100),
              mode: J.mode,
              resultSoFar: lr
            },
            _emitter: Xe
          };
        if (je)
          return {
            language: F,
            value: ir(ce),
            illegal: !1,
            relevance: 0,
            errorRaised: J,
            _emitter: Xe,
            _top: we
          };
        throw J;
      }
    }
    function ar(F) {
      const ce = {
        value: ir(F),
        illegal: !1,
        relevance: 0,
        _top: se,
        _emitter: new ae.__emitter(ae)
      };
      return ce._emitter.addText(F), ce;
    }
    function sr(F, ce) {
      ce = ce || ae.languages || Object.keys(z);
      const Ee = ar(F), Ne = ce.filter(Et).filter(ii).map(
        (st) => tn(st, F, !1)
      );
      Ne.unshift(Ee);
      const Fe = Ne.sort((st, yt) => {
        if (st.relevance !== yt.relevance) return yt.relevance - st.relevance;
        if (st.language && yt.language) {
          if (Et(st.language).supersetOf === yt.language)
            return 1;
          if (Et(yt.language).supersetOf === st.language)
            return -1;
        }
        return 0;
      }), [pt, Mt] = Fe, Pn = pt;
      return Pn.secondBest = Mt, Pn;
    }
    function Oa(F, ce, Ee) {
      const Ne = ce && X[ce] || Ee;
      F.classList.add("hljs"), F.classList.add(`language-${Ne}`);
    }
    function or(F) {
      let ce = null;
      const Ee = Ge(F);
      if (me(Ee)) return;
      if (Cn(
        "before:highlightElement",
        { el: F, language: Ee }
      ), F.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", F);
        return;
      }
      if (F.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(F)), ae.throwUnescapedHTML))
        throw new za(
          "One of your code blocks includes unescaped HTML.",
          F.innerHTML
        );
      ce = F;
      const Ne = ce.textContent, Fe = Ee ? Ue(Ne, { language: Ee, ignoreIllegals: !0 }) : sr(Ne);
      F.innerHTML = Fe.value, F.dataset.highlighted = "yes", Oa(F, Ee, Fe.language), F.result = {
        language: Fe.language,
        // TODO: remove with version 11.0
        re: Fe.relevance,
        relevance: Fe.relevance
      }, Fe.secondBest && (F.secondBest = {
        language: Fe.secondBest.language,
        relevance: Fe.secondBest.relevance
      }), Cn("after:highlightElement", { el: F, result: Fe, text: Ne });
    }
    function Na(F) {
      ae = Jr(ae, F);
    }
    const Ba = () => {
      Rn(), qe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function qa() {
      Rn(), qe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let ni = !1;
    function Rn() {
      function F() {
        Rn();
      }
      if (document.readyState === "loading") {
        ni || window.addEventListener("DOMContentLoaded", F, !1), ni = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(or);
    }
    function ja(F, ce) {
      let Ee = null;
      try {
        Ee = ce(x);
      } catch (Ne) {
        if (Ae("Language definition for '{}' could not be registered.".replace("{}", F)), je)
          Ae(Ne);
        else
          throw Ne;
        Ee = se;
      }
      Ee.name || (Ee.name = F), z[F] = Ee, Ee.rawDefinition = ce.bind(null, x), Ee.aliases && ri(Ee.aliases, { languageName: F });
    }
    function Da(F) {
      delete z[F];
      for (const ce of Object.keys(X))
        X[ce] === F && delete X[ce];
    }
    function Ha() {
      return Object.keys(z);
    }
    function Et(F) {
      return F = (F || "").toLowerCase(), z[F] || z[X[F]];
    }
    function ri(F, { languageName: ce }) {
      typeof F == "string" && (F = [F]), F.forEach((Ee) => {
        X[Ee.toLowerCase()] = ce;
      });
    }
    function ii(F) {
      const ce = Et(F);
      return ce && !ce.disableAutodetect;
    }
    function Ua(F) {
      F["before:highlightBlock"] && !F["before:highlightElement"] && (F["before:highlightElement"] = (ce) => {
        F["before:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      }), F["after:highlightBlock"] && !F["after:highlightElement"] && (F["after:highlightElement"] = (ce) => {
        F["after:highlightBlock"](
          Object.assign({ block: ce.el }, ce)
        );
      });
    }
    function Fa(F) {
      Ua(F), be.push(F);
    }
    function Wa(F) {
      const ce = be.indexOf(F);
      ce !== -1 && be.splice(ce, 1);
    }
    function Cn(F, ce) {
      const Ee = F;
      be.forEach(function(Ne) {
        Ne[Ee] && Ne[Ee](ce);
      });
    }
    function Za(F) {
      return qe("10.7.0", "highlightBlock will be removed entirely in v12.0"), qe("10.7.0", "Please use highlightElement now."), or(F);
    }
    Object.assign(x, {
      highlight: Ue,
      highlightAuto: sr,
      highlightAll: Rn,
      highlightElement: or,
      // TODO: Remove with v12 API
      highlightBlock: Za,
      configure: Na,
      initHighlighting: Ba,
      initHighlightingOnLoad: qa,
      registerLanguage: ja,
      unregisterLanguage: Da,
      listLanguages: Ha,
      getLanguage: Et,
      registerAliases: ri,
      autoDetection: ii,
      inherit: Jr,
      addPlugin: Fa,
      removePlugin: Wa
    }), x.debugMode = function() {
      je = !1;
    }, x.safeMode = function() {
      je = !0;
    }, x.versionString = $a, x.regex = {
      concat: f,
      lookahead: u,
      either: m,
      optional: p,
      anyNumberOfTimes: g
    };
    for (const F in L)
      typeof L[F] == "object" && e(L[F]);
    return Object.assign(x, L), x;
  }, Gt = ti({});
  return Gt.newInstance = () => ti({}), hr = Gt, Gt.HighlightJS = Gt, Gt.default = Gt, hr;
}
var ts = /* @__PURE__ */ es();
const Ce = /* @__PURE__ */ Di(ts), ns = "11.11.1", xe = /* @__PURE__ */ new Map(), rs = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ct = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
ct.html = "xml";
ct.xhtml = "xml";
ct.markup = "xml";
const Hi = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Ct = null;
const dr = /* @__PURE__ */ new Map(), is = 300 * 1e3;
async function Ui(e = rs) {
  if (e)
    return Ct || (Ct = (async () => {
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
          const d = c.replace(/^\||\|$/g, "").split("|").map((b) => b.trim());
          if (d.every((b) => /^-+$/.test(b))) continue;
          const u = d;
          if (!u.length) continue;
          const p = (u[l] || u[0] || "").toString().trim().toLowerCase();
          if (!p || /^-+$/.test(p)) continue;
          xe.set(p, p);
          const f = u[s] || "";
          if (f) {
            const b = String(f).split(",").map((m) => m.replace(/`/g, "").trim()).filter(Boolean);
            if (b.length) {
              const w = b[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (xe.set(w, w), o.push(w));
            }
          }
        }
        try {
          const h = [];
          for (const c of o) {
            const d = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            d && /[a-z0-9]/i.test(d) ? h.push(d) : xe.delete(c);
          }
          o = h;
        } catch (h) {
          _("[codeblocksManager] cleanup aliases failed", h);
        }
        try {
          let h = 0;
          for (const c of Array.from(xe.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              xe.delete(c), h++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const d = c.replace(/^[:]+/, "");
              if (d && /[a-z0-9]/i.test(d)) {
                const u = xe.get(c);
                xe.delete(c), xe.set(d, u);
              } else
                xe.delete(c), h++;
            }
          }
          for (const [c, d] of Array.from(xe.entries()))
            (!d || /^-+$/.test(d) || !/[a-z0-9]/i.test(d)) && (xe.delete(c), h++);
          try {
            const c = ":---------------------";
            xe.has(c) && (xe.delete(c), h++);
          } catch (c) {
            _("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(xe.keys()).sort();
          } catch (c) {
            _("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (h) {
          _("[codeblocksManager] ignored error", h);
        }
      } catch (t) {
        _("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), Ct);
}
const nn = /* @__PURE__ */ new Set();
async function kn(e, t) {
  if (Ct || (async () => {
    try {
      await Ui();
    } catch (r) {
      _("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Ct)
    try {
      await Ct;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (Hi.has(n)) return !1;
  if (xe.size && !xe.has(n)) {
    const r = ct;
    if (!r[n] && !r[e])
      return !1;
  }
  if (nn.has(e)) return !0;
  const i = ct;
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
    xe.size && (l = l.filter((c) => {
      if (xe.has(c)) return !0;
      const d = ct[c];
      return !!(d && xe.has(d));
    }));
    let o = null, h = null;
    for (const c of l)
      try {
        const d = Date.now();
        let u = dr.get(c);
        if (u && u.ok === !1 && d - (u.ts || 0) >= is && (dr.delete(c), u = void 0), u) {
          if (u.module)
            o = u.module;
          else if (u.promise)
            try {
              o = await u.promise;
            } catch {
              o = null;
            }
        } else {
          const g = { promise: null, module: null, ok: null, ts: 0 };
          dr.set(c, g), g.promise = (async () => {
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
                  const f = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;
                  return await new Function("u", "return import(u)")(f);
                } catch {
                  try {
                    const b = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;
                    return await new Function("u", "return import(u)")(b);
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
            const p = xe.size && xe.get(e) || c || e;
            return Ce.registerLanguage(p, g), nn.add(p), p !== e && (Ce.registerLanguage(e, g), nn.add(e)), !0;
          } catch (p) {
            h = p;
          }
        } else
          try {
            if (xe.has(c) || xe.has(e)) {
              const g = () => ({});
              try {
                Ce.registerLanguage(c, g), nn.add(c);
              } catch {
              }
              try {
                c !== e && (Ce.registerLanguage(e, g), nn.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (d) {
        h = d;
      }
    if (h)
      throw h;
    return !1;
  } catch {
    return !1;
  }
}
let In = null;
function as(e = document) {
  Ct || (async () => {
    try {
      await Ui();
    } catch (a) {
      _("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = ct, i = In || (typeof IntersectionObserver > "u" ? null : (In = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (h) {
        _("[codeblocksManager] observer unobserve failed", h);
      }
      (async () => {
        try {
          const h = o.getAttribute && o.getAttribute("class") || o.className || "", c = h.match(/language-([a-zA-Z0-9_+-]+)/) || h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const d = (c[1] || "").toLowerCase(), u = t[d] || d, g = xe.size && (xe.get(u) || xe.get(String(u).toLowerCase())) || u;
            try {
              await kn(g);
            } catch (p) {
              _("[codeblocksManager] registerLanguage failed", p);
            }
            try {
              try {
                const p = o.textContent || o.innerText || "";
                p != null && (o.textContent = p);
              } catch {
              }
              try {
                o && o.dataset && o.dataset.highlighted && delete o.dataset.highlighted;
              } catch {
              }
              Ce.highlightElement(o);
            } catch (p) {
              _("[codeblocksManager] hljs.highlightElement failed", p);
            }
          } else
            try {
              const d = o.textContent || "";
              try {
                if (Ce && typeof Ce.getLanguage == "function" && Ce.getLanguage("plaintext")) {
                  const u = Ce.highlight(d, { language: "plaintext" });
                  u && u.value && (o.innerHTML = u.value);
                }
              } catch {
                try {
                  Ce.highlightElement(o);
                } catch (g) {
                  _("[codeblocksManager] fallback highlightElement failed", g);
                }
              }
            } catch (d) {
              _("[codeblocksManager] auto-detect plaintext failed", d);
            }
        } catch (h) {
          _("[codeblocksManager] observer entry processing failed", h);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), In)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), h = t[o] || o, c = xe.size && (xe.get(h) || xe.get(String(h).toLowerCase())) || h;
          try {
            await kn(c);
          } catch (d) {
            _("[codeblocksManager] registerLanguage failed (no observer)", d);
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
          Ce.highlightElement(a);
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
function Rl(e, { useCdn: t = !0 } = {}) {
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
let Nt = "light";
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
function pi() {
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
    $t("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
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
    if (pi(), document.querySelector("style[data-bulma-override]")) return;
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
    pi();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ss(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    _("[bulmaManager] ensureBulma failed", r);
  }
}
function ls(e) {
  Nt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Nt === "dark" ? n.setAttribute("data-theme", "dark") : Nt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Nt === "dark" ? n.setAttribute("data-theme", "dark") : Nt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function Cl(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      _("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Fi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Nt === "dark" ? t.setAttribute("data-theme", "dark") : Nt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Wi = {
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
}, Kt = JSON.parse(JSON.stringify(Wi));
let Zn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Zn = String(e).split("-")[0].toLowerCase();
}
Wi[Zn] || (Zn = "en");
let zt = Zn;
function on(e, t = {}) {
  const n = Kt[zt] || Kt.en;
  let i = n && n[e] ? n[e] : Kt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Zi(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Kt[a] = Object.assign({}, Kt[a] || {}, r[a]);
  } catch {
  }
}
function Gi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  zt = Kt[t] ? t : "en";
}
const cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return zt;
  },
  loadL10nFile: Zi,
  setLang: Gi,
  t: on
}, Symbol.toStringTag, { value: "Module" }));
function us(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function gi(e, t = null, n = void 0) {
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
        const s = nt(location.href);
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
function nt(e) {
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
          } catch (h) {
            i("[" + t + "] worker termination failed", h);
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
  function s(o, h = 1e4) {
    return new Promise((c, d) => {
      const u = r();
      if (!u) return d(new Error("worker unavailable"));
      const g = String(Math.random()), p = Object.assign({}, o, { id: g });
      let f = null;
      const b = () => {
        f && clearTimeout(f), u.removeEventListener("message", m), u.removeEventListener("error", w);
      }, m = (y) => {
        const k = y.data || {};
        k.id === g && (b(), k.error ? d(new Error(k.error)) : c(k.result));
      }, w = (y) => {
        b(), i("[" + t + "] worker error event", y);
        try {
          n === u && (n = null, u.terminate && u.terminate());
        } catch (k) {
          i("[" + t + "] worker termination failed", k);
        }
        d(new Error(y && y.message || "worker error"));
      };
      f = setTimeout(() => {
        b(), i("[" + t + "] worker timed out");
        try {
          n === u && (n = null, u.terminate && u.terminate());
        } catch (y) {
          i("[" + t + "] worker termination on timeout failed", y);
        }
        d(new Error("worker timeout"));
      }, h), u.addEventListener("message", m), u.addEventListener("error", w);
      try {
        u.postMessage(p);
      } catch (y) {
        b(), d(y);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function Qi(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...p) {
    try {
      _(...p);
    } catch {
    }
  }
  function s(p) {
    if (!i[p])
      try {
        const f = e();
        i[p] = f || null, f && f.addEventListener("error", () => {
          try {
            i[p] === f && (i[p] = null, f.terminate && f.terminate());
          } catch (b) {
            a("[" + t + "] worker termination failed", b);
          }
        });
      } catch (f) {
        i[p] = null, a("[" + t + "] worker init failed", f);
      }
    return i[p];
  }
  const l = new Array(n).fill(0), o = new Array(n).fill(null), h = 30 * 1e3;
  function c(p) {
    try {
      l[p] = Date.now(), o[p] && (clearTimeout(o[p]), o[p] = null), o[p] = setTimeout(() => {
        try {
          i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
        } catch (f) {
          a("[" + t + "] idle termination failed", f);
        }
        o[p] = null;
      }, h);
    } catch {
    }
  }
  function d() {
    for (let p = 0; p < i.length; p++) {
      const f = s(p);
      if (f) return f;
    }
    return null;
  }
  function u() {
    for (let p = 0; p < i.length; p++)
      try {
        i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
      } catch (f) {
        a("[" + t + "] worker termination failed", f);
      }
  }
  function g(p, f = 1e4) {
    return new Promise((b, m) => {
      const w = r++ % i.length, y = (k) => {
        const S = (w + k) % i.length, v = s(S);
        if (!v)
          return k + 1 < i.length ? y(k + 1) : m(new Error("worker pool unavailable"));
        const C = String(Math.random()), Z = Object.assign({}, p, { id: C });
        let I = null;
        const ee = () => {
          I && clearTimeout(I), v.removeEventListener("message", $), v.removeEventListener("error", D);
        }, $ = (ne) => {
          const j = ne.data || {};
          j.id === C && (ee(), j.error ? m(new Error(j.error)) : b(j.result));
        }, D = (ne) => {
          ee(), a("[" + t + "] worker error event", ne);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (j) {
            a("[" + t + "] worker termination failed", j);
          }
          m(new Error(ne && ne.message || "worker error"));
        };
        I = setTimeout(() => {
          ee(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (ne) {
            a("[" + t + "] worker termination on timeout failed", ne);
          }
          m(new Error("worker timeout"));
        }, f), v.addEventListener("message", $), v.addEventListener("error", D);
        try {
          c(S), v.postMessage(Z);
        } catch (ne) {
          ee(), m(ne);
        }
      };
      y(0);
    });
  }
  return { get: d, send: g, terminate: u };
}
function cn(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        cn._blobUrlCache || (cn._blobUrlCache = /* @__PURE__ */ new Map());
        const t = cn._blobUrlCache;
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
const tt = /* @__PURE__ */ new Set();
function Dt(e) {
  if (fs(), tt.clear(), Array.isArray(Oe) && Oe.length)
    for (const t of Oe)
      t && tt.add(t);
  else
    for (const t of Pe)
      t && tt.add(t);
  mi(V), mi(H), Dt._refreshed = !0;
}
function mi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && tt.add(t);
}
function yi(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && tt.add(i), t.call(this, n, i);
  };
}
let bi = !1;
function fs() {
  bi || (yi(V), yi(H), bi = !0);
}
const fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: tt,
  refreshIndexPaths: Dt
}, Symbol.toStringTag, { value: "Module" }));
function Jt(e, t = 1e3) {
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
function kr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const K = Jt(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), Vt = Jt(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Ut = Jt(function(e) {
  return Vt(String(e || "")) + "/";
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
function On(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let d = 0;
    r && (d = r.clientHeight || (a ? a.height : 0)), d || (d = l - s);
    let u = 0.6;
    try {
      const b = r && window.getComputedStyle ? window.getComputedStyle(r) : null, m = b && b.getPropertyValue("--nimbi-image-max-height-ratio"), w = m ? parseFloat(m) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (u = w);
    } catch (b) {
      _("[helpers] read CSS ratio failed", b);
    }
    const g = Math.max(200, Math.floor(d * u));
    let p = !1, f = null;
    if (i.forEach((b) => {
      try {
        const m = b.getAttribute ? b.getAttribute("loading") : void 0;
        m !== "eager" && b.setAttribute && b.setAttribute("loading", "lazy");
        const w = b.getBoundingClientRect ? b.getBoundingClientRect() : null, y = b.src || b.getAttribute && b.getAttribute("src"), k = w && w.height > 1 ? w.height : g, S = w ? w.top : 0, v = S + k;
        w && k > 0 && S <= c && v >= o && (b.setAttribute ? (b.setAttribute("loading", "eager"), b.setAttribute("fetchpriority", "high"), b.setAttribute("data-eager-by-nimbi", "1")) : (b.loading = "eager", b.fetchPriority = "high"), ps(y), p = !0), !f && w && w.top <= c && (f = { img: b, src: y, rect: w, beforeLoading: m });
      } catch (m) {
        _("[helpers] setEagerForAboveFoldImages per-image failed", m);
      }
    }), !p && f) {
      const { img: b, src: m, rect: w, beforeLoading: y } = f;
      try {
        b.setAttribute ? (b.setAttribute("loading", "eager"), b.setAttribute("fetchpriority", "high"), b.setAttribute("data-eager-by-nimbi", "1")) : (b.loading = "eager", b.fetchPriority = "high");
      } catch (k) {
        _("[helpers] setEagerForAboveFoldImages fallback failed", k);
      }
    }
  } catch (i) {
    _("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function ze(e, t = null, n) {
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
Jt(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return _("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Gn(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Gn);
} catch (e) {
  _("[helpers] global attach failed", e);
}
const gs = Jt(function(e) {
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
}, 2e3), V = /* @__PURE__ */ new Map();
let it = [], Or = !1;
function ms(e) {
  Or = !!e;
}
function Xi(e) {
  it = Array.isArray(e) ? e.slice() : [];
}
function ys() {
  return it;
}
const xn = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Ki = Qi(() => cn(hs), "slugManager", xn);
function bs() {
  try {
    if (zr()) return !0;
  } catch {
  }
  try {
    return !!(typeof oe == "string" && oe);
  } catch {
    return !1;
  }
}
function de(...e) {
  try {
    $t(...e);
  } catch {
  }
}
function ws() {
  return Ki.get();
}
function Vi(e) {
  return Ki.send(e, 5e3);
}
async function xr(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => lt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Vi({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function _s(e, t, n) {
  const i = await Promise.resolve().then(() => lt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Vi({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function Je(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = K(typeof t == "string" ? t : String(t || ""));
  } catch {
    n = String(t || "");
  }
  if (n) {
    try {
      if (it && it.length) {
        const r = String(n).split("/")[0], a = it.includes(r);
        let s = V.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? K(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = K(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, V.set(e, s);
      } else {
        const i = V.has(e) ? V.get(e) : void 0;
        if (i) {
          let r = null;
          try {
            typeof i == "string" ? r = K(i) : i && typeof i == "object" && (r = i.default ? K(i.default) : null);
          } catch {
            r = null;
          }
          if (!r || r === n)
            V.set(e, n);
          else
            try {
              const a = /* @__PURE__ */ new Set();
              for (const l of V.keys()) a.add(l);
              const s = typeof Ht == "function" ? Ht(e, a) : `${e}-2`;
              V.set(s, n), e = s;
            } catch {
            }
        } else
          V.set(e, n);
      }
    } catch {
    }
    try {
      if (n) {
        try {
          H.set(n, e);
        } catch {
        }
        try {
          if (Pe && typeof Pe.has == "function") {
            if (!Pe.has(n)) {
              try {
                Pe.add(n);
              } catch {
              }
              try {
                Array.isArray(Oe) && !Oe.includes(n) && Oe.push(n);
              } catch {
              }
            }
          } else
            try {
              Array.isArray(Oe) && !Oe.includes(n) && Oe.push(n);
            } catch {
            }
        } catch {
        }
      }
    } catch {
    }
  }
}
const Jn = /* @__PURE__ */ new Set();
function ks(e) {
  typeof e == "function" && Jn.add(e);
}
function xs(e) {
  typeof e == "function" && Jn.delete(e);
}
const H = /* @__PURE__ */ new Map();
let Sr = {}, Oe = [];
const Pe = /* @__PURE__ */ new Set();
let oe = "_404.md", gt = null;
const Nr = "_home";
function Yi(e) {
  if (e == null) {
    oe = null;
    return;
  }
  oe = String(e || "");
}
function Ji(e) {
  if (e == null) {
    gt = null;
    return;
  }
  gt = String(e || "");
}
function Ss(e) {
  Sr = e || {};
}
function ea(e) {
  try {
    if (Array.isArray(te) || (te = []), !Array.isArray(e)) return;
    try {
      Array.isArray(te) || (te = []), te.length = 0;
      for (const t of e) te.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = te;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      de("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        te = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const un = /* @__PURE__ */ new Map(), Qn = /* @__PURE__ */ new Set();
function vs() {
  un.clear(), Qn.clear();
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
const ue = Jt(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function Br(e) {
  V.clear(), H.clear(), Oe = [];
  try {
    Pe.clear();
  } catch {
  }
  it = it || [];
  const t = Object.keys(Sr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), de("[slugManager] parse contentBase failed", i);
      }
      n = Ut(n);
    }
  } catch (i) {
    n = "", de("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = As(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = K(i.slice(n.length)) : r = K(i), Oe.push(r);
    try {
      Pe.add(r);
    } catch {
    }
    try {
      Dt();
    } catch (s) {
      de("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Sr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ue(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!it || !it.length) && (o = Ht(o, new Set(V.keys()))), it && it.length) {
              const c = r.split("/")[0], d = it.includes(c);
              let u = V.get(o);
              (!u || typeof u == "string") && (u = { default: typeof u == "string" ? u : void 0, langs: {} }), d ? u.langs[c] = r : u.default = r, V.set(o, u);
            } else
              V.set(o, r);
            H.set(r, o);
          } catch (o) {
            de("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Br();
} catch (e) {
  de("[slugManager] initial setContentBase failed", e);
}
function Ht(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Es(e) {
  return Mn(e, void 0);
}
function Mn(e, t) {
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
function Yt(e) {
  if (!e || !V.has(e)) return null;
  const t = V.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (it && it.length && zt && t.langs && t.langs[zt])
    return t.langs[zt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const hn = /* @__PURE__ */ new Map();
function Ms() {
  hn.clear();
}
let Me = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const l = nt(e);
        l && l.page && (e = l.page);
      } catch {
      }
  } catch {
  }
  try {
    const l = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (l && V.has(l)) {
      const o = Yt(l) || V.get(l);
      o && o !== e && (e = o);
    }
  } catch (l) {
    de("[slugManager] slug mapping normalization failed", l);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const l = String(e).split("::", 1)[0];
      if (l)
        try {
          if (V.has(l)) {
            const o = Yt(l) || V.get(l);
            o ? e = o : e = l;
          } else
            e = l;
        } catch {
          e = l;
        }
    }
  } catch (l) {
    de("[slugManager] path sanitize failed", l);
  }
  if (!(n && n.force === !0 || typeof oe == "string" && oe || V && V.size || Pe && Pe.size || zr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : Vt(String(t));
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
  if (hn.has(a))
    return hn.get(a);
  const s = (async () => {
    const l = await fetch(a);
    if (!l || typeof l.ok != "boolean" || !l.ok) {
      if (l && l.status === 404 && typeof oe == "string" && oe)
        try {
          const g = `${r}/${oe}`, p = await globalThis.fetch(g);
          if (p && typeof p.ok == "boolean" && p.ok)
            return { raw: await p.text(), status: 404 };
        } catch (g) {
          de("[slugManager] fetching fallback 404 failed", g);
        }
      let u = "";
      try {
        l && typeof l.clone == "function" ? u = await l.clone().text() : l && typeof l.text == "function" ? u = await l.text() : u = "";
      } catch (g) {
        u = "", de("[slugManager] reading error body failed", g);
      }
      try {
        const g = l ? l.status : void 0;
        if (g === 404)
          try {
            _("fetchMarkdown failed (404):", { url: a, status: g, statusText: l ? l.statusText : void 0, body: u.slice(0, 200) });
          } catch {
          }
        else
          try {
            Wn("fetchMarkdown failed:", { url: a, status: g, statusText: l ? l.statusText : void 0, body: u.slice(0, 200) });
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const o = await l.text(), h = o.trim().slice(0, 128).toLowerCase(), c = /^(?:<!doctype|<html|<title|<h1)/.test(h), d = c || String(e || "").toLowerCase().endsWith(".html");
    if (c && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof oe == "string" && oe) {
          const u = `${r}/${oe}`, g = await globalThis.fetch(u);
          if (g.ok)
            return { raw: await g.text(), status: 404 };
        }
      } catch (u) {
        de("[slugManager] fetching fallback 404 failed", u);
      }
      throw bs() && Wn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return d ? { raw: o, isHtml: !0 } : { raw: o };
  })();
  return hn.set(a, s), s;
};
function Ls(e) {
  typeof e == "function" && (Me = e);
}
const Hn = /* @__PURE__ */ new Map();
function Ts(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let te = [];
function Rs() {
  return te;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return te;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = te;
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
          return vr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = vr;
      } catch {
      }
    }
} catch {
}
let Rt = null;
async function qt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => K(String(a || ""))))) : [];
  try {
    const a = K(String(oe || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (te && te.length && t === 1 && !te.some((s) => {
    try {
      return r.includes(K(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return te;
  if (Rt) return Rt;
  Rt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((f) => K(String(f || ""))))) : [];
    try {
      const f = K(String(oe || ""));
      f && !a.includes(f) && a.push(f);
    } catch {
    }
    const s = (f) => {
      if (!a || !a.length) return !1;
      for (const b of a)
        if (b && (f === b || f.startsWith(b + "/")))
          return !0;
      return !1;
    };
    let l = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const f of i)
          try {
            const b = K(String(f || ""));
            b && l.push(b);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Oe) && Oe.length && (l = Array.from(Oe)), !l.length) {
      if (H && typeof H.size == "number" && H.size)
        try {
          l = Array.from(H.keys());
        } catch {
          l = [];
        }
      else
        for (const f of V.values())
          if (f) {
            if (typeof f == "string")
              l.push(f);
            else if (f && typeof f == "object") {
              f.default && l.push(f.default);
              const b = f.langs || {};
              for (const m of Object.keys(b || {}))
                try {
                  b[m] && l.push(b[m]);
                } catch {
                }
            }
          }
    }
    try {
      const f = await aa(e);
      f && f.length && (l = l.concat(f));
    } catch (f) {
      de("[slugManager] crawlAllMarkdown during buildSearchIndex failed", f);
    }
    try {
      const f = new Set(l), b = [...l], m = Math.max(1, xn), w = async () => {
        for (; !(f.size > Ln); ) {
          const k = b.shift();
          if (!k) break;
          try {
            const S = await Me(k, e);
            if (S && S.raw) {
              if (S.status === 404) continue;
              let v = S.raw;
              const C = [], Z = String(k || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(Z) && Or && (!k || !k.includes("/")))
                continue;
              const I = Ts(v), ee = /\[[^\]]+\]\(([^)]+)\)/g;
              let $;
              for (; $ = ee.exec(I); )
                C.push($[1]);
              const D = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; $ = D.exec(I); )
                C.push($[1]);
              const ne = k && k.includes("/") ? k.substring(0, k.lastIndexOf("/") + 1) : "";
              for (let j of C)
                try {
                  if (Mn(j, e) || j.startsWith("..") || j.indexOf("/../") !== -1 || (ne && !j.startsWith("./") && !j.startsWith("/") && !j.startsWith("../") && (j = ne + j), j = K(j), !/\.(md|html?)(?:$|[?#])/i.test(j)) || (j = j.split(/[?#]/)[0], s(j))) continue;
                  f.has(j) || (f.add(j), b.push(j), l.push(j));
                } catch (re) {
                  de("[slugManager] href processing failed", j, re);
                }
            }
          } catch (S) {
            de("[slugManager] discovery fetch failed for", k, S);
          }
        }
      }, y = [];
      for (let k = 0; k < m; k++) y.push(w());
      await Promise.all(y);
    } catch (f) {
      de("[slugManager] discovery loop failed", f);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((f) => !f || o.has(f) || s(f) ? !1 : (o.add(f), !0));
    const h = [], c = /* @__PURE__ */ new Map(), d = l.filter((f) => /\.(?:md|html?)(?:$|[?#])/i.test(f)), u = Math.max(1, Math.min(xn, d.length || 1)), g = d.slice(), p = [];
    for (let f = 0; f < u; f++)
      p.push((async () => {
        for (; g.length; ) {
          const b = g.shift();
          if (!b) break;
          try {
            const m = await Me(b, e);
            c.set(b, m);
          } catch (m) {
            de("[slugManager] buildSearchIndex: entry fetch failed", b, m), c.set(b, null);
          }
        }
      })());
    await Promise.all(p);
    for (const f of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(f))
        try {
          const b = c.get(f);
          if (!b || !b.raw || b.status === 404) continue;
          let m = "", w = "", y = null;
          if (b.isHtml)
            try {
              const v = new DOMParser().parseFromString(b.raw, "text/html"), C = v.querySelector("title") || v.querySelector("h1");
              C && C.textContent && (m = C.textContent.trim());
              const Z = v.querySelector("p");
              if (Z && Z.textContent && (w = Z.textContent.trim()), t >= 2)
                try {
                  const I = v.querySelector("h1"), ee = I && I.textContent ? I.textContent.trim() : m || "";
                  try {
                    const D = H && typeof H.has == "function" && H.has(f) ? H.get(f) : null;
                    if (D)
                      y = D;
                    else {
                      let ne = ue(m || f);
                      const j = /* @__PURE__ */ new Set();
                      try {
                        for (const A of V.keys()) j.add(A);
                      } catch {
                      }
                      try {
                        for (const A of h)
                          A && A.slug && j.add(String(A.slug).split("::")[0]);
                      } catch {
                      }
                      let re = !1;
                      try {
                        if (V.has(ne)) {
                          const A = V.get(ne);
                          if (typeof A == "string")
                            A === f && (re = !0);
                          else if (A && typeof A == "object") {
                            A.default === f && (re = !0);
                            for (const G of Object.keys(A.langs || {}))
                              if (A.langs[G] === f) {
                                re = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !re && j.has(ne) && (ne = Ht(ne, j)), y = ne;
                      try {
                        H.has(f) || Je(y, f);
                      } catch {
                      }
                    }
                  } catch (D) {
                    de("[slugManager] derive pageSlug failed", D);
                  }
                  const $ = Array.from(v.querySelectorAll("h2"));
                  for (const D of $)
                    try {
                      const ne = (D.textContent || "").trim();
                      if (!ne) continue;
                      const j = D.id ? D.id : ue(ne), re = y ? `${y}::${j}` : `${ue(f)}::${j}`;
                      let A = "", G = D.nextElementSibling;
                      for (; G && G.tagName && G.tagName.toLowerCase() === "script"; ) G = G.nextElementSibling;
                      G && G.textContent && (A = String(G.textContent).trim()), h.push({ slug: re, title: ne, excerpt: A, path: f, parentTitle: ee });
                    } catch (ne) {
                      de("[slugManager] indexing H2 failed", ne);
                    }
                  if (t === 3)
                    try {
                      const D = Array.from(v.querySelectorAll("h3"));
                      for (const ne of D)
                        try {
                          const j = (ne.textContent || "").trim();
                          if (!j) continue;
                          const re = ne.id ? ne.id : ue(j), A = y ? `${y}::${re}` : `${ue(f)}::${re}`;
                          let G = "", ie = ne.nextElementSibling;
                          for (; ie && ie.tagName && ie.tagName.toLowerCase() === "script"; ) ie = ie.nextElementSibling;
                          ie && ie.textContent && (G = String(ie.textContent).trim()), h.push({ slug: A, title: j, excerpt: G, path: f, parentTitle: ee });
                        } catch (j) {
                          de("[slugManager] indexing H3 failed", j);
                        }
                    } catch (D) {
                      de("[slugManager] collect H3s failed", D);
                    }
                } catch (I) {
                  de("[slugManager] collect H2s failed", I);
                }
            } catch (S) {
              de("[slugManager] parsing HTML for index failed", S);
            }
          else {
            const S = b.raw, v = S.match(/^#\s+(.+)$/m);
            m = v ? v[1].trim() : "";
            try {
              m = Dn(m);
            } catch {
            }
            const C = S.split(/\r?\n\s*\r?\n/);
            if (C.length > 1)
              for (let Z = 1; Z < C.length; Z++) {
                const I = C[Z].trim();
                if (I && !/^#/.test(I)) {
                  w = I.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let Z = "";
              try {
                const I = (S.match(/^#\s+(.+)$/m) || [])[1];
                Z = I ? I.trim() : "";
                try {
                  const D = H && typeof H.has == "function" && H.has(f) ? H.get(f) : null;
                  if (D)
                    y = D;
                  else {
                    let ne = ue(m || f);
                    const j = /* @__PURE__ */ new Set();
                    try {
                      for (const A of V.keys()) j.add(A);
                    } catch {
                    }
                    try {
                      for (const A of h)
                        A && A.slug && j.add(String(A.slug).split("::")[0]);
                    } catch {
                    }
                    let re = !1;
                    try {
                      if (V.has(ne)) {
                        const A = V.get(ne);
                        if (typeof A == "string")
                          A === f && (re = !0);
                        else if (A && typeof A == "object") {
                          A.default === f && (re = !0);
                          for (const G of Object.keys(A.langs || {}))
                            if (A.langs[G] === f) {
                              re = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !re && j.has(ne) && (ne = Ht(ne, j)), y = ne;
                    try {
                      H.has(f) || Je(y, f);
                    } catch {
                    }
                  }
                } catch (D) {
                  de("[slugManager] derive pageSlug failed", D);
                }
                const ee = /^##\s+(.+)$/gm;
                let $;
                for (; $ = ee.exec(S); )
                  try {
                    const D = ($[1] || "").trim(), ne = Dn(D);
                    if (!D) continue;
                    const j = ue(D), re = y ? `${y}::${j}` : `${ue(f)}::${j}`, G = S.slice(ee.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), ie = G && G[1] ? String(G[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    h.push({ slug: re, title: ne, excerpt: ie, path: f, parentTitle: Z });
                  } catch (D) {
                    de("[slugManager] indexing markdown H2 failed", D);
                  }
              } catch (I) {
                de("[slugManager] collect markdown H2s failed", I);
              }
              if (t === 3)
                try {
                  const I = /^###\s+(.+)$/gm;
                  let ee;
                  for (; ee = I.exec(S); )
                    try {
                      const $ = (ee[1] || "").trim(), D = Dn($);
                      if (!$) continue;
                      const ne = ue($), j = y ? `${y}::${ne}` : `${ue(f)}::${ne}`, A = S.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), G = A && A[1] ? String(A[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      h.push({ slug: j, title: D, excerpt: G, path: f, parentTitle: Z });
                    } catch ($) {
                      de("[slugManager] indexing markdown H3 failed", $);
                    }
                } catch (I) {
                  de("[slugManager] collect markdown H3s failed", I);
                }
            }
          }
          let k = "";
          try {
            H.has(f) && (k = H.get(f));
          } catch (S) {
            de("[slugManager] mdToSlug access failed", S);
          }
          if (!k) {
            try {
              if (!y) {
                const S = H && typeof H.has == "function" && H.has(f) ? H.get(f) : null;
                if (S)
                  y = S;
                else {
                  let v = ue(m || f);
                  const C = /* @__PURE__ */ new Set();
                  try {
                    for (const I of V.keys()) C.add(I);
                  } catch {
                  }
                  try {
                    for (const I of h)
                      I && I.slug && C.add(String(I.slug).split("::")[0]);
                  } catch {
                  }
                  let Z = !1;
                  try {
                    if (V.has(v)) {
                      const I = V.get(v);
                      if (typeof I == "string")
                        I === f && (Z = !0);
                      else if (I && typeof I == "object") {
                        I.default === f && (Z = !0);
                        for (const ee of Object.keys(I.langs || {}))
                          if (I.langs[ee] === f) {
                            Z = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !Z && C.has(v) && (v = Ht(v, C)), y = v;
                  try {
                    H.has(f) || Je(y, f);
                  } catch {
                  }
                }
              }
            } catch (S) {
              de("[slugManager] derive pageSlug failed", S);
            }
            k = y || ue(m || f);
          }
          h.push({ slug: k, title: m, excerpt: w, path: f });
        } catch (b) {
          de("[slugManager] buildSearchIndex: entry processing failed", b);
        }
    try {
      const f = h.filter((b) => {
        try {
          return !s(String(b.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(te) || (te = []), te.length = 0;
        for (const b of f) te.push(b);
      } catch {
        try {
          te = Array.from(f);
        } catch {
          te = f;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = te;
          } catch {
          }
          try {
            const b = [], m = /* @__PURE__ */ new Set();
            for (const w of te)
              try {
                if (!w || !w.slug) continue;
                const y = String(w.slug).split("::")[0];
                if (m.has(y)) continue;
                m.add(y);
                const k = { slug: y };
                w.title ? k.title = String(w.title) : w.parentTitle && (k.title = String(w.parentTitle)), w.path && (k.path = String(w.path)), b.push(k);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: b };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = b;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (f) {
      de("[slugManager] filtering index by excludes failed", f);
      try {
        Array.isArray(te) || (te = []), te.length = 0;
        for (const b of h) te.push(b);
      } catch {
        try {
          te = Array.from(h);
        } catch {
          te = h;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = te;
          } catch {
          }
      } catch {
      }
    }
    return te;
  })();
  try {
    await Rt;
  } catch (a) {
    de("[slugManager] awaiting _indexPromise failed", a);
  }
  return Rt = null, te;
}
async function Pt(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(te) && te.length && !Rt && !s) return te;
    if (Rt) {
      try {
        await Rt;
      } catch {
      }
      return te;
    }
    if (s) {
      try {
        if (typeof xr == "function")
          try {
            const o = await xr(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                ea(o);
              } catch {
              }
              return te;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await qt(n, i, r, a), te;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(te) && te.length) return te;
      await new Promise((o) => setTimeout(o, 150));
    }
    return te;
  } catch {
    return te;
  }
}
async function vr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Pt(t);
    } catch {
      return te;
    }
  } catch {
    return te;
  }
}
const ta = 1e3;
let Ln = ta;
function Cs(e) {
  typeof e == "number" && e >= 0 && (Ln = e);
}
const na = new DOMParser(), ra = "a[href]";
let ia = async function(e, t, n = Ln) {
  if (Hn.has(e)) return Hn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let l = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? l = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? l = s + String(t).replace(/\/$/, "") + "/" : l = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    l = s + "/";
  }
  const o = Math.max(1, Math.min(xn, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const h = a.splice(0, o);
    await Promise.all(h.map(async (c) => {
      if (c == null || r.has(c)) return;
      r.add(c);
      let d = "";
      try {
        d = new URL(c || "", l).toString();
      } catch {
        d = (String(t || "") || s) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let u;
        try {
          u = await globalThis.fetch(d);
        } catch (m) {
          de("[slugManager] crawlForSlug: fetch failed", { url: d, error: m });
          return;
        }
        if (!u || !u.ok) {
          u && !u.ok && de("[slugManager] crawlForSlug: directory fetch non-ok", { url: d, status: u.status });
          return;
        }
        const g = await u.text(), f = na.parseFromString(g, "text/html").querySelectorAll(ra), b = d;
        for (const m of f)
          try {
            if (i) break;
            let w = m.getAttribute("href") || "";
            if (!w || Mn(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const y = new URL(w, b), k = new URL(l).pathname, S = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, ""), v = Ut(K(S));
                r.has(v) || a.push(v);
              } catch {
                const k = K(c + w);
                r.has(k) || a.push(k);
              }
              continue;
            }
            if (w.toLowerCase().endsWith(".md")) {
              let y = "";
              try {
                const k = new URL(w, b), S = new URL(l).pathname;
                y = k.pathname.startsWith(S) ? k.pathname.slice(S.length) : k.pathname.replace(/^\//, "");
              } catch {
                y = (c + w).replace(/^\//, "");
              }
              y = K(y);
              try {
                if (H.has(y))
                  continue;
                for (const k of V.values())
                  ;
              } catch (k) {
                de("[slugManager] slug map access failed", k);
              }
              try {
                const k = await Me(y, t);
                if (k && k.raw) {
                  const S = (k.raw || "").match(/^#\s+(.+)$/m);
                  if (S && S[1] && ue(S[1].trim()) === e) {
                    i = y;
                    break;
                  }
                }
              } catch (k) {
                de("[slugManager] crawlForSlug: fetchMarkdown failed", k);
              }
            }
          } catch (w) {
            de("[slugManager] crawlForSlug: link iteration failed", w);
          }
      } catch (u) {
        de("[slugManager] crawlForSlug: directory fetch failed", u);
      }
    }));
  }
  return Hn.set(e, i), i;
};
async function aa(e, t = Ln) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const l = Math.max(1, Math.min(xn, 6));
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
        let d;
        try {
          d = await globalThis.fetch(c);
        } catch (b) {
          de("[slugManager] crawlAllMarkdown: fetch failed", { url: c, error: b });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && de("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: c, status: d.status });
          return;
        }
        const u = await d.text(), p = na.parseFromString(u, "text/html").querySelectorAll(ra), f = c;
        for (const b of p)
          try {
            let m = b.getAttribute("href") || "";
            if (!m || Mn(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
            if (m.endsWith("/")) {
              try {
                const y = new URL(m, f), k = new URL(s).pathname, S = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, ""), v = Ut(K(S));
                i.has(v) || r.push(v);
              } catch {
                const k = h + m;
                i.has(k) || r.push(k);
              }
              continue;
            }
            let w = "";
            try {
              const y = new URL(m, f), k = new URL(s).pathname;
              w = y.pathname.startsWith(k) ? y.pathname.slice(k.length) : y.pathname.replace(/^\//, "");
            } catch {
              w = (h + m).replace(/^\//, "");
            }
            w = K(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (m) {
            de("[slugManager] crawlAllMarkdown: link iteration failed", m);
          }
      } catch (d) {
        de("[slugManager] crawlAllMarkdown: directory fetch failed", d);
      }
    }));
  }
  return Array.from(n);
}
async function sa(e, t, n) {
  if (e && typeof e == "string" && (e = K(e), e = Vt(e)), V.has(e))
    return Yt(e) || V.get(e);
  try {
    if (!(typeof oe == "string" && oe || V.has(e) || Pe && Pe.size || Dt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of Jn)
    try {
      const a = await r(e, t);
      if (a)
        return Je(e, a), a;
    } catch (a) {
      de("[slugManager] slug resolver failed", a);
    }
  if (Pe && Pe.size) {
    if (un.has(e)) {
      const r = un.get(e);
      return Je(e, r), r;
    }
    for (const r of Oe)
      if (!Qn.has(r))
        try {
          const a = await Me(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ue(s[1].trim());
              if (Qn.add(r), l && un.set(l, r), l === e)
                return Je(e, r), r;
            }
          }
        } catch (a) {
          de("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await qt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return Je(e, a.path), a.path;
    }
  } catch (r) {
    de("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await ia(e, t, n);
    if (r)
      return Je(e, r), r;
  } catch (r) {
    de("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Me(r, t);
      if (a && a.raw)
        return Je(e, r), r;
    } catch (a) {
      de("[slugManager] candidate fetch failed", a);
    }
  if (Pe && Pe.size)
    for (const r of Oe)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ue(a) === e)
          return Je(e, r), r;
      } catch (a) {
        de("[slugManager] build-time filename match failed", a);
      }
  try {
    if (gt && typeof gt == "string" && gt.trim())
      try {
        const r = await Me(gt, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && ue(a[1].trim()) === e)
            return Je(e, gt), gt;
        }
      } catch (r) {
        de("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    de("[slugManager] home page fetch failed", r);
  }
  return null;
}
const lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ta,
  HOME_SLUG: Nr,
  _setAllMd: Ss,
  _setSearchIndex: ea,
  _storeSlugMapping: Je,
  addSlugResolver: ks,
  get allMarkdownPaths() {
    return Oe;
  },
  allMarkdownPathsSet: Pe,
  get availableLanguages() {
    return it;
  },
  awaitSearchIndex: vr,
  buildSearchIndex: qt,
  buildSearchIndexWorker: xr,
  clearFetchCache: Ms,
  clearListCaches: vs,
  crawlAllMarkdown: aa,
  crawlCache: Hn,
  crawlForSlug: ia,
  crawlForSlugWorker: _s,
  get defaultCrawlMaxQueue() {
    return Ln;
  },
  ensureSlug: sa,
  fetchCache: hn,
  get fetchMarkdown() {
    return Me;
  },
  getLanguages: ys,
  getSearchIndex: Rs,
  get homePage() {
    return gt;
  },
  initSlugWorker: ws,
  isExternalLink: Es,
  isExternalLinkWithBase: Mn,
  listPathsFetched: Qn,
  listSlugCache: un,
  mdToSlug: H,
  get notFoundPage() {
    return oe;
  },
  removeSlugResolver: xs,
  resolveSlugPath: Yt,
  get searchIndex() {
    return te;
  },
  setContentBase: Br,
  setDefaultCrawlMaxQueue: Cs,
  setFetchMarkdown: Ls,
  setHomePage: Ji,
  setLanguages: Xi,
  setNotFoundPage: Yi,
  setSkipRootReadme: ms,
  get skipRootReadme() {
    return Or;
  },
  slugResolvers: Jn,
  slugToMd: V,
  slugify: ue,
  unescapeMarkdown: Dn,
  uniqueSlug: Ht,
  whenSearchIndexReady: Pt
}, Symbol.toStringTag, { value: "Module" }));
var pr, wi;
function Ps() {
  if (wi) return pr;
  wi = 1;
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
    const c = s.wordsPerMinute || 200, d = s.wordBound || n;
    for (; d(a[o]); ) o++;
    for (; d(a[h]); ) h--;
    const u = `${a}
`;
    for (let b = o; b <= h; b++)
      if ((t(u[b]) || !d(u[b]) && (d(u[b + 1]) || t(u[b + 1]))) && l++, t(u[b]))
        for (; b <= h && (i(u[b + 1]) || d(u[b + 1])); )
          b++;
    const g = l / c, p = Math.round(g * 60 * 1e3);
    return {
      text: Math.ceil(g.toFixed(2)) + " min read",
      minutes: g,
      time: p,
      words: l
    };
  }
  return pr = r, pr;
}
var $s = Ps();
const zs = /* @__PURE__ */ Di($s);
function Sn(e, t) {
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
function qr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && Sn("description", l), Sn("robots", a.robots || "index,follow"), Is(a, t, n, l);
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
function jr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", h = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const p = K(t);
        try {
          c = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(p);
        } catch {
          c = location.href.split("#")[0];
        }
      } else
        c = location.href.split("#")[0];
    } catch (p) {
      c = location.href.split("#")[0], _("[seoManager] compute canonical failed", p);
    }
    c && oa("canonical", c);
    try {
      Lt("property", "og:url", c);
    } catch (p) {
      _("[seoManager] upsertMeta og:url failed", p);
    }
    const d = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: l || "",
      description: o || "",
      url: c || location.href.split("#")[0]
    };
    h && (d.image = String(h)), s.date && (d.datePublished = s.date), s.dateModified && (d.dateModified = s.dateModified);
    const u = "nimbi-jsonld";
    let g = document.getElementById(u);
    g || (g = document.createElement("script"), g.type = "application/ld+json", g.id = u, document.head.appendChild(g)), g.textContent = JSON.stringify(d, null, 2);
  } catch (s) {
    _("[seoManager] setStructuredData failed", s);
  }
}
let dn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function Ns(e) {
  try {
    if (!e || typeof e != "object") {
      dn = {};
      return;
    }
    dn = Object.assign({}, e);
  } catch (t) {
    _("[seoManager] setSeoMap failed", t);
  }
}
function Bs(e, t = "") {
  try {
    if (!e) return;
    const n = dn && dn[e] ? dn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
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
      n.description && Sn("description", String(n.description));
    } catch {
    }
    try {
      try {
        qr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      jr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      _("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    _("[seoManager] injectSeoForPage failed", n);
  }
}
function Un(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Sn("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Sn("description", String(s));
    } catch {
    }
    try {
      qr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      jr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    _("[seoManager] markNotFound failed", r);
  }
}
function qs(e, t, n, i, r, a, s, l, o, h, c) {
  try {
    if (i && i.querySelector) {
      const d = i.querySelector(".menu-label");
      d && (d.textContent = l && l.textContent || e("onThisPage"));
    }
  } catch (d) {
    _("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta && n.meta.title ? String(n.meta.title).trim() : "", u = r.querySelector("img"), g = u && (u.getAttribute("src") || u.src) || null;
    let p = "";
    try {
      let m = "";
      try {
        const w = l || (r && r.querySelector ? r.querySelector("h1") : null);
        if (w) {
          let y = w.nextElementSibling;
          const k = [];
          for (; y && !(y.tagName && y.tagName.toLowerCase() === "h2"); ) {
            try {
              if (y.classList && y.classList.contains("nimbi-article-subtitle")) {
                y = y.nextElementSibling;
                continue;
              }
            } catch {
            }
            const S = (y.textContent || "").trim();
            S && k.push(S), y = y.nextElementSibling;
          }
          k.length && (m = k.join(" ").replace(/\s+/g, " ").trim()), !m && o && (m = String(o).trim());
        }
      } catch (w) {
        _("[seoManager] compute descOverride failed", w);
      }
      m && String(m).length > 160 && (m = String(m).slice(0, 157).trim() + "..."), p = m;
    } catch (m) {
      _("[seoManager] compute descOverride failed", m);
    }
    let f = "";
    try {
      d && (f = d);
    } catch {
    }
    if (!f)
      try {
        l && l.textContent && (f = String(l.textContent).trim());
      } catch {
      }
    if (!f)
      try {
        const m = r.querySelector("h2");
        m && m.textContent && (f = String(m.textContent).trim());
      } catch {
      }
    f || (f = a || "");
    try {
      qr(n, f || void 0, g, p);
    } catch (m) {
      _("[seoManager] setMetaTags failed", m);
    }
    try {
      jr(n, h, f || void 0, g, p, t);
    } catch (m) {
      _("[seoManager] setStructuredData failed", m);
    }
    const b = Os();
    f ? b ? document.title = `${b} - ${f}` : document.title = `${t || "Site"} - ${f}` : d ? document.title = d : document.title = t || document.title;
  } catch (d) {
    _("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      const d = r.querySelectorAll(".nimbi-reading-time");
      d && d.forEach((u) => u.remove());
    } catch {
    }
    if (o) {
      const d = zs(c.raw || ""), u = d && typeof d.minutes == "number" ? Math.ceil(d.minutes) : 0, g = u ? e("readingTime", { minutes: u }) : "";
      if (!g) return;
      const p = r.querySelector("h1");
      if (p) {
        const f = r.querySelector(".nimbi-article-subtitle");
        try {
          if (f) {
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = g, f.appendChild(b);
          } else {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const m = document.createElement("span");
            m.className = "nimbi-reading-time", m.textContent = g, b.appendChild(m);
            try {
              p.parentElement.insertBefore(b, p.nextSibling);
            } catch {
              try {
                p.insertAdjacentElement("afterend", b);
              } catch {
              }
            }
          }
        } catch {
          try {
            const m = document.createElement("p");
            m.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = g, m.appendChild(w), p.insertAdjacentElement("afterend", m);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    _("[seoManager] reading time update failed", d);
  }
}
let la = 100;
function _i(e) {
  la = e;
}
function ot() {
  try {
    if (Zt(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let fn = 300 * 1e3;
function ki(e) {
  fn = e;
}
const ft = /* @__PURE__ */ new Map();
function js(e) {
  if (!ft.has(e)) return;
  const t = ft.get(e), n = Date.now();
  if (t.ts + fn < n) {
    ft.delete(e);
    return;
  }
  return ft.delete(e), ft.set(e, t), t.value;
}
function Ds(e, t) {
  if (xi(), xi(), ft.delete(e), ft.set(e, { value: t, ts: Date.now() }), ft.size > la) {
    const n = ft.keys().next().value;
    n !== void 0 && ft.delete(n);
  }
}
function xi() {
  if (!fn || fn <= 0) return;
  const e = Date.now();
  for (const [t, n] of ft.entries())
    n.ts + fn < e && ft.delete(t);
}
async function Hs(e, t) {
  const n = new Set(tt), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const d = nt(a);
          if (d) {
            if (d.type === "canonical" && d.page) {
              const u = K(d.page);
              if (u) {
                n.add(u);
                continue;
              }
            }
            if (d.type === "cosmetic" && d.page) {
              const u = d.page;
              if (V.has(u)) {
                const g = V.get(u);
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
          let d = K(l[1]);
          d && n.add(d);
          continue;
        }
        const o = (r.textContent || "").trim(), h = (s.pathname || "").replace(/^.*\//, "");
        if (o && ue(o) === e || h && ue(h.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let d = s.pathname.replace(/^\//, "");
          n.add(d);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const d = new URL(t), u = Ut(d.pathname);
          if (c.indexOf(u) !== -1) {
            let g = c.startsWith(u) ? c.slice(u.length) : c;
            g = K(g), g && n.add(g);
          }
        }
      } catch (s) {
        _("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await Me(r, t);
      if (!a || !a.raw) continue;
      const s = (a.raw || "").match(/^#\s+(.+)$/m);
      if (s) {
        const l = (s[1] || "").trim();
        if (l && ue(l) === e)
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
      if (V.has(n)) {
        const i = Yt(n) || V.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (tt && tt.size)
          for (const i of tt) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (ue(r) === n && !/index\.html$/i.test(i)) {
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
      qi("fetchPageData");
    } catch {
    }
    try {
      ji("fetchPageData");
    } catch {
    }
  } catch {
  }
  let i = null;
  try {
    const m = nt(typeof location < "u" ? location.href : "");
    m && m.anchor && (i = m.anchor);
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
    const m = String(r).split("::", 2);
    r = m[0], a = m[1] || null;
  }
  const o = `${e}|||${typeof cs < "u" && zt ? zt : ""}`, h = js(o);
  if (h)
    r = h.resolved, a = h.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let m = decodeURIComponent(String(r || ""));
      if (m && typeof m == "string" && (m = K(m), m = Vt(m)), V.has(m))
        r = Yt(m) || V.get(m);
      else {
        let w = await Hs(m, t);
        if (w)
          r = w;
        else if (Dt._refreshed && tt && tt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const y = await sa(m, t);
          y && (r = y);
        }
      }
    }
    Ds(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || V.has(r) || tt && tt.size || Dt._refreshed || s || m;
  } catch {
    c = !0;
  }
  !a && i && (a = i);
  try {
    if (c && r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const m = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const w = await fetch(m);
        if (w && w.ok) {
          const y = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", S = (y || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let Z = m;
                try {
                  Z = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  Z = String(m || "").replace(/^\//, "");
                }
                const I = Z.replace(/\.html$/i, ".md");
                try {
                  const ee = await Me(I, t);
                  if (ee && ee.raw)
                    return { data: ee, pagePath: I, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ee = await Me(oe, t);
                    if (ee && ee.raw) {
                      try {
                        Un(ee.meta || {}, oe);
                      } catch {
                      }
                      return { data: ee, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  b = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let Z = m;
                try {
                  Z = new URL(m).pathname.replace(/^\//, "");
                } catch {
                  Z = String(m || "").replace(/^\//, "");
                }
                const I = Z.replace(/\.html$/i, ".md");
                try {
                  const ee = await Me(I, t);
                  if (ee && ee.raw)
                    return { data: ee, pagePath: I, anchor: a };
                } catch {
                }
                if (typeof oe == "string" && oe)
                  try {
                    const ee = await Me(oe, t);
                    if (ee && ee.raw) {
                      try {
                        Un(ee.meta || {}, oe);
                      } catch {
                      }
                      return { data: ee, pagePath: oe, anchor: a };
                    }
                  } catch {
                  }
                try {
                  b = new Error("site shell detected (absolute fetch)");
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
  const d = Us(r);
  try {
    if (ot())
      try {
        $t("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: d });
      } catch {
      }
  } catch {
  }
  const u = String(n || "").includes(".md") || String(n || "").includes(".html");
  let g = null;
  if (!u)
    try {
      let m = decodeURIComponent(String(n || ""));
      m = K(m), m = Vt(m), m && !/\.(md|html?)$/i.test(m) && (g = m);
    } catch {
      g = null;
    }
  if (u && d.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && d.push(r), d.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && d.push(r), d.length === 1 && /index\.html$/i.test(d[0]) && !u && !V.has(r) && !V.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let p = null, f = null, b = null;
  try {
    const m = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof oe == "string" && oe || V.has(r) || tt && tt.size || Dt._refreshed || u || m;
  } catch {
    c = !0;
  }
  if (!c)
    b = new Error("no page data");
  else
    for (const m of d)
      if (m)
        try {
          const w = K(m);
          if (p = await Me(w, t), f = w, g && !V.has(g))
            try {
              let y = "";
              if (p && p.isHtml)
                try {
                  const k = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (k) {
                    const S = k.parseFromString(p.raw || "", "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (y = v.textContent.trim());
                  }
                } catch {
                }
              else {
                const k = (p && p.raw || "").match(/^#\s+(.+)$/m);
                k && k[1] && (y = k[1].trim());
              }
              if (y && ue(y) !== g)
                try {
                  if (/\.html$/i.test(w)) {
                    const S = w.replace(/\.html$/i, ".md");
                    if (d.includes(S))
                      try {
                        const v = await Me(S, t);
                        if (v && v.raw)
                          p = v, f = S;
                        else if (typeof oe == "string" && oe)
                          try {
                            const C = await Me(oe, t);
                            if (C && C.raw)
                              p = C, f = oe;
                            else {
                              p = null, f = null, b = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            p = null, f = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          p = null, f = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const C = await Me(oe, t);
                          if (C && C.raw)
                            p = C, f = oe;
                          else {
                            p = null, f = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          p = null, f = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      p = null, f = null, b = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    p = null, f = null, b = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  p = null, f = null, b = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!u && /\.html$/i.test(w)) {
              const y = w.replace(/\.html$/i, ".md");
              if (d.includes(y))
                try {
                  const S = String(p && p.raw || "").trim().slice(0, 128).toLowerCase();
                  if (p && p.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let C = !1;
                    try {
                      const Z = await Me(y, t);
                      if (Z && Z.raw)
                        p = Z, f = y, C = !0;
                      else if (typeof oe == "string" && oe)
                        try {
                          const I = await Me(oe, t);
                          I && I.raw && (p = I, f = oe, C = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const I = await Me(oe, t);
                        I && I.raw && (p = I, f = oe, C = !0);
                      } catch {
                      }
                    }
                    if (!C) {
                      p = null, f = null, b = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (ot())
              try {
                $t("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: f, isHtml: p && p.isHtml, snippet: p && p.raw ? String(p.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          b = w;
          try {
            ot() && _("[router] candidate fetch failed", { candidate: m, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!p) {
    const m = b && (b.message || String(b)) || null, w = m && /failed to fetch md|site shell detected/i.test(m);
    try {
      if (ot())
        try {
          $t("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: d, fetchError: m });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (ot())
          try {
            _("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: d, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (ot())
          try {
            Wn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: d, contentBase: t, fetchError: m });
          } catch {
          }
      } catch {
      }
    if (typeof oe == "string" && oe)
      try {
        const y = await Me(oe, t);
        if (y && y.raw) {
          try {
            Un(y.meta || {}, oe);
          } catch {
          }
          return { data: y, pagePath: oe, anchor: a };
        }
      } catch {
      }
    try {
      if (u && String(n || "").toLowerCase().includes(".html"))
        try {
          const y = new URL(String(n || ""), location.href).toString();
          ot() && _("[router] attempting absolute HTML fetch fallback", y);
          const k = await fetch(y);
          if (k && k.ok) {
            const S = await k.text(), v = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", C = (S || "").toLowerCase(), Z = v && v.indexOf && v.indexOf("text/html") !== -1 || C.indexOf("<!doctype") !== -1 || C.indexOf("<html") !== -1;
            if (!Z && ot() && _("[router] absolute fetch returned non-HTML", { abs: y, contentType: v, snippet: C.slice(0, 200) }), Z) {
              const I = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || I.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  ot() && _("[router] absolute fetch returned directory listing; treating as not found", { abs: y });
                } catch {
                }
              else
                try {
                  const $ = y, D = new URL(".", $).toString();
                  try {
                    const j = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (j) {
                      const re = j.parseFromString(S || "", "text/html"), A = (Y, ge) => {
                        try {
                          const Se = ge.getAttribute(Y) || "";
                          if (!Se || /^(https?:)?\/\//i.test(Se) || Se.startsWith("/") || Se.startsWith("#")) return;
                          try {
                            const $e = new URL(Se, $).toString();
                            ge.setAttribute(Y, $e);
                          } catch ($e) {
                            _("[router] rewrite attribute failed", Y, $e);
                          }
                        } catch (Se) {
                          _("[router] rewrite helper failed", Se);
                        }
                      }, G = re.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), ie = [];
                      for (const Y of Array.from(G || []))
                        try {
                          const ge = Y.tagName ? Y.tagName.toLowerCase() : "";
                          if (ge === "a") continue;
                          if (Y.hasAttribute("src")) {
                            const Se = Y.getAttribute("src");
                            A("src", Y);
                            const $e = Y.getAttribute("src");
                            Se !== $e && ie.push({ attr: "src", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("href") && ge === "link") {
                            const Se = Y.getAttribute("href");
                            A("href", Y);
                            const $e = Y.getAttribute("href");
                            Se !== $e && ie.push({ attr: "href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("href") && ge !== "link") {
                            const Se = Y.getAttribute("href");
                            A("href", Y);
                            const $e = Y.getAttribute("href");
                            Se !== $e && ie.push({ attr: "href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("xlink:href")) {
                            const Se = Y.getAttribute("xlink:href");
                            A("xlink:href", Y);
                            const $e = Y.getAttribute("xlink:href");
                            Se !== $e && ie.push({ attr: "xlink:href", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("poster")) {
                            const Se = Y.getAttribute("poster");
                            A("poster", Y);
                            const $e = Y.getAttribute("poster");
                            Se !== $e && ie.push({ attr: "poster", tag: ge, before: Se, after: $e });
                          }
                          if (Y.hasAttribute("srcset")) {
                            const Qe = (Y.getAttribute("srcset") || "").split(",").map((ve) => ve.trim()).filter(Boolean).map((ve) => {
                              const [rt, R] = ve.split(/\s+/, 2);
                              if (!rt || /^(https?:)?\/\//i.test(rt) || rt.startsWith("/")) return ve;
                              try {
                                const N = new URL(rt, $).toString();
                                return R ? `${N} ${R}` : N;
                              } catch {
                                return ve;
                              }
                            }).join(", ");
                            Y.setAttribute("srcset", Qe);
                          }
                        } catch {
                        }
                      const Te = re.documentElement && re.documentElement.outerHTML ? re.documentElement.outerHTML : S;
                      try {
                        ot() && ie && ie.length && _("[router] rewritten asset refs", { abs: y, rewritten: ie });
                      } catch {
                      }
                      return { data: { raw: Te, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let ne = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? ne = S.replace(/(<head[^>]*>)/i, `$1<base href="${D}">`) : ne = `<base href="${D}">` + S), { data: { raw: ne, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (y) {
          ot() && _("[router] absolute HTML fetch fallback failed", y);
        }
    } catch {
    }
    try {
      const y = decodeURIComponent(String(r || ""));
      if (y && !/\.(md|html?)$/i.test(y) && typeof oe == "string" && oe && ot()) {
        const S = [
          `/assets/${y}.html`,
          `/assets/${y}/index.html`
        ];
        for (const v of S)
          try {
            const C = await fetch(v, { method: "GET" });
            if (C && C.ok)
              return { data: { raw: await C.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (y) {
      ot() && _("[router] assets fallback failed", y);
    }
    throw new Error("no page data");
  }
  return { data: p, pagePath: f, anchor: a };
}
function er() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var It = er();
function ca(e) {
  It = e;
}
var Bt = { exec: () => null };
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(at.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var Ws = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), at = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Zs = /^(?:[ \t]*(?:\n|$))+/, Gs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Qs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Tn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Xs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Dr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, ua = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ha = Le(ua).replace(/bull/g, Dr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ks = Le(ua).replace(/bull/g, Dr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Hr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Vs = /^[^\n]+/, Ur = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ys = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ur).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Js = Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Dr).getRegex(), tr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Fr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, eo = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Fr).replace("tag", tr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), da = Le(Hr).replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tr).getRegex(), to = Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", da).getRegex(), Wr = { blockquote: to, code: Gs, def: Ys, fences: Qs, heading: Xs, hr: Tn, html: eo, lheading: ha, list: Js, newline: Zs, paragraph: da, table: Bt, text: Vs }, Si = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tr).getRegex(), no = { ...Wr, lheading: Ks, table: Si, paragraph: Le(Hr).replace("hr", Tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Si).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tr).getRegex() }, ro = { ...Wr, html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Fr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Bt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Le(Hr).replace("hr", Tn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ha).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, io = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ao = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, fa = /^( {2,}|\\)\n(?!\s*$)/, so = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, nr = /[\p{P}\p{S}]/u, Zr = /[\s\p{P}\p{S}]/u, pa = /[^\s\p{P}\p{S}]/u, oo = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Zr).getRegex(), ga = /(?!~)[\p{P}\p{S}]/u, lo = /(?!~)[\s\p{P}\p{S}]/u, co = /(?:[^\s\p{P}\p{S}]|~)/u, ma = /(?![*_])[\p{P}\p{S}]/u, uo = /(?![*_])[\s\p{P}\p{S}]/u, ho = /(?:[^\s\p{P}\p{S}]|[*_])/u, fo = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ws ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ya = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, po = Le(ya, "u").replace(/punct/g, nr).getRegex(), go = Le(ya, "u").replace(/punct/g, ga).getRegex(), ba = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", mo = Le(ba, "gu").replace(/notPunctSpace/g, pa).replace(/punctSpace/g, Zr).replace(/punct/g, nr).getRegex(), yo = Le(ba, "gu").replace(/notPunctSpace/g, co).replace(/punctSpace/g, lo).replace(/punct/g, ga).getRegex(), bo = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pa).replace(/punctSpace/g, Zr).replace(/punct/g, nr).getRegex(), wo = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ma).getRegex(), _o = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ko = Le(_o, "gu").replace(/notPunctSpace/g, ho).replace(/punctSpace/g, uo).replace(/punct/g, ma).getRegex(), xo = Le(/\\(punct)/, "gu").replace(/punct/g, nr).getRegex(), So = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), vo = Le(Fr).replace("(?:-->|$)", "-->").getRegex(), Ao = Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", vo).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Xn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Eo = Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Xn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), wa = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", Xn).replace("ref", Ur).getRegex(), _a = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ur).getRegex(), Mo = Le("reflink|nolink(?!\\()", "g").replace("reflink", wa).replace("nolink", _a).getRegex(), vi = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Gr = { _backpedal: Bt, anyPunctuation: xo, autolink: So, blockSkip: fo, br: fa, code: ao, del: Bt, delLDelim: Bt, delRDelim: Bt, emStrongLDelim: po, emStrongRDelimAst: mo, emStrongRDelimUnd: bo, escape: io, link: Eo, nolink: _a, punctuation: oo, reflink: wa, reflinkSearch: Mo, tag: Ao, text: so, url: Bt }, Lo = { ...Gr, link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", Xn).getRegex(), reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Xn).getRegex() }, Ar = { ...Gr, emStrongRDelimAst: yo, emStrongLDelim: go, delLDelim: wo, delRDelim: ko, url: Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", vi).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", vi).getRegex() }, To = { ...Ar, br: Le(fa).replace("{2,}", "*").getRegex(), text: Le(Ar.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Nn = { normal: Wr, gfm: no, pedantic: ro }, rn = { normal: Gr, gfm: Ar, breaks: To, pedantic: Lo }, Ro = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ai = (e) => Ro[e];
function wt(e, t) {
  if (t) {
    if (at.escapeTest.test(e)) return e.replace(at.escapeReplace, Ai);
  } else if (at.escapeTestNoEncode.test(e)) return e.replace(at.escapeReplaceNoEncode, Ai);
  return e;
}
function Ei(e) {
  try {
    e = encodeURI(e).replace(at.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Mi(e, t) {
  let n = e.replace(at.findPipe, (a, s, l) => {
    let o = !1, h = s;
    for (; --h >= 0 && l[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(at.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(at.slashPipe, "|");
  return i;
}
function an(e, t, n) {
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
function Li(e, t, n, i, r) {
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
var vn = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || It;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : an(n, `
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
        let i = an(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: an(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = an(t[0], `
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
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, a, !0), this.lexer.state.top = d, n.length === 0) break;
        let u = a.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let g = u, p = g.raw + `
` + n.join(`
`), f = this.blockquote(p);
          a[a.length - 1] = f, i = i.substring(0, i.length - g.raw.length) + f.raw, r = r.substring(0, r.length - g.text.length) + f.text;
          break;
        } else if (u?.type === "list") {
          let g = u, p = g.raw + `
` + n.join(`
`), f = this.list(p);
          a[a.length - 1] = f, i = i.substring(0, i.length - u.raw.length) + f.raw, r = r.substring(0, r.length - g.raw.length) + f.raw, n = p.substring(a.at(-1).raw.length).split(`
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
        let d = Po(t[2].split(`
`, 1)[0], t[1].length), u = e.split(`
`, 1)[0], g = !d.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, c = d.trimStart()) : g ? p = t[1].length + 1 : (p = d.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, c = d.slice(p), p += t[1].length), g && this.rules.other.blankLine.test(u) && (h += u + `
`, e = e.substring(u.length + 1), o = !0), !o) {
          let f = this.rules.other.nextBulletRegex(p), b = this.rules.other.hrRegex(p), m = this.rules.other.fencesBeginRegex(p), w = this.rules.other.headingBeginRegex(p), y = this.rules.other.htmlBeginRegex(p), k = this.rules.other.blockquoteBeginRegex(p);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (u = S, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), v = u) : v = u.replace(this.rules.other.tabCharGlobal, "    "), m.test(u) || w.test(u) || y.test(u) || k.test(u) || f.test(u) || b.test(u)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= p || !u.trim()) c += `
` + v.slice(p);
            else {
              if (g || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || m.test(d) || w.test(d) || b.test(d)) break;
              c += `
` + u;
            }
            g = !u.trim(), h += S + `
`, e = e.substring(S.length + 1), d = v.slice(p);
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
          let h = o.tokens.filter((d) => d.type === "space"), c = h.length > 0 && h.some((d) => this.rules.other.anyLine.test(d.raw));
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
    let n = Mi(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Mi(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = an(n.slice(0, -1), "\\");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Li(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Li(n, r, n[0], this.lexer, this.rules);
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
        let c = [...i[0]][0].length, d = e.slice(0, r + i.index + c + s);
        if (Math.min(r, s) % 2) {
          let g = d.slice(1, -1);
          return { type: "em", raw: d, text: g, tokens: this.lexer.inlineTokens(g) };
        }
        let u = d.slice(2, -2);
        return { type: "strong", raw: d, text: u, tokens: this.lexer.inlineTokens(u) };
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
        let h = [...i[0]][0].length, c = e.slice(0, r + i.index + h + s), d = c.slice(r, -r);
        return { type: "del", raw: c, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, ht = class Er {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || It, this.options.tokenizer = this.options.tokenizer || new vn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: at, block: Nn.normal, inline: rn.normal };
    this.options.pedantic ? (n.block = Nn.pedantic, n.inline = rn.pedantic) : this.options.gfm && (n.block = Nn.gfm, this.options.breaks ? n.inline = rn.breaks : n.inline = rn.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Nn, inline: rn };
  }
  static lex(t, n) {
    return new Er(n).lex(t);
  }
  static lexInline(t, n) {
    return new Er(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(at.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(at.tabCharGlobal, "    ").replace(at.spaceLine, "")); t; ) {
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
        let c = 1 / 0, d = t.slice(1), u;
        this.options.extensions.startInline.forEach((g) => {
          u = g.call({ lexer: this }, d), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
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
}, An = class {
  options;
  parser;
  constructor(e) {
    this.options = e || It;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(at.notSpaceStart)?.[0], r = e.replace(at.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + wt(i) + '">' + (n ? r : wt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : wt(r, !0)) + `</code></pre>
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
    return `<code>${wt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Ei(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + wt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Ei(e);
    if (r === null) return wt(n);
    e = r;
    let a = `<img src="${e}" alt="${wt(n)}"`;
    return t && (a += ` title="${wt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : wt(e.text);
  }
}, rr = class {
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
}, dt = class Mr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || It, this.options.renderer = this.options.renderer || new An(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new rr();
  }
  static parse(t, n) {
    return new Mr(n).parse(t);
  }
  static parseInline(t, n) {
    return new Mr(n).parseInline(t);
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
}, Xt = class {
  options;
  block;
  constructor(e) {
    this.options = e || It;
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
    return this.block ? ht.lex : ht.lexInline;
  }
  provideParser() {
    return this.block ? dt.parse : dt.parseInline;
  }
}, ka = class {
  defaults = er();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = dt;
  Renderer = An;
  TextRenderer = rr;
  Lexer = ht;
  Tokenizer = vn;
  Hooks = Xt;
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
        let r = this.defaults.renderer || new An(this.defaults);
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
        let r = this.defaults.tokenizer || new vn(this.defaults);
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
        let r = this.defaults.hooks || new Xt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, l = n.hooks[s], o = r[s];
          Xt.passThroughHooks.has(a) ? r[s] = (h) => {
            if (this.defaults.async && Xt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let d = await l.call(r, h);
              return o.call(r, d);
            })();
            let c = l.call(r, h);
            return o.call(r, c);
          } : r[s] = (...h) => {
            if (this.defaults.async) return (async () => {
              let d = await l.apply(r, h);
              return d === !1 && (d = await o.apply(r, h)), d;
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
    return ht.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return dt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, l = await (r.hooks ? await r.hooks.provideLexer() : e ? ht.lex : ht.lexInline)(s, r), o = r.hooks ? await r.hooks.processAllTokens(l) : l;
        r.walkTokens && await Promise.all(this.walkTokens(o, r.walkTokens));
        let h = await (r.hooks ? await r.hooks.provideParser() : e ? dt.parse : dt.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? ht.lex : ht.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let l = (r.hooks ? r.hooks.provideParser() : e ? dt.parse : dt.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + wt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Ft = new ka();
function ke(e, t) {
  return Ft.parse(e, t);
}
ke.options = ke.setOptions = function(e) {
  return Ft.setOptions(e), ke.defaults = Ft.defaults, ca(ke.defaults), ke;
};
ke.getDefaults = er;
ke.defaults = It;
ke.use = function(...e) {
  return Ft.use(...e), ke.defaults = Ft.defaults, ca(ke.defaults), ke;
};
ke.walkTokens = function(e, t) {
  return Ft.walkTokens(e, t);
};
ke.parseInline = Ft.parseInline;
ke.Parser = dt;
ke.parser = dt.parse;
ke.Renderer = An;
ke.TextRenderer = rr;
ke.Lexer = ht;
ke.lexer = ht.lex;
ke.Tokenizer = vn;
ke.Hooks = Xt;
ke.parse = ke;
var zo = ke.options, Io = ke.setOptions, Oo = ke.use, No = ke.walkTokens, Bo = ke.parseInline, qo = ke, jo = dt.parse, Do = ht.lex;
const Ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Xt,
  Lexer: ht,
  Marked: ka,
  Parser: dt,
  Renderer: An,
  TextRenderer: rr,
  Tokenizer: vn,
  get defaults() {
    return It;
  },
  getDefaults: er,
  lexer: Do,
  marked: ke,
  options: zo,
  parse: qo,
  parseInline: Bo,
  parser: jo,
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
`, Ri = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", xa], { type: "text/javascript;charset=utf-8" });
function Ho(e) {
  let t;
  try {
    if (t = Ri && (self.URL || self.webkitURL).createObjectURL(Ri), !t) throw "";
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
function Kn(e) {
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
const pn = Ti && (ke || Ti) || void 0;
let et = null;
const Uo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function Vn() {
  if (et) return et;
  try {
    try {
      const e = await import(Uo + "/lib/core.js");
      et = e.default || e;
    } catch {
      et = null;
    }
  } catch {
    et = null;
  }
  return et;
}
pn && typeof pn.setOptions == "function" && pn.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return et && t && typeof et.getLanguage == "function" && et.getLanguage(t) ? et.highlight(e, { language: t }).value : et && typeof et.getLanguage == "function" && et.getLanguage("plaintext") ? et.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: c, url: d } = t;
      try {
        if (!await Vn()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const g = await import(d), p = g.default || g;
        et.registerLanguage(c, p), postMessage({ type: "registered", name: c });
      } catch (u) {
        postMessage({ type: "register-error", name: c, error: String(u) });
      }
      return;
    }
    if (t.type === "detect") {
      const c = t.md || "", d = t.supported || [], u = /* @__PURE__ */ new Set(), g = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let p;
      for (; p = g.exec(c); )
        if (p[1]) {
          const f = String(p[1]).toLowerCase();
          if (!f) continue;
          if (f.length >= 5 && f.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(f) && u.add(f), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(f) && u.add(f), d && d.length)
            try {
              d.indexOf(f) !== -1 && u.add(f);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(u) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Kn(i || "");
    await Vn().catch(() => {
    });
    let s = pn.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), h = (c) => {
      try {
        return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, d, u, g) => {
      const p = Number(d);
      let f = g.replace(/<[^>]+>/g, "").trim();
      try {
        f = Sa(f);
      } catch {
      }
      let b = null;
      const m = (u || "").match(/\sid="([^"]+)"/);
      m && (b = m[1]);
      const w = b || h(f) || "heading", k = (o.get(w) || 0) + 1;
      o.set(w, k);
      const S = k === 1 ? w : w + "-" + k;
      l.push({ level: p, text: f, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, C = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Z = (v[p] + " " + C).trim(), ee = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${Z}"`).trim();
      return `<h${p} ${ee}>${g}</h${p}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, d) => /\bloading=/.test(d) ? `<img${d}>` : /\bdata-want-lazy=/.test(d) ? `<img${d}>` : `<img${d} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Fo(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: h } = e;
      try {
        if (!await Vn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const d = await import(h), u = d.default || d;
        return et.registerLanguage(o, u), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", h = e.supported || [], c = /* @__PURE__ */ new Set(), d = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let u;
      for (; u = d.exec(o); )
        if (u[1]) {
          const g = String(u[1]).toLowerCase();
          if (!g) continue;
          if (g.length >= 5 && g.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(g) && c.add(g), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(g) && c.add(g), h && h.length)
            try {
              h.indexOf(g) !== -1 && c.add(g);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Kn(e && e.md || "");
    await Vn().catch(() => {
    });
    let r = pn.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, d) => {
      const u = Number(h);
      let g = d.replace(/<[^>]+>/g, "").trim();
      try {
        g = Sa(g);
      } catch {
      }
      let p = null;
      const f = (c || "").match(/\sid="([^"]+)"/);
      f && (p = f[1]);
      const b = p || l(g) || "heading", w = (s.get(b) || 0) + 1;
      s.set(b, w);
      const y = w === 1 ? b : b + "-" + w;
      a.push({ level: u, text: g, id: y });
      const k = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = u <= 2 ? "has-text-weight-bold" : u <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[u] + " " + S).trim(), Z = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${v}"`).trim();
      return `<h${u} ${Z}>${d}</h${u}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, h) => /\bloading=/.test(h) ? `<img${h}>` : /\bdata-want-lazy=/.test(h) ? `<img${h}>` : `<img${h} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const gr = {
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
let Bn = typeof DOMParser < "u" ? new DOMParser() : null;
function Wt() {
  return Bn || (typeof DOMParser < "u" ? (Bn = new DOMParser(), Bn) : null);
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
const va = Qi(() => Zo(), "markdown", Wo), jt = () => va.get(), Qr = (e, t = 3e3) => va.send(e, t), xt = [];
function Lr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    xt.push(e);
    try {
      ke.use(e);
    } catch (t) {
      _("[markdown] failed to apply plugin", t);
    }
  }
}
function Go(e) {
  xt.length = 0, Array.isArray(e) && xt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    xt.forEach((t) => ke.use(t));
  } catch (t) {
    _("[markdown] failed to apply markdown extensions", t);
  }
}
async function En(e) {
  if (xt && xt.length) {
    let { content: i, data: r } = Kn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => gr[l] || s);
    } catch {
    }
    ke.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      xt.forEach((s) => ke.use(s));
    } catch (s) {
      _("[markdown] apply plugins failed", s);
    }
    const a = ke.parse(i);
    try {
      const s = Wt();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), h = [], c = /* @__PURE__ */ new Set(), d = (g) => {
          try {
            return String(g || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, u = (g) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, f = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[g] + " " + f).trim();
        };
        o.forEach((g) => {
          try {
            const p = Number(g.tagName.substring(1)), f = (g.textContent || "").trim();
            let b = d(f) || "heading", m = b, w = 2;
            for (; c.has(m); )
              m = b + "-" + w, w += 1;
            c.add(m), g.id = m, g.className = u(p), h.push({ level: p, text: f, id: m });
          } catch {
          }
        });
        try {
          l.querySelectorAll("img").forEach((g) => {
            try {
              const p = g.getAttribute && g.getAttribute("loading"), f = g.getAttribute && g.getAttribute("data-want-lazy");
              !p && !f && g.setAttribute && g.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          l.querySelectorAll("pre code, code[class]").forEach((g) => {
            try {
              const p = g.getAttribute && g.getAttribute("class") || g.className || "", f = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (f)
                try {
                  g.setAttribute && g.setAttribute("class", f);
                } catch {
                  g.className = f;
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
      const i = await Promise.resolve().then(() => Aa);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = jt && jt();
    }
  else
    t = jt && jt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => gr[r] || i);
  } catch {
  }
  try {
    if (typeof Ce < "u" && Ce && typeof Ce.getLanguage == "function" && Ce.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Kn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (h, c) => gr[c] || h);
      } catch {
      }
      ke.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (h, c) => {
        try {
          return c && Ce.getLanguage && Ce.getLanguage(c) ? Ce.highlight(h, { language: c }).value : Ce && typeof Ce.getLanguage == "function" && Ce.getLanguage("plaintext") ? Ce.highlight(h, { language: "plaintext" }).value : h;
        } catch {
          return h;
        }
      } });
      let a = ke.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (h, c) => {
          try {
            if (c && Ce && typeof Ce.highlight == "function")
              try {
                const d = Ce.highlight(c, { language: "plaintext" });
                return `<pre><code>${d && d.value ? d.value : d}</code></pre>`;
              } catch {
                try {
                  if (Ce && typeof Ce.highlightElement == "function") {
                    const u = { innerHTML: c };
                    return Ce.highlightElement(u), `<pre><code>${u.innerHTML}</code></pre>`;
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
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (h, c, d, u) => {
        const g = Number(c), p = u.replace(/<[^>]+>/g, "").trim();
        let f = o(p) || "heading", b = f, m = 2;
        for (; l.has(b); )
          b = f + "-" + m, m += 1;
        l.add(b), s.push({ level: g, text: p, id: b });
        const w = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, y = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", k = (w[g] + " " + y).trim(), v = ((d || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${k}"`).trim();
        return `<h${g} ${v}>${u}</h${g}>`;
      }), a = a.replace(/<img([^>]*)>/g, (h, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Qr({ type: "render", md: e });
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
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, h, c, d) => {
      const u = Number(h), g = d.replace(/<[^>]+>/g, "").trim(), p = (c || "").match(/\sid="([^"]+)"/), f = p ? p[1] : a(g) || "heading", m = (i.get(f) || 0) + 1;
      i.set(f, m);
      const w = m === 1 ? f : f + "-" + m;
      r.push({ level: u, text: g, id: w });
      const y = s(u), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${y}"`).trim();
      return `<h${u} ${S}>${d}</h${u}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const h = Wt();
        if (h) {
          const c = h.parseFromString(l, "text/html");
          c.querySelectorAll("img").forEach((u) => {
            try {
              const g = u.getAttribute("src") || "";
              (g ? new URL(g, location.href).toString() : "") === o && u.remove();
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
function gn(e, t) {
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
      if (Hi.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(ct && ct[l] && t.has(ct[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const h = t.get(l);
          h && n.add(h);
          continue;
        }
        if (ct && ct[l]) {
          const h = ct[l];
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
async function Tr(e, t) {
  if (xt && xt.length || typeof process < "u" && process.env && process.env.VITEST) return gn(e || "", t);
  if (jt && jt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Qr({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      _("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return gn(e || "", t);
}
const Aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Qr,
  addMarkdownExtension: Lr,
  detectFenceLanguages: gn,
  detectFenceLanguagesAsync: Tr,
  initRendererWorker: jt,
  markdownPlugins: xt,
  parseMarkdownToHtml: En,
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
        await Xr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
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
        return await Xr(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function ut(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + gi(e, t);
  } catch {
    return gi(e, t);
  }
}
function Ko(...e) {
  try {
    _(...e);
  } catch {
  }
}
function Yn(e) {
  try {
    if (Zt(3)) return !0;
  } catch {
  }
  try {
    if (typeof oe == "string" && oe) return !0;
  } catch {
  }
  try {
    if (V && V.size) return !0;
  } catch {
  }
  try {
    if (Pe && Pe.size) return !0;
  } catch {
  }
  return !1;
}
function kt(e, t) {
  try {
    if (typeof Je == "function")
      try {
        Je(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && H && typeof H.set == "function" && H.set(t, e);
  } catch {
  }
  try {
    if (Pe && typeof Pe.has == "function") {
      if (!Pe.has(t)) {
        try {
          Pe.add(t);
        } catch {
        }
        try {
          Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
      } catch {
      }
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
  r.className = "menu-list";
  try {
    const a = document.createDocumentFragment();
    t.forEach((s) => {
      const l = document.createElement("li"), o = document.createElement("a");
      try {
        const h = String(s.path || "");
        try {
          o.setAttribute("href", ze(h));
        } catch {
          h && h.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(h)) : o.setAttribute("href", ut(h));
        }
      } catch {
        o.setAttribute("href", "#" + s.path);
      }
      if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
        const h = document.createElement("ul");
        s.children.forEach((c) => {
          const d = document.createElement("li"), u = document.createElement("a");
          try {
            const g = String(c.path || "");
            try {
              u.setAttribute("href", ze(g));
            } catch {
              g && g.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(g)) : u.setAttribute("href", ut(g));
            }
          } catch {
            u.setAttribute("href", "#" + c.path);
          }
          u.textContent = c.name, d.appendChild(u), h.appendChild(d);
        }), l.appendChild(h);
      }
      a.appendChild(l);
    }), r.appendChild(a);
  } catch {
    t.forEach((s) => {
      try {
        const l = document.createElement("li"), o = document.createElement("a");
        try {
          const h = String(s.path || "");
          try {
            o.setAttribute("href", ze(h));
          } catch {
            h && h.indexOf("/") === -1 ? o.setAttribute("href", "#" + encodeURIComponent(h)) : o.setAttribute("href", ut(h));
          }
        } catch {
          o.setAttribute("href", "#" + s.path);
        }
        if (o.textContent = s.name, l.appendChild(o), s.children && s.children.length) {
          const h = document.createElement("ul");
          s.children.forEach((c) => {
            const d = document.createElement("li"), u = document.createElement("a");
            try {
              const g = String(c.path || "");
              try {
                u.setAttribute("href", ze(g));
              } catch {
                g && g.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(g)) : u.setAttribute("href", ut(g));
              }
            } catch {
              u.setAttribute("href", "#" + c.path);
            }
            u.textContent = c.name, d.appendChild(u), h.appendChild(d);
          }), l.appendChild(h);
        }
        r.appendChild(l);
      } catch (l) {
        _("[htmlBuilder] createNavTree item failed", l);
      }
    });
  }
  return n.appendChild(r), n;
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
        const h = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), d = document.createElement("a"), u = gs(o.text || ""), g = o.id || ue(u);
        d.textContent = u;
        try {
          const m = String(n || "").replace(/^[\\.\\/]+/, ""), w = m && H && H.has && H.has(m) ? H.get(m) : m;
          w ? d.href = ze(w, g) : d.href = `#${encodeURIComponent(g)}`;
        } catch (m) {
          _("[htmlBuilder] buildTocElement href normalization failed", m), d.href = `#${encodeURIComponent(g)}`;
        }
        if (c.appendChild(d), h === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((m) => {
            Number(m) > 2 && delete l[m];
          });
          return;
        }
        let p = h - 1;
        for (; p > 2 && !l[p]; ) p--;
        p < 2 && (p = 2);
        let f = l[p];
        if (!f) {
          a.appendChild(c), l[h] = c;
          return;
        }
        let b = f.querySelector("ul");
        b || (b = document.createElement("ul"), f.appendChild(b)), b.appendChild(c), l[h] = c;
      } catch (h) {
        _("[htmlBuilder] buildTocElement item failed", h, o);
      }
    });
  } catch (l) {
    _("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Ea(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ue(n.textContent || ""));
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
function Ci(e, t, n) {
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
            } catch (d) {
              _("[htmlBuilder] rewrite asset attribute failed", h, c, d);
            }
          } catch (c) {
            _("[htmlBuilder] rewriteAttr failed", c);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && o("src"), s.hasAttribute && s.hasAttribute("href") && l !== "a" && o("href"), s.hasAttribute && s.hasAttribute("xlink:href") && o("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && o("poster"), s.hasAttribute("srcset")) {
          const d = (s.getAttribute("srcset") || "").split(",").map((u) => u.trim()).filter(Boolean).map((u) => {
            const [g, p] = u.split(/\s+/, 2);
            if (!g || /^(https?:)?\/\//i.test(g) || g.startsWith("/")) return u;
            try {
              const f = new URL(g, r).toString();
              return p ? `${f} ${p}` : f;
            } catch {
              return u;
            }
          }).join(", ");
          s.setAttribute("srcset", d);
        }
      } catch (l) {
        _("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    _("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Pi = "", mr = null, $i = "";
async function Xr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Pi && mr)
      a = mr, s = $i;
    else {
      try {
        a = new URL(t, location.href), s = Ut(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Ut(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Pi = t, mr = a, $i = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], h = /* @__PURE__ */ new Set(), c = [];
    for (const d of Array.from(r))
      try {
        try {
          if (d.closest && d.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const u = d.getAttribute("href") || "";
        if (!u || kr(u)) continue;
        try {
          if (u.startsWith("?") || u.indexOf("?") !== -1)
            try {
              const p = new URL(u, t || location.href), f = p.searchParams.get("page");
              if (f && f.indexOf("/") === -1 && n) {
                const b = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (b) {
                  const m = K(b + f), w = i && i.canonical ? ze(m, p.hash ? p.hash.replace(/^#/, "") : null) : ut(m, p.hash ? p.hash.replace(/^#/, "") : null);
                  d.setAttribute("href", w);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (u.startsWith("/") && !u.endsWith(".md")) continue;
        const g = u.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (g) {
          let p = g[1];
          const f = g[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const b = new URL(p, t).pathname;
            let m = b.startsWith(s) ? b.slice(s.length) : b;
            m = K(m), o.push({ node: d, mdPathRaw: p, frag: f, rel: m }), H.has(m) || l.add(m);
          } catch (b) {
            _("[htmlBuilder] resolve mdPath failed", b);
          }
          continue;
        }
        try {
          let p = u;
          !u.startsWith("/") && n && (u.startsWith("#") ? p = n + u : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + u);
          const b = new URL(p, t).pathname || "";
          if (b && b.indexOf(s) !== -1) {
            let m = b.startsWith(s) ? b.slice(s.length) : b;
            if (m = K(m), m = Vt(m), m || (m = Nr), !m.endsWith(".md")) {
              let w = null;
              try {
                if (H && H.has && H.has(m))
                  w = H.get(m);
                else
                  try {
                    const y = String(m || "").replace(/^.*\//, "");
                    y && H.has && H.has(y) && (w = H.get(y));
                  } catch (y) {
                    _("[htmlBuilder] mdToSlug baseName check failed", y);
                  }
              } catch (y) {
                _("[htmlBuilder] mdToSlug access check failed", y);
              }
              if (!w)
                try {
                  const y = String(m || "").replace(/^.*\//, "");
                  for (const [k, S] of V || [])
                    if (S === m || S === y) {
                      w = k;
                      break;
                    }
                } catch {
                }
              if (w) {
                const y = i && i.canonical ? ze(w, null) : ut(w);
                d.setAttribute("href", y);
              } else {
                let y = m;
                try {
                  /\.[^\/]+$/.test(String(m || "")) || (y = String(m || "") + ".html");
                } catch {
                  y = m;
                }
                h.add(y), c.push({ node: d, rel: y });
              }
            }
          }
        } catch (p) {
          _("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (u) {
        _("[htmlBuilder] processing anchor failed", u);
      }
    if (l.size)
      if (Yn(t))
        await Promise.all(Array.from(l).map(async (d) => {
          try {
            try {
              const g = String(d).match(/([^\/]+)\.md$/), p = g && g[1];
              if (p && V.has(p)) {
                try {
                  const f = V.get(p);
                  if (f)
                    try {
                      const b = typeof f == "string" ? f : f && f.default ? f.default : null;
                      b && kt(p, b);
                    } catch (b) {
                      _("[htmlBuilder] _storeSlugMapping failed", b);
                    }
                } catch (f) {
                  _("[htmlBuilder] reading slugToMd failed", f);
                }
                return;
              }
            } catch (g) {
              _("[htmlBuilder] basename slug lookup failed", g);
            }
            const u = await Me(d, t);
            if (u && u.raw) {
              const g = (u.raw || "").match(/^#\s+(.+)$/m);
              if (g && g[1]) {
                const p = ue(g[1].trim());
                if (p)
                  try {
                    kt(p, d);
                  } catch (f) {
                    _("[htmlBuilder] setting slug mapping failed", f);
                  }
              }
            }
          } catch (u) {
            _("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", u);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(l))
          try {
            const u = String(d).match(/([^\/]+)\.md$/), g = u && u[1];
            if (g) {
              const p = ue(g);
              if (p)
                try {
                  kt(p, d);
                } catch (f) {
                  _("[htmlBuilder] setting fallback slug mapping failed", f);
                }
            }
          } catch {
          }
      }
    if (h.size)
      if (Yn(t))
        await Promise.all(Array.from(h).map(async (d) => {
          try {
            const u = await Me(d, t);
            if (u && u.raw)
              try {
                const p = Wt().parseFromString(u.raw, "text/html"), f = p.querySelector("title"), b = p.querySelector("h1"), m = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : b && b.textContent ? b.textContent.trim() : null;
                if (m) {
                  const w = ue(m);
                  if (w)
                    try {
                      kt(w, d);
                    } catch (y) {
                      _("[htmlBuilder] setting html slug mapping failed", y);
                    }
                }
              } catch (g) {
                _("[htmlBuilder] parse fetched HTML failed", g);
              }
          } catch (u) {
            _("[htmlBuilder] fetchMarkdown for htmlPending failed", u);
          }
        }));
      else {
        try {
          _("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(h))
          try {
            const u = String(d).match(/([^\/]+)\.html$/), g = u && u[1];
            if (g) {
              const p = ue(g);
              if (p)
                try {
                  kt(p, d);
                } catch (f) {
                  _("[htmlBuilder] setting fallback html slug mapping failed", f);
                }
            }
          } catch {
          }
      }
    for (const d of o) {
      const { node: u, frag: g, rel: p } = d;
      let f = null;
      try {
        H.has(p) && (f = H.get(p));
      } catch (b) {
        _("[htmlBuilder] mdToSlug access failed", b);
      }
      if (f) {
        const b = i && i.canonical ? ze(f, g) : ut(f, g);
        u.setAttribute("href", b);
      } else {
        const b = i && i.canonical ? ze(p, g) : ut(p, g);
        u.setAttribute("href", b);
      }
    }
    for (const d of c) {
      const { node: u, rel: g } = d;
      let p = null;
      try {
        H.has(g) && (p = H.get(g));
      } catch (f) {
        _("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", f);
      }
      if (!p)
        try {
          const f = String(g || "").replace(/^.*\//, "");
          H.has(f) && (p = H.get(f));
        } catch (f) {
          _("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", f);
        }
      if (p) {
        const f = i && i.canonical ? ze(p, null) : ut(p);
        u.setAttribute("href", f);
      } else {
        const f = i && i.canonical ? ze(g, null) : ut(g);
        u.setAttribute("href", f);
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
    !l && n && (l = String(n)), l && (s = ue(l)), s || (s = Nr);
    try {
      if (n)
        try {
          kt(s, n);
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
          const h = nt(typeof location < "u" ? location.href : "");
          h && h.anchor && h.page && String(h.page) === String(s) ? o = h.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", ut(s, o));
      } catch (h) {
        _("[htmlBuilder] computeSlug history replace failed", h);
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
      const h = o.getAttribute("href") || "";
      if (!h) continue;
      let u = K(h).split(/::|#/, 2)[0];
      try {
        const p = u.indexOf("?");
        p !== -1 && (u = u.slice(0, p));
      } catch {
      }
      if (!u || (u.includes(".") || (u = u + ".html"), !/\.html(?:$|[?#])/.test(u) && !u.toLowerCase().endsWith(".html"))) continue;
      const g = u;
      try {
        if (H && H.has && H.has(g)) continue;
      } catch (p) {
        _("[htmlBuilder] mdToSlug check failed", p);
      }
      try {
        let p = !1;
        for (const f of V.values())
          if (f === g) {
            p = !0;
            break;
          }
        if (p) continue;
      } catch (p) {
        _("[htmlBuilder] slugToMd iteration failed", p);
      }
      n.add(g);
    } catch (h) {
      _("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", h);
    }
  if (!n.size) return;
  if (!Yn()) {
    try {
      _("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const h = String(o).match(/([^\/]+)\.html$/), c = h && h[1];
        if (c) {
          const d = ue(c);
          if (d)
            try {
              kt(d, o);
            } catch (u) {
              _("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", u);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (o) => {
    try {
      const h = await Me(o, t);
      if (h && h.raw)
        try {
          const d = Wt().parseFromString(h.raw, "text/html"), u = d.querySelector("title"), g = d.querySelector("h1"), p = u && u.textContent && u.textContent.trim() ? u.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
          if (p) {
            const f = ue(p);
            if (f)
              try {
                kt(f, o);
              } catch (b) {
                _("[htmlBuilder] set slugToMd/mdToSlug failed", b);
              }
          }
        } catch (c) {
          _("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (h) {
      _("[htmlBuilder] fetchAndExtract failed", h);
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
    r = Ut(a.pathname);
  } catch (a) {
    r = "", _("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = K(l[1]);
        try {
          let h;
          try {
            h = Vo(o, t);
          } catch (d) {
            h = o, _("[htmlBuilder] resolve mdPath URL failed", d);
          }
          const c = h && r && h.startsWith(r) ? h.slice(r.length) : String(h || "").replace(/^\//, "");
          n.push({ rel: c }), H.has(c) || i.add(c);
        } catch (h) {
          _("[htmlBuilder] rewriteAnchors failed", h);
        }
        continue;
      }
    } catch (s) {
      _("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (Yn())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && V.has(l)) {
            try {
              const o = V.get(l);
              if (o)
                try {
                  const h = typeof o == "string" ? o : o && o.default ? o.default : null;
                  h && kt(l, h);
                } catch (h) {
                  _("[htmlBuilder] _storeSlugMapping failed", h);
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
          const s = await Me(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = ue(l[1].trim());
              if (o)
                try {
                  kt(o, a);
                } catch (h) {
                  _("[htmlBuilder] preMapMdSlugs setting slug mapping failed", h);
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
Wt();
function yr(e) {
  try {
    const n = Wt().parseFromString(e || "", "text/html");
    Ea(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (h) {
          _("[htmlBuilder] parseHtml set image loading attribute failed", h);
        }
      });
    } catch (l) {
      _("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", h = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (h && h[1]) {
          const c = (h[1] || "").toLowerCase(), d = xe.size && (xe.get(c) || xe.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await kn(d);
              } catch (u) {
                _("[htmlBuilder] registerLanguage failed", u);
              }
            })();
          } catch (u) {
            _("[htmlBuilder] schedule registerLanguage failed", u);
          }
        } else
          try {
            if (Ce && typeof Ce.getLanguage == "function" && Ce.getLanguage("plaintext")) {
              const c = Ce.highlight ? Ce.highlight(l.textContent || "", { language: "plaintext" }) : null;
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
  const t = Tr ? await Tr(e || "", xe) : gn(e || "", xe), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = xe.size && (xe.get(r) || xe.get(String(r).toLowerCase())) || r;
      try {
        i.push(kn(a));
      } catch (s) {
        _("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(kn(r));
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
  if (await il(e), En) {
    const t = await En(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function sl(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const d = Wt();
      if (d) {
        const u = d.parseFromString(t.raw || "", "text/html");
        try {
          Ci(u.body, n, r);
        } catch (g) {
          _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", g);
        }
        a = yr(u.documentElement && u.documentElement.outerHTML ? u.documentElement.outerHTML : t.raw || "");
      } else
        a = yr(t.raw || "");
    } catch {
      a = yr(t.raw || "");
    }
  else
    a = await al(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    Ci(s, n, r);
  } catch (d) {
    _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", d);
  }
  try {
    Ea(s);
  } catch (d) {
    _("[htmlBuilder] addHeadingIds failed", d);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((u) => {
      try {
        const g = u.getAttribute && u.getAttribute("class") || u.className || "", p = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (p)
          try {
            u.setAttribute && u.setAttribute("class", p);
          } catch (f) {
            u.className = p, _("[htmlBuilder] set element class failed", f);
          }
        else
          try {
            u.removeAttribute && u.removeAttribute("class");
          } catch (f) {
            u.className = "", _("[htmlBuilder] remove element class failed", f);
          }
      } catch (g) {
        _("[htmlBuilder] code element cleanup failed", g);
      }
    });
  } catch (d) {
    _("[htmlBuilder] processing code elements failed", d);
  }
  try {
    as(s);
  } catch (d) {
    _("[htmlBuilder] observeCodeBlocks failed", d);
  }
  el(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((u) => {
      try {
        const g = u.parentElement;
        if (!g || g.tagName.toLowerCase() !== "p" || g.childNodes.length !== 1) return;
        const p = document.createElement("figure");
        p.className = "image", g.replaceWith(p), p.appendChild(u);
      } catch {
      }
    });
  } catch (d) {
    _("[htmlBuilder] wrap images in Bulma image helper failed", d);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((u) => {
      try {
        if (u.classList)
          u.classList.contains("table") || u.classList.add("table");
        else {
          const g = u.getAttribute && u.getAttribute("class") ? u.getAttribute("class") : "", p = String(g || "").split(/\s+/).filter(Boolean);
          p.indexOf("table") === -1 && p.push("table");
          try {
            u.setAttribute && u.setAttribute("class", p.join(" "));
          } catch {
            u.className = p.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (d) {
    _("[htmlBuilder] add Bulma table class failed", d);
  }
  const { topH1: l, h1Text: o, slugKey: h } = tl(a, s, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const u = a.meta.author ? String(a.meta.author).trim() : "", g = a.meta.date ? String(a.meta.date).trim() : "";
      let p = "";
      try {
        const b = new Date(g);
        g && !isNaN(b.getTime()) ? p = b.toLocaleDateString() : p = g;
      } catch {
        p = g;
      }
      const f = [];
      if (u && f.push(u), p && f.push(p), f.length) {
        const b = document.createElement("p"), m = f[0] ? String(f[0]).replace(/"/g, "").trim() : "", w = f.slice(1);
        if (b.className = "nimbi-article-subtitle is-6 has-text-grey-light", m) {
          const y = document.createElement("span");
          y.className = "nimbi-article-author", y.textContent = m, b.appendChild(y);
        }
        if (w.length) {
          const y = document.createElement("span");
          y.className = "nimbi-article-meta", y.textContent = w.join(" • "), b.appendChild(y);
        }
        try {
          l.parentElement.insertBefore(b, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", b);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await ul(s, r, n);
  } catch (d) {
    Ko("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", d), await Xr(s, r, n);
  }
  const c = Jo(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: h };
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
                Tt("[htmlBuilder] executed inline script via Function");
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
              Tt("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
            Tt("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          _("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function zi(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!oe)
      try {
        const s = document.createElement("p"), l = t && t("goHome") || "Go back to";
        s.textContent = l + " ";
        const o = document.createElement("a");
        try {
          o.href = ze(gt);
        } catch {
          o.href = ze(gt || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Un({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, oe, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const Ma = ds(() => {
  const e = cn(Qo);
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
  return Ma.get();
}
function cl(e) {
  return Ma.send(e, 2e3);
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
        const r = nt(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
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
                history.replaceState({ page: l || a }, "", ut(l || a, s));
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
            Rr(s);
          } catch (o) {
            _("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", ut(a, s));
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
function Rr(e) {
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
    const l = s || ((f) => typeof f == "string" ? f : ""), o = i || document.querySelector(".nimbi-cms"), h = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), d = a || document.querySelector(".nimbi-nav-wrap");
    let g = document.querySelector(".nimbi-scroll-top");
    if (!g) {
      g = document.createElement("button"), g.className = "nimbi-scroll-top button is-primary is-rounded is-small", g.setAttribute("aria-label", l("scrollToTop")), g.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(g) : o && o.appendChild ? o.appendChild(g) : h && h.appendChild ? h.appendChild(g) : document.body.appendChild(g);
      } catch {
        try {
          document.body.appendChild(g);
        } catch (b) {
          _("[htmlBuilder] append scroll top button failed", b);
        }
      }
      try {
        try {
          Fi(g);
        } catch {
        }
      } catch (f) {
        _("[htmlBuilder] set scroll-top button theme registration failed", f);
      }
      g.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (b) {
            _("[htmlBuilder] fallback container scrollTop failed", b);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (b) {
            _("[htmlBuilder] fallback mountEl scrollTop failed", b);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (b) {
            _("[htmlBuilder] fallback document scrollTop failed", b);
          }
        }
      });
    }
    const p = d && d.querySelector ? d.querySelector(".menu-label") : null;
    if (t) {
      if (!g._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const f = globalThis.IntersectionObserver, b = new f((m) => {
            for (const w of m)
              w.target instanceof Element && (w.isIntersecting ? (g.classList.remove("show"), p && p.classList.remove("show")) : (g.classList.add("show"), p && p.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          g._nimbiObserver = b;
        } else
          g._nimbiObserver = null;
      try {
        g._nimbiObserver && typeof g._nimbiObserver.disconnect == "function" && g._nimbiObserver.disconnect();
      } catch (f) {
        _("[htmlBuilder] observer disconnect failed", f);
      }
      try {
        g._nimbiObserver && typeof g._nimbiObserver.observe == "function" && g._nimbiObserver.observe(t);
      } catch (f) {
        _("[htmlBuilder] observer observe failed", f);
      }
      try {
        const f = () => {
          try {
            const b = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, m = t.getBoundingClientRect();
            !(m.bottom < b.top || m.top > b.bottom) ? (g.classList.remove("show"), p && p.classList.remove("show")) : (g.classList.add("show"), p && p.classList.add("show"));
          } catch (b) {
            _("[htmlBuilder] checkIntersect failed", b);
          }
        };
        f(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(f, 100);
      } catch (f) {
        _("[htmlBuilder] checkIntersect outer failed", f);
      }
    } else {
      g.classList.remove("show"), p && p.classList.remove("show");
      const f = i instanceof Element ? i : r instanceof Element ? r : window, b = () => {
        try {
          (f === window ? window.scrollY : f.scrollTop || 0) > 10 ? (g.classList.add("show"), p && p.classList.add("show")) : (g.classList.remove("show"), p && p.classList.remove("show"));
        } catch (m) {
          _("[htmlBuilder] onScroll handler failed", m);
        }
      };
      Gn(() => f.addEventListener("scroll", b)), b();
    }
  } catch (l) {
    _("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Qt(e, t) {
  try {
    if (typeof Je == "function")
      try {
        Je(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && H && typeof H.set == "function" && H.set(t, e);
  } catch {
  }
  try {
    if (Pe && typeof Pe.has == "function") {
      if (!Pe.has(t)) {
        try {
          Pe.add(t);
        } catch {
        }
        try {
          Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Oe) && !Oe.includes(t) && Oe.push(t);
      } catch {
      }
  } catch {
  }
}
function Ii(e, t) {
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
function fl(e) {
  try {
    if (!Array.isArray(e)) return e;
    e.forEach((t) => {
      try {
        if (!t || typeof t != "object") return;
        let n = typeof t.slug == "string" ? String(t.slug) : "", i = null;
        if (n && n.indexOf("::") !== -1) {
          const l = n.split("::");
          n = l[0] || "", i = l.slice(1).join("::") || null;
        }
        const r = !!(n && (n.indexOf(".") !== -1 || n.indexOf("/") !== -1));
        let a = "";
        try {
          if (t.path && typeof t.path == "string") {
            const l = K(String(t.path || ""));
            if (a = findSlugForPath(l) || (H && H.has(l) ? H.get(l) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = ue(String(t.title).trim());
              else {
                const o = l.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = ue(o || l);
              }
          } else if (r) {
            const l = String(n).replace(/\.(?:md|html?)$/i, ""), o = findSlugForPath(l) || (H && H.has(l) ? H.get(l) : "") || "";
            o ? a = o : t.title && String(t.title).trim() ? a = ue(String(t.title).trim()) : a = ue(l);
          } else
            !n && t.title && String(t.title).trim() ? a = ue(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? ue(String(t.title).trim()) : n ? ue(n) : "";
          } catch {
            a = n;
          }
        }
        let s = a || "";
        i && (s = s ? `${s}::${i}` : `${ue(i)}`), s && (t.slug = s);
        try {
          if (t.path && s) {
            const l = String(s).split("::")[0];
            try {
              Qt(l, K(String(t.path || "")));
            } catch {
            }
          }
        } catch {
        }
      } catch {
      }
    });
  } catch {
  }
  return e;
}
async function pl(e, t, n, i, r, a, s, l, o = "eager", h = 1, c = void 0, d = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const u = typeof DOMParser < "u" ? new DOMParser() : null, g = u ? u.parseFromString(n || "", "text/html") : null, p = g ? g.querySelectorAll("a") : [];
  await Gn(() => nl(p, i)), await Gn(() => rl(p, i));
  try {
    Te(p, i);
  } catch {
  }
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let f = null, b = null, m = null, w = null, y = null, k = null, S = !1, v = null;
  const C = /* @__PURE__ */ new Map();
  function Z() {
    try {
      const R = document.querySelector(".navbar-burger"), N = R && R.dataset ? R.dataset.target : null, M = N ? document.getElementById(N) : null;
      R && R.classList.contains("is-active") && (R.classList.remove("is-active"), R.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active"));
    } catch (R) {
      _("[nimbi-cms] closeMobileMenu failed", R);
    }
  }
  async function I() {
    const R = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      R && R.classList.add("is-inactive");
    } catch {
    }
    try {
      const N = s && s();
      N && typeof N.then == "function" && await N;
    } catch (N) {
      try {
        _("[nimbi-cms] renderByQuery failed", N);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              R && R.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            R && R.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          R && R.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function ee(R) {
    try {
      let N = R && typeof R.slug == "string" ? String(R.slug) : "", M = null;
      try {
        N && N.indexOf("::") !== -1 && (M = N.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (R && R.path && typeof R.path == "string") {
          const L = K(String(R.path || "")), T = L.replace(/^.*\//, "");
          try {
            if (C && C.has(L)) return { page: C.get(L), hash: M };
            if (C && C.has(T)) return { page: C.get(T), hash: M };
          } catch {
          }
          try {
            if (H && H.has(L)) return { page: H.get(L), hash: M };
          } catch {
          }
          try {
            const O = ie(L);
            if (O) return { page: O, hash: M };
          } catch {
          }
        }
      } catch {
      }
      if (N && N.indexOf("::") !== -1) {
        const L = N.split("::");
        N = L[0] || "", M = L.slice(1).join("::") || null;
      }
      if (N && (N.includes(".") || N.includes("/"))) {
        const L = K(R && R.path ? String(R.path) : N), T = L.replace(/^.*\//, "");
        try {
          if (C && C.has(L)) return { page: C.get(L), hash: M };
          if (C && C.has(T)) return { page: C.get(T), hash: M };
        } catch {
        }
        try {
          let O = ie(L);
          if (!O)
            try {
              const W = String(L || "").replace(/^\/+/, ""), P = W.replace(/^.*\//, "");
              for (const [B, E] of V.entries())
                try {
                  let q = null;
                  if (typeof E == "string" ? q = K(String(E || "")) : E && typeof E == "object" && (E.default ? q = K(String(E.default || "")) : q = null), !q) continue;
                  if (q === W || q.endsWith("/" + W) || W.endsWith("/" + q) || q.endsWith(P) || W.endsWith(P)) {
                    O = B;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if (O) N = O;
          else
            try {
              const W = String(N).replace(/\.(?:md|html?)$/i, "");
              N = ue(W || L);
            } catch {
              N = ue(L);
            }
        } catch {
          N = ue(L);
        }
      }
      return !N && R && R.path && (N = ue(K(String(R.path || "")))), { page: N, hash: M };
    } catch {
      return { page: R && R.slug || "", hash: null };
    }
  }
  const $ = () => f || (f = (async () => {
    try {
      const R = await Promise.resolve().then(() => lt), N = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, M = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, L = Ii(R, "buildSearchIndex"), T = Ii(R, "buildSearchIndexWorker"), O = typeof N == "function" ? N : L || void 0, W = typeof M == "function" ? M : T || void 0;
      $t("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof O + " workerFn=" + typeof W + " (global preferred)");
      const P = [];
      try {
        r && P.push(r);
      } catch {
      }
      try {
        navigationPage && P.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof W == "function")
        try {
          const B = await W(i, h, c, P.length ? P : void 0);
          if (B && B.length) {
            try {
              if (R && typeof R._setSearchIndex == "function")
                try {
                  R._setSearchIndex(B);
                } catch {
                }
            } catch {
            }
            return B;
          }
        } catch (B) {
          _("[nimbi-cms] worker builder threw", B);
        }
      return typeof O == "function" ? ($t("[nimbi-cms test] calling buildFn"), await O(i, h, c, P.length ? P : void 0)) : [];
    } catch (R) {
      return _("[nimbi-cms] buildSearchIndex failed", R), [];
    } finally {
      if (b) {
        try {
          b.removeAttribute("disabled");
        } catch {
        }
        try {
          m && m.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), f.then((R) => {
    try {
      try {
        v = Array.isArray(R) ? R : null;
      } catch {
        v = null;
      }
      try {
        fl(R);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const T = await Promise.resolve().then(() => lt);
                try {
                  try {
                    T && typeof T._setSearchIndex == "function" && T._setSearchIndex(Array.isArray(R) ? R : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(v) ? v : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = T && Array.isArray(T.searchIndex) ? T.searchIndex : Array.isArray(v) ? v : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(te) ? te : Array.isArray(v) ? v : [];
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
      const N = String(b && b.value || "").trim().toLowerCase();
      if (!N || !Array.isArray(R) || !R.length) return;
      const M = R.filter((T) => T.title && T.title.toLowerCase().includes(N) || T.excerpt && T.excerpt.toLowerCase().includes(N));
      if (!M || !M.length) return;
      const L = document.getElementById("nimbi-search-results");
      if (!L) return;
      L.innerHTML = "";
      try {
        const T = document.createElement("div");
        T.className = "panel nimbi-search-panel", M.slice(0, 10).forEach((O) => {
          try {
            if (O.parentTitle) {
              const E = document.createElement("p");
              E.className = "panel-heading nimbi-search-title nimbi-search-parent", E.textContent = O.parentTitle, T.appendChild(E);
            }
            const W = document.createElement("a");
            W.className = "panel-block nimbi-search-result";
            const P = ee(O);
            W.href = ze(P.page, P.hash), W.setAttribute("role", "button");
            try {
              if (O.path && typeof O.path == "string")
                try {
                  Qt(P.page, O.path);
                } catch {
                }
            } catch {
            }
            const B = document.createElement("div");
            B.className = "is-size-6 has-text-weight-semibold", B.textContent = O.title, W.appendChild(B), W.addEventListener("click", () => {
              try {
                L.style.display = "none";
              } catch {
              }
            }), T.appendChild(W);
          } catch {
          }
        }), L.appendChild(T);
        try {
          L.style.display = "block";
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
        const R = await Promise.resolve().then(() => wn);
        try {
          await R.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
        } catch (N) {
          _("[nimbi-cms] sitemap trigger failed", N);
        }
      } catch (R) {
        try {
          _("[nimbi-cms] sitemap dynamic import failed", R);
        } catch {
        }
      }
    })();
  }), f), D = document.createElement("nav");
  D.className = "navbar", D.setAttribute("role", "navigation"), D.setAttribute("aria-label", "main navigation");
  const ne = document.createElement("div");
  ne.className = "navbar-brand";
  const j = p[0], re = document.createElement("a");
  if (re.className = "navbar-item", j) {
    const R = j.getAttribute("href") || "#";
    try {
      const M = new URL(R, location.href).searchParams.get("page"), L = M ? decodeURIComponent(M) : r;
      let T = null;
      try {
        typeof L == "string" && (/(?:\.md|\.html?)$/i.test(L) || L.includes("/")) && (T = ie(L));
      } catch {
      }
      !T && typeof L == "string" && !String(L).includes(".") && (T = L);
      const O = T || L;
      re.href = ze(O), (!re.textContent || !String(re.textContent).trim()) && (re.textContent = a("home"));
    } catch {
      try {
        const M = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? ie(r) : typeof r == "string" && !r.includes(".") ? r : null;
        re.href = ze(M || r);
      } catch {
        re.href = ze(r);
      }
      re.textContent = a("home");
    }
  } else
    re.href = ze(r), re.textContent = a("home");
  async function A(R) {
    try {
      if (!R || R === "none") return null;
      if (R === "favicon")
        try {
          const N = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!N) return null;
          const M = N.getAttribute("href") || "";
          return M && /\.png(?:\?|$)/i.test(M) ? new URL(M, location.href).toString() : null;
        } catch {
          return null;
        }
      if (R === "copy-first" || R === "move-first")
        try {
          const N = await Me(r, i);
          if (!N || !N.raw) return null;
          const T = new DOMParser().parseFromString(N.raw, "text/html").querySelector("img");
          if (!T) return null;
          const O = T.getAttribute("src") || "";
          if (!O) return null;
          const W = new URL(O, location.href).toString();
          if (R === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", W);
            } catch {
            }
          return W;
        } catch {
          return null;
        }
      try {
        return new URL(R, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let G = null;
  try {
    G = await A(d);
  } catch {
    G = null;
  }
  if (G)
    try {
      const R = document.createElement("img");
      R.className = "nimbi-navbar-logo";
      const N = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      R.alt = N, R.title = N, R.src = G;
      try {
        R.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!re.textContent || !String(re.textContent).trim()) && (re.textContent = N);
      } catch {
      }
      try {
        re.insertBefore(R, re.firstChild);
      } catch {
        try {
          re.appendChild(R);
        } catch {
        }
      }
    } catch {
    }
  ne.appendChild(re), re.addEventListener("click", function(R) {
    const N = re.getAttribute("href") || "";
    if (N.startsWith("?page=")) {
      R.preventDefault();
      const M = new URL(N, location.href), L = M.searchParams.get("page"), T = M.hash ? M.hash.replace(/^#/, "") : null;
      history.pushState({ page: L }, "", ze(L, T)), I();
      try {
        Z();
      } catch {
      }
    }
  });
  function ie(R) {
    try {
      if (!R) return null;
      const N = K(String(R || ""));
      try {
        if (H && H.has(N)) return H.get(N);
      } catch {
      }
      const M = N.replace(/^.*\//, "");
      try {
        if (H && H.has(M)) return H.get(M);
      } catch {
      }
      try {
        for (const [L, T] of V.entries())
          if (T) {
            if (typeof T == "string") {
              if (K(T) === N) return L;
            } else if (T && typeof T == "object") {
              if (T.default && K(T.default) === N) return L;
              const O = T.langs || {};
              for (const W in O)
                if (O[W] && K(O[W]) === N) return L;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function Te(R, N) {
    try {
      if (!R || !R.length) return;
      const M = [];
      for (let P = 0; P < R.length; P++)
        try {
          const B = R[P];
          if (!B || typeof B.getAttribute != "function") continue;
          const E = B.getAttribute("href") || "";
          if (!E || kr(E)) continue;
          let q = null;
          try {
            const fe = nt(E);
            fe && fe.page && (q = fe.page);
          } catch {
          }
          if (!q) {
            const fe = String(E || "").split(/[?#]/, 1), Ae = fe && fe[0] ? fe[0] : E;
            (/\.(?:md|html?)$/i.test(Ae) || Ae.indexOf("/") !== -1) && (q = K(String(Ae || "")));
          }
          if (!q) continue;
          const Q = K(String(q || "")), U = Q.replace(/^.*\//, "");
          let pe = null;
          try {
            C && C.has(Q) && (pe = C.get(Q));
          } catch {
          }
          try {
            !pe && H && H.has(Q) && (pe = H.get(Q));
          } catch {
          }
          if (pe) continue;
          let Re = null;
          try {
            Re = B.textContent && String(B.textContent).trim() ? String(B.textContent).trim() : null;
          } catch {
            Re = null;
          }
          let ye = null;
          if (Re) ye = ue(Re);
          else {
            const fe = U.replace(/\.(?:md|html?)$/i, "");
            ye = ue(fe || Q);
          }
          if (ye)
            try {
              M.push({ path: Q, candidate: ye });
            } catch {
            }
        } catch {
        }
      if (!M.length) return;
      const L = 3;
      let T = 0;
      const O = async () => {
        for (; T < M.length; ) {
          const P = M[T++];
          if (!(!P || !P.path))
            try {
              const B = await Me(P.path, N);
              if (!B || !B.raw) continue;
              let E = null;
              if (B.isHtml)
                try {
                  const Q = new DOMParser().parseFromString(B.raw, "text/html"), U = Q.querySelector("h1") || Q.querySelector("title");
                  U && U.textContent && (E = String(U.textContent).trim());
                } catch {
                }
              else
                try {
                  const q = B.raw.match(/^#\s+(.+)$/m);
                  q && q[1] && (E = String(q[1]).trim());
                } catch {
                }
              if (E) {
                const q = ue(E);
                if (q && q !== P.candidate) {
                  try {
                    Qt(q, P.path);
                  } catch {
                  }
                  try {
                    C.set(P.path, q);
                  } catch {
                  }
                  try {
                    C.set(P.path.replace(/^.*\//, ""), q);
                  } catch {
                  }
                  try {
                    const Q = await Promise.resolve().then(() => lt);
                    try {
                      if (Array.isArray(Q.searchIndex)) {
                        let U = !1;
                        for (const pe of Q.searchIndex)
                          try {
                            if (pe && pe.path === P.path && pe.slug) {
                              const ye = String(pe.slug).split("::").slice(1).join("::");
                              pe.slug = ye ? `${q}::${ye}` : q, U = !0;
                            }
                          } catch {
                          }
                        try {
                          U && typeof Q._setSearchIndex == "function" && Q._setSearchIndex(Q.searchIndex);
                        } catch {
                        }
                      }
                    } catch {
                    }
                  } catch {
                  }
                }
              }
            } catch {
            }
        }
      }, W = [];
      for (let P = 0; P < L; P++) W.push(O());
      try {
        await Promise.all(W);
      } catch {
      }
    } catch {
    }
  }
  const Y = document.createElement("a");
  Y.className = "navbar-burger", Y.setAttribute("role", "button"), Y.setAttribute("aria-label", "menu"), Y.setAttribute("aria-expanded", "false");
  const ge = "nimbi-navbar-menu";
  Y.dataset.target = ge, Y.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', ne.appendChild(Y);
  try {
    Y.addEventListener("click", (R) => {
      try {
        const N = Y.dataset && Y.dataset.target ? Y.dataset.target : null, M = N ? document.getElementById(N) : null;
        Y.classList.contains("is-active") ? (Y.classList.remove("is-active"), Y.setAttribute("aria-expanded", "false"), M && M.classList.remove("is-active")) : (Y.classList.add("is-active"), Y.setAttribute("aria-expanded", "true"), M && M.classList.add("is-active"));
      } catch (N) {
        _("[nimbi-cms] navbar burger toggle failed", N);
      }
    });
  } catch (R) {
    _("[nimbi-cms] burger event binding failed", R);
  }
  const Se = document.createElement("div");
  Se.className = "navbar-menu", Se.id = ge;
  const $e = document.createElement("div");
  $e.className = "navbar-start";
  let Qe = null, ve = null;
  if (!l)
    Qe = null, b = null, w = null, y = null, k = null;
  else {
    Qe = document.createElement("div"), Qe.className = "navbar-end", ve = document.createElement("div"), ve.className = "navbar-item", b = document.createElement("input"), b.className = "input", b.type = "search", b.placeholder = a("searchPlaceholder") || "", b.id = "nimbi-search";
    try {
      const T = (a && typeof a == "function" ? a("searchAria") : null) || b.placeholder || "Search";
      try {
        b.setAttribute("aria-label", T);
      } catch {
      }
      try {
        b.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        b.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        b.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    o === "eager" && (b.disabled = !0), m = document.createElement("div"), m.className = "control", o === "eager" && m.classList.add("is-loading"), m.appendChild(b), ve.appendChild(m), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const R = document.createElement("div");
    R.className = "dropdown-trigger", R.appendChild(ve);
    const N = document.createElement("div");
    N.className = "dropdown-menu", N.setAttribute("role", "menu"), y = document.createElement("div"), y.id = "nimbi-search-results", y.className = "dropdown-content nimbi-search-results", k = y, N.appendChild(y), w.appendChild(R), w.appendChild(N), Qe.appendChild(w);
    const M = (T) => {
      if (!y) return;
      y.innerHTML = "";
      let O = -1;
      function W(E) {
        try {
          const q = y.querySelector(".nimbi-search-result.is-selected");
          q && q.classList.remove("is-selected");
          const Q = y.querySelectorAll(".nimbi-search-result");
          if (!Q || !Q.length) return;
          if (E < 0) {
            O = -1;
            return;
          }
          E >= Q.length && (E = Q.length - 1);
          const U = Q[E];
          if (U) {
            U.classList.add("is-selected"), O = E;
            try {
              U.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function P(E) {
        try {
          const q = E.key, Q = y.querySelectorAll(".nimbi-search-result");
          if (!Q || !Q.length) return;
          if (q === "ArrowDown") {
            E.preventDefault();
            const U = O < 0 ? 0 : Math.min(Q.length - 1, O + 1);
            W(U);
            return;
          }
          if (q === "ArrowUp") {
            E.preventDefault();
            const U = O <= 0 ? 0 : O - 1;
            W(U);
            return;
          }
          if (q === "Enter") {
            E.preventDefault();
            const U = y.querySelector(".nimbi-search-result.is-selected") || y.querySelector(".nimbi-search-result");
            if (U)
              try {
                U.click();
              } catch {
              }
            return;
          }
          if (q === "Escape") {
            try {
              w.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              y.style.display = "none";
            } catch {
            }
            try {
              y.classList.remove("is-open");
            } catch {
            }
            try {
              y.removeAttribute("tabindex");
            } catch {
            }
            try {
              y.removeEventListener("keydown", P);
            } catch {
            }
            try {
              b && b.focus();
            } catch {
            }
            try {
              b && b.removeEventListener("keydown", B);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function B(E) {
        try {
          if (E && E.key === "ArrowDown") {
            E.preventDefault();
            try {
              y.focus();
            } catch {
            }
            W(0);
          }
        } catch {
        }
      }
      try {
        const E = document.createElement("div");
        E.className = "panel nimbi-search-panel";
        const q = document.createDocumentFragment();
        T.forEach((Q) => {
          if (Q.parentTitle) {
            const ye = document.createElement("p");
            ye.textContent = Q.parentTitle, ye.className = "panel-heading nimbi-search-title nimbi-search-parent", q.appendChild(ye);
          }
          const U = document.createElement("a");
          U.className = "panel-block nimbi-search-result";
          const pe = ee(Q);
          U.href = ze(pe.page, pe.hash), U.setAttribute("role", "button");
          try {
            if (Q.path && typeof Q.path == "string")
              try {
                Qt(pe.page, Q.path);
              } catch {
              }
          } catch {
          }
          const Re = document.createElement("div");
          Re.className = "is-size-6 has-text-weight-semibold", Re.textContent = Q.title, U.appendChild(Re), U.addEventListener("click", (ye) => {
            try {
              try {
                ye && ye.preventDefault && ye.preventDefault();
              } catch {
              }
              try {
                ye && ye.stopPropagation && ye.stopPropagation();
              } catch {
              }
              if (w) {
                w.classList.remove("is-active");
                try {
                  document.documentElement.classList.remove("nimbi-search-open");
                } catch {
                }
              }
              try {
                y.style.display = "none";
              } catch {
              }
              try {
                y.classList.remove("is-open");
              } catch {
              }
              try {
                y.removeAttribute("tabindex");
              } catch {
              }
              try {
                y.removeEventListener("keydown", P);
              } catch {
              }
              try {
                b && b.removeEventListener("keydown", B);
              } catch {
              }
              try {
                const fe = U.getAttribute && U.getAttribute("href") || "";
                let Ae = null, Ze = null;
                try {
                  const qe = new URL(fe, location.href);
                  Ae = qe.searchParams.get("page"), Ze = qe.hash ? qe.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Ae)
                  try {
                    history.pushState({ page: Ae }, "", ze(Ae, Ze));
                    try {
                      I();
                    } catch {
                      try {
                        typeof window < "u" && typeof window.renderByQuery == "function" && window.renderByQuery();
                      } catch {
                      }
                    }
                    return;
                  } catch {
                  }
              } catch {
              }
              try {
                window.location.href = U.href;
              } catch {
              }
            } catch {
            }
          }), q.appendChild(U);
        }), E.appendChild(q), y.appendChild(E);
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
        y.style.display = "block";
      } catch {
      }
      try {
        y.classList.add("is-open");
      } catch {
      }
      try {
        y.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        y.addEventListener("keydown", P);
      } catch {
      }
      try {
        b && b.addEventListener("keydown", B);
      } catch {
      }
    }, L = (T, O) => {
      let W = null;
      return (...P) => {
        W && clearTimeout(W), W = setTimeout(() => T(...P), O);
      };
    };
    if (b) {
      const T = L(async () => {
        const O = document.querySelector("input#nimbi-search"), W = String(O && O.value || "").trim().toLowerCase();
        if (!W) {
          M([]);
          return;
        }
        try {
          await $();
          const P = await f, B = Array.isArray(P) ? P.filter((E) => E.title && E.title.toLowerCase().includes(W) || E.excerpt && E.excerpt.toLowerCase().includes(W)) : [];
          M(B.slice(0, 10));
        } catch (P) {
          _("[nimbi-cms] search input handler failed", P), M([]);
        }
      }, 50);
      try {
        b.addEventListener("input", T);
      } catch {
      }
      try {
        document.addEventListener("input", (O) => {
          try {
            O && O.target && O.target.id === "nimbi-search" && T(O);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        f = $();
      } catch (T) {
        _("[nimbi-cms] eager search index init failed", T), f = Promise.resolve([]);
      }
      f.finally(() => {
        const T = document.querySelector("input#nimbi-search");
        if (T) {
          try {
            T.removeAttribute("disabled");
          } catch {
          }
          try {
            m && m.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (S) return;
            S = !0;
            const O = await f.catch(() => []), W = await Promise.resolve().then(() => wn);
            try {
              await W.handleSitemapRequest({ index: Array.isArray(O) ? O : void 0, homePage: r, contentBase: i, indexDepth: h, noIndexing: c, includeAllMarkdown: !0 });
            } catch (P) {
              _("[nimbi-cms] sitemap trigger failed", P);
            }
          } catch (O) {
            try {
              _("[nimbi-cms] sitemap dynamic import failed", O);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const T = (O) => {
        try {
          const W = O && O.target;
          if (!k || !k.classList.contains("is-open") && k.style && k.style.display !== "block" || W && (k.contains(W) || b && (W === b || b.contains && b.contains(W)))) return;
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
      document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
    } catch {
    }
  }
  const rt = document.createDocumentFragment();
  for (let R = 0; R < p.length; R++) {
    const N = p[R];
    if (R === 0) continue;
    const M = N.getAttribute("href") || "#";
    let L = M;
    const T = document.createElement("a");
    T.className = "navbar-item";
    try {
      let O = null;
      try {
        O = nt(String(M || ""));
      } catch {
        O = null;
      }
      let W = null, P = null;
      if (O && (O.type === "canonical" && O.page || O.type === "cosmetic" && O.page) && (W = O.page, P = O.anchor), W && (/\.(?:md|html?)$/i.test(W) || W.includes("/") ? L = W : T.href = ze(W, P)), /^[^#]*\.md(?:$|[#?])/.test(L) || L.endsWith(".md")) {
        const E = K(L).split(/::|#/, 2), q = E[0], Q = E[1], U = ie(q);
        U ? T.href = ze(U, Q) : T.href = ze(q, Q);
      } else if (/\.html(?:$|[#?])/.test(L) || L.endsWith(".html")) {
        const E = K(L).split(/::|#/, 2);
        let q = E[0];
        q && !q.toLowerCase().endsWith(".html") && (q = q + ".html");
        const Q = E[1], U = ie(q);
        if (U)
          T.href = ze(U, Q);
        else
          try {
            const pe = await Me(q, i);
            if (pe && pe.raw)
              try {
                const ye = new DOMParser().parseFromString(pe.raw, "text/html"), fe = ye.querySelector("title"), Ae = ye.querySelector("h1"), Ze = fe && fe.textContent && fe.textContent.trim() ? fe.textContent.trim() : Ae && Ae.textContent ? Ae.textContent.trim() : null;
                if (Ze) {
                  const qe = ue(Ze);
                  if (qe) {
                    try {
                      Qt(qe, q);
                    } catch (mt) {
                      _("[nimbi-cms] slugToMd/mdToSlug set failed", mt);
                    }
                    T.href = ze(qe, Q);
                  } else
                    T.href = ze(q, Q);
                } else
                  T.href = ze(q, Q);
              } catch {
                T.href = ze(q, Q);
              }
            else
              T.href = L;
          } catch {
            T.href = L;
          }
      } else
        T.href = L;
    } catch (O) {
      _("[nimbi-cms] nav item href parse failed", O), T.href = L;
    }
    try {
      const O = N.textContent && String(N.textContent).trim() ? String(N.textContent).trim() : null;
      if (O)
        try {
          const W = ue(O);
          if (W) {
            const P = T.getAttribute("href") || "";
            let B = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(P))
              B = K(String(P || "").split(/[?#]/)[0]);
            else
              try {
                const E = nt(P);
                E && E.type === "canonical" && E.page && (B = K(E.page));
              } catch {
              }
            if (B) {
              let E = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String(B || "")))
                  E = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String(B || "")))
                  E = !1;
                else {
                  const q = String(B || "").replace(/^\.\//, ""), Q = q.replace(/^.*\//, "");
                  Pe && Pe.size && (Pe.has(q) || Pe.has(Q)) && (E = !0);
                }
              } catch {
                E = !1;
              }
              if (E)
                try {
                  const q = K(String(B || "").split(/[?#]/)[0]);
                  let Q = !1;
                  try {
                    ie && typeof ie == "function" && ie(q) && (Q = !0);
                  } catch {
                  }
                  try {
                    Qt(W, B);
                  } catch {
                  }
                  try {
                    if (q) {
                      try {
                        C.set(q, W);
                      } catch {
                      }
                      try {
                        const U = q.replace(/^.*\//, "");
                        U && C.set(U, W);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Q)
                    try {
                      T.href = ze(W);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (W) {
          _("[nimbi-cms] nav slug mapping failed", W);
        }
    } catch (O) {
      _("[nimbi-cms] nav slug mapping failed", O);
    }
    T.textContent = N.textContent || L, rt.appendChild(T);
  }
  try {
    $e.appendChild(rt);
  } catch {
  }
  Se.appendChild($e), Qe && Se.appendChild(Qe), D.appendChild(ne), D.appendChild(Se), e.appendChild(D);
  try {
    const R = (N) => {
      try {
        const M = D && D.querySelector ? D.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!M || !M.classList.contains("is-active")) return;
        const L = M && M.closest ? M.closest(".navbar") : D;
        if (L && L.contains(N.target)) return;
        Z();
      } catch {
      }
    };
    document.addEventListener("click", R, !0), document.addEventListener("touchstart", R, !0);
  } catch {
  }
  try {
    Se.addEventListener("click", (R) => {
      const N = R.target && R.target.closest ? R.target.closest("a") : null;
      if (!N) return;
      const M = N.getAttribute("href") || "";
      try {
        const L = new URL(M, location.href), T = L.searchParams.get("page"), O = L.hash ? L.hash.replace(/^#/, "") : null;
        T && (R.preventDefault(), history.pushState({ page: T }, "", ze(T, O)), I());
      } catch (L) {
        _("[nimbi-cms] navbar click handler failed", L);
      }
      try {
        const L = D && D.querySelector ? D.querySelector(".navbar-burger") : null, T = L && L.dataset ? L.dataset.target : null, O = T ? document.getElementById(T) : null;
        L && L.classList.contains("is-active") && (L.classList.remove("is-active"), L.setAttribute("aria-expanded", "false"), O && O.classList.remove("is-active"));
      } catch (L) {
        _("[nimbi-cms] mobile menu close failed", L);
      }
    });
  } catch (R) {
    _("[nimbi-cms] attach content click handler failed", R);
  }
  try {
    t.addEventListener("click", (R) => {
      const N = R.target && R.target.closest ? R.target.closest("a") : null;
      if (!N) return;
      const M = N.getAttribute("href") || "";
      if (M && !kr(M))
        try {
          const L = new URL(M, location.href), T = L.searchParams.get("page"), O = L.hash ? L.hash.replace(/^#/, "") : null;
          T && (R.preventDefault(), history.pushState({ page: T }, "", ze(T, O)), I());
        } catch (L) {
          _("[nimbi-cms] container click URL parse failed", L);
        }
    });
  } catch (R) {
    _("[nimbi-cms] build navbar failed", R);
  }
  return { navbar: D, linkEls: p };
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
let Ye = null, he = null, We = 1, _t = (e, t) => t, mn = 0, yn = 0, Fn = () => {
}, ln = 0.25;
function gl() {
  if (Ye && document.contains(Ye)) return Ye;
  Ye = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", _t("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
    A.target === e && br();
  }), e.addEventListener("wheel", (A) => {
    if (!ee()) return;
    A.preventDefault();
    const G = A.deltaY < 0 ? ln : -ln;
    At(We + G), h(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (A) => {
    if (A.key === "Escape") {
      br();
      return;
    }
    if (We > 1) {
      const G = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!G) return;
      const ie = 40;
      switch (A.key) {
        case "ArrowUp":
          G.scrollTop -= ie, A.preventDefault();
          break;
        case "ArrowDown":
          G.scrollTop += ie, A.preventDefault();
          break;
        case "ArrowLeft":
          G.scrollLeft -= ie, A.preventDefault();
          break;
        case "ArrowRight":
          G.scrollLeft += ie, A.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Ye = e, he = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function h() {
    l && (l.textContent = `${Math.round(We * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(We * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  Fn = h, i.addEventListener("click", () => {
    At(We + ln), h(), c();
  }), r.addEventListener("click", () => {
    At(We - ln), h(), c();
  }), t.addEventListener("click", () => {
    bn(), h(), c();
  }), n.addEventListener("click", () => {
    At(1), h(), c();
  }), a.addEventListener("click", () => {
    bn(), h(), c();
  }), s.addEventListener("click", br), t.title = _t("imagePreviewFit", "Fit to screen"), n.title = _t("imagePreviewOriginal", "Original size"), r.title = _t("imagePreviewZoomOut", "Zoom out"), i.title = _t("imagePreviewZoomIn", "Zoom in"), s.title = _t("imagePreviewClose", "Close"), s.setAttribute("aria-label", _t("imagePreviewClose", "Close"));
  let d = !1, u = 0, g = 0, p = 0, f = 0;
  const b = /* @__PURE__ */ new Map();
  let m = 0, w = 1;
  const y = (A, G) => {
    const ie = A.x - G.x, Te = A.y - G.y;
    return Math.hypot(ie, Te);
  }, k = () => {
    d = !1, b.clear(), m = 0, he && (he.classList.add("is-panning"), he.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, C = 0;
  const Z = (A) => {
    const G = Date.now(), ie = G - S, Te = A.clientX - v, Y = A.clientY - C;
    S = G, v = A.clientX, C = A.clientY, ie < 300 && Math.hypot(Te, Y) < 30 && (At(We > 1 ? 1 : 2), h(), A.preventDefault());
  }, I = (A) => {
    At(We > 1 ? 1 : 2), h(), A.preventDefault();
  }, ee = () => Ye ? typeof Ye.open == "boolean" ? Ye.open : Ye.classList.contains("is-active") : !1, $ = (A, G, ie = 1) => {
    if (b.has(ie) && b.set(ie, { x: A, y: G }), b.size === 2) {
      const Se = Array.from(b.values()), $e = y(Se[0], Se[1]);
      if (m > 0) {
        const Qe = $e / m;
        At(w * Qe);
      }
      return;
    }
    if (!d) return;
    const Te = he.closest(".nimbi-image-preview__image-wrapper");
    if (!Te) return;
    const Y = A - u, ge = G - g;
    Te.scrollLeft = p - Y, Te.scrollTop = f - ge;
  }, D = (A, G, ie = 1) => {
    if (!ee()) return;
    if (b.set(ie, { x: A, y: G }), b.size === 2) {
      const ge = Array.from(b.values());
      m = y(ge[0], ge[1]), w = We;
      return;
    }
    const Te = he.closest(".nimbi-image-preview__image-wrapper");
    !Te || !(Te.scrollWidth > Te.clientWidth || Te.scrollHeight > Te.clientHeight) || (d = !0, u = A, g = G, p = Te.scrollLeft, f = Te.scrollTop, he.classList.add("is-panning"), he.classList.remove("is-grabbing"), window.addEventListener("pointermove", ne), window.addEventListener("pointerup", j), window.addEventListener("pointercancel", j));
  }, ne = (A) => {
    d && (A.preventDefault(), $(A.clientX, A.clientY, A.pointerId));
  }, j = () => {
    k(), window.removeEventListener("pointermove", ne), window.removeEventListener("pointerup", j), window.removeEventListener("pointercancel", j);
  };
  he.addEventListener("pointerdown", (A) => {
    A.preventDefault(), D(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointermove", (A) => {
    (d || b.size === 2) && A.preventDefault(), $(A.clientX, A.clientY, A.pointerId);
  }), he.addEventListener("pointerup", (A) => {
    A.preventDefault(), A.pointerType === "touch" && Z(A), k();
  }), he.addEventListener("dblclick", I), he.addEventListener("pointercancel", k), he.addEventListener("mousedown", (A) => {
    A.preventDefault(), D(A.clientX, A.clientY, 1);
  }), he.addEventListener("mousemove", (A) => {
    d && A.preventDefault(), $(A.clientX, A.clientY, 1);
  }), he.addEventListener("mouseup", (A) => {
    A.preventDefault(), k();
  });
  const re = e.querySelector(".nimbi-image-preview__image-wrapper");
  return re && (re.addEventListener("pointerdown", (A) => {
    if (D(A.clientX, A.clientY, A.pointerId), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), re.addEventListener("pointermove", (A) => {
    $(A.clientX, A.clientY, A.pointerId);
  }), re.addEventListener("pointerup", k), re.addEventListener("pointercancel", k), re.addEventListener("mousedown", (A) => {
    if (D(A.clientX, A.clientY, 1), A && A.target && A.target.tagName === "IMG")
      try {
        A.target.classList.add("is-grabbing");
      } catch {
      }
  }), re.addEventListener("mousemove", (A) => {
    $(A.clientX, A.clientY, 1);
  }), re.addEventListener("mouseup", k)), e;
}
function At(e) {
  if (!he) return;
  const t = Number(e);
  We = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = he.getBoundingClientRect(), r = mn || he.naturalWidth || he.width || i.width || 0, a = yn || he.naturalHeight || he.height || i.height || 0;
  if (r && a) {
    he.style.setProperty("--nimbi-preview-img-max-width", "none"), he.style.setProperty("--nimbi-preview-img-max-height", "none"), he.style.setProperty("--nimbi-preview-img-width", `${r * We}px`), he.style.setProperty("--nimbi-preview-img-height", `${a * We}px`), he.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      he.style.width = `${r * We}px`, he.style.height = `${a * We}px`, he.style.transform = "none";
    } catch {
    }
  } else {
    he.style.setProperty("--nimbi-preview-img-max-width", ""), he.style.setProperty("--nimbi-preview-img-max-height", ""), he.style.setProperty("--nimbi-preview-img-width", ""), he.style.setProperty("--nimbi-preview-img-height", ""), he.style.setProperty("--nimbi-preview-img-transform", `scale(${We})`);
    try {
      he.style.transform = `scale(${We})`;
    } catch {
    }
  }
  he && (he.classList.add("is-panning"), he.classList.remove("is-grabbing"));
}
function bn() {
  if (!he) return;
  const e = he.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = mn || he.naturalWidth || t.width, i = yn || he.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  At(Number.isFinite(s) ? s : 1);
}
function ml(e, t = "", n = 0, i = 0) {
  const r = gl();
  We = 1, mn = n || 0, yn = i || 0, he.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", h = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = _t("imagePreviewDefaultAlt", h || "Image");
      } catch {
        t = _t("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  he.alt = t, he.style.transform = "scale(1)";
  const a = () => {
    mn = he.naturalWidth || he.width || 0, yn = he.naturalHeight || he.height || 0;
  };
  if (a(), bn(), Fn(), requestAnimationFrame(() => {
    bn(), Fn();
  }), !mn || !yn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        bn(), Fn();
      }), he.removeEventListener("load", s);
    };
    he.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function br() {
  if (Ye) {
    typeof Ye.close == "function" && Ye.open && Ye.close(), Ye.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function yl(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  _t = (g, p) => (typeof t == "function" ? t(g) : void 0) || p, ln = n, e.addEventListener("click", (g) => {
    const p = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!p || p.tagName !== "IMG") return;
    const f = (
      /** @type {HTMLImageElement} */
      p
    );
    if (!f.src) return;
    const b = f.closest("a");
    b && b.getAttribute("href") || ml(f.src, f.alt || "", f.naturalWidth || 0, f.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let h = 0, c = 1;
  const d = (g, p) => {
    const f = g.x - p.x, b = g.y - p.y;
    return Math.hypot(f, b);
  };
  e.addEventListener("pointerdown", (g) => {
    const p = (
      /** @type {HTMLElement} */
      g.target
    );
    if (!p || p.tagName !== "IMG") return;
    const f = p.closest("a");
    if (f && f.getAttribute("href") || !Ye || !Ye.open) return;
    if (o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      const m = Array.from(o.values());
      h = d(m[0], m[1]), c = We;
      return;
    }
    const b = p.closest(".nimbi-image-preview__image-wrapper");
    if (b && !(We <= 1)) {
      g.preventDefault(), i = !0, r = g.clientX, a = g.clientY, s = b.scrollLeft, l = b.scrollTop, p.setPointerCapture(g.pointerId);
      try {
        p.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (g) => {
    if (o.has(g.pointerId) && o.set(g.pointerId, { x: g.clientX, y: g.clientY }), o.size === 2) {
      g.preventDefault();
      const y = Array.from(o.values()), k = d(y[0], y[1]);
      if (h > 0) {
        const S = k / h;
        At(c * S);
      }
      return;
    }
    if (!i) return;
    g.preventDefault();
    const p = (
      /** @type {HTMLElement} */
      g.target
    ), f = p.closest && p.closest("a");
    if (f && f.getAttribute && f.getAttribute("href")) return;
    const b = p.closest(".nimbi-image-preview__image-wrapper");
    if (!b) return;
    const m = g.clientX - r, w = g.clientY - a;
    b.scrollLeft = s - m, b.scrollTop = l - w;
  });
  const u = () => {
    i = !1, o.clear(), h = 0;
    try {
      const g = document.querySelector("[data-nimbi-preview-image]");
      g && (g.classList.add("is-panning"), g.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", u), e.addEventListener("pointercancel", u);
}
function bl(e) {
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
  const d = Yo(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  let u = !1, g = !1;
  async function p(y, k) {
    let S, v, C;
    try {
      ({ data: S, pagePath: v, anchor: C } = await Fs(y, s));
    } catch (j) {
      const re = j && j.message ? String(j.message) : "", A = (!oe || typeof oe != "string" || !oe) && /no page data/i.test(re);
      try {
        if (A)
          try {
            _("[nimbi-cms] fetchPageData (expected missing)", j);
          } catch {
          }
        else
          try {
            Wn("[nimbi-cms] fetchPageData failed", j);
          } catch {
          }
      } catch {
      }
      try {
        !oe && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      zi(t, a, j);
      return;
    }
    !C && k && (C = k);
    try {
      Rr(null);
    } catch (j) {
      _("[nimbi-cms] scrollToAnchorOrTop failed", j);
    }
    t.innerHTML = "";
    const { article: Z, parsed: I, toc: ee, topH1: $, h1Text: D, slugKey: ne } = await sl(a, S, v, C, s);
    qs(a, o, I, ee, Z, v, C, $, D, ne, S), n.innerHTML = "", ee && (n.appendChild(ee), hl(ee));
    try {
      await h("transformHtml", { article: Z, parsed: I, toc: ee, pagePath: v, anchor: C, topH1: $, h1Text: D, slugKey: ne, data: S });
    } catch (j) {
      _("[nimbi-cms] transformHtml hooks failed", j);
    }
    t.appendChild(Z);
    try {
      ol(Z);
    } catch (j) {
      _("[nimbi-cms] executeEmbeddedScripts failed", j);
    }
    try {
      yl(Z, { t: a });
    } catch (j) {
      _("[nimbi-cms] attachImagePreview failed", j);
    }
    try {
      On(i, 100, !1), requestAnimationFrame(() => On(i, 100, !1)), setTimeout(() => On(i, 100, !1), 250);
    } catch (j) {
      _("[nimbi-cms] setEagerForAboveFoldImages failed", j);
    }
    Rr(C), dl(Z, $, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await h("onPageLoad", { data: S, pagePath: v, anchor: C, article: Z, toc: ee, topH1: $, h1Text: D, slugKey: ne, contentWrap: t, navWrap: n });
    } catch (j) {
      _("[nimbi-cms] onPageLoad hooks failed", j);
    }
    c = v;
  }
  async function f() {
    if (u) {
      g = !0;
      return;
    }
    u = !0;
    try {
      try {
        qi("renderByQuery");
      } catch {
      }
      try {
        ji("renderByQuery");
      } catch {
      }
      let y = nt(location.href);
      if (y && y.type === "path" && y.page)
        try {
          let v = "?page=" + encodeURIComponent(y.page || "");
          y.params && (v += (v.includes("?") ? "&" : "?") + y.params), y.anchor && (v += "#" + encodeURIComponent(y.anchor));
          try {
            history.replaceState(history.state, "", v);
          } catch {
            try {
              history.replaceState({}, "", v);
            } catch {
            }
          }
          y = nt(location.href);
        } catch {
        }
      const k = y && y.page ? y.page : l, S = y && y.anchor ? y.anchor : null;
      await p(k, S);
    } catch (y) {
      _("[nimbi-cms] renderByQuery failed", y);
      try {
        !oe && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      zi(t, a, y);
    } finally {
      if (u = !1, g) {
        g = !1;
        try {
          await f();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", f);
  const b = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const y = i || document.querySelector(".nimbi-cms");
      if (!y) return;
      const k = {
        top: y.scrollTop || 0,
        left: y.scrollLeft || 0
      };
      sessionStorage.setItem(b(), JSON.stringify(k));
    } catch (y) {
      _("[nimbi-cms] save scroll position failed", y);
    }
  }, w = () => {
    try {
      const y = i || document.querySelector(".nimbi-cms");
      if (!y) return;
      const k = sessionStorage.getItem(b());
      if (!k) return;
      const S = JSON.parse(k);
      S && typeof S.top == "number" && y.scrollTo({ top: S.top, left: S.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (y) => {
    if (y.persisted)
      try {
        w(), On(i, 100, !1);
      } catch (k) {
        _("[nimbi-cms] bfcache restore failed", k);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (y) {
      _("[nimbi-cms] save scroll position failed", y);
    }
  }), { renderByQuery: f, siteNav: d, getCurrentPagePath: () => c };
}
function wl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = nt(window.location.href);
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
function wr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function _l(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let qn = "";
async function Pl(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = wl();
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
      hi(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const $ = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite($) && hi(Math.max(0, Math.min(3, Math.floor($))));
      } catch {
      }
  } catch {
  }
  try {
    Tt("[nimbi-cms] initCMS called", { options: n });
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
    noIndexing: h = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: d = "none",
    lang: u = void 0,
    l10nFile: g = null,
    cacheTtlMinutes: p = 5,
    cacheMaxEntries: f,
    markdownExtensions: b,
    availableLanguages: m,
    homePage: w = null,
    notFoundPage: y = null,
    navigationPage: k = "_navigation.md",
    exposeSitemap: S = !0
  } = n;
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof y == "string" && y.startsWith("./") && (y = y.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: C = !1 } = n, Z = ($) => {
    try {
      const D = document.querySelector(i);
      D && D instanceof Element && (D.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String($)}</pre></div>`);
    } catch {
    }
  };
  if (n.contentPath != null && !_l(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !wr(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (y != null && !wr(y))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !wr(k))
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
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (u != null && typeof u != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (g != null && typeof g != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (p != null && (typeof p != "number" || !Number.isFinite(p) || p < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (f != null && (typeof f != "number" || !Number.isInteger(f) || f < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (b != null && (!Array.isArray(b) || b.some(($) => !$ || typeof $ != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (m != null && (!Array.isArray(m) || m.some(($) => typeof $ != "string" || !$.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (h != null && (!Array.isArray(h) || h.some(($) => typeof $ != "string" || !$.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (C != null && typeof C != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (y != null && (typeof y != "string" || !y.trim() || !/\.(md|html)$/.test(y)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const ee = !!s;
  try {
    Promise.resolve().then(() => lt).then(($) => {
      try {
        $ && typeof $.setSkipRootReadme == "function" && $.setSkipRootReadme(!!C);
      } catch (D) {
        _("[nimbi-cms] setSkipRootReadme failed", D);
      }
    }).catch(($) => {
    });
  } catch ($) {
    _("[nimbi-cms] setSkipRootReadme dynamic import failed", $);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && Ns(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function($) {
        try {
          const D = { type: "error", message: $ && $.message ? String($.message) : "", filename: $ && $.filename ? String($.filename) : "", lineno: $ && $.lineno ? $.lineno : null, colno: $ && $.colno ? $.colno : null, stack: $ && $.error && $.error.stack ? $.error.stack : null, time: Date.now() };
          try {
            _("[nimbi-cms] runtime error", D.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(D);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function($) {
        try {
          const D = { type: "unhandledrejection", reason: $ && $.reason ? String($.reason) : "", time: Date.now() };
          try {
            _("[nimbi-cms] unhandledrejection", D.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(D);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const $ = nt(typeof window < "u" ? window.location.href : ""), D = $ && $.page ? $.page : w || void 0;
      try {
        D && Bs(D, qn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        I.classList.add("nimbi-mount");
      } catch (M) {
        _("[nimbi-cms] mount element setup failed", M);
      }
      const $ = document.createElement("section");
      $.className = "section";
      const D = document.createElement("div");
      D.className = "container nimbi-cms";
      const ne = document.createElement("div");
      ne.className = "columns";
      const j = document.createElement("div");
      j.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", j.setAttribute("role", "navigation");
      try {
        const M = typeof on == "function" ? on("navigation") : null;
        M && j.setAttribute("aria-label", M);
      } catch (M) {
        _("[nimbi-cms] set nav aria-label failed", M);
      }
      ne.appendChild(j);
      const re = document.createElement("main");
      re.className = "column nimbi-content", re.setAttribute("role", "main"), ne.appendChild(re), D.appendChild(ne), $.appendChild(D);
      const A = j, G = re;
      I.appendChild($);
      let ie = null;
      try {
        ie = I.querySelector(".nimbi-overlay"), ie || (ie = document.createElement("div"), ie.className = "nimbi-overlay", I.appendChild(ie));
      } catch (M) {
        ie = null, _("[nimbi-cms] mount overlay setup failed", M);
      }
      const Te = location.pathname || "/";
      let Y;
      if (Te.endsWith("/"))
        Y = Te;
      else {
        const M = Te.substring(Te.lastIndexOf("/") + 1);
        M && !M.includes(".") ? Y = Te + "/" : Y = Te.substring(0, Te.lastIndexOf("/") + 1);
      }
      try {
        qn = document.title || "";
      } catch (M) {
        qn = "", _("[nimbi-cms] read initial document title failed", M);
      }
      let ge = r;
      const Se = Object.prototype.hasOwnProperty.call(n, "contentPath"), $e = typeof location < "u" && location.origin ? location.origin : "http://localhost", Qe = new URL(Y, $e).toString();
      (ge === "." || ge === "./") && (ge = "");
      try {
        ge = String(ge || "").replace(/\\/g, "/");
      } catch {
        ge = String(ge || "");
      }
      ge.startsWith("/") && (ge = ge.replace(/^\/+/, "")), ge && !ge.endsWith("/") && (ge = ge + "/");
      try {
        if (ge && Y && Y !== "/") {
          const M = Y.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          M && ge.startsWith(M) && (ge = ge.slice(M.length));
        }
      } catch {
      }
      try {
        if (ge)
          var ve = new URL(ge, Qe.endsWith("/") ? Qe : Qe + "/").toString();
        else
          var ve = Qe;
      } catch {
        try {
          if (ge) var ve = new URL("/" + ge, $e).toString();
          else var ve = new URL(Y, $e).toString();
        } catch {
          var ve = $e;
        }
      }
      if (g && await Zi(g, Y), m && Array.isArray(m) && Xi(m), u && Gi(u), typeof p == "number" && p >= 0 && typeof ki == "function" && ki(p * 60 * 1e3), typeof f == "number" && f >= 0 && typeof _i == "function" && _i(f), b && Array.isArray(b) && b.length)
        try {
          b.forEach((M) => {
            typeof M == "object" && Aa && typeof Lr == "function" && Lr(M);
          });
        } catch (M) {
          _("[nimbi-cms] applying markdownExtensions failed", M);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => lt).then(({ setDefaultCrawlMaxQueue: M }) => {
          try {
            M(a);
          } catch (L) {
            _("[nimbi-cms] setDefaultCrawlMaxQueue failed", L);
          }
        });
      } catch (M) {
        _("[nimbi-cms] setDefaultCrawlMaxQueue import failed", M);
      }
      try {
        try {
          const M = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (M && typeof M == "object")
            try {
              const L = await Promise.resolve().then(() => lt);
              if (L && typeof L._setAllMd == "function") {
                L._setAllMd(M);
                try {
                  Tt("[nimbi-cms diagnostic] applied content manifest", { manifestKeys: Object.keys(M).length });
                } catch {
                }
              }
            } catch (L) {
              _("[nimbi-cms] applying content manifest failed", L);
            }
          try {
            Br(ve);
          } catch (L) {
            _("[nimbi-cms] setContentBase failed", L);
          }
          try {
            try {
              const L = await Promise.resolve().then(() => lt);
              try {
                Tt("[nimbi-cms diagnostic] after setContentBase", {
                  manifestKeys: M && typeof M == "object" ? Object.keys(M).length : 0,
                  slugToMdSize: L && L.slugToMd && typeof L.slugToMd.size == "number" ? L.slugToMd.size : void 0,
                  allMarkdownPathsLength: L && Array.isArray(L.allMarkdownPaths) ? L.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: L && L.allMarkdownPathsSet && typeof L.allMarkdownPathsSet.size == "number" ? L.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: L && Array.isArray(L.searchIndex) ? L.searchIndex.length : void 0
                });
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (M) {
        _("[nimbi-cms] setContentBase failed", M);
      }
      try {
        Yi(y);
      } catch (M) {
        _("[nimbi-cms] setNotFoundPage failed", M);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => wn).then((M) => {
          try {
            M && typeof M.attachSitemapDownloadUI == "function" && M.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let rt = null, R = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k)
          try {
            const T = [], O = [];
            try {
              k && O.push(String(k));
            } catch {
            }
            try {
              const P = String(k || "").replace(/^_/, "");
              P && P !== String(k) && O.push(P);
            } catch {
            }
            try {
              O.push("navigation.md");
            } catch {
            }
            try {
              O.push("assets/navigation.md");
            } catch {
            }
            const W = [];
            for (const P of O)
              try {
                if (!P) continue;
                const B = String(P);
                W.includes(B) || W.push(B);
              } catch {
              }
            for (const P of W) {
              T.push(P);
              try {
                if (R = await Me(P, ve, { force: !0 }), R && R.raw) {
                  try {
                    k = P;
                  } catch {
                  }
                  try {
                    _("[nimbi-cms] fetched navigation candidate", P, "contentBase=", ve);
                  } catch {
                  }
                  rt = await En(R.raw || "");
                  try {
                    const B = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (B && rt && rt.html) {
                      const q = B.parseFromString(rt.html, "text/html").querySelector("a");
                      if (q)
                        try {
                          const Q = q.getAttribute("href") || "", U = nt(Q);
                          try {
                            _("[nimbi-cms] parsed nav first-link href", Q, "->", U);
                          } catch {
                          }
                          if (U && U.page && (U.type === "path" || U.type === "canonical" && (U.page.includes(".") || U.page.includes("/")))) {
                            w = U.page;
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
          Ji(w);
        } catch (T) {
          _("[nimbi-cms] setHomePage failed", T);
        }
        let L = !0;
        try {
          const T = nt(typeof location < "u" ? location.href : "");
          T && T.type === "cosmetic" && (typeof y > "u" || y == null) && (L = !1);
        } catch {
        }
        if (L && w)
          try {
            await Me(w, ve, { force: !0 });
          } catch (T) {
            throw new Error(`Required ${w} not found at ${ve}${w}: ${T && T.message ? T.message : String(T)}`);
          }
      } catch (M) {
        throw M;
      }
      ls(c), await os(d, Y);
      const N = bl({ contentWrap: G, navWrap: A, container: D, mountOverlay: ie, t: on, contentBase: ve, homePage: w, initialDocumentTitle: qn, runHooks: di });
      try {
        const M = document.createElement("header");
        M.className = "nimbi-site-navbar", I.insertBefore(M, $);
        let L = R, T = rt;
        T || (L = await Me(k, ve, { force: !0 }), T = await En(L.raw || ""));
        const { navbar: O, linkEls: W } = await pl(M, D, T.html || "", ve, w, on, N.renderByQuery, ee, l, o, h, v);
        try {
          await di("onNavBuild", { navWrap: A, navbar: O, linkEls: W, contentBase: ve });
        } catch (P) {
          _("[nimbi-cms] onNavBuild hooks failed", P);
        }
        try {
          try {
            if (W && W.length) {
              const P = await Promise.resolve().then(() => lt);
              for (const B of Array.from(W || []))
                try {
                  const E = B && B.getAttribute && B.getAttribute("href") || "";
                  if (!E) continue;
                  let q = String(E || "").split(/::|#/, 1)[0];
                  if (q = String(q || "").split("?")[0], !q) continue;
                  /\.(?:md|html?)$/.test(q) || (q = q + ".html");
                  let Q = null;
                  try {
                    Q = K(String(q || ""));
                  } catch {
                    Q = String(q || "");
                  }
                  const U = String(Q || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!U) continue;
                  try {
                    let pe = null;
                    try {
                      P && typeof P.slugify == "function" && (pe = P.slugify(U.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      pe = String(U || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!pe) continue;
                    let Re = pe;
                    try {
                      if (P && P.slugToMd && typeof P.slugToMd.has == "function" && P.slugToMd.has(pe)) {
                        const ye = P.slugToMd.get(pe);
                        let fe = !1;
                        try {
                          if (typeof ye == "string")
                            ye === q && (fe = !0);
                          else if (ye && typeof ye == "object") {
                            ye.default === q && (fe = !0);
                            for (const Ae of Object.keys(ye.langs || {}))
                              if (ye.langs[Ae] === q) {
                                fe = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!fe && typeof P.uniqueSlug == "function")
                          try {
                            Re = P.uniqueSlug(pe, new Set(P.slugToMd.keys()));
                          } catch {
                            Re = pe;
                          }
                      }
                    } catch {
                    }
                    try {
                      if (P && typeof P._storeSlugMapping == "function")
                        try {
                          P._storeSlugMapping(Re, Q);
                        } catch {
                        }
                      else if (P && P.slugToMd && typeof P.slugToMd.set == "function")
                        try {
                          P.slugToMd.set(Re, Q);
                        } catch {
                        }
                      try {
                        P && P.mdToSlug && typeof P.mdToSlug.set == "function" && P.mdToSlug.set(Q, Re);
                      } catch {
                      }
                      try {
                        P && Array.isArray(P.allMarkdownPaths) && !P.allMarkdownPaths.includes(Q) && P.allMarkdownPaths.push(Q);
                      } catch {
                      }
                      try {
                        P && P.allMarkdownPathsSet && typeof P.allMarkdownPathsSet.add == "function" && P.allMarkdownPathsSet.add(Q);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const B = await Promise.resolve().then(() => fr);
                B && typeof B.refreshIndexPaths == "function" && B.refreshIndexPaths(ve);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let P = !1;
          try {
            const B = new URLSearchParams(location.search || "");
            (B.has("sitemap") || B.has("rss") || B.has("atom")) && (P = !0);
          } catch {
          }
          try {
            const E = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            E && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(E) && (P = !0);
          } catch {
          }
          if (P || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const E = await Promise.resolve().then(() => lt);
                if (E && typeof E.awaitSearchIndex == "function") {
                  const q = [];
                  w && q.push(w), k && q.push(k);
                  try {
                    await E.awaitSearchIndex({ contentBase: ve, indexDepth: Math.max(o || 1, 3), noIndexing: h, seedPaths: q.length ? q : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const B = await Promise.resolve().then(() => wn);
              try {
                if (B && typeof B.handleSitemapRequest == "function" && await B.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: y, contentBase: ve, indexDepth: o, noIndexing: h }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => wn).then((B) => {
              try {
                if (B && typeof B.exposeSitemapGlobals == "function")
                  try {
                    B.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: y, contentBase: ve, indexDepth: o, noIndexing: h, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const B = await Promise.resolve().then(() => fr);
            if (B && typeof B.refreshIndexPaths == "function")
              try {
                B.refreshIndexPaths(ve);
                try {
                  try {
                    const E = await Promise.resolve().then(() => lt);
                    try {
                      Tt("[nimbi-cms diagnostic] after refreshIndexPaths", { slugToMdSize: E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : void 0, allMarkdownPathsLength: E && Array.isArray(E.allMarkdownPaths) ? E.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: E && E.allMarkdownPathsSet && typeof E.allMarkdownPathsSet.size == "number" ? E.allMarkdownPathsSet.size : void 0 });
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const E = await Promise.resolve().then(() => lt), q = E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : 0;
                  let Q = !1;
                  try {
                    if (!manifest) {
                      q < 30 && (Q = !0);
                      try {
                        const U = nt(typeof location < "u" ? location.href : "");
                        if (U) {
                          if (U.type === "cosmetic" && U.page)
                            try {
                              E.slugToMd.has(U.page) || (Q = !0);
                            } catch {
                            }
                          else if ((U.type === "path" || U.type === "canonical") && U.page)
                            try {
                              const pe = K(U.page);
                              !(E.mdToSlug && E.mdToSlug.has(pe)) && !(E.allMarkdownPathsSet && E.allMarkdownPathsSet.has(pe)) && (Q = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Q) {
                    let U = null;
                    try {
                      U = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      U = null;
                    }
                    if (Array.isArray(U) && U.length) {
                      let pe = 0;
                      for (const Re of U)
                        try {
                          if (!Re || !Re.slug) continue;
                          const ye = String(Re.slug).split("::")[0];
                          if (E.slugToMd.has(ye)) continue;
                          let fe = Re.sourcePath || Re.path || null;
                          if (!fe && Array.isArray(U)) {
                            const Ze = (U || []).find((qe) => qe && qe.slug === Re.slug);
                            Ze && Ze.path && (fe = Ze.path);
                          }
                          if (!fe) continue;
                          try {
                            fe = String(fe);
                          } catch {
                            continue;
                          }
                          let Ae = null;
                          try {
                            const Ze = ve && typeof ve == "string" ? ve : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const qe = new URL(fe, Ze), mt = new URL(Ze);
                              if (qe.origin === mt.origin) {
                                const en = mt.pathname || "/";
                                let St = qe.pathname || "";
                                St.startsWith(en) && (St = St.slice(en.length)), St.startsWith("/") && (St = St.slice(1)), Ae = K(St);
                              } else
                                Ae = K(qe.pathname || "");
                            } catch {
                              Ae = K(fe);
                            }
                          } catch {
                            Ae = K(fe);
                          }
                          if (!Ae) continue;
                          Ae = String(Ae).split(/[?#]/)[0], Ae = K(Ae);
                          try {
                            E._storeSlugMapping(ye, Ae);
                          } catch {
                          }
                          pe++;
                        } catch {
                        }
                      if (pe) {
                        try {
                          Tt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", { added: pe, total: E && E.slugToMd && typeof E.slugToMd.size == "number" ? E.slugToMd.size : void 0 });
                        } catch {
                        }
                        try {
                          const Re = await Promise.resolve().then(() => fr);
                          Re && typeof Re.refreshIndexPaths == "function" && Re.refreshIndexPaths(ve);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (E) {
                _("[nimbi-cms] refreshIndexPaths after nav build failed", E);
              }
          } catch {
          }
          const P = () => {
            const B = M && M.getBoundingClientRect && Math.round(M.getBoundingClientRect().height) || M && M.offsetHeight || 0;
            if (B > 0) {
              try {
                I.style.setProperty("--nimbi-site-navbar-height", `${B}px`);
              } catch (E) {
                _("[nimbi-cms] set CSS var failed", E);
              }
              try {
                D.style.paddingTop = "";
              } catch (E) {
                _("[nimbi-cms] set container paddingTop failed", E);
              }
              try {
                const E = I && I.getBoundingClientRect && Math.round(I.getBoundingClientRect().height) || I && I.clientHeight || 0;
                if (E > 0) {
                  const q = Math.max(0, E - B);
                  try {
                    D.style.setProperty("--nimbi-cms-height", `${q}px`);
                  } catch (Q) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", Q);
                  }
                } else
                  try {
                    D.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (q) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", q);
                  }
              } catch (E) {
                _("[nimbi-cms] compute container height failed", E);
              }
              try {
                M.style.setProperty("--nimbi-site-navbar-height", `${B}px`);
              } catch (E) {
                _("[nimbi-cms] set navbar CSS var failed", E);
              }
            }
          };
          P();
          try {
            if (typeof ResizeObserver < "u") {
              const B = new ResizeObserver(() => P());
              try {
                B.observe(M);
              } catch (E) {
                _("[nimbi-cms] ResizeObserver.observe failed", E);
              }
            }
          } catch (B) {
            _("[nimbi-cms] ResizeObserver setup failed", B);
          }
        } catch (P) {
          _("[nimbi-cms] compute navbar height failed", P);
        }
      } catch (M) {
        _("[nimbi-cms] build navigation failed", M);
      }
      await N.renderByQuery();
      try {
        Promise.resolve().then(() => xl).then(({ getVersion: M }) => {
          typeof M == "function" && M().then((L) => {
            try {
              const T = L || "0.0.0";
              try {
                const O = (B) => {
                  const E = document.createElement("a");
                  E.className = "nimbi-version-label tag is-small", E.textContent = `nimbiCMS v. ${T}`, E.href = B || "#", E.target = "_blank", E.rel = "noopener noreferrer nofollow", E.setAttribute("aria-label", `nimbiCMS version ${T}`);
                  try {
                    Fi(E);
                  } catch {
                  }
                  try {
                    I.appendChild(E);
                  } catch (q) {
                    _("[nimbi-cms] append version label failed", q);
                  }
                }, W = "https://abelvm.github.io/nimbiCMS/", P = (() => {
                  try {
                    if (W && typeof W == "string")
                      return new URL(W).toString();
                  } catch {
                  }
                  return "#";
                })();
                O(P);
              } catch (O) {
                _("[nimbi-cms] building version label failed", O);
              }
            } catch (T) {
              _("[nimbi-cms] building version label failed", T);
            }
          }).catch((L) => {
            _("[nimbi-cms] getVersion() failed", L);
          });
        }).catch((M) => {
          _("[nimbi-cms] import version module failed", M);
        });
      } catch (M) {
        _("[nimbi-cms] version label setup failed", M);
      }
    })();
  } catch ($) {
    throw Z($), $;
  }
}
async function kl() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const xl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: kl
}, Symbol.toStringTag, { value: "Module" })), Ve = $t, sn = _;
function Kr() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function He(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Oi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function Sl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = K(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Vr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Kr().split("?")[0];
  let o = Array.isArray(te) && te.length ? te : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(te) && te.length) {
    const m = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && m.set(String(w.slug), w);
        } catch {
        }
      for (const w of te)
        try {
          w && w.slug && m.set(String(w.slug), w);
        } catch {
        }
    } catch {
    }
    o = Array.from(m.values());
  }
  const h = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && h.add(K(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && h.add(K(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const m = K(String(a));
      try {
        if (H && typeof H.has == "function" && H.has(m))
          try {
            c.add(H.get(m));
          } catch {
          }
        else
          try {
            const w = await Me(m, e && e.contentBase ? e.contentBase : void 0);
            if (w && w.raw)
              try {
                let y = null;
                if (w.isHtml)
                  try {
                    const S = new DOMParser().parseFromString(w.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (y = v.textContent.trim());
                  } catch {
                  }
                else {
                  const k = (w.raw || "").match(/^#\s+(.+)$/m);
                  k && k[1] && (y = k[1].trim());
                }
                y && c.add(ue(y));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const d = /* @__PURE__ */ new Set(), u = [], g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = (m) => {
    try {
      if (!m || typeof m != "string") return !1;
      const w = K(String(m));
      try {
        if (Pe && typeof Pe.has == "function" && Pe.has(w)) return !0;
      } catch {
      }
      try {
        if (H && typeof H.has == "function" && H.has(w)) return !0;
      } catch {
      }
      try {
        if (p && p.has(w)) return !0;
      } catch {
      }
      try {
        if (H && typeof H.keys == "function" && H.size)
          for (const y of H.keys())
            try {
              if (K(String(y)) === w) return !0;
            } catch {
            }
        else
          for (const y of V.values())
            try {
              if (!y) continue;
              if (typeof y == "string") {
                if (K(String(y)) === w) return !0;
              } else if (y && typeof y == "object") {
                if (y.default && K(String(y.default)) === w) return !0;
                const k = y.langs || {};
                for (const S of Object.keys(k || {}))
                  try {
                    if (k[S] && K(String(k[S])) === w) return !0;
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
    for (const m of o)
      try {
        if (!m || !m.slug) continue;
        const w = String(m.slug), y = String(w).split("::")[0];
        if (c.has(y)) continue;
        const k = m.path ? K(String(m.path)) : null;
        if (k && h.has(k)) continue;
        const S = m.title ? String(m.title) : m.parentTitle ? String(m.parentTitle) : void 0;
        g.set(w, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, path: k, source: "index" }), k && p.set(k, { title: S || void 0, excerpt: m.excerpt ? String(m.excerpt) : void 0, slug: w });
        const v = Sl(l, m);
        if (!v || !v.slug || d.has(v.slug)) continue;
        if (d.add(v.slug), g.has(v.slug)) {
          const C = g.get(v.slug);
          C && C.title && (v.title = C.title, v._titleSource = "index"), C && C.excerpt && (v.excerpt = C.excerpt);
        }
        u.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [m, w] of V.entries())
        try {
          if (!m) continue;
          const y = String(m).split("::")[0];
          if (d.has(m) || c.has(y)) continue;
          let k = null;
          if (typeof w == "string" ? k = K(String(w)) : w && typeof w == "object" && (k = K(String(w.default || ""))), k && h.has(k)) continue;
          const v = { loc: l + "?page=" + encodeURIComponent(m), slug: m };
          if (g.has(m)) {
            const C = g.get(m);
            C && C.title && (v.title = C.title, v._titleSource = "index"), C && C.excerpt && (v.excerpt = C.excerpt);
          } else if (k) {
            const C = p.get(k);
            C && C.title && (v.title = C.title, v._titleSource = "path", !v.excerpt && C.excerpt && (v.excerpt = C.excerpt));
          }
          if (d.add(m), typeof m == "string") {
            const C = m.indexOf("/") !== -1 || /\.(md|html?)$/i.test(m), Z = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || Z || C) && (v.title = Oi(m), v._titleSource = "humanize");
          }
          u.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const m = K(String(i));
          let w = null;
          try {
            H && H.has(m) && (w = H.get(m));
          } catch {
          }
          w || (w = m);
          const y = String(w).split("::")[0];
          if (!d.has(w) && !h.has(m) && !c.has(y)) {
            const k = { loc: l + "?page=" + encodeURIComponent(w), slug: w };
            if (g.has(w)) {
              const S = g.get(w);
              S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt);
            }
            d.add(w), u.push(k);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const m = /* @__PURE__ */ new Set(), w = new Set(u.map((v) => String(v && v.slug ? v.slug : ""))), y = /* @__PURE__ */ new Set();
    for (const v of u)
      try {
        v && v.sourcePath && y.add(String(v.sourcePath));
      } catch {
      }
    const k = 30;
    let S = 0;
    for (const v of y) {
      if (S >= k) break;
      try {
        if (!v || typeof v != "string" || !f(v)) continue;
        S += 1;
        const C = await Me(v, e && e.contentBase ? e.contentBase : void 0);
        if (!C || !C.raw || C && typeof C.status == "number" && C.status === 404) continue;
        const Z = C.raw, I = (function(j) {
          try {
            return String(j || "");
          } catch {
            return "";
          }
        })(Z), ee = [], $ = /\[[^\]]+\]\(([^)]+)\)/g;
        let D;
        for (; D = $.exec(I); )
          try {
            D && D[1] && ee.push(D[1]);
          } catch {
          }
        const ne = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; D = ne.exec(I); )
          try {
            D && D[1] && ee.push(D[1]);
          } catch {
          }
        for (const j of ee)
          try {
            if (!j) continue;
            if (j.indexOf("?") !== -1 || j.indexOf("=") !== -1)
              try {
                const G = new URL(j, l).searchParams.get("page");
                if (G) {
                  const ie = String(G);
                  !w.has(ie) && !m.has(ie) && (m.add(ie), u.push({ loc: l + "?page=" + encodeURIComponent(ie), slug: ie }));
                  continue;
                }
              } catch {
              }
            let re = String(j).split(/[?#]/)[0];
            if (re = re.replace(/^\.\//, "").replace(/^\//, ""), !re || !/\.(md|html?)$/i.test(re)) continue;
            try {
              const A = K(re);
              if (H && H.has(A)) {
                const G = H.get(A), ie = String(G).split("::")[0];
                G && !w.has(G) && !m.has(G) && !c.has(ie) && !h.has(A) && (m.add(G), u.push({ loc: l + "?page=" + encodeURIComponent(G), slug: G, sourcePath: A }));
                continue;
              }
              try {
                if (!f(A)) continue;
                const G = await Me(A, e && e.contentBase ? e.contentBase : void 0);
                if (G && typeof G.status == "number" && G.status === 404) continue;
                if (G && G.raw) {
                  const ie = (G.raw || "").match(/^#\s+(.+)$/m), Te = ie && ie[1] ? ie[1].trim() : "", Y = ue(Te || A), ge = String(Y).split("::")[0];
                  Y && !w.has(Y) && !m.has(Y) && !c.has(ge) && (m.add(Y), u.push({ loc: l + "?page=" + encodeURIComponent(Y), slug: Y, sourcePath: A, title: Te || void 0 }));
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
    const m = /* @__PURE__ */ new Map();
    for (const y of u)
      try {
        if (!y || !y.slug) continue;
        m.set(String(y.slug), y);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const y of u)
      try {
        if (!y || !y.slug) continue;
        const k = String(y.slug), S = k.split("::")[0];
        if (!S) continue;
        k !== S && !m.has(S) && w.add(S);
      } catch {
      }
    for (const y of w)
      try {
        let k = null;
        if (g.has(y)) {
          const S = g.get(y);
          k = { loc: l + "?page=" + encodeURIComponent(y), slug: y }, S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt), S && S.path && (k.sourcePath = S.path);
        } else if (p && V && V.has(y)) {
          const S = V.get(y);
          let v = null;
          if (typeof S == "string" ? v = K(String(S)) : S && typeof S == "object" && (v = K(String(S.default || ""))), k = { loc: l + "?page=" + encodeURIComponent(y), slug: y }, v && p.has(v)) {
            const C = p.get(v);
            C && C.title && (k.title = C.title, k._titleSource = "path"), C && C.excerpt && (k.excerpt = C.excerpt), k.sourcePath = v;
          }
        }
        k || (k = { loc: l + "?page=" + encodeURIComponent(y), slug: y, title: Oi(y) }, k._titleSource = "humanize"), m.has(y) || (u.push(k), m.set(y, k));
      } catch {
      }
  } catch {
  }
  const b = [];
  try {
    const m = /* @__PURE__ */ new Set();
    for (const w of u)
      try {
        if (!w || !w.slug) continue;
        const y = String(w.slug), k = String(y).split("::")[0];
        if (c.has(k) || y.indexOf("::") !== -1 || m.has(y)) continue;
        m.add(y), b.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Ve("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(b.map((m) => ({ slug: m.slug, title: m.title, titleSource: m._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let w = 0;
    const y = b.length, k = Array.from({ length: Math.min(4, y) }).map(async () => {
      for (; ; ) {
        const S = w++;
        if (S >= y) break;
        const v = b[S];
        try {
          if (!v || !v.slug) continue;
          const C = String(v.slug).split("::")[0];
          if (c.has(C) || v._titleSource === "index") continue;
          let Z = null;
          try {
            if (V && V.has(v.slug)) {
              const I = V.get(v.slug);
              typeof I == "string" ? Z = K(String(I)) : I && typeof I == "object" && (Z = K(String(I.default || "")));
            }
            !Z && v.sourcePath && (Z = v.sourcePath);
          } catch {
            continue;
          }
          if (!Z || h.has(Z) || !f(Z)) continue;
          try {
            const I = await Me(Z, e && e.contentBase ? e.contentBase : void 0);
            if (!I || !I.raw || I && typeof I.status == "number" && I.status === 404) continue;
            if (I && I.raw) {
              const ee = (I.raw || "").match(/^#\s+(.+)$/m), $ = ee && ee[1] ? ee[1].trim() : "";
              $ && (v.title = $, v._titleSource = "fetched");
            }
          } catch (I) {
            Ve("[runtimeSitemap] fetch title failed for", Z, I);
          }
        } catch (C) {
          Ve("[runtimeSitemap] worker loop failure", C);
        }
      }
    });
    await Promise.all(k);
  } catch (m) {
    Ve("[runtimeSitemap] title enrichment failed", m);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: b };
}
function Cr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${He(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function Pr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Kr().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${He("Sitemap RSS")}</title>
`, i += `<link>${He(n)}</link>
`, i += `<description>${He("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${He(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${He(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${He(String(r.excerpt))}</description>
`), i += `<link>${He(a)}</link>
`, i += `<guid>${He(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function $r(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Kr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${He("Sitemap Atom")}</title>
`, r += `<link href="${He(n)}" />
`, r += `<updated>${He(i)}</updated>
`, r += `<id>${He(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${He(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${He(String(a.excerpt))}</summary>
`), r += `<link href="${He(s)}" />
`, r += `<id>${He(s)}</id>
`, r += `<updated>${He(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Ni(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + He(e) + "</pre>";
    } catch {
    }
  }
}
function Bi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${He(String(i && i.loc ? i.loc : ""))}">${He(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function jn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = Pr(e) : t === "application/atom+xml" ? i = $r(e) : t === "text/html" ? i = Bi(e) : i = Cr(e), Ni(i, t);
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
          r.mimeType === "application/rss+xml" ? a = Pr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = $r(r.finalJson) : r.mimeType === "text/html" ? a = Bi(r.finalJson) : a = Cr(r.finalJson);
          try {
            Ni(a, r.mimeType);
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
async function vl(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const c = new URLSearchParams(location.search || "");
      if (c.has("sitemap")) {
        let d = !0;
        for (const u of c.keys()) u !== "sitemap" && (d = !1);
        d && (t = !0);
      }
      if (c.has("rss")) {
        let d = !0;
        for (const u of c.keys()) u !== "rss" && (d = !1);
        d && (n = !0);
      }
      if (c.has("atom")) {
        let d = !0;
        for (const u of c.keys()) u !== "atom" && (d = !1);
        d && (i = !0);
      }
    } catch {
    }
    if (!t && !n && !i) {
      const d = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!d || (t = /^(sitemap|sitemap\.xml)$/i.test(d), n = /^(rss|rss\.xml)$/i.test(d), i = /^(atom|atom\.xml)$/i.test(d), r = /^(sitemap|sitemap\.html)$/i.test(d), !t && !n && !i && !r)) return !1;
    }
    let a = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof Pt == "function")
        try {
          const c = await Pt({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(c) && c.length)
            if (Array.isArray(e.index) && e.index.length) {
              const d = /* @__PURE__ */ new Map();
              try {
                for (const u of e.index)
                  try {
                    u && u.slug && d.set(String(u.slug), u);
                  } catch {
                  }
                for (const u of c)
                  try {
                    u && u.slug && d.set(String(u.slug), u);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(d.values());
            } else
              a = c;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
        }
      else
        a = Array.isArray(te) && te.length ? te : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(te) && te.length ? te : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const c = /* @__PURE__ */ new Map();
          for (const d of e.index)
            try {
              if (!d || !d.slug) continue;
              const u = String(d.slug).split("::")[0];
              if (!c.has(u)) c.set(u, d);
              else {
                const g = c.get(u);
                g && String(g.slug || "").indexOf("::") !== -1 && String(d.slug || "").indexOf("::") === -1 && c.set(u, d);
              }
            } catch {
            }
          try {
            Ve("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            Ve("[runtimeSitemap] providedIndex.dedupedByBase (count):", c.size);
          }
        } catch (c) {
          sn("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof qt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let d = null;
        try {
          typeof Pt == "function" && (d = await Pt({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          d = null;
        }
        if (Array.isArray(d) && d.length)
          a = d;
        else {
          const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, g = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, p = [];
          e && e.homePage && p.push(e.homePage), e && e.navigationPage && p.push(e.navigationPage), a = await qt(e && e.contentBase ? e.contentBase : void 0, u, g, p.length ? p : void 0);
        }
      } catch (c) {
        sn("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(te) && te.length ? te : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ve("[runtimeSitemap] usedIndex.full.length (before rebuild):", c);
      } catch {
      }
      try {
        Ve("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const c = [];
      e && e.homePage && c.push(e.homePage), e && e.navigationPage && c.push(e.navigationPage);
      const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, u = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let g = null;
      try {
        const p = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof p == "function")
          try {
            g = await p(e && e.contentBase ? e.contentBase : void 0, d, u);
          } catch {
            g = null;
          }
      } catch {
        g = null;
      }
      if ((!g || !g.length) && typeof qt == "function")
        try {
          g = await qt(e && e.contentBase ? e.contentBase : void 0, d, u, c.length ? c : void 0);
        } catch {
          g = null;
        }
      if (Array.isArray(g) && g.length) {
        const p = /* @__PURE__ */ new Map();
        try {
          for (const f of a)
            try {
              f && f.slug && p.set(String(f.slug), f);
            } catch {
            }
          for (const f of g)
            try {
              f && f.slug && p.set(String(f.slug), f);
            } catch {
            }
        } catch {
        }
        a = Array.from(p.values());
      }
    } catch (c) {
      try {
        sn("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        Ve("[runtimeSitemap] usedIndex.full.length (after rebuild):", c);
      } catch {
      }
      try {
        Ve("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await Vr(Object.assign({}, e, { index: a }));
    let o = [];
    try {
      const c = /* @__PURE__ */ new Set(), d = Array.isArray(l && l.entries) ? l.entries : [];
      for (const u of d)
        try {
          let g = null;
          if (u && u.slug) g = String(u.slug);
          else if (u && u.loc)
            try {
              g = new URL(String(u.loc)).searchParams.get("page");
            } catch {
            }
          if (!g) continue;
          const p = String(g).split("::")[0];
          if (!c.has(p)) {
            c.add(p);
            const f = Object.assign({}, u);
            f.baseSlug = p, o.push(f);
          }
        } catch {
        }
      try {
        Ve("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(o, null, 2));
      } catch {
        Ve("[runtimeSitemap] finalEntries.dedupedByBase (count):", o.length);
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
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return jn(h, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return jn(h, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(h && h.entries) ? h.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > c) {
        try {
          Ve("[runtimeSitemap] skip XML write: existing rendered sitemap larger", d, c);
        } catch {
        }
        return !0;
      }
      return jn(h, "application/xml"), !0;
    }
    if (r)
      try {
        const d = (Array.isArray(h && h.entries) ? h.entries : []).length;
        let u = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (u > d) {
          try {
            Ve("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", u, d);
          } catch {
          }
          return !0;
        }
        return jn(h, "text/html"), !0;
      } catch (c) {
        return sn("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return sn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function Al(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Pt == "function")
        try {
          const s = await Pt({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(te) && te.length && (n = te), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Vr(Object.assign({}, e, { index: n }));
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
            const d = Object.assign({}, o);
            d.baseSlug = c, r.push(d);
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
const wn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: Al,
  generateAtomXml: $r,
  generateRssXml: Pr,
  generateSitemapJson: Vr,
  generateSitemapXml: Cr,
  handleSitemapRequest: vl
}, Symbol.toStringTag, { value: "Module" }));
export {
  Hi as BAD_LANGUAGES,
  xe as SUPPORTED_HLJS_MAP,
  Tl as _clearHooks,
  Ir as addHook,
  Pl as default,
  os as ensureBulma,
  kl as getVersion,
  Pl as initCMS,
  Zi as loadL10nFile,
  Ui as loadSupportedLanguages,
  as as observeCodeBlocks,
  Ml as onNavBuild,
  El as onPageLoad,
  kn as registerLanguage,
  di as runHooks,
  Rl as setHighlightTheme,
  Gi as setLang,
  ls as setStyle,
  Cl as setThemeVars,
  on as t,
  Ll as transformHtml
};
